import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import Cookies from 'js-cookie';
import arrowDownIcon from '../assets/arrow-down.png';
import arrowUpIcon from '../assets/arrow-up.png';
import signOutIcon from '../assets/sign-out.png';
import './Header.css';

function Header({ isSignedIn, setIsSignedIn, loggedInUsername, setLoggedInUsername, setUsernameOrEmail, setPassword, setEmail }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const menuRef = useRef(null);
  const usernameRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (Cookies.get('is_signed_in')) {
      setIsSignedIn(true);
      setLoggedInUsername(Cookies.get('username'));
    } else {
      setUsernameOrEmail('');
      setPassword('');
      setEmail('');
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && !usernameRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="header">
        <div className="logo-container">
          <p><NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>✔️ To-Do List</NavLink></p>
        </div>
        <div className="links">
          <div className="home">
            <p><NavLink to="/" className="home-link" style={{
              textDecoration: currentPath === '/'
                ? 'underline'
                : 'none'
            }}>Home</NavLink></p>
          </div>
          <div className="tasks">
            <p><NavLink to="/tasks" className="tasks-link" style={{
              textDecoration: currentPath.includes('/tasks')
                ? 'underline'
                : 'none'
            }}>Tasks</NavLink></p>
          </div>
          <div className="blog">
            <p><NavLink to="/blog" className="blog-link" style={{
              textDecoration: currentPath.includes('/blog')
                ? 'underline'
                : 'none'
            }}>Blog</NavLink></p>
          </div>
        </div>
        <div className="profile-container">
          {!isSignedIn ? (
            <NavLink to="/signup" className="signup-link">Sign in</NavLink>
          ) : (
            <div className="username-container" ref={usernameRef} onClick={() => {
              setShowDropdown(!showDropdown);
            }}>
              <span>{loggedInUsername} </span>
              {showDropdown ? (
                <>
                  <img src={arrowUpIcon} />
                  <div className="dropdown-menu" ref={menuRef} onClick={() => {
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    Cookies.remove('username');
                    Cookies.remove('is_signed_in');
                    navigate('/signup');
                  }}>
                    <img src={signOutIcon} />
                    <p>Log out</p>
                  </div>
                </>
              ) : (
                <img src={arrowDownIcon} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;