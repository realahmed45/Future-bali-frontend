import React, { useState, useEffect } from "react";
import {
  Upload,
  Save,
  LogOut,
  CheckCircle,
  Download,
  Type,
  Image,
} from "lucide-react";

const ADMIN_PASSWORD = "admin123";
const BACKEND_URL = "https://future-bali-backend-production.up.railway.app";

const MediaAdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mediaConfig, setMediaConfig] = useState(null);
  const [textConfig, setTextConfig] = useState(null);
  const [activeTab, setActiveTab] = useState("media");
  const [uploadingKey, setUploadingKey] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && !mediaConfig) {
      loadMediaConfig();
      loadTextConfig();
    }
  }, [isAuthenticated]);

  const loadMediaConfig = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/media/config`);
      const data = await response.json();
      if (data.success) {
        setMediaConfig(data.config);
      }
    } catch (error) {
      console.error("Error loading media config:", error);
    }
  };

  const loadTextConfig = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/text/config`);
      const data = await response.json();
      if (data.success) {
        setTextConfig(data.config);
      }
    } catch (error) {
      console.error("Error loading text config:", error);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleFileUpload = async (
    file,
    section,
    category,
    key,
    index = null
  ) => {
    if (!file) return;

    const uniqueKey = `${section}-${category}-${key}-${index}`;
    setUploadingKey(uniqueKey);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${BACKEND_URL}/api/media/upload-to-cloudinary`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success && data.secure_url) {
        const newConfig = { ...mediaConfig };

        if (index !== null) {
          newConfig[section][category][key][index] = data.secure_url;
        } else if (Array.isArray(key)) {
          const [parentKey, childKey] = key;
          newConfig[section][category][parentKey][childKey] = data.secure_url;
        } else {
          newConfig[section][category][key] = data.secure_url;
        }

        setMediaConfig(newConfig);
        alert('Upload successful! Click "Save Changes" when done.');
      } else {
        alert("Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleTextChange = (section, key, value) => {
    const newConfig = { ...textConfig };
    newConfig[section][key] = value;
    setTextConfig(newConfig);
  };

  const handleArrayTextChange = (section, arrayKey, index, value) => {
    const newConfig = { ...textConfig };
    newConfig[section][arrayKey][index] = value;
    setTextConfig(newConfig);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      if (activeTab === "media") {
        const response = await fetch(`${BACKEND_URL}/api/media/update-config`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: mediaConfig }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
      }

      if (activeTab === "text") {
        const response = await fetch(`${BACKEND_URL}/api/text/update-config`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: textConfig }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
      }

      setSaveMessage("✓ Changes saved successfully!");
      setTimeout(() => setSaveMessage(""), 5000);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderMediaItem = (section, category, key, value, index = null) => {
    const uniqueKey = `${section}-${category}-${key}-${index}`;
    const isUploading = uploadingKey === uniqueKey;
    const isVideo = typeof value === "string" && value.includes(".mp4");

    const getImageSrc = () => {
      if (value.startsWith("http")) {
        return value;
      } else {
        return `${BACKEND_URL}/media-preview/images/${value}`;
      }
    };

    return (
      <div
        key={uniqueKey}
        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
      >
        <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
          {isVideo ? (
            <video
              src={value}
              className="w-full h-full object-cover"
              controls
            />
          ) : (
            <img
              src={getImageSrc()}
              alt={String(key)}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/400x300/e2e8f0/64748b?text=${encodeURIComponent(
                  String(key)
                )}`;
              }}
            />
          )}
        </div>

        <div className="text-sm font-medium text-gray-700 mb-2 truncate">
          {index !== null ? `${key}[${index}]` : String(key)}
        </div>

        <label
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Upload size={16} />
          <span className="text-sm">
            {isUploading ? "Uploading..." : "Replace"}
          </span>
          <input
            type="file"
            className="hidden"
            accept={isVideo ? "video/*" : "image/*"}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, section, category, key, index);
            }}
            disabled={isUploading}
          />
        </label>
      </div>
    );
  };

  const renderTextEditor = (section, label, key, value, type = "input") => {
    return (
      <div
        key={`${section}-${key}`}
        className="bg-white rounded-lg shadow-md p-4"
      >
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        {type === "textarea" ? (
          <textarea
            value={value || ""}
            onChange={(e) => handleTextChange(section, key, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-y"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleTextChange(section, key, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
        <div className="text-xs text-gray-500 mt-2">
          Characters: {(value || "").length}
        </div>
      </div>
    );
  };

  const renderArrayTextEditor = (section, arrayKey, label, values = []) => {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800">{label}</h4>
        {values.map((value, index) => (
          <div
            key={`${section}-${arrayKey}-${index}`}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {label} {index + 1}
            </label>
            <input
              type="text"
              value={value || ""}
              onChange={(e) =>
                handleArrayTextChange(section, arrayKey, index, e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter ${label.toLowerCase()} ${index + 1}...`}
            />
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Content Admin Panel
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mediaConfig || !textConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Content Management
            </h1>
            <div className="flex gap-3 items-center">
              {saveMessage && (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle size={20} />
                  {saveMessage}
                </div>
              )}
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <Save size={20} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("media")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "media"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Image size={18} />
              Media
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Type size={18} />
              Text Content
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "media" ? (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Adventure Page Media
              </h2>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Hero Videos
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {mediaConfig?.adventure.videos &&
                    Object.entries(mediaConfig.adventure.videos).map(
                      ([key, value]) =>
                        renderMediaItem("adventure", "videos", key, value)
                    )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Main Images
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {mediaConfig?.adventure.images &&
                    [
                      "homeImage",
                      "mainImage",
                      "fallbackImage",
                      "sunsetImage",
                    ].map((key) =>
                      renderMediaItem(
                        "adventure",
                        "images",
                        key,
                        mediaConfig.adventure.images[key]
                      )
                    )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Story Slider Images
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {mediaConfig?.adventure.images.storyImages.map((img, idx) =>
                    renderMediaItem(
                      "adventure",
                      "images",
                      "storyImages",
                      img,
                      idx
                    )
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Gallery Images
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {mediaConfig?.adventure.images.galleryImages.map((img, idx) =>
                    renderMediaItem(
                      "adventure",
                      "images",
                      "galleryImages",
                      img,
                      idx
                    )
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Blog Images
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {mediaConfig?.adventure.images.blogImages.map((img, idx) =>
                    renderMediaItem(
                      "adventure",
                      "images",
                      "blogImages",
                      img,
                      idx
                    )
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                  Package Images
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {mediaConfig?.adventure.images.packageImages &&
                    Object.entries(
                      mediaConfig.adventure.images.packageImages
                    ).map(([key, value]) =>
                      renderMediaItem(
                        "adventure",
                        "images",
                        ["packageImages", key],
                        value
                      )
                    )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Nuanu Homepage Media
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {mediaConfig?.nuanu.images &&
                  Object.entries(mediaConfig.nuanu.images).map(([key, value]) =>
                    renderMediaItem("nuanu", "images", key, value)
                  )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* NUANU HOME PAGE TEXT */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Nuanu Home Page Text
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Hero Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "nuanu",
                      "Main Title",
                      "mainTitle",
                      textConfig?.nuanu?.mainTitle
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Subtitle",
                      "subtitle",
                      textConfig?.nuanu?.subtitle
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Price Text",
                      "priceText",
                      textConfig?.nuanu?.priceText
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Large Heading Line 1",
                      "largeHeading1",
                      textConfig?.nuanu?.largeHeading1
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Large Heading Line 2",
                      "largeHeading2",
                      textConfig?.nuanu?.largeHeading2
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Rental Income Badge",
                      "rentalIncome",
                      textConfig?.nuanu?.rentalIncome
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Select Home Text",
                      "selectHomeText",
                      textConfig?.nuanu?.selectHomeText
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "See Options Button",
                      "seeOptionsBtn",
                      textConfig?.nuanu?.seeOptionsBtn
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Welcome Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "nuanu",
                      "Location",
                      "location",
                      textConfig?.nuanu?.location
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Welcome Heading",
                      "welcomeHeading",
                      textConfig?.nuanu?.welcomeHeading
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Welcome Paragraph 1",
                      "welcomePara1",
                      textConfig?.nuanu?.welcomePara1,
                      "textarea"
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Welcome Paragraph 2",
                      "welcomePara2",
                      textConfig?.nuanu?.welcomePara2,
                      "textarea"
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Highlight Text",
                      "highlightText",
                      textConfig?.nuanu?.highlightText
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Creative Property Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "nuanu",
                      "Creative Property Text",
                      "creativePropertyText",
                      textConfig?.nuanu?.creativePropertyText,
                      "textarea"
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Investment Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "nuanu",
                      "Investment Title Line 1",
                      "investmentTitle1",
                      textConfig?.nuanu?.investmentTitle1
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Investment Title Line 2",
                      "investmentTitle2",
                      textConfig?.nuanu?.investmentTitle2
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Investment Title Line 3",
                      "investmentTitle3",
                      textConfig?.nuanu?.investmentTitle3
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Investment Description",
                      "investmentDesc",
                      textConfig?.nuanu?.investmentDesc,
                      "textarea"
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Features Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "nuanu",
                      "Features Heading",
                      "featuresHeading",
                      textConfig?.nuanu?.featuresHeading
                    )}
                    {renderArrayTextEditor(
                      "nuanu",
                      "features",
                      "Feature",
                      textConfig?.nuanu?.features
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Features CTA Text",
                      "featuresCTA",
                      textConfig?.nuanu?.featuresCTA
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Map Features
                  </h3>
                  <div className="space-y-4">
                    {renderArrayTextEditor(
                      "nuanu",
                      "mapFeatures",
                      "Map Feature",
                      textConfig?.nuanu?.mapFeatures
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Final Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "nuanu",
                      "Final Title Line 1",
                      "finalTitle1",
                      textConfig?.nuanu?.finalTitle1
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Final Title Line 2",
                      "finalTitle2",
                      textConfig?.nuanu?.finalTitle2
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Final Title Line 3",
                      "finalTitle3",
                      textConfig?.nuanu?.finalTitle3
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Escape Heading Line 1",
                      "escapeHeading1",
                      textConfig?.nuanu?.escapeHeading1
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Escape Heading Line 2",
                      "escapeHeading2",
                      textConfig?.nuanu?.escapeHeading2
                    )}
                    {renderTextEditor(
                      "nuanu",
                      "Escape Heading Line 3",
                      "escapeHeading3",
                      textConfig?.nuanu?.escapeHeading3
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ADVENTURE PAGE TEXT */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Adventure Page Text
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Hero Buttons
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "adventure",
                      "View Packages Button",
                      "viewPackagesBtn",
                      textConfig?.adventure?.viewPackagesBtn
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Contact Us Button",
                      "contactUsBtn",
                      textConfig?.adventure?.contactUsBtn
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Packages Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "adventure",
                      "Section Label",
                      "packagesLabel",
                      textConfig?.adventure?.packagesLabel
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Section Heading",
                      "packagesHeading",
                      textConfig?.adventure?.packagesHeading
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Section Description",
                      "packagesDesc",
                      textConfig?.adventure?.packagesDesc,
                      "textarea"
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Package 1 Button",
                      "package1Btn",
                      textConfig?.adventure?.package1Btn
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Package 2 Button",
                      "package2Btn",
                      textConfig?.adventure?.package2Btn
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Package 3 Button",
                      "package3Btn",
                      textConfig?.adventure?.package3Btn
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Package Details
                  </h3>
                  <div className="space-y-4">
                    {renderArrayTextEditor(
                      "adventure",
                      "package1Details",
                      "Package 1 Detail",
                      textConfig?.adventure?.package1Details
                    )}
                    {renderArrayTextEditor(
                      "adventure",
                      "package2Details",
                      "Package 2 Detail",
                      textConfig?.adventure?.package2Details
                    )}
                    {renderArrayTextEditor(
                      "adventure",
                      "package3Details",
                      "Package 3 Detail",
                      textConfig?.adventure?.package3Details
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Story Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "adventure",
                      "Story Subtitle",
                      "storySubtitle",
                      textConfig?.adventure?.storySubtitle
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Story Title",
                      "storyTitle",
                      textConfig?.adventure?.storyTitle
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Story Paragraph 1",
                      "storyPara1",
                      textConfig?.adventure?.storyPara1,
                      "textarea"
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Story Paragraph 2",
                      "storyPara2",
                      textConfig?.adventure?.storyPara2,
                      "textarea"
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Gallery Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "adventure",
                      "Gallery Title",
                      "galleryTitle",
                      textConfig?.adventure?.galleryTitle
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Gallery Subtitle",
                      "gallerySubtitle",
                      textConfig?.adventure?.gallerySubtitle
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Blog Section
                  </h3>
                  <div className="space-y-4">
                    {renderTextEditor(
                      "adventure",
                      "Blog Title",
                      "blogTitle",
                      textConfig?.adventure?.blogTitle
                    )}
                    {renderTextEditor(
                      "adventure",
                      "Blog Subtitle",
                      "blogSubtitle",
                      textConfig?.adventure?.blogSubtitle
                    )}
                    {renderArrayTextEditor(
                      "adventure",
                      "blogTitles",
                      "Blog Post Title",
                      textConfig?.adventure?.blogTitles
                    )}
                    {renderArrayTextEditor(
                      "adventure",
                      "blogDescriptions",
                      "Blog Post Description",
                      textConfig?.adventure?.blogDescriptions
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            How to Use
          </h3>
          {activeTab === "media" ? (
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
              <li>Click Replace on any image or video you want to change</li>
              <li>
                Select your new file - it uploads to Cloudinary automatically
              </li>
              <li>Repeat for all images you want to update</li>
              <li>Click Save Changes when finished</li>
            </ol>
          ) : (
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
              <li>Edit any text field by typing directly in the input boxes</li>
              <li>Use textarea fields for longer content</li>
              <li>Changes are saved locally until you click Save Changes</li>
              <li>Click Save Changes to push updates to the server</li>
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaAdminPanel;
