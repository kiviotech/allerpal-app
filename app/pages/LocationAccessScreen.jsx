// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
// import location from "../../assets/Location.png";
// import dashboard from "../../assets/dashboard.png"

// const LocationAccessScreen = () => {
//   const handleEnableLocation = () => {
//     // Handle location enable action
//     console.log('Location Services Enabled');
//   };

//   return (
//     <SafeAreaView style={styles.AreaContainer}>
//       {/* Background Image with Transparency */}
//       <ImageBackground 
//         source={dashboard} 
//         style={styles.backgroundImage}
//         imageStyle={styles.imageStyle}
//       >
//         <View style={styles.container}>
//           <View style={styles.card}>
//             {/* Title */}
//             <Text style={styles.title}>Location Access</Text>

//             {/* Image */}
//             <View style={styles.imageContainer}>
//               <Image
//                 source={location}
//                 style={styles.image}
//                 resizeMode="contain"
//               />
//             </View>

//             {/* Description */}
//             <Text style={styles.description}>
//               To search for best nearby Restaurants, we would want to know your current location
//             </Text>

//             {/* Enable Location Button */}
//             <TouchableOpacity style={styles.button} onPress={handleEnableLocation}>
//               <Text style={styles.buttonText}>Enable Location Services</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   AreaContainer: {
//     flex: 1,
//     padding: 10,
//     marginTop: 20,
//     width: "100%"
//   },
//   backgroundImage: {
//     flex: 1,
//    width:'100%',
//     opacity: 0.3,  // Adjust the opacity to make the image transparent
//   },
//   imageStyle: {
//     opacity: 0.3,  // You can adjust this value to make the image more transparent
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderColor:'black'
//   },
//   card: {
//     width: '85%',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
   
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#006E75',
//     marginBottom: 15,
//   },
//   imageContainer: {
//     width: '90%',
//     borderWidth: 1,
//     borderColor: '#2a9d8f',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 20,
//   },
//   image: {
//     width: '100%',
//     height: 150,
//   },
//   description: {
//     fontSize: 15,
//     color: '#006E75',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#00D0DD',
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

// export default LocationAccessScreen;

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import location from "../../assets/Location.png";
import dashboard from "../../assets/dashboard.png";

const LocationAccessScreen = () => {
  const handleEnableLocation = () => {
    // Handle location enable action
    console.log('Location Services Enabled');
  };

  return (
    <SafeAreaView style={styles.AreaContainer}>
      {/* Background Image with Blur */}
      <ImageBackground 
        source={dashboard} 
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
        blurRadius={10}  // Apply blur effect to the background image
      >
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Title */}
            <Text style={styles.title}>Location Access</Text>

            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={location}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Description */}
            <Text style={styles.description}>
              To search for best nearby Restaurants, we would want to know your current location
            </Text>

            {/* Enable Location Button */}
            <TouchableOpacity style={styles.button} onPress={handleEnableLocation}>
              <Text style={styles.buttonText}>Enable Location Services</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  AreaContainer: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center', // Centers the container inside the image
  },
  imageStyle: {
    opacity: 0.3,  // Optional: You can adjust this value to make the image more transparent if needed
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',  // White background for the location container
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderColor: 'black',  // Black border around the container
    borderWidth: 1,  // Optional: Border width for the black border
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#006E75',
    marginBottom: 15,
  },
  imageContainer: {
    width: '90%',
    borderWidth: 1,
  
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
  },
  description: {
    fontSize: 15,
    color: '#006E75',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#00D0DD',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LocationAccessScreen;
