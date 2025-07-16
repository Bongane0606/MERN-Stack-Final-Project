// Animate stats counting up
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const suffix = stat.textContent.match(/[a-zA-Z%]+$/) ? stat.textContent.match(/[a-zA-Z%]+$/)[0] : '';
        const duration = 2000; // Animation duration in ms
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateStat = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target + suffix;
            }
        };
        
        // Only animate when element is in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateStat();
                observer.unobserve(stat);
            }
        });
        
        observer.observe(stat);
    });
}

// Animate elements when they come into view
function animateOnScroll() {
    const animateElements = document.querySelectorAll('.problem-card, .tech-card, .step, .revenue-model-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateStats();
    animateOnScroll();
    
    // Add animation delay to steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Add animation classes to CSS
const style = document.createElement('style');
style.textContent = `
    .problem-card, .tech-card, .step, .revenue-model-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .problem-card.animate, 
    .tech-card.animate, 
    .step.animate, 
    .revenue-model-card.animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);