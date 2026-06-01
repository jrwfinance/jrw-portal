export const DEMO_CLIENTS = [
  { id:'demo-c1', first_name:'Alex', last_name:'Demo', email:'testclient@jrwfinance.com.au', mobile:'0400 000 001', client_since:2023, photo_url:null,
    properties:[
      { id:'prop-001', address:'42 Test Street', suburb:'Brisbane', state:'QLD', postcode:'4000', property_type:'House', ownership_type:'PPOR', estimated_value:850000 },
      { id:'prop-002', address:'18 Elm Road', suburb:'New Farm', state:'QLD', postcode:'4005', property_type:'Apartment', ownership_type:'Investment', estimated_value:620000, weekly_rent:620 },
    ],
    loans:[
      { id:'loan-001', property_id:'prop-001', lender:'Commonwealth Bank', loan_balance:595000, interest_rate:5.89, rate_type:'fixed', fixed_expiry_date: new Date(Date.now()+120*86400000).toISOString().split('T')[0], loan_type:'P&I', monthly_repayment:3890, lvr:70 },
      { id:'loan-002', property_id:'prop-002', lender:'ANZ', loan_balance:410000, interest_rate:6.12, rate_type:'variable', loan_type:'IO', monthly_repayment:2090, lvr:66 },
    ],
    goals:[
      { id:'goal-001', title:'Refinance CBA loan', what:'Refinance to a better rate', why:'Save $3k–$5k/yr', status:'In progress', progress:35, target_date: new Date(Date.now()+60*86400000).toISOString().split('T')[0] },
    ],
    notes:[
      { id:'note-001', created_at: new Date(Date.now()-2*86400000).toISOString(), category:'Portfolio review', body:'Welcome to the portal, Alex. Portfolio looking strong.', is_broker_note:true, author_name:'Josh Weiler' },
    ],
    alerts:[
      { id:'alert-001', created_at: new Date().toISOString(), title:'Fixed rate expiry approaching', alert_type:'urgent', body:'CBA loan at 42 Test Street comes off fixed rate in ~4 months.' },
    ],
    documents:[] },
  { id:'demo-c2', first_name:'Sarah', last_name:'Thompson', email:'sarah.t@example.com', mobile:'0411 222 333', client_since:2022, photo_url:null,
    properties:[{ id:'prop-003', address:'8 Maple Avenue', suburb:'Paddington', state:'QLD', postcode:'4064', property_type:'House', ownership_type:'PPOR', estimated_value:1150000 }],
    loans:[{ id:'loan-003', property_id:'prop-003', lender:'Westpac', loan_balance:720000, interest_rate:6.04, rate_type:'variable', loan_type:'P&I', monthly_repayment:4650, lvr:63 }],
    goals:[], notes:[], alerts:[], documents:[] },
  { id:'demo-c3', first_name:'Marcus', last_name:'Lee', email:'marcus.lee@example.com', mobile:'0422 555 777', client_since:2024, photo_url:null,
    properties:[{ id:'prop-004', address:'3 River Walk', suburb:'South Brisbane', state:'QLD', postcode:'4101', property_type:'Apartment', ownership_type:'PPOR', estimated_value:780000 }],
    loans:[{ id:'loan-004', property_id:'prop-004', lender:'NAB', loan_balance:560000, interest_rate:6.35, rate_type:'variable', loan_type:'P&I', monthly_repayment:3490, lvr:72 }],
    goals:[], notes:[], alerts:[], documents:[] },
]