import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import logo from '../../img/twitter-logo.png';
import { toast, Toaster } from "react-hot-toast";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.trim();

export const Login = ({ refetchAuthUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch(`${VITE_BACKEND_URL}api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      return data;
    },
    onSuccess: async (data) => {
      // ✅ Save token
      localStorage.setItem("token", data.token);

      toast.success("Login successful");

      // ✅ Refetch authUser in App
      if (refetchAuthUser) await refetchAuthUser();

      navigate("/"); // ✅ Redirect after login
    },
    onError: (err) => {
      toast.error(err.message || "Invalid credentials");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <img className="w-10 absolute top-10 left-20" src={logo} alt="Logo" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md shadow-xl rounded-2xl bg-white">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6 cursor-pointer">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl"
                required
              />

              <button
                type="submit"
                className="w-full h-10 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-xl"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
