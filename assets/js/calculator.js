const fields=[['mpg','ราคามัทฉะต่อกรัม'],['grams','จำนวนกรัมที่ใช้'],['milk','ค่านม'],['cup','ค่าแก้ว'],['topping','ค่าท็อปปิ้ง'],['labor','ค่าแรง'],['price','ราคาขาย']];
const root=document.getElementById('calcInputs');
const calcMsg=document.getElementById('calcMsg');
let current={cost:0,profit:0,percent:0};
fields.forEach(([id,label])=>{root.innerHTML+=`<div class='col-6 col-md-4'><label class='form-label small'>${label}</label><input type='number' min='0' step='0.01' id='${id}' class='form-control calc-field' value='0'></div>`});
function calc(){const val=id=>parseFloat(document.getElementById(id).value)||0;const cost=val('mpg')*val('grams')+val('milk')+val('cup')+val('topping')+val('labor');const profit=val('price')-cost;const percent=cost?profit/cost*100:0;current={cost,profit,percent,selling_price:val('price')};totalCost.textContent=`฿${cost.toFixed(2)}`;profitCup.textContent=`฿${profit.toFixed(2)}`;profitPercent.textContent=`${percent.toFixed(1)}%`;}
document.querySelectorAll('.calc-field').forEach(x=>x.addEventListener('input',calc));
document.getElementById('resetCalc').addEventListener('click',()=>{document.querySelectorAll('.calc-field').forEach(x=>x.value=0);calc();calcMsg.textContent='รีเซ็ตค่าเรียบร้อย';});
document.getElementById('saveCalc').addEventListener('click', async ()=>{
  if (!window.db) { calcMsg.textContent='ยังไม่ได้ตั้งค่า Supabase'; return; }
  const payload={
    matcha_price_per_gram:Number(mpg.value||0), grams_used:Number(grams.value||0), milk_cost:Number(milk.value||0), cup_cost:Number(cup.value||0), topping_cost:Number(topping.value||0), labor_cost:Number(labor.value||0), total_cost:current.cost, selling_price:current.selling_price, profit:current.profit, profit_percent:current.percent
  };
  const {error}=await db.from('cost_calculations').insert(payload);
  calcMsg.textContent=error?`บันทึกไม่สำเร็จ: ${error.message}`:'บันทึกต้นทุนลง Supabase สำเร็จแล้ว ✨';
});
calc();
