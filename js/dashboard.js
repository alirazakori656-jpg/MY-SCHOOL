document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.require('dashboard')) return;
  const students = SMS.getData('students');
  const teachers = SMS.getData('teachers');
  const staff = SMS.getData('staff');
  const classes = SMS.getData('classes');
  const today = new Date().toISOString().slice(0,10);
  const att = SMS.getData('attendance').filter(a => a.date === today);
  const present = att.filter(a => a.status === 'Present').length;
  const absent = att.filter(a => a.status === 'Absent').length;
  const leave = att.filter(a => a.status === 'Leave').length;
  const pays = SMS.getData('feePayments');
  const collected = pays.reduce((s,p)=>s+Number(p.paidAmount||0),0);
  const pending = pays.reduce((s,p)=>s+Number(p.remaining||0),0);
  const admissions = SMS.getData('admissions');
  const exams = SMS.getData('exams');
  const notices = SMS.getData('notices');
  const boys = students.filter(s=>s.gender==='Male').length;
  const girls = students.filter(s=>s.gender==='Female').length;

  const cards = [
    ['fa-user-graduate','#1e4d8c', students.length, 'Total Students', '+4%'],
    ['fa-chalkboard-user','#2d6bc4', teachers.length, 'Total Teachers', '+1'],
    ['fa-users-gear','#198754', staff.length, 'Total Staff', '0'],
    ['fa-school','#6f42c1', classes.length, 'Total Classes', ''],
    ['fa-user-check','#198754', present, 'Present Today', att.length? Math.round(present/att.length*100)+'%':''],
    ['fa-user-xmark','#dc3545', absent, 'Absent Today', ''],
    ['fa-coins','#e8b923', 'PKR '+collected.toLocaleString(), 'Fee Collected', ''],
    ['fa-file-invoice-dollar','#fd7e14', 'PKR '+pending.toLocaleString(), 'Pending Fees', ''],
    ['fa-file-circle-plus','#0d6efd', admissions.length, 'Admissions', ''],
    ['fa-file-lines','#6610f2', exams.length, 'Upcoming Exams', '']
  ];
  document.getElementById('statCards').innerHTML = cards.map(c => `
    <div class="col-6 col-md-4 col-xl-3">
      <div class="stat-card">
        <div class="d-flex justify-content-between">
          <div class="icon-wrap" style="background:${c[1]}"><i class="fa-solid ${c[0]}"></i></div>
          <span class="delta-up">${c[4]}</span>
        </div>
        <h3>${c[2]}</h3>
        <p>${c[3]}</p>
      </div>
    </div>`).join('');

  const mk = (id, type, labels, data, colors) => new Chart(document.getElementById(id), {
    type, data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
    options: { plugins: { legend: { position: 'bottom' } }, responsive: true }
  });
  mk('chartGender','doughnut',['Boys','Girls'],[boys,girls],['#1e4d8c','#e8b923']);
  mk('chartAtt','pie',['Present','Absent','Leave'],[present,absent,leave],['#198754','#dc3545','#fd7e14']);
  mk('chartFee','doughnut',['Paid','Pending'],[collected,pending],['#198754','#fd7e14']);
  new Chart(document.getElementById('chartAdm'), {
    type: 'bar',
    data: { labels: ['Apr','May','Jun','Jul','Aug','Sep'], datasets: [{ label: 'Admissions', data: [4,3,2,5,6,admissions.length], backgroundColor: '#1e4d8c' }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  const types = SMS.getData('examTypes');
  document.getElementById('upExams').innerHTML = exams.map(e => {
    const t = types.find(x=>x.id===e.typeId);
    return `<div class="border-bottom py-2"><strong>${subjectName(e.subjectId)}</strong> — ${className(e.classId)}<br><small class="text-muted">${e.date} ${e.startTime} • ${t?t.name:''}</small></div>`;
  }).join('') || '<p class="text-muted mb-0">No exams scheduled.</p>';

  document.getElementById('dashNotices').innerHTML = notices.map(n =>
    `<article class="notice-item p-2 mb-2 bg-light rounded"><strong>${SMS.escape(n.title)}</strong><br><small>${SMS.escape(n.date)} • ${SMS.escape(n.audience)}</small></article>`
  ).join('');
});
