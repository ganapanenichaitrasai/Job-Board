import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../services/api';

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: 'Full-time',
    skillsRequired: ''
  });
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', {
        ...jobData,
        company: user.company, // Use employer's company
        skillsRequired: jobData.skillsRequired.split(',').map(skill => skill.trim())
      });
      navigate('/employer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="post-job">
      <h1>Post a New Job</h1>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            value={user?.company || ''}
            readOnly
            disabled
          />
        </div>
        
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Salary</label>
          <input
            type="text"
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Job Type</label>
          <select
            name="type"
            value={jobData.type}
            onChange={handleChange}
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Required Skills (comma separated)</label>
          <input
            type="text"
            name="skillsRequired"
            value={jobData.skillsRequired}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="submit-btn">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;