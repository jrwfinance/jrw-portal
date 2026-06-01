import { createClient as _createSupabaseClient } from '@supabase/supabase-js';
import './style.css';
const SUPA_URL = 'https://amhevyrewmlmwxncujmp.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGV2eXJld21sbXd4bmN1am1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NTI4MjQsImV4cCI6MjA5MjEyODgyNH0._I0pevBOVM7YMKPRkKTKiYVCUyAkAkYPr0ZzfW4qlt0';
const _sb = _createSupabaseClient(SUPA_URL, SUPA_KEY);

/* ── State ── */
let isDemoMode = false, currentBroker = null, allClients = [], allAlerts = [];
let _pgList = [], _pgPage = 0;
const PG_SIZE = 20;
let currentClient = null;
let cdProps = [], cdLoans = [], cdGoals = [], cdNotes = [], cdAlerts = [], cdDocs = [];
let _auditLoaded = false;

/* ── Demo data ── */
const DEMO_CLIENTS = [{
  id:'demo-c1', first_name:'Alex', last_name:'Demo', email:'testclient@jrwfinance.com.au',
  mobile:'0400 000 001', residential_address:'42 Test Street, Brisbane QLD 4000',
  broker_name:'James Wilson', broker_email:'jrwfinancegroup@gmail.com', client_since:2023, photo_url:null,
  properties:[{id:'prop-001',client_id:'demo-c1',address:'42 Test Street',suburb:'Brisbane',state:'QLD',postcode:'4000',property_type:'House',ownership_type:'PPOR',estimated_value:850000,weekly_rent:null,photo_url:null},
              {id:'prop-002',client_id:'demo-c1',address:'18 Elm Road',suburb:'New Farm',state:'QLD',postcode:'4005',property_type:'Apartment',ownership_type:'Investment',estimated_value:620000,weekly_rent:620,photo_url:null}],
  loans:[{id:'loan-001',property_id:'prop-001',lender:'Commonwealth Bank',loan_balance:595000,interest_rate:0.0589,rate_type:'fixed',fixed_expiry_date:new Date(Date.now()+120*86400000).toISOString().split('T')[0],loan_type:'P&I',monthly_repayment:3890,lvr:70},
         {id:'loan-002',property_id:'prop-002',lender:'ANZ',loan_balance:410000,interest_rate:0.0612,rate_type:'variable',fixed_expiry_date:null,loan_type:'IO',monthly_repayment:2090,lvr:66}]
},{
  id:'demo-c2', first_name:'Sarah', last_name:'Thompson', email:'sarah.t@example.com',
  mobile:'0411 222 333', residential_address:'8 Maple Avenue, Paddington QLD 4064',
  broker_name:'James Wilson', broker_email:'jrwfinancegroup@gmail.com', client_since:2022, photo_url:null,
  properties:[{id:'prop-003',client_id:'demo-c2',address:'8 Maple Avenue',suburb:'Paddington',state:'QLD',postcode:'4064',property_type:'House',ownership_type:'PPOR',estimated_value:1150000,weekly_rent:null,photo_url:null}],
  loans:[{id:'loan-003',property_id:'prop-003',lender:'Westpac',loan_balance:720000,interest_rate:0.0604,rate_type:'variable',fixed_expiry_date:null,loan_type:'P&I',monthly_repayment:4650,lvr:63}]
},{
  id:'demo-c3', first_name:'Marcus', last_name:'Lee', email:'marcus.lee@example.com',
  mobile:'0422 555 777', residential_address:'3 River Walk, South Brisbane QLD 4101',
  broker_name:'James Wilson', broker_email:'jrwfinancegroup@gmail.com', client_since:2024, photo_url:null,
  properties:[{id:'prop-004',client_id:'demo-c3',address:'3 River Walk',suburb:'South Brisbane',state:'QLD',postcode:'4101',property_type:'Apartment',ownership_type:'PPOR',estimated_value:780000,weekly_rent:null,photo_url:null}],
  loans:[{id:'loan-004',property_id:'prop-004',lender:'NAB',loan_balance:560000,interest_rate:0.0635,rate_type:'variable',fixed_expiry_date:null,loan_type:'P&I',monthly_repayment:3490,lvr:72}]
}];

/* ── Auth ── */
// Detect recovery flow from URL hash IMMEDIATELY — before any auth events fire.
// This prevents the initial SIGNED_IN (which Supabase fires before PASSWORD_RECOVERY)
// from loading the full broker app underneath the reset screen.
let _passwordResetMode = window.location.hash.includes('type=recovery');
let _passwordJustSaved = false; // set true when updateUser is called
let _appLoading = false;

async function _loadBrokerApp(session) {
  if (_appLoading) return;
  _appLoading = true;
  showLoading();
  try {
    const { data: broker } = await _sb.from('brokers').select('*').eq('id', session.user.id).maybeSingle();
    if (!broker) {
      await _sb.auth.signOut();
      showLoginError('This account does not have broker access.');
      showLoginScreen();
      return;
    }
    currentBroker = broker;
    setBrokerUI(broker);
    await loadAllClients();
    showDashboard();
  } catch(err) {
    console.error('Error loading broker app:', err);
    showLoginScreen();
  } finally {
    _appLoading = false;
  }
}

_sb.auth.onAuthStateChange(async (event, session) => {
  // PASSWORD_RECOVERY: show reset screen, block everything else
  if (event === 'PASSWORD_RECOVERY') {
    _passwordResetMode = true;
    showBrokerPasswordResetScreen();
    return;
  }

  // While in reset mode, block ALL events UNLESS the password was just saved.
  // Handles both USER_UPDATED and SIGNED_IN since Supabase fires either
  // depending on version/timing after a successful updateUser call.
  if (_passwordResetMode) {
    if (_passwordJustSaved && (event === 'USER_UPDATED' || event === 'SIGNED_IN')) {
      _passwordResetMode = false;
      _passwordJustSaved = false;
      _appLoading = false; // reset guard so _loadBrokerApp can run
      if (session) await _loadBrokerApp(session);
    }
    // Block everything else (including the initial SIGNED_IN on page load)
    return;
  }

  // Skip silent token refresh — app is already loaded, no need to reload
  if (event === 'TOKEN_REFRESHED') return;

  // Normal login / session restore
  if (session) {
    await _loadBrokerApp(session);
  } else {
    _appLoading = false;
    if (!isDemoMode) showLoginScreen();
  }
});

function setBrokerUI(broker) {
  const name = broker.name || 'James Wilson';
  const initials = name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  // Photo OR initials in topbar avatar
  const avatarEl = document.getElementById('broker-avatar');
  const ppAvEl = document.getElementById('pp-av-drop');
  const photoEl = document.getElementById('broker-photo-preview');
  if (broker.photo_url) {
    avatarEl.innerHTML = `<img src="${esc(broker.photo_url)}" alt="">`;
    ppAvEl.innerHTML = `<img src="${esc(broker.photo_url)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    photoEl.innerHTML = `<img src="${esc(broker.photo_url)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
  } else {
    avatarEl.textContent = initials;
    ppAvEl.textContent = initials;
    photoEl.textContent = initials;
  }
  document.getElementById('pp-name-drop').textContent = name;
  document.getElementById('pp-email-drop').textContent = broker.email || '';
  document.getElementById('broker-display-name').textContent = name;
  document.getElementById('bp-first').value = name.split(' ')[0] || '';
  document.getElementById('bp-last').value = name.split(' ').slice(1).join(' ') || '';
  document.getElementById('bp-email').value = broker.email || '';
  document.getElementById('bp-mobile').value = broker.mobile || '';
  document.getElementById('bp-licence').value = broker.licence_details || '';
  // Master admin gating
  const _isMaster = (broker.email||'').toLowerCase() === 'jrwfinancegroup@gmail.com';
  window._isMasterAdmin = _isMaster;
  const addBtn = document.getElementById('btn-add-client');
  if (addBtn) addBtn.style.display = _isMaster ? '' : 'none';
  const masterTab = document.getElementById('master-admin-tab');
  if (masterTab) masterTab.style.display = _isMaster ? 'flex' : 'none';
}

/* ── Load data ── */
async function loadAllClients() {
  if (isDemoMode) { renderDashboard(); return; }
  const [clientsR, propsR, loansR, alertsR] = await Promise.all([
    _sb.from('clients').select('*').order('last_name'),
    _sb.from('properties').select('*'),
    _sb.from('loans').select('*'),
    _sb.from('alerts').select('client_id').eq('dismissed', false),
  ]);
  if (clientsR.error) { showToast('Error loading clients'); console.error(clientsR.error); }
  const clients = clientsR.data || [];
  const props = propsR.data || [];
  const loans = loansR.data || [];
  allAlerts = alertsR.data || [];
  allClients = clients.map(c => ({
    ...c,
    properties: props.filter(p => p.client_id === c.id),
    // loan.client_id is set directly in schema – more efficient than re-deriving via property_id
    loans: loans.filter(l => l.client_id === c.id),
  }));
  renderDashboard();
}

/* ── Dashboard ── */
function renderDashboard() {
  const tv = allClients.reduce((s,c)=>s+c.properties.reduce((ss,p)=>ss+(p.estimated_value||0),0),0);
  const tl = allClients.reduce((s,c)=>s+c.loans.reduce((ss,l)=>ss+(l.loan_balance||0),0),0);
  document.getElementById('stat-total').textContent = allClients.length;
  document.getElementById('stat-value').textContent = fmtShort(tv);
  document.getElementById('stat-loans').textContent = fmtShort(tl);
  document.getElementById('stat-equity').textContent = fmtShort(tv - tl);
  document.getElementById('dash-sub').textContent = `${allClients.length} client${allClients.length!==1?'s':''} · ${currentBroker?.name||'James Wilson'}`;

  // Insight stats
  const today = new Date(); today.setHours(0,0,0,0);
  const in90 = new Date(today.getTime() + 90 * 86400000);
  const expiringCount = allClients.reduce((s,c)=>s+c.loans.filter(l=>{
    if (!l.fixed_expiry_date) return false;
    const d = new Date(l.fixed_expiry_date); return d >= today && d <= in90;
  }).length, 0);
  const alertClientIds = new Set(allAlerts.map(a=>a.client_id));
  const alertClientCount = alertClientIds.size;
  const newClientCount = allClients.filter(c=>c.properties.length===0).length;

  const expiringEl = document.getElementById('insight-expiring');
  const alertsEl = document.getElementById('insight-alerts');
  const newEl = document.getElementById('insight-new');
  if (expiringEl) {
    expiringEl.textContent = expiringCount;
    expiringEl.closest('.insight-tile').style.borderColor = expiringCount > 0 ? '#e8a000' : '#e0e0d8';
    expiringEl.closest('.insight-tile').style.background = expiringCount > 0 ? '#fdf9f0' : '#fff';
  }
  if (alertsEl) {
    alertsEl.textContent = alertClientCount;
    alertsEl.closest('.insight-tile').style.borderColor = alertClientCount > 0 ? '#6898d8' : '#e0e0d8';
    alertsEl.closest('.insight-tile').style.background = alertClientCount > 0 ? '#f2f6fd' : '#fff';
  }
  if (newEl) newEl.textContent = newClientCount;

  renderClientGrid(allClients);
}

