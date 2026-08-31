/**
 * LLM scoring — sends each job's title + description to an LLM and gets back
 * a 0-10 fit score, recommendation, strengths, and concerns.
 *
 * Uses OpenAI-compatible API (works with OpenAI, Cloudflare AI via REST,
 * or any OpenAI-compatible endpoint).
 *
 * Required environment variables:
 *   OPENAI_API_KEY   – API key
 *   OPENAI_BASE_URL  – optional; defaults to OpenAI. Set to Cloudflare AI endpoint for free tier.
 *   OPENAI_MODEL     – optional; defaults to gpt-4o-mini
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CANDIDATE_PROFILE = readFileSync(join(__dirname, 'CANDIDATE_PROFILE.md'), 'utf8')

const API_KEY = process.env.OPENAI_API_KEY
const BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const SYSTEM_PROMPT = `You are an expert career advisor evaluating job postings for a specific candidate.
Read the candidate profile carefully, then evaluate how well the job posting matches the candidate.
Respond ONLY with a JSON object — no markdown, no explanation outside the JSON.

Required JSON schema:
{
  "score": <float 0.0-10.0, one decimal place>,
  "recommendation": <"Apply" | "Review" | "Skip">,
  "strengths": <string, 1-2 sentences about fit>,
  "concerns": <string, 1-2 sentences about gaps or flags, empty string if none>,
  "rationale": <string, 2-3 sentences overall justification>
}

Scoring rubric:
- 8.0+: Strong fit — candidate has directly relevant experience for most requirements
- 6.5-7.9: Good fit — solid overlap but some gaps
- 5.0-6.4: Moderate fit — partial match
- <5.0: Weak fit — significant mismatch

Location rule: Non-GTA roles requiring in-office days must be capped below 8.0 (max 7.9).
VP/C-level roles (VP, SVP, EVP, Chief): set recommendation to "Skip", score <= 4.0.
Hands-on dev-team leadership (primary job is daily coding/code-review): lower score accordingly.`

async function scoreJob(job) {
  const userMessage = `## Candidate Profile\n${CANDIDATE_PROFILE}\n\n## Job Posting\nTitle: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}${job.remote ? ' (Remote)' : ''}\n\n${job.description || '(No description available)'}`

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + API_KEY
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage.slice(0, 12000) } // stay within context
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    }),
    signal: AbortSignal.timeout(60_000)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`LLM API error ${res.status}: ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content || '{}'
  try {
    const parsed = JSON.parse(content)
    return {
      score: Math.max(0, Math.min(10, Number(parsed.score) || 0)),
      recommendation: ['Apply', 'Review', 'Skip'].includes(parsed.recommendation) ? parsed.recommendation : 'Review',
      strengths: String(parsed.strengths || ''),
      concerns: String(parsed.concerns || ''),
      score_rationale: String(parsed.rationale || '')
    }
  } catch {
    console.error(`[llm-score] JSON parse error for ${job.title}: ${content.slice(0, 200)}`)
    return { score: null, recommendation: '', strengths: '', concerns: '', score_rationale: '' }
  }
}

/**
 * Score an array of jobs using the LLM.
 * @param {object[]} jobs - array of job records with description populated
 * @param {number} concurrency - parallel requests (default 3; be kind to rate limits)
 * @returns {Promise<object[]>} - same array with score fields populated
 */
export async function scoreJobs(jobs, concurrency = 3) {
  if (!API_KEY) {
    console.warn('[llm-score] OPENAI_API_KEY not set — skipping LLM scoring')
    return jobs
  }

  const results = [...jobs]
  const batches = []
  for (let i = 0; i < jobs.length; i += concurrency) {
    batches.push(jobs.slice(i, i + concurrency))
  }

  let done = 0
  let batchStart = 0
  for (const batch of batches) {
    const scored = await Promise.all(
      batch.map(async (job) => {
        try {
          const s = await scoreJob(job)
          done++
          console.log(`[llm-score] ${done}/${jobs.length} ${job.title} @ ${job.company} -> ${s.score} ${s.recommendation}`)
          return { ...job, ...s }
        } catch (e) {
          done++
          console.error(`[llm-score] ERR ${job.title}: ${e.message}`)
          return job
        }
      })
    )
    for (let i = 0; i < batch.length; i++) {
      results[batchStart + i] = scored[i]
    }
    batchStart += batch.length
    // brief pause between batches to respect rate limits
    await new Promise(r => setTimeout(r, 500))
  }

  return results
}
