import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPA_URL   = Deno.env.get('SUPABASE_URL')!
const SUPA_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const payload = await req.json()
    const record  = payload.record  // the new alert or note row

    const sb = createClient(SUPA_URL, SUPA_KEY)

    // Get client email + name
    const { data: client } = await sb.from('clients')
      .select('first_name, last_name, email').eq('id', record.client_id).single()
    if (!client?.email) return new Response('no client', { status: 200 })

    // Get broker name
    const { data: broker } = await sb.from('brokers')
      .select('name').eq('id', record.broker_id).single()
    const brokerName = broker?.name || 'Your broker'

    const isAlert = payload.table === 'alerts'
    const subject = isAlert
      ? `New alert from ${brokerName}: ${record.title}`
      : `New message from ${brokerName}`
    const body = isAlert ? record.body : record.body

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'JRW Finance <noreply@jrwfinance.com.au>',
        to:   [client.email],
        subject,
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <img src="https://portal.jrwfinance.com.au/logo.png" width="64" style="border-radius:12px;margin-bottom:20px;">
            <h2 style="font-size:18px;color:#1a1f02;margin-bottom:8px;">Hi ${client.first_name},</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:16px;">${body}</p>
            <a href="https://portal.jrwfinance.com.au" style="display:inline-block;background:#2e3105;color:#dfe777;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
              View in portal
            </a>
            <p style="color:#aaa;font-size:11px;margin-top:24px;">JRW Finance Group · <a href="https://jrwfinance.com.au/privacy-policy" style="color:#aaa;">Privacy Policy</a></p>
          </div>
        `
      })
    })

    return new Response('ok', { status: 200 })
  } catch(e) {
    return new Response(String(e), { status: 500 })
  }
})