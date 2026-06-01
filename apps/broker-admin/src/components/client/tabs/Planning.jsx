import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { AddGoalModal } from '../AddGoalModal'
import { Plus } from 'lucide-react'

const statuses = ['Planning','In progress','On track','Long-term','Complete']

export function Planning({ client, goals, broker, isDemo, onRefresh }) {
  const [showAdd, setShowAdd] = useState(false)
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

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-gray-700">{goals.length} goal{goals.length!==1?'s':''}</span>
        {!isDemo && (
          <button onClick={()=>setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark text-brand-lime text-[11px] font-semibold rounded-lg hover:bg-brand-darker transition-colors">
            <Plus size={12}/> Add goal
          </button>
        )}
      </div>

      {goals.length === 0 && <Card className="text-center py-12 text-gray-400 text-sm">No goals yet.</Card>}

      {goals.map(g => {
        const progress = g.progress ?? 0
        const targetDate = g.target_date ? new Date(g.target_date) : null
        const daysLeft = targetDate ? Math.ceil((targetDate - new Date()) / 86400000) : null
        return (
          <Card key={g.id} className="mb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 mr-2">
                <div className="font-semibold text-[13px] text-gray-800">{g.what || g.title}</div>
                {g.why && <div className="text-[11px] text-gray-400 mt-0.5">{g.why}</div>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <select value={g.status||'Planning'} onChange={e=>saveGoal(g.id,{status:e.target.value})}
                  className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                  {statuses.map(s=><option key={s}>{s}</option>)}
                </select>
                <button onClick={()=>deleteGoal(g.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none transition-colors">×</button>
              </div>
            </div>

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

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-gray-400">Target:</span>
              {targetDate
                ? <><span className={`font-medium ${daysLeft!==null&&daysLeft<30?'text-red-600':daysLeft!==null&&daysLeft<90?'text-amber-600':'text-gray-700'}`}>{fmtDate(g.target_date)}</span>
                    {daysLeft!==null && <span className="text-gray-400">({daysLeft>0?`${daysLeft}d`:daysLeft===0?'today':'overdue'})</span>}</>
                : <span className="text-gray-400">Not set</span>
              }
              <input type="date" value={g.target_date||''} onChange={e=>saveGoal(g.id,{target_date:e.target.value})}
                className="ml-auto text-[11px] border border-gray-200 rounded px-2 py-0.5 focus:outline-none focus:border-brand-dark"/>
            </div>
          </Card>
        )
      })}

      {showAdd && <AddGoalModal client={client} broker={broker} onClose={()=>setShowAdd(false)} onCreated={onRefresh}/>}
    </div>
  )
}