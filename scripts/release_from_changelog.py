"""Creates a git tag + GitHub Release for every released version in CHANGELOG.md
that does not have a tag yet. Runs in GitHub Actions after each merge to main.

A version counts as released when its heading looks like `## v2.1 — 23.11.2026`
(a date, not "в работе"). The tag goes on the commit named in the section
(`commit `abc1234`` or `merge `abc1234``), otherwise on the merge commit.
"""
import re, subprocess, sys

def sh(*a, check=True):
    return subprocess.run(a, check=check, capture_output=True, text=True).stdout.strip()

text = open("CHANGELOG.md", encoding="utf-8").read()
parts = re.split(r"^## ", text, flags=re.M)[1:]
existing = set(sh("git", "tag", "--list").split())
made = []
for part in reversed(parts):  # oldest first
    head, _, body = part.partition("\n")
    m = re.match(r"(v\d+\.\d+)\s+—\s+(\d{2}\.\d{2}\.\d{4})", head)
    if not m or m.group(1) in existing:
        continue
    ver = m.group(1)
    c = re.search(r"(?:commit|merge)\s+`([0-9a-f]{7,40})`", body)
    target = c.group(1) if c else "HEAD"
    sh("git", "tag", "-a", ver, target, "-m", head.strip())
    sh("git", "push", "origin", ver)
    notes = body.strip() + "\n\nFigma: page «🗂 " + ver + " · " + m.group(2) + "» in MAVPY — Site v2 Workshop"
    sh("gh", "release", "create", ver, "--title", head.strip(), "--notes", notes, "--verify-tag")
    made.append(ver)
print("released:", made or "nothing new")
