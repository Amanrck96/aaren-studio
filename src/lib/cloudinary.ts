export async function uploadMedia(fileStr: string, options: { folder?: string; width?: number } = {}) {
  // Safe compression & lazy fallback format for Cloudinary setup
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName || cloudName === "mock_cloud") {
    // Return image URLs for local-first functionality
    return {
      secure_url: fileStr,
      public_id: "local_data_id",
    };
  }

  try {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const folder = options.folder || "aaren_studio";
    const uploadOptions: any = {
      folder,
      transformation: [
        { width: options.width || 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" }
      ]
    };

    try {
      const res = await cloudinary.uploader.upload(fileStr, uploadOptions);
      return res;
    } catch (presetErr) {
      // Retry without transformation if preset/transform failed
      const res = await cloudinary.uploader.upload(fileStr, { folder });
      return res;
    }
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return { secure_url: fileStr, public_id: "error_fallback" };
  }
}
