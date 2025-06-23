import TaskItem from "./TaskItem.js";

function TaskItems({ finishTask, deleteTask, setEditIndex, setEditText, editIndex, editText, tasks, setTasks, editDesc, setEditDesc, editQty, setEditQty }) {
  return (
    <ol>
      {tasks.map((task, index) => {
        return (
          <TaskItem 
            task={task} 
            index={index} 
            finishTask={finishTask} 
            deleteTask={deleteTask} 
            setEditIndex={setEditIndex} setEditText={setEditText} 
            editIndex={editIndex} 
            editText={editText} 
            tasksList={tasks} 
            setTasks={setTasks} 
            setEditDesc={setEditDesc} 
            editDesc={editDesc} 
            setEditQty={setEditQty} 
            editQty={editQty} 
          />
        );
      })}
    </ol>
  );
}

export default TaskItems;