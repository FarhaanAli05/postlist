import {useState, useEffect} from 'react';
import TaskInput from './TaskInput.js';
import TaskItem from './TaskItem.js';

function ToDoList() {
  // const [tasks, setTasks] = useState([{'text': "Go to the gym", 'finished': "incomplete"}, {'text': "Have breakfast", 'finished': "incomplete"}, {'text': "Begin homework", 'finished': "incomplete"}]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://127.0.0.1:5000/tasks');
      const data = await response.json();
      setTasks(data);
    }
    fetchData();
  }, []);

  function handleInputChange(e) {
    setNewTask({text: e.target.value, finished: 'incomplete'});
  }

  const createEnterKeyHandler = (callbackFunction) => (e) => {
    if (e.key === 'Enter') {
      callbackFunction();
    }
  }

  async function addTask() {
    if (newTask.text && newTask.text.trim() !== "") {
      const response = await fetch('http://127.0.0.1:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });
      const data = await response.json();
      setTasks(data);
      setNewTask({text: "", finished: 'incomplete'});
    }
  }

  async function deleteTask(index) {
    await fetch(`http://127.0.0.1:5000/tasks/${index}`, {
      method: 'DELETE'
    });
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

/*
  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }
  */

  async function finishTask(index) {
    const response = await fetch(`http://127.0.0.1:5000/tasks/${index}`, {
      method: 'POST'
    });
    const data = await response.json();
    setTasks(data);
  }

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      <TaskInput 
        inputValue={newTask.text}
        onInputChange={handleInputChange}
        onAddClick={addTask}
        handleKeyDown={createEnterKeyHandler}
      />

      <ol>
        {tasks.map((task, index) => {
          return (
            <TaskItem taskItem={task} taskIndex={index} onFinishClick={finishTask} onDeleteClick={deleteTask} onEditIndexClick={setEditIndex} onEditTextClick={setEditText} onEditTaskIndex={editIndex} editTextValue={editText} tasksList={tasks} saveEditedTask={setTasks} />
          );
        })}
      </ol>
    </div>
  );
}

export default ToDoList;