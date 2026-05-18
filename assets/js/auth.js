const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const withLoading = async (btn, fn) => {
  if (!btn) return fn();
  btn.disabled = true;
  const t = btn.textContent;
  btn.textContent = 'กำลังดำเนินการ...';
  try { await fn(); } finally { btn.disabled = false; btn.textContent = t; }
};

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    await withLoading(document.getElementById('loginSubmit'), async () => {
      const { error } = await db.auth.signInWithOtp({ email });
      loginMsg.textContent = error ? error.message : 'ส่งลิงก์เข้าสู่ระบบเรียบร้อยแล้ว';
    });
  });
}
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    await withLoading(document.getElementById('signupSubmit'), async () => {
      const { error } = await db.auth.signInWithOtp({ email });
      signupMsg.textContent = error ? error.message : 'ส่งลิงก์สมัครสมาชิกเรียบร้อยแล้ว';
    });
  });
  document.getElementById('googleSignup').addEventListener('click', async () => {
    await db.auth.signInWithOAuth({ provider: 'google' });
  });
}
