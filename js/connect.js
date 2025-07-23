document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // DOM Elements
    const obdOption = document.getElementById('obdOption');
    const phoneOption = document.getElementById('phoneOption');
    const connectOBD = document.getElementById('connectOBD');
    const connectPhone = document.getElementById('connectPhone');
    const connectionStatus = document.getElementById('connectionStatus');
    const connectionProgress = document.getElementById('connectionProgress');
    const statusMessage = document.getElementById('statusMessage');
    const cancelConnection = document.getElementById('cancelConnection');
    const connectionSuccess = document.getElementById('connectionSuccess');
    const connectedType = document.getElementById('connectedType');
    const deviceId = document.getElementById('deviceId');
    const connectionTime = document.getElementById('connectionTime');
    const goToDashboard = document.getElementById('goToDashboard');

    // Connection simulation variables
    let connectionInterval;
    let isConnecting = false;

    // Connect OBD-II Device
    connectOBD.addEventListener('click', function() {
        if (isConnecting) return;
        startConnection('OBD-II');
    });

    // Connect Phone Only
    connectPhone.addEventListener('click', function() {
        if (isConnecting) return;
        startConnection('Smartphone');
    });

    // Cancel Connection
    cancelConnection.addEventListener('click', function() {
        cancelCurrentConnection();
    });

    // Go to Dashboard after successful connection
    goToDashboard.addEventListener('click', function() {
        window.location.href = 'dashboard.html';
    });

    // Start connection process
    function startConnection(type) {
        isConnecting = true;
        
        // Show connection status
        connectionStatus.style.display = 'block';
        obdOption.style.display = 'none';
        phoneOption.style.display = 'none';
        
        // Reset progress
        connectionProgress.style.width = '0%';
        statusMessage.textContent = `Initializing ${type} connection...`;
        
        // Simulate connection progress
        let progress = 0;
        const steps = [
            { percent: 20, message: "Searching for device..." },
            { percent: 40, message: "Establishing connection..." },
            { percent: 60, message: "Authenticating device..." },
            { percent: 80, message: "Syncing vehicle data..." },
            { percent: 95, message: "Finalizing connection..." }
        ];
        
        connectionInterval = setInterval(() => {
            progress += 1;
            connectionProgress.style.width = `${progress}%`;
            
            // Update status message based on progress
            const currentStep = steps.find(step => progress <= step.percent);
            if (currentStep && statusMessage.textContent !== currentStep.message) {
                statusMessage.textContent = currentStep.message;
            }
            
            // Show cancel button after 10% progress
            if (progress > 10) {
                cancelConnection.style.display = 'inline-block';
            }
            
            // Complete connection at 100%
            if (progress >= 100) {
                clearInterval(connectionInterval);
                completeConnection(type);
            }
        }, 100);
    }

    // Cancel current connection attempt
    function cancelCurrentConnection() {
        clearInterval(connectionInterval);
        isConnecting = false;
        
        connectionStatus.style.display = 'none';
        obdOption.style.display = 'block';
        phoneOption.style.display = 'block';
        
        // Show cancellation message briefly
        statusMessage.textContent = "Connection cancelled";
        setTimeout(() => {
            statusMessage.textContent = "Initializing connection...";
        }, 2000);
    }

    // Complete the connection successfully
    function completeConnection(type) {
        isConnecting = false;
        connectionStatus.style.display = 'none';
        
        // Generate random device ID
        const deviceIdText = type === 'OBD-II' ? 
            `OBD-${Math.floor(1000 + Math.random() * 9000)}` : 
            `PHONE-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Update user data in localStorage
        const user = JSON.parse(localStorage.getItem('currentUser'));
        user.connectedDevice = {
            type: type,
            id: deviceIdText,
            connectedAt: new Date().toISOString(),
            status: 'active'
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success message
        connectedType.textContent = type;
        deviceId.textContent = deviceIdText;
        connectionTime.textContent = new Date().toLocaleString();
        connectionSuccess.style.display = 'block';
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