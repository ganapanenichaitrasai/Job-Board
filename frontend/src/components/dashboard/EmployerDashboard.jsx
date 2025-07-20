import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './EmployerDashboard.css';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  // Fetch all jobs posted by this employer
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/employer/my-jobs');
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applications for selected job
  const fetchApplications = async (jobId) => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
      setSelectedJob(jobId);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    }
  };

  // Handle application status changes
  const handleStatusChange = async (applicationId, status) => {
  try {
    const updatedApp = await api.put(`/applications/${applicationId}`, { status });
    
    // Show success notification
    alert(`Application ${status}. Email notification sent to candidate.`);
    
    // Update UI
    if (status === 'rejected') {
      setApplications(applications.filter(app => app._id !== applicationId));
    } else {
      setApplications(applications.map(app => 
        app._id === applicationId ? updatedApp.data : app
      ));
    }

    // Update counts
    setJobs(jobs.map(job => {
      if (job._id === selectedJob) {
        return {
          ...job,
          applicationsCount: status === 'rejected' 
            ? job.applicationsCount - 1
            : job.applicationsCount
        };
      }
      return job;
    }));

  } catch (err) {
    console.error('Failed to update application:', err);
    alert('Failed to update application status');
  }
};

  if (loading) return <div className="loading">Loading your job postings...</div>;

  return (
    <div className="employer-dashboard">
      <div className="dashboard-header">
        <h1>My Job Postings</h1>
        <Link to="/employer/post-job" className="">
          Post New Job
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="jobs-list">
          <h2>Your Job Posts</h2>
          {jobs.length === 0 ? (
            <div className="no-jobs">
              <p>You haven't posted any jobs yet.</p>
              <Link to="/employer/post-job" className="btn primary">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <ul>
              {jobs.map(job => (
                <li 
                  key={job._id} 
                  className={`job-item ${selectedJob === job._id ? 'active' : ''}`}
                  onClick={() => fetchApplications(job._id)}
                >
                  <div className="job-info">
                    <h3>{job.title}</h3>
                    <p className="company">{job.company}</p>
                    <p className="details">
                      {job.type} • {job.location} • ${job.salary}
                    </p>
                  </div>
                  <div className="applicant-count">
                    {job.applicationsCount || 0} applicant{job.applicationsCount !== 1 ? 's' : ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="applications-section">
          <h2>Applications</h2>
          {selectedJob ? (
            applications.length > 0 ? (
              <div className="applications-list">
                {applications.map(application => (
                  <div key={application._id} className="application-card">
                    <div className="candidate-info">
                      <h4>{application.candidate.name}</h4>
                      <p>{application.candidate.email}</p>
                      <p className="applied-date">
                        Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                      {application.coverLetter && (
                        <div className="cover-letter">
                          <p>Cover Letter:</p>
                          <p>{application.coverLetter}</p>
                        </div>
                      )}
                      <a 
                        href={application.resume} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resume-link"
                      >
                        View Resume
                      </a>
                    </div>
                    <div className="application-actions">
                      <div className={`status-badge ${application.status}`}>
                        {application.status}
                      </div>
                      <div className="action-buttons">
                        {application.status !== 'accepted' && (
                          <button 
                            onClick={() => handleStatusChange(application._id, 'accepted')}
                            className="btn success"
                          >
                            Accept
                          </button>
                        )}
                        {application.status !== 'rejected' && (
                          <button 
                            onClick={() => handleStatusChange(application._id, 'rejected')}
                            className="btn danger"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-applications">
                <p>No applications for this job yet.</p>
                <button 
                  onClick={() => fetchApplications(selectedJob)}
                  className="btn"
                >
                  Refresh
                </button>
              </div>
            )
          ) : (
            <div className="select-job-prompt">
              <p>Select a job from the list to view applications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;