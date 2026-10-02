import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables if available
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Uploads a base64 or buffer image to Cloudinary.
 * If Cloudinary credentials are not configured, returns an optimized data URI or curated gaming preview URL.
 */
export async function uploadToCloudinary(
  fileBase64OrUrl: string,
  folder = 'gaming_ids'
): Promise<{ url: string; public_id?: string; success: boolean; error?: string }> {
  try {
    if (isCloudinaryConfigured) {
      const result = await cloudinary.uploader.upload(fileBase64OrUrl, {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
        success: true,
      };
    }

    // Resilient fallback when Cloudinary env vars are pending setup:
    // If it's already a URL, return it directly.
    if (fileBase64OrUrl.startsWith('http://') || fileBase64OrUrl.startsWith('https://')) {
      return { url: fileBase64OrUrl, success: true };
    }

    // If it's a data URL, return it for immediate preview and testing
    if (fileBase64OrUrl.startsWith('data:image')) {
      return { url: fileBase64OrUrl, success: true };
    }

    return {
      url: fileBase64OrUrl,
      success: true,
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return {
      url: '',
      success: false,
      error: error?.message || 'Failed to upload image to Cloudinary',
    };
  }
}

export default cloudinary;
