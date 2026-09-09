import QRCode from "qrcode";

export interface QrCodeOptions {
  url: string;
  size?: number; // Target width/height in px (default 1200)
  color?: string; // Dark dots color (default #1E1E1E)
  bgColor?: string; // Background color (default #FFFFFF)
  logoType?: "aaren" | "brand" | "custom" | "none";
  logoUrl?: string; // URL or dataURL for custom or brand logo
  brandName?: string; // Brand name to display or match
  logoShape?: "circle" | "rounded" | "square";
  logoScale?: number; // Proportion of QR code (0.18 - 0.26, default 0.22)
  badgeBorderColor?: string;
}

export const BRAND_LOGOS: { name: string; file: string }[] = [
  { name: "Falper", file: "/brand_logos/falper.png" },
  { name: "Fenix", file: "/brand_logos/fenix.png" },
  { name: "Fima Carlo Frattini", file: "/brand_logos/fima.png" },
  { name: "Formica", file: "/brand_logos/formica.png" },
  { name: "Inkiostro Bianco", file: "/brand_logos/inkiostro-bianco.png" },
  { name: "Loco", file: "/brand_logos/loco.png" },
  { name: "Mafi", file: "/brand_logos/mafi.png" },
  { name: "Mirage", file: "/brand_logos/mirage.png" },
  { name: "NewTechWood", file: "/brand_logos/newtechwood.png" },
  { name: "Slashform", file: "/brand_logos/slashform.png" },
  { name: "Waltz", file: "/brand_logos/waltz.png" },
  { name: "Wow Design", file: "/brand_logos/wow.png" },
];

/**
 * Loads an image from URL or dataURL with promise
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Draws rounded rectangle path on canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Renders an official luxury AAREN logo crest in the center
 */
