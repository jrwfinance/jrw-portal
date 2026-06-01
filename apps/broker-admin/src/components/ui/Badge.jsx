import { cn } from '@/lib/utils'
const v = { green:'bg-[#EAF3DE] text-[#27500A] border-[#97C459]', amber:'bg-[#FAEEDA] text-[#633806] border-[#EF9F27]', blue:'bg-[#E6F1FB] text-[#0C447C] border-[#85B7EB]', grey:'bg-gray-100 text-gray-500 border-gray-300', red:'bg-red-50 text-red-600 border-red-200' }
export function Badge({ variant='grey', className, children }) {
  return <span className={cn('inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border', v[variant], className)}>{children}</span>
}
