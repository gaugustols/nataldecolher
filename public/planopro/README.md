# Sobremesas de Travessa para o Natal — aplicativo offline

Abra `index.html` diretamente no navegador. As 30 receitas, imagens, favoritos, cardápio e checklists funcionam sem internet e sem build. Mantenha os arquivos `index.html`, `style.css`, `natal-elegante.css`, `data.js`, `bonus-data.js`, `app.js` e a pasta `assets/` juntos.

## O que já funciona

- Home e “Comece por aqui”.
- Catálogo completo: 12 clássicas, 10 econômicas e 8 especiais, com busca e filtros.
- As 30 fichas transcritas do PDF fornecido, com numeração e formulações preservadas.
- Ingredientes por preparo, checklist de etapas, progresso pessoal e montagem original ampliável.
- Favoritos, cardápio e última receita aberta, com armazenamento local quando permitido pelo navegador. Com armazenamento bloqueado, o app mantém o funcionamento durante a sessão.
- Guia de produção com organização, ingredientes, resfriamento, escala, entrega e referências, para consulta dentro do app.
- Três bônus completos para leitura no aplicativo: Guia de Preços, Kit de WhatsApp e Guia de aproveitamento; 73 assuntos, tabelas, notas e referências preservados.
- Consulta integral das receitas no aplicativo, sem PDF publicado ou links de download. A antiga rota de downloads redireciona para o guia.
- Navegação SPA por hash, barra inferior móvel, menu lateral no desktop e retorno à lista com filtro e posição preservados.

O aplicativo não exige login nem valida compras nesta versão. Não há backend, pagamento, sincronização entre dispositivos nem service worker. O funcionamento offline é obtido abrindo os arquivos locais; abrir a URL hospedada sem internet não é a mesma coisa que ter um app instalado ou com cache offline.

## Exatamente o que falta trocar antes da entrega aos compradores

1. **Básico:** definir quais cinco receitas pertencem ao plano, seu prazo de acesso e a aplicação da garantia. Não inventar esses dados.
2. **Acesso:** autenticação, confirmação de compra e permissões por plano exigem uma integração própria. Esta versão estática não simula contas nem pagamentos.

## Importação e conferência do livro

`scripts/import-planopro-book.py` extrai as fichas e as orientações gerais do PDF fornecido, preserva os IDs das receitas já existentes e gera as 16 fotos faltantes e 30 montagens ilustradas. O PDF original permanece na pasta privada `conteúdo/`, fora de `public/`, e não é copiado para a publicação. Seu SHA-256 fica em `PRODUCT.book.sha256` para conferir a origem.

Com as dependências Python `pypdf`, `pdfplumber` e `Pillow`, e `pdftoppm` no PATH:

```text
python scripts/import-planopro-book.py --source "conteúdo/30 RECEITAS SOBREMESA DE TRAVESSA [Principal].pdf"
python scripts/import-planopro-book.py --source "conteúdo/30 RECEITAS SOBREMESA DE TRAVESSA [Principal].pdf" --verify
node scripts/validate-planopro-book.mjs
```

A validação exige 30 fichas completas, 252 itens de ingredientes, 120 etapas, 30 montagens, seis seções do guia e ausência do PDF na publicação. A conferência com o PDF compara ingredientes, quantidades, instruções, guia e demais campos extraídos com os dados publicados.

**Imagens e logo:** não há imagem quebrada nem dependência de imagens externas. As fotos, capas, diagramas, fontes e o favicon são materiais reais já disponíveis no projeto. O nome da marca é exibido em texto com um ícone SVG de cozinha, sem logotipo fictício. Caso queira um logotipo próprio, substituir o bloco `.brand` no `app.js` e `.mobile-brand` no `index.html`. A foto atual está em `assets/dalva-fernandes.jpg`.

## Organização dos arquivos

- `data.js`: catálogo, fichas completas em `details`, guia em `guide` e bônus; gerado pelo importador.
- `app.js`: navegação, pesquisa, seleção, checklists e estado local. Nenhum framework ou CDN.
- `style.css`: estrutura e estilos responsivos do aplicativo.
- `natal-elegante.css`: paleta verde pinheiro, marfim e dourado, fonte de sistema compartilhada com a landing page e ajustes de alinhamento no celular.
- `assets/`: imagens existentes e fotos/montagens extraídas do livro fornecido.

Para hospedar como estático, enviar esta pasta inteira. No repositório atual, a rota de hospedagem é `/planopro/`, independente da landing em `/sobremesas-de-travessa/`.

## Atualização dos bônus

Os bônus estão importados de `Conteúdos/` para `bonus-data.js`, sem publicar os PDFs. O Kit de WhatsApp oferece 24 modelos comentados, oito textos para Status e um resumo de pedido para copiar. As fichas têm espaço para anotações salvas neste navegador.

Com o Python que contém `pdfplumber`, execute `python scripts/import-planopro-bonuses.py`. Para conferir a fidelidade com os três PDFs privados, use `python scripts/import-planopro-bonuses.py --verify`. A importação preserva textos, tabelas, notas e referências; verifica a cobertura de todos os caracteres do conteúdo de cada página. As capas são usadas apenas como identificação dos materiais. O arquivo `bonus-data.js` deve permanecer junto de `data.js` e `app.js`; ele é independente da importação das receitas. Os arquivos PDF não devem ser copiados para `public/`.
