import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GEO_ERROR_CODES, checkLocationServicesAvailable } from '../utils/geolocationService';

/**
 * Component to handle location errors and provide guidance to users
 * 
 * @param {Object} props
 * @param {Object} props.error - The geolocation error object
 * @param {Function} props.onRetry - Function to call when retrying location fetch
 * @param {boolean} props.compact - Whether to show a compact version
 */
const LocationErrorHandler = ({ error, onRetry, compact = false }) => {
  if (!error) return null;

  const getErrorIcon = () => {
    switch (error.code) {
      case GEO_ERROR_CODES.PERMISSION_DENIED:
        return 'ios-lock-closed';
      case GEO_ERROR_CODES.POSITION_UNAVAILABLE:
        return 'ios-location-off';
      case GEO_ERROR_CODES.TIMEOUT:
        return 'ios-time';
      default:
        return 'ios-warning';
    }
  };

  const getErrorTitle = () => {
    switch (error.code) {
      case GEO_ERROR_CODES.PERMISSION_DENIED:
        return 'Location Permission Denied';
      case GEO_ERROR_CODES.POSITION_UNAVAILABLE:
        return 'Location Unavailable';
      case GEO_ERROR_CODES.TIMEOUT:
        return 'Location Request Timed Out';
      default:
        return 'Location Error';
    }
  };

  const getErrorAction = () => {
    switch (error.code) {
      case GEO_ERROR_CODES.PERMISSION_DENIED:
        return (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={openSettings}
          >
            <Text style={styles.actionButtonText}>Open Settings</Text>
          </TouchableOpacity>
        );
      case GEO_ERROR_CODES.POSITION_UNAVAILABLE:
        return (
          <View style={styles.actionButtonGroup}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={openSettings}
            >
              <Text style={styles.actionButtonText}>Open Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.retryButton]}
              onPress={onRetry}
            >
              <Text style={styles.actionButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return (
          <TouchableOpacity 
            style={[styles.actionButton, styles.retryButton]}
            onPress={onRetry}
          >
            <Text style={styles.actionButtonText}>Retry</Text>
          </TouchableOpacity>
        );
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Compact version for in-line use
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Ionicons name={getErrorIcon()} size={18} color="#ff4500" />
        <Text style={styles.compactText}>{error.message}</Text>
        <TouchableOpacity onPress={onRetry} style={styles.compactRetry}>
          <Text style={styles.compactRetryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Full version for dedicated error screens
  return (
    <View style={styles.container}>
      <Ionicons name={getErrorIcon()} size={64} color="#ff4500" />
      <Text style={styles.title}>{getErrorTitle()}</Text>
      <Text style={styles.message}>{error.message}</Text>
      {getErrorAction()}
      
      {error.code === GEO_ERROR_CODES.POSITION_UNAVAILABLE && (
        <View style={styles.helpTips}>
          <Text style={styles.helpTipsTitle}>Troubleshooting Tips:</Text>
          <Text style={styles.helpTipsText}>• Make sure location services are enabled</Text>
          <Text style={styles.helpTipsText}>• Check if you have a GPS signal or network connectivity</Text>
          <Text style={styles.helpTipsText}>• Try moving to a location with better GPS reception</Text>
          <Text style={styles.helpTipsText}>• Ensure you're not in airplane mode</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#00aced',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: '#5cb85c',
    marginLeft: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  helpTips: {
    marginTop: 24,
    alignSelf: 'stretch',
  },
  helpTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  helpTipsText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  compactText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    marginLeft: 8,
  },
  compactRetry: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compactRetryText: {
    color: '#007bff',
    fontSize: 13,
    fontWeight: '600',
  }
});

export default LocationErrorHandler; 