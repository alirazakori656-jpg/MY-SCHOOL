let page = 1;
const PER = 8;

function studentForm(s) {
  s = s || {};
  return `
  <form id="stuForm" class="row g-2">
    <input type="hidden" name="id" value="${s.id||''}">
    <div class="col-md-6"><label class="form-label">Full Name *</label><input class="form-control" name="name" required value="${SMS.escape(s.name||'')}"></div>
    <div class="col-md-6"><label class="form-label">Admission No *</label><input class="form-control" name="admissionNo" required value="${SMS.escape(s.admissionNo||'')}"></div>
    <div class="col-md-6"><label class="form-label">Father's Name</label><input class="form-control" name="fatherName" value="${SMS.escape(s.fatherName||'')}"></div>
    <div class="col-md-6"><label class="form-label">Mother's Name</label><input class="form-control" name="motherName" value="${SMS.escape(s.motherName||'')}"></div>
    <div class="col-md-4"><label class="form-label">DOB</label><input type="date" class="form-control" name="dob" value="${s.dob||''}"></div>
    <div class="col-md-4"><label class="form-label">Gender</label><select class="form-select" name="gender"><option ${s.gender==='Male'?'selected':''}>Male</option><option ${s.gender==='Female'?'selected':''}>Female</option></select></div>
    <div class="col-md-4"><label class="form-label">Blood Group</label><input class="form-control" name="bloodGroup" value="${SMS.escape(s.bloodGroup||'')}"></div>
    <div class="col-md-4"><label class="form-label">Class</label><select class="form-select" name="classId">${classOptions(s.classId)}</select></div>
    <div class="col-md-4"><label class="form-label">Section</label><select class="form-select" name="section"><option>A</option><option>B</option><option>C</option></select></div>
    <div class="col-md-4"><label class="form-label">Roll No</label><input class="form-control" name="rollNo" value="${SMS.escape(s.rollNo||'')}"></div>
    <div class="col-md-6"><label class="form-label">Phone</label><input class="form-control" name="phone" value="${SMS.escape(s.phone||'')}"></div>
    <div class="col-md-6"><label class="form-label">Email</label><input type="email" class="form-control" name="email" value="${SMS.escape(s.email||'')}"></div>
    <div class="col-12"><label class="form-label">Address</label><input class="form-control" name="address" value="${SMS.escape(s.address||'')}"></div>
    <div class="col-md-4"><label class="form-label">City</label><input class="form-control" name="city" value="${SMS.escape(s.city||'Qamber')}"></div>
    <div class="col-md-4"><label class="form-label">Admission Date</label><input type="date" class="form-control" name="admissionDate" value="${s.admissionDate||''}"></div>
    <div class="col-md-4"><label class="form-label">Status</label><select class="form-select" name="status"><option>Active</option><option>Inactive</option></select></div>
    <div class="col-md-6"><label class="form-label">Previous School</label><input class="form-control" name="previousSchool" value="${SMS.escape(s.previousSchool||'')}"></div>
    <div class="col-md-6"><label class="form-label">Emergency Contact</label><input class="form-control" name="emergencyContact" value="${SMS.escape(s.emergencyContact||'')}"></div>
    <div class="col-12"><label class="form-label">Documents</label><input class="form-control" name="documents" value="${SMS.escape(s.documents||'')}"></div>
  </form>`;
}

function openStudentModal(id) {
  const s = id ? SMS.getData('students').find(x=>x.id===id) : null;
  document.getElementById('modals').innerHTML = modalHtml('stuModal', s?'Edit Student':'Add Student', studentForm(s),
    '<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" type="button" onclick="saveStudent()">Save</button>');
  if (s && s.section) document.querySelector('[name=section]').value = s.section;
  if (s && s.status) document.querySelector('[name=status]').value = s.status;
  showModal('stuModal');
}

function saveStudent() {
  const f = document.getElementById('stuForm');
  const fd = new FormData(f);
  const data = Object.fromEntries(fd.entries());
  if (!data.name || !data.admissionNo) { toast('Name and admission number are required','danger'); return; }
  if (!validEmail(data.email)) { toast('Invalid email','danger'); return; }
  if (!validPhone(data.phone)) { toast('Invalid phone','danger'); return; }
  const list = SMS.getData('students');
  if (list.some(x => x.admissionNo === data.admissionNo && x.id !== data.id)) { toast('Duplicate admission number','danger'); return; }
  data.className = className(data.classId);
  if (data.id) SMS.updateData('students', data.id, data);
  else {
    data.id = SMS.generateId('STU');
    list.push(data);
    SMS.saveData('students', list);
  }
  bootstrap.Modal.getInstance(document.getElementById('stuModal')).hide();
  toast('Student saved');
  renderStudents();
}

