// City hero photos — replace with owned photography when available
const CITY_PHOTOS = {
  sydney:    'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&w=1200&q=85',
  melbourne: 'https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=1200&q=85',
  brisbane:  'https://images.unsplash.com/photo-1612530994878-e7a98ccd9b45?auto=format&fit=crop&w=1200&q=85',
  perth:     'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=85',
  adelaide:  'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=1200&q=85',
  canberra:  'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1200&q=85',
  hobart:    'https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?auto=format&fit=crop&w=1200&q=85',
  darwin:    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=85',
}

const BOOK_URL    = 'https://outlook.office.com/book/JRWFinanceIntroduction@jrwfinance.com.au/?ismsaljsauthenabled'
const WEBSITE_URL = 'https://jrwfinance.com.au'
const EMAIL       = 'hello@jrwfinance.com.au'
const ABN         = '57 691 406 318'
const CREDIT_REP  = 'Credit Representative 574207 authorised under Australian Credit Licence 486112'
const ADDRESS     = 'Suite 302, 13/15 Wentworth Ave, Sydney NSW 2000'

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/jrw.finance',                    fa: 'fa-brands fa-instagram' },
  { label: 'TikTok',    href: 'https://tiktok.com/@jrwfinance',                       fa: 'fa-brands fa-tiktok' },
  { label: 'YouTube',   href: 'https://youtube.com/@jrwfinance',                      fa: 'fa-brands fa-youtube' },
  { label: 'Facebook',  href: 'https://facebook.com/jrwfinance',                      fa: 'fa-brands fa-facebook-f' },
  { label: 'X',         href: 'https://x.com/jrwfinance_', fa: 'fa-brands fa-x-twitter' },
]

const LENDERS = ['360 MMS', 'Allium Money by Brighten', 'AMP', 'ANZ', 'Auswide Bank', 'Arthurmac', 'Axis Lending', 'Bank of China', 'Bank of Sydney', 'Bankwest', 'Bendigo Bank', 'Beyond Bank', 'Bluebay', 'Bluestone', 'CommBank', 'Deposit Assure', 'Firstmac', 'Funding', 'Gateway Bank', 'Granite Home Loans', 'Great Southern Bank', 'ING', 'La Trobe Financial', 'Latitude', 'Liberty Financial', 'MA Money', 'ME Bank', 'Mortgage Ezy', 'MOVE Bank', 'NAB', 'NOW Finance', 'ORDE', 'Paramount', 'Pepper Money', 'Prospa', 'Qudos Bank', 'RedZed', 'Resimac', 'St.George Bank', 'Suncorp', 'Thinktank', 'Ubank', 'Valiant Finance', 'Westpac', 'Wisr', 'WLTH']

const TOOL_LINKS = [
  { label: 'Deposit calculator',       path: '/deposit-calculator',    icon: 'fa-solid fa-piggy-bank' },
  { label: 'Refinance calculator',     path: '/refinance-calculator',  icon: 'fa-solid fa-rotate' },
  { label: 'Rent vs buy calculator',   path: '/rent-vs-buy-calculator', icon: 'fa-solid fa-scale-balanced' },
  { label: 'Stamp duty calculator',    path: '/stamp-duty-calculator', icon: 'fa-solid fa-file-invoice-dollar' },
]

const LOGO_URI = `data:image/webp;base64,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Y2hUeXBlPjI8L0F0dHJpYjpUb3VjaFR5cGU+CiAgICA8L3JkZjpsaT4KICAgPC9yZGY6U2VxPgogIDwvQXR0cmliOkFkcz4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6ZGM9J2h0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvJz4KICA8ZGM6dGl0bGU+CiAgIDxyZGY6QWx0PgogICAgPHJkZjpsaSB4bWw6bGFuZz0neC1kZWZhdWx0Jz5KUlcgRmluYW5jZSAtIDI8L3JkZjpsaT4KICAgPC9yZGY6QWx0PgogIDwvZGM6dGl0bGU+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOnBkZj0naHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyc+CiAgPHBkZjpBdXRob3I+Sm9zaHVhIFdlaWxlcjwvcGRmOkF1dGhvcj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvJz4KICA8eG1wOkNyZWF0b3JUb29sPkNhbnZhIChSZW5kZXJlcikgZG9jPURBRzB5MnZsLXV3IHVzZXI9VUFEa1BNNUM3ZmcgYnJhbmQ9QkFEa1BKc3BGcTggdGVtcGxhdGU9PC94bXA6Q3JlYXRvclRvb2w+CiA8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KPD94cGFja2V0IGVuZD0ncic/Pg==`

