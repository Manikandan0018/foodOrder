import { useQuery } from '@tanstack/react-query';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './sign/login/Home.jsx';
import { Front } from './sign/login/Front.jsx';
import SignUp from './sign/login/SignUp.jsx';
import { Login } from './sign/login/Login.jsx';
import { Settings } from './sign/login/Settings.jsx';
import Admin from './Admin/Admin.jsx';
import { PeopleProfile } from './sign/login/PeopleProfile.jsx';
import Chat from './chat/Chat.jsx';
import { useState } from 'react';

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim();

const App = () => {
  const location = useLocation();
  const [noti, setNoti] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const token = localStorage.getItem("token");

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      if (!token) return null;

      const res = await fetch(`${VITE_BACKEND_URL}api/auth/getMe`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (authUser?.isBlocked) return <Navigate to="/login" replace />;

  return (
    <div className="flex">
      {location.pathname !== "/admin" && authUser && (
        <Settings showSidebar={showSidebar} setShowSidebar={setShowSidebar} setNoti={setNoti} noti={noti} />
      )}

      <div className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={authUser ? <Home notifi={noti} /> : <Front />} />
          <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/profile/:username" element={<PeopleProfile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chat" element={<Chat currentUser={authUser} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
