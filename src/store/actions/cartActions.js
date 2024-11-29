// actions/cartActions.js
export const addTourToCart = (tour) => {
  return (dispatch, getState) => {
    const { cart } = getState();
    const existingTour = cart.tours.find((item) => item._id === tour._id);

    if (existingTour) {
      return; // Nếu tour đã có, không làm gì cả
    }

    const updatedTours = [...cart.tours, tour];

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem("cartTours", JSON.stringify(updatedTours));

    // Dispatch action thêm tour vào giỏ hàng
    dispatch({ type: "ADD_TOUR_TO_CART", payload: tour });
  };
};

// actions/cartActions.js
export const removeTourFromCart = (tourId) => {
  return (dispatch, getState) => {
    const { cart } = getState();
    const updatedTours = cart.tours.filter((tour) => tour._id !== tourId);

    // Cập nhật lại giỏ hàng trong localStorage
    localStorage.setItem("cartTours", JSON.stringify(updatedTours));

    // Dispatch action xóa tour khỏi giỏ hàng
    dispatch({ type: "REMOVE_TOUR_FROM_CART", payload: tourId });
  };
};

// actions/cartActions.js
export const loadCartFromLocalStorage = () => {
  return (dispatch) => {
    const savedCart = localStorage.getItem("cartTours");
    if (savedCart) {
      dispatch({
        type: "LOAD_CART_FROM_LOCAL_STORAGE",
        payload: JSON.parse(savedCart),
      });
    }
  };
};
export const clearTourCart = () => {
  return {
    type: "CLEAR_TOUR_CART",
  };
};
