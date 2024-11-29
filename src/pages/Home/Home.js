import React, { useEffect, useRef, useState } from "react";
import { message, Tabs } from "antd";
import { FaCarSide } from "react-icons/fa";
import { FaHotel } from "react-icons/fa";
import { DatePicker } from "antd";
import { FaSearch } from "react-icons/fa";
import caocap from "../../images/icons/caocap.webp";
import giatot from "../../images/icons/giatot.webp";
import tietkiem from "../../images/icons/tietkiem.webp";
import tieuchuan from "../../images/icons/tieuchuan.webp";
import h1 from "../../images/icons/h1.webp";
import h2 from "../../images/icons/h2.webp";
import h3 from "../../images/icons/h3.webp";
import h4 from "../../images/icons/h4.webp";
import { Spinner } from "react-bootstrap";
// import Clock from 'react-live-clock';
import moment from "moment";
import { FaArrowAltCircleRight } from "react-icons/fa";

import { FaLongArrowAltRight } from "react-icons/fa";
import { ImPriceTag } from "react-icons/im";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlane } from "react-icons/fa";

import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Dropdown, Space, Form, Select } from "antd";
import "./Home.css";
import Heading from "../../components/Heading/Heading";
import CardProduct from "../../components/CardProduct/CardProduct";
import { baseUrl, baseUrlImage } from "../../base/baseUrl";
import { Link, useNavigate } from "react-router-dom";
import StartPage from "../../components/StartPage/StartPage";
import WorldClock from "../../components/WorldClock /WorldClock";
import formatDate from "../../utils/formatDate";
import { useSelector } from "react-redux";
const { RangePicker } = DatePicker;

