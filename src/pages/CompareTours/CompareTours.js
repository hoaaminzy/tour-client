import React, { useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import { baseUrl } from "../../base/baseUrl";
import TourFavorite from "../../components/CardTourFavorite/CardTourFavorite";
import { Modal } from "antd";
import "./CompareTours.css";
const CompareTours = ({ user }) => {
  console.log(user);
  const [allUsers, setAllUsers] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [favoriteTours, setFavoriteTours] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const tokenUser = sessionStorage.getItem("emailUser");
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
  // Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}auth/get-all-users`);
      setAllUsers(response?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch all tours
  const getAllTours = async () => {
    try {
      const response = await axios.get(`${baseUrl}tour/get-all-tours`);
      const tours = response?.data?.tours;
      setAllTours(tours || []);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    getAllTours();
    getAllUsers();
  }, []);

  // Find the current user and fetch their favorite tours
  const findUser = allUsers.find((item) => item.email === tokenUser);
  const userId = findUser?._id || user?.uid;

  const checkIfFavorite = async () => {
    try {
      const response = await axios.get(`${baseUrl}favorites/${userId}`);
      setFavoriteTours(response?.data?.favorites || []);
    } catch (error) {
      console.error("Error fetching favorite tours:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      checkIfFavorite();
    }
  }, [userId]);

  // Add a tour to the compare list
  const addToCompare = (tour) => {
    showModal();
    if (compareList.find((item) => item._id === tour._id)) {
      message.info("Tour này đã có trong danh sách so sánh");
      return;
    }
    if (compareList.length >= 3) {
      message.warning("Bạn chỉ có thể so sánh tối đa 3 tour");
      return;
    }
    setCompareList([...compareList, tour]);
  };
  const removeFromCompare = (tourId) => {
    const updatedCompareList = compareList.filter(
      (tour) => tour._id !== tourId
    );

    setCompareList(updatedCompareList);

    if (updatedCompareList.length === 0) {
      handleCancel();
    }
  };
  const favoriteTourIds = favoriteTours.map((fav) => fav.tourId);
  const allFavoriteTours = allTours.filter((tour) =>
    favoriteTourIds.includes(tour._id)
  );
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
    <div className="compare-tours-page w-1240 w-375 py-5">
      <Modal
        title="So sánh tour"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={false}
        getContainer={false}
      >
        <div
          className={` ${
            isMobile ? "flex-col" : ""
          } compare-list flex gap-5 w-max`}
        >
          {compareList.map((tour) => (
            <TourFavorite
              key={tour._id}
              tour={tour}
              onRemove={() => removeFromCompare(tour._id)}
              isComparison
            />
          ))}
        </div>
      </Modal>

      <h3 className="text-center text-[#276ca1] uppercase fw-bold text-[28px] mb-5">
        các Tour yêu thích
      </h3>
      <div
        className="tour-list"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 50,
          flexWrap: "wrap",
        }}
      >
        {allFavoriteTours.length > 0 ? (
          allFavoriteTours.map((tour) => (
            <TourFavorite
              user={userId}
              key={tour._id}
              tour={tour}
              onAdd={() => addToCompare(tour)}
            />
          ))
        ) : (
          <span>Chưa có tour nào</span>
        )}
      </div>
    </div>
  );
};

export default CompareTours;
