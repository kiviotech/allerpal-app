const inboxEndpoints = {
    getAllInboxes: "/inboxxes?populate=*",
    getInboxesByUserId: (userId) => `/inboxxes?populate=*&filters[user][id][$eq]=${userId}`,
    getInboxesByUserResto: (userId, restaurantId) =>`/inboxxes?populate=*&filters[user][id][$eq]=${userId}&filters[restaurant][id][$eq]=${restaurantId}`,
    getInboxById: (id) => `/inboxxes/${id}?populate=*`,
    createInbox: "/inboxxes",
    updateInbox: (id) => `/inboxxes/${id}`,
    deleteInbox: (id) => `/inboxxes/${id}`,
};

export default inboxEndpoints;