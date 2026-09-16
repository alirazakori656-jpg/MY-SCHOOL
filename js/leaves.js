function render(){
  const type=qs('type');
  let list=SMS.getData('leaves');
  if(type)list=list.filter(l=>l.type===type);
  document.getElementById('list').innerHTML=list.length?`<table class="table"><thead><tr><th>Type</th><th>Applicant</th><th>Leave</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th></th></tr></thead><tbody>${
    list.map(l=>`<tr><td>${l.type}</td><td>${SMS.escape(l.applicantName)}</td><td>${l.leaveType}</td><td>${l.fromDate}</td><td>${l.toDate}</td><td>${SMS.escape(l.reason)}</td><td>${statusBadge(l.status)}</td>
    <td><button class="btn btn-sm btn-success" onclick="setL('${l.id}','Approved')">Approve</button>
    <button class="btn btn-sm btn-outline-danger" onclick="setL('${l.id}','Rejected')">Reject</button></td></tr>`).join('')}</tbody></table>`:emptyState('fa-person-walking-arrow-right','No leave records','<button class="btn btn-primary btn-sm" onclick="openL()">Apply Leave</button>');
}
function setL(id,st){const u=Auth.current();SMS.updateData('leaves',id,{status:st,approvedBy:u?u.name:''});toast(st);render();}
function openL(){
  document.getElementById('modals').innerHTML=modalHtml('md','Apply Leave',`<form id="frm" class="row g-2">
    <div class="col-md-4"><label class="form-label">For</label><select class="form-select" name="type"><option>Student</option><option>Teacher</option><option>Staff</option></select></div>
    <div class="col-md-8"><label class="form-label">Applicant name</label><input class="form-control" name="applicantName" required></div>
    <div class="col-md-4"><label class="form-label">Leave type</label><select class="form-select" name="leaveType"><option>Sick</option><option>Casual</option><option>Emergency</option></select></div>
    <div class="col-md-4"><label class="form-label">From</label><input type="date" class="form-control" name="fromDate" required></div>
    <div class="col-md-4"><label class="form-label">To</label><input type="date" class="form-control" name="toDate" required></div>
    <div class="col-12"><label class="form-label">Reason</label><textarea class="form-control" name="reason"></textarea></div>
  </form>`,`<button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" onclick="saveL()">Submit</button>`);showModal('md');
}
function saveL(){const d=Object.fromEntries(new FormData(document.getElementById('frm')).entries());
  if(!d.applicantName||!d.fromDate){toast('Required fields missing','danger');return;}
  d.id=SMS.generateId('lv');d.status='Pending';d.approvedBy='';d.applicantId='';
  const list=SMS.getData('leaves');list.push(d);SMS.saveData('leaves',list);
  bootstrap.Modal.getInstance(document.getElementById('md')).hide();toast('Leave submitted');render();}
document.addEventListener('DOMContentLoaded',()=>{if(!Auth.require('leaves'))return;document.getElementById('btnAdd').onclick=openL;render();});
