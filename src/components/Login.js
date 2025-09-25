import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

// Blocked country codes
const BLOCKED_COUNTRY_CODES = {
  russia: ["+7", "7", "007"],
  ukraine: ["+380", "380", "0380"],
  romania: ["+40", "40", "0040"],
  india: ["+91", "91", "0091"],
};

const isPhoneNumberBlocked = (phone) => {
  if (!phone) return { blocked: false };

  const cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, "");

  for (const country in BLOCKED_COUNTRY_CODES) {
    const codes = BLOCKED_COUNTRY_CODES[country];

    for (const code of codes) {
      if (cleanPhone.startsWith(code)) {
        return { blocked: true, country };
      }
    }
  }

  return { blocked: false };
};

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
    "https://future-bali-backend-production.up.railway.app";

  // FIXED: Clear any existing session on component mount
  useEffect(() => {
    // Clear any existing authentication when user visits login page
    localStorage.removeItem("authToken");
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

      // BLOCK SPECIFIED COUNTRIES
      const blockCheck = isPhoneNumberBlocked(phone);
      if (blockCheck.blocked) {
        setPhoneError(
          "Sorry, our service is currently not available in your region."
        );
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

    const maxRetries = 6;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const payload = loginMethod === "phone" ? { phone } : { email };

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

        console.log("OTP Response:", response.data);

        // Backend now handles sending the OTP via email or WhatsApp
        // No need for frontend email sending
        setIsOtpModalOpen(true);
        setIsLoading(false);

        // Show success message based on delivery method
        if (response.data.note) {
          // Fallback case - show the note
          alert(response.data.note);
        }

        return; // Success, exit the retry loop
      } catch (error) {
        lastError = error;
        console.log(
          `OTP attempt ${attempt}/${maxRetries} failed:`,
          error.message
        );

        // If it's the last attempt, don't wait
        if (attempt < maxRetries) {
          // Wait before retrying (increasing delay)
          await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
        }
      }
    }

    // All retries failed
    setIsLoading(false);
    let errorMessage =
      "Failed to send OTP after multiple attempts. Please try again later.";

    if (lastError?.code === "ECONNABORTED") {
      errorMessage =
        "Server timeout. Please check your connection and try again.";
    } else if (lastError?.code === "ERR_NETWORK") {
      errorMessage =
        "Network error. Please check your connection and try again.";
    } else if (lastError?.response) {
      errorMessage = lastError.response.data.message || errorMessage;
    }

    if (loginMethod === "phone") {
      setPhoneError(errorMessage);
    } else {
      setEmailError(errorMessage);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    // Double-check blocking for phone (in case user manipulates the form)
    if (loginMethod === "phone") {
      const blockCheck = isPhoneNumberBlocked(phone);
      if (blockCheck.blocked) {
        setOtpError(
          "Sorry, our service is currently not available in your region."
        );
        return;
      }
    }

    setIsLoading(true);
    setOtpError("");

    const maxRetries = 5;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const payload =
          loginMethod === "phone" ? { phone, otp } : { email, otp };

        const response = await axios.post(
          `${API_BASE_URL}/api/auth/verify-otp`,
          payload,
          { timeout: 20000 }
        );

        if (response.data.success && response.data.token) {
          // FIXED: Clear any existing tokens before setting new one
          localStorage.removeItem("authToken");
          localStorage.setItem("authToken", response.data.token);

          // FIXED: Add a small delay to ensure token is set before navigation
          setTimeout(() => {
            const redirectTo = location.state?.from?.pathname || "/";
            navigate(redirectTo);
          }, 100);

          return; // Success, exit
        } else {
          throw new Error(response.data.message || "OTP verification failed");
        }
      } catch (error) {
        lastError = error;
        console.log(
          `Verification attempt ${attempt}/${maxRetries} failed:`,
          error.message
        );

        // If it's the last attempt, don't wait
        if (attempt < maxRetries) {
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }

    // All retries failed
    setIsLoading(false);
    localStorage.removeItem("authToken");

    let errorMessage =
      "Verification failed after multiple attempts. Please try again.";
    if (lastError?.response?.data?.message) {
      errorMessage = lastError.response.data.message;
    } else if (
      lastError?.code === "ECONNABORTED" ||
      lastError?.code === "ERR_NETWORK"
    ) {
      errorMessage =
        "Network timeout. Please check your connection and try again.";
    }

    setOtpError(errorMessage);
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
                  Enter your email address. We'll send a verification code from
                  info@futurelifebali.com.
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
                {loginMethod === "phone" ? "WhatsApp number" : "email address"}{" "}
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
