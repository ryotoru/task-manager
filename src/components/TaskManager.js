import React, { useState, useCallback } from 'react';
import { getTaskColor, getResourceLink } from '../utils/helpers';

const TaskManager = ({ date, tasks, setTasks, unavailableDays, setUnavailableDays }) => {
  const [newTask, setNewTask] = useState('');
  const [selectedHour, setSelectedHour] = useState('09:00');
  const [newResourceLink, setNewResourceLink] = useState('');

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks(prev => ({
        ...prev,
        [date.toDateString()]: [
          ...(prev[date.toDateString()] || []),
          { id: Date.now().toString(), text: newTask, completed: false, time: selectedHour, reminder: null, resourceLink: newResourceLink }
        ].slice(0, 15)
      }));
      setNewTask('');
      setNewResourceLink('');
    }
  }, [newTask, selectedHour, date, setTasks, newResourceLink]);

  const toggleTask = useCallback((taskId) => {
    setTasks(prev => ({
      ...prev,
      [date.toDateString()]: prev[date.toDateString()].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  }, [date, setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => ({
      ...prev,
      [date.toDateString()]: prev[date.toDateString()].filter(task => task.id !== taskId)
    }));
  }, [date, setTasks]);

  const setReminder = useCallback((taskId, minutes) => {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + minutes * 60000);
    setTasks(prev => ({
      ...prev,
      [date.toDateString()]: prev[date.toDateString()].map(task =>
        task.id === taskId ? { ...task, reminder: reminderTime.toISOString() } : task
      )
    }));
  }, [date, setTasks]);

  const shiftTaskTime = useCallback((taskId, newTime) => {
    setTasks(prev => ({
      ...prev,
      [date.toDateString()]: prev[date.toDateString()].map(task =>
        task.id === taskId ? { ...task, time: newTime } : task
      )
    }));
  }, [date, setTasks]);

  const toggleDayAvailability = useCallback(() => {
    setUnavailableDays(prev => {
      const dateString = date.toDateString();
      return prev.includes(dateString)
        ? prev.filter(d => d !== dateString)
        : [...prev, dateString];
    });
  }, [date, setUnavailableDays]);

  const updateResourceLink = useCallback((taskId, newLink) => {
    setTasks(prev => ({
      ...prev,
      [date.toDateString()]: prev[date.toDateString()].map(task =>
        task.id === taskId ? { ...task, resourceLink: newLink } : task
      )
    }));
  }, [date, setTasks]);

  return (
    <div style={{padding: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem', maxHeight: '24rem', overflowY: 'auto'}}>
      <h3 style={{fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{date.toDateString()}</h3>
      <div style={{display: 'flex', marginBottom: '1rem'}}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{flexGrow: 1, padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.25rem 0 0 0.25rem'}}
          placeholder="New task"
        />
        <select
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
          style={{padding: '0.5rem', border: '1px solid #ccc', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}
        >
          {Array.from({ length: 24 }, (_, i) => i).map(hour => (
            <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
              {`${hour.toString().padStart(2, '0')}:00`}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newResourceLink}
          onChange={(e) => setNewResourceLink(e.target.value)}
          style={{flexGrow: 1, padding: '0.5rem', border: '1px solid #ccc', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}
          placeholder="Resource link"
        />
        <button onClick={addTask} style={{padding: '0.5rem', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '0 0.25rem 0.25rem 0'}}>Add</button>
      </div>
      <ul style={{listStyleType: 'none', padding: 0}}>
        {(tasks[date.toDateString()] || []).map(task => (
          <li key={task.id} style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: getTaskColor(task.text)}}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              style={{marginRight: '0.5rem'}}
            />
            <span style={{flexGrow: 1, textDecoration: task.completed ? 'line-through' : 'none'}}>
              {task.time} - {task.text}
            </span>
            <input
              type="text"
              value={task.resourceLink}
              onChange={(e) => updateResourceLink(task.id, e.target.value)}
              style={{padding: '0.25rem', border: '1px solid #ccc', borderRadius: '0.25rem', marginRight: '0.5rem'}}
              placeholder="Resource link"
            />
            <select
              onChange={(e) => shiftTaskTime(task.id, e.target.value)}
              value={task.time}
              style={{padding: '0.25rem', border: '1px solid #ccc', borderRadius: '0.25rem', marginRight: '0.5rem'}}
            >
              {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>
            <button onClick={() => setReminder(task.id, 15)} style={{padding: '0.25rem', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '0.25rem', marginRight: '0.25rem'}}>15m</button>
            <button onClick={() => setReminder(task.id, 30)} style={{padding: '0.25rem', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '0.25rem', marginRight: '0.25rem'}}>30m</button>
            <button onClick={() => deleteTask(task.id)} style={{padding: '0.25rem', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '0.25rem'}}>Delete</button>
          </li>
        ))}
      </ul>
      <button
        onClick={toggleDayAvailability}
        style={{
          marginTop: '1rem',
          padding: '0.5rem',
          backgroundColor: unavailableDays.includes(date.toDateString()) ? '#EF4444' : '#9CA3AF',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem'
        }}
      >
        {unavailableDays.includes(date.toDateString()) ? 'Mark as Available' : 'Mark as Unavailable'}
      </button>
    </div>
  );
};

export default TaskManager;

