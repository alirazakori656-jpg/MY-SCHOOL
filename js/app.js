function toast(msg, type) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast align-items-center text-bg-' + (type || 'success') + ' show mb-2';
  el.setAttribute('role', 'status');
  el.innerHTML = '<div class="d-flex"><div class="toast-body">' + SMS.escape(msg) + '</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>';
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function confirmDelete(title, cb) {
  if (confirm(title || 'Delete this record? This cannot be undone.')) cb();
}

function exportCSV(filename, rows) {
  if (!rows || !rows.length) { toast('Nothing to export', 'warning'); return; }
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')].concat(rows.map(r => headers.map(h => '"' + String(r[h] ?? '').replace(/"/g,'""') + '"').join(','))).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function printPage() { window.print(); }

function calcGrade(pct) {
  const s = SMS.getData('settings');
  const grades = (s && s.grades) || [];
  const g = grades.find(x => pct >= x.min && pct <= x.max);
  return g ? g.name : (pct >= 50 ? 'D' : 'F');
}

function settingsObj() {
  const s = SMS.getData('settings');
  return Array.isArray(s) ? null : s;
}

function paginate(list, page, per) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / per));
  page = Math.min(page, pages);
  return { slice: list.slice((page-1)*per, page*per), page, pages, total };
}

function emptyState(icon, text, btnHtml) {
  return '<div class="empty-state"><i class="fa-solid ' + icon + ' mb-2"></i><p class="mb-2">' + SMS.escape(text) + '</p>' + (btnHtml || '') + '</div>';
}

function statusBadge(st) {
  const map = { Active:'success', Inactive:'secondary', Present:'success', Absent:'danger', Leave:'warning', 'Half Day':'info', Pending:'warning', Approved:'success', Rejected:'danger', Published:'success', Assigned:'primary', Paid:'success' };
  return '<span class="badge text-bg-' + (map[st] || 'secondary') + ' badge-status">' + SMS.escape(st) + '</span>';
}

