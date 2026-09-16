function form(s){s=s||{};return `<form id="frm" class="row g-2">
<input type="hidden" name="id" value="${s.id||''}">
<div class="col-md-6"><label class="form-label">Name *</label><input class="form-control" name="name" required value="${SMS.escape(s.name||'')}"></div>
<div class="col-md-6"><label class="form-label">Position</label><select class="form-select" name="position">
${['Accountant','Clerk','Librarian','Receptionist','Security','Other'].map(p=>`<option ${s.position===p?'selected':''}>${p}</option>`).join('')}</select></div>
<div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" name="phone" value="${SMS.escape(s.phone||'')}"></div>
<div class="col-md-6"><label class="form-label">Email</label><input class="form-control" name="email" value="${SMS.escape(s.email||'')}"></div>
<div class="col-md-4"><label class="form-label">Joining Date</label><input type="date" class="form-control" name="joiningDate" value="${s.joiningDate||''}"></div>
<div class="col-md-4"><label class="form-label">Salary</label><input type="number" class="form-control" name="salary" value="${s.salary||0}"></div>
<div class="col-md-4"><label class="form-label">Status</label><select class="form-select" name="status"><option>Active</option><option>Inactive</option></select></div>
<div class="col-12"><label class="form-label">Documents</label><input class="form-control" name="documents" value="${SMS.escape(s.documents||'')}"></div>
</form>`;}
function openS(id){const s=id&&SMS.getData('staff').find(x=>x.id===id);
  document.getElementById('modals').innerHTML=modalHtml('md',s?'Edit Staff':'Add Staff',form(s),'<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveS()">Save</button>');
  if(s)document.querySelector('[name=status]').value=s.status;showModal('md');}
function saveS(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.name){toast('Name required','danger');return;}
  const list=SMS.getData('staff');if(d.id)SMS.updateData('staff',d.id,d);else{d.id=SMS.generateId('st');list.push(d);SMS.saveData('staff',list);}
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Saved');render();}
function render(){const q=(document.getElementById('q').value||'').toLowerCase();
  const list=SMS.getData('staff').filter(s=>!q||(s.name+s.position).toLowerCase().includes(q));
  document.getElementById('list').innerHTML=list.length?`<table class="table"><thead><tr><th>Name</th><th>Position</th><th>Phone</th><th>Joining</th><th>Salary</th><th>Status</th><th></th></tr></thead><tbody>${
    list.map(s=>`<tr><td>${SMS.escape(s.name)}</td><td>${SMS.escape(s.position)}</td><td>${SMS.escape(s.phone)}</td><td>${SMS.escape(s.joiningDate)}</td><td>${s.salary}</td><td>${statusBadge(s.status)}</td>
    <td>${Auth.can('staff','full')?`<button class="btn btn-sm btn-outline-primary" onclick="openS('${s.id}')">Edit</button>
    <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete staff?',()=>{SMS.deleteData('staff','${s.id}');render();toast('Deleted');})">Delete</button>`:''}</td></tr>`).join('')}</tbody></table>`:emptyState('fa-users','No staff found','<button class="btn btn-primary btn-sm" onclick="openS()">+ Add Staff</button>');}
document.addEventListener('DOMContentLoaded',()=>{if(!Auth.require('staff'))return;document.getElementById('btnAdd').onclick=()=>openS();document.getElementById('q').oninput=render;if(qs('action')==='add')openS();render();});
