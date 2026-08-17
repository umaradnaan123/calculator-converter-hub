import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllHtmlFiles(filePath, arrayOfFiles);
    } else if (file === 'index.html' || file.endsWith('.html')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

console.log('🔍 Running Quality Control Technical SEO Audit on dist/ ...\n');

const htmlFiles = getAllHtmlFiles(DIST_DIR);
let totalChecked = 0;
let missingTitle = 0;
let missingDescription = 0;
let missingCanonical = 0;
let missingH1 = 0;
let noindexCount = 0;
let hashUrlCount = 0;
let queryParamCount = 0;
let missingJsonLd = 0;

const titlesMap = new Map();
const canonicalsMap = new Map();

htmlFiles.forEach((file) => {
  totalChecked++;
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(DIST_DIR, file).replace(/\\/g, '/');

  // Title check
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    missingTitle++;
    console.error(`❌ Missing title: ${relPath}`);
  } else {
    const title = titleMatch[1].trim();
    titlesMap.set(title, (titlesMap.get(title) || 0) + 1);
  }

  // Meta description check
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    missingDescription++;
    console.error(`❌ Missing meta description: ${relPath}`);
  }

  // Canonical check
  const canonicalMatches = content.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/gi) || [];
  if (canonicalMatches.length === 0) {
    missingCanonical++;
    console.error(`❌ Missing canonical tag: ${relPath}`);
  } else if (canonicalMatches.length > 1) {
    missingCanonical++;
    console.error(`❌ Multiple canonical tags found (${canonicalMatches.length}) on: ${relPath}`);
  } else {
    const singleMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
    const canonical = singleMatch[1].trim();
    canonicalsMap.set(canonical, (canonicalsMap.get(canonical) || 0) + 1);
    if (canonical.includes('#')) hashUrlCount++;
    if (canonical.includes('?')) queryParamCount++;
  }

  // H1 check
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    missingH1++;
    console.error(`❌ Missing H1 element: ${relPath}`);
  }

  // Robots check
  if (content.includes('noindex')) {
    noindexCount++;
    console.error(`⚠️ Found noindex directive: ${relPath}`);
  }

  // JSON-LD check
  if (!content.includes('application/ld+json')) {
    missingJsonLd++;
    console.error(`❌ Missing JSON-LD structured data: ${relPath}`);
  }
});

// Sitemap check
const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
let sitemapErrors = 0;
if (!fs.existsSync(sitemapPath)) {
  sitemapErrors++;
  console.error('❌ sitemap.xml does not exist in dist/');
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (sitemapContent.includes('<!--') || sitemapContent.includes('-->')) {
    sitemapErrors++;
    console.error('❌ sitemap.xml contains XML comment nodes inside urlset');
  }
  if (!sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    sitemapErrors++;
    console.error('❌ sitemap.xml missing standard XML declaration');
  }
}

// Robots.txt check
const robotsPath = path.join(DIST_DIR, 'robots.txt');
let robotsErrors = 0;
if (!fs.existsSync(robotsPath)) {
  robotsErrors++;
  console.error('❌ robots.txt does not exist in dist/');
}

console.log('--------------------------------------------');
console.log('📊 TECHNICAL SEO AUDIT RESULTS');
console.log('--------------------------------------------');
console.log(`Pages Checked:             ${totalChecked}`);
console.log(`Indexable Pages:           ${totalChecked - noindexCount}`);
console.log(`Noindex Pages:             ${noindexCount}`);
console.log(`Missing Title:             ${missingTitle}`);
console.log(`Missing Description:       ${missingDescription}`);
console.log(`Missing Canonical:         ${missingCanonical}`);
console.log(`Missing H1:                ${missingH1}`);
console.log(`Missing JSON-LD:           ${missingJsonLd}`);
console.log(`Hash URLs Found:           ${hashUrlCount}`);
console.log(`Query Parameter URLs:      ${queryParamCount}`);
console.log(`Sitemap Errors:            ${sitemapErrors}`);
console.log(`Robots.txt Errors:         ${robotsErrors}`);
console.log('--------------------------------------------');

if (
  missingTitle === 0 &&
  missingDescription === 0 &&
  missingCanonical === 0 &&
  missingH1 === 0 &&
  noindexCount === 0 &&
  hashUrlCount === 0 &&
  queryParamCount === 0 &&
  sitemapErrors === 0 &&
  robotsErrors === 0
) {
  console.log('✅ ALL AUDIT CHECKS PASSED SUCCESSFULLY! 100% PRODUCTION READY.');
  process.exit(0);
} else {
  console.error('❌ AUDIT COMPLETED WITH WARNINGS/ERRORS.');
  process.exit(1);
}