function filteredStudents() {
  const q = (document.getElementById('q')?.value || '').toLowerCase();
  const fc = document.getElementById('fClass')?.value || '';
  const fs = document.getElementById('fSec')?.value || '';
  const st = document.getElementById('fStatus')?.value || '';
  return SMS.getData('students').filter(s =>
    (!q || (s.name+s.admissionNo+s.id+s.fatherName).toLowerCase().includes(q)) &&
    (!fc || s.classId === fc) && (!fs || s.section === fs) && (!st || s.status === st)
  );
}

function renderStudents() {
  const tab = document.querySelector('#subTabs .active')?.dataset.tab || 'list';
  const body = document.getElementById('tabBody');
  if (tab === 'promotion') {
    body.innerHTML = `<p class="text-muted">Promote students to the next grade for session change.</p>
      <button class="btn btn-primary" type="button" onclick="promoteAll()">Promote all Active students one grade</button>`;
    return;
  }
  if (tab === 'documents') {
    const rows = SMS.getData('students').map(s => `<tr><td>${SMS.escape(s.name)}</td><td>${SMS.escape(s.documents||'—')}</td>
      <td><button class="btn btn-sm btn-outline-primary" onclick="openStudentModal('${s.id}')">Update</button></td></tr>`).join('');
    body.innerHTML = `<table class="table"><thead><tr><th>Student</th><th>Documents</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
    return;
  }
  const list = filteredStudents();
  if (!list.length) {
    body.innerHTML = emptyState('fa-user-graduate','No students found','<button class="btn btn-primary btn-sm" onclick="openStudentModal()">+ Add Student</button>');
    document.getElementById('pager').innerHTML = '';
    return;
  }
  const pg = paginate(list, page, PER);
  page = pg.page;
  body.innerHTML = `<table class="table align-middle"><thead><tr>
    <th>ID</th><th>Name</th><th>Class</th><th>Roll</th><th>Phone</th><th>Status</th><th class="no-print"></th></tr></thead><tbody>
    ${pg.slice.map(s => `<tr>
      <td>${SMS.escape(s.admissionNo)}</td>
      <td><a href="student-profile.html?id=${s.id}">${SMS.escape(s.name)}</a><br><small class="text-muted">${SMS.escape(s.fatherName||'')}</small></td>
      <td>${SMS.escape(s.className)}-${SMS.escape(s.section)}</td>
      <td>${SMS.escape(s.rollNo)}</td>
      <td>${SMS.escape(s.phone)}</td>
      <td>${statusBadge(s.status)}</td>
      <td class="no-print text-nowrap">
        <a class="btn btn-sm btn-outline-secondary" href="student-profile.html?id=${s.id}" aria-label="View">View</a>
        ${Auth.can('students','full')?`<button class="btn btn-sm btn-outline-primary" onclick="openStudentModal('${s.id}')">Edit</button>
        <button class="btn btn-sm btn-outline-danger" onclick="delStudent('${s.id}')">Delete</button>`:''}
      </td></tr>`).join('')}</tbody></table>`;
  let p = '';
  for (let i=1;i<=pg.pages;i++) p += `<button class="btn btn-sm ${i===page?'btn-primary':'btn-outline-secondary'} me-1" onclick="page=${i};renderStudents()">${i}</button>`;
  document.getElementById('pager').innerHTML = `<div class="d-flex justify-content-between"><small>${pg.total} students</small><div>${p}</div></div>`;
}

function delStudent(id) {
  confirmDelete('Delete this student?', () => { SMS.deleteData('students', id); toast('Deleted'); renderStudents(); });
}
function exportStudents() { exportCSV('students.csv', filteredStudents()); }
function promoteAll() {
  const map = {c1:'c2',c2:'c3',c3:'c4',c4:'c5',c5:'c6',c6:'c6'};
  const list = SMS.getData('students').map(s => {
    const nid = map[s.classId] || s.classId;
    return { ...s, classId: nid, className: className(nid) };
  });
  SMS.saveData('students', list);
  toast('Promotion applied (demo)');
  renderStudents();
}

function renderProfile() {
  const id = qs('id');
  const s = studentById(id);
  const el = document.getElementById('profile');
  if (!s) { el.innerHTML = emptyState('fa-user','Student not found'); return; }
  const att = SMS.getData('attendance').filter(a => a.studentId === s.id);
  const p = att.filter(a=>a.status==='Present').length;
  const pct = att.length ? Math.round(p/att.length*100) : 0;
  const pays = SMS.getData('feePayments').filter(x=>x.studentId===s.id);
  const res = SMS.getData('results').filter(x=>x.studentId===s.id);
  const hw = SMS.getData('homework').filter(h=>h.classId===s.classId);
  const parent = SMS.getData('parents').find(x=>x.id===s.parentId);
  el.innerHTML = `
  <div class="row g-3">
    <div class="col-lg-4">
      <div class="card-soft p-3 text-center">
        <div class="profile-photo mx-auto mb-2 d-flex align-items-center justify-content-center fs-3">${s.name.slice(0,1)}</div>
        <h2 class="h5">${SMS.escape(s.name)}</h2>
        <p class="text-muted mb-1">${SMS.escape(s.admissionNo)}</p>
        ${statusBadge(s.status)}
      </div>
    </div>
    <div class="col-lg-8">
      <div class="card-soft p-3">
        <h3 class="h6">Basic information</h3>
        <div class="row"><div class="col-md-6">Father: ${SMS.escape(s.fatherName)}</div>
        <div class="col-md-6">Mother: ${SMS.escape(s.motherName)}</div>
        <div class="col-md-6">DOB: ${SMS.escape(s.dob)}</div>
        <div class="col-md-6">Gender: ${SMS.escape(s.gender)}</div>
        <div class="col-md-6">Class: ${SMS.escape(s.className)}-${SMS.escape(s.section)}</div>
        <div class="col-md-6">Roll: ${SMS.escape(s.rollNo)}</div>
        <div class="col-md-6">Phone: ${SMS.escape(s.phone)}</div>
        <div class="col-md-6">Email: ${SMS.escape(s.email)}</div>
        <div class="col-12">Address: ${SMS.escape(s.address)}, ${SMS.escape(s.city)}</div>
        <div class="col-md-6">Blood: ${SMS.escape(s.bloodGroup)}</div>
        <div class="col-md-6">Emergency: ${SMS.escape(s.emergencyContact)}</div></div>
      </div>
    </div>
    <div class="col-md-4"><div class="card-soft p-3"><h3 class="h6">Parent</h3>${parent?SMS.escape(parent.fatherName)+'<br>'+SMS.escape(parent.phone):'—'}</div></div>
    <div class="col-md-4"><div class="card-soft p-3"><h3 class="h6">Attendance</h3><div class="progress mb-2"><div class="progress-bar bg-success" style="width:${pct}%">${pct}%</div></div>${p}/${att.length} present</div></div>
    <div class="col-md-4"><div class="card-soft p-3"><h3 class="h6">Fees</h3>${pays.map(p=>p.month+': paid '+p.paidAmount+' remaining '+p.remaining).join('<br>')||'No payments'}</div></div>
    <div class="col-md-6"><div class="card-soft p-3"><h3 class="h6">Results</h3>${res.map(r=>subjectName(r.subjectId)+': '+r.obtainedMarks+'/'+r.totalMarks).join('<br>')||'—'}</div></div>
    <div class="col-md-6"><div class="card-soft p-3"><h3 class="h6">Homework</h3>${hw.map(h=>SMS.escape(h.title)).join('<br>')||'—'}</div></div>
    <div class="col-12"><div class="card-soft p-3"><h3 class="h6">Documents</h3>${SMS.escape(s.documents||'None on file')}</div></div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.require('students')) return;
  if (location.pathname.endsWith('student-profile.html')) { renderProfile(); return; }
  document.getElementById('fClass').innerHTML += classOptions();
  ['q','fClass','fSec','fStatus'].forEach(id => document.getElementById(id).addEventListener('input', () => { page=1; renderStudents(); }));
  document.getElementById('fClass').addEventListener('change', () => { page=1; renderStudents(); });
  document.getElementById('fSec').addEventListener('change', () => { page=1; renderStudents(); });
  document.getElementById('fStatus').addEventListener('change', () => { page=1; renderStudents(); });
  document.getElementById('btnAdd').onclick = () => openStudentModal();
  document.querySelectorAll('#subTabs a').forEach(a => a.onclick = e => {
    e.preventDefault();
    document.querySelectorAll('#subTabs a').forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    renderStudents();
  });
  if (qs('action')==='add') openStudentModal();
  if (qs('tab')) {
    const t = document.querySelector('#subTabs [data-tab="'+qs('tab')+'"]');
    if (t) t.click();
  }
  renderStudents();
});
