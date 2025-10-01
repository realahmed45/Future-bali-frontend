import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTimesCircle, FaPlus } from "react-icons/fa";
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
  const [userIdentifier, setUserIdentifier] = useState(null);
  const [showAddOns, setShowAddOns] = useState(false);

  // Available add-ons for Package 1
  const availableAddOns = [
    { room: "Bedroom", size: "40", price: 2000 },
    { room: "Bathroom", size: "12", price: 500 },
    { room: "Kitchen", size: "11", price: 1000 },
    { room: "Storage", size: "3", price: 800 },
    { room: "Larger Garden", size: "100", price: 2500 },
    { room: "Living Room", size: "14", price: 1500 },
    { room: "Out sitting", size: "9", price: 1000 },
    { room: "swim Pool", size: "6", price: 4500 },
  ];

  // Get minimum sizes for Package 1
  const getMinimumSizes = () => {
    return [
      { label: "1 Bedroom", size: "30 m²" },
      { label: "1 Bathroom", size: "9 m²" },
      { label: "Kitchen", size: "7 m²" },
      { label: "Storage", size: "" },
      { label: "Garden", size: "80 m²" },
      { label: "Living room", size: "10 m²" },
    ];
  };

  // Default base package data - Package 1
  const defaultBasePackage = {
    title: "Furnished 1 bedroom house",
    price: 32000,
    duration: "4-6 months",
    details: [
      { label: "Bedroom", size: "30 m²" },
      { label: "Bathroom", size: "9 m²" },
      { label: "Kitchen", size: "7 m²" },
      { label: "Garden", size: "80 m²" },
      { label: "Living room", size: "10 m²" },
    ],
  };

  // Check if an add-on is already selected
  const isAddOnSelected = (room) => {
    return cartData.selectedAddOns.some((addOn) => addOn.room === room);
  };

  // Handle adding/removing add-ons
  const handleToggleAddOn = (room, size, price) => {
    const isAlreadySelected = isAddOnSelected(room);
    let updatedAddOns;

    if (isAlreadySelected) {
      updatedAddOns = cartData.selectedAddOns.filter(
        (addOn) => addOn.room !== room
      );
    } else {
      updatedAddOns = [...cartData.selectedAddOns, { room, size, price }];
    }

    const newCartData = {
      ...cartData,
      selectedAddOns: updatedAddOns,
    };

    setCartData(newCartData);
    localStorage.setItem(
      "currentPackageSelection",
      JSON.stringify(newCartData)
    );
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
        setUserIdentifier(null);
        return;
      }

      try {
        console.log("[Package1Cart] Verifying token with API");
        const response = await axios.get(
          "https://future-bali-backend-production.up.railway.app/api/auth/verify-token",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        console.log(
          "[Package1Cart] Token verification response:",
          response.data
        );

        if (response.data.success) {
          setIsAuthenticated(true);
          if (response.data.user?.email) {
            setUserIdentifier(response.data.user.email);
          } else if (response.data.user?.phone) {
            setUserIdentifier(response.data.user.phone);
          }
        } else {
          setIsAuthenticated(false);
          setUserIdentifier(null);
        }
      } catch (error) {
        console.error("[Package1Cart] Token verification failed:", error);
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUserIdentifier(null);
      }
    };

    checkAuth();
  }, []);

  // Load cart data
  useEffect(() => {
    console.log("[Package1Cart] Loading cart data");
    const loadData = () => {
      if (location.state) {
        console.log("[Package1Cart] Using location state for cart data");
        setCartData({
          basePackage: location.state.basePackage || defaultBasePackage,
          selectedAddOns: location.state.selectedAddOns || [],
          cartId: location.state.cartId || null,
        });
        return;
      }

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

      if (!userIdentifier) {
        throw new Error("No user identifier found");
      }

      const response = await axios.post(
        "https://future-bali-backend-production.up.railway.app/api/cart/save",
        {
          email: userIdentifier.includes("@") ? userIdentifier : null,
          phone: userIdentifier.includes("@") ? null : userIdentifier,
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

  const minimumSizes = getMinimumSizes();

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
            {minimumSizes.map((item, index) => (
              <p key={index} className="text-gray-600 font-bold">
                {item.label}:{" "}
                <span className="font-extrabold ml-2">{item.size}</span>
              </p>
            ))}
          </div>
          <p className="text-lg font-extrabold text-purple-600 mt-2">
            {formatCurrency(cartData.basePackage.price)}
          </p>
        </div>
      </div>

      {/* Selected Add-Ons */}
      <h2 className="text-xl font-bold text-gray-800 mt-4 mb-2">
        Selected Add Ons
      </h2>
      {cartData.selectedAddOns.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-3">
          <table className="table-auto w-full text-sm text-gray-800">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1 font-bold text-purple-600 text-left">
                  Room
                </th>
                <th className="px-2 py-1 font-bold text-purple-600 text-left">
                  New Size
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

      {/* Add More Add-Ons Button */}
      <div className="mt-4">
        <button
          onClick={() => setShowAddOns(!showAddOns)}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg text-lg font-bold hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FaPlus size={12} />
          {showAddOns ? "Hide Available Add-Ons" : "Add More Add-Ons"}
        </button>
      </div>

      {/* Available Add-Ons Section */}
      {showAddOns && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <h3 className="text-lg font-bold text-purple-600 mb-3">
            Available Add-Ons
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm text-gray-800">
              <thead>
                <tr className="border-b bg-purple-50">
                  <th className="px-2 py-2 font-bold text-purple-600 text-left">
                    Room
                  </th>
                  <th className="px-2 py-2 font-bold text-purple-600 text-center">
                    New Size
                  </th>
                  <th className="px-2 py-2 font-bold text-purple-600 text-right">
                    Price
                  </th>
                  <th className="px-2 py-2 font-bold text-purple-600 text-center">
                    Select
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableAddOns.map(({ room, size, price }, index) => (
                  <tr
                    key={room}
                    className={`border-b ${
                      isAddOnSelected(room) ? "bg-purple-100" : ""
                    }`}
                  >
                    <td className="px-2 py-2 font-semibold">
                      <span className="text-gray-800">
                        {room.split(" ")[0]}
                      </span>
                      {room.split(" ")[1] && (
                        <span className="text-red-600 font-bold ml-1">
                          {room.split(" ").slice(1).join(" ")}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-center font-bold text-purple-600">
                      {size}
                    </td>
                    <td className="px-2 py-2 text-right font-bold text-green-600">
                      ${price}
                    </td>
                    <td className="px-2 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={isAddOnSelected(room)}
                        onChange={() => handleToggleAddOn(room, size, price)}
                        className="w-5 h-5 cursor-pointer accent-purple-600 transform hover:scale-110 transition-transform duration-200"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Login Notice */}
      {!isAuthenticated && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4">
          <p className="font-bold">
            Please login to save your cart and proceed to checkout.
          </p>
        </div>
      )}

      {/* User Info Display */}
      {isAuthenticated && userIdentifier && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-4">
          <p className="font-bold">Logged in as: {userIdentifier}</p>
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
