function TaskItem({taskItem, taskIndex, onFinishClick, onDeleteClick, onEditIndexClick, onEditTextClick, onEditTaskIndex, editTextValue, tasksList, saveEditedTask, editDescValue, onEditDescClick}) {
  return (
    <div className="to-do-list-item-container">
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
            onEditIndexClick(-1);
          }}
        >
          🗑️
        </button>
        <button
          className="edit-button"
          onClick={() => {
            onEditIndexClick(taskIndex);
            onEditTextClick(taskItem.text);
            onEditDescClick(taskItem.description);
          }}
        >
          ✏️
        </button>

        {onEditTaskIndex === taskIndex && (
          <div className="edit-task">
            <input className="input-field" value={editTextValue} placeholder="Add task" type='text' onChange={(e) => onEditTextClick(e.target.value)}/>
            <button className="cancel-button" onClick={() => onEditIndexClick(-1)}>✖️</button>
            <button className="save-button" onClick={async () => {
              if (editTextValue.trim("") === "") {
                onEditIndexClick(-1);
              } else {
                const response = await fetch(`http://127.0.0.1:5000/tasks/edit/${taskIndex}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify([editTextValue, editDescValue])
                });
                const data = await response.json();
                saveEditedTask(data);
                onEditIndexClick(-1);
              }
            }}>✔️</button>
            <div className="edit-description">
              <input className="input-field" value={editDescValue} placeholder="Add description" type='text' onChange={(e) => onEditDescClick(e.target.value)}/>
            </div>
          </div>
        )}
      </li>
      {taskItem.description ? (
      <div className="description">
        <div className={`to-do-list-item ${taskItem.finished === "complete" ? "crossed" : ""}`} key={taskIndex}>
          <span className={`description ${taskItem.finished === "complete" ? "crossed" : ""}`}>{taskItem.description}</span>
        </div>
      </div>
      ) : (<></>)}
    </div>
  );
}

export default TaskItem;