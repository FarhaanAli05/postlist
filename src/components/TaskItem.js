function TaskItem({ task, index, finishTask, deleteTask, setEditIndex, setEditText, editIndex, editText, tasks, setTasks, editDesc, setEditDesc, editQty, setEditQty }) {
  return (
    <div className="to-do-list-item-container">
      <span className="serial-number">{index + 1}. </span>
      <li className={`to-do-list-item ${task.finished === "complete" ? "crossed" : ""}`} key={index}>
        <button
          className={`check-item-button ${editIndex === index ? "hidden" : ""} ${task.finished === "complete" ? "crossed" : ""}`}
          onClick={() => {
            finishTask(index);
          }}
        >
          ✔️
        </button>
        <span className={`text ${task.finished === "complete" ? "crossed" : ""} ${editIndex === index ? "hidden" : ""}`}>{task.text}</span>
        <button
          className={`delete-button ${editIndex === index ? "hidden" : ""}`}
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this item?')) {
              deleteTask(index)
              setEditIndex(-1);
            }
          }}
        >
          🗑️
        </button>
        <button
          className={`edit-button ${editIndex === index ? "hidden" : ""}`}
          onClick={() => {
            setEditIndex(index);
            setEditText(task.text);
            setEditDesc(task.description);
            setEditQty(task.quantity);
          }}
        >
          ✏️
        </button>

        {editIndex === index && (
          <div className="edit-task">
            <div className="edit-title">
              <input className="input-field title" value={editText} placeholder="Add task" type='text' onChange={(e) => setEditText(e.target.value)} />
              <div>
                <button className="cancel-button" onClick={() => setEditIndex(-1)}>✖️</button>
                <button className="save-button" onClick={async () => {
                  if (editText.trim("") === "") {
                    setEditIndex(-1);
                  } else {
                    const qtyToSend = !editQty ? 0 : editQty;
                    const response = await fetch(`http://localhost:8000/api/tasks/edit/${index}/`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(
                        { text: editText, finished: '', description: editDesc, quantity: qtyToSend })
                    });
                    const data = await response.json();
                    setTasks(data);
                    setEditIndex(-1);
                  }
                }}>✔️</button>
              </div>
            </div>
            <div className="description-container">
              <textarea className="input-field description" value={editDesc} placeholder="Add description" type='text' onChange={(e) => setEditDesc(e.target.value)} />
            </div>
            <div className="quantity-container">
              <label className="quantity-label" for="quantity-field">Quantity:</label>
              <input className="input-field quantity" id="quantity-field" type="number" placeholder="0" value={editQty} onChange={(e) => setEditQty(e.target.value)} />
            </div>
          </div>
        )}

        <div className={`extra-info-container ${editIndex === index ? "hidden" : ""}`}>
          {task.quantity > 0 ? (
            <div className="quantity">
              <span className={`quantity-text ${task.finished === "complete" ? "crossed" : ""}`}>Qty: {task.quantity}</span>
            </div>
          ) : (<></>)}
          {task.description ? (
            <div className={`description ${task.finished === "complete" ? "crossed" : ""}`} key={index}>
              <div className='description-box'>
                <span className='description-text'>{task.description}</span>
              </div>
            </div>
          ) : (<></>)}
        </div>
      </li>
    </div>
  );
}

export default TaskItem;