function TaskItem({taskItem, taskIndex, onFinishClick, onDeleteClick, onEditIndexClick, onEditTextClick, onEditTaskIndex, editTextValue, tasksList, saveEditedTask, editDescValue, onEditDescClick, editQtyValue, onEditQtyClick}) {
  return (
    <div className="to-do-list-item-container">
      <span className="serial-number">{taskIndex + 1}. </span>
      <li className={`to-do-list-item ${taskItem.finished === "complete" ? "crossed" : ""}`} key={taskIndex}>
        <button
          className={`check-item-button ${onEditTaskIndex === taskIndex ? "hidden" : ""} ${taskItem.finished === "complete" ? "crossed" : ""}`}
          onClick={() => {
            onFinishClick(taskIndex);
          }}
        >
          ✔️
        </button>
        <span className={`text ${taskItem.finished === "complete" ? "crossed" : ""} ${onEditTaskIndex === taskIndex ? "hidden" : ""}`}>{taskItem.text}</span>
        <button
          className={`delete-button ${onEditTaskIndex === taskIndex ? "hidden" : ""}`}
          onClick={() => {
            onDeleteClick(taskIndex)
            onEditIndexClick(-1);
          }}
        >
          🗑️
        </button>
        <button
          className={`edit-button ${onEditTaskIndex === taskIndex ? "hidden" : ""}`}
          onClick={() => {
            onEditIndexClick(taskIndex);
            onEditTextClick(taskItem.text);
            onEditDescClick(taskItem.description);
            onEditQtyClick(taskItem.quantity);
          }}
        >
          ✏️
        </button>

        {onEditTaskIndex === taskIndex && (
          <div className="edit-task">
            <div className="edit-title">
              <input className="input-field title" value={editTextValue} placeholder="Add task" type='text' onChange={(e) => onEditTextClick(e.target.value)}/>
              <div>
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
                      body: JSON.stringify([editTextValue, editDescValue, editQtyValue])
                    });
                    const data = await response.json();
                    saveEditedTask(data);
                    onEditIndexClick(-1);
                  }
                }}>✔️</button>
              </div>
            </div>
            <div className="description-container">
              <textarea className="input-field description" value={editDescValue} placeholder="Add description" type='text' onChange={(e) => onEditDescClick(e.target.value)}/>
            </div>
            <div className="quantity-container">
              <label className="quantity-label" for="quantity-field">Quantity:</label>
              <input className="input-field quantity" id="quantity-field" type="number" placeholder="0" value={editQtyValue} onChange={(e) => onEditQtyClick(e.target.value)}/>
            </div>
          </div>
        )}

        <div className={`extra-info-container ${onEditTaskIndex === taskIndex ? "hidden" : ""}`}>
          {taskItem.quantity > 0 ? (
          <div className="quantity">
            <span className={`quantity-text ${taskItem.finished === "complete" ? "crossed" : ""}`}>Qty: {taskItem.quantity}</span>
          </div>
          ) : (<></>)}
          {taskItem.description ? (
          <div className={`description ${taskItem.finished === "complete" ? "crossed" : ""}`} key={taskIndex}>
            <div className='description-box'>
              <span className='description-text'>{taskItem.description}</span>
            </div>
          </div>
          ) : (<></>)}
        </div>
      </li>
    </div>
  );
}

export default TaskItem;