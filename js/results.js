function gradeOf(obt,total){
  const pct=total? (obt/total)*100 : 0;
  return {pct:Math.round(pct*10)/10, grade:calcGrade(pct), pass:pct>=((settingsObj()||{}).passingPercentage||50)};
}
function render(){
  const tab=document.querySelector('.nav-tabs .active')?.dataset.tab||'entry';
  const body=document.getElementById('tabBody');
  const types=SMS.getData('examTypes');
  if(tab==='entry'){
    body.innerHTML=`<div class="row g-2 mb-3">
      <div class="col-md-4"><select class="form-select" id="eType">${types.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div>
      <div class="col-md-4"><select class="form-select" id="eClass">${classOptions('c5')}</select></div>
      <div class="col-md-4"><select class="form-select" id="eSub">${subjectOptions()}</select></div>
    </div><div id="entryTbl"></div><button class="btn btn-primary mt-2" onclick="saveMarks()">Save Marks</button>`;
    drawEntry();
    ['eType','eClass','eSub'].forEach(id=>document.getElementById(id).onchange=drawEntry);
  } else if(tab==='results'){
    const res=SMS.getData('results');
    body.innerHTML=`<table class="table"><thead><tr><th>Student</th><th>Subject</th><th>Obtained</th><th>Total</th><th>Grade</th><th>Remarks</th></tr></thead><tbody>${
      res.map(r=>{const s=studentById(r.studentId);const g=gradeOf(r.obtainedMarks,r.totalMarks);
        return `<tr><td>${s?s.name:r.studentId}</td><td>${subjectName(r.subjectId)}</td><td>${r.obtainedMarks}</td><td>${r.totalMarks}</td><td>${g.grade}</td><td>${SMS.escape(r.remarks||'')}</td></tr>`;}).join('')}</tbody></table>`;
  } else {
    const students=SMS.getData('students').filter(s=>s.classId==='c5');
    body.innerHTML=`<p class="text-muted">Select a Grade 5 student to preview a printable report card (demo Mid Term).</p>
      <select class="form-select mb-3" id="rcStu">${students.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select>
      <div id="rc"></div>`;
    document.getElementById('rcStu').onchange=drawCard; drawCard();
  }
}
function drawEntry(){
  const cid=document.getElementById('eClass').value;
  const sub=document.getElementById('eSub').value;
  const et=document.getElementById('eType').value;
  const subj=SMS.getData('subjects').find(x=>x.id===sub);
  const max=subj?subj.maxMarks:100;
  const stu=SMS.getData('students').filter(s=>s.classId===cid);
  const res=SMS.getData('results');
  document.getElementById('entryTbl').innerHTML=`<table class="table"><thead><tr><th>Student</th><th>Total</th><th>Obtained</th><th>Remarks</th></tr></thead><tbody>${
    stu.map(s=>{const ex=res.find(r=>r.studentId===s.id&&r.subjectId===sub&&r.examTypeId===et);
      return `<tr><td>${SMS.escape(s.name)}</td><td>${max}</td>
      <td><input class="form-control form-control-sm mk" data-sid="${s.id}" type="number" min="0" max="${max}" value="${ex?ex.obtainedMarks:''}"></td>
      <td><input class="form-control form-control-sm rm" data-sid="${s.id}" value="${ex?SMS.escape(ex.remarks):''}"></td></tr>`;}).join('')}</tbody></table>`;
}
function saveMarks(){
  const sub=document.getElementById('eSub').value;
  const et=document.getElementById('eType').value;
  const subj=SMS.getData('subjects').find(x=>x.id===sub);
  const max=subj?subj.maxMarks:100;
  let list=SMS.getData('results').filter(r=>!(r.subjectId===sub&&r.examTypeId===et&&document.querySelector('.mk[data-sid="'+r.studentId+'"]')));
  document.querySelectorAll('.mk').forEach(inp=>{
    const sid=inp.dataset.sid; const obt=+inp.value||0;
    const rm=document.querySelector('.rm[data-sid="'+sid+'"]').value;
    list=list.filter(r=>!(r.studentId===sid&&r.subjectId===sub&&r.examTypeId===et));
    list.push({id:SMS.generateId('res'),studentId:sid,subjectId:sub,examTypeId:et,totalMarks:max,obtainedMarks:obt,remarks:rm});
  });
  SMS.saveData('results',list);toast('Results saved');
}
function drawCard(){
  const sid=document.getElementById('rcStu').value;
  const s=studentById(sid); if(!s)return;
  const school=settingsObj()||{};
  const rows=SMS.getData('results').filter(r=>r.studentId===sid);
  let tot=0,obt=0;
  const tr=rows.map(r=>{tot+=r.totalMarks;obt+=r.obtainedMarks;const g=gradeOf(r.obtainedMarks,r.totalMarks);
    return `<tr><td>${subjectName(r.subjectId)}</td><td>${r.totalMarks}</td><td>${r.obtainedMarks}</td><td>${g.grade}</td><td>${SMS.escape(r.remarks||'')}</td></tr>`;}).join('');
  const g=gradeOf(obt,tot);
  document.getElementById('rc').innerHTML=`
  <div class="border p-4 bg-white" id="reportCard">
    <div class="text-center mb-3">
      <div class="logo-mark mx-auto mb-2" style="width:48px;height:48px;background:#e8b923;color:#12284e;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-weight:800">SM</div>
      <h2 class="h5 mb-0">${SMS.escape(school.schoolName||'')}</h2>
      <small>${SMS.escape(school.address||'')}</small>
      <p class="mb-0 fw-bold">REPORT CARD — Mid Term • ${SMS.escape(school.session||'')}</p>
    </div>
    <div class="row mb-3"><div class="col-md-6">Student: <strong>${SMS.escape(s.name)}</strong><br>Father: ${SMS.escape(s.fatherName)}</div>
    <div class="col-md-6">Class: ${SMS.escape(s.className)}-${SMS.escape(s.section)} • Roll ${SMS.escape(s.rollNo)}<br>Admission: ${SMS.escape(s.admissionNo)}</div></div>
    <table class="table table-bordered"><thead><tr><th>Subject</th><th>Total</th><th>Obtained</th><th>Grade</th><th>Remarks</th></tr></thead><tbody>${tr}</tbody>
    <tfoot><tr><th>Total</th><th>${tot}</th><th>${obt}</th><th>${g.grade}</th><th>${g.pct}% • ${g.pass?'PASS':'FAIL'}</th></tr></tfoot></table>
    <div class="d-flex justify-content-between mt-5"><div>Class Teacher ____________</div><div>Principal ____________</div></div>
  </div>
  <div class="mt-3 no-print"><button class="btn btn-outline-secondary" onclick="printPage()">Print Report Card</button>
  <button class="btn btn-outline-secondary" onclick="downloadRc()">Download (print to PDF)</button></div>`;
}
function downloadRc(){toast('Use the browser Print dialog and choose Save as PDF');printPage();}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('exams'))return;
  document.querySelectorAll('.nav-tabs a').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('.nav-tabs a').forEach(x=>x.classList.remove('active'));a.classList.add('active');render();});
  const tab=qs('tab'); if(tab){const el=document.querySelector('[data-tab="'+tab+'"]');if(el)el.click();}
  render();
});
