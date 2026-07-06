/* ═══════════════════════════════════════════════════════════════════════════
   DONNÉES FICTIVES PARTAGÉES — maquette refonte SAV
   Toutes les valeurs sont inventées mais chaque champ correspond à une donnée
   réellement collectée (voir audit_donnees.html à la racine du projet).
   ═══════════════════════════════════════════════════════════════════════════ */

const ETATS = { agir:'Agir', surveiller:'Surveiller', muet:'Silence radio', ok:'Nominal' };

const PHARMACIES = [
  { id:'11104', etat:'agir', grade:'D', score:38, delta:'−24', deltaWin:'2 h', depuis:'il y a 2 h',
    nom:'Pharmacie du Théâtre', ville:'Caen', dept:'14', tel:'02 31 44 78 12',
    machines:['M0482'], machinePrincipale:'M0482',
    composants:[{n:'OMEGA',s:'warn'},{n:'ASC1',s:'ok'},{n:'ASC2',s:'err'},{n:'Alpha1',s:'ok'},{n:'VBapocom',s:'ok'}],
    tag:'ASC2', motif:'<b>12 défauts capteur position basse</b> depuis mardi — ×4 vs sa normale.',
    spark:[2,2,3,2,4,6,9,12], sparkColor:'agir', nbAlertes:2, nbErreurs:3,
    reco:{ action:'appeler', confiance:'sur', risque7j:72, calculeLe:'cette nuit 03:12',
      titre:'Appeler la pharmacie — faire nettoyer le capteur PosMin ASC2',
      resume:'Défauts capteur en accélération franche, signature d’encrassement connue. Un nettoyage guidé au téléphone résout la majorité des cas.',
      facteurs:[
        { label:'Défauts PosMin ×4 vs normale (12 vs 3/7 j)', poids:45, ancre:'panel-asc2' },
        { label:'Seuil critique franchi (12 ≥ 10)', poids:25, ancre:'panel-asc2' },
        { label:'Ventouse gripper à 87 % d’usure (à coupler)', poids:18, ancre:null },
        { label:'Code -31012 documenté, cause identifiée', poids:12, ancre:null } ],
      script:[
        'Vous confirmez à la pharmacie une hausse des défauts sur l’ascenseur n°2 (ASC2).',
        'Demander de mettre l’ASC2 hors tension puis de nettoyer le capteur bas (soufflette, jamais de chiffon humide).',
        'Faire relancer 3 cycles et rester en ligne pour vérifier le compteur en direct.',
        'Si les défauts persistent, planifier le remplacement du capteur (réf. CAP-PM-02) et coupler la ventouse gripper (VEN-GR-01, 87 %).' ],
      sources:'12 défauts PosMin (7 j) · fiche CODE_ERREUR -31012 · usure PIECE_MACHINE VEN-GR-01' } },

  { id:'10771', etat:'agir', grade:'?', score:null, delta:'muette', deltaWin:'31 h', depuis:'31 h',
    nom:'Pharmacie Lafayette', ville:'Rouen', dept:'76', tel:'02 35 89 22 60',
    machines:['M0311'], machinePrincipale:'M0311',
    composants:[{n:'OMEGA',s:'mute'},{n:'ASC1',s:'mute'},{n:'VBapocom',s:'mute'}],
    tag:'Radio', motif:'<b>Aucune télémétrie depuis 31 h</b> — dernier contact hier 07:40.',
    spark:[9,8,9,9,8,9,0,0], sparkColor:'muet', nbAlertes:1, nbErreurs:0,
    reco:{ action:'appeler', confiance:'probable', risque7j:58, calculeLe:'cette nuit 03:12',
      titre:'Appeler la pharmacie — vérifier réseau / PC hôte',
      resume:'Coupure nette du flux depuis 31 h, sans dégradation préalable : rupture de liaison plutôt que panne robot. Un appel lève le doute immédiatement.',
      facteurs:[
        { label:'Silence télémétrie 31 h (> seuil 24 h)', poids:50, ancre:null },
        { label:'Arrêt franc, pas de dérive avant coupure', poids:30, ancre:null },
        { label:'Coupure hier 07:40 (heure d’ouverture)', poids:20, ancre:null } ],
      script:[
        'Demander si le robot est physiquement allumé et si l’écran répond.',
        'Vérifier que le PC hôte (Winpharma) est démarré et connecté au réseau.',
        'Faire tester un ping / accès internet depuis le poste pharmacie.',
        'Si tout est allumé mais toujours muet, escalade réseau — noter l’heure exacte du dernier contact (hier 07:40).' ],
      sources:'dernière TELEMETRIE hier 07:40 · absence d’insert > 24 h · aucune LOG_ERREUR' } },

  { id:'13120', etat:'agir', grade:'D', score:41, delta:'−18', deltaWin:'26 h', depuis:'hier',
    nom:'Pharmacie Centrale', ville:'Lille', dept:'59', tel:'03 20 54 11 08',
    machines:['M0529','M0530'], machinePrincipale:'M0529',
    composants:[{n:'OMEGA',s:'ok'},{n:'ASC1',s:'ok'},{n:'VBapocom',s:'err'}],
    tag:'Plateaux', motif:'<b>3 plateaux HS + 1 meuble HS</b> depuis 24 h — capacité stockage réduite.',
    spark:[0,0,1,1,1,2,3,4], sparkColor:'agir', nbAlertes:1, nbErreurs:1,
    reco:{ action:'appeler', confiance:'probable', risque7j:64, calculeLe:'cette nuit 03:12',
      titre:'Appeler la pharmacie — constater les plateaux HS et planifier',
      resume:'Perte de capacité matérielle en progression (3 plateaux + 1 meuble). Pas de résolution à distance : l’appel sert à qualifier l’urgence et préparer l’intervention.',
      facteurs:[
        { label:'3 plateaux + 1 meuble hors service', poids:40, ancre:null },
        { label:'Progression continue sur 24 h', poids:30, ancre:null },
        { label:'Capacité de stockage réduite (impact client)', poids:20, ancre:null },
        { label:'2ᵉ machine du site (M0530) à vérifier', poids:10, ancre:null } ],
      script:[
        'Confirmer avec la pharmacie combien de plateaux/meubles sont réellement inutilisables aujourd’hui.',
        'Demander depuis quand et si un incident (choc, coupure) a été constaté.',
        'Évaluer l’impact : la pharmacie arrive-t-elle encore à servir sans rupture ?',
        'Selon la gravité, planifier le déplacement technicien — prévoir le contrôle de M0530 sur le même site.' ],
      sources:'INFOS_VBAPOCOM structure meubles · 3 plateaux signalés HS · progression 24 h' } },

  { id:'10455', etat:'surveiller', grade:'C', score:61, delta:'−9', deltaWin:'4 j', depuis:'4 j',
    nom:'Grande Pharmacie de la Gare', ville:'Lyon', dept:'69', tel:'04 78 42 90 31',
    machines:['M0244'], machinePrincipale:'M0244',
    composants:[{n:'OMEGA',s:'ok'},{n:'Alpha1',s:'warn'},{n:'VBapocom',s:'warn'}],
    tag:'VBapocom', motif:'<b>8 boîtes retournées/j</b> (seuil 5) — hausse régulière depuis 4 j.',
    spark:[3,3,4,4,5,6,7,8], sparkColor:'watch', nbAlertes:1, nbErreurs:2,
    reco:{ action:'surveiller', confiance:'probable', risque7j:44, calculeLe:'cette nuit 03:12',
      titre:'Surveiller 7 j — retours boîtes en hausse, lecteur CB suspect',
      resume:'Dérive régulière mais sous le seuil critique : montée des retours cohérente avec un lecteur CB qui relit mal. À observer avant d’appeler.',
      facteurs:[
        { label:'Boîtes retournées 8/j (seuil warning 5)', poids:40, ancre:null },
        { label:'Hausse régulière et linéaire sur 4 j', poids:30, ancre:null },
        { label:'Timeouts lecture CB corrélés (-30871)', poids:20, ancre:null },
        { label:'Seuil critique (20) non atteint', poids:10, ancre:null } ],
      script:[
        'Suggérer à la pharmacie un nettoyage de la vitre du lecteur CB si contact déjà prévu.',
        'Observer le taux de retours et de relecture sur 48–72 h.',
        'Si la courbe dépasse 12/j ou franchit le seuil, basculer en appel.' ],
      sources:'VBA_NB_BR_J 8/j vs seuil 5 · 2 erreurs -30871 (timeout CB) sur 7 j' } },

  { id:'10821', etat:'surveiller', grade:'C', score:64, delta:'−7', deltaWin:'3 j', depuis:'3 j',
    nom:'Pharmacie du Port', ville:'La Rochelle', dept:'17', tel:'05 46 41 77 03',
    machines:['M0198'], machinePrincipale:'M0198',
    composants:[{n:'OMEGA',s:'warn'},{n:'ASC1',s:'ok'},{n:'VBapocom',s:'ok'}],
    tag:'OMEGA', motif:'Taux goulottes vides <b>14 %</b> (normale 6 %) — désorganisation stock probable.',
    spark:[6,6,7,8,9,11,13,14], sparkColor:'watch', nbAlertes:1, nbErreurs:0,
    reco:{ action:'surveiller', confiance:'hypothese', risque7j:33, calculeLe:'cette nuit 03:12',
      titre:'Surveiller 7 j — taux de goulottes vides élevé',
      resume:'Indicateur d’organisation du stock, pas de panne matérielle avérée. Cause probable côté approvisionnement pharmacie — à confirmer avant toute action.',
      facteurs:[
        { label:'Goulottes vides 14 % (normale 6 %)', poids:45, ancre:null },
        { label:'Hausse progressive sur 3 j', poids:25, ancre:null },
        { label:'Aucune erreur machine associée', poids:20, ancre:null },
        { label:'Origine possible : réappro pharmacie', poids:10, ancre:null } ],
      script:[
        'Vérifier si un pic d’activité ou une rupture d’appro explique le taux.',
        'Observer 7 j : le taux se stabilise-t-il après réassort ?',
        'Si > 20 % durablement, appeler pour un point sur l’organisation du stock.' ],
      sources:'OME_TAUX_GRIP_VIDE 14 % vs baseline 6 % · pas de LOG_ERREUR OMEGA' } },

  { id:'11502', etat:'surveiller', grade:'C', score:66, delta:'−6', deltaWin:'5 j', depuis:'5 j',
    nom:'Pharmacie Saint-Michel', ville:'Toulouse', dept:'31', tel:'05 61 52 30 44',
    machines:['M0367'], machinePrincipale:'M0367',
    composants:[{n:'OMEGA',s:'ok'},{n:'ASC1',s:'warn'},{n:'ASC2',s:'ok'}],
    tag:'ASC1', motif:'Offset zéro ascenseur en dérive lente — recalibrage à planifier.',
    spark:[2,2,3,3,4,4,5,5], sparkColor:'watch', nbAlertes:1, nbErreurs:1,
    reco:{ action:'surveiller', confiance:'hypothese', risque7j:29, calculeLe:'cette nuit 03:12',
      titre:'Surveiller 7 j — dérive lente de l’offset zéro ASC1',
      resume:'Dérive mécanique très progressive, sans franchissement de seuil. Le recalibrage se planifie, il n’y a pas d’urgence à appeler aujourd’hui.',
      facteurs:[
        { label:'Offset zéro en dérive régulière (5 j)', poids:50, ancre:null },
        { label:'Aucun seuil franchi à ce stade', poids:30, ancre:null },
        { label:'Recalibrage planifiable sans déplacement urgent', poids:20, ancre:null } ],
      script:[
        'Noter la tendance de l’offset pour le prochain passage technicien.',
        'Observer si la dérive s’accélère sur 7 j.',
        'Planifier un recalibrage lors d’une intervention déjà prévue sur la zone.' ],
      sources:'offset zéro ASC1 en hausse continue · aucune alerte critique ouverte' } },

  { id:'12210', etat:'surveiller', grade:'C', score:68, delta:'−5', deltaWin:'6 j', depuis:'6 j',
    nom:'Pharmacie des Halles', ville:'Dijon', dept:'21', tel:'03 80 30 65 21',
    machines:['M0412'], machinePrincipale:'M0412',
    composants:[{n:'OMEGA',s:'ok'},{n:'Alpha1',s:'warn'},{n:'Alpha4',s:'ok'}],
    tag:'Alpha1', motif:'Échecs identification lecteur 1 en hausse (<b>+35 %</b> sur 7 j).',
    spark:[10,11,10,12,12,13,13,14], sparkColor:'watch', nbAlertes:1, nbErreurs:2,
    reco:{ action:'surveiller', confiance:'probable', risque7j:38, calculeLe:'cette nuit 03:12',
      titre:'Surveiller 7 j — échecs d’identification lecteur 1',
      resume:'Hausse marquée des non-identifications sur le lecteur 1, typique d’une vitre encrassée. Surveiller, avec nettoyage simple à proposer si contact.',
      facteurs:[
        { label:'Échecs identification +35 % sur 7 j', poids:45, ancre:null },
        { label:'Concentré sur le lecteur 1 (pas le 4)', poids:30, ancre:null },
        { label:'Signature vitre sale / marquage', poids:15, ancre:null },
        { label:'Seuil relecture non franchi', poids:10, ancre:null } ],
      script:[
        'Proposer un nettoyage de la vitre du lecteur 1 (chiffon microfibre sec).',
        'Comparer lecteur 1 vs lecteur 4 pour isoler la panne.',
        'Suivre le taux de relecture sur 7 j ; appeler si franchissement du seuil.' ],
      sources:'échecs identification lecteur 1 +35 % · 2 erreurs -30890 sur 7 j' } },

  { id:'10203', etat:'muet', grade:'?', score:null, delta:'muette', deltaWin:'26 h', depuis:'26 h',
    nom:'Pharmacie de l’Église', ville:'Bayeux', dept:'14', tel:'02 31 92 15 40',
    machines:['M0203'], machinePrincipale:'M0203',
    composants:[{n:'OMEGA',s:'mute'},{n:'VBapocom',s:'mute'}],
    tag:'Radio', motif:'Coupure en heures ouvrées — suspecter réseau ou PC hôte.',
    spark:[7,8,7,8,8,7,3,0], sparkColor:'muet', nbAlertes:1, nbErreurs:0,
    reco:{ action:'appeler', confiance:'probable', risque7j:52, calculeLe:'cette nuit 03:12',
      titre:'Appeler la pharmacie — coupure en heures ouvrées',
      resume:'Le flux s’est éteint en pleine journée, ce qui écarte une simple fermeture. Réseau ou PC hôte le plus probable — un appel tranche vite.',
      facteurs:[
        { label:'Silence 26 h (> seuil 24 h)', poids:45, ancre:null },
        { label:'Coupure en heures ouvrées (pas une fermeture)', poids:35, ancre:null },
        { label:'Extinction progressive puis nulle', poids:20, ancre:null } ],
      script:[
        'Vérifier que la pharmacie est ouverte et le robot allumé.',
        'Contrôler l’état du PC hôte et de la connexion réseau.',
        'Faire redémarrer le poste si nécessaire et confirmer le retour du flux.' ],
      sources:'dernière TELEMETRIE il y a 26 h · coupure diurne · aucune LOG_ERREUR' } },

  { id:'10940', etat:'ok', grade:'A', score:94, delta:'+1', deltaWin:'7 j', depuis:'—',
    nom:'Pharmacie des Lices', ville:'Rennes', dept:'35', tel:'02 99 78 30 12',
    machines:['M0088'], machinePrincipale:'M0088',
    composants:[{n:'OMEGA',s:'ok'},{n:'ASC1',s:'ok'},{n:'Alpha1',s:'ok'},{n:'VBapocom',s:'ok'}],
    tag:'OK', motif:'Aucune anomalie, aucune dérive.',
    spark:[3,2,3,3,2,3,2,2], sparkColor:'ok', nbAlertes:0, nbErreurs:0 },

  { id:'11633', etat:'ok', grade:'B', score:86, delta:'0', deltaWin:'7 j', depuis:'—',
    nom:'Pharmacie Bellevue', ville:'Nantes', dept:'44', tel:'02 40 71 55 09',
    machines:['M0140'], machinePrincipale:'M0140',
    composants:[{n:'OMEGA',s:'ok'},{n:'ASC1',s:'ok'},{n:'VBapocom',s:'ok'}],
    tag:'OK', motif:'Aucune anomalie, aucune dérive.',
    spark:[4,4,3,4,4,5,4,4], sparkColor:'ok', nbAlertes:0, nbErreurs:1 },
];

