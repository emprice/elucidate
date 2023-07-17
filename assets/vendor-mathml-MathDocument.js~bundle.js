"use strict";(self.webpackChunkelucidate=self.webpackChunkelucidate||[]).push([[29],{5933:function(t,e,r){var o,n=this&&this.__extends||(o=function(t,e){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])},o(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}),i=this&&this.__values||function(t){var e="function"==typeof Symbol&&Symbol.iterator,r=e&&t[e],o=0;if(r)return r.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")},a=this&&this.__read||function(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var o,n,i=r.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(o=i.next()).done;)a.push(o.value)}catch(t){n={error:t}}finally{try{o&&!o.done&&(r=i.return)&&r.call(i)}finally{if(n)throw n.error}}return a},s=this&&this.__spreadArray||function(t,e,r){if(r||2===arguments.length)for(var o,n=0,i=e.length;n<i;n++)!o&&n in e||(o||(o=Array.prototype.slice.call(e,0,n)),o[n]=e[n]);return t.concat(o||Array.prototype.slice.call(e))};Object.defineProperty(e,"__esModule",{value:!0}),e.AbstractMathDocument=e.resetAllOptions=e.resetOptions=e.RenderList=void 0;var u=r(1505),c=r(1771),l=r(8243),p=r(1020),h=r(1012),f=r(6709),y=r(5207),d=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.create=function(t){var e,r,o=new this;try{for(var n=i(Object.keys(t)),s=n.next();!s.done;s=n.next()){var u=s.value,c=a(this.action(u,t[u]),2),l=c[0],p=c[1];p&&o.add(l,p)}}catch(t){e={error:t}}finally{try{s&&!s.done&&(r=n.return)&&r.call(n)}finally{if(e)throw e.error}}return o},e.action=function(t,e){var r,o,n,i,s,u,c=!0,l=e[0];if(1===e.length||"boolean"==typeof e[1])2===e.length&&(c=e[1]),s=(r=a(this.methodActions(t),2))[0],u=r[1];else if("string"==typeof e[1])if("string"==typeof e[2]){4===e.length&&(c=e[3]);var p=a(e.slice(1),2),h=p[0],f=p[1];s=(o=a(this.methodActions(h,f),2))[0],u=o[1]}else 3===e.length&&(c=e[2]),s=(n=a(this.methodActions(e[1]),2))[0],u=n[1];else 4===e.length&&(c=e[3]),s=(i=a(e.slice(1),2))[0],u=i[1];return[{id:t,renderDoc:s,renderMath:u,convert:c},l]},e.methodActions=function(t,e){return void 0===e&&(e=t),[function(e){return t&&e[t](),!1},function(t,r){return e&&t[e](r),!1}]},e.prototype.renderDoc=function(t,e){var r,o;void 0===e&&(e=h.STATE.UNPROCESSED);try{for(var n=i(this.items),a=n.next();!a.done;a=n.next()){var s=a.value;if(s.priority>=e&&s.item.renderDoc(t))return}}catch(t){r={error:t}}finally{try{a&&!a.done&&(o=n.return)&&o.call(n)}finally{if(r)throw r.error}}},e.prototype.renderMath=function(t,e,r){var o,n;void 0===r&&(r=h.STATE.UNPROCESSED);try{for(var a=i(this.items),s=a.next();!s.done;s=a.next()){var u=s.value;if(u.priority>=r&&u.item.renderMath(t,e))return}}catch(t){o={error:t}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}},e.prototype.renderConvert=function(t,e,r){var o,n;void 0===r&&(r=h.STATE.LAST);try{for(var a=i(this.items),s=a.next();!s.done;s=a.next()){var u=s.value;if(u.priority>r)return;if(u.item.convert&&u.item.renderMath(t,e))return}}catch(t){o={error:t}}finally{try{s&&!s.done&&(n=a.return)&&n.call(a)}finally{if(o)throw o.error}}},e.prototype.findID=function(t){var e,r;try{for(var o=i(this.items),n=o.next();!n.done;n=o.next()){var a=n.value;if(a.item.id===t)return a.item}}catch(t){e={error:t}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(e)throw e.error}}return null},e}(r(4309).PrioritizedList);e.RenderList=d,e.resetOptions={all:!1,processed:!1,inputJax:null,outputJax:null},e.resetAllOptions={all:!0,processed:!0,inputJax:[],outputJax:[]};var m=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.compile=function(t){return null},e}(c.AbstractInputJax),v=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.typeset=function(t,e){return void 0===e&&(e=null),null},e.prototype.escaped=function(t,e){return null},e}(l.AbstractOutputJax),x=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e}(p.AbstractMathList),A=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e}(h.AbstractMathItem),E=function(){function t(e,r,o){var n=this,i=this.constructor;this.document=e,this.options=(0,u.userOptions)((0,u.defaultOptions)({},i.OPTIONS),o),this.math=new(this.options.MathList||x),this.renderActions=d.create(this.options.renderActions),this.processed=new t.ProcessBits,this.outputJax=this.options.OutputJax||new v;var a=this.options.InputJax||[new m];Array.isArray(a)||(a=[a]),this.inputJax=a,this.adaptor=r,this.outputJax.setAdaptor(r),this.inputJax.map((function(t){return t.setAdaptor(r)})),this.mmlFactory=this.options.MmlFactory||new f.MmlFactory,this.inputJax.map((function(t){return t.setMmlFactory(n.mmlFactory)})),this.outputJax.initialize(),this.inputJax.map((function(t){return t.initialize()}))}return Object.defineProperty(t.prototype,"kind",{get:function(){return this.constructor.KIND},enumerable:!1,configurable:!0}),t.prototype.addRenderAction=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];var o=a(d.action(t,e),2),n=o[0],i=o[1];this.renderActions.add(n,i)},t.prototype.removeRenderAction=function(t){var e=this.renderActions.findID(t);e&&this.renderActions.remove(e)},t.prototype.render=function(){return this.renderActions.renderDoc(this),this},t.prototype.rerender=function(t){return void 0===t&&(t=h.STATE.RERENDER),this.state(t-1),this.render(),this},t.prototype.convert=function(t,e){void 0===e&&(e={});var r=(0,u.userOptions)({format:this.inputJax[0].name,display:!0,end:h.STATE.LAST,em:16,ex:8,containerWidth:null,lineWidth:1e6,scale:1,family:""},e),o=r.format,n=r.display,i=r.end,a=r.ex,s=r.em,c=r.containerWidth,l=r.lineWidth,p=r.scale,f=r.family;null===c&&(c=80*a);var y=this.inputJax.reduce((function(t,e){return e.name===o?e:t}),null),d=new this.options.MathItem(t,y,n);return d.start.node=this.adaptor.body(this.document),d.setMetrics(s,a,c,l,p),this.outputJax.options.mtextInheritFont&&(d.outputData.mtextFamily=f),this.outputJax.options.merrorInheritFont&&(d.outputData.merrorFamily=f),d.convert(this,i),d.typesetRoot||d.root},t.prototype.findMath=function(t){return void 0===t&&(t=null),this.processed.set("findMath"),this},t.prototype.compile=function(){var t,e,r,o;if(!this.processed.isSet("compile")){var n=[];try{for(var a=i(this.math),s=a.next();!s.done;s=a.next()){var u=s.value;this.compileMath(u),void 0!==u.inputData.recompile&&n.push(u)}}catch(e){t={error:e}}finally{try{s&&!s.done&&(e=a.return)&&e.call(a)}finally{if(t)throw t.error}}try{for(var c=i(n),l=c.next();!l.done;l=c.next()){var p=(u=l.value).inputData.recompile;u.state(p.state),u.inputData.recompile=p,this.compileMath(u)}}catch(t){r={error:t}}finally{try{l&&!l.done&&(o=c.return)&&o.call(c)}finally{if(r)throw r.error}}this.processed.set("compile")}return this},t.prototype.compileMath=function(t){try{t.compile(this)}catch(e){if(e.retry||e.restart)throw e;this.options.compileError(this,t,e),t.inputData.error=e}},t.prototype.compileError=function(t,e){t.root=this.mmlFactory.create("math",null,[this.mmlFactory.create("merror",{"data-mjx-error":e.message,title:e.message},[this.mmlFactory.create("mtext",null,[this.mmlFactory.create("text").setText("Math input error")])])]),t.display&&t.root.attributes.set("display","block"),t.inputData.error=e.message},t.prototype.typeset=function(){var t,e;if(!this.processed.isSet("typeset")){try{for(var r=i(this.math),o=r.next();!o.done;o=r.next()){var n=o.value;try{n.typeset(this)}catch(t){if(t.retry||t.restart)throw t;this.options.typesetError(this,n,t),n.outputData.error=t}}}catch(e){t={error:e}}finally{try{o&&!o.done&&(e=r.return)&&e.call(r)}finally{if(t)throw t.error}}this.processed.set("typeset")}return this},t.prototype.typesetError=function(t,e){t.typesetRoot=this.adaptor.node("mjx-container",{class:"MathJax mjx-output-error",jax:this.outputJax.name},[this.adaptor.node("span",{"data-mjx-error":e.message,title:e.message,style:{color:"red","background-color":"yellow","line-height":"normal"}},[this.adaptor.text("Math output error")])]),t.display&&this.adaptor.setAttributes(t.typesetRoot,{style:{display:"block",margin:"1em 0","text-align":"center"}}),t.outputData.error=e.message},t.prototype.getMetrics=function(){return this.processed.isSet("getMetrics")||(this.outputJax.getMetrics(this),this.processed.set("getMetrics")),this},t.prototype.updateDocument=function(){var t,e;if(!this.processed.isSet("updateDocument")){try{for(var r=i(this.math.reversed()),o=r.next();!o.done;o=r.next())o.value.updateDocument(this)}catch(e){t={error:e}}finally{try{o&&!o.done&&(e=r.return)&&e.call(r)}finally{if(t)throw t.error}}this.processed.set("updateDocument")}return this},t.prototype.removeFromDocument=function(t){return void 0===t&&(t=!1),this},t.prototype.state=function(t,e){var r,o;void 0===e&&(e=!1);try{for(var n=i(this.math),a=n.next();!a.done;a=n.next())a.value.state(t,e)}catch(t){r={error:t}}finally{try{a&&!a.done&&(o=n.return)&&o.call(n)}finally{if(r)throw r.error}}return t<h.STATE.INSERTED&&this.processed.clear("updateDocument"),t<h.STATE.TYPESET&&(this.processed.clear("typeset"),this.processed.clear("getMetrics")),t<h.STATE.COMPILED&&this.processed.clear("compile"),this},t.prototype.reset=function(t){var r;return void 0===t&&(t={processed:!0}),(t=(0,u.userOptions)(Object.assign({},e.resetOptions),t)).all&&Object.assign(t,e.resetAllOptions),t.processed&&this.processed.reset(),t.inputJax&&this.inputJax.forEach((function(e){return e.reset.apply(e,s([],a(t.inputJax),!1))})),t.outputJax&&(r=this.outputJax).reset.apply(r,s([],a(t.outputJax),!1)),this},t.prototype.clear=function(){return this.reset(),this.math.clear(),this},t.prototype.concat=function(t){return this.math.merge(t),this},t.prototype.clearMathItemsWithin=function(t){var e,r=this.getMathItemsWithin(t);return(e=this.math).remove.apply(e,s([],a(r),!1)),r},t.prototype.getMathItemsWithin=function(t){var e,r,o,n;Array.isArray(t)||(t=[t]);var a=this.adaptor,s=[],u=a.getElements(t,this.document);try{t:for(var c=i(this.math),l=c.next();!l.done;l=c.next()){var p=l.value;try{for(var h=(o=void 0,i(u)),f=h.next();!f.done;f=h.next()){var y=f.value;if(p.start.node&&a.contains(y,p.start.node)){s.push(p);continue t}}}catch(t){o={error:t}}finally{try{f&&!f.done&&(n=h.return)&&n.call(h)}finally{if(o)throw o.error}}}}catch(t){e={error:t}}finally{try{l&&!l.done&&(r=c.return)&&r.call(c)}finally{if(e)throw e.error}}return s},t.KIND="MathDocument",t.OPTIONS={OutputJax:null,InputJax:null,MmlFactory:null,MathList:x,MathItem:A,compileError:function(t,e,r){t.compileError(e,r)},typesetError:function(t,e,r){t.typesetError(e,r)},renderActions:(0,u.expandable)({find:[h.STATE.FINDMATH,"findMath","",!1],compile:[h.STATE.COMPILED],metrics:[h.STATE.METRICS,"getMetrics","",!1],typeset:[h.STATE.TYPESET],update:[h.STATE.INSERTED,"updateDocument",!1]})},t.ProcessBits=(0,y.BitFieldClass)("findMath","compile","getMetrics","typeset","updateDocument"),t}();e.AbstractMathDocument=E}}]);