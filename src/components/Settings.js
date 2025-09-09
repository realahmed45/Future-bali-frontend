import React, { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

  // State for form fields
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleAccountSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://future-bali-backend-1.onrender.com/update-account-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            phone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Account details updated successfully!");
      } else {
        alert(data.message || "Failed to update account details");
      }
    } catch (error) {
      console.error("Error updating account details:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleCardSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://future-bali-backend-1.onrender.com/card-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email,
            phone,
            country,
            address,
            additionalDetails,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message || "Failed to update card details");
      }
    } catch (error) {
      console.error("Error updating card details:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-lg mx-auto max-w-3xl">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 text-lg font-semibold border-b-4 transition-all duration-300 ${
            activeTab === "account"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("account")}
        >
          Account Settings
        </button>
        <button
          className={`px-6 py-2 text-lg font-semibold border-b-4 transition-all duration-300 ${
            activeTab === "card"
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("card")}
        >
          Card Details
        </button>
      </div>

      {/* Account Settings Form */}
      {activeTab === "account" && (
        <div className="bg-white p-6 rounded-md shadow">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Update Account Details
          </h3>
          <form onSubmit={handleAccountSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setfirstname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setlastname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-md"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Card Details Form */}
      {activeTab === "card" && (
        <div className="bg-white p-6 rounded-md shadow">
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            Update Card Details
          </h3>
          <form onSubmit={handleCardSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setfirstname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setlastname(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Additional Details
              </label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-md"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;
