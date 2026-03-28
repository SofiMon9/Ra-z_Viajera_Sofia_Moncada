
// ── Navigation ─────────────────────────────────────────────
const pages = ['home','packages','quote','contact'];
const navMap = {home:'home',packages:'packages',quote:'quote',contact:'contact'};

function navigateTo(page) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.remove('active');
  });
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({top:0, behavior:'smooth'});
    initReveals();
    updateNav(page);
    // Close mobile menu
    document.getElementById('navbar').classList.remove('open');
  }
}

function updateNav(activePage) {
  document.querySelectorAll('.navbar-links a').forEach(a => a.classList.remove('active'));
  const map = {home:'nav-home',packages:'nav-packages',quote:'nav-quote',contact:'nav-contact'};
  if (map[activePage]) {
    const el = document.getElementById(map[activePage]);
    if (el) el.classList.add('active');
  }
}

// ── Navbar scroll ────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 60
    ? '0 16px 48px rgba(31,27,20,.12)'
    : '0 12px 40px rgba(31,27,20,.07)';
});

function toggleNav() { navbar.classList.toggle('open'); }

// ── Scroll reveal ────────────────────────────────────────
function initReveals() {
  setTimeout(() => {
    const reveals = document.querySelectorAll('.page.active .reveal:not(.visible)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.1});
    reveals.forEach(el => observer.observe(el));
  }, 50);
}
initReveals();

// ── Package filter ────────────────────────────────────────
function filterPkgs(btn, region) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pkg-card').forEach(card => {
    if (region === 'all' || card.dataset.region === region) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── Quote calculator ──────────────────────────────────────
let currentLevel = 'essential';

function setLevel(level) {
  currentLevel = level;
  document.getElementById('lvl-essential').classList.toggle('active', level === 'essential');
  document.getElementById('lvl-immersive').classList.toggle('active', level === 'immersive');
  calcQuote();
}

function adjCount(delta) {
  const inp = document.getElementById('q-travelers');
  let val = parseInt(inp.value) + delta;
  val = Math.max(1, Math.min(20, val));
  inp.value = val;
  document.getElementById('q-count-display').textContent = val;
  calcQuote();
}

function calcQuote() {
  const dailyBase = parseInt(document.getElementById('q-territory').value);
  const days = Math.max(1, parseInt(document.getElementById('q-days').value) || 1);
  const travelers = parseInt(document.getElementById('q-travelers').value);
  const levelMult = currentLevel === 'immersive' ? 1.35 : 1.0;
  const heritageBase = 45000;

  // Group discount
  let discountPct = 0;
  if (travelers >= 5) discountPct = 15;
  else if (travelers >= 3) discountPct = 10;

  const rawDaily = dailyBase * levelMult;
  const discountedDaily = rawDaily * (1 - discountPct / 100);
  const total = (discountedDaily * days) + heritageBase;

  const fmt = n => '$' + Math.round(n).toLocaleString('es-CO');

  document.getElementById('r-daily').textContent = fmt(rawDaily);
  document.getElementById('r-discount').textContent = discountPct > 0 ? '−' + discountPct + '%' : 'Sin descuento';
  document.getElementById('r-level').textContent = currentLevel === 'immersive' ? 'Inmersivo (+35%)' : 'Esencial';
  document.getElementById('r-heritage').textContent = fmt(heritageBase);
  document.getElementById('r-total').textContent = fmt(total);
}

// Init quote
calcQuote();

// ── Contact form ──────────────────────────────────────────
function submitContact() {
  const success = document.getElementById('contact-success');
  success.style.display = 'block';
  setTimeout(() => { success.style.display = 'none'; }, 5000);
}

