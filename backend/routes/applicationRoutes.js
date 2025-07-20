const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const applicationController = require('../controllers/applicationController');
const { auth, isEmployer, isCandidate } = require('../middleware/auth');

// Candidate routes
router.get('/job/:jobId', auth, isEmployer, applicationController.getJobApplications);
router.put('/:applicationId', auth, isEmployer, applicationController.updateApplicationStatus);
router.post(
  '/',
  auth,
  isCandidate,
  upload.single('resume'),
  applicationController.applyForJob
);

router.get(
  '/my-applications',
  auth,
  isCandidate,
  applicationController.getCandidateApplications
);

// Employer routes
router.get(
  '/job/:jobId',
  auth,
  isEmployer,
  applicationController.getJobApplications
);

router.put(
  '/:applicationId/job/:jobId',
  auth,
  isEmployer,
  applicationController.updateApplicationStatus
);

module.exports = router;