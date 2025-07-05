import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import TaskInput from '../components/TaskInput.js';
import TaskItems from '../components/TaskItems.js';
import TaskExtraInfo from '../components/TaskExtraInfo.js';
import refreshAccessToken from '../utils/refreshAccessToken.js';

function HomePage({ isSignedIn, setIsSignedIn, usernameOrEmail, setUsernameOrEmail, setPassword, setEmail }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editQty, setEditQty] = useState(0);
  const [isAddDesc, setIsAddDesc] = useState(false);
  const [isAddQty, setIsAddQty] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let token = Cookies.get('access_token');
      try {
        const response = await axios.get('http://localhost:8000/api/tasks/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTasks(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          Cookies.set('access_token', newAccessToken);
          token = Cookies.get('access_token');
          if (newAccessToken) {
            const retriedResponse = await axios.get('http://localhost:8000/api/tasks/', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            setTasks(retriedResponse.data);
          } else {
            throw new Error('Failed to refresh access token. Please log in again');
          }
        }
      }
    }
    fetchData();

    if (Cookies.get('is_signed_in')) {
      setIsSignedIn(true);
      setLoggedInUsername(Cookies.get('username'));
    } else {
      setUsernameOrEmail('');
      setPassword('');
      setEmail('');
    }
  }, []);

  useEffect(() => {
    setLoggedInUsername(Cookies.get('username'));
  }, [usernameOrEmail]);

  function handleInputChange(e) {
    setNewTask({ text: e.target.value, finished: 'incomplete', description: newTask.description, quantity: newTask.quantity });
  }

  const createEnterKeyHandler = (callbackFunction) => (e) => {
    if (e.key === 'Enter') {
      callbackFunction();
    }
  }

  async function addTask() {
    if (newTask.text && newTask.text.trim() !== "") {
      let token = Cookies.get('access_token');
      const safeTask = { ...newTask, quantity: !newTask.quantity ? 0 : newTask.quantity }
      try {
        const response = await axios.post('http://localhost:8000/api/tasks/',
          JSON.stringify(safeTask), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setTasks(response.data);
        setNewTask({ text: "", finished: 'incomplete', description: '', quantity: 0 });
        setIsAddDesc(false);
        setIsAddQty(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const newAccessToken = await refreshAccessToken();
          Cookies.set('access_token', newAccessToken);
          token = Cookies.get('access_token');
          const retriedResponse = await axios.post('http://localhost:8000/api/tasks/',
            JSON.stringify(safeTask), {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setTasks(retriedResponse.data);
          setNewTask({ text: "", finished: 'incomplete', description: '', quantity: 0 });
          setIsAddDesc(false);
          setIsAddQty(false);
        }
      }
    }
  }

  async function deleteTask(index) {
    let token = Cookies.get('access_token');
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${index}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
    } catch (error) {
      if (error.response && error.response === 401) {
        const newAccessToken = await refreshAccessToken();
        Cookies.set('access_token', newAccessToken);
        token = Cookies.get('access_token');
        await axios.delete(`http://localhost:8000/api/tasks/${index}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
      }
    }
  }

  async function finishTask(index) {
    let token = Cookies.get('access_token');
    try {
      const response = await axios.post(`http://localhost:8000/api/tasks/${index}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      if (error.response && error.response === 401) {
        const newAccessToken = await refreshAccessToken();
        Cookies.set('access_token', newAccessToken);
        token = Cookies.get('access_token');
        const retriedResponse = await axios.post(`http://localhost:8000/api/tasks/${index}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setTasks(retriedResponse.data);
      }
    }
  }

  return (
    <div className="to-do-list">
      <title>To-Do List</title>

      {!isSignedIn ? (
        <NavLink to="/signup" className="signup-link">Sign in</NavLink>
      ) : (
        <>
          <span>👤 {loggedInUsername} </span>
          <a href="" onClick={() => {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            Cookies.remove('username');
            Cookies.remove('is_signed_in');
          }}>Log out</a>
        </>
      )}

      <h1>To-Do List</h1>

      <TaskInput
        inputValue={newTask.text}
        handleInputChange={handleInputChange}
        addTask={addTask}
        handleKeyDown={createEnterKeyHandler}
      />

      <TaskExtraInfo
        newTask={newTask}
        setNewTask={setNewTask}
        isAddDesc={isAddDesc}
        setIsAddDesc={setIsAddDesc}
        isAddQty={isAddQty}
        setIsAddQty={setIsAddQty}
      />

      <TaskItems
        tasks={tasks}
        finishTask={finishTask}
        deleteTask={deleteTask}
        setEditIndex={setEditIndex}
        setEditText={setEditText}
        editIndex={editIndex}
        editText={editText}
        tasksList={tasks}
        setTasks={setTasks}
        setEditDesc={setEditDesc}
        editDesc={editDesc}
        setEditQty={setEditQty}
        editQty={editQty}
      />
    </div>
  );
}

export default HomePage;