const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine.js');

const cfg = () => E.defaultConfig();
const sim = (c, over) => Object.assign(E.defaultSim(c), over || {});
const close = (a, b, msg, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${msg || ''} esperado ${b}, obtido ${a}`);
const run = (over, c = cfg()) => E.computeAll(c, sim(c, over));

function scanFinite(o, path = 'model') {
  if (typeof o === 'number') assert.ok(Number.isFinite(o), `${path} não é finito: ${o}`);
  else if (o && typeof o === 'object') for (const k of Object.keys(o)) scanFinite(o[k], path + '.' + k);
}

// ---------------------------------------------------------------- números oficiais do documento
test('padrões oficiais: Moderado selecionado, R$ 1.500 e ticket R$ 1.450', () => {
  const s = E.defaultSim(cfg());
  assert.equal(s.scenarioId, 'moderado'); assert.equal(s.investment, 1500); assert.equal(s.ticket, 1450); assert.equal(s.followersShare, 0.30);
});

test('distribuição 30/70: R$ 450 em seguidores e R$ 1.050 em contatos', () => {
  const f = run().funnel;
  assert.equal(f.followersBudget, 450); assert.equal(f.contactsBudget, 1050);
});

test('seguidores: 333 da captação + 74 adicionais = 407, com razões históricas exatas', () => {
  const f = run().funnel;
  close(f.followerCost, 1058.58 / 784);
  close(f.expected.followersDirect, 450 / (1058.58 / 784));
  close(f.expected.followersIndirect, 1050 * 161 / 2301.89);
  assert.equal(f.followers, 407); assert.equal(f.followersDirect, 333); assert.equal(f.followersIndirect, 74);
  assert.equal(f.followersDirect + f.followersIndirect, f.followers);
});

test('leads: 140 das campanhas + 9 conversas da captação = 149; 45 qualificados', () => {
  const f = run().funnel;
  close(f.expected.contactLeads, 140);
  close(f.expected.extraConversations, 450 * 21 / 1058.58);
  assert.equal(f.leads, 149); assert.equal(f.contactLeads, 140); assert.equal(f.extraConversations, 9);
  assert.equal(f.qualified, 45);
});

test('cenários oficiais: 9 / 14 / 21 vendas e R$ 13.050 / 20.300 / 30.450', () => {
  const exp = { conservador: [9, 13050], moderado: [14, 20300], agressivo: [21, 30450] };
  for (const id of Object.keys(exp)) {
    const m = run({ scenarioId: id });
    assert.equal(m.funnel.leads, 149, id); assert.equal(m.funnel.qualified, 45, id);
    assert.equal(m.funnel.sales, exp[id][0], id); assert.equal(m.financial.adRevenue, exp[id][1], id);
  }
  close(run({ scenarioId: 'agressivo' }).funnel.conversionRate, 0.144);
  close(run({ scenarioId: 'conservador' }).funnel.conversionRate, 0.06);
});

test('trocar cenário muda só o fechamento: leads, seguidores e qualificados iguais', () => {
  const a = run({ scenarioId: 'conservador' }).funnel, b = run({ scenarioId: 'agressivo' }).funnel;
  for (const k of ['investment', 'followersBudget', 'followers', 'leads', 'qualified']) assert.equal(a[k], b[k], k);
});

test('comparativo padrão: Sem TDE 84 → 17 → 3 (R$ 4.350; 2,90x) x Com TDE Moderado 149 → 45 → 14', () => {
  const c = run().compare;
  assert.equal(c.base.funnel.leads, 84); assert.equal(c.base.funnel.qualified, 17); assert.equal(c.base.funnel.sales, 3);
  assert.equal(c.base.fin.adRevenue, 4350); close(c.base.fin.roas, 2.9);
  assert.equal(c.improved.funnel.sales, 14); assert.equal(c.improved.fin.adRevenue, 20300); close(c.improved.fin.roas, 20300 / 1500);
  assert.equal(c.extraLeads, 65); assert.equal(c.extraSales, 11); assert.equal(c.incrementalRevenue, 15950);
  assert.equal(c.cplReduction, 5); close(c.cplReductionPct, 40);
  close(c.conversionBase, 0.04); close(c.conversionImproved, 0.096); close(c.conversionRelativePct, 140); close(c.conversionDeltaPP, 5.6);
});

test('Com TDE acompanha o cenário selecionado; Sem TDE fica independente', () => {
  const ag = run({ scenarioId: 'agressivo' }).compare, co = run({ scenarioId: 'conservador' }).compare;
  assert.equal(ag.improved.funnel.sales, 21); assert.equal(co.improved.funnel.sales, 9);
  assert.deepEqual(ag.base.funnel, co.base.funnel);
});

test('Sem TDE pode acompanhar ou não a distribuição principal', () => {
  const c = cfg();
  const m1 = E.computeAll(c, sim(c, { followersShare: 0.5 }));
  assert.equal(m1.compare.base.funnel.followersBudget, 750);
  c.independent.followMainDistribution = false;
  const m2 = E.computeAll(c, sim(c, { followersShare: 0.5 }));
  assert.equal(m2.compare.base.funnel.followersBudget, 450);
});

test('conversas adicionais desligadas: 140 leads; seguidores indiretos desligados: 333', () => {
  const c = cfg(); c.acquisition.extraConversationsEnabled = false; c.acquisition.indirectFollowersEnabled = false;
  const f = E.computeAll(c, sim(c)).funnel;
  assert.equal(f.leads, 140); assert.equal(f.extraConversations, 0); assert.equal(f.followers, 333); assert.equal(f.followersIndirect, 0);
});

test('custo por seguidor manual substitui a razão histórica', () => {
  const c = cfg(); c.acquisition.followerCostMode = 'manual'; c.acquisition.followerCostManual = 1.5;
  assert.equal(E.computeAll(c, sim(c)).funnel.followersDirect, 300);
});

test('seguidores nunca viram leads nem vendas', () => {
  const c1 = cfg(), c2 = cfg(); c2.acquisition.followerCostMode = 'manual'; c2.acquisition.followerCostManual = 0.01;
  const a = E.computeAll(c1, sim(c1)).funnel, b = E.computeAll(c2, sim(c2)).funnel;
  assert.ok(b.followers > a.followers * 10); assert.equal(a.leads, b.leads); assert.equal(a.sales, b.sales);
});

test('indicadores de custo: CPL, CPL qualificado das campanhas e custo global por qualificado', () => {
  const f = run().funnel;
  assert.equal(f.costPerLead, 7.5);
  close(f.contactQualifiedCost, 1050 / (140 * 0.3));
  close(f.globalQualifiedCost, 1500 / f.expected.qualified);
});

// ---------------------------------------------------------------- consistência
test('faturamento = vendas inteiras × ticket; etapas nunca crescem', () => {
  for (let i = 0; i < 1000; i++) {
    const c = cfg();
    c.acquisition.cpl = 0.5 + Math.random() * 30; c.commercial.qualificationRate = Math.random();
    c.scenarios[1].closeRate = Math.random();
    const m = E.computeAll(c, sim(c, { investment: Math.random() * 20000, ticket: Math.random() * 4000, followersShare: Math.random() }));
    const f = m.funnel;
    assert.ok(f.leads >= f.qualified && f.qualified >= f.sales);
    assert.ok(Number.isInteger(f.sales) && Number.isInteger(f.leads) && Number.isInteger(f.followers));
    assert.equal(f.contactLeads + f.extraConversations, f.leads);
    assert.equal(f.followersDirect + f.followersIndirect, f.followers);
    close(m.financial.adRevenue, E.round2(f.sales * m.ticket));
  }
});

test('meta reversa: investimento mínimo atinge a meta com as mesmas fórmulas', () => {
  for (let i = 0; i < 400; i++) {
    const target = 1 + Math.floor(Math.random() * 40);
    const m = run({ mode: 'reverse', reverseType: 'sales', reverseTarget: target, scenarioId: ['conservador', 'moderado', 'agressivo'][i % 3] });
    assert.ok(m.reverse.feasible);
    assert.ok(m.funnel.expected.sales >= target - 1e-9, `meta ${target}`);
    assert.ok(m.funnel.sales >= target);
    const less = E.funnel(E.round2(m.reverse.investment - 0.01), m.op, 1);
    assert.ok(less.expected.sales < target, 'um centavo a menos não atinge');
  }
});

test('meta reversa por faturamento usa a menor quantidade inteira de vendas', () => {
  const m = run({ mode: 'reverse', reverseType: 'revenue', reverseTarget: 20000 });
  assert.equal(m.reverse.sales, 14); // 20000 / 1450 = 13,8 → 14
  assert.equal(m.financial.adRevenue, 20300);
  assert.equal(m.investment, m.reverse.investment);
});

test('alavancas: maturação de 3 meses → primeira venda no mês 4; não entram no ROAS', () => {
  const base = run(), one = run({ leversEnabled: { prospeccao: true } });
  assert.deepEqual(one.projection.rows.map(r => r.leverSales), [0, 0, 0, 1, 1, 1]);
  assert.equal(one.financial.roas, base.financial.roas);
  const all = run({ leversEnabled: { prospeccao: true, social: true, indicacoes: true } });
  assert.equal(all.projection.totals.leverSales, 9);
  close(all.projection.totals.leverRevenue, 9 * 1450);
  const off = run({ leversEnabled: { prospeccao: false, social: false, indicacoes: false } });
  assert.deepEqual(off.projection.totals, base.projection.totals);
});

test('projeção: totais = soma dos meses exibidos; ROAS acumulado coerente', () => {
  const c = cfg(); const s = sim(c, { leversEnabled: { social: true } });
  s.projection = Object.assign({}, s.projection, { months: 12, growthEnabled: true, growthPct: 0.1, rampEnabled: true, rampMonths: 4 });
  const m = E.computeAll(c, s), rows = m.projection.rows, t = m.projection.totals;
  assert.equal(rows.length, 12);
  for (const k of ['followers', 'leads', 'qualified', 'adSales', 'leverSales', 'totalSales']) assert.equal(t[k], rows.reduce((a, r) => a + r[k], 0), k);
  close(t.roas, t.adRevenue / t.investment);
  rows.forEach(r => close(r.adRevenue, r.adSales * 1450));
  close(rows[1].investment, 1650);
  close(rows[0].efficiency, 0.7); close(rows[3].efficiency, 1);
  assert.ok(rows[0].adSales <= rows[3].adSales);
});

test('sem rampagem, cada mês repete o funil principal', () => {
  const m = run();
  m.projection.rows.forEach(r => { assert.equal(r.adSales, m.funnel.sales); assert.equal(r.leads, m.funnel.leads); assert.equal(r.followers, m.funnel.followers); });
});

test('ROI só com custos informados; equilíbrio simplificado sem margem', () => {
  const a = run();
  assert.equal(a.financial.roi, null); assert.equal(a.financial.breakEvenSimplified, true);
  const c = cfg(); c.financial.variableCostPct = 0.3; c.financial.agencyFee = 1000;
  const b = E.computeAll(c, sim(c));
  assert.ok(b.financial.roi !== null); assert.equal(b.financial.breakEvenSimplified, false);
  close(b.financial.result, 20300 * 0.7 - 2500);
  assert.equal(b.financial.breakEvenSales, Math.ceil(2500 / (1450 * 0.7)));
});

test('casos extremos sem NaN/Infinity', () => {
  const c = cfg(); c.acquisition.cpl = 0; c.independent.followerCost = 0;
  scanFinite(E.computeAll(c, sim(c)));
  scanFinite(run({ investment: 0, ticket: 0 }));
  scanFinite(run({ investment: -10, ticket: 'x', followersShare: 7, mode: 'reverse', reverseTarget: -3 }));
  const z = cfg(); z.commercial.qualificationRate = 0;
  const m = E.computeAll(z, sim(z, { mode: 'reverse' }));
  assert.equal(m.reverse.feasible, false); scanFinite(m);
});

test('migração: configuração antiga mantém alavancas e custos, adota parâmetros oficiais', () => {
  const old = { version: 1, defaults: { investment: 1500, ticket: 1500 }, scenarios: [{ id: 'conservador', cpl: 18, closeRate: 0.6 }],
    financial: { agencyFee: 900, variableCostPct: 0.1 }, levers: [{ id: 'social', salesPerMonth: 2, maturationMonths: 2 }] };
  const n = E.normalizeConfig(old);
  assert.equal(n.version, 2); assert.equal(n.defaults.ticket, 1450); assert.equal(n.scenarios[0].closeRate, 0.2);
  assert.equal(n.financial.agencyFee, 900); assert.equal(n.levers[1].salesPerMonth, 2);
});

test('alavancas usam o ticket médio do prospect por padrão e aceitam valor próprio', () => {
  const a = run({ ticket: 2000, leversEnabled: { social: true } });
  assert.ok(a.levers.list.every(l => l.ticket === 2000 && l.ticketSource === 'main'));
  close(a.projection.totals.leverRevenue, 3 * 2000);
  const b = run({ ticket: 2000, leversEnabled: { social: true }, leverTickets: { social: 900 } });
  assert.equal(b.levers.list[1].ticket, 900); assert.equal(b.levers.list[0].ticket, 2000);
  close(b.projection.totals.leverRevenue, 3 * 900);
});
