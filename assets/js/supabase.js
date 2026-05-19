(function () {
  const supabaseLib = window.supabase;
  const url = window.SUPABASE_URL;
  const anon = window.SUPABASE_ANON_KEY;

  let db = window.db || null;
  if (!db && supabaseLib?.createClient && url && anon) {
    db = supabaseLib.createClient(url, anon);
  }

  window.db = db;
  window.hasDb = !!db;

  if (!db) {
    console.warn('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in supabase-config.js');
    window.getCurrentUser = async () => null;
    window.getCurrentRole = async () => null;
    window.isAdmin = async () => false;
    window.bootstrapAuth = async () => {};
    window.ensureUserProfile = async () => null;
    return;
  }

  let currentProfile = null;
  let profileLoadedForUserId = null;

  async function ensureUserProfile() {
    const user = await getCurrentUser();
    if (!user) return null;
    const payload = {
      id: user.id,
      email: user.email || '',
      display_name: user.user_metadata?.full_name || user.user_metadata?.name || null
    };

    const { data, error } = await db.from('users').upsert(payload, { onConflict: 'id' }).select('id, email, role').single();
    if (error) return null;
    currentProfile = data || null;
    profileLoadedForUserId = user.id;
    return currentProfile;
  }

  async function getCurrentUser() {
    const { data, error } = await db.auth.getUser();
    if (error) return null;
    return data?.user || null;
  }

  async function getCurrentRole() {
    const user = await getCurrentUser();
    if (!user) return null;
    if (currentProfile && profileLoadedForUserId === user.id) return currentProfile.role || null;
    const { data, error } = await db.from('users').select('id, email, role').eq('id', user.id).maybeSingle();
    if (error) return null;
    currentProfile = data || null;
    profileLoadedForUserId = user.id;
    return currentProfile?.role || null;
  }

  async function isAdmin() {
    return (await getCurrentRole()) === 'admin';
  }

  async function bootstrapAuth() {
    await ensureUserProfile();
  }

  db.auth.onAuthStateChange(async () => {
    await bootstrapAuth();
  });

  window.getCurrentUser = getCurrentUser;
  window.getCurrentRole = getCurrentRole;
  window.isAdmin = isAdmin;
  window.bootstrapAuth = bootstrapAuth;
  window.ensureUserProfile = ensureUserProfile;
})();
