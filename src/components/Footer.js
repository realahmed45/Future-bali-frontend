import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import logo from "../assets/images/logo1.png"; // Importing the logo

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Left Section (CALL US TODAY + Logo + Icons) */}
        <div style={styles.leftSection}>
          <img src={logo} alt="Logo" style={styles.logo} /> {/* Logo */}
          <p style={styles.callText}>CALL US TODAY</p>
          <p style={styles.phoneNumber}>+ 0348 2221595</p>
          <div style={styles.icons}>
            <a href="https://facebook.com" style={styles.iconLink}>
              <FaFacebookF />
            </a>
            <a href="https://linkedin.com" style={styles.iconLink}>
              <FaLinkedinIn />
            </a>
            <a href="https://instagram.com" style={styles.iconLink}>
              <FaInstagram />
            </a>
            <a href="https://youtube.com" style={styles.iconLink}>
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right Section (Navigation Links in Columns) */}
        <div style={styles.rightSection}>
          <div style={styles.column}>
            <a href="/" style={styles.link}>
              Home
            </a>
            <a href="/gallery" style={styles.link}>
              Gallery
            </a>
          </div>
          <div style={styles.column}>
            <a href="/terms" style={styles.link}>
              Terms & Conditions
            </a>
            <a href="/ContactUs" style={styles.link}>
              Contact Us
            </a>
          </div>
          <div style={styles.column}>
            <a href="/packages" style={styles.link}>
              Packages
            </a>
          </div>
        </div>
      </div>
      <p style={styles.copyright}>
        Future Life © All rights reserved Copyrights 2024
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#333", // Dark grey background
    color: "white",
    padding: "20px 10px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  leftSection: {
    flex: 1,
    textAlign: "left",
  },
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    marginTop: "3%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "8x",
  },
  logo: {
    width: "100px", // Adjust size as needed
    marginBottom: "10px",
  },
  callText: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 5px",
  },
  phoneNumber: {
    fontSize: "18px",
    margin: "0 0 10px",
  },
  icons: {
    display: "flex",
    gap: "10px",
  },
  iconLink: {
    color: "white",
    fontSize: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
  },
  copyright: {
    textAlign: "center",
    fontSize: "12px",
    marginTop: "20px",
  },
};

export default Footer;
