function structureTotal(fs){
  return Number(fs.admissionFee||0)+Number(fs.tuitionFee||0)+Number(fs.examFee||0)+Number(fs.computerFee||0)+Number(fs.transportFee||0)+Number(fs.otherFee||0)-Number(fs.discount||0);
}
function renderReceipts(){
  const pays=SMS.getData('feePayments');
  const school=settingsObj()||{};
  const id=qs('id');
  const list=id?pays.filter(p=>p.id===id):pays;
  document.getElementById('receipts').innerHTML=list.map(p=>{
    const s=studentById(p.studentId)||{};
    return `<article class="card-soft p-4 mb-3" id="rc-${p.id}">
      <div class="text-center mb-3">
        <strong>${SMS.escape(school.schoolName)}</strong><br><small>${SMS.escape(school.address)}</small>
        <h2 class="h5 mt-2">FEE RECEIPT</h2>
      </div>
      <div class="row"><div class="col-md-6">Receipt: ${SMS.escape(p.invoiceNo)}<br>Date: ${SMS.escape(p.paymentDate)}</div>
      <div class="col-md-6">Student: ${SMS.escape(s.name)}<br>Admission: ${SMS.escape(s.admissionNo)} • ${SMS.escape(s.className)}</div></div>
      <table class="table mt-3"><tr><td>Month</td><td>${SMS.escape(p.month)}</td></tr>
      <tr><td>Fee type</td><td>${SMS.escape(p.feeType)}</td></tr>
      <tr><td>Amount</td><td>${p.amount}</td></tr>
      <tr><td>Discount</td><td>${p.discount}</td></tr>
      <tr><td>Paid</td><td>${p.paidAmount}</td></tr>
      <tr><td>Remaining</td><td>${p.remaining}</td></tr>
      <tr><td>Method</td><td>${SMS.escape(p.method)}</td></tr></table>
      <p class="mt-4">Accountant ________________</p>
      <p class="small text-muted">DEMO RECEIPT — no banking credentials stored.</p>
    </article>`;
  }).join('')||emptyState('fa-receipt','No receipts');
}
function render(){
  if(location.pathname.endsWith('fee-receipt.html')){renderReceipts();return;}
  const tab=document.querySelector('.nav-tabs .active')?.dataset.tab||'structure';
  const body=document.getElementById('tabBody');
  if(tab==='structure'){
    const list=SMS.getData('feeStructure');
    body.innerHTML=`<div class="table-responsive"><table class="table"><thead><tr><th>Class</th><th>Admission</th><th>Tuition</th><th>Exam</th><th>Computer</th><th>Transport</th><th>Other</th><th>Discount</th><th></th></tr></thead><tbody>${
      list.map(f=>`<tr>
        <td>${className(f.classId)}</td>
        ${['admissionFee','tuitionFee','examFee','computerFee','transportFee','otherFee','discount'].map(k=>`<td><input class="form-control form-control-sm" style="width:90px" data-id="${f.id}" data-k="${k}" value="${f[k]}"></td>`).join('')}
        <td><button class="btn btn-sm btn-primary" onclick="saveFs('${f.id}')">Save</button></td></tr>`).join('')}</tbody></table></div>`;
  } else if(tab==='collect'){
    body.innerHTML=`<form id="payForm" class="row g-2">
      <div class="col-md-6"><label class="form-label">Student</label><select class="form-select" name="studentId">${studentOptions()}</select></div>
      <div class="col-md-3"><label class="form-label">Month</label><input class="form-control" name="month" value="September 2026"></div>
      <div class="col-md-3"><label class="form-label">Fee Type</label><input class="form-control" name="feeType" value="Tuition"></div>
      <div class="col-md-3"><label class="form-label">Amount</label><input type="number" class="form-control" name="amount" required></div>
      <div class="col-md-3"><label class="form-label">Discount</label><input type="number" class="form-control" name="discount" value="0"></div>
      <div class="col-md-3"><label class="form-label">Paid Amount</label><input type="number" class="form-control" name="paidAmount" required></div>
      <div class="col-md-3"><label class="form-label">Method</label><select class="form-select" name="method"><option>Cash</option><option>Bank Transfer</option><option>Online</option></select></div>
      <div class="col-md-4"><label class="form-label">Payment Date</label><input type="date" class="form-control" name="paymentDate" value="${new Date().toISOString().slice(0,10)}"></div>
      <div class="col-12"><button class="btn btn-primary" type="submit">Collect Fee</button></div>
    </form><p class="small text-muted mt-2">Never enter card numbers or CVV. Demo payments only.</p>`;
    document.getElementById('payForm').onsubmit=e=>{
      e.preventDefault();
      const d=Object.fromEntries(new FormData(e.target).entries());
      d.amount=+d.amount;d.discount=+d.discount;d.paidAmount=+d.paidAmount;
      d.remaining=Math.max(0,d.amount-d.discount-d.paidAmount);
      d.id=SMS.generateId('pay');d.invoiceNo='INV-'+Date.now().toString().slice(-8);
      const list=SMS.getData('feePayments');list.push(d);SMS.saveData('feePayments',list);
      toast('Payment recorded');
      location.href='fee-receipt.html?id='+d.id;
    };
  } else if(tab==='history'){
    const list=SMS.getData('feePayments');
    body.innerHTML=`<button class="btn btn-sm btn-outline-secondary mb-2" onclick="exportCSV('payments.csv',SMS.getData('feePayments'))">Export CSV</button>
    <table class="table"><thead><tr><th>Invoice</th><th>Student</th><th>Month</th><th>Paid</th><th>Remaining</th><th>Method</th><th></th></tr></thead><tbody>${
      list.map(p=>{const s=studentById(p.studentId);return `<tr><td>${p.invoiceNo}</td><td>${s?s.name:''}</td><td>${p.month}</td><td>${p.paidAmount}</td><td>${p.remaining}</td><td>${p.method}</td>
      <td><a href="fee-receipt.html?id=${p.id}">Receipt</a></td></tr>`;}).join('')}</tbody></table>`;
  } else {
    const pays=SMS.getData('feePayments');
    const pending=pays.filter(p=>p.remaining>0);
    const collected=pays.reduce((s,p)=>s+Number(p.paidAmount),0);
    const pend=pays.reduce((s,p)=>s+Number(p.remaining),0);
    const disc=pays.reduce((s,p)=>s+Number(p.discount||0),0);
    body.innerHTML=`<div class="row g-3 mb-3">
      <div class="col-md-4"><div class="stat-card"><p>Total collected</p><h3>PKR ${collected.toLocaleString()}</h3></div></div>
      <div class="col-md-4"><div class="stat-card"><p>Total pending</p><h3>PKR ${pend.toLocaleString()}</h3></div></div>
      <div class="col-md-4"><div class="stat-card"><p>Total discounts</p><h3>PKR ${disc.toLocaleString()}</h3></div></div>
    </div>
    <table class="table"><thead><tr><th>Student</th><th>Class</th><th>Month</th><th>Total</th><th>Paid</th><th>Pending</th></tr></thead><tbody>${
      pending.map(p=>{const s=studentById(p.studentId)||{};return `<tr><td>${SMS.escape(s.name)}</td><td>${SMS.escape(s.className)}</td><td>${p.month}</td><td>${p.amount}</td><td>${p.paidAmount}</td><td>${p.remaining}</td></tr>`;}).join('')||'<tr><td colspan="6">No pending fees</td></tr>'}</tbody></table>`;
  }
}
function saveFs(id){
  const patch={};
  document.querySelectorAll('[data-id="'+id+'"]').forEach(i=>patch[i.dataset.k]=+i.value||0);
  SMS.updateData('feeStructure',id,patch);toast('Fee structure saved');
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('fees'))return;
  if(location.pathname.endsWith('fee-receipt.html')){render();return;}
  document.querySelectorAll('.nav-tabs a').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('.nav-tabs a').forEach(x=>x.classList.remove('active'));a.classList.add('active');render();});
  const tab=qs('tab'); if(tab){const el=document.querySelector('[data-tab="'+tab+'"]');if(el)el.click();}
  render();
});
