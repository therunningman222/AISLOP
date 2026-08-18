function addEditButtons(){
  document.querySelectorAll('.task').forEach(task=>{
    const checkbox=task.querySelector('input[onchange*="toggleTask("]');
    if(!checkbox || task.querySelector('.edit-task')) return;
    const match=checkbox.getAttribute('onchange').match(/toggleTask\((\d+)\)/);
    if(!match) return;
    const id=match[1];
    const btn=document.createElement('button');
    btn.className='edit-task secondary';
    btn.textContent='✏️';
    btn.title='Edit task';
    btn.style.cssText='padding:8px 10px;flex-shrink:0';
    btn.onclick=(e)=>{e.preventDefault();e.stopPropagation();openEditTask(Number(id));};
    const del=task.querySelector('.delete-task');
    task.insertBefore(btn,del||null);
  });
}
function openEditTask(id){
  const t=tasks.find(x=>x.id===id); if(!t)return;
  document.getElementById('taskModal').classList.remove('hidden');
  document.querySelector('#taskModal h2').textContent='Edit task';
  document.getElementById('newName').value=t.name||'';
  document.getElementById('newRoom').value=t.room||'Other';
  document.getElementById('newType').value=t.type||'recurring';
  document.getElementById('newDays').value=String(t.days||7);
  document.getElementById('newDecay').value=t.decay||'medium';
  document.getElementById('newTime').value=t.time||'10 min';
  toggleFrequency();
  const add=document.querySelector('#taskModal button[onclick="addTask()"]');
  add.textContent='Save changes';
  add.onclick=()=>saveEditedTask(id);
}
function saveEditedTask(id){
  const t=tasks.find(x=>x.id===id); if(!t)return;
  const n=document.getElementById('newName').value.trim(); if(!n){alert('Give the task a name first.');return;}
  const oldType=t.type;
  t.name=n;
  t.room=document.getElementById('newRoom').value;
  t.type=document.getElementById('newType').value;
  t.days=t.type==='recurring'?Number(document.getElementById('newDays').value):1;
  t.decay=document.getElementById('newDecay').value;
  t.time=document.getElementById('newTime').value;
  if(t.type==='recurring' && (!t.lastDone || oldType==='once')) t.lastDone=Date.now();
  save(); closeAddTask(); resetTaskModal(); render();
}
function resetTaskModal(){
  document.querySelector('#taskModal h2').textContent='Add a task';
  const add=document.querySelector('#taskModal button[onclick="addTask()"]');
  if(add){add.textContent='Add to ship';add.onclick=()=>addTask();}
}
const originalCloseAddTask=window.closeAddTask;
window.closeAddTask=function(){if(originalCloseAddTask)originalCloseAddTask();resetTaskModal();};
addEditButtons();
new MutationObserver(addEditButtons).observe(document.body,{childList:true,subtree:true});
