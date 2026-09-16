function tForm(t){t=t||{};return `<form id="frm" class="row g-2">
<input type="hidden" name="id" value="${t.id||''}">
<div class="col-md-6"><label class="form-label">Name *</label><input class="form-control" name="name" required value="${SMS.escape(t.name||'')}"></div>
<div class="col-md-6"><label class="form-label">Father's Name</label><input class="form-control" name="fatherName" value="${SMS.escape(t.fatherName||'')}"></div>
<div class="col-md-4"><label class="form-label">Gender</label><select class="form-select" name="gender"><option>Female</option><option>Male</option></select></div>
<div class="col-md-4"><label class="form-label">DOB</label><input type="date" class="form-control" name="dob" value="${t.dob||''}"></div>
<div class="col-md-4"><label class="form-label">Employee ID</label><input class="form-control" name="employeeId" value="${SMS.escape(t.employeeId||'')}"></div>
<div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" name="phone" value="${SMS.escape(t.phone||'')}"></div>
<div class="col-md-6"><label class="form-label">Email</label><input class="form-control" name="email" value="${SMS.escape(t.email||'')}"></div>
<div class="col-12"><label class="form-label">Address</label><input class="form-control" name="address" value="${SMS.escape(t.address||'')}"></div>
<div class="col-md-6"><label class="form-label">Qualification</label><input class="form-control" name="qualification" value="${SMS.escape(t.qualification||'')}"></div>
<div class="col-md-6"><label class="form-label">Experience</label><input class="form-control" name="experience" value="${SMS.escape(t.experience||'')}"></div>
<div class="col-md-4"><label class="form-label">Joining Date</label><input type="date" class="form-control" name="joiningDate" value="${t.joiningDate||''}"></div>
<div class="col-md-4"><label class="form-label">Designation</label><input class="form-control" name="designation" value="${SMS.escape(t.designation||'')}"></div>
<div class="col-md-4"><label class="form-label">Salary (PKR)</label><input type="number" class="form-control" name="salary" value="${t.salary||0}"></div>
<div class="col-md-6"><label class="form-label">Subjects (comma)</label><input class="form-control" name="subjectsText" value="${SMS.escape((t.subjects||[]).join?t.subjects.join(', '):t.subjects||'')}"></div>
<div class="col-md-6"><label class="form-label">Classes (comma)</label><input class="form-control" name="classesText" value="${SMS.escape((t.classes||[]).join?t.classes.join(', '):t.classes||'')}"></div>
<div class="col-md-4"><label class="form-label">Status</label><select class="form-select" name="status"><option>Active</option><option>Inactive</option></select></div>
</form>`;}
function openT(id){
  const t=id&&SMS.getData('teachers').find(x=>x.id===id);
  document.getElementById('modals').innerHTML=modalHtml('md',t?'Edit Teacher':'Add Teacher',tForm(t),'<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveT()">Save</button>');
  if(t){document.querySelector('[name=gender]').value=t.gender||'Female';document.querySelector('[name=status]').value=t.status||'Active';}
  showModal('md');
}
function saveT(){
  const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.name){toast('Name required','danger');return;}
  d.subjects=d.subjectsText.split(',').map(x=>x.trim()).filter(Boolean);
  d.classes=d.classesText.split(',').map(x=>x.trim()).filter(Boolean);
  delete d.subjectsText;delete d.classesText;
  const list=SMS.getData('teachers');
  if(d.id) SMS.updateData('teachers',d.id,d);
  else {d.id=SMS.generateId('t');list.push(d);SMS.saveData('teachers',list);}
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Teacher saved');render();
}
function render(){
  const q=(document.getElementById('q').value||'').toLowerCase();
  const list=SMS.getData('teachers').filter(t=>!q||(t.name+t.designation+t.employeeId).toLowerCase().includes(q));
  document.getElementById('list').innerHTML=list.length?`<table class="table"><thead><tr><th>ID</th><th>Name</th><th>Designation</th><th>Phone</th><th>Subjects</th><th>Status</th><th></th></tr></thead><tbody>${
    list.map(t=>`<tr><td>${SMS.escape(t.employeeId)}</td><td>${SMS.escape(t.name)}</td><td>${SMS.escape(t.designation)}</td><td>${SMS.escape(t.phone)}</td><td>${SMS.escape((t.subjects||[]).join(', '))}</td><td>${statusBadge(t.status)}</td>
    <td>${Auth.can('teachers','full')?`<button class="btn btn-sm btn-outline-primary" onclick="openT('${t.id}')">Edit</button>
    <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete teacher?',()=>{SMS.deleteData('teachers','${t.id}');toast('Deleted');render();})">Delete</button>`:''}</td></tr>`).join('')}</tbody></table>`:emptyState('fa-chalkboard-user','No teachers found','<button class="btn btn-primary btn-sm" onclick="openT()">+ Add Teacher</button>');
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('teachers'))return;
  document.getElementById('btnAdd').onclick=()=>openT();
  document.getElementById('q').oninput=render;
  if(qs('action')==='add')openT();
  render();
});
