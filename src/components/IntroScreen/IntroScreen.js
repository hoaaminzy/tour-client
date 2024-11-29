// src/components/IntroScreen/IntroScreen.js
import React, { useEffect, useState } from "react";
import "./IntroScreen.css"; // Import CSS for animation
import { FaTelegramPlane } from "react-icons/fa";
const IntroScreen = () => {
  return (
    <div className="intro-screen">
      <FaTelegramPlane className="text-[50px] text-[#276ca1]"/>
    </div>
  );
};

export default IntroScreen;
