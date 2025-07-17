import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import Cookies from 'js-cookie';
import axios from "axios";
import dayjs from 'dayjs';
import Header from "../../components/Header";
import refreshAccessToken from "../../utils/refreshAccessToken";
import './BlogsPage.css';

const DJANGO_BACKEND_URL = 'http://localhost:8000';

function BlogsPage({ isSignedIn, setIsSignedIn, loggedInUsername, setLoggedInUsername, setUsernameOrEmail, setPassword, setEmail }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlogPosts();
  }, []);

  const navigate = useNavigate();

  const getBlogPosts = async () => {
    let token = Cookies.get('access_token');
    try {
      const response = await axios.get('http://localhost:8000/api/post/', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      setPosts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        Cookies.set('access_token', newAccessToken);
        token = Cookies.get('access_token');
        if (newAccessToken) {
          const retriedResponse = await axios.get('http://localhost:8000/api/post/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setPosts(retriedResponse.data);
        } else {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          Cookies.remove('username');
          Cookies.remove('is_signed_in');
          navigate('/signup');
        }
      } else if (error.response && error.response.status === 500) {
        alert('Server error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="blogs-page">
      <title>Blog - To-Do-List</title>

      <Header
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        loggedInUsername={loggedInUsername}
        setLoggedInUsername={setLoggedInUsername}
        setUsernameOrEmail={setUsernameOrEmail}
        setPassword={setPassword}
        setEmail={setEmail}
      />

      <h2 className="blog-title">Blog</h2>

      <NavLink to="/blog/create" className="create-post-link">+ Create new post</NavLink>

      <div className="blogs-container">
        {posts ? (posts.map((blogPost) => {
          return (
            <div className="blog-post-container" key={blogPost.id}>
              <img src={DJANGO_BACKEND_URL + blogPost.file} />
              <div className="text">
                <p className="author">{blogPost.author} - {dayjs(blogPost.created_at.split('T')[0]).format('MMM D, YYYY')}</p>
                <NavLink className="post-title" to={`/blog/${blogPost.id}`}>{blogPost.title}</NavLink>
                <p className="summary">{blogPost.summary}</p>
              </div>
            </div>
          );
        })) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default BlogsPage;