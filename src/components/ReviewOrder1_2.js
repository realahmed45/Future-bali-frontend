import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import axios from "axios";
import { uploadFileToServer } from "../utils/fileupload";
import { SuccessToast } from "./SuccessTost";

const UserInfoForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("[UserInfoForm] Location state:", state);

  const countryOptions = countryList().getData();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    address: "",
    country: null,
    email: "",
    passportId: "",
    frontImage: null,
    frontImagePreview: null,
    backImage: null,
    backImagePreview: null,
  });

  const [people, setPeople] = useState([formData]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (index, field, value) => {
    const newPeople = [...people];
    newPeople[index] = {
      ...newPeople[index],
      [field]: value,
    };
    setPeople(newPeople);

    // Clear error when user starts typing
    if (errors[`${index}-${field}`]) {
      setErrors((prev) => ({ ...prev, [`${index}-${field}`]: "" }));
    }
  };

  const handleCountryChange = (index, selectedOption) => {
    const newPeople = [...people];
    newPeople[index] = {
      ...newPeople[index],
      country: selectedOption,
    };
    setPeople(newPeople);

    // Clear error when user starts typing
    if (errors[`${index}-country`]) {
      setErrors((prev) => ({ ...prev, [`${index}-country`]: "" }));
    }
  };

  const handleImageUpload = (index, field, file) => {
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, PNG, and PDF files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPeople = [...people];
        newPeople[index] = {
          ...newPeople[index],
          [field]: file,
          [`${field}Preview`]: reader.result,
        };
        setPeople(newPeople);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPerson = () => {
    setPeople([...people, { ...formData }]);
  };

  const removePerson = (index) => {
    if (people.length > 1) {
      const newPeople = people.filter((_, i) => i !== index);
      setPeople(newPeople);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    people.forEach((person, index) => {
      if (!person.name.trim()) {
        newErrors[`${index}-name`] = "Name is required";
      }
      if (!person.phone.trim()) {
        newErrors[`${index}-phone`] = "Phone number is required";
      }
      if (!person.dob) {
        newErrors[`${index}-dob`] = "Date of birth is required";
      }
      if (!person.address.trim()) {
        newErrors[`${index}-address`] = "Address is required";
      }
      if (!person.country) {
        newErrors[`${index}-country`] = "Country is required";
      }
      if (!person.email.trim()) {
        newErrors[`${index}-email`] = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(person.email)) {
        newErrors[`${index}-email`] = "Email is invalid";
      }
      if (!person.passportId.trim()) {
        newErrors[`${index}-passportId`] = "Passport/ID number is required";
      }
      if (!person.frontImage) {
        newErrors[`${index}-frontImage`] = "Front image is required";
      }
      if (!person.backImage) {
        newErrors[`${index}-backImage`] = "Back image is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { selectedAddOns, basePackage, totalCost, cartId, orderId } =
    state || {};

  const handleNext = async () => {
    if (!validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!orderId) {
      alert("Order ID is missing. Please go back and try again.");
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      console.log("[UserInfoForm] Uploading images and saving user info");

      // Upload images if they exist
      const uploadedData = await Promise.all(
        people.map(async (person) => {
          let frontImageUrl = null;
          let backImageUrl = null;

          if (person.frontImage) {
            try {
              frontImageUrl = await uploadFileToServer(person.frontImage);
            } catch (error) {
              console.error("Error uploading front image:", error);
              // Continue with null if upload fails
            }
          }

          if (person.backImage) {
            try {
              backImageUrl = await uploadFileToServer(person.backImage);
            } catch (error) {
              console.error("Error uploading back image:", error);
              // Continue with null if upload fails
            }
          }

          return {
            ...person,
            frontImage: frontImageUrl,
            backImage: backImageUrl,
            country: person.country ? person.country.label : null,
          };
        })
      );

      console.log("[UserInfoForm] Saving user info to order:", orderId);

      // Save user info to order
      const response = await axios.post(
        "https://future-bali-backend-1.onrender.com/api/orders/save-user-info",
        {
          userInfo: uploadedData,
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      console.log("[UserInfoForm] User info saved successfully");
      <SuccessToast />;

      navigate("/review_order1_3", {
        state: {
          selectedAddOns,
          basePackage,
          totalCost,
          cartId,
          orderId,
          formData: uploadedData[0], // Primary user is first
        },
      });
    } catch (error) {
      console.error("Error saving user info:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save information. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700 text-center">
        Kindly let us know under whose name the contract should be prepared
      </h1>
      <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
        PLEASE FILL IN YOUR DETAILS AND INFORMATION
      </h2>

      {people.map((person, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-purple-600">
              Person {index + 1}
            </h3>
            {people.length > 1 && (
              <button
                onClick={() => removePerson(index)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors[`${index}-name`] ? "border-red-500" : "border-gray-300"
                }`}
                value={person.name}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
              {errors[`${index}-name`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-name`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number/WhatsApp *
              </label>
              <input
                type="tel"
                className={`w-full p-2 border rounded-md ${
                  errors[`${index}-phone`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={person.phone}
                onChange={(e) =>
                  handleInputChange(index, "phone", e.target.value)
                }
              />
              {errors[`${index}-phone`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-phone`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                className={`w-full p-2 border rounded-md ${
                  errors[`${index}-dob`] ? "border-red-500" : "border-gray-300"
                }`}
                value={person.dob}
                onChange={(e) =>
                  handleInputChange(index, "dob", e.target.value)
                }
              />
              {errors[`${index}-dob`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-dob`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors[`${index}-address`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={person.address}
                onChange={(e) =>
                  handleInputChange(index, "address", e.target.value)
                }
              />
              {errors[`${index}-address`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-address`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <Select
                options={countryOptions}
                value={person.country}
                onChange={(selectedOption) =>
                  handleCountryChange(index, selectedOption)
                }
                placeholder="Select a country"
                className={`w-full ${
                  errors[`${index}-country`] ? "border-red-500" : ""
                }`}
              />
              {errors[`${index}-country`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-country`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                className={`w-full p-2 border rounded-md ${
                  errors[`${index}-email`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={person.email}
                onChange={(e) =>
                  handleInputChange(index, "email", e.target.value)
                }
              />
              {errors[`${index}-email`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-email`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport/ID Number *
              </label>
              <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                  errors[`${index}-passportId`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={person.passportId}
                onChange={(e) =>
                  handleInputChange(index, "passportId", e.target.value)
                }
              />
              {errors[`${index}-passportId`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-passportId`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport/ID Front Image *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 relative h-48 ${
                  errors[`${index}-frontImage`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id={`front-image-${index}`}
                  onChange={(e) =>
                    handleImageUpload(index, "frontImage", e.target.files[0])
                  }
                />
                <label
                  htmlFor={`front-image-${index}`}
                  className="cursor-pointer h-full w-full flex items-center justify-center"
                >
                  {person.frontImagePreview ? (
                    <img
                      src={person.frontImagePreview}
                      alt="Front ID Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-3xl text-gray-400">+</span>
                      <span className="text-sm text-gray-500 mt-2">
                        Upload Image
                      </span>
                    </div>
                  )}
                </label>
              </div>
              {errors[`${index}-frontImage`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-frontImage`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport/ID Back Image *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 relative h-48 ${
                  errors[`${index}-backImage`]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id={`back-image-${index}`}
                  onChange={(e) =>
                    handleImageUpload(index, "backImage", e.target.files[0])
                  }
                />
                <label
                  htmlFor={`back-image-${index}`}
                  className="cursor-pointer h-full w-full flex items-center justify-center"
                >
                  {person.backImagePreview ? (
                    <img
                      src={person.backImagePreview}
                      alt="Back ID Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-3xl text-gray-400">+</span>
                      <span className="text-sm text-gray-500 mt-2">
                        Upload Image
                      </span>
                    </div>
                  )}
                </label>
              </div>
              {errors[`${index}-backImage`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`${index}-backImage`]}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-purple-50 hover:border-purple-600"
          onClick={addPerson}
        >
          Add another person info to this order +
        </button>

        <button
          className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:opacity-50"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default UserInfoForm;
