var main;(()=>{"use strict";var e,t={4117:(e,t,r)=>{r.r(t),r.d(t,{default:()=>a});var o=r(8563);r(6687);const a=void o(document).ready((()=>{o("#font-size-control").on("moved.zf.slider",(function(e){const t=o(e.currentTarget).find("input").first().val().toString()+"rem";o(":root").css("--base-font-size",t)})),o("#dark-mode-switch").on("change",(function(){const e=o(this).prop("checked");o("html").attr("data-theme",e?"dark":"light")})),window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?(o("#dark-mode-switch").prop("checked",!0),o("html").attr("data-theme","dark")):(o("#dark-mode-mwitch").prop("checked",!1),o("html").attr("data-theme","light")):(o("#dark-mode-switch").prop("checked",!0),o("html").attr("data-theme","dark")),o(document).foundation()}))},233:()=>{},5799:(e,t,r)=>{e.exports=r.p+"assets/images-elucidate_dark.svg"},4234:(e,t,r)=>{e.exports=r.p+"favicon.ico"},1206:(e,t,r)=>{e.exports=r.p+"assets/images-elucidate_light.svg"}},r={};function o(e){var a=r[e];if(void 0!==a)return a.exports;var i=r[e]={exports:{}};return t[e].call(i.exports,i,i.exports,o),i.exports}o.m=t,e=[],o.O=(t,r,a,i)=>{if(!r){var n=1/0;for(l=0;l<e.length;l++){for(var[r,a,i]=e[l],c=!0,d=0;d<r.length;d++)(!1&i||n>=i)&&Object.keys(o.O).every((e=>o.O[e](r[d])))?r.splice(d--,1):(c=!1,i<n&&(n=i));if(c){e.splice(l--,1);var s=a();void 0!==s&&(t=s)}}return t}i=i||0;for(var l=e.length;l>0&&e[l-1][2]>i;l--)e[l]=e[l-1];e[l]=[r,a,i]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;o.g.importScripts&&(e=o.g.location+"");var t=o.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");if(r.length)for(var a=r.length-1;a>-1&&!e;)e=r[a--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=e+"../"})(),(()=>{var e={179:0,490:0};o.O.j=t=>0===e[t];var t=(t,r)=>{var a,i,[n,c,d]=r,s=0;if(n.some((t=>0!==e[t]))){for(a in c)o.o(c,a)&&(o.m[a]=c[a]);if(d)var l=d(o)}for(t&&t(r);s<n.length;s++)i=n[s],o.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return o.O(l)},r=self.webpackChunkelucidate=self.webpackChunkelucidate||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),o.O(void 0,[715,490],(()=>o(4234))),o.O(void 0,[715,490],(()=>o(1206))),o.O(void 0,[715,490],(()=>o(5799))),o.O(void 0,[715,490],(()=>o(233)));var a=o.O(void 0,[715,490],(()=>o(4117)));a=o.O(a),main=a})();