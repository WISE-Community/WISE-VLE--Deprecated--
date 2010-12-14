/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/yahoo/yahoo-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.util.CustomEvent=function(D,C,B,A){this.type=D;this.scope=C||window;this.silent=B;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(A,B,C){if(!A){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(A,B,C);}this.subscribers.push(new YAHOO.util.Subscriber(A,B,C));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var K=[],E=this.subscribers.length;if(!E&&this.silent){return true;}var I=[].slice.call(arguments,0),G=true,D,J=false;if(!this.silent){}var C=this.subscribers.slice(),A=YAHOO.util.Event.throwErrors;for(D=0;D<E;++D){var M=C[D];if(!M){J=true;}else{if(!this.silent){}var L=M.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(I.length>0){B=I[0];}try{G=M.fn.call(L,B,M.obj);}catch(F){this.lastError=F;if(A){throw F;}}}else{try{G=M.fn.call(L,this.type,I,M.obj);}catch(H){this.lastError=H;if(A){throw H;}}}if(false===G){if(!this.silent){}break;}}}return(G!==false);},unsubscribeAll:function(){var A=this.subscribers.length,B;for(B=A-1;B>-1;B--){this._delete(B);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope;}};YAHOO.util.Subscriber=function(A,B,C){this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.overrideContext){if(this.overrideContext===true){return this.obj;}else{return this.overrideContext;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var I=[];var J=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9};var K=YAHOO.env.ua.ie?"focusin":"focus";var L=YAHOO.env.ua.ie?"focusout":"blur";return{POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){var M=this;var N=function(){M._tryPreloadAttach();};this._interval=setInterval(N,this.POLL_INTERVAL);}},onAvailable:function(S,O,Q,R,P){var M=(YAHOO.lang.isString(S))?[S]:S;for(var N=0;N<M.length;N=N+1){F.push({id:M[N],fn:O,obj:Q,overrideContext:R,checkReady:P});}C=this.POLL_RETRYS;this.startInterval();},onContentReady:function(P,M,N,O){this.onAvailable(P,M,N,O,true);},onDOMReady:function(M,N,O){if(this.DOMReady){setTimeout(function(){var P=window;if(O){if(O===true){P=N;}else{P=O;}}M.call(P,"DOMReady",[],N);},0);}else{this.DOMReadyEvent.subscribe(M,N,O);}},_addListener:function(O,M,Y,S,W,b){if(!Y||!Y.call){return false;}if(this._isValidCollection(O)){var Z=true;for(var T=0,V=O.length;T<V;++T){Z=this.on(O[T],M,Y,S,W)&&Z;}return Z;}else{if(YAHOO.lang.isString(O)){var R=this.getEl(O);if(R){O=R;}else{this.onAvailable(O,function(){YAHOO.util.Event.on(O,M,Y,S,W);});return true;}}}if(!O){return false;}if("unload"==M&&S!==this){J[J.length]=[O,M,Y,S,W];return true;}var N=O;if(W){if(W===true){N=S;}else{N=W;}}var P=function(c){return Y.call(N,YAHOO.util.Event.getEvent(c,O),S);};var a=[O,M,Y,P,N,S,W];var U=I.length;I[U]=a;if(this.useLegacyEvent(O,M)){var Q=this.getLegacyIndex(O,M);if(Q==-1||O!=G[Q][0]){Q=G.length;B[O.id+M]=Q;G[Q]=[O,M,O["on"+M]];E[Q]=[];O["on"+M]=function(c){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(c),Q);};}E[Q].push(a);}else{try{this._simpleAdd(O,M,P,b);}catch(X){this.lastError=X;this.removeListener(O,M,Y);return false;}}return true;},addListener:function(N,Q,M,O,P){return this._addListener(N,Q,M,O,P,false);},addFocusListener:function(N,M,O,P){return this._addListener(N,K,M,O,P,true);},removeFocusListener:function(N,M){return this.removeListener(N,K,M);},addBlurListener:function(N,M,O,P){return this._addListener(N,L,M,O,P,true);},removeBlurListener:function(N,M){return this.removeListener(N,L,M);},fireLegacyEvent:function(R,P){var T=true,M,V,U,N,S;V=E[P].slice();for(var O=0,Q=V.length;O<Q;++O){U=V[O];if(U&&U[this.WFN]){N=U[this.ADJ_SCOPE];S=U[this.WFN].call(N,R);T=(T&&S);}}M=G[P];if(M&&M[2]){M[2](R);}return T;},getLegacyIndex:function(N,O){var M=this.generateId(N)+O;if(typeof B[M]=="undefined"){return -1;}else{return B[M];}},useLegacyEvent:function(M,N){return(this.webkit&&this.webkit<419&&("click"==N||"dblclick"==N));},removeListener:function(N,M,V){var Q,T,X;if(typeof N=="string"){N=this.getEl(N);}else{if(this._isValidCollection(N)){var W=true;for(Q=N.length-1;Q>-1;Q--){W=(this.removeListener(N[Q],M,V)&&W);}return W;}}if(!V||!V.call){return this.purgeElement(N,false,M);}if("unload"==M){for(Q=J.length-1;Q>-1;Q--){X=J[Q];if(X&&X[0]==N&&X[1]==M&&X[2]==V){J.splice(Q,1);return true;}}return false;}var R=null;var S=arguments[3];if("undefined"===typeof S){S=this._getCacheIndex(N,M,V);}if(S>=0){R=I[S];}if(!N||!R){return false;}if(this.useLegacyEvent(N,M)){var P=this.getLegacyIndex(N,M);var O=E[P];if(O){for(Q=0,T=O.length;Q<T;++Q){X=O[Q];if(X&&X[this.EL]==N&&X[this.TYPE]==M&&X[this.FN]==V){O.splice(Q,1);break;}}}}else{try{this._simpleRemove(N,M,R[this.WFN],false);}catch(U){this.lastError=U;return false;}}delete I[S][this.WFN];delete I[S][this.FN];
I.splice(S,1);return true;},getTarget:function(O,N){var M=O.target||O.srcElement;return this.resolveTextNode(M);},resolveTextNode:function(N){try{if(N&&3==N.nodeType){return N.parentNode;}}catch(M){}return N;},getPageX:function(N){var M=N.pageX;if(!M&&0!==M){M=N.clientX||0;if(this.isIE){M+=this._getScrollLeft();}}return M;},getPageY:function(M){var N=M.pageY;if(!N&&0!==N){N=M.clientY||0;if(this.isIE){N+=this._getScrollTop();}}return N;},getXY:function(M){return[this.getPageX(M),this.getPageY(M)];},getRelatedTarget:function(N){var M=N.relatedTarget;if(!M){if(N.type=="mouseout"){M=N.toElement;}else{if(N.type=="mouseover"){M=N.fromElement;}}}return this.resolveTextNode(M);},getTime:function(O){if(!O.time){var N=new Date().getTime();try{O.time=N;}catch(M){this.lastError=M;return N;}}return O.time;},stopEvent:function(M){this.stopPropagation(M);this.preventDefault(M);},stopPropagation:function(M){if(M.stopPropagation){M.stopPropagation();}else{M.cancelBubble=true;}},preventDefault:function(M){if(M.preventDefault){M.preventDefault();}else{M.returnValue=false;}},getEvent:function(O,M){var N=O||window.event;if(!N){var P=this.getEvent.caller;while(P){N=P.arguments[0];if(N&&Event==N.constructor){break;}P=P.caller;}}return N;},getCharCode:function(N){var M=N.keyCode||N.charCode||0;if(YAHOO.env.ua.webkit&&(M in D)){M=D[M];}return M;},_getCacheIndex:function(Q,R,P){for(var O=0,N=I.length;O<N;O=O+1){var M=I[O];if(M&&M[this.FN]==P&&M[this.EL]==Q&&M[this.TYPE]==R){return O;}}return -1;},generateId:function(M){var N=M.id;if(!N){N="yuievtautoid-"+A;++A;M.id=N;}return N;},_isValidCollection:function(N){try{return(N&&typeof N!=="string"&&N.length&&!N.tagName&&!N.alert&&typeof N[0]!=="undefined");}catch(M){return false;}},elCache:{},getEl:function(M){return(typeof M==="string")?document.getElementById(M):M;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(N){if(!H){H=true;var M=YAHOO.util.Event;M._ready();M._tryPreloadAttach();}},_ready:function(N){var M=YAHOO.util.Event;if(!M.DOMReady){M.DOMReady=true;M.DOMReadyEvent.fire();M._simpleRemove(document,"DOMContentLoaded",M._ready);}},_tryPreloadAttach:function(){if(F.length===0){C=0;if(this._interval){clearInterval(this._interval);this._interval=null;}return;}if(this.locked){return;}if(this.isIE){if(!this.DOMReady){this.startInterval();return;}}this.locked=true;var S=!H;if(!S){S=(C>0&&F.length>0);}var R=[];var T=function(V,W){var U=V;if(W.overrideContext){if(W.overrideContext===true){U=W.obj;}else{U=W.overrideContext;}}W.fn.call(U,W.obj);};var N,M,Q,P,O=[];for(N=0,M=F.length;N<M;N=N+1){Q=F[N];if(Q){P=this.getEl(Q.id);if(P){if(Q.checkReady){if(H||P.nextSibling||!S){O.push(Q);F[N]=null;}}else{T(P,Q);F[N]=null;}}else{R.push(Q);}}}for(N=0,M=O.length;N<M;N=N+1){Q=O[N];T(this.getEl(Q.id),Q);}C--;if(S){for(N=F.length-1;N>-1;N--){Q=F[N];if(!Q||!Q.id){F.splice(N,1);}}this.startInterval();}else{if(this._interval){clearInterval(this._interval);this._interval=null;}}this.locked=false;},purgeElement:function(Q,R,T){var O=(YAHOO.lang.isString(Q))?this.getEl(Q):Q;var S=this.getListeners(O,T),P,M;if(S){for(P=S.length-1;P>-1;P--){var N=S[P];this.removeListener(O,N.type,N.fn);}}if(R&&O&&O.childNodes){for(P=0,M=O.childNodes.length;P<M;++P){this.purgeElement(O.childNodes[P],R,T);}}},getListeners:function(O,M){var R=[],N;if(!M){N=[I,J];}else{if(M==="unload"){N=[J];}else{N=[I];}}var T=(YAHOO.lang.isString(O))?this.getEl(O):O;for(var Q=0;Q<N.length;Q=Q+1){var V=N[Q];if(V){for(var S=0,U=V.length;S<U;++S){var P=V[S];if(P&&P[this.EL]===T&&(!M||M===P[this.TYPE])){R.push({type:P[this.TYPE],fn:P[this.FN],obj:P[this.OBJ],adjust:P[this.OVERRIDE],scope:P[this.ADJ_SCOPE],index:S});}}}}return(R.length)?R:null;},_unload:function(T){var N=YAHOO.util.Event,Q,P,O,S,R,U=J.slice(),M;for(Q=0,S=J.length;Q<S;++Q){O=U[Q];if(O){M=window;if(O[N.ADJ_SCOPE]){if(O[N.ADJ_SCOPE]===true){M=O[N.UNLOAD_OBJ];}else{M=O[N.ADJ_SCOPE];}}O[N.FN].call(M,N.getEvent(T,O[N.EL]),O[N.UNLOAD_OBJ]);U[Q]=null;}}O=null;M=null;J=null;if(I){for(P=I.length-1;P>-1;P--){O=I[P];if(O){N.removeListener(O[N.EL],O[N.TYPE],O[N.FN],P);}}O=null;}G=null;N._simpleRemove(window,"unload",N._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var M=document.documentElement,N=document.body;if(M&&(M.scrollTop||M.scrollLeft)){return[M.scrollTop,M.scrollLeft];}else{if(N){return[N.scrollTop,N.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(O,P,N,M){O.addEventListener(P,N,(M));};}else{if(window.attachEvent){return function(O,P,N,M){O.attachEvent("on"+P,N);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(O,P,N,M){O.removeEventListener(P,N,(M));};}else{if(window.detachEvent){return function(N,O,M){N.detachEvent("on"+O,M);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
if(EU.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);
}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,overrideContext:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};var A=D||{};var I=this.__yui_events;if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].overrideContext);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};(function(){var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function(D,I,E,F){if(!D){}else{if(!I){}else{if(!E){}}}if(!F){F=YAHOO.util.KeyListener.KEYDOWN;}var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)){D=document.getElementById(D);}if(C.isFunction(E)){G.subscribe(E);}else{G.subscribe(E.fn,E.scope,E.correctScope);}function H(O,N){if(!I.shift){I.shift=false;}if(!I.alt){I.alt=false;}if(!I.ctrl){I.ctrl=false;}if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl){var J,M=I.keys,L;if(YAHOO.lang.isArray(M)){for(var K=0;K<M.length;K++){J=M[K];L=A.getCharCode(O);if(J==L){G.fire(L,O);break;}}}else{L=A.getCharCode(O);if(M==L){G.fire(L,O);}}}}this.enable=function(){if(!this.enabled){A.on(D,F,H);this.enabledEvent.fire(I);}this.enabled=true;};this.disable=function(){if(this.enabled){A.removeListener(D,F,H);this.disabledEvent.fire(I);}this.enabled=false;};this.toString=function(){return"KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":"");};};var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};})();YAHOO.register("event",YAHOO.util.Event,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/event/event-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.util.Connect={_msxml_progid:["Microsoft.XMLHTTP","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"],_http_headers:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded; charset=UTF-8",_default_form_header:"application/x-www-form-urlencoded",_use_default_xhr_header:true,_default_xhr_header:"XMLHttpRequest",_has_default_headers:true,_default_headers:{},_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,_submitElementValue:null,_hasSubmitListener:(function(){if(YAHOO.util.Event){YAHOO.util.Event.addListener(document,"click",function(C){var B=YAHOO.util.Event.getTarget(C),A=B.nodeName.toLowerCase();if((A==="input"||A==="button")&&(B.type&&B.type.toLowerCase()=="submit")){YAHOO.util.Connect._submitElementValue=encodeURIComponent(B.name)+"="+encodeURIComponent(B.value);}});return true;}return false;})(),startEvent:new YAHOO.util.CustomEvent("start"),completeEvent:new YAHOO.util.CustomEvent("complete"),successEvent:new YAHOO.util.CustomEvent("success"),failureEvent:new YAHOO.util.CustomEvent("failure"),uploadEvent:new YAHOO.util.CustomEvent("upload"),abortEvent:new YAHOO.util.CustomEvent("abort"),_customEvents:{onStart:["startEvent","start"],onComplete:["completeEvent","complete"],onSuccess:["successEvent","success"],onFailure:["failureEvent","failure"],onUpload:["uploadEvent","upload"],onAbort:["abortEvent","abort"]},setProgId:function(A){this._msxml_progid.unshift(A);},setDefaultPostHeader:function(A){if(typeof A=="string"){this._default_post_header=A;}else{if(typeof A=="boolean"){this._use_default_post_header=A;}}},setDefaultXhrHeader:function(A){if(typeof A=="string"){this._default_xhr_header=A;}else{this._use_default_xhr_header=A;}},setPollingInterval:function(A){if(typeof A=="number"&&isFinite(A)){this._polling_interval=A;}},createXhrObject:function(F){var E,A;try{A=new XMLHttpRequest();E={conn:A,tId:F};}catch(D){for(var B=0;B<this._msxml_progid.length;++B){try{A=new ActiveXObject(this._msxml_progid[B]);E={conn:A,tId:F};break;}catch(C){}}}finally{return E;}},getConnectionObject:function(A){var C;var D=this._transaction_id;try{if(!A){C=this.createXhrObject(D);}else{C={};C.tId=D;C.isUpload=true;}if(C){this._transaction_id++;}}catch(B){}finally{return C;}},asyncRequest:function(F,C,E,A){var D=(this._isFileUpload)?this.getConnectionObject(true):this.getConnectionObject();var B=(E&&E.argument)?E.argument:null;if(!D){return null;}else{if(E&&E.customevents){this.initCustomEvents(D,E);}if(this._isFormSubmit){if(this._isFileUpload){this.uploadFile(D,E,C,A);return D;}if(F.toUpperCase()=="GET"){if(this._sFormData.length!==0){C+=((C.indexOf("?")==-1)?"?":"&")+this._sFormData;}}else{if(F.toUpperCase()=="POST"){A=A?this._sFormData+"&"+A:this._sFormData;}}}if(F.toUpperCase()=="GET"&&(E&&E.cache===false)){C+=((C.indexOf("?")==-1)?"?":"&")+"rnd="+new Date().valueOf().toString();}D.conn.open(F,C,true);if(this._use_default_xhr_header){if(!this._default_headers["X-Requested-With"]){this.initHeader("X-Requested-With",this._default_xhr_header,true);}}if((F.toUpperCase()==="POST"&&this._use_default_post_header)&&this._isFormSubmit===false){this.initHeader("Content-Type",this._default_post_header);}if(this._has_default_headers||this._has_http_headers){this.setHeader(D);}this.handleReadyState(D,E);D.conn.send(A||"");if(this._isFormSubmit===true){this.resetFormState();}this.startEvent.fire(D,B);if(D.startEvent){D.startEvent.fire(D,B);}return D;}},initCustomEvents:function(A,C){var B;for(B in C.customevents){if(this._customEvents[B][0]){A[this._customEvents[B][0]]=new YAHOO.util.CustomEvent(this._customEvents[B][1],(C.scope)?C.scope:null);A[this._customEvents[B][0]].subscribe(C.customevents[B]);}}},handleReadyState:function(C,D){var B=this;var A=(D&&D.argument)?D.argument:null;if(D&&D.timeout){this._timeOut[C.tId]=window.setTimeout(function(){B.abort(C,D,true);},D.timeout);}this._poll[C.tId]=window.setInterval(function(){if(C.conn&&C.conn.readyState===4){window.clearInterval(B._poll[C.tId]);delete B._poll[C.tId];if(D&&D.timeout){window.clearTimeout(B._timeOut[C.tId]);delete B._timeOut[C.tId];}B.completeEvent.fire(C,A);if(C.completeEvent){C.completeEvent.fire(C,A);}B.handleTransactionResponse(C,D);}},this._polling_interval);},handleTransactionResponse:function(F,G,A){var D,C;var B=(G&&G.argument)?G.argument:null;try{if(F.conn.status!==undefined&&F.conn.status!==0){D=F.conn.status;}else{D=13030;}}catch(E){D=13030;}if(D>=200&&D<300||D===1223){C=this.createResponseObject(F,B);if(G&&G.success){if(!G.scope){G.success(C);}else{G.success.apply(G.scope,[C]);}}this.successEvent.fire(C);if(F.successEvent){F.successEvent.fire(C);}}else{switch(D){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:C=this.createExceptionObject(F.tId,B,(A?A:false));if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}break;default:C=this.createResponseObject(F,B);if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}}this.failureEvent.fire(C);if(F.failureEvent){F.failureEvent.fire(C);}}this.releaseObject(F);C=null;},createResponseObject:function(A,G){var D={};var I={};try{var C=A.conn.getAllResponseHeaders();var F=C.split("\n");for(var E=0;E<F.length;E++){var B=F[E].indexOf(":");if(B!=-1){I[F[E].substring(0,B)]=F[E].substring(B+2);}}}catch(H){}D.tId=A.tId;D.status=(A.conn.status==1223)?204:A.conn.status;D.statusText=(A.conn.status==1223)?"No Content":A.conn.statusText;D.getResponseHeader=I;D.getAllResponseHeaders=C;D.responseText=A.conn.responseText;D.responseXML=A.conn.responseXML;if(G){D.argument=G;}return D;},createExceptionObject:function(H,D,A){var F=0;var G="communication failure";var C=-1;var B="transaction aborted";var E={};E.tId=H;if(A){E.status=C;E.statusText=B;}else{E.status=F;E.statusText=G;}if(D){E.argument=D;}return E;},initHeader:function(A,D,C){var B=(C)?this._default_headers:this._http_headers;B[A]=D;if(C){this._has_default_headers=true;
}else{this._has_http_headers=true;}},setHeader:function(A){var B;if(this._has_default_headers){for(B in this._default_headers){if(YAHOO.lang.hasOwnProperty(this._default_headers,B)){A.conn.setRequestHeader(B,this._default_headers[B]);}}}if(this._has_http_headers){for(B in this._http_headers){if(YAHOO.lang.hasOwnProperty(this._http_headers,B)){A.conn.setRequestHeader(B,this._http_headers[B]);}}delete this._http_headers;this._http_headers={};this._has_http_headers=false;}},resetDefaultHeaders:function(){delete this._default_headers;this._default_headers={};this._has_default_headers=false;},setForm:function(M,H,C){var L,B,K,I,P,J=false,F=[],O=0,E,G,D,N,A;this.resetFormState();if(typeof M=="string"){L=(document.getElementById(M)||document.forms[M]);}else{if(typeof M=="object"){L=M;}else{return;}}if(H){this.createFrame(C?C:null);this._isFormSubmit=true;this._isFileUpload=true;this._formNode=L;return;}for(E=0,G=L.elements.length;E<G;++E){B=L.elements[E];P=B.disabled;K=B.name;if(!P&&K){K=encodeURIComponent(K)+"=";I=encodeURIComponent(B.value);switch(B.type){case"select-one":if(B.selectedIndex>-1){A=B.options[B.selectedIndex];F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}break;case"select-multiple":if(B.selectedIndex>-1){for(D=B.selectedIndex,N=B.options.length;D<N;++D){A=B.options[D];if(A.selected){F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}}}break;case"radio":case"checkbox":if(B.checked){F[O++]=K+I;}break;case"file":case undefined:case"reset":case"button":break;case"submit":if(J===false){if(this._hasSubmitListener&&this._submitElementValue){F[O++]=this._submitElementValue;}J=true;}break;default:F[O++]=K+I;}}}this._isFormSubmit=true;this._sFormData=F.join("&");this.initHeader("Content-Type",this._default_form_header);return this._sFormData;},resetFormState:function(){this._isFormSubmit=false;this._isFileUpload=false;this._formNode=null;this._sFormData="";},createFrame:function(A){var B="yuiIO"+this._transaction_id;var C;if(YAHOO.env.ua.ie){C=document.createElement('<iframe id="'+B+'" name="'+B+'" />');if(typeof A=="boolean"){C.src="javascript:false";}}else{C=document.createElement("iframe");C.id=B;C.name=B;}C.style.position="absolute";C.style.top="-1000px";C.style.left="-1000px";document.body.appendChild(C);},appendPostData:function(A){var D=[],B=A.split("&"),C,E;for(C=0;C<B.length;C++){E=B[C].indexOf("=");if(E!=-1){D[C]=document.createElement("input");D[C].type="hidden";D[C].name=decodeURIComponent(B[C].substring(0,E));D[C].value=decodeURIComponent(B[C].substring(E+1));this._formNode.appendChild(D[C]);}}return D;},uploadFile:function(D,N,E,C){var I="yuiIO"+D.tId,J="multipart/form-data",L=document.getElementById(I),O=this,K=(N&&N.argument)?N.argument:null,M,H,B,G;var A={action:this._formNode.getAttribute("action"),method:this._formNode.getAttribute("method"),target:this._formNode.getAttribute("target")};this._formNode.setAttribute("action",E);this._formNode.setAttribute("method","POST");this._formNode.setAttribute("target",I);if(YAHOO.env.ua.ie){this._formNode.setAttribute("encoding",J);}else{this._formNode.setAttribute("enctype",J);}if(C){M=this.appendPostData(C);}this._formNode.submit();this.startEvent.fire(D,K);if(D.startEvent){D.startEvent.fire(D,K);}if(N&&N.timeout){this._timeOut[D.tId]=window.setTimeout(function(){O.abort(D,N,true);},N.timeout);}if(M&&M.length>0){for(H=0;H<M.length;H++){this._formNode.removeChild(M[H]);}}for(B in A){if(YAHOO.lang.hasOwnProperty(A,B)){if(A[B]){this._formNode.setAttribute(B,A[B]);}else{this._formNode.removeAttribute(B);}}}this.resetFormState();var F=function(){if(N&&N.timeout){window.clearTimeout(O._timeOut[D.tId]);delete O._timeOut[D.tId];}O.completeEvent.fire(D,K);if(D.completeEvent){D.completeEvent.fire(D,K);}G={tId:D.tId,argument:N.argument};try{G.responseText=L.contentWindow.document.body?L.contentWindow.document.body.innerHTML:L.contentWindow.document.documentElement.textContent;G.responseXML=L.contentWindow.document.XMLDocument?L.contentWindow.document.XMLDocument:L.contentWindow.document;}catch(P){}if(N&&N.upload){if(!N.scope){N.upload(G);}else{N.upload.apply(N.scope,[G]);}}O.uploadEvent.fire(G);if(D.uploadEvent){D.uploadEvent.fire(G);}YAHOO.util.Event.removeListener(L,"load",F);setTimeout(function(){document.body.removeChild(L);O.releaseObject(D);},100);};YAHOO.util.Event.addListener(L,"load",F);},abort:function(E,G,A){var D;var B=(G&&G.argument)?G.argument:null;if(E&&E.conn){if(this.isCallInProgress(E)){E.conn.abort();window.clearInterval(this._poll[E.tId]);delete this._poll[E.tId];if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{if(E&&E.isUpload===true){var C="yuiIO"+E.tId;var F=document.getElementById(C);if(F){YAHOO.util.Event.removeListener(F,"load");document.body.removeChild(F);if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{D=false;}}if(D===true){this.abortEvent.fire(E,B);if(E.abortEvent){E.abortEvent.fire(E,B);}this.handleTransactionResponse(E,G,true);}return D;},isCallInProgress:function(B){if(B&&B.conn){return B.conn.readyState!==4&&B.conn.readyState!==0;}else{if(B&&B.isUpload===true){var A="yuiIO"+B.tId;return document.getElementById(A)?true:false;}else{return false;}}},releaseObject:function(A){if(A&&A.conn){A.conn=null;A=null;}}};YAHOO.register("connection",YAHOO.util.Connect,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/connection/connection-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},get:function(y){var AA,Y,z,x,G;if(y){if(y[l]||y.item){return y;}if(typeof y==="string"){AA=y;y=K.getElementById(y);if(y&&y.id===AA){return y;}else{if(y&&K.all){y=null;Y=K.all[AA];for(x=0,G=Y.length;x<G;++x){if(Y[x].id===AA){return Y[x];}}}}return y;}if(y.DOM_EVENTS){y=y.get("element");}if("length" in y){z=[];for(x=0,G=y.length;x<G;++x){z[z.length]=E.Dom.get(y[x]);}return z;}return y;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];G=S(AF[v],q);x=S(AF[v],R);if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC==c)){if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AB=L.trim(AB);AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom.getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom.getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom.getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});
},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom.getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;Y.setAttribute(G,x);},getAttribute:function(Y,G){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;return Y.getAttribute(G);},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);
}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.7.0",build:"1799"});YAHOO.util.CustomEvent=function(D,C,B,A){this.type=D;this.scope=C||window;this.silent=B;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(A,B,C){if(!A){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(A,B,C);}this.subscribers.push(new YAHOO.util.Subscriber(A,B,C));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var K=[],E=this.subscribers.length;if(!E&&this.silent){return true;}var I=[].slice.call(arguments,0),G=true,D,J=false;if(!this.silent){}var C=this.subscribers.slice(),A=YAHOO.util.Event.throwErrors;for(D=0;D<E;++D){var M=C[D];if(!M){J=true;}else{if(!this.silent){}var L=M.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(I.length>0){B=I[0];}try{G=M.fn.call(L,B,M.obj);}catch(F){this.lastError=F;if(A){throw F;}}}else{try{G=M.fn.call(L,this.type,I,M.obj);}catch(H){this.lastError=H;if(A){throw H;}}}if(false===G){if(!this.silent){}break;}}}return(G!==false);},unsubscribeAll:function(){var A=this.subscribers.length,B;for(B=A-1;B>-1;B--){this._delete(B);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope;}};YAHOO.util.Subscriber=function(A,B,C){this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.overrideContext){if(this.overrideContext===true){return this.obj;}else{return this.overrideContext;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var I=[];var J=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9};var K=YAHOO.env.ua.ie?"focusin":"focus";var L=YAHOO.env.ua.ie?"focusout":"blur";return{POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){var M=this;var N=function(){M._tryPreloadAttach();};this._interval=setInterval(N,this.POLL_INTERVAL);}},onAvailable:function(S,O,Q,R,P){var M=(YAHOO.lang.isString(S))?[S]:S;for(var N=0;N<M.length;N=N+1){F.push({id:M[N],fn:O,obj:Q,overrideContext:R,checkReady:P});}C=this.POLL_RETRYS;this.startInterval();},onContentReady:function(P,M,N,O){this.onAvailable(P,M,N,O,true);},onDOMReady:function(M,N,O){if(this.DOMReady){setTimeout(function(){var P=window;if(O){if(O===true){P=N;}else{P=O;}}M.call(P,"DOMReady",[],N);},0);}else{this.DOMReadyEvent.subscribe(M,N,O);}},_addListener:function(O,M,Y,S,W,b){if(!Y||!Y.call){return false;}if(this._isValidCollection(O)){var Z=true;for(var T=0,V=O.length;T<V;++T){Z=this.on(O[T],M,Y,S,W)&&Z;}return Z;}else{if(YAHOO.lang.isString(O)){var R=this.getEl(O);if(R){O=R;}else{this.onAvailable(O,function(){YAHOO.util.Event.on(O,M,Y,S,W);});return true;}}}if(!O){return false;}if("unload"==M&&S!==this){J[J.length]=[O,M,Y,S,W];return true;}var N=O;if(W){if(W===true){N=S;}else{N=W;}}var P=function(c){return Y.call(N,YAHOO.util.Event.getEvent(c,O),S);};var a=[O,M,Y,P,N,S,W];var U=I.length;I[U]=a;if(this.useLegacyEvent(O,M)){var Q=this.getLegacyIndex(O,M);if(Q==-1||O!=G[Q][0]){Q=G.length;B[O.id+M]=Q;G[Q]=[O,M,O["on"+M]];E[Q]=[];O["on"+M]=function(c){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(c),Q);};}E[Q].push(a);}else{try{this._simpleAdd(O,M,P,b);}catch(X){this.lastError=X;this.removeListener(O,M,Y);return false;}}return true;},addListener:function(N,Q,M,O,P){return this._addListener(N,Q,M,O,P,false);},addFocusListener:function(N,M,O,P){return this._addListener(N,K,M,O,P,true);},removeFocusListener:function(N,M){return this.removeListener(N,K,M);},addBlurListener:function(N,M,O,P){return this._addListener(N,L,M,O,P,true);},removeBlurListener:function(N,M){return this.removeListener(N,L,M);},fireLegacyEvent:function(R,P){var T=true,M,V,U,N,S;V=E[P].slice();for(var O=0,Q=V.length;O<Q;++O){U=V[O];if(U&&U[this.WFN]){N=U[this.ADJ_SCOPE];S=U[this.WFN].call(N,R);T=(T&&S);}}M=G[P];if(M&&M[2]){M[2](R);}return T;},getLegacyIndex:function(N,O){var M=this.generateId(N)+O;if(typeof B[M]=="undefined"){return -1;}else{return B[M];}},useLegacyEvent:function(M,N){return(this.webkit&&this.webkit<419&&("click"==N||"dblclick"==N));},removeListener:function(N,M,V){var Q,T,X;if(typeof N=="string"){N=this.getEl(N);}else{if(this._isValidCollection(N)){var W=true;for(Q=N.length-1;Q>-1;Q--){W=(this.removeListener(N[Q],M,V)&&W);}return W;}}if(!V||!V.call){return this.purgeElement(N,false,M);}if("unload"==M){for(Q=J.length-1;Q>-1;Q--){X=J[Q];if(X&&X[0]==N&&X[1]==M&&X[2]==V){J.splice(Q,1);return true;}}return false;}var R=null;var S=arguments[3];if("undefined"===typeof S){S=this._getCacheIndex(N,M,V);}if(S>=0){R=I[S];}if(!N||!R){return false;}if(this.useLegacyEvent(N,M)){var P=this.getLegacyIndex(N,M);var O=E[P];if(O){for(Q=0,T=O.length;Q<T;++Q){X=O[Q];if(X&&X[this.EL]==N&&X[this.TYPE]==M&&X[this.FN]==V){O.splice(Q,1);break;}}}}else{try{this._simpleRemove(N,M,R[this.WFN],false);}catch(U){this.lastError=U;return false;}}delete I[S][this.WFN];delete I[S][this.FN];
I.splice(S,1);return true;},getTarget:function(O,N){var M=O.target||O.srcElement;return this.resolveTextNode(M);},resolveTextNode:function(N){try{if(N&&3==N.nodeType){return N.parentNode;}}catch(M){}return N;},getPageX:function(N){var M=N.pageX;if(!M&&0!==M){M=N.clientX||0;if(this.isIE){M+=this._getScrollLeft();}}return M;},getPageY:function(M){var N=M.pageY;if(!N&&0!==N){N=M.clientY||0;if(this.isIE){N+=this._getScrollTop();}}return N;},getXY:function(M){return[this.getPageX(M),this.getPageY(M)];},getRelatedTarget:function(N){var M=N.relatedTarget;if(!M){if(N.type=="mouseout"){M=N.toElement;}else{if(N.type=="mouseover"){M=N.fromElement;}}}return this.resolveTextNode(M);},getTime:function(O){if(!O.time){var N=new Date().getTime();try{O.time=N;}catch(M){this.lastError=M;return N;}}return O.time;},stopEvent:function(M){this.stopPropagation(M);this.preventDefault(M);},stopPropagation:function(M){if(M.stopPropagation){M.stopPropagation();}else{M.cancelBubble=true;}},preventDefault:function(M){if(M.preventDefault){M.preventDefault();}else{M.returnValue=false;}},getEvent:function(O,M){var N=O||window.event;if(!N){var P=this.getEvent.caller;while(P){N=P.arguments[0];if(N&&Event==N.constructor){break;}P=P.caller;}}return N;},getCharCode:function(N){var M=N.keyCode||N.charCode||0;if(YAHOO.env.ua.webkit&&(M in D)){M=D[M];}return M;},_getCacheIndex:function(Q,R,P){for(var O=0,N=I.length;O<N;O=O+1){var M=I[O];if(M&&M[this.FN]==P&&M[this.EL]==Q&&M[this.TYPE]==R){return O;}}return -1;},generateId:function(M){var N=M.id;if(!N){N="yuievtautoid-"+A;++A;M.id=N;}return N;},_isValidCollection:function(N){try{return(N&&typeof N!=="string"&&N.length&&!N.tagName&&!N.alert&&typeof N[0]!=="undefined");}catch(M){return false;}},elCache:{},getEl:function(M){return(typeof M==="string")?document.getElementById(M):M;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(N){if(!H){H=true;var M=YAHOO.util.Event;M._ready();M._tryPreloadAttach();}},_ready:function(N){var M=YAHOO.util.Event;if(!M.DOMReady){M.DOMReady=true;M.DOMReadyEvent.fire();M._simpleRemove(document,"DOMContentLoaded",M._ready);}},_tryPreloadAttach:function(){if(F.length===0){C=0;if(this._interval){clearInterval(this._interval);this._interval=null;}return;}if(this.locked){return;}if(this.isIE){if(!this.DOMReady){this.startInterval();return;}}this.locked=true;var S=!H;if(!S){S=(C>0&&F.length>0);}var R=[];var T=function(V,W){var U=V;if(W.overrideContext){if(W.overrideContext===true){U=W.obj;}else{U=W.overrideContext;}}W.fn.call(U,W.obj);};var N,M,Q,P,O=[];for(N=0,M=F.length;N<M;N=N+1){Q=F[N];if(Q){P=this.getEl(Q.id);if(P){if(Q.checkReady){if(H||P.nextSibling||!S){O.push(Q);F[N]=null;}}else{T(P,Q);F[N]=null;}}else{R.push(Q);}}}for(N=0,M=O.length;N<M;N=N+1){Q=O[N];T(this.getEl(Q.id),Q);}C--;if(S){for(N=F.length-1;N>-1;N--){Q=F[N];if(!Q||!Q.id){F.splice(N,1);}}this.startInterval();}else{if(this._interval){clearInterval(this._interval);this._interval=null;}}this.locked=false;},purgeElement:function(Q,R,T){var O=(YAHOO.lang.isString(Q))?this.getEl(Q):Q;var S=this.getListeners(O,T),P,M;if(S){for(P=S.length-1;P>-1;P--){var N=S[P];this.removeListener(O,N.type,N.fn);}}if(R&&O&&O.childNodes){for(P=0,M=O.childNodes.length;P<M;++P){this.purgeElement(O.childNodes[P],R,T);}}},getListeners:function(O,M){var R=[],N;if(!M){N=[I,J];}else{if(M==="unload"){N=[J];}else{N=[I];}}var T=(YAHOO.lang.isString(O))?this.getEl(O):O;for(var Q=0;Q<N.length;Q=Q+1){var V=N[Q];if(V){for(var S=0,U=V.length;S<U;++S){var P=V[S];if(P&&P[this.EL]===T&&(!M||M===P[this.TYPE])){R.push({type:P[this.TYPE],fn:P[this.FN],obj:P[this.OBJ],adjust:P[this.OVERRIDE],scope:P[this.ADJ_SCOPE],index:S});}}}}return(R.length)?R:null;},_unload:function(T){var N=YAHOO.util.Event,Q,P,O,S,R,U=J.slice(),M;for(Q=0,S=J.length;Q<S;++Q){O=U[Q];if(O){M=window;if(O[N.ADJ_SCOPE]){if(O[N.ADJ_SCOPE]===true){M=O[N.UNLOAD_OBJ];}else{M=O[N.ADJ_SCOPE];}}O[N.FN].call(M,N.getEvent(T,O[N.EL]),O[N.UNLOAD_OBJ]);U[Q]=null;}}O=null;M=null;J=null;if(I){for(P=I.length-1;P>-1;P--){O=I[P];if(O){N.removeListener(O[N.EL],O[N.TYPE],O[N.FN],P);}}O=null;}G=null;N._simpleRemove(window,"unload",N._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var M=document.documentElement,N=document.body;if(M&&(M.scrollTop||M.scrollLeft)){return[M.scrollTop,M.scrollLeft];}else{if(N){return[N.scrollTop,N.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(O,P,N,M){O.addEventListener(P,N,(M));};}else{if(window.attachEvent){return function(O,P,N,M){O.attachEvent("on"+P,N);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(O,P,N,M){O.removeEventListener(P,N,(M));};}else{if(window.detachEvent){return function(N,O,M){N.detachEvent("on"+O,M);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
if(EU.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);
}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,overrideContext:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};var A=D||{};var I=this.__yui_events;if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].overrideContext);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};(function(){var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function(D,I,E,F){if(!D){}else{if(!I){}else{if(!E){}}}if(!F){F=YAHOO.util.KeyListener.KEYDOWN;}var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)){D=document.getElementById(D);}if(C.isFunction(E)){G.subscribe(E);}else{G.subscribe(E.fn,E.scope,E.correctScope);}function H(O,N){if(!I.shift){I.shift=false;}if(!I.alt){I.alt=false;}if(!I.ctrl){I.ctrl=false;}if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl){var J,M=I.keys,L;if(YAHOO.lang.isArray(M)){for(var K=0;K<M.length;K++){J=M[K];L=A.getCharCode(O);if(J==L){G.fire(L,O);break;}}}else{L=A.getCharCode(O);if(M==L){G.fire(L,O);}}}}this.enable=function(){if(!this.enabled){A.on(D,F,H);this.enabledEvent.fire(I);}this.enabled=true;};this.disable=function(){if(this.enabled){A.removeListener(D,F,H);this.disabledEvent.fire(I);}this.enabled=false;};this.toString=function(){return"KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":"");};};var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};})();YAHOO.register("event",YAHOO.util.Event,{version:"2.7.0",build:"1799"});YAHOO.register("yahoo-dom-event", YAHOO, {version: "2.7.0", build: "1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/yahoo-dom-event/yahoo-dom-event.js');
};

/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var B=YAHOO.util;var A=function(D,C,E,F){if(!D){}this.init(D,C,E,F);};A.NAME="Anim";A.prototype={toString:function(){var C=this.getEl()||{};var D=C.id||C.tagName;return(this.constructor.NAME+": "+D);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(C,E,D){return this.method(this.currentFrame,E,D-E,this.totalFrames);},setAttribute:function(C,F,E){var D=this.getEl();if(this.patterns.noNegatives.test(C)){F=(F>0)?F:0;}if("style" in D){B.Dom.setStyle(D,C,F+E);}else{if(C in D){D[C]=F;}}},getAttribute:function(C){var E=this.getEl();var G=B.Dom.getStyle(E,C);if(G!=="auto"&&!this.patterns.offsetUnit.test(G)){return parseFloat(G);}var D=this.patterns.offsetAttribute.exec(C)||[];var H=!!(D[3]);var F=!!(D[2]);if("style" in E){if(F||(B.Dom.getStyle(E,"position")=="absolute"&&H)){G=E["offset"+D[0].charAt(0).toUpperCase()+D[0].substr(1)];}else{G=0;}}else{if(C in E){G=E[C];}}return G;},getDefaultUnit:function(C){if(this.patterns.defaultUnit.test(C)){return"px";}return"";},setRuntimeAttribute:function(D){var I;var E;var F=this.attributes;this.runtimeAttributes[D]={};var H=function(J){return(typeof J!=="undefined");};if(!H(F[D]["to"])&&!H(F[D]["by"])){return false;}I=(H(F[D]["from"]))?F[D]["from"]:this.getAttribute(D);if(H(F[D]["to"])){E=F[D]["to"];}else{if(H(F[D]["by"])){if(I.constructor==Array){E=[];for(var G=0,C=I.length;G<C;++G){E[G]=I[G]+F[D]["by"][G]*1;}}else{E=I+F[D]["by"]*1;}}}this.runtimeAttributes[D].start=I;this.runtimeAttributes[D].end=E;this.runtimeAttributes[D].unit=(H(F[D].unit))?F[D]["unit"]:this.getDefaultUnit(D);return true;},init:function(E,J,I,C){var D=false;var F=null;var H=0;E=B.Dom.get(E);this.attributes=J||{};this.duration=!YAHOO.lang.isUndefined(I)?I:1;this.method=C||B.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=B.AnimMgr.fps;this.setEl=function(M){E=B.Dom.get(M);};this.getEl=function(){return E;};this.isAnimated=function(){return D;};this.getStartTime=function(){return F;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(B.AnimMgr.fps*this.duration):this.duration;if(this.duration===0&&this.useSeconds){this.totalFrames=1;}B.AnimMgr.registerElement(this);return true;};this.stop=function(M){if(!this.isAnimated()){return false;}if(M){this.currentFrame=this.totalFrames;this._onTween.fire();}B.AnimMgr.stop(this);};var L=function(){this.onStart.fire();this.runtimeAttributes={};for(var M in this.attributes){this.setRuntimeAttribute(M);}D=true;H=0;F=new Date();};var K=function(){var O={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};O.toString=function(){return("duration: "+O.duration+", currentFrame: "+O.currentFrame);};this.onTween.fire(O);var N=this.runtimeAttributes;for(var M in N){this.setAttribute(M,this.doMethod(M,N[M].start,N[M].end),N[M].unit);}H+=1;};var G=function(){var M=(new Date()-F)/1000;var N={duration:M,frames:H,fps:H/M};N.toString=function(){return("duration: "+N.duration+", frames: "+N.frames+", fps: "+N.fps);};D=false;H=0;this.onComplete.fire(N);};this._onStart=new B.CustomEvent("_start",this,true);this.onStart=new B.CustomEvent("start",this);this.onTween=new B.CustomEvent("tween",this);this._onTween=new B.CustomEvent("_tween",this,true);this.onComplete=new B.CustomEvent("complete",this);this._onComplete=new B.CustomEvent("_complete",this,true);this._onStart.subscribe(L);this._onTween.subscribe(K);this._onComplete.subscribe(G);}};B.Anim=A;})();YAHOO.util.AnimMgr=new function(){var C=null;var B=[];var A=0;this.fps=1000;this.delay=1;this.registerElement=function(F){B[B.length]=F;A+=1;F._onStart.fire();this.start();};this.unRegister=function(G,F){F=F||E(G);if(!G.isAnimated()||F==-1){return false;}G._onComplete.fire();B.splice(F,1);A-=1;if(A<=0){this.stop();}return true;};this.start=function(){if(C===null){C=setInterval(this.run,this.delay);}};this.stop=function(H){if(!H){clearInterval(C);for(var G=0,F=B.length;G<F;++G){this.unRegister(B[0],0);}B=[];C=null;A=0;}else{this.unRegister(H);}};this.run=function(){for(var H=0,F=B.length;H<F;++H){var G=B[H];if(!G||!G.isAnimated()){continue;}if(G.currentFrame<G.totalFrames||G.totalFrames===null){G.currentFrame+=1;if(G.useSeconds){D(G);}G._onTween.fire();}else{YAHOO.util.AnimMgr.stop(G,H);}}};var E=function(H){for(var G=0,F=B.length;G<F;++G){if(B[G]==H){return G;}}return -1;};var D=function(G){var J=G.totalFrames;var I=G.currentFrame;var H=(G.currentFrame*G.duration*1000/G.totalFrames);var F=(new Date()-G.getStartTime());var K=0;if(F<G.duration*1000){K=Math.round((F/H-1)*G.currentFrame);}else{K=J-(I+1);}if(K>0&&isFinite(K)){if(G.currentFrame+K>=J){K=J-(I+1);}G.currentFrame+=K;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(E,D){var F=E.length;var C=[];for(var B=0;B<F;++B){C[B]=[E[B][0],E[B][1]];}for(var A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1];}}return[C[0][0],C[0][1]];};};(function(){var A=function(F,E,G,H){A.superclass.constructor.call(this,F,E,G,H);};A.NAME="ColorAnim";A.DEFAULT_BGCOLOR="#fff";var C=YAHOO.util;YAHOO.extend(A,C.Anim);var D=A.superclass;var B=A.prototype;B.patterns.color=/color$/i;B.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;B.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;B.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;B.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;B.parseColor=function(E){if(E.length==3){return E;}var F=this.patterns.hex.exec(E);if(F&&F.length==4){return[parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16)];}F=this.patterns.rgb.exec(E);if(F&&F.length==4){return[parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10)];}F=this.patterns.hex3.exec(E);if(F&&F.length==4){return[parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16)];
}return null;};B.getAttribute=function(E){var G=this.getEl();if(this.patterns.color.test(E)){var I=YAHOO.util.Dom.getStyle(G,E);var H=this;if(this.patterns.transparent.test(I)){var F=YAHOO.util.Dom.getAncestorBy(G,function(J){return !H.patterns.transparent.test(I);});if(F){I=C.Dom.getStyle(F,E);}else{I=A.DEFAULT_BGCOLOR;}}}else{I=D.getAttribute.call(this,E);}return I;};B.doMethod=function(F,J,G){var I;if(this.patterns.color.test(F)){I=[];for(var H=0,E=J.length;H<E;++H){I[H]=D.doMethod.call(this,F,J[H],G[H]);}I="rgb("+Math.floor(I[0])+","+Math.floor(I[1])+","+Math.floor(I[2])+")";}else{I=D.doMethod.call(this,F,J,G);}return I;};B.setRuntimeAttribute=function(F){D.setRuntimeAttribute.call(this,F);if(this.patterns.color.test(F)){var H=this.attributes;var J=this.parseColor(this.runtimeAttributes[F].start);var G=this.parseColor(this.runtimeAttributes[F].end);if(typeof H[F]["to"]==="undefined"&&typeof H[F]["by"]!=="undefined"){G=this.parseColor(H[F].by);for(var I=0,E=J.length;I<E;++I){G[I]=J[I]+G[I];}}this.runtimeAttributes[F].start=J;this.runtimeAttributes[F].end=G;}};C.ColorAnim=A;})();
/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
YAHOO.util.Easing={easeNone:function(B,A,D,C){return D*B/C+A;},easeIn:function(B,A,D,C){return D*(B/=C)*B+A;},easeOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A;},easeBoth:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A;}return -D/2*((--B)*(B-2)-1)+A;},easeInStrong:function(B,A,D,C){return D*(B/=C)*B*B*B+A;},easeOutStrong:function(B,A,D,C){return -D*((B=B/C-1)*B*B*B-1)+A;},easeBothStrong:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B*B+A;}return -D/2*((B-=2)*B*B*B-2)+A;},elasticIn:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return -(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;},elasticOut:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return B*Math.pow(2,-10*C)*Math.sin((C*F-D)*(2*Math.PI)/E)+G+A;},elasticBoth:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F/2)==2){return A+G;}if(!E){E=F*(0.3*1.5);}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}if(C<1){return -0.5*(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;}return B*Math.pow(2,-10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E)*0.5+G+A;},backIn:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*(B/=D)*B*((C+1)*B-C)+A;},backOut:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*((B=B/D-1)*B*((C+1)*B+C)+1)+A;},backBoth:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}if((B/=D/2)<1){return E/2*(B*B*(((C*=(1.525))+1)*B-C))+A;}return E/2*((B-=2)*B*(((C*=(1.525))+1)*B+C)+2)+A;},bounceIn:function(B,A,D,C){return D-YAHOO.util.Easing.bounceOut(C-B,0,D,C)+A;},bounceOut:function(B,A,D,C){if((B/=C)<(1/2.75)){return D*(7.5625*B*B)+A;}else{if(B<(2/2.75)){return D*(7.5625*(B-=(1.5/2.75))*B+0.75)+A;}else{if(B<(2.5/2.75)){return D*(7.5625*(B-=(2.25/2.75))*B+0.9375)+A;}}}return D*(7.5625*(B-=(2.625/2.75))*B+0.984375)+A;},bounceBoth:function(B,A,D,C){if(B<C/2){return YAHOO.util.Easing.bounceIn(B*2,0,D,C)*0.5+A;}return YAHOO.util.Easing.bounceOut(B*2-C,0,D,C)*0.5+D*0.5+A;}};(function(){var A=function(H,G,I,J){if(H){A.superclass.constructor.call(this,H,G,I,J);}};A.NAME="Motion";var E=YAHOO.util;YAHOO.extend(A,E.ColorAnim);var F=A.superclass;var C=A.prototype;C.patterns.points=/^points$/i;C.setAttribute=function(G,I,H){if(this.patterns.points.test(G)){H=H||"px";F.setAttribute.call(this,"left",I[0],H);F.setAttribute.call(this,"top",I[1],H);}else{F.setAttribute.call(this,G,I,H);}};C.getAttribute=function(G){if(this.patterns.points.test(G)){var H=[F.getAttribute.call(this,"left"),F.getAttribute.call(this,"top")];}else{H=F.getAttribute.call(this,G);}return H;};C.doMethod=function(G,K,H){var J=null;if(this.patterns.points.test(G)){var I=this.method(this.currentFrame,0,100,this.totalFrames)/100;J=E.Bezier.getPosition(this.runtimeAttributes[G],I);}else{J=F.doMethod.call(this,G,K,H);}return J;};C.setRuntimeAttribute=function(P){if(this.patterns.points.test(P)){var H=this.getEl();var J=this.attributes;var G;var L=J["points"]["control"]||[];var I;var M,O;if(L.length>0&&!(L[0] instanceof Array)){L=[L];}else{var K=[];for(M=0,O=L.length;M<O;++M){K[M]=L[M];}L=K;}if(E.Dom.getStyle(H,"position")=="static"){E.Dom.setStyle(H,"position","relative");}if(D(J["points"]["from"])){E.Dom.setXY(H,J["points"]["from"]);
}else{E.Dom.setXY(H,E.Dom.getXY(H));}G=this.getAttribute("points");if(D(J["points"]["to"])){I=B.call(this,J["points"]["to"],G);var N=E.Dom.getXY(this.getEl());for(M=0,O=L.length;M<O;++M){L[M]=B.call(this,L[M],G);}}else{if(D(J["points"]["by"])){I=[G[0]+J["points"]["by"][0],G[1]+J["points"]["by"][1]];for(M=0,O=L.length;M<O;++M){L[M]=[G[0]+L[M][0],G[1]+L[M][1]];}}}this.runtimeAttributes[P]=[G];if(L.length>0){this.runtimeAttributes[P]=this.runtimeAttributes[P].concat(L);}this.runtimeAttributes[P][this.runtimeAttributes[P].length]=I;}else{F.setRuntimeAttribute.call(this,P);}};var B=function(G,I){var H=E.Dom.getXY(this.getEl());G=[G[0]-H[0]+I[0],G[1]-H[1]+I[1]];return G;};var D=function(G){return(typeof G!=="undefined");};E.Motion=A;})();(function(){var D=function(F,E,G,H){if(F){D.superclass.constructor.call(this,F,E,G,H);}};D.NAME="Scroll";var B=YAHOO.util;YAHOO.extend(D,B.ColorAnim);var C=D.superclass;var A=D.prototype;A.doMethod=function(E,H,F){var G=null;if(E=="scroll"){G=[this.method(this.currentFrame,H[0],F[0]-H[0],this.totalFrames),this.method(this.currentFrame,H[1],F[1]-H[1],this.totalFrames)];}else{G=C.doMethod.call(this,E,H,F);}return G;};A.getAttribute=function(E){var G=null;var F=this.getEl();if(E=="scroll"){G=[F.scrollLeft,F.scrollTop];}else{G=C.getAttribute.call(this,E);}return G;};A.setAttribute=function(E,H,G){var F=this.getEl();if(E=="scroll"){F.scrollLeft=H[0];F.scrollTop=H[1];}else{C.setAttribute.call(this,E,H,G);}};B.Scroll=D;})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/animation/animation-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.util.Connect={_msxml_progid:["Microsoft.XMLHTTP","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"],_http_headers:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded; charset=UTF-8",_default_form_header:"application/x-www-form-urlencoded",_use_default_xhr_header:true,_default_xhr_header:"XMLHttpRequest",_has_default_headers:true,_default_headers:{},_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,_submitElementValue:null,_hasSubmitListener:(function(){if(YAHOO.util.Event){YAHOO.util.Event.addListener(document,"click",function(C){var B=YAHOO.util.Event.getTarget(C),A=B.nodeName.toLowerCase();if((A==="input"||A==="button")&&(B.type&&B.type.toLowerCase()=="submit")){YAHOO.util.Connect._submitElementValue=encodeURIComponent(B.name)+"="+encodeURIComponent(B.value);}});return true;}return false;})(),startEvent:new YAHOO.util.CustomEvent("start"),completeEvent:new YAHOO.util.CustomEvent("complete"),successEvent:new YAHOO.util.CustomEvent("success"),failureEvent:new YAHOO.util.CustomEvent("failure"),uploadEvent:new YAHOO.util.CustomEvent("upload"),abortEvent:new YAHOO.util.CustomEvent("abort"),_customEvents:{onStart:["startEvent","start"],onComplete:["completeEvent","complete"],onSuccess:["successEvent","success"],onFailure:["failureEvent","failure"],onUpload:["uploadEvent","upload"],onAbort:["abortEvent","abort"]},setProgId:function(A){this._msxml_progid.unshift(A);},setDefaultPostHeader:function(A){if(typeof A=="string"){this._default_post_header=A;}else{if(typeof A=="boolean"){this._use_default_post_header=A;}}},setDefaultXhrHeader:function(A){if(typeof A=="string"){this._default_xhr_header=A;}else{this._use_default_xhr_header=A;}},setPollingInterval:function(A){if(typeof A=="number"&&isFinite(A)){this._polling_interval=A;}},createXhrObject:function(F){var E,A;try{A=new XMLHttpRequest();E={conn:A,tId:F};}catch(D){for(var B=0;B<this._msxml_progid.length;++B){try{A=new ActiveXObject(this._msxml_progid[B]);E={conn:A,tId:F};break;}catch(C){}}}finally{return E;}},getConnectionObject:function(A){var C;var D=this._transaction_id;try{if(!A){C=this.createXhrObject(D);}else{C={};C.tId=D;C.isUpload=true;}if(C){this._transaction_id++;}}catch(B){}finally{return C;}},asyncRequest:function(F,C,E,A){var D=(this._isFileUpload)?this.getConnectionObject(true):this.getConnectionObject();var B=(E&&E.argument)?E.argument:null;if(!D){return null;}else{if(E&&E.customevents){this.initCustomEvents(D,E);}if(this._isFormSubmit){if(this._isFileUpload){this.uploadFile(D,E,C,A);return D;}if(F.toUpperCase()=="GET"){if(this._sFormData.length!==0){C+=((C.indexOf("?")==-1)?"?":"&")+this._sFormData;}}else{if(F.toUpperCase()=="POST"){A=A?this._sFormData+"&"+A:this._sFormData;}}}if(F.toUpperCase()=="GET"&&(E&&E.cache===false)){C+=((C.indexOf("?")==-1)?"?":"&")+"rnd="+new Date().valueOf().toString();}D.conn.open(F,C,true);if(this._use_default_xhr_header){if(!this._default_headers["X-Requested-With"]){this.initHeader("X-Requested-With",this._default_xhr_header,true);}}if((F.toUpperCase()==="POST"&&this._use_default_post_header)&&this._isFormSubmit===false){this.initHeader("Content-Type",this._default_post_header);}if(this._has_default_headers||this._has_http_headers){this.setHeader(D);}this.handleReadyState(D,E);D.conn.send(A||"");if(this._isFormSubmit===true){this.resetFormState();}this.startEvent.fire(D,B);if(D.startEvent){D.startEvent.fire(D,B);}return D;}},initCustomEvents:function(A,C){var B;for(B in C.customevents){if(this._customEvents[B][0]){A[this._customEvents[B][0]]=new YAHOO.util.CustomEvent(this._customEvents[B][1],(C.scope)?C.scope:null);A[this._customEvents[B][0]].subscribe(C.customevents[B]);}}},handleReadyState:function(C,D){var B=this;var A=(D&&D.argument)?D.argument:null;if(D&&D.timeout){this._timeOut[C.tId]=window.setTimeout(function(){B.abort(C,D,true);},D.timeout);}this._poll[C.tId]=window.setInterval(function(){if(C.conn&&C.conn.readyState===4){window.clearInterval(B._poll[C.tId]);delete B._poll[C.tId];if(D&&D.timeout){window.clearTimeout(B._timeOut[C.tId]);delete B._timeOut[C.tId];}B.completeEvent.fire(C,A);if(C.completeEvent){C.completeEvent.fire(C,A);}B.handleTransactionResponse(C,D);}},this._polling_interval);},handleTransactionResponse:function(F,G,A){var D,C;var B=(G&&G.argument)?G.argument:null;try{if(F.conn.status!==undefined&&F.conn.status!==0){D=F.conn.status;}else{D=13030;}}catch(E){D=13030;}if(D>=200&&D<300||D===1223){C=this.createResponseObject(F,B);if(G&&G.success){if(!G.scope){G.success(C);}else{G.success.apply(G.scope,[C]);}}this.successEvent.fire(C);if(F.successEvent){F.successEvent.fire(C);}}else{switch(D){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:C=this.createExceptionObject(F.tId,B,(A?A:false));if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}break;default:C=this.createResponseObject(F,B);if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}}this.failureEvent.fire(C);if(F.failureEvent){F.failureEvent.fire(C);}}this.releaseObject(F);C=null;},createResponseObject:function(A,G){var D={};var I={};try{var C=A.conn.getAllResponseHeaders();var F=C.split("\n");for(var E=0;E<F.length;E++){var B=F[E].indexOf(":");if(B!=-1){I[F[E].substring(0,B)]=F[E].substring(B+2);}}}catch(H){}D.tId=A.tId;D.status=(A.conn.status==1223)?204:A.conn.status;D.statusText=(A.conn.status==1223)?"No Content":A.conn.statusText;D.getResponseHeader=I;D.getAllResponseHeaders=C;D.responseText=A.conn.responseText;D.responseXML=A.conn.responseXML;if(G){D.argument=G;}return D;},createExceptionObject:function(H,D,A){var F=0;var G="communication failure";var C=-1;var B="transaction aborted";var E={};E.tId=H;if(A){E.status=C;E.statusText=B;}else{E.status=F;E.statusText=G;}if(D){E.argument=D;}return E;},initHeader:function(A,D,C){var B=(C)?this._default_headers:this._http_headers;B[A]=D;if(C){this._has_default_headers=true;
}else{this._has_http_headers=true;}},setHeader:function(A){var B;if(this._has_default_headers){for(B in this._default_headers){if(YAHOO.lang.hasOwnProperty(this._default_headers,B)){A.conn.setRequestHeader(B,this._default_headers[B]);}}}if(this._has_http_headers){for(B in this._http_headers){if(YAHOO.lang.hasOwnProperty(this._http_headers,B)){A.conn.setRequestHeader(B,this._http_headers[B]);}}delete this._http_headers;this._http_headers={};this._has_http_headers=false;}},resetDefaultHeaders:function(){delete this._default_headers;this._default_headers={};this._has_default_headers=false;},setForm:function(M,H,C){var L,B,K,I,P,J=false,F=[],O=0,E,G,D,N,A;this.resetFormState();if(typeof M=="string"){L=(document.getElementById(M)||document.forms[M]);}else{if(typeof M=="object"){L=M;}else{return;}}if(H){this.createFrame(C?C:null);this._isFormSubmit=true;this._isFileUpload=true;this._formNode=L;return;}for(E=0,G=L.elements.length;E<G;++E){B=L.elements[E];P=B.disabled;K=B.name;if(!P&&K){K=encodeURIComponent(K)+"=";I=encodeURIComponent(B.value);switch(B.type){case"select-one":if(B.selectedIndex>-1){A=B.options[B.selectedIndex];F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}break;case"select-multiple":if(B.selectedIndex>-1){for(D=B.selectedIndex,N=B.options.length;D<N;++D){A=B.options[D];if(A.selected){F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}}}break;case"radio":case"checkbox":if(B.checked){F[O++]=K+I;}break;case"file":case undefined:case"reset":case"button":break;case"submit":if(J===false){if(this._hasSubmitListener&&this._submitElementValue){F[O++]=this._submitElementValue;}J=true;}break;default:F[O++]=K+I;}}}this._isFormSubmit=true;this._sFormData=F.join("&");this.initHeader("Content-Type",this._default_form_header);return this._sFormData;},resetFormState:function(){this._isFormSubmit=false;this._isFileUpload=false;this._formNode=null;this._sFormData="";},createFrame:function(A){var B="yuiIO"+this._transaction_id;var C;if(YAHOO.env.ua.ie){C=document.createElement('<iframe id="'+B+'" name="'+B+'" />');if(typeof A=="boolean"){C.src="javascript:false";}}else{C=document.createElement("iframe");C.id=B;C.name=B;}C.style.position="absolute";C.style.top="-1000px";C.style.left="-1000px";document.body.appendChild(C);},appendPostData:function(A){var D=[],B=A.split("&"),C,E;for(C=0;C<B.length;C++){E=B[C].indexOf("=");if(E!=-1){D[C]=document.createElement("input");D[C].type="hidden";D[C].name=decodeURIComponent(B[C].substring(0,E));D[C].value=decodeURIComponent(B[C].substring(E+1));this._formNode.appendChild(D[C]);}}return D;},uploadFile:function(D,N,E,C){var I="yuiIO"+D.tId,J="multipart/form-data",L=document.getElementById(I),O=this,K=(N&&N.argument)?N.argument:null,M,H,B,G;var A={action:this._formNode.getAttribute("action"),method:this._formNode.getAttribute("method"),target:this._formNode.getAttribute("target")};this._formNode.setAttribute("action",E);this._formNode.setAttribute("method","POST");this._formNode.setAttribute("target",I);if(YAHOO.env.ua.ie){this._formNode.setAttribute("encoding",J);}else{this._formNode.setAttribute("enctype",J);}if(C){M=this.appendPostData(C);}this._formNode.submit();this.startEvent.fire(D,K);if(D.startEvent){D.startEvent.fire(D,K);}if(N&&N.timeout){this._timeOut[D.tId]=window.setTimeout(function(){O.abort(D,N,true);},N.timeout);}if(M&&M.length>0){for(H=0;H<M.length;H++){this._formNode.removeChild(M[H]);}}for(B in A){if(YAHOO.lang.hasOwnProperty(A,B)){if(A[B]){this._formNode.setAttribute(B,A[B]);}else{this._formNode.removeAttribute(B);}}}this.resetFormState();var F=function(){if(N&&N.timeout){window.clearTimeout(O._timeOut[D.tId]);delete O._timeOut[D.tId];}O.completeEvent.fire(D,K);if(D.completeEvent){D.completeEvent.fire(D,K);}G={tId:D.tId,argument:N.argument};try{G.responseText=L.contentWindow.document.body?L.contentWindow.document.body.innerHTML:L.contentWindow.document.documentElement.textContent;G.responseXML=L.contentWindow.document.XMLDocument?L.contentWindow.document.XMLDocument:L.contentWindow.document;}catch(P){}if(N&&N.upload){if(!N.scope){N.upload(G);}else{N.upload.apply(N.scope,[G]);}}O.uploadEvent.fire(G);if(D.uploadEvent){D.uploadEvent.fire(G);}YAHOO.util.Event.removeListener(L,"load",F);setTimeout(function(){document.body.removeChild(L);O.releaseObject(D);},100);};YAHOO.util.Event.addListener(L,"load",F);},abort:function(E,G,A){var D;var B=(G&&G.argument)?G.argument:null;if(E&&E.conn){if(this.isCallInProgress(E)){E.conn.abort();window.clearInterval(this._poll[E.tId]);delete this._poll[E.tId];if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{if(E&&E.isUpload===true){var C="yuiIO"+E.tId;var F=document.getElementById(C);if(F){YAHOO.util.Event.removeListener(F,"load");document.body.removeChild(F);if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{D=false;}}if(D===true){this.abortEvent.fire(E,B);if(E.abortEvent){E.abortEvent.fire(E,B);}this.handleTransactionResponse(E,G,true);}return D;},isCallInProgress:function(B){if(B&&B.conn){return B.conn.readyState!==4&&B.conn.readyState!==0;}else{if(B&&B.isUpload===true){var A="yuiIO"+B.tId;return document.getElementById(A)?true:false;}else{return false;}}},releaseObject:function(A){if(A&&A.conn){A.conn=null;A=null;}}};YAHOO.register("connection",YAHOO.util.Connect,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/connection/connection-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=function(){var A=YAHOO.util.Event,B=YAHOO.util.Dom;return{useShim:false,_shimActive:false,_shimState:false,_debugShim:false,_createShim:function(){var C=document.createElement("div");C.id="yui-ddm-shim";if(document.body.firstChild){document.body.insertBefore(C,document.body.firstChild);}else{document.body.appendChild(C);}C.style.display="none";C.style.backgroundColor="red";C.style.position="absolute";C.style.zIndex="99999";B.setStyle(C,"opacity","0");this._shim=C;A.on(C,"mouseup",this.handleMouseUp,this,true);A.on(C,"mousemove",this.handleMouseMove,this,true);A.on(window,"scroll",this._sizeShim,this,true);},_sizeShim:function(){if(this._shimActive){var C=this._shim;C.style.height=B.getDocumentHeight()+"px";C.style.width=B.getDocumentWidth()+"px";C.style.top="0";C.style.left="0";}},_activateShim:function(){if(this.useShim){if(!this._shim){this._createShim();}this._shimActive=true;var C=this._shim,D="0";if(this._debugShim){D=".5";}B.setStyle(C,"opacity",D);this._sizeShim();C.style.display="block";}},_deactivateShim:function(){this._shim.style.display="none";this._shimActive=false;},_shim:null,ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initialized:false,locked:false,interactionInfo:null,init:function(){this.initialized=true;},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(E,D){for(var F in this.ids){for(var C in this.ids[F]){var G=this.ids[F][C];if(!this.isTypeOfDD(G)){continue;}G[E].apply(G,D);}}},_onLoad:function(){this.init();A.on(document,"mouseup",this.handleMouseUp,this,true);A.on(document,"mousemove",this.handleMouseMove,this,true);A.on(window,"unload",this._onUnload,this,true);A.on(window,"resize",this._onResize,this,true);},_onResize:function(C){this._execOnAll("resetConstraints",[]);},lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isLocked:function(){return this.locked;},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,fromTimeout:false,regDragDrop:function(D,C){if(!this.initialized){this.init();}if(!this.ids[C]){this.ids[C]={};}this.ids[C][D.id]=D;},removeDDFromGroup:function(E,C){if(!this.ids[C]){this.ids[C]={};}var D=this.ids[C];if(D&&D[E.id]){delete D[E.id];}},_remove:function(E){for(var D in E.groups){if(D){var C=this.ids[D];if(C&&C[E.id]){delete C[E.id];}}}delete this.handleIds[E.id];},regHandle:function(D,C){if(!this.handleIds[D]){this.handleIds[D]={};}this.handleIds[D][C]=C;},isDragDrop:function(C){return(this.getDDById(C))?true:false;},getRelated:function(H,D){var G=[];for(var F in H.groups){for(var E in this.ids[F]){var C=this.ids[F][E];if(!this.isTypeOfDD(C)){continue;}if(!D||C.isTarget){G[G.length]=C;}}}return G;},isLegalTarget:function(G,F){var D=this.getRelated(G,true);for(var E=0,C=D.length;E<C;++E){if(D[E].id==F.id){return true;}}return false;},isTypeOfDD:function(C){return(C&&C.__ygDragDrop);},isHandle:function(D,C){return(this.handleIds[D]&&this.handleIds[D][C]);},getDDById:function(D){for(var C in this.ids){if(this.ids[C][D]){return this.ids[C][D];}}return null;},handleMouseDown:function(E,D){this.currentTarget=YAHOO.util.Event.getTarget(E);this.dragCurrent=D;var C=D.getEl();this.startX=YAHOO.util.Event.getPageX(E);this.startY=YAHOO.util.Event.getPageY(E);this.deltaX=this.startX-C.offsetLeft;this.deltaY=this.startY-C.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var F=YAHOO.util.DDM;F.startDrag(F.startX,F.startY);F.fromTimeout=true;},this.clickTimeThresh);},startDrag:function(C,E){if(this.dragCurrent&&this.dragCurrent.useShim){this._shimState=this.useShim;this.useShim=true;}this._activateShim();clearTimeout(this.clickTimeout);var D=this.dragCurrent;if(D&&D.events.b4StartDrag){D.b4StartDrag(C,E);D.fireEvent("b4StartDragEvent",{x:C,y:E});}if(D&&D.events.startDrag){D.startDrag(C,E);D.fireEvent("startDragEvent",{x:C,y:E});}this.dragThreshMet=true;},handleMouseUp:function(C){if(this.dragCurrent){clearTimeout(this.clickTimeout);if(this.dragThreshMet){if(this.fromTimeout){this.fromTimeout=false;this.handleMouseMove(C);}this.fromTimeout=false;this.fireEvents(C,true);}else{}this.stopDrag(C);this.stopEvent(C);}},stopEvent:function(C){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(C);}if(this.preventDefault){YAHOO.util.Event.preventDefault(C);}},stopDrag:function(E,D){var C=this.dragCurrent;if(C&&!D){if(this.dragThreshMet){if(C.events.b4EndDrag){C.b4EndDrag(E);C.fireEvent("b4EndDragEvent",{e:E});}if(C.events.endDrag){C.endDrag(E);C.fireEvent("endDragEvent",{e:E});}}if(C.events.mouseUp){C.onMouseUp(E);C.fireEvent("mouseUpEvent",{e:E});}}if(this._shimActive){this._deactivateShim();if(this.dragCurrent&&this.dragCurrent.useShim){this.useShim=this._shimState;this._shimState=false;}}this.dragCurrent=null;this.dragOvers={};},handleMouseMove:function(F){var C=this.dragCurrent;if(C){if(YAHOO.util.Event.isIE&&!F.button){this.stopEvent(F);return this.handleMouseUp(F);}else{if(F.clientX<0||F.clientY<0){}}if(!this.dragThreshMet){var E=Math.abs(this.startX-YAHOO.util.Event.getPageX(F));var D=Math.abs(this.startY-YAHOO.util.Event.getPageY(F));if(E>this.clickPixelThresh||D>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}if(this.dragThreshMet){if(C&&C.events.b4Drag){C.b4Drag(F);C.fireEvent("b4DragEvent",{e:F});}if(C&&C.events.drag){C.onDrag(F);C.fireEvent("dragEvent",{e:F});}if(C){this.fireEvents(F,false);}}this.stopEvent(F);}},fireEvents:function(V,L){var a=this.dragCurrent;if(!a||a.isLocked()||a.dragOnly){return;}var N=YAHOO.util.Event.getPageX(V),M=YAHOO.util.Event.getPageY(V),P=new YAHOO.util.Point(N,M),K=a.getTargetCoord(P.x,P.y),F=a.getDragEl(),E=["out","over","drop","enter"],U=new YAHOO.util.Region(K.y,K.x+F.offsetWidth,K.y+F.offsetHeight,K.x),I=[],D={},Q=[],c={outEvts:[],overEvts:[],dropEvts:[],enterEvts:[]};for(var S in this.dragOvers){var d=this.dragOvers[S];if(!this.isTypeOfDD(d)){continue;
}if(!this.isOverTarget(P,d,this.mode,U)){c.outEvts.push(d);}I[S]=true;delete this.dragOvers[S];}for(var R in a.groups){if("string"!=typeof R){continue;}for(S in this.ids[R]){var G=this.ids[R][S];if(!this.isTypeOfDD(G)){continue;}if(G.isTarget&&!G.isLocked()&&G!=a){if(this.isOverTarget(P,G,this.mode,U)){D[R]=true;if(L){c.dropEvts.push(G);}else{if(!I[G.id]){c.enterEvts.push(G);}else{c.overEvts.push(G);}this.dragOvers[G.id]=G;}}}}}this.interactionInfo={out:c.outEvts,enter:c.enterEvts,over:c.overEvts,drop:c.dropEvts,point:P,draggedRegion:U,sourceRegion:this.locationCache[a.id],validDrop:L};for(var C in D){Q.push(C);}if(L&&!c.dropEvts.length){this.interactionInfo.validDrop=false;if(a.events.invalidDrop){a.onInvalidDrop(V);a.fireEvent("invalidDropEvent",{e:V});}}for(S=0;S<E.length;S++){var Y=null;if(c[E[S]+"Evts"]){Y=c[E[S]+"Evts"];}if(Y&&Y.length){var H=E[S].charAt(0).toUpperCase()+E[S].substr(1),X="onDrag"+H,J="b4Drag"+H,O="drag"+H+"Event",W="drag"+H;if(this.mode){if(a.events[J]){a[J](V,Y,Q);a.fireEvent(J+"Event",{event:V,info:Y,group:Q});}if(a.events[W]){a[X](V,Y,Q);a.fireEvent(O,{event:V,info:Y,group:Q});}}else{for(var Z=0,T=Y.length;Z<T;++Z){if(a.events[J]){a[J](V,Y[Z].id,Q[0]);a.fireEvent(J+"Event",{event:V,info:Y[Z].id,group:Q[0]});}if(a.events[W]){a[X](V,Y[Z].id,Q[0]);a.fireEvent(O,{event:V,info:Y[Z].id,group:Q[0]});}}}}}},getBestMatch:function(E){var G=null;var D=E.length;if(D==1){G=E[0];}else{for(var F=0;F<D;++F){var C=E[F];if(this.mode==this.INTERSECT&&C.cursorIsOver){G=C;break;}else{if(!G||!G.overlap||(C.overlap&&G.overlap.getArea()<C.overlap.getArea())){G=C;}}}}return G;},refreshCache:function(D){var F=D||this.ids;for(var C in F){if("string"!=typeof C){continue;}for(var E in this.ids[C]){var G=this.ids[C][E];if(this.isTypeOfDD(G)){var H=this.getLocation(G);if(H){this.locationCache[G.id]=H;}else{delete this.locationCache[G.id];}}}}},verifyEl:function(D){try{if(D){var C=D.offsetParent;if(C){return true;}}}catch(E){}return false;},getLocation:function(H){if(!this.isTypeOfDD(H)){return null;}var F=H.getEl(),K,E,D,M,L,N,C,J,G;try{K=YAHOO.util.Dom.getXY(F);}catch(I){}if(!K){return null;}E=K[0];D=E+F.offsetWidth;M=K[1];L=M+F.offsetHeight;N=M-H.padding[0];C=D+H.padding[1];J=L+H.padding[2];G=E-H.padding[3];return new YAHOO.util.Region(N,C,J,G);},isOverTarget:function(K,C,E,F){var G=this.locationCache[C.id];if(!G||!this.useCache){G=this.getLocation(C);this.locationCache[C.id]=G;}if(!G){return false;}C.cursorIsOver=G.contains(K);var J=this.dragCurrent;if(!J||(!E&&!J.constrainX&&!J.constrainY)){return C.cursorIsOver;}C.overlap=null;if(!F){var H=J.getTargetCoord(K.x,K.y);var D=J.getDragEl();F=new YAHOO.util.Region(H.y,H.x+D.offsetWidth,H.y+D.offsetHeight,H.x);}var I=F.intersect(G);if(I){C.overlap=I;return(E)?true:C.cursorIsOver;}else{return false;}},_onUnload:function(D,C){this.unregAll();},unregAll:function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}this._execOnAll("unreg",[]);this.ids={};},elementCache:{},getElWrapper:function(D){var C=this.elementCache[D];if(!C||!C.el){C=this.elementCache[D]=new this.ElementWrapper(YAHOO.util.Dom.get(D));}return C;},getElement:function(C){return YAHOO.util.Dom.get(C);},getCss:function(D){var C=YAHOO.util.Dom.get(D);return(C)?C.style:null;},ElementWrapper:function(C){this.el=C||null;this.id=this.el&&C.id;this.css=this.el&&C.style;},getPosX:function(C){return YAHOO.util.Dom.getX(C);},getPosY:function(C){return YAHOO.util.Dom.getY(C);},swapNode:function(E,C){if(E.swapNode){E.swapNode(C);}else{var F=C.parentNode;var D=C.nextSibling;if(D==E){F.insertBefore(E,C);}else{if(C==E.nextSibling){F.insertBefore(C,E);}else{E.parentNode.replaceChild(C,E);F.insertBefore(E,D);}}}},getScroll:function(){var E,C,F=document.documentElement,D=document.body;if(F&&(F.scrollTop||F.scrollLeft)){E=F.scrollTop;C=F.scrollLeft;}else{if(D){E=D.scrollTop;C=D.scrollLeft;}else{}}return{top:E,left:C};},getStyle:function(D,C){return YAHOO.util.Dom.getStyle(D,C);},getScrollTop:function(){return this.getScroll().top;},getScrollLeft:function(){return this.getScroll().left;},moveToEl:function(C,E){var D=YAHOO.util.Dom.getXY(E);YAHOO.util.Dom.setXY(C,D);},getClientHeight:function(){return YAHOO.util.Dom.getViewportHeight();},getClientWidth:function(){return YAHOO.util.Dom.getViewportWidth();},numericSort:function(D,C){return(D-C);},_timeoutCount:0,_addListeners:function(){var C=YAHOO.util.DDM;if(YAHOO.util.Event&&document){C._onLoad();}else{if(C._timeoutCount>2000){}else{setTimeout(C._addListeners,10);if(document&&document.body){C._timeoutCount+=1;}}}},handleWasClicked:function(C,E){if(this.isHandle(E,C.id)){return true;}else{var D=C.parentNode;while(D){if(this.isHandle(E,D.id)){return true;}else{D=D.parentNode;}}}return false;}};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}(function(){var A=YAHOO.util.Event;var B=YAHOO.util.Dom;YAHOO.util.DragDrop=function(E,C,D){if(E){this.init(E,C,D);}};YAHOO.util.DragDrop.prototype={events:null,on:function(){this.subscribe.apply(this,arguments);},id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,dragOnly:false,useShim:false,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,deltaX:0,deltaY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,cursorIsOver:false,overlap:null,b4StartDrag:function(C,D){},startDrag:function(C,D){},b4Drag:function(C){},onDrag:function(C){},onDragEnter:function(C,D){},b4DragOver:function(C){},onDragOver:function(C,D){},b4DragOut:function(C){},onDragOut:function(C,D){},b4DragDrop:function(C){},onDragDrop:function(C,D){},onInvalidDrop:function(C){},b4EndDrag:function(C){},endDrag:function(C){},b4MouseDown:function(C){},onMouseDown:function(C){},onMouseUp:function(C){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=B.get(this.id);
}return this._domRef;},getDragEl:function(){return B.get(this.dragElId);},init:function(F,C,D){this.initTarget(F,C,D);A.on(this._domRef||this.id,"mousedown",this.handleMouseDown,this,true);for(var E in this.events){this.createEvent(E+"Event");}},initTarget:function(E,C,D){this.config=D||{};this.events={};this.DDM=YAHOO.util.DDM;this.groups={};if(typeof E!=="string"){this._domRef=E;E=B.generateId(E);}this.id=E;this.addToGroup((C)?C:"default");this.handleElId=E;A.onAvailable(E,this.handleOnAvailable,this,true);this.setDragElId(E);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.events={mouseDown:true,b4MouseDown:true,mouseUp:true,b4StartDrag:true,startDrag:true,b4EndDrag:true,endDrag:true,drag:true,b4Drag:true,invalidDrop:true,b4DragOut:true,dragOut:true,dragEnter:true,b4DragOver:true,dragOver:true,b4DragDrop:true,dragDrop:true};if(this.config.events){for(var C in this.config.events){if(this.config.events[C]===false){this.events[C]=false;}}}this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);this.dragOnly=((this.config.dragOnly===true)?true:false);this.useShim=((this.config.useShim===true)?true:false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(E,C,F,D){if(!C&&0!==C){this.padding=[E,E,E,E];}else{if(!F&&0!==F){this.padding=[E,C,E,C];}else{this.padding=[E,C,F,D];}}},setInitPosition:function(F,E){var G=this.getEl();if(!this.DDM.verifyEl(G)){if(G&&G.style&&(G.style.display=="none")){}else{}return;}var D=F||0;var C=E||0;var H=B.getXY(G);this.initPageX=H[0]-D;this.initPageY=H[1]-C;this.lastPageX=H[0];this.lastPageY=H[1];this.setStartPosition(H);},setStartPosition:function(D){var C=D||B.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=C[0];this.startPageY=C[1];},addToGroup:function(C){this.groups[C]=true;this.DDM.regDragDrop(this,C);},removeFromGroup:function(C){if(this.groups[C]){delete this.groups[C];}this.DDM.removeDDFromGroup(this,C);},setDragElId:function(C){this.dragElId=C;},setHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.handleElId=C;this.DDM.regHandle(this.id,C);},setOuterHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}A.on(C,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(C);this.hasOuterHandles=true;},unreg:function(){A.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return(this.DDM.isLocked()||this.locked);},handleMouseDown:function(J,I){var D=J.which||J.button;if(this.primaryButtonOnly&&D>1){return;}if(this.isLocked()){return;}var C=this.b4MouseDown(J),F=true;if(this.events.b4MouseDown){F=this.fireEvent("b4MouseDownEvent",J);}var E=this.onMouseDown(J),H=true;if(this.events.mouseDown){H=this.fireEvent("mouseDownEvent",J);}if((C===false)||(E===false)||(F===false)||(H===false)){return;}this.DDM.refreshCache(this.groups);var G=new YAHOO.util.Point(A.getPageX(J),A.getPageY(J));if(!this.hasOuterHandles&&!this.DDM.isOverTarget(G,this)){}else{if(this.clickValidator(J)){this.setStartPosition();this.DDM.handleMouseDown(J,this);this.DDM.stopEvent(J);}else{}}},clickValidator:function(D){var C=YAHOO.util.Event.getTarget(D);return(this.isValidHandleChild(C)&&(this.id==this.handleElId||this.DDM.handleWasClicked(C,this.id)));},getTargetCoord:function(E,D){var C=E-this.deltaX;var F=D-this.deltaY;if(this.constrainX){if(C<this.minX){C=this.minX;}if(C>this.maxX){C=this.maxX;}}if(this.constrainY){if(F<this.minY){F=this.minY;}if(F>this.maxY){F=this.maxY;}}C=this.getTick(C,this.xTicks);F=this.getTick(F,this.yTicks);return{x:C,y:F};},addInvalidHandleType:function(C){var D=C.toUpperCase();this.invalidHandleTypes[D]=D;},addInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.invalidHandleIds[C]=C;},addInvalidHandleClass:function(C){this.invalidHandleClasses.push(C);},removeInvalidHandleType:function(C){var D=C.toUpperCase();delete this.invalidHandleTypes[D];},removeInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}delete this.invalidHandleIds[C];},removeInvalidHandleClass:function(D){for(var E=0,C=this.invalidHandleClasses.length;E<C;++E){if(this.invalidHandleClasses[E]==D){delete this.invalidHandleClasses[E];}}},isValidHandleChild:function(F){var E=true;var H;try{H=F.nodeName.toUpperCase();}catch(G){H=F.nodeName;}E=E&&!this.invalidHandleTypes[H];E=E&&!this.invalidHandleIds[F.id];for(var D=0,C=this.invalidHandleClasses.length;E&&D<C;++D){E=!B.hasClass(F,this.invalidHandleClasses[D]);}return E;},setXTicks:function(F,C){this.xTicks=[];this.xTickSize=C;var E={};for(var D=this.initPageX;D>=this.minX;D=D-C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}for(D=this.initPageX;D<=this.maxX;D=D+C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(F,C){this.yTicks=[];this.yTickSize=C;var E={};for(var D=this.initPageY;D>=this.minY;D=D-C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}for(D=this.initPageY;D<=this.maxY;D=D+C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(E,D,C){this.leftConstraint=parseInt(E,10);this.rightConstraint=parseInt(D,10);this.minX=this.initPageX-this.leftConstraint;this.maxX=this.initPageX+this.rightConstraint;if(C){this.setXTicks(this.initPageX,C);}this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(C,E,D){this.topConstraint=parseInt(C,10);this.bottomConstraint=parseInt(E,10);this.minY=this.initPageY-this.topConstraint;this.maxY=this.initPageY+this.bottomConstraint;if(D){this.setYTicks(this.initPageY,D);
}this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var D=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var C=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(D,C);}else{this.setInitPosition();}if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(I,F){if(!F){return I;}else{if(F[0]>=I){return F[0];}else{for(var D=0,C=F.length;D<C;++D){var E=D+1;if(F[E]&&F[E]>=I){var H=I-F[D];var G=F[E]-I;return(G>H)?F[D]:F[E];}}return F[F.length-1];}}},toString:function(){return("DragDrop "+this.id);}};YAHOO.augment(YAHOO.util.DragDrop,YAHOO.util.EventProvider);})();YAHOO.util.DD=function(C,A,B){if(C){this.init(C,A,B);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(C,B){var A=C-this.startPageX;var D=B-this.startPageY;this.setDelta(A,D);},setDelta:function(B,A){this.deltaX=B;this.deltaY=A;},setDragElPos:function(C,B){var A=this.getDragEl();this.alignElWithMouse(A,C,B);},alignElWithMouse:function(C,G,F){var E=this.getTargetCoord(G,F);if(!this.deltaSetXY){var H=[E.x,E.y];YAHOO.util.Dom.setXY(C,H);var D=parseInt(YAHOO.util.Dom.getStyle(C,"left"),10);var B=parseInt(YAHOO.util.Dom.getStyle(C,"top"),10);this.deltaSetXY=[D-E.x,B-E.y];}else{YAHOO.util.Dom.setStyle(C,"left",(E.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(C,"top",(E.y+this.deltaSetXY[1])+"px");}this.cachePosition(E.x,E.y);var A=this;setTimeout(function(){A.autoScroll.call(A,E.x,E.y,C.offsetHeight,C.offsetWidth);},0);},cachePosition:function(B,A){if(B){this.lastPageX=B;this.lastPageY=A;}else{var C=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=C[0];this.lastPageY=C[1];}},autoScroll:function(J,I,E,K){if(this.scroll){var L=this.DDM.getClientHeight();var B=this.DDM.getClientWidth();var N=this.DDM.getScrollTop();var D=this.DDM.getScrollLeft();var H=E+I;var M=K+J;var G=(L+N-I-this.deltaY);var F=(B+D-J-this.deltaX);var C=40;var A=(document.all)?80:30;if(H>L&&G<C){window.scrollTo(D,N+A);}if(I<N&&N>0&&I-N<C){window.scrollTo(D,N-A);}if(M>B&&F<C){window.scrollTo(D+A,N);}if(J<D&&D>0&&J-D<C){window.scrollTo(D-A,N);}}},applyConfig:function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);},b4MouseDown:function(A){this.setStartPosition();this.autoOffset(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},b4Drag:function(A){this.setDragElPos(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},toString:function(){return("DD "+this.id);}});YAHOO.util.DDProxy=function(C,A,B){if(C){this.init(C,A,B);this.initFrame();}};YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){var B=this,A=document.body;if(!A||!A.firstChild){setTimeout(function(){B.createFrame();},50);return;}var F=this.getDragEl(),E=YAHOO.util.Dom;if(!F){F=document.createElement("div");F.id=this.dragElId;var D=F.style;D.position="absolute";D.visibility="hidden";D.cursor="move";D.border="2px solid #aaa";D.zIndex=999;D.height="25px";D.width="25px";var C=document.createElement("div");E.setStyle(C,"height","100%");E.setStyle(C,"width","100%");E.setStyle(C,"background-color","#ccc");E.setStyle(C,"opacity","0");F.appendChild(C);A.insertBefore(F,A.firstChild);}},initFrame:function(){this.createFrame();},applyConfig:function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);},showFrame:function(E,D){var C=this.getEl();var A=this.getDragEl();var B=A.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(B.width,10)/2),Math.round(parseInt(B.height,10)/2));}this.setDragElPos(E,D);YAHOO.util.Dom.setStyle(A,"visibility","visible");},_resizeProxy:function(){if(this.resizeFrame){var H=YAHOO.util.Dom;var B=this.getEl();var C=this.getDragEl();var G=parseInt(H.getStyle(C,"borderTopWidth"),10);var I=parseInt(H.getStyle(C,"borderRightWidth"),10);var F=parseInt(H.getStyle(C,"borderBottomWidth"),10);var D=parseInt(H.getStyle(C,"borderLeftWidth"),10);if(isNaN(G)){G=0;}if(isNaN(I)){I=0;}if(isNaN(F)){F=0;}if(isNaN(D)){D=0;}var E=Math.max(0,B.offsetWidth-I-D);var A=Math.max(0,B.offsetHeight-G-F);H.setStyle(C,"width",E+"px");H.setStyle(C,"height",A+"px");}},b4MouseDown:function(B){this.setStartPosition();var A=YAHOO.util.Event.getPageX(B);var C=YAHOO.util.Event.getPageY(B);this.autoOffset(A,C);},b4StartDrag:function(A,B){this.showFrame(A,B);},b4EndDrag:function(A){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");},endDrag:function(D){var C=YAHOO.util.Dom;var B=this.getEl();var A=this.getDragEl();C.setStyle(A,"visibility","");C.setStyle(B,"visibility","hidden");YAHOO.util.DDM.moveToEl(B,A);C.setStyle(A,"visibility","hidden");C.setStyle(B,"visibility","");},toString:function(){return("DDProxy "+this.id);}});YAHOO.util.DDTarget=function(C,A,B){if(C){this.initTarget(C,A,B);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){return("DDTarget "+this.id);}});YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/dragdrop/dragdrop-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.util.Attribute=function(B,A){if(A){this.owner=A;this.configure(B,true);}};YAHOO.util.Attribute.prototype={name:undefined,value:null,owner:null,readOnly:false,writeOnce:false,_initialConfig:null,_written:false,method:null,setter:null,getter:null,validator:null,getValue:function(){var A=this.value;if(this.getter){A=this.getter.call(this.owner,this.name);}return A;},setValue:function(F,B){var E,A=this.owner,C=this.name;var D={type:C,prevValue:this.getValue(),newValue:F};if(this.readOnly||(this.writeOnce&&this._written)){return false;}if(this.validator&&!this.validator.call(A,F)){return false;}if(!B){E=A.fireBeforeChangeEvent(D);if(E===false){return false;}}if(this.setter){F=this.setter.call(A,F,this.name);if(F===undefined){}}if(this.method){this.method.call(A,F,this.name);}this.value=F;this._written=true;D.type=C;if(!B){this.owner.fireChangeEvent(D);}return true;},configure:function(B,C){B=B||{};if(C){this._written=false;}this._initialConfig=this._initialConfig||{};for(var A in B){if(B.hasOwnProperty(A)){this[A]=B[A];if(C){this._initialConfig[A]=B[A];}}}},resetValue:function(){return this.setValue(this._initialConfig.value);},resetConfig:function(){this.configure(this._initialConfig,true);},refresh:function(A){this.setValue(this.value,A);}};(function(){var A=YAHOO.util.Lang;YAHOO.util.AttributeProvider=function(){};YAHOO.util.AttributeProvider.prototype={_configs:null,get:function(C){this._configs=this._configs||{};var B=this._configs[C];if(!B||!this._configs.hasOwnProperty(C)){return null;}return B.getValue();},set:function(D,E,B){this._configs=this._configs||{};var C=this._configs[D];if(!C){return false;}return C.setValue(E,B);},getAttributeKeys:function(){this._configs=this._configs;var C=[],B;for(B in this._configs){if(A.hasOwnProperty(this._configs,B)&&!A.isUndefined(this._configs[B])){C[C.length]=B;}}return C;},setAttributes:function(D,B){for(var C in D){if(A.hasOwnProperty(D,C)){this.set(C,D[C],B);}}},resetValue:function(C,B){this._configs=this._configs||{};if(this._configs[C]){this.set(C,this._configs[C]._initialConfig.value,B);return true;}return false;},refresh:function(E,C){this._configs=this._configs||{};var F=this._configs;E=((A.isString(E))?[E]:E)||this.getAttributeKeys();for(var D=0,B=E.length;D<B;++D){if(F.hasOwnProperty(E[D])){this._configs[E[D]].refresh(C);}}},register:function(B,C){this.setAttributeConfig(B,C);},getAttributeConfig:function(C){this._configs=this._configs||{};var B=this._configs[C]||{};var D={};for(C in B){if(A.hasOwnProperty(B,C)){D[C]=B[C];}}return D;},setAttributeConfig:function(B,C,D){this._configs=this._configs||{};C=C||{};if(!this._configs[B]){C.name=B;this._configs[B]=this.createAttribute(C);}else{this._configs[B].configure(C,D);}},configureAttribute:function(B,C,D){this.setAttributeConfig(B,C,D);},resetAttributeConfig:function(B){this._configs=this._configs||{};this._configs[B].resetConfig();},subscribe:function(B,C){this._events=this._events||{};if(!(B in this._events)){this._events[B]=this.createEvent(B);}YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){this.subscribe.apply(this,arguments);},addListener:function(){this.subscribe.apply(this,arguments);},fireBeforeChangeEvent:function(C){var B="before";B+=C.type.charAt(0).toUpperCase()+C.type.substr(1)+"Change";C.type=B;return this.fireEvent(C.type,C);},fireChangeEvent:function(B){B.type+="Change";return this.fireEvent(B.type,B);},createAttribute:function(B){return new YAHOO.util.Attribute(B,this);}};YAHOO.augment(YAHOO.util.AttributeProvider,YAHOO.util.EventProvider);})();(function(){var B=YAHOO.util.Dom,C=YAHOO.util.AttributeProvider;var A=function(D,E){this.init.apply(this,arguments);};A.DOM_EVENTS={"click":true,"dblclick":true,"keydown":true,"keypress":true,"keyup":true,"mousedown":true,"mousemove":true,"mouseout":true,"mouseover":true,"mouseup":true,"focus":true,"blur":true,"submit":true,"change":true};A.prototype={DOM_EVENTS:null,DEFAULT_HTML_SETTER:function(F,D){var E=this.get("element");if(E){E[D]=F;}},DEFAULT_HTML_GETTER:function(D){var E=this.get("element"),F;if(E){F=E[D];}return F;},appendChild:function(D){D=D.get?D.get("element"):D;return this.get("element").appendChild(D);},getElementsByTagName:function(D){return this.get("element").getElementsByTagName(D);},hasChildNodes:function(){return this.get("element").hasChildNodes();},insertBefore:function(D,E){D=D.get?D.get("element"):D;E=(E&&E.get)?E.get("element"):E;return this.get("element").insertBefore(D,E);},removeChild:function(D){D=D.get?D.get("element"):D;return this.get("element").removeChild(D);},replaceChild:function(D,E){D=D.get?D.get("element"):D;E=E.get?E.get("element"):E;return this.get("element").replaceChild(D,E);},initAttributes:function(D){},addListener:function(H,G,I,F){var E=this.get("element")||this.get("id");F=F||this;var D=this;if(!this._events[H]){if(E&&this.DOM_EVENTS[H]){YAHOO.util.Event.addListener(E,H,function(J){if(J.srcElement&&!J.target){J.target=J.srcElement;}D.fireEvent(H,J);},I,F);}this.createEvent(H,this);}return YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){return this.addListener.apply(this,arguments);},subscribe:function(){return this.addListener.apply(this,arguments);},removeListener:function(E,D){return this.unsubscribe.apply(this,arguments);},addClass:function(D){B.addClass(this.get("element"),D);},getElementsByClassName:function(E,D){return B.getElementsByClassName(E,D,this.get("element"));},hasClass:function(D){return B.hasClass(this.get("element"),D);},removeClass:function(D){return B.removeClass(this.get("element"),D);},replaceClass:function(E,D){return B.replaceClass(this.get("element"),E,D);},setStyle:function(E,D){return B.setStyle(this.get("element"),E,D);},getStyle:function(D){return B.getStyle(this.get("element"),D);},fireQueue:function(){var E=this._queue;for(var F=0,D=E.length;F<D;++F){this[E[F][0]].apply(this,E[F][1]);}},appendTo:function(E,F){E=(E.get)?E.get("element"):B.get(E);this.fireEvent("beforeAppendTo",{type:"beforeAppendTo",target:E});
F=(F&&F.get)?F.get("element"):B.get(F);var D=this.get("element");if(!D){return false;}if(!E){return false;}if(D.parent!=E){if(F){E.insertBefore(D,F);}else{E.appendChild(D);}}this.fireEvent("appendTo",{type:"appendTo",target:E});return D;},get:function(D){var F=this._configs||{},E=F.element;if(E&&!F[D]&&!YAHOO.lang.isUndefined(E.value[D])){this._setHTMLAttrConfig(D);}return C.prototype.get.call(this,D);},setAttributes:function(J,G){var E={},H=this._configOrder;for(var I=0,D=H.length;I<D;++I){if(J[H[I]]!==undefined){E[H[I]]=true;this.set(H[I],J[H[I]],G);}}for(var F in J){if(J.hasOwnProperty(F)&&!E[F]){this.set(F,J[F],G);}}},set:function(E,G,D){var F=this.get("element");if(!F){this._queue[this._queue.length]=["set",arguments];if(this._configs[E]){this._configs[E].value=G;}return;}if(!this._configs[E]&&!YAHOO.lang.isUndefined(F[E])){this._setHTMLAttrConfig(E);}return C.prototype.set.apply(this,arguments);},setAttributeConfig:function(D,E,F){this._configOrder.push(D);C.prototype.setAttributeConfig.apply(this,arguments);},createEvent:function(E,D){this._events[E]=true;return C.prototype.createEvent.apply(this,arguments);},init:function(E,D){this._initElement(E,D);},destroy:function(){var D=this.get("element");YAHOO.util.Event.purgeElement(D,true);this.unsubscribeAll();if(D&&D.parentNode){D.parentNode.removeChild(D);}this._queue=[];this._events={};this._configs={};this._configOrder=[];},_initElement:function(F,E){this._queue=this._queue||[];this._events=this._events||{};this._configs=this._configs||{};this._configOrder=[];E=E||{};E.element=E.element||F||null;var H=false;var D=A.DOM_EVENTS;this.DOM_EVENTS=this.DOM_EVENTS||{};for(var G in D){if(D.hasOwnProperty(G)){this.DOM_EVENTS[G]=D[G];}}if(typeof E.element==="string"){this._setHTMLAttrConfig("id",{value:E.element});}if(B.get(E.element)){H=true;this._initHTMLElement(E);this._initContent(E);}YAHOO.util.Event.onAvailable(E.element,function(){if(!H){this._initHTMLElement(E);}this.fireEvent("available",{type:"available",target:B.get(E.element)});},this,true);YAHOO.util.Event.onContentReady(E.element,function(){if(!H){this._initContent(E);}this.fireEvent("contentReady",{type:"contentReady",target:B.get(E.element)});},this,true);},_initHTMLElement:function(D){this.setAttributeConfig("element",{value:B.get(D.element),readOnly:true});},_initContent:function(D){this.initAttributes(D);this.setAttributes(D,true);this.fireQueue();},_setHTMLAttrConfig:function(D,F){var E=this.get("element");F=F||{};F.name=D;F.setter=F.setter||this.DEFAULT_HTML_SETTER;F.getter=F.getter||this.DEFAULT_HTML_GETTER;F.value=F.value||E[D];this._configs[D]=new YAHOO.util.Attribute(F,this);}};YAHOO.augment(A,C);YAHOO.util.Element=A;})();YAHOO.register("element",YAHOO.util.Element,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/element/element-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var G=YAHOO.util.Dom,M=YAHOO.util.Event,I=YAHOO.lang,L=YAHOO.env.ua,B=YAHOO.widget.Overlay,J=YAHOO.widget.Menu,D={},K=null,E=null,C=null;function F(O,N,R,P){var S,Q;if(I.isString(O)&&I.isString(N)){if(L.ie){Q='<input type="'+O+'" name="'+N+'"';if(P){Q+=" checked";}Q+=">";S=document.createElement(Q);}else{S=document.createElement("input");S.name=N;S.type=O;if(P){S.checked=true;}}S.value=R;}return S;}function H(O,U){var N=O.nodeName.toUpperCase(),S=this,T,P,Q;function V(W){if(!(W in U)){T=O.getAttributeNode(W);if(T&&("value" in T)){U[W]=T.value;}}}function R(){V("type");if(U.type=="button"){U.type="push";}if(!("disabled" in U)){U.disabled=O.disabled;}V("name");V("value");V("title");}switch(N){case"A":U.type="link";V("href");V("target");break;case"INPUT":R();if(!("checked" in U)){U.checked=O.checked;}break;case"BUTTON":R();P=O.parentNode.parentNode;if(G.hasClass(P,this.CSS_CLASS_NAME+"-checked")){U.checked=true;}if(G.hasClass(P,this.CSS_CLASS_NAME+"-disabled")){U.disabled=true;}O.removeAttribute("value");O.setAttribute("type","button");break;}O.removeAttribute("id");O.removeAttribute("name");if(!("tabindex" in U)){U.tabindex=O.tabIndex;}if(!("label" in U)){Q=N=="INPUT"?O.value:O.innerHTML;if(Q&&Q.length>0){U.label=Q;}}}function A(P){var O=P.attributes,N=O.srcelement,R=N.nodeName.toUpperCase(),Q=this;if(R==this.NODE_NAME){P.element=N;P.id=N.id;G.getElementsBy(function(S){switch(S.nodeName.toUpperCase()){case"BUTTON":case"A":case"INPUT":H.call(Q,S,O);break;}},"*",N);}else{switch(R){case"BUTTON":case"A":case"INPUT":H.call(this,N,O);break;}}}YAHOO.widget.Button=function(R,O){if(!B&&YAHOO.widget.Overlay){B=YAHOO.widget.Overlay;}if(!J&&YAHOO.widget.Menu){J=YAHOO.widget.Menu;}var Q=YAHOO.widget.Button.superclass.constructor,P,N;if(arguments.length==1&&!I.isString(R)&&!R.nodeName){if(!R.id){R.id=G.generateId();}Q.call(this,(this.createButtonElement(R.type)),R);}else{P={element:null,attributes:(O||{})};if(I.isString(R)){N=G.get(R);if(N){if(!P.attributes.id){P.attributes.id=R;}P.attributes.srcelement=N;A.call(this,P);if(!P.element){P.element=this.createButtonElement(P.attributes.type);}Q.call(this,P.element,P.attributes);}}else{if(R.nodeName){if(!P.attributes.id){if(R.id){P.attributes.id=R.id;}else{P.attributes.id=G.generateId();}}P.attributes.srcelement=R;A.call(this,P);if(!P.element){P.element=this.createButtonElement(P.attributes.type);}Q.call(this,P.element,P.attributes);}}}};YAHOO.extend(YAHOO.widget.Button,YAHOO.util.Element,{_button:null,_menu:null,_hiddenFields:null,_onclickAttributeValue:null,_activationKeyPressed:false,_activationButtonPressed:false,_hasKeyEventHandlers:false,_hasMouseEventHandlers:false,_nOptionRegionX:0,NODE_NAME:"SPAN",CHECK_ACTIVATION_KEYS:[32],ACTIVATION_KEYS:[13,32],OPTION_AREA_WIDTH:20,CSS_CLASS_NAME:"yui-button",RADIO_DEFAULT_TITLE:"Unchecked.  Click to check.",RADIO_CHECKED_TITLE:"Checked.  Click another button to uncheck",CHECKBOX_DEFAULT_TITLE:"Unchecked.  Click to check.",CHECKBOX_CHECKED_TITLE:"Checked.  Click to uncheck.",MENUBUTTON_DEFAULT_TITLE:"Menu collapsed.  Click to expand.",MENUBUTTON_MENU_VISIBLE_TITLE:"Menu expanded.  Click or press Esc to collapse.",SPLITBUTTON_DEFAULT_TITLE:("Menu collapsed.  Click inside option "+"region or press down arrow key to show the menu."),SPLITBUTTON_OPTION_VISIBLE_TITLE:"Menu expanded.  Press Esc to hide the menu.",SUBMIT_TITLE:"Click to submit form.",_setType:function(N){if(N=="split"){this.on("option",this._onOption);}},_setLabel:function(O){this._button.innerHTML=O;var P,N=L.gecko;if(N&&N<1.9&&G.inDocument(this.get("element"))){P=this.CSS_CLASS_NAME;this.removeClass(P);I.later(0,this,this.addClass,P);}},_setTabIndex:function(N){this._button.tabIndex=N;},_setTitle:function(O){var N=O;if(this.get("type")!="link"){if(!N){switch(this.get("type")){case"radio":N=this.RADIO_DEFAULT_TITLE;break;case"checkbox":N=this.CHECKBOX_DEFAULT_TITLE;break;case"menu":N=this.MENUBUTTON_DEFAULT_TITLE;break;case"split":N=this.SPLITBUTTON_DEFAULT_TITLE;break;case"submit":N=this.SUBMIT_TITLE;break;}}this._button.title=N;}},_setDisabled:function(N){if(this.get("type")!="link"){if(N){if(this._menu){this._menu.hide();}if(this.hasFocus()){this.blur();}this._button.setAttribute("disabled","disabled");this.addStateCSSClasses("disabled");this.removeStateCSSClasses("hover");this.removeStateCSSClasses("active");this.removeStateCSSClasses("focus");}else{this._button.removeAttribute("disabled");this.removeStateCSSClasses("disabled");}}},_setHref:function(N){if(this.get("type")=="link"){this._button.href=N;}},_setTarget:function(N){if(this.get("type")=="link"){this._button.setAttribute("target",N);}},_setChecked:function(O){var P=this.get("type"),N;if(P=="checkbox"||P=="radio"){if(O){this.addStateCSSClasses("checked");N=(P=="radio")?this.RADIO_CHECKED_TITLE:this.CHECKBOX_CHECKED_TITLE;}else{this.removeStateCSSClasses("checked");N=(P=="radio")?this.RADIO_DEFAULT_TITLE:this.CHECKBOX_DEFAULT_TITLE;}if(!this._hasDefaultTitle){this.set("title",N);}}},_setMenu:function(U){var P=this.get("lazyloadmenu"),R=this.get("element"),N,W=false,X,O,Q;function V(){X.render(R.parentNode);this.removeListener("appendTo",V);}function T(){X.cfg.queueProperty("container",R.parentNode);this.removeListener("appendTo",T);}function S(){var Y;if(X){G.addClass(X.element,this.get("menuclassname"));G.addClass(X.element,"yui-"+this.get("type")+"-button-menu");X.showEvent.subscribe(this._onMenuShow,null,this);X.hideEvent.subscribe(this._onMenuHide,null,this);X.renderEvent.subscribe(this._onMenuRender,null,this);if(J&&X instanceof J){if(P){Y=this.get("container");if(Y){X.cfg.queueProperty("container",Y);}else{this.on("appendTo",T);}}X.cfg.queueProperty("clicktohide",false);X.keyDownEvent.subscribe(this._onMenuKeyDown,this,true);X.subscribe("click",this._onMenuClick,this,true);this.on("selectedMenuItemChange",this._onSelectedMenuItemChange);Q=X.srcElement;if(Q&&Q.nodeName.toUpperCase()=="SELECT"){Q.style.display="none";Q.parentNode.removeChild(Q);}}else{if(B&&X instanceof B){if(!K){K=new YAHOO.widget.OverlayManager();
}K.register(X);}}this._menu=X;if(!W&&!P){if(G.inDocument(R)){X.render(R.parentNode);}else{this.on("appendTo",V);}}}}if(B){if(J){N=J.prototype.CSS_CLASS_NAME;}if(U&&J&&(U instanceof J)){X=U;W=true;S.call(this);}else{if(B&&U&&(U instanceof B)){X=U;W=true;X.cfg.queueProperty("visible",false);S.call(this);}else{if(J&&I.isArray(U)){X=new J(G.generateId(),{lazyload:P,itemdata:U});this._menu=X;this.on("appendTo",S);}else{if(I.isString(U)){O=G.get(U);if(O){if(J&&G.hasClass(O,N)||O.nodeName.toUpperCase()=="SELECT"){X=new J(U,{lazyload:P});S.call(this);}else{if(B){X=new B(U,{visible:false});S.call(this);}}}}else{if(U&&U.nodeName){if(J&&G.hasClass(U,N)||U.nodeName.toUpperCase()=="SELECT"){X=new J(U,{lazyload:P});S.call(this);}else{if(B){if(!U.id){G.generateId(U);}X=new B(U,{visible:false});S.call(this);}}}}}}}}},_setOnClick:function(N){if(this._onclickAttributeValue&&(this._onclickAttributeValue!=N)){this.removeListener("click",this._onclickAttributeValue.fn);this._onclickAttributeValue=null;}if(!this._onclickAttributeValue&&I.isObject(N)&&I.isFunction(N.fn)){this.on("click",N.fn,N.obj,N.scope);this._onclickAttributeValue=N;}},_isActivationKey:function(N){var S=this.get("type"),O=(S=="checkbox"||S=="radio")?this.CHECK_ACTIVATION_KEYS:this.ACTIVATION_KEYS,Q=O.length,R=false,P;if(Q>0){P=Q-1;do{if(N==O[P]){R=true;break;}}while(P--);}return R;},_isSplitButtonOptionKey:function(P){var O=(M.getCharCode(P)==40);var N=function(Q){M.preventDefault(Q);this.removeListener("keypress",N);};if(O){if(L.opera){this.on("keypress",N);}M.preventDefault(P);}return O;},_addListenersToForm:function(){var T=this.getForm(),S=YAHOO.widget.Button.onFormKeyPress,R,N,Q,P,O;if(T){M.on(T,"reset",this._onFormReset,null,this);M.on(T,"submit",this._onFormSubmit,null,this);N=this.get("srcelement");if(this.get("type")=="submit"||(N&&N.type=="submit")){Q=M.getListeners(T,"keypress");R=false;if(Q){P=Q.length;if(P>0){O=P-1;do{if(Q[O].fn==S){R=true;break;}}while(O--);}}if(!R){M.on(T,"keypress",S);}}}},_showMenu:function(R){if(YAHOO.widget.MenuManager){YAHOO.widget.MenuManager.hideVisible();}if(K){K.hideAll();}var N=this._menu,Q=this.get("menualignment"),P=this.get("focusmenu"),O;if(this._renderedMenu){N.cfg.setProperty("context",[this.get("element"),Q[0],Q[1]]);N.cfg.setProperty("preventcontextoverlap",true);N.cfg.setProperty("constraintoviewport",true);}else{N.cfg.queueProperty("context",[this.get("element"),Q[0],Q[1]]);N.cfg.queueProperty("preventcontextoverlap",true);N.cfg.queueProperty("constraintoviewport",true);}this.focus();if(J&&N&&(N instanceof J)){O=N.focus;N.focus=function(){};if(this._renderedMenu){N.cfg.setProperty("minscrollheight",this.get("menuminscrollheight"));N.cfg.setProperty("maxheight",this.get("menumaxheight"));}else{N.cfg.queueProperty("minscrollheight",this.get("menuminscrollheight"));N.cfg.queueProperty("maxheight",this.get("menumaxheight"));}N.show();N.focus=O;N.align();if(R.type=="mousedown"){M.stopPropagation(R);}if(P){N.focus();}}else{if(B&&N&&(N instanceof B)){if(!this._renderedMenu){N.render(this.get("element").parentNode);}N.show();N.align();}}},_hideMenu:function(){var N=this._menu;if(N){N.hide();}},_onMouseOver:function(O){var Q=this.get("type"),N,P;if(Q==="split"){N=this.get("element");P=(G.getX(N)+(N.offsetWidth-this.OPTION_AREA_WIDTH));this._nOptionRegionX=P;}if(!this._hasMouseEventHandlers){if(Q==="split"){this.on("mousemove",this._onMouseMove);}this.on("mouseout",this._onMouseOut);this._hasMouseEventHandlers=true;}this.addStateCSSClasses("hover");if(Q==="split"&&(M.getPageX(O)>P)){this.addStateCSSClasses("hoveroption");}if(this._activationButtonPressed){this.addStateCSSClasses("active");}if(this._bOptionPressed){this.addStateCSSClasses("activeoption");}if(this._activationButtonPressed||this._bOptionPressed){M.removeListener(document,"mouseup",this._onDocumentMouseUp);}},_onMouseMove:function(N){var O=this._nOptionRegionX;if(O){if(M.getPageX(N)>O){this.addStateCSSClasses("hoveroption");}else{this.removeStateCSSClasses("hoveroption");}}},_onMouseOut:function(N){var O=this.get("type");this.removeStateCSSClasses("hover");if(O!="menu"){this.removeStateCSSClasses("active");}if(this._activationButtonPressed||this._bOptionPressed){M.on(document,"mouseup",this._onDocumentMouseUp,null,this);}if(O==="split"&&(M.getPageX(N)>this._nOptionRegionX)){this.removeStateCSSClasses("hoveroption");}},_onDocumentMouseUp:function(P){this._activationButtonPressed=false;this._bOptionPressed=false;var Q=this.get("type"),N,O;if(Q=="menu"||Q=="split"){N=M.getTarget(P);O=this._menu.element;if(N!=O&&!G.isAncestor(O,N)){this.removeStateCSSClasses((Q=="menu"?"active":"activeoption"));this._hideMenu();}}M.removeListener(document,"mouseup",this._onDocumentMouseUp);},_onMouseDown:function(P){var Q,O=true;function N(){this._hideMenu();this.removeListener("mouseup",N);}if((P.which||P.button)==1){if(!this.hasFocus()){this.focus();}Q=this.get("type");if(Q=="split"){if(M.getPageX(P)>this._nOptionRegionX){this.fireEvent("option",P);O=false;}else{this.addStateCSSClasses("active");this._activationButtonPressed=true;}}else{if(Q=="menu"){if(this.isActive()){this._hideMenu();this._activationButtonPressed=false;}else{this._showMenu(P);this._activationButtonPressed=true;}}else{this.addStateCSSClasses("active");this._activationButtonPressed=true;}}if(Q=="split"||Q=="menu"){this._hideMenuTimer=I.later(250,this,this.on,["mouseup",N]);}}return O;},_onMouseUp:function(P){var Q=this.get("type"),N=this._hideMenuTimer,O=true;if(N){N.cancel();}if(Q=="checkbox"||Q=="radio"){this.set("checked",!(this.get("checked")));}this._activationButtonPressed=false;if(Q!="menu"){this.removeStateCSSClasses("active");}if(Q=="split"&&M.getPageX(P)>this._nOptionRegionX){O=false;}return O;},_onFocus:function(O){var N;this.addStateCSSClasses("focus");if(this._activationKeyPressed){this.addStateCSSClasses("active");}C=this;if(!this._hasKeyEventHandlers){N=this._button;M.on(N,"blur",this._onBlur,null,this);M.on(N,"keydown",this._onKeyDown,null,this);M.on(N,"keyup",this._onKeyUp,null,this);
this._hasKeyEventHandlers=true;}this.fireEvent("focus",O);},_onBlur:function(N){this.removeStateCSSClasses("focus");if(this.get("type")!="menu"){this.removeStateCSSClasses("active");}if(this._activationKeyPressed){M.on(document,"keyup",this._onDocumentKeyUp,null,this);}C=null;this.fireEvent("blur",N);},_onDocumentKeyUp:function(N){if(this._isActivationKey(M.getCharCode(N))){this._activationKeyPressed=false;M.removeListener(document,"keyup",this._onDocumentKeyUp);}},_onKeyDown:function(O){var N=this._menu;if(this.get("type")=="split"&&this._isSplitButtonOptionKey(O)){this.fireEvent("option",O);}else{if(this._isActivationKey(M.getCharCode(O))){if(this.get("type")=="menu"){this._showMenu(O);}else{this._activationKeyPressed=true;this.addStateCSSClasses("active");}}}if(N&&N.cfg.getProperty("visible")&&M.getCharCode(O)==27){N.hide();this.focus();}},_onKeyUp:function(N){var O;if(this._isActivationKey(M.getCharCode(N))){O=this.get("type");if(O=="checkbox"||O=="radio"){this.set("checked",!(this.get("checked")));}this._activationKeyPressed=false;if(this.get("type")!="menu"){this.removeStateCSSClasses("active");}}},_onClick:function(Q){var S=this.get("type"),N,R,O,P;switch(S){case"radio":case"checkbox":if(!this._hasDefaultTitle){if(this.get("checked")){N=(S=="radio")?this.RADIO_CHECKED_TITLE:this.CHECKBOX_CHECKED_TITLE;}else{N=(S=="radio")?this.RADIO_DEFAULT_TITLE:this.CHECKBOX_DEFAULT_TITLE;}this.set("title",N);}break;case"submit":if(Q.returnValue!==false){this.submitForm();}break;case"reset":R=this.getForm();if(R){R.reset();}break;case"menu":N=this._menu.cfg.getProperty("visible")?this.MENUBUTTON_MENU_VISIBLE_TITLE:this.MENUBUTTON_DEFAULT_TITLE;this.set("title",N);break;case"split":if(this._nOptionRegionX>0&&(M.getPageX(Q)>this._nOptionRegionX)){P=false;}else{this._hideMenu();O=this.get("srcelement");if(O&&O.type=="submit"&&Q.returnValue!==false){this.submitForm();}}N=this._menu.cfg.getProperty("visible")?this.SPLITBUTTON_OPTION_VISIBLE_TITLE:this.SPLITBUTTON_DEFAULT_TITLE;this.set("title",N);break;}return P;},_onDblClick:function(O){var N=true;if(this.get("type")=="split"&&M.getPageX(O)>this._nOptionRegionX){N=false;}return N;},_onAppendTo:function(N){I.later(0,this,this._addListenersToForm);},_onFormReset:function(O){var P=this.get("type"),N=this._menu;if(P=="checkbox"||P=="radio"){this.resetValue("checked");}if(J&&N&&(N instanceof J)){this.resetValue("selectedMenuItem");}},_onFormSubmit:function(N){this.createHiddenFields();},_onDocumentMouseDown:function(Q){var N=M.getTarget(Q),P=this.get("element"),O=this._menu.element;if(N!=P&&!G.isAncestor(P,N)&&N!=O&&!G.isAncestor(O,N)){this._hideMenu();M.removeListener(document,"mousedown",this._onDocumentMouseDown);}},_onOption:function(N){if(this.hasClass("yui-split-button-activeoption")){this._hideMenu();this._bOptionPressed=false;}else{this._showMenu(N);this._bOptionPressed=true;}},_onMenuShow:function(O){M.on(document,"mousedown",this._onDocumentMouseDown,null,this);var N,P;if(this.get("type")=="split"){N=this.SPLITBUTTON_OPTION_VISIBLE_TITLE;P="activeoption";}else{N=this.MENUBUTTON_MENU_VISIBLE_TITLE;P="active";}this.addStateCSSClasses(P);this.set("title",N);},_onMenuHide:function(P){var O=this._menu,N,Q;if(this.get("type")=="split"){N=this.SPLITBUTTON_DEFAULT_TITLE;Q="activeoption";}else{N=this.MENUBUTTON_DEFAULT_TITLE;Q="active";}this.removeStateCSSClasses(Q);this.set("title",N);if(this.get("type")=="split"){this._bOptionPressed=false;}},_onMenuKeyDown:function(P,O){var N=O[0];if(M.getCharCode(N)==27){this.focus();if(this.get("type")=="split"){this._bOptionPressed=false;}}},_onMenuRender:function(P){var S=this.get("element"),O=S.parentNode,N=this._menu,R=N.element,Q=N.srcElement;if(O!=R.parentNode){O.appendChild(R);}this._renderedMenu=true;if(Q&&Q.nodeName.toLowerCase()==="select"&&Q.value){this.set("selectedMenuItem",N.getItem(Q.selectedIndex));}},_onMenuClick:function(O,N){var Q=N[1],P;if(Q){this.set("selectedMenuItem",Q);P=this.get("srcelement");if(P&&P.type=="submit"){this.submitForm();}this._hideMenu();}},_onSelectedMenuItemChange:function(N){var O=N.prevValue,P=N.newValue;if(O){G.removeClass(O.element,"yui-button-selectedmenuitem");}if(P){G.addClass(P.element,"yui-button-selectedmenuitem");}},createButtonElement:function(N){var P=this.NODE_NAME,O=document.createElement(P);O.innerHTML="<"+P+' class="first-child">'+(N=="link"?"<a></a>":'<button type="button"></button>')+"</"+P+">";return O;},addStateCSSClasses:function(N){var O=this.get("type");if(I.isString(N)){if(N!="activeoption"&&N!="hoveroption"){this.addClass(this.CSS_CLASS_NAME+("-"+N));}this.addClass("yui-"+O+("-button-"+N));}},removeStateCSSClasses:function(N){var O=this.get("type");if(I.isString(N)){this.removeClass(this.CSS_CLASS_NAME+("-"+N));this.removeClass("yui-"+O+("-button-"+N));}},createHiddenFields:function(){this.removeHiddenFields();var V=this.getForm(),Z,O,S,X,Y,T,U,N,R,W,P,Q=false;if(V&&!this.get("disabled")){O=this.get("type");S=(O=="checkbox"||O=="radio");if((S&&this.get("checked"))||(E==this)){Z=F((S?O:"hidden"),this.get("name"),this.get("value"),this.get("checked"));if(Z){if(S){Z.style.display="none";}V.appendChild(Z);}}X=this._menu;if(J&&X&&(X instanceof J)){Y=this.get("selectedMenuItem");P=X.srcElement;Q=(P&&P.nodeName.toUpperCase()=="SELECT");if(Y){U=(Y.value===null||Y.value==="")?Y.cfg.getProperty("text"):Y.value;T=this.get("name");if(Q){W=P.name;}else{if(T){W=(T+"_options");}}if(U&&W){N=F("hidden",W,U);V.appendChild(N);}}else{if(Q){V.appendChild(P);}}}if(Z&&N){this._hiddenFields=[Z,N];}else{if(!Z&&N){this._hiddenFields=N;}else{if(Z&&!N){this._hiddenFields=Z;}}}R=this._hiddenFields;}return R;},removeHiddenFields:function(){var Q=this._hiddenFields,O,P;function N(R){if(G.inDocument(R)){R.parentNode.removeChild(R);}}if(Q){if(I.isArray(Q)){O=Q.length;if(O>0){P=O-1;do{N(Q[P]);}while(P--);}}else{N(Q);}this._hiddenFields=null;}},submitForm:function(){var Q=this.getForm(),P=this.get("srcelement"),O=false,N;if(Q){if(this.get("type")=="submit"||(P&&P.type=="submit")){E=this;
}if(L.ie){O=Q.fireEvent("onsubmit");}else{N=document.createEvent("HTMLEvents");N.initEvent("submit",true,true);O=Q.dispatchEvent(N);}if((L.ie||L.webkit)&&O){Q.submit();}}return O;},init:function(O,a){var Q=a.type=="link"?"a":"button",V=a.srcelement,Z=O.getElementsByTagName(Q)[0],X;if(!Z){X=O.getElementsByTagName("input")[0];if(X){Z=document.createElement("button");Z.setAttribute("type","button");X.parentNode.replaceChild(Z,X);}}this._button=Z;this._hasDefaultTitle=(a.title&&a.title.length>0);YAHOO.widget.Button.superclass.init.call(this,O,a);var T=this.get("id"),N=T+"-button";Z.id=N;var U,W;var d=function(e){return(e.htmlFor===T);};var S=function(){W.setAttribute((L.ie?"htmlFor":"for"),N);};if(V&&this.get("type")!="link"){U=G.getElementsBy(d,"label");if(I.isArray(U)&&U.length>0){W=U[0];}}D[T]=this;this.addClass(this.CSS_CLASS_NAME);this.addClass("yui-"+this.get("type")+"-button");M.on(this._button,"focus",this._onFocus,null,this);this.on("mouseover",this._onMouseOver);this.on("mousedown",this._onMouseDown);this.on("mouseup",this._onMouseUp);this.on("click",this._onClick);var Y=this.get("onclick");this.set("onclick",null);this.set("onclick",Y);this.on("dblclick",this._onDblClick);if(W){this.on("appendTo",S);}this.on("appendTo",this._onAppendTo);var c=this.get("container"),P=this.get("element"),b=G.inDocument(P),R;if(c){if(V&&V!=P){R=V.parentNode;if(R){R.removeChild(V);}}if(I.isString(c)){M.onContentReady(c,this.appendTo,c,this);}else{this.on("init",function(){I.later(0,this,this.appendTo,c);});}}else{if(!b&&V&&V!=P){R=V.parentNode;if(R){this.fireEvent("beforeAppendTo",{type:"beforeAppendTo",target:R});R.replaceChild(P,V);this.fireEvent("appendTo",{type:"appendTo",target:R});}}else{if(this.get("type")!="link"&&b&&V&&V==P){this._addListenersToForm();}}}this.fireEvent("init",{type:"init",target:this});},initAttributes:function(O){var N=O||{};YAHOO.widget.Button.superclass.initAttributes.call(this,N);this.setAttributeConfig("type",{value:(N.type||"push"),validator:I.isString,writeOnce:true,method:this._setType});this.setAttributeConfig("label",{value:N.label,validator:I.isString,method:this._setLabel});this.setAttributeConfig("value",{value:N.value});this.setAttributeConfig("name",{value:N.name,validator:I.isString});this.setAttributeConfig("tabindex",{value:N.tabindex,validator:I.isNumber,method:this._setTabIndex});this.configureAttribute("title",{value:N.title,validator:I.isString,method:this._setTitle});this.setAttributeConfig("disabled",{value:(N.disabled||false),validator:I.isBoolean,method:this._setDisabled});this.setAttributeConfig("href",{value:N.href,validator:I.isString,method:this._setHref});this.setAttributeConfig("target",{value:N.target,validator:I.isString,method:this._setTarget});this.setAttributeConfig("checked",{value:(N.checked||false),validator:I.isBoolean,method:this._setChecked});this.setAttributeConfig("container",{value:N.container,writeOnce:true});this.setAttributeConfig("srcelement",{value:N.srcelement,writeOnce:true});this.setAttributeConfig("menu",{value:null,method:this._setMenu,writeOnce:true});this.setAttributeConfig("lazyloadmenu",{value:(N.lazyloadmenu===false?false:true),validator:I.isBoolean,writeOnce:true});this.setAttributeConfig("menuclassname",{value:(N.menuclassname||"yui-button-menu"),validator:I.isString,method:this._setMenuClassName,writeOnce:true});this.setAttributeConfig("menuminscrollheight",{value:(N.menuminscrollheight||90),validator:I.isNumber});this.setAttributeConfig("menumaxheight",{value:(N.menumaxheight||0),validator:I.isNumber});this.setAttributeConfig("menualignment",{value:(N.menualignment||["tl","bl"]),validator:I.isArray});this.setAttributeConfig("selectedMenuItem",{value:null});this.setAttributeConfig("onclick",{value:N.onclick,method:this._setOnClick});this.setAttributeConfig("focusmenu",{value:(N.focusmenu===false?false:true),validator:I.isBoolean});},focus:function(){if(!this.get("disabled")){this._button.focus();}},blur:function(){if(!this.get("disabled")){this._button.blur();}},hasFocus:function(){return(C==this);},isActive:function(){return this.hasClass(this.CSS_CLASS_NAME+"-active");},getMenu:function(){return this._menu;},getForm:function(){var N=this._button,O;if(N){O=N.form;}return O;},getHiddenFields:function(){return this._hiddenFields;},destroy:function(){var P=this.get("element"),O=P.parentNode,N=this._menu,R;if(N){if(K&&K.find(N)){K.remove(N);}N.destroy();}M.purgeElement(P);M.purgeElement(this._button);M.removeListener(document,"mouseup",this._onDocumentMouseUp);M.removeListener(document,"keyup",this._onDocumentKeyUp);M.removeListener(document,"mousedown",this._onDocumentMouseDown);var Q=this.getForm();if(Q){M.removeListener(Q,"reset",this._onFormReset);M.removeListener(Q,"submit",this._onFormSubmit);}this.unsubscribeAll();if(O){O.removeChild(P);}delete D[this.get("id")];R=G.getElementsByClassName(this.CSS_CLASS_NAME,this.NODE_NAME,Q);if(I.isArray(R)&&R.length===0){M.removeListener(Q,"keypress",YAHOO.widget.Button.onFormKeyPress);}},fireEvent:function(O,N){var P=arguments[0];if(this.DOM_EVENTS[P]&&this.get("disabled")){return false;}return YAHOO.widget.Button.superclass.fireEvent.apply(this,arguments);},toString:function(){return("Button "+this.get("id"));}});YAHOO.widget.Button.onFormKeyPress=function(R){var P=M.getTarget(R),S=M.getCharCode(R),Q=P.nodeName&&P.nodeName.toUpperCase(),N=P.type,T=false,V,X,O,W;function U(a){var Z,Y;switch(a.nodeName.toUpperCase()){case"INPUT":case"BUTTON":if(a.type=="submit"&&!a.disabled){if(!T&&!O){O=a;}}break;default:Z=a.id;if(Z){V=D[Z];if(V){T=true;if(!V.get("disabled")){Y=V.get("srcelement");if(!X&&(V.get("type")=="submit"||(Y&&Y.type=="submit"))){X=V;}}}}break;}}if(S==13&&((Q=="INPUT"&&(N=="text"||N=="password"||N=="checkbox"||N=="radio"||N=="file"))||Q=="SELECT")){G.getElementsBy(U,"*",this);if(O){O.focus();}else{if(!O&&X){M.preventDefault(R);if(L.ie){X.get("element").fireEvent("onclick");}else{W=document.createEvent("HTMLEvents");W.initEvent("click",true,true);if(L.gecko<1.9){X.fireEvent("click",W);
}else{X.get("element").dispatchEvent(W);}}}}}};YAHOO.widget.Button.addHiddenFieldsToForm=function(N){var S=G.getElementsByClassName(YAHOO.widget.Button.prototype.CSS_CLASS_NAME,"*",N),Q=S.length,R,O,P;if(Q>0){for(P=0;P<Q;P++){O=S[P].id;if(O){R=D[O];if(R){R.createHiddenFields();}}}}};YAHOO.widget.Button.getButton=function(N){return D[N];};})();(function(){var C=YAHOO.util.Dom,B=YAHOO.util.Event,D=YAHOO.lang,A=YAHOO.widget.Button,E={};YAHOO.widget.ButtonGroup=function(J,H){var I=YAHOO.widget.ButtonGroup.superclass.constructor,K,G,F;if(arguments.length==1&&!D.isString(J)&&!J.nodeName){if(!J.id){F=C.generateId();J.id=F;}I.call(this,(this._createGroupElement()),J);}else{if(D.isString(J)){G=C.get(J);if(G){if(G.nodeName.toUpperCase()==this.NODE_NAME){I.call(this,G,H);}}}else{K=J.nodeName.toUpperCase();if(K&&K==this.NODE_NAME){if(!J.id){J.id=C.generateId();}I.call(this,J,H);}}}};YAHOO.extend(YAHOO.widget.ButtonGroup,YAHOO.util.Element,{_buttons:null,NODE_NAME:"DIV",CSS_CLASS_NAME:"yui-buttongroup",_createGroupElement:function(){var F=document.createElement(this.NODE_NAME);return F;},_setDisabled:function(G){var H=this.getCount(),F;if(H>0){F=H-1;do{this._buttons[F].set("disabled",G);}while(F--);}},_onKeyDown:function(K){var G=B.getTarget(K),I=B.getCharCode(K),H=G.parentNode.parentNode.id,J=E[H],F=-1;if(I==37||I==38){F=(J.index===0)?(this._buttons.length-1):(J.index-1);}else{if(I==39||I==40){F=(J.index===(this._buttons.length-1))?0:(J.index+1);}}if(F>-1){this.check(F);this.getButton(F).focus();}},_onAppendTo:function(H){var I=this._buttons,G=I.length,F;for(F=0;F<G;F++){I[F].appendTo(this.get("element"));}},_onButtonCheckedChange:function(G,F){var I=G.newValue,H=this.get("checkedButton");if(I&&H!=F){if(H){H.set("checked",false,true);}this.set("checkedButton",F);this.set("value",F.get("value"));}else{if(H&&!H.set("checked")){H.set("checked",true,true);}}},init:function(I,H){this._buttons=[];YAHOO.widget.ButtonGroup.superclass.init.call(this,I,H);this.addClass(this.CSS_CLASS_NAME);var J=this.getElementsByClassName("yui-radio-button");if(J.length>0){this.addButtons(J);}function F(K){return(K.type=="radio");}J=C.getElementsBy(F,"input",this.get("element"));if(J.length>0){this.addButtons(J);}this.on("keydown",this._onKeyDown);this.on("appendTo",this._onAppendTo);var G=this.get("container");if(G){if(D.isString(G)){B.onContentReady(G,function(){this.appendTo(G);},null,this);}else{this.appendTo(G);}}},initAttributes:function(G){var F=G||{};YAHOO.widget.ButtonGroup.superclass.initAttributes.call(this,F);this.setAttributeConfig("name",{value:F.name,validator:D.isString});this.setAttributeConfig("disabled",{value:(F.disabled||false),validator:D.isBoolean,method:this._setDisabled});this.setAttributeConfig("value",{value:F.value});this.setAttributeConfig("container",{value:F.container,writeOnce:true});this.setAttributeConfig("checkedButton",{value:null});},addButton:function(J){var L,K,G,F,H,I;if(J instanceof A&&J.get("type")=="radio"){L=J;}else{if(!D.isString(J)&&!J.nodeName){J.type="radio";L=new A(J);}else{L=new A(J,{type:"radio"});}}if(L){F=this._buttons.length;H=L.get("name");I=this.get("name");L.index=F;this._buttons[F]=L;E[L.get("id")]=L;if(H!=I){L.set("name",I);}if(this.get("disabled")){L.set("disabled",true);}if(L.get("checked")){this.set("checkedButton",L);}K=L.get("element");G=this.get("element");if(K.parentNode!=G){G.appendChild(K);}L.on("checkedChange",this._onButtonCheckedChange,L,this);}return L;},addButtons:function(G){var H,I,J,F;if(D.isArray(G)){H=G.length;J=[];if(H>0){for(F=0;F<H;F++){I=this.addButton(G[F]);if(I){J[J.length]=I;}}}}return J;},removeButton:function(H){var I=this.getButton(H),G,F;if(I){this._buttons.splice(H,1);delete E[I.get("id")];I.removeListener("checkedChange",this._onButtonCheckedChange);I.destroy();G=this._buttons.length;if(G>0){F=this._buttons.length-1;do{this._buttons[F].index=F;}while(F--);}}},getButton:function(F){return this._buttons[F];},getButtons:function(){return this._buttons;},getCount:function(){return this._buttons.length;},focus:function(H){var I,G,F;if(D.isNumber(H)){I=this._buttons[H];if(I){I.focus();}}else{G=this.getCount();for(F=0;F<G;F++){I=this._buttons[F];if(!I.get("disabled")){I.focus();break;}}}},check:function(F){var G=this.getButton(F);if(G){G.set("checked",true);}},destroy:function(){var I=this._buttons.length,H=this.get("element"),F=H.parentNode,G;if(I>0){G=this._buttons.length-1;do{this._buttons[G].destroy();}while(G--);}B.purgeElement(H);F.removeChild(H);},toString:function(){return("ButtonGroup "+this.get("id"));}});})();YAHOO.register("button",YAHOO.widget.Button,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/button/button-min.js');
};
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){YAHOO.util.Config=function(D){if(D){this.init(D);}};var B=YAHOO.lang,C=YAHOO.util.CustomEvent,A=YAHOO.util.Config;A.CONFIG_CHANGED_EVENT="configChanged";A.BOOLEAN_TYPE="boolean";A.prototype={owner:null,queueInProgress:false,config:null,initialConfig:null,eventQueue:null,configChangedEvent:null,init:function(D){this.owner=D;this.configChangedEvent=this.createEvent(A.CONFIG_CHANGED_EVENT);this.configChangedEvent.signature=C.LIST;this.queueInProgress=false;this.config={};this.initialConfig={};this.eventQueue=[];},checkBoolean:function(D){return(typeof D==A.BOOLEAN_TYPE);},checkNumber:function(D){return(!isNaN(D));},fireEvent:function(D,F){var E=this.config[D];if(E&&E.event){E.event.fire(F);}},addProperty:function(E,D){E=E.toLowerCase();this.config[E]=D;D.event=this.createEvent(E,{scope:this.owner});D.event.signature=C.LIST;D.key=E;if(D.handler){D.event.subscribe(D.handler,this.owner);}this.setProperty(E,D.value,true);if(!D.suppressEvent){this.queueProperty(E,D.value);}},getConfig:function(){var D={},F=this.config,G,E;for(G in F){if(B.hasOwnProperty(F,G)){E=F[G];if(E&&E.event){D[G]=E.value;}}}return D;},getProperty:function(D){var E=this.config[D.toLowerCase()];if(E&&E.event){return E.value;}else{return undefined;}},resetProperty:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event){if(this.initialConfig[D]&&!B.isUndefined(this.initialConfig[D])){this.setProperty(D,this.initialConfig[D]);return true;}}else{return false;}},setProperty:function(E,G,D){var F;E=E.toLowerCase();if(this.queueInProgress&&!D){this.queueProperty(E,G);return true;}else{F=this.config[E];if(F&&F.event){if(F.validator&&!F.validator(G)){return false;}else{F.value=G;if(!D){this.fireEvent(E,G);this.configChangedEvent.fire([E,G]);}return true;}}else{return false;}}},queueProperty:function(S,P){S=S.toLowerCase();var R=this.config[S],K=false,J,G,H,I,O,Q,F,M,N,D,L,T,E;if(R&&R.event){if(!B.isUndefined(P)&&R.validator&&!R.validator(P)){return false;}else{if(!B.isUndefined(P)){R.value=P;}else{P=R.value;}K=false;J=this.eventQueue.length;for(L=0;L<J;L++){G=this.eventQueue[L];if(G){H=G[0];I=G[1];if(H==S){this.eventQueue[L]=null;this.eventQueue.push([S,(!B.isUndefined(P)?P:I)]);K=true;break;}}}if(!K&&!B.isUndefined(P)){this.eventQueue.push([S,P]);}}if(R.supercedes){O=R.supercedes.length;for(T=0;T<O;T++){Q=R.supercedes[T];F=this.eventQueue.length;for(E=0;E<F;E++){M=this.eventQueue[E];if(M){N=M[0];D=M[1];if(N==Q.toLowerCase()){this.eventQueue.push([N,D]);this.eventQueue[E]=null;break;}}}}}return true;}else{return false;}},refireEvent:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event&&!B.isUndefined(E.value)){if(this.queueInProgress){this.queueProperty(D);}else{this.fireEvent(D,E.value);}}},applyConfig:function(D,G){var F,E;if(G){E={};for(F in D){if(B.hasOwnProperty(D,F)){E[F.toLowerCase()]=D[F];}}this.initialConfig=E;}for(F in D){if(B.hasOwnProperty(D,F)){this.queueProperty(F,D[F]);}}},refresh:function(){var D;for(D in this.config){if(B.hasOwnProperty(this.config,D)){this.refireEvent(D);}}},fireQueue:function(){var E,H,D,G,F;this.queueInProgress=true;for(E=0;E<this.eventQueue.length;E++){H=this.eventQueue[E];if(H){D=H[0];G=H[1];F=this.config[D];F.value=G;this.eventQueue[E]=null;this.fireEvent(D,G);}}this.queueInProgress=false;this.eventQueue=[];},subscribeToConfigEvent:function(E,F,H,D){var G=this.config[E.toLowerCase()];if(G&&G.event){if(!A.alreadySubscribed(G.event,F,H)){G.event.subscribe(F,H,D);}return true;}else{return false;}},unsubscribeFromConfigEvent:function(D,E,G){var F=this.config[D.toLowerCase()];if(F&&F.event){return F.event.unsubscribe(E,G);}else{return false;}},toString:function(){var D="Config";if(this.owner){D+=" ["+this.owner.toString()+"]";}return D;},outputEventQueue:function(){var D="",G,E,F=this.eventQueue.length;for(E=0;E<F;E++){G=this.eventQueue[E];if(G){D+=G[0]+"="+G[1]+", ";}}return D;},destroy:function(){var E=this.config,D,F;for(D in E){if(B.hasOwnProperty(E,D)){F=E[D];F.event.unsubscribeAll();F.event=null;}}this.configChangedEvent.unsubscribeAll();this.configChangedEvent=null;this.owner=null;this.config=null;this.initialConfig=null;this.eventQueue=null;}};A.alreadySubscribed=function(E,H,I){var F=E.subscribers.length,D,G;if(F>0){G=F-1;do{D=E.subscribers[G];if(D&&D.obj==I&&D.fn==H){return true;}}while(G--);}return false;};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Module=function(R,Q){if(R){this.init(R,Q);}else{}};var F=YAHOO.util.Dom,D=YAHOO.util.Config,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,I=YAHOO.env.ua,H,P,O,E,A={"BEFORE_INIT":"beforeInit","INIT":"init","APPEND":"append","BEFORE_RENDER":"beforeRender","RENDER":"render","CHANGE_HEADER":"changeHeader","CHANGE_BODY":"changeBody","CHANGE_FOOTER":"changeFooter","CHANGE_CONTENT":"changeContent","DESTORY":"destroy","BEFORE_SHOW":"beforeShow","SHOW":"show","BEFORE_HIDE":"beforeHide","HIDE":"hide"},J={"VISIBLE":{key:"visible",value:true,validator:YAHOO.lang.isBoolean},"EFFECT":{key:"effect",suppressEvent:true,supercedes:["visible"]},"MONITOR_RESIZE":{key:"monitorresize",value:true},"APPEND_TO_DOCUMENT_BODY":{key:"appendtodocumentbody",value:false}};G.IMG_ROOT=null;G.IMG_ROOT_SSL=null;G.CSS_MODULE="yui-module";G.CSS_HEADER="hd";G.CSS_BODY="bd";G.CSS_FOOTER="ft";G.RESIZE_MONITOR_SECURE_URL="javascript:false;";G.RESIZE_MONITOR_BUFFER=1;G.textResizeEvent=new M("textResize");G.forceDocumentRedraw=function(){var Q=document.documentElement;if(Q){Q.className+=" ";Q.className=YAHOO.lang.trim(Q.className);}};function L(){if(!H){H=document.createElement("div");H.innerHTML=('<div class="'+G.CSS_HEADER+'"></div>'+'<div class="'+G.CSS_BODY+'"></div><div class="'+G.CSS_FOOTER+'"></div>');P=H.firstChild;O=P.nextSibling;E=O.nextSibling;}return H;}function K(){if(!P){L();}return(P.cloneNode(false));}function B(){if(!O){L();}return(O.cloneNode(false));}function C(){if(!E){L();}return(E.cloneNode(false));}G.prototype={constructor:G,element:null,header:null,body:null,footer:null,id:null,imageRoot:G.IMG_ROOT,initEvents:function(){var Q=M.LIST;
this.beforeInitEvent=this.createEvent(A.BEFORE_INIT);this.beforeInitEvent.signature=Q;this.initEvent=this.createEvent(A.INIT);this.initEvent.signature=Q;this.appendEvent=this.createEvent(A.APPEND);this.appendEvent.signature=Q;this.beforeRenderEvent=this.createEvent(A.BEFORE_RENDER);this.beforeRenderEvent.signature=Q;this.renderEvent=this.createEvent(A.RENDER);this.renderEvent.signature=Q;this.changeHeaderEvent=this.createEvent(A.CHANGE_HEADER);this.changeHeaderEvent.signature=Q;this.changeBodyEvent=this.createEvent(A.CHANGE_BODY);this.changeBodyEvent.signature=Q;this.changeFooterEvent=this.createEvent(A.CHANGE_FOOTER);this.changeFooterEvent.signature=Q;this.changeContentEvent=this.createEvent(A.CHANGE_CONTENT);this.changeContentEvent.signature=Q;this.destroyEvent=this.createEvent(A.DESTORY);this.destroyEvent.signature=Q;this.beforeShowEvent=this.createEvent(A.BEFORE_SHOW);this.beforeShowEvent.signature=Q;this.showEvent=this.createEvent(A.SHOW);this.showEvent.signature=Q;this.beforeHideEvent=this.createEvent(A.BEFORE_HIDE);this.beforeHideEvent.signature=Q;this.hideEvent=this.createEvent(A.HIDE);this.hideEvent.signature=Q;},platform:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("windows")!=-1||Q.indexOf("win32")!=-1){return"windows";}else{if(Q.indexOf("macintosh")!=-1){return"mac";}else{return false;}}}(),browser:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("opera")!=-1){return"opera";}else{if(Q.indexOf("msie 7")!=-1){return"ie7";}else{if(Q.indexOf("msie")!=-1){return"ie";}else{if(Q.indexOf("safari")!=-1){return"safari";}else{if(Q.indexOf("gecko")!=-1){return"gecko";}else{return false;}}}}}}(),isSecure:function(){if(window.location.href.toLowerCase().indexOf("https")===0){return true;}else{return false;}}(),initDefaultConfig:function(){this.cfg.addProperty(J.VISIBLE.key,{handler:this.configVisible,value:J.VISIBLE.value,validator:J.VISIBLE.validator});this.cfg.addProperty(J.EFFECT.key,{suppressEvent:J.EFFECT.suppressEvent,supercedes:J.EFFECT.supercedes});this.cfg.addProperty(J.MONITOR_RESIZE.key,{handler:this.configMonitorResize,value:J.MONITOR_RESIZE.value});this.cfg.addProperty(J.APPEND_TO_DOCUMENT_BODY.key,{value:J.APPEND_TO_DOCUMENT_BODY.value});},init:function(V,U){var S,W;this.initEvents();this.beforeInitEvent.fire(G);this.cfg=new D(this);if(this.isSecure){this.imageRoot=G.IMG_ROOT_SSL;}if(typeof V=="string"){S=V;V=document.getElementById(V);if(!V){V=(L()).cloneNode(false);V.id=S;}}this.id=F.generateId(V);this.element=V;W=this.element.firstChild;if(W){var R=false,Q=false,T=false;do{if(1==W.nodeType){if(!R&&F.hasClass(W,G.CSS_HEADER)){this.header=W;R=true;}else{if(!Q&&F.hasClass(W,G.CSS_BODY)){this.body=W;Q=true;}else{if(!T&&F.hasClass(W,G.CSS_FOOTER)){this.footer=W;T=true;}}}}}while((W=W.nextSibling));}this.initDefaultConfig();F.addClass(this.element,G.CSS_MODULE);if(U){this.cfg.applyConfig(U,true);}if(!D.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);}this.initEvent.fire(G);},initResizeMonitor:function(){var R=(I.gecko&&this.platform=="windows");if(R){var Q=this;setTimeout(function(){Q._initResizeMonitor();},0);}else{this._initResizeMonitor();}},_initResizeMonitor:function(){var Q,S,U;function W(){G.textResizeEvent.fire();}if(!I.opera){S=F.get("_yuiResizeMonitor");var V=this._supportsCWResize();if(!S){S=document.createElement("iframe");if(this.isSecure&&G.RESIZE_MONITOR_SECURE_URL&&I.ie){S.src=G.RESIZE_MONITOR_SECURE_URL;}if(!V){U=["<html><head><script ",'type="text/javascript">',"window.onresize=function(){window.parent.","YAHOO.widget.Module.textResizeEvent.","fire();};<","/script></head>","<body></body></html>"].join("");S.src="data:text/html;charset=utf-8,"+encodeURIComponent(U);}S.id="_yuiResizeMonitor";S.title="Text Resize Monitor";S.style.position="absolute";S.style.visibility="hidden";var R=document.body,T=R.firstChild;if(T){R.insertBefore(S,T);}else{R.appendChild(S);}S.style.width="2em";S.style.height="2em";S.style.top=(-1*(S.offsetHeight+G.RESIZE_MONITOR_BUFFER))+"px";S.style.left="0";S.style.borderWidth="0";S.style.visibility="visible";if(I.webkit){Q=S.contentWindow.document;Q.open();Q.close();}}if(S&&S.contentWindow){G.textResizeEvent.subscribe(this.onDomResize,this,true);if(!G.textResizeInitialized){if(V){if(!N.on(S.contentWindow,"resize",W)){N.on(S,"resize",W);}}G.textResizeInitialized=true;}this.resizeMonitor=S;}}},_supportsCWResize:function(){var Q=true;if(I.gecko&&I.gecko<=1.8){Q=false;}return Q;},onDomResize:function(S,R){var Q=-1*(this.resizeMonitor.offsetHeight+G.RESIZE_MONITOR_BUFFER);this.resizeMonitor.style.top=Q+"px";this.resizeMonitor.style.left="0";},setHeader:function(R){var Q=this.header||(this.header=K());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},appendToHeader:function(R){var Q=this.header||(this.header=K());Q.appendChild(R);this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},setBody:function(R){var Q=this.body||(this.body=B());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},appendToBody:function(R){var Q=this.body||(this.body=B());Q.appendChild(R);this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},setFooter:function(R){var Q=this.footer||(this.footer=C());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},appendToFooter:function(R){var Q=this.footer||(this.footer=C());Q.appendChild(R);this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},render:function(S,Q){var T=this,U;function R(V){if(typeof V=="string"){V=document.getElementById(V);}if(V){T._addToParent(V,T.element);T.appendEvent.fire();}}this.beforeRenderEvent.fire();if(!Q){Q=this.element;}if(S){R(S);}else{if(!F.inDocument(this.element)){return false;}}if(this.header&&!F.inDocument(this.header)){U=Q.firstChild;
if(U){Q.insertBefore(this.header,U);}else{Q.appendChild(this.header);}}if(this.body&&!F.inDocument(this.body)){if(this.footer&&F.isAncestor(this.moduleElement,this.footer)){Q.insertBefore(this.body,this.footer);}else{Q.appendChild(this.body);}}if(this.footer&&!F.inDocument(this.footer)){Q.appendChild(this.footer);}this.renderEvent.fire();return true;},destroy:function(){var Q;if(this.element){N.purgeElement(this.element,true);Q=this.element.parentNode;}if(Q){Q.removeChild(this.element);}this.element=null;this.header=null;this.body=null;this.footer=null;G.textResizeEvent.unsubscribe(this.onDomResize,this);this.cfg.destroy();this.cfg=null;this.destroyEvent.fire();},show:function(){this.cfg.setProperty("visible",true);},hide:function(){this.cfg.setProperty("visible",false);},configVisible:function(R,Q,S){var T=Q[0];if(T){this.beforeShowEvent.fire();F.setStyle(this.element,"display","block");this.showEvent.fire();}else{this.beforeHideEvent.fire();F.setStyle(this.element,"display","none");this.hideEvent.fire();}},configMonitorResize:function(S,R,T){var Q=R[0];if(Q){this.initResizeMonitor();}else{G.textResizeEvent.unsubscribe(this.onDomResize,this,true);this.resizeMonitor=null;}},_addToParent:function(Q,R){if(!this.cfg.getProperty("appendtodocumentbody")&&Q===document.body&&Q.firstChild){Q.insertBefore(R,Q.firstChild);}else{Q.appendChild(R);}},toString:function(){return"Module "+this.id;}};YAHOO.lang.augmentProto(G,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Overlay=function(P,O){YAHOO.widget.Overlay.superclass.constructor.call(this,P,O);};var I=YAHOO.lang,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,N=YAHOO.util.Event,F=YAHOO.util.Dom,D=YAHOO.util.Config,K=YAHOO.env.ua,B=YAHOO.widget.Overlay,H="subscribe",E="unsubscribe",C="contained",J,A={"BEFORE_MOVE":"beforeMove","MOVE":"move"},L={"X":{key:"x",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"Y":{key:"y",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"XY":{key:"xy",suppressEvent:true,supercedes:["iframe"]},"CONTEXT":{key:"context",suppressEvent:true,supercedes:["iframe"]},"FIXED_CENTER":{key:"fixedcenter",value:false,supercedes:["iframe","visible"]},"WIDTH":{key:"width",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"HEIGHT":{key:"height",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"AUTO_FILL_HEIGHT":{key:"autofillheight",supercedes:["height"],value:"body"},"ZINDEX":{key:"zindex",value:null},"CONSTRAIN_TO_VIEWPORT":{key:"constraintoviewport",value:false,validator:I.isBoolean,supercedes:["iframe","x","y","xy"]},"IFRAME":{key:"iframe",value:(K.ie==6?true:false),validator:I.isBoolean,supercedes:["zindex"]},"PREVENT_CONTEXT_OVERLAP":{key:"preventcontextoverlap",value:false,validator:I.isBoolean,supercedes:["constraintoviewport"]}};B.IFRAME_SRC="javascript:false;";B.IFRAME_OFFSET=3;B.VIEWPORT_OFFSET=10;B.TOP_LEFT="tl";B.TOP_RIGHT="tr";B.BOTTOM_LEFT="bl";B.BOTTOM_RIGHT="br";B.CSS_OVERLAY="yui-overlay";B.STD_MOD_RE=/^\s*?(body|footer|header)\s*?$/i;B.windowScrollEvent=new M("windowScroll");B.windowResizeEvent=new M("windowResize");B.windowScrollHandler=function(P){var O=N.getTarget(P);if(!O||O===window||O===window.document){if(K.ie){if(!window.scrollEnd){window.scrollEnd=-1;}clearTimeout(window.scrollEnd);window.scrollEnd=setTimeout(function(){B.windowScrollEvent.fire();},1);}else{B.windowScrollEvent.fire();}}};B.windowResizeHandler=function(O){if(K.ie){if(!window.resizeEnd){window.resizeEnd=-1;}clearTimeout(window.resizeEnd);window.resizeEnd=setTimeout(function(){B.windowResizeEvent.fire();},100);}else{B.windowResizeEvent.fire();}};B._initialized=null;if(B._initialized===null){N.on(window,"scroll",B.windowScrollHandler);N.on(window,"resize",B.windowResizeHandler);B._initialized=true;}B._TRIGGER_MAP={"windowScroll":B.windowScrollEvent,"windowResize":B.windowResizeEvent,"textResize":G.textResizeEvent};YAHOO.extend(B,G,{CONTEXT_TRIGGERS:[],init:function(P,O){B.superclass.init.call(this,P);this.beforeInitEvent.fire(B);F.addClass(this.element,B.CSS_OVERLAY);if(O){this.cfg.applyConfig(O,true);}if(this.platform=="mac"&&K.gecko){if(!D.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);}if(!D.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);}}this.initEvent.fire(B);},initEvents:function(){B.superclass.initEvents.call(this);var O=M.LIST;this.beforeMoveEvent=this.createEvent(A.BEFORE_MOVE);this.beforeMoveEvent.signature=O;this.moveEvent=this.createEvent(A.MOVE);this.moveEvent.signature=O;},initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);var O=this.cfg;O.addProperty(L.X.key,{handler:this.configX,validator:L.X.validator,suppressEvent:L.X.suppressEvent,supercedes:L.X.supercedes});O.addProperty(L.Y.key,{handler:this.configY,validator:L.Y.validator,suppressEvent:L.Y.suppressEvent,supercedes:L.Y.supercedes});O.addProperty(L.XY.key,{handler:this.configXY,suppressEvent:L.XY.suppressEvent,supercedes:L.XY.supercedes});O.addProperty(L.CONTEXT.key,{handler:this.configContext,suppressEvent:L.CONTEXT.suppressEvent,supercedes:L.CONTEXT.supercedes});O.addProperty(L.FIXED_CENTER.key,{handler:this.configFixedCenter,value:L.FIXED_CENTER.value,validator:L.FIXED_CENTER.validator,supercedes:L.FIXED_CENTER.supercedes});O.addProperty(L.WIDTH.key,{handler:this.configWidth,suppressEvent:L.WIDTH.suppressEvent,supercedes:L.WIDTH.supercedes});O.addProperty(L.HEIGHT.key,{handler:this.configHeight,suppressEvent:L.HEIGHT.suppressEvent,supercedes:L.HEIGHT.supercedes});O.addProperty(L.AUTO_FILL_HEIGHT.key,{handler:this.configAutoFillHeight,value:L.AUTO_FILL_HEIGHT.value,validator:this._validateAutoFill,supercedes:L.AUTO_FILL_HEIGHT.supercedes});O.addProperty(L.ZINDEX.key,{handler:this.configzIndex,value:L.ZINDEX.value});O.addProperty(L.CONSTRAIN_TO_VIEWPORT.key,{handler:this.configConstrainToViewport,value:L.CONSTRAIN_TO_VIEWPORT.value,validator:L.CONSTRAIN_TO_VIEWPORT.validator,supercedes:L.CONSTRAIN_TO_VIEWPORT.supercedes});
O.addProperty(L.IFRAME.key,{handler:this.configIframe,value:L.IFRAME.value,validator:L.IFRAME.validator,supercedes:L.IFRAME.supercedes});O.addProperty(L.PREVENT_CONTEXT_OVERLAP.key,{value:L.PREVENT_CONTEXT_OVERLAP.value,validator:L.PREVENT_CONTEXT_OVERLAP.validator,supercedes:L.PREVENT_CONTEXT_OVERLAP.supercedes});},moveTo:function(O,P){this.cfg.setProperty("xy",[O,P]);},hideMacGeckoScrollbars:function(){F.replaceClass(this.element,"show-scrollbars","hide-scrollbars");},showMacGeckoScrollbars:function(){F.replaceClass(this.element,"hide-scrollbars","show-scrollbars");},_setDomVisibility:function(O){F.setStyle(this.element,"visibility",(O)?"visible":"hidden");if(O){F.removeClass(this.element,"yui-overlay-hidden");}else{F.addClass(this.element,"yui-overlay-hidden");}},configVisible:function(R,O,X){var Q=O[0],S=F.getStyle(this.element,"visibility"),Y=this.cfg.getProperty("effect"),V=[],U=(this.platform=="mac"&&K.gecko),g=D.alreadySubscribed,W,P,f,c,b,a,d,Z,T;if(S=="inherit"){f=this.element.parentNode;while(f.nodeType!=9&&f.nodeType!=11){S=F.getStyle(f,"visibility");if(S!="inherit"){break;}f=f.parentNode;}if(S=="inherit"){S="visible";}}if(Y){if(Y instanceof Array){Z=Y.length;for(c=0;c<Z;c++){W=Y[c];V[V.length]=W.effect(this,W.duration);}}else{V[V.length]=Y.effect(this,Y.duration);}}if(Q){if(U){this.showMacGeckoScrollbars();}if(Y){if(Q){if(S!="visible"||S===""){this.beforeShowEvent.fire();T=V.length;for(b=0;b<T;b++){P=V[b];if(b===0&&!g(P.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){P.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);}P.animateIn();}}}}else{if(S!="visible"||S===""){this.beforeShowEvent.fire();this._setDomVisibility(true);this.cfg.refireEvent("iframe");this.showEvent.fire();}else{this._setDomVisibility(true);}}}else{if(U){this.hideMacGeckoScrollbars();}if(Y){if(S=="visible"){this.beforeHideEvent.fire();T=V.length;for(a=0;a<T;a++){d=V[a];if(a===0&&!g(d.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){d.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);}d.animateOut();}}else{if(S===""){this._setDomVisibility(false);}}}else{if(S=="visible"||S===""){this.beforeHideEvent.fire();this._setDomVisibility(false);this.hideEvent.fire();}else{this._setDomVisibility(false);}}}},doCenterOnDOMEvent:function(){var O=this.cfg,P=O.getProperty("fixedcenter");if(O.getProperty("visible")){if(P&&(P!==C||this.fitsInViewport())){this.center();}}},fitsInViewport:function(){var S=B.VIEWPORT_OFFSET,Q=this.element,T=Q.offsetWidth,R=Q.offsetHeight,O=F.getViewportWidth(),P=F.getViewportHeight();return((T+S<O)&&(R+S<P));},configFixedCenter:function(S,Q,T){var U=Q[0],P=D.alreadySubscribed,R=B.windowResizeEvent,O=B.windowScrollEvent;if(U){this.center();if(!P(this.beforeShowEvent,this.center)){this.beforeShowEvent.subscribe(this.center);}if(!P(R,this.doCenterOnDOMEvent,this)){R.subscribe(this.doCenterOnDOMEvent,this,true);}if(!P(O,this.doCenterOnDOMEvent,this)){O.subscribe(this.doCenterOnDOMEvent,this,true);}}else{this.beforeShowEvent.unsubscribe(this.center);R.unsubscribe(this.doCenterOnDOMEvent,this);O.unsubscribe(this.doCenterOnDOMEvent,this);}},configHeight:function(R,P,S){var O=P[0],Q=this.element;F.setStyle(Q,"height",O);this.cfg.refireEvent("iframe");},configAutoFillHeight:function(T,S,P){var V=S[0],Q=this.cfg,U="autofillheight",W="height",R=Q.getProperty(U),O=this._autoFillOnHeightChange;Q.unsubscribeFromConfigEvent(W,O);G.textResizeEvent.unsubscribe(O);this.changeContentEvent.unsubscribe(O);if(R&&V!==R&&this[R]){F.setStyle(this[R],W,"");}if(V){V=I.trim(V.toLowerCase());Q.subscribeToConfigEvent(W,O,this[V],this);G.textResizeEvent.subscribe(O,this[V],this);this.changeContentEvent.subscribe(O,this[V],this);Q.setProperty(U,V,true);}},configWidth:function(R,O,S){var Q=O[0],P=this.element;F.setStyle(P,"width",Q);this.cfg.refireEvent("iframe");},configzIndex:function(Q,O,R){var S=O[0],P=this.element;if(!S){S=F.getStyle(P,"zIndex");if(!S||isNaN(S)){S=0;}}if(this.iframe||this.cfg.getProperty("iframe")===true){if(S<=0){S=1;}}F.setStyle(P,"zIndex",S);this.cfg.setProperty("zIndex",S,true);if(this.iframe){this.stackIframe();}},configXY:function(Q,P,R){var T=P[0],O=T[0],S=T[1];this.cfg.setProperty("x",O);this.cfg.setProperty("y",S);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configX:function(Q,P,R){var O=P[0],S=this.cfg.getProperty("y");this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setX(this.element,O,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configY:function(Q,P,R){var O=this.cfg.getProperty("x"),S=P[0];this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setY(this.element,S,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},showIframe:function(){var P=this.iframe,O;if(P){O=this.element.parentNode;if(O!=P.parentNode){this._addToParent(O,P);}P.style.display="block";}},hideIframe:function(){if(this.iframe){this.iframe.style.display="none";}},syncIframe:function(){var O=this.iframe,Q=this.element,S=B.IFRAME_OFFSET,P=(S*2),R;if(O){O.style.width=(Q.offsetWidth+P+"px");O.style.height=(Q.offsetHeight+P+"px");R=this.cfg.getProperty("xy");if(!I.isArray(R)||(isNaN(R[0])||isNaN(R[1]))){this.syncPosition();R=this.cfg.getProperty("xy");}F.setXY(O,[(R[0]-S),(R[1]-S)]);}},stackIframe:function(){if(this.iframe){var O=F.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(O)&&!isNaN(O)){F.setStyle(this.iframe,"zIndex",(O-1));}}},configIframe:function(R,Q,S){var O=Q[0];function T(){var V=this.iframe,W=this.element,X;if(!V){if(!J){J=document.createElement("iframe");if(this.isSecure){J.src=B.IFRAME_SRC;}if(K.ie){J.style.filter="alpha(opacity=0)";
J.frameBorder=0;}else{J.style.opacity="0";}J.style.position="absolute";J.style.border="none";J.style.margin="0";J.style.padding="0";J.style.display="none";J.tabIndex=-1;}V=J.cloneNode(false);X=W.parentNode;var U=X||document.body;this._addToParent(U,V);this.iframe=V;}this.showIframe();this.syncIframe();this.stackIframe();if(!this._hasIframeEventListeners){this.showEvent.subscribe(this.showIframe);this.hideEvent.subscribe(this.hideIframe);this.changeContentEvent.subscribe(this.syncIframe);this._hasIframeEventListeners=true;}}function P(){T.call(this);this.beforeShowEvent.unsubscribe(P);this._iframeDeferred=false;}if(O){if(this.cfg.getProperty("visible")){T.call(this);}else{if(!this._iframeDeferred){this.beforeShowEvent.subscribe(P);this._iframeDeferred=true;}}}else{this.hideIframe();if(this._hasIframeEventListeners){this.showEvent.unsubscribe(this.showIframe);this.hideEvent.unsubscribe(this.hideIframe);this.changeContentEvent.unsubscribe(this.syncIframe);this._hasIframeEventListeners=false;}}},_primeXYFromDOM:function(){if(YAHOO.lang.isUndefined(this.cfg.getProperty("xy"))){this.syncPosition();this.cfg.refireEvent("xy");this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);}},configConstrainToViewport:function(P,O,Q){var R=O[0];if(R){if(!D.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);}if(!D.alreadySubscribed(this.beforeShowEvent,this._primeXYFromDOM)){this.beforeShowEvent.subscribe(this._primeXYFromDOM);}}else{this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);}},configContext:function(T,S,P){var W=S[0],Q,O,U,R,V=this.CONTEXT_TRIGGERS;if(W){Q=W[0];O=W[1];U=W[2];R=W[3];if(V&&V.length>0){R=(R||[]).concat(V);}if(Q){if(typeof Q=="string"){this.cfg.setProperty("context",[document.getElementById(Q),O,U,R],true);}if(O&&U){this.align(O,U);}if(this._contextTriggers){this._processTriggers(this._contextTriggers,E,this._alignOnTrigger);}if(R){this._processTriggers(R,H,this._alignOnTrigger);this._contextTriggers=R;}}}},_alignOnTrigger:function(P,O){this.align();},_findTriggerCE:function(O){var P=null;if(O instanceof M){P=O;}else{if(B._TRIGGER_MAP[O]){P=B._TRIGGER_MAP[O];}}return P;},_processTriggers:function(S,U,R){var Q,T;for(var P=0,O=S.length;P<O;++P){Q=S[P];T=this._findTriggerCE(Q);if(T){T[U](R,this,true);}else{this[U](Q,R);}}},align:function(P,O){var U=this.cfg.getProperty("context"),T=this,S,R,V;function Q(W,X){switch(P){case B.TOP_LEFT:T.moveTo(X,W);break;case B.TOP_RIGHT:T.moveTo((X-R.offsetWidth),W);break;case B.BOTTOM_LEFT:T.moveTo(X,(W-R.offsetHeight));break;case B.BOTTOM_RIGHT:T.moveTo((X-R.offsetWidth),(W-R.offsetHeight));break;}}if(U){S=U[0];R=this.element;T=this;if(!P){P=U[1];}if(!O){O=U[2];}if(R&&S){V=F.getRegion(S);switch(O){case B.TOP_LEFT:Q(V.top,V.left);break;case B.TOP_RIGHT:Q(V.top,V.right);break;case B.BOTTOM_LEFT:Q(V.bottom,V.left);break;case B.BOTTOM_RIGHT:Q(V.bottom,V.right);break;}}}},enforceConstraints:function(P,O,Q){var S=O[0];var R=this.getConstrainedXY(S[0],S[1]);this.cfg.setProperty("x",R[0],true);this.cfg.setProperty("y",R[1],true);this.cfg.setProperty("xy",R,true);},getConstrainedX:function(V){var S=this,O=S.element,e=O.offsetWidth,c=B.VIEWPORT_OFFSET,h=F.getViewportWidth(),d=F.getDocumentScrollLeft(),Y=(e+c<h),b=this.cfg.getProperty("context"),Q,X,j,T=false,f,W,g=d+c,P=d+h-e-c,i=V,U={"tltr":true,"blbr":true,"brbl":true,"trtl":true};var Z=function(){var k;if((S.cfg.getProperty("x")-d)>X){k=(X-e);}else{k=(X+j);}S.cfg.setProperty("x",(k+d),true);return k;};var R=function(){if((S.cfg.getProperty("x")-d)>X){return(W-c);}else{return(f-c);}};var a=function(){var k=R(),l;if(e>k){if(T){Z();}else{Z();T=true;l=a();}}return l;};if(V<g||V>P){if(Y){if(this.cfg.getProperty("preventcontextoverlap")&&b&&U[(b[1]+b[2])]){Q=b[0];X=F.getX(Q)-d;j=Q.offsetWidth;f=X;W=(h-(X+j));a();i=this.cfg.getProperty("x");}else{if(V<g){i=g;}else{if(V>P){i=P;}}}}else{i=c+d;}}return i;},getConstrainedY:function(Z){var W=this,P=W.element,i=P.offsetHeight,h=B.VIEWPORT_OFFSET,d=F.getViewportHeight(),g=F.getDocumentScrollTop(),e=(i+h<d),f=this.cfg.getProperty("context"),U,a,b,X=false,V,Q,c=g+h,S=g+d-i-h,O=Z,Y={"trbr":true,"tlbl":true,"bltl":true,"brtr":true};var T=function(){var k;if((W.cfg.getProperty("y")-g)>a){k=(a-i);}else{k=(a+b);}W.cfg.setProperty("y",(k+g),true);return k;};var R=function(){if((W.cfg.getProperty("y")-g)>a){return(Q-h);}else{return(V-h);}};var j=function(){var l=R(),k;if(i>l){if(X){T();}else{T();X=true;k=j();}}return k;};if(Z<c||Z>S){if(e){if(this.cfg.getProperty("preventcontextoverlap")&&f&&Y[(f[1]+f[2])]){U=f[0];b=U.offsetHeight;a=(F.getY(U)-g);V=a;Q=(d-(a+b));j();O=W.cfg.getProperty("y");}else{if(Z<c){O=c;}else{if(Z>S){O=S;}}}}else{O=h+g;}}return O;},getConstrainedXY:function(O,P){return[this.getConstrainedX(O),this.getConstrainedY(P)];},center:function(){var R=B.VIEWPORT_OFFSET,S=this.element.offsetWidth,Q=this.element.offsetHeight,P=F.getViewportWidth(),T=F.getViewportHeight(),O,U;if(S<P){O=(P/2)-(S/2)+F.getDocumentScrollLeft();}else{O=R+F.getDocumentScrollLeft();}if(Q<T){U=(T/2)-(Q/2)+F.getDocumentScrollTop();}else{U=R+F.getDocumentScrollTop();}this.cfg.setProperty("xy",[parseInt(O,10),parseInt(U,10)]);this.cfg.refireEvent("iframe");if(K.webkit){this.forceContainerRedraw();}},syncPosition:function(){var O=F.getXY(this.element);this.cfg.setProperty("x",O[0],true);this.cfg.setProperty("y",O[1],true);this.cfg.setProperty("xy",O,true);},onDomResize:function(Q,P){var O=this;B.superclass.onDomResize.call(this,Q,P);setTimeout(function(){O.syncPosition();O.cfg.refireEvent("iframe");O.cfg.refireEvent("context");},0);},_getComputedHeight:(function(){if(document.defaultView&&document.defaultView.getComputedStyle){return function(P){var O=null;if(P.ownerDocument&&P.ownerDocument.defaultView){var Q=P.ownerDocument.defaultView.getComputedStyle(P,"");if(Q){O=parseInt(Q.height,10);}}return(I.isNumber(O))?O:null;};}else{return function(P){var O=null;
if(P.style.pixelHeight){O=P.style.pixelHeight;}return(I.isNumber(O))?O:null;};}})(),_validateAutoFillHeight:function(O){return(!O)||(I.isString(O)&&B.STD_MOD_RE.test(O));},_autoFillOnHeightChange:function(R,P,Q){var O=this.cfg.getProperty("height");if((O&&O!=="auto")||(O===0)){this.fillHeight(Q);}},_getPreciseHeight:function(P){var O=P.offsetHeight;if(P.getBoundingClientRect){var Q=P.getBoundingClientRect();O=Q.bottom-Q.top;}return O;},fillHeight:function(R){if(R){var P=this.innerElement||this.element,O=[this.header,this.body,this.footer],V,W=0,X=0,T=0,Q=false;for(var U=0,S=O.length;U<S;U++){V=O[U];if(V){if(R!==V){X+=this._getPreciseHeight(V);}else{Q=true;}}}if(Q){if(K.ie||K.opera){F.setStyle(R,"height",0+"px");}W=this._getComputedHeight(P);if(W===null){F.addClass(P,"yui-override-padding");W=P.clientHeight;F.removeClass(P,"yui-override-padding");}T=Math.max(W-X,0);F.setStyle(R,"height",T+"px");if(R.offsetHeight!=T){T=Math.max(T-(R.offsetHeight-T),0);}F.setStyle(R,"height",T+"px");}}},bringToTop:function(){var S=[],R=this.element;function V(Z,Y){var b=F.getStyle(Z,"zIndex"),a=F.getStyle(Y,"zIndex"),X=(!b||isNaN(b))?0:parseInt(b,10),W=(!a||isNaN(a))?0:parseInt(a,10);if(X>W){return -1;}else{if(X<W){return 1;}else{return 0;}}}function Q(Y){var X=F.hasClass(Y,B.CSS_OVERLAY),W=YAHOO.widget.Panel;if(X&&!F.isAncestor(R,Y)){if(W&&F.hasClass(Y,W.CSS_PANEL)){S[S.length]=Y.parentNode;}else{S[S.length]=Y;}}}F.getElementsBy(Q,"DIV",document.body);S.sort(V);var O=S[0],U;if(O){U=F.getStyle(O,"zIndex");if(!isNaN(U)){var T=false;if(O!=R){T=true;}else{if(S.length>1){var P=F.getStyle(S[1],"zIndex");if(!isNaN(P)&&(U==P)){T=true;}}}if(T){this.cfg.setProperty("zindex",(parseInt(U,10)+2));}}}},destroy:function(){if(this.iframe){this.iframe.parentNode.removeChild(this.iframe);}this.iframe=null;B.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);B.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);G.textResizeEvent.unsubscribe(this._autoFillOnHeightChange);B.superclass.destroy.call(this);},forceContainerRedraw:function(){var O=this;F.addClass(O.element,"yui-force-redraw");setTimeout(function(){F.removeClass(O.element,"yui-force-redraw");},0);},toString:function(){return"Overlay "+this.id;}});}());(function(){YAHOO.widget.OverlayManager=function(G){this.init(G);};var D=YAHOO.widget.Overlay,C=YAHOO.util.Event,E=YAHOO.util.Dom,B=YAHOO.util.Config,F=YAHOO.util.CustomEvent,A=YAHOO.widget.OverlayManager;A.CSS_FOCUSED="focused";A.prototype={constructor:A,overlays:null,initDefaultConfig:function(){this.cfg.addProperty("overlays",{suppressEvent:true});this.cfg.addProperty("focusevent",{value:"mousedown"});},init:function(I){this.cfg=new B(this);this.initDefaultConfig();if(I){this.cfg.applyConfig(I,true);}this.cfg.fireQueue();var H=null;this.getActive=function(){return H;};this.focus=function(J){var K=this.find(J);if(K){K.focus();}};this.remove=function(K){var M=this.find(K),J;if(M){if(H==M){H=null;}var L=(M.element===null&&M.cfg===null)?true:false;if(!L){J=E.getStyle(M.element,"zIndex");M.cfg.setProperty("zIndex",-1000,true);}this.overlays.sort(this.compareZIndexDesc);this.overlays=this.overlays.slice(0,(this.overlays.length-1));M.hideEvent.unsubscribe(M.blur);M.destroyEvent.unsubscribe(this._onOverlayDestroy,M);M.focusEvent.unsubscribe(this._onOverlayFocusHandler,M);M.blurEvent.unsubscribe(this._onOverlayBlurHandler,M);if(!L){C.removeListener(M.element,this.cfg.getProperty("focusevent"),this._onOverlayElementFocus);M.cfg.setProperty("zIndex",J,true);M.cfg.setProperty("manager",null);}if(M.focusEvent._managed){M.focusEvent=null;}if(M.blurEvent._managed){M.blurEvent=null;}if(M.focus._managed){M.focus=null;}if(M.blur._managed){M.blur=null;}}};this.blurAll=function(){var K=this.overlays.length,J;if(K>0){J=K-1;do{this.overlays[J].blur();}while(J--);}};this._manageBlur=function(J){var K=false;if(H==J){E.removeClass(H.element,A.CSS_FOCUSED);H=null;K=true;}return K;};this._manageFocus=function(J){var K=false;if(H!=J){if(H){H.blur();}H=J;this.bringToTop(H);E.addClass(H.element,A.CSS_FOCUSED);K=true;}return K;};var G=this.cfg.getProperty("overlays");if(!this.overlays){this.overlays=[];}if(G){this.register(G);this.overlays.sort(this.compareZIndexDesc);}},_onOverlayElementFocus:function(I){var G=C.getTarget(I),H=this.close;if(H&&(G==H||E.isAncestor(H,G))){this.blur();}else{this.focus();}},_onOverlayDestroy:function(H,G,I){this.remove(I);},_onOverlayFocusHandler:function(H,G,I){this._manageFocus(I);},_onOverlayBlurHandler:function(H,G,I){this._manageBlur(I);},_bindFocus:function(G){var H=this;if(!G.focusEvent){G.focusEvent=G.createEvent("focus");G.focusEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.focusEvent.subscribe(H._onOverlayFocusHandler,G,H);}if(!G.focus){C.on(G.element,H.cfg.getProperty("focusevent"),H._onOverlayElementFocus,null,G);G.focus=function(){if(H._manageFocus(this)){if(this.cfg.getProperty("visible")&&this.focusFirst){this.focusFirst();}this.focusEvent.fire();}};G.focus._managed=true;}},_bindBlur:function(G){var H=this;if(!G.blurEvent){G.blurEvent=G.createEvent("blur");G.blurEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.blurEvent.subscribe(H._onOverlayBlurHandler,G,H);}if(!G.blur){G.blur=function(){if(H._manageBlur(this)){this.blurEvent.fire();}};G.blur._managed=true;}G.hideEvent.subscribe(G.blur);},_bindDestroy:function(G){var H=this;G.destroyEvent.subscribe(H._onOverlayDestroy,G,H);},_syncZIndex:function(G){var H=E.getStyle(G.element,"zIndex");if(!isNaN(H)){G.cfg.setProperty("zIndex",parseInt(H,10));}else{G.cfg.setProperty("zIndex",0);}},register:function(G){var J=false,H,I;if(G instanceof D){G.cfg.addProperty("manager",{value:this});this._bindFocus(G);this._bindBlur(G);this._bindDestroy(G);this._syncZIndex(G);this.overlays.push(G);this.bringToTop(G);J=true;}else{if(G instanceof Array){for(H=0,I=G.length;H<I;H++){J=this.register(G[H])||J;}}}return J;},bringToTop:function(M){var I=this.find(M),L,G,J;if(I){J=this.overlays;J.sort(this.compareZIndexDesc);G=J[0];if(G){L=E.getStyle(G.element,"zIndex");
if(!isNaN(L)){var K=false;if(G!==I){K=true;}else{if(J.length>1){var H=E.getStyle(J[1].element,"zIndex");if(!isNaN(H)&&(L==H)){K=true;}}}if(K){I.cfg.setProperty("zindex",(parseInt(L,10)+2));}}J.sort(this.compareZIndexDesc);}}},find:function(G){var K=G instanceof D,I=this.overlays,M=I.length,J=null,L,H;if(K||typeof G=="string"){for(H=M-1;H>=0;H--){L=I[H];if((K&&(L===G))||(L.id==G)){J=L;break;}}}return J;},compareZIndexDesc:function(J,I){var H=(J.cfg)?J.cfg.getProperty("zIndex"):null,G=(I.cfg)?I.cfg.getProperty("zIndex"):null;if(H===null&&G===null){return 0;}else{if(H===null){return 1;}else{if(G===null){return -1;}else{if(H>G){return -1;}else{if(H<G){return 1;}else{return 0;}}}}}},showAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].show();}},hideAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].hide();}},toString:function(){return"OverlayManager";}};}());(function(){YAHOO.widget.Tooltip=function(P,O){YAHOO.widget.Tooltip.superclass.constructor.call(this,P,O);};var E=YAHOO.lang,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,C=YAHOO.util.Dom,J=YAHOO.widget.Tooltip,H=YAHOO.env.ua,G=(H.ie&&(H.ie<=6||document.compatMode=="BackCompat")),F,I={"PREVENT_OVERLAP":{key:"preventoverlap",value:true,validator:E.isBoolean,supercedes:["x","y","xy"]},"SHOW_DELAY":{key:"showdelay",value:200,validator:E.isNumber},"AUTO_DISMISS_DELAY":{key:"autodismissdelay",value:5000,validator:E.isNumber},"HIDE_DELAY":{key:"hidedelay",value:250,validator:E.isNumber},"TEXT":{key:"text",suppressEvent:true},"CONTAINER":{key:"container"},"DISABLED":{key:"disabled",value:false,suppressEvent:true}},A={"CONTEXT_MOUSE_OVER":"contextMouseOver","CONTEXT_MOUSE_OUT":"contextMouseOut","CONTEXT_TRIGGER":"contextTrigger"};J.CSS_TOOLTIP="yui-tt";function K(Q,O){var P=this.cfg,R=P.getProperty("width");if(R==O){P.setProperty("width",Q);}}function D(P,O){if("_originalWidth" in this){K.call(this,this._originalWidth,this._forcedWidth);}var Q=document.body,U=this.cfg,T=U.getProperty("width"),R,S;if((!T||T=="auto")&&(U.getProperty("container")!=Q||U.getProperty("x")>=C.getViewportWidth()||U.getProperty("y")>=C.getViewportHeight())){S=this.element.cloneNode(true);S.style.visibility="hidden";S.style.top="0px";S.style.left="0px";Q.appendChild(S);R=(S.offsetWidth+"px");Q.removeChild(S);S=null;U.setProperty("width",R);U.refireEvent("xy");this._originalWidth=T||"";this._forcedWidth=R;}}function B(P,O,Q){this.render(Q);}function L(){N.onDOMReady(B,this.cfg.getProperty("container"),this);}YAHOO.extend(J,YAHOO.widget.Overlay,{init:function(P,O){J.superclass.init.call(this,P);this.beforeInitEvent.fire(J);C.addClass(this.element,J.CSS_TOOLTIP);if(O){this.cfg.applyConfig(O,true);}this.cfg.queueProperty("visible",false);this.cfg.queueProperty("constraintoviewport",true);this.setBody("");this.subscribe("changeContent",D);this.subscribe("init",L);this.subscribe("render",this.onRender);this.initEvent.fire(J);},initEvents:function(){J.superclass.initEvents.call(this);var O=M.LIST;this.contextMouseOverEvent=this.createEvent(A.CONTEXT_MOUSE_OVER);this.contextMouseOverEvent.signature=O;this.contextMouseOutEvent=this.createEvent(A.CONTEXT_MOUSE_OUT);this.contextMouseOutEvent.signature=O;this.contextTriggerEvent=this.createEvent(A.CONTEXT_TRIGGER);this.contextTriggerEvent.signature=O;},initDefaultConfig:function(){J.superclass.initDefaultConfig.call(this);this.cfg.addProperty(I.PREVENT_OVERLAP.key,{value:I.PREVENT_OVERLAP.value,validator:I.PREVENT_OVERLAP.validator,supercedes:I.PREVENT_OVERLAP.supercedes});this.cfg.addProperty(I.SHOW_DELAY.key,{handler:this.configShowDelay,value:200,validator:I.SHOW_DELAY.validator});this.cfg.addProperty(I.AUTO_DISMISS_DELAY.key,{handler:this.configAutoDismissDelay,value:I.AUTO_DISMISS_DELAY.value,validator:I.AUTO_DISMISS_DELAY.validator});this.cfg.addProperty(I.HIDE_DELAY.key,{handler:this.configHideDelay,value:I.HIDE_DELAY.value,validator:I.HIDE_DELAY.validator});this.cfg.addProperty(I.TEXT.key,{handler:this.configText,suppressEvent:I.TEXT.suppressEvent});this.cfg.addProperty(I.CONTAINER.key,{handler:this.configContainer,value:document.body});this.cfg.addProperty(I.DISABLED.key,{handler:this.configContainer,value:I.DISABLED.value,supressEvent:I.DISABLED.suppressEvent});},configText:function(P,O,Q){var R=O[0];if(R){this.setBody(R);}},configContainer:function(Q,P,R){var O=P[0];if(typeof O=="string"){this.cfg.setProperty("container",document.getElementById(O),true);}},_removeEventListeners:function(){var R=this._context,O,Q,P;if(R){O=R.length;if(O>0){P=O-1;do{Q=R[P];N.removeListener(Q,"mouseover",this.onContextMouseOver);N.removeListener(Q,"mousemove",this.onContextMouseMove);N.removeListener(Q,"mouseout",this.onContextMouseOut);}while(P--);}}},configContext:function(T,P,U){var S=P[0],V,O,R,Q;if(S){if(!(S instanceof Array)){if(typeof S=="string"){this.cfg.setProperty("context",[document.getElementById(S)],true);}else{this.cfg.setProperty("context",[S],true);}S=this.cfg.getProperty("context");}this._removeEventListeners();this._context=S;V=this._context;if(V){O=V.length;if(O>0){Q=O-1;do{R=V[Q];N.on(R,"mouseover",this.onContextMouseOver,this);N.on(R,"mousemove",this.onContextMouseMove,this);N.on(R,"mouseout",this.onContextMouseOut,this);}while(Q--);}}}},onContextMouseMove:function(P,O){O.pageX=N.getPageX(P);O.pageY=N.getPageY(P);},onContextMouseOver:function(Q,P){var O=this;if(O.title){P._tempTitle=O.title;O.title="";}if(P.fireEvent("contextMouseOver",O,Q)!==false&&!P.cfg.getProperty("disabled")){if(P.hideProcId){clearTimeout(P.hideProcId);P.hideProcId=null;}N.on(O,"mousemove",P.onContextMouseMove,P);P.showProcId=P.doShow(Q,O);}},onContextMouseOut:function(Q,P){var O=this;if(P._tempTitle){O.title=P._tempTitle;P._tempTitle=null;}if(P.showProcId){clearTimeout(P.showProcId);P.showProcId=null;}if(P.hideProcId){clearTimeout(P.hideProcId);P.hideProcId=null;}P.fireEvent("contextMouseOut",O,Q);P.hideProcId=setTimeout(function(){P.hide();},P.cfg.getProperty("hidedelay"));},doShow:function(Q,O){var R=25,P=this;
if(H.opera&&O.tagName&&O.tagName.toUpperCase()=="A"){R+=12;}return setTimeout(function(){var S=P.cfg.getProperty("text");if(P._tempTitle&&(S===""||YAHOO.lang.isUndefined(S)||YAHOO.lang.isNull(S))){P.setBody(P._tempTitle);}else{P.cfg.refireEvent("text");}P.moveTo(P.pageX,P.pageY+R);if(P.cfg.getProperty("preventoverlap")){P.preventOverlap(P.pageX,P.pageY);}N.removeListener(O,"mousemove",P.onContextMouseMove);P.contextTriggerEvent.fire(O);P.show();P.hideProcId=P.doHide();},this.cfg.getProperty("showdelay"));},doHide:function(){var O=this;return setTimeout(function(){O.hide();},this.cfg.getProperty("autodismissdelay"));},preventOverlap:function(S,R){var O=this.element.offsetHeight,Q=new YAHOO.util.Point(S,R),P=C.getRegion(this.element);P.top-=5;P.left-=5;P.right+=5;P.bottom+=5;if(P.contains(Q)){this.cfg.setProperty("y",(R-O-5));}},onRender:function(S,R){function T(){var W=this.element,V=this.underlay;if(V){V.style.width=(W.offsetWidth+6)+"px";V.style.height=(W.offsetHeight+1)+"px";}}function P(){C.addClass(this.underlay,"yui-tt-shadow-visible");if(H.ie){this.forceUnderlayRedraw();}}function O(){C.removeClass(this.underlay,"yui-tt-shadow-visible");}function U(){var X=this.underlay,W,V,Z,Y;if(!X){W=this.element;V=YAHOO.widget.Module;Z=H.ie;Y=this;if(!F){F=document.createElement("div");F.className="yui-tt-shadow";}X=F.cloneNode(false);W.appendChild(X);this.underlay=X;this._shadow=this.underlay;P.call(this);this.subscribe("beforeShow",P);this.subscribe("hide",O);if(G){window.setTimeout(function(){T.call(Y);},0);this.cfg.subscribeToConfigEvent("width",T);this.cfg.subscribeToConfigEvent("height",T);this.subscribe("changeContent",T);V.textResizeEvent.subscribe(T,this,true);this.subscribe("destroy",function(){V.textResizeEvent.unsubscribe(T,this);});}}}function Q(){U.call(this);this.unsubscribe("beforeShow",Q);}if(this.cfg.getProperty("visible")){U.call(this);}else{this.subscribe("beforeShow",Q);}},forceUnderlayRedraw:function(){var O=this;C.addClass(O.underlay,"yui-force-redraw");setTimeout(function(){C.removeClass(O.underlay,"yui-force-redraw");},0);},destroy:function(){this._removeEventListeners();J.superclass.destroy.call(this);},toString:function(){return"Tooltip "+this.id;}});}());(function(){YAHOO.widget.Panel=function(V,U){YAHOO.widget.Panel.superclass.constructor.call(this,V,U);};var S=null;var E=YAHOO.lang,F=YAHOO.util,A=F.Dom,T=F.Event,M=F.CustomEvent,K=YAHOO.util.KeyListener,I=F.Config,H=YAHOO.widget.Overlay,O=YAHOO.widget.Panel,L=YAHOO.env.ua,P=(L.ie&&(L.ie<=6||document.compatMode=="BackCompat")),G,Q,C,D={"SHOW_MASK":"showMask","HIDE_MASK":"hideMask","DRAG":"drag"},N={"CLOSE":{key:"close",value:true,validator:E.isBoolean,supercedes:["visible"]},"DRAGGABLE":{key:"draggable",value:(F.DD?true:false),validator:E.isBoolean,supercedes:["visible"]},"DRAG_ONLY":{key:"dragonly",value:false,validator:E.isBoolean,supercedes:["draggable"]},"UNDERLAY":{key:"underlay",value:"shadow",supercedes:["visible"]},"MODAL":{key:"modal",value:false,validator:E.isBoolean,supercedes:["visible","zindex"]},"KEY_LISTENERS":{key:"keylisteners",suppressEvent:true,supercedes:["visible"]},"STRINGS":{key:"strings",supercedes:["close"],validator:E.isObject,value:{close:"Close"}}};O.CSS_PANEL="yui-panel";O.CSS_PANEL_CONTAINER="yui-panel-container";O.FOCUSABLE=["a","button","select","textarea","input","iframe"];function J(V,U){if(!this.header&&this.cfg.getProperty("draggable")){this.setHeader("&#160;");}}function R(V,U,W){var Z=W[0],X=W[1],Y=this.cfg,a=Y.getProperty("width");if(a==X){Y.setProperty("width",Z);}this.unsubscribe("hide",R,W);}function B(V,U){var Y,X,W;if(P){Y=this.cfg;X=Y.getProperty("width");if(!X||X=="auto"){W=(this.element.offsetWidth+"px");Y.setProperty("width",W);this.subscribe("hide",R,[(X||""),W]);}}}YAHOO.extend(O,H,{init:function(V,U){O.superclass.init.call(this,V);this.beforeInitEvent.fire(O);A.addClass(this.element,O.CSS_PANEL);this.buildWrapper();if(U){this.cfg.applyConfig(U,true);}this.subscribe("showMask",this._addFocusHandlers);this.subscribe("hideMask",this._removeFocusHandlers);this.subscribe("beforeRender",J);this.subscribe("render",function(){this.setFirstLastFocusable();this.subscribe("changeContent",this.setFirstLastFocusable);});this.subscribe("show",this.focusFirst);this.initEvent.fire(O);},_onElementFocus:function(Z){if(S===this){var Y=T.getTarget(Z),X=document.documentElement,V=(Y!==X&&Y!==window);if(V&&Y!==this.element&&Y!==this.mask&&!A.isAncestor(this.element,Y)){try{if(this.firstElement){this.firstElement.focus();}else{if(this._modalFocus){this._modalFocus.focus();}else{this.innerElement.focus();}}}catch(W){try{if(V&&Y!==document.body){Y.blur();}}catch(U){}}}}},_addFocusHandlers:function(V,U){if(!this.firstElement){if(L.webkit||L.opera){if(!this._modalFocus){this._createHiddenFocusElement();}}else{this.innerElement.tabIndex=0;}}this.setTabLoop(this.firstElement,this.lastElement);T.onFocus(document.documentElement,this._onElementFocus,this,true);S=this;},_createHiddenFocusElement:function(){var U=document.createElement("button");U.style.height="1px";U.style.width="1px";U.style.position="absolute";U.style.left="-10000em";U.style.opacity=0;U.tabIndex=-1;this.innerElement.appendChild(U);this._modalFocus=U;},_removeFocusHandlers:function(V,U){T.removeFocusListener(document.documentElement,this._onElementFocus,this);if(S==this){S=null;}},focusFirst:function(W,U,Y){var V=this.firstElement;if(U&&U[1]){T.stopEvent(U[1]);}if(V){try{V.focus();}catch(X){}}},focusLast:function(W,U,Y){var V=this.lastElement;if(U&&U[1]){T.stopEvent(U[1]);}if(V){try{V.focus();}catch(X){}}},setTabLoop:function(X,Z){var V=this.preventBackTab,W=this.preventTabOut,U=this.showEvent,Y=this.hideEvent;if(V){V.disable();U.unsubscribe(V.enable,V);Y.unsubscribe(V.disable,V);V=this.preventBackTab=null;}if(W){W.disable();U.unsubscribe(W.enable,W);Y.unsubscribe(W.disable,W);W=this.preventTabOut=null;}if(X){this.preventBackTab=new K(X,{shift:true,keys:9},{fn:this.focusLast,scope:this,correctScope:true});V=this.preventBackTab;U.subscribe(V.enable,V,true);
Y.subscribe(V.disable,V,true);}if(Z){this.preventTabOut=new K(Z,{shift:false,keys:9},{fn:this.focusFirst,scope:this,correctScope:true});W=this.preventTabOut;U.subscribe(W.enable,W,true);Y.subscribe(W.disable,W,true);}},getFocusableElements:function(U){U=U||this.innerElement;var X={};for(var W=0;W<O.FOCUSABLE.length;W++){X[O.FOCUSABLE[W]]=true;}function V(Y){if(Y.focus&&Y.type!=="hidden"&&!Y.disabled&&X[Y.tagName.toLowerCase()]){return true;}return false;}return A.getElementsBy(V,null,U);},setFirstLastFocusable:function(){this.firstElement=null;this.lastElement=null;var U=this.getFocusableElements();this.focusableElements=U;if(U.length>0){this.firstElement=U[0];this.lastElement=U[U.length-1];}if(this.cfg.getProperty("modal")){this.setTabLoop(this.firstElement,this.lastElement);}},initEvents:function(){O.superclass.initEvents.call(this);var U=M.LIST;this.showMaskEvent=this.createEvent(D.SHOW_MASK);this.showMaskEvent.signature=U;this.hideMaskEvent=this.createEvent(D.HIDE_MASK);this.hideMaskEvent.signature=U;this.dragEvent=this.createEvent(D.DRAG);this.dragEvent.signature=U;},initDefaultConfig:function(){O.superclass.initDefaultConfig.call(this);this.cfg.addProperty(N.CLOSE.key,{handler:this.configClose,value:N.CLOSE.value,validator:N.CLOSE.validator,supercedes:N.CLOSE.supercedes});this.cfg.addProperty(N.DRAGGABLE.key,{handler:this.configDraggable,value:(F.DD)?true:false,validator:N.DRAGGABLE.validator,supercedes:N.DRAGGABLE.supercedes});this.cfg.addProperty(N.DRAG_ONLY.key,{value:N.DRAG_ONLY.value,validator:N.DRAG_ONLY.validator,supercedes:N.DRAG_ONLY.supercedes});this.cfg.addProperty(N.UNDERLAY.key,{handler:this.configUnderlay,value:N.UNDERLAY.value,supercedes:N.UNDERLAY.supercedes});this.cfg.addProperty(N.MODAL.key,{handler:this.configModal,value:N.MODAL.value,validator:N.MODAL.validator,supercedes:N.MODAL.supercedes});this.cfg.addProperty(N.KEY_LISTENERS.key,{handler:this.configKeyListeners,suppressEvent:N.KEY_LISTENERS.suppressEvent,supercedes:N.KEY_LISTENERS.supercedes});this.cfg.addProperty(N.STRINGS.key,{value:N.STRINGS.value,handler:this.configStrings,validator:N.STRINGS.validator,supercedes:N.STRINGS.supercedes});},configClose:function(X,V,Y){var Z=V[0],W=this.close,U=this.cfg.getProperty("strings");if(Z){if(!W){if(!C){C=document.createElement("a");C.className="container-close";C.href="#";}W=C.cloneNode(true);this.innerElement.appendChild(W);W.innerHTML=(U&&U.close)?U.close:"&#160;";T.on(W,"click",this._doClose,this,true);this.close=W;}else{W.style.display="block";}}else{if(W){W.style.display="none";}}},_doClose:function(U){T.preventDefault(U);this.hide();},configDraggable:function(V,U,W){var X=U[0];if(X){if(!F.DD){this.cfg.setProperty("draggable",false);return;}if(this.header){A.setStyle(this.header,"cursor","move");this.registerDragDrop();}this.subscribe("beforeShow",B);}else{if(this.dd){this.dd.unreg();}if(this.header){A.setStyle(this.header,"cursor","auto");}this.unsubscribe("beforeShow",B);}},configUnderlay:function(d,c,Z){var b=(this.platform=="mac"&&L.gecko),e=c[0].toLowerCase(),V=this.underlay,W=this.element;function X(){var f=false;if(!V){if(!Q){Q=document.createElement("div");Q.className="underlay";}V=Q.cloneNode(false);this.element.appendChild(V);this.underlay=V;if(P){this.sizeUnderlay();this.cfg.subscribeToConfigEvent("width",this.sizeUnderlay);this.cfg.subscribeToConfigEvent("height",this.sizeUnderlay);this.changeContentEvent.subscribe(this.sizeUnderlay);YAHOO.widget.Module.textResizeEvent.subscribe(this.sizeUnderlay,this,true);}if(L.webkit&&L.webkit<420){this.changeContentEvent.subscribe(this.forceUnderlayRedraw);}f=true;}}function a(){var f=X.call(this);if(!f&&P){this.sizeUnderlay();}this._underlayDeferred=false;this.beforeShowEvent.unsubscribe(a);}function Y(){if(this._underlayDeferred){this.beforeShowEvent.unsubscribe(a);this._underlayDeferred=false;}if(V){this.cfg.unsubscribeFromConfigEvent("width",this.sizeUnderlay);this.cfg.unsubscribeFromConfigEvent("height",this.sizeUnderlay);this.changeContentEvent.unsubscribe(this.sizeUnderlay);this.changeContentEvent.unsubscribe(this.forceUnderlayRedraw);YAHOO.widget.Module.textResizeEvent.unsubscribe(this.sizeUnderlay,this,true);this.element.removeChild(V);this.underlay=null;}}switch(e){case"shadow":A.removeClass(W,"matte");A.addClass(W,"shadow");break;case"matte":if(!b){Y.call(this);}A.removeClass(W,"shadow");A.addClass(W,"matte");break;default:if(!b){Y.call(this);}A.removeClass(W,"shadow");A.removeClass(W,"matte");break;}if((e=="shadow")||(b&&!V)){if(this.cfg.getProperty("visible")){var U=X.call(this);if(!U&&P){this.sizeUnderlay();}}else{if(!this._underlayDeferred){this.beforeShowEvent.subscribe(a);this._underlayDeferred=true;}}}},configModal:function(V,U,X){var W=U[0];if(W){if(!this._hasModalityEventListeners){this.subscribe("beforeShow",this.buildMask);this.subscribe("beforeShow",this.bringToTop);this.subscribe("beforeShow",this.showMask);this.subscribe("hide",this.hideMask);H.windowResizeEvent.subscribe(this.sizeMask,this,true);this._hasModalityEventListeners=true;}}else{if(this._hasModalityEventListeners){if(this.cfg.getProperty("visible")){this.hideMask();this.removeMask();}this.unsubscribe("beforeShow",this.buildMask);this.unsubscribe("beforeShow",this.bringToTop);this.unsubscribe("beforeShow",this.showMask);this.unsubscribe("hide",this.hideMask);H.windowResizeEvent.unsubscribe(this.sizeMask,this);this._hasModalityEventListeners=false;}}},removeMask:function(){var V=this.mask,U;if(V){this.hideMask();U=V.parentNode;if(U){U.removeChild(V);}this.mask=null;}},configKeyListeners:function(X,U,a){var W=U[0],Z,Y,V;if(W){if(W instanceof Array){Y=W.length;for(V=0;V<Y;V++){Z=W[V];if(!I.alreadySubscribed(this.showEvent,Z.enable,Z)){this.showEvent.subscribe(Z.enable,Z,true);}if(!I.alreadySubscribed(this.hideEvent,Z.disable,Z)){this.hideEvent.subscribe(Z.disable,Z,true);this.destroyEvent.subscribe(Z.disable,Z,true);}}}else{if(!I.alreadySubscribed(this.showEvent,W.enable,W)){this.showEvent.subscribe(W.enable,W,true);}if(!I.alreadySubscribed(this.hideEvent,W.disable,W)){this.hideEvent.subscribe(W.disable,W,true);
this.destroyEvent.subscribe(W.disable,W,true);}}}},configStrings:function(V,U,W){var X=E.merge(N.STRINGS.value,U[0]);this.cfg.setProperty(N.STRINGS.key,X,true);},configHeight:function(X,V,Y){var U=V[0],W=this.innerElement;A.setStyle(W,"height",U);this.cfg.refireEvent("iframe");},_autoFillOnHeightChange:function(X,V,W){O.superclass._autoFillOnHeightChange.apply(this,arguments);if(P){var U=this;setTimeout(function(){U.sizeUnderlay();},0);}},configWidth:function(X,U,Y){var W=U[0],V=this.innerElement;A.setStyle(V,"width",W);this.cfg.refireEvent("iframe");},configzIndex:function(V,U,X){O.superclass.configzIndex.call(this,V,U,X);if(this.mask||this.cfg.getProperty("modal")===true){var W=A.getStyle(this.element,"zIndex");if(!W||isNaN(W)){W=0;}if(W===0){this.cfg.setProperty("zIndex",1);}else{this.stackMask();}}},buildWrapper:function(){var W=this.element.parentNode,U=this.element,V=document.createElement("div");V.className=O.CSS_PANEL_CONTAINER;V.id=U.id+"_c";if(W){W.insertBefore(V,U);}V.appendChild(U);this.element=V;this.innerElement=U;A.setStyle(this.innerElement,"visibility","inherit");},sizeUnderlay:function(){var V=this.underlay,U;if(V){U=this.element;V.style.width=U.offsetWidth+"px";V.style.height=U.offsetHeight+"px";}},registerDragDrop:function(){var V=this;if(this.header){if(!F.DD){return;}var U=(this.cfg.getProperty("dragonly")===true);this.dd=new F.DD(this.element.id,this.id,{dragOnly:U});if(!this.header.id){this.header.id=this.id+"_h";}this.dd.startDrag=function(){var X,Z,W,c,b,a;if(YAHOO.env.ua.ie==6){A.addClass(V.element,"drag");}if(V.cfg.getProperty("constraintoviewport")){var Y=H.VIEWPORT_OFFSET;X=V.element.offsetHeight;Z=V.element.offsetWidth;W=A.getViewportWidth();c=A.getViewportHeight();b=A.getDocumentScrollLeft();a=A.getDocumentScrollTop();if(X+Y<c){this.minY=a+Y;this.maxY=a+c-X-Y;}else{this.minY=a+Y;this.maxY=a+Y;}if(Z+Y<W){this.minX=b+Y;this.maxX=b+W-Z-Y;}else{this.minX=b+Y;this.maxX=b+Y;}this.constrainX=true;this.constrainY=true;}else{this.constrainX=false;this.constrainY=false;}V.dragEvent.fire("startDrag",arguments);};this.dd.onDrag=function(){V.syncPosition();V.cfg.refireEvent("iframe");if(this.platform=="mac"&&YAHOO.env.ua.gecko){this.showMacGeckoScrollbars();}V.dragEvent.fire("onDrag",arguments);};this.dd.endDrag=function(){if(YAHOO.env.ua.ie==6){A.removeClass(V.element,"drag");}V.dragEvent.fire("endDrag",arguments);V.moveEvent.fire(V.cfg.getProperty("xy"));};this.dd.setHandleElId(this.header.id);this.dd.addInvalidHandleType("INPUT");this.dd.addInvalidHandleType("SELECT");this.dd.addInvalidHandleType("TEXTAREA");}},buildMask:function(){var U=this.mask;if(!U){if(!G){G=document.createElement("div");G.className="mask";G.innerHTML="&#160;";}U=G.cloneNode(true);U.id=this.id+"_mask";document.body.insertBefore(U,document.body.firstChild);this.mask=U;if(YAHOO.env.ua.gecko&&this.platform=="mac"){A.addClass(this.mask,"block-scrollbars");}this.stackMask();}},hideMask:function(){if(this.cfg.getProperty("modal")&&this.mask){this.mask.style.display="none";A.removeClass(document.body,"masked");this.hideMaskEvent.fire();}},showMask:function(){if(this.cfg.getProperty("modal")&&this.mask){A.addClass(document.body,"masked");this.sizeMask();this.mask.style.display="block";this.showMaskEvent.fire();}},sizeMask:function(){if(this.mask){var V=this.mask,W=A.getViewportWidth(),U=A.getViewportHeight();if(V.offsetHeight>U){V.style.height=U+"px";}if(V.offsetWidth>W){V.style.width=W+"px";}V.style.height=A.getDocumentHeight()+"px";V.style.width=A.getDocumentWidth()+"px";}},stackMask:function(){if(this.mask){var U=A.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(U)&&!isNaN(U)){A.setStyle(this.mask,"zIndex",U-1);}}},render:function(U){return O.superclass.render.call(this,U,this.innerElement);},destroy:function(){H.windowResizeEvent.unsubscribe(this.sizeMask,this);this.removeMask();if(this.close){T.purgeElement(this.close);}O.superclass.destroy.call(this);},forceUnderlayRedraw:function(){var U=this.underlay;A.addClass(U,"yui-force-redraw");setTimeout(function(){A.removeClass(U,"yui-force-redraw");},0);},toString:function(){return"Panel "+this.id;}});}());(function(){YAHOO.widget.Dialog=function(J,I){YAHOO.widget.Dialog.superclass.constructor.call(this,J,I);};var B=YAHOO.util.Event,G=YAHOO.util.CustomEvent,E=YAHOO.util.Dom,A=YAHOO.widget.Dialog,F=YAHOO.lang,H={"BEFORE_SUBMIT":"beforeSubmit","SUBMIT":"submit","MANUAL_SUBMIT":"manualSubmit","ASYNC_SUBMIT":"asyncSubmit","FORM_SUBMIT":"formSubmit","CANCEL":"cancel"},C={"POST_METHOD":{key:"postmethod",value:"async"},"POST_DATA":{key:"postdata",value:null},"BUTTONS":{key:"buttons",value:"none",supercedes:["visible"]},"HIDEAFTERSUBMIT":{key:"hideaftersubmit",value:true}};A.CSS_DIALOG="yui-dialog";function D(){var L=this._aButtons,J,K,I;if(F.isArray(L)){J=L.length;if(J>0){I=J-1;do{K=L[I];if(YAHOO.widget.Button&&K instanceof YAHOO.widget.Button){K.destroy();}else{if(K.tagName.toUpperCase()=="BUTTON"){B.purgeElement(K);B.purgeElement(K,false);}}}while(I--);}}}YAHOO.extend(A,YAHOO.widget.Panel,{form:null,initDefaultConfig:function(){A.superclass.initDefaultConfig.call(this);this.callback={success:null,failure:null,argument:null};this.cfg.addProperty(C.POST_METHOD.key,{handler:this.configPostMethod,value:C.POST_METHOD.value,validator:function(I){if(I!="form"&&I!="async"&&I!="none"&&I!="manual"){return false;}else{return true;}}});this.cfg.addProperty(C.POST_DATA.key,{value:C.POST_DATA.value});this.cfg.addProperty(C.HIDEAFTERSUBMIT.key,{value:C.HIDEAFTERSUBMIT.value});this.cfg.addProperty(C.BUTTONS.key,{handler:this.configButtons,value:C.BUTTONS.value,supercedes:C.BUTTONS.supercedes});},initEvents:function(){A.superclass.initEvents.call(this);var I=G.LIST;this.beforeSubmitEvent=this.createEvent(H.BEFORE_SUBMIT);this.beforeSubmitEvent.signature=I;this.submitEvent=this.createEvent(H.SUBMIT);this.submitEvent.signature=I;this.manualSubmitEvent=this.createEvent(H.MANUAL_SUBMIT);this.manualSubmitEvent.signature=I;this.asyncSubmitEvent=this.createEvent(H.ASYNC_SUBMIT);
this.asyncSubmitEvent.signature=I;this.formSubmitEvent=this.createEvent(H.FORM_SUBMIT);this.formSubmitEvent.signature=I;this.cancelEvent=this.createEvent(H.CANCEL);this.cancelEvent.signature=I;},init:function(J,I){A.superclass.init.call(this,J);this.beforeInitEvent.fire(A);E.addClass(this.element,A.CSS_DIALOG);this.cfg.setProperty("visible",false);if(I){this.cfg.applyConfig(I,true);}this.showEvent.subscribe(this.focusFirst,this,true);this.beforeHideEvent.subscribe(this.blurButtons,this,true);this.subscribe("changeBody",this.registerForm);this.initEvent.fire(A);},doSubmit:function(){var P=YAHOO.util.Connect,Q=this.form,K=false,N=false,R,M,L,I;switch(this.cfg.getProperty("postmethod")){case"async":R=Q.elements;M=R.length;if(M>0){L=M-1;do{if(R[L].type=="file"){K=true;break;}}while(L--);}if(K&&YAHOO.env.ua.ie&&this.isSecure){N=true;}I=this._getFormAttributes(Q);P.setForm(Q,K,N);var J=this.cfg.getProperty("postdata");var O=P.asyncRequest(I.method,I.action,this.callback,J);this.asyncSubmitEvent.fire(O);break;case"form":Q.submit();this.formSubmitEvent.fire();break;case"none":case"manual":this.manualSubmitEvent.fire();break;}},_getFormAttributes:function(K){var I={method:null,action:null};if(K){if(K.getAttributeNode){var J=K.getAttributeNode("action");var L=K.getAttributeNode("method");if(J){I.action=J.value;}if(L){I.method=L.value;}}else{I.action=K.getAttribute("action");I.method=K.getAttribute("method");}}I.method=(F.isString(I.method)?I.method:"POST").toUpperCase();I.action=F.isString(I.action)?I.action:"";return I;},registerForm:function(){var I=this.element.getElementsByTagName("form")[0];if(this.form){if(this.form==I&&E.isAncestor(this.element,this.form)){return;}else{B.purgeElement(this.form);this.form=null;}}if(!I){I=document.createElement("form");I.name="frm_"+this.id;this.body.appendChild(I);}if(I){this.form=I;B.on(I,"submit",this._submitHandler,this,true);}},_submitHandler:function(I){B.stopEvent(I);this.submit();this.form.blur();},setTabLoop:function(I,J){I=I||this.firstButton;J=this.lastButton||J;A.superclass.setTabLoop.call(this,I,J);},setFirstLastFocusable:function(){A.superclass.setFirstLastFocusable.call(this);var J,I,K,L=this.focusableElements;this.firstFormElement=null;this.lastFormElement=null;if(this.form&&L&&L.length>0){I=L.length;for(J=0;J<I;++J){K=L[J];if(this.form===K.form){this.firstFormElement=K;break;}}for(J=I-1;J>=0;--J){K=L[J];if(this.form===K.form){this.lastFormElement=K;break;}}}},configClose:function(J,I,K){A.superclass.configClose.apply(this,arguments);},_doClose:function(I){B.preventDefault(I);this.cancel();},configButtons:function(S,R,M){var N=YAHOO.widget.Button,U=R[0],K=this.innerElement,T,P,J,Q,O,I,L;D.call(this);this._aButtons=null;if(F.isArray(U)){O=document.createElement("span");O.className="button-group";Q=U.length;this._aButtons=[];this.defaultHtmlButton=null;for(L=0;L<Q;L++){T=U[L];if(N){J=new N({label:T.text});J.appendTo(O);P=J.get("element");if(T.isDefault){J.addClass("default");this.defaultHtmlButton=P;}if(F.isFunction(T.handler)){J.set("onclick",{fn:T.handler,obj:this,scope:this});}else{if(F.isObject(T.handler)&&F.isFunction(T.handler.fn)){J.set("onclick",{fn:T.handler.fn,obj:((!F.isUndefined(T.handler.obj))?T.handler.obj:this),scope:(T.handler.scope||this)});}}this._aButtons[this._aButtons.length]=J;}else{P=document.createElement("button");P.setAttribute("type","button");if(T.isDefault){P.className="default";this.defaultHtmlButton=P;}P.innerHTML=T.text;if(F.isFunction(T.handler)){B.on(P,"click",T.handler,this,true);}else{if(F.isObject(T.handler)&&F.isFunction(T.handler.fn)){B.on(P,"click",T.handler.fn,((!F.isUndefined(T.handler.obj))?T.handler.obj:this),(T.handler.scope||this));}}O.appendChild(P);this._aButtons[this._aButtons.length]=P;}T.htmlButton=P;if(L===0){this.firstButton=P;}if(L==(Q-1)){this.lastButton=P;}}this.setFooter(O);I=this.footer;if(E.inDocument(this.element)&&!E.isAncestor(K,I)){K.appendChild(I);}this.buttonSpan=O;}else{O=this.buttonSpan;I=this.footer;if(O&&I){I.removeChild(O);this.buttonSpan=null;this.firstButton=null;this.lastButton=null;this.defaultHtmlButton=null;}}this.changeContentEvent.fire();},getButtons:function(){return this._aButtons||null;},focusFirst:function(K,I,M){var J=this.firstFormElement;if(I&&I[1]){B.stopEvent(I[1]);}if(J){try{J.focus();}catch(L){}}else{if(this.defaultHtmlButton){this.focusDefaultButton();}else{this.focusFirstButton();}}},focusLast:function(K,I,M){var N=this.cfg.getProperty("buttons"),J=this.lastFormElement;if(I&&I[1]){B.stopEvent(I[1]);}if(N&&F.isArray(N)){this.focusLastButton();}else{if(J){try{J.focus();}catch(L){}}}},_getButton:function(J){var I=YAHOO.widget.Button;if(I&&J&&J.nodeName&&J.id){J=I.getButton(J.id)||J;}return J;},focusDefaultButton:function(){var I=this._getButton(this.defaultHtmlButton);if(I){try{I.focus();}catch(J){}}},blurButtons:function(){var N=this.cfg.getProperty("buttons"),K,M,J,I;if(N&&F.isArray(N)){K=N.length;if(K>0){I=(K-1);do{M=N[I];if(M){J=this._getButton(M.htmlButton);if(J){try{J.blur();}catch(L){}}}}while(I--);}}},focusFirstButton:function(){var L=this.cfg.getProperty("buttons"),K,I;if(L&&F.isArray(L)){K=L[0];if(K){I=this._getButton(K.htmlButton);if(I){try{I.focus();}catch(J){}}}}},focusLastButton:function(){var M=this.cfg.getProperty("buttons"),J,L,I;if(M&&F.isArray(M)){J=M.length;if(J>0){L=M[(J-1)];if(L){I=this._getButton(L.htmlButton);if(I){try{I.focus();}catch(K){}}}}}},configPostMethod:function(J,I,K){this.registerForm();},validate:function(){return true;},submit:function(){if(this.validate()){this.beforeSubmitEvent.fire();this.doSubmit();this.submitEvent.fire();if(this.cfg.getProperty("hideaftersubmit")){this.hide();}return true;}else{return false;}},cancel:function(){this.cancelEvent.fire();this.hide();},getData:function(){var Y=this.form,K,R,U,M,S,P,O,J,V,L,W,Z,I,N,a,X,T;function Q(c){var b=c.tagName.toUpperCase();return((b=="INPUT"||b=="TEXTAREA"||b=="SELECT")&&c.name==M);}if(Y){K=Y.elements;R=K.length;U={};for(X=0;X<R;X++){M=K[X].name;S=E.getElementsBy(Q,"*",Y);
P=S.length;if(P>0){if(P==1){S=S[0];O=S.type;J=S.tagName.toUpperCase();switch(J){case"INPUT":if(O=="checkbox"){U[M]=S.checked;}else{if(O!="radio"){U[M]=S.value;}}break;case"TEXTAREA":U[M]=S.value;break;case"SELECT":V=S.options;L=V.length;W=[];for(T=0;T<L;T++){Z=V[T];if(Z.selected){I=Z.value;if(!I||I===""){I=Z.text;}W[W.length]=I;}}U[M]=W;break;}}else{O=S[0].type;switch(O){case"radio":for(T=0;T<P;T++){N=S[T];if(N.checked){U[M]=N.value;break;}}break;case"checkbox":W=[];for(T=0;T<P;T++){a=S[T];if(a.checked){W[W.length]=a.value;}}U[M]=W;break;}}}}}return U;},destroy:function(){D.call(this);this._aButtons=null;var I=this.element.getElementsByTagName("form"),J;if(I.length>0){J=I[0];if(J){B.purgeElement(J);if(J.parentNode){J.parentNode.removeChild(J);}this.form=null;}}A.superclass.destroy.call(this);},toString:function(){return"Dialog "+this.id;}});}());(function(){YAHOO.widget.SimpleDialog=function(E,D){YAHOO.widget.SimpleDialog.superclass.constructor.call(this,E,D);};var C=YAHOO.util.Dom,B=YAHOO.widget.SimpleDialog,A={"ICON":{key:"icon",value:"none",suppressEvent:true},"TEXT":{key:"text",value:"",suppressEvent:true,supercedes:["icon"]}};B.ICON_BLOCK="blckicon";B.ICON_ALARM="alrticon";B.ICON_HELP="hlpicon";B.ICON_INFO="infoicon";B.ICON_WARN="warnicon";B.ICON_TIP="tipicon";B.ICON_CSS_CLASSNAME="yui-icon";B.CSS_SIMPLEDIALOG="yui-simple-dialog";YAHOO.extend(B,YAHOO.widget.Dialog,{initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);this.cfg.addProperty(A.ICON.key,{handler:this.configIcon,value:A.ICON.value,suppressEvent:A.ICON.suppressEvent});this.cfg.addProperty(A.TEXT.key,{handler:this.configText,value:A.TEXT.value,suppressEvent:A.TEXT.suppressEvent,supercedes:A.TEXT.supercedes});},init:function(E,D){B.superclass.init.call(this,E);this.beforeInitEvent.fire(B);C.addClass(this.element,B.CSS_SIMPLEDIALOG);this.cfg.queueProperty("postmethod","manual");if(D){this.cfg.applyConfig(D,true);}this.beforeRenderEvent.subscribe(function(){if(!this.body){this.setBody("");}},this,true);this.initEvent.fire(B);},registerForm:function(){B.superclass.registerForm.call(this);this.form.innerHTML+='<input type="hidden" name="'+this.id+'" value=""/>';},configIcon:function(F,E,J){var K=E[0],D=this.body,I=B.ICON_CSS_CLASSNAME,H,G;if(K&&K!="none"){H=C.getElementsByClassName(I,"*",D);if(H){G=H.parentNode;if(G){G.removeChild(H);H=null;}}if(K.indexOf(".")==-1){H=document.createElement("span");H.className=(I+" "+K);H.innerHTML="&#160;";}else{H=document.createElement("img");H.src=(this.imageRoot+K);H.className=I;}if(H){D.insertBefore(H,D.firstChild);}}},configText:function(E,D,F){var G=D[0];if(G){this.setBody(G);this.cfg.refireEvent("icon");}},toString:function(){return"SimpleDialog "+this.id;}});}());(function(){YAHOO.widget.ContainerEffect=function(E,H,G,D,F){if(!F){F=YAHOO.util.Anim;}this.overlay=E;this.attrIn=H;this.attrOut=G;this.targetElement=D||E.element;this.animClass=F;};var B=YAHOO.util.Dom,C=YAHOO.util.CustomEvent,A=YAHOO.widget.ContainerEffect;A.FADE=function(D,F){var G=YAHOO.util.Easing,I={attributes:{opacity:{from:0,to:1}},duration:F,method:G.easeIn},E={attributes:{opacity:{to:0}},duration:F,method:G.easeOut},H=new A(D,I,E,D.element);H.handleUnderlayStart=function(){var K=this.overlay.underlay;if(K&&YAHOO.env.ua.ie){var J=(K.filters&&K.filters.length>0);if(J){B.addClass(D.element,"yui-effect-fade");}}};H.handleUnderlayComplete=function(){var J=this.overlay.underlay;if(J&&YAHOO.env.ua.ie){B.removeClass(D.element,"yui-effect-fade");}};H.handleStartAnimateIn=function(K,J,L){B.addClass(L.overlay.element,"hide-select");if(!L.overlay.underlay){L.overlay.cfg.refireEvent("underlay");}L.handleUnderlayStart();L.overlay._setDomVisibility(true);B.setStyle(L.overlay.element,"opacity",0);};H.handleCompleteAnimateIn=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateInCompleteEvent.fire();};H.handleStartAnimateOut=function(K,J,L){B.addClass(L.overlay.element,"hide-select");L.handleUnderlayStart();};H.handleCompleteAnimateOut=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.overlay._setDomVisibility(false);B.setStyle(L.overlay.element,"opacity",1);L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateOutCompleteEvent.fire();};H.init();return H;};A.SLIDE=function(F,D){var I=YAHOO.util.Easing,L=F.cfg.getProperty("x")||B.getX(F.element),K=F.cfg.getProperty("y")||B.getY(F.element),M=B.getClientWidth(),H=F.element.offsetWidth,J={attributes:{points:{to:[L,K]}},duration:D,method:I.easeIn},E={attributes:{points:{to:[(M+25),K]}},duration:D,method:I.easeOut},G=new A(F,J,E,F.element,YAHOO.util.Motion);G.handleStartAnimateIn=function(O,N,P){P.overlay.element.style.left=((-25)-H)+"px";P.overlay.element.style.top=K+"px";};G.handleTweenAnimateIn=function(Q,P,R){var S=B.getXY(R.overlay.element),O=S[0],N=S[1];if(B.getStyle(R.overlay.element,"visibility")=="hidden"&&O<L){R.overlay._setDomVisibility(true);}R.overlay.cfg.setProperty("xy",[O,N],true);R.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateIn=function(O,N,P){P.overlay.cfg.setProperty("xy",[L,K],true);P.startX=L;P.startY=K;P.overlay.cfg.refireEvent("iframe");P.animateInCompleteEvent.fire();};G.handleStartAnimateOut=function(O,N,R){var P=B.getViewportWidth(),S=B.getXY(R.overlay.element),Q=S[1];R.animOut.attributes.points.to=[(P+25),Q];};G.handleTweenAnimateOut=function(P,O,Q){var S=B.getXY(Q.overlay.element),N=S[0],R=S[1];Q.overlay.cfg.setProperty("xy",[N,R],true);Q.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateOut=function(O,N,P){P.overlay._setDomVisibility(false);P.overlay.cfg.setProperty("xy",[L,K]);P.animateOutCompleteEvent.fire();};G.init();return G;};A.prototype={init:function(){this.beforeAnimateInEvent=this.createEvent("beforeAnimateIn");this.beforeAnimateInEvent.signature=C.LIST;this.beforeAnimateOutEvent=this.createEvent("beforeAnimateOut");
this.beforeAnimateOutEvent.signature=C.LIST;this.animateInCompleteEvent=this.createEvent("animateInComplete");this.animateInCompleteEvent.signature=C.LIST;this.animateOutCompleteEvent=this.createEvent("animateOutComplete");this.animateOutCompleteEvent.signature=C.LIST;this.animIn=new this.animClass(this.targetElement,this.attrIn.attributes,this.attrIn.duration,this.attrIn.method);this.animIn.onStart.subscribe(this.handleStartAnimateIn,this);this.animIn.onTween.subscribe(this.handleTweenAnimateIn,this);this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn,this);this.animOut=new this.animClass(this.targetElement,this.attrOut.attributes,this.attrOut.duration,this.attrOut.method);this.animOut.onStart.subscribe(this.handleStartAnimateOut,this);this.animOut.onTween.subscribe(this.handleTweenAnimateOut,this);this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut,this);},animateIn:function(){this.beforeAnimateInEvent.fire();this.animIn.animate();},animateOut:function(){this.beforeAnimateOutEvent.fire();this.animOut.animate();},handleStartAnimateIn:function(E,D,F){},handleTweenAnimateIn:function(E,D,F){},handleCompleteAnimateIn:function(E,D,F){},handleStartAnimateOut:function(E,D,F){},handleTweenAnimateOut:function(E,D,F){},handleCompleteAnimateOut:function(E,D,F){},toString:function(){var D="ContainerEffect";if(this.overlay){D+=" ["+this.overlay.toString()+"]";}return D;}};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);})();YAHOO.register("container",YAHOO.widget.Module,{version:"2.7.0",build:"1799"});

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/yui/yui_2.7.0b/build/container/container-min.js');
};
/**
 * Global helper functions
 */


function createAttribute(doc, node, type, val){
	var attribute = doc.createAttribute(type);
	attribute.nodeValue = val;
	node.setAttributeNode(attribute);
};

function createElement(doc, type, attrArgs){
	var newElement = doc.createElement(type);
	if(attrArgs!=null){
		for(var option in attrArgs){
			createAttribute(doc, newElement, option, attrArgs[option]);
		};
	};
	return newElement;
};

/**
 * returns a <br> element
 */
function createBreak(){
	return createElement(document, 'br', null);
};

/**
 * returns a space
 */
function createSpace(){
	return document.createTextNode(' ');
};

/**
 * Given a string, returns a URI encoded string.
 * 
 * @param String
 * @return String
 */
function encodeString(text){
	return encodeURIComponent(text);
};

/**
 * Returns the element(s) with the given attributeName. If the attributeValue
 * is specified, it will filter further.
 * @param attributeName
 * @param attributeValue
 * @return
 */
function getElementsByAttribute(attributeName, attributeValue, frameName) {
	notificationManager.notify('attributeName:' + attributeName + ", attributeValue:" + attributeValue, 4);
	var bodyNode = null;
	if (frameName != null) {
		notificationManager.notify('frameName:' + frameName, 4);
		bodyNode = yui.get(window.frames['ifrm'].frames[frameName].document.body);
	} else {
		bodyNode = yui.get(window.frames["ifrm"].document.body);
	}
	if (attributeValue != null) {
		var node = bodyNode.query('['+attributeName+'='+attributeValue+']');
		notificationManager.notify('audioNode:' + node, 4);
		return node;
	} else {
		var nodes = bodyNode.queryAll('['+attributeName+']');
		if (nodes != null) {
			notificationManager.notify('audioNodes.length:' + nodes.size(), 4);
			for (var i=0; i< nodes.size(); i++) {
				notificationManager.notify('audioNode textContent:' + nodes.item(i).get('textContent'), 4);
			}
		}
		return nodes;
	}
}

/**
 * returns true iff the URL returns a 200 OK message
 * @param url url to test
 * @return
 */
function checkAccessibility(url) {
	var callback = {
			success: function(o) {return true},
			failure: function(o) {return false}
	}
	var transaction = YAHOO.util.Connect.asyncRequest('HEAD', url, callback, null);
}

/**
 * Given an html string, removes all whitespace and returns that string
 * 
 * @param html String
 * @return html String without whitespace
 */
function normalizeHTML(html){
	return html.replace(/\s+/g,'');
};

/**
 * Finds and injects the vle url for any relative references
 * found in content.
 */
function injectVleUrl(content){
	var loc = window.location.toString();
	var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
	
	content = content.replace(/(src='|src="|href='|href=")(?!http|\/)/gi, '$1' + vleLoc);
	return content;
};

// define array.contains method, which returns true iff the array
//contains the element specified
if(!Array.contains){
	Array.prototype.contains = function(obj) {
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return true;
            }
        }
        return false;
	};
};

//IE 7 doesn't have indexOf method, so we need to define it........
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){
            if(this[i]==obj){
                return i;
            };
        };
        return -1;
    };
};

/**
 * Array prototype that takes in a function which is passed
 * each element in the array and returns an array of the return
 * values of the function.
 */
if(!Array.map){
	 Array.prototype.map = function(fun){
		 var out = [];
		 for(var k=0;k<this.length;k++){
			 out.push(fun(this[i]));
		 };
		 return out;
	 };
};

/**
 * Adds a compare function to Array.prototype if one
 * does not exist
 */
if(!Array.compare){
	Array.prototype.compare = function(testArr) {
	    if (this.length != testArr.length) return false;
	    for (var i = 0; i < testArr.length; i++) {
	        if (this[i].compare) { 
	            if (!this[i].compare(testArr[i])) return false;
	        };
	        if (this[i] !== testArr[i]) return false;
	    };
	    return true;
	};
};

/**
 * Hides the element with the given id
 */
function hideElement(id){
	document.getElementById(id).style.display = 'none';
};

/**
 * Shows the element with the given id
 */
function showElement(id){
	document.getElementById(id).style.display = 'block';
};

/**
 * Given an html element obj, returns its absolute location
 * (left & top) in the page.
 * 
 * @param HTML Element
 * @return obj {left, top}
 */
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {left: curleft, top: curtop};
};

/**
 * Returns the number of fields that the given object has.
 */
function objSize(obj){
	var count = 0;
	for(var field in obj){
		if(obj.hasOwnProperty(field)){
			count++;
		};
	};
	return count;
};


/**
 * Creates an xml doc object from the xml string
 * @param txt xml text
 * @return
 */
function loadXMLDocFromString(txt) {
	try //Internet Explorer
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(txt);
		return(xmlDoc); 
	}
	catch(e)
	{
		try //Firefox, Mozilla, Opera, etc.
		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(txt,"text/xml");
			return(xmlDoc);
		}
		catch(e) {alert(e.message)}
	}
	return(null);
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/common/helperfunctions.js');
};
/**
 * The core that is common to all views
 */

/**
 * Loads a project into the view by creating a content object using the
 * given url and passing in the given contentBase and lazyLoading as
 * parameters to the project.
 * 
 * @param url
 * @param contentBase
 * @param lazyLoading
 */
View.prototype.loadProject = function(url, contentBase, lazyLoading){
	eventManager.fire('loadingProjectStart');
	this.project = createProject(createContent(url), contentBase, lazyLoading, this);
	eventManager.fire('loadingProjectComplete');
};

/**
 * @return the currently loaded project for this view if one exists
 */
View.prototype.getProject = function(){
	return this.project;
};

View.prototype.injectVleUrl = function(content){
	var loc = window.location.toString();
	var vleLoc = loc.substring(0, loc.indexOf('/vle/')) + '/vle/';
	
	content = content.replace(/(src='|src="|href='|href=")(?!http|\/)/gi, '$1' + vleLoc);
	return content;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/coreview.js');
};
/**
 * The util object for this view
 * 
 * @author patrick lawler
 */
View.prototype.utils = {};

/**
 * Returns whether the content string contains an applet by searching for
 * an open and close applet tag in the content string.
 */
View.prototype.utils.containsApplet = function(content){
	/* check for open and close applet tags */
	var str = content.getContentString();
	if(str.indexOf("<applet") != -1 && str.indexOf("</applet>") != -1) {
		return true;
	} else {
		return false;
	};
};

/**
 * Inserts the applet param into the the given content
 * @param content the content in which to insert the param
 * @param name the name of the param
 * @param value the value of the param
 */
View.prototype.utils.insertAppletParam = function(content, name, value){
	/* get the content string */
	var str = content.getContentString();
	
	/* create the param string */
	var paramTag = '<param name="' + name + '" value="' + value + '">';
	
	/* check if the param already exists in the content */
	if(str.indexOf(paramTag) == -1) {
		/* add the param right before the closing applet tag */
		content.setContent(str.replace("</applet>", paramTag + "\n</applet>"));
	};
};


/**
 * Extracts the file servlet information from the given url and returns the result.
 */
View.prototype.utils.getContentPath = function(baseUrl, url){
	return url.substring(url.indexOf(baseUrl) + baseUrl.length, url.length);
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/view_utils.js');
};
/**
 * ConnectionManager manages and prioritizes GET and POST requests
 */
function ConnectionManager(em) {
	this.em = em;
	this.MAX = 5;
	this.queue = [];
	this.running = 0;
	this.counter = 0;
};

/**
 * Creates a connection object based on type, queues and starts a request depending
 * on how many are in queue.
 * 
 * @param type - POST or GET
 * @param priority - the lower the number the sooner the request gets started
 * @param url - the url
 * @param cArgs - the connection arguments, generally, the parameters and values in a url request
 * @param handler - success handler function which takes 3 params: Text, xmlDoc and args (the hArgs gets passed in)
 * 		run when connectionManager receives a successful response from server.
 * @param hArgs - args that are needed by the success and/or failure handler
 * @param fHandler - failure handler function with takes 2 params: o (the yui response object), and args (the
 * 		hArgs that gets passed in
 * @return
 */
ConnectionManager.prototype.request = function(type, priority, url, cArgs, handler, hArgs, fHandler){
	
	var connection;
	if(type=='GET'){
		connection = new GetConnection(priority, url, cArgs, handler, hArgs, this.em, fHandler);
	} else if(type=='POST'){
		connection = new PostConnection(priority, url, cArgs, handler, hArgs, this.em, fHandler);
	} else {
		alert('unknown connection type: ' + type + '\nExiting...');
		return;
	};
	
	this.queue.push(connection);
	this.launchNext();
};

/**
 * Sorts the queue according to priority and if the number of
 * requests does not exceed this.MAX, launches the next request
 */
ConnectionManager.prototype.launchNext = function(){
	if(this.queue.length>0){
		if(this.running<this.MAX){
			this.queue.sort(this.orderByPriority);
			var connection = this.queue.shift();
			
			var endName = this.generateEventName();
			var launchNextRequest = function(type, args, obj){obj.running --; obj.launchNext();};
			this.em.addEvent(endName);
			this.em.subscribe(endName, launchNextRequest, this);
			
			this.running ++;
			connection.startRequest(endName);
		};
	};
};

/**
 * Function used by array.sort to order by priority
 */
ConnectionManager.prototype.orderByPriority = function(a, b){
	if(a.priority < b.priority){ return -1};
	if(a.priority > b.priority){ return 1};
	if(a.priority == b.priority) { return 0};
};

/**
 * Generates a unique event name
 */
ConnectionManager.prototype.generateEventName = function(){
	while(true){
		var name = 'connectionEnded' + this.counter;
		if(!this.em.isEvent(name)){
			return name;
		};
		this.counter ++;
	};
};

/**
 * A Connection object encapsulates all of the necessary variables
 * to make an async request to an url
 */
function Connection(priority, url, cArgs, handler, hArgs, em){
	this.em = em;
};

/**
 * Launches the request that this connection represents
 */
Connection.prototype.startRequest = function(eventName){
	var en = eventName;
	
	var callback = {
		success: function(o){
			this.em.fire(en);
			if ((o.responseText && !o.responseXML)  || (typeof ActiveXObject!='undefined')){
				o.responseXML = loadXMLString(o.responseText);
			}
			if (o.responseText !='undefined' && o.getResponseHeader["Content-Length"] < 10000 && o.responseText.match("login for portal") != null) {
				// this means that student has been idling too long and has been logged out of the session
				// so we should take them back to the homepage.
				//vle.doLogIn();
				if(notificationManager){
					notificationManager.notify("You have been inactive for too long and have been logged out. Please log back in to continue.",3);
				} else {
					alert("You have been inactive for too long and have been logged out. Please log back in to continue.");
				};
				vle.logout = true;  // we need to bypass any cleanup (ie saving work back to server) because user isn't authenticated any more
				window.location = "/webapp/j_spring_security_logout";
			}
			this.handler(o.responseText, o.responseXML, this.hArgs);
		},
		failure: function(o){
			this.em.fire(en);
			if(this.fHandler){
				this.fHandler(o, this.hArgs);
			} else {
				var msg = 'Connection request failed: transactionId=' + o.tId + '  TEXT=' + o.statusText;
				if(notificationManager){
					notificationManager.notify(msg, 2);
				} else {
					alert(msg);
				};
			};
		},
		scope:this
	};
	
	YAHOO.util.Connect.asyncRequest(this.type, this.url, callback, this.params);
};

/**
 * a Child of Connection, a GetConnection Object represents a GET
 * async request
 */
GetConnection.prototype = new Connection();
GetConnection.prototype.constructor = GetConnection;
GetConnection.prototype.parent = Connection.prototype;
function GetConnection(priority, url, cArgs, handler, hArgs, em, fHandler){
	this.type = 'GET';
	this.priority = priority;
	this.em = em;
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.fHandler = fHandler;
	this.params = null;
	this.parseConnectionArgs();
};

/**
 * parses the connection arguments and appends them to the URL
 */
GetConnection.prototype.parseConnectionArgs = function(){
	var first = true;
	if (this.url.indexOf("?") > -1) {
		first = false;
	}
	if(this.cArgs){
		for(var p in this.cArgs){
			if(first){
				first = false;
				this.url += '?'
			} else {
				this.url += '&'
			};
			this.url += p + '=' + this.cArgs[p];
		};
	};
};

/**
 * A child of Connection, a PostConnection object represents
 * an async POST request
 */
PostConnection.prototype = new Connection();
PostConnection.prototype.constructor = PostConnection;
PostConnection.prototype.parent = Connection.prototype;
function PostConnection(priority, url, cArgs, handler, hArgs, em, fHandler){
	this.type = 'POST';
	this.priority = priority;
	this.em = em;
	this.url = url;
	this.cArgs = cArgs,
	this.handler = handler;
	this.hArgs = hArgs;
	this.fHandler = fHandler;
	this.params = null;
	this.parseConnectionArgs();
};

/**
 * parses and sets the necessary parameters for a POST request
 */
PostConnection.prototype.parseConnectionArgs = function(){
	var first = true;
	if(this.cArgs){
		this.params = '';
		for(var p in this.cArgs){
			if(first){
				first = false;
			} else {
				this.params += '&';
			};
			this.params += p + '=' + this.cArgs[p];
		};
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/io/ConnectionManager.js');
};
/**
 * Global object to handle notifications for the VLE and 
 * authoring tool. There are 3 levels of messages plus a debug 
 * level; 1: information that will be printed to the firebug 
 * console, 2: warnings that will be printed to the firebug 
 * console, 3: alert/errors that popup an alert message, 4: 
 * debug which are messages that are only printed to the 
 * console when debugMode is set to true.
 *
 * The notificationManager has a notify function and a debugMode
 * field. The debugMode field defaults to false but can be set
 * to true using: notificationManager.debugMode = true
 *
 * The notify function takes two arguments: the message, the notify
 * level of the message (either 1, 2, 3 or 4). The message is the
 * message to be displayed and the notify level, in conjunction with
 * the debugMode value, controls how and where the message is displayed.
 *
 * Usage examples:
 *
 *		notificationManager.notify('what is it', 1);
 *		notificationManager.notify('when is it', 2);
 *		notificationManager.notify('how is it', 3);
 *		notificationManager.notify('debugging is fun', 4)
 *  will exhibit the following behavior
 * 		i what is it			-- printed to firebug console
 *		! when is it			-- printed to firebug console
 *		how is it				-- in a popup alert
 * 
 * the level 4 call is not displayed because debugMode is false.
 * 
 ****
 *		notificationManager.debugMode = true;
 *		notificationManager.notify('what is it', 1);
 *		notificationManager.notify('when is it', 2);
 *		notificationManager.notify('how is it', 3);
 *		notificationManager.notify('debugging is fun', 4)
 *  will exhibit the following behavior
 *		Notify debug: what is it			-- printed to firebug console
 *		Notify debug: when is it			-- printed to firebug console
 *		Notify debug: how is it				-- printed to firebug console
 *		Notify debug: debugging is fun		-- printed to firebug console
 *
 * when debugMode is set to true, all notify calls are printed to console.
 */
 
/**
 * notificationManager object
 */
var notificationManager = {
	init: function(){
		window.notificationEventManager = new EventManager();
		notificationEventManager.addEvent('removeMsg');
	}(),
	count: 0,
	debugMode: false,
	levels: {
		1: 'info',
		2: 'warn',
		3: 'alert',
		4: 'log',
		5: 'fatal'
	},
	notify: function(message, level){
		if(level){
			var notifyLevel = this.levels[level];
			if(this.debugMode){
				if(window.console){
					if(!notifyLevel){
						notifyLevel = 'log';
					};
					if(notifyLevel=='alert'){
						notifyLevel = 'error';
					};
					window.console[notifyLevel]('Notify debug: ' + message);
				} else {
					this.notifyAlert('Notify debug: ' + message);
				};
			} else {
				if(notifyLevel){
					if(notifyLevel=='alert'){
						this.notifyAlert('Notify message: ' + message);
					} else if(notifyLevel=='fatal'){
						eventManager.fire('fatalError', message);
					} else if(notifyLevel!='log'){
						if(window.console && window.console[notifyLevel]){
							window.console[notifyLevel](message);
						} else {
							// do nothing.
						};
					};
				};
			};
		} else {
			this.notifyAlert('Notify message: ' + message);
		};
	},
	notifyAlert: function(msg){
		var msgDiv = this.generateUniqueMessageDiv();
		document.body.appendChild(msgDiv);
		new AlertObject(msgDiv, msg);
	},
	generateUniqueMessageDiv: function(){
		var id = 'superSecretMessageDiv_' + this.count;
		if(document.getElementById(id)){
			this.count ++;
			return generateUniqueMessageDiv();
		} else {
			var el = createElement(document, 'div', {id: id, 'class':'messages', style:'display:none;'});
			this.count ++;
			return el;
		};
	}
};

/**
 * The Alert Object takes a html div element and a message, displays the given
 * message at the top of the page for the time specified in MSG_TIME and then
 * removes the element from the page.
 */
function AlertObject(el, msg){
	this.MSG_TIME = 3000;
	this.el = el;
	this.msg = msg;

	notificationEventManager.subscribe('removeMsg', this.removeMsg, this);
	
	el.style.display = 'block';
	el.innerHTML = msg;
	el.style.left = (document.body.clientWidth / 2) - 150;
	
	setTimeout('notificationEventManager.fire("removeMsg","' + el.id + '")', this.MSG_TIME);
};

/**
 * Removes the message that this object represents from the page.
 */
AlertObject.prototype.removeMsg = function(type,args,obj){
	if(args[0]==obj.el.id){
		document.body.removeChild(obj.el);
		obj = null;
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/util/NotificationManager.js');
};
function createContent(url){
	return function(url){
		var url = url;
		var contentString;
		var contentXML;
		var contentJSON;
		var contentLoaded = false;
		var MAX_TIME = 30000;
		var timer;
		
		/**
		 * Fires event alert if eventManager exists, alerts message otherwise
		 */
		var msg = function(text){
			if(typeof eventManager != 'undefined'){
				eventManager.fire('alert', text);
			} else {
				alert(text);
			};
		};
		
		/**
		 * If content has been previously loaded, returns the content
		 * in the format of the given type, otherwise, retrieves the
		 * content and then returns the content in the format of the 
		 * given type.
		 */
		var getContent = function(type){
			if(contentLoaded){
				return contentType(type);
			} else {
				return retrieveContent(type);
			};
		};
		
		/**
		 * returns the content in the format of the given type
		 */
		var contentType = function(type){
			if(type=='xml'){
				return contentXML;
			} else if(type=='json'){
				return contentJSON;
			} else if(type=='string'){
				return contentString;
			} else {
				return null;
			};
		};
		
		/**
		 * Makes a synchronous XHR request, parses the response as
		 * string, xml and json (when possible) and returns the content
		 * in the format of the given type.
		 */
		var retrieveContent = function(type){
			//make synchronous request
			timer = setTimeout('eventManager.fire("contentTimedOut","' + url + '")',MAX_TIME);
			var req = new XMLHttpRequest();
			req.open('GET', url, false);
			req.send(null);
			clearTimeout(timer);
			
			//parse the response in various formats if any response format has a value
			if(req.responseText || req.responseXML){
				//xml
				if(req.responseXML){
					contentXML = req.responseXML;
				} else {//create xmlDoc from string
					setContentXMLFromString(req.responseText);
				};
				
				//string
				if(req.responseText){
					contentString = req.responseText;
				} else {//serialize xml to string
					if(window.ActiveXObject){
						contentString = req.responseXML.xml;
					} else {
						contentString = (new XMLSerializer()).serializeToString(req.responseXML);
					};
				};
				
				//json
				try{
					contentJSON = yui.JSON.parse(contentString);
				} catch(e){
					contentJSON = undefined;
				};
				
				//set content loaded
				contentLoaded = true;
				
				//return appropriate response type
				return contentType(type);
			} else {
				msg('Error retrieving content for url: ' + url);
				return null;
			};
		};
		
		/**
		 * Sets and parses this content object's content
		 */
		var setContent = function(content){
			//check for different content types and parse to other types as appropriate
			if(typeof content=='string'){//string
				contentString = content;
				setContentXMLFromString(contentString);
				try{
					contentJSON = yui.JSON.parse(contentString);
				} catch(e){
					contentJSON = undefined;
				};
			} else {
				if(window.ActiveXObject){//IE
					if(content.xml){//xml Doc in IE
						contentXML = content;
						contentString = content.xml;
						try{
							contentJSON = yui.JSON.parse(contentString);
						} catch(e){
							contentJSON = undefined;
						};
					} else {//must be object
						contentJSON = content;
						try{
							contentString = yui.JSON.stringify(contentJSON);
							setContentXMLFromString(contentString);
						} catch(e){
							contentJSON = undefined;
						};
					};
				} else {//not ie
					if(content instanceof Document){//xmlDoc
						contentXML = content;
						contentString = (new XMLSerializer()).serializeToString(contentXML);
						try{
							contentJSON = yui.JSON.parse(contentString);
						} catch(e){
							contentJSON = undefined;
						};
					} else {//must be object
						contentJSON = content;
						try{
							contentString = yui.JSON.stringify(contentJSON);
							setContentXMLFromString(contentString);
						} catch(e){
							contentString = undefined;
						};
					};
				};
			};
			
			//set content loaded
			contentLoaded = true;
		};
		
		/**
		 * Returns true if the given xmlDoc does not contain any parsererror
		 * tag in non-IE browsers or the length of xmlDoc.xml is > 0 in IE
		 * browers, returns false otherwise.
		 */
		var validXML = function(xml){
			if(window.ActiveXObject){//IE
				if(xml.xml.length==0){
					return false;
				} else {
					return true;
				};
			} else {//not IE
				return xml.getElementsByTagName('parsererror').length < 1;
			};
		};
		
		/**
		 * Sets the contentXML variable
		 */
		var setContentXMLFromString = function(str){
			if(document.implementation && document.implementation.createDocument){
				contentXML = new DOMParser().parseFromString(str, "text/xml");
			} else if(window.ActiveXObject){
				contentXML = new ActiveXObject("Microsoft.XMLDOM")
				contentXML.loadXML(str);
			};
			
			if(!validXML(contentXML)){
				contentXML = undefined;
			};
		};
		
		/* Returns the filename for this content given the contentBaseUrl */
		var getFilename = function(contentBase){
			return url.substring(url.indexOf(contentBase) + contentBase.length + 1, url.length);
		};
		
		return {
			/* Returns this content as an xmlDoc if possible, else returns undefined */
			getContentXML:function(){return getContent('xml');},
			/* Returns this content as a JSON object if possible, else returns undefined */
			getContentJSON:function(){return getContent('json');},
			/* Returns this content as a string */
			getContentString:function(){return getContent('string');},
			/* Sets this content given any of: a string, json object, xmlDoc */
			setContent:function(content){setContent(content);},
			/* Retrieves the content but does not return it (for eager loading) */
			retrieveContent:function(){getContent('string');},
			/* Returns the url for this content */
			getContentUrl:function(){return url;},
			/* Returns the filename for this content given the contentBaseUrl */
			getFilename:function(contentBase){return getFilename(contentBase);}
		};
	}(url);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/content/content.js');
};
/**
 * Node specific helpers
 */

/* Array of nodes whose content comprises the page */
var SELF_RENDERING_NODES = ['BlueJNode', 'DrawNode', 'FlashNode', 'HtmlNode', 'MySystemNode', 'SVGDrawNode'];

/* Map of node types and their corresponding html page */
var HTML_MAP = {BrainstormNode:{server:'node/brainstorm/brainfull.html', serverless:'node/brainstorm/brainlite.html'}, 
		ChallengeQuestionNode:'node/challengequestion/challengequestion.html', DataGraphNode:'node/datagraph/datagraph.html',
		FillinNode:'node/fillin/fillin.html', GlueNode:'node/glue/glue.html', MatchSequenceNode:'node/matchsequence/matchsequence.html',
		MultipleChoiceNode:'node/multiplechoice/multiplechoice.html', NoteNode:'node/openresponse/note.html', 
		OpenResponseNode:'node/openresponse/openresponse.html', OutsideUrlNode:'node/outsideurl/outsideurl.html', 
		TickerNode:'node/ticker/ticker.html'};

function removeClassFromElement(identifier, classString) {
	YUI().use('node', function(Y) {
		var node = Y.get('#'+identifier);
		node.removeClass(classString);
	});
}

function addClassToElement(identifier, classString) {
	YUI().use('node', function(Y) {
		var node = Y.get('#'+identifier);
		node.addClass(classString);
	});
}

/**
 * returns true iff element with specified identifier has 
 * a class classString
 * @param identifier
 * @param classString
 * @return
 */
function hasClass(identifier, classString) {
	var classesStr = document.getElementById(identifier).getAttribute('class');
	return classesStr != null && (classesStr.indexOf(classString) != -1);
}

/**
 * Clears innerHTML of a div with id=feedbackDiv
 */
function clearFeedbackDiv() {
	document.getElementById("feedbackDiv").innerHTML = "";
}

/**
 * Clears value of an element with id=responseBox
 */
function clearResponseBox() {
	document.getElementById("responseBox").value = "";
}

/**
 * show tryagain button iff doShow == true
 * @param doShow
 * @return
 */
function setButtonVisible(buttonId, doShow) {
    var tryAgainButton = document.getElementById(buttonId);

	if (doShow) {
	    tryAgainButton.style.visibility = 'visible';
	} else {
	    tryAgainButton.style.visibility = 'hidden';		
	}
}

/**
 * enable checkAnswerButton
 * OR
 * disable checkAnswerButton
 */
function setCheckAnswerButtonEnabled(doEnable) {
  var checkAnswerButton = document.getElementById('checkAnswerButton');

  if (doEnable) {
    checkAnswerButton.removeAttribute('disabled');
  } else {
    checkAnswerButton.setAttribute('disabled', 'true');
  }
}

function setResponseBoxEnabled(doEnable) {
	var responseBox = document.getElementById('responseBox');
	if (doEnable) {
		responseBox.removeAttribute('disabled');
	} else {
		responseBox.setAttribute('disabled','disabled');
	};
};

/**
 * Updates text in div with id numberAttemptsDiv with info on number of
 * attempts. The text will generally follow the format:
 * This is your ___ attempt.  Or This is your ___ revision.
 * part1 example: This is your
 * part2 example: attempt
 * part2 example2: revision
 */
function displayNumberAttempts(part1, part2, states) {
	var nextAttemptNum = states.length + 1;
	var nextAttemptString = "";
	if (nextAttemptNum == 1) {
		nextAttemptString = "1st";		
	} else if (nextAttemptNum == 2) {
		nextAttemptString = "2nd";		
	} else if (nextAttemptNum == 3) {
		nextAttemptString = "3rd";		
	} else {
		nextAttemptString = nextAttemptNum + "th";		
	}
	var numAttemptsDiv = document.getElementById("numberAttemptsDiv");
	var numAttemptsDivHtml = part1 + " " + nextAttemptString + " " + part2 +".";
	numAttemptsDiv.innerHTML = numAttemptsDivHtml;
};

/**
 * Updates text in div with id lastAttemptDiv with info on
 * student's last attempt
 * javascript Date method reference:
 * http://www.w3schools.com/jsref/jsref_obj_date.asp
 */
function displayLastAttempt(states) {
	if (states.length > 0) {
	    var t = states[states.length - 1].timestamp;
	    var month = t.getMonth() + 1;
	    var hours = t.getHours();
	    var minutes = t.getMinutes();
	    var seconds = t.getSeconds();
	    var timeToDisplay = month + "/" + t.getDate() + "/" + t.getFullYear() +
	        " at " + hours + ":" + minutes + ":" + seconds;
		var lastAttemptDiv = document.getElementById("lastAttemptDiv");
		lastAttemptDiv.innerHTML = " Your last attempt was on " + timeToDisplay;
	};
};

/**
 * Replaces all the & with &amp; and escapes all " within the
 * given text and returns that text.
 * 
 * @param text
 * @return text
 */
function makeHtmlSafe(text){
	if(text){
		text =  text.replace(/\&/g, '&amp;'); //html friendly &
		text = text.replace(/\"/g, "&quot;"); //escape double quotes
		return text;
	} else {
		return '';
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/common/nodehelpers.js');
};
/* Modular Project Object */
function createProject(content, contentBaseUrl, lazyLoading, view){
	return function(content, cbu, ll, view){
		var content = content;
		var contentBaseUrl = cbu;
		var lazyLoading = ll;
		var allLeafNodes = [];
		var allSequenceNodes = [];
		var autoStep;
		var stepLevelNumbering;
		var title;
		var stepTerm;
		var rootNode;
		var view = view;
		var copyIds = [];
		
		/* Creates the nodes defined in this project's content */
		var generateProjectNodes = function(){
			var jsonNodes = content.getContentJSON().nodes;
			for (var i=0; i < jsonNodes.length; i++) {
				var currNode = jsonNodes[i];
				var thisNode = NodeFactory.createNode(currNode, view);
				if(thisNode == null) {
					/* unable to create the specified node type probably because it does not exist in wise4 */
					view.notificationManager.notify('null was returned from project factory for node: ' + currNode.identifier + ' \nSkipping node.', 2);
				} else {
					/* validate and set identifier attribute */
					if(!currNode.identifier || currNode.identifier ==''){
						view.notificationManager.notify('No identifier for node in project file.', 3);
					} else {
						thisNode.id = currNode.identifier;
						if(idExists(thisNode.id)){
							view.notificationManager.notify('Duplicate node id: ' + thisNode.id + ' found in project', 3);
						};
					};
					/* validate and set title attribute */
					if(!currNode.title || currNode.title==''){
						view.notificationManager.notify('No title attribute for node with id: ' + thisNode.id, 2);
					} else {
						thisNode.title = currNode.title;
					};
					/* validate and set class attribute */
					if(!currNode['class'] || currNode['class']==''){
						view.notificationManager.notify('No class attribute for node with id: ' + thisNode.id, 2);
					} else {
						thisNode.className = currNode['class'];
					};
					
					/* validate filename reference attribute */
					if(!currNode.ref || currNode.ref==''){
						view.notificationManager.notify('No filename specified for node with id: ' + thisNode.id + ' in the project file', 2);
					} else {
						thisNode.content = createContent(makeUrl(currNode.ref));
					};
					
					/* add to leaf nodes */
					allLeafNodes.push(thisNode);
					
					/* load content now if not lazy loading */
					if(!lazyLoading){
						thisNode.content.retrieveContent();
					};
					
					/* prep any Note Nodes */
					if(thisNode.type=='NoteNode'){
						thisNode.renderFrame();
					};
					
					/* get any previous work reference node ids and add it to node */
					thisNode.prevWorkNodeIds = currNode.previousWorkNodeIds;
					
					/* add events for node rendering */
					eventManager.subscribe('pageRenderComplete', thisNode.pageRenderComplete, thisNode);
					eventManager.subscribe('contentRenderComplete', thisNode.contentRenderComplete, thisNode);
					eventManager.subscribe('scriptsLoaded', thisNode.loadContentAfterScriptsLoad, thisNode);
				};
			};
		};
		
		/* Creates and validates the sequences defined in this project's content */
		var generateSequences = function(){
			var project = content.getContentJSON();
			
			/* create the sequence nodes */
			var sequences = project.sequences;
			for(var e=0;e<sequences.length;e++){
				var sequenceNode = NodeFactory.createNode(sequences[e], view);
				sequenceNode.json = sequences[e];
				/* validate id */
				if(idExists(sequenceNode.id)){
					view.notificationManager.notify('Duplicate sequence id: ' + sequenceNode.id + ' found in project.', 3);
				};
				allSequenceNodes.push(sequenceNode);
			};
			
			/* get starting sequence */
			if(project.startPoint){
				var startingSequence = getNodeById(project.startPoint);
			} else {
				view.notificationManager.notify('No starting sequence specified for this project', 3);
			};
			
			/* validate that there are no loops before setting root node */
			if(startingSequence){
				for(var s=0;s<allSequenceNodes.length;s++){
					var stack = [];
					if(validateNoLoops(allSequenceNodes[s].id, stack, 'file')){
						//All OK, add children to sequence
						populateSequences(allSequenceNodes[s].id);
					} else {
						view.notificationManager.notify('Infinite loop discovered in sequences, check sequence references', 3);
						return null;
					};
				};
				rootNode = startingSequence;
			};
		};
		
		/* Returns true if a node of the given id already exists in this project, false otherwise */
		var idExists = function(id){
			return getNodeById(id);
		};
		
		/* Returns the node with the given id if the node exists, returns null otherwise. */
		var getNodeById = function(nodeId){
			for(var t=0;t<allLeafNodes.length;t++){
				if(allLeafNodes[t].id==nodeId){
					return allLeafNodes[t];
				};
			};
			for(var p=0;p<allSequenceNodes.length;p++){
				if(allSequenceNodes[p].id==nodeId){
					return allSequenceNodes[p];
				};
			};
			return null;
		};
		
		/* Returns the node at the given position in the project if it exists, returns null otherwise */
		var getNodeByPosition = function(position){
			if(position){
				var locs = position.split('.');
				var parent = rootNode;
				var current;
	
				/* cycle through locs, getting the children each cycle */
				for(var u=0;u<locs.length;u++){
					current = parent.children[locs[u]];
					
					/* if not current, then the position is off, return null */
					if(!current){
						return null;
					} else if(u==locs.length-1){
						/* if this is last location return current*/
						return current;
					} else {
						/* otherwise set parent = current for next cycle */
						parent = current;
					};
				};
			} else {
				return null;
			};
		};
		
		/* Given the filename, returns the url to retrieve the file */
		var makeUrl = function(filename){
			if (contentBaseUrl != null) {
				if(contentBaseUrl.lastIndexOf('\\')!=-1){
					return contentBaseUrl + '\\' + filename;
				} else {
					return contentBaseUrl + '/' + filename;
				};
			};
			return filename;
		};
		
		/*
		 * Given the sequence id, a stack and where search is run from, returns true if
		 * there are no infinite loops starting from given id, otherwise returns false.
		 */
		var validateNoLoops = function(id, stack, from){
			if(stack.indexOf(id)==-1){ //id not found in stack - continue checking
				var childrenIds = getChildrenSequenceIds(id, from);
				if(childrenIds.length>0){ //sequence has 1 or more sequences as children - continue checking
					stack.push(id);
					for(var b=0;b<childrenIds.length;b++){ // check children
						if(!validateNoLoops(childrenIds[b], stack)){
							return false; //found loop or duplicate id
						};
					};
					stack.pop(id); //children OK
					return true;
				} else { // no children ids to check - this is last sequence node so no loops or duplicates
					return true;
				};
			} else { //id found in stack, infinite loop or duplicate id
				return false;
			};
		};
		
		/* Given the a sequence Id, populates all of it's children nodes */
		var populateSequences = function(id){
			var sequence = getNodeById(id);
			var children = sequence.json.refs;
			for(var j=0;j<children.length;j++){
				/* validate node was defined and add it to sequence if it is */
				var childNode = getNodeById(children[j]);
				if(!childNode){
					view.notificationManager.notify('Node reference ' + children[j] + ' exists in sequence node ' + id + ' but the node has not been defined and does not exist.', 2);
				} else {
					sequence.addChildNode(childNode);
				};
			};
		};
		
		/* Given a sequence ID and location from (file or project), returns an array of ids for any children sequences */
		var getChildrenSequenceIds = function(id, from){
			var sequence = getNodeById(id);
			/* validate sequence reference */
			if(!sequence){
				view.notificationManager.notify('Sequence with id: ' + id + ' is referenced but this sequence does not exist.', 2);
				return [];
			};
			
			/* populate childrenIds */
			var childrenIds = [];
			if(from=='file'){
				/* get child references from content */
				var refs = sequence.json.refs;
				for(var e=0;e<refs.length;e++){
					childrenIds.push(refs[e]);
				};
			} else {
				/* get child references from sequence */
				var children = sequence.children;
				for(var e=0;e<children.length;e++){
					if(children[e].type=='sequence'){
						childrenIds.push(children[e].id);
					};
				};
			};
			
			return childrenIds;
		};
		
		/* Returns the node with the given title if the node exists, returns null otherwise. */
		var getNodeByTitle = function(title){
			for(var y=0;y<allLeafNodes.length;y++){
				if(allLeafNodes[y].title==title){
						return allLeafNodes[y];
				};
			};
			for(var u=0;u<allSequenceNodes.length;u++){
				if(allSequenceNodes[u].title==title){
					return allSequenceNodes[u];
				};
			};
			return null;
		};
		

		/* Helper function for getStartNodeId() */
		var getFirstNonSequenceNodeId = function(node){
			if(node){
				if(node.type=='sequence'){
					for(var y=0;y<node.children.length;y++){
						var id = getFirstNonSequenceNodeId(node.children[y]);
						if(id!=null){
							return id;
						};
					};
				} else {
					return node.id;
				};
			} else {
				view.notificationManager.notify('Cannot get start node! Possibly no start sequence is specified or invalid node exists in project.', 2);
			};
		};
		
		/* Removes all references of the node with the given id from sequences in this project */
		var removeAllNodeReferences = function(id){
			for(var w=0;w<allSequenceNodes.length;w++){
				for(var e=0;e<allSequenceNodes[w].children.length;e++){
					if(allSequenceNodes[w].children[e].id==id){
						allSequenceNodes[w].children.splice(e, 1);
					};
				};
			};
		};
		
		/* Recursively searches for first non sequence node and returns that path */
		var getPathToFirstNonSequenceNode = function(node, path){
			if(node.type=='sequence'){
				for(var y=0;y<node.children.length;y++){
					var pos = getPathToFirstNonSequenceNode(node.children[y], path + '.'  + y);
					if(pos!=undefined && pos!=null){
						return pos;
					};
				};
			} else {
				return path;
			};
		};
		
		/* Recursively searches for the given id from the point of the node down and returns the path. */
		var getPathToNode = function(node, path, id){
			if(node.id==id){
				return path;
			} else if(node.type=='sequence'){
				for(var e=0;e<node.children.length;e++){
					var pos = getPathToNode(node.children[e], path + '.' + e, id);
					if(pos){
						return pos;
					};
				};
			};
		};

		/**
		 * Prints summary report to firebug console of: All Sequences and
		 * Nodes defined for this project, Sequences defined but not used,
		 * Nodes defined but not used, Sequences used twice and Nodes used
		 * twice in this project.
		 */
		var printSummaryReportsToConsole = function(){
			printSequencesDefinedReport();
			printNodesDefinedReport();
			printUnusedSequencesReport();
			printUnusedNodesReport();
			printDuplicateSequencesReport();
			printDuplicateNodesReport();
		};
		
		/**
		 * Prints a report of all sequences defined for this project
		 * to the firebug console
		 */
		var printSequencesDefinedReport = function(){
			var outStr = 'Sequences defined by Id: ';
			for(var z=0;z<allSequenceNodes.length;z++){
				if(z==allSequenceNodes.length - 1){
					outStr += ' ' + allSequenceNodes[z].id;
				} else {
					outStr += ' ' + allSequenceNodes[z].id + ',';
				};
			};
			view.notificationManager.notify(outStr, 1);
		};

		/**
		 * Prints a report of all nodes defined for this project
		 * to the firebug console
		 */
		var printNodesDefinedReport = function(){
			var outStr = 'Nodes defined by Id: ';
			for(var x=0;x<allLeafNodes.length;x++){
				if(x==allLeafNodes.length -1){
					outStr += ' ' + allLeafNodes[x].id;
				} else {
					outStr += ' ' + allLeafNodes[x].id + ',';
				};
			};
			
			view.notificationManager.notify(outStr, 1);
		};

		/**
		 * Prints a report of all unused sequences for this project
		 * to the firebug console
		 */
		var printUnusedSequencesReport = function(){
			var outStr = 'Sequence(s) with id(s): ';
			var found = false;
			
			for(var v=0;v<allSequenceNodes.length;v++){
				if(!referenced(allSequenceNodes[v].id) && allSequenceNodes[v].id!=rootNode.id){
					found = true;
					outStr += ' ' + allSequenceNodes[v].id;
				};
			};
			
			if(found){
				view.notificationManager.notify(outStr + " is/are never used in this project", 1);
			};
		};

		/**
		 * Prints a report of all unused nodes for this project
		 * to the firebug console
		 */
		var printUnusedNodesReport = function(){
			var outStr = 'Node(s) with id(s): ';
			var found = false;
			
			for(var b=0;b<allLeafNodes.length;b++){
				if(!referenced(allLeafNodes[b].id)){
					found = true;
					outStr += ' ' + allLeafNodes[b].id;
				};
			};

			if(found){
				view.notificationManager.notify(outStr + " is/are never used in this project", 1);
			};
		};

		/**
		 * Prints a report of all duplicate sequence ids to the
		 * firebug console
		 */
		var printDuplicateSequencesReport = function(){
			var outStr = 'Duplicate sequence Id(s) are: ';
			var found = false;
			
			for(var n=0;n<allSequenceNodes.length;n++){
				var count = 0;
				for(var m=0;m<allSequenceNodes.length;m++){
					if(allSequenceNodes[n].id==allSequenceNodes[m].id){
						count ++;
					};
				};
				
				if(count>1){
					found = true;
					outStr += allSequenceNodes[n].id + ' ';
				};
			};
			
			if(found){
				view.notificationManager.notify(outStr, 1);
			};
		};

		/**
		 * Prints a report of all duplicate node ids to the
		 * firebug console
		 */
		var printDuplicateNodesReport = function(){
			var outStr =  'Duplicate node Id(s) are: ';
			var found = false;
			
			for(var n=0;n<allLeafNodes.length;n++){
				var count = 0;
				for(var m=0;m<allLeafNodes.length;m++){
					if(allLeafNodes[n].id==allLeafNodes[m].id){
						count ++;
					};
				};
				
				if(count>1){
					found = true;
					outStr += allLeafNodes[n].id + ' ';
				};
			};
			
			if(found){
				view.notificationManager.notify(outStr, 1);
			};
		};

		/**
		 * Returns true if the given id is referenced by any
		 * sequence in the project, otherwise, returns false
		 */
		var referenced = function(id){
			for(var c=0;c<allSequenceNodes.length;c++){
				for(var v=0;v<allSequenceNodes[c].children.length;v++){
					if(allSequenceNodes[c].children[v].id==id){
						return true;
					};
				};
			};
			return false;
		};

		/**
		 * Returns a list of the given type (node or seq) that are not a child of any
		 * sequence (defined but not attached in the project).
		 */
		var getUnattached = function(type){
			var list = [];
			
			if(type=='node'){//find unattached nodes
				var children = allLeafNodes;
			} else {//find unattached sequences
				var children = allSequenceNodes;
			};
			
			//if not referenced, add to list
			for(var x=0;x<children.length;x++){
				if(!referenced(children[x].id) && !(rootNode==children[x])){
					list.push(children[x]);
				};
			};
			
			//return list
			return list;
		};
		
		/**
		 * Obtain a string delimited by : of all the node ids in the project
		 * except for the nodes that have a node type in the nodeTypesToExclude
		 * @param nodeTypesToExclude a string delimited by : of node types that
		 * 		we do not want to be returned
		 * @return a string delimited by : of node ids in the project that
		 * 		have a node types that we want
		 */
		var getNodeIds = function(nodeTypesToExclude){
			var nodeIds = "";
			
			//loop through all the leaf nodes
			for(var x=0; x<allLeafNodes.length; x++) {
				//obtain a leaf node
				var leafNode = allLeafNodes[x];
				
				//obtain the node id and node type
				var nodeId = leafNode.id;
				var nodeType = leafNode.type;
				
				//check if the node type is in the list of node types to exclude
				if(nodeTypesToExclude.indexOf(nodeType) == -1) {
					/* the node type is not in the list to exclude which means we want this node */
					
					//check if we need to add a :
					if(nodeIds != "") {
						nodeIds += ":";
					}
					
					//add the node id
					nodeIds += nodeId;
				}
			}
			
			return nodeIds;
		};
		
		/**
		 * Obtain a string delimited by : of all the node types in the project
		 * except for the nodes that have a node type in the nodeTypesToExclude
		 * @param nodeTypesToExclude a string delimited by : of node types that
		 * 		we do not want to be returned
		 * @return a string delimited by : of node ids in the project that
		 * 		have node types that we want
		 */
		var getNodeTypes = function(nodeTypesToExclude){
			var nodeTypes = "";
			
			//loop through all the leaf nodes
			for(var x=0; x<allLeafNodes.length; x++) {
				//obtain a leaf node
				var leafNode = allLeafNodes[x];
				
				//obtain the node type
				var nodeType = leafNode.type;
				
				//check if the node type is in the list of node types to exclude
				if(nodeTypesToExclude.indexOf(nodeType) == -1) {
					/* the node type is not in the list to exclude which means we want this node */
					
					//check if we need to add a :
					if(nodeTypes != "") {
						nodeTypes += ":";
					}
					
					//add the node id
					nodeTypes += nodeType;
				}
			}
			
			return nodeTypes;
		};
		
		/* Returns html showing all students work so far */
		var getShowAllWorkHtml = function(node,showGrades){
			var htmlSoFar = "";
			if (node.children.length > 0) {
				// this is a sequence node
				for (var i = 0; i < node.children.length; i++) {
					htmlSoFar += getShowAllWorkHtml(node.children[i], showGrades);
				}
			} else {
				// this is a leaf node
			    htmlSoFar += "<div id=\"showallStep\"><a href=\"#\" onclick=\"view.renderNode('" + getPositionById(node.id) + "'); YAHOO.example.container.showallwork.hide();\">" + node.title + "</a><div class=\"type\">"+node.getType(true)+"</div></div>";
			    if (showGrades) {
					htmlSoFar += "<div class=\"showallStatus\">Status: " + node.getShowAllWorkHtml(view) + "</div>";
					htmlSoFar += "<div><table id='teacherTable'>";
					var annotationsForThisNode = view.annotations.getAnnotationsByNodeId(node.id);
					if (annotationsForThisNode.length > 0) {
						for (var i=0; i < annotationsForThisNode.length; i++) {
							var annotation = annotationsForThisNode[i];
							if (annotation.type == "comment") {
								htmlSoFar += "<tr><td class='teachermsg1'>TEACHER FEEDBACK: " + annotation.value + "</td></tr>";
							}
							if (annotation.type == "score") {
								htmlSoFar += "<tr><td class='teachermsg2'>TEACHER SCORE: " + annotation.value + "</td></tr>";
							}
						}
					} else {
						htmlSoFar += "<td class='teachermsg3'>" + "Grading: Your Teacher hasn't graded this step yet." + "<td>";
					}
					htmlSoFar += "</table></div>";
			    } else {
					htmlSoFar += node.getShowAllWorkHtml(view);
			    }
				htmlSoFar += "";
			}
			return htmlSoFar;
		};
		
		/* Removes the node of the given id from the project */
		var removeNodeById = function(id){
			for(var o=0;o<allSequenceNodes.length;o++){
				if(allSequenceNodes[o].id==id){
					allSequenceNodes.splice(o,1);
					removeAllNodeReferences(id);
					return;
				};
			};
			for(var q=0;q<allLeafNodes.length;q++){
				if(allLeafNodes[q].id==id){
					allLeafNodes.splice(q,1);
					removeAllNodeReferences(id);
					return;
				};
			};
		};
		
		/* Removes the node at the given location from the sequence with the given id */
		var removeReferenceFromSequence = function(seqId, location){
			var seq = getNodeById(seqId);
			seq.children.splice(location,1);
		};
		
		/* Adds the node with the given id to the sequence with the given id at the given location */
		var addNodeToSequence = function(nodeId,seqId,location){
			var addNode = getNodeById(nodeId);
			var sequence = getNodeById(seqId);
			
			sequence.children.splice(location, 0, addNode); //inserts
			
			/* check to see if this changes causes infinite loop, if it does, take it out and notify user */
			var stack = [];
			if(!validateNoLoops(seqId, stack)){
				view.notificationManager.notify('This would cause an infinite loop! Undoing changes...', 3);
				sequence.children.splice(location, 1);
			};
		};
		
		/* Returns an object representation of this project */
		var projectJSON = function(){
			/* create project object with variables from this project */
			var project = {
					autoStep: autoStep,
					stepLevelNum: stepLevelNumbering,
					stepTerm: stepTerm,
					title: title,
					nodes: [],
					sequences: [],
					startPoint: ""
			};
			
			/* set start point */
			if(rootNode){
				project.startPoint = rootNode.id;
			};
			
			/* set node objects for each node in this project */
			for(var k=0;k<allLeafNodes.length;k++){
				project.nodes.push(allLeafNodes[k].nodeJSON(contentBaseUrl));
			};
			
			/* set sequence objects for each sequence in this project */
			for(var j=0;j<allSequenceNodes.length;j++){
				project.sequences.push(allSequenceNodes[j].nodeJSON());
			};
			
			/* return the project object */
			return project;
		};
		
		/* Returns the absolute position to the first renderable node in the project if one exists, returns undefined otherwise. */
		var getStartNodePosition = function(){
			for(var d=0;d<rootNode.children.length;d++){
				var path = getPathToFirstNonSequenceNode(rootNode.children[d], d);
				if(path!=undefined && path!=null){
					return path;
				};
			};
		};
		
		/* Returns the first position that the node with the given id exists in. Returns null if no node with id exists. */
		var getPositionById = function(id){
			for(var d=0;d<rootNode.children.length;d++){
				var path = getPathToNode(rootNode.children[d], d, id);
				if(path!=undefined && path!=null){
					return path;
				};
			};
		};
		
		/* Returns the filename for this project */
		var getProjectFilename = function(){
			var url = content.getContentUrl();
			return url.substring(url.indexOf(contentBaseUrl) + contentBaseUrl.length + 1, url.length);
		};
		
		/* Returns the filename for the content of the node with the given id */
		var getNodeFilename = function(nodeId){
			var node = getNodeById(nodeId);
			if(node){
				return node.content.getFilename(contentBaseUrl);
			} else {
				return null;
			};
		};
		
		/* Given a base title, returns a unique title in this project*/
		var generateUniqueTitle = function(base){
			var count = 1;
			while(true){
				var newTitle = base + ' ' + count;
				if(!getNodeByTitle(newTitle)){
					return newTitle;
				};
				count ++;
			};
		};
		
		/* Given a base title, returns a unique id in this project*/
		var generateUniqueId = function(base){
			var count = 1;
			while(true){
				var newId = base + '_' + count;
				if((!getNodeById(newId)) && (copyIds.indexOf(newId)==-1)){
					return newId;
				};
				count ++;
			};
		};

		/* Copies the nodes of the given array of node ids and fires the event of the given eventName when complete */
		var copyNodes = function(nodeIds, eventName){
			/* listener that listens for the copying of all the nodes and launches the next copy when previous is completed. 
			 * When all have completed fires the event of the given eventName */
			var listener = function(type,args,obj){
				var nodeCopiedId = args[0];
				var copiedToId = args[1];
				var copyInfo = obj;
				
				/* remove first nodeInfo in queue */
				var currentInfo = copyInfo.queue.shift();
				
				/* ensure that nodeId from queue matches nodeCopiedId */
				if(currentInfo.id!=nodeCopiedId){
					copyInfo.view.notificationManager('Copied node id and node id from queue do match, error when copying.', 3);
				};
				
				/* add to msg and add copied node id to copyIds and add to list of copied ids*/
				if(!copiedToId){
					copyInfo.msg += ' Failed copy of ' + nodeCopiedId;
				} else {
					copyInfo.msg += ' Copied ' + nodeCopiedId + ' to ' + copiedToId;
					copyInfo.view.getProject().addCopyId(copiedToId);
					copyInfo.copiedIds.push(copiedToId);
				};
				
				/* check queue, if more nodes, launch next, if not fire event with message and copiedIds as arguments */
				if(copyInfo.queue.length>0){
					/* launch next from queue */
					var nextInfo = copyInfo.queue[0];
					nextInfo.node.copy(nextInfo.eventName);
				} else {
					/* fire completed event */
					copyInfo.view.eventManager.fire(copyInfo.eventName, [copyInfo.copiedIds, copyInfo.msg]);
				};
			};
			
			/* custom object that holds information for the listener when individual copy events complete */
			var copyInfo = {
				view:view,
				queue:[],
				eventName:eventName,
				msg:'',
				copiedIds:[]
			};
			
			/* setup events for all of the node ids */
			for(var q=0;q<nodeIds.length;q++){
				var name = generateUniqueCopyEventName();
				copyInfo.queue.push({id:nodeIds[q],node:getNodeById(nodeIds[q]),eventName:name});
				view.eventManager.addEvent(name);
				view.eventManager.subscribe(name, listener, copyInfo);
			};
			
			/* launch the first node to copy if any exist in queue, otherwise, fire the event immediately */
			if(copyInfo.queue.length>0){
				var firstInfo = copyInfo.queue[0];
				firstInfo.node.copy(firstInfo.eventName);
			} else {
				view.eventManager.fire(eventName, [null, null]);
			};
		};
		
		/* Generates and returns a unique event for copying nodes and sequences */
		var generateUniqueCopyEventName = function(){
			return view.eventManager.generateUniqueEventName('copy_');
		};
		
		/* Adds the given id to the array of ids for nodes that are copied */
		var addCopyId = function(id){
			copyIds.push(id);
		};
		
		/*
		 * Retrieves the question/prompt the student reads for the step
		 * 
		 * this.getProject().getNodeById(nodeId).content.getContentJSON().assessmentItem.interaction.prompt
		 * 
		 * @param nodeId the id of the node
		 * @return a string containing the prompt (the string may be an
		 * html string)
		 */
		var getNodePromptByNodeId = function(nodeId) {
			//get the node
			var node = getNodeById(nodeId);
			
			//get the content for the node
			var content = node.content;
			var contentJSON = content.getContentJSON();
			
			var prompt = null;
			
			//see if the node content has an assessmentItem
			if(contentJSON.assessmentItem != null) {
				//obtain the prompt
				var assessmentItem = contentJSON.assessmentItem;
				var interaction = assessmentItem.interaction;
				prompt = interaction.prompt;	
			}
			
			//return the prompt
			return prompt;
		};
		
		/* parse the project content and set available attributes to variables */
		var project = content.getContentJSON();
		if(project){
			/* set auto step */
			autoStep = project.autoStep;
			
			/* set step level numbering */
			stepLevelNumbering = project.stepLevelNum;
			
			/* set step term */
			stepTerm = project.stepTerm;
			
			/* set title */
			title = project.title;
			
			/* create nodes for project and set rootNode*/
			generateProjectNodes();
			generateSequences();
			
			/* generate reports for console */
			printSummaryReportsToConsole();
		} else {
			view.notificationManager.notify('Unable to parse project content, check project.json file. Unable to continue.', 5);
		};
		
		
		return {
			/* returns true when autoStep should be used, false otherwise */
			useAutoStep:function(){return autoStep;},
			/* sets autoStep to the given boolean value */
			setAutoStep:function(bool){autoStep = bool;},
			/* returns true when stepLevelNumbering should be used, false otherwise */
			useStepLevelNumbering:function(){return stepLevelNumbering;},
			/* sets stepLevelNumbering to the given boolean value */
			setStepLevelNumbering:function(bool){stepLevelNumbering = bool;},
			/* returns the step term to be used when displaying nodes in the navigation for this project */
			getStepTerm:function(){return stepTerm;},
			/* sets the step term to be used when displaying nodes in this project */
			setStepTerm:function(term){stepTerm = term;},
			/* returns the title of this project */
			getTitle:function(){return title;},
			/* sets the title of this project */
			setTitle:function(t){title = t;},
			/* returns the node with the given id if it exists, null otherwise */
			getNodeById:function(nodeId){return getNodeById(nodeId);},
			/* given a sequence id, empty stack, and location, returns true if any infinite loops
			 * are discovered, returns false otherwise */
			validateNoLoops:function(id, stack, from){return validateNoLoops(id,stack,from);},
			/* Returns the node with the given title if the node exists, returns null otherwise. */
			getNodeByTitle:function(title){return getNodeByTitle(title);},
			/* Returns the node at the given position in the project if it exists, returns null otherwise */
			getNodeByPosition:function(pos){return getNodeByPosition(pos);},
			/* Returns a : delimited string of all node ids of types that are not included in the provided nodeTypesToExclude */
			getNodeIds:function(nodeTypesToExclude){return getNodeIds(nodeTypesToExclude);},
			/* Returns a : delimited string of all node types except for those given in nodeTypesToExclude */
			getNodeTypes:function(nodeTypesToExclude){return getNodeTypes(nodeTypesToExclude);},
			/* Returns html showing all students work so far */
			getShowAllWorkHtml:function(node,showGrades){return getShowAllWorkHtml(node,showGrades);},
			/* Returns the first renderable node Id for this project */
			getStartNodeId:function(){return getFirstNonSequenceNodeId(rootNode);},
			/* Removes the node of the given id from the project */
			removeNodeById:function(id){removeNodeById(id);},
			/* Removes the node at the given location from the sequence with the given id */
			removeReferenceFromSequence:function(seqId, location){removeReferenceFromSequence(seqId, location);},
			/* Adds the node with the given id to the sequence with the given id at the given location */
			addNodeToSequence:function(nodeId, seqId, location){addNodeToSequence(nodeId,seqId,location);},
			/* Copies the nodes of the given array of node ids and fires the event of the given eventName when complete */
			copyNodes:function(nodeIds, eventName){copyNodes(nodeIds, eventName);},
			/* Returns the absolute position to the first renderable node in the project if one exists, returns undefined otherwise. */
			getStartNodePosition:function(){return getStartNodePosition();},
			/* Returns the first position that the node with the given id exists in. Returns null if no node with id exists. */
			getPositionById:function(id){return getPositionById(id);},
			/* Returns the content base url for this project */
			getContentBase:function(){return contentBaseUrl;},
			/* Returns the filename for this project */
			getProjectFilename:function(){return getProjectFilename();},
			/* Returns the full url for this project's content */
			getUrl:function(){return content.getContentUrl();},
			/* Returns the leaf nodes array of this project */
			getLeafNodes:function(){return allLeafNodes;},
			/* Returns the sequence nodes array of this project */
			getSequenceNodes:function(){return allSequenceNodes;},
			/* Returns the root node for this project */
			getRootNode:function(){return rootNode;},
			/* Returns an array of nodes of the given type that are not a child node to any other node */
			getUnattached:function(type){return getUnattached(type);},
			/* Returns the filename for the content of the node with the given id */
			getNodeFilename:function(nodeId){return getNodeFilename(nodeId);},
			/* Given a base title, returns a unique title in this project*/
			generateUniqueTitle:function(base){return generateUniqueTitle(base);},
			/* Given a base title, returns a unique id in this project*/
			generateUniqueId:function(base){return generateUniqueId(base);},
			/* Generates and returns a unique event for copying nodes and sequences */
			generateUniqueCopyEventName:function(){return generateUniqueCopyEventName();},
			/* Adds the given id to the array of ids for nodes that are copied */
			addCopyId:function(id){addCopyId(id);},
			/* Returns an object representation of this project */
			projectJSON:function(){return projectJSON();},
			/* Given the filename, returns the url to retrieve the file */
			makeUrl:function(filename){return makeUrl(filename);},
			/* Given the nodeId, returns the prompt for that step */
			getNodePromptByNodeId:function(nodeId){return getNodePromptByNodeId(nodeId);}
		};
	}(content, contentBaseUrl, lazyLoading, view);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/project/Project.js');
};
function NodeFactory(){
};

NodeFactory.createNode = function(jsonNode, view){
	var acceptedTagNames = new Array("node", "HtmlNode", "MultipleChoiceNode", "sequence", "FillinNode", "MatchSequenceNode", "NoteNode", "JournalEntryNode", "OutsideUrlNode", "BrainstormNode", "GlueNode", "OpenResponseNode", "FlashNode", "BlueJNode", "DataGraphNode", "DrawNode", "MySystemNode", "SVGDrawNode");
	
	if(jsonNode.type){
		var nodeName = jsonNode.type;
	} else {
		var nodeName = null;
	};
	if (acceptedTagNames.indexOf(nodeName) > -1) {
		if (nodeName == "HtmlNode") {
			return new HtmlNode("HtmlNode", view);
		} else if (nodeName == "MultipleChoiceNode"){
			return new MultipleChoiceNode("MultipleChoiceNode", view);
		} else if(nodeName == 'FillinNode'){
			return new FillinNode('FillinNode', view);
		} else if (nodeName == 'NoteNode'){
			return new NoteNode('NoteNode', view);
		} else if (nodeName == 'JournalEntryNode'){
			return new JournalEntryNode('JournalEntryNode', view);
		} else if (nodeName == 'MatchSequenceNode'){
			return new MatchSequenceNode('MatchSequenceNode', view);
		} else if (nodeName == 'OutsideUrlNode'){
			return new OutsideUrlNode('OutsideUrlNode', view);
		} else if (nodeName == 'BrainstormNode'){
			return new BrainstormNode('BrainstormNode', view);
		} else if (nodeName == 'FlashNode') {
			return new FlashNode('FlashNode', view);
		} else if (nodeName == 'GlueNode'){
			return new GlueNode('GlueNode', view);
		} else if (nodeName == 'OpenResponseNode'){
			return new OpenResponseNode('OpenResponseNode', view);
		} else if (nodeName == 'BlueJNode'){
			return new BlueJNode('BlueJNode', view);
		} else if (nodeName == 'DataGraphNode'){
			return new DataGraphNode('DataGraphNode', view);
		} else if (nodeName == 'DrawNode') {
			return new DrawNode('DrawNode', view);
		} else if (nodeName == 'MySystemNode') {
			return new MySystemNode('MySystemNode', view);
		} else if (nodeName == 'SVGDrawNode') {
			return new SVGDrawNode('SVGDrawNode', view);
		} else if (nodeName == "sequence") {
			var sequenceNode = new Node("sequence", view);
			sequenceNode.id = jsonNode.identifier;
			sequenceNode.title = jsonNode.title;
			return sequenceNode;
		} else {
			return new Node(null, view);
		};
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/nodefactory.js');
};
/* Node */
function Node(nodeType, view){
	this.id;
	this.parent;
	this.children = [];
	this.type = nodeType;
	this.title;
	this.className;
	this.content;
	this.contentPanel;
	this.baseHtmlContent;
	
	this.prevWorkNodeIds = [];
	this.extraData;
	this.view = view;
};

Node.prototype.getNodeId = function() {
	return this.id;
};

Node.prototype.getTitle = function() {
	if (this.title != null) {
		return this.title;
	};
	
	return this.id;
};

/**
 * @return this node's content object
 */
Node.prototype.getContent = function(){
	return this.content;
};

/**
 * Sets this node's content object
 * @param content
 */
Node.prototype.setContent = function(content){
	this.content = content;
};

/**
 * returns this node's type. if humanReadable=true, return in human-readable format
 * e.g. HtmlNode=>{Display, Evidence}, NoteNode=>Note, etc.
 * If type is not defined, return an empty string.
 * @param humanReadable
 * @return
 */
Node.prototype.getType = function(humanReadable) {
	if (this.type) {
		if (!humanReadable) {
			return this.type;
		} else {
			// first get rid of the "Node" in the end of the type
			if (this.type.lastIndexOf("Node") > -1) {
				return this.type.substring(0, this.type.lastIndexOf("Node"));
			} else {
				return this.type;
			};
		};
	} else {
		return "";
	};
};

Node.prototype.addChildNode = function(childNode) {
	this.children.push(childNode);
	childNode.parent = this;
};

Node.prototype.getNodeById = function(nodeId) {
	if (this.id == nodeId) {
		return this;
	} else if (this.children.length == 0) {
		return null;
	} else {
		var soFar = false;
		for (var i=0; i < this.children.length; i++) {
			soFar = soFar || this.children[i].getNodeById(nodeId);
		};
		return soFar;
	};
};

//alerts vital information about this node
Node.prototype.alertNodeInfo = function(where) {
	notificationManager.notify('node.js, ' + where + '\nthis.id:' + this.id 
			+ '\nthis.title:' + this.title, 3);
};

/**
 * Renders itself to the specified content panel
 */
Node.prototype.render = function(contentPanel, studentWork) {
	this.studentWork = studentWork;
	this.contentPanel = contentPanel;
	
	/* if no content panel specified use default */
	if(contentPanel){
		/* make sure we use frame window and not frame element */
		this.contentPanel = window.frames[contentPanel.name];
		//this.contentPanel = contentPanel;
	} else if(contentPanel == null) {
		/* use default ifrm */
		if(this.type == 'NoteNode') {
			this.contentPanel = window.frames['noteiframe' + this.id];
			document['notePanel_' + this.id].cfg.setProperty('visible', true);
		} else {
			this.contentPanel = window.frames['ifrm'];			
		}
	};

	/* 
	 * if node is not self rendering which means it is a node that
	 * requires an html file and a content file
	 */
	if(SELF_RENDERING_NODES.indexOf(this.type)==-1){
		/* check to see if this contentpanel has already been rendered */
		if(this.contentPanel.nodeId!=this.id){
			/* render page html */
			var pageHtml = HTML_MAP[this.type];
			
			/* if this is brainstorm node, get sub-html page */
			if(this.type=='BrainstormNode'){
				if(this.isUsingServer()){
					pageHtml = pageHtml['server'];
				} else {
					pageHtml = pageHtml['serverless'];
				};
			};
			
			this.baseHtmlContent = createContent(pageHtml);
			/* make nodeId available to the content panel, and hence, the html */
			this.contentPanel.nodeId = this.id;
			
			/* inject urls and write html to content panel */
			this.contentPanel.document.open();
			this.contentPanel.document.write(this.injectBaseRef(this.view.injectVleUrl(this.baseHtmlContent.getContentString())));
			this.contentPanel.document.close();
		} else {
			/* already rendered, just load content */
			this.contentPanel.loadContentAfterScriptsLoad(this);
		};
	} else {
		/* if baseHtmlContent has not already been created, create it now */
		if(!this.baseHtmlContent){
			this.baseHtmlContent = createContent(this.view.getProject().makeUrl(this.content.getContentJSON().src));
			
			/* change filename url for the modules if this is a MySystemNode */
			if(this.type == 'MySystemNode'){
				this.baseHtmlContent.setContent(this.updateJSONContentPath(this.view.getConfig().getConfigParam('getContentBaseUrl'), this.baseHtmlContent.getContentString()));
			};
		};
		
		/*check if the user had clicked on an outside link in the previous step
		 */
		if(this.handlePreviousOutsideLink(this)) {
			/*
			 * the user was at an outside link so the function
			 * handlePreviousOutsideLink() has taken care of the
			 * rendering of this node
			 */
			return;
		};
		
		//write the content into the contentPanel, this will render the html in that panel
		this.contentPanel.document.open();
		this.contentPanel.document.write(this.injectBaseRef(this.baseHtmlContent.getContentString()));
		this.contentPanel.document.close();
		
		this.view.eventManager.fire('contentRenderComplete', this.id);
	};
	
	if(this.contentPanel != null) {
		//set the event manager into the content panel so the html has access to it
		this.contentPanel.eventManager = eventManager;
		this.contentPanel.nodeId = this.id;
		this.contentPanel.scriptloader = this.view.scriptloader;
		this.contentPanel.yui = yui;
		
		if(this.type == 'MySystemNode' || this.type == 'SVGDrawNode') {
			this.contentPanel.vle = this.view;
		};
	};
	
	/* if this is a blueJ step and the student work component is loaded, post current step */
	if(this.content.getContentJSON().blueJProjectPath && this.content.getContentJSON().blueJProjectPath!='' && this.view.postCurrentStep){
		this.extraData = this.content.getContentJSON.blueJProjectPath;
		this.view.postCurrentStep(this);
	};
};

/**
 * Listens for page rendered event: the html has been fully loaded
 * and the event is fired from the page's window.onload function.
 */
Node.prototype.pageRenderComplete = function(type, args, obj){
	/* args[0] is the id of node's page that has been rendered */
	if(obj.id==args[0]){
		obj.contentPanel.loadContent(obj);
		obj.insertPreviousWorkIntoPage(obj.contentPanel.document);
	};
};

Node.prototype.loadContentAfterScriptsLoad = function(type, args, obj){
	if(obj.id==args[0]) {
		obj.contentPanel.loadContentAfterScriptsLoad(obj);		
	}
};

/**
 * Listens for page content rendered complete event: the html has
 * been fully loaded as has the content and the event is fired from
 * the html's load content function.
 */
Node.prototype.contentRenderComplete = function(type, args, obj){
	/* args[0] is the id of node's page that has been rendered */
};

/**
 * This is called when a node is exited
 */
Node.prototype.onExit = function() {
	//this function should be overriden by child classes
};

/**
 * Get the view style if the node is a sequence. If this node
 * is a sequence and no view style is defined, the default will
 * be the 'normal' view style.
 * @return the view style of the sequence or null if this
 * 		node is not a sequence
 */
Node.prototype.getView = function() {
	/*
	 * check that this node is a sequence.
	 */
	if(this.isSequence()) {
		if(this.json.view == null) {
			//return the default view style if none was specified
			return 'normal';
		} else {
			//return the view style for the sequence
			return this.json.view;
		}
	} else {
		//this node is not a sequence so we will return null
		return null;
	}
};

/**
 * Returns whether this node is a sequence node.
 */
Node.prototype.isSequence = function() {
	return this.type == 'sequence';
};

/**
 * Returns the appropriate object representation of this node
 */
Node.prototype.nodeJSON = function(contentBase){
	if(this.type=='sequence'){
		/* create and return sequence object */
		var sequence = {
			type:'sequence',
			identifier:makeHtmlSafe(this.id),
			title:makeHtmlSafe(this.title),
			view:this.getView(),
			refs:[]
		};
		
		/* add children ids to refs */
		for(var l=0;l<this.children.length;l++){
			sequence.refs.push(this.children[l].id);
		};
		
		return sequence;
	} else {
		/* create and return node object */
		var node = {
			type:this.type,
			identifier:makeHtmlSafe(this.id),
			title:makeHtmlSafe(this.title),
			ref:this.content.getFilename(contentBase),
			previousWorkNodeIds:this.prevWorkNodeIds
		};
		
		/* set class */
		node['class'] = this.className;
		
		return node;
	}
};

/**
 * This function is for displaying student work in the ticker.
 * All node types that don't implement this method will inherit
 * this function that just returns null. If null is returned from
 * this method, the ticker will just skip over the node when
 * displaying student data in the ticker.
 */
Node.prototype.getLatestWork = function(vle, dataId) {
	return null;
};

/**
 * Translates students work into human readable form. Some nodes,
 * such as mc and mccb require translation from identifiers to 
 * values, while other nodes do not. Each node will implement
 * their own translateStudentWork() function and perform translation
 * if necessary. This is just a dummy parent implementation.
 * @param studentWork the student's work, could be a string or array
 * @return a string of the student's work in human readable form.
 */
Node.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * Injects base ref in the head of the html if base-ref is not found, and returns the result
 * @param content
 * @return
 */
Node.prototype.injectBaseRef = function(content) {
	if (content.search(/<base/i) > -1) {
		// no injection needed because base is already in the html
		return content;
	} else {		
		//get the content base url
		var contentBaseUrl = this.view.getConfig().getConfigParam('getContentBaseUrl');

		//create the base tag
		var baseRefTag = "<base href='" + contentBaseUrl + "'/>";

		//insert the base tag at the beginning of the head
		var newContent = content.replace("<head>", "<head>" + baseRefTag);
		
		//return the updated content
		return newContent;
	}
};

/**
 * Returns whether this node is a leaf node
 */
Node.prototype.isLeafNode = function() {
	return this.type != 'sequence';
};

/**
 * For each state in the given nodeStates, creates an xml state tag
 * with the corresponding data within that tag and returns a string
 * of all the state tags. Returns an empty string if nodeStates is of
 * 0 length.
 * 
 * @param nodeStates
 * @return xml string of states
 */
Node.prototype.getDataXML = function(nodeStates){
	var dataXML = "";
	for (var i=0; i < nodeStates.length; i++) {
		var state = nodeStates[i];
		dataXML += "<state>" + state.getDataXML() + "</state>";
	}
	return dataXML;
};

/**
 * Converts an xml object of a node and makes a real Node object
 * @param nodeXML an xml object of a node
 * @return a real Node object depending on the type specified in
 * 		the xml object
 */
Node.prototype.parseDataXML = function(nodeXML){
	var nodeType = nodeXML.getElementsByTagName("type")[0].textContent;
	var id = nodeXML.getElementsByTagName("id")[0].textContent;

	//create the correct type of node
	var nodeObject = NodeFactory.createNode(nodeType);
	nodeObject.id = id;
	return nodeObject;
};

/**
 * This handles the case when the previous step has an outside link and 
 * the student clicks on it to load a page from a different host within
 * the vle. Then the student clicks on the next step in the vle. This
 * caused a problem before because the iframe would contain a page
 * from a different host and we would no longer be able to call functions
 * from it.
 * @param thisObj the node object we are navigating to
 * @param thisContentPanel the content panel to load the content into
 * 		this may be null
 * @return true if the student was at an outside link, false otherwise
 */
Node.prototype.handlePreviousOutsideLink = function(thisObj, thisContentPanel) {
	//check for ifrm to see if this is running from vle.html or someplace
	//other (such as authoring tool which does not have ifrm).
	if(!window.frames['ifrm']){
		return false;
	} else {
		try {
			/*
			 * try to access the host attribute of the ifrm, if the content
			 * loaded in the ifrm is in our domain it will not complain,
			 * but if the content is from another domain it will throw an
			 * error 
			 */
			window.frames["ifrm"].host;
		} catch(err) {
			//content was from another domain
			
			/*
			 * call back() to navigate back to the htmlnode page that contained
			 * the link the student clicked on to access an outside page
			 */
			history.back();
			
			//call render to render the node we want to navigate to
			setTimeout(function() {thisObj.render(thisContentPanel)}, 500);
			
			/*
			 * tell the caller the student was at an outside link so
			 * they don't need to call render()
			 */
			return true;
		}
		
		//tell the caller the student was not at an outside link
		return false;
	};
};

/**
 * If this node has previous work nodes, grabs the latest student
 * data from that node and inserts it into this nodes page
 * for each referenced node id. Assumes that the html is already loaded
 * and has a div element with id of 'previousWorkDiv'.
 * 
 * @param doc
 */
Node.prototype.insertPreviousWorkIntoPage = function(doc){
	//only do anything if there is anything to do
	if(this.prevWorkNodeIds.length>0){
		var html = '';
		
		//loop through and add any previous work to html
		for(var n=0;n<this.prevWorkNodeIds.length;n++){
			var work = vle.getLatestWorkByNodeId(this.prevWorkNodeIds[n]);
			if(work){
				var node = vle.project.getNodeById(this.prevWorkNodeIds[n]);
				html += 'Remember, your response to step ' + node.title + ' was: ' + work.getStudentWork() + '</br></br>';
			};
		};
		
		//add reminders to this node's html if div exists
		var prevWorkDiv = doc.getElementById('previousWorkDiv');
		if(prevWorkDiv){
			prevWorkDiv.innerHTML = html;
		};
	};
};

/**
 * Given the full @param path to the project (including project filename), duplicates 
 * this node and updates project file on server. Upon successful completion, runs the 
 * given function @param done and notifies the user if the given @param silent is not true.
 * 
 * NOTE: It is up to the caller of this function to refresh the project after copying.
 * 
 * @param done - a callback function
 * @param silent - boolean, does not notify when complete if true
 * @param path - full project path including project filename
 */
Node.prototype.copy = function(eventName, project){
	/* success callback */
	var successCreateCallback = function(text,xml,o){
		/* fire event with arguments: event name, [initial node id, copied node id] */
		o[0].view.eventManager.fire(o[1],[o[0].id,text]);
	};
	
	/* failure callback */
	var failureCreateCallback = function(obj, o){
		/* fire event with initial node id as argument so that listener knows that copy failed */
		o[0].view.eventManager.fire(o[1],o[0].id);
	};
	
	if(this.type!='sequence'){
		/* copy node section */
		var project = this.view.getProject();
		var data = this.content.getContentString();
		if(this.type=='HtmlNode' || this.type=='DrawNode' || this.type=='MySystemNode'){
			var contentFile = this.content.getContentJSON().src;
		} else {
			var contentFile = '';
		};
		
		if(this.type=='MySystemNode'){
			this.view.notificationManager.notify('My System Nodes cannot be copied, ignoring', 3);
			this.view.eventManager.fire(eventName,[this.id, null]);
			return;
		};
		
		this.view.connectionManager.request('POST', 1, 'filemanager.html', {command:'copyNode', param1: this.view.utils.getContentPath(this.view.authoringBaseUrl,project.getUrl()), param2: this.content.getContentString(), param3: this.type, param4: project.generateUniqueTitle(this.title), param5: this.className, param6: contentFile}, successCreateCallback, [this,eventName], failureCreateCallback)
	} else {
		/* copy sequence section */
		
		/* listener that listens for the event when all of its children have finished copying 
		 * then copies itself and finally fires the event to let other listeners know that it
		 * has finished copying */
		var listener = function(type,args,obj){
			if(args[0]){
				var idList = args[0];
			} else {
				var idList = [];
			};
			
			if(args[1]){
				var  msg = args[1];
			} else {
				var msg = '';
			};
			
			var node = obj[0];
			var eventName = obj[1];
			var project = node.view.getProject();
			
			var seqJSON = {
				type:'sequence',
				identifier: project.generateUniqueId(node.id),
				title: project.generateUniqueTitle(node.title),
				view: node.getView(),
				refs:idList
			};
			
			node.view.connectionManager.request('POST', 1, 'filemanager.html', {command: 'createSequenceFromJSON', param1: node.view.utils.getContentPath(node.view.authoringBaseUrl,node.view.getProject().getUrl()), param2: yui.JSON.stringify(seqJSON)}, successCreateCallback, [node,eventName], failureCreateCallback);
		};
		
		/* set up event to listen for when this sequences children finish copying */
		var seqEventName = this.view.project.generateUniqueCopyEventName();
		this.view.eventManager.addEvent(seqEventName);
		this.view.eventManager.subscribe(seqEventName, listener, [this, eventName]);
		
		/* collect children ids in an array */
		var childIds = [];
		for(var w=0;w<this.children.length;w++){
			childIds.push(this.children[w].id);
		};
		
		/* process by passing childIds and created event name to copy in project */
		this.view.getProject().copyNodes(childIds, seqEventName);
	};
};

Node.prototype.getShowAllWorkHtml = function(vle){
	var showAllWorkHtmlSoFar = "";
    var nodeVisitArray = vle.state.getNodeVisitsByNodeId(this.id);
    if (nodeVisitArray.length > 0) {
        var states = [];
        var latestNodeVisit = nodeVisitArray[nodeVisitArray.length -1];
        for (var i = 0; i < nodeVisitArray.length; i++) {
            var nodeVisit = nodeVisitArray[i];
            for (var j = 0; j < nodeVisit.nodeStates.length; j++) {
                states.push(nodeVisit.nodeStates[j]);
            }
        }
        var latestState = states[states.length - 1];
        showAllWorkHtmlSoFar += "Last visited on ";
        
        if(latestNodeVisit!=null){
        	showAllWorkHtmlSoFar += "" + new Date(parseInt(latestNodeVisit.visitStartTime)).toLocaleString();
        	
        };
        
        if(latestState!=null){
        	showAllWorkHtmlSoFar += '<div class=\"showallLatest\">Latest Work:' + '</div>' + '<div class=\"showallLatestWork\">' + this.translateStudentWork(latestState.getStudentWork()) + '</div>';
        };
    }
    else {
        showAllWorkHtmlSoFar += "Step not visited yet.";
    }
    
    for (var i = 0; i < this.children.length; i++) {
        showAllWorkHtmlSoFar += this.children[i].getShowAllWorkHtml();
    }
    return showAllWorkHtmlSoFar;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/Node.js');
};
/**
 * An OpenResponseNode is a representation of an OpenResponse assessment item
 *
 */

OpenResponseNode.prototype = new Node();
OpenResponseNode.prototype.constructor = OpenResponseNode;
OpenResponseNode.prototype.parent = Node.prototype;
function OpenResponseNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
};

OpenResponseNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, orNode){			
			orNode.contentPanel.document.open();
			orNode.contentPanel.document.write(orNode.injectBaseRef(injectVleUrl(text)));
			orNode.contentPanel.document.close();
			if(orNode.contentPanel.name!='ifrm'){
				orNode.contentPanel.renderComplete = function(){
					orNode.load();
				};
			};
			orNode.contentPanel.renderLoadComplete = function(){
				orNode.onNodefullyloaded();
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/openresponse/openresponse.html', null,  renderAfterGet, this);	
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

OpenResponseNode.prototype.load = function() {
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.getNodeId() == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			}
		}
	}
	
	if(this.contentPanel && this.contentPanel.loadContent) {
		this.contentPanel.loadContent([this.element, vle, states]);
	}
	if(this.contentPanel) {
		this.insertPreviousWorkIntoPage(this.contentPanel.document);		
	}
};

/**
 * Renders barebones open response
 */
OpenResponseNode.prototype.renderLite = function(state){
	if(this.filename!=null && vle.project.lazyLoading){ //load element from file
		this.retrieveFile();
	};
	
	if(state){
		this.liteState = state;
	};
	
	var callbackFun = function(text, xml, orNode){
		orNode.contentPanel.document.open();
		orNode.contentPanel.document.write(orNode.injectBaseRef(injectVleUrl(text)));
		orNode.contentPanel.document.close();
		orNode.contentPanel.renderComplete = function(){
			orNode.loadLite();			
		};
	};
	
	var callback = {
		success: function(o){callbackFun(o.responseText, o.responseXML, o.argument);},
		failure: function(o){this.view.notificationManager.notify('failed to retrieve file', 3);},
		argument: this
	};
	
	YAHOO.util.Connect.asyncRequest('GET', 'node/openresponse/openresponselite.html', callback, null);
};

/**
 * Loads barebones open response
 */
OpenResponseNode.prototype.loadLite = function(){
	if(this.contentPanel && this.contentPanel.loadContent) {
		this.contentPanel.loadContent([this.element, this, vle, this.liteState]);		
	}
};


OpenResponseNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		statesArrayObject.push(OPENRESPONSESTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}

OpenResponseNode.prototype.getDataXML = function(nodeStates) {
	return OpenResponseNode.prototype.parent.getDataXML(nodeStates);
};

/**
 * Takes in a state JSON object and returns an OPENRESPONSESTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an OPENRESPONSESTATE object
 */
OpenResponseNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return OPENRESPONSESTATE.prototype.parseDataJSONObj(stateJSONObj);
}

OpenResponseNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

/**
 * Given an xmlDoc of state information, returns a new state
 * @param stateXML
 * @return
 */
OpenResponseNode.prototype.parseStateXML = function(stateXML){
	return OPENRESPONSESTATE.prototype.parseDataXML(stateXML);
};

/**
 * Called when the step is exited. This is used for auto-saving.
 */
OpenResponseNode.prototype.onExit = function() {
	//check if the content panel exists
	if(this.contentPanel && this.contentPanel.save) {
		//tell the content panel to save
		this.contentPanel.save();
	}
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/OpenResponseNode.js');
};
/*
 * HtmlNode
 */

HtmlNode.prototype = new Node();
HtmlNode.prototype.constructor = HtmlNode;
HtmlNode.prototype.parent = Node.prototype;
function HtmlNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
}

HtmlNode.prototype.setHtmlContent = function(htmlContent) {
	//update the htmlContent attribute that contains the html
	this.content.setContent(htmlContent);
};

HtmlNode.prototype.load = function() {
	this.prepareAudio();
	if (vle.audioManager != null) {
		vle.audioManager.setCurrentNode(this);
	}
};

/**
 * Lite rendering of html node for glue-type nodes
 */
HtmlNode.prototype.renderLite = function(frame){
	if(this.filename!=null && vle.project.lazyLoading){
		this.retrieveFile();
	};
};

/**
 * Lite loading of html node for glue-type nodes
 */
HtmlNode.prototype.loadLite = function(frame){
	if(!this.elementText){
		if(!this.htmlContent){
			this.elementText = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
			this.htmlContent = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
		} else {
			this.elementText = this.htmlContent;
		};
	};
	
	window.frames['ifrm'].frames[frame].document.open();
	window.frames['ifrm'].frames[frame].document.write(this.injectBaseRef(this.elementText));
	window.frames['ifrm'].frames[frame].document.close();
	
	//inject necessary glue functions into html document
	window.frames['ifrm'].frames[frame].getAnswered = function(){return true;};
	window.frames['ifrm'].frames[frame].checkAnswerLite = function(){return 'visited html: ' + this.id};
};


/**
 * Gets the data xml format of the student data associated with this
 * step.
 * @param nodeStates an array of node states
 * @return an xml string containing the student work
 */
HtmlNode.prototype.getDataXML = function(nodeStates) {
	return HtmlNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * Creates an array of states from an xml object
 * @param nodeStatesXML an xml object that may contain multiple states
 * @return an array of state objects
 */
HtmlNode.prototype.parseDataXML = function(nodeStatesXML) {
	//obtain all the state xml elements
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	
	//the array to store the state objects
	var statesArrayObject = new Array();
	
	//loop through the state xml elements
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an HTMLSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(HTMLSTATE.prototype.parseDataXML(stateXML));
	}
	return statesArrayObject;
}

/**
 * Takes in a state JSON object and returns an HTMLSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an HTMLSTATE object
 */
HtmlNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return HTMLSTATE.prototype.parseDataJSONObj(stateJSONObj);
}


HtmlNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<content><![CDATA[";
	exportXML += this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	exportXML += "]]></content>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

HtmlNode.prototype.doNothing = function() {
	window.frames["ifrm"].document.open();
	window.frames["ifrm"].document.write(this.injectBaseRef(this.elementText));
	window.frames["ifrm"].document.close();
}

/**
 * This is called when the node is exited
 * @return
 */
HtmlNode.prototype.onExit = function() {
	//check if the content panel has been set
	if(this.contentPanel) {
		try {
			/*
			 * check if the onExit function has been implemented or if we
			 * can access attributes of this.contentPanel. if the user
			 * is currently at an outside link, this.contentPanel.onExit
			 * will throw an exception because we aren't permitted
			 * to access attributes of pages outside the context of our
			 * server.
			 */
			if(this.contentPanel.onExit) {
				try {
					//run the on exit cleanup
					this.contentPanel.onExit();					
				} catch(err) {
					//error when onExit() was called, e.g. mysystem editor undefined
				}
			}	
		} catch(err) {
			/*
			 * an exception was thrown because this.contentPanel is an
			 * outside link. we will need to go back in the history
			 * and then trying to render the original node.
			 */
			history.back();
			//setTimeout(function() {thisObj.render(this.ContentPanel)}, 500);
		}
	}
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/HtmlNode.js');
};

DrawNode.prototype = new HtmlNode();
DrawNode.prototype.constructor = DrawNode;
DrawNode.prototype.parent = HtmlNode.prototype;
function DrawNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/DrawNode.js');
};

MySystemNode.prototype = new HtmlNode();
MySystemNode.prototype.constructor = MySystemNode;
MySystemNode.prototype.parent = HtmlNode.prototype;
function MySystemNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
};

MySystemNode.prototype.updateJSONContentPath = function(base, contentString){
	this.filename = "modules.json";
	var rExp = new RegExp(this.filename);
	var contentString = contentString.replace(rExp, base + '/' + this.filename);
	return contentString;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/MySystemNode.js');
};
/*
 * MatchSequenceNode
 */

MatchSequenceNode.prototype = new Node();
MatchSequenceNode.prototype.constructor = MatchSequenceNode;
MatchSequenceNode.prototype.parent = Node.prototype;
function MatchSequenceNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

MatchSequenceNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, msNode){			
			msNode.contentPanel.document.open();
			msNode.contentPanel.document.write(msNode.injectBaseRef(injectVleUrl(text)));
			msNode.contentPanel.document.close();
			if(msNode.contentPanel.name!='ifrm'){
				msNode.contentPanel.renderComplete = function(){
					msNode.load();
				};
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/matchsequence/matchsequence.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};


MatchSequenceNode.prototype.load = function() {
	var xmlCustomCheck = this.element.getElementsByTagName("customCheck");
	if(xmlCustomCheck[0]!=null){
		xmlCustomCheck = xmlCustomCheck[0].firstChild.nodeValue;
	} else {
		xmlCustomCheck = null;
	};
	
	this.contentPanel.loadContent(this.getXMLString(), xmlCustomCheck);
	this.insertPreviousWorkIntoPage(this.contentPanel.document);
};

MatchSequenceNode.prototype.getDataXML = function(nodeStates) {
	return MatchSequenceNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
MatchSequenceNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MSSTATE object and put it into the array that we will return
		 */
		var stateObject = MSSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		}
	}
	
	return statesArrayObject;
}

MatchSequenceNode.prototype.onExit = function() {
	
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/MatchSequenceNode.js');
};
/*
 * FillinNode
 */

FillinNode.prototype = new Node();
FillinNode.prototype.constructor = FillinNode;
FillinNode.prototype.parent = Node.prototype;
function FillinNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
}

FillinNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, fiNode){
			if(fiNode.filename!=null && vle.project.lazyLoading){ //load element from file
				fiNode.retrieveFile();
			};
			
			fiNode.contentPanel.document.open();
			fiNode.contentPanel.document.write(fiNode.injectBaseRef(injectVleUrl(text)));
			fiNode.contentPanel.document.close();
			
			if(fiNode.contentPanel.name!='ifrm'){
				fiNode.contentPanel.renderComplete = function(){
					fiNode.load();
				};
			};
		};
		
		/*
		 * check if the user had clicked on an outside link in the previous
		 * step
		 */
		if(this.handlePreviousOutsideLink(this)) {
			/*
			 * the user was at an outside link so the function
			 * handlePreviousOutsideLink() has taken care of the
			 * rendering of this node
			 */
			return;
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/fillin/fillin.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

FillinNode.prototype.load = function() {
	var load = function(event, args, fiNode){
		if(!fiNode){//Firefox only passes the obj
			fiNode = event;
		};
		
		fiNode.contentPanel.loadContent([fiNode.element, vle]);
		fiNode.insertPreviousWorkIntoPage(fiNode.contentPanel.document);
	};
	
	if(this.contentLoaded){
		load(this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, load, this);
	};
};

FillinNode.prototype.getDataXML = function(nodeStates) {
	return FillinNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
FillinNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an FILLINSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(FILLINSTATE.prototype.parseDataXML(stateXML));
	}
	
	return statesArrayObject;
}

/**
 * Takes in a state JSON object and returns a FILLINSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a FILLINSTATE object
 */
FillinNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return FILLINSTATE.prototype.parseDataJSONObj(stateJSONObj);
}

FillinNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

FillinNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/FillinNode.js');
};
/*
 * FlashNode
 * interfaces VLE and Flash via javascript
 * Flash can invoke javascript and javascript can invoke Flash via specific interfaces
 * see here for interface API: link_goes_here
 */

FlashNode.prototype = new Node();
FlashNode.prototype.constructor = FlashNode;
FlashNode.prototype.parent = Node.prototype;
function FlashNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
}

FlashNode.prototype.setContent = function(content) {
	//update the content attribute that contains the html
	this.content = content;
}


FlashNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if (this.elementText != null) {
		this.content = this.elementText;
	} else if (this.filename != null) {
		if(window.ActiveXObject) {
			this.content = this.element.xml;
		} else {
			this.content = (new XMLSerializer()).serializeToString(this.element);
		};
	} else if(this.content == null) {
		this.content = this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	};
	
	if(contentPanel == null) {
		this.contentPanel = window.frames["ifrm"];
	} else {
		this.contentPanel = window.frames[contentPanel.name];
	};
	
	if (this.contentPanel.document) {
		this.writeHTML(this.contentPanel.document);
	} else {
		this.writeHTML(window.frames["ifrm"].document);
	};
};

FlashNode.prototype.writeHTML = function(doc){
	this.replaceVars(doc);
	doc.open();
	doc.write(this.content);
	doc.close();
};

FlashNode.prototype.replaceVars = function(){
	var objSrchStrStart = '<param name="movie" value="';
	var objSrchStrEnd = '"/>';
	var base = vle.project.contentBaseUrl;
	if(base){
		base = base + '/';
	} else {
		base = "";
	};
	
	var obs = this.content.match(/<object.*>(.|\n|\r)*<\/object.*>/i);
	for(var z=0;z<obs.length;z++){
		if(obs[z] && obs[z]!="" && obs[z]!='\n' && obs[z]!='\r' && obs[z]!='\t' && obs[z]!= " "){
			var startIndex = obs[z].indexOf(objSrchStrStart) + objSrchStrStart.length;
			var endIndex = obs[z].indexOf('"', startIndex);
			var filename = obs[z].substring(startIndex, endIndex);
			var exp = new RegExp(filename, 'g');
			this.content = this.content.replace(exp, base + filename);
		};
	};
};

FlashNode.prototype.load = function() {
	this.createFlashJSInterface();
		
	document.getElementById('topStepTitle').innerHTML = this.title;
};

FlashNode.prototype.getDataXML = function(nodeStates) {
	return "";
}

FlashNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesArrayObject = new Array();
	return statesArrayObject;
}


FlashNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<content><![CDATA[";
	exportXML += this.element.getElementsByTagName("content")[0].firstChild.nodeValue;
	exportXML += "]]></content>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

FlashNode.prototype.createFlashJSInterface = function(){
	window.frames["ifrm"].showJsAlert = function(){alert('calling js from flash');};
	window.frames["ifrm"].callToFlash = function(flashObjId){
		if(navigator.appName.indexOf("Microsoft")!=-1){
			window.frames["ifrm"].window[flashObjId].callToFlash();
		} else {
			window.frames["ifrm"].document[flashObjId].callToFlash();
		};
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/FlashNode.js');
};
/*
 * NoteNode is a child of openresponse
 */

NoteNode.prototype = new OpenResponseNode();
NoteNode.prototype.constructor = NoteNode;
NoteNode.prototype.parent = OpenResponseNode.prototype;
function NoteNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.prevWorkNodeIds = [];
};

NoteNode.prototype.renderFrame = function(){
	/*
	 * check if the notePanel has already been created, if not we will
	 * create it. we also need to check if the element 'noteiframe' is
	 * null because safari 4.0 has some bug which causes the notePanel
	 * to be not null but the 'noteiframe' to be null.
	 */
	if (document['notePanel_' + this.id] == null || document.getElementById('noteiframe' + this.id) == null) {
		var panelDiv = createElement(document, 'div', {id: 'notePanelDiv_' + this.id});
		var headDiv = createElement(document, 'div', {'class': 'noteHead'});
		var bodyDiv = createElement(document, 'div', {'class': 'noteBody'});
		var footDiv = createElement(document, 'div', {'class': 'noteFooter'});
		
		document.getElementById('centeredDiv').appendChild(panelDiv);
		panelDiv.appendChild(headDiv);
		panelDiv.appendChild(bodyDiv);
		panelDiv.appendChild(footDiv);	
		
		//The second argument passed to the
	    //constructor is a configuration object:
		document['notePanel_' + this.id] = new YAHOO.widget.Panel("notePanelDiv_" + this.id, {
			width: "650px",
			height: "625px",
			fixedcenter: false,
			constraintoviewport: true,
			underlay: "shadow",
			y:55,
			close: true,
			visible: false,
			draggable: true
		});
		
		document['notePanel_' + this.id].setHeader("Reflection Note");
		document['notePanel_' + this.id].setBody("<iframe name=\"noteiframe" + this.id + "\" id=\"noteiframe" + this.id + "\" frameborder=\"0\" width=\"100%\" height=\"100%\" src=\"node/openresponse/note.html\"><iframe>");
		

		document['notePanel_' + this.id].cfg.setProperty("underlay", "matte");
		document['notePanel_' + this.id].render();
	};
};

NoteNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){//content is available, proceed with render
		var renderAfterGet = function(text, xml, orNode){			
			orNode.contentPanel.document.open();
			text = text.replace(/(\.\.\/\.\.\/)/gi, ''); //remove '../../' in any references because this should not be the note panel
			orNode.contentPanel.document.write(orNode.injectBaseRef(text));
			orNode.contentPanel.document.close();
			if(orNode.contentPanel.name!='noteiframe' + this.id){
				orNode.contentPanel.renderComplete = function(){
					orNode.load();
				};
			};
		};
		
		var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
		var states = [];
		for (var i=0; i < vle.state.visitedNodes.length; i++) {
			var nodeVisit = vle.state.visitedNodes[i];
			if (nodeVisit.getNodeId() == this.id) {
				for (var j=0; j<nodeVisit.nodeStates.length; j++) {
					states.push(nodeVisit.nodeStates[j]);
				}
			}
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {//using YUI panel, load content into panel and return
			this.contentPanel = window.frames['noteiframe' + this.id];
			this.contentPanel.loadContent([this.element, vle, states]);
			document['notePanel_' + this.id].cfg.setProperty('visible', true);
			this.insertPreviousWorkIntoPage(this.contentPanel.document);
			return;
		};
		
		vle.connectionManager.request('GET', 1, 'node/openresponse/note.html', null,  renderAfterGet, this);
	} else {
		//content is not available, wait for content loading event
		//to complete, then call render again
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

NoteNode.prototype.load = function() {
	var nodeVisits = vle.state.getNodeVisitsByNodeId(this.id);
	var states = [];
	for (var i=0; i < vle.state.visitedNodes.length; i++) {
		var nodeVisit = vle.state.visitedNodes[i];
		if (nodeVisit.getNodeId() == this.id) {
			for (var j=0; j<nodeVisit.nodeStates.length; j++) {
				states.push(nodeVisit.nodeStates[j]);
			};
		};
	};
		
	this.contentPanel.loadContent([this.element, vle, states]);
	
	this.insertPreviousWorkIntoPage(this.contentPanel.document);
};

/**
 * Called when the step is exited. This is used for auto-saving.
 */
NoteNode.prototype.onExit = function() {
	//check if the content panel exists
	if(this.contentPanel && this.contentPanel.save) {
		//tell the content panel to save
		this.contentPanel.save();
	}
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/NoteNode.js');
};
/*
 * OutsideUrlNode
 */

OutsideUrlNode.prototype = new Node();
OutsideUrlNode.prototype.constructor = OutsideUrlNode;
OutsideUrlNode.prototype.parent = Node.prototype;
function OutsideUrlNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
};

OutsideUrlNode.prototype.getUrl = function(){
	return this.content.getContentJSON().url;
};

OutsideUrlNode.prototype.getDataXML = function(nodeStates) {
	return OutsideUrlNode.prototype.parent.getDataXML(nodeStates);
};


OutsideUrlNode.prototype.parseDataXML = function(nodeStatesXML) {
	return new Array();
}

OutsideUrlNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<url>";
	exportXML += this.element.getElementsByTagName("url")[0].firstChild.nodeValue;
	exportXML += "</url>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/OutsideUrlNode.js');
};
/*
 * MultipleChoiceNode
 */

MultipleChoiceNode.prototype = new Node();
MultipleChoiceNode.prototype.constructor = MultipleChoiceNode;
MultipleChoiceNode.prototype.parent = Node.prototype;
function MultipleChoiceNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	
	//mainly used for the ticker
	this.mc = null;
	this.contentBase;
	this.contentPanel;
	this.audioSupported = true;
	this.prevWorkNodeIds = [];
}

MultipleChoiceNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, mcNode){			
			mcNode.contentPanel.document.open();
			mcNode.contentPanel.document.write(mcNode.injectBaseRef(injectVleUrl(text)));
			mcNode.contentPanel.document.close();
			if(mcNode.contentPanel.name!='ifrm'){
				mcNode.contentPanel.renderComplete = function(){
					mcNode.load();
				};
			};
			mcNode.contentPanel.renderLoadComplete = function(){
				mcNode.onNodefullyloaded();
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/multiplechoice/multiplechoice.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

MultipleChoiceNode.prototype.load = function() {
	this.contentPanel.loadContent([this.elementText, this, vle]);
	this.insertPreviousWorkIntoPage(this.contentPanel.document);
};

/**
 * Renders barebones mc by entity other than VLE
 */
MultipleChoiceNode.prototype.renderLite = function(state){
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(state){
		this.liteState = state;
	};
	
	var callbackFun = function(text, xml, mcNode){
		mcNode.contentPanel.document.open();
		mcNode.contentPanel.document.write(mcNode.injectBaseRef(injectVleUrl(text)));
		mcNode.contentPanel.document.close();
		mcNode.contentPanel.renderComplete = function(){
			mcNode.loadLite();			
		};
	};
	
	var callback = {
		success: function(o){callbackFun(o.responseText, o.responseXML, o.argument);},
		failure: function(o){this.view.notificationManager.notify('failed to retrieve file', 3);},
		argument: this
	};
	
	YAHOO.util.Connect.asyncRequest('GET', 'node/multiplechoice/multiplechoicelite.html', callback, null);
};

/**
 * Loads barebones mc by entity other than VLE
 */
MultipleChoiceNode.prototype.loadLite = function(){
	this.contentPanel.loadContent([this.element, this, vle, this.liteState]);
};

/**
 * @return an xml string that represents the current state of this
 * node which includes the student's submitted data
 */
MultipleChoiceNode.prototype.getDataXML = function(nodeStates) {
	return MultipleChoiceNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with real state object instances
 */
MultipleChoiceNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MCSTATE object and put it into the array that we will return
		 */
		statesArrayObject.push(MCSTATE.prototype.parseDataXML(stateXML));
	}
	return statesArrayObject;
}

/**
 * Takes in a state JSON object and converts it into an MCSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an MCSTATE object
 */
MultipleChoiceNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return MCSTATE.prototype.parseDataJSONObj(stateJSONObj);
}

/**
 * Creates XML string representation of this node
 * @return an XML MultipleChoiceNode string that includes the content
 * of the node. this is for authoring when we want to convert the
 * project back from the authored object into an xml representation 
 * for saving.
 */
MultipleChoiceNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

/**
 * Retrieves the latest student work for this node and returns it in
 * a query entry object
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryEntry that contains the latest student
 * 		work for this node. return null if this student has not accessed
 * 		this step yet.
 */
MultipleChoiceNode.prototype.getLatestWork = function(vle) {
	var latestState = null;
	
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//get the most recent student work for this step
	latestState = this.mc.getLatestState(this.id);
	
	if(latestState == null) {
		//the student has not accessed or completed this step yet
		return null;
	}
	
	//create and return a query entry object
	return new MultipleChoiceQueryEntry(vle.getWorkgroupId(), vle.getUserName(), this.id, this.mc.promptText, latestState.getIdentifier(), this.mc.getCHOICEByIdentifier(latestState.getIdentifier()).text);
}

/**
 * Returns the prompt for this node by loading the MC content and then
 * obtaining it from the MC
 * @return the prompt for this node
 */
MultipleChoiceNode.prototype.getPrompt = function() {
	var xmlDoc=loadXMLString(this.getXMLString());
	this.mc = new MC(xmlDoc);
	
	//return the prompt as a string
	return this.mc.promptText;
}

/**
 * Create a query container that will contain all the query entries
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceQueryContainer that will contain all the
 * 		query entries for a specific nodeId as well as accumulated 
 * 		metadata about all those entries such as count totals, etc.
 */
MultipleChoiceNode.prototype.makeQueryContainer = function(vle) {
	//setup the mc object by loading in the content of the step
	this.mc = new MC(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mc.loadForTicker(this, vle);
	
	//create and return a query container object
	return new MultipleChoiceQueryContainer(this.id, this.mc.promptText, this.mc.choiceToValueArray);
}

/**
 * Translate an identifier to the corresponding value such as
 * choice1 to "The fish was swimming"
 * We need to create an MC object in order to look up the identifiers
 * @param identifier the id of the choice
 * @return the string value of the choice
 */
MultipleChoiceNode.prototype.translateStudentWork = function(identifier) {
	//create an MC object so we can look up the value corresponding to an identifier
	this.mc = new MC(loadXMLString(this.getXMLString()));
	
	//return the value as a string
	return this.mc.getCHOICEByIdentifier(identifier).text;
}
/**
 * Given an xmlDoc of state information, returns a new state
 * @param stateXML
 * @return
 */
MultipleChoiceNode.prototype.parseStateXML = function(stateXML){
	return MCSTATE.prototype.parseDataXML(stateXML);
};


MultipleChoiceNode.prototype.onExit = function() {
	
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/MultipleChoiceNode.js');
};
/**
 * BrainstormNode
 *
 * @author: patrick lawler
 */

BrainstormNode.prototype = new Node();
BrainstormNode.prototype.constructor = BrainstormNode;
BrainstormNode.prototype.parent = Node.prototype;
function BrainstormNode(nodeType, view) {
	this.view = view
	this.type = nodeType;
	this.audioSupported = true;
	this.serverless = true;
	this.prevWorkNodeIds = [];
};

/**
 * Determines if the this step is using a server back end.
 * @return
 */
BrainstormNode.prototype.isUsingServer = function() {
	if(this.content.getContentJSON().useServer) {
		//we are using a server back end
		this.serverless = false;
		return true;
	} else {
		//we are not using a server back end
		this.serverless = true;
		return false;
	}
};

BrainstormNode.prototype.getDataXML = function(nodeStates) {
	return BrainstormNode.prototype.parent.getDataXML(nodeStates);
};

BrainstormNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = BRAINSTORMSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};

/**
 * Takes in a state JSON object and returns a BRAINSTORMSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a BRAINSTORMSTATE object
 */
BrainstormNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return BRAINSTORMSTATE.prototype.parseDataJSONObj(stateJSONObj);
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/BrainstormNode.js');
};
/**
 * A GlueNode is a node that renders 1 or more children in a single page
 *
 * @author: patrick lawler
 */

GlueNode.prototype = new Node();
GlueNode.prototype.constructor = GlueNode;
GlueNode.prototype.parent = Node.prototype;
function GlueNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
};

GlueNode.prototype.renderPrev = function(){
	this.contentPanel.renderPrev();
};

GlueNode.prototype.renderNext = function(){
	this.contentPanel.renderNext();
};

GlueNode.prototype.getDataXML = function(nodeStates) {
	return GlueNode.prototype.parent.getDataXML(nodeStates);
};

GlueNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		var stateObject = GLUESTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		};
	};
	
	return statesArrayObject;
};


/**
 * Takes in a state JSON object and converts it into an GLUESTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return an GLUESTATE object
 */
GlueNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	return GLUESTATE.prototype.parseDataJSONObj(stateJSONObj);
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/GlueNode.js');
};
DataGraphNode.prototype = new Node();
DataGraphNode.prototype.constructor = DataGraphNode;
DataGraphNode.prototype.parent = Node.prototype;
function DataGraphNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.contentPanel;
	this.prevWorkNodeIds = [];
};

DataGraphNode.prototype.render_old = function(contentPanel) {
	if(this.filename!=null && vle.project.lazyLoading && (!this.contentLoaded)){ //load element from file
		this.retrieveFile();
	};
	
	if(this.contentLoaded){
		var renderAfterGet = function(text, xml, dgNode){			
			dgNode.contentPanel.document.open();
			dgNode.contentPanel.document.write(dgNode.injectBaseRef(injectVleUrl(text)));
			dgNode.contentPanel.document.close();
			if(dgNode.contentPanel.name!='ifrm'){
				dgNode.contentPanel.renderComplete = function(){
					dgNode.load();
				};
			};
			
			dgNode.contentPanel.renderLoadComplete = function(){
				dgNode.onNodefullyloaded();
			};
		};
		
		if(contentPanel){
			this.contentPanel = window.frames[contentPanel.name];
		} else {
			this.contentPanel = window.frames['ifrm'];
		};
		
		vle.connectionManager.request('GET', 1, 'node/datagraph/datagraph.html', null,  renderAfterGet, this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, function(type, args, co){co[0].render(co[1]);}, [this, contentPanel]);
	};
};

DataGraphNode.prototype.load = function() {
	var load = function(event, args, dgNode){
		if(!dgNode){//Firefox only passes the obj
			dgNode = event;
		};
		
		var state;
		for (var i=0; i < vle.state.visitedNodes.length; i++) {
			var nodeVisit = vle.state.visitedNodes[i];
			if (nodeVisit.getNodeId() == dgNode.id) {
				if(nodeVisit.nodeStates.length>0){
					state = nodeVisit.nodeStates[nodeVisit.nodeStates.length -1];
				};
			};
		};
		
		dgNode.contentPanel.loadContent([dgNode.element, vle, state]);
		dgNode.insertPreviousWorkIntoPage(dgNode.contentPanel.document);
	};
	
	if(this.contentLoaded){
		load(this);
	} else {
		vle.eventManager.subscribe('nodeLoadingContentComplete_' + this.id, load, this);
	};
};

DataGraphNode.prototype.getDataXML = function(nodeStates) {
	return DataGraphNode.prototype.parent.getDataXML(nodeStates);
};

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
DataGraphNode.prototype.parseDataXML = function(nodeStatesXML) {
	//TODO implement me
};

/**
 * Takes in a state JSON object and returns a DATAGRAPHSTATE object
 * @param nodeStatesJSONObj a state JSON object
 * @return a DATAGRAPHSTATE object
 */
DataGraphNode.prototype.parseDataJSONObj = function(stateJSONObj) {
	//TODO implement me
};

DataGraphNode.prototype.exportNode = function() {
	//TODO implement me
};

DataGraphNode.prototype.translateStudentWork = function(studentWork) {
	return studentWork;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/DataGraphNode.js');
};

SVGDrawNode.prototype = new HtmlNode();
SVGDrawNode.prototype.constructor = SVGDrawNode;
SVGDrawNode.prototype.parent = HtmlNode.prototype;
function SVGDrawNode(nodeType, view) {
	this.view = view;
	this.type = nodeType;
	this.content = null;
	this.filename = null;
	this.audios = [];
	this.contentBase;
	this.audioSupported = true;	
};

SVGDrawNode.prototype.updateJSONContentPath = function(base){
	var rExp = new RegExp(this.filename);
	this.content.replace(rExp, base + '/' + this.filename);
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/SVGDrawNode.js');
};
/**
 * Object for storing VLE Configuration, not all config
 * params may be defined depending on the context with
 * which the config is being used whether it be
 * student run, preview, or grading.
 * These include:
 * 
 * mode - run (aka student), preview, grading
 * runId - the id of the run
 * runInfoRequestInterval - how often to poll for special events
 * theme - currently only UCCP and WISE are allowed
 * playAudioOnStart - whether to have tts on at the start
 * runInfoUrl - where to get run info
 * getUserInfoUrl - where to get user information
 * getContentUrl - where the .project file is
 * getContentBaseUrl - base url of content
 * getStudentDataUrl - where to get student work
 * postStudentDataUrl - where to post student work
 * getJournalDataUrl - where to get journal work
 * postJournalDataUrl - where to post journal work
 * getFlagsUrl - where to get flags
 * postFlagsUrl - where to post flags
 * getAnnotationsUrl - where to get annotations
 * postAnnotationsUrl - where to post annotations
 * getCurrentStepUrl - where to get the current step
 * postCurrentStepUrl - where to post the current step
 * postLevel - how often to post back student work
 */
View.prototype.createConfig = function(contentObject) {
	return function(contentObj) {
		//store the content object
		var contentObject = contentObj;
		
		/*
		 * this object is just a json object and will contain 
		 * all the config params they will be referenced by 
		 * asking for
		 * configParams['configParamName']
		 * or
		 * configParams.configParamName
		 * 
		 * note: all the json keys should be named exactly the same
		 * as the config parameter. e.g.
		 * getDataUrl param should be named getDataUrl and not
		 * anything different like dataUrl or getStudentDataUrl, etc.
		 * that way when we try to obtain that config param
		 * we can actually retrieve it
		 */
		var configParams = contentObject.getContentJSON();

		//set any default values if they were not provided
		if(configParams['playAudioOnStart'] == null) {
			configParams['playAudioOnStart'] = false;			
		}
		
		return {
			isValidTheme:function(theme) {
				var allowableThemes = ['UCCP', 'WISE'];
				return allowableThemes.contains(theme);
			},
			getConfigParam:function(configParam) {
				return configParams[configParam];
			}
		};
	}(contentObject);
};

View.prototype.getConfig = function() {
	return this.config;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/config/config.js');
};
/* 
 * TODO: COMMENT ME
 * 
 */
function VLE_STATE() {
	this.visitedNodes = [];  // array of NODE_VISIT objects
	this.userName = null; //lets put this here for now, sssssh
	this.dataId = null;
}

VLE_STATE.prototype.setUserName = function(userName) {
	this.userName = userName;
};

VLE_STATE.prototype.setDataId = function(dataId) {
	this.dataId = dataId;
};

VLE_STATE.prototype.getCurrentNodeVisit = function() {
	if (this.visitedNodes.length == 0) {
		return null;
	} else {
		return this.visitedNodes[this.visitedNodes.length - 1];
	}
};

VLE_STATE.prototype.endCurrentNodeVisit = function() {
	// set endtime
	var currentNodeVisit = this.getCurrentNodeVisit();
	if(currentNodeVisit){
		currentNodeVisit.visitEndTime = Date.parse(new Date());
	};
};

/**
 * Save the provided state at the end of the provided nodeVisit
 * @param node
 * @param state
 * @return
 */
VLE_STATE.prototype.saveState = function(nodeVisit, state) {
	
};

/**
 * Returns an array of NODE_VISITS for the specified nodeId
 * @param {Object} nodeId
 */
VLE_STATE.prototype.getNodeVisitsByNodeId = function(nodeId) {
	var nodeVisitsForThisNodeId = [];
	for (var i=0; i<this.visitedNodes.length;i++) {
		if (this.visitedNodes[i].nodeId==nodeId) {
			nodeVisitsForThisNodeId.push(this.visitedNodes[i]);
		}		
	}
	//alert("nodeId: " + nodeId + "<br>nodeVisitsForThisNodeId: " + nodeVisitsForThisNodeId.length);
	return nodeVisitsForThisNodeId;
}

/**
 * Get the latest node visit object for the nodeId
 * @param nodeId the nodeId we want the latest node visit for
 * @return the latest node visit for the nodeId
 */
VLE_STATE.prototype.getLatestNodeVisitByNodeId = function(nodeId) {
	//loop through all the node visits starting from the most recent
	for (var i=this.visitedNodes.length - 1; i>=0; i--) {
		
		//check if the current node visit has the nodeId we are looking for
		if (this.visitedNodes[i].nodeId==nodeId) {
			//return the most recent node visit that contains work
			if (this.visitedNodes[i].getLatestWork() != "") {
				return this.visitedNodes[i];
			}
		}		
	}
	return null;
};

/**
 * Get the latest non blank work for the given nodeId step
 * @param nodeId the step to retrieve work for
 * @return the latest non blank work or "" if none exists
 */
VLE_STATE.prototype.getLatestWorkByNodeId = function(nodeId) {
	//loop through the node visits from latest to earliest
	for(var x=this.visitedNodes.length - 1; x >= 0; x--) {
		//get a node visit
		var nodeVisit = this.visitedNodes[x];
		
		//check if the nodeId matches
		if(nodeVisit.nodeId == nodeId) {
			//obtain the latest non blank work for the node visit
			var latestWorkForNodeVisit = nodeVisit.getLatestWork();
			
			//check if there was any non blank work
			if(latestWorkForNodeVisit != "") {
				//return the non blank work
				return latestWorkForNodeVisit;
			}
		}
	}
	
	return "";
}

/**
 * @return xml representation of the state of the vle which
 * 		includes student data as well as navigation info
 */
VLE_STATE.prototype.getDataXML = function() {
	var dataXML = "";
	dataXML += "<vle_state>";
	
	dataXML += this.getVisitedNodesDataXML();
	
	dataXML += "</vle_state>";
	return dataXML;
}

VLE_STATE.prototype.getVisitedNodesDataXML = function() {
	var dataXML = "";
	
	//loop through all the visited nodes and retrieve the xml for each node
	for (var i=0; i<this.visitedNodes.length;i++) {
		dataXML += this.visitedNodes[i].getDataXML();
	}
	
	return dataXML;
}

/**
 * Gets all the node visits that have non null visitEndTime fields.
 * This should be all the nodes except the most recent node the
 * student is on because they have not exited the step yet.
 */
VLE_STATE.prototype.getCompletelyVisitedNodesDataXML = function() {
	var dataXML = "";
	
	//loop through all the visited nodes and retrieve the xml for each node
	for (var i=0; i<this.visitedNodes.length;i++) {
		if(this.visitedNodes[i].visitEndTime != null) {
			dataXML += this.visitedNodes[i].getDataXML();
		}
	}
	
	return dataXML;
}

/**
 * Takes in an vle state XML object and creates a real VLE_STATE object.
 * @param vleStateXML an XML object
 */
VLE_STATE.prototype.parseDataXML = function(vleStateXML) {
	var vleStateObject = new VLE_STATE();
	
	var nodeVisitNodesXML = vleStateXML.getElementsByTagName("node_visit");
	
	//loop through all the node_visit nodes
    for (var i=0; i< nodeVisitNodesXML.length; i++) {
    	var nodeVisit = nodeVisitNodesXML[i];
    	
    	//ask the NODE_VISIT static function to create a real NODE_VISIT object
    	var nodeForNodeVisit = vle.getNodeById(nodeVisit.getElementsByTagName("id")[0].textContent);
    	
    	// first check that the node exists in the project
    	if (nodeForNodeVisit && nodeForNodeVisit != null) {
    		var nodeVisitObject = NODE_VISIT.prototype.parseDataXML(nodeVisit);
    	
    		//add the real NODE_VISIT object into this VLE_STATE
    		vleStateObject.visitedNodes.push(nodeVisitObject);
    	}
    }
	
    //alert("vleStateObject.getDataXML(): " + vleStateObject.getDataXML());
    return vleStateObject;
};

/**
 * Given a JSON string of the user's vle state, parses it and returns
 * a populated VLE_STATE object.
 * @param jsonString a JSON string representing a vle state
 * @param alwaysReturnArray always return an array of vle_state, even if there is only one vle_state. Used by grdingtool
 * @return a VLE_STATE object
 */
VLE_STATE.prototype.parseDataJSONString = function(vleStateJSONString, alwaysReturnArray) {
	//parse the JSON string to create a JSON object
	var vleStatesJSONObj = yui.JSON.parse(vleStateJSONString);

	if(vleStatesJSONObj){
		var vleStatesArray = new Array();
		for (var i=0; i < vleStatesJSONObj.vle_states.length; i++) {
			var vleStateJSONObj = vleStatesJSONObj.vle_states[i];
			vleStatesArray.push(VLE_STATE.prototype.parseDataJSONObj(vleStateJSONObj));
		}
	
		if (vleStatesArray.length == 1 && !alwaysReturnArray) {
			return vleStatesArray[0];
		} else {
			return vleStatesArray;
		}
	} else {
		notificationManager.notify('Error when parsing JSON state. Cannot proceed.', 5);
	};
};

/**
 * Takes in a JSON object representing a vle state and converts it
 * into a populated VLE_STATE object
 * @param vleStateJSONObj a JSON object representing a vle state
 * @return a VLE_STATE object
 */
VLE_STATE.prototype.parseDataJSONObj = function(vleStateJSONObj) {
	//create a new VLE_STATE
	var vleState = new VLE_STATE();
	
	//populate the attributes
	vleState.userName = vleStateJSONObj.userName;
	vleState.dataId = vleStateJSONObj.userId;
	
	//loop through the node visits and populate them in the VLE_STATE
	if (vleStateJSONObj.visitedNodes != null) {
		for(var x=0; x<vleStateJSONObj.visitedNodes.length; x++) {
			//obtain a node visit JSON object
			var nodeVisitJSONObj = vleStateJSONObj.visitedNodes[x];

			//create a NODE_VISIT object
			var nodeVisitObj = NODE_VISIT.prototype.parseDataJSONObj(nodeVisitJSONObj);

			//add the NODE_VISIT object to the visitedNodes array
			if (nodeVisitObj != null) {  // null-check. if null, it probably means that student has done work for a node that no longer exists for this project, like the author changed the project during the run.
				vleState.visitedNodes.push(nodeVisitObj);
			}
		}
	}

	//return the VLE_STATE object
	return vleState;
}

/**
 * Receives an xml string and creates an xml object out of it. Then
 * using the xml object, it creates an array of real VLE_STATE object.
 * @param xmlString xml string that contains multiple workgroup/vle_state
 * 		nodes. e.g.
 * 
 * <vle_states>
 * 		<workgroup dataId='1'><vle_state>...</vle_state></workgroup>
 * 		<workgroup dataId='2'><vle_state>...</vle_state></workgroup>
 * 		<workgroup dataId='3'><vle_state>...</vle_state></workgroup>
 * </vle_states>
 * 
 * @return an array of VLE_STATE objects. dataId will be used for 
 * 		the index/key
 */
VLE_STATE.prototype.parseVLEStatesDataXMLString = function(xmlString) {
	var xmlDoc = null;
	
	//create an xml object out of the xml string
	try {
		//Internet Explorer
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.loadXML(xmlString);
	} catch(e) {
		try {
		//Firefox, Mozilla, Opera, etc.
			var parser=new DOMParser();
			xmlDoc=parser.parseFromString(xmlString,"text/xml");
		} catch(e) {
			notificationManager.notify(e.message, 3);
		}
	}
	
	var vleStatesArray = new Array();
	
	//retrieve all the workgroups
	var workgroupsXML = xmlDoc.getElementsByTagName("workgroup");
	
	/*
	 * loop through the workgroups and populate the array. The dataId
	 * will serve as the index/key.
	 */
	for(var x=0; x<workgroupsXML.length; x++) {
		var dataId = workgroupsXML[x].attributes.getNamedItem("dataId").firstChild.nodeValue;
		var vleState = workgroupsXML[x].getElementsByTagName("vle_state")[0];
		
		//create a real VLE_STATE object from the xml object and put it in the array
		vleStatesArray[dataId] = VLE_STATE.prototype.parseDataXML(vleState);
	}
	
	return vleStatesArray;
}

VLE_STATE.prototype.parseVLEStatesDataXMLObject = function(xmlObject) {
	var vleStatesArray = new Array();
	//retrieve all the workgroups
	var workgroupsXML = xmlObject.getElementsByTagName("workgroup");
	/*
	 * loop through the workgroups and populate the array. The dataId
	 * will serve as the index/key.
	 */
	for(var x=0; x<workgroupsXML.length; x++) {
		var dataId = workgroupsXML[x].attributes.getNamedItem("userId").nodeValue;
		var userName = workgroupsXML[x].attributes.getNamedItem("userName").nodeValue;
		var vleStateXMLObj = workgroupsXML[x].getElementsByTagName("vle_state")[0];
		
		//create a real VLE_STATE object from the xml object and put it in the array
		var vleStateObj = VLE_STATE.prototype.parseDataXML(vleStateXMLObj);
		vleStateObj.userName = userName;
		vleStateObj.dataId = dataId;
		vleStatesArray.push(vleStateObj);
	}
	return vleStatesArray;
}

/**
 * Sets a new NODE_VISIT, containing info on where the student 
 * is current on.
 */
VLE_STATE.prototype.setCurrentNodeVisit = function(node) {
	var currentNodeVisit = this.getCurrentNodeVisit();   // currentNode becomes lastnode
	
	var newNodeVisit = new NODE_VISIT(node.id, node.type);

	this.visitedNodes.push(newNodeVisit);
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/data/vlestate.js');
};
/*
 * TODO: COMMENT ME
 */
function NODE_VISIT(nodeId, nodeType, nodeStates, visitStartTime, visitEndTime) {
	this.id;   // id of this nodevisit. Unique across all nodevisits. For ex, auto_increment number assigned by database when it was saved.
	//this.node = node;
	this.nodeId = nodeId;
	this.nodeType = nodeType;
	this.visitPostTime = null;
	
	if (arguments.length == 2) {
		//set default values if they aren't provided
		this.nodeStates = [];
		this.visitStartTime = Date.parse(new Date());
		this.visitEndTime = null;
	} else {
		this.nodeStates = nodeStates;
		this.visitStartTime = visitStartTime;
		this.visitEndTime = visitEndTime;
	}
}

/**
 * Returns this node visit's nodeId.
 * @return
 */
NODE_VISIT.prototype.getNodeId = function() {
	return this.nodeId;
}

/**
 * @return xml representation of the node_visit object which
 * 		includes node type, visitStart, visitEnd time, etc.
 * 		e.g.
 * 
 * <node_visit>
 * 		<node>
 * 			<type></type>
 * 			<id></id>
 * 		</node>
 * 		<nodeStates></nodeStates>
 * 		<visitStartTime></visitStartTime>
 * 		<visitEndTime></visitEndTime>
 * </node_visit>
 */
NODE_VISIT.prototype.getDataXML = function() {
	var dataXML = "";
	
	dataXML += "<node_visit>";
	
	dataXML += "<node><type>";
	dataXML += this.nodeType;
	dataXML += "</type><id>";
	dataXML += this.nodeId;
	dataXML += "</id></node>";
	
	dataXML += "<nodeStates>";
	var currNode = vle.getNodeById(this.nodeId);
	dataXML += currNode.getDataXML(this.nodeStates);
	dataXML += "</nodeStates>";
	
	dataXML += "<visitStartTime>";
	dataXML += this.visitStartTime;	
	dataXML += "</visitStartTime>";
	
	dataXML += "<visitEndTime>";
	dataXML += this.visitEndTime;	
	dataXML += "</visitEndTime>";
	
	dataXML += "</node_visit>";
	
	return dataXML;
}

/**
 * Turns a node visit xml object into a real NODE_VISIT object
 * @param nodeVisitXML and xml object
 * @return a real NODE_VISIT object
 */
NODE_VISIT.prototype.parseDataXML = function(nodeVisitXML) {
	//ask the NODE static function to create the node
	//var nodeObject = Node.prototype.parseDataXML(nodeVisitXML);
	
	var nodeObject = vle.getNodeById(nodeVisitXML.getElementsByTagName("id")[0].textContent);
	if (!nodeObject || nodeObject == null) {
		return null;
	}
	//alert('vle.js, nodeObject:' + nodeObject);
	//get the start and end times
	var visitStartTime = nodeVisitXML.getElementsByTagName("visitStartTime")[0].textContent;
	var visitEndTime = nodeVisitXML.getElementsByTagName("visitEndTime")[0].textContent;

	//retrieve an array of node state objects
	var nodeStatesArrayObject = nodeObject.parseDataXML(nodeVisitXML.getElementsByTagName("nodeStates")[0]);

	//create a node_visit object with the new node object
	var nodeVisitObject = new NODE_VISIT(nodeObject.id, nodeObject.type, nodeStatesArrayObject, visitStartTime, visitEndTime);
	
	// get the node_visit_id if it exists
	if (nodeVisitXML.getElementsByTagName("node_visit_id") != null && nodeVisitXML.getElementsByTagName("node_visit_id").length > 0) {
		nodeVisitObject.id = nodeVisitXML.getElementsByTagName("node_visit_id")[0].textContent;
	}
	
	return nodeVisitObject;
}


/**
 * Takes in a JSON object representing a NODE_VISIT and creates and
 * populates a NODE_VISIT object.
 * @param nodeVisitJSONObj a JSON object representing a NODE_VISIT
 * @return a NODE_VISIT object
 */
NODE_VISIT.prototype.parseDataJSONObj = function(nodeVisitJSONObj) {
	//create a new NODE_VISIT object
	var nodeVisit = new NODE_VISIT();
	
	//populate the attributes of the NODE_VISIT object
	nodeVisit.id = nodeVisitJSONObj.stepWorkId;
	nodeVisit.nodeId = nodeVisitJSONObj.nodeId;
	nodeVisit.nodeType = nodeVisitJSONObj.nodeType;
	nodeVisit.visitStartTime = nodeVisitJSONObj.visitStartTime;
	nodeVisit.visitEndTime = nodeVisitJSONObj.visitEndTime;
	nodeVisit.visitPostTime = nodeVisitJSONObj.visitPostTime;
	
	//obtain the node object that this visit refers to
	var nodeObj = env.getProject().getNodeById(nodeVisit.nodeId);
	
	//return null if the node object was not found
	if (!nodeObj || nodeObj == null) {
		return null;
	}
	
	//create an array of nodeStates from the nodeStates in the JSON object
	var nodeStatesArrayObj = new Array();
	
	if(nodeVisitJSONObj.nodeStates != null) {
		//loop through all the elements in the nodeVisitJSONObj.nodeStates array
		for(var x=0; x<nodeVisitJSONObj.nodeStates.length; x++) {
			//obtain a node state JSON object
			var stateJSONObj = nodeVisitJSONObj.nodeStates[x];
			
			//tell the nodeObj to create a state object
			var stateObj = nodeObj.parseDataJSONObj(stateJSONObj);
			
			//add the state object to the array
			nodeStatesArrayObj.push(stateObj);
		}
	}
	
	//set the nodeStates into the NODE_VISIT object
	nodeVisit.nodeStates = nodeStatesArrayObj;
	
	//return the NODE_VISIT object
	return nodeVisit;
}

/*
 * Get the last node state that was placed in the nodeStates array
 */
NODE_VISIT.prototype.getLatestState = function() {
	//retrieve the last nodeState in the array of nodeStates
	return this.nodeStates[this.nodeStates.length - 1];
}

/**
 * Get the latest work for this visit that isn't null or
 * empty string
 * @return the latest work that is not null or blank
 */
NODE_VISIT.prototype.getLatestWork = function() {
	//loop through all the states from latest to earliest
	for(var x=this.nodeStates.length - 1; x >= 0; x--) {
		//check if the state's work is not blank
		if(this.nodeStates[x] != null && 
				this.nodeStates[x].getStudentWork() != null &&
				this.nodeStates[x].getStudentWork() != "") {
			//return the student work
			return this.nodeStates[x].getStudentWork();
		}
	}
	
	return "";
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/data/nodevisit.js');
};
/**
 * Object for storing the student's response to the brainstorm
 */
function BRAINSTORMSTATE(response, timestamp){
	this.type = "bs";
	this.response = response;
	if(arguments.length == 1) {
		this.timestamp = Date.parse(new Date());
	} else {
		this.timestamp = timestamp;
	};
};

BRAINSTORMSTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
};

BRAINSTORMSTATE.prototype.getDataXML = function() {
	return "<response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
};

BRAINSTORMSTATE.prototype.parseDataXML = function(stateXML) {
	var reponse = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(reponse == undefined || timestamp == undefined) {
		return null;
	} else {
		return new BRAINSTORMSTATE(reponse.textContent, timestamp.textContent);		
	}
};

/**
 * Takes in a state JSON object and returns an BRAINSTORMSTATE object
 * @param stateJSONObj a state JSON object
 * @return a BRAINSTORMSTATE object
 */
BRAINSTORMSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new BRAINSTORMSTATE object
	var brainState = new BRAINSTORMSTATE();
	
	//set the attributes of the BRAINSTORMSTATE object
	brainState.response = stateJSONObj.response;
	brainState.timestamp = stateJSONObj.timestamp;
	
	//return the BRAINSTORMSTATE object
	return brainState;
}

BRAINSTORMSTATE.prototype.getStudentWork = function() {
	return this.response;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/brainstorm/brainstormstate.js');
};
/**
 * Datagraph state object
 * 
 * @author patrick lawler
 */
function DATAGRAPHSTATE(args){
	this.timestamp = args[1];
	this.table = args[0];
	this.tableString;
	
	//set timestamp if not provided
	if(!this.timestamp){
		this.timestamp = Date.parse(new Date());
	};
	
	//convert json table to string
	if(this.table){
		this.tableString = yui.JSON.stringify(this.table);
	};
};

/**
 * Given a @param stateJSONObj, creates, populates and returns a DATAGRAPHSTATE obj
 */
DATAGRAPHSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	return new DATAGRAPHSTATE([stateJSONObj.table, stateJSONObj.timestamp]);
};

/**
 * Returns the student edited table as a string
 */
DATAGRAPHSTATE.prototype.getDataXML = function() {
	return this.tableString + "<timestamp>" + this.timestamp + "</timestamp>";
};

/**
 * Returns the student edited table as a string
 */
DATAGRAPHSTATE.prototype.getStudentWork = function() {
	return this.tableString;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/datagraph/datagraphstate.js');
};
/**
 * Object for storing state information of FILL-IN item.
 * @author Hiroki Terashima
 */

/**
 * For re-creating the student's vle_state from their xml for
 * researcher/teacher display
 */
function FILLINSTATE(textEntryInteractionIndex, response, timestamp) {
	this.type = "fi";
	this.textEntryInteractionIndex = textEntryInteractionIndex;  // which blank the student answered.
	this.response = response;   // what the student wrote in the blank.
	
	if(arguments.length == 2) {
		//if the third argument (timestamp) was ommitted just set it to the current time
		this.timestamp = Date.parse(new Date());
	} else {
		this.timestamp = timestamp;
	}
}

FILLINSTATE.prototype.print = function() {
}

FILLINSTATE.prototype.getDataXML = function() {
	return "<textEntryInteractionIndex>" + this.textEntryInteractionIndex + "</textEntryInteractionIndex><response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
}

FILLINSTATE.prototype.parseDataXML = function(stateXML) {
	var textEntryInteractionIndex = stateXML.getElementsByTagName("textEntryInteractionIndex")[0];
	var response = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(textEntryInteractionIndex == undefined || response == undefined || timestamp == undefined) {
		return null;
	} else {
		return new FILLINSTATE(textEntryInteractionIndex.textContent, response.textContent, timestamp.textContent);
	}
}


/**
 * Takes in a state JSON object and returns an FILLINSTATE object
 * @param stateJSONObj a state JSON object
 * @return a FILLINSTATE object
 */
FILLINSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new FILLINSTATE object
	var fillinState = new FILLINSTATE();
	
	//set the attributes of the FILLINSTATE object
	fillinState.textEntryInteractionIndex = stateJSONObj.textEntryInteractionIndex;
	fillinState.response = stateJSONObj.response;
	fillinState.timestamp = stateJSONObj.timestamp;
	
	//return the FILLINSTATE object
	return fillinState;
}

/**
 * Returns what the student typed
 * @return the answer the student typed
 */
FILLINSTATE.prototype.getStudentWork = function() {
	return this.response;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/fillin/fillinstate.js');
};
/**
 * Object for storing the student's response to the glue
 */
function GLUESTATE(response, timestamp){
	this.type = "glue";
	this.childStates = new Array();
	if(arguments.length == 1) {
		this.timestamp = Date.parse(new Date());
	} else {
		this.timestamp = timestamp;
	};
};

GLUESTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
};

GLUESTATE.prototype.getDataXML = function() {
	return "<response>" + this.response + "</response><timestamp>" + this.timestamp + "</timestamp>";
};

GLUESTATE.prototype.parseDataXML = function(stateXML) {
	var reponse = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(reponse == undefined || timestamp == undefined) {
		return null;
	} else {
		return new GLUESTATE(reponse.textContent, timestamp.textContent);		
	}
};

/**
 * Takes in a state JSON object and returns an GLUESTATE object
 * @param stateJSONObj a state JSON object
 * @return an GLUESTATE object
 */
GLUESTATE.prototype.parseDataJSONObj = function(stateJSONObj) {

	//create a new GLUESTATE object
	var glueState = new GLUESTATE();

	for (var i=0; i < stateJSONObj.childStates.length; i++) {
		var childStateJSONObj = stateJSONObj.childStates[i];
		var childId = childStateJSONObj.childId;
		var childType = childStateJSONObj.type;
		var childState = null;
		if (childType == "mc") {
			childState = MultipleChoiceNode.prototype.parseDataJSONObj(childStateJSONObj);
		} else if (childType == "or") {
			childState = OpenResponseNode.prototype.parseDataJSONObj(childStateJSONObj);
		}
		if (childState == null) {
			alert('gluestate.js, childstate not supported in glue yet');
		} else {
			childState.childId = childId;
			glueState.childStates.push(childState);
		}
	}

	//return the GLUESTATE object
	return glueState;
};

/**
 * Returns the student's answers for each child states 
 * in this GlueNode
 */
GLUESTATE.prototype.getStudentWork = function() {
	var soFar = "<table>";
	for (var i=0; i < this.childStates.length; i++) {
		soFar += "<tr><td>"+ this.childStates[i].getStudentWork() + "</td></tr>";
	}
	return soFar + "</table>";
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/glue/gluestate.js');
};
function HTMLSTATE(state, timestamp) {
	this.type = "html";
	this.data = state;
	
	if(timestamp == null) {
		this.timestamp = new Date().getTime();
	} else {
		this.timestamp = timestamp;
	}
};

/**
 * Gets the xml format for the student data
 * @return an xml string with the student data
 */
HTMLSTATE.prototype.getDataXML = function() {
	var dataXML = "<data>" + this.data + "</data>";
	dataXML += "<timestamp>" + this.timestamp + "</timestamp>";
	return dataXML;
}

/**
 * Creates a state object from an xml object
 * @param stateXML an xml object
 * @return an HTMLState object
 */
HTMLSTATE.prototype.parseDataXML = function(stateXML) {
	//obtain the data element
	var dataElement = stateXML.getElementsByTagName("data")[0];
	
	//obtain the timestamp element
	var timestampElement = stateXML.getElementsByTagName("timestamp")[0];
	
	//check if both elements exist
	if(dataElement != null && timestampElement != null) {
		//obtain the values for the data and timestamp
		var data = dataElement.textContent;
		var timestamp = timestampElement.textContent;
		
		//create an HTMLSTATE
		var state = new HTMLSTATE(data, timestamp);
		return state;
	} else {
		return null;
	}
}

/**
 * Takes in a state JSON object and returns an HTMLSTATE object
 * @param stateJSONObj a state JSON object
 * @return a HTMLSTATE object
 */
HTMLSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new HTMLSTATE object
	var htmlState = new HTMLSTATE();
	
	//set the attributes of the HTMLSTATE object
	htmlState.data = stateJSONObj.data;
	htmlState.timestamp = stateJSONObj.timestamp;
	
	//return the HTMLSTATE object
	return htmlState;
}

/**
 * Get the student work.
 * @return the student's work
 */
HTMLSTATE.prototype.getStudentWork = function() {
	return this.data;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/html/htmlstate.js');
};
/*
 * Copyright (c) 2009 Regents of the University of California (Regents). Created
 * by TELS, Graduate School of Education, University of California at Berkeley.
 *
 * This software is distributed under the GNU Lesser General Public License, v2.
 *
 * Permission is hereby granted, without written agreement and without license
 * or royalty fees, to use, copy, modify, and distribute this software and its
 * documentation for any purpose, provided that the above copyright notice and
 * the following two paragraphs appear in all copies of this software.
 *
 * REGENTS SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE. THE SOFTWAREAND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED
 * HEREUNDER IS PROVIDED "AS IS". REGENTS HAS NO OBLIGATION TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 *
 * IN NO EVENT SHALL REGENTS BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT,
 * SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS,
 * ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * REGENTS HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author: Hiroki Terashima
 */
/**
 * STATE
 *   buckets
 */
function MSSTATE() {
	this.type = "ms";
	this.sourceBucket = null;
    this.buckets = [];
}

/**
 * Returns the current state in xml string format
 */
MSSTATE.prototype.getXMLString = function() {
	var xmlString = "<state>";
	xmlString += "</state>";
	return xmlString;
}

MSSTATE.prototype.getDataXML = function() {
	//implement me
}

MSSTATE.prototype.parseDataXML = function(stateXML) {
	//implement me
}

MSSTATE.prototype.getStudentWork = function(){
	var text = '';
	for(var h=0;h<this.buckets.length;h++){
		text += 'You placed the choices ';
		for(var g=0;g<this.buckets[h].choices.length;g++){
			text += this.buckets[h].choices[g] + ' ';
		};
		text += ' in ' + this.buckets[h].text + ' \n';
	};
	return text;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/matchsequence/matchsequencestate.js');
};
/**
 * Object for storing state information of MultipleChoice item.
 */
function MCSTATE(args) {
	this.type = "mc";
	this.isCorrect = null;
	
	//stores the human readable value of the choice chosen
	this.response = new Array();

	//use the current time or the argument timestamp passed in
	if(args){
		if(args[0]){
			this.timestamp = args[0];
		};
		
		if(args[1]){
			this.choices = args[1];
		};
	};
	
	if(!this.timestamp){
		this.timestamp = new Date().getTime();
	};
	
	if(!this.choices){
		this.choices = new Array();
	};
};

/*
 * Add a choice that the student chose
 */
MCSTATE.prototype.addChoice = function(choice) {
	this.choices.push(choice);
};

/*
 * Add the human readable value of the choice chosen
 */
MCSTATE.prototype.addResponse = function(response) {
	this.response.push(response);
};

MCSTATE.prototype.print = function() {
};

/**
 * Returns xml representation of this student state for student data logging
 * and storage in the db.
 * @return an xml string that contains the student's work which includes
 * 		the choices they chose and a timestamp
 */
MCSTATE.prototype.getDataXML = function() {
	var dataXML = "<choices>";
	for(var x=0; x<this.choices.length; x++) {
		dataXML += "<choice>" + this.choices[x] + "</choice>";
	};
	dataXML += "</choices>";
	dataXML += "<isCorrect>" + this.isCorrect + "</isCorrect>";
	dataXML += "<timestamp>" + this.timestamp + "</timestamp>";
	
	return dataXML;
};

/**
 * Creates a state object from an xml object. Used to convert xml
 * into a real object such as when loading a project in the authoring
 * tool.
 * 
 * @param an xml object
 * @return a state object
 */
MCSTATE.prototype.parseDataXML = function(stateXML) {
	var choicesXML = stateXML.getElementsByTagName("choices")[0];
	var choicesXMLArray = choicesXML.getElementsByTagName("choice");
	var choiceArray = new Array();
	
	//loop through all the choices
	for(var x=0; x<choicesXMLArray.length; x++) {
		var choice = choicesXMLArray[x];
		var choiceValue = choice.textContent;
		choiceArray.push(choiceValue);
	};
	
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	var isCorrect = Boolean(stateXML.getElementsByTagName("isCorrect")[0].firstChild.nodeValue);
	
	if(timestamp == undefined || choiceArray.length == 0) {
		return null;
	} else {
		/*
		 * create and return the state if we've obtained sufficient data
		 * from the xml
		 */ 
		var state = new MCSTATE([timestamp.textContent, choiceArray]);
		state.isCorrect = isCorrect;
		return state;		
	};
};

/**
 * Takes in a state JSON object and returns an MCSTATE object
 * @param stateJSONObj a state JSON object
 * @return an MCSTATE object
 */
MCSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new MCSTATE object
	var mcState = new MCSTATE();
	
	//set the attributes of the MCSTATE object
	mcState.isCorrect = stateJSONObj.isCorrect;
	mcState.timestamp = stateJSONObj.timestamp;
	mcState.choices = stateJSONObj.choices;
	
	/*
	 * an array containing the human readable value of the choice(s)
	 * chosen by the student
	 */
	mcState.response = stateJSONObj.response;

	//return the MCSTATE object
	return mcState;
};

/**
 * Returns human readable form of the choices the student chose
 */
MCSTATE.prototype.getHumanReadableForm = function() {
	var humanReadableText = "isCorrect: " + this.isCorrect;
	humanReadableText += "choices: " + this.choices;
	return humanReadableText;
};

/**
 * Returns the human readable choices the student chose
 * @return a string containing the human readable choices
 * 		the student chose. if the step is check box type
 * 		the choices chosen will be separated by a comma
 */
MCSTATE.prototype.getStudentWork = function() {
	var studentWork = "";
	
	//check if there were any choices chosen
	if(this.response) {
		//loop through the array of choices
		for(var x=0; x<this.response.length; x++) {
			if(studentWork != "") {
				//separate each choice with a comma
				studentWork += ", ";
			}
			
			//add the choice to the student work
			studentWork += this.response[x];
		}
	}
	
	return studentWork;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/multiplechoice/multiplechoicestate.js');
};
/**
 * Object for storing state information of OpenResponse item.
 * @author Hiroki Terashima
 */
function OPENRESPONSESTATE() {
	this.type = "or";
	this.response = arguments[0];   // which choice the student chose.
	if(!arguments[1]) {
		//if the second argument (timestamp) was ommitted just set it to the current time
		this.timestamp = Date.parse(new Date());
	} else {
		this.timestamp = arguments[1];
	};
};


OPENRESPONSESTATE.prototype.toJSON = function() {
	encodeURIComponent(this.response);
};

OPENRESPONSESTATE.prototype.print = function() {
};

OPENRESPONSESTATE.prototype.getHtml = function() {
	return "timestamp: " + this.timestamp + "<br/>response: " + this.response;
};

OPENRESPONSESTATE.prototype.getDataXML = function() {
	return "<response><![CDATA[" + this.response + "]]></response><timestamp>" + this.timestamp + "</timestamp>";
};

OPENRESPONSESTATE.prototype.parseDataXML = function(stateXML) {
	var reponse = stateXML.getElementsByTagName("response")[0];
	var timestamp = stateXML.getElementsByTagName("timestamp")[0];
	
	if(reponse == undefined || timestamp == undefined) {
		return null;
	} else {
		return new OPENRESPONSESTATE([reponse.textContent, timestamp.textContent]);		
	};
};

/**
 * Takes in a state JSON object and returns an OPENRESPONSESTATE object
 * @param stateJSONObj a state JSON object
 * @return a OPENRESPONSESTATE object
 */
OPENRESPONSESTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	
	//set the attributes of the OPENRESPONSESTATE object
	var response = stateJSONObj.response;
	var timestamp = stateJSONObj.timestamp;
	
	//return the OPENRESPONSESTATE object
	//create a new OPENRESPONSESTATE object
	var orState = new OPENRESPONSESTATE(response, timestamp);
	return orState;
}

/**
 * Returns what the student typed
 * @return the answer the student typed
 */
OPENRESPONSESTATE.prototype.getStudentWork = function() {
	return this.response;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/openresponse/openresponsestate.js');
};
function MYSYSTEMSTATE(state, timestamp) {
	this.type = "mysystem";
	this.data = state;
	
	if(timestamp == null) {
		this.timestamp = new Date().getTime();
	} else {
		this.timestamp = timestamp;
	}
};

/**
 * Gets the xml format for the student data
 * @return an xml string with the student data
 */
MYSYSTEMSTATE.prototype.getDataXML = function() {
	var dataXML = "<data>" + this.data + "</data>";
	dataXML += "<timestamp>" + this.timestamp + "</timestamp>";
	return dataXML;
}

/**
 * Creates a state object from an xml object
 * @param stateXML an xml object
 * @return an MYSYSTEMSTATE object
 */
MYSYSTEMSTATE.prototype.parseDataXML = function(stateXML) {
	//obtain the data element
	var dataElement = stateXML.getElementsByTagName("data")[0];
	
	//obtain the timestamp element
	var timestampElement = stateXML.getElementsByTagName("timestamp")[0];
	
	//check if both elements exist
	if(dataElement != null && timestampElement != null) {
		//obtain the values for the data and timestamp
		var data = dataElement.textContent;
		var timestamp = timestampElement.textContent;
		
		//create an MYSYSTEMSTATE
		var state = new MYSYSTEMSTATE(data, timestamp);
		return state;
	} else {
		return null;
	}
}

/**
 * Takes in a state JSON object and returns an MYSYSTEMSTATE object
 * @param stateJSONObj a state JSON object
 * @return a MYSYSTEMSTATE object
 */
MYSYSTEMSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new MYSYSTEMSTATE object
	var mysystemState = new MYSYSTEMSTATE();
	
	//set the attributes of the MYSYSTEMSTATE object
	mysystemState.data = stateJSONObj.data;
	mysystemState.timestamp = stateJSONObj.timestamp;
	
	//return the MYSYSTEMSTATE object
	return mysystemState;
}

/**
 * Get the student work.
 * @return the student's work
 */
MYSYSTEMSTATE.prototype.getStudentWork = function() {
	return this.data;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/mysystem/mysystemstate.js');
};
function SVGDRAWSTATE(state, timestamp) {
	this.type = "html";
	this.data = state;
	
	if(timestamp == null) {
		this.timestamp = new Date().getTime();
	} else {
		this.timestamp = timestamp;
	}
};

/**
 * Takes in a state JSON object and returns an SVGDRAWSTATE object
 * @param stateJSONObj a state JSON object
 * @return a SVGDRAWSTATE object
 */
SVGDRAWSTATE.prototype.parseDataJSONObj = function(stateJSONObj) {
	//create a new SVGDRAWSTATE object
	var state = new SVGDRAWSTATE();
	
	//set the attributes of the SVGDRAWSTATE object
	state.data = stateJSONObj.data;
	state.timestamp = stateJSONObj.timestamp;
	
	//return the SVGDRAWSTATE object
	return state;
};

/**
 * Get the student work.
 * @return the student's work
 */
SVGDRAWSTATE.prototype.getStudentWork = function() {
	return this.data;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/draw/svg-edit/svgdrawstate.js');
};

View.prototype.loadUserAndClassInfo = function(userAndClassInfoContentObject) {
	this.userAndClassInfo = this.parseUserAndClassInfo(userAndClassInfoContentObject);
	
	this.userAndClassInfoLoaded = true;
	this.eventManager.fire('getUserAndClassInfoComplete');
};

View.prototype.getUserAndClassInfo = function() {
	return this.userAndClassInfo;
};

View.prototype.createUserAndClassInfo = function(myUserInfo, classmateUserInfos, teacherUserInfo) {
	return function(myUserInfoParam, classmateUserInfosParam, teacherUserInfoParam) {
		var myUserInfo = myUserInfoParam;
		var classmateUserInfos = classmateUserInfosParam;
		var teacherUserInfo = teacherUserInfoParam;
		
		var getWorkgroupId = function() {
			return myUserInfo.workgroupId;
		};
		
		var getUserName = function() {
			return myUserInfo.userName;
		};
		
		var getPeriodId = function() {
			return myUserInfo.periodId;
		};
		
		var getPeriodName = function() {
			return myUserInfo.periodName;
		};
		
		var getUsersInClass = function() {
			var allStudentsArray = new Array();
			for (var i=0; i<classmateUserInfos.length; i++) {
				allStudentsArray.push(classmateUserInfos[i]);
			}
			allStudentsArray.push(myUserInfo);
			return allStudentsArray;
		};
		
		var getUserNameByUserId = function(userId) {
			//check the current logged in user
			if(userId == getWorkgroupId()) {
				return getUserName();
			}
			
			//check the class mates
			for(var x=0; x<classmateUserInfos.length; x++) {
				if(userId == classmateUserInfos[x].workgroupId) {
					return classmateUserInfos[x].userName;
				}
			}
			
			//return null if no one was found with the userId
			return null;
		};
		
		var getClassmateByWorkgroupId = function(workgroupId) {
			for (var i=0; i< classmateUserInfos.length; i++) {
				if (classmateUserInfos[i].workgroupId == workgroupId) {
					return classmateUserInfos[i];
				}
			}
			return null;
		};
		
		var getClassmateIdsByPeriodId = function(periodId) {
			var classmateIds = "";
			
			//loop through all the classmates
			for (var i=0; i< classmateUserInfos.length; i++) {
				//make sure the classmate is in the same period
				if(classmateUserInfos[i].periodId == periodId) {
					//add a : if necessary
					if(classmateIds != "") {
						classmateIds += ":";
					}
					
					//add the workgroup id
					classmateIds += classmateUserInfos[i].workgroupId;
				}
			}
			return classmateIds;
		};
		
		var getClassmatePeriodNameByWorkgroupId = function(workgroupId) {
			//loop through all the classmates
			for(var x=0; x<classmateUserInfos.length; x++) {
				//get a classmate
				var classmate = classmateUserInfos[x];
				
				//check if this is the classmate we're looking for
				if(classmate.workgroupId == workgroupId) {
					//return the period name/number
					return classmate.periodName;
				}
			}
			
			//return null if we did not find the workgroup id in our classmates
			return null;
		};
		
		var getTeacherWorkgroupId = function() {
			return teacherUserInfo.workgroupId;
		};
		
		return {
			getWorkgroupId:function() {
				return getWorkgroupId();
			},
			getUserName:function() {
				return getUserName();
			},
			getPeriodId:function() {
				return getPeriodId();
			},
			getPeriodName:function() {
				return getPeriodName();
			},
			getUsersInClass:function() {
				return getUsersInClass();
			},
			getUserNameByUserId:function(userId) {
				return getUserNameByUserId(userId);
			},
			getClassmateByWorkgroupId:function(workgroupId) {
				return getClassmateByWorkgroupId(workgroupId);
			},
			getClassmateIdsByPeriodId:function(periodId) {
				return getClassmateIdsByPeriodId(periodId);
			},
			getClassmatePeriodNameByWorkgroupId:function(workgroupId) {
				return getClassmatePeriodNameByWorkgroupId(workgroupId);
			},
			getTeacherWorkgroupId:function() {
				return getTeacherWorkgroupId();
			}
		};
	}(myUserInfo, classmateUserInfos, teacherUserInfo);
};

View.prototype.parseUserAndClassInfo = function(contentObject) {
	var contentObjectJSON = contentObject.getContentJSON();
	var classInfoJSON;
	var myUserInfo;
	var classmateUserInfos;
	var teacherUserInfo;
	
	if(contentObjectJSON.myUserInfo != null) {
		classInfoJSON = contentObjectJSON.myUserInfo.myClassInfo;	
		myUserInfo = contentObjectJSON.myUserInfo;
		
		if(classInfoJSON != null) {
			if(classInfoJSON.classmateUserInfos != null) {
				classmateUserInfos = classInfoJSON.classmateUserInfos;
			}
			
			if(classInfoJSON.teacherUserInfo != null) {
				teacherUserInfo = classInfoJSON.teacherUserInfo;
			}
		}
	}
	
	return this.createUserAndClassInfo(myUserInfo, classmateUserInfos, teacherUserInfo);
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/user/userandclassinfo.js');
};



View.prototype.saveScore = function(nodeId, toWorkgroupId, fromWorkgroupId, runId, stepWorkId) {
	if (stepWorkId == "null") {
		/**
		 * If stepWorkId is null, it means that the teacher is commenting on a work that has
		 * not been submitted. currently, we do not support this.
		 */
		alert("You are trying to grade a work that has not yet been submitted.  We currently do not support this feature.");
		return;
	}
	var	score = document.getElementById("annotationScoreTextArea_" + toWorkgroupId + "_" + nodeId).value;
	// validate that score is not empty, and is an integer.
	if (score == "") {
		// if they didn't enter anything, make the score a 0.
		score = "";
	} else if (isNaN(score)) {
		alert('please enter a number');
		return;
	}
	this.saveAnnotation(nodeId, toWorkgroupId, fromWorkgroupId, 'score', score , runId, stepWorkId);
};

View.prototype.saveComment = function(nodeId, toWorkgroupId, fromWorkgroupId, runId, stepWorkId, textArea) {
	//resize the text area so that all the text is displayed without a vertical scrolbar
	resizeTextArea(textArea);
	
	if (stepWorkId == "null") {
		/**
		 * If stepWorkId is null, it means that the teacher is commenting on a work that has
		 * not been submitted. currently, we do not support this.
		 */
		alert("You are trying to grade a work that has not yet been submitted.  We currently do not support this feature.");
		return;
	}
	var	comment = document.getElementById("annotationCommentTextArea_" + toWorkgroupId + "_" + nodeId).value;
	this.saveAnnotation(nodeId, toWorkgroupId, fromWorkgroupId, 'comment', comment , runId, stepWorkId);
};

/**
 * Posts the new or updated annotation back to the server and if that was 
 * successful, it will create a local Annotation object and place it in
 * our array of Annotations so our local copy is up to date
 */
View.prototype.saveAnnotation = function(nodeId, toWorkgroup, fromWorkgroup, type, value, runId, stepWorkId) {
	//alert("nodeId: " + nodeId + "\ntoWorkgroup: " + toWorkgroup + "\nfromWorkgroup: " + fromWorkgroup + "\ntype: " + type + "\nvalue: " + value);

	//build the post annotation url with get arguments
	var postAnnotationsURL = this.getConfig().getConfigParam('postAnnotationsUrl');
	
	var postAnnotationCallback = function(text, xml, args) {
			var thisView = args[0];
			var nodeId = args[1];
			var toWorkgroup = args[2];
			var fromWorkgroup = args[3];
			var type = args[4];
			var value = args[5];
			var runId = args[6];
			var stepWorkId = args[7];
			var postTime = text;
			
			/*
			 * if the post was successful it will be returned back to us
			 * and we will then create a local Annotation object so that
			 * our local array is up to date
			 */
			var annotation = new Annotation(runId, nodeId, toWorkgroup, fromWorkgroup, type, value, postTime);
			thisView.annotations.addAnnotation(annotation);
			
			/*
			 * remove the highlighting from the student row
			 */
			var studentWorkRow = document.getElementById("studentWorkRow_" + toWorkgroup + "_" + nodeId);
			var className = studentWorkRow.className;
			studentWorkRow.className = className.replace("newWork", "");
			
			//update the Last Annotation time
			document.getElementById("lastAnnotationPostTime_" + toWorkgroup + "_" + nodeId).innerHTML = "Last Annotation: " + new Date(parseInt(postTime));
	};

	//make the call to post the annotation
	//var getUserTransaction = YAHOO.util.Connect.asyncRequest('POST', postAnnotationURL, postAnnotationCallback, "value="+value+"&stepWorkId="+stepWorkId);
	//"&runId=" + runId + "&nodeId=" + nodeId + "&toWorkgroup=" + toWorkgroup + "&fromWorkgroup=" + fromWorkgroup + "&annotationType=" + type + "&value="+value+"&stepWorkId="+stepWorkId
	this.connectionManager.request('POST', 1, postAnnotationsURL, {runId:runId, nodeId:nodeId, toWorkgroup:toWorkgroup, fromWorkgroup:fromWorkgroup, annotationType:type, value:value, stepWorkId:stepWorkId}, postAnnotationCallback, [this, nodeId, toWorkgroup, fromWorkgroup, type, value, runId, stepWorkId]);
};

/**
 * Posts the flag to the server and if it was successful, we will update our
 * local copy of the flags
 * @param nodeId the id of the node
 * @param toWorkgroup id of the student
 * @param fromWorkgroup id of the teacher
 * @param runId the id of the run
 * @param deleteFlag boolean whether to delete the flag or not
 * @param itemNumber the index of the item in the flaggedItemTable
 * @param stepWorkId the id of the node_visit of the work that is being flagged
 */
View.prototype.saveFlag = function(nodeId, toWorkgroup, fromWorkgroup, runId, deleteFlag, itemNumber, stepWorkId) {
	 if (stepWorkId == "null") {
			/**
			 * If stepWorkId is null, it means that the teacher is commenting on a work that has
			 * not been submitted. currently, we do not support this.
			 */
			alert("You are trying to flag a work that has not yet been submitted.  We currently do not support this feature.");
			document.getElementById("flagButton"+toWorkgroup).checked = false;
			return;
		}

	 // override deleteFlag with whether Flag Work checkbox is checked or not
	deleteFlag = !document.getElementById("flagButton"+toWorkgroup).checked;
		 
	//alert("nodeId: " + nodeId + "\ntoWorkgroup: " + toWorkgroup + "\nfromWorkgroup: " + fromWorkgroup + "\ntype: " + type + "\nvalue: " + value);
	var postFlagsUrl = this.getConfig().getConfigParam('postFlagsUrl');
	
	//build the post flag url with get arguments
	//var postFlagArgs = "runId=" + runId + "&nodeId=" + nodeId + "&toWorkgroup=" + toWorkgroup + "&fromWorkgroup=" + fromWorkgroup +"&stepWorkId=" + stepWorkId + "&annotationType=flag";
	var postFlagArgs = {runId:runId, nodeId:nodeId, toWorkgroup:toWorkgroup, fromWorkgroup:fromWorkgroup, stepWorkId:stepWorkId, annotationType:'flag'};

	//check if we are flagging or unflagging the flag
	if(deleteFlag == true) {
		//add the action of unflag if we are unflagging
		//postFlagArgs += "&action=unflag";
		postFlagArgs['action'] = 'unflag';
	}

	var postFlagCallback = function(text, xml, args) {
			var thisView = args[0];
			if(deleteFlag == true) {
				//if we are unflagging, remove the flag from our local array
				thisView.flags.removeFlagAnnotation(runId, nodeId, toWorkgroup, fromWorkgroup, stepWorkId);
			} else {
				/*
				 * if the post was successful it will be returned back to us
				 * and we will then create a local Flag object so that
				 * our local array is up to date
				 */
				//var flagAnnotation = Annotation.prototype.parseDataJSONString(text);
				var flagAnnotation = new Annotation(runId, nodeId, toWorkgroup, fromWorkgroup, 'flag', null, text);
				thisView.flags.addAnnotation(flagAnnotation);
			}
	};

	//make the call to post the annotation
	//var getUserTransaction = YAHOO.util.Connect.asyncRequest('POST', postFlagsUrl, postFlagCallback, postFlagArgs);
	this.connectionManager.request('POST', 1, postFlagsUrl, postFlagArgs, postFlagCallback, [this]);
	
	// update isflagged attribute on the studentWorkRow. Also update what gets shown, based on if "only show flagged items" is checked.
	if (deleteFlag) {
		global_yui.get("#studentWorkRow_"+toWorkgroup).setAttribute("isflagged", "false");
		onlyShowFilteredItemsOnClick();
	} else {
		global_yui.get("#studentWorkRow_"+toWorkgroup).setAttribute("isflagged", "true");
		onlyShowFilteredItemsOnClick();
	}
}


/**
 * Retrieve all the annotations for this run
 */
View.prototype.getAnnotations = function() {
	var getAnnotationsCallback = function(text, xml, args) {
		var thisView = args[0];
		thisView.annotations = Annotations.prototype.parseDataJSONString(text);
		eventManager.fire("getAnnotationsComplete");
		thisView.getFlags();
	};
	
	getAnnotationsArgs = {runId:this.getConfig().getConfigParam('runId')};
	this.connectionManager.request('GET', 1, this.getConfig().getConfigParam('getAnnotationsUrl'), getAnnotationsArgs, getAnnotationsCallback, [this]);
};


/**
 * Retrieve all the flags for this run
 */
View.prototype.getFlags = function() {
	var getFlagsCallback = function(text, xml, args) {
		var thisView = args[0];
		thisView.flags = Annotations.prototype.parseDataJSONString(text);
		eventManager.fire("getFlagsComplete");
	};
	this.connectionManager.request('GET', 1, this.getConfig().getConfigParam('getFlagsUrl'), null, getFlagsCallback, [this]);
};


/**
 * Retrieve all the flags for this run
 */
View.prototype.getFlags_old = function() {
	var flagCallback = {
			success: function(o) {
				//parse the xml flags object that contains all the flags
				flags = Annotations.prototype.parseDataJSONString(o.responseText);
		  	},
			failure: function(o) {
				alert('Error: Unable to load user info');
			},
			argument: ["a", "b", "c"],
			scope:this
	};
	var getUserTransaction = YAHOO.util.Connect.asyncRequest('GET', getFlagsUrl, flagCallback, null);
};

/**
 * Checks if the score entered by the teacher is less than or equal to
 * the max score. If the score entered is greater, we will display an
 * error message and delete the entered score.
 * @param nodeId
 * @param toWorkgroupId
 * @param fromWorkgroupId
 * @param runId
 * @param stepWorkId
 */
View.prototype.checkAndSaveScore = function(nodeId, toWorkgroupId, fromWorkgroupId, runId, stepWorkId) {
	//get the teacher entered score
	//var	score = document.getElementById("annotationScoreTextArea" + toWorkgroupId).value;
	
	//get the max score for this step, or "" if there is no max score
	//var maxScore = this.getMaxScoreValueByNodeId(nodeId);
	
	/*
	 * check if the score is greater than the max score
	 * I need to check if maxScore + "" != "" because if
	 * the teacher set a maxScore of 0, 0 == "" is true
	 * but "0" == "" is false, this is just a very minor
	 * corner case
	 */
	/*
	if((maxScore + "") != "" && score > maxScore) {
		//the score was not valid
		alert('Error: Score is greater than Max Score');
		document.getElementById("annotationScoreTextArea" + toWorkgroupId).value = '';
	} else {
		//the score was valid so we will save it 
		this.saveScore(nodeId, toWorkgroupId, fromWorkgroupId, runId, stepWorkId);
	}
	*/
	
	this.saveScore(nodeId, toWorkgroupId, fromWorkgroupId, runId, stepWorkId);
};

/**
 * Save the max score the teacher has specified
 * @param runId
 * @param nodeId
 */
View.prototype.saveMaxScore = function(runId, nodeId) {
	/*
	 * updates the local copy of the max scores after the server
	 * has successfully updated it on the server
	 */
	var postMaxScoreCallback = function(text, xml, args) {
		var thisView = args[0];
		
		//parse the json that is returned
		var maxScoreObj = yui.JSON.parse(text);
		
		//get the node id the max score is for
		var nodeId = maxScoreObj.nodeId;
		
		//get the value for the max score
		var maxScoreValue = maxScoreObj.maxScoreValue;
		
		//update the max score in the maxScores object
		thisView.updateMaxScore(nodeId, maxScoreValue);
	};
	
	//get the new max score the teacher has entered for this nodeId
	var maxScoreValue = document.getElementById("maxScore_" + nodeId).value;
	
	//parse the value from the text box to see if it is a valid integer
	var maxScoreValueInt = parseInt(maxScoreValue);
	
	//check that the value entered is a number greater than or equal to 0
	if(isNaN(maxScoreValueInt) || maxScoreValueInt < 0) {
		//the value is invalid so we will notify the teacher
		alert("Error: invalid Max Score value, please enter a value 0 or greater");
		
		//set the value back to the previous value
		document.getElementById("maxScore_" + nodeId).value = this.getMaxScoreValueByNodeId(nodeId);
		
		return;
	}
	
	//create the args used to update the max score on the server
	var postMaxScoreParams = {rundId: runId, nodeId: nodeId, maxScoreValue: maxScoreValue};
	
	//send the new max score data back to the server
	this.connectionManager.request('POST', 1, this.getConfig().getConfigParam('postMaxScoreUrl'), postMaxScoreParams, postMaxScoreCallback, [this]);
};

/**
 * Get the max score for the specified step/nodeId
 * If there are no max scores or there is no max score
 * for the step/nodeId we will just return ""
 * @param nodeId the step/nodeId
 * @return the max score for the step/nodeId or ""
 */
View.prototype.getMaxScoreValueByNodeId = function(nodeId) {
	var maxScore = "0";
	
	//check if the max scores object has been set
	if(this.maxScores != null) {
		//get the max score for this step
		maxScore = this.maxScores.getMaxScoreValueByNodeId(nodeId) + "";	
	}
	
	return maxScore;
};

/**
 * Update the max score for the given nodeId. Create a MaxScores
 * object if one does not exist.
 * @param nodeId the id of the node
 * @param maxScoreValue the new max score value
 */
View.prototype.getMaxScoresSum = function() {
	//check if maxScores has been set
	if(this.maxScores == null) {
		//it has not been set so we will make a new MaxScores object
		return 0;
	} else {
		return this.maxScores.getMaxScoresSum();
	}
};

View.prototype.updateMaxScore = function(nodeId, maxScoreValue) {
	//check if maxScores has been set
	if(this.maxScores == null) {
		//it has not been set so we will make a new MaxScores object
		this.maxScores = new MaxScores();
	}
	
	//update the score for the given nodeId
	this.maxScores.updateMaxScore(nodeId, maxScoreValue);
};

/**
 * Remove the flagged item from the flaggedItemsTable
 */
function removeFlaggedItemFromDisplay(itemNumber) {
	//get the flaggedItemsTable
	var flaggedItemTable = document.getElementById('flaggedItemsTable');

	//get the flagged item
	var flaggedItemToRemove = document.getElementById('flaggedItem' + itemNumber);

	/*
	 * remove the flagged item from the table. flaggedItemTable.childNodes[0] 
	 * is the tbody which contains the tr elements.
	 */
	flaggedItemTable.childNodes[0].removeChild(flaggedItemToRemove);

	//check if there are no more flagged items for this step
	if(flaggedItemsTableEmpty()) {
		//display the message that says there are no flagged responses
		addNoFlaggedResponsesMsg();
	}
}

/**
 * Display the "No flagged responses" message to the flaggedItemsTable
 */
function addNoFlaggedResponsesMsg() {
	//get the flaggedItemsTable
	var flaggedItemTable = document.getElementById('flaggedItemsTable');

	//create the row to display the message
	var noFlaggedResponsesRow = document.createElement("tr");

	//set the id
	noFlaggedResponsesRow.id = 'noFlaggedResponses';

	//set the text in the row
	noFlaggedResponsesRow.innerHTML = "<td>No flagged responses</td>";

	//add the row to the table if the table is empty
	if(flaggedItemsTableEmpty()) {
		/*
		 * add the message to the table. flaggedItemTable.childNodes[0] 
		 * is the tbody which contains the tr elements.
		 */
		flaggedItemTable.childNodes[0].appendChild(noFlaggedResponsesRow);
	}
}

/**
 * Remove the "No flagged responses" message from the flaggedItemsTable
 */
function removeNoFlaggedResponsesMsg() {
	//get the flaggedItemsTable
	var flaggedItemTable = document.getElementById('flaggedItemsTable');

	//get the row that displays the message
	var noFlaggedResponsesRow = document.getElementById('noFlaggedResponses');

	//check if the row exists
	if(noFlaggedResponsesRow != null) {
		/*
		 * remove the message from the table. flaggedItemTable.childNodes[0] 
		 * is the tbody which contains the tr elements.
		 */
		flaggedItemTable.childNodes[0].removeChild(noFlaggedResponsesRow);
	}
}

/**
 * Check if the flaggedItemsTable contains any flagged items
 */
function flaggedItemsTableEmpty() {
	var flaggedItemTable = document.getElementById('flaggedItemsTable');
	
	//check how many items are in the table
	if(flaggedItemTable.childNodes[0].childNodes.length == 1) {
		
		var noFlaggedResponsesRow = document.getElementById('noFlaggedResponses');
		
		/*
		 * check if the one item in the table is the "no flagged responses"
		 * row
		 */
		if(noFlaggedResponsesRow != null) {
			/*
			 * the one item is the "no flagged responses" row so the table has
			 * no flagged items and is empty
			 */
			return true;
		} else {
			/*
			 * the one item is not the "no flagged responses" row and is a
			 * flagged item, so the table is not empty
			 */
			return false;
		}
	} else {
		//there is more than one item so the table is not empty
		return false;
	}
}

/**
 * Show the total scores of all students
 * Go thru all of the classmates and get their score
 */
function showScores() {
	var classmates = vle.myClassInfo.classmates;
	var htmlSoFar = "score\tname\n";
	for (var i=0; i < classmates.length; i++) {
		var classmate = classmates[i];
		var classmateScore = annotations.getTotalScoreByToWorkgroup(classmate.workgroupId);
		htmlSoFar += classmateScore + "\t" + classmate.userName +"\n";
	}
	alert(htmlSoFar);
}



//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_annotations.js');
};
View.prototype.gradingDispatcher = function(type, args, obj) {
	if(type=='displayGradeByStepGradingPage') {
		obj.displayGradeByStepGradingPage(args[0], args[1]);
	} else if(type=='displayGradeByTeamGradingPage') {
		obj.displayGradeByTeamGradingPage(args[0]);
	} else if(type=='saveScore') {
		obj.checkAndSaveScore(args[0], args[1], args[2], args[3], args[4]);
	} else if(type=='saveComment') {
		obj.saveComment(args[0], args[1], args[2], args[3], args[4], args[5]);
	} else if(type=='saveFlag') {
		obj.saveFlag(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
	} else if(type=='processUserAndClassInfoComplete') {
		obj.getProjectMetaData();
	} else if(type=='gradingConfigUrlReceived') {
		obj.getGradingConfig(args[0]);
	} else if(type=='getGradingConfigComplete') {
		obj.loadProject(args[0], args[1], args[2]);
	} else if(type=='loadingProjectComplete') {
		obj.getStudentUserInfo();
	} else if(type=='getStudentNavigationXLSExport') {
		obj.getStudentNavigationXLSExport();
	} else if(type=='getStudentWorkXLSExport') {
		obj.getStudentWorkXLSExport();
	} else if(type=='getProjectMetaDataComplete') {
		obj.getRunExtras();
	} else if(type=='getRunExtrasComplete') {
		obj.initiateDisplayGradeByStep();
	} else if(type=='saveMaxScore') {
		obj.saveMaxScore(args[0], args[1]);
	} else if(type=='showScoreSummary') {
		obj.showScoreSummary();
	} else if(type=='filterPeriod') {
		obj.filterPeriod(args[0]);
	} else if(type=='displayGradeByStepSelectPage') {
		obj.displayGradeByStepSelectPage();
	} else if(type=='displayGradeByTeamSelectPage') {
		obj.displayGradeByTeamSelectPage();
	}
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_dispatcher.js');
};



/**
 * Only Show specified columns
 * @param a list of array of column names  arguments[]
 * if columnNames is null or empty, show all.
 */
function showColumns() {
	if (arguments.length > 0) {
		// first hide all of the columns and then re-show the specified columns
		global_yui.all(".gradeColumn").setStyle("display","none");
		for (var i=0; i<arguments.length; i++) {
			global_yui.all("." + arguments[i]).setStyle("display","");
		}
	} else {
		// show all
		global_yui.all(".gradeColumn").setStyle("display","");
	}
}


/**
 * Callback for the onlyShowFilteredItems check box
 */
function onlyShowFilteredItemsOnClick() {
	 // check if the checkbox is checked
	var isChecked = document.getElementById("onlyShowFilteredItemsCheckBox").checked;
	if (isChecked) {
		// only show filtered items
		global_yui.get("#studentWorkTable").queryAll("[isflagged=false]").setStyle("display", "none");
	} else {
		// show all items
		global_yui.get("#studentWorkTable").queryAll("tr").setStyle("display", "");
	}
}

/**
 * Callback for the onlyShowFilteredItems check box
 */
function onlyShowWorkOnClick() {
	 // check if the checkbox is checked
	var isChecked = document.getElementById("onlyShowWorkCheckBox").checked;
	if (isChecked) {
		// only show filtered items
		showColumns('workColumn');
	} else {
		// show all items
		showColumns();
	}
}



/**
 * Displays the steps in the project and then gets the student work
 */
View.prototype.initiateDisplayGradeByStep = function() {
	this.displayGradeByStepSelectPage();
	this.getStudentWork();
};


View.prototype.displayGradeByTeamSelectPage = function() {
	var displayGradeByTeamSelectPageHtml = "";
	
	//the button to go back to the step selection page
	displayGradeByTeamSelectPageHtml += "<table id='selectedStepTable'><tr><td class='selectedStep'></td><td class='button'><a href='#' id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByStepSelectPage\")'>Go Back To Steps</a></td></tr></table>";
	
	//get the html that will be used to filter workgroups by period
	displayGradeByTeamSelectPageHtml += this.getPeriodRadioButtonHtml();
	
	//the table that will display the scores for the workgroups
	displayGradeByTeamSelectPageHtml += "<table border='1' id='showScoreTable' class='showScoreTable'>";
	
	//the header row
	displayGradeByTeamSelectPageHtml += "<tr><th class='gradeColumn'>Period</th><th class='gradeColumn'>Who</th></tr>";
	
	//get the student work sorted alphabetically
	var vleStates = this.getVleStatesSortedByUserName();
	
	//get the max score for the project
	var maxScoresSum = this.getMaxScoresSum();
	
	//loop through all the student work objects
	for(var x=0; x<vleStates.length; x++) {
		//get a vleState
		var vleState = vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;

		//get the user names for the workgroup
		var userNames = this.getUserNamesByWorkgroupId(workgroupId, 1);
		
		//get the period the workgroup is in
		var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);

		//add classes for styling
		var studentTRClass = "showScoreRow studentWorkRow period" + periodName;
		
		//add the html row for this workgroup
		displayGradeByTeamSelectPageHtml += "<tr class='" + studentTRClass + "' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workgroupId + "'])\"><td class='showScorePeriodColumn'>" + periodName + "</td><td class='showScoreWorkgroupIdColumn'>" + userNames + "</td></tr>";
	}
	
	displayGradeByTeamSelectPageHtml += "</table>";
	
	//set the html into the div so it is displayed
	document.getElementById('gradeByStepDiv').innerHTML = displayGradeByTeamSelectPageHtml;
};

/**
 * Displays all the steps in the project as links. When a step is clicked on,
 * the user will be brought to a page that displays all the work for that
 * step from all students in the run.
 */
View.prototype.displayGradeByStepSelectPage = function() {
	//the html that will display all the steps in the project
	
	var displayGradeByStepSelectPageHtml = "";

	//start the table that will contains links for the steps
	displayGradeByStepSelectPageHtml += "<table class='chooseStepToGradeTable'><tbody>";

	//add the export and refresh button at the top of the page
	displayGradeByStepSelectPageHtml += "<tr class='runButtons'><td colspan='2'><input type='button' value='Export Student Work as Spreadsheet Data' onClick=\"eventManager.fire('getStudentWorkXLSExport')\"></input>";
	displayGradeByStepSelectPageHtml += "<input type='button' value='Export Student Navigation as Spreadsheet Data' onClick=\"eventManager.fire('getStudentNavigationXLSExport')\"></input>";
	displayGradeByStepSelectPageHtml += "<input type='button' value='Show Score Summary for Run' onClick=\"eventManager.fire('showScoreSummary')\"></input>";
	displayGradeByStepSelectPageHtml += "<input type='button' value='Refresh Screen' onClick='refresh()'></input>";
	displayGradeByStepSelectPageHtml += "<input type='button' value='Grade By Team' onClick=\"eventManager.fire('displayGradeByTeamSelectPage')\"></input></td></tr>";

	//reset the step number counter used to label the step numbers
	this.stepNumber = 1;

	//reset the activity counter used to label activity numbers
	this.activityNumber = 0;

	this.nodeIdToNodeTitleArray = new Array();
	
	/*
	 * get the html that displays all the steps for the project as links
	 * to pages where the teacher can grade the step
	 */
	displayGradeByStepSelectPageHtml += this.displayGradeByStepSelectPageHelper(this.getProject().getRootNode());

	//add the refresh button at the top of the page
	document.getElementById('gradeByStepDiv').innerHTML = "<input type='button' value='Refresh All Steps' onClick='refresh()'>";
	//close the table
	displayGradeByStepSelectPageHtml += "</tbody></table>";

	//set the html into the div
	unlock();
	document.getElementById('gradeByStepDiv').innerHTML = displayGradeByStepSelectPageHtml;
	
	/*
	 * set the node id to node titles mappings to an element that will be
	 * passed back to the server when export to xls is called. the mapping
	 * is passed back as a single string that is automatically delimited
	 * by a comma ,
	 */
	document.getElementById('nodeIdToNodeTitles').value = this.nodeIdToNodeTitleArray.toString();

	/*
	 * set the workgroup ids to an element that will be passed back to the
	 * server when export to xls is called. the workgroup ids are automatically
	 * delimited by a comma ,
	 */
	document.getElementById('workgroupIds').value = studentWorkgroupIds.toString();

	/*
	 * set the run id to an element that will be passed back to the server
	 * when the export to xls is called 
	 */
	document.getElementById('runId').value = this.getConfig().getConfigParam('runId');

	/*
	 * set the project title to an element that will be passed back to the server
	 */
	document.getElementById('projectName').value = this.project.getTitle();
};

/**
 * Recursive function that accumulates the html that displays all the activities
 * and steps in a project
 */
View.prototype.displayGradeByStepSelectPageHelper = function(node) {
	var displayGradeByStepSelectPageHtml = "";
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		if(node.type == "HtmlNode") {
			//the node is an html node so we do not need to display a link for it, we will just display the text
			displayGradeByStepSelectPageHtml += "<tr><td class='chooseStepToGradeStepTd'><p>" + this.stepNumber + ". " + node.title + " [" + node.type + "]</p></td></tr>";
		} else {
			//get the max score for this step, or "" if there is no max score
			var maxScore = this.getMaxScoreValueByNodeId(node.id);
			
			//this is a node that students perform work for so we will display a link
			displayGradeByStepSelectPageHtml += "<tr><td class='chooseStepToGradeStepTd'><a href='#' onClick='eventManager.fire(\"displayGradeByStepGradingPage\",[" + this.stepNumber + ", \"" + node.id + "\"])'>" + this.stepNumber + ". " + node.title + " [" + node.type + "]</a></td><td class='chooseStepToGradeMaxScoreTd'>Max Score: <input id='maxScore_" + node.id + "' type='text' value='" + maxScore + "' onblur='eventManager.fire(\"saveMaxScore\", [" + this.getConfig().getConfigParam('runId') + ", \"" + node.id + "\"])'/></td></tr>";
		}
		
		/*
		 * create the mapping of node id to node title delimited by &##58;
		 * &#58; is the ascii value of : and we use two #'s in case the
		 * author used a : in the step title to prevent collisions and
		 * corruption when parsing this after this string is sent
		 * back to the server
		 * e.g. node_1.html&##58;1. Introduction
		 */
		var nodeIdToNodeTitle = node.id + "###58;" + this.stepNumber + ". " + node.title;

		/*
		 * add the mapping to the array that we are using to keep track
		 * of all the mappings. replace all commas , with &##44;
		 * &#44; is the ascii value of , and we use two #'s to prevent
		 * collisions and parsing errors
		 */
		this.nodeIdToNodeTitleArray.push(nodeIdToNodeTitle.replace(/,/g, "###44;"));
		
		this.stepNumber++;
	} else {
		/*
		 * we need to skip the first sequence because that is always the
		 * master sequence. we will encounter the master sequence when 
		 * this.activityNumber is 0, so all the subsequent activities will
		 * start at 1.
		 */
		if(this.activityNumber != 0) {
			//this node is a sequence so we will display the activity number and title
			displayGradeByStepSelectPageHtml += "<tr><td class='chooseStepToGradeActivityTd'><h4>A" + this.activityNumber + ". " + node.title + "</h4></td></tr>";
		}

		//increment the activity number
		this.activityNumber++;
		
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//get the html for the children
			displayGradeByStepSelectPageHtml += this.displayGradeByStepSelectPageHelper(node.children[x]);
		}
	}

	return displayGradeByStepSelectPageHtml;
};



/**
 * Obtains the number of rows the a textarea should have such that it will
 * not display vertical scrollbars
 * @param cols the number of columns in the textarea
 * @param value the text that is in the textarea
 * @return the number of rows to set for the textarea
 */
function getTextAreaNumRows(cols, value) {
	//the number or rows the textarea should have to prevent a vertical scrollbar
	var newRowSize = 0;

	//the number of chars on the current line we're looking at
	var tempLineLength = 0;

	//the index of the last ' ' char
	var lastSpaceIndex = null;

	//the index of the last char that was used as a line break
	var lastLineBreak = 0;

	/*
	 * flag specifies whether any of the lines has overflowed past the right
	 * which causes a horizontal scrollbar to show up at the bottom of the
	 * textarea
	 */
	var overflow = false;

	//loop through each char in the value
	for(var x=0; x<value.length; x++) {
		//get the current char
		var c = value.charAt(x);

		if(c == '\n') {
			/*
			 * the char was a new line so we will increase the number of lines
			 * that we want in the textarea by 1
			 */
			newRowSize += 1;
			
			/* 
			 * set the last line break char index to the current x, this is
			 * used later to handle the overflow case
			 */
			lastLineBreak = x;

			/*
			 * set the temp line length to 0 since we will be starting on a new
			 * line since we've encountered a newline char
			 */
			tempLineLength = 0;

			/*
			 * set the last space index to null because we are starting on a new
			 * new line so there won't be a last space index yet
			 */
			lastSpaceIndex = null;
		} else if(c == ' ') {
			//set the last space index, this is used later to handle overflow
			lastSpaceIndex = x;

			//increase the count of the chars on the current line
			tempLineLength += 1;

			/*
			 * check if the current line is equal to or larger than the
			 * number of columns in the textarea
			 */
			if(tempLineLength >= cols) {
				//the line length was equal or larger so we need to move to a new line
				
				//increment the number of rows
				newRowSize += 1;

				//set the last line break char index to the current x 
				lastLineBreak = x;
				
				//reset the line length to 0 to get ready to count the next line's chars
				tempLineLength = 0;
			}
		} else if(c != ' ') {
			//increment the count of the chars on the current line
			tempLineLength += 1;

			/*
			 * check if the current line is equal to or larger than the
			 * number of columns in the textarea
			 */
			if(tempLineLength >= cols) {
				//get the next char in the line
				var nextCIndex = x + 1;
				var nextC = value.charAt(nextCIndex);

				if(nextC == ' ') {
					//the next char was a space or new line so we will end the line
					
					//increment the number of rows
					newRowSize += 1;

					//set the last line break char index to the next char
					lastLineBreak = nextCIndex;

					//reset the line length to 0 to get ready to count the next line's chars			
					tempLineLength = 0;
				} else if(nextC == '\n') {
					/*
					 * the next char is a new line but we don't need to do anything
					 * because when the x counter from the for loop moves to the 
					 * nextCIndex it will handle the new line
					 */
				} else {
					//next char is not a space or new line
					
					/*
					 * check if the last space index has already been used to
					 * count as a line break
					 */ 
					if(lastSpaceIndex == null || lastLineBreak == lastSpaceIndex) {
						/*
						 * we can't break up the line anymore which means this line
						 * will overflow past the right of the textarea and a 
						 * horizontal scrollbar will display at the bottom of the
						 * textarea
						 */
						overflow = true;
					} else {
						/*
						 * find the last space and end the line there since it hasn't 
						 * been used for a line break
						 */
						x = lastSpaceIndex;

						//increment the number of rows
						newRowSize += 1;

						//reset the line length to 0 to get ready to count the next line's chars
						tempLineLength = 0;

						/*
						 * set the last line break char index to the x that we have
						 * just updated
						 */ 
						lastLineBreak = x;
					}
				}
			}
		}
	}

	/*
	 * check if any lines overflowed past the right side, causing a horizontal
	 * scrollbar to show up
	 */
	if(overflow) {
		//provide an extra row to make up for the horizontal scrollbar
		newRowSize += 1;
	}

	/*
	 * provide an extra row so that there is an empty row at the bottom of the
	 * teacher comment to make it easier for teachers to place the cursor
	 * in the box to continue adding to the comment
	 */
	newRowSize += 1;

	/*
	 * return the number of rows the textarea should have so that there won't
	 * be a vertcal scroll bar
	 */
	return newRowSize;
}

/**
 * Sets the number of rows in the text area such that there are enough
 * rows to prevent a vertical scroll bar from displaying 
 * @param textArea a TextArea dom object
 */
function resizeTextArea(textArea) {
	//get the number of cols in the textarea
	var cols = textArea.cols;

	//get the text in the text area
	var value = textArea.value;

	//check if the value is null
	if(value == null) {
		//set it to empty string
		value = "";
	}

	//set the number of rows
	textArea.rows = getTextAreaNumRows(cols, value);
}

/**
 * Displays the grading view for a step which includes all the student ids,
 * student work, and grading text box
 * @param nodeId the step to display the grading view for
 */
View.prototype.displayGradeByStepGradingPage = function(stepNumber, nodeId) {
	var gradeByStepGradingPageHtml = "";

	//show the step title and prompt
	gradeByStepGradingPageHtml += "<table id='selectedStepTable'><tr><td class='selectedStep'>" + stepNumber + ". " + this.getProject().getNodeById(nodeId).title + "</td>";

	//show the button to go back to select another step
	gradeByStepGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByStepSelectPage\")'>Select Another Step</a></td></tr></table>";

	//show the button that toggles the question for the step
	gradeByStepGradingPageHtml += "<div id='questionContentContainer'><div id='questionContentHeader'><b>Question:</b><a href=\"javascript:togglecomments('questionContentText')\">Hide/Show the Question</a></div>";
	
	//get the prompt/question for the step
	var nodePrompt = this.getProject().getNodePromptByNodeId(nodeId);
	
	//the area where the question for the step will be displayed
	gradeByStepGradingPageHtml += "<div class='commentShown' id='questionContentText'>" + nodePrompt + "</div></div>";

	//get the html that will display the radio buttons to filter periods
	gradeByStepGradingPageHtml += this.getPeriodRadioButtonHtml();

	//check box to hide personal info
	gradeByStepGradingPageHtml += "<div id='filterOptions'><input type='checkbox' id='onlyShowWorkCheckBox' onClick=\"onlyShowWorkOnClick();\"/><p>Hide Personal Info</p>";
	
	//check box to filter only flagged items
	gradeByStepGradingPageHtml += "<input type='checkbox' id='onlyShowFilteredItemsCheckBox' value='show filtered items' onClick=\"onlyShowFilteredItemsOnClick();\"/><p>Show Flagged Items Only</p></div>";
	
	gradeByStepGradingPageHtml += "<div id='flaggedItems'></div>";

	//create the table that displays all the student data, student work, and grading text box
	gradeByStepGradingPageHtml += "<table border='1' id='studentWorkTable' class='studentWorkTable'>";

	//add the header for the table
	gradeByStepGradingPageHtml += "<tr><th class='gradeColumn workgroupIdColumn'>who</th><th class='gradeColumn workColumn'>student work</th><th class='gradeColumn gradingColumn'>teacher comment / score</th><th class='gradeColumn annotationColumn'>tools</th></tr>";
	
	var vleStates = this.getVleStatesSortedByUserName();
	
	var runId = this.getConfig().getConfigParam('runId');
	
	var teacherId = this.getUserAndClassInfo().getTeacherWorkgroupId();
	
	//loop through all the vleStates, each vleState is for a workgroup
	for(var x=0; x<vleStates.length; x++) {
		//get a vleState
		var vleState = vleStates[x];
		
		var workgroupId = vleState.dataId;

		//get the latest work for the current workgroup 
		var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
		var stepWorkId = null;
		var studentWork = null;
		var latestNodeVisitPostTime = null;
		
		if (latestNodeVisit != null) {
			stepWorkId = latestNodeVisit.id;
			studentWork = latestNodeVisit.getLatestWork();
			latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
		}

		//get the node
		var node = this.getProject().getNodeById(nodeId);
		
		if (studentWork != "" && node.className == "mysystem") {
			var divId = "mysystemDiagram_"+workgroupId;
			// if the work is for a mysystem node we need to call the print function to print the image in the cell
			studentWork = "<div id='"+divId+"' class='mysystemCell' onclick=\"showDiagram('"+divId+"')\" style=\"height:350px;\">"+studentWork+"</div>";
		} else if (studentWork != "" && node.type == "SVGDrawNode") {
			// if the work is for a SVGDrawNode, embed the svg
			studentWork = "<a href='/vlewrapper/getsvg.svg?type=svg&stepWorkId="+stepWorkId+"' target=_blank>enlarge</a>"
				+ "<iframe src='/vlewrapper/getsvg.svg?type=svg&stepWorkId="+stepWorkId+"'></iframe>";
		}
		
		//obtain the annotation for this workgroup and step if any
		var annotationComment = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherId, "comment");
		var annotationScore = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherId, "score");
		
		//the value to display in the comment text box
		var annotationCommentValue = "";
		var annotationCommentPostTime = "";
		
		if(annotationComment != null) {
			//the annotation exists so we will populate the values from the annotation
			annotationCommentValue = annotationComment.value;
			annotationCommentPostTime = annotationComment.postTime;
		}

		//the value to display in the score text box
		var annotationScoreValue = "";
		var annotationScorePostTime = "";
		
		if (annotationScore != null) {
			//get the value of the annotationScore
			annotationScoreValue = annotationScore.value;
			annotationScorePostTime = annotationScore.postTime;
		}
		
		var latestAnnotationPostTime = Math.max(annotationCommentPostTime, annotationScorePostTime);
		
		
		//get the period name for this student
		var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);
		
		var flagsForNodeIdAndToWorkgroup = this.flags.getAnnotationsByNodeIdAndToWorkgroup(nodeId, workgroupId);
		var flagChecked = "";
		var isFlagged = 'false';
		if(flagsForNodeIdAndToWorkgroup != null && flagsForNodeIdAndToWorkgroup.length != 0) {
			flagChecked = " checked";
			isFlagged = 'true';
		}
		
		var studentTRClass = "studentWorkRow period" + periodName;
		
		if(latestAnnotationPostTime < latestNodeVisitPostTime) {
			studentTRClass += " newWork";
		}
		
		gradeByStepGradingPageHtml += "<tr class='" + studentTRClass + "' id='studentWorkRow_"+workgroupId+"_"+nodeId+"' isflagged='" + isFlagged + "'>";

		//get the user names in the workgroup, with 2 <br>'s inbetween each user name
		var userNamesHtml = this.getUserNamesByWorkgroupId(workgroupId, 2);
		
		//get the period the workgroup is in
		//userNamesHtml += "<br><br>[Period " + periodName + "]";
		
		//display the student workgroup id
		gradeByStepGradingPageHtml += "<td class='gradeColumn workgroupIdColumn'><a href='#' onClick=\"eventManager.fire('displayGradeByTeamGradingPage', ['" + workgroupId + "'])\">" + userNamesHtml + "</a><br><br>[Period " + periodName + "]</td>";
		//gradeByStepHtml += "<td class='gradeColumn workgroupIdColumn'>" + vle.myClassInfo.getClassmate(workgroupId).userName + "</td>";
		
		//display the student work for this step/node
		gradeByStepGradingPageHtml += "<td class='gradeColumn workColumn'>" + studentWork + "</td>";


		var textAreaCols = 40;
		var commentTextAreaRows = getTextAreaNumRows(textAreaCols, annotationCommentValue);
		
		var lastAnnotationPostTime = new Date(latestAnnotationPostTime);
		
		var lastAnnotationMessage = "";
		
		if(lastAnnotationPostTime != null && lastAnnotationPostTime.getTime() != new Date(0).getTime()) {
			lastAnnotationMessage = "Last Annotation: " + lastAnnotationPostTime;
		} else {
			lastAnnotationMessage = "Last Annotation: N/A";
		}
		
		//get the max score for this step, or "" if there is no max score
		var maxScore = this.getMaxScoreValueByNodeId(nodeId);
		
		/*
		 * display the comment text box and populate the comment value
		 */
		gradeByStepGradingPageHtml += "<td class='gradeColumn gradingColumn'><table id='teacherAnnotationTable'>";
		gradeByStepGradingPageHtml += "<tr><td>Score: <input type='text' id='annotationScoreTextArea_" + workgroupId + "_" + nodeId + "' value='" + annotationScoreValue + "' onblur=\"eventManager.fire('saveScore', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"'])\" /> / " + maxScore + "</td></tr>";
		gradeByStepGradingPageHtml += "<tr><td>Comment:<br><textarea wrap='soft' cols='" + textAreaCols + "' rows='" + commentTextAreaRows + "' id='annotationCommentTextArea_" + workgroupId + "_" + nodeId + "' onblur=\"eventManager.fire('saveComment', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"', this])\">" + annotationCommentValue + "</textarea></td></tr>";
		gradeByStepGradingPageHtml += "<tr><td><p id='lastAnnotationPostTime_" + workgroupId + "_" + nodeId + "' class='lastAnnotationPostTime'>" + lastAnnotationMessage + "</p></td></tr>";
		gradeByStepGradingPageHtml += "</table></td>";

		/*
		//get the flag (if any) that corresponds to the row we are displaying
		var flag = flags.getLatestAnnotation(runId, nodeId, workgroupId, teacherId, "flag");
		var checked = "";
		
		if(flag != null) {
			//if there was a flag then we will set the checkbox to checked
			checked = "checked";
		}
		*/

		//display the checkbox for the flagging
		//gradeByStepHtml += "<td><input type='checkbox' name='flagCheckBox" + workgroupId + "' id='flagCheckBox" + workgroupId + "' onClick='saveFlag(\"" + nodeId + "\", " + workgroupId + ", " + teacherId + ", document.getElementById(\"flagCheckBox" + workgroupId + "\").checked, \"" + studentWork + "\", " + runId + ")' + " + checked + "></td>";
		
		gradeByStepGradingPageHtml += "<td class='gradeColumn toolsColumn'><div></div><div class='gradeColumn flagColumn'><input type='checkbox' value='Flag' name='flagButton" + workgroupId + "' id='flagButton" + workgroupId + "' onClick='eventManager.fire(\"saveFlag\", [\"" + nodeId + "\", " + workgroupId + ", " + teacherId + ", " + runId + ", false, null, \""+ stepWorkId +"\"])'" + flagChecked + ">Flag</div></td>";
		
		gradeByStepGradingPageHtml += "</tr>";
	}

	gradeByStepGradingPageHtml += "</table>";

	//set the html in the div so the user can see it
	document.getElementById('gradeByStepDiv').innerHTML = gradeByStepGradingPageHtml;


	// if this step is a mysystem step, call showDiagrams for each div that has student data
	if (node.className == "mysystem") {
		global_yui.all(".mysystemCell").each(showDiagramNode);
	} 
};

View.prototype.displayGradeByTeamGradingPage = function(workgroupId) {
	var gradeByTeamGradingPageHtml = "";
	
	var userNames = this.getUserNamesByWorkgroupId(workgroupId, 1);
	
	//show the step title and prompt
	gradeByTeamGradingPageHtml += "<table id='selectedStepTable'><tr><td class='selectedStep'>" + userNames + "</td>";

	//show the button to go back to select another step
	gradeByTeamGradingPageHtml += "<td class='button'><a href='#' id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByTeamSelectPage\")'>Select Another Workgroup</a></td></tr></table>";

	gradeByTeamGradingPageHtml += "<table id='studentWorkTable' class='studentWorkTable'><div>";
	
	var vleState = this.getVleStateByWorkgroupId(workgroupId);
	
	//reset the step number counter used to label the step numbers
	this.stepNumber = 1;

	//reset the activity counter used to label activity numbers
	this.activityNumber = 0;
	
	gradeByTeamGradingPageHtml += this.displayGradeByTeamGradingPageHelper(this.getProject().getRootNode(), vleState);
	
	gradeByTeamGradingPageHtml += "</div></table>";
	
	/*
	var nodeIds = this.getProject().getNodeIds();
	nodeIds = nodeIds.split(":");
	
	for(var nodeIdIndex=0; nodeIdIndex<nodeIds.length; nodeIdIndex++) {
		var nodeId = nodeIds[nodeIdIndex];
		
		gradeByTeamGradingPageHtml += "<tr><td>" + nodeId + "</td></tr>";
	}
	
	gradeByTeamGradingPageHtml += "</table>";
	*/
	/*
			//get the latest work for the current workgroup 
		var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
		var stepWorkId = null;
		var studentWork = null;
		var latestNodeVisitPostTime = null;
		
		if (latestNodeVisit != null) {
			stepWorkId = latestNodeVisit.id;
			studentWork = latestNodeVisit.getLatestWork();
			latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
		}
	 */
	
	//set the html in the div so the user can see it
	document.getElementById('gradeByStepDiv').innerHTML = gradeByTeamGradingPageHtml;
};

//geoff
View.prototype.displayGradeByTeamGradingPageHelper = function(node, vleState) {
	var nodeId = node.id;
	
	var displayGradeByTeamGradingPageHtml = "";
	
	if(node.isLeafNode()) {
		//this node is a leaf/step

		if(node.type == "HtmlNode") {
			//the node is an html node so we do not need to display a link for it, we will just display the text
			displayGradeByTeamGradingPageHtml += "<table border='1' class='gradeByTeamGradingPageNonWorkStepTable'><tr><td class='chooseStepToGradeStepTd'><p>" + this.stepNumber + ". " + node.title + " [" + node.type + "]</p></td></tr></table>";
			displayGradeByTeamGradingPageHtml += "<br>";
		} else {
			var runId = this.getConfig().getConfigParam('runId');
			
			var teacherId = this.getUserAndClassInfo().getTeacherWorkgroupId();
			
			var workgroupId = vleState.dataId;
			
			
			//obtain the annotation for this workgroup and step if any
			var annotationComment = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherId, "comment");
			var annotationScore = this.annotations.getLatestAnnotation(runId, nodeId, workgroupId, teacherId, "score");
			
			//the value to display in the comment text box
			var annotationCommentValue = "";
			var annotationCommentPostTime = "";
			
			if(annotationComment != null) {
				//the annotation exists so we will populate the values from the annotation
				annotationCommentValue = annotationComment.value;
				annotationCommentPostTime = annotationComment.postTime;
			}

			//the value to display in the score text box
			var annotationScoreValue = "";
			var annotationScorePostTime = "";
			
			if (annotationScore != null) {
				//get the value of the annotationScore
				annotationScoreValue = annotationScore.value;
				annotationScorePostTime = annotationScore.postTime;
			}
			
			var latestAnnotationPostTime = Math.max(annotationCommentPostTime, annotationScorePostTime);
			
			
			//get the period name for this student
			var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);
			
			var flagsForNodeIdAndToWorkgroup = this.flags.getAnnotationsByNodeIdAndToWorkgroup(nodeId, workgroupId);
			var flagChecked = "";
			var isFlagged = 'false';
			if(flagsForNodeIdAndToWorkgroup != null && flagsForNodeIdAndToWorkgroup.length != 0) {
				flagChecked = " checked";
				isFlagged = 'true';
			}
			

			//get the latest work for the current workgroup 
			var latestNodeVisit = vleState.getLatestNodeVisitByNodeId(nodeId);
			var stepWorkId = null;
			var studentWork = null;
			var latestNodeVisitPostTime = null;
			
			if (latestNodeVisit != null) {
				stepWorkId = latestNodeVisit.id;
				studentWork = latestNodeVisit.getLatestWork();
				latestNodeVisitPostTime = latestNodeVisit.visitPostTime;
			}
			
			if(studentWork == null) {
				studentWork = "";
			}
			
			var studentTRClass = "studentWorkRow period" + periodName;
			
			var gradeByTeamGradingPageWorkStepTableClass = "gradeByTeamGradingPageWorkStepTable";
			
			if(latestAnnotationPostTime < latestNodeVisitPostTime) {
				gradeByTeamGradingPageWorkStepTableClass += " newWork";
			}

			displayGradeByTeamGradingPageHtml += "<table border='1' id='studentWorkRow_"+workgroupId+"_"+nodeId+"' class='" + gradeByTeamGradingPageWorkStepTableClass + "'><tr><td class='chooseStepToGradeStepTd'><a href='#' onClick='eventManager.fire(\"displayGradeByStepGradingPage\",[" + this.stepNumber + ", \"" + nodeId + "\"])'>" + this.stepNumber + ". " + node.title + " [" + node.type + "]</a></td></tr>";

			//TODO change id to studentWorkRow_<nodeId>
			displayGradeByTeamGradingPageHtml += "<tr class='" + studentTRClass + "' isflagged='" + isFlagged + "'>";

			
			displayGradeByTeamGradingPageHtml += "<td class='gradeByTeamWorkColumn'>" + studentWork + "</td>";
			
			var textAreaCols = 40;
			var commentTextAreaRows = getTextAreaNumRows(textAreaCols, annotationCommentValue);
			
			var lastAnnotationPostTime = new Date(latestAnnotationPostTime);
			
			var lastAnnotationMessage = "";
			
			if(lastAnnotationPostTime != null && lastAnnotationPostTime.getTime() != new Date(0).getTime()) {
				lastAnnotationMessage = "Last Annotation: " + lastAnnotationPostTime;
			} else {
				lastAnnotationMessage = "Last Annotation: N/A";
			}
			
			//get the max score for this step, or "" if there is no max score
			var maxScore = this.getMaxScoreValueByNodeId(nodeId);
			
			/*
			 * display the comment text box and populate the comment value
			 */
			displayGradeByTeamGradingPageHtml += "<td class='gradeByTeamGradeColumn gradeColumn gradingColumn'><table id='teacherAnnotationTable'>";
			displayGradeByTeamGradingPageHtml += "<tr><td>Score: <input type='text' id='annotationScoreTextArea_" + workgroupId + "_" + nodeId + "' value='" + annotationScoreValue + "' onblur=\"eventManager.fire('saveScore', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"'])\" /> / " + maxScore + "</td></tr>";
			displayGradeByTeamGradingPageHtml += "<tr><td>Comment:<br><textarea wrap='soft' cols='" + textAreaCols + "' rows='" + commentTextAreaRows + "' id='annotationCommentTextArea_" + workgroupId + "_" + nodeId + "' onblur=\"eventManager.fire('saveComment', ['"+nodeId+"','"+workgroupId+"', '"+teacherId+"', '"+runId+"', '"+stepWorkId+"', this])\">" + annotationCommentValue + "</textarea></td></tr>";
			displayGradeByTeamGradingPageHtml += "<tr><td><p id='lastAnnotationPostTime_" + workgroupId + "_" + nodeId + "' class='lastAnnotationPostTime'>" + lastAnnotationMessage + "</p></td></tr>";
			displayGradeByTeamGradingPageHtml += "</table></td>";

			/*
			//get the flag (if any) that corresponds to the row we are displaying
			var flag = flags.getLatestAnnotation(runId, nodeId, workgroupId, teacherId, "flag");
			var checked = "";
			
			if(flag != null) {
				//if there was a flag then we will set the checkbox to checked
				checked = "checked";
			}
			*/

			//display the checkbox for the flagging
			//gradeByStepHtml += "<td><input type='checkbox' name='flagCheckBox" + workgroupId + "' id='flagCheckBox" + workgroupId + "' onClick='saveFlag(\"" + nodeId + "\", " + workgroupId + ", " + teacherId + ", document.getElementById(\"flagCheckBox" + workgroupId + "\").checked, \"" + studentWork + "\", " + runId + ")' + " + checked + "></td>";
			
			displayGradeByTeamGradingPageHtml += "<td class='gradeByTeamToolsColumn gradeColumn toolsColumn'><div></div><div class='gradeColumn flagColumn'><input type='checkbox' value='Flag' name='flagButton" + workgroupId + "' id='flagButton" + workgroupId + "' onClick='eventManager.fire(\"saveFlag\", [\"" + nodeId + "\", " + workgroupId + ", " + teacherId + ", " + runId + ", false, null, \""+ stepWorkId +"\"])'" + flagChecked + ">Flag</div></td></table>";

			displayGradeByTeamGradingPageHtml += "<br>";
		}
		
		/*
		 * create the mapping of node id to node title delimited by &##58;
		 * &#58; is the ascii value of : and we use two #'s in case the
		 * author used a : in the step title to prevent collisions and
		 * corruption when parsing this after this string is sent
		 * back to the server
		 * e.g. node_1.html&##58;1. Introduction
		 */
		var nodeIdToNodeTitle = node.id + "###58;" + this.stepNumber + ". " + node.title;

		/*
		 * add the mapping to the array that we are using to keep track
		 * of all the mappings. replace all commas , with &##44;
		 * &#44; is the ascii value of , and we use two #'s to prevent
		 * collisions and parsing errors
		 */
		this.nodeIdToNodeTitleArray.push(nodeIdToNodeTitle.replace(/,/g, "###44;"));
		
		this.stepNumber++;
	} else {
		/*
		 * we need to skip the first sequence because that is always the
		 * master sequence. we will encounter the master sequence when 
		 * this.activityNumber is 0, so all the subsequent activities will
		 * start at 1.
		 */
		if(this.activityNumber != 0) {
			//this node is a sequence so we will display the activity number and title
			displayGradeByTeamGradingPageHtml += "<table border='1' class='gradeByTeamGradingPageActivityTable'><tr><td class='chooseStepToGradeActivityTd'><h4>A" + this.activityNumber + ". " + node.title + "</h4></td></tr></table>";
			displayGradeByTeamGradingPageHtml += "<br>";
		}

		//increment the activity number
		this.activityNumber++;
		
		//loop through all its children
		for(var x=0; x<node.children.length; x++) {
			//get the html for the children
			displayGradeByTeamGradingPageHtml += this.displayGradeByTeamGradingPageHelper(node.children[x], vleState);
		}
	}
	
	return displayGradeByTeamGradingPageHtml;
};

/**
 * Sorts the vleStates alphabetically by user name
 * @return
 */
View.prototype.getVleStatesSortedByUserName = function() {
	var vleStates = this.vleStates;
	
	/*
	 * set this view to a local variable so it can be referenced
	 * inside the sortByUserName() function below
	 */
	var thisView = this;
	
	/**
	 * A function that compares two vleStates. This is only used
	 * with the array sort function.
	 * @param a some vleState
	 * @param b some vleState
	 * @return
	 * true if the userName for a comes after b
	 * false if the userName for b comes after a
	 */
	var sortByUserName = function(a, b) {
		//get the user names from the vleStates
		var userNameA = thisView.getUserAndClassInfo().getClassmateByWorkgroupId(a.dataId).userName.toLowerCase();
		var userNameB = thisView.getUserAndClassInfo().getClassmateByWorkgroupId(b.dataId).userName.toLowerCase();
		
		//compare them
		return userNameA > userNameB;
	};
	
	vleStates = vleStates.sort(sortByUserName);
	
	return vleStates;
};

/**
 * Get the user names in a workgroup id
 * @param workgroupId the id of the workgroup
 * @param numberOfLineBreaks the number of new line <br>'s to put between user names
 * @return a string containing user names that are in the workgroup separated by
 * new line <br>'s
 */
View.prototype.getUserNamesByWorkgroupId = function(workgroupId, numberOfLineBreaks) {
	//if number of line breaks is unspecified, just use 1
	if(numberOfLineBreaks == null) {
		numberOfLineBreaks = 1;
	}
	
	//retrieve the : delimited names of the users in the workgroup
	var userNames = this.getUserAndClassInfo().getClassmateByWorkgroupId(workgroupId).userName;

	//split the string by :
	var userNamesArray = userNames.split(":");

	//the html that we will use to display in the left user column of the gradebystep page
	var userNamesHtml = "";

	//loop through each name in the workgroup
	for(var y=0; y<userNamesArray.length; y++) {
		//add an empty line between each name
		if(userNamesHtml != "") {
			for(var x=0; x<numberOfLineBreaks; x++) {
				userNamesHtml += "<br>";
			}
		}

		//add the user name which consists of "[first name] [last name] ([login])"
		userNamesHtml += userNamesArray[y];
	}
	
	return userNamesHtml;
};

/**
 * Generates the html that displays the total scores for workgroups
 * @return an html string that displays a button to go back, radio
 * buttons to filter periods, and a table that displays workgroups
 * and their cumulative scores
 */
View.prototype.showScoreSummary = function() {
	var showScoreSummaryHtml = "";
	
	//the button to go back to the step selection page
	showScoreSummaryHtml += "<table id='selectedStepTable'><tr><td class='selectedStep'></td><td class='button'><a href='#' id='selectAnotherStep' onClick='eventManager.fire(\"displayGradeByStepSelectPage\")'>Go Back To Steps</a></td></tr></table>";
	
	//get the html that will be used to filter workgroups by period
	showScoreSummaryHtml += this.getPeriodRadioButtonHtml();
	
	//the table that will display the scores for the workgroups
	showScoreSummaryHtml += "<table border='1' id='showScoreTable' class='showScoreTable'>";
	
	//the header row
	showScoreSummaryHtml += "<tr><th class='gradeColumn'>Period</th><th class='gradeColumn'>Who</th><th class='gradeColumn'>Score</th></tr>";
	
	//get the student work sorted alphabetically
	var vleStates = this.getVleStatesSortedByUserName();
	
	//get the max score for the project
	var maxScoresSum = this.getMaxScoresSum();
	
	//loop through all the student work objects
	for(var x=0; x<vleStates.length; x++) {
		//get a vleState
		var vleState = vleStates[x];
		
		//get the workgroup id
		var workgroupId = vleState.dataId;
		
		//get the teacher id
		var teacherId = this.getUserAndClassInfo().getTeacherWorkgroupId();
		
		//get the user names for the workgroup
		var userNames = this.getUserNamesByWorkgroupId(workgroupId, 1);
		
		//get the period the workgroup is in
		var periodName = this.getUserAndClassInfo().getClassmatePeriodNameByWorkgroupId(workgroupId);

		//get the cumulative score for the workgroup
		var totalScoreForWorkgroup = this.annotations.getTotalScoreByToWorkgroupAndFromWorkgroup(workgroupId, teacherId);
		
		//add classes for styling
		var studentTRClass = "showScoreRow studentWorkRow period" + periodName;
		
		//add the html row for this workgroup
		showScoreSummaryHtml += "<tr class='" + studentTRClass + "'><td class='showScorePeriodColumn'>" + periodName + "</td><td class='showScoreWorkgroupIdColumn'>" + userNames + "</td><td class='showScoreScoreColumn'>" + totalScoreForWorkgroup + " / " + maxScoresSum + "</td></tr>";
	}
	
	showScoreSummaryHtml += "</table>";
	
	//set the html into the div so it is displayed
	document.getElementById('gradeByStepDiv').innerHTML = showScoreSummaryHtml;
};

/**
 * Gets the html that will display radio buttons that will filter
 * workgroups by period
 * @return html that will display the radio buttons for filtering periods
 */
View.prototype.getPeriodRadioButtonHtml = function() {
	var periodRadioButtonHtml = "";
	
	//the div to display the period radio buttons that filter the periods
	periodRadioButtonHtml += "<div id='choosePeriodDiv'>";

	//split the period numbers into an array
	var periods = this.getUserAndClassInfo().getPeriodName().split(":");

	//create a radio button to display all periods
	periodRadioButtonHtml += "<div class='periodRadioChoice'><input type='radio' name='choosePeriod' value='all' onClick=\"eventManager.fire('filterPeriod', ['all'])\" checked> All Periods</div>";

	//loop through the periods
	for(var p=0; p<periods.length; p++) {
		//create a radio button for each period
		periodRadioButtonHtml += "<div class='periodRadioChoice'><input type='radio' name='choosePeriod' value='period" + periods[p] + "' onClick=\"eventManager.fire('filterPeriod', ['" + periods[p] + "'])\"> P" + periods[p] + "";
		periodRadioButtonHtml += "</div>";
	}

	periodRadioButtonHtml += "</div>";
	
	return periodRadioButtonHtml;
};

/**
 * Filter the periods to only show the student work from the period we want
 * @param period the period we want, e.g. 1, 2, 3, 4 or all if we want to display all periods
 */
View.prototype.filterPeriod = function(period) {
	//get the tr elements that contain the student work
	var studentWorkRows = document.getElementsByClassName("studentWorkRow");

	//loop through all the trs
	for(var x=0; x<studentWorkRows.length; x++) {
		//get the class attribute of the element
		var className = studentWorkRows[x].className;

		if(period == "all") {
			//we want to display all the periods so we will display it
			studentWorkRows[x].style.display = "";
		} else if(className.indexOf("period" + period) == -1) {
			//the element is not in the period we want to display so we will hide it
			studentWorkRows[x].style.display = "none";
		} else {
			//the element is in the period we want so we will display it
			studentWorkRows[x].style.display = "";
		}
	}
};

/**
 * displays the mysystem diagram in the specified div
 */
function showDiagram(divId) {
    //var json_data = [{"containers": [{"terminals": [{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal1", "direction": [0, -1], "offsetPosition": {"left": 20, "top": -25}, "ddConfig": {"type": "input", "allowedTypes": ["input", "output"]}}, {"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal2", "direction": [0, 1], "offsetPosition": {"left": 20, "bottom": -25}, "ddConfig": {"type": "output", "allowedTypes": ["input", "output"]}}], "draggable": true, "position": ["191px", "67px"], "className": "WireIt-Container WireIt-ImageContainer", "ddHandle": false, "ddHandleClassName": "WireIt-Container-ddhandle", "resizable": false, "resizeHandleClassName": "WireIt-Container-resizehandle", "close": true, "closeButtonClassName": "WireIt-Container-closebutton", "title": "table", "icon": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "preventSelfWiring": true, "image": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "xtype": "MySystemContainer", "fields": {"energy": 100, "form": "light", "efficiency": 1}, "name": "table", "has_sub": false}, {"terminals": [{"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal1", "direction": [0, -1], "offsetPosition": {"left": 20, "top": -25}, "ddConfig": {"type": "input", "allowedTypes": ["input", "output"]}}, {"wireConfig": {"drawingMethod": "bezierArrows"}, "name": "Terminal2", "direction": [0, 1], "offsetPosition": {"left": 20, "bottom": -25}, "ddConfig": {"type": "output", "allowedTypes": ["input", "output"]}}], "draggable": true, "position": ["72px", "83px"], "className": "WireIt-Container WireIt-ImageContainer", "ddHandle": false, "ddHandleClassName": "WireIt-Container-ddhandle", "resizable": false, "resizeHandleClassName": "WireIt-Container-resizehandle", "close": true, "closeButtonClassName": "WireIt-Container-closebutton", "icon": "http://209.20.92.79:8080/vlewrapper/curriculum/15/images/battery.jpg", "preventSelfWiring": true, "image": "./images/thermodynamics/hotbowl.png", "xtype": "MySystemContainer", "fields": {"name": "hot bowl", "energy": 100, "form": "light", "efficiency": 1}, "name": "hot bowl", "has_sub": false}], "wires": [{"src": {"moduleId": 1, "terminal": "Terminal2"}, "tgt": {"moduleId": 0, "terminal": "Terminal2"}, "options": {"className": "WireIt-Wire", "coeffMulDirection": 100, "drawingMethod": "bezierArrows", "cap": "round", "bordercap": "round", "width": 5, "borderwidth": 1, "color": "#BD1550", "bordercolor": "#000000", "fields": {"name": "flow", "width": 5, "color": "color2"}, "selected": false}}]}];
    var json_data = eval(document.getElementById(divId).innerHTML);
    document.getElementById(divId).innerHTML = "";
    var width="800";
    var height="600";
    var scale=0.55;
    new MySystemPrint(json_data,divId,contentBaseUrl,width,height,scale);
}

function showDiagramNode(currNode, nodeIndex, nodeList) {
	showDiagram(currNode.getAttribute("id"));
}

/**
 * Obtain the latest student work by calling render again to retrieve the
 * latest data.
 */
function refresh() {
	lock();	
	render(this.contentURL, this.userURL, this.getDataUrl, this.contentBaseUrl, this.getAnnotationsUrl, this.postAnnotationsUrl, this.runId, this.getFlagsUrl, this.postFlagsUrl);
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_display.js');
};


View.prototype.getStudentNavigationXLSExport = function() {
	document.getElementById('exportType').value = 'studentNavigation';
	document.getElementById('getStudentXLSExport').submit();
};

View.prototype.getStudentWorkXLSExport = function() {
	document.getElementById('exportType').value = 'studentWork';
	document.getElementById('getStudentXLSExport').submit();
};

/**
 * Show the total scores of all students
 * Go thru all of the classmates and get their score
 */
View.prototype.showScores = function() {
	var classmates = this.getUserAndClassInfo().vle.myClassInfo.classmates;
	var htmlSoFar = "score\tname\n";
	for (var i=0; i < classmates.length; i++) {
		var classmate = classmates[i];
		var classmateScore = annotations.getTotalScoreByToWorkgroup(classmate.workgroupId);
		htmlSoFar += classmateScore + "\t" + classmate.userName +"\n";
	}
	alert(htmlSoFar);
}

/**
 * Obtain the latest student work by calling render again to retrieve the
 * latest data.
 */
function refresh() {
	lock();	
	render(this.contentURL, this.userURL, this.getDataUrl, this.contentBaseUrl, this.getAnnotationsUrl, this.postAnnotationsUrl, this.runId, this.getFlagsUrl, this.postFlagsUrl);
}

/**
 * Export the grades in the specified format.
 * Currently supported format(s):
 *   CSV
 */
function exportGrades(exportType) {
	 //display the popup window that contains the export data
	 displayExportData(exportType);
	 
	 //send the export data to the server so it can echo it and we can save it as a file
	 vle.saveStudentWorkToFile(exportType);
}

var myMenu;

/**
 * Displays the export data in a new popup window. This is to allow
 * the teacher to be be able to copy and paste the export data
 * into their own text editor in case the data is too big and the
 * echo post fails causing the save dialog to not show up.
 *
 * @param exportType the file type to save the data as
 */
function displayExportData(exportType) {
	//make the new window
	var exportDataWin = window.open("", "exportData", "width=600,height=400");

	//get the export data from the vle
	var exportData = vle.getContentForFile(exportType);

	//make the message to display at the top of the pop up window
	var message = "<p>If you were asked to save the file you can ignore and close this window.</p>";
	message += "<p>If you were not asked to save the file, you can copy the contents in the box below and paste it into Notepad or Textedit and save it yourself.</p>";

	//make the textarea that will contain the export data
	var textBoxHtml = "<textarea rows='15' cols='70'>" + exportData + "</textarea>";

	//write the contents to the popup window
	exportDataWin.document.open();
	exportDataWin.document.write(message + textBoxHtml);
	exportDataWin.document.close();
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_export.js');
};
View.prototype.getGradingConfig = function(gradingConfigUrl) {
	var gradingConfigContent = createContent(gradingConfigUrl);
	this.config = this.createConfig(gradingConfigContent);
	eventManager.fire('getGradingConfigComplete', [this.config.getConfigParam('getContentUrl'), this.config.getConfigParam('getContentBaseUrl'), false]);
};

/**
 * Retrieve the student workgroupIds
 */
View.prototype.getStudentUserInfo = function() {
	var userInfoContent = createContent(this.config.getConfigParam('getUserInfoUrl'));

	//parse and load the xml that contains the workgroup ids
	//vle.loadUserAndClassInfo(o.responseXML);
	this.loadUserAndClassInfo(userInfoContent);

	//get the teacher workgroup id
	teacherId = this.getUserAndClassInfo().getWorkgroupId();

	//retrieve all the student users
	studentWorkgroupIds = new Array();
	classUsers = this.getUserAndClassInfo().getUsersInClass();

	//loop through all the classmates
	for(var x=0; x<classUsers.length; x++) {
		//all users including the teacher are stored as a classmate right now
		if(classUsers[x].workgroupId != teacherId) {
			/*
			 * if the user is not the teacher, add it to the 
			 * student workgroup ids array
			 */
			studentWorkgroupIds.push(classUsers[x].workgroupId);
		}
	}

	eventManager.fire('processUserAndClassInfoComplete');
};

/**
 * Get the project meta data such as max score values
 */
View.prototype.getProjectMetaData = function() {
	//get the url to retrieve the project meta data
	var getProjectMetaDataUrl = this.getConfig().getConfigParam('getProjectMetadataUrl');
	
	var projectMetaDataCallbackSuccess = function(text, xml, args) {
		if(text != null && text != "") {
			var thisView = args[0];
			
			thisView.processMaxScoresJSON(text);		
		}
		
		eventManager.fire("getProjectMetaDataComplete");
	};
	
	var projectMetaDataCallbackFailure = function(text, args) {
		eventManager.fire("getProjectMetaDataComplete");
	};
	
	this.connectionManager.request('GET', 1, getProjectMetaDataUrl, null, projectMetaDataCallbackSuccess, [this], projectMetaDataCallbackFailure);
};

/**
 * Get the run extras such as the max scores
 * @return
 */
View.prototype.getRunExtras = function() {
	//get the url to retrieve the run extras
	var getRunExtrasUrl = this.getConfig().getConfigParam('getRunExtrasUrl');
	
	var runExtrasCallbackSuccess = function(text, xml, args) {
		if(text != null && text != "") {
			var thisView = args[0];
			
			thisView.processMaxScoresJSON(text);
		}
		
		eventManager.fire("getRunExtrasComplete");
	};
	
	var runExtrasCallbackFailure = function(text, args) {
		eventManager.fire("getRunExtrasComplete");
	};
	
	this.connectionManager.request('GET', 1, getRunExtrasUrl, null, runExtrasCallbackSuccess, [this], runExtrasCallbackFailure);
};

/**
 * Parses and sets or merges the new max scores
 * @param maxScoresJSON
 */
View.prototype.processMaxScoresJSON = function(maxScoresJSON) {
	//parse the max scores JSON
	var newMaxScores = MaxScores.prototype.parseMaxScoresJSONString(maxScoresJSON);
	
	//see if the max scores has already been set
	if(this.maxScores == null) {
		//it has not been set so we will set it
		this.maxScores = newMaxScores;
	} else {
		//it has been set so we will merge the new max scores
		this.maxScores.mergeMaxScores(newMaxScores);
	}
};


















View.prototype.startAuthoring = function(){
	YUI().use('node', 'json', function(Y){yui = Y;});
	
};

var studentWorkQueryObject;
var global_yui;

YUI().use('node',"json-stringify","json-parse", function(Y) {
	global_yui = Y;
});


/**
 * Called after all the js files are loaded
 */
function afterScriptsLoad(){
	//after all the js files have been loaded, render the gradebystep display
	render(contentUrl, userUrl, getDataUrl, contentBaseUrl, getAnnotationsUrl, postAnnotationsUrl, runId);
}

/**
 * Called when the page starts to load
 */
window.onload=function(){
	// lock screen
	lock();	
	
	//load all the js files
	if (window.location.search.indexOf("loadScriptsIndividually") != -1) {
       scriptloader.useDeflatedScripts = false;
    }
	scriptloader.initialize(document, afterScriptsLoad, 'gradebystep');
}

function projectSummary(){
	window.open("/webapp/student/vle/vle.html?runId=" + runId + "&summary=true", "Project Summary", "height=600, width=800");
};


var newWin = null;
function popUp(strURL, strType, strHeight, strWidth) {
 if (newWin != null && !newWin.closed)
   newWin.close();
 var strOptions="";
 if (strType=="console")
   strOptions="resizable,height="+
     strHeight+",width="+strWidth;
 if (strType=="fixed")
   strOptions="status,height="+
     strHeight+",width="+strWidth;
 if (strType=="elastic")
   strOptions="toolbar,menubar,scrollbars,"+
     "resizable,location,height="+
     strHeight+",width="+strWidth;
 newWin = window.open(strURL, 'newWin', strOptions);
 newWin.focus();
}

/**
 * This gets called by gradebystep.jsp in the topiframeOnLoad() function.
 * We will just remember all the url arguments to use them later when
 * in afterScriptsLoad() when we call render().
 */
function load_old(contentUrl, userUrl, getDataUrl, contentBaseUrl, getAnnotationsUrl, postAnnotationsUrl, runId, getFlagsUrl, postFlagsUrl) {
	//alert("contentURL: " + contentUrl + "\n\nuserURL: " + userUrl + "\n\ngetDataUrl: " + getDataUrl + "\n\ncontentBaseUrl: " + contentBaseUrl + "\n\ngetAnnotationsUrl: " + getAnnotationsUrl + "\n\npostAnnotationsUrl: " + postAnnotationsUrl);
	this.contentUrl = contentUrl;
	this.userUrl = userUrl;
	this.getDataUrl = getDataUrl;
	this.contentBaseUrl = contentBaseUrl;
	this.getAnnotationsUrl = getAnnotationsUrl;
	this.postAnnotationsUrl = postAnnotationsUrl; 
	this.runId = runId;
	this.getFlagsUrl = getFlagsUrl;
	this.postFlagsUrl = postFlagsUrl;
}

var waitingIntervalId = 0;
function addDot() {
	document.getElementById("gradeByStepDiv").innerHTML += ".";
}

function lock() {
	waitingIntervalId = setInterval("addDot()", 1000);	
}

function unlock() {
	document.getElementById("gradeByStepDiv").innerHTML += "";
	clearInterval(waitingIntervalId);
}

function old_lock(message) {
	YAHOO.namespace("example.container");
    if (!YAHOO.example.container.wait) {
    	
    YAHOO.example.container.wait = 
        new YAHOO.widget.Panel("wait",  
                                        { width: "500px", 
                                          close: false, 
                                          draggable: false, 
                                          zindex:4,
                                          modal: true,
                                          visible: false
                                        } 
                                    );

	if (message == null) {
    	message = "<table><tr align='center'>Loading Grading Tool. Please wait...</tr><tr align='center'></tr><table>"
    }
    YAHOO.example.container.wait.setHeader("Message");
	YAHOO.example.container.wait.setBody(message);
	YAHOO.example.container.wait.render(document.body.wait);
    }
	YAHOO.example.container.wait.show();
}

function old_unlock() {
	YAHOO.example.container.wait.hide();
}

function togglecomments (postid) {
	var whichpost = document.getElementById(postid);
	if (whichpost.className=="commentShown") { whichpost.className="commentHidden"; } else { whichpost.className="commentShown"; }
}


function expandMenu(menuId) {
	myMenu.expandMenu(document.getElementById(menuId));
}

/**
 * Setup and display the project
 *
 * @param contentURL a url to the project file, we will use a get
 *		request to obtain the project file
 * @param userURL a url to the user info, we will use a get request
 *		to obtain the user info 
 */
function render(contentURL, userURL, getDataUrl, contentBaseUrl, getAnnotationsUrl, postAnnotationsUrl, runId, getFlagsUrl, postFlagsUrl) {
	vle = new VLE(true);
	vle.runId = runId;

	//load the project content
	//vle.loadProjectForGradeByStep(contentUrl, contentBaseUrl);
	vle.loadProject(contentUrl, contentBaseUrl);

	//retrieve the workgroup ids for the students
	getStudentUserInfo();

	//setup events
	vle.eventManager.addEvent('getStudentUserInfoComplete');
	vle.eventManager.addEvent('getStudentWorkComplete');
	vle.eventManager.addEvent('getAnnotationsComplete');

	/*
	 * when we are done retrieving the student workgroup ids, we will
	 * retrieve the work from all the students
	 */
	//vle.eventManager.subscribe("getStudentUserInfoComplete", getStudentWork);
	vle.eventManager.subscribe("getStudentUserInfoComplete", initiateDisplaySteps);

	/*
	 * when we are done retrieving the student work, we will retrieve
	 * the annotations
	 */
	//vle.eventManager.subscribe("getStudentWorkComplete", getAnnotations);

	//vle.eventManager.subscribe("getAnnotationsComplete", getFlags);
}




//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_startup.js');
};




/**
 * This should only be called after getStudentUserInfo() has been called.
 * This just appends all the student workgroup ids together seperated by :
 * e.g.
 * 139:143:152
 * @return a string containing the student workgroup ids delimited by :
 */
function getStudentWorkgoupIds() {
	var ids = "";

	//loop through all the student workgroup ids
	for(var x=0; x<studentWorkgroupIds.length; x++) {
		if(ids != "") {
			/*
			 * if this is not the first workgroup id, we need to seperate
			 * it from the previous id with a :
			 */
			ids += ":";
		}
		ids += studentWorkgroupIds[x];
	}
	return ids;
}

/**
 * Get an array of string workgroup sets
 * @param workgroupsPerIndex the number of workgroups we want per set
 * @return an array that contains a string set of workgroups in each index element
 * e.g.
 * There are 7 workgroups and we want 3 workgroups per index element
 * ["1:2:3"], ["4:5:6"], ["7"]
 */
function getStudentWorkgroupIdsArray(workgroupsPerIndex) {
	//the array to hold the string workgroup sets
	var idsArray = new Array();

	//the current index to put workgroup ids into
	var idsArrayIndex = 0;

	/*
	 * the number of workgroup ids in the current index element 
	 * so we know when this index has reached the specified number
	 * of workgroupsPerIndex. then we will move on to the next
	 * index.
	 */
	var workgroupsInCurrentIndex = 0;
	
	//loop through all the student workgroup ids
	for(var x=0; x<studentWorkgroupIds.length; x++) {
		//get a workgroup
		var workgroupId = studentWorkgroupIds[x];

		if(idsArray[idsArrayIndex] == null) {
			/*
			 * if the index element is null, set it to empty string.
			 * this will happen when the first workgroup is
			 * placed into an index
			 */
			idsArray[idsArrayIndex] = "";
		} else {
			/*
			 * seperate the workgroup ids by :
		 	 * this will happen every time after the first workgroup
		 	 * is placed into the index
			 */
			idsArray[idsArrayIndex] += ":";
		}

		//add the workgroup to the array index
		idsArray[idsArrayIndex] += workgroupId;

		//increment the number of workgroups in the index
		workgroupsInCurrentIndex++;

		//check if we have reached the number of workgroups we want per index
		if(workgroupsInCurrentIndex == workgroupsPerIndex) {
			//we have reached the number of workgroups we want per index
			
			/*
			 * increment the idsArrayIndex so we will move on to the next
			 * index for the next workgroup
			 */
			idsArrayIndex += 1;

			/*
			 * set the number of workroups in the current index to 0 since
			 * we have moved on to the next index
			 */
			workgroupsInCurrentIndex = 0;
		}
	}

	//return the array with the workgroup sets
	return idsArray;
}

/**
 * Retrieve the student work from the db
 */
View.prototype.getStudentWork = function() {
	//get all node ids except for nodes that are HtmlNodes
	var nodeIds = this.getProject().getNodeIds("HtmlNode");

	/*
	 * obtain an array of workgroup ids, each element in the array
	 * contains a string workgroup ids delimited by :
	 * you can specify how many workgroup ids per array element
	 * by changing the number that is passed to the function.
	 * right now we get 25 workgroup ids at a time.
	 */
	var workgroupsArray = getStudentWorkgroupIdsArray(25);
	
	var studentWorkCallback = function(text, xml, args) {
			var thisView = args[0];

			//parse all the vlestates for all the students
			var alwaysReturnArray = true;

			//parse the json student work into an array of vle states
			newVLEStates = VLE_STATE.prototype.parseDataJSONString(text, alwaysReturnArray);

			if(thisView.vleStates == null) {
				//set the array of vle states if it hasn't been set before
				thisView.vleStates = newVLEStates;
			} else {
				//concatenate the new vle states with the previous vle states
				thisView.vleStates = thisView.vleStates.concat(newVLEStates);
			}
			
			//fire the event to notify others that we are done getting the student work
			eventManager.fire("getStudentWorkComplete");
			//YAHOO.example.container.wait.hide();
	};

	var getStudentDataUrl = null;

	//loop through each set of workgroup ids
	for(var x=0; x<workgroupsArray.length; x++) {
		/*
		 * get a set of workgroup ids. the workgroups in the element are
		 * delimited by :
		 */ 
		var workgroupSet = workgroupsArray[x];

		//create the url to get the student data for this set of workgroups
		getStudentDataUrl = this.getConfig().getConfigParam('getStudentDataUrl') + "?userId=" + workgroupSet + "&grading=true" + "&runId=" + this.getConfig().getConfigParam('runId') + "&nodeIds=" + nodeIds;

		//make the request for the workgroup set
		//YAHOO.util.Connect.asyncRequest('GET', getStudentDataUrl, studentWorkCallback);
		this.connectionManager.request('GET', 1, getStudentDataUrl, null, studentWorkCallback, [this]);
		
		/*
		var studentDataContent = createContent(getStudentDataUrl);
		
		//parse all the vlestates for all the students
		var alwaysReturnArray = true;

		//parse the json student work into an array of vle states
		newVLEStates = VLE_STATE.prototype.parseDataJSONString(studentDataContent.getContentString(), alwaysReturnArray);

		if(this.vleStates == null) {
			//set the array of vle states if it hasn't been set before
			this.vleStates = newVLEStates;
		} else {
			//concatenate the new vle states with the previous vle states
			this.vleStates = this.vleStates.concat(newVLEStates);
		}
		*/
	}

	eventManager.fire("getStudentWorkComplete");
	
	//get all the annotations for the run
	this.getAnnotations();
};

View.prototype.getVleStateByWorkgroupId = function(workgroupId) {
	if(this.vleStates != null) {
		for(var x=0; x<this.vleStates.length; x++) {
			var vleState = this.vleStates[x];
			
			if(vleState.dataId == workgroupId) {
				return vleState;
			}
		}
	}
	
	return null;
};


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/grading/gradingview_studentwork.js');
};
/**
 * An object that contains Annotation objects 
 */

function Annotations() {
	this.annotationsArray = new Array();
}

/**
 * Adds the Annotation object to its array 
 * @param annotation an Annotation object
 */
Annotations.prototype.addAnnotation = function(annotation) {
	this.annotationsArray.push(annotation);
}

Annotations.prototype.removeAnnotation = function(runId, nodeId, toWorkgroup, fromWorkgroup, studentWork) {
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.runId == runId &&
				annotation.nodeId == nodeId &&
				annotation.toWorkgroup == toWorkgroup &&
				annotation.fromWorkgroup == fromWorkgroup &&
				annotation.studentWork == studentWork) {
			this.annotationsArray.splice(x, 1);
		}
	}
};

Annotations.prototype.removeFlagAnnotation = function(runId, nodeId, toWorkgroup, fromWorkgroup) {
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.runId == runId &&
				annotation.nodeId == nodeId &&
				annotation.toWorkgroup == toWorkgroup &&
				annotation.fromWorkgroup == fromWorkgroup) {
			this.annotationsArray.splice(x, 1);
		}
	}
};

/**
 * Takes in an xml object and returns an array filled with annotation objects
 * example xml
 * <annotations>
 * 		<annotationEntry>
 * 			<runId>null</runId>
 * 			<nodeId>a3s2</nodeId>
 * 			<toWorkgroup>139</toWorkgroup>
 * 			<fromWorkgroup>2</fromWorkgroup>
 * 			<type>comment</type>
 * 			<value>great job</value>
 * 		</annotationEntry>
 * 		<annotationEntry>
 * 			<runId>null</runId>
 * 			<nodeId>a3s3</nodeId>
 * 			<toWorkgroup>139</toWorkgroup>
 * 			<fromWorkgroup>138</fromWorkgroup>
 * 			<type>comment</type>
 * 			<value>you suck</value>
 * 		</annotationEntry>
 * </annotations>
 * 
 * @param annotationsXML an xml object that contains annotations
 * @return an array filled with annotation objects
 */
Annotations.prototype.parseDataXML = function(annotationsXML) {
	var annotations = new Annotations();
	
	//the array to store the annotation objects
	annotations.annotationsArray = new Array();
	
	//the annotationEntry xml objects
	var annotationEntries = annotationsXML.getElementsByTagName("annotationEntry");
	
	//loop through the annotationEntry xml objects
	for(var x=0; x<annotationEntries.length; x++) {
		//get the annotationEntry xml object
		var annotationXML = annotationEntries[x];
		
		//create an annotation object
		var annotation = Annotation.prototype.parseDataXML(annotationXML);

		//alert(annotation.runId + "\n" + annotation.nodeId + "\n" + annotation.toWorkgroup + "\n" + annotation.fromWorkgroup + "\n" + annotation.type + "\n" + annotation.annotation);
		
		//add the annotation object to the array
		annotations.annotationsArray.push(annotation);
	}
	
	return annotations;
};

/**
 * Converts a JSON string into an Annotations object
 * @param annotationsJSONString a JSON string representing an Annotations object
 * @return an Annotations object
 */
Annotations.prototype.parseDataJSONString = function(annotationsJSONString) {
	//convert the JSON string into a JSON object
	var annotationsJSONObj = yui.JSON.parse(annotationsJSONString);
	
	//create an Annotations object from the JSON object
	return Annotations.prototype.parseDataJSONObj(annotationsJSONObj);
};

/**
 * Converts a JSON object into an Annotations object
 * @param annotationsJSONObj a JSON object representing an Annotations object
 * @return an Annotations object
 */
Annotations.prototype.parseDataJSONObj = function(annotationsJSONObj) {
	//create a new Annotations object
	var annotations = new Annotations();
	
	//the array to store the annotation objects
	annotations.annotationsArray = new Array();
	
	//loop through the annotation JSON objects and create Annotation objects
	if (annotationsJSONObj.annotationsArray != null) {
		for(var x=0; x<annotationsJSONObj.annotationsArray.length; x++) {
			//obtain an annotation JSON object
			var annotationJSONObj = annotationsJSONObj.annotationsArray[x];

			//create an Annotation object
			var annotationObj = Annotation.prototype.parseDataJSONObj(annotationJSONObj);

			//add the Annotation object to the annotationsArray
			annotations.annotationsArray.push(annotationObj);
		}
	}
	
	//return the populated Annotations object
	return annotations;
};


/**
 * Retrieves the latest annotation for the given nodeId
 * @param nodeId the nodeId to retrieve the annotation for
 * @return the latest annotation for the nodeId or null if none are found
 * 		for the nodeId
 */
Annotations.prototype.getLatestAnnotationForNodeId = function(nodeId) {
	var annotation = null;
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		tempAnnotation = this.annotationsArray[x];
		
		if(tempAnnotation.nodeId == nodeId) {
			annotation = tempAnnotation;
		}
	}
	
	return annotation;
};

/**
 * Retrieves all the annotations for a nodeId
 * @param nodeId the nodeId to retrieve annotations for
 * @return an array containing the annotations for the nodeId
 */
Annotations.prototype.getAnnotationsByNodeId = function(nodeId) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.nodeId == nodeId) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
};

/**
 * Retrieves all the annotations for the toWorkgroup (student workgroup)
 * @param toWorkgroup the student workgroup id
 * @return an array containing the annotations for the toWorkgroup
 */
Annotations.prototype.getAnnotationsByToWorkgroup = function(toWorkgroup) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.toWorkgroup == toWorkgroup) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
};

/**
 * Retrieves all the annotations with toWorkgroup and fromWorkgroup
 * @param toWorkgroup a student workgroup id
 * @param fromWorkgroup a teacher workgroup id (or maybe student workgroup id)
 * @return an array containing the annotations for this combination
 */
Annotations.prototype.getAnnotationsByToWorkgroupAndFromWorkgroup = function(toWorkgroup, fromWorkgroup) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.toWorkgroup == toWorkgroup && annotation.fromWorkgroup == fromWorkgroup) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
};

/**
 * Returns an integer total score of all of the scores that the toWorkgroup
 * has retrieved.
 * @param toWorkgroup
 * @return the total score
 */
Annotations.prototype.getTotalScoreByToWorkgroup = function(toWorkgroup) {
	var annotationsByToWorkgroup=this.getAnnotationsByToWorkgroup(toWorkgroup);
	var totalSoFar = 0;
	for (var i=0; i < annotationsByToWorkgroup.length; i++) {
		if (annotationsByToWorkgroup[i].type == "score") {
			totalSoFar += parseInt(annotationsByToWorkgroup[i].value);
		}
	}
	return totalSoFar;
};

/**
 * Returns an integer total score of all the scores that fromWorkgroup
 * has given to toWorkgroup
 * @param toWorkgroup a student workgroup id
 * @param fromWorkgroup a teacher workgroup id (or maybe student workgroup id)
 * @return the total score
 */
Annotations.prototype.getTotalScoreByToWorkgroupAndFromWorkgroup = function(toWorkgroup, fromWorkgroup) {
	var annotationsByToWorkgroup=this.getAnnotationsByToWorkgroupAndFromWorkgroup(toWorkgroup, fromWorkgroup);
	var totalSoFar = 0;
	for (var i=0; i < annotationsByToWorkgroup.length; i++) {
		if (annotationsByToWorkgroup[i].type == "score") {
			totalSoFar += parseInt(annotationsByToWorkgroup[i].value);
		}
	}
	return totalSoFar;
};

/**
 * Retrieves all the annotations for with the given nodeId and toWorkgroup
 * @param nodeId the id of the node
 * @param toWorkgroup the id of the student workgroup
 * @return an array containing the annotations with the nodeId and toWorkgroup
 */
Annotations.prototype.getAnnotationsByNodeIdAndToWorkgroup = function(nodeId, toWorkgroup) {
	var annotations = new Array();
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.nodeId == nodeId && annotation.toWorkgroup == toWorkgroup) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
};

/**
 * Retrieves the latest annotation with the given nodeId and toWorkgroup
 * @param nodeId the id of the node
 * @param toWorkgroup the id of the student workgroup
 * @return the latest annotation for the given nodeId and toWorkgroup
 */
Annotations.prototype.getLatestAnnotation = function(runId, nodeId, toWorkgroup, fromWorkgroup, type) {
	var annotation = null;
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var tempAnnotation = this.annotationsArray[x];
		
		if(tempAnnotation.runId == runId && 
				tempAnnotation.nodeId == nodeId &&
				tempAnnotation.toWorkgroup == toWorkgroup && 
				tempAnnotation.fromWorkgroup == fromWorkgroup &&
				tempAnnotation.type == type) {
			annotation = tempAnnotation;
		}
	}
	
	return annotation;
};

/**
 * Retrieves all the annotations for the given fromWorkgroup (workgroup giving the comment/grade)
 * @param fromWorkgroup the workgroup giving the comment/grade
 * @return an array of annotations written by the fromWorkgroup
 */
Annotations.prototype.getAnnotationsByFromWorkgroup = function(fromWorkgroup) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.fromWorkgroup == fromWorkgroup) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
};

/**
 * Retrieves all the annotations with the given type 
 * @param type the type of annotation e.g. comment, grade, etc.
 * @return an array containing all the annotations with the given type
 */
Annotations.prototype.getAnnotationsByType = function(type) {
	var annotations = new Array();
	
	for(var x=0; x<this.annotationsArray.length; x++) {
		var annotation = this.annotationsArray[x];
		
		if(annotation.type == type) {
			annotations.push(annotation);
		}
	}
	
	return annotations;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/grading/Annotations.js');
};
/**
 * An object that represents one annotation. A comment by itself is considered
 * one annotation. The grade is also considered one annotation by itself. This
 * means if the teacher writes a comment and a grade, the teacher will be
 * creating two annotations.
 */

/**
 * Constructor
 */
function Annotation(runId, nodeId, toWorkgroup, fromWorkgroup, type, value, postTime) {
	this.runId = runId;
	this.nodeId = nodeId; //the node/step related to this annotation
	this.toWorkgroup = toWorkgroup; //the id for the entity that wrote the work
	this.fromWorkgroup = fromWorkgroup; //the id for the entity that is writing feedback/grading
	this.type = type; //specifies the type of annotation
	this.value = value; //the feedback/grading
	this.postTime = postTime;
}

/**
 * Parses an annotation xml object into an Annotation object
 * @param annotationXML an xml object containing an annotation XML
 * @return an annotation object
 */
Annotation.prototype.parseDataXML = function(annotationXML) {
	var annotation = new Annotation();
	
	//populate the fields from the xml object
	annotation.runId = annotationXML.getElementsByTagName("runId")[0].firstChild.nodeValue;
	annotation.nodeId = annotationXML.getElementsByTagName("nodeId")[0].firstChild.nodeValue;
	annotation.toWorkgroup = annotationXML.getElementsByTagName("toWorkgroup")[0].firstChild.nodeValue;
	annotation.fromWorkgroup = annotationXML.getElementsByTagName("fromWorkgroup")[0].firstChild.nodeValue;
	annotation.type = annotationXML.getElementsByTagName("type")[0].firstChild.nodeValue;
	if (annotation.type != "flag") {
		if (annotationXML.getElementsByTagName("value")[0].firstChild != null) {  
			annotation.value = annotationXML.getElementsByTagName("value")[0].firstChild.nodeValue;
		} else {
			annotation.value = "";
		}
	}
	//annotation.postTime = annotationXML.getElementsByTagName("postTime")[0].firstChild.nodeValue;
	
	return annotation;
}

/**
 * Converts an annotation JSON String into an Annotation object
 * @param annotationJSONString an annotation JSON string
 * @return a populated Annotation object
 */
Annotation.prototype.parseDataJSONString = function(annotationJSONString) {
	//convert the JSON string into a JSON object
	var annotationJSONObj = global_yui.JSON.parse(annotationJSONString);
	
	//convert the annotation JSON object into an Annotation object
	return Annotation.prototype.parseDataJSONObj(annotationJSONObj);
}


/**
 * Creates an Annotation object from an annotation JSON object
 * @param annotationJSONObj an annotation JSON object
 * @return an Annotation object
 */
Annotation.prototype.parseDataJSONObj = function(annotationJSONObj) {
	//create a new Annotation
	var annotation = new Annotation();
	
	//populate the fields of the Annotation object from the JSON object
	annotation.runId = annotationJSONObj.runId;
	annotation.nodeId = annotationJSONObj.nodeId;
	annotation.toWorkgroup = annotationJSONObj.toWorkgroup;
	annotation.fromWorkgroup = annotationJSONObj.fromWorkgroup;
	annotation.type = annotationJSONObj.type;
	annotation.value = annotationJSONObj.value;
	annotation.postTime = annotationJSONObj.postTime;
	annotation.stepWorkId = annotationJSONObj.stepWorkId;
	
	//return the Annotation
	return annotation;
}

/**
 * Returns the xml string value for this Annotation object
 * @return xml string
 */
Annotation.prototype.getDataXML = function() {
	var dataXML = "";
	
	dataXML += "<annotationEntry>";
	dataXML += "<runId>" + this.runId + "</runId>";
	dataXML += "<nodeId>" + this.nodeId + "</nodeId>";
	dataXML += "<toWorkgroup>" + this.toWorkgroup + "</toWorkgroup>";
	dataXML += "<fromWorkgroup>" + this.fromWorkgroup + "</fromWorkgroup>";
	dataXML += "<type>" + this.type + "</type>";
	dataXML += "<value>" + this.value + "</value>";
	dataXML += "</annotationEntry>";
	
	return dataXML;
}

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/grading/Annotation.js');
};
function MaxScores() {
	this.maxScoresArray = new Array();
}

MaxScores.prototype.parseMaxScoresJSONString = function(maxScoresJSONString) {
	var maxScoresJSONObj = global_yui.JSON.parse(maxScoresJSONString);
	
	return MaxScores.prototype.parseMaxScoresJSONObj(maxScoresJSONObj);
};

MaxScores.prototype.parseMaxScoresJSONObj = function(maxScoresJSONObj) {
	var maxScoresObj = new MaxScores();
	maxScoresObj.maxScoresArray = maxScoresJSONObj.maxScores;
	return maxScoresObj;
};

/**
 * Adds the max score to the array of max scores. If there
 * is an existing entry for the nodeId, we will just update
 * its max score
 * @param nodeId
 * @param maxScoreValue
 */
MaxScores.prototype.addMaxScore = function(nodeId, maxScoreValue) {
	this.updateMaxScore(nodeId, maxScoreValue);
};

/**
 * Removes the whole max score entry for the nodeId
 * @param nodeId
 */
MaxScores.prototype.removeMaxScore = function(nodeId) {
	for(var x=0; x<this.maxScoresArray.length; x++) {
		if(nodeId == this.maxScoresArray[x].nodeId) {
			this.maxScoresArray.splice(x, 1);
		}
	}
};

/**
 * Updates a max score entry with a new max score value. If
 * there is no max score entry with the given nodeId we will
 * create a new entry and add it.
 * @param nodeId
 * @param maxScoreValue
 */
MaxScores.prototype.updateMaxScore = function(nodeId, maxScoreValue) {
	var nodeIdFound = false;
	
	/*
	 * first try to find and update the max score object that 
	 * has the corresponding nodeId, but if it doesn't exist 
	 * we will need to add it
	 */
	for(var x=0; x<this.maxScoresArray.length; x++) {
		if(nodeId == this.maxScoresArray[x].nodeId) {
			this.maxScoresArray[x].maxScoreValue = maxScoreValue;
			nodeIdFound = true;
		}
	}
	
	//check if we found the nodeId
	if(!nodeIdFound) {
		/*
		 * we did not find a max score object with the nodeId so we
		 * will have to add it
		 */
		var maxScoreObj = new MaxScore(nodeId, maxScoreValue);
		this.maxScoresArray.push(maxScoreObj);		
	}
};

/**
 * Gets the max score value for a given nodeId or 0 as the default
 * value if there is no entry for that nodeId
 * @param nodeId
 */
MaxScores.prototype.getMaxScoreValueByNodeId = function(nodeId) {
	for(var x=0; x<this.maxScoresArray.length; x++) {
		if(nodeId == this.maxScoresArray[x].nodeId) {
			return this.maxScoresArray[x].maxScoreValue;
		}
	}
	
	//return 0 as the default value if there is no max score entry for the nodeId
	return 0;
};

/**
 * Merge two MaxScores objects. If there are conflicting nodeId
 * entries, we will use the newMaxScores' maxScoreValue for
 * that nodeId
 * @param newMaxScores
 */
MaxScores.prototype.mergeMaxScores = function(newMaxScores) {
	//loop through all the other MaxScores' entries
	for(var x=0; x<newMaxScores.maxScoresArray.length; x++) {
		//get a MaxScore object
		var newMaxScore = newMaxScores.maxScoresArray[x];
		
		//get the nodeId
		var nodeId = newMaxScore.nodeId;
		
		//get the max score value
		var maxScoreValue = newMaxScore.maxScoreValue;
		
		/*
		 * update the max score for the nodeId, if there is
		 * no entry with the given nodeId, a new entry will
		 * automatically be created
		 */
		this.updateMaxScore(nodeId, maxScoreValue);
	}
};

/**
 * Get the sum of all the max scores specified by the teacher
 * for the project
 * @return an integer containing the sum of all the max
 * scores specified by the teacher for the project
 */
MaxScores.prototype.getMaxScoresSum = function() {
	var maxScoresSum = 0;
	
	//loop through all the max scores
	for(var x=0; x<this.maxScoresArray.length; x++) {
		//get a max score
		var maxScoreValue = this.maxScoresArray[x].maxScoreValue;
		
		//add it to the cumulative sum
		maxScoresSum += maxScoreValue;
	}
	
	return maxScoresSum;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/grading/MaxScores.js');
};
function MaxScore(nodeId, maxScoreValue) {
	this.nodeId = nodeId;
	this.maxScoreValue = maxScoreValue;
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/grading/MaxScore.js');
};
