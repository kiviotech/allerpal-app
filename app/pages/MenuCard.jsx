import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

// Helper function to detect allergens in description text
const findAllergensInDescription = (description, userAllergies) => {
  if (!description || typeof description !== 'string' || !userAllergies?.length) {
    return [];
  }
  
  const descriptionLower = description.toLowerCase();
  
  // Find all allergens mentioned in the description
  return userAllergies.filter(allergen => {
    const allergenName = allergen.name.toLowerCase();
    return descriptionLower.includes(allergenName);
  });
};

const MenuCard = ({ menuItems, userAllergies, isAllergenFilterOn }) => {
  // Function to get allergens that are not in the menu item
  const getSafeAllergens = (menuItem) => {
    if (!userAllergies || !menuItem.allergens) return [];
    
    return userAllergies.filter(userAllergen => 
      !menuItem.allergens.some(menuAllergen => 
        menuAllergen.id === userAllergen.id
      )
    );
  };

  // Function to get all allergens in an item (from both structured data and description)
  const getAllAllergens = (menuItem) => {
    // Get allergens from structured data
    const structuredAllergens = menuItem.allergens || [];
    
    // Get allergens from description
    const descriptionAllergens = findAllergensInDescription(menuItem.description, userAllergies);
    
    // Combine allergens from both sources, avoiding duplicates
    const allAllergenIds = new Set();
    const combinedAllergens = [];
    
    // Add structured allergens
    structuredAllergens.forEach(allergen => {
      if (!allAllergenIds.has(allergen.id)) {
        allAllergenIds.add(allergen.id);
        combinedAllergens.push(allergen);
      }
    });
    
    // Add description allergens
    descriptionAllergens.forEach(allergen => {
      if (!allAllergenIds.has(allergen.id)) {
        allAllergenIds.add(allergen.id);
        combinedAllergens.push(allergen);
      }
    });
    
    return combinedAllergens;
  };

  // Function to check if item is safe based on both structured data and description
  const isSafeItem = (menuItem) => {
    if (!userAllergies?.length) return true;
    
    // Check structured allergens
    const hasStructuredAllergen = menuItem.allergens && menuItem.allergens.some(menuAllergen => 
      userAllergies.some(userAllergen => userAllergen.id === menuAllergen.id)
    );
    
    // Check description allergens
    const descriptionAllergens = findAllergensInDescription(menuItem.description, userAllergies);
    const hasDescriptionAllergen = descriptionAllergens.length > 0;
    
    return !(hasStructuredAllergen || hasDescriptionAllergen);
  };

  return (
    <View style={styles.container}>
      {menuItems.map((menuItem, index) => (
        <View key={menuItem.id} style={styles.maincard}>
          {menuItem.menu_items.map((item) => {
            const imageUrl = item?.image ? item?.image : "https://media.istockphoto.com/id/1442417585/photo/person-getting-a-piece-of-cheesy-pepperoni-pizza.jpg?s=612x612&w=0&k=20&c=k60TjxKIOIxJpd4F4yLMVjsniB4W1BpEV4Mi_nb4uJU="
            
            // Only process allergen information if the filter is on
            let itemAllergens = [];
            let safeAllergens = [];
            let descriptionAllergens = [];
            let hasDescriptionAllergens = false;
            
            if (isAllergenFilterOn && userAllergies?.length > 0) {
              // Get combined allergens and safe allergens
              itemAllergens = getAllAllergens(item);
              safeAllergens = userAllergies?.filter(a => !itemAllergens.some(ia => ia.id === a.id)) || [];
              
              // Get description allergens specifically for highlighting
              descriptionAllergens = findAllergensInDescription(item.description, userAllergies);
              hasDescriptionAllergens = descriptionAllergens.length > 0;
            }
            
            // Format highlighted description if allergen filter is on and allergens are found
            const highlightedDescription = () => {
              if (!item.description || !isAllergenFilterOn || !hasDescriptionAllergens) {
                return item.description;
              }
              
              // Simple implementation - this could be enhanced with actual text highlighting
              return (
                <Text>
                  {item.description}
                  <Text style={styles.allergenWarning}>
                    {" "}(Contains: {descriptionAllergens.map(a => a.name).join(', ')})
                  </Text>
                </Text>
              );
            };
            
            return (
              <View key={item.id} style={styles.cardContainer}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                  />
                </View>

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.item_name}</Text>
                  </View>

                  {/* Description with allergen highlighting only when filter is on */}
                  {item?.description && (
                    <Text style={styles.description}>
                      {isAllergenFilterOn ? highlightedDescription() : item.description}
                    </Text>
                  )}

                  {/* Allergen Information - only show when filter is on */}
                  {isAllergenFilterOn && userAllergies?.length > 0 && (
                    <View style={styles.allergenInfo}>
                      {/* Show detected allergens */}
                      {itemAllergens.length > 0 ? (
                        <Text style={styles.allergens}>
                          Contains: {itemAllergens.map(a => a.name).join(", ")}
                        </Text>
                      ) : null}
                      
                      {/* Show safe allergens */}
                      {safeAllergens.length > 0 && (
                        <Text style={styles.safeAllergens}>
                          Safe for: {safeAllergens.map(a => a.name).join(", ")}
                        </Text>
                      )}
                      
                      {/* Source of allergen detection */}
                      {hasDescriptionAllergens && (
                        <Text style={styles.allergenNote}>
                          *Allergens detected in description
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
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
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    // height:105,
  },
  imageContainer: {
    width: 100,
    height: 65,
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
    color: "#ff6b6b",
    marginBottom: 4,
  },
  safeAllergens: {
    fontSize: 14,
    color: "#51cf66",
    marginTop: 4,
  },
  allergenWarning: {
    color: "#ff6b6b",
    fontWeight: "500",
  },
  allergenNote: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  allergenInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderedBefore: {
    fontSize: 14,
    color: "teal",
    marginTop: 4,
  },
});

export default MenuCard;
