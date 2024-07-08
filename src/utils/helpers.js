export const getTaskColor = (taskText) => {
  if (taskText.includes("Programming") || taskText.includes("Practical Application")) {
    return "#BFDBFE"; // blue-200
  } else if (taskText.includes("Specialized Knowledge")) {
    return "#BBF7D0"; // green-200
  } else if (taskText.includes("Algorithms")) {
    return "#FEF08A"; // yellow-200
  } else if (taskText.includes("GATE")) {
    return "#E9D5FF"; // purple-200
  } else if (taskText.includes("FHE") || taskText.includes("ZKP") || taskText.includes("MPC")) {
    return "#FECACA"; // red-200
  } else if (taskText.includes("Surprise: Academic")) {
    return "#C7D2FE"; // indigo-200
  } else if (taskText.includes("Surprise: Personal")) {
    return "#FBCFE8"; // pink-200
  } else if (taskText.includes("Surprise: Project")) {
    return "#FED7AA"; // orange-200
  } else {
    return "#E5E7EB"; // gray-200
  }
};

export const getResourceLink = (taskText) => {
  if (taskText.includes("Programming")) {
    return "https://www.youtube.com/watch?v=rfscVS0vtbw";
  } else if (taskText.includes("Specialized Knowledge")) {
    return "https://doc.rust-lang.org/book/";
  } else if (taskText.includes("Algorithms")) {
    return "https://www.coursera.org/specializations/algorithms";
  } else if (taskText.includes("GATE")) {
    return "https://gate.iitk.ac.in/gate_syllabus.html";
  } else if (taskText.includes("FHE")) {
    return "https://eprint.iacr.org/2011/232.pdf";
  } else if (taskText.includes("ZKP")) {
    return "https://zkproof.org/";
  } else if (taskText.includes("MPC")) {
    return "https://eprint.iacr.org/2020/300.pdf";
  } else {
    return "";
  }
};

export const generateInitialTasks = () => {
  const tasks = {};
  const startDate = new Date();
  for (let i = 0; i < 126; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const dateString = currentDate.toDateString();
    const weekNumber = Math.floor(i / 7);
    
    tasks[dateString] = [
      { id: `${dateString}-1`, text: "Programming Language / Specialized Knowledge", time: "10:00", completed: false, resourceLink: getResourceLink("Programming") },
      { id: `${dateString}-2`, text: "Specialized Knowledge / Practical Applications", time: "13:30", completed: false, resourceLink: getResourceLink("Specialized Knowledge") },
      { id: `${dateString}-3`, text: "Practical Application", time: "17:00", completed: false, resourceLink: getResourceLink("Programming") },
      { id: `${dateString}-4`, text: "Algorithms (Light revision)", time: "21:00", completed: false, resourceLink: getResourceLink("Algorithms") },
      { id: `${dateString}-5`, text: "GATE Preparation", time: "21:30", completed: false, resourceLink: getResourceLink("GATE") },
      { id: `${dateString}-6`, text: "ZKP, FHE, and MPC Deep Dive", time: "23:30", completed: false, resourceLink: getResourceLink("ZKP") }
    ];

    if (dayOfWeek >= 1 && dayOfWeek <= 3) {
      tasks[dateString].push({ id: `${dateString}-7`, text: "FHE Theory", time: "10:00", completed: false, resourceLink: getResourceLink("FHE") });
    } else if (dayOfWeek >= 4 && dayOfWeek <= 5) {
      tasks[dateString].push({ id: `${dateString}-7`, text: "ZKP Theory", time: "10:00", completed: false, resourceLink: getResourceLink("ZKP") });
    } else if (dayOfWeek === 6) {
      tasks[dateString].push({ id: `${dateString}-7`, text: "MPC Theory", time: "10:00", completed: false, resourceLink: getResourceLink("MPC") });
    }

    if (weekNumber < 4) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Mathematics", time: "21:30", completed: false, resourceLink: getResourceLink("GATE") });
    } else if (weekNumber < 8) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Core Computer Science", time: "21:30", completed: false, resourceLink: getResourceLink("GATE") });
    } else if (weekNumber < 12) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Advanced Subjects", time: "21:30", completed: false, resourceLink: getResourceLink("GATE") });
    } else if (weekNumber < 16) {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Specialized Topics", time: "21:30", completed: false, resourceLink: getResourceLink("GATE") });
    } else {
      tasks[dateString].push({ id: `${dateString}-8`, text: "GATE: Revision and Mock Tests", time: "21:30", completed: false, resourceLink: getResourceLink("GATE") });
    }
  }
  return tasks;
};

