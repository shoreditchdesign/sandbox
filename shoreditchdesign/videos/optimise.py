#!/usr/bin/env python3
"""Optimise videos with ffmpeg: H.264 CRF 26, max 1080p, no audio, +faststart."""
import os
import subprocess
import sys
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent
SRC_ROOT = ROOT / "uploads_raw"
DST_ROOT = ROOT / "uploads"
LOG = ROOT / "optimise.log"

CRF = "26"
MAX_WIDTH = 1080


def human(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024:
            return f"{n:.1f} {unit}"
        n /= 1024
    return f"{n:.1f} TB"


def main() -> int:
    log = open(LOG, "w", buffering=1)

    def emit(msg: str) -> None:
        print(msg)
        log.write(msg + "\n")

    emit(f"=== ffmpeg optimisation started {datetime.now().isoformat(timespec='seconds')} ===")
    emit(f"CRF={CRF}, max width={MAX_WIDTH}, audio stripped, +faststart")
    emit("")

    sources = sorted(SRC_ROOT.rglob("*.mp4"))
    total_before = total_after = 0

    for src in sources:
        rel = src.relative_to(SRC_ROOT)
        dst = DST_ROOT / rel
        dst.parent.mkdir(parents=True, exist_ok=True)

        before = src.stat().st_size
        total_before += before
        emit(f">>> {rel}")
        emit(f"    in : {human(before)}")

        tmp = dst.with_suffix(".tmp.mp4")
        cmd = [
            "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
            "-i", str(src),
            "-c:v", "libx264", "-profile:v", "main", "-preset", "slow", "-crf", CRF,
            "-vf", f"scale='min({MAX_WIDTH},iw)':-2",
            "-movflags", "+faststart", "-an",
            "-pix_fmt", "yuv420p",
            str(tmp),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            emit(f"    ERROR: {result.stderr.strip()}")
            return 1

        tmp.replace(dst)
        after = dst.stat().st_size
        total_after += after
        pct = (1 - after / before) * 100
        emit(f"    out: {human(after)}  (-{pct:.1f}%)")
        emit("")

    pct_total = (1 - total_after / total_before) * 100 if total_before else 0
    emit(f"=== done {datetime.now().isoformat(timespec='seconds')} ===")
    emit(f"Total before: {human(total_before)}")
    emit(f"Total after : {human(total_after)}  (-{pct_total:.1f}%)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
