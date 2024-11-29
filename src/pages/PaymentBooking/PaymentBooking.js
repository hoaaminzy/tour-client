import React, { useEffect, useState } from "react";
import "./PaymentBooking.css";
import { Col, Row } from "react-bootstrap";
import { Collapse, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../base/baseUrl";
import formatDate from "../../utils/formatDate";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlane } from "react-icons/fa6";
import { useSelector } from "react-redux";
const PaymentBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const itemData = useSelector((state) => state.item.selectedItem);
  console.log(itemData);
  const getAllBookings = async () => {
    try {
      const response = await axios.get(`${baseUrl}booking/get-all-bookings`);
      const bookings = response?.data?.bookings;
      setAllBookings(bookings);
      console.log("Tours fetched successfully:", bookings);
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw error;
    }
  };
  const getAllTours = async () => {
    try {
      const response = await axios.get(`${baseUrl}tour/get-all-tours`);
      const tours = response?.data?.tours;
      setAllTours(tours);
      console.log("Tours fetched successfully:", tours);
    } catch (error) {
      console.error("Error fetching tours:", error);
      throw error;
    }
  };
  useEffect(() => {
    getAllBookings();
    getAllTours();
  }, []);

  const filterBookingDetail = allBookings?.find(
    (item) => item.bookingId === id
  );

  const filterBookingTourDetail = allTours?.find(
    (item) => item._id === filterBookingDetail?.tourId
  );
  console.log(filterBookingDetail);
  const backHome = () => {
    navigate("/thong-tin-ca-nhan");
    sessionStorage.removeItem("selectedItem");
  };

  const getTimePlusThreeHours = () => {
    const currentTime = new Date(); // Lấy thời gian hiện tại
    currentTime.setHours(currentTime.getHours() + 3); // Cộng thêm 3 giờ

    // Format lại thời gian theo giờ và phút
    const hours = String(currentTime.getHours()).padStart(2, "0"); // Đảm bảo giờ có 2 chữ số
    const minutes = String(currentTime.getMinutes()).padStart(2, "0"); // Đảm bảo phút có 2 chữ số

    return `${hours}:${minutes}`;
  };
  const [updatedTime, setUpdatedTime] = useState("");

  useEffect(() => {
    const timePlusThreeHours = getTimePlusThreeHours();
    console.log("Thời gian hiện tại cộng thêm 3 giờ: ", timePlusThreeHours); // In ra console
    setUpdatedTime(timePlusThreeHours); // Cập nhật state để hiển thị
  }, []);

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
      <div className={`w-1240 w-375  ${isMobile ? "pb-5 pt-3" : "py-5"}`}>
        <Row>
          <h3
            className={`mb-3 fw-bold text-center uppercase ${
              isMobile ? "text-[24px]" : "text-[30px]"
            }  text-[#276ca1]`}
          >
            ĐẶT TOUR
          </h3>
          <Col sm={7}>
            <div className="info-section bg-[#fff] flex flex-col gap-3 outline p-4 rounded-xl">
              <h2 className="text-[#276ca1] fw-bold">THÔNG TIN LIÊN LẠC</h2>
              <hr />
              <div className="">
                <div className="info-row">
                  <span className="label">Họ tên:</span>
                  <span>{filterBookingDetail?.fullName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Địa chỉ:</span>
                  <span>{filterBookingDetail?.address}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span>{filterBookingDetail?.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Điện thoại:</span>
                  <span>{filterBookingDetail?.phone}</span>
                </div>
                <div className="info-row">
                  <span className="label">Ghi chú:</span>
                  <span>{filterBookingDetail?.messageContent}</span>
                </div>
              </div>
            </div>
            <div className="info-section bg-[#fff]  flex flex-col gap-3 outline rounded-xl p-4">
              <h2 className="text-[#276ca1] fw-bold">CHI TIẾT BOOKING</h2>
              <hr />
              <div>
                <div className="info-row">
                  <span className="label">Số booking:</span>
                  <span className="text-red-500 fw-bold">
                    {filterBookingDetail?.bookingId}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Ngày tạo:</span>
                  <span>{formatDate(filterBookingDetail?.createdAt)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Trị giá booking:</span>
                  <span>{filterBookingDetail?.totalPrice}</span>
                </div>
                <div className="info-row">
                  <span className="label">Hình thức thanh toán:</span>
                  <span>{filterBookingDetail?.selectedPayment}</span>
                </div>
                <div className="info-row">
                  <span className="label">Số tiền đã thanh toán:</span>
                  <span>0</span>
                </div>
                <div className="info-row">
                  <span className="label">Số tiền còn lại:</span>
                  <span>{filterBookingDetail?.totalPrice}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tình trạng:</span>
                  <span>{filterBookingDetail?.status}</span>
                </div>
                <div className="info-row">
                  <span className="label">Thời hạn thanh toán:</span>
                  <span className="text-red-500 fw-bold">
                    {formatDate(filterBookingDetail?.createdAt)} {updatedTime}
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col sm={5}>
            <div className=" sticky-sidebar-order flex flex-col gap-3 ">
              <div className="bg-gray-100 p-3 rounded-xl">
                <h3 className=" mb-3  text-[#276ca1] fw-bold text-[20px] uppercase">
                  Phiếu xác nhận booking
                </h3>
                <div className="flex flex-col gap-4">
                  <div className={`${isMobile ? "flex-col" : " "} flex gap-3`}>
                    <img
                      src={filterBookingTourDetail?.images[0]}
                      alt=""
                      className={` ${
                        isMobile ? "w-full h-[180px]" : "w-[250px] h-[150px]"
                      }  rounded-lg object-cover `}
                    />
                    <div>
                      <strong className="clamped-text-bookingtour">
                        {filterBookingTourDetail?.title}
                      </strong>
                      <p>Mã tour: {filterBookingTourDetail?._id}</p>
                    </div>
                  </div>
                  <p>
                    Số Booking:{" "}
                    <span className="fw-bold text-red-500">
                      {filterBookingDetail?.bookingId}
                    </span>{" "}
                  </p>
                  <hr />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <FaPlane />
                      <strong className="uppercase">
                        Thông tin chuyến bay
                      </strong>
                    </div>
                    <div>
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <div>
                            <span>
                              <strong>Ngày đi</strong> -{" "}
                              {filterBookingDetail?.tourDetail[0]?.time?.startDate}
                            </span>
                          </div>
                          <div>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between">
                                <span>{filterBookingDetail?.tourDetail[0]?.fightTime?.startTime}</span>
                                <span>{filterBookingDetail?.tourDetail[0]?.fightTime?.endTime}</span>
                              </div>
                              <div className="w-full h-[2px] bg-gray-300"></div>
                              <div className="flex justify-between">
                                <span>{filterBookingTourDetail?.city}</span>
                                <span>{filterBookingTourDetail?.endCity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <span>
                              <strong>Ngày về</strong> -{" "}
                              {filterBookingDetail?.tourDetail[0]?.time?.endDate}
                            </span>
                          </div>
                          <div className="">
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between">
                                <span>
                                  {filterBookingDetail?.tourDetail[0]?.fightBackTime?.startBackTime}
                                </span>
                                <span>
                                  {filterBookingDetail?.tourDetail[0]?.fightBackTime?.endBackTime}
                                </span>
                              </div>
                              <div className="w-full h-[2px] bg-gray-300"></div>
                              <div className="flex justify-between flex-row-reverse">
                                <span>{filterBookingTourDetail?.city}</span>
                                <span>{filterBookingTourDetail?.endCity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-red-500 fw-bold">
                  {" "}
                  * Tour của bạn đã được đặt thành công, vui lòng chờ hệ thống
                  xác nhận.
                </p>
                <p className="fw-bold">
                  * Theo dõi đơn đặt tour{" "}
                  <span
                    className="text-blue-700 cursor-pointer fw-bold"
                    onClick={backHome}
                  >
                    tại đây
                  </span>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PaymentBooking;
