import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const viewerHtml = await fs.readFile(new URL("../viewer.html", import.meta.url), "utf8");

test("viewer shell includes viewport-filling app layout hooks", () => {
  assert.match(viewerHtml, /body\s*\{[\s\S]*min-height:\s*100vh/i);
  assert.match(viewerHtml, /\.shell\s*\{[\s\S]*min-height:\s*100vh/i);
  assert.match(viewerHtml, /\.app-toolbar\b/);
});

test("viewer shell exposes monochrome theme variables and full-window preview region", () => {
  assert.match(viewerHtml, /--bg:\s*#f[ef][ef][ef]/i);
  assert.match(viewerHtml, /\.preview\s*\{[\s\S]*min-height:\s*0/i);
  assert.match(viewerHtml, /\.viewer-layout\s*\{[\s\S]*min-height:\s*100%/i);
});

test("rendered preview shell includes rail and section toggle hooks", () => {
  assert.match(viewerHtml, /data-toggle-target="rail"/);
  assert.match(viewerHtml, /buildNavSectionHtml\(\s*"Repository",\s*"repository"/);
  assert.match(viewerHtml, /buildNavSectionHtml\(\s*"Contents",\s*"contents"/);
});

test("viewer script tracks default-open rail and section state", () => {
  assert.match(viewerHtml, /let currentNavState = \{/);
  assert.match(viewerHtml, /railCollapsed:\s*false/);
  assert.match(viewerHtml, /repositoryCollapsed:\s*false/);
  assert.match(viewerHtml, /contentsCollapsed:\s*false/);
});

test("viewer script wires rail and section toggle controls", () => {
  assert.match(viewerHtml, /function wirePreviewChromeInteractions/);
  assert.match(viewerHtml, /togglePreviewSection/);
});

test("viewer styles include narrow-screen fallback for stacked layout", () => {
  assert.match(viewerHtml, /@media\s*\(max-width:\s*920px\)/i);
  assert.match(viewerHtml, /\.viewer-layout\.has-sidebar\s*\{[\s\S]*grid-template-columns:\s*1fr/i);
});