const PARC = { nominal:212, agir:3, surveiller:7, muet:4, actives48h:96 };

/* ── Détail machine M0482 (Pharmacie du Théâtre, Caen) ─────────────────────── */
const MACHINE_M0482 = {
  macCode:'M0482', client:PHARMACIES[0],
  install:'12 mars 2019', typeOmega:'OMEGA+', versionPrincipale:'v3.10.15 (30/07/2025)',
  syncho:'il y a 4 min', etat:'agir',
  banner:{
    etat:'agir', lead:'Diagnostic — recalculé il y a 4 min',
    txt:'<b>ASC2 — capteur position basse (PosMin)</b> : 12 défauts en 72 h contre 3 en moyenne sur 8 semaines. Cause la plus probable : capteur encrassé ou connectique. La ventouse gripper (87 % d’usure) est à coupler à l’intervention.'
  },
  /* onglets triés par gravité (err > warn > ok) — R3d */
  tabs:[
    { id:'asc2', label:'ASC2', dot:'err' },
    { id:'omega', label:'OMEGA', dot:'warn' },
    { id:'vbapocom', label:'VBapocom', dot:'ok' },
    { id:'asc1', label:'ASC1', dot:'ok' },
    { id:'alpha1', label:'Alpha1', dot:'ok' },
  ],
  versions:[
    { comp:'OMEGA',   col:'VersLogiciel', v:'v3.10.15 (30/07/2025)', d:'12/06/2026' },
    { comp:'OMEGA',   col:'PrgPharao',    v:'PH-2.4.1',              d:'03/02/2026' },
    { comp:'ASC1',    col:'VersFWasc',    v:'FW 1.8.2',              d:'14/01/2026' },
    { comp:'ASC2',    col:'VersFWasc',    v:'FW 1.8.2',              d:'14/01/2026' },
    { comp:'Alpha1',  col:'VersLogiciel', v:'AL-3.2',                d:'02/11/2025' },
    { comp:'VBapocom',col:'VersLogiciel', v:'VB-5.0.3',              d:'19/06/2026' },
  ],
  erreurs:[
    { date:'01/07/2026', code:'-32063', nom:'Blocage GET gripper', op:'GET', occ:22, statut:'ouvert', silenced:false,
      cause:'Ventouse gripper usée ou boîte déformée dans la goulotte. Fréquent quand l’usure ventouse dépasse 80 %.',
      resolution:['Vérifier visuellement l’état de la ventouse (photo pharmacie).','Contrôler l’usure dans l’onglet Pièces (87 % ici).','Si > 80 % : planifier remplacement — réf. VEN-GR-01.'],
      pieces:[{n:'Ventouse gripper (VEN-GR-01)', d:'posée il y a 14 mois', eta:'usure 87 %'}],
      histo:'Silence posé 1× sur ce code en 2026 — bilan : efficace (nettoyage goulotte).' },
    { date:'30/06/2026', code:'-31012', nom:'Défaut capteur PosMin', op:'MOVE', occ:12, statut:'ouvert', silenced:false,
      cause:'Capteur de position basse encrassé (poussière de blister) ou connectique oxydée. Plus rarement : dérive mécanique du zéro après choc.',
      resolution:['Faire nettoyer le capteur PosMin par la pharmacie (soufflette, hors tension).','Vérifier à distance le compteur après 3 cycles.','Si persistance : remplacement capteur + contrôle câble (réf. CAP-PM-02).'],
      pieces:[{n:'Capteur PosMin ASC (CAP-PM-02)', d:'posé il y a 26 mois', eta:'suspect n°1'}],
      histo:null },
    { date:'28/06/2026', code:'-30871', nom:'Timeout lecture CB', op:'IDPK', occ:4, statut:'en_cours', silenced:true,
      cause:'Vitre lecteur sale ou boîte au marquage dégradé.',
      resolution:['Nettoyage vitre lecteur par la pharmacie.','Contrôler le taux de relecture Alpha sous 48 h.'],
      pieces:[], histo:'Sous surveillance jusqu’au 05/07 (posée par C. Lemoine).' },
  ],
  timeline:[
    { cls:'ev-agir', d:'Aujourd’hui 09:12', e:'Bascule <b>AGIR</b> — score 62 → 38 (défauts PosMin ASC2)' },
    { cls:'ev-warn', d:'Hier 18:04', e:'Pic journalier : <b>9 défauts PosMin</b> (normale : 1/j)' },
    { cls:'ev-maj',  d:'12 juin', e:'MAJ logicielle <b>OMEGA v3.10.15</b> — début de la hausse des erreurs de déplacement' },
    { cls:'ev-warn', d:'28 mai', e:'Silence 7 j posé sur Erreurs de déplacement <span class="fx ko">bilan : inefficace</span>' },
    { cls:'ev-ok',   d:'15 avril', e:'Intervention <b>#1204</b> — remplacement courroie bras Z <span class="fx okk">clôturée</span>' },
  ],
  tabsContent:{
    asc2:{ metrics:[
      { k:'Défauts position min. (7 j)', v:'12', cls:'bad', cmp:'seuil critique 10 · normale <b>3</b> — <b class="bad">×4</b>', data:[1,1,2,1,3,5,9,12], color:'#ff5449' },
      { k:'Défauts top Z (7 j)', v:'1', cls:'', cmp:'normale <b>1</b>', data:[1,0,1,1,0,1,1,1], color:'#8e9dbb' },
      { k:'Cycles ascenseur (cumul)', v:'48 212', cls:'', cmp:'usure courroie liée : 61 %', data:[44,45,45,46,46,47,48,48], color:'#8e9dbb' },
      { k:'Offset zéro (mm)', v:'2,1', cls:'', cmp:'stable', data:[2,2,2,2,2,2,2,2], color:'#8e9dbb' },
    ]},
    omega:{ metrics:[
      { k:'Erreurs de déplacement / sem', v:'47', cls:'warn', cmp:'médiane parc <b>28</b> — <b class="warn">×1,7</b> · corrélé MAJ 12/06', data:[26,28,25,30,29,34,41,47], color:'#ffb224' },
      { k:'Boîtes récupérées / j', v:'412', cls:'', cmp:'médiane parc <b>390</b>', data:[400,395,410,405,415,398,410,412], color:'#8e9dbb' },
      { k:'Boîtes chargées / j', v:'389', cls:'', cmp:'médiane parc <b>360</b>', data:[370,365,380,375,385,370,382,389], color:'#8e9dbb' },
      { k:'Taux goulottes vides', v:'7 <small>%</small>', cls:'', cmp:'normale <b>6 %</b>', data:[6,6,6,7,6,7,7,7], color:'#8e9dbb' },
      { k:'Boîtes défectueuses / j', v:'3', cls:'', cmp:'normale <b>2</b>', data:[2,2,3,2,2,3,3,3], color:'#8e9dbb' },
      { k:'Distance parcourue / j (m)', v:'1 840', cls:'', cmp:'stable', data:[1800,1790,1820,1810,1850,1830,1835,1840], color:'#8e9dbb' },
    ]},
    vbapocom:{ metrics:[
      { k:'Commandes / j', v:'318', cls:'', cmp:'médiane parc <b>295</b>', data:[300,290,310,305,320,298,312,318], color:'#8e9dbb' },
      { k:'Boîtes délivrées / j', v:'296', cls:'', cmp:'cohérent avec commandes', data:[285,280,300,295,310,290,300,296], color:'#8e9dbb' },
      { k:'Boîtes retournées / j', v:'2', cls:'', cmp:'seuil 5 — ok', data:[2,3,2,2,1,2,2,2], color:'#8e9dbb' },
      { k:'Plateaux HS', v:'0', cls:'', cmp:'normale <b>0</b>', data:[0,0,0,0,0,0,0,0], color:'#8e9dbb' },
    ]},
    asc1:{ metrics:[
      { k:'Défauts position min. (7 j)', v:'0', cls:'', cmp:'normale <b>0</b>', data:[0,0,0,0,0,0,0,0], color:'#8e9dbb' },
      { k:'Défauts top Z (7 j)', v:'0', cls:'', cmp:'normale <b>0</b>', data:[0,0,0,0,0,0,0,0], color:'#8e9dbb' },
      { k:'Cycles ascenseur (cumul)', v:'51 007', cls:'', cmp:'—', data:[47,48,48,49,49,50,50,51], color:'#8e9dbb' },
    ]},
    alpha1:{ metrics:[
      { k:'Boîtes identifiées / j', v:'389', cls:'', cmp:'—', data:[370,365,380,375,385,370,382,389], color:'#8e9dbb' },
      { k:'Taux de relecture', v:'9 <small>%</small>', cls:'', cmp:'médiane parc <b>11 %</b>', data:[10,10,9,10,9,9,9,9], color:'#8e9dbb' },
      { k:'Non identifiées lecteur 1 / j', v:'6', cls:'', cmp:'normale <b>7</b>', data:[7,7,6,7,6,6,6,6], color:'#8e9dbb' },
    ]},
  },
};

