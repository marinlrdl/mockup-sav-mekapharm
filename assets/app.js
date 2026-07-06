/* ═══════════════════════════════════════════════════════════════════════════
   SHELL PARTAGÉ — navigation identique à l'application actuelle (sidebar) +
   topbar de refonte (recherche globale). Helpers communs (sparkline, tabs…).
   ═══════════════════════════════════════════════════════════════════════════ */

const SPARK_COLORS = { agir:'#ff5449', watch:'#ffb224', muet:'#8e9dbb', ok:'#46c98f' };

/* ── Sidebar : mêmes sections/entrées que layout.html.twig ─────────────────── */
function renderShell(){
  const page = document.body.dataset.page || '';
  const nAgir = PARC.agir + PARC.muet;
  const nav = `
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="mark">M</div>
      <div class="t">Mekapharm<small>SAV — maquette</small></div>
    </div>

    <div class="nav-section-label">Général</div>
    <a class="nav-link ${page==='dashboard'?'active':''}" href="index.html"><span class="ic">▦</span>Accueil
      ${nAgir? `<span class="n-badge">${nAgir}</span>`:''}</a>
    <a class="nav-link ${page==='pharmacies'?'active':''}" href="pharmacies.html"><span class="ic">✚</span>Pharmacies</a>
    <a class="nav-link ${page==='pieces'?'active':''}" href="pieces.html"><span class="ic">⚙</span>Pièces</a>

    <div class="nav-section-label">Config</div>
    <a class="nav-link ${page==='configuration'?'active':''}" href="configuration.html"><span class="ic">☰</span>Configuration</a>
    <a class="nav-link ${page==='utilisateurs'?'active':''}" href="configuration.html#utilisateurs"><span class="ic">◎</span>Utilisateurs</a>
    <a class="nav-link" href="#" onclick="return false;" title="Inchangé — hors périmètre refonte" style="opacity:.38; cursor:default;"><span class="ic">⧉</span>Voir l'API</a>
    <a class="nav-link" href="#" onclick="return false;" title="Inchangé — hors périmètre refonte" style="opacity:.38; cursor:default;"><span class="ic">⇄</span>Diff Prospects</a>
    <a class="nav-link ${page==='stats_pieces'?'active':''}" href="stats_pieces.html"><span class="ic">▤</span>Stats pièces</a>

    <div class="sidebar-foot">
      <div class="locale"><b>FR</b> / EN &nbsp;·&nbsp; ◐ thème</div>
      <div class="sidebar-user">
        <div class="av">CL</div>
        <div class="u"><b>C. Lemoine</b><span>Technicien</span></div>
      </div>
    </div>
  </aside>`;

  const topbar = `
  <div class="topbar note-host">
    <div class="gsearch note-host">
      <span class="lens">⌕</span>
      <input id="gsearch" type="text" placeholder="Pharmacie, ville, code client, machine…" autocomplete="off">
      <span class="kbd">touche /</span>
      <div class="gsearch-pop" id="gsearchPop"></div>
      <span class="note" style="top:-9px; left:10px;">R2.1 — recherche globale : nom, ville, gid, uid</span>
    </div>
    <div class="top-right">
      <span class="zone-chip">Zone <b>Normandie · 14-50-61</b></span>
      <span class="clock" id="clock">—</span>
      <button class="notes-toggle" id="notesBtn">✎ Notes de conception</button>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('afterbegin', nav + `<div class="shell">${topbar}<div class="page" id="pageRoot"></div></div>`);
  const root = document.getElementById('pageRoot');
  const tpl = document.getElementById('page-content');
  if (tpl) root.appendChild(tpl.content.cloneNode(true));

  /* horloge */
  const tick = () => {
    const d = new Date();
    const el = document.getElementById('clock');
    if (el) el.textContent = d.toLocaleDateString('fr-FR',{weekday:'short', day:'2-digit', month:'short'}) + ' · ' +
                             d.toLocaleTimeString('fr-FR',{hour:'2-digit', minute:'2-digit'});
  };
  tick(); setInterval(tick, 30000);

  /* notes de conception */
  document.getElementById('notesBtn').addEventListener('click', ()=>document.body.classList.toggle('annotated'));

  /* recherche globale : autocomplete pharmacies + machines → machine.html */
  const inp = document.getElementById('gsearch');
  const pop = document.getElementById('gsearchPop');
  const doSearch = () => {
    const q = inp.value.toLowerCase().trim();
    if (!q){ pop.classList.remove('open'); pop.innerHTML=''; return; }
    const hits = PHARMACIES.filter(p =>
      (`${p.nom} ${p.ville} ${p.id} ${p.machines.join(' ')}`).toLowerCase().includes(q)
    ).slice(0,6);
    pop.innerHTML = hits.length ? hits.map(p => `
      <a href="machine.html?m=${p.machinePrincipale}">
        <span class="gp-dot" style="background:${SPARK_COLORS[p.sparkColor]||'#46c98f'}"></span>
        <span><b>${p.nom}</b> — ${p.ville} (${p.dept})</span>
        <span class="gp-meta">${p.id} · ${p.machinePrincipale}</span>
      </a>`).join('')
      : `<a href="#" onclick="return false;"><span style="color:var(--ink-faint)">Aucun résultat pour « ${q} »</span></a>`;
    pop.classList.add('open');
  };
  inp.addEventListener('input', doSearch);
  inp.addEventListener('focus', doSearch);
  document.addEventListener('click', e => { if (!e.target.closest('.gsearch')) pop.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== inp){ e.preventDefault(); inp.focus(); inp.select(); }
    if (e.key === 'Escape'){ pop.classList.remove('open'); inp.blur(); }
  });
}

/* ── Sparkline SVG (ligne + point final + ligne fantôme baseline) ──────────── */
function spark(data, color, w=86, h=26, ghost=null){
  const min = Math.min(...data, ghost ?? Infinity), max = Math.max(...data, ghost ?? -Infinity);
  const rng = (max - min) || 1;
  const pt = (v,i)=>[ (i/(data.length-1))*w, h-3-((v-min)/rng)*(h-7) ];
  const pts = data.map((v,i)=>pt(v,i).join(',')).join(' ');
  const [lx,ly] = pt(data[data.length-1], data.length-1);
  let ghostLine = '';
  if (ghost !== null){
    const gy = h-3-((ghost-min)/rng)*(h-7);
    ghostLine = `<line x1="0" y1="${gy}" x2="${w}" y2="${gy}" stroke="rgba(235,232,222,.22)" stroke-dasharray="2 3" stroke-width="1"/>`;
  }
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true">${ghostLine}
    <polyline points="${pts}" stroke="${color}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="2.4" fill="${color}"/></svg>`;
}