const MENU = [
  { href: 'dashboard.html', icon: 'fa-gauge-high', label: 'Dashboard', module: 'dashboard' },
  { label: 'Students', icon: 'fa-user-graduate', module: 'students', children: [
    { href: 'students.html', label: 'All Students' },
    { href: 'students.html?action=add', label: 'Add Student' },
    { href: 'students.html?tab=promotion', label: 'Student Promotion' },
    { href: 'students.html?tab=documents', label: 'Student Documents' }
  ]},
  { label: 'Teachers', icon: 'fa-chalkboard-user', module: 'teachers', children: [
    { href: 'teachers.html', label: 'All Teachers' },
    { href: 'teachers.html?action=add', label: 'Add Teacher' },
    { href: 'attendance.html?type=teacher', label: 'Teacher Attendance' }
  ]},
  { label: 'Staff', icon: 'fa-users-gear', module: 'staff', children: [
    { href: 'staff.html', label: 'All Staff' },
    { href: 'staff.html?action=add', label: 'Add Staff' }
  ]},
  { label: 'Parents', icon: 'fa-people-roof', module: 'parents', children: [
    { href: 'parents.html', label: 'All Parents' },
    { href: 'parents.html', label: 'Parent Profiles' }
  ]},
  { label: 'Classes & Sections', icon: 'fa-school', module: 'classes', children: [
    { href: 'classes.html', label: 'Classes' },
    { href: 'classes.html?tab=sections', label: 'Sections' },
    { href: 'classes.html?tab=teachers', label: 'Class Teachers' }
  ]},
  { label: 'Subjects', icon: 'fa-book', module: 'subjects', children: [
    { href: 'subjects.html', label: 'Subjects' },
    { href: 'subjects.html?tab=assign', label: 'Assign Subjects' }
  ]},
  { label: 'Attendance', icon: 'fa-clipboard-user', module: 'attendance', children: [
    { href: 'attendance.html', label: 'Student Attendance' },
    { href: 'attendance.html?type=teacher', label: 'Teacher Attendance' },
    { href: 'attendance.html?tab=reports', label: 'Attendance Reports' }
  ]},
  { label: 'Timetable', icon: 'fa-calendar-days', module: 'timetable', children: [
    { href: 'timetable.html', label: 'Class Timetable' },
    { href: 'timetable.html?tab=teacher', label: 'Teacher Timetable' }
  ]},
  { label: 'Homework', icon: 'fa-book-open', module: 'homework', children: [
    { href: 'homework.html?action=add', label: 'Add Homework' },
    { href: 'homework.html', label: 'Homework List' }
  ]},
  { label: 'Exams & Results', icon: 'fa-file-lines', module: 'exams', children: [
    { href: 'exams.html', label: 'Exam Types' },
    { href: 'exams.html?tab=schedule', label: 'Exam Schedule' },
    { href: 'results.html', label: 'Marks Entry' },
    { href: 'results.html?tab=results', label: 'Results' },
    { href: 'results.html?tab=cards', label: 'Report Cards' }
  ]},
  { label: 'Fees', icon: 'fa-money-bill-wave', module: 'fees', children: [
    { href: 'fees.html', label: 'Fee Structure' },
    { href: 'fees.html?tab=collect', label: 'Collect Fee' },
    { href: 'fees.html?tab=history', label: 'Payment History' },
    { href: 'fees.html?tab=pending', label: 'Pending Fees' },
    { href: 'fee-receipt.html', label: 'Receipts' }
  ]},
  { label: 'Admissions', icon: 'fa-file-circle-plus', module: 'admissions', children: [
    { href: 'admissions.html', label: 'New Applications' },
    { href: 'admissions.html?status=Approved', label: 'Approved' },
    { href: 'admissions.html?status=Rejected', label: 'Rejected' },
    { href: 'admissions.html?tab=reports', label: 'Admission Reports' }
  ]},
  { label: 'Leave Management', icon: 'fa-person-walking-arrow-right', module: 'leaves', children: [
    { href: 'leaves.html?type=Student', label: 'Student Leave' },
    { href: 'leaves.html?type=Teacher', label: 'Teacher Leave' },
    { href: 'leaves.html?type=Staff', label: 'Staff Leave' }
  ]},
  { label: 'Announcements', icon: 'fa-bullhorn', module: 'notices', children: [
    { href: 'notices.html', label: 'Notices' },
    { href: 'notices.html?kind=Event', label: 'Events' },
    { href: 'notices.html?kind=Circular', label: 'Circulars' }
  ]},
  { href: 'notifications.html', icon: 'fa-bell', label: 'Notifications', module: 'notifications' },
  { label: 'Reports', icon: 'fa-chart-column', module: 'reports', children: [
    { href: 'reports.html?r=students', label: 'Student Reports' },
    { href: 'reports.html?r=attendance', label: 'Attendance Reports' },
    { href: 'reports.html?r=fees', label: 'Fee Reports' },
    { href: 'reports.html?r=exams', label: 'Exam Reports' },
    { href: 'reports.html?r=staff', label: 'Staff Reports' }
  ]},
  { label: 'Settings', icon: 'fa-gear', module: 'settings', children: [
    { href: 'settings.html', label: 'School Profile' },
    { href: 'settings.html?tab=session', label: 'Academic Session' },
    { href: 'settings.html?tab=system', label: 'System Settings' },
    { href: 'settings.html?tab=users', label: 'User Roles' },
    { href: 'settings.html?tab=perms', label: 'Permissions' }
  ]}
];

