import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    skills: '',
    resume: null
  });
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        setProfile({
          name: res.data.name,
          email: res.data.email,
          skills: res.data.skills?.join(', ') || '',
          resume: res.data.resume || null
        });
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfile({ ...profile, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('skills', profile.skills);
      
      if (profile.resume instanceof File) {
        formData.append('resume', profile.resume);
      }

      const res = await api.put('/auth/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setProfile({
        ...res.data,
        skills: res.data.skills?.join(', ') || ''
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setUploadProgress(0);
    }
  };

  const handleRemoveResume = async () => {
    try {
      await api.delete('/auth/me/resume');
      setProfile(prev => ({ ...prev, resume: null }));
      setSuccess('Resume removed successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove resume');
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile-form">
      <h2>My Profile</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Field (read-only) */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            disabled
          />
        </div>

        {/* Skills Field */}
        <div className="form-group">
          <label>Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            required
            placeholder="JavaScript, React, Node.js"
          />
        </div>

        {/* Resume Upload */}
        <div className="form-group">
          <label>Resume</label>
          <div className="resume-upload-container">
            <input
              type="file"
              id="resume-upload"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
            />
            <label htmlFor="resume-upload" className="upload-btn">
              {profile.resume instanceof File ? 
                profile.resume.name : 
                'Choose Resume File'
              }
            </label>

            {profile.resume && (
              <div className="resume-actions">
                {typeof profile.resume === 'string' ? (
                  <>
                    <a 
                      href={profile.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View Resume
                    </a>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="remove-btn"
                    >
                      Remove Resume
                    </button>
                  </>
                ) : (
                  <span className="file-selected">
                    Selected: {profile.resume.name}
                  </span>
                )}
              </div>
            )}
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={uploadProgress > 0}
        >
          {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;