import React, { useEffect, useState } from "react";
import "./Heading.css";
const Heading = ({ left, title, description }) => {
  const afterStyle = {
    content: '""',
    width: "170px",
    height: "7px",
    backgroundColor: "#276ca1",
    position: "absolute",
    bottom: "-20px",
    borderRadius: "10px",
    left: left,
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener to track resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <span
        className={` ${
          isMobile ? "text-[24px]" : "text-[32px]"
        } uppercase fw-bold relative heading text-[#276ca1]`}
      >
        {title}
        <span style={afterStyle}></span>
      </span>
      <p className="mt-5 text-[18px]">{description}</p>
    </div>
  );
};

export default Heading;
