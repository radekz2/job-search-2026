/**
 * Fetch full job descriptions for top-scored candidates.
 * Mirrors original-code/deep_dive.py.
 *
 * Reads candidates from stdin (JSON array) and outputs enriched records to stdout.
 * Sources:
 *   - LinkedIn: https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{id}
 *   - Job Bank: https://www.jobbank.gc.ca/jobsearch/jobposting/{id}
 *   - ATS (Greenhouse/Lever/Ashby): description already in the record
 *   - Workday: JSON-LD on job page
 */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function clean(s) {
  return (s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.text();
}

async function linkedinDesc(jobId) {
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
  const html = await fetchText(url);
  const m = html.match(/<div class="description__text[^"]*">([\s\S]*?)<\/div>/);
  return m ? clean(m[1]) : '';
}

async function jobBankDesc(jobId) {
  const url = `https://www.jobbank.gc.ca/jobsearch/jobposting/${jobId}`;
  const html = await fetchText(url);
  const m = html.match(/<div id="job-details"[^>]*>([\s\S]*?)<\/div>/);
  return m ? clean(m[1]) : '';
}

async function workdayDesc(link) {
  const html = await fetchText(link);
  const ldM = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (ldM) {
    try {
      const ld = JSON.parse(ldM[1]);
      return clean(ld.description || ld.jobDescription || '');
    } catch {}
  }
  const descM = html.match(/jobDescription['"]\s*:\s*['"]([^'"]{50,})/);
  return descM ? clean(descM[1]) : '';
}

function linkedinJobId(link) {
  const m = link.match(/jobs\/view\/(\d+)/);
  return m ? m[1] : null;
}

function jobBankJobId(link) {
  const m = link.match(/jobposting\/(\d+)/);
  return m ? m[1] : null;
}

async function fetchDescription(job) {
  if (job.description && job.description.length > 100) return job.description;
  try {
    if (job.source === 'LinkedIn') {
      const id = linkedinJobId(job.link);
      return id ? await linkedinDesc(id) : '';
    }
    if (job.source === 'Job Bank') {
      const id = jobBankJobId(job.link);
      return id ? await jobBankDesc(id) : '';
    }
    if (job.source === 'Workday') {
      return await workdayDesc(job.link);
    }
  } catch (e) {
    console.error(`[deep-dive] ${job.title} @ ${job.company}: ${e.message}`);
  }
  return job.description || '';
}

const FALLBACK_N = 25;

/**
 * Enrich top-N candidates with their full descriptions.
 * @param {object[]} candidates - sorted candidates (best first)
 * @param {number} n - how many to fetch descriptions for
 * @returns {Promise<object[]>} - same array with description populated
 */
export async function deepDive(candidates, n = FALLBACK_N) {
  const top = candidates.slice(0, n);
  for (let i = 0; i < top.length; i++) {
    const job = top[i];
    const desc = await fetchDescription(job);
    top[i] = { ...job, description: desc };
    console.log(`[deep-dive] ${i + 1}/${top.length} ${job.title} @ ${job.company} (${desc.length} chars)`);
    await new Promise(r => setTimeout(r, 400));
  }
  return top;
}
