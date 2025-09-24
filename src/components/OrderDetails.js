// OrderDetails.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://future-bali-backend-production.up.railway.app";

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  if (error)
    return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!order) return <div className="text-center py-8">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
        >
          Back
        </button>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Order Information</h3>
          <p>
            <strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}
          </p>
          <p>
            <strong>Status:</strong> {order.orderStatus}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Total Amount:</strong> $
            {order.totalAmount?.toLocaleString()}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">Payment Information</h3>
          <p>
            <strong>Method:</strong> Bank Transfer (Online)
          </p>
          {order.paymentDetails?.transactionId && (
            <p>
              <strong>Transaction ID:</strong>{" "}
              {order.paymentDetails.transactionId}
            </p>
          )}
        </div>
      </div>

      {/* Package Details */}
      {order.basePackage && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Package Details</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-lg">{order.basePackage.title}</h4>
            <p className="text-gray-600">
              ${order.basePackage.price?.toLocaleString()}
            </p>
            {order.basePackage.details && (
              <div className="mt-3">
                <h5 className="font-medium mb-2">Included:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {order.basePackage.details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {detail.label} - {detail.size}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add-ons */}
      {order.selectedAddOns && order.selectedAddOns.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Add-ons</h3>
          <div className="space-y-2">
            {order.selectedAddOns.map((addon, index) => (
              <div
                key={index}
                className="bg-green-50 p-3 rounded-lg flex justify-between"
              >
                <span>
                  {addon.room} {addon.size && `(${addon.size})`}
                </span>
                <span className="font-medium">
                  ${addon.price?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Information */}
      {order.userInfo && order.userInfo.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
          <div className="space-y-4">
            {order.userInfo.map((user, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Customer {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong> {user.dob}
                  </p>
                  <p>
                    <strong>Country:</strong> {user.country}
                  </p>
                  <p>
                    <strong>Passport ID:</strong> {user.passportId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        {(order.orderStatus === "confirmed" ||
          order.orderStatus === "completed") && (
          <button
            onClick={() => navigate(`/contract/${order._id}`)}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
          >
            View Contract
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
