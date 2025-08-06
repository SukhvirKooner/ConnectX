const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ['avatars', 'posts', 'resumes'];
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  dirs.forEach(dir => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
};

// Create upload directories
createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, '../../uploads');
    
    // Determine the appropriate subfolder based on the route or file type
    if (req.originalUrl.includes('/users/upload-avatar')) {
      uploadPath = path.join(uploadPath, 'avatars');
    } else if (req.originalUrl.includes('/posts')) {
      uploadPath = path.join(uploadPath, 'posts');
    } else if (req.originalUrl.includes('/jobs/apply')) {
      uploadPath = path.join(uploadPath, 'resumes');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

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