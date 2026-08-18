const CACHE='spaceship-you-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./delete.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(r=>{
      if(e.request.mode==='navigate'){
        return r.text().then(text=>{
          const injected=text.replace('</body>','<script src="./delete.js"></script></body>');
          const response=new Response(injected,{status:r.status,statusText:r.statusText,headers:r.headers});
          caches.open(CACHE).then(c=>c.put(e.request,response.clone()));
          return response;
        });
      }
      const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;
    }).catch(()=>caches.match('./index.html'));
  }));
});
