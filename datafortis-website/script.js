// ===================================
// DataFortis Website Scripts
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.style.background = 'rgba(10, 37, 64, 0.99)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(10, 37, 64, 0.98)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.problem-card, .service-card, .solution-card, .team-card, .mv-card, .arch-showcase-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stagger animation delays for cards
    document.querySelectorAll('.problem-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });

    // Contact Form Submission via Formspree
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            if (!data.name || !data.email || !data.service || !data.message) {
                formStatus.textContent = 'Please fill in all required fields.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                formStatus.textContent = 'Please enter a valid email address.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }
            
            // Change button text while sending
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('https://formspree.io/f/meelwpky', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    formStatus.textContent = 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or email us directly at info@datafortis.in';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            } finally {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }

    // Notification System
    function showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Add keyframe animations
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(animStyle);

    // CTA button click tracking (for analytics)
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                return;
            }
            console.log('CTA clicked:', this.textContent.trim());
        });
    });

    // Solution card hover effects
    document.querySelectorAll('.solution-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Lazy loading for images (if added later)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    console.log('DataFortis website initialized');
    
    // ===================================
    // Dashboard Tabs Functionality
    // ===================================
    const dashTabs = document.querySelectorAll('.dash-tab');
    const dashPanels = document.querySelectorAll('.dashboard-panel');
    
    if (dashTabs.length > 0) {
        dashTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const dashboard = this.getAttribute('data-dashboard');
                
                // Remove active class from all tabs and panels
                dashTabs.forEach(t => t.classList.remove('active'));
                dashPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                this.classList.add('active');
                document.getElementById(dashboard).classList.add('active');
            });
        });
    }
    
    // ===================================
    // Recommendation System Demo
    // ===================================
    const recommendationData = {
        user1: {
            name: "Tech Enthusiast",
            items: [
                { name: "MacBook Pro M3", category: "Electronics", price: "$2,499", score: 95 },
                { name: "Sony WH-1000XM5", category: "Audio", price: "$399", score: 92 },
                { name: "iPad Pro 12.9", category: "Tablets", price: "$1,099", score: 89 },
                { name: "Samsung 65\" OLED", category: "TVs", price: "$1,799", score: 86 }
            ]
        },
        user2: {
            name: "Budget Shopper",
            items: [
                { name: "Samsung Galaxy A54", category: "Phones", price: "$449", score: 94 },
                { name: "Fire TV Stick 4K", category: "Streaming", price: "$40", score: 91 },
                { name: "AirPods 2nd Gen", category: "Audio", price: "$129", score: 88 },
                { name: "Insignia 50\" TV", category: "TVs", price: "$280", score: 85 }
            ]
        },
        user3: {
            name: "Premium Buyer",
            items: [
                { name: "Rolex Submariner", category: "Watches", price: "$14,500", score: 98 },
                { name: "Hermès Scarf", category: "Fashion", price: "$495", score: 95 },
                { name: "Louis Vuitton Bag", category: "Fashion", price: "$2,890", score: 93 },
                { name: "Tesla Model S", category: "Cars", price: "$89,990", score: 90 }
            ]
        }
    };
    
    const userButtons = document.querySelectorAll('.user-btn');
    const recItemsContainer = document.getElementById('recItems');
    
    function renderRecommendations(userKey) {
        const data = recommendationData[userKey];
        if (!data || !recItemsContainer) return;
        
        recItemsContainer.innerHTML = data.items.map(item => `
            <div class="rec-item">
                <div class="rec-item-img">
                    <i class="fas fa-box"></i>
                </div>
                <div class="rec-item-info">
                    <h5>${item.name}</h5>
                    <p>${item.category} • ${item.price}</p>
                </div>
                <span class="rec-item-score">${item.score}%</span>
            </div>
        `).join('');
    }
    
    if (userButtons.length > 0) {
        // Initial render
        renderRecommendations('user1');
        
        // Add click handlers
        userButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const userKey = this.getAttribute('data-user');
                
                // Update active state
                userButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Render recommendations
                renderRecommendations(userKey);
            });
        });
    }
});

