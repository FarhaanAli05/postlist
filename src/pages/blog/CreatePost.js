import { useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Header from "../../components/Header";
import refreshAccessToken from '../../utils/refreshAccessToken';
import './CreatePost.css';

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

function CreatePost({ isSignedIn, setIsSignedIn, loggedInUsername, setLoggedInUsername, setUsernameOrEmail, setPassword, setEmail }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const [filePreview, setFilePreview] = useState('');

  const navigate = useNavigate();

  async function createNewPost(e) {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('author', author);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', file);

    let token = Cookies.get('access_token');
    try {
      await axios.post('http://localhost:8000/api/post/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Blog post successfully created!');
      navigate('/blog');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        Cookies.set('access_token', newAccessToken);
        token = Cookies.get('access_token');
        if (newAccessToken) {
          await axios.post('http://localhost:8000/api/post/', data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
          alert('Blog post successfully created!');
          navigate('/blog');
        } else {
          alert('An error occurred. Please try again later.');
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
  }

  return (
    <>
      <title>Create Post - PostList</title>

      <Header
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        loggedInUsername={loggedInUsername}
        setLoggedInUsername={setLoggedInUsername}
        setUsernameOrEmail={setUsernameOrEmail}
        setPassword={setPassword}
        setEmail={setEmail}
      />

      <h2 className="create-post-title">Create Blog Post</h2>

      <form className="create-post-form" onSubmit={createNewPost}>
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
        <button>Create post</button>
      </form>
    </>
  );
}

export default CreatePost;