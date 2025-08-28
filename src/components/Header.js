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

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSidebarLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-gray-800 text-white py-4">
        <nav className="container mx-auto flex justify-between items-center px-4">
          {/* Mobile: Sidebar Icon + Logo */}
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

          {/* Desktop: Logo */}
          <img
            src={require("../assets/images/logo1.png")}
            alt="Logo"
            className="hidden md:block h-10"
          />

          {/* Desktop: Links */}
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
            <Link to="/adventure" className="hover:text-purple-400 transition">
              My adventure
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

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <img
            src={require("../assets/images/logo1.png")}
            alt="Logo"
            className="h-8"
          />
          <button
            onClick={closeSidebar}
            className="text-2xl hover:text-purple-400 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex flex-col p-4 space-y-4">
          <Link
            to="/"
            className="block py-2 px-4 hover:bg-purple-600 rounded transition"
            onClick={handleSidebarLinkClick}
          >
            Home
          </Link>
          <Link
            to="/packages"
            className="block py-2 px-4 hover:bg-purple-600 rounded transition"
            onClick={handleSidebarLinkClick}
          >
            Packages
          </Link>
          <Link
            to="/contactUs"
            className="block py-2 px-4 hover:bg-purple-600 rounded transition"
            onClick={handleSidebarLinkClick}
          >
            Contact Us
          </Link>
          <Link
            to="/gallery"
            className="block py-2 px-4 hover:bg-purple-600 rounded transition"
            onClick={handleSidebarLinkClick}
          >
            Gallery
          </Link>
          <Link
            to="/adventure"
            className="block py-2 px-4 hover:bg-purple-600 rounded transition"
            onClick={handleSidebarLinkClick}
          >
            My adventure
          </Link>

          {/* Mobile Auth Section */}
          <div className="border-t border-gray-700 pt-4 mt-4">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="px-4 py-2 text-gray-300 text-sm">
                  {userEmail}
                </div>
                <Link
                  to="/settings"
                  className="block py-2 px-4 hover:bg-purple-600 rounded transition"
                  onClick={handleSidebarLinkClick}
                >
                  Account Settings
                </Link>
                <Link
                  to="/history"
                  className="block py-2 px-4 hover:bg-purple-600 rounded transition"
                  onClick={handleSidebarLinkClick}
                >
                  Order History
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                  className="block w-full text-left py-2 px-4 text-red-400 hover:bg-purple-600 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                className="w-full bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-500 transition"
                onClick={() => {
                  navigate("/login");
                  closeSidebar();
                }}
              >
                Log In
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
