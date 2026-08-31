/**
 * LinkedIn job scraper (public guest API).
 * Mirrors the logic from original-code/jobscrape.py and jobscrape_ca.py.
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

async function linkedinSearch(keyword, location, remote = false, start = 0) {
  const params = new URLSearchParams({ keywords: keyword, start: String(start) });
  if (remote) params.set('f_WT', '2');
  if (location) params.set('location', location);
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?${params}`;
  const html = await fetchHtml(url);

  const jobs = [];
  const cards = [...html.matchAll(/<li>(.*?)<\/li>/gs)].map(m => m[1]);
  for (const card of cards) {
    const titleM = card.match(/<span class="sr-only">\s*(.*?)\s*<\/span>/s);
    if (!titleM) continue;
    const compM = card.match(/base-search-card__subtitle[^>]*>\s*<a[^>]*>\s*(.*?)\s*<\/a>/s);
    const locM = card.match(/job-search-card__location[^>]*>(.*?)<\/span>/s);
    const linkM = card.match(/href="(https:\/\/[^"]*linkedin\.com\/jobs\/view\/[^"]*)"/);
    jobs.push({
      title: clean(titleM[1]),
      company: compM ? clean(compM[1]) : '',
      location: locM ? clean(locM[1]) : '',
      link: linkM ? linkM[1].replace(/\?.*$/, '') : '',
      source: 'LinkedIn',
      remote: Boolean(remote),
      salary: '', date_posted: '', telework: '',
    });
  }
  return jobs;
}

const TORONTO_KEYWORDS = [
  ['software manager', 'Toronto, Ontario, Canada'],
  ['technology manager', 'Toronto, Ontario, Canada'],
  ['IT manager', 'Toronto, Ontario, Canada'],
  ['director of technology', 'Toronto, Ontario, Canada'],
  ['director of software', 'Toronto, Ontario, Canada'],
  ['applications manager', 'Toronto, Ontario, Canada'],
  ['enterprise applications manager', 'Toronto, Ontario, Canada'],
  ['director of software engineering', 'Toronto, Ontario, Canada'],
];

const CANADA_REMOTE_KEYWORDS = [
  ['software manager', 'Canada'],
  ['technology manager', 'Canada'],
  ['IT manager', 'Canada'],
  ['director of technology', 'Canada'],
  ['director of software', 'Canada'],
  ['applications manager', 'Canada'],
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

export async function scrapeLinkedIn() {
  const results = [];
  const seen = new Set();

  // Toronto on-site / hybrid
  for (const [kw, loc] of TORONTO_KEYWORDS) {
    for (const start of [0, 10]) {
      try {
        const res = await linkedinSearch(kw, loc, false, start);
        let added = 0;
        for (const r of res) {
          const key = `${r.title.toLowerCase()}|${r.company.toLowerCase()}`;
          if (seen.has(key)) continue;
          seen.add(key);
          r.query = kw;
          results.push(r);
          added++;
        }
        console.log(`[LI] "${kw}" start=${start}: ${res.length} fetched, ${added} new`);
      } catch (e) {
        console.error(`[LI ERR] "${kw}" start=${start}: ${e.message}`);
      }
      await sleep(450);
    }
  }

  // Canada remote
  for (const [kw, loc] of CANADA_REMOTE_KEYWORDS) {
    try {
      const res = await linkedinSearch(kw, loc, true, 0);
      let added = 0;
      for (const r of res) {
        const key = `${r.title.toLowerCase()}|${r.company.toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        r.query = kw + ' (Canada remote)';
        results.push(r);
        added++;
      }
      console.log(`[LI-CA] "${kw}" remote: ${res.length} fetched, ${added} new`);
    } catch (e) {
      console.error(`[LI-CA ERR] "${kw}": ${e.message}`);
    }
    await sleep(500);
  }

  console.log(`\nLinkedIn total: ${results.length}`);
  return results;
}
