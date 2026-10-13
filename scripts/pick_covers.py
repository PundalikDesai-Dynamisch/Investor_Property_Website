"""Post-process data/properties.json: swap soft covers for sharper photos from the same project, and list hero candidates.
Needs Pillow. Measures images with a ranged request, so it never downloads full files."""
import json, io, sys, urllib.request, concurrent.futures as cf
from collections import Counter
from PIL import Image

SIZES = "/tmp/ppi-imgsizes.json"
P = json.load(open("data/properties.json"))
try: sizes = {u: tuple(s) for u, s in json.load(open(SIZES)).items() if s}
except FileNotFoundError:
    def size(u):
        try:
            r = urllib.request.urlopen(urllib.request.Request(u, headers={"Range": "bytes=0-196607", "User-Agent": "Mozilla/5.0"}), timeout=25)
            return u, Image.open(io.BytesIO(r.read(196608))).size
        except Exception: return u, None
    urls = sorted({u for p in P for u in ([p["cover"]] if p["cover"] else []) + p["gallery"][:5]})
    with cf.ThreadPoolExecutor(24) as ex: sizes = {u: s for u, s in ex.map(size, urls) if s}

import re
BAD = re.compile(r"plan|brochure|floor|layout|unit|map|location|logo|rera|price|payment|specification|co-working|coworking|meeting|theat|show-?flat|flat-|room", re.I)
swapped = []
for p in P:
    c = p["cover"]; w = sizes.get(c, (0, 0))[0]
    alts = [g for g in p["gallery"][:5] if g in sizes and sizes[g][0] >= 1400 and 1.2 <= sizes[g][0] / sizes[g][1] <= 2.1
            and not BAD.search(g.rsplit("/", 1)[-1]) and not any(q["slug"] != p["slug"] and len(q["slug"]) > 14 and q["slug"] in g.lower() for q in P)]
    if c and w < 1100 and alts:
        best = max(alts, key=lambda g: sizes[g][0] * sizes[g][1])
        p["gallery"] = [c] + [g for g in p["gallery"] if g != best]; p["cover"] = best; swapped.append(p["slug"])
# Visual review of the automatic swaps: these picked an amenity or interior shot, a stock image shared by three projects, or a construction photo
MANUAL_REVERT = ['adani-atelier-greens', 'bramha-the-collection-wadgaon-sheri', 'dreams-icon', 'grace-pallacio-dhanori', 'kumar-prospera', 'mantra-magnus-mundhwa', 'nivasa-elevia-keshav-nagar', 'purva-atmosphere-keshav-nagar', 'shreeram-properties', 'space-paramount-tower-nibm', 'triaa-one-aretha-dhanori']
for p in P:
    if p["slug"] in MANUAL_REVERT and p["slug"] in swapped:
        new = p["cover"]; p["cover"] = p["gallery"][0]; p["gallery"] = [new] + p["gallery"][1:]
json.dump(P, open("data/properties.json", "w"), ensure_ascii=False, separators=(",", ":"))
print("covers swapped for sharper photos:", len(swapped))

# hero candidates: wide, large, landscape, priced and RERA-listed
cands = []
for p in P:
    if not (p["priceFromLakh"] and p["rera"] and p["area"]): continue
    opts = [u for u in ([p["cover"]] + p["gallery"][:5]) if u in sizes and sizes[u][0] >= 1600 and 1.3 <= sizes[u][0] / sizes[u][1] <= 1.9]
    if opts:
        u = max(opts, key=lambda x: sizes[x][0]); cands.append((sizes[u][0], p, u))
cands.sort(key=lambda t: -t[0]); per = Counter(); pick = []
for w, p, u in cands:
    if per[p["area"]] < 3: per[p["area"]] += 1; pick.append((w, p, u))
pick = pick[:18]
tiles = []
for i, (w, p, u) in enumerate(pick):
    try: im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=40).read())).convert("RGB")
    except Exception: continue
    im.thumbnail((330, 210)); tiles.append((i, p, u, sizes[u], im))
from PIL import ImageDraw
sheet = Image.new("RGB", (6 * 336, 3 * 246), "white"); d = ImageDraw.Draw(sheet)
for k, (i, p, u, sz, im) in enumerate(tiles):
    x, y = (k % 6) * 336, (k // 6) * 246; sheet.paste(im, (x, y)); d.text((x + 2, y + 212), f"{i} {p['name'][:26]} | {p['area']} | {sz[0]}x{sz[1]}", fill="black")
sheet.save("/tmp/hero-sheet.png")
for i, p, u, sz, im in tiles: print(i, p["slug"], p["area"], sz, u.rsplit("/", 1)[-1][:40])
