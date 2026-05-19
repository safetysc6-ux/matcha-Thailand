if (!window.db) { alert('ยังไม่ได้ตั้งค่า Supabase'); }
const adminContent = document.getElementById('adminContent');
const recipeAdminList = document.getElementById('recipeAdminList');
const recipeModalEl = document.getElementById('recipeModal');
const recipeModal = recipeModalEl ? new bootstrap.Modal(recipeModalEl) : null;
const recipeForm = document.getElementById('recipeForm');
const recipeModalTitle = document.getElementById('recipeModalTitle');
const imagePreview = document.getElementById('imagePreview');

const productAdminList = document.getElementById('productAdminList');
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const productForm = document.getElementById('productForm');
const productModalTitle = document.getElementById('productModalTitle');

let editingId = null;
let editingProductId = null;

const formatMoney = (v) => `฿${Number(v || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function previewImage() {
  imagePreview.src = recipeForm.image_url.value || 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1200&auto=format&fit=crop';
}

async function loadProducts() {
  const { data, error } = await db.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    productAdminList.innerHTML = `<div class='alert alert-warning'>ไม่สามารถโหลดสินค้าได้: ${error.message}</div>`;
    return;
  }
  if (!data.length) {
    productAdminList.innerHTML = "<p class='small opacity-75 mb-0'>ยังไม่มีสินค้า</p>";
    return;
  }
  productAdminList.innerHTML = data.map((p) => `
    <article class='recipe-admin-item'>
      <img src='${p.image_url}' class='recipe-admin-thumb' alt='${p.name}'>
      <div class='flex-grow-1 d-flex justify-content-between align-items-start'>
        <div><h6 class='mb-1'>${p.name}</h6><p class='small mb-0'>${formatMoney(p.price)}</p></div>
        <div class='d-flex gap-1'>
          <button class='btn btn-sm btn-outline-light' onclick='editProduct(${p.id})'><i class='bi bi-pencil'></i></button>
          <button class='btn btn-sm btn-outline-danger' onclick='deleteProduct(${p.id})'><i class='bi bi-trash'></i></button>
        </div>
      </div>
    </article>`).join('');
}

window.editProduct = async (id) => {
  const { data } = await db.from('products').select('*').eq('id', id).single();
  if (!data) return;
  editingProductId = id;
  productModalTitle.textContent = 'แก้ไขสินค้า';
  productForm.name.value = data.name;
  productForm.price.value = data.price;
  productForm.img.value = data.image_url || ''; 
  productModal.show();
};

window.deleteProduct = async (id) => {
  if (!confirm('ยืนยันการลบสินค้า?')) return;
  await db.from('products').delete().eq('id', id);
  loadProducts();
};

document.getElementById('newProductBtn')?.addEventListener('click', () => {
  editingProductId = null;
  productModalTitle.textContent = 'เพิ่มสินค้า';
  productForm.reset();
  productModal.show();
});

productForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = { name: productForm.name.value.trim(), price: Number(productForm.price.value || 0), image_url: productForm.img.value.trim() };
  if (editingProductId === null) await db.from('products').insert(payload);
  else await db.from('products').update(payload).eq('id', editingProductId);
  productModal.hide();
  loadProducts();
});

async function openCreateModal() {
  editingId = null;
  recipeForm.reset();
  recipeForm.id.value = '';
  recipeForm.featured.checked = false;
  recipeModalTitle.textContent = 'เพิ่มบทความสูตรใหม่';
  previewImage();
  recipeModal.show();
}

async function loadRecipes() {
  const { data, error } = await db.from('recipes').select('*').order('created_at', { ascending: false });
  if (error) {
    recipeAdminList.innerHTML = `<div class='alert alert-warning'>ไม่สามารถโหลดบทความสูตรได้: ${error.message}</div>`;
    return;
  }
  if (!data.length) {
    recipeAdminList.innerHTML = "<p class='small opacity-75 mb-0'>ยังไม่มีบทความสูตร</p>";
    return;
  }

  recipeAdminList.innerHTML = data.map((r) => `
    <article class='recipe-admin-item'>
      <img src='${r.image_url || ''}' alt='${r.title}' class='recipe-admin-thumb'>
      <div class='flex-grow-1'>
        <div class='d-flex justify-content-between align-items-start gap-2'>
          <div>
            <h6 class='mb-1'>${r.title}</h6>
            <p class='small mb-1 opacity-75'>${r.category || 'ไม่ระบุหมวดหมู่'} • ${r.featured ? 'Featured' : 'ทั่วไป'}</p>
            <p class='small mb-0'>ต้นทุน ${formatMoney(r.matcha_cost)} | ราคาขาย ${formatMoney(r.selling_price)} | กำไร ${formatMoney(r.profit)}</p>
          </div>
          <div class='d-flex gap-1'>
            <button class='btn btn-sm btn-outline-light' onclick='editRecipe(${r.id})'><i class='bi bi-pencil'></i></button>
            <button class='btn btn-sm btn-outline-warning' onclick='toggleFeatured(${r.id}, ${r.featured})'><i class='bi bi-star${r.featured ? '-fill' : ''}'></i></button>
            <button class='btn btn-sm btn-outline-danger' onclick='deleteRecipe(${r.id})'><i class='bi bi-trash'></i></button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

window.editRecipe = async (id) => {
  const { data } = await db.from('recipes').select('*').eq('id', id).single();
  if (!data) return;
  editingId = id;
  recipeModalTitle.textContent = 'แก้ไขบทความสูตร';
  Object.entries(data).forEach(([k, v]) => { if (recipeForm[k]) recipeForm[k].value = v ?? ''; });
  recipeForm.featured.checked = !!data.featured;
  previewImage();
  recipeModal.show();
};

window.toggleFeatured = async (id, current) => {
  await db.from('recipes').update({ featured: !current }).eq('id', id);
  loadRecipes();
};

window.deleteRecipe = async (id) => {
  if (!confirm('ยืนยันการลบบทความสูตรนี้?')) return;
  await db.from('recipes').delete().eq('id', id);
  loadRecipes();
};

recipeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    title: recipeForm.title.value.trim(),
    description: recipeForm.description.value.trim(),
    ingredients: recipeForm.ingredients.value.trim(),
    brewing_steps: recipeForm.brewing_steps.value.trim(),
    matcha_cost: Number(recipeForm.matcha_cost.value || 0),
    selling_price: Number(recipeForm.selling_price.value || 0),
    profit: Number(recipeForm.selling_price.value || 0) - Number(recipeForm.matcha_cost.value || 0),
    image_url: recipeForm.image_url.value.trim(),
    category: recipeForm.category.value.trim(),
    featured: recipeForm.featured.checked,
  };

  let error;
  if (editingId) ({ error } = await db.from('recipes').update(payload).eq('id', editingId));
  else ({ error } = await db.from('recipes').insert(payload));

  if (error) return alert(error.message);
  recipeModal.hide();
  loadRecipes();
});

recipeForm?.image_url.addEventListener('input', previewImage);
document.getElementById('newRecipeBtn')?.addEventListener('click', openCreateModal);

adminContent.classList.remove('d-none');
if (window.db) {
  loadProducts();
  loadRecipes();
}
