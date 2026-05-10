#!/usr/bin/env python3
"""Step 1: Walk case-studies.csv and emit jobs.csv with one row per video to process."""
import csv
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "case-studies.csv"
JOBS = ROOT / "jobs.csv"

BUNNY_HOST = "shoreditchdesign.b-cdn.net"

FIELD_TO_FILENAME = {
    "Main Vimeo ID": "Main Video",
    "Thumbnail Video": "Thumbnail Video",
    **{f"Vimeo ID {i}": str(i) for i in range(1, 17)},
}


def bunny_url(project: str, filename: str) -> str:
    return f"https://{BUNNY_HOST}/{quote(project)}/{quote(filename)}.mp4"


def local_path(project: str, filename: str) -> str:
    return f"uploads/{project}/{filename}.mp4"


def main() -> None:
    with open(SOURCE, newline="") as f:
        rows = list(csv.DictReader(f))

    jobs = []
    rows_with_videos = 0
    rows_without = 0
    field_counts = {f: 0 for f in FIELD_TO_FILENAME}

    for row in rows:
        item_id = row["Item ID"]
        project = row["Name"]
        row_jobs = []
        for csv_field, filename in FIELD_TO_FILENAME.items():
            vimeo_id = row.get(csv_field, "").strip()
            if not vimeo_id:
                continue
            field_counts[csv_field] += 1
            row_jobs.append({
                "Item ID": item_id,
                "Project": project,
                "CSV Field": csv_field,
                "Filename": filename,
                "VimeoID": vimeo_id,
                "LocalPath": local_path(project, filename),
                "BunnyURL": bunny_url(project, filename),
            })
        if row_jobs:
            rows_with_videos += 1
            jobs.extend(row_jobs)
        else:
            rows_without += 1

    with open(JOBS, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Item ID", "Project", "CSV Field", "Filename",
            "VimeoID", "LocalPath", "BunnyURL",
        ])
        writer.writeheader()
        writer.writerows(jobs)

    unique_ids = {j["VimeoID"] for j in jobs}

    print(f"Source rows         : {len(rows)}")
    print(f"Rows with ≥1 video  : {rows_with_videos}")
    print(f"Rows with 0 videos  : {rows_without}")
    print(f"Total jobs          : {len(jobs)}")
    print(f"Unique Vimeo IDs    : {len(unique_ids)}")
    print(f"Reused IDs          : {len(jobs) - len(unique_ids)}")
    print()
    print("Per-field breakdown:")
    for field, count in field_counts.items():
        if count:
            print(f"  {field:<20} {count}")
    print()
    print(f"→ {JOBS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
