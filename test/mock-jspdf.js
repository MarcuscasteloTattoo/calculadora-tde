// jsPDF de teste: registra as operações de desenho para conferência (o CDN real não é acessível no ambiente de testes).
window.jspdf = { jsPDF: function () {
  var ops = [], page = 1, maxPage = 1;
  var st = { style: 'normal', size: 16, text: [0, 0, 0], fill: [0, 0, 0], draw: [0, 0, 0], lw: 0.2 };
  function c3(r, g, b) { return [r, g === undefined ? r : g, b === undefined ? r : b]; }
  function chk() { for (var i = 0; i < arguments.length; i++) if (typeof arguments[i] !== 'number' || !isFinite(arguments[i])) throw new Error('coordenada inválida: ' + arguments[i]); }
  var d = {
    __ops: ops,
    setFont: function (f, s) { st.style = s || 'normal'; },
    setFontSize: function (n) { st.size = n; },
    setTextColor: function (r, g, b) { st.text = c3(r, g, b); },
    setFillColor: function (r, g, b) { st.fill = c3(r, g, b); },
    setDrawColor: function (r, g, b) { st.draw = c3(r, g, b); },
    setLineWidth: function (w) { st.lw = w; },
    text: function (t, x, y, o) {
      chk(x, y); o = o || {};
      (Array.isArray(t) ? t : [t]).forEach(function (line, i) {
        if (typeof line !== 'string') throw new Error('texto não string');
        if (/[^\x00-\xff]/.test(line)) throw new Error('caractere fora do Latin-1: ' + line);
        ops.push({ op: 'text', page: page, t: line, x: x, y: y + i * st.size * 0.3528 * (o.lineHeightFactor || 1.15), align: o.align || 'left', size: st.size, style: st.style, color: st.text.slice() });
      });
    },
    rect: function (x, y, w, h, s) { chk(x, y, w, h); ops.push({ op: 'rect', page: page, x: x, y: y, w: w, h: h, s: s, fill: st.fill.slice(), draw: st.draw.slice(), lw: st.lw }); },
    roundedRect: function (x, y, w, h, rx, ry, s) { chk(x, y, w, h); ops.push({ op: 'rect', page: page, x: x, y: y, w: w, h: h, s: s, r: rx, fill: st.fill.slice(), draw: st.draw.slice(), lw: st.lw }); },
    line: function (x1, y1, x2, y2) { chk(x1, y1, x2, y2); ops.push({ op: 'line', page: page, x1: x1, y1: y1, x2: x2, y2: y2, draw: st.draw.slice(), lw: st.lw }); },
    lines: function (segs, x, y) { chk(x, y); ops.push({ op: 'lines', page: page, segs: segs, x: x, y: y, draw: st.draw.slice(), lw: st.lw }); },
    addPage: function () { page = ++maxPage; },
    setPage: function (p) { page = p; },
    getNumberOfPages: function () { return maxPage; },
    splitTextToSize: function (t, w) {
      var cw = st.size * 0.3528 * 0.5, words = String(t).split(' '), out = [], cur = '';
      words.forEach(function (wd) { var nx = cur ? cur + ' ' + wd : wd; if (nx.length * cw > w && cur) { out.push(cur); cur = wd; } else cur = nx; });
      if (cur) out.push(cur); return out;
    },
    output: function () { return new Blob([JSON.stringify(ops)], { type: 'application/pdf' }); }
  };
  return d;
} };
