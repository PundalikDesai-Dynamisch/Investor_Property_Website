"""Turn the crawl of punepropertyinvestor.com into structured content files for the new site."""
import json, re, os, csv, html as H
from pathlib import Path
from collections import Counter
from bs4 import BeautifulSoup, NavigableString

A = Path(__file__).parent
OUT = Path(os.environ["OUT"])
(OUT / "data").mkdir(parents=True, exist_ok=True)
(OUT / "audit").mkdir(exist_ok=True)
SITE = "https://punepropertyinvestor.com"
pages = {p["slug"]: p for p in json.load(open(A / "pages.json")) if not p.get("missing")}
props = {r["slug"]: r for r in json.load(open(A / "properties.json"))}
areas = json.load(open(A / "areas.json"))
JUNK = {"oxy-eterno-copy", "dosti-greenscapes-copy", "vtp-pegasus"}
TEST = {"redblack", "blackyellow", "orange-pink", "calm-min"}
AREA_NAMES = {"kharadi": "Kharadi", "dhanori": "Dhanori", "mundhwa": "Mundhwa", "hadapsar": "Hadapsar", "keshav-nagar": "Keshav Nagar",
              "charholi": "Charholi", "wagholi": "Wagholi", "nibm": "NIBM", "undri": "Undri", "lohegaon": "Lohegaon",
              "wadgaon-sheri": "Wadgaon Sheri", "viman-nagar": "Viman Nagar", "manjari": "Manjari", "kalyani-nagar": "Kalyani Nagar"}

