/**
 * Government of Canada Job Bank scraper.
 * Mirrors the logic from original-code/jobscrape.py (jobbank_search).
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.text();
}

function clean(s) {
  return (s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

async function jobBankSearch(keyword, location = 'Toronto, ON') {
  const params = new URLSearchParams({ searchstring: keyword, locationstring: location });
  const url = `https://www.jobbank.gc.ca/jobsearch/jobsearch?${params}`;
  const html = await fetchHtml(url);

  const jobs = [];
  const articles = [...html.matchAll(/<article[^>]*>(.*?)<\/article>/gs)].map(m => m[1]);
  for (const a of articles) {
    const hrefM = a.match(/href="(\/jobsearch\/jobposting\/(\d+)[^"]*)"/);
    const titleM = a.match(/<span class="noctitle">\s*(.*?)\s*<\/span>/s);
    if (!hrefM || !titleM) continue;
    const jid = hrefM[2];
    const compM = a.match(/<li class="business">(.*?)<\/li>/s);
    const locM = a.match(/<li class="location">(.*?)<\/li>/s);
    const salM = a.match(/<li class="salary">(.*?)<\/li>/s);
    const dateM = a.match(/<li class="date">(.*?)<\/li>/s);
    const teleM = a.match(/<span class="telework">([^<]*)<\/span>/);
    jobs.push({
      title: clean(titleM[1]),
      company: compM ? clean(compM[1]) : '',
      location: locM ? clean(locM[1]).replace(/^Location/, '').trim() : '',
      link: `https://www.jobbank.gc.ca/jobsearch/jobposting/${jid}`,
      source: 'Job Bank',
      remote: false,
      salary: salM ? clean(salM[1]).replace(/^Salary/, '').trim() : '',
      date_posted: dateM ? clean(dateM[1]) : '',
      telework: teleM ? clean(teleM[1]) : '',
    });
  }
  return jobs;
}

const KEYWORDS = [
  'software manager', 'technology manager', 'IT manager',
  'director of technology', 'director of software', 'applications manager',
  'enterprise applications manager',
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function scrapeJobBank() {
  const results = [];
  const seen = new Set();

  for (const kw of KEYWORDS) {
    try {
      const res = await jobBankSearch(kw);
      let added = 0;
      for (const r of res) {
        const key = `${r.title.toLowerCase()}|${r.company.toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        r.query = kw;
        results.push(r);
        added++;
      }
      console.log(`[JB] "${kw}": ${res.length} fetched, ${added} new`);
    } catch (e) {
      console.error(`[JB ERR] "${kw}": ${e.message}`);
    }
    await sleep(400);
  }

  console.log(`\nJob Bank total: ${results.length}`);
  return results;
}
