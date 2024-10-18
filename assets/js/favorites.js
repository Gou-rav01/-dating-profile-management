class FavoritesManager {
    constructor() {
        this.favorites = new Set();
        this.listeners = new Set();
        this.init();
    }

    async init() {
        try {
            await this.loadFavorites();
        } catch (error) {
            console.error('Error initializing favorites:', error);
        }
    }

    async loadFavorites() {
        try {
            const response = await apiService.getFavorites();
            // Extract favorites from the nested structure
            const favoritesArray = Object.values(response.favorites)[0] || [];
            this.favorites = new Set(favoritesArray);
            this.notifyListeners();
        } catch (error) {
            console.error('Error loading favorites:', error);
            throw error;
        }
    }

    isFavorite(profileId) {
        return this.favorites.has(profileId);
    }

    async toggleFavorite(profileId) {
        try {
            if (this.isFavorite(profileId)) {
                await this.removeFavorite(profileId);
            } else {
                await this.addFavorite(profileId);
            }
            return true;
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    }

    async addFavorite(profileId) {
        try {
            await apiService.addFavorite(profileId);
            this.favorites.add(profileId);
            this.notifyListeners();
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    }

    async removeFavorite(profileId) {
        try {
            await apiService.removeFavorite(profileId);
            this.favorites.delete(profileId);
            this.notifyListeners();
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(Array.from(this.favorites)));
    }

    getFavoriteIds() {
        return Array.from(this.favorites);
    }
}

const favoritesManager = new FavoritesManager();
window.favoritesManager = favoritesManager;