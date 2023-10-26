var mathml;(()=>{"use strict";var e,t,n,r,i,o={6698:(e,t,n)=>{n.r(t),n.d(t,{default:()=>z});var r=n(8563),i=n.n(r),o=n(3545),a=n(7318),s=n(9778),c=n(3541),l=n(5401),d=n(6857),u=n(1208),p=n(4231),h=n(5193),m=n(274),g=n(9823),f=n(3093),v=n(6560),b=n(5583),w=n(3354),y=n(7960),q=n(2588),k=n(8987),O=n(3098),T=n(5096),j=n(2332),M=n(3298),E=n(8840),$=n(2685),x=n(6120),S=n(568),A=n(7222),R=n(5103),L=n(6787),_=n(6309),C=n(2317),P=n(1506);function H(e,t,n){e.typesetRoot=n.createElement("mjx-container"),e.typesetRoot.innerHTML=t.visitTree(e.root,n),e.display&&e.typesetRoot.setAttribute("display","block")}o.q.addToJquery(i()),o.q.rtl=a.bd,o.q.GetYoDigits=a.mO,o.q.transitionend=a.Cp,o.q.RegExpEscape=a.Mw,o.q.onLoad=a.lA,o.q.Box=s.x,o.q.onImagesLoaded=c.Q,o.q.Keyboard=l.N,o.q.MediaQuery=d.z,o.q.Motion=u.y,o.q.Move=u.A,o.q.Nest=p.o,o.q.Timer=P.B,h.X.init(i()),m.K.init(i(),o.q),d.z._init(),o.q.plugin(g.I,"Abide"),o.q.plugin(f.U,"Accordion"),o.q.plugin(v.T,"AccordionMenu"),o.q.plugin(b.H,"Drilldown"),o.q.plugin(w.L,"Dropdown"),o.q.plugin(y.h,"DropdownMenu"),o.q.plugin(q.G,"Equalizer"),o.q.plugin(k.f,"Interchange"),o.q.plugin(O.W,"Magellan"),o.q.plugin(T.h,"OffCanvas"),o.q.plugin(j.q,"Orbit"),o.q.plugin(M.j,"ResponsiveMenu"),o.q.plugin(E.U,"ResponsiveToggle"),o.q.plugin($.U,"Reveal"),o.q.plugin(x.i,"Slider"),o.q.plugin(S.X,"SmoothScroll"),o.q.plugin(A.L,"Sticky"),o.q.plugin(R.m,"Tabs"),o.q.plugin(L.y,"Toggler"),o.q.plugin(_.u,"Tooltip"),o.q.plugin(C.v,"ResponsiveAccordionTabs");const z=void r(document).ready((async()=>{r("#font-size-control").on("moved.zf.slider",(function(e){const t=r(e.currentTarget).find("input").first().val().toString()+"rem";r(":root").css("--base-font-size",t)})),r("#dark-mode-switch").on("change",(function(){const e=r(this).prop("checked");r("html").attr("data-theme",e?"dark":"light")})),window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?(r("#dark-mode-switch").prop("checked",!0),r("html").attr("data-theme","dark")):(r("#dark-mode-switch").prop("checked",!1),r("html").attr("data-theme","light")):(r("#dark-mode-switch").prop("checked",!0),r("html").attr("data-theme","dark"));const e=await async function(){const{EditorState:e}=await n.e(528).then(n.bind(n,802)),{EditorView:t,keymap:r}=await n.e(528).then(n.bind(n,9619)),{defaultKeymap:i,historyKeymap:o,history:a}=await n.e(528).then(n.bind(n,7412)),{html:s}=await n.e(528).then(n.bind(n,9029)),{classHighlighter:c}=await n.e(528).then(n.bind(n,7550)),{syntaxHighlighting:l}=await n.e(528).then(n.bind(n,3734)),d=document.getElementById("editor"),u=document.getElementById("output"),p=document.getElementById("render"),h=t.theme({"&":{height:"100%"},".cm-scroller":{overflow:"scroll"}});let m=e.create({doc:"$$ a^2 + b^2 = c^2 $$",extensions:[a(),r.of([...i,...o]),t.lineWrapping,t.editable.of(!0),h]}),g=new t({state:m,parent:d});const f=[s(),l(c),t.lineWrapping,t.editable.of(!1),h];return{elements:{input:d,output:u,render:p},views:{input:g,output:new t({state:e.create({doc:"",extensions:f}),parent:u})},htmlExtensions:f}}(),t=await async function(){const{SerializedMmlVisitor:e}=await n.e(684).then(n.t.bind(n,9996,23)),{HTMLAdaptor:t}=await n.e(684).then(n.t.bind(n,8771,23)),{RegisterHTMLHandler:r}=await n.e(684).then(n.bind(n,8780)),{TeX:i}=await n.e(684).then(n.t.bind(n,6380,23));return await n.e(684).then(n.t.bind(n,7732,23)),await n.e(684).then(n.t.bind(n,8445,23)),r(new t(window)),{visitor:new e,inputJax:new i({packages:{"[+]":["ams","boldsymbol"]},inlineMath:[["$","$"],["\\(","\\)"]],displayMath:[["$$","$$"],["\\[","\\]"]],processEscapes:!1,processEnvironments:!0,processRefs:!1})}}();await async function(e,t){const{mathjax:i}=await n.e(684).then(n.bind(n,461));r("#render-button").on("click",(n=>{var o=e.views.input.state.sliceDoc();if(0==o.length)return void r(n.target).trigger("blur");-1==o.search(/(\$\$).+\1|(\$)[^\$]+?\2|\\\[.+\\\]|\\\(.+\\\)/)&&(o=`$$ ${o} $$`);const a=document.createElement("span");a.innerHTML=o;const s=i.document(a,{InputJax:t.inputJax,renderActions:{assistiveMml:[],typeset:[150,e=>{for(let n of e.math)H(n,t.visitor,document)},(e,n)=>{H(e,t.visitor,document)}]}});s.render(),e.elements.render.replaceChildren();var c="";for(let t of s.math)c+=t.typesetRoot.innerHTML+"\n",e.elements.render.appendChild(t.typesetRoot);e.views.output.dispatch({changes:[{from:0,to:e.views.output.state.doc.length},{from:0,insert:c}]}),r(n.target).trigger("blur")}))}(e,t),function(e){r("#copy-button").on("click",{cm:e},(e=>{const t=e.data.cm.views.output.state.sliceDoc();navigator.clipboard.writeText(t).then((()=>{r(e.target).trigger("blur")}))}))}(e),r(document).foundation()}))},1421:()=>{},4234:(e,t,n)=>{e.exports=n.p+"favicon.ico"}},a={};function s(e){var t=a[e];if(void 0!==t)return t.exports;var n=a[e]={exports:{}};return o[e].call(n.exports,n,n.exports,s),n.exports}s.m=o,e=[],s.O=(t,n,r,i)=>{if(!n){var o=1/0;for(d=0;d<e.length;d++){for(var[n,r,i]=e[d],a=!0,c=0;c<n.length;c++)(!1&i||o>=i)&&Object.keys(s.O).every((e=>s.O[e](n[c])))?n.splice(c--,1):(a=!1,i<o&&(o=i));if(a){e.splice(d--,1);var l=r();void 0!==l&&(t=l)}}return t}i=i||0;for(var d=e.length;d>0&&e[d-1][2]>i;d--)e[d]=e[d-1];e[d]=[n,r,i]},s.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return s.d(t,{a:t}),t},n=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,s.t=function(e,r){if(1&r&&(e=this(e)),8&r)return e;if("object"==typeof e&&e){if(4&r&&e.__esModule)return e;if(16&r&&"function"==typeof e.then)return e}var i=Object.create(null);s.r(i);var o={};t=t||[null,n({}),n([]),n(n)];for(var a=2&r&&e;"object"==typeof a&&!~t.indexOf(a);a=n(a))Object.getOwnPropertyNames(a).forEach((t=>o[t]=()=>e[t]));return o.default=()=>e,s.d(i,o),i},s.d=(e,t)=>{for(var n in t)s.o(t,n)&&!s.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},s.f={},s.e=e=>Promise.all(Object.keys(s.f).reduce(((t,n)=>(s.f[n](e,t),t)),[])),s.u=e=>528===e?"assets/dynamic-mathml~workspace-codemirror.js":684===e?"assets/dynamic-mathml~workspace-mathjax.js":void 0,s.miniCssF=e=>{},s.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r={},i="elucidate:",s.l=(e,t,n,o)=>{if(r[e])r[e].push(t);else{var a,c;if(void 0!==n)for(var l=document.getElementsByTagName("script"),d=0;d<l.length;d++){var u=l[d];if(u.getAttribute("src")==e||u.getAttribute("data-webpack")==i+n){a=u;break}}a||(c=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,s.nc&&a.setAttribute("nonce",s.nc),a.setAttribute("data-webpack",i+n),a.src=e),r[e]=[t];var p=(t,n)=>{a.onerror=a.onload=null,clearTimeout(h);var i=r[e];if(delete r[e],a.parentNode&&a.parentNode.removeChild(a),i&&i.forEach((e=>e(n))),t)return t(n)},h=setTimeout(p.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=p.bind(null,a.onerror),a.onload=p.bind(null,a.onload),c&&document.head.appendChild(a)}},s.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.j=540,(()=>{var e;s.g.importScripts&&(e=s.g.location+"");var t=s.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var n=t.getElementsByTagName("script");if(n.length)for(var r=n.length-1;r>-1&&!e;)e=n[r--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),s.p=e+"../"})(),(()=>{var e={540:0,561:0};s.f.j=(t,n)=>{var r=s.o(e,t)?e[t]:void 0;if(0!==r)if(r)n.push(r[2]);else if(561!=t){var i=new Promise(((n,i)=>r=e[t]=[n,i]));n.push(r[2]=i);var o=s.p+s.u(t),a=new Error;s.l(o,(n=>{if(s.o(e,t)&&(0!==(r=e[t])&&(e[t]=void 0),r)){var i=n&&("load"===n.type?"missing":n.type),o=n&&n.target&&n.target.src;a.message="Loading chunk "+t+" failed.\n("+i+": "+o+")",a.name="ChunkLoadError",a.type=i,a.request=o,r[1](a)}}),"chunk-"+t,t)}else e[t]=0},s.O.j=t=>0===e[t];var t=(t,n)=>{var r,i,[o,a,c]=n,l=0;if(o.some((t=>0!==e[t]))){for(r in a)s.o(a,r)&&(s.m[r]=a[r]);if(c)var d=c(s)}for(t&&t(n);l<o.length;l++)i=o[l],s.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return s.O(d)},n=self.webpackChunkelucidate=self.webpackChunkelucidate||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})(),s.O(void 0,[99,561],(()=>s(4234))),s.O(void 0,[99,561],(()=>s(3909))),s.O(void 0,[99,561],(()=>s(1421)));var c=s.O(void 0,[99,561],(()=>s(6698)));c=s.O(c),mathml=c})();