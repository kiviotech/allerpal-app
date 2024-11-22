const menuItemsEndpoints = {
  getAllMenuItems: "/menu-items?populate=*", // GET all menu items
  getMenuItemById: (id) => `/menu-items/${id}`, // GET a menu item by ID
  createMenuItem: "/menu-items", // POST a new menu item
  updateMenuItem: (id) => `/menu-items/${id}`, // PUT to update a menu item by ID
  deleteMenuItem: (id) => `/menu-items/${id}`, // DELETE a menu item by ID
};

export default menuItemsEndpoints;
