import React, { useEffect, useState } from 'react';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';
import './Home.css';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=3');
        setFeaturedJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home">
      <section className="hero">
        <h1>Find Your Dream Job</h1>
        <p>Browse thousands of job listings and find the perfect match for your skills</p>
      </section>

      <section className="featured-jobs">
        <h2>Featured Jobs</h2>
        <div className="job-list">
          {featuredJobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;