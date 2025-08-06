const express = require('express');
const {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  applyForJob,
  listMyApplications,
  listMyJobPostings,
  toggleSaveJob,
  getSavedJobs
} = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, jobSchema, jobApplicationSchema, paginationSchema } = require('../middlewares/validationMiddleware');
const { uploadResume } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Job listing routes
router.get('/', validate(paginationSchema), getJobs);
router.post('/', validate(jobSchema.create), createJob);

// User-specific job routes
router.get('/applications', validate(paginationSchema), listMyApplications);
router.get('/my-postings', validate(paginationSchema), listMyJobPostings);
router.get('/saved', validate(paginationSchema), getSavedJobs);

// Job by ID routes
router.get('/:id', getJobById);
router.put('/:id', validate(jobSchema.update), updateJob);
router.delete('/:id', deleteJob);

// Job actions routes
router.post('/:id/apply', uploadResume, validate(jobApplicationSchema.create), applyForJob);
router.post('/:id/save', toggleSaveJob);

module.exports = router;