# Calculadora de ROI — Tatuador de Elite

Aplicação web estática (um único arquivo HTML), sem login, backend ou banco de dados.

## Publicar
- **`index.html` na raiz** já é a aplicação completa. Funciona direto no GitHub Pages (Settings → Pages → branch `main`, pasta `/`), Netlify, Vercel ou Cloudflare Pages, sem etapa de build.
- Cópia equivalente: `dist/calculadora-roi-tde.html`. Suba em qualquer hospedagem estática (Netlify, Vercel, Hostinger, Cloudflare Pages, seu próprio domínio) e aponte o domínio que quiser.
- Única dependência externa: jsPDF 2.5.1 (cdnjs) para o PDF e a fonte Inter (Google Fonts).
- Nenhum dado de prospect sai do navegador. Configurações ficam no `localStorage` de cada navegador; use Exportar/Importar JSON para levar a outro computador.

## Estrutura
- `src/engine.js` — motor de cálculo central (funções puras). Tela, resumo do WhatsApp e PDF consomem `computeAll()`.
- `src/app.js` — interface, configurações, gráfico SVG e PDF.
- `src/styles.css`, `src/template.html` — layout.
- `build.js` — junta tudo em `index.html` e `dist/` (`npm run build`). Edite os arquivos de `src/` e rode o build antes de publicar.

## Testes
- `npm test` — 22 testes do motor, incluindo todos os números oficiais do documento TDE.
- `npm run test:ui` — verificações no navegador (Playwright) cobrindo os testes obrigatórios.

## Regras de cálculo (modelo TDE)
- Verba de seguidores = investimento × % seguidores; verba de contatos = o restante (padrão 30/70).
- Seguidores = verba de seguidores ÷ custo por seguidor (histórico R$ 1.058,58 ÷ 784) + verba de contatos × 161 ÷ 2.301,89. Seguidores nunca viram vendas.
- Leads = verba de contatos ÷ CPL (R$ 7,50) + conversas da captação (verba de seguidores × 21 ÷ 1.058,58, quando ativado).
- Qualificados = leads × qualificação (30%). Vendas = qualificados × fechamento do cenário (Conservador 20%, Moderado 32%, Agressivo 48%).
- Cálculo com valores esperados; inteiros arredondados ao mais próximo só no final, com subtotais reconciliados. Faturamento = vendas inteiras × ticket.
- Sem Método TDE: operação independente (CPL R$ 12,50, qualificação 20%, fechamento 20%). Com Método TDE = cenário selecionado.
- Meta reversa: menor investimento (em centavos) cujas vendas esperadas atingem a meta, pelas mesmas fórmulas.
- ROI só com custos variáveis (margem de contribuição) informados; sem margem, o ponto de equilíbrio é simplificado.
- Alavancas somam vendas a partir do mês seguinte à maturação e nunca entram no ROAS.
- Totais da projeção = soma dos meses exibidos; ROAS acumulado = faturamento dos anúncios acumulado ÷ investimento acumulado.
