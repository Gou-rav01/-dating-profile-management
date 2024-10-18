class ProfileList {
  constructor() {
    this.profiles = [];
    this.loading = false;
    this.error = null;
    this.filterText = "";
    this.showFavoritesOnly = false;
    // DOM Elements
    this.container = document.getElementById("profilesContainer");
    this.loadingElement = document.getElementById("loading");
    this.searchInput = document.getElementById("searchInput");
    this.showFavoritesToggle = document.getElementById("showFavorites");
    this.init();
  }

  async init() {
    try {
      this.setupEventListeners();
      await favoritesManager.init(); // Ensure favorites are loaded before profiles
      await this.loadProfiles();
    } catch (error) {
      this.handleError(error);
    }
  }

  setupEventListeners() {
    this.searchInput?.addEventListener("input", (e) => {
      this.filterText = e.target.value.toLowerCase();
      this.renderProfiles();
    });

    this.showFavoritesToggle?.addEventListener("change", (e) => {
      this.showFavoritesOnly = e.target.checked;
      this.renderProfiles();
    });

    favoritesManager.addListener(() => {
      this.renderProfiles();
    });
  }

  async loadProfiles() {
    try {
      this.setLoading(true);
      this.profiles = await apiService.getProfiles();
      this.renderProfiles();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.loading = loading;
    if (this.loadingElement) {
      this.loadingElement.style.display = loading ? "block" : "none";
    }
  }

  handleError(error) {
    this.error = error.message;
    this.renderError();
  }

  renderError() {
    if (this.container) {
      this.container.innerHTML = `
                <div class="error-message">
                    <p>${this.error}</p>
                    <button onclick="profileList.loadProfiles()">Try Again</button>
                </div>
            `;
    }
  }

  filterProfiles() {
    let filtered = this.profiles;

    if (this.filterText) {
      filtered = filtered.filter(
        (profile) =>
          profile.name.toLowerCase().includes(this.filterText) ||
          profile.city.toLowerCase().includes(this.filterText)
      );
    }

    if (this.showFavoritesOnly) {
      const favoriteIds = favoritesManager.getFavoriteIds();
      filtered = filtered.filter((profile) => favoriteIds.includes(profile.id));
    }

    return filtered;
  }

  createProfileCard(profile) {
    const isFavorite = favoritesManager.isFavorite(profile.id);
    return `
            <div class="profile-card" data-id="${
              profile.id
            }" onclick="window.location.href='profile.html?id=${profile.id}'">
                <img src="${profile.avatar}" alt="${
      profile.name
    }" loading="lazy" class="profile-image" 
                    onerror="this.src='assets/img/3.jpg'">
                <button class="favorite-btn ${isFavorite ? "active" : ""}" 
                    onclick="profileList.handleFavoriteClick(${
                      profile.id
                    }, event)">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
                <div class="profile-info">
                    <h3 class="profile-name">${profile.name}, ${
      profile.age
    }</h3>
                    <div id="details-info">    
                    <p class="profile-details">${profile.city}</p>
                    <span class="badge ${
                      profile.relationship_status === "Married"
                        ? "badge-married"
                        : "badge-single"
                    }">
                        ${profile.relationship_status}
                    </span>
                    </div>
                </div>
            </div>
        `;
  }

  renderProfiles() {
    if (!this.container) return;
    const filtered = this.filterProfiles();
    if (filtered.length === 0) {
      this.container.innerHTML = `
                <div class="no-results">
                    <p>No profiles found${
                      this.filterText ? ' for "' + this.filterText + '"' : ""
                    }.</p>
                </div>
            `;
      return;
    }

    this.container.innerHTML = filtered
      .map((profile) => this.createProfileCard(profile))
      .join("");
  }

  async handleFavoriteClick(profileId, event) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await favoritesManager.toggleFavorite(profileId);
      this.renderProfiles();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Show error toast or notification
    }
  }
}

const profileList = new ProfileList();
window.profileList = profileList;
