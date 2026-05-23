// ===== THREE.JS BACKGROUND =====
try {
const canvas = document.getElementById('webgl');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 7;

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.TorusKnotGeometry(1.75, 0.42, 220, 32);
const material = new THREE.MeshStandardMaterial({ color: 0x2563eb, wireframe: true, transparent: true, opacity: 0.42 });
const mesh = new THREE.Mesh(geometry, material);
group.add(mesh);

const particlesGeometry = new THREE.BufferGeometry();
const count = 800;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 20;
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.022, transparent: true, opacity: 0.5 });
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const particles2Geometry = new THREE.BufferGeometry();
const positions2 = new Float32Array(400 * 3);
for (let i = 0; i < 400 * 3; i++) positions2[i] = (Math.random() - 0.5) * 18;
particles2Geometry.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
const particles2Material = new THREE.PointsMaterial({ color: 0x06b6d4, size: 0.018, transparent: true, opacity: 0.45 });
const particles2 = new THREE.Points(particles2Geometry, particles2Material);
scene.add(particles2);

const light1 = new THREE.PointLight(0x2563eb, 2.2); light1.position.set(5, 5, 5); scene.add(light1);
const light2 = new THREE.PointLight(0x7c3aed, 1.6); light2.position.set(-5, -3, 4); scene.add(light2);
const light3 = new THREE.PointLight(0x06b6d4, 1.2); light3.position.set(0, 8, -3); scene.add(light3);

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.003;
  mesh.rotation.y += 0.004;
  particles.rotation.y += 0.0007;
  particles.rotation.x += 0.0003;
  particles2.rotation.y -= 0.0009;
  group.rotation.y += (mouseX * 0.3 - group.rotation.y) * 0.022;
  group.rotation.x += (-mouseY * 0.3 - group.rotation.x) * 0.022;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
} catch(e) { /* Three.js unavailable – skip 3D background */ }

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
function doReveal() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
      el.classList.add('active');
    }
  });
}
window.addEventListener('scroll', doReveal);
doReveal();
requestAnimationFrame(() => requestAnimationFrame(doReveal));
window.addEventListener('load', doReveal);

// ===== LANGUAGE SWITCHER =====
let currentLang = localStorage.getItem('ahmed-portfolio-lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ahmed-portfolio-lang', lang);

  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  const label = document.getElementById('langLabel');
  if (label) label.textContent = lang === 'ar' ? 'English' : 'العربية';

  document.title = lang === 'ar'
    ? (document.documentElement.dataset.titleAr || 'أحمد نور | مهندس برمجيات')
    : (document.documentElement.dataset.titleEn || 'Ahmed Nour | Software Engineer');

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text === null) return;
    el.innerHTML = text;
  });
}

const langBtn = document.getElementById('langToggle');
if (langBtn) {
  langBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'ar' : 'en');
  });
}

applyLanguage(currentLang);

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.style.background = 'rgba(248,251,255,0.96)';
    header.style.boxShadow = '0 4px 40px rgba(37,99,235,0.1)';
  } else {
    header.style.background = 'rgba(248,251,255,0.84)';
    header.style.boxShadow = '0 2px 30px rgba(37,99,235,0.05)';
  }
});

// ===== COUNTRIES SLIDER =====
const COUNTRY_CODES = ['sa', 'eg', 'ae', 'lb', 'gb', 'om', 'ma', 'kw', 'us'];
const VISIBLE_CARDS = 4; // cards visible at once
let sliderIndex = 0;

function buildDots(total) {
  const dotsEl = document.getElementById('sliderDots');
  if (!dotsEl) return;
  const pages = Math.ceil(total / VISIBLE_CARDS);
  dotsEl.innerHTML = Array.from({ length: pages }, (_, i) =>
    `<button class="slider-dot${i === 0 ? ' active' : ''}" data-page="${i}"></button>`
  ).join('');
  dotsEl.querySelectorAll('.slider-dot').forEach(dot => {
    dot.addEventListener('click', () => goToPage(parseInt(dot.dataset.page)));
  });
}

