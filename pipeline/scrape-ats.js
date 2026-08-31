/**
 * Targeted-employer ATS scraper: Greenhouse / Lever / Ashby clean JSON APIs.
 * Mirrors original-code/jobscrape_ats.py.
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'application/json' },
    signal: AbortSignal.timeout(25_000)
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`)
  return res.json()
}

function clean(s) {
  return (s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, '\'').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
}

// [friendly name, ats, slug]
const BOARDS = [
  ['PointClickCare', 'lever', 'pointclickcare'],
  ['1Password', 'ashby', '1password'],
  ['Loopio', 'ashby', 'loopio'],
  ['Wattpad', 'lever', 'wattpad'],
  ['Wave', 'lever', 'waveapps'],
  ['Cohere', 'ashby', 'cohere'],
  ['Lightspeed Commerce', 'ashby', 'lightspeed'],
  ['BenchSci', 'lever', 'benchsci'],
  ['Koho', 'ashby', 'koho'],
  ['Float', 'ashby', 'float'],
  ['Tulip Retail', 'greenhouse', 'tulip'],
  ['Achievers', 'lever', 'achievers'],
  ['Ritual', 'greenhouse', 'ritual'],
  ['Geotab', 'greenhouse', 'geotab'],
  ['PagerDuty', 'greenhouse', 'pagerduty'],
  ['Mozilla', 'greenhouse', 'mozilla'],
  ['Wealthsimple', 'ashby', 'wealthsimple'],
  ['Jobber', 'ashby', 'jobber'],
  ['Nylas', 'ashby', 'nylas'],
  ['Top Hat', 'ashby', 'top-hat'],
  ['Hootsuite', 'greenhouse', 'hootsuite'],
  ['Faire', 'greenhouse', 'faire']
]

async function greenhouse(slug) {
  const d = await fetchJson(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`)
  return (d.jobs || []).map((j) => {
    const loc = (typeof j.location === 'object' ? j.location?.name : j.location) || ''
    return {
      title: clean(j.title),
      company: j.company_name || '',
      location: clean(loc),
      link: j.absolute_url || '',
      source: 'Greenhouse',
      remote: /\bremote\b/i.test(loc),
      salary: '',
      date_posted: clean(j.updated_at || '').slice(0, 10),
      telework: '',
      description: clean(j.content || '')
    }
  })
}

async function lever(slug) {
  const d = await fetchJson(`https://api.lever.co/v0/postings/${slug}?mode=json`)
  return d.map((j) => {
    const cats = j.categories || {}
    const loc = cats.location || 'Remote'
    const wtype = j.workplaceType || cats.commitment || ''
    const created = j.createdAt
    const date_posted = typeof created === 'number'
      ? new Date(created).toISOString().slice(0, 10)
      : clean(String(created || '')).slice(0, 10)
    const remote = /\bremote\b/i.test(loc) || wtype.toLowerCase() === 'remote'
    return {
      title: clean(j.text),
      company: '',
      location: clean(loc),
      link: j.hostedUrl || '',
      source: 'Lever',
      remote,
      salary: clean(j.salaryDescription || ''),
      date_posted,
      telework: clean(wtype),
      description: clean(j.descriptionPlain || '')
    }
  })
}

async function ashby(slug) {
  const d = await fetchJson(`https://api.ashbyhq.com/posting-api/job-board/${slug}`)
  return (d.jobs || []).map((j) => {
    const loc = j.location || ''
    const wtype = j.workplaceType || j.employmentType || ''
    const remote = Boolean(j.isRemote) || /\bremote\b/i.test(loc) || wtype.toLowerCase() === 'remote'
    return {
      title: clean(j.title),
      company: '',
      location: clean(loc),
      link: j.jobUrl || '',
      source: 'Ashby',
      remote,
      salary: '',
      date_posted: clean(j.publishedAt || '').slice(0, 10),
      telework: clean(wtype),
      description: clean(j.descriptionPlain || '')
    }
  })
}

const FETCHERS = { greenhouse, lever, ashby }

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export async function scrapeATS() {
  const results = []
  for (const [name, ats, slug] of BOARDS) {
    try {
      const jobs = await FETCHERS[ats](slug)
      for (const j of jobs) {
        if (!j.company) j.company = name
      }
      results.push(...jobs)
      console.log(`[${name.padEnd(22)}] ${ats.padEnd(10)} -> ${jobs.length} jobs`)
    } catch (e) {
      console.error(`[${name}] ERROR: ${e.message}`)
    }
    await sleep(300)
  }
  console.log(`\nATS total: ${results.length}`)
  return results
}
