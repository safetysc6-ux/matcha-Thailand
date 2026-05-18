const state={products:[],recipes:[]};
const gateMsg=document.getElementById('adminGateMsg');
const adminContent=document.getElementById('adminContent');
function renderRows(arr,type){return arr.map((item,i)=>`<div class='list-item-row'><span>${type==='p'?`${item.name} - ฿${item.price}`:item.name}</span><span><button class='btn btn-sm btn-outline-light' onclick='editItem("${type}",${i})'><i class='bi bi-pencil'></i></button> <button class='btn btn-sm btn-outline-danger' onclick='delItem("${type}",${i})'><i class='bi bi-trash'></i></button></span></div>`).join('');}
function draw(){productAdminList.innerHTML=renderRows(state.products,'p')||"<p class='small opacity-75 mb-0'>ยังไม่มีสินค้า</p>";recipeAdminList.innerHTML=renderRows(state.recipes,'r')||"<p class='small opacity-75 mb-0'>ยังไม่มีสูตร</p>";}
window.delItem=(t,i)=>{(t==='p'?state.products:state.recipes).splice(i,1);draw();};
window.editItem=(t,i)=>{if(t==='p'){const p=state.products[i];const name=prompt('ชื่อสินค้า',p.name);const price=prompt('ราคา',p.price);if(name&&price)state.products[i]={name,price};}else{const r=state.recipes[i];const name=prompt('ชื่อสูตร',r.name);const desc=prompt('รายละเอียด',r.desc);if(name&&desc)state.recipes[i]={name,desc};}draw();};
productForm.addEventListener('submit',e=>{e.preventDefault();state.products.unshift({name:productName.value,price:productPrice.value});productForm.reset();draw();});
recipeForm.addEventListener('submit',e=>{e.preventDefault();state.recipes.unshift({name:recipeName.value,desc:recipeDesc.value});recipeForm.reset();draw();});
saveHeroBtn.addEventListener('click',()=>alert('บันทึก Hero สำเร็จ'));
(async()=>{const {data:{user}}=await db.auth.getUser(); const isAdmin=!!(user?.email && user.email.endsWith('@admin.matcha')); gateMsg.textContent=isAdmin?'สิทธิ์ผู้ดูแลระบบพร้อมใช้งาน':'ปฏิเสธการเข้าถึง: เฉพาะ admin'; if(isAdmin){adminContent.classList.remove('d-none');} draw();})();
