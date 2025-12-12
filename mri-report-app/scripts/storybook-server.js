const http = require("http");
const fs = require("fs");
const path = require("path");

const storyPath = path.join(__dirname, "..", "stories", "index.html");
const port = process.env.PORT || 6006;

const handler = (req, res) => {
  if (req.url && req.url.startsWith("/renderer/")) {
    const file = path.join(__dirname, "..", req.url);
    fs.createReadStream(file).pipe(res);
    return;
  }

  res.setHeader("Content-Type", "text/html");
  fs.createReadStream(storyPath).pipe(res);
};

const server = http.createServer(handler);
server.listen(port, () => {
  console.log(`Storybook-lite running at http://localhost:${port}`);
});
