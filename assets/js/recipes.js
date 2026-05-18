AOS.init({duration:700,once:true,offset:40});
const KEY='matcha_recipes_v1';
const seed=[{name:'Classic Usucha Latte',desc:'มัทฉะ 2g + นม 150ml + ไซรัป 10ml'},{name:'Matcha Coconut Cloud',desc:'มัทฉะ 2.5g + น้ำมะพร้าว 120ml + โฟมนม'}];
const list=document.getElementById('recipeList');
const state=JSON.parse(localStorage.getItem(KEY)||'null')||seed;
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function draw(){list.innerHTML=state.map((r,i)=>`<div class='col-12' data-aos='fade-up' data-aos-delay='${i*60}'><div class='premium-card p-3'><div class='d-flex justify-content-between gap-2'><h6 class='mb-1'>${r.name}</h6><div><button class='btn btn-sm btn-outline-secondary' onclick='editRecipe(${i})'><i class='bi bi-pencil'></i></button> <button class='btn btn-sm btn-outline-danger' onclick='deleteRecipe(${i})'><i class='bi bi-trash'></i></button></div></div><p class='mb-2'>${r.desc}</p><button class='btn btn-sm btn-outline-dark' onclick='shareRecipe(${i})'><i class='bi bi-share'></i> แชร์สูตร</button></div></div>`).join('');}
window.deleteRecipe=(i)=>{state.splice(i,1);save();draw();};
window.editRecipe=(i)=>{const name=prompt('ชื่อสูตร',state[i].name);if(!name)return;const desc=prompt('รายละเอียดสูตร',state[i].desc);if(!desc)return;state[i]={name,desc};save();draw();};
window.shareRecipe=(i)=>{navigator.clipboard?.writeText(`${state[i].name}\n${state[i].desc}`);alert('คัดลอกสูตรแล้ว สามารถแชร์ต่อได้ทันที');};
document.getElementById('newRecipeBtn').addEventListener('click',()=>{const name=prompt('ชื่อสูตรใหม่');if(!name)return;const desc=prompt('รายละเอียดสูตร');if(!desc)return;state.unshift({name,desc});save();draw();});
draw();
