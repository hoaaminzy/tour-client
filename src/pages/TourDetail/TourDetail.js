import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { baseUrl } from "../../base/baseUrl";
import { Row, Col } from "react-bootstrap";
import { ImPriceTag } from "react-icons/im";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { FaTag } from "react-icons/fa6";
import { FaMap } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { Collapse } from "antd";
import "./TourDetail.css";
import CalendarList from "../../components/Calendar/CalendarList";
import { useDispatch, useSelector } from "react-redux";
import RatingForm from "../../components/RatingForm/RatingForm";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardProduct from "../../components/CardProduct/CardProduct";
import FavoriteTours from "../../components/FavoriteTours/FavoriteTours";
const TourDetail = ({ user }) => {
  const [loading, setLoading] = useState(true);

  const { Panel } = Collapse;
  const { slug } = useParams();
  const dispatch = useDispatch();
  const focusRef = useRef();
  const [allTours, setAllTours] = useState([]);
  const [allInforTours, setAllInforTours] = useState([]);
  const [allInforToursNote, setAllInforToursNote] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const itemData = useSelector((state) => state.item.selectedItem);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFocusClick = () => {
    focusRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const nights = days - 1; // Nights are usually one less than the number of days

    return `${days}N${nights}Đ`; // Return formatted string
  };

  const getAllTours = async () => {
    try {
      setLoading(true); // Set loading to true when data fetch starts
      const response = await axios.get(`${baseUrl}tour/get-all-tours`);
      const tours = response?.data?.tours;
      setAllTours(tours);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching tours:", error);
      setLoading(false); // Set loading to false even if there is an error
    }
  };
  const getAllInforTours = async () => {
    try {
      setLoading(true); // Set loading to true when data fetch starts
      const response = await axios.get(
        `${baseUrl}inforTour/get-all-infor-tours`
      );
      const inforTours = response?.data?.inforTours;
      setAllInforTours(inforTours);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching inforTours:", error);
      setLoading(false); // Set loading to false even if there is an error
    }
  };
  const getAllInforToursNote = async () => {
    try {
      setLoading(true); // Set loading to true when data fetch starts
      const response = await axios.get(
        `${baseUrl}inforTourNote/get-all-infor-tours-note`
      );
      const inforToursNote = response?.data?.inforToursNote;
      setAllInforToursNote(inforToursNote);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching inforToursNote:", error);
      setLoading(false); // Set loading to false even if there is an error
    }
  };
  useEffect(() => {
    getAllTours();
    getAllInforTours();
    getAllInforToursNote();
  }, []);

  const filterToursDetail = allTours?.find((item) => item?.slug === slug);
  const filterInforToursDetail = allInforTours?.find(
    (item) => item?.titleTour === filterToursDetail?.title
  );
  const filterInforToursNoteDetail = allInforToursNote?.find(
    (item) => item?.titleTour === filterToursDetail?.title
  );
  const formatText = (text) => {
    return text.replace(/-/g, "\n- "); // Thay thế "- " bằng "\n- " để mỗi dấu gạch bắt đầu trên một dòng mới
  };
  const items = [
    {
      key: "1",
      label: "Giá tour bao gồm",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.tourPriceIncluded || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "2",
      label: "Giá tour không bao gồm",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.tourPriceNotIncluded || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "3",
      label: "Lưu ý giá trẻ em",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.notePriceChildren || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "4",
      label: "Điều kiện thanh toán",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.paymentConditions || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "5",
      label: "Điều kiện đăng ký",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.registerConditions || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "6",
      label: "Lưu ý về chuyển hoặc hủy tour",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.noteTransferCancellation || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "7",
      label: "Điều kiện hủy tour đối với ngày thường",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.tourCancelWeekdays || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "8",
      label: "Điều kiện hủy tour đối với ngày lễ, tết",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.tourCancelHolidays || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "9",
      label: "Trường hợp lý do bất khả kháng",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.forceMajeureReasons || "No data"
            ),
          }}
        ></p>
      ),
    },
    {
      key: "10",
      label: "Liên hệ",
      children: (
        <p
          dangerouslySetInnerHTML={{
            __html: formatText(
              filterInforToursNoteDetail?.contact || "No data"
            ),
          }}
        ></p>
      ),
    },
  ];

  useEffect(() => {
    if (filterToursDetail?.image?.image1) {
      setSelectedImage(filterToursDetail.image.image1);
    }
  }, [filterToursDetail]);
  useEffect(() => {
    if (filterToursDetail?.images && filterToursDetail.images.length > 0) {
      setSelectedImage(filterToursDetail.images[0]); // Đặt hình ảnh đầu tiên làm mặc định
    }
  }, [filterToursDetail?.images]);
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const settingsCombo = {
    dots: false,
    className: "center",
    infinite: true,
    centerPadding: "5px",
    slidesToShow: 1,
    arrows: false,

    swipeToSlide: true,
  };
  const settings = {
    dots: false,
    className: "center",
    infinite: true,
    centerPadding: "20px",
    slidesToShow: isMobile ? 1.1 : 2.7,
    arrows: false,

    swipeToSlide: true,
  };

  return (
    <div
      className={`w-1240 w-375 flex flex-col ${
        isMobile ? "gap-2" : "gap-4"
      }  pb-14 tourdetail`}
    >
      {isMobile ? "" : <Breadcrumb />}

      <div className="w-full">
        <span
          className={`${
            isMobile ? "text-[20px] fw-bold" : "text-[27px] fw-bold"
          } `}
        >
          {filterToursDetail?.title}
        </span>
      </div>
      <div className="w-full">
        {isMobile ? (
          <div>
            <div className="w-[100%] flex flex-col gap-5">
              <Slider {...settingsCombo}>
                {filterToursDetail?.images?.map((image) => {
                  return (
                    <div className="w-full">
                      <img
                        src={image}
                        alt=""
                        className="w-[350px] h-[200px] object-cover rounded-lg"
                        onClick={() => handleImageClick(image)}
                      />
                    </div>
                  );
                })}
              </Slider>
              <div className="flex flex-col gap-3" ref={focusRef}>
                <div className="w-full flex justify-center">
                  <span
                    className={` ${
                      isMobile ? "text-[20px] text-[#276ca1]" : "text-[24px]"
                    } fw-bold  uppercase`}
                  >
                    Lịch khởi hành
                  </span>
                </div>
                <div className="">
                  <CalendarList data={filterToursDetail} />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-full flex justify-center">
                  <span
                    className={`fw-bold ${
                      isMobile ? "text-[22px] text-[#276ca1]" : "text-[24px]"
                    }`}
                  >
                    THÔNG TIN THÊM VỀ CHUYẾN ĐI
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center  justify-start gap-2">
                    <FaMap className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[18px] text-center">
                      Điểm tham quan
                    </strong>
                    <span className="text-[18px] clamped-text-3">
                      {filterInforToursDetail?.sightseeingSpot}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-start gap-1">
                    <IoFastFoodSharp className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[18px] text-center">
                      {" "}
                      Ẩm thực
                    </strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.cuisine}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-start gap-1">
                    <FaPeopleGroup className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[18px] text-center">
                      Đối tượng thích hợp
                    </strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.suitable}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-start gap-1">
                    <FaClock className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[18px] text-center">
                      Thời gian lý tưởng
                    </strong>
                    <span className="text-[18px]">Quanh năm</span>
                  </div>
                  <div className="flex items-center flex-col justify-start gap-1">
                    <FaCarSide className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[18px] text-center">
                      Phương tiện
                    </strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.vehicle}
                    </span>
                  </div>
                  <div className="flex items-center flex-col justify-start gap-1">
                    <FaTag className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[18px] text-center">Ưu đãi</strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.endow}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-full flex justify-center">
                  <span className="fw-bold text-[22px] text-[#276ca1]">
                    NHỮNG THÔNG TIN CẦN LƯU Ý
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item) => (
                    <Collapse key={item.key} accordion>
                      <Collapse.Panel header={item.label} key={item.key}>
                        {item.children}
                      </Collapse.Panel>
                    </Collapse>
                  ))}
                </div>
              </div>
              <div className="">
                <div className="w-full flex justify-center">
                  <span className="fw-bold text-[22px] text-[#276ca1]">
                    ĐÁNH GIÁ SẢN PHẨM
                  </span>
                </div>
                <RatingForm user={user} slugTour={slug} />
              </div>
              <div className="flex mb-32 flex-col gap-4">
                <div className="w-full flex justify-center" ref={focusRef}>
                  <span className="fw-bold text-[#276ca1] text-[24px] uppercase">
                    CHƯƠNG TRÌNH KHÁC
                  </span>
                </div>
                <div className="w-full  slick-tour-detail">
                  <Slider {...settings}>
                    {allTours.map((tour, index) => (
                      <div key={index} className="w-full pb-20 pt-10">
                        <div className=" h-[550px] w-[320px] flex flex-col justify-between  bg-white rounded-2xl overflow-hidden bsd">
                          <div className="h-[250px] relative">
                            <Link
                              className=""
                              to={`/chuong-trinh/${tour.slug}`}
                            >
                              <img
                                src={tour?.images[0]}
                                style={{
                                  width: "100%",
                                  height: "230px",
                                  objectFit: "cover",
                                }}
                                alt=""
                              />
                            </Link>
                            <div
                              style={{ top: "10px", left: "10px" }}
                              className="absolute flex justify-between flex-col items-center gap-3"
                            >
                              <FavoriteTours tourId={tour._id} user={user} />
                            </div>
                          </div>
                          <div className="p-3 flex  flex-col gap-2">
                            <strong className=" clamped-text-3">
                              {tour.title}
                            </strong>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <ImPriceTag /> Mã tour: {tour?._id}
                              </div>
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt /> Khởi hành: {tour?.city}
                              </div>
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt /> Ngày Khởi hành:{" "}
                                {tour?.inforTourDetail[0]?.time?.startDate}
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <FaClock /> Thời gian:
                                  {calculateDaysAndNights(
                                    tour?.inforTourDetail[0]?.time?.startDate,
                                    tour?.inforTourDetail[0]?.time?.endDate
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <MdChair /> Số chỗ còn nhận:{" "}
                                {tour?.inforTourDetail[0]?.slot}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <p className="fw-bold text-[20px]">
                                  Giá từ:{" "}
                                  <span className="text-red-500 ">
                                    {tour?.inforTourDetail[0]?.price?.price}đ
                                  </span>
                                </p>
                              </div>
                              <Link
                                className=""
                                to={`/chuong-trinh/${tour?.slug}`}
                              >
                                <button className="text-red-500 w-[100px] h-[35px] rounded-md outline outline-red-500">
                                  Đặt ngay
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
            <div
              className=" p-4 w-full rounded-3xl fixed left-0 right-0 bottom-0 bg-white  z-50"
              style={{ boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <strong className="text-[22px]">Giá</strong>
                  <span className="fw-bold text-red-500 text-[25px]">
                    {itemData
                      ? itemData?.price?.price
                      : filterToursDetail?.inforTourDetail[0].price.price}
                    đ <span className="text-black text-[18px]"> / khách</span>
                  </span>
                </div>
                {/* <div>
                 <span className="text-red-500 text-[30px] fw-bold">
                   {discountPrice(
                    itemData?.price?.price
                   )}P
                   đ
                 </span>
               </div> */}
                <div className="flex items-center gap-2 ">
                  <ImPriceTag /> Mã tour:{" "}
                  <span className="text-[#276ca1]">
                    {filterToursDetail?._id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt /> Khởi hành:
                  <span className="text-[#276ca1]">
                    {" "}
                    {filterToursDetail?.city}
                  </span>
                </div>
                {!itemData ? (
                  <button
                    onClick={handleFocusClick}
                    className=" w-full btn btn-primary"
                  >
                    Chọn ngày khởi hành
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    {" "}
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> Ngày Khởi hành:
                      <span className="text-[#276ca1]">
                        {" "}
                        {itemData?.time?.startDate}{" "}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock /> Thời gian:
                      <span className="text-[#276ca1]">
                        {calculateDaysAndNights(
                          itemData?.time?.startDate,
                          itemData?.time?.endDate
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdChair /> Số chỗ còn nhận:
                      <span className="text-[#276ca1]">{itemData?.slot}</span>
                    </div>
                    <Link
                      className="w-full"
                      to={`/order-booking/${filterToursDetail?._id}`}
                    >
                      <button className=" w-full btn btn-danger">
                        Đặt tour
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Row>
            <Col sm={8} className="flex flex-col gap-5">
              <Row className="h-[450px]">
                <Col sm={2}>
                  <div className="flex flex-col gap-3">
                    {filterToursDetail?.images?.map((image) => {
                      return (
                        <div>
                          <img
                            src={image}
                            alt=""
                            className="w-[180px] h-[100px] object-cover rounded-lg"
                            onClick={() => handleImageClick(image)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </Col>
                <Col sm={10} className="h-full">
                  <div className="h-full">
                    <img
                      src={selectedImage}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </Col>
              </Row>

              <Row className="flex flex-col gap-4">
                <div className="w-full flex justify-center" ref={focusRef}>
                  <span className="fw-bold text-[#276ca1] text-[24px] uppercase">
                    Lịch khởi hành
                  </span>
                </div>
                <div className="">
                  <CalendarList data={filterToursDetail} />
                </div>
              </Row>
              <Row className="flex flex-col gap-4">
                <div className="w-full flex justify-center">
                  <span className="fw-bold text-[#276ca1] text-[24px]">
                    THÔNG TIN THÊM VỀ CHUYẾN ĐI
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col justify-start gap-2">
                    <FaMap className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[20px]">Điểm tham quan</strong>
                    <span className="text-[20px] clamped-text-3">
                      {filterInforToursDetail?.sightseeingSpot}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start gap-1">
                    <IoFastFoodSharp className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[20px]"> Ẩm thực</strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.cuisine}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start gap-1">
                    <FaPeopleGroup className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[20px]">Đối tượng thích hợp</strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.suitable}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start gap-1">
                    <FaClock className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[20px]">Thời gian lý tưởng</strong>
                    <span className="text-[18px]">Quanh năm</span>
                  </div>
                  <div className="flex flex-col justify-start gap-1">
                    <FaCarSide className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[20px]">Phương tiện</strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.vehicle}
                    </span>
                  </div>
                  <div className="flex flex-col justify-start gap-1">
                    <FaTag className="text-[30px] text-[#276ca1]" />
                    <strong className="text-[20px]">Ưu đãi</strong>
                    <span className="text-[18px]">
                      {filterInforToursDetail?.endow}
                    </span>
                  </div>
                </div>
              </Row>
              <Row className="flex flex-col gap-4">
                <div className="w-full flex justify-center">
                  <span className="fw-bold text-[#276ca1] text-[24px]">
                    NHỮNG THÔNG TIN CẦN LƯU Ý
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {items.map((item) => (
                    <Collapse key={item.key} accordion>
                      <Collapse.Panel header={item.label} key={item.key}>
                        {item.children}
                      </Collapse.Panel>
                    </Collapse>
                  ))}
                </div>
              </Row>
              <Row>
                <div className="w-full flex justify-center">
                  <span className="fw-bold text-[#276ca1] text-[24px] uppercase">
                    ĐÁNH GIÁ VÀ BÌNH LUẬN
                  </span>
                </div>
                <RatingForm user={user} slugTour={slug} />
              </Row>
              <Row className="flex flex-col gap-4">
                <div className="w-full flex justify-center" ref={focusRef}>
                  <span className="fw-bold text-[#276ca1] text-[24px] uppercase">
                    CHƯƠNG TRÌNH KHÁC
                  </span>
                </div>
                <div className="w-full  slick-tour-detail">
                  <Slider {...settings}>
                    {allTours.map((tour, index) => (
                      <div key={index} className="w-full pb-20 pt-10">
                        <div className=" h-[550px] w-[320px] flex flex-col justify-between  bg-white rounded-2xl overflow-hidden bsd">
                          <div className="h-[250px] relative">
                            <Link
                              className=""
                              to={`/chuong-trinh/${tour.slug}`}
                            >
                              <img
                                src={tour?.images[0]}
                                style={{
                                  width: "100%",
                                  height: "230px",
                                  objectFit: "cover",
                                }}
                                alt=""
                              />
                            </Link>
                            <div
                              style={{ top: "10px", left: "10px" }}
                              className="absolute flex justify-between flex-col items-center gap-3"
                            >
                              <FavoriteTours tourId={tour._id} user={user} />
                            </div>
                          </div>
                          <div className="p-3 flex  flex-col gap-2">
                            <strong className=" clamped-text-3">
                              {tour.title}
                            </strong>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <ImPriceTag /> Mã tour: {tour?._id}
                              </div>
                              <div className="flex items-center gap-2">
                                <FaMapMarkerAlt /> Khởi hành: {tour?.city}
                              </div>
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt /> Ngày Khởi hành:{" "}
                                {tour?.inforTourDetail[0]?.time?.startDate}
                              </div>
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <FaClock /> Thời gian:
                                  {calculateDaysAndNights(
                                    tour?.inforTourDetail[0]?.time?.startDate,
                                    tour?.inforTourDetail[0]?.time?.endDate
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <MdChair /> Số chỗ còn nhận:{" "}
                                {tour?.inforTourDetail[0]?.slot}
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <p className="fw-bold text-[20px]">
                                  Giá từ:{" "}
                                  <span className="text-red-500 ">
                                    {tour?.inforTourDetail[0]?.price?.price}đ
                                  </span>
                                </p>
                              </div>
                              <Link
                                className=""
                                to={`/chuong-trinh/${tour?.slug}`}
                              >
                                <button className="text-red-500 w-[100px] h-[35px] rounded-md outline outline-red-500">
                                  Đặt ngay
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              </Row>
            </Col>
            <Col sm={4}>
              <div
                className="p-4 rounded-xl sticky-sidebar-tour-detail"
                style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <strong className="text-[22px]">Giá</strong>
                    <span className="fw-bold text-red-500 text-[25px]">
                      {itemData
                        ? itemData?.price?.price
                        : filterToursDetail?.inforTourDetail[0].price.price}
                      đ <span className="text-black text-[18px]"> / khách</span>
                    </span>
                  </div>
                  {/* <div>
                    <span className="text-red-500 text-[30px] fw-bold">
                      {discountPrice(
                       itemData?.price?.price
                      )}P
                      đ
                    </span>
                  </div> */}
                  <div className="flex items-center gap-2 ">
                    <ImPriceTag /> Mã tour:{" "}
                    <span className="text-[#276ca1]">
                      {filterToursDetail?._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt /> Khởi hành:
                    <span className="text-[#276ca1]">
                      {" "}
                      {filterToursDetail?.city}
                    </span>
                  </div>
                  {!itemData ? (
                    <button
                      onClick={handleFocusClick}
                      className=" w-full btn btn-primary"
                    >
                      Chọn ngày khởi hành
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {" "}
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt /> Ngày Khởi hành:
                        <span className="text-[#276ca1]">
                          {" "}
                          {itemData?.time?.startDate}{" "}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock /> Thời gian:
                        <span className="text-[#276ca1]">
                          {calculateDaysAndNights(
                            itemData?.time?.startDate,
                            itemData?.time?.endDate
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdChair /> Số chỗ còn nhận:
                        <span className="text-[#276ca1]">{itemData?.slot}</span>
                      </div>
                      <Link
                        className="w-full"
                        to={`/order-booking/${filterToursDetail?._id}`}
                      >
                        <button className=" w-full btn btn-danger">
                          Đặt tour
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default TourDetail;
