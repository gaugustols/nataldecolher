# Natal de Colher

Base inicial para desenvolver a landing page com Codex, versionar no GitHub e publicar na Vercel.

## Estrutura

- `public/index.html`: página inicial temporária, responsiva e em português.
- `public/`: imagens, estilos e scripts públicos da landing page.
- `vercel.json`: publicação estática da pasta `public`, sem instalação ou build.

## Desenvolvimento

A base usa HTML e CSS, sem dependências. Abra `public/index.html` no navegador para conferir a página. Podemos adicionar um framework quando o escopo exigir.

## Conexão com a Vercel

Importar o repositório `gaugustols/nataldecolher` na conta/equipe desejada e autorizar o acesso do aplicativo GitHub da Vercel ao repositório.

- Framework Preset: `Other`.
- Root Directory: raiz do repositório (`./`).
- Output Directory: `public` (definido em `vercel.json`).
- Build Command: vazio (definido em `vercel.json`).
- Production Branch: `main`.
- Variáveis de ambiente: nenhuma nesta base.

Após a integração, pushes na branch de produção geram deploys de produção; branches e pull requests podem gerar previews conforme as configurações da Vercel.

A conexão da conta Vercel e o primeiro deploy precisam ser confirmados no serviço; este arquivo não comprova que já foram concluídos.

## Próxima etapa

Desenvolver layout, textos, imagens e chamada para ação. A página temporária contém `noindex, nofollow`; revisar essa diretiva antes do lançamento definitivo.

Não versionar senhas, tokens ou arquivos `.env`.
