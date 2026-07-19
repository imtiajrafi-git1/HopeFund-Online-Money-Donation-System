/* ============================================================
   HopeFund – Common App Logic (runs on every page)
   Requires: storage.js loaded before this file
   ============================================================ */

/* ---------- UTILITIES ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => root.querySelectorAll(sel);
const formatMoney = n => '৳' + Number(n).toLocaleString('en-IN');
const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' • ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/* ---------- NAV: mobile menu + scroll shadow ---------- */
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
if (menuToggle) menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

document.addEventListener('click', e => {
  if (navLinks && navLinks.classList.contains('open') && !e.target.closest('.nav-container')) {
    navLinks.classList.remove('open');
  }
});

window.addEventListener('scroll', () => {
  const navbar = $('#navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  const toTop = $('#toTop');
  if (toTop) toTop.classList.toggle('show', window.scrollY > 400);
  runRevealCheck();
});

const toTopBtn = $('#toTop');
if (toTopBtn) toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- REVEAL ANIMATIONS ---------- */
function runRevealCheck() {
  $$('.reveal').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 60) el.classList.add('in');
  });
}

/* ---------- TOAST ---------- */
let toastTimer;
function showToast(msg, isError = false) {
  const toast = $('#toast');
  if (!toast) return;
  $('#toastMsg').textContent = msg;
  toast.classList.toggle('error', isError);
  toast.querySelector('i').className = isError ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---------- MODAL ---------- */
function closeModal() {
  const modal = $('#modal');
  if (modal) modal.classList.remove('show');
}
const modalEl = $('#modal');
if (modalEl) modalEl.addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });

/* ---------- FOOTER NEWSLETTER ---------- */
const newsletterForm = $('.newsletter');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Subscribed successfully!');
    newsletterForm.reset();
  });
}

/* ---------- SEED DEMO DATA (first visit only) ---------- */
function seedDemo() {
  if (Storage.getAll().length > 0) return;
  const demo = [
    { name: 'Ayesha Rahman', email: 'ayesha@example.com', phone: '+8801711111111', campaign: 'Education Fund', amount: 5000, payment: 'bKash' },
    { name: 'Karim Hossain', email: 'karim@example.com', phone: '+8801722222222', campaign: 'Medical Emergency', amount: 12000, payment: 'Nagad' },
    { name: 'Sadia Islam', email: 'sadia@example.com', phone: '+8801733333333', campaign: 'Flood Relief', amount: 3000, payment: 'Bank Transfer' },
    { name: 'Rafiq Ahmed', email: 'rafiq@example.com', phone: '+8801744444444', campaign: 'Education Fund', amount: 2500, payment: 'bKash' },
    { name: 'Nusrat Jahan', email: 'nusrat@example.com', phone: '+8801755555555', campaign: 'Medical Emergency', amount: 8000, payment: 'Nagad' },
  ];
  demo.forEach(d => Storage.add(d));
}

/* ---------- INIT (common to every page) ---------- */
window.addEventListener('load', () => {
  seedDemo();
  setTimeout(() => {
    const loader = $('#loader');
    if (loader) loader.classList.add('hide');
    runRevealCheck();
  }, 700);
});
