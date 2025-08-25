import React from "react";
import { Link } from "react-router-dom";

const Packages = () => {
  return (
    <div className="bg-gray-100">
      {/* Heading */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-purple-600 uppercase">
          Packages
        </h1>
      </div>

      {/* Package Gallery Section */}
      <section className="container mx-auto py-6 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Package 1 */}
          <Link
            to="/package1"
            className="block overflow-hidden rounded-lg shadow-lg group"
          >
            <img
              src={require("../assets/images/package1.png")}
              alt="Package 1"
              className="w-auto h-auto object-none group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Package 2 */}
          <Link
            to="/package2"
            className="block overflow-hidden rounded-lg shadow-lg group"
          >
            <img
              src={require("../assets/images/package2.png")}
              alt="Package 2"
              className="w-auto h-auto object-none group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Package 3 */}
          <Link
            to="/package3"
            className="block overflow-hidden rounded-lg shadow-lg group"
          >
            <img
              src={require("../assets/images/package3.png")}
              alt="Package 3"
              className="w-auto h-auto object-none group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Packages;
