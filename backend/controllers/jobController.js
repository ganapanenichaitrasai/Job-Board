const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name company');
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name company');
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server error');
  }
};

const createJob = async (req, res) => {
  const { title, description, company, location, salary, type, skillsRequired } = req.body;

  try {
    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      type,
      skillsRequired,
      employer: req.user.id
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    // First get all jobs for this employer
    const jobs = await Job.find({ employer: req.user.id })
      .populate('employer', 'name company')
      .lean();

    // Then get application counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { 
          ...job, 
          applicationsCount: count,
          // Add other fields you might need
        };
      })
    );

    res.json(jobsWithCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const searchJobs = async (req, res) => {
  const { title, location, type } = req.query;
  const query = {};

  if (title) query.title = new RegExp(title, 'i');
  if (location) query.location = new RegExp(location, 'i');
  if (type) query.type = type;

  try {
    const jobs = await Job.find(query).populate('employer', 'name company');
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  getEmployerJobs,
  searchJobs
};