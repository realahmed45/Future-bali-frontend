import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadFileToServer } from "../utils/fileupload";
import { SuccessToast } from "./SuccessTost";

const ContactForm2 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("[ContactForm2] Location state:", state);

  const [skipForm, setSkipForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "",
      phoneNumber: "",
      passportId: "",
      idImage: null,
      idImagePreview: "",
    },
    {
      id: 2,
      name: "",
      phoneNumber: "",
      passportId: "",
      idImage: null,
      idImagePreview: "",
    },
  ]);

  const handleInputChange = (contactId, field, value) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId ? { ...contact, [field]: value } : contact
      )
    );

    // Clear error when user starts typing
    if (errors[`${contactId}-${field}`]) {
      setErrors((prev) => ({ ...prev, [`${contactId}-${field}`]: "" }));
    }
  };

  const handleImageChange = (contactId, e) => {
    const file = e.target.files[0];
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
      reader.onload = (event) => {
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === contactId
              ? {
                  ...contact,
                  idImage: file,
                  idImagePreview: event.target.result,
                }
              : contact
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (contactId) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? { ...contact, idImage: null, idImagePreview: "" }
          : contact
      )
    );
  };

  const addContact = () => {
    const newContact = {
      id: Date.now(),
      name: "",
      phoneNumber: "",
      passportId: "",
      idImage: null,
      idImagePreview: "",
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const removeContact = (contactId) => {
    if (contacts.length > 2) {
      setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
    }
  };

  const validateForm = () => {
    if (skipForm) return true;

    const newErrors = {};

    contacts.forEach((contact) => {
      if (!contact.name.trim()) {
        newErrors[`${contact.id}-name`] = "Name is required";
      }
      if (!contact.phoneNumber.trim()) {
        newErrors[`${contact.id}-phoneNumber`] = "Phone number is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get order data from location state
  const { selectedAddOns, basePackage, totalCost, cartId, orderId } =
    state || {};

  const handleNext = async () => {
    if (!skipForm && !validateForm()) {
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
      if (!skipForm) {
        console.log(
          "[ContactForm2] Uploading images and saving emergency contacts"
        );

        // Upload images if they exist
        const contactsWithImages = await Promise.all(
          contacts.map(async (contact) => {
            let idImageUrl = null;

            if (contact.idImage) {
              try {
                idImageUrl = await uploadFileToServer(contact.idImage);
              } catch (error) {
                console.error("Error uploading ID image:", error);
                // Continue with null if upload fails
              }
            }

            return {
              ...contact,
              idImage: idImageUrl,
            };
          })
        );

        console.log(
          "[ContactForm2] Saving emergency contacts for order:",
          orderId
        );

        await axios.post(
          "https://future-bali-backend-1.onrender.com/api/orders/save-emergency",
          {
            contacts: contactsWithImages,
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

        console.log("[ContactForm2] Emergency contacts saved successfully");
        <SuccessToast />;
      } else {
        console.log("[ContactForm2] Skipping emergency contacts form");
      }

      navigate("/place-order", {
        state: {
          selectedAddOns,
          basePackage,
          totalCost,
          cartId,
          orderId,
          contacts: skipForm ? [] : contacts,
        },
      });
    } catch (error) {
      console.error("Error saving emergency contacts:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save emergency contacts. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-purple-700 text-center">
        EMERGENCY CONTACT
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        If there is no contact from the customer to 'My Future Life Bali' for
        9-12 months, 'My Future Life Bali' must attempt to contact the
        customer's relatives or the appropriate embassy. Please mention below 2
        contacts with phone numbers.
      </p>

      {!skipForm && (
        <>
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="bg-white p-6 rounded-lg shadow-md mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-purple-600">
                  Contact {index + 1}
                </h3>
                {contacts.length > 2 && (
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded-md ${
                        errors[`${contact.id}-name`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={contact.name}
                      onChange={(e) =>
                        handleInputChange(contact.id, "name", e.target.value)
                      }
                    />
                    {errors[`${contact.id}-name`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`${contact.id}-name`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number/ WhatsApp *
                    </label>
                    <input
                      type="tel"
                      className={`w-full p-2 border rounded-md ${
                        errors[`${contact.id}-phoneNumber`]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      value={contact.phoneNumber}
                      onChange={(e) =>
                        handleInputChange(
                          contact.id,
                          "phoneNumber",
                          e.target.value
                        )
                      }
                    />
                    {errors[`${contact.id}-phoneNumber`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`${contact.id}-phoneNumber`]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passport/ ID Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={contact.passportId}
                    onChange={(e) =>
                      handleInputChange(
                        contact.id,
                        "passportId",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport/ID Image (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 relative h-48">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      id={`id-image-${contact.id}`}
                      onChange={(e) => handleImageChange(contact.id, e)}
                    />
                    <label
                      htmlFor={`id-image-${contact.id}`}
                      className="cursor-pointer h-full w-full flex items-center justify-center"
                    >
                      {contact.idImagePreview ? (
                        <div className="relative h-full w-full">
                          <img
                            src={contact.idImagePreview}
                            alt="ID Preview"
                            className="max-h-full max-w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeImage(contact.id);
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
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
                </div>
              </div>
            </div>
          ))}

          <div className="text-center mb-6">
            <button
              onClick={addContact}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
            >
              + Add Another Contact
            </button>
          </div>
        </>
      )}

      <div className="flex items-center justify-between mt-6">
        <label className="flex items-center space-x-4">
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6 text-purple-600"
            style={{ transform: "scale(1.5)" }}
            checked={skipForm}
            onChange={(e) => setSkipForm(e.target.checked)}
          />
          <span className="text-2xl font-extrabold text-gray-800">
            I WILL DO IT LATER OR I DON'T WANT TO FILL THIS
          </span>
        </label>

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

export default ContactForm2;
