# Hero10 — prévia local

## Produto no aplicativo

A hero atual usa `ProductMockup` de `hero/landing.tsx`: captura real da receita de Bombom de uva dentro de uma moldura de celular em CSS, com a travessa recortada ao lado. `hero-webapp-screen.webp` é a captura do app publicado; `hero-bombom-recortado.webp` é o recorte com transparência da foto fornecida, feito com ImageGen. A composição preserva a paleta verde pinheiro, marfim e dourado e a fonte de sistema configurada em `hero-typography.css`.

`node scripts/update-landing-delivery.mjs` mantém as menções ao acesso pelo aplicativo iguais no HTML e no bundle recuperado, incluindo oferta e FAQ. O script atualiza o nome do bundle por hash e preserva os comportamentos de galeria, modal e compra. Execute antes de `pnpm build:hero` quando houver alterações na copy de entrega.

Na oferta do Plano completo, `hero/offer-mockup.mjs` fornece a mesma árvore de apresentação para o HTML e o bundle React: tablet maior com a captura real `offer-tablet-screen.webp` e três celulares com telas de apresentação dos bônus. `offer-devices.css` mantém os celulares lado a lado também no mobile. Preços, lista de benefícios e checkout são preservados; o modal do plano básico mantém a apresentação anterior. As telas dos bônus exibem títulos e descrições de apresentação, sem simular conteúdo ainda não fornecido.

Os preços e checkouts atuais ficam em `offers`, no script de atualização: completo R$ 19,90, básico R$ 6,99 e oferta do completo no modal R$ 9,99. O modal calcula automaticamente a diferença de R$ 3,00 para o básico. O script mantém os valores do HTML inicial iguais aos do React.

O restante deste documento registra a integração original; a apresentação com capa e páginas em leque da hero foi substituída pelo mockup do aplicativo.

Integração do componente fornecido, mantendo os parâmetros de `fanSlots`, `fanContainer`, `fanCard`, `Reveal` e `ImageFan`. A headline usa a pilha serifada padrão do Tailwind, peso 400 e tamanhos 30/36/48 px. O esquema de cores foi adaptado para a paleta real do site: `#fffaf3`, `#4b2b24`, `#a52f55`, `#75605b`.

O componente está em `components/ui/hero-10.tsx`; CTA e Button ficam na estrutura shadcn. O arquivo auxiliar de CTA não veio na referência: sua implementação usa o Button fornecido, com link e texto existentes. `hero/landing.tsx` fornece a copy e os arquivos reais do produto, incluindo `srcSet`, benefícios, selo e avatares. Foi usado o export nomeado `Balancer` para compatibilidade com a renderização no servidor do pacote instalado.

## Build

```powershell
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build:hero
.\.venv\Scripts\python.exe scripts/preview-hero.py
```

Prévia: http://127.0.0.1:8766/sobremesas-de-travessa/

O build cria somente os arquivos `assets/hero10-<hash>.js/css` e o HTML da rota existente. Não há reset global do Tailwind. Os estilos específicos da hero ficam em `#hero10-root`; as cores globais da página não são alteradas.

A integração usa um React root separado, com HTML pré-renderizado, antes do aplicativo recuperado. A hero anterior fica oculta por CSS, preservada dentro do React root original, para não invalidar a hidratação nem interferir nos estados dos modais, da galeria e do FAQ. O bundle React e a folha de estilos recuperados não são editados. O HTML original dentro de `#root` permanece intacto. Um fallback `noscript` mantém a nova hero legível sem JavaScript.

O build é idempotente e remove somente as saídas antigas geradas por ele. A Vercel continua servindo a pasta `public` sem build remoto: após uma alteração no componente, executar o build local antes de publicar.

Os endpoints, scripts, IDs de rastreamento e links de compra são preservados. A única CTA adicionada é “QUERO AS RECEITAS”, com a âncora existente `#oferta`; não foi criado um segundo botão com texto de demonstração.

As capturas e o relatório local ficam em `.cache/hero10-preview/`. A publicação desta versão foi autorizada pelo usuário após a revisão visual e os ajustes solicitados.

## Autora

`hero/author.ts` aplica a troca solicitada de Ana Maria para Dalva Fernandes no título, apresentação e texto alternativo, com a foto fornecida em `assets/dalva-fernandes.jpg`. A atualização ocorre após a hidratação do aplicativo recuperado e acompanha novas renderizações, sem editar seu bundle compilado. O HTML estático de recuperação permanece original; a identificação atualizada é aplicada pelo JavaScript. A foto foi copiada integralmente, sem alterações na imagem.

O mesmo adaptador atualiza as menções de garantia para 30 dias. O contato antigo foi removido do HTML e dos bundles pelo script de atualização da landing. Os benefícios da hero usam 14 px e preto; a headline usa “30 Receitas”. A CTA da hero está desativada, conforme a revisão final.
