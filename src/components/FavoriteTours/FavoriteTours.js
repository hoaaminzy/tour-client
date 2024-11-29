import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../base/baseUrl";
import { FaHeart } from "react-icons/fa";
import { message } from "antd";

const FavoriteTours = ({ tourId, user }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const tokenUser = sessionStorage.getItem("emailUser");

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

  const addFavorite = async () => {
    try {
      const response = await axios.post(`${baseUrl}favorites/add`, {
        userId,
        tourId,
      });
      if (response.status === 200) {
        setIsFavorite(true);
        message.success("Đã yêu thích tour");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async () => {
    try {
      const response = await axios.delete(`${baseUrl}favorites/remove`, {
        data: { userId, tourId },
      });
      if (response.status === 200) {
        setIsFavorite(false);
        message.success("Đã hủy yêu thích tour");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await axios.get(`${baseUrl}favorites/${userId}`);
      const favorites = response.data.favorites;
      const isFav = favorites.some((fav) => fav.tourId === tourId);
      setIsFavorite(isFav);
    } catch (error) {
      console.error("Error checking if favorite:", error);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };

  useEffect(() => {
    getAllUsers();
    if (userId) {
      checkIfFavorite();
    }
  }, [userId]);

  return (
    <div className="favorite-tour">
      <FaHeart
        onClick={toggleFavorite}
        style={{ color: isFavorite ? "red" : "white", cursor: "pointer" }}
        size={24}
      />
    </div>
  );
};

export default FavoriteTours;
