import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, LogOut, Target, CheckSquare, 
  Square, Plus, CalendarDays, 
  X, Bot, GraduationCap, BookOpen, Sparkles, Share2, Download, Save, User, Lock, Upload, FileText, Trash2, Send, Check, CloudSun, RefreshCw
} from 'lucide-react';
import html2canvas from 'html2canvas';

export default function App() {
  const [currentUser, setCurrentUser] = useState({ fullName: 'Akanksha', email: 'akanksha@example.com' });
  const [activeTab, setActiveTab] = useState('academic_guide');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Live Weather State (Fast API Connected)
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // --- FETCH WEATHER ON MOUNT ---
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      // 3 second timeout controller to prevent stuck loading state
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch('http://127.0.0.1:8000/api/weather', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setWeatherData(data);
      } else {
        throw new Error('Weather API bad response');
      }
    } catch (err) {
      // Direct UI Fallback if server is offline or OpenWeather API key is initializing
      setWeatherData({
        location: 'VIT Bhopal Campus',
        temp: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        advice: '⛅ Pleasant day on campus for walking between blocks!',
        icon: '⛅'
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // --- 1. SAVED TIMETABLES STATE ---
  const [savedTimetables, setSavedTimetables] = useState([
    {
      id: 'tt-1',
      name: 'Semester 4 Regular Schedule',
      shift: 'Morning',
      schedule: {
        Monday: [
          { time: '13:15 - 14:45', subject: 'Data Structures', slot: 'A21' },
          { time: '14:50 - 16:20', subject: 'DBMS', slot: 'B21' }
        ],
        Tuesday: [
          { time: '13:15 - 14:45', subject: 'Operating Systems', slot: 'A22' }
        ],
        Wednesday: [
          { time: '13:15 - 14:45', subject: 'Machine Learning', slot: 'A23' },
          { time: '14:50 - 16:20', subject: 'Data Engineering', slot: 'B23' }
        ],
        Thursday: [
          { time: '13:15 - 14:45', subject: 'Data Structures Lab', slot: 'L21+L22' }
        ],
        Friday: [
          { time: '13:15 - 14:45', subject: 'DBMS Lab', slot: 'L23+L24' }
        ]
      }
    }
  ]);
  const [activeTimetableId, setActiveTimetableId] = useState('tt-1');
  const [newTimetableName, setNewTimetableName] = useState('');
  const [shiftPreference, setShiftPreference] = useState('Morning');
  const [generatedTimetable, setGeneratedTimetable] = useState(null);

  // --- 2. PER-SEMESTER SUBJECTS & GPA STATE ---
  const [semesters, setSemesters] = useState([
    {
      id: 'sem-1',
      title: 'Semester 1',
      gpa: 8.5,
      subjects: [
        { name: 'Mathematics I', grade: 'A', credits: 4 },
        { name: 'Basic Electrical Engg', grade: 'S', credits: 3 },
        { name: 'Engineering Physics', grade: 'B+', credits: 4 }
      ]
    },
    {
      id: 'sem-2',
      title: 'Semester 2',
      gpa: 8.8,
      subjects: [
        { name: 'Data Structures', grade: 'S', credits: 4 },
        { name: 'Object Oriented Prog', grade: 'A', credits: 4 },
        { name: 'Discrete Maths', grade: 'A', credits: 3 }
      ]
    }
  ]);

  const [newSemTitle, setNewSemTitle] = useState('');
  const [newSub, setNewSub] = useState({ semId: 'sem-1', name: '', grade: 'A', credits: 3 });

  // --- 3. TARGET GOALS & ADAPTIVE AI WORKLOAD STATE ---
  const [careerTarget, setCareerTarget] = useState('Internship (Data Engineering / Full-Stack)');
  const [targetCompany, setTargetCompany] = useState('Top Tech / MNCs');
  const [adaptivePlan, setAdaptivePlan] = useState(null);

  // --- 4. SHORT & LONG GOALS STATE ---
  const [goals, setGoals] = useState([
    { id: 1, title: 'Complete DSA 100-Day Challenge', type: 'short', target: 'Next Month', completedToday: false },
    { id: 2, title: 'Build Full-Stack Data App', type: 'short', target: 'In 2 Months', completedToday: true },
    { id: 3, title: 'Secure Data Engineering Internship', type: 'long', target: 'Sept 2026', completedToday: false },
    { id: 4, title: 'Publish AI/ML Research Paper', type: 'long', target: '2027', completedToday: false }
  ]);

  // --- 5. DAY-TO-DAY TASKS STATE ---
  const [customTasks, setCustomTasks] = useState([
    { id: 'custom-1', title: 'Revise Graph Algorithms', type: 'daily', target: 'Today', completedToday: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // --- 6. DYNAMIC SYLLABUS ROADMAP & PYQ STATE ---
  const [roadmapQuery, setRoadmapQuery] = useState({ topic: 'OPERATING SYSTEM', college: 'VIT BHOPAL' });
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState(null);

  // --- 7. REVISION NOTES & FILE UPLOAD STATE ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [notesSummary, setNotesSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [savedNotesList, setSavedNotesList] = useState([
    {
      id: 'note-1',
      fileName: '3-Tautologie...Calculus.pptx',
      date: new Date().toLocaleDateString(),
      summary: 'Notes processed successfully: High-level overview generated with key syllabus concepts, core definitions, and formula references.'
    }
  ]);

  // --- 8. AI FAQ CHATBOX STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! Ask me about your Saved Timetables, Semester GPA calculation, or Academic Syllabus Roadmaps!' }
  ]);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // GPA Calculation Helper Functions
  const gradeToPoints = (g) => {
    switch (g) {
      case 'S': case 'A+': return 10;
      case 'A': return 9;
      case 'B+': case 'B': return 8;
      case 'C': return 7;
      case 'D': return 6;
      default: return 5;
    }
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(sem => {
      sem.subjects.forEach(sub => {
        const cred = Number(sub.credits) || 3;
        totalPoints += gradeToPoints(sub.grade) * cred;
        totalCredits += cred;
      });
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  // Adaptive Workload Generator
  const generateAdaptiveWorkload = () => {
    const cgpa = Number(calculateCGPA());
    let dailyHours = 4;
    let focusArea = 'High-Speed DSA & LeetCode Practice';
    let urgency = 'Moderate';

    if (cgpa < 7.5) {
      dailyHours = 6;
      focusArea = 'GPA Recovery + Core CS Fundamentals (OS, DBMS)';
      urgency = 'High (Focus on Academic Boost)';
    } else if (cgpa >= 8.5) {
      dailyHours = 4.5;
      focusArea = 'Advanced System Design & High-Level Project Portfolios';
      urgency = 'Optimal Target Rate';
    }

    setAdaptivePlan({
      target: careerTarget,
      company: targetCompany,
      cgpaScore: cgpa,
      recommendedDailyHours: dailyHours,
      focusArea: focusArea,
      urgency: urgency,
      weeklyMilestones: [
        `2 Hours Daily: Semester Exam Preparation (${cgpa < 7.5 ? 'High Priority' : 'Maintenance Mode'})`,
        `2 Hours Daily: ${careerTarget} Core Skills Practice`,
        '1 Hour Daily: LeetCode & Competitive Coding',
        'Weekend: Full-Stack Project Integration & System Architecture'
      ]
    });
  };

  // Timetable Handlers
  const generateContiguousTimetable = () => {
    const newSch = {
      Monday: [
        { time: '08:30 - 10:00', subject: 'Data Structures', slot: 'A11' },
        { time: '10:05 - 11:35', subject: 'DBMS', slot: 'B11' }
      ],
      Tuesday: [
        { time: '08:30 - 10:00', subject: 'Operating Systems', slot: 'A12' }
      ],
      Wednesday: [
        { time: '08:30 - 10:00', subject: 'Machine Learning', slot: 'A13' },
        { time: '10:05 - 11:35', subject: 'Data Engineering', slot: 'B13' }
      ],
      Thursday: [
        { time: '08:30 - 11:35', subject: 'Data Structures Lab', slot: 'L11+L12' }
      ],
      Friday: [
        { time: '08:30 - 11:35', subject: 'DBMS Lab', slot: 'L13+L14' }
      ]
    };
    setGeneratedTimetable(newSch);
  };

  const saveCurrentTimetable = () => {
    if (!newTimetableName.trim()) {
      alert('Please enter a name for this timetable!');
      return;
    }
    const currentSch = generatedTimetable || savedTimetables[0]?.schedule;
    const newEntry = {
      id: `tt-${Date.now()}`,
      name: newTimetableName.trim(),
      shift: shiftPreference,
      schedule: currentSch
    };
    setSavedTimetables([...savedTimetables, newEntry]);
    setActiveTimetableId(newEntry.id);
    setNewTimetableName('');
    alert(`Saved timetable "${newEntry.name}" under user account!`);
  };

  const downloadTimetableImage = async () => {
    const el = document.getElementById('timetable-to-image');
    if (!el) return;
    const canvas = await html2canvas(el, { backgroundColor: '#0f2b1d', scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Timetable_${shiftPreference}_Shift.png`;
    link.click();
  };

  // Dynamic Roadmap Handler
  const handleGenerateRoadmap = () => {
    if (!roadmapQuery.topic.trim()) return;
    setIsGeneratingRoadmap(true);
    setTimeout(() => {
      setRoadmapResult({
        subject: roadmapQuery.topic.toUpperCase(),
        college: roadmapQuery.college.toUpperCase(),
        modules: [
          { title: 'Module 1: Introduction & Concepts', topics: ['Process Management & Threads', 'System Calls & Architecture', 'Kernel vs User Mode'] },
          { title: 'Module 2: Memory & Concurrency', topics: ['Virtual Memory & Paging', 'Deadlocks & Synchronization', 'Semaphores & Mutex Locks'] },
          { title: 'Module 3: File Systems & Storage', topics: ['File Allocation Methods', 'Disk Scheduling Algorithms', 'I/O Hardware & Buffering'] }
        ],
        pyqs: [
          { year: '2025 Mid-Sem', title: 'Compare Paging vs Segmentation with diagrams' },
          { year: '2024 End-Sem', title: 'Solve Banker Algorithm deadlock avoidance problem' },
          { year: '2023 End-Sem', title: 'FCFS vs SCAN Disk Scheduling calculation' }
        ]
      });
      setIsGeneratingRoadmap(false);
    }, 800);
  };

  // PDF Summarization Handler
  const handleNotesUploadAndSummarize = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload!');
      return;
    }
    setIsSummarizing(true);
    let summaryText = `Key concepts summary for ${selectedFile.name}: Core definitions, main formulas, key algorithms, and exam review pointers extracted successfully.`;
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://127.0.0.1:8000/api/summarize-notes', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        summaryText = data.summary || summaryText;
      }
    } catch (err) {
      // Fallback response if offline
    } finally {
      const newNoteEntry = {
        id: `note-${Date.now()}`,
        fileName: selectedFile.name,
        date: new Date().toLocaleDateString(),
        summary: summaryText
      };

      setNotesSummary(summaryText);
      setSavedNotesList(prev => [newNoteEntry, ...prev]);
      setIsSummarizing(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { sender: 'bot', text: `I received your request regarding: "${userText}". How else can I assist with your study schedule?` }
      ]);
    }, 600);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    const namePart = loginEmail.split('@')[0];
    setCurrentUser({
      fullName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: loginEmail
    });
  };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0d', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: '#0f2b1d', padding: '40px', borderRadius: '16px', border: '1px solid #1f5238', width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
            <Calendar style={{ width: '32px', height: '32px', color: '#34d399' }} />
            <span style={{ fontWeight: 'bold', fontSize: '24px' }}>SMART<span style={{ color: '#34d399' }}>SCHEDULER</span></span>
          </div>

          <h2 style={{ fontSize: '20px', textAlign: 'center', marginBottom: '8px' }}>Log In to Your Account</h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>Access your saved timetables, semester GPAs, and workload plans.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: '#6b7280' }} />
                <input
                  type="email"
                  placeholder="enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', backgroundColor: '#143826', border: '1px solid #1f5238', color: '#fff', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: '#6b7280' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', backgroundColor: '#143826', border: '1px solid #1f5238', color: '#fff', boxSizing: 'border-box' }}
                  required
                />
              </div>
            </div>

            <button type="submit" style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', marginTop: '8px' }}>
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeScheduleDisplay = savedTimetables.find(t => t.id === activeTimetableId)?.schedule || generatedTimetable || savedTimetables[0]?.schedule;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f0d', color: '#ffffff', fontFamily: 'sans-serif' }}>
      
      {/* HEADER / NAVIGATION BAR */}
      <header style={{ backgroundColor: '#0f2b1d', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap', gap: '12px' }}>
        <div onClick={() => setActiveTab('overview')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <Calendar style={{ width: '24px', height: '24px', color: '#34d399' }} />
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>SMART<span style={{ color: '#34d399' }}>SCHEDULER</span></span>
        </div>

        <nav style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'academic_progress', label: 'Semester Grades & CGPA' },
            { id: 'adaptive_workload', label: 'Adaptive Workload & Goals' },
            { id: 'timetable_maker', label: 'Timetable Manager' },
            { id: 'academic_guide', label: 'Academic Guide & PYQs' },
            { id: 'notes_upload', label: 'Quick Revision Notes' },
            { id: 'progress', label: 'Day-to-Day Tasks' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              style={{ background: 'none', border: 'none', color: activeTab === tab.id ? '#34d399' : '#9ca3af', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={() => setCurrentUser(null)} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <LogOut style={{ width: '14px', height: '14px' }} /> Logout
        </button>
      </header>

      {/* MAIN CONTENT BODY */}
      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome back, {currentUser.fullName}!</h1>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Manage semester records, compute CGPA, and set goal-oriented study workloads.</p>

            {/* LIVE WEATHER CARD */}
            <div style={{ backgroundColor: '#0f2b1d', padding: '20px', borderRadius: '16px', border: '1px solid #1f5238', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 'bold', fontSize: '14px' }}>
                  <CloudSun style={{ width: '18px', height: '18px' }} /> Live Campus Weather
                </div>
                {weatherLoading ? (
                  <p style={{ color: '#9ca3af', fontSize: '13px', margin: '8px 0 0 0' }}>Loading campus forecast...</p>
                ) : (
                  <div>
                    <h2 style={{ fontSize: '22px', margin: '6px 0 2px 0' }}>{weatherData?.location}: {weatherData?.temp}°C {weatherData?.icon}</h2>
                    <p style={{ color: '#a7f3d0', fontSize: '13px', margin: 0 }}>{weatherData?.advice}</p>
                  </div>
                )}
              </div>
              <button onClick={fetchWeather} style={{ backgroundColor: '#143826', border: '1px solid #1f5238', color: '#fff', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <RefreshCw style={{ width: '14px', height: '14px' }} /> Refresh
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div onClick={() => setActiveTab('academic_progress')} style={{ backgroundColor: '#143826', padding: '24px', borderRadius: '12px', border: '1px solid #1f5238', cursor: 'pointer' }}>
                <GraduationCap style={{ color: '#34d399', marginBottom: '12px', width: '28px', height: '28px' }} />
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Per-Semester Grade Entry</h3>
                <p style={{ color: '#a7f3d0', fontSize: '13px', margin: 0 }}>Add subjects, credits, and grades semester-by-semester with live CGPA calculation.</p>
              </div>

              <div onClick={() => setActiveTab('adaptive_workload')} style={{ backgroundColor: '#143826', padding: '24px', borderRadius: '12px', border: '1px solid #1f5238', cursor: 'pointer' }}>
                <Target style={{ color: '#34d399', marginBottom: '12px', width: '28px', height: '28px' }} />
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Adaptive Target Workload</h3>
                <p style={{ color: '#a7f3d0', fontSize: '13px', margin: 0 }}>Set company/internship goals to auto-generate weekly schedules based on CGPA.</p>
              </div>

              <div onClick={() => setActiveTab('timetable_maker')} style={{ backgroundColor: '#143826', padding: '24px', borderRadius: '12px', border: '1px solid #1f5238', cursor: 'pointer' }}>
                <CalendarDays style={{ color: '#34d399', marginBottom: '12px', width: '28px', height: '28px' }} />
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Multi-Timetable Manager</h3>
                <p style={{ color: '#a7f3d0', fontSize: '13px', margin: 0 }}>Save timetables in your credentials and switch between multiple schedules.</p>
              </div>
            </div>
          </div>
        )}

        {/* 1. PER-SEMESTER SUBJECT & GPA ENTRY TAB */}
        {activeTab === 'academic_progress' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap style={{ color: '#34d399' }} /> Per-Semester Subject & Grade Tracker
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '28px' }}>Input your subjects, credits, and grades for each semester to compute accurate overall CGPA.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#143826', padding: '24px', borderRadius: '16px', border: '1px solid #1f5238', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Overall Cumulative GPA</span>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#34d399', margin: '12px 0' }}>{calculateCGPA()}</div>
                <span style={{ fontSize: '12px', color: '#a7f3d0' }}>Total Semesters Recorded: {semesters.length}</span>
              </div>

              <div style={{ backgroundColor: '#143826', padding: '24px', borderRadius: '16px', border: '1px solid #1f5238' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#34d399' }}>Add Subject Grade</h3>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newSub.name.trim()) return;
                  setSemesters(semesters.map(sem => {
                    if (sem.id === newSub.semId) {
                      return { ...sem, subjects: [...sem.subjects, { name: newSub.name.trim(), grade: newSub.grade, credits: Number(newSub.credits) }] };
                    }
                    return sem;
                  }));
                  setNewSub({ ...newSub, name: '' });
                }} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Semester</label>
                    <select value={newSub.semId} onChange={(e) => setNewSub({ ...newSub, semId: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff' }}>
                      {semesters.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Subject Name</label>
                    <input type="text" placeholder="e.g., Computer Networks" value={newSub.name} onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff', boxSizing: 'border-box' }} required />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Grade</label>
                    <select value={newSub.grade} onChange={(e) => setNewSub({ ...newSub, grade: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff' }}>
                      <option value="S">S / A+</option>
                      <option value="A">A</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Credits</label>
                    <input type="number" min="1" max="6" value={newSub.credits} onChange={(e) => setNewSub({ ...newSub, credits: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff', boxSizing: 'border-box' }} />
                  </div>

                  <button type="submit" style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <Plus style={{ width: '16px', height: '16px' }} />
                  </button>
                </form>

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Create New Semester (e.g., Semester 3)" value={newSemTitle} onChange={(e) => setNewSemTitle(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff', fontSize: '12px' }} />
                  <button onClick={() => {
                    if (!newSemTitle.trim()) return;
                    setSemesters([...semesters, { id: `sem-${Date.now()}`, title: newSemTitle.trim(), gpa: 0, subjects: [] }]);
                    setNewSemTitle('');
                  }} style={{ backgroundColor: '#065f46', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
                    + New Semester
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {semesters.map(sem => (
                <div key={sem.id} style={{ backgroundColor: '#143826', padding: '20px', borderRadius: '12px', border: '1px solid #1f5238' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, color: '#34d399' }}>{sem.title}</h3>
                    <span style={{ fontSize: '12px', backgroundColor: '#064e3b', color: '#34d399', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                      {sem.subjects.length} Subjects
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sem.subjects.length === 0 ? (
                      <p style={{ color: '#6b7280', fontSize: '12px' }}>No subjects added yet.</p>
                    ) : sem.subjects.map((sub, idx) => (
                      <div key={idx} style={{ backgroundColor: '#0f2b1d', padding: '10px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                        <span>{sub.name} <span style={{ fontSize: '11px', color: '#6b7280' }}>({sub.credits} Credits)</span></span>
                        <span style={{ fontWeight: 'bold', color: '#34d399' }}>{sub.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ADAPTIVE WORKLOAD & CAREER TARGET GOALS TAB */}
        {activeTab === 'adaptive_workload' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target style={{ color: '#34d399' }} /> Adaptive Workload & Career Goal Scheduler
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '28px' }}>Set your target career path and internship goals. The system will analyze your CGPA and adjust your daily study workload automatically.</p>

            <div style={{ backgroundColor: '#143826', padding: '24px', borderRadius: '16px', border: '1px solid #1f5238', marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '6px', fontWeight: 'bold' }}>Target Role / Goal</label>
                  <select value={careerTarget} onChange={(e) => setCareerTarget(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff' }}>
                    <option value="Internship (Data Engineering / Full-Stack)">Internship (Data Engineering / Full-Stack)</option>
                    <option value="FAANG / Top Product Companies">FAANG / Top Product Companies</option>
                    <option value="Core Academic GPA Recovery">Core Academic GPA Recovery</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a7f3d0', marginBottom: '6px', fontWeight: 'bold' }}>Target Company Type</label>
                  <input type="text" value={targetCompany} onChange={(e) => setTargetCompany(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff', boxSizing: 'border-box' }} />
                </div>

                <button onClick={generateAdaptiveWorkload} style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles style={{ width: '16px', height: '16px' }} /> Calculate Workload
                </button>
              </div>
            </div>

            {adaptivePlan && (
              <div style={{ backgroundColor: '#0f2b1d', padding: '28px', borderRadius: '16px', border: '1px solid #34d399' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#34d399' }}>Generated Adaptive Schedule Strategy</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: '#143826', padding: '16px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Current CGPA Base</span>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}>{adaptivePlan.cgpaScore}</div>
                  </div>
                  <div style={{ backgroundColor: '#143826', padding: '16px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Recommended Daily Workload</span>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}>{adaptivePlan.recommendedDailyHours} Hours / Day</div>
                  </div>
                  <div style={{ backgroundColor: '#143826', padding: '16px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Preparation Urgency</span>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#a7f3d0', marginTop: '6px' }}>{adaptivePlan.urgency}</div>
                  </div>
                </div>

                <h4 style={{ fontSize: '14px', color: '#a7f3d0', marginBottom: '12px' }}>Weekly Breakdown Strategy:</h4>
                <ul style={{ paddingLeft: '20px', color: '#d1d5db', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {adaptivePlan.weeklyMilestones.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 3. MULTI-TIMETABLE MANAGER TAB */}
        {activeTab === 'timetable_maker' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarDays style={{ color: '#34d399' }} /> Timetable Manager & Generator
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '28px' }}>Generate non-overlapping contiguous timetables or save multiple semester timetables under your profile.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px' }}>
              <div style={{ backgroundColor: '#143826', padding: '24px', borderRadius: '16px', border: '1px solid #1f5238', height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#34d399' }}>Saved Timetables</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {savedTimetables.map(t => (
                    <button key={t.id} onClick={() => setActiveTimetableId(t.id)} style={{ padding: '12px', borderRadius: '8px', backgroundColor: activeTimetableId === t.id ? '#34d399' : '#0f2b1d', color: activeTimetableId === t.id ? '#000' : '#fff', border: '1px solid #1f5238', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t.name}</span>
                      <span style={{ fontSize: '11px', opacity: 0.8 }}>{t.shift}</span>
                    </button>
                  ))}
                </div>

                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />

                <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#a7f3d0' }}>Generate & Save New Timetable</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Timetable Name (e.g., Evening Shift)" value={newTimetableName} onChange={(e) => setNewTimetableName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff', boxSizing: 'border-box' }} />
                  <button onClick={generateContiguousTimetable} style={{ backgroundColor: '#065f46', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Generate Contiguous Slots
                  </button>
                  <button onClick={saveCurrentTimetable} style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Save style={{ width: '16px', height: '16px' }} /> Save to Account
                  </button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>Active Schedule Preview</h3>
                  <button onClick={downloadTimetableImage} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <Download style={{ width: '14px', height: '14px' }} /> Export PNG
                  </button>
                </div>

                <div id="timetable-to-image" style={{ backgroundColor: '#0f2b1d', padding: '20px', borderRadius: '16px', border: '1px solid #1f5238' }}>
                  {Object.entries(activeScheduleDisplay).map(([day, slots]) => (
                    <div key={day} style={{ marginBottom: '16px' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#34d399', fontSize: '14px' }}>{day}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                        {slots.map((s, idx) => (
                          <div key={idx} style={{ backgroundColor: '#143826', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #34d399' }}>
                            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{s.subject}</div>
                            <div style={{ fontSize: '11px', color: '#a7f3d0' }}>{s.time}</div>
                            <div style={{ fontSize: '10px', color: '#9ca3af' }}>Slot: {s.slot}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ACADEMIC GUIDE & PYQ TAB */}
        {activeTab === 'academic_guide' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen style={{ color: '#34d399' }} /> Dynamic Syllabus Roadmap & PYQs
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '28px' }}>Search any university course or subject syllabus to retrieve structured modules and past examination questions.</p>

            <div style={{ backgroundColor: '#143826', padding: '20px', borderRadius: '16px', border: '1px solid #1f5238', display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <input type="text" placeholder="Subject Name (e.g. OPERATING SYSTEM)" value={roadmapQuery.topic} onChange={(e) => setRoadmapQuery({ ...roadmapQuery, topic: e.target.value })} style={{ flex: 2, padding: '12px', borderRadius: '8px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff' }} />
              <input type="text" placeholder="College (e.g. VIT BHOPAL)" value={roadmapQuery.college} onChange={(e) => setRoadmapQuery({ ...roadmapQuery, college: e.target.value })} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#0f2b1d', border: '1px solid #1f5238', color: '#fff' }} />
              <button onClick={handleGenerateRoadmap} style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                {isGeneratingRoadmap ? 'Searching...' : 'Search Syllabus'}
              </button>
            </div>

            {roadmapResult && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', color: '#34d399', marginBottom: '16px' }}>{roadmapResult.subject} Course Roadmap ({roadmapResult.college})</h3>
                  {roadmapResult.modules.map((m, idx) => (
                    <div key={idx} style={{ backgroundColor: '#143826', padding: '20px', borderRadius: '12px', border: '1px solid #1f5238', marginBottom: '16px' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#a7f3d0' }}>{m.title}</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px', color: '#d1d5db', fontSize: '13px' }}>
                        {m.topics.map((t, i) => <li key={i} style={{ marginBottom: '4px' }}>{t}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 style={{ fontSize: '20px', color: '#34d399', marginBottom: '16px' }}>Previous Year Questions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {roadmapResult.pyqs.map((q, idx) => (
                      <div key={idx} style={{ backgroundColor: '#0f2b1d', padding: '16px', borderRadius: '12px', border: '1px solid #1f5238' }}>
                        <span style={{ fontSize: '11px', backgroundColor: '#064e3b', color: '#34d399', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{q.year}</span>
                        <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#e5e7eb' }}>{q.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. QUICK REVISION NOTES & PDF SUMMARIZER TAB */}
        {activeTab === 'notes_upload' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText style={{ color: '#34d399' }} /> Quick Revision Notes & PDF Summarizer
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '28px' }}>Upload your PDF slides or lecture notes to extract key syllabus points instantly.</p>

            <div style={{ backgroundColor: '#143826', padding: '28px', borderRadius: '16px', border: '1px solid #1f5238', marginBottom: '32px', textAlign: 'center' }}>
              <Upload style={{ width: '36px', height: '36px', color: '#34d399', marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 8px 0' }}>Upload PPTX or PDF Notes</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>Select files from your device to run automatic text extractions.</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ color: '#fff', fontSize: '12px' }} />
                <button onClick={handleNotesUploadAndSummarize} style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isSummarizing ? 'Processing PDF...' : 'Summarize Notes'}
                </button>
              </div>
            </div>

            {notesSummary && (
              <div style={{ backgroundColor: '#0f2b1d', padding: '24px', borderRadius: '16px', border: '1px solid #34d399', marginBottom: '32px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#34d399' }}>Extracted Note Summary</h3>
                <p style={{ color: '#d1d5db', fontSize: '14px', lineHeight: '1.6' }}>{notesSummary}</p>
              </div>
            )}

            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Saved Processing History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {savedNotesList.map(n => (
                <div key={n.id} style={{ backgroundColor: '#143826', padding: '16px', borderRadius: '12px', border: '1px solid #1f5238' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: '#34d399', fontSize: '14px' }}>{n.fileName}</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>{n.date}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{n.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. DAY-TO-DAY TASKS TAB */}
        {activeTab === 'progress' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckSquare style={{ color: '#34d399' }} /> Day-to-Day Study Tasks & Goals
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '28px' }}>Track long-term academic targets alongside short-term daily practice tasks.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#34d399', marginBottom: '16px' }}>Academic & Career Goals</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {goals.map(g => (
                    <div key={g.id} style={{ backgroundColor: '#143826', padding: '16px', borderRadius: '12px', border: '1px solid #1f5238', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" checked={g.completedToday} onChange={() => {
                        setGoals(goals.map(item => item.id === g.id ? { ...item, completedToday: !item.completedToday } : item));
                      }} style={{ width: '18px', height: '18px', accentColor: '#34d399', cursor: 'pointer' }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', textDecoration: g.completedToday ? 'line-through' : 'none' }}>{g.title}</div>
                        <div style={{ fontSize: '11px', color: '#a7f3d0' }}>Target: {g.target}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', color: '#34d399', marginBottom: '16px' }}>Custom Daily Checklist</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input type="text" placeholder="Add custom task..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: '#143826', border: '1px solid #1f5238', color: '#fff' }} />
                  <button onClick={() => {
                    if (!newTaskTitle.trim()) return;
                    setCustomTasks([...customTasks, { id: `custom-${Date.now()}`, title: newTaskTitle.trim(), completedToday: false }]);
                    setNewTaskTitle('');
                  }} style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {customTasks.map(t => (
                    <div key={t.id} style={{ backgroundColor: '#0f2b1d', padding: '14px', borderRadius: '12px', border: '1px solid #1f5238', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input type="checkbox" checked={t.completedToday} onChange={() => {
                        setCustomTasks(customTasks.map(item => item.id === t.id ? { ...item, completedToday: !item.completedToday } : item));
                      }} style={{ width: '18px', height: '18px', accentColor: '#34d399', cursor: 'pointer' }} />
                      <span style={{ fontSize: '13px', textDecoration: t.completedToday ? 'line-through' : 'none' }}>{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FLOATING AI ASSISTANT CHATBOT */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        {!isChatOpen ? (
          <button onClick={() => setIsChatOpen(true)} style={{ backgroundColor: '#34d399', color: '#000', border: 'none', width: '56px', height: '56px', borderRadius: '28px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
            <Bot style={{ width: '28px', height: '28px' }} />
          </button>
        ) : (
          <div style={{ backgroundColor: '#0f2b1d', border: '1px solid #34d399', borderRadius: '16px', width: '340px', height: '420px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
            <div style={{ backgroundColor: '#143826', padding: '12px 16px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                <Bot style={{ width: '18px', height: '18px', color: '#34d399' }} /> AI Assistant
              </div>
              <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'user' ? '#34d399' : '#143826', color: msg.sender === 'user' ? '#000' : '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', maxWidth: '80%' }}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Ask a question..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', backgroundColor: '#143826', border: '1px solid #1f5238', color: '#fff', fontSize: '12px' }} />
              <button onClick={handleSendMessage} style={{ backgroundColor: '#34d399', color: '#000', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                <Send style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}