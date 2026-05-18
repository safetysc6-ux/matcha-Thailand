const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentProfile = null;
let profileLoadedForUserId = null;

async function getCurrentUser() {
  const { data, error } = await db.auth.getUser();
  if (error) return null;
  return data?.user || null;
}

async function getCurrentRole() {
  const user = await getCurrentUser();
  if (!user) {
    currentProfile = null;
    profileLoadedForUserId = null;
    return null;
  }

  if (currentProfile && profileLoadedForUserId === user.id) return currentProfile.role || null;

  const { data, error } = await db
    .from('users')
    .select('id, email, role')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.warn('Cannot load profile:', error.message);
    return null;
  }

  currentProfile = data || null;
  profileLoadedForUserId = user.id;
  return currentProfile?.role || null;
}

async function isAdmin() {
  const role = await getCurrentRole();
  return role === 'admin';
}

async function applyAdminVisibility() {
  const admin = await isAdmin();
  document.querySelectorAll('[data-admin-only]').forEach((el) => {
    el.classList.toggle('d-none', !admin);
  });
}

async function ensureAdminPageAccess() {
  if (!location.pathname.endsWith('/admin.html') && !location.pathname.endsWith('admin.html')) return;
  const admin = await isAdmin();
  if (!admin) {
    window.location.replace('index.html');
  }
}

async function bootstrapAuth() {
  await getCurrentUser();
  await applyAdminVisibility();
  await ensureAdminPageAccess();
}

db.auth.onAuthStateChange(async (_event, session) => {
  if (!session?.user) {
    currentProfile = null;
    profileLoadedForUserId = null;
  }
  await bootstrapAuth();
});

window.getCurrentUser = getCurrentUser;
window.getCurrentRole = getCurrentRole;
window.isAdmin = isAdmin;
window.bootstrapAuth = bootstrapAuth;

bootstrapAuth();
