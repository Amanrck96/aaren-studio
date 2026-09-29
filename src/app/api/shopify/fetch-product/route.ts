import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function stripHtmlToCleanText(html: string): string {
  if (!html) return "";
  let text = html
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
  return text;
}

function extractMetaTag(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`, "i");
  const match = html.match(regex);
  if (match && match[1]) return match[1];

  const reverseRegex = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`, "i");
  const revMatch = html.match(reverseRegex);
  return revMatch && revMatch[1] ? revMatch[1] : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ success: false, error: "Missing 'url' query parameter" }, { status: 400 });
  }
  return handleFetchProduct(url);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body.url;
    if (!url) {
      return NextResponse.json({ success: false, error: "Missing 'url' in request body" }, { status: 400 });
    }
    return handleFetchProduct(url);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

async function handleFetchProduct(inputUrl: string) {
  try {
    let cleanInput = inputUrl.trim();
    if (!cleanInput.startsWith("http://") && !cleanInput.startsWith("https://")) {
      cleanInput = "https://" + cleanInput;
    }

    const parsed = new URL(cleanInput);
    const host = parsed.host;
    const pathname = parsed.pathname;

    // Check if the URL has /products/<handle>
    const match = pathname.match(/\/products\/([^\/\?#]+)/);
    if (!match) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Shopify product URL. It should follow format: https://[your-store].myshopify.com/products/[product-handle]",
        },
        { status: 400 }
      );
    }

    const handle = match[1];
    const canonicalShopifyUrl = `https://${host}/products/${handle}`;
    const jsonUrl = `https://${host}/products/${handle}.json`;

    let productData: any = null;

    // 1. Try public Shopify product JSON API
    try {
      const jsonRes = await fetch(jsonUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
        cache: "no-store",
      });

      if (jsonRes.ok) {
        const json = await jsonRes.json();
        if (json && json.product) {
          productData = json.product;
        }
      }
    } catch (e) {
      // Continue to fallback
    }

    // 2. If JSON succeeded, build rich response
    if (productData) {
      const title = productData.title || "Shopify Product";
      const rawHtml = productData.body_html || "";
      const description = stripHtmlToCleanText(rawHtml);

      // Images
      let images: string[] = [];
      if (Array.isArray(productData.images) && productData.images.length > 0) {
        images = productData.images.map((img: any) => {
          let src = typeof img === "string" ? img : img.src;
          if (src && src.startsWith("//")) src = "https:" + src;
          return src;
        }).filter(Boolean);
      } else if (productData.image) {
        let src = typeof productData.image === "string" ? productData.image : productData.image.src;
        if (src && src.startsWith("//")) src = "https:" + src;
        if (src) images.push(src);
      }

      const primaryImage = images[0] || "";

      // Price & Variants
      let priceStr = "";
      let rawPrice = 0;
      if (Array.isArray(productData.variants) && productData.variants.length > 0) {
        const firstVar = productData.variants[0];
        if (firstVar.price) {
          rawPrice = parseFloat(firstVar.price);
          priceStr = `₹${rawPrice.toLocaleString("en-IN")}`;
        }
      }

      // Category derivation
      const category =
        productData.product_type ||
        (title.toLowerCase().includes("diffus") ? "Diffusers & Scents" : "") ||
        productData.vendor ||
        "Accessories";

      return NextResponse.json({
        success: true,
        source: "shopify_json_api",
        data: {
          id: productData.id ? String(productData.id) : `shopify-${handle}`,
          handle,
          title,
          name: title,
          category,
          price: priceStr || (rawPrice ? `₹${rawPrice}` : "Available on Shopify"),
          rawPrice,
          image: primaryImage,
          images,
          description: description || title,
          rawHtml,
          vendor: productData.vendor || "",
          productType: productData.product_type || "",
          shopifyUrl: canonicalShopifyUrl,
          buyNowText: priceStr ? `Buy on Shopify • ${priceStr}` : "Buy on Shopify",
        },
      });
    }

    // 3. Fallback: Parse HTML OpenGraph & Meta tags
    try {
      const htmlRes = await fetch(canonicalShopifyUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
        cache: "no-store",
      });

      if (!htmlRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to fetch Shopify product (HTTP ${htmlRes.status}) from ${canonicalShopifyUrl}`,
          },
          { status: htmlRes.status }
        );
      }

      const html = await htmlRes.text();
      const title = extractMetaTag(html, "og:title") || extractMetaTag(html, "twitter:title") || handle;
      let image = extractMetaTag(html, "og:image:secure_url") || extractMetaTag(html, "og:image") || "";
      if (image && image.startsWith("//")) image = "https:" + image;

      const desc = extractMetaTag(html, "og:description") || extractMetaTag(html, "description") || "";
      const priceAmount = extractMetaTag(html, "og:price:amount");
      const priceCurrency = extractMetaTag(html, "og:price:currency") || "INR";

      let priceStr = "";
      if (priceAmount) {
        const num = parseFloat(priceAmount);
        priceStr = priceCurrency === "INR" ? `₹${num.toLocaleString("en-IN")}` : `${priceCurrency} ${num}`;
      }

      return NextResponse.json({
        success: true,
        source: "shopify_meta_scraping",
        data: {
          id: `shopify-${handle}`,
          handle,
          title,
          name: title,
          category: title.toLowerCase().includes("diffus") ? "Diffusers & Scents" : "Accessories",
          price: priceStr || "Available on Shopify",
          image,
          images: image ? [image] : [],
          description: desc,
          shopifyUrl: canonicalShopifyUrl,
          buyNowText: priceStr ? `Buy on Shopify • ${priceStr}` : "Buy on Shopify",
        },
      });
    } catch (scrapingErr: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to retrieve product details from Shopify: " + scrapingErr.message,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
