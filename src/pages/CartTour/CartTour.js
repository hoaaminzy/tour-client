import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Space, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  loadCartFromLocalStorage,
  removeTourFromCart,
} from "../../store/actions/cartActions";

const CartTour = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Lấy danh sách tours từ Redux store
  const cartTours = useSelector((state) => state.cart.tours);

  useEffect(() => {
    dispatch(loadCartFromLocalStorage());
  }, [dispatch]);
  const handleRemoveTour = (id) => {
    dispatch(removeTourFromCart(id));
    message.success("Đã xóa tour khỏi giỏ tour");
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      render: (images) => (
        <img
          src={images[0]}
          alt="Tour"
          style={{ width: "150px", height: "120px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên Tour",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Giá",
      dataIndex: "inforTourDetail",
      key: "price",
      render: (inforTourDetail) => (
        <span>{inforTourDetail[0]?.price.price} VND</span>
      ),
    },
    {
      title: "Loại tour",
      dataIndex: "loaitour",
      key: "loaitour",
      render: (_, record) => <span>{record.typeCombo}</span>,
    },
    {
      title: "Khách sạn",
      dataIndex: "hotel",
      key: "hotel",
      render: (_, record) => (
        <span>{record.combo === true ? record.hotel : "Không"}</span>
      ),
    },
    {
      title: "Phương tiện",
      dataIndex: "vehicel",
      key: "vehicel",
      render: (_, record) => <span>{record.vehicle}</span>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          <Space size="middle">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tour này không?"
              onConfirm={() => handleRemoveTour(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
          <Button
            type="primary"
            onClick={() => navigate(`/chuong-trinh/${record?.title}`)}
          >
            Thanh Toán
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }} className="w-1240 w-375">
      <div className="mb-5">
        <span className="uppercase fw-bold text-[24px] text-center block text-[#276ca1]">
          Giỏ tour
        </span>
      </div>
      {cartTours.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={cartTours}
            rowKey="_id"
            pagination={false}
          />
        </>
      ) : (
        <p className="text-center mt-5">Giỏ hàng của bạn đang trống.</p>
      )}
    </div>
  );
};

export default CartTour;
