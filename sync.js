const SUPABASE_URL='https://sbjksyrygbtopfyogois.supabase.co';
const SUPABASE_KEY='sb_publishable_Tx6z9iojGy-ZXzinXjRGkQ_211kjOYZ';
const STATE_ID='main';
let syncingFromCloud=false;
let syncTimer=null;

function cloudHeaders(){return {'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'};}
function localState(){return {
  tasks:JSON.parse(localStorage.getItem('spaceshipTasks')||'null'),
  away:JSON.parse(localStorage.getItem('spaceshipAway')||'null'),
  name:localStorage.getItem('spaceshipName')||'Captain'
};}
async function pushCloud(){
  if(syncingFromCloud)return;
  try{
    await fetch(SUPABASE_URL+'/rest/v1/spaceship_state?on_conflict=id',{
      method:'POST',headers:cloudHeaders(),body:JSON.stringify({id:STATE_ID,data:localState(),updated_at:new Date().toISOString()})
    });
  }catch(e){console.warn('Spaceship sync upload failed',e)}
}
function schedulePush(){clearTimeout(syncTimer);syncTimer=setTimeout(pushCloud,250);}

// Save normal localStorage behaviour, while mirroring Spaceship state to the cloud.
const originalSetItem=localStorage.setItem.bind(localStorage);
localStorage.setItem=function(key,value){originalSetItem(key,value);if(['spaceshipTasks','spaceshipAway','spaceshipName'].includes(key))schedulePush();};

async function pullCloud(){
  try{
    const res=await fetch(SUPABASE_URL+'/rest/v1/spaceship_state?id=eq.'+encodeURIComponent(STATE_ID)+'&select=data,updated_at',{headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}});
    if(!res.ok)return;
    const rows=await res.json();
    if(!rows.length){await pushCloud();return;}
    const cloud=rows[0].data||{};
    if(!cloud.tasks)return;
    syncingFromCloud=true;
    originalSetItem('spaceshipTasks',JSON.stringify(cloud.tasks));
    originalSetItem('spaceshipAway',JSON.stringify(cloud.away||null));
    originalSetItem('spaceshipName',cloud.name||'Captain');
    syncingFromCloud=false;
    // Reload so the main app initialises from the shared state.
    location.reload();
  }catch(e){console.warn('Spaceship sync download failed',e)}
}

window.addEventListener('load',()=>setTimeout(pullCloud,400));
