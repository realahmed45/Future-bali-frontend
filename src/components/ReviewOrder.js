import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ReviewOrder = () => {
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState(null);

  console.log("[ReviewOrder] Location state:", locationState);

  // Check authentication and get user info
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please login to continue");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://future-bali-backend-fixed-version.onrender.com/api/auth/verify-token",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success && response.data.user) {
          // Set user identifier (email or phone)
          if (response.data.user.email) {
            setUserIdentifier(response.data.user.email);
          } else if (response.data.user.phone) {
            setUserIdentifier(response.data.user.phone);
          }
        } else {
          alert("Please login to continue");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        alert("Please login to continue");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // Get package data from location state with fallbacks
  const getPackageData = () => {
    if (locationState?.selectedAddOns && locationState?.basePackage) {
      return locationState;
    }

    const savedData = localStorage.getItem("currentPackageSelection");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved package data", e);
      }
    }

    return {
      selectedAddOns: [],
      basePackage: {
        title: "Furnished 1 bedroom house",
        price: 25000,
        duration: "4-6 months",
        details: [
          { label: "Bedroom", size: "18-20 m²" },
          { label: "Bathroom", size: "9-14 m²" },
          { label: "Kitchen", size: "12-14 m²" },
          { label: "Garden", size: "121 m²" },
        ],
      },
    };
  };

  // Get minimum sizes based on package type
  const getMinimumSizes = (packageTitle) => {
    const title = packageTitle?.toLowerCase() || "";

    if (title.includes("furnished 1 bedroom") || title.includes("package 1")) {
      return [
        { label: "1 Bedroom", size: "30" },
        { label: "1 Bathroom", size: "9" },
        { label: "Kitchen", size: "7" },
        { label: "Storage", size: "" },
        { label: "Garden", size: "80" },
        { label: "Living room", size: "10" },
      ];
    } else if (
      title.includes("furnished 2 bedroom") ||
      title.includes("package 2")
    ) {
      return [
        { label: "1 Bedroom", size: "30" },
        { label: "1 Bathroom", size: "9" },
        { label: "Kitchen", size: "7" },
        { label: "Storage", size: "" },
        { label: "Garden", size: "80" },
        { label: "Living room", size: "10" },
        { label: "Pool", size: "6" },
      ];
    } else if (title.includes("swimming pool") || title.includes("package 3")) {
      return [
        { label: "2 Bedrooms", size: "40" },
        { label: "2 Bathrooms", size: "9" },
        { label: "Kitchen", size: "7" },
        { label: "Storage", size: "" },
        { label: "Garden", size: "80" },
        { label: "Living room", size: "10" },
      ];
    }

    // Default fallback
    return [
      { label: "1 Bedroom", size: "30" },
      { label: "1 Bathroom", size: "9" },
      { label: "Kitchen", size: "7" },
      { label: "Storage", size: "" },
      { label: "Garden", size: "80" },
      { label: "Living room", size: "10" },
    ];
  };

  const packageData = getPackageData();
  const {
    selectedAddOns = [],
    basePackage = {},
    cartId,
    totalAmount,
  } = packageData;

  // Get minimum sizes for display
  const minimumSizes = getMinimumSizes(basePackage.title);

  // Calculate totals
  const addOnTotal = selectedAddOns.reduce(
    (total, addOn) => total + (addOn.price || 0),
    0
  );
  const totalCost = (basePackage.price || 0) + addOnTotal;
  const initialPayment = Math.round(totalCost * 0.9); // 90% payment within 1 week

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleProceedToOrder = async () => {
    if (!isChecked) {
      alert("Please agree to the terms and conditions to proceed.");
      return;
    }

    if (!userIdentifier) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      console.log("[ReviewOrder] Creating order with data:", {
        cartId,
        basePackage,
        selectedAddOns,
        totalAmount: totalCost,
      });

      // Create order in database
      const response = await axios.post(
        "https://future-bali-backend-fixed-version.onrender.com/api/orders/create",
        {
          cartId,
          basePackage,
          selectedAddOns,
          totalAmount: totalCost,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      console.log("[ReviewOrder] Order created successfully:", response.data);

      const createdOrderId = response.data.orderId || response.data.order._id;
      setOrderId(createdOrderId);

      // Navigate to next form with order ID
      navigate("/review_order1_2", {
        state: {
          selectedAddOns,
          basePackage,
          totalCost,
          cartId,
          orderId: createdOrderId,
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      const errorMessage =
        error.response?.data?.message ||
        "Failed to create order. Please try again.";

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (!userIdentifier) {
    return (
      <div className="p-6 bg-gray-100 rounded-xl mx-4 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-purple-700">
          Verifying Authentication...
        </h2>
        <p>Please wait while we verify your login status.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-xl mx-4">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-700">
        Review Your Order
      </h2>

      {/* User Info Display */}
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
        <p className="font-bold">Logged in as: {userIdentifier}</p>
      </div>

      <div className="border-4 border-black p-6 rounded-lg bg-white">
        {/* Scope And Payment Details */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 underline">
            Scope And Payment Details with specific features:
          </h3>
          <p className="mb-4">
            <strong>Investment:</strong> The customer agrees to pay{" "}
            <span className="text-red-600 font-bold">${totalCost}</span> for a
            villa with specified features.
          </p>

          <div className="mb-4">
            <p className="font-bold mb-2">Minimum size</p>
            <ul className="list-none pl-0">
              {minimumSizes.map((item, index) => (
                <li key={index} className="text-red-600">
                  • {item.label}:{" "}
                  <span className="font-bold">
                    {item.size}
                    {item.size && " m²"}
                  </span>
                </li>
              ))}
              <li>Total land MINIMUM 155</li>
            </ul>
          </div>

          <div className="mb-4">
            <p className="font-bold mb-2">ADD ON</p>
            <ul className="list-none pl-0">
              {selectedAddOns.map((addOn, index) => (
                <li key={`addon-${index}`} className="text-red-600">
                  • {addOn.room || addOn.name}:{" "}
                  <span className="font-bold">{addOn.size}</span> -{" "}
                  <span className="font-bold">${addOn.price}</span>
                </li>
              ))}
              {selectedAddOns.length === 0 && (
                <li className="text-gray-500 italic">No add-ons selected</li>
              )}
            </ul>
          </div>

          <div className="mb-4">
            <ul className="list-none pl-0">
              <li className="font-bold">
                • Base Package:{" "}
                <span className="text-black">${basePackage.price || 0}</span>
              </li>
              {selectedAddOns.length > 0 && (
                <li className="font-bold">
                  • Add-ons Total:{" "}
                  <span className="text-black">${addOnTotal}</span>
                </li>
              )}
              <li className="font-bold">
                • Total Investment:{" "}
                <span className="text-black">${totalCost}</span>
              </li>
            </ul>
          </div>

          <p className="font-bold text-red-600 mb-4">
            Payment within 1 week ( 90% of {totalCost} = {initialPayment})
          </p>
        </div>

        {/* Initial Payment & Profit Sharing */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 underline">
            Initial Payment & Profit Sharing:
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Profit Sharing:</strong> Profits are shared equally
              (50/50) between the customer and My Future Life Bali.
            </li>
            <li>
              <strong>Initial Payment:</strong> Customer will pay{" "}
              <span className="font-bold">${initialPayment}</span> and the
              remaining amount 10% will be paid 14 days after the completion of
              the building.
            </li>
            <li>
              <strong>Profit Payment:</strong> The profit will be paid to a bank
              account via bank transfer every 3 months.
            </li>
            <li>
              <strong>
                Guarantor Profit Sharing and ROI Terms (First 2 years):
              </strong>{" "}
              Income Below 6% has the right to withdraw and request a 75% refund
              of the initial investment.
            </li>
          </ul>

          <div className="mt-4">
            <p className="font-bold underline">between year 0-20.</p>
            <p className="ml-4">
              - If the return on investment (ROI) is below 12% from year 0 to
              year 20 you, as the party, will receive 70% of the profit instead
              of 50%, and 'My Future Life Bali' will receive 30%.
            </p>
          </div>
        </div>

        {/* Construction Period */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 underline">
            Construction Period:
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>My Secret Home</strong> will act as a guarantor only
              during the construction period, which shall not exceed six (6)
              months. The guarantor obligation ends either upon the completion
              of the construction or when the property is launched for rental in
              the market, whichever occurs first.
            </li>
            <li>
              If the construction is not completed within the six (6) month
              period, My Secret Home will ensure the full repayment of the
              invested amount plus an additional $500.
            </li>
          </ul>
        </div>

        {/* Contract Duration */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 underline">
            Contract Duration:
          </h3>
          <ul className="list-disc pl-5">
            <li>
              <strong>Terms: 23 years</strong>
            </li>
          </ul>

          <div className="mt-4">
            <p className="font-bold underline">
              Right to stay and use the property
            </p>
            <ul className="list-disc pl-5">
              <li>
                You have the right for 28 days per year stay at the property.
              </li>
            </ul>
          </div>
        </div>

        {/* Inheritance */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 underline">Inheritance:</h3>
          <p className="ml-4">
            In the event of an extended absence or death, My Future Life Bali
            will contact the customer's relatives or embassy. Profits will be
            distributed to inheritors according to the investor's wishes.
          </p>
        </div>

        <div className="mt-8 flex items-start">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-6 h-6 mr-4 mt-1 flex-shrink-0"
            style={{ transform: "scale(1.5)" }}
          />
          <label className="text-xl font-extrabold leading-tight">
            I have reviewed the contract in its entirety and confirm my
            agreement with all terms and conditions.
          </label>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-3 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 focus:outline-none disabled:opacity-50"
          onClick={handleProceedToOrder}
          disabled={isLoading || !isChecked}
        >
          {isLoading ? "Creating Order..." : "Proceed to Order"}
        </button>
      </div>
    </div>
  );
};

export default ReviewOrder;
