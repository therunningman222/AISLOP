function sortAllSystemsByPriority(){
  const container=document.getElementById('tasks');
  if(!container) return;
  const rows=[...container.querySelectorAll(':scope > .task')];
  if(rows.length<2) return;
  // The list should always show the most decayed/urgent task first.
  // Sort from the percentage currently displayed in each row, so this
  // stays aligned with exactly what the user sees regardless of which
  // scoring implementation is active.
  const priority=row=>{
    const text=row.textContent||'';
    const matches=[...text.matchAll(/(?:^|\s)(\d{1,3})%/g)];
    return matches.length?Number(matches[0][1]):-1;
  };
  rows.sort((a,b)=>priority(b)-priority(a));
  rows.forEach(row=>container.appendChild(row));
}

function runPrioritySort(){
  requestAnimationFrame(()=>sortAllSystemsByPriority());
}

runPrioritySort();
new MutationObserver(runPrioritySort).observe(document.getElementById('tasks')||document.body,{childList:true,subtree:true});
setInterval(sortAllSystemsByPriority,30000);
