import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';

function LoginPage({ setIsSignedIn, usernameOrEmail, setUsernameOrEmail, password, setPassword }) {
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

      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        alert("Login successful!");
        setIsSignedIn(true);
        navigate('/');
      }
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
      <title>Login - To-Do List</title>

      <h1><NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>✔️ To-Do List</NavLink></h1>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <label for="username">Email or username:</label><br />
        <input type="text" id="username" name="username" placeholder="Enter username" value={usernameOrEmail} onChange={handleUsernameChange} required /><br /><br />
        <label for="password">Password:</label><br />
        <input type="password" id="password" name="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} required /><br /><br />
        <input type="submit" value="Submit" />
      </form>

      <p>Do not have an account?</p>
      <NavLink to="/signup" className="signup-link">Create account</NavLink>
    </>
  );
}

export default LoginPage;