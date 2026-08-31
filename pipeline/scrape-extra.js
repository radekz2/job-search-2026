/**
 * Additional job sources: Built In Toronto (HTML) + RemoteOK (JSON API).
 * Mirrors original-code/jobscrape_extra.py.
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function fetchText(url) {
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

async function builtInSearch(location = 'toronto', pages = 2) {
  const out = [];
  const seen = new Set();
  for (let p = 1; p <= pages; p++) {
    const url = p > 1 ? `https://builtin.com/jobs/${location}?page=${p}` : `https://builtin.com/jobs/${location}`;
    let html;
    try {
      html = await fetchText(url);
    } catch (e) {
      console.error(`[BUILTIN] page ${p} error: ${e.message}`);
      break;
    }
    const ids = [...new Set([...html.matchAll(/data-builtin-track-job-id="(\d+)"/g)].map(m => m[1]))];
    let added = 0;
    for (const jid of ids) {
      if (seen.has(jid)) continue;
      const re = new RegExp(`href="(/job/[^"]+)"[^>]*data-builtin-track-job-id="${jid}"[^>]*>(.*?)<\/a>`, 's');
      const tmatch = html.match(re);
      if (!tmatch) continue;
      const title = clean(tmatch[2]);
      const windowStart = html.indexOf(tmatch[0]) + tmatch[0].length;
      const window = html.slice(windowStart, windowStart + 1500);
      const compM = window.match(/data-id="company-title"[^>]*>(.*?)<\/a>/s);
      const company = compM ? clean(compM[1]) : '';
      const locM = window.match(/([A-Za-z][A-Za-z .'`-]+),\s*(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|NT|NU|YT)\b/);
      let loc = '';
      if (locM) loc = `${locM[1].trim()}, ${locM[2]}`;
      else if (/\bremote\b/i.test(window)) loc = 'Remote';
      seen.add(jid);
      out.push({
        title, company, location: loc,
        link: `https://builtin.com${tmatch[1]}`,
        source: 'BuiltIn',
        remote: loc.toLowerCase() === 'remote',
        salary: '', date_posted: '', telework: '',
      });
      added++;
    }
    console.log(`[BUILTIN] page ${p}: ${ids.length} ids, ${added} new`);
    await new Promise(r => setTimeout(r, 400));
  }
  return out;
}

const MGMT_TITLE = /\b(manager|director|head of|vp|vice president|chief|cto|cio|tech lead|engineering lead|it manager|technology (lead|manager)|software (manager|director))\b/i;
const JUNK = /\b(recruiter|non tech|hygiene)\b/i;

async function remoteOKSearch() {
  let data;
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(30_000),
    });
    data = await res.json();
  } catch (e) {
    console.error(`[REMOTEOK] error: ${e.message}`);
    return [];
  }
  if (!Array.isArray(data)) return [];
  const jobs = data.slice(1); // first element is legal notice
  return jobs.flatMap(j => {
    const title = clean(j.position || '');
    if (!MGMT_TITLE.test(title) || JUNK.test(title)) return [];
    const loc = clean(j.location || '') || 'Remote';
    return [{
      title, company: clean(j.company || ''), location: loc,
      link: j.url || '', source: 'RemoteOK', remote: true,
      salary: '', date_posted: clean(j.date || '').slice(0, 10), telework: '',
    }];
  });
}

export async function scrapeExtra() {
  const results = [];

  console.log('Scraping Built In Toronto...');
  try {
    const bi = await builtInSearch('toronto', 2);
    results.push(...bi);
    console.log(`  BuiltIn Toronto: ${bi.length} jobs`);
  } catch (e) {
    console.error(`  BuiltIn failed: ${e.message}`);
  }

  console.log('Scraping RemoteOK...');
  try {
    const ro = await remoteOKSearch();
    results.push(...ro);
    console.log(`  RemoteOK: ${ro.length} jobs`);
  } catch (e) {
    console.error(`  RemoteOK failed: ${e.message}`);
  }

  console.log(`\nExtra total: ${results.length}`);
  return results;
}
