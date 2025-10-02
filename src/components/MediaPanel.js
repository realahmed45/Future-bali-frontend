import React, { useState, useEffect } from "react";
import { Upload, Save, LogOut, CheckCircle } from "lucide-react";

const ADMIN_PASSWORD = "admin123"; // Change this!
const BACKEND_URL = "https://future-bali-backend-production.up.railway.app"; // Your backend URL

const MediaAdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [mediaConfig, setMediaConfig] = useState(null);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [cloudinaryPreset, setCloudinaryPreset] = useState("media_uploads");
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState("dgbxypivn");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && !mediaConfig) {
      loadConfig();
    }
  }, [isAuthenticated]);

  const loadConfig = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/media/config`);
      const data = await response.json();

      if (data.success) {
        setMediaConfig(data.config);
      } else {
        alert("Failed to load configuration");
      }
    } catch (error) {
      console.error("Error loading config:", error);
      alert("Failed to connect to server");
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
      formData.append("upload_preset", cloudinaryPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
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
        alert('Upload successful! Click "Save & Push to GitHub" when done.');
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please check your Cloudinary settings.");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSaveAndPush = async () => {
    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/media/update-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config: mediaConfig }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveMessage("✓ Changes saved and pushed to GitHub successfully!");
        setTimeout(() => setSaveMessage(""), 5000);
      } else {
        alert("Failed to save: " + data.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes. Please try again.");
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
        // Already a Cloudinary URL
        return value;
      } else {
        // Local file - serve via backend
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
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Media Admin Panel
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

  if (!mediaConfig) {
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Media Management</h1>
          <div className="flex gap-3 items-center">
            {saveMessage && (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle size={20} />
                {saveMessage}
              </div>
            )}
            <button
              onClick={handleSaveAndPush}
              disabled={isSaving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <Save size={20} />
              {isSaving ? "Saving..." : "Save & Push to GitHub"}
            </button>

            <button
              onClick={() => {
                window.open(
                  `${BACKEND_URL}/api/media/download-config`,
                  "_blank"
                );
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              Download Config
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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Adventure Page
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
                ["homeImage", "mainImage", "fallbackImage", "sunsetImage"].map(
                  (key) =>
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
                renderMediaItem("adventure", "images", "storyImages", img, idx)
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
                renderMediaItem("adventure", "images", "blogImages", img, idx)
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Package Images
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {mediaConfig?.adventure.images.packageImages &&
                Object.entries(mediaConfig.adventure.images.packageImages).map(
                  ([key, value]) =>
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
            Nuanu Homepage
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {mediaConfig?.nuanu.images &&
              Object.entries(mediaConfig.nuanu.images).map(([key, value]) =>
                renderMediaItem("nuanu", "images", key, value)
              )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            How to Use
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-900">
            <li>Click Replace on any image or video you want to change</li>
            <li>
              Select your new file - it uploads to Cloudinary automatically
            </li>
            <li>Repeat for all images you want to update</li>
            <li>When finished, click the green Save & Push to GitHub button</li>
            <li>Wait for success message - your changes are now live!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MediaAdminPanel;
