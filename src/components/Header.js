import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";
import axios from "axios";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState("");
  const [userId, setUserId] = useState(""); // Add user ID tracking
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://future-bali-backend-production.up.railway.app";

  // FIXED: More robust auth verification with proper error handling
  useEffect(() => {
    let isComponentMounted = true; // Prevent state updates if component unmounts

    const verifyAuthStatus = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        if (isComponentMounted) {
          setIsLoggedIn(false);
          setUserIdentifier("");
          setUserId("");
        }
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/verify-token`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000, // 10 second timeout
          }
        );

        if (isComponentMounted) {
          if (response.data.success && response.data.user) {
            // FIXED: Verify user ID matches to prevent session mixups
            const currentUserId = response.data.user.id;

            // If we have a different user ID, clear everything
            if (userId && userId !== currentUserId) {
              console.warn("User ID mismatch detected, clearing session");
              localStorage.removeItem("authToken");
              setIsLoggedIn(false);
              setUserIdentifier("");
              setUserId("");
              return;
            }

            setIsLoggedIn(true);
            setUserId(currentUserId);

            // Set user identifier
            if (response.data.user.email) {
              setUserIdentifier(response.data.user.email);
            } else if (response.data.user.phone) {
              setUserIdentifier(response.data.user.phone);
            } else {
              setUserIdentifier("User");
            }
          } else {
            // Invalid token response
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
            setUserIdentifier("");
            setUserId("");
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);

        if (isComponentMounted) {
          // Clear invalid token
          localStorage.removeItem("authToken");
          setIsLoggedIn(false);
          setUserIdentifier("");
          setUserId("");
        }
      }
    };

    // Check immediately on mount
    verifyAuthStatus();

    // FIXED: Listen for localStorage changes (login/logout from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === "authToken") {
        console.log("Auth token changed, verifying status");
        verifyAuthStatus();
      }
    };

    // Add storage event listener
    window.addEventListener("storage", handleStorageChange);

    // FIXED: Also listen for focus events to check when user returns to tab
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        verifyAuthStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    // FIXED: Reduce polling frequency but still check periodically
    const intervalId = setInterval(() => {
      // Only verify if page is visible (prevents unnecessary API calls)
      if (document.visibilityState === "visible") {
        verifyAuthStatus();
      }
    }, 5000); // Check every 5 seconds instead of 30

    // Cleanup function
    return () => {
      isComponentMounted = false;
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [API_BASE_URL, userId]); // Add userId as dependency

  // FIXED: Additional effect to detect immediate token changes
  useEffect(() => {
    const checkTokenChange = () => {
      const token = localStorage.getItem("authToken");

      // If token exists and we're not logged in, verify immediately
      if (token && !isLoggedIn) {
        console.log("Token detected, verifying immediately");
        verifyAuthStatus();
      }

      // If no token and we think we're logged in, clear state
      if (!token && isLoggedIn) {
        console.log("No token found, clearing login state");
        setIsLoggedIn(false);
        setUserIdentifier("");
        setUserId("");
      }
    };

    const verifyAuthStatus = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsLoggedIn(false);
        setUserIdentifier("");
        setUserId("");
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/auth/verify-token`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        if (response.data.success && response.data.user) {
          const currentUserId = response.data.user.id;

          if (userId && userId !== currentUserId) {
            console.warn("User ID mismatch detected, clearing session");
            localStorage.removeItem("authToken");
            setIsLoggedIn(false);
            setUserIdentifier("");
            setUserId("");
            return;
          }

          setIsLoggedIn(true);
          setUserId(currentUserId);

          if (response.data.user.email) {
            setUserIdentifier(response.data.user.email);
          } else if (response.data.user.phone) {
            setUserIdentifier(response.data.user.phone);
          } else {
            setUserIdentifier("User");
          }
        } else {
          localStorage.removeItem("authToken");
          setIsLoggedIn(false);
          setUserIdentifier("");
          setUserId("");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUserIdentifier("");
        setUserId("");
      }
    };

    // Check immediately when component mounts or updates
    checkTokenChange();

    // Set up an interval to check for token changes more frequently
    const quickCheckInterval = setInterval(checkTokenChange, 1000);

    return () => {
      clearInterval(quickCheckInterval);
    };
  }, [isLoggedIn, API_BASE_URL, userId]);

  // FIXED: Enhanced logout with server-side logout call
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Call logout endpoint
          await axios
            .post(
              `${API_BASE_URL}/api/auth/logout`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 5000,
              }
            )
            .catch(() => {
              // Ignore logout API errors, still clear local storage
              console.log("Logout API call failed, but clearing local session");
            });
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Always clear local session regardless of API call result
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUserIdentifier("");
        setUserId("");
        setShowOptions(false);
        navigate("/");
      }
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSidebarLinkClick = () => {
    setIsSidebarOpen(false);
  };

  // Get user display initial (for avatar)
  const getUserInitial = () => {
    if (!userIdentifier) return "U";

    if (userIdentifier.includes("@")) {
      return userIdentifier.substring(0, 1).toUpperCase();
    } else {
      return "U";
    }
  };

  // Get user display text
  const getUserDisplayText = () => {
    if (!userIdentifier) return "User";

    if (userIdentifier.includes("@")) {
      return userIdentifier;
    } else {
      return `${userIdentifier}`;
    }
  };

  // FIXED: Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptions && !event.target.closest(".user-dropdown")) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

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
            <Link to="/adventure">
              <img
                src={require("../assets/images/logo1.png")}
                alt="Logo"
                className="h-10 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              />
            </Link>
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
              Future Adventure
            </Link>
          </div>

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="relative user-dropdown">
              <button
                className="flex items-center space-x-2 bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-500"
                onClick={() => setShowOptions(!showOptions)}
              >
                <span className="w-6 h-6 flex items-center justify-center bg-white text-purple-600 rounded-full">
                  {getUserInitial()}
                </span>
                <FaCaretDown />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-gray-600 border-b text-sm">
                    {getUserDisplayText()}
                  </div>

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
                  {getUserDisplayText()}
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
