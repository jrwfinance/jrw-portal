import { createClient } from '@supabase/supabase-js';
import Chart from 'chart.js/auto';
import './style.css';

/* ── DEMO MODE ── bypass Supabase auth for UI testing ──────────── */
const DEMO_CLIENT = {
  id:'demo-client-001', first_name:'Alex', last_name:'Demo',
  email:'testclient@jrwfinance.com.au', mobile:'0400 000 001',
  residential_address:'42 Test Street, Brisbane QLD 4000',
  broker_name:'James Wilson', broker_email:'jrwfinancegroup@gmail.com',
  client_since:2023, photo_url:null
};
const DEMO_PROPERTIES = [{
  id:'prop-001', client_id:'demo-client-001',
  address:'42 Test Street', suburb:'Brisbane', state:'QLD', postcode:'4000',
  property_type:'House', ownership_type:'PPOR', estimated_value:850000,
  weekly_rent:null, photo_url:null
},{
  id:'prop-002', client_id:'demo-client-001',
  address:'18 Elm Road', suburb:'New Farm', state:'QLD', postcode:'4005',
  property_type:'Apartment', ownership_type:'Investment', estimated_value:620000,
  weekly_rent:620, photo_url:null
}];
const DEMO_LOANS = [{
  id:'loan-001', client_id:'demo-client-001', property_id:'prop-001',
  lender:'Commonwealth Bank', loan_balance:595000, interest_rate:0.0589,
  rate_type:'fixed', fixed_expiry_date:new Date(Date.now()+120*86400000).toISOString().split('T')[0],
  loan_type:'P&I', monthly_repayment:3890, lvr:70
},{
  id:'loan-002', client_id:'demo-client-001', property_id:'prop-002',
  lender:'ANZ', loan_balance:410000, interest_rate:0.0612,
  rate_type:'variable', fixed_expiry_date:null,
  loan_type:'IO', monthly_repayment:2090, lvr:66
}];
const DEMO_GOALS = [{
  id:'goal-001', client_id:'demo-client-001', title:'Refinance before fixed rate expires',
  status:'In progress', what:'Refinance CBA loan to a better rate',
  when_target:'Complete 8 weeks before expiry', why:'Save $3k–$5k per year',
  where_location:'42 Test Street, Brisbane QLD',
  how:'Compare 3 lenders → broker presents options → lodge application', sort_order:0
},{
  id:'goal-002', client_id:'demo-client-001', title:'Purchase third investment property',
  status:'Planning', what:'Buy a 2-bed apartment in inner Brisbane',
  when_target:'Settlement by mid-2027', why:'Build passive income stream',
  where_location:'Inner Brisbane – Fortitude Valley or Newstead',
  how:'Use equity from PPOR + New Farm apartment to fund 20% deposit', sort_order:1
}];
const DEMO_NOTES = [{
  id:'note-001', client_id:'demo-client-001', created_at:new Date(Date.now()-2*86400000).toISOString(),
  author_name:'James Wilson', author_initials:'JW', category:'Portfolio review',
  body:'Welcome to the JRW Finance client portal, Alex. Your portfolio is looking strong – your PPOR equity has grown nicely. Fixed rate review coming up, I\'ve flagged that as a goal.',
  is_broker_note:true
},{
  id:'note-002', client_id:'demo-client-001', created_at:new Date(Date.now()-86400000).toISOString(),
  author_name:'Alex Demo', author_initials:'AD', category:'Question',
  body:'Hi James – should I be considering fixing the ANZ loan too given where rates are heading?',
  is_broker_note:false
}];
const DEMO_ALERTS = [{
  id:'alert-001', client_id:'demo-client-001', created_at:new Date().toISOString(),
  title:'Fixed rate expiry approaching', alert_type:'urgent', icon:'⏰', dismissed:false,
  body:'Your CBA loan at 42 Test Street comes off its fixed rate in approximately 4 months. We recommend starting your review 8 weeks before expiry.'
},{
  id:'alert-002', client_id:'demo-client-001', created_at:new Date().toISOString(),
  title:'Equity milestone reached', alert_type:'positive', icon:'📈', dismissed:false,
  body:'Your combined portfolio equity has crossed $450,000 – great progress. This unlocks refinancing options worth reviewing.'
}];
const DEMO_DOCUMENTS = [{
  id:'doc-001', client_id:'demo-client-001',
  created_at:new Date(Date.now()-30*86400000).toISOString(),
  name:'CBA Loan Contract 2023', category:'Loan contract',
  file_url:null, file_size_kb:2400, uploaded_by:'James Wilson'
},{
  id:'doc-002', client_id:'demo-client-001',
  created_at:new Date(Date.now()-60*86400000).toISOString(),
  name:'Annual Portfolio Review 2024', category:'Annual review',
  file_url:null, file_size_kb:1180, uploaded_by:'James Wilson'
}];
const DEMO_RESEARCH = [{
  id:'res-001', client_id:'demo-client-001',
  address:'7/22 Brunswick Street, Fortitude Valley QLD 4006',
  property_type:'2 bed apartment', asking_price:595000,
  suburb_growth_5yr:'+38%', estimated_yield:4.8,
  listing_url:'https://www.domain.com.au', notes:'Great location, check body corp fees',
  status:'Shortlisted'
}];
function loadDemoData() {
  currentUser = { id: 'demo-client-001', email: 'testclient@jrwfinance.com.au' };
  clientData = DEMO_CLIENT;
  propertiesData = DEMO_PROPERTIES;
  loansData = DEMO_LOANS;
  goalsData = DEMO_GOALS;
  notesData = DEMO_NOTES;
  alertsData = DEMO_ALERTS;
  documentsData = DEMO_DOCUMENTS;
  researchData = DEMO_RESEARCH;
  updateUIWithProfile();
  renderOverview();
  renderPortfolio();
  renderGoals();
  renderScenarios();
  renderNotes();
  renderAlerts();
  renderDocuments();
  renderResearch();
}
/* ───────────────────────────────────────────── */

let isDemoMode = false;
/* ── Supabase ── */
const SUPA_URL = 'https://amhevyrewmlmwxncujmp.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGV2eXJld21sbXd4bmN1am1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NTI4MjQsImV4cCI6MjA5MjEyODgyNH0._I0pevBOVM7YMKPRkKTKiYVCUyAkAkYPr0ZzfW4qlt0';
const _supabase = createClient(SUPA_URL, SUPA_KEY);

/* ── State ── */
let currentUser = null, clientData = null;
let propertiesData = [], loansData = [], goalsData = [], notesData = [];
let alertsData = [], documentsData = [], researchData = [];
let selectedResearch = [], chartsDrawn = false, projDrawn = false;
let _realtimeChannel = null;

/* ── Auth ── */
// Handle password recovery redirect from email link
// Detect recovery flow from URL hash BEFORE any auth events fire
let _passwordResetMode = window.location.hash.includes('type=recovery');
let _passwordJustSaved = false;
let _appLoading = false;

async function _loadClientApp(session) {
  if (_appLoading) return;
  _appLoading = true;
  showLoading();
  try {
    currentUser = session.user;
    await loadAllData();
    showApp();
    setupRealtime(currentUser.id);
    // Fire-and-forget: update last active timestamp
    _supabase.from('clients').update({ last_active_at: new Date().toISOString() }).eq('id', currentUser.id);
  } catch(err) {
    console.error('Error loading client app:', err);
    showLoginScreen();
  } finally {
    _appLoading = false;
  }
}

_supabase.auth.onAuthStateChange(async (event, session) => {
  // Show reset screen and block all other events
  if (event === 'PASSWORD_RECOVERY') {
    _passwordResetMode = true;
    showPasswordResetScreen();
    return;
  }
  // Password was just saved — handle USER_UPDATED or SIGNED_IN (Supabase fires either)
  if (_passwordResetMode) {
    if (_passwordJustSaved && (event === 'USER_UPDATED' || event === 'SIGNED_IN')) {
      _passwordResetMode = false;
      _passwordJustSaved = false;
      _appLoading = false;
      if (session) await _loadClientApp(session);
    }
    // Block initial SIGNED_IN that fires when recovery link is opened
    return;
  }
  // Normal login / session restore
  // Skip silent token refresh — app is already loaded, no need to reload
  if (event === 'TOKEN_REFRESHED') return;

  if (session) {
    await _loadClientApp(session);
  } else {
    _appLoading = false;
    currentUser = null;
    showLoginScreen();
  }
});

async function loadAllData() {
  const uid = currentUser.id;
  const [cR, pR, lR, gR, nR, aR, dR, rR] = await Promise.all([
    _supabase.from('clients').select('*').eq('id', uid).maybeSingle(),
    _supabase.from('properties').select('*').eq('client_id', uid),
    _supabase.from('loans').select('*').eq('client_id', uid),
    _supabase.from('goals').select('*').eq('client_id', uid).order('sort_order'),
    _supabase.from('notes').select('*').eq('client_id', uid).order('created_at', { ascending: false }),
    _supabase.from('alerts').select('*').eq('client_id', uid).eq('dismissed', false).order('created_at', { ascending: false }),
    _supabase.from('documents').select('*').eq('client_id', uid).order('created_at', { ascending: false }),
    _supabase.from('research').select('*').eq('client_id', uid).order('created_at', { ascending: false }),
  ]);
  if (cR.error) console.error('Client load error:', cR.error);
  clientData = cR.data || {
    id: currentUser.id,
    email: currentUser.email,
    first_name: currentUser.user_metadata?.first_name || '',
    last_name: currentUser.user_metadata?.last_name || ''
  };
  propertiesData = pR.data || [];
  // Drop loans that aren't linked to a known property (defensive – property_id is nullable so allow no-property loans through)
  loansData = (lR.data || []).filter(l => !l.property_id || propertiesData.some(p => p.id === l.property_id));
  goalsData = gR.data || [];
  notesData = nR.data || [];
  alertsData = aR.data || [];
  documentsData = dR.data || [];
  researchData = rR.data || [];

  updateUIWithProfile();
  renderOverview();
  renderScenarios();
  renderPortfolio();
  renderGoals();
  renderNotes();
  renderAlerts();
  renderDocuments();
  renderResearch();
}

