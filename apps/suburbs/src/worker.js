import { CITIES } from './cities.js'
import { TOWNS } from './towns.js'
import { renderPage } from './template.js'

const ALL_CITIES = { ...CITIES, ...TOWNS }

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const host = url.hostname // e.g. sydney.jrwfinance.com.au

    // Path-based routing takes priority (supports local dev: localhost:4104/melbourne)
    // Falls back to subdomain for production (melbourne.jrwfinance.com.au)
    const pathKey = url.pathname.replace(/^\//, '').split('/')[0].toLowerCase()
    const parts   = host.split('.')
    const subdomain = (pathKey && ALL_CITIES[pathKey])
      ? pathKey
      : (parts.length >= 3 ? parts[0].toLowerCase() : null)

    const city = subdomain ? ALL_CITIES[subdomain] : null

    if (!city) {
      return new Response(notFound(), {
        status: 404,
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      })
    }

    return new Response(renderPage(city), {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  },
}

function notFound() {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Not Found · JRW Finance</title>
  <meta http-equiv="refresh" content="3;url=https://jrwfinance.com.au" />
  <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#0d1002;color:#fff;flex-direction:column;gap:16px;}
  a{color:#dfe777;}</style></head>
  <body><h1>Page not found</h1><p>Redirecting to <a href="https://jrwfinance.com.au">jrwfinance.com.au</a>...</p></body></html>`
}
