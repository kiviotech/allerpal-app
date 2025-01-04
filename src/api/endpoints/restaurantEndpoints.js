const restaurantEndpoints = {
  getRestaurants: "/restaurants?populate=*",
  getRestaurantById: (id) => `/restaurants/${id}?populate=*`,
  createRestaurant: "/restaurants",
  updateRestaurant: (id) => `/restaurants/${id}`,
  deleteRestaurant: (id) => `/restaurants/${id}`,
  getFavoriteRestaurants: (id) =>
    `/restaurants?populate[image]=*&filters[favourites][id][$eq]=${id}`,
};

export default restaurantEndpoints;
