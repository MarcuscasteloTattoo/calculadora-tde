(function () {
  'use strict';
  var E = window.Engine;

  // ------------------------------------------------------------ ícones (Lucide, traço 2)
  var ICONS = {
    castle: '<path d="M3 21V9h3V5h3v4h2V5h2v4h2V5h3v4h3v12"/><path d="M10 21v-4a2 2 0 0 1 4 0v4"/><path d="M2 21h20"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    sliders: '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
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
  function money(v) { return v === null || v === undefined || !isFinite(v) ? '—' : BRL.format(v); }
  function money0(v) { return v === null || v === undefined || !isFinite(v) ? '—' : BRL0.format(v); }
  function moneyC(v) { return BRLC.format(v); }
  function signedMoney(v) { return (v > 0 ? '+' : '') + money(v); }
  function qty(v) {
    if (v === null || v === undefined || !isFinite(v)) return '—';
    if (model && model.policy === 'expected') return nf(0, 1).format(Math.round(v * 10) / 10);
    return Number.isInteger(v) ? nf(0, 0).format(v) : nf(0, 1).format(v);
  }
  function xr(v) { return v === null || v === undefined || !isFinite(v) ? '—' : nf(1, 1).format(v) + 'x'; }
  function pct(v, d) { return v === null || v === undefined || !isFinite(v) ? '—' : nf(0, d === undefined ? 1 : d).format(v) + '%'; }
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
  // Valida um texto digitado. Retorna {value} ou {error}.
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
  var K_CFG = 'castelo-roi:config:v1', K_SIM = 'castelo-roi:sim:v1';
  function load(k) { try { var s = localStorage.getItem(k); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var config = E.normalizeConfig(load(K_CFG));
  var sim = normalizeSim(load(K_SIM));
  var draft = null;   // cópia em edição no painel de configurações
  var model = null;

  function normalizeSim(s) {
    var d = E.defaultSim(config);
    if (!s || typeof s !== 'object') return d;
    Object.keys(d).forEach(function (k) {
      if (s[k] === undefined) return;
      if (k === 'projection') d.projection = Object.assign(d.projection, s.projection || {});
      else if (k === 'leversEnabled') d.leversEnabled = Object.assign({}, s.leversEnabled || {});
      else if (typeof s[k] === typeof d[k]) d[k] = s[k];
    });
    return d;
  }
  function cfg() { return draft || config; }

  // ------------------------------------------------------------ utilidades de DOM
  function $(id) { return document.getElementById(id); }
  function setHTML(el, html) {
    var a = document.activeElement, id = a && el.contains(a) ? a.id : null;
    el.innerHTML = html;
    hydrateIcons(el);
    if (id) { var n = document.getElementById(id); if (n) n.focus(); }
  }
  function toast(msg, ms) {
    var root = $('toast-root');
    root.innerHTML = '<div class="toast" role="status">' + esc(msg) + '</div>';
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { root.innerHTML = ''; }, ms || 3200);
  }
  function setPressed(group, attr, val) {
    $(group).querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(attr) === String(val))); });
  }
  function setSwitch(id, on) { $(id).setAttribute('aria-checked', String(!!on)); }
  function tip(text) { return '<span class="tip" tabindex="0" data-tip="' + esc(text) + '">?</span>'; }

  // ------------------------------------------------------------ ciclo principal
  function recompute() {
    model = E.computeAll(cfg(), sim);
    renderAll();
    store(K_SIM, sim);
  }

  function renderAll() {
    renderModeUI();
    renderScenarios();
    renderReverse();
    renderCosts();
    renderFunnel();
    renderKpis();
    renderSelects();
    renderCompare();
    renderProjectionControls();
    renderChart();
    renderTable();
    renderLevers();
  }

  // ------------------------------------------------------------ entradas do prospect
  function bindNumInput(el, errEl, kindArg, get, set, opt) {
    function K() { return typeof kindArg === 'function' ? kindArg() : kindArg; }
    el.addEventListener('input', function () {
      var kind = K();
      var r = validate(kind, el.value, opt);
      el.classList.toggle('bad', !!r.error);
      if (errEl) errEl.textContent = r.error || '';
      if (r.error) { set(r.fallback !== undefined ? r.fallback : (kind === 'money' && el.value.trim() === '' ? 0 : get())); }
      else set(r.value);
      recompute();
    });
    el.addEventListener('blur', function () {
      var kind = K();
      var r = validate(kind, el.value, opt);
      if (!r.error || el.value.trim() === '') {
        el.value = fmtInput(kind, get()); el.classList.remove('bad'); if (errEl) errEl.textContent = '';
      }
    });
    el.addEventListener('focus', function () { setTimeout(function () { try { el.select(); } catch (e) {} }, 0); });
  }

  function syncInputs() {
    $('in-name').value = sim.name;
    $('in-investment').value = fmtInput('money', sim.investment);
    $('in-ticket').value = fmtInput('money', sim.ticket);
    $('in-target').value = sim.reverseType === 'sales' ? fmtInput('num', sim.reverseTarget) : fmtInput('money', sim.reverseTarget);
    $('in-growth').value = fmtInput('pct', sim.projection.growthPct);
    $('in-ramp').value = fmtInput('int', sim.projection.rampMonths);
    $('in-eff-start').value = fmtInput('pct', sim.projection.startEfficiency);
    $('in-eff-final').value = fmtInput('pct', sim.projection.finalEfficiency);
    ['in-investment', 'in-ticket', 'in-target', 'in-growth', 'in-ramp', 'in-eff-start', 'in-eff-final'].forEach(function (id) { $(id).classList.remove('bad'); });
    ['err-investment', 'err-ticket', 'err-target', 'err-growth', 'err-ramp', 'err-eff-start', 'err-eff-final'].forEach(function (id) { $(id).textContent = ''; });
  }

  function bindStatic() {
    $('in-name').addEventListener('input', function (e) { sim.name = e.target.value.slice(0, 80); store(K_SIM, sim); });
    bindNumInput($('in-investment'), $('err-investment'), 'money', function () { return sim.investment; }, function (v) { sim.investment = v; });
    bindNumInput($('in-ticket'), $('err-ticket'), 'money', function () { return sim.ticket; }, function (v) { sim.ticket = v; });
    bindNumInput($('in-target'), $('err-target'), function () { return sim.reverseType === 'sales' ? 'num' : 'money'; }, function () { return sim.reverseTarget; }, function (v) { sim.reverseTarget = v; });
    bindNumInput($('in-growth'), $('err-growth'), 'pct', function () { return sim.projection.growthPct; }, function (v) { sim.projection.growthPct = v; }, { max: 100 });
    bindNumInput($('in-ramp'), $('err-ramp'), 'int', function () { return sim.projection.rampMonths; }, function (v) { sim.projection.rampMonths = v; }, { min: 1, max: 12 });
    bindNumInput($('in-eff-start'), $('err-eff-start'), 'pct', function () { return sim.projection.startEfficiency; }, function (v) { sim.projection.startEfficiency = v; }, { max: 200 });
    bindNumInput($('in-eff-final'), $('err-eff-final'), 'pct', function () { return sim.projection.finalEfficiency; }, function (v) { sim.projection.finalEfficiency = v; }, { max: 200 });

    $('seg-mode').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; sim.mode = b.getAttribute('data-mode'); recompute();
    });
    $('seg-rtype').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var t = b.getAttribute('data-rtype'); if (t === sim.reverseType) return;
      sim.reverseType = t;
      sim.reverseTarget = t === 'sales' ? 6 : 10000;
      $('in-target').value = t === 'sales' ? fmtInput('num', sim.reverseTarget) : fmtInput('money', sim.reverseTarget);
      $('err-target').textContent = ''; $('in-target').classList.remove('bad');
      recompute();
    });
    $('scen-buttons').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-scen]'); if (!b) return; sim.scenarioId = b.getAttribute('data-scen'); recompute();
    });
    $('sw-fee').addEventListener('click', function () { sim.includeAgencyFee = !sim.includeAgencyFee; recompute(); });
    $('sel-base').addEventListener('change', function (e) { sim.compareBaseId = e.target.value; recompute(); });
    $('sel-imp').addEventListener('change', function (e) { sim.compareImprovedId = e.target.value; recompute(); });
    $('seg-months').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; sim.projection.months = Number(b.getAttribute('data-months')); recompute();
    });
    $('sw-growth').addEventListener('click', function () { sim.projection.growthEnabled = !sim.projection.growthEnabled; recompute(); });
    $('sw-ramp').addEventListener('click', function () { sim.projection.rampEnabled = !sim.projection.rampEnabled; recompute(); });
    $('seg-metric').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; sim.chartMetric = b.getAttribute('data-metric'); recompute();
    });
    $('levers').addEventListener('click', function (e) {
      var sw = e.target.closest('[data-lever]');
      if (sw) { var id = sw.getAttribute('data-lever'); sim.leversEnabled[id] = !sim.leversEnabled[id]; recompute(); return; }
      if (e.target.closest('[data-lever-cfg]')) openSettings('alavancas');
    });
    $('btn-settings').addEventListener('click', function () { openSettings('financeiro'); });
    $('btn-params').addEventListener('click', function () { openSettings('comerciais'); });
    $('btn-costs').addEventListener('click', function () { openSettings('financeiro'); });
    $('btn-new').addEventListener('click', newSimulation);
    $('btn-copy').addEventListener('click', copySummary);
    $('btn-pdf').addEventListener('click', generatePdf);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('modal-root').innerHTML) closeModal(); });
  }

  function newSimulation() {
    var btn = $('btn-new');
    if (!btn._armed) {
      btn._armed = true;
      btn.innerHTML = icon('refresh') + 'Confirmar nova simulação';
      setTimeout(function () { if (btn._armed) { btn._armed = false; btn.innerHTML = icon('refresh') + 'Nova simulação'; } }, 3500);
      return;
    }
    btn._armed = false; btn.innerHTML = icon('refresh') + 'Nova simulação';
    sim = E.defaultSim(config);
    syncInputs(); recompute();
    $('in-name').focus();
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
    $('funnel-sub').textContent = rev ? 'Funil com o investimento necessário para atingir a meta.' : 'Mês de referência, com a operação madura.';
    setSwitch('sw-fee', model.fin.includeAgencyFee);
  }

  function renderScenarios() {
    var c = cfg();
    var html = c.scenarios.map(function (s) {
      return '<button type="button" id="scen-' + esc(s.id) + '" data-scen="' + esc(s.id) + '" aria-pressed="' + (s.id === model.scenario.id) + '">' + esc(s.name) + '</button>';
    }).join('');
    if ($('scen-buttons')._sig !== html) { setHTML($('scen-buttons'), html); $('scen-buttons')._sig = html; }
    $('scen-desc').textContent = model.scenario.description || '';
    var p = model.scenario.params;
    $('scen-chips').innerHTML =
      '<span class="chip">CPL <b>' + money(p.cpl) + '</b></span>' +
      '<span class="chip">Agendamento <b>' + rateTxt(p.scheduleRate) + '</b></span>' +
      '<span class="chip">Comparecimento <b>' + rateTxt(p.showRate) + '</b></span>' +
      '<span class="chip">Fechamento <b>' + rateTxt(p.closeRate) + '</b></span>';
    $('scen-issues').innerHTML = model.issues.length ? '<div class="alert red" style="margin-top:10px">' + model.issues.map(esc).join(' ') + ' Ajuste em Configurar parâmetros.</div>' : '';
  }

  function renderReverse() {
    var el = $('reverse-result');
    if (sim.mode !== 'reverse') { el.innerHTML = ''; return; }
    var r = model.reverse;
    if (!r.feasible) { el.innerHTML = '<div class="alert red" style="margin-top:14px">Não é possível calcular a meta: ' + esc(r.reason) + '</div>'; return; }
    var diff = r.difference;
    var diffTxt = Math.abs(diff) < 0.005 ? 'Igual ao atual' : (diff > 0 ? '+' + money(diff) + ' por mês' : money(diff) + ' por mês');
    var metaTxt = r.type === 'revenue' ? money(r.target) + ' de faturamento' : qty(r.target) + ' ' + plural(r.target, 'venda', 'vendas');
    el.innerHTML = '<div class="box reverse-box">' +
      '<div class="kv"><span>Meta</span><b>' + metaTxt + '</b></div>' +
      '<div class="kv"><span>Vendas necessárias</span><b>' + qty(r.sales) + (r.type === 'revenue' ? ' (' + money(r.revenue) + ')' : '') + '</b></div>' +
      '<div class="kv"><span>Comparecimentos necessários</span><b>' + qty(r.shows) + '</b></div>' +
      '<div class="kv"><span>Agendamentos necessários</span><b>' + qty(r.appointments) + '</b></div>' +
      '<div class="kv"><span>Leads necessários</span><b>' + qty(r.leads) + '</b></div>' +
      '<div class="kv" style="border-top:1px solid var(--line);padding-top:10px"><span>Investimento necessário</span><b style="color:var(--green);font-size:16px">' + money(r.investment) + '</b></div>' +
      '<div class="kv"><span>Investimento atual</span><b>' + money(r.currentInvestment) + '</b></div>' +
      '<div class="kv"><span>Diferença</span><b style="color:' + (diff > 0 ? 'var(--amber)' : 'var(--green)') + '">' + diffTxt + '</b></div>' +
      '</div><p class="hint" style="margin-top:8px">Calculado com as taxas do cenário ' + esc(model.scenario.name) + '. Considera somente vendas dos anúncios.</p>';
  }

  function renderCosts() {
    var f = model.financial, fin = model.fin;
    var feeRaw = Number(fin.agencyFee) || 0;
    $('costs-list').innerHTML =
      '<div class="kv"><span>Investimento em anúncios</span><b>' + money(f.investment) + '</b></div>' +
      '<div class="kv" style="margin-top:6px"><span>Honorários da agência' + (fin.includeAgencyFee ? '' : ' (não incluídos)') + '</span><b>' + (feeRaw > 0 ? money(feeRaw) : 'Não informado') + '</b></div>' +
      '<div class="kv" style="margin-top:6px"><span>Outros custos fixos</span><b>' + money(f.otherCosts) + '</b></div>' +
      '<div class="kv" style="margin-top:6px"><span>Custos variáveis (' + pct(f.variableCostPct * 100) + ' do faturamento)</span><b>' + money(f.variableCosts) + '</b></div>' +
      '<div class="kv" style="margin-top:10px;border-top:1px solid var(--line);padding-top:10px"><span>Total considerado no mês</span><b>' + money(f.fixedCosts + f.variableCosts) + '</b></div>';
  }

  function renderFunnel() {
    var f = model.funnel;
    var base = f.leads > 0 ? f.leads : 1;
    function stage(ic, name, value, sub, w, final) {
      return '<div class="stage' + (final ? ' final' : '') + '"><div class="ic">' + icon(ic) + '</div><div style="min-width:0"><div class="nm">' + name + '</div>' +
        (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div><div class="value">' + value + '</div>' +
        (w !== null ? '<div class="bar" style="width:' + Math.max(0, Math.min(100, w)) + '%"></div>' : '') + '</div>';
    }
    function conn(t) { return '<div class="conn">' + t + '</div>'; }
    var effNote = Math.abs(f.efficiency - 1) > 1e-9 ? ' (eficiência ' + pct(f.efficiency * 100, 0) + ' aplicada)' : '';
    var html =
      stage('dollar', 'Investimento mensal', money(f.investment), 'CPL considerado: ' + money(f.cpl), null) +
      conn('÷ CPL de <b>' + money(f.cpl) + '</b>') +
      stage('target', 'Leads gerados', qty(f.leads), 'Contatos estimados no mês', 100) +
      conn('× <b>' + rateTxt(f.scheduleRate) + '</b> taxa de agendamento' + effNote) +
      stage('calendar', 'Agendamentos', qty(f.appointments), 'Orçamentos ou sessões marcadas', f.appointments / base * 100) +
      conn('× <b>' + rateTxt(f.showRate) + '</b> taxa de comparecimento') +
      stage('check', 'Comparecimentos', qty(f.shows), 'Pessoas que comparecem', f.shows / base * 100) +
      conn('× <b>' + rateTxt(f.closeRate) + '</b> taxa de fechamento') +
      stage('trend', 'Vendas (fechamentos)', qty(f.sales), 'Projetos fechados vindos dos anúncios', f.sales / base * 100, true);
    $('funnel').innerHTML = html;
    $('policy-note').textContent = model.policy === 'expected'
      ? 'Valores esperados (médias estatísticas), exibidos com 1 casa decimal. Faturamento = vendas esperadas × ticket médio.'
      : 'Quantidades inteiras: cada etapa é arredondada para baixo, pois não existem meias pessoas. Faturamento = vendas exibidas × ticket médio.';
    if (!f.valid) $('policy-note').textContent = 'O CPL do cenário está zerado. Ajuste em Configurar parâmetros para gerar leads.';
  }

  var STATUS = { above: 'Acima do equilíbrio', near: 'Próximo do equilíbrio', below: 'Abaixo do equilíbrio' };

  function kpi(label, value, sub, cls, tipText) {
    return '<div class="kpi ' + (cls || '') + '"><div class="k">' + label + (tipText ? tip(tipText) : '') + '</div><div class="v">' + value + '</div>' + (sub ? '<div class="s">' + sub + '</div>' : '') + '</div>';
  }

  function renderKpis() {
    var f = model.financial;
    var roiLabel = f.roiSimplified ? 'ROI simplificado' : 'ROI estimado';
    var roiSub = f.roi === null ? 'Sem custos para comparar' : (f.roiSimplified ? 'Sem custos variáveis informados' : 'Resultado ÷ custos fixos considerados');
    var be = f.breakEvenSales;
    $('kpis').innerHTML =
      kpi('Faturamento bruto projetado', money(f.adRevenue), qty(f.adSales) + ' ' + plural(f.adSales, 'venda', 'vendas') + ' × ' + money(f.ticket), 'pos') +
      kpi('ROAS', xr(f.roas), 'Faturamento ÷ investimento em anúncios', 'info', 'Retorno bruto sobre a mídia. ROAS não é lucro: não desconta custos.') +
      kpi(roiLabel, f.roi === null ? '—' : (f.roi > 0 ? '+' : '') + pct(f.roi, 0), roiSub, f.roi === null ? '' : (f.roi >= 0 ? 'pos' : 'neg'), 'ROI = (faturamento − custos variáveis − custos fixos) ÷ custos fixos. Custos fixos = anúncios + honorários incluídos + outros custos.') +
      kpi('Resultado financeiro estimado', money(f.result), 'Faturamento − custos considerados', f.result >= 0 ? 'pos' : 'neg') +
      kpi('Custo por venda', f.costPerSale === null ? 'Sem vendas' : money(f.costPerSale), 'Investimento ÷ vendas dos anúncios') +
      kpi('Ponto de equilíbrio', be === null ? '—' : qty(be) + ' ' + plural(be, 'venda', 'vendas'), be === null ? 'Informe um ticket médio' : 'Para cobrir os custos do mês', '', 'Vendas necessárias para que o faturamento, já descontados os custos variáveis, cubra os custos fixos selecionados.');

    var pillCls = f.status;
    $('status-pill').innerHTML = '<span class="pill ' + pillCls + '">' + STATUS[f.status] + (f.status === 'near' && f.result >= 0 ? ' (levemente acima)' : (f.status === 'near' && f.result < 0 ? ' (levemente abaixo)' : '')) + '</span>';

    var text;
    if (be === null) text = 'Informe um ticket médio maior que zero para calcular o ponto de equilíbrio.';
    else if (be === 0) text = 'Nenhum custo fixo considerado: qualquer venda já gera resultado positivo.';
    else if (f.adSales >= be) text = 'Equilíbrio atingido: ' + qty(f.adSales) + ' ' + plural(f.adSales, 'venda projetada', 'vendas projetadas') + ' para ' + qty(be) + ' ' + plural(be, 'necessária', 'necessárias') + '.';
    else text = qty(f.adSales) + ' de ' + qty(be) + ' vendas necessárias para atingir o equilíbrio.';
    $('breakeven').innerHTML = '<span class="hint" style="color:var(--fg)">' + text + '</span><span class="hint">' + pct(f.breakEvenProgress * 100, 0) + '</span>' +
      '<div class="be-track"><div class="be-fill ' + (f.status === 'below' ? 'neg' : f.status === 'near' ? 'near' : '') + '" style="width:' + (f.breakEvenProgress * 100) + '%"></div></div>';
  }

  function scenarioOptions(includeSelected, selectedVal) {
    var c = cfg(), opts = [];
    if (includeSelected) opts.push(['selected', 'Cenário selecionado (' + model.scenario.name + ')']);
    opts.push(['castelo', c.castelo.name + ' (Castelo Ads)']);
    c.scenarios.forEach(function (s) { opts.push([s.id, s.name]); });
    return opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === selectedVal ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('');
  }
  function renderSelects() {
    var b = scenarioOptions(true, sim.compareBaseId), i = scenarioOptions(false, model.compare.improvedScenario.id);
    if ($('sel-base')._sig !== b) { $('sel-base').innerHTML = b; $('sel-base')._sig = b; }
    if ($('sel-imp')._sig !== i) { $('sel-imp').innerHTML = i; $('sel-imp')._sig = i; }
    $('sel-base').value = E.findScenario(cfg(), sim.compareBaseId) || sim.compareBaseId === 'selected' ? sim.compareBaseId : 'selected';
    $('sel-imp').value = model.compare.improvedScenario.id;
  }

  function dRow(label, a, b, fmt, higherIsBetter) {
    var d = b - a, cls = '';
    var dTxt = '';
    if (isFinite(d) && Math.abs(d) > 1e-9) {
      var good = higherIsBetter ? d > 0 : d < 0;
      cls = good ? '' : ' neg';
      dTxt = '<span class="delta' + cls + '">(' + (d > 0 ? '+' : '') + fmt(d) + ')</span>';
    }
    return [label, fmt(a), fmt(b) + dTxt];
  }
  function renderCompare() {
    var c = model.compare, B = c.base, I = c.improved;
    var rows = [
      dRow('CPL', B.funnel.cpl, I.funnel.cpl, money, false),
      dRow('Leads', B.funnel.leads, I.funnel.leads, qty, true),
      dRow('Agendamentos', B.funnel.appointments, I.funnel.appointments, qty, true),
      dRow('Comparecimentos', B.funnel.shows, I.funnel.shows, qty, true),
      dRow('Vendas', B.funnel.sales, I.funnel.sales, qty, true),
      dRow('Faturamento', B.fin.adRevenue, I.fin.adRevenue, money, true)
    ];
    function panel(cls, title, ic, sc, side, roas) {
      return '<div class="panel ' + cls + '"><h3>' + icon(ic, 16) + title + '</h3><p class="ps">' + esc(sc.name) + ' · investimento de ' + money(model.investment) + '/mês</p><dl>' +
        rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[side] + '</dd>'; }).join('') +
        '<dt>ROAS</dt><dd>' + xr(roas) + '</dd></dl></div>';
    }
    $('cmp').innerHTML = panel('sem', 'Sem Castelo Ads', 'x', c.baseScenario, 1, B.fin.roas) + panel('com', 'Com Castelo Ads', 'check', c.improvedScenario, 2, I.fin.roas);
    $('cmp-kpis').innerHTML =
      kpi('Vendas adicionais', (c.extraSales > 0 ? '+' : '') + qty(c.extraSales), 'por mês', c.extraSales >= 0 ? 'pos' : 'neg') +
      kpi('Faturamento incremental', signedMoney(c.incrementalRevenue), 'por mês', c.incrementalRevenue >= 0 ? 'pos' : 'neg') +
      kpi('Redução no CPL', money(c.cplReduction), c.cplReductionPct === null ? '—' : pct(c.cplReductionPct, 1) + ' mais barato por lead', c.cplReduction >= 0 ? 'pos' : 'neg') +
      kpi('Variação do ROAS', c.roasDelta === null ? '—' : (c.roasDelta > 0 ? '+' : '') + nf(1, 1).format(c.roasDelta) + 'x', 'De ' + xr(B.fin.roas) + ' para ' + xr(I.fin.roas), c.roasDelta === null ? '' : (c.roasDelta >= 0 ? 'pos' : 'neg'));
  }

  function renderProjectionControls() {
    var p = sim.projection;
    setPressed('seg-months', 'data-months', p.months === 12 ? 12 : 6);
    setSwitch('sw-growth', p.growthEnabled);
    setSwitch('sw-ramp', p.rampEnabled);
    $('in-growth').disabled = !p.growthEnabled;
    $('in-ramp').disabled = !p.rampEnabled;
    $('in-eff-start').disabled = !p.rampEnabled;
    setPressed('seg-metric', 'data-metric', sim.chartMetric);
  }

  // ------------------------------------------------------------ gráfico SVG
  function niceMax(v) {
    if (!(v > 0)) return 1;
    var e = Math.pow(10, Math.floor(Math.log10(v))), f = v / e;
    var n = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return n * e;
  }
  function chartData() {
    var P = model.projection, rows = P.rows, labels = rows.map(function (r) { return 'Mês ' + r.month; });
    var m = sim.chartMetric;
    if (m === 'investment') return { type: 'bar', labels: labels, fmt: money, axis: moneyC, series: [{ name: 'Investimento em anúncios', color: 'var(--green-2)', values: rows.map(function (r) { return r.investment; }) }] };
    if (m === 'sales') return { type: 'bar', stacked: true, labels: labels, fmt: qty, axis: function (v) { return nf(0, 1).format(v); }, series: [
      { name: 'Vendas dos anúncios', color: 'var(--green)', values: rows.map(function (r) { return r.adSales; }) },
      { name: 'Vendas das alavancas', color: 'var(--blue)', values: rows.map(function (r) { return r.leverSales; }) }] };
    if (m === 'roas') return { type: 'line', labels: labels, fmt: xr, axis: function (v) { return nf(0, 1).format(v) + 'x'; }, series: [{ name: 'ROAS publicitário', color: 'var(--green)', values: rows.map(function (r) { return r.roas; }) }] };
    if (m === 'compare') {
      var cp = model.compareProjection;
      return { type: 'line', labels: labels, fmt: money, axis: moneyC, series: [
        { name: 'Sem Castelo Ads · ' + model.compare.baseScenario.name, color: 'var(--red)', values: cp.base.rows.map(function (r) { return r.adRevenue; }) },
        { name: 'Com Castelo Ads · ' + model.compare.improvedScenario.name, color: 'var(--green)', values: cp.improved.rows.map(function (r) { return r.adRevenue; }) }] };
    }
    return { type: 'bar', stacked: true, labels: labels, fmt: money, axis: moneyC, series: [
      { name: 'Faturamento dos anúncios', color: 'var(--green)', values: rows.map(function (r) { return r.adRevenue; }) },
      { name: 'Faturamento das alavancas', color: 'var(--blue)', values: rows.map(function (r) { return r.leverRevenue; }) }] };
  }
  var lastChart = null;
  function renderChart() {
    var d = chartData(); lastChart = d;
    var W = 820, H = 300, L = 78, R = 14, T = 14, B = 30, cw = W - L - R, ch = H - T - B, n = d.labels.length;
    var max = 0;
    for (var i = 0; i < n; i++) {
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
    d.labels.forEach(function (lb, i) {
      out.push('<text x="' + (L + gw * i + gw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" style="fill:var(--dim);font-size:11px">' + (n > 6 ? 'M' + (i + 1) : lb) + '</text>');
    });
    if (d.type === 'bar') {
      var bw = Math.min(46, gw * 0.58);
      for (i = 0; i < n; i++) {
        var acc = 0, x = L + gw * i + (gw - bw) / 2;
        d.series.forEach(function (s, si) {
          var v = s.values[i] || 0; if (v <= 0) return;
          var y0 = y(acc), y1 = y(acc + v), top = si === d.series.length - 1 || !d.series.slice(si + 1).some(function (z) { return z.values[i] > 0; });
          out.push('<rect x="' + x + '" y="' + y1 + '" width="' + bw + '" height="' + Math.max(0, y0 - y1) + '" rx="' + (top ? 4 : 0) + '" style="fill:' + s.color + '"/>');
          acc += v;
        });
      }
    } else {
      d.series.forEach(function (s) {
        var pts = [];
        s.values.forEach(function (v, i) { if (v !== null && isFinite(v)) pts.push([L + gw * i + gw / 2, y(v)]); });
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
      var hit = e.target.closest && e.target.closest('.hit'); var tipEl = $('ctip'); if (!tipEl) return;
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
    var head = ['Mês', 'Investimento', ramp ? 'Eficiência' : null, 'Leads', 'Agend.', 'Compar.', 'Vendas anúncios', 'Vendas alavancas', 'Vendas totais', 'Fat. anúncios', 'Fat. alavancas', 'Fat. total', 'ROAS anúncios', 'Resultado consolidado'].filter(Boolean);
    var body = P.rows.map(function (r) {
      return '<tr>' + [r.month, money0(r.investment), ramp ? pct(r.efficiency * 100, 0) : null, qty(r.leads), qty(r.appointments), qty(r.shows), qty(r.adSales),
        '<span class="' + (r.leverSales ? '' : 'dim') + '">' + qty(r.leverSales) + '</span>', qty(r.totalSales), money0(r.adRevenue), money0(r.leverRevenue), money0(r.totalRevenue), xr(r.roas),
        '<span style="color:' + (r.totalResult >= 0 ? 'var(--green)' : 'var(--red)') + '">' + money0(r.totalResult) + '</span>']
        .filter(function (v) { return v !== null; }).map(function (v, k) { return '<td' + ((k === 6 + (ramp ? 1 : 0) || k === 9 + (ramp ? 1 : 0)) ? ' class="lv"' : '') + '>' + v + '</td>'; }).join('') + '</tr>';
    }).join('');
    var t = P.totals;
    var tot = '<tr class="total">' + ['Total', money0(t.investment), ramp ? '' : null, qty(t.leads), qty(t.appointments), qty(t.shows), qty(t.adSales), qty(t.leverSales), qty(t.totalSales),
      money0(t.adRevenue), money0(t.leverRevenue), money0(t.totalRevenue), xr(t.roas), money0(t.totalResult)].filter(function (v) { return v !== null; }).map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>';
    $('proj-table').innerHTML = '<thead><tr>' + head.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + body + tot + '</tbody>';
  }

  var LEVER_ICONS = { prospeccao: 'send', social: 'share', indicacoes: 'users' };
  function renderLevers() {
    var c = cfg(), P = model.projection, f = model.funnel, fi = model.financial, months = P.months;
    var html = '<div class="lever on"><div class="ic">' + icon('trend') + '</div><div style="min-width:0"><h4>Alavanca 01 · Tráfego Pago</h4><div class="rule">Base do funil principal</div>' +
      '<div class="desc">Vendas geradas pelos anúncios, conforme o funil acima.</div><div class="contrib">' +
      '<span class="chip">Mês de referência: <b>' + qty(f.sales) + ' ' + plural(f.sales, 'venda', 'vendas') + ' · ' + money0(fi.adRevenue) + '</b></span>' +
      '<span class="chip">Em ' + months + ' meses: <b>' + qty(P.totals.adSales) + ' vendas · ' + money0(P.totals.adRevenue) + '</b></span></div></div>' +
      '<div class="lever-right"><span class="badge">Sempre ativa</span></div></div>';
    c.levers.forEach(function (l, idx) {
      var on = !!sim.leversEnabled[l.id];
      var tot = P.totals.levers.filter(function (x) { return x.id === l.id; })[0] || { sales: 0, revenue: 0, cost: 0 };
      var mat = Math.round(l.maturationMonths);
      var ticketTxt = l.ticket > 0 ? ' · ticket ' + money0(l.ticket) : '';
      var costTxt = l.monthlyCost > 0 ? ' · custo ' + money0(l.monthlyCost) + '/mês' : '';
      var rule = '+' + qty(l.salesPerMonth) + ' ' + plural(l.salesPerMonth, 'venda', 'vendas') + '/mês ' + (mat > 0 ? 'após ' + mat + ' ' + plural(mat, 'mês', 'meses') + ' de maturação' : 'desde o primeiro mês') + ticketTxt + costTxt;
      var tk = l.ticket > 0 ? l.ticket : model.ticket;
      var contrib = on ? '<div class="contrib">' +
        '<span class="chip">Mês 1: <b>' + (mat > 0 ? 'sem vendas (maturação)' : '+' + qty(l.salesPerMonth)) + '</b></span>' +
        '<span class="chip">' + (mat > 0 ? 'A partir do mês ' + (mat + 1) : 'Por mês') + ': <b>+' + qty(l.salesPerMonth) + ' · ' + money0(l.salesPerMonth * tk) + '</b></span>' +
        '<span class="chip">Em ' + months + ' meses: <b>' + qty(tot.sales) + ' ' + plural(tot.sales, 'venda', 'vendas') + ' · ' + money0(tot.revenue) + '</b></span>' +
        (tot.cost > 0 ? '<span class="chip">Custo no período: <b>' + money0(tot.cost) + '</b></span>' : '') +
        (mat >= months ? '<span class="chip" style="color:var(--amber);border-color:var(--amber)">Maturação maior que o período da projeção</span>' : '') +
        '</div>' : '';
      html += '<div class="lever' + (on ? ' on' : '') + '"><div class="ic">' + icon(LEVER_ICONS[l.id] || 'trend') + '</div><div style="min-width:0"><h4>Alavanca 0' + (idx + 2) + ' · ' + esc(l.name) + '</h4>' +
        '<div class="rule">' + rule + '</div><div class="desc">' + esc(l.description) + '</div>' + contrib + '</div>' +
        '<div class="lever-right"><button class="close-x" type="button" data-lever-cfg="' + esc(l.id) + '" title="Editar alavanca" aria-label="Editar ' + esc(l.name) + '">' + icon('gear', 17) + '</button>' +
        '<button class="switch" type="button" role="switch" id="sw-lev-' + esc(l.id) + '" data-lever="' + esc(l.id) + '" aria-checked="' + on + '" aria-label="Ativar ' + esc(l.name) + '"><span class="track"></span></button></div></div>';
    });
    setHTML($('levers'), html);

    var L = model.levers;
    function block(title, F) {
      return '<div class="box"><h5>' + title + '</h5>' +
        '<div class="kv"><span>Vendas dos anúncios</span><b>' + qty(F.adSales) + '</b></div>' +
        '<div class="kv"><span>Vendas das alavancas</span><b style="color:var(--blue)">' + qty(F.leverSales) + '</b></div>' +
        '<div class="kv"><span>Total de vendas</span><b>' + qty(F.totalSales) + '</b></div>' +
        '<div class="kv tot"><span>Faturamento combinado</span><b>' + money(F.totalRevenue) + '</b></div>' +
        '<div class="kv"><span>Resultado consolidado</span><b style="color:' + (F.totalResult >= 0 ? 'var(--green)' : 'var(--red)') + '">' + money(F.totalResult) + '</b></div></div>';
    }
    var T = P.totals;
    var acc = '<div class="box"><h5>Acumulado em ' + months + ' meses</h5>' +
      '<div class="kv"><span>Vendas dos anúncios</span><b>' + qty(T.adSales) + '</b></div>' +
      '<div class="kv"><span>Vendas das alavancas</span><b style="color:var(--blue)">' + qty(T.leverSales) + '</b></div>' +
      '<div class="kv"><span>Total de vendas</span><b>' + qty(T.totalSales) + '</b></div>' +
      '<div class="kv tot"><span>Faturamento combinado</span><b>' + money(T.totalRevenue) + '</b></div>' +
      '<div class="kv"><span>ROAS publicitário</span><b>' + xr(T.roas) + '</b></div>' +
      '<div class="kv"><span>Retorno consolidado ' + tip('Faturamento combinado ÷ custos fixos totais (anúncios, honorários incluídos, outros custos e custos das alavancas).') + '</span><b>' + xr(T.consolidatedReturn) + '</b></div>' +
      '<div class="kv"><span>Resultado consolidado</span><b style="color:' + (T.totalResult >= 0 ? 'var(--green)' : 'var(--red)') + '">' + money(T.totalResult) + '</b></div></div>';
    $('cons').innerHTML = block('Resultado mensal atual (mês 1)', L.now) + block('Mensal após maturação' + (L.maturationMonth > 1 ? ' (mês ' + L.maturationMonth + ')' : ''), L.mature) + acc;
  }

  // ------------------------------------------------------------ configurações
  var TABS = [['financeiro', 'Parâmetros financeiros'], ['comerciais', 'Taxas comerciais'], ['castelo', 'Castelo Ads'], ['alavancas', 'Alavancas'], ['projecao', 'Projeção']];
  var currentTab = 'financeiro';

  function getPath(o, path) { return path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, path, v) {
    var ks = path.split('.'), last = ks.pop();
    var t = ks.reduce(function (a, k) { return a[k]; }, o); t[last] = v;
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

  function scenarioFields(prefix) {
    return F(prefix + '.cpl', 'CPL (custo por lead)', 'money', { positive: true }) +
      F(prefix + '.scheduleRate', 'Lead → agendamento', 'pct') +
      F(prefix + '.showRate', 'Comparecimento', 'pct') +
      F(prefix + '.closeRate', 'Fechamento sobre comparecimentos', 'pct');
  }

  function tabHTML(tab) {
    var d = draft;
    if (tab === 'financeiro') {
      return '<div class="sec-t">Valores iniciais de cada nova simulação</div><div class="fgrid">' +
        F('defaults.investment', 'Investimento padrão', 'money') + F('defaults.ticket', 'Ticket médio padrão', 'money') +
        F('defaults.cpl', 'CPL padrão para novos cenários', 'money', { positive: true }) +
        F('defaults.scenarioId', 'Cenário inicial', 'select', { options: d.scenarios.map(function (s) { return [s.id, s.name]; }) }) + '</div>' +
        '<div class="sec-t">Custos considerados no ROI e no ponto de equilíbrio</div><div class="fgrid">' +
        F('financial.variableCostPct', 'Custos variáveis (% do faturamento)', 'pct', { tip: 'Material, taxas de cartão, comissões e impostos sobre cada venda.' }) +
        F('financial.agencyFee', 'Honorários mensais da agência', 'money') +
        F('financial.otherCosts', 'Outros custos fixos mensais', 'money', { tip: 'Ferramentas, atendimento ou outras despesas ligadas à operação comercial.' }) +
        F('financial.includeAgencyFee', 'Incluir honorários por padrão', 'select', { options: [['true', 'Sim'], ['false', 'Não']] }) +
        F('financial.nearBandPct', 'Faixa "próximo do equilíbrio"', 'pct', { tip: 'Resultado dentro dessa porcentagem dos custos fixos, para mais ou para menos, é classificado como próximo do equilíbrio.' }) + '</div>' +
        '<p class="hint" style="margin-top:14px">Sem custos variáveis informados, o ROI aparece como "ROI simplificado", pois trata todo o faturamento como margem.</p>';
    }
    if (tab === 'comerciais') {
      return '<p class="hint" style="margin-bottom:14px">Premissas ilustrativas, não médias comprovadas de mercado. Ajuste de acordo com a realidade de cada estúdio. Taxas de agendamento, comparecimento e fechamento ficam dentro de cada cenário.</p>' +
        d.scenarios.map(function (s, i) {
          var p = 'scenarios.' + i;
          return '<div class="sc-card"><div class="row-between"><h3>' + esc(s.name) + '</h3>' +
            (s.builtin ? '<button class="btn small ghost" type="button" data-reset-scen="' + i + '">Restaurar valores originais</button>' : '<button class="btn small danger" type="button" data-del-scen="' + i + '">' + icon('trash', 14) + 'Excluir</button>') +
            '</div><div class="fgrid">' + F(p + '.name', 'Nome', 'text') + scenarioFields(p) + F(p + '.description', 'Descrição', 'textarea', { wide: true }) + '</div></div>';
        }).join('') +
        '<button class="btn" type="button" id="btn-add-scen" style="margin-top:14px">' + icon('plus', 16) + 'Adicionar cenário personalizado</button>';
    }
    if (tab === 'castelo') {
      var opts = [['selected', 'Cenário selecionado no atendimento']].concat(d.scenarios.map(function (s) { return [s.id, s.name]; }));
      var imp = [['castelo', d.castelo.name + ' (Castelo Ads)']].concat(d.scenarios.map(function (s) { return [s.id, s.name]; }));
      return '<p class="hint" style="margin-bottom:14px">Premissas do cenário "Com Castelo Ads". O comparativo usa exatamente estes valores nas mesmas fórmulas do funil, sem multiplicadores fixos.</p>' +
        '<div class="fgrid">' + F('castelo.name', 'Nome do cenário', 'text') + scenarioFields('castelo') + F('castelo.description', 'Descrição', 'textarea', { wide: true }) + '</div>' +
        '<div class="sec-t">Comparativo padrão</div><div class="fgrid">' +
        F('castelo.defaultBaseId', 'Cenário base padrão', 'select', { options: opts }) +
        F('castelo.defaultImprovedId', 'Cenário de desempenho padrão', 'select', { options: imp }) + '</div>' +
        '<p class="hint" style="margin-top:10px">Os padrões do comparativo valem para novas simulações. No atendimento atual, use os seletores do card Comparativo.</p>';
    }
    if (tab === 'alavancas') {
      return '<p class="hint" style="margin-bottom:14px">Cada alavanca soma vendas próprias depois da maturação. Elas nunca entram no ROAS dos anúncios. Ticket zerado usa o ticket médio do prospect.</p>' +
        d.levers.map(function (l, i) {
          var p = 'levers.' + i;
          return '<div class="sc-card"><div class="row-between"><h3>Alavanca 0' + (i + 2) + ' · ' + esc(l.name) + '</h3></div><div class="fgrid">' +
            F(p + '.name', 'Nome', 'text') + F(p + '.salesPerMonth', 'Vendas adicionais por mês', 'num') +
            F(p + '.maturationMonths', 'Maturação (meses)', 'int', { max: 24 }) + F(p + '.ticket', 'Ticket próprio (opcional)', 'money') +
            F(p + '.monthlyCost', 'Custo operacional mensal (opcional)', 'money') +
            F(p + '.description', 'Descrição da estratégia', 'textarea', { wide: true }) + '</div></div>';
        }).join('');
    }
    // projeção
    return '<p class="hint" style="margin-bottom:14px">Valores usados em cada nova simulação. Os controles do card Projeção temporal ajustam apenas o atendimento atual.</p><div class="fgrid">' +
      F('projection.months', 'Período padrão', 'select', { options: [['6', '6 meses'], ['12', '12 meses']] }) +
      F('projection.growthEnabled', 'Crescimento do investimento', 'select', { options: [['false', 'Desativado'], ['true', 'Ativado']] }) +
      F('projection.growthPct', 'Crescimento mensal do investimento', 'pct') +
      F('projection.rampEnabled', 'Tempo de rampagem', 'select', { options: [['false', 'Desativado'], ['true', 'Ativado']] }) +
      F('projection.rampMonths', 'Período de maturação (meses)', 'int', { min: 1, max: 12 }) +
      F('projection.startEfficiency', 'Eficiência inicial', 'pct', { max: 200 }) +
      F('projection.finalEfficiency', 'Eficiência final', 'pct', { max: 200, tip: 'Também usada no funil do mês de referência. 100% = taxas do cenário sem ajuste.' }) + '</div>' +
      '<div class="sec-t">Exibição de quantidades</div><div class="fgrid">' +
      F('display.policy', 'Regra de exibição', 'select', { options: [['integer', 'Inteiros (arredonda para baixo em cada etapa)'], ['expected', 'Valores esperados (médias com 1 casa decimal)']], wide: true }) + '</div>' +
      '<p class="hint" style="margin-top:10px">Em ambos os modos o faturamento é sempre vendas × ticket, e os totais somam os valores mensais.</p>';
  }

  function openSettings(tab) {
    draft = clone(config);
    currentTab = tab || 'financeiro';
    var root = $('modal-root');
    root.innerHTML = '<div class="overlay" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-title">' +
      '<div class="modal-h"><div><h2 id="m-title">Configurações</h2><p>Salvas neste navegador. Não sincronizam entre dispositivos; use Exportar e Importar para levar a outro computador.</p></div>' +
      '<button class="close-x" type="button" id="m-close" aria-label="Fechar">' + icon('x') + '</button></div>' +
      '<div class="tabs" role="tablist">' + TABS.map(function (t) { return '<button type="button" role="tab" data-tab="' + t[0] + '" id="tab-' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="modal-b" id="m-body"></div>' +
      '<div class="modal-f"><div class="grp"><button class="btn small ghost" type="button" id="m-reset">Restaurar padrões</button>' +
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
      b._armed = false; b.textContent = 'Restaurar padrões'; b.classList.remove('danger');
      draft = E.defaultConfig(); renderTab(); recompute();
      toast('Padrões originais carregados. Clique em Salvar para manter.');
    });
    root.querySelector('.tabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]'); if (!b) return; currentTab = b.getAttribute('data-tab'); renderTab();
    });
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
        draft.scenarios.push({ id: 'custom-' + Date.now().toString(36), name: 'Personalizado ' + (draft.scenarios.filter(function (s) { return !s.builtin; }).length + 1), builtin: false,
          cpl: draft.defaults.cpl, scheduleRate: 0.15, showRate: 0.75, closeRate: 0.65, description: 'Cenário personalizado.' });
        renderTab(); recompute();
        var cards = body.querySelectorAll('.sc-card'); if (cards.length) cards[cards.length - 1].scrollIntoView({ block: 'nearest' });
      } else if ((t = e.target.closest('[data-del-scen]'))) {
        var i = Number(t.getAttribute('data-del-scen')), id = draft.scenarios[i].id;
        draft.scenarios.splice(i, 1);
        if (draft.defaults.scenarioId === id) draft.defaults.scenarioId = draft.scenarios[0].id;
        if (draft.castelo.defaultBaseId === id) draft.castelo.defaultBaseId = 'selected';
        if (draft.castelo.defaultImprovedId === id) draft.castelo.defaultImprovedId = 'castelo';
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
      v = el.value;
      if (v === 'true' || v === 'false') v = v === 'true';
      else if (path === 'projection.months') v = Number(v);
    } else {
      var r = validate(kind, el.value, { max: el.dataset.max !== undefined ? Number(el.dataset.max) : undefined, min: el.dataset.min !== undefined ? Number(el.dataset.min) : undefined, positive: !!el.dataset.positive, positiveMsg: 'O CPL precisa ser maior que zero.' });
      el.classList.toggle('bad', !!r.error); if (err) err.textContent = r.error || '';
      if (r.error) return;
      v = r.value;
    }
    setPath(draft, path, v);
    if (/^scenarios\.\d+\.name$/.test(path) || path === 'castelo.name' || /^levers\.\d+\.name$/.test(path)) {
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
    var ok = store(K_CFG, config);
    if (!E.findScenario(config, sim.scenarioId)) sim.scenarioId = config.scenarios[0].id;
    $('modal-root').innerHTML = '';
    recompute();
    toast(ok ? 'Configurações salvas neste navegador.' : 'Configurações aplicadas, mas o navegador bloqueou o salvamento local.');
  }

  function exportConfig() {
    var data = JSON.stringify({ app: 'castelo-ads-calculadora-roi', version: 1, exportedAt: new Date().toISOString(), config: E.normalizeConfig(draft || config) }, null, 2);
    saveFile('castelo-ads-configuracoes.json', data, 'application/json');
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
    var name = sim.name.trim();
    var lines = [];
    lines.push('*Projeção Castelo Ads' + (name ? ' · ' + name : '') + '*');
    lines.push('Investimento mensal em anúncios: ' + money(m.investment));
    lines.push('Ticket médio: ' + money(m.ticket));
    lines.push('Cenário: ' + m.scenario.name);
    if (m.mode === 'reverse' && m.reverse && m.reverse.feasible) {
      lines.push('Meta: ' + (m.reverse.type === 'revenue' ? money(m.reverse.target) + ' de faturamento' : qty(m.reverse.target) + ' vendas') + ' (diferença de ' + signedMoney(m.reverse.difference) + ' no investimento atual)');
    }
    lines.push('');
    lines.push('*Funil mensal*');
    lines.push('Leads: ' + qty(f.leads) + ' · Agendamentos: ' + qty(f.appointments) + ' · Comparecimentos: ' + qty(f.shows) + ' · Vendas: ' + qty(f.sales));
    lines.push('Faturamento: ' + money(fi.adRevenue) + ' · ROAS: ' + xr(fi.roas));
    lines.push((fi.roiSimplified ? 'ROI simplificado: ' : 'ROI estimado: ') + (fi.roi === null ? '—' : pct(fi.roi, 0)) + ' · ' + STATUS[fi.status]);
    lines.push('');
    lines.push('*Com Castelo Ads (' + c.improvedScenario.name + ')*');
    lines.push(qty(c.improved.funnel.sales) + ' vendas/mês · ' + money(c.improved.fin.adRevenue) + ' · ROAS ' + xr(c.improved.fin.roas));
    lines.push('Diferença: ' + (c.extraSales > 0 ? '+' : '') + qty(c.extraSales) + ' vendas e ' + signedMoney(c.incrementalRevenue) + ' por mês');
    lines.push('');
    lines.push('*Projeção de ' + P.months + ' meses*');
    lines.push('Investimento: ' + money(T.investment) + ' · Faturamento total: ' + money(T.totalRevenue));
    lines.push('Vendas: ' + qty(T.adSales) + ' dos anúncios' + (T.leverSales ? ' + ' + qty(T.leverSales) + ' das alavancas' : ''));
    var act = T.levers.filter(function (l) { return l.enabled; });
    if (act.length) lines.push('Alavancas ativas: ' + act.map(function (l) { return l.name; }).join(', '));
    lines.push('');
    lines.push('_Projeção ilustrativa baseada em premissas configuráveis. Não é garantia de resultado._');
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
    try {
      navigator.clipboard.writeText(text).then(function () { toast('Resumo copiado. Cole no WhatsApp.'); }, fallback);
    } catch (e) { fallback(); }
  }

  // ------------------------------------------------------------ PDF
  function pdfSafe(s) { return String(s).replace(/[−–—]/g, '-').replace(/[  ]/g, ' ').replace(/[^\x00-\xff]/g, ''); }

  function generatePdf() {
    if (!window.jspdf || !window.jspdf.jsPDF) { toast('A biblioteca de PDF não carregou. Verifique a conexão e recarregue a página.'); return; }
    var btn = $('btn-pdf'); btn.disabled = true;
    try {
      var doc = buildPdf(model, sim);
      var slug = (sim.name || 'prospect').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'prospect';
      var blob = doc.output('blob');
      saveFile('proposta-castelo-ads-' + slug + '.pdf', blob, 'application/pdf').then(function () { btn.disabled = false; });
    } catch (e) {
      btn.disabled = false; toast('Não foi possível gerar o PDF.'); if (window.console) console.error(e);
    }
  }

  function buildPdf(m, s) {
    var J = window.jspdf.jsPDF;
    var doc = new J({ unit: 'mm', format: 'a4' });
    var INK = [10, 20, 16], GREEN = [0, 200, 150], GDARK = [0, 135, 100], GRAY = [105, 122, 114], LINE = [222, 230, 226], TINT = [232, 248, 242], BLUE = [40, 120, 210], RED = [200, 70, 70];
    var name = (s.name || '').trim();
    var dateTxt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date());
    var f = m.funnel, fi = m.financial, c = m.compare, P = m.projection, T = P.totals;

    function T_(x, y, str, o) { doc.text(pdfSafe(str), x, y, o || {}); }
    function font(style, size, color) { doc.setFont('helvetica', style); doc.setFontSize(size); doc.setTextColor.apply(doc, color || INK); }
    function header(title, sub) {
      doc.setFillColor(8, 19, 15); doc.rect(0, 0, 210, 32, 'F');
      doc.setFillColor.apply(doc, GREEN); doc.rect(0, 32, 210, 1.2, 'F');
      font('bold', 9, GREEN); T_(15, 12, 'CASTELO ADS');
      font('bold', 17, [255, 255, 255]); T_(15, 23, title);
      if (sub) { font('normal', 9, [148, 169, 157]); T_(195, 23, sub, { align: 'right' }); }
    }
    function section(y, title) { font('bold', 11, INK); T_(15, y, title); doc.setDrawColor.apply(doc, GREEN); doc.setLineWidth(0.6); doc.line(15, y + 2, 30, y + 2); return y + 8; }
    function box(x, y, w, h, label, value, sub, color) {
      doc.setFillColor.apply(doc, TINT); doc.setDrawColor.apply(doc, LINE); doc.setLineWidth(0.2); doc.roundedRect(x, y, w, h, 2, 2, 'FD');
      font('normal', 7.5, GRAY); T_(x + 4, y + 6, label);
      font('bold', 13, color || INK); T_(x + 4, y + 14, value);
      if (sub) { font('normal', 7, GRAY); T_(x + 4, y + h - 3.5, doc.splitTextToSize(pdfSafe(sub), w - 8)[0]); }
    }
    function table(x, y, cols, rows, opt) {
      opt = opt || {}; var rh = opt.rh || 7, totalW = cols.reduce(function (a, cc) { return a + cc.w; }, 0);
      doc.setFillColor(8, 19, 15); doc.rect(x, y, totalW, rh, 'F');
      font('bold', 7.5, [255, 255, 255]);
      var cx = x; cols.forEach(function (cc) { T_(cc.align === 'left' ? cx + 2.5 : cx + cc.w - 2.5, y + rh - 2.3, cc.h, { align: cc.align === 'left' ? 'left' : 'right' }); cx += cc.w; });
      y += rh;
      rows.forEach(function (r, ri) {
        var last = opt.boldLast && ri === rows.length - 1;
        if (last) { doc.setFillColor.apply(doc, TINT); doc.rect(x, y, totalW, rh, 'F'); }
        else if (ri % 2) { doc.setFillColor(247, 250, 248); doc.rect(x, y, totalW, rh, 'F'); }
        font(last ? 'bold' : 'normal', 8, INK);
        cx = x; cols.forEach(function (cc, ci) {
          var val = r[ci] === undefined ? '' : String(r[ci]);
          T_(cc.align === 'left' ? cx + 2.5 : cx + cc.w - 2.5, y + rh - 2.3, val, { align: cc.align === 'left' ? 'left' : 'right' }); cx += cc.w;
        });
        doc.setDrawColor.apply(doc, LINE); doc.setLineWidth(0.15); doc.line(x, y + rh, x + totalW, y + rh);
        y += rh;
      });
      return y;
    }

    // ---- Página 1: apresentação
    doc.setFillColor(8, 19, 15); doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor.apply(doc, GREEN); doc.roundedRect(15, 22, 12, 12, 2.5, 2.5, 'F');
    doc.setDrawColor(4, 38, 28); doc.setLineWidth(0.8);
    doc.lines([[0, -5], [2, 0], [0, -2.2], [1.6, 0], [0, 2.2], [1.6, 0], [0, -2.2], [1.6, 0], [0, 2.2], [2, 0], [0, 5]], 15.8, 31.3, [1, 1], 'S');
    font('bold', 11, GREEN); T_(31, 30, 'CASTELO ADS');
    font('normal', 10, [148, 169, 157]); T_(15, 92, 'PROPOSTA COMERCIAL');
    font('bold', 30, [255, 255, 255]);
    doc.text(doc.splitTextToSize('Projeção de Investimento e Resultados', 170), 15, 106, { lineHeightFactor: 1.15 });
    var y = 140;
    if (name) { font('normal', 10, [148, 169, 157]); T_(15, y, 'Preparada para'); font('bold', 20, GREEN); T_(15, y + 10, name.slice(0, 60)); y += 26; }
    var cover = [['Investimento mensal em anúncios', money(m.investment)], ['Ticket médio', money(m.ticket)], ['Cenário comercial atual', m.scenario.name], ['Período da projeção', P.months + ' meses']];
    if (m.mode === 'reverse' && m.reverse && m.reverse.feasible) cover[0][0] = 'Investimento necessário para a meta';
    cover.forEach(function (it, i) {
      var bx = 15 + (i % 2) * 92, by = y + Math.floor(i / 2) * 26;
      doc.setDrawColor(38, 58, 48); doc.setFillColor(16, 29, 23); doc.setLineWidth(0.3); doc.roundedRect(bx, by, 88, 22, 2.5, 2.5, 'FD');
      font('normal', 8, [148, 169, 157]); T_(bx + 5, by + 8, it[0]);
      font('bold', 14, [255, 255, 255]); T_(bx + 5, by + 17, it[1]);
    });
    font('normal', 9, [148, 169, 157]); T_(15, 262, dateTxt);

    // ---- Página 2: funil e resultados
    doc.addPage(); header('Funil e resultados', 'Cenário ' + m.scenario.name);
    y = section(46, m.mode === 'reverse' ? 'Funil com o investimento necessário para a meta' : 'Funil de conversão mensal');
    var stages = [
      ['Investimento mensal', money(f.investment), 'CPL de ' + money(f.cpl)],
      ['Leads gerados', qty(f.leads), 'Investimento / CPL'],
      ['Agendamentos', qty(f.appointments), 'Taxa de agendamento ' + rateTxt(f.scheduleRate)],
      ['Comparecimentos', qty(f.shows), 'Taxa de comparecimento ' + rateTxt(f.showRate)],
      ['Vendas', qty(f.sales), 'Taxa de fechamento ' + rateTxt(f.closeRate)]
    ];
    var shades = [[8, 19, 15], [10, 60, 45], [0, 110, 82], [0, 160, 120], [0, 200, 150]];
    stages.forEach(function (st, i) {
      var w = 180 - i * 22, x = 105 - w / 2;
      doc.setFillColor.apply(doc, shades[i]); doc.roundedRect(x, y, w, 12, 2, 2, 'F');
      font('bold', 10.5, i === 4 ? INK : [255, 255, 255]); T_(105, y + 6.2, st[0] + ': ' + st[1], { align: 'center' });
      font('normal', 7, i === 4 ? [4, 38, 28] : [190, 215, 205]); T_(105, y + 10, st[2], { align: 'center' });
      y += 14.5;
    });
    font('normal', 7.5, GRAY);
    T_(15, y + 2, m.policy === 'expected' ? 'Quantidades em valores esperados (médias). Faturamento = vendas esperadas x ticket médio.' : 'Quantidades inteiras, arredondadas para baixo em cada etapa. Faturamento = vendas x ticket médio.');
    y = section(y + 14, 'Indicadores financeiros do tráfego pago (mensal)');
    var bw = 58, bh = 24;
    var boxes = [
      ['Faturamento bruto projetado', money(fi.adRevenue), qty(fi.adSales) + ' vendas x ' + money(fi.ticket), GDARK],
      ['ROAS', xr(fi.roas), 'Faturamento / investimento em anúncios', BLUE],
      [fi.roiSimplified ? 'ROI simplificado' : 'ROI estimado', fi.roi === null ? '-' : (fi.roi > 0 ? '+' : '') + pct(fi.roi, 0), fi.roiSimplified ? 'Sem custos variáveis informados' : 'Sobre custos fixos considerados', fi.roi !== null && fi.roi < 0 ? RED : GDARK],
      ['Resultado financeiro estimado', money(fi.result), 'Faturamento - custos considerados', fi.result < 0 ? RED : GDARK],
      ['Custo por venda', fi.costPerSale === null ? 'Sem vendas' : money(fi.costPerSale), 'Investimento / vendas dos anúncios'],
      ['Ponto de equilíbrio', fi.breakEvenSales === null ? '-' : qty(fi.breakEvenSales) + ' vendas', STATUS[fi.status]]
    ];
    boxes.forEach(function (b, i) { box(15 + (i % 3) * (bw + 3), y + Math.floor(i / 3) * (bh + 3), bw, bh, b[0], b[1], b[2], b[3]); });
    y += 2 * (bh + 3) + 6;
    y = section(y, 'Custos considerados no mês');
    y = table(15, y, [{ h: 'Item', w: 120, align: 'left' }, { h: 'Valor', w: 60 }], [
      ['Investimento em anúncios', money(fi.investment)],
      ['Honorários da agência' + (m.fin.includeAgencyFee ? '' : ' (não incluídos)'), money(fi.agencyFee)],
      ['Outros custos fixos', money(fi.otherCosts)],
      ['Custos variáveis (' + pct(fi.variableCostPct * 100) + ' do faturamento)', money(fi.variableCosts)],
      ['Total considerado', money(fi.fixedCosts + fi.variableCosts)]
    ], { boldLast: true });
    if (m.mode === 'reverse' && m.reverse && m.reverse.feasible) {
      var r = m.reverse;
      font('normal', 8, GRAY);
      T_(15, y + 7, 'Meta: ' + (r.type === 'revenue' ? money(r.target) + ' de faturamento' : qty(r.target) + ' vendas') + '. Investimento necessário: ' + money(r.investment) + ' (atual: ' + money(r.currentInvestment) + '; diferença ' + signedMoney(r.difference) + ').');
    }

    // ---- Página 3: comparativo
    doc.addPage(); header('Comparativo de resultados', 'Mesmo investimento: ' + money(m.investment) + '/mês');
    y = section(46, 'Sem Castelo Ads x Com Castelo Ads');
    font('normal', 8.5, GRAY); T_(15, y, 'Base: ' + c.baseScenario.name + '   |   Com Castelo Ads: ' + c.improvedScenario.name); y += 5;
    function dd(a, b, fmt) { var d = b - a; return Math.abs(d) < 1e-9 ? '0' : (d > 0 ? '+' : '') + fmt(d); }
    y = table(15, y, [{ h: 'Métrica', w: 54, align: 'left' }, { h: 'Sem Castelo Ads', w: 42 }, { h: 'Com Castelo Ads', w: 42 }, { h: 'Diferença', w: 42 }], [
      ['CPL', money(c.base.funnel.cpl), money(c.improved.funnel.cpl), dd(c.base.funnel.cpl, c.improved.funnel.cpl, money)],
      ['Leads', qty(c.base.funnel.leads), qty(c.improved.funnel.leads), dd(c.base.funnel.leads, c.improved.funnel.leads, qty)],
      ['Agendamentos', qty(c.base.funnel.appointments), qty(c.improved.funnel.appointments), dd(c.base.funnel.appointments, c.improved.funnel.appointments, qty)],
      ['Comparecimentos', qty(c.base.funnel.shows), qty(c.improved.funnel.shows), dd(c.base.funnel.shows, c.improved.funnel.shows, qty)],
      ['Vendas', qty(c.base.funnel.sales), qty(c.improved.funnel.sales), dd(c.base.funnel.sales, c.improved.funnel.sales, qty)],
      ['Faturamento', money(c.base.fin.adRevenue), money(c.improved.fin.adRevenue), dd(c.base.fin.adRevenue, c.improved.fin.adRevenue, money)],
      ['ROAS', xr(c.base.fin.roas), xr(c.improved.fin.roas), c.roasDelta === null ? '-' : (c.roasDelta > 0 ? '+' : '') + nf(1, 1).format(c.roasDelta) + 'x']
    ], { rh: 8 });
    y += 8;
    var cb = [
      ['Vendas adicionais', (c.extraSales > 0 ? '+' : '') + qty(c.extraSales), 'por mês'],
      ['Faturamento incremental', signedMoney(c.incrementalRevenue), 'por mês'],
      ['Redução no CPL', money(c.cplReduction), c.cplReductionPct === null ? '' : pct(c.cplReductionPct, 1) + ' por lead'],
      ['Variação do ROAS', c.roasDelta === null ? '-' : (c.roasDelta > 0 ? '+' : '') + nf(1, 1).format(c.roasDelta) + 'x', 'De ' + xr(c.base.fin.roas) + ' para ' + xr(c.improved.fin.roas)]
    ];
    cb.forEach(function (b, i) { box(15 + (i % 2) * 91, y + Math.floor(i / 2) * 27, 89, 24, b[0], b[1], b[2], GDARK); });
    y += 60;
    y = section(y, 'Premissas de cada cenário');
    y = table(15, y, [{ h: 'Premissa', w: 80, align: 'left' }, { h: c.baseScenario.name, w: 50 }, { h: c.improvedScenario.name, w: 50 }], [
      ['CPL', money(c.baseScenario.params.cpl), money(c.improvedScenario.params.cpl)],
      ['Lead para agendamento', rateTxt(c.baseScenario.params.scheduleRate), rateTxt(c.improvedScenario.params.scheduleRate)],
      ['Comparecimento', rateTxt(c.baseScenario.params.showRate), rateTxt(c.improvedScenario.params.showRate)],
      ['Fechamento', rateTxt(c.baseScenario.params.closeRate), rateTxt(c.improvedScenario.params.closeRate)]
    ]);
    font('italic', 8, GRAY); T_(15, y + 8, 'Simulação baseada em premissas configuráveis. Resultados reais podem variar.');

    // ---- Página 4: projeção
    doc.addPage(); header('Projeção de ' + P.months + ' meses', 'Faturamento mês a mês');
    y = section(46, 'Faturamento projetado por mês');
    var cx0 = 32, cy0 = y + 2, cw = 163, chh = 58, n = P.rows.length;
    var maxV = niceMax(Math.max.apply(null, P.rows.map(function (r) { return r.totalRevenue; })) * 1.08);
    for (var t = 0; t <= 4; t++) {
      var gy = cy0 + chh - chh * t / 4;
      doc.setDrawColor.apply(doc, LINE); doc.setLineWidth(0.15); doc.line(cx0, gy, cx0 + cw, gy);
      font('normal', 6.5, GRAY); T_(cx0 - 2, gy + 1, moneyC(maxV * t / 4), { align: 'right' });
    }
    var gw = cw / n, bw2 = Math.min(12, gw * 0.6);
    P.rows.forEach(function (r, i) {
      var bx = cx0 + gw * i + (gw - bw2) / 2;
      var h1 = chh * r.adRevenue / maxV, h2 = chh * r.leverRevenue / maxV;
      doc.setFillColor.apply(doc, GREEN); if (h1 > 0) doc.rect(bx, cy0 + chh - h1, bw2, h1, 'F');
      doc.setFillColor.apply(doc, BLUE); if (h2 > 0) doc.rect(bx, cy0 + chh - h1 - h2, bw2, h2, 'F');
      font('normal', 6.5, GRAY); T_(cx0 + gw * i + gw / 2, cy0 + chh + 4.5, 'M' + r.month, { align: 'center' });
    });
    y = cy0 + chh + 10;
    doc.setFillColor.apply(doc, GREEN); doc.rect(cx0, y - 2.6, 3, 3, 'F'); font('normal', 7.5, GRAY); T_(cx0 + 5, y, 'Faturamento dos anúncios');
    doc.setFillColor.apply(doc, BLUE); doc.rect(cx0 + 50, y - 2.6, 3, 3, 'F'); T_(cx0 + 55, y, 'Faturamento das alavancas adicionais');
    y += 6;
    [['Investimento acumulado', money(T.investment)], ['Faturamento dos anúncios', money(T.adRevenue)], ['Faturamento total combinado', money(T.totalRevenue)], ['ROAS acumulado', xr(T.roas)]]
      .forEach(function (b, i) { box(15 + i * 45.5, y, 43.5, 20, b[0], b[1], '', i === 3 ? BLUE : GDARK); });
    y += 26;
    var trows = P.rows.map(function (r) { return [String(r.month), money0(r.investment), qty(r.leads), qty(r.adSales), qty(r.leverSales), qty(r.totalSales), money0(r.totalRevenue), xr(r.roas)]; });
    trows.push(['Total', money0(T.investment), qty(T.leads), qty(T.adSales), qty(T.leverSales), qty(T.totalSales), money0(T.totalRevenue), xr(T.roas)]);
    y = table(15, y, [{ h: 'Mês', w: 14, align: 'left' }, { h: 'Investimento', w: 28 }, { h: 'Leads', w: 18 }, { h: 'Vendas anúncios', w: 26 }, { h: 'Vendas alavancas', w: 27 }, { h: 'Vendas totais', w: 22 }, { h: 'Faturamento total', w: 28 }, { h: 'ROAS', w: 17 }], trows, { boldLast: true, rh: 6.4 });
    font('normal', 7, GRAY);
    var notes = [];
    notes.push(s.projection.growthEnabled ? 'Investimento cresce ' + pct(s.projection.growthPct * 100) + ' ao mês.' : 'Investimento constante.');
    notes.push(s.projection.rampEnabled ? 'Rampagem de ' + s.projection.rampMonths + ' meses: eficiência de ' + pct(s.projection.startEfficiency * 100, 0) + ' a ' + pct(s.projection.finalEfficiency * 100, 0) + ' sobre a taxa de agendamento.' : 'Sem rampagem.');
    notes.push('ROAS acumulado = faturamento dos anúncios acumulado / investimento acumulado.');
    doc.text(doc.splitTextToSize(pdfSafe(notes.join(' ')), 180), 15, y + 5);

    // ---- Página 5: estratégias
    doc.addPage(); header('Estratégias de crescimento', 'Alavancas e premissas');
    y = section(46, 'Contribuição de cada alavanca em ' + P.months + ' meses');
    var lrows = [['01 · Tráfego Pago', 'Ativa', 'Funil principal', qty(T.adSales), money0(T.adRevenue), money0(T.investment)]];
    m.config.levers.forEach(function (l, i) {
      var tt = T.levers[i];
      lrows.push(['0' + (i + 2) + ' · ' + l.name, tt.enabled ? 'Ativa' : 'Inativa',
        '+' + qty(l.salesPerMonth) + '/mês após ' + Math.round(l.maturationMonths) + ' m', tt.enabled ? qty(tt.sales) : '-', tt.enabled ? money0(tt.revenue) : '-', tt.enabled ? money0(tt.cost) : '-']);
    });
    y = table(15, y, [{ h: 'Alavanca', w: 46, align: 'left' }, { h: 'Status', w: 18 }, { h: 'Regra', w: 40 }, { h: 'Vendas', w: 20 }, { h: 'Faturamento', w: 30 }, { h: 'Custo', w: 26 }], lrows, { rh: 7.5 });
    y += 7;
    y = section(y, 'Resultado combinado');
    [['Total de vendas', qty(T.totalSales), qty(T.adSales) + ' anúncios + ' + qty(T.leverSales) + ' alavancas'], ['Faturamento combinado', money(T.totalRevenue), 'Anúncios + alavancas'],
      ['Resultado consolidado', money(T.totalResult), 'Após custos considerados'], ['Retorno consolidado', xr(T.consolidatedReturn), 'Faturamento / custos fixos']]
      .forEach(function (b, i) { box(15 + (i % 2) * 91, y + Math.floor(i / 2) * 27, 89, 24, b[0], b[1], b[2], i === 2 && T.totalResult < 0 ? RED : GDARK); });
    y += 60;
    font('normal', 7.5, GRAY);
    T_(15, y - 4, 'Mês 1: ' + qty(m.levers.now.totalSales) + ' vendas (' + money0(m.levers.now.totalRevenue) + ').  Após maturação: ' + qty(m.levers.mature.totalSales) + ' vendas por mês (' + money0(m.levers.mature.totalRevenue) + ').');
    y = section(y + 4, 'Premissas utilizadas na simulação');
    var sp = m.scenario.params;
    y = table(15, y, [{ h: 'Premissa', w: 110, align: 'left' }, { h: 'Valor', w: 70 }], [
      ['Cenário atual', m.scenario.name],
      ['CPL / agendamento / comparecimento / fechamento', money(sp.cpl) + ' / ' + rateTxt(sp.scheduleRate) + ' / ' + rateTxt(sp.showRate) + ' / ' + rateTxt(sp.closeRate)],
      ['Ticket médio', money(m.ticket)],
      ['Custos variáveis', pct(fi.variableCostPct * 100) + ' do faturamento'],
      ['Honorários da agência', m.fin.includeAgencyFee ? money(fi.agencyFee) + ' por mês' : 'Não incluídos'],
      ['Outros custos fixos', money(fi.otherCosts) + ' por mês'],
      ['Eficiência de referência', pct(f.efficiency * 100, 0)],
      ['Regra de quantidades', m.policy === 'expected' ? 'Valores esperados (médias)' : 'Inteiros, arredondados para baixo']
    ], { rh: 6.8 });

    // rodapé em todas as páginas
    var pages = doc.getNumberOfPages();
    for (var pg = 1; pg <= pages; pg++) {
      doc.setPage(pg);
      var dark = pg === 1;
      doc.setDrawColor.apply(doc, dark ? [38, 58, 48] : LINE); doc.setLineWidth(0.2); doc.line(15, 282, 195, 282);
      font('normal', 6.8, dark ? [148, 169, 157] : GRAY);
      T_(15, 287, 'Valores são projeções ilustrativas baseadas em premissas configuráveis e não constituem garantia de resultado.');
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
  window.__castelo = { get model() { return model; }, get sim() { return sim; }, get config() { return config; }, summaryText: summaryText, buildPdf: function () { return buildPdf(model, sim); } };
})();