/* ── Top erreurs 7 j (dashboard) — par type machine, filtre FONCTIONNEL ────── */
const TOP_ERRORS = {
  all:[
    { lbl:'-32063 · GET (blocage gripper)', v:64 },
    { lbl:'-31012 · MOVE (capteur PosMin)', v:41 },
    { lbl:'-30871 · IDPK (timeout CB)', v:33 },
    { lbl:'-32090 · PUT (goulotte pleine)', v:28 },
    { lbl:'-30455 · INVE (inventaire)', v:19 },
    { lbl:'-31200 · PUTA (avant tapis)', v:12 },
  ],
  omega:[
    { lbl:'-32063 · GET (blocage gripper)', v:64 },
    { lbl:'-32090 · PUT (goulotte pleine)', v:28 },
    { lbl:'-30455 · INVE (inventaire)', v:19 },
  ],
  ascenseurs:[
    { lbl:'-31012 · MOVE (capteur PosMin)', v:41 },
    { lbl:'-31044 · MOVE (top Z)', v:9 },
  ],
  alpha:[
    { lbl:'-30871 · IDPK (timeout CB)', v:33 },
    { lbl:'-30890 · IDPK (non identifiée)', v:14 },
  ],
  vbapocom:[
    { lbl:'-29011 · COM (perte liaison hôte)', v:8 },
  ],
};

