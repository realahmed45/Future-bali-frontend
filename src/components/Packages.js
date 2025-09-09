import React from "react";
import { Link } from "react-router-dom";

const Packages = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Heading */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-purple-600 uppercase tracking-wide">
          Packages
        </h1>
      </div>

      {/* Package Gallery Section */}
      <section className="container mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Package 1 */}
          <Link to="/package1" className="block group cursor-pointer">
            <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={require("../assets/images/package1.png")}
                alt="Package 1"
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>

          {/* Package 2 */}
          <Link to="/package2" className="block group cursor-pointer">
            <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={require("../assets/images/package2.png")}
                alt="Package 2"
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>

          {/* Package 3 */}
          <Link to="/package3" className="block group cursor-pointer">
            <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={require("../assets/images/package3.png")}
                alt="Package 3"
                className="w-full h-auto object-contain"
              />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Packages;
