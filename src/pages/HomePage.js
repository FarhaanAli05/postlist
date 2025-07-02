import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import Cookies from 'js-cookie';
import TaskInput from '../components/TaskInput.js';
import TaskItems from '../components/TaskItems.js';
import TaskExtraInfo from '../components/TaskExtraInfo.js';

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
      const token = Cookies.get('access_token');

      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setTasks(data);
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
      const token = Cookies.get('access_token');
      const safeTask = { ...newTask, quantity: !newTask.quantity ? 0 : newTask.quantity }
      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(safeTask)
      });
      const data = await response.json();
      setTasks(data);
      setNewTask({ text: "", finished: 'incomplete', description: '', quantity: 0 });
      setIsAddDesc(false);
      setIsAddQty(false);
    }
  }

  async function deleteTask(index) {
    const token = Cookies.get('access_token');
    await fetch(`http://localhost:8000/api/tasks/${index}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  async function finishTask(index) {
    const token = Cookies.get('access_token');
    const response = await fetch(`http://localhost:8000/api/tasks/${index}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setTasks(data);
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