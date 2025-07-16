// rewards.js - Rewards Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const logoutBtn = document.getElementById('logoutBtn');
    const rewardsHistoryBtn = document.getElementById('rewardsHistory');
    const howItWorksBtn = document.getElementById('howItWorks');
    const rewardFilter = document.getElementById('rewardFilter');
    const redeemButtons = document.querySelectorAll('.btn-reward');
    const viewAllHistoryBtn = document.querySelector('.view-all');

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'index.html';
        }
    });

    // Rewards history
    rewardsHistoryBtn.addEventListener('click', function() {
        alert('Opening rewards redemption history...\n\nIn the full application, this would show your complete rewards history.');
    });

    // How it works
    howItWorksBtn.addEventListener('click', function() {
        alert('Showing rewards program explanation...\n\nIn the full application, this would explain how to earn and redeem points.');
    });

    // Filter rewards
    rewardFilter.addEventListener('change', function() {
        const filterValue = this.value;
        alert(`Showing ${filterValue === 'all' ? 'all' : filterValue} rewards...`);
        
        // In a real app, this would filter the rewards list
    });

    // Redeem reward buttons
    redeemButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const rewardCard = this.closest('.reward-card');
            const rewardTitle = rewardCard.querySelector('h3').textContent;
            const pointsRequired = rewardCard.querySelector('.points').textContent;
            
            if (confirm(`Redeem ${pointsRequired} points for "${rewardTitle}"?`)) {
                alert(`Congratulations! You've successfully redeemed your points for "${rewardTitle}".\n\nIn the full application, the reward would be processed and delivered.`);
            }
        });
    });

    // View all history
    viewAllHistoryBtn.addEventListener('click', function() {
        alert('Loading complete points history...\n\nIn the full application, this would show your full points earning and redemption history.');
    });

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
});