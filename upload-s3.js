const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

const s3 = new S3Client({
  region: "ru-1",
  endpoint: "https://s3.twcstorage.ru",
  credentials: {
    accessKeyId: "R1TZ0KDEZS2CFAOC846Z",
    secretAccessKey: "jwctXNI2nyjfvvUyAcAUPcv7yjEkY7k4RI9XTWFZ",
  },
  forcePathStyle: true,
});

const bucket = "nikitablog";
const outDir = path.join(__dirname, "out");

async function uploadDir(dir, prefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      await uploadDir(fullPath, key);
    } else {
      const content = fs.readFileSync(fullPath);
      const contentType = mime.lookup(fullPath) || "application/octet-stream";
      
      const isHtmlStatic = key.startsWith("_next/static/");
      const cacheControl = isHtmlStatic
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600";

      console.log(`Uploading: ${key}`);
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: content,
          ContentType: contentType,
          CacheControl: cacheControl,
          ACL: "public-read",
        })
      );
    }
  }
}

async function main() {
  console.log("=== Uploading to S3 bucket: nikitablog ===\n");
  await uploadDir(outDir, "");
  console.log("\n=== Upload complete! ===");
}

main().catch((err) => {
  console.error("Upload failed:", err.message);
  process.exit(1);
});
