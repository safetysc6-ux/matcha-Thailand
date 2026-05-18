const loginForm=document.getElementById('loginForm');
const signupForm=document.getElementById('signupForm');
if(loginForm){loginForm.addEventListener('submit',async e=>{e.preventDefault();const email=loginEmail.value;const {error}=await db.auth.signInWithOtp({email});loginMsg.textContent=error?error.message:'ส่งลิงก์เข้าสู่ระบบไปที่อีเมลแล้ว';});}
if(signupForm){signupForm.addEventListener('submit',async e=>{e.preventDefault();const email=signupEmail.value;const {error}=await db.auth.signInWithOtp({email});signupMsg.textContent=error?error.message:'ส่งลิงก์สมัครสมาชิกไปที่อีเมลแล้ว';});
  googleSignup.addEventListener('click',async()=>{await db.auth.signInWithOAuth({provider:'google'});});}