/* ── Profile UI ── */
function updateUIWithProfile() {
  const fullName = `${clientData.first_name || ''} ${clientData.last_name || ''}`.trim() || 'Client';
  const initials = ((clientData.first_name || '?')[0] + (clientData.last_name || '?')[0]).toUpperCase();
  document.getElementById('tb-username').textContent = fullName;
  document.getElementById('pp-name').textContent = fullName;
  document.getElementById('pp-email-meta').textContent = clientData.email || currentUser.email || '';
  document.getElementById('profile-display-name').textContent = fullName;
  const avatarInner = clientData.photo_url ? `<img src="${esc(clientData.photo_url)}" alt="">` : initials;
  ['profile-btn', 'pp-av', 'photo-preview-large'].forEach(id => {
    const el = document.getElementById(id); if (el) el.innerHTML = avatarInner;
  });
  document.getElementById('pf-first').value = clientData.first_name || '';
  document.getElementById('pf-last').value = clientData.last_name || '';
  document.getElementById('pf-email').value = clientData.email || currentUser.email || '';
  document.getElementById('pf-mobile').value = clientData.mobile || '';
  document.getElementById('pf-address').value = clientData.residential_address || '';
  document.getElementById('pf-since').textContent = clientData.client_since || '–';
  document.getElementById('pf-broker').textContent = `${clientData.broker_name || 'James Wilson'} – JRW Finance`;
}

async function saveProfile() {
  if(demoGuard()) return;
  const updates = {
    first_name: document.getElementById('pf-first').value,
    last_name: document.getElementById('pf-last').value,
    mobile: document.getElementById('pf-mobile').value,
    residential_address: document.getElementById('pf-address').value,
  };
  const { error } = await _supabase.from('clients').update(updates).eq('id', currentUser.id);
  if (error) { showToast('Error saving profile'); return; }
  Object.assign(clientData, updates);
  updateUIWithProfile();
  showToast('Profile saved');
}

async function handlePhotoUpload(input) {
  const file = input.files[0]; if (!file) return;
  if (file.size > 1024 * 1024) { showToast('Photo must be under 1 MB'); input.value=''; return; }
  if (!file.type.startsWith('image/')) { showToast('Please choose an image file'); input.value=''; return; }
  // Optimistic local preview
  const reader = new FileReader();
  reader.onload = e => {
    const img = `<img src="${e.target.result}" alt="">`;
    ['profile-btn', 'pp-av', 'photo-preview-large'].forEach(id => {
      const el = document.getElementById(id); if (el) el.innerHTML = img;
    });
  };
  reader.readAsDataURL(file);
  if (demoGuard()) { input.value=''; return; }
  // Upload to Supabase Storage at <uid>/avatar (matches storage RLS policy)
  const path = `${currentUser.id}/avatar`;
  const { error: upErr } = await _supabase.storage.from('profile-photos').upload(path, file, { upsert: true, cacheControl: '0', contentType: file.type });
  if (upErr) { showToast('Upload failed: ' + upErr.message); input.value=''; return; }
  const { data: { publicUrl } } = _supabase.storage.from('profile-photos').getPublicUrl(path);
  const photoUrl = `${publicUrl}?v=${Date.now()}`;
  const { error: dbErr } = await _supabase.from('clients').update({ photo_url: photoUrl }).eq('id', currentUser.id);
  if (dbErr) { showToast('Saved photo but couldn\'t update profile: ' + dbErr.message); return; }
  if (clientData) clientData.photo_url = photoUrl;
  input.value = '';
  showToast('Photo updated');
}

async function removePhoto() {
  if (demoGuard()) return;
  // Best-effort delete from storage
  await _supabase.storage.from('profile-photos').remove([`${currentUser.id}/avatar`]).catch(() => {});
  const { error } = await _supabase.from('clients').update({ photo_url: null }).eq('id', currentUser.id);
  if (error) { showToast('Error removing photo'); return; }
  if (clientData) clientData.photo_url = null;
  const initials = clientData ? ((clientData.first_name || '?')[0] + (clientData.last_name || '?')[0]).toUpperCase() : '?';
  ['profile-btn', 'pp-av', 'photo-preview-large'].forEach(id => {
    const el = document.getElementById(id); if (el) el.innerHTML = initials;
  });
  showToast('Photo removed');
}

/* ── Overview ── */
function renderOverview() {
  const totalValue = propertiesData.reduce((s, p) => s + (p.estimated_value || 0), 0);
  const totalLoans = loansData.reduce((s, l) => s + (l.loan_balance || 0), 0);
  const totalEquity = totalValue - totalLoans;
  const equityPct = totalValue > 0 ? ((totalEquity / totalValue) * 100).toFixed(1) : 0;
  const avgRate = loansData.length ? (loansData.reduce((s, l) => s + (l.interest_rate || 0), 0) / loansData.length * 100).toFixed(2) : 0;

  document.getElementById('stat-portfolio-value').textContent = fmt(totalValue);
  document.getElementById('stat-property-count').textContent = `${propertiesData.length} propert${propertiesData.length === 1 ? 'y' : 'ies'}`;
  document.getElementById('stat-equity').textContent = fmt(totalEquity);
  document.getElementById('stat-equity-pct').textContent = `${equityPct}% of portfolio`;
  document.getElementById('stat-avg-rate').textContent = `${avgRate}%`;
  document.getElementById('stat-loan-count').textContent = `Across ${loansData.length} loan${loansData.length === 1 ? '' : 's'}`;

  // Fixed rate alert banner
  const fixedLoan = loansData.find(l => l.rate_type === 'fixed' && l.fixed_expiry_date);
  const banner = document.getElementById('overview-alert-banner');
  if (fixedLoan) {
    const days = Math.round((new Date(fixedLoan.fixed_expiry_date) - new Date()) / 86400000);
    if (days > 0 && days < 365) {
      banner.innerHTML = `<div style="background:#fffbea;border:1.5px solid #e8c840;border-radius:9px;padding:11px 14px;display:flex;gap:9px;margin-bottom:13px;"><div style="width:7px;height:7px;border-radius:50%;background:#e8a000;flex-shrink:0;margin-top:4px;"></div><div><div style="font-size:12px;font-weight:600;color:#5a4d00;">Fixed rate expiring in ${days} days – ${new Date(fixedLoan.fixed_expiry_date).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}</div><div style="font-size:11px;color:#7a6a00;margin-top:1px;">${esc(fixedLoan.lender||'')} loan. Review recommended 8 weeks before expiry.</div></div></div>`;
    } else { banner.innerHTML = ''; }
  } else { banner.innerHTML = ''; }

  // Property cards
  const grid = document.getElementById('overview-prop-grid');
  if (!propertiesData.length) {
    const brokerName = clientData?.broker_name || 'your broker';
    grid.innerHTML = `<div style="background:#fff;border:0.5px solid #e0e0d8;border-radius:12px;padding:28px 24px;text-align:center;grid-column:1/-1;">
      <div style="width:48px;height:48px;background:#2e3105;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3L2 10v11h7v-5h6v5h7V10L12 3z" fill="#dfe777"/></svg>
      </div>
      <div style="font-size:16px;font-weight:700;color:#1a1f02;margin-bottom:6px;">Welcome to your portal</div>
      <div style="font-size:12px;color:#888;line-height:1.7;max-width:340px;margin:0 auto 18px;">
        ${brokerName} is setting up your portfolio. Your properties, loans, and goals will appear here once they've been added.
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <div onclick="switchTab('notes')" style="background:#2e3105;color:#dfe777;font-size:12px;font-weight:600;padding:9px 18px;border-radius:8px;cursor:pointer;">💬 Message your broker</div>
        <div onclick="switchTab('goals')" style="background:#f5f5f0;color:#444;font-size:12px;font-weight:500;padding:9px 18px;border-radius:8px;cursor:pointer;border:0.5px solid #ddd;">🎯 View your goals</div>
      </div>
    </div>`;
    return;
  }
  grid.innerHTML = propertiesData.map(prop => {
    const loan = loansData.find(l => l.property_id === prop.id);
    const equity = (prop.estimated_value || 0) - (loan ? loan.loan_balance || 0 : 0);
    const lvr = loan ? loan.lvr : null;
    const isInv = prop.ownership_type === 'Investment';
    return `<div class="prop-card">
      <div class="prop-photo ${isInv ? 'investment' : ''}">
        ${prop.photo_url ? `<img src="${esc(prop.photo_url)}" alt="property">` : `<svg width="36" height="36" viewBox="0 0 48 48" fill="none" style="opacity:0.2;"><path d="M24 6L4 22v22h12V30h16v14h12V22L24 6z" fill="#dfe777"/></svg>`}
        <div class="prop-photo-label">${esc(prop.ownership_type || 'PPOR')} – ${esc(prop.suburb || '')}</div>
      </div>
      <div class="prop-card-body">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;">
          <div><div style="font-size:12px;font-weight:600;">${esc(prop.address)}</div><div style="font-size:10px;color:#888;">${esc(prop.suburb || '')} ${esc(prop.state || '')} ${esc(prop.postcode || '')}</div></div>
          <span class="badge ${isInv ? 'badge-inv' : 'badge-ppor'}">${esc(prop.ownership_type || 'PPOR')}</span>
        </div>
        <div class="eq-wrap"><div class="eq-bar" style="width:${Math.min(100, 100 - (lvr || 0))}%;${isInv ? 'background:#c8d060;' : ''}"></div></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:10px;color:#3B6D11;font-weight:600;">Equity ${fmt(equity)}</span><span style="font-size:10px;color:#888;">LVR ${lvr ? lvr + '%' : 'N/A'}</span></div>
        ${loan ? `<div style="border-top:0.5px solid #ebebeb;padding-top:6px;display:flex;justify-content:space-between;align-items:center;"><span class="badge ${loan.rate_type === 'fixed' ? 'badge-fix' : 'badge-var'}">${((loan.interest_rate || 0) * 100).toFixed(2)}% ${loan.rate_type}</span>${loan.fixed_expiry_date ? `<span style="font-size:10px;color:#854F0B;">Expires ${new Date(loan.fixed_expiry_date).toLocaleDateString('en-AU', {month:'short',year:'numeric'})}</span>` : `<span style="font-size:10px;color:#888;">${esc(loan.lender || '')}</span>`}</div>` : ''}
      </div>
    </div>`;
  }).join('');

  if (!chartsDrawn) { setTimeout(drawCharts, 80); chartsDrawn = true; }
}

