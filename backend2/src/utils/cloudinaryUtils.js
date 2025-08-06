const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Cloudinary folder to upload to (e.g., 'posts', 'avatars')
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = async (file, folder = 'posts') => {
  return new Promise((resolve, reject) => {
    // Create a readable stream from the file buffer
    const stream = Readable.from(file.buffer);
    
    // Create a Cloudinary upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: `${folder}_${Date.now()}`,
        transformation: folder === 'posts' ? [
          { width: 1200, crop: 'limit' },
          { quality: 'auto' }
        ] : [
          { width: 500, height: 500, crop: 'fill' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    
    // Pipe the file stream to the upload stream
    stream.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary
 * @param {String} publicId - Cloudinary public ID of the file
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  
  return await cloudinary.uploader.destroy(publicId);
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary URL
 * @returns {String|null} - Public ID or null if not a Cloudinary URL
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  // Extract the public ID from the URL
  // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
  const urlParts = url.split('/');
  const filenameParts = urlParts[urlParts.length - 1].split('.');
  const publicIdWithFolder = urlParts.slice(urlParts.length - 2).join('/');
  
  // Remove file extension
  return publicIdWithFolder.split('.')[0];
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl
};