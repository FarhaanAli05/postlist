import { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import getUser from '../utils/getUser';

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
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
        email
      });

      const access = response.data.access;
      const refresh = response.data.refresh;

      Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
      Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });

      alert("Account created successfully.");

      setIsSignedIn(true);
      Cookies.set('is_signed_in', 'true', { expires: 7, secure: true, sameSite: 'Strict' });

      const matchingUsername = await getUser(username);
      Cookies.set('username', matchingUsername, { secure: true, sameSite: 'strict' });

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