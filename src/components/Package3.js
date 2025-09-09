import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Package3 = () => {
  const navigate = useNavigate();
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  // Get minimum sizes based on package type
  const getMinimumSizes = (packageType = 3) => {
    if (packageType === 1) {
      return [
        { label: "1 Bedroom", size: "30" },
        { label: "1 Bathroom", size: "9" },
        { label: "Kitchen", size: "7" },
        { label: "Storage", size: "" },
        { label: "Garden", size: "80" },
        { label: "Living room", size: "10" },
      ];
    } else if (packageType === 2) {
      return [
        { label: "1 Bedroom", size: "30" },
        { label: "1 Bathroom", size: "9" },
        { label: "Kitchen", size: "7" },
        { label: "Storage", size: "" },
        { label: "Garden", size: "80" },
        { label: "Living room", size: "10" },
        { label: "Pool", size: "6" },
      ];
    } else if (packageType === 3) {
      return [
        { label: "2 Bedrooms", size: "40" },
        { label: "2 Bathrooms", size: "9" },
        { label: "Kitchen", size: "7" },
        { label: "Storage", size: "" },
        { label: "Garden", size: "80" },
        { label: "Living room", size: "10" },
      ];
    }

    return [];
  };

  const minimumSizes = getMinimumSizes(3); // Package 3

  // Debug: Log component mount and initial state
  useEffect(() => {
    console.log("[Package3] Component mounted");
    console.log("[Package3] Initial selectedAddOns:", selectedAddOns);
    return () => console.log("[Package3] Component unmounted");
  }, []);

  const handleCheckboxChange = (room, size, price) => {
    console.log(
      `[Package3] Checkbox changed - Room: ${room}, Size: ${size}, Price: ${price}`
    );
    setSelectedAddOns((prev) => {
      const isAlreadySelected = prev.some((addOn) => addOn.room === room);
      if (isAlreadySelected) {
        console.log(`[Package3] Removing ${room} from selectedAddOns`);
        return prev.filter((addOn) => addOn.room !== room);
      } else {
        console.log(`[Package3] Adding ${room} to selectedAddOns`);
        return [...prev, { room, size, price }];
      }
    });
  };

  const handleProceed = async (e) => {
    try {
      e.preventDefault();
      console.log("[Package3] Proceed button clicked");

      const token = localStorage.getItem("authToken");
      console.log("[Package3] Token exists:", !!token);

      if (!token) {
        console.log("[Package3] No token found, redirecting to login");
        navigate("/login", { state: { from: "/package3-cart" } });
        return;
      }

      const packageData = {
        selectedAddOns,
        basePackage: {
          title: " Furnished Swimming Pool Package",
          price: 36000,
          duration: "4-6 months",
          details: [
            { label: "Bedroom", size: "36 m²" },
            { label: "Living room", size: "12 m²" },
            { label: "Kitchen", size: "12 m²" },
            { label: "Bathroom", size: "10 m²" },
            { label: "Gardens", size: "80 m²" },
            { label: "Swimming pool", size: "9 m²" },
          ],
        },
      };

      console.log("[Package3] Attempting to save to API");
      try {
        const response = await axios.post(
          "https://future-bali-backend-3.onrender.com/api/cart/save",
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
            timeout: 5000, // Add timeout
          }
        );

        console.log("[Package3] API response:", response.data);

        if (response.data.success) {
          console.log("[Package3] Navigating to /package3-cart");
          navigate("/package3-cart", {
            state: {
              ...packageData,
              cartId: response.data.cart._id,
            },
          });
        } else {
          throw new Error(response.data.message || "API request failed");
        }
      } catch (apiError) {
        console.error("[Package3] API Error:", apiError);
        console.log("[Package3] Response data:", apiError.response?.data);

        // Fallback to localStorage
        console.log("[Package3] Using fallback to localStorage");
        localStorage.setItem(
          "currentPackageSelection",
          JSON.stringify(packageData)
        );

        navigate("/package3-cart", { state: packageData });
      }
    } catch (error) {
      console.error("[Package3] Unexpected error:", error);
      // Ultimate fallback
      navigate("/package3-cart");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div
        className="flex flex-col items-center"
        style={{ margin: "0 auto", width: "65%" }}
      >
        <header className="w-full h-[15vh] bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 shadow-xl flex justify-center items-center text-white text-center rounded-b-3xl">
          <div className="animate-fade-in-down">
            <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
              Package 3
            </h1>
            <h className=" text-2xl font-bold mb-4 tracking-wide">
              Furnished Swimming Pool Package
            </h>
          </div>
        </header>

        <div className="flex flex-col md:flex-row mt-12 px-6 gap-8 w-full">
          <div className="flex-1 bg-white shadow-2xl rounded-2xl p-8 border border-purple-100 hover:shadow-3xl transition-all duration-300">
            <h2 className="text-3xl font-bold mb-6 text-purple-700 border-b-2 border-purple-200 pb-3">
              FEATURES
            </h2>
            <div className="mb-4 space-y-1">
              <p className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                Modern Bali Design
              </p>
              <p className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block ml-2">
                Open concept layout with Swimming Pool
              </p>
            </div>

            {/* Dynamic features based on minimum sizes */}
            <div className="space-y-3">
              {minimumSizes.map(
                (room, index) =>
                  room.size && (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500"
                    >
                      <p className="text-sm font-bold text-purple-700">
                        • {room.label}: {room.size}m²
                      </p>
                      {room.label.toLowerCase().includes("bedroom") && (
                        <p className="text-gray-600 pl-4 mt-1 italic">
                          • **Add On** Walk in closet toward bathroom*
                        </p>
                      )}
                      {room.label.toLowerCase().includes("bathroom") && (
                        <ul className="list-none pl-6 text-gray-600 mt-2 space-y-1">
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            Shower
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            Toilet
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            Sitting area
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            Bathtub
                          </li>
                        </ul>
                      )}
                    </div>
                  )
              )}
            </div>

            {/* Swimming pool - special case for Package 3 */}
            <div className="mt-3 bg-gray-50 rounded-lg p-4 border-l-4 border-purple-500">
              <p className="text-sm font-bold text-purple-700">
                • Swimming pool: 9m²
              </p>
              <p className="text-gray-600 pl-4 mt-1 italic">
                • Private pool included
              </p>
            </div>

            <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
              <p className="text-sm font-bold text-purple-700 mb-2">
                • All furnishing is included
              </p>
              <ul className="list-none pl-6 text-gray-600 space-y-1">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  Bed settings
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  All kitchen stuff
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                  All bathroom stuff
                </li>
              </ul>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-lg shadow-inner border">
                We are committed to delivering quality work on time and without
                unnecessary interruptions to the client. We follow our
                flexibility to the best we can do to make sure cost is at the
                lowest.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-lg shadow-inner border">
                As soon as the construction is done, we will list the property
                on Airbnb to maximize your return on investment (ROI).
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="bg-white shadow-2xl rounded-2xl p-8 text-black border border-purple-100 hover:shadow-3xl transition-all duration-300">
              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  Package
                </p>
                <p className="font-bold text-xl text-purple-800">
                  Swimming Pool Package
                </p>
              </div>
              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  Duration
                </p>
                <p className="font-bold text-xl text-gray-800">
                  6 months max construction period
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  Budget
                </p>
                <p className="font-bold text-3xl text-green-600">$36,000</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative group">
                <img
                  src={require("../assets/images/package3.1.png")}
                  alt="Package 3"
                  className="w-96 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>

        <section className="w-full px-6 mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Add Ons</h2>
            <p className="text-gray-600 leading-relaxed max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
              Optional add-ons increase your property's minimum size, offering
              more space, value, and future flexibility. The total size can
              expand further, especially in the garden area, which can be
              converted into additional land for structures or open space,
              contributing to a larger overall land size.
            </p>
          </div>
        </section>

        <section className="mt-12 px-6 w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-purple-700 mb-4">
              COST OF BUILDING IN BALI
            </h2>
            <h3 className="text-2xl font-semibold text-gray-800 mb-8">
              **The size is of minimum of what should you expect**
            </h3>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-white shadow-2xl rounded-2xl p-8 border border-purple-100 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 text-purple-600 text-center border-b-2 border-purple-200 pb-3">
                Included in this package
              </h3>

              <div className="overflow-hidden rounded-xl shadow-inner">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <th className="border-0 px-4 py-3 text-left font-bold">
                        Rooms
                      </th>
                      <th className="border-0 px-4 py-3 text-center font-bold">
                        Minimum Size
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
                        <td className="border-0 px-4 py-3 font-semibold text-gray-800">
                          {room.label}
                        </td>
                        <td className="border-0 px-4 py-3 text-center font-bold text-purple-600">
                          {room.size}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
                <h4 className="text-xl font-bold mb-4 text-gray-800">
                  Smartly Designed Living
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Each property comes with generous minimum room sizes and a
                  land area of 155–170 m². The extra space of 19–30 m² is
                  professionally distributed by our team to create the best
                  layout for comfort and lifestyle
                </p>
              </div>
            </div>

            <div className="flex-1 bg-white shadow-2xl rounded-2xl p-8 border border-purple-100 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 text-purple-600 text-center border-b-2 border-purple-200 pb-3">
                Customize According To Your Needs
              </h3>

              <div className="overflow-hidden rounded-xl shadow-inner">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <th className="border-0 px-3 py-3 text-left font-bold text-sm">
                        Rooms
                      </th>
                      <th className="border-0 px-3 py-3 text-center font-bold text-sm">
                        Min.New Size
                      </th>
                      <th className="border-0 px-3 py-3 text-center font-bold text-sm">
                        Price USD
                      </th>
                      <th className="border-0 px-3 py-3 text-center font-bold text-sm">
                        Add Now
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {[
                      { room: "Bedroom", size: "40 ", price: 2000 },
                      { room: "Bathroom", size: "12 ", price: 500 },
                      { room: "Kitchen", size: "14", price: 1000 },
                      { room: "Storage", size: "3", price: 800 },
                      { room: "Larger.Garden", size: "100", price: 2500 },
                      { room: "Living.Room", size: "14 ", price: 1500 },
                      { room: "Out..sitting", size: "9", price: 1000 },
                      { room: "Swim.pool", size: "6", price: 4500 },
                    ].map(({ room, size, price }, index) => (
                      <tr
                        key={room}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-purple-50 transition-colors duration-200`}
                      >
                        <td className="border-0 px-3 py-3 font-semibold">
                          {room.split(".").map((part, idx) => {
                            if (part.toLowerCase() === "") {
                              return (
                                <span
                                  key={idx}
                                  className="font-bold text-black text-sm"
                                >
                                  {part}
                                </span>
                              );
                            }
                            if (
                              part.toLowerCase() === "room" ||
                              part.toLowerCase() === "sitting" ||
                              part.toLowerCase() === "garden" ||
                              part.toLowerCase() === "pool"
                            ) {
                              return (
                                <span
                                  key={idx}
                                  className="text-red-600 font-bold"
                                >
                                  {part}
                                </span>
                              );
                            }
                            return (
                              <span key={idx} className="text-gray-800">
                                {part}
                              </span>
                            );
                          })}
                        </td>
                        <td className="border-0 px-3 py-3 text-center font-bold text-purple-600">
                          {size}
                        </td>
                        <td className="border-0 px-3 py-3 text-center font-bold text-green-600">
                          ${price}
                        </td>
                        <td className="border-0 px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            onChange={() =>
                              handleCheckboxChange(room, size, price)
                            }
                            className="w-5 h-5 cursor-pointer accent-purple-600 transform hover:scale-110 transition-transform duration-200"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
                <h4 className="text-xl font-bold mb-4 text-gray-800">
                  Add Ons
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Add-ons increase minimum room sizes. Total size may vary based
                  on design, especially the garden, which can add 50 m² for
                  structures or open space. This extra land enhances overall
                  property size to fit your lifestyle. Optional add-ons upgrade
                  your property to a larger minimum size, providing more space,
                  value, and future flexibility
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
              onClick={handleProceed}
              type="button"
            >
              Proceed with my package
            </button>
          </div>
        </section>

        <section className="w-full px-6 mt-16">
          <h2 className="text-4xl font-bold mb-8 text-purple-700 text-center">
            Construction Overview
          </h2>
          <div className="flex flex-col lg:flex-row gap-8 bg-white shadow-2xl rounded-2xl p-8 border border-purple-100 hover:shadow-3xl transition-all duration-300">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-6 text-purple-600 border-b-2 border-purple-200 pb-3">
                Overview
              </h3>
              <p className="text-gray-700 leading-relaxed text-base bg-gray-50 p-6 rounded-xl">
                Our Swimming Pool Package features{" "}
                {
                  minimumSizes.find((room) => room.label.includes("Bedrooms"))
                    ?.size
                }
                m² of bedroom space, living room of{" "}
                {
                  minimumSizes.find((room) => room.label.includes("Living"))
                    ?.size
                }
                m², kitchen of{" "}
                {
                  minimumSizes.find((room) => room.label.includes("Kitchen"))
                    ?.size
                }
                m², and{" "}
                {
                  minimumSizes.find((room) => room.label.includes("Bathrooms"))
                    ?.size
                }
                m² of bathroom space. The highlight is the private swimming pool
                of 9m² set within an
                {
                  minimumSizes.find((room) => room.label.includes("Garden"))
                    ?.size
                }
                m² garden. This package includes all furniture and accessories
                for optimal living and relaxation. The swimming pool adds
                significant value for Airbnb rental potential.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative group">
                <img
                  src={require("../assets/images/constructionOvr.png")}
                  alt="Construction Overview"
                  className="rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105 max-w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-6 mt-16 mb-16">
          <h2 className="text-4xl font-bold mb-8 text-purple-700 text-center">
            Photo Gallery
          </h2>
          <div className="flex justify-center gap-6">
            {[
              "package1gallery1.png",
              "package1gallery2.png",
              "package1gallery3.png",
            ].map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={require(`../assets/images/${img}`)}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-48 h-60 object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105"
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

export default Package3;
