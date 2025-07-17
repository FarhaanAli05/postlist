import { useState } from 'react';
import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import BlogsPage from './pages/blog/BlogsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ErrorPage from './pages/ErrorPage';
import CreatePost from './pages/blog/CreatePost';
import BlogPost from './pages/blog/BlogPost';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loggedInUsername, setLoggedInUsername] = useState('');

  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute>
            <HomePage
              isSignedIn={isSignedIn}
              setIsSignedIn={setIsSignedIn}
              loggedInUsername={loggedInUsername}
              setLoggedInUsername={setLoggedInUsername}
              setUsernameOrEmail={setUsernameOrEmail}
              setPassword={setPassword}
              setEmail={setEmail}
            />
          </ProtectedRoute>
        }
      />
      <Route path="tasks"
        element={
          <ProtectedRoute>
            <TasksPage
              isSignedIn={isSignedIn}
              setIsSignedIn={setIsSignedIn}
              usernameOrEmail={usernameOrEmail}
              setUsernameOrEmail={setUsernameOrEmail}
              setPassword={setPassword}
              setEmail={setEmail}
              loggedInUsername={loggedInUsername}
              setLoggedInUsername={setLoggedInUsername}
            />
          </ProtectedRoute>
        }
      />
      <Route path="blog"
        element={
          <ProtectedRoute>
            <BlogsPage
              isSignedIn={isSignedIn}
              setIsSignedIn={setIsSignedIn}
              loggedInUsername={loggedInUsername}
              setLoggedInUsername={setLoggedInUsername}
              setUsernameOrEmail={setUsernameOrEmail}
              setPassword={setPassword}
              setEmail={setEmail}
            />
          </ProtectedRoute>
        }
      />
      <Route path="blog/:id"
        element={
          <ProtectedRoute>
            <BlogPost
              isSignedIn={isSignedIn}
              setIsSignedIn={setIsSignedIn}
              loggedInUsername={loggedInUsername}
              setLoggedInUsername={setLoggedInUsername}
              setUsernameOrEmail={setUsernameOrEmail}
              setPassword={setPassword}
              setEmail={setEmail}
            />
          </ProtectedRoute>
        }
      />
      <Route path="blog/create"
        element={
          <ProtectedRoute>
            <CreatePost
              isSignedIn={isSignedIn}
              setIsSignedIn={setIsSignedIn}
              loggedInUsername={loggedInUsername}
              setLoggedInUsername={setLoggedInUsername}
              setUsernameOrEmail={setUsernameOrEmail}
              setPassword={setPassword}
              setEmail={setEmail}
            />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={
        <LoginPage
          isSignedIn={isSignedIn}
          setIsSignedIn={setIsSignedIn}
          usernameOrEmail={usernameOrEmail}
          setUsernameOrEmail={setUsernameOrEmail}
          password={password}
          setPassword={setPassword}
        />}
      />
      <Route path="signup" element={
        <SignUpPage
          setIsSignedIn={setIsSignedIn}
          username={usernameOrEmail}
          setUsername={setUsernameOrEmail}
          password={password}
          setPassword={setPassword}
          email={email}
          setEmail={setEmail}
        />}
      />
      <Route path="*" element={
        <ErrorPage
          isSignedIn={isSignedIn}
          setIsSignedIn={setIsSignedIn}
          loggedInUsername={loggedInUsername}
          setLoggedInUsername={setLoggedInUsername}
          setUsernameOrEmail={setUsernameOrEmail}
          setPassword={setPassword}
          setEmail={setEmail}
        />}
      />
    </Routes>
  );
}

export default App;