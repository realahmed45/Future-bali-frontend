import React from "react";

const Home = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      <iframe
        src="/home.html"
        title="Nuanu Home Content"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          margin: 0,
          padding: 0,
          display: "block",
        }}
        frameBorder="0"
        onLoad={() => {
          console.log("Home.html loaded successfully");
        }}
        onError={(e) => {
          console.error("Failed to load home.html:", e);
        }}
      />
    </div>
  );
};

export default Home;
