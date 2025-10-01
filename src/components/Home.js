import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Play, MapPin } from "lucide-react";
import Frame1 from "../assets/images/Frame1.png";
import Framesmall from "../assets/images/Framesmall.png";
import Frame3 from "../assets/images/Frame3.png";
import Frame4 from "../assets/images/Frame4.png";
import Frame5 from "../assets/images/Frame5.png";
import Frame7 from "../assets/images/Frame7.png";
import Frame8 from "../assets/images/Frame 8.png";
import Frame9 from "../assets/images/Frame 9.png";
import Frame10 from "../assets/images/Frame 10.png";

const NuanuHomepage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    "School and kindergarten",
    "Beachclub and sea access",
    "Shopping center",
    "Walking trail 10 km",
    "Open amphitheater",
    "Art park",
    "Music recording studios",
  ];

  const awards = [
    {
      title: "TOP 3",
      subtitle: "TRAVELERS' CHOICE AWARDS",
      image:
        "https://optim.tildacdn.one/tild6636-6335-4630-b330-386537313530/-/resize/87x/-/format/webp/Frame_4.png.webp",
    },
    {
      title: "TOP 3",
      subtitle: "BEST PLACES TO LIVE AND INVEST",
      image:
        "https://optim.tildacdn.one/tild6233-3639-4133-b365-623630623137/-/resize/87x/-/format/webp/Frame_5.png.webp",
    },
    {
      title: "TOP 1",
      subtitle: "THE MOST INSTAGRAMMABLE PLACES ON THE PLANET",
      image:
        "https://optim.tildacdn.one/tild3938-3831-4363-a263-393433633637/-/resize/87x/-/format/webp/Frame_6.png.webp",
    },
    {
      title: "TOP 5",
      subtitle: "MOST HOSPITABLE DESTINATIONS",
      image:
        "https://optim.tildacdn.one/tild6533-6461-4034-b533-336235613932/-/resize/87x/-/format/webp/Frame_7.png.webp",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${Frame1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Rental income badge */}
        <div className="absolute top-4 right-4 lg:top-6 lg:right-[750px] border border-white rounded-xl lg:rounded-2xl px-3 py-2 lg:px-5 lg:py-3 text-white z-10 shadow-lg">
          <div className="text-center">
            <div className="text-xs lg:text-base font-semibold">
              +15% rental
            </div>
            <div className="text-xs lg:text-sm opacity-90">income per year</div>
          </div>
        </div>

        {/* Main hero content */}
        {/* Main hero content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:top-1 lg:left-8 lg:transform-none text-white lg:text-black max-w-sm lg:max-w-md z-10 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-3 lg:mb-2 leading-tight">
            Best Premium investment in Bali
          </h1>
          <p className="text-3xl lg:text-4xl mb-1 font-bold">(from $36,000)</p>
        </div>
        {/* Nuanu branding */}
        <div className="absolute bottom-20 lg:bottom-[350px] left-4 lg:left-14 text-white z-10">
          <h2 className="text-4xl lg:text-[120px] font-light mb-1 tracking-wide leading-none">
            Bali
          </h2>
          <p className="text-xl lg:text-[60px] font-light opacity-90 tracking-wider leading-none">
            |Future Life
          </p>
        </div>

        {/* CTA Section */}
        {/* CTA Section */}
        <div className="absolute bottom-8 right-4 lg:bottom-2 lg:right-28 mt-8 z-10">
          <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-2xl max-w-xs">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={Framesmall}
                  alt="Property preview"
                  className="w-10 h-10 lg:w-16 lg:h-16 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-2 leading-tight">
                  select your future home with available futures
                </p>

                <Link to="/packages" className="w-full">
                  <button className="bg-black text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1 w-full">
                    <span>See Options</span>
                    <span className="ml-1">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome to Bali Section */}
      <section className="py-8 lg:py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-6 lg:mb-8">
            <MapPin className="text-gray-600" size={20} />
            <span className="text-gray-600">Indonesia</span>
          </div>

          <h2 className="text-2xl lg:text-5xl font-bold mb-8 lg:mb-12 text-gray-900">
            Welcome to Future Bali
          </h2>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
            <div className="space-y-4 lg:space-y-6">
              <p className="text-sm lg:text-lg text-gray-700 leading-relaxed">
                Bali is often reffered to as the island of gods and a province
                of Indonesia. Indonesia is the largest country in Southeast Asia
                and is the largest country in Southeast Asia, after India and
                China
              </p>

              <p className="text-sm lg:text-lg leading-relaxed">
                Bali is consistently ranked among{" "}
                <span className="text-blue-500 font-medium">
                  the top tourist and investment destinations
                </span>
                , renowned for its stunning beaches, world-class surfing, rich
                culture and outstanding hospitality
              </p>
            </div>

            <div className="relative">
              <img
                src="https://optim.tildacdn.one/tild3466-6364-4161-b731-626238633935/-/format/webp/Group_225.png.webp"
                alt="Indonesia Map"
                className="block mx-auto w-full max-w-[90%] h-auto"
              />
            </div>
          </div>

          {/* Awards Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {awards.map((award, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 lg:w-20 lg:h-20 bg-gray-200 rounded-full mx-auto mb-2 lg:mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="font-bold text-sm lg:text-lg mb-1">
                  {award.title}
                </h4>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  {award.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nuanu Creative City Section */}
      <section className="bg-white px-2 lg:px-0">
        <div className="w-full lg:w-[97%] lg:ml-5">
          <img
            src={Frame3}
            alt="Nuanu Creative City"
            className="w-full h-auto block mb-4"
          />

          {/* Mobile: Text section below image, Desktop: Overlay */}
          <div className="block lg:hidden px-4 py-6 mb-4">
            <p className="text-lg text-gray-800 leading-relaxed text-center">
              creative holiday adventure property is embodying a commitment to
              harmonious living and adventure.
            </p>
          </div>

          {/* Desktop: Text overlay */}
          <div className="hidden lg:block relative -mt-4 ml-[770px] mb-4">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="px-8 py-6 max-w-2xl mx-auto">
                <p className="text-3xl text-gray-800 ml-16 leading-relaxed text-center">
                  creative holiday adventure property is embodying a commitment
                  to harmonious living and adventure.
                </p>
              </div>
            </div>
          </div>

          <img
            src={Frame4}
            alt="Nuanu Development"
            className="w-full h-auto block mb-4"
          />

          {/* Frame5 with responsive text handling */}
          <div className="relative">
            <img
              src={Frame5}
              alt="Integrated Ecosystem"
              className="w-full h-auto block mb-4"
            />

            {/* Mobile: Text below image */}
            <div className="block lg:hidden px-4 py-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Invest as{" "}
                <span className="text-gray-500">life adventure for life</span>
              </h3>
              <p className="text-base text-gray-800 leading-relaxed text-center">
                The holiday is dedicated to nature adventure, harmony wellness,
                entertainment living, giving back to your soul, body and
                community.
              </p>
            </div>

            {/* Desktop: Text overlay */}
            <div className="hidden lg:block absolute top-8 left-8 max-w-md">
              <div className="px-6 py-6 mt-40">
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  Invest as <span className="text-gray-500">life</span>
                </h3>
                <h3 className="text-3xl font-bold text-gray-500 mb-1">
                  adventure
                </h3>
                <h3 className="text-3xl font-bold text-gray-500 mb-3">
                  for life
                </h3>
                <p className="text-2xl text-gray-800 mr-4 leading-relaxed">
                  The holiday is dedicated
                  <br />
                  to nature adventure,
                  <br />
                  harmony wellness,
                  <br />
                  entertainment living,
                  <br />
                  giving back to your soul,
                  <br />
                  body and community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <div className="relative mx-auto w-fit mt-4 lg:mt-8 px-4 lg:px-0">
        <img
          src={Frame7}
          alt="Master Plan Video"
          className="w-full max-w-sm lg:max-w-none lg:w-[800px] lg:h-[810px] cursor-pointer object-cover rounded-lg lg:rounded-none"
          onClick={() => setIsModalOpen(true)}
        />
        <button
          className="absolute bottom-4 right-4 lg:bottom-10 lg:right-36 w-12 h-12 lg:w-20 lg:h-20 bg-black/80 rounded-full flex items-center justify-center hover:bg-black/90 transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <Play className="text-white ml-1" size={16} />
        </button>
      </div>

      {/* Master Plan Section */}
      <section className="py-8 lg:py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-xl lg:text-5xl font-light text-gray-900 mb-8 lg:mb-12">
              This will make your life{" "}
              <span className="font-bold">as adventure</span>
            </h2>
          </div>

          <div className="flex justify-center lg:justify-end lg:mr-40">
            <div className="space-y-4 lg:space-y-8 max-w-sm lg:max-w-md w-full">
              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                    01
                  </span>
                  <span className="text-gray-900 text-sm lg:text-lg">
                    Amazing Service
                  </span>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                    02
                  </span>
                  <span className="text-gray-900 text-sm lg:text-lg">
                    Adventure oriented
                  </span>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                    03
                  </span>
                  <span className="text-gray-900 text-sm lg:text-lg">
                    Walkable surroundings
                  </span>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                    04
                  </span>
                  <span className="text-gray-900 text-sm lg:text-lg">
                    Senior friendly
                  </span>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                    05
                  </span>
                  <span className="text-gray-900 text-sm lg:text-lg">
                    Guest/staff focused
                  </span>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                    06
                  </span>
                  <span className="text-gray-900 text-sm lg:text-lg">
                    Activities depends on area
                  </span>
                </div>
                <div className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100">
                  <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                    07
                  </span>
                  <span className="text-gray-900 text-sm lg:text-lg">
                    high (ROI) oriented
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-6 lg:pt-8">
                <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <Link to="/packages" className="w-full">
                    <button className="bg-gray-800 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors flex items-center space-x-2 w-full lg:w-auto">
                      <span>See Options</span>
                      <span>→</span>
                    </button>
                  </Link>
                  <p className="text-gray-600 text-center lg:text-left text-sm lg:text-base">
                    See all your options and join the adventure now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 lg:py-20 px-2 lg:px-8 bg-white">
        <div className="w-full">
          <div className="relative">
            <img src={Frame8} alt="Nuanu Map" className="w-full h-auto" />

            {/* Mobile: Features list below image */}
            <div className="block lg:hidden p-4 bg-white mt-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Map Features
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  "hot spring",
                  "waterfalls",
                  "adventure bikes",
                  "Tracks",
                  "waterfall",
                  "spring water",
                  "rafting",
                  "ATV adventure",
                  "waterfall track",
                  "waterfall ",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 py-1 border-b border-gray-100"
                  >
                    <span className="text-gray-400 text-sm font-mono w-6">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-gray-900 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Features overlay */}
            <div className="hidden lg:block absolute top-1/4 mt-20 left-2 mr-14 p-8 max-w-md">
              <div className="space-y-3">
                {[
                  "hot spring",
                  "waterfalls",
                  "adventure bikes",
                  "Tracks",
                  "waterfall",
                  "spring water",
                  "rafting",
                  "ATV adventure",
                  "waterfall track",
                  "waterfall ",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-400 text-sm font-mono w-8">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-gray-900 text-base">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="bg-white mt-4 lg:mt-8 mr-2 lg:mr-6 ml-2 lg:ml-6 mb-3 lg:mb-5">
        <div className="w-full relative">
          <img
            src={Frame9}
            alt="Investment Section"
            className="w-full h-auto"
          />

          {/* Mobile: Text below image */}
          <div className="block lg:hidden p-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Invest in it.
            </h2>
            <h3 className="text-2xl text-gray-400 mb-1">Live in it.</h3>
            <h4 className="text-2xl font-semibold text-gray-900">
              Rent it out.
            </h4>
          </div>

          {/* Desktop: Text overlay */}
          <div className="hidden lg:block absolute top-8 left-8 space-y-2">
            <h2 className="text-5xl text-black font-semibold">Invest in it.</h2>
            <h3 className="text-5xl text-gray-400">Live in it.</h3>
            <h4 className="text-5xl text-black font-semibold">Rent it out.</h4>
          </div>
        </div>
      </section>

      {/* New Section with Frame10 */}
      <section className="bg-gray-900 mx-2 lg:mx-8 mt-4 lg:mt-7 mb-6 lg:mb-10 rounded-2xl lg:rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[60vh] lg:min-h-screen">
          {/* Left side - Dark background with content */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-6 lg:p-8">
            <div className="max-w-lg text-center">
              <h2 className="text-2xl lg:text-6xl font-light text-white leading-tight">
                Escape.
                <br />
                Explore.
                <br />
                Experience.
              </h2>
            </div>
          </div>

          {/* Right side - Frame10 image */}
          <div className="w-full lg:w-2/5 flex items-center justify-center px-4 lg:px-8 py-6 lg:py-0">
            <div className="w-full max-w-xs lg:max-w-md">
              <img
                src={Frame10}
                alt="Property Image"
                className="w-full h-auto object-cover rounded-lg lg:rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Video Container */}
          <div className="relative z-10 w-full max-w-sm lg:max-w-4xl">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                scrolling="no"
                src="https://go.screenpal.com/player/cTQQnZnotbI?width=100%&height=100%&ff=1&title=0"
                allowFullScreen={true}
                className="w-full h-full"
              />

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 lg:top-4 lg:right-4 w-8 h-8 lg:w-10 lg:h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors z-10"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuanuHomepage;
