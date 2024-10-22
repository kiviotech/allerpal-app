const menuEndpoints = {
    getmenus: "/menus?populate=*",
    getmenuById: (id) => `/menus/${id}?populate=*`,
    createmenu: "/menus",
    updatemenu: (id) => `/menus/${id}`,
    deletemenu: (id) => `/menus/${id}`,
    getmenuItems: "/menu-items?populate=*",
  
    // New endpoint for fetching menus by userId and projectId (adjust if you have a similar need)
    getmenusByUserAndProject: (userId, projectId) =>
      `/menus?filters[assigned_to][$eq]=${userId}&filters[project][$eq]=${projectId}&populate=*`,
  
    getmenusByUser: (userId, projectId) => `/menus?populate=*`,
  };
  
  export default menuEndpoints;
  