function render(){
  const kind=qs('kind');
  let list=SMS.getData('notices');
  if(kind)list=list.filter(n=>n.kind===kind);
  document.getElementById('list').innerHTML=list.length?list.map(n=>`<article class="notice-item p-3 mb-2 bg-light rounded">
    <div class="d-flex justify-content-between"><strong>${SMS.escape(n.title)}</strong>${statusBadge(n.priority)}</div>
    <p class="mb-1">${SMS.escape(n.description)}</p>
    <small class="text-muted">${n.date} • ${n.audience} • ${n.kind}</small>
    <div class="mt-2"><button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('Delete notice?',()=>{SMS.deleteData('notices','${n.id}');render();})">Delete</button></div>
  </article>`).join(''):emptyState('fa-bullhorn','No notices','<button class="btn btn-primary btn-sm" onclick="openN()">Add Notice</button>');
}
function openN(){
  document.getElementById('modals').innerHTML=modalHtml('md','Add Notice',`<form id="frm" class="row g-2">
    <div class="col-md-8"><label class="form-label">Title</label><input class="form-control" name="title" required></div>
    <div class="col-md-4"><label class="form-label">Kind</label><select class="form-select" name="kind"><option>Notice</option><option>Event</option><option>Circular</option><option>Announcement</option></select></div>
    <div class="col-12"><label class="form-label">Description</label><textarea class="form-control" name="description" rows="3"></textarea></div>
    <div class="col-md-4"><label class="form-label">Date</label><input type="date" class="form-control" name="date" value="${new Date().toISOString().slice(0,10)}"></div>
    <div class="col-md-4"><label class="form-label">Audience</label><select class="form-select" name="audience"><option>Everyone</option><option>Students</option><option>Teachers</option><option>Parents</option><option>Staff</option></select></div>
    <div class="col-md-4"><label class="form-label">Priority</label><select class="form-select" name="priority"><option>High</option><option>Medium</option><option>Low</option></select></div>
  </form>`,`<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveN()">Publish</button>`);showModal('md');
}
function saveN(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.title){toast('Title required','danger');return;}d.id=SMS.generateId('n');d.status='Published';d.attachment='';
  const list=SMS.getData('notices');list.push(d);SMS.saveData('notices',list);
  const nts=SMS.getData('notifications');nts.unshift({id:SMS.generateId('nt'),title:'New notice',body:d.title,read:false,date:d.date,type:'notice'});SMS.saveData('notifications',nts);
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Published');render();}
document.addEventListener('DOMContentLoaded',()=>{if(!Auth.require('notices'))return;document.getElementById('btnAdd').onclick=openN;render();});