function goToPage(page) {
  const track = document.getElementById('countryGrid');
  const cards = track ? track.children : [];
  const total = cards.length;
  const pages = Math.ceil(total / VISIBLE_CARDS);
  sliderIndex = Math.max(0, Math.min(page, pages - 1));
  const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 220; // width + gap
  track.style.transform = `translateX(${-sliderIndex * VISIBLE_CARDS * cardWidth}px)`;
  // update dots
  document.querySelectorAll('.slider-dot').forEach((d, i) => {
    d.classList.toggle('active', i === sliderIndex);
  });
  // update buttons
  const prev = document.getElementById('sliderPrev');
  const next = document.getElementById('sliderNext');
  if (prev) prev.disabled = sliderIndex === 0;
  if (next) next.disabled = sliderIndex >= pages - 1;
}

function initSlider(totalCards) {
  buildDots(totalCards);
  goToPage(0);
  document.getElementById('sliderPrev')?.addEventListener('click', () => goToPage(sliderIndex - 1));
  document.getElementById('sliderNext')?.addEventListener('click', () => goToPage(sliderIndex + 1));
  // auto-play every 3.5 s
  setInterval(() => {
    const pages = Math.ceil(totalCards / VISIBLE_CARDS);
    goToPage(sliderIndex >= pages - 1 ? 0 : sliderIndex + 1);
  }, 3500);
  // re-calc on resize
  window.addEventListener('resize', () => goToPage(sliderIndex));
}

function renderCards(ordered) {
  const grid = document.getElementById('countryGrid');
  if (!grid) return;

  // Pad last page: clone from start so no empty slots
  const remainder = ordered.length % VISIBLE_CARDS;
  const padded = remainder === 0
    ? ordered
    : [...ordered, ...ordered.slice(0, VISIBLE_CARDS - remainder)];

  grid.innerHTML = padded.map(([flagUrl, enName, arName]) => {
    const displayName = currentLang === 'ar' ? arName : enName;
    return `<div class="country-card">
      <img src="${flagUrl}" alt="${enName}" loading="lazy">
      <span data-en="${enName}" data-ar="${arName}">${displayName}</span>
    </div>`;
  }).join('');
  doReveal();
  initSlider(padded.length);
}

async function loadCountries() {
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/alpha?codes=' + COUNTRY_CODES.join(',') +
      '&fields=name,flags,translations,cca2'
    );
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const ordered = COUNTRY_CODES
      .map(code => data.find(c => c.cca2.toLowerCase() === code))
      .filter(Boolean)
      .map(country => [
        country.flags?.png || country.flags?.svg || '',
        country.name.common,
        country.translations?.ara?.common || country.name.common
      ]);
    renderCards(ordered);
  } catch {
    const fallback = [
      ['https://flagcdn.com/w160/sa.png', 'Saudi Arabia', 'المملكة العربية السعودية'],
      ['https://flagcdn.com/w160/eg.png', 'Egypt', 'مصر'],
      ['https://flagcdn.com/w160/ae.png', 'UAE', 'الإمارات'],
      ['https://flagcdn.com/w160/lb.png', 'Lebanon', 'لبنان'],
      ['https://flagcdn.com/w160/gb.png', 'United Kingdom', 'المملكة المتحدة'],
      ['https://flagcdn.com/w160/om.png', 'Oman', 'عُمان'],
      ['https://flagcdn.com/w160/ma.png', 'Morocco', 'المغرب'],
      ['https://flagcdn.com/w160/kw.png', 'Kuwait', 'الكويت'],
      ['https://flagcdn.com/w160/us.png', 'United States', 'الولايات المتحدة'],
    ];
    renderCards(fallback);
  }
}

loadCountries();

// ===== MOBILE SIDEBAR =====
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('mobileClose');
  if (!hamburger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  // Close on Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
})();

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 140) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--blue)' : '';
  });
});

// ===== PROJECTS FILTER =====
(function () {
  const filters = document.getElementById('projFilters');
  if (!filters) return;
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.pf-btn');
    if (!btn) return;
    filters.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.proj-compact-card, .proj-hero-card').forEach(card => {
      const cat = card.dataset.category || '';
      card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
    });
    // re-layout compact grid when hero cards hidden
    const heroRow = document.querySelector('.proj-hero-row');
    if (heroRow) {
      const visibleHero = [...heroRow.querySelectorAll('.proj-hero-card')].some(c => c.style.display !== 'none');
      heroRow.style.display = visibleHero ? '' : 'none';
    }
  });
})();
