AOS.init({ duration: 700, once: true, offset: 40 });

const list = document.getElementById('recipeList');
const chips = document.getElementById('categoryChips');

const formatMoney = (v) => `฿${Number(v || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function card(r, i) {
  return `<div class='col-12 col-md-6 col-xl-4' data-aos='fade-up' data-aos-delay='${Math.min(i * 50, 220)}'>
    <a href='recipe-detail.html?id=${r.id}' class='recipe-card-link'>
      <article class='recipe-card'>
        <img src='${r.image_url || "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1200&auto=format&fit=crop"}' alt='${r.title}' class='recipe-card-img'>
        <div class='recipe-card-body'>
          <p class='recipe-category'>${r.category || 'Signature'}</p>
          <h3>${r.title}</h3>
          <p class='recipe-desc'>${r.description || ''}</p>
          <div class='price-grid'>
            <span>ต้นทุน <strong>${formatMoney(r.matcha_cost)}</strong></span>
            <span>ขาย <strong>${formatMoney(r.selling_price)}</strong></span>
            <span class='profit-pill'>กำไร ${formatMoney(r.profit)}</span>
          </div>
        </div>
      </article>
    </a>
  </div>`;
}

async function loadRecipes(category = 'ทั้งหมด') {
  let q = db.from('recipes').select('*').order('featured', { ascending: false }).order('created_at', { ascending: false });
  if (category !== 'ทั้งหมด') q = q.eq('category', category);
  const { data, error } = await q;
  if (error) {
    list.innerHTML = `<div class='col-12'><div class='alert alert-warning'>${error.message}</div></div>`;
    return;
  }
  list.innerHTML = data.map(card).join('') || "<div class='col-12'><p class='opacity-75'>ยังไม่มีสูตรในระบบ</p></div>";
}

async function loadCategoryChips() {
  const { data } = await db.from('recipes').select('category').not('category', 'is', null);
  const unique = ['ทั้งหมด', ...new Set((data || []).map((x) => x.category).filter(Boolean))];
  chips.innerHTML = unique.map((c, i) => `<button class='btn ${i === 0 ? 'btn-premium' : 'btn-outline-dark'} recipe-chip' data-category='${c}'>${c}</button>`).join('');
  chips.querySelectorAll('.recipe-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      chips.querySelectorAll('button').forEach((b) => b.className = 'btn btn-outline-dark recipe-chip');
      btn.className = 'btn btn-premium recipe-chip';
      loadRecipes(btn.dataset.category);
    });
  });
}

loadCategoryChips();
loadRecipes();