/* ── Pièces — usure & projection ───────────────────────────────────────────── */
const PIECES = [
  { piece:'Courroie bras Z', ref:'COU-BZ-04', machine:'M0311', pharma:'Pharmacie Lafayette — Rouen', compteur:'Distance OMEGA', pose:'02/05/2024', valPose:'12 400 km', valAct:'19 890 km', usure:94, eta:'≈ 3 sem.', etaCls:'crit' },
  { piece:'Ventouse gripper', ref:'VEN-GR-01', machine:'M0482', pharma:'Pharmacie du Théâtre — Caen', compteur:'Goulottes utilisées', pose:'28/04/2025', valPose:'1,02 M', valAct:'1,64 M', usure:87, eta:'≈ 5 sem.', etaCls:'warn' },
  { piece:'Batterie horloge RTC', ref:'BAT-RTC-02', machine:'M0203', pharma:'Pharm. de l’Église — Bayeux', compteur:'Âge (mois)', pose:'15/06/2021', valPose:'0', valAct:'60 mois', usure:71, eta:'≈ 8 sem.', etaCls:'' },
  { piece:'Capteur PosMin ASC', ref:'CAP-PM-02', machine:'M0482', pharma:'Pharmacie du Théâtre — Caen', compteur:'Cycles ASC2', pose:'10/04/2024', valPose:'21 300', valAct:'48 212', usure:63, eta:'≈ 4 mois', etaCls:'' },
  { piece:'Lecteur CB Alpha1', ref:'LCB-A1', machine:'M0244', pharma:'Grande Pharm. de la Gare — Lyon', compteur:'Boîtes identifiées', pose:'02/10/2025', valPose:'0,84 M', valAct:'1,12 M', usure:34, eta:'> 6 mois', etaCls:'' },
  { piece:'Courroie tapis T5', ref:'COU-T5-01', machine:'M0529', pharma:'Pharmacie Centrale — Lille', compteur:'Boîtes tapis T5', pose:'20/01/2026', valPose:'2,1 M', valAct:'2,4 M', usure:22, eta:'> 6 mois', etaCls:'' },
];

