/**
 * Workday ATS scraper (public POST jobs endpoint).
 * Mirrors original-code/jobscrape_workday.py.
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

// [friendly name, host, tenant, site]
const BOARDS = [
  ['TD Bank', 'td.wd3.myworkdayjobs.com', 'td', 'TD_Bank_Careers'],
  ['BMO', 'bmo.wd3.myworkdayjobs.com', 'bmo', 'External'],
  ['CIBC', 'cibc.wd3.myworkdayjobs.com', 'cibc', 'search'],
  ['Manulife', 'manulife.wd3.myworkdayjobs.com', 'manulife', 'MFCJH_Jobs'],
  ['Sun Life', 'sunlife.wd3.myworkdayjobs.com', 'sunlife', 'Experienced-Jobs'],
  ['OMERS', 'omers.wd3.myworkdayjobs.com', 'omers', 'OMERS_External'],
  ['CPP Investments', 'cppib.wd10.myworkdayjobs.com', 'cppib', 'cppinvestments'],
  ['OTPP (Ontario Teachers)', 'otppb.wd3.myworkdayjobs.com', 'otppb', 'OntarioTeachers_Careers'],
  ['Clio', 'clio.wd3.myworkdayjobs.com', 'clio', 'ClioCareerSite']
]

function clean(s) {
  return (s || '').replace(/\s+/g, ' ').trim()
}

async function workdayFetch(host, tenant, site, offset, limit = 20) {
  const url = `https://${host}/wday/cxs/${tenant}/${site}/jobs`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': UA,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ limit, offset, searchText: '', appliedFacets: {} }),
    signal: AbortSignal.timeout(30_000)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
  return res.json()
}

async function scrapeBoard(name, host, tenant, site) {
  const out = []
  let offset = 0
  let total = null
  const limit = 20
  const maxPages = 200

  for (let page = 0; page < maxPages; page++) {
    let d
    try {
      d = await workdayFetch(host, tenant, site, offset, limit)
    } catch (e) {
      console.error(`  [${name}] offset=${offset} ERROR: ${e.message}`)
      break
    }
    if (total === null) total = d.total || 0
    const postings = d.jobPostings || []
    for (const j of postings) {
      const loc = clean(j.locationsText || '')
      const remote = clean(j.remoteType || '')
      const isRemote = ['remote', 'work from home', 'hybrid-remote'].includes(remote.toLowerCase())
      out.push({
        title: clean(j.title || ''),
        company: name,
        location: loc,
        link: `https://${host}/en-US/${site}${j.externalPath || ''}`,
        source: 'Workday',
        remote: isRemote,
        salary: '',
        date_posted: clean(j.postedOn || ''),
        telework: remote.toLowerCase() !== 'on site' ? remote : '',
        description: ''
      })
    }
    offset += limit
    if (offset >= total) break
    await new Promise(r => setTimeout(r, 250))
  }
  return { jobs: out, total }
}

export async function scrapeWorkday() {
  const results = []
  for (const [name, host, tenant, site] of BOARDS) {
    try {
      const { jobs, total } = await scrapeBoard(name, host, tenant, site)
      results.push(...jobs)
      console.log(`[${name.padEnd(22)}] -> ${jobs.length} jobs (total=${total})`)
    } catch (e) {
      console.error(`[${name}] ERROR: ${e.message}`)
    }
  }
  console.log(`\nWorkday total: ${results.length}`)
  return results
}
