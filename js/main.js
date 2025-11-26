// ==================== CARRUSEL DE TESTIMONIOS ====================
let currentSlide = 0;
let autoPlayInterval;

function showSlide(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!slides.length) return;
    
    // Ajustar índice si está fuera de rango
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    // Ocultar todos los slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Desactivar todos los indicadores
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Mostrar slide actual
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
    }
}

function moveSlide(direction) {
    currentSlide += direction;
    showSlide(currentSlide);
    
    // Reiniciar auto-play
    resetAutoPlay();
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    
    // Reiniciar auto-play
    resetAutoPlay();
}

function autoPlayCarousel() {
    autoPlayInterval = setInterval(() => {
        currentSlide++;
        showSlide(currentSlide);
    }, 5000); // Cambia cada 5 segundos
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayCarousel();
}

// Iniciar carrusel cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    autoPlayCarousel();
    
    // Pausar auto-play cuando el mouse está sobre el carrusel
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoPlayCarousel();
        });
    }
});

// Soporte para gestos táctiles (swipe) en móviles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.testimonials-carousel');
    
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left (siguiente)
        moveSlide(1);
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right (anterior)
        moveSlide(-1);
    }
}

// Soporte para flechas del teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveSlide(-1);
    }
    if (e.key === 'ArrowRight') {
        moveSlide(1);
    }
});

// ==================== FIN CARRUSEL DE TESTIMONIOS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animación especial para las tarjetas
            if (entry.target.classList.contains('problem-card') || 
                entry.target.classList.contains('opportunity-card') ||
                entry.target.classList.contains('learn-card') ||
                entry.target.classList.contains('testimonial-card') ||
                entry.target.classList.contains('bonus-card')) {
                
                const cards = entry.target.parentElement.children;
                let delay = 0;
                
                Array.from(cards).forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = 'fadeInUp 0.6s ease forwards';
                    }, delay);
                    delay += 100;
                });
            }
        }
    });
}, observerOptions);

// Observar todos los elementos que necesitan animación
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(`
        .hero-content,
        .section-title,
        .section-subtitle,
        .problem-card,
        .opportunity-card,
        .learn-card,
        .testimonial-card,
        .bonus-card,
        .faq-item,
        .comparison-card,
        .price-container
    `);

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});

// Contador regresivo
function startCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Establecer tiempo inicial (24 horas desde ahora)
    let endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    // Verificar si ya existe un tiempo guardado
    const savedEndTime = localStorage.getItem('countdownEndTime');
    if (savedEndTime) {
        endTime = parseInt(savedEndTime);
    } else {
        localStorage.setItem('countdownEndTime', endTime);
    }
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            // Reiniciar el contador cuando llegue a cero
            endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('countdownEndTime', endTime);
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Iniciar contador cuando cargue la página
document.addEventListener('DOMContentLoaded', startCountdown);

// Smooth scroll para enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto parallax sutil en el hero
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const parallaxElements = hero.querySelectorAll('.hero-content');
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Tracking de clics en botones CTA
document.querySelectorAll('.btn-primary, .btn-mega').forEach(button => {
    button.addEventListener('click', function() {
        // Aquí puedes agregar tracking de analytics si lo necesitas
        console.log('CTA clicked:', this.textContent);
        
        // Animación de clic
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Animación de entrada para el banner de urgencia
window.addEventListener('load', () => {
    const banner = document.querySelector('.urgency-banner');
    if (banner) {
        banner.style.transform = 'translateY(-100%)';
        banner.style.opacity = '0';
        
        setTimeout(() => {
            banner.style.transition = 'all 0.6s ease';
            banner.style.transform = 'translateY(0)';
            banner.style.opacity = '1';
        }, 500);
    }
});

// Hacer que los números de las estadísticas cuenten hacia arriba
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const match = text.match(/\d+/);
        
        if (match) {
            const target = parseInt(match[0]);
            const prefix = text.split(match[0])[0];
            const suffix = text.split(match[0])[1];
            let current = 0;
            const increment = target / 50;
            const duration = 2000;
            const stepTime = duration / 50;
            
            stat.textContent = prefix + '0' + suffix;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                stat.textContent = prefix + target + suffix;
                                clearInterval(timer);
                            } else {
                                stat.textContent = prefix + Math.floor(current) + suffix;
                            }
                        }, stepTime);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        }
    });
}

document.addEventListener('DOMContentLoaded', animateNumbers);

// Efecto de hover mejorado para las tarjetas
document.querySelectorAll('.problem-card, .opportunity-card, .learn-card, .testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Detección de dispositivo móvil para optimizar animaciones
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Deshabilitar parallax en móviles para mejor rendimiento
    window.removeEventListener('scroll', updateParallax);
    
    // Simplificar algunas animaciones en móviles
    document.documentElement.style.setProperty('--animation-duration', '0.4s');
}

// Prevenir spam de clics en botones
let lastClickTime = 0;
const clickThrottle = 2000; // 2 segundos

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const now = Date.now();
        if (now - lastClickTime < clickThrottle) {
            e.preventDefault();
            return false;
        }
        lastClickTime = now;
    });
});

// Lazy loading para mejorar rendimiento
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
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

// Mostrar indicador de carga al hacer clic en CTAs
function showLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span style="display: inline-block; animation: pulse 1s infinite;">Cargando WhatsApp...</span>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1500);
}

// Easter egg: Mostrar mensaje especial si el usuario está mucho tiempo
let timeOnPage = 0;
setInterval(() => {
    timeOnPage++;
    
    // Después de 5 minutos, mostrar recordatorio sutil
    if (timeOnPage === 300) {
        const reminder = document.createElement('div');
        reminder.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
            z-index: 9999;
            animation: fadeInUp 0.6s ease;
            max-width: 300px;
        `;
        reminder.innerHTML = `
            <p style="margin: 0; font-weight: 600; margin-bottom: 10px;">👋 ¿Todavía aquí?</p>
            <p style="margin: 0; font-size: 14px;">Cada minuto que pasa es una oportunidad perdida. ¡Empieza ahora!</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; background: white; color: #10b981; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">Entendido</button>
        `;
        document.body.appendChild(reminder);
        
        setTimeout(() => {
            if (reminder.parentElement) {
                reminder.remove();
            }
        }, 10000);
    }
}, 1000);

// Imprimir mensaje en consola para desarrolladores
console.log('%c¡Hola Developer! 👋', 'font-size: 24px; font-weight: bold; color: #10b981;');
console.log('%cSi estás interesado en el código de esta landing, es totalmente personalizable.', 'font-size: 14px; color: #64748b;');
console.log('%cContacta a Zaincky para más info 😉', 'font-size: 14px; color: #64748b;');