const cuisineEndPoints = {
    getCuisines: '/cuisines?populate=*',
    getCuisinesById: (id) => `/cuisines/${id}`,
    createCuisines: "/cuisines",
    updateCuisines: (id) => `/cuisines/${id}`,
    deleteCuisines: (id) => `/cuisines/${id}`,
};

export default cuisineEndPoints;