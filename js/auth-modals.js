// Combined Authentication and Modal Handling
document.addEventListener('DOMContentLoaded', function() {
    // 1. Authentication Functionality
    const userDatabase = {
        "user@example.com": {
            password: "SafeDrive123",
            name: "John Driver",
            points: 1250,
            vehicle: "Toyota Camry 2021"
        }
    };

    // Login form submission
    const loginForm = document.getElementById('signInForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
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

            // Validate credentials
            if (userDatabase[email] && userDatabase[email].password === password) {
                // Successful login
                localStorage.setItem('currentUser', JSON.stringify({
                    email: email,
                    name: userDatabase[email].name,
                    points: userDatabase[email].points,
                    vehicle: userDatabase[email].vehicle
                }));
                
                // Close modal if exists
                const signInModal = document.getElementById('signInModal');
                if (signInModal) {
                    signInModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show error
                if (errorElement) {
                    errorElement.textContent = 'Invalid email or password';
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
        if (!localStorage.getItem('currentUser')) {
            window.location.href = '../index.html';
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
                window.location.href = '../index.html';
            }
        }
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = '../index.html';
        });
    }
});