/* ── Stats pièces — remplacements historiques ──────────────────────────────── */
const STATS_PIECES = {
  parCategorie:[
    { lbl:'Ventouses gripper', v:34 }, { lbl:'Courroies (Z, T5)', v:27 },
    { lbl:'Capteurs ASC', v:18 }, { lbl:'Lecteurs CB', v:12 }, { lbl:'Autres', v:9 },
  ],
  dureesVies:[
    { piece:'Ventouse gripper', med:'15 mois', minmax:'9 – 22 mois', n:34 },
    { piece:'Courroie bras Z', med:'26 mois', minmax:'18 – 35 mois', n:16 },
    { piece:'Capteur PosMin', med:'31 mois', minmax:'20 – 44 mois', n:11 },
    { piece:'Lecteur CB Alpha', med:'38 mois', minmax:'25 – 50 mois', n:12 },
  ],
};

/* ── Configuration — codes erreurs & règles ────────────────────────────────── */
const CODES_ERREURS = [
  { code:'-32063', nom:'Blocage GET gripper', composant:'OMEGA', sousComposant:'Gripper', cause:'Ventouse usée ou boîte déformée…', resolution:'1. Vérifier ventouse\n2. Contrôler usure\n3. Remplacer si > 80 %', complet:true },
  { code:'-31012', nom:'Défaut capteur PosMin', composant:'ASC', sousComposant:'Capteur PosMin', cause:'Capteur encrassé ou connectique…', resolution:'1. Nettoyage soufflette\n2. Vérifier après 3 cycles\n3. Remplacer', complet:true },
  { code:'-30871', nom:'Timeout lecture CB', composant:'ALPHA', sousComposant:'Lecteur CB', cause:'Vitre sale, marquage dégradé', resolution:'1. Nettoyage vitre\n2. Suivre taux relecture', complet:true },
  { code:'-32090', nom:'Goulotte pleine (PUT)', composant:'OMEGA', sousComposant:'Goulottes', cause:'', resolution:'', complet:false },
  { code:'-29011', nom:'Perte liaison hôte', composant:'VBAPOCOM', sousComposant:'', cause:'', resolution:'', complet:false },
];
const REGLES = [
  { alias:'ASC_CPT_DEF_POS_MIN', nom:'Défauts position minimale', composant:'ASC', warn:3, crit:10, unite:'défauts/7j', adaptatif:false, importance:9 },
  { alias:'ASC_CPT_DEF_TOP_Z', nom:'Défauts top Z', composant:'ASC', warn:3, crit:10, unite:'défauts/7j', adaptatif:false, importance:8 },
  { alias:'VBA_NB_BR_J', nom:'Boîtes retournées / jour', composant:'VBAPOCOM', warn:5, crit:20, unite:'boîtes/j', adaptatif:true, importance:7 },
  { alias:'OME_NB_ERR_DEPL', nom:'Erreurs de déplacement', composant:'OMEGA', warn:60, crit:120, unite:'err/sem', adaptatif:true, importance:8 },
  { alias:'OME_TAUX_GRIP_VIDE', nom:'Taux goulottes vides', composant:'OMEGA', warn:12, crit:25, unite:'%', adaptatif:false, importance:5 },
  { alias:'ALP_TAUX_RELECTURE', nom:'Taux de relecture', composant:'ALPHA', warn:15, crit:30, unite:'%', adaptatif:true, importance:6 },
];

