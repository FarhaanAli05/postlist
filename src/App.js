import { useState } from 'react';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Routes>
      <Route index element={<HomePage isSignedIn={isSignedIn} usernameOrEmail={usernameOrEmail} setUsernameOrEmail={setUsernameOrEmail} setPassword={setPassword} setEmail={setEmail} />} />
      <Route path="login" element={<LoginPage setIsSignedIn={setIsSignedIn} usernameOrEmail={usernameOrEmail} setUsernameOrEmail={setUsernameOrEmail} password={password} setPassword={setPassword} />} />
      <Route path="signup" element={<SignUpPage setIsSignedIn={setIsSignedIn} username={usernameOrEmail} setUsername={setUsernameOrEmail} password={password} setPassword={setPassword} email={email} setEmail={setEmail} />} />
      {/* <Route path="*" element={<ErrorPage />} /> */}
    </Routes>
  );
}

export default App;