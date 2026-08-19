function sortAllSystemsByPriority(){
  const container=document.getElementById('tasks');
  if(!container || typeof tasks==='undefined' || typeof score!=='function') return;
  const rows=[...container.querySelectorAll(':scope > .task')];
  if(rows.length<2) return;
  const idOf=row=>{const cb=row.querySelector('input[onchange*="toggleTask("]');const m=cb&&cb.getAttribute('onchange').match(/toggleTask\((\d+)\)/);return m?Number(m[1]):null};
  const rank=new Map(tasks.map(t=>[Number(t.id),score(t)]));
  rows.sort((a,b)=>{
    const sa=rank.get(idOf(a))??-1,sb=rank.get(idOf(b))??-1;
    return sb-sa;
  });
  const current=rows.map(idOf).join(',');
  const existing=[...container.children].map(idOf).join(',');
  if(current!==existing) rows.forEach(row=>container.appendChild(row));
}
sortAllSystemsByPriority();
new MutationObserver(()=>requestAnimationFrame(sortAllSystemsByPriority)).observe(document.getElementById('tasks')||document.body,{childList:true});
