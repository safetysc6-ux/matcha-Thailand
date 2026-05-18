AOS.init({ duration: 700, once: true, offset: 30 });

const formatMoney = (v) => `฿${Number(v || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const params = new URLSearchParams(location.search);
const id = params.get('id');
const wrap = document.getElementById('recipeDetail');

(async () => {
  if (!id) {
    wrap.innerHTML = "<div class='alert alert-warning'>ไม่พบรหัสสูตร</div>";
    return;
  }
  const { data, error } = await db.from('recipes').select('*').eq('id', id).single();
  if (error || !data) {
    wrap.innerHTML = "<div class='alert alert-warning'>ไม่พบข้อมูลสูตร</div>";
    return;
  }
  wrap.innerHTML = `
    <article class='detail-shell' data-aos='fade-up'>
      <img class='detail-hero' src='${data.image_url || ''}' alt='${data.title}'>
      <div class='detail-content'>
        <p class='recipe-category mb-2'>${data.category || 'Signature Recipe'}</p>
        <h1 class='detail-title'>${data.title}</h1>
        <p class='detail-description'>${data.description || ''}</p>
        <div class='detail-stats'>
          <div><span>ต้นทุน</span><strong>${formatMoney(data.matcha_cost)}</strong></div>
          <div><span>ราคาขาย</span><strong>${formatMoney(data.selling_price)}</strong></div>
          <div><span>กำไรต่อแก้ว</span><strong>${formatMoney(data.profit)}</strong></div>
        </div>
        <section><h5>ส่วนผสม</h5><p class='detail-block'>${(data.ingredients || '').replace(/\n/g, '<br>')}</p></section>
        <section><h5>วิธีชง</h5><p class='detail-block'>${(data.brewing_steps || '').replace(/\n/g, '<br>')}</p></section>
      </div>
    </article>`;
})();
