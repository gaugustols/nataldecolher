# Recuperação da oferta — Sobremesas de Travessa para o Natal

Origem: https://aprendizadoilimitado.site/sobremesas-de-travessa/

## O que foi recuperado

A landing page publicada, incluindo HTML, bundle React compilado, CSS, fontes e imagens locais. Não é uma recriação visual. Os arquivos publicados de JavaScript, CSS e imagens foram preservados. Os arquivos originais de desenvolvimento, componentes JSX, projetos de design e o livro completo em PDF não foram encontrados no material público e não estão incluídos.

`site/` contém o espelho de trabalho local e está no backup ZIP. `../public/sobremesas-de-travessa/` contém a versão preparada para a Vercel e versionada no GitHub. A publicação usa a branch `main`; os relatórios de validação registram a inspeção local anterior ao deploy.

## Executar no Windows

Na raiz do repositório:

```powershell
.\.venv\Scripts\python.exe recovery/serve.py
```

Abrir http://127.0.0.1:8765/sobremesas-de-travessa/

O servidor escuta somente no computador local. O cabeçalho `X-Recovery-Server: nataldecolher-recovery-v1` identifica o processo correto. Encerrar com Ctrl+C.

Para reinstalar as ferramentas em outro computador com Python 3.12 ou superior:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-recovery.txt
.\.venv\Scripts\python.exe -m playwright install chromium
```

O `crawl.py` usa o cache de navegadores do usuário deste computador. Ajustar `browser_root` em outro computador.

## Scripts reutilizáveis

```powershell
.\.venv\Scripts\python.exe recovery/mirror.py
.\.venv\Scripts\python.exe recovery/audit_assets.py
.\.venv\Scripts\python.exe recovery/crawl.py
.\.venv\Scripts\python.exe recovery/prepare.py
```

`mirror.py` baixa por descoberta recursiva e reaproveita arquivos presentes. Inclui URLs geradas para as imagens ampliadas identificadas no bundle desta oferta. Não espelha os serviços externos nem executa formulários.

`audit_assets.py` faz uma varredura independente e grava `audit-report.json`. As referências excluídas são listadas com a justificativa; não são escondidas na contagem.

`crawl.py` testa a cópia local com serviços externos bloqueados, sem abrir checkouts. Registra capturas, texto, HTML, rede, imagens, diálogos, FAQ e rota profunda. `--live` captura a página original: permite GET/HEAD e bloqueia outros métodos, inclusive POSTs de rastreamento.

`prepare.py` copia o site para `public/` e configura o redirecionamento da raiz e o fallback da Vercel. Não faz commit, push ou deploy.

## Verificações e caminhos

- Uma landing page; não foi encontrado quiz ou árvore de perguntas nessa página.
- Dez páginas de amostra do livro foram abertas no ampliador local.
- Janela do plano básico testada: completo por R$ 9,99 ou seguir com básico por R$ 3,99.
- Quatro perguntas frequentes abertas.
- Desktop 1440 px e celular 390 px capturados; sem transbordamento horizontal no celular.
- Imagens forçadas a carregar para distinguir lazy loading de arquivos ausentes.
- Fallback testado em `/sobremesas-de-travessa/preview/route`.
- Resultados finais: `capture_local/report.json`; inventário: `mirror-manifest.json`; auditoria: `audit-report.json`.

O prefixo original foi mantido. Antes da correção, ele aparecia 203 vezes no HTML, 2 no JS e 3 no CSS. Não mover a página para a raiz sem revisar todos esses arquivos. Há também preloads relativos de fontes e imagens no HTML.

## Ajustes feitos na cópia

1. Adicionado `<base href="/sobremesas-de-travessa/">` ao HTML para os preloads relativos funcionarem em rotas profundas. O HTML original permanece em `source-index.html`.
2. O favicon original retorna HTTP 404; criado um pequeno SVG substituto, identificado como arquivo gerado na auditoria. Não é o favicon original recuperado.
3. Configuração da Vercel preparada com redirecionamento da raiz e fallback sob o prefixo original.

Quatorze caminhos PNG `public/assets/originais/fotos-vitrine/` existem como metadados `original` no bundle. Os URLs tentados retornam 404 e o renderizador usa as versões WebP recuperadas, não esse campo. São registrados como metadados excluídos. O bundle também retém uma tabela antiga de previews, com páginas 9, 10 e 124; as tentativas de imagens ampliadas desses números retornaram 404. A galeria ativa usa páginas 11–15 e 126–130, recuperadas e testadas.

## Checkout e dependências externas

| Função | Valor na página | Link preservado |
| --- | --- | --- |
| Completo | R$ 13,99 | https://aprendizadoilimitado.online/c/crlrdk7 |
| Básico | R$ 3,99 | https://aprendizadoilimitado.online/c/rmuzowq |
| Completo com desconto na janela do básico | R$ 9,99 | https://aprendizadoilimitado.online/c/dgl4she |

Os três links retornaram HTTP 200 e títulos correspondentes. Não houve preenchimento de dados, criação de pedido ou pagamento. Gateway, IDs internos dos produtos, APIs de pagamento, entrega de e-mail e PDFs completos não foram determinados pelos arquivos da landing page. Não há como afirmar que a venda fecha ou o material é entregue só por esses testes.

Não foi identificado um backend próprio necessário para renderizar esta landing page. O único `fetch` encontrado no bundle da página pertence ao carregamento de módulos; pagamento e entrega continuam nos serviços externos.

## Rastreamento preservado e pendências para republicar

O HTML mantém o script externo LZTrack:

- Workspace: `cmuyavq5d9k4vi1cho24uydqb`.
- Funil: `fnl_mvb61wx0_a04208d17e5344ffac`.
- Script: `https://lztrack.com/api/script.js` com os identificadores acima.
- O script carrega `https://connect.facebook.net/en_US/fbevents.js` e obtém pixels por configuração remota; nenhum ID numérico de pixel foi confirmado nesta inspeção.

Endpoints encontrados no script de rastreamento:

| Método | Endpoint | Função |
| --- | --- | --- |
| POST | `https://lztrack.com/api/track/context` | Obter contexto e pixels configurados |
| POST | `https://lztrack.com/api/track/event` | Registrar eventos |
| POST | `https://lztrack.com/api/track/checkout-mismatch` | Diagnosticar divergências de checkout |

A captura inicial observou tentativas de POST em context/event; foram bloqueadas pelo teste. O endpoint checkout-mismatch foi encontrado no código, sem executar a chamada. O script também implementa acompanhamento de cliques, formulários e identificadores em armazenamento local. Não foram encontrados `sendDefaultPii`, Sentry ou código de session replay nos arquivos examinados. Isso não prova a ausência desses recursos no checkout ou em futuras configurações remotas.

`lztrack-original.js` é uma cópia apenas para inspeção, com token diagnóstico temporário removido; não é servido pelo site recuperado. A página continua buscando a versão remota atual do rastreador. No teste local, todos os serviços externos foram bloqueados. Abrir o site normalmente ou republicá-lo pode enviar eventos para o workspace original. Confirmar a conta de destino e os três links de checkout antes do lançamento.

Contato preservado: `contato@aprendizadoilimitado.online`. O rodapé contém o título da oferta e “Edição 2026. Material digital.” Não foi encontrada razão social, endereço, CNPJ ou link explícito de termos/privacidade no HTML da landing page.

Se nada for alterado, a página exibirá os preços, contato e links antigos, usará o rastreamento original e dependerá dos checkouts externos e da entrega já configurada nessas contas. A recuperação não recria essas contas nem o produto digital completo.
