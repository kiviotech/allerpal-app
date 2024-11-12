import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ReservationConfirmation = () => {
  return (
    <SafeAreaView style={styles.AreaContainer}>
        <View style={styles.container}>
      {/* Restaurant Information */}
      <Text style={styles.restaurantName}>No.5 Dining & Lounge</Text>
      <Text style={styles.restaurantAddress}>5 Tottenham Ln, London N8 9DJ, United Kingdom</Text>

      {/* Checkmark Icon */}
      <View style={styles.iconContainer}>
        <FontAwesome name="check-circle" size={60} color="#00C6AE" />
      </View>

      {/* Success Message */}
      <Text style={styles.successText}>Successfully</Text>
      <Text style={styles.subSuccessText}>Reserved your table!</Text>
      <Text style={styles.reservationId}>Reservation ID: 0VGDH</Text>

      {/* Reservation Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>Dkjgnlskd</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>22/04/24</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>Dkjgnlskd</Text>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>22/04/24</Text>
          </View>
        </View>

        <View style={styles.detailRowN}>
          <Text style={styles.detailLabelN}>Number of Guests</Text>
          <Text style={styles.detailValueN}>4</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.buttonPrimary}>
        <Text style={styles.buttonPrimaryText}>View E-Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary}>
        <Text style={styles.buttonSecondaryText}>Cancel Reservation</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    AreaContainer: {
        flex: 1,
        padding: 10,
        marginTop: 20,
        //  backgroundColor: '#fff',
        width: "100%"

    },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    marginVertical: 24,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4, // Adjust margin for spacing
  },
  subSuccessText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8, // Adjust margin for spacing
  },
  reservationId: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailColumn: {
    width: '45%',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailRowN: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailColumnN: {
    width: '45%',
  },
  detailLabelN: {
    fontSize: 14,
    color: '#888',
  },
  detailValueN: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPrimary: {
    width: '50%',
    paddingVertical: 12,
    backgroundColor: '#00D0DD',
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    width: '60%',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#00D0DD',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#00D0DD',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationConfirmation;
