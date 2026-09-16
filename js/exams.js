function render(){
  const tab=document.querySelector('.nav-tabs .active')?.dataset.tab||'types';
  const body=document.getElementById('tabBody');
  if(tab==='types'){
    const list=SMS.getData('examTypes');
    body.innerHTML=`<button class="btn btn-primary btn-sm mb-2" onclick="addType()">Add Type</button>
      <ul class="list-group">${list.map(t=>`<li class="list-group-item d-flex justify-content-between">${SMS.escape(t.name)}
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete type?',()=>{SMS.deleteData('examTypes','${t.id}');render();})">Delete</button></li>`).join('')}</ul>`;
  } else {
    const list=SMS.getData('exams');
    const types=SMS.getData('examTypes');
    body.innerHTML=`<button class="btn btn-primary btn-sm mb-2" onclick="openEx()">Add Schedule</button>
    <div class="table-responsive"><table class="table"><thead><tr><th>Exam</th><th>Class</th><th>Subject</th><th>Date</th><th>Time</th><th>Room</th><th></th></tr></thead><tbody>${
      list.map(e=>{const t=types.find(x=>x.id===e.typeId);return `<tr><td>${t?t.name:''}</td><td>${className(e.classId)}</td><td>${subjectName(e.subjectId)}</td><td>${e.date}</td><td>${e.startTime}-${e.endTime}</td><td>${e.room}</td>
      <td><button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete exam?',()=>{SMS.deleteData('exams','${e.id}');render();})">Delete</button></td></tr>`;}).join('')}</tbody></table></div>`;
  }
}
function addType(){const name=prompt('Exam type name');if(!name)return;const list=SMS.getData('examTypes');list.push({id:SMS.generateId('et'),name});SMS.saveData('examTypes',list);toast('Added');render();}
function openEx(){
  const types=SMS.getData('examTypes');
  document.getElementById('modals').innerHTML=modalHtml('md','Exam Schedule',`<form id="frm" class="row g-2">
    <div class="col-md-6"><label class="form-label">Type</label><select class="form-select" name="typeId">${types.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
    <div class="col-md-6"><label class="form-label">Class</label><select class="form-select" name="classId">${classOptions()}</select></div>
    <div class="col-md-6"><label class="form-label">Subject</label><select class="form-select" name="subjectId">${subjectOptions()}</select></div>
    <div class="col-md-6"><label class="form-label">Date</label><input type="date" class="form-control" name="date" required></div>
    <div class="col-md-4"><label class="form-label">Start</label><input type="time" class="form-control" name="startTime" value="09:00"></div>
    <div class="col-md-4"><label class="form-label">End</label><input type="time" class="form-control" name="endTime" value="11:00"></div>
    <div class="col-md-4"><label class="form-label">Room</label><input class="form-control" name="room" value="Hall A"></div>
  </form>`,`<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveEx()">Save</button>`);showModal('md');
}
function saveEx(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.date){toast('Date required','danger');return;}d.id=SMS.generateId('ex');
  const list=SMS.getData('exams');list.push(d);SMS.saveData('exams',list);
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Scheduled');render();}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('exams'))return;
  document.querySelectorAll('.nav-tabs a').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('.nav-tabs a').forEach(x=>x.classList.remove('active'));a.classList.add('active');render();});
  if(qs('tab')==='schedule')document.querySelector('[data-tab=schedule]').click();
  render();
});
