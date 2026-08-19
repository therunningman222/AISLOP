const CACHE='spaceship-you-v16';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./delete.js','./sync.js','./decay.js','./edit.js','./cloud-save.js','./sort.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{const text=await r.text();const patched=text.replace('</body>','<script src="./sort.js"></script></body>');return new Response(patched,{status:r.status,statusText:r.statusText,headers:r.headers})}).catch(()=>caches.match('./index.html')));return}
// App code must not be allowed to remain stale while we are testing cloud sync.
e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok)return r;throw new Error('network response '+r.status)}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
