import { fmt, fmtDate } from '@/lib/utils'
import { Card, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Building2, TrendingUp } from 'lucide-react'

function PropertyCard({ property, loans }) {
  const propLoans = loans.filter(l => l.property_id === property.id)
  const totalOwing = propLoans.reduce((s, l) => s + (l.loan_balance || 0), 0)
  const equity = (property.estimated_value || 0) - totalOwing
  const lvr = property.estimated_value > 0 ? (totalOwing / property.estimated_value * 100).toFixed(1) : null

  return (
    <Card className="mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 bg-brand-bg rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 size={16} className="text-brand-dark" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-gray-800 leading-tight">{property.address}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{property.suburb}, {property.state}</div>
          </div>
        </div>
        <Badge variant={property.property_type === 'PPOR' ? 'green' : 'amber'}>
          {property.property_type || 'Investment'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Est. Value</div>
          <div className="text-[14px] font-semibold text-gray-800">{fmt(property.estimated_value)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Owing</div>
          <div className="text-[14px] font-semibold text-gray-800">{fmt(totalOwing)}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2.5">
          <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Equity</div>
          <div className="text-[14px] font-semibold text-green-700">{fmt(equity)}</div>
        </div>
      </div>

      {lvr && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>LVR</span><span>{lvr}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-dark rounded-full transition-all" style={{ width: `${Math.min(parseFloat(lvr), 100)}%` }} />
          </div>
        </div>
      )}

      {propLoans.map(l => (
        <div key={l.id} className="border-t border-gray-100 pt-3 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium text-gray-700">{l.lender}</div>
              <div className="text-[11px] text-gray-400">{l.interest_rate}% · {fmt(l.monthly_repayment)}/mo</div>
            </div>
            <div className="text-right">
              <Badge variant={l.rate_type === 'Fixed' ? 'amber' : 'blue'}>{l.rate_type}</Badge>
              {l.fixed_expiry_date && (
                <div className="text-[10px] text-gray-400 mt-1">Expires {fmtDate(l.fixed_expiry_date)}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}

export function Portfolio({ data }) {
  const { properties, loans } = data

  if (properties.length === 0) {
    return (
      <div className="animate-fade-up">
        <div className="mb-5"><h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Portfolio</h1></div>
        <Card className="text-center py-12 text-gray-400 text-sm">No properties added yet.</Card>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-5">
        <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Portfolio</h1>
        <p className="text-[11px] text-gray-400 mt-0.5">{properties.length} {properties.length === 1 ? 'property' : 'properties'}</p>
      </div>
      {properties.map(p => <PropertyCard key={p.id} property={p} loans={loans} />)}
    </div>
  )
}