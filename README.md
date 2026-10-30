# Calculadora de ROI — Castelo Ads

Aplicação web estática (um único arquivo HTML), sem login, backend ou banco de dados.

## Publicar
- **`index.html` na raiz** já é a aplicação completa. Funciona direto no GitHub Pages (Settings → Pages → branch `main`, pasta `/`), Netlify, Vercel ou Cloudflare Pages, sem etapa de build.
- Cópia equivalente: `dist/calculadora-roi-castelo-ads.html`. Suba em qualquer hospedagem estática (Netlify, Vercel, Hostinger, Cloudflare Pages, a pasta pública de gestao.casteloads.com) e aponte o domínio que quiser.
- Única dependência externa: jsPDF 2.5.1 (cdnjs) para o PDF e a fonte Inter (Google Fonts).
- Nenhum dado de prospect sai do navegador. Configurações ficam no `localStorage` de cada navegador; use Exportar/Importar JSON para levar a outro computador.

## Estrutura
- `src/engine.js` — motor de cálculo central (funções puras). Tela, resumo do WhatsApp e PDF consomem `computeAll()`.
- `src/app.js` — interface, configurações, gráfico SVG e PDF.
- `src/styles.css`, `src/template.html` — layout.
- `build.js` — junta tudo em `index.html` e `dist/` (`npm run build`). Edite os arquivos de `src/` e rode o build antes de publicar.

## Testes
- `npm test` — 17 testes do motor (funil, arredondamento, meta reversa, alavancas, projeção, equilíbrio, casos extremos).
- `npm run test:ui` — 43 verificações no navegador (Playwright) cobrindo os critérios de aceite.

## Regras de cálculo
- Leads = investimento ÷ CPL; agendamentos, comparecimentos e vendas aplicam as taxas do cenário.
- Exibição padrão em inteiros: cada etapa é arredondada para baixo, então nenhuma etapa supera a anterior e faturamento = vendas exibidas × ticket. Opcional: valores esperados (1 casa decimal).
- ROAS = faturamento dos anúncios ÷ investimento em anúncios. ROI = (faturamento − custos variáveis − custos fixos) ÷ custos fixos; aparece como "simplificado" sem custos variáveis.
- Alavancas somam vendas a partir do mês seguinte à maturação, nunca entram no ROAS, e seus custos contam desde o mês 1.
- Rampagem: a eficiência multiplica a taxa de agendamento e evolui linearmente da inicial à final.
- Totais da projeção são a soma dos meses; ROAS total = faturamento acumulado ÷ investimento acumulado.
