document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navLinks = document.querySelectorAll('.nav-links a');
    const logoutBtn = document.getElementById('logoutBtn');
    const emergencyBtn = document.getElementById('emergencyBtn');
    
    // Highlight current tab
    function highlightCurrentTab() {
        const currentHash = window.location.hash || '#dashboard';
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }
    
    // Navigation click handlers - for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip logout button and external links
            if (this.classList.contains('btn') || 
                this.getAttribute('href').startsWith('http') ||
                this.getAttribute('href').endsWith('.html')) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Scroll to section
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL hash without page jump
                history.pushState(null, null, targetId);
                
                // Highlight current tab
                highlightCurrentTab();
            }
        });
    });
    
    // Highlight tab on page load
    highlightCurrentTab();
    
    // Handle back/forward navigation
    window.addEventListener('popstate', function() {
        highlightCurrentTab();
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Emergency button
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to trigger emergency services?')) {
                alert('Emergency services notified!');
            }
        });
    }
    
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNavLinks = document.querySelector('.nav-links');
    
    if (hamburger && mobileNavLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNavLinks.classList.remove('active');
            });
        });
    }
});