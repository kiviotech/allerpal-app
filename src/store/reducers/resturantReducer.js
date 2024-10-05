// src/store/reducers/restaurantReducer.js
import { GET_RESTAURANT } from '../actions/restaurantActions';

const initialState = {
  restaurant: {},
};

export const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RESTAURANT:
      return { ...state, restaurant: action.payload };
    default:
      return state;
  }
};