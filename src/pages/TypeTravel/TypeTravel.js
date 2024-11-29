import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Form, message, Select } from "antd";
import axios from "axios";
import { ImPriceTag } from "react-icons/im";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

import { baseUrl } from "../../base/baseUrl";
import convertToSlug from "../../utils/formatTitle";
import "./TypeTravel.css";
import FavoriteTours from "../../components/FavoriteTours/FavoriteTours";
import { useDispatch, useSelector } from "react-redux";
import {
  addTourToCart,
  removeTourFromCart,
} from "../../store/actions/cartActions";
import { IoCloseSharp } from "react-icons/io5";
import { IoFilterSharp } from "react-icons/io5";
const { Option } = Select;

const budgetOptions = [
  "Dưới 5 triệu",
  "Từ 5 - 10 triệu",
  "Từ 10-20 triệu",
  "Trên 20 triệu",
];
const tourTypes = ["Cao cấp", "Tiêu chuẩn", "Tiết kiệm", "Giá tốt"];
const vehicleOptions = ["Xe", "Máy bay"];

const TypeTravel = ({ user }) => {
  const dispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const { slug, citySlug, dateSlug, budgetSlug } = useParams();
  const [form] = Form.useForm();

  const isDuLichPath = location.pathname.startsWith("/du-lich-tai/");
  const isDiemDenPath = location.pathname.startsWith("/chuong-trinh");

  const [allTours, setAllTours] = useState([]);
  const [filteredDataTour, setFilteredDataTour] = useState([]);
  const [cities, setCities] = useState([]);
  const [endCities, setEndCities] = useState([]);

  const [typeSlug, setTypeSlug] = useState("");
  const [descriptionSlug, setDescriptionSlug] = useState("");
  const [convertSlug, setConvertSlug] = useState("");

  const [city, setCity] = useState(null);
  const [endCity, setEndCity] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [budget, setBudget] = useState(null);
  const [tourType, setTourType] = useState(null);

  const fetchCities = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=2"
      );
      setCities(response.data);
      setEndCities(response.data);
    } catch (error) {
      console.error("Error fetching provinces data:", error);
    }
  }, []);

  const fetchAllTours = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}tour/get-all-tours`);
      const tours = response?.data?.tours;
      setAllTours(tours);
      console.log("Tours fetched successfully:", tours);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  }, []);

  useEffect(() => {
    fetchCities();
    fetchAllTours();
  }, [fetchCities, fetchAllTours]);

  const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = end - start;
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const nights = days - 1;
    return `${days}N${nights}Đ`;
  };

  const filterCityBudgetDate = useCallback(() => {
    let filteredData = [];
    if (isDuLichPath) {
      filteredData = allTours;
    }

    if (budgetSlug) {
      const budgetRange = {
        duoi5trieu: [0, 5000000],
        tu5den10trieu: [5000000, 10000000],
        tu10den20trieu: [10000000, 20000000],
        tren20trieu: [20000000, Infinity],
      }[budgetSlug];

      console.log("Applying budget filter with range:", budgetRange);

      if (budgetRange) {
        filteredData = filteredData.filter((item) => {
          const price = parseInt(item.inforTourDetail[0]?.price?.price);
          return price >= budgetRange[0] && price < budgetRange[1];
        });
      }
    }

    if (citySlug) {
      filteredData = filteredData.filter((item) => {
        const matchesCity = convertToSlug(item.city) === citySlug;
        return matchesCity;
      });
    }

    if (dateSlug) {
      filteredData = filteredData.filter((item) => {
        const matchesDate =
          item?.inforTourDetail[0].time?.startDate === dateSlug;
        return matchesDate;
      });
    }

    setFilteredDataTour(filteredData);
    console.log("Final filteredDataTour:", filteredData);
  }, [allTours, budgetSlug, citySlug, dateSlug]);

  useEffect(() => {
    filterCityBudgetDate();
  }, [filterCityBudgetDate]);

  useEffect(() => {
    if (slug === "du-lich-cao-cap") {
      setTypeSlug("Du lịch cao cấp");
      setDescriptionSlug(
        "Dòng tour cao cấp nhất và là niềm tự hào của Vietravel. Xuyên suốt hành trình Du Khách sẽ được tận hưởng chuyến du lịch độc đáo được thiết kế chọn lọc tinh tế cùng hệ thống dịch vụ đẳng cấp nhằm đem lại những cảm xúc thăng hoa, gia tăng giá trị và hài lòng tuyệt đối về chuyến đi."
      );
      setConvertSlug("Cao cấp");
    } else if (slug === "du-lich-tieu-chuan") {
      setTypeSlug("Du lịch tiêu chuẩn");
      setDescriptionSlug(
        "Dòng sản phẩm thế mạnh và chủ lực của Vietravel. Du Khách sẽ hoàn toàn an tâm với chất lượng dịch vụ chọn lọc, những điểm đến hấp dẫn, trải nghiệm đáng nhớ. Sản phẩm được thiết kế kỹ càng để luôn tạo sự mới lạ và khác biệt trên thị trường và tương xứng với giá trị mà Du Khách đã bỏ ra."
      );
      setConvertSlug("Tiêu chuẩn");
    } else if (slug === "du-lich-tiet-kiem") {
      setTypeSlug("Du lịch tiết kiệm");
      setDescriptionSlug(
        "Dòng tour này Vietravel hướng đến mục tiêu bất cứ Du Khách nào cũng có cơ hội đi du lịch với mức chi phí tiết kiệm nhất. Các điểm tham quan và dịch vụ chọn lọc phù hợp với ngân sách của Du Khách nhưng vẫn đảm bảo hành trình du lịch đầy đủ và thú vị."
      );
      setConvertSlug("Tiết kiệm");
    } else if (slug?.startsWith("kham-pha-")) {
      const citySlug = slug.split("kham-pha-")[1];
      const cityName = citySlug.replace(/-/g, " ");
      setTypeSlug("Khám phá");
      setDescriptionSlug(
        `Dòng tour khám phá ${cityName}, đem lại cho du khách những trải nghiệm thú vị và đầy đủ về văn hóa và cuộc sống địa phương.`
      );
      setConvertSlug(citySlug);
    } else if (slug?.startsWith("du-lich-tai")) {
      setConvertSlug("du-lich-tai");
    } else if (slug === "du-lich-gia-tot") {
      setTypeSlug("Du lịch giá tốt");
      setDescriptionSlug(
        "Dòng tour có mức giá hấp dẫn nhất thị trường do kết hợp các ưu đãi từ Đối Tác Vàng của Vietravel. Xuyên suốt hành trình là những trải nghiệm và điểm tham quan cơ bản tại từng điểm đến và dịch vụ trong mức tiêu chuẩn tương xứng với chi phí."
      );
      setConvertSlug("Giá tốt");
    }
  }, [slug]);
  useEffect(() => {
    if (!isDuLichPath) {
      if (slug === "chuong-trinh") {
        setFilteredDataTour(allTours);
      } else if (allTours) {
        const filterTour = allTours.filter(
          (tour) =>
            tour.typeCombo === convertSlug ||
            convertToSlug(tour.city) === convertSlug
        );
        setFilteredDataTour(filterTour);
      }
    }
  }, [allTours, slug, convertSlug, isDuLichPath]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let filteredData =
      slug === "chuong-trinh"
        ? allTours
        : allTours?.filter((tour) => tour.typeCombo === convertSlug) || [];

    if (budget) {
      const budgetRange = {
        "Dưới 5 triệu": [0, 5000000],
        "Từ 5 - 10 triệu": [5000000, 10000000],
        "Từ 10-20 triệu": [10000000, 20000000],
        "Trên 20 triệu": [20000000, Infinity],
      }[budget];

      filteredData = filteredData.filter((item) => {
        const price = parseInt(item.inforTourDetail[0]?.price?.price);
        return price >= budgetRange[0] && price < budgetRange[1];
      });
    }
    if (city) filteredData = filteredData.filter((item) => item.city === city);
    if (endCity)
      filteredData = filteredData.filter((item) => item.endCity === endCity);
    if (vehicle)
      filteredData = filteredData.filter((item) => item.vehicle === vehicle);

    setFilteredDataTour(filteredData);
  };

  const handleChange = (value) => {
    let sortedArray = isDiemDenPath ? [...allTours] : [...filteredDataTour];
    if (value === "priceAsc") {
      sortedArray.sort(
        (a, b) =>
          Number(a?.inforTourDetail[0]?.price?.price) -
          Number(b?.inforTourDetail[0]?.price?.price)
      );
    } else if (value === "priceDesc") {
      sortedArray.sort(
        (a, b) =>
          Number(b?.inforTourDetail[0]?.price?.price) -
          Number(a?.inforTourDetail[0]?.price?.price)
      );
    }
    setFilteredDataTour(sortedArray);
  };

  const handleReset = () => {
    setBudget(null);
    setCity(null);
    setEndCity(null);
    setVehicle(null);
    setTourType(null);
    setFilteredDataTour(allTours);
    navigate("/chuong-trinh");
  };

  const processSlug = (slug) => {
    return slug.includes("-") ? "" : slug;
  };

  const cartTours = useSelector((state) => state.cart.tours);

  const addTourCart = (tour) => {
    const isInCart = cartTours.some((item) => item._id === tour._id);
    if (isInCart) {
      dispatch(removeTourFromCart(tour._id));
      message.info("Đã xóa tour khỏi giỏ tour");
    } else {
      dispatch(addTourToCart(tour));
      message.success("Thêm vào giỏ tour thành công");
    }
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

  const [clickFilter, setClickFilter] = useState(false);

  const showFilter = () => {
    setClickFilter(!clickFilter);
  };

  return (
    <div
      className={`w-1240 w-375 flex flex-col ${
        isMobile ? "pb-36" : "gap-5 py-5"
      } typeTravel`}
    >
      <div className="w-full flex justify-center">
        <div className="w-[1000px] text-center flex flex-col gap-4">
          <span
            style={{ textTransform: "uppercase" }}
            className="text-[28px] fw-bold text-[#276ca1]"
          >
            {typeSlug ? typeSlug : "Tất cả các điểm đến"}
          </span>
          <p className="text-left">
            {descriptionSlug
              ? descriptionSlug
              : "Khám phá những điểm đến đa dạng từ bãi biển thơ mộng, núi non hùng vĩ đến thành phố sôi động và làng quê yên bình. Trải nghiệm văn hóa, ẩm thực đặc sắc và tạo nên những kỷ niệm khó quên trong mỗi hành trình."}
          </p>
        </div>
      </div>
      <Row>
        {isMobile ? (
          <>
            <div className="flex bg-white w-full right-0 left-0  h-[70px] rounded-t-xl bsd z-50 fixed bottom-0 justify-between">
              <div className="flex w-full">
                <div
                  className="flex fw-bold gap-2 justify-center w-full items-center"
                  onClick={showFilter}
                >
                  Bộ lọc tìm kiếm
                  <IoFilterSharp className="text-[20px] fw-bold" />
                </div>
              </div>
              {clickFilter && (
                <div className="absolute bottom-0 w-full">
                  <form
                    onSubmit={handleSubmit}
                    className="sticky-sidebar  formfilter bg-slate-200 rounded-t-3xl p-3 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="fw-bold text-[20px]">
                        BỘ LỌC TÌM KIẾM
                      </span>
                      <IoCloseSharp
                        className="text-[25px]"
                        onClick={() => setClickFilter(false)}
                      />
                    </div>
                    <span>Ngân sách</span>
                    <div className="grid grid-cols-2 gap-3">
                      {budgetOptions.map((budgetOption) => (
                        <button
                          type="button"
                          key={budgetOption}
                          className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                            budget === budgetOption
                              ? "bg-[#6b98bb] text-[#276ca1]"
                              : ""
                          }`}
                          onClick={() => setBudget(budgetOption)}
                        >
                          {budgetOption}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col justify-between gap-2">
                      <span>Điểm khởi hành</span>
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
                    <div className="flex flex-col justify-between gap-2">
                      <span>Điểm đến</span>
                      <Form.Item name="endCity">
                        <Select
                          placeholder="Chọn điểm đến"
                          onChange={(value) => setEndCity(value)}
                        >
                          {endCities.map((endCity) => (
                            <Option key={endCity.code} value={endCity.name}>
                              {endCity.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span>Dòng tour</span>
                      <div className="grid grid-cols-2 gap-3">
                        {tourTypes.map((tour) => (
                          <button
                            key={tour}
                            onClick={() => {
                              setTourType(tour);
                              navigate(
                                `/du-lich-${convertToSlug(tour.toLowerCase())}`
                              );
                            }}
                            className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                              tourType === tour
                                ? "bg-[#6b98bb] text-[#276ca1]"
                                : ""
                            }`}
                          >
                            {tour}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span>Phương tiện</span>
                      <div className="grid grid-cols-2 gap-2">
                        {vehicleOptions.map((vehicleOption) => (
                          <button
                            key={vehicleOption}
                            onClick={() => setVehicle(vehicleOption)}
                            className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                              vehicle === vehicleOption
                                ? "bg-[#6b98bb] text-[#276ca1]"
                                : ""
                            }`}
                          >
                            {vehicleOption}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="w-full">
                      <button
                        type="submit"
                        className="btn w-full bg-[#276ca1] text-white hover:bg-[#1f5682]"
                      >
                        Tìm kiếm
                      </button>
                    </div>
                    <div className="w-full">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn w-full bg-[#276ca1] text-white hover:bg-[#1f5682]"
                      >
                        Xóa
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </>
        ) : (
          <Col sm={3} className="flex flex-col gap-3">
            <div>
              <span className="fw-bold text-[20px]">BỘ LỌC TÌM KIẾM</span>
            </div>
            <form
              onSubmit={handleSubmit}
              className="sticky-sidebar formfilter bg-slate-200 rounded-md p-3 flex flex-col gap-3"
            >
              <span>Ngân sách</span>
              <div className="grid grid-cols-2 gap-3">
                {budgetOptions.map((budgetOption) => (
                  <button
                    type="button"
                    key={budgetOption}
                    className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                      budget === budgetOption
                        ? "bg-[#6b98bb] text-[#276ca1]"
                        : ""
                    }`}
                    onClick={() => setBudget(budgetOption)}
                  >
                    {budgetOption}
                  </button>
                ))}
              </div>
              <div className="flex flex-col justify-between gap-2">
                <span>Điểm khởi hành</span>
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
              <div className="flex flex-col justify-between gap-2">
                <span>Điểm đến</span>
                <Form.Item name="endCity">
                  <Select
                    placeholder="Chọn điểm đến"
                    onChange={(value) => setEndCity(value)}
                  >
                    {endCities.map((endCity) => (
                      <Option key={endCity.code} value={endCity.name}>
                        {endCity.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="flex flex-col gap-2">
                <span>Dòng tour</span>
                <div className="grid grid-cols-2 gap-3">
                  {tourTypes.map((tour) => (
                    <button
                      key={tour}
                      onClick={() => {
                        setTourType(tour);
                        navigate(
                          `/du-lich-${convertToSlug(tour.toLowerCase())}`
                        );
                      }}
                      className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                        tourType === tour ? "bg-[#6b98bb] text-[#276ca1]" : ""
                      }`}
                    >
                      {tour}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span>Phương tiện</span>
                <div className="grid grid-cols-2 gap-2">
                  {vehicleOptions.map((vehicleOption) => (
                    <button
                      key={vehicleOption}
                      onClick={() => setVehicle(vehicleOption)}
                      className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                        vehicle === vehicleOption
                          ? "bg-[#6b98bb] text-[#276ca1]"
                          : ""
                      }`}
                    >
                      {vehicleOption}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  className="btn w-full bg-[#276ca1] text-white hover:bg-[#1f5682]"
                >
                  Tìm kiếm
                </button>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn w-full bg-[#276ca1] text-white hover:bg-[#1f5682]"
                >
                  Xóa
                </button>
              </div>
            </form>
          </Col>
        )}

        <Col sm={9}>
          <div className={`flex flex-col ${isMobile ? "gap-3" : "gap-5"} `}>
            <div
              className={` ${
                isMobile ? "flex-col mt-4 items-start gap-2" : " "
              } flex justify-between items-center`}
            >
              <strong className="text-[18px]">
                Chúng tôi tìm thấy{" "}
                <strong className="text-[#276ca1] text-[24px]">
                  {filteredDataTour.length}
                </strong>{" "}
                chương trình tour cho quý khách
              </strong>
              <div
                className={`  ${
                  isMobile ? "items-start w-full" : "items-center"
                } flex justify-between  gap-3`}
              >
                <strong className="text-[18px]">Sắp xếp theo</strong>
                <Select
                  defaultValue="Giá từ thấp đến cao"
                  style={{ width: "max-content" }}
                  onChange={handleChange}
                  options={[
                    { value: "priceAsc", label: "Giá từ thấp đến cao" },
                    { value: "priceDesc", label: "Giá từ cao đến thấp" },
                  ]}
                />
              </div>
            </div>
            <hr />
            <div className="w-full flex flex-col gap-5 typeTour">
              {filteredDataTour.map((tour) => {
                const isInCart = cartTours.some(
                  (item) => item._id === tour._id
                );
                return (
                  <Row
                    key={tour._id}
                    className="w-full rounded-xl overflow-hidden"
                    style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
                  >
                    <Col sm={5} className="relative">
                      <Link
                        className="h-full"
                        to={`/chuong-trinh/${convertToSlug(tour?.title)}`}
                      >
                        <img
                          src={tour?.images[0]}
                          alt=""
                          style={{
                            height: "280px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                      <div
                        style={{ top: "10px", left: "10px" }}
                        className="absolute flex justify-between flex-col items-center gap-3"
                      >
                        <FavoriteTours tourId={tour._id} user={user} />
                        <FaShoppingCart
                          onClick={() => addTourCart(tour)}
                          className={`text-[25px] ${
                            isInCart ? "text-red-500" : "text-white"
                          }`}
                        />
                      </div>
                      <div
                        style={{ bottom: "10px", left: "10px" }}
                        className={`absolute flex items-center w-max gap-2 p-1 text-white z-auto rounded-md ${
                          tour?.typeCombo === "Cao cấp"
                            ? "bg-red-500"
                            : tour?.typeCombo === "Tiêu chuẩn"
                            ? "bg-[#276ca1]"
                            : tour?.typeCombo === "Tiết kiệm"
                            ? "bg-pink-500"
                            : "bg-orange-500"
                        }`}
                      >
                        <AiFillLike /> {processSlug(convertSlug)}
                      </div>
                    </Col>

                    <Col sm={7} className="p-3 flex flex-col justify-between">
                      <strong
                        className={` ${
                          isMobile
                            ? "text-[20px] clamped-text-typedetail"
                            : "text-[28px]"
                        }`}
                      >
                        {tour?.title}
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
                      </div>
                      <div className="flex justify-between">
                        <div className="flex flex-col">
                          <span className="text-red-500 text-[24px]">
                            {tour?.inforTourDetail[0]?.price?.price}đ
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button className="text-red-500 p-2 rounded-md bg-red-500">
                            <Link
                              className="text-white"
                              to={`/chuong-trinh/${convertToSlug(tour?.title)}`}
                            >
                              Xem chi tiết
                            </Link>
                          </button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TypeTravel;
