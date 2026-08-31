#!/bin/bash
# GTA networking events monitor — finalize step: copy the latest report into the
# job-search repo and commit + push. Runs after the agent merges search results.
set -euo pipefail

REPO=/opt/data/job-search-repo
SRC=/opt/data/resumes/events

cd "$REPO" || exit 1

latest_html=$(ls -t "$SRC"/events-gta-*.html 2>/dev/null | head -1 || true)
latest_json=$(ls -t "$SRC"/events-gta-*.json 2>/dev/null | head -1 || true)

if [ -z "$latest_html" ]; then
  echo "no events report found; nothing to push"
  exit 0
fi

mkdir -p events
cp "$latest_html" events/
if [ -n "$latest_json" ]; then
  cp "$latest_json" events/
fi

git add events/ README.md
if git diff --cached --quiet; then
  echo "no changes to commit"
  exit 0
fi

git commit -m "Update GTA networking events report $(date +%Y-%m-%d)" --quiet
git push origin main --quiet
echo "pushed events report $(date +%Y-%m-%d)"
