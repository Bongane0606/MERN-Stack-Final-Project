document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Check if vehicle is connected
    if (!user.connectedDevice) {
        alert('Please connect your vehicle first');
        window.location.href = 'connect.html';
        return;
    }

    // DOM Elements
    const startTripBtn = document.getElementById('startTripBtn');
    const endTripBtn = document.getElementById('endTripBtn');
    const tripStatus = document.getElementById('tripStatus');
    const tripMetrics = document.getElementById('tripMetrics');
    const tripSummary = document.getElementById('tripSummary');
    const currentSpeed = document.getElementById('currentSpeed');
    const tripDuration = document.getElementById('tripDuration');
    const tripDistance = document.getElementById('tripDistance');
    const safetyScore = document.getElementById('safetyScore');
    const safetyAlerts = document.getElementById('safetyAlerts');
    const summaryDistance = document.getElementById('summaryDistance');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryScore = document.getElementById('summaryScore');
    const summaryPoints = document.getElementById('summaryPoints');
    const summaryFeedback = document.getElementById('summaryFeedback');
    const doneButton = document.getElementById('doneButton');

    // Trip state
    let tripActive = false;
    let startTime = null;
    let tripInterval = null;
    let distance = 0;
    let currentScore = 0;
    let alerts = [];
    let speedInterval = null;
    let currentSpeedValue = 0;

    // Start trip
    startTripBtn.addEventListener('click', function() {
        tripActive = true;
        startTime = new Date();
        tripStatus.innerHTML = `
            <div class="status-icon">
                <i class="fas fa-car-side"></i>
            </div>
            <h2>Trip In Progress</h2>
            <p>Drive safely and follow traffic rules</p>
        `;
        startTripBtn.style.display = 'none';
        endTripBtn.style.display = 'inline-block';
        tripMetrics.style.display = 'block';

        // Start updating metrics
        updateMetrics();
        tripInterval = setInterval(updateMetrics, 1000);

        // Simulate speed changes
        speedInterval = setInterval(updateSpeed, 3000);

        // Add event listener for end trip button
        endTripBtn.addEventListener('click', endTrip);
    });

    // Update trip metrics
    function updateMetrics() {
        if (!tripActive) return;

        // Calculate duration
        const now = new Date();
        const duration = Math.floor((now - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        tripDuration.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update distance (simulated)
        distance += Math.random() * 0.1;
        tripDistance.textContent = distance.toFixed(1);

        // Update safety score (simulated)
        currentScore = Math.min(100, Math.floor(80 + Math.random() * 25));
        safetyScore.textContent = currentScore;

        // Randomly generate alerts (simulated)
        if (Math.random() > 0.8) {
            generateAlert();
        }
    }

    // Update speed (simulated)
    function updateSpeed() {
        if (!tripActive) return;

        // Simulate realistic speed changes
        if (currentSpeedValue === 0) {
            // Accelerating from stop
            currentSpeedValue = Math.min(30 + Math.random() * 20, 70);
        } else {
            // Random speed changes
            const change = (Math.random() - 0.5) * 10;
            currentSpeedValue = Math.max(0, Math.min(currentSpeedValue + change, 80));
        }

        currentSpeed.textContent = Math.round(currentSpeedValue);

        // Check for speeding alert
        if (currentSpeedValue > 70 && !alerts.includes('speeding')) {
            alerts.push('speeding');
            safetyAlerts.innerHTML += `
                <div class="alert-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <strong>Speeding Alert</strong>
                        <p>You're driving above the speed limit</p>
                    </div>
                </div>
            `;
        }
    }

    // Generate random alert
    function generateAlert() {
        const alertTypes = [
            {
                type: 'hard_brake',
                title: 'Hard Braking Detected',
                message: 'Sudden deceleration detected. Try to brake gradually.',
                icon: 'fas fa-exclamation-circle',
                class: 'warning'
            },
            {
                type: 'rapid_accel',
                title: 'Rapid Acceleration',
                message: 'Quick acceleration detected. Try to accelerate smoothly.',
                icon: 'fas fa-rocket',
                class: 'warning'
            },
            {
                type: 'phone_usage',
                title: 'Possible Phone Usage',
                message: 'Potential phone movement detected while driving.',
                icon: 'fas fa-mobile-alt',
                class: ''
            },
            {
                type: 'sharp_turn',
                title: 'Sharp Turn Detected',
                message: 'Sudden steering movement detected. Take turns more gently.',
                icon: 'fas fa-undo',
                class: 'warning'
            }
        ];

        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        if (!alerts.includes(alertType.type)) {
            alerts.push(alertType.type);
            safetyAlerts.innerHTML += `
                <div class="alert-item ${alertType.class}">
                    <i class="${alertType.icon}"></i>
                    <div>
                        <strong>${alertType.title}</strong>
                        <p>${alertType.message}</p>
                    </div>
                </div>
            `;
        }
    }

    // End trip
    function endTrip() {
        tripActive = false;
        clearInterval(tripInterval);
        clearInterval(speedInterval);

        // Calculate final metrics
        const now = new Date();
        const duration = Math.floor((now - startTime) / 1000 / 60);
        const pointsEarned = Math.floor(distance * 10 * (currentScore / 100));

        // Update summary
        summaryDistance.textContent = `${distance.toFixed(1)} miles`;
        summaryDuration.textContent = `${duration} minutes`;
        summaryScore.textContent = `${currentScore}/100`;
        summaryPoints.textContent = `${pointsEarned} points`;

        // Generate feedback
        let feedbackHTML = '<h3>Driving Feedback</h3>';
        
        if (alerts.length === 0) {
            feedbackHTML += `
                <div class="feedback-item">
                    <i class="fas fa-check-circle"></i>
                    <p>Excellent driving! No issues detected.</p>
                </div>
            `;
        } else {
            if (alerts.includes('speeding')) {
                feedbackHTML += `
                    <div class="feedback-item">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Watch your speed. You exceeded the speed limit during this trip.</p>
                    </div>
                `;
            }
            if (alerts.includes('hard_brake')) {
                feedbackHTML += `
                    <div class="feedback-item">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Try to brake more gradually. Hard braking was detected.</p>
                    </div>
                `;
            }
            if (alerts.includes('rapid_accel')) {
                feedbackHTML += `
                    <div class="feedback-item">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Smooth out your acceleration. Rapid acceleration was detected.</p>
                    </div>
                `;
            }
        }

        feedbackHTML += `
            <div class="feedback-item">
                <i class="fas fa-lightbulb"></i>
                <p>You earned ${pointsEarned} points for this trip.</p>
            </div>
        `;

        summaryFeedback.innerHTML = feedbackHTML;

        // Show summary
        tripMetrics.style.display = 'none';
        tripSummary.style.display = 'block';

        // Update user data
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        // Add trip to history
        if (!user.tripHistory) user.tripHistory = [];
        user.tripHistory.push({
            date: new Date().toISOString(),
            distance: distance,
            duration: duration,
            score: currentScore,
            points: pointsEarned,
            alerts: alerts
        });

        // Update points
        if (!user.points) user.points = 0;
        user.points += pointsEarned;

        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    // Done button
    doneButton.addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

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