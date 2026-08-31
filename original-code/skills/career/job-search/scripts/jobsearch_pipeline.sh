#!/bin/bash
# Job search pipeline: scrape -> deep-dive -> build -> push to GitHub.
# Runs headless daily via Hermes cron. Delivers the refreshed HTML report
# to the radekz2/job-search-2026 repo (and updates index.html for GitHub Pages).
set -uo pipefail

export HOME=/opt/data
cd /opt/data

LOG=/opt/data/cache/jobsearch-pipeline.log
mkdir -p /opt/data/cache
exec >> "$LOG" 2>&1

echo "==========================================================="
echo "JOB SEARCH PIPELINE  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "==========================================================="

if [ -f /opt/data/.git-credentials ]; then
  echo "git credentials: present"
else
  echo "WARN: no /opt/data/.git-credentials — git push may fail"
fi

echo ""
echo "[1/5] Scraping LinkedIn + Job Bank..."
python3 /opt/data/jobscrape.py    || echo "WARN: jobscrape.py failed (exit $?)"
python3 /opt/data/jobscrape_ca.py || echo "WARN: jobscrape_ca.py failed (exit $?)"

echo ""
echo "[1b/5] Scraping targeted-employer ATS boards (Greenhouse/Lever/Ashby)..."
python3 /opt/data/jobscrape_ats.py || echo "WARN: jobscrape_ats.py failed (exit $?)"

echo ""
echo "[1c/5] Scraping Workday boards (banks/insurers/pensions)..."
python3 /opt/data/jobscrape_workday.py || echo "WARN: jobscrape_workday.py failed (exit $?)"

echo ""
echo "[1d/5] Scraping Adzuna API (aggregator, free tier)..."
python3 /opt/data/jobscrape_adzuna.py || echo "WARN: jobscrape_adzuna.py failed (exit $?)"

echo ""
echo "[2/5] Deep-dive analysis (fetching top job descriptions)..."
python3 /opt/data/deep_dive.py    || echo "WARN: deep_dive.py failed (exit $?)"

echo ""
echo "[3/5] Building HTML report..."
python3 /opt/data/build_scored.py || echo "WARN: build_scored.py failed (exit $?)"

echo ""
echo "[4/5] Syncing files into git repo..."
TODAY=$(date -u +%F)
HTML="/opt/data/resumes/job-search-${TODAY}.html"
REPO="/opt/data/job-search-repo"

if [ -f "$HTML" ]; then
  cp "$HTML" "$REPO/docs/job-search-${TODAY}.html"
  cp "$HTML" "$REPO/docs/index.html"
  echo "copied $HTML -> repo/docs (dated + index.html)"
else
  echo "WARN: $HTML not found"
fi

echo ""
echo "[5/5] Committing and pushing..."
cd "$REPO" || { echo "FAILED: cannot cd to $REPO"; exit 1; }
git add -A
if git diff --cached --quiet; then
  echo "No changes — nothing to commit."
else
  git commit -m "Update job search report ${TODAY}"
  git pull --rebase origin main 2>&1 || echo "WARN: pull --rebase failed"
  if git push origin main; then
    echo "PUSH_OK"
  else
    echo "PUSH_FAILED"
  fi
fi

echo ""
echo "Pipeline complete: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
