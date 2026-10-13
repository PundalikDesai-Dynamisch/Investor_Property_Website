"""Extract a structured property record from every project page (both page templates) and score completeness."""
import json, re, collections
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).parent
pages = {p["slug"]: p for p in json.loads((ROOT / "pages.json").read_text()) if not p.get("missing")}

NON_PROJECT = {
    "_home", "blogs", "demo-home", "about-us", "video-gallery-project-tours", "privacy-policy", "home-loan-eligibility-checker",
    "luxury-properties-in-pune", "awards-certifications", "enquire-now", "koregaonpark", "career-in-pune", "sales-executive",
    "pre-sales-executive", "contact-us", "media", "emi-calculator", "login", "my-account-2", "lost-password", "registration",
    "news", "search-results", "shop", "cart", "checkout", "my-account", "events", "term-condition", "location", "thank-you",
    "gera-island-of-joy-2",
}
TEST_VARIANTS = {"redblack", "blackyellow", "orange-pink", "calm-min"}
LOCALITIES = ["upper-kharadi", "kharadi", "wagholi", "dhanori-tingre-nagar", "dhanori", "lohegaon", "charholi", "mundhwa-kp-annexe",
              "mundhwa", "keshav-nagar", "hadapsar", "upper-nibm", "nibm", "undri", "viman-nagar", "wadgaon-sheri", "kalyani-nagar", "manjari"]

def clean(s):
    return re.sub(r"\s+", " ", s or "").strip()

def grab(pattern, text):
    m = re.search(pattern, text, re.I)
    return clean(m.group(1)) if m else None

