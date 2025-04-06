import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { listImports, getImportById } from '../../src/services/restaurantImportService';

/**
 * ImportHistory Screen
 * Displays a full list of import history with filter options
 */
const ImportHistory = () => {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const pageSize = 15;

  /**
   * Fetch imports with current page and filters
   */
  const loadImports = async (resetPage = false) => {
    try {
      const currentPage = resetPage ? 1 : page;
      setLoading(true);
      setError(null);
      
      // Add status filter to API call if needed
      const response = await listImports(currentPage, pageSize);
      
      if (response) {
        if (resetPage) {
          setImports(response.data || []);
          setPage(1);
        } else {
          setImports(prev => [...prev, ...(response.data || [])]);
        }
        
        // Set pagination info
        setTotalPages(Math.ceil((response.meta?.pagination?.total || 0) / pageSize));
      }
    } catch (err) {
      setError('Failed to load imports');
      console.error('Import history error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load more imports when reaching end of list
   */
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prev => prev + 1);
    }
  };

  /**
   * Refresh the list
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadImports(true);
    setRefreshing(false);
  };

  /**
   * Filter imports by status
   */
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    loadImports(true);
  };

  /**
   * View details of a specific import
   */
  const handleViewDetails = async (id) => {
    try {
      // Navigate to details page with the import ID
      router.push({
        pathname: '/ImportDetails',
        params: { id }
      });
    } catch (err) {
      console.error('Error navigating to details:', err);
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

  // Load imports on component mount and when page changes
  useEffect(() => {
    loadImports();
  }, [page]);

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
        <Text style={styles.headerTitle}>Import History</Text>
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filterLabel}>Filter by status:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              statusFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilter('all')}
          >
            <Text 
              style={[
                styles.filterButtonText, 
                statusFilter === 'all' && styles.filterButtonTextActive
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              statusFilter === 'success' && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilter('success')}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={14} 
              color={statusFilter === 'success' ? "#fff" : "#4CAF50"} 
            />
            <Text 
              style={[
                styles.filterButtonText, 
                statusFilter === 'success' && styles.filterButtonTextActive
              ]}
            >
              Successful
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              statusFilter === 'failed' && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilter('failed')}
          >
            <Ionicons 
              name="close-circle" 
              size={14} 
              color={statusFilter === 'failed' ? "#fff" : "#f44336"} 
            />
            <Text 
              style={[
                styles.filterButtonText, 
                statusFilter === 'failed' && styles.filterButtonTextActive
              ]}
            >
              Failed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              statusFilter === 'processing' && styles.filterButtonActive
            ]}
            onPress={() => handleStatusFilter('processing')}
          >
            <Ionicons 
              name="sync" 
              size={14} 
              color={statusFilter === 'processing' ? "#fff" : "#2196F3"} 
            />
            <Text 
              style={[
                styles.filterButtonText, 
                statusFilter === 'processing' && styles.filterButtonTextActive
              ]}
            >
              Processing
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {loading && imports.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading import history...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={36} color="#ff3b30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={imports}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#007AFF"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No imports found</Text>
              <Text style={styles.emptySubtext}>
                Try a different filter or import a new restaurant file
              </Text>
              <TouchableOpacity
                style={styles.newImportButton}
                onPress={() => router.push('/RestaurantImport')}
              >
                <Text style={styles.newImportButtonText}>
                  New Import
                </Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const { icon, color } = getStatusIndicator(item.status);
            
            return (
              <TouchableOpacity
                style={styles.importItem}
                onPress={() => handleViewDetails(item.id)}
              >
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
                
                <View style={styles.importContent}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {item.fileName || 'Import file'}
                  </Text>
                  
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Total Items:</Text>
                      <Text style={styles.statValue}>{item.totalItems || 0}</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Successful:</Text>
                      <Text style={styles.statValue}>{item.successCount || 0}</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Errors:</Text>
                      <Text style={styles.statValue}>{item.errorCount || 0}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.importFooter}>
                  <Text style={styles.userText} numberOfLines={1}>
                    By: {item.user?.username || 'Unknown User'}
                  </Text>
                  <View style={styles.viewDetailsContainer}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={14} color="#007AFF" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={
            loading && imports.length > 0 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.footerLoadingText}>Loading more...</Text>
              </View>
            ) : null
          }
        />
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
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  newImportButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  newImportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  importItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  importHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  importContent: {
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  importFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  userText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 2,
  },
  footerLoading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  footerLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default ImportHistory; 