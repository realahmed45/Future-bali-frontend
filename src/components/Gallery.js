import React, { useState } from "react";

const Gallery = () => {
  const [category, setCategory] = useState("All");
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Define exact image files for each category based on your folder structure
  const imageFiles = {
    Bathroom: [
      "Bathroom 1.png",
      "Bathroom 2.jpg",
      "Bathroom 3.jpg",
      "Bathroom 4.jpeg",
      "Bathroom 5.png",
      "Bathroom 6.jpeg",
      "Bathroom 7.png",
      "Bathroom 8.jpg",
      "Bathroom 9.png",
      "Bathroom 10.png",
    ],
    Bedroom: [
      "1.png",
      "2.jpeg",
      "3.png",
      "4.jpeg",
      "5.jpeg",
      "6.jpeg",
      "7.png",
      "8.png",
      "9.jpeg",
      "10.jpeg",
      "11.jpg",
    ],
    Garden: [
      "1.png",
      "2.jpeg",
      "3.jpeg",
      "4.jpeg",
      "5.jpeg",
      "6.jpeg",
      "7.png",
      "8.png",
    ],
    Kitchen: ["1.png", "2.jpeg", "3.png", "4.png"],
    Pool: ["1.png", "2.png", "3.jpeg", "4.jpeg", "5.jpeg", "6.jpeg", "7.png"],
  };

  // Create image paths with folder structure (using exact folder names)
  const imagePaths = {
    All: [
      ...imageFiles.Bedroom.map((filename) => ({
        folder: "Bedroom",
        filename,
      })),
      ...imageFiles.Bathroom.map((filename) => ({
        folder: "Bathroom",
        filename,
      })),
      ...imageFiles.Garden.map((filename) => ({ folder: "Garden", filename })),
      ...imageFiles.Kitchen.map((filename) => ({
        folder: "Kitchen",
        filename,
      })),
      ...imageFiles.Pool.map((filename) => ({ folder: "Pool", filename })),
    ],
    Bedroom: imageFiles.Bedroom.map((filename) => ({
      folder: "Bedroom",
      filename,
    })),
    Bathroom: imageFiles.Bathroom.map((filename) => ({
      folder: "Bathroom",
      filename,
    })),
    Garden: imageFiles.Garden.map((filename) => ({
      folder: "Garden",
      filename,
    })),
    Kitchen: imageFiles.Kitchen.map((filename) => ({
      folder: "Kitchen",
      filename,
    })),
    Pool: imageFiles.Pool.map((filename) => ({ folder: "Pool", filename })),
  };

  const handleCategoryChange = (newCategory) => {
    setIsSlidingOut(true);
    setTimeout(() => {
      setCategory(newCategory);
      setIsSlidingOut(false);
    }, 500);
  };

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "unset"; // Re-enable scrolling
  };

  const navigateImage = (direction) => {
    const currentImages = imagePaths[category];
    let newIndex;

    if (direction === "next") {
      newIndex =
        currentImageIndex === currentImages.length - 1
          ? 0
          : currentImageIndex + 1;
    } else {
      newIndex =
        currentImageIndex === 0
          ? currentImages.length - 1
          : currentImageIndex - 1;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(currentImages[newIndex]);
  };

  const handleKeyDown = (e) => {
    if (selectedImage) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") navigateImage("next");
      if (e.key === "ArrowLeft") navigateImage("prev");
    }
  };

  // Add keyboard navigation
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentImageIndex]);

  // Helper function to get image source path
  const getImageSrc = (imageObj) => {
    try {
      return require(`../assets/${imageObj.folder}/${imageObj.filename}`);
    } catch (error) {
      console.warn(
        `Image not found: assets/${imageObj.folder}/${imageObj.filename}`
      );
      return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-white min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">Gallery</h1>
        <p className="text-gray-600 text-lg">
          Explore our beautiful property designs
        </p>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["All", "Bedroom", "Bathroom", "Garden", "Kitchen", "Pool"].map(
          (item) => (
            <button
              key={item}
              onClick={() => handleCategoryChange(item)}
              className={`py-2 px-6 text-sm font-medium transition duration-300 rounded-full shadow-lg transform hover:scale-105 ${
                category === item
                  ? "bg-purple-600 text-white shadow-purple-300"
                  : "bg-white text-purple-600 border-2 border-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-600"
              }`}
            >
              {item} ({imagePaths[item].length})
            </button>
          )
        )}
      </div>

      {/* Gallery Images - 4 per row */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagePaths[category].map((imageObj, index) => (
            <div
              key={`${imageObj.folder}-${imageObj.filename}`}
              className={`relative overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                isSlidingOut
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
              onClick={() => openModal(imageObj, index)}
            >
              <div className="aspect-square">
                <img
                  src={getImageSrc(imageObj)}
                  alt={`${imageObj.folder} - ${imageObj.filename}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
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
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
            className="absolute left-4 text-white hover:text-gray-300 z-60"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
            className="absolute right-4 text-white hover:text-gray-300 z-60"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Main image */}
          <div
            className="flex items-center justify-center max-w-5xl max-h-[90vh] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageSrc(selectedImage)}
              alt={`${selectedImage.folder} - ${selectedImage.filename}`}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: "85vh", maxWidth: "90vw" }}
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {imagePaths[category].length}
          </div>
        </div>
      )}

      {/* Loading animation styles */}
      <style jsx>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .animate-fadeOut {
          animation: fadeOut 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
