import { fmt, fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function Overview({ client, props, loans, alerts, onDeleteAlert, onAddAlert }) {
  const tv = props.reduce((s,p)=>s+(p.estimated_value||0),0)
  const tl = loans.reduce((s,l)=>s+(l.loan_balance||0),0)
  const eq = tv - tl
  const avgRate = loans.length ? (loans.reduce((s,l)=>s+(l.interest_rate||0),0)/loans.length).toFixed(2) : null

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[['Portfolio value',fmt(tv)],['Total equity',fmt(eq)],['Avg rate', avgRate?avgRate+'%':'–']].map(([l,v])=>(
          <div key={l} className="bg-gray-50 rounded-xl p-3">
            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">{l}</div>
            <div className="text-[18px] font-semibold text-gray-800">{v}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Active alerts {alerts.length>0 && <span className="ml-1 bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-full">{alerts.length}</span>}
          </div>
          <button onClick={onAddAlert} className="text-[11px] font-medium text-brand-dark border border-brand-dark/20 px-3 py-1 rounded-lg hover:bg-brand-bg transition-colors">
            + Send alert
          </button>
        </div>
        {alerts.length===0
          ? <p className="text-[12px] text-gray-400 text-center py-4">No active alerts.</p>
          : alerts.map(a=>(
            <div key={a.id} className={`flex gap-3 p-3 rounded-xl mb-2 border ${a.alert_type==='urgent'?'bg-amber-50 border-amber-200':a.alert_type==='positive'?'bg-green-50 border-green-200':'bg-blue-50 border-blue-200'}`}>
              <div className="flex-1">
                <div className="text-[12px] font-semibold text-gray-800">{a.title}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{a.body}</div>
              </div>
              <button onClick={()=>onDeleteAlert(a.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors self-start">×</button>
            </div>
          ))
        }
      </Card>

      {/* Properties */}
      <Card>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Properties</div>
        {props.length===0
          ? <p className="text-[12px] text-gray-400 text-center py-4">No properties yet.</p>
          : props.map(p=>{
            const loan = loans.find(l=>l.property_id===p.id)
            const eq2 = (p.estimated_value||0)-(loan?.loan_balance||0)
            return (
              <div key={p.id} className="border border-gray-100 rounded-xl p-3 mb-2 last:mb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">{p.address}</div>
                    <div className="text-[11px] text-gray-400">{p.suburb} {p.state}</div>
                  </div>
                  <Badge variant={p.ownership_type==='PPOR'?'green':'amber'}>{p.ownership_type||'PPOR'}</Badge>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mb-2">
                  <div className="h-full bg-brand-dark rounded-full" style={{width:`${p.estimated_value>0?Math.min(100,(eq2/p.estimated_value)*100):0}%`}}/>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-green-700 font-medium">Equity {fmt(eq2)}</span>
                  {loan && <span className="text-gray-400">{loan.rate_type} · {loan.lender}</span>}
                </div>
              </div>
            )
          })
        }
      </Card>
    </div>
  )
}