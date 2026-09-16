function render(){
  const list=SMS.getData('notifications');
  document.getElementById('list').innerHTML=list.length?list.map(n=>`<div class="p-3 border-bottom ${n.read?'':'bg-light'}">
    <div class="d-flex justify-content-between"><strong>${SMS.escape(n.title)}</strong><small>${n.date}</small></div>
    <p class="mb-1">${SMS.escape(n.body)}</p>
    ${n.read?'<span class="badge text-bg-secondary">Read</span>':'<button class="btn btn-sm btn-outline-primary" onclick="mark(\''+n.id+'\')">Mark read</button>'}
  </div>`).join(''):emptyState('fa-bell','No notifications');
}
function mark(id){SMS.updateData('notifications',id,{read:true});render();}
document.addEventListener('DOMContentLoaded',()=>{
  if(!Auth.require('notifications'))return;
  document.getElementById('markAll').onclick=()=>{
    const list=SMS.getData('notifications').map(n=>({...n,read:true}));
    SMS.saveData('notifications',list);toast('All marked read');render();
  };
  render();
});
