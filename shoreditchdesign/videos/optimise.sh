#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC_ROOT="$ROOT/uploads_raw"
DST_ROOT="$ROOT/uploads"
LOG="$ROOT/optimise.log"

CRF=26
MAX_WIDTH=1080

: > "$LOG"

echo "=== ffmpeg optimisation started $(date) ===" | tee -a "$LOG"
echo "CRF=$CRF, max width=$MAX_WIDTH, audio stripped, +faststart" | tee -a "$LOG"
echo "" | tee -a "$LOG"

total_before=0
total_after=0

while IFS= read -r src; do
  rel="${src#$SRC_ROOT/}"
  dst="$DST_ROOT/$rel"
  mkdir -p "$(dirname "$dst")"

  before=$(stat -f%z "$src")
  total_before=$((total_before + before))

  echo ">>> $rel" | tee -a "$LOG"
  echo "    in : $(numfmt --to=iec-i --suffix=B $before 2>/dev/null || echo "$before B")" | tee -a "$LOG"

  tmp="$dst.tmp.mp4"
  ffmpeg -y -hide_banner -loglevel error -stats \
    -i "$src" \
    -c:v libx264 -profile:v main -preset slow -crf "$CRF" \
    -vf "scale='min($MAX_WIDTH,iw)':-2" \
    -movflags +faststart -an \
    -pix_fmt yuv420p \
    "$tmp" 2>&1 | tee -a "$LOG"

  mv "$tmp" "$dst"

  after=$(stat -f%z "$dst")
  total_after=$((total_after + after))

  pct=$(awk -v b="$before" -v a="$after" 'BEGIN{ printf "%.1f", (1 - a/b) * 100 }')
  echo "    out: $(numfmt --to=iec-i --suffix=B $after 2>/dev/null || echo "$after B")  (-${pct}%)" | tee -a "$LOG"
  echo "" | tee -a "$LOG"
done < <(find "$SRC_ROOT" -type f -name '*.mp4' | sort)

pct_total=$(awk -v b="$total_before" -v a="$total_after" 'BEGIN{ printf "%.1f", (1 - a/b) * 100 }')
echo "=== done $(date) ===" | tee -a "$LOG"
echo "Total before: $(numfmt --to=iec-i --suffix=B $total_before 2>/dev/null || echo "$total_before B")" | tee -a "$LOG"
echo "Total after : $(numfmt --to=iec-i --suffix=B $total_after 2>/dev/null || echo "$total_after B")  (-${pct_total}%)" | tee -a "$LOG"
