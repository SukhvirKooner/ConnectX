const Job = require('../models/jobModel');
const JobApplication = require('../models/jobApplicationModel');
const SavedJob = require('../models/savedJobModel');
const Notification = require('../models/notificationModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, notFoundResponse, forbiddenResponse } = require('../utils/responseUtils');
const { paginate } = require('../utils/paginationUtils');
const { processUploadedFile } = require('../utils/fileUtils');

/**
 * @desc    Get paginated jobs list with filters
 * @route   GET /api/jobs
 * @access  Private
 */
const getJobs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    title,
    company,
    location,
    job_type,
    status = 'active'
  } = req.query;

  // Build query with filters
  const query = { status };
  if (title) query.title = { $regex: title, $options: 'i' };
  if (company) query.company = { $regex: company, $options: 'i' };
  if (location) query.location = { $regex: location, $options: 'i' };
  if (job_type) query.job_type = job_type;

  // Get paginated results
  const options = {
    populate: [
      { path: 'posted_by', select: 'name avatar_url company' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(Job, query, page, limit, options);

  // Check if jobs are saved by current user
  const jobIds = results.data.map(job => job._id);
  const savedJobs = await SavedJob.find({
    user_id: req.user._id,
    job_id: { $in: jobIds }
  });

  const savedJobIds = savedJobs.map(saved => saved.job_id.toString());

  // Add isSaved flag to each job
  const jobsWithSavedStatus = results.data.map(job => ({
    ...job.toObject(),
    isSaved: savedJobIds.includes(job._id.toString())
  }));

  return successResponse(res, 200, 'Jobs retrieved successfully', {
    data: jobsWithSavedStatus,
    pagination: results.pagination
  });
});

/**
 * @desc    Create a new job
 * @route   POST /api/jobs
 * @access  Private
 */
const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    company,
    location,
    job_type,
    salary_range,
    description,
    requirements,
    status = 'active'
  } = req.body;

  // Create job
  const job = await Job.create({
    posted_by: req.user._id,
    title,
    company,
    location,
    job_type,
    salary_range,
    description,
    requirements,
    status
  });

  // Populate poster details
  await job.populate('posted_by', 'name avatar_url company');

  return successResponse(res, 201, 'Job created successfully', job);
});

/**
 * @desc    Get job details by ID
 * @route   GET /api/jobs/:id
 * @access  Private
 */
const getJobById = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  // Find job by ID
  const job = await Job.findById(jobId).populate('posted_by', 'name avatar_url company');

  if (!job) {
    return notFoundResponse(res, 'Job not found');
  }

  // Check if job is saved by current user
  const isSaved = await SavedJob.exists({
    user_id: req.user._id,
    job_id: jobId
  });

  // Check if user has applied to this job
  const hasApplied = await JobApplication.exists({
    job_id: jobId,
    applicant_id: req.user._id
  });

  return successResponse(res, 200, 'Job retrieved successfully', {
    ...job.toObject(),
    isSaved: !!isSaved,
    hasApplied: !!hasApplied
  });
});

/**
 * @desc    Update a job
 * @route   PUT /api/jobs/:id
 * @access  Private
 */
const updateJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const {
    title,
    company,
    location,
    job_type,
    salary_range,
    description,
    requirements,
    status
  } = req.body;

  // Find job by ID
  const job = await Job.findById(jobId);

  if (!job) {
    return notFoundResponse(res, 'Job not found');
  }

  // Check if user is the job poster
  if (job.posted_by.toString() !== req.user._id.toString()) {
    return forbiddenResponse(res, 'Not authorized to update this job');
  }

  // Update job fields
  if (title) job.title = title;
  if (company) job.company = company;
  if (location) job.location = location;
  if (job_type) job.job_type = job_type;
  if (salary_range) job.salary_range = salary_range;
  if (description) job.description = description;
  if (requirements) job.requirements = requirements;
  if (status) job.status = status;

  // Save updated job
  const updatedJob = await job.save();
  await updatedJob.populate('posted_by', 'name avatar_url company');

  return successResponse(res, 200, 'Job updated successfully', updatedJob);
});

/**
 * @desc    Delete a job
 * @route   DELETE /api/jobs/:id
 * @access  Private
 */
const deleteJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  // Find job by ID
  const job = await Job.findById(jobId);

  if (!job) {
    return notFoundResponse(res, 'Job not found');
  }

  // Check if user is the job poster
  if (job.posted_by.toString() !== req.user._id.toString()) {
    return forbiddenResponse(res, 'Not authorized to delete this job');
  }

  // Delete job
  await job.remove();

  // Delete associated applications and saved jobs
  await JobApplication.deleteMany({ job_id: jobId });
  await SavedJob.deleteMany({ job_id: jobId });

  return successResponse(res, 200, 'Job deleted successfully');
});