/* ── Cards métriques ───────────────────────────────────────────────────────── */
function metricCard(m){
  return `<div class="metric">
    <div class="k">${m.k}</div>
    <div class="v ${m.cls||''}">${m.v}</div>
    <div class="cmp">${m.cmp||''}</div>
    ${spark(m.data, m.color, 160, 30, m.data[0])}
  </div>`;
}

/* ── Chart barres horizontales (top erreurs) ───────────────────────────────── */
function renderHBars(el, rows){
  const max = Math.max(...rows.map(r=>r.v), 1);
  el.innerHTML = rows.map(r=>`
    <div class="hbar-row">
      <span class="lbl" title="${r.lbl}">${r.lbl}</span>
      <span class="track"><span class="fill" style="width:0%"></span></span>
      <span class="val num">${r.v}</span>
    </div>`).join('');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    el.querySelectorAll('.fill').forEach((f,i)=>{ f.style.width = (rows[i].v/max*100)+'%'; });
  }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTELLIGENCE — helpers partagés : recommandation, confiance, risque, feedback.
   Tout est défensif : données absentes → chaîne vide, jamais d'erreur console.
   ═══════════════════════════════════════════════════════════════════════════ */
const CONF_LABEL = { sur:'sûr', probable:'probable', hypothese:'hypothèse' };
const ACT_LABEL  = { appeler:'📞 Appeler la pharmacie', surveiller:'👁 Surveiller 7 j' };
const ACT_SHORT  = { appeler:'📞 Appeler', surveiller:'👁 Surveiller' };

