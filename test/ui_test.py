"""Teste de interface: abre a página em Chromium headless, exercita os critérios de aceite e salva capturas + operações do PDF."""
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

def model(p): return p.evaluate('() => JSON.parse(JSON.stringify(window.__castelo.model))')

def typ(p, sel, val):
    p.fill(sel, '')
    p.type(sel, val)

with sync_playwright() as pw:
    b = pw.chromium.launch()
    ctx = b.new_context(viewport={'width': 1440, 'height': 1000})
    p = ctx.new_page()
    errors = []
    p.on('pageerror', lambda e: errors.append(str(e)))
    p.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'fonts.g' not in m.text and 'ERR_' not in m.text else None)
    p.route('**/jspdf.umd.min.js', lambda r: r.fulfill(body=MOCK, content_type='application/javascript'))
    p.route('https://fonts.googleapis.com/**', lambda r: r.abort())
    p.goto(PAGE)
    p.wait_for_timeout(400)

    m = model(p)
    check(m['funnel']['sales'] == 3 and m['financial']['adRevenue'] == 4500, 'padrão: 3 vendas e R$ 4.500')
    check('4.500,00' in p.inner_text('#kpis'), 'card de faturamento mostra R$ 4.500,00')

    # 1. investimento
    typ(p, '#in-investment', '3000'); m = model(p)
    check(m['funnel']['leads'] == 166 and abs(m['financial']['adRevenue'] - m['funnel']['sales'] * 1500) < 0.01, 'investimento 3000 atualiza funil e faturamento')
    check(m['projection']['rows'][0]['investment'] == 3000, 'projeção acompanha investimento')
    # 3. ticket
    typ(p, '#in-ticket', '2.000'); m = model(p)
    check(m['ticket'] == 2000 and m['financial']['adRevenue'] == m['funnel']['sales'] * 2000, 'ticket "2.000" interpretado como 2000')
    # validação
    typ(p, '#in-ticket', '-5'); p.wait_for_timeout(50)
    check(p.inner_text('#err-ticket') != '', 'valor negativo mostra erro')
    typ(p, '#in-ticket', '1500'); p.locator('#in-ticket').blur()
    # 5. cenários
    for sid in ['moderado', 'agressivo', 'conservador']:
        p.click('#scen-' + sid); m = model(p)
        check(m['scenario']['id'] == sid, 'cenário ' + sid + ' selecionado')
    # 2/4/6. editar parâmetros e persistir
    p.click('#btn-params'); p.wait_for_timeout(100)
    typ(p, '#cfg-scenarios-0-cpl', '10'); m = model(p)
    check(m['funnel']['cpl'] == 10 and m['funnel']['leads'] == 300, 'CPL editado afeta a simulação imediatamente')
    typ(p, '#cfg-scenarios-0-scheduleRate', '150')
    check('100%' in p.inner_text('#err-cfg-scenarios-0-scheduleRate'), 'taxa acima de 100% bloqueada')
    typ(p, '#cfg-scenarios-0-scheduleRate', '12')
    p.click('#m-save'); p.wait_for_timeout(100)
    p.reload(); p.wait_for_timeout(400); m = model(p)
    check(m['scenario']['params']['cpl'] == 10 and abs(m['scenario']['params']['scheduleRate'] - 0.12) < 1e-9, 'parâmetros persistem após recarregar')
    check(p.input_value('#in-investment') == '3.000,00', 'simulação persiste após recarregar')
    # restaurar padrões
    p.click('#btn-settings'); p.click('#m-reset'); p.click('#m-reset'); p.click('#m-save'); p.wait_for_timeout(100)
    m = model(p); check(m['scenario']['params']['cpl'] == 18, 'restaurar padrões')
    # nova simulação
    p.fill('#in-name', 'Estudio Teste')
    p.click('#btn-new'); p.click('#btn-new'); m = model(p)
    check(m['investment'] == 1500 and p.input_value('#in-name') == '', 'nova simulação limpa prospect')
    p.fill('#in-name', 'Estudio Teste')

    # 7. meta reversa
    p.click('[data-mode="reverse"]'); typ(p, '#in-target', '15000'); m = model(p)
    r = m['reverse']
    check(r['feasible'] and r['sales'] == 10 and m['funnel']['sales'] >= 10 and m['investment'] == r['investment'], 'meta reversa por faturamento (15.000 → 10 vendas)')
    check('Diferença' in p.inner_text('#reverse-result'), 'mostra diferença vs investimento atual')
    p.click('[data-rtype="sales"]'); typ(p, '#in-target', '5'); m = model(p)
    check(m['reverse']['sales'] == 5 and m['funnel']['sales'] >= 5, 'meta reversa por vendas')
    p.screenshot(path=str(OUT / 'reverse.png'), full_page=False)
    p.click('[data-mode="standard"]')

    # 8-10. alavancas
    base = model(p)['projection']['totals']
    p.click('#sw-lev-prospeccao'); m = model(p)
    rows = m['projection']['rows']
    check([x['leverSales'] for x in rows] == [0, 0, 0, 1, 1, 1], 'prospecção: maturação de 3 meses')
    check(m['financial']['roas'] == model(p)['financial']['roas'] and m['projection']['totals']['adSales'] == base['adSales'], 'ROAS e vendas de anúncios inalterados')
    p.click('#sw-lev-social'); p.click('#sw-lev-indicacoes'); m = model(p)
    check(m['projection']['totals']['leverSales'] == 9 and m['levers']['mature']['leverSales'] == 3 and m['levers']['now']['leverSales'] == 0, 'três alavancas somadas uma única vez')
    tbl = p.inner_text('#proj-table')
    check('Total' in tbl, 'tabela com linha de total')
    p.click('#sw-lev-prospeccao'); p.click('#sw-lev-social'); p.click('#sw-lev-indicacoes'); m = model(p)
    check(m['projection']['totals'] == base, 'desativar alavancas reverte resultados')
    p.click('#sw-lev-social'); p.click('#sw-lev-indicacoes')

    # 11-13. projeção
    p.click('[data-months="12"]'); m = model(p)
    check(len(m['projection']['rows']) == 12, '12 meses')
    p.click('#sw-growth'); typ(p, '#in-growth', '10'); m = model(p)
    check(abs(m['projection']['rows'][1]['investment'] - 1650) < 0.01, 'crescimento de 10% ao mês')
    p.click('#sw-ramp'); m = model(p)
    check(abs(m['projection']['rows'][0]['efficiency'] - 0.7) < 1e-9 and m['projection']['rows'][5]['efficiency'] == 1, 'rampagem ativada')
    t = m['projection']['totals']; rws = m['projection']['rows']
    check(abs(t['totalRevenue'] - sum(x['totalRevenue'] for x in rws)) < 0.01 and abs(t['roas'] - t['adRevenue'] / t['investment']) < 1e-9, 'totais = soma mensal; ROAS total coerente')
    for metric in ['revenue', 'investment', 'sales', 'roas', 'compare']:
        p.click(f'[data-metric="{metric}"]')
        check(p.locator('#chart svg').count() == 1, 'gráfico ' + metric)
    p.click('[data-metric="revenue"]')
    p.hover('#chart .hit[data-i="5"]'); p.wait_for_timeout(50)
    check(p.is_visible('#ctip'), 'tooltip do gráfico')

    # comparativo
    p.select_option('#sel-imp', 'moderado'); m = model(p)
    check(m['compare']['improvedScenario']['id'] == 'moderado', 'seletor de cenário melhorado')
    p.select_option('#sel-imp', 'castelo')
    check('+125%' not in p.inner_text('#cmp') and '1095' not in p.inner_text('#cmp'), 'sem multiplicadores fixos')

    # honorários
    p.click('#btn-settings'); typ(p, '#cfg-financial-agencyFee', '1000'); typ(p, '#cfg-financial-variableCostPct', '20'); p.click('#m-save')
    m1 = model(p); p.click('#sw-fee'); m2 = model(p)
    check(m1['financial']['fixedCosts'] - m2['financial']['fixedCosts'] == 1000 and not m1['financial']['roiSimplified'], 'toggle de honorários altera custos; ROI líquido com custos variáveis')
    p.click('#sw-fee')

    # 17-18. extremos
    typ(p, '#in-investment', '0'); m = model(p)
    txt = p.inner_text('#app')
    check('NaN' not in txt and 'Infinity' not in txt, 'investimento zero sem NaN/Infinity')
    typ(p, '#in-ticket', '0'); txt = p.inner_text('#app')
    check('NaN' not in txt and 'Infinity' not in txt, 'ticket zero sem NaN/Infinity')
    typ(p, '#in-investment', '1500'); typ(p, '#in-ticket', '1500'); p.locator('#in-ticket').blur()

    # copiar resumo
    ctx.grant_permissions(['clipboard-read', 'clipboard-write'])
    p.click('#btn-copy'); p.wait_for_timeout(100)
    clip = p.evaluate('navigator.clipboard.readText()')
    check('Estudio Teste' in clip and 'Funil mensal' in clip, 'resumo para WhatsApp copiado')

    # 15. PDF
    ops = p.evaluate('() => window.__castelo.buildPdf().__ops')
    texts = ' | '.join(o['t'] for o in ops if o['op'] == 'text')
    m = model(p)
    check(max(o['page'] for o in ops) == 5, 'PDF com 5 páginas')
    check('Estudio Teste' in texts and 'R$ 4.500,00'.replace(' ', ' ') in texts or 'R$ 4.500,00' in texts.replace(' ', ' '), 'PDF usa dados atuais')
    (OUT / 'pdf_ops.json').write_text(json.dumps(ops))
    p.click('#btn-pdf'); p.wait_for_timeout(300)

    p.screenshot(path=str(OUT / 'desktop.png'), full_page=True)
    p.click('#btn-settings'); p.click('#tab-alavancas'); p.wait_for_timeout(100)
    p.screenshot(path=str(OUT / 'settings.png'))
    p.click('#m-cancel')

    mob = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    q = mob.new_page()
    q.route('**/jspdf.umd.min.js', lambda r: r.fulfill(body=MOCK, content_type='application/javascript'))
    q.route('https://fonts.googleapis.com/**', lambda r: r.abort())
    q.goto(PAGE); q.wait_for_timeout(300)
    sw = q.evaluate('document.documentElement.scrollWidth')
    check(sw <= 390, f'celular sem rolagem horizontal (scrollWidth={sw})')
    q.screenshot(path=str(OUT / 'mobile.png'), full_page=True)

    check(not errors, 'sem erros de console: ' + '; '.join(errors[:3]))
    b.close()

print('\nFALHAS:', len(fails))
sys.exit(1 if fails else 0)
