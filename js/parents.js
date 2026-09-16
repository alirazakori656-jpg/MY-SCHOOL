function form(p){p=p||{};return `<form id="frm" class="row g-2">
<input type="hidden" name="id" value="${p.id||''}">
<div class="col-md-6"><label class="form-label">Father / Guardian *</label><input class="form-control" name="fatherName" required value="${SMS.escape(p.fatherName||'')}"></div>
<div class="col-md-6"><label class="form-label">Mother Name</label><input class="form-control" name="motherName" value="${SMS.escape(p.motherName||'')}"></div>
<div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" name="phone" value="${SMS.escape(p.phone||'')}"></div>
<div class="col-md-6"><label class="form-label">Email</label><input class="form-control" name="email" value="${SMS.escape(p.email||'')}"></div>
<div class="col-md-6"><label class="form-label">Occupation</label><input class="form-control" name="occupation" value="${SMS.escape(p.occupation||'')}"></div>
<div class="col-md-6"><label class="form-label">Address</label><input class="form-control" name="address" value="${SMS.escape(p.address||'')}"></div>
</form>`;}
function openP(id){const p=id&&SMS.getData('parents').find(x=>x.id===id);
  document.getElementById('modals').innerHTML=modalHtml('md',p?'Edit Parent':'Add Parent',form(p),'<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveP()">Save</button>');showModal('md');}
function saveP(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.fatherName){toast('Guardian name required','danger');return;}
  const list=SMS.getData('parents');if(d.id)SMS.updateData('parents',d.id,d);else{d.id=SMS.generateId('PAR');d.children=[];list.push(d);SMS.saveData('parents',list);}
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Saved');render();}
function render(){const q=(document.getElementById('q').value||'').toLowerCase();
  const list=SMS.getData('parents').filter(p=>!q||(p.fatherName+p.motherName+p.phone).toLowerCase().includes(q));
  document.getElementById('list').innerHTML=list.length?`<table class="table"><thead><tr><th>Father</th><th>Mother</th><th>Phone</th><th>Occupation</th><th>Children</th><th></th></tr></thead><tbody>${
    list.map(p=>{const kids=(p.children||[]).map(id=>{const s=studentById(id);return s?s.name:id;}).join(', ');
    return `<tr><td>${SMS.escape(p.fatherName)}</td><td>${SMS.escape(p.motherName)}</td><td>${SMS.escape(p.phone)}</td><td>${SMS.escape(p.occupation)}</td><td>${SMS.escape(kids)}</td>
    <td><button class="btn btn-sm btn-outline-primary" onclick="openP('${p.id}')">Edit</button>
    <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete parent?',()=>{SMS.deleteData('parents','${p.id}');render();})">Delete</button></td></tr>`;}).join('')}</tbody></table>`:emptyState('fa-people-roof','No parents found','<button class="btn btn-primary btn-sm" onclick="openP()">+ Add Parent</button>');}
document.addEventListener('DOMContentLoaded',()=>{if(!Auth.require('parents'))return;document.getElementById('btnAdd').onclick=()=>openP();document.getElementById('q').oninput=render;render();});
