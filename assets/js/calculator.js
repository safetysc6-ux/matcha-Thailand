const fields=[['mpg','ราคามัทฉะต่อกรัม'],['grams','จำนวนกรัมที่ใช้'],['milk','ค่านม'],['cup','ค่าแก้ว'],['topping','ค่าท็อปปิ้ง'],['labor','ค่าแรง'],['price','ราคาขาย']];
const root=document.getElementById('calcInputs');
fields.forEach(([id,label])=>{root.innerHTML+=`<div class='col-6'><label class='form-label small'>${label}</label><input type='number' min='0' step='0.01' id='${id}' class='form-control form-control-lg calc-field' value='0'></div>`});
function calc(){const val=id=>parseFloat(document.getElementById(id).value)||0;const cost=val('mpg')*val('grams')+val('milk')+val('cup')+val('topping')+val('labor');const profit=val('price')-cost;const percent=cost?profit/cost*100:0;totalCost.textContent=`฿${cost.toFixed(2)}`;profitCup.textContent=`฿${profit.toFixed(2)}`;profitPercent.textContent=`${percent.toFixed(1)}%`;}
document.querySelectorAll('.calc-field').forEach(x=>x.addEventListener('input',calc));calc();
