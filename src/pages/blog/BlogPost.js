import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from "react-router";
import Cookies from 'js-cookie';
import axios from 'axios';
import dayjs from 'dayjs';
import Header from "../../components/Header";
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
      try {
        const response = await axios.get(`http://localhost:8000/api/post/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setPost(response.data);
      } catch (error) {
        if (error.response) {
          setPost({});
          alert('Could not fetch article!');
          navigate('/blog');
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

        <NavLink className="back-link" to="/blog">{'<'} Back</NavLink>
      </div>
    </div>
  );
}

export default BlogPost;