/**
 * @desc    Apply for a job
 * @route   POST /api/jobs/:id/apply
 * @access  Private
 */
const applyForJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const { cover_letter, portfolio_url, experience } = req.body;
  const applicantId = req.user._id;

  // Find job by ID
  const job = await Job.findById(jobId);

  if (!job) {
    return notFoundResponse(res, 'Job not found');
  }

  // Check if job is active
  if (job.status !== 'active') {
    return errorResponse(res, 400, `Cannot apply to ${job.status} job`);
  }

  // Check if user is the job poster
  if (job.posted_by.toString() === applicantId.toString()) {
    return errorResponse(res, 400, 'Cannot apply to your own job posting');
  }

  // Check if user has already applied
  const existingApplication = await JobApplication.findOne({
    job_id: jobId,
    applicant_id: applicantId
  });

  if (existingApplication) {
    return errorResponse(res, 400, 'You have already applied to this job');
  }

  // Process resume if uploaded
  let resumeUrl = '';
  if (req.file) {
    const fileInfo = processUploadedFile(req.file);
    resumeUrl = fileInfo.url;
  }

  // Create job application
  const application = await JobApplication.create({
    job_id: jobId,
    applicant_id: applicantId,
    cover_letter,
    portfolio_url,
    resume_url: resumeUrl,
    experience,
    status: 'pending'
  });

  // Create notification for job poster
  await Notification.create({
    recipient_id: job.posted_by,
    sender_id: applicantId,
    type: 'job_application',
    content: `${req.user.name} applied to your job: ${job.title}`,
    reference_id: application._id,
    reference_model: 'JobApplication'
  });

  return successResponse(res, 201, 'Job application submitted successfully', application);
});

/**
 * @desc    List user's job applications
 * @route   GET /api/jobs/applications
 * @access  Private
 */
const listMyApplications = asyncHandler(async (req, res) => {
  const applicantId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  // Build query
  const query = { applicant_id: applicantId };
  if (status) query.status = status;

  // Get paginated results
  const options = {
    populate: [
      { path: 'job_id', select: 'title company location job_type salary_range status' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(JobApplication, query, page, limit, options);

  return successResponse(res, 200, 'Job applications retrieved successfully', results);
});

/**
 * @desc    List jobs posted by current user
 * @route   GET /api/jobs/my-postings
 * @access  Private
 */
const listMyJobPostings = asyncHandler(async (req, res) => {
  const posterId = req.user._id;
  const { page = 1, limit = 10, status } = req.query;

  // Build query
  const query = { posted_by: posterId };
  if (status) query.status = status;

  // Get paginated results
  const options = {
    sort: { createdAt: -1 }
  };

  const results = await paginate(Job, query, page, limit, options);

  // Get application counts for each job
  const jobsWithApplicationCounts = await Promise.all(
    results.data.map(async (job) => {
      const applicationsCount = await JobApplication.countDocuments({ job_id: job._id });
      return {
        ...job.toObject(),
        applicationsCount
      };
    })
  );

  return successResponse(res, 200, 'Job postings retrieved successfully', {
    data: jobsWithApplicationCounts,
    pagination: results.pagination
  });
});

/**
 * @desc    Save/unsave a job
 * @route   POST /api/jobs/:id/save
 * @access  Private
 */
const toggleSaveJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;

  // Find job by ID
  const job = await Job.findById(jobId);

  if (!job) {
    return notFoundResponse(res, 'Job not found');
  }

  // Check if job is already saved
  const existingSave = await SavedJob.findOne({
    job_id: jobId,
    user_id: userId
  });

  let isSaved = false;

  if (existingSave) {
    // Unsave the job
    await existingSave.remove();
  } else {
    // Save the job
    await SavedJob.create({
      job_id: jobId,
      user_id: userId
    });
    isSaved = true;
  }

  return successResponse(res, 200, isSaved ? 'Job saved' : 'Job unsaved', { isSaved });
});

/**
 * @desc    Get saved jobs
 * @route   GET /api/jobs/saved
 * @access  Private
 */
const getSavedJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  // Get paginated results
  const options = {
    populate: [
      { path: 'job_id', populate: { path: 'posted_by', select: 'name avatar_url company' } }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(SavedJob, { user_id: userId }, page, limit, options);

  // Transform data to focus on job details
  const transformedData = results.data.map(savedJob => ({
    _id: savedJob._id,
    savedAt: savedJob.createdAt,
    job: savedJob.job_id
  }));

  return successResponse(res, 200, 'Saved jobs retrieved successfully', {
    data: transformedData,
    pagination: results.pagination
  });
});

module.exports = {
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
};