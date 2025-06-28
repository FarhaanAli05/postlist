import { useState } from 'react';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');

  return (
    <Routes>
      <Route index element={<HomePage isSignedIn={isSignedIn} usernameOrEmail={usernameOrEmail} />} />
      <Route path="login" element={<LoginPage setIsSignedIn={setIsSignedIn} usernameOrEmail={usernameOrEmail} setUsernameOrEmail={setUsernameOrEmail} />} />
      <Route path="signup" element={<SignUpPage setIsSignedIn={setIsSignedIn} username={usernameOrEmail} setUsername={setUsernameOrEmail} />} />
      {/* <Route path="*" element={<ErrorPage />} /> */}
    </Routes>
  );
}

export default App;