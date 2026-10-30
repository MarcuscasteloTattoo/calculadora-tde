/* Motor central de cálculo — Calculadora de ROI Tatuador de Elite
 * Funções puras. Toda a interface e o PDF consomem computeAll().
 */
(function (root) {
  'use strict';

  var EPS = 1e-9;
  var POLICY = { INTEGER: 'integer', EXPECTED: 'expected' };

  function num(v, d) {
    var n = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(n) ? n : (d === undefined ? 0 : d);
  }
  function nonNeg(v) { return Math.max(0, num(v)); }
  function rate(v) { return Math.min(1, Math.max(0, num(v))); }
  function floorQ(x) { return Math.floor(x + EPS); }
  function ceilQ(x) { return Math.ceil(x - EPS); }
  function div(a, b) { return (b > 0 && isFinite(a)) ? a / b : null; }
  function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }
  function ceilCents(x) { return Math.ceil(x * 100 - 1e-6) / 100; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // ---------------------------------------------------------------- padrões
  function defaultConfig() {
    return {
      version: 1,
      defaults: { investment: 1500, ticket: 1500, cpl: 15, scenarioId: 'conservador' },
      financial: {
        variableCostPct: 0,      // % do faturamento (material, taxas de cartão, comissão)
        agencyFee: 0,            // honorários mensais da agência
        includeAgencyFee: true,
        otherCosts: 0,           // outros custos mensais fixos da operação
        nearBandPct: 0.15        // faixa para "próximo do equilíbrio"
      },
      scenarios: [
        { id: 'conservador', name: 'Conservador', builtin: true, cpl: 18, scheduleRate: 0.10, showRate: 0.65, closeRate: 0.60,
          description: 'Operação comercial pouco estruturada, com oportunidades de melhoria no atendimento e no processo de vendas.' },
        { id: 'moderado', name: 'Moderado', builtin: true, cpl: 15, scheduleRate: 0.15, showRate: 0.75, closeRate: 0.65,
          description: 'Operação com atendimento organizado, acompanhamento de interessados e processo comercial parcialmente estruturado.' },
        { id: 'agressivo', name: 'Agressivo', builtin: true, cpl: 12, scheduleRate: 0.20, showRate: 0.85, closeRate: 0.70,
          description: 'Operação comercial otimizada, com atendimento ágil, follow-up consistente e estratégias de conversão bem executadas.' }
      ],
      castelo: {
        id: 'castelo', name: 'Método TDE', cpl: 12, scheduleRate: 0.20, showRate: 0.85, closeRate: 0.70,
        description: 'Campanhas otimizadas e processo comercial estruturado pelo Método Tatuador de Elite.',
        defaultBaseId: 'selected',   // 'selected' = cenário escolhido no card do prospect
        defaultImprovedId: 'castelo'
      },
      levers: [
        { id: 'prospeccao', name: 'Prospecção Ativa', salesPerMonth: 1, maturationMonths: 3, ticket: 0, monthlyCost: 0,
          description: 'Abordagem ativa a clientes antigos, indicados e parcerias locais.' },
        { id: 'social', name: 'Social Selling', salesPerMonth: 1, maturationMonths: 3, ticket: 0, monthlyCost: 0,
          description: 'Vendas geradas por relacionamento e conteúdo nas redes sociais.' },
        { id: 'indicacoes', name: 'Indicações', salesPerMonth: 1, maturationMonths: 3, ticket: 0, monthlyCost: 0,
          description: 'Programa estruturado de indicações de clientes e parcerias.' }
      ],
      projection: {
        months: 6,
        growthEnabled: false, growthPct: 0.10,
        rampEnabled: false, rampMonths: 3,
        startEfficiency: 0.70, finalEfficiency: 1.0
      },
      display: { policy: POLICY.INTEGER }
    };
  }

  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  // Mescla configuração salva com os padrões, sanitizando valores.
  function normalizeConfig(input) {
    var d = defaultConfig();
    if (!isObj(input)) return d;
    var c = clone(d);
    ['defaults', 'financial', 'projection', 'display'].forEach(function (k) {
      if (isObj(input[k])) Object.keys(c[k]).forEach(function (f) {
        if (input[k][f] !== undefined && typeof input[k][f] === typeof c[k][f]) c[k][f] = input[k][f];
      });
    });
    if (isObj(input.castelo)) Object.keys(c.castelo).forEach(function (f) {
      if (input.castelo[f] !== undefined && typeof input.castelo[f] === typeof c.castelo[f]) c.castelo[f] = input.castelo[f];
    });
    c.castelo.id = 'castelo';
    // Migração da marca anterior: textos padrão antigos passam a usar o nome TDE.
    if (/castelo/i.test(c.castelo.name)) c.castelo.name = d.castelo.name;
    if (/castelo/i.test(c.castelo.description)) c.castelo.description = d.castelo.description;
    if (Array.isArray(input.scenarios) && input.scenarios.length) {
      c.scenarios = input.scenarios.filter(isObj).map(function (s, i) {
        return {
          id: String(s.id || ('custom-' + i)), name: String(s.name || 'Cenário ' + (i + 1)), builtin: !!s.builtin,
          cpl: nonNeg(s.cpl), scheduleRate: rate(s.scheduleRate), showRate: rate(s.showRate), closeRate: rate(s.closeRate),
          description: String(s.description || '')
        };
      });
      if (!c.scenarios.length) c.scenarios = d.scenarios;
    }
    if (Array.isArray(input.levers)) {
      c.levers = d.levers.map(function (def) {
        var s = input.levers.filter(function (l) { return isObj(l) && l.id === def.id; })[0];
        if (!s) return def;
        return {
          id: def.id, name: String(s.name || def.name), salesPerMonth: nonNeg(s.salesPerMonth),
          maturationMonths: Math.round(nonNeg(s.maturationMonths)), ticket: nonNeg(s.ticket), monthlyCost: nonNeg(s.monthlyCost),
          description: String(s.description || '')
        };
      });
    }
    if (c.display.policy !== POLICY.EXPECTED) c.display.policy = POLICY.INTEGER;
    c.projection.months = c.projection.months === 12 ? 12 : 6;
    c.financial.variableCostPct = rate(c.financial.variableCostPct);
    c.financial.nearBandPct = rate(c.financial.nearBandPct);
    return c;
  }

  function defaultSim(config) {
    var c = config || defaultConfig();
    return {
      name: '', investment: c.defaults.investment, ticket: c.defaults.ticket,
      mode: 'standard', reverseType: 'revenue', reverseTarget: 10000,
      scenarioId: c.defaults.scenarioId,
      compareBaseId: c.castelo.defaultBaseId, compareImprovedId: c.castelo.defaultImprovedId,
      leversEnabled: {},
      includeAgencyFee: c.financial.includeAgencyFee,
      projection: clone(c.projection),
      chartMetric: 'revenue'
    };
  }

  // ---------------------------------------------------------------- funil
  function sanitizeParams(p) {
    p = p || {};
    return { cpl: nonNeg(p.cpl), scheduleRate: rate(p.scheduleRate), showRate: rate(p.showRate), closeRate: rate(p.closeRate) };
  }

  function paramIssues(p) {
    var out = [];
    if (!(num(p.cpl) > 0)) out.push('O CPL precisa ser maior que zero.');
    ['scheduleRate', 'showRate', 'closeRate'].forEach(function (k) {
      var v = num(p[k]);
      if (v > 1) out.push('Taxas não podem passar de 100%.');
      if (v < 0) out.push('Taxas não podem ser negativas.');
    });
    return out.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }

  // efficiency multiplica a taxa lead → agendamento (qualidade do atendimento).
  function funnel(investment, params, policy, efficiency) {
    var inv = nonNeg(investment);
    var p = sanitizeParams(params);
    var eff = efficiency === undefined ? 1 : Math.max(0, num(efficiency, 1));
    var sched = Math.min(1, p.scheduleRate * eff);
    var q = policy === POLICY.EXPECTED ? function (x) { return x; } : floorQ;
    var leads = p.cpl > 0 ? q(inv / p.cpl) : 0;
    var appointments = q(leads * sched);
    var shows = q(appointments * p.showRate);
    var sales = q(shows * p.closeRate);
    return {
      investment: inv, cpl: p.cpl, leads: leads, appointments: appointments, shows: shows, sales: sales,
      scheduleRate: sched, showRate: p.showRate, closeRate: p.closeRate, efficiency: eff, valid: p.cpl > 0
    };
  }

  // ---------------------------------------------------------------- financeiro
  function classify(result, fixedCosts, band) {
    if (fixedCosts <= 0) return result > 0 ? 'above' : 'near';
    if (Math.abs(result) <= band * fixedCosts) return 'near';
    return result > 0 ? 'above' : 'below';
  }

  function financials(o) {
    var fin = o.fin || {};
    var inv = nonNeg(o.investment), t = nonNeg(o.ticket), adSales = nonNeg(o.adSales);
    var v = rate(fin.variableCostPct);
    var fee = fin.includeAgencyFee ? nonNeg(fin.agencyFee) : 0;
    var other = nonNeg(fin.otherCosts);
    var leverSales = nonNeg(o.leverSales), leverRevenue = nonNeg(o.leverRevenue), leverCosts = nonNeg(o.leverCosts);

    var adRevenue = round2(adSales * t);
    var adFixed = round2(inv + fee + other);
    var adVariable = round2(adRevenue * v);
    var adResult = round2(adRevenue - adVariable - adFixed);
    var contribution = t * (1 - v);
    var breakEvenSales = adFixed === 0 ? 0 : (contribution > 0 ? ceilQ(adFixed / contribution) : null);

    var totalRevenue = round2(adRevenue + leverRevenue);
    var totalFixed = round2(adFixed + leverCosts);
    var totalVariable = round2(totalRevenue * v);
    var totalResult = round2(totalRevenue - totalVariable - totalFixed);

    return {
      investment: inv, ticket: t, adSales: adSales, adRevenue: adRevenue,
      variableCostPct: v, agencyFee: fee, otherCosts: other,
      fixedCosts: adFixed, variableCosts: adVariable, result: adResult,
      roas: div(adRevenue, inv),
      roi: adFixed > 0 ? adResult / adFixed * 100 : null,
      roiSimplified: !(v > 0),
      costPerSale: adSales > 0 ? inv / adSales : null,
      breakEvenSales: breakEvenSales,
      breakEvenProgress: breakEvenSales === null ? 0 : (breakEvenSales === 0 ? 1 : Math.min(1, adSales / breakEvenSales)),
      status: classify(adResult, adFixed, rate(fin.nearBandPct)),
      leverSales: leverSales, leverRevenue: leverRevenue, leverCosts: leverCosts,
      totalSales: adSales + leverSales, totalRevenue: totalRevenue, totalFixed: totalFixed,
      totalVariable: totalVariable, totalResult: totalResult,
      totalRoi: totalFixed > 0 ? totalResult / totalFixed * 100 : null,
      consolidatedReturn: div(totalRevenue, totalFixed),
      totalStatus: classify(totalResult, totalFixed, rate(fin.nearBandPct))
    };
  }

  // ---------------------------------------------------------------- meta reversa
  function reverse(o) {
    var p = sanitizeParams(o.params);
    var eff = o.efficiency === undefined ? 1 : Math.max(0, num(o.efficiency, 1));
    var sched = Math.min(1, p.scheduleRate * eff);
    var t = nonNeg(o.ticket), target = nonNeg(o.target);
    var expected = o.policy === POLICY.EXPECTED;
    var res = { type: o.type, target: target, feasible: true, reason: '' };

    if (!(p.cpl > 0)) return Object.assign(res, { feasible: false, reason: 'O CPL do cenário precisa ser maior que zero.' });
    if (!(sched > 0 && p.showRate > 0 && p.closeRate > 0))
      return Object.assign(res, { feasible: false, reason: 'Todas as taxas do cenário precisam ser maiores que zero.' });
    if (o.type === 'revenue' && !(t > 0))
      return Object.assign(res, { feasible: false, reason: 'Informe um ticket médio maior que zero.' });

    var sales = o.type === 'revenue' ? target / t : target;
    var up = expected ? function (x) { return x; } : ceilQ;
    var S = up(sales), C = up(S / p.closeRate), A = up(C / p.showRate), L = up(A / sched);
    var inv = expected ? round2(L * p.cpl) : ceilCents(L * p.cpl);
    var current = nonNeg(o.currentInvestment);
    return Object.assign(res, {
      sales: S, shows: C, appointments: A, leads: L, investment: inv,
      revenue: round2(S * t), currentInvestment: current, difference: round2(inv - current)
    });
  }

  // ---------------------------------------------------------------- alavancas
  function leverMonth(lever, enabled, month, mainTicket) {
    if (!enabled) return { sales: 0, revenue: 0, cost: 0, active: false };
    var active = month > Math.round(nonNeg(lever.maturationMonths));
    var sales = active ? nonNeg(lever.salesPerMonth) : 0;
    var ticket = nonNeg(lever.ticket) > 0 ? nonNeg(lever.ticket) : nonNeg(mainTicket);
    return { sales: sales, revenue: round2(sales * ticket), cost: nonNeg(lever.monthlyCost), active: active };
  }

  // ---------------------------------------------------------------- projeção
  function efficiencyAt(month, proj) {
    var fin = Math.max(0, num(proj.finalEfficiency, 1));
    if (!proj.rampEnabled) return fin;
    var R = Math.max(1, Math.round(nonNeg(proj.rampMonths)));
    var start = Math.max(0, num(proj.startEfficiency, fin));
    if (R <= 1) return fin;
    var k = Math.min(1, (month - 1) / (R - 1));
    return start + (fin - start) * k;
  }

  function project(o) {
    var proj = o.projection || {};
    var months = num(proj.months) === 12 ? 12 : 6;
    var g = proj.growthEnabled ? Math.max(-0.99, num(proj.growthPct)) : 0;
    var levers = o.levers || [], enabled = o.leversEnabled || {};
    var rows = [];
    for (var m = 1; m <= months; m++) {
      var inv = round2(nonNeg(o.investment) * Math.pow(1 + g, m - 1));
      var eff = efficiencyAt(m, proj);
      var f = funnel(inv, o.params, o.policy, eff);
      var per = levers.map(function (l) {
        var r = leverMonth(l, !!enabled[l.id], m, o.ticket);
        r.id = l.id; r.name = l.name; return r;
      });
      var lSales = per.reduce(function (a, r) { return a + r.sales; }, 0);
      var lRev = round2(per.reduce(function (a, r) { return a + r.revenue; }, 0));
      var lCost = round2(per.reduce(function (a, r) { return a + r.cost; }, 0));
      var fi = financials({ investment: inv, ticket: o.ticket, adSales: f.sales, leverSales: lSales, leverRevenue: lRev, leverCosts: lCost, fin: o.fin });
      rows.push({
        month: m, efficiency: eff, investment: inv, leads: f.leads, appointments: f.appointments, shows: f.shows,
        adSales: f.sales, leverSales: lSales, totalSales: f.sales + lSales, levers: per,
        adRevenue: fi.adRevenue, leverRevenue: lRev, totalRevenue: fi.totalRevenue, roas: fi.roas,
        leverCosts: lCost, totalFixed: fi.totalFixed, totalVariable: fi.totalVariable, totalResult: fi.totalResult, adResult: fi.result
      });
    }
    function sum(k) { return rows.reduce(function (a, r) { return a + r[k]; }, 0); }
    var totals = {
      investment: round2(sum('investment')), leads: sum('leads'), appointments: sum('appointments'), shows: sum('shows'),
      adSales: sum('adSales'), leverSales: sum('leverSales'), totalSales: sum('totalSales'),
      adRevenue: round2(sum('adRevenue')), leverRevenue: round2(sum('leverRevenue')), totalRevenue: round2(sum('totalRevenue')),
      leverCosts: round2(sum('leverCosts')), totalFixed: round2(sum('totalFixed')), totalVariable: round2(sum('totalVariable')),
      totalResult: round2(sum('totalResult')), adResult: round2(sum('adResult'))
    };
    totals.roas = div(totals.adRevenue, totals.investment);
    totals.consolidatedReturn = div(totals.totalRevenue, totals.totalFixed);
    totals.levers = levers.map(function (l) {
      var s = 0, r = 0, c = 0;
      rows.forEach(function (row) { row.levers.forEach(function (x) { if (x.id === l.id) { s += x.sales; r += x.revenue; c += x.cost; } }); });
      return { id: l.id, name: l.name, enabled: !!enabled[l.id], sales: s, revenue: round2(r), cost: round2(c) };
    });
    return { months: months, rows: rows, totals: totals };
  }

  // ---------------------------------------------------------------- comparativo
  function compare(o) {
    var b = funnel(o.investment, o.base, o.policy, o.efficiency);
    var i = funnel(o.investment, o.improved, o.policy, o.efficiency);
    var fb = financials({ investment: o.investment, ticket: o.ticket, adSales: b.sales, fin: o.fin });
    var fi = financials({ investment: o.investment, ticket: o.ticket, adSales: i.sales, fin: o.fin });
    var bc = nonNeg(o.base.cpl), ic = nonNeg(o.improved.cpl);
    return {
      base: { funnel: b, fin: fb }, improved: { funnel: i, fin: fi },
      extraSales: i.sales - b.sales,
      incrementalRevenue: round2(fi.adRevenue - fb.adRevenue),
      cplReduction: round2(bc - ic),
      cplReductionPct: bc > 0 ? (bc - ic) / bc * 100 : null,
      roasDelta: (fi.roas !== null && fb.roas !== null) ? fi.roas - fb.roas : null,
      roasMultiple: (fi.roas !== null && fb.roas) ? fi.roas / fb.roas : null
    };
  }

  // ---------------------------------------------------------------- orquestração
  function findScenario(config, id) {
    if (id === 'castelo') return config.castelo;
    for (var k = 0; k < config.scenarios.length; k++) if (config.scenarios[k].id === id) return config.scenarios[k];
    return null;
  }

  function computeAll(configIn, sim) {
    var config = normalizeConfig(configIn);
    var policy = config.display.policy;
    var scenario = findScenario(config, sim.scenarioId) || config.scenarios[0];
    var params = sanitizeParams(scenario);
    var proj = Object.assign({}, config.projection, sim.projection || {});
    var refEff = Math.max(0, num(proj.finalEfficiency, 1));
    var ticket = nonNeg(sim.ticket), currentInv = nonNeg(sim.investment);
    var issues = paramIssues(scenario);
    var fin = Object.assign({}, config.financial);
    if (typeof sim.includeAgencyFee === 'boolean') fin.includeAgencyFee = sim.includeAgencyFee;

    var rev = null, investment = currentInv;
    if (sim.mode === 'reverse') {
      rev = reverse({ type: sim.reverseType, target: sim.reverseTarget, ticket: ticket, params: params, policy: policy,
        efficiency: refEff, currentInvestment: currentInv });
      if (rev.feasible) investment = rev.investment;
    }

    var f = funnel(investment, params, policy, refEff);

    // Alavancas: mês atual (mês 1) e mês após maturação (regime)
    var enabled = sim.leversEnabled || {};
    var maxMat = config.levers.reduce(function (a, l) { return enabled[l.id] ? Math.max(a, Math.round(nonNeg(l.maturationMonths))) : a; }, 0);
    function leverAgg(month) {
      var per = config.levers.map(function (l) { var r = leverMonth(l, !!enabled[l.id], month, ticket); r.id = l.id; return r; });
      return {
        per: per,
        sales: per.reduce(function (a, r) { return a + r.sales; }, 0),
        revenue: round2(per.reduce(function (a, r) { return a + r.revenue; }, 0)),
        cost: round2(per.reduce(function (a, r) { return a + r.cost; }, 0))
      };
    }
    var nowL = leverAgg(1), matureL = leverAgg(maxMat + 1);

    var finAds = financials({ investment: investment, ticket: ticket, adSales: f.sales, fin: fin });
    var finNow = financials({ investment: investment, ticket: ticket, adSales: f.sales, leverSales: nowL.sales, leverRevenue: nowL.revenue, leverCosts: nowL.cost, fin: fin });
    var finMature = financials({ investment: investment, ticket: ticket, adSales: f.sales, leverSales: matureL.sales, leverRevenue: matureL.revenue, leverCosts: matureL.cost, fin: fin });

    var baseId = sim.compareBaseId === 'selected' || !findScenario(config, sim.compareBaseId) ? scenario.id : sim.compareBaseId;
    var impId = findScenario(config, sim.compareImprovedId) ? sim.compareImprovedId : 'castelo';
    var baseSc = findScenario(config, baseId), impSc = findScenario(config, impId);
    var cmp = compare({ investment: investment, ticket: ticket, base: baseSc, improved: impSc, policy: policy, efficiency: refEff, fin: fin });
    cmp.baseScenario = { id: baseSc.id, name: baseSc.name, params: sanitizeParams(baseSc) };
    cmp.improvedScenario = { id: impSc.id, name: impSc.name, params: sanitizeParams(impSc) };

    var common = { investment: investment, ticket: ticket, policy: policy, projection: proj, levers: config.levers, leversEnabled: enabled, fin: fin };
    var projection = project(Object.assign({}, common, { params: params }));
    var projBase = project(Object.assign({}, common, { params: sanitizeParams(baseSc), leversEnabled: {} }));
    var projImp = project(Object.assign({}, common, { params: sanitizeParams(impSc), leversEnabled: {} }));

    return {
      config: config, policy: policy, scenario: { id: scenario.id, name: scenario.name, description: scenario.description, params: params },
      issues: issues, ticket: ticket, currentInvestment: currentInv, investment: investment, mode: sim.mode,
      reverse: rev, funnel: f, financial: finAds,
      levers: { now: finNow, mature: finMature, nowPer: nowL.per, maturePer: matureL.per, maturationMonth: maxMat + 1 },
      compare: cmp, projection: projection, compareProjection: { base: projBase, improved: projImp },
      projectionSettings: proj, fin: fin
    };
  }

  var api = {
    POLICY: POLICY, defaultConfig: defaultConfig, normalizeConfig: normalizeConfig, defaultSim: defaultSim,
    sanitizeParams: sanitizeParams, paramIssues: paramIssues, funnel: funnel, financials: financials, reverse: reverse,
    leverMonth: leverMonth, efficiencyAt: efficiencyAt, project: project, compare: compare, computeAll: computeAll,
    findScenario: findScenario, round2: round2
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof window !== 'undefined' ? window : this);
