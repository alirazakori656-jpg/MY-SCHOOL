function render(){
  const tab=document.querySelector('.nav-tabs .active')?.dataset.tab||'classes';
  const body=document.getElementById('tabBody');
  if(tab==='classes'){
    const list=SMS.getData('classes');
    body.innerHTML=`<button class="btn btn-primary btn-sm mb-2" onclick="addClass()">Add Class</button>
    <table class="table"><thead><tr><th>Name</th><th>Level</th><th></th></tr></thead><tbody>${
      list.map(c=>`<tr><td>${SMS.escape(c.name)}</td><td>${c.level||''}</td>
      <td><button class="btn btn-sm btn-outline-primary" onclick="editClass('${c.id}')">Edit</button>
      <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete class?',()=>{SMS.deleteData('classes','${c.id}');render();})">Delete</button></td></tr>`).join('')}</tbody></table>`;
  } else if(tab==='sections'){
    const secs=SMS.getData('sections');
    body.innerHTML=`<button class="btn btn-primary btn-sm mb-2" onclick="addSec()">Add Section</button>
    <table class="table"><thead><tr><th>Class</th><th>Section</th><th>Class Teacher</th></tr></thead><tbody>${
      secs.map(s=>`<tr><td>${className(s.classId)}</td><td>${s.name}</td><td>${teacherName(s.classTeacherId)||'—'}</td></tr>`).join('')}</tbody></table>`;
  } else {
    const secs=SMS.getData('sections');
    body.innerHTML=`<table class="table"><thead><tr><th>Class</th><th>Section</th><th>Assign Teacher</th></tr></thead><tbody>${
      secs.map(s=>`<tr><td>${className(s.classId)}</td><td>${s.name}</td><td>
        <select class="form-select form-select-sm" onchange="SMS.updateData('sections','${s.id}',{classTeacherId:this.value});toast('Assigned')">
          <option value="">—</option>${teacherOptions(s.classTeacherId)}</select></td></tr>`).join('')}</tbody></table>`;
  }
}
function addClass(){
  const name=prompt('Class name (e.g. Grade 7)'); if(!name)return;
  const list=SMS.getData('classes'); list.push({id:SMS.generateId('c'),name,level:list.length+1}); SMS.saveData('classes',list); toast('Class added'); render();
}
function editClass(id){
  const c=SMS.getData('classes').find(x=>x.id===id); const name=prompt('Class name',c.name); if(!name)return;
  SMS.updateData('classes',id,{name}); toast('Updated'); render();
}
function addSec(){
  const classes=SMS.getData('classes');
  const cid=classes[0]?.id; const name=prompt('Section letter (e.g. D)'); if(!name)return;
  const list=SMS.getData('sections'); list.push({id:SMS.generateId('sec'),classId:cid,name,classTeacherId:null}); SMS.saveData('sections',list); toast('Section added'); render();
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('classes'))return;
  document.querySelectorAll('.nav-tabs a').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('.nav-tabs a').forEach(x=>x.classList.remove('active'));a.classList.add('active');render();});
  if(qs('tab')){const t=document.querySelector('[data-tab="'+qs('tab')+'"]');if(t)t.click();}
  render();
});
