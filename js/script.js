// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Features Tab System
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Revenue Model Tab System
const revenueTabBtns = document.querySelectorAll('.revenue-tab-btn');
const revenueTabContents = document.querySelectorAll('.revenue-tab-content');

revenueTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and contents
        revenueTabBtns.forEach(btn => btn.classList.remove('active'));
        revenueTabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-revenue-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// Testimonial Slider
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
let currentSlide = 0;

function showSlide(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
    showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
});

// Auto-rotate testimonials
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonials.length;
    showSlide(currentSlide);
}, 5000);

// Phone Mockup Slider
const mockupImages = document.querySelectorAll('.phone-mockup img');
const mockupControls = document.querySelectorAll('.mockup-controls button');

mockupControls.forEach((control, index) => {
    control.addEventListener('click', () => {
        mockupImages.forEach(img => img.classList.remove('active'));
        mockupControls.forEach(btn => btn.classList.remove('active'));
        
        mockupImages[index].classList.add('active');
        control.classList.add('active');
    });
});

// Auto-rotate phone mockup
let currentMockup = 0;
setInterval(() => {
    currentMockup = (currentMockup + 1) % mockupImages.length;
    mockupImages.forEach(img => img.classList.remove('active'));
    mockupControls.forEach(btn => btn.classList.remove('active'));
    
    mockupImages[currentMockup].classList.add('active');
    mockupControls[currentMockup].classList.add('active');
}, 3000);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// script.js - Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Navigation link handling
    const navItems = document.querySelectorAll('.nav-links a:not(.btn)');
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // If this is a dashboard link, handle navigation
            if (this.getAttribute('href').endsWith('.html')) {
                e.preventDefault();
                const page = this.getAttribute('href');
                window.location.href = page;
            }
        });
    });
    
    // Highlight current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    navItems.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Logout button functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                // In a real app, you would clear session/token here
                window.location.href = 'index.html';
            }
        });
    }
});