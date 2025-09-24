// ContractView.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ContractPDFGenerator from "./ContractPDFGenerator"; // Your existing component

const ContractView = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [contractData, setContractData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfRef = useRef();

  const API_BASE_URL = "https://future-bali-backend-production.up.railway.app";

  useEffect(() => {
    fetchContractData();
  }, [orderId]);

  const fetchContractData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${API_BASE_URL}/api/contract/data/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );

      if (response.data.success) {
        setContractData(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch contract data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (pdfRef.current) {
        await pdfRef.current.generatePDF();
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
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
  if (!contractData)
    return <div className="text-center py-8">Contract not found</div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Villa Investment Contract
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Contract Preview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <ContractPDFGenerator ref={pdfRef} contractData={contractData} />
      </div>
    </div>
  );
};

export default ContractView;
