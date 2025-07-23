import { authService } from './auth.js';

export class RealtimeService {
  constructor() {
    this.socket = null;
    this.initialize();
  }

  initialize() {
    if (!authService.isAuthenticated()) return;

    // Connect to Socket.io server
    this.socket = io('http://localhost:5000', {
      auth: {
        token: authService.getToken()
      }
    });

    // Join user's room
    this.socket.emit('join', authService.getToken());

    // Set up event listeners
    this.socket.on('emergency-notification', (data) => {
      showAlert(`Emergency contact ${data.contactName} has been notified`, 'info');
    });

    this.socket.on('emergency-response', (data) => {
      showAlert(`${data.responderType} has been dispatched to your location`, 'info');
    });

    this.socket.on('trip-started', (data) => {
      // Could update UI if needed
    });

    this.socket.on('trip-completed', (data) => {
      showAlert(`Trip completed! You earned ${data.pointsEarned} points`, 'success');
    });

    this.socket.on('reward-redeemed', (data) => {
      showAlert(`Reward redeemed: ${data.rewardName}. Code: ${data.redemptionCode}`, 'success');
    });
  }
}