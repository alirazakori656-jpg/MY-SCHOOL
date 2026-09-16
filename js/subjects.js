function form(s){s=s||{};return `<form id="frm" class="row g-2">
<input type="hidden" name="id" value="${s.id||''}">
<div class="col-md-6"><label class="form-label">Subject Name *</label><input class="form-control" name="name" value="${SMS.escape(s.name||'')}"></div>
<div class="col-md-6"><label class="form-label">Code</label><input class="form-control" name="code" value="${SMS.escape(s.code||'')}"></div>
<div class="col-md-6"><label class="form-label">Teacher</label><select class="form-select" name="teacherId">${teacherOptions(s.teacherId)}</select></div>
<div class="col-md-3"><label class="form-label">Max Marks</label><input type="number" class="form-control" name="maxMarks" value="${s.maxMarks||100}"></div>
<div class="col-md-3"><label class="form-label">Passing Marks</label><input type="number" class="form-control" name="passingMarks" value="${s.passingMarks||50}"></div>
</form>`;}
function openS(id){const s=id&&SMS.getData('subjects').find(x=>x.id===id);
  document.getElementById('modals').innerHTML=modalHtml('md',s?'Edit Subject':'Add Subject',form(s),'<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveS()">Save</button>');showModal('md');}
function saveS(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.name){toast('Name required','danger');return;} d.maxMarks=+d.maxMarks;d.passingMarks=+d.passingMarks;
  const list=SMS.getData('subjects');if(d.id)SMS.updateData('subjects',d.id,d);else{d.id=SMS.generateId('sub');list.push(d);SMS.saveData('subjects',list);}
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Saved');render();}
function render(){
  const list=SMS.getData('subjects');
  document.getElementById('list').innerHTML=list.length?`<table class="table"><thead><tr><th>Code</th><th>Name</th><th>Teacher</th><th>Max</th><th>Pass</th><th></th></tr></thead><tbody>${
    list.map(s=>`<tr><td>${SMS.escape(s.code)}</td><td>${SMS.escape(s.name)}</td><td>${teacherName(s.teacherId)}</td><td>${s.maxMarks}</td><td>${s.passingMarks}</td>
    <td><button class="btn btn-sm btn-outline-primary" onclick="openS('${s.id}')">Edit</button>
    <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete subject?',()=>{SMS.deleteData('subjects','${s.id}');render();})">Delete</button></td></tr>`).join('')}</tbody></table>`:emptyState('fa-book','No subjects','<button class="btn btn-primary btn-sm" onclick="openS()">Add Subject</button>');
}
document.addEventListener('DOMContentLoaded',()=>{if(!Auth.require('subjects'))return;document.getElementById('btnAdd').onclick=()=>openS();render();});