/* silence radio (rail) */
const MUETTES = [
  { nom:'Pharmacie Lafayette — Rouen', mac:'M0311', t:'31 h', note:'dernier contact hier 07:40 — robot éteint ou PC hôte HS', pid:'10771' },
  { nom:'Pharm. de l’Église — Bayeux', mac:'M0203', t:'26 h', note:'coupure en heures ouvrées — suspecter réseau', pid:'10203' },
  { nom:'Pharm. du Marché — Vire', mac:'M0158', t:'52 h', note:'2ᵉ épisode en 15 jours', pid:null },
  { nom:'Pharm. des Docks — Cherbourg', mac:'M0097', t:'3 j', note:'fermeture congés (note du 30/06)', pid:null },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ASSISTANT — réponses scriptées (simulation d'un modèle local, aucune donnée
   ne sort du serveur). Chaque réponse est un tableau de blocs :
     { t:'p', h:'…' }              paragraphe (HTML autorisé)
     { t:'src', h:'…' }           ligne de sources citées
     { t:'list', items:[{href,label}] }   liste de pharmacies cliquables
   Deux contextes : 'machine' (fiche M0482) et 'parc' (dashboard). Chaque contexte
   expose 4 capacités + un fallback honnête pour toute requête libre.
   ═══════════════════════════════════════════════════════════════════════════ */
const ASSISTANT = {
  banner:'Modèle local (CPU) · aucune donnée ne quitte le serveur',
  fallback:[
    { t:'p', h:'<b>(simulation)</b> Cette maquette ne fait pas tourner de modèle. En production, votre question serait envoyée à un modèle de langage <b>hébergé sur le serveur SAV</b> (llama.cpp / Ollama), avec pour contexte les données de la fiche affichée et du parc — sans qu’aucune donnée ne sorte de l’infrastructure Mekapharm.' },
    { t:'p', h:'Reformulez avec l’une des suggestions ci-dessous pour voir un exemple de réponse ancrée sur les données.' },
  ],
  machine:{
    contextLabel:'Contexte : machine M0482 · Pharmacie du Théâtre (Caen)',
    suggestions:[
      { cap:'explain',  q:'Explique-moi l’alerte en cours sur cette machine.' },
      { cap:'script',   q:'Que dire au pharmacien si je l’appelle ?' },
      { cap:'summary',  q:'Résume l’historique récent de cette machine.' },
      { cap:'query',    q:'Quelles autres pharmacies ont ce même défaut PosMin ?' },
    ],
    explain:[
      { t:'p', h:'L’alerte critique porte sur l’<b>ascenseur n°2 (ASC2)</b> : le capteur de position basse (PosMin) a déclenché <b>12 défauts en 7 jours</b>, contre 3 en moyenne sur 8 semaines. Le seuil critique (10) est franchi.' },
      { t:'p', h:'La signature — montée rapide et concentrée sur un seul ascenseur — correspond à un <b>capteur encrassé</b> (poussière de blister) ou une connectique oxydée, bien plus souvent qu’à une panne franche. La ventouse gripper voisine est à 87 % d’usure : à traiter dans le même passage.' },
      { t:'src', h:'D’après 12 défauts PosMin (7 j) + fiche CODE_ERREUR −31012 + usure PIECE_MACHINE VEN-GR-01 (87 %).' },
    ],
    script:[
      { t:'p', h:'Proposition de script d’appel pour la <b>Pharmacie du Théâtre</b> (☎ 02 31 44 78 12) :' },
      { t:'p', h:'1. « Nous suivons à distance votre robot : l’ascenseur n°2 signale des défauts de position répétés depuis mardi. »<br>2. « Pouvez-vous mettre cet ascenseur hors tension et nettoyer le capteur bas à la soufflette, sans chiffon humide ? »<br>3. « Je reste en ligne : relancez 3 cycles, je vérifie le compteur en direct. »<br>4. « Si ça persiste, je planifie le remplacement du capteur et de la ventouse gripper dans la foulée. »' },
      { t:'src', h:'Généré depuis la résolution CODE_ERREUR −31012 + coordonnées CLIENT 11104.' },
    ],
    summary:[
      { t:'p', h:'<b>Résumé 8 dernières semaines — M0482 :</b>' },
      { t:'p', h:'• <b>Aujourd’hui</b> : bascule en AGIR, score 62 → 38, tiré par les défauts PosMin ASC2.<br>• <b>12 juin</b> : MAJ OMEGA v3.10.15, coïncidant avec la hausse des erreurs de déplacement (+68 % vs baseline).<br>• <b>28 mai</b> : un silence 7 j posé sur les erreurs de déplacement s’est révélé inefficace.<br>• <b>15 avril</b> : intervention #1204, remplacement courroie bras Z, clôturée.' },
      { t:'src', h:'Union LOG_ERREUR + LOG_ALERTE + SOFTWARE_VERSION + INTERVENTION (timeline machine).' },
    ],
    query:[
      { t:'p', h:'Le défaut capteur PosMin (code <b>−31012</b>) est actif sur <b>2 pharmacies</b> du parc en ce moment :' },
      { t:'list', items:[
        { href:'machine.html?m=M0482', label:'Pharmacie du Théâtre — Caen (M0482) · 12 défauts/7 j · critique' },
        { href:'machine.html?m=M0367', label:'Pharmacie Saint-Michel — Toulouse (M0367) · dérive offset ASC1 · à surveiller' },
      ] },
      { t:'src', h:'Recherche ERR_OCCURRENCE_JOUR (code −31012) + REGLE_ALERTE ASC_CPT_DEF_POS_MIN sur le parc.' },
    ],
  },
  parc:{
    contextLabel:'Contexte : parc complet · 226 pharmacies',
    suggestions:[
      { cap:'explain',  q:'Explique-moi la régression post-MAJ OMEGA v3.10.15.' },
      { cap:'script',   q:'Que dire à une pharmacie muette que j’appelle ?' },
      { cap:'summary',  q:'Résume l’état du parc ce matin.' },
      { cap:'query',    q:'Quelles pharmacies ont un problème de lecteur CB ?' },
    ],
    explain:[
      { t:'p', h:'Depuis la MAJ <b>OMEGA v3.10.15</b> déployée le 12 juin, les <b>erreurs de déplacement médianes ont grimpé de +58 %</b> sur les 9 machines migrées. Deux d’entre elles sont déjà dans la file du jour (Caen, et une seconde en surveillance).' },
      { t:'p', h:'Le lien est temporel et corrélé, pas encore prouvé : la maquette croise la date de bascule de version avec la dérive des compteurs d’erreurs. Une confirmation demanderait de comparer un groupe témoin resté en version antérieure.' },
      { t:'src', h:'D’après SOFTWARE_VERSION (bascule 12/06) × ERR_OCCURRENCE_JOUR (erreurs déplacement) sur 9 machines.' },
    ],
    script:[
      { t:'p', h:'Trame d’appel pour une pharmacie en <b>silence radio</b> :' },
      { t:'p', h:'1. « Bonjour, nous ne recevons plus de données de votre robot depuis plusieurs heures — il est peut-être coupé du réseau. »<br>2. « Le robot est-il allumé et l’écran répond-il ? »<br>3. « Le PC hôte (Winpharma) est-il démarré et connecté à internet ? »<br>4. « Pouvez-vous redémarrer le poste ? Je vérifie si le flux revient. »' },
      { t:'src', h:'Généré depuis le motif type « silence radio » (absence de TELEMETRIE > 24 h).' },
    ],
    summary:[
      { t:'p', h:'<b>État du parc ce matin :</b>' },
      { t:'p', h:'• <b>3 pharmacies à agir</b> dont 1 bascule de moins de 2 h (Caen, défauts PosMin).<br>• <b>4 en silence radio</b> > 24 h — nominatives dans le rail dédié.<br>• <b>7 en surveillance</b> (dérives sous seuil).<br>• <b>212 nominales</b>, 96 % actives sur 48 h.<br>• Point d’attention transverse : régression suspecte post-MAJ OMEGA v3.10.15.' },
      { t:'src', h:'Agrégat sémaphore parc + bannière SOFTWARE_VERSION (recalcul nocturne 03:12).' },
    ],
    query:[
      { t:'p', h:'Les indicateurs liés au <b>lecteur CB</b> (timeouts −30871, retours boîtes, relecture) ressortent sur <b>2 pharmacies</b> :' },
      { t:'list', items:[
        { href:'machine.html?m=M0244', label:'Grande Pharmacie de la Gare — Lyon (M0244) · 8 boîtes retournées/j · à surveiller' },
        { href:'machine.html?m=M0412', label:'Pharmacie des Halles — Dijon (M0412) · échecs identification +35 % · à surveiller' },
      ] },
      { t:'src', h:'Recherche ERR_OCCURRENCE_JOUR (−30871/−30890) + REGLE_ALERTE lecteurs CB sur le parc.' },
    ],
  },
};
