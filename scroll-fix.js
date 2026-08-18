/* iOS Safari scroll stability: keep bottom navigation in normal document flow. */
(function(){
  function fix(){
    const style=document.createElement('style');
    style.id='scroll-fix-style';
    style.textContent='.tabs{position:static!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}';
    if(!document.getElementById('scroll-fix-style')) document.head.appendChild(style);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fix); else fix();
})();
