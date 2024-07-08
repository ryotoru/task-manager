import React, { useState, useEffect, useCallback } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

const getTaskColor = (taskText) => {
  if (taskText.includes("Programming") || taskText.includes("Practical Application")) {
    return "bg-blue-200";
  } else if (taskText.includes("Specialized Knowledge")) {
    return "bg-green-200";
  } else if (taskText.includes("Algorithms")) {
    return "bg-yellow-200";
  } else if (taskText.includes("GATE")) {
    return "bg-purple-200";
  } else if (taskText.includes("FHE") || taskText.includes("ZKP") || taskText.includes("MPC")) {
    return "bg-red-200";
  } else {
    return "bg-gray-200";
  }
};

const generateInitialTasks = () => {
  const tasks = {};
  const startDate = new Date();
  for (let i = 0; i < 126; i++) { // 18 weeks
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const dateString = currentDate.toDateString();
    const weekNumber = Math.floor(i / 7);
    
    tasks[dateString] = [
      { id: `${dateString}-1`, text: "Programming Language / Specialized Knowledge", time: "10:00", completed: false },
      { id: `${dateString}-2`, text: "Specialized Knowledge / Practical Applications", time: "13:30", completed: false },
      { id: `${dateString}-3`, text: "Practical Application", time: "17:00", completed: false },
      { id: `${dateString}-4`, text: "Algorithms (Light revision)", time: "21:00", completed: false },
      { id: `${dateString}-5`, text: "GATE Preparation", time: "21:30", completed: false },
      { id: `${dateString}-6`, text: "ZKP, FHE, and MPC Deep Dive", time: "23:30", completed: false }
    ];

    // Add specific tasks based on the day of the week
    if (dayOfWeek >= 1 && dayOfWeek <= 3) { // Monday to Wednesday
      tasks[dateString].push({ id: `${dateString}-7`, text: "FHE Theory", time: "10:00", completed: false });
    } else if (dayOfWeek >= 4 && dayOfWeek <= 5) { // Thursday to Friday
      tasks[dateString].push({ id: `${dateString}-7`, text: "ZKP Theory", time: "10:00", completed: false });
    } else if (dayOfWeek === 6) { // Saturday
      tasks[dateString].push({ id: `${dateString}-7`, text: "MPC Theory", time: "10:00", completed: false });
    }

    // Add GATE preparation specific tasks
    if (weekNumber < 4) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Mathematics", time: "21:30", completed: false });
    } else if (weekNumber < 8) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Core Computer Science", time: "21:30", completed: false });
    } else if (weekNumber < 12) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Advanced Subjects", time: "21:30", completed: false });
    } else if (weekNumber < 16) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Specialized Topics", time: "21:30", completed: false });
    } else {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Revision and Mock Tests", time: "21:30", completed: false });
    }
  }
  return tasks;
};

const TaskManager = ({ date, tasks, setTasks, unavailableDays, setUnavailableDays }) => {
  const [newTask, setNewTask] = useState('');
  const [selectedHour, setSelectedHour] = useState('09:00');

  const addTask = useCallback(() => {
    if (newTask.trim()) {
      setTasks(prev => ({
        ...prev,
        [date.toDateString()]: [
          ...(prev[date.toDateString()] || []),
          { id: Date.now().toString(), text: newTask, completed: false, time: selectedHour, reminder: null }
        ].slice(0, 15) // Limit to 15 tasks per day to prevent overflow
      }));
      setNewTask('');
    }
  }, [newTask, selectedHour, date, setTasks]);

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

  return (
    <div className="p-4 border rounded shadow-sm max-h-96 overflow-y-auto">
      <h3 className="text-lg font-bold mb-2">{date.toDateString()}</h3>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="New task"
        />
        <select
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.target.value)}
          className="p-2 border-t border-b"
        >
          {Array.from({ length: 24 }, (_, i) => i).map(hour => (
            <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
              {`${hour.toString().padStart(2, '0')}:00`}
            </option>
          ))}
        </select>
        <button onClick={addTask} className="p-2 bg-blue-500 text-white rounded-r">Add</button>
      </div>
      <ul className="space-y-2">
        {(tasks[date.toDateString()] || []).map(task => (
          <li key={task.id} className={`flex items-center space-x-2 p-2 rounded ${getTaskColor(task.text)}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="form-checkbox"
            />
            <span className={`flex-grow ${task.completed ? 'line-through' : ''}`}>
              {task.time} - {task.text}
            </span>
            <select
              onChange={(e) => shiftTaskTime(task.id, e.target.value)}
              value={task.time}
              className="p-1 border rounded"
            >
              {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                  {`${hour.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>
            <button onClick={() => setReminder(task.id, 15)} className="p-1 bg-green-500 text-white rounded">15m</button>
            <button onClick={() => setReminder(task.id, 30)} className="p-1 bg-green-500 text-white rounded">30m</button>
            <button onClick={() => deleteTask(task.id)} className="p-1 bg-red-500 text-white rounded">Delete</button>
          </li>
        ))}
      </ul>
      <button
        onClick={toggleDayAvailability}
        className={`mt-4 p-2 ${unavailableDays.includes(date.toDateString()) ? 'bg-red-500' : 'bg-gray-300'} text-white rounded`}
      >
        {unavailableDays.includes(date.toDateString()) ? 'Mark as Available' : 'Mark as Unavailable'}
      </button>
    </div>
  );
};

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
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-200 p-2 rounded">Programming / Practical</div>
          <div className="bg-green-200 p-2 rounded">Specialized Knowledge</div>
          <div className="bg-yellow-200 p-2 rounded">Algorithms</div>
          <div className="bg-purple-200 p-2 rounded">GATE Preparation</div>
          <div className="bg-red-200 p-2 rounded">FHE / ZKP / MPC</div>
          <div className="bg-gray-200 p-2 rounded">Other</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCalendar;


