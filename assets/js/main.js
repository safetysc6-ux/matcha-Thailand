AOS.init({ duration: 800, once: true, offset: 60 });

const fallbackProducts = [
  { name: 'Ceremonial Matcha 30g', price: 790, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=700&auto=format&fit=crop' },
  { name: 'Bamboo Whisk Set', price: 490, img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=700&auto=format&fit=crop' },
  { name: 'Premium Oat Milk', price: 155, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=700&auto=format&fit=crop' }
];

const featuredProductsEl = document.getElementById('featuredProducts');
const featuredRecipesEl = document.getElementById('featuredRecipes');

const formatMoney = (value) => `฿${Number(value || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function renderProducts(products) {
  if (!featuredProductsEl) return;
  featuredProductsEl.innerHTML = products.map((x) => `
    <div class='col-md-4' data-aos='fade-up'>
      <div class='premium-card p-3 h-100'>
        <img src='${x.img}' class='img-fluid rounded-4 mb-3' alt='${x.name}'>
        <h6>${x.name}</h6>
        <p class='mb-0 text-success fw-bold'>${formatMoney(x.price)}</p>
      </div>
    </div>`).join('');
}

function renderRecipes(recipes) {
  if (!featuredRecipesEl) return;
  featuredRecipesEl.innerHTML = recipes.map((x) => `
    <div class='col-md-4' data-aos='fade-up'>
      <div class='premium-card p-4 h-100'>
        <h6>${x.title}</h6>
        <p class='mb-0'>${x.description || ''}</p>
      </div>
    </div>`).join('');
}

async function loadFeaturedProducts() {
  if (!window.db) { renderProducts(fallbackProducts); return; }
  try {
    const { data, error } = await db.from('products').select('*').order('created_at', { ascending: false }).limit(6);
    if (error) throw error;
    renderProducts((data && data.length ? data : fallbackProducts).map((x) => ({ name: x.name, img: x.image_url, price: x.price })));
  } catch (_) {
    renderProducts(fallbackProducts);
  }
}

async function loadFeaturedRecipes() {
  if (!window.db) { featuredRecipesEl.innerHTML = "<div class='col-12'><p class='opacity-75 mb-0'>ยังไม่มีบทความสูตรแนะนำ</p></div>"; return; }
  const { data, error } = await db.from('recipes').select('id,title,description').eq('featured', true).order('created_at', { ascending: false }).limit(6);
  if (error || !data?.length) {
    featuredRecipesEl.innerHTML = "<div class='col-12'><p class='opacity-75 mb-0'>ยังไม่มีบทความสูตรแนะนำ</p></div>";
    return;
  }
  renderRecipes(data);
}

loadFeaturedProducts();
loadFeaturedRecipes();
