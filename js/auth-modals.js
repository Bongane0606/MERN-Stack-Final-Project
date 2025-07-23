// Combined Authentication and Modal Handling with Profile Photo Support
document.addEventListener('DOMContentLoaded', function() {
    // 1. Authentication Functionality
    // Initialize userDatabase from localStorage or create it if it doesn't exist
    let userDatabase = JSON.parse(localStorage.getItem('userDatabase')) || {
        "user@example.com": {
            password: "SafeDrive123",
            name: "John Driver",
            points: 1250,
            vehicle: "Toyota Camry 2021",
            isNewUser: false,
            photo: null
        }
    };

    // Save user database to localStorage
    function saveUserDatabase() {
        localStorage.setItem('userDatabase', JSON.stringify(userDatabase));
    }

    // Helper function to convert file to Base64
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
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
                // Clear form and photo preview when opening
                const form = signUpModal.querySelector('form');
                if (form) form.reset();
                const photoPreview = document.getElementById('photoPreview');
                if (photoPreview) {
                    photoPreview.style.display = 'none';
                    photoPreview.src = '';
                }
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

    // Profile photo preview functionality
    const photoInput = document.getElementById('profilePhoto');
    const photoPreview = document.getElementById('photoPreview');
    
    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Validate file type
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                    showError('Only JPEG/PNG images allowed');
                    this.value = ''; // Clear the input
                    photoPreview.style.display = 'none';
                    return;
                }
                
                // Validate file size
                if (file.size > 2 * 1024 * 1024) {
                    showError('Image must be under 2MB');
                    this.value = ''; // Clear the input
                    photoPreview.style.display = 'none';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoPreview.src = e.target.result;
                    photoPreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                photoPreview.style.display = 'none';
                photoPreview.src = '';
            }
        });
    }

    // Sign Up form submission
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) {
        signUpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('signUpName').value.trim();
            const email = document.getElementById('signUpEmail').value.trim();
            const password = document.getElementById('signUpPassword').value;
            const confirmPassword = document.getElementById('signUpConfirmPassword').value;
            const photoInput = document.getElementById('profilePhoto');
            let photoData = null;
            
            // Clear previous errors
            const errorElement = document.getElementById('signUpError');
            function showError(message) {
                if (errorElement) {
                    errorElement.textContent = message;
                    errorElement.style.display = 'block';
                }
            }

            // Validate inputs
            if (!name || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('Please enter a valid email address');
                return;
            }

            // Check if email already exists
            if (userDatabase[email]) {
                showError('Email already registered');
                return;
            }

            // Check password match
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            // Handle profile photo if provided
            if (photoInput && photoInput.files.length > 0) {
                const file = photoInput.files[0];
                
                // Validate file (again, in case client-side validation was bypassed)
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                    showError('Only JPEG/PNG images allowed');
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    showError('Image must be under 2MB');
                    return;
                }

                // Convert to Base64
                try {
                    photoData = await toBase64(file);
                } catch (error) {
                    showError('Error processing image');
                    console.error('Error converting image:', error);
                    return;
                }
            }

            // Create new user with photo data
            userDatabase[email] = {
                password: password,
                name: name,
                points: 0,
                vehicle: "Not set",
                isNewUser: true,
                photo: photoData  // Store Base64 string or null
            };
            
            saveUserDatabase();

            // Log the user in automatically
            localStorage.setItem('currentUser', JSON.stringify({
                email: email,
                name: name,
                points: 0,
                vehicle: "Not set",
                isNewUser: true,
                photo: photoData
            }));
            
            // Close modal if exists
            if (signUpModal) {
                signUpModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Redirect to appropriate dashboard
            window.location.href = 'new-user-dashboard.html';
        });
    }

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
                const userData = userDatabase[email];
                localStorage.setItem('currentUser', JSON.stringify({
                    email: email,
                    name: userData.name,
                    points: userData.points,
                    vehicle: userData.vehicle,
                    isNewUser: userData.isNewUser || false,
                    photo: userData.photo || null
                }));
                
                // Close modal if exists
                if (signInModal) {
                    signInModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
                
                // Redirect to appropriate dashboard
                if (userData.isNewUser) {
                    window.location.href = 'new-user-dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                // Show error
                if (errorElement) {
                    errorElement.textContent = 'Invalid email or password';
                    errorElement.style.display = 'block';
                }
            }
        });
    }

    // 3. Session Management
    // Check if user is logged in when loading dashboard pages
    if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('new-user-dashboard')) {
        if (!localStorage.getItem('currentUser')) {
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
                
                // Display user photo if available
                if (user.photo && document.getElementById('userPhoto')) {
                    document.getElementById('userPhoto').src = user.photo;
                    document.getElementById('userPhoto').style.display = 'block';
                }
                
                // If user is no longer new but on new user dashboard, redirect
                if (!user.isNewUser && window.location.pathname.includes('new-user-dashboard')) {
                    window.location.href = 'dashboard.html';
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('currentUser');
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
            window.location.href = 'index.html';
        });
    }
});