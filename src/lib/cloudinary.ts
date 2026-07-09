export async function uploadMedia(fileStr: string) {
  // Safe compression & lazy fallback format for Cloudinary setup
  if (
    process.env.CLOUDINARY_CLOUD_NAME === "mock_cloud" ||
    !process.env.CLOUDINARY_CLOUD_NAME
  ) {
    // Return mock image URLs for local-first functionality
    return {
      secure_url: fileStr.startsWith("data:") ? "/placeholder-project.jpg" : fileStr,
      public_id: "mock_id",
    };
  }

  try {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "aaren_studio",
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" } // serves webp/avif dynamically
      ]
    });
    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return { secure_url: fileStr, public_id: "error_fallback" };
  }
}
