const multer = require('multer');
const path = require('path');

// Configure multer to use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Define allowed file types based on the route
  let allowedTypes = [];
  
  if (req.originalUrl.includes('/users/upload-avatar')) {
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  } else if (req.originalUrl.includes('/posts')) {
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  } else if (req.originalUrl.includes('/jobs/apply')) {
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  }
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only ' + allowedTypes.join(', ') + ' are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Export different upload configurations for different routes
module.exports = {
  uploadAvatar: upload.single('avatar'),
  uploadPostImage: upload.single('image'),
  uploadResume: upload.single('resume'),
  uploadMultiple: upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ])
};