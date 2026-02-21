document.addEventListener('DOMContentLoaded', () => {
    // Countdown Timer
    const countdownDate = new Date();
    countdownDate.setDate(countdownDate.getDate() + 3); // Set to 3 days from now

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update main countdown
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // Update mini countdown
        document.getElementById('mini-days').textContent = String(days).padStart(2, '0');
        document.getElementById('mini-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('mini-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('mini-seconds').textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-section').style.display = 'none';
            document.querySelector('.price-increase-banner').style.display = 'none';
        }
    }

    // Update the countdown every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

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
}); 