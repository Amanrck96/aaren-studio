import { jsPDF } from "jspdf";

export type PDFProjectItem = {
  productName: string;
  brand: string;
  category: string;
  finish?: string;
  dimensions?: string;
  quantity: number;
  notes?: string;
};

export type PDFProjectData = {
  title: string;
  client: string;
  category: string;
  description: string;
  selectedProducts: PDFProjectItem[];
};

export function generateAarenProjectPDF(project: PDFProjectData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let currentY = margin;

  function renderHeader(pageNum: number) {
    // Top black accent bar
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, pageWidth, 8, "F");

    // AAREN Logo Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(15, 15, 15);
    doc.text("AAREN", margin, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("CREATIVE STUDIO & MATERIAL LAB", margin + 36, 21);

    // Right subtitle/date
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    doc.text(`PROJECT SPECIFICATION | ${dateStr}`, pageWidth - margin, 21, { align: "right" });

    // Decorative line below header
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, 26, pageWidth - margin, 26);
  }

  function renderFooter(pageNum: number, totalPages: number) {
    const footerY = pageHeight - 12;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "AAREN INTPRO | #342/8, NTY Layout, Mysore Road, Bangalore - 560026 | info@aarenintpro.com",
      margin,
      footerY
    );
    doc.text(`Page ${pageNum}`, pageWidth - margin, footerY, { align: "right" });
  }

  // Page 1 Header
  renderHeader(1);
  currentY = 35;

  // Project Header Banner Box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text(project.title.toUpperCase(), margin + 6, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Client: ${project.client}`, margin + 6, currentY + 18);
  doc.text(`Category: ${project.category}`, margin + 6, currentY + 25);

  if (project.description) {
    const splitDesc = doc.splitTextToSize(project.description, contentWidth - 12);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(splitDesc[0] || "", margin + 6, currentY + 30);
  }

  currentY += 40;

  // Selected Products Heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 15, 15);
  doc.text("SELECTED PRODUCTS SPECIFICATION", margin, currentY);

  currentY += 6;

  // Table Headers
  doc.setFillColor(15, 15, 15);
  doc.rect(margin, currentY, contentWidth, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("PRODUCT & BRAND", margin + 4, currentY + 5.5);
  doc.text("CATEGORY", margin + 65, currentY + 5.5);
  doc.text("FINISH & DIMENSIONS", margin + 115, currentY + 5.5);
  doc.text("QTY", margin + 168, currentY + 5.5, { align: "right" });

  currentY += 8;

  // Render Product Items
  if (!project.selectedProducts || project.selectedProducts.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("No products attached to this project.", margin + 4, currentY + 10);
    currentY += 15;
  } else {
    project.selectedProducts.forEach((item, index) => {
      // Check for page overflow
      if (currentY > pageHeight - 35) {
        renderFooter(doc.getNumberOfPages(), 0);
        doc.addPage();
        renderHeader(doc.getNumberOfPages());
        currentY = 32;

        // Re-render table header on new page
        doc.setFillColor(15, 15, 15);
        doc.rect(margin, currentY, contentWidth, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("PRODUCT & BRAND", margin + 4, currentY + 5.5);
        doc.text("CATEGORY", margin + 65, currentY + 5.5);
        doc.text("FINISH & DIMENSIONS", margin + 115, currentY + 5.5);
        doc.text("QTY", margin + 168, currentY + 5.5, { align: "right" });
        currentY += 8;
      }

      const rowHeight = 16;
      const isEven = index % 2 === 0;

      if (isEven) {
        doc.setFillColor(250, 251, 253);
        doc.rect(margin, currentY, contentWidth, rowHeight, "F");
      }

      // Draw light bottom border
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, currentY + rowHeight, pageWidth - margin, currentY + rowHeight);

      // Product Name & Brand
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      doc.text(item.productName, margin + 4, currentY + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text(`Brand: ${item.brand}`, margin + 4, currentY + 11);

      // Category
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text(item.category, margin + 65, currentY + 8);

      // Finish & Dimensions
      const finishText = item.finish || "Standard";
      const dimText = item.dimensions ? `(${item.dimensions})` : "";
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text(finishText, margin + 115, currentY + 6);
      if (dimText) {
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 130);
        doc.text(dimText, margin + 115, currentY + 11);
      }

      // Quantity
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      doc.text(String(item.quantity || 1), margin + 168, currentY + 8, { align: "right" });

      currentY += rowHeight;
    });
  }

  // Footer for final page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    renderFooter(i, totalPages);
  }

  return doc;
}
