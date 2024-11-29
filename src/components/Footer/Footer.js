import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import logo from "../../images/logo.png";
import visa from "../../images/visa.webp";
import momo from "../../images/momo.webp";
import mastercart from "../../images/mastercard.webp";
import vnpay from "../../images/vnpay.webp";

const Footer = () => {
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
    <div className={`bg-[#daefff] ${isMobile ? "" : "py-10"}  pb-10`}>
      <div className="w-1240 w-375">
        <Row
          className={`${isMobile ? "flex justify-center items-center" : ""}`}
        >
          <img
            src={logo}
            alt=""
            className={` ${
              isMobile ? "w-[250px] " : "w-[300px]"
            } h-auto object-cover`}
          />
        </Row>
        <Row className={`${isMobile ? "flex flex-col gap-3" : ""}`}>
          <Col sm={3}>
            <strong className="mb-2 block">Du lịch trong nước</strong>
            <div className="flex flex-col gap-2">
              <span>Đà Nẵng</span>
              <span>Hà Nội</span>
              <span>TP. Hồ Chí Minh</span>
              <span>Huế</span>
              <span>Nha Trang</span>
              <span>Xem thêm ...</span>
            </div>
          </Col>
          <Col sm={3}>
            <strong className="mb-2 block">Dòng tour</strong>
            <div className="flex flex-col gap-2">
              <span>Cao cấp</span>
              <span>Tiết kiệm</span>
              <span>Tiêu chuẩn</span>
              <span>Giá tốt</span>
            </div>
          </Col>
          <Col sm={3}>
            <strong className="mb-2 block">Liên hệ</strong>
            <div className="flex flex-col gap-2">
              <span>190 Pasteur, Phường Võ Thị Sáu, Quận 3, TP.HCM</span>
              <span>(+84 28) 3822 8898</span>
              <span>(+84 28) 3829 9142</span>
              <span>info@vietravel.com</span>
            </div>
          </Col>
          <Col sm={3}>
            <strong className="mb-2 block">Chấp nhận thanh toán</strong>
            <div className="flex flex-wrap gap-3">
              <img
                src={momo}
                alt=" "
                className="w-[100px] h-auto object-cover"
              />
              <img
                src={vnpay}
                alt=" "
                className="w-[100px] h-auto object-cover"
              />
              <img
                src={mastercart}
                alt=" "
                className="w-[100px] h-auto object-cover"
              />
              <img
                src={visa}
                alt=" "
                className="w-[100px] h-auto object-cover"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
