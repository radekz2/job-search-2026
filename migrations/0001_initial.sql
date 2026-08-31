-- PostgreSQL schema for job-search-2026 (Netlify-hosted app)
-- Run once using your PostgreSQL client against NETLIFY_DATABASE_URL / DATABASE_URL.

CREATE TABLE IF NOT EXISTS jobs (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  company         TEXT NOT NULL DEFAULT '',
  location        TEXT NOT NULL DEFAULT '',
  link            TEXT NOT NULL DEFAULT '',
  source          TEXT NOT NULL DEFAULT '',
  remote          BOOLEAN NOT NULL DEFAULT FALSE,
  salary          TEXT NOT NULL DEFAULT '',
  date_posted     TEXT NOT NULL DEFAULT '',
  date_scraped    TEXT NOT NULL DEFAULT '',
  telework        TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL DEFAULT '',
  bucket          TEXT NOT NULL DEFAULT '',
  level           TEXT NOT NULL DEFAULT '',
  score           DOUBLE PRECISION,
  score_rationale TEXT NOT NULL DEFAULT '',
  recommendation  TEXT NOT NULL DEFAULT '',
  strengths       TEXT NOT NULL DEFAULT '',
  concerns        TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobs_score         ON jobs(score DESC);
CREATE INDEX IF NOT EXISTS jobs_source        ON jobs(source);
CREATE INDEX IF NOT EXISTS jobs_bucket        ON jobs(bucket);
CREATE INDEX IF NOT EXISTS jobs_date_scraped  ON jobs(date_scraped);
CREATE INDEX IF NOT EXISTS jobs_remote        ON jobs(remote);

CREATE TABLE IF NOT EXISTS shortlist (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id         TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status         TEXT NOT NULL DEFAULT 'saved',
  notes          TEXT NOT NULL DEFAULT '',
  date_added     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_updated   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(job_id)
);

CREATE INDEX IF NOT EXISTS shortlist_status ON shortlist(status);

CREATE TABLE IF NOT EXISTS runs (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  jobs_scraped  INTEGER NOT NULL DEFAULT 0,
  jobs_scored   INTEGER NOT NULL DEFAULT 0,
  jobs_new      INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'ok',
  log           TEXT NOT NULL DEFAULT ''
);
