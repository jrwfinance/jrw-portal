import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_KEY = Deno.env.get('RESEND_API_KEY')!
const TO_EMAIL   = 'hello@jrwfinance.com.au'
const FROM_EMAIL = 'JRW Finance Website <noreply@jrwfinance.com.au>'

const CORS = {
  'Access-Control-Allow-Origin':  'https://jrwfinance.com.au',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS })
  }

  try {
    const { name, email, phone, message, enquiry } = await req.json()

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const enquiryLabel: Record<string, string> = {
      'general':    'General enquiry',
      'home-loan':  'Home loan',
      'investment': 'Investment loan',
      'refinance':  'Refinancing',
      'first-home': 'First home buyer',
      'smsf':       'SMSF loan',
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to:   [TO_EMAIL],
        reply_to: email,
        subject:  `New enquiry: ${enquiryLabel[enquiry] ?? enquiry} — ${name}`,
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#f9f9f9;">
            <div style="background:#fff;border-radius:12px;padding:28px;border:1px solid #e8e8e8;">
              <img src="https://jrwfinance.com.au/logo.png" width="48" style="border-radius:8px;margin-bottom:20px;">
              <h2 style="font-size:18px;color:#0d1002;margin:0 0 4px;">New website enquiry</h2>
              <p style="font-size:12px;color:#999;margin:0 0 24px;">${enquiryLabel[enquiry] ?? enquiry}</p>
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #f0f0f0;width:100px;">Name</td><td style="padding:8px 0;font-size:14px;color:#222;border-bottom:1px solid #f0f0f0;">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #f0f0f0;">Email</td><td style="padding:8px 0;font-size:14px;color:#222;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}" style="color:#2e3105;">${email}</a></td></tr>
                ${phone ? `<tr><td style="padding:8px 0;color:#888;font-size:13px;border-bottom:1px solid #f0f0f0;">Phone</td><td style="padding:8px 0;font-size:14px;color:#222;border-bottom:1px solid #f0f0f0;">${phone}</td></tr>` : ''}
              </table>
              <div style="background:#f8f8f8;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="font-size:12px;color:#888;margin:0 0 8px;">Message</p>
                <p style="font-size:14px;color:#333;line-height:1.6;margin:0;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <a href="mailto:${email}?subject=Re: Your enquiry with JRW Finance" style="display:inline-block;background:#2e3105;color:#dfe777;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:13px;">
                Reply to ${name.split(' ')[0]}
              </a>
            </div>
            <p style="color:#bbb;font-size:11px;text-align:center;margin-top:16px;">Sent from jrwfinance.com.au contact form</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: 'Email send failed' }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    // Send auto-reply to enquirer
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to:   [email],
        subject: 'We received your enquiry — JRW Finance',
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
            <img src="https://jrwfinance.com.au/logo.png" width="48" style="border-radius:8px;margin-bottom:20px;">
            <h2 style="font-size:18px;color:#0d1002;margin:0 0 8px;">Thanks, ${name.split(' ')[0]}.</h2>
            <p style="color:#555;line-height:1.6;margin-bottom:16px;">We have received your message and will be in touch within one business day.</p>
            <p style="color:#555;line-height:1.6;margin-bottom:24px;">If you would prefer to speak sooner, book a time that suits you below.</p>
            <a href="https://outlook.office365.com/book/JRWFinanceStrategycall@jrwfinancegroup.com.au/" style="display:inline-block;background:#2e3105;color:#dfe777;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:13px;">
              Book a strategy call
            </a>
            <p style="color:#aaa;font-size:11px;margin-top:28px;line-height:1.6;">
              JRW Finance Group Pty Ltd · ABN 57 691 406 318 · Credit Rep 574207<br>
              <a href="https://jrwfinance.com.au/privacy" style="color:#aaa;">Privacy Policy</a>
            </p>
          </div>
        `,
      }),
    }).catch(() => {}) // auto-reply failure is non-critical

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
