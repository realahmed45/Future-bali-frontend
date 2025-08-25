import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import packageImage from "../assets/images/package1cart1.png";
import axios from "axios";

const Package1Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("[Package1Cart] Component rendering");
  console.log("[Package1Cart] Location state:", location.state);

  // State management
  const [cartData, setCartData] = useState({
    basePackage: null,
    selectedAddOns: [],
    cartId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Default base package data
  const defaultBasePackage = {
    title: "Furnished 1 bedroom house",
    price: 25000,
    duration: "4-6 months",
    details: [
      { label: "Bedroom", size: "18-20 m²" },
      { label: "Bathroom", size: "9-14 m²" },
      { label: "Kitchen", size: "12-14 m²" },
      { label: "Storage", size: "5 m²" },
      { label: "Garden", size: "121 m²" },
    ],
  };

  // Check authentication status
  useEffect(() => {
    console.log("[Package1Cart] Checking authentication");
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      console.log("[Package1Cart] Token found:", !!token);

      if (!token) {
        console.log(
          "[Package1Cart] No token, setting isAuthenticated to false"
        );
        setIsAuthenticated(false);
        return;
      }

      try {
        console.log("[Package1Cart] Verifying token with API");
        const response = await axios.get(
          "https://future-bali-backend-1.onrender.com/api/auth/verify-token",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );
        console.log(
          "[Package1Cart] Token verification response:",
          response.data
        );
        setIsAuthenticated(response.data.success);
      } catch (error) {
        console.error("[Package1Cart] Token verification failed:", error);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Load cart data
  useEffect(() => {
    console.log("[Package1Cart] Loading cart data");
    const loadData = () => {
      // Priority 1: Location state
      if (location.state) {
        console.log("[Package1Cart] Using location state for cart data");
        setCartData({
          basePackage: location.state.basePackage || defaultBasePackage,
          selectedAddOns: location.state.selectedAddOns || [],
          cartId: location.state.cartId || null,
        });
        return;
      }

      // Priority 2: LocalStorage
      const saved = localStorage.getItem("currentPackageSelection");
      console.log("[Package1Cart] LocalStorage data found:", !!saved);

      if (saved) {
        try {
          console.log("[Package1Cart] Parsing localStorage data");
          const parsed = JSON.parse(saved);
          setCartData({
            basePackage: parsed.basePackage || defaultBasePackage,
            selectedAddOns: parsed.selectedAddOns || [],
            cartId: parsed.cartId || null,
          });
          return;
        } catch (e) {
          console.error("[Package1Cart] Failed to parse saved data", e);
        }
      }

      // Priority 3: Defaults
      console.log("[Package1Cart] Using default cart data");
      setCartData({
        basePackage: defaultBasePackage,
        selectedAddOns: [],
        cartId: null,
      });
    };

    loadData();
  }, [location.state]);

  const saveCartToDatabase = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get user email from token verification
      const userResponse = await axios.get(
        "https://future-bali-backend-1.onrender.com/api/auth/verify-token",
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );

      if (!userResponse.data.success) {
        throw new Error("Invalid token");
      }

      const response = await axios.post(
        "https://future-bali-backend-1.onrender.com/api/cart/save",
        {
          email: userResponse.data.user.email,
          basePackage: cartData.basePackage,
          selectedAddOns: cartData.selectedAddOns,
          totalAmount: calculateTotal(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      console.log("[Package1Cart] Cart saved successfully:", response.data);
      return response.data.cart._id;
    } catch (error) {
      console.error("Cart save error details:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  };

  const handleProceedToCheckout = async () => {
    console.log("[Package1Cart] Proceed to checkout clicked");

    if (!isAuthenticated) {
      console.log(
        "[Package1Cart] User not authenticated, redirecting to login"
      );
      navigate("/login", {
        state: {
          from: "/package1-cart",
          redirectState: {
            selectedAddOns: cartData.selectedAddOns,
            basePackage: cartData.basePackage,
            cartId: cartData.cartId,
          },
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("[Package1Cart] Saving cart to database");
      const savedCartId = await saveCartToDatabase();

      console.log("[Package1Cart] Cart saved, navigating to review-order");
      navigate("/review-order", {
        state: {
          selectedAddOns: cartData.selectedAddOns,
          basePackage: cartData.basePackage,
          cartId: savedCartId || cartData.cartId,
          totalAmount: calculateTotal(),
        },
      });
    } catch (error) {
      console.error("[Package1Cart] Error during checkout:", error);

      if (error.response?.status === 401) {
        console.log(
          "[Package1Cart] Authentication error, redirecting to login"
        );
        navigate("/login", {
          state: {
            from: "/package1-cart",
            redirectState: {
              selectedAddOns: cartData.selectedAddOns,
              basePackage: cartData.basePackage,
              cartId: cartData.cartId,
            },
          },
        });
      } else {
        alert("Failed to save cart. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAddOn = (index) => {
    const updatedAddOns = [...cartData.selectedAddOns];
    updatedAddOns.splice(index, 1);

    const newCartData = {
      ...cartData,
      selectedAddOns: updatedAddOns,
    };

    setCartData(newCartData);

    // Update localStorage
    localStorage.setItem(
      "currentPackageSelection",
      JSON.stringify(newCartData)
    );
  };

  const calculateSubTotal = () => {
    return cartData.selectedAddOns.reduce(
      (sum, addOn) => sum + (addOn.price || 0),
      0
    );
  };

  const calculateTotal = () => {
    return (cartData.basePackage?.price || 0) + calculateSubTotal();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!cartData.basePackage) {
    return <div className="text-center py-8">Loading your package...</div>;
  }

  return (
    <div className="font-sans bg-gray-50 text-gray-800 max-w-3xl mx-auto p-4 rounded-lg shadow-md">
      {/* Your Package */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Package</h2>

      <div className="bg-white rounded-lg shadow-md p-3 flex items-start hover:bg-purple-50 transition-all duration-300">
        <img
          src={packageImage}
          alt="Package"
          className="w-1/4 h-24 object-cover rounded-lg"
        />
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-bold mb-2">
            {cartData.basePackage.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Duration:{" "}
            <span className="font-semibold">
              {cartData.basePackage.duration}
            </span>
          </p>
          <div className="grid grid-cols-2 gap-1 text-sm">
            {cartData.basePackage.details?.map((item, index) => (
              <p key={index} className="text-gray-600">
                {item.label}: <span className="font-semibold">{item.size}</span>
              </p>
            ))}
          </div>
          <p className="text-lg font-extrabold text-purple-600 mt-2">
            {formatCurrency(cartData.basePackage.price)}
          </p>
        </div>
      </div>

      {/* Add-Ons */}
      <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">Add Ons</h2>
      {cartData.selectedAddOns.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-3">
          <table className="table-auto w-full text-sm text-gray-800">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1 font-bold text-purple-600 text-left">
                  Room
                </th>
                <th className="px-2 py-1 font-bold text-purple-600 text-left">
                  Size
                </th>
                <th className="px-2 py-1 font-bold text-purple-600 text-right">
                  Price
                </th>
                <th className="px-2 py-1 font-bold text-purple-600 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {cartData.selectedAddOns.map((addOn, index) => (
                <tr key={index} className="border-b">
                  <td className="px-2 py-2">{addOn.room || "N/A"}</td>
                  <td className="px-2 py-2">{addOn.size || "N/A"}</td>
                  <td className="px-2 py-2 text-right">
                    {formatCurrency(addOn.price || 0)}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => handleRemoveAddOn(index)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove add-on"
                    >
                      <FaTimesCircle size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No add-ons selected.</p>
      )}

      {/* Login Notice */}
      {!isAuthenticated && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4">
          <p className="font-bold">
            Please login to save your cart and proceed to checkout.
          </p>
        </div>
      )}

      {/* Total Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
          <span>Base Package</span>
          <span>{formatCurrency(cartData.basePackage.price)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
          <span>Add-Ons Subtotal</span>
          <span>{formatCurrency(calculateSubTotal())}</span>
        </div>
        <div className="border-t border-gray-300 my-2"></div>
        <div className="flex justify-between text-lg font-bold text-purple-600">
          <span>Total</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
        <div className="text-center mt-4">
          <button
            onClick={handleProceedToCheckout}
            className="bg-purple-600 text-white mt-3 py-2 px-6 rounded-lg text-sm font-bold hover:bg-purple-700 hover:scale-105 transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Package1Cart;
