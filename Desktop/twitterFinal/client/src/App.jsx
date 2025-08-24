// App.jsx
import './App.css';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SignUp from './sign/login/SignUp.jsx';
import { Login } from './sign/login/Login.jsx';
import { Front } from './sign/login/Front.jsx';
import { useQuery } from '@tanstack/react-query';
import { Settings } from './sign/login/Settings.jsx';
import { Home } from './sign/login/Home.jsx';
import { useState } from 'react';
import Admin from './Admin/Admin.jsx';
import { PeopleProfile } from './sign/login/PeopleProfile.jsx';
import Chat from './chat/Chat.jsx';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim();

const App = () => {
  const [noti, setNoti] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem("token"); // ✅ Get JWT

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      if (!token) return null;

      const res = await fetch(`${VITE_BACKEND_URL}api/auth/getMe`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send JWT
        },
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (authUser?.isBlocked) return <Navigate to="/login" replace />;

  return (
    <>
      <div className="flex">
        {/* Sidebar + Hamburger for non-admin routes */}
        {location.pathname !== "/admin" && authUser && (
          <>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden fixed w-10 h-10 top-4 left-2 z-50 bg-white border border-gray-300 rounded p-2 shadow-md"
            >
              ☰
            </button>
            <Settings showSidebar={showSidebar} setShowSidebar={setShowSidebar} setNoti={setNoti} noti={noti} />
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 pt-20">
          <Routes basename='/'>
            <Route path="/" element={authUser ? <Home notifi={noti} /> : <Front />} />
            <Route path="/profile/:username" element={<PeopleProfile />} />
            <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/chat" element={<Chat currentUser={authUser} />} />         
          </Routes>
        </div>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;
