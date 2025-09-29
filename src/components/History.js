import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();

  // Backend URL
  const API_BASE_URL = "https://future-bali-backend-production.up.railway.app";

  useEffect(() => {
    fetchOrderHistory();
  }, [currentPage]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("Authentication required. Please login first.");
      }

      console.log("[History] Fetching order history for page:", currentPage);

      const response = await axios.get(
        `${API_BASE_URL}/api/orders/user-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            page: currentPage,
            limit: 10,
          },
          timeout: 30000,
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination || {});

        console.log("[History] Orders fetched successfully:", {
          count: response.data.orders?.length || 0,
          pagination: response.data.pagination,
        });
      } else {
        throw new Error(
          response.data.message || "Failed to fetch order history"
        );
      }
    } catch (error) {
      console.error("[History] Error fetching orders:", error);

      let errorMessage = "Failed to load order history";

      if (error.response?.status === 401) {
        errorMessage = "Authentication expired. Please login again.";
        localStorage.removeItem("authToken");
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.status === 404) {
        errorMessage = "No orders found";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "processing":
        return "text-purple-600 bg-purple-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "refunded":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewDetails = (orderId) => {
    console.log("Navigating to order details:", orderId);
    navigate(`/order-details/${orderId}`);
  };

  const handleRetry = () => {
    fetchOrderHistory();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Order History
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">
            Loading your order history...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Order History
        </h2>
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        My Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M7 7h.01M7 3h5v3H7V3z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No orders found.</p>
          <p className="text-gray-500 text-sm mt-2">
            Your order history will appear here once you place your first order.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-300 border border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      {order.contractNumber && (
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                          Contract #{order.contractNumber}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus || "Pending"}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getPaymentStatusColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <p>
                        <span className="font-medium text-purple-600">
                          Date:
                        </span>{" "}
                        {formatDate(order.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium text-purple-600">
                          Total:
                        </span>{" "}
                        <span className="font-bold text-lg text-gray-800">
                          ${order.totalAmount?.toLocaleString() || "N/A"}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-purple-600">
                          Package:
                        </span>{" "}
                        {order.basePackage?.title || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-purple-600">
                          Add-ons:
                        </span>{" "}
                        {order.selectedAddOns?.length || 0} items
                      </p>
                    </div>

                    {order.userInfo && order.userInfo.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-purple-600">
                            Customer:
                          </span>{" "}
                          {order.userInfo[0].name} (
                          {order.userInfo[0].email || order.userInfo[0].phone})
                        </p>
                        {order.userInfo.length > 1 && (
                          <p className="text-xs text-gray-500">
                            +{order.userInfo.length - 1} additional customer(s)
                          </p>
                        )}
                      </div>
                    )}

                    {order.paymentDetails?.transactionId && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Transaction ID: {order.paymentDetails.transactionId}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleViewDetails(order._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300 text-sm whitespace-nowrap"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  pagination.hasPrev
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <span className="text-gray-500 text-sm">
                  ({pagination.totalCount} total orders)
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  pagination.hasNext
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
