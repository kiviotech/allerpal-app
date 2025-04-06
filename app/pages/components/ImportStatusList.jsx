import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listImports, getImportById } from '../../../src/services/restaurantImportService';

/**
 * Import Status List Component
 * Displays a list of import history with status and details
 */
const ImportStatusList = ({ limit = 5, showHeader = true, onViewDetails }) => {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch import history data
   */
  const loadImports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await listImports(1, limit);
      
      if (response && response.data) {
        setImports(response.data);
      }
    } catch (err) {
      setError('Failed to load import history');
      console.error('Error loading imports:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle refresh action
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadImports();
    setRefreshing(false);
  };

  /**
   * Handle view details action
   */
  const handleViewDetails = async (id) => {
    try {
      const importDetails = await getImportById(id);
      
      if (onViewDetails) {
        onViewDetails(importDetails);
      }
    } catch (err) {
      console.error('Error fetching import details:', err);
    }
  };

  /**
   * Format timestamp to readable date
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * Get status icon and color
   */
  const getStatusIndicator = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return { icon: 'checkmark-circle', color: '#4CAF50' };
      case 'failed':
      case 'error':
        return { icon: 'close-circle', color: '#f44336' };
      case 'processing':
        return { icon: 'sync', color: '#2196F3' };
      case 'pending':
        return { icon: 'time', color: '#FFC107' };
      default:
        return { icon: 'help-circle', color: '#9E9E9E' };
    }
  };

  // Load imports on component mount
  useEffect(() => {
    loadImports();
  }, []);

  // Render empty state
  if (!loading && imports.length === 0) {
    return (
      <View style={styles.container}>
        {showHeader && (
          <Text style={styles.title}>Recent Imports</Text>
        )}
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No import history found</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showHeader && (
        <Text style={styles.title}>Recent Imports</Text>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading import history...</Text>
        </View>
      ) : (
        <>
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={24} color="#ff3b30" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={imports}
              keyExtractor={(item) => item.id.toString()}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              renderItem={({ item }) => {
                const { icon, color } = getStatusIndicator(item.status);
                
                return (
                  <View style={styles.importItem}>
                    <View style={styles.importHeader}>
                      <View style={styles.statusContainer}>
                        <Ionicons name={icon} size={16} color={color} />
                        <Text style={[styles.statusText, { color }]}>
                          {item.status || 'Unknown'}
                        </Text>
                      </View>
                      <Text style={styles.dateText}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                    
                    <View style={styles.importDetails}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {item.fileName || 'Import file'}
                      </Text>
                      
                      <Text style={styles.statsText}>
                        {`${item.totalItems || 0} items`}
                        {item.successCount !== undefined && (
                          ` • ${item.successCount} successful`
                        )}
                        {item.errorCount > 0 && (
                          ` • ${item.errorCount} errors`
                        )}
                      </Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.detailsButton}
                      onPress={() => handleViewDetails(item.id)}
                    >
                      <Text style={styles.detailsButtonText}>View Details</Text>
                      <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                    </TouchableOpacity>
                  </View>
                );
              }}
              ListFooterComponent={
                imports.length > 0 && (
                  <TouchableOpacity 
                    style={styles.viewAllButton}
                    onPress={() => onViewDetails && onViewDetails({ action: 'viewAll' })}
                  >
                    <Text style={styles.viewAllButtonText}>View All Imports</Text>
                  </TouchableOpacity>
                )
              }
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 10,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 15,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF2F2',
    borderRadius: 8,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  importItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 15,
  },
  importHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  importDetails: {
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  statsText: {
    fontSize: 13,
    color: '#666',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
  viewAllButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ImportStatusList; 