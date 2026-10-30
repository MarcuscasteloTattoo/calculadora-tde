const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine.js');

const cfg = () => E.defaultConfig();
const sim = (c, over) => Object.assign(E.defaultSim(c), over || {});
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg || ''} esperado ${b}, obtido ${a}`);

function scanFinite(o, path = 'model') {
  if (typeof o === 'number') assert.ok(Number.isFinite(o), `${path} não é finito: ${o}`);
  else if (o && typeof o === 'object') for (const k of Object.keys(o)) scanFinite(o[k], path + '.' + k);
}

test('cenário conservador padrão: 83 leads → 3 vendas → R$ 4.500', () => {
  const m = E.computeAll(cfg(), sim(cfg()));
  assert.equal(m.funnel.leads, 83);
  assert.equal(m.funnel.appointments, 8);
  assert.equal(m.funnel.shows, 5);
  assert.equal(m.funnel.sales, 3);
  assert.equal(m.financial.adRevenue, 4500);
  close(m.financial.roas, 3);
});

test('faturamento sempre = vendas × ticket', () => {
  for (const policy of ['integer', 'expected']) for (let i = 0; i < 300; i++) {
    const inv = Math.random() * 20000, t = Math.random() * 5000;
    const p = { cpl: 1 + Math.random() * 40, scheduleRate: Math.random(), showRate: Math.random(), closeRate: Math.random() };
    const f = E.funnel(inv, p, policy);
    const fi = E.financials({ investment: inv, ticket: t, adSales: f.sales, fin: cfg().financial });
    close(fi.adRevenue, E.round2(f.sales * t));
  }
});

test('funil nunca cresce de uma etapa para a seguinte (inclusive com arredondamento)', () => {
  for (const policy of ['integer', 'expected']) for (let i = 0; i < 1000; i++) {
    const p = { cpl: 0.5 + Math.random() * 40, scheduleRate: Math.random(), showRate: Math.random(), closeRate: Math.random() };
    const f = E.funnel(Math.random() * 50000, p, policy, 0.5 + Math.random());
    assert.ok(f.leads >= f.appointments && f.appointments >= f.shows && f.shows >= f.sales);
    if (policy === 'integer') [f.leads, f.appointments, f.shows, f.sales].forEach(v => assert.ok(Number.isInteger(v)));
    const r = x => Math.round(x * 10) / 10;
    assert.ok(r(f.leads) >= r(f.appointments) && r(f.appointments) >= r(f.shows) && r(f.shows) >= r(f.sales));
  }
});

test('CPL zero e investimento zero não geram NaN/Infinity', () => {
  const c = cfg(); c.scenarios[0].cpl = 0;
  const m1 = E.computeAll(c, sim(c));
  assert.equal(m1.funnel.leads, 0);
  assert.ok(m1.issues.length > 0);
  scanFinite(m1);
  const m2 = E.computeAll(cfg(), sim(cfg(), { investment: 0, ticket: 0 }));
  assert.equal(m2.financial.roas, null);
  assert.equal(m2.financial.costPerSale, null);
  scanFinite(m2);
  const m3 = E.computeAll(cfg(), sim(cfg(), { investment: -50, ticket: 'abc', mode: 'reverse', reverseTarget: -10 }));
  scanFinite(m3);
});

test('taxas acima de 100% são limitadas e sinalizadas', () => {
  const p = E.sanitizeParams({ cpl: 10, scheduleRate: 1.5, showRate: -1, closeRate: 0.5 });
  assert.equal(p.scheduleRate, 1); assert.equal(p.showRate, 0);
  assert.ok(E.paramIssues({ cpl: 10, scheduleRate: 1.5, showRate: 0.5, closeRate: 0.5 }).length);
});

test('meta reversa (inteira): investimento calculado entrega ao menos a meta, com as mesmas premissas', () => {
  for (let i = 0; i < 500; i++) {
    const p = { cpl: 1 + Math.random() * 40, scheduleRate: 0.01 + Math.random() * 0.99, showRate: 0.01 + Math.random() * 0.99, closeRate: 0.01 + Math.random() * 0.99 };
    const target = Math.ceil(Math.random() * 30);
    const r = E.reverse({ type: 'sales', target, ticket: 1500, params: p, policy: 'integer', currentInvestment: 1500 });
    const f = E.funnel(r.investment, p, 'integer');
    assert.ok(f.sales >= target, `alvo ${target}, obtido ${f.sales}`);
    assert.ok(f.leads >= r.leads);
  }
});

test('meta reversa por faturamento e valor esperado exato', () => {
  const p = E.sanitizeParams(cfg().scenarios[1]);
  const r = E.reverse({ type: 'revenue', target: 10000, ticket: 1500, params: p, policy: 'integer', currentInvestment: 1500 });
  assert.equal(r.sales, 7); // 10000/1500 = 6,67 → 7 vendas
  assert.ok(r.revenue >= 10000);
  close(r.difference, r.investment - 1500);
  const e = E.reverse({ type: 'revenue', target: 9000, ticket: 1500, params: p, policy: 'expected' });
  const f = E.funnel(e.investment, p, 'expected');
  assert.ok(Math.abs(f.sales - 6) < 0.001);
});

test('meta reversa impossível com taxa zero', () => {
  const r = E.reverse({ type: 'sales', target: 5, ticket: 1500, params: { cpl: 10, scheduleRate: 0, showRate: 0.5, closeRate: 0.5 }, policy: 'integer' });
  assert.equal(r.feasible, false);
});

test('alavancas respeitam maturação e somam uma única vez', () => {
  const c = cfg();
  const base = E.computeAll(c, sim(c));
  const one = E.computeAll(c, sim(c, { leversEnabled: { prospeccao: true } }));
  const rows = one.projection.rows;
  [0, 1, 2].forEach(i => assert.equal(rows[i].leverSales, 0, 'mês ' + (i + 1)));
  [3, 4, 5].forEach(i => assert.equal(rows[i].leverSales, 1));
  assert.equal(one.projection.totals.leverSales, 3);
  assert.equal(one.projection.totals.adSales, base.projection.totals.adSales, 'anúncios não mudam');
  assert.equal(one.financial.roas, base.financial.roas, 'ROAS publicitário não inclui alavancas');

  const all = E.computeAll(c, sim(c, { leversEnabled: { prospeccao: true, social: true, indicacoes: true } }));
  assert.equal(all.projection.rows[5].leverSales, 3);
  assert.equal(all.projection.totals.leverSales, 9);
  close(all.projection.totals.leverRevenue, 9 * 1500);
  assert.equal(all.levers.now.leverSales, 0, 'mês 1 sem contribuição');
  assert.equal(all.levers.mature.leverSales, 3);

  const off = E.computeAll(c, sim(c, { leversEnabled: { prospeccao: false, social: false, indicacoes: false } }));
  assert.deepEqual(off.projection.totals, base.projection.totals);
});

test('ticket e custo próprios da alavanca', () => {
  const c = cfg(); c.levers[2].ticket = 800; c.levers[2].monthlyCost = 200; c.levers[2].maturationMonths = 0;
  const m = E.computeAll(c, sim(c, { leversEnabled: { indicacoes: true } }));
  assert.equal(m.projection.rows[0].leverRevenue, 800);
  assert.equal(m.projection.totals.leverCosts, 1200);
});

test('totais da projeção = soma dos meses; ROAS total = fat. acumulado ÷ invest. acumulado', () => {
  const c = cfg();
  const s = sim(c, { leversEnabled: { social: true } });
  s.projection = Object.assign({}, s.projection, { months: 12, growthEnabled: true, growthPct: 0.1, rampEnabled: true, rampMonths: 4 });
  const m = E.computeAll(c, s);
  const rows = m.projection.rows, t = m.projection.totals;
  assert.equal(rows.length, 12);
  for (const k of ['leads', 'adSales', 'leverSales', 'totalSales']) assert.equal(t[k], rows.reduce((a, r) => a + r[k], 0));
  close(t.totalRevenue, E.round2(rows.reduce((a, r) => a + r.totalRevenue, 0)));
  close(t.roas, t.adRevenue / t.investment);
  rows.forEach(r => close(r.totalRevenue, E.round2(r.adRevenue + r.leverRevenue)));
});

test('crescimento de investimento e rampagem determinísticos', () => {
  const proj = { months: 6, growthEnabled: true, growthPct: 0.1, rampEnabled: true, rampMonths: 3, startEfficiency: 0.7, finalEfficiency: 1 };
  const p = E.project({ investment: 1000, ticket: 1000, params: cfg().scenarios[0], policy: 'integer', projection: proj, levers: [], fin: cfg().financial });
  close(p.rows[1].investment, 1100); close(p.rows[2].investment, 1210);
  close(p.rows[0].efficiency, 0.7); close(p.rows[1].efficiency, 0.85); close(p.rows[2].efficiency, 1); close(p.rows[5].efficiency, 1);
  const off = E.efficiencyAt(1, Object.assign({}, proj, { rampEnabled: false }));
  close(off, 1);
  const p2 = E.project({ investment: 1000, ticket: 1000, params: cfg().scenarios[0], policy: 'integer', projection: proj, levers: [], fin: cfg().financial });
  assert.deepEqual(p, p2);
});

test('ponto de equilíbrio coerente com o resultado', () => {
  for (let i = 0; i < 300; i++) {
    const fin = { variableCostPct: Math.random() * 0.5, agencyFee: Math.random() * 3000, includeAgencyFee: Math.random() > 0.5, otherCosts: Math.random() * 500, nearBandPct: 0.15 };
    const sales = Math.floor(Math.random() * 10);
    const f = E.financials({ investment: 1500, ticket: 1000 + Math.random() * 2000, adSales: sales, fin });
    if (f.breakEvenSales !== null) assert.equal(sales >= f.breakEvenSales, f.result >= -1e-6);
  }
});

test('honorários só entram quando incluídos; ROI simplificado sem custos variáveis', () => {
  const fin = Object.assign(cfg().financial, { agencyFee: 1000 });
  const a = E.financials({ investment: 1500, ticket: 1500, adSales: 3, fin: Object.assign({}, fin, { includeAgencyFee: true }) });
  const b = E.financials({ investment: 1500, ticket: 1500, adSales: 3, fin: Object.assign({}, fin, { includeAgencyFee: false }) });
  assert.equal(a.fixedCosts, 2500); assert.equal(b.fixedCosts, 1500);
  assert.equal(a.roiSimplified, true);
  close(a.roi, (4500 - 2500) / 2500 * 100);
  assert.notEqual(a.roas, a.roi);
});

test('comparativo usa apenas parâmetros e fórmulas', () => {
  const c = cfg();
  const m = E.computeAll(c, sim(c));
  const cmp = m.compare;
  assert.equal(cmp.extraSales, cmp.improved.funnel.sales - cmp.base.funnel.sales);
  close(cmp.incrementalRevenue, cmp.improved.fin.adRevenue - cmp.base.fin.adRevenue);
  close(cmp.cplReduction, 18 - 12);
  close(cmp.cplReductionPct, 6 / 18 * 100);
  // 1500/12 = 125 leads → 25 agend. → 21 compar. → 14 vendas
  assert.equal(cmp.improved.funnel.leads, 125);
  assert.equal(cmp.improved.funnel.sales, 14);
});

test('modo reverso alimenta o funil com o investimento necessário', () => {
  const c = cfg();
  const m = E.computeAll(c, sim(c, { mode: 'reverse', reverseType: 'sales', reverseTarget: 6 }));
  assert.ok(m.reverse.feasible);
  assert.equal(m.investment, m.reverse.investment);
  assert.ok(m.funnel.sales >= 6);
});

test('configuração importada inválida volta aos padrões com segurança', () => {
  const n = E.normalizeConfig({ financial: { variableCostPct: 5 }, scenarios: 'x', levers: [{ id: 'social', salesPerMonth: -3 }] });
  assert.equal(n.financial.variableCostPct, 1);
  assert.equal(n.scenarios.length, 3);
  assert.equal(n.levers[1].salesPerMonth, 0);
  assert.equal(n.levers[0].salesPerMonth, 1);
});
