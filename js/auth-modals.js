import { authAPI } from './api.js';
import { authService } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // 1. Authentication Functionality
    const loginForm = document.getElementById('signInForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('signInEmail').value.trim();
            const password = document.getElementById('signInPassword').value;
            
            // Clear previous errors
            const errorElement = document.getElementById('loginError');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }

            // Validate inputs
            if (!email || !password) {
                if (errorElement) {
                    errorElement.textContent = 'Please fill in all fields';
                    errorElement.style.display = 'block';
                }
                return;
            }

            try {
                // Call backend API for login
                const response = await authAPI.login({ email, password });
                
                // Store token
                authService.setToken(response.token);
                
                // Get user details
                const userResponse = await authAPI.getMe(response.token);
                const user = userResponse.data;
                
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    email: user.email,
                    name: user.name,
                    points: user.points || 0,
                    vehicle: user.vehicle ? `${user.vehicle.make} ${user.vehicle.model} ${user.vehicle.year}` : 'No vehicle registered',
                    phone: user.phone
                }));
                
                // Close modal if exists
                const signInModal = document.getElementById('signInModal');
                if (signInModal) {
                    signInModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // Update UI
                updateAuthUI();
                
                // Show success message
                showAlert('Login successful!', 'success');
                
                // Redirect to dashboard if on homepage
                if (window.location.pathname.endsWith('index.html') || 
                    window.location.pathname === '/') {
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                console.error('Login error:', error);
                // Show error
                if (errorElement) {
                    errorElement.textContent = error.message || 'Invalid email or password';
                    errorElement.style.display = 'block';
                }
            }
        });
    }

    // 2. Registration Functionality
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('signUpName').value.trim(),
                email: document.getElementById('signUpEmail').value.trim(),
                password: document.getElementById('signUpPassword').value,
                phone: document.getElementById('signUpPhone').value.trim(),
                drivingLicense: document.getElementById('signUpLicense').value.trim()
            };

            // Clear previous errors
            const errorElement = document.getElementById('signUpError');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }

            // Validate inputs
            if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.drivingLicense) {
                if (errorElement) {
                    errorElement.textContent = 'Please fill in all fields';
                    errorElement.style.display = 'block';
                }
                return;
            }

            try {
                // Call backend API for registration
                const response = await authAPI.register(formData);
                
                // Store token
                authService.setToken(response.token);
                
                // Get user details
                const userResponse = await authAPI.getMe(response.token);
                const user = userResponse.data;
                
                // Store user data in localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    email: user.email,
                    name: user.name,
                    points: user.points || 0,
                    vehicle: 'No vehicle registered',
                    phone: user.phone
                }));
                
                // Close modal if exists
                const signUpModal = document.getElementById('signUpModal');
                if (signUpModal) {
                    signUpModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // Update UI
                updateAuthUI();
                
                // Show success message
                showAlert('Registration successful!', 'success');
                
                // Redirect to dashboard if on homepage
                if (window.location.pathname.endsWith('index.html') || 
                    window.location.pathname === '/') {
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                console.error('Registration error:', error);
                // Show error
                if (errorElement) {
                    errorElement.textContent = error.message || 'Registration failed. Please try again.';
                    errorElement.style.display = 'block';
                }
            }
        });
    }

    // 2. Modal Handling
    const signInModal = document.getElementById('signInModal');
    const signUpModal = document.getElementById('signUpModal');
    
    // Get all possible buttons that might open modals
    const openSignInBtns = [
        document.getElementById('openSignInModal'),
        document.getElementById('navSignIn'),
        document.getElementById('ctaSignIn')
    ].filter(Boolean); // Remove null elements
    
    const openSignUpBtns = [
        document.getElementById('openSignUpModal'),
        document.getElementById('ctaSignUp')
    ].filter(Boolean);

    // Open modals
    openSignInBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (signInModal) {
                // Clear form when opening
                const form = signInModal.querySelector('form');
                if (form) form.reset();
                signInModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    openSignUpBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (signUpModal) {
                // Clear form when opening
                const form = signUpModal.querySelector('form');
                if (form) form.reset();
                signUpModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Switch between modals
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');
    
    if (switchToSignUp) {
        switchToSignUp.addEventListener('click', function(e) {
            e.preventDefault();
            if (signInModal && signUpModal) {
                signInModal.classList.remove('active');
                signUpModal.classList.add('active');
            }
        });
    }
    
    if (switchToSignIn) {
        switchToSignIn.addEventListener('click', function(e) {
            e.preventDefault();
            if (signUpModal && signInModal) {
                signUpModal.classList.remove('active');
                signInModal.classList.add('active');
            }
        });
    }
    
    // Close modals
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (signInModal) signInModal.classList.remove('active');
            if (signUpModal) signUpModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', function(e) {
        if (e.target === signInModal) {
            signInModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (e.target === signUpModal) {
            signUpModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 3. Session Management
    // Check if user is logged in when loading dashboard pages
    if (window.location.pathname.includes('dashboard')) {
        if (!authService.isAuthenticated()) {
            window.location.href = 'index.html';
        } else {
            try {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                if (document.getElementById('userName')) {
                    document.getElementById('userName').textContent = user.name;
                }
                if (document.getElementById('userPoints')) {
                    document.getElementById('userPoints').textContent = user.points;
                }
                if (document.getElementById('userVehicle')) {
                    document.getElementById('userVehicle').textContent = user.vehicle;
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('currentUser');
                authService.removeToken();
                window.location.href = 'index.html';
            }
        }
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            authService.removeToken();
            updateAuthUI();
            window.location.href = 'index.html';
        });
    }

    // Update authentication UI state
    function updateAuthUI() {
        const isAuthenticated = authService.isAuthenticated();
        
        // Update navigation
        const navSignIn = document.getElementById('navSignIn');
        const userMenu = document.getElementById('userMenu');
        
        if (navSignIn) navSignIn.style.display = isAuthenticated ? 'none' : 'block';
        if (userMenu) userMenu.style.display = isAuthenticated ? 'block' : 'none';
        
        // Update dashboard elements if on dashboard
        if (window.location.pathname.includes('dashboard') && isAuthenticated) {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user) {
                if (document.getElementById('userName')) {
                    document.getElementById('userName').textContent = user.name;
                }
                if (document.getElementById('userPoints')) {
                    document.getElementById('userPoints').textContent = user.points;
                }
                if (document.getElementById('userVehicle')) {
                    document.getElementById('userVehicle').textContent = user.vehicle;
                }
            }
        }
    }

    // Initialize UI state
    updateAuthUI();
});

// Helper function to show alerts
function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer') || createAlertContainer();
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);
    
    // Show alert
    setTimeout(() => {
        alert.style.opacity = '1';
    }, 10);
    
    // Hide after 5 seconds
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 5000);
}

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alertContainer';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
    return container;
}