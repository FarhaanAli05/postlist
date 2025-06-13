import { useState } from 'react';
import TaskInput from './TaskInput.js';
import TaskItem from './TaskItem.js';

function ToDoList() {
  // const [tasks, setTasks] = useState([{'text': "Go to the gym", 'finished': "incomplete"}, {'text': "Have breakfast", 'finished': "incomplete"}, {'text': "Begin homework", 'finished': "incomplete"}]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({});
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState("");

  function handleInputChange(e) {
    setNewTask({text: e.target.value, finished: 'incomplete'});
  }

  function addTask() {
    if (newTask.text && newTask.text.trim() !== "") {
      setTasks(prevTasks => [...prevTasks, newTask]);
      setNewTask({text: "", finished: 'incomplete'});
    }
  }

  function deleteTask(index) {
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

  function finishTask(index) {
    tasks.map((_, i) => {
      if (i === index) {
        const updatedTasks = [...tasks];
        if (updatedTasks[i].finished === "incomplete") {
          updatedTasks[i].finished = "complete";
        } else if (updatedTasks[i].finished === "complete") {
          updatedTasks[i].finished = "incomplete";
        }
        setTasks(updatedTasks);
      }
    });
  }

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      <TaskInput 
        inputValue={newTask.text}
        onInputChange={handleInputChange}
        onAddClick={addTask}
      />

      <ol>
        {tasks.map((task, index) => {
          return (
            <TaskItem taskItem={task} taskIndex={index} onFinishClick={finishTask} onDeleteClick={deleteTask} onEditIndexClick={setEditIndex} onEditTextClick={setEditText} onEditTaskIndex={editIndex} editTextValue={editText} tasksList={tasks} saveEditedTask={setTasks}/>
          );
        })}
      </ol>
    </div>
  );
}

export default ToDoList;