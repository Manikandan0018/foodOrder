import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from "react-hot-toast";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim();

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const { mutate: login } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch(`${VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token); // ✅ store JWT
      toast.success("Login successful");
      queryClient.invalidateQueries(["authUser"]);
      navigate("/"); // ✅ redirect to home
    },
    onError: (err) => toast.error(err.message)
  });

  const handleSubmit = (e) => { e.preventDefault(); login(formData); };

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
      </div>
    </>
  );
};