/* ── Portfolio ── */
function renderPortfolio() {
  const wrap = document.getElementById('portfolio-cards');
  if (!propertiesData.length) { wrap.innerHTML = '<p style="font-size:12px;color:#888;padding:10px;">No properties added yet.</p>'; return; }
  wrap.innerHTML = propertiesData.map(prop => {
    const loan = loansData.find(l => l.property_id === prop.id);
    const equity = (prop.estimated_value || 0) - (loan ? loan.loan_balance || 0 : 0);
    const isInv = prop.ownership_type === 'Investment';
    return `<div class="prop-card" style="margin-bottom:11px;">
      <div class="prop-photo ${isInv ? 'investment' : ''}" style="height:130px;">
        ${prop.photo_url ? `<img src="${esc(prop.photo_url)}" alt="property">` : `<svg width="44" height="44" viewBox="0 0 48 48" fill="none" style="opacity:0.18;"><path d="M24 6L4 22v22h12V30h16v14h12V22L24 6z" fill="#dfe777"/></svg>`}
        <div class="prop-photo-label" style="color:rgba(255,255,255,0.6);">${prop.photo_url ? '' : 'Photo loads with Supabase Storage'}</div>
      </div>
      <div style="padding:14px 16px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;color:#1a1f02;">${esc(prop.address)}</div>
        <div style="display:flex;gap:5px;margin-bottom:11px;"><span class="badge ${isInv ? 'badge-inv' : 'badge-ppor'}">${esc(prop.ownership_type || 'PPOR')}</span></div>
        <div class="stat-grid cols-3" style="margin-bottom:12px;">
          <div class="stile"><div class="stile-label">Est. value</div><div style="font-size:15px;font-weight:500;padding:3px 0;">${fmt(prop.estimated_value)}</div></div>
          <div class="stile"><div class="stile-label">Loan balance</div><div style="font-size:15px;font-weight:500;padding:3px 0;">${loan ? fmt(loan.loan_balance) : 'N/A'}</div></div>
          <div class="stile"><div class="stile-label">Equity</div><input class="edit-val" value="${fmt(equity)}" style="color:#3B6D11;" readonly></div>
        </div>
        ${loan ? `<table class="data-table">
          <tr><td class="muted">Lender</td><td style="text-align:right;font-weight:500;">${esc(loan.lender || '–')}</td></tr>
          <tr><td class="muted">Interest rate</td><td style="text-align:right;font-weight:500;">${((loan.interest_rate || 0) * 100).toFixed(2)}% p.a. ${loan.rate_type || ''}</td></tr>
          ${loan.fixed_expiry_date ? `<tr><td class="muted">Fixed expiry</td><td style="text-align:right;font-weight:500;color:#854F0B;">${new Date(loan.fixed_expiry_date).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}</td></tr>` : ''}
          <tr><td class="muted">Monthly repayment</td><td style="text-align:right;font-weight:500;">${loan.monthly_repayment ? fmt(loan.monthly_repayment) : 'N/A'}</td></tr>
          <tr><td class="muted">LVR</td><td style="text-align:right;font-weight:500;">${loan.lvr ? loan.lvr + '%' : 'N/A'}</td></tr>
          <tr><td class="muted">Loan type</td><td style="text-align:right;font-weight:500;">${esc(loan.loan_type || '–')}</td></tr>
          ${loan.next_review_date ? `<tr><td class="muted">Next review</td><td style="text-align:right;font-weight:500;color:#0C447C;">${new Date(loan.next_review_date).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}</td></tr>` : ''}
        </table>` : '<p style="font-size:11px;color:#888;margin-top:8px;">No loan linked to this property.</p>'}
      </div>
    </div>`;
  }).join('');
}

async function savePropField(id, field, value) {
  if(demoGuard()) return;
  const { error } = await _supabase.from('properties').update({ [field]: value }).eq('id', id);
  if (error) { showToast('Error saving'); return; }
  const prop = propertiesData.find(p => p.id === id); if (prop) prop[field] = value;
  showToast('Saved');
}

async function saveLoanField(id, field, value) {
  if(demoGuard()) return;
  const { error } = await _supabase.from('loans').update({ [field]: value }).eq('id', id);
  if (error) { showToast('Error saving'); return; }
  const loan = loansData.find(l => l.id === id); if (loan) loan[field] = value;
  showToast('Saved');
}

/* ── Goals ── */
function renderGoals() {
  const list = document.getElementById('goals-list');
  if (!goalsData.length) { list.innerHTML = '<p style="font-size:12px;color:#888;padding:10px 0;">No goals yet. Add your first goal below.</p>'; return; }
  const sc = { 'In progress': 'amber', 'On track': 'green', 'Planning': 'grey', 'Long-term': 'grey', 'Complete': 'blue' };
  const today = new Date(); today.setHours(0,0,0,0);
  list.innerHTML = goalsData.map(g => {
    const progress = g.progress ?? 0;
    const targetDate = g.target_date ? new Date(g.target_date) : null;
    const daysLeft = targetDate ? Math.ceil((targetDate - today) / 86400000) : null;
    const dateStr = targetDate ? targetDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    const dateColour = daysLeft !== null && daysLeft < 30 ? '#854F0B' : daysLeft !== null && daysLeft < 90 ? '#633806' : '#888';
    return `
    <div class="goal-card" id="gc-${g.id}">
      <div class="goal-card-header">
        <input class="goal-card-title-edit" value="${esc(g.title)}" onblur="saveGoalField('${g.id}','title',this.value)">
        <select class="status-select ${sc[g.status] || 'grey'}" onchange="saveGoalField('${g.id}','status',this.value);updateStatus(this)">
          <option${g.status==='Planning'?' selected':''}>Planning</option>
          <option${g.status==='In progress'?' selected':''}>In progress</option>
          <option${g.status==='On track'?' selected':''}>On track</option>
          <option${g.status==='Long-term'?' selected':''}>Long-term</option>
          <option${g.status==='Complete'?' selected':''}>Complete</option>
        </select>
      </div>
      <div class="goal-card-body">
        <div style="margin-bottom:10px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
            <span style="font-size:10px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Progress</span>
            <span style="font-size:11px;font-weight:700;color:#2e3105;">${progress}%</span>
          </div>
          <div style="background:#eef0e4;border-radius:99px;height:6px;overflow:hidden;margin-bottom:4px;">
            <div style="height:6px;border-radius:99px;background:${progress >= 100 ? '#6aaf4a' : '#2e3105'};width:${progress}%;transition:width 0.3s;"></div>
          </div>
          <input type="range" min="0" max="100" step="5" value="${progress}" style="width:100%;accent-color:#2e3105;cursor:pointer;margin-top:2px;" oninput="this.previousElementSibling.previousElementSibling.children[1].textContent=this.value+'%';this.previousElementSibling.children[0].style.width=this.value+'%'" onchange="saveGoalField('${g.id}','progress',parseInt(this.value))">
        </div>
        ${targetDate ? `<div style="font-size:11px;color:${dateColour};font-weight:600;margin-bottom:9px;display:flex;align-items:center;gap:5px;">🎯 Target: ${dateStr}${daysLeft !== null ? ` <span style="font-weight:400;color:#aaa;">(${daysLeft > 0 ? daysLeft + ' days' : daysLeft === 0 ? 'today' : 'overdue'})</span>` : ''}</div>` : ''}
        <div class="goal-5-grid">
          <div class="g5-item"><div class="g5-label">What</div><textarea class="g5-ta" rows="2" onblur="saveGoalField('${g.id}','what',this.value)">${esc(g.what || '')}</textarea></div>
          <div class="g5-item"><div class="g5-label">When</div><textarea class="g5-ta" rows="2" onblur="saveGoalField('${g.id}','when_target',this.value)">${esc(g.when_target || '')}</textarea></div>
          <div class="g5-item"><div class="g5-label">Why</div><textarea class="g5-ta" rows="2" onblur="saveGoalField('${g.id}','why',this.value)">${esc(g.why || '')}</textarea></div>
          <div class="g5-item"><div class="g5-label">Where</div><textarea class="g5-ta" rows="2" onblur="saveGoalField('${g.id}','where_location',this.value)">${esc(g.where_location || '')}</textarea></div>
        </div>
        <div class="g5-how"><div class="g5-label" style="margin-bottom:2px;">How</div><textarea class="g5-ta" rows="2" onblur="saveGoalField('${g.id}','how',this.value)">${esc(g.how || '')}</textarea></div>
      </div>
    </div>`;
  }).join('');
  if (!projDrawn) { setTimeout(drawProjection, 80); projDrawn = true; }
}

async function saveGoalField(id, field, value) {
  if(demoGuard()) return;
  const { error } = await _supabase.from('goals').update({ [field]: value }).eq('id', id);
  if (error) { showToast('Error saving'); return; }
  const goal = goalsData.find(g => g.id === id); if (goal) goal[field] = value;
}

function updateStatus(sel) {
  sel.className = 'status-select ' + (sel.value === 'In progress' ? 'amber' : sel.value === 'On track' ? 'green' : sel.value === 'Complete' ? 'blue' : 'grey');
}

