const menuEndPoints ={
    getMenusByRestaurantId:  (id) => `/menus?populate=*&filters[restaurant][documentId][$eq]=${id}`
}
export default menuEndPoints