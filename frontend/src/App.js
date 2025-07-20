import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/authContext'; // Note capital 'A'
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JobList from './components/jobs/JobList';
import JobDetail from './components/jobs/JobDetail';
import JobSearch from './components/jobs/JobSearch';
import EmployerDashboard from './components/dashboard/EmployerDashboard';
import CandidateDashboard from './components/dashboard/CandidateDashboard';
import NotFound from './pages/NotFound';
import PostJob from './components/jobs/PostJob';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/jobs/search" element={<JobSearch />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/employer/post-job" element={<PostJob/>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;