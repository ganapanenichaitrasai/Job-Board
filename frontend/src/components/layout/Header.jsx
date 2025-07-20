import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FaSearch, FaUserTie, FaUser, FaBriefcase } from 'react-icons/fa';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav>
        <Link to="/" className="logo">
          <span className="logo-icon">
            <FaBriefcase />
          </span>
          JobBoard
        </Link>

        <div className="nav-links">
          <Link to="/jobs">
            <FaSearch style={{ marginRight: '5px' }} />
            Browse Jobs
          </Link>

          {user && user.role === 'employer' && (
            <Link to="/employer/post-job">
              <FaUserTie style={{ marginRight: '5px' }} />
              Post Job
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile">
                <FaUser style={{ marginRight: '5px' }} />
                Profile
              </Link>
              <Link to={user.role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard'}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;