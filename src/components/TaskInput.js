function TaskInput({inputValue, onInputChange, onAddClick, handleKeyDown}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter a task..."
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleKeyDown(onAddClick)}
      />

      <button
        className="add-button"
        onClick={onAddClick}
      >
        +
      </button>
    </div>
  );
}

export default TaskInput;