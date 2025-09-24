import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ContractPDFGenerator from "./ContractPDFGenerator";

const PaymentSuccessModal = ({
  showModal,
  handleClose,
  paymentInfo,
  onDownloadContract,
  isGeneratingPDF,
}) => {
  if (!showModal) return null;

  // Calculate the pay now amount (90% of total)
  const payNowAmount = Math.round(paymentInfo.totalAmount * 0.9);

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
            Payment Confirmed!
          </h2>
          <p className="text-green-100">Your order has been processed</p>
        </div>

        {/* Payment Details */}
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold">{paymentInfo.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Investment:</span>
              <span className="font-semibold text-purple-600">
                ${paymentInfo.totalAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid Now:</span>
              <span className="font-semibold text-green-600 text-lg">
                ${payNowAmount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold">Bank Transfer</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm mb-3">
              ✅ Contract emails will be sent automatically in 10 mins to all
              parties.
            </p>
            <p className="text-green-700 text-xs">
              • Customer email: Contract copy delivered
              <br />• Admin team: Notified of new contract
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={onDownloadContract}
              disabled={isGeneratingPDF}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
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
              <span>
                {isGeneratingPDF ? "Generating..." : "Download Contract PDF"}
              </span>
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

const BankDetailsModal = ({ showModal, onConfirm, onCancel, payNowAmount }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center flex-shrink-0">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bank Transfer</h2>
          <p className="text-blue-100">Please transfer the amount below</p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Amount to Pay */}
          <div className="bg-green-50 p-4 rounded-lg mb-6 text-center">
            <p className="text-green-700 text-sm mb-1">Amount to Transfer:</p>
            <p className="text-3xl font-bold text-green-600">${payNowAmount}</p>
            <p className="text-green-600 text-xs mt-1">
              (90% of total investment)
            </p>
          </div>

          {/* Bank Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Transfer to this account (USD):
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-semibold">Future Life Bali</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-semibold">Future Life Bali</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank:</span>
                <span className="font-semibold">BRI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-semibold">2134-02-000056-50-5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Swift Code:</span>
                <span className="font-semibold">BRINIDJA</span>
              </div>
              <div className="flex justify-between align-top">
                <span className="text-gray-600">Address:</span>
                <span className="font-semibold text-right">
                  Jl. By Pass Ngurah Rai
                  <br />
                  NO 888xx
                  <br />
                  Denpasar 80221
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Currency:</span>
                <span className="font-semibold text-green-600">USD 🇺🇸</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-semibold text-blue-600">
                  Villa Investment
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">
              Instructions:
            </h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Transfer the exact amount: ${payNowAmount}</li>
              <li>Use "Villa Investment" as reference</li>
              <li>Send transfer screenshot to WhatsApp: +62 818-1818-5522</li>
              <li>Click "I've Sent the Money" below after transfer</li>
            </ol>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 p-6 pt-0 space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            I've Sent the Money
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pdfGeneratorRef = useRef();

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
  const [showBankModal, setShowBankModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);

  // Calculate pay now amount (90% of total)
  const totalAmount = orderData?.totalAmount || calculatedTotal;
  const payNowAmount = Math.round(totalAmount * 0.9);

  // Fetch complete order data
  const fetchOrderData = async () => {
    try {
      if (!orderId) {
        console.log("[Payment] No order ID provided");
        return null;
      }

      console.log("[Payment] Fetching order data from database:", orderId);

      const response = await axios.get(
        `https://future-bali-backend-production.up.railway.app/api/orders/${orderId}`
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

  // Generate PDF and get base64 data
  const generatePDFData = async () => {
    if (!orderData) {
      throw new Error("Order data not available");
    }

    try {
      console.log("[Payment] Generating PDF for email...");

      // Generate PDF using the existing component
      const pages = document.querySelectorAll(".contract-page");
      const { jsPDF } = await import("jspdf");
      const html2canvas = (await import("html2canvas")).default;

      const pdf = new jsPDF("p", "mm", "a4");

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        const canvas = await html2canvas(pages[i], {
          scale: 10,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: pages[i].offsetWidth,
          height: pages[i].offsetHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.6);
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      }

      // Get PDF as base64
      const pdfBase64 = pdf.output("datauristring");
      console.log("[Payment] PDF generated successfully");

      return pdfBase64;
    } catch (error) {
      console.error("[Payment] Error generating PDF:", error);
      throw error;
    }
  };

  // Automatically send contract emails
  const sendContractEmails = async () => {
    if (!orderData) {
      throw new Error("Order data not available");
    }

    setIsEmailSending(true);

    try {
      console.log("[Payment] Automatically sending contract emails...");

      // Generate PDF data
      const pdfBase64 = await generatePDFData();

      // Send to backend email service with Resend API
      const response = await axios.post(
        "https://future-bali-backend-production.up.railway.app/api/email/send-contract",
        {
          orderId: orderId,
          pdfBase64: pdfBase64,
          customerEmail: orderData.userInfo?.[0]?.email || orderData.userEmail,
          customerName: orderData.userInfo?.[0]?.name || "Customer",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 180000,
        }
      );

      if (response.data.success) {
        console.log("[Payment] Emails sent successfully:", response.data);
        return true;
      } else {
        throw new Error(response.data.message || "Failed to send emails");
      }
    } catch (error) {
      console.error("[Payment] Email sending failed:", error);
      // Don't block the flow, just log the error
      return false;
    } finally {
      setIsEmailSending(false);
    }
  };

  // Generate PDF for download
  const generateAndDownloadContract = async () => {
    if (!orderData) {
      alert("Order data not available. Please try again.");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      console.log("[Payment] Generating PDF for download...");
      await pdfGeneratorRef.current.generatePDF();
      console.log("[Payment] PDF downloaded successfully");
    } catch (error) {
      console.error("[Payment] Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePayment = async () => {
    if (!orderId) {
      alert("Order ID is missing. Please try again.");
      return;
    }

    // Show bank details modal
    setShowBankModal(true);
  };

  const handlePaymentConfirmation = async () => {
    setShowBankModal(false);
    setIsLoading(true);

    try {
      // Fetch complete order data from database first
      const fullOrderData = orderData || (await fetchOrderData());

      if (!fullOrderData) {
        alert("Could not load order data. Please try again.");
        return;
      }

      setOrderData(fullOrderData);

      const totalAmount = fullOrderData.totalAmount || calculatedTotal;

      // Update order in database with payment information
      const response = await axios.put(
        `https://future-bali-backend-production.up.railway.app/api/orders/${orderId}`,
        {
          paymentDetails: {
            paymentMethod: "Bank Transfer",
            paymentDate: new Date().toISOString(),
            amount: totalAmount,
            status: "pending_verification",
          },
          paymentStatus: "pending",
          orderStatus: "confirmed",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      if (response.data.success) {
        console.log("[Payment] Order updated successfully");

        // Automatically send contract emails
        await sendContractEmails();

        setPaymentInfo({
          orderId: orderId,
          totalAmount: totalAmount,
          paymentMethod: "Bank Transfer",
        });
        setShowModal(true);
      } else {
        throw new Error(response.data.message || "Failed to update order");
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
      {/* Hidden PDF Generator Component */}
      <ContractPDFGenerator ref={pdfGeneratorRef} contractData={orderData} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          Complete Your Payment
        </h1>
        <p className="text-gray-600">
          Review your order details and complete the payment process
        </p>
      </div>

      {/* Order Summary Section - Complete Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

        {/* Customer Information */}
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
                        Passport:
                      </span>
                      <span className="ml-2">{user.passportId}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-blue-800">Address:</span>
                    <span className="ml-2">{user.address}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Base Package */}
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
            {orderData?.basePackage?.duration && (
              <p className="text-sm text-gray-600 mb-3">
                Duration: {orderData.basePackage.duration}
              </p>
            )}
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

        {/* Add-ons */}
        {((orderData?.selectedAddOns && orderData.selectedAddOns.length > 0) ||
          (selectedAddOns && selectedAddOns.length > 0)) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-600 mb-3">
              Selected Add-ons (New size)
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

        {/* Inheritance Contacts */}
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
                            Passport:
                          </span>
                          <span className="ml-2 text-green-700">
                            {contact.passportId}
                          </span>
                        </div>
                      )}
                      {contact.percentage && (
                        <div>
                          <span className="font-medium text-green-800">
                            Share:
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

        {/* Emergency Contacts */}
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
                            Passport:
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

        {/* Billing Details */}
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

        {/* Total Investment */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-xl font-bold mb-3">
            <span>Total Investment</span>
            <span className="text-purple-600">${totalAmount}</span>
          </div>

          {/* Pay Now Amount */}
          <div className="flex justify-between items-center text-lg font-semibold bg-green-50 p-3 rounded-lg">
            <span className="text-green-800">Pay Now (90%)</span>
            <span className="text-green-600">${payNowAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Section with Bank Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Payment Method
        </h3>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h4 className="text-lg font-semibold text-blue-800">
              Bank Transfer (USD)
            </h4>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Company:</span>
                <span className="ml-2 font-semibold">Future Life Bali</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Account Name:</span>
                <span className="ml-2 font-semibold">Future Life Bali</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Bank:</span>
                <span className="ml-2 font-semibold">BRI</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Account Number:
                </span>
                <span className="ml-2 font-semibold text-blue-600">
                  2134-02-000056-50-5
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Swift Code:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  BRINIDJA
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Currency:</span>
                <span className="ml-2 font-semibold text-green-600">
                  USD 🇺🇸
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Bank Address:</span>
                <span className="ml-2 font-semibold">
                  Jl. By Pass Ngurah Rai NO 888xx, Denpasar 80221
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              📝 Transfer Instructions:
            </p>
            <ul className="text-yellow-700 text-xs mt-2 space-y-1">
              <li>
                • Transfer exactly ${payNowAmount} (90% of total investment)
              </li>
              <li>• Use "Villa Investment" as reference</li>
              <li>• Send screenshot to WhatsApp: +62 818-1818-5522</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 text-lg font-bold mb-2">
              Amount to Pay now OR within 2 weeks: ${payNowAmount}
            </p>
            <p className="text-green-700 text-sm">
              (90% of total investment - remaining 10% due later)
            </p>
          </div>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? "Processing..." : `Pay Now - ${payNowAmount}`}
          </button>
        </div>
      </div>

      {/* Bank Details Modal */}
      <BankDetailsModal
        showModal={showBankModal}
        onConfirm={handlePaymentConfirmation}
        onCancel={() => setShowBankModal(false)}
        payNowAmount={payNowAmount}
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        showModal={showModal}
        handleClose={handleCloseModal}
        paymentInfo={paymentInfo}
        onDownloadContract={generateAndDownloadContract}
        isGeneratingPDF={isGeneratingPDF}
      />

      {/* Loading overlay for email sending and PDF generation */}
      {(isEmailSending || isGeneratingPDF) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-700 font-medium">
              {isEmailSending
                ? "Sending Contract Emails..."
                : "Generating Contract PDF..."}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              This may take a few moments
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
