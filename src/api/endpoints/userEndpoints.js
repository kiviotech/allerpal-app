const userEndpoints = {
    getUsers: "/users?populate=*",
    getUserById: (id) => `/users/${id}?populate=*`,
    createUser: "/auth/local/register",
    updateUser: (id) => `/users/${id}`,
    deleteUser: (id) => `/users/${id}`,
  };
  
  export default userEndpoints;