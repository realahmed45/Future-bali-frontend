import React, { useState } from "react";

const Gallery = () => {
  const [category, setCategory] = useState("All");
  const [isSlidingOut, setIsSlidingOut] = useState(false);

  const imagePaths = {
    All: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    Bedroom: [1, 2, 3],
    Garden: [4, 5, 6, 7],
    Kitchen: [8, 9, 10],
    Pool: [11, 12],
  };

  const handleCategoryChange = (newCategory) => {
    setIsSlidingOut(true);
    setTimeout(() => {
      setCategory(newCategory);
      setIsSlidingOut(false);
    }, 500);
  };

  return (
    <div className="p-6 bg-white text-center">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-purple-700 mt-0 mb-2">Gallery</h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {["All", "Bedroom", "Garden", "Kitchen", "Pool"].map((item) => (
          <button
            key={item}
            onClick={() => handleCategoryChange(item)}
            className={`py-1 px-3 text-sm font-medium transition duration-300 shadow-sm ${
              category === item
                ? "bg-purple-600 text-white border-black"
                : "bg-white text-purple-600 border-black hover:bg-purple-600 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Gallery Images */}
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
        {imagePaths[category].map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-md shadow-lg transform transition-all duration-300 hover:scale-105 ${
              isSlidingOut ? "animate-fadeOut" : "animate-fadeIn"
            }`}
          >
            <img
              src={require(`../assets/images/${image}.jpeg`)}
              alt={`Category ${category} Image ${image}`}
              className="w-80 h-auto object-cover rounded-md mx-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
