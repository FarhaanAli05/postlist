import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';

function SignUpPage({ setIsSignedIn, username, setUsername, password, setPassword, email, setEmail }) {
  const navigate = useNavigate();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setEmail('');
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
        email
      });

      alert("Account created successfully.");
      setIsSignedIn(true);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage === "Username already exists") {
        alert('Username already exists. Please use a different username.');
      } else if (errorMessage === "Email already in use") {
        alert('Email already in use. Try logging in.');
      } else if (errorMessage === "Password cannot be less than 8 characters") {
        alert('Password must be at least 8 characters long.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <>
      <title>Create Account - To-Do List</title>

      <h1><NavLink to="/" className="logo" style={{ textDecoration: 'none' }}>✔️ To-Do List</NavLink></h1>
      <h3>Create Account</h3>
      <form onSubmit={handleSubmit}>
        <label for="email">Email:</label><br />
        <input type="email" id="email" name="email" placeholder="Enter email" value={email} onChange={handleEmailChange} /><br /><br />
        <label for="username">Username:</label><br />
        <input type="text" id="username" name="username" placeholder="Enter username" value={username} onChange={handleUsernameChange} required /><br /><br />
        <label for="password">Password:</label><br />
        <input type="password" id="password" name="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} required /><br /><br />
        <input type="submit" value="Submit" />
      </form>

      <p>Already have an account?</p>
      <NavLink to="/login" className="login-link">Log in</NavLink>
    </>
  );
}

export default SignUpPage;