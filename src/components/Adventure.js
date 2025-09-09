import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import homeImage from "../assets/images/home1.png";
import mainImage from "../assets/images/sunset2.png";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const Adventure = () => {
  const navigate = useNavigate();
  const storyImages = [
    "adventure1.png",
    "adventure2.png",
    "adventure3.png",
    "adventure4.png",
    "adventure5.png",
    "adventure6.png",
    "adventure7.png",
    "adventure8.png",
    "adventure9.png",
  ];
  const galleryImages = [
    "40.jpeg",
    "41.jpeg",
    "45.jpeg",
    "48.jpeg",
    "33.jpeg",
    "21.jpeg",
    "29.jpeg",
    "17.jpeg",
  ];
  const blogImages = [
    "blog1.jpeg",
    "blog5.jpeg",
    "blog6.jpeg",
    "blog3.jpeg",
    "blog4.jpeg",
    "blog2.jpeg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(1);

  const blogTitles = [
    "Waterfall",
    "Volcano Mountains",
    "Temples",
    "Beaches",
    "Rice field",
    "Surfing",
  ];
  const blogDescriptions = [
    "breathtaking waterfalls hidden in lush tropical landscapes.",
    "Track mountains with beautiful views and fresh air.",
    "temples, known for their unique architecture and spiritual importance",
    "beaches, famous for soft sand, clear water, and stunning sunsets.",
    "Long walk on rice fields, known for their green terraces and peaceful views.",
    "Indonesia is famous for its surfing all around the world. Bali to start with",
  ];
  const packageDetails = {
    1: {
      title: " Fully furnisded Single Bedroom Villa",
      image: "1.jpeg",
      description: [
        "Modern design",
        "Land: 155m²",
        "Built-up: 65m²",
        "Ready in 3 months",
      ],
    },
    2: {
      title: "Fully Furnished Bedroom Villa With Pool",
      image: "3.jpeg",
      description: [
        "Luxury pool",
        "Built-up: 65m²",
        "Land: 155m²",
        "Ready in 3 months",
      ],
    },
    3: {
      title: "Fully furnished Two Bedroom Villa",
      image: "2.jpeg",
      description: [
        "Perfect for families",
        "Built-up: 80m² min",
        "Land: 160m² min",
        "Add-on: Pool possibility",
      ],
    },
  };

  const handleViewPackages = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
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
      <div className="relative h-screen flex justify-center items-center text-white text-center overflow-hidden">
        {/* Vimeo Background Video */}
        <iframe
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="https://player.vimeo.com/video/1116970593?autoplay=1&muted=1&loop=1&controls=0&background=1&title=0&byline=0&portrait=0"
          style={{
            border: 0,
            pointerEvents: "none",
            width: "100vw",

            minWidth: "200vh", // 16:9 aspect ratio
            height: "100vh",
            transform: "scale(1.2)", // Ensures full coverage
          }}
          allow="autoplay; fullscreen"
          title="Future Bali Background Video"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex gap-6 mt-60 ml-12">
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
              className={`shadow-md rounded-md overflow-hidden transition transform hover:scale-105 ${
                selectedPackage === Number(key) ? "scale-105" : ""
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={require(`../assets/images/${packageDetails[key].image}`)}
                  alt={packageDetails[key].title}
                  className="w-full h-full object-cover"
                />
              </div>
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
          style={{ width: "824px" }}
        >
          <div className="w-1/3">
            <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-md mb-28">
              <img
                src={require(`../assets/images/sunset1.jpg`)}
                alt="Our Story"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-2/3 pl-6">
            <h3 className="text-xl text-purple-600 font-semibold mb-2">
              A New beginning
            </h3>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Dream Holiday Investment
            </h2>
            <p className="text-base text-gray-600 leading-relaxed mb-4">
              Step into the new life with a unique holiday property investment.
              Here we have Secure dream getaway, create memories in paradise,
              and build a smart future. Enjoying all the luxury at a fraction of
              the cost. Every stay is an adventure, every moment feels like
              missing my new adventure home.
            </p>
            <p className=" font-bold text-1xl text-gray-600 leading-relaxed mb-4">
              {" "}
              Your dream. Your holiday. Your investment. Your new life.
            </p>

            <div className="relative mt-4">
              <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                <img
                  src={require(`../assets/images/${storyImages[currentImageIndex]}`)}
                  alt="Story Slider"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-purple-700 transition"
                onClick={handlePrevious}
              >
                <FaArrowLeft />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-purple-700 transition"
                onClick={handleNext}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>

        {/* Main Image Section */}
        <div className="py-12 bg-white">
          <div className="mx-auto px-6" style={{ width: "824px" }}>
            <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-lg">
              <img
                src={mainImage}
                alt="Main Feature"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section - Redesigned for consistency */}
      <div className="py-16 bg-gray-50 text-center px-4">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-2">
          Our Gallery
        </h2>
        <p className="text-lg font-bold text-gray-600 mb-8">
          Our Projects Blend Well With The Surroundings
        </p>

        {/* Consistent Grid Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={require(`../assets/images/${img}`)}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blogs Section - Improved consistency */}
      <div className="py-16 bg-gray-100 text-center px-4">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-2">
          Explore Bali
        </h2>
        <p className="text-lg font-bold text-gray-600 mb-8">
          What is bali famous for
        </p>

        {/* Consistent Grid Layout for Blogs */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogImages.map((img, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={require(`../assets/images/${img}`)}
                    alt={`Blog ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {blogTitles[index] || `Blog Title ${index + 1}`}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {blogDescriptions[index % blogDescriptions.length]}
                  </p>
                  <div className="mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adventure;
