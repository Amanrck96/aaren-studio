const fs = require("fs");
const path = require("path");

function copyPdfWorker() {
  const rootDir = process.cwd();
  const sourceCandidates = [
    path.join(rootDir, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.js"),
    path.join(rootDir, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"),
    path.join(rootDir, "node_modules", "pdfjs-dist", "legacy", "build", "pdf.worker.min.js"),
  ];

  const sourcePath = sourceCandidates.find((p) => fs.existsSync(p));

  if (!sourcePath) {
    console.warn("⚠️ [PDF Worker Sync] pdf.worker file not found in node_modules/pdfjs-dist/build. Skipping copy.");
    return;
  }

  const targetDir = path.join(rootDir, "public");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, "pdf.worker.min.js");

  try {
    const srcBuf = fs.readFileSync(sourcePath);
    let shouldCopy = true;

    if (fs.existsSync(targetPath)) {
      const targetBuf = fs.readFileSync(targetPath);
      if (srcBuf.equals(targetBuf)) {
        shouldCopy = false;
      }
    }

    if (shouldCopy) {
      fs.writeFileSync(targetPath, srcBuf);
      console.log(`✅ [PDF Worker Sync] Successfully synchronized pdf.worker.min.js (${(srcBuf.length / 1024).toFixed(1)} KB) -> public/pdf.worker.min.js`);
    } else {
      console.log(`✓ [PDF Worker Sync] public/pdf.worker.min.js is already up-to-date with pdfjs-dist (${(srcBuf.length / 1024).toFixed(1)} KB).`);
    }
  } catch (err) {
    console.error("❌ [PDF Worker Sync] Error copying pdf.worker.min.js:", err);
  }
}

copyPdfWorker();
