class ApiService {
  constructor() {
      this.baseUrl = 'https://fa.bdtechnologies.ch/api/v1';
      this.cache = new Map();
      this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async fetchWithTimeout(url, options = {}, timeout = 5000) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      
      try {
          const response = await fetch(url, {
              ...options,
              signal: controller.signal,
              headers: {
                  'Content-Type': 'application/json',
                  ...options.headers,
              }
          });
          clearTimeout(id);
          
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response;
      } catch (error) {
          clearTimeout(id);
          throw error;
      }
  }

  getCacheKey(url, options = {}) {
      return `${options.method || 'GET'}-${url}`;
  }

  setCacheItem(key, data) {
      this.cache.set(key, {
          data,
          timestamp: Date.now()
      });
  }

  getCacheItem(key) {
      const item = this.cache.get(key);
      if (!item) return null;
      
      if (Date.now() - item.timestamp > this.cacheTimeout) {
          this.cache.delete(key);
          return null;
      }
      return item.data;
  }

  async getProfiles() {
      const url = `${this.baseUrl}/profiles`;
      const cacheKey = this.getCacheKey(url);
      
      try {
          const cachedData = this.getCacheItem(cacheKey);
          if (cachedData) return cachedData;

          const response = await this.fetchWithTimeout(url);
          const data = await response.json();
          this.setCacheItem(cacheKey, data.profiles);
          return data.profiles;
      } catch (error) {
          console.error('Error fetching profiles:', error);
          throw new Error('Failed to fetch profiles. Please try again later.');
      }
  }

  async getSingleProfile(id) {
      const url = `${this.baseUrl}/profiles/${id}`;
      const cacheKey = this.getCacheKey(url);

      try {
          const cachedData = this.getCacheItem(cacheKey);
          if (cachedData) return cachedData;

          const response = await this.fetchWithTimeout(url);
          const data = await response.json();
          this.setCacheItem(cacheKey, data);
          return data;
      } catch (error) {
          console.error('Error fetching profile:', error);
          throw new Error('Failed to fetch profile details. Please try again later.');
      }
  }

  async getAccount() {
      const url = `${this.baseUrl}/account`;
      try {
          const response = await this.fetchWithTimeout(url);
          return await response.json();
      } catch (error) {
          console.error('Error fetching account:', error);
          throw new Error('Failed to fetch account information. Please try again later.');
      }
  }

  async getFavorites() {
    const url = `${this.baseUrl}/favorites`;
    try {
        const response = await this.fetchWithTimeout(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw new Error('Failed to fetch favorites. Please try again later.');
    }
}

async addFavorite(profileId) {
    try {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/favorites`, {
            method: 'POST',
            body: JSON.stringify({ profileId })
        });
        const result = await response.json();
        this.clearProfileCache();
        return result;
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw new Error('Failed to add favorite. Please try again later.');
    }
}

async removeFavorite(profileId) {
    try {
        const response = await this.fetchWithTimeout(`${this.baseUrl}/favorites`, {
            method: 'DELETE',
            body: JSON.stringify({ profileId })
        });
        this.clearProfileCache();
        return response.ok;
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw new Error('Failed to remove favorite. Please try again later.');
    }
}


  clearProfileCache() {
      for (const key of this.cache.keys()) {
          if (key.includes('/profiles') || key.includes('/favorites')) {
              this.cache.delete(key);
          }
      }
  }
}

// Assign apiService to the window object for global access
const apiService = new ApiService();
window.apiService = apiService;
