import { emergenciesAPI } from './api.js';
import { authService } from './auth.js';

export class EmergencyService {
  constructor() {
    this.initialize();
  }

  initialize() {
    document.getElementById('emergencyBtn')?.addEventListener('click', () => this.triggerEmergency());
  }

  async triggerEmergency() {
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
      showAlert('Failed to send emergency alert: ' + error.message, 'error');
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async getAddress(lat, lng) {
    // In a real app, use a geocoding service
    return 'Current Location';
  }
}