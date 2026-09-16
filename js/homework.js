function form(h){h=h||{};return `<form id="frm" class="row g-2">
<input type="hidden" name="id" value="${h.id||''}">
<div class="col-md-6"><label class="form-label">Title *</label><input class="form-control" name="title" value="${SMS.escape(h.title||'')}"></div>
<div class="col-md-6"><label class="form-label">Subject</label><select class="form-select" name="subjectId">${subjectOptions(h.subjectId)}</select></div>
<div class="col-md-4"><label class="form-label">Class</label><select class="form-select" name="classId">${classOptions(h.classId)}</select></div>
<div class="col-md-2"><label class="form-label">Section</label><select class="form-select" name="section"><option>A</option><option>B</option><option>C</option></select></div>
<div class="col-md-6"><label class="form-label">Teacher</label><select class="form-select" name="teacherId">${teacherOptions(h.teacherId)}</select></div>
<div class="col-md-6"><label class="form-label">Assigned</label><input type="date" class="form-control" name="assignedDate" value="${h.assignedDate||new Date().toISOString().slice(0,10)}"></div>
<div class="col-md-6"><label class="form-label">Due</label><input type="date" class="form-control" name="dueDate" value="${h.dueDate||''}"></div>
<div class="col-12"><label class="form-label">Description</label><textarea class="form-control" name="description" rows="3">${SMS.escape(h.description||'')}</textarea></div>
</form>`;}
function openH(id){const h=id&&SMS.getData('homework').find(x=>x.id===id);
  document.getElementById('modals').innerHTML=modalHtml('md',h?'Edit Homework':'Add Homework',form(h),'<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveH()">Save</button>');
  if(h)document.querySelector('[name=section]').value=h.section;showModal('md');}
function saveH(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.title){toast('Title required','danger');return;}d.status='Assigned';
  const list=SMS.getData('homework');if(d.id)SMS.updateData('homework',d.id,d);else{d.id=SMS.generateId('hw');list.push(d);SMS.saveData('homework',list);}
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Homework saved');render();}
function render(){
  const list=SMS.getData('homework');
  document.getElementById('list').innerHTML=list.length?`<table class="table"><thead><tr><th>Title</th><th>Subject</th><th>Class</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>${
    list.map(h=>`<tr><td>${SMS.escape(h.title)}<br><small>${SMS.escape(h.description||'')}</small></td><td>${subjectName(h.subjectId)}</td><td>${className(h.classId)}-${h.section}</td><td>${h.dueDate}</td><td>${statusBadge(h.status)}</td>
    <td><button class="btn btn-sm btn-outline-primary" onclick="openH('${h.id}')">Edit</button>
    <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete homework?',()=>{SMS.deleteData('homework','${h.id}');render();})">Delete</button></td></tr>`).join('')}</tbody></table>`:emptyState('fa-book-open','No homework','<button class="btn btn-primary btn-sm" onclick="openH()">Add Homework</button>');
}
document.addEventListener('DOMContentLoaded',()=>{if(!Auth.require('homework'))return;document.getElementById('btnAdd').onclick=()=>openH();if(qs('action')==='add')openH();render();});
