import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../base/baseUrl";
import { Col, Row } from "react-bootstrap";
import {
  Input,
  Form,
  Select,
  DatePicker,
  Switch,
  Checkbox,
  message,
  Button,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaBaby } from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { BsCash } from "react-icons/bs";
import { BsBank } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlane } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { MdDiscount } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import moment from "moment";
import "./OrderBooking.css";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { clearTourCart } from "../../store/actions/cartActions";
const OrderBooking = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemData = useSelector((state) => state.item.selectedItem);
  const tokenUser = sessionStorage.getItem("emailUser");
  const [allUsers, setAllUsers] = useState([]);

  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  const toggleSummaryVisibility = () => {
    setIsSummaryVisible(!isSummaryVisible);
  };
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}auth/get-all-users`);
      setAllUsers(response?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const findUser = allUsers.find((item) => item.email === tokenUser);
  const userId = findUser?._id || user?.user?.uid;

  const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const nights = days - 1; // Nights are usually one less than the number of days

    return `${days}N${nights}Đ`;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { id } = useParams();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [checked, setChecked] = useState(false);

  const [allTours, setAllTours] = useState([]);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [baby, setBaby] = useState(0);
  const [checkBox, setCheckBox] = useState(false);
  const [tourDetail, setTourDetail] = useState([itemData]);
  const [selectedPayment, setSelectedPayment] = useState(null); // Track the selected payment method
  const [chooseSwitch, setChooseSwitch] = useState(false);

  const handleCheckboxChange = (paymentType) => {
    setSelectedPayment(paymentType); // Set the selected payment type
  };

  const onChangeCheckBox = (e) => {
    setCheckBox(e.target.checked);
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

  console.log(allTours);
  const pricePerRoom = 290000;
  const [switchStates, setSwitchStates] = useState(
    new Array(adult).fill(false)
  );
  const [applySale, setApplySale] = useState("");
  const handleApplySale = (values) => {
    if (!values.applySale) {
      message.error("Vui lòng nhập mã");
    } else {
      message.error("Mã không hợp lệ");
    }
  };

  const handleSwitchChange = (index, checked) => {
    const newSwitchStates = [...switchStates];
    newSwitchStates[index] = checked; // Update the state of the switch at the given index
    setSwitchStates(newSwitchStates);
  };

  const totalPrice = switchStates.reduce(
    (acc, isChecked) => (isChecked ? acc + pricePerRoom : acc),
    0
  );
  useEffect(() => {
    getAllTours();
    getAllUsers();
  }, []);
  const filterTour = allTours?.find((item) => item._id === id);
  const adultTotal = adult * itemData?.price.price;
  const childrenTotal =
    children >= 1 ? children * itemData?.price.priceChildren : 0;
  const babyTotal = baby >= 1 ? baby * itemData?.price.priceBaby : 0;
  const grandTotal = adultTotal + childrenTotal + babyTotal + totalPrice;

  const decrement = (setter, value, minValue = 0) => {
    if (value > minValue) {
      setter(value - 1);
    }
  };

  const increment = (setter, value, total) => {
    if (total < itemData?.slot) {
      setter(value + 1);
    } else {
      message.error(
        `Rất tiếc Tour hiện tại số chỗ còn nhận chỉ còn: ${itemData?.slot} chỗ`
      );
    }
  };
  const totalPeople = adult + children + baby;

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  const randomString = generateRandomString(20);

  const handleSubmit = async (e) => {
    const formData = {
      userId: userId,
      tourId: filterTour?._id,
      bookingId: randomString,
      fullName,
      phone,
      email,
      address,
      messageContent,
      selectedPayment,
      tourDetail: tourDetail,
      totalPrice: grandTotal,
      tourInfor: filterTour,
      passengers: {
        slotBaby: baby,
        slotChildren: children,
        slotAdult: adult,
      },
    };
    console.log(formData);

    try {
      const response = await axios.post(
        `${baseUrl}booking/add-booking`,
        formData
      );

      // message.success("Bạn đã đặt tour thành công!");

      navigate(`/payment-booking/${randomString}`);
      dispatch(clearTourCart());
      resetForm();
    } catch (error) {
      message.error("Bạn đã đặt tour thất bại!");
    }
  };

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setMessageContent("");
    setSelectedPayment(null);
    setTourDetail([]);
    setAdult(1);
    setChildren(0);
    setBaby(0);
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

  const [isShowDetail, setIsShowDetail] = useState(false);

  const clickShowDetail = () => {
    setIsShowDetail(!isShowDetail);
  };
  return (
    <>
      <div className={`w-1240 w-375 ${isMobile ? " " : "py-5"} `}>
        <div>
          <span
            className={`w-full block ${
              isMobile ? "mb-3" : "mb-5"
            }  text-[#276ca1] fw-bold text-[30px] text-center`}
          >
            ĐẶT TOUR
          </span>
          <Form onFinish={handleSubmit}>
            <Row>
              <Col sm={6}>
                <div className={`flex flex-col gap-4 ${isMobile ? "mb-56" : ""}`}>
                  <div className="flex flex-col gap-3">
                    <span className="fw-bold text-[20px]">
                      THÔNG TIN LIÊN LẠC
                    </span>
                    <div
                      className={` ${
                        isMobile ? "flex-col" : " "
                      } flex justify-between items-center gap-3`}
                    >
                      <div className="w-full">
                        <label className="fw-bold">Họ tên *</label>
                        <Input
                          placeholder="Nhập họ tên"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="fw-bold">Điện thoại *</label>
                        <Input
                          placeholder="Nhập điện thoại"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div
                      className={`flex justify-between gap-3 ${
                        isMobile ? "flex-col" : ""
                      }`}
                    >
                      <div className="w-full">
                        <label className="fw-bold">Email *</label>
                        <Input
                          placeholder="Nhập Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="w-full">
                        <label className="fw-bold">Địa chỉ *</label>
                        <Input
                          placeholder="Nhập địa chỉ"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="fw-bold text-[20px]">
                      SỐ LƯỢNG HÀNH KHÁCH
                    </span>
                    <div
                      className={` ${
                        isMobile
                          ? "flex flex-col gap-4"
                          : "grid grid-cols-2 gap-4"
                      }`}
                    >
                      <div className="flex w-full justify-between outline outline-black p-3 rounded-xl">
                        <div className="flex flex-col">
                          <span>Người lớn</span>
                          <span className="fw-bold">{adult}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => decrement(setAdult, adult)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              increment(setAdult, adult, totalPeople)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex w-full justify-between outline outline-black p-3 rounded-xl">
                        <div className="flex flex-col">
                          <span>Trẻ em</span>
                          <span className="fw-bold">{children}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => decrement(setChildren, children)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              increment(setChildren, children, totalPeople)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex w-full justify-between outline outline-black p-3 rounded-xl">
                        <div className="flex flex-col">
                          <span>Em bé</span>
                          <span className="fw-bold">{baby}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => decrement(setBaby, baby)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() =>
                              increment(setBaby, baby, totalPeople)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <Checkbox
                        onChange={onChangeCheckBox}
                        className="text-[18px]"
                      >
                        Tôi cần được nhân viên tư vấn Vietravel trợ giúp nhập
                        thông tin đăng ký dịch vụ.
                      </Checkbox>
                    </div>
                    {checkBox ? (
                      <div className="flex  items-center gap-3 bg-orange-100 p-3 rounded-xl">
                        <FaBell className="text-[23px] text-orange-500" />
                        <span>
                          Vietravel sẽ liên hệ Quý khách trong thời gian sớm
                          nhất để hỗ trợ. Quý khách vui lòng chú ý điện thoại và
                          email như đã đăng ký.
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="fw-bold text-[20px]">GHI CHÚ</span>
                    <p>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi</p>
                    <Input.TextArea
                      rows={4}
                      placeholder="Vui lòng nhập nội dung lời nhắn"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="fw-bold text-[20px]">
                      CÁCH THỨC THANH TOÁN
                    </span>
                    <div className="flex flex-col gap-4">
                      <div
                        className={`flex items-center justify-between outline p-3 rounded-md ${
                          selectedPayment === "cash"
                            ? "outline-[#276ca1]"
                            : "outline-gray-200"
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[18px]">Tiền mặt</span>
                            <BsCash className="text-[30px]" />
                          </div>
                          {selectedPayment === "cash" ? (
                            <div>
                              Quý khách vui lòng thanh toán tại bất kỳ văn phòng
                              Vietravel trên toàn quốc và các chi nhánh tại nước
                              ngoài.{" "}
                              <Link className="text-blue-700" to="/">
                                Xem chi tiết
                              </Link>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <Checkbox
                          checked={selectedPayment === "cash"} // Only checked if selectedPayment is 'cash'
                          onChange={() => handleCheckboxChange("cash")}
                        />
                      </div>

                      <div
                        className={`flex items-center justify-between outline p-3 rounded-md ${
                          selectedPayment === "bank"
                            ? "outline-[#276ca1]"
                            : "outline-gray-200"
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[18px]">Chuyển khoản</span>
                            <BsBank className="text-[30px]" />
                          </div>
                          {selectedPayment === "bank" ? (
                            <div className="flex flex-col">
                              <p>
                                Quý khách sau khi thực hiện việc chuyển khoản
                                vui lòng gửi email đến tructuyen@vietravel.com
                                hoặc gọi tổng đài 19001839 để được xác nhận từ
                                công ty chúng tôi.
                              </p>
                              <p>
                                Tên Tài Khoản : Công ty CP Du lịch và Tiếp thị
                                GTVT Việt Nam – Vietravel
                              </p>
                              <p>-------------------------</p>
                              <p>Số Tài khoản : 190261 6659 4669</p>
                              <p>Ngân hàng : Techcombank - Chi nhánh Tp.HCM</p>
                              <p>-------------------------</p>
                              <p>Số Tài khoản : 1116 9772 7979</p>
                              <p>Ngân hàng : Vietinbank - Chi nhánh 7</p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <Checkbox
                          checked={selectedPayment === "bank"}
                          onChange={() => handleCheckboxChange("bank")}
                        />
                      </div>

                      <div
                        className={`flex items-center justify-between outline p-3 rounded-md ${
                          selectedPayment === "momo"
                            ? "outline-[#276ca1]"
                            : "outline-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[18px]">
                            Thanh toán bằng Momo
                          </span>
                          <img
                            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                            alt=""
                            className="w-[35px] object-cover"
                          />
                        </div>
                        <Checkbox
                          checked={selectedPayment === "momo"} // Only checked if selectedPayment is 'momo'
                          onChange={() => handleCheckboxChange("momo")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="fw-bold text-[20px] uppercase">
                      Điều khoản bắt buộc khi đăng ký online
                    </span>
                    <div>
                      <div className="h-[400px] rounded-xl overflow-y-scroll p-3 text-justify bg-gray-200">
                        <div>
                          <h1 className="fw-bold">
                            ĐIỀU KHOẢN THỎA THUẬN SỬ DỤNG DỊCH VỤ DU LỊCH NƯỚC
                            NGOÀI
                          </h1>
                          <p>
                            Quý khách cần đọc những điều khoản dưới đây trước
                            khi đăng ký và trải nghiệm dịch vụ do Vietravel tổ
                            chức. Việc Quý khách tiếp tục sử dụng trang web này
                            xác nhận việc Quý khách đã chấp thuận và tuân thủ
                            những điều khoản dưới đây.
                          </p>

                          <h2 className="fw-bold">
                            Nội dung dưới đây gồm có 02 phần:
                          </h2>
                          <ul>
                            <li>
                              <strong>Phần I:</strong> Điều kiện bán vé các
                              chương trình du lịch nước ngoài
                            </li>
                            <li>
                              <strong>Phần II:</strong> Chính sách bảo vệ dữ
                              liệu cá nhân
                            </li>
                          </ul>
                          <p>Chi tiết nội dung như sau:</p>

                          <h2 className="fw-bold">
                            PHẦN I: ĐIỀU KIỆN BÁN VÉ CÁC CHƯƠNG TRÌNH DU LỊCH
                            NƯỚC NGOÀI
                          </h2>

                          <h3 className="fw-bold">1. GIÁ VÉ DU LỊCH</h3>
                          <p>
                            Giá vé du lịch được tính theo tiền Đồng (Việt Nam -
                            VNĐ). Trường hợp khách thanh toán bằng ngoại tệ sẽ
                            được quy đổi ra VNĐ theo tỉ giá của ngân hàng Đầu Tư
                            và Phát Triển Việt Nam – Chi nhánh TP.HCM tại thời
                            điểm thanh toán.
                          </p>
                          <p>
                            Giá vé chỉ bao gồm những khoản được liệt kê một cách
                            rõ ràng trong phần “Bao gồm” trong các chương trình
                            du lịch. Vietravel không có nghĩa vụ thanh toán bất
                            cứ chi phí nào không nằm trong phần “Bao gồm”.
                          </p>

                          <h3 className="fw-bold">2. GIÁ DÀNH CHO TRẺ EM</h3>
                          <ul>
                            <li>
                              Trẻ em dưới 2 tuổi: 30% trên giá vé du lịch.
                            </li>
                            <li>
                              Trẻ em từ 2 đến dưới 12 tuổi: Từ 75%-100% (tùy
                              theo chính sách của hãng hàng không hoặc phòng lưu
                              trú của từng chương trình tour du lịch) trên Vé du
                              lịch. Hai người lớn chỉ được kèm 01 trẻ em, em thứ
                              hai trở lên sẽ mua thêm xuất giường đơn.
                            </li>
                            <li>
                              Trẻ em từ 12 tuổi trở lên, mua một vé như người
                              lớn.
                            </li>
                            <li>
                              Vé máy bay, xe lửa, phương tiện vận chuyển công
                              cộng: mua theo quy định của các đơn vị vận chuyển
                              này.
                            </li>
                          </ul>
                          <p>
                            <em>Lưu ý:</em> Giá Vé du lịch trẻ em chưa bao gồm:
                            Chế độ ngủ giường riêng.
                          </p>

                          <h3 className="fw-bold">3. THANH TOÁN</h3>
                          <p>
                            Khi đăng ký, Quý khách vui lòng cung cấp đầy đủ
                            thông tin và đóng một khoản tiền cọc để giữ chỗ. Số
                            tiền cọc khác nhau tùy theo chương trình mà Quý
                            khách chọn, số tiền còn lại sẽ thanh toán trước ngày
                            khởi hành tối thiểu 05 ngày làm việc.
                          </p>
                          <p>
                            Thanh toán bằng tiền mặt, cà thẻ tại văn phòng
                            Vietravel hoặc chuyển khoản tới tài khoản ngân hàng
                            của Vietravel.
                          </p>

                          <ul>
                            <li>
                              <strong>Tên Tài Khoản:</strong> Công ty CP Du lịch
                              và Tiếp thị GTVT Việt Nam – Vietravel
                            </li>
                            <li>
                              <strong>Số Tài khoản:</strong> 190261 6659 4669
                            </li>
                            <li>
                              <strong>Ngân hàng:</strong> Techcombank - Chi
                              nhánh Tp.HCM
                            </li>
                            <li>
                              <strong>Số Tài khoản:</strong> 1116 9772 7979
                            </li>
                            <li>
                              <strong>Ngân hàng:</strong> Vietinbank - Chi nhánh
                              7
                            </li>
                          </ul>

                          <p>
                            Việc thanh toán được xem là hoàn tất khi Vietravel
                            nhận được đủ tiền trị giá chuyến đi trước lúc khởi
                            hành hoặc theo hợp đồng thỏa thuận giữa hai bên. Bất
                            kỳ mọi sự thanh toán chậm trễ dẫn đến việc hủy dịch
                            vụ không thuộc trách nhiệm của Vietravel.
                          </p>

                          <h3 className="fw-bold">
                            4. HỦY VÉ VÀ PHÍ HỦY VÉ DU LỊCH
                          </h3>
                          <h4 className="fw-bold">
                            4.1. Trường hợp bị hủy bỏ do Vietravel:
                          </h4>
                          <p>
                            Nếu Vietravel không thực hiện được chuyến du lịch,
                            Vietravel phải báo ngay cho khách hàng biết và thanh
                            toán lại cho khách hàng toàn bộ số tiền khách hàng
                            đã đóng trong vòng 03 ngày kể từ lúc việc thông báo
                            hủy chuyến du lịch.
                          </p>

                          <h4 className="fw-bold">
                            4.2. Trường hợp bị hủy bỏ do khách hàng:
                          </h4>
                          <p>
                            Sau khi đóng tiền, nếu Quý khách muốn chuyển/hủy
                            tour xin vui lòng mang Vé Du Lịch đến văn phòng đăng
                            ký tour để làm thủ tục chuyển/hủy tour và chịu mất
                            phí theo quy định của Vietravel.
                          </p>

                          <h4 className="fw-bold">
                            4.3. Trường hợp bất khả kháng:
                          </h4>
                          <p>
                            Nếu chương trình du lịch bị hủy bỏ hoặc thay đổi bởi
                            lý do bất khả kháng (hỏa hoạn, thời tiết, tai nạn,
                            thiên tai, chiến tranh, dịch bệnh...) thì Vietravel
                            sẽ không chịu bất kỳ trách nhiệm pháp lý nào.
                          </p>

                          <h4 className="fw-bold">4.4. Thay đổi lộ trình:</h4>
                          <p>
                            Tùy theo tình hình thực tế, Vietravel giữ quyền thay
                            đổi lộ trình, sắp xếp lại thứ tự các điểm tham quan
                            hoặc hủy bỏ chuyến đi vì sự thuận tiện hoặc an toàn
                            cho khách hàng.
                          </p>

                          <h3 className="fw-bold">
                            5. NHỮNG YÊU CẦU ĐẶC BIỆT TRONG CHUYẾN DU LỊCH
                          </h3>
                          <p>
                            Các yêu cầu đặc biệt của Quý khách phải được báo
                            trước cho Vietravel ngay tại thời điểm đăng ký.
                            Vietravel sẽ cố gắng đáp ứng những yêu cầu này trong
                            khả năng của mình nhưng không chịu trách nhiệm về
                            bất kỳ sự từ chối cung cấp dịch vụ từ các nhà cung
                            cấp dịch vụ.
                          </p>

                          <h3 className="fw-bold">6. LƯU TRÚ</h3>
                          <p>
                            Phòng khách sạn được cung cấp theo yêu cầu của Quý
                            khách và khả năng cung ứng của nơi lưu trú. Loại
                            phòng cơ bản có hai giường đơn hoặc một giường đôi
                            tùy theo cơ cấu phòng của các khách sạn.
                          </p>

                          <h3 className="fw-bold">7. VẬN CHUYỂN</h3>
                          <p>
                            Với chương trình đi bằng xe: xe máy lạnh sẽ được
                            Vietravel sắp xếp tùy theo số lượng khách từng đoàn.
                          </p>
                          <p>
                            Với chương trình đi bằng xe lửa, máy bay, tàu cánh
                            ngầm: giờ khởi hành có thể thay đổi mà không báo
                            trước.
                          </p>

                          <h3 className="fw-bold">8. HÀNH LÝ</h3>
                          <p>
                            Đối với các chương trình sử dụng dịch vụ hàng không,
                            hành lý miễn cước sẽ áp dụng theo quy định của các
                            hãng hàng không.
                          </p>

                          <h3 className="fw-bold">9. BẢO HIỂM DU LỊCH</h3>
                          <p>
                            Giá dịch vụ du lịch trọn gói đã bao gồm bảo hiểm du
                            lịch nước ngoài với mức đền bù lên đến 460.000.000
                            VNĐ/người/vụ cho nhân mạng và 28.600.000
                            VNĐ/người/vụ cho hành lý.
                          </p>

                          <h3 className="fw-bold">10. CAM KẾT VỀ SỨC KHỎE</h3>
                          <p>
                            Khách hàng và người thân cùng tham gia tour phải đảm
                            bảo hoàn toàn đủ sức khỏe khi đi du lịch theo chương
                            trình.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Checkbox onChange={onChangeCheckBox} className="text-[18px]">
                    Tôi đồng ý với Chính sách bảo vệ dữ liệu cá nhân và các điều
                    khoản trên.
                  </Checkbox>
                </div>
              </Col>
              {isMobile ? (
                <div className="fixed bottom-0 right-0 left-0 bsd flex flex-col gap-3 bg-white z-50 rounded-t-xl p-3">
                  <div className="flex flex-col gap-2">
                    <div
                      onClick={clickShowDetail}
                      className="flex justify-between items-center"
                    >
                      <span className="fw-bold text-[14px] uppercase">
                        Tóm tắt chuyến đi
                      </span>
                      <FaChevronDown />
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <MdDiscount />
                        <strong className="uppercase">Mã giảm giá</strong>
                      </div>
                      <div
                        onClick={showModal}
                        className="flex gap-2 items-center"
                      >
                        <CiCirclePlus className="text-red-500" />
                        <span className="text-red-500">Nhập mã giảm giá</span>
                      </div>
                      <Modal
                        title="Sử dụng mã giảm giá"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                        centered
                      >
                        <Form onFinish={handleApplySale} className="flex gap-3">
                          <Form.Item className="w-full" name="applySale">
                            <Input
                              placeholder="Nhập mã"
                              value={applySale}
                              onChange={(e) => setApplySale(e.target.value)}
                            />
                          </Form.Item>
                          <Button
                            htmlType="submit"
                            className="bg-[#276ca1] text-white"
                          >
                            Sử dụng
                          </Button>
                        </Form>
                        <p>* Đã hiển thị hết mã ưu đãi bạn có thể sử dụng</p>
                      </Modal>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <strong className="uppercase">Tổng tiền</strong>
                      <span className="text-red-500 text-[28px] fw-bold">
                        {grandTotal}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="bg-[#276ca1] rounded-md text-white p-2"
                    >
                      ĐẶT TOUR
                    </button>
                  </div>
                  {isShowDetail && (
                    <div className="flex flex-col absolute bg-white bsd w-full   left-0 right-0 p-3 gap-3 rounded-t-xl bottom-0">
                      <div
                        onClick={() => setIsShowDetail(false)}
                        className="flex justify-between items-center"
                      >
                        <span className="fw-bold text-[14px] uppercase">
                          Tóm tắt chuyến đi
                        </span>
                        <FaChevronUp />
                      </div>
                      <div className="flex gap-3">
                        <img
                          src={filterTour?.images[0]}
                          alt=""
                          className="h-[150px] w-[250px] rounded-lg object-cover "
                        />
                        <div>
                          <strong className="clamped-text-bookingtour">
                            {filterTour?.title}
                          </strong>
                          <p>Mã tour: {filterTour?._id}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="flex gap-5">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt /> Khởi hành:{" "}
                          <span className="text-[#276ca1]">
                            {filterTour?.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt /> Thời gian:{" "}
                          <span className="text-[#276ca1]">
                            {calculateDaysAndNights(
                              itemData?.time.startDate,
                              itemData?.time.endDate
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <FaPlane />
                          <strong className="uppercase">
                            Thông tin chuyến bay
                          </strong>
                        </div>
                        <div>
                          <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                              <div>
                                <span>
                                  <strong>Ngày đi</strong> -{" "}
                                  {itemData?.time?.startDate}
                                </span>
                              </div>
                              <div>
                                <div className="flex flex-col gap-2">
                                  <div className="flex justify-between">
                                    <span>
                                      {itemData?.fightTime?.startTime}
                                    </span>
                                    <span>{itemData?.fightTime?.endTime}</span>
                                  </div>
                                  <div className="w-full h-[2px] bg-gray-300"></div>
                                  <div className="flex justify-between">
                                    <span>{filterTour?.city}</span>
                                    <span>{filterTour?.endCity}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div>
                                <span>
                                  <strong>Ngày về</strong> -{" "}
                                  {itemData?.time?.endDate}
                                </span>
                              </div>
                              <div className="">
                                <div className="flex flex-col gap-2">
                                  <div className="flex justify-between">
                                    <span>
                                      {itemData?.fightBackTime?.startBackTime}
                                    </span>
                                    <span>
                                      {itemData?.fightBackTime?.endBackTime}
                                    </span>
                                  </div>
                                  <div className="w-full h-[2px] bg-gray-300"></div>
                                  <div className="flex justify-between flex-row-reverse">
                                    <span>{filterTour?.city}</span>
                                    <span>{filterTour?.endCity}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FaUserFriends />
                            <strong className="uppercase">
                              Khách hàng + Phụ thu
                            </strong>
                          </div>
                          <span className="text-red-500 text-[28px]">
                            {grandTotal}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between items-center">
                            <span>Người lớn</span>
                            <span>
                              {adult} x {itemData?.price.price}
                            </span>
                          </div>
                          {children >= 1 ? (
                            <div className="flex justify-between items-center">
                              <span>Trẻ em</span>
                              <span>
                                {children} x {itemData?.price.priceChildren}
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                          {baby >= 1 ? (
                            <div className="flex justify-between items-center">
                              <span>Em bé</span>
                              <span>
                                {baby} x {itemData?.price.priceBaby}
                              </span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Col sm={6}>
                  <div className=" sticky-sidebar-order flex flex-col gap-3 ">
                    <span className="fw-bold text-[20px] uppercase">
                      Tóm tắt chuyến đi
                    </span>
                    <div className="bg-gray-100 p-3 rounded-xl">
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-3">
                          <img
                            src={filterTour?.images[0]}
                            alt=""
                            className="h-[150px] w-[250px] rounded-lg object-cover "
                          />
                          <div>
                            <strong className="clamped-text-bookingtour">
                              {filterTour?.title}
                            </strong>
                            <p>Mã tour: {filterTour?._id}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="flex gap-5">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt /> Khởi hành:{" "}
                            <span className="text-[#276ca1]">
                              {filterTour?.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt /> Thời gian:{" "}
                            <span className="text-[#276ca1]">
                              {calculateDaysAndNights(
                                itemData?.time.startDate,
                                itemData?.time.endDate
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <FaPlane />
                            <strong className="uppercase">
                              Thông tin chuyến bay
                            </strong>
                          </div>
                          <div>
                            <div className="grid grid-cols-2 gap-5">
                              <div className="flex flex-col gap-2">
                                <div>
                                  <span>
                                    <strong>Ngày đi</strong> -{" "}
                                    {itemData?.time?.startDate}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                      <span>
                                        {itemData?.fightTime?.startTime}
                                      </span>
                                      <span>
                                        {itemData?.fightTime?.endTime}
                                      </span>
                                    </div>
                                    <div className="w-full h-[2px] bg-gray-300"></div>
                                    <div className="flex justify-between">
                                      <span>{filterTour?.city}</span>
                                      <span>{filterTour?.endCity}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div>
                                  <span>
                                    <strong>Ngày về</strong> -{" "}
                                    {itemData?.time?.endDate}
                                  </span>
                                </div>
                                <div className="">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                      <span>
                                        {itemData?.fightBackTime?.startBackTime}
                                      </span>
                                      <span>
                                        {itemData?.fightBackTime?.endBackTime}
                                      </span>
                                    </div>
                                    <div className="w-full h-[2px] bg-gray-300"></div>
                                    <div className="flex justify-between flex-row-reverse">
                                      <span>{filterTour?.city}</span>
                                      <span>{filterTour?.endCity}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr />
                        <div className="flex flex-col">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <FaUserFriends />
                              <strong className="uppercase">
                                Khách hàng + Phụ thu
                              </strong>
                            </div>
                            <span className="text-red-500 text-[28px]">
                              {grandTotal}
                            </span>
                          </div>
                          <div>
                            <div className="flex justify-between items-center">
                              <span>Người lớn</span>
                              <span>
                                {adult} x {itemData?.price.price}
                              </span>
                            </div>
                            {children >= 1 ? (
                              <div className="flex justify-between items-center">
                                <span>Trẻ em</span>
                                <span>
                                  {children} x {itemData?.price.priceChildren}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            {baby >= 1 ? (
                              <div className="flex justify-between items-center">
                                <span>Em bé</span>
                                <span>
                                  {baby} x {itemData?.price.priceBaby}
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <MdDiscount />
                            <strong className="uppercase">Mã giảm giá</strong>
                          </div>
                          <div
                            onClick={showModal}
                            className="flex gap-2 items-center"
                          >
                            <CiCirclePlus className="text-red-500" />
                            <span className="text-red-500">
                              Nhập mã giảm giá
                            </span>
                          </div>
                          <Modal
                            title="Sử dụng mã giảm giá"
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            footer={null}
                            centered
                          >
                            <Form
                              onFinish={handleApplySale}
                              className="flex gap-3"
                            >
                              <Form.Item className="w-full" name="applySale">
                                <Input
                                  placeholder="Nhập mã"
                                  value={applySale}
                                  onChange={(e) => setApplySale(e.target.value)}
                                />
                              </Form.Item>
                              <Button
                                htmlType="submit"
                                className="bg-[#276ca1] text-white"
                              >
                                Sử dụng
                              </Button>
                            </Form>
                            <p>
                              * Đã hiển thị hết mã ưu đãi bạn có thể sử dụng
                            </p>
                          </Modal>
                        </div>
                        <hr />
                        <div className="flex justify-between items-center">
                          <strong className="uppercase">Tổng tiền</strong>
                          <span className="text-red-500 text-[28px] fw-bold">
                            {grandTotal}
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#276ca1] rounded-md text-white p-2"
                        >
                          ĐẶT TOUR
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default OrderBooking;
