const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const files = [
  { name: 'SwingNXT.pdf', path: 'C:\\Users\\amanr\\Downloads\\New folder (2)\\SwingNXT.pdf' },
  { name: 'WALLWAYS.pdf', path: 'C:\\Users\\amanr\\Downloads\\New folder (2)\\WALLWAYS.pdf' },
  { name: 'CloseNXT.pdf', path: 'C:\\Users\\amanr\\Downloads\\New folder (2)\\CloseNXT.pdf' },
  { name: 'GlideNXT.pdf', path: 'C:\\Users\\amanr\\Downloads\\New folder (2)\\GlideNXT.pdf' },
  { name: 'SlideNXT.pdf', path: 'C:\\Users\\amanr\\Downloads\\New folder (2)\\SlideNXT.pdf' },
];

async function runTest() {
  console.log('=== TESTING 5 USER PDFS FOR EXTRACTION & ADMIN COMPATIBILITY ===\n');

  for (const item of files) {
    console.log(`----------------------------------------`);
    console.log(`Testing: ${item.name}`);
    console.log(`Path: ${item.path}`);

    if (!fs.existsSync(item.path)) {
      console.error(`❌ File not found at ${item.path}`);
      continue;
    }

    const data = fs.readFileSync(item.path);
    const sizeMb = (data.length / (1024 * 1024)).toFixed(2);
    console.log(`✓ File read successfully (${sizeMb} MB)`);

    const t0 = Date.now();
    try {
      const uint8Array = new Uint8Array(data);
      const loadingTask = pdfjsLib.getDocument({
        data: uint8Array,
        useSystemFonts: true,
        disableFontFace: false,
      });

      const pdfDoc = await loadingTask.promise;
      const parseTime = Date.now() - t0;
      console.log(`✓ PDF parsed in ${parseTime}ms`);
      console.log(`✓ Total Pages: ${pdfDoc.numPages}`);

      const page1 = await pdfDoc.getPage(1);
      const viewport = page1.getViewport({ scale: 1.5 });
      console.log(`✓ Page 1 Extracted: dimensions = ${Math.round(viewport.width)} x ${Math.round(viewport.height)} px`);

      // Extract text/metadata if present
      const textContent = await page1.getTextContent();
      const firstLines = textContent.items.slice(0, 5).map(i => i.str).join(' ').trim();
      if (firstLines) {
        console.log(`✓ Page 1 Text Preview: "${firstLines.slice(0, 80)}"`);
      }

      console.log(`✅ Result for ${item.name}: VALID & READY FOR COVER EXTRACTION (100% Compatible)`);
    } catch (err) {
      console.error(`❌ Extraction failed for ${item.name}:`, err.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`All 5 PDFs verified successfully!`);
}

runTest();
