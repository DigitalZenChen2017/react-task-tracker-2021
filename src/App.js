import React from 'react'
import { useState, useEffect } from 'react'
import './App.css';
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

const App = () => {
    const [showAddTask, setShowAddTask] = useState(false)

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
      const getTasks = async () => {
        const tasksFromServer = await fetchTasks()
        setTasks(tasksFromServer)
      }
      getTasks()
    }, [])

    // Fetch Tasks
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json()

      console.log(data)
      return data
    }

    // Add Task
    const addTask = async (task) => {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
      })
      const data = await res.json();
      console.log(data)
      setTasks([...tasks, data])
    }

    // Delete Task
    const deleteTask = async (id) => { 
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE'
      })
      setTasks(tasks.filter((task) => task.id !== id ))
    }

    // Toggle Reminder On/Off
    const toggleReminder = (id) => {
      setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: !task.reminder} : task))
    }

  return (
    <div className='container'>
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      {showAddTask && <AddTask onAdd={addTask} /> }
      {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> : 'No Tasks Left.'}
    </div>
  )
}


export default App;
