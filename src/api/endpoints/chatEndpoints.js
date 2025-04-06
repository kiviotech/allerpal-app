const chatEndpoints = {
  // Chat endpoints
  getAllChats: "/chats?populate=*",
  getChatById: (id) => `/chats/${id}?populate[0]=messages&populate[1]=restaurant&populate[2]=user`,
  getChatsByUserId: (userId) => `/chats?filters[user]=${userId}&populate=*&sort=lastMessageTime:desc`,
  getChatsByRestaurantId: (restaurantId) => `/chats?filters[restaurant]=${restaurantId}&populate=*&sort=lastMessageTime:desc`,
  getChatsByRestaurantDocumentId: (documentId) => `/chats?filters[restaurant][documentId]=${documentId}&populate=*&sort=lastMessageTime:desc`,
  getChatsByFilters: (filters) => {
    let endpoint = "/chats?populate=*&sort=lastMessageTime:desc";
    
    if (filters.user) {
      endpoint += `&filters[user]=${filters.user}`;
    }
    
    if (filters.restaurant) {
      endpoint += `&filters[restaurant]=${filters.restaurant}`;
    }
    
    if (filters['restaurant.documentId']) {
      endpoint += `&filters[restaurant][documentId]=${filters['restaurant.documentId']}`;
    }
    
    if (filters.status) {
      endpoint += `&filters[status]=${filters.status}`;
    }
    
    return endpoint;
  },
  createChat: "/chats",
  updateChat: (id) => `/chats/${id}`,
  deleteChat: (id) => `/chats/${id}`,
  
  // Message endpoints
  getChatMessages: (chatId) => `/messages?filters[chat]=${chatId}&sort=timestamp:asc&pagination[limit]=100`,
  addMessageToChat: (chatId) => `/messages`,
  markMessagesAsRead: (chatId) => `/messages/mark-read/${chatId}`,
  
  // Chat history endpoint
  getChatHistory: (chatId) => `/chats/${chatId}?populate[0]=messages&populate[1]=restaurant&populate[2]=user`,
  
  // Custom endpoints
  createChatCustom: "/create-chat",
  updateChatCustom: (id) => `/update-chat/${id}`,
  
  // New message checking endpoints
  checkNewMessages: (userId) => `/check-new-messages?userId=${userId}`,
  checkChatMessages: (id, lastMessageTime) => `/check-chat-messages/${id}${lastMessageTime ? `?lastMessageTime=${lastMessageTime}` : ''}`,
};

export default chatEndpoints; 