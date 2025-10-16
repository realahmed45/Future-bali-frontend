import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, MapPin } from "lucide-react";
import mediaConfig from "../config/mediaConfig.json";
import { useTextConfig } from "../hooks/useTextConfig";

const NuanuHomepage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { textConfig, loading, error } = useTextConfig();

  // Get media from config
  const { images } = mediaConfig.nuanu;

  const getImageSrc = (imagePath) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    try {
      return require(`../assets/images/${imagePath}`);
    } catch (error) {
      console.error(`Image not found: ${imagePath}`);
      return imagePath;
    }
  };

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading content: {error}</p>
        </div>
      </div>
    );
  }

  // Get text content
  const t = textConfig.nuanu;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${getImageSrc(images.frame1)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute top-4 right-4 lg:top-6 lg:right-[750px] border border-white rounded-xl lg:rounded-2xl px-3 py-2 lg:px-5 lg:py-3 text-white z-10 shadow-lg">
          <div className="text-center">
            <div className="text-xs lg:text-base font-semibold">
              {t.rentalIncome}
            </div>
            <div className="text-xs lg:text-sm opacity-90">income per year</div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:top-1 lg:left-8 lg:transform-none text-white lg:text-black max-w-sm lg:max-w-md z-10 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-3 lg:mb-2 leading-tight">
            {t.mainTitle}
          </h1>
          <p className="text-3xl lg:text-4xl mb-1 font-bold">{t.subtitle}</p>
        </div>

        <div className="absolute bottom-20 lg:bottom-[350px] left-4 lg:left-14 text-white z-10">
          <h2 className="text-4xl lg:text-[120px] font-light mb-1 tracking-wide leading-none">
            {t.largeHeading1}
          </h2>
          <p className="text-xl lg:text-[60px] font-light opacity-90 tracking-wider leading-none">
            {t.largeHeading2}
          </p>
        </div>

        <div className="absolute bottom-8 right-4 lg:bottom-2 lg:right-28 mt-8 z-10">
          <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-2xl max-w-xs">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="flex-shrink-0">
                <img
                  src={getImageSrc(images.frameSmall)}
                  alt="Property preview"
                  className="w-10 h-10 lg:w-16 lg:h-16 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-2 leading-tight">
                  {t.selectHomeText}
                </p>
                <Link to="/packages" className="w-full">
                  <button className="bg-black text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full text-xs font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1 w-full">
                    <span>{t.seeOptionsBtn}</span>
                    <span className="ml-1">→</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-2 mb-6 lg:mb-8">
            <MapPin className="text-gray-600" size={20} />
            <span className="text-gray-600">{t.location}</span>
          </div>

          <h2 className="text-2xl lg:text-5xl font-bold mb-8 lg:mb-12 text-gray-900">
            {t.welcomeHeading}
          </h2>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
            <div className="space-y-4 lg:space-y-6">
              <p className="text-sm lg:text-lg text-gray-700 leading-relaxed">
                {t.welcomePara1}
              </p>
              <p className="text-sm lg:text-lg leading-relaxed">
                Bali is consistently ranked among{" "}
                <span className="text-blue-500 font-medium">
                  {t.highlightText}
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

      <section className="bg-white px-2 lg:px-0">
        <div className="w-full lg:w-[97%] lg:ml-5">
          <img
            src={getImageSrc(images.frame3)}
            alt="Nuanu Creative City"
            className="w-full h-auto block mb-4"
          />

          <div className="block lg:hidden px-4 py-6 mb-4">
            <p className="text-lg text-gray-800 leading-relaxed text-center">
              {t.creativePropertyText}
            </p>
          </div>

          <div className="hidden lg:block relative -mt-4 ml-[770px] mb-4">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="px-8 py-6 max-w-2xl mx-auto">
                <p className="text-3xl text-gray-800 ml-16 leading-relaxed text-center">
                  {t.creativePropertyText}
                </p>
              </div>
            </div>
          </div>

          <img
            src={getImageSrc(images.frame4)}
            alt="Nuanu Development"
            className="w-full h-auto block mb-4"
          />

          <div className="relative">
            <img
              src={getImageSrc(images.frame5)}
              alt="Integrated Ecosystem"
              className="w-full h-auto block mb-4"
            />

            <div className="block lg:hidden px-4 py-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                {t.investmentTitle1}{" "}
                <span className="text-gray-500">{t.investmentTitle2}</span>
              </h3>
              <p className="text-base text-gray-800 leading-relaxed text-center">
                {t.investmentDesc}
              </p>
            </div>

            <div className="hidden lg:block absolute top-8 left-8 max-w-md">
              <div className="px-6 py-6 mt-40">
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {t.investmentTitle1}{" "}
                  <span className="text-gray-500">life</span>
                </h3>
                <h3 className="text-3xl font-bold text-gray-500 mb-1">
                  {t.investmentTitle2}
                </h3>
                <h3 className="text-3xl font-bold text-gray-500 mb-3">
                  {t.investmentTitle3}
                </h3>
                <p className="text-2xl text-gray-800 mr-4 leading-relaxed">
                  {t.investmentDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative mx-auto w-fit mt-4 lg:mt-8 px-4 lg:px-0">
        <img
          src={getImageSrc(images.frame7)}
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

      <section className="py-8 lg:py-20 px-4 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-xl lg:text-5xl font-light text-gray-900 mb-8 lg:mb-12">
              {t.featuresHeading.split("as adventure")[0]}{" "}
              <span className="font-bold">as adventure</span>
            </h2>
          </div>

          <div className="flex justify-center lg:justify-end lg:mr-40">
            <div className="space-y-4 lg:space-y-8 max-w-sm lg:max-w-md w-full">
              <div className="space-y-2 lg:space-y-4">
                {t.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 lg:space-x-4 py-2 lg:py-3 border-b border-gray-100"
                  >
                    <span className="text-gray-400 text-sm font-mono w-6 lg:w-8">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-gray-900 text-sm lg:text-lg">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 lg:pt-8">
                <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <Link to="/packages" className="w-full">
                    <button className="bg-gray-800 text-white px-6 py-3 lg:px-8 lg:py-4 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors flex items-center space-x-2 w-full lg:w-auto">
                      <span>{t.seeOptionsBtn}</span>
                      <span>→</span>
                    </button>
                  </Link>
                  <p className="text-gray-600 text-center lg:text-left text-sm lg:text-base">
                    {t.featuresCTA}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-20 px-2 lg:px-8 bg-white">
        <div className="w-full">
          <div className="relative">
            <img
              src={getImageSrc(images.frame8)}
              alt="Nuanu Map"
              className="w-full h-auto"
            />

            <div className="block lg:hidden p-4 bg-white mt-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Map Features
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {t.mapFeatures.map((feature, index) => (
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

            <div className="hidden lg:block absolute top-1/4 mt-20 left-2 mr-14 p-8 max-w-md">
              <div className="space-y-3">
                {t.mapFeatures.map((feature, index) => (
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

      <section className="bg-white mt-4 lg:mt-8 mr-2 lg:mr-6 ml-2 lg:ml-6 mb-3 lg:mb-5">
        <div className="w-full relative">
          <img
            src={getImageSrc(images.frame9)}
            alt="Investment Section"
            className="w-full h-auto"
          />

          <div className="block lg:hidden p-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {t.finalTitle1}
            </h2>
            <h3 className="text-2xl text-gray-400 mb-1">{t.finalTitle2}</h3>
            <h4 className="text-2xl font-semibold text-gray-900">
              {t.finalTitle3}
            </h4>
          </div>

          <div className="hidden lg:block absolute top-8 left-8 space-y-2">
            <h2 className="text-5xl text-black font-semibold">
              {t.finalTitle1}
            </h2>
            <h3 className="text-5xl text-gray-400">{t.finalTitle2}</h3>
            <h4 className="text-5xl text-black font-semibold">
              {t.finalTitle3}
            </h4>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 mx-2 lg:mx-8 mt-4 lg:mt-7 mb-6 lg:mb-10 rounded-2xl lg:rounded-3xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[60vh] lg:min-h-screen">
          <div className="flex-1 bg-gray-900 flex items-center justify-center p-6 lg:p-8">
            <div className="max-w-lg text-center">
              <h2 className="text-2xl lg:text-6xl font-light text-white leading-tight">
                {t.escapeHeading1}
                <br />
                {t.escapeHeading2}
                <br />
                {t.escapeHeading3}
              </h2>
            </div>
          </div>

          <div className="w-full lg:w-2/5 flex items-center justify-center px-4 lg:px-8 py-6 lg:py-0">
            <div className="w-full max-w-xs lg:max-w-md">
              <img
                src={getImageSrc(images.frame10)}
                alt="Property Image"
                className="w-full h-auto object-cover rounded-lg lg:rounded-none"
              />
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            onClick={() => setIsModalOpen(false)}
          />
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
