const fs = require('fs');
const path = require('path');
const { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } = require('./cloudinaryUtils');

/**
 * Get file URL from Cloudinary result
 * @param {Object} cloudinaryResult - Result from Cloudinary upload
 * @returns {String} - Public URL for the file
 */
const getFileUrl = (cloudinaryResult) => {
  if (!cloudinaryResult) return '';
  return cloudinaryResult.secure_url;
};

/**
 * Delete a file from Cloudinary
 * @param {String} fileUrl - Cloudinary URL of the file
 * @returns {Boolean} - Whether the file was deleted successfully
 */
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return false;
  
  try {
    const publicId = getPublicIdFromUrl(fileUrl);
    if (!publicId) return false;
    
    const result = await deleteFromCloudinary(publicId);
    return result && result.result === 'ok';
  } catch (error) {
    console.error(`Error deleting file ${fileUrl}:`, error);
    return false;
  }
};

/**
 * Create a directory if it doesn't exist
 * @param {String} dirPath - Path to the directory
 * @returns {Boolean} - Success status
 */
const createDirIfNotExists = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    return false;
  }
};

/**
 * Process uploaded file and upload to Cloudinary
 * @param {Object} file - Multer file object
 * @param {String} folder - Cloudinary folder to upload to
 * @returns {Promise<Object>} - File information including Cloudinary URL
 */
const processUploadedFile = async (file, folder = 'posts') => {
  if (!file) return null;
  
  try {
    // Upload file to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file, folder);
    
    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      public_id: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      format: cloudinaryResult.format
    };
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

module.exports = {
  getFileUrl,
  deleteFile,
  createDirIfNotExists,
  processUploadedFile
};