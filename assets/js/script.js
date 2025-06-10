document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe
    const stripePublicKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Replace with your actual Stripe public key
    const stripe = Stripe(stripePublicKey);

    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

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

    // Checkout button functionality
    const checkoutButton = document.getElementById('checkout-button');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async function() {
            // Show loading state
            const originalText = this.innerHTML;
            this.disabled = true;
            this.innerHTML = `
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
                Processando...
            `;
            
            try {
                // Simulate payment processing
                setTimeout(() => {
                    // For demo purposes, show a success message and redirect to success page
                    showNotification('Esta é uma demonstração. Em um ambiente real, você seria redirecionado para o checkout do Stripe.', 'info');
                    
                    // Redirect to success page after a delay
                    setTimeout(() => {
                        window.location.href = 'success.html';
                    }, 1500);
                }, 1500);
                
                // In a real implementation, you would create a checkout session on your server
                // const response = await fetch('/create-checkout-session', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         product: {
                //             name: 'Guia Prático: Registro de Marca no Brasil',
                //             price: 4990, // Price in cents (R$ 49,90)
                //         }
                //     }),
                // });
                // 
                // const session = await response.json();
                // 
                // // Redirect to Stripe Checkout
                // const result = await stripe.redirectToCheckout({
                //     sessionId: session.id,
                // });
                // 
                // if (result.error) {
                //     console.error(result.error.message);
                //     showNotification('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.', 'error');
                //     
                //     // Reset button
                //     this.disabled = false;
                //     this.innerHTML = originalText;
                // }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Ocorreu um erro. Por favor, tente novamente.', 'error');
                
                // Reset button
                this.disabled = false;
                this.innerHTML = originalText;
            }
        });
    }

    // Add animation on scroll
    const animateElements = document.querySelectorAll('.benefit-card, .testimonial-card, .checklist li');
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay based on index
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 150);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial state and observe each element
    animateElements.forEach(element => {
        element.style.opacity = '0';
        observer.observe(element);
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
    
    // Add CSS for spinner
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            animation: rotate 2s linear infinite;
            width: 20px;
            height: 20px;
            margin-right: 8px;
            vertical-align: middle;
            display: inline-block;
        }
        
        .spinner .path {
            stroke: white;
            stroke-linecap: round;
            animation: dash 1.5s ease-in-out infinite;
        }
        
        @keyframes rotate {
            100% {
                transform: rotate(360deg);
            }
        }
        
        @keyframes dash {
            0% {
                stroke-dasharray: 1, 150;
                stroke-dashoffset: 0;
            }
            50% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -35;
            }
            100% {
                stroke-dasharray: 90, 150;
                stroke-dashoffset: -124;
            }
        }
    `;
    document.head.appendChild(style);
});
