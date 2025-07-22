import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Header from "../../components/Header";
import refreshAccessToken from '../../utils/refreshAccessToken';
import './EditPost.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link'],
    ['clean']
  ],
};
const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

function EditPost({ isSignedIn, setIsSignedIn, loggedInUsername, setLoggedInUsername, setUsernameOrEmail, setPassword, setEmail }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const [filePreview, setFilePreview] = useState('');

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    let token = Cookies.get('access_token');
    const getPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/post/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setSummary(response.data.summary);
        setContent(response.data.content);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          Cookies.set('access_token', newAccessToken);
          token = Cookies.get('access_token');
          if (newAccessToken) {
            const retriedResponse = await axios.get(`http://localhost:8000/api/post/${id}/`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setTitle(retriedResponse.data.title);
            setAuthor(retriedResponse.data.author);
            setSummary(retriedResponse.data.summary);
            setContent(retriedResponse.data.content);
          } else {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            Cookies.remove('username');
            Cookies.remove('is_signed_in');
            navigate('/signup');
          }
        } else if (error.response && error.response.status === 500) {
          alert('Server error occurred. To keep your work safe, please copy your content and try again later.');
        }
      };
    }
    getPost();
  }, []);

  async function updatePost(e) {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('author', author);
    data.set('summary', summary);
    data.set('content', content);
    if (file) {
      data.set('file', file);
    }

    let token = Cookies.get('access_token');
    try {
      await axios.patch(`http://localhost:8000/api/post/${id}/`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/blog/${id}`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        Cookies.set('access_token', newAccessToken);
        token = Cookies.get('access_token');
        if (newAccessToken) {
          await axios.patch(`http://localhost:8000/api/post/${id}/`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          navigate(`/blog/${id}`);
        } else {
          alert('Your session has expired. To keep your work safe, please copy your content and log in again to publish your blog post.');
        }
      } else if (error.response && error.response.status === 500) {
        alert('Server error occurred. To keep your work safe, please copy your content and try again later.');
      }
    }
  }

  return (
    <>
      <title>Edit Post - PostList</title>

      <Header
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        loggedInUsername={loggedInUsername}
        setLoggedInUsername={setLoggedInUsername}
        setUsernameOrEmail={setUsernameOrEmail}
        setPassword={setPassword}
        setEmail={setEmail}
      />

      <h2 className="create-post-title">Edit Blog Post</h2>

      <form className="create-post-form" onSubmit={updatePost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          required
        />
        <textarea
          type="text"
          placeholder="Summary"
          rows={3}
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
        <input
          className="file-input"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={e => {
            setFilePreview(URL.createObjectURL(e.target.files[0]));
            setFile(e.target.files[0]);
          }}
        />
        <img className={filePreview ? "image" : "no-image"} src={filePreview} />
        <ReactQuill
          className="content-input"
          theme="snow"
          value={content}
          onChange={newValue => setContent(newValue)}
          modules={modules}
          formats={formats}
          placeholder="Content"
          required
        />
        <div className="buttons-container">
          <button id="cancel-button" onClick={() => navigate(`/blog/${id}`)}>Cancel</button>
          <button>Update post</button>
        </div>
      </form>
    </>
  );
}

export default EditPost;