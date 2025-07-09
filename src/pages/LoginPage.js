import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import getUser from '../utils/getUser';
// import './LoginPage.css';

function LoginPage({ isSignedIn, setIsSignedIn, usernameOrEmail, setUsernameOrEmail, password, setPassword, setRefreshToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    setUsernameOrEmail('');
    setPassword('');
  }, []);

  const handleUsernameChange = (event) => {
    setUsernameOrEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username: usernameOrEmail,
        password
      });

      const access = response.data.access;
      const refresh = response.data.refresh;

      Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
      Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });

      alert("Login successful!");

      setIsSignedIn(true);
      Cookies.set('is_signed_in', 'true', { expires: 7, secure: true, sameSite: 'strict' });

      const username = await getUser(usernameOrEmail);
      Cookies.set('username', username, { secure: true, sameSite: 'strict' });

      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage === "Invalid credentials") {
        alert("Username and password do not match.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <div className="login-page">
        <title>Login - To-Do List</title>

        <div className="heading">
          <h2><NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>✔️ To-Do List</NavLink></h2>
          <h3>Login</h3>
        </div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label for="username">Email or username:</label><br />
            <input type="text" id="username" name="username" placeholder="Enter username" value={usernameOrEmail} onChange={handleUsernameChange} required /><br /><br />
            <label for="password">Password:</label><br />
            <input type="password" id="password" name="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} required /><br /><br />
            <input className="submit-button" type="submit" value="Log in" />
          </form>
        </div>

        <div className="footing">
          <p>Do not have an account?</p>
          <NavLink to="/signup" className="signup-link">Create account</NavLink>
        </div>
      </div>
    </>
  );
}

export default LoginPage;