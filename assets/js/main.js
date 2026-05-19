AOS.init({duration:800,once:true,offset:60});
const sampleProducts=[
  {name:'Ceremonial Matcha 30g',price:'฿790',img:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=700&auto=format&fit=crop'},
  {name:'Bamboo Whisk Set',price:'฿490',img:'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=700&auto=format&fit=crop'},
  {name:'Premium Oat Milk',price:'฿155',img:'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=700&auto=format&fit=crop'}
];
const sampleRecipes=[
  {name:'Iced Matcha Latte',desc:'นุ่ม ละมุน สูตรขายดีสำหรับคาเฟ่'},
  {name:'Matcha Yuzu Sparkling',desc:'สดชื่นแบบญี่ปุ่นร่วมสมัย'},
  {name:'Hojicha-Matcha Fusion',desc:'บาลานซ์ความเข้มและกลิ่นคั่ว'}
];

const formatMoney = (v) => `฿${Number(v || 0).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

async function getProducts(){
  const { data, error } = await db.from('products').select('*').order('created_at', { ascending: false }).limit(6);
  if (error || !data?.length) return sampleProducts;
  return data.map((p) => ({ name: p.name, price: formatMoney(p.price), img: p.image_url || sampleProducts[0].img }));
}

async function renderFeatured(){
  const p=document.getElementById('featuredProducts'); const r=document.getElementById('featuredRecipes');
  const products = await getProducts();
  if(p){p.innerHTML=products.map(x=>`<div class='col-md-4' data-aos='fade-up'><div class='premium-card p-3 h-100'><img src='${x.img}' class='img-fluid rounded-4 mb-3'><h6>${x.name}</h6><p class='mb-0 text-success fw-bold'>${x.price}</p></div></div>`).join('')}
  if(r){r.innerHTML=sampleRecipes.map(x=>`<div class='col-md-4' data-aos='fade-up'><div class='premium-card p-4 h-100'><h6>${x.name}</h6><p class='mb-0'>${x.desc}</p></div></div>`).join('')}
}
renderFeatured();
