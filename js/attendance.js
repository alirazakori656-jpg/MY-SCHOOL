const marks={};
function isTeacherMode(){return qs('type')==='teacher';}

function loadRoster(){
  const date=document.getElementById('attDate').value;
  const body=document.getElementById('attBody');
  if(qs('tab')==='reports'){
    const att=SMS.getData('attendance');
    const byStu={};
    att.forEach(a=>{byStu[a.studentId]=byStu[a.studentId]||{p:0,t:0};byStu[a.studentId].t++;if(a.status==='Present')byStu[a.studentId].p++;});
    body.innerHTML=`<h2 class="h6">Attendance reports</h2><table class="table"><thead><tr><th>Student</th><th>Present</th><th>Total</th><th>%</th></tr></thead><tbody>${
      SMS.getData('students').map(s=>{const x=byStu[s.id]||{p:0,t:0};const pct=x.t?Math.round(x.p/x.t*100):0;
        return `<tr><td>${SMS.escape(s.name)}</td><td>${x.p}</td><td>${x.t}</td><td><div class="progress"><div class="progress-bar" style="width:${pct}%">${pct}%</div></div></td></tr>`;}).join('')}</tbody></table>`;
    return;
  }
  if(isTeacherMode()){
    const existing=SMS.getData('teacherAttendance').filter(a=>a.date===date);
    SMS.getData('teachers').forEach(t=>{
      const e=existing.find(x=>x.teacherId===t.id);
      marks[t.id]=e?e.status:'Present';
    });
    body.innerHTML=`<table class="table"><thead><tr><th>Teacher</th><th>Status</th></tr></thead><tbody>${
      SMS.getData('teachers').map(t=>`<tr><td>${SMS.escape(t.name)}</td><td>
        ${['Present','Absent','Leave','Half Day'].map(st=>`<label class="me-2"><input type="radio" name="m-${t.id}" ${marks[t.id]===st?'checked':''} onchange="marks['${t.id}']='${st}'"> ${st}</label>`).join('')}
      </td></tr>`).join('')}</tbody></table>`;
    return;
  }
  const cid=document.getElementById('attClass').value;
  const sec=document.getElementById('attSec').value;
  const stu=SMS.getData('students').filter(s=>s.classId===cid&&s.section===sec);
  const existing=SMS.getData('attendance').filter(a=>a.date===date&&a.classId===cid&&a.section===sec);
  stu.forEach(s=>{const e=existing.find(x=>x.studentId===s.id);marks[s.id]=e?e.status:'Present';});
  if(!stu.length){body.innerHTML=emptyState('fa-clipboard-user','No students in this class/section');return;}
  body.innerHTML=`<table class="table"><thead><tr><th>Roll</th><th>Student</th><th>Mark</th></tr></thead><tbody>${
    stu.map(s=>`<tr><td>${SMS.escape(s.rollNo)}</td><td>${SMS.escape(s.name)}</td><td>
      ${['Present','Absent','Leave'].map(st=>`<label class="me-2"><input type="radio" name="m-${s.id}" ${marks[s.id]===st?'checked':''} onchange="marks['${s.id}']='${st}'"> ${st}</label>`).join('')}
    </td></tr>`).join('')}</tbody></table>`;
}

function saveAtt(){
  const date=document.getElementById('attDate').value;
  if(isTeacherMode()){
    let list=SMS.getData('teacherAttendance').filter(a=>a.date!==date);
    Object.keys(marks).forEach(id=>list.push({id:SMS.generateId('tatt'),teacherId:id,date,status:marks[id]}));
    SMS.saveData('teacherAttendance',list);toast('Teacher attendance saved');return;
  }
  const cid=document.getElementById('attClass').value;
  const sec=document.getElementById('attSec').value;
  let list=SMS.getData('attendance').filter(a=>!(a.date===date&&a.classId===cid&&a.section===sec));
  Object.keys(marks).forEach(id=>list.push({id:SMS.generateId('att'),studentId:id,date,classId:cid,section:sec,status:marks[id]}));
  SMS.saveData('attendance',list);toast('Attendance saved');
}

document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('attendance'))return;
  document.getElementById('attDate').value=new Date().toISOString().slice(0,10);
  document.getElementById('attClass').innerHTML=classOptions();
  if(isTeacherMode()){document.getElementById('clsWrap').classList.add('d-none');document.getElementById('secWrap').classList.add('d-none');}
  ['attDate','attClass','attSec'].forEach(id=>document.getElementById(id).onchange=loadRoster);
  document.getElementById('allP').onclick=()=>{Object.keys(marks).forEach(k=>marks[k]='Present');loadRoster();};
  document.getElementById('allA').onclick=()=>{Object.keys(marks).forEach(k=>marks[k]='Absent');loadRoster();};
  document.getElementById('saveAtt').onclick=saveAtt;
  loadRoster();
});
