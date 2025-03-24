import { create } from 'zustand';
import { fetchFavouritesByUserId, createNewFavourite, updateFavouriteData } from '../services/favouriteServices';

const useFavoritesStore = create((set, get) => ({
  favorites: [],
  favoriteDocumentId: null,
  isLoading: false,
  error: null,

  // Fetch all favorites for a user
  fetchFavorites: async (userId) => {
    if (!userId) return;

    try {
      set({ isLoading: true, error: null });
      console.log("[FavoritesStore] Fetching favorites for user:", userId);
      
      const response = await fetchFavouritesByUserId(userId);
      console.log("[FavoritesStore] API response:", response?.data);
      
      const favoriteData = response?.data?.[0];
      
      if (favoriteData) {
        console.log("[FavoritesStore] Favorite data:", favoriteData);
        // Extract menu_items array directly - it should be an array of IDs
        const favoriteIds = favoriteData.menu_items || [];
        console.log("[FavoritesStore] Found favorite items:", favoriteIds);
        set({ 
          favorites: favoriteIds,
          favoriteDocumentId: favoriteData.id
        });
      } else {
        console.log("[FavoritesStore] No favorites found");
        set({ favorites: [], favoriteDocumentId: null });
      }
    } catch (error) {
      console.error("[FavoritesStore] Error fetching favorites:", error);
      console.error("[FavoritesStore] Error details:", error.response?.data || error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle favorite status for an item
  toggleFavorite: async (userId, documentId) => {
    if (!userId) return;

    try {
      const { favorites, favoriteDocumentId } = get();
      const isFavorite = favorites.includes(documentId);
      
      // Optimistically update the UI
      const updatedFavorites = isFavorite
        ? favorites.filter(id => id !== documentId)
        : [...favorites, documentId];
      
      set({ favorites: updatedFavorites });

      if (!favoriteDocumentId) {
        // Create new favorite entry with simple array of IDs
        const newFavorite = {
          user: { id: userId },
          menu_items: updatedFavorites // Send array of IDs directly
        };
        console.log("[FavoritesStore] Creating new favorite with data:", newFavorite);
        const response = await createNewFavourite({ data: newFavorite });
        set({ favoriteDocumentId: response.data.id });
      } else {
        // Update existing favorites with simple array of IDs
        const updateData = {
          data: {
            menu_items: updatedFavorites // Send array of IDs directly
          }
        };
        console.log("[FavoritesStore] Updating favorite with data:", updateData);
        await updateFavouriteData(favoriteDocumentId, updateData);
      }

      global.EventEmitter.emit("favoritesUpdated");
    } catch (error) {
      console.error("[FavoritesStore] Error toggling favorite:", error);
      console.error("[FavoritesStore] Error details:", error.response?.data || error.message);
      // Revert the optimistic update on error
      await get().fetchFavorites(userId);
    }
  },

  // Check if an item is favorited
  isFavorite: (documentId) => {
    return get().favorites.includes(documentId);
  },

  // Clear favorites (e.g., on logout)
  clearFavorites: () => {
    set({ favorites: [], favoriteDocumentId: null, error: null });
  },
}));

export default useFavoritesStore; 