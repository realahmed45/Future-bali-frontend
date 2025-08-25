import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import emailjs from "@emailjs/browser";

// Initialize EmailJS
emailjs.init("Q7YaSuUUOzO-j_ffb"); // Replace with your actual public key

// Enhanced Modal Component for Payment Success
const PaymentSuccessModal = ({
  showModal,
  handleClose,
  paymentInfo,
  contractUrl,
}) => {
  if (!showModal) return null;

  const downloadContract = () => {
    if (contractUrl) {
      window.open(contractUrl, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Payment Successful!
          </h2>
          <p className="text-green-100">Your order has been confirmed</p>
        </div>

        {/* Payment Details */}
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-semibold">{paymentInfo.transactionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold text-green-600">
                ${paymentInfo.amountPaid}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold">PayPal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm mb-3">
              📧 A confirmation email has been sent with contract download link.
            </p>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={downloadContract}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download Your Contract PDF</span>
            </button>
          </div>

          <button
            onClick={handleClose}
            className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("[Payment] Location state:", state);

  // Extract all order data
  const {
    basePackage = {
      title: "Furnished 1 bedroom house",
      price: 31000,
    },
    selectedAddOns = [],
    billingDetails = {},
    orderId,
    totalCost,
  } = state || {};

  const calculatedTotal =
    totalCost ||
    basePackage.price +
      selectedAddOns.reduce((sum, addOn) => sum + (addOn.price || 0), 0);

  const [showModal, setShowModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [contractUrl, setContractUrl] = useState(null);

  // Fetch complete order data
  const fetchOrderData = async () => {
    try {
      if (!orderId) {
        console.log("[Payment] No order ID provided");
        return null;
      }

      console.log("[Payment] Fetching order data from database:", orderId);

      const response = await axios.get(
        `https://future-bali-backend-1.onrender.com/api/orders/${orderId}`
      );

      if (response.data.success) {
        console.log(
          "[Payment] Order data fetched from database:",
          response.data.order
        );
        return response.data.order;
      } else {
        console.error(
          "[Payment] Failed to fetch order:",
          response.data.message
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      return null;
    }
  };

  // Fetch order data on component mount
  useEffect(() => {
    const loadOrderData = async () => {
      if (orderId) {
        setIsLoading(true);
        const fetchedOrder = await fetchOrderData();
        if (fetchedOrder) {
          setOrderData(fetchedOrder);
        }
        setIsLoading(false);
      }
    };

    loadOrderData();
  }, [orderId]);

  // Send simple email with download link (NO PDF ATTACHMENT)
  const sendSimpleEmail = async (contractData) => {
    try {
      console.log("[Payment] Sending simple email via EmailJS...");

      const templateParams = {
        to_email: contractData.customerEmail,
        to_name: contractData.customerName,
        order_id: contractData.orderId,
        total_amount: contractData.totalAmount,
        transaction_id: contractData.transactionId,
        package_title: contractData.packageTitle,
        download_link: `${window.location.origin}/api/contracts/download/${contractData.orderId}`,
        from_name: "My Future Life Bali",
      };

      console.log("[Payment] Email template params:", templateParams);

      // Send email via EmailJS (NO ATTACHMENT)
      const emailResult = await emailjs.send(
        "service_1xbcnks", // Replace with your Service ID
        "template_en3ml57", // Replace with your Template ID
        templateParams,
        "Q7YaSuUUOzO-j_ffb" // Replace with your Public Key
      );

      console.log("[Payment] Simple email sent successfully:", emailResult);
      return emailResult;
    } catch (error) {
      console.error("[Payment] Email sending failed:", error);
      alert(
        "Payment successful! Email sending failed, but you can download your contract below."
      );
    }
  };

  const handlePayment = async (type) => {
    if (!orderId) {
      alert("Order ID is missing. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Fetch complete order data from database first
      const fullOrderData = orderData || (await fetchOrderData());

      if (!fullOrderData) {
        alert("Could not load order data. Please try again.");
        return;
      }

      setOrderData(fullOrderData);

      const paymentAmount =
        type === "full" ? fullOrderData.totalAmount || calculatedTotal : 2000;
      const transactionId = `TXN${Date.now()}${Math.random()
        .toString(36)
        .substr(2, 4)
        .toUpperCase()}`;

      const paymentDetails = {
        transactionId,
        amountPaid: paymentAmount,
        paymentType: type,
        paymentMethod: "PayPal",
        paymentDate: new Date().toISOString(),
      };

      console.log("[Payment] Generating contract with real database data...");

      // Generate contract (simple version)
      const response = await axios.post(
        "https://future-bali-backend-1.onrender.com/api/contracts/generate",
        {
          orderId,
          paymentDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      if (response.data.success) {
        console.log(
          "[Payment] Contract generated successfully, sending email..."
        );

        // Set contract download URL
        const downloadUrl = `https://future-bali-backend-1.onrender.com/api/contracts/download/${orderId}`;
        setContractUrl(downloadUrl);

        // Send simple email (no attachment)
        await sendSimpleEmail({
          customerEmail:
            fullOrderData.userInfo?.[0]?.email || fullOrderData.userEmail,
          customerName: fullOrderData.userInfo?.[0]?.name || "Customer",
          orderId,
          totalAmount: fullOrderData.totalAmount,
          transactionId,
          packageTitle: fullOrderData.basePackage?.title,
        });

        setPaymentInfo(paymentDetails);
        setShowModal(true);
      } else {
        throw new Error(response.data.message || "Failed to generate contract");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("Payment processing failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/", {
      state: {
        paymentInfo,
        orderData,
        orderId,
      },
    });
  };

  // Show loading state while fetching order data
  if (isLoading && !orderData) {
    return (
      <div className="bg-gray-50 min-h-screen py-8 px-6 md:px-16">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">
            Loading order data from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6 md:px-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          Complete Your Payment
        </h1>
        <p className="text-gray-600">
          Review your order details and complete the payment process
        </p>
      </div>

      {/* Order Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

        {/* Customer Information - FROM REAL DATABASE */}
        {orderData?.userInfo && orderData.userInfo.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-600 mb-3">
              Customer Information
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              {orderData.userInfo.map((user, index) => (
                <div
                  key={index}
                  className="mb-4 pb-4 border-b border-blue-200 last:border-b-0 last:mb-0 last:pb-0"
                >
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Person {index + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <span className="font-medium text-blue-800">Name:</span>
                      <span className="ml-2">{user.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Email:</span>
                      <span className="ml-2">{user.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Phone:</span>
                      <span className="ml-2">{user.phone}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">
                        Country:
                      </span>
                      <span className="ml-2">{user.country}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">DOB:</span>
                      <span className="ml-2">{user.dob}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">
                        Passport/ID:
                      </span>
                      <span className="ml-2">{user.passportId}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">
                        Address:
                      </span>
                      <span className="ml-2">{user.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Base Package - FROM REAL DATABASE */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-purple-600 mb-3">
            Base Package
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-lg">
                {orderData?.basePackage?.title || basePackage.title}
              </span>
              <span className="font-bold text-purple-600 text-xl">
                ${orderData?.basePackage?.price || basePackage.price}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Duration:{" "}
              {orderData?.basePackage?.duration || basePackage.duration} • Fully
              furnished villa
            </p>
            {orderData?.basePackage?.details && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {orderData.basePackage.details.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 rounded border border-purple-200"
                  >
                    <span className="font-medium text-purple-800">
                      {detail.label}:
                    </span>
                    <span className="ml-1 text-purple-700">{detail.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add-ons - FROM REAL DATABASE */}
        {((orderData?.selectedAddOns && orderData.selectedAddOns.length > 0) ||
          (selectedAddOns && selectedAddOns.length > 0)) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-600 mb-3">
              Selected Add-ons
            </h3>
            <div className="space-y-2">
              {(orderData?.selectedAddOns || selectedAddOns).map(
                (addOn, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded border"
                  >
                    <div>
                      <span className="font-medium">{addOn.room}</span>
                      {addOn.size && (
                        <span className="text-gray-600 ml-2">
                          ({addOn.size})
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-green-600">
                      ${addOn.price}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Inheritance Contacts - FROM REAL DATABASE */}
        {orderData?.inheritanceContacts &&
          orderData.inheritanceContacts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-600 mb-3">
                Inheritance Contacts
              </h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                {orderData.inheritanceContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-green-200"
                  >
                    <h4 className="font-semibold text-green-800 mb-2">
                      Contact {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-medium text-green-800">
                          Name:
                        </span>
                        <span className="ml-2 text-green-700">
                          {contact.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">
                          Phone:
                        </span>
                        <span className="ml-2 text-green-700">
                          {contact.phoneNumber}
                        </span>
                      </div>
                      {contact.passportId && (
                        <div>
                          <span className="font-medium text-green-800">
                            Passport/ID:
                          </span>
                          <span className="ml-2 text-green-700">
                            {contact.passportId}
                          </span>
                        </div>
                      )}
                      {contact.percentage && (
                        <div>
                          <span className="font-medium text-green-800">
                            Inheritance Share:
                          </span>
                          <span className="ml-2 text-green-700 font-bold bg-green-100 px-2 py-1 rounded">
                            {contact.percentage}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Emergency Contacts - FROM REAL DATABASE */}
        {orderData?.emergencyContacts &&
          orderData.emergencyContacts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-600 mb-3">
                Emergency Contacts
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
                {orderData.emergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-yellow-200"
                  >
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      Emergency Contact {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="font-medium text-yellow-800">
                          Name:
                        </span>
                        <span className="ml-2 text-yellow-700">
                          {contact.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-yellow-800">
                          Phone:
                        </span>
                        <span className="ml-2 text-yellow-700">
                          {contact.phoneNumber}
                        </span>
                      </div>
                      {contact.passportId && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-yellow-800">
                            Passport/ID:
                          </span>
                          <span className="ml-2 text-yellow-700">
                            {contact.passportId}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Billing Details - If Available */}
        {orderData?.billingDetails && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-600 mb-3">
              Billing Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-800">Name:</span>
                  <span className="ml-2">
                    {orderData.billingDetails.firstName}{" "}
                    {orderData.billingDetails.lastName}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Email:</span>
                  <span className="ml-2">{orderData.billingDetails.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Phone:</span>
                  <span className="ml-2">{orderData.billingDetails.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Country:</span>
                  <span className="ml-2">
                    {orderData.billingDetails.country}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-800">Address:</span>
                  <span className="ml-2">
                    {orderData.billingDetails.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Total - CALCULATED FROM REAL DATABASE DATA */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Investment</span>
            <span className="text-purple-600">
              ${orderData?.totalAmount || calculatedTotal}
            </span>
          </div>
          {orderData && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                ✅ <strong>Order data loaded from database</strong> (Order ID:{" "}
                {orderData._id})
              </p>
              <p className="text-xs text-green-600 mt-1">
                All customer information, contacts, and package details verified
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Select Payment Method
          </h3>
          <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
            <label className="flex items-center space-x-3">
              <input
                type="radio"
                name="payment"
                className="w-5 h-5 text-purple-600"
                defaultChecked
              />
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium text-lg">
                  PayPal
                </span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  Recommended
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Card Details */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Card Details
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-2">
                Card Holder
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={
                  orderData?.userInfo?.[0]?.name ||
                  `${billingDetails.firstName || ""} ${
                    billingDetails.lastName || ""
                  }`
                }
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Buttons */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">
            Choose Your Payment Option
          </h3>

          <div className="space-y-4">
            <button
              onClick={() => handlePayment("full")}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading
                ? "Processing..."
                : `Pay Full Amount $${
                    orderData?.totalAmount || calculatedTotal
                  }`}
            </button>

            <div className="flex items-center justify-center space-x-4">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-gray-500 font-semibold">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <button
              onClick={() => handlePayment("partial")}
              disabled={isLoading}
              className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white py-4 px-8 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? "Processing..." : "Pay $2000 Deposit"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Deposit Option:</strong> Pay $2000 deposit via PayPal
              and transfer the remaining amount to our bank account within 1
              week. Send transfer screenshot via WhatsApp.
            </p>
          </div>
        </div>
      </div>

      <PaymentSuccessModal
        showModal={showModal}
        handleClose={handleCloseModal}
        paymentInfo={paymentInfo}
        contractUrl={contractUrl}
      />
    </div>
  );
};

export default Payment;
