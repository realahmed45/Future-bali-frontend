import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { FaTimes } from "react-icons/fa";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("phone");
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    "https://future-bali-backend-fixed-version.onrender.com";

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("zVTuReodh-Rdvi0n_");
  }, []);

  const handleCloseModal = () => {
    setPhone("");
    setEmail("");
    setOtp("");
    setOtpError("");
    setPhoneError("");
    setEmailError("");
    setIsLoading(false);
    setIsOtpModalOpen(false);
    navigate("/");
  };

  const validatePhone = (phone) => {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Send OTP via EmailJS
  const sendOtpViaEmail = async (email, otp) => {
    try {
      await emailjs.send(
        "service_clikdn4",
        "template_gvxyd5q",
        {
          to_email: email,
          otp: otp,
        },
        "Q7YaSuUUOzO-j_ffb"
      );
      return true;
    } catch (error) {
      console.error("EmailJS error:", error);
      throw new Error("Failed to send email");
    }
  };

  // Send OTP via WhatsApp (simulated for now)
  const sendOtpViaWhatsApp = async (phone, otp) => {
    try {
      console.log("SIMULATION: Sending WhatsApp to:", phone, "OTP:", otp);
      // Simulate API call - replace with UltraMsg later
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error("WhatsApp error:", error);
      throw new Error("Failed to send WhatsApp message");
    }
  };

  const sendOtp = async () => {
    if (loginMethod === "phone") {
      if (!phone) {
        setPhoneError("Please enter your phone number.");
        return;
      }
      if (!validatePhone(phone)) {
        setPhoneError("Please enter a valid phone number with country code");
        return;
      }
    } else {
      if (!email) {
        setEmailError("Please enter your email address.");
        return;
      }
      if (!validateEmail(email)) {
        setEmailError("Please enter a valid email address.");
        return;
      }
    }

    setIsLoading(true);
    setPhoneError("");
    setEmailError("");

    try {
      const payload = loginMethod === "phone" ? { phone } : { email };

      // Get OTP from backend
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/generate-otp`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to generate OTP");
      }

      const { otp: generatedOtp } = response.data;

      // Send OTP via appropriate channel
      if (loginMethod === "phone") {
        await sendOtpViaWhatsApp(phone, generatedOtp);
      } else {
        await sendOtpViaEmail(email, generatedOtp);
      }

      setIsOtpModalOpen(true);
    } catch (error) {
      console.error("OTP Error:", error);
      let errorMessage = "Failed to send OTP. Please try again.";

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      if (loginMethod === "phone") {
        setPhoneError(errorMessage);
      } else {
        setEmailError(errorMessage);
      }
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
      const payload = loginMethod === "phone" ? { phone, otp } : { email, otp };

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`,
        payload,
        { timeout: 5000 }
      );

      if (response.data.success && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
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
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md ${
                  loginMethod === "phone"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setLoginMethod("phone")}
              >
                WhatsApp
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md ${
                  loginMethod === "email"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setLoginMethod("email")}
              >
                Email
              </button>
            </div>

            {loginMethod === "phone" ? (
              <div className="mb-6">
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your WhatsApp number (e.g., +1234567890)"
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Enter your phone number with country code. We'll send a
                  verification code via WhatsApp.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                  disabled={isLoading}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Enter your email address. We'll send a verification code via
                  email.
                </p>
              </div>
            )}

            <button
              onClick={sendOtp}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium disabled:opacity-50 transition duration-300"
              disabled={isLoading}
            >
              {isLoading
                ? "Sending OTP..."
                : `Send OTP via ${
                    loginMethod === "phone" ? "WhatsApp" : "Email"
                  }`}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <p className="text-gray-600 mb-4 text-center">
                We've sent a 6-digit code to your{" "}
                {loginMethod === "phone" ? "WhatsApp number" : "email"}{" "}
                {loginMethod === "phone" ? phone : email}
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
              <button
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="w-full mt-3 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-md font-medium disabled:opacity-50 transition duration-300"
              >
                Change {loginMethod === "phone" ? "Phone Number" : "Email"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
