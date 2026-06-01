import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

const statusVariant = { 'In progress':'amber','On track':'green','Planning':'grey','Long-term':'grey','Complete':'blue' }
const statuses = ['Planning','In progress','On track','Long-term','Complete']

export function Planning({ client, goals, isDemo, onRefresh }) {
  const { show: toast } = useToast()

  async function saveGoal(id, updates) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    const { error } = await supabase.from('goals').update(updates).eq('id', id)
    if (error) toast('Save failed', 'error')
    else onRefresh()
  }

  async function deleteGoal(id) {
    if (isDemo) { toast('Demo mode — changes not saved'); return }
    if (!confirm('Delete this goal?')) return
    await supabase.from('goals').delete().eq('id', id)
    toast('Goal deleted'); onRefresh()
  }

  if (goals.length === 0) return <Card className="text-center py-12 text-gray-400 text-sm">No goals yet.</Card>

  return (
    <div className="space-y-3 animate-fade-up">
      {goals.map(g => {
        const progress = g.progress ?? 0
        const targetDate = g.target_date ? new Date(g.target_date) : null
        const daysLeft = targetDate ? Math.ceil((targetDate - new Date()) / 86400000) : null
        return (
          <Card key={g.id}>
            <div className="flex items-start justify-between mb-3">
              <div className="font-semibold text-[13px] text-gray-800 flex-1 mr-2">{g.what || g.title}</div>
              <div className="flex items-center gap-2">
                <select value={g.status||'Planning'} onChange={e=>saveGoal(g.id,{status:e.target.value})}
                  className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                  {statuses.map(s=><option key={s}>{s}</option>)}
                </select>
                <button onClick={()=>deleteGoal(g.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors">×</button>
              </div>
            </div>

            {/* Progress slider */}
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>Progress</span><span className="font-semibold text-brand-dark">{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full mb-2">
                <div className="h-full bg-brand-dark rounded-full transition-all" style={{width:`${progress}%`}}/>
              </div>
              <input type="range" min="0" max="100" step="5" defaultValue={progress}
                onMouseUp={e=>saveGoal(g.id,{progress:parseInt(e.target.value)})}
                onTouchEnd={e=>saveGoal(g.id,{progress:parseInt(e.target.value)})}
                className="w-full accent-brand-dark cursor-pointer"/>
            </div>

            {/* Target date */}
            <div className="flex items-center gap-2 mb-3 text-[11px]">
              <span className="text-gray-400">Target:</span>
              {targetDate
                ? <><span className={`font-medium ${daysLeft!==null&&daysLeft<30?'text-red-600':daysLeft!==null&&daysLeft<90?'text-amber-600':'text-gray-700'}`}>{fmtDate(g.target_date)}</span>
                    {daysLeft!==null && <span className="text-gray-400">({daysLeft>0?`${daysLeft}d`:daysLeft===0?'today':'overdue'})</span>}</>
                : <span className="text-gray-400">Not set</span>
              }
              <input type="date" value={g.target_date||''} onChange={e=>saveGoal(g.id,{target_date:e.target.value})}
                className="ml-auto text-[11px] border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:border-brand-dark"/>
            </div>

            {/* Goal details */}
            {g.why && <div className="text-[11px] text-gray-500 bg-gray-50 rounded-lg px-3 py-2"><span className="font-medium text-gray-600">Why: </span>{g.why}</div>}
          </Card>
        )
      })}
    </div>
  )
}