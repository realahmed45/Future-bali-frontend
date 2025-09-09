import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Gallery from "../components/Gallery";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Packages from "../components/Packages";
import Package1 from "../components/Package1";
import Package2 from "../components/Package2";
import Package3 from "../components/Package3";
import ContactUs from "../components/ContactUs";
import Package1Cart from "../components/Package1Cart";

import UserInfoForm from "../components/ReviewOrder1_2";
import InheritanceForm from "../components/ReviewOrder1_3";
import Login from "../components/Login";
import ReviewOrder from "../components/ReviewOrder";
import PlaceOrder from "../components/PlaceOrder";
import Payment from "../components/Payment";
import CaseStudy from "../components/CaseStudy";
import Settings from "../components/Settings";
import History from "../components/History";
import "../assets/styles/App.css";
import ContactForm2 from "../components/Emergencyform2";
import ProtectedRoute from "../components/ProtectedRoute";
import Adventure from "../components/Adventure";

const AppRoutes = () => {
  return (
    <Router>
      <div
        className="app-layout"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          // Prevent any overflow issues at the root level
          overflow: "hidden",
        }}
      >
        {/* Header - Fixed at top */}
        <Header />

        {/* Main content area - Let iframe handle its own scrolling */}
        <main
          className="app-content"
          style={{
            flex: 1,
            width: "100%",
            position: "relative",
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/case-study" element={<CaseStudy />} />
            <Route path="/adventure" element={<Adventure />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Package routes */}
              <Route path="/package1" element={<Package1 />} />
              <Route path="/package2" element={<Package2 />} />
              <Route path="/package3" element={<Package3 />} />

              {/* Cart and order routes */}
              <Route path="/package1-cart" element={<Package1Cart />} />
              <Route path="/package2-cart" element={<Package1Cart />} />
              <Route path="/package3-cart" element={<Package1Cart />} />
              <Route path="/review-order" element={<ReviewOrder />} />
              <Route path="/review_order1_2" element={<UserInfoForm />} />
              <Route path="/review_order1_3" element={<InheritanceForm />} />
              <Route path="/Emergency-details" element={<ContactForm2 />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/payment" element={<Payment />} />

              {/* Account routes */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<History />} />
            </Route>
          </Routes>
        </main>

        {/* Footer - Fixed at bottom */}
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;
