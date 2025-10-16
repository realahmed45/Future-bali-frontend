import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTextConfig } from "../hooks/useTextConfig";

const Package1 = () => {
  const navigate = useNavigate();
  const { textConfig, loading, error } = useTextConfig();
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  const getMinimumSizes = (packageType = 1) => {
    if (packageType === 1) {
      return [
        { label: "1 Bedroom", size: "30" },
        { label: "1 Bathroom", size: "9" },
        { label: "Kitchen", size: "7" },
        { label: "Storage", size: "" },
        { label: "Garden", size: "80" },
        { label: "Living room", size: "10" },
      ];
    }
    return [];
  };

  const minimumSizes = getMinimumSizes(1);

  useEffect(() => {
    console.log("[Package1] Component mounted");
    console.log("[Package1] Initial selectedAddOns:", selectedAddOns);
    return () => console.log("[Package1] Component unmounted");
  }, []);

  const handleCheckboxChange = (room, size, price) => {
    console.log(
      `[Package1] Checkbox changed - Room: ${room}, Size: ${size}, Price: ${price}`
    );
    setSelectedAddOns((prev) => {
      const isAlreadySelected = prev.some((addOn) => addOn.room === room);
      if (isAlreadySelected) {
        console.log(`[Package1] Removing ${room} from selectedAddOns`);
        return prev.filter((addOn) => addOn.room !== room);
      } else {
        console.log(`[Package1] Adding ${room} to selectedAddOns`);
        return [...prev, { room, size, price }];
      }
    });
  };

  const handleProceed = async (e) => {
    try {
      e.preventDefault();
      console.log("[Package1] Proceed button clicked");

      const token = localStorage.getItem("authToken");
      console.log("[Package1] Token exists:", !!token);

      if (!token) {
        console.log("[Package1] No token found, redirecting to login");
        navigate("/login", { state: { from: "/package1-cart" } });
        return;
      }

      const packageData = {
        selectedAddOns,
        basePackage: {
          title: t.packageName,
          price: 32000,
          duration: t.duration,
          details: [
            { label: "Bedroom", size: "24-36 m²" },
            { label: "Bathroom", size: "10-15 m²" },
            { label: "Kitchen", size: "10-18 m²" },
            { label: "Garden", size: "121 m²" },
          ],
        },
      };

      console.log("[Package1] Attempting to save to API");
      try {
        const response = await axios.post(
          "https://future-bali-backend-production.up.railway.app/api/cart/save",
          {
            ...packageData,
            totalAmount:
              packageData.basePackage.price +
              packageData.selectedAddOns.reduce(
                (sum, addOn) => sum + addOn.price,
                0
              ),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );

        console.log("[Package1] API response:", response.data);

        if (response.data.success) {
          console.log("[Package1] Navigating to /package1-cart");
          navigate("/package1-cart", {
            state: {
              ...packageData,
              cartId: response.data.cart._id,
            },
          });
        } else {
          throw new Error(response.data.message || "API request failed");
        }
      } catch (apiError) {
        console.error("[Package1] API Error:", apiError);
        console.log("[Package1] Response data:", apiError.response?.data);

        console.log("[Package1] Using fallback to localStorage");
        localStorage.setItem(
          "currentPackageSelection",
          JSON.stringify(packageData)
        );

        navigate("/package1-cart", { state: packageData });
      }
    } catch (error) {
      console.error("[Package1] Unexpected error:", error);
      navigate("/package1-cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  const t = textConfig.package1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="container mx-auto px-2 lg:px-6 max-w-7xl">
        {/* Header */}
        <header className="w-full py-6 lg:py-8 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 shadow-xl flex justify-center items-center text-white text-center rounded-b-3xl mb-4 lg:mb-6">
          <div className="px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-1 tracking-wide">
              {t.headerTitle}
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide">
              {t.headerSubtitle}
            </h2>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mb-6">
          {/* Features Section */}
          <div className="flex-1 bg-white shadow-xl rounded-2xl p-5 lg:p-7 border border-purple-100">
            <h2 className="text-2xl lg:text-3xl font-bold mb-5 text-purple-700 border-b-2 border-purple-200 pb-2">
              {t.featuresHeading}
            </h2>

            {/* Tags */}
            <div className="mb-5 flex flex-wrap gap-2">
              {t.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Room Features */}
            <div className="space-y-3">
              {minimumSizes.map(
                (room, index) =>
                  room.size && (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3.5 border-l-4 border-purple-500"
                    >
                      <p className="text-base font-bold text-purple-700">
                        • {room.label}: {room.size} m²
                      </p>
                      {room.label.toLowerCase().includes("bedroom") && (
                        <p className="text-gray-600 pl-4 mt-1.5 text-sm italic">
                          • **Add On** Walk in closet toward bathroom*
                        </p>
                      )}
                      {room.label.toLowerCase().includes("bathroom") && (
                        <ul className="list-none pl-4 text-gray-600 mt-2 space-y-1.5">
                          <li className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                            Shower
                          </li>
                          <li className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                            Toilet
                          </li>
                          <li className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                            Sitting area
                          </li>
                          <li className="flex items-center text-sm">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                            Bathtub
                          </li>
                        </ul>
                      )}
                    </div>
                  )
              )}
            </div>

            {/* Furnishing Details */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5">
              <p className="text-base font-bold text-purple-700 mb-3">
                • {t.furnishingTitle}
              </p>
              <ul className="list-none pl-4 text-gray-600 space-y-2">
                {t.furnishingItems.map((item, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-3">
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed bg-white p-4 lg:p-5 rounded-lg shadow-inner border">
                {t.description1}
              </p>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed bg-white p-4 lg:p-5 rounded-lg shadow-inner border">
                {t.description2}
              </p>
            </div>
          </div>

          {/* Package Info & Image */}
          <div className="flex-1 space-y-3">
            {/* Package Details Card */}
            <div className="bg-white shadow-xl rounded-2xl p-5 lg:p-7 text-black border border-purple-100">
              <div className="mb-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  {t.packageLabel}
                </p>
                <p className="font-bold text-lg lg:text-xl text-purple-800 leading-tight">
                  {t.packageName}
                </p>
              </div>
              <div className="mb-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  {t.durationLabel}
                </p>
                <p className="font-bold text-lg lg:text-xl text-gray-800 leading-tight">
                  {t.duration}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
                  {t.budgetLabel}
                </p>
                <p className="font-bold text-2xl lg:text-3xl text-green-600">
                  {t.budget}
                </p>
              </div>
            </div>

            {/* Package Image */}
            <div className="flex justify-center">
              <div className="relative group max-w-sm lg:max-w-md">
                <img
                  src={require("../assets/images/package1.1.png")}
                  alt="Package 1"
                  className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Ons Section */}
        <section className="mb-6">
          <div className="text-center mb-5">
            <h2 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-3">
              {t.addOnsHeading}
            </h2>
            <p className="text-sm lg:text-base text-gray-600 leading-relaxed max-w-4xl mx-auto bg-white p-4 lg:p-5 rounded-lg shadow-lg">
              {t.addOnsDescription}
            </p>
          </div>
        </section>

        {/* Cost of Building Section */}
        <section className="mb-6">
          <div className="text-center mb-5">
            <h2 className="text-2xl lg:text-4xl font-bold text-purple-700 mb-3">
              {t.costHeading}
            </h2>
            <h3 className="text-lg lg:text-2xl font-semibold text-gray-800 mb-6">
              {t.costSubheading}
            </h3>
          </div>

          <div className="flex flex-col xl:flex-row gap-4 justify-center items-start max-w-7xl mx-auto">
            {/* Included Package Table */}
            <div className="w-full sm:w-3/4 md:w-2/3 xl:w-[31.25%] bg-white shadow-xl rounded-2xl p-5 lg:p-7 border border-purple-100 mx-auto xl:mx-0">
              <h3 className="text-xl lg:text-2xl font-bold mb-5 text-purple-600 text-center border-b-2 border-purple-200 pb-3">
                {t.includedTableTitle}
              </h3>
              <div className="overflow-x-auto rounded-xl shadow-inner">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <th className="border-0 px-3 lg:px-4 py-3 text-left font-bold text-sm lg:text-base">
                        Rooms
                      </th>
                      <th className="border-0 px-3 lg:px-4 py-3 text-center font-bold text-sm lg:text-base">
                        Min Size
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {minimumSizes.map((room, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-purple-50 transition-colors duration-200`}
                      >
                        <td className="border-0 px-3 lg:px-4 py-3 font-semibold text-gray-800 text-sm lg:text-base">
                          {room.label}
                        </td>
                        <td className="border-0 px-3 lg:px-4 py-3 text-center font-bold text-purple-600 text-sm lg:text-base">
                          {room.size ? `${room.size} m²` : room.size}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 lg:p-5">
                <h4 className="text-lg lg:text-xl font-bold mb-3 text-gray-800">
                  {t.smartDesignTitle}
                </h4>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                  {t.smartDesignDesc}
                </p>
              </div>
            </div>

            {/* Customization Table */}
            <div className="w-full sm:w-3/4 md:w-2/3 xl:w-[53.15%] bg-white shadow-xl rounded-2xl p-5 lg:p-7 border border-purple-100 mx-auto xl:mx-0">
              <h3 className="text-xl lg:text-2xl font-bold mb-5 text-purple-600 text-center border-b-2 border-purple-200 pb-3">
                {t.customizeTableTitle}
              </h3>

              <div className="overflow-x-auto rounded-xl shadow-inner">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <th className="border-0 px-3 py-3 text-left font-bold text-sm">
                        Rooms
                      </th>
                      <th className="border-0 px-3 py-3 text-center font-bold text-sm">
                        New Size
                      </th>
                      <th className="border-0 px-3 py-3 text-center font-bold text-sm">
                        Price
                      </th>
                      <th className="border-0 px-3 py-3 text-center font-bold text-sm">
                        Add
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {[
                      { room: "Bedroom", size: "28", price: 2000 },
                      { room: "Bathroom", size: "12", price: 500 },
                      { room: "Kitchen", size: "11", price: 1000 },
                      { room: "Storage", size: "3", price: 800 },
                      { room: "Larger Garden", size: "100", price: 2500 },
                      { room: "Living Room", size: "15", price: 1500 },
                      { room: "Out sitting", size: "9", price: 1000 },
                      { room: "swim Pool", size: "6", price: 4500 },
                    ].map(({ room, size, price }, index) => (
                      <tr
                        key={room}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-purple-50 transition-colors duration-200`}
                      >
                        <td className="border-0 px-3 py-2.5 font-semibold text-sm">
                          <span className="text-gray-800">
                            {room.split(" ")[0]}
                          </span>
                          {room.split(" ")[1] && (
                            <span className="text-red-600 font-bold ml-1">
                              {room.split(" ").slice(1).join(" ")}
                            </span>
                          )}
                        </td>
                        <td className="border-0 px-3 py-2.5 text-center font-bold text-purple-600 text-sm">
                          {size} m²
                        </td>
                        <td className="border-0 px-3 py-2.5 text-center font-bold text-green-600 text-sm">
                          ${price}
                        </td>
                        <td className="border-0 px-3 py-2.5 text-center">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange(room, size, price)
                            }
                            className="w-4 h-4 lg:w-5 lg:h-5 cursor-pointer accent-purple-600 transform hover:scale-110 transition-transform duration-200"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 lg:p-5">
                <h4 className="text-lg lg:text-xl font-bold mb-3 text-gray-800">
                  {t.addOnsInfoTitle}
                </h4>
                <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                  {t.addOnsInfoDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="mt-6 flex justify-center">
            <button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 lg:py-4 px-8 lg:px-10 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base lg:text-lg"
              onClick={handleProceed}
              type="button"
            >
              {t.proceedBtn}
            </button>
          </div>
        </section>

        {/* Construction Overview */}
        <section className="mb-6">
          <h2 className="text-2xl lg:text-4xl font-bold mb-5 text-purple-700 text-center">
            {t.constructionHeading}
          </h2>
          <div className="flex flex-col lg:flex-row gap-5 bg-white shadow-xl rounded-2xl p-5 lg:p-7 border border-purple-100">
            <div className="flex-1">
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-purple-600 border-b-2 border-purple-200 pb-3">
                {t.constructionSubheading}
              </h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed bg-gray-50 p-4 lg:p-5 rounded-xl">
                Our fully furnished single bedroom house consists of one bedroom
                of{" "}
                {
                  minimumSizes.find((room) => room.label.includes("Bedroom"))
                    ?.size
                }{" "}
                m², with a bathroom of{" "}
                {
                  minimumSizes.find((room) => room.label.includes("Bathroom"))
                    ?.size
                }{" "}
                m² that has a shower, toilet, sitting area, and bathtub. The
                kitchen is{" "}
                {
                  minimumSizes.find((room) => room.label.includes("Kitchen"))
                    ?.size
                }{" "}
                m² and has all the necessary appliances and utensils.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative group max-w-sm lg:max-w-md">
                <img
                  src={require("../assets/images/constructionOvr.png")}
                  alt="Construction Overview"
                  className="w-full rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="mb-10">
          <h2 className="text-2xl lg:text-4xl font-bold mb-5 text-purple-700 text-center">
            {t.galleryHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-6xl mx-auto">
            {[
              "package1gallery1.png",
              "package1gallery2.png",
              "package1gallery3.png",
            ].map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={require(`../assets/images/${img}`)}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Package1;