out = []
for slug, p in pages.items():
    if slug in NON_PROJECT or slug.startswith("2-bhk-flats-in") or p["sitemap"] == "post":
        continue
    html = (ROOT / "html" / f"{slug}.html").read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "lxml")
    main = soup.select_one("#primary") or soup.body
    text = clean(main.get_text(" "))
    rec = {"slug": slug, "url": p["url"], "lastmod": p["lastmod"], "in_sitemap": p["sitemap"] != "unlisted", "test_variant": slug in TEST_VARIANTS}
    rec["template"] = "v2" if ("Land Parcel" in text or "RERA No" in text) else ("v1" if ("Enjoy the best Rates" in text or "Total Acres" in text or "PRICE LIST" in text) else "other")
    rec["locality"] = next((l for l in LOCALITIES if slug.endswith(l) or f"-{l}-" in slug), None)
    h1 = p["h1"][0] if p["h1"] else None
    rec["h1"] = h1
    rec["name"] = re.split(r"\s+From\s+₹", h1)[0].strip() if h1 else (p["title"].split(" - ")[0].split(" | ")[0].strip("* "))
    rec["price_in_h1"] = grab(r"From\s+(₹\s*[\d.,]+\s*(?:Lakhs?|Lacs?|Cr|Crore)s?)", h1 or "")
    # v2 specification grid
    rec["land_parcel"] = grab(r"Land Parcel\s+(.+?)\s+[▥⌂▤▧▣⚒◷⚖]", text) or grab(r"Total Acres\s+([\d.]+\s*Acres?)", text)
    rec["towers"] = grab(r"Towers\s+([\w+ ]{1,12}?)\s+[▤⌂▧▣⚒◷⚖]", text) or grab(r"Total Towers\s+(\d+\s*Towers?)", text)
    rec["floors"] = grab(r"Floors\s+([\w+ ]{1,12}?)\s+[⌂▧▣⚒◷⚖]", text) or grab(r"Total Floors\s+(\d+\s*Floors?)", text)
    rec["configuration"] = grab(r"Configuration\s+([\d.,& BHKRrkStudioPenthouse/]+?)\s+[▧▣⚒◷⚖]", text)
    rec["carpet_area"] = grab(r"Carpet Area\s+([\d,.\s–-]+sq\.?\s*ft\.?\*?)", text)
    rec["rera"] = grab(r"RERA\s*(?:No\.?|Number|Reg(?:istration)?\.?(?: No\.?)?)\s*:?\s*([A-Z]{1,3}\d{8,14}(?:\s*,\s*[A-Z]{1,3}\d{8,14})*)", text) or grab(r"\b(P5\d{9,12})\b", text)
    rec["possession_status"] = grab(r"Possession Status\s+(.+?)\s+[◷⚖▤]", text)
    rec["target_possession"] = grab(r"Target Possession\s+(\w+\s*\d{4}|\w+\s*\d{2})", text) or grab(r"Possesion\s+(\w+\s*\d{2,4})", text)
    rec["rera_possession"] = grab(r"RERA Possession\s+(\w+\s*\d{4})", text)
    rec["litigation"] = grab(r"Litigation\s+(Yes|No|NA|N/A|Nil)\b", text)
    # configurations with price
    configs = []
    for m in re.finditer(r"(\d(?:\.\d)?\s*BHK(?:\s*\([^)]{1,20}\))?)\s+Carpet Area\s+(.+?)\s+Starting Price\s+(.+?)(?:\s+⬇|\s+Download|\s+\d(?:\.\d)?\s*BHK|$)", text):
        configs.append({"type": clean(m.group(1)), "carpet": clean(m.group(2)), "price": clean(m.group(3))})
    if not configs:
        for m in re.finditer(r"(\d(?:\.\d)?\s*BHK)\s+(₹\s*[\d.]+\s*(?:Lac|Lakh|Cr|CR)s?\*?\s*(?:onwards\*?)?)\s+Area\s+([\d,.\s–-]+sq\.?\s*ft)", text, re.I):
            configs.append({"type": clean(m.group(1)), "price": clean(m.group(2)), "carpet": clean(m.group(3))})
    rec["configs"] = configs
    # developer from JSON-LD brand when present
    brand = None
    for s in soup.find_all("script", type="application/ld+json"):
        try:
            d = json.loads(s.string or "{}")
        except Exception:
            continue
        for n in (d.get("@graph", [d]) if isinstance(d, dict) else d):
            if isinstance(n, dict) and n.get("@type") == "Product" and isinstance(n.get("brand"), dict):
                brand = n["brand"].get("name")
    rec["developer_schema"] = brand
    rec["developer_text"] = grab(r"(?:developed by|developer)\s+(?:the\s+)?([A-Z][\w&.]+(?:\s+[A-Z][\w&.]+){0,3})", text)
    rec["youtube"] = p["youtube_ids"]
    rec["has_map"] = any("google.com/maps" in (i or "") for i in p["iframes"])
    rec["imgs"] = p["imgs_main"]
    rec["imgs_no_alt"] = p["imgs_no_alt"]
    rec["has_floorplan"] = "Floor Plan" in text
    rec["has_masterplan"] = "Master Plan" in text
    rec["has_amenities"] = bool(re.search(r"AMENITIES", text, re.I))
    rec["brochure_links"] = sorted(set(a.get("href", "") for a in main.find_all("a") if "rochure" in a.get_text())) [:4]
    rec["dead_cta"] = sum(1 for a in main.find_all("a") if a.get("href") == "#" and re.search(r"call|whatsapp", a.get_text(), re.I))
    rec["words"] = p["words_main"]
    rec["title"] = p["title"]
    rec["meta_description"] = p["meta_description"]
    out.append(rec)

(ROOT / "properties.json").write_text(json.dumps(out, indent=1, ensure_ascii=False))
real = [r for r in out if not r["test_variant"]]
print("project-like pages:", len(out), "| excluding test variants:", len(real))
print("templates:", collections.Counter(r["template"] for r in real))
print("locality:", collections.Counter(r["locality"] for r in real).most_common())
fields = ["price_in_h1", "land_parcel", "towers", "floors", "configuration", "carpet_area", "rera", "possession_status", "target_possession", "rera_possession", "litigation", "developer_schema", "youtube", "has_map", "has_floorplan", "has_masterplan", "has_amenities"]
for t in ["v2", "v1", "other"]:
    rs = [r for r in real if r["template"] == t]
    if not rs: continue
    print(f"\n== completeness, template {t} (n={len(rs)}) ==")
    for f in fields + ["configs"]:
        n = sum(1 for r in rs if r.get(f))
        print(f"  {f:<18} {n:>3}/{len(rs)}  {round(100*n/len(rs))}%")
print("\nlitigation values:", collections.Counter(r["litigation"] for r in real if r["template"] == "v2"))
print("possession_status values:", collections.Counter(r["possession_status"] for r in real if r["possession_status"]).most_common(10))
print("pages with dead call/whatsapp CTAs:", sum(1 for r in real if r["dead_cta"]))
print("brochure link targets:", collections.Counter(("pdf" if l.endswith(".pdf") else l.replace("https://punepropertyinvestor.com", "")[:30]) for r in real for l in r["brochure_links"]).most_common(8))
