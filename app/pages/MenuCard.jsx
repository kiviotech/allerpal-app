import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const MenuCard = ({ menuItems }) => {

  return (
    <View style={styles.container}>
      {menuItems.map((menuItem, index) => (
        <View key={menuItem.id} style={styles.maincard}>
          {menuItem.menu_items.map((item) => (
            <View key={item.id} style={styles.cardContainer}>
              {/* Image Section - Replace with actual item image if available */}
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: "https://media.istockphoto.com/id/1442417585/photo/person-getting-a-piece-of-cheesy-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=k60TjxKIOIxJpd4F4yLMVjsniB4W1BpEV4Mi_nb4uJU=",
                  }}
                  style={styles.image}
                />
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>4.5</Text>
                  <Text style={styles.star}>★</Text>
                  {/* <Text style={styles.ratingCount}>(25+)</Text> */}
                </View>
              </View>

              {/* Details Section */}
              <View style={styles.detailsContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{item.item_name}</Text>
                  {/* <Text style={styles.price}>${item.price || "N/A"}</Text> */}
                </View>

                {/* Display allergens or other item info if available */}
                {item?.description && (
                  <Text style={styles.allergens}>Allergens: {item.description}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  maincard: {
    flexDirection: "column",
    // paddingBottom: 15,
    borderRadius: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    // height:105,
  },
  imageContainer: {
    width: 100,
    height: 100,
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
