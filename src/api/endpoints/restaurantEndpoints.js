// const restaurantEndpoints = {
//     getAllRestaurants: "/restaurants", // GET all restaurants
//     getRestaurantById: (id) => `/restaurants/${id}`, // GET a restaurant by ID
//     createRestaurant: "/restaurants", // POST a new restaurant
//     updateRestaurant: (id) => `/restaurants/${id}`, // PUT to update a restaurant by ID
//     deleteRestaurant: (id) => `/restaurants/${id}`, // DELETE a restaurant by ID
// };

// export default restaurantEndpoints;


// endpoints/restaurantEndpoints.js
const restaurantEndpoints = {
    getAllRestaurants: "/restaurants?populate=image", // GET all restaurants
    getRestaurantById: (id) => `/restaurants/${id}`, // GET a restaurant by ID
    createRestaurant: "/restaurants", // POST a new restaurant
    updateRestaurant: (id) => `/restaurants/${id}`, // PUT to update a restaurant by ID
    deleteRestaurant: (id) => `/restaurants/${id}`, // DELETE a restaurant by ID
};

export default restaurantEndpoints;
