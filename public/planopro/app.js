(() => {
  'use strict';
  const P = window.PRODUCT;
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths = {
    home:'m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
    book:'M12 6c-3-3-7-3-10-2v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15',
    heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    grid:'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z',
    download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    menu:'M4 6h16M4 12h16M4 18h16',
    arrow:'m9 5 7 7-7 7', back:'m15 5-7 7 7 7',
    search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    check:'m5 12 4 4L19 6', clock:'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    gift:'M3 8h18v4H3Zm2 4v9h14v-9M12 8v13M12 8C4 8 4 1 8 2c3 0 4 6 4 6Zm0 0c8 0 8-7 4-6-3 0-4 6-4 6Z',
    calculator:'M5 2h14v20H5ZM8 5h8v4H8Zm0 8h1m6 0h1m-8 4h1m6 0h1',
    message:'M21 11a9 9 0 0 1-13 8l-6 2 2-6A9 9 0 1 1 21 11ZM8 10h8m-8 4h5',
    leaf:'M20 3c0 12-3 17-9 17A7 7 0 0 1 7 7c4-2 7-1 13-4ZM3 22 16 9',
    help:'M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
    chef:'M6 14a5 5 0 0 1-1-10 5 5 0 0 1 9-1 5 5 0 1 1 4 11v7H6Zm0 3h12',
    pin:'M8 3h8l-1 6 4 4v2h-6v7l-2-4v-3H5v-2l4-4Z',
    list:'M8 5h13M8 12h13M8 19h13M3 5h.01M3 12h.01M3 19h.01'
  };
  function icon(name, cls='') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`; }
  const ids = new Set(P.recipes.map(r=>r.id));
  let memory = {};
  function read(key, fallback) { try { const value=JSON.parse(localStorage.getItem('ndc-'+key)); if(value==null)return fallback; return Array.isArray(fallback)?(Array.isArray(value)?value:fallback):typeof fallback==='object'&&fallback!==null?(typeof value==='object'&&!Array.isArray(value)?value:fallback):typeof value===typeof fallback||fallback===null?value:fallback; } catch (_) { return memory[key] ?? fallback; } }
  function save(key, value) { memory[key] = value; try { localStorage.setItem('ndc-'+key, JSON.stringify(value)); } catch (_) { /* file:// ou armazenamento bloqueado: manter a sessão funcional. */ } }
  let favorites = new Set(read('favorites', []).filter(id=>ids.has(id)));
  let menu = new Set(read('menu', []).filter(id=>ids.has(id)));
  let checks = read('checks', {}), query = '', currentFilter = 'todas';
  let last = read('last', null), previousList = '#/receitas', toastTimer;
  const category = id => P.categories.find(c=>c.id===id);
  function toast(text) { $('#toast').textContent=text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600); }
  const nav = [['/','Início','home'],['/receitas','Receitas','book'],['/favoritos','Favoritos','heart'],['/mais','Mais','grid']];
  function renderNav(route) {
    const active = route.startsWith('/receita/') ? '/receitas' : nav.some(n=>n[0]===route) ? route : '/mais';
    const links = (items, extra='') => items.map(([href,name,i])=>{const isActive=active===href||route===href||(route.startsWith('/bonus/')&&href==='/bonus');return `<a class="nav-link ${isActive?'active':''} ${extra}" href="#${href}" ${isActive?'aria-current="page"':''}>${icon(i)}<span>${name}</span>${href==='/favoritos'&&favorites.size?`<b>${favorites.size}</b>`:''}</a>`;}).join('');
    $('#sidebar').innerHTML=`<a href="#/" class="brand"><span class="brand-icon">${icon('chef')}</span><span>Sobremesas<br>de Travessa<small>PARA O NATAL</small></span></a><div class="sidebar-label">SUA BIBLIOTECA</div><nav>${links(nav.slice(0,3))}${links([['/cardapio','Meu cardápio','list'],['/bonus','Bônus','gift'],['/guia','Guia de produção','chef'],['/ajuda','Ajuda e acesso','help']])}</nav><div class="sidebar-bottom"><img src="assets/dalva-fernandes.jpg" alt="Dalva Fernandes"><div>Dalva Fernandes<small>Sobremesas de Travessa</small></div></div>`;
    $('#bottom-nav').innerHTML=links(nav);
  }
  function heading(label,title,description,back) { return `${back?`<a class="back-link" href="${esc(back)}">${icon('back')} Voltar</a>`:''}<div class="page-heading"><div><p class="eyebrow">${esc(label)}</p><h1>${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:''}</div></div>`; }
  const missing = (title, text=P.missing) => `<div class="missing-note">${icon('book')}<div><strong>${esc(title)}</strong><p>${esc(text)}</p></div></div>`;
  function sectionCard(href,title,desc,i,number='') { return `<a class="section-card" href="${href}"><span class="section-icon">${icon(i)}</span><div>${number?`<span class="tiny-label">${number}</span>`:''}<h3>${title}</h3><p>${desc}</p></div>${icon('arrow','card-arrow')}</a>`; }
  function recipeCard(r) { return `<article class="recipe-card"><a class="recipe-cover" href="#/receita/${r.id}"><img src="assets/${r.photo}" alt="${esc(r.name)}" loading="lazy" width="640" height="400">${r.number?'<span class="sample-tag">Receita completa</span>':''}</a><button class="favorite ${favorites.has(r.id)?'selected':''}" data-favorite="${r.id}" aria-label="${favorites.has(r.id)?'Remover dos':'Salvar nos'} favoritos: ${esc(r.name)}" aria-pressed="${favorites.has(r.id)}">${icon('heart')}</button><div class="recipe-card-body"><span class="tiny-label">${category(r.category).name} · Receita ${String(r.number).padStart(2,'0')}</span><h3><a href="#/receita/${r.id}">${r.name}</a></h3><p>${r.description}</p><a class="recipe-link" href="#/receita/${r.id}">${r.number?'Consultar receita':'Ver apresentação'} ${icon('arrow')}</a></div></article>`; }
  function home() {
    const continueRecipe=P.recipes.find(r=>r.id===last);
    return `<section class="welcome-card"><div class="welcome-copy"><p class="eyebrow">NATAL 2026 · COM DALVA FERNANDES</p><h1>Encontre o sabor da sua <em>próxima encomenda.</em></h1><p>${P.welcome}</p><a class="button" href="#/receitas">Explorar receitas ${icon('arrow')}</a><div class="collection-meta"><span>${icon('book')}${P.recipes.length} receitas completas</span><span>${icon('gift')}3 bônus no completo</span></div></div><div class="book-art"><span class="art-ring"></span><img src="assets/capa-480.webp" alt="Capa do livro 30 Receitas Sobremesas de Travessa para o Natal" width="480" height="680"><span class="edition-stamp">EDIÇÃO<br><b>2026</b></span></div></section>
      <a class="start-banner" href="#/comece"><span class="section-icon">${icon('chef')}</span><div><span class="tiny-label">UM BOM COMEÇO</span><h2>Comece por aqui</h2><p>Veja como escolher seu cardápio e consultar cada etapa das receitas.</p></div>${icon('arrow')}</a>
      <div class="section-header"><div><p class="eyebrow">DO SEU JEITO</p><h2>Sua cozinha, mais organizada</h2></div></div><div class="section-grid">${sectionCard('#/receitas','Receitas','Encontre o sabor da sua próxima encomenda.','book','3 CATEGORIAS')}${sectionCard('#/cardapio','Meu cardápio','Reúna as sobremesas que você escolheu oferecer neste Natal.','list',`${menu.size} SELECIONADAS`)}${sectionCard('#/favoritos','Favoritos','Seus sabores salvos, sempre fáceis de encontrar.','heart')}${sectionCard('#/guia','Guia de produção','Organize as etapas, o resfriamento e a entrega.','chef')}</div>
      <div class="section-header"><div><p class="eyebrow">PARA CONSULTAR ENQUANTO PREPARA</p><h2>${continueRecipe?'Continue de onde você parou':'Receitas para começar'}</h2></div><a class="text-link" href="#/receitas">Ver receitas ${icon('arrow')}</a></div><div class="recipe-grid featured">${(continueRecipe?[continueRecipe,...P.recipes.filter(r=>r.featured&&r.id!==last)].slice(0,2):P.recipes.filter(r=>r.featured)).map(recipeCard).join('')}</div>
      <div class="section-header"><div><p class="eyebrow">NO PLANO COMPLETO</p><h2>Mais apoio para suas encomendas</h2></div><a class="text-link" href="#/bonus">Ver bônus ${icon('arrow')}</a></div>${bonusCards()}
      <p class="library-note">Consulte as 30 receitas completas, com ingredientes por preparo, montagem ilustrada e cuidados. Use a busca, os favoritos e as marcações para acompanhar o preparo.</p>`;
  }
  function catalog() {
    return `${heading('SEU ACERVO','Receitas','Encontre o sabor da sua próxima encomenda.')}<div class="catalog-summary"><span><b>${P.recipes.length}</b> receitas completas</span><span><b>${P.categories.length}</b> categorias</span><span><b>${P.recipes.length}</b> montagens ilustradas</span></div><div class="catalog-tools"><label class="search-box">${icon('search')}<input id="recipe-search" type="search" placeholder="Buscar nome ou número…" aria-label="Buscar receitas" value="${esc(query)}"></label><div class="filters" role="group" aria-label="Categorias"><button data-filter="todas" class="chip ${currentFilter==='todas'?'active':''}" aria-pressed="${currentFilter==='todas'}">Todas</button>${P.categories.map(c=>`<button data-filter="${c.id}" class="chip ${currentFilter===c.id?'active':''}" aria-pressed="${currentFilter===c.id}">${c.name}</button>`).join('')}</div></div><div id="catalog-results"></div>`;
  }
  function filteredRecipes() {
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    return P.recipes.filter(r=>(currentFilter==='todas'||r.category===currentFilter)&&normalize(String(r.number).padStart(2,'0')+' '+r.name+' '+r.description).includes(normalize(query)));
  }
  function renderResults() {
    const target = $('#catalog-results');
    if (!target) return;
    const found = filteredRecipes();
    const label = found.length === 1 ? 'receita' : 'receitas';
    const searchLabel = query ? ' para “' + esc(query) + '”' : '';
    target.innerHTML = `<p class="result-count" role="status">${found.length} ${label}${searchLabel}</p>${found.length
      ? '<div class="recipe-grid">' + found.map(recipeCard).join('') + '</div>'
      : '<div class="empty-state">' + icon('search') + '<h2>Nenhuma receita encontrada</h2><p>Experimente outro nome ou outra categoria.</p></div>'}`;
  }
  function savedPage(type) {
    const set=type==='favoritos'?favorites:menu, recipes=P.recipes.filter(r=>set.has(r.id));
    return `${heading(type==='favoritos'?'SEUS SABORES SALVOS':'PARA SUAS ENCOMENDAS',type==='favoritos'?'Favoritos':'Meu cardápio de Natal',type==='favoritos'?'Seus sabores salvos, sempre fáceis de encontrar.':'Reúna as sobremesas que você escolheu oferecer neste Natal.')}${recipes.length?`<div class="recipe-grid">${recipes.map(recipeCard).join('')}</div>`:`<div class="empty-state">${icon(type==='favoritos'?'heart':'list')}<h2>${type==='favoritos'?'Seus favoritos começam com uma receita':'Seu cardápio começa com uma escolha'}</h2><p>${type==='favoritos'?'Toque no coração de uma receita para encontrá-la aqui.':'Abra uma receita e escolha “Adicionar ao cardápio”.'}</p><a class="button" href="#/receitas">Explorar receitas ${icon('arrow')}</a></div>`}<p class="library-note">Suas escolhas ficam salvas neste navegador, quando o armazenamento local está disponível.</p>`;
  }
  function checklist(id,key,title,text) { const checked=Boolean(checks[id+'-'+key]);return `<label class="check-row ${checked?'done':''}"><input type="checkbox" data-check="${id}-${key}" ${checked?'checked':''}><span><strong>${esc(title)}</strong>${text?`<span>${esc(text)}</span>`:''}</span></label>`; }
  function recipePage(id) {
    const r=P.recipes.find(x=>x.id===id);if(!r)return notFound();
    last=id;save('last',id);const s=P.details[id];
    const ingredientCount=s?s.groups.reduce((n,g)=>n+g.items.length,0):0;
    const done=s?Array.from({length:s.steps.length},(_,i)=>checks[id+'-step-'+i]).filter(Boolean).length:0;
    return `<a class="back-link" href="${esc(previousList)}">${icon('back')} Voltar às receitas</a><div class="recipe-intro"><div class="recipe-intro-image"><img src="assets/${r.photo}" alt="${esc(r.name)}" width="640" height="440"></div><div><span class="pill">${category(r.category).name}${r.number?' · Receita '+String(r.number).padStart(2,'0'):''}</span><h1>${r.name}</h1><p>${r.description}</p>${s?`<div class="recipe-facts"><span>${icon('chef')}<b>${s.yield}</b></span><span>${icon('clock')}<b>${s.time}</b></span></div><p class="small muted">${s.portions}</p>`:'<p class="small muted">Apresentação identificada na oferta. Preparo integral ainda não disponível.</p>'}<div class="recipe-actions"><button class="button ${menu.has(id)?'outline':''}" data-menu="${id}">${icon(menu.has(id)?'check':'list')}${menu.has(id)?'Remover do cardápio':'Adicionar ao cardápio'}</button><button class="icon-button ${favorites.has(id)?'selected':''}" data-favorite="${id}" aria-label="${favorites.has(id)?'Remover dos':'Salvar nos'} favoritos: ${esc(r.name)}" aria-pressed="${favorites.has(id)}">${icon('heart')}</button></div></div></div>
      ${!s?`${missing('Receita indisponível',P.missing)}`:`
      <div class="recipe-jump" aria-label="Nesta receita"><a href="#ingredients" data-scroll="ingredients">Ingredientes</a><a href="#preparation" data-scroll="preparation">Preparo</a><a href="#assembly" data-scroll="assembly">Montagem</a><a href="#care" data-scroll="care">Cuidados</a></div>
      <div class="recipe-content"><div class="recipe-reading">
      <section class="reading-card" id="ingredients"><div class="reading-title"><span class="section-icon">${icon('list')}</span><div><p class="eyebrow">01 · SEPARE OS INGREDIENTES</p><h2>Tudo separado antes de começar</h2></div></div><p>Pese os ingredientes de cada preparo separadamente.</p>${s.groups.map((g,gi)=>`<h3 class="ingredient-group">${g.name}</h3><div class="ingredients">${g.items.map(([name,qty],ii)=>checklist(id,`ingredient-${gi}-${ii}`,name,qty)).join('')}</div>`).join('')}<p class="note"><strong>Utensílios:</strong> ${s.tools}</p>${s.ingredientNotes?`<p class="note">${s.ingredientNotes}</p>`:''}</section>
      <section class="reading-card" id="preparation"><div class="reading-title"><span class="section-icon">${icon('chef')}</span><div><p class="eyebrow">02 · PREPARE OS COMPONENTES</p><h2>Prepare e confira o ponto</h2></div></div><p>Faça uma etapa por vez. Observe textura, cor e temperatura.</p><div class="steps">${s.steps.map(([name,text],i)=>`<div class="step"><b class="step-number">${i+1}</b>${checklist(id,'step-'+i,name,text)}</div>`).join('')}</div><p class="note"><strong>Como reconhecer o ponto:</strong> ${s.point}</p></section>
      <section class="reading-card" id="assembly"><div class="reading-title"><span class="section-icon">${icon('grid')}</span><div><p class="eyebrow">03 · MONTAGEM E ACABAMENTO</p><h2>Monte nesta ordem</h2></div></div><p>${s.assemblyIntro}</p><ol class="assembly-list">${s.assembly.map(([name,text])=>`<li><h3>${name}</h3><p>${text}</p></li>`).join('')}</ol><button class="diagram-button" data-image="${s.diagram}" data-alt="Montagem ilustrada: ${esc(r.name)}"><img src="assets/${s.diagram}" alt="Montagem ilustrada de ${esc(r.name)}" loading="lazy"><span>Toque para ampliar a montagem ${icon('search')}</span></button><p class="note"><strong>Fechamento:</strong> ${s.closing}</p></section>
      <section class="reading-card" id="care"><div class="reading-title"><span class="section-icon">${icon('leaf')}</span><div><p class="eyebrow">04 · ORGANIZAÇÃO E CUIDADOS</p><h2>O cuidado faz parte da receita</h2></div></div><div class="care-table">${s.issues.map(([issue,fix])=>`<div><strong>${issue}</strong><p>${fix}</p></div>`).join('')}</div><h3>Tempos aproximados</h3><p>${s.time}<br>Refrigeração: ${s.chill}</p><h3>Conservação e transporte</h3><p>${s.care}</p><h3>Alergênicos e substituições</h3><p>${s.allergens}</p>${s.substitutions?`<p>${s.substitutions}</p>`:''}</section>
      </div><aside class="recipe-aside"><div class="reading-card"><p class="eyebrow">SUA CONSULTA</p><h3>Uma etapa de cada vez</h3><p id="progress-label">${done} de ${s.steps.length} etapas marcadas</p><progress id="recipe-progress" value="${done}" max="${s.steps.length}"></progress><p class="small muted">Marque ingredientes e passos conforme prepara. Você pode desmarcar quando quiser.</p><button class="text-button" data-reset="${id}">Limpar marcações</button></div><div class="reading-card"><h3>Organize seu preparo</h3><p class="small">Consulte ingredientes, preparo, montagem e cuidados pelas abas. Salve a receita nos favoritos ou inclua no seu cardápio para encontrá-la novamente.</p><a class="text-link" href="#/cardapio">Ver meu cardápio ${icon('list')}</a></div></aside></div>`}`;
  }
  function bonusCards() { return `<div class="bonus-grid">${P.bonuses.map((b,i)=>`<a href="#/bonus/${b.id}" class="bonus-card"><div class="bonus-art"><img src="assets/${b.photo}" alt="Capa: ${esc(b.name)}" loading="lazy"></div><div><span class="tiny-label">BÔNUS ${i+1} · PLANO COMPLETO</span><h3>${b.name}</h3><p>${b.description}</p><span class="recipe-link">Conhecer o material ${icon('arrow')}</span></div></a>`).join('')}</div>`; }
  function bonusPage(id) {
    if(!id)return `${heading('PARA SUAS ENCOMENDAS','Seus bônus','Três bônus incluídos no plano completo.')}${bonusCards()}${missing('Conteúdos dos bônus','Os conteúdos completos dos bônus ainda não foram adicionados à biblioteca.')}`;
    const b=P.bonuses.find(x=>x.id===id);if(!b)return notFound();
    return `${heading('NO PLANO COMPLETO',b.name,b.description,'#/bonus')}<div class="bonus-detail"><div class="bonus-detail-art"><img src="assets/${b.photo}" alt="Capa: ${esc(b.name)}"></div><div class="reading-card"><span class="section-icon">${icon(b.icon)}</span><h2>${b.detail}</h2>${missing('Conteúdo do bônus','O conteúdo completo deste bônus ainda não foi adicionado à biblioteca.')}${b.messages?`<div>${b.messages.map((m,i)=>`<article class="message-card"><h3>${esc(m.title)}</h3><p>${esc(m.text)}</p><button class="button outline" data-copy="${i}">Copiar mensagem</button></article>`).join('')}</div>`:''}</div></div>`;
  }
  function guide() {
    const sections = P.guide.map(section => {
      const steps = section.steps ? '<div class="guide-steps">' + section.steps.map(([title, text], index) => `<div class="step"><b class="step-number">${index + 1}</b><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></div>`).join('') + '</div>' : '';
      const rows = section.rows ? '<div class="care-table">' + section.rows.map(([title, text]) => `<div><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`).join('') + '</div>' : '';
      const references = section.references ? '<h3 class="guide-references-title">Fontes culinárias por receita</h3><ol class="guide-references">' + section.references.map(([number, text]) => `<li><strong>${String(number).padStart(2, '0')}</strong> · ${esc(text)}</li>`).join('') + '</ol>' : '';
      return `<section class="reading-card guide-section" id="guide-${section.id}"><p class="eyebrow">${esc(section.label)}</p><h2>${esc(section.title)}</h2>${section.intro ? '<p class="guide-intro">' + esc(section.intro) + '</p>' : ''}${section.text ? '<p>' + esc(section.text) + '</p>' : ''}${steps}${rows}${references}${section.note ? '<p class="note">' + esc(section.note) + '</p>' : ''}</section>`;
    }).join('');
    return `${heading('PARA SUA PRODUÇÃO','Guia de produção','Consulte as orientações de organização, preparo e entrega, aqui no aplicativo.')}<nav class="guide-jump" aria-label="Neste guia">${P.guide.map(section => `<a class="chip" href="#guide-${section.id}" data-scroll="guide-${section.id}">${esc(section.label)}</a>`).join('')}</nav>${sections}`;
  }
  function more() { return `${heading('TUDO NO SEU LUGAR','Mais da sua biblioteca','Apoio para escolher, preparar e organizar suas encomendas.')}<div class="section-grid">${sectionCard('#/cardapio','Meu cardápio','Reúna as sobremesas que você escolheu oferecer neste Natal.','list')}${sectionCard('#/bonus','Bônus','Três materiais de apoio incluídos no plano completo.','gift')}${sectionCard('#/guia','Guia de produção','Organize as etapas, o resfriamento e a entrega.','chef')}${sectionCard('#/ajuda','Ajuda e acesso','Consulte informações sobre seu acesso, os materiais e o atendimento.','help')}${sectionCard('#/comece','Comece por aqui','Veja como escolher seu cardápio e consultar cada etapa das receitas.','chef')}</div>`; }
  function start() { return `${heading('COMECE POR AQUI','Seu cardápio, uma receita por vez','Veja como escolher seu cardápio e consultar cada etapa das receitas.','#/')}<div class="start-layout"><div class="reading-card"><ol class="onboarding"><li><span>01</span><div><h2>Escolha os sabores</h2><p>Escolha um cardápio menor conforme sua clientela, sua geladeira e sua capacidade de produção. Você não precisa oferecer as 30 receitas.</p></div></li><li><span>02</span><div><h2>Separe os ingredientes</h2><p>Consulte o rendimento e as quantidades de cada creme, base e cobertura. O livro separa os ingredientes por preparo.</p></div></li><li><span>03</span><div><h2>Acompanhe o preparo e a montagem</h2><p>Siga a sequência e os sinais descritos na receita. Amplie os desenhos para visualizar as camadas da travessa.</p></div></li><li><span>04</span><div><h2>Leia os cuidados finais</h2><p>Consulte as orientações de conservação, transporte e alergênicos da receita que você está preparando.</p></div></li></ol><a class="button" href="#/receitas">Explorar receitas ${icon('arrow')}</a></div><aside class="reading-card author-note"><img src="assets/dalva-fernandes.jpg" alt="Dalva Fernandes"><p class="eyebrow">COM DALVA FERNANDES</p><h2>Para suas encomendas</h2><p>Ingredientes, preparo em etapas e montagem ilustrada para consultar enquanto produz suas encomendas.</p><p class="small muted">O foco é quem já tem conhecimentos básicos de cozinha. Não é uma formação completa de confeitaria.</p></aside></div>`; }
  function help() {
    return `${heading('PODE CONSULTAR','Ajuda e acesso','Consulte informações sobre seus materiais e o atendimento.')}<div class="help-grid">
      <section class="reading-card"><h2>Sobre a biblioteca</h2><p>Consulte as 30 receitas completas, divididas em clássicos, econômicas e especiais. Todo o conteúdo das receitas pode ser consultado aqui no aplicativo.</p><p>As receitas incluem ingredientes, preparo, montagem ilustrada e cuidados do livro.</p></section>
      <section class="reading-card"><h2>Suas escolhas e marcações</h2><p>Favoritos, cardápio e checklists ficam salvos neste navegador. Não há sincronização entre dispositivos.</p><p>Você pode desmarcar uma etapa ou usar “Limpar marcações” para preparar a receita novamente.</p></section>
      <section class="reading-card"><h2>Materiais complementares</h2><p>Os conteúdos dos três bônus ainda não foram adicionados à biblioteca. Consulte as 30 receitas completas e o Guia de produção pelo menu do aplicativo.</p></section>
      <section class="reading-card"><h2>Atendimento</h2><p>Para dúvidas sobre sua compra, use o contato informado na página de vendas.</p><a class="support-link" href="mailto:contato@aprendizadoilimitado.online">contato@aprendizadoilimitado.online</a></section>
      <section class="reading-card book-notes"><h2>Notas do livro</h2><p>${esc(P.book.notes)}</p><a class="text-link" href="#/guia">Consultar orientações e referências ${icon('book')}</a></section>
    </div>`;
  }
  function notFound() { return `<div class="empty-state">${icon('book')}<h1>Vamos voltar à sua biblioteca?</h1><p>Essa página não foi encontrada.</p><a class="button" href="#/">Ir para o início</a></div>`; }
  let lastRoute='',listScroll=0;
  function render() {
    const hash=(location.hash||'#/').slice(1), [route,params='']=hash.split('?');
    if(route==='/downloads'){window.location.replace('#/guia');return;}
    const returnToList=lastRoute.startsWith('/receita/')&&route==='/receitas';
    if(lastRoute.startsWith('/receitas')&&route.startsWith('/receita/')){previousList='#'+lastRoute;listScroll=window.scrollY;}
    if(route==='/receitas')currentFilter=new URLSearchParams(params).get('categoria')||'todas';
    if(!['todas',...P.categories.map(c=>c.id)].includes(currentFilter))currentFilter='todas';
    renderNav(route);document.title=(route==='/'?'Início':route.startsWith('/receita/')?'Receita':'Sua biblioteca')+' · '+P.name;
    const routes={'/':home,'/receitas':catalog,'/favoritos':()=>savedPage('favoritos'),'/cardapio':()=>savedPage('cardapio'),'/mais':more,'/bonus':()=>bonusPage(),'/guia':guide,'/comece':start,'/ajuda':help};
    $('#content').innerHTML=route.startsWith('/receita/')?recipePage(route.split('/')[2]):route.startsWith('/bonus/')?bonusPage(route.split('/')[2]):(routes[route]||notFound)();
    renderResults();lastRoute=hash;window.scrollTo({top:0,behavior:'instant'});
    $('#content').dataset.route=route;
    $('#content').focus({preventScroll:true});
    if(returnToList)requestAnimationFrame(()=>window.scrollTo({top:listScroll,behavior:'instant'}));
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('[data-favorite],[data-menu],[data-filter],[data-reset],[data-scroll],[data-image],[data-copy]');if(!button)return;
    if(button.hasAttribute('data-favorite')){
      const id=button.dataset.favorite;if(!ids.has(id))return;
      favorites.has(id)?favorites.delete(id):favorites.add(id);save('favorites',[...favorites]);
      document.querySelectorAll(`[data-favorite="${id}"]`).forEach(el=>{el.classList.toggle('selected',favorites.has(id));el.setAttribute('aria-pressed',String(favorites.has(id)));el.setAttribute('aria-label',`${favorites.has(id)?'Remover dos':'Salvar nos'} favoritos: ${P.recipes.find(r=>r.id===id).name}`);});
      if(location.hash.startsWith('#/favoritos'))render();else renderNav(lastRoute.split('?')[0]);toast(favorites.has(id)?'Receita salva nos favoritos.':'Receita removida dos favoritos.');
    } else if(button.hasAttribute('data-menu')){
      const id=button.dataset.menu;if(!ids.has(id))return;menu.has(id)?menu.delete(id):menu.add(id);save('menu',[...menu]);render();toast(menu.has(id)?'Adicionada ao seu cardápio de Natal.':'Receita removida do cardápio.');
    } else if(button.hasAttribute('data-filter')){location.hash='/receitas'+(button.dataset.filter==='todas'?'':'?categoria='+button.dataset.filter);
    } else if(button.hasAttribute('data-scroll')){e.preventDefault();document.getElementById(button.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    } else if(button.hasAttribute('data-reset')){Object.keys(checks).filter(k=>k.startsWith(button.dataset.reset+'-')).forEach(k=>delete checks[k]);save('checks',checks);render();toast('Marcações limpas.');
    } else if(button.hasAttribute('data-image')){const image=$('#image-dialog img');image.src='assets/'+button.dataset.image;image.alt=button.dataset.alt;$('#image-dialog').showModal();
    } else if(button.hasAttribute('data-copy')){const b=P.bonuses.find(b=>'#/bonus/'+b.id===location.hash),m=b?.messages?.[Number(button.dataset.copy)];if(m){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(m.text).then(()=>toast('Mensagem copiada.')).catch(()=>toast('Selecione o texto da mensagem para copiar.'));else toast('Selecione o texto da mensagem para copiar.');}}
  });
  document.addEventListener('input',e=>{if(e.target.id==='recipe-search'){query=e.target.value;renderResults();}});
  document.addEventListener('change',e=>{
    const key=e.target.dataset.check;if(!key)return;checks[key]=e.target.checked;save('checks',checks);e.target.closest('.check-row').classList.toggle('done',e.target.checked);
    const id=location.hash.split('/')[2],s=P.details[id];if(s){const done=s.steps.filter((_,i)=>checks[id+'-step-'+i]).length;$('#recipe-progress').value=done;$('#progress-label').textContent=`${done} de ${s.steps.length} etapas marcadas`;}
  });
  $('#image-dialog .dialog-close').addEventListener('click',()=>$('#image-dialog').close());
  $('#image-dialog').addEventListener('click',e=>{if(e.target===$('#image-dialog'))$('#image-dialog').close();});
  window.addEventListener('hashchange',render);render();
})();
