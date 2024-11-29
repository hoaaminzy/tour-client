import React from "react";
import { Button, Card, message } from "antd";
import { Link } from "react-router-dom";
import { ImPriceTag } from "react-icons/im";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import FavoriteTours from "../FavoriteTours/FavoriteTours";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addTourToCart,
  removeTourFromCart,
} from "../../store/actions/cartActions";

const TourFavorite = ({ user, tour, onAdd, onRemove, isComparison }) => {
  const dispatch = useDispatch();
  console.log(user);
  const cartTours = useSelector((state) => state.cart.tours);
  const isInCart = cartTours.some((item) => item._id === tour._id);
  const discountPrice = (price) => {
    if (price < 0) throw new Error("Price cannot be negative.");
    return Math.round(price - (price * 10) / 100);
  };

  const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days}N${days - 1}Đ`;
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
    <div
      style={{ boxShadow: "0px 2px 5px #ccc" }}
      className="w-[350px]  flex flex-col   bg-white rounded-2xl overflow-hidden"
    >
      <div className="h-[250px] relative">
        <Link className="" to={`/chuong-trinh/${tour.slug}`}>
          <img
            src={tour?.images[0]}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt=""
          />
        </Link>
        <div
          style={{ top: "10px", left: "10px" }}
          className="absolute flex justify-between flex-col items-center gap-3"
        >
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
            <p className="">
              Giá từ:{" "}
              <span className="line-through">
                {" "}
                {tour?.inforTourDetail[0]?.price?.price}đ
              </span>
            </p>
            <span className="text-red-500 text-[24px]">
              {discountPrice(tour?.inforTourDetail[0]?.price?.price)}đ
            </span>
          </div>
          <Link className="" to={`/chuong-trinh/${tour.slug}`}>
            <button className="text-red-500 w-[100px] h-[35px] rounded-md outline outline-red-500">
              Đặt ngay
            </button>
          </Link>
        </div>
        {isComparison ? (
          <Button onClick={onRemove} danger>
            Xóa khỏi So sánh
          </Button>
        ) : (
          <Button onClick={onAdd} type="primary">
            Thêm vào So sánh
          </Button>
        )}
      </div>
    </div>
  );
};

export default TourFavorite;
