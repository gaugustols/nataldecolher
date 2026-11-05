# Sobremesas de Travessa para o Natal — aplicativo offline

Abra `index.html` diretamente no navegador. A navegação, fontes, imagens, duas amostras, favoritos, cardápio e checklists funcionam sem internet e sem build. Mantenha os arquivos `index.html`, `style.css`, `natal-elegante.css`, `data.js`, `app.js` e a pasta `assets/` juntos.

## O que já funciona

- Home e “Comece por aqui”.
- Catálogo das 14 receitas identificadas, com busca e filtros.
- Duas fichas transcritas das amostras públicas: Bombom de uva na travessa e Cheesecake de colher com frutas vermelhas.
- Ingredientes por preparo, checklist de etapas, progresso pessoal e montagem original ampliável.
- Favoritos, cardápio e última receita aberta, com armazenamento local quando permitido pelo navegador. Com armazenamento bloqueado, o app mantém o funcionamento durante a sessão.
- Três páginas de bônus, central de downloads e ajuda.
- Navegação SPA por hash, barra inferior móvel, menu lateral no desktop e retorno à lista com filtro e posição preservados.

O aplicativo não exige login nem valida compras nesta versão. Ele não libera PDFs pagos, pois os PDFs completos ainda não foram fornecidos. Não há backend, pagamento, sincronização entre dispositivos nem service worker. O funcionamento offline é obtido abrindo os arquivos locais; abrir a URL hospedada sem internet não é a mesma coisa que ter um app instalado ou com cache offline.

## Exatamente o que falta trocar antes da entrega aos compradores

1. **Downloads:** preencher `materials[].url` em `data.js` com cada arquivo real. Formatos e nomes físicos dos três bônus e do básico também precisam ser definidos. Os botões são desativados enquanto a URL estiver `null`; depois passam a abrir/baixar o arquivo. Para manter tudo offline, incluir os PDFs na pasta e usar caminhos relativos, como `arquivos/livro.pdf` — esse nome é apenas exemplo, não um arquivo incluído.
2. **Conteúdo:** importar as 16 receitas ainda não identificadas (4 clássicas, 10 econômicas, 2 especiais) e o conteúdo integral das outras 12 receitas que têm somente apresentação no catálogo. Conferir também as duas amostras com o livro final. Completar os conteúdos reais dos três bônus; `messages: null` marca o kit de WhatsApp ainda não recebido. O recurso “Copiar mensagem” aparece somente quando houver mensagens reais em `{title, text}`.
3. **Básico:** definir quais cinco receitas pertencem ao plano, seu prazo de acesso e a aplicação da garantia. Não inventar esses dados.
4. **Acesso e suporte:** definir a autenticação, confirmação de compra, permissões por plano e canal de atendimento do app. Uma página estática offline não oferece controle de acesso seguro a materiais pagos. A página Ajuda identifica essa pendência; nenhuma compra é simulada.

**Imagens e logo:** não há imagem quebrada nem dependência de imagens externas. As fotos, capas, diagramas, fontes e o favicon são materiais reais já disponíveis no projeto. O nome da marca é exibido em texto com um ícone SVG de cozinha, sem logotipo fictício. Caso queira um logotipo próprio, substituir o bloco `.brand` no `app.js` e `.mobile-brand` no `index.html`. A foto atual está em `assets/dalva-fernandes.jpg`.

## Organização dos arquivos

- `data.js`: todo o conteúdo editorial, categorias, receitas, bônus e downloads; comentários `TROCAR`/`COLAR LINK REAL` identificam pendências.
- `app.js`: navegação, pesquisa, seleção, checklists e estado local. Nenhum framework ou CDN.
- `style.css`: estrutura e estilos responsivos do aplicativo.
- `natal-elegante.css`: paleta verde pinheiro, marfim e dourado, fonte de sistema compartilhada com a landing page e ajustes de alinhamento no celular.
- `assets/`: arquivos copiados da landing recuperada.

Para hospedar como estático, enviar esta pasta inteira. No repositório atual, a rota de hospedagem é `/planopro/`, independente da landing em `/sobremesas-de-travessa/`.
