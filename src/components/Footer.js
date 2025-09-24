import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import logo from "../assets/images/logo1.png";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
      setIsTablet(window.innerWidth <= 768 && window.innerWidth > 480);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStyles = () => ({
    footer: {
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      padding: isMobile
        ? "25px 10px 15px"
        : isTablet
        ? "30px 15px 15px"
        : "40px 20px 20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    container: {
      display: "flex",
      justifyContent: isMobile || isTablet ? "center" : "space-between",
      alignItems: isMobile || isTablet ? "center" : "flex-start",
      maxWidth: "1200px",
      margin: "0 auto",
      paddingBottom: isMobile ? "15px" : isTablet ? "20px" : "30px",
      borderBottom: "1px solid #333",
      flexDirection: isMobile || isTablet ? "column" : "row",
      gap: isMobile ? "20px" : isTablet ? "25px" : "30px",
      textAlign: isMobile || isTablet ? "center" : "left",
    },
    leftSection: {
      flex: 1,
      maxWidth: isMobile || isTablet ? "100%" : "300px",
      width: isMobile || isTablet ? "100%" : "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: isMobile || isTablet ? "center" : "flex-start",
    },
    rightSection: {
      flex: 1,
      display: "flex",
      justifyContent: isMobile || isTablet ? "center" : "flex-end",
      gap: isMobile ? "30px" : isTablet ? "40px" : "60px",
      marginTop: isMobile || isTablet ? "0" : "10px",
      width: isMobile || isTablet ? "100%" : "auto",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "center" : "flex-start",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "8px" : "12px",
      alignItems: isMobile ? "center" : "flex-start",
    },
    columnHeader: {
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "600",
      margin: isMobile ? "0 0 6px 0" : "0 0 8px 0",
      color: "#ffffff",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    logo: {
      width: isMobile ? "80px" : isTablet ? "100px" : "120px",
      height: "auto",
      marginBottom: isMobile ? "12px" : isTablet ? "15px" : "20px",
    },
    contactInfo: {
      marginBottom: isMobile ? "12px" : isTablet ? "15px" : "20px",
    },
    callText: {
      fontSize: isMobile ? "12px" : "14px",
      fontWeight: "600",
      margin: isMobile ? "0 0 6px 0" : "0 0 8px 0",
      color: "#cccccc",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    phoneNumber: {
      fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
      fontWeight: "700",
      margin: "0",
      color: "#ffffff",
      letterSpacing: isMobile ? "0.5px" : "1px",
    },
    socialIcons: {
      display: "flex",
      gap: isMobile ? "10px" : isTablet ? "12px" : "15px",
      justifyContent: isMobile || isTablet ? "center" : "flex-start",
    },
    iconLink: {
      color: "#cccccc",
      fontSize: isMobile ? "16px" : "20px",
      padding: isMobile ? "8px" : "10px",
      borderRadius: "50%",
      backgroundColor: "#333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: isMobile ? "35px" : "40px",
      height: isMobile ? "35px" : "40px",
      transition: "all 0.3s ease",
      textDecoration: "none",
      cursor: "pointer",
    },
    link: {
      color: "#cccccc",
      textDecoration: "none",
      fontSize: isMobile ? "13px" : "14px",
      transition: "color 0.3s ease",
      padding: isMobile ? "3px 0" : "2px 0",
      cursor: "pointer",
    },
    copyrightSection: {
      maxWidth: "1200px",
      margin: "0 auto",
      paddingTop: isMobile ? "12px" : isTablet ? "15px" : "20px",
      textAlign: isMobile || isTablet ? "center" : "left",
    },
    copyright: {
      textAlign: isMobile || isTablet ? "center" : "left",
      fontSize: isMobile ? "11px" : isTablet ? "12px" : "13px",
      color: "#888888",
      margin: "0",
      fontWeight: "400",
      lineHeight: isMobile ? "1.4" : "1.2",
    },
  });

  const styles = getStyles();

  const handleLinkHover = (e, isHover) => {
    if (isHover) {
      e.target.style.color = "#ffffff";
    } else {
      e.target.style.color = "#cccccc";
    }
  };

  const handleIconHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = "#555";
      e.target.style.color = "#ffffff";
      e.target.style.transform = "translateY(-2px)";
    } else {
      e.target.style.backgroundColor = "#333";
      e.target.style.color = "#cccccc";
      e.target.style.transform = "translateY(0)";
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Left Section (Logo + Contact Info + Social Icons) */}
        <div style={styles.leftSection}>
          <img src={logo} alt="Future Life Logo" style={styles.logo} />
          <div style={styles.contactInfo}>
            <p style={styles.callText}>CALL US TODAY</p>
            <p style={styles.phoneNumber}>+62 877-4487-7888</p>
          </div>
          <div style={styles.socialIcons}>
            <a
              href="https://facebook.com"
              style={styles.iconLink}
              aria-label="Facebook"
              onMouseEnter={(e) => handleIconHover(e, true)}
              onMouseLeave={(e) => handleIconHover(e, false)}
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com"
              style={styles.iconLink}
              aria-label="Instagram"
              onMouseEnter={(e) => handleIconHover(e, true)}
              onMouseLeave={(e) => handleIconHover(e, false)}
            >
              <FaInstagram />
            </a>
            <a
              href="https://youtube.com"
              style={styles.iconLink}
              aria-label="YouTube"
              onMouseEnter={(e) => handleIconHover(e, true)}
              onMouseLeave={(e) => handleIconHover(e, false)}
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Right Section (Navigation Links) */}
        <div style={styles.rightSection}>
          <div style={styles.column}>
            <h4 style={styles.columnHeader}>Navigation</h4>
            <a
              href="/"
              style={styles.link}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Home
            </a>
            <a
              href="/gallery"
              style={styles.link}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Gallery
            </a>
            <a
              href="/packages"
              style={styles.link}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Packages
            </a>
          </div>
          <div style={styles.column}>
            <h4 style={styles.columnHeader}>Support</h4>
            <a
              href="/terms"
              style={styles.link}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Terms & Conditions
            </a>
            <a
              href="/ContactUs"
              style={styles.link}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
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

export default Footer;
