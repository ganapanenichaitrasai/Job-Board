import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';

const JobDetail = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState({
    coverLetter: '',
    resume: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setApplication({
      ...application,
      resume: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('coverLetter', application.coverLetter);
      if (application.resume) {
        formData.append('resume', application.resume);
      }

      await api.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/candidate/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="job-detail">
      <h2>{job.title}</h2>
      <p>Company: {job.company}</p>
      <p>Location: {job.location}</p>
      <p>Salary: {job.salary}</p>
      <p>Type: {job.type}</p>
      <p>Description: {job.description}</p>
      <p>Skills Required: {job.skillsRequired.join(', ')}</p>

      {user?.role === 'candidate' && (
        <div className="application-form">
          <h3>Apply for this job</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Cover Letter</label>
              <textarea
                name="coverLetter"
                value={application.coverLetter}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Resume</label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              {user.resume && <p>Current resume: {user.resume}</p>}
            </div>
            <button type="submit" className="btn">Submit Application</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetail;