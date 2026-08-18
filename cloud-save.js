(function(){
  const wait=()=>typeof window.spaceshipPushCloud==='function'?window.spaceshipPushCloud():null;
  function wrap(name){
    const original=window[name];
    if(typeof original!=='function'||original.__cloudWrapped)return;
    const wrapped=function(){const result=original.apply(this,arguments);try{const p=wait();if(p&&typeof p.catch==='function')p.catch(()=>{});}catch(e){}return result};
    wrapped.__cloudWrapped=true;window[name]=wrapped;
  }
  window.addEventListener('load',()=>setTimeout(()=>['toggleTask','completeMission','addTask','launchAway','dismissReentry','saveName'].forEach(wrap),800));
})();
