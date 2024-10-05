// src/store/reducers/menuReducer.js
import { GET_MENUS } from '../actions/menuActions';

const initialState = {
  menus: [],
};

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MENUS:
      return { ...state, menus: action.payload };
    default:
      return state;
  }
};