function openGoalModal() { document.getElementById('goal-modal').classList.add('open'); }
function closeGoalModal() {
  document.getElementById('goal-modal').classList.remove('open');
  ['gm-title','gm-what','gm-when','gm-why','gm-where','gm-how'].forEach(id => { document.getElementById(id).value = ''; });
}

async function addGoal() {
  if(demoGuard()) return;
  const title = document.getElementById('gm-title').value.trim(); if (!title) return;
  const newGoal = {
    client_id: currentUser.id, title,
    what: document.getElementById('gm-what').value,
    when_target: document.getElementById('gm-when').value,
    why: document.getElementById('gm-why').value,
    where_location: document.getElementById('gm-where').value,
    how: document.getElementById('gm-how').value,
    status: document.getElementById('gm-status').value,
    sort_order: goalsData.length,
  };
  const { data, error } = await _supabase.from('goals').insert(newGoal).select().single();
  if (error) { showToast('Error adding goal'); return; }
  goalsData.push(data);
  renderGoals();
  closeGoalModal();
  showToast('Goal added');
}

/* ── Notes ── */
function renderNotes() {
  const list = document.getElementById('notes-list');
  if (!notesData.length) {
    list.innerHTML = '<p style="font-size:12px;color:#888;text-align:center;padding:24px 0;">No messages yet — send one below to get started.</p>';
    return;
  }
  const catBadge = { 'Portfolio review':'badge-green','Rate update':'badge-blue','Annual review':'badge-amber','Goal update':'badge-grey','Question':'badge-grey','General':'badge-grey' };
  // Oldest first for chat layout
  const sorted = [...notesData].reverse();
  list.innerHTML = sorted.map(n => {
    const isMine = !n.is_broker_note;
    const timeStr = new Date(n.created_at).toLocaleString('en-AU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
    return `<div class="msg-wrap ${isMine ? 'client' : 'broker'}" id="nc-${n.id}" data-cat="${esc(n.category||'')}">
      ${!isMine ? `<div class="msg-sender">${esc(n.author_name)}</div>` : ''}
      <div class="msg-bubble" id="nb-${n.id}">${esc(n.body)}</div>
      ${n.category ? `<span class="badge ${catBadge[n.category]||'badge-grey'}" style="margin-top:3px;">${esc(n.category)}</span>` : ''}
      <div class="msg-meta">
        ${timeStr}
        ${isMine ? `<button class="msg-edit-btn" onclick="editNote('${n.id}')">edit</button>` : ''}
      </div>
      <div id="ne-${n.id}" style="display:none;width:100%;max-width:340px;">
        <textarea class="note-edit-area" id="nta-${n.id}" style="width:100%;margin-top:4px;">${esc(n.body)}</textarea>
        <div style="display:flex;gap:6px;margin-top:5px;">
          <button class="note-save-btn" onclick="saveNote('${n.id}')">Save</button>
          <button class="note-cancel-btn" onclick="cancelEdit('${n.id}')">Cancel</button>
        </div>
      </div>
    </div>`;
  }).join('');
  // Scroll to latest
  list.scrollTop = list.scrollHeight;
}

function filterNotes(chip) {
  document.querySelectorAll('.nf-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const cat = chip.dataset.cat;
  document.querySelectorAll('#notes-list .note-card').forEach(n => {
    n.style.display = (cat === 'all' || n.dataset.cat === cat) ? 'block' : 'none';
  });
}

async function publishNote() {
  if(demoGuard()) return;
  const text = document.getElementById('note-text').value.trim(); if (!text) return;
  const cat = document.getElementById('note-cat').value;
  const initials = clientData ? ((clientData.first_name||'?')[0]+(clientData.last_name||'?')[0]).toUpperCase() : '?';
  const { data, error } = await _supabase.from('notes').insert({
    client_id: currentUser.id,
    author_name: clientData ? `${clientData.first_name} ${clientData.last_name}` : 'Client',
    author_initials: initials,
    category: cat || null,
    body: text,
    is_broker_note: false,
  }).select().single();
  if (error) { showToast('Error sending message'); return; }
  notesData.unshift(data);
  renderNotes();
  document.getElementById('note-text').value = '';
  document.getElementById('note-cat').value = '';
}

async function handleDocUpload(input) {
  if(demoGuard()) return;
  const files = Array.from(input.files || []);
  if (!files.length) return;
  const progressWrap = document.getElementById('doc-upload-progress');
  const progressBar  = document.getElementById('doc-upload-bar');
  const statusEl     = document.getElementById('doc-upload-status');
  progressWrap.style.display = 'block';
  statusEl.style.display = 'block';
  let uploaded = 0;
  for (const file of files) {
    statusEl.textContent = `Uploading ${file.name}…`;
    progressBar.style.width = '10%';
    const ext = file.name.split('.').pop();
    const path = `${currentUser.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
    const { error: upErr } = await _supabase.storage.from('client-documents').upload(path, file, { upsert: false });
    if (upErr) { showToast(`Upload failed: ${upErr.message}`); continue; }
    progressBar.style.width = '70%';
    const { data: urlData } = _supabase.storage.from('client-documents').getPublicUrl(path);
    // Signed URL for private bucket
    const { data: signed } = await _supabase.storage.from('client-documents').createSignedUrl(path, 60 * 60 * 24 * 365);
    const fileUrl = signed?.signedUrl || urlData?.publicUrl || null;
    const sizekb = Math.round(file.size / 1024);
    const category = ext === 'pdf' ? 'Other' : 'Other';
    const { data: doc, error: dbErr } = await _supabase.from('documents').insert({
      client_id: currentUser.id,
      name: file.name,
      category,
      file_url: fileUrl,
      file_size_kb: sizekb,
      uploaded_by: clientData ? `${clientData.first_name} ${clientData.last_name}` : 'Client',
    }).select().single();
    if (dbErr) { showToast(`Save failed: ${dbErr.message}`); continue; }
    documentsData.unshift(doc);
    uploaded++;
    progressBar.style.width = '100%';
  }
  setTimeout(() => {
    progressWrap.style.display = 'none';
    progressBar.style.width = '0%';
    statusEl.style.display = 'none';
    if (input.value !== undefined) input.value = '';
  }, 800);
  if (uploaded) { renderDocuments(); showToast(`${uploaded} file${uploaded > 1 ? 's' : ''} uploaded ✓`); }
}

function editNote(id) {
  document.getElementById('nb-' + id).style.display = 'none';
  document.getElementById('ne-' + id).style.display = 'block';
  const note = notesData.find(n => n.id === id);
  if (note) document.getElementById('nta-' + id).value = note.body;
}

async function saveNote(id) {
  if(demoGuard()) return;
  const body = document.getElementById('nta-' + id).value;
  const { error } = await _supabase.from('notes').update({ body }).eq('id', id);
  if (error) { showToast('Error saving note'); return; }
  const note = notesData.find(n => n.id === id); if (note) note.body = body;
  document.getElementById('nb-' + id).textContent = body;
  document.getElementById('nb-' + id).style.display = 'block';
  document.getElementById('ne-' + id).style.display = 'none';
  showToast('Note saved');
}

function cancelEdit(id) {
  document.getElementById('nb-' + id).style.display = 'block';
  document.getElementById('ne-' + id).style.display = 'none';
}

/* ── Alerts ── */
function renderAlerts() {
  // Also render compact alerts on overview
  const overviewSection = document.getElementById('overview-alerts-section');
  if (overviewSection) {
    if (alertsData.length) {
      overviewSection.innerHTML = alertsData.slice(0,2).map(a => `
        <div class="alert-card ${a.alert_type||'info'}" style="margin-bottom:8px;">
          <div class="alert-icon-wrap">${a.icon||'ℹ️'}</div>
          <div style="flex:1;"><div class="alert-card-title">${esc(a.title)}</div><div class="alert-card-body" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${esc(a.body||'')}</div></div>
          <button class="alert-dismiss" onclick="dismissAlert('${a.id}')">&times;</button>
        </div>`).join('') + (alertsData.length > 2 ? `<p style="font-size:11px;color:#888;text-align:right;cursor:pointer;" onclick="switchTab('alerts')">View all ${alertsData.length} alerts →</p>` : '');
    } else { overviewSection.innerHTML = ''; }
  }
  const list = document.getElementById('alerts-list');
  if (!alertsData.length) {
    list.innerHTML = '';
    document.getElementById('alerts-empty').style.display = 'block';
    const alertDot = document.getElementById('nav-alert-dot'); if(alertDot) alertDot.style.display='none';
    return;
  }
  document.getElementById('alerts-empty').style.display = 'none';
  // Update overview nav alert dot
  const ovLink = document.querySelector('[data-tab="overview"]');
  let dot = document.getElementById('nav-alert-dot');
  if (alertsData.length && ovLink) {
    if (!dot) { dot = document.createElement('span'); dot.id='nav-alert-dot'; dot.className='nav-badge'; dot.style.marginLeft='auto'; ovLink.appendChild(dot); }
    dot.textContent = alertsData.length; dot.style.display='';
  } else if (dot) { dot.style.display='none'; }
  list.innerHTML = alertsData.map(a => `
    <div class="alert-card ${a.alert_type || 'info'}" id="ac-${a.id}">
      <div class="alert-icon-wrap">${a.icon || (a.alert_type === 'urgent' ? '⏰' : a.alert_type === 'positive' ? '📈' : '📊')}</div>
      <div style="flex:1;">
        <div class="alert-card-title">${esc(a.title)}</div>
        <div class="alert-card-body">${esc(a.body || '')}</div>
        <div class="alert-card-actions"><button class="alert-action-btn secondary" onclick="dismissAlert('${a.id}')">Dismiss</button></div>
        <div class="alert-meta">Sent ${new Date(a.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}</div>
      </div>
      <button class="alert-dismiss" onclick="dismissAlert('${a.id}')">&times;</button>
    </div>`).join('');
}

async function dismissAlert(id) {
  if(demoGuard()) return;
  const { error } = await _supabase.from('alerts').update({ dismissed: true }).eq('id', id);
  if (error) { showToast('Error'); return; }
  alertsData = alertsData.filter(a => a.id !== id);
  renderAlerts();
}

/* ── Documents ── */
function renderDocuments() {
  const list = document.getElementById('doc-list');
  if (!documentsData.length) {
    list.innerHTML = '<p style="font-size:12px;color:#888;padding:10px 0;">No documents yet. Your broker will upload them here.</p>';
    return;
  }
  list.innerHTML = documentsData.map(d => `
    <div class="doc-item" data-cat="${esc(d.category || 'Other')}">
      <div class="doc-icon"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="9" height="14" rx="1.5" stroke="#dfe777" stroke-width="1.2"/><path d="M5 5h4M5 7.5h4M5 10h2" stroke="#dfe777" stroke-width="1" stroke-linecap="round"/></svg></div>
      <div><div class="doc-name">${esc(d.name)}</div><div class="doc-meta">${esc(d.category || 'Other')} – ${new Date(d.created_at).toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'})}${d.file_size_kb ? ' – ' + (d.file_size_kb / 1000).toFixed(1) + ' MB' : ''}</div></div>
      ${d.file_url ? `<a class="doc-download" href="${esc(d.file_url)}" target="_blank" rel="noopener noreferrer">Download</a>` : ''}
    </div>`).join('');
}

function filterDocs(chip) {
  document.querySelectorAll('.doc-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const cat = chip.dataset.cat;
  document.querySelectorAll('#doc-list .doc-item').forEach(d => {
    d.style.display = (cat === 'all' || d.dataset.cat === cat) ? 'flex' : 'none';
  });
}

/* ── Research ── */
function renderResearch() {
  const grid = document.getElementById('research-grid');
  if (!researchData.length) { grid.innerHTML = '<p style="font-size:12px;color:#888;padding:10px 0;">No properties on your research board yet.</p>'; return; }
  const statusBadge = { 'Watching': 'badge-blue', 'Shortlisted': 'badge-amber', 'Ruled out': 'badge-red' };
  grid.innerHTML = researchData.map(r => `
    <div class="research-card" data-id="${r.id}" onclick="toggleSelect('${r.id}')">
      <div class="rc-photo"><svg width="28" height="28" viewBox="0 0 48 48" fill="none" style="opacity:0.2;"><path d="M24 6L4 22v22h12V30h16v14h12V22L24 6z" fill="#dfe777"/></svg><span class="rc-photo-label">Property</span></div>
      <div class="rc-body">
        <div class="rc-name">${esc(r.address)}</div>
        <div class="rc-sub">${esc(r.property_type || '')}</div>
        <div class="rc-stats">
          <div class="rc-stat"><div class="rc-stat-l">Price</div><div class="rc-stat-v">${r.asking_price ? fmt(r.asking_price) : 'N/A'}</div></div>
          <div class="rc-stat"><div class="rc-stat-l">5yr growth</div><div class="rc-stat-v ${r.suburb_growth_5yr ? 'green' : ''}">${esc(r.suburb_growth_5yr || 'N/A')}</div></div>
          <div class="rc-stat"><div class="rc-stat-l">Yield</div><div class="rc-stat-v">${r.estimated_yield ? r.estimated_yield + '%' : 'N/A'}</div></div>
          <div class="rc-stat"><div class="rc-stat-l">Type</div><div class="rc-stat-v">${esc(r.property_type || 'N/A')}</div></div>
        </div>
      </div>
      <div class="rc-footer">
        ${r.listing_url ? `<a href="${esc(r.listing_url)}" target="_blank" rel="noopener noreferrer" style="font-size:10px;color:#0C447C;text-decoration:none;" onclick="event.stopPropagation()">View listing</a>` : ''}
        <span class="badge ${statusBadge[r.status] || 'badge-grey'}">${esc(r.status || 'Watching')}</span>
        <button class="rc-delete" onclick="event.stopPropagation();deleteResearch('${r.id}')">&times;</button>
      </div>
    </div>`).join('');
}

function toggleSelect(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  const idx = selectedResearch.indexOf(id);
  if (idx > -1) { selectedResearch.splice(idx, 1); card.classList.remove('selected'); }
  else if (selectedResearch.length < 3) { selectedResearch.push(id); card.classList.add('selected'); }
  else { showToast('Max 3 properties to compare'); return; }
  updateCompareBar();
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  if (selectedResearch.length >= 2) { bar.style.display = 'flex'; document.getElementById('compare-bar-text').textContent = selectedResearch.length + ' selected – ready to compare'; }
  else if (selectedResearch.length === 1) { bar.style.display = 'flex'; document.getElementById('compare-bar-text').textContent = '1 selected – select 1 or 2 more'; }
  else { bar.style.display = 'none'; }
  document.getElementById('compare-table-wrap').style.display = 'none';
}

function clearCompare() {
  selectedResearch = [];
  document.querySelectorAll('.research-card.selected').forEach(c => c.classList.remove('selected'));
  document.getElementById('compare-bar').style.display = 'none';
  document.getElementById('compare-table-wrap').style.display = 'none';
}

function showComparison() {
  if (selectedResearch.length < 2) { showToast('Select at least 2 properties'); return; }
  const items = selectedResearch.map(id => researchData.find(r => r.id === id)).filter(Boolean);
  const maxGrowth = Math.max(...items.map(i => parseFloat(i.suburb_growth_5yr) || 0));
  const maxYield = Math.max(...items.map(i => i.estimated_yield || 0));
  const headers = items.map(i => `<th>${esc(i.address)}</th>`).join('');
  function row(label, vals, winnerVals) {
    const cells = vals.map((v, i) => `<td class="${winnerVals && winnerVals[i] ? 'compare-winner' : ''}">${v}</td>`).join('');
    return `<tr><td>${label}</td>${cells}</tr>`;
  }
  const html = `<div class="compare-table" style="margin-bottom:14px;"><table><thead><tr><th>Metric</th>${headers}</tr></thead><tbody>
    ${row('Asking price', items.map(i => i.asking_price ? fmt(i.asking_price) : 'N/A'))}
    ${row('5yr growth', items.map(i => i.suburb_growth_5yr || 'N/A'), items.map(i => (parseFloat(i.suburb_growth_5yr) || 0) === maxGrowth))}
    ${row('Rental yield', items.map(i => i.estimated_yield ? i.estimated_yield + '%' : 'N/A'), items.map(i => (i.estimated_yield || 0) === maxYield))}
    ${row('Status', items.map(i => i.status || 'Watching'))}
    </tbody></table></div><p style="font-size:10px;color:#888;margin-bottom:10px;">&#x2713; Highlighted values are best in class.</p>`;
  const wrap = document.getElementById('compare-table-wrap');
  wrap.innerHTML = html; wrap.style.display = 'block';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function openResearchModal() { document.getElementById('research-modal').classList.add('open'); }
function closeResearchModal() {
  document.getElementById('research-modal').classList.remove('open');
  ['r-name','r-type','r-price','r-growth','r-yield','r-url','r-notes'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('r-status').value = 'Watching';
}

// Click outside to close + ESC for any modal
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); }));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
    document.getElementById('profile-panel')?.classList.remove('open');
  }
});

