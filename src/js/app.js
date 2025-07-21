import { authService } from './auth.js';
import { TripTracker } from './trip-tracker.js';
import { EmergencyService } from './emergency-service.js';
import { RewardsSystem } from './rewards-system.js';
import { RealtimeService } from './realtime-service.js';

class SafeDriveApp {
  constructor() {
    this.tripTracker = new TripTracker();
    this.emergencyService = new EmergencyService();
    this.rewardsSystem = new RewardsSystem();
    this.realtimeService = new RealtimeService();
    this.initialize();
  }

  initialize() {
    this.setupEventListeners();
    this.checkAuthState();
  }

  checkAuthState() {
    if (window.location.pathname.includes('dashboard') && !authService.isAuthenticated()) {
      window.location.href = 'index.html';
    }
  }

  setupEventListeners() {
    // Emergency button
    const emergencyBtn = document.getElementById('emergencyBtn');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => this.handleEmergency());
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authService.removeToken();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
      });
    }

    // Modal open buttons
    const openSignInBtns = [
      document.getElementById('openSignInModal'),
      document.getElementById('navSignIn'),
      document.getElementById('ctaSignIn')
    ].filter(Boolean);
    
    const openSignUpBtns = [
      document.getElementById('openSignUpModal'),
      document.getElementById('ctaSignUp')
    ].filter(Boolean);

    openSignInBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const signInModal = document.getElementById('signInModal');
        if (signInModal) signInModal.style.display = 'block';
      });
    });
    
    openSignUpBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const signUpModal = document.getElementById('signUpModal');
        if (signUpModal) signUpModal.style.display = 'block';
      });
    });

    // Modal close buttons
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const signInModal = document.getElementById('signInModal');
        const signUpModal = document.getElementById('signUpModal');
        if (signInModal) signInModal.style.display = 'none';
        if (signUpModal) signUpModal.style.display = 'none';
      });
    });
  }

  async handleEmergency() {
    if (!confirm('Are you sure you want to trigger an emergency alert?')) return;

    try {
      const position = await this.getCurrentPosition();
      const token = authService.getToken();
      
      const emergencyData = {
        location: {
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude],
          address: await this.getAddress(position.coords.latitude, position.coords.longitude)
        },
        emergencyType: 'accident'
      };

      await emergenciesAPI.createEmergency(emergencyData, token);
      showAlert('Emergency alert sent! Help is on the way.', 'success');
    } catch (error) {
      console.error('Error sending emergency:', error);
      showAlert('Failed to send emergency alert: ' + error.message, 'error');
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }

  async getAddress(lat, lng) {
    // In a real app, you would use a geocoding service here
    return 'Approximate location';
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SafeDriveApp();
});