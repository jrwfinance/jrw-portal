/**
 * generate-towns.mjs
 * Generates towns.js (all 250 location entries) + dns-import.txt (Cloudflare zone file)
 * Run: node generate-towns.mjs
 */

import { LOCATIONS } from './src/locations.js'
import { writeFileSync } from 'fs'

// ─── State-level data ─────────────────────────────────────────────────────────
const STATE = {
  NSW: {
    stateFullName: 'New South Wales',
    grant: '$10,000',
    grantName: 'First Home Owner (New Homes) Grant',
    stampDutyNote: 'NSW first home buyers can access a full stamp duty exemption on homes up to $800,000, with concessions up to $1,000,000. The $10,000 First Home Owner (New Homes) Grant applies to newly built homes. Federally, the First Home Guarantee allows eligible buyers to purchase with just 5% deposit and no LMI.',
    medianHouse: '$780,000',
    medianUnit: '$550,000',
    rentalYield: '3.8%',
  },
  VIC: {
    stateFullName: 'Victoria',
    grant: '$10,000',
    grantName: 'First Home Owner Grant',
    stampDutyNote: 'VIC first home buyers are exempt from stamp duty on homes up to $600,000, with concessions up to $750,000. The $10,000 First Home Owner Grant applies to new builds. The federal First Home Guarantee allows eligible buyers to purchase with 5% deposit and no LMI.',
    medianHouse: '$680,000',
    medianUnit: '$490,000',
    rentalYield: '3.9%',
  },
  QLD: {
    stateFullName: 'Queensland',
    grant: '$30,000',
    grantName: 'Queensland First Home Owner Grant',
    stampDutyNote: 'QLD first home buyers pay no transfer duty on homes up to $700,000, with concessions up to $800,000. The $30,000 First Home Owner Grant applies to new builds. The federal First Home Guarantee allows eligible buyers to purchase with 5% deposit and no LMI.',
    medianHouse: '$640,000',
    medianUnit: '$440,000',
    rentalYield: '4.4%',
  },
  WA: {
    stateFullName: 'Western Australia',
    grant: '$10,000',
    grantName: 'First Home Owner Grant',
    stampDutyNote: 'WA first home buyers are exempt from stamp duty on homes up to $430,000, with concessions up to $530,000. The $10,000 First Home Owner Grant applies to new builds. The federal First Home Guarantee allows eligible buyers to purchase with 5% deposit and no LMI.',
    medianHouse: '$580,000',
    medianUnit: '$390,000',
    rentalYield: '4.9%',
  },
  SA: {
    stateFullName: 'South Australia',
    grant: '$15,000',
    grantName: 'First Home Owner Grant',
    stampDutyNote: 'SA first home buyers may be eligible for stamp duty concessions — thresholds vary by property type. The $15,000 First Home Owner Grant applies to new builds. The federal First Home Guarantee allows eligible buyers to purchase with 5% deposit and no LMI.',
    medianHouse: '$560,000',
    medianUnit: '$380,000',
    rentalYield: '4.6%',
  },
  TAS: {
    stateFullName: 'Tasmania',
    grant: '$30,000',
    grantName: 'First Home Owner Grant',
    stampDutyNote: 'TAS first home buyers are exempt from stamp duty on homes up to $750,000. The $30,000 First Home Owner Grant — one of Australia\'s most generous — applies to new builds. The federal First Home Guarantee allows eligible buyers to purchase with 5% deposit and no LMI.',
    medianHouse: '$520,000',
    medianUnit: '$360,000',
    rentalYield: '4.7%',
  },
  NT: {
    stateFullName: 'Northern Territory',
    grant: '$10,000',
    grantName: 'First Home Owner Grant',
    stampDutyNote: 'NT first home buyers can access a $10,000 First Home Owner Grant plus a Territory Home Owner Discount of up to $18,601 on stamp duty. The federal First Home Guarantee allows eligible buyers to purchase with 5% deposit and no LMI.',
    medianHouse: '$490,000',
    medianUnit: '$310,000',
    rentalYield: '5.8%',
  },
  ACT: {
    stateFullName: 'Australian Capital Territory',
    grant: '$10,000',
    grantName: 'First Home Owner Grant',
    stampDutyNote: 'ACT has abolished stamp duty for eligible first home buyers through the Home Buyer Concession Scheme — income and property value thresholds apply. The federal First Home Guarantee allows eligible buyers to purchase with 5% deposit and no LMI.',
    medianHouse: '$880,000',
    medianUnit: '$540,000',
    rentalYield: '4.1%',
  },
}