async function addResearchCard() {
  if(demoGuard()) return;
  const address = document.getElementById('r-name').value.trim(); if (!address) return;
  const { data, error } = await _supabase.from('research').insert({
    client_id: currentUser.id,
    address,
    property_type: document.getElementById('r-type').value || null,
    asking_price: parseCurrency(document.getElementById('r-price').value) || null,
    suburb_growth_5yr: document.getElementById('r-growth').value || null,
    estimated_yield: parseFloat(document.getElementById('r-yield').value) || null,
    listing_url: document.getElementById('r-url').value || null,
    notes: document.getElementById('r-notes').value || null,
    status: document.getElementById('r-status').value,
  }).select().single();
  if (error) { showToast('Error adding property'); return; }
  researchData.unshift(data);
  renderResearch();
  closeResearchModal();
  showToast('Property added to research');
}

async function deleteResearch(id) {
  if(demoGuard()) return;
  const { error } = await _supabase.from('research').delete().eq('id', id);
  if (error) { showToast('Error'); return; }
  researchData = researchData.filter(r => r.id !== id);
  selectedResearch = selectedResearch.filter(s => s !== id);
  updateCompareBar();
  renderResearch();
}

function runSearch() {
  const q = document.getElementById('research-search').value.trim().toLowerCase();
  if (!q) { renderResearch(); return; }
  const filtered = researchData.filter(r =>
    (r.address||'').toLowerCase().includes(q) ||
    (r.property_type||'').toLowerCase().includes(q) ||
    (r.notes||'').toLowerCase().includes(q)
  );
  const grid = document.getElementById('research-grid');
  if (!filtered.length) { grid.innerHTML = '<p style="font-size:12px;color:#888;padding:10px 0;">No matches for "' + esc(q) + '". <a href="#" onclick="document.getElementById(\'research-search\').value=\'\';renderResearch();return false;" style="color:#0C447C;">Clear</a></p>'; return; }
  // Re-render with filtered data
  const saved = researchData;
  researchData = filtered;
  renderResearch();
  researchData = saved;
}
document.getElementById('research-search').addEventListener('keydown', e => { if (e.key === 'Enter') runSearch(); });

