import React, { useEffect, useState } from "react";
import { FaHotel } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlane } from "react-icons/fa";
import h1 from "../../images/icons/h1.webp";
import axios from "axios";
import "./CardCombo.css";
import { baseUrl } from "../../base/baseUrl";
import { Link } from "react-router-dom";
import { FaArrowAltCircleRight } from "react-icons/fa";

const CardCombo = ({ data }) => {
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
    <>
      <div
        className={`grid ${isMobile ? "grid-cols-1" : " grid-cols-3"}  gap-3`}
      >
        {data?.map((item) => {
          return (
            <div className="w-full container-card-combo relative flex justify-center card-combo overflow-hidden rounded-xl bg-[#276ca1] h-[450px]">
              <div className="h-[350px] w-full overflow-hidden">
                <img
                  className="img-hover w-full h-[350px] object-cover"
                  src={item.images[0]}
                  alt=""
                />
              </div>
              <div
                className={`bg-white opacity-80 flex flex-col gap-2 bottom-4 p-3 rounded-xl  ${
                  isMobile ? "w-[92%]" : "w-[290px]  hover-detail"
                }  h-max absolute`}
              >
                <div className="flex flex-col gap-2">
                  <span className="clamped-text-combo-tour">{item?.title}</span>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span className="text-[12px]">Khởi hành:</span>
                    <span className="text-[#276ca1] text-[12px] fw-bold">
                      {item?.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaHotel />
                    <span className="text-[12px]">Khách sạn:</span>
                    <span className="fw-bold text-[12px]">{item?.hotel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPlane />
                    <span className="text-[12px]">Phương tiện:</span>
                    <span className="fw-bold text-[12px]">{item?.vehicle}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 text-[20px]">
                    {item?.price?.price}
                  </span>
                  <Link to={`/chuong-trinh/${item?.slug}`}>
                    <button className="outline outline-[#276ca1] text-[#276ca1] text-[12px] fw-bold px-3 py-1 rounded-md">
                      Xem chi tiết
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CardCombo;
