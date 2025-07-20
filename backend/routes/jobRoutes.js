const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jobController = require('../controllers/jobController');
const { getEmployerJobs } = require('../controllers/jobController');
const { auth, isEmployer } = require('../middleware/auth');

// Public routes
router.get('/employer/my-jobs', auth, isEmployer, getEmployerJobs);
router.post('/', auth, isEmployer, jobController.createJob);
router.get('/', jobController.getAllJobs);
router.get('/search', jobController.searchJobs);
router.get('/:id', jobController.getJobById);

// Employer routes
router.post(
  '/',
  [
    auth,
    isEmployer,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('type', 'Type is required').isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
    ]
  ],
  jobController.createJob
);

router.get('/employer/my-jobs', auth, isEmployer, jobController.getEmployerJobs);

module.exports = router;