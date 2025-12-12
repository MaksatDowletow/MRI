const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const pixelmatch = require("pixelmatch");
const { PNG } = require("pngjs");

const buildDir = path.join(__dirname, "..", "storybook-static");
const baselinePath = path.join(buildDir, "baseline.png");
const currentPath = path.join(buildDir, "latest.png");
const diffPath = path.join(buildDir, "diff.png");

async function ensureStaticBuild() {
  const exists = fs.existsSync(path.join(buildDir, "index.html"));
  if (!exists) {
    throw new Error("storybook-static/index.html not found. Run npm run build-storybook first.");
  }
}

async function captureScreenshot() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(`file://${path.join(buildDir, "index.html")}`);
  await page.setViewport({ width: 1440, height: 900 });
  await page.waitForSelector(".story-grid");
  await page.screenshot({ path: currentPath, fullPage: true });
  await browser.close();
}

function compareScreens() {
  if (!fs.existsSync(baselinePath)) {
    fs.copyFileSync(currentPath, baselinePath);
    console.log("Baseline created for visual regression.");
    return;
  }

  const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNG.sync.read(fs.readFileSync(currentPath));
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const mismatch = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`Pixel diff: ${mismatch}`);
  if (mismatch > 0) {
    throw new Error(`Visual regression detected. See ${diffPath}`);
  }
}

(async () => {
  await ensureStaticBuild();
  await captureScreenshot();
  compareScreens();
})();
