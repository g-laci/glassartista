#!/usr/bin/env node
// Writes app/content/lastmod.json: the last commit date of every content file. The sitemap uses it as
// <lastmod> for the pages built from those files (PAGES[...].contentFiles in app/content/seo.js), so
// <lastmod> changes only when a page's content actually changed.
//
// Usage: npm run seo:lastmod   (run after committing content changes, commit the JSON with them)
// Also runs before every build (prebuild). In a shallow checkout (Vercel clones with limited history)
// every file would look as if changed in the newest commit, so the committed file is kept unchanged.

import {execFileSync} from "node:child_process";
import {existsSync, readdirSync, readFileSync, writeFileSync} from "node:fs";
import {join} from "node:path";

const CONTENT_DIR = "app/content";
const OUTPUT = join(CONTENT_DIR, "lastmod.json");

function lastCommitDate(file) {
    try {
        return execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {encoding: "utf8"}).trim() || null;
    } catch {
        return null;
    }
}

function isShallowOrMissingHistory() {
    try {
        return execFileSync("git", ["rev-parse", "--is-shallow-repository"], {encoding: "utf8"}).trim() !== "false";
    } catch {
        return true;
    }
}

if (isShallowOrMissingHistory()) {
    console.log(`seo:lastmod: no full git history, keeping ${OUTPUT}`);
    process.exit(0);
}

const previous = existsSync(OUTPUT) ? JSON.parse(readFileSync(OUTPUT, "utf8")) : {};
const result = {};
let resolved = 0;

for (const file of readdirSync(CONTENT_DIR).filter((name) => name.endsWith(".js")).sort()) {
    const date = lastCommitDate(join(CONTENT_DIR, file));
    if (date) resolved++;
    // Never move a date backwards (a shallow history would report the shallow boundary instead).
    const candidates = [date, previous[file]].filter(Boolean).sort();
    if (candidates.length) result[file] = candidates.at(-1);
}

if (resolved === 0) {
    console.log(`seo:lastmod: no git history available, keeping ${OUTPUT}`);
} else {
    writeFileSync(OUTPUT, `${JSON.stringify(result, null, 4)}\n`);
    console.log(`seo:lastmod: wrote ${OUTPUT} (${Object.keys(result).length} files)`);
}
