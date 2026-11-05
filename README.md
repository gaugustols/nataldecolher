# Natal de Colher

Landing page recuperada de Sobremesas de Travessa para o Natal, com publicação pelo fluxo GitHub → Vercel.

## Desenvolvimento

O site usa os arquivos publicados originais: HTML, CSS, fontes, imagens e um bundle React compilado. Os componentes de desenvolvimento originais e o produto completo em PDF não foram recuperados.

- `public/sobremesas-de-travessa/`: arquivos publicados da oferta.
- `public/index.html`: encaminhamento para a oferta.
- `vercel.json`: hospedagem estática de `public`, redirecionamento da raiz e fallback de rotas.
- `recovery/`: scripts de recuperação, inventário, auditoria e documentação das dependências externas.

Não há instalação ou build necessários para publicar esta versão. A Vercel acompanha a branch `main`. As próximas mudanças devem preservar os caminhos das imagens e ser verificadas antes do envio.

Os links de checkout, preços, contato e rastreamento originais foram mantidos. Não foram testados pagamento nem entrega dos produtos. Veja os detalhes e comandos em [recovery/README.md](recovery/README.md).

O backup ZIP, o espelho de trabalho e as capturas locais ficam fora do Git; os arquivos necessários à publicação estão em `public/`. Não versionar tokens, senhas, `.env` ou o ambiente Python.
