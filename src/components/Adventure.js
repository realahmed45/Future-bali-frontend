import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import mediaConfig from "../config/mediaConfig.json";
import { useTextConfig } from "../hooks/useTextConfig";

const Adventure = () => {
  const navigate = useNavigate();
  const {
    textConfig,
    loading: textLoading,
    error: textError,
  } = useTextConfig();
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [hideBackgroundImage, setHideBackgroundImage] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const videoRef = useRef(null);

  // Get media from config
  const { videos, images } = mediaConfig.adventure;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth <= 768 && window.innerWidth > 480);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

    if (videoRef.current) {
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setShowPlayButton(false);
            setTimeout(() => {
              setHideBackgroundImage(true);
            }, 500);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            setShowPlayButton(true);
          });
      }
    }
  };

  const handleVideoPlay = () => {
    setShowPlayButton(false);
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
    return isMobile ? videos.heroVideoMobile : videos.heroVideo;
  };

  const getImageSrc = (imagePath) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return require(`../assets/images/${imagePath}`);
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(1);

  const handlePrevious = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.storyImages.length - 1 : prev - 1
    );
  const handleNext = () =>
    setCurrentImageIndex((prev) =>
      prev === images.storyImages.length - 1 ? 0 : prev + 1
    );

  // Loading state
  if (textLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (textError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading content: {textError}</p>
        </div>
      </div>
    );
  }

  // Get text content
  const t = textConfig.adventure;

  // Package details with text from config
  const packageDetails = {
    1: {
      image: images.packageImages.package1,
      description: t.package1Details,
    },
    2: {
      image: images.packageImages.package2,
      description: t.package2Details,
    },
    3: {
      image: images.packageImages.package3,
      description: t.package3Details,
    },
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <div className="relative h-screen flex justify-center items-center text-white text-center overflow-hidden">
        {(!videoLoaded || videoError || !hideBackgroundImage) && (
          <div
            className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              hideBackgroundImage ? "opacity-0" : "opacity-100"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${getImageSrc(
                images.fallbackImage
              )})`,
            }}
          />
        )}

        <video
          ref={videoRef}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded && !videoError ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          loop
          playsInline
          preload="auto"
          onCanPlay={handleVideoCanPlay}
          onPlay={handleVideoPlay}
          onError={handleVideoError}
        >
          <source src={getVideoSrc()} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {showPlayButton && videoCanPlay && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <button onClick={handlePlayClick} className="group relative">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl scale-150 group-hover:scale-175 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500">
                <div className="ml-1 text-white text-2xl sm:text-3xl lg:text-4xl group-hover:text-purple-200 transition-colors duration-300">
                  ▶
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse"></div>
            </button>
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>

        <div className="relative z-20 px-4 sm:px-6 lg:px-8 mt-40 sm:mt-32 lg:mt-20">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
            <Link
              to="/packages"
              className={`w-auto px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-center font-semibold ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              {t.viewPackagesBtn}
            </Link>
            <Link
              to="/contactUs"
              className={`w-auto px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-center font-semibold ${
                isMobile ? "text-sm" : "text-base"
              }`}
            >
              {t.contactUsBtn}
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
          {t.packagesLabel}
        </h2>
        <h3
          className={`text-center font-bold mb-3 sm:mb-4 ${
            isMobile ? "text-xl" : "text-2xl"
          }`}
        >
          {t.packagesHeading}
        </h3>
        <p
          className={`text-center text-gray-600 mb-4 sm:mb-6 ${
            isMobile ? "text-xs px-2" : "text-sm"
          }`}
        >
          {t.packagesDesc}
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
              {isMobile ? `Package ${key}` : t[`package${key}Btn`]}
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
                    src={getImageSrc(packageDetails[key].image)}
                    alt={t[`package${key}Btn`]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`bg-white ${isMobile ? "p-3" : "p-4"}`}>
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
                  src={getImageSrc(images.sunsetImage)}
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
                {t.storySubtitle}
              </h3>
              <h2
                className={`font-bold text-gray-800 mb-3 sm:mb-4 ${
                  isMobile ? "text-2xl" : "text-3xl"
                }`}
              >
                {t.storyTitle}
              </h2>
              <p
                className={`text-gray-600 leading-relaxed mb-3 sm:mb-4 ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                {t.storyPara1}
              </p>
              <p
                className={`font-bold text-gray-600 leading-relaxed mb-3 sm:mb-4 ${
                  isMobile ? "text-sm" : "text-lg"
                }`}
              >
                {t.storyPara2}
              </p>

              <div className="relative mt-4">
                <div className="aspect-[16/9] overflow-hidden rounded-lg shadow-md">
                  <img
                    src={getImageSrc(images.storyImages[currentImageIndex])}
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
                src={getImageSrc(images.mainImage)}
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
          {t.galleryTitle}
        </h2>
        <p
          className={`font-bold text-gray-600 mb-6 sm:mb-8 ${
            isMobile ? "text-base" : "text-lg"
          }`}
        >
          {t.gallerySubtitle}
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
            {images.galleryImages.map((img, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getImageSrc(img)}
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
          {t.blogTitle}
        </h2>
        <p
          className={`font-bold text-gray-600 mb-6 sm:mb-8 ${
            isMobile ? "text-base" : "text-lg"
          }`}
        >
          {t.blogSubtitle}
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
            {images.blogImages.map((img, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={getImageSrc(img)}
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
                    {t.blogTitles[index] || `Blog Title ${index + 1}`}
                  </h3>
                  <p
                    className={`text-gray-600 leading-relaxed ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}
                  >
                    {t.blogDescriptions[index]}
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
