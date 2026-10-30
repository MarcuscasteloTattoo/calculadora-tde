(function () {
  'use strict';
  var E = window.Engine;

  // ------------------------------------------------------------ ícones (Lucide, traço 2)
  var ICONS = {
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    sliders: '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    trend: '<path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    gear: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
  };
  function icon(n, size) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>';
  }
  function hydrateIcons(root) {
    (root || document).querySelectorAll('i[data-icon]').forEach(function (el) { el.outerHTML = icon(el.getAttribute('data-icon'), el.getAttribute('data-size') || 18); });
  }

  // ------------------------------------------------------------ formatação
  var NF = {};
  function nf(min, max) { var k = min + '-' + max; return NF[k] || (NF[k] = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: max })); }
  var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  var BRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0, minimumFractionDigits: 0 });
  var BRLC = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 });
  function ok(v) { return v !== null && v !== undefined && isFinite(v); }
  function money(v) { return ok(v) ? BRL.format(v) : '—'; }
  function money0(v) { return ok(v) ? BRL0.format(v) : '—'; }
  function moneyC(v) { return BRLC.format(v); }
  function signedMoney(v) { return (v > 0 ? '+' : '') + money(v); }
  function qty(v) { return ok(v) ? (Number.isInteger(v) ? nf(0, 0).format(v) : nf(0, 1).format(v)) : '—'; }
  function signedQty(v) { return (v > 0 ? '+' : '') + qty(v); }
  function xr(v) { return ok(v) ? nf(2, 2).format(v) + 'x' : '—'; }
  function pct(v, d) { return ok(v) ? nf(0, d === undefined ? 1 : d).format(v) + '%' : '—'; }
  function rateTxt(r) { return pct(r * 100, 1); }
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function plural(n, a, b) { return Math.abs(n - 1) < 1e-9 ? a : b; }

  function parseNum(str) {
    if (str === null || str === undefined) return NaN;
    var s = String(str).replace(/R\$|%|x|\s/gi, '').trim();
    if (!s || s === '-' || s === ',') return NaN;
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    else {
      var parts = s.split('.');
      if (parts.length > 2) s = parts.join('');
      else if (parts.length === 2 && parts[1].length === 3 && parts[0].replace('-', '').length > 0) s = parts.join('');
    }
    var n = Number(s);
    return isFinite(n) ? n : NaN;
  }
  function fmtInput(kind, v) {
    if (kind === 'money') return nf(2, 2).format(v || 0);
    if (kind === 'pct') return nf(0, 2).format((v || 0) * 100);
    if (kind === 'int') return String(Math.round(v || 0));
    if (kind === 'num') return nf(0, 2).format(v || 0);
    return v;
  }
  function validate(kind, raw, opt) {
    opt = opt || {};
    var n = parseNum(raw);
    if (isNaN(n)) return { error: 'Digite um número válido.' };
    if (n < 0) return { error: 'Use um valor maior ou igual a zero.' };
    if (kind === 'pct') {
      var max = opt.max === undefined ? 100 : opt.max;
      if (n > max) return { error: 'O máximo é ' + max + '%.' };
      return { value: n / 100 };
    }
    if (kind === 'int') {
      if (!Number.isInteger(n)) return { error: 'Use um número inteiro.' };
      if (opt.max !== undefined && n > opt.max) return { error: 'O máximo é ' + opt.max + '.' };
      if (opt.min !== undefined && n < opt.min) return { error: 'O mínimo é ' + opt.min + '.' };
    }
    if (opt.positive && !(n > 0)) return { error: opt.positiveMsg || 'O valor precisa ser maior que zero.' };
    return { value: n };
  }

  // ------------------------------------------------------------ armazenamento local
  var K_CFG = 'tde-roi:config', K_SIM = 'tde-roi:sim';
  var LEGACY_KEYS = { 'tde-roi:config': 'castelo-roi:config:v1', 'tde-roi:sim': 'castelo-roi:sim:v1' }; // instalações antigas
  function load(k) {
    try {
      var s = localStorage.getItem(k);
      if (!s && LEGACY_KEYS[k]) { s = localStorage.getItem(LEGACY_KEYS[k]); if (s) { localStorage.setItem(k, s); localStorage.removeItem(LEGACY_KEYS[k]); } }
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var config = E.normalizeConfig(load(K_CFG));
  var sim = normalizeSim(load(K_SIM));
  var draft = null;
  var model = null;

  // Simulação salva da versão anterior: preserva os dados do prospect; valores que eram apenas o
  // padrão antigo (R$ 1.500 / R$ 1.500) passam a usar os padrões oficiais TDE.
  function normalizeSim(s) {
    var d = E.defaultSim(config);
    if (!s || typeof s !== 'object') return d;
    var legacy = s.version !== E.CONFIG_VERSION;
    Object.keys(d).forEach(function (k) {
      if (s[k] === undefined || k === 'version') return;
      if (k === 'projection') d.projection = Object.assign(d.projection, s.projection || {});
      else if (k === 'leversEnabled') d.leversEnabled = Object.assign({}, s.leversEnabled || {});
      else if (typeof s[k] === typeof d[k]) d[k] = s[k];
    });
    if (legacy) {
      d.scenarioId = config.defaults.scenarioId;
      d.followersShare = config.defaults.followersShare;
      if (s.investment === 1500 && s.ticket === 1500) { d.investment = config.defaults.investment; d.ticket = config.defaults.ticket; }
      if (['revenue', 'investment', 'sales', 'roas', 'compare'].indexOf(d.chartMetric) < 0) d.chartMetric = 'revenue';
      d.view = 'full';
    }
    if (!E.findScenario(config, d.scenarioId)) d.scenarioId = config.defaults.scenarioId;
    return d;
  }
  function cfg() { return draft || config; }

  // ------------------------------------------------------------ utilidades de DOM
  function $(id) { return document.getElementById(id); }
  function setHTML(el, html) {
    var a = document.activeElement, id = a && el.contains(a) ? a.id : null;
    el.innerHTML = html; hydrateIcons(el);
    if (id) { var n = document.getElementById(id); if (n) n.focus(); }
  }
  function toast(msg, ms) {
    var root = $('toast-root');
    root.innerHTML = '<div class="toast" role="status">' + esc(msg) + '</div>';
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { root.innerHTML = ''; }, ms || 3200);
  }
  function setPressed(group, attr, val) { $(group).querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === String(val))); }); }
  function setSwitch(id, on) { $(id).setAttribute('aria-checked', String(!!on)); }
  function tip(text) { return '<span class="tip" tabindex="0" data-tip="' + esc(text) + '">?</span>'; }
  function kpi(label, value, sub, cls, tipText) {
    return '<div class="kpi ' + (cls || '') + '"><div class="k">' + label + (tipText ? tip(tipText) : '') + '</div><div class="v">' + value + '</div>' + (sub ? '<div class="s">' + sub + '</div>' : '') + '</div>';
  }

  // ------------------------------------------------------------ ciclo principal
  function recompute() {
    model = E.computeAll(cfg(), sim);
    renderAll();
    store(K_SIM, sim);
  }
  function renderAll() {
    renderModeUI(); renderScenarios(); renderReverse(); renderDistribution(); renderAudience(); renderFunnel();
    renderKpis(); renderCosts(); renderCompare(); renderProjectionControls(); renderChart(); renderTable(); renderLevers(); renderSimple();
  }

  // ------------------------------------------------------------ entradas
  function bindNumInput(el, errEl, kindArg, get, set, opt) {
    function K() { return typeof kindArg === 'function' ? kindArg() : kindArg; }
    el.addEventListener('input', function () {
      var kind = K(), r = validate(kind, el.value, opt);
      el.classList.toggle('bad', !!r.error);
      if (errEl) errEl.textContent = r.error || '';
      if (r.error) set(kind === 'money' && el.value.trim() === '' ? 0 : get());
      else set(r.value);
      recompute();
    });
    el.addEventListener('blur', function () {
      var kind = K(), r = validate(kind, el.value, opt);
      if (!r.error || el.value.trim() === '') { el.value = fmtInput(kind, get()); el.classList.remove('bad'); if (errEl) errEl.textContent = ''; }
    });
    el.addEventListener('focus', function () { setTimeout(function () { try { el.select(); } catch (e) {} }, 0); });
  }

  var NUM_INPUTS = ['in-investment', 'in-ticket', 'in-target', 'in-share-followers', 'in-share-contacts', 'in-growth', 'in-ramp', 'in-eff-start', 'in-eff-final'];
  function syncInputs() {
    $('in-name').value = sim.name;
    $('in-investment').value = fmtInput('money', sim.investment);
    $('in-ticket').value = fmtInput('money', sim.ticket);
    $('in-target').value = sim.reverseType === 'sales' ? fmtInput('num', sim.reverseTarget) : fmtInput('money', sim.reverseTarget);
    $('in-share-followers').value = fmtInput('pct', sim.followersShare);
    $('in-share-contacts').value = fmtInput('pct', 1 - sim.followersShare);
    $('in-growth').value = fmtInput('pct', sim.projection.growthPct);
    $('in-ramp').value = fmtInput('int', sim.projection.rampMonths);
    $('in-eff-start').value = fmtInput('pct', sim.projection.startEfficiency);
    $('in-eff-final').value = fmtInput('pct', sim.projection.finalEfficiency);
    NUM_INPUTS.forEach(function (id) { $(id).classList.remove('bad'); var e = $(id.replace('in-', 'err-')); if (e) e.textContent = ''; });
  }

  function setConfigFlag(path, value) {
    var ks = path.split('.'), o = config;
    for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    o[ks[ks.length - 1]] = value;
    store(K_CFG, config);
    recompute();
  }

  function bindStatic() {
    $('in-name').addEventListener('input', function (e) { sim.name = e.target.value.slice(0, 80); store(K_SIM, sim); });
    bindNumInput($('in-investment'), $('err-investment'), 'money', function () { return sim.investment; }, function (v) { sim.investment = v; });
    bindNumInput($('in-ticket'), $('err-ticket'), 'money', function () { return sim.ticket; }, function (v) { sim.ticket = v; });
    bindNumInput($('in-target'), $('err-target'), function () { return sim.reverseType === 'sales' ? 'num' : 'money'; }, function () { return sim.reverseTarget; }, function (v) { sim.reverseTarget = v; });
    bindNumInput($('in-share-followers'), $('err-share-followers'), 'pct', function () { return sim.followersShare; }, function (v) {
      sim.followersShare = v; if (document.activeElement !== $('in-share-contacts')) $('in-share-contacts').value = fmtInput('pct', 1 - v);
    });
    bindNumInput($('in-share-contacts'), $('err-share-contacts'), 'pct', function () { return 1 - sim.followersShare; }, function (v) {
      sim.followersShare = Math.round((1 - v) * 1e6) / 1e6; if (document.activeElement !== $('in-share-followers')) $('in-share-followers').value = fmtInput('pct', sim.followersShare);
    });
    bindNumInput($('in-growth'), $('err-growth'), 'pct', function () { return sim.projection.growthPct; }, function (v) { sim.projection.growthPct = v; }, { max: 100 });
    bindNumInput($('in-ramp'), $('err-ramp'), 'int', function () { return sim.projection.rampMonths; }, function (v) { sim.projection.rampMonths = v; }, { min: 1, max: 12 });
    bindNumInput($('in-eff-start'), $('err-eff-start'), 'pct', function () { return sim.projection.startEfficiency; }, function (v) { sim.projection.startEfficiency = v; }, { max: 200 });
    bindNumInput($('in-eff-final'), $('err-eff-final'), 'pct', function () { return sim.projection.finalEfficiency; }, function (v) { sim.projection.finalEfficiency = v; }, { max: 200 });

    $('seg-mode').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sim.mode = b.getAttribute('data-mode'); recompute(); });
    $('seg-rtype').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var t = b.getAttribute('data-rtype'); if (t === sim.reverseType) return;
      sim.reverseType = t; sim.reverseTarget = t === 'sales' ? 14 : 20000;
      $('in-target').value = t === 'sales' ? fmtInput('num', sim.reverseTarget) : fmtInput('money', sim.reverseTarget);
      $('err-target').textContent = ''; $('in-target').classList.remove('bad');
      recompute();
    });
    $('scen-buttons').addEventListener('click', function (e) { var b = e.target.closest('button[data-scen]'); if (!b) return; sim.scenarioId = b.getAttribute('data-scen'); recompute(); });
    $('sw-fee').addEventListener('click', function () { sim.includeAgencyFee = !sim.includeAgencyFee; recompute(); });
    $('sw-indirect').addEventListener('click', function () { setConfigFlag('acquisition.indirectFollowersEnabled', !config.acquisition.indirectFollowersEnabled); });
    $('sw-extra').addEventListener('click', function () { setConfigFlag('acquisition.extraConversationsEnabled', !config.acquisition.extraConversationsEnabled); });
    $('seg-months').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sim.projection.months = Number(b.getAttribute('data-months')); recompute(); });
    $('seg-months-simple').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sim.projection.months = Number(b.getAttribute('data-months')); recompute(); });
    $('simple-levers').addEventListener('click', function (e) { var sw = e.target.closest('[data-lever]'); if (!sw) return; var id = sw.getAttribute('data-lever'); sim.leversEnabled[id] = !sim.leversEnabled[id]; recompute(); });
    $('seg-view').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sim.view = b.getAttribute('data-view'); recompute(); });
    $('sw-growth').addEventListener('click', function () { sim.projection.growthEnabled = !sim.projection.growthEnabled; recompute(); });
    $('sw-ramp').addEventListener('click', function () { sim.projection.rampEnabled = !sim.projection.rampEnabled; recompute(); });
    $('seg-metric').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; sim.chartMetric = b.getAttribute('data-metric'); recompute(); });
    $('levers').addEventListener('input', function (e) {
      var el = e.target; if (!el.hasAttribute('data-lever-ticket')) return;
      var id = el.getAttribute('data-lever-ticket');
      if (!sim.leverTickets) sim.leverTickets = {};
      if (el.value.trim() === '') { delete sim.leverTickets[id]; el.classList.remove('bad'); recompute(); return; }
      var r = validate('money', el.value);
      el.classList.toggle('bad', !!r.error);
      if (r.error) return;
      if (r.value > 0) sim.leverTickets[id] = r.value; else delete sim.leverTickets[id];
      recompute();
    });
    $('levers').addEventListener('focusin', function (e) { var el = e.target; if (el.hasAttribute && el.hasAttribute('data-lever-ticket')) setTimeout(function () { try { el.select(); } catch (x) {} }, 0); });
    $('levers').addEventListener('focusout', function (e) {
      var el = e.target; if (!el.hasAttribute || !el.hasAttribute('data-lever-ticket')) return;
      setTimeout(function () { el.classList.remove('bad'); renderLevers(); }, 0);
    });
    $('levers').addEventListener('click', function (e) {
      var rs = e.target.closest('[data-lever-ticket-reset]');
      if (rs) { var rid = rs.getAttribute('data-lever-ticket-reset'); if (sim.leverTickets && sim.leverTickets[rid]) delete sim.leverTickets[rid]; else openSettings('alavancas'); recompute(); return; }
      var sw = e.target.closest('[data-lever]');
      if (sw) { var id = sw.getAttribute('data-lever'); sim.leversEnabled[id] = !sim.leversEnabled[id]; recompute(); return; }
      if (e.target.closest('[data-lever-cfg]')) openSettings('alavancas');
    });
    $('btn-settings').addEventListener('click', function () { openSettings('investimento'); });
    $('btn-params').addEventListener('click', function () { openSettings('comercial'); });
    $('btn-costs').addEventListener('click', function () { openSettings('financeiro'); });
    $('btn-new').addEventListener('click', newSimulation);
    $('btn-copy').addEventListener('click', copySummary);
    $('btn-pdf').addEventListener('click', generatePdf);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('modal-root').innerHTML) closeModal(); });
  }

  function newSimulation() {
    var btn = $('btn-new');
    if (!btn._armed) {
      btn._armed = true; btn.innerHTML = icon('refresh') + 'Confirmar nova simulação';
      setTimeout(function () { if (btn._armed) { btn._armed = false; btn.innerHTML = icon('refresh') + 'Nova simulação'; } }, 3500);
      return;
    }
    btn._armed = false; btn.innerHTML = icon('refresh') + 'Nova simulação';
    var keepView = sim.view;
    sim = E.defaultSim(config); sim.view = keepView;
    syncInputs(); recompute(); $('in-name').focus();
    toast('Nova simulação iniciada com os parâmetros padrão salvos.');
  }

  // ------------------------------------------------------------ renderizações
  function renderModeUI() {
    setPressed('seg-mode', 'data-mode', sim.mode);
    setPressed('seg-rtype', 'data-rtype', sim.reverseType);
    var rev = sim.mode === 'reverse';
    $('reverse-inputs').hidden = !rev;
    $('f-investment').querySelector('label').firstChild.textContent = rev ? 'Investimento atual em anúncios ' : 'Investimento mensal em anúncios ';
    var sales = sim.reverseType === 'sales';
    $('lbl-target').textContent = sales ? 'Meta de vendas por mês' : 'Meta de faturamento mensal';
    $('target-prefix').hidden = sales;
    $('target-wrap').classList.toggle('prefix', !sales);
    $('funnel-sub').textContent = rev ? 'Funil com o investimento mínimo para atingir a meta.' : 'Mês de referência, com a operação madura.';
    setSwitch('sw-fee', model.fin.includeAgencyFee);
    setSwitch('sw-indirect', cfg().acquisition.indirectFollowersEnabled);
    setSwitch('sw-extra', cfg().acquisition.extraConversationsEnabled);
  }

  function renderScenarios() {
    var html = cfg().scenarios.map(function (s) {
      return '<button type="button" id="scen-' + esc(s.id) + '" data-scen="' + esc(s.id) + '" aria-pressed="' + (s.id === model.scenario.id) + '">' + esc(s.name) + '</button>';
    }).join('');
    if ($('scen-buttons')._sig !== html) { setHTML($('scen-buttons'), html); $('scen-buttons')._sig = html; }
    $('scen-desc').textContent = model.scenario.description || '';
    var f = model.funnel;
    $('scen-chips').innerHTML =
      '<span class="chip">Qualificação <b>' + rateTxt(f.qualificationRate) + '</b></span>' +
      '<span class="chip">Fechamento <b>' + rateTxt(model.op.closeRate) + '</b></span>' +
      '<span class="chip">Conversão geral <b>' + rateTxt(model.op.qualificationRate * model.op.closeRate) + '</b></span>' +
      '<span class="chip">CPL <b>' + money(model.op.cpl) + '</b></span>';
    $('scen-issues').innerHTML = model.issues.length ? '<div class="alert red" style="margin-top:10px">' + model.issues.map(esc).join(' ') + ' Ajuste em Configurações.</div>' : '';
  }

  function renderReverse() {
    var el = $('reverse-result');
    if (sim.mode !== 'reverse') { el.innerHTML = ''; return; }
    var r = model.reverse, f = model.funnel;
    if (!r.feasible) { el.innerHTML = '<div class="alert red" style="margin-top:14px">Não é possível calcular a meta: ' + esc(r.reason) + '</div>'; return; }
    var diff = r.difference;
    var diffTxt = Math.abs(diff) < 0.005 ? 'Igual ao atual' : (diff > 0 ? '+' : '') + money(diff) + ' por mês';
    var metaTxt = r.type === 'revenue' ? money(r.target) + ' de faturamento' : qty(r.target) + ' ' + plural(r.target, 'venda', 'vendas');
    el.innerHTML = '<div class="box reverse-box">' +
      '<div class="kv"><span>Meta</span><b>' + metaTxt + '</b></div>' +
      '<div class="kv"><span>Vendas necessárias</span><b>' + qty(r.sales) + (r.type === 'revenue' ? ' (' + money(r.revenue) + ')' : '') + '</b></div>' +
      '<div class="kv"><span>Leads qualificados</span><b>' + qty(f.qualified) + '</b></div>' +
      '<div class="kv"><span>Leads recebidos</span><b>' + qty(f.leads) + '</b></div>' +
      '<div class="kv" style="border-top:1px solid var(--line);padding-top:10px"><span>Investimento mínimo</span><b style="color:var(--gold);font-size:16px">' + money(r.investment) + '</b></div>' +
      '<div class="kv"><span>Investimento atual</span><b>' + money(r.currentInvestment) + '</b></div>' +
      '<div class="kv"><span>Diferença</span><b style="color:' + (diff > 0 ? 'var(--fg)' : 'var(--gold)') + '">' + diffTxt + '</b></div>' +
      '</div><p class="hint" style="margin-top:8px">Mesmas fórmulas do modo padrão, com a distribuição, o CPL, as conversas da captação e as taxas do cenário ' + esc(model.scenario.name) + '.</p>';
  }

  function renderDistribution() {
    var f = model.funnel, s = f.followersShare;
    $('dist-bar').innerHTML = '<span class="follow" style="width:' + (s * 100) + '%"></span><span class="contact" style="width:' + ((1 - s) * 100) + '%"></span>';
    $('dist-followers').innerHTML = money(f.followersBudget) + '<small>Captação de seguidores</small>';
    $('dist-contacts').innerHTML = money(f.contactsBudget) + '<small>Campanhas de contatos</small>';
    ['in-share-followers', 'in-share-contacts'].forEach(function (id) {
      var el = $(id); if (document.activeElement !== el && !el.classList.contains('bad')) el.value = fmtInput('pct', id === 'in-share-followers' ? s : 1 - s);
    });
  }

  function renderAudience() {
    var f = model.funnel, a = cfg().acquisition, hist = a.followerCostMode !== 'manual';
    $('audience').innerHTML = '<div class="aud">' +
      kpi('Investimento em seguidores', money(f.followersBudget), pct(f.followersShare * 100, 0) + ' da verba') +
      kpi('Custo por seguidor', f.followerCost > 0 ? money(f.followerCost) : '—', hist ? 'Referência histórica' : 'Valor manual', '', hist ? 'Razão exata do histórico: R$ ' + nf(2, 2).format(a.history.followerInvestment) + ' ÷ ' + qty(a.history.directFollowers) + ' seguidores. Exibido arredondado.' : '') +
      kpi('Seguidores da captação', qty(f.followersDirect), 'Gerados pela verba de seguidores') +
      '</div><div class="aud-total"><span>' +
      (a.indirectFollowersEnabled ? qty(f.followersDirect) + ' da captação + ' + qty(f.followersIndirect) + ' adicionais das campanhas de contatos' : 'Somente seguidores da captação') +
      '</span><b>' + qty(f.followers) + '</b></div><div class="aud-meta">Total estimado de novos seguidores por mês.</div>';
  }

  function renderFunnel() {
    var f = model.funnel, base = f.leads > 0 ? f.leads : 1;
    function stage(ic, name, value, sub, w, final, plain) {
      return '<div class="stage' + (final ? ' final' : '') + '"><div class="ic">' + icon(ic) + '</div><div style="min-width:0"><div class="nm">' + name + '</div>' +
        (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div><div class="value' + (plain ? '' : ' gold') + '">' + value + '</div>' +
        (w !== null ? '<div class="bar" style="width:' + Math.max(0, Math.min(100, w)) + '%"></div>' : '') + '</div>';
    }
    function conn(t) { return '<div class="conn">' + t + '</div>'; }
    var effNote = Math.abs(f.efficiency - 1) > 1e-9 ? ' (eficiência ' + pct(f.efficiency * 100, 0) + ')' : '';
    var leadSub = qty(f.contactLeads) + ' das campanhas de contatos (CPL ' + money(f.cpl) + ')' + (cfg().acquisition.extraConversationsEnabled ? ' + ' + qty(f.extraConversations) + ' conversas da captação' : '');
    $('funnel').innerHTML =
      conn('Verba de contatos <b>' + money(f.contactsBudget) + '</b> ÷ CPL <b>' + money(f.cpl) + '</b>') +
      stage('target', 'Leads gerados', qty(f.leads), leadSub, 100) +
      conn('× <b>' + rateTxt(f.qualificationRate) + '</b> taxa de qualificação') +
      stage('filter', 'Leads qualificados', qty(f.qualified), 'Intenção real, estilo compatível e potencial de compra', f.qualified / base * 100) +
      conn('× <b>' + rateTxt(f.closeRate) + '</b> fechamento do cenário ' + esc(model.scenario.name) + effNote) +
      stage('check', 'Vendas realizadas', qty(f.sales), 'Conversão geral de ' + rateTxt(f.conversionRate) + ' dos leads', f.sales / base * 100) +
      conn('× ticket médio de <b>' + money(model.ticket) + '</b>') +
      stage('dollar', 'Faturamento projetado', money(model.total.revenue), model.total.active ? leverBreak(model.financial.adRevenue, f.sales) : qty(f.sales) + ' ' + plural(f.sales, 'venda', 'vendas') + ' × ' + money(model.ticket), null, true);
    $('policy-note').textContent = 'Cálculo com valores esperados; os inteiros exibidos são arredondados apenas no final. Faturamento = vendas inteiras × ticket médio.' +
      (cfg().acquisition.extraConversationsEnabled ? ' As conversas da captação são tratadas como contatos distintos dos leads das campanhas de contatos (sem deduplicação comprovada).' : '');
    if (!f.valid) $('policy-note').textContent = 'O CPL está zerado. Ajuste em Configurações para gerar leads.';
  }

  var STATUS = { above: 'Acima do equilíbrio', near: 'Próximo do equilíbrio', below: 'Abaixo do equilíbrio' };

  function renderKpis() {
    var fi = model.financial, f = model.funnel;
    var be = fi.breakEvenSales;
    $('kpis').innerHTML =
      kpi('Faturamento bruto projetado', money(model.total.revenue), model.total.active ? leverBreak(fi.adRevenue, fi.adSales) : qty(fi.adSales) + ' ' + plural(fi.adSales, 'venda', 'vendas') + ' × ' + money(fi.ticket), 'pos') +
      (model.total.active ? kpi('ROAS total (com alavancas)', xr(model.total.totalReturn), 'Somente anúncios: ' + xr(fi.roas), 'pos', 'Faturamento total ÷ (investimento em anúncios + custos das alavancas). ROAS não é lucro.')
        : kpi('ROAS hipotético', xr(fi.roas), 'Faturamento ÷ investimento em anúncios', 'pos', 'Retorno bruto sobre a mídia. ROAS não é lucro.')) +
      kpi('Custo por venda', fi.costPerSale === null ? 'Sem vendas' : money(fi.costPerSale), 'Investimento ÷ vendas dos anúncios') +
      kpi('Custo por lead (CPL)', money(f.costPerLead), 'Referência das campanhas de contatos') +
      kpi('CPL qualificado das campanhas', money(f.contactQualifiedCost), 'Verba de contatos ÷ qualificados dessas campanhas', '', 'Considera só a verba e os leads das campanhas de contatos.') +
      kpi('Custo global por qualificado', money(f.globalQualifiedCost), 'Investimento total ÷ total de qualificados', '', 'Inclui a verba de seguidores e as conversas da captação.') +
      kpi('ROI estimado', fi.roi === null ? '—' : (fi.roi > 0 ? '+' : '') + pct(fi.roi, 0), fi.roi === null ? 'Informe a margem de contribuição em Configurações' : 'Resultado ÷ custos fixos considerados', fi.roi === null ? '' : (fi.roi >= 0 ? 'pos' : 'neg'), 'Faturamento bruto não é lucro. O ROI só aparece com custos variáveis (margem de contribuição) informados.') +
      kpi(fi.breakEvenSimplified ? 'Equilíbrio simplificado' : 'Ponto de equilíbrio', be === null ? '—' : qty(be) + ' ' + plural(be, 'venda', 'vendas'), fi.breakEvenSimplified ? 'Sem margem informada: cobre só os custos fixos' : 'Pela margem de contribuição por venda', '', 'Vendas necessárias para cobrir anúncios, honorários incluídos e outros custos, usando a margem de contribuição de cada venda.');

    $('status-pill').innerHTML = '<span class="pill ' + fi.status + '">' + STATUS[fi.status] + '</span>';
    var text;
    if (be === null) text = 'Informe um ticket médio maior que zero para calcular o ponto de equilíbrio.';
    else if (be === 0) text = 'Nenhum custo fixo considerado: qualquer venda já gera resultado positivo.';
    else if (fi.adSales >= be) text = 'Equilíbrio atingido: ' + qty(fi.adSales) + ' ' + plural(fi.adSales, 'venda projetada', 'vendas projetadas') + ' para ' + qty(be) + ' ' + plural(be, 'necessária', 'necessárias') + '.';
    else text = qty(fi.adSales) + ' de ' + qty(be) + ' vendas necessárias para atingir o equilíbrio.';
    $('breakeven').innerHTML = '<span class="hint" style="color:var(--fg)">' + text + '</span><span class="hint">' + pct(fi.breakEvenProgress * 100, 0) + '</span>' +
      '<div class="be-track"><div class="be-fill ' + (fi.status === 'below' ? 'neg' : fi.status === 'near' ? 'near' : '') + '" style="width:' + (fi.breakEvenProgress * 100) + '%"></div></div>';
  }

  function renderCosts() {
    var fi = model.financial, fin = model.fin, feeRaw = Number(fin.agencyFee) || 0;
    $('costs-list').innerHTML =
      '<div class="kv"><span>Investimento em anúncios</span><b>' + money(fi.investment) + '</b></div>' +
      '<div class="kv" style="margin-top:6px"><span>Honorários' + (fin.includeAgencyFee ? '' : ' (não incluídos)') + '</span><b>' + (feeRaw > 0 ? money(feeRaw) : 'Não informado') + '</b></div>' +
      '<div class="kv" style="margin-top:6px"><span>Outros custos fixos</span><b>' + money(fi.otherCosts) + '</b></div>' +
      '<div class="kv" style="margin-top:6px"><span>Custos variáveis (' + pct(fi.variableCostPct * 100) + ' · margem ' + pct(fi.contributionMargin * 100) + ')</span><b>' + money(fi.variableCosts) + '</b></div>' +
      '<div class="kv" style="margin-top:10px;border-top:1px solid var(--line);padding-top:10px"><span>Resultado estimado no mês' + (fi.costsInformed ? '' : ' (sem margem informada)') + '</span><b style="color:' + (fi.result >= 0 ? 'var(--gold)' : 'var(--red)') + '">' + money(fi.result) + '</b></div>';
  }

  function deltaSpan(a, b, fmt, higherIsBetter) {
    var d = b - a;
    if (!isFinite(d) || Math.abs(d) < 1e-9) return '';
    var good = higherIsBetter ? d > 0 : d < 0;
    var pc = a > 0 ? ' · ' + (d > 0 ? '+' : '') + pct(d / a * 100, 0) : '';
    return '<span class="delta' + (good ? '' : ' neg') + '">(' + (d > 0 ? '+' : '') + fmt(d) + pc + ')</span>';
  }
  function renderCompare() {
    var c = model.compare, B = c.base, I = c.improved, W = c.withLevers;
    var rows = [
      ['Investimento', money(B.funnel.investment), money(I.funnel.investment)],
      ['CPL dos contatos', money(B.funnel.cpl), money(I.funnel.cpl) + deltaSpan(B.funnel.cpl, I.funnel.cpl, money, false)],
      ['Leads recebidos', qty(B.funnel.leads), qty(I.funnel.leads) + deltaSpan(B.funnel.leads, I.funnel.leads, qty, true)],
      ['Leads qualificados', qty(B.funnel.qualified), qty(I.funnel.qualified) + deltaSpan(B.funnel.qualified, I.funnel.qualified, qty, true)],
      ['Vendas', qty(B.funnel.sales), qty(W.improvedSales) + deltaSpan(B.funnel.sales, W.improvedSales, qty, true)],
      ['Faturamento estimado', money(B.fin.adRevenue), money(W.improvedRevenue) + deltaSpan(B.fin.adRevenue, W.improvedRevenue, money, true)],
      [model.total.active ? 'ROAS total' : 'ROAS projetado', xr(B.fin.roas), xr(W.improvedReturn)]
    ];
    function dl(side) { return '<dl>' + rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[side] + '</dd>'; }).join('') + '</dl>'; }
    var bf = B.funnel;
    var sem = '<div class="panel sem"><h3>' + icon('x', 16) + 'Sem Método TDE</h3><p class="ps">' + esc(cfg().independent.description) + '</p>' + dl(1) +
      '<dl class="opp"><span class="opp-h">Oportunidades não convertidas</span>' +
      '<dt>Leads não qualificados</dt><dd>' + qty(bf.notQualified) + '</dd>' +
      '<dt>Qualificados que não fecharam</dt><dd>' + qty(bf.qualifiedNotClosed) + '</dd>' +
      '<dt>Conversão geral</dt><dd>' + rateTxt(bf.conversionRate) + '</dd></dl></div>';
    var com = '<div class="panel com"><h3>' + icon('check', 16) + 'Com Método TDE</h3><p class="ps">Cenário ' + esc(model.scenario.name) + ' · mesmos parâmetros da simulação principal</p>' + dl(2) +
      '<dl class="opp" style="border-top-color:var(--gold-line)"><span class="opp-h" style="color:var(--gold)">Funil com o método</span>' +
      '<dt>Taxa de qualificação</dt><dd>' + rateTxt(I.funnel.qualificationRate) + '</dd>' +
      '<dt>Fechamento sobre qualificados</dt><dd>' + rateTxt(I.funnel.closeRate) + '</dd>' +
      '<dt>Conversão geral</dt><dd>' + rateTxt(I.funnel.conversionRate) + '</dd></dl></div>';
    setHTML($('cmp'), sem + com);
    $('cmp-kpis').innerHTML =
      kpi('Vendas adicionais', signedQty(W.extraSales), 'por mês · ' + signedQty(c.extraLeads) + ' leads estimados' + (model.total.active ? ' · inclui ' + qty(model.total.leverSales) + ' das alavancas' : ''), W.extraSales >= 0 ? 'pos' : 'neg') +
      kpi('Faturamento extra', signedMoney(W.incrementalRevenue), model.total.active ? 'por mês · inclui ' + money0(model.total.leverRevenue) + ' das alavancas' + (model.total.month > 1 ? ' (a partir do mês ' + model.total.month + ')' : '') : 'por mês', W.incrementalRevenue >= 0 ? 'pos' : 'neg') +
      kpi('Redução do CPL', money(c.cplReduction), c.cplReductionPct === null ? '—' : pct(c.cplReductionPct, 0) + ' menor nas campanhas de contatos', c.cplReduction >= 0 ? 'pos' : 'neg') +
      kpi('Ganho de eficiência comercial', c.conversionRelativePct === null ? '—' : (c.conversionRelativePct > 0 ? '+' : '') + pct(c.conversionRelativePct, 0),
        rateTxt(c.conversionBase) + ' → ' + rateTxt(c.conversionImproved) + ' de conversão geral (' + (c.conversionDeltaPP >= 0 ? '+' : '') + nf(1, 1).format(c.conversionDeltaPP) + ' p.p.)', c.conversionDeltaPP >= 0 ? 'pos' : 'neg');
  }

  function renderProjectionControls() {
    var p = sim.projection;
    setPressed('seg-months', 'data-months', p.months === 12 ? 12 : 6);
    setSwitch('sw-growth', p.growthEnabled); setSwitch('sw-ramp', p.rampEnabled);
    $('in-growth').disabled = !p.growthEnabled; $('in-ramp').disabled = !p.rampEnabled; $('in-eff-start').disabled = !p.rampEnabled;
    setPressed('seg-metric', 'data-metric', sim.chartMetric);
  }

  // ------------------------------------------------------------ gráfico SVG
  function niceMax(v) {
    if (!(v > 0)) return 1;
    var e = Math.pow(10, Math.floor(Math.log10(v))), f = v / e;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * e;
  }
  function intAxis(v) { return nf(0, 1).format(v); }
  function chartData() {
    var rows = model.projection.rows, labels = rows.map(function (r) { return 'Mês ' + r.month; });
    function s(name, color, key, src) { return { name: name, color: color, values: (src || rows).map(function (r) { return r[key]; }) }; }
    switch (sim.chartMetric) {
      case 'investment': return { type: 'bar', labels: labels, fmt: money, axis: moneyC, series: [s('Investimento em anúncios', 'var(--gold)', 'investment')] };
      case 'followers': return { type: 'bar', labels: labels, fmt: qty, axis: intAxis, series: [s('Novos seguidores', 'var(--gold)', 'followers')] };
      case 'leads': return { type: 'bar', labels: labels, fmt: qty, axis: intAxis, series: [s('Leads recebidos', 'var(--gold)', 'leads')] };
      case 'qualified': return { type: 'bar', labels: labels, fmt: qty, axis: intAxis, series: [s('Leads qualificados', 'var(--gold)', 'qualified')] };
      case 'sales': return { type: 'bar', stacked: true, labels: labels, fmt: qty, axis: intAxis, series: [s('Vendas dos anúncios', 'var(--gold)', 'adSales'), s('Vendas das alavancas', 'var(--lever)', 'leverSales')] };
      case 'roas': return { type: 'line', labels: labels, fmt: xr, axis: function (v) { return nf(0, 1).format(v) + 'x'; }, series: [s('ROAS publicitário', 'var(--gold)', 'roas')] };
      case 'compare':
        var cp = model.compareProjection;
        return { type: 'line', labels: labels, fmt: money, axis: moneyC, series: [
          s('Sem Método TDE', 'var(--muted)', 'adRevenue', cp.base.rows), s('Com Método TDE · ' + model.scenario.name, 'var(--gold)', 'adRevenue', cp.improved.rows)] };
      default: return { type: 'bar', stacked: true, labels: labels, fmt: money, axis: moneyC, series: [s('Faturamento dos anúncios', 'var(--gold)', 'adRevenue'), s('Faturamento das alavancas', 'var(--lever)', 'leverRevenue')] };
    }
  }
  var lastChart = null;
  function renderChart() {
    var d = chartData(); lastChart = d;
    var W = 820, H = 300, L = 78, R = 14, T = 14, B = 30, cw = W - L - R, ch = H - T - B, n = d.labels.length, i;
    var max = 0;
    for (i = 0; i < n; i++) {
      if (d.stacked) max = Math.max(max, d.series.reduce(function (a, s) { return a + (s.values[i] || 0); }, 0));
      else d.series.forEach(function (s) { max = Math.max(max, s.values[i] || 0); });
    }
    max = niceMax(max * 1.08);
    var y = function (v) { return T + ch - (v / max) * ch; };
    var gw = cw / n, out = [];
    for (var t = 0; t <= 4; t++) {
      var v = max * t / 4, yy = y(v);
      out.push('<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '" style="stroke:var(--line-2)" stroke-dasharray="' + (t ? '3 4' : '') + '"/>');
      out.push('<text x="' + (L - 10) + '" y="' + (yy + 4) + '" text-anchor="end" style="fill:var(--dim);font-size:11px">' + esc(d.axis(v)) + '</text>');
    }
    d.labels.forEach(function (lb, k) { out.push('<text x="' + (L + gw * k + gw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" style="fill:var(--dim);font-size:11px">' + (n > 6 ? 'M' + (k + 1) : lb) + '</text>'); });
    if (d.type === 'bar') {
      var bw = Math.min(46, gw * 0.58);
      for (i = 0; i < n; i++) {
        var acc = 0, x = L + gw * i + (gw - bw) / 2;
        d.series.forEach(function (s, si) {
          var v = s.values[i] || 0; if (v <= 0) return;
          var y0 = y(acc), y1 = y(acc + v), top = !d.series.slice(si + 1).some(function (z) { return z.values[i] > 0; });
          out.push('<rect x="' + x + '" y="' + y1 + '" width="' + bw + '" height="' + Math.max(0, y0 - y1) + '" rx="' + (top ? 4 : 0) + '" style="fill:' + s.color + '"/>');
          acc += v;
        });
      }
    } else {
      d.series.forEach(function (s) {
        var pts = [];
        s.values.forEach(function (v, k) { if (ok(v)) pts.push([L + gw * k + gw / 2, y(v)]); });
        if (pts.length > 1) out.push('<polyline fill="none" stroke-width="2.5" stroke-linejoin="round" style="stroke:' + s.color + '" points="' + pts.map(function (p) { return p.join(','); }).join(' ') + '"/>');
        pts.forEach(function (p) { out.push('<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" style="fill:var(--card);stroke:' + s.color + '" stroke-width="2"/>'); });
      });
    }
    for (i = 0; i < n; i++) out.push('<rect class="hit" data-i="' + i + '" x="' + (L + gw * i) + '" y="' + T + '" width="' + gw + '" height="' + ch + '" fill="transparent"/>');
    $('chart').innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Gráfico da projeção mensal">' + out.join('') + '</svg><div class="ctip" id="ctip" hidden></div>';
    $('chart-legend').innerHTML = d.series.map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + esc(s.name) + '</span>'; }).join('');
  }
  function bindChartTip() {
    var wrap = $('chart');
    wrap.addEventListener('mousemove', function (e) {
      var hit = e.target.closest && e.target.closest('.hit'), tipEl = $('ctip'); if (!tipEl) return;
      if (!hit || !lastChart) { tipEl.hidden = true; return; }
      var i = Number(hit.getAttribute('data-i')), d = lastChart;
      var rows = d.series.map(function (s) { return '<div><span>' + esc(s.name) + '</span><span>' + d.fmt(s.values[i]) + '</span></div>'; }).join('');
      if (d.stacked) rows += '<div><span>Total</span><span>' + d.fmt(d.series.reduce(function (a, s) { return a + (s.values[i] || 0); }, 0)) + '</span></div>';
      tipEl.innerHTML = '<b>Mês ' + (i + 1) + '</b>' + rows; tipEl.hidden = false;
      var wr = wrap.getBoundingClientRect(), hr = hit.getBoundingClientRect();
      var left = hr.left - wr.left + hr.width / 2 + 12; if (left + tipEl.offsetWidth > wr.width) left = hr.left - wr.left + hr.width / 2 - tipEl.offsetWidth - 12;
      tipEl.style.left = Math.max(0, left) + 'px'; tipEl.style.top = '10px';
    });
    wrap.addEventListener('mouseleave', function () { var t = $('ctip'); if (t) t.hidden = true; });
  }

  function renderTable() {
    var P = model.projection, ramp = sim.projection.rampEnabled;
    var cols = [
      ['Mês', function (r) { return r.month; }, 'Total'],
      ['Investimento', function (r) { return money0(r.investment); }, money0(P.totals.investment)],
      ramp ? ['Eficiência', function (r) { return pct(r.efficiency * 100, 0); }, ''] : null,
      ['Seguidores', function (r) { return qty(r.followers); }, qty(P.totals.followers)],
      ['Leads', function (r) { return qty(r.leads); }, qty(P.totals.leads)],
      ['Qualificados', function (r) { return qty(r.qualified); }, qty(P.totals.qualified)],
      ['Vendas anúncios', function (r) { return qty(r.adSales); }, qty(P.totals.adSales)],
      ['Vendas alavancas', function (r) { return '<span class="lvc">' + qty(r.leverSales) + '</span>'; }, qty(P.totals.leverSales), 'lv'],
      ['Vendas totais', function (r) { return qty(r.totalSales); }, qty(P.totals.totalSales)],
      ['Fat. anúncios', function (r) { return money0(r.adRevenue); }, money0(P.totals.adRevenue)],
      ['Fat. total', function (r) { return money0(r.totalRevenue); }, money0(P.totals.totalRevenue)],
      ['ROAS anúncios', function (r) { return xr(r.roas); }, xr(P.totals.roas)],
      ['Resultado consolidado', function (r) { return '<span style="color:' + (r.totalResult >= 0 ? 'var(--gold)' : 'var(--red)') + '">' + money0(r.totalResult) + '</span>'; }, money0(P.totals.totalResult)]
    ].filter(Boolean);
    $('proj-table').innerHTML = '<thead><tr>' + cols.map(function (c) { return '<th scope="col">' + c[0] + '</th>'; }).join('') + '</tr></thead><tbody>' +
      P.rows.map(function (r) { return '<tr>' + cols.map(function (c) { return '<td' + (c[3] ? ' class="' + c[3] + '"' : '') + '>' + c[1](r) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '<tr class="total">' + cols.map(function (c) { return '<td>' + c[2] + '</td>'; }).join('') + '</tr></tbody>';
  }

  var LEVER_ICONS = { prospeccao: 'send', social: 'share', indicacoes: 'users' };
  function leverRule(l, mat) {
    return '+' + qty(l.salesPerMonth) + ' ' + plural(l.salesPerMonth, 'venda', 'vendas') + '/mês ' + (mat > 0 ? 'após ' + mat + ' ' + plural(mat, 'mês', 'meses') + ' de maturação' : 'desde o primeiro mês') +
      (l.monthlyCost > 0 ? ' · custo ' + money0(l.monthlyCost) + '/mês' : '');
  }
  function leverTicketSource(l) {
    if (l.ticketSource === 'main') return 'Igual ao ticket médio';
    return (l.ticketSource === 'simulation' ? 'Valor próprio' : 'Valor das configurações') + ' · <button type="button" class="linkbtn" data-lever-ticket-reset="' + esc(l.id) + '">usar ticket médio</button>';
  }
  function leverContrib(l, on, mat) {
    if (!on) return '';
    var months = model.projection.months;
    var tot = model.projection.totals.levers.filter(function (x) { return x.id === l.id; })[0] || { sales: 0, revenue: 0, cost: 0 };
    return '<div class="contrib">' +
      '<span class="chip">Mês 1: <b>' + (mat > 0 ? 'sem vendas (maturação)' : '+' + qty(l.salesPerMonth)) + '</b></span>' +
      '<span class="chip">' + (mat > 0 ? 'A partir do mês ' + (mat + 1) : 'Por mês') + ': <b>+' + qty(l.salesPerMonth) + ' · ' + money0(l.salesPerMonth * l.ticket) + '</b></span>' +
      '<span class="chip">Em ' + months + ' meses: <b>' + qty(tot.sales) + ' ' + plural(tot.sales, 'venda', 'vendas') + ' · ' + money0(tot.revenue) + '</b></span>' +
      (tot.cost > 0 ? '<span class="chip">Custo no período: <b>' + money0(tot.cost) + '</b></span>' : '') +
      (mat >= months ? '<span class="chip" style="color:var(--fg);border-color:var(--muted)">Maturação maior que o período da projeção</span>' : '') + '</div>';
  }
  function renderLevers() {
    var c = cfg(), P = model.projection, f = model.funnel, fi = model.financial, months = P.months;
    var html = '<div class="lever on"><div class="ic">' + icon('trend') + '</div><div style="min-width:0"><h4>Alavanca 01 · Tráfego Pago</h4><div class="rule">Base do funil principal</div>' +
      '<div class="desc">Vendas geradas pelos anúncios, conforme o funil acima.</div><div class="contrib">' +
      '<span class="chip">Mês de referência: <b>' + qty(f.sales) + ' ' + plural(f.sales, 'venda', 'vendas') + ' · ' + money0(fi.adRevenue) + '</b></span>' +
      '<span class="chip">Em ' + months + ' meses: <b>' + qty(P.totals.adSales) + ' vendas · ' + money0(P.totals.adRevenue) + '</b></span></div></div>' +
      '<div class="lever-right"><span class="badge">Sempre ativa</span></div></div>';
    var focusedTicket = document.activeElement && document.activeElement.hasAttribute && document.activeElement.hasAttribute('data-lever-ticket');
    model.levers.list.forEach(function (l, idx) {
      var on = !!sim.leversEnabled[l.id];
      var mat = Math.round(l.maturationMonths);
      html += '<div class="lever' + (on ? ' on' : '') + '" data-lever-card="' + esc(l.id) + '"><div class="ic">' + icon(LEVER_ICONS[l.id] || 'trend') + '</div><div style="min-width:0"><h4>Alavanca 0' + (idx + 2) + ' · ' + esc(l.name) + '</h4>' +
        '<div class="rule" data-lever-rule="' + esc(l.id) + '">' + leverRule(l, mat) + '</div><div class="desc">' + esc(l.description) + '</div>' +
        '<div class="lever-ticket"><label for="lt-' + esc(l.id) + '">Valor por venda</label><div class="prefix"><span>R$</span><input class="inp num" type="text" inputmode="decimal" autocomplete="off" id="lt-' + esc(l.id) + '" data-lever-ticket="' + esc(l.id) + '" value="' + fmtInput('money', l.ticket) + '"></div>' +
        '<span class="lt-src" data-lever-src="' + esc(l.id) + '">' + leverTicketSource(l) + '</span></div>' +
        '<div data-lever-contrib="' + esc(l.id) + '">' + leverContrib(l, on, mat) + '</div></div>' +
        '<div class="lever-right"><button class="close-x" type="button" data-lever-cfg="' + esc(l.id) + '" title="Editar alavanca" aria-label="Editar ' + esc(l.name) + '">' + icon('gear', 17) + '</button>' +
        '<button class="switch" type="button" role="switch" id="sw-lev-' + esc(l.id) + '" data-lever="' + esc(l.id) + '" aria-checked="' + on + '" aria-label="Ativar ' + esc(l.name) + '"><span class="track"></span></button></div></div>';
    });
    if (focusedTicket && $('levers')._ids === model.levers.list.map(function (l) { return l.id + sim.leversEnabled[l.id]; }).join()) {
      // não recriar o campo em edição: atualiza só textos e contribuições
      model.levers.list.forEach(function (l) {
        var mat = Math.round(l.maturationMonths);
        document.querySelector('[data-lever-rule="' + l.id + '"]').innerHTML = leverRule(l, mat);
        document.querySelector('[data-lever-src="' + l.id + '"]').innerHTML = leverTicketSource(l);
        document.querySelector('[data-lever-contrib="' + l.id + '"]').innerHTML = leverContrib(l, !!sim.leversEnabled[l.id], mat);
        var inp = $('lt-' + l.id); if (inp !== document.activeElement) inp.value = fmtInput('money', l.ticket);
      });
      html = null;
    }
    if (html !== null) { setHTML($('levers'), html); $('levers')._ids = model.levers.list.map(function (l) { return l.id + sim.leversEnabled[l.id]; }).join(); }

    var L = model.levers, T = P.totals;
    function line(label, value, color) { return '<div class="kv"><span>' + label + '</span><b' + (color ? ' style="color:' + color + '"' : '') + '>' + value + '</b></div>'; }
    function block(title, F) {
      return '<div class="box"><h5>' + title + '</h5>' + line('Vendas dos anúncios', qty(F.adSales)) + line('Vendas das alavancas', qty(F.leverSales), 'var(--lever)') +
        line('Total de vendas', qty(F.totalSales)) + '<div class="kv tot"><span>Faturamento combinado</span><b>' + money(F.totalRevenue) + '</b></div>' +
        line('Resultado consolidado', money(F.totalResult), F.totalResult >= 0 ? 'var(--gold)' : 'var(--red)') + '</div>';
    }
    var acc = '<div class="box"><h5>Acumulado em ' + months + ' meses</h5>' + line('Vendas dos anúncios', qty(T.adSales)) + line('Vendas das alavancas', qty(T.leverSales), 'var(--lever)') +
      line('Total de vendas', qty(T.totalSales)) + '<div class="kv tot"><span>Faturamento combinado</span><b>' + money(T.totalRevenue) + '</b></div>' +
      line('ROAS publicitário', xr(T.roas)) + line('Retorno consolidado ' + tip('Faturamento combinado ÷ custos fixos totais (anúncios, honorários incluídos, outros custos e custos das alavancas).'), xr(T.consolidatedReturn)) +
      line('Resultado consolidado', money(T.totalResult), T.totalResult >= 0 ? 'var(--gold)' : 'var(--red)') + '</div>';
    $('cons').innerHTML = block('Resultado mensal atual (mês 1)', L.now) + block('Mensal após maturação' + (L.maturationMonth > 1 ? ' (mês ' + L.maturationMonth + ')' : ''), L.mature) + acc;
  }

  // Detalhe "anúncios + alavancas" exibido sob os totais quando há alavanca ativa
  function leverBreak(adRev, adSales) {
    var T = model.total; if (!T.active) return '';
    return money0(adRev) + ' anúncios + ' + money0(T.leverRevenue) + ' alavancas (' + qty(adSales) + ' + ' + qty(T.leverSales) + ' vendas)' + (T.month > 1 ? ', a partir do mês ' + T.month : '');
  }

  // ------------------------------------------------------------ visualização simplificada
  function renderSimple() {
    var simple = sim.view === 'simple';
    $('app').classList.toggle('view-simple', simple);
    setPressed('seg-view', 'data-view', simple ? 'simple' : 'full');
    setPressed('seg-months-simple', 'data-months', sim.projection.months === 12 ? 12 : 6);
    if (!simple) return;
    var f = model.funnel, fi = model.financial, c = model.compare, T = model.projection.totals, P = model.projection, TT = model.total, W = c.withLevers;
    $('simple-sub').textContent = 'Cenário ' + model.scenario.name + ' · investimento de ' + money(model.investment) + (sim.mode === 'reverse' ? ' (mínimo para a meta)' : '') + ' · ticket de ' + money(model.ticket);
    $('simple-main').innerHTML =
      '<div class="hero"><div class="k">Faturamento projetado' + (TT.active ? ' com alavancas' : '') + '</div><div class="big">' + money(TT.revenue) + '</div>' +
      '<div class="s">' + qty(TT.sales) + ' ' + plural(TT.sales, 'venda', 'vendas') + ' por mês · ' + (TT.active ? 'ROAS total de ' + xr(TT.totalReturn) + ' (anúncios: ' + xr(fi.roas) + ')' : 'ROAS de ' + xr(fi.roas)) + '</div>' +
      (TT.active ? '<div class="hero-plus">' + leverBreak(fi.adRevenue, f.sales) + '</div>' : '') + '</div>' +
      '<div class="flow">' +
      kpi('Seguidores', qty(f.followers), 'novos por mês') +
      kpi('Leads', qty(f.leads), 'contatos recebidos') +
      kpi('Qualificados', qty(f.qualified), rateTxt(f.qualificationRate) + ' dos leads') +
      kpi('Vendas', qty(TT.sales), TT.active ? qty(f.sales) + ' anúncios + ' + qty(TT.leverSales) + ' alavancas' : rateTxt(f.closeRate) + ' de fechamento', 'gold') + '</div>' +
      '<div class="simple-foot"><span>Custo por venda <b>' + (fi.costPerSale === null ? '—' : money(fi.costPerSale)) + '</b></span><span>CPL <b>' + money(f.cpl) + '</b></span><span>Conversão geral <b>' + rateTxt(f.conversionRate) + '</b></span></div>';
    $('simple-cmp').innerHTML = '<div class="vs">' +
      '<div class="side"><h3>Sem Método TDE</h3><div class="big">' + money(c.base.fin.adRevenue) + '</div><div class="s">' + qty(c.base.funnel.sales) + ' ' + plural(c.base.funnel.sales, 'venda', 'vendas') + ' · ROAS ' + xr(c.base.fin.roas) + '</div></div>' +
      '<div class="side com"><h3>Com Método TDE · ' + esc(model.scenario.name) + '</h3><div class="big">' + money(W.improvedRevenue) + '</div><div class="s">' + qty(W.improvedSales) + ' ' + plural(W.improvedSales, 'venda', 'vendas') + ' · ' + (TT.active ? 'ROAS total ' : 'ROAS ') + xr(W.improvedReturn) + (TT.active ? ' · inclui alavancas' : '') + '</div></div></div>' +
      '<div class="gain">' + kpi('Faturamento extra por mês', signedMoney(W.incrementalRevenue), signedQty(W.extraSales) + ' vendas' + (TT.active ? ' · inclui ' + money0(TT.leverRevenue) + ' das alavancas' : ''), W.incrementalRevenue >= 0 ? 'pos' : 'neg') +
      kpi('Ganho de eficiência comercial', c.conversionRelativePct === null ? '—' : (c.conversionRelativePct > 0 ? '+' : '') + pct(c.conversionRelativePct, 0), rateTxt(c.conversionBase) + ' → ' + rateTxt(c.conversionImproved) + ' de conversão', c.conversionDeltaPP >= 0 ? 'pos' : 'neg') + '</div>';
    var sl = model.levers.list.map(function (l) {
      var on = !!sim.leversEnabled[l.id], mat = Math.round(l.maturationMonths);
      var tot = T.levers.filter(function (x) { return x.id === l.id; })[0] || { sales: 0, revenue: 0 };
      return '<div class="slever' + (on ? ' on' : '') + '"><button class="switch" type="button" role="switch" id="sw-slev-' + esc(l.id) + '" data-lever="' + esc(l.id) + '" aria-checked="' + on + '"><span class="track"></span><span class="slever-t"><b>' + esc(l.name) + '</b>' +
        '<small>+' + qty(l.salesPerMonth) + ' ' + plural(l.salesPerMonth, 'venda', 'vendas') + '/mês de ' + money0(l.ticket) + (mat > 0 ? ' a partir do mês ' + (mat + 1) : '') + '</small></span></button>' +
        '<div class="slever-v">' + (on ? '+' + money0(tot.revenue) + '<small>em ' + P.months + ' meses</small>' : '<small>Desativada</small>') + '</div></div>';
    }).join('');
    setHTML($('simple-levers'), sl);
    $('simple-proj').innerHTML = '<div class="period">' +
      kpi('Faturamento em ' + P.months + ' meses', money(T.totalRevenue), T.leverRevenue > 0 ? money(T.adRevenue) + ' anúncios + ' + money(T.leverRevenue) + ' alavancas' : 'Somente anúncios', 'pos') +
      kpi('Vendas em ' + P.months + ' meses', qty(T.totalSales), T.leverSales > 0 ? qty(T.adSales) + ' anúncios + ' + qty(T.leverSales) + ' alavancas' : 'Somente anúncios') +
      kpi('Investimento em anúncios', money(T.investment), sim.projection.growthEnabled ? 'Com crescimento mensal' : 'Constante no período') +
      kpi('ROAS acumulado', xr(T.roas), 'Anúncios no período', 'pos') + '</div>';
  }

  // ------------------------------------------------------------ configurações
  var TABS = [['investimento', 'Investimento'], ['aquisicao', 'Aquisição'], ['comercial', 'Comercial'], ['semtde', 'Comparativo Sem TDE'], ['projecao', 'Projeção'], ['alavancas', 'Alavancas'], ['financeiro', 'Financeiro']];
  var currentTab = 'investimento';
  // campos vinculados: editar um atualiza o complementar (soma 100%)
  var LINKED = {
    'defaults.contactsShare': { get: function (d) { return 1 - d.defaults.followersShare; }, set: function (d, v) { d.defaults.followersShare = Math.round((1 - v) * 1e6) / 1e6; }, partner: 'defaults.followersShare' },
    'defaults.followersShare': { partner: 'defaults.contactsShare' },
    'independent.contactsShare': { get: function (d) { return 1 - d.independent.followersShare; }, set: function (d, v) { d.independent.followersShare = Math.round((1 - v) * 1e6) / 1e6; }, partner: 'independent.followersShare' },
    'independent.followersShare': { partner: 'independent.contactsShare' },
    'financial.contributionMargin': { get: function (d) { return 1 - d.financial.variableCostPct; }, set: function (d, v) { d.financial.variableCostPct = Math.round((1 - v) * 1e6) / 1e6; }, partner: 'financial.variableCostPct' },
    'financial.variableCostPct': { partner: 'financial.contributionMargin' }
  };
  function getPath(o, path) { var L = LINKED[path]; if (L && L.get) return L.get(o); return path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, path, v) {
    var L = LINKED[path]; if (L && L.set) { L.set(o, v); return; }
    var ks = path.split('.'), last = ks.pop(); var t = ks.reduce(function (a, k) { return a[k]; }, o); t[last] = v;
  }
  function fid(path) { return 'cfg-' + path.replace(/\./g, '-'); }

  function F(path, label, kind, opt) {
    opt = opt || {};
    var id = fid(path), v = getPath(draft, path), input;
    var attrs = ' id="' + id + '" data-path="' + path + '" data-kind="' + kind + '"' + (opt.max !== undefined ? ' data-max="' + opt.max + '"' : '') + (opt.min !== undefined ? ' data-min="' + opt.min + '"' : '') + (opt.positive ? ' data-positive="1"' : '');
    if (kind === 'text') input = '<input class="inp" type="text"' + attrs + ' value="' + esc(v) + '">';
    else if (kind === 'textarea') input = '<textarea class="inp"' + attrs + '>' + esc(v) + '</textarea>';
    else if (kind === 'select') input = '<select class="inp"' + attrs + '>' + opt.options.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(o[0]) === String(v) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>';
    else {
      input = '<input class="inp num" type="text" inputmode="decimal"' + attrs + ' value="' + esc(fmtInput(kind, v)) + '">';
      if (kind === 'money') input = '<div class="prefix"><span>R$</span>' + input + '</div>';
      if (kind === 'pct') input = '<div class="suffix">' + input + '<span>%</span></div>';
    }
    return '<div class="field"' + (opt.wide ? ' style="grid-column:1/-1"' : '') + '><label class="lbl" for="' + id + '">' + label + (opt.tip ? ' ' + tip(opt.tip) : '') + '</label>' + input +
      (opt.hint ? '<span class="hint">' + opt.hint + '</span>' : '') + '<span class="err" id="err-' + id + '"></span></div>';
  }
  var ONOFF = [['true', 'Ativado'], ['false', 'Desativado']];

  function tabHTML(tab) {
    var d = draft, hr = E.historyRates(d.acquisition);
    if (tab === 'investimento') {
      return '<div class="sec-t">Valores de cada nova simulação</div><div class="fgrid">' +
        F('defaults.investment', 'Investimento mensal padrão', 'money') + F('defaults.ticket', 'Ticket médio padrão', 'money') +
        F('defaults.followersShare', 'Verba para seguidores', 'pct') + F('defaults.contactsShare', 'Verba para contatos', 'pct') +
        F('defaults.scenarioId', 'Cenário inicial', 'select', { options: d.scenarios.map(function (s) { return [s.id, s.name]; }) }) + '</div>' +
        '<p class="hint" style="margin-top:12px">As duas verbas somam sempre 100%. No atendimento atual, a distribuição é ajustada no card Distribuição do Investimento.</p>';
    }
    if (tab === 'aquisicao') {
      return '<div class="sec-t">Campanhas e custos de aquisição (Com Método TDE)</div><div class="fgrid">' +
        F('acquisition.cpl', 'CPL das campanhas de contatos', 'money', { positive: true }) +
        F('acquisition.followerCostMode', 'Custo por seguidor', 'select', { options: [['historical', 'Histórico (' + money(hr.followerCost) + ', razão exata)'], ['manual', 'Valor manual']] }) +
        F('acquisition.followerCostManual', 'Custo por seguidor manual', 'money', { hint: 'Usado só quando "Valor manual" está selecionado.' }) +
        F('acquisition.indirectFollowersEnabled', 'Seguidores adicionais das campanhas de contatos', 'select', { options: ONOFF }) +
        F('acquisition.extraConversationsEnabled', 'Conversas adicionais da captação', 'select', { options: ONOFF }) + '</div>' +
        '<div class="sec-t">Parâmetros históricos (9 semanas de um cliente real)</div><div class="fgrid">' +
        F('acquisition.history.followerInvestment', 'Investimento em captação', 'money') +
        F('acquisition.history.directFollowers', 'Seguidores gerados na captação', 'num') +
        F('acquisition.history.extraConversations', 'Conversas adicionais da captação', 'num') +
        F('acquisition.history.contactInvestment', 'Investimento em campanhas de contatos', 'money') +
        F('acquisition.history.indirectFollowers', 'Seguidores adicionais dessas campanhas', 'num') + '</div>' +
        '<p class="hint" style="margin-top:12px">Razões em uso: ' + money(hr.followerCost) + ' por seguidor · ' + nf(4, 4).format(hr.indirectPerReal) + ' seguidor por real em contatos · ' + nf(4, 4).format(hr.conversationsPerReal) + ' conversa por real em captação.</p>';
    }
    if (tab === 'comercial') {
      return '<p class="hint" style="margin-bottom:14px">Os cenários compartilham investimento, CPL, seguidores e qualificação. Muda apenas o fechamento. As taxas são hipóteses comerciais, não estatísticas garantidas.</p>' +
        '<div class="fgrid">' + F('commercial.qualificationRate', 'Taxa geral de qualificação', 'pct', { tip: 'Leads com intenção real de tatuar, estilo compatível e potencial de compra.' }) + '</div>' +
        '<div class="sec-t">Fechamento sobre qualificados</div>' +
        d.scenarios.map(function (s, i) {
          var p = 'scenarios.' + i;
          return '<div class="sc-card"><div class="row-between"><h3>' + esc(s.name) + '</h3>' +
            (s.builtin ? '<button class="btn small ghost" type="button" data-reset-scen="' + i + '">Restaurar valor oficial</button>' : '<button class="btn small danger" type="button" data-del-scen="' + i + '">' + icon('trash', 14) + 'Excluir</button>') +
            '</div><div class="fgrid">' + F(p + '.name', 'Nome', 'text') + F(p + '.closeRate', 'Fechamento sobre qualificados', 'pct') +
            '<div class="field"><span class="lbl">Conversão geral</span><div class="hint" style="font-size:15px;color:var(--fg);padding-top:8px">' + rateTxt(d.commercial.qualificationRate * s.closeRate) + '</div></div>' +
            F(p + '.description', 'Perfil', 'textarea', { wide: true }) + '</div></div>';
        }).join('') +
        '<button class="btn" type="button" id="btn-add-scen" style="margin-top:14px">' + icon('plus', 16) + 'Adicionar cenário personalizado</button>';
    }
    if (tab === 'semtde') {
      return '<p class="hint" style="margin-bottom:14px">Operação independente usada no card "Sem Método TDE". Investimento e ticket são sempre os mesmos do prospect. Valores hipotéticos, não resultados históricos comprovados.</p><div class="fgrid">' +
        F('independent.cpl', 'CPL independente', 'money', { positive: true }) + F('independent.qualificationRate', 'Qualificação independente', 'pct') +
        F('independent.closeRate', 'Fechamento independente', 'pct') + F('independent.followerCost', 'Custo por seguidor', 'money') +
        F('independent.followMainDistribution', 'Distribuição da verba', 'select', { options: [['true', 'Acompanhar a distribuição principal'], ['false', 'Usar distribuição própria']] }) +
        F('independent.followersShare', 'Verba para seguidores (própria)', 'pct') + F('independent.contactsShare', 'Verba para contatos (própria)', 'pct') +
        F('independent.extraConversationsEnabled', 'Conversas adicionais da captação', 'select', { options: ONOFF }) +
        F('independent.indirectFollowersEnabled', 'Seguidores adicionais', 'select', { options: ONOFF }) +
        F('independent.description', 'Descrição', 'textarea', { wide: true }) + '</div>';
    }
    if (tab === 'projecao') {
      return '<p class="hint" style="margin-bottom:14px">Valores usados em cada nova simulação. Os controles do card Projeção temporal ajustam apenas o atendimento atual.</p><div class="fgrid">' +
        F('projection.months', 'Horizonte de projeção', 'select', { options: [['6', '6 meses'], ['12', '12 meses']] }) +
        F('projection.growthEnabled', 'Crescimento do investimento', 'select', { options: ONOFF }) +
        F('projection.growthPct', 'Crescimento mensal', 'pct') +
        F('projection.rampEnabled', 'Rampagem', 'select', { options: ONOFF }) +
        F('projection.rampMonths', 'Período de maturação (meses)', 'int', { min: 1, max: 12 }) +
        F('projection.startEfficiency', 'Eficiência inicial do fechamento', 'pct', { max: 200 }) +
        F('projection.finalEfficiency', 'Eficiência final do fechamento', 'pct', { max: 200, tip: 'Também usada no funil do mês de referência. 100% = taxa do cenário sem ajuste.' }) + '</div>';
    }
    if (tab === 'alavancas') {
      return '<p class="hint" style="margin-bottom:14px">Cada alavanca soma vendas próprias depois da maturação (3 meses = primeira venda no mês 4) e nunca entra no ROAS dos anúncios. Por padrão, cada venda vale o ticket médio do prospect; o valor pode ser alterado no próprio card da alavanca.</p>' +
        d.levers.map(function (l, i) {
          var p = 'levers.' + i;
          return '<div class="sc-card"><div class="row-between"><h3>Alavanca 0' + (i + 2) + ' · ' + esc(l.name) + '</h3></div><div class="fgrid">' +
            F(p + '.name', 'Nome', 'text') + F(p + '.salesPerMonth', 'Vendas extras por mês', 'num') +
            F(p + '.maturationMonths', 'Maturação (meses)', 'int', { max: 24 }) + F(p + '.ticket', 'Valor por venda padrão', 'money', { hint: 'Zerado = usa o ticket médio do prospect.' }) +
            F(p + '.monthlyCost', 'Custo adicional mensal', 'money') + F(p + '.description', 'Descrição', 'textarea', { wide: true }) + '</div></div>';
        }).join('');
    }
    return '<div class="sec-t">Custos considerados no ROI e no ponto de equilíbrio</div><div class="fgrid">' +
      F('financial.variableCostPct', 'Custos variáveis (% do faturamento)', 'pct', { tip: 'Material, taxas de cartão, comissões e impostos sobre cada venda.' }) +
      F('financial.contributionMargin', 'Margem de contribuição', 'pct', { tip: 'Parte do ticket que sobra após os custos variáveis. Soma 100% com os custos variáveis.' }) +
      F('financial.agencyFee', 'Honorários mensais', 'money') + F('financial.otherCosts', 'Custos adicionais mensais', 'money') +
      F('financial.includeAgencyFee', 'Incluir honorários por padrão', 'select', { options: [['true', 'Sim'], ['false', 'Não']] }) +
      F('financial.nearBandPct', 'Faixa "próximo do equilíbrio"', 'pct') + '</div>' +
      '<p class="hint" style="margin-top:14px">Com custos variáveis em 0% (margem de 100%), o ROI não é exibido e o ponto de equilíbrio aparece como simplificado.</p>';
  }

  function openSettings(tab) {
    draft = clone(config);
    currentTab = tab || 'investimento';
    $('modal-root').innerHTML = '<div class="overlay" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">' +
      '<div class="modal-h"><div><h2 id="m-title">Configurações</h2><p>Salvas neste navegador. Não sincronizam entre dispositivos; use Exportar e Importar para levar a outro computador.</p></div>' +
      '<button class="close-x" type="button" id="m-close" aria-label="Fechar">' + icon('x') + '</button></div>' +
      '<div class="tabs" role="tablist">' + TABS.map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '" id="tab-' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="modal-b" id="m-body"></div>' +
      '<div class="modal-f"><div class="grp"><button class="btn small ghost" type="button" id="m-reset">Restaurar padrões oficiais TDE</button>' +
      '<button class="btn small ghost" type="button" id="m-export">' + icon('download', 14) + 'Exportar JSON</button>' +
      '<button class="btn small ghost" type="button" id="m-import">' + icon('upload', 14) + 'Importar JSON</button><input type="file" id="m-file" accept="application/json,.json" hidden></div>' +
      '<div class="grp"><button class="btn" type="button" id="m-cancel">Cancelar</button><button class="btn primary" type="button" id="m-save">Salvar configurações</button></div></div></div></div>';
    renderTab();
    $('ov').addEventListener('click', function (e) { if (e.target.id === 'ov') closeModal(); });
    $('m-close').addEventListener('click', closeModal);
    $('m-cancel').addEventListener('click', closeModal);
    $('m-save').addEventListener('click', saveSettings);
    $('m-export').addEventListener('click', exportConfig);
    $('m-import').addEventListener('click', function () { $('m-file').click(); });
    $('m-file').addEventListener('change', importConfig);
    $('m-reset').addEventListener('click', function (e) {
      var b = e.currentTarget;
      if (!b._armed) { b._armed = true; b.textContent = 'Confirmar restauração'; b.classList.add('danger'); return; }
      b._armed = false; b.textContent = 'Restaurar padrões oficiais TDE'; b.classList.remove('danger');
      draft = E.defaultConfig(); renderTab(); recompute();
      toast('Padrões oficiais carregados. Os dados do prospect foram mantidos. Clique em Salvar para manter.');
    });
    document.querySelector('.tabs').addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (!b) return; currentTab = b.getAttribute('data-tab'); renderTab(); });
    var body = $('m-body');
    body.addEventListener('input', onCfgInput);
    body.addEventListener('change', onCfgInput);
    body.addEventListener('focusout', function (e) {
      var el = e.target; if (!el.dataset || !el.dataset.path) return;
      var k = el.dataset.kind; if (['money', 'pct', 'int', 'num'].indexOf(k) < 0) return;
      if (!el.classList.contains('bad')) el.value = fmtInput(k, getPath(draft, el.dataset.path));
    });
    body.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('#btn-add-scen'))) {
        draft.scenarios.push({ id: 'custom-' + Date.now().toString(36), name: 'Personalizado ' + (draft.scenarios.filter(function (s) { return !s.builtin; }).length + 1), builtin: false, closeRate: 0.25, description: 'Cenário personalizado.' });
        renderTab(); recompute();
        var cards = body.querySelectorAll('.sc-card'); if (cards.length) cards[cards.length - 1].scrollIntoView({ block: 'nearest' });
      } else if ((t = e.target.closest('[data-del-scen]'))) {
        var i = Number(t.getAttribute('data-del-scen')), id = draft.scenarios[i].id;
        draft.scenarios.splice(i, 1);
        if (draft.defaults.scenarioId === id) draft.defaults.scenarioId = draft.scenarios[0].id;
        renderTab(); recompute();
      } else if ((t = e.target.closest('[data-reset-scen]'))) {
        var j = Number(t.getAttribute('data-reset-scen'));
        var orig = E.defaultConfig().scenarios.filter(function (s) { return s.id === draft.scenarios[j].id; })[0];
        if (orig) draft.scenarios[j] = orig;
        renderTab(); recompute();
      }
    });
    $('tab-' + currentTab).focus();
  }

  function renderTab() {
    document.querySelectorAll('.tabs [data-tab]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === currentTab)); });
    var body = $('m-body'); body.innerHTML = tabHTML(currentTab); body.scrollTop = 0;
  }

  function onCfgInput(e) {
    var el = e.target, path = el.dataset && el.dataset.path; if (!path) return;
    var kind = el.dataset.kind, err = $('err-' + el.id), v;
    if (kind === 'text' || kind === 'textarea') v = el.value.slice(0, kind === 'text' ? 40 : 400);
    else if (kind === 'select') {
      if (e.type !== 'change') return;
      v = el.value;
      if (v === 'true' || v === 'false') v = v === 'true';
      else if (path === 'projection.months') v = Number(v);
    } else {
      var r = validate(kind, el.value, { max: el.dataset.max !== undefined ? Number(el.dataset.max) : undefined, min: el.dataset.min !== undefined ? Number(el.dataset.min) : undefined, positive: !!el.dataset.positive, positiveMsg: 'O CPL precisa ser maior que zero.' });
      el.classList.toggle('bad', !!r.error); if (err) err.textContent = r.error || '';
      if (r.error) return;
      v = r.value;
    }
    if (e.type === 'change' && kind !== 'select') return;
    setPath(draft, path, v);
    var L = LINKED[path];
    if (L) { var pe = $(fid(L.partner)); if (pe) { pe.value = fmtInput('pct', getPath(draft, L.partner)); pe.classList.remove('bad'); var pr = $('err-' + pe.id); if (pr) pr.textContent = ''; } }
    if (/^scenarios\.\d+\.name$/.test(path) || /^levers\.\d+\.name$/.test(path)) {
      var h = el.closest('.sc-card'); if (h && h.querySelector('h3')) h.querySelector('h3').textContent = (path.indexOf('levers') === 0 ? 'Alavanca 0' + (Number(path.split('.')[1]) + 2) + ' · ' : '') + v;
    }
    recompute();
  }

  function closeModal() {
    if (draft) { draft = null; recompute(); }
    $('modal-root').innerHTML = '';
    $('btn-settings').focus();
  }

  function saveSettings() {
    var bad = $('m-body').querySelector('.inp.bad');
    if (bad) { toast('Corrija os campos destacados antes de salvar.'); bad.focus(); return; }
    config = E.normalizeConfig(draft);
    draft = null;
    var okSave = store(K_CFG, config);
    if (!E.findScenario(config, sim.scenarioId)) sim.scenarioId = config.defaults.scenarioId;
    $('modal-root').innerHTML = '';
    recompute();
    toast(okSave ? 'Configurações salvas neste navegador.' : 'Configurações aplicadas, mas o navegador bloqueou o salvamento local.');
  }

  function exportConfig() {
    var data = JSON.stringify({ app: 'tde-calculadora-roi', version: E.CONFIG_VERSION, exportedAt: new Date().toISOString(), config: E.normalizeConfig(draft || config) }, null, 2);
    saveFile('tde-calculadora-configuracoes.json', data, 'application/json');
  }
  function importConfig(e) {
    var file = e.target.files && e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(reader.result);
        var c = obj && obj.config ? obj.config : obj;
        if (!c || typeof c !== 'object' || (!c.scenarios && !c.financial)) throw new Error('formato');
        draft = E.normalizeConfig(c); renderTab(); recompute();
        toast('Configurações importadas. Revise e clique em Salvar para manter.');
      } catch (err) { toast('Arquivo inválido. Use um JSON exportado por esta calculadora.'); }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  // ------------------------------------------------------------ arquivos (PDF / JSON)
  var downloadsP = null;
  function getDownloads() {
    if (!downloadsP) downloadsP = (function () {
      try { if (window.claude && typeof window.claude.use === 'function') return window.claude.use('downloads').catch(function () { return null; }); } catch (e) {}
      return Promise.resolve(null);
    })();
    return downloadsP;
  }
  function saveFile(filename, data, mime) {
    return getDownloads().then(function (dl) {
      if (dl) {
        return dl.save({ filename: filename, data: data }).then(function () { toast('Arquivo pronto: ' + filename); return true; }, function (err) {
          var code = err && err.code;
          if (code === 'declined') return false;
          if (code === 'rate_limited') { toast('Aguarde um instante e tente novamente.'); return false; }
          return fallbackDownload(filename, data, mime);
        });
      }
      return fallbackDownload(filename, data, mime);
    });
  }
  function fallbackDownload(filename, data, mime) {
    try {
      var blob = data instanceof Blob ? data : new Blob([data], { type: mime });
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
      toast('Download iniciado: ' + filename);
      return true;
    } catch (e) { toast('Este navegador bloqueou o download.'); return false; }
  }

  // ------------------------------------------------------------ resumo WhatsApp
  function summaryText() {
    var m = model, f = m.funnel, fi = m.financial, c = m.compare, P = m.projection, T = P.totals;
    var name = sim.name.trim(), lines = [];
    lines.push('*Projeção Tatuador de Elite' + (name ? ' · ' + name : '') + '*');
    lines.push('Investimento mensal em anúncios: ' + money(m.investment) + ' (' + pct(f.followersShare * 100, 0) + ' seguidores · ' + pct((1 - f.followersShare) * 100, 0) + ' contatos)');
    lines.push('Ticket médio: ' + money(m.ticket) + ' · Cenário: ' + m.scenario.name);
    if (m.mode === 'reverse' && m.reverse && m.reverse.feasible) lines.push('Meta: ' + (m.reverse.type === 'revenue' ? money(m.reverse.target) : qty(m.reverse.target) + ' vendas') + ' · investimento mínimo ' + money(m.reverse.investment));
    lines.push('');
    lines.push('*Audiência:* ' + qty(f.followers) + ' novos seguidores por mês');
    lines.push('*Funil mensal:* ' + qty(f.leads) + ' leads → ' + qty(f.qualified) + ' qualificados → ' + qty(f.sales) + ' vendas');
    lines.push('Faturamento: ' + money(m.total.revenue) + (m.total.active ? ' (com alavancas; anúncios ' + money(fi.adRevenue) + ')' : '') + ' · ROAS ' + (m.total.active ? 'total ' + xr(m.total.totalReturn) : xr(fi.roas)));
    lines.push('');
    lines.push('*Sem Método TDE:* ' + qty(c.base.funnel.sales) + ' vendas · ' + money(c.base.fin.adRevenue));
    lines.push('*Com Método TDE (' + m.scenario.name + '):* ' + qty(c.withLevers.improvedSales) + ' vendas · ' + money(c.withLevers.improvedRevenue) + (m.total.active ? ' (com alavancas)' : ''));
    lines.push('Diferença: ' + signedQty(c.withLevers.extraSales) + ' vendas e ' + signedMoney(c.withLevers.incrementalRevenue) + ' por mês');
    lines.push('');
    lines.push('*Projeção de ' + P.months + ' meses:* investimento ' + money(T.investment) + ' · faturamento total ' + money(T.totalRevenue));
    var act = T.levers.filter(function (l) { return l.enabled; });
    if (act.length) lines.push('Alavancas ativas: ' + act.map(function (l) { return l.name; }).join(', ') + ' (+' + qty(T.leverSales) + ' vendas no período)');
    lines.push('');
    lines.push('_Projeção hipotética baseada em premissas configuráveis. Não é garantia de resultado._');
    return lines.join('\n');
  }
  function copySummary() {
    var text = summaryText();
    function fallback() {
      $('modal-root').innerHTML = '<div class="overlay" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="c-title" style="width:min(560px,100%)">' +
        '<div class="modal-h"><div><h2 id="c-title">Resumo para WhatsApp</h2><p>Selecione o texto e copie.</p></div><button class="close-x" type="button" id="m-close" aria-label="Fechar">' + icon('x') + '</button></div>' +
        '<div class="modal-b"><textarea class="inp" id="c-text" style="min-height:320px" readonly>' + esc(text) + '</textarea></div></div></div>';
      $('m-close').addEventListener('click', closeModal);
      $('ov').addEventListener('click', function (e) { if (e.target.id === 'ov') closeModal(); });
      var t = $('c-text'); t.focus(); t.select();
    }
    try { navigator.clipboard.writeText(text).then(function () { toast('Resumo copiado. Cole no WhatsApp.'); }, fallback); } catch (e) { fallback(); }
  }

  // ------------------------------------------------------------ PDF
  function pdfSafe(s) { return String(s).replace(/[−–—]/g, '-').replace(/→/g, '>').replace(/[  ]/g, ' ').replace(/[^\x00-\xff]/g, ''); }

  function generatePdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) { toast('A biblioteca de PDF não carregou. Verifique a conexão e recarregue a página.'); return; }
    var btn = $('btn-pdf'); btn.disabled = true;
    try {
      var doc = buildPdf(model, sim);
      var slug = (sim.name || 'prospect').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'prospect';
      saveFile('proposta-tatuador-de-elite-' + slug + '.pdf', doc.output('blob'), 'application/pdf').then(function () { btn.disabled = false; });
    } catch (e) { btn.disabled = false; toast('Não foi possível gerar o PDF.'); if (window.console) console.error(e); }
  }

  function buildPdf(m, s) {
    var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
    var INK = [8, 8, 8], GOLD = [229, 179, 53], GDARK = [168, 125, 28], LEVER = [184, 138, 34], GRAY = [110, 110, 110], LINE = [226, 226, 226], TINT = [250, 246, 235], RED = [196, 72, 72];
    var DARK = [8, 8, 8], CARD = [20, 20, 20], BORDER = [41, 41, 41], SOFT = [163, 163, 163], MID = [92, 92, 92];
    var LOGO = $('brand-logo').src, LOGO_R = 1848 / 687;
    var name = (s.name || '').trim();
    var dateTxt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
    var f = m.funnel, fi = m.financial, c = m.compare, P = m.projection, T = P.totals, y;

    function T_(x, yy, str, o) { doc.text(pdfSafe(str), x, yy, o || {}); }
    function font(style, size, color) { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor.apply(doc, color || INK); }
    function header(title, sub) {
      doc.setFillColor.apply(doc, DARK); doc.rect(0, 0, 210, 32, 'F');
      doc.setFillColor.apply(doc, GOLD); doc.rect(0, 32, 210, 0.8, 'F');
      doc.addImage(LOGO, 'PNG', 15, 9, 14 * LOGO_R, 14);
      doc.setDrawColor.apply(doc, BORDER); doc.setLineWidth(0.3); doc.line(58, 9, 58, 23);
      font('bold', 15, [255, 255, 255]); T_(63, 16.5, title);
      if (sub) { font('normal', 8.5, SOFT); T_(63, 22.5, sub); }
    }
    function section(yy, title) { font('bold', 11, INK); T_(15, yy, title); doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(0.6); doc.line(15, yy + 2, 30, yy + 2); return yy + 8; }
    function box(x, yy, w, h, label, value, sub, color) {
      doc.setFillColor.apply(doc, TINT); doc.setDrawColor.apply(doc, LINE); doc.setLineWidth(0.2); doc.roundedRect(x, yy, w, h, 2, 2, 'FD');
      font('normal', 7.2, GRAY); T_(x + 4, yy + 6, doc.splitTextToSize(pdfSafe(label), w - 8)[0]);
      font('bold', 12.5, color || INK); T_(x + 4, yy + 13.5, value);
      if (sub) { font('normal', 6.8, GRAY); T_(x + 4, yy + h - 3.5, doc.splitTextToSize(pdfSafe(sub), w - 8)[0]); }
    }
    function boxes(yy, list, cols, w, h, gap) {
      list.forEach(function (b, i) { box(15 + (i % cols) * (w + gap), yy + Math.floor(i / cols) * (h + gap), w, h, b[0], b[1], b[2], b[3]); });
      return yy + Math.ceil(list.length / cols) * (h + gap);
    }
    function table(x, yy, cols, rows, opt) {
      opt = opt || {}; var rh = opt.rh || 7, totalW = cols.reduce(function (a, cc) { return a + cc.w; }, 0), cx;
      doc.setFillColor.apply(doc, DARK); doc.rect(x, yy, totalW, rh, 'F');
      font('bold', 7.5, [255, 255, 255]);
      cx = x; cols.forEach(function (cc) { T_(cc.align === 'left' ? cx + 2.5 : cx + cc.w - 2.5, yy + rh - 2.3, cc.h, { align: cc.align === 'left' ? 'left' : 'right' }); cx += cc.w; });
      yy += rh;
      rows.forEach(function (r, ri) {
        var last = opt.boldLast && ri === rows.length - 1;
        if (last) { doc.setFillColor.apply(doc, TINT); doc.rect(x, yy, totalW, rh, 'F'); }
        else if (ri % 2) { doc.setFillColor(248, 248, 246); doc.rect(x, yy, totalW, rh, 'F'); }
        font(last ? 'bold' : 'normal', 8, INK);
        cx = x; cols.forEach(function (cc, ci) { T_(cc.align === 'left' ? cx + 2.5 : cx + cc.w - 2.5, yy + rh - 2.3, r[ci] === undefined ? '' : String(r[ci]), { align: cc.align === 'left' ? 'left' : 'right' }); cx += cc.w; });
        doc.setDrawColor.apply(doc, LINE); doc.setLineWidth(0.15); doc.line(x, yy + rh, x + totalW, yy + rh);
        yy += rh;
      });
      return yy;
    }
    function note(yy, text) { font('normal', 7.3, GRAY); doc.text(doc.splitTextToSize(pdfSafe(text), 180), 15, yy); }

    // ---- 1. Apresentação
    doc.setFillColor.apply(doc, DARK); doc.rect(0, 0, 210, 297, 'F');
    doc.addImage(LOGO, 'PNG', 15, 22, 30 * LOGO_R, 30);
    doc.setFillColor.apply(doc, GOLD); doc.rect(15, 84, 18, 0.8, 'F');
    font('normal', 10, GOLD); T_(15, 92, 'PROPOSTA COMERCIAL');
    font('bold', 30, [255, 255, 255]);
    doc.text(doc.splitTextToSize('Projeção de Investimento e Resultados', 170), 15, 106, { lineHeightFactor: 1.15 });
    y = 140;
    if (name) { font('normal', 10, SOFT); T_(15, y, 'Preparada para'); font('bold', 20, GOLD); T_(15, y + 10, name.slice(0, 60)); y += 26; }
    var cover = [[m.mode === 'reverse' && m.reverse && m.reverse.feasible ? 'Investimento mínimo para a meta' : 'Investimento mensal em anúncios', money(m.investment)], ['Ticket médio', money(m.ticket)],
      ['Cenário selecionado', m.scenario.name], ['Período da projeção', P.months + ' meses']];
    cover.forEach(function (it, i) {
      var bx = 15 + (i % 2) * 92, by = y + Math.floor(i / 2) * 26;
      doc.setDrawColor.apply(doc, BORDER); doc.setFillColor.apply(doc, CARD); doc.setLineWidth(0.3); doc.roundedRect(bx, by, 88, 22, 2.5, 2.5, 'FD');
      font('normal', 8, SOFT); T_(bx + 5, by + 8, it[0]);
      font('bold', 14, i < 2 ? GOLD : [255, 255, 255]); T_(bx + 5, by + 17, it[1]);
    });
    font('normal', 9, SOFT); T_(15, 262, 'Tatuador de Elite · ' + dateTxt);

    // ---- 2. Audiência e aquisição
    doc.addPage(); header('Audiência e aquisição', 'Distribuição da verba, seguidores e leads');
    y = section(46, 'Distribuição do investimento: ' + money(f.investment) + ' por mês');
    var fw = 180 * f.followersShare;
    doc.setFillColor.apply(doc, MID); if (fw > 0) doc.rect(15, y, fw, 9, 'F');
    doc.setFillColor.apply(doc, GOLD); if (fw < 180) doc.rect(15 + fw, y, 180 - fw, 9, 'F');
    y += 15;
    y = table(15, y, [{ h: 'Destino da verba', w: 90, align: 'left' }, { h: 'Percentual', w: 40 }, { h: 'Investimento', w: 50 }], [
      ['Captação de seguidores', pct(f.followersShare * 100, 0), money(f.followersBudget)],
      ['Geração de contatos', pct((1 - f.followersShare) * 100, 0), money(f.contactsBudget)]
    ]);
    y = section(y + 10, 'Crescimento de audiência');
    y = boxes(y, [
      ['Custo por seguidor', f.followerCost > 0 ? money(f.followerCost) : '-', m.config.acquisition.followerCostMode === 'manual' ? 'Valor manual' : 'Referência histórica'],
      ['Seguidores da captação', qty(f.followersDirect), 'Verba de seguidores'],
      ['Seguidores adicionais', qty(f.followersIndirect), 'Campanhas de contatos'],
      ['Total de seguidores', qty(f.followers), 'Por mês', GDARK]
    ], 4, 43.5, 22, 2.33);
    note(y + 2, 'Seguidores representam crescimento de audiência e potencial de relacionamento futuro. Eles não são convertidos em vendas na projeção.');
    y = section(y + 14, 'Geração de leads');
    y = boxes(y, [
      ['CPL dos contatos', money(f.cpl), 'Custo por lead'],
      ['Leads das campanhas', qty(f.contactLeads), money(f.contactsBudget) + ' / CPL'],
      ['Conversas da captação', qty(f.extraConversations), m.config.acquisition.extraConversationsEnabled ? 'Incluídas no funil' : 'Desativadas'],
      ['Leads totais', qty(f.leads), 'Por mês', GDARK]
    ], 4, 43.5, 22, 2.33);
    if (m.config.acquisition.extraConversationsEnabled) note(y + 2, 'Premissa: as conversas geradas pela captação são contatos distintos dos leads das campanhas de contatos (sem deduplicação comprovada).');
    var hh = m.config.acquisition.history;
    note(y + 12, 'Base histórica: 9 semanas de campanhas de um cliente real (R$ ' + nf(2, 2).format(hh.followerInvestment) + ' em captação gerando ' + qty(hh.directFollowers) + ' seguidores e ' + qty(hh.extraConversations) + ' conversas; R$ ' + nf(2, 2).format(hh.contactInvestment) + ' em contatos gerando ' + qty(hh.indirectFollowers) + ' seguidores adicionais).');

    // ---- 3. Funil comercial
    doc.addPage(); header('Funil comercial', 'Cenário ' + m.scenario.name);
    y = section(46, m.mode === 'reverse' ? 'Funil com o investimento mínimo para a meta' : 'Funil de conversão mensal');
    var stages = [
      ['Leads recebidos: ' + qty(f.leads), qty(f.contactLeads) + ' das campanhas + ' + qty(f.extraConversations) + ' conversas da captação'],
      ['Leads qualificados: ' + qty(f.qualified), 'Qualificação de ' + rateTxt(f.qualificationRate)],
      ['Vendas realizadas: ' + qty(f.sales), 'Fechamento de ' + rateTxt(f.closeRate) + ' · conversão geral ' + rateTxt(f.conversionRate)],
      ['Faturamento projetado: ' + money(m.total.revenue), m.total.active ? money0(fi.adRevenue) + ' anúncios + ' + money0(m.total.leverRevenue) + ' alavancas (a partir do mês ' + m.total.month + ')' : qty(f.sales) + ' vendas x ' + money(m.ticket)]
    ];
    var shades = [[8, 8, 8], [60, 46, 16], [150, 112, 26], [229, 179, 53]];
    stages.forEach(function (st, i) {
      var w = 180 - i * 26, x = 105 - w / 2;
      doc.setFillColor.apply(doc, shades[i]); doc.roundedRect(x, y, w, 13, 2, 2, 'F');
      font('bold', 10.5, i === 3 ? INK : [255, 255, 255]); T_(105, y + 6.5, st[0], { align: 'center' });
      font('normal', 7, i === 3 ? [60, 45, 10] : [210, 205, 195]); T_(105, y + 10.6, st[1], { align: 'center' });
      y += 15.5;
    });
    note(y + 1, 'Cálculo com valores esperados; quantidades inteiras arredondadas apenas no final. Faturamento = vendas inteiras x ticket médio.');
    y = section(y + 12, 'Indicadores financeiros (mensal, somente anúncios)');
    y = boxes(y, [
      ['Faturamento bruto', money(m.total.revenue), m.total.active ? 'Inclui ' + money0(m.total.leverRevenue) + ' das alavancas' : qty(fi.adSales) + ' vendas', GDARK],
      ['ROAS hipotético', xr(fi.roas), 'Faturamento / investimento', GDARK],
      ['Custo por venda', fi.costPerSale === null ? 'Sem vendas' : money(fi.costPerSale), 'Investimento / vendas'],
      ['Custo por lead', money(f.costPerLead), 'Campanhas de contatos'],
      ['CPL qualificado', money(f.contactQualifiedCost), 'Só campanhas de contatos'],
      ['Custo global/qualificado', money(f.globalQualifiedCost), 'Investimento total'],
      ['ROI estimado', fi.roi === null ? '-' : (fi.roi > 0 ? '+' : '') + pct(fi.roi, 0), fi.roi === null ? 'Sem margem informada' : 'Sobre custos fixos', fi.roi !== null && fi.roi < 0 ? RED : GDARK],
      [fi.breakEvenSimplified ? 'Equilíbrio simplificado' : 'Ponto de equilíbrio', fi.breakEvenSales === null ? '-' : qty(fi.breakEvenSales) + ' vendas', STATUS[fi.status]]
    ], 4, 43.5, 22, 2.33);
    y = section(y + 6, 'Custos considerados no mês');
    y = table(15, y, [{ h: 'Item', w: 120, align: 'left' }, { h: 'Valor', w: 60 }], [
      ['Investimento em anúncios', money(fi.investment)],
      ['Honorários' + (m.fin.includeAgencyFee ? '' : ' (não incluídos)'), money(fi.agencyFee)],
      ['Custos adicionais', money(fi.otherCosts)],
      ['Custos variáveis (' + pct(fi.variableCostPct * 100) + ' do faturamento)', money(fi.variableCosts)],
      ['Resultado estimado' + (fi.costsInformed ? '' : ' (sem margem informada)'), money(fi.result)]
    ], { boldLast: true, rh: 6.6 });
    if (m.mode === 'reverse' && m.reverse && m.reverse.feasible) {
      var r = m.reverse;
      note(y + 6, 'Meta: ' + (r.type === 'revenue' ? money(r.target) + ' de faturamento' : qty(r.target) + ' vendas') + '. Investimento mínimo: ' + money(r.investment) + ' (atual: ' + money(r.currentInvestment) + '; diferença ' + signedMoney(r.difference) + ').');
    }

    // ---- 4. Comparativo
    doc.addPage(); header('Comparativo de resultados', 'Mesmo investimento (' + money(m.investment) + ') e ticket');
    y = section(46, 'Sem Método TDE x Com Método TDE (' + m.scenario.name + ')');
    function dd(a, b, fmt) { var d = b - a; return Math.abs(d) < 1e-9 ? '0' : (d > 0 ? '+' : '') + fmt(d) + (a > 0 ? ' (' + (d > 0 ? '+' : '') + pct(d / a * 100, 0) + ')' : ''); }
    var B = c.base, I = c.improved, W = c.withLevers;
    y = table(15, y, [{ h: 'Métrica', w: 54, align: 'left' }, { h: 'Sem Método TDE', w: 40 }, { h: 'Com Método TDE', w: 40 }, { h: 'Diferença', w: 46 }], [
      ['Investimento', money(B.funnel.investment), money(I.funnel.investment), '-'],
      ['CPL dos contatos', money(B.funnel.cpl), money(I.funnel.cpl), dd(B.funnel.cpl, I.funnel.cpl, money)],
      ['Leads recebidos', qty(B.funnel.leads), qty(I.funnel.leads), dd(B.funnel.leads, I.funnel.leads, qty)],
      ['Leads qualificados', qty(B.funnel.qualified), qty(I.funnel.qualified), dd(B.funnel.qualified, I.funnel.qualified, qty)],
      ['Vendas' + (m.total.active ? ' (com alavancas)' : ''), qty(B.funnel.sales), qty(W.improvedSales), dd(B.funnel.sales, W.improvedSales, qty)],
      ['Faturamento' + (m.total.active ? ' (com alavancas)' : ''), money(B.fin.adRevenue), money(W.improvedRevenue), dd(B.fin.adRevenue, W.improvedRevenue, money)],
      [m.total.active ? 'ROAS total' : 'ROAS', xr(B.fin.roas), xr(W.improvedReturn), (W.improvedReturn !== null && B.fin.roas !== null) ? (W.improvedReturn - B.fin.roas > 0 ? '+' : '') + nf(2, 2).format(W.improvedReturn - B.fin.roas) + 'x' : '-'],
      ['Conversão geral', rateTxt(c.conversionBase), rateTxt(c.conversionImproved), (c.conversionDeltaPP >= 0 ? '+' : '') + nf(1, 1).format(c.conversionDeltaPP) + ' p.p.']
    ], { rh: 7.6 });
    y += 7;
    y = boxes(y, [
      ['Vendas adicionais', signedQty(W.extraSales), m.total.active ? 'por mês, com alavancas' : 'por mês', GDARK],
      ['Faturamento extra', signedMoney(W.incrementalRevenue), m.total.active ? 'por mês, inclui ' + money0(m.total.leverRevenue) + ' das alavancas' : 'por mês', GDARK],
      ['Redução do CPL', money(c.cplReduction), c.cplReductionPct === null ? '' : pct(c.cplReductionPct, 0) + ' menor', GDARK],
      ['Ganho de eficiência comercial', c.conversionRelativePct === null ? '-' : (c.conversionRelativePct > 0 ? '+' : '') + pct(c.conversionRelativePct, 0), rateTxt(c.conversionBase) + ' > ' + rateTxt(c.conversionImproved) + ' de conversão', GDARK]
    ], 2, 89, 24, 2);
    note(y + 2, 'Sem Método TDE, oportunidades não convertidas: ' + qty(B.funnel.notQualified) + ' leads não qualificados e ' + qty(B.funnel.qualifiedNotClosed) + ' qualificados que não fecharam. Não são vendas perdidas garantidas.');
    y = section(y + 14, 'Premissas de cada operação');
    var ind = m.config.independent;
    y = table(15, y, [{ h: 'Premissa', w: 80, align: 'left' }, { h: 'Sem Método TDE', w: 50 }, { h: 'Com Método TDE', w: 50 }], [
      ['CPL dos contatos', money(m.independent.cpl), money(m.op.cpl)],
      ['Qualificação', rateTxt(m.independent.qualificationRate), rateTxt(m.op.qualificationRate)],
      ['Fechamento sobre qualificados', rateTxt(m.independent.closeRate), rateTxt(m.op.closeRate)],
      ['Custo por seguidor', money(m.independent.followerCost), money(m.op.followerCost)],
      ['Verba seguidores / contatos', pct(m.independent.followersShare * 100, 0) + ' / ' + pct((1 - m.independent.followersShare) * 100, 0), pct(m.op.followersShare * 100, 0) + ' / ' + pct((1 - m.op.followersShare) * 100, 0)],
      ['Conversas da captação', ind.extraConversationsEnabled ? 'Sim' : 'Não', m.config.acquisition.extraConversationsEnabled ? 'Sim' : 'Não']
    ], { rh: 6.8 });
    font('italic', 7.5, GRAY); T_(15, y + 7, 'Comparativo hipotético entre premissas configuráveis. Não é garantia de resultado nem medição causal do método.');

    // ---- 5. Projeção
    doc.addPage(); header('Projeção de ' + P.months + ' meses', 'Faturamento e funil mês a mês');
    y = section(46, 'Faturamento projetado por mês');
    var cx0 = 32, cy0 = y + 2, cw = 163, chh = 52, n = P.rows.length;
    var maxV = niceMax(Math.max.apply(null, P.rows.map(function (r) { return r.totalRevenue; })) * 1.08);
    for (var t = 0; t <= 4; t++) {
      var gy = cy0 + chh - chh * t / 4;
      doc.setDrawColor.apply(doc, LINE); doc.setLineWidth(0.15); doc.line(cx0, gy, cx0 + cw, gy);
      font('normal', 6.5, GRAY); T_(cx0 - 2, gy + 1, moneyC(maxV * t / 4), { align: 'right' });
    }
    var gw = cw / n, bw2 = Math.min(12, gw * 0.6);
    P.rows.forEach(function (r, i) {
      var bx = cx0 + gw * i + (gw - bw2) / 2, h1 = chh * r.adRevenue / maxV, h2 = chh * r.leverRevenue / maxV;
      doc.setFillColor.apply(doc, GOLD); if (h1 > 0) doc.rect(bx, cy0 + chh - h1, bw2, h1, 'F');
      doc.setFillColor.apply(doc, LEVER); if (h2 > 0) doc.rect(bx, cy0 + chh - h1 - h2, bw2, h2, 'F');
      font('normal', 6.5, GRAY); T_(cx0 + gw * i + gw / 2, cy0 + chh + 4.5, 'M' + r.month, { align: 'center' });
    });
    y = cy0 + chh + 10;
    doc.setFillColor.apply(doc, GOLD); doc.rect(cx0, y - 2.6, 3, 3, 'F'); font('normal', 7.5, GRAY); T_(cx0 + 5, y, 'Faturamento dos anúncios');
    doc.setFillColor.apply(doc, LEVER); doc.rect(cx0 + 50, y - 2.6, 3, 3, 'F'); T_(cx0 + 55, y, 'Faturamento das alavancas adicionais');
    y += 6;
    y = boxes(y, [['Investimento acumulado', money(T.investment), '', GDARK], ['Faturamento dos anúncios', money(T.adRevenue), '', GDARK], ['Faturamento total', money(T.totalRevenue), '', GDARK], ['ROAS acumulado', xr(T.roas), '', GDARK]], 4, 43.5, 20, 2.33);
    y += 2;
    var trows = P.rows.map(function (r) { return [String(r.month), money0(r.investment), qty(r.followers), qty(r.leads), qty(r.qualified), qty(r.adSales), qty(r.leverSales), money0(r.totalRevenue), xr(r.roas)]; });
    trows.push(['Total', money0(T.investment), qty(T.followers), qty(T.leads), qty(T.qualified), qty(T.adSales), qty(T.leverSales), money0(T.totalRevenue), xr(T.roas)]);
    y = table(15, y, [{ h: 'Mês', w: 12, align: 'left' }, { h: 'Investimento', w: 24 }, { h: 'Seguidores', w: 20 }, { h: 'Leads', w: 16 }, { h: 'Qualificados', w: 21 }, { h: 'Vendas anúncios', w: 24 }, { h: 'Vendas alav.', w: 19 }, { h: 'Faturamento', w: 26 }, { h: 'ROAS', w: 18 }], trows, { boldLast: true, rh: 6.2 });
    var notes = [s.projection.growthEnabled ? 'Investimento cresce ' + pct(s.projection.growthPct * 100) + ' ao mês.' : 'Investimento constante.',
      s.projection.rampEnabled ? 'Rampagem de ' + s.projection.rampMonths + ' meses: eficiência de ' + pct(s.projection.startEfficiency * 100, 0) + ' a ' + pct(s.projection.finalEfficiency * 100, 0) + ' sobre o fechamento.' : 'Sem rampagem.',
      'Totais = soma dos meses exibidos. ROAS acumulado = faturamento dos anúncios acumulado / investimento acumulado.'];
    note(y + 5, notes.join(' '));

    // ---- 6. Estratégias adicionais
    doc.addPage(); header('Estratégias adicionais', 'Alavancas comerciais e premissas');
    y = section(46, 'Contribuição de cada alavanca em ' + P.months + ' meses');
    var lrows = [['01 · Tráfego Pago', 'Ativa', 'Funil principal', qty(T.adSales), money0(T.adRevenue), money0(T.investment)]];
    m.levers.list.forEach(function (l, i) {
      var tt = T.levers[i];
      lrows.push(['0' + (i + 2) + ' · ' + l.name, tt.enabled ? 'Ativa' : 'Inativa', '+' + qty(l.salesPerMonth) + ' x ' + money0(l.ticket) + ' após ' + Math.round(l.maturationMonths) + ' m',
        tt.enabled ? qty(tt.sales) : '-', tt.enabled ? money0(tt.revenue) : '-', tt.enabled ? money0(tt.cost) : '-']);
    });
    y = table(15, y, [{ h: 'Alavanca', w: 46, align: 'left' }, { h: 'Status', w: 18 }, { h: 'Regra', w: 40 }, { h: 'Vendas', w: 20 }, { h: 'Faturamento', w: 30 }, { h: 'Custo', w: 26 }], lrows, { rh: 7.5 });
    y = section(y + 9, 'Resultado combinado');
    y = boxes(y, [
      ['Total de vendas', qty(T.totalSales), qty(T.adSales) + ' anúncios + ' + qty(T.leverSales) + ' alavancas', GDARK],
      ['Faturamento combinado', money(T.totalRevenue), 'Anúncios + alavancas', GDARK],
      ['Resultado consolidado', money(T.totalResult), 'Após custos considerados', T.totalResult < 0 ? RED : GDARK],
      ['Retorno consolidado', xr(T.consolidatedReturn), 'Faturamento / custos fixos', GDARK]
    ], 2, 89, 24, 2);
    note(y + 2, 'Mês 1: ' + qty(m.levers.now.totalSales) + ' vendas (' + money0(m.levers.now.totalRevenue) + '). Após maturação: ' + qty(m.levers.mature.totalSales) + ' vendas por mês (' + money0(m.levers.mature.totalRevenue) + '). Vendas das alavancas não entram no ROAS dos anúncios.');
    y = section(y + 14, 'Premissas utilizadas na simulação');
    table(15, y, [{ h: 'Premissa', w: 110, align: 'left' }, { h: 'Valor', w: 70 }], [
      ['Investimento / ticket médio', money(m.investment) + ' / ' + money(m.ticket)],
      ['Distribuição seguidores / contatos', pct(f.followersShare * 100, 0) + ' / ' + pct((1 - f.followersShare) * 100, 0)],
      ['CPL das campanhas de contatos', money(f.cpl)],
      ['Custo por seguidor', money(f.followerCost)],
      ['Qualificação / fechamento (' + m.scenario.name + ')', rateTxt(f.qualificationRate) + ' / ' + rateTxt(m.op.closeRate)],
      ['Custos variáveis / margem de contribuição', pct(fi.variableCostPct * 100) + ' / ' + pct(fi.contributionMargin * 100)],
      ['Honorários / custos adicionais', (m.fin.includeAgencyFee ? money(fi.agencyFee) : 'Não incluídos') + ' / ' + money(fi.otherCosts)]
    ], { rh: 6.8 });

    var pages = doc.getNumberOfPages();
    for (var pg = 1; pg <= pages; pg++) {
      doc.setPage(pg);
      var dark = pg === 1;
      doc.setDrawColor.apply(doc, dark ? BORDER : LINE); doc.setLineWidth(0.2); doc.line(15, 282, 195, 282);
      font('normal', 6.8, dark ? SOFT : GRAY);
      T_(15, 287, 'Projeções hipotéticas baseadas em premissas configuráveis. Não constituem garantia de resultado.');
      T_(195, 287, 'Página ' + pg + ' de ' + pages, { align: 'right' });
    }
    return doc;
  }

  // ------------------------------------------------------------ início
  hydrateIcons(document);
  bindStatic();
  bindChartTip();
  syncInputs();
  recompute();
  window.__tde = { get model() { return model; }, get sim() { return sim; }, get config() { return config; }, summaryText: summaryText, buildPdf: function () { return buildPdf(model, sim); } };
})();
