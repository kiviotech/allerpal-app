import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const MenuCard = ({ menuItems }) => {
  return (
    <View style={styles.container}>
      {menuItems.map((menuItem, index) => (
        <View key={index} style={styles.maincard}>
          {menuItem.menu_items.map((item, indx) => {
            const imageUrl = item?.image ? item?.image : "https://media.istockphoto.com/id/1442417585/photo/person-getting-a-piece-of-cheesy-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=k60TjxKIOIxJpd4F4yLMVjsniB4W1BpEV4Mi_nb4uJU="
            return (
              <View key={indx} style={styles.cardContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: imageUrl
                    }}
                    style={styles.image}
                  />
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.item_name}</Text>
                    {/* <Text style={styles.price}>${item.price || "N/A"}</Text> */}
                  </View>

                  {/* {item?.description && (
                  <Text style={styles.allergens}>Allergens: {item.description}</Text>
                )} */}
                </View>
              </View>
            )
          }
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  maincard: {
    flexDirection: "column",
    borderRadius: 15,
  },
  cardContainer: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingContainer: {
    position: "absolute",
    bottom: 5,
    left: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  star: {
    color: "gold",
    fontSize: 12,
    marginHorizontal: 2,
  },
  ratingCount: {
    color: "#000",
    fontSize: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  heartIcon: {
    fontSize: 20,
    color: "skyblue", // Adjust color to match your theme
  },
  detailsContainer: {
    flex: 1,
    // justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "teal",
    right: 5,
  },
  allergens: {
    fontSize: 14,
    color: "grey",
    marginTop: 15,
  },
  orderedBefore: {
    fontSize: 14,
    color: "teal",
    marginTop: 4,
  },
});

export default MenuCard;
