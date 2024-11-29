import React, { useEffect, useState } from "react";
import "./TourCombos.css";
import { Col, Row } from "react-bootstrap";
import CardCombo from "../../components/CardCombo/CardCombo";
import axios from "axios";
import { baseUrl } from "../../base/baseUrl";
import { Form, Select } from "antd";

const TourCombos = () => {
  const [allTours, setAllTours] = useState([]);
  const [budget, setBudget] = useState("");
  const [endCity, setEndCity] = useState("");
  const [endCities, setEndCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [comboTour, setComboTour] = useState([]);
  const { Option } = Select;
  useEffect(() => {
    const getAllTours = async () => {
      try {
        const response = await axios.get(`${baseUrl}tour/get-all-tours`);
        const tours = response?.data?.tours;
        setAllTours(tours);
        console.log("Tours fetched successfully:", tours);
        return tours;
      } catch (error) {
        console.error("Error fetching tours:", error);
        throw error;
      }
    };
    getAllTours();
  }, []);
  useEffect(() => {
    const filterTourCombo = allTours.filter((item) => item.combo === true);
    setComboTour(filterTourCombo);
  }, [allTours]);
  const handleChange = (value) => {
    let sortedArray = [...comboTour];
    if (value === "priceAsc") {
      sortedArray.sort(
        (a, b) =>
          Number(a?.inforTourDetail[0]?.price.price) -
          Number(b?.inforTourDetail[0]?.price.price)
      );
    } else if (value === "priceDesc") {
      sortedArray.sort(
        (a, b) =>
          Number(b?.inforTourDetail[0]?.price.price) -
          Number(a?.inforTourDetail[0]?.price.price)
      );
    }
    setComboTour(sortedArray);
  };
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=2")
      .then((response) => {
        setCities(response.data);
        setEndCities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces data:", error);
      });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    let filteredData = allTours.filter((item) => item.combo === true);

    if (budget) {
      const budgetRange = {
        "Dưới 5 triệu": [0, 5000000],
        "Từ 5 - 10 triệu": [5000000, 10000000],
        "Từ 10-20 triệu": [10000000, 20000000],
        "Trên 20 triệu": [20000000, Infinity],
      }[budget];

      filteredData = filteredData.filter((item) => {
        const price = parseInt(item?.inforTourDetail[0]?.price.price);
        return price >= budgetRange[0] && price < budgetRange[1];
      });
    }

    if (city) {
      filteredData = filteredData.filter((item) => item.city === city);
    }

    if (endCity) {
      filteredData = filteredData.filter((item) => item.endCity === endCity);
    }

    // if (tourType) {
    //   filteredData = filteredData.filter((item) => item.typeCombo === tourType);
    // }

    if (vehicle) {
      filteredData = filteredData.filter((item) => item.vehicle === vehicle);
    }
    setComboTour(filteredData);
  };
  const handleReset = () => {
    setBudget("");
    setCity("");
    setEndCity("");
    setVehicle("");
    setComboTour(allTours?.filter((item) => item.combo === true) || []);
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
  return (
    <>
      <div className="w-1240 w-375 pb-14 tour-combo">
        <div className="w-full flex justify-center">
          <div className="w-[1000px] text-center flex flex-col gap-4 ">
            <span
              style={{ textTransform: "uppercase" }}
              className="text-[28px] fw-bold text-[#276ca1]"
            >
              Combo Giá tốt tại Vietravel
            </span>
            <p className="text-left"></p>
          </div>
        </div>
        <Row className="w-full">
          <Col sm={3} className="flex flex-col gap-3">
            <div>
              <span className="fw-bold text-[20px]">BỘ LỌC TÌM KIẾM</span>
            </div>
            <form
              onSubmit={handleSubmit}
              className="sticky-sidebar formfilter  bg-slate-200 rounded-md p-3   flex flex-col gap-3"
            >
              <span>Ngân sách</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                    budget === "Dưới 5 triệu"
                      ? "bg-[#6b98bb] text-[#276ca1] outline outline-[#276ca1]"
                      : ""
                  }`}
                  onClick={() => setBudget("Dưới 5 triệu")}
                >
                  Dưới 5m
                </button>
                <button
                  type="button"
                  className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                    budget === "Từ 5 - 10 triệu"
                      ? "bg-[#6b98bb] text-[#276ca1]"
                      : ""
                  }`}
                  onClick={() => setBudget("Từ 5 - 10 triệu")}
                >
                  Từ 5 - 10m
                </button>
                <button
                  type="button"
                  className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                    budget === "Từ 10-20 triệu"
                      ? "bg-[#6b98bb] text-[#276ca1]"
                      : ""
                  }`}
                  onClick={() => setBudget("Từ 10-20 triệu")}
                >
                  Từ 10-20m
                </button>
                <button
                  type="button"
                  className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                    budget === "Trên 20 triệu"
                      ? "bg-[#6b98bb] text-[#276ca1]"
                      : ""
                  }`}
                  onClick={() => setBudget("Trên 20 triệu")}
                >
                  Trên 20m
                </button>
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
                <span>Phương tiện</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setVehicle("Xe")}
                    className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                      vehicle === "Xe" ? "bg-[#6b98bb] text-[#276ca1]" : ""
                    }`}
                  >
                    Xe
                  </button>
                  <button
                    onClick={() => setVehicle("Máy bay")}
                    className={`btn bg-white outline outline-[#dedede] hover:outline-[#276ca1] hover:bg-[#6b98bb] hover:text-[#276ca1] ${
                      vehicle === "Máy bay" ? "bg-[#6b98bb] text-[#276ca1]" : ""
                    }`}
                  >
                    Máy bay
                  </button>
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
          <Col sm={9}>
            <div className="flex flex-col gap-3">
              <div className="flex  justify-between items-center">
                <strong className="text-[18px]">
                  Chúng tôi tìm thấy{" "}
                  <strong className="text-[#276ca1] text-[24px]">
                    {comboTour.length}
                  </strong>{" "}
                  chương trình tour cho Quý khách
                </strong>
                <div className="flex justify-between items-center gap-3">
                  <strong className="text-[18px]">Sắp xếp theo</strong>
                  <Select
                    defaultValue="Giá từ thấp đến cao"
                    style={{
                      width: "max-content",
                    }}
                    onChange={handleChange}
                    options={[
                      {
                        value: "priceAsc",
                        label: "Giá từ thấp đến cao",
                      },
                      {
                        value: "priceDesc",
                        label: "Giá từ cao đến thấp",
                      },
                    ]}
                  />
                </div>
              </div>
              <hr />
              <div className="w-full">
                <CardCombo data={comboTour} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default TourCombos;