const Home = (user) => {
  const [loading, setLoading] = useState(true);
  const { Option } = Select;
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [destination, setDestination] = useState("");
  const [dates2, setDates2] = useState(null);
  const [budget, setBudget] = useState(null);
  const [city, setCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [allTours, setAllTours] = useState([]);

  const [blogs, setBlogs] = useState([]);

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

  const regions = {
    "Miền Bắc": [
      "Thành phố Hà Nội",
      "Tỉnh Hà Giang",
      "Tỉnh Cao Bằng",
      "Tỉnh Bắc Kạn",
      "Tỉnh Tuyên Quang",
      "Tỉnh Lào Cai",
      "Tỉnh Điện Biên",
      "Tỉnh Lai Châu",
      "Tỉnh Sơn La",
      "Tỉnh Yên Bái",
      "Tỉnh Hoà Bình",
      "Tỉnh Thái Nguyên",
      "Tỉnh Lạng Sơn",
      "Tỉnh Quảng Ninh",
      "Tỉnh Bắc Giang",
      "Tỉnh Phú Thọ",
      "Tỉnh Vĩnh Phúc",
      "Tỉnh Bắc Ninh",
      "Tỉnh Hải Dương",
      "Thành phố Hải Phòng",
      "Tỉnh Hưng Yên",
      "Tỉnh Thái Bình",
      "Tỉnh Hà Nam",
      "Tỉnh Nam Định",
      "Tỉnh Ninh Bình",
      "Tỉnh Thanh Hóa",
    ],
    "Miền Trung": [
      "Tỉnh Nghệ An",
      "Tỉnh Hà Tĩnh",
      "Tỉnh Quảng Bình",
      "Tỉnh Quảng Trị",
      "Tỉnh Thừa Thiên Huế",
      "Thành phố Đà Nẵng",
      "Tỉnh Quảng Nam",
      "Tỉnh Quảng Ngãi",
      "Tỉnh Bình Định",
      "Tỉnh Phú Yên",
      "Tỉnh Khánh Hòa",
      "Tỉnh Ninh Thuận",
      "Tỉnh Bình Thuận",
      "Tỉnh Kon Tum",
      "Tỉnh Gia Lai",
      "Tỉnh Đắk Lắk",
      "Tỉnh Đắk Nông",
      "Tỉnh Lâm Đồng",
    ],
    "Miền Nam": [
      "Tỉnh Bình Phước",
      "Tỉnh Tây Ninh",
      "Tỉnh Bình Dương",
      "Tỉnh Đồng Nai",
      "Tỉnh Bà Rịa - Vũng Tàu",
      "Thành phố Hồ Chí Minh",
      "Tỉnh Long An",
      "Tỉnh Tiền Giang",
      "Tỉnh Bến Tre",
      "Tỉnh Trà Vinh",
      "Tỉnh Vĩnh Long",
      "Tỉnh Đồng Tháp",
      "Tỉnh An Giang",
      "Tỉnh Kiên Giang",
      "Thành phố Cần Thơ",
      "Tỉnh Hậu Giang",
      "Tỉnh Sóc Trăng",
      "Tỉnh Bạc Liêu",
      "Tỉnh Cà Mau",
    ],
  };
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=2")
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces data:", error);
      });
  }, []);
  useEffect(() => {
    const getAllBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}blogs/get-all-blogs`);
        const blogs = res?.data;
        setBlogs(blogs);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getAllBlog();
  }, []);
  useEffect(() => {
    const getAllTours = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}tour/get-all-tours`);
        const tours = response?.data?.tours;
        setAllTours(tours);
        setLoading(false);
        console.log("Tours fetched successfully:", tours);
        return tours;
      } catch (error) {
        setLoading(false);
        console.error("Error fetching tours:", error);
        throw error;
      }
    };
    getAllTours();
  }, []);

  const increment = (setter, value) => setter(value + 1);
  const decrement = (setter, value) => {
    if (value > 1) setter(value - 1);
  };

  const handleDropdownClick = (e) => {
    e.preventDefault();
    setDropdownOpen(true);
  };

  const handleOpenChange = (open) => {
    setDropdownOpen(open); // Handle open/close behavior manually
  };
  const preventDropdownClose = (e) => {
    e.stopPropagation(); // Stops the dropdown from closing
  };
  const typeTour = [
    {
      image: caocap,
      typeTour: "TOUR CAO CẤP",
      slugTypeTour: "du-lich-cao-cap",
    },
    {
      image: tieuchuan,
      typeTour: "TOUR TIÊU CHUẨN",
      slugTypeTour: "du-lich-tieu-chuan",
    },
    {
      image: tietkiem,
      typeTour: "TOUR TIẾT KIỆM",
      slugTypeTour: "du-lich-tiet-kiem",
    },
    {
      image: giatot,
      typeTour: "TOUR GÍA TỐT",
      slugTypeTour: "du-lich-gia-tot",
    },
  ];

  const optionsBook = [
    {
      key: "0",
      label: (
        <div className="flex justify-between items-center gap-5">
          <strong className="text-[16px]">Phòng</strong>
          <div
            onClick={preventDropdownClose}
            className="flex items-center gap-4 outline-black outline p-2 rounded-lg"
          >
            <button
              className="btn btn-outline-primary"
              onClick={() => decrement(setRooms, rooms)}
            >
              -
            </button>
            <span>{rooms}</span>
            <button
              className="btn btn-outline-primary"
              onClick={() => increment(setRooms, rooms)}
            >
              +
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "1",
      label: (
        <div className="flex justify-between items-center gap-5">
          <div className="flex flex-col">
            <strong className="text-[16px]">Người lớn</strong>
            <span className="text-[14px]">Từ 12 tuổi trở lên</span>
          </div>
          <div
            onClick={preventDropdownClose}
            className="flex items-center gap-4 outline-black outline p-2 rounded-lg"
          >
            <button
              className="btn btn-outline-primary"
              onClick={() => decrement(setAdults, adults)}
            >
              -
            </button>
            <span>{adults}</span>
            <button
              className="btn btn-outline-primary"
              onClick={() => increment(setAdults, adults)}
            >
              +
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div
          onClick={preventDropdownClose}
          className="flex justify-between items-center gap-5"
        >
          <div className="flex flex-col">
            <strong className="text-[16px]">Trẻ em</strong>
            <span className="text-[14px]">Dưới 12 tuổi</span>
          </div>
          <div className="flex items-center gap-4 outline-black outline p-2 rounded-lg">
            <button
              className="btn btn-outline-primary"
              onClick={() => decrement(setChildren, children)}
            >
              -
            </button>
            <span>{children}</span>
            <button
              className="btn btn-outline-primary"
              onClick={() => increment(setChildren, children)}
            >
              +
            </button>
          </div>
        </div>
      ),
    },
  ];

  const settings = {
    dots: false,
    className: "center",
    infinite: true,
    centerPadding: "5px",
    slidesToShow: isMobile ? 1.1 : 3,
    arrows: false,

    swipeToSlide: true,
  };
  const settingsCombo = {
    dots: false,
    className: "center",
    infinite: true,
    centerPadding: "5px",
    slidesToShow: 1,
    arrows: false,

    swipeToSlide: true,
  };
  const settingsTour = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3.7,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const filterTourNotCombo = allTours.filter((item) => item.combo === false);

  const onChange = (key) => {
    console.log(key);
  };
  const onChangeDate = (date, dateString) => {
    setDates2(dateString);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDates = dates.length
      ? [
          moment(dates[0]).format("DD/MM/YYYY"),
          moment(dates[1]).format("DD/MM/YYYY"),
        ]
      : [];
    const bookingData = {
      location,
      date: [
        {
          checkInDate: formattedDates[0],
          checkOutDate: formattedDates[1],
        },
      ],
      rooms,
      adults,
      children,
    };

    console.log("Submitted Booking Data:", bookingData);

    // Example: axios.post("/api/booking", bookingData);
  };

  const convertToSlug = (text) => {
    const removeAccents = (str) => {
      return str
        .normalize("NFD") // Tách các ký tự có dấu ra khỏi chữ cái
        .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ các ký tự dấu
    };

    return removeAccents(text)
      .toLowerCase() // Chuyển thành chữ thường
      .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/[^\w\-]+/g, "") // Loại bỏ các ký tự đặc biệt (ngoại trừ gạch ngang)
      .replace(/\-\-+/g, "-") // Loại bỏ gạch ngang thừa
      .replace(/^-+/, "") // Loại bỏ gạch ngang ở đầu chuỗi
      .replace(/-+$/, ""); // Loại bỏ gạch ngang ở cuối chuỗi
  };
  const handleSubmitTour = () => {
    if (!city || !dates2 || !budget) {
      message.error("Vui lòng chọn đầy đủ");
      return;
    }
    const formattedDate = moment(dates2).format("YYYY-MM-DD");
    const url = `/du-lich-tai/${convertToSlug(
      city
    )}/${formattedDate}/${budget}`;
    navigate(url);
  };

  const filterTourCombo = allTours.filter((item) => item.combo === true);

  const items = [
    {
      key: "1",
      label: (
        <div className="flex items-center gap-3 w-full px-5">
          <FaCarSide className="text-[20px]" />
          <span className={`${isMobile ? "text-[13px]" : "text-[18px]"}`}>
            Vui lòng lựa chọn các thông tin để tìm kiếm tour{" "}
          </span>
        </div>
      ),
      children: (
        <div
          className={`w-full home-form  ${
            isMobile
              ? "h-max flex flex-col py-3 px-3  gap-3"
              : "h-[100px] grid grid-cols-4  gap-5  px-5"
          }    `}
        >
          <div className="flex w-full flex-col justify-center">
            <span className={`${isMobile ? "text-[15px]" : "text-[18px]"}`}>
              Bạn muốn đi đâu ?
            </span>
            <Form.Item name="city">
              <Select
                placeholder="Chọn thành phố"
                onChange={(value) => setCity(value)}
              >
                {cities.map((city) => (
                  <Option key={city.code} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="w-full flex flex-col justify-center ">
            <span className={`${isMobile ? "text-[15px]" : "text-[18px]"}`}>
              Ngày đi
            </span>
            <DatePicker
              placeholder="Chọn ngày khởi hành"
              format={{
                format: "YYYY-MM-DD",
                type: "mask",
              }}
              onChange={onChangeDate}
            />
          </div>
          <div className="w-full flex flex-col  justify-center">
            <span className={`${isMobile ? "text-[15px]" : "text-[18px]"}`}>
              Ngân sách
            </span>
            <Select
              showSearch
              placeholder="Chọn mức giá"
              value={budget}
              onChange={(value) => setBudget(value)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "duoi5trieu", label: "Dưới 5 triệu" },
                { value: "tu5den10trieu", label: "Từ 5 - 10 triệu" },
                { value: "tu10den20trieu", label: "Từ 10 - 20 triệu" },
                { value: "tren20trieu", label: "Trên 20 triệu" },
              ]}
            />
          </div>
          <div
            onClick={handleSubmitTour}
            className="flex justify-center flex-col   items-center  "
          >
            <button
              type="button"
              className=" bg-blue-600 flex justify-center items-center rounded-lg  text-white w-[150px] h-[50px]"
            >
              <FaSearch className="text-[20px]" />
            </button>
          </div>
        </div>
      ),
    },
    // {
    //   key: "2",
    //   label: (
    //     <div className="flex items-center gap-3 w-full">
    //       <FaHotel className="text-[20px]" />
    //       <span className="text-[18px]">Khách sạn</span>
    //     </div>
    //   ),
    //   children: (
    //     <form onSubmit={handleSubmit}>
    //       <div className="w-full h-[80px] gap-5 px-5 pb-4 flex items-center  justify-between">
    //         <div className="w-[30%] flex flex-col">
    //           <span className="text-[18px] ">Địa điểm ? </span>
    //           <input
    //             type="text"
    //             placeholder="Khách sạn, điểm đến, thành phố,..."
    //             className="rounded-md bg-transparent outline-none"
    //             value={location}
    //             onChange={(e) => setLocation(e.target.value)}
    //           />
    //         </div>
    //         <div className="w-[70%] flex items-center gap-3 h-full">
    //           <div className="flex justify-between w-full">
    //             <div className="w-full flex flex-col h-full">
    //               <span className="text-[18px] ">Nhận phòng và trả phòng</span>
    //               <RangePicker onChange={(values) => setDates(values)} />
    //             </div>
    //           </div>
    //           <div className="flex justify-between w-full">
    //             <div className="w-full flex flex-col">
    //               <span className="text-[18px]">Ngân sách</span>
    //               <Dropdown
    //                 menu={{
    //                   items: optionsBook,
    //                 }}
    //                 trigger={["click"]}
    //                 placement="bottom"
    //                 open={dropdownOpen}
    //                 onOpenChange={handleOpenChange}
    //               >
    //                 <a onClick={handleDropdownClick}>
    //                   <Space>
    //                     {rooms >= 1 && `${rooms} phòng`}
    //                     {rooms >= 1 && adults >= 1 && ", "}
    //                     {adults >= 1 && `${adults} người lớn`}
    //                     {(rooms >= 1 || adults >= 1) && children >= 1 && ", "}
    //                     {children >= 1 && `${children} trẻ em`}
    //                   </Space>
    //                 </a>
    //               </Dropdown>
    //             </div>
    //           </div>
    //           <div
    //             style={{ height: "100%", width: "50%" }}
    //             className="bg-blue-600 flex justify-center items-center p-1 rounded-lg"
    //           >
    //             <button type="submit">
    //               <FaSearch className="text-[20px] text-white" />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </form>
    //   ),
    // },
  ];
  const itemsTour = [
    {
      key: "1",
      label: "Miền Bắc",
      children: (
        <div className="gallery">
          {Array.from(
            new Set(
              allTours
                .filter((item) => regions["Miền Bắc"].includes(item.endCity))
                .map((item) => item.endCity)
            )
          ).map((uniqueCity) => {
            const cityTour = allTours.find(
              (item) => item.endCity === uniqueCity
            );
            return (
              <div
                key={uniqueCity}
                className="gallery-item flex justify-center items-center relative"
              >
                <img
                  src={cityTour?.images[0]}
                  className=" w-full object-cover"
                  alt={uniqueCity}
                />
                <div className="absolute gap-3 flex flex-col text-center">
                  <span
                    className={`${
                      isMobile ? " text-[18px]" : "text-[20px]"
                    } fw-bold text-white`}
                  >
                    {uniqueCity}
                  </span>
                  <Link to={`/kham-pha-${convertToSlug(uniqueCity)}`}>
                    <button className="btn btn-primary">Khám phá</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },

    {
      key: "2",
      label: "Miền Trung",
      children: (
        <div className="gallery">
          {Array.from(
            new Set(
              allTours
                .filter((item) => regions["Miền Trung"].includes(item.endCity))
                .map((item) => item.endCity)
            )
          ).map((uniqueCity) => {
            const cityTour = allTours.find(
              (item) => item.endCity === uniqueCity
            );
            return (
              <div
                key={uniqueCity}
                className="gallery-item flex justify-center items-center relative"
              >
                <img
                  src={cityTour?.images[0]}
                  className=" w-full object-cover"
                  alt={uniqueCity}
                />
                <div className="absolute gap-3 flex flex-col text-center">
                  <span className="text-[20px] fw-bold text-white">
                    {uniqueCity}
                  </span>
                  <Link to={`/kham-pha-${convertToSlug(uniqueCity)}`}>
                    <button className="btn btn-primary">Khám phá</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: "3",
      label: "Miền Nam",
      children: (
        <div className="gallery">
          {Array.from(
            new Set(
              allTours
                .filter((item) => regions["Miền Nam"].includes(item.endCity))
                .map((item) => item.endCity)
            )
          ).map((uniqueCity) => {
            const cityTour = allTours.find(
              (item) => item.endCity === uniqueCity
            );
            return (
              <div
                key={uniqueCity}
                className="gallery-item flex justify-center items-center relative"
              >
                <img
                  src={cityTour?.images[0]}
                  className=" w-full object-cover"
                  alt={uniqueCity}
                />
                <div className="absolute gap-3 flex flex-col text-center">
                  <span className="text-[20px] fw-bold text-white">
                    {uniqueCity}
                  </span>
                  <Link to={`/kham-pha-${convertToSlug(uniqueCity)}`}>
                    <button className="btn btn-primary">Khám phá</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];
  return (
    <div className="homepage w-full flex flex-col gap-5">
      <div className="h-full w-full">
        <StartPage />
      </div>
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full justify-center">
          <WorldClock />
        </div>

        <div
          className="w-1240 w-375 rounded-xl bg-white"
          style={{
            boxShadow: "2px 0 10px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        >
          <div className="flex justify-center w-full">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </div>
        </div>
        <div
          className={`w-1240 w-375 flex  justify-center ${
            isMobile ? "" : "gap-5"
          }`}
        >
          {typeTour?.map((item, index) => {
            return (
              <Link
                className={`${isMobile ? "flex justify-center" : ""}`}
                key={index}
                to={`/${item.slugTypeTour}`}
              >
                <div className=" hover-box flex flex-col w-24 justify-center items-center gap-2">
                  <div className=" cursor-pointer hover-img  flex items-center bg-[#daefff] p-2 rounded-lg">
                    <img src={item.image} alt="" style={{ width: "55px" }} />
                  </div>
                  <span
                    className={`${isMobile ? "text-[14px]" : ""} text-center`}
                  >
                    {item.typeTour}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="w-1240 w-375">
          <Slider {...settings}>
            <div>
              <img
                className="rounded-xl  w-[95%] object-cover"
                src={h1}
                alt="h1"
              />
            </div>
            <div>
              <img
                className="rounded-xl w-[95%] object-cover"
                src={h2}
                alt="h2"
              />
            </div>
            <div>
              <img
                className="rounded-xl  w-[95%] object-cover"
                src={h3}
                alt="h3"
              />
            </div>
            <div>
              <img
                className="rounded-xl  w-[95%] object-cover"
                src={h4}
                alt="h4"
              />
            </div>
          </Slider>
        </div>
        <div className="w-1240 w-375 flex flex-col gap-5">
          <div className={`${isMobile ? "w-full" : "w-[800px]"} `}>
            <Heading
              left="0px"
              title="Tin tức nổi bật"
              description="Hãy tận hưởng trải nghiệm du lịch chuyên nghiệp, mang lại cho bạn những khoảnh khắc tuyệt vời và nâng tầm cuộc sống. Chúng tôi cam kết mang đến những chuyến đi đáng nhớ, giúp bạn khám phá thế giới theo cách hoàn hảo nhất."
            />
          </div>

          {isMobile ? (
            <div>
              <Slider {...settings}>
                {blogs?.slice(0, 3).map((item) => {
                  return (
                    <div className="flex flex-col rounded-lg overflow-hidden blog-mobile bsd gap-4 ">
                      <div className="w-[100%] ">
                        <Link to={`/tin-tuc/${item._id}`}>
                          <img
                            src={item?.image}
                            alt=""
                            className="w-[100%]  object-cover"
                          />
                        </Link>
                      </div>
                      <div
                        className={`p-2 flex flex-col gap-2 ${
                          isMobile ? "py-4" : ""
                        }`}
                      >
                        <h1 className="text-[20px] fw-bold clamped-text-mobile">
                          {item?.title}
                        </h1>
                        <span className="text-gray-500">
                          Ngày đăng: {formatDate(item?.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          ) : (
            <>
              {" "}
              <div className=" grid grid-cols-3 gap-3">
                {blogs?.slice(0, 3).map((item) => {
                  return (
                    <div className="flex flex-col rounded-lg overflow-hidden bsd gap-4">
                      <div className="w-[100%]">
                        <Link to={`/tin-tuc/${item._id}`}>
                          <img
                            src={item?.image}
                            alt=""
                            className="w-[100%] h-[250px]  object-cover"
                          />
                        </Link>
                      </div>
                      <div className="p-2 flex flex-col gap-2">
                        <h1 className="text-[20px] fw-bold">{item?.title}</h1>
                        <span className="text-gray-500">
                          Ngày đăng: {formatDate(item?.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="w-full justify-center text-center items-center">
                <button
                  onClick={() => navigate("/tin-tuc")}
                  className=" btn-all outline outline-[#276ca1] w-max px-4 py-2 rounded-md text-[#276ca1] fw-bold"
                >
                  Xem tất cả
                </button>
              </div>
            </>
          )}
        </div>
        <div className="bg-[#daefff]">
          <div className="w-1240 w-375 py-10 flex flex-col gap-5">
            <div
              className={`${
                isMobile ? "flex-col gap-2" : ""
              } flex justify-between items-center`}
            >
              <div>
                <Heading
                  left="0px"
                  title="ƯU ĐÃI GIỜ CHỐT"
                  description="Nhanh tay nắm bắt cơ hội giảm giá cuối cùng. Đặt ngay để không bỏ lỡ!"
                />
              </div>
              <div
                className={`${
                  isMobile ? "w-full justify-start" : ""
                } flex gap-7`}
              >
                <button
                  style={{ borderRadius: "50%" }}
                  className=" w-[50px] h-[50px] bg-white flex justify-center items-center  custom-prev"
                  onClick={() => sliderRef.current?.slickPrev()}
                >
                  <FaAngleLeft className="text-[20px]" />
                </button>
                <button
                  style={{ borderRadius: "50%" }}
                  className=" w-[50px] h-[50px] bg-white flex justify-center items-center  custom-next"
                  onClick={() => sliderRef.current?.slickNext()}
                >
                  <FaAngleRight className="text-[20px]" />
                </button>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div className="">
                <Slider {...settingsTour} ref={sliderRef}>
                  {filterTourNotCombo.map((tour, index) => (
                    <div key={index}>
                      <CardProduct user={user} data={tour} />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            <div className="w-full justify-center text-center items-center">
              <button
                onClick={() => navigate("/chuong-trinh")}
                className=" btn-all outline outline-[#276ca1] w-max px-4 py-2 rounded-md text-[#276ca1] fw-bold"
              >
                Xem tất cả
              </button>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div>
              <div className="w-1240 w-375 justify-center items-center text-center">
                <Heading
                  left={`${isMobile ? "35px " : "75px"}`}
                  title="ĐIỂM ĐẾN YÊU THÍCH"
                  description="Hãy chọn một điểm đến du lịch nổi tiếng dưới đây để khám phá các chuyến đi độc quyền của chúng tôi với mức giá vô cùng hợp lý."
                />
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <div className="w-1240 w-375">
                  <Tabs
                    defaultActiveKey="1"
                    items={itemsTour}
                    onChange={onChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="imgbg flex justify-center items-center">
          <div className="w-1240 w-375 flex flex-col gap-5">
            <div className="w-full justify-center items-center text-center">
              <Heading
                left="43px"
                title="COMBO GIÁ TỐT"
                description="Với sự hợp tác giảm giá ưu đãi cùng hệ thống đối tác lớn, chúng tôi tự tin mang đến cho quý khách combo vé máy bay và khách sạn với giá tốt nhất!"
              />
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : isMobile ? (
              <div>
                <Slider {...settingsCombo}>
                  {filterTourCombo?.map((combo, index) => (
                    <div key={index} className={` flip-card`}>
                      <div className="flip-card-inner">
                        <div className="flip-card-front content-combo bg-white px-3 py-3   flex flex-col gap-2 rounded-lg">
                          <div className="flex w-full items-center justify-start gap-3">
                            <span
                              className={`
                            fw-bold`}
                            >
                              {combo?.city}
                            </span>
                            <FaLongArrowAltRight />
                            <span
                              className={`
                            fw-bold`}
                            >
                              {combo?.endCity}
                            </span>
                          </div>
                          <div
                            className={`flex w-full items-center  justify-between fw-bold`}
                          >
                            <div className={`flex items-center gap-2`}>
                              <ImPriceTag />
                              Mã tour
                            </div>
                            <span
                              className={`clamped-text 
                            }`}
                            >
                              {" "}
                              {combo?._id}
                            </span>
                          </div>
                          <div
                            className={`flex w-full items-center justify-between fw-bold 
                           
                           `}
                          >
                            <div className={`flex items-center gap-2  `}>
                              <FaCalendarAlt />
                              Khởi hành
                            </div>
                            <span
                              className={`clamped-text $
                            }`}
                            >
                              {combo?.inforTourDetail[0]?.time?.startDate}
                            </span>
                          </div>
                          <div
                            className={`flex w-full justify-between items-center fw-bold  `}
                          >
                            <div className={`flex items-center gap-2 w-full `}>
                              <FaHotel />
                              Khách sạn
                            </div>

                            <span className={`clamped-text`}>
                              {combo?.hotel}
                            </span>
                          </div>
                          <div className="flex w-full fw-bold items-center justify-between">
                            <div className={`flex items-center gap-2`}>
                              <FaPlane />
                              Phương tiện
                            </div>
                            <span>{combo?.vehicle}</span>
                          </div>
                          <div
                            className={`flex w-full ${
                              isMobile ? "flex" : "justify-end"
                            }  `}
                          >
                            <div
                              className={`${
                                isMobile
                                  ? "flex items-center justify-between w-full"
                                  : ""
                              }`}
                            >
                              <span
                                className={` ${
                                  isMobile ? "" : "text-end"
                                } block fw-bold`}
                              >
                                Giá từ
                              </span>
                              <p>
                                <span
                                  className={`text-red-500 fw-bold text-[18px]
                                } `}
                                >
                                  {combo?.inforTourDetail[0]?.price.price} /
                                  Khách
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flip-card-back rounded-lg overflow-hidden">
                          <img
                            className="relative"
                            src={combo?.images[0]}
                            alt=""
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div className="absolute flex gap-2 items-center">
                            <Link
                              to={`/chuong-trinh/${combo?.slug}`}
                              className="flex gap-2 items-center"
                            >
                              <span className="text-[18px] text-white">
                                Xem chi tiết
                              </span>
                              <FaArrowAltCircleRight className="text-[24px] text-white" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div
                className={` ${
                  isMobile ? "h-[250px]" : "grid w-full grid-cols-4  gap-y-9"
                }`}
              >
                {filterTourCombo?.splice(0, 8)?.map((combo, index) => (
                  <div key={index} className={`h-full flip-card`}>
                    <div className="h-full flip-card-inner">
                      <div className="flip-card-front h-full content-combo bg-white px-3 py-3   flex flex-col gap-2 rounded-lg">
                        <div className="flex w-full items-center justify-start gap-3">
                          <span className={`fw-bold`}>{combo?.city}</span>
                          <FaLongArrowAltRight />
                          <span
                            className={`
                            fw-bold`}
                          >
                            {combo?.endCity}
                          </span>
                        </div>
                        <div
                          className={`flex w-full items-center  justify-between fw-bold`}
                        >
                          <div className={`flex items-center gap-2 w-full`}>
                            <ImPriceTag />
                            Mã tour
                          </div>
                          <span className={`clamped-text`}> {combo?._id}</span>
                        </div>
                        <div
                          className={`flex w-full items-center justify-between fw-bold`}
                        >
                          <div className={`flex items-center gap-2 `}>
                            <FaCalendarAlt />
                            Khởi hành
                          </div>
                          <span
                            className={`clamped-text $
                            }`}
                          >
                            {combo?.inforTourDetail[0]?.time?.startDate}
                          </span>
                        </div>
                        <div
                          className={`flex w-full justify-between items-center fw-bold  `}
                        >
                          <div className={`flex items-center gap-2 w-full `}>
                            <FaHotel />
                            Khách sạn
                          </div>

                          <span
                            className={`clamped-text
                            `}
                          >
                            {combo?.hotel}
                          </span>
                        </div>
                        <div className="flex w-full fw-bold items-center justify-between">
                          <div className={`flex items-center gap-2`}>
                            <FaPlane />
                            Phương tiện
                          </div>
                          <span>{combo?.vehicle}</span>
                        </div>
                        <div className={`flex w-full`}>
                          <div
                            className={`${
                              isMobile
                                ? ""
                                : "flex items-center justify-between w-full"
                            }`}
                          >
                            <span
                              className={` ${
                                isMobile ? "text-[11px]" : "text-end"
                              } block fw-bold`}
                            >
                              Giá từ
                            </span>
                            <p>
                              <span className={`text-red-500 text-[18px]`}>
                                {combo?.inforTourDetail[0]?.price.price} / Khách
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flip-card-back rounded-lg overflow-hidden">
                        <img
                          className="relative"
                          src={combo?.images[0]}
                          alt=""
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div className="absolute flex gap-2 items-center">
                          <Link
                            to={`/chuong-trinh/${combo?.slug}`}
                            className="flex gap-2 items-center"
                          >
                            <span className="text-[18px] text-white">
                              Xem chi tiết
                            </span>
                            <FaArrowAltCircleRight className="text-[24px] text-white" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="w-full justify-center text-center items-center">
              <button
                onClick={() => navigate("/combo-du-lich")}
                className="btn-all outline outline-[#276ca1] w-max px-4 py-2 rounded-md text-[#276ca1] fw-bold"
              >
                Xem tất cả
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
