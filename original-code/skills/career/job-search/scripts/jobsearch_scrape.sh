#!/bin/bash
# Job search pipeline — PHASE 1 (deterministic): scrape all sources + fetch
# descriptions for the top candidates. The LLM evaluation happens BETWEEN this
# phase and phase 2 (jobsearch_finalize.sh), performed by the agent/cron.
set -uo pipefail

export HOME=/opt/data
cd /opt/data

LOG=/opt/data/cache/jobsearch-pipeline.log
mkdir -p /opt/data/cache
exec >> "$LOG" 2>&1

echo "==========================================================="
echo "JOB SEARCH PIPELINE (phase 1: scrape)  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "==========================================================="

echo "[1/3] Scraping LinkedIn + Job Bank..."
python3 /opt/data/jobscrape.py    || echo "WARN: jobscrape.py failed (exit $?)"
python3 /opt/data/jobscrape_ca.py || echo "WARN: jobscrape_ca.py failed (exit $?)"

echo ""
echo "[1b/3] Scraping targeted-employer ATS boards (Greenhouse/Lever/Ashby)..."
python3 /opt/data/jobscrape_ats.py || echo "WARN: jobscrape_ats.py failed (exit $?)"

echo ""
echo "[1c/3] Scraping Workday boards (banks/insurers/pensions)..."
python3 /opt/data/jobscrape_workday.py || echo "WARN: jobscrape_workday.py failed (exit $?)"

echo ""
echo "[1d/3] Scraping Adzuna API (aggregator, free tier)..."
python3 /opt/data/jobscrape_adzuna.py || echo "WARN: jobscrape_adzuna.py failed (exit $?)"

echo ""
echo "[2/3] Building recall-filtered candidate list for LLM title-triage..."
python3 /opt/data/build_candidates.py || echo "WARN: build_candidates.py failed (exit $?)"

echo ""
echo "Phase 1 complete — candidates.json ready for LLM title-triage."
echo "NEXT (agent): (1) triage candidates -> triage_indices.json, (2) deep_dive.py fetch,"
echo "              (3) LLM eval -> llm_results.json, then phase 2."