/* badge action (vocabulaire strictement limité à 2 valeurs) */
function actBadge(action, short){
  if (!action) return '';
  return `<span class="reco-act ${action}">${(short?ACT_SHORT:ACT_LABEL)[action]||action}</span>`;
}
/* badge de confiance à 3 niveaux (texture : plein / semi / pointillé) */
function confBadge(conf){
  if (!conf) return '';
  return `<span class="conf ${conf}"><span class="pip"></span>${CONF_LABEL[conf]||conf}</span>`;
}
/* risque 7 j : niveau visuel selon %, gauge optionnelle */
function riskLevel(p){ return p>=60 ? 'hi' : p>=40 ? 'mid' : ''; }
function riskBadge(pct, gauge){
  if (pct==null) return '';
  const lv = riskLevel(pct);
  return `<span class="risk ${lv}"><span class="rlbl">risque 7 j</span>${gauge?`<span class="risk-gauge"><i class="${lv}" style="width:${pct}%"></i></span>`:''}<b>${pct} %</b></span>`;
}

/* facteurs pondérés (mini barres). onAnchor(ancre) optionnel = clic sur un facteur ancré */
function factorRows(facteurs, anchorFn){
  if (!Array.isArray(facteurs)) return '';
  const max = Math.max(...facteurs.map(f=>f.poids||0), 1);
  return facteurs.map((f,i) => {
    const anchored = f.ancre && anchorFn;
    return `<div class="factor">
      <span class="fl ${anchored?'anchor':''}" ${anchored?`data-anchor="${f.ancre}"`:''}>${f.label}</span>
      <span class="fbar"><span class="ftrack"><span class="ffill" data-w="${(f.poids/max*100).toFixed(0)}" style="width:0%"></span></span><span class="fw">${f.poids} %</span></span>
    </div>`;
  }).join('');
}
/* anime les barres de facteurs présentes dans un conteneur */
function animateFactors(scope){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    (scope||document).querySelectorAll('.ffill[data-w]').forEach(f=>{ f.style.width = f.dataset.w+'%'; });
  }));
}
/* script d'appel numéroté + sources */
function scriptBlock(script, sources){
  let html = '';
  if (Array.isArray(script) && script.length)
    html += `<ol class="reco-script">${script.map(s=>`<li>${s}</li>`).join('')}</ol>`;
  if (sources) html += `<div class="reco-src">Sources : ${sources}</div>`;
  return html;
}

/* ── Feedback discret « Utile ? 👍 👎 » — état en localStorage, jamais bloquant ─ */
const FB_KEY = 'mock_reco_feedback';
function fbLoad(){ try { return JSON.parse(localStorage.getItem(FB_KEY)) || {}; } catch(e){ return {}; } }
function fbSave(store){ try { localStorage.setItem(FB_KEY, JSON.stringify(store)); } catch(e){} }
/* rend un chip feedback pour une reco identifiée par `id` */
function feedbackChip(id){
  const st = fbLoad()[id];
  const upOn = st==='up' ? 'on' : '', downOn = st==='down' ? 'on' : '';
  const thanks = st ? `<span class="fb-thanks">merci</span>` : '';
  return `<div class="fb" data-fb="${id}">
      <span>Utile ?</span>
      <button class="fb-btn up ${upOn}" data-v="up" title="Recommandation utile">👍</button>
      <button class="fb-btn down ${downOn}" data-v="down" title="Recommandation à revoir">👎</button>
      ${thanks}
      <span class="fb-why"><input class="inp" type="text" placeholder="Pourquoi ? (optionnel)" maxlength="120"></span>
    </div>`;
}
/* branche les chips feedback d'un conteneur (idempotent) */
function bindFeedback(scope){
  (scope||document).querySelectorAll('.fb[data-fb]').forEach(box => {
    if (box.dataset.bound) return; box.dataset.bound = '1';
    const id = box.dataset.fb;
    box.querySelectorAll('.fb-btn').forEach(btn => btn.addEventListener('click', () => {
      const v = btn.dataset.v, store = fbLoad();
      if (store[id] === v){ delete store[id]; } else { store[id] = v; }
      fbSave(store);
      box.querySelectorAll('.fb-btn').forEach(b=>b.classList.remove('on'));
      const now = fbLoad()[id];
      if (now) box.querySelector(`.fb-btn[data-v="${now}"]`).classList.add('on');
      let th = box.querySelector('.fb-thanks');
      if (now && !th){ th = document.createElement('span'); th.className='fb-thanks'; th.textContent='merci'; box.insertBefore(th, box.querySelector('.fb-why')); }
      if (!now && th) th.remove();
      /* après 👎 : proposer un mini champ « pourquoi », ignorable */
      const why = box.querySelector('.fb-why');
      if (why) why.classList.toggle('show', now === 'down');
    }));
  });
}

