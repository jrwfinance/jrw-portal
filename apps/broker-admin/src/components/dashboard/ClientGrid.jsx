import { useState } from 'react'
import { motion } from 'framer-motion'
import { fmt, initials } from '@/lib/utils'
import { Search, UserPlus } from 'lucide-react'

function ClientCard({ client, onClick }) {
  const totalValue = client.properties?.reduce((s,p)=>s+(p.estimated_value||0),0) || 0
  const totalOwing = client.loans?.reduce((s,l)=>s+(l.loan_balance||0),0) || 0
  const ini = initials(client.first_name, client.last_name)
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} whileHover={{y:-2}}
      onClick={onClick} className="bg-white border border-gray-200/80 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-300 transition-all">
      <div className="bg-brand-dark px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-lime flex items-center justify-center text-[12px] font-bold text-brand-dark flex-shrink-0">
          {client.photo_url ? <img src={client.photo_url} className="w-full h-full object-cover rounded-full"/> : ini}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#f0f4c0] leading-tight">{client.first_name} {client.last_name}</div>
          <div className="text-[10px] text-brand-muted truncate">{client.email}</div>
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-[9px] text-gray-400 uppercase tracking-wider">Portfolio</div>
            <div className="text-[12px] font-semibold text-gray-800 mt-0.5">{fmt(totalValue)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-[9px] text-gray-400 uppercase tracking-wider">Owing</div>
            <div className="text-[12px] font-semibold text-gray-800 mt-0.5">{fmt(totalOwing)}</div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">{client.properties?.length||0} {(client.properties?.length||0)===1?'property':'properties'}</span>
          <span className="text-[10px] text-gray-400">Client since {client.client_since||'–'}</span>
          {!client.onboarded_at && <span className="text-[9px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Invite pending</span>}
        </div>
      </div>
    </motion.div>
  )
}

export function ClientGrid({ clients, onSelect, onCreateClient, isDemo }) {
  const [q, setQ] = useState('')
  const filtered = clients.filter(c =>
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(q.toLowerCase())
  )
  const totalProps  = clients.reduce((s,c)=>s+(c.properties?.length||0),0)
  const totalLoans  = clients.reduce((s,c)=>s+(c.loans?.length||0),0)
  const totalPortfolio = clients.reduce((s,c)=>s+c.properties?.reduce((ss,p)=>ss+(p.estimated_value||0),0),0)

  return (
    <div className="flex-1 overflow-y-auto p-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[['Clients', clients.length],['Properties', totalProps],['Loans', totalLoans],['Total portfolio', fmt(totalPortfolio)]].map(([l,v])=>(
          <div key={l} className="bg-white border border-gray-200/80 rounded-xl px-4 py-3">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{l}</div>
            <div className="text-[22px] font-semibold text-gray-900 tracking-tight">{v}</div>
          </div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search clients…"
            className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-brand-dark bg-white"/>
        </div>
        {!isDemo && (
          <button onClick={onCreateClient}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-dark text-brand-lime text-[12px] font-semibold rounded-lg hover:bg-brand-darker transition-colors">
            <UserPlus size={13}/> New client
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0
        ? <div className="text-center py-16 text-gray-400 text-sm">No clients found.</div>
        : <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
            {filtered.map(c=><ClientCard key={c.id} client={c} onClick={()=>onSelect(c)}/>)}
          </div>
      }
    </div>
  )
}