/* ============================================================
   GARY HALL GARDEN SERVICES — SHARED JAVASCRIPT
   ============================================================ */

/* ---------- LOADER ---------- */
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
});

/* ---------- NAV TOGGLE ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
        this.setAttribute('aria-expanded', expanded);
        this.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

/* ---------- NAVBAR SCROLL EFFECT ---------- */
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
}

/* ---------- SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- BACK TO TOP ---------- */
const backBtn = document.getElementById('backToTop');
if (backBtn) {
    window.addEventListener('scroll', function () {
        backBtn.classList.toggle('visible', window.scrollY > 500);
    });
    backBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---------- VIDEO PAUSE-ON-PLAY ---------- */
const videos = document.querySelectorAll('.gallery-video');
videos.forEach(video => {
    video.addEventListener('play', function () {
        videos.forEach(other => {
            if (other !== this && !other.paused) other.pause();
        });
    });
    video.setAttribute('playsinline', '');
});

/* ---------- SMOOTH SCROLL FOR HASH LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target && navbar) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 10;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const form = document.getElementById('contactForm');
if (form) {
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const messageInput = document.getElementById('formMessage');
    const consentInput = document.getElementById('formConsent');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const consentError = document.getElementById('consentError');
    const successMsg = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('formSubmit');
    const redirectUrl = form.dataset.redirect;

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        [nameError, emailError, messageError, consentError].forEach(el => el && el.classList.remove('show'));
        if (successMsg) successMsg.classList.remove('show');

        let valid = true;

        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            nameError.classList.add('show'); valid = false;
        }
        if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
            emailError.classList.add('show'); valid = false;
        }
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            messageError.classList.add('show'); valid = false;
        }
        if (consentInput && !consentInput.checked) {
            consentError.classList.add('show'); valid = false;
        }

        if (!valid) {
            if (nameError.classList.contains('show')) nameInput.focus();
            else if (emailError.classList.contains('show')) emailInput.focus();
            else if (messageError.classList.contains('show')) messageInput.focus();
            else if (consentError && consentError.classList.contains('show')) consentInput.focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        setTimeout(() => {
            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }
            if (successMsg) successMsg.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="fas fa-arrow-right"></i>';
            form.reset();
            setTimeout(() => successMsg && successMsg.classList.remove('show'), 8000);
        }, 1200);
    });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;

    q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(other => {
            other.classList.remove('open');
            other.querySelector('.faq-a').style.maxHeight = null;
        });
        if (!isOpen) {
            item.classList.add('open');
            a.style.maxHeight = a.scrollHeight + 'px';
        }
    });
});

/* ============================================================
   GALLERY FILTERS
   ============================================================ */
const filterButtons = document.querySelectorAll('.filter-btn');
if (filterButtons.length) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.work-item').forEach(item => {
                const match = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('hide', !match);
            });
        });
    });
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbCaption = lightbox.querySelector('.lb-caption');
    const lbCounter = lightbox.querySelector('.lb-counter');
    const items = Array.from(document.querySelectorAll('.work-item[data-full]'));
    let current = 0;

    const openLb = (index) => {
        current = index;
        const item = items[current];
        lbImg.src = item.dataset.full;
        lbImg.alt = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
        lbCaption.textContent = item.querySelector('h4') ? item.querySelector('h4').textContent : '';
        lbCounter.textContent = (current + 1) + ' / ' + items.length;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeLb = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    };

    const showNext = (dir) => {
        current = (current + dir + items.length) % items.length;
        openLb(current);
    };

    items.forEach((item, i) => item.addEventListener('click', () => openLb(i)));

    lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
    lightbox.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); showNext(-1); });
    lightbox.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); showNext(1); });

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') showNext(-1);
        if (e.key === 'ArrowRight') showNext(1);
    });
}

/* ============================================================
   CHAT WIDGET
   ============================================================ */
const chatToggle = document.getElementById('chatToggle');
const chatPopup = document.getElementById('chatPopup');
const chatClose = document.getElementById('chatClose');
const chatDismiss = document.getElementById('chatDismiss');
const chatBadge = document.getElementById('chatBadge');

if (chatToggle && chatPopup) {
    // Toggle chat popup
    chatToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        chatPopup.classList.toggle('open');
        // Hide the red notification badge once clicked
        if (chatBadge) chatBadge.style.display = 'none';
    });

    // Close functions
    const closeChat = () => {
        chatPopup.classList.remove('open');
    };

    if (chatClose) chatClose.addEventListener('click', closeChat);
    if (chatDismiss) chatDismiss.addEventListener('click', closeChat);

    // Close when clicking outside the popup
    document.addEventListener('click', (e) => {
        if (!chatPopup.contains(e.target) && !chatToggle.contains(e.target)) {
            closeChat();
        }
    });
}

/* ---------- CONSOLE SIGNATURE ---------- */
console.log('Gary Hall Garden Services — Professional Gardener in Brighton & Hove');
console.log('📞 07951 434795');
console.log('📧 garyhallgardenservices@gmail.com');
console.log('📍 Brighton & Hove, UK');