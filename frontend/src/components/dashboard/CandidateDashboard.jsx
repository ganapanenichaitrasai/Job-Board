import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="candidate-dashboard">
      <h2>My Applications</h2>
      {loading ? (
        <div>Loading...</div>
      ) : applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map(app => (
            <div key={app._id} className={`application-card ${app.status}`}>
              <h3>{app.job.title}</h3>
              <p>{app.job.company} - {app.job.location}</p>
              <div className="status-badge">
                Status: <span>{app.status}</span>
              </div>
              {app.status === 'rejected' && (
                <div className="rejection-notice">
                  Your application was not selected
                </div>
              )}
              <Link to={`/jobs/${app.job._id}`} className="btn">
                View Job
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;