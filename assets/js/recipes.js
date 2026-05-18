AOS.init({duration:700,once:true});
const recipes=[{name:'Classic Usucha Latte',desc:'มัทฉะ 2g + นม 150ml + ไซรัป 10ml'},{name:'Matcha Coconut Cloud',desc:'มัทฉะ 2.5g + น้ำมะพร้าว 120ml + โฟมนม'},{name:'Dirty Matcha Espresso',desc:'มัทฉะ 2g + นม 100ml + espresso shot'}];
const list=document.getElementById('recipeList');
list.innerHTML=recipes.map((r,i)=>`<div class='col-12' data-aos='fade-up' data-aos-delay='${i*80}'><div class='premium-card p-3'><h6>${r.name}</h6><p class='mb-0'>${r.desc}</p></div></div>`).join('');
document.getElementById('shareRecipeBtn').addEventListener('click',()=>alert('MVP: เชื่อมฟอร์มแชร์สูตรกับ Supabase table recipes ได้ทันที'));
