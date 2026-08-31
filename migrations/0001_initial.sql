-- D1 schema for job-search-2026
-- Run once: wrangler d1 execute job-search-2026 --file migrations/0001_initial.sql

CREATE TABLE IF NOT EXISTS jobs (
  id            TEXT PRIMARY KEY,          -- stable key: source:title_lower:company_lower hash
  title         TEXT NOT NULL,
  company       TEXT NOT NULL DEFAULT '',
  location      TEXT NOT NULL DEFAULT '',
  link          TEXT NOT NULL DEFAULT '',
  source        TEXT NOT NULL DEFAULT '',  -- LinkedIn | Job Bank | Greenhouse | Lever | Ashby | Workday | Adzuna | BuiltIn | RemoteOK
  remote        INTEGER NOT NULL DEFAULT 0, -- 0/1 boolean
  salary        TEXT NOT NULL DEFAULT '',
  date_posted   TEXT NOT NULL DEFAULT '',  -- YYYY-MM-DD or raw string from source
  date_scraped  TEXT NOT NULL DEFAULT '',  -- YYYY-MM-DD of pipeline run
  telework      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  bucket        TEXT NOT NULL DEFAULT '',  -- 'it' | 'sw' | ''
  level         TEXT NOT NULL DEFAULT '',  -- 'director' | 'manager' | ''
  score         REAL,                       -- 0–10 from LLM
  score_rationale TEXT NOT NULL DEFAULT '',
  recommendation TEXT NOT NULL DEFAULT '', -- Apply | Review | Skip
  strengths     TEXT NOT NULL DEFAULT '',
  concerns      TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS jobs_score       ON jobs(score DESC);
CREATE INDEX IF NOT EXISTS jobs_source      ON jobs(source);
CREATE INDEX IF NOT EXISTS jobs_bucket      ON jobs(bucket);
CREATE INDEX IF NOT EXISTS jobs_date_scraped ON jobs(date_scraped);
CREATE INDEX IF NOT EXISTS jobs_remote      ON jobs(remote);

CREATE TABLE IF NOT EXISTS shortlist (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id      TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'saved', -- saved | applied | interviewing | rejected | offer
  notes       TEXT NOT NULL DEFAULT '',
  date_added  TEXT NOT NULL DEFAULT (datetime('now')),
  date_updated TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(job_id)
);

CREATE INDEX IF NOT EXISTS shortlist_status ON shortlist(status);

CREATE TABLE IF NOT EXISTS runs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  run_at        TEXT NOT NULL DEFAULT (datetime('now')),
  jobs_scraped  INTEGER NOT NULL DEFAULT 0,
  jobs_scored   INTEGER NOT NULL DEFAULT 0,
  jobs_new      INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'ok',  -- ok | error
  log           TEXT NOT NULL DEFAULT ''
);
