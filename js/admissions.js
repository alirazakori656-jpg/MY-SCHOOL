function form(a){a=a||{};return `<form id="frm" class="row g-2">
<input type="hidden" name="id" value="${a.id||''}">
<div class="col-md-6"><label class="form-label">Student Name *</label><input class="form-control" name="name" value="${SMS.escape(a.name||'')}"></div>
<div class="col-md-6"><label class="form-label">Father / Guardian</label><input class="form-control" name="fatherName" value="${SMS.escape(a.fatherName||'')}"></div>
<div class="col-md-6"><label class="form-label">Mother Name</label><input class="form-control" name="motherName" value="${SMS.escape(a.motherName||'')}"></div>
<div class="col-md-3"><label class="form-label">DOB</label><input type="date" class="form-control" name="dob" value="${a.dob||''}"></div>
<div class="col-md-3"><label class="form-label">Gender</label><select class="form-select" name="gender"><option>Male</option><option>Female</option></select></div>
<div class="col-md-6"><label class="form-label">Applying Class</label><input class="form-control" name="applyingClass" value="${SMS.escape(a.applyingClass||'Grade 1')}"></div>
<div class="col-md-6"><label class="form-label">Previous School</label><input class="form-control" name="previousSchool" value="${SMS.escape(a.previousSchool||'')}"></div>
<div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" name="phone" value="${SMS.escape(a.phone||'')}"></div>
<div class="col-md-6"><label class="form-label">Email</label><input class="form-control" name="email" value="${SMS.escape(a.email||'')}"></div>
<div class="col-12"><label class="form-label">Address</label><input class="form-control" name="address" value="${SMS.escape(a.address||'')}"></div>
<div class="col-12"><label class="form-label">Documents</label><input class="form-control" name="documents" value="${SMS.escape(a.documents||'')}"></div>
</form>`;}
function openA(id){const a=id&&SMS.getData('admissions').find(x=>x.id===id);
  document.getElementById('modals').innerHTML=modalHtml('md',a?'Edit Application':'New Application',form(a),'<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveA()">Save</button>');showModal('md');}
function saveA(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.name){toast('Name required','danger');return;}
  const list=SMS.getData('admissions');
  if(d.id)SMS.updateData('admissions',d.id,d);
  else{d.id=SMS.generateId('adm');d.applicationNo='APP-'+Date.now().toString().slice(-6);d.applicationDate=new Date().toISOString().slice(0,10);d.status='Pending';list.push(d);SMS.saveData('admissions',list);}
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Saved');render();}
function setSt(id,st){SMS.updateData('admissions',id,{status:st});toast('Status: '+st);render();}
function render(){
  const st=qs('status');
  let list=SMS.getData('admissions');
  if(st)list=list.filter(a=>a.status===st);
  document.getElementById('list').innerHTML=list.length?`<table class="table"><thead><tr><th>App No</th><th>Name</th><th>Class</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>${
    list.map(a=>`<tr><td>${a.applicationNo}</td><td>${SMS.escape(a.name)}<br><small>${SMS.escape(a.fatherName)}</small></td><td>${SMS.escape(a.applyingClass)}</td><td>${a.applicationDate}</td><td>${statusBadge(a.status)}</td>
    <td class="text-nowrap"><button class="btn btn-sm btn-success" onclick="setSt('${a.id}','Approved')">Approve</button>
    <button class="btn btn-sm btn-outline-danger" onclick="setSt('${a.id}','Rejected')">Reject</button>
    <button class="btn btn-sm btn-outline-primary" onclick="openA('${a.id}')">Edit</button></td></tr>`).join('')}</tbody></table>`:emptyState('fa-file','No applications','<button class="btn btn-primary btn-sm" onclick="openA()">New Application</button>');
}
document.addEventListener('DOMContentLoaded',()=>{if(!Auth.require('admissions'))return;document.getElementById('btnAdd').onclick=()=>openA();render();});
