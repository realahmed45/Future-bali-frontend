import React, { useState, useEffect } from "react";
import { Save, LogOut, CheckCircle } from "lucide-react";

const ADMIN_PASSWORD = "admin123";
const BACKEND_URL = "https://future-bali-backend-production.up.railway.app";

const TextAdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [textConfig, setTextConfig] = useState(null);
  const [activeSection, setActiveSection] = useState("nuanu");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated && !textConfig) {
      loadTextConfig();
    }
  }, [isAuthenticated]);

  const loadTextConfig = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/text/config`);
      const data = await response.json();
      if (data.success) {
        setTextConfig(data.config);
      }
    } catch (error) {
      console.error("Error loading text config:", error);
      alert("Failed to load configuration");
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
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
      const response = await fetch(`${BACKEND_URL}/api/text/update-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: textConfig }),
      });
      const data = await response.json();

      if (!data.success) throw new Error(data.message);

      setSaveMessage("✓ Changes saved successfully!");
      setTimeout(() => setSaveMessage(""), 5000);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes: " + error.message);
    } finally {
      setIsSaving(false);
    }
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px] resize-y"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleTextChange(section, key, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder={`Enter ${label.toLowerCase()} ${index + 1}...`}
            />
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Text Admin Panel
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter password"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!textConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Text Content Management
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

          {/* Navigation */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "nuanu", label: "Nuanu Home" },
              { key: "adventure", label: "Adventure" },
              { key: "package1", label: "Package 1" },
              { key: "package2", label: "Package 2" },
              { key: "package3", label: "Package 3" },
              { key: "contact", label: "Contact Us" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === key
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* NUANU HOME */}
        {activeSection === "nuanu" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Nuanu Home Page
            </h2>

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
                  "Large Heading 1",
                  "largeHeading1",
                  textConfig?.nuanu?.largeHeading1
                )}
                {renderTextEditor(
                  "nuanu",
                  "Large Heading 2",
                  "largeHeading2",
                  textConfig?.nuanu?.largeHeading2
                )}
                {renderTextEditor(
                  "nuanu",
                  "Rental Income",
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
                  "Welcome Para 1",
                  "welcomePara1",
                  textConfig?.nuanu?.welcomePara1,
                  "textarea"
                )}
                {renderTextEditor(
                  "nuanu",
                  "Welcome Para 2",
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
                Features
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
                  "Features CTA",
                  "featuresCTA",
                  textConfig?.nuanu?.featuresCTA
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADVENTURE */}
        {activeSection === "adventure" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Adventure Page</h2>

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
                  "Packages Label",
                  "packagesLabel",
                  textConfig?.adventure?.packagesLabel
                )}
                {renderTextEditor(
                  "adventure",
                  "Packages Heading",
                  "packagesHeading",
                  textConfig?.adventure?.packagesHeading
                )}
                {renderTextEditor(
                  "adventure",
                  "Packages Description",
                  "packagesDesc",
                  textConfig?.adventure?.packagesDesc,
                  "textarea"
                )}
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
                  "Blog Title",
                  textConfig?.adventure?.blogTitles
                )}
                {renderArrayTextEditor(
                  "adventure",
                  "blogDescriptions",
                  "Blog Description",
                  textConfig?.adventure?.blogDescriptions
                )}
              </div>
            </div>
          </div>
        )}

        {/* PACKAGE 1 */}
        {activeSection === "package1" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Package 1</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Header
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package1",
                  "Header Title",
                  "headerTitle",
                  textConfig?.package1?.headerTitle
                )}
                {renderTextEditor(
                  "package1",
                  "Header Subtitle",
                  "headerSubtitle",
                  textConfig?.package1?.headerSubtitle
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Package Info
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package1",
                  "Package Name",
                  "packageName",
                  textConfig?.package1?.packageName
                )}
                {renderTextEditor(
                  "package1",
                  "Duration",
                  "duration",
                  textConfig?.package1?.duration
                )}
                {renderTextEditor(
                  "package1",
                  "Budget",
                  "budget",
                  textConfig?.package1?.budget
                )}
                {renderArrayTextEditor(
                  "package1",
                  "tags",
                  "Tag",
                  textConfig?.package1?.tags
                )}
                {renderArrayTextEditor(
                  "package1",
                  "furnishingItems",
                  "Furnishing Item",
                  textConfig?.package1?.furnishingItems
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Descriptions
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package1",
                  "Description 1",
                  "description1",
                  textConfig?.package1?.description1,
                  "textarea"
                )}
                {renderTextEditor(
                  "package1",
                  "Description 2",
                  "description2",
                  textConfig?.package1?.description2,
                  "textarea"
                )}
                {renderTextEditor(
                  "package1",
                  "Proceed Button",
                  "proceedBtn",
                  textConfig?.package1?.proceedBtn
                )}
              </div>
            </div>
          </div>
        )}

        {/* PACKAGE 2 */}
        {activeSection === "package2" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Package 2</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Header
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package2",
                  "Header Title",
                  "headerTitle",
                  textConfig?.package2?.headerTitle
                )}
                {renderTextEditor(
                  "package2",
                  "Header Subtitle",
                  "headerSubtitle",
                  textConfig?.package2?.headerSubtitle
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Package Info
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package2",
                  "Package Name",
                  "packageName",
                  textConfig?.package2?.packageName
                )}
                {renderTextEditor(
                  "package2",
                  "Duration",
                  "duration",
                  textConfig?.package2?.duration
                )}
                {renderTextEditor(
                  "package2",
                  "Budget",
                  "budget",
                  textConfig?.package2?.budget
                )}
                {renderArrayTextEditor(
                  "package2",
                  "tags",
                  "Tag",
                  textConfig?.package2?.tags
                )}
                {renderArrayTextEditor(
                  "package2",
                  "furnishingItems",
                  "Furnishing Item",
                  textConfig?.package2?.furnishingItems
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Descriptions
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package2",
                  "Description 1",
                  "description1",
                  textConfig?.package2?.description1,
                  "textarea"
                )}
                {renderTextEditor(
                  "package2",
                  "Description 2",
                  "description2",
                  textConfig?.package2?.description2,
                  "textarea"
                )}
                {renderTextEditor(
                  "package2",
                  "Proceed Button",
                  "proceedBtn",
                  textConfig?.package2?.proceedBtn
                )}
              </div>
            </div>
          </div>
        )}

        {/* PACKAGE 3 */}
        {activeSection === "package3" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Package 3</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Header
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package3",
                  "Header Title",
                  "headerTitle",
                  textConfig?.package3?.headerTitle
                )}
                {renderTextEditor(
                  "package3",
                  "Header Subtitle",
                  "headerSubtitle",
                  textConfig?.package3?.headerSubtitle
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Package Info
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package3",
                  "Package Name",
                  "packageName",
                  textConfig?.package3?.packageName
                )}
                {renderTextEditor(
                  "package3",
                  "Duration",
                  "duration",
                  textConfig?.package3?.duration
                )}
                {renderTextEditor(
                  "package3",
                  "Budget",
                  "budget",
                  textConfig?.package3?.budget
                )}
                {renderArrayTextEditor(
                  "package3",
                  "tags",
                  "Tag",
                  textConfig?.package3?.tags
                )}
                {renderArrayTextEditor(
                  "package3",
                  "furnishingItems",
                  "Furnishing Item",
                  textConfig?.package3?.furnishingItems
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Descriptions
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "package3",
                  "Description 1",
                  "description1",
                  textConfig?.package3?.description1,
                  "textarea"
                )}
                {renderTextEditor(
                  "package3",
                  "Description 2",
                  "description2",
                  textConfig?.package3?.description2,
                  "textarea"
                )}
                {renderTextEditor(
                  "package3",
                  "Proceed Button",
                  "proceedBtn",
                  textConfig?.package3?.proceedBtn
                )}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT US */}
        {activeSection === "contact" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Main Section
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "contact",
                  "Main Heading",
                  "mainHeading",
                  textConfig?.contact?.mainHeading
                )}
                {renderTextEditor(
                  "contact",
                  "Subheading",
                  "subheading",
                  textConfig?.contact?.subheading,
                  "textarea"
                )}
                {renderTextEditor(
                  "contact",
                  "Left Title",
                  "leftTitle",
                  textConfig?.contact?.leftTitle
                )}
                {renderTextEditor(
                  "contact",
                  "Left Description",
                  "leftDescription",
                  textConfig?.contact?.leftDescription,
                  "textarea"
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Contact Info
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "contact",
                  "Direct Line Label",
                  "directLineLabel",
                  textConfig?.contact?.directLineLabel
                )}
                {renderTextEditor(
                  "contact",
                  "Direct Line Number",
                  "directLineNumber",
                  textConfig?.contact?.directLineNumber
                )}
                {renderTextEditor(
                  "contact",
                  "Response Time Label",
                  "responseTimeLabel",
                  textConfig?.contact?.responseTimeLabel
                )}
                {renderTextEditor(
                  "contact",
                  "Response Time",
                  "responseTime",
                  textConfig?.contact?.responseTime
                )}
                {renderTextEditor(
                  "contact",
                  "Available Label",
                  "availableLabel",
                  textConfig?.contact?.availableLabel
                )}
                {renderTextEditor(
                  "contact",
                  "Available",
                  "available",
                  textConfig?.contact?.available
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                WhatsApp Section
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "contact",
                  "WhatsApp Title",
                  "whatsappTitle",
                  textConfig?.contact?.whatsappTitle
                )}
                {renderTextEditor(
                  "contact",
                  "WhatsApp Description",
                  "whatsappDescription",
                  textConfig?.contact?.whatsappDescription,
                  "textarea"
                )}
                {renderTextEditor(
                  "contact",
                  "WhatsApp Button",
                  "whatsappButton",
                  textConfig?.contact?.whatsappButton
                )}
                {renderTextEditor(
                  "contact",
                  "WhatsApp Note",
                  "whatsappNote",
                  textConfig?.contact?.whatsappNote
                )}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Features
              </h3>
              <div className="space-y-4">
                {renderTextEditor(
                  "contact",
                  "Feature 1 Title",
                  "feature1Title",
                  textConfig?.contact?.feature1Title
                )}
                {renderTextEditor(
                  "contact",
                  "Feature 1 Description",
                  "feature1Desc",
                  textConfig?.contact?.feature1Desc
                )}
                {renderTextEditor(
                  "contact",
                  "Feature 2 Title",
                  "feature2Title",
                  textConfig?.contact?.feature2Title
                )}
                {renderTextEditor(
                  "contact",
                  "Feature 2 Description",
                  "feature2Desc",
                  textConfig?.contact?.feature2Desc
                )}
                {renderTextEditor(
                  "contact",
                  "Feature 3 Title",
                  "feature3Title",
                  textConfig?.contact?.feature3Title
                )}
                {renderTextEditor(
                  "contact",
                  "Feature 3 Description",
                  "feature3Desc",
                  textConfig?.contact?.feature3Desc
                )}
              </div>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">
            How to Use
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-purple-900">
            <li>
              Select the page you want to edit using the navigation buttons
              above
            </li>
            <li>Edit any text field by typing directly in the input boxes</li>
            <li>
              Use textarea fields for longer content (they resize automatically)
            </li>
            <li>Changes are saved locally until you click "Save Changes"</li>
            <li>Click "Save Changes" to push all updates to the server</li>
            <li>Refresh your website to see the changes live!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TextAdminPanel;
