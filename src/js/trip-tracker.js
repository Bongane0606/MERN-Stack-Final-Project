import { tripsAPI } from './api.js';
import { authService } from './auth.js';

export class TripTracker {
  constructor() {
    this.currentTrip = null;
    this.tripInterval = null;
    this.initialize();
  }

  initialize() {
    // Start trip button
    document.getElementById('startTripBtn')?.addEventListener('click', () => this.startTrip());
    
    // End trip button
    document.getElementById('endTripBtn')?.addEventListener('click', () => this.endTrip());
  }

  async startTrip() {
    try {
      const position = await this.getCurrentPosition();
      
      this.currentTrip = {
        startTime: new Date(),
        startLocation: {
          type: 'Point',
          coordinates: [position.coords.longitude, position.coords.latitude],
          address: await this.getAddress(position.coords.latitude, position.coords.longitude)
        },
        distance: 0,
        events: []
      };

      // Show trip UI
      document.querySelector('.trip-controls').style.display = 'flex';
      
      // Start tracking
      this.tripInterval = setInterval(() => this.updateTripData(), 5000);
      
      showAlert('Trip started! Drive safely!', 'success');
    } catch (error) {
      showAlert('Failed to start trip: ' + error.message, 'error');
    }
  }

  async endTrip() {
    if (!this.currentTrip) return;

    try {
      const position = await this.getCurrentPosition();
      
      this.currentTrip.endTime = new Date();
      this.currentTrip.endLocation = {
        type: 'Point',
        coordinates: [position.coords.longitude, position.coords.latitude],
        address: await this.getAddress(position.coords.latitude, position.coords.longitude)
      };

      // Stop tracking
      clearInterval(this.tripInterval);
      
      // Save trip to backend
      const token = authService.getToken();
      const savedTrip = await tripsAPI.createTrip(this.currentTrip, token);
      
      // Calculate score
      const scoreData = await tripsAPI.calculateScore(savedTrip.data._id, token);
      
      // Update UI
      document.querySelector('.trip-controls').style.display = 'none';
      this.currentTrip = null;
      
      showAlert(`Trip completed! You earned ${scoreData.data.pointsEarned} points!`, 'success');
    } catch (error) {
      showAlert('Failed to end trip: ' + error.message, 'error');
    }
  }

  updateTripData() {
    // Simulate distance update (in a real app, use GPS data)
    if (this.currentTrip) {
      this.currentTrip.distance += 0.2; // Add 0.2 miles every 5 seconds
      document.getElementById('tripDistance').textContent = 
        `${this.currentTrip.distance.toFixed(1)} miles`;
      
      // Update duration
      const duration = (new Date() - this.currentTrip.startTime) / 1000;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      document.getElementById('tripDuration').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
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