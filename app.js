const supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const thaiCurrency = (value) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 2 }).format(Number(value || 0));

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) return null;
  return data.user;
}

async function signOut() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}

function initBottomNav() {
  const nav = document.getElementById('bottom-nav');
  if (!nav) return;
  const path = location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('[data-page]').forEach((item) => {
    if (item.dataset.page === path) {
      item.classList.add('text-matcha-700');
      item.classList.remove('text-stone-500');
    }
  });
}

function observeFadeIns() {
  const items = document.querySelectorAll('.fade-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
      }
    });
  }, { threshold: 0.2 });
  items.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initBottomNav();
  observeFadeIns();
});
