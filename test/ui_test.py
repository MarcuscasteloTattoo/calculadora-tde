"""Teste de interface: abre a página em Chromium headless, exercita os testes obrigatórios do documento e salva capturas + operações do PDF."""
import json, sys, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'out')
OUT.mkdir(parents=True, exist_ok=True)
PAGE = (ROOT / 'index.html').as_uri()
MOCK = (ROOT / 'test' / 'mock-jspdf.js').read_text()

fails = []
def check(cond, msg):
    print(('OK   ' if cond else 'FAIL ') + msg)
    if not cond: fails.append(msg)

def model(p): return p.evaluate('() => JSON.parse(JSON.stringify(window.__tde.model))')
def typ(p, sel, val): p.fill(sel, ''); p.type(sel, val)
def setup(page):
    page.route('**/jspdf.umd.min.js', lambda r: r.fulfill(body=MOCK, content_type='application/javascript'))
    page.route('https://fonts.googleapis.com/**', lambda r: r.abort())

with sync_playwright() as pw:
    b = pw.chromium.launch()
    ctx = b.new_context(viewport={'width': 1440, 'height': 1000})
    p = ctx.new_page()
    errors = []
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'ERR_' not in m.text else None)
    setup(p)
    # instalação antiga (Castelo) salva no navegador: deve migrar sem quebrar
    p.goto(PAGE)
    p.evaluate("""() => { localStorage.clear(); localStorage.setItem('castelo-roi:config:v1', JSON.stringify({version:1, scenarios:[{id:'conservador',cpl:18,closeRate:0.6}], financial:{agencyFee:0}, levers:[{id:'social',salesPerMonth:1,maturationMonths:3}]}));
      localStorage.setItem('castelo-roi:sim:v1', JSON.stringify({name:'Prospect Antigo', investment:1500, ticket:1500, scenarioId:'conservador', mode:'standard'})); }""")
    p.reload(); p.wait_for_timeout(400)
    m = model(p)
    check(m['scenario']['id'] == 'moderado' and m['ticket'] == 1450 and p.input_value('#in-name') == 'Prospect Antigo', 'migração: Moderado, ticket oficial e nome do prospect preservado')

    # cenários oficiais
    exp = {'conservador': (9, 13050), 'moderado': (14, 20300), 'agressivo': (21, 30450)}
    for sid, (sales, rev) in exp.items():
        p.click('#scen-' + sid); m = model(p)
        check(m['funnel']['leads'] == 149 and m['funnel']['qualified'] == 45 and m['funnel']['sales'] == sales and m['financial']['adRevenue'] == rev, f'{sid}: 149 → 45 → {sales} vendas → R$ {rev}')
    check('30.450,00' in p.inner_text('#funnel'), 'funil mostra o faturamento do cenário')
    p.click('#scen-moderado'); m = model(p)
    f = m['funnel']
    check(f['followers'] == 407 and f['followersDirect'] == 333 and f['followersIndirect'] == 74, 'seguidores 333 + 74 = 407')
    check('407' in p.inner_text('#audience'), 'card de audiência mostra 407')
    check(f['followersBudget'] == 450 and f['contactsBudget'] == 1050, 'distribuição R$ 450 / R$ 1.050')

    # comparativo
    c = m['compare']
    check(c['base']['funnel']['leads'] == 84 and c['base']['funnel']['qualified'] == 17 and c['base']['funnel']['sales'] == 3 and c['base']['fin']['adRevenue'] == 4350, 'Sem TDE: 84 → 17 → 3 → R$ 4.350')
    check(c['extraLeads'] == 65 and c['extraSales'] == 11 and c['incrementalRevenue'] == 15950 and abs(c['cplReductionPct'] - 40) < 1e-9, 'diferenças: +65 leads, +11 vendas, +R$ 15.950, CPL −40%')
    kp = p.inner_text('#cmp-kpis')
    check('+140%' in kp and '5,6 p.p.' in kp, 'ganho de eficiência +140% (+5,6 p.p.)')
    p.click('#scen-agressivo'); m = model(p)
    check(m['compare']['improved']['funnel']['sales'] == 21 and m['compare']['base']['funnel']['sales'] == 3 and 'Agressivo' in p.inner_text('#cmp'), 'Com TDE acompanha o cenário; Sem TDE fixo')
    p.click('#scen-moderado')

    # investimento, ticket, distribuição
    typ(p, '#in-investment', '3000'); m = model(p)
    check(m['funnel']['contactsBudget'] == 2100 and m['compare']['base']['funnel']['investment'] == 3000, 'investimento recalcula os dois lados')
    typ(p, '#in-investment', '1500')
    typ(p, '#in-ticket', '2.000'); m = model(p)
    check(m['financial']['adRevenue'] == m['funnel']['sales'] * 2000 and m['compare']['base']['fin']['adRevenue'] == 3 * 2000, 'ticket recalcula os dois faturamentos')
    typ(p, '#in-ticket', '1450'); p.locator('#in-ticket').blur()
    typ(p, '#in-share-followers', '50'); m = model(p)
    check(m['funnel']['followersBudget'] == 750 and p.input_value('#in-share-contacts') == '50', 'verba de seguidores 50% ajusta contatos para 50%')
    typ(p, '#in-share-contacts', '70'); p.locator('#in-share-contacts').blur(); m = model(p)
    check(abs(m['funnel']['followersShare'] - 0.3) < 1e-9 and p.input_value('#in-share-followers') == '30', 'contatos 70% volta seguidores para 30%')
    typ(p, '#in-share-followers', '120'); check('100%' in p.inner_text('#err-share-followers'), 'percentual acima de 100% bloqueado')
    typ(p, '#in-share-followers', '30'); p.locator('#in-share-followers').blur()

    # conversas adicionais e seguidores indiretos
    p.click('#sw-extra'); m = model(p)
    check(m['funnel']['leads'] == 140, 'desativar conversas da captação: 140 leads')
    p.click('#sw-extra'); m = model(p); check(m['funnel']['leads'] == 149, 'reativar: 149 leads')
    p.click('#sw-indirect'); m = model(p); check(m['funnel']['followers'] == 333, 'sem seguidores adicionais: 333')
    p.click('#sw-indirect')

    # configurações: CPL, qualificação, fechamento, Sem TDE, persistência
    p.click('#btn-settings'); p.click('#tab-aquisicao')
    typ(p, '#cfg-acquisition-cpl', '10'); m = model(p)
    check(m['funnel']['contactLeads'] == 105, 'CPL R$ 10 → 105 leads de contatos (imediato)')
    p.click('#tab-comercial')
    typ(p, '#cfg-commercial-qualificationRate', '40'); m = model(p)
    check(abs(m['funnel']['qualificationRate'] - 0.4) < 1e-9, 'qualificação editável')
    typ(p, '#cfg-scenarios-1-closeRate', '50'); m = model(p)
    check(abs(m['op']['closeRate'] - 0.5) < 1e-9, 'fechamento do cenário editável')
    p.click('#tab-semtde')
    typ(p, '#cfg-independent-cpl', '15'); m = model(p)
    check(m['compare']['base']['funnel']['leads'] == 70 and m['funnel']['contactLeads'] == 105, 'Sem TDE recalcula só a operação independente')
    p.click('#m-save'); p.wait_for_timeout(100)
    p.reload(); p.wait_for_timeout(400); m = model(p)
    check(m['op']['cpl'] == 10 and m['independent']['cpl'] == 15, 'configurações persistem após recarregar')
    p.click('#btn-settings'); p.click('#m-reset'); p.click('#m-reset'); p.click('#m-save'); p.wait_for_timeout(100); m = model(p)
    check(m['funnel']['sales'] == 14 and m['op']['cpl'] == 7.5 and p.input_value('#in-name') == 'Prospect Antigo', 'restaurar padrões oficiais mantém o prospect')
    p.click('#btn-settings'); p.click('#tab-financeiro')
    typ(p, '#cfg-financial-contributionMargin', '60')
    check(p.input_value('#cfg-financial-variableCostPct') == '40', 'margem 60% ⇄ custos variáveis 40%')
    p.click('#m-cancel')

    # meta reversa
    p.fill('#in-name', 'Estudio Teste')
    p.click('[data-mode="reverse"]'); typ(p, '#in-target', '30000'); m = model(p)
    check(m['reverse']['feasible'] and m['reverse']['sales'] == 21 and m['funnel']['sales'] >= 21 and m['investment'] == m['reverse']['investment'], 'meta R$ 30.000 → 21 vendas e investimento mínimo')
    p.click('[data-rtype="sales"]'); typ(p, '#in-target', '20'); m = model(p)
    check(m['funnel']['expected']['sales'] >= 20 and m['funnel']['sales'] >= 20, 'meta de 20 vendas')
    p.screenshot(path=str(OUT / 'reverse.png'))
    p.click('[data-mode="standard"]')

    # alavancas
    base = model(p)['projection']['totals']
    p.click('#sw-lev-prospeccao'); m = model(p)
    check([r['leverSales'] for r in m['projection']['rows']] == [0, 0, 0, 1, 1, 1] and m['financial']['roas'] == model(p)['financial']['roas'], 'alavanca: primeira venda no mês 4, fora do ROAS')
    p.click('#sw-lev-social'); p.click('#sw-lev-indicacoes'); m = model(p)
    check(m['projection']['totals']['leverSales'] == 9, 'três alavancas somadas uma vez')
    p.click('#sw-lev-prospeccao'); p.click('#sw-lev-social'); p.click('#sw-lev-indicacoes'); m = model(p)
    check(m['projection']['totals'] == base, 'desativar alavancas reverte')
    p.click('#sw-lev-social'); p.click('#sw-lev-indicacoes')
    check(p.input_value('#lt-social') == '1.450,00' and 'Igual ao ticket médio' in p.inner_text('#levers'), 'alavanca puxa o ticket médio')
    typ(p, '#in-ticket', '1800'); check(p.input_value('#lt-social') == '1.800,00', 'alavanca acompanha o novo ticket')
    typ(p, '#lt-social', '900'); m = model(p)
    check(m['levers']['list'][1]['ticket'] == 900 and m['projection']['totals']['levers'][1]['revenue'] == 3 * 900 and p.input_value('#lt-social') == '900', 'valor por venda editável sem perder a digitação')
    p.click('[data-lever-ticket-reset="social"]'); m = model(p)
    check(m['levers']['list'][1]['ticket'] == 1800, 'voltar a usar o ticket médio')
    typ(p, '#in-ticket', '1450'); p.locator('#in-ticket').blur()

    # projeção
    p.click('[data-months="12"]'); m = model(p); check(len(m['projection']['rows']) == 12, '12 meses')
    p.click('#sw-growth'); typ(p, '#in-growth', '10'); m = model(p)
    check(abs(m['projection']['rows'][1]['investment'] - 1650) < 0.01, 'crescimento recalcula volumes')
    p.click('#sw-ramp'); m = model(p)
    rows, t = m['projection']['rows'], m['projection']['totals']
    check(rows[0]['adSales'] < rows[5]['adSales'], 'rampagem progride o fechamento')
    check(all(t[k] == sum(r[k] for r in rows) for k in ['followers', 'leads', 'qualified', 'adSales']) and abs(t['roas'] - t['adRevenue'] / t['investment']) < 1e-9, 'totais reconciliados')
    for metric in ['revenue', 'sales', 'followers', 'leads', 'qualified', 'investment', 'roas', 'compare']:
        p.click(f'[data-metric="{metric}"]'); check(p.locator('#chart svg').count() == 1, 'gráfico ' + metric)
    p.click('[data-metric="revenue"]')
    th = p.inner_text('#proj-table thead')
    check(all(x in th for x in ['Seguidores', 'Leads', 'Qualificados']), 'tabela com seguidores, leads e qualificados')

    # extremos
    typ(p, '#in-investment', '0'); txt = p.inner_text('#app'); check('NaN' not in txt and 'Infinity' not in txt, 'investimento zero')
    typ(p, '#in-ticket', '0'); txt = p.inner_text('#app'); check('NaN' not in txt and 'Infinity' not in txt, 'ticket zero')
    typ(p, '#in-investment', '1500'); typ(p, '#in-ticket', '1450'); p.locator('#in-ticket').blur()

    ctx.grant_permissions(['clipboard-read', 'clipboard-write'])
    p.click('#btn-copy'); p.wait_for_timeout(100)
    clip = p.evaluate('navigator.clipboard.readText()')
    check('Estudio Teste' in clip and 'Sem Método TDE' in clip and 'Castelo' not in clip, 'resumo para WhatsApp')

    ops = p.evaluate('() => window.__tde.buildPdf().__ops')
    texts = ' | '.join(o['t'] for o in ops if o['op'] == 'text').replace(' ', ' ')
    check(max(o['page'] for o in ops) == 6, 'PDF com 6 páginas')
    check('Estudio Teste' in texts and 'R$ 20.300,00' in texts and 'Seguidores' in texts and 'Castelo' not in texts, 'PDF com valores da tela')
    (OUT / 'pdf_ops.json').write_text(json.dumps(ops))
    p.click('#btn-pdf'); p.wait_for_timeout(300)
    check('castelo' not in p.content().lower().replace('castelo-roi:config:v1', '').replace('castelo-roi:sim:v1', ''), 'nenhuma menção à Castelo na página')

    # visualização simplificada
    p.click('[data-view="simple"]'); p.wait_for_timeout(100)
    check(p.is_visible('#simple-results') and not p.is_visible('#funnel') and not p.is_visible('#proj-table'), 'simplificada esconde os detalhes')
    m = model(p); st = p.inner_text('#simple-main')
    check(qty_ok := ('20.300,00' in st and '407' in st and '149' in st and '45' in st), 'simplificada mostra faturamento, seguidores, leads e qualificados')
    check('4.350,00' in p.inner_text('#simple-cmp') and '+R$ 15.950,00' in p.inner_text('#simple-cmp').replace('\xa0', ' '), 'simplificada mostra comparativo')
    p.click('#scen-agressivo'); check('30.450,00' in p.inner_text('#simple-main'), 'simplificada atualiza ao trocar cenário')
    p.click('#scen-moderado')
    p.click('#sw-slev-prospeccao'); m = model(p)
    check(m['sim'] if False else (m['projection']['totals']['levers'][0]['enabled'] and p.get_attribute('#sw-slev-prospeccao', 'aria-checked') == 'true'), 'ativar alavanca na simplificada')
    check(p.get_attribute('#sw-lev-prospeccao', 'aria-checked') == 'true', 'alavanca sincronizada com a completa')
    p.click('#sw-slev-prospeccao'); m = model(p)
    check(not m['projection']['totals']['levers'][0]['enabled'], 'desativar alavanca na simplificada')
    p.click('#seg-months-simple [data-months="6"]'); check('6 meses' in p.inner_text('#simple-proj'), 'período na simplificada')
    p.screenshot(path=str(OUT / 'simple.png'), full_page=True)
    p.reload(); p.wait_for_timeout(300)
    check(p.is_visible('#simple-results'), 'visualização escolhida persiste')
    p.click('[data-view="full"]'); p.wait_for_timeout(100)
    check(p.is_visible('#funnel') and not p.is_visible('#simple-results'), 'volta para a completa')
    p.click('[data-months="12"]')
    p.evaluate('window.scrollTo(0,0)')
    p.screenshot(path=str(OUT / 'desktop.png'), full_page=True)
    p.click('#btn-settings'); p.click('#tab-aquisicao'); p.wait_for_timeout(100)
    p.screenshot(path=str(OUT / 'settings.png'))
    p.click('#m-cancel')

    mob = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    q = mob.new_page(); setup(q)
    q.goto(PAGE); q.wait_for_timeout(300)
    sw = q.evaluate('document.documentElement.scrollWidth')
    check(sw <= 390, f'celular sem rolagem horizontal (scrollWidth={sw})')
    q.screenshot(path=str(OUT / 'mobile.png'), full_page=True)
    q.click('[data-view="simple"]'); q.wait_for_timeout(100)
    check(q.evaluate('document.documentElement.scrollWidth') <= 390, 'simplificada no celular sem rolagem horizontal')
    q.screenshot(path=str(OUT / 'mobile_simple.png'), full_page=True)

    check(not errors, 'sem erros de console: ' + '; '.join(errors[:3]))
    b.close()

print('\nFALHAS:', len(fails))
sys.exit(1 if fails else 0)
