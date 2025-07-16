// trips.js - Trips Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const logoutBtn = document.getElementById('logoutBtn');
    const exportBtn = document.getElementById('exportTrips');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const timeFilter = document.getElementById('timeFilter');
    const tripTypeFilter = document.getElementById('tripTypeFilter');
    const scoreFilter = document.getElementById('scoreFilter');
    const detailButtons = document.querySelectorAll('.btn-details');
    const paginationButtons = document.querySelectorAll('.btn-pagination');

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to log out?')) {
            window.location.href = 'index.html';
        }
    });

    // Export trips
    exportBtn.addEventListener('click', function() {
        alert('Your trip data will be exported as a CSV file.\n\nIn a full implementation, this would download your trip history.');
    });

    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        const timeValue = timeFilter.value;
        const tripTypeValue = tripTypeFilter.value;
        const scoreValue = scoreFilter.value;
        
        alert(`Filters applied:\nTime: ${timeFilter.options[timeFilter.selectedIndex].text}\nTrip Type: ${tripTypeFilter.options[tripTypeFilter.selectedIndex].text}\nScore: ${scoreFilter.options[scoreFilter.selectedIndex].text}`);
        
        // In a real app, this would filter the trip list
    });

    // Trip detail buttons
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tripCard = this.closest('.trip-card');
            const tripTitle = tripCard.querySelector('h3').textContent;
            alert(`Showing detailed view for trip: ${tripTitle}\n\nIn the full application, this would show a detailed trip analysis.`);
        });
    });

    // Pagination buttons
    paginationButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const action = this.textContent.trim().includes('Previous') ? 'previous' : 'next';
                alert(`Loading ${action} page of trips...`);
                
                // In a real app, this would load the next/previous page of trips
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