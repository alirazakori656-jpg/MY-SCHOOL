const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function render(){
  const cid=document.getElementById('ttClass').value;
  const sec=document.getElementById('ttSec').value;
  const slots=SMS.getData('timetable').filter(t=>t.classId===cid&&t.section===sec);
  const periods=[...new Set(slots.map(s=>s.period))].sort((a,b)=>a-b);
  if(qs('tab')==='teacher'){
    const tid=SMS.getData('teachers')[0]?.id;
    const mine=SMS.getData('timetable').filter(t=>t.teacherId===tid);
    document.getElementById('grid').innerHTML=`<h2 class="h6">Teacher timetable (first teacher sample)</h2>
      <table class="table"><thead><tr><th>Day</th><th>Period</th><th>Time</th><th>Class</th><th>Subject</th><th>Room</th></tr></thead><tbody>${
        mine.map(t=>`<tr><td>${t.day}</td><td>${t.period}</td><td>${t.startTime}-${t.endTime}</td><td>${className(t.classId)}-${t.section}</td><td>${subjectName(t.subjectId)}</td><td>${t.room}</td></tr>`).join('')}</tbody></table>`;
    return;
  }
  if(!slots.length){document.getElementById('grid').innerHTML=emptyState('fa-calendar','No timetable for this class','<button class="btn btn-primary btn-sm" onclick="openSlot()">Add Slot</button>');return;}
  let html='<table class="table table-bordered"><thead><tr><th>Period</th>'+DAYS.map(d=>'<th>'+d+'</th>').join('')+'</tr></thead><tbody>';
  periods.forEach(p=>{
    html+='<tr><th>'+p+'</th>';
    DAYS.forEach(d=>{
      const sl=slots.find(s=>s.day===d&&s.period===p);
      html+=sl?`<td><strong>${subjectName(sl.subjectId)}</strong><br><small>${teacherName(sl.teacherId)} • ${sl.room}<br>${sl.startTime}-${sl.endTime}</small></td>`:'<td class="text-muted">—</td>';
    });
    html+='</tr>';
  });
  html+='</tbody></table>';
  document.getElementById('grid').innerHTML=html;
}
function openSlot(){
  document.getElementById('modals').innerHTML=modalHtml('md','Add Slot',`<form id="frm" class="row g-2">
    <div class="col-md-6"><label class="form-label">Day</label><select class="form-select" name="day">${DAYS.map(d=>'<option>'+d+'</option>').join('')}</select></div>
    <div class="col-md-3"><label class="form-label">Period</label><input type="number" class="form-control" name="period" value="1"></div>
    <div class="col-md-3"><label class="form-label">Room</label><input class="form-control" name="room" value="R-101"></div>
    <div class="col-md-6"><label class="form-label">Start</label><input type="time" class="form-control" name="startTime" value="08:00"></div>
    <div class="col-md-6"><label class="form-label">End</label><input type="time" class="form-control" name="endTime" value="08:45"></div>
    <div class="col-md-6"><label class="form-label">Subject</label><select class="form-select" name="subjectId">${subjectOptions()}</select></div>
    <div class="col-md-6"><label class="form-label">Teacher</label><select class="form-select" name="teacherId">${teacherOptions()}</select></div>
  </form>`,`<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveSlot()">Save</button>`);
  showModal('md');
}
function saveSlot(){
  const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  d.id=SMS.generateId('tt');d.classId=document.getElementById('ttClass').value;d.section=document.getElementById('ttSec').value;d.period=+d.period;
  const list=SMS.getData('timetable');list.push(d);SMS.saveData('timetable',list);
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Slot added');render();
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('timetable'))return;
  document.getElementById('ttClass').innerHTML=classOptions('c5');
  document.getElementById('ttClass').onchange=render;
  document.getElementById('ttSec').onchange=render;
  document.getElementById('btnAdd').onclick=openSlot;
  render();
});
