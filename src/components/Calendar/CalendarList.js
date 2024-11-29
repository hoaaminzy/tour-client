import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Badge, Calendar } from "antd";
import dayjs from "dayjs";
import "./CalendarList.css";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

const getListData = (value, data) => {
  const dateString = value.format("YYYY-MM-DD");

  const matchingData = data?.inforTourDetail?.filter(
    (item) => item.time.startDate === dateString
  );

  const listData = matchingData?.map((item) => ({
    type: "success",
    content: item,
  }));

  return listData;
};

const CalendarList = forwardRef((props, ref) => {
  // Corrected usage of forwardRef
  const calendarRef = useRef(null);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    handleFocusCalendar: () => {
      if (calendarRef.current) {
        calendarRef.current.focus(); // Change to calendarRef
      }
    },
  }));

  const { data } = props;
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedItem, setSelectedItem] = useState(null); // State để lưu đối tượng đã chọn

  const listData = getListData(selectedMonth, data);

  const handleContentClick = (item) => {
    setSelectedItem(item);
    sessionStorage.setItem("selectedItem", JSON.stringify(item)); // Lưu vào sessionStorage
    dispatch({ type: "SET_SELECTED_ITEM", payload: item });
  };

  const handleClearClick = () => {
    setSelectedItem(null);
    sessionStorage.removeItem("selectedItem");
    dispatch({ type: "CLEAR_SELECTED_ITEM" });
  };
  const dateCellRender = (value) => {
    const listData = getListData(value, data);
    return (
      <ul className="events">
        {listData?.map((item, index) => (
          <li key={index}>
            <Badge
              status={item.type}
              text={
                <span
                  onClick={() => handleContentClick(item.content)}
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  {item.content.price.price}K
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const handleMonthClick = (monthIndex) => {
    setSelectedMonth(selectedMonth.month(monthIndex));
  };

  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

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
    <div className="calendar-container">
      <div className={` ${isMobile ? "flex-col" : ""} w-full flex gap-3`}>
        <div>
          <div
            className={`month-list  flex ${
              isMobile ? "w-full" : "flex-col h-[805px]"
            }  gap-3 rounded-xl`}
            style={{ boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" }}
          >
            <span
              className={` ${
                isMobile ? "text-[13px] justify-center items-center flex" : ""
              } text-center block uppercase text-[#276ca1] fw-bold`}
            >
              Chọn tháng
            </span>
            <ul
              className={`h-full overflow-y-scroll ${isMobile ? "flex" : ""}`}
            >
              {months.map((month, index) => (
                <li
                  key={month}
                  style={{ padding: "20px", textAlign: "center" }}
                  className={index === selectedMonth.month() ? "selected" : ""}
                  onClick={() => handleMonthClick(index)}
                >
                  {month}/{selectedMonth.format("YYYY")}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full" ref={calendarRef}>
          <div
            className="calendar-content w-full rounded-xl"
            style={{ boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" }}
          >
            {selectedItem ? (
              <div className="flex w-full flex-col gap-3">
                {/* Render selected item details */}
                <div className="flex flex-col gap-3">
                  <span className="text-center block text-[#276ca1] fw-bold">
                    Phương tiện di chuyển
                  </span>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <div>
                        <span>
                          <strong>Ngày đi</strong> -{" "}
                          {selectedItem?.time?.startDate}
                        </span>
                      </div>
                      <div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span>{selectedItem?.fightTime?.startTime}</span>
                            <span>{selectedItem?.fightTime?.endTime}</span>
                          </div>
                          <div className="w-full h-[2px] bg-gray-300"></div>
                          <div className="flex justify-between">
                            <span>{selectedItem?.city}</span>
                            <span>{selectedItem?.endCity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <span>
                          <strong>Ngày về</strong> -{" "}
                          {selectedItem?.time?.endDate}
                        </span>
                      </div>
                      <div className="">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span>
                              {selectedItem?.fightBackTime?.startBackTime}
                            </span>
                            <span>
                              {selectedItem?.fightBackTime?.endBackTime}
                            </span>
                          </div>
                          <div className="w-full h-[2px] bg-gray-300"></div>
                          <div className="flex justify-between flex-row-reverse">
                            <span>{selectedItem?.city}</span>
                            <span>{selectedItem?.endCity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="text-center block text-[#276ca1] fw-bold">
                    Giá tour
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between">
                        <strong>Người lớn</strong>
                        <span className="text-red-500 fw-bold">
                          {selectedItem?.price.price} đ
                        </span>
                      </div>
                      <span className="text-[14px]">Từ 12 tuổi trở lên</span>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <strong>Em bé</strong>
                        <span className="text-red-500 fw-bold">
                          {selectedItem?.price.priceBaby} đ
                        </span>
                      </div>
                      <span className="text-[14px]">(Dưới 2 tuổi)</span>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <strong>Trẻ em</strong>
                        <span className="text-red-500 fw-bold">
                          {selectedItem?.price.priceChildren} đ
                        </span>
                      </div>
                      <span className="text-[14px]">Từ 5 đến 11 tuổi</span>
                    </div>
                  </div>
                </div>
                {data.combo === true ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-center block text-[#276ca1] fw-bold">
                      Giá khách sạn
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between">
                          <strong>Giá phòng</strong>
                          <span className="text-red-500 fw-bold">
                            {selectedItem?.price.price} đ / 1 người
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <button className="btn btn-danger" onClick={handleClearClick}>
                  Chọn ngày khác
                </button>
              </div>
            ) : (
              <div>
                <div className={` ${isMobile ? "text-[22px]" :""} selected-month-year`}>
                  {`Tháng ${selectedMonth.format(
                    "M"
                  )} Năm ${selectedMonth.format("YYYY")}`}
                </div>
                <div className="calendar">
                  <Calendar value={selectedMonth} cellRender={cellRender} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default CalendarList;
