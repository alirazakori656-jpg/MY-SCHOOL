function pageHeadAssets() {}
function qs(n) { return new URLSearchParams(location.search).get(n); }

function modalHtml(id, title, body, footer) {
  return `<div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}t">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header"><h2 class="modal-title h5" id="${id}t">${title}</h2>
          <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer">${footer || ''}</div>
      </div>
    </div></div>`;
}

function showModal(id) { new bootstrap.Modal(document.getElementById(id)).show(); }

function classOptions(selected) {
  return SMS.getData('classes').map(c => `<option value="${c.id}" ${c.id===selected?'selected':''}>${SMS.escape(c.name)}</option>`).join('');
}
function teacherOptions(selected) {
  return SMS.getData('teachers').map(t => `<option value="${t.id}" ${t.id===selected?'selected':''}>${SMS.escape(t.name)}</option>`).join('');
}
function subjectOptions(selected) {
  return SMS.getData('subjects').map(s => `<option value="${s.id}" ${s.id===selected?'selected':''}>${SMS.escape(s.name)}</option>`).join('');
}
function studentOptions(selected) {
  return SMS.getData('students').map(s => `<option value="${s.id}" ${s.id===selected?'selected':''}>${SMS.escape(s.name)} (${SMS.escape(s.admissionNo)})</option>`).join('');
}
function className(id) {
  const c = SMS.getData('classes').find(x => x.id === id);
  return c ? c.name : id || '';
}
function teacherName(id) {
  const t = SMS.getData('teachers').find(x => x.id === id);
  return t ? t.name : '';
}
function subjectName(id) {
  const s = SMS.getData('subjects').find(x => x.id === id);
  return s ? s.name : '';
}
function studentById(id) { return SMS.getData('students').find(x => x.id === id); }

function validEmail(e) { return !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validPhone(p) { return !p || /[0-9]{7,}/.test(String(p).replace(/\D/g,'')); }
