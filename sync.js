const SUPABASE_URL='https://sbjksyrygbtopfyogois.supabase.co';
const SUPABASE_KEY='sb_publishable_Tx6z9iojGy-ZXzinXjRGkQ_211kjOYZ';
const STATE_ID='main';
let syncingFromCloud=false;
let syncTimer=null;
function cloudHeaders(){return {'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'};}
function localState(){return {tasks:JSON.parse(localStorage.getItem('spaceshipTasks')||'null'),away:JSON.parse(localStorage.getItem('spaceshipAway')||'null'),name:localStorage.getItem('spaceshipName')||'Captain'};}
async function pushCloud(){if(syncingFromCloud)return;try{await fetch(SUPABASE_URL+'/rest/v1/spaceship_state?on_conflict=id',{method:'POST',headers:cloudHeaders(),body:JSON.stringify({id:STATE_ID,data:localState(),updated_at:new Date().toISOString()})});}catch(e){console.warn('Spaceship sync upload failed',e)}}
function schedulePush(){clearTimeout(syncTimer);syncTimer=setTimeout(pushCloud,250);}
const originalSetItem=localStorage.setItem.bind(localStorage);
localStorage.setItem=function(key,value){originalSetItem(key,value);if(['spaceshipTasks','spaceshipAway','spaceshipName'].includes(key))schedulePush();};
function mergeTasks(localTasks,cloudTasks){
  const local=Array.isArray(localTasks)?localTasks:[];
  const cloud=Array.isArray(cloudTasks)?cloudTasks:[];
  const byId=new Map(cloud.map(t=>[String(t.id),t]));
  for(const t of local){
    const c=byId.get(String(t.id));
    if(!c){byId.set(String(t.id),t);continue;}
    const lt=Number(t.lastDone||0),ct=Number(c.lastDone||0);
    if(lt>ct){byId.set(String(t.id),t);continue;}
    if(lt===ct && t.type==='once' && Boolean(t.done)!==Boolean(c.done)) byId.set(String(t.id),t);
  }
  return Array.from(byId.values());
}
async function pullCloud(){try{const res=await fetch(SUPABASE_URL+'/rest/v1/spaceship_state?id=eq.'+encodeURIComponent(STATE_ID)+'&select=data,updated_at',{headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY},cache:'no-store'});if(!res.ok)return;const rows=await res.json();if(!rows.length){await pushCloud();return;}const cloud=rows[0].data||{};if(!cloud.tasks)return;const local=localState();const merged=mergeTasks(local.tasks,cloud.tasks);syncingFromCloud=true;originalSetItem('spaceshipTasks',JSON.stringify(merged));if(cloud.away&&(!local.away||new Date(cloud.away.date||0)>new Date(local.away.date||0)))originalSetItem('spaceshipAway',JSON.stringify(cloud.away));if(cloud.name&&(!local.name||local.name==='Captain'))originalSetItem('spaceshipName',cloud.name);syncingFromCloud=false;await pushCloud();if(typeof render==='function')render();}catch(e){syncingFromCloud=false;console.warn('Spaceship sync download failed',e)}}
window.addEventListener('load',()=>setTimeout(pullCloud,400));
