function TaskInput({inputValue, handleInputChange, addTask, handleKeyDown}) {
  return (
    <div className="task-input-container">
      <input
        type="text"
        placeholder="Enter a task..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown(addTask)}
      />

      <button
        className="add-button"
        onClick={addTask}
      >
        +
      </button>
    </div>
  );
}

export default TaskInput;