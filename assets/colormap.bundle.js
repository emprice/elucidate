var colormap;(()=>{var t,e={594:(t,e,r)=>{"use strict";r.r(e),r.d(e,{default:()=>G});var n=r(8563),o=r.n(n),a=r(5851),i=r(3545),s=r(7318),l=r(9778),u=r(3541),c=r(5401),d=r(6857),p=r(1208),f=r(4231),m=r(5193),h=r(274),v=r(9823),y=r(3093),g=r(6560),b=r(5583),w=r(3354),T=r(7960),x=r(2588),E=r(8987),A=r(3098),k=r(5096),C=r(2332),q=r(3298),S=r(8840),R=r(2685),_=r(6120),U=r(568),P=r(7222),I=r(5103),O=r(6787),H=r(6309),M=r(2317),j=r(1506);function L(t,e){const r=document.createElement("div");return n(r).addClass(e).append(t),r}function D(t,e){const r=document.createElement("button");return n(r).attr("type","button").addClass(["primary","button","icon-button",`md-${e}`]).html(t)}i.q.addToJquery(o()),i.q.rtl=s.bd,i.q.GetYoDigits=s.mO,i.q.transitionend=s.Cp,i.q.RegExpEscape=s.Mw,i.q.onLoad=s.lA,i.q.Box=l.x,i.q.onImagesLoaded=u.Q,i.q.Keyboard=c.N,i.q.MediaQuery=d.z,i.q.Motion=p.y,i.q.Move=p.A,i.q.Nest=f.o,i.q.Timer=j.B,m.X.init(o()),h.K.init(o(),i.q),d.z._init(),i.q.plugin(v.I,"Abide"),i.q.plugin(y.U,"Accordion"),i.q.plugin(g.T,"AccordionMenu"),i.q.plugin(b.H,"Drilldown"),i.q.plugin(w.L,"Dropdown"),i.q.plugin(T.h,"DropdownMenu"),i.q.plugin(x.G,"Equalizer"),i.q.plugin(E.f,"Interchange"),i.q.plugin(A.W,"Magellan"),i.q.plugin(k.h,"OffCanvas"),i.q.plugin(C.q,"Orbit"),i.q.plugin(q.j,"ResponsiveMenu"),i.q.plugin(S.U,"ResponsiveToggle"),i.q.plugin(R.U,"Reveal"),i.q.plugin(_.i,"Slider"),i.q.plugin(U.X,"SmoothScroll"),i.q.plugin(P.L,"Sticky"),i.q.plugin(I.m,"Tabs"),i.q.plugin(O.y,"Toggler"),i.q.plugin(H.u,"Tooltip"),i.q.plugin(M.v,"ResponsiveAccordionTabs");class B{constructor({id:t,luminosity:e,u:r,v:o,color:a}){this.luminosity=e,this.chrominance={u:r,v:o},this.color=a,this.handle=document.createElement("span"),n(this.handle).addClass(["slider-handle","active"]).css({left:100*this.luminosity+"%",transform:`translateX(${-100*this.luminosity}%) translateY(-50%)`,backgroundColor:this.color}).attr({id:`breakpoint${t}-handle`,tabindex:0,role:"button","aria-label":`Breakpoint handle for Y = ${e}`}),this.dropdown=document.createElement("div"),n(this.dropdown).attr({id:`breakpoint${t}-dropdown`,"data-dropdown":"","data-position":"bottom","data-alignment":"center","data-close-on-click":!0,"data-allow-overlap":!0}).addClass("dropdown-pane"),n(this.handle).attr({"data-toggle":n(this.dropdown).attr("id")}),this.swatch=document.createElement("div"),n(this.swatch).addClass("swatch").css({backgroundColor:this.color}).attr({id:n(this.dropdown).attr("id")+"-swatch"});const i=document.createElement("label");n(i).attr({for:n(this.swatch).attr("id")}).html("Swatch");const s=L([i,this.swatch]);this.hexInput=document.createElement("input"),n(this.hexInput).attr({id:n(this.dropdown).attr("id")+"-hex"}).val(a);const l=document.createElement("label");n(l).attr({for:n(this.hexInput).attr("id")}).html("Hex code"),this.set=D("Set","done");const u=L([this.hexInput,this.set]),c=L([l,u],["hex"]);this.delete=D("Delete","delete"),n(this.dropdown).append([s,c,this.delete])}update({luminosity:t,u:e,v:r,color:o}){this.color=o,this.luminosity=t,this.chrominance.u=e,this.chrominance.v=r,n(this.handle).css({left:100*this.luminosity+"%",transform:`translateX(${-100*this.luminosity}%) translateY(-50%)`,backgroundColor:this.color}),n(this.swatch).css({backgroundColor:this.color})}}var z=r(4007),F=r.n(z);function N(t,e){const r=Float64Array.BYTES_PER_ELEMENT;var n=t._malloc(e*r);return{array:new Float64Array(t.HEAPU8.buffer,n,e),ptr:n}}function W(t,e){return function(t,e,r,n){const o=e.BYTES_PER_ELEMENT;var a=t._malloc(n*o);return r.set(new e(n),a/o),{array:r.subarray(a/o,a/o+n),ptr:a}}(t,Uint8Array,t.HEAPU8,e)}function $(t,e,r,o){const a=4*r*o,i=Uint8ClampedArray.BYTES_PER_ELEMENT;var s=t._malloc(a*i);const l=n(e);l.attr({width:r,height:o});const u=l.get(0),c=u.getContext("2d"),d=new Uint8ClampedArray(t.HEAPU8.buffer,s,a);return{image:new ImageData(d,r,o),elem:l,canvas:u,context:c,array:d,ptr:s}}function X(t,e){e.array=null,t._free(e.ptr),e.ptr=0}function Y(t){return"#"+a.Buffer.from(t).toString("hex")}const G=void n(document).ready((()=>{n("#dark-mode-switch").on("change",(function(){const t=n(this).prop("checked");n("html").attr("data-theme",t?"dark":"light")})),window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?(n("#dark-mode-switch").prop("checked",!0),n("html").attr("data-theme","dark")):(n("#dark-mode-switch").prop("checked",!1),n("html").attr("data-theme","light")):(n("#dark-mode-switch").prop("checked",!0),n("html").attr("data-theme","dark")),F()().then((t=>{var e=Number(n("#luminosity-input").val()),r=new Map,o=0;const i=N(t,49152),s=N(t,49152),l=$(t,"#colors",128,128),u=N(t,3),c=N(t,3),d=W(t,3),p=N(t,6144),f=N(t,6144),m=$(t,"#preview",128,16),h=W(t,384);t._sampleUvPlane(e,i.ptr,s.ptr,l.ptr,128,128),l.context.putImageData(l.image,0,0),n("#zoom").css({backgroundColor:"#00000000"}),l.elem.on("mousemove",(r=>{const o=l.elem.width(),a=l.elem.height();u.array[0]=e,u.array[1]=r.offsetX/o,u.array[2]=r.offsetY/a,t._convertCoordToHex(u.ptr,c.ptr,d.ptr),n("#zoom").css({backgroundColor:Y(d.array)})})),l.elem.on("mouseleave",(()=>{n("#zoom").css({backgroundColor:"#00000000"})})),l.elem.on("click",(i=>{const s=l.elem.width(),p=l.elem.height();u.array[0]=e,u.array[1]=i.offsetX/s,u.array[2]=i.offsetY/p,t._convertCoordToHex(u.ptr,c.ptr,d.ptr);const f=Y(d.array);if(r.has(e))r.get(e).update({luminosity:e,u:u.array[1],v:u.array[2],color:f});else{const i=new B({id:o,luminosity:e,u:u.array[1],v:u.array[2],color:f});n("#breakpoints-control").append([i.handle,i.dropdown]),r.set(e,i),o++,n(i.handle).on("click",i,(t=>{n(t.data.handle).hasClass("active")||n("#luminosity-input").val(t.data.luminosity).trigger("change")})),n(i.set).on("click",i,(e=>{const o=e.data;var i=n(o.hexInput).val();d.array.set(a.Buffer.from(i.slice(1),"hex")),t._convertHexToUv(d.ptr,c.ptr,u.ptr),u.array[0]=Number(u.array[0].toFixed(2)),t._convertUvToHex(u.ptr,c.ptr,d.ptr),i=Y(d.array),r.delete(o.luminosity),o.update({luminosity:u.array[0],u:u.array[1],v:u.array[2],color:i}),n(o.hexInput).val(i),r.set(u.array[0],o),n("#luminosity-input").val(o.luminosity).trigger("change")})),n(i.delete).on("click",i,(t=>{const e=t.data;n(e.dropdown).remove(),n(e.handle).remove(),r.delete(e.luminosity)})),n(i.handle).foundation(),n(i.dropdown).foundation()}})),n("#luminosity-control").on("moved.zf.slider",(r=>{e=Number(n("#luminosity-input").val()),t._sampleUvPlane(e,i.ptr,s.ptr,l.ptr,128,128),l.context.putImageData(l.image,0,0),n("#breakpoints-control .slider-handle").removeClass("active")})).on("changed.zf.slider",(t=>{if(e=Number(n("#luminosity-input").val()),r.has(e)){const t=r.get(e);n(t.handle).hasClass("active")||(n("#breakpoints-control .slider-handle").removeClass("active"),n(t.handle).addClass("active"))}})),n("#interpolate-button").on("click",(e=>{if(r.size<2)n("#breakpoints-label").foundation("show");else{const e=Array.from(r.values()).toSorted(((t,e)=>t.luminosity-e.luminosity)),o=e.length,i=N(t,o),s=N(t,o),l=N(t,o);e.forEach(((t,e)=>{i.array[e]=t.luminosity,s.array[e]=t.chrominance.u,l.array[e]=t.chrominance.v})),t._sampleColormap(i.ptr,s.ptr,l.ptr,o,p.ptr,f.ptr,h.ptr,m.ptr,128,16),m.context.putImageData(m.image,0,0),m.elem.css({visibility:"visible"});const u=function(t,e){const r=a.Buffer.from(t);for(var n=0,o=[];n<384;)o.push("#"+r.toString("hex",n,n+3)),n+=3;return o}(h.array),c=JSON.stringify(u),d=`import json\nfrom matplotlib.colors import LinearSegmentedColormap\nclist = json.loads('${c}')\ncmap = LinearSegmentedColormap.from_list('custom', clist)`,v=`data:text/plain;base64,${btoa(c)}`;n("#get-json-button").attr({href:v}).removeClass("disabled").removeAttr("aria-disabled");const y=`data:text/plain;base64,${btoa(d)}`;n("#get-python-button").attr({href:y}).removeClass("disabled").removeAttr("aria-disabled");const g=n("#preview").get(0).toDataURL("image/png");n("#get-image-button").attr({href:g}).removeClass("disabled").removeAttr("aria-disabled"),X(t,i),X(t,s),X(t,l)}n(e.target).trigger("blur")})),l.elem.on("click",(t=>{n("#breakpoints-label").foundation("hide")})),n("#luminosity-control").on("moved.zf.slider",(t=>{n("#breakpoints-label").foundation("hide")})),n("#grayscale-button").on("click",(t=>{l.elem.toggleClass("grayscale"),m.elem.toggleClass("grayscale"),n(t.target).trigger("blur")})),n(window).on("unload",(()=>{X(t,i),X(t,s),X(t,l),X(t,u),X(t,c),X(t,d),X(t,p),X(t,f),X(t,m),X(t,h)}))})),n(document).foundation()}))},4007:(t,e,r)=>{var n,o=r(2790),a=(n=(n="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(t={}){var e,a,i=t;i.ready=new Promise(((t,r)=>{e=t,a=r}));var s,l,u,c=Object.assign({},i),d="object"==typeof window,p="function"==typeof importScripts,f="object"==typeof o&&"object"==typeof o.versions&&"string"==typeof o.versions.node,m="";if(f){var h=r(4392),v=r(1117);m=p?v.dirname(m)+"/":"//",s=(t,e)=>(t=H(t)?new URL(t):v.normalize(t),h.readFileSync(t,e?void 0:"utf8")),u=t=>{var e=s(t,!0);return e.buffer||(e=new Uint8Array(e)),e},l=(t,e,r,n=!0)=>{t=H(t)?new URL(t):v.normalize(t),h.readFile(t,n?void 0:"utf8",((t,o)=>{t?r(t):e(n?o.buffer:o)}))},!i.thisProgram&&o.argv.length>1&&o.argv[1].replace(/\\/g,"/"),o.argv.slice(2),i.inspect=()=>"[Emscripten Module object]"}else(d||p)&&(p?m=self.location.href:"undefined"!=typeof document&&document.currentScript&&(m=document.currentScript.src),n&&(m=n),m=0!==m.indexOf("blob:")?m.substr(0,m.replace(/[?#].*/,"").lastIndexOf("/")+1):"",s=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.send(null),e.responseText},p&&(u=t=>{var e=new XMLHttpRequest;return e.open("GET",t,!1),e.responseType="arraybuffer",e.send(null),new Uint8Array(e.response)}),l=(t,e,r)=>{var n=new XMLHttpRequest;n.open("GET",t,!0),n.responseType="arraybuffer",n.onload=()=>{200==n.status||0==n.status&&n.response?e(n.response):r()},n.onerror=r,n.send(null)});var y,g,b=i.print||console.log.bind(console),w=i.printErr||console.error.bind(console);Object.assign(i,c),c=null,i.arguments&&i.arguments,i.thisProgram&&i.thisProgram,i.quit&&i.quit,i.wasmBinary&&(y=i.wasmBinary),i.noExitRuntime,"object"!=typeof WebAssembly&&U("no native wasm support detected");var T,x,E=!1;function A(){var t=g.buffer;i.HEAP8=new Int8Array(t),i.HEAP16=new Int16Array(t),i.HEAP32=new Int32Array(t),i.HEAPU8=T=new Uint8Array(t),i.HEAPU16=new Uint16Array(t),i.HEAPU32=x=new Uint32Array(t),i.HEAPF32=new Float32Array(t),i.HEAPF64=new Float64Array(t)}var k=[],C=[],q=[],S=0,R=null,_=null;function U(t){i.onAbort&&i.onAbort(t),w(t="Aborted("+t+")"),E=!0,t+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(t);throw a(e),e}var P,I;function O(t){return t.startsWith("data:application/octet-stream;base64,")}function H(t){return t.startsWith("file://")}function M(t){try{if(t==P&&y)return new Uint8Array(y);if(u)return u(t);throw"both async and sync fetching of the wasm failed"}catch(t){U(t)}}function j(t,e,r){return function(t){if(!y&&(d||p)){if("function"==typeof fetch&&!H(t))return fetch(t,{credentials:"same-origin"}).then((e=>{if(!e.ok)throw"failed to load wasm binary file at '"+t+"'";return e.arrayBuffer()})).catch((()=>M(t)));if(l)return new Promise(((e,r)=>{l(t,(t=>e(new Uint8Array(t))),r)}))}return Promise.resolve().then((()=>M(t)))}(t).then((t=>WebAssembly.instantiate(t,e))).then((t=>t)).then(r,(t=>{w("failed to asynchronously prepare wasm: "+t),U(t)}))}O(P="tristimulus.bin.wasm")||(I=P,P=i.locateFile?i.locateFile(I,m):m+I);var L,D=t=>{for(;t.length>0;)t.shift()(i)},B=t=>{var e=t-g.buffer.byteLength+65535>>>16;try{return g.grow(e),A(),1}catch(t){}},z="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0,F=(t,e,r)=>{for(var n=e+r,o=e;t[o]&&!(o>=n);)++o;if(o-e>16&&t.buffer&&z)return z.decode(t.subarray(e,o));for(var a="";e<o;){var i=t[e++];if(128&i){var s=63&t[e++];if(192!=(224&i)){var l=63&t[e++];if((i=224==(240&i)?(15&i)<<12|s<<6|l:(7&i)<<18|s<<12|l<<6|63&t[e++])<65536)a+=String.fromCharCode(i);else{var u=i-65536;a+=String.fromCharCode(55296|u>>10,56320|1023&u)}}else a+=String.fromCharCode((31&i)<<6|s)}else a+=String.fromCharCode(i)}return a},N=[null,[],[]],W={b:()=>{U("")},f:(t,e,r)=>T.copyWithin(t,e,e+r),d:t=>{var e=T.length,r=2147483648;if((t>>>=0)>r)return!1;for(var n,o=1;o<=4;o*=2){var a=e*(1+.2/o);a=Math.min(a,t+100663296);var i=Math.min(r,(n=Math.max(t,a))+(65536-n%65536)%65536);if(B(i))return!0}return!1},e:t=>52,c:(t,e,r,n,o)=>70,a:(t,e,r,n)=>{for(var o,a,i,s=0,l=0;l<r;l++){var u=x[e>>2],c=x[e+4>>2];e+=8;for(var d=0;d<c;d++)o=t,a=T[u+d],i=void 0,i=N[o],0===a||10===a?((1===o?b:w)(F(i,0)),i.length=0):i.push(a);s+=c}return x[n>>2]=s,0}};function $(){function t(){L||(L=!0,i.calledRun=!0,E||(D(C),e(i),i.onRuntimeInitialized&&i.onRuntimeInitialized(),function(){if(i.postRun)for("function"==typeof i.postRun&&(i.postRun=[i.postRun]);i.postRun.length;)t=i.postRun.shift(),q.unshift(t);var t;D(q)}()))}S>0||(function(){if(i.preRun)for("function"==typeof i.preRun&&(i.preRun=[i.preRun]);i.preRun.length;)t=i.preRun.shift(),k.unshift(t);var t;D(k)}(),S>0||(i.setStatus?(i.setStatus("Running..."),setTimeout((function(){setTimeout((function(){i.setStatus("")}),1),t()}),1)):t()))}if(function(){var t,e,r,n,o={a:W};function s(t,e){var r,n=t.exports;return i.asm=n,g=i.asm.g,A(),i.asm.j,r=i.asm.h,C.unshift(r),function(t){if(S--,i.monitorRunDependencies&&i.monitorRunDependencies(S),0==S&&(null!==R&&(clearInterval(R),R=null),_)){var e=_;_=null,e()}}(),n}if(S++,i.monitorRunDependencies&&i.monitorRunDependencies(S),i.instantiateWasm)try{return i.instantiateWasm(o,s)}catch(t){w("Module.instantiateWasm callback failed with error: "+t),a(t)}(t=y,e=P,r=o,n=function(t){s(t.instance)},t||"function"!=typeof WebAssembly.instantiateStreaming||O(e)||H(e)||f||"function"!=typeof fetch?j(e,r,n):fetch(e,{credentials:"same-origin"}).then((t=>WebAssembly.instantiateStreaming(t,r).then(n,(function(t){return w("wasm streaming compile failed: "+t),w("falling back to ArrayBuffer instantiation"),j(e,r,n)}))))).catch(a)}(),i._convertHexToUv=function(){return(i._convertHexToUv=i.asm.i).apply(null,arguments)},i._convertUvToHex=function(){return(i._convertUvToHex=i.asm.k).apply(null,arguments)},i._convertCoordToHex=function(){return(i._convertCoordToHex=i.asm.l).apply(null,arguments)},i._sampleUvPlane=function(){return(i._sampleUvPlane=i.asm.m).apply(null,arguments)},i._sampleColormap=function(){return(i._sampleColormap=i.asm.n).apply(null,arguments)},i._malloc=function(){return(i._malloc=i.asm.o).apply(null,arguments)},i._free=function(){return(i._free=i.asm.p).apply(null,arguments)},_=function t(){L||$(),L||(_=t)},i.preInit)for("function"==typeof i.preInit&&(i.preInit=[i.preInit]);i.preInit.length>0;)i.preInit.pop()();return $(),t.ready});t.exports=a},2790:t=>{var e,r,n=t.exports={};function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}function i(t){if(e===setTimeout)return setTimeout(t,0);if((e===o||!e)&&setTimeout)return e=setTimeout,setTimeout(t,0);try{return e(t,0)}catch(r){try{return e.call(null,t,0)}catch(r){return e.call(this,t,0)}}}!function(){try{e="function"==typeof setTimeout?setTimeout:o}catch(t){e=o}try{r="function"==typeof clearTimeout?clearTimeout:a}catch(t){r=a}}();var s,l=[],u=!1,c=-1;function d(){u&&s&&(u=!1,s.length?l=s.concat(l):c=-1,l.length&&p())}function p(){if(!u){var t=i(d);u=!0;for(var e=l.length;e;){for(s=l,l=[];++c<e;)s&&s[c].run();c=-1,e=l.length}s=null,u=!1,function(t){if(r===clearTimeout)return clearTimeout(t);if((r===a||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(t);try{return r(t)}catch(e){try{return r.call(null,t)}catch(e){return r.call(this,t)}}}(t)}}function f(t,e){this.fun=t,this.array=e}function m(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];l.push(new f(t,e)),1!==l.length||u||i(p)},f.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=m,n.addListener=m,n.once=m,n.off=m,n.removeListener=m,n.removeAllListeners=m,n.emit=m,n.prependListener=m,n.prependOnceListener=m,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0}},2389:()=>{},1779:(t,e,r)=>{"use strict";t.exports=r.p+"assets/tristimulus.bin.wasm"},4234:(t,e,r)=>{"use strict";t.exports=r.p+"favicon.ico"},4392:()=>{},1117:()=>{}},r={};function n(t){var o=r[t];if(void 0!==o)return o.exports;var a=r[t]={exports:{}};return e[t].call(a.exports,a,a.exports,n),a.exports}n.m=e,t=[],n.O=(e,r,o,a)=>{if(!r){var i=1/0;for(c=0;c<t.length;c++){for(var[r,o,a]=t[c],s=!0,l=0;l<r.length;l++)(!1&a||i>=a)&&Object.keys(n.O).every((t=>n.O[t](r[l])))?r.splice(l--,1):(s=!1,a<i&&(i=a));if(s){t.splice(c--,1);var u=o();void 0!==u&&(e=u)}}return e}a=a||0;for(var c=t.length;c>0&&t[c-1][2]>a;c--)t[c]=t[c-1];t[c]=[r,o,a]},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t;n.g.importScripts&&(t=n.g.location+"");var e=n.g.document;if(!t&&e&&(e.currentScript&&(t=e.currentScript.src),!t)){var r=e.getElementsByTagName("script");if(r.length)for(var o=r.length-1;o>-1&&!t;)t=r[o--].src}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=t+"../"})(),(()=>{var t={889:0,561:0};n.O.j=e=>0===t[e];var e=(e,r)=>{var o,a,[i,s,l]=r,u=0;if(i.some((e=>0!==t[e]))){for(o in s)n.o(s,o)&&(n.m[o]=s[o]);if(l)var c=l(n)}for(e&&e(r);u<i.length;u++)a=i[u],n.o(t,a)&&t[a]&&t[a][0](),t[a]=0;return n.O(c)},r=self.webpackChunkelucidate=self.webpackChunkelucidate||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))})(),n.O(void 0,[99,561,821],(()=>n(4234))),n.O(void 0,[99,561,821],(()=>n(1779))),n.O(void 0,[99,561,821],(()=>n(1593))),n.O(void 0,[99,561,821],(()=>n(2389)));var o=n.O(void 0,[99,561,821],(()=>n(594)));o=n.O(o),colormap=o})();