(self.webpackChunkelucidate=self.webpackChunkelucidate||[]).push([[137],{1231:(e,n,t)=>{"use strict";t.d(n,{D7:()=>s,LH:()=>a});var i=t(8563);function a(){i("#font-size-control").on("moved.zf.slider",(function(e){const n=i(e.currentTarget).find("input").first().val().toString()+"rem";i(":root").css("--base-font-size",n)}))}function s(){i("#dark-mode-switch").on("change",(function(){const e=i(this).prop("checked");i("html").attr("data-theme",e?"dark":"light")})),window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?(i("#dark-mode-switch").prop("checked",!0),i("html").attr("data-theme","dark")):(i("#dark-mode-switch").prop("checked",!1),i("html").attr("data-theme","light")):(i("#dark-mode-switch").prop("checked",!0),i("html").attr("data-theme","dark"))}},3384:e=>{function n(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((t=>{const i=e[t],a=typeof i;"object"!==a&&"function"!==a||Object.isFrozen(i)||n(i)})),e}class t{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function i(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function a(e,...n){const t=Object.create(null);for(const n in e)t[n]=e[n];return n.forEach((function(e){for(const n in e)t[n]=e[n]})),t}const s=e=>!!e.scope;class r{constructor(e,n){this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){this.buffer+=i(e)}openNode(e){if(!s(e))return;const n=((e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){const t=e.split(".");return[`${n}${t.shift()}`,...t.map(((e,n)=>`${e}${"_".repeat(n+1)}`))].join(" ")}return`${n}${e}`})(e.scope,{prefix:this.classPrefix});this.span(n)}closeNode(e){s(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}}const o=(e={})=>{const n={children:[]};return Object.assign(n,e),n};class c{constructor(){this.rootNode=o(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){const n=o({scope:e});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){return"string"==typeof n?e.addText(n):n.children&&(e.openNode(n),n.children.forEach((n=>this._walk(e,n))),e.closeNode(n)),e}static _collapse(e){"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{c._collapse(e)})))}}class l extends c{constructor(e){super(),this.options=e}addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){this.closeNode()}__addSublanguage(e,n){const t=e.root;n&&(t.scope=`language:${n}`),this.add(t)}toHTML(){return new r(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function g(e){return e?"string"==typeof e?e:e.source:null}function u(e){return f("(?=",e,")")}function d(e){return f("(?:",e,")*")}function h(e){return f("(?:",e,")?")}function f(...e){return e.map((e=>g(e))).join("")}function p(...e){const n=function(e){const n=e[e.length-1];return"object"==typeof n&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}(e);return"("+(n.capture?"":"?:")+e.map((e=>g(e))).join("|")+")"}function b(e){return new RegExp(e.toString()+"|").exec("").length-1}const m=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function w(e,{joinWith:n}){let t=0;return e.map((e=>{t+=1;const n=t;let i=g(e),a="";for(;i.length>0;){const e=m.exec(i);if(!e){a+=i;break}a+=i.substring(0,e.index),i=i.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?a+="\\"+String(Number(e[1])+n):(a+=e[0],"("===e[0]&&t++)}return a})).map((e=>`(${e})`)).join(n)}const x="[a-zA-Z]\\w*",E="[a-zA-Z_]\\w*",_="\\b\\d+(\\.\\d+)?",v="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",y="\\b(0b[01]+)",k={begin:"\\\\[\\s\\S]",relevance:0},N={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[k]},O={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[k]},A=function(e,n,t={}){const i=a({scope:"comment",begin:e,end:n,contains:[]},t);i.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const s=p("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return i.contains.push({begin:f(/[ ]+/,"(",s,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),i},S=A("//","$"),M=A("/\\*","\\*/"),R=A("#","$"),T={scope:"number",begin:_,relevance:0},j={scope:"number",begin:v,relevance:0},I={scope:"number",begin:y,relevance:0},L={begin:/(?=\/[^/\n]*\/)/,contains:[{scope:"regexp",begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[k,{begin:/\[/,end:/\]/,relevance:0,contains:[k]}]}]},P={scope:"title",begin:x,relevance:0},B={scope:"title",begin:E,relevance:0},z={begin:"\\.\\s*"+E,relevance:0};var D=Object.freeze({__proto__:null,MATCH_NOTHING_RE:/\b\B/,IDENT_RE:x,UNDERSCORE_IDENT_RE:E,NUMBER_RE:_,C_NUMBER_RE:v,BINARY_NUMBER_RE:y,RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",SHEBANG:(e={})=>{const n=/^#![ ]*\//;return e.binary&&(e.begin=f(n,/.*\b/,e.binary,/\b.*/)),a({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(e,n)=>{0!==e.index&&n.ignoreMatch()}},e)},BACKSLASH_ESCAPE:k,APOS_STRING_MODE:N,QUOTE_STRING_MODE:O,PHRASAL_WORDS_MODE:{begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},COMMENT:A,C_LINE_COMMENT_MODE:S,C_BLOCK_COMMENT_MODE:M,HASH_COMMENT_MODE:R,NUMBER_MODE:T,C_NUMBER_MODE:j,BINARY_NUMBER_MODE:I,REGEXP_MODE:L,TITLE_MODE:P,UNDERSCORE_TITLE_MODE:B,METHOD_GUARD:z,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,n)=>{n.data._beginMatch=e[1]},"on:end":(e,n)=>{n.data._beginMatch!==e[1]&&n.ignoreMatch()}})}});function C(e,n){"."===e.input[e.index-1]&&n.ignoreMatch()}function H(e,n){void 0!==e.className&&(e.scope=e.className,delete e.className)}function $(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=C,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,void 0===e.relevance&&(e.relevance=0))}function Z(e,n){Array.isArray(e.illegal)&&(e.illegal=p(...e.illegal))}function U(e,n){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function X(e,n){void 0===e.relevance&&(e.relevance=1)}const G=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");const t=Object.assign({},e);Object.keys(e).forEach((n=>{delete e[n]})),e.keywords=t.keywords,e.begin=f(t.beforeMatch,u(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},W=["of","and","for","in","not","or","if","then","parent","list","value"],q="keyword";function F(e,n,t=q){const i=Object.create(null);return"string"==typeof e?a(t,e.split(" ")):Array.isArray(e)?a(t,e):Object.keys(e).forEach((function(t){Object.assign(i,F(e[t],n,t))})),i;function a(e,t){n&&(t=t.map((e=>e.toLowerCase()))),t.forEach((function(n){const t=n.split("|");i[t[0]]=[e,K(t[0],t[1])]}))}}function K(e,n){return n?Number(n):function(e){return W.includes(e.toLowerCase())}(e)?0:1}const V={},J=e=>{console.error(e)},Q=(e,...n)=>{console.log(`WARN: ${e}`,...n)},Y=(e,n)=>{V[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),V[`${e}/${n}`]=!0)},ee=new Error;function ne(e,n,{key:t}){let i=0;const a=e[t],s={},r={};for(let e=1;e<=n.length;e++)r[e+i]=a[e],s[e+i]=!0,i+=b(n[e-1]);e[t]=r,e[t]._emit=s,e[t]._multi=!0}function te(e){!function(e){e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,delete e.scope)}(e),"string"==typeof e.beginScope&&(e.beginScope={_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope}),function(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw J("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),ee;if("object"!=typeof e.beginScope||null===e.beginScope)throw J("beginScope must be object"),ee;ne(e,e.begin,{key:"beginScope"}),e.begin=w(e.begin,{joinWith:""})}}(e),function(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw J("skip, excludeEnd, returnEnd not compatible with endScope: {}"),ee;if("object"!=typeof e.endScope||null===e.endScope)throw J("endScope must be object"),ee;ne(e,e.end,{key:"endScope"}),e.end=w(e.end,{joinWith:""})}}(e)}function ie(e){function n(n,t){return new RegExp(g(n),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(t?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,n){n.position=this.position++,this.matchIndexes[this.matchAt]=n,this.regexes.push([n,e]),this.matchAt+=b(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null);const e=this.regexes.map((e=>e[1]));this.matcherRe=n(w(e,{joinWith:"|"}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;const n=this.matcherRe.exec(e);if(!n)return null;const t=n.findIndex(((e,n)=>n>0&&void 0!==e)),i=this.matchIndexes[t];return n.splice(0,t),Object.assign(n,i)}}class i{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];const n=new t;return this.rules.slice(e).forEach((([e,t])=>n.addRule(e,t))),n.compile(),this.multiRegexes[e]=n,n}resumingScanAtSamePosition(){return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,n){this.rules.push([e,n]),"begin"===n.type&&this.count++}exec(e){const n=this.getMatcher(this.regexIndex);n.lastIndex=this.lastIndex;let t=n.exec(e);if(this.resumingScanAtSamePosition())if(t&&t.index===this.lastIndex);else{const n=this.getMatcher(0);n.lastIndex=this.lastIndex+1,t=n.exec(e)}return t&&(this.regexIndex+=t.position+1,this.regexIndex===this.count&&this.considerAll()),t}}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=a(e.classNameAliases||{}),function t(s,r){const o=s;if(s.isCompiled)return o;[H,U,te,G].forEach((e=>e(s,r))),e.compilerExtensions.forEach((e=>e(s,r))),s.__beforeBegin=null,[$,Z,X].forEach((e=>e(s,r))),s.isCompiled=!0;let c=null;return"object"==typeof s.keywords&&s.keywords.$pattern&&(s.keywords=Object.assign({},s.keywords),c=s.keywords.$pattern,delete s.keywords.$pattern),c=c||/\w+/,s.keywords&&(s.keywords=F(s.keywords,e.case_insensitive)),o.keywordPatternRe=n(c,!0),r&&(s.begin||(s.begin=/\B|\b/),o.beginRe=n(o.begin),s.end||s.endsWithParent||(s.end=/\B|\b/),s.end&&(o.endRe=n(o.end)),o.terminatorEnd=g(o.end)||"",s.endsWithParent&&r.terminatorEnd&&(o.terminatorEnd+=(s.end?"|":"")+r.terminatorEnd)),s.illegal&&(o.illegalRe=n(s.illegal)),s.contains||(s.contains=[]),s.contains=[].concat(...s.contains.map((function(e){return function(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((function(n){return a(e,{variants:null},n)}))),e.cachedVariants?e.cachedVariants:ae(e)?a(e,{starts:e.starts?a(e.starts):null}):Object.isFrozen(e)?a(e):e}("self"===e?s:e)}))),s.contains.forEach((function(e){t(e,o)})),s.starts&&t(s.starts,r),o.matcher=function(e){const n=new i;return e.contains.forEach((e=>n.addRule(e.begin,{rule:e,type:"begin"}))),e.terminatorEnd&&n.addRule(e.terminatorEnd,{type:"end"}),e.illegal&&n.addRule(e.illegal,{type:"illegal"}),n}(o),o}(e)}function ae(e){return!!e&&(e.endsWithParent||ae(e.starts))}class se extends Error{constructor(e,n){super(e),this.name="HTMLInjectionError",this.html=n}}const re=i,oe=a,ce=Symbol("nomatch"),le=function(e){const i=Object.create(null),a=Object.create(null),s=[];let r=!0;const o="Could not find the language '{}', did you forget to load/include a language module?",c={disableAutodetect:!0,name:"Plain text",contains:[]};let g={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:l};function b(e){return g.noHighlightRe.test(e)}function m(e,n,t){let i="",a="";"object"==typeof n?(i=e,t=n.ignoreIllegals,a=n.language):(Y("10.7.0","highlight(lang, code, ...args) has been deprecated."),Y("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),a=e,i=n),void 0===t&&(t=!0);const s={code:i,language:a};O("before:highlight",s);const r=s.result?s.result:w(s.language,s.code,t);return r.code=s.code,O("after:highlight",r),r}function w(e,n,a,s){const c=Object.create(null);function l(){if(!O.keywords)return void S.addText(M);let e=0;O.keywordPatternRe.lastIndex=0;let n=O.keywordPatternRe.exec(M),t="";for(;n;){t+=M.substring(e,n.index);const a=v.case_insensitive?n[0].toLowerCase():n[0],s=(i=a,O.keywords[i]);if(s){const[e,i]=s;if(S.addText(t),t="",c[a]=(c[a]||0)+1,c[a]<=7&&(R+=i),e.startsWith("_"))t+=n[0];else{const t=v.classNameAliases[e]||e;d(n[0],t)}}else t+=n[0];e=O.keywordPatternRe.lastIndex,n=O.keywordPatternRe.exec(M)}var i;t+=M.substring(e),S.addText(t)}function u(){null!=O.subLanguage?function(){if(""===M)return;let e=null;if("string"==typeof O.subLanguage){if(!i[O.subLanguage])return void S.addText(M);e=w(O.subLanguage,M,!0,A[O.subLanguage]),A[O.subLanguage]=e._top}else e=x(M,O.subLanguage.length?O.subLanguage:null);O.relevance>0&&(R+=e.relevance),S.__addSublanguage(e._emitter,e.language)}():l(),M=""}function d(e,n){""!==e&&(S.startScope(n),S.addText(e),S.endScope())}function h(e,n){let t=1;const i=n.length-1;for(;t<=i;){if(!e._emit[t]){t++;continue}const i=v.classNameAliases[e[t]]||e[t],a=n[t];i?d(a,i):(M=a,l(),M=""),t++}}function f(e,n){return e.scope&&"string"==typeof e.scope&&S.openNode(v.classNameAliases[e.scope]||e.scope),e.beginScope&&(e.beginScope._wrap?(d(M,v.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),M=""):e.beginScope._multi&&(h(e.beginScope,n),M="")),O=Object.create(e,{parent:{value:O}}),O}function p(e,n,i){let a=function(e,n){const t=e&&e.exec(n);return t&&0===t.index}(e.endRe,i);if(a){if(e["on:end"]){const i=new t(e);e["on:end"](n,i),i.isMatchIgnored&&(a=!1)}if(a){for(;e.endsParent&&e.parent;)e=e.parent;return e}}if(e.endsWithParent)return p(e.parent,n,i)}function b(e){return 0===O.matcher.regexIndex?(M+=e[0],1):(I=!0,0)}function m(e){const t=e[0],i=n.substring(e.index),a=p(O,e,i);if(!a)return ce;const s=O;O.endScope&&O.endScope._wrap?(u(),d(t,O.endScope._wrap)):O.endScope&&O.endScope._multi?(u(),h(O.endScope,e)):s.skip?M+=t:(s.returnEnd||s.excludeEnd||(M+=t),u(),s.excludeEnd&&(M=t));do{O.scope&&S.closeNode(),O.skip||O.subLanguage||(R+=O.relevance),O=O.parent}while(O!==a.parent);return a.starts&&f(a.starts,e),s.returnEnd?0:t.length}let E={};function _(i,s){const o=s&&s[0];if(M+=i,null==o)return u(),0;if("begin"===E.type&&"end"===s.type&&E.index===s.index&&""===o){if(M+=n.slice(s.index,s.index+1),!r){const n=new Error(`0 width match regex (${e})`);throw n.languageName=e,n.badRule=E.rule,n}return 1}if(E=s,"begin"===s.type)return function(e){const n=e[0],i=e.rule,a=new t(i),s=[i.__beforeBegin,i["on:begin"]];for(const t of s)if(t&&(t(e,a),a.isMatchIgnored))return b(n);return i.skip?M+=n:(i.excludeBegin&&(M+=n),u(),i.returnBegin||i.excludeBegin||(M=n)),f(i,e),i.returnBegin?0:n.length}(s);if("illegal"===s.type&&!a){const e=new Error('Illegal lexeme "'+o+'" for mode "'+(O.scope||"<unnamed>")+'"');throw e.mode=O,e}if("end"===s.type){const e=m(s);if(e!==ce)return e}if("illegal"===s.type&&""===o)return 1;if(j>1e5&&j>3*s.index)throw new Error("potential infinite loop, way more iterations than matches");return M+=o,o.length}const v=y(e);if(!v)throw J(o.replace("{}",e)),new Error('Unknown language: "'+e+'"');const k=ie(v);let N="",O=s||k;const A={},S=new g.__emitter(g);!function(){const e=[];for(let n=O;n!==v;n=n.parent)n.scope&&e.unshift(n.scope);e.forEach((e=>S.openNode(e)))}();let M="",R=0,T=0,j=0,I=!1;try{if(v.__emitTokens)v.__emitTokens(n,S);else{for(O.matcher.considerAll();;){j++,I?I=!1:O.matcher.considerAll(),O.matcher.lastIndex=T;const e=O.matcher.exec(n);if(!e)break;const t=_(n.substring(T,e.index),e);T=e.index+t}_(n.substring(T))}return S.finalize(),N=S.toHTML(),{language:e,value:N,relevance:R,illegal:!1,_emitter:S,_top:O}}catch(t){if(t.message&&t.message.includes("Illegal"))return{language:e,value:re(n),illegal:!0,relevance:0,_illegalBy:{message:t.message,index:T,context:n.slice(T-100,T+100),mode:t.mode,resultSoFar:N},_emitter:S};if(r)return{language:e,value:re(n),illegal:!1,relevance:0,errorRaised:t,_emitter:S,_top:O};throw t}}function x(e,n){n=n||g.languages||Object.keys(i);const t=function(e){const n={value:re(e),illegal:!1,relevance:0,_top:c,_emitter:new g.__emitter(g)};return n._emitter.addText(e),n}(e),a=n.filter(y).filter(N).map((n=>w(n,e,!1)));a.unshift(t);const s=a.sort(((e,n)=>{if(e.relevance!==n.relevance)return n.relevance-e.relevance;if(e.language&&n.language){if(y(e.language).supersetOf===n.language)return 1;if(y(n.language).supersetOf===e.language)return-1}return 0})),[r,o]=s,l=r;return l.secondBest=o,l}function E(e){let n=null;const t=function(e){let n=e.className+" ";n+=e.parentNode?e.parentNode.className:"";const t=g.languageDetectRe.exec(n);if(t){const n=y(t[1]);return n||(Q(o.replace("{}",t[1])),Q("Falling back to no-highlight mode for this block.",e)),n?t[1]:"no-highlight"}return n.split(/\s+/).find((e=>b(e)||y(e)))}(e);if(b(t))return;if(O("before:highlightElement",{el:e,language:t}),e.children.length>0&&(g.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(e)),g.throwUnescapedHTML))throw new se("One of your code blocks includes unescaped HTML.",e.innerHTML);n=e;const i=n.textContent,s=t?m(i,{language:t,ignoreIllegals:!0}):x(i);e.innerHTML=s.value,function(e,n,t){const i=n&&a[n]||t;e.classList.add("hljs"),e.classList.add(`language-${i}`)}(e,t,s.language),e.result={language:s.language,re:s.relevance,relevance:s.relevance},s.secondBest&&(e.secondBest={language:s.secondBest.language,relevance:s.secondBest.relevance}),O("after:highlightElement",{el:e,result:s,text:i})}let _=!1;function v(){"loading"!==document.readyState?document.querySelectorAll(g.cssSelector).forEach(E):_=!0}function y(e){return e=(e||"").toLowerCase(),i[e]||i[a[e]]}function k(e,{languageName:n}){"string"==typeof e&&(e=[e]),e.forEach((e=>{a[e.toLowerCase()]=n}))}function N(e){const n=y(e);return n&&!n.disableAutodetect}function O(e,n){const t=e;s.forEach((function(e){e[t]&&e[t](n)}))}"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",(function(){_&&v()}),!1),Object.assign(e,{highlight:m,highlightAuto:x,highlightAll:v,highlightElement:E,highlightBlock:function(e){return Y("10.7.0","highlightBlock will be removed entirely in v12.0"),Y("10.7.0","Please use highlightElement now."),E(e)},configure:function(e){g=oe(g,e)},initHighlighting:()=>{v(),Y("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},initHighlightingOnLoad:function(){v(),Y("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")},registerLanguage:function(n,t){let a=null;try{a=t(e)}catch(e){if(J("Language definition for '{}' could not be registered.".replace("{}",n)),!r)throw e;J(e),a=c}a.name||(a.name=n),i[n]=a,a.rawDefinition=t.bind(null,e),a.aliases&&k(a.aliases,{languageName:n})},unregisterLanguage:function(e){delete i[e];for(const n of Object.keys(a))a[n]===e&&delete a[n]},listLanguages:function(){return Object.keys(i)},getLanguage:y,registerAliases:k,autoDetection:N,inherit:oe,addPlugin:function(e){!function(e){e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=n=>{e["before:highlightBlock"](Object.assign({block:n.el},n))}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=n=>{e["after:highlightBlock"](Object.assign({block:n.el},n))})}(e),s.push(e)},removePlugin:function(e){const n=s.indexOf(e);-1!==n&&s.splice(n,1)}}),e.debugMode=function(){r=!1},e.safeMode=function(){r=!0},e.versionString="11.8.0",e.regex={concat:f,lookahead:u,either:p,optional:h,anyNumberOfTimes:d};for(const e in D)"object"==typeof D[e]&&n(D[e]);return Object.assign(e,D),e},ge=le({});ge.newInstance=()=>le({}),e.exports=ge,ge.HighlightJS=ge,ge.default=ge},167:(e,n,t)=>{"use strict";t.d(n,{Z:()=>i});const i=t(3384)},7491:(e,n,t)=>{"use strict";function i(e){const n=[{begin:/\^{6}[0-9a-f]{6}/},{begin:/\^{5}[0-9a-f]{5}/},{begin:/\^{4}[0-9a-f]{4}/},{begin:/\^{3}[0-9a-f]{3}/},{begin:/\^{2}[0-9a-f]{2}/},{begin:/\^{2}[\u0000-\u007f]/}],t=[{className:"keyword",begin:/\\/,relevance:0,contains:[{endsParent:!0,begin:e.regex.either(...["(?:NeedsTeXFormat|RequirePackage|GetIdInfo)","Provides(?:Expl)?(?:Package|Class|File)","(?:DeclareOption|ProcessOptions)","(?:documentclass|usepackage|input|include)","makeat(?:letter|other)","ExplSyntax(?:On|Off)","(?:new|renew|provide)?command","(?:re)newenvironment","(?:New|Renew|Provide|Declare)(?:Expandable)?DocumentCommand","(?:New|Renew|Provide|Declare)DocumentEnvironment","(?:(?:e|g|x)?def|let)","(?:begin|end)","(?:part|chapter|(?:sub){0,2}section|(?:sub)?paragraph)","caption","(?:label|(?:eq|page|name)?ref|(?:paren|foot|super)?cite)","(?:alpha|beta|[Gg]amma|[Dd]elta|(?:var)?epsilon|zeta|eta|[Tt]heta|vartheta)","(?:iota|(?:var)?kappa|[Ll]ambda|mu|nu|[Xx]i|[Pp]i|varpi|(?:var)rho)","(?:[Ss]igma|varsigma|tau|[Uu]psilon|[Pp]hi|varphi|chi|[Pp]si|[Oo]mega)","(?:frac|sum|prod|lim|infty|times|sqrt|leq|geq|left|right|middle|[bB]igg?)","(?:[lr]angle|q?quad|[lcvdi]?dots|d?dot|hat|tilde|bar)"].map((e=>e+"(?![a-zA-Z@:_])")))},{endsParent:!0,begin:new RegExp(["(?:__)?[a-zA-Z]{2,}_[a-zA-Z](?:_?[a-zA-Z])+:[a-zA-Z]*","[lgc]__?[a-zA-Z](?:_?[a-zA-Z])*_[a-zA-Z]{2,}","[qs]__?[a-zA-Z](?:_?[a-zA-Z])+","use(?:_i)?:[a-zA-Z]*","(?:else|fi|or):","(?:if|cs|exp):w","(?:hbox|vbox):n","::[a-zA-Z]_unbraced","::[a-zA-Z:]"].map((e=>e+"(?![a-zA-Z:_])")).join("|"))},{endsParent:!0,variants:n},{endsParent:!0,relevance:0,variants:[{begin:/[a-zA-Z@]+/},{begin:/[^a-zA-Z@]?/}]}]},{className:"params",relevance:0,begin:/#+\d?/},{variants:n},{className:"built_in",relevance:0,begin:/[$&^_]/},{className:"meta",begin:/% ?!(T[eE]X|tex|BIB|bib)/,end:"$",relevance:10},e.COMMENT("%","$",{relevance:0})],i={begin:/\{/,end:/\}/,relevance:0,contains:["self",...t]},a=e.inherit(i,{relevance:0,endsParent:!0,contains:[i,...t]}),s={begin:/\[/,end:/\]/,endsParent:!0,relevance:0,contains:[i,...t]},r={begin:/\s+/,relevance:0},o=[a],c=[s],l=function(e,n){return{contains:[r],starts:{relevance:0,contains:e,starts:n}}},g=function(e,n){return{begin:"\\\\"+e+"(?![a-zA-Z@:_])",keywords:{$pattern:/\\[a-zA-Z]+/,keyword:"\\"+e},relevance:0,contains:[r],starts:n}},u=function(n,t){return e.inherit({begin:"\\\\begin(?=[ \t]*(\\r?\\n[ \t]*)?\\{"+n+"\\})",keywords:{$pattern:/\\[a-zA-Z]+/,keyword:"\\begin"},relevance:0},l(o,t))},d=(n="string")=>e.END_SAME_AS_BEGIN({className:n,begin:/(.|\r?\n)/,end:/(.|\r?\n)/,excludeBegin:!0,excludeEnd:!0,endsParent:!0}),h=function(e){return{className:"string",end:"(?=\\\\end\\{"+e+"\\})"}},f=(e="string")=>({relevance:0,begin:/\{/,starts:{endsParent:!0,contains:[{className:e,end:/(?=\})/,endsParent:!0,contains:[{begin:/\{/,end:/\}/,relevance:0,contains:["self"]}]}]}});return{name:"LaTeX",aliases:["tex"],contains:[...["verb","lstinline"].map((e=>g(e,{contains:[d()]}))),g("mint",l(o,{contains:[d()]})),g("mintinline",l(o,{contains:[f(),d()]})),g("url",{contains:[f("link"),f("link")]}),g("hyperref",{contains:[f("link")]}),g("href",l(c,{contains:[f("link")]})),...[].concat(...["","\\*"].map((e=>[u("verbatim"+e,h("verbatim"+e)),u("filecontents"+e,l(o,h("filecontents"+e))),...["","B","L"].map((n=>u(n+"Verbatim"+e,l(c,h(n+"Verbatim"+e)))))]))),u("minted",l(c,l(o,h("minted")))),...t]}}t.d(n,{Z:()=>i})},9274:(e,n,t)=>{"use strict";function i(e){const n=e.regex,t=n.concat(/[\p{L}_]/u,n.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),i={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},a={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},s=e.inherit(a,{begin:/\(/,end:/\)/}),r=e.inherit(e.APOS_STRING_MODE,{className:"string"}),o=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:/[\p{L}0-9._:-]+/u,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[i]},{begin:/'/,end:/'/,contains:[i]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[a,o,r,s,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[a,s,o,r]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},i,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[o]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:n.concat(/</,n.lookahead(n.concat(t,n.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:t,relevance:0,starts:c}]},{className:"tag",begin:n.concat(/<\//,n.lookahead(n.concat(t,/>/))),contains:[{className:"name",begin:t,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}t.d(n,{Z:()=>i})}}]);