export function renderPage(city, {} = {}) {
  const title        = `Mortgage Broker ${city.name} | ${city.name} Home Loans | JRW Finance`
  const desc         = `Expert mortgage advice for ${city.name} buyers, investors and refinancers. Compare 40+ lenders and get ${city.state} home loan strategy from JRW Finance.`
  const canonicalUrl = `https://${city.name.toLowerCase()}.jrwfinance.com.au`
  const year         = new Date().getFullYear()
  const cityKey      = city.name.toLowerCase()
  const photo        = CITY_PHOTOS[cityKey] || CITY_PHOTOS.sydney

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FinancialService',
        name: 'JRW Finance',
        description: `Mortgage broker serving ${city.name}, ${city.stateFullName}`,
        url: canonicalUrl,
        email: EMAIL,
        areaServed: { '@type': 'City', name: city.name, containedIn: city.stateFullName },
        address: { '@type': 'PostalAddress', streetAddress: ADDRESS, addressCountry: 'AU' },
        founder: { '@type': 'Person', name: 'Josh Weiler' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: city.faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  })

  const areasPills = city.suburbLinks.map(s =>
    `<span class="area-pill">${s}</span>`
  ).join('')

  const lenderMarquee = [...LENDERS, ...LENDERS].map(l =>
    `<span class="lender-item">${l}</span>`
  ).join('<span class="lender-dot">&#8226;</span>')

  const socialIcons = SOCIALS.map(s =>
    `<a class="social-btn" href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}"><i class="${s.fa}"></i></a>`
  ).join('')

  const faqItems = city.faqs.map((f, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-trigger" onclick="toggleFaq(${i})" aria-expanded="false" aria-controls="faq-body-${i}">
        <span class="faq-q-text">${f.q}</span>
        <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
      </button>
      <div class="faq-body" id="faq-body-${i}" role="region" aria-label="${f.q}">
        <p>${f.a}</p>
      </div>
    </div>`).join('')

  const toolCards = TOOL_LINKS.map(t => `
    <a class="tool-card" href="${WEBSITE_URL}${t.path}" target="_blank" rel="noopener">
      <span class="tool-icon"><i class="${t.icon}"></i></span>
      <span class="tool-label">${t.label}</span>
      <span class="tool-arrow"><i class="fa-solid fa-arrow-right"></i></span>
    </a>`).join('')

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta name="robots" content="index, follow" />
  <script type="application/ld+json">${schema}</script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

  <style>
    /* ─── Reset & tokens ─────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:       #0b0e02;
      --surface:  #141901;
      --surface2: #1c2202;
      --lime:     #dfe777;
      --lime-dim: #b8c14f;
      --text:     #eef0e4;
      --muted:    #8d9961;
      --muted-dark: #4a5a28;
      --border:   rgba(223,231,119,.12);

      --font-display: 'Bricolage Grotesque', sans-serif;
      --font-body:    'Barlow', sans-serif;
      --font-mono:    'JetBrains Mono', monospace;

      --r: 10px;
      --r-lg: 18px;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--text);
      font-size: 17px;
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    a { color: inherit; text-decoration: none; }
    img { display: block; max-width: 100%; }

    /* ─── Animations ──────────────────────────────────── */
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes pulse-border {
      0%, 100% { border-color: rgba(223,231,119,.15); }
      50%       { border-color: rgba(223,231,119,.4); }
    }

    .reveal {
      opacity: 1;
      transform: translateY(0);
    }
    .js-ready .reveal {
      opacity: 0;
      transform: translateY(12px);
      transition: opacity .2s ease, transform .2s ease;
    }
    .js-ready .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    @media (prefers-reduced-motion: reduce) {
      .js-ready .reveal { transition: none; }
    }

    /* ─── BUTTONS ────────────────────────────────────── */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--lime);
      color: #0b0e02;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 600;
      padding: 10px 22px;
      border-radius: 100px;
      border: none;
      cursor: pointer;
      transition: background .2s, transform .15s;
      white-space: nowrap;
    }
    .btn-primary:hover { background: #cdd961; transform: translateY(-1px); transition-duration: .1s; }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: var(--lime);
      font-size: 14px;
      font-weight: 500;
      padding: 9px 20px;
      border-radius: 100px;
      border: 1px solid rgba(223,231,119,.35);
      cursor: pointer;
      transition: border-color .1s, background .1s;
    }
    .btn-ghost:hover {
      border-color: var(--lime);
      background: rgba(223,231,119,.06);
    }

    /* ─── HERO ────────────────────────────────────────── */
    .hero {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 88vh;
      padding: 80px 5vw 80px 5vw;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }
    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 70% 60% at 10% 50%, rgba(223,231,119,.06) 0%, transparent 65%);
      pointer-events: none;
    }

    /* Hero content — single column, full width */
    .hero-left {
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 860px;
    }
    .hero-main { display: flex; flex-direction: column; }

    .hero-logo { display: block; height: 36px; width: auto; margin-bottom: 32px; }

    .hero-h1 {
      font-family: var(--font-display);
      font-size: clamp(48px, 6.5vw, 88px);
      font-weight: 800;
      line-height: 1.0;
      letter-spacing: -.04em;
      color: var(--text);
      margin-bottom: 28px;
      text-wrap: balance;
    }
    .hero-h1 em {
      font-style: normal;
      color: var(--lime);
    }

    .hero-sub {
      font-size: 18px;
      color: var(--muted);
      max-width: 620px;
      margin-bottom: 36px;
      line-height: 1.7;
    }

    .hero-ctas {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }
    .btn-primary.lg { font-size: 15px; padding: 13px 28px; }
    .btn-ghost.lg   { font-size: 15px; padding: 12px 26px; }

    .hero-trust {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--muted);
    }
    .trust-item i { color: var(--lime); font-size: 11px; }
    .trust-sep {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(223,231,119,.3);
      flex-shrink: 0;
    }


    /* ─── LENDER BAR ──────────────────────────────────── */
    .lender-bar {
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      padding: 18px 0;
      overflow: hidden;
    }
    .lender-track {
      display: flex;
      align-items: center;
      gap: 0;
      width: max-content;
      animation: marquee 90s linear infinite;
      will-change: transform;
    }
    .lender-bar:hover .lender-track { animation-play-state: paused; }
    @media (prefers-reduced-motion: reduce) {
      .lender-track { animation: none; }
      .grant-card { animation: none; }
    }
    .lender-item {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .02em;
      color: var(--muted);
      padding: 0 24px;
    }
    .lender-dot {
      color: var(--border);
      font-size: 10px;
    }

    /* ─── SECTION WRAPPER ─────────────────────────────── */
    .section { padding: 96px 5vw; }
    .section-alt { background: var(--surface); }
    .section-alt2 { background: var(--surface2); }

    .section-h2 {
      font-family: var(--font-display);
      font-size: clamp(30px, 3.5vw, 52px);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -.04em;
      color: var(--text);
      margin-bottom: 20px;
      text-wrap: balance;
    }
    .section-h2 em {
      font-style: normal;
      color: var(--lime);
    }

    .section-intro {
      font-size: 17px;
      color: var(--muted);
      max-width: 600px;
      line-height: 1.7;
      margin-bottom: 52px;
    }

    /* ─── WHY US ──────────────────────────────────────── */
    .why-top {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: start;
      margin-bottom: 56px;
    }
    .why-features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      overflow: hidden;
    }
    .why-feature {
      background: var(--surface);
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-right: 1px solid var(--border);
    }
    .why-feature:last-child { border-right: none; }
    .why-feature-num {
      font-family: var(--font-display);
      font-size: 56px;
      font-weight: 800;
      letter-spacing: -.04em;
      color: rgba(223,231,119,.15);
      line-height: 1;
    }
    .why-feature-h {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.3;
      letter-spacing: -.02em;
    }
    .why-feature-body {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.7;
    }
    .why-content .section-intro { margin-bottom: 32px; }

    .checklist {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 36px;
    }
    .checklist li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 15px;
      color: var(--text);
      line-height: 1.5;
    }
    .checklist li i {
      color: var(--lime);
      font-size: 13px;
      margin-top: 3px;
      flex-shrink: 0;
    }

    .social-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .social-label {
      font-size: 13px;
      color: var(--muted);
      margin-right: 4px;
    }
    .social-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 14px;
      transition: color .1s, border-color .1s, background .1s;
    }
    .social-btn:hover {
      color: var(--lime);
      border-color: rgba(223,231,119,.35);
      background: rgba(223,231,119,.06);
    }

    /* ─── MARKET SNAPSHOT ────────────────────────────── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      background: var(--border);
      border-radius: var(--r-lg);
      overflow: hidden;
      margin-bottom: 48px;
    }
    .stat-card {
      background: var(--surface2);
      padding: 36px 32px;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--lime) 0%, transparent 100%);
    }
    .stat-value {
      font-family: var(--font-display);
      font-size: clamp(32px, 3.5vw, 48px);
      color: var(--lime);
      font-weight: 800;
      letter-spacing: -.04em;
      line-height: 1;
      margin-bottom: 8px;
    }
    .stat-label {
      font-family: var(--font-mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .1em;
      color: var(--muted);
    }

    .market-context {
      background: rgba(223,231,119,.07);
      border: 1px solid rgba(223,231,119,.2);
      border-radius: var(--r);
      padding: 28px 32px;
      margin-bottom: 0;
    }
    .market-context-label {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: .1em;
      text-transform: uppercase;
      color: var(--lime);
      margin-bottom: 10px;
    }
    .market-context p { font-size: 15px; color: var(--muted); line-height: 1.7; }

    /* ─── CASE STUDIES ────────────────────────────────── */
    .cases-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .case-card {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 32px 28px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: border-color .1s, transform .1s;
    }
    .case-card:hover {
      border-color: rgba(223,231,119,.3);
      transform: translateY(-4px);
    }
    .case-tag {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--lime);
      background: rgba(223,231,119,.08);
      padding: 4px 10px;
      border-radius: 4px;
      width: fit-content;
    }
    .case-h {
      font-size: 17px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.4;
    }
    .case-body {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.65;
      flex: 1;
    }
    .case-result {
      font-size: 13px;
      font-weight: 500;
      color: var(--lime);
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }
    .case-result i { font-size: 11px; }
    .cases-cta {
      margin-top: 48px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 36px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      flex-wrap: wrap;
    }
    .cases-cta-h {
      font-family: var(--font-display);
      font-size: clamp(18px, 2vw, 24px);
      font-weight: 700;
      letter-spacing: -.03em;
      color: var(--text);
      margin-bottom: 6px;
    }
    .cases-cta-sub {
      font-size: 14px;
      color: var(--muted);
      max-width: 480px;
    }

    /* ─── GRANTS ──────────────────────────────────────── */
    .grants-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .grant-card {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 36px 32px;
      animation: pulse-border 5s ease-in-out infinite;
    }
    .grant-amount {
      font-family: var(--font-display);
      font-size: 52px;
      font-weight: 800;
      color: var(--lime);
      line-height: 1;
      margin-bottom: 8px;
      letter-spacing: -.04em;
    }
    .grant-name {
      font-size: 15px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 12px;
    }
    .grant-body {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.7;
    }

    /* ─── TOOLS ───────────────────────────────────────── */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .tool-card {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: var(--r);
      padding: 22px 20px;
      cursor: pointer;
      transition: border-color .1s, background .1s, transform .1s;
    }
    .tool-card:hover {
      border-color: rgba(223,231,119,.3);
      background: rgba(223,231,119,.04);
      transform: translateY(-2px);
    }
    .tool-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(223,231,119,.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--lime);
      font-size: 16px;
      flex-shrink: 0;
    }
    .tool-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text);
      flex: 1;
      line-height: 1.35;
    }
    .tool-arrow {
      color: var(--muted);
      font-size: 12px;
      transition: transform .1s, color .1s;
    }
    .tool-card:hover .tool-arrow { transform: translateX(3px); color: var(--lime); }

    /* ─── FAQ ─────────────────────────────────────────── */
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 0;
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      overflow: hidden;
    }
    .faq-item { border-bottom: 1px solid var(--border); }
    .faq-item:last-child { border-bottom: none; }

    .faq-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 24px 28px;
      background: var(--surface2);
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background .1s;
    }
    .faq-trigger:hover { background: rgba(223,231,119,.04); }
    .faq-q-text {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.4;
      letter-spacing: -.01em;
    }
    .faq-icon {
      color: var(--lime);
      font-size: 14px;
      flex-shrink: 0;
      transition: transform .15s ease;
    }
    .faq-item.open .faq-icon { transform: rotate(45deg); }

    .faq-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height .2s ease, padding .15s ease;
      background: var(--surface);
    }
    .faq-body p {
      padding: 0 28px 24px;
      font-size: 15px;
      color: var(--muted);
      line-height: 1.75;
    }
    .faq-item.open .faq-body { max-height: 400px; }

    /* ─── COVERAGE ────────────────────────────────────── */
    .coverage-wrap {
      max-width: 780px;
    }
    .area-pills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 32px;
    }
    .area-pill {
      display: inline-block;
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 13px;
      padding: 7px 16px;
      border-radius: 100px;
      transition: border-color .1s, color .1s;
    }
    .area-pill:hover {
      border-color: rgba(223,231,119,.35);
      color: var(--lime);
    }

    /* ─── CTA BAND ────────────────────────────────────── */
    .cta-band {
      background: var(--lime);
      padding: 80px 5vw;
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 40px;
    }
    .cta-band-h {
      font-family: var(--font-display);
      font-size: clamp(28px, 3vw, 48px);
      font-weight: 800;
      color: #0b0e02;
      line-height: 1.05;
      letter-spacing: -.04em;
    }
    .cta-band-h em { font-style: normal; }
    .cta-band-sub {
      font-size: 16px;
      color: var(--muted-dark);
      margin-top: 10px;
    }
    .btn-dark {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #0b0e02;
      color: var(--lime);
      font-size: 15px;
      font-weight: 600;
      padding: 15px 30px;
      border-radius: 100px;
      white-space: nowrap;
      transition: background .2s, transform .15s;
    }
    .btn-dark:hover { background: #1c2202; transform: translateY(-1px); }

    /* ─── FOOTER ──────────────────────────────────────── */
    .footer {
      background: var(--surface);
      border-top: 1px solid var(--border);
      padding: 64px 5vw 32px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 48px;
      padding-bottom: 48px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 32px;
    }
    .footer-brand-logo {
      height: 40px;
      width: auto;
      margin-bottom: 20px;
      opacity: .9;
    }
    .footer-brand-logo svg { height: 40px; width: auto; }
    .footer-brand-logo:hover { opacity: 1; }
    .hero-logo svg { height: 44px; width: auto; }
    .footer-tagline {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.65;
      margin-bottom: 20px;
      max-width: 260px;
    }
    .footer-contact {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .footer-contact a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--muted);
      transition: color .2s;
      width: fit-content;
    }
    .footer-contact a:hover { color: var(--lime); }
    .footer-contact i { font-size: 12px; color: var(--lime); width: 14px; }

    .footer-col-h {
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--lime);
      margin-bottom: 16px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links li a {
      display: inline-block;
      font-size: 14px;
      color: var(--muted);
      transition: color .2s;
    }
    .footer-links li a:hover { color: var(--text); }

    .footer-legal {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .footer-legal p {
      font-size: 11.5px;
      color: var(--muted-dark);
      line-height: 1.6;
    }
    .footer-legal .footer-copy {
      color: var(--muted);
      font-size: 12px;
      margin-bottom: 8px;
    }

    /* ─── MOBILE STICKY ───────────────────────────────── */
    .mobile-sticky {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 90;
      background: rgba(11,14,2,.95);
      backdrop-filter: blur(16px);
      padding: 12px 16px;
      border-top: 1px solid var(--border);
      gap: 10px;
    }
    .mobile-sticky a { flex: 1; text-align: center; font-size: 14px; }

    /* ─── RESPONSIVE ──────────────────────────────────── */
    /* ─── RESPONSIVE ─────────────────────────────────── */

    /* Tablet landscape */
    @media (max-width: 1100px) {
      .hero-left { gap: 40px; }
      .hero-side { padding-left: 24px; }
      .why-top { grid-template-columns: 1fr; gap: 36px; }
      .why-features { grid-template-columns: repeat(2, 1fr); }
      .cases-grid { grid-template-columns: 1fr 1fr; }
      .tools-grid { grid-template-columns: 1fr 1fr; }
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
      .cta-band { grid-template-columns: 1fr; gap: 28px; }
    }

    /* Tablet portrait */
    @media (max-width: 860px) {
      .hero { min-height: auto; padding: 56px 5vw 64px; }
      .hero-left { grid-template-columns: 1fr; gap: 48px; }

      .why-features { grid-template-columns: 1fr; }
      .cases-grid { grid-template-columns: 1fr; }
      .grants-grid { grid-template-columns: 1fr; }
      .tools-grid { grid-template-columns: 1fr 1fr; }
      .cases-cta { padding: 28px 24px; }
      .stats-row { grid-template-columns: 1fr; }
    }

    /* Mobile */
    @media (max-width: 640px) {
      .hero { padding: 48px 5vw 56px; }
      .hero-h1 { font-size: clamp(36px, 9vw, 52px); letter-spacing: -.03em; }
      .section { padding: 60px 5vw; }
      .section-h2 { font-size: clamp(26px, 7vw, 38px); }
      .why-top { gap: 28px; }
      .tools-grid { grid-template-columns: 1fr; gap: 10px; }
      .footer-grid { grid-template-columns: 1fr; gap: 32px; }
      .cases-cta { flex-direction: column; align-items: flex-start; }
      .cases-cta .btn-primary { width: 100%; justify-content: center; }
      .cta-band { padding: 60px 5vw; }
      .mobile-sticky { display: flex; }
      body { padding-bottom: 76px; }
    }

    /* Small mobile */
    @media (max-width: 400px) {
      .hero-ctas { flex-direction: column; align-items: stretch; }
      .hero-ctas a { width: 100%; justify-content: center; }
      .grants-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<!-- HERO -->
<section class="hero">
  <div class="hero-left">
    <!-- Left: headline + CTAs -->
    <div class="hero-main">
      <a href="${WEBSITE_URL}" target="_blank" rel="noopener" style="display:inline-block;margin-bottom:36px">
        <img src="${LOGO_URI}" alt="JRW Finance" style="height:44px;width:auto;display:block">
      </a>
      <h1 class="hero-h1">
        Home Loans &amp;<br>
        Mortgage Advice<br>
        in <em>${city.name}</em>
      </h1>
      <p class="hero-sub">${city.heroSub}</p>
      <div class="hero-ctas">
        <a class="btn-primary lg" href="${BOOK_URL}" target="_blank" rel="noopener">
          Book a free strategy call <i class="fa-solid fa-arrow-right" style="font-size:11px"></i>
        </a>
        <a class="btn-ghost lg" href="#why-us">Learn more</a>
      </div>
      <div class="hero-trust">
        <div class="trust-item"><i class="fa-solid fa-check"></i> 40+ lenders compared</div>
        <div class="trust-sep"></div>
        <div class="trust-item"><i class="fa-solid fa-check"></i> No broker fee</div>
        <div class="trust-sep"></div>
        <div class="trust-item"><i class="fa-solid fa-check"></i> ${city.name} specialist</div>
      </div>
    </div>
  </div>
</section>

<!-- LENDER BAR -->
<div class="lender-bar" aria-label="Lenders we work with">
  <div class="lender-track">
    ${lenderMarquee}
  </div>
</div>

<!-- WHY US -->
<section class="section section-alt reveal-section" id="why-us">
  <div class="why-top">
    <div class="reveal">

      <h2 class="section-h2">We help ${city.name} clients<br>borrow <em>smarter</em></h2>
      <p class="section-intro">Independent, investment-minded mortgage advice &#8211; not just rate shopping. We match you to the lender that fits your situation.</p>
      <a class="btn-primary" href="${BOOK_URL}" target="_blank" rel="noopener">
        Book a free strategy call <i class="fa-solid fa-arrow-right" style="font-size:11px"></i>
      </a>
    </div>
    <div class="reveal">
      <ul class="checklist" style="margin-top:8px">
        <li><i class="fa-solid fa-check"></i> 40+ lenders including majors, non-banks and specialist lenders</li>
        <li><i class="fa-solid fa-check"></i> No broker fee &#8211; lenders pay us, you pay nothing</li>
        <li><i class="fa-solid fa-check"></i> Investment-minded strategy, not just the lowest rate</li>
        <li><i class="fa-solid fa-check"></i> Fast turnaround with full ${city.name} market knowledge</li>
        <li><i class="fa-solid fa-check"></i> End-to-end support from pre-approval to settlement</li>
      </ul>
      <div class="social-row" style="margin-top:28px">
        <span class="social-label">Follow us</span>
        ${socialIcons}
      </div>
    </div>
  </div>
  <div class="why-features reveal">
    <div class="why-feature">
      <div class="why-feature-num">40+</div>
      <div class="why-feature-h">Lenders compared, not just one bank's range</div>
      <div class="why-feature-body">Major banks, non-banks and specialist lenders on our panel. We find the right fit, not the most convenient one. No fee for this service.</div>
    </div>
    <div class="why-feature">
      <div class="why-feature-num">100%</div>
      <div class="why-feature-h">End-to-end, from first call to settlement day</div>
      <div class="why-feature-body">Pre-approval, documents, lender follow-up, valuations, solicitor coordination. We run the process so you don't have to.</div>
    </div>
    <div class="why-feature">
      <div class="why-feature-num">Free</div>
      <div class="why-feature-h">No cost to you, ever</div>
      <div class="why-feature-body">Lenders pay our commission. You get full access to our panel, strategy advice, and application support without paying a cent in broker fees.</div>
    </div>
  </div>
</section>

<!-- MARKET SNAPSHOT -->
<section class="section reveal-section">

  <h2 class="section-h2 reveal">${city.name} market snapshot &#8211; 2025</h2>
  <p class="section-intro reveal">${city.marketSnapshot}</p>

  <div class="stats-row reveal">
    <div class="stat-card">
      <div class="stat-value">${city.medianHousePrice}</div>
      <div class="stat-label">Median house price</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${city.medianUnitPrice}</div>
      <div class="stat-label">Median unit price</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${city.rentalYield}</div>
      <div class="stat-label">Gross rental yield</div>
    </div>
  </div>

  <div class="market-context reveal">
    <div class="market-context-label">What this means for your borrowing</div>
    <p>${city.borrowingContext}</p>
  </div>
</section>

<!-- CASE STUDIES -->
<section class="section section-alt2 reveal-section">

  <h2 class="section-h2 reveal">How we've helped<br>${city.name} clients</h2>

  <div class="cases-grid">
    ${city.cases.map(c => `
    <div class="case-card reveal">
      <div class="case-tag">${c.tag}</div>
      <div class="case-h">${c.heading}</div>
      <div class="case-body">${c.body}</div>
    </div>`).join('')}
  </div>
  <div class="cases-cta reveal">
    <div>
      <p class="cases-cta-h">Ready to be the next success story?</p>
      <p class="cases-cta-sub">Free strategy call. No obligation. We'll show you exactly what's possible for your situation.</p>
    </div>
    <a class="btn-primary lg" href="${BOOK_URL}" target="_blank" rel="noopener">
      Book a strategy call <i class="fa-solid fa-arrow-right" style="font-size:11px"></i>
    </a>
  </div>
</section>

<!-- GRANTS & SCHEMES -->
<section class="section reveal-section">

  <h2 class="section-h2 reveal">${city.state} first home buyer<br>grants &amp; <em>stamp duty relief</em></h2>
  <p class="section-intro reveal">Government schemes and lending strategies that can significantly reduce your upfront costs in ${city.stateFullName}.</p>

  <div class="grants-grid" style="grid-template-columns: repeat(2, 1fr)">
    <div class="grant-card reveal">
      <div class="grant-amount">${city.grant}</div>
      <div class="grant-name">${city.grantName}</div>
      <div class="grant-body">${city.stampDutyNote}</div>
    </div>
    <div class="grant-card reveal">
      <div class="grant-amount" style="font-size:38px;margin-bottom:12px">5%<span style="font-size:24px"> deposit</span></div>
      <div class="grant-name">Federal First Home Guarantee</div>
      <div class="grant-body">Eligible first home buyers can purchase with just a 5% deposit and pay no Lenders Mortgage Insurance (LMI). The government guarantees the remaining 15% to the lender. Income caps and property price limits apply &#8211; we assess your eligibility on your first call.</div>
    </div>
    <div class="grant-card reveal">
      <div class="grant-amount" style="font-size:38px;margin-bottom:12px">0%<span style="font-size:24px"> LMI</span></div>
      <div class="grant-name">LMI Waiver &#8211; Select Professions</div>
      <div class="grant-body">Certain professions &#8211; including doctors, lawyers, accountants and engineers &#8211; can borrow up to 90% LVR without paying LMI. That's a saving of $15,000 &#8211; $40,000 on many ${city.name} purchases. We check your eligibility across multiple lenders on your first call.</div>
    </div>
    <div class="grant-card reveal">
      <div class="grant-amount" style="font-size:38px;margin-bottom:12px">0%<span style="font-size:24px"> deposit</span></div>
      <div class="grant-name">Guarantor Loans</div>
      <div class="grant-body">If a parent or close family member uses equity in their property as security, you may be able to borrow up to 100% of the purchase price &#8211; no cash deposit required. One of the fastest paths into the ${city.name} market for buyers with strong income but limited savings.</div>
    </div>
  </div>
</section>

<!-- TOOLS -->
<section class="section section-alt reveal-section">

  <h2 class="section-h2 reveal">Run the numbers<br>before you call</h2>
  <p class="section-intro reveal">Free calculators to help you understand your position before we speak.</p>
  <div class="tools-grid reveal">
    ${toolCards}
  </div>
</section>

<!-- FAQ -->
<section class="section reveal-section">

  <h2 class="section-h2 reveal" style="margin-bottom:48px">${city.name} home loan <em>FAQs</em></h2>
  <div class="faq-list reveal">
    ${faqItems}
  </div>
</section>

<!-- COVERAGE -->
<section class="section section-alt reveal-section">
  <div class="coverage-wrap">

    <h2 class="section-h2 reveal">Helping buyers across<br>${city.name} &amp; surrounds</h2>
    <p class="section-intro reveal" style="margin-bottom:0">We work with clients purchasing, investing and refinancing right across ${city.stateFullName} &#8211; from the ${city.name} CBD to outer suburbs and regional areas. No matter where you're buying, we find lenders that suit your location and property type.</p>
    <div class="area-pills-list reveal">
      ${city.suburbLinks.map(s => `<span class="area-pill">${s}</span>`).join('')}
    </div>
  </div>
</section>

<!-- CTA BAND -->
<div class="cta-band">
  <div>
    <h2 class="cta-band-h">Ready to buy in <em>${city.name}?</em><br>Let's map out your strategy.</h2>
    <p class="cta-band-sub">Free, no-obligation strategy call. We'll show you what you can borrow, which lenders suit you, and what grants you qualify for.</p>
  </div>
  <a class="btn-dark" href="${BOOK_URL}" target="_blank" rel="noopener">
    Book a free call <i class="fa-solid fa-arrow-right" style="font-size:12px"></i>
  </a>
</div>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-grid">
    <div class="footer-brand">
      <a href="${WEBSITE_URL}" target="_blank" rel="noopener" style="display:inline-block;width:fit-content">
        <img class="footer-brand-logo" src="${LOGO_URI}" alt="JRW Finance">
      </a>
      <p class="footer-tagline">Smarter lending, better outcomes. We help Australians buy, invest and refinance with confidence.</p>
      <div class="footer-contact">
        <a href="mailto:${EMAIL}"><i class="fa-solid fa-envelope"></i> ${EMAIL}</a>
        <a href="${WEBSITE_URL}" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i> jrwfinance.com.au</a>
        <a href="#"><i class="fa-solid fa-location-dot"></i> ${ADDRESS}</a>
      </div>
    </div>
    <div>
      <p class="footer-col-h">Services</p>
      <ul class="footer-links">
        <li><a href="${WEBSITE_URL}/home-loans" target="_blank" rel="noopener">Home loans</a></li>
        <li><a href="${WEBSITE_URL}/investment-loans" target="_blank" rel="noopener">Investment loans</a></li>
        <li><a href="${WEBSITE_URL}/refinancing" target="_blank" rel="noopener">Refinancing</a></li>
        <li><a href="${WEBSITE_URL}/first-home-buyers" target="_blank" rel="noopener">First home buyers</a></li>
        <li><a href="${WEBSITE_URL}/smsf-loans" target="_blank" rel="noopener">SMSF loans</a></li>
        <li><a href="${WEBSITE_URL}/our-story" target="_blank" rel="noopener">Our story</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-legal">
    <p class="footer-copy">&copy; ${year} JRW Finance Pty Ltd. All rights reserved.</p>
    <p>ABN ${ABN} &nbsp;&#183;&nbsp; ${CREDIT_REP}</p>
    <p>JRW Finance Pty Ltd is authorised under Australian Credit Licence 486112. General advice only &#8211; this information does not constitute personal financial advice. Consider whether it is right for your circumstances before acting.</p>
  </div>
</footer>

<!-- MOBILE STICKY -->
<div class="mobile-sticky">
  <a class="btn-ghost" href="mailto:${EMAIL}">Get in touch</a>
  <a class="btn-primary" href="${BOOK_URL}" target="_blank" rel="noopener">Book a call</a>
</div>

<script>
  // FAQ accordion
  function toggleFaq(i) {
    const item = document.getElementById('faq-' + i)
    const body = document.getElementById('faq-body-' + i)
    const btn  = item.querySelector('.faq-trigger')
    const isOpen = item.classList.contains('open')

    // Close all
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'))
    document.querySelectorAll('.faq-trigger').forEach(el => el.setAttribute('aria-expanded', 'false'))

    if (!isOpen) {
      item.classList.add('open')
      btn.setAttribute('aria-expanded', 'true')
    }
  }

  // Scroll reveal — only activate once JS is confirmed running
  document.documentElement.classList.add('js-ready')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.05 })

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el)
  })
</script>
</body>
</html>`
}
