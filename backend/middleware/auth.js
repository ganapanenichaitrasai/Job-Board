const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.user.id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const isEmployer = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).send({ error: 'Access denied. Employer only.' });
  }
  next();
};

const isCandidate = (req, res, next) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).send({ error: 'Access denied. Candidate only.' });
  }
  next();
};

module.exports = {
  auth: auth,
  isEmployer: isEmployer,
  isCandidate: isCandidate
};