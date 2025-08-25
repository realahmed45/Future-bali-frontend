import React, { useState } from "react";
import mailIcon from "../assets/images/email.png";
import phoneIcon from "../assets/images/phone.png";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    email: "",
    phone: "",
    message: "",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      country: "",
      email: "",
      phone: "",
      message: "",
      budget: "",
    });
  };

  return (
    <div className="bg-gray-100">
      {/* Main Contact Section */}
      <div className="container mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative">
        {/* Left Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Feel free to get in touch with us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We are here to help you with any inquiries you may have throughout
            the process. Please fill out the form to contact our friendly team
            and discuss your needs.
          </p>

          {/* Contact Methods */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <img src={phoneIcon} alt="Phone" className="w-6 h-6" />
              <div>
                <p className="text-sm text-gray-500">Have any questions?</p>
                <p className="text-lg text-gray-800 font-medium">
                  +62 877-6948-9487
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <img src={mailIcon} alt="Email" className="w-6 h-6" />
              <div>
                <p className="text-sm text-gray-500">Write email</p>
                <a
                  href="mailto:needhelp@company.com"
                  className="text-lg text-purple-600 font-medium hover:underline"
                >
                  needhelp@company.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div
          className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden"
          style={{
            backgroundImage: `url('../assets/images/map1.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-white/90 absolute inset-0 rounded-lg"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Write anytime
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-purple-400"
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Your Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-purple-400"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-purple-400"
                  required
                />
                <input
                  type="text"
                  name="budget"
                  placeholder="Your Budget (Optional)"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-purple-400"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-purple-400"
              />
              <textarea
                name="message"
                placeholder="Write a message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-purple-400 h-32 resize-none"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-md hover:bg-purple-500 transition duration-300"
              >
                SEND A MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
