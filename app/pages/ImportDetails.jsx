import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { getImportById } from '../../src/services/restaurantImportService';

/**
 * ImportDetails Screen
 * Displays detailed information about a specific import
 */
const ImportDetails = () => {
  const [importData, setImportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const params = useLocalSearchParams();
  const importId = params.id;

  /**
   * Fetch import details
   */
  const loadImportDetails = async () => {
    if (!importId) {
      setError('Import ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getImportById(importId);
      
      if (response && response.data) {
        setImportData(response.data);
      } else {
        setError('Import not found');
      }
    } catch (err) {
      setError('Failed to load import details');
      console.error('Error loading import details:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status indicator details
   */
  const getStatusIndicator = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return { icon: 'checkmark-circle', color: '#4CAF50', text: 'Successful' };
      case 'failed':
      case 'error':
        return { icon: 'close-circle', color: '#f44336', text: 'Failed' };
      case 'processing':
        return { icon: 'sync', color: '#2196F3', text: 'Processing' };
      case 'pending':
        return { icon: 'time', color: '#FFC107', text: 'Pending' };
      default:
        return { icon: 'help-circle', color: '#9E9E9E', text: 'Unknown' };
    }
  };

  // Load import details on component mount
  useEffect(() => {
    loadImportDetails();
  }, [importId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Import Details</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading import details...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={36} color="#ff3b30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadImportDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : importData ? (
        <ScrollView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.statusCard}>
              {(() => {
                const { icon, color, text } = getStatusIndicator(importData.status);
                return (
                  <>
                    <Ionicons name={icon} size={48} color={color} />
                    <View style={styles.statusTextContainer}>
                      <Text style={styles.statusTitle}>{text}</Text>
                      <Text style={styles.statusSubtitle}>
                        {importData.status === 'processing' 
                          ? 'Your import is currently being processed' 
                          : importData.status === 'failed'
                            ? 'Import failed due to errors'
                            : importData.status === 'completed'
                              ? 'Import completed successfully'
                              : 'Import is awaiting processing'}
                      </Text>
                    </View>
                  </>
                );
              })()}
            </View>
            
            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>Import Information</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>File Name</Text>
                <Text style={styles.detailValue}>
                  {importData.fileName || 'Unknown file'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Imported By</Text>
                <Text style={styles.detailValue}>
                  {importData.user?.username || 'Unknown user'}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date Created</Text>
                <Text style={styles.detailValue}>
                  {formatDate(importData.createdAt)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date Updated</Text>
                <Text style={styles.detailValue}>
                  {formatDate(importData.updatedAt)}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Import Type</Text>
                <Text style={styles.detailValue}>
                  {importData.importType || 'Standard import'}
                </Text>
              </View>
            </View>
            
            <View style={styles.statsCard}>
              <Text style={styles.sectionTitle}>Import Statistics</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{importData.totalItems || 0}</Text>
                  <Text style={styles.statLabel}>Total Items</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                    {importData.successCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>Successful</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#f44336' }]}>
                    {importData.errorCount || 0}
                  </Text>
                  <Text style={styles.statLabel}>Errors</Text>
                </View>
              </View>
            </View>
            
            {importData.errors && importData.errors.length > 0 && (
              <View style={styles.errorsCard}>
                <Text style={styles.sectionTitle}>Error Details</Text>
                
                {importData.errors.map((error, index) => (
                  <View key={index} style={styles.errorItem}>
                    <Ionicons name="alert-circle" size={16} color="#f44336" style={styles.errorIcon} />
                    <Text style={styles.errorMessage}>{error.message || 'Unknown error'}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.resultsCard}>
              <Text style={styles.sectionTitle}>Import Results</Text>
              
              <View style={styles.resultRow}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="restaurant-outline" size={24} color="#007AFF" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultTitle}>Restaurants</Text>
                  <Text style={styles.resultValue}>
                    {importData.restaurantCount || 0} imported
                  </Text>
                </View>
              </View>
              
              <View style={styles.resultRow}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="list-outline" size={24} color="#007AFF" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultTitle}>Menus</Text>
                  <Text style={styles.resultValue}>
                    {importData.menuCount || 0} imported
                  </Text>
                </View>
              </View>
              
              <View style={styles.resultRow}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="fast-food-outline" size={24} color="#007AFF" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultTitle}>Menu Items</Text>
                  <Text style={styles.resultValue}>
                    {importData.menuItemCount || 0} imported
                  </Text>
                </View>
              </View>
              
              <View style={styles.resultRow}>
                <View style={styles.resultIconContainer}>
                  <Ionicons name="warning-outline" size={24} color="#007AFF" />
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultTitle}>Allergens</Text>
                  <Text style={styles.resultValue}>
                    {importData.allergenCount || 0} imported
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.actionsCard}>
              {importData.status === 'failed' && (
                <TouchableOpacity 
                  style={styles.retryImportButton}
                  onPress={() => Alert.alert(
                    'Retry Import', 
                    'Are you sure you want to retry this import?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Retry', 
                        style: 'default',
                        onPress: () => console.log('Retry import:', importId) 
                      }
                    ]
                  )}
                >
                  <Ionicons name="refresh" size={18} color="#fff" style={styles.actionButtonIcon} />
                  <Text style={styles.actionButtonText}>Retry Import</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.newImportButton}
                onPress={() => router.push('/RestaurantImport')}
              >
                <Ionicons name="add" size={18} color="#fff" style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>New Import</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Import not found</Text>
          <TouchableOpacity
            style={styles.newImportButton}
            onPress={() => router.push('/RestaurantImport')}
          >
            <Text style={styles.newImportButtonText}>Go to Import Page</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 15,
  },
  newImportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statusTextContainer: {
    marginLeft: 15,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  errorsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  errorIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  errorMessage: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  resultTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  resultValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  retryImportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  newImportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImportDetails; 