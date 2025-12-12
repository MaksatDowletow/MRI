const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "stories", "index.html");
const targetDir = path.join(__dirname, "..", "storybook-static");
const target = path.join(targetDir, "index.html");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(source, target);
console.log(`Saved static catalog to ${target}`);
