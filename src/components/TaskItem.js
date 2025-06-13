function TaskItem({taskItem, taskIndex, onFinishClick, onDeleteClick, onEditIndexClick, onEditTextClick, onEditTaskIndex, editTextValue, tasksList, saveEditedTask}) {
  return (
    <li className={`to-do-list-item ${taskItem.finished === "complete" ? "crossed" : ""}`} key={taskIndex}>
      <button
        className={`check-item-button ${taskItem.finished === "complete" ? "crossed" : ""}`}
        onClick={() => {
          onFinishClick(taskIndex);
        }}
      >
        ✔️
      </button>
      <span className={`text ${taskItem.finished === "complete" ? "crossed" : ""}`}>{taskItem.text}</span>
      <button
        className="delete-button"
        onClick={() => {
          onDeleteClick(taskIndex)
        }}
      >
        🗑️
      </button>
      <button
        className="edit-button"
        onClick={() => {
          onEditIndexClick(taskIndex);
          onEditTextClick(taskItem.text);
        }}
      >
        ✏️
      </button>

      {onEditTaskIndex === taskIndex && (
        <div className="edit-task">
          <input className="input-field" value={editTextValue} type='text' onChange={(e) => onEditTextClick(e.target.value)}/>
          <button className="cancel-button" onClick={() => onEditIndexClick(-1)}>✖️</button>
          <button className="save-button" onClick={() => {
            const updatedTasks = [...tasksList];
            updatedTasks[taskIndex] = {text: editTextValue, finished: 'incomplete'};
            saveEditedTask(updatedTasks);
            onEditIndexClick(-1);
          }}>✔️</button>
        </div>
      )}
    </li>
  );
}

export default TaskItem;