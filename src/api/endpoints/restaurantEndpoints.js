const restaurantEndpoints = {
  getRestaurants: "/restaurants?populate=*&pagination[pageSize]=20",
  getRestaurantsByPage: (page = 1, pageSize = 20) => `/restaurants?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
  getRestaurantById: (id) => `/restaurants/${id}?populate=*`,
  createRestaurant: "/restaurants",
  updateRestaurant: (id) => `/restaurants/${id}`,
  deleteRestaurant: (id) => `/restaurants/${id}`,
  getFavoriteRestaurants: (id) =>
    `/restaurants?populate[image]=*&filters[favourites][id][$eq]=${id}`,
};

export default restaurantEndpoints;
