import { readFile, writeFile, copyFile } from "node:fs/promises";

const src = await readFile("../Halal_logo.svg", "utf8");
const GREEN = "rgb(0%,65.098039%,31.372549%)";
const WHITE = "rgb(100%,100%,100%)";

// dark-bg variant: measured contrast confirms the ORIGINAL colors already
// work on this site's dark backgrounds (green disc vs --emerald 3.63:1, vs
// --emerald-deep 4.59:1; white detail vs either 11.6:1) — no recolor needed.
await copyFile("../Halal_logo.svg", "public/icons/halal-badge-dark-bg.svg");

// light-bg variant: the original white interior fails outright against ivory
// (1.19:1) and the green disc itself is under the 3:1 non-text-contrast
// floor against ivory/cream (2.5-2.7:1) — both need to change. Recoloring
// to a same-relationship pair (dark solid disc + light interior detail,
// mirroring the original's own light-on-dark structure) rather than
// flattening to one color: disc->emerald, interior->cream keeps 9:1+
// internal contrast (so the seal shape and calligraphy stay legible) and
// 9.8:1+ against the page's ivory/cream background.
const lightBg = src
  .replaceAll(`fill:${GREEN}`, "fill:#173f3a")
  .replaceAll(`fill:${WHITE}`, "fill:#F2EBDD");
await writeFile("public/icons/halal-badge-light-bg.svg", lightBg);

console.log("wrote both variants");
