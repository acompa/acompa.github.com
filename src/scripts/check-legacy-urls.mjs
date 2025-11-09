#!/usr/bin/env node
import { XMLParser } from 'fast-xml-parser';

const DEFAULT_BASE_URL = 'http://localhost:4321/';

function getBaseUrl() {
  const value = process.env.LEGACY_BASE_URL ?? DEFAULT_BASE_URL;
  try {
    const url = new URL(value);
    if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid LEGACY_BASE_URL: ${value}`);
  }
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  return response.text();
}

function ensureArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

async function main() {
  const base = getBaseUrl();
  const feedUrl = new URL('feeds/all.atom.xml', base).toString();

  console.log(`Fetching Atom feed from ${feedUrl}`);
  const xml = await fetchText(feedUrl);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  const parsed = parser.parse(xml);

  const entries = ensureArray(parsed?.feed?.entry);
  if (entries.length === 0) {
    throw new Error('No entries found in Atom feed.');
  }

  const failures = [];

  for (const entry of entries) {
    const link = Array.isArray(entry?.link)
      ? entry.link.find((item) => !item.rel || item.rel === 'alternate') ?? entry.link[0]
      : entry?.link;
    const href = link?.href;
    if (!href) {
      console.warn('Skipping entry without link attribute.');
      continue;
    }

    const target = new URL(href, base);
    const relativePath = target.pathname + target.search + target.hash;
    const checkUrl = new URL(relativePath, base).toString();

    const response = await fetch(checkUrl, { redirect: 'manual' });
    if (!response.ok) {
      failures.push({ url: checkUrl, status: response.status });
      console.error(`✖ ${checkUrl} -> ${response.status}`);
      continue;
    }

    console.log(`✔ ${checkUrl} -> ${response.status}`);
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} legacy URLs failed validation.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nValidated ${entries.length} legacy URLs successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
