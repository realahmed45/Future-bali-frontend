import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import homeImage from "../assets/images/home1.png";
import mainImage from "../assets/images/mainimage.png";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const Adventure = () => {
  const navigate = useNavigate();
  const storyImages = [
    "q.png",
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
  ];
  const galleryImages = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
  ];
  const blogImages = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(1);

  const packageDetails = {
    1: {
      title: "Single Bedroom House",
      image: "1.jpeg", // Correct path to image
      description: [
        "Modern design",
        "Land: 80m²",
        "Built-up: 35m²",
        "Ready in 3 months",
      ],
    },
    2: {
      title: "Bedroom House With Pool",
      image: "2.jpeg", // Correct path to image
      description: [
        "Luxury pool",
        "Built-up: 50m²",
        "Land: 100m²",
        "Exclusive neighborhood",
      ],
    },
    3: {
      title: "Two Bedroom House With Pool",
      image: "3.jpeg", // Correct path to image
      description: [
        "Perfect for families",
        "Built-up: 80m²",
        "Land: 150m²",
        "Relaxation guaranteed",
      ],
    },
  };
  const handleViewPackages = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      navigate("/packages");
    }
  };
  const handlePrevious = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? storyImages.length - 1 : prev - 1
    );
  const handleNext = () =>
    setCurrentImageIndex((prev) =>
      prev === storyImages.length - 1 ? 0 : prev + 1
    );

  const handleImageClick = (id) => setSelectedPackage(id);

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <div
        className="h-screen bg-cover bg-center flex justify-center items-center text-white text-center"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div className="flex gap-6 mt-44">
          <Link
            to="/packages"
            className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition shadow-md"
          >
            View Packages
          </Link>
          <Link
            to="/contactUs"
            className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition shadow-md"
          >
            Contact Us
          </Link>
        </div>
      </div>
      {/* Packages Section */}
      <section className="py-8 px-4 bg-gray-50">
        <h2 className="text-center text-lg text-gray-500 uppercase mb-2">
          Our Packages
        </h2>
        <h3 className="text-center text-2xl font-bold mb-4">
          Choose The Best For You
        </h3>
        <p className="text-center text-gray-600 mb-6 text-sm">
          We offer simple, customizable & affordable building packages, so let's
          make your dream come true.
        </p>

        {/* Package Tabs */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {Object.keys(packageDetails).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedPackage(Number(key))}
              className={`py-1.5 px-3 text-xs font-semibold rounded-lg transition ${
                selectedPackage === Number(key)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {packageDetails[key].title}
            </button>
          ))}
        </div>

        {/* Package Content */}
        <div className="container mx-auto max-w-screen-md grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(packageDetails).map((key) => (
            <Link
              to={`/package${key}`}
              key={key}
              className={`shadow-md rounded-md overflow-hidden transition transform ${
                selectedPackage === Number(key) ? "scale-105" : ""
              }`}
            >
              <img
                src={require(`../assets/images/${packageDetails[key].image}`)}
                alt={packageDetails[key].title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="text-md font-bold mb-2 text-gray-800">
                  {packageDetails[key].title}
                </h3>
                <ul className="space-y-1 text-gray-600 text-xs">
                  {packageDetails[key].description.map((item, index) => (
                    <li key={index} className="flex gap-1 items-center">
                      <FaCheckCircle className="text-purple-600 text-sm" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div
          className="mx-auto px-6 flex items-center justify-between"
          style={{ width: "824px" }} // Set the desired width here
        >
          <img
            src={require(`../assets/images/${storyImages[0]}`)}
            alt="Our Story"
            className="w-1/3 h-full rounded-lg shadow-md  mb-28"
          />
          <div className="w-2/3 pl-6">
            <h3 className="text-xl text-purple-600 font-semibold mb-2">
              Our Story
            </h3>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Dream Shaper
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4 ">
              Are you looking for a construction company that can help you build
              your dream home or business in a beautiful and natural setting? If
              so, you have come to the right place. We are Classic Builders, the
              construction company that specializes in low-cost, high-quality,
              and classic design projects. We have a team of experts who can
              handle any type of project, from residential to commercial, from
              small to large. We work with you to create a design that suits
              your needs, preferences, and budget.
            </p>
            <div className="relative mt-4">
              <img
                src={require(`../assets/images/${storyImages[currentImageIndex]}`)}
                alt="Story Slider"
                className="w-full h-[180px] object-cover rounded-lg shadow-md"
              />
              <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-purple-700 transition"
                onClick={handlePrevious}
              >
                <FaArrowLeft />
              </button>
              <button
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-purple-700 transition"
                onClick={handleNext}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
        <div className="py-12 bg-white">
          <div className="mx-auto px-6" style={{ width: "824px" }}>
            <img
              src={mainImage}
              alt="Main Feature"
              className="w-full h-[360px] object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Image Section - Added between Story and Gallery */}

      {/* Gallery Section */}
      <div className="py-8 bg-gray-50 text-center px-2 md:px-6">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-2">
          Our Gallery
        </h2>
        <p className="text-lg font-bold text-gray-600 mb-8">
          Our Projects Blend Well With The Surroundings
        </p>

        {/* Responsive Grid Layout */}
        <div
          style={{ width: "80%", maxWidth: "770px", height: "100%" }}
          className="mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <div className="col-span-2 row-span-2">
            <img
              src={require("../assets/images/1.jpeg")}
              alt="Apartment"
              className="w-full h-44 sm:h-[200px] md:h-[85%] object-cover rounded-lg shadow-md transform sm:translate-y-4 md:translate-y-[10%] mt-4 sm:mt-6"
            />
          </div>
          <div>
            <img
              src={require("../assets/images/2.jpeg")}
              alt="B&B"
              className="w-full h-44 sm:h-36 md:h-36 object-cover rounded-lg shadow-md mt-2 sm:mt-8 md:mt-16"
            />
          </div>
          <div>
            <img
              src={require("../assets/images/3.jpeg")}
              alt="Cabin"
              className="w-full h-44 sm:h-40 md:h-36 object-cover rounded-lg shadow-md mt-2 sm:mt-8 md:mt-16"
            />
          </div>
          <div className="col-span-2">
            <img
              src={require("../assets/images/4.jpeg")}
              alt="Condos"
              className="w-full h-48 sm:h-40 md:h-40 object-cover rounded-lg shadow-md scale-y-100 sm:scale-y-[1.18]"
            />
          </div>
          <div>
            <img
              src={require("../assets/images/5.jpeg")}
              alt="Dorm"
              className="w-full h-full sm:h-full md:h-44 object-cover rounded-lg shadow-md mb-2 sm:mb-6"
            />
          </div>
          <div>
            <img
              src={require("../assets/images/6.jpeg")}
              alt="House"
              className="w-full h-full sm:h-full md:h-44 object-cover rounded-lg shadow-md mb-8 sm:mb-20"
            />
          </div>
          <div className="col-span-2">
            <img
              src={require("../assets/images/8.jpeg")}
              alt="Villa"
              className="w-full  sm:h-36 md:h-36 object-cover rounded-lg shadow-md sm:scale-y-90 md:scale-y-[0.94] mb-10"
              style={{ height: "180px" }}
            />
          </div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="py-16 bg-gray-100 text-center">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-2">
          Our Blogs
        </h2>
        <p className="text-lg font-bold text-gray-600 mb-8">
          Blog For Bali Travelers
        </p>

        {/* Responsive Grid Layout for Blogs */}
        <div
          className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          style={{ width: "80%", maxWidth: "770px", height: "100%" }}
        >
          {blogImages.map((img, index) => (
            <div
              key={index}
              className="rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform bg-white"
            >
              <img
                src={require(`../assets/images/${img}`)}
                alt={`Blog ${index + 1}`}
                className="w-full h-32 sm:h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-md sm:text-lg font-bold text-gray-800 mb-2">
                  Blog Title {index + 1}
                </h3>
                <p className="text-sm sm:text-gray-600">
                  Explore modern designs and tips for building your dream home.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Adventure;
