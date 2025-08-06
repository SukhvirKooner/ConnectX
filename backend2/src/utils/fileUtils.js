const fs = require('fs');
const path = require('path');

/**
 * Get file URL based on file path
 * @param {String} filePath - Path to the file
 * @returns {String} - Public URL for the file
 */
const getFileUrl = (filePath) => {
  if (!filePath) return '';
  
  // In a production environment, this would be a CDN or cloud storage URL
  // For local development, we'll use a relative path
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  
  // Convert absolute path to relative path for URL
  const uploadsDir = path.join(__dirname, '../../uploads');
  const relativePath = filePath.replace(uploadsDir, '/uploads');
  
  return `${baseUrl}${relativePath}`;
};

/**
 * Delete file from the filesystem
 * @param {String} filePath - Path to the file to delete
 * @returns {Boolean} - Success status
 */
const deleteFile = (filePath) => {
  if (!filePath) return false;
  
  try {
    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
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
 * Process uploaded file and return file info
 * @param {Object} file - Multer file object
 * @returns {Object} - File information including URL
 */
const processUploadedFile = (file) => {
  if (!file) return null;
  
  return {
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    path: file.path,
    url: getFileUrl(file.path)
  };
};

module.exports = {
  getFileUrl,
  deleteFile,
  createDirIfNotExists,
  processUploadedFile
};