import React from "react";
import "./CardProduct.css";
import { ImPriceTag } from "react-icons/im";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import formatDate from "../../utils/formatDate";
import { Link } from "react-router-dom";
import FavoriteTours from "../FavoriteTours/FavoriteTours";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import {
  addTourToCart,
  removeTourFromCart,
} from "../../store/actions/cartActions";
const CardProduct = ({ data: tour, user }) => {
  const dispatch = useDispatch();
  const cartTours = useSelector((state) => state.cart.tours);
  const isInCart = cartTours.some((item) => item._id === tour._id);
  const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const nights = days - 1; // Nights are usually one less than the number of days

    return `${days}N${nights}Đ`;
  };

  const addTourCart = (tour) => {
    if (isInCart) {
      dispatch(removeTourFromCart(tour._id));
      message.info("Đã xóa tour khỏi giỏ tour");
    } else {
      dispatch(addTourToCart(tour));
      message.success("Thêm vào giỏ tour thành công");
    }
  };

  return (
    <div className="w-[350px] h-[520px] flex flex-col  bg-white rounded-2xl overflow-hidden">
      <div className="h-[250px] relative">
        <Link className="" to={`/chuong-trinh/${tour.slug}`}>
          <img
            src={tour?.images[0]}
            style={{ width: "100%", height: "230px", objectFit: "cover" }}
            alt=""
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
      </div>
      <div className="p-3 flex  flex-col gap-2">
        <strong>{tour.title}</strong>
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
            <MdChair /> Số chỗ còn nhận: {tour?.inforTourDetail[0]?.slot}
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
          <Link className="" to={`/chuong-trinh/${tour?.slug}`}>
            <button className="text-red-500 w-[100px] h-[35px] rounded-md outline outline-red-500">
              Đặt ngay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
