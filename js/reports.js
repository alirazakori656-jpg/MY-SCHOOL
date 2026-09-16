function rowsFor(type,q){
  q=(q||'').toLowerCase();
  if(type==='students') return SMS.getData('students').filter(s=>!q||s.name.toLowerCase().includes(q)).map(s=>({id:s.admissionNo,name:s.name,class:s.className,section:s.section,status:s.status}));
  if(type==='attendance') return SMS.getData('attendance').map(a=>{const s=studentById(a.studentId);return {date:a.date,student:s?s.name:a.studentId,status:a.status,class:className(a.classId)};}).filter(r=>!q||JSON.stringify(r).toLowerCase().includes(q));
  if(type==='teachersAtt') return SMS.getData('teacherAttendance').map(a=>({date:a.date,teacher:teacherName(a.teacherId),status:a.status}));
  if(type==='fees') return SMS.getData('feePayments').map(p=>{const s=studentById(p.studentId);return {invoice:p.invoiceNo,student:s?s.name:'',paid:p.paidAmount,remaining:p.remaining,method:p.method};});
  if(type==='pending') return SMS.getData('feePayments').filter(p=>p.remaining>0).map(p=>{const s=studentById(p.studentId);return {student:s?s.name:'',month:p.month,pending:p.remaining};});
  if(type==='exams') return SMS.getData('results').map(r=>{const s=studentById(r.studentId);return {student:s?s.name:'',subject:subjectName(r.subjectId),obtained:r.obtainedMarks,total:r.totalMarks};});
  if(type==='staff') return SMS.getData('staff').map(s=>({name:s.name,position:s.position,phone:s.phone,status:s.status}));
  if(type==='admissions') return SMS.getData('admissions').map(a=>({app:a.applicationNo,name:a.name,class:a.applyingClass,status:a.status}));
  return [];
}
function render(){
  const type=document.getElementById('rType').value;
  const q=document.getElementById('q').value;
  const rows=rowsFor(type,q);
  if(!rows.length){document.getElementById('out').innerHTML=emptyState('fa-chart-column','No rows');return;}
  const keys=Object.keys(rows[0]);
  document.getElementById('out').innerHTML=`<table class="table"><thead><tr>${keys.map(k=>'<th>'+k+'</th>').join('')}</tr></thead><tbody>${
    rows.map(r=>'<tr>'+keys.map(k=>'<td>'+SMS.escape(r[k])+'</td>').join('')+'</tr>').join('')}</tbody></table>`;
  window._reportRows=rows;
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('reports'))return;
  const r=qs('r'); if(r){const map={students:'students',attendance:'attendance',fees:'fees',exams:'exams',staff:'staff'}; if(map[r])document.getElementById('rType').value=map[r];}
  document.getElementById('rType').onchange=render;
  document.getElementById('q').oninput=render;
  document.getElementById('csvBtn').onclick=()=>exportCSV('report.csv',window._reportRows||[]);
  render();
});
