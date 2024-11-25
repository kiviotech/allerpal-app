const menuEndPoints ={
    getMenusByRestaurantId:  (id) => `/menus?populate=*&filters[restaurant][documentId][$eq]=${id}`,

    getMenusByMenuitemId: (id) => `/menus?filters[menu_items][id][$eq]=${id}&populate=*`
}
export default menuEndPoints