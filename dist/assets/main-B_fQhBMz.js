(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function r(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function e(t){if(t.ep)return;t.ep=!0;const s=r(t);fetch(t.href,s)}})();const U=864e5,Y=36e5,q=6e4,j=1e3,a={DAY:U,HOUR:Y,MINUTE:q,SECOND:j};function N(n,o={}){var r={zeroBased:!0,...b(),...o},e={},t=null,s=null,i=null;function c(u){const{zeroBased:m}=r;return m?Object.keys(u).reduce((E,S)=>{const R=Number(u[S]);return E[S]=String(R).padStart(2,"0"),E},{}):u}function l(){const{target:u}=e;return u/a.SECOND>=1}function d(){e.target-=a.SECOND,e.seconds>0?e.seconds-=1:e=v(e.target)}function w(){const{onEnd:u,onStep:m}=r;if(!l()){g(),u.call(r,c(e)),s=!0;return}d(),m.call(r,c(e)),i=setTimeout(w,a.SECOND)}function h(u){if(!(!l()||i||s))return w(),t=null,e}function g(){clearTimeout(i),i=null}function A(){return c(e)}function _(){return h()}function P(){return g(),t=e.target,e}function $(){const{onReset:u}=r;return g(),t=null,s=!0,e=v(0),u.call(r,c(e)),e}return function(){const{onInit:m}=r;e=v(n),m.call(r,c(e))}(),{status:A,start:_,stop:P,reset:$}}const f=[{name:"days",value:a.DAY},{name:"hours",value:a.HOUR},{name:"minutes",value:a.MINUTE},{name:"seconds",value:a.SECOND}];function D(n={}){return f.reduce((o,{name:r,value:e})=>Object.prototype.hasOwnProperty.call(n,r)?o+n[r]*e:o,0)}function v(n){var o={};function r(e,t,s=0){var i=f[s].value,c=s+1,l,d;typeof t>"u"&&(t=e/1,o.target=e),l=t/i,d=l>=0?Math.floor(l):0,o[f[s].name]=d,c<f.length&&r(d,t%i,c)}return r(n),o}function b(){return{onInit:()=>{},onStep:()=>{},onReset:()=>{},onEnd:()=>{}}}const H="countdown",F="3.0.0",x="A JavaScript Countdown API",B="module",V={build:"bun test && vite build","build:deploy":"vite build",start:"bunx --bun vite",preview:"vite preview",test:"bun test","test:watch":"bun test --watch"},z="MIT",G={"@biomejs/biome":"^1.9.3","@happy-dom/global-registrator":"^15.7.4","@sinonjs/fake-timers":"^13.0.3",vite:"^5.4.8"},J={type:"git",url:"git+https://github.com/geniemouse/countdown.git"},K={},W="https://github.com/geniemouse/countdown#readme",Z={private:!0,name:H,version:F,description:x,type:B,scripts:V,license:z,devDependencies:G,repository:J,bugs:K,homepage:W};window.APP={VERSION:`v${Z.version}`,API:{countdown:N,calculateCountdown:v,sumMilliseconds:D}};const k=window.APP;function Q(n="",o={}){return Object.entries(o).reduce((r,[e,t])=>r.replace(`\${${e}}`,`${t}`),n)}function M(n,o,r={}){var e={elements:ee(n),...b(),...r};return N(o,{...e,onInit(t){e.onInit.call(e,t),p(e,t)},onStep(t){e.onStep.call(e,t),p(e,t)},onEnd(t){e.onEnd.call(e,t),p(e,t)},onReset(t){e.onReset.call(e,t),p(e,t)}})}const O=["days","hours","minutes","seconds"];function X(n,o){return n.querySelector(`.${o}`)||document.createElement("span")}function ee(n){return O.reduce(function(r,e){return r[e]=X(n,e),r},{})}function te(n,o,r){r&&o!==n&&(r.textContent=o)}function p(n={},o={}){var{elements:r={}}=n,e={};requestAnimationFrame(()=>{O.map(t=>{te(e[t],o[t],r[t])}),e={...o}})}function T(n,o){return function(e={}){n.setAttribute("datetime",Q(o,e))}}document.querySelector("#project_version").innerHTML=`${k.VERSION}`;const I=document.querySelector(".countdown_newyear"),ne=function(){const o=`${new Date().getFullYear()+1}-01-01T00:00:00`;return new Date(o).getTime()-Date.now()}();var C=M(I,ne,{name:"[CountdownUI/New Year's Day]",onInit(n){this.elements.datetime=I.querySelector(".countdown_newyear time[datetime]")},onStep(n){T(this.elements.datetime,"P${days}DT${hours}H${minutes}M${seconds}S")(n)}});console.log("New Year Countdown: ",C);C.start();const y=document.querySelector(".countdown_threeminutes");var L=M(y,D({minutes:3}),{name:"[CountdownUI/3-minutes]",endMessage:"has completed!",onInit(n){this.elements.datetime=y.querySelector(".countdown_threeminutes time[datetime]")},onStep(n){T(this.elements.datetime,"PT${minutes}M${seconds}S")(n)},onEnd(n){document.querySelector(".countdown_threeminutes--status").textContent=` ${this.endMessage}`,console.log(`${this.name} onEnd was called. Three-minute countdown ${this.endMessage}`)}});console.log("Three Minute Countdown: ",L);L.start();
