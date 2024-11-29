import React, { useState, useEffect } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

const WorldClock = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [time, setTime] = useState({
    newYork: new Date(),
    london: new Date(),
    tokyo: new Date(),
    hoChiMinh: new Date(),
  });

  const updateClocks = () => {
    const now = new Date();
    setTime({
      newYork: new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      ),
      london: new Date(
        now.toLocaleString("en-US", { timeZone: "Europe/London" })
      ),
      tokyo: new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })),
      hoChiMinh: new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      ),
    });
  };

  useEffect(() => {
    updateClocks(); // Cập nhật thời gian ban đầu
    const intervalId = setInterval(updateClocks, 1000); // Cập nhật mỗi giây

    return () => clearInterval(intervalId); // Xóa interval khi component bị unmount
  }, []);

  return (
    <div
      className={`w-1240 w-375 ${
        isMobile ? "grid grid-cols-2 gap-3" : "flex justify-around items-center"
      }`}
    >
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="fw-bold text-[18px]">New York</h2>
        <Clock value={time.newYork} />
        <p className="fw-bold text-[18px]">
          {" "}
          {time.newYork.toLocaleTimeString()}
        </p>{" "}
        {/* Hiển thị hh:mm:ss */}
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="fw-bold text-[18px]">London</h2>
        <Clock value={time.london} />
        <p className="fw-bold text-[18px]">
          {" "}
          {time.london.toLocaleTimeString()}
        </p>{" "}
        {/* Hiển thị hh:mm:ss */}
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="fw-bold text-[18px]">Tokyo</h2>
        <Clock value={time.tokyo} />
        <p className="fw-bold text-[18px]">
          {" "}
          {time.tokyo.toLocaleTimeString()}
        </p>{" "}
        {/* Hiển thị hh:mm:ss */}
      </div>
      <div className="flex flex-col justify-center items-center gap-3">
        <h2 className="fw-bold text-[18px]">Ha Noi City</h2>
        <Clock value={time.hoChiMinh} />
        <p className="fw-bold text-[18px]">
          {" "}
          {time.hoChiMinh.toLocaleTimeString()}
        </p>{" "}
        {/* Hiển thị hh:mm:ss */}
      </div>
    </div>
  );
};

export default WorldClock;
