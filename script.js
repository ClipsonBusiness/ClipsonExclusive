document.addEventListener('DOMContentLoaded', () => {
    // Countdown Timer - Only run if countdown elements exist
    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        miniDays: document.getElementById('mini-days'),
        miniHours: document.getElementById('mini-hours'),
        miniMinutes: document.getElementById('mini-minutes'),
        miniSeconds: document.getElementById('mini-seconds')
    };

    // Check if any countdown elements exist
    const hasCountdownElements = Object.values(countdownElements).some(el => el !== null);

    if (hasCountdownElements) {
        const countdownDate = new Date();
        countdownDate.setDate(countdownDate.getDate() + 3); // Set to 3 days from now

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update main countdown elements if they exist
            if (countdownElements.days) countdownElements.days.textContent = String(days).padStart(2, '0');
            if (countdownElements.hours) countdownElements.hours.textContent = String(hours).padStart(2, '0');
            if (countdownElements.minutes) countdownElements.minutes.textContent = String(minutes).padStart(2, '0');
            if (countdownElements.seconds) countdownElements.seconds.textContent = String(seconds).padStart(2, '0');

            // Update mini countdown elements if they exist
            if (countdownElements.miniDays) countdownElements.miniDays.textContent = String(days).padStart(2, '0');
            if (countdownElements.miniHours) countdownElements.miniHours.textContent = String(hours).padStart(2, '0');
            if (countdownElements.miniMinutes) countdownElements.miniMinutes.textContent = String(minutes).padStart(2, '0');
            if (countdownElements.miniSeconds) countdownElements.miniSeconds.textContent = String(seconds).padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownInterval);
                const countdownSection = document.querySelector('.countdown-section');
                const priceBanner = document.querySelector('.price-increase-banner');
                if (countdownSection) countdownSection.style.display = 'none';
                if (priceBanner) priceBanner.style.display = 'none';
            }
        }

        // Update the countdown every second
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    // Smooth scroll for navigation
    document.querySelectorAll('.nav-link, .logo-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerOffset = 112; // Height of header + price banner
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // Otherwise, let the browser handle the navigation (e.g., shop.html)
        });
    });

    // Add scroll animation for elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Price Increase Countdown - Only run if elements exist
    const priceIncreaseElements = {
        piDays: document.getElementById('pi-days'),
        piHours: document.getElementById('pi-hours'),
        piMinutes: document.getElementById('pi-minutes'),
        piSeconds: document.getElementById('pi-seconds')
    };

    const hasPriceIncreaseElements = Object.values(priceIncreaseElements).some(el => el !== null);

    if (hasPriceIncreaseElements) {
        function updatePriceIncreaseCountdown() {
            const now = new Date();
            // Find the next 3-day interval from now
            const msIn3Days = 3 * 24 * 60 * 60 * 1000;
            // Epoch time of the next 3-day mark
            const nextIncrease = new Date(Math.ceil(now.getTime() / msIn3Days) * msIn3Days);
            let diff = nextIncrease - now;
            if (diff < 0) diff += msIn3Days; // Just in case

            const days = Math.floor(diff / (24 * 60 * 60 * 1000));
            const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((diff % (60 * 1000)) / 1000);

            if (priceIncreaseElements.piDays) priceIncreaseElements.piDays.textContent = days;
            if (priceIncreaseElements.piHours) priceIncreaseElements.piHours.textContent = String(hours).padStart(2, '0');
            if (priceIncreaseElements.piMinutes) priceIncreaseElements.piMinutes.textContent = String(minutes).padStart(2, '0');
            if (priceIncreaseElements.piSeconds) priceIncreaseElements.piSeconds.textContent = String(seconds).padStart(2, '0');
        }
        setInterval(updatePriceIncreaseCountdown, 1000);
        updatePriceIncreaseCountdown();
    }

    // Stripe Checkout Integration
    async function createCheckout() {
        try {
            // Check if affiliate cookie exists (for debugging)
            const cookies = document.cookie;
            const hasAffiliateCookie = cookies.includes('ca_affiliate_id');
            console.log('Creating checkout...');
            console.log('Affiliate cookie present:', hasAffiliateCookie);
            if (hasAffiliateCookie) {
                const match = cookies.match(/ca_affiliate_id=([^;]*)/);
                console.log('Affiliate ID:', match ? decodeURIComponent(match[1]) : 'Not found');
            }

            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies in request
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('API Error:', response.status, errorData);
                throw new Error(errorData.message || errorData.error || 'Failed to create checkout session');
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (error) {
            console.error('Error creating checkout:', error);
            alert('Failed to start checkout: ' + error.message + '\n\nCheck the browser console for details.');
        }
    }

    // Attach checkout handler to all checkout buttons
    document.querySelectorAll('.checkout-btn, [data-checkout]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.disabled = true;
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            createCheckout().finally(() => {
                this.disabled = false;
                this.textContent = originalText;
            });
        });
    });
}); 