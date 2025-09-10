import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import logo from "../assets/images/logo1.png";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Left Section (Logo + Contact Info + Social Icons) */}
        <div style={styles.leftSection}>
          <img src={logo} alt="Future Life Logo" style={styles.logo} />
          <div style={styles.contactInfo}>
            <p style={styles.callText}>CALL US TODAY</p>
            <p style={styles.phoneNumber}>+62 818-1818-5522</p>
          </div>
          <div style={styles.socialIcons}>
            <a
              href="https://facebook.com"
              style={styles.iconLink}
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://linkedin.com"
              style={styles.iconLink}
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://instagram.com"
              style={styles.iconLink}
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com"
              style={styles.iconLink}
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right Section (Navigation Links) */}
        <div style={styles.rightSection}>
          <div style={styles.column}>
            <h4 style={styles.columnHeader}>Navigation</h4>
            <a href="/" style={styles.link}>
              Home
            </a>
            <a href="/gallery" style={styles.link}>
              Gallery
            </a>
            <a href="/packages" style={styles.link}>
              Packages
            </a>
          </div>
          <div style={styles.column}>
            <h4 style={styles.columnHeader}>Support</h4>
            <a href="/terms" style={styles.link}>
              Terms & Conditions
            </a>
            <a href="/ContactUs" style={styles.link}>
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div style={styles.copyrightSection}>
        <p style={styles.copyright}>
          Future Life © All rights reserved Copyrights 2025
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "40px 20px 20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxWidth: "1200px",
    margin: "0 auto",
    paddingBottom: "30px",
    borderBottom: "1px solid #333",
  },
  leftSection: {
    flex: 1,
    maxWidth: "300px",
  },
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    gap: "60px",
    marginTop: "10px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  columnHeader: {
    fontSize: "16px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  logo: {
    width: "120px",
    height: "auto",
    marginBottom: "20px",
  },
  contactInfo: {
    marginBottom: "20px",
  },
  callText: {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#cccccc",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  phoneNumber: {
    fontSize: "20px",
    fontWeight: "700",
    margin: "0",
    color: "#ffffff",
    letterSpacing: "1px",
  },
  socialIcons: {
    display: "flex",
    gap: "15px",
  },
  iconLink: {
    color: "#cccccc",
    fontSize: "20px",
    padding: "10px",
    borderRadius: "50%",
    backgroundColor: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    transition: "all 0.3s ease",
    textDecoration: "none",
  },
  link: {
    color: "#cccccc",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.3s ease",
    padding: "2px 0",
  },
  copyrightSection: {
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "20px",
  },
  copyright: {
    textAlign: "left",
    fontSize: "13px",
    color: "#888888",
    margin: "0",
    fontWeight: "400",
  },
};

export default Footer;
