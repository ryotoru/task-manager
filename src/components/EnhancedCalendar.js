import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { generateInitialTasks, getTaskColor } from '../utils/helpers';
import TaskManager from './TaskManager';

const EnhancedCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useLocalStorage('tasks', generateInitialTasks());
  const [unavailableDays, setUnavailableDays] = useLocalStorage('unavailableDays', []);

  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      Object.entries(tasks).forEach(([dateString, dateTasks]) => {
        dateTasks.forEach(task => {
          if (task.reminder && new Date(task.reminder) <= now) {
            alert(`Reminder: ${task.text}`);
            setTasks(prev => ({
              ...prev,
              [dateString]: prev[dateString].map(t =>
                t.id === task.id ? { ...t, reminder: null } : t
              )
            }));
          }
        });
      });
    }, 60000);

    return () => clearInterval(checkReminders);
  }, [tasks, setTasks]);

  const renderCalendar = useCallback(() => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toDateString();
      const isUnavailable = unavailableDays.includes(dateString);
      days.push(
        <div
          key={day}
          className={`border p-1 h-24 overflow-hidden ${isUnavailable ? 'bg-red-100' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="font-bold">{day}</div>
          <ul className="text-xs">
            {(tasks[dateString] || []).slice(0, 3).map(task => (
              <li key={task.id} className={`${task.completed ? 'line-through' : ''} ${getTaskColor(task.text)} p-1 rounded mb-1`}>
                {task.text}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return days;
  }, [currentDate, tasks, unavailableDays, setSelectedDate]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>Previous</button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>Next</button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-bold text-center">{day}</div>
        ))}
        {renderCalendar()}
      </div>
      <TaskManager
        date={selectedDate}
        tasks={tasks}
        setTasks={setTasks}
        unavailableDays={unavailableDays}
        setUnavailableDays={setUnavailableDays}
      />
      <div className="p-4 border-t">
        <h4 className="font-bold mb-2">Color Legend</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-blue-200 p-2 rounded">Programming / Practical</div>
          <div className="bg-green-200 p-2 rounded">Specialized Knowledge</div>
          <div className="bg-yellow-200 p-2 rounded">Algorithms</div>
          <div className="bg-purple-200 p-2 rounded">GATE Preparation</div>
          <div className="bg-red-200 p-2 rounded">Cryptography (FHE/ZKP/MPC)</div>
          <div className="bg-gray-200 p-2 rounded">Other</div>
          <div className="bg-indigo-200 p-2 rounded">Surprise: Academic</div>
          <div className="bg-pink-200 p-2 rounded">Surprise: Personal</div>
          <div className="bg-orange-200 p-2 rounded">Surprise: Project</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCalendar;

