/* Motor central de cálculo — Calculadora de ROI Tatuador de Elite (modelo v2)
 * Funções puras. Tela, gráficos, tabela, resumo e PDF consomem computeAll().
 *
 * Modelo: investimento → distribuição (seguidores x contatos) → seguidores (audiência, nunca vira venda)
 *         → leads (contatos ÷ CPL + conversas extras da captação) → qualificados → vendas → faturamento.
 * Valores internos são esperados (fracionários). Quantidades exibidas são inteiras, arredondadas
 * ao mais próximo apenas no final, com subtotais reconciliados. Faturamento = vendas inteiras × ticket.
 */
(function (root) {
  'use strict';

  var CONFIG_VERSION = 2;

  function num(v, d) {
    var n = typeof v === 'number' ? v : parseFloat(v);
    return isFinite(n) ? n : (d === undefined ? 0 : d);
  }
  function nonNeg(v) { return Math.max(0, num(v)); }
  function rate(v) { return Math.min(1, Math.max(0, num(v))); }
  function roundQ(x) { return Math.floor(x + 0.5 + 1e-9); }
  function ceilQ(x) { return Math.ceil(x - 1e-9); }
  function div(a, b) { return (b > 0 && isFinite(a)) ? a / b : null; }
  function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }
  function ceilCents(x) { return Math.ceil(x * 100 - 1e-6) / 100; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  // ---------------------------------------------------------------- padrões oficiais TDE
  function defaultConfig() {
    return {
      version: CONFIG_VERSION,
      defaults: { investment: 1500, ticket: 1450, followersShare: 0.30, scenarioId: 'moderado' },
      acquisition: {
        cpl: 7.5,
        followerCostMode: 'historical',   // 'historical' = razão exata do histórico; 'manual' = valor abaixo
        followerCostManual: 1.35,
        indirectFollowersEnabled: true,
        extraConversationsEnabled: true,
        history: { followerInvestment: 1058.58, directFollowers: 784, contactInvestment: 2301.89, indirectFollowers: 161, extraConversations: 21 }
      },
      commercial: { qualificationRate: 0.30 },
      scenarios: [
        { id: 'conservador', name: 'Conservador', builtin: true, closeRate: 0.20,
          description: 'Tatuador com dificuldades comerciais: demora nas respostas, atendimento pouco estruturado, dificuldade para conduzir orçamentos e ausência de follow-up.' },
        { id: 'moderado', name: 'Moderado', builtin: true, closeRate: 0.32,
          description: 'Atendimento organizado e processo comercial razoavelmente estruturado: respostas rápidas, boa apresentação dos trabalhos e follow-up.' },
        { id: 'agressivo', name: 'Agressivo', builtin: true, closeRate: 0.48,
          description: 'Operação comercial avançada: atendimento rápido, processo estruturado, follow-up ativo, artista ou vendedor treinado e estratégias de fechamento.' }
      ],
      independent: {
        name: 'Sem Método TDE',
        description: 'Tatuador que investe em anúncios por conta própria, sem planejamento comercial estruturado.',
        cpl: 12.5, qualificationRate: 0.20, closeRate: 0.20, followerCost: 2.25,
        followMainDistribution: true, followersShare: 0.30,
        extraConversationsEnabled: false, indirectFollowersEnabled: false
      },
      levers: [
        { id: 'prospeccao', name: 'Ferramentas Google', salesPerMonth: 1, maturationMonths: 3, ticket: 0, monthlyCost: 0,
          description: 'Google Ads, Perfil da Empresa no Google e presença nas buscas locais.' },
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
      financial: { variableCostPct: 0, agencyFee: 0, includeAgencyFee: true, otherCosts: 0, nearBandPct: 0.15 }
    };
  }

  function copyTyped(target, src) {
    if (!isObj(src)) return;
    Object.keys(target).forEach(function (k) {
      if (src[k] === undefined) return;
      if (isObj(target[k])) copyTyped(target[k], src[k]);
      else if (typeof src[k] === typeof target[k]) target[k] = src[k];
    });
  }

  function normalizeLevers(input, d) {
    if (!Array.isArray(input)) return d;
    return d.map(function (def) {
      var s = input.filter(function (l) { return isObj(l) && l.id === def.id; })[0];
      if (!s) return def;
      var renamed = def.id === 'prospeccao' && /prospec/i.test(String(s.name || '')); // nome antigo passa para Ferramentas Google
      return {
        id: def.id, name: renamed ? def.name : String(s.name || def.name), salesPerMonth: nonNeg(s.salesPerMonth),
        maturationMonths: Math.round(nonNeg(s.maturationMonths)), ticket: nonNeg(s.ticket), monthlyCost: nonNeg(s.monthlyCost),
        description: renamed ? def.description : String(s.description || '')
      };
    });
  }

  // Mescla configuração salva com os padrões. Configurações da versão anterior (v1)
  // aproveitam apenas o que continua compatível: alavancas, custos financeiros e preferências de projeção.
  function normalizeConfig(input) {
    var d = defaultConfig();
    if (!isObj(input)) return d;
    var c = clone(d);
    var legacy = input.version !== CONFIG_VERSION;
    copyTyped(c.financial, input.financial);
    copyTyped(c.projection, input.projection);
    c.levers = normalizeLevers(input.levers, d.levers);
    if (!legacy) {
      copyTyped(c.defaults, input.defaults);
      copyTyped(c.acquisition, input.acquisition);
      copyTyped(c.commercial, input.commercial);
      copyTyped(c.independent, input.independent);
      if (Array.isArray(input.scenarios) && input.scenarios.length) {
        var sc = input.scenarios.filter(isObj).map(function (s, i) {
          return { id: String(s.id || ('custom-' + i)), name: String(s.name || 'Cenário ' + (i + 1)), builtin: !!s.builtin,
            closeRate: rate(s.closeRate), description: String(s.description || '') };
        });
        if (sc.length) c.scenarios = sc;
      }
    }
    // sanitização
    c.projection.months = c.projection.months === 12 ? 12 : 6;
    c.financial.variableCostPct = rate(c.financial.variableCostPct);
    c.financial.nearBandPct = rate(c.financial.nearBandPct);
    c.defaults.followersShare = rate(c.defaults.followersShare);
    c.independent.followersShare = rate(c.independent.followersShare);
    c.commercial.qualificationRate = rate(c.commercial.qualificationRate);
    c.independent.qualificationRate = rate(c.independent.qualificationRate);
    c.independent.closeRate = rate(c.independent.closeRate);
    if (c.acquisition.followerCostMode !== 'manual') c.acquisition.followerCostMode = 'historical';
    if (!findScenario(c, c.defaults.scenarioId)) c.defaults.scenarioId = c.scenarios[0].id;
    return c;
  }

  function defaultSim(config) {
    var c = config || defaultConfig();
    return {
      version: CONFIG_VERSION,
      name: '', investment: c.defaults.investment, ticket: c.defaults.ticket, followersShare: c.defaults.followersShare,
      mode: 'standard', reverseType: 'revenue', reverseTarget: 20000,
      scenarioId: c.defaults.scenarioId,
      leversEnabled: {},
      leverTickets: {},
      includeAgencyFee: c.financial.includeAgencyFee,
      projection: clone(c.projection),
      chartMetric: 'revenue',
      view: 'full'
    };
  }

  // ---------------------------------------------------------------- taxas históricas
  function historyRates(acq) {
    var h = acq.history || {};
    return {
      followerCost: div(nonNeg(h.followerInvestment), nonNeg(h.directFollowers)) || 0,       // R$ por seguidor direto
      indirectPerReal: div(nonNeg(h.indirectFollowers), nonNeg(h.contactInvestment)) || 0,    // seguidores por R$ em contatos
      conversationsPerReal: div(nonNeg(h.extraConversations), nonNeg(h.followerInvestment)) || 0 // conversas por R$ em captação
    };
  }

  // Parâmetros resolvidos de uma operação (Com TDE = cenário selecionado; Sem TDE = independente)
  function mainOperation(config, scenario, followersShare) {
    var a = config.acquisition, hr = historyRates(a);
    return {
      label: scenario.name,
      followersShare: rate(followersShare),
      cpl: nonNeg(a.cpl),
      followerCost: a.followerCostMode === 'manual' ? nonNeg(a.followerCostManual) : hr.followerCost,
      indirectPerReal: a.indirectFollowersEnabled ? hr.indirectPerReal : 0,
      conversationsPerReal: a.extraConversationsEnabled ? hr.conversationsPerReal : 0,
      qualificationRate: rate(config.commercial.qualificationRate),
      closeRate: rate(scenario.closeRate)
    };
  }
  function independentOperation(config, mainShare) {
    var s = config.independent, hr = historyRates(config.acquisition);
    return {
      label: s.name,
      followersShare: s.followMainDistribution ? rate(mainShare) : rate(s.followersShare),
      cpl: nonNeg(s.cpl),
      followerCost: nonNeg(s.followerCost),
      indirectPerReal: s.indirectFollowersEnabled ? hr.indirectPerReal : 0,
      conversationsPerReal: s.extraConversationsEnabled ? hr.conversationsPerReal : 0,
      qualificationRate: rate(s.qualificationRate),
      closeRate: rate(s.closeRate)
    };
  }

  function operationIssues(op, who) {
    var out = [];
    if (!(op.cpl > 0)) out.push(who + ': o CPL precisa ser maior que zero para gerar leads.');
    if (op.followersShare > 0 && !(op.followerCost > 0)) out.push(who + ': o custo por seguidor precisa ser maior que zero.');
    return out;
  }

  // ---------------------------------------------------------------- funil
  // efficiency multiplica a taxa de fechamento (usado na rampagem).
  function funnel(investment, op, efficiency) {
    var inv = nonNeg(investment);
    var eff = efficiency === undefined ? 1 : Math.max(0, num(efficiency, 1));
    var share = rate(op.followersShare);
    var followersBudget = round2(inv * share);
    var contactsBudget = round2(inv - followersBudget);

    var directE = op.followerCost > 0 ? followersBudget / op.followerCost : 0;
    var indirectE = contactsBudget * nonNeg(op.indirectPerReal);
    var contactLeadsE = op.cpl > 0 ? contactsBudget / op.cpl : 0;
    var extraE = followersBudget * nonNeg(op.conversationsPerReal);
    var leadsE = contactLeadsE + extraE;
    var q = rate(op.qualificationRate);
    var close = Math.min(1, rate(op.closeRate) * eff);
    var qualifiedE = leadsE * q;
    var salesE = qualifiedE * close;

    // inteiros exibidos, com subtotais reconciliados
    var followers = roundQ(directE + indirectE);
    var followersDirect = Math.min(followers, roundQ(directE));
    var leads = roundQ(leadsE);
    var contactLeads = Math.min(leads, roundQ(contactLeadsE));
    var qualified = Math.min(leads, roundQ(qualifiedE));
    var sales = Math.min(qualified, roundQ(salesE));

    return {
      investment: inv, followersShare: share, followersBudget: followersBudget, contactsBudget: contactsBudget,
      cpl: op.cpl, followerCost: op.followerCost,
      expected: { followersDirect: directE, followersIndirect: indirectE, followers: directE + indirectE,
        contactLeads: contactLeadsE, extraConversations: extraE, leads: leadsE, qualified: qualifiedE, sales: salesE },
      followers: followers, followersDirect: followersDirect, followersIndirect: followers - followersDirect,
      leads: leads, contactLeads: contactLeads, extraConversations: leads - contactLeads,
      qualified: qualified, sales: sales,
      notQualified: leads - qualified, qualifiedNotClosed: qualified - sales,
      qualificationRate: q, closeRate: close, conversionRate: q * close, efficiency: eff,
      costPerLead: op.cpl > 0 ? op.cpl : null,
      contactQualifiedCost: contactLeadsE * q > 0 ? contactsBudget / (contactLeadsE * q) : null,
      globalQualifiedCost: qualifiedE > 0 ? inv / qualifiedE : null,
      valid: op.cpl > 0
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
    var costsInformed = v > 0;

    var totalRevenue = round2(adRevenue + leverRevenue);
    var totalFixed = round2(adFixed + leverCosts);
    var totalVariable = round2(totalRevenue * v);
    var totalResult = round2(totalRevenue - totalVariable - totalFixed);

    return {
      investment: inv, ticket: t, adSales: adSales, adRevenue: adRevenue,
      variableCostPct: v, contributionMargin: 1 - v, agencyFee: fee, otherCosts: other,
      fixedCosts: adFixed, variableCosts: adVariable, result: adResult, costsInformed: costsInformed,
      roas: div(adRevenue, inv),
      roi: costsInformed && adFixed > 0 ? adResult / adFixed * 100 : null,
      costPerSale: adSales > 0 ? inv / adSales : null,
      breakEvenSales: breakEvenSales, breakEvenSimplified: !costsInformed,
      breakEvenProgress: breakEvenSales === null ? 0 : (breakEvenSales === 0 ? 1 : Math.min(1, adSales / breakEvenSales)),
      status: classify(adResult, adFixed, rate(fin.nearBandPct)),
      leverSales: leverSales, leverRevenue: leverRevenue, leverCosts: leverCosts,
      totalSales: adSales + leverSales, totalRevenue: totalRevenue, totalFixed: totalFixed,
      totalVariable: totalVariable, totalResult: totalResult,
      consolidatedReturn: div(totalRevenue, totalFixed)
    };
  }

  // ---------------------------------------------------------------- meta reversa
  // Vendas esperadas são lineares no investimento: vendas = investimento × k.
  function salesPerReal(op, efficiency) {
    var share = rate(op.followersShare);
    var eff = efficiency === undefined ? 1 : Math.max(0, num(efficiency, 1));
    var leadsPerReal = (op.cpl > 0 ? (1 - share) / op.cpl : 0) + share * nonNeg(op.conversationsPerReal);
    return leadsPerReal * rate(op.qualificationRate) * Math.min(1, rate(op.closeRate) * eff);
  }

  function reverse(o) {
    var t = nonNeg(o.ticket), target = nonNeg(o.target);
    var res = { type: o.type, target: target, feasible: true, reason: '' };
    var k = salesPerReal(o.op, o.efficiency);
    if (!(k > 0)) return Object.assign(res, { feasible: false, reason: 'Revise CPL, qualificação e taxa de fechamento: com os valores atuais nenhuma venda é gerada.' });
    if (o.type === 'revenue' && !(t > 0)) return Object.assign(res, { feasible: false, reason: 'Informe um ticket médio maior que zero.' });
    var S = o.type === 'revenue' ? ceilQ(target / t) : ceilQ(target);
    var inv = ceilCents(S / k);
    // ajuste fino de centavos: a divisão da verba é arredondada em centavos no funil
    for (var guard = 0; guard < 50 && funnel(inv, o.op, o.efficiency).expected.sales < S - 1e-9; guard++) inv = round2(inv + 0.01);
    while (inv >= 0.01 && funnel(round2(inv - 0.01), o.op, o.efficiency).expected.sales >= S - 1e-9) inv = round2(inv - 0.01);
    var current = nonNeg(o.currentInvestment);
    return Object.assign(res, { sales: S, revenue: round2(S * t), investment: inv, currentInvestment: current, difference: round2(inv - current) });
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
    return start + (fin - start) * Math.min(1, (month - 1) / (R - 1));
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
      var f = funnel(inv, o.op, eff);
      var per = levers.map(function (l) { var r = leverMonth(l, !!enabled[l.id], m, o.ticket); r.id = l.id; r.name = l.name; return r; });
      var lSales = per.reduce(function (a, r) { return a + r.sales; }, 0);
      var lRev = round2(per.reduce(function (a, r) { return a + r.revenue; }, 0));
      var lCost = round2(per.reduce(function (a, r) { return a + r.cost; }, 0));
      var fi = financials({ investment: inv, ticket: o.ticket, adSales: f.sales, leverSales: lSales, leverRevenue: lRev, leverCosts: lCost, fin: o.fin });
      rows.push({
        month: m, efficiency: eff, investment: inv, followers: f.followers, leads: f.leads, qualified: f.qualified,
        adSales: f.sales, leverSales: lSales, totalSales: f.sales + lSales, levers: per,
        adRevenue: fi.adRevenue, leverRevenue: lRev, totalRevenue: fi.totalRevenue, roas: fi.roas,
        leverCosts: lCost, totalFixed: fi.totalFixed, totalVariable: fi.totalVariable, totalResult: fi.totalResult
      });
    }
    function sum(k) { return rows.reduce(function (a, r) { return a + r[k]; }, 0); }
    // Totais = soma dos valores mensais exibidos (sem arredondar de novo).
    var totals = {
      investment: round2(sum('investment')), followers: sum('followers'), leads: sum('leads'), qualified: sum('qualified'),
      adSales: sum('adSales'), leverSales: sum('leverSales'), totalSales: sum('totalSales'),
      adRevenue: round2(sum('adRevenue')), leverRevenue: round2(sum('leverRevenue')), totalRevenue: round2(sum('totalRevenue')),
      leverCosts: round2(sum('leverCosts')), totalFixed: round2(sum('totalFixed')), totalVariable: round2(sum('totalVariable')),
      totalResult: round2(sum('totalResult'))
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
    var b = funnel(o.investment, o.base, 1);
    var i = funnel(o.investment, o.improved, o.efficiency);
    var fb = financials({ investment: o.investment, ticket: o.ticket, adSales: b.sales, fin: o.fin });
    var fi = financials({ investment: o.investment, ticket: o.ticket, adSales: i.sales, fin: o.fin });
    var bc = b.cpl, ic = i.cpl;
    return {
      base: { funnel: b, fin: fb, label: o.base.label }, improved: { funnel: i, fin: fi, label: o.improved.label },
      extraLeads: i.leads - b.leads,
      extraQualified: i.qualified - b.qualified,
      extraSales: i.sales - b.sales,
      incrementalRevenue: round2(fi.adRevenue - fb.adRevenue),
      cplReduction: round2(bc - ic),
      cplReductionPct: bc > 0 ? (bc - ic) / bc * 100 : null,
      conversionBase: b.conversionRate, conversionImproved: i.conversionRate,
      conversionDeltaPP: (i.conversionRate - b.conversionRate) * 100,
      conversionRelativePct: b.conversionRate > 0 ? (i.conversionRate / b.conversionRate - 1) * 100 : null,
      roasDelta: (fi.roas !== null && fb.roas !== null) ? fi.roas - fb.roas : null
    };
  }

  // ---------------------------------------------------------------- orquestração
  function findScenario(config, id) {
    for (var k = 0; k < config.scenarios.length; k++) if (config.scenarios[k].id === id) return config.scenarios[k];
    return null;
  }

  function computeAll(configIn, sim) {
    var config = normalizeConfig(configIn);
    var scenario = findScenario(config, sim.scenarioId) || findScenario(config, 'moderado') || config.scenarios[0];
    var share = sim.followersShare === undefined ? config.defaults.followersShare : rate(sim.followersShare);
    var op = mainOperation(config, scenario, share);
    var indep = independentOperation(config, share);
    var proj = Object.assign({}, config.projection, sim.projection || {});
    var refEff = Math.max(0, num(proj.finalEfficiency, 1));
    var ticket = nonNeg(sim.ticket), currentInv = nonNeg(sim.investment);
    var fin = Object.assign({}, config.financial);
    if (typeof sim.includeAgencyFee === 'boolean') fin.includeAgencyFee = sim.includeAgencyFee;
    var issues = operationIssues(op, 'Com Método TDE').concat(operationIssues(indep, 'Sem Método TDE'));

    var rev = null, investment = currentInv;
    if (sim.mode === 'reverse') {
      rev = reverse({ type: sim.reverseType, target: sim.reverseTarget, ticket: ticket, op: op, efficiency: refEff, currentInvestment: currentInv });
      if (rev.feasible) investment = rev.investment;
    }

    var f = funnel(investment, op, refEff);

    var enabled = sim.leversEnabled || {};
    // Valor por venda de cada alavanca: ajuste da simulação > ticket próprio configurado > ticket médio do prospect.
    var lt = sim.leverTickets || {};
    var levers = config.levers.map(function (l) {
      var own = nonNeg(lt[l.id]), cfgT = nonNeg(l.ticket);
      return Object.assign({}, l, { ticket: own > 0 ? own : (cfgT > 0 ? cfgT : ticket), ticketSource: own > 0 ? 'simulation' : (cfgT > 0 ? 'config' : 'main') });
    });
    var maxMat = levers.reduce(function (a, l) { return enabled[l.id] ? Math.max(a, Math.round(nonNeg(l.maturationMonths))) : a; }, 0);
    function leverAgg(month) {
      var per = levers.map(function (l) { var r = leverMonth(l, !!enabled[l.id], month, ticket); r.id = l.id; return r; });
      return {
        per: per, sales: per.reduce(function (a, r) { return a + r.sales; }, 0),
        revenue: round2(per.reduce(function (a, r) { return a + r.revenue; }, 0)),
        cost: round2(per.reduce(function (a, r) { return a + r.cost; }, 0))
      };
    }
    var nowL = leverAgg(1), matureL = leverAgg(maxMat + 1);
    var finAds = financials({ investment: investment, ticket: ticket, adSales: f.sales, fin: fin });
    var finNow = financials({ investment: investment, ticket: ticket, adSales: f.sales, leverSales: nowL.sales, leverRevenue: nowL.revenue, leverCosts: nowL.cost, fin: fin });
    var finMature = financials({ investment: investment, ticket: ticket, adSales: f.sales, leverSales: matureL.sales, leverRevenue: matureL.revenue, leverCosts: matureL.cost, fin: fin });

    var cmp = compare({ investment: investment, ticket: ticket, base: indep, improved: op, efficiency: refEff, fin: fin });

    // Totais mensais com as alavancas ativas (regime, após a maturação). Os campos de anúncios continuam separados.
    var TOT = {
      active: matureL.sales > 0, month: maxMat + 1,
      adSales: f.sales, leverSales: matureL.sales, sales: f.sales + matureL.sales,
      adRevenue: finAds.adRevenue, leverRevenue: matureL.revenue, revenue: round2(finAds.adRevenue + matureL.revenue),
      leverCosts: matureL.cost, totalReturn: div(round2(finAds.adRevenue + matureL.revenue), investment + matureL.cost)
    };
    cmp.withLevers = {
      improvedSales: cmp.improved.funnel.sales + matureL.sales,
      improvedRevenue: round2(cmp.improved.fin.adRevenue + matureL.revenue),
      improvedReturn: div(round2(cmp.improved.fin.adRevenue + matureL.revenue), investment + matureL.cost),
      extraSales: cmp.improved.funnel.sales + matureL.sales - cmp.base.funnel.sales,
      incrementalRevenue: round2(cmp.improved.fin.adRevenue + matureL.revenue - cmp.base.fin.adRevenue)
    };

    var common = { investment: investment, ticket: ticket, projection: proj, levers: levers, fin: fin };
    var projection = project(Object.assign({}, common, { op: op, leversEnabled: enabled }));
    var projBase = project(Object.assign({}, common, { op: indep, leversEnabled: {}, projection: Object.assign({}, proj, { rampEnabled: false, finalEfficiency: 1 }) }));
    var projImp = project(Object.assign({}, common, { op: op, leversEnabled: {} }));

    return {
      config: config, scenario: { id: scenario.id, name: scenario.name, description: scenario.description, closeRate: scenario.closeRate },
      op: op, independent: indep, issues: issues, ticket: ticket, currentInvestment: currentInv, investment: investment, mode: sim.mode,
      reverse: rev, funnel: f, financial: finAds, total: TOT,
      levers: { now: finNow, mature: finMature, maturationMonth: maxMat + 1, list: levers },
      compare: cmp, projection: projection, compareProjection: { base: projBase, improved: projImp },
      projectionSettings: proj, fin: fin
    };
  }

  var api = {
    CONFIG_VERSION: CONFIG_VERSION, defaultConfig: defaultConfig, normalizeConfig: normalizeConfig, defaultSim: defaultSim,
    historyRates: historyRates, mainOperation: mainOperation, independentOperation: independentOperation,
    funnel: funnel, financials: financials, reverse: reverse, salesPerReal: salesPerReal,
    leverMonth: leverMonth, efficiencyAt: efficiencyAt, project: project, compare: compare, computeAll: computeAll,
    findScenario: findScenario, round2: round2
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Engine = api;
})(typeof window !== 'undefined' ? window : this);
