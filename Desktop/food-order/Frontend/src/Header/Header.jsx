// src/Header/Header.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";



const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

export const Header = () => {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect login/signup pages
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // ✅ Fetch user profile if logged in
  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!token) return null;
      const res = await axios.get(`${VITE_BACKEND_URL}api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // ✅ Fetch cart
  const { data: cartData = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!token) return [];
      const res = await axios.get(`${VITE_BACKEND_URL}api/cart/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-orange-600 tracking-wide">
          MOZZU
        </h1>
        {/* Home button always visible */}
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2  rounded-full hover:text-orange-600 cursor-pointer transition"
        >
          Home
        </button>

        {/* ✅ Auth pages: Only Home button */}
        {isAuthPage ? (
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition"
          >
            Home
          </button>
        ) : (
          <>
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
              <a href="/menu" className="hover:text-orange-600 transition">
                Menu
              </a>
              <a href="/cart" className="hover:text-orange-600 transition">
                Cart
              </a>
              {/* <a href="/checkout" className="hover:text-orange-600 transition">
                Checkout
              </a> */}
              <a href="/favorites" className="hover:text-orange-600 transition">
                Favorites
              </a>
              <a href="/my-orders" className="hover:text-orange-600 transition">
                My Orders
              </a>
             
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {!token ? (
                <button
                  onClick={() => navigate("/login")}
                  className="hidden md:block px-4 py-2 border border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition"
                >
                  Log In
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800">
                    {user?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 w-15   text-red-600 rounded-full  hover:text-black transition"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Cart */}
              <a href="/cart" className="relative hidden md:block">
                <FiShoppingCart className="text-2xl text-gray-800 hover:text-orange-600 transition" />
                {cartData.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full shadow">
                    {cartData.length}
                  </span>
                )}
              </a>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden ml-1.5 text-2xl text-gray-800"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu (only if not on login/signup) */}
      {menuOpen && !isAuthPage && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg shadow-lg px-6 py-4 space-y-3">
          <a href="/menu" className="block hover:text-orange-600">
            Menu
          </a>
          <a href="/cart" className="block hover:text-orange-600">
            Cart
          </a>
          <a href="/checkout" className="block hover:text-orange-600">
            Checkout
          </a>
          <a href="/favorites" className="block hover:text-orange-600">
            Favorites
          </a>
          <a href="/my-orders" className="block hover:text-orange-600">
            My Orders
          </a>
         

          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-3 px-4 py-2 border border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition"
            >
              Log In
            </button>
          ) : (
            <div className="flex justify-between items-center mt-3">
              <span className="font-medium text-gray-800">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-black transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