// ─── Content generators ────────────────────────────────────────────────────────

function heroSub(loc, s) {
  const context = loc.parentCity ? `in the ${loc.parentCity} region` : `in ${loc.state}`
  const typeMap = {
    coastal:   `Compare 40+ lenders and secure your ${loc.name} home loan with the JRW Finance team — expert mortgage advice for buyers and investors on the ${s.stateFullName} coast.`,
    growth:    `Compare 40+ lenders and get into ${loc.name} sooner — the JRW Finance team helps buyers in one of ${loc.parentCity || s.stateFullName}'s fastest-growing corridors buy smarter and borrow more confidently.`,
    metro:     `Compare 40+ lenders and get expert mortgage advice for ${loc.name} — the JRW Finance team helps buyers ${context} find the right lender, structure, and strategy.`,
    regional:  `Compare 40+ lenders and get regional mortgage advice from the JRW Finance team — local knowledge, national lender access, and genuine strategy for ${loc.name} buyers and investors.`,
  }
  return typeMap[loc.type] || typeMap.regional
}

function marketSnapshot(loc, s) {
  const typeSnaps = {
    coastal:   `${loc.name} continues to attract strong owner-occupier and investor demand, driven by lifestyle appeal, limited coastal land supply, and improving infrastructure links. Short-term rental yields in coastal areas can be particularly strong, while long-term capital growth has historically outpaced many inland markets.`,
    growth:    `${loc.name} is one of ${loc.parentCity || s.stateFullName}'s most active growth corridors, with new housing estates, infrastructure investment and strong population inflows driving sustained demand. Entry prices remain accessible relative to established suburbs, making it a popular target for first home buyers and investors alike.`,
    metro:     `${loc.name} is an established ${loc.parentCity || s.stateFullName} suburb with strong owner-occupier demand, good transport links and a diverse housing stock. Proximity to employment centres, schools and amenities continues to underpin values, with limited new land supply supporting long-term capital growth.`,
    regional:  `${loc.name} is ${s.stateFullName}'s regional economy offering a mix of agricultural, industrial and service-sector employment. Property prices remain accessible relative to capital cities, with strong rental demand from local workers and a growing lifestyle migration trend from major urban areas.`,
  }
  return typeSnaps[loc.type] || typeSnaps.regional
}

function borrowingContext(loc, s) {
  const deposit10 = Math.round(parseInt(s.medianHouse.replace(/\D/g,'')) * 0.10 / 1000) * 1000
  const deposit20 = Math.round(parseInt(s.medianHouse.replace(/\D/g,'')) * 0.20 / 1000) * 1000
  const d10 = '$' + deposit10.toLocaleString()
  const d20 = '$' + deposit20.toLocaleString()
  return `At ${s.stateFullName}'s regional median, a 10% deposit is around ${d10} and 20% is ${d20}. On a typical household income you may borrow approximately $450,000–$600,000 depending on expenses and lender. ${loc.name}'s entry prices are often accessible for first home buyers — and ${s.stateFullName}'s ${s.grantName} reduces the upfront cost further on new builds. We run your numbers across 40+ lenders to find your real borrowing ceiling.`
}

function growthTrend(loc, s) {
  const trends = {
    coastal:   `Coastal lifestyle demand, limited supply and improving infrastructure continue to underpin long-term values.`,
    growth:    `One of ${s.stateFullName}'s strongest growth corridors, driven by population inflows and ongoing infrastructure investment.`,
    metro:     `Steady long-term growth backed by established infrastructure, employment access and consistent owner-occupier demand.`,
    regional:  `Stable market with affordable entry prices, strong rental demand and growing lifestyle appeal driving long-term values.`,
  }
  return trends[loc.type] || trends.regional
}

function cases(loc, s) {
  const name = loc.name
  const sub1 = loc.subs[0]
  const sub2 = loc.subs[1]
  return [
    {
      tag: 'First Home Buyer',
      heading: `Entered the ${name} market with a 5% deposit and no LMI`,
      body: `Used the federal First Home Guarantee to avoid Lenders Mortgage Insurance, saving over $15,000 upfront. Combined with ${s.stateFullName}'s ${s.grantName}, the total upfront saving made purchasing in ${sub1 || name} achievable within their savings timeline.`,
    },
    {
      tag: 'Property Investor',
      heading: `Used equity in existing property to fund a ${name} investment purchase`,
      body: `Structured a split loan to keep investment and owner-occupied debt separate, preserving full tax-deductible interest on the investment portion. The ${sub2 || name} property settled with a gross rental yield above the state average.`,
    },
    {
      tag: 'Refinance',
      heading: `Cut over 1% off their rate on a ${name} property after years with the same lender`,
      body: `Moved from their existing bank to a competitive non-bank lender with a full offset account. The rate reduction reduced monthly repayments and accelerated principal reduction — with no break costs as the loan was variable.`,
    },
  ]
}

