import { rewardsAPI } from './api.js';
import { authService } from './auth.js';

export class RewardsSystem {
  constructor() {
    this.initialize();
  }

  async initialize() {
    if (!authService.isAuthenticated()) return;
    
    try {
      const token = authService.getToken();
      const response = await rewardsAPI.getRewards(token);
      this.displayRewards(response.data);
    } catch (error) {
      showAlert('Failed to load rewards: ' + error.message, 'error');
    }
  }

  displayRewards(rewards) {
    const container = document.getElementById('rewardsContainer');
    if (!container) return;

    container.innerHTML = rewards.map(reward => `
      <div class="reward-card">
        <h3>${reward.name}</h3>
        <p>${reward.description}</p>
        <div class="reward-points">${reward.pointsRequired} points</div>
        <button class="btn btn-primary redeem-btn" data-id="${reward._id}">
          Redeem
        </button>
      </div>
    `).join('');

    // Add event listeners to redeem buttons
    document.querySelectorAll('.redeem-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const rewardId = btn.dataset.id;
        await this.redeemReward(rewardId);
      });
    });
  }

  async redeemReward(rewardId) {
    if (!confirm('Are you sure you want to redeem this reward?')) return;

    try {
      const token = authService.getToken();
      const response = await rewardsAPI.redeemReward(rewardId, token);
      
      showAlert(`Reward redeemed! Your code: ${response.data.redemptionCode}`, 'success');
      
      // Refresh rewards list
      this.initialize();
    } catch (error) {
      showAlert('Failed to redeem reward: ' + error.message, 'error');
    }
  }
}