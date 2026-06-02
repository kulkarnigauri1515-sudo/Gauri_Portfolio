/* ═══════════════════════════════
   CINEMATIC PORTFOLIO — script.js
═══════════════════════════════ */

/* ── Custom cursor ── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

(function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
})();

// Hover expansion
document.querySelectorAll('a, button, .project, .service').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    navLinks.classList.remove('open');
    updateBurger(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Sticky nav ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

/* ── Burger menu ── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  updateBurger(open);
});

function updateBurger(open) {
  const [s1, s2] = burger.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'translateY(8px) rotate(45deg)';
    s2.style.transform = 'translateY(0px) rotate(-45deg)';
  } else {
    s1.style.transform = '';
    s2.style.transform = '';
  }
}

/* ── Scroll-reveal ── */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ── Parallax on orbs ── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    document.querySelectorAll('.orb--1').forEach(o => {
      o.style.transform = `translateY(${y * 0.12}px)`;
    });
    document.querySelectorAll('.orb--2').forEach(o => {
      o.style.transform = `translateY(${y * 0.07}px)`;
    });
    ticking = false;
  });
}, { passive: true });

/* ── Active nav link ── */
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav__link:not(.nav__cta)');

const activeIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinkEls.forEach(l => { l.style.color = ''; });
    const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
    if (active) active.style.color = 'var(--ivory)';
  });
}, { threshold: 0.5 });

sections.forEach(s => activeIO.observe(s));

/* ── Stagger project cards ── */
document.querySelectorAll('.project').forEach((card, i) => {
  card.style.setProperty('--i', i);
});

/* ── Number counter animation ── */
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.counter-card__num').forEach(num => {
      const raw   = num.textContent.replace(/[^0-9]/g, '');
      const final = parseInt(raw, 10);
      if (isNaN(final)) return;
      const sup = num.querySelector('sup') ? num.querySelector('sup').outerHTML : '';
      let start = 0;
      const dur = 1800;
      const startTime = performance.now();
      const tick = now => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / dur, 1);
        // Ease out expo
        const eased = 1 - Math.pow(1 - progress, 4);
        start = Math.round(eased * final);
        num.innerHTML = (start < 10 ? '0' : '') + start + sup;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    counterIO.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.about__counter-grid').forEach(g => counterIO.observe(g));

/* ── Service row hover tilt ── */
document.querySelectorAll('.service').forEach(svc => {
  svc.addEventListener('mousemove', e => {
    const rect = svc.getBoundingClientRect();
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    svc.style.transform = `translateY(-2px) rotateX(${-relY * 3}deg)`;
  });
  svc.addEventListener('mouseleave', () => {
    svc.style.transform = '';
  });
});

/* ── Contact form ── */
const form = document.getElementById('contactForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) { showToast('Please fill in all required fields.', 'error'); return; }
  if (!emailRx.test(email)) { showToast('Please enter a valid email address.', 'error'); return; }

  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Send message ✦';
    showToast(`Message sent, ${name}. I'll be in touch soon. ✦`, 'success');
  }, 1600);
});

/* ── Cinematic toast ── */
function showToast(msg, type) {
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;

  Object.assign(toast.style, {
    position:   'fixed',
    bottom:     '2.5rem',
    right:      '2.5rem',
    padding:    '1.1rem 2rem',
    fontFamily: "'Outfit', sans-serif",
    fontSize:   '0.9rem',
    fontWeight: '300',
    letterSpacing: '0.04em',
    color:      type === 'success' ? '#e9d5ff' : '#fca5a5',
    background: type === 'success'
      ? 'rgba(14,0,24,0.95)'
      : 'rgba(20,0,0,0.95)',
    border:     `1px solid ${type === 'success' ? 'rgba(168,85,247,0.4)' : 'rgba(239,68,68,0.4)'}`,
    borderRadius: '12px',
    boxShadow:  '0 20px 60px rgba(0,0,0,0.5)',
    zIndex:     '9999',
    maxWidth:   '340px',
    lineHeight: '1.6',
    transform:  'translateY(20px)',
    opacity:    '0',
    transition: 'opacity 0.5s ease, transform 0.5s ease',
    backdropFilter: 'blur(20px)',
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
  }));

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 500);
  }, 4500);
}

/* ── Mouse-follow glow on hero ── */
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    hero.style.setProperty('--mx', x + '%');
    hero.style.setProperty('--my', y + '%');
  });
}