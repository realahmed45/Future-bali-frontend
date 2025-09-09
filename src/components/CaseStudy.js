import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CaseStudy.css"; // Ensure the CSS file is imported

const CaseStudy = () => {
  const [category, setCategory] = useState("All");
  const [isSlidingOut, setIsSlidingOut] = useState(false); // To control sliding out animation

  const imagePaths = {
    All: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    Bedroom: [1, 2, 3],
    Garden: [4, 5, 6, 7],
    Kitchen: [8, 9, 10],
    Pool: [11, 12],
  };

  const handleCategoryChange = (newCategory) => {
    setIsSlidingOut(true); // Start sliding out previous images
    setTimeout(() => {
      setCategory(newCategory);
      setIsSlidingOut(false); // Stop sliding out and show new images
    }, 500); // Duration of sliding out animation (500ms)
  };

  return (
    <div className="packages-container">
      {/* Header Section */}
      <div className="packages-header">
        <div className="packages-header-content">
          <h1 className="packages-heading">Case Study</h1>
          <p className="packages-description">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>{" "}
            &gt; Case Study
          </p>
        </div>
      </div>

      {/* Category Selection */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <p style={{ fontSize: "18px", color: "#555" }}>
          Explore case studies across various categories to see our exceptional
          work.
        </p>
        <div className="category-selection">
          <p
            onClick={() => handleCategoryChange("All")}
            className={`category-link ${category === "All" ? "selected" : ""}`}
          >
            All
          </p>
          <p
            onClick={() => handleCategoryChange("Bedroom")}
            className={`category-link ${
              category === "Bedroom" ? "selected" : ""
            }`}
          >
            Bedroom
          </p>
          <p
            onClick={() => handleCategoryChange("Garden")}
            className={`category-link ${
              category === "Garden" ? "selected" : ""
            }`}
          >
            Garden
          </p>
          <p
            onClick={() => handleCategoryChange("Kitchen")}
            className={`category-link ${
              category === "Kitchen" ? "selected" : ""
            }`}
          >
            Kitchen
          </p>
          <p
            onClick={() => handleCategoryChange("Pool")}
            className={`category-link ${category === "Pool" ? "selected" : ""}`}
          >
            Pool
          </p>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="gallery-section">
        {/* <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Gallery</h2> */}
        <div className="image-grid">
          {imagePaths[category].map((image, index) => (
            <div
              key={index}
              className={`image-container ${
                isSlidingOut ? "slide-out" : "slide-in"
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <img
                src={require(`../assets/images/${image}.jpeg`)}
                alt={`Category ${category} Image ${image}`}
                className="gallery-image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;
