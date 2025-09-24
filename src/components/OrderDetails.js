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
  const [activeTab, setActiveTab] = useState("overview");

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

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
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

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "customers", label: "Customer Details", icon: "👤" },
    { id: "inheritance", label: "Inheritance Contacts", icon: "👨‍👩‍👧‍👦" },
    { id: "emergency", label: "Emergency Contacts", icon: "🚨" },
    { id: "billing", label: "Billing Details", icon: "💳" },
  ];

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
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Order Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
        >
          ← Back
        </button>
      </div>

      {/* Order Status Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Order #{order._id.slice(-8).toUpperCase()}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus || "Unknown"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.paymentStatus
                )}`}
              >
                Payment: {order.paymentStatus || "Unknown"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              ${order.totalAmount?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Order ID:</strong> #
                      {order._id.slice(-8).toUpperCase()}
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
                      <strong>Created:</strong> {formatDate(order.createdAt)}
                    </p>
                    <p>
                      <strong>Updated:</strong> {formatDate(order.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Method:</strong> Bank Transfer (Online)
                    </p>
                    {order.paymentDetails?.transactionId && (
                      <p>
                        <strong>Transaction ID:</strong>{" "}
                        {order.paymentDetails.transactionId}
                      </p>
                    )}
                    {order.paymentDetails?.paymentDate && (
                      <p>
                        <strong>Payment Date:</strong>{" "}
                        {formatDate(order.paymentDetails.paymentDate)}
                      </p>
                    )}
                    {order.paymentDetails?.amount && (
                      <p>
                        <strong>Paid Amount:</strong> $
                        {order.paymentDetails.amount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Details */}
              {order.basePackage && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Package Details
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg mb-2">
                      {order.basePackage.title}
                    </h4>
                    <p className="text-gray-600 text-lg font-medium mb-3">
                      ${order.basePackage.price?.toLocaleString()}
                    </p>
                    {order.basePackage.duration && (
                      <p className="text-gray-600 mb-3">
                        Duration: {order.basePackage.duration}
                      </p>
                    )}
                    {order.basePackage.details && (
                      <div>
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
                <div>
                  <h3 className="font-semibold text-lg mb-4">Add-ons</h3>
                  <div className="space-y-2">
                    {order.selectedAddOns.map((addon, index) => (
                      <div
                        key={index}
                        className="bg-green-50 p-3 rounded-lg flex justify-between items-center"
                      >
                        <span className="font-medium">
                          {addon.room} {addon.size && `(${addon.size})`}
                        </span>
                        <span className="font-bold text-green-700">
                          ${addon.price?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="bg-green-100 p-3 rounded-lg flex justify-between items-center font-bold">
                      <span>Total Add-ons:</span>
                      <span className="text-green-800">
                        $
                        {order.selectedAddOns
                          .reduce((sum, addon) => sum + (addon.price || 0), 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customer Details Tab */}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-xl mb-4">
                Customer Information
              </h3>
              {order.userInfo && order.userInfo.length > 0 ? (
                <div className="space-y-6">
                  {order.userInfo.map((user, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg mb-4 text-purple-600">
                        Customer {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="mb-2">
                            <strong>Full Name:</strong> {user.name}
                          </p>
                          <p className="mb-2">
                            <strong>Email:</strong> {user.email}
                          </p>
                          <p className="mb-2">
                            <strong>Phone:</strong> {user.phone}
                          </p>
                          <p className="mb-2">
                            <strong>Date of Birth:</strong> {user.dob}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2">
                            <strong>Country:</strong> {user.country}
                          </p>
                          <p className="mb-2">
                            <strong>Address:</strong> {user.address}
                          </p>
                          <p className="mb-2">
                            <strong>Passport/ID:</strong> {user.passportId}
                          </p>
                        </div>
                      </div>

                      {/* Document Images */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-medium mb-3">Identity Documents</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {user.frontImage && (
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">
                                Front ID/Passport
                              </p>
                              <div className="bg-white p-2 rounded border">
                                {user.frontImage.startsWith(
                                  "data:application/pdf"
                                ) ? (
                                  <div className="text-center py-8">
                                    <span className="text-4xl">📄</span>
                                    <p className="text-sm text-gray-600 mt-2">
                                      PDF Document
                                    </p>
                                  </div>
                                ) : (
                                  <img
                                    src={user.frontImage}
                                    alt="Front ID"
                                    className="w-full h-32 object-contain"
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {user.backImage && (
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">
                                Back ID/Passport
                              </p>
                              <div className="bg-white p-2 rounded border">
                                {user.backImage.startsWith(
                                  "data:application/pdf"
                                ) ? (
                                  <div className="text-center py-8">
                                    <span className="text-4xl">📄</span>
                                    <p className="text-sm text-gray-600 mt-2">
                                      PDF Document
                                    </p>
                                  </div>
                                ) : (
                                  <img
                                    src={user.backImage}
                                    alt="Back ID"
                                    className="w-full h-32 object-contain"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <span className="text-4xl mb-4 block">👤</span>
                  <p>No customer information available</p>
                </div>
              )}
            </div>
          )}

          {/* Inheritance Contacts Tab */}
          {activeTab === "inheritance" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-xl mb-4">
                Inheritance Contacts
              </h3>
              {order.inheritanceContacts &&
              order.inheritanceContacts.length > 0 ? (
                <div className="space-y-4">
                  {order.inheritanceContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400"
                    >
                      <h4 className="font-semibold text-lg mb-3 text-red-700">
                        Inheritance Contact {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="mb-2">
                            <strong>Name:</strong> {contact.name}
                          </p>
                          <p className="mb-2">
                            <strong>Phone:</strong> {contact.phoneNumber}
                          </p>
                          {contact.passportId && (
                            <p className="mb-2">
                              <strong>Passport ID:</strong> {contact.passportId}
                            </p>
                          )}
                          {contact.percentage && (
                            <p className="mb-2">
                              <strong>Inheritance %:</strong>{" "}
                              {contact.percentage}%
                            </p>
                          )}
                        </div>

                        {/* Passport Image */}
                        {contact.passportImage && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Passport Document
                            </p>
                            <div className="bg-white p-2 rounded border">
                              {contact.passportImage.startsWith(
                                "data:application/pdf"
                              ) ? (
                                <div className="text-center py-8">
                                  <span className="text-4xl">📄</span>
                                  <p className="text-sm text-gray-600 mt-2">
                                    PDF Document
                                  </p>
                                </div>
                              ) : (
                                <img
                                  src={contact.passportImage}
                                  alt={`Passport - ${contact.name}`}
                                  className="w-full h-32 object-contain"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <span className="text-4xl mb-4 block">👨‍👩‍👧‍👦</span>
                  <p>No inheritance contacts specified</p>
                </div>
              )}
            </div>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === "emergency" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-xl mb-4">Emergency Contacts</h3>
              {order.emergencyContacts && order.emergencyContacts.length > 0 ? (
                <div className="space-y-4">
                  {order.emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400"
                    >
                      <h4 className="font-semibold text-lg mb-3 text-yellow-700">
                        Emergency Contact {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="mb-2">
                            <strong>Name:</strong> {contact.name}
                          </p>
                          <p className="mb-2">
                            <strong>Phone:</strong> {contact.phoneNumber}
                          </p>
                          {contact.passportId && (
                            <p className="mb-2">
                              <strong>ID/Passport:</strong> {contact.passportId}
                            </p>
                          )}
                        </div>

                        {/* ID Image */}
                        {contact.idImage && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              ID Document
                            </p>
                            <div className="bg-white p-2 rounded border">
                              {contact.idImage.startsWith(
                                "data:application/pdf"
                              ) ? (
                                <div className="text-center py-8">
                                  <span className="text-4xl">📄</span>
                                  <p className="text-sm text-gray-600 mt-2">
                                    PDF Document
                                  </p>
                                </div>
                              ) : (
                                <img
                                  src={contact.idImage}
                                  alt={`ID - ${contact.name}`}
                                  className="w-full h-32 object-contain"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <span className="text-4xl mb-4 block">🚨</span>
                  <p>No emergency contacts specified</p>
                </div>
              )}
            </div>
          )}

          {/* Billing Details Tab */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <h3 className="font-semibold text-xl mb-4">Billing Details</h3>
              {order.billingDetails ? (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2">
                        <strong>First Name:</strong>{" "}
                        {order.billingDetails.firstName}
                      </p>
                      <p className="mb-2">
                        <strong>Last Name:</strong>{" "}
                        {order.billingDetails.lastName}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {order.billingDetails.email}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {order.billingDetails.phone}
                      </p>
                    </div>
                    <div>
                      <p className="mb-2">
                        <strong>Country:</strong> {order.billingDetails.country}
                      </p>
                      <p className="mb-2">
                        <strong>Address:</strong> {order.billingDetails.address}
                      </p>
                      {order.billingDetails.notes && (
                        <p className="mb-2">
                          <strong>Notes:</strong> {order.billingDetails.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <span className="text-4xl mb-4 block">💳</span>
                  <p>No billing details available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        {(order.orderStatus === "confirmed" ||
          order.orderStatus === "completed") && (
          <button
            onClick={() => navigate(`/contract/${order._id}`)}
            className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition duration-300 text-lg font-medium"
          >
            📄 View Contract
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 transition duration-300 text-lg font-medium"
        >
          🖨️ Print Details
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
