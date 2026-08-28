/**
 * SEO audit fix (High #9 — "No IndexNow key or submission wired up").
 *
 * Submits every URL in the static export's sitemap to the IndexNow API
 * (Bing/Yandex/Seznam — instant crawl notification instead of waiting for
 * the next crawl). The key file already lives at public/<key>.txt (required
 * by the protocol — it's served at https://<domain>/<key>.txt and IndexNow
 * verifies it matches before accepting submissions).
 *
 * Run manually after a production deploy, or wire into a post-deploy hook:
 *   npm run indexnow
 *
 * Requires the site to already be live at site.url (IndexNow fetches the
 * key file from the real domain to verify ownership) — running this before
 * launch will fail verification, which is expected.
 */
import { site } from "../src/data/site.ts";

const KEY = "1f7e5cc18680408bf895f281ffec28cc";
const KEY_LOCATION = `${site.url}/${KEY}.txt`;

// Keep in sync with src/app/sitemap.ts.
const PATHS = ["/", "/about/", "/menu/", "/catering/", "/contact/", "/order/", "/gallery/"];

async function main() {
  const body = {
    host: new URL(site.url).host,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: PATHS.map((p) => `${site.url}${p}`),
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  console.log(`IndexNow: submitted ${PATHS.length} URLs — HTTP ${res.status}`);
  if (!res.ok) {
    console.error(await res.text().catch(() => ""));
    process.exitCode = 1;
  }
}

main();
