#!/bin/bash
# Job search pipeline — PHASE 2 (deterministic): build report + commit/push.
# Assumes deep_results.json AND llm_results.json already exist (phase 1 + LLM pass).
set -uo pipefail

export HOME=/opt/data
cd /opt/data

LOG=/opt/data/cache/jobsearch-pipeline.log
mkdir -p /opt/data/cache
exec >> "$LOG" 2>&1

echo "==========================================================="
echo "JOB SEARCH PIPELINE (phase 2: build+push)  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "==========================================================="

echo "[3/3] Building HTML report..."
python3 /opt/data/build_scored.py || echo "WARN: build_scored.py failed (exit $?)"

echo ""
echo "Syncing files into git repo..."
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
echo "Committing and pushing..."
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
