function addDeleteButtons(){
  document.querySelectorAll('.task').forEach(task=>{
    const checkbox=task.querySelector('input[onchange*="toggleTask("]');
    if(!checkbox || task.querySelector('.delete-task')) return;
    const match=checkbox.getAttribute('onchange').match(/toggleTask\((\d+)\)/);
    if(!match) return;
    const id=match[1];
    const btn=document.createElement('button');
    btn.className='delete-task secondary';
    btn.textContent='🗑';
    btn.title='Delete task';
    btn.style.cssText='padding:8px 10px;color:#fecdd3;background:#3a1822;border-color:#6b2637;flex-shrink:0';
    btn.onclick=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      if(!confirm('Delete this task?')) return;
      const stored=JSON.parse(localStorage.getItem('spaceshipTasks')||'[]');
      const updated=stored.filter(t=>String(t.id)!==String(id));
      localStorage.setItem('spaceshipTasks',JSON.stringify(updated));
      location.reload();
    };
    task.appendChild(btn);
  });
}
addDeleteButtons();
new MutationObserver(addDeleteButtons).observe(document.body,{childList:true,subtree:true});
