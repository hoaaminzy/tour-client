import React, { useState } from "react";

const TimeSlide = ({ active, total }) => {
  const [totalArr, setTotalArr] = useState(
    Array.from({ length: total }, (_, index) => index)
  );

  return (
    <div className="timeline">
      {totalArr.map((val) => (
        <div
          key={val}
          className={`timeline-item ${val === active ? "active" : ""}`}
          style={{ top: (val + 1) * (100 / (total + 1)) + "%" }}
        >
          {val === active && val + 1}
        </div>
      ))}
      <div className="index">
        {active + 1}/{total}
      </div>
    </div>
  );
};

export default TimeSlide;
