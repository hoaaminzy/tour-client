import React, { useState, useEffect } from "react";
import {
  StarFilled,
  HeartFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button } from "antd";

// Rating Component
const Rating = ({ rate }) => {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div>
      {stars.map((val) => (
        <StarFilled
          key={val}
          style={{ color: val <= rate ? "#F9E400" : "white" }}
        />
      ))}
    </div>
  );
};

// Carousel Component
const Carousel = ({ data, onActiveChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const next = () => {
    const newIndex = (activeIndex + 1) % data.length;
    setActiveIndex(newIndex);
    onActiveChange(newIndex);
  };

  const previous = () => {
    const newIndex = (activeIndex - 1 + data.length) % data.length;
    setActiveIndex(newIndex);
    onActiveChange(newIndex);
  };

  return (
    <div className={` w-full  gap-5 ${isMobile ? "" : "flex  flex-col"} `}>
      <div className="w-full h-full flex justify-center">
        <div
          className={` flex flex-col gap-2 w-full transition-transform duration-300 ${
            isMobile ? "" : "scale-110"
          }  `}
        >
          {isMobile ? (
            <div className="flex justify-between items-center">
              <div
                className={` ${
                  isMobile ? "relative" : ""
                } info w-full flex flex-col  `}
              >
                <h3 className={`text-[20px]  text-white font-bold`}>
                  {data[activeIndex].name}
                </h3>
                <Rating rate={5} />
              </div>
              <div className="flex gap-2">
                <Button
                  className="ctl-btn"
                  shape="circle"
                  icon={<LeftOutlined />}
                  onClick={previous}
                />
                <Button
                  className="ctl-btn"
                  shape="circle"
                  icon={<RightOutlined />}
                  onClick={next}
                />
              </div>
            </div>
          ) : (
            <div
              className={` ${
                isMobile ? "relative" : ""
              } info w-full flex flex-col  `}
            >
              <h3 className={`text-[20px]  text-white font-bold`}>
                {data[activeIndex].name}
              </h3>
              <Rating rate={5} />
            </div>
          )}

          <div className={` image w-full ${isMobile ? "" : "h-[600px]"}   `}>
            <img
              src={data[activeIndex].link}
              alt=""
              className={` w-full object-cover rounded-xl ${
                isMobile ? "h-[400px]" : "h-[600px]"
              } `}
            />
            <div className=" absolute flex  gap-3 top-3 right-3">
              <Button
                className="ctl-btn"
                shape="circle"
                icon={<LeftOutlined />}
                onClick={previous}
              />
              <Button
                className="ctl-btn"
                shape="circle"
                icon={<RightOutlined />}
                onClick={next}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
