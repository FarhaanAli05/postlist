function TaskExtraInfo({ newTask, setNewTask, isAddDesc, setIsAddDesc, isAddQty, setIsAddQty }) {
  return (
    <div className="new-task-extra-info">
      {isAddDesc ? 
        (
          <textarea className="input-field description new-task" value={newTask.description} placeholder="Add description" type='text' onChange={(e) => setNewTask({text: newTask.text, finished: 'incomplete', description: e.target.value, quantity: newTask.quantity})}/>
        ) : (
          <div className="add-description" onClick={() => setIsAddDesc(true)}>+ Add description</div>
        )
      }
      {isAddQty ? 
        (
          <div className="quantity-new-task">
            <label className="quantity-label-new-task" for="quantity-field">Quantity:</label>
            <input className="input-field quantity" id="quantity-field" type="number" placeholder="0" value={newTask.quantity} onChange={
              (e) => {
                setNewTask({
                  text: newTask.text, finished: 'incomplete', description: newTask.description, quantity: e.target.value
                })
              }
            }/>
          </div>
        ) : (
          <div className="add-quantity" onClick={() => setIsAddQty(true)}>+ Add quantity</div>
        )
      }
    </div>
  );
}

export default TaskExtraInfo;