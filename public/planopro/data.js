/* CONTEÚDO DO PRODUTO. Não completar lacunas com receitas inventadas.
   TROCAR: links de download em materials[].url, após receber os arquivos reais.
   TROCAR: conteúdos null, mensagens dos bônus e permissões após definição.
   Imagens e fontes em assets/ são cópias locais dos materiais reais da oferta. */
window.PRODUCT = {
  name: 'Sobremesas de Travessa para o Natal', author: 'Dalva Fernandes', edition: '2026',
  welcome: 'Boas-vindas ao Sobremesas de Travessa para o Natal! Explore suas receitas, escolha os sabores do seu cardápio e consulte cada etapa enquanto prepara suas encomendas.',
  missing: 'NÃO IDENTIFICADO — definir manualmente',
  categories: [
    { id:'classicos', name:'Clássicos', count:12, description:'Sabores conhecidos para ampliar seu cardápio de Natal.' },
    { id:'economicas', name:'Econômicas', count:10, description:'Explore as opções classificadas como econômicas no livro.' },
    { id:'especiais', name:'Especiais', count:8, description:'Conheça as versões especiais da coleção.' }
  ],
  recipes: [
    {id:'bombom-uva',name:'Bombom de uva na travessa',category:'classicos',photo:'foto-receita-02-640.webp',description:'Uvas inteiras, creme branco e cobertura macia de chocolate.',sample:2},
    {id:'pave-chocolate',name:'Pavê de chocolate e baunilha',category:'classicos',photo:'foto-receita-01-640.webp',description:'Biscoito macio, creme de baunilha e chocolate em camadas.'},
    {id:'torta-limao',name:'Torta de limão de colher',category:'classicos',photo:'foto-receita-04-640.webp',description:'Base fina de biscoito e creme cítrico, sem desenformar.'},
    {id:'mousse-maracuja',name:'Mousse de maracujá com calda',category:'classicos',photo:'foto-receita-03-640.webp',description:'Creme de maracujá com calda fina da própria fruta.'},
    {id:'delicia-abacaxi',name:'Delícia cremosa de abacaxi',category:'classicos',photo:'foto-receita-07-640.webp',description:'Abacaxi cozido e creme leve, sem biscoito ou chocolate.'},
    {id:'creme-coco',name:'Creme de coco com cobertura de chocolate',category:'classicos',photo:'foto-receita-08-640.webp',description:'Coco no recheio e uma camada fina de chocolate por cima.'},
    {id:'pave-pessego',name:'Pavê de pêssego',category:'classicos',photo:'foto-receita-06-640.webp',description:'Creme de baunilha, biscoito e pêssego em calda drenado.'},
    {id:'pudim-leite',name:'Pudim de leite na própria travessa',category:'classicos',photo:'foto-receita-10-640.webp',description:'Pudim assado para servir de colher, com caramelo por cima.'},
    {id:'pave-nozes',name:'Pavê de nozes com creme de baunilha',category:'especiais',photo:'foto-receita-24-640.webp',description:'Creme de nozes e biscoito, com acabamento tostado discreto.'},
    {id:'pave-panetone',name:'Pavê de panetone com laranja e chocolate',category:'especiais',photo:'foto-receita-23-640.webp',description:'Panetone umedecido em calda cítrica com creme de chocolate.'},
    {id:'banoffee',name:'Banoffee de travessa',category:'especiais',photo:'foto-receita-26-640.webp',description:'Banana, doce de leite e creme batido com toque de café e cacau.'},
    {id:'cheesecake',name:'Cheesecake de colher com frutas vermelhas',category:'especiais',photo:'foto-receita-25-640.webp',description:'Creme de cream cheese com base fina e compota cozida.',sample:25},
    {id:'merengue',name:'Merengue de morango na travessa',category:'especiais',photo:'foto-receita-28-640.webp',description:'Morango fresco, creme batido e pedacinhos de suspiro.'},
    {id:'torta-holandesa',name:'Torta holandesa de colher',category:'especiais',photo:'foto-receita-30-640.webp',description:'Base fina, creme branco aerado e cobertura de chocolate.'}
    // TROCAR: importar as 16 receitas restantes do livro: 4 clássicas,
    // 10 econômicas e 2 especiais. Nomes e conteúdos não identificados.
  ],
  bonuses: [
    {id:'precos',name:'Guia de Preços de Natal 2026',photo:'bonus-precos-240.webp',icon:'calculator',description:'Consulte o guia, os exemplos e as fichas para pensar seus preços com base nos custos.',detail:'Aprenda quanto cobrar pelas travessas com base nos seus custos, usando exemplos e fichas simples.',materials:['guia-precos']},
    {id:'whatsapp',name:'Kit de WhatsApp para Encomendas de Natal',photo:'bonus-mensagens-240.webp',icon:'message',description:'Encontre mensagens para copiar, adaptar e conversar com seus clientes.',detail:'Copie e adapte mensagens prontas para divulgar suas sobremesas, responder clientes e fechar pedidos.',materials:['kit-whatsapp'],messages:null},
    {id:'sobras',name:'Guia de aproveitamento: Sobras que viram lucro',photo:'bonus-aproveitamento-240.webp',icon:'leaf',description:'Consulte as fichas de aproveitamento dos ingredientes.',detail:'Veja como aproveitar ingredientes que sobraram, com fichas que explicam quando e como usar.',materials:['guia-sobras']}
  ],
  materials: [
    // COLAR LINK REAL AQUI em url. A interface não finge downloads disponíveis.
    {id:'livro',name:'Livro principal · 30 receitas',group:'Livro de receitas',format:'PDF',url:null,plan:'Completo'},
    {id:'guia-precos',name:'Guia de Preços de Natal 2026',group:'Bônus',format:null,url:null,plan:'Completo'},
    {id:'kit-whatsapp',name:'Kit de WhatsApp para Encomendas de Natal',group:'Bônus',format:null,url:null,plan:'Completo'},
    {id:'guia-sobras',name:'Guia de aproveitamento: Sobras que viram lucro',group:'Bônus',format:null,url:null,plan:'Completo'},
    {id:'basico',name:'Material das 5 receitas do básico',group:'Plano básico',format:null,url:null,plan:'Básico'}
  ],
  /* As duas fichas abaixo são transcrições das amostras públicas, não das
     outras 28 receitas. Manter quantidades e avisos do material de origem. */
  samples: {
    'bombom-uva': {
      yield:'Cerca de 1,4 kg',portions:'14 porções de 100 g ou 9 porções de 150 g',time:'Preparo: 25–35 min · Montagem: 5–10 min',chill:'Até estabilizar; reserve algumas horas de geladeira.',
      tools:'Balança, espátula, tigelas, termômetro culinário e travessa com tampa.',
      groups:[{name:'A · Creme',items:[['Leite condensado integral','395 g'],['Creme de leite UHT, 17% de gordura','200 g'],['Leite integral','100 mL'],['Amido de milho','12 g']]},{name:'B · Fruta',items:[['Uva verde sem sementes, sem talos, higienizada e seca','350 g']]},{name:'C · Cobertura',items:[['Chocolate meio amargo, 50% a 60% de cacau','200 g'],['Creme de leite UHT, 17% de gordura','200 g']]}],
      steps:[['Higienize e seque as uvas.','Retire talos e descarte frutas danificadas. Lave e use sanitizante próprio para alimentos conforme o rótulo. Enxágue se indicado. Seque sem amassar e mantenha refrigeradas.'],['Misture com o fogo desligado.','Dissolva os 12 g de amido nos 100 mL de leite frio. Acrescente os 395 g de leite condensado e os 200 g de creme de leite do preparo A.'],['Cozinhe, mexendo sempre.','Leve ao fogo médio-baixo. Raspe fundo e cantos. Quando engrossar e surgirem bolhas por todo o creme, cozinhe por mais cerca de 2 minutos, mexendo.'],['Resfrie o creme.','Transfira para recipiente raso. Coloque em banho de água com gelo, sem entrar água no creme. Mexa com utensílio limpo e meça a temperatura no centro. Depois refrigere protegido.']],
      point:'Creme liso que cai da espátula em faixa grossa. As uvas devem estar inteiras e secas. A cobertura precisa espalhar sem se misturar ao creme.',
      assemblyIntro:'Pique os 200 g de chocolate. Aqueça os 200 g de creme de leite do preparo C até ficar bem quente, sem fervura forte. Despeje sobre o chocolate; espere 1 minuto e mexa até ficar liso. Resfrie em recipiente raso e use fria, ainda espalhável.',
      assembly:[['Creme fino + todas as uvas','Espalhe só o suficiente de creme para cobrir o fundo. Distribua as uvas inteiras em uma camada.'],['Restante do creme','Cubra as uvas com todo o creme restante. Espalhe delicadamente, sem esmagar as frutas.'],['Cobertura com acabamento','Espalhe todo o chocolate. Com as costas de uma colher limpa, faça ondas rasas. Deixe espaço para a tampa e refrigere até ficar estável.']],
      diagram:'pagina-14-1063.webp',
      issues:[['Líquido junto às uvas','Seque bem e use frutas firmes, sem cortar.'],['Creme com grumos','Dissolva o amido no leite frio antes de ligar o fogo.'],['Tampa tocando no doce','Mantenha as ondas baixas e deixe folga acima da cobertura.']],
      care:'Mantenha a 4 °C ou menos. Transporte fechado, nivelado e em caixa térmica com elementos frios; monitore a temperatura do alimento. Oriente refrigeração imediata no recebimento. São 400 g de creme de leite no total: 200 g no creme branco e 200 g na cobertura. Mantenha as uvas refrigeradas enquanto prepara o creme.',
      allergens:'Leite. Chocolate pode conter soja e outros alergênicos. Confira todos os rótulos, glúten e contato cruzado.',
      substitutions:'Não troque chocolate por cobertura fracionada nem creme de leite por mistura culinária: a textura será diferente.'
    },
    cheesecake: {
      yield:'Cerca de 1,25 kg',portions:'12 porções de 100 g ou 8 porções de 150 g',time:'Preparo: 25–35 min · Montagem: 10–15 min',chill:'4–6 h.',
      tools:'Balança, espátula, tigelas, termômetro culinário e travessa com tampa. Triturador de biscoito e tigela para a gelatina.',
      groups:[{name:'A · Base',items:[['Biscoito maisena','150 g'],['Manteiga sem sal derretida','60 g']]},{name:'B · Creme',items:[['Cream cheese tradicional, refrigerado','300 g'],['Leite condensado integral','200 g'],['Creme de leite UHT, 17% de gordura','200 g'],['Gelatina incolor sem sabor em pó','6 g'],['Água para hidratar','30 mL']]},{name:'C · Compota',items:[['Frutas vermelhas congeladas, morango e amora, sem açúcar','300 g'],['Açúcar','60 g'],['Suco de limão coado','10 mL']]}],
      steps:[['Cozinhe a compota.','Leve as frutas ainda congeladas à panela com açúcar e limão. Cozinhe em fogo baixo, mexendo, por cerca de 10 a 15 minutos, até os pedaços amaciarem e o líquido engrossar. Resfrie em recipiente raso e refrigere.'],['Faça a base.','Triture os biscoitos e misture toda a manteiga derretida sem calor forte. Espalhe no fundo da travessa e pressione de leve, sem fazer uma placa muito compacta. Refrigere.'],['Hidrate a gelatina.','Polvilhe os 6 g nos 30 mL de água fria. Aguarde 5 minutos e dissolva em banho-maria suave, sem ferver, respeitando as instruções do fabricante.'],['Prepare o recheio.','Misture cream cheese, leite condensado e creme de leite até ficar liso. Misture algumas colheradas desse creme à gelatina líquida e depois incorpore ao restante. Use imediatamente na montagem.']],
      point:'Creme sem grumos de queijo e compota fria que espalha sem soltar água. A base é fina e deve ceder à colher.',assemblyIntro:'Siga a sequência dos desenhos e as quantidades indicadas.',
      assembly:[['Recheio sobre a base','Distribua todo o creme sobre o biscoito frio, por colheradas, para não arrastar a farofa.'],['Estruture na geladeira','Alise, tampe e gele por cerca de 4 horas, até a superfície sustentar uma camada fina de compota.'],['Compota fria','Espalhe toda a compota sem apertar, mantendo uma borda clara. Feche novamente e mantenha refrigerado. Sirva de colher, sem desenformar.']],
      diagram:'pagina-129-1063.webp',
      issues:[['Creme com bolinhas','Misture o cream cheese até homogeneizar antes de colocar gelatina.'],['Cobertura afunda','Aguarde a base estruturar e use compota fria.'],['Base muito dura','Não pressione com força nem aumente a manteiga.']],
      care:'Mantenha a 4 °C ou menos. Transporte fechado, nivelado e em caixa térmica com elementos frios; monitore a temperatura do alimento. Oriente refrigeração imediata no recebimento. A compota desta receita é cozida. Não use frutas descongeladas com líquido solto diretamente sobre o creme.',
      allergens:'Leite e trigo; biscoito pode conter soja. Confira rótulos e glúten.',substitutions:'Geleia comercial tem outro açúcar e concentração. Não é equivalente à compota da fórmula.'
    }
  }
};
