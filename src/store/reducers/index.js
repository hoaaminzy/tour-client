// src/store/reducers/index.js
import { combineReducers } from "redux";

const initialState = {
  selectedItem: null,
};
const initialCartState = {
  tours: [],
};
const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_ITEM":
      return { ...state, selectedItem: action.payload };
    case "CLEAR_SELECTED_ITEM":
      return { ...state, selectedItem: null };
    default:
      return state;
  }
};

const cartReducer = (state = initialCartState, action) => {
  switch (action.type) {
    case "ADD_TOUR_TO_CART":
      const existingTour = state.tours.find(
        (tour) => tour._id === action.payload._id
      );
      if (existingTour) {
        return state; // Nếu tour đã có, không thay đổi gì
      }
      return { ...state, tours: [...state.tours, action.payload] };

    case "REMOVE_TOUR_FROM_CART":
      return {
        ...state,
        tours: state.tours.filter((tour) => tour._id !== action.payload),
      };

    case "CLEAR_TOUR_CART":
      return { ...state, tours: [] };

    case "LOAD_CART_FROM_LOCAL_STORAGE":
      return { ...state, tours: action.payload };

    default:
      return state;
  }
};

// Kết hợp các reducers
const rootReducer = combineReducers({
  item: itemReducer,
  cart: cartReducer,
  // Bạn có thể thêm các reducer khác ở đây
});

export default rootReducer;
