import { useState } from 'react';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <Routes>
      <Route index element={<HomePage isSignedIn={isSignedIn} username={username} />} />
      <Route path="login" element={<LoginPage setIsSignedIn={setIsSignedIn} username={username} setUsername={setUsername} />} />
      {/* <Route path="*" element={<ErrorPage />} /> */}
    </Routes>
  );
}

export default App;