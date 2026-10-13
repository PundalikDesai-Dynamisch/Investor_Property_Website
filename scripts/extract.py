"""Parse every crawled page into a structural record (SEO tags, headings, links, forms, media, widgets)."""
import json, re
from collections import Counter
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).parent
crawl = json.loads((ROOT / "crawl.json").read_text())
TEXT = ROOT / "text"
TEXT.mkdir(exist_ok=True)
SITE = "https://punepropertyinvestor.com"

def clean(s):
    return re.sub(r"\s+", " ", s or "").strip()

records = []
for rec in crawl:
    if rec.get("status") != 200:
        records.append({**rec, "missing": True})
        continue
    html = (ROOT / "html" / f"{rec['slug']}.html").read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(html, "lxml")
    head = soup.head or soup
    meta = lambda **kw: (head.find("meta", attrs=kw) or {}).get("content")
    canon = head.find("link", rel="canonical")
    jsonld_types = []
    for s in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(s.string or "{}")
        except Exception:
            continue
        nodes = data.get("@graph", [data]) if isinstance(data, dict) else data
        for n in nodes if isinstance(nodes, list) else [nodes]:
            if isinstance(n, dict):
                t = n.get("@type")
                jsonld_types += t if isinstance(t, list) else [t]
    # Separate header/footer (Elementor Header-Footer plugin) from page body
    header = soup.select_one("header#masthead, header.site-header, .ehf-header header, #masthead")
    footer = soup.select_one("footer#colophon, footer.site-footer, .footer-width-fixer, footer")
    main = soup.select_one("#primary") or soup.select_one("#content") or soup.body
    body_text = clean(main.get_text(" ")) if main else ""
    (TEXT / f"{rec['slug']}.txt").write_text(body_text)
    links = [a.get("href", "") for a in soup.find_all("a")]
    main_links = [a.get("href", "") for a in (main.find_all("a") if main else [])]
    imgs = soup.find_all("img")
    main_imgs = main.find_all("img") if main else []
    widgets = Counter(w.get("data-widget_type", "").split(".")[0] for w in (main.select("[data-widget_type]") if main else []))
    forms = []
    for f in soup.find_all("form"):
        cls = " ".join(f.get("class", []))
        fields = [clean(i.get("name") or i.get("placeholder") or i.get("type")) for i in f.find_all(["input", "select", "textarea"]) if i.get("type") not in ("hidden", "submit")]
        forms.append({"class": cls[:60], "id": f.get("id"), "fields": fields[:14], "in_main": bool(main and f in main.find_all("form"))})
    buttons = [clean(b.get_text(" ")) for b in (main.select(".elementor-button, button, .elementskit-btn, a.ekit-button") if main else [])]
    iframes = [i.get("src") or i.get("data-src") or i.get("data-lazy-src") or "" for i in soup.find_all("iframe")]
    yt = set(re.findall(r"(?:youtube\.com/(?:embed/|watch\?v=|shorts/)|youtu\.be/)([\w-]{11})", html.replace("\\/", "/")))
    r = {
        **{k: rec.get(k) for k in ("url", "slug", "sitemap", "lastmod", "bytes", "seconds", "final_url")},
        "title": clean(head.title.string if head.title else ""),
        "meta_description": meta(name="description"),
        "robots": meta(name="robots"),
        "canonical": canon.get("href") if canon else None,
        "og_title": meta(property="og:title"),
        "og_image": meta(property="og:image"),
        "jsonld_types": sorted(set(filter(None, map(str, jsonld_types)))),
        "h1": [clean(h.get_text(" ")) for h in soup.find_all("h1")],
        "h2": [clean(h.get_text(" ")) for h in (main.find_all("h2") if main else [])],
        "h3": [clean(h.get_text(" ")) for h in (main.find_all("h3") if main else [])][:40],
        "h4": [clean(h.get_text(" ")) for h in (main.find_all("h4") if main else [])][:40],
        "words_main": len(body_text.split()),
        "links_total": len(links),
        "internal_main": sorted(set(l.split("#")[0] for l in main_links if l.startswith(SITE) or l.startswith("/"))),
        "external_main": sorted(set(l for l in main_links if l.startswith("http") and not l.startswith(SITE))),
        "tel": sorted(set(l for l in links if l.startswith("tel:"))),
        "whatsapp": sorted(set(l for l in links if "wa.me" in l or "whatsapp" in l)),
        "mailto": sorted(set(l for l in links if l.startswith("mailto:"))),
        "imgs_total": len(imgs),
        "imgs_main": len(main_imgs),
        "imgs_no_alt": sum(1 for i in main_imgs if not clean(i.get("alt"))),
        "imgs_lazy": sum(1 for i in main_imgs if i.get("loading") == "lazy" or "lazy" in " ".join(i.get("class", []))),
        "img_ext": dict(Counter(((i.get("src") or i.get("data-src") or "").split("?")[0].rsplit(".", 1)[-1].lower()[:5]) for i in main_imgs)),
        "widgets": dict(widgets.most_common(25)),
        "forms": forms,
        "buttons": [b for b in buttons if b][:40],
        "iframes": iframes,
        "youtube_ids": sorted(yt),
        "scripts": len(soup.find_all("script", src=True)),
        "stylesheets": len(soup.find_all("link", rel="stylesheet")),
        "inline_styles_kb": round(sum(len(s.get_text()) for s in soup.find_all("style")) / 1024),
    }
    records.append(r)

(ROOT / "pages.json").write_text(json.dumps(records, indent=1, ensure_ascii=False))
print("records", len(records))
