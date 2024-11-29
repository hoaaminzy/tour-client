import React, { useState, useEffect } from "react";

import { Button, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { ArrowRightOutlined } from "@ant-design/icons";
import { TRAVEL_PAGE_LOCATIONS } from "../../data";
import { useSpring, animated } from "@react-spring/web";
import Carousel from "../Carousel/Carousel";
import { Col, Row } from "react-bootstrap";
import "./StartPage.css";
import { useNavigate } from "react-router-dom";
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
const StartPage = () => {
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [locations, setLocations] = useState(TRAVEL_PAGE_LOCATIONS);

  const [props, api] = useSpring(
    () => ({
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 0 },
      delay: 200,
    }),
    []
  );

  const onActiveChange = (activeItem) => {
    setSelectedSlide(activeItem);
    api.start({
      from: { opacity: 0, y: 50 },
      to: { opacity: 1, y: 20 },
    });
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
  const navigate = useNavigate();

  return (
    <div
      className={`travel-container `}
      style={{ backgroundImage: `url(${locations[selectedSlide].background})` }}
    >
      <div className="layout py-5">
        <Row
          className={` w-1240 w-375 flex items-center justify-center h-full ${
            isMobile ? "" : ""
          } `}
        >
          <Col
            sm={7}
            className={`flex ${
              isMobile ? "flex-col" : "h-full gap-5 justify-center "
            }   `}
          >
            <div
              className={` h-full ${
                isMobile ? "d-none" : ""
              } flex items-center justify-center  `}
            >
              <TimeSlide total={locations.length} active={selectedSlide} />
            </div>
            <div
              className={` ${
                isMobile ? "gap-2 mt-5" : "py-20"
              } flex flex-col w-full `}
            >
              <div className="flex justify-center w-full flex-col items-start">
                <span
                  className={` ${
                    isMobile ? "text-[22px] text-center" : "text-[40px]"
                  } uppercase  text-white  fw-bold`}
                >
                  Một vài địa điểm nổi bật
                </span>
              </div>
              <div
                className={`flex  gap-3 text-white flex-col justify-center ${
                  isMobile ? "h-full " : "h-full"
                }`}
              >
                <div style={props}>
                  <h1
                    className={`${
                      isMobile ? "text-[22px]" : "text-[50px]"
                    }  fw-bold`}
                  >
                    {locations[selectedSlide].name}
                  </h1>
                </div>

                <div style={props}>
                  <h3
                    className={` text-justify ${
                      isMobile ? "text-[18px]" : "text-[20px] w-[600px]"
                    }`}
                  >
                    {locations[selectedSlide].description}
                  </h3>
                </div>

                <div className="mt-2">
                  <button
                    className="btn-primary btn"
                    onClick={() =>
                      navigate(`/kham-pha-${locations[selectedSlide].slug}`)
                    }
                    type="primary"
                  >
                    Khám phá
                    <ArrowRightOutlined className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </Col>
          <Col sm={5} className="">
            <Carousel
              data={locations.map((loc) => ({
                id: loc.id,
                link: loc.thumbnail,
                name: loc.name,
              }))}
              onActiveChange={onActiveChange}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StartPage;
