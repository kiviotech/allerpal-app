const favouritesEndPoints = {
    getFavourites: '/favourites?populate=*',
    getFavouritesByUserId: (id) => `/favourites?filters[user][$eq]=${id}&populate=*`,
    getFavouritesById: (id) => `/favourites/${id}`,
    createFavourites: "/favourites",
    updateFavourites: (id) => `/favourites/${id}`,
    deleteFavourites: (id) => `/favourites/${id}`,
};

export default favouritesEndPoints;