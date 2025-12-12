import { createServer } from "http2";
import { createReadStream, promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname);
const PORT = process.env.PORT || 8080;
const PRELOAD_LINKS = [
  "<./styles.css>; rel=preload; as=style",
  "<./app.js>; rel=modulepreload",
  "<https://rsms.me/inter/font-files/Inter-roman.var.woff2?v=4.0>; rel=preload; as=font; crossorigin",
];

const server = createServer({ allowHTTP1: true });
server.on("stream", async (stream, headers) => {
  if (headers[":method"] !== "GET") {
    stream.respond({ ":status": 405 });
    stream.end();
    return;
  }

  let requestPath = new URL(headers[":path"], "http://localhost").pathname;
  if (requestPath === "/") {
    requestPath = "/index.html";
  }

  const filePath = path.join(ROOT_DIR, requestPath.replace(/^\//, ""));
  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      stream.respond({ ":status": 404 });
      stream.end("Directory listing is disabled");
      return;
    }

    const acceptEncoding = headers["accept-encoding"] || "";
    const encoding = selectEncoding(acceptEncoding);
    const mimeType = getMimeType(filePath);
    const responseHeaders = {
      "content-type": mimeType,
      "cache-control": shouldCacheAggressively(filePath)
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600",
    };

    if (encoding === "br") {
      responseHeaders["content-encoding"] = "br";
    } else if (encoding === "gzip") {
      responseHeaders["content-encoding"] = "gzip";
    }

    if (filePath.endsWith("index.html")) {
      responseHeaders.link = PRELOAD_LINKS.join(", ");
    }

    stream.respond(responseHeaders);
    let fileStream = createReadStream(filePath);
    if (encoding === "br") {
      fileStream = fileStream.pipe(zlib.createBrotliCompress());
    } else if (encoding === "gzip") {
      fileStream = fileStream.pipe(zlib.createGzip());
    }
    fileStream.pipe(stream);
  } catch (error) {
    stream.respond({ ":status": 404, "content-type": "text/plain" });
    stream.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`HTTP/2 server with Brotli running at http://localhost:${PORT}`);
});

function selectEncoding(headerValue) {
  if (headerValue.includes("br")) return "br";
  if (headerValue.includes("gzip")) return "gzip";
  return "identity";
}

function getMimeType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function shouldCacheAggressively(filePath) {
  return !filePath.endsWith(".html");
}
