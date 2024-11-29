import React, { useEffect, useState } from "react";
import logo from "../../images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { signOut } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import { Dropdown, Menu, Avatar } from "antd";
import { FaBars } from "react-icons/fa"; // Import hamburger icon
import "./Header.css";
import { useSelector } from "react-redux";

const Header = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const token = sessionStorage.getItem("userToken");
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
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem("userToken");
      sessionStorage.removeItem("emailUser");
      localStorage.removeItem("cartTours");
      navigate("/dang-nhap");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleInfor = () => {
    navigate("/thong-tin-ca-nhan");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const dataNav = [
    { label: "Điểm đến", slug: "chuong-trinh" },
    { label: "Yêu thích", slug: "yeu-thich" },
    { label: "Tin tức", slug: "tin-tuc" },
    { label: "Liên hệ", slug: "lien-he" },
    { label: "Giỏ TOUR", slug: "gio-tour" },
  ];

  const menu = (
    <Menu>
      <Menu.Item key="infor" onClick={handleInfor}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
  const cartTours = useSelector((state) => state.cart.tours);
  const isHome = location.pathname.startsWith("/trang-chu");

  return (
    <div
      className={`${
        isHome ? "fixed" : ""
      } flex w-full sticky-header justify-center items-center h-[70px] ${
        isScrolled ? "bg-white boxsd" : "bg-transparent"
      } z-50`}
    >
      <div className="header flex justify-between items-center w-full p-3 md:w-1240">
        <div className="logo-container">
          <Link to="/trang-chu">
            <img
              src={logo}
              className={` ${
                isMobile ? "w-[150px]" : "w-[300px]"
              } h-auto object-cover`}
              alt="Logo"
            />
          </Link>
        </div>

        {/* Navigation links for desktop */}
        <div className="nav-links hidden md:flex">
          {dataNav.map((nav, index) => (
            <div key={index} className="relative">
              <Link
                to={nav.slug}
                className={`${
                  !isHome || isScrolled ? "text-black" : "text-white"
                } fw-bold`}
              >
                {nav.label}
              </Link>

              {/* Check if it's the "Giỏ TOUR" label and display the badge */}
              {nav.label === "Giỏ TOUR" && (
                <span className="absolute top-[-5px] right-[-15px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-sm">
                  {cartTours.length}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* User icon and dropdown */}
        <div className="flex gap-3">
          <div
            className="user-icon-container md:flex"
            style={{ flex: 1, justifyContent: "flex-end" }}
          >
            {user?.photoURL || token ? (
              <Dropdown
                overlay={menu}
                placement="bottomCenter"
                trigger={["click"]}
              >
                <Avatar
                  src={
                    user?.photoURL ||
                    "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
                  }
                  alt="User Avatar"
                  style={{ cursor: "pointer", width: "40px", height: "40px" }}
                />
              </Dropdown>
            ) : (
              <Link to="/dang-nhap">
                <FaCircleUser className="text-[30px] text-black" />
              </Link>
            )}
          </div>

          {/* Mobile menu toggle icon */}
          <div className="md:hidden flex items-center">
            <FaBars
              onClick={toggleMobileMenu}
              className="text-[24px] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-menu flex flex-col gap-3 items-start bg-[#daefff] px-4 bsd  w-full py-3">
          {dataNav.map((nav, index) => (
            <div key={index} className="relative">
              <Link to={nav.slug} className={` text-black fw-bold`}>
                {nav.label}
              </Link>

              {/* Check if it's the "Giỏ TOUR" label and display the badge */}
              {nav.label === "Giỏ TOUR" && (
                <span className="absolute top-[-5px] right-[-15px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-sm">
                  {cartTours.length}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
