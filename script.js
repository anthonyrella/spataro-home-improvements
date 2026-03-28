// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const siteHeader = document.querySelector('.site-header');

function updateMobileSiteHeaderHeight() {
    if (!siteHeader) return;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
        const h = siteHeader.getBoundingClientRect().height;
        document.documentElement.style.setProperty(
            '--site-header-height',
            `${Math.ceil(h)}px`
        );
    } else {
        document.documentElement.style.removeProperty('--site-header-height');
    }
}

if (siteHeader && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => updateMobileSiteHeaderHeight()).observe(siteHeader);
}
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateMobileSiteHeaderHeight);
}

function closeMobileNav() {
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    requestAnimationFrame(updateMobileSiteHeaderHeight);
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        requestAnimationFrame(updateMobileSiteHeaderHeight);
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach((n) =>
    n.addEventListener('click', () => closeMobileNav())
);

// Mobile: close drawer when tapping outside the menu panel and hamburger (e.g. logo / header bar).
const mobileNavMq = window.matchMedia('(max-width: 768px)');
document.addEventListener('pointerdown', (e) => {
    if (!navMenu || !hamburger || !navMenu.classList.contains('active')) return;
    if (!mobileNavMq.matches) return;
    if (navMenu.contains(e.target) || hamburger.contains(e.target)) return;
    closeMobileNav();
});

// Logo scroll functionality
const logo = document.querySelector('.nav-logo-img');
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero');
let isScrolled = false;

function updateNavbarPastHero() {
    if (!navbar || !heroSection) return;
    const heroBottom =
        heroSection.getBoundingClientRect().bottom + window.scrollY;
    if (window.scrollY >= heroBottom) {
        navbar.classList.add('navbar--past-hero');
    } else {
        navbar.classList.remove('navbar--past-hero');
    }
}

function onScrollNav() {
    const scrollY = window.scrollY;

    updateNavbarPastHero();

    if (navbar) {
        if (scrollY > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    }

    if (logo) {
        if (scrollY > 50 && !isScrolled) {
            logo.classList.add('scrolled');
            isScrolled = true;
            updateMobileSiteHeaderHeight();
        } else if (scrollY <= 50 && isScrolled) {
            logo.classList.remove('scrolled');
            isScrolled = false;
            updateMobileSiteHeaderHeight();
        }
    }
}

window.addEventListener('scroll', onScrollNav);
window.addEventListener('resize', () => {
    updateNavbarPastHero();
    updateMobileSiteHeaderHeight();
});
updateMobileSiteHeaderHeight();
onScrollNav();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card, .gallery-item, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    createScrollToTopButton();
});

// Service cards hover effect enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery lightbox
(function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox && lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox && lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox && lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox && lightbox.querySelector('.lightbox-next');

    if (!lightbox || !lightboxImg) return;

    const galleryItems = document.querySelectorAll('.gallery-item img');
    const sources = Array.from(galleryItems).map(img => ({ src: img.src, alt: img.alt || '' }));
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = sources[index].src;
        lightboxImg.alt = sources[index].alt;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + sources.length) % sources.length;
        lightboxImg.src = sources[currentIndex].src;
        lightboxImg.alt = sources[currentIndex].alt;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % sources.length;
        lightboxImg.src = sources[currentIndex].src;
        lightboxImg.alt = sources[currentIndex].alt;
    }

    galleryItems.forEach((img, index) => {
        img.closest('.gallery-item').addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
})();

// Service row mobile: tap bar to expand overlay, close button to collapse (only on narrow viewports)
(function() {
    var MOBILE_MAX = 768;

    function isMobile() {
        return window.innerWidth <= MOBILE_MAX;
    }

    /** Row min-height matches image + expanded panel so we don't reserve a huge fixed gap */
    function layoutExpandedServiceRow(row) {
        var body = row.querySelector('.service-card-body');
        if (!row.classList.contains('service-row--expanded') || !body) {
            row.style.minHeight = '';
            return;
        }
        var rowRect = row.getBoundingClientRect();
        var bodyRect = body.getBoundingClientRect();
        var bottomPad = 2;
        var needed = Math.ceil(bodyRect.bottom - rowRect.top + bottomPad);
        row.style.minHeight = needed + 'px';
    }

    function scheduleLayout(row) {
        if (!row.classList.contains('service-row--expanded')) return;
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                layoutExpandedServiceRow(row);
            });
        });
    }

    var resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            document.querySelectorAll('.service-row--expanded').forEach(layoutExpandedServiceRow);
        }, 100);
    }
    window.addEventListener('resize', onResize);

    document.querySelectorAll('.service-row').forEach(function(row) {
        var content = row.querySelector('.service-row-content');
        var closeBtn = row.querySelector('.service-details-close');
        var body = row.querySelector('.service-card-body');
        if (!content) return;

        var ro;
        if (body && typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(function() {
                if (row.classList.contains('service-row--expanded')) layoutExpandedServiceRow(row);
            });
        }

        content.addEventListener('click', function(e) {
            if (closeBtn && e.target === closeBtn) return;
            if (!isMobile()) return;
            if (row.classList.contains('service-row--expanded')) return;
            row.classList.add('service-row--expanded');
            if (ro) ro.observe(body);
            scheduleLayout(row);
            setTimeout(function() {
                layoutExpandedServiceRow(row);
            }, 100);
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (ro) ro.unobserve(body);
                row.classList.remove('service-row--expanded');
                if (!body) {
                    row.style.minHeight = '';
                    return;
                }
                /* Keep row min-height until panel finishes collapsing (matches CSS max-height ~0.42s) */
                var collapseMs = 480;
                var fallback = setTimeout(function clearRowMinHeight() {
                    row.style.minHeight = '';
                }, collapseMs);
                function onCollapseTransitionEnd(ev) {
                    if (ev.target !== body || ev.propertyName !== 'max-height') return;
                    clearTimeout(fallback);
                    row.style.minHeight = '';
                    body.removeEventListener('transitionend', onCollapseTransitionEnd);
                }
                body.addEventListener('transitionend', onCollapseTransitionEnd);
            });
        }
    });
})();

// Scroll to top functionality
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #8B4513;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.background = '#8B4513';
        scrollBtn.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.background = '#8B4513';
        scrollBtn.style.transform = 'scale(1)';
    });
}

// Add some interactive elements to service cards
document.querySelectorAll('.service-card').forEach(card => {
    const icon = card.querySelector('.service-icon i');
    
    card.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
    });
});
