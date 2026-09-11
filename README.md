# Site institucional — Instrutor de Trânsito em Tatuí/SP

Landing page estática, responsiva e sem backend, criada para apresentar o serviço e direcionar contatos ao WhatsApp. O projeto usa somente HTML, CSS e JavaScript para reduzir manutenção, dependências e tempo de carregamento.

## Estrutura

```text
dist/
├── index.html
├── css/styles.css
├── js/config.js
├── js/app.js
├── assets/images/
├── politica-de-privacidade/index.html
├── termos-de-uso/index.html
├── favicon.svg
├── manifest.json
├── robots.txt
└── sitemap.xml
```

`dist/` é a pasta pronta para publicação. Todas as informações que mudam com frequência ficam em `dist/js/config.js`.

## Executar localmente

Não abra o HTML diretamente com duplo clique, pois os caminhos começam com `/`. Sirva a pasta `dist` com qualquer servidor estático. Exemplos:

```powershell
python -m http.server 8080 --directory dist
```

ou:

```powershell
npx serve dist
```

Depois acesse `http://localhost:8080`.

## Configuração principal

Abra `dist/js/config.js` e edite os valores entre aspas.

### Nome e informações do instrutor

- `businessName`: nome exibido na marca.
- `instructorName`: nome do instrutor. Se vazio, o site usa “Seu instrutor”.
- `serviceRegion`: região apresentada no contato.
- `openingHours`: horários exibidos. Se vazio, o item não aparece.

### Telefone e WhatsApp

- `phone`: telefone para ligação.
- `whatsapp`: número usado nos botões e no formulário.
- `whatsappMessage`: mensagem inicial dos botões.

Use somente números no WhatsApp, com DDI e DDD. Exemplo de formato: `5515999999999`. Enquanto o número estiver vazio, os botões levam ao formulário e informam que a configuração ainda precisa ser concluída.

### Instagram

Preencha `instagram` com o nome de usuário ou URL completa. Exemplos de formato: `nomedeusuario`, `@nomedeusuario` ou `https://instagram.com/nomedeusuario`. `instagramLabel` é opcional.

### Preço

Preencha `lessonPrice` com o texto que deseja exibir, já formatado. Se estiver vazio, aparece “Consulte valores e disponibilidade pelo WhatsApp”. `lessonDuration` é opcional.

O campo `pricingOptions` foi reservado para a futura inclusão de aula avulsa, pacote de 2 aulas ou aula adicional. Não há ofertas nem valores fictícios no site atual.

### Credenciamento

O projeto começa com:

```js
credentialStatus: false
```

Enquanto estiver `false`, nenhuma afirmação de credenciamento é exibida. Somente depois de confirmar a situação real, altere para `true` e preencha `credentialNumber`. Se o número ficar vazio, o texto de credenciamento aparece sem número.

### Trocar imagens

1. Otimize as fotos em WebP ou AVIF, preferencialmente com largura adequada ao uso.
2. Salve os arquivos em `dist/assets/images/`.
3. Preencha os caminhos em `config.js`:

```js
heroPhoto: "/assets/images/instrutor-celta.webp",
instructorPhoto: "/assets/images/instrutor.webp",
vehiclePhotos: [
  "/assets/images/celta-frente.webp",
  "/assets/images/celta-lateral.webp",
  "/assets/images/celta-interior.webp"
]
```

O JavaScript substitui automaticamente os placeholders. As imagens abaixo da primeira dobra usam carregamento adiado (`lazy loading`) e dimensões reservadas para evitar mudanças de layout.

## SEO e domínio

Antes de publicar:

1. Defina `siteUrl` em `config.js`, incluindo `https://`.
2. Troque `https://seu-dominio.com.br` em `dist/robots.txt` e `dist/sitemap.xml` pelo domínio real.
3. Confirme título e descrição no `<head>` de `dist/index.html`.
4. Depois de publicar, envie o sitemap ao Google Search Console.

O projeto inclui metadados Open Graph, Twitter Card, canonical condicional, `robots.txt`, `sitemap.xml`, manifest, favicon e dados estruturados `Service`. O Schema não declara endereço, avaliações, preço, credenciamento ou dados empresariais não fornecidos.

### Configurar domínio

No provedor de hospedagem, adicione o domínio personalizado e siga as instruções de DNS fornecidas por ele. Normalmente isso envolve um registro `CNAME` ou registros `A`. Depois que o domínio estiver ativo, atualize `siteUrl`, `robots.txt` e `sitemap.xml`.

## Publicar

Qualquer hospedagem estática pode servir a pasta `dist`:

- Cloudflare Pages
- Netlify
- Vercel
- GitHub Pages (pode exigir ajustes nos caminhos absolutos quando publicado em subdiretório)
- hospedagem tradicional com upload por FTP

Configure a pasta de publicação como `dist`. Não há comando de build.

## Analytics e pixels

Nenhum rastreador está ativo e nenhum ID falso foi adicionado.

### Google Analytics 4

1. Obtenha um ID real no formato `G-...`.
2. Adicione o snippet oficial antes de `</head>` em todas as páginas que serão medidas.
3. Preencha `analytics.googleAnalyticsId` em `config.js` para registrar a configuração do projeto.
4. Atualize a Política de Privacidade e implemente consentimento quando necessário.

### Google Tag Manager

Adicione os dois trechos oficiais do GTM nas posições indicadas pela documentação do Google e preencha `analytics.googleTagManagerId`. Não use GA4 direto e GTM para disparar o mesmo evento ao mesmo tempo sem revisar duplicidade.

### Meta Pixel

Adicione o snippet oficial do Meta Pixel antes de `</head>` e preencha `analytics.metaPixelId`. Atualize a política e o consentimento antes de ativar coleta de dados.

## Revisão legal

As páginas de privacidade e termos são uma estrutura inicial e neutra, não aconselhamento jurídico. Revise-as com os dados reais, provedor de hospedagem e ferramentas efetivamente usadas. Revise também as respostas legais do FAQ conforme as regras vigentes do Detran-SP, SENATRAN e CONTRAN antes de publicar.

## Checklist antes da publicação

- [ ] Nome do instrutor configurado
- [ ] WhatsApp real testado em celular e desktop
- [ ] Instagram real configurado ou mantido vazio
- [ ] Valores e horários confirmados
- [ ] Credenciamento ativado somente se confirmado
- [ ] Fotos reais otimizadas adicionadas
- [ ] Domínio atualizado em `config.js`, `robots.txt` e `sitemap.xml`
- [ ] Textos legais revisados
- [ ] Formulário testado
- [ ] Lighthouse executado no endereço de produção
