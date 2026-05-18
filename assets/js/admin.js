const state={products:[],recipes:[]};
const productForm=document.getElementById('productForm');
const recipeForm=document.getElementById('recipeForm');
const productList=document.getElementById('productAdminList');
const recipeList=document.getElementById('recipeAdminList');
function draw(){productList.innerHTML=state.products.map((p,i)=>`<li>${p.name} - ฿${p.price} <button onclick='delP(${i})'>ลบ</button></li>`).join('');recipeList.innerHTML=state.recipes.map((r,i)=>`<li>${r.name} <button onclick='delR(${i})'>ลบ</button></li>`).join('');}
window.delP=i=>{state.products.splice(i,1);draw()}; window.delR=i=>{state.recipes.splice(i,1);draw()};
productForm.addEventListener('submit',e=>{e.preventDefault();state.products.push({name:productName.value,price:productPrice.value});productForm.reset();draw()});
recipeForm.addEventListener('submit',e=>{e.preventDefault();state.recipes.push({name:recipeName.value,desc:recipeDesc.value});recipeForm.reset();draw()});
saveHeroBtn.addEventListener('click',()=>alert('บันทึกเนื้อหาสำเร็จ (MVP local state)'));