function renderLayout(activeHref) {
  const user = Auth.current();
  if (!user) return;
  const unread = SMS.getData('notifications').filter(n => !n.read).length;
  const school = settingsObj() || {};
  let nav = '';
  MENU.forEach(item => {
    if (item.module && !Auth.can(item.module)) return;
    if (item.children) {
      const open = item.children.some(c => location.pathname.endsWith(c.href.split('?')[0]));
      nav += '<div class="menu-group"><button class="nav-btn" type="button" onclick="this.nextElementSibling.classList.toggle(\'open\')"><i class="fa-solid ' + item.icon + '"></i><span class="nav-text">' + item.label + '</span></button><div class="submenu' + (open?' open':'') + '">';
      item.children.forEach(c => {
        nav += '<a href="' + c.href + '"' + (location.href.includes(c.href) ? ' class="active"' : '') + '><span class="nav-text">' + c.label + '</span></a>';
      });
      nav += '</div></div>';
    } else {
      const act = location.pathname.endsWith(item.href) ? ' active' : '';
      nav += '<a class="' + act.trim() + '" href="' + item.href + '"><i class="fa-solid ' + item.icon + '"></i><span class="nav-text">' + item.label + '</span></a>';
    }
  });

  const shell = document.getElementById('app-shell');
  const page = shell.innerHTML;
  shell.innerHTML = `
<div class="app-wrap">
  <div class="sidebar-backdrop" id="sbBackdrop" onclick="toggleSidebar(false)"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="logo-mark">SM</div>
      <div class="brand-text">
        <h1>${SMS.escape(school.shortName || 'SMPS Qamber')}</h1>
        <small>DEMO • ${SMS.escape(school.session || '')}</small>
      </div>
    </div>
    <nav class="sidebar-nav" aria-label="Main">
      ${nav}
      <a href="#" onclick="Auth.logout();return false;"><i class="fa-solid fa-right-from-bracket"></i><span class="nav-text">Logout</span></a>
    </nav>
  </aside>
  <div class="main">
    <header class="topbar">
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" type="button" aria-label="Toggle menu" onclick="toggleSidebar()"><i class="fa-solid fa-bars"></i></button>
        <div class="position-relative d-none d-md-block" style="min-width:280px">
          <input class="form-control form-control-sm" id="globalSearch" placeholder="Search students, teachers, fees..." aria-label="Global search" oninput="runGlobalSearch(this.value)">
          <div id="searchResults" class="search-results d-none"></div>
        </div>
      </div>
      <div class="d-flex align-items-center gap-3">
        <a href="notifications.html" class="position-relative text-dark" aria-label="Notifications">
          <i class="fa-regular fa-bell fs-5"></i>
          ${unread ? '<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">' + unread + '</span>' : ''}
        </a>
        <div class="dropdown">
          <button class="btn btn-sm btn-light dropdown-toggle" data-bs-toggle="dropdown">${SMS.escape(user.name)} <small class="text-muted">(${SMS.escape(user.role)})</small></button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><span class="dropdown-item-text small text-warning">DEMO LOGIN ONLY</span></li>
            <li><a class="dropdown-item" href="settings.html">Settings</a></li>
            <li><a class="dropdown-item" href="#" onclick="Auth.logout();return false;">Logout</a></li>
          </ul>
        </div>
      </div>
    </header>
    <div class="page-content">${page}</div>
  </div>
</div>`;
}

function toggleSidebar(force) {
  const sb = document.getElementById('sidebar');
  const bd = document.getElementById('sbBackdrop');
  if (window.innerWidth < 992) {
    const open = force === undefined ? !sb.classList.contains('open') : force;
    sb.classList.toggle('open', open);
    bd.classList.toggle('show', open);
  } else {
    sb.classList.toggle('collapsed');
  }
}

function runGlobalSearch(q) {
  const box = document.getElementById('searchResults');
  q = (q || '').toLowerCase().trim();
  if (!q) { box.classList.add('d-none'); box.innerHTML = ''; return; }
  const hits = [];
  SMS.getData('students').forEach(s => { if ((s.name+s.admissionNo+s.id).toLowerCase().includes(q)) hits.push({t:'Student', l:s.name, h:'student-profile.html?id='+s.id}); });
  SMS.getData('teachers').forEach(s => { if (s.name.toLowerCase().includes(q)) hits.push({t:'Teacher', l:s.name, h:'teachers.html'}); });
  SMS.getData('staff').forEach(s => { if (s.name.toLowerCase().includes(q)) hits.push({t:'Staff', l:s.name, h:'staff.html'}); });
  SMS.getData('parents').forEach(s => { if ((s.fatherName+s.motherName).toLowerCase().includes(q)) hits.push({t:'Parent', l:s.fatherName, h:'parents.html'}); });
  SMS.getData('classes').forEach(s => { if (s.name.toLowerCase().includes(q)) hits.push({t:'Class', l:s.name, h:'classes.html'}); });
  SMS.getData('notices').forEach(s => { if (s.title.toLowerCase().includes(q)) hits.push({t:'Notice', l:s.title, h:'notices.html'}); });
  SMS.getData('feePayments').forEach(s => { if ((s.invoiceNo||'').toLowerCase().includes(q)) hits.push({t:'Fee', l:s.invoiceNo, h:'fees.html?tab=history'}); });
  box.innerHTML = hits.slice(0,12).map(h => '<a class="dropdown-item" href="'+h.h+'"><small class="text-muted">'+h.t+'</small> '+SMS.escape(h.l)+'</a>').join('') || '<div class="p-2 text-muted">No results</div>';
  box.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('app-shell')) return;
  if (!Auth.current()) { location.href = 'login.html'; return; }
  renderLayout();
});
