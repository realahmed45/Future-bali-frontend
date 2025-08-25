import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://future-bali-backend-1.onrender.com";

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("zVTuReodh-Rdvi0n_");
  }, []);

  const handleCloseModal = () => {
    onClose();
    setEmail("");
    setOtp("");
    setOtpError("");
    setEmailError("");
    setIsLoading(false);
    setIsOtpModalOpen(false);
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
        "_ogHswl36ofcGQoss"
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
        onLoginSuccess();
        handleCloseModal();
        navigate("/");
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

  if (!isOpen) return null;

  return (
    <>
      {/* Sign-In Modal */}
      {!isOtpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg relative">
            <span
              className="absolute top-4 right-4 text-gray-600 text-2xl cursor-pointer"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border text-black rounded-md"
                required
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mb-4">{emailError}</p>
            )}
            <button
              onClick={sendOtpToEmail}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-96 shadow-lg relative">
            <span
              className="absolute top-4 right-4 text-gray-600 text-2xl cursor-pointer"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <h2 className="text-2xl font-bold text-center mb-6">Enter OTP</h2>
            <p className="text-center text-gray-600 mb-4">
              We've sent a 6-digit code to {email}
            </p>
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border text-black rounded-md text-center text-lg"
                  maxLength="6"
                  required
                  disabled={isLoading}
                />
              </div>
              {otpError && (
                <p className="text-red-500 text-sm mb-4">{otpError}</p>
              )}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-md disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthModal;
