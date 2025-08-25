import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { SuccessToast } from "./SuccessTost";

const PlaceOrder = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  console.log("[PlaceOrder] Location state:", state);

  // Get data from state with fallbacks
  const basePackage = state?.basePackage || {
    title: "Furnished 1 bedroom house",
    price: 25000,
    description: "Includes Bedroom, Bathroom, Kitchen, Storage, and Garden.",
  };

  const selectedAddOns = state?.selectedAddOns || [];
  const contacts = state?.contacts || [];
  const { cartId, orderId } = state || {};

  const addOnTotal = selectedAddOns.reduce(
    (sum, addOn) => sum + (addOn.price || 0),
    0
  );
  const totalCost = (basePackage.price || 0) + addOnTotal;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "",
    address: "",
    notes: "",
    saveDetails: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    if (!orderId) {
      alert("Order ID is missing. Please go back and try again.");
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
      console.log("[PlaceOrder] Finalizing order with billing details");

      // Finalize the order with billing details
      const response = await axios.post(
        "https://future-bali-backend-1.onrender.com/api/orders/finalize",
        {
          orderId,
          billingDetails: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      console.log("[PlaceOrder] Order finalized successfully:", response.data);
      <SuccessToast />;

      // Navigate to payment with order details
      navigate("/payment", {
        state: {
          orderId,
          totalCost,
          billingDetails: formData,
          basePackage,
          selectedAddOns,
        },
      });
    } catch (error) {
      console.error("Error finalizing order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to finalize order. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-16">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6 text-left text-purple-600 uppercase">
        Checkout
      </h1>

      {/* Billing Details Form */}
      <div className="w-full lg:w-2/3 bg-white p-8 shadow-md border border-gray-300 mb-8 rounded-md">
        <h2 className="text-2xl font-medium mb-6 text-gray-800 uppercase">
          Billing Details
        </h2>
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-1">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-lg focus:ring-2 focus:ring-purple-600 rounded-md`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-lg focus:ring-2 focus:ring-purple-600 rounded-md`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-1">
                Phone*
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-lg focus:ring-2 focus:ring-purple-600 rounded-md`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-1">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-lg focus:ring-2 focus:ring-purple-600 rounded-md`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-1">
              Country/Region*
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full border ${
                errors.country ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-lg focus:ring-2 focus:ring-purple-600 rounded-md`}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-1">
              Address*
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } px-3 py-2 text-lg focus:ring-2 focus:ring-purple-600 rounded-md`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-lg focus:ring-2 focus:ring-purple-600 rounded-md"
              placeholder="Any special instructions or notes..."
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="saveDetails"
              checked={formData.saveDetails}
              onChange={handleChange}
              className="w-5 h-5 mr-2"
            />
            <label className="text-gray-700 font-medium text-lg">
              Save billing details for later use
            </label>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="w-full bg-white p-8 shadow-md border border-gray-300 rounded-md">
        <h2 className="text-2xl font-medium mb-4 text-purple-600 uppercase">
          Your Order
        </h2>
        <table className="w-full text-left border-collapse text-lg">
          <tbody>
            <tr>
              <td className="p-3 font-medium border text-gray-700">
                {basePackage.title}
              </td>
              <td className="p-3 border text-gray-700">${basePackage.price}</td>
            </tr>
            {selectedAddOns.map((addOn, index) => (
              <tr key={index}>
                <td className="p-3 border text-gray-700">
                  {addOn.room} (Add-On)
                </td>
                <td className="p-3 border text-gray-700">${addOn.price}</td>
              </tr>
            ))}
            <tr className="font-medium">
              <td className="p-3 border text-gray-700">Add-ons Subtotal</td>
              <td className="p-3 border text-gray-700">${addOnTotal}</td>
            </tr>
            <tr className="font-semibold text-purple-600">
              <td className="p-3 border text-lg">Total</td>
              <td className="p-3 border text-lg">${totalCost}</td>
            </tr>
          </tbody>
        </table>

        {/* Place Order Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className="bg-purple-600 text-white py-3 px-8 font-medium text-lg hover:bg-purple-700 transition rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Finalize Order"}
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-center mt-6 text-sm">
        *After finalizing your order, you will be redirected to the payment
        page.
      </p>
    </div>
  );
};

export default PlaceOrder;
