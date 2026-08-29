function addDeleteButtons(){
  document.querySelectorAll('.task').forEach(task=>{
    const checkbox=task.querySelector('input[onchange*="toggleTask("]');
    if(!checkbox || task.querySelector('.delete-task')) return;
    const match=checkbox.getAttribute('onchange').match(/toggleTask\((\d+)\)/);
    if(!match)return;
    const id=match[1];
    const btn=document.createElement('button');btn.className='delete-task secondary';btn.textContent='🗑';btn.title='Delete task';btn.style.cssText='padding:8px 10px;color:#fecdd3;background:#3a1822;border-color:#6b2637;flex-shrink:0';
    btn.onclick=(e)=>{e.preventDefault();e.stopPropagation();if(!confirm('Delete this task?'))return;const t=tasks.find(x=>String(x.id)===String(id));if(!t)return;tasks=tasks.filter(x=>String(x.id)!==String(id));save();render();};task.appendChild(btn);
  });
}
addDeleteButtons();
new MutationObserver(addDeleteButtons).observe(document.body,{childList:true,subtree:true});

// Away mode pause: recurring tasks do not accumulate decay while the ship is away.
const conditionBeforeAwayPause=window.condition;
window.condition=function(t){
  if(t.type==='once')return conditionBeforeAwayPause(t);
  const p=DECAY[t.decay]||DECAY.medium,now=Date.now(),lastDone=Number(t.lastDone)||now;
  let elapsed=now-lastDone;
  if(away&&away.date){const awayStart=new Date(away.date).getTime(),pauseStart=Math.max(lastDone,awayStart);if(now>pauseStart)elapsed-=now-pauseStart;}
  const a=Math.max(0,elapsed/86400000),raw=100*(1-Math.exp(-Math.log(2)*a/p.half)),f=t.days?Math.min(1.6,Math.max(.45,7/t.days)):1;
  return Math.min(100,Math.round(raw*f));
};

// Re-entry should be frictionless: ending Away mode simply returns to normal task view.
window.renderReentry=function(){
  const card=document.getElementById('reentryCard');
  if(card){card.classList.add('hidden');card.innerHTML='';}
};
function dismissReentry(){away=null;save();render();}
