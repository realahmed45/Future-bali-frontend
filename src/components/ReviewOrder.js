import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ReviewOrder = () => {
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  console.log("[ReviewOrder] Location state:", locationState);

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

  const packageData = getPackageData();
  const {
    selectedAddOns = [],
    basePackage = {},
    cartId,
    totalAmount,
  } = packageData;

  // Calculate totals
  const addOnTotal = selectedAddOns.reduce(
    (total, addOn) => total + (addOn.price || 0),
    0
  );
  const totalCost = (basePackage.price || 0) + addOnTotal;

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleProceedToOrder = async () => {
    if (!isChecked) {
      alert("Please agree to the terms and conditions to proceed.");
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
        "https://future-bali-backend-1.onrender.com/api/orders/create",
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
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create order. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-xl mx-4">
      <h2 className="text-3xl font-semibold mb-6 text-center text-purple-700">
        Review Your Order
      </h2>
      <div className="border-4 border-black p-6 rounded-lg">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">
            Scope And Payment Details:
          </h3>
          <p>
            Investment: The customer agrees to pay ${totalCost} for a villa with
            specified features.
          </p>
          <ul className="list-disc pl-5 mt-4">
            {basePackage.details?.map((item, index) => (
              <li key={index}>
                {item.label}: {item.size}
              </li>
            ))}
            {selectedAddOns.map((addOn, index) => (
              <li key={`addon-${index}`}>
                {addOn.room} (Add-on): {addOn.size} - ${addOn.price}
              </li>
            ))}
            <li className="font-semibold mt-2">
              Base Package: ${basePackage.price}
            </li>
            {selectedAddOns.length > 0 && (
              <li className="font-semibold">Add-ons Total: ${addOnTotal}</li>
            )}
            <li className="font-bold">Total Investment: ${totalCost}</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4">
            Initial Payment & Profit Sharing:
          </h3>
          <ul className="list-disc pl-5">
            <li>
              Profit Sharing: Profits are shared equally (50/50) between the
              customer and My Future Life Bali.
            </li>
            <li>
              Initial Payment: Customer will pay ${totalCost / 2} and the
              remaining amount ${totalCost / 2} will be paid 14 days after the
              completion of the building.
            </li>
            <li>
              Profit Payment: The profit will be paid to a bank account via bank
              transfer every 3 months.
            </li>
            <li>
              Guarantor Profit Sharing and ROI Terms (First 2 years):
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Income Below 8% has the right to withdraw and request a 75%
                  refund of the initial investment between year 1-20.
                </li>
                <li>
                  If the return on investment (ROI) is below 12% from year 1 to
                  year 20, you, as the party, will receive 65% of the profit
                  instead of 50%, and 'My Future Life Bali' will receive 35%.
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4">Construction Period:</h3>
          <ul className="list-disc pl-5">
            <li>
              Secret Home will act as a guarantor only during the construction
              period, which shall not exceed six (6) months. The guarantor
              obligation ends either upon the completion of the construction or
              when the property is launched for rental in the market, whichever
              occurs first.
            </li>
            <li>
              If the construction is not completed within the six (6) month
              period, My Secret Home will ensure the full repayment of the
              invested amount plus an additional $500.
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4">Contract Duration:</h3>
          <ul className="list-disc pl-5">
            <li>Term: 22 years</li>
            <li>
              You have the right for 21 days stay per year at the property.
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-4">Inheritance:</h3>
          <ul className="list-disc pl-5">
            <li>
              In cases of prolonged absence or death, My Future Life Bali will
              attempt contact with customer's relatives or the embassy. Profits
              will be distributed to inheritors as specified by customer or
              according to inheritance laws if no inheritors are designated.
            </li>
          </ul>
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-6 h-6 mr-4"
            style={{ transform: "scale(1.5)" }}
          />
          <label className="text-2xl font-extrabold">
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
