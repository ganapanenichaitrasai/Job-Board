const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendStatusEmail } = require('../utils/mailer');

const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status: req.body.status },
      { new: true }
    )
    .populate('job candidate');

    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Send email notification
    await sendStatusEmail(
      application.candidate.email,
      application.job.title,
      req.body.status
    );

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const applyForJob = async (req, res) => {
  const { jobId, coverLetter } = req.body;
  const resume = req.file ? req.file.path : req.user.resume;

  if (!resume) {
    return res.status(400).json({ msg: 'Please upload a resume' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    const newApplication = new Application({
      job: jobId,
      candidate: req.user.id,
      resume,
      coverLetter
    });

    await newApplication.save();

    // Update user's resume if they uploaded a new one
    if (req.file && req.user.resume !== resume) {
      await User.findByIdAndUpdate(req.user.id, { resume });
    }

    res.json(newApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getJobApplications = async (req, res) => {
  try {
    // Verify the job belongs to the employer
    const job = await Job.findOne({
      _id: req.params.jobId,
      employer: req.user.id
    });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found or unauthorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email skills');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  applyForJob,
  getCandidateApplications,
  getJobApplications,
  updateApplicationStatus
};