const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  deleteResume
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST api/auth/register
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6+ characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['employer', 'candidate'])
  ],
  register
);

// @route   POST api/auth/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// @route   GET api/auth/me
router.get('/me', auth, getMe);

// @route   PUT api/auth/me
router.put(
  '/me',
  auth,
  upload.single('resume'), // Multer middleware for file upload
  [
    check('name', 'Name is required').notEmpty(),
    check('skills', 'Skills are required').notEmpty()
  ],
  updateProfile
);

// @route   DELETE api/auth/me/resume
router.delete('/me/resume', auth, deleteResume);

module.exports = router;