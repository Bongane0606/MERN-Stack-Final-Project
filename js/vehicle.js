// vehicle.js - Vehicle Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const logoutBtn = document.getElementById('logoutBtn');
    const addVehicleBtn = document.getElementById('addVehicle');
    const vehicleSettingsBtn = document.getElementById('vehicleSettings');
    const addMaintenanceBtn = document.getElementById('addMaintenance');
    const alertFilter = document.getElementById('alertFilter');
    const resolveButtons = document.querySelectorAll('.btn-action.resolve');

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'index.html';
        }
    });

    // Add vehicle
    addVehicleBtn.addEventListener('click', function() {
        alert('Opening vehicle addition form...\n\nIn the full application, this would let you add another vehicle to your profile.');
    });

    // Vehicle settings
    vehicleSettingsBtn.addEventListener('click', function() {
        alert('Opening vehicle settings...\n\nIn the full application, this would show vehicle configuration options.');
    });

    // Add maintenance reminder
    addMaintenanceBtn.addEventListener('click', function() {
        alert('Opening maintenance reminder form...\n\nIn the full application, this would let you create custom maintenance reminders.');
    });

    // Filter alerts
    alertFilter.addEventListener('change', function() {
        const filterValue = this.value;
        alert(`Showing ${filterValue === 'all' ? 'all' : filterValue} priority alerts...`);
        
        // In a real app, this would filter the alert list
    });

    // Resolve alert buttons
    resolveButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const alertItem = this.closest('.alert-item');
            const alertTitle = alertItem.querySelector('h3').textContent;
            
            if (confirm(`Mark "${alertTitle}" as resolved?`)) {
                alertItem.style.opacity = '0.5';
                alertItem.style.textDecoration = 'line-through';
                setTimeout(() => {
                    alertItem.remove();
                    alert('Alert marked as resolved and will be removed from your active alerts.');
                }, 1000);
            }
        });
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