import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/FirebaseConfig";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import TourDetail from "./pages/TourDetail/TourDetail";
import TypeTravel from "./pages/TypeTravel/TypeTravel";
import OrderBooking from "./pages/OrderBooking/OrderBooking";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Signup/SignUp";
import TourCombos from "./pages/TourCombos/TourCombos";
import Infor from "./pages/Infor/Infor";
import PaymentBooking from "./pages/PaymentBooking/PaymentBooking";
import FilterCity from "./pages/FilterCity/FilterCity";
import imgLogo from "../src/images/icons/vtv-logo.png";
import CompareTours from "./pages/CompareTours/CompareTours";
import ContactForm from "./pages/Contact/Contact";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/BlogDetail/BlogDetail";
import CartTour from "./pages/CartTour/CartTour";
import IntroScreen from "./components/IntroScreen/IntroScreen";
import Footer from "./components/Footer/Footer";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const getTokenFromSession = sessionStorage.getItem("userToken");
  const location = useLocation(); // Get the current route path
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user info
      setLoading(false); // Done loading once user status is known
    });

    return () => unsubscribe();
  }, []);

  const ProtectedRoute = ({ element, ...rest }) => {
    if (loading) {
      return <div>Loading...</div>; // Replace with a loading spinner if you want
    }
    return getTokenFromSession ? element : <Navigate to="/dang-nhap" />;
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check and listener for window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleIntroComplete = () => {
    setShowIntro(false); // Hide intro when complete
  };

  useEffect(() => {
    setShowIntro(true); // Show intro whenever the route changes
    const timer = setTimeout(() => {
      setShowIntro(false); // Hide intro after 2 seconds
    }, 1000);
    return () => clearTimeout(timer); // Clean up timer
  }, [location]);
  return (
    <div>
      {showIntro && <IntroScreen />}
      {!showIntro && (
        <>
          <Header user={user} />
          <div className="">
            <Routes>
              <Route path="/dang-nhap" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              <Route
                path="/trang-chu"
                element={<ProtectedRoute element={<Home user={user} />} />}
              />
              <Route
                path="/chuong-trinh/:slug"
                element={
                  <ProtectedRoute element={<TourDetail user={user} />} />
                }
              />
              <Route
                path="/combo-du-lich"
                element={<ProtectedRoute element={<TourCombos />} />}
              />
              <Route
                path="/thong-tin-ca-nhan"
                element={<ProtectedRoute element={<Infor user={user} />} />}
              />
              <Route
                path="/payment-booking/:id"
                element={
                  <ProtectedRoute element={<PaymentBooking user={user} />} />
                }
              />
              <Route
                path="/du-lich-tai/:citySlug/:dateSlug/:budgetSlug"
                element={
                  <ProtectedRoute element={<TypeTravel user={user} />} />
                }
              />
              <Route
                path="/:slug"
                element={
                  <ProtectedRoute element={<TypeTravel user={user} />} />
                }
              />

              <Route
                path="/order-booking/:id"
                element={
                  <ProtectedRoute element={<OrderBooking user={user} />} />
                }
              />
              <Route
                path="/yeu-thich"
                element={
                  <ProtectedRoute element={<CompareTours user={user} />} />
                }
              />
              <Route
                path="/lien-he"
                element={
                  <ProtectedRoute element={<ContactForm user={user} />} />
                }
              />
              <Route
                path="/tin-tuc"
                element={<ProtectedRoute element={<Blog user={user} />} />}
              />
              <Route
                path="/tin-tuc/:id"
                element={
                  <ProtectedRoute element={<BlogDetail user={user} />} />
                }
              />
              <Route
                path="/gio-tour"
                element={<ProtectedRoute element={<CartTour user={user} />} />}
              />

              <Route path="*" element={<Navigate to="/dang-nhap" />} />
            </Routes>
          </div>
          {location.pathname === "/trang-chu" && isMobile && (
            <div
              style={{ zIndex: 999999999 }}
              className="fixed bottom-0 right-0"
            >
              <df-messenger
                intent="Xin chào"
                chat-title="Trợ lý ảo"
                agent-id="df06d99b-057b-46b6-a0af-0c6501f58ab4"
                language-code="vi"
                chat-icon={imgLogo}
              ></df-messenger>
            </div>
          )}
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
