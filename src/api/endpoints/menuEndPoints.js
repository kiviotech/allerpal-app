const menuEndPoints = {
    // GET all menus
    getAllMenus: '/menus?populate=*',
  
    // GET a menu by ID
    getMenusById: (id) => `/menus/${id}?populate=*`,
  
    // GET menus by restaurant ID
    getMenusByRestaurantId: (id) => `/menus?populate[menu_items][populate][image]=*&filters[restaurant][documentId][$eq]=${id}`,
  
    // GET a menu by menu item ID
    getMenuByMenuItemId: (id) => `/menus?filters[menu_items][id][$eq]=${id}&populate=*`,
  
    // POST a new menu
    createMenu: '/menus',
  
    // PUT to update a menu by ID
    updateMenu: (id) => `/menus/${id}`,
  
    // DELETE a menu by ID
    deleteMenu: (id) => `/menus/${id}`,
  };
  
  export default menuEndPoints;
  