/* ── Charts ── */
function drawCharts() {
  const totalValue = propertiesData.reduce((s, p) => s + (p.estimated_value || 0), 0);
  const totalLoans = loansData.reduce((s, l) => s + (l.loan_balance || 0), 0);
  const equity = totalValue - totalLoans;
  const eqEl = document.getElementById('chart-equity');
  const dnEl = document.getElementById('chart-donut');
  if (eqEl) {
    const existingEq = Chart.getChart(eqEl); if (existingEq) existingEq.destroy();
    const GROWTH = 1.07; // 7% compounding property growth
    const REPAY_RATE = 0.035; // ~3.5% annual loan reduction
    const nowYear = new Date().getFullYear();

    // Build timeline: 3 years back estimated + Now + forward until breakeven (min 8 yrs forward)
    const labels = [], eqData = [], debtData = [];
    // 3 back-estimated points
    for (let i = 3; i >= 1; i--) {
      const yrLabel = (nowYear - i).toString();
      const scale = Math.pow(1/GROWTH, i);
      const loanScale = Math.pow(1 + REPAY_RATE, i); // loan was higher
      labels.push(yrLabel);
      eqData.push(Math.round((totalValue * scale) - (totalLoans * loanScale)));
      debtData.push(Math.round(totalLoans * loanScale));
    }
    // Now
    labels.push('Now'); eqData.push(Math.round(equity)); debtData.push(Math.round(totalLoans));

    // Forward: project until equity > debt, then add 2 more years, minimum 8 years
    let fVal = totalValue, fLoan = totalLoans, breakevenIdx = null, fYears = 0;
    while (fYears < 30) {
      fYears++;
      fVal *= GROWTH;
      fLoan = Math.max(0, fLoan * (1 - REPAY_RATE));
      const fEq = fVal - fLoan;
      labels.push((nowYear + fYears).toString());
      eqData.push(Math.round(fEq));
      debtData.push(Math.round(fLoan));
      if (breakevenIdx === null && fEq >= fLoan) breakevenIdx = labels.length - 1;
      if (breakevenIdx !== null && fYears >= breakevenIdx + 2 && fYears >= 8) break;
      if (fYears >= 25) break; // safety cap
    }

    new Chart(eqEl, {
      type: 'line',
      data: { labels, datasets: [
        { label: 'Equity', data: eqData, borderColor: '#2e3105', backgroundColor: 'rgba(46,49,5,0.07)', borderWidth: 2.2, fill: true, tension: 0.35, pointRadius: 2, pointBackgroundColor: '#2e3105' },
        { label: 'Debt', data: debtData, borderColor: '#c8d060', backgroundColor: 'transparent', borderWidth: 1.8, fill: false, tension: 0.35, pointRadius: 2, borderDash: [4,3] }
      ] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.dataset.label + ': $' + Math.round(c.raw).toLocaleString('en-AU') } } }, scales: { y: { ticks: { callback: v => v>=1000000?'$'+(v/1000000).toFixed(1)+'M':'$'+Math.round(v/1000)+'k', font:{size:9}, color:'#888' }, grid:{color:'rgba(0,0,0,0.05)'}, border:{display:false}, min:0 }, x: { ticks:{font:{size:9},color:'#888',maxRotation:45}, grid:{display:false}, border:{display:false} } } },
      plugins: [{ afterDraw(chart) {
        const eq = chart.data.datasets[0].data, db = chart.data.datasets[1].data;
        // Draw "Now" divider line
        const nowIdx = chart.data.labels.indexOf('Now');
        const xs = chart.scales.x, ys = chart.scales.y, ctx2 = chart.ctx;
        if (nowIdx !== -1) {
          const nx = xs.getPixelForTick(nowIdx);
          ctx2.save(); ctx2.setLineDash([2,3]); ctx2.strokeStyle='rgba(100,100,100,0.25)'; ctx2.lineWidth=1;
          ctx2.beginPath(); ctx2.moveTo(nx,ys.top); ctx2.lineTo(nx,ys.bottom); ctx2.stroke();
          ctx2.fillStyle='rgba(100,100,100,0.5)'; ctx2.font='8px sans-serif'; ctx2.textAlign='center';
          ctx2.fillText('Today', nx, ys.top+9); ctx2.restore();
        }
        // Draw breakeven marker
        let bx = null;
        for (let i = 1; i < eq.length; i++) { if (eq[i-1] < db[i-1] && eq[i] >= db[i]) { bx = i; break; } }
        if (bx !== null) {
          const x = xs.getPixelForTick(bx);
          ctx2.save(); ctx2.setLineDash([3,3]); ctx2.strokeStyle='rgba(180,80,0,0.6)'; ctx2.lineWidth=1.5;
          ctx2.beginPath(); ctx2.moveTo(x,ys.top); ctx2.lineTo(x,ys.bottom); ctx2.stroke();
          ctx2.fillStyle='rgba(180,80,0,0.9)'; ctx2.font='bold 8px sans-serif'; ctx2.textAlign='left';
          ctx2.fillText('Breakeven', x+3, ys.top+9); ctx2.restore();
        }
      }}]
    });
    // Update legend
    const legWrap = eqEl.closest('.card');
    if (legWrap) {
      let leg = legWrap.querySelector('.eq-legend');
      if (!leg) { leg = document.createElement('div'); leg.className='eq-legend'; leg.style.cssText='display:flex;gap:12px;margin-top:7px;flex-wrap:wrap;'; legWrap.appendChild(leg); }
      leg.innerHTML = '<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#888;"><span style="width:12px;height:2px;background:#2e3105;display:inline-block;border-radius:1px;"></span>Equity (7% p.a.)</div><div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#888;"><span style="width:12px;height:0;border-top:2px dashed #c8d060;display:inline-block;width:12px;"></span>Debt</div><div style="font-size:10px;color:rgba(180,80,0,0.8);">| Breakeven</div>';
    }
  }
  if (dnEl) {
    const loanColors = ['#c8d060', '#a8b87a', '#7a9060', '#d8dab8'];
    const labels = ['Equity', ...loansData.map(l => l.lender || 'Loan')];
    const values = [equity, ...loansData.map(l => l.loan_balance || 0)];
    const colors = ['#2e3105', ...loansData.map((_, i) => loanColors[i % loanColors.length])];
    document.getElementById('donut-legend').innerHTML = labels.map((l, i) => `<div class="legend-row"><div class="legend-dot" style="background:${colors[i]};"></div>${l} ${fmt(values[i])}</div>`).join('');
    new Chart(dnEl, { type: 'doughnut', data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 3 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '$' + Math.round(c.raw).toLocaleString('en-AU') } } } } });
  }
}

function _seedPlanningFields() {
  const totalRepay = loansData.reduce((s,l)=>s+(l.monthly_repayment||0),0);
  // Seed proposed repay to 15% above current if not already set
  const propEl = document.getElementById('proj-proposed-repay');
  if (propEl && !propEl.dataset.seeded && totalRepay) { propEl.value = Math.round(totalRepay * 1.15); propEl.dataset.seeded='1'; }
}

function drawProjection() {
  _seedPlanningFields();
  const el = document.getElementById('chart-projection'); if (!el) return;
  const existingChart = Chart.getChart(el); if (existingChart) existingChart.destroy();
  const currentVal = propertiesData.reduce((s, p) => s + (p.estimated_value || 0), 0);
  const currentLoans = loansData.reduce((s, l) => s + (l.loan_balance || 0), 0);
  const nowYear = new Date().getFullYear();
  const HORIZON = 15;
  const years = Array.from({ length: HORIZON + 1 }, (_, i) => (nowYear + i).toString());

  // Read scenario inputs – fall back to real loan data if field is empty
  const growthRate = 1 + (parseFloat((document.getElementById('proj-growth')||{value:'7'}).value) / 100);
  const proposedRepay = parseFloat((document.getElementById('proj-proposed-repay')||{value:'0'}).value) || 0;
  const lumpSum = parseFloat((document.getElementById('proj-lump')||{value:'0'}).value) || 0;
  const avgRate = loansData.length ? (loansData.reduce((s,l)=>s+(l.interest_rate||0),0)/loansData.length) : 0.06;
  const rateVal = avgRate / 12;
  // Current repay = sum of per-property repay inputs, fallback to loan data
  const currentRepay = propertiesData.reduce((sum, prop) => {
    const scEl = document.getElementById('sc-repay-'+prop.id);
    const scVal = scEl ? parseFloat(scEl.value)||0 : 0;
    if (scVal) return sum + scVal;
    const loan = loansData.find(l=>l.property_id===prop.id);
    return sum + (loan ? loan.monthly_repayment||0 : 0);
  }, 0);
  // Current total value from scenario inputs (allow what-if property value changes)
  const scenarioTotalVal = propertiesData.reduce((sum, prop) => {
    const scEl = document.getElementById('sc-val-'+prop.id);
    return sum + (scEl ? parseFloat(scEl.value)||prop.estimated_value||0 : prop.estimated_value||0);
  }, 0) || currentVal;

  function projectLoan(loan, monthlyRepay, extraAnnual, months) {
    // Amortisation over time
    let bal = loan;
    const r = rateVal;
    for (let m = 0; m < months; m++) {
      const interest = bal * r;
      const principal = Math.max(0, monthlyRepay - interest);
      bal = Math.max(0, bal - principal);
      if (m % 12 === 11) bal = Math.max(0, bal - extraAnnual);
    }
    return bal;
  }

  const vals = [], baseLoans = [], propLoans = [], baseEqs = [], propEqs = [];
  let v = scenarioTotalVal;
  for (let i = 0; i <= HORIZON; i++) {
    vals.push(Math.round(v));
    const bLoan = projectLoan(currentLoans, currentRepay || (currentLoans * 0.005), 0, i * 12);
    const pLoan = projectLoan(currentLoans, proposedRepay || currentRepay || (currentLoans * 0.005), lumpSum, i * 12);
    baseLoans.push(Math.round(bLoan));
    propLoans.push(Math.round(pLoan));
    baseEqs.push(Math.round(v - bLoan));
    propEqs.push(Math.round(v - pLoan));
    v *= growthRate;
  }
  new Chart(el, {
    type: 'line',
    data: { labels: years, datasets: [
      { label: 'Portfolio value', data: vals, borderColor: '#2e3105', backgroundColor: 'rgba(46,49,5,0.05)', borderWidth: 2.5, fill: true, tension: 0.35, pointRadius: 2, pointBackgroundColor: '#2e3105' },
      { label: 'Equity (current)', data: baseEqs, borderColor: '#a8b87a', backgroundColor: 'transparent', borderWidth: 1.8, borderDash: [4,3], fill: false, tension: 0.35, pointRadius: 2 },
      { label: 'Equity (proposed)', data: propEqs, borderColor: '#3B6D11', backgroundColor: 'rgba(59,109,17,0.06)', borderWidth: 2.2, fill: false, tension: 0.35, pointRadius: 2 },
      { label: 'Debt (current)', data: baseLoans, borderColor: '#c8d060', backgroundColor: 'transparent', borderWidth: 1.5, fill: false, tension: 0.35, pointRadius: 2, borderDash: [2,2] },
    ] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => '$' + Math.round(c.raw / 1000000 * 10) / 10 + 'M' } } }, scales: { y: { ticks: { callback: v => '$' + Math.round(v / 1000000 * 10) / 10 + 'M', font: { size: 9 }, color: '#888' }, grid: { color: 'rgba(0,0,0,0.05)' }, border: { display: false }, min: 0 }, x: { ticks: { font: { size: 9 }, color: '#888' }, grid: { display: false }, border: { display: false } } } },
    plugins: []
  });
}

