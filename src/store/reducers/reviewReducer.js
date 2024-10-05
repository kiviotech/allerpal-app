// src/store/reducers/reviewReducer.js
import { GET_REVIEWS } from '../actions/reviewActions';

const initialState = {
  reviews: [],
};

export const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REVIEWS:
      return { ...state, reviews: action.payload };
    default:
      return state;
  }
};