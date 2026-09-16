function render(){
  if(!Auth.can('settings')){document.getElementById('tabBody').innerHTML='<p class="text-muted">You do not have access to settings.</p>';return;}
  const tab=document.querySelector('.nav-tabs .active')?.dataset.tab||'profile';
  const s=settingsObj()||{};
  const body=document.getElementById('tabBody');
  if(tab==='profile'){
    body.innerHTML=`<form id="sf" class="row g-2">
      <div class="col-md-8"><label class="form-label">School Name</label><input class="form-control" name="schoolName" value="${SMS.escape(s.schoolName||'')}"></div>
      <div class="col-md-4"><label class="form-label">Short Name</label><input class="form-control" name="shortName" value="${SMS.escape(s.shortName||'')}"></div>
      <div class="col-12"><label class="form-label">Address</label><input class="form-control" name="address" value="${SMS.escape(s.address||'')}"></div>
      <div class="col-md-4"><label class="form-label">Phone</label><input class="form-control" name="phone" value="${SMS.escape(s.phone||'')}"></div>
      <div class="col-md-4"><label class="form-label">Email</label><input class="form-control" name="email" value="${SMS.escape(s.email||'')}"></div>
      <div class="col-md-4"><label class="form-label">Website</label><input class="form-control" name="website" value="${SMS.escape(s.website||'')}"></div>
      <div class="col-md-6"><label class="form-label">Principal</label><input class="form-control" name="principalName" value="${SMS.escape(s.principalName||'')}"></div>
      <div class="col-md-6"><label class="form-label">Registration No</label><input class="form-control" name="registrationNumber" value="${SMS.escape(s.registrationNumber||'')}"></div>
      <div class="col-12"><button class="btn btn-primary" type="submit">Save Profile</button></div>
    </form>`;
    document.getElementById('sf').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());SMS.saveData('settings',{...s,...d});toast('Profile saved');};
  } else if(tab==='session'){
    body.innerHTML=`<label class="form-label">Academic Session</label><input class="form-control mb-2" id="sess" value="${SMS.escape(s.session||'')}">
      <button class="btn btn-primary" onclick="const cur=settingsObj();cur.session=document.getElementById('sess').value;SMS.saveData('settings',cur);toast('Session updated')">Save Session</button>`;
  } else if(tab==='system'){
    body.innerHTML=`<form id="sys" class="row g-2">
      <div class="col-md-4"><label class="form-label">Currency</label><input class="form-control" name="currency" value="${SMS.escape(s.currency||'PKR')}"></div>
      <div class="col-md-4"><label class="form-label">Date Format</label><input class="form-control" name="dateFormat" value="${SMS.escape(s.dateFormat||'')}"></div>
      <div class="col-md-4"><label class="form-label">Time Format</label><input class="form-control" name="timeFormat" value="${SMS.escape(s.timeFormat||'')}"></div>
      <div class="col-md-4"><label class="form-label">Passing %</label><input type="number" class="form-control" name="passingPercentage" value="${s.passingPercentage||50}"></div>
      <div class="col-12"><button class="btn btn-primary">Save System Settings</button>
        <button class="btn btn-outline-danger" type="button" onclick="if(confirm('Reset all DEMO data?')){localStorage.clear();location.href='login.html'}">Reset demo data</button></div>
    </form>
    <h3 class="h6 mt-4">Grade system</h3>
    <table class="table"><thead><tr><th>Grade</th><th>Min</th><th>Max</th></tr></thead><tbody>${
      (s.grades||[]).map(g=>`<tr><td>${g.name}</td><td>${g.min}</td><td>${g.max}</td></tr>`).join('')}</tbody></table>`;
    document.getElementById('sys').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());d.passingPercentage=+d.passingPercentage;SMS.saveData('settings',{...s,...d});toast('Saved');};
  } else if(tab==='users'){
    const users=SMS.getData('users');
    body.innerHTML=`<button class="btn btn-primary btn-sm mb-2" onclick="addUser()">Add User</button>
      <table class="table"><thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th></th></tr></thead><tbody>${
        users.map(u=>`<tr><td>${SMS.escape(u.name)}</td><td>${SMS.escape(u.username)}</td><td>${u.role}</td><td>${statusBadge(u.status)}</td>
        <td><button class="btn btn-sm btn-outline-secondary" onclick="toggleU('${u.id}')">Enable/Disable</button>
        <button class="btn btn-sm btn-outline-primary" onclick="chgPw('${u.id}')">Change Password</button></td></tr>`).join('')}</tbody></table>
      <p class="small text-warning">DEMO ONLY — passwords are hashed with a non-cryptographic demo hash. Replace with server-side hashing.</p>`;
  } else {
    body.innerHTML=`<div class="table-responsive"><table class="table table-sm"><thead><tr><th>Module</th><th>Admin</th><th>Principal</th><th>Teacher</th><th>Accountant</th><th>Staff</th></tr></thead><tbody>${
      Object.keys(PERMS.admin).map(m=>`<tr><td>${m}</td><td>${PERMS.admin[m]}</td><td>${PERMS.principal[m]}</td><td>${PERMS.teacher[m]}</td><td>${PERMS.accountant[m]}</td><td>${PERMS.staff[m]}</td></tr>`).join('')}</tbody></table></div>`;
  }
}
function toggleU(id){const u=SMS.getData('users').find(x=>x.id===id);SMS.updateData('users',id,{status:u.status==='Active'?'Inactive':'Active'});toast('Updated');render();}
function chgPw(id){const pw=prompt('New demo password (do not use a real personal password)');if(!pw)return;SMS.updateData('users',id,{passwordHash:SMS.hashDemo(pw)});toast('Password updated (demo hash)');}
function addUser(){
  const name=prompt('Name'); if(!name)return;
  const username=prompt('Username'); if(!username)return;
  const role=prompt('Role: admin, principal, teacher, accountant, staff','staff');
  const list=SMS.getData('users');
  list.push({id:SMS.generateId('u'),name,username,email:username+'@smpsqamber.edu.pk',passwordHash:SMS.hashDemo('changeme123'),role,status:'Active'});
  SMS.saveData('users',list);toast('User added. Demo password: changeme123');render();
}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require())return;
  document.querySelectorAll('.nav-tabs a').forEach(a=>a.onclick=e=>{e.preventDefault();document.querySelectorAll('.nav-tabs a').forEach(x=>x.classList.remove('active'));a.classList.add('active');render();});
  const tab=qs('tab'); if(tab){const el=document.querySelector('[data-tab="'+tab+'"]'); if(el)el.click();}
  render();
});
