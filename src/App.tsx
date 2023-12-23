import React, { useState, useEffect, useReducer, useMemo, ChangeEvent } from 'react';
import './App.css';

type Task = {
  id: number;
  text: string;
  completed: boolean;
  category: string;
};

type Action =
  | { type: 'ADD_CATEGORY'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'EDIT_TASK'; payload: { id: number; newText: string } }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'TOGGLE_TASK'; payload: number };

const categoriesReducer = (state: string[], action: Action): string[] => {
  switch (action.type) {
    case 'ADD_CATEGORY':
      return [...state, action.payload];
    default:
      return state;
  }
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Create a new task', completed: false, category: 'Personal' },
    { id: 2, text: 'Edit existing task', completed: false, category: 'Work' },
    { id: 3, text: 'Delete task', completed: false, category: 'Personal' },
  ]);

  const [newTask, setNewTask] = useState<string>('');
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [categories, dispatchCategories] = useReducer(categoriesReducer, ['Personal', 'Work']);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortCriteria, setSortCriteria] = useState<string>('id');

  const handleAddTask = () => {
    if (newTask.trim() === '') {
      return;
    }

    const newTaskObject: Task = {
      id: tasks.length + 1,
      text: newTask,
      completed: false,
      category: 'Personal', // Default category
    };

    setTasks([...tasks, newTaskObject]);
    setNewTask('');
  };

  const handleEditTask = (taskId: number) => {
    setEditingTask(taskId);
  };

  const handleSaveEdit = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleSelectTask = (taskId: number) => {
    setSelectedTask(tasks.find((task) => task.id === taskId) || null);
  };

  const handleAddCategory = (newCategory: string) => {
    dispatchCategories({ type: 'ADD_CATEGORY', payload: newCategory });
  };

  const handleToggleTask = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(e.target.value);
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (sortCriteria === 'text') {
        return a.text.localeCompare(b.text);
      } else if (sortCriteria === 'category') {
        return a.category.localeCompare(b.category);
      } else {
        return a.id - b.id;
      }
    });
  }, [tasks, sortCriteria]);

  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedTasks, searchTerm]);

  return (
    <div className="App">
      <h1>Task Manager</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search for tasks"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </div>

      <div>
        <label>Sort by:</label>
        <select value={sortCriteria} onChange={handleSortChange}>
          <option value="id">ID</option>
          <option value="text">Text</option>
          <option value="category">Category</option>
        </select>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            {editingTask === task.id ? (
              <>
                <input
                  type="text"
                  value={task.text}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTasks((prevTasks) =>
                      prevTasks.map((t) =>
                        t.id === task.id ? { ...t, text: e.target.value } : t
                      )
                    )
                  }
                />
                <button onClick={handleSaveEdit}>Save</button>
              </>
            ) : (
              <>
                {task.completed ? <s>{task.text}</s> : task.text} - {task.category}
                <button onClick={() => handleEditTask(task.id)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                <button onClick={() => handleSelectTask(task.id)}>View Details</button>
                <button onClick={() => handleToggleTask(task.id)}>
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div>
        <input
          type="text"
          placeholder="Enter a new category"
          onChange={(e: ChangeEvent<HTMLInputElement>) => e.preventDefault()}
        />
        <button onClick={() => handleAddCategory('New Category')}>Add Category</button>
      </div>

      <div>
        <h2>Categories:</h2>
        <ul>
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
