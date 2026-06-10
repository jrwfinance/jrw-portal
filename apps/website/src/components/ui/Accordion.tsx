'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className={cn('divide-y divide-white/[0.06]', className)}>
      {items.map(({ question, answer }, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-start justify-between gap-6 py-6 text-left group"
          >
            <span
              className={cn(
                'font-display font-semibold leading-snug transition-colors',
                open === i ? 'text-brand-lime' : 'text-white/80 group-hover:text-white',
              )}
              style={{ fontSize: 'clamp(15px, 1.2vw, 17px)' }}
            >
              {question}
            </span>
            <span className="flex-shrink-0 mt-0.5">
              {open === i ? (
                <Minus size={16} className="text-brand-lime" />
              ) : (
                <Plus size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
              )}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="text-[14px] font-light text-white/50 leading-[1.8] pb-6 max-w-2xl">
                  {answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
