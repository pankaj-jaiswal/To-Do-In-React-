import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';

function App() {
  const TASKS_KEY = 'tasks';
  const [inputValue, setInputValue] = useState('');
  const [taskValue, setTaskValue] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(TASKS_KEY));
      if (Array.isArray(storedTasks)) {
        setTaskValue(storedTasks);
      }
    } catch (error) {
      console.error('Failed to parse tasks from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(taskValue));
  }, [taskValue]);

  const handleTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        isCompleted: false,
      };
      setTaskValue([...taskValue, newTask]);
      setInputValue('');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = taskValue.filter((task) => task.id !== id);
    setTaskValue(updatedTasks);
  };

  const toggleTaskCompletion = (id) => {
    setTaskValue(
      taskValue.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const filteredTasks = taskValue
    .filter((task) => {
      if (filter === 'All') return true;
      if (filter === 'Active') return !task.isCompleted;
      if (filter === 'Completed') return task.isCompleted;
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container m-5">
      <h2>To-Do List</h2>
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter the task"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="btn btn-primary" type="button" onClick={handleTask}>
          + Add
        </button>
      </div>

      {/* Filter buttons */}
      <div className="my-3">
        <button
          className={`btn btn-outline-${filter === 'All' ? 'primary' : 'secondary'} mx-2`}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        <button
          className={`btn btn-outline-${filter === 'Active' ? 'primary' : 'secondary'} mx-2`}
          onClick={() => setFilter('Active')}
        >
          Active
        </button>
        <button
          className={`btn btn-outline-${filter === 'Completed' ? 'primary' : 'secondary'} mx-2`}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </button>
      </div>

      {/* Search input */}
      <div className="d-flex flex-row-reverse mt-3">
        <input
          type="text"
          name="searchInput"
          id="searchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by task"
          className="form-control w-25 "
        />
      </div>

      {/* Task list */}
      <div className="mt-5">
        <h2>Task List</h2>
        <ul className="list-group">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span
                  onClick={() => toggleTaskCompletion(task.id)}
                  style={{
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                    cursor: 'pointer',
                    flexGrow: 1,
                  }}
                >
                  {task.text}
                </span>
                <button
                  className="btn btn-danger btn-sm ms-3 p-1"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li className="list-group-item">No tasks found</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
