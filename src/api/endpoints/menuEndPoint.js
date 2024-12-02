const menuEndPoints ={
    getMenusByRestaurantId:  (id) => `/menus?populate=*&filters[restaurant][documentId][$eq]=${id}`,
    getAllMenus: '/menus?populate=*',
    getMenusById: (id) => `/menus/${id}?populate=*`
}
export default menuEndPoints