def clean(s): return re.sub(r"\s+", " ", H.unescape(s or "")).strip()
def slugify(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
def soup(slug): return BeautifulSoup(open(A / "html" / f"{slug}.html", encoding="utf-8", errors="ignore").read(), "lxml")

def full(src):
    src = src.strip()
    if src.startswith("//"): src = "https:" + src
    if src.startswith("/"): src = SITE + src
    return re.sub(r"-\d{2,4}x\d{2,4}(?=\.(?:jpe?g|png|webp)$)", "", src)

def lakh(s):
    m = re.search(r"(\d+(?:\.\d+)?)\s*(cr(?:ore)?s?|lakhs?|lacs?|l)\b", s or "", re.I)
    if not m: return None
    v = float(m.group(1))
    return round(v * 100, 2) if m.group(2).lower().startswith("cr") else v

DEV_FIX = {"Godrej Properties Limited": "Godrej Properties", "Gera Developments Private Limited": "Gera Developments", "Puravankara Limited": "Puravankara",
           "Puravankara Group": "Puravankara", "Goel Ganga Developments": "Goel Ganga Group", "The Choice Group": "Choice Group", "Duville Estates Private Limited": "Duville Estates",
           "Pristine Developers": "Pristine Properties", "Rohan Builders and Developers Private Limited": "Rohan Builders", "Gulmohar Development Pvt Ltd": "Gulmohar Developers",
           "Joyville Shapoorji Housing Pvt. Ltd.": "Joyville Shapoorji", "Kolte-Patil Developers": "Kolte-Patil Developers", "Rahul Properties & Pragati Group": "Rahul Properties & Pragati Group"}
def developer(r):
    d = clean(r.get("developer_schema"))
    if not d or d == "Pune Property Investor": return None
    return DEV_FIX.get(d, re.sub(r"\s*\b(Private Limited|Pvt\.? Ltd\.?|LLP)\b\.?", "", d).strip())

def status_of(ps):
    p = (ps or "").lower()
    if not p: return None
    if "ready" in p: return "ready"
    if "new launch" in p: return "new_launch"
    return "under_construction"

def nums(s): return [float(x.replace(",", "")) for x in re.findall(r"\d[\d,]*\.?\d*", s or "") if float(x.replace(",", "")) >= 100]

BAD_IMG = re.compile(r"logo|icon|spinner|placeholder|whatsapp|\.svg|ppi|brochure_page|avatar|flag", re.I)
def project(slug):
    r, p = props[slug], pages[slug]
    s = soup(slug); main = s.select_one("#primary") or s.body
    fp, mp, gal = [], [], []
    for im in main.find_all("img"):
        src = im.get("data-src") or im.get("data-lazy-src") or im.get("src") or ""
        if not src or src.startswith("data:") or BAD_IMG.search(src.rsplit("/", 1)[-1]): continue
        u = full(src); cls = " ".join(x for par in im.parents for x in (par.get("class") or []))
        if "eael-cf-floor-plan" in cls: (fp if u not in fp else []).append(u)
        elif "eael-cf-master-plan" in cls: (mp if u not in mp else []).append(u)
        elif u not in gal: gal.append(u)
    ld_img = None; ld_desc = None
    for sc in s.find_all("script", type="application/ld+json"):
        try: d = json.loads(sc.string or "{}")
        except Exception: continue
        for n in (d.get("@graph", [d]) if isinstance(d, dict) else d):
            if isinstance(n, dict) and n.get("@type") == "Product":
                ld_img = ld_img or n.get("image"); ld_desc = ld_desc or n.get("description")
    ok = lambda u: u and not BAD_IMG.search(u.rsplit("/", 1)[-1]) and "Engineers-2" not in u
    cover = next((u for u in [full(ld_img) if isinstance(ld_img, str) else None, gal[0] if gal else None, full(p.get("og_image") or "")] if ok(u)), None)
    gal = [g for g in gal if g != cover][:14]
    confs = r["configs"]
    h1p = lakh(r.get("price_in_h1"))
    cp = [lakh(c["price"]) for c in confs if lakh(c["price"])]
    if slug == "pristine-o2-world-kharadi": h1p = 111.0
    price = h1p or (min(cp) if cp else None)
    flags = []
    if not r.get("rera"): flags.append("RERA number missing")
    if price is None: flags.append("Starting price missing")
    if price and cp and min(cp) < price - 0.5: flags.append("Headline price differs from configuration cards")
    if not developer(r): flags.append("Developer missing")
    bhk = sorted({float(m) for c in confs for m in re.findall(r"^(\d(?:\.\d)?)", c["type"])} or {float(m) for m in re.findall(r"(\d(?:\.\d)?)\s*(?:BHK|&|,)", (r.get("configuration") or "") + " BHK")})
    area_key = areas.get(slug, {}).get("area"); area_key = area_key if area_key in AREA_NAMES else None
    desc = clean(ld_desc) or clean(p.get("meta_description"))
    if desc in ("Description", "Menu", "") or len(desc) < 40: desc = ""
    title = re.sub(r"\s*[-|]\s*Pune Property Investor\s*$", "", clean(p["title"])).replace("*", "").strip()
    name = clean(re.sub(r"\s*\*|\s+From\s+₹.*$", "", r["name"] or title))
    a = AREA_NAMES.get(area_key, "Pune")
    if p["title"].endswith("Pune Property Investor"): title = f"{name} {a} Pune | Price, Floor Plans & Brochure" if a != "Pune" else f"{name} Pune | Price, Floor Plans & Brochure"
    pdf = next((x for x in r["brochure_links"] if x.endswith(".pdf")), None)
    ll = areas.get(slug, {}).get("latlng")
    return {"slug": slug, "name": name, "developer": developer(r), "developerSlug": slugify(developer(r)) if developer(r) else None, "area": area_key,
            "status": status_of(r.get("possession_status")), "statusLabel": r.get("possession_status"), "priceFromLakh": price,
            "configs": [{"type": c["type"], "carpet": c["carpet"], "price": c["price"], "priceLakh": lakh(c["price"])} for c in confs],
            "bhk": bhk, "carpetMin": min(nums(r.get("carpet_area")) or [None]) if nums(r.get("carpet_area")) else None,
            "carpetMax": max(nums(r.get("carpet_area")) or [None]) if nums(r.get("carpet_area")) else None, "carpetLabel": r.get("carpet_area"),
            "landParcel": r.get("land_parcel"), "towers": r.get("towers"), "floors": r.get("floors"), "rera": r.get("rera"),
            "targetPossession": r.get("target_possession"), "reraPossession": r.get("rera_possession"), "litigation": r.get("litigation"),
            "video": (r["youtube"] or [None])[0], "lat": ll[0] if ll else None, "lng": ll[1] if ll else None, "brochure": pdf,
            "cover": cover, "gallery": gal, "floorPlans": fp[:8], "masterPlans": mp[:3], "description": desc, "metaTitle": title, "lastmod": p["lastmod"], "layout": r["template"], "flags": flags}

proj_slugs = [s for s in props if s not in JUNK and s not in TEST and s in pages]
projects = [project(s) for s in proj_slugs]
projects.sort(key=lambda x: (x["lastmod"] or "", x["name"]), reverse=True)
json.dump(projects, open(OUT / "data/properties.json", "w"), ensure_ascii=False, separators=(",", ":"))

# ---- generic content cleaner (posts and legacy pages) ----
SKIP = {"script", "style", "noscript", "form", "nav", "iframe", "svg", "button", "input", "select", "textarea", "header", "footer"}
INLINE = {"span", "font", "u", "mark", "small", "sup", "sub", "abbr", "label"}
def render(el):
    if isinstance(el, NavigableString): return H.escape(str(el))
    n = el.name
    if n is None or n in SKIP: return ""
    cls = " ".join(el.get("class", []))
    if any(k in cls for k in ("screen-reader", "elementor-widget-spacer", "elementor-widget-divider", "comment", "share")): return ""
    if re.fullmatch(r"h[1-6]", n):
        t = clean(el.get_text(" ")); lvl = 2 if n in ("h1", "h2") else 3 if n == "h3" else 4
        return f"<h{lvl}>{H.escape(t)}</h{lvl}>" if t else ""
    if n == "img":
        src = el.get("data-src") or el.get("data-lazy-src") or el.get("src") or ""
        if not src or src.startswith("data:") or "spinner" in src: return ""
        return f'<img src="{H.escape(full(src))}" alt="{H.escape(clean(el.get("alt")))}" loading="lazy">'
    if n == "br": return "<br>"
    inner = "".join(render(c) for c in el.children)
    if n in INLINE: return inner
    if n == "p": return f"<p>{inner.strip()}</p>" if clean(el.get_text()) or el.find("img") else ""
    if n in ("b", "strong"): return f"<strong>{inner}</strong>"
    if n in ("i", "em"): return f"<em>{inner}</em>"
    if n in ("ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th", "blockquote"): return f"<{n}>{inner}</{n}>"
    if n == "a":
        href = el.get("href", "")
        if not href or href.startswith("#") or href.startswith("tel:") and False: return inner
        return f'<a href="{H.escape(href.replace(SITE, "") or "/")}">{inner}</a>'
    out = []
    for c in el.children:
        if isinstance(c, NavigableString):
            t = clean(str(c)); out.append(f"<p>{H.escape(t)}</p>" if t else "")
        else: out.append(render(c))
    return "".join(out)

def article_html(slug, title=None):
    s = soup(slug)
    for sel in ("#comments", ".comments-area", ".post-navigation", ".ast-single-related-posts-container", ".ast-author-box"):
        for x in s.select(sel): x.decompose()
    root = s.select_one(".entry-content") or s.select_one("#primary") or s.body
    h = render(root)
    h = re.sub(r"<p>\s*</p>", "", h)
    if title: h = re.sub(r"^\s*<h[23]>\s*" + re.escape(H.escape(title)) + r"\s*</h[23]>", "", h)
    return h

# ---- posts ----
idx = soup("blogs"); dates = {}
for art in idx.select("#primary article, #primary .hfe-post-wrapper, #primary [class*='hfe-post']"):
    a = art.find("a", href=True)
    t = re.search(r"([A-Z][a-z]+ \d{1,2}, \d{4})", art.get_text(" "))
    if a and t: dates[a["href"].replace(SITE, "").strip("/")] = t.group(1)
from datetime import datetime
CAT = {"real-estate-sector-in-pune": "Market insights", "real-estate-market-of-india": "Market insights", "real-estate-market-trends-analysis": "Market insights", "what-is-real-estate": "Basics",
       "best-locations-to-invest-in-pune": "Area guides", "why-invest-in-kharadi": "Area guides", "top-5-emerging-real-estate-hotspots-in-east-pune": "Area guides", "dhanori-vs-charholi-homebuying-guidance": "Area guides"}
LOCTAG = {"kharadi": "Kharadi", "dhanori": "Dhanori", "charholi": "Charholi", "east pune": "East Pune"}
posts = []
for slug, p in pages.items():
    if p["sitemap"] != "post": continue
    body = article_html(slug, p["h1"][0] if p["h1"] else None)
    words = len(re.sub(r"<[^>]+>", " ", body).split())
    d = dates.get(slug); iso = datetime.strptime(d, "%B %d, %Y").strftime("%Y-%m-%d") if d else p["lastmod"]
    txt = (p["title"] + " " + (p["h1"][0] if p["h1"] else "")).lower()
    posts.append({"slug": slug, "title": p["h1"][0] if p["h1"] else p["title"], "excerpt": clean(p["meta_description"]), "date": iso, "category": CAT.get(slug, "Market insights"),
                  "locations": [v for k, v in LOCTAG.items() if k in txt], "cover": full(p.get("og_image") or ""), "readingMinutes": max(2, round(words / 200)), "html": body, "metaTitle": re.sub(r"\s*\|\s*Blog\s*\|\s*Pune Property Investor|\s*-\s*Pune Property Investor", "", clean(p["title"]))})
posts.sort(key=lambda x: x["date"], reverse=True)
json.dump(posts, open(OUT / "data/posts.json", "w"), ensure_ascii=False, separators=(",", ":"))

# ---- legacy pages ----
legacy = {}
for slug in ["privacy-policy", "term-condition", "career-in-pune", "sales-executive", "pre-sales-executive", "media", "awards-certifications", "koregaonpark"]:
    p = pages[slug]; legacy[slug] = {"slug": slug, "title": (p["h1"][0] if p["h1"] else re.sub(r"\s*[-|].*$", "", p["title"])), "metaTitle": clean(p["title"]), "description": clean(p["meta_description"]), "html": article_html(slug)}
json.dump(legacy, open(OUT / "data/pages.json", "w"), ensure_ascii=False, separators=(",", ":"))

# ---- hub intros ----
hubs = {}
for k in ["kharadi", "dhanori", "wagholi", "hadapsar", "keshav-nagar", "mundhwa", "nibm", "charholi"]:
    t = open(A / "text" / f"2-bhk-flats-in-{k}.txt").read()
    m = re.search(r"Introduction\s+(.{80,900}?[.!?])\s", t)
    hubs[k] = clean(m.group(1)) if m else ""
json.dump(hubs, open(OUT / "data/hubs.json", "w"), ensure_ascii=False, indent=1)

# ---- videos ----
vs = soup("video-gallery-project-tours"); main = vs.select_one("#primary") or vs.body
vtext = clean(main.get_text(" ")); group = ""; videos = []
STOP = {"pune", "bhk", "flats", "by", "the", "of", "and", "cr", "lac", "lakh", "tour", "kharadi", "dhanori", "lohegaon", "charholi", "mundhwa", "wagholi", "nibm", "hadapsar", "keshav", "nagar", "upper", "sheri", "wadgaon", "one", "holding", "3"}
def toks(x): return {t for t in re.findall(r"[a-z0-9]+", x.lower()) if t not in STOP and not t.isdigit()}
for w in main.select("[data-widget_type]"):
    t = w["data-widget_type"].split(".")[0]
    if t == "heading": group = clean(w.get_text(" "))
    if t == "video-playlist":
        for tab in json.loads(w.get("data-settings") or "{}").get("tabs", []):
            title = clean(tab.get("title")); m = re.search(r"(?:youtu\.be/|v=)([\w-]{11})", tab.get("youtube_url", ""))
            if not m: continue
            d = re.search(re.escape(title) + r"\s+(\d{1,2}:\d{2})", vtext)
            vt = toks(re.split(r"[|₹]", title)[0]); best = None
            for pr in projects:
                pt = toks(pr["name"] + " " + pr["slug"].replace("-", " "))
                if len(vt) >= 2 and len(pt) >= 2 and (vt <= pt or pt <= vt): best = pr["slug"]; break
            videos.append({"id": m.group(1), "title": re.split(r"\s*\|\s*₹", title)[0].strip(), "group": group, "duration": d.group(1) if d else None, "project": best})
json.dump(videos, open(OUT / "data/videos.json", "w"), ensure_ascii=False, indent=1)

# ---- audit deliverable ----
with open(OUT / "audit/url-inventory.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["url", "in_sitemap", "lastmod", "title", "h1_count", "words", "robots", "canonical"])
    for p in pages.values(): w.writerow([p["url"], p["sitemap"] != "unlisted", p["lastmod"], p["title"], len(p["h1"]), p["words_main"], p["robots"], p["canonical"]])

# ---- report ----
print("projects", len(projects), "| priced", sum(1 for x in projects if x["priceFromLakh"]), "| rera", sum(1 for x in projects if x["rera"]), "| dev", sum(1 for x in projects if x["developer"]),
      "| video", sum(1 for x in projects if x["video"]), "| floorplans", sum(1 for x in projects if x["floorPlans"]), "| coords", sum(1 for x in projects if x["lat"]), "| area", sum(1 for x in projects if x["area"]))
print("status", Counter(x["status"] for x in projects)); print("devs", len({x["developer"] for x in projects if x["developer"]}))
print("posts", [(x["slug"], x["date"], x["readingMinutes"]) for x in posts]); print("videos", len(videos), "matched", sum(1 for v in videos if v["project"]))
print("legacy", {k: len(v["html"]) for k, v in legacy.items()}); print("hub intros", {k: len(v) for k, v in hubs.items()})
print("sample", json.dumps({k: v for k, v in projects[0].items() if k not in ("gallery",)}, ensure_ascii=False)[:900])
about = clean(soup("about-us").select_one("#primary").get_text(" "))
i = about.find("What We Do"); print("\nABOUT:", about[i:i + 3300])
