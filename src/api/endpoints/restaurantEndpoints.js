const restaurantEndpoints = {
  getAllRestaurants: "/restaurants?populate=image",
  getRestaurantById: (id) => `/restaurants/${id}?populate=*`,
  createRestaurant: "/restaurants",
  updateRestaurant: (id) => `/restaurants/${id}`,
  deleteRestaurant: (id) => `/restaurants/${id}`,
};

export default restaurantEndpoints;
