import React, { useEffect, useRef, useState } from "react";
import "./Infor.css";
import { Col, Row } from "react-bootstrap";
import { DeleteOutlined } from "@ant-design/icons";

import {
  Tabs,
  Form,
  Input,
  Button,
  Space,
  Table,
  Popconfirm,
  Modal,
  message,
} from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import axios from "axios";
import { baseUrl, baseUrlImage } from "../../base/baseUrl";
import formatDate from "../../utils/formatDate";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlane } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import UpdateBookingForm from "../../components/UpdateBookingForm/UpdateBookingForm";
const Infor = ({ user }) => {
  const tokenUser = sessionStorage.getItem("emailUser");
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}auth/get-all-users`);
        const users = response?.data;
        setAllUsers(users);
        console.log("Users fetched successfully:", users);
        return users;
      } catch (error) {
        console.error("Error fetching tours:", error);
        throw error;
      }
    };
    getAllUsers();
  }, []);
  const filterUserInfor = allUsers.find((item) => item?.email === tokenUser);
  const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const nights = days - 1; // Nights are usually one less than the number of days

    return `${days}N${nights}Đ`;
  };
  const [tabPosition, setTabPosition] = useState("left");
  const [activeTabKey, setActiveTabKey] = useState("1"); // State to track the active tab
  const [form] = Form.useForm(); // Create AntD form instance
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  const [users, setUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allTours, setAllTours] = useState([]);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  };

  const handleViewDetail = (tour) => {
    setSelectedTour(tour);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTour(null);
  };

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

  const [userInfo, setUserInfo] = useState({
    name: user?.displayNamename,
    email: user?.email,
    phone: user?.phomeNumber,
  });

  const fetchAllUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => doc.data());
      setUsers(userList);
      return userList;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
  useEffect(() => {
    getAllBookings();
    fetchAllUsers();
  }, []);

  const updatedDataAllBooking = allBookings.map((booking) => {
    const matchingTour = allTours.find((tour) => tour._id === booking.tourId);

    if (matchingTour) {
      // Kiểm tra nếu tourInfor chưa chứa matchingTour thì mới thêm vào
      const isTourAlreadyAdded = booking.tourInfor.some(
        (tour) => tour._id === matchingTour._id
      );

      if (!isTourAlreadyAdded) {
        booking.tourInfor.push(matchingTour);
      }
    }

    return booking;
  });

  const userId = user?.uid || filterUserInfor?._id;

  const filterPaymentUser = updatedDataAllBooking?.filter(
    (item) => item?.userId === userId
  );

  const handlePayment = async (record) => {
    try {
      const response = await axios.post(`${baseUrlImage}payment`, {
        totalPrice: record.totalPrice,
        bookingId: record.bookingId,
        userId: userId,
        user: {
          name: record.fullName,
          address: record.address,
          numberphone: record.phone,
          email: record.email,
        },
        inforTour: record.tourId,
      });

      const data = response.data;
      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        console.error("Payment initiation failed", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUpdate = (updatedRecord) => {
    axios
      .put(
        `${baseUrl}booking/update-bookinged-detail/${updatedRecord._id}`,
        updatedRecord
      )
      .then((response) => {
        message.success("cập nhập thành công");
        window.location.reload();
        navigate("/thong-tin-ca-nhan");
      })

      .catch((error) => {
        console.error("Error updating booking:", error);
      });
  };
  const handleCancelTour = async (record) => {
    try {
      const response = await axios.delete(
        `${baseUrl}booking/cancel-tour/${record?._id}`
      );
      if (response.status === 200) {
        message.success("Tour đã được hủy");

        setAllBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== record._id)
        );
      }
    } catch (error) {
      console.error("Lỗi khi hủy tour:", error);
      message.error(
        error.response
          ? error.response.data.message
          : "Có lỗi xảy ra khi hủy tour."
      );
    }
  };

  const [isModalVisibleModal, setIsModalVisibleModal] = useState(false); // Modal visibility state
  const [modalContent, setModalContent] = useState(null); // Content inside the modal

  const showModal = (content) => {
    setModalContent(content); // Set modal content dynamically
    setIsModalVisibleModal(true); // Show modal
  };

  const handleOkModal = () => {
    setIsModalVisibleModal(false); // Hide modal on confirm
  };

  const handleCancelModal = () => {
    setIsModalVisibleModal(false); // Hide modal on cancel
  };
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1, // Displays the row number
    },
    {
      title: "Tên",
      dataIndex: "fullName", // Lấy tên từ đối tượng user
      key: "name",
      width: "100%",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address", // Lấy địa chỉ từ đối tượng user
      key: "address",
      width: "100%",
      align: "center",
      sorter: (a, b) => a?.address.length - b?.address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone", // Lấy số điện thoại từ đối tượng user
      key: "numberphone",
      width: "100%",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "100%",
      align: "center",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "selectedPayment",
      key: "orderId",
      width: "100%",
      align: "center",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "bookingId",
      key: "bookingId",
      width: "100%",
      align: "center",
    },
    {
      title: "Mã tour",
      dataIndex: "tourId",
      key: "tourId",
      width: "100%",
      align: "center",
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice", // Tổng giá
      key: "totalPrice",
      width: "100%",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status", // Trạng thái
      key: "status",
      width: "100%",
      align: "center",
      filters: [
        {
          text: "Chờ xác nhận",
          value: "Chờ xác nhận",
        },
        {
          text: "Thanh toán thành công",
          value: "Thanh toán thành công", // Giá trị trong dữ liệu
        },
        {
          text: "Xác nhận đơn đặt",
          value: "Xác nhận đơn đặt", // Giá trị trong dữ liệu
        },
        {
          text: "Đã hoàn thành tour",
          value: "Đã hoàn thành tour", // Giá trị trong dữ liệu
        },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (text) => {
        let color;
        if (text === "Chờ xác nhận") {
          color = "red"; // Màu cho trạng thái "Chờ xác nhận"
        } else if (text === "Thanh toán thành công") {
          color = "green"; // Màu cho trạng thái "Thanh toán thành công"
        } else if (text === "Đã hoàn thành tour") {
          color = "blue";
        } else if (text === "Xác nhận đơn đặt") {
          color = "orange";
        } else if (text === "Đang hoạt động") {
          color = "violet";
        } else {
          color = "black";
        }
        return <span style={{ color }}>{text}</span>; // Trả về văn bản với màu sắc đã chọn
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt", // Ngày tạo
      key: "createdAt",
      width: "100%",
      align: "center",

      render: (text) => formatDate(text),
    },

    {
      title: "Xem chi tiết",
      dataIndex: "Xem chi tiết",
      key: "Xem chi tiết",
      width: "100%",
      render: (_, record) => (
        <Button onClick={() => handleViewDetail(record)}>Xem chi tiết</Button>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "Thanh toán",
      key: "Thanh toán",
      width: "100%",
      render: (_, record) =>
        record.status === "Xác nhận đơn đặt" ? (
          record.selectedPayment === "momo" ? (
            <Button
              className="outline-none border-none w-max p-1 rounded-md text-white bg-red-500"
              onClick={() => handlePayment(record)}
            >
              Thanh toán ngay
            </Button>
          ) : record.selectedPayment === "bank" ? (
            <Button
              className="outline-none border-none w-max p-1 rounded-md text-white bg-red-500"
              onClick={() =>
                showModal(
                  <div className="flex flex-col">
                    <p>
                      Quý khách sau khi thực hiện việc chuyển khoản vui lòng gửi
                      email đến tructuyen@vietravel.com hoặc gọi tổng đài
                      19001839 để được xác nhận từ công ty chúng tôi.
                    </p>
                    <p>
                      Tên Tài Khoản : Công ty CP Du lịch và Tiếp thị GTVT Việt
                      Nam – Vietravel
                    </p>
                    <p>-------------------------</p>
                    <p>Số Tài khoản : 190261 6659 4669</p>
                    <p>Ngân hàng : Techcombank - Chi nhánh Tp.HCM</p>
                    <p>-------------------------</p>
                    <p>Số Tài khoản : 1116 9772 7979</p>
                    <p>Ngân hàng : Vietinbank - Chi nhánh 7</p>
                  </div>
                )
              }
            >
              Chuyển khoản
            </Button>
          ) : (
            <Button
              onClick={() =>
                showModal(
                  <div className="flex flex-col">
                    <ul>
                      <strong>Trụ sở chính:</strong>
                      <li>
                        Địa chỉ: 190 Pasteur, Phường Võ Thị Sáu, Quận 3, TP. Hồ
                        Chí Minh, Việt Nam.
                      </li>
                      <li>Điện thoại: (84-28) 38 668 999 (20 lines).</li>
                      <li>Fax: (84-28) 38 29 9142.</li>
                    </ul>
                    <ul>
                      <strong>Chi nhánh trong nước:</strong>
                      <li>
                        <ul>
                          <strong>Hà Nội:</strong>
                          <li>
                            Văn phòng du lịch khách lẻ: 03 Hai Bà Trưng, Hà Nội.
                          </li>
                          <li>
                            Văn phòng du lịch khách đoàn: Tầng 7, tòa nhà Hồng
                            Hà, số 37 Ngô Quyền, Hà Nội.
                          </li>
                          <li>Điện thoại: (84-24) 3933 1978.</li>
                          <li>Fax: (84-24) 3933 1979.</li>
                        </ul>
                      </li>
                      <li>
                        <ul>
                          <strong>Quảng Ninh:</strong>
                          <li>
                            Địa chỉ: 18 Đường 25/4, Phường Bạch Đằng, TP. Hạ
                            Long, Quảng Ninh.
                          </li>
                          <li>Điện thoại: (84-203) 6262 266.</li>
                          <li>Hotline: 0911 67 65 88.</li>
                          <li>Fax: (84-203) 6262 255.</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                )
              }
              className="outline-none border-none w-max p-1 rounded-md text-white bg-red-500"
            >
              Tiền mặt{" "}
            </Button>
          )
        ) : record.status === "Thanh toán thành công" ? (
          <div className="w-max p-1 rounded-md text-white bg-green-500">
            Thành công
          </div>
        ) : record.status === "Đã hoàn thành tour" ? (
          <div className="w-max p-1 rounded-md text-white bg-pink-400">
            <Link
              className="text-white"
              to={`/chuong-trinh/${record?.tourInfor[0]?.slug}`}
            >
              Đánh giá
            </Link>
          </div>
        ) : record.status === "Đang hoạt động" ? (
          <div className=""></div>
        ) : (
          <div className="w-max p-1 rounded-md text-white bg-yellow-400">
            Vui lòng chờ
          </div>
        ),
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "update",
      key: "update",
      render: (_, record) => (
        <>
          {record.status === "Xác nhận đơn đặt" ||
          record.status === "Thanh toán thành công" ||
          record.status === "Đang hoạt động" ||
          record.status === "Đã hoàn thành tour" ? (
            ""
          ) : (
            <UpdateBookingForm
              record={record}
              status={record.status}
              handleUpdate={handleUpdate}
            />
          )}
        </>
      ),
    },
    {
      title: "Hủy tour", // Title for the cancel button column
      key: "cancelTour",
      width: "100%",
      align: "center",
      render: (_, record) => (
        <>
          {record.status === "Xác nhận đơn đặt" ||
          record.status === "Thanh toán thành công" ||
          record.status === "Đang hoạt động" ||
          record.status === "Đã hoàn thành tour" ? (
            ""
          ) : (
            <Space size="middle">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa tour này không?"
                onConfirm={() => handleCancelTour(record)}
                okText="Có"
                cancelText="Không"
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Hủy tour
                </Button>
              </Popconfirm>
            </Space>
          )}
        </>
      ),
    },
  ];
  const calculateTotal = () => {
    return (
      selectedTour?.passengers.slotBaby +
      selectedTour?.passengers.slotChildren +
      selectedTour?.passengers.slotAdult
    );
  };
  const onFinish = (values) => {
    console.log("Updated Information: ", values);
    setUserInfo(values); // Update the local state with new info
    setIsEditing(false); // Exit editing mode
  };
  const tabs = [
    {
      label: "Thông tin cá nhân",
      key: "1",
      children: isEditing ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={userInfo}
        >
          <h3>Thông tin cá nhân</h3>
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Nhập tên của bạn" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className=" flex flex-col gap-4">
          <h3 className="fw-bold uppercase ">Thông tin cá nhân</h3>
          <div className="flex flex-col gap-3">
            <p>
              <strong>Tên:</strong>{" "}
              {user?.displayName || filterUserInfor?.displayName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || filterUserInfor?.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {user?.phoneNumber || filterUserInfor?.phoneNumber}
            </p>
            <p>
              <strong>Thời gian tham gia:</strong>{" "}
              {user
                ? new Date(user?.metadata?.creationTime).toLocaleString(
                    "vi-VN",
                    options
                  )
                : formatDate(filterUserInfor?.createdAt)}
            </p>
          </div>
          <Button
            type="primary"
            className="w-[150px]"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        </div>
      ),
    },
    {
      label: "Hóa đơn đặt tour",
      key: "2",
      children: (
        <div className="w-full hd-tour flex flex-col gap-5">
          <h3 className="mt-3 text-[20px] text-center fw-bold uppercase">
            Hóa đơn đặt tour
          </h3>
          <div className="overflow-x-scroll w-full">
            <Table
              columns={columns}
              pagination={{ pageSize: 6 }}
              dataSource={filterPaymentUser.reverse()}
            />
            <Modal
              title="Thông tin thanh toán"
              visible={isModalVisibleModal}
              onCancel={handleCancelModal}
              centered
              footer={null} // Ẩn footer nếu không cần
            >
              {modalContent}
            </Modal>
            <Modal
              title="Chi Tiết Hóa Đơn"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
              centered
            >
              {selectedTour && (
                <div className="flex flex-col w-full gap-3">
                  <div className="w-full">
                    <div className="w-full">
                      <div className="w-full flex flex-col gap-3">
                        <div className="d-flex w-full gap-3">
                          <img
                            style={{ width: "40%", borderRadius: "10px" }}
                            src={selectedTour?.tourInfor[0]?.images[0]}
                            alt=""
                            className=""
                          />
                          <div style={{ width: "50%" }}>
                            <strong className="clamped-text-bookingtour">
                              {selectedTour?.tourInfor[0]?.title}
                            </strong>
                            <p>Mã tour: {selectedTour?.tourId}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="flex gap-5">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt /> Khởi hành:{" "}
                            <span className="text-[#276ca1]">
                              {selectedTour?.tourInfor[0]?.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt /> Thời gian:{" "}
                            <span className="text-[#276ca1]">
                              {calculateDaysAndNights(
                                selectedTour?.tourDetail[0]?.time.startDate,
                                selectedTour?.tourDetail[0]?.time.endDate
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
                            <div
                              className="d-grid  gap-5"
                              style={{ gridTemplateColumns: "repeat(2,1fr)" }}
                            >
                              <div className="flex flex-col gap-2">
                                <div>
                                  <span>
                                    <strong>Ngày đi</strong> -{" "}
                                    {
                                      selectedTour?.tourDetail[0]?.time
                                        .startDate
                                    }
                                  </span>
                                </div>
                                <div>
                                  <div
                                    className="d-flex gap-2"
                                    style={{ flexDirection: "column" }}
                                  >
                                    <div className="d-flex justify-content-between">
                                      <span>
                                        {
                                          selectedTour?.tourDetail[0]?.fightTime
                                            ?.startTime
                                        }
                                      </span>
                                      <span>
                                        {
                                          selectedTour?.tourDetail[0]?.fightTime
                                            ?.endTime
                                        }
                                      </span>
                                    </div>
                                    <div
                                      className=" "
                                      style={{
                                        width: "100%",
                                        height: "5px",
                                        background: "#ccc",
                                      }}
                                    ></div>
                                    <div className="d-flex justify-content-between">
                                      <span>
                                        {selectedTour?.tourInfor[0]?.city}
                                      </span>
                                      <span>
                                        {selectedTour?.tourInfor[0]?.endCity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div>
                                  <span>
                                    <strong>Ngày về</strong> -{" "}
                                    {selectedTour?.tourDetail[0]?.time?.endDate}
                                  </span>
                                </div>
                                <div className="">
                                  <div
                                    className="d-flex gap-2"
                                    style={{ flexDirection: "column" }}
                                  >
                                    <div className="d-flex justify-content-between">
                                      <span>
                                        {
                                          selectedTour?.tourDetail[0]
                                            ?.fightBackTime?.startBackTime
                                        }
                                      </span>
                                      <span>
                                        {
                                          selectedTour?.tourDetail[0]
                                            ?.fightBackTime?.endBackTime
                                        }
                                      </span>
                                    </div>
                                    <div
                                      className=" "
                                      style={{
                                        width: "100%",
                                        height: "5px",
                                        background: "#ccc",
                                      }}
                                    ></div>
                                    <div className="d-flex justify-content-between flex-row-reverse">
                                      <span>
                                        {selectedTour?.tourInfor[0]?.city}
                                      </span>
                                      <span>
                                        {selectedTour?.tourInfor[0]?.endCity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex" style={{ flexDirection: "column" }}>
                    <strong>Thông tin hành khách</strong>

                    <div className="d-flex justify-content-between">
                      <span>Em bé: {selectedTour?.passengers.slotBaby}</span>
                      <span>
                        Trẻ em: {selectedTour?.passengers.slotChildren}
                      </span>
                      <span>
                        Người lớn: {selectedTour?.passengers.slotAdult}
                      </span>
                    </div>
                    <span>Tổng số hành khách: {calculateTotal()}</span>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </div>
      ),
    },
    {
      label: "Tour đã hoàn thành",
      key: "3",
      children: (
        <div>
          <h3>Tour đã hoàn thành</h3>
          <p>Nội dung của Tab 3.</p>
        </div>
      ),
    },
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
    <div className="bg-profile pt-3">
      <div className="w-1240 w-375 infor-profile">
        <Row className={`profile  ${isMobile ? "gap-3" : ""}`}>
          <Col sm={3} className="col-md-3 ">
            <div className="profile-sidebar rounded-xl">
              <div className="profile-userpic">
                <img
                  src={
                    user?.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                  }
                  className="img-responsive"
                  alt="Thông tin cá nhân"
                />
              </div>

              <div className="profile-usermenu">
                <Tabs
                  tabPosition={tabPosition}
                  activeKey={activeTabKey}
                  onChange={(key) => setActiveTabKey(key)} // Handle tab change
                  items={tabs.map((tab) => ({
                    label: tab.label,
                    key: tab.key,
                  }))}
                />
              </div>
            </div>
          </Col>
          <Col sm={9} className="col-md-9">
            <div className="profile-content rounded-xl">
              {tabs.find((tab) => tab.key === activeTabKey)?.children}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Infor;
