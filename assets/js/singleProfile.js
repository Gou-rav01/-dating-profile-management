class SingleProfile {
  constructor() {
    this.profileId = this.getProfileIdFromUrl();
    this.container = document.getElementById("profileDetail");
    this.loadingElement = document.getElementById("loading");
    this.init();
  }

  getProfileIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      window.location.href = "index.html";
      return null;
    }
    return parseInt(id);
  }

  async init() {
    try {
      this.showLoading();
      await favoritesManager.init();
      await this.loadProfile();
      this.hideLoading();
    } catch (error) {
      this.handleError(error);
    }
  }

  async loadProfile() {
    try {
      const profile = await apiService.getSingleProfile(this.profileId);
      this.renderProfile(profile);
    } catch (error) {
      throw new Error("Failed to load profile");
    }
  }

  renderProfile(profile) {
    const isFavorite = favoritesManager.isFavorite(profile.id);
    this.container.innerHTML = `
            <div class="single-profile-detail">
                <div class="profile-header">
                    <div class="image-container">
                        <img src="${profile.avatar}" alt="${
      profile.name
    }" loading="lazy" class="single-profile-image">
                    </div>
                    <button class="favorite-btn ${isFavorite ? "active" : ""}" 
                        onclick="singleProfile.handleFavoriteClick(${
                          profile.id
                        })">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                    <div class="profile-info">
                        <h1 class="profile-name">${profile.name}</h1>
                        <div class="profile-stats">
                            <div class="stat-item">
                                <div class="stat-label">Location</div>
                                <div class="stat-value">${profile.city}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Status</div>
                                <div class="stat-value">${
                                  profile.relationship_status
                                }</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Age</div>
                                <div class="stat-value">${profile.age}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  async handleFavoriteClick(profileId) {
    try {
      await favoritesManager.toggleFavorite(profileId);
      const updatedProfile = await apiService.getSingleProfile(profileId);
      this.renderProfile(updatedProfile);
    } catch (error) {
      this.handleError(error);
    }
  }

  showLoading() {
    this.loadingElement.style.display = "block";
    this.container.style.display = "none";
  }

  hideLoading() {
    this.loadingElement.style.display = "none";
    this.container.style.display = "block";
  }

  handleError(error) {
    this.hideLoading();
    this.container.innerHTML = `
            <div class="error-message">
                <p>An error occurred: ${error.message}</p>
                <button onclick="singleProfile.init()">Try Again</button>
            </div>
        `;
  }
}

const singleProfile = new SingleProfile();
window.singleProfile = singleProfile;
