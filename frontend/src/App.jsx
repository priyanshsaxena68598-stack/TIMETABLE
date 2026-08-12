import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Connect Socket.IO to backend server
const socket = io('/', { path: '/socket.io' });

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [role, setRole] = useState(user?.role || 'student');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [authData, setAuthData] = useState({ username: '', password: '', role: 'student', name: '', room_number: '' });
  const [authError, setAuthError] = useState('');

  // App Data States
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [outPasses, setOutPasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form Inputs
  const [newNotice, setNewNotice] = useState({ title: '', content: '', priority: 'normal' });
  const [newComplaint, setNewComplaint] = useState({ category: 'plumbing', description: '' });

  // Handle Socket Events & Data Fetching
  useEffect(() => {
    if (token) {
      fetchNotices();
      fetchComplaints();
      fetchOutPasses();
    }

    socket.on('notice_updated', () => fetchNotices());
    socket.on('complaint_updated', () => fetchComplaints());
    socket.on('pass_updated', () => fetchOutPasses());

    return () => {
      socket.off('notice_updated');
      socket.off('complaint_updated');
      socket.off('pass_updated');
    };
  }, [token]);

  // API Call Helpers
  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setNotices(data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  const fetchOutPasses = async () => {
    try {
      const res = await fetch('/api/outpasses', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setOutPasses(data);
    } catch (err) {
      console.error('Error fetching outpasses:', err);
    }
  };

  // Auth Logic
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setRole(data.user.role);
      } else {
        setIsLogin(true);
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  // Form Submission Handlers
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newNotice),
      });
      setNewNotice({ title: '', content: '', priority: 'normal' });
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newComplaint),
      });
      setNewComplaint({ category: 'plumbing', description: '' });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  // Login / Register View
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-400">
            🏢 Smart Hostel Portal 2.0
          </h1>

          {authError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-sm">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={authData.name}
                    onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Room Number</label>
                  <input
                    type="text"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={authData.room_number}
                    onChange={(e) => setAuthData({ ...authData, room_number: e.target.value })}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-1">Username / Reg ID</label>
              <input
                type="text"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                value={authData.username}
                onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Role</label>
              <select
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                value={authData.role}
                onChange={(e) => setAuthData({ ...authData, role: e.target.value })}
              >
                <option value="student">Student / Resident</option>
                <option value="warden">Warden</option>
                <option value="maintenance">Maintenance Staff</option>
                <option value="security">Security Guard</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 hover:underline font-medium"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Dashboard Interface
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏢</span>
          <h1 className="text-xl font-bold text-indigo-400">Smart Hostel 2.0</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name || user?.username}</p>
            <p className="text-xs text-slate-400 capitalize">{role} Mode</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium px-3 py-1.5 rounded-lg border border-red-500/30 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            📢 Dashboard & Notices
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition ${
              activeTab === 'complaints' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            🔧 Maintenance Complaints
          </button>
          <button
            onClick={() => setActiveTab('outpass')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition ${
              activeTab === 'outpass' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            🎟️ Digital Out-Pass
          </button>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-6 space-y-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Announcements & Notices</h2>
                <input
                  type="text"
                  placeholder="Search notices..."
                  className="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Notice Creation Form (Warden/Admin) */}
              {(role === 'warden' || role === 'admin') && (
                <form onSubmit={handleCreateNotice} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-semibold text-indigo-400">Post New Notice</h3>
                  <input
                    type="text"
                    placeholder="Notice Title"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Notice Content..."
                    required
                    rows="3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  ></textarea>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm rounded-lg font-medium">
                    Publish Notice
                  </button>
                </form>
              )}

              {/* Notices List */}
              <div className="space-y-4">
                {notices
                  .filter((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((notice, idx) => (
                    <div key={notice.id || idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                      <h3 className="font-semibold text-lg text-slate-100">{notice.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{notice.content}</p>
                      <span className="inline-block mt-3 text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20">
                        {notice.date || 'Recent'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Maintenance Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Maintenance Requests</h2>

              {role === 'student' && (
                <form onSubmit={handleCreateComplaint} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-semibold text-indigo-400">File a Issue Request</h3>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="cleaning">Cleaning / Housekeeping</option>
                  </select>
                  <textarea
                    placeholder="Describe the issue in your room..."
                    required
                    rows="3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm focus:outline-none focus:border-indigo-500"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  ></textarea>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm rounded-lg font-medium">
                    Submit Issue
                  </button>
                </form>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {complaints.map((c, idx) => (
                  <div key={c.id || idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-start">
                    <div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-indigo-400">{c.category}</span>
                      <p className="text-sm text-slate-300 mt-1">{c.description}</p>
                      <p className="text-xs text-slate-500 mt-2">Room: {c.room_number || 'N/A'}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {c.status || 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outpass Tab */}
          {activeTab === 'outpass' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Digital Out-Pass Management</h2>
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center space-y-4">
                <p className="text-slate-400 text-sm">Scan QR Code or Present Pass at Main Hostel Gate</p>
                <div className="w-36 h-36 bg-slate-800 border-2 border-indigo-500 border-dashed rounded-xl mx-auto flex items-center justify-center text-slate-500">
                  [ QR Code ]
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-sm font-medium">
                  Request New Gate Pass
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}