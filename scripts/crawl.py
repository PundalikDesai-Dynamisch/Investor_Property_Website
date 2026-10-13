"""Fetch every sitemap URL of punepropertyinvestor.com and store raw HTML for the audit."""
import json, re, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).parent
HTML = ROOT / "html"
HTML.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

urls = []
for s in ["page", "post"]:
    x = (ROOT / "raw" / f"{s}-sitemap.xml").read_text(encoding="utf-8", errors="ignore")
    for block in re.findall(r"<url>(.*?)</url>", x, re.S):
        loc = re.search(r"<loc>(.*?)</loc>", block).group(1)
        lm = re.search(r"<lastmod>(.*?)</lastmod>", block)
        urls.append({"url": loc, "sitemap": s, "lastmod": lm.group(1)[:10] if lm else None,
                     "sitemap_images": len(re.findall(r"<image:image>", block))})

def slug_of(u):
    p = u.replace("https://punepropertyinvestor.com", "").strip("/")
    return p.replace("/", "__") or "_home"

def fetch(rec):
    out = dict(rec)
    out["slug"] = slug_of(rec["url"])
    for attempt in range(3):
        t0 = time.time()
        try:
            req = urllib.request.Request(rec["url"], headers={"User-Agent": UA, "Accept-Language": "en-IN,en;q=0.9"})
            with urllib.request.urlopen(req, timeout=40) as r:
                body = r.read()
                out.update(status=r.status, final_url=r.geturl(), bytes=len(body), seconds=round(time.time() - t0, 2),
                           headers={k.lower(): v for k, v in r.headers.items() if k.lower() in ("server", "cache-control", "x-powered-by", "content-encoding", "link", "x-litespeed-cache", "cf-cache-status", "x-cache")})
                (HTML / f"{out['slug']}.html").write_bytes(body)
                return out
        except urllib.error.HTTPError as e:
            out.update(status=e.code, final_url=rec["url"], error=str(e))
            return out
        except Exception as e:  # network hiccup: retry
            out.update(status=None, error=repr(e))
            time.sleep(2)
    return out

with ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(fetch, urls))

(ROOT / "crawl.json").write_text(json.dumps(results, indent=1))
ok = sum(1 for r in results if r.get("status") == 200)
print(f"fetched {ok}/{len(results)} ok")
for r in results:
    if r.get("status") != 200 or r.get("final_url", r["url"]).rstrip("/") != r["url"].rstrip("/"):
        print(r.get("status"), r["url"], "->", r.get("final_url"), r.get("error", ""))
print("avg seconds", round(sum(r.get("seconds", 0) for r in results) / len(results), 2),
      "avg KB", round(sum(r.get("bytes", 0) for r in results) / len(results) / 1024))
print("headers sample", results[0].get("headers"))