/* ── Onglets génériques ────────────────────────────────────────────────────── */
function bindTabs(tabSel, panelPrefix){
  document.querySelectorAll(tabSel).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll(tabSel).forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      const p = document.getElementById(panelPrefix + btn.dataset.tab);
      if (p) p.classList.add('active');
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   ASSISTANT IA SIMULÉ — drawer latéral, présent sur toutes les pages.
   Modèle "local" (aucune donnée ne sort) : réponses scriptées depuis ASSISTANT.
   Contexte = machine sur la fiche, parc ailleurs. Effet de frappe skippable.
   ═══════════════════════════════════════════════════════════════════════════ */
function mountAssistant(){
  if (typeof ASSISTANT === 'undefined') return;               /* défensif */
  const page = document.body.dataset.page || '';
  const ctxKey = page === 'machine' ? 'machine' : 'parc';
  const ctx = ASSISTANT[ctxKey];
  if (!ctx) return;

  const fab = document.createElement('button');
  fab.className = 'assist-fab'; fab.id = 'assistFab';
  fab.innerHTML = `<span class="sig">✦</span> Assistant`;

  const scrim = document.createElement('div');
  scrim.className = 'assist-scrim'; scrim.id = 'assistScrim';

  const drawer = document.createElement('aside');
  drawer.className = 'assist-drawer'; drawer.id = 'assistDrawer';
  drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML = `
    <div class="assist-head note-host">
      <div class="ah-top">
        <span class="ah-title"><span class="sig">✦</span> Assistant SAV</span>
        <button class="ah-close" id="assistClose" aria-label="Fermer">✕</button>
      </div>
      <div class="assist-priv"><span class="lk">⛨</span> ${ASSISTANT.banner}</div>
      <div class="assist-ctx">${ctx.contextLabel||''}</div>
      <span class="note" style="top:-10px; left:14px;">R5.4 — LLM local (llama.cpp/Ollama) sur le serveur, réponses ancrées données (RAG maison)</span>
    </div>
    <div class="assist-body" id="assistBody">
      <div class="msg bot"><div class="bubble"><p>Bonjour. Je réponds à partir des données de ${ctxKey==='machine'?'cette machine':'ce parc'}, en local. Choisissez une question ou posez la vôtre.</p></div></div>
    </div>
    <div class="assist-sugg" id="assistSugg">
      <div class="as-lbl">Suggestions</div>
    </div>
    <div class="assist-skip" id="assistSkip" style="display:none;">frappe en cours — cliquez pour tout afficher</div>
    <div class="assist-input">
      <input class="inp" id="assistInput" type="text" placeholder="Poser une question…" autocomplete="off">
      <button class="send" id="assistSend">Envoyer</button>
    </div>`;

  document.body.append(fab, scrim, drawer);

  const body   = drawer.querySelector('#assistBody');
  const suggEl = drawer.querySelector('#assistSugg');
  const input  = drawer.querySelector('#assistInput');
  const skipEl = drawer.querySelector('#assistSkip');

  (ctx.suggestions||[]).forEach(s => {
    const b = document.createElement('button');
    b.className = 'sugg-btn'; b.innerHTML = `<span class="si">✦</span>${s.q}`;
    b.addEventListener('click', () => ask(s.q, s.cap));
    suggEl.appendChild(b);
  });

  const open = () => { scrim.classList.add('open'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); setTimeout(()=>input.focus(),260); };
  const close = () => { scrim.classList.remove('open'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); };
  fab.addEventListener('click', open);
  drawer.querySelector('#assistClose').addEventListener('click', close);
  scrim.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key==='Escape' && drawer.classList.contains('open')) close(); });

  let typing = null;                                          /* état de frappe courant */

  function appendUser(text){
    const el = document.createElement('div');
    el.className = 'msg user'; el.textContent = text;
    body.appendChild(el); body.scrollTop = body.scrollHeight;
  }
  /* rend les blocs de réponse ; renvoie l'élément .bubble pour l'effet de frappe */
  function botShell(){
    const wrap = document.createElement('div'); wrap.className = 'msg bot';
    const bubble = document.createElement('div'); bubble.className = 'bubble';
    wrap.appendChild(bubble); body.appendChild(wrap); body.scrollTop = body.scrollHeight;
    return bubble;
  }
  /* construit le HTML final d'une réponse (tableau de blocs) */
  function blocksHtml(blocks){
    return blocks.map(b => {
      if (b.t === 'p')   return `<p>${b.h}</p>`;
      if (b.t === 'src') return `<div class="a-src">${b.h}</div>`;
      if (b.t === 'list')return `<div class="a-list">${(b.items||[]).map(it=>`<a href="${it.href}">${it.label}</a>`).join('')}</div>`;
      return '';
    }).join('');
  }
  /* effet de frappe ~20 ms/caractère, skippable au clic n'importe où dans le body/skip */
  function typeInto(bubble, html){
    const full = html;
    skipEl.style.display = 'block';
    let i = 0;
    const finish = () => {
      if (!typing) return;
      clearInterval(typing.timer); typing = null;
      bubble.innerHTML = full; skipEl.style.display = 'none';
      body.scrollTop = body.scrollHeight;
    };
    /* on tape sur une version texte, puis on bascule au HTML complet à la fin */
    const tmp = document.createElement('div'); tmp.innerHTML = full;
    const plain = tmp.textContent || '';
    typing = { finish };
    typing.timer = setInterval(() => {
      i += 2;                                                 /* ~2 char/tick à 40ms ≈ 20ms/char */
      bubble.innerHTML = `${plain.slice(0,i).replace(/</g,'&lt;')}<span class="a-caret"></span>`;
      body.scrollTop = body.scrollHeight;
      if (i >= plain.length) finish();
    }, 40);
  }
  const skipTyping = () => { if (typing) typing.finish(); };
  skipEl.addEventListener('click', skipTyping);
  body.addEventListener('click', e => { if (typing && !e.target.closest('a')) skipTyping(); });

  /* pose une question : capacité connue → réponse scriptée, sinon fallback honnête */
  function ask(text, cap){
    if (typing) skipTyping();
    appendUser(text);
    const blocks = (cap && ctx[cap]) ? ctx[cap] : ASSISTANT.fallback;
    const bubble = botShell();
    typeInto(bubble, blocksHtml(blocks));
  }
  /* saisie libre : tenter de deviner une capacité par mots-clés, sinon fallback */
  function freeAsk(text){
    const t = text.toLowerCase();
    let cap = null;
    if (/expliqu|pourquoi|c'est quoi|regress|régress|alerte/.test(t)) cap = 'explain';
    else if (/(dire|script|appel|téléphon|telephon|au pharma)/.test(t)) cap = 'script';
    else if (/(résum|resum|historiqu|synthès|synthes|état|etat du parc|ce matin)/.test(t)) cap = 'summary';
    else if (/(quelle|quels|qui a|liste|combien|autres pharma|même problème|meme probleme|lecteur|posmin)/.test(t)) cap = 'query';
    ask(text, cap && ctx[cap] ? cap : null);
  }
  const submit = () => { const v = input.value.trim(); if (!v) return; input.value=''; freeAsk(v); };
  drawer.querySelector('#assistSend').addEventListener('click', submit);
  input.addEventListener('keydown', e => { if (e.key==='Enter'){ e.preventDefault(); submit(); } });
}

document.addEventListener('DOMContentLoaded', () => { renderShell(); mountAssistant(); });
