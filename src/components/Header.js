import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";
import axios from "axios";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://future-bali-backend-1.onrender.com";

  // Check auth status continuously
  useEffect(() => {
    const verifyAuthStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/verify-token`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsLoggedIn(response.data.success);
        if (response.data.user?.email) {
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUserEmail("");
      }
    };

    // Check immediately on mount
    verifyAuthStatus();

    // Then check every 3 seconds
    const intervalId = setInterval(verifyAuthStatus, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [API_BASE_URL]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setUserEmail("");
      setShowOptions(false);
      navigate("/");
    }
  };

  return (
    <header className="bg-gray-800 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-4">
        {/* Sidebar Icon */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            className="text-2xl bg-gray-800 text-white hover:bg-purple-500 rounded-lg p-2 transition duration-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <img
            src={require("../assets/images/logo1.png")}
            alt="Logo"
            className="h-10"
          />
        </div>

        {/* Logo */}
        <img
          src={require("../assets/images/logo1.png")}
          alt="Logo"
          className="hidden md:block h-10"
        />

        {/* Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-purple-400 transition">
            Home
          </Link>
          <Link to="/packages" className="hover:text-purple-400 transition">
            Packages
          </Link>
          <Link to="/contactUs" className="hover:text-purple-400 transition">
            Contact Us
          </Link>
          <Link to="/gallery" className="hover:text-purple-400 transition">
            Gallery
          </Link>
        </div>

        {/* Auth Section */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-500"
              onClick={() => setShowOptions(!showOptions)}
            >
              <span className="w-6 h-6 flex items-center justify-center bg-white text-purple-600 rounded-full">
                {userEmail.substring(0, 1).toUpperCase()}
              </span>
              <FaCaretDown />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                <div className="px-4 py-2 text-gray-600 border-b">
                  {userEmail}
                </div>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-purple-600 hover:bg-purple-100"
                  onClick={() => setShowOptions(false)}
                >
                  Account Settings
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 text-purple-600 hover:bg-purple-100"
                  onClick={() => setShowOptions(false)}
                >
                  Order History
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-purple-100 rounded-b-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-500 transition"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
