import Header from "../components/Header";
import './HomePage.css'

function HomePage({ isSignedIn, setIsSignedIn, loggedInUsername, setLoggedInUsername, setUsernameOrEmail, setPassword, setEmail }) {
  return (
    <>
      <title>Home - PostList</title>

      <Header
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        loggedInUsername={loggedInUsername}
        setLoggedInUsername={setLoggedInUsername}
        setUsernameOrEmail={setUsernameOrEmail}
        setPassword={setPassword}
        setEmail={setEmail}
      />

      <h2 className="message">Welcome, {loggedInUsername}. How can I help you today?</h2>
    </>
  );
}

export default HomePage;