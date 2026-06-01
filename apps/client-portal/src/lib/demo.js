export const DEMO_DATA = {
  profile: {
    id: 'demo-client-001', first_name: 'Alex', last_name: 'Demo',
    email: 'testclient@jrwfinance.com.au', mobile: '0400 000 001',
    residential_address: '42 Test Street, Brisbane QLD 4000',
    broker_name: 'Josh Weiler', broker_email: 'jrwfinancegroup@gmail.com',
    client_since: 2023, photo_url: null,
  },
  properties: [
    { id: 'prop-001', client_id: 'demo-client-001', address: '42 Test Street', suburb: 'Brisbane', state: 'QLD', postcode: '4000', property_type: 'PPOR', estimated_value: 850000, weekly_rent: null, photo_url: null },
    { id: 'prop-002', client_id: 'demo-client-001', address: '18 Elm Road', suburb: 'New Farm', state: 'QLD', postcode: '4005', property_type: 'Investment', estimated_value: 620000, weekly_rent: 620, photo_url: null },
  ],
  loans: [
    { id: 'loan-001', client_id: 'demo-client-001', property_id: 'prop-001', lender: 'Commonwealth Bank', loan_balance: 595000, interest_rate: 5.89, rate_type: 'Fixed', fixed_expiry_date: new Date(Date.now()+120*86400000).toISOString().split('T')[0], loan_type: 'P&I', monthly_repayment: 3890 },
    { id: 'loan-002', client_id: 'demo-client-001', property_id: 'prop-002', lender: 'ANZ', loan_balance: 410000, interest_rate: 6.12, rate_type: 'Variable', fixed_expiry_date: null, loan_type: 'IO', monthly_repayment: 2090 },
  ],
  goals: [
    { id: 'goal-001', what: 'Refinance CBA loan to a better rate', why: 'Save $3k–$5k per year', status: 'On Track', progress: 35, target_date: new Date(Date.now()+60*86400000).toISOString().split('T')[0] },
    { id: 'goal-002', what: 'Purchase third investment property', why: 'Build passive income stream', status: 'Not Started', progress: 0, target_date: '2027-06-30' },
  ],
  notes: [
    { id: 'note-001', created_at: new Date(Date.now()-2*86400000).toISOString(), category: 'Strategy', body: 'Welcome to the JRW Finance client portal, Alex. Your portfolio is looking strong — your PPOR equity has grown nicely. Fixed rate review coming up, flagged as a goal.' },
    { id: 'note-002', created_at: new Date(Date.now()-86400000).toISOString(), category: 'General', body: 'Should I be considering fixing the ANZ loan too given where rates are heading?' },
  ],
  alerts: [
    { id: 'alert-001', created_at: new Date().toISOString(), title: 'Fixed rate expiry approaching', alert_type: 'urgent', dismissed: false, body: 'Your CBA loan at 42 Test Street comes off its fixed rate in ~4 months. Start your review 8 weeks before expiry.' },
    { id: 'alert-002', created_at: new Date().toISOString(), title: 'Equity milestone reached', alert_type: 'positive', dismissed: false, body: 'Combined portfolio equity has crossed $450,000 — great progress. This unlocks refinancing options worth reviewing.' },
  ],
  documents: [
    { id: 'doc-001', created_at: new Date(Date.now()-30*86400000).toISOString(), name: 'CBA Loan Contract 2023', url: null },
    { id: 'doc-002', created_at: new Date(Date.now()-60*86400000).toISOString(), name: 'Annual Portfolio Review 2024', url: null },
  ],
  research: [
    { id: 'res-001', address: '7/22 Brunswick Street', suburb: 'Fortitude Valley QLD 4006', asking_price: 595000, status: 'Shortlisted' },
  ],
}