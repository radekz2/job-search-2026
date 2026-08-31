#!/bin/bash
# GTA in-person networking/career events monitor — cron wrapper.
# Runs the deterministic scraper; stdout becomes the job output.
set -u
cd /opt/data || exit 1
exec python3 /opt/data/events_monitor.py
