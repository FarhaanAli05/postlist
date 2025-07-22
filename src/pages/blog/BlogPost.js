import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from "react-router";
import Cookies from 'js-cookie';
import axios from 'axios';
import dayjs from 'dayjs';
import Header from "../../components/Header";
import refreshAccessToken from '../../utils/refreshAccessToken';
import './BlogPost.css';

const DJANGO_BACKEND_URL = 'http://localhost:8000';

function BlogPost({ isSignedIn, setIsSignedIn, loggedInUsername, setLoggedInUsername, setUsernameOrEmail, setPassword, setEmail }) {
  const [post, setPost] = useState({});
  const [postTime, setPostTime] = useState('');
  const [postDate, setPostDate] = useState('');

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    let token = Cookies.get('access_token');
    const getPost = async () => {
      const response = await axios.get(`http://localhost:8000/api/post/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setPost(response.data);
      } else if (response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        Cookies.set('access_token', newAccessToken);
        token = Cookies.get('access_token');
        if (newAccessToken) {
          await axios.get(`http://localhost:8000/api/post/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setPost(response.data);
        } else {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          Cookies.remove('username');
          Cookies.remove('is_signed_in');
          navigate('/signup');
        }
      }
    };
    getPost();
  }, [id]);

  useEffect(() => {
    if (Object.keys(post).length !== 0) {
      setPostTime(`${dayjs(post.created_at.split(".")[0]).format('h:mm A')} ET`);
      setPostDate(`${dayjs(post.created_at.split("T")[0]).format("MMMM D, YYYY")}`);
    }
  }, [post]);

  const deletePost = async () => {
    let token = Cookies.get('access_token');
    try {
      await axios.delete(`http://localhost:8000/api/post/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/blog');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        Cookies.set('access_token', newAccessToken);
        token = Cookies.get('access_token');
        if (newAccessToken) {
          await axios.delete(`http://localhost:8000/api/post/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          navigate('/blog');
        } else {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          Cookies.remove('username');
          Cookies.remove('is_signed_in');
          navigate('/signup');
        }
      } else {
        alert('Could not fetch article!');
        setPost({});
        navigate('/blog');
      }
    }
  };

  return (
    <div className="blog-post-page">
      <title>{post.title}</title>

      <Header
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        loggedInUsername={loggedInUsername}
        setLoggedInUsername={setLoggedInUsername}
        setUsernameOrEmail={setUsernameOrEmail}
        setPassword={setPassword}
        setEmail={setEmail}
      />

      <div className="article-container">
        <h2>{post.title}</h2>
        <h3>{post.summary}</h3>
        <p className="author">{post.author} - {postTime} &#183; {postDate}
        </p>
        <img src={DJANGO_BACKEND_URL + post.file} />
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="post-options">
          <NavLink to={`/blog/edit/${id}`} className="post-ud">✏️ Edit this post</NavLink>
          <span className="post-ud" onClick={() => {
            if (window.confirm('Are you sure you want to delete this post?')) {
              deletePost();
            }
          }}>🗑️ Delete this post</span>
        </div>

        <NavLink className="back-link" to="/blog">{'<'} Back</NavLink>
      </div>
    </div>
  );
}

export default BlogPost;