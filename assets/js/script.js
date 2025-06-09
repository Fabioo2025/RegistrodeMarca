document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe
    const stripePublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Replace with your actual Stripe public key
    const stripe = Stripe(stripePublicKey);

    // FAQ Accordion functionality with smooth animation
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    otherToggle.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            const toggle = item.querySelector('.faq-toggle');
            toggle.style.transform = item.classList.contains('active') ? 'rotate(45deg)' : 'rotate(0deg)';
        });
    });

    // Smooth scrolling for anchor links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Adjust based on your header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Stripe checkout functionality
    const checkoutButton = document.getElementById('checkout-button');
    const finalCheckoutButton = document.getElementById('final-checkout-button');
    
    const handleCheckout = async (event) => {
        const button = event.currentTarget;
        const originalText = button.textContent;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span> Processando...';
        button.style.opacity = '0.8';
        
        try {
            // Create a checkout session on your server
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product: {
                        name: 'Guia Explicativo para Empresários: Como Registrar a Marca da sua Empresa no Brasil',
                        price: 4990, // Price in cents (R$ 49,90)
                    }
                }),
            });
            
            const session = await response.json();
            
            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });
            
            if (result.error) {
                console.error(result.error.message);
                showNotification('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.', 'error');
                
                // Reset button
                button.disabled = false;
                button.textContent = originalText;
                button.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error:', error);
            
            // For demo purposes, show a success message instead of the actual checkout
            // In a real implementation, this would be handled by your server
            showNotification('Esta é uma demonstração. Em um ambiente real, você seria redirecionado para o checkout do Stripe.', 'info');
            
            // Simulate redirect to success page with a delay for better UX
            setTimeout(() => {
                window.location.href = 'success.html';
            }, 1500);
        }
    };
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
    
    if (finalCheckoutButton) {
        finalCheckoutButton.addEventListener('click', handleCheckout);
    }

    // Add animation on scroll with IntersectionObserver for better performance
    const animateElements = document.querySelectorAll('.benefit-item, .problem-item, .learn-list li, .faq-item');
    
    // Set initial state for animated elements
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index for group animations
                const delay = Array.from(animateElements).indexOf(entry.target) % 4 * 0.15;
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each element
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                heroSection.style.backgroundPosition = `center ${scrollPosition * 0.4}px`;
            }
        });
    }
    
    // Add hover effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-5px)';
            button.style.boxShadow = '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
    });
    
    // Custom notification system
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
        });
        
        // Set type-specific styles
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
            notification.style.color = 'white';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#3b82f6';
            notification.style.color = 'white';
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Remove from DOM after animation
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
    
    // Add CSS for loading spinner
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});