function faqs(loc, s) {
  const name = loc.name
  return [
    {
      q: `Can I buy in ${name} with a 5% deposit?`,
      a: `Yes. Through the federal First Home Guarantee, eligible first home buyers can purchase with a 5% deposit and avoid Lenders Mortgage Insurance (LMI) — saving $15,000–$35,000 in upfront costs. Property price caps apply in ${s.stateFullName}. We assess your eligibility and map out the fastest path to purchase.`,
    },
    {
      q: `What ${name} suburbs offer the best value for first home buyers?`,
      a: `${loc.subs.slice(0, 4).join(', ')} and surrounding areas offer a mix of entry-level pricing and good amenities. The right suburb depends on your budget, commute needs and whether you're buying to live in or invest. We map out which areas fit your goals and grant eligibility.`,
    },
    {
      q: `Is ${name} a good property investment?`,
      a: `${name} offers ${s.rentalYield} average rental yields across ${s.stateFullName}, with ${growthTrend(loc, s).toLowerCase()} We help investors identify the right property type, suburb and loan structure to maximise long-term returns.`,
    },
    {
      q: `How long does mortgage approval take in ${s.stateFullName}?`,
      a: `For a well-prepared application, most lenders return formal approval within 3–10 business days. We manage your documentation and lender communication end-to-end, and know which lenders move fastest when settlement timelines are tight.`,
    },
    {
      q: `Can I use equity from my ${name} property to fund another purchase?`,
      a: `Yes. If your ${name} property has grown in value, you may be able to access equity as a deposit for your next purchase without saving from scratch. We calculate your usable equity, identify the right loan structure and help you buy your next property without selling the first.`,
    },
  ]
}

// ─── Generate entries ─────────────────────────────────────────────────────────

const entries = LOCATIONS.map(loc => {
  const s = STATE[loc.state]
  return {
    key: loc.key,
    entry: {
      name:           loc.name,
      state:          loc.state,
      stateFullName:  s.stateFullName,
      medianHousePrice: s.medianHouse,
      medianUnitPrice:  s.medianUnit,
      rentalYield:    s.rentalYield,
      growthTrend:    growthTrend(loc, s),
      marketSnapshot: marketSnapshot(loc, s),
      borrowingContext: borrowingContext(loc, s),
      grant:          s.grant,
      grantName:      s.grantName,
      stampDutyNote:  s.stampDutyNote,
      heroSub:        heroSub(loc, s),
      suburbLinks:    loc.subs,
      cases:          cases(loc, s),
      faqs:           faqs(loc, s),
    }
  }
})

// ─── Write towns.js ───────────────────────────────────────────────────────────

const townsJs = `// AUTO-GENERATED — run generate-towns.mjs to regenerate
// ${entries.length} locations across NSW, VIC, QLD, WA, SA, TAS, NT, ACT

export const TOWNS = {
${entries.map(({ key, entry }) => `  ${JSON.stringify(key)}: ${JSON.stringify(entry, null, 2).replace(/^/gm, '  ').trim()},`).join('\n\n')}
}
`

writeFileSync('./src/towns.js', townsJs)
console.log(`✅ towns.js written — ${entries.length} locations`)

// ─── Write DNS zone file ──────────────────────────────────────────────────────
// Cloudflare BIND zone file format for bulk import
// All records: AAAA 100:: proxied (use Cloudflare API or manual import)

const dnsLines = [
  ';; JRW Finance — suburb subdomain DNS records',
  ';; Import via: Cloudflare Dashboard → jrwfinance.com.au → DNS → Import DNS Records',
  ';; Or use Cloudflare API to bulk-add with proxied=true',
  ';;',
  ';; Each subdomain needs: Type=AAAA, Name=<key>, Content=100::, Proxy=ON',
  ';;',
  ...entries.map(({ key }) => `${key}\t1\tIN\tAAAA\t100::`)
]

writeFileSync('./dns-import.txt', dnsLines.join('\n') + '\n')
console.log(`✅ dns-import.txt written — ${entries.length} DNS records`)

// ─── Stats ────────────────────────────────────────────────────────────────────
const byState = {}
LOCATIONS.forEach(l => { byState[l.state] = (byState[l.state]||0)+1 })
console.log('By state:', byState)
