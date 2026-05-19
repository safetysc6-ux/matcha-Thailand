const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginMsg = document.getElementById('loginMsg');
const signupMsg = document.getElementById('signupMsg');

const withLoading = async (btn, fn) => {
  if (!btn) return fn();
  btn.disabled = true;
  const t = btn.textContent;
  btn.textContent = 'กำลังดำเนินการ...';
  try { await fn(); } finally { btn.disabled = false; btn.textContent = t; }
};

const emailRedirectTo = `${window.location.origin}/login.html`;

const redirectToAppForAuthenticatedUser = async () => {
  const user = await getCurrentUser();
  if (!user) return;
  const admin = await isAdmin();
  window.location.replace(admin ? 'admin.html' : 'index.html');
};

async function redirectIfLoggedIn() {
  await redirectToAppForAuthenticatedUser();
}

window.db.auth.onAuthStateChange(async (event, session) => {
  if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
    await redirectToAppForAuthenticatedUser();
  }
});

if (loginForm) {
  redirectIfLoggedIn();
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    await withLoading(document.getElementById('loginSubmit'), async () => {
      const { error } = await window.db.auth.signInWithOtp({ email, options: { emailRedirectTo } });
      loginMsg.textContent = error ? error.message : 'ส่งลิงก์เข้าสู่ระบบเรียบร้อยแล้ว กรุณาเปิดลิงก์บนอุปกรณ์นี้';
    });
  });
}

if (signupForm) {
  redirectIfLoggedIn();
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    await withLoading(document.getElementById('signupSubmit'), async () => {
      const { error } = await window.db.auth.signInWithOtp({ email, options: { emailRedirectTo } });
      signupMsg.textContent = error ? error.message : 'ส่งลิงก์สมัครสมาชิกเรียบร้อยแล้ว กรุณาเปิดลิงก์บนอุปกรณ์นี้';
    });
  });

  document.getElementById('googleSignup').addEventListener('click', async () => {
    await window.db.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: emailRedirectTo, skipBrowserRedirect: false }
    });
  });
}
