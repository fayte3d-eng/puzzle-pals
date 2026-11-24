/* Puzzle Pals offline helper: keeps the game and everything it has loaded so it works without internet */
const V='pp-1.1.1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icons/icon-192.png'])).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='pp-assets-1.1.1').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  const same=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.host);if(!same&&!font)return;
  if(r.mode==='navigate'||(same&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(same&&r.mode==='navigate'?'index.html':r,c))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));return}
  if(r.headers.get('range'))return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res})))});
