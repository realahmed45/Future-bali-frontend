import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://future-bali-backend-1.onrender.com";

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("zVTuReodh-Rdvi0n_");
  }, []);

  const handleCloseModal = () => {
    setEmail("");
    setOtp("");
    setOtpError("");
    setEmailError("");
    setIsLoading(false);
    setIsOtpModalOpen(false);
    navigate("/");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const sendOtpToEmail = async () => {
    if (!email) {
      setEmailError("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/generate-otp`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to generate OTP");
      }

      await emailjs.send(
        "service_clikdn4",
        "template_gvxyd5q",
        {
          to_email: email,
          otp: response.data.otp,
        },
        "Q7YaSuUUOzO-j_ffb"
      );

      setIsOtpModalOpen(true);
    } catch (error) {
      console.error("OTP Error:", error);
      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      setEmailError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        { email, otp },
        { timeout: 5000 }
      );

      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);

        // Redirect to the intended page or home
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo);
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      localStorage.removeItem("authToken");
      setOtpError(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
          Login
        </h1>

        {!isOtpModalOpen ? (
          <div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                disabled={isLoading}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>
            <button
              onClick={sendOtpToEmail}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium disabled:opacity-50 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <p className="text-gray-600 mb-4 text-center">
                We've sent a 6-digit code to {email}
              </p>
              <div className="mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength="6"
                  required
                  disabled={isLoading}
                />
                {otpError && (
                  <p className="text-red-500 text-sm mt-1">{otpError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium disabled:opacity-50 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
