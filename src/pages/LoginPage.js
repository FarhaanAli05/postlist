import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';

function LoginPage({ setIsSignedIn, username, setUsername }) {
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
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
      if (error.response && error.response.status === 401) {
        alert("Username and password do not match.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <title>Login - To-Do List</title>

      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label for="username">Email or username:</label><br />
        <input type="text" id="username" name="username" placeholder="Enter username" value={username} onChange={handleUsernameChange} required /><br /><br />
        <label for="password">Password:</label><br />
        <input type="password" id="password" name="password" placeholder="Enter password" value={password} onChange={handlePasswordChange} required /><br /><br />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}

export default LoginPage;