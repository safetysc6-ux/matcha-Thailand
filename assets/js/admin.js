const gateMsg = document.getElementById('adminGateMsg');
const adminContent = document.getElementById('adminContent');
const recipeAdminList = document.getElementById('recipeAdminList');
const recipeModalEl = document.getElementById('recipeModal');
const recipeModal = recipeModalEl ? new bootstrap.Modal(recipeModalEl) : null;
const recipeForm = document.getElementById('recipeForm');
const recipeModalTitle = document.getElementById('recipeModalTitle');
const imagePreview = document.getElementById('imagePreview');

let editingId = null;

const formatMoney = (v) => `฿${Number(v || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

async function requireAdminAction() {
  const admin = await isAdmin();
  if (!admin) {
    alert('ปฏิเสธการเข้าถึง: เฉพาะผู้ดูแลระบบ');
    window.location.replace('index.html');
    return false;
  }
  return true;
}

function previewImage() {
  imagePreview.src = recipeForm.image_url.value || 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1200&auto=format&fit=crop';
}

async function openCreateModal() {
  if (!(await requireAdminAction())) return;
  editingId = null;
  recipeForm.reset();
  recipeForm.id.value = '';
  recipeForm.featured.checked = false;
  recipeModalTitle.textContent = 'เพิ่มสูตรใหม่';
  previewImage();
  recipeModal.show();
}

async function loadRecipes() {
  if (!(await requireAdminAction())) return;
  const { data, error } = await db.from('recipes').select('*').order('created_at', { ascending: false });
  if (error) {
    recipeAdminList.innerHTML = `<div class='alert alert-warning'>ไม่สามารถโหลดสูตรได้: ${error.message}</div>`;
    return;
  }
  if (!data.length) {
    recipeAdminList.innerHTML = "<p class='small opacity-75 mb-0'>ยังไม่มีสูตร</p>";
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
  if (!(await requireAdminAction())) return;
  const { data } = await db.from('recipes').select('*').eq('id', id).single();
  if (!data) return;
  editingId = id;
  recipeModalTitle.textContent = 'แก้ไขสูตร';
  Object.entries(data).forEach(([k, v]) => { if (recipeForm[k]) recipeForm[k].value = v ?? ''; });
  recipeForm.featured.checked = !!data.featured;
  previewImage();
  recipeModal.show();
};

window.toggleFeatured = async (id, current) => {
  if (!(await requireAdminAction())) return;
  await db.from('recipes').update({ featured: !current }).eq('id', id);
  loadRecipes();
};

window.deleteRecipe = async (id) => {
  if (!(await requireAdminAction())) return;
  if (!confirm('ยืนยันการลบสูตรนี้?')) return;
  await db.from('recipes').delete().eq('id', id);
  loadRecipes();
};

recipeForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!(await requireAdminAction())) return;

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

(async () => {
  const admin = await isAdmin();
  gateMsg.textContent = admin ? 'สิทธิ์ผู้ดูแลระบบพร้อมใช้งาน' : 'ปฏิเสธการเข้าถึง: เฉพาะ admin';
  if (admin) {
    adminContent.classList.remove('d-none');
    await loadRecipes();
  }
})();