/* ── Nav ── */
const crumbMap = { overview:'Overview', portfolio:'Portfolio', research:'Research', planning:'Planning', alerts:'Alerts', notes:'Notes', profile:'My profile', documents:'Documents', settings:'Settings' };
function showPageSpinner(){const s=document.getElementById('page-spinner');s.classList.add('active');setTimeout(()=>s.classList.remove('active'),200);}
function switchTab(tab, skipNav) {
  showPageSpinner();
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById('pane-' + tab); if (pane) pane.classList.add('active');
  document.getElementById('tb-crumb').textContent = crumbMap[tab] || tab;
  document.getElementById('main-content').scrollTop = 0;
  if (!skipNav) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const nl = document.querySelector(`[data-tab="${tab}"]`); if (nl) nl.classList.add('active');
  }
  if (tab === 'planning') {
    setTimeout(() => {
      _seedPlanningFields();
      renderScenarios();
      if (!projDrawn) { drawProjection(); projDrawn = true; }
      drawScenarioDonut();
    }, 80);
  }
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sb-backdrop').classList.remove('visible');
}
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    switchTab(l.dataset.tab);
    if (window.innerWidth <= 768) closeMobileSidebar();
  });
});
document.getElementById('sb-toggle').addEventListener('click', () => {
  const sb = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    const isOpen = sb.classList.toggle('mobile-open');
    document.getElementById('sb-backdrop').classList.toggle('visible', isOpen);
  } else {
    sb.classList.toggle('collapsed');
  }
});
document.getElementById('sb-backdrop').addEventListener('click', closeMobileSidebar);

/* ── Profile panel ── */
document.getElementById('profile-btn').addEventListener('click', e => { e.stopPropagation(); document.getElementById('profile-panel').classList.toggle('open'); });
document.addEventListener('click', () => document.getElementById('profile-panel').classList.remove('open'));
document.getElementById('profile-panel').addEventListener('click', e => e.stopPropagation());
function openProfilePage(tab) {
  document.getElementById('profile-panel').classList.remove('open');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  switchTab(tab, true);
}

/* ── Auth ── */
document.getElementById('btn-login').addEventListener('click', doLogin);
document.getElementById('password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

async function doLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) { showLoginError(); return; }
  const btn = document.getElementById('btn-login');
  btn.textContent = 'Signing in…';
  const { error } = await _supabase.auth.signInWithPassword({ email, password });
  btn.textContent = 'Sign in';
  if (error) { console.error('Login error:', error); showLoginError(error.message || 'Login failed'); }
}


function showPasswordResetScreen() {
  document.getElementById('loading-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('forgot-screen').style.display = 'none';
  document.getElementById('reset-screen').style.display = 'flex';
}

async function setNewPassword() {
  const newPw = document.getElementById('new-password').value;
  const confirmPw = document.getElementById('confirm-password').value;
  const errEl = document.getElementById('reset-error');
  errEl.style.display = 'none';
  if (!newPw || newPw.length < 8) { errEl.textContent = 'Password must be at least 8 characters.'; errEl.style.display = 'block'; return; }
  if (newPw !== confirmPw) { errEl.textContent = 'Passwords do not match.'; errEl.style.display = 'block'; return; }
  const btn = document.getElementById('btn-set-password');
  btn.textContent = 'Saving\u2026'; btn.disabled = true;
  // Signal to onAuthStateChange the next event is post-save, not page-load
  _passwordJustSaved = true;
  const { error } = await _supabase.auth.updateUser({ password: newPw });
  if (error) {
    _passwordJustSaved = false;
    errEl.textContent = error.message;
    errEl.style.display = 'block';
    btn.textContent = 'Set password & log in';
    btn.disabled = false;
    return;
  }
  // Hide reset screen, show spinner — onAuthStateChange drives the rest
  document.getElementById('reset-screen').style.display = 'none';
  document.getElementById('loading-overlay').style.display = 'flex';
  showToast('Password set! Logging you in\u2026');
  // Safety fallback: force reload if auth events don\'t fire within 5s
  setTimeout(() => { if (_passwordJustSaved || _passwordResetMode) window.location.reload(); }, 5000);
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg || 'Incorrect email or password.';
  el.style.color = '#c0321f';
  el.style.display = 'block';
}
function showForgotScreen() {
  // Pre-fill email if already typed
  const loginEmail = document.getElementById('email').value.trim();
  if (loginEmail) document.getElementById('forgot-email').value = loginEmail;
  // Reset message state
  const msg = document.getElementById('forgot-msg');
  msg.style.display = 'none'; msg.textContent = '';
  const btn = document.getElementById('btn-send-reset');
  btn.textContent = 'Send reset link'; btn.disabled = false;
  // Show forgot screen
  document.getElementById('loading-overlay').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('forgot-screen').style.display = 'flex';
}
function hideForgotScreen() {
  document.getElementById('forgot-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
}
async function sendPasswordReset() {
  const email = document.getElementById('forgot-email').value.trim();
  const msg = document.getElementById('forgot-msg');
  const btn = document.getElementById('btn-send-reset');
  if (!email) { msg.textContent = 'Please enter your email address.'; msg.style.color = '#c0321f'; msg.style.display = 'block'; return; }
  btn.textContent = 'Sending…'; btn.disabled = true;
  const { error } = await _supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.hostname === 'portal.jrwfinance.com.au'
      ? 'https://portal.jrwfinance.com.au'
      : 'https://jrw-portal.netlify.app'
  });
  btn.textContent = 'Send reset link'; btn.disabled = false;
  if (error) { msg.textContent = error.message; msg.style.color = '#c0321f'; msg.style.display = 'block'; return; }
  msg.textContent = '✓ Reset link sent! Check your inbox.';
  msg.style.color = '#3B6D11';
  msg.style.display = 'block';
  btn.textContent = 'Resend link';
}

function setupRealtime(uid) {
  if (_realtimeChannel) _supabase.removeChannel(_realtimeChannel);
  _realtimeChannel = _supabase
    .channel('client-live-' + uid)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts', filter: `client_id=eq.${uid}` }, payload => {
      if (payload.new.dismissed) return;
      alertsData.unshift(payload.new);
      renderAlerts();
      showToast('📬 New alert from your broker');
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notes', filter: `client_id=eq.${uid}` }, payload => {
      if (!payload.new.is_broker_note) return;
      notesData.unshift(payload.new);
      renderNotes();
      showToast('📝 New note from your broker');
    })
    .subscribe();
}

document.getElementById('btn-signout').addEventListener('click', async () => {
  if (_realtimeChannel) { _supabase.removeChannel(_realtimeChannel); _realtimeChannel = null; }
  await _supabase.auth.signOut();
  chartsDrawn = false; projDrawn = false; selectedResearch = [];
  propertiesData = []; loansData = []; goalsData = []; notesData = [];
  alertsData = []; documentsData = []; researchData = [];
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector('[data-tab="overview"]').classList.add('active');
  switchTab('overview');
});

/* ── Display ── */
function showLoading() { document.getElementById('loading-overlay').style.display = 'flex'; document.getElementById('app').style.display = 'none'; document.getElementById('login-screen').style.display = 'none'; document.getElementById('forgot-screen').style.display = 'none'; document.getElementById('client-signup-screen').style.display = 'none'; }
function showApp() { document.getElementById('loading-overlay').style.display = 'none'; document.getElementById('app').style.display = 'flex'; document.getElementById('login-screen').style.display = 'none'; document.getElementById('forgot-screen').style.display = 'none'; }
function showLoginScreen() { document.getElementById('loading-overlay').style.display = 'none'; document.getElementById('app').style.display = 'none'; document.getElementById('forgot-screen').style.display = 'none'; document.getElementById('client-signup-screen').style.display = 'none'; document.getElementById('login-screen').style.display = 'flex'; }

/* ── Utility ── */
function fmt(n) { if (!n && n !== 0) return '$0'; return '$' + Math.round(n).toLocaleString('en-AU'); }
function fmtShort(n) { if (!n && n !== 0) return '$0'; if (n >= 1000000) return '$' + (n/1000000).toFixed(1) + 'M'; if (n >= 1000) return '$' + Math.round(n/1000) + 'k'; return '$' + Math.round(n); }
function parseCurrency(s) { return parseFloat(String(s || '').replace(/[^0-9.]/g, '')) || 0; }
function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function demoGuard() { if(isDemoMode){showToast('Demo mode – changes aren\'t saved');return true;} return false; }
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2e3105;color:#dfe777;padding:9px 20px;border-radius:8px;font-size:12px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.15);pointer-events:none;white-space:nowrap;max-width:90vw;overflow:hidden;text-overflow:ellipsis;';
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.4s'; setTimeout(() => t.remove(), 400); }, 2200);
}


