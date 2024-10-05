// src/store/store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { restaurantReducer } from './reducers/restaurantReducer';
import { menuReducer } from './reducers/menuReducer';
import { reviewReducer } from './reducers/reviewReducer';

const rootReducer = combineReducers({
  restaurant: restaurantReducer,
  menu: menuReducer,
  reviews: reviewReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;