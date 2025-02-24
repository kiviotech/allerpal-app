const messageEndpoints = {
    getMessages: '/messages?populate=*',
    getMessageById: (id) => `/messages/${id}`,
    createMessage: "/messages",
    updateMessage: (id) => `/messages/${id}`,
    deleteMessage: (id) => `/messages/${id}`,
};

export default messageEndpoints;