/* ── Planning pill switch ── */
function switchPlanPill(which) {
  document.getElementById('plan-scenarios').style.display = which === 'scenarios' ? 'block' : 'none';
  document.getElementById('plan-tasks').style.display     = which === 'tasks'     ? 'block' : 'none';
  document.getElementById('pill-scenarios').classList.toggle('active', which === 'scenarios');
  document.getElementById('pill-tasks').classList.toggle('active', which === 'tasks');
  if (which === 'scenarios') { projDrawn = false; drawProjection(); drawScenarioDonut(); }
}

/* ── Render per-property scenario cards ── */
function renderScenarios() {
  // Stats row
  const tv = propertiesData.reduce((s,p)=>s+(p.estimated_value||0),0);
  const tl = loansData.reduce((s,l)=>s+(l.loan_balance||0),0);
  const te = tv - tl;
  const tm = loansData.reduce((s,l)=>s+(l.monthly_repayment||0),0);
  const statsEl = document.getElementById('scenario-stats');
  if (statsEl) statsEl.innerHTML = `
    <div class="stile"><div class="stile-label">Portfolio value</div><div class="stile-value">${fmt(tv)}</div><div class="stile-sub">${propertiesData.length} propert${propertiesData.length===1?'y':'ies'}</div></div>
    <div class="stile"><div class="stile-label">Total loans</div><div class="stile-value">${fmt(tl)}</div><div class="stile-sub">${loansData.length} loan${loansData.length===1?'':'s'}</div></div>
    <div class="stile"><div class="stile-label">Total equity</div><div class="stile-value" style="color:#3B6D11;">${fmt(te)}</div><div class="stile-sub">${tv>0?((te/tv)*100).toFixed(1):0}% of portfolio</div></div>
    <div class="stile"><div class="stile-label">Monthly repayments</div><div class="stile-value">${fmt(tm)}</div><div class="stile-sub">Current across all loans</div></div>`;

  // Per-property cards
  const propsEl = document.getElementById('scenario-props');
  if (!propsEl) return;
  if (!propertiesData.length) { propsEl.innerHTML = '<p style="font-size:12px;color:#888;">No properties yet. Your broker will add them for you.</p>'; return; }
  propsEl.innerHTML = propertiesData.map(prop => {
    const loan = loansData.find(l => l.property_id === prop.id);
    const eq = (prop.estimated_value||0) - (loan ? loan.loan_balance||0 : 0);
    const lvr = loan ? loan.lvr||'' : '';
    const rate = loan ? ((loan.interest_rate||0)*100).toFixed(2) : '';
    const repay = loan ? loan.monthly_repayment||'' : '';
    const isInv = prop.ownership_type === 'Investment';
    return `<div class="scenario-prop-card">
      <div class="scenario-prop-head">
        <div>
          <div class="scenario-prop-title">${esc(prop.address)}</div>
          <div style="font-size:10px;color:#888;margin-top:1px;">${esc(prop.suburb||'')} ${esc(prop.state||'')} &nbsp;·&nbsp; <span class="badge ${isInv?'badge-inv':'badge-ppor'}">${esc(prop.ownership_type||'PPOR')}</span></div>
        </div>
      </div>
      <div class="scenario-grid">
        <div class="scenario-field">
          <div class="scenario-field-label">Est. value</div>
          <div style="display:flex;align-items:center;gap:2px;"><span style="font-size:11px;color:#888;">$</span>
          <input class="scenario-field-input" id="sc-val-${prop.id}" type="number" value="${prop.estimated_value||''}" placeholder="850000" oninput="projDrawn=false;drawProjection();drawScenarioDonut();">
          </div>
          <div class="scenario-field-sub">Estimated market value</div>
        </div>
        <div class="scenario-field">
          <div class="scenario-field-label">Loan balance</div>
          <div style="display:flex;align-items:center;gap:2px;"><span style="font-size:11px;color:#888;">$</span>
          <input class="scenario-field-input" id="sc-loan-${prop.id}" type="number" value="${loan?loan.loan_balance||'':''}" placeholder="–" oninput="projDrawn=false;drawProjection();">
          </div>
          <div class="scenario-field-sub">Outstanding balance</div>
        </div>
        <div class="scenario-field" style="background:#eef5e8;">
          <div class="scenario-field-label" style="color:#27500A;">Equity</div>
          <div style="font-size:14px;font-weight:600;color:#27500A;margin-top:3px;">${fmt(eq)}</div>
          <div class="scenario-field-sub" style="color:#6a9040;">${(prop.estimated_value||0)>0?((eq/(prop.estimated_value||1))*100).toFixed(1):0}% of value</div>
        </div>
        <div class="scenario-field">
          <div class="scenario-field-label">Monthly repayment</div>
          <div style="display:flex;align-items:center;gap:2px;"><span style="font-size:11px;color:#888;">$</span>
          <input class="scenario-field-input" id="sc-repay-${prop.id}" type="number" value="${repay}" placeholder="–" oninput="projDrawn=false;drawProjection();">
          </div>
          <div class="scenario-field-sub">${rate?rate+'% '+((loan&&loan.rate_type)||''):'No loan'}</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── Scenario donut chart ── */
let scenarioDonutChart = null;
function drawScenarioDonut() {
  const el = document.getElementById('chart-scenario-donut'); if (!el) return;
  if (scenarioDonutChart) { scenarioDonutChart.destroy(); scenarioDonutChart = null; }
  const colors = ['#2e3105','#c8d060','#a8b87a','#7a9060','#d8dab8','#4a6020'];
  const labels = propertiesData.map(p => p.address);
  const values = propertiesData.map(p => {
    const sc = document.getElementById('sc-val-'+p.id);
    return parseFloat(sc ? sc.value : '') || p.estimated_value || 0;
  });
  if (!values.some(v => v > 0)) return;
  const legend = document.getElementById('scenario-donut-legend');
  if (legend) legend.innerHTML = labels.map((l,i) => `<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:#888;margin-bottom:2px;"><div style="width:8px;height:8px;border-radius:2px;background:${colors[i%colors.length]};flex-shrink:0;"></div>${esc(l)}</div>`).join('');
  scenarioDonutChart = new Chart(el, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 3 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => esc(c.label) + ': ' + fmt(c.raw) } } } }
  });
}

/* ── Demo mode entry ── */
function enterDemoMode() {
  isDemoMode = true;
  loadDemoData();
  showApp();
}

/* ── Session timeout (30 min inactivity) ── */
let _inactivityTimer;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
function resetInactivityTimer() {
  clearTimeout(_inactivityTimer);
  _inactivityTimer = setTimeout(async () => {
    if (isDemoMode) return;
    await _supabase.auth.signOut();
    showToast('Session expired – please sign in again');
  }, SESSION_TIMEOUT_MS);
}
['click','keydown','mousemove','touchstart'].forEach(ev =>
  document.addEventListener(ev, resetInactivityTimer, { passive: true })
);
resetInactivityTimer();


/* ── Client signup (invite link flow) ── */
function showClientSignupScreen(params) {
  if (params.get('first'))  document.getElementById('csign-first').value  = params.get('first');
  if (params.get('last'))   document.getElementById('csign-last').value   = params.get('last');
  if (params.get('email'))  document.getElementById('csign-email').value  = params.get('email');
  if (params.get('mobile')) document.getElementById('csign-mobile').value = params.get('mobile');
  document.getElementById('loading-overlay').style.display='none';
  document.getElementById('login-screen').style.display='none';
  document.getElementById('client-signup-screen').style.display='flex';
}
async function submitClientSignup() {
  const first  = document.getElementById('csign-first').value.trim();
  const last   = document.getElementById('csign-last').value.trim();
  const email  = document.getElementById('csign-email').value.trim();
  const mobile = document.getElementById('csign-mobile').value.trim();
  const pw     = document.getElementById('csign-pw').value;
  const pw2    = document.getElementById('csign-pw2').value;
  const msg    = document.getElementById('csign-msg');
  const btn    = document.getElementById('btn-csign');
  msg.style.display='none';
  if (!email || !pw) { msg.textContent='Please fill in all required fields.'; msg.style.color='#c0321f'; msg.style.display='block'; return; }
  if (pw.length < 8) { msg.textContent='Password must be at least 8 characters.'; msg.style.color='#c0321f'; msg.style.display='block'; return; }
  if (pw !== pw2)    { msg.textContent='Passwords do not match.'; msg.style.color='#c0321f'; msg.style.display='block'; return; }
  btn.textContent='Creating account…'; btn.disabled=true;
  const { data, error } = await _supabase.auth.signUp({ email, password: pw });
  if (error) { msg.textContent=error.message; msg.style.color='#c0321f'; msg.style.display='block'; btn.textContent='Create account'; btn.disabled=false; return; }
  if (data.user) {
    await _supabase.from('clients').insert({ id: data.user.id, email, first_name: first, last_name: last, mobile });
  }
  msg.textContent='✓ Account created! Check your email to confirm, then sign in.';
  msg.style.color='#3B6D11'; msg.style.display='block';
  btn.textContent='Done'; btn.disabled=true;
  setTimeout(() => { document.getElementById('client-signup-screen').style.display='none'; showLoginScreen(); }, 3000);
}

/* ── Detect invite link on page load ── */
(function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('invite') === 'client') {
    if (document.readyState !== 'loading') showClientSignupScreen(params);
    else document.addEventListener('DOMContentLoaded', () => showClientSignupScreen(params));
  }
})();

/* ── Back/forward cache fix — recover from frozen loading state ── */
window.addEventListener('pageshow', function(e) {
  if (e.persisted && document.getElementById('loading-overlay').style.display === 'flex') {
    _appLoading = false;
    _supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) _loadClientApp(session);
      else showLoginScreen();
    });
  }
});