function drawAarenLuxuryBadge(
  ctx: CanvasRenderingContext2D,
  center: number,
  badgeSize: number,
  badgeShape: "circle" | "rounded" | "square",
  accentColor: string
) {
  const half = badgeSize / 2;
  const x = center - half;
  const y = center - half;

  // 1. Draw Badge Background
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = badgeSize * 0.12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = badgeSize * 0.04;

  ctx.fillStyle = "#FAF8F5"; // Warm Sand luxury background
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = Math.max(3, badgeSize * 0.035);

  if (badgeShape === "circle") {
    ctx.beginPath();
    ctx.arc(center, center, half, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    const radius = badgeShape === "rounded" ? badgeSize * 0.22 : 4;
    drawRoundedRect(ctx, x, y, badgeSize, badgeSize, radius);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 2. Inner Decorative Ring
  ctx.save();
  ctx.strokeStyle = "rgba(129, 102, 63, 0.4)";
  ctx.lineWidth = Math.max(1.5, badgeSize * 0.015);
  const innerMargin = badgeSize * 0.08;
  if (badgeShape === "circle") {
    ctx.beginPath();
    ctx.arc(center, center, half - innerMargin, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const radius = badgeShape === "rounded" ? (badgeSize - innerMargin * 2) * 0.2 : 2;
    drawRoundedRect(
      ctx,
      x + innerMargin,
      y + innerMargin,
      badgeSize - innerMargin * 2,
      badgeSize - innerMargin * 2,
      radius
    );
    ctx.stroke();
  }
  ctx.restore();

  // 3. Central Brand Typography: "AAREN" + "STUDIO"
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Monogram / Architectural Diamond at top
  const diamondSize = badgeSize * 0.09;
  const diamondY = center - badgeSize * 0.22;
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(center, diamondY - diamondSize);
  ctx.lineTo(center + diamondSize, diamondY);
  ctx.lineTo(center, diamondY + diamondSize);
  ctx.lineTo(center - diamondSize, diamondY);
  ctx.closePath();
  ctx.fill();

  // "AAREN" Wordmark
  const fontSizePrimary = Math.floor(badgeSize * 0.22);
  ctx.font = `900 ${fontSizePrimary}px 'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif`;
  ctx.fillStyle = "#1E1E1E";
  ctx.fillText("AAREN", center, center + badgeSize * 0.02);

  // "STUDIO" Subtitle
  const fontSizeSecondary = Math.floor(badgeSize * 0.1);
  ctx.font = `800 ${fontSizeSecondary}px 'Jost', 'Inter', -apple-system, sans-serif`;
  ctx.fillStyle = accentColor;
  ctx.fillText("STUDIO", center, center + badgeSize * 0.24);

  ctx.restore();
}

/**
 * Draws image-based logo (Brand logo or custom uploaded logo)
 */
async function drawImageBadge(
  ctx: CanvasRenderingContext2D,
  center: number,
  badgeSize: number,
  badgeShape: "circle" | "rounded" | "square",
  accentColor: string,
  logoUrl: string
) {
  const half = badgeSize / 2;
  const x = center - half;
  const y = center - half;

  // 1. Draw Clean White / Linen Badge Container
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = badgeSize * 0.12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = badgeSize * 0.03;

  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = Math.max(3, badgeSize * 0.03);

  if (badgeShape === "circle") {
    ctx.beginPath();
    ctx.arc(center, center, half, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    const radius = badgeShape === "rounded" ? badgeSize * 0.2 : 4;
    drawRoundedRect(ctx, x, y, badgeSize, badgeSize, radius);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  // 2. Draw Clipped Logo Image Inside Badge
  try {
    const img = await loadImage(logoUrl);
    ctx.save();

    // Clip to inner area
    const clipMargin = badgeSize * 0.06;
    if (badgeShape === "circle") {
      ctx.beginPath();
      ctx.arc(center, center, half - clipMargin, 0, Math.PI * 2);
      ctx.clip();
    } else {
      const radius = badgeShape === "rounded" ? (badgeSize - clipMargin * 2) * 0.18 : 2;
      drawRoundedRect(
        ctx,
        x + clipMargin,
        y + clipMargin,
        badgeSize - clipMargin * 2,
        badgeSize - clipMargin * 2,
        radius
      );
      ctx.clip();
    }

    // Preserve aspect ratio of logo inside badge
    const innerSize = badgeSize - badgeSize * 0.24;
    let drawWidth = innerSize;
    let drawHeight = innerSize;

    if (img.width > img.height) {
      drawHeight = innerSize * (img.height / img.width);
    } else {
      drawWidth = innerSize * (img.width / img.height);
    }

    const imgX = center - drawWidth / 2;
    const imgY = center - drawHeight / 2;

    ctx.drawImage(img, imgX, imgY, drawWidth, drawHeight);
    ctx.restore();
  } catch (imgErr) {
    console.warn("Failed to load badge logo image, falling back to typography:", imgErr);
    drawAarenLuxuryBadge(ctx, center, badgeSize, badgeShape, accentColor);
  }
}

/**
 * Main QR code generator with centered logo badge onto an HTMLCanvasElement
 */
export async function generateQrWithLogo(
  canvas: HTMLCanvasElement,
  options: QrCodeOptions
): Promise<string> {
  const {
    url,
    size = 1200,
    color = "#1E1E1E",
    bgColor = "#FFFFFF",
    logoType = "aaren",
    logoUrl,
    logoShape = "rounded",
    logoScale = 0.22,
    badgeBorderColor = "#81663F",
  } = options;

  if (!url || !url.trim()) {
    throw new Error("URL cannot be empty");
  }

  // 1. Generate base QR Code with Error Correction Level H (30% recovery tolerance)
  await QRCode.toCanvas(canvas, url.trim(), {
    width: size,
    margin: 3,
    errorCorrectionLevel: "H",
    color: {
      dark: color,
      light: bgColor,
    },
  });

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not available");
  }

  // 2. Draw Center Logo if not "none"
  if (logoType !== "none") {
    const center = size / 2;
    const clampedScale = Math.min(0.26, Math.max(0.18, logoScale));
    const badgeSize = Math.floor(size * clampedScale);

    if (logoType === "aaren") {
      drawAarenLuxuryBadge(ctx, center, badgeSize, logoShape, badgeBorderColor);
    } else if ((logoType === "brand" || logoType === "custom") && logoUrl) {
      await drawImageBadge(ctx, center, badgeSize, logoShape, badgeBorderColor, logoUrl);
    } else {
      drawAarenLuxuryBadge(ctx, center, badgeSize, logoShape, badgeBorderColor);
    }
  }

  return canvas.toDataURL("image/png");
}

/**
 * Downloads the canvas as a PNG file
 */
export function downloadQrCanvas(canvas: HTMLCanvasElement, fileName: string = "aaren_qr_code") {
  const safeName = fileName.replace(/[^a-zA-Z0-9_-]/g, "_");
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${safeName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
