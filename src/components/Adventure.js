import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import homeImage from "../assets/images/home1.png";
import mainImage from "../assets/images/sunset2.png";
import heroVideo from "../assets/futurelife.mp4";
import heroVideoMobile from "../assets/futurelife-mobile.mp4";
import fallbackImage from "../assets/Future life img.png";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaPlay,
} from "react-icons/fa";

const Adventure = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hideBackgroundImage, setHideBackgroundImage] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth <= 768 && window.innerWidth > 480);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("Video paths:");
    console.log("Desktop video:", heroVideo);
    console.log("Mobile video:", heroVideoMobile);
    console.log("Fallback image:", fallbackImage);
  }, []);
  const handlePlayClick = () => {
    setShowPlayButton(false);
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
        setVideoError(true);
        setShowPlayButton(true);
      });
    }
  };

  const handleVideoCanPlay = () => {
    setVideoCanPlay(true);
    setVideoLoaded(true);

    // Attempt to autoplay
    if (videoRef.current) {
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
            setShowPlayButton(false);
            // Hide background image after video starts playing
            setTimeout(() => {
              setHideBackgroundImage(true);
            }, 500);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            // Show play button if autoplay is blocked
            setShowPlayButton(true);
          });
      }
    }
  };

  const handleVideoPlay = () => {
    setShowPlayButton(false);
    // Hide background image when video starts playing
    setTimeout(() => {
      setHideBackgroundImage(true);
    }, 500);
  };

  const handleVideoError = () => {
    console.error("Video failed to load");
    setVideoError(true);
    setVideoLoaded(false);
    setShowPlayButton(false);
  };

  const getVideoSrc = () => {
    return isMobile ? heroVideoMobile : heroVideo;
  };

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
    "1.png",
    "2.jpeg",
    "3.png",
    "5.jpeg",
    "6.jpeg",
    "10.jpeg",
    "11.png",
    "12.jpeg",
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
    "breathtaking waterfalls hidden in lush tropical landscapes.",
    "Track mountains with beautiful views and fresh air.",
    "temples, known for their unique architecture and spiritual importance",
    "beaches, famous for soft sand, clear water, and stunning sunsets.",
    "Long walk on rice fields, known for their green terraces and peaceful views.",
    "Indonesia is famous for its surfing all around the world. Bali to start with",
  ];
  const packageDetails = {
    1: {
      title: " Fully furnisded Single Bedroom Villa",
      image: "1.png",
      description: [
        "Modern design",
        "Land: 155m²",
        "Built-up: 65m²",
        "Ready in 3 months",
      ],
    },
    2: {
      title: "Fully Furnished Bedroom Villa With Pool",
      image: "two.png",
      description: [
        "Luxury pool",
        "Built-up: 65m²",
        "Land: 155m²",
        "Ready in 3 months",
      ],
    },
    3: {
      title: "Fully furnished Two Bedroom Villa",
      image: "4.jpeg",
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
      {/* Hero Section - Local Video Implementation */}
      <div className="relative h-screen flex justify-center items-center text-white text-center overflow-hidden">
        {/* Background Image (shown when video not loaded or error) */}
        {(!videoLoaded || videoError || !hideBackgroundImage) && (
          <div
            className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              hideBackgroundImage ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${fallbackImage})`,
            }}
          />
        )}

        {/* Local Video */}
        <video
          ref={videoRef}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoError ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={handleVideoCanPlay}
          onPlay={handleVideoPlay}
          onError={handleVideoError}
          onLoadStart={() => console.log("Video load started")}
          onLoadedData={() => console.log("Video data loaded")}
        >
          <source src={getVideoSrc()} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Manual Play Button (shown if autoplay is blocked) */}
        {showPlayButton && videoCanPlay && (
          <button
            onClick={handlePlayClick}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-70 transition-all"
          >
            <FaPlay className="w-8 h-8" />
          </button>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>

        {/* Content - Responsive */}
        <div className="relative z-20 px-4 sm:px-6 lg:px-8 mt-20 sm:mt-16 lg:mt-0">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
            <Link
              to="/packages"
              className={`w-auto px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition shadow-md text-center font-medium ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              View Packages
            </Link>
            <Link
              to="/contactUs"
              className={`w-auto px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition shadow-md text-center font-medium ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      <section className={`py-6 sm:py-8 px-3 sm:px-4 bg-gray-50`}>
        <h2
          className={`text-center text-gray-500 uppercase mb-2 ${
            isMobile ? "text-sm" : "text-lg"
          }`}
        >
          Our Packages
        </h2>
        <h3
          className={`text-center font-bold mb-3 sm:mb-4 ${
            isMobile ? "text-xl" : "text-2xl"
          }`}
        >
          Choose The Best For You
        </h3>
        <p
          className={`text-center text-gray-600 mb-4 sm:mb-6 ${
            isMobile ? "text-xs px-2" : "text-sm"
          }`}
        >
          We offer simple, customizable & affordable building packages, so let's
          make your dream come true.
        </p>

        <div className="flex justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 flex-wrap px-2">
          {Object.keys(packageDetails).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedPackage(Number(key))}
              className={`py-1 sm:py-1.5 px-2 sm:px-3 font-semibold rounded-lg transition ${
                isMobile ? "text-xs" : "text-xs sm:text-sm"
              } ${
                selectedPackage === Number(key)
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {isMobile ? `Package ${key}` : packageDetails[key].title}
            </button>
          ))}
        </div>

        <div className="container mx-auto max-w-screen-md">
          <div
            className={`grid gap-3 sm:gap-4 ${
              isMobile
                ? "grid-cols-1"
                : isTablet
                ? "grid-cols-2"
                : "grid-cols-1 md:grid-cols-3"
            }`}
          >
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
                <div className={`bg-white ${isMobile ? "p-3" : "p-4"}`}>
                  <h3
                    className={`font-bold mb-2 text-gray-800 ${
                      isMobile ? "text-sm" : "text-md"
                    }`}
                  >
                    {packageDetails[key].title}
                  </h3>
                  <ul
                    className={`space-y-1 text-gray-600 ${
                      isMobile ? "text-xs" : "text-xs"
                    }`}
                  >
                    {packageDetails[key].description.map((item, index) => (
                      <li key={index} className="flex gap-1 items-center">
                        <FaCheckCircle
                          className={`text-purple-600 ${
                            isMobile ? "text-xs" : "text-sm"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <div className={`bg-white ${isMobile ? "py-8" : "py-16"}`}>
        <div
          className={`mx-auto px-4 sm:px-6 ${
            isMobile ? "max-w-full" : isTablet ? "max-w-3xl" : "max-w-4xl"
          }`}
        >
          <div
            className={`flex items-center justify-between ${
              isMobile || isTablet ? "flex-col gap-6" : "flex-row"
            }`}
          >
            <div className={`${isMobile || isTablet ? "w-full" : "w-1/3"}`}>
              <div
                className={`aspect-[3/4] overflow-hidden rounded-lg shadow-md ${
                  isMobile || isTablet ? "mb-4" : "mb-28"
                }`}
              >
                <img
                  src={require(`../assets/images/sunset1.jpg`)}
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div
              className={`${isMobile || isTablet ? "w-full" : "w-2/3 pl-6"}`}
            >
              <h3
                className={`text-purple-600 font-semibold mb-2 ${
                  isMobile ? "text-lg" : "text-xl"
                }`}
              >
                A New beginning
              </h3>
              <h2
                className={`font-bold text-gray-800 mb-3 sm:mb-4 ${
                  isMobile ? "text-2xl" : "text-3xl"
                }`}
              >
                Dream Holiday Investment
              </h2>
              <p
                className={`text-gray-600 leading-relaxed mb-3 sm:mb-4 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                Step into the new life with a unique holiday property
                investment. Here we have Secure dream getaway, create memories
                in paradise, and build a smart future. Enjoying all the luxury
                at a fraction of the cost. Every stay is an adventure, every
                moment feels like missing my new adventure home.
              </p>
              <p
                className={`font-bold text-gray-600 leading-relaxed mb-3 sm:mb-4 ${
                  isMobile ? "text-sm" : "text-lg"
                }`}
              >
                Your dream. Your holiday. Your investment. Your new life.
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
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full hover:bg-purple-700 transition ${
                    isMobile ? "p-1.5" : "p-2"
                  }`}
                  onClick={handlePrevious}
                >
                  <FaArrowLeft className={isMobile ? "text-sm" : "text-base"} />
                </button>
                <button
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full hover:bg-purple-700 transition ${
                    isMobile ? "p-1.5" : "p-2"
                  }`}
                  onClick={handleNext}
                >
                  <FaArrowRight
                    className={isMobile ? "text-sm" : "text-base"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-white ${isMobile ? "py-8" : "py-12"}`}>
          <div
            className={`mx-auto px-4 sm:px-6 ${
              isMobile ? "max-w-full" : isTablet ? "max-w-3xl" : "max-w-4xl"
            }`}
          >
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

      {/* Gallery Section */}
      <div
        className={`bg-gray-50 text-center px-3 sm:px-4 ${
          isMobile ? "py-8" : "py-16"
        }`}
      >
        <h2
          className={`font-extrabold text-purple-700 mb-2 ${
            isMobile ? "text-2xl" : "text-4xl"
          }`}
        >
          Our Gallery
        </h2>
        <p
          className={`font-bold text-gray-600 mb-6 sm:mb-8 ${
            isMobile ? "text-base" : "text-lg"
          }`}
        >
          Our Projects Blend Well With The Surroundings
        </p>

        <div className="max-w-6xl mx-auto">
          <div
            className={`grid gap-3 sm:gap-4 ${
              isMobile
                ? "grid-cols-2"
                : isTablet
                ? "grid-cols-3"
                : "grid-cols-2 md:grid-cols-4"
            }`}
          >
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
                      className={isMobile ? "w-6 h-6" : "w-8 h-8"}
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

      {/* Blogs Section */}
      <div
        className={`bg-gray-100 text-center px-3 sm:px-4 ${
          isMobile ? "py-8" : "py-16"
        }`}
      >
        <h2
          className={`font-extrabold text-purple-700 mb-2 ${
            isMobile ? "text-2xl" : "text-4xl"
          }`}
        >
          Explore Bali
        </h2>
        <p
          className={`font-bold text-gray-600 mb-6 sm:mb-8 ${
            isMobile ? "text-base" : "text-lg"
          }`}
        >
          What is bali famous for
        </p>

        <div className="max-w-4xl mx-auto">
          <div
            className={`grid gap-4 sm:gap-6 ${
              isMobile
                ? "grid-cols-1"
                : isTablet
                ? "grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            }`}
          >
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
                <div className={isMobile ? "p-4" : "p-6"}>
                  <h3
                    className={`font-bold text-gray-800 mb-2 sm:mb-3 ${
                      isMobile ? "text-base" : "text-lg"
                    }`}
                  >
                    {blogTitles[index] || `Blog Title ${index + 1}`}
                  </h3>
                  <p
                    className={`text-gray-600 leading-relaxed ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}
                  >
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
