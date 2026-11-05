# Sobremesas de Travessa para o Natal — aplicativo offline

Abra `index.html` diretamente no navegador. As 30 receitas, imagens, favoritos, cardápio e checklists funcionam sem internet e sem build. Mantenha os arquivos `index.html`, `style.css`, `natal-elegante.css`, `data.js`, `app.js` e as pastas `assets/` e `arquivos/` juntos.

## O que já funciona

- Home e “Comece por aqui”.
- Catálogo completo: 12 clássicas, 10 econômicas e 8 especiais, com busca e filtros.
- As 30 fichas transcritas do PDF fornecido, com numeração e formulações preservadas.
- Ingredientes por preparo, checklist de etapas, progresso pessoal e montagem original ampliável.
- Favoritos, cardápio e última receita aberta, com armazenamento local quando permitido pelo navegador. Com armazenamento bloqueado, o app mantém o funcionamento durante a sessão.
- Livro original de 158 páginas disponível para download e links para abrir cada receita no PDF.
- Três páginas de bônus, central de downloads e ajuda; arquivos dos bônus ainda pendentes.
- Navegação SPA por hash, barra inferior móvel, menu lateral no desktop e retorno à lista com filtro e posição preservados.

O aplicativo não exige login nem valida compras nesta versão. Não há backend, pagamento, sincronização entre dispositivos nem service worker. O funcionamento offline é obtido abrindo os arquivos locais; abrir a URL hospedada sem internet não é a mesma coisa que ter um app instalado ou com cache offline.

## Exatamente o que falta trocar antes da entrega aos compradores

1. **Downloads complementares:** fornecer os arquivos dos três bônus e do básico. Os botões ficam desativados enquanto `materials[].url` estiver `null`. O PDF principal já está configurado em `arquivos/sobremesas-de-travessa-natal-2026.pdf`.
2. **Bônus:** completar os conteúdos reais dos três bônus. `messages: null` marca o kit de WhatsApp ainda não recebido. O recurso “Copiar mensagem” aparece somente quando houver mensagens reais em `{title, text}`.
3. **Básico:** definir quais cinco receitas pertencem ao plano, seu prazo de acesso e a aplicação da garantia. Não inventar esses dados.
4. **Acesso:** autenticação, confirmação de compra e permissões por plano exigem uma integração própria. Esta versão estática não simula contas nem pagamentos.

## Importação e conferência do livro

`scripts/import-planopro-book.py` extrai as fichas do PDF fornecido, preserva os IDs das receitas já existentes e gera as 16 fotos faltantes e 30 páginas de montagem. O PDF original é copiado sem alteração; seu SHA-256 fica em `PRODUCT.book.sha256`.

Com as dependências Python `pypdf`, `pdfplumber` e `Pillow`, e `pdftoppm` no PATH:

```text
python scripts/import-planopro-book.py --source "conteúdo/30 RECEITAS SOBREMESA DE TRAVESSA [Principal].pdf"
python scripts/import-planopro-book.py --source public/planopro/arquivos/sobremesas-de-travessa-natal-2026.pdf --verify
node scripts/validate-planopro-book.mjs
```

A validação exige 30 fichas completas, 252 itens de ingredientes, 120 etapas, 30 montagens e os arquivos locais. A conferência com o PDF compara ingredientes, quantidades, instruções e demais campos extraídos com os dados publicados.

**Imagens e logo:** não há imagem quebrada nem dependência de imagens externas. As fotos, capas, diagramas, fontes e o favicon são materiais reais já disponíveis no projeto. O nome da marca é exibido em texto com um ícone SVG de cozinha, sem logotipo fictício. Caso queira um logotipo próprio, substituir o bloco `.brand` no `app.js` e `.mobile-brand` no `index.html`. A foto atual está em `assets/dalva-fernandes.jpg`.

## Organização dos arquivos

- `data.js`: catálogo, fichas completas em `details`, bônus e downloads; gerado pelo importador.
- `app.js`: navegação, pesquisa, seleção, checklists e estado local. Nenhum framework ou CDN.
- `style.css`: estrutura e estilos responsivos do aplicativo.
- `natal-elegante.css`: paleta verde pinheiro, marfim e dourado, fonte de sistema compartilhada com a landing page e ajustes de alinhamento no celular.
- `assets/`: imagens existentes e fotos/montagens extraídas do livro fornecido.
- `arquivos/`: PDF original do livro para download.

Para hospedar como estático, enviar esta pasta inteira. No repositório atual, a rota de hospedagem é `/planopro/`, independente da landing em `/sobremesas-de-travessa/`.