function changePage(dir) {
  const maxPage = Math.ceil(_pgList.length / PG_SIZE) - 1;
  _pgPage = Math.max(0, Math.min(_pgPage + dir, maxPage));
  _renderCurrentPage();
}
function _renderCurrentPage() {
  const grid = document.getElementById('client-grid');
  const bar = document.getElementById('pagination-bar');
  const total = _pgList.length;
  const maxPage = Math.ceil(total / PG_SIZE) - 1;
  const slice = _pgList.slice(_pgPage * PG_SIZE, (_pgPage + 1) * PG_SIZE);
  _renderCards(grid, slice);
  if (total > PG_SIZE) {
    bar.style.display = 'flex';
    document.getElementById('pg-label').textContent = `Page ${_pgPage + 1} of ${maxPage + 1} · ${total} clients`;
    document.getElementById('pg-prev').disabled = _pgPage === 0;
    document.getElementById('pg-next').disabled = _pgPage === maxPage;
    document.getElementById('pg-prev').style.opacity = _pgPage === 0 ? '0.4' : '1';
    document.getElementById('pg-next').style.opacity = _pgPage === maxPage ? '0.4' : '1';
  } else {
    bar.style.display = 'none';
  }
}
function renderClientGrid(list) {
  _pgList = list;
  _pgPage = 0;
  const grid = document.getElementById('client-grid');
  if (!list.length) { grid.innerHTML='<p class="empty-msg">No clients yet. Click "New client" to add one.</p>'; document.getElementById('pagination-bar').style.display='none'; return; }
  _renderCurrentPage();
}
function _renderCards(grid, list) {
  const alertClientIds = new Set(allAlerts.map(a=>a.client_id));
  const today = new Date(); today.setHours(0,0,0,0);
  const in90 = new Date(today.getTime() + 90 * 86400000);
  grid.innerHTML = list.map(c => {
    const ini = ((c.first_name||'?')[0]+(c.last_name||'?')[0]).toUpperCase();
    const tv = c.properties.reduce((s,p)=>s+(p.estimated_value||0),0);
    const tl = c.loans.reduce((s,l)=>s+(l.loan_balance||0),0);
    const hasAlert = alertClientIds.has(c.id);
    const hasExpiring = c.loans.some(l=>l.fixed_expiry_date&&new Date(l.fixed_expiry_date)>=today&&new Date(l.fixed_expiry_date)<=in90);
    const isNew = c.properties.length === 0;
    const badges = [
      hasAlert ? `<span style="background:#fde9b8;color:#7a4000;border:0.5px solid #e8a000;font-size:9px;font-weight:700;padding:2px 6px;border-radius:99px;">Alert</span>` : '',
      hasExpiring ? `<span style="background:#fffbea;color:#854F0B;border:0.5px solid #e8c840;font-size:9px;font-weight:700;padding:2px 6px;border-radius:99px;">Rate expiry</span>` : '',
      isNew ? `<span style="background:#f0f0ea;color:#666;border:0.5px solid #ddd;font-size:9px;font-weight:700;padding:2px 6px;border-radius:99px;">New</span>` : '',
    ].filter(Boolean).join('');
    return `<div class="cc" onclick="openClient('${c.id}')">
      <div class="cc-head"><div class="cc-av">${c.photo_url?`<img src="${esc(c.photo_url)}" alt="">`:`${ini}`}</div>
        <div style="flex:1;min-width:0;"><div class="cc-name">${esc(c.first_name||'')} ${esc(c.last_name||'')}</div><div class="cc-email">${esc(c.email||'')}</div></div>
        ${hasAlert ? `<div style="width:8px;height:8px;border-radius:50%;background:#e8a000;flex-shrink:0;margin-top:2px;" title="Active alerts"></div>` : ''}
      </div>
      <div class="cc-body">
        ${badges ? `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">${badges}</div>` : ''}
        <div class="cc-stats">
          <div class="cc-stat"><div class="cc-stat-l">Portfolio</div><div class="cc-stat-v">${fmtShort(tv)}</div></div>
          <div class="cc-stat"><div class="cc-stat-l">Equity</div><div class="cc-stat-v">${fmtShort(tv-tl)}</div></div>
          <div class="cc-stat"><div class="cc-stat-l">Properties</div><div class="cc-stat-v">${c.properties.length}</div></div>
          <div class="cc-stat"><div class="cc-stat-l">Loans</div><div class="cc-stat-v">${c.loans.length}</div></div>
        </div>
      </div>
      <div class="cc-footer">
        <span class="cc-since">Since ${c.client_since||'–'}</span>
        <span style="font-size:10px;color:#aaa;">${c.last_active_at ? 'Active ' + _timeAgo(new Date(c.last_active_at)) : 'Never logged in'}</span>
      </div>
    </div>`;
  }).join('');
}

function filterClients(q) {
  const lc = q.toLowerCase();
  renderClientGrid(allClients.filter(c =>
    (c.first_name||'').toLowerCase().includes(lc) ||
    (c.last_name||'').toLowerCase().includes(lc) ||
    (c.email||'').toLowerCase().includes(lc)
  ));
}

/* ── Open client ── */
async function openClient(id) {
  showContentSpinner();
  const c = allClients.find(x=>x.id===id);
  if (!c) { hideContentSpinner(); return; }
  currentClient = c;
  document.getElementById('view-dashboard').style.display = 'none';
  document.getElementById('view-broker-settings').style.display = 'none';
  document.getElementById('view-client').style.display = 'flex';
  
  document.getElementById('tb-brand-wrap').classList.add('hidden');
  document.getElementById('tb-sep-brand').classList.add('hidden');
  document.getElementById('cd-sb-tb-toggle').style.display = 'flex';
  const cname = `${c.first_name||''} ${c.last_name||''}`.trim();
  const crumbEl = document.getElementById('tb-crumb');
  crumbEl.innerHTML = `<span onclick="goToDashboard()" style="cursor:pointer;color:#a8b87a;font-weight:400;" title="Back to all clients">← All Clients</span><span style="color:rgba(223,231,119,0.25);margin:0 6px;">›</span>${esc(cname)}`;

  // sidebar info
  const ini = ((c.first_name||'?')[0]+(c.last_name||'?')[0]).toUpperCase();
  const av = document.getElementById('cd-av');
  av.innerHTML = c.photo_url ? `<img src="${esc(c.photo_url)}" alt="">` : ini;
  document.getElementById('cd-name').textContent = cname;
  document.getElementById('cd-email').textContent = c.email||'';
  document.getElementById('cd-since').textContent = c.client_since ? `Since ${c.client_since}` : '';

  // Load client data
  const uid = c.id;

  // Load from demo data if in demo mode
  if (isDemoMode) {
    cdProps = JSON.parse(JSON.stringify(c.properties || []));
    cdLoans = JSON.parse(JSON.stringify(c.loans || []));
    cdGoals = [{id:'dg1',client_id:uid,title:'Buy investment property',status:'Planning',what:'Purchase 2-bed apartment in inner Brisbane',when_target:'By end of 2026',why:'Passive income and long-term wealth',where_location:'Fortitude Valley or New Farm',how:'Use equity from PPOR as deposit',sort_order:0}];
    cdNotes = [{id:'dn1',client_id:uid,created_at:new Date().toISOString(),author_name:'James Wilson',author_initials:'JW',category:'Portfolio review',body:'Portfolio is performing well. Fixed rate review coming up – recommend we start comparing lenders 8 weeks before expiry.',is_broker_note:true}];
    cdAlerts = c.loans?.some(l=>l.rate_type==='fixed') ? [{id:'da1',client_id:uid,created_at:new Date().toISOString(),title:'Fixed rate expiry approaching',body:'Your fixed rate loan is coming up for review. Let’s compare options before it expires.',alert_type:'urgent',icon:'⏰',dismissed:false}] : [];
    cdDocs = [{id:'dd1',client_id:uid,created_at:new Date(Date.now()-30*86400000).toISOString(),name:'Loan Contract 2024',category:'Loan contract',file_url:null,file_size_kb:2200,uploaded_by:'James Wilson'}];
    // populate profile fields
    document.getElementById('cp-first').value = c.first_name||'';
    document.getElementById('cp-last').value = c.last_name||'';
    document.getElementById('cp-mobile').value = c.mobile||'';
    document.getElementById('cp-since').value = c.client_since||'';
    document.getElementById('cp-address').value = c.residential_address||'';
    renderAll();
    switchTab('overview', document.querySelector('.cd-link[data-tab="overview"]'));
    hideContentSpinner();
    return;
  }

  const [pR, lR, gR, nR, aR, dR] = await Promise.all([
    _sb.from('properties').select('*').eq('client_id', uid),
    _sb.from('loans').select('*').eq('client_id', uid),
    _sb.from('goals').select('*').eq('client_id', uid).order('sort_order'),
    _sb.from('notes').select('*').eq('client_id', uid).order('created_at',{ascending:false}),
    _sb.from('alerts').select('*').eq('client_id', uid).eq('dismissed',false).order('created_at',{ascending:false}),
    _sb.from('documents').select('*').eq('client_id', uid).order('created_at',{ascending:false}),
  ]);
  cdProps = pR.data||[];
  cdLoans = lR.data||[];
  cdGoals = gR.data||[];
  cdNotes = nR.data||[];
  cdAlerts = aR.data||[];
  cdDocs = dR.data||[];

  // Populate client profile fields
  document.getElementById('cp-first').value = c.first_name||'';
  document.getElementById('cp-last').value = c.last_name||'';
  document.getElementById('cp-mobile').value = c.mobile||'';
  document.getElementById('cp-since').value = c.client_since||'';
  document.getElementById('cp-address').value = c.residential_address||'';
  const cpEmail = document.getElementById('cp-email'); if(cpEmail) cpEmail.value = c.email||'';

  renderAll();
  switchTab('overview', document.querySelector('.cd-link[data-tab="overview"]'));
  hideContentSpinner();
}

function renderAll() {
  renderOverview(); renderPortfolio(); renderPlanning(); renderNotes(); renderAlerts(); renderDocs();
}

/* ── Renders ── */
function renderOverview() {
  const tv = cdProps.reduce((s,p)=>s+(p.estimated_value||0),0);
  const tl = cdLoans.reduce((s,l)=>s+(l.loan_balance||0),0);
  const eq = tv - tl;
  const avgR = cdLoans.length ? (cdLoans.reduce((s,l)=>s+(l.interest_rate||0),0)/cdLoans.length*100).toFixed(2) : null;
  document.getElementById('cd-stats').innerHTML = `
    <div class="mini-stat"><div class="mini-stat-l">Portfolio value</div><div class="mini-stat-v">${fmt(tv)}</div><div class="mini-stat-s">${cdProps.length} propert${cdProps.length===1?'y':'ies'}</div></div>
    <div class="mini-stat"><div class="mini-stat-l">Total equity</div><div class="mini-stat-v" style="color:#3B6D11;">${fmt(eq)}</div><div class="mini-stat-s">${tv>0?((eq/tv)*100).toFixed(1):0}% of portfolio</div></div>
    <div class="mini-stat"><div class="mini-stat-l">Avg interest rate</div><div class="mini-stat-v">${avgR?avgR+'%':'–'}</div><div class="mini-stat-s">Across ${cdLoans.length} loan${cdLoans.length===1?'':'s'}</div></div>`;
  document.getElementById('ov-sub').textContent = currentClient ? `${currentClient.first_name} ${currentClient.last_name} · Client since ${currentClient.client_since||'–'}` : '';
  // Alerts fully integrated into overview
  const oAlerts = document.getElementById('cd-alerts-overview');
  const alertHeader = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#888;">Active alerts${cdAlerts.length ? ' <span style=\"background:#e8a000;color:#fff;font-size:9px;padding:1px 5px;border-radius:99px;font-weight:700;\">' + cdAlerts.length + '</span>' : ''}</div>
    <button class="add-btn" style="font-size:10px;padding:4px 11px;" onclick="openModal('modal-add-alert')">+ Send alert</button>
  </div>`;
  const alertCards = cdAlerts.map(a=>`
    <div class="alert-item ${a.alert_type||'info'}" style="margin-bottom:7px;">
      <div class="alert-icon">${a.icon||'\u2139\ufe0f'}</div>
      <div style="flex:1;"><div class="alert-title">${esc(a.title)}</div><div class="alert-body">${esc(a.body||'')}</div></div>
      <button class="alert-del" onclick="deleteAlert('${a.id}')" title="Dismiss">&times;</button>
    </div>`).join('');
  oAlerts.innerHTML = alertHeader + (cdAlerts.length ? alertCards : '<p class="empty-msg" style="margin-bottom:4px;">No active alerts. Use &quot;+ Send alert&quot; to create one.</p>');
  // Property overview cards
  const ovProps = document.getElementById('cd-ov-props');
  if (!cdProps.length) { ovProps.innerHTML='<p class="empty-msg">No properties yet. Use "+ Add property" above.</p>'; return; }
  ovProps.innerHTML = cdProps.map(prop=>{
    const loan = cdLoans.find(l=>l.property_id===prop.id);
    const eq2 = (prop.estimated_value||0)-(loan?loan.loan_balance||0:0);
    const isInv = prop.ownership_type==='Investment';
    return `<div class="card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">
        <div><div style="font-size:13px;font-weight:600;">${esc(prop.address)}</div><div style="font-size:10px;color:#888;">${esc(prop.suburb||'')} ${esc(prop.state||'')} ${esc(prop.postcode||'')}</div></div>
        <span class="badge ${isInv?'badge-inv':'badge-ppor'}">${esc(prop.ownership_type||'PPOR')}</span>
      </div>
      <div class="eq-bar-wrap"><div class="eq-bar" style="width:${Math.min(100,prop.estimated_value>0?Math.round((eq2/prop.estimated_value)*100):0)}%;${isInv?'background:#c8d060;':''}"></div></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="font-size:10px;color:#3B6D11;font-weight:600;">Equity ${fmt(eq2)}</span>${loan?`<span style="font-size:10px;color:#888;">LVR ${loan.lvr||'–'}%</span>`:''}</div>
      ${loan?`<div style="display:flex;gap:6px;align-items:center;"><span class="badge ${loan.rate_type==='fixed'?'badge-fix':'badge-var'}">${((loan.interest_rate||0)*100).toFixed(2)}% ${loan.rate_type}</span><span style="font-size:10px;color:#888;">${esc(loan.lender||'')}</span>${loan.fixed_expiry_date?`<span style="font-size:10px;color:#854F0B;margin-left:4px;">Expires ${new Date(loan.fixed_expiry_date).toLocaleDateString('en-AU',{month:'short',year:'numeric'})}</span>`:''}
      </div>`:''}
    </div>`;
  }).join('');
}

function renderPortfolio() {
  const wrap = document.getElementById('cd-portfolio');
  if (!cdProps.length) { wrap.innerHTML='<p class="empty-msg">No properties yet. Click "+ Add property &amp; loan" to add one.</p>'; return; }
  wrap.innerHTML = cdProps.map(prop=>{
    const loan = cdLoans.find(l=>l.property_id===prop.id);
    const eq = (prop.estimated_value||0)-(loan?loan.loan_balance||0:0);
    const isInv = prop.ownership_type==='Investment';
    return `<div class="prop-card">
      <div class="prop-head">
        <div><div class="prop-addr">${esc(prop.address)}</div><div style="font-size:10px;color:#a8b87a;">${esc(prop.suburb||'')} ${esc(prop.state||'')} · <span class="badge ${isInv?'badge-inv':'badge-ppor'}" style="font-size:9px;">${esc(prop.ownership_type||'PPOR')}</span></div></div>
      </div>
      <div class="prop-body">
        <table class="dt" style="margin-bottom:10px;">
          <tr><td class="lbl">Estimated value</td><td class="val"><input class="td-ed" value="${fmt(prop.estimated_value)}" onblur="saveProp('${prop.id}','estimated_value',parseCurrency(this.value))"></td></tr>
          <tr><td class="lbl">Equity</td><td class="val" style="color:#3B6D11;font-weight:600;">${fmt(eq)}</td></tr>
          ${prop.weekly_rent?`<tr><td class="lbl">Weekly rent</td><td class="val"><input class="td-ed" value="$${prop.weekly_rent}" onblur="saveProp('${prop.id}','weekly_rent',parseCurrency(this.value))"></td></tr>`:''}
          ${prop.listing_url?`<tr><td class="lbl">Listing</td><td class="val"><a href="${esc(prop.listing_url)}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#0C447C;">View ↗</a></td></tr>`:''}
        </table>
        ${loan?`<div style="background:#f5f5f0;border-radius:8px;padding:10px 12px;">
          <div style="font-size:9px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:8px;">Linked loan</div>
          <table class="dt">
            <tr><td class="lbl">Lender</td><td class="val"><input class="td-ed" value="${esc(loan.lender||'')}" onblur="saveLoan('${loan.id}','lender',this.value)"></td></tr>
            <tr><td class="lbl">Balance</td><td class="val"><input class="td-ed" value="${fmt(loan.loan_balance)}" onblur="saveLoan('${loan.id}','loan_balance',parseCurrency(this.value))"></td></tr>
            <tr><td class="lbl">Rate</td><td class="val"><input class="td-ed" value="${((loan.interest_rate||0)*100).toFixed(2)}%" onblur="saveLoan('${loan.id}','interest_rate',parseFloat(this.value)/100)"></td></tr>
            <tr><td class="lbl">Rate type</td><td class="val"><select class="td-ed" style="cursor:pointer;" onchange="saveLoan('${loan.id}','rate_type',this.value)"><option${loan.rate_type==='variable'?' selected':''}>variable</option><option${loan.rate_type==='fixed'?' selected':''}>fixed</option></select></td></tr>
            ${loan.rate_type==='fixed'&&loan.fixed_expiry_date?`<tr><td class="lbl">Fixed expiry</td><td class="val"><input class="td-ed" type="date" value="${loan.fixed_expiry_date}" onblur="saveLoan('${loan.id}','fixed_expiry_date',this.value)"></td></tr>`:''}
            <tr><td class="lbl">Monthly repayment</td><td class="val"><input class="td-ed" value="${loan.monthly_repayment?fmt(loan.monthly_repayment):'–'}" onblur="saveLoan('${loan.id}','monthly_repayment',parseCurrency(this.value))"></td></tr>
            <tr><td class="lbl">Loan type</td><td class="val"><select class="td-ed" style="cursor:pointer;" onchange="saveLoan('${loan.id}','loan_type',this.value)"><option${loan.loan_type==='P&I'?' selected':''}>P&I</option><option${loan.loan_type==='IO'?' selected':''}>IO</option></select></td></tr>
            <tr><td class="lbl">LVR</td><td class="val"><input class="td-ed" value="${loan.lvr||'–'}%" onblur="saveLoan('${loan.id}','lvr',parseFloat(this.value))"></td></tr>
            <tr><td class="lbl">Next review</td><td class="val" id="nrd-cell-${loan.id}">${_reviewDateCell(loan.id, loan.next_review_date)}</td></tr>
          </table>
          <div style="margin-top:8px;"><button style="background:none;border:0.5px solid #e8d0d0;color:#c0321f;font-size:11px;padding:4px 10px;border-radius:6px;cursor:pointer;" onclick="deleteLoan('${loan.id}')">Delete loan</button></div>
        </div>`:`<p style="font-size:11px;color:#888;margin-top:6px;">No loan linked. Use "+ Add property &amp; loan" to add a loan.</p>`}
        <div style="margin-top:12px;padding-top:10px;border-top:0.5px solid #ebebeb;">
          <button style="background:none;border:none;color:#bbb;font-size:11px;cursor:pointer;padding:0;" onmouseover="this.style.color='#c0321f'" onmouseout="this.style.color='#bbb'" onclick="deleteProp('${prop.id}')">Delete property</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderPlanning() {
  const wrap = document.getElementById('cd-planning');
  if (!cdGoals.length) { wrap.innerHTML='<p class="empty-msg">No goals yet.</p>'; return; }
  const sc = {'In progress':'amber','On track':'green','Planning':'grey','Long-term':'grey','Complete':'blue'};
  const today = new Date(); today.setHours(0,0,0,0);
  wrap.innerHTML = cdGoals.map(g => {
    const progress = g.progress ?? 0;
    const targetDate = g.target_date ? new Date(g.target_date) : null;
    const daysLeft = targetDate ? Math.ceil((targetDate - today) / 86400000) : null;
    const dateStr = targetDate ? targetDate.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'}) : '';
    return `
    <div class="goal-card">
      <div class="goal-head">
        <div class="goal-title">${esc(g.title)}</div>
        <select class="status-sel ${sc[g.status]||'grey'}" onchange="saveGoalStatus('${g.id}',this.value,this)">
          <option${g.status==='Planning'?' selected':''}>Planning</option>
          <option${g.status==='In progress'?' selected':''}>In progress</option>
          <option${g.status==='On track'?' selected':''}>On track</option>
          <option${g.status==='Long-term'?' selected':''}>Long-term</option>
          <option${g.status==='Complete'?' selected':''}>Complete</option>
        </select>
        <button style="background:rgba(255,255,255,0.08);border:0.5px solid rgba(255,80,0,0.3);color:#f0a080;font-size:10px;padding:2px 7px;border-radius:5px;cursor:pointer;" onclick="deleteGoal('${g.id}')">✕</button>
      </div>
      <div class="goal-body">
        <div style="margin-bottom:10px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Progress</span>
            <span style="font-size:11px;font-weight:700;color:#2e3105;" id="gp-pct-${g.id}">${progress}%</span>
          </div>
          <div style="background:#eef0e4;border-radius:99px;height:5px;overflow:hidden;margin-bottom:4px;">
            <div id="gp-bar-${g.id}" style="height:5px;border-radius:99px;background:${progress>=100?'#6aaf4a':'#2e3105'};width:${progress}%;transition:width 0.3s;"></div>
          </div>
          <input type="range" min="0" max="100" step="5" value="${progress}" style="width:100%;accent-color:#2e3105;cursor:pointer;"
            oninput="document.getElementById('gp-pct-${g.id}').textContent=this.value+'%';document.getElementById('gp-bar-${g.id}').style.width=this.value+'%'"
            onchange="saveGoalProgressBroker('${g.id}',parseInt(this.value))">
        </div>
        <div style="margin-bottom:8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">🎯 Target date</span>
          ${targetDate
            ? `<span style="font-size:11px;font-weight:600;color:${daysLeft!==null&&daysLeft<30?'#854F0B':daysLeft!==null&&daysLeft<90?'#633806':'#444'};">${dateStr}</span><span style="font-size:10px;color:#aaa;">${daysLeft!==null?`(${daysLeft>0?daysLeft+' days':daysLeft===0?'today':'overdue'})`:''}</span><button onclick="document.getElementById('gtd-${g.id}').showPicker?document.getElementById('gtd-${g.id}').showPicker():document.getElementById('gtd-${g.id}').click()" style="font-size:10px;color:#aaa;background:none;border:none;cursor:pointer;padding:0;" title="Change date">✎</button><input id="gtd-${g.id}" type="date" value="${g.target_date||''}" style="width:0;height:0;opacity:0;position:absolute;" onchange="saveGoalProgressBroker('${g.id}',null,this.value)">`
            : `<button class="date-notset" onclick="document.getElementById('gtd-${g.id}').showPicker?document.getElementById('gtd-${g.id}').showPicker():document.getElementById('gtd-${g.id}').click()" title="Set a target date for this goal">Not set</button><input id="gtd-${g.id}" type="date" value="" style="width:0;height:0;opacity:0;position:absolute;" onchange="saveGoalProgressBroker('${g.id}',null,this.value)">`
          }
        </div>
        <div style="font-size:10px;color:#bbb;margin-bottom:6px;">Goal details are editable by the client in their portal.</div>
        <div class="goal-grid">
          ${g.what?`<div class="g5"><div class="g5-l">What</div><div class="g5-v">${esc(g.what)}</div></div>`:''}
          ${g.when_target?`<div class="g5"><div class="g5-l">When</div><div class="g5-v">${esc(g.when_target)}</div></div>`:''}
          ${g.why?`<div class="g5"><div class="g5-l">Why</div><div class="g5-v">${esc(g.why)}</div></div>`:''}
          ${g.where_location?`<div class="g5"><div class="g5-l">Where</div><div class="g5-v">${esc(g.where_location)}</div></div>`:''}
        </div>
        ${g.how?`<div class="goal-how"><div class="g5-l">How</div><div class="g5-v">${esc(g.how)}</div></div>`:''}
      </div>
    </div>`;
  }).join('');
}

function renderNotes() {
  const wrap = document.getElementById('cd-notes');
  if (!cdNotes.length) { wrap.innerHTML='<p class="empty-msg" style="text-align:center;padding:20px 0;">No messages yet.</p>'; return; }
  const cb = {'Portfolio review':'badge-green','Rate update':'badge-blue','Annual review':'badge-amber','Goal update':'badge-grey','Question':'badge-grey','General':'badge-grey'};
  const sorted = [...cdNotes].reverse();
  wrap.innerHTML = sorted.map(n => {
    const isBroker = !!n.is_broker_note;
    const timeStr = new Date(n.created_at).toLocaleString('en-AU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    return `<div class="msg-wrap ${isBroker?'broker-msg':'client-msg'}" id="nc-${n.id}" data-cat="${esc(n.category||'')}">
      ${!isBroker?`<div class="msg-sender">${esc(n.author_name)}</div>`:''}
      <div class="msg-bubble">${esc(n.body)}</div>
      ${n.category?`<span class="badge ${cb[n.category]||'badge-grey'}" style="margin-top:3px;">${esc(n.category)}</span>`:''}
      <div class="msg-meta" style="display:flex;align-items:center;gap:8px;">
        ${timeStr}
        <button style="background:none;border:none;color:#ddd;font-size:14px;cursor:pointer;padding:0;line-height:1;transition:color 0.12s;" onmouseover="this.style.color='#c0321f'" onmouseout="this.style.color='#ddd'" onclick="deleteNote('${n.id}')" title="Delete">&times;</button>
      </div>
    </div>`;
  }).join('');
  wrap.scrollTop = wrap.scrollHeight;
}

function renderAlerts() {
  const wrap = document.getElementById('cd-alerts');
  if (!cdAlerts.length) { wrap.innerHTML='<p class="empty-msg">No active alerts for this client.</p>'; return; }
  wrap.innerHTML = cdAlerts.map(a=>`
    <div class="alert-item ${a.alert_type||'info'}">
      <div class="alert-icon">${a.icon||'ℹ️'}</div>
      <div style="flex:1;"><div class="alert-title">${esc(a.title)}</div><div class="alert-body">${esc(a.body||'')}</div></div>
      <button class="alert-del" onclick="deleteAlert('${a.id}')">&times;</button>
    </div>`).join('');
}

function renderDocs() {
  const wrap = document.getElementById('cd-documents');
  if (!cdDocs.length) { wrap.innerHTML='<p class="empty-msg">No documents yet.</p>'; return; }
  wrap.innerHTML = cdDocs.map(d=>`
    <div class="doc-item" data-cat="${esc(d.category||'Other')}">
      <div class="doc-icon"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="9" height="14" rx="1.5" stroke="#dfe777" stroke-width="1.2"/><path d="M5 5h4M5 7.5h4M5 10h2" stroke="#dfe777" stroke-width="1" stroke-linecap="round"/></svg></div>
      <div style="flex:1;min-width:0;">
        <div class="doc-name">${d.file_url?`<a href="${esc(d.file_url)}" target="_blank" rel="noopener noreferrer" style="color:#1a1f02;text-decoration:none;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${esc(d.name)} ↗</a>`:esc(d.name)}</div>
        <div class="doc-meta">${esc(d.category||'Other')} · ${new Date(d.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}${d.file_size_kb?` · ${(d.file_size_kb/1000).toFixed(1)} MB`:''} · <span style="color:#888;">by ${esc(d.uploaded_by||'Broker')}</span></div>
      </div>
      <button class="doc-del" onclick="deleteDoc('${d.id}')" title="Remove document">&times;</button>
    </div>`).join('');
}

/* ── Filters ── */
function filterDocs(chip) {
  document.querySelectorAll('#doc-chips .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  const cat = chip.dataset.cat;
  document.querySelectorAll('#cd-documents .doc-item').forEach(d=>{
    d.style.display=(cat==='all'||d.dataset.cat===cat)?'flex':'none';
  });
}

/* ── Save helpers ── */
async function saveProp(id,field,value) {
  if(demoGuard())return;
  const {error}=await _sb.from('properties').update({[field]:value}).eq('id',id);
  if(error){showToast('⚠ Save failed: '+error.message);return;}
  const p=cdProps.find(x=>x.id===id); if(p)p[field]=value;
  renderOverview(); showToast('Saved ✓');
}
async function saveLoan(id,field,value) {
  if(demoGuard())return;
  const {error}=await _sb.from('loans').update({[field]:value}).eq('id',id);
  if(error){showToast('⚠ Save failed: '+error.message);return;}
  const l=cdLoans.find(x=>x.id===id); if(l)l[field]=value;
  renderOverview(); showToast('Saved ✓');
}
async function saveGoalProgressBroker(id, progress, targetDate) {
  if(demoGuard())return;
  const updates = {};
  if (progress !== null && progress !== undefined) updates.progress = progress;
  if (targetDate !== undefined) updates.target_date = targetDate || null;
  const {error} = await _sb.from('goals').update(updates).eq('id', id);
  if(error){showToast('⚠ Save failed');return;}
  const g = cdGoals.find(x=>x.id===id);
  if(g){ if(progress!==null&&progress!==undefined) g.progress=progress; if(targetDate!==undefined) g.target_date=targetDate||null; }
  showToast('Saved ✓');
}
async function saveGoalStatus(id,status,sel) {
  if(demoGuard())return;
  const {error}=await _sb.from('goals').update({status}).eq('id',id);
  if(error){showToast('⚠ Save failed: '+error.message);return;}
  const sc={'In progress':'amber','On track':'green','Planning':'grey','Long-term':'grey','Complete':'blue'};
  sel.className='status-sel '+(sc[status]||'grey');
  showToast('Updated ✓');
}
async function saveClientProfile() {
  if(demoGuard())return;
  const updates = {first_name:document.getElementById('cp-first').value,last_name:document.getElementById('cp-last').value,mobile:document.getElementById('cp-mobile').value,client_since:parseInt(document.getElementById('cp-since').value)||null,residential_address:document.getElementById('cp-address').value};
  const {error}=await _sb.from('clients').update(updates).eq('id',currentClient.id);
  if(error){showToast('Error saving');return;}
  Object.assign(currentClient,updates);
  document.getElementById('cd-name').textContent=`${updates.first_name} ${updates.last_name}`;
  showToast('Profile saved ✓');
}
/* ── MFA setup ── */
let _mfaEnrollId = null;

async function loadMfaStatus() {
  const {data} = await _sb.auth.mfa.listFactors();
  const enrolled = data?.totp?.length > 0;
  document.getElementById('btn-setup-mfa').style.display = enrolled ? 'none' : 'inline-flex';
  document.getElementById('mfa-enrolled-msg').style.display = enrolled ? 'flex' : 'none';
  document.getElementById('mfa-setup-area').style.display = 'none';
}

async function startMfaSetup() {
  document.getElementById('btn-setup-mfa').style.display = 'none';
  document.getElementById('mfa-setup-area').style.display = 'block';
  document.getElementById('mfa-enroll-code').value = '';
  document.getElementById('mfa-enroll-error').style.display = 'none';
  const {data, error} = await _sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'JRW Admin' });
  if (error || !data) { showToast('Failed to start 2FA setup'); return; }
  _mfaEnrollId = data.id;
  // Render QR code as an img
  document.getElementById('mfa-qr').innerHTML = `<img src="${data.totp.qr_code}" style="width:160px;height:160px;border-radius:8px;border:3px solid #fff;" alt="QR code">`;
  document.getElementById('mfa-secret').textContent = data.totp.secret;
}

async function confirmMfaEnrollment() {
  const code = document.getElementById('mfa-enroll-code').value.trim();
  if (code.length !== 6) { document.getElementById('mfa-enroll-error').textContent = 'Enter the 6-digit code from your app.'; document.getElementById('mfa-enroll-error').style.display = 'block'; return; }
  const {data: ch} = await _sb.auth.mfa.challenge({ factorId: _mfaEnrollId });
  if (!ch?.id) { document.getElementById('mfa-enroll-error').textContent = 'Challenge failed. Try again.'; document.getElementById('mfa-enroll-error').style.display = 'block'; return; }
  const {error} = await _sb.auth.mfa.verify({ factorId: _mfaEnrollId, challengeId: ch.id, code });
  if (error) { document.getElementById('mfa-enroll-error').textContent = 'Incorrect code — try again.'; document.getElementById('mfa-enroll-error').style.display = 'block'; return; }
  showToast('2FA enabled ✓');
  loadMfaStatus();
}

function cancelMfaSetup() {
  if (_mfaEnrollId) _sb.auth.mfa.unenroll({ factorId: _mfaEnrollId });
  _mfaEnrollId = null;
  loadMfaStatus();
}

async function removeMfa() {
  if (!confirm('Remove 2FA from your account? This will make your account less secure.')) return;
  const {data} = await _sb.auth.mfa.listFactors();
  const factor = data?.totp?.[0];
  if (!factor) return;
  await _sb.auth.mfa.unenroll({ factorId: factor.id });
  showToast('2FA removed');
  loadMfaStatus();
}

async function saveBrokerProfile() {
  if(demoGuard())return;
  const first=document.getElementById('bp-first').value.trim();
  const last=document.getElementById('bp-last').value.trim();
  const name=`${first} ${last}`.trim();
  const updates = {
    name,
    mobile: document.getElementById('bp-mobile').value || null,
    licence_details: document.getElementById('bp-licence').value || null,
  };
  const {error}=await _sb.from('brokers').update(updates).eq('id',currentBroker.id);
  if(error){showToast('Error saving: '+error.message);return;}
  Object.assign(currentBroker, updates);
  setBrokerUI(currentBroker);
  showToast('Profile saved');
}

/* ── Delete helpers ── */
async function deleteProp(id) {
  if(demoGuard())return;
  if(!confirm('Delete this property?'))return;
  const {error}=await _sb.from('properties').delete().eq('id',id);
  if(error){showToast('⚠ Delete failed: '+error.message);return;}
  cdProps=cdProps.filter(p=>p.id!==id); cdLoans=cdLoans.filter(l=>l.property_id!==id);
  renderOverview(); renderPortfolio(); showToast('Property deleted');
}
async function deleteLoan(id) {
  if(demoGuard())return;
  if(!confirm('Delete this loan?'))return;
  const {error}=await _sb.from('loans').delete().eq('id',id);
  if(error){showToast('⚠ Delete failed: '+error.message);return;}
  cdLoans=cdLoans.filter(l=>l.id!==id); renderOverview(); renderPortfolio(); showToast('Loan deleted');
}
async function deleteGoal(id) {
  if(demoGuard())return;
  if(!confirm('Delete this goal?'))return;
  const {error}=await _sb.from('goals').delete().eq('id',id);
  if(error){showToast('⚠ Delete failed: '+error.message);return;}
  cdGoals=cdGoals.filter(g=>g.id!==id); renderPlanning(); showToast('Goal deleted');
}
async function deleteNote(id) {
  if(demoGuard())return;
  if(!confirm('Delete this note?'))return;
  const {error}=await _sb.from('notes').delete().eq('id',id);
  if(error){showToast('⚠ Delete failed: '+error.message);return;}
  cdNotes=cdNotes.filter(n=>n.id!==id); renderNotes(); showToast('Note deleted');
}
async function deleteAlert(id) {
  if(demoGuard())return;
  const {error}=await _sb.from('alerts').update({dismissed:true}).eq('id',id);
  if(error){showToast('⚠ Error dismissing alert: '+error.message);return;}
  cdAlerts=cdAlerts.filter(a=>a.id!==id); renderAlerts(); renderOverview(); showToast('Alert dismissed');
}
async function deleteDoc(id) {
  if(demoGuard())return;
  if(!confirm('Remove this document?'))return;
  const {error}=await _sb.from('documents').delete().eq('id',id);
  if(error){showToast('⚠ Delete failed: '+error.message);return;}
  cdDocs=cdDocs.filter(d=>d.id!==id); renderDocs(); showToast('Document removed');
}

/* ── Add actions ── */
async function createClient() {
  if (demoGuard()) return;
  const first = document.getElementById('nc-first').value.trim();
  const last  = document.getElementById('nc-last').value.trim();
  const email = document.getElementById('nc-email').value.trim();
  if (!first || !last || !email) { showErr('nc-error', 'First name, last name and email are required.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('nc-error', 'Please enter a valid email address.'); return; }
  const btn = document.getElementById('nc-btn');
  const cancelBtn = document.getElementById('nc-cancel-btn');
  btn.textContent = 'Creating account…'; btn.disabled = true; cancelBtn.disabled = true;
  document.getElementById('nc-error').style.display = 'none';
  document.getElementById('nc-success').style.display = 'none';

  try {
    // Get current session token to pass to Edge Function
    const { data: { session } } = await _sb.auth.getSession();
    if (!session) { showErr('nc-error', 'Session expired. Please sign in again.'); btn.textContent = 'Create account & send invite'; btn.disabled = false; cancelBtn.disabled = false; return; }

    const res = await fetch(SUPA_URL + '/functions/v1/create-client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.access_token,
        'apikey': SUPA_KEY,
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        firstName: first,
        lastName: last,
        mobile: document.getElementById('nc-mobile').value.trim() || null,
        address: document.getElementById('nc-address').value.trim() || null,
        clientSince: parseInt(document.getElementById('nc-since').value) || null,
      })
    });
    const result = await res.json();
    btn.textContent = 'Create account & send invite'; btn.disabled = false; cancelBtn.disabled = false;

    if (!res.ok || result.error) {
      showErr('nc-error', result.error || 'Something went wrong. Please try again.');
      return;
    }

    // Show success inside modal, then close after 2s
    const successEl = document.getElementById('nc-success');
    successEl.textContent = result.message;
    successEl.style.display = 'block';
    btn.style.display = 'none';
    setTimeout(async () => {
      closeModal('modal-new-client');
      btn.style.display = '';
      ['nc-first','nc-last','nc-email','nc-mobile','nc-since','nc-address'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      successEl.style.display = 'none';
      await loadAllClients();
    }, 2500);

  } catch (err) {
    btn.textContent = 'Create account & send invite'; btn.disabled = false; cancelBtn.disabled = false;
    showErr('nc-error', 'Network error. Check your connection and try again.');
  }
}
async function addPropertyAndLoan() {
  if(demoGuard())return;
  const address=document.getElementById('apl-address').value.trim();
  if(!address||!currentClient){showErr('apl-error','Address is required.');return;}
  const propData={client_id:currentClient.id,broker_id:currentBroker?.id||null,address,suburb:document.getElementById('apl-suburb').value||null,state:document.getElementById('apl-state').value,postcode:document.getElementById('apl-postcode').value||null,property_type:document.getElementById('apl-type').value,ownership_type:document.getElementById('apl-ownership').value,estimated_value:parseFloat(document.getElementById('apl-value').value)||null,weekly_rent:parseFloat(document.getElementById('apl-rent').value)||null,listing_url:document.getElementById('apl-url').value||null,photo_url:document.getElementById('apl-photo-url').value||null};
  const {data:prop,error}=await _sb.from('properties').insert(propData).select().single();
  if(error){showErr('apl-error',error.message);return;}
  cdProps.push(prop);
  const lender=document.getElementById('apl-lender').value.trim(), balance=parseFloat(document.getElementById('apl-balance').value);
  if(lender||balance){
    const rate=parseFloat(document.getElementById('apl-rate').value)||0;
    const {data:loan}=await _sb.from('loans').insert({client_id:currentClient.id,broker_id:currentBroker?.id||null,property_id:prop.id,lender:lender||null,loan_balance:balance||null,interest_rate:rate/100,rate_type:document.getElementById('apl-rate-type').value,fixed_expiry_date:document.getElementById('apl-fixed-expiry').value||null,loan_type:document.getElementById('apl-loan-type').value,monthly_repayment:parseFloat(document.getElementById('apl-repayment').value)||null,lvr:parseFloat(document.getElementById('apl-lvr').value)||null,next_review_date:document.getElementById('apl-review-date').value||null}).select().single();
    if(loan) cdLoans.push(loan);
  }
  renderOverview(); renderPortfolio();
  closeModal('modal-add-property-loan');
  ['apl-address','apl-suburb','apl-postcode','apl-value','apl-rent','apl-url','apl-photo-url','apl-lender','apl-balance','apl-rate','apl-fixed-expiry','apl-repayment','apl-lvr','apl-review-date'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('apl-photo-preview').style.display='none';
  showToast('Property added ✓');
}
async function publishNote() {
  if(demoGuard())return;
  const text=document.getElementById('note-text').value.trim(); if(!text||!currentClient)return;
  const name=currentBroker?.name||'James Wilson';
  const ini=name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  const {data,error}=await _sb.from('notes').insert({client_id:currentClient.id,author_name:name,author_initials:ini,category:document.getElementById('note-cat').value||null,body:text,is_broker_note:true}).select().single();
  if(error){showToast('Error: '+error.message);return;}
  cdNotes.unshift(data); renderNotes();
  document.getElementById('note-text').value=''; document.getElementById('note-cat').value='';
}

async function handleBrokerDocUpload(input) {
  if(demoGuard())return;
  if(!currentClient)return;
  const files=Array.from(input.files||[]);
  if(!files.length)return;
  const statusEl=document.getElementById('broker-doc-status');
  statusEl.style.display='block';
  let uploaded=0;
  for(const file of files){
    statusEl.textContent=`Uploading ${file.name}…`;
    const path=`${currentClient.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
    const {error:upErr}=await _sb.storage.from('client-documents').upload(path,file,{upsert:false});
    if(upErr){showToast(`Upload failed: ${upErr.message}`);continue;}
    const {data:signed}=await _sb.storage.from('client-documents').createSignedUrl(path,60*60*24*365);
    const fileUrl=signed?.signedUrl||null;
    const sizekb=Math.round(file.size/1024);
    const {data:doc,error:dbErr}=await _sb.from('documents').insert({client_id:currentClient.id,broker_id:currentBroker?.id||null,name:file.name,category:'Other',file_url:fileUrl,file_size_kb:sizekb,uploaded_by:currentBroker?.name||'James Wilson'}).select().single();
    if(dbErr){showToast(`Save failed: ${dbErr.message}`);continue;}
    cdDocs.unshift(doc); uploaded++;
  }
  statusEl.style.display='none';
  if(input.value!==undefined)input.value='';
  if(uploaded){renderDocs();showToast(`${uploaded} file${uploaded>1?'s':''} uploaded ✓`);}
}
async function addGoal() {
  if(demoGuard())return;
  const title=document.getElementById('ag-title').value.trim(); if(!title||!currentClient)return;
  const {data,error}=await _sb.from('goals').insert({client_id:currentClient.id,broker_id:currentBroker?.id||null,title,status:document.getElementById('ag-status').value,what:document.getElementById('ag-what').value||null,when_target:document.getElementById('ag-when').value||null,why:document.getElementById('ag-why').value||null,where_location:document.getElementById('ag-where').value||null,how:document.getElementById('ag-how').value||null,sort_order:cdGoals.length,target_date:document.getElementById('ag-target-date').value||null,progress:parseInt(document.getElementById('ag-progress').value)||0}).select().single();
  if(error){showToast('Error: '+error.message);return;}
  cdGoals.push(data); renderPlanning(); closeModal('modal-add-goal');
  document.getElementById('ag-target-date').value=''; document.getElementById('ag-progress').value=0; document.getElementById('ag-progress-val').textContent='0%';
  showToast('Goal added ✓');
}
async function addAlert() {
  if(demoGuard())return;
  const title=document.getElementById('aa-title').value.trim(); if(!title||!currentClient)return;
  const {data,error}=await _sb.from('alerts').insert({client_id:currentClient.id,title,body:document.getElementById('aa-body').value||null,alert_type:document.getElementById('aa-type').value,icon:document.getElementById('aa-icon').value||null,dismissed:false}).select().single();
  if(error){showToast('Error: '+error.message);return;}
  cdAlerts.unshift(data); renderAlerts(); renderOverview(); closeModal('modal-add-alert'); showToast('Alert sent ✓');
}
async function addDocument() {
  if(demoGuard())return;
  const name=document.getElementById('ad-name').value.trim(); if(!name||!currentClient)return;
  const {data,error}=await _sb.from('documents').insert({client_id:currentClient.id,name,category:document.getElementById('ad-cat').value,file_url:document.getElementById('ad-url').value||null,file_size_kb:parseInt(document.getElementById('ad-size').value)||null,uploaded_by:currentBroker?.name||'James Wilson'}).select().single();
  if(error){showToast('Error: '+error.message);return;}
  cdDocs.unshift(data); renderDocs(); closeModal('modal-add-document'); showToast('Document added ✓');
}
async function loadAuditLog() {
  if(demoGuard())return;
  _auditLoaded = true;
  const wrap=document.getElementById('cd-audit'); wrap.innerHTML='<p class="empty-msg">Loading…</p>';
  const {data}=await _sb.from('audit_log').select('*').eq('client_id',currentClient.id).order('created_at',{ascending:false}).limit(100);
  if(!data?.length){wrap.innerHTML='<p class="empty-msg">No audit entries yet.</p>';return;}
  const actionLabel = {
    INSERT: { icon:'➕', colour:'#27500A', bg:'#EAF3DE', label: t => `Added ${_tableLabel(t)}` },
    UPDATE: { icon:'✏️', colour:'#0C447C', bg:'#E6F1FB', label: t => `Updated ${_tableLabel(t)}` },
    DELETE: { icon:'🗑️', colour:'#8b1a1a', bg:'#fdf0f0', label: t => `Deleted ${_tableLabel(t)}` },
    LOGIN:  { icon:'🔑', colour:'#555',    bg:'#f5f5f0', label: () => 'Logged in' },
    LOGOUT: { icon:'🚪', colour:'#555',    bg:'#f5f5f0', label: () => 'Logged out' },
    INVITE: { icon:'📧', colour:'#633806', bg:'#FAEEDA', label: () => 'Invite sent' },
  };
  function _tableLabel(t){ return ({alerts:'alert',notes:'note',documents:'document',properties:'property',loans:'loan',goals:'goal',clients:'client profile',research:'research card'})[t]||t; }
  function _summary(e) {
    const nv = e.new_values||{}; const ov = e.old_values||{};
    if (e.action==='UPDATE' && e.table_name==='notes') return nv.body ? `"${String(nv.body).slice(0,60)}${nv.body.length>60?'…':''}"` : '';
    if (e.action==='UPDATE' && e.table_name==='goals') return nv.status ? `Status → ${nv.status}` : nv.progress!=null ? `Progress → ${nv.progress}%` : '';
    if (e.action==='UPDATE' && e.table_name==='loans') { const k=Object.keys(nv)[0]; return k ? `${k.replace(/_/g,' ')} updated` : ''; }
    if (e.action==='INSERT' && e.table_name==='alerts') return nv.title ? `"${esc(nv.title)}"` : '';
    if (e.action==='INSERT' && e.table_name==='notes') return nv.body ? `"${String(nv.body).slice(0,60)}${nv.body.length>60?'…':''}"` : '';
    if (e.action==='INSERT' && e.table_name==='properties') return nv.address ? esc(nv.address) : '';
    return '';
  }
  wrap.innerHTML = data.map(e => {
    const a = actionLabel[e.action] || {icon:'•',colour:'#888',bg:'#f5f5f0',label:t=>e.action+' '+t};
    const timeStr = new Date(e.created_at).toLocaleString('en-AU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    const summary = _summary(e);
    return `<div class="audit-row" style="display:flex;align-items:flex-start;gap:10px;">
      <div style="width:28px;height:28px;border-radius:7px;background:${a.bg};display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">${a.icon}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="font-size:12px;font-weight:600;color:${a.colour};">${a.label(e.table_name||'')}</span>
          <span class="badge ${e.actor_role==='broker'?'badge-blue':'badge-grey'}" style="font-size:9px;">${e.actor_role||'?'}</span>
        </div>
        ${summary?`<div style="font-size:11px;color:#666;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${summary}</div>`:''}
        <div style="font-size:10px;color:#bbb;margin-top:2px;">${timeStr}${e.actor_email?` · ${esc(e.actor_email)}`:''}</div>
      </div>
    </div>`;
  }).join('');
}

/* ── Navigation ── */
function switchTab(tab, el) {
  showContentSpinner();
  document.querySelectorAll('.cd-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('tab-'+tab)?.classList.add('active');
  document.querySelectorAll('.cd-link').forEach(l=>l.classList.remove('active'));
  if(el) el.classList.add('active');
  document.getElementById('cd-main').scrollTop=0;
  // Auto-load audit log on first open
  if (tab === 'auditlog' && currentClient && !isDemoMode && !_auditLoaded) loadAuditLog();
  setTimeout(hideContentSpinner,150);
}
function goToDashboard() {
  document.getElementById('view-client').style.display='none';
  document.getElementById('view-broker-settings').style.display='none';
  document.getElementById('view-master-admin').style.display='none';
  document.getElementById('view-dashboard').style.display='block';
  
  document.getElementById('tb-brand-wrap').classList.remove('hidden');
  document.getElementById('tb-sep-brand').classList.remove('hidden');
  document.getElementById('cd-sb-tb-toggle').style.display='none';
  const _crumb = document.getElementById('tb-crumb'); _crumb.textContent='All Clients'; _crumb.style.cursor='default';
  currentClient=null;
  cdProps=[]; cdLoans=[]; cdGoals=[]; cdNotes=[]; cdAlerts=[]; cdDocs=[]; _auditLoaded=false;
  // Reset sidebar for next client
  const cdSb = document.getElementById('cd-sb');
  if (cdSb) cdSb.classList.remove('collapsed');
}

let _prevView = 'dashboard'; // track where user opened settings from
function openBrokerSettings() {
  loadMfaStatus();
  document.getElementById('broker-pp').classList.remove('open');
  // Remember where we came from
  _prevView = (currentClient) ? 'client' : 'dashboard';
  const backLabel = document.getElementById('settings-back-label');
  if (backLabel) {
    backLabel.textContent = currentClient
      ? `${currentClient.first_name||''} ${currentClient.last_name||''}`.trim() || 'Client'
      : 'All Clients';
  }
  document.getElementById('view-dashboard').style.display='none';
  document.getElementById('view-client').style.display='none';
  document.getElementById('view-broker-settings').style.display='flex';
  document.getElementById('view-broker-settings').style.flexDirection='column';
  document.getElementById('tb-brand-wrap').classList.add('hidden');
  document.getElementById('tb-sep-brand').classList.add('hidden');
  document.getElementById('cd-sb-tb-toggle').style.display='none';
  document.getElementById('tb-crumb').textContent='My Profile';
}
function goBackFromSettings() {
  document.getElementById('view-broker-settings').style.display='none';
  if (_prevView === 'client' && currentClient) {
    document.getElementById('view-client').style.display='flex';
    document.getElementById('tb-brand-wrap').classList.add('hidden');
    document.getElementById('tb-sep-brand').classList.add('hidden');
    document.getElementById('cd-sb-tb-toggle').style.display='flex';
    const cname = `${currentClient.first_name||''} ${currentClient.last_name||''}`.trim();
    document.getElementById('tb-crumb').textContent = cname;
  } else {
    goToDashboard();
  }
}
function openNewClientModal() { openModal('modal-new-client'); }

/* ── Sidebar toggles ── */

function toggleCdSb() {
  const sb=document.getElementById('cd-sb');
  sb.classList.toggle('collapsed');
  if(!sb.classList.contains('collapsed')) sb.classList.add('open');
}
// cd-sb-toggle removed - toggle only via topbar button
document.getElementById('cd-sb-tb-toggle').addEventListener('click', toggleCdSb);

/* ── Profile dropdown ── */
document.getElementById('broker-avatar').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('broker-pp').classList.toggle('open');
});
document.addEventListener('click', () => document.getElementById('broker-pp').classList.remove('open'));
document.getElementById('broker-pp').addEventListener('click', e => e.stopPropagation());
document.getElementById('pp-signout-btn').addEventListener('click', () => {
  isDemoMode=false; currentBroker=null; allClients=[]; currentClient=null;
  _sb.auth.signOut();
  showLoginScreen();
});

/* ── Login/logout ── */
document.getElementById('btn-login').addEventListener('click', doLogin);
document.getElementById('login-password').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });
document.getElementById('btn-signout').addEventListener('click', () => { isDemoMode=false; currentBroker=null; allClients=[]; currentClient=null; _sb.auth.signOut(); showLoginScreen(); });
let _mfaFactorId = null;

async function doLogin() {
  const email=document.getElementById('login-email').value.trim(), pw=document.getElementById('login-password').value;
  if(!email||!pw){showLoginError('Enter your email and password.');return;}
  const btn=document.getElementById('btn-login'); btn.textContent='Signing in…'; btn.disabled=true;
  const {data, error}=await _sb.auth.signInWithPassword({email,password:pw});
  btn.textContent='Sign in as broker'; btn.disabled=false;
  if(error){showLoginError(error.message||'Incorrect email or password.');return;}
  // Check if MFA is required
  const {data: aal}=await _sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if(aal && aal.nextLevel==='aal2' && aal.nextLevel!==aal.currentLevel){
    const {data: factors}=await _sb.auth.mfa.listFactors();
    const totp=factors?.totp?.[0];
    if(totp){ _mfaFactorId=totp.id; showMfaScreen(); return; }
  }
  // No MFA required — auth state change will handle the rest
}

function showMfaScreen(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('broker-forgot-screen').style.display='none';
  document.getElementById('broker-mfa-screen').style.display='flex';
  document.getElementById('mfa-code').value='';
  document.getElementById('mfa-error').style.display='none';
  setTimeout(()=>document.getElementById('mfa-code').focus(), 100);
}

async function submitMfaCode(){
  const code=document.getElementById('mfa-code').value.trim();
  if(code.length!==6){document.getElementById('mfa-error').textContent='Enter the 6-digit code.';document.getElementById('mfa-error').style.display='block';return;}
  const btn=document.getElementById('btn-mfa-submit'); btn.textContent='Verifying…'; btn.disabled=true;
  const {data:ch}=await _sb.auth.mfa.challenge({factorId:_mfaFactorId});
  if(!ch?.id){btn.textContent='Verify';btn.disabled=false;document.getElementById('mfa-error').textContent='Challenge failed. Try again.';document.getElementById('mfa-error').style.display='block';return;}
  const {error}=await _sb.auth.mfa.verify({factorId:_mfaFactorId,challengeId:ch.id,code});
  btn.textContent='Verify'; btn.disabled=false;
  if(error){document.getElementById('mfa-error').textContent='Incorrect code. Try again.';document.getElementById('mfa-error').style.display='block';return;}
  document.getElementById('broker-mfa-screen').style.display='none';
  // Auth state change fires automatically after verify
}

// Also trigger verify on Enter key
document.getElementById('mfa-code').addEventListener('keydown',e=>{if(e.key==='Enter')submitMfaCode();});

/* ── Demo mode ── */
function loadBrokerDemoData() {
  isDemoMode=true;
  currentBroker={id:'demo-br',name:'James Wilson',email:'jrwfinancegroup@gmail.com',mobile:'0400 000 000'};
  allClients=JSON.parse(JSON.stringify(DEMO_CLIENTS));
  setBrokerUI(currentBroker);
  renderDashboard();
  showDashboard();
}
function demoGuard() {
  if(isDemoMode){showToast('Demo mode – changes aren\'t saved');return true;}
  return false;
}

/* ── Modal helpers ── */
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
  // Reset error/success states
  const errEl = document.getElementById('nc-error');
  const sucEl = document.getElementById('nc-success');
  const aplErr = document.getElementById('apl-error');
  if(errEl) { errEl.style.display='none'; errEl.textContent=''; }
  if(sucEl) { sucEl.style.display='none'; }
  if(aplErr) { aplErr.style.display='none'; aplErr.textContent=''; }
  // Clear new client fields on open so stale data doesn't show
  if(id === 'modal-new-client') {
    ['nc-first','nc-last','nc-email','nc-mobile','nc-since','nc-address'].forEach(fid => {
      const el = document.getElementById(fid); if(el) el.value='';
    });
    const btn = document.getElementById('nc-btn');
    if(btn) { btn.style.display=''; btn.disabled=false; btn.textContent='Create account & send invite'; }
    const cBtn = document.getElementById('nc-cancel-btn');
    if(cBtn) cBtn.disabled=false;
  }
}
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if(e.target===o) o.classList.remove('open'); }));
// ESC closes any open modal and the profile dropdown
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
    document.getElementById('broker-pp')?.classList.remove('open');
  }
});

/* ── Photo helpers ── */
function previewPropPhoto(input) {
  const file=input.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    document.getElementById('apl-photo-img').src=e.target.result;
    document.getElementById('apl-photo-preview').style.display='block';
    document.getElementById('apl-photo-url').placeholder=file.name+' (local preview only)';
  };
  reader.readAsDataURL(file);
}
async function handleBrokerPhotoUpload(input) {
  const file = input.files[0]; if(!file) return;
  if (file.size > 1024 * 1024) { showToast('Photo must be under 1 MB'); input.value=''; return; }
  if (!file.type.startsWith('image/')) { showToast('Please choose an image file'); input.value=''; return; }
  // Optimistic local preview
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('broker-photo-preview').innerHTML = `<img src="${e.target.result}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
  };
  reader.readAsDataURL(file);
  if (demoGuard()) { input.value=''; return; }
  // Upload to Supabase Storage at <uid>/avatar (matches storage RLS policy)
  const path = `${currentBroker.id}/avatar`;
  const { error: upErr } = await _sb.storage.from('profile-photos').upload(path, file, { upsert: true, cacheControl: '0', contentType: file.type });
  if (upErr) { showToast('Upload failed: ' + upErr.message); input.value=''; return; }
  const { data: { publicUrl } } = _sb.storage.from('profile-photos').getPublicUrl(path);
  const photoUrl = `${publicUrl}?v=${Date.now()}`;
  const { error: dbErr } = await _sb.from('brokers').update({ photo_url: photoUrl }).eq('id', currentBroker.id);
  if (dbErr) { showToast('Saved photo but couldn\'t update profile: ' + dbErr.message); return; }
  currentBroker.photo_url = photoUrl;
  setBrokerUI(currentBroker);
  input.value = '';
  showToast('Photo updated');
}

/* ── Display helpers ── */
function showLoading() { document.getElementById('loading-overlay').style.display='flex'; document.getElementById('app').style.display='none'; document.getElementById('login-screen').style.display='none'; document.getElementById('broker-forgot-screen').style.display='none'; document.getElementById('broker-reset-screen').style.display='none'; document.getElementById('broker-signup-screen').style.display='none'; document.getElementById('broker-mfa-screen').style.display='none'; }
function showDashboard() { document.getElementById('loading-overlay').style.display='none'; document.getElementById('app').style.display='flex'; document.getElementById('login-screen').style.display='none'; document.getElementById('broker-forgot-screen').style.display='none'; document.getElementById('broker-reset-screen').style.display='none'; document.getElementById('view-dashboard').style.display='block'; document.getElementById('view-client').style.display='none'; document.getElementById('view-broker-settings').style.display='none'; document.getElementById('view-master-admin').style.display='none'; document.getElementById('tb-crumb').textContent='All Clients'; }
function showLoginScreen() { document.getElementById('loading-overlay').style.display='none'; document.getElementById('app').style.display='none'; document.getElementById('broker-forgot-screen').style.display='none'; document.getElementById('broker-reset-screen').style.display='none'; document.getElementById('broker-signup-screen').style.display='none'; document.getElementById('broker-mfa-screen').style.display='none'; document.getElementById('login-screen').style.display='flex'; }
function showContentSpinner() { document.getElementById('content-spinner').classList.add('active'); }
function hideContentSpinner() { document.getElementById('content-spinner').classList.remove('active'); }
function showLoginError(msg) { const el=document.getElementById('login-error'); el.textContent=msg||'Incorrect email or password.'; el.style.display='block';   el.style.color='#c0321f';
}
function showBrokerForgotScreen() {
  // Pre-fill email if already typed on login screen
  const loginEmail = document.getElementById('login-email').value.trim();
  if (loginEmail) document.getElementById('forgot-email-broker').value = loginEmail;
  // Reset message
  const msg = document.getElementById('forgot-broker-msg');
  msg.style.display = 'none'; msg.textContent = '';
  const btn = document.getElementById('btn-send-broker-reset');
  btn.textContent = 'Send reset link'; btn.disabled = false;
  // Hide all other screens
  document.getElementById('loading-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('broker-reset-screen').style.display = 'none';
  document.getElementById('broker-forgot-screen').style.display = 'flex';
}
function hideBrokerForgotScreen() {
  document.getElementById('broker-forgot-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
}
async function sendBrokerPasswordReset() {
  const email = document.getElementById('forgot-email-broker').value.trim();
  const msg = document.getElementById('forgot-broker-msg');
  const btn = document.getElementById('btn-send-broker-reset');
  if (!email) { msg.textContent = 'Please enter your email address.'; msg.style.color = '#f0a080'; msg.style.display = 'block'; return; }
  btn.textContent = 'Sending…'; btn.disabled = true;
  const redirectBase = window.location.hostname === 'admin.jrwfinance.com.au'
    ? 'https://admin.jrwfinance.com.au'
    : 'https://jrw-broker-admin.netlify.app';
  const { error } = await _sb.auth.resetPasswordForEmail(email, { redirectTo: redirectBase });
  btn.textContent = 'Send reset link'; btn.disabled = false;
  if (error) { msg.textContent = error.message; msg.style.color = '#f0a080'; msg.style.display = 'block'; return; }
  msg.textContent = '✓ Reset link sent! Check your inbox.';
  msg.style.color = '#a8d870';
  msg.style.display = 'block';
  btn.textContent = 'Resend link';
}
function showErr(id, msg) { const el=document.getElementById(id); if(el){el.textContent=msg;el.style.display='block';} }

/* ── Utility ── */
function _reviewDateCell(loanId, value) {
  const inputId = `nrd-${loanId}`;
  const save = `(async()=>{const v=document.getElementById('${inputId}').value;await saveLoan('${loanId}','next_review_date',v||null);document.getElementById('nrd-cell-${loanId}').innerHTML=_reviewDateCell('${loanId}',v||null);})()`;
  if (value) {
    const d = new Date(value);
    const label = d.toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'});
    return `<span style="font-size:11px;font-weight:500;">${label}</span>&nbsp;<button onclick="document.getElementById('${inputId}').showPicker?document.getElementById('${inputId}').showPicker():document.getElementById('${inputId}').click()" style="font-size:10px;color:#aaa;background:none;border:none;cursor:pointer;padding:0 2px;" title="Change date">✎</button><input id="${inputId}" type="date" value="${value}" style="width:0;height:0;opacity:0;position:absolute;" onchange="${save}">`;
  }
  return `<button class="date-notset" onclick="document.getElementById('${inputId}').showPicker?document.getElementById('${inputId}').showPicker():document.getElementById('${inputId}').click()" title="Set review date — client gets a 60-day alert">Not set</button><input id="${inputId}" type="date" value="" style="width:0;height:0;opacity:0;position:absolute;" onchange="${save}">`;
}
function _timeAgo(date) {
  const s = Math.round((Date.now() - date) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  if (s < 86400*7) return Math.floor(s/86400) + 'd ago';
  return date.toLocaleDateString('en-AU',{day:'numeric',month:'short'});
}
function fmt(n){if(!n)return '$0';return'$'+Math.round(n).toLocaleString('en-AU');}
function fmtShort(n){if(!n)return'$0';if(n>=1000000)return'$'+(n/1000000).toFixed(1)+'M';if(n>=1000)return'$'+Math.round(n/1000)+'k';return'$'+Math.round(n);}
function parseCurrency(s){return parseFloat(String(s||'').replace(/[^0-9.]/g,''))||0;}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function showToast(msg){const t=document.createElement('div');t.textContent=msg;t.setAttribute('role','status');t.setAttribute('aria-live','polite');t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2e3105;color:#dfe777;padding:9px 20px;border-radius:8px;font-size:12px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.15);pointer-events:none;white-space:nowrap;max-width:90vw;overflow:hidden;text-overflow:ellipsis;';document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity 0.4s';setTimeout(()=>t.remove(),400);},2200);}

/* ── Broker password reset ── */
function showBrokerPasswordResetScreen() {
  document.getElementById('loading-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('broker-reset-screen').style.display = 'flex';
}
async function setBrokerNewPassword() {
  const newPw = document.getElementById('br-new-password').value;
  const confirmPw = document.getElementById('br-confirm-password').value;
  const errEl = document.getElementById('br-reset-error');
  errEl.style.display = 'none';
  if (!newPw || newPw.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; errEl.style.display = 'block'; return; }
  if (newPw !== confirmPw) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
  const btn = document.getElementById('br-btn-set-password');
  btn.textContent = 'Saving…'; btn.disabled = true;
  // Signal to onAuthStateChange that the next SIGNED_IN or USER_UPDATED
  // is the post-save event — not the initial page-load SIGNED_IN.
  _passwordJustSaved = true;
  const { error } = await _sb.auth.updateUser({ password: newPw });
  if (error) {
    _passwordJustSaved = false;
    errEl.textContent = error.message;
    errEl.style.display = 'block';
    btn.textContent = 'Set new password';
    btn.disabled = false;
    return;
  }
  // Hide reset screen, show spinner — onAuthStateChange drives the rest
  document.getElementById('broker-reset-screen').style.display = 'none';
  document.getElementById('loading-overlay').style.display = 'flex';
  showToast('Password updated! Logging you in…');
  // Safety fallback: if auth events don’t fire within 5s, force a clean reload
  setTimeout(() => {
    if (_passwordJustSaved || _passwordResetMode) window.location.reload();
  }, 5000);
}

/* ── Session timeout (30 min) ── */
let _timer;
['click','keydown','mousemove','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{clearTimeout(_timer);_timer=setTimeout(async()=>{if(isDemoMode)return;await _sb.auth.signOut();},30*60*1000);},{passive:true}));

/* ── Master admin ── */
function openMasterAdmin() {
  document.getElementById('broker-pp').classList.remove('open');
  document.getElementById('view-dashboard').style.display='none';
  document.getElementById('view-client').style.display='none';
  document.getElementById('view-broker-settings').style.display='none';
  document.getElementById('view-master-admin').style.display='flex';
  document.getElementById('view-master-admin').style.flexDirection='column';
  document.getElementById('tb-brand-wrap').classList.add('hidden');
  document.getElementById('tb-sep-brand').classList.add('hidden');
  document.getElementById('cd-sb-tb-toggle').style.display='none';
  document.getElementById('tb-crumb').textContent='Master Admin';
}
function generateClientLink() {
  const first = document.getElementById('inv-first').value.trim();
  const last  = document.getElementById('inv-last').value.trim();
  const email = document.getElementById('inv-email').value.trim();
  const mobile= document.getElementById('inv-mobile').value.trim();
  const since = document.getElementById('inv-since').value.trim();
  if (!email) { showToast('Enter at least an email address'); return; }
  const base = window.location.hostname === 'admin.jrwfinance.com.au'
    ? 'https://portal.jrwfinance.com.au'
    : 'https://jrw-portal.netlify.app';
  const params = new URLSearchParams({ invite:'client' });
  if (first) params.set('first', first);
  if (last)  params.set('last', last);
  if (email) params.set('email', email);
  if (mobile) params.set('mobile', mobile);
  if (since) params.set('since', since);
  document.getElementById('inv-link-text').value = `${base}/?${params.toString()}`;
  document.getElementById('inv-link-out').style.display = 'block';
}
function generateBrokerLink() {
  const name  = document.getElementById('binv-name').value.trim();
  const email = document.getElementById('binv-email').value.trim();
  if (!email) { showToast('Enter at least an email address'); return; }
  const base = window.location.hostname === 'admin.jrwfinance.com.au'
    ? 'https://admin.jrwfinance.com.au'
    : 'https://jrw-broker-admin.netlify.app';
  const params = new URLSearchParams({ invite:'broker' });
  if (name)  params.set('name', name);
  if (email) params.set('email', email);
  document.getElementById('binv-link-text').value = `${base}/?${params.toString()}`;
  document.getElementById('binv-link-out').style.display = 'block';
}
function copyInviteLink(inputId) {
  const el = document.getElementById(inputId);
  el.select();
  navigator.clipboard.writeText(el.value).then(() => showToast('Link copied!')).catch(() => showToast('Select and copy the link manually'));
}

/* ── Broker signup (invite link flow) ── */
function showBrokerSignupScreen(params) {
  if (params.get('name'))  {
    const parts = (params.get('name')||'').split(' ');
    document.getElementById('bsign-first').value = parts[0]||'';
    document.getElementById('bsign-last').value  = parts.slice(1).join(' ')||'';
  }
  if (params.get('email'))  document.getElementById('bsign-email').value  = params.get('email');
  if (params.get('mobile')) document.getElementById('bsign-mobile').value = params.get('mobile');
  document.getElementById('loading-overlay').style.display='none';
  document.getElementById('login-screen').style.display='none';
  document.getElementById('broker-signup-screen').style.display='flex';
}
async function submitBrokerSignup() {
  const first  = document.getElementById('bsign-first').value.trim();
  const last   = document.getElementById('bsign-last').value.trim();
  const email  = document.getElementById('bsign-email').value.trim();
  const mobile = document.getElementById('bsign-mobile').value.trim();
  const pw     = document.getElementById('bsign-pw').value;
  const pw2    = document.getElementById('bsign-pw2').value;
  const msg    = document.getElementById('bsign-msg');
  const btn    = document.getElementById('btn-bsign');
  msg.style.display='none';
  if (!email || !pw) { msg.textContent='Please fill in all required fields.'; msg.style.color='#f0a080'; msg.style.display='block'; return; }
  if (pw.length < 8) { msg.textContent='Password must be at least 8 characters.'; msg.style.color='#f0a080'; msg.style.display='block'; return; }
  if (pw !== pw2)    { msg.textContent='Passwords do not match.'; msg.style.color='#f0a080'; msg.style.display='block'; return; }
  btn.textContent='Creating account…'; btn.disabled=true;
  const { data, error } = await _sb.auth.signUp({ email, password: pw });
  if (error) { msg.textContent=error.message; msg.style.color='#f0a080'; msg.style.display='block'; btn.textContent='Create account'; btn.disabled=false; return; }
  // Insert broker record
  if (data.user) {
    await _sb.from('brokers').insert({ id: data.user.id, email, name: `${first} ${last}`.trim(), mobile });
  }
  msg.textContent='✓ Account created! Check your email to confirm, then sign in.';
  msg.style.color='#a8d870'; msg.style.display='block';
  btn.textContent='Done'; btn.disabled=true;
  setTimeout(() => { document.getElementById('broker-signup-screen').style.display='none'; showLoginScreen(); }, 3000);
}

/* ── Detect invite link on page load ── */
(function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('invite') === 'broker') {
    // Show signup screen immediately, before auth events fire
    document.addEventListener('DOMContentLoaded', () => showBrokerSignupScreen(params));
    // Also handle if DOM already loaded
    if (document.readyState !== 'loading') showBrokerSignupScreen(params);
  }
})();

/* ── Back/forward cache fix — recover from frozen loading state ── */
window.addEventListener('pageshow', function(e) {
  if (e.persisted && document.getElementById('loading-overlay').style.display === 'flex') {
    _appLoading = false;
    _sb.auth.getSession().then(({ data: { session } }) => {
      if (session && !isDemoMode) _loadBrokerApp(session);
      else if (!isDemoMode) showLoginScreen();
    });
  }
});
