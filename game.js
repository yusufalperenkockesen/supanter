(function(){
const Q=window.GQ||[];const CATS=['Karışık','Edebiyat','Türk Dili','Eğitim Bilimleri','Mevzuat','Genel Kültür'];
const ROUND=10,TIME=20,LIVES=3;let st=null,timer=null,cat='Karışık';
const best=()=>{try{return +localStorage.getItem('supanter.best')||0}catch(e){return 0}};
const setBest=v=>{try{localStorage.setItem('supanter.best',v)}catch(e){}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function el(){let g=document.getElementById('game');if(!g){g=document.createElement('div');g.id='game';document.body.appendChild(g)}return g}
function close(){clearInterval(timer);const g=document.getElementById('game');if(g)g.remove();document.body.classList.remove('gaming')}
function menu(){clearInterval(timer);document.body.classList.add('gaming');const g=el();
const cnt=c=>c==='Karışık'?Q.length:Q.filter(q=>q.c===c).length;
g.innerHTML=`<div class="gw"><button class="gx" data-a="close" aria-label="Kapat">✕</button>
<div class="glogo">SuPanter<b>Oyun</b></div><p class="gsub">Sınav tarzında sorular. 10 soru, 3 can, her soru için ${TIME} saniye. Art arda doğrular puanını katlar.</p>
<div class="gbest">En yüksek puan <b>${best()}</b></div>
<div class="glabel">Kategori seç</div><div class="gcats">${CATS.map(c=>`<button class="gcat ${c===cat?'on':''}" data-c="${esc(c)}"><span>${esc(c)}</span><small>${cnt(c)} soru</small></button>`).join('')}</div>
<button class="gstart" data-a="start">Başla</button><p class="gnote">Sorular geçmiş sınavların konu ve tarzından esinlenerek özgün olarak yazılmıştır.</p></div>`;
g.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.c){cat=b.dataset.c;menu()}else if(b.dataset.a==='close')close();else if(b.dataset.a==='start')start()}}
function start(){const pool=cat==='Karışık'?Q:Q.filter(q=>q.c===cat);st={qs:shuffle(pool).slice(0,ROUND),i:0,score:0,lives:LIVES,streak:0,ok:0,wrong:[]};ask()}
function ask(){const g=el(),q=st.qs[st.i];const order=shuffle(q.a.map((t,k)=>k));st.order=order;st.t=TIME;st.locked=false;
g.innerHTML=`<div class="gw play"><div class="gtop"><button class="gx" data-a="menu" aria-label="Menü">‹</button><div class="glives">${'♥'.repeat(st.lives)}<i>${'♥'.repeat(LIVES-st.lives)}</i></div><div class="gscore">${st.score}</div></div>
<div class="gprog"><i style="width:${st.i/st.qs.length*100}%"></i></div>
<div class="gmeta"><span>${st.i+1} / ${st.qs.length} · ${esc(q.c)}</span>${st.streak>=2?`<span class="gstreak">${st.streak} seri 🔥</span>`:''}</div>
<div class="gq">${esc(q.q)}</div>
<div class="gopts">${order.map((k,n)=>`<button class="gopt" data-k="${k}"><b>${'ABCDE'[n]}</b><span>${esc(q.a[k])}</span></button>`).join('')}</div>
<div class="gtime"><i id="gbar"></i></div><div id="gfb"></div></div>`;
g.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.a==='menu')menu();else if(b.dataset.k!==undefined)answer(+b.dataset.k);else if(b.dataset.a==='next')next()};
clearInterval(timer);const bar=()=>{const x=document.getElementById('gbar');if(x){x.style.width=(st.t/TIME*100)+'%';x.classList.toggle('low',st.t<=5)}};bar();
timer=setInterval(()=>{st.t=Math.max(0,st.t-0.1);bar();if(st.t<=0){clearInterval(timer);answer(-1)}},100)}
function answer(k){if(st.locked)return;st.locked=true;clearInterval(timer);const q=st.qs[st.i],ok=k===q.d;
document.querySelectorAll('.gopt').forEach(b=>{const v=+b.dataset.k;b.disabled=true;if(v===q.d)b.classList.add('ok');else if(v===k)b.classList.add('no')});
let gain=0;if(ok){st.streak++;st.ok++;const mult=st.streak>=5?2:st.streak>=3?1.5:1;gain=Math.round((100+Math.round(st.t)*5)*mult);st.score+=gain}else{st.streak=0;st.lives--;st.wrong.push(q)}
const fb=document.getElementById('gfb');const last=st.i===st.qs.length-1||st.lives<=0;
fb.innerHTML=`<div class="gfb ${ok?'good':'bad'}"><b>${ok?'Doğru! +'+gain:(k===-1?'Süre doldu':'Yanlış')}</b><p>${esc(q.e)}</p><button class="gnext" data-a="next">${last?'Sonucu gör':'Sonraki soru'}</button></div>`;
document.querySelector('.gscore').textContent=st.score;document.querySelector('.glives').innerHTML='♥'.repeat(st.lives)+'<i>'+'♥'.repeat(LIVES-st.lives)+'</i>';
fb.scrollIntoView({behavior:'smooth',block:'nearest'})}
function next(){if(st.lives<=0||st.i>=st.qs.length-1)return end();st.i++;ask()}
function end(){const g=el(),b=best(),rec=st.score>b;if(rec)setBest(st.score);const n=st.qs.length;
const msg=st.lives<=0?'Canların bitti ama bilgi kaldı. Bir daha!':st.ok===n?'Kusursuz! Simge, bu konu sende.':st.ok>=n*0.7?'Çok iyi! Az kaldı.':'Tekrar zamanı, notlara bir göz at.';
g.innerHTML=`<div class="gw end"><div class="glogo">SuPanter<b>Oyun</b></div>${rec?'<div class="grec">Yeni rekor!</div>':''}
<div class="gbig">${st.score}</div><div class="gsub">${st.ok} doğru · ${st.wrong.length} yanlış</div><p class="gmsg">${msg}</p>
${st.wrong.length?`<div class="glabel">Tekrar etmen gerekenler</div><div class="gwr">${st.wrong.map(q=>`<div><b>${esc(q.a[q.d])}</b><span>${esc(q.e)}</span></div>`).join('')}</div>`:''}
<button class="gstart" data-a="again">Tekrar oyna</button><button class="gsec" data-a="menu">Kategori değiştir</button><button class="gsec" data-a="close">Notlara dön</button></div>`;
g.onclick=e=>{const x=e.target.closest('button');if(!x)return;if(x.dataset.a==='again')start();else if(x.dataset.a==='menu')menu();else if(x.dataset.a==='close')close()}}
window.openGame=menu;
})();
