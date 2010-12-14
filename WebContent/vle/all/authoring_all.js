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

var DDSPEED = 3;
var DDTIMER = 15;

// main function to handle the mouse events //
function ddMenu(id,d){
  var h = document.getElementById(id + '-ddheader');
  var c = document.getElementById(id + '-ddcontent');
  clearInterval(c.timer);
  if(d == 1){
    clearTimeout(h.timer);
    if(c.maxh && c.maxh <= c.offsetHeight){return}
    else if(!c.maxh){
      c.style.display = 'block';
      c.style.height = 'auto';
      c.maxh = c.offsetHeight;
      c.style.height = '0px';
    }
    c.timer = setInterval(function(){ddSlide(c,1)},DDTIMER);
  }else{
    //h.timer = setTimeout(function(){ddCollapse(c)},50);
	  ddCollapse(c);
  }
}

// collapse the menu //
function ddCollapse(c){
  c.timer = setInterval(function(){ddSlide(c,-1)},DDTIMER);
}

// cancel the collapse if a user rolls over the dropdown //
function cancelHide(id){
  var h = document.getElementById(id + '-ddheader');
  var c = document.getElementById(id + '-ddcontent');
  clearTimeout(h.timer);
  clearInterval(c.timer);
  if(c.offsetHeight < c.maxh){
    c.timer = setInterval(function(){ddSlide(c,1)},DDTIMER);
  }
}

// incrementally expand/contract the dropdown and change the opacity //
function ddSlide(c,d){
  var currh = c.offsetHeight;
  var dist;
  if(d == 1){
    dist = (Math.round((c.maxh - currh) / DDSPEED));
  }else{
    dist = (Math.round(currh / DDSPEED));
  }
  if(dist <= 1 && d == 1){
    dist = 1;
  }
  c.style.height = currh + (dist * d) + 'px';
  c.style.opacity = currh / c.maxh;
  c.style.filter = 'alpha(opacity=' + (currh * 100 / c.maxh) + ')';
  if((currh < 2 && d != 1) || (currh > (c.maxh - 2) && d == 1)){
    clearInterval(c.timer);
  }
}


//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/common/dropdown.js');
};
View.prototype.dropDownMenuDispatcher = function(type,args,obj){
	if(type=='showJournal'){
		obj.showJournal();
	} else if(type=='showAllWork'){
		obj.showAllWork();
	} else if(type=='displayProgress'){
		obj.displayProgress(args[0], args[1]);
	}
};


/**
 * Displays the journal
 */
View.prototype.showJournal = function() {
	if(this.journalPanel == null || 
			this.journalPanel.cfg == null) {
        
		this.journalPanel = new YAHOO.widget.Panel("journalPanel", {
			width: "600px",
			height: "600px",
			fixedcenter: false,
			constraintoviewport: false,
			underlay: "shadow",
			close: true,
			visible: true,
			draggable: true,
			context: ["showbtn", "tl", "bl"]
		});
		
		/*
		 * have the saveJournal() function called when the journal is closed.
		 * closing the journal means just hiding it.
		 */
		this.journalPanel.hideEvent.subscribe(this.saveJournal, this);
		
		this.journalPanel.setHeader("Journal");
		this.journalPanel.setBody("<iframe name='journalFrame' id='journalFrame' frameborder='0' width='100%' height='100%' src='journal/journal.html'></iframe>");

		//this.journalPanel.cfg.setProperty("underlay", "matte");
		this.journalPanel.render();
		
		window.frames['journalFrame'].eventManager = eventManager;
	} else {
		this.journalPanel.cfg.setProperty("visible", true);
	}
}


/**
 * This function is called when the journal is closed (closing the journal
 * really means just hiding it). The context while in this function is
 * actually in the journalPanel so in order to access the vle we need
 * to use the 3rd argument me 
 * @param type the type of event
 * @param args the arguments of the event
 * @param me the vle object
 */
View.prototype.saveJournal = function() {
	//check if there is a journal
	if(this.journal) {
		//tell the journal to save to the server
		this.journal.saveToServer();
	};
};

/**
 * Resizes the journal
 * @param size a string argument of "minimize", "medium", or "maximize"
 */
View.prototype.resizeJournal = function(size) {
	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	
	if(size == "minimize") {
		//resize the journal to only display the resize buttons
		this.journalPanel.cfg.setProperty("height", "100px");
		this.journalPanel.cfg.setProperty("width", "430px");
	} else if(size == "original") {
		//resize the journal to display all the journal elements easily
		this.journalPanel.cfg.setProperty("height", "550px");
		this.journalPanel.cfg.setProperty("width", "600px");
	} else if(size == "narrow") {
		//resize the journal to fit over the left nav area
		this.journalPanel.cfg.setProperty("height", (windowHeight - 10) + "px");
		this.journalPanel.cfg.setProperty("width", "225px");
	} else if(size == "wide") {
		//resize the journal to be short and wide
		this.journalPanel.cfg.setProperty("height", "200px");
		this.journalPanel.cfg.setProperty("width", "1000px");
	} else if(size == "maximize") {
		//resize the journal to fit over the whole vle
		this.journalPanel.cfg.setProperty("height", (windowHeight - 10) + "px");
		this.journalPanel.cfg.setProperty("width", "1000px");
	};
};


View.prototype.showAllWork = function(){
	var doDisplayShowAllWork = true;
	this.getAnnotations(doDisplayShowAllWork);
}

View.prototype.displayShowAllWork = function(doGrading) {
    var allWorkHtml = "";
	allWorkHtml = "<div id=\"showWorkContainer\">" + this.project.getShowAllWorkHtml(this.project.getRootNode(), doGrading) + "</div>";
    YAHOO.namespace("example.container");
    var content = document.getElementById("showAllWorkDiv");
    
    content.innerHTML = "<div class=\"test\"></div>";
    
    if (!YAHOO.example.container.showallwork) {
    
        // Initialize the temporary Panel to display while showallworking for external content to load
        YAHOO.example.container.showallwork = new YAHOO.widget.Panel("showallwork", {
            width: "980px",
			height: "665px",
			constraintoviewport:true,
			fixedcenter: true,
            close: true,
        	draggable: true,
            zindex: 4,
            modal: true,
            visible: false
        });
        
        YAHOO.example.container.showallwork.setHeader("MY WORK (w/Teacher Feedback and Scores)");
        YAHOO.example.container.showallwork.setBody(allWorkHtml);
        YAHOO.example.container.showallwork.render(document.body);
    }
    else {
        YAHOO.example.container.showallwork.setBody(allWorkHtml);
    }
    
    // Show the Panel
    YAHOO.example.container.showallwork.show();
}

/**
 * Retrieve all the annotations for the currently-logged in user/workgroup
 * from the teacher.
 */
View.prototype.getAnnotations = function(doDisplayShowAllWork) {
	var processGetAnnotationResponse = function(responseText, responseXML, args) {
		var thisView = args[0];
		//parse the xml annotations object that contains all the annotations
		thisView.annotations = Annotations.prototype.parseDataJSONString(responseText);
		if (doDisplayShowAllWork) {
			thisView.displayShowAllWork(true);
		}
	};

	var annotationsUrlParams = {runId: this.getConfig().getConfigParam('runId'), toWorkgroup: this.getUserAndClassInfo().getWorkgroupId(), fromWorkgroup: this.getUserAndClassInfo().getTeacherWorkgroupId(), periodId:this.getUserAndClassInfo().getPeriodId()};
	this.connectionManager.request('GET', 3, this.getConfig().getConfigParam('getAnnotationsUrl'), annotationsUrlParams, processGetAnnotationResponse, [this]);
};

/**
 * brings up the progress of the currently-logged in user
 * @param doPopup true iff the progress should appear in a popup. 
 * Otherwise, display the progress in the page
 * @param reportsToShow array of report names to show. Possible values
 * are: {onlyLatestAsCSV,allAnswerRevisionsCSV,allAnswerRevisionsHtml, timeline}
 * @return
 */
View.prototype.displayProgress = function(doPopup, reportsToShow) {
	if (doPopup) {
	   YAHOO.namespace("example.container");

	   if (!YAHOO.example.container.displayprogress) {
		    
	        // Initialize the temporary Panel to display while showallworking for external content to load
	        
	        YAHOO.example.container.displayprogress = new YAHOO.widget.Panel("displayProgress", {
	            width: "800px",
				height: "300px",
				fixedcenter: true,
	            close: true,
	            draggable: false,
	            zindex: 4,
	            modal: true,
	            visible: false
	        });
	        
	        YAHOO.example.container.displayprogress.setHeader("My Progress");
	        YAHOO.example.container.displayprogress.setBody(vle.getProgress(reportsToShow));
	        YAHOO.example.container.displayprogress.render(document.body);
	        
	    }
	    else {
	        YAHOO.example.container.displayprogress.setBody(vle.getProgress(reportsToShow));
	    }
	    
	    // Show the Panel
	    YAHOO.example.container.displayprogress.show();
	} else {
		document.getElementById('centeredDiv').style.display = "none";
		document.getElementById('progressDiv').innerHTML = vle.getProgress(reportsToShow);
	}
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/vle/vleview_dropdownmenu.js');
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
 * Creates a custom Keystroke Manager object that listens for the onkeyup and
 * onkeydown events and fires the associated event when a given pattern of
 * keystrokes occurs.
 * 
 * Usage: createKeystrokeManager(eventManager, shortcuts) where shortcuts is
 * an array of shortcuts to listen for. Each item in the array is an array of
 * arguments, the same that would be passed in when calling addShortcut.
 * 
 * addShortcut takes three arguments: the event name - the name of the event to
 * fire when the given keystrokes occur, keycode - the keycode of the key to
 * listen for and optionally special keys - an array of special keys that are
 * pressed at the same time as the key of the given keycode.
 * 
 * Examples: 
 * 
 * addShortcut('rightArrowPressed', 39) - the keystroke manager will fire
 * the event 'rightArrowPressed' when the right arrow is pressed.
 * 
 * addShortcut('rightArrowAndShiftPressed', 39, ['shift']) - the keystroke
 * manager will fire the event 'rightArrowAndShiftPressed' when both the
 * right arrow and the shift key are pressed together.
 * 
 * addShortcut('rightArrowShiftAndCtrlPressed', 39, ['shift','ctrl']) - the
 * keystroke manager will fire the event 'rightArrowShiftAndCtrlPressed' when
 * the right arrow, shift key and ctrl key are pressed together.
 */
function createKeystrokeManager(eventManager, shortcuts){
	return function(em,sc){
		var eventManager = em;
		var shortcuts = {};
		var old_onkeydown;
		var old_onkeyup;
		var altkeydown = false;
		var shiftkeydown = false;
		var ctrlkeydown = false;
		
		/* Keeps track of which of the special keys have been pressed */
		var trackSpecials = function(e){
			/* tracks the alt keypress */
			if(e.altKey){
				altkeydown = true;
			} else {
				altkeydown = false;
			};
			
			/* tracks the ctrl keypress */
			if(e.ctrlKey){
				ctrlkeydown = true;
			} else {
				ctrlkeydown = false;
			};
			
			/* tracks the shift keypress */
			if(e.shiftKey){
				shiftkeydown = true;
			} else {
				shiftkeydown = false;
			};
		};
		
		/* Listens for the keyup event */
		var processUp = function(e){
			trackSpecials(e);
		};
		
		/* Listens for the keydown event */
		var processDown = function(e){
			trackSpecials(e);
			
			var shortcut = shortcuts[e.keyCode];
			
			/* only continue processing if shortcut with that keyCode has been created */
			if(shortcut){
				//get any special keys that are currently being pressed
				var activeSpecials = [];
				if(e.ctrlKey){
					activeSpecials.push('ctrl');
				};
				if(e.altKey){
					activeSpecials.push('alt');
				};
				if(e.shiftKey){
					activeSpecials.push('shift');
				};
				
				for(var e=0;e<shortcut.specials.length;e++){
					var special = shortcut.specials[e];
					/* if special keys exist, compare against active special keys and fire event if they match */
					if(special && special.length==activeSpecials.length){
						special.sort();
						activeSpecials.sort();
						if(special.compare(activeSpecials)){
							eventManager.fire(shortcut.events[e]);
						};
					/* if special keys do not exist and no active special keys then fire event */
					} else if(!special && activeSpecials.length==0){
						eventManager.fire(shortcut.events[e]);
					};
				};
			};
		};
		
		/* Preserves the current windows onkeydown and onkeyup functions and overwrites them with custom listeners. */
		var startListener = function(){
			old_onkeydown = window.onkeydown;
			old_onkeyup = window.onkeyup;
			window.onkeydown = processDown;
			window.onkeyup = processUp;
		};
		
		/* stops the listener and restores the state of the original onkeydown and onkeyup functions */
		var stopListener = function(){
			window.onkeydown = old_onkeydown;
			window.onkeyup = old_onkeyup;
		};
		
		/* Adds a shortcut to listen for given the keycode, special keys and the
		 * event name to fire when the keystrokes occur. */
		var addShortcut = function(eventName, keycode, specials){
			var shortcut = shortcuts[keycode];
			
			if(eventName && keycode){
				if(!shortcut){
					shortcuts[keycode] = {
						events:[],
						specials:[]
					};
					shortcut = shortcuts[keycode];
				};
				shortcut.events.push(eventName);
				shortcut.specials.push(specials);
			} else {
				alert('unable to add shortcut, check eventName or keycode');
			};
		};
		
		/* cycle through any of the given shortcuts and add them */
		if(sc){
			for(var r=0;r<sc.length;r++){
				addShortcut(sc[r][0], sc[r][1], sc[r][2]);
			};
		};
		
		/* start listening */
		startListener();
		
		/* public methods */
		return {
			/* Adds a shortcut to listen for given the keycode, special keys and the
			 * event name to fire when the keystrokes occur. */
			addShortcut:function(eventName, keycode, specials){addShortcut(eventName,keycode,specials);},
			/* stops the listener and restores the state of the original onkeydown and onkeyup functions */
			stopListener:function(){stopListener();},
			/* Preserves the current windows onkeydown and onkeyup functions and overwrites them with custom listeners. */
			startListener:function(){startListener();},
			/* Returns true if the alt key has been pressed, false otherwise */
			isAltkeydown:function(){return altkeydown;},
			/* Returns true if the shift key has been pressed, false otherwise */
			isShiftkeydown:function(){return shiftkeydown;},
			/* Returns true if the ctrl key has been pressed, false otherwise */
			isCtrlkeydown:function(){return ctrlkeydown;}
		};
	}(eventManager,shortcuts);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/util/keystrokemanager.js');
};
function createCustomContextMenu(eventManager){
	return function(em){
		var eventManager = em;
		var cursor = {x:0,y:0};
		var old_onmousemove;
		var old_oncontextmenu;
		
		 gets the cursor position each time the mouse moves 
		var getCursorPos = function(e){
			cursor.x = e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
			cursor.y = e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
		};
		
		 custom context menu 
		var customContextMenu = function(){
			//get element that pointer is currently over
			var overEl = document.elementFromPoint(cursor.x, cursor.y);
			var menu = document.getElementById('contextMenu');
			
			//clear old elements
			while(menu.firstChild){
				menu.removeChild(menu.firstChild);
			};
			
			//create standard elements
			var createTask = createElement(document, 'div', {id: 'contextCreateTask', onclick: 'hideElement("contextMenu");eventManager.fire("createTODOTask")'});
			var createTaskText = document.createTextNode('Create new TODO task');
			var cancelMenu = createElement(document, 'div', {id: 'contextCloseMenuDiv', onclick: 'hideElement("contextMenu");'});
			var cancelMenuText = document.createTextNode('Close menu');
			
			menu.appendChild(createTask);
			createTask.appendChild(createTaskText);
			menu.appendChild(cancelMenu);
			cancelMenu.appendChild(cancelMenuText);
			
			//determine if this is a todo-able element by parsing id
			if(overEl){
				var rawId = overEl.id;
				if(rawId){
					var childId = overEl.id.split('|')[1];
					
					if(childId && childId!=''){
						//create and insert new child
						var child = createElement(document, 'div', {id:'contextCreateSpecificTODODiv', onclick: 'eventManager.fire("createTODOTask","' + childId + '")'});
						var text = document.createTextNode('Create new TODO task for node: ' + childId);
						menu.insertBefore(child, document.getElementById('contextCloseMenuDiv'));
						child.appendChild(text);
					};
				};
			};
			
			//set up additional menu styling
			menu.style.display = 'block';
			menu.style.position = 'absolute';
			menu.style.left = cursor.x;
			menu.style.top = cursor.y;
			return false;
		};
		
		 preserves the functions for onmousemove and oncontextmenu and starts listening for these events 
		var startListening = function(){
			old_onmousemove = window.onmousemove;
			old_oncontextmenu = window.oncontextmenu;
			
			 start chasing the mouse around and record the x,y coordinates 
			window.onmousemove = getCursorPos;
			 take over the right click menu 
			window.oncontextmenu = customContextMenu;
		};
		
		 stops listening and restores the original onmousemove and oncontextmenu functions 
		var stopListening = function(){
			window.onmousemove = old_onmousemove;
			window.oncontextmenu = old_oncontextmenu;
		}
		
		 start listening 
		startListening();
		
		 public methods 
		return {
			getCursor:function(){return cursor;},
			startListening:function(){startListening();},
			stopListening:function(){stopListening();}
		};
	}(eventManager);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/util/customcontextmenu.js');
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
/**
 * The following four variables are used for setting and using the
 * appropriate icons for the nodes.
 */
var iconUrl = 'images/stepIcons/UCCP/';
var nodeTypes = ['HtmlNode', 'BrainstormNode', 'FillinNode', 'MatchSequenceNode', 'MultipleChoiceNode', 
		'NoteNode', 'JournalEntryNode', 'OutsideUrlNode', 'GlueNode', 'OpenResponseNode', 'BlueJNode', 'DrawNode',
		'DataGraphNode', 'MySystemNode'];
var nodeClasses = [['intro', 'curriculum', 'display', 'cartoon', 'codeit', 'simulation', 'movie', 'homework', 'summary'],
			['brainstorm', 'qadiscuss'],
			['fillblank'],
			['matchsequence'],
			['multiplechoice'],
			['note'],
			['journal'],
			['www'],
			['instantquiz', 'teacherquiz'],
			['openresponse'],
			['codeit'],
			['quickdraw'],
			['datatable'],
			['mysystem']];
var nodeClassText = [['Introductory Page', 'Curriculum Page', 'Display Page', 'Cartoon Page', 'Coding Page', 'Simulation Page', 'Movie Page', 'Homework Page', 'Summary Page'],
			['Brainstorm session', 'Q&A Discussion'],
			['Fill the Blank'],
			['Match & Sequence'],
			['Multiple Choice'],
			['Reflection Note (popup)'],
			['Journal Question'],
			['WWW Page'],
			['Survey 1', 'Survey 2'],
			['Open Response'],
			['Code it'],
			['Drawing'],
			['Data Graph'],
			['My System']];

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/util/icon.js');
};
/**
 * The authorDispatcher catches events specific to the authoring and
 * delegates them to the appropriate functions for this view.
 * 
 * @author patrick lawler
 */
View.prototype.authorDispatcher = function(type,args,obj){
	if(type=='openProject'){
		obj.openProject();
	} else if(type=='projectSelected'){
		obj.projectOptionSelected();
	} else if(type=='loadingProjectComplete'){
		obj.onProjectLoaded();
	} else if(type=='hideNodes'){
		obj.utils.hideNodes();
	} else if(type=='unhideNodes'){
		obj.utils.unhideNodes();
	} else if(type=='toggleProjectMode'){
		obj.toggleProjectMode();
	} else if(type=='projectTitleChanged'){
		obj.projectTitleChanged();
	} else if(type=='stepLevelChanged'){
		obj.stepLevelChanged();
	} else if(type=='stepTermChanged'){
		obj.stepTermChanged();
	} else if(type=='autoStepChanged'){
		obj.autoStepChanged();
	} else if(type=='author'){
		obj.author(args[0]);
	} else if(type=='nodeIconUpdated'){
		obj.nodeIconUpdated(args[0]);
	} else if(type=='nodeTitleChanged'){
		obj.nodeTitleChanged(args[0]);
	} else if(type=='launchPrevWork'){
		obj.launchPrevWork(args[0]);
	} else if(type=='moveSelectedLeft'){
		obj.moveSelectedLeft();
	} else if(type=='moveSelectedRight'){
		obj.moveSelectedRight();
	} else if(type=='savePreviousWork'){
		obj.savePreviousWork();
	} else if(type=='cancelPreviousWorkChanges'){
		obj.cancelPreviousWorkChanges();
	} else if(type=='saveProject'){
		obj.saveProject();
	} else if(type=='createNewProject'){
		obj.createNewProject();
	} else if(type=='copyProject'){
		obj.copyProject();
	} else if(type=='createNewSequence'){
		obj.createNewSequence();
	} else if(type=='createNewNode'){
		obj.createNewNode();
	} else if(type=='nodeTypeSelected'){
		obj.nodeTypeSelected();
	} else if(type=='uploadAsset'){
		obj.uploadAsset();
	} else if(type=='viewAssets'){
		obj.viewAssets();
	} else if(type=='editProjectFile'){
		obj.editProjectFile();
	} else if(type=='updateAudio'){
		obj.updateAudio();
	} else if(type=='exportProject'){
		obj.exportProject();
	} else if(type=='importProject'){
		obj.importProject();
	} else if(type=='retrieveArchive'){
		obj.retrieveArchive();
	} else if(type=='publishProject'){
		obj.publishProject();
	} else if(type=='downloadArchive'){
		obj.downloadArchive();
	} else if(type=='hideRetrieveArchiveDialog'){
		obj.retrieveArchiveDialog.hide();
	} else if(type=='previewProject'){
		obj.previewProject();
	} else if(type=='startPreview'){
		obj.startPreview(args[0]);
	} else if(type=='portalMode'){
		var portalAuthorUrl = args[0];
		var curriculumBaseDir = args[1];
		var command = args[2];
		var projectId = args[3];
		obj.startPortalMode(portalAuthorUrl, curriculumBaseDir, command, projectId);
	} else if(type=='projectListLoaded'){
		obj.updatePortalProjects();
	};
};

/**
 * The selectDispatcher catches events specific to the selection and
 * delegates them to the appropriate functions for this view.
 */
View.prototype.selectDispatcher = function(type,args,obj){
	if(type=='checkAndSelect'){
		obj.checkModeAndSelect(args[0]);
	} else if(type=='checkAndDeselect'){
		obj.checkModeAndDeselect(args[0]);
	} else if(type=='selectClick'){
		obj.selectClick(args[0]);
	} else if(type=='selectAll'){
		obj.selectAll();
	} else if(type=='clearAll'){
		obj.clearAllSelected();
	} else if(type=='moveSelected'){
		obj.moveSelected();
	} else if(type=='deleteSelected'){
		obj.deleteSelected();
	} else if(type=='duplicateSelected'){
		obj.duplicateSelected();
	} else if(type=='useSelected'){
		obj.useSelected();
	} else if(type=='disengageSelectMode'){
		obj.disengageSelectMode(args[0]);
	} else if(type=='processChoice'){
		obj.processChoice(args[0], args[1]);
	};
};

/**
 * The selectDispatcher catches events specific to metadata and
 * delegates them to the appropriate functions for this view.
 */
View.prototype.metaDispatcher = function(type,args,obj){
	if(type=='removeTask'){
		obj.removeTask(args[0]);
	} else if(type=='createTODOTask'){
		if(args && args[0]){
			obj.createTODOTask(args[0]);
		} else {
			obj.createTODOTask();
		};
	} else if(type=='editTODOTasks'){
		obj.editTODOTasks();
	} else if(type=='editProjectMetadata'){
		obj.editProjectMetadata();
	} else if(type=='showTaskBox'){
		obj.showTaskBox(args[0]);
	} else if(type=='delayHideTaskBox'){
		obj.delayHideTaskBox(args[0]);
	} else if(type=='hideTaskBox'){
		obj.hideTaskBox();
	} else if(type=='stopHiding'){
		obj.stopHiding(args[0]);
	} else if(type=='editTaskFieldModified'){
		obj.editTaskFieldModified(args[0]);
	} else if(type=='saveTaskChange'){
		obj.saveTaskChange(args[0]);
	} else if(type=='undoTaskChange'){
		obj.undoTaskChange(args[0]);
	} else if(type=='updateProjectMetadata'){
		obj.updateProjectMetadata();
	} else if(type=='publishProjectMetadata'){
		obj.publishProjectMetadata();
	} else if(type=='undoProjectMetadata'){
		obj.undoProjectMetadata();
	} else if(type=='hideProjectMetadataDialog'){
		obj.editProjectMetadataDialog.hide();
	} else if(type=='maxScoreUpdated'){
		obj.maxScoreUpdated(args[0]);
	};
};

/**
 * The authorStepDispatcher catches events specific to authoring individual
 * steps and delegates them to the appropriate functions for this view.
 */
View.prototype.authorStepDispatcher = function(type,args,obj){
	if(type=='saveStep'){
		obj.saveStep();
	} else if(type=='saveAndCloseStep'){
		obj.saveStep(true);
	} else if(type=='authorStepModeChanged'){
		obj.authorStepModeChanged(args[0]);
	} else if(type=='updateRefreshOption'){
		obj.updateRefreshOption();
	} else if(type=='refreshNow'){
		obj.refreshNow();
	} else if(type=='sourceUpdated'){
		obj.sourceUpdated();
	} else if(type=='closeOnStepSaved'){
		obj.closeOnStepSaved(args[0]);
	} else if(type=='closeStep'){
		obj.closeStep();
	};
};

/**
 * The openResponseDispatcher catches events specific to authoring individual
 * open response type steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.openResponseDispatcher = function(type,args,obj){
	if(type=='openResponsePromptChanged'){
		obj.OpenResponseNode.updateXMLPrompt();
	} else if(type=='openResponseStarterOptionChanged'){
		obj.OpenResponseNode.starterChanged();
	} else if(type=='openResponseStarterSentenceUpdated'){
		obj.OpenResponseNode.starterUpdated();
	} else if(type=='openResponseUpdateRichText'){
		obj.OpenResponseNode.updateRichText();
	} else if(type=='openResponseLinesChanged'){
		obj.OpenResponseNode.linesUpdated();
	};
};

/**
 * The brainstormDispatcher catches events specific to authoring individual
 * brainstorm steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.brainstormDispatcher = function(type,args,obj){
	if(type=='brainstormUpdateExpectedLines'){
		obj.BrainstormNode.updateExpectedLines();
	} else if(type=='brainstromUpdateTitle'){
		obj.BrainstormNode.updateTitle();
	} else if(type=='brainstormUpdateGated'){
		obj.BrainstormNode.updateGated(args[0]);
	} else if(type=='brainstormUpdateDisplayName'){
		obj.BrainstormNode.updateDisplayName(args[0]);
	} else if(type=='brainstormUpdateRichText'){
		obj.BrainstormNode.updateRichText(args[0]);
	} else if(type=='brainstormUpdatePollEnded'){
		obj.BrainstormNode.updatePollEnded(args[0]);
	} else if(type=='brainstormUpdateInstantPoll'){
		obj.BrainstormNode.updateInstantPoll(args[0]);
	} else if(type=='brainstormStarterChanged'){
		obj.BrainstormNode.starterChanged();
	} else if(type=='brainstormStarterUpdated'){
		obj.BrainstormNode.starterUpdated();
	} else if(type=='brainstormUpdatePrompt'){
		obj.BrainstormNode.updatePrompt();
	} else if(type=='brainstormCreateNewResponse'){
		obj.BrainstormNode.createNewResponse();
	} else if(type=='brainstormRemoveResponse'){
		obj.BrainstormNode.removeResponse();
	} else if(type=='brainstormResponseNameChanged'){
		obj.BrainstormNode.responseNameChanged(args[0]);
	} else if(type=='brainstormResponseValueChanged'){
		obj.BrainstormNode.responseValueChanged(args[0]);
	} else if(type=='brainstormResponseSelected'){
		obj.BrainstormNode.responseSelected(args[0]);
	};
};

/**
 * The datagraphDispatcher catches events specific to authoring individual
 * datagraph steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.datagraphDispatcher = function(type,args,obj){
	if(type=='datagraphDisplayOptionChanged'){
		obj.DataGraphNode.displayOptionChanged();
	} else if(type=='datagraphStartModeChanged'){
		obj.DataGraphNode.startModeChanged();
	} else if(type=='datagraphGraphOptionChanged'){
		obj.DataGraphNode.graphOptionChanged(args[0]);
	} else if(type=='datagraphPromptChanged'){
		obj.DataGraphNode.promptChanged();
	} else if(type=='datagraphTitleInputChanged'){
		obj.DataGraphNode.titleInputChanged();
	} else if(type=='datagraphEditableChanged'){
		obj.DataGraphNode.editableChanged(args[0]);
	} else if(type=='datagraphAddRow'){
		obj.DataGraphNode.addRow();
	} else if(type=='datagraphAddCol'){
		obj.DataGraphNode.addCol();
	} else if(type=='datagraphRemoveRow'){
		obj.DataGraphNode.removeRow();
	} else if(type=='datagraphRemoveCol'){
		obj.DataGraphNode.removeCol();
	} else if(type=='datagraphToggleLabels'){
		obj.DataGraphNode.toggleLabels(args[0]);
	} else if(type=='datagraphToggleSelected'){
		obj.DataGraphNode.toggleSelected(args[0]);
	} else if(type=='datagraphCellChanged'){
		obj.DataGraphNode.cellChanged(args[0]);
	};
};

/**
 * The drawingDispatcher catches events specific to authoring individual
 * draw node steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.drawingDispatcher = function(type,args,obj){
	if(type=='drawingPromptChanged'){
		obj.DrawNode.promptChanged();
	} else if(type=='drawingBackgroundInfoChanged'){
		obj.DrawNode.backgroundInfoChanged();
	} else if(type=='drawingRemoveBackgroundImage'){
		obj.DrawNode.removeBackgroundImage();
	} else if(type=='drawingCreateBackgroundSpecified'){
		obj.DrawNode.createBackgroundSpecified();
	} else if(type=='drawingAddNewStamp'){
		obj.DrawNode.addNewStamp();
	} else if(type=='drawingStampInfoChanged'){
		obj.DrawNode.stampInfoChanged(args[0]);
	} else if(type=='drawingRemoveStamp'){
		obj.DrawNode.removeStamp(args[0]);
	} else if(type=='drawingCreateStampsSpecified'){
		obj.DrawNode.createStampsSpecified();
	};
};

/**
 * The drawingDispatcher catches events specific to authoring individual
 * draw node steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.fillinDispatcher = function(type,args,obj){
	if(type=='fillinTextUpdated'){
		obj.FillinNode.fillinTextUpdated();
	} else if(type=='fillinCreateFillin'){
		obj.FillinNode.createFillin();
	} else if(type=='fillinRemoveFillin'){
		obj.FillinNode.removeFillin();
	} else if(type=='fillinClick'){
		obj.FillinNode.fillinClick(args[0], args[1]);
	} else if(type=='fillinChangeSelected'){
		obj.FillinNode.changeSelected(args[0]);
	} else if(type=='fillinAddNewAllowable'){
		obj.FillinNode.addNewAllowable(args[0]);
	} else if(type=='fillinEntryChanged'){
		obj.FillinNode.entryChanged(args[0]);
	} else if(type=='fillinRemoveAllowable'){
		obj.FillinNode.removeAllowable(args[0], args[1]);
	};
};

/**
 * The multiplechoiceDispatcher catches events specific to authoring individual
 * multiple choice steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.multiplechoiceDispatcher = function(type,args,obj){
	if(type=='mcCreateNewChoice'){
		obj.MultipleChoiceNode.createNewChoice();
	} else if(type=='mcClearCorrectChoice'){
		obj.MultipleChoiceNode.clearCorrectChoice();
	} else if(type=='mcShuffleChange'){
		obj.MultipleChoiceNode.shuffleChange(args[0]);
	} else if(type=='mcFeedbackOptionChange'){
		obj.MultipleChoiceNode.feedbackOptionChange(args[0]);
	} else if(type=='mcNumChoiceChanged'){
		obj.MultipleChoiceNode.numChoiceChanged();
	} else if(type=='mcXmlUpdated'){
		obj.MultipleChoiceNode.xmlUpdated();
	} else if(type=='mcCorrectChoiceChange'){
		obj.MultipleChoiceNode.correctChoiceChange(args[0]);
	} else if(type=='mcRemoveChoice'){
		obj.MultipleChoiceNode.removeChoice(args[0]);
	};
};

/**
 * The mysystemDispatcher catches events specific to authoring individual
 * my system steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.mysystemDispatcher = function(type,args,obj){
	if(type=='mysystemPromptChanged'){
		obj.MySystemNode.promptChanged();
	} else if(type=='mysystemFieldUpdated'){
		obj.MySystemNode.fieldUpdated(args[0], args[1]);
	} else if(type=='mysystemRemoveMod'){
		obj.MySystemNode.removeMod(args[0]);
	} else if(type=='mysystemAddNew'){
		obj.MySystemNode.addNew();
	};
};

/**
 * The matchsequenceDispatcher catches events specific to authoring individual
 * match sequence steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.matchsequenceDispatcher = function(type,args,obj){
	if(type=='msUpdatePrompt'){
		obj.MatchSequenceNode.updatePrompt();
	} else if(type=='msUpdateOrdered'){
		obj.MatchSequenceNode.updateOrdered(args[0]);
	} else if(type=='msAddContainer'){
		obj.MatchSequenceNode.addContainer();
	} else if(type=='msAddChoice'){
		obj.MatchSequenceNode.addChoice();
	} else if(type=='msRemoveChoice'){
		obj.MatchSequenceNode.removeChoice();
	} else if(type=='msRemoveContainer'){
		obj.MatchSequenceNode.removeContainer();
	} else if(type=='msEditFeedback'){
		obj.MatchSequenceNode.editFeedback();
	} else if(type=='msShuffleChanged'){
		obj.MatchSequenceNode.shuffleChanged();
	} else if(type=='msContainerSelected'){
		obj.MatchSequenceNode.containerSelected(args[0]);
	} else if(type=='msContainerTextUpdated'){
		obj.MatchSequenceNode.containerTextUpdated(args[0]);
	} else if(type=='msChoiceSelected'){
		obj.MatchSequenceNode.choiceSelected(args[0],args[1]);
	} else if(type=='msChoiceTextUpdated'){
		obj.MatchSequenceNode.choiceTextUpdated(args[0]);
	} else if(type=='msOrderUpdated'){
		obj.MatchSequenceNode.orderUpdated(args[0]);
	} else if(type=='msHideFeedback'){
		obj.MatchSequenceNode.hideFeedback();
	} else if(type=='msEditIndividualFeedback'){
		obj.MatchSequenceNode.editIndividualFeedback(args[0],args[1]);
	} else if(type=='msSaveFeedback'){
		obj.MatchSequenceNode.saveFeedback();
	};
};

/**
 * The glueDispatcher catches events specific to authoring individual
 * glue steps and delegates them to the appropriate functions for
 * this view.
 */
View.prototype.glueDispatcher = function(type,args,obj){
	if(type=='glueUpdatePrompt'){
		obj.GlueNode.updatePrompt();
	} else if(type=='glueNodeDropped'){
		obj.GlueNode.onNodeDropped(args[0],args[1]);
	} else if(type=='glueCreateDraggable'){
		obj.GlueNode.createDraggable(args[0],args[1]);
	} else if(type=='glueCreateTarget'){
		obj.GlueNode.createTarget(args[0],args[1]);
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_dispatchers.js');
};
/**
 * @author patrick lawler
 */

/**
 * Sets variables so that the authoring tool is running in portal mode
 * and starts authoring tool in appropriate state.
 */
View.prototype.startPortalMode = function(url, curriculumBaseDir, command, id){
	this.portalUrl = url;
	this.portalCurriculumBaseDir = curriculumBaseDir;
	this.primaryPath = curriculumBaseDir;
	
	if(command && command!=''){
		if(command=='createProject'){
			this.createMode = true;
		} else if(command=='editProject'){
			var pathId = id.split('~');
			this.portalProjectId = pathId[1];
			var projectUrl = this.authoringBaseUrl + this.portalCurriculumBaseDir + pathId[0];
			this.loadProject(projectUrl, this.utils.getContentBaseFromFullUrl(projectUrl), true);
		};
	};
	
	this.eventManager.subscribe('projectListLoaded', this.authorDispatcher, this);
};

/**
 * Retrieves a list of projects that are available from the portal
 * and populates the select project list with these projects.
 */
View.prototype.updatePortalProjects = function(){
	this.portalProjectPaths = [];
	this.portalProjectIds = [];
	
	var handler = function(responseText, responseXML, o){
		var addOption = function(name){
			var parent = document.getElementById('selectProject');
			var option = createElement(document, 'option', {name: 'projectOption'});
			
			parent.appendChild(option);
			option.text = name;
			option.value = name;
		};
		
		var parent = document.getElementById('selectProject');
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		};
		var placeholder = createElement(document, 'option', {name: 'placeholderOption'});
		parent.appendChild(placeholder);
		placeholder.value = '';

		var projects = responseText.split('|');
		for(var a=0;a<projects.length;a++){
			var pathId = projects[a].split('~');
			o.portalProjectPaths.push(pathId[0]);
			o.portalProjectIds.push(pathId[1]);
			
			addOption(pathId[0]);
		};
		
		/* launch create project dialog if create mode has been set */
		if(o.createMode){
			o.createNewProject();
		};
	};
	
	this.connectionManager.request('GET', 1, this.portalUrl, {command: 'projectList'}, handler, this);
};

/**
 * Creates a project of the given name with the given path in the portal
 */
View.prototype.createPortalProject = function(path, name){
	var handler = function(responseText, responseXML, o){
		if(responseText){
			o.portalProjectId = responseText;
			o.updatePortalProjects();
		} else {
			o.notificationManager.notify('failed to create project in portal', 3);
		};
	};
	
	//remove base dir
	path = path.substring(this.portalCurriculumBaseDir.length, path.length);
	this.connectionManager.request('POST', 3, this.portalUrl, {command: 'createProject', param1: path, param2: name}, handler, this);
};

/**
 * Retrieves and parses settings.xml file for project paths, primaryPath locations.
 */
View.prototype.getProjectPaths = function(){
	var callback = function(text, xml, o){
		if(xml){
			var settings = xml;
		} else {
			var settings = loadXMLDocFromString(text);
		};

		if(settings){
			var path = settings.getElementsByTagName('projectPaths');
			
			if(path && path[0] && path[0].firstChild){
				//get project paths
				var paths = path[0].getElementsByTagName('path');
				for(var u=0;u<paths.length;u++){
					if(paths[u] && paths[u].firstChild){
						o.projectPaths += paths[u].firstChild.nodeValue;
						if(u!=paths.length-1){
							o.projectPaths += '~';
						};
					};
				};
				//get primary path
				var primary = settings.getElementsByTagName('primaryPath');
				if(primary && primary[0] && primary[0].firstChild){
					o.primaryPath = primary[0].getElementsByTagName('path');
					if(o.primaryPath && o.primaryPath[0] && o.primaryPath[0].firstChild){
						o.primaryPath = o.primaryPath[0].firstChild.nodeValue;
						o.projectPaths += '~' + o.primaryPath;
					} ;
				};
			};
			
			o.initializeOpenProjectDialog();
		} else {
			o.notificationManager.notify("Error retrieving settings", 3);
		};
	};

	this.connectionManager.request('GET', 1, 'settings.xml', null, callback, this);
};

/**
 * Retrieves a list of projects based on the paths, initializes and 
 * populates the open project dialog with the return values.
 */
View.prototype.initializeOpenProjectDialog = function(bool){
	//adds a project to the select project list
	var addOption = function(name){
		var parent = document.getElementById('selectProject');
		var option = createElement(document, 'option', {name: 'projectOption'});
		
		parent.appendChild(option);
		option.text = name;
		option.value = name;
	};

	var handleCancel = function(){
		this.cancel();
	};
	
	var handleSubmit = function(){
		eventManager.fire('projectSelected');
	};
	
	//clears the select project list and populates it again with the
	//list returned from the server and either initializes or shows
	//the dialog if previously rendered.
	var callback = function(text, xml, o){
		var parent = document.getElementById('selectProject');
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		};
		
		var projects = text.split('|');
		for(var a=0;a<projects.length;a++){
			addOption(projects[a]);
		};

		if (!o.openProjectDialog) {
			o.openProjectDialog = new YAHOO.widget.Dialog('openProjectDialog', {width :"750px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Open", handler:handleSubmit, isDefault:true}, {text:"Cancel", handler:handleCancel}]});
			o.openProjectDialog.render();
		};
		
		if (bool) {
			o.openProjectDialog.show();
		};
		
		document.getElementById('openProjectDialog').style.display = 'block';
		o.eventManager.fire('projectListLoaded');
	};
	
	this.connectionManager.request('GET', 1, 'filemanager.html', {command: 'projectList', 'projectPaths': this.projectPaths}, callback, this);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_startup.js');
};
/**
 * Functions related to the main layout of the project in the authoring view
 * 
 * @author patrick lawler
 */

/**
 * Creates the html elements necessary for authoring the currently
 * opened project.
 */
View.prototype.generateAuthoring = function(){
	var parent = document.getElementById('dynamicProject');
	
	//remove any old elements and clear variables
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	this.currentStepNum = 1;
	
	//set up project table
	var tab = createElement(document, 'table', {id: 'projectTable'});
	var tHead = createElement(document, 'thead', {id: 'projectTableHead'});
	var tBod = createElement(document, 'tbody', {id: 'projectTableBody'});
	var existingRow = createElement(document, 'tr', {id: 'existingRow'});
	var unattachedSequenceRow = createElement(document, 'tr', {id: 'unattachedSequenceRow'});
	var unattachedNodeRow = createElement(document, 'tr', {id: 'unattachedNodeRow'});
	
	parent.appendChild(tab);
	tab.appendChild(tHead);
	tab.appendChild(tBod);
	tBod.appendChild(existingRow);
	tBod.appendChild(unattachedSequenceRow);
	tBod.appendChild(unattachedNodeRow);
	
	//generate existing project structure
	var existingTable = createElement(document, 'table', {id: 'existingTable'});
	var existingTH = createElement(document, 'thead', {id: 'existingTableHead'});
	var existingTB = createElement(document, 'tbody', {id: 'existingTableBody'});
	existingRow.appendChild(existingTable);
	existingTable.appendChild(existingTH);
	existingTable.appendChild(existingTB);
	
	if(this.project.getRootNode()){
		this.generateNodeElement(this.project.getRootNode(), null, existingTable, 0, 0);
	};
	
	//generate unattached nodes
	var uSeqTable = createElement(document, 'table', {id: 'unusedSequenceTable'});
	var uSeqTH = createElement(document, 'thead');
	var uSeqTB = createElement(document, 'tbody', {id: 'unusedSequenceTableBody'});
	var uSeqTR = createElement(document, 'tr', {id: 'unusedSequenceTitleRow'});
	var uSeqETD = createElement(document, 'td');
	var uSeqTD = createElement(document, 'td');
	
	unattachedSequenceRow.appendChild(uSeqTable);
	uSeqTable.appendChild(uSeqTH);
	uSeqTable.appendChild(uSeqTB);
	uSeqTB.appendChild(uSeqTR);
	uSeqTR.appendChild(uSeqETD);
	uSeqTR.appendChild(uSeqTD);
	
	var unusedSeqDiv = createElement(document, 'div', {id: 'uSeq', onclick: 'eventManager.fire("selectClick","uSeq")', onMouseOver: 'eventManager.fire("checkAndSelect","uSeq")', onMouseOut: 'eventManager.fire("checkAndDeselect","uSeq")'});
	var unusedSeqText = document.createTextNode('Unattached Activities');
	var unusedSeqs = this.project.getUnattached('sequence');
	
	uSeqTD.appendChild(unusedSeqDiv);
	unusedSeqDiv.appendChild(unusedSeqText);
	for(var d=0;d<unusedSeqs.length;d++){
		this.generateNodeElement(unusedSeqs[d], null, uSeqTB, 0, 0);
	};
	
	var uNodeTable = createElement(document, 'table', {id: 'unusedNodeTable'});
	var uNodeTH = createElement(document, 'thead');
	var uNodeTB = createElement(document, 'tbody', {id: 'unusedNodeTableBody'});
	var uNodeTR = createElement(document, 'tr', {id: 'unusedNodeTitleRow'});
	var uNodeETD = createElement(document, 'td');
	var uNodeTD = createElement(document, 'td');
	
	unattachedNodeRow.appendChild(uNodeTable);
	uNodeTable.appendChild(uNodeTH);
	uNodeTable.appendChild(uNodeTB);
	uNodeTB.appendChild(uNodeTR);
	uNodeTR.appendChild(uNodeETD);
	uNodeTR.appendChild(uNodeTD);
	
	var unusedNodeDiv = createElement(document, 'div', {id: 'uNode', onclick: 'eventManager.fire("selectClick","uNode")', onMouseOver: 'eventManager.fire("checkAndSelect","uNode")', onMouseOut: 'eventManager.fire("checkAndDeselect","uNode")'});
	var unusedNodesText = document.createTextNode('Unattached Steps');
	var unusedNodes = this.project.getUnattached('node');
	
	uNodeTD.appendChild(unusedNodeDiv);
	unusedNodeDiv.appendChild(unusedNodesText);
	for(var e=0;e<unusedNodes.length;e++){
		this.generateNodeElement(unusedNodes[e], null, uNodeTB, 0, 0);
	};
	
	//notify user if any of their project violates their project structure mode and
	//advise to fix it in advanced structure mode if it does.
	if(this.projectStructureViolation){
		this.notificationManager.notify("The current project mode is Simple Project, but while generating the authoring, " +
				"nodes have been found that violate that structure (Project-->Activity-->Step). Those nodes have been " +
				"ignored! You should fix this by either authoring in Advanced Project mode or switching to Advanced " +
				"Project mode long enough to put the project in the structure required for Simple Project.", 3);
	};
};

/**
 * Generates the individual html elements that represent the given node and
 * appends them to the given element.
 * 
 * @param node - the node to represent
 * @param parentNode - the node's parent, can be null
 * @param el - the parent element that this element will append to
 * @param depth - depth (how many ancestors does it have
 * @param pos - position in reference to its siblings (if no parent or siblings, this will be 0)
 */
View.prototype.generateNodeElement = function(node, parentNode, el, depth, pos){
	//create an id that represents this nodes absolute position in the project/sequence
	if(parentNode){
		var absId = parentNode.id + '|' + node.id + '|' + pos;
	} else {
		var absId = 'null|' + node.id + '|' + pos;
	};
	
	//project structure validation
	if(el.id=='existingTable' && this.simpleProject){
		if(depth>2 || (depth==1 && node.type!='sequence') || (depth==2 && node.type=='sequence')){
			this.projectStructureViolation = true;
			return;
		};
	};
	
	//create and append element representing this node
	var mainTR = createElement(document, 'tr');
	var mainDiv = createElement(document, 'div', {id: absId, onclick: 'eventManager.fire("selectClick","' + absId + '")', ondblclick: 'eventManager.fire("author", "' + node.id + '")', onMouseOver: 'eventManager.fire("checkAndSelect","' + absId + '")', onMouseOut: 'eventManager.fire("checkAndDeselect","' + absId + '")'});
	var taskTD = createElement(document, 'td');
	var mainTD = createElement(document, 'td');
	el.appendChild(mainTR);
	mainTR.appendChild(taskTD);
	mainTR.appendChild(mainTD);
	
	//create space according to the depth of this node
	var tabs = "";
	for(var b=0;b<depth;b++){
		tabs += this.tab;
	};
	
	//create and set title for this node along with step term and/or numbering as specified
	var titleInput = createElement(document, 'input', {id: 'titleInput_' + node.id, type: 'text', 'class':'nodeTitleInput', onchange: 'eventManager.fire("nodeTitleChanged","' + node.id + '")', value: node.title});
	var taskDiv = createElement(document, 'div', {id: 'taskDiv_' + node.id, 'class': 'taskDiv'});
	taskTD.appendChild(taskDiv);
	mainTD.appendChild(mainDiv);
	if(node.type=='sequence'){
		var seqTitleDiv = createElement(document, 'div', {id: 'seqTitleDiv_' + absId});
		var titleText = document.createTextNode('Activity: ');
		var choiceDiv = createElement(document, 'div', {id: 'choiceDiv_' + absId});
		
		mainDiv.appendChild(seqTitleDiv);
		mainDiv.appendChild(choiceDiv);
		seqTitleDiv.innerHTML = tabs;
		seqTitleDiv.appendChild(titleText);
		seqTitleDiv.appendChild(titleInput);
		choiceDiv.style.display = 'none';
		choiceDiv.className = 'choice';
		
		if(node.id==this.project.getRootNode().id){
			mainDiv.className = 'projectNode master';
			mainDiv.innerHTML = 'Active Activities/Steps';
		} else {
			mainDiv.className = 'projectNode seq';
		};
	} else {
		if(node.className && node.className!='null' && node.className!=''){
			mainDiv.innerHTML = tabs + '<img src=\'' + iconUrl + node.className + '16.png\'/> ';
		} else {
			mainDiv.innerHTML = tabs;
		};
		
		if(this.project.useAutoStep()){
			var titleText = document.createTextNode(this.project.getStepTerm() + ' ' + this.currentStepNum + ': ');
			this.currentStepNum ++;
		} else if(this.project.getStepTerm() && this.project.getStepTerm()!=''){
			var titleText = document.createTextNode(this.project.getStepTerm() + ': ');
		};
		
		if(titleText && el.id!='unused'){
			mainDiv.appendChild(titleText);
		};
		mainDiv.appendChild(titleInput);
		mainDiv.className = 'projectNode node';
		
		//set up select for changing this node's icon
		var selectNodeText = document.createTextNode('Icon: ');
		var selectDrop = createElement(document, 'select', {id: 'nodeIcon_' + node.id, onchange: 'eventManager.fire("nodeIconUpdated","' + node.id + '")'});
		mainDiv.appendChild(selectNodeText);
		mainDiv.appendChild(selectDrop);
		
		//check to see if current node is in nodeTypes, if not ignore so that 
		//authoring tool will continue processing remaining nodes
		var ndx = nodeTypes.indexOf(node.type);
		
		//populate select with icons for its step type
		if(ndx!=-1){
			var classes = nodeClasses[ndx];
			var text = nodeClassText[ndx];
	
			var opt = createElement(document, 'option');
			opt.innerHTML = '';
			opt.value = '';
			selectDrop.appendChild(opt);
			
			for(var h=0;h<classes.length;h++){
				var opt = createElement(document, 'option');
				opt.value = classes[h];
				opt.innerHTML = '<img src=\'' + iconUrl + classes[h] + '16.png\'/> ' + text[h];
				selectDrop.appendChild(opt);
				if(node.className == classes[h]){
					selectDrop.selectedIndex = h + 1;
				};
			};
		};
		
		/* add max scores input field. values will be set on retrieval of metadata */
		var maxScoreText = document.createTextNode('Max Score: ');
		var maxScoreInput = createElement(document, 'input', {type: 'text', 'class':'maxScoreInput', id: 'maxScore_' + node.id, onchange: 'eventManager.fire("maxScoreUpdated","'+ node.id + '")'});
		mainDiv.appendChild(createSpace());
		mainDiv.appendChild(maxScoreText);
		mainDiv.appendChild(maxScoreInput);
		
		//add button to reference work to student's work in other steps
		if(this.excludedPrevWorkNodes.indexOf(node.type)==-1){
			var prevWorkButt = createElement(document, 'input', {type: 'button', 'class': 'previousWorkLink', id: 'prevWork_' + node.id, value: 'Show Prev Work', onclick: 'eventManager.fire("launchPrevWork","' + node.id + '")'});
			mainDiv.appendChild(createSpace());
			mainDiv.appendChild(prevWorkButt);
		};
	};

	for(var a=0;a<node.children.length;a++){
		this.generateNodeElement(node.children[a], node, el, depth + 1, a);
	};
};

/**
 * Changes the title of the node with the given id (@param id) in
 * the project with the value of the html element. Enforces size
 * restrictions for title length.
 */
View.prototype.nodeTitleChanged = function(id){
	var node = this.project.getNodeById(id);
	var val = document.getElementById('titleInput_' + id).value;

	if(val.length>60 && node.type!='sequence'){
		this.notificationManager.notify('Step titles cannot exceed 60 characters.', 3);
		document.getElementById('titleInput_' + id).value = val.substring(0, 60);
	} else if(val.length>28 && node.type=='sequence'){
		this.notificationManager.notify('Activity titles cannot exceed 50 characters.', 3);
		document.getElementById('titleInput_' + id).value = val.substring(0, 50);
	} else {
		this.projectSaved = false;
		node.title = val;
	};
};

/**
 * Updates the changed project title in the current project
 */
View.prototype.projectTitleChanged = function(){
	this.projectSaved = false;
	this.project.setTitle(document.getElementById('projectTitleInput').value);
};

/**
 * Saves any changes in the project by having the project
 * regenerate the project file, incorporating any changes
 */
View.prototype.saveProject = function(){
	if(this.project){
		var data = yui.JSON.stringify(this.getProject().projectJSON(),null,3);
		
		var success_callback = function(text, xml, o){
			if(text!='success'){
				o.notificationManager.notify('Unable to save project to WISE server. The server or your Internet connection may be down. An alert will pop up with the project file data, copy this and paste it into a document for backup.', 3);
				o.notificationManager.notify(data, 3);
			} else {
				o.projectSaved = true;
				o.notificationManager.notify('PROJECT SAVED TO WISE SERVER', 3);
			};
		};
		
		var failure_callback = function(o, obj){
			obj.notificationManager.notify('Unable to save project to WISE server. The server or your Internet connection may be down. An alert will pop up with the project file data, copy this and paste it into a document for backup.', 3);
			obj.notificationManager.notify(data, 3);
		};
		
		this.connectionManager.request('POST', 1, 'filemanager.html', {command: 'updateFile', param1: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()), param2: this.project.getProjectFilename(), param3: encodeURIComponent(data)}, success_callback, this, failure_callback);
	} else {
		this.notificationManager.notify('Please open or create a Project before attempting to save.', 3);
	};
};

/**
 * Updates the class of the node with the given id to that selected by the user
 */
View.prototype.nodeIconUpdated = function(id){
	this.projectSaved = false;
	var node = this.project.getNodeById(id);
	var select = document.getElementById('nodeIcon_' + id);
	
	node.className = select.options[select.selectedIndex].value;
	this.generateAuthoring();
};

/**
 * Updates the project's stepTerm value
 */
View.prototype.stepTermChanged = function(){
	this.projectSaved = false;
	
	if(this.project){
		this.project.setStepTerm(document.getElementById('stepTerm').value);
		this.generateAuthoring();
	};
};

/**
 * updates auto step labeling and project when autoStep option is changed
 */
View.prototype.autoStepChanged = function(){
	this.projectSaved = false;

	if(this.project){
		this.project.setAutoStep(document.getElementById('autoStepCheck1').checked);
		this.generateAuthoring();
	};
};

/**
 * updates step labeling boolean for step level numbering (1.1.2, 1.3.1 etc.)
 * when option is changed
 */
View.prototype.stepLevelChanged = function(){
	this.projectSaved = false;
	
	if(this.project){
		this.project.setStepLevelNumbering(document.getElementById('stepLevel').checked);
	};
};

/**
 * Sets appropriate variables and launches the previous work popup
 */
View.prototype.launchPrevWork = function(nodeId){
	showElement('previousWorkDialog');
	this.activeNode = this.project.getNodeById(nodeId);
	document.getElementById('nodeTitle').innerHTML = this.activeNode.title;
	
	this.clearCols();
	this.populateToCol();
	this.populateFromCol();
	this.previousWorkDialog.show();
};

/**
 * Sets form variable path for create project and shows create project dialog
 */
View.prototype.createNewProject = function(){
	if(this.portalUrl){
		document.getElementById('createNewProjectPath').value = this.portalCurriculumBaseDir;
		this.createMode = false;
	} else {
		document.getElementById('createNewProjectPath').value = this.primaryPath;
	};
	
	if(this.projectSaved || confirm('Your latest work has not been saved yet. If you proceed any changes you have made since your last Save will be lost. Do you wish to continue?')){
		showElement('createProjectDialog');
		this.createProjectDialog.show();
	};
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows create sequence dialog.
 */
View.prototype.createNewSequence = function(){
	if(this.project){
		if(this.projectSaved || confirm('Your latest work has not been saved yet. If you proceed any changes you have made since your last Save will be lost. Do you wish to continue?')){
			document.getElementById('sequenceProjectPath').value = this.utils.getContentPath(this.authoringBaseUrl, this.project.getUrl());
			document.getElementById('newSequenceId').value = this.getProject().generateUniqueId('seq');
			showElement('createSequenceDialog');
			this.createSequenceDialog.show();
		};
	} else {
		this.notificationManager.notify('Please open or create a Project before creating an Activity', 3);
	};
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows create node dialog.
 */
View.prototype.createNewNode = function(){
	if(this.project){
		if(this.projectSaved || confirm('Click SAVE PROJECT before proceeding.  If you proceed without saving, your changes since last Save will be lost. Do you wish to continue?')){
			showElement('createNodeDialog');
			document.getElementById('nodeProjectPath').value = this.utils.getContentPath(this.authoringBaseUrl,this.project.getUrl());
			this.createNodeDialog.show();
		};
	} else {
		this.notificationManager.notify('Please open or create a Project before adding a Step', 3);
	};
};

/**
 * Sets necessary form variables, confirms that project has been saved and
 * shows edit project dialog.
 */
View.prototype.editProjectFile = function(){
	if(this.getProject()){
		if(this.projectSaved || confirm('Your latest work has not been saved yet. If you proceed any changes you have made since your last Save will be lost. Do you wish to continue?')){			
			document.getElementById('projectText').value = yui.JSON.stringify(this.getProject().projectJSON(),null,3);
			document.getElementById('editProjectFileProjectName').value = this.utils.getContentPath(this.authoringBaseUrl,this.getProject().getContentBase());
			document.getElementById('editProjectFileFileName').value = this.getProject().getProjectFilename();
			showElement('editProjectFileDialog');
			this.editProjectFileDialog.show();
		};
	} else {
		this.notificationManager.notify('Please open or create a Project before editing the project data file.', 3);
	};
};

/**
 * Checks to ensure that a project path exists, validates size and
 * file extension, then shows asset uploader dialog
 */
View.prototype.uploadAsset = function(view){
	if(this.project){
		document.getElementById('assetPathInput').value = this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase());
		showElement('assetUploaderDialog');

		var callback = function(text, xml, o){
			if(text >= o.MAX_ASSET_SIZE){
				o.notificationManager.notify('Maximum space allocation exceeded! Maximum allowed is ' + o.utils.appropriateSizeText(o.MAX_ASSET_SIZE) + ', total on server is ' + o.utils.appropriateSizeText(text) + '.', 3);
			} else if(view){
				document.getElementById('sizeDiv').innerHTML = "Total file size is " + o.utils.appropriateSizeText(text) + " out of " + o.utils.appropriateSizeText(o.MAX_ASSET_SIZE) + " allocated space.";
			} else {
				o.assetUploaderDialog.show();
			};
		};

		this.connectionManager.request('POST', 1, 'assetmanager.html', {command: 'getSize', path: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase())}, callback, this);
	} else {
		this.notificationManager.notify("Please open or create a project that you wish to upload assets to.", 3);
	};
};

/**
 * Retrieves a list of any assets associated with the current project
 * from the server, populates a list of the assets in the assetEditorDialog
 * and displays the dialog.
 */
View.prototype.viewAssets = function(){
	if(this.project){
		showElement('assetEditorDialog');
		var populateOptions = function(names, view){
			if(names && names!=''){
				var parent = document.getElementById('assetSelect');
				var splitz = names.split('~');
				for(var d=0;d<splitz.length;d++){
					var opt = createElement(document, 'option', {name: 'assetOpt', id: 'asset_' + splitz[d]});
					opt.text = splitz[d];
					opt.value = splitz[d];
					parent.appendChild(opt);
				};
			};

			//call upload asset with 'true' to get total file size for assets
			view.uploadAsset(true);
			
			//show dialog
			view.assetEditorDialog.show();
		};
	
		//get assets from servlet
		this.connectionManager.request('POST', 1, 'assetmanager.html', {command: 'assetList', path: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase())}, function(txt,xml,obj){populateOptions(txt,obj);}, this);
	} else {
		this.notificationManager.notify("Please open or create a project that you wish to view assets for.", 3);
	};
};

/**
 * Launches the currently opened project in the vle.
 */
View.prototype.previewProject = function(){
	if(this.project){
		if(this.project.getStartNodeId() || confirm('Could not find a start node for the project. You can add sequences and/or nodes to remedy this. Do you still wish to preview the project (you will not see nodes?')){
			window.open('vle.html', 'PreviewWindow', "toolbar=no,width=1024,height=768,menubar=no");
		};
	} else {
		this.notificationManager.notify('Please open or create Project to preview.', 3);
	};
};

/**
 * The opened vle window is ready, start the loading of the project in the vle
 * by firing the startpreview event in the given eventManager with a custom object
 * of name:value pairs that match that of the config object in the vle @see config.js
 */
View.prototype.startPreview = function(em){
	var obj = {'getContentUrl':this.getProject().getUrl(),'getContentBaseUrl':this.getProject().getContentBase(),'updateAudio':this.updateAudioInVLE};
	em.fire('startVLEFromParams', obj);
	this.updateAudioInVLE = false;
};

/**
 * Archives the current project on the server and returns a zipfile of the project
 * to the user.
 */
View.prototype.exportProject = function(){
	if(this.project){
		if(this.projectSaved || confirm('The current Project has not been saved yet. If you proceed any changes you have made since your last Save will be lost. Do you wish to continue?')){
			document.getElementById('exportProjectPath').value = this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase());
			document.getElementById('exportProjectName').value = this.project.getProjectFilename();
			document.getElementById('archivePath').value = this.primaryPath;
			document.getElementById('exportProject').submit();
		};
	} else {
		this.notificationManager.notify('Please open a Project before trying to export data', 3);
	};
};

/**
 * Imports the zip file specified by user to the WISE server and extracts it in their project dir
 */
View.prototype.importProject = function(){
	if(this.projectSaved || confirm('The current Project has not been saved yet. If you proceed any changes you have made since your last Save will be lost. Do you wish to continue?')){
		showElement('importProjectDialog');
		document.getElementById('importProjectPath').value = this.primaryPath;
		this.importProjectDialog.show();
	};
};

/**
 * publishes the currently-opened project to the server
 */
View.prototype.publishProject = function() {
	if(this.project){
		if(this.projectSaved || confirm('Your latest work has not been saved yet. If you proceed any changes you have made since your last Save will not be published. Do you wish to continue?')){
			showElement('publishProjectDialog');
			document.getElementById('publishProjectFrame').src='/webapp/author/publishproject.html?projectname=' + this.project.getProjectFilename() +'&projectpath=' + this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase());
			this.publishProjectDialog.show();
		};
	} else {
		this.notificationManager.notify('Please open or create a Project before publishing.', 3);
	};

};

/**
 * Retrieves the project name and sets global path and name, then
 * loads the project into the authoring tool.
 */
View.prototype.projectOptionSelected = function(){
	var path = document.getElementById('selectProject').options[document.getElementById('selectProject').selectedIndex].value;

	//if this is a portal project, set portalProjectId variable so the authoring tool knows
	if(this.portalUrl){
		var ndx = this.portalProjectPaths.indexOf(path);
		if(ndx!=-1){
			this.portalProjectId = this.portalProjectIds[ndx];
		} else {
			this.portalProjectId = undefined;
			this.notificationManager.notify('Could not find corresponding portal project id when opening project!', 2);
		};
	};
	
	//if all is set, load project into authoring tool
	if(path!=null && path!=""){
		this.loadProject(this.authoringBaseUrl + path, this.utils.getContentBaseFromFullUrl(this.authoringBaseUrl + path), true);
		this.openProjectDialog.hide();
	};
};

/**
 * Retrieves an updated list of projects, either from the authoring tool
 * or the portal and shows the list in the open project dialog.
 */
View.prototype.openProject = function(){
	if(this.projectSaved || confirm('Your latest work has not been saved yet. If you proceed any changes you have made since your last Save will be lost. Do you wish to continue?')){
		if(!this.portalUrl){
			this.initializeOpenProjectDialog(true);
		} else {
			this.updatePortalProjects();
			this.openProjectDialog.show();
		};
	};
};


/**
 * Opens the copy project dialog, populates the select-able projects,
 * sets hidden form elements, and shows the dialog.
 */
View.prototype.copyProject = function(){
	showElement('copyProjectDialog');
	document.getElementById('copyProjectPath').value = this.primaryPath;
	
	var doSuccess = function(list, view){
		var parent = document.getElementById('copyProjectSelect');
		var sep;
		if(view.primaryPath.indexOf('/')!=-1){
			sep = '/';
		} else {
			sep = '\\';
		};
		
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		};
		
		var projects = list.split('|');
		for(var c=0;c<projects.length;c++){
			var opt = createElement(document, 'option', {name: 'copyProjectOption'});
			parent.appendChild(opt);
			opt.text = projects[c];
			opt.value = projects[c].substring(0, projects[c].lastIndexOf(sep));
		};
		
		view.copyProjectDialog.show();
	};
	
	this.connectionManager.request('GET', 1, 'filemanager.html', {command: 'projectList', 'projectPaths': this.projectPaths}, function(t,x,o){doSuccess(t,o);}, this);
};

/**
 * Retrieves a list of archives of the currently opened project, populates the selection
 * list and shows the retrieve archive dialog.
 */
View.prototype.retrieveArchive = function(){
	if(this.project){
		var callback = function(t, x, o){
			if(t==''){
				o.notificationManager.notify('No archives found for this project.', 3);
				return;
			};
			
			var files = t.split('~');
			
			//set up options
			//clear out old
			var parent = document.getElementById('selectArchive');
			while(parent.firstChild){
				parent.removeChild(parent.firstChild);
			};
			
			//set size
			if(files.length>1){
				parent.setAttribute('size', files.length);
			} else {
				parent.setAttribute('size', 1);
			};
			
			//create and append options and set option attributes
			for(var f=0;f<files.length;f++){
				var opt = createElement(document, 'option');
				parent.appendChild(opt);
				opt.text = files[f];
				opt.value = o.primaryPath + '/archives/' + files[f];
			};
			
			//show dialog
			showElement('retrieveArchiveDialog');
			o.retrieveArchiveDialog.show();
		};
		
		this.connectionManager.request('POST', 1, 'filemanager.html', {command: 'getBackupList', param1:this.utils.getContentPath(this.authoringBaseUrl,this.project.getUrl()), param2: this.primaryPath + '/archives'}, callback, this);
	} else {
		this.notificationManager.notify('Please open a Project before trying to retrieve an archive.', 3);
	};
};

/**
 * Gets the selected option's path and retrieves the archive.
 */
View.prototype.downloadArchive = function(){
	var select = document.getElementById('selectArchive');
	var path = select.options[select.selectedIndex].value;
	
	document.getElementById('downloadArchiveParam1').value = path;
	document.getElementById('downloadArchiveForm').submit();
	this.retrieveArchiveDialog.hide();
};

/**
 * Switches the project mode between Simple and Advanced and refreshes
 * the project.
 */
View.prototype.toggleProjectMode = function(){
	this.projectStructureViolation = false;
	
	//toggle modes and set associated text
	if(this.simpleProject){
		this.simpleProject = false;
		document.getElementById('projectModeDiv').innerHTML = "MODE: Advanced Project <input type='button' value='Toggle Project Mode' onclick='eventManager.fire(\"toggleProjectMode\")'/>";
	} else {
		this.simpleProject = true;
		document.getElementById('projectModeDiv').innerHTML = "MODE: Simple Project <input type='button' value='Toggle Project Mode' onclick='eventManager.fire(\"toggleProjectMode\")'/>";
	};
	
	//regenerate authoring if a project is open
	if(this.project){
		this.generateAuthoring();
	};
};

/**
 * Sets initial values and shows the edit project metadata dialog
 */
View.prototype.editProjectMetadata = function(){
	if(this.project){
		showElement('editProjectMetadataDialog');
		document.getElementById('projectMetadataTitle').value = this.projectMeta.title;
		document.getElementById('projectMetadataAuthor').value = this.projectMeta.author;
		document.getElementById('projectMetadataSubject').value = this.projectMeta.subject;
		document.getElementById('projectMetadataSummary').value = this.projectMeta.summary;
		document.getElementById('projectMetadataGradeRange').value = this.projectMeta.graderange;
		document.getElementById('projectMetadataTotalTime').value = this.projectMeta.totaltime;
		document.getElementById('projectMetadataCompTime').value = this.projectMeta.comptime;
		document.getElementById('projectMetadataContact').value = this.projectMeta.contact;
		document.getElementById('projectMetadataTechReqs').value = this.projectMeta.techreqs;
		document.getElementById('projectMetadataLessonPlan').value = this.projectMeta.lessonplan;
		this.editProjectMetadataDialog.show();
	} else {
		this.notificationManager.notify('Open a project before using this tool.', 3);
	};
};

/**
 * Loads project from server, subscribes to projectLoadingComplete
 * event which runs the processOnLoad function after the necessary
 * project variables have been set. Takes in a custom object (@param o)
 * with the fields title (node title) and fun (a function that is passed
 * a node title).
 */
View.prototype.onProjectLoaded = function(){
	this.projectStructureViolation = false;
	if(this.selectModeEngaged){
		this.disengageSelectMode(-1);
	};
	
	if(this.project && this.project.useAutoStep()==true){
		document.getElementById('autoStepCheck1').checked = true;
	} else {
		document.getElementById('autoStepCheck1').checked = false;
	};
	
	if(this.project && this.project.useStepLevelNumbering()==true){
		document.getElementById('stepLevel').checked = true;
	} else {
		document.getElementById('stepLevel').checked = false;
	};
	
	if(this.project && this.project.getStepTerm()){
		document.getElementById('stepTerm').value = this.project.getStepTerm();
	} else {
		document.getElementById('stepTerm').value = '';
		this.project.setStepTerm('');
		this.notificationManager.notify('stepTerm not set in project, setting default value: \"\"', 2);
	};
	
	// if we're in portal mode, tell the portal that we've opened this project
	if (this.portalUrl) {
		this.notifyPortal(this.project.getContentBase(), this.project.getProjectFilename());
	}
	
	if(this.project.getTitle()){
		var title = this.project.getTitle();
	} else {
		var title = this.project.getProjectFilename().substring(0, this.project.getProjectFilename().lastIndexOf('.project.json'));
		this.project.setTitle(title);
	};

	document.getElementById('projectTitleInput').value = title;
	
	this.generateAuthoring();
	
	this.retrieveMetaData();
	
	var obj = createContent()
	obj.setContent({'getContentUrl':this.getProject().getUrl(),'getContentBaseUrl':this.getProject().getContentBase()});
	this.config = this.createConfig(obj);
	
	if(this.placeNode){
		this.placeNewNode(this.placeNodeId);
	};
};

/**
 * Notifies portal that this user is now authoring this project
 */
View.prototype.notifyPortal = function(projectPath, projectName) {
	var handler = function(responseText, responseXML, o){
		if (responseText != "") {
			o.notificationManager.notify(responseText + " is also editing this project right now. Please make sure not to overwrite each other's work.", 3);
			document.getElementById("concurrentAuthorDiv").innerHTML = "Also Editing: " + responseText;
		} else {
			document.getElementById("concurrentAuthorDiv").innerHTML = "";
		}
	};
	
	this.connectionManager.request('POST', 1, this.portalUrl, {command: 'notifyProjectOpen', path: this.project.getUrl()}, handler, this);
}

/*
 * This function is called when the user wants to 
 * author the specified node.
 */
View.prototype.author = function(nodeId) {
	var node = this.project.getNodeById(nodeId);
	if(this.AUTHORABLE_NODE_TYPES.indexOf(node.type)==-1){
		this.notificationManager.notify('No tool exists for authoring this step yet', 3);
		return;
	} else {
		this.activeNode = node;
		showElement('authorStepDialog');
		this.setInitialAuthorStepState();
		this.authorStepDialog.show();
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_main.js');
};
/**
 * Functions specific to the creation and initialization of dialogs
 * 
 * @author patrick lawler
 */

/**
 * Creates and renders the dialog to create and load a new 
 * project in the authoring tool and portal.
 */
View.prototype.initializeCreateProjectDialog = function(){
	var handleSubmit = function(){
		this.submit();
	};
	
	var handleCancel = function(){
		this.cancel();
	};
	
	this.createProjectDialog = new YAHOO.widget.Dialog('createProjectDialog', {width :"600px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Submit", handler:handleSubmit, isDefault:true}, {text:"Cancel", handler:handleCancel}]});
	this.createProjectDialog.callback.argument = this;
	this.createProjectDialog.callback.success = function(o){
		var path = o.responseText;
		var view = o.argument;
		
		view.loadProject(view.authoringBaseUrl + path, view.utils.getContentBaseFromFullUrl(view.authoringBaseUrl + path), false);
		if(view.portalUrl){
			view.createPortalProject(path, document.getElementById('projectInput').value);
		};
		document.getElementById('projectInput').value = "";
	};
	this.createProjectDialog.callback.failure = function(o){
		o.argument.notificationManager.notify('unable to create new project on server', 3);
	};
	
	this.createProjectDialog.validate = function(){
		var data = this.getData();
		if(data.param1==null || data.param1==""){
			notificationManager.notify('A project name must be supplied before creating a project', 3);
			return false;
		} else {
			return true;
		};
	};
	
	this.createProjectDialog.render();
};

/**
 * Creates and renders the dialog to create a new sequence.
 */
View.prototype.initializeCreateSequenceDialog = function(){
	var handleSubmit = function(){
		var view = arguments[1].callback.argument;
		var name = document.getElementById('createSequenceInput').value;
		var nodes = view.project.getSequenceNodes();
		
		if(name==null || name==""){
			view.notificationManager.notify('Please create a title for your new Activity', 3);
			return;
		};
	
		for(var s=0;s<nodes.length;s++){
			if(view.project.getNodeByTitle(name)){
				view.notificationManager.notify('An Activity with that title already exists. Try another title.', 3);
				return;
			};
		};
		
		this.submit();
	};
	
	var handleCancel = function(){
		this.cancel();
	};
	
	this.createSequenceDialog = new YAHOO.widget.Dialog('createSequenceDialog', {width :"650px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Submit", handler:handleSubmit, isDefault:true}, {text:"Cancel", handler:handleCancel}]});
	this.createSequenceDialog.callback.success = function(o){
		var view = o.argument;
		if(o.responseText){
			document.getElementById('createSequenceInput').value = "";
			view.placeNode = true;
			view.placeNodeId = o.responseText;
			view.loadProject(view.project.getContentBase() + view.utils.getSeparator(view.project.getContentBase()) + view.project.getProjectFilename(), view.project.getContentBase(), true);
			view.createSequenceDialog.hide();
		} else {
			view.notificationManager.notify('Unable to create new Activity on the WISE server.', 3);
		};
	};
	this.createSequenceDialog.callback.failure = function(o){
		o.argument.notificationManager.notify('unable to create new Activity on the WISE server', 3);
	};
	this.createSequenceDialog.callback.argument = this;
	
	this.createSequenceDialog.render();
};

/**
 * Creates and renders the dialog to create a new node
 */
View.prototype.initializeCreateNodeDialog = function (){
	var handleSubmit = function(){
		var view = arguments[1].callback.argument;
		val = document.getElementById('createNodeTitle').value;
		if(val==null || val==""){
			view.notificationManager.notify('Please enter a title for the Step.', 3);
			return;
		};
	
		var select = document.getElementById('createNodeType');
		val = select.options[select.selectedIndex].value;
		if(val==null || val==""){
			view.notificationManager.notify('Please select a Step type.', 3);
			return;
		};
		
		this.submit();
	};
	
	var handleCancel = function(){
		this.cancel();
	};
	
	this.createNodeDialog = new YAHOO.widget.Dialog('createNodeDialog', {width :"650px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Submit", handler:handleSubmit, isDefault:true}, {text:"Cancel", handler:handleCancel}]});
	this.createNodeDialog.callback.success = function(o){
		var response = o.responseText;
		var view = o.argument;
		if(response=='nodeNotProject'){
			view.notificationManager.notify('Unable to attach Step to project, please see administrator.', 3);
		} else {
			document.getElementById('createNodeType').selectedIndex = 0;
			document.getElementById('createNodeTitle').value = "";
			document.getElementById('selectNodeIconDiv').parentNode.removeChild(document.getElementById('selectNodeIconDiv'));
			view.placeNode = true;
			view.placeNodeId = response;
			view.loadProject(view.project.getContentBase() + view.utils.getSeparator(view.project.getContentBase()) + view.project.getProjectFilename(), view.project.getContentBase(), true);
			view.createNodeDialog.hide();
		};
	};
	this.createNodeDialog.callback.failure = function(o){
		o.argument.notificationManager.notify('unable to create Step on the WISE server', 3);
	};
	this.createNodeDialog.callback.argument = this;
	
	this.createNodeDialog.render();
};


/**
 * When a node type is selected, dynamically creates a select element
 * and option elements with icons and names for that specific nodeType.
 * The node's className is set as the value for param2 of the createNodeDialog.
 */
View.prototype.nodeTypeSelected = function(){
	var parent = document.getElementById('createNodeForm');
	var old = document.getElementById('selectNodeIconDiv');
	var val = document.getElementById('createNodeType').options[document.getElementById('createNodeType').selectedIndex].value;
	
	if(old){
		parent.removeChild(old);
	};
	
	if(val && val!=""){
		var index = nodeTypes.indexOf(val);
		var classes = nodeClasses[index];
		var text = nodeClassText[index];
		
		var selectDiv = createElement(document, 'div', {id: 'selectNodeIconDiv'});
		var selectText = document.createTextNode('Select an Icon:');
		var select = createElement(document, 'select', {id: 'selectNodeIcon', name: 'param2'});
		for(var h=0;h<classes.length;h++){
			var opt = createElement(document, 'option', {name: 'nodeClassOption'});
			opt.value = classes[h];
			opt.innerHTML = '<img src=\'' + iconUrl + classes[h] + '16.png\'/> ' + text[h];
			
			select.appendChild(opt);
		};
		
		selectDiv.appendChild(selectText);
		
		selectDiv.appendChild(select);
		parent.appendChild(selectDiv);
	};
};

/**
 * Creates and renders the dialog to edit the project file
 */
View.prototype.initializeEditProjectFileDialog = function(){
	var handleSubmit = function(){
		this.submit();
	};
	
	var handleCancel = function(){
		this.cancel();
	};
	
	var doSuccess = function(view){
		view.loadProject(view.project.getUrl(), view.project.getContentBase(), true);
		view.editProjectFileDialog.hide();
	};
	
	this.editProjectFileDialog = new YAHOO.widget.Dialog('editProjectFileDialog', {width :"900px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Submit", handler:handleSubmit, isDefault:true}, {text:"Cancel", handler:handleCancel}]});
	this.editProjectFileDialog.callback = {
		success: function(o){
			if(o.responseText!='success'){
				o.argument.notificationManager.notify('Unable to save project to WISE server', 3);
			} else {
				doSuccess(o.argument);
			};
		},
		failure: function(o){this.notificationManager.notify('Unable to save project to the WISE server', 3);},
		scope:this
	};
	this.editProjectFileDialog.callback.argument = this;
	
	this.editProjectFileDialog.render();
};

/**
 * Initializes and renders the asset uploader dialog.
 */
View.prototype.initializeAssetUploaderDialog = function(){
	var handleSubmit = function(){
		var view = arguments[1].callback.argument;
		if(!view.utils.fileFilter(view.allowedAssetExtensions,document.getElementById('uploadAssetFile').value)){
			view.notificationManager.notify('Specified file type is not allowed for uploading as an asset.', 3);
			return;
		};
		
		this.submit();
	};
	var handleCancel = function(){this.cancel();};

	this.assetUploaderDialog = new YAHOO.widget.Dialog('assetUploaderDialog', {width:'600px', fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:'Upload', handler:handleSubmit, isDefault:true}, {text:'Cancel', handler:handleCancel}]});
	this.assetUploaderDialog.callback.upload = function(o){
		o.argument.notificationManager.notify(o.responseText, 3);
		
		//clean up and hide
		document.getElementById('uploadAssetFile').value = '';
		o.argument.assetUploaderDialog.hide();
	};
	this.assetUploaderDialog.callback.failure = function(o){o.argument.notificationManager.notify('Asset upload communication failure', 3);};
	this.assetUploaderDialog.callback.argument = this;

	this.assetUploaderDialog.render();
};

/**
 * Initializes and renders asset editor dialog with clean up function.
 */
View.prototype.initializeAssetEditorDialog = function(){
	var handleDone = function(){
		var parent = document.getElementById('assetSelect');
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		};
		document.getElementById('sizeDiv').innerHTML = '';
		
		arguments[1].callback.argument.assetEditorDialog.hide();
	};

	var handleRemove = function(){
		var view = arguments[1].callback.argument;
		var parent = document.getElementById('assetSelect');
		var ndx = parent.selectedIndex;
		if(ndx!=-1){
			var opt = parent.options[parent.selectedIndex];
			var name = opt.value;

			var callback = function(text, xml, o){
				parent.removeChild(opt);
				o.notificationManager.notify(text, 3);
			};
			
			view.connectionManager.request('POST', 1, 'assetmanager.html', {command: 'remove', path: view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase()), asset: name}, callback, view);
		};
	};
	
	this.assetEditorDialog = new YAHOO.widget.Dialog('assetEditorDialog', {width:'400px', fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:'Remove Selected Asset', handler: handleRemove}, {text:'Done', handler:handleDone, isDefault:true}]});
	this.assetEditorDialog.callback.argument = this;
	
	this.assetEditorDialog.render();
};

/**
 * Initializes and renders import project dialog.
 */
View.prototype.initializeImportProjectDialog = function(){
	var handleSubmit = function(){
		this.submit();
	};
	
	var handleCancel = function(){
		this.cancel();
	};
	
	var doSuccess = function(val){
		if(val=='success'){
			this.notificationManager.notify('Your project has been successfully imported to and extracted on the WISE server in project directory.', 3);
		};
	};
	
	this.importProjectDialog = new YAHOO.widget.Dialog('importProjectDialog', {width :"450px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Import", handler:handleSubmit, isDefault:true}, {text:"Cancel", handler:handleCancel}]});
	this.importProjectDialog.callback = {
		upload: function(o){
			doSuccess(o.responseText);
		},
		failure: function(o){},
		scope: this
	};
	
	this.importProjectDialog.render();
};

/**
 * Initializes and renders publish project dialog.
 */
View.prototype.initializePublishProjectDialog = function(){
	var handleSubmit = function(){
		this.submit();
	};
	
	var handleCancel = function(){
		this.cancel();
	};
	
	this.publishProjectDialog = new YAHOO.widget.Dialog('publishProjectDialog', {width :"800px", height:"500px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Cancel", handler:handleCancel}]});
	this.publishProjectDialog.callback = {
		success: function(o){
			eventManager.fire('alert','successfully published to webapp server');
		},
		failure: function(o){
			eventManager.fire('alert','failure publishing to webapp server');
		},
		scope:this
	};
	
	this.publishProjectDialog.render();
};

/**
 * Initializes and renders copy project dialog
 */
View.prototype.initializeCopyProjectDialog = function (){
	var handleSubmit = function(){this.submit();};
	var handleCancel = function(){this.cancel();};
	
	this.copyProjectDialog = new YAHOO.widget.Dialog('copyProjectDialog', {width: '500px', fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:'Copy', handler:handleSubmit}, {text:'Cancel', handler:handleCancel}]});
	this.copyProjectDialog.callback = {
		success:function(o){
			o.argument.notificationManager.notify('Project copied to: ' + o.responseText, 3);
			o.argument.copyProjectDialog.hide();
		},
		failure:function(o){
			o.argument.notificationManager.notify('Failed copying project on server.', 3);	
		},
		scope:this
	};
	this.copyProjectDialog.callback.argument = this;
	
	this.copyProjectDialog.render();
};

/**
 * Initializes and renders the create todo dialog
 */
View.prototype.initializeCreateTODODialog = function(){
	var clearFields = function(){
		document.getElementById('todoUsername').value ='';
		document.getElementById('todoId').value = '';
		document.getElementById('todoText').value = '';
	};
	
	var handleCancel = function(){
		//clear form values
		clearFields();
		
		//hide dialog
		arguments[1].callback.argument.createTODODialog.hide();
	};
	
	var handleSave = function(){
		var view = arguments[1].callback.argument;
		
		//create todo obj and add to array
		view.todos.push({name: document.getElementById('todoUsername').value, id: document.getElementById('todoId').value, text: document.getElementById('todoText').value});
		
		var callback = function(text, xml, o){
			clearFields();
			o.updatePageMeta();
			o.createTODODialog.hide();
		};
		
		var failed = function(text, xml, o){
			o.notificationManager.notify('error creating/updating TODO list on server', 3);
		};
		
		//if todo list exists - update on server else - create on server
		if(view.hasTODO){//update file on server
			view.connectionManager.request('POST', 1, 'filemanager.html', {command: 'updateFile', param1: view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase()), param2: view.utils.getTODOFilename(view.project.getProjectFilename()), param3: yui.JSON.stringify(view.todos)}, callback, view, failed);
		} else {//create file on server
			view.connectionManager.request('POST', 1, 'filemanager.html', {command: 'createFile', param1: view.utils.getContentPath(view.authoringBaseUrl,view.project.getContentBase()) + '/' + view.utils.getTODOFilename(view.project.getProjectFilename()), param2: yui.JSON.stringify(view.todos)}, callback, view, failed);
		};
	};
	
	this.createTODODialog = new YAHOO.widget.Dialog('createTODODialog', {width: '750px', fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:'Save', handler:handleSave}, {text:'Cancel', handler:handleCancel}]});
	this.createTODODialog.callback.argument = this;
	
	this.createTODODialog.render();
};

/**
 * Initializes and renders the edit todo dialog
 */
View.prototype.initializeEditTODODialog = function(){ 
	var handleDone = function(){
		var view = arguments[1].callback.argument;
		
		view.editTODODialog.hide();
		view.updatePageMeta();
	};
	
	this.editTODODialog = new YAHOO.widget.Dialog('editTODODialog', {width: '705px', height: '300px', fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:'Done', handler:handleDone}]});
	this.editTODODialog.callback.argument = this;
	
	this.editTODODialog.render();
};

/**
 * Initializes and renders the retrieve archive dialog
 */
View.prototype.initializeRetrieveArchiveDialog = function(){
	this.retrieveArchiveDialog = new YAHOO.widget.Dialog('retrieveArchiveDialog', {width:'800px', fixedcenter:true, visible:false, constraintoviewport:true});
	this.retrieveArchiveDialog.render();
};

/**
 * Initialize and renders the edit project metadata dialog
 */
View.prototype.initializeEditProjectMetadataDialog = function(){
	this.editProjectMetadataDialog = new YAHOO.widget.Dialog('editProjectMetadataDialog', {width: '650px', fixedcenter:false, visible:false, constraintoviewport:true});
	this.editProjectMetadataDialog.render();
};

/**
 * Initializes and renders publish metadata dialog.
 */
View.prototype.initializePublishMetadataDialog = function(){
	var handleCancel = function(){
		this.cancel();
	};
	
	this.publishMetadataDialog = new YAHOO.widget.Dialog('publishMetadataDialog', {width :"700px", height:"300px", fixedcenter:true, visible:false, constraintoviewport:true, buttons:[{text:"Cancel", handler:handleCancel}]});
	this.publishMetadataDialog.render();
};

/**
 * Initializes and renders the previous work dialog.
 */
View.prototype.initializePreviousWorkDialog = function(){
	this.previousWorkDialog = new YAHOO.widget.Dialog('previousWorkDialog', {width: '800px', height: '500px', fixedcenter:true, visible:false, constraintoviewport:true});
	this.previousWorkDialog.render();
};

/**
 * Initializes and renders the author step dialog.
 */
View.prototype.initializeAuthorStepDialog = function(){
	this.authorStepDialog = new YAHOO.widget.Dialog('authorStepDialog', {width: '1200px', height: '600px', close:false, xy:[100, 0], fixedcenter:false, visible:false, constraintoviewport:false});
	this.authorStepDialog.render();
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_dialog.js');
};
/**
 * Functions specific to the creation of audio for steps
 */

/**
 * Starting with the given element, returns the first descendent element that
 * has the given id. Returns null if no descendents with that id are found.
 */
View.prototype.getElementById = function(element, id) {
	if (element.hasAttribute && element.hasAttribute("id") && element.getAttribute("id") == id) {
		return element;
	} else if (element.childNodes.length == 0) {
		return null;
	} else {
		var endResult = null;
		for (var i=0; i < element.childNodes.length; i++) {
			result = this.getElementById(element.childNodes[i], id);
			if (result != null) {
				return result;
			};
	     };
	     return null;
	};
};

/**
 * If a project is open, updates the audio for that project.
 */
View.prototype.updateAudio = function(){
	if(this.project){
		if(this.project.getStartNodeId() || confirm('Could not find a start node for the project. You can add sequences and/or nodes to remedy this. Do you still wish to preview the project (you will not see nodes?')){
			this.updateAudioInVLE = true;
			window.open('vle.html', 'PreviewWindow', "toolbar=no,width=1024,height=768,menubar=no");
		};
	} else {
		this.notificationManager.notify('Please open or create a Project to update audio.', 3);
	};
};

/**
 * Updates AudioFiles for the current project.
 */
View.prototype.updateAudioFiles = function(){console.warn('UPDATing AudIO');
	if(this.project){
		var createdCount = 0;
		var nodes = this.project.getLeafNodes();
		for(var b=0;b<nodes.length;b++){
			var node = nodes[b];
			for (var a=0; a<node.audios.length;a++) {
				this.notificationManager.notify('audio url:' + node.audios[a].url, 4);
				var elementId = node.audios[a].elementId;

				// only invoke updateAudioFiles if elementId exists and is ID'ed to 
				// actual element in the content.
				if (elementId && elementId != null) {

					var xmlDoc = node.content.getContentXML();
					if (xmlDoc.firstChild.nodeName == "parsererror") {
						this.notificationManager.notify('could not create audio.\nAudioFile: ' +node.audios[a].url+'\nReason: parse error parsing file: ' + node.filename, 2);
					} else {
						var foundElement = this.getElementById(xmlDoc, elementId);
						if (foundElement != null) {
							var textContent = foundElement.textContent;
							this.notificationManager.notify('creating audio file at url: ' + node.audios[a].url
														+ '\nelementId: ' + elementId + '\ncontent: ' + textContent, 4);
							
							var callback = {
								success: function(o){
									if (o.responseText == 'success') {
										createdCount++;
									} else {
										this.notificationManager.notify('could not create audio.  Check if you have read/write access to your desktop.  Check to confirm that an "Audio" sub-folder exists in the project folder', 3);
									};
								},
								failure: function(o){
									this.notificationManager.notify('could not create audio', 3);
								},
								scope: this
							};
							YAHOO.util.Connect.asyncRequest('POST', 'filemanager.html', callback, 'command=updateAudioFiles&param1=' + this.project.getContentBase() + '&param2=' + node.audios[a].url + '&param3=' + textContent);				
						}  // if (foundElement != null) {
					}  // } else {
				}
			}
		}
			this.notificationManager.notify('number of audio files created: ' + createdCount, 4);	
	} else {
		this.notificationManager.notify('Please open or create a Project before attempting to save.', 3);
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_audio.js');
};
/**
 * Functions specific to the creation, retrieving and updating of metadata
 * 
 * @author patrick lawler
 */

/**
 * Retrieves and parses the page metadata file and project metadata file if they exist
 */
View.prototype.retrieveMetaData = function(){
	//make async requests
	this.connectionManager.request('GET', 1, this.project.getContentBase() + this.utils.getSeparator(this.project.getContentBase()) + this.utils.getTODOFilename(this.project.getProjectFilename()), null, this.pageMetaSuccess, this, this.pageMetaFailure);
	this.connectionManager.request('GET', 1, this.project.getContentBase() + this.utils.getSeparator(this.project.getContentBase()) + this.utils.getProjectMetaFilename(this.project.getProjectFilename()), null, this.projectMetaSuccess, this, this.projectMetaFailure);
};

/**
 * Success callback for page metadata retrieval
 */
View.prototype.pageMetaSuccess = function(txt,xml,o){
	try{
		//convert data to object
		o.todos = yui.JSON.parse(txt);
	} catch(e) {
		o.notificationManager.notify('Error when parsing metadata, aborting.', 2);
		return;
	};
	//set var
	o.hasTODO = true;
	//update the pages meta information
	o.updatePageMeta(true);
};

/**
 * Failure callback for page metadata retrieval
 */
View.prototype.pageMetaFailure = function(c,o){
	//set variables
	o.todos = [];
	o.hasTODO = false;
};

/**
 * Success callback for project metadata retrieval
 */
View.prototype.projectMetaSuccess = function(text,xml,o){
	try{
		o.projectMeta = yui.JSON.parse(text);
		o.populateMaxScores();
	} catch(e) {
		o.hasProjectMeta = false;
		o.projectMeta = {title: '', subject: '', summary: '', author: '', graderange: '', totaltime: '', comptime: '', contact: '', techreqs: '', lessonplan: ''};
		o.notificationManager.notify('Error parsing project metadata, aborting.', 2);
		return;
	};

	o.hasProjectMeta = true;
};

/**
 * Failure callback for project metadata retrieval
 */
View.prototype.projectMetaFailure = function(c,o){
	o.hasProjectMeta = false;
	o.projectMeta = {title: '', subject: '', summary: '', author: '', graderange: '', totaltime: '', comptime: '', contact: '', techreqs: '', lessonplan: ''};
};

/**
 * Updates the divs for any task's associated node ids with html.
 */
View.prototype.updatePageMeta = function(justRetrieved){
	//clear old html
	this.clearPageMeta();
	
	//process individual todo tasks
	for(var a=0;a<this.todos.length;a++){
		var ids = this.parseTaskField(this.todos[a].id);
		var names = this.parseTaskField(this.todos[a].name);
		
		if(ids.length>0){//has at least one id
			var preText = 'Task';
			if(names.length>0){//has at least one name too
				preText += ' for ';
				for(c=0;c<names.length;c++){//add each name to text
					preText += names[c];
					if(c!=names.length-1){
						preText += ', ';
					};
					
					//add text to nameHtml for each name
					this.addToTasks('users', names[c], 'Task for ' + ids.toString() + ': ' + this.todos[a].text);
				};
			};
			
			//add text to nodeHTML for each id
			for(var b=0;b<ids.length;b++){//add html to each node id
				this.addToTasks('nodes', ids[b], preText + ': ' + this.todos[a].text + ' <input type="button" value="remove" onclick="eventManager.fire(\'removeTask\',\'' + a + '\')"/>');
				document.getElementById('taskDiv_' + ids[b]).innerHTML = '<a onMouseOver="eventManager.fire(\'showTaskBox\',\'' + ids[b] + '\')" onMouseOut="eventManager.fire(\'delayHideTaskBox\',\'' + ids[b] + '\')">T</a>';
			};
		} else if(names.length>0){//does not have id but has name
			for(var d=0;d<names.length;d++){
				this.addToTasks('users', names[d], 'Task: ' + this.todos[a].text);
			};
		} else {//task not associated with user or node
			if(this.taskHTML['project']){
				this.taskHTML['project'] += '<br/>Task: ' + this.todos[a].text;
			} else {
				this.taskHTML['project'] = 'Task: ' + this.todos[a].text;
			};
		};
	};
	
	//if any project tasks, make link visible
	if(this.taskHTML['project']){
		showElement('projectTasks');
	};
	
	//if any user tasks, make link visible
	if(objSize(this.taskHTML.users)>0){
		showElement('userTasks');
	};
	
	//if justRetrieved, check user and popup tasks
	if(justRetrieved){
		//TODO - check user logged in and popup their tasks
	};
};

/**
 * Given an associated id, delays the hiding of a task box
 */
View.prototype.delayHideTaskBox = function(id){
	this.timeoutVars[id] = setTimeout('eventManager.fire("hideTaskBox")', 750);
};

/**
 * Given an associated id, prevents the task box from closing
 */
View.prototype.stopHiding = function(id){
	clearTimeout(this.timeoutVars[id]);
};

/**
 * Helper function: given a key and a value, checks to see if that key exists.
 * If the key exists, appends the value to current value of key, else, sets 
 * value as value to key.
 */
View.prototype.addToTasks = function(loc, key, val){
	var loc = this.taskHTML[loc];
	if(loc[key]){
		loc[key] += '<br/>' + val;
	} else {
		loc[key] = val;
	};
};

/**
 * Clears the innerHTML of all elements that have class of 'taskDiv'
 */
View.prototype.clearPageMeta = function(){
	yui.all('.taskDiv').set('innerHTML','');
	this.taskHTML = {project: undefined, users: {}, nodes: {}};
	hideElement('userTasks');
	hideElement('projectTasks');
};

/**
 * Parses the given comma-delimited string (@param val) of
 * values into an array of values and returns that array.
 */
View.prototype.parseTaskField = function(val){
	var items = [];
	if(val && val!=''){
		//remove spaces from string
		val = val.replace(/ /g, '');
		
		//parse string
		items = val.split(',');
	};
	
	return items;
};

/**
 * Shows the task box and sets the html to that associated with the given id
 */
View.prototype.showTaskBox = function(id){
	if(id=='users'){
		var el = document.getElementById('userTasks');
		var html = '';
		for(var user in this.taskHTML.users){
			if(html==''){
				html = '<b>Task for ' + user + '</b><br/>' + this.taskHTML.users[user];
			} else {
				html += '<br/><br/><b>Task for ' + user + '</b><br/>' + this.taskHTML.users[user];
			};
		};
	} else if(id=='project'){
		var el = document.getElementById('projectTasks');
		var html = this.taskHTML.project;
	} else {//must be node id
		var el = document.getElementById('taskDiv_' + id);
		var html = '<div id="floatingDiv" onmouseover="eventManager.fire(\'stopHiding\',\'' + id + '\')" onmouseout="eventManager.fire(\'delayHideTaskBox\',\'' + id + '\')">' + this.taskHTML.nodes[id] + '</div>';
	};
	
	var box = document.getElementById('taskBox');
	var pos = findPos(el);
	
	box.innerHTML = html;
	box.style.display = 'block';
	box.style.position = 'absolute';
	box.style.top = pos.top + el.offsetHeight;
	box.style.left = pos.left;
};

/**
 * Hides the task box by clearing the html and setting the display to none
 */
View.prototype.hideTaskBox = function(){
	var box = document.getElementById('taskBox');
	box.innerHTML = '';
	box.style.display = 'none';
};

/**
 * Enables and shows the createTODODialog after verifying a project is open.
 */
View.prototype.createTODOTask = function(id){
	if(this.project){
		showElement('createTODODialog');
		
		//if id is supplied, prepopulate id field
		if(id){
			document.getElementById('todoId').value = id;
		};
		
		this.createTODODialog.show();
	} else {
		this.notificationManager.notify('You must open a project before creating a TODO task.', 3);
	};
};

/**
 * Populates, enables and shows the editTODODialog after verifying a project is open
 */
View.prototype.editTODOTasks = function(){
	if(this.project){
		showElement('editTODODialog');
		this.populateTODOList();
		this.editTODODialog.show();
	} else {
		this.notificationManager.notify('You must open a project before editing the TODO Task list.', 3);
	};
};

/**
 * For each task in the todo list, creates the elements needed to change the users, nodeIds or task
 * description as well as removing tasks from the list.
 */
View.prototype.populateTODOList = function(){
	var parent = document.getElementById('TODOTaskListDiv');
	
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	for(var e=0;e<this.todos.length;e++){
		var tDiv = createElement(document, 'div', {id: 'editTask_' + e});
		var tTitle = document.createTextNode('Task Entry:');
		var tUser = createElement(document, 'input', {id: 'editTaskUserInput_' + e, onchange: 'eventManager.fire("editTaskFieldModified","' + e + '")', value: this.todos[e].name});
		var tIds = createElement(document, 'input', {id: 'editTaskIdInput_' + e, onchange: 'eventManager.fire("editTaskFieldModified","' + e + '")', value: this.todos[e].id});
		var tText = createElement(document, 'input', {id: 'editTaskTextInput_' + e, size: '80', onchange: 'eventManager.fire("editTaskFieldModified","' + e + '")', value: this.todos[e].text});
		var tUserText = document.createTextNode('Username(s): ');
		var tIdsText = document.createTextNode('Node id(s): ');
		var tTextText = document.createTextNode('Task text: ');
		var saveButt = createElement(document, 'input', {type: 'button', id: 'editTaskSaveButt_' + e, 'class': 'taskButt', value: 'save', onclick: 'eventManager.fire("saveTaskChange","' + e + '")'});
		var undoButt = createElement(document, 'input', {type: 'button', id: 'editTaskUndoButt_' + e, 'class': 'taskButt', value: 'undo', onclick: 'eventManager.fire("undoTaskChange","' + e + '")'});
		var removeButt = createElement(document, 'input', {type: 'button', id: 'editTaskRemoveButt_' + e, 'class': 'taskButt', value: 'remove', onclick: 'eventManager.fire("removeTask","' + e + '")'});
		
		parent.appendChild(createBreak());
		parent.appendChild(tDiv);
		tDiv.appendChild(tTitle);
		tDiv.appendChild(createBreak());
		tDiv.appendChild(createBreak());
		tDiv.appendChild(tUserText);
		tDiv.appendChild(tUser);
		tDiv.appendChild(createBreak());
		tDiv.appendChild(tIdsText);
		tDiv.appendChild(tIds);
		tDiv.appendChild(createBreak());
		tDiv.appendChild(tTextText);
		tDiv.appendChild(tText);
		tDiv.appendChild(createBreak());
		tDiv.appendChild(createBreak());
		tDiv.appendChild(saveButt);
		tDiv.appendChild(undoButt);
		tDiv.appendChild(removeButt);
	};
};

/**
 * Given the ndx, adds the notify text class to the associated html buttons for that index.
 */
View.prototype.editTaskFieldModified = function(ndx){
	yui.get(document.getElementById('editTaskSaveButt_' + ndx)).addClass('notifyFont');
	yui.get(document.getElementById('editTaskUndoButt_' + ndx)).addClass('notifyFont');
};

/**
 * Given the ndx, undoes any changes made to the input fields associated with the index.
 */
View.prototype.undoTaskChange = function(ndx){
	yui.get(document.getElementById('editTaskSaveButt_' + ndx)).removeClass('notifyFont');
	yui.get(document.getElementById('editTaskUndoButt_' + ndx)).removeClass('notifyFont');
	
	document.getElementById('editTaskUserInput_' + ndx).value = this.todos[ndx].name;
	document.getElementById('editTaskIdInput_' + ndx).value = this.todos[ndx].id;
	document.getElementById('editTaskTextInput_' + ndx).value = this.todos[ndx].text;
};

/**
 * Given the ndx, saves any changes made to the input fields associated with the index.
 */
View.prototype.saveTaskChange = function(ndx){
	this.todos[ndx].name = document.getElementById('editTaskUserInput_' + ndx).value;
	this.todos[ndx].id = document.getElementById('editTaskIdInput_' + ndx).value;
	this.todos[ndx].text = document.getElementById('editTaskTextInput_' + ndx).value;
	
	this.updateTODOOnServer();
	
	yui.get(document.getElementById('editTaskSaveButt_' + ndx)).removeClass('notifyFont');
	yui.get(document.getElementById('editTaskUndoButt_' + ndx)).removeClass('notifyFont');
};

/**
 * Given the ndx, removes the task from the list and updates the list on the server.
 */
View.prototype.removeTask = function(ndx){
	//remove from list
	this.todos.splice(ndx, 1);
	
	//repopulate list to update indexes (now have changed because it was removed)
	this.populateTODOList();
	
	//update server
	this.updateTODOOnServer();
};

/**
 * Either updates or creates the current todo list (var todos) on server
 */
View.prototype.updateTODOOnServer = function(){
	var callback = function(text, xml, o){
		o.updatePageMeta();
	};
	
	var failed = function(text, xml, o){
		o.notificationManager.notify('error creating/updating TODO list on server', 3);
	};
	
	//if todo list exists - update on server
	if(this.hasTODO){//update file on server
		this.connectionManager.request('POST', 1, 'filemanager.html', {command: 'updateFile', param1: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()), param2: this.utils.getTODOFilename(this.project.getProjectFilename()), param3: yui.JSON.stringify(this.todos)}, callback, this, failed);
	} else {//create file on server
		this.connectionManager.request('POST', 1, 'filemanager.html', {command: 'createFile', param1: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()) + '/' + this.utils.getTODOFilename(this.project.getProjectFilename()), param2: yui.JSON.stringify(this.todos)}, callback, this, failed);
	};
};


/**
 * Either updates or creates the current project meta on the server
 */
View.prototype.updateProjectMetaOnServer = function(publish){
	var callback = function(text, xml, o){
		o.hasProjectMeta = true;
		o.editProjectMetadataDialog.hide();
		if(publish){
			showElement('publishMetadataDialog');
			document.getElementById('publishMetadataFrame').src='/webapp/author/publishprojectmetadata.html?projectId=' + o.portalProjectId + '&metadata=' + yui.JSON.stringify(o.projectMeta);
			o.publishMetadataDialog.show();
		} else {
			o.notificationManager.notify('Project metadata saved to project directory.', 3);
		};
	};
	
	var failed = function(text, xml, o){
		o.notificationManager.notify('Error saving project metadata in directory.', 3);
	};
	
	//if project meta file exists - update on server
	if(this.hasProjectMeta){//update file on server
		this.connectionManager.request('POST', 1, 'filemanager.html', {command: 'updateFile', param1: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()), param2: this.utils.getProjectMetaFilename(this.project.getProjectFilename()), param3: yui.JSON.stringify(this.projectMeta)}, callback, this, failed);
	} else {//create file on server
		this.connectionManager.request('POST', 1, 'filemanager.html', {command: 'createFile', param1: this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()) + '/' + this.utils.getProjectMetaFilename(this.project.getProjectFilename()), param2: yui.JSON.stringify(this.projectMeta)}, callback, this, failed);
	};
};

/**
 * Updates the values of the projectMeta's fields and calls the server update function
 */
View.prototype.updateProjectMetadata = function(publish){
	this.projectMeta.title = document.getElementById('projectMetadataTitle').value;
	this.projectMeta.author = document.getElementById('projectMetadataAuthor').value;
	this.projectMeta.subject = document.getElementById('projectMetadataSubject').value;
	this.projectMeta.summary = document.getElementById('projectMetadataSummary').value;
	this.projectMeta.graderange = document.getElementById('projectMetadataGradeRange').value;
	this.projectMeta.totaltime = document.getElementById('projectMetadataTotalTime').value;
	this.projectMeta.comptime = document.getElementById('projectMetadataCompTime').value;
	this.projectMeta.contact = document.getElementById('projectMetadataContact').value;
	this.projectMeta.techreqs = document.getElementById('projectMetadataTechReqs').value;
	this.projectMeta.lessonplan = document.getElementById('projectMetadataLessonPlan').value;
	
	this.updateProjectMetaOnServer(publish);
};

/**
 * Resets the editProjectMetadataDialog's fields with original values
 */
View.prototype.undoProjectMetadata = function(){
	this.editProjectMetadata();
};

/**
 * Publishes the project metadata to the webapp to go with the project.
 */
View.prototype.publishProjectMetadata = function(){
	if(this.portalProjectId){
		this.updateProjectMetadata(true);
	} else {
		this.notificationManager.notify('Could not determine Portal Project ID, only projects opened through the portal can be published to the portal.', 3);
	};
};

/**
 * Given a node id, updates or creates the max score for that node in this
 * projects meta information and saves to the file.
 */
View.prototype.maxScoreUpdated = function(id){
	if(document.getElementById('maxScore_' + id)){
		var val = document.getElementById('maxScore_' + id).value;
		
		if(!val || (!isNaN(val) && val>=0)){
			this.updateMaxScoreValue(id, val);
			this.updateProjectMetaOnServer(false);
		} else {
			this.notificationManager.notify('The max score value is either not a number, is less than 0, or could not be determined, aborting update.', 3);
			this.populateMaxScores();
			return;
		};
	} else {
		this.notificationManager.notify('Could not find max score element for node, aborting update.', 3);
	};
};

/**
 * Updates the value of the max score for to the given value for the given
 * node id. If a value does not previously exist, creates one.
 */
View.prototype.updateMaxScoreValue = function(id, val){
	var found = false;
	var scores = this.projectMeta.maxScores;
	if(!scores){
		this.projectMeta.maxScores = [];
		scores = this.projectMeta.maxScores;
	};
	
	for(var j=0;j<scores.length;j++){
		if(scores[j].nodeId==id){
			found = true;
			scores[j].maxScoreValue = val;
		};
	};
	
	if(!found){
		this.projectMeta.maxScores.push({nodeId:id,maxScoreValue:val});
	};
};

/**
 * Populates the values of the max scores for any nodes that are specified
 * in the project meta.
 */
View.prototype.populateMaxScores = function(){
	if(this.projectMeta.maxScores){
		var scores = this.projectMeta.maxScores;
		for(var i=0;i<scores.length;i++){
			var input = document.getElementById('maxScore_' + scores[i].nodeId);
			if(input){
				input.value = scores[i].maxScoreValue;
			};
		};
	};
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_meta.js');
};
/**
 * Functions specific to the selection process in the project layout for the authoring view
 * 
 * @author patrick lawler
 */

/**
 * Toggles whether the element with the given id is selected or not
 */
View.prototype.selectClick = function(id){
	if(this.selectModeEngaged){
		if(this.disambiguateMode){
			return;
		} else {
			this.processSelected(id);
		};
	} else if(id!='uSeq' && id!='uNode' && id.split('|')[1]!=this.project.getRootNode().id) {
		var node = yui.get(document.getElementById(id));
		
		if(this.keystrokeManager.isShiftkeydown()){//toggle selected for node
			if(node.hasClass('selected')){
				node.removeClass('selected');
			} else {
				node.addClass('selected');
			};
		} else {//clear previous and select only node
			this.clearAllSelected();
			node.addClass('selected');
		};
	};
};

/**
 * Selects all selectable project elements
 */
View.prototype.clearAllSelected = function(){
	yui.all('.projectNode').removeClass('selected');	
};

/**
 * De-selects all selectable project elements
 */
View.prototype.selectAll = function(){
	if(!this.selectModeEngaged){
		yui.all('.projectNode').addClass('selected');
	};
};

/**
 * Returns a custom object of yui nodes represented by the elements on this page
 * that are currently 'selected'.
 * 
 * obj.master = node (master sequence)	- null if master seq is not selected
 * obj.seqs = [seq 1, seq 2...]			- empty yui list if no seqs are selected
 * obj.nodes = [node 1, node 2...]		- empty yui list if no nodes are selected
 */
View.prototype.getSelected = function(){
	var o = {master: null, seqs: [], nodes: []};
	o.master = yui.get('.selected.master');
	o.seqs = yui.all('.selected.seq');
	o.nodes = yui.all('.selected.node');
	o.ordered = yui.all('.projectNode.selected');
	return o;
};

/**
 * Removes the selected nodes and sequences from the project and refreshes authoring.
 */
View.prototype.deleteSelected = function(){
	var selected = this.getSelected();
	var view = this;
	
	if(selected.seqs.size()<1 && selected.nodes.size()<1){//if none are selected, notify user
		this.notificationManager.notify('Select one or more items before activating this tool.', 3);
	} else if(confirm("Are you sure you want to delete the selected item(s)?")){
		this.projectSaved = false;
		
		if(selected.master){
			this.notificationManager.notify('Deleting the master activity for a project is currently not allowed.');
		};
		
		//remove selected seqs - any attached nodes will remain as leaf nodes in project
		selected.seqs.each(function(node, k){
			var id = node.get('id').split('|')[1];
			view.project.removeNodeById(id);
		});
		
		//remove selected nodes
		selected.nodes.each(function(node, k){
			var id = node.get('id').split('|')[1];
			view.utils.removeNodeFileFromServer(view,id);
			view.project.removeNodeById(id);
		});
		
		//refresh
		this.generateAuthoring();
	};
};

/**
 * Duplicates the selected sequences and nodes and refreshes project.
 */
View.prototype.duplicateSelected = function(){
	var selected = this.getSelected();

	if(selected.seqs.size()==0 && selected.nodes.size()==0 && !selected.master){
		this.notificationManager.notify('Select one or more items before activating this tool.', 3);
		return;
	};
	
	if(confirm('Are you sure you want to duplicate the selected item(s)')){
		var nodeIds = [];

		if(selected.master){
			nodeIds.push(selected.master.get('id').split('|')[1]);
		};
		
		selected.seqs.each(function(node, k){
			nodeIds.push(node.get('id').split('|')[1]);
		});
		
		selected.nodes.each(function(node, k){
			nodeIds.push(node.get('id').split('|')[1]);
		});

		var allCopied = function(type,args,obj){
			var msg;
			
			if(args[1]){
				msg = args[1] + ' COPYING COMPLETE, refreshing project.';
			} else {
				msg = 'COPYING COMPLETE, refreshing project';
			};
			
			obj.notificationManager.notify(msg, 3);
			obj.loadProject(obj.project.getUrl(), obj.project.getContentBase(), true);
		};
		
		var eventName = this.project.generateUniqueCopyEventName();
		this.eventManager.addEvent(eventName);
		this.eventManager.subscribe(eventName, allCopied, this);

		this.project.copyNodes(nodeIds, eventName);
	};
};

/**
 * Verifies and moves the selected elements to a location that the user specifies
 */
View.prototype.moveSelected = function(){
	var selected = this.getSelected();
	var view = this;
	
	//if nothing is selected, notify user and return
	if(selected.seqs.size()==0 && selected.nodes.size()==0 && !selected.master){
		this.notificationManager.notify('Select one or more items before activating this tool.', 3);
		return;
	};
	
	//if master seq is selected ignore and notify user
	if(selected.master){
		this.notificationManager.notify('The master sequence cannot be moved.', 3);
		if(selected.seqs.size()==0 && selected.nodes.size()==0){//return because nothing else to do
			return;
		} else {
			selected.master.removeClass('selected');
			selected.master = null;
		};
	};
	
	//remove the selected elements from html
	selected.seqs.each(function(node, k){
		view.removeChildrenHTML(view,node);
		node.get('parentNode').get('parentNode').get('parentNode').removeChild(node.get('parentNode').get('parentNode'));
	});
	
	selected.nodes.each(function(node, k){
		node.get('parentNode').get('parentNode').get('parentNode').removeChild(node.get('parentNode').get('parentNode'));
	});
	
	//start the select mode
	this.engageSelectMode(this.moveCallback, 'Click an Activity or Step target.  The selected item(s) will be placed after this target.', [selected]);
};

/**
 * Given a yui node (@param node), removes all children html elements recursively
 */
View.prototype.removeChildrenHTML = function(view, node){
	//get DOM node
	var dNode = document.getElementById(node.get('id'));
	
	//get nodes sibling by going up wrapper then in the other 'tr'
	var sib = dNode.parentNode.parentNode.nextSibling;
	if(sib){
		sib = sib.childNodes[1].firstChild;
	};
	
	//do this for all valid siblings (sibling's first part of id == node's middle id)
	while(sib && sib.id.split('|')[0]==dNode.id.split('|')[1]){
		//if this node is a sequence, it might have children too that need to be removed
		if(view.project.getNodeById(sib.id.split('|')[1]).type=='sequence'){
			view.removeChildrenHTML(yui.get(sib));
		};
		
		//remove sibling from html
		sib.parentNode.parentNode.parentNode.removeChild(sib.parentNode.parentNode);
		
		//get next sibling
		sib = dNode.parentNode.parentNode.nextSibling;
		if(sib){
			sib = sib.childNodes[1].firstChild;
		};
	};
};

/**
 * Verifies and retrieves selected elements and additionally places them in a
 * location that the user specifies.
 */
View.prototype.useSelected = function(){
	var selected = this.getSelected();
	
	//if nothing is selected, notify user and return
	if(selected.seqs.size()==0 && selected.nodes.size()==0 && !selected.master){
		this.notificationManager.notify('Select one or more items before activating this tool.', 3);
		return;
	};
	
	if(confirm('ADVISORY: This tool creates a mirror copy of the selected item not a true duplicate.  Mirror copies remain linked and share the same data. Mirror copies should only be used for Adaptive (branching) projects that branch, otherwise use the Duplicate tool. Are you sure you wish to continue?')){
		this.engageSelectMode(this.moveCallback, 'Click a Step or Activity. The selected item(s) will be placed at that location.', [selected, true]);
	};
};

/**
 * Callback which does actual moving of the selected (@param selected) nodes,
 * depending on the selected location (@param id) and the types and locations
 * of the selected nodes.
 */
View.prototype.moveCallback = function(id, args){
	var selected = args[0];
	var use2x = args[1];
	
	if(id==-1){//user canceled, refresh and return
		this.generateAuthoring();
		return;
	} else if(id=='uSeq'){//only move sequences to unattached sequences
		if(selected.nodes.size()>0){
			this.notificationManager.notify('Only Activities can be moved into the Unattached Activities area. Ignoring steps.', 3);
		};
		var removed = this.removeFromProject(selected.seqs, use2x);
		
		//place them back in the beginning of the projectList
		if(!use2x){
			for(var b=0;b<removed.length;b++){
				this.project.getSequenceNodes().unshift(removed[b]);
			};
		};
	} else if(id=='uNode'){//only move nodes to unattached nodes
		if(selected.seqs.size()>0){
			this.notificationManager.notify('Only Steps can be moved into the Unattached Steps area. Ignoring activities.', 3);
		};		
		var removed = this.removeFromProject(selected.nodes, use2x);
		
		//place them back in the beginning of the projectList
		if(!use2x){
			for(var b=0;b<removed.length;b++){
				this.project.getLeafNodes().unshift(removed[b]);
			};
		};
	} else {//must be a id object id.after = boolean  id.id = string
		var pIdLoc = id.id.split('|');
		var toNode = this.project.getNodeById(pIdLoc[1]);
		if(id.after){//move selected after node - selected become siblings
			if(pIdLoc[0]!='null'){
				var parent = this.project.getNodeById(pIdLoc[0]);
				
				//enforce project structure
				if(this.simpleProject){
					if(toNode.type=='sequence'){//only sequences can be siblings to sequences in simple project mode
						var removed = this.removeFromProject(selected.seqs, use2x);
						if(selected.nodes.size()>0){
							this.notificationManager.notify('You are attempting to place nodes(s) at the same level as sequences when in Simple Project mode. If you really wish to do this, switch to Advanced Project mode. Ignoring node(s).', 3);
						};
					} else {//must be a node, only nodes can be siblings to nodes in simple project mode
						var removed = this.removeFromProject(selected.nodes, use2x);
						if(selected.seqs.size()>0){
							this.notificationManager.notify('You are attempting to place sequences(s) at the same level as nodes when in Simple Project mode. If you really wish to do this, switch to Advanced Project mode. Ignoring sequence(s).', 3);
						};
					};
				} else {
					var removed = this.removeFromProject(selected.ordered, use2x);
				};
				
				//get ndx after nodes have been removed
				var ndx = parent.children.indexOf(toNode) + 1;
				
				//now add them at appropriate location
				for(var f=0;f<removed.length;f++){
					var stack =[];
					
					parent.children.splice(ndx, 0, removed[f]);
					if(!this.project.validateNoLoops(parent.id, stack)){
						this.notificationManager.notify('Adding ' + removed[f].id + ' to ' + parent.id + ' would cause an infinite loop. Undoing change...', 3);
						parent.children.splice(ndx, 1);
					};
					
					if(!use2x){
						if(removed[f].type=='sequence'){
							this.project.getSequenceNodes().push(removed[f]);
						} else {
							this.project.getLeafNodes().push(removed[f]);
						};
					};
				};
			} else {//must exist in an unattached section
				if(this.project.getSequenceNodes().indexOf(toNode)==-1){//we are trying to move into unattached nodes
					if(selected.seqs.size()>0){
						this.notificationManager.notify('Only Steps can be moved into the Unattached Steps area. Ignoring activities.', 3);
					};		
					var removed = this.removeFromProject(selected.nodes, use2x);
					var ndx = this.project.getLeafNodes().indexOf(toNode) + 1;
					
					if(!use2x){
						for(var g=0;g<removed.length;g++){
							this.project.getLeafNodes().splice(ndx, 0, removed[g]);
						};
					};
				} else {//we are trying to move into unattached sequences
					if(selected.nodes.size()>0){
						this.notificationManager.notify('Only Activities can be moved into the Unattached Activities area. Ignoring steps.', 3);
					};
					var removed = this.removeFromProject(selected.seqs, use2x);
					var ndx = this.project.getSequenceNodes().indexOf(toNode) + 1;
					
					if(!use2x){
						for(var h=0;h<removed.length;h++){
							this.project.getSequenceNodes().splice(ndx, 0, removed[h]);
						};
					};
				};
			};
		} else {//move selected to first location inside of node - selected become children
			if(toNode){
				//enforce project structure
				if(this.simpleProject){
					if(this.project.getRootNode().id==toNode.id){//this is the master, only allow sequences
						var removed = this.removeFromProject(selected.seqs, use2x);
						if(selected.nodes.size()>0){
							this.notificationManager.notify('You are attempting to place node(s) outside of any sequence when in Simple Project mode. If you really wish to do this, switch to Advanced Project mode. Ignoring node(s).', 3);
						};
					} else {//must be a seq only process nodes in simple project mode
						var removed = this.removeFromProject(selected.nodes, use2x);
						if(selected.seqs.size()>0){
							this.notificationManager.notify('You are attempting to place sequence(s) within a sequence when in Simple Project mode. If you really wish to do this, switch to Advanced Project mode. Ignoring sequence(s).', 3);
						};
					};
				} else {//advanced project mode, proceed
					var removed = this.removeFromProject(selected.ordered, use2x);
				};
				
				for(var j=0;j<removed.length;j++){
					var stack = [];
					//add to node
					toNode.children.splice(0, 0, removed[j]);
					
					//verify no infinite loops
					if(!this.project.validateNoLoops(toNode.id, stack)){
						this.notificationManager.notify('Adding ' + removed[j].id + ' to ' + toNode.id + ' would cause an infinite loop. Undoing change...', 3);
						toNode.children.splice(0, 1);
					};
					
					//add to project's node lists
					if(!use2x){
						if(removed[j].type=='sequence'){
							this.project.getSequenceNodes().push(removed[j]);
						} else {
							this.project.getLeafNodes().push(removed[j]);
						};
					};
				};
			} else {
				this.notificationManager.notify('Problems trying to move Steps. No items were moved.', 3);
			};
		};
	};
	
	this.projectSaved = false;
};

/**
 * Given @param list (a yui nodeList), removes the nodes from their respective
 * locations in the project puts them in an array and returns the array.
 */
View.prototype.removeFromProject = function(list, removeFromProject){
	if(removeFromProject){
		return this.getProjectNodesFromList(list);
	};
	
	var removed = [];
	
	//remove in reverse to preserve positioning of previous
	for(var e=list.size()-1;e>=0;e--){
		var node = list.item(e);
		
		if(node.hasClass('master')){
			//skip remaining, don't want to remove it
			this.notificationManager.notify('the master activity cannot be removed', 2);
		} else {
			var pIdLoc = node.get('id').split('|');
			var projectNode = this.project.getNodeById(pIdLoc[1]);
			
			//put node in removed
			removed.push(projectNode);
			
			//if it has a parent, remove from parent
			if(pIdLoc[0]!='null'){
				this.project.removeReferenceFromSequence(pIdLoc[0], pIdLoc[2]);
			};
			
			//now remove from appropriate node list
			if(node.hasClass('seq')){//remove from seqs
				this.project.getSequenceNodes().splice(this.project.getSequenceNodes().indexOf(projectNode), 1);
			} else {//remove from nodes
				this.project.getLeafNodes().splice(this.project.getLeafNodes().indexOf(projectNode), 1);
			};
		};
	};
	
	return removed;
};

/**
 * Given a yui nodeList (@param list), returns an array of associated project nodes.
 */
View.prototype.getProjectNodesFromList = function(list){
	var nodes = [];
	
	for(var e=list.size()-1;e>=0;e--){
		nodes.push(this.project.getNodeById(list.item(e).get('id').split('|')[1]));
	};
	
	return nodes;
};

/**
 * Sets the callback var for selectModes, puts the authoring tool into select mode
 * and displays either the provided message or the default message.
 */
View.prototype.engageSelectMode = function(callback, message, args){
	this.clearAllSelected();
	this.selectModeEngaged = true;
	this.selectCallback = callback;
	this.selectArgs = args;
	
	hideElement('authorHeader');
	if(message){
		document.getElementById('selectModeMessage').innerHTML = message;
	} else {
		document.getElementById('selectModeMessage').innerHTML = this.defaultSelectModeMessage;
	};
	showElement('selectModeDiv');
	document.body.style.cursor = 'crosshair';
};

/**
 * Takes the authoring tool out of select mode and runs any callback with the passed in
 * value (@param val) and any args that may have been set.
 */
View.prototype.disengageSelectMode = function(val){
	this.selectModeEngaged = false;
	if(this.selectCallback){
		this.selectCallback(val, this.selectArgs);
	};
	
	document.getElementById('selectModeMessage').innerHTML = '';
	hideElement('selectModeDiv');
	showElement('authorHeader');
	document.body.style.cursor = 'auto';
	this.generateAuthoring();
	this.updatePageMeta();
};

/**
 * Determines what has been clicked and how to proceed based on the current state.
 */
View.prototype.processSelected = function(id){
	var node = yui.get(document.getElementById(id));
	if(node.hasClass('seq')){//disambiguate sequence choice
		this.disambiguateMode = true;	
		node.get('children').setStyle('display', 'none');
		var choice = document.getElementById('choiceDiv_' + id);
		choice.innerHTML = 'Insert the selected item(s) <a onclick="eventManager.fire(\'processChoice\',[\'' + id + '\',\'true\'])">AS FIRST STEP WITHIN THIS ACTIVITY</a> or <a onclick="eventManager.fire(\'processChoice\',[\'' + id + '\',\'false\'])">AFTER THIS ACTIVITY</a><i>&nbsp;&nbsp;(select a choice)</i>';
		choice.style.display = 'inline';
	} else if(node.hasClass('node')){//attach after given node
		this.disengageSelectMode({after: true, id: node.get('id')});
	} else if(node.hasClass('master')){
		this.disengageSelectMode({after: false, id: node.get('id')});
	} else {//unattached sequences or nodes
		this.disengageSelectMode(id);
	};
};

/**
 * Determines what has been clicked and how to proceed based on the current state.
 */
View.prototype.processChoice = function(id, opt){
	this.disambiguateMode = false;
	var node = yui.get(document.getElementById(id));
	node.get('children').setStyle('display', 'block');
	document.getElementById('choiceDiv_' + id).style.display = 'none';
	
	if(opt=='true'){
		this.disengageSelectMode({after: false, id: id});
	} else {
		this.disengageSelectMode({after: true, id: id});
	};
};

/**
 * Sets the element that the mouse is currently over as selected when
 * select mode is engaged.
 */
View.prototype.checkModeAndSelect = function(id){
	if(this.selectModeEngaged){
		yui.get(document.getElementById(id)).addClass('selected');
	};
};

/**
 * Sets the element that the cursor has just left as not selected when
 * select mode is engaged.
 */
View.prototype.checkModeAndDeselect = function(id){
	if(this.selectModeEngaged){
		yui.get(document.getElementById(id)).removeClass('selected');
	};
};

/**
 * After new node is created, sets up selection system to place the node
 * in the project.
 */
View.prototype.placeNewNode = function(id){
	this.clearAllSelected();
	var nodes = yui.all('.projectNode');
	nodes.each(function(node, k, l){
		var pIdLoc = node.get('id').split('|');
		if(pIdLoc[0]=='null' && pIdLoc[1]==id){
			node.addClass('selected');
		};
	});
	
	this.moveSelected();
	this.placeNodeId = undefined;
	this.placeNode = false;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_selection.js');
};
/**
 * Util functions for the authoring view
 * 
 * @author patrick lawler
 */
/**
 * Returns the content base from the given full url to a file.
 */
View.prototype.utils.getContentBaseFromFullUrl = function(url){
	if(url.indexOf('\\')!=-1){
		return url.substring(0, url.lastIndexOf('\\'));
	} else {
		return url.substring(0, url.lastIndexOf('/'));
	};
};

/**
 * Returns the path separator used by the given url.
 */
View.prototype.utils.getSeparator = function(url){
	if(url.indexOf('\\')!=-1){
		return '\\';
	} else {
		return '/';
	};
};

/**
 * Given a nodeId, removes associated node content file from server.
 */
View.prototype.utils.removeNodeFileFromServer = function(view, nodeId){
	var filename = view.getProject().getNodeFilename(nodeId);
	
	var callback = function(text, xml, o){
		if(text!='success'){
			o.notificationManager.notify('failed request to remove file: ' + filename + '  from the server', 3);
		};
	};

	if(filename){
		view.connectionManager.request('POST', 1, 'filemanager.html', {command: 'removeFile', param1: this.getContentPath(view.authoringBaseUrl,view.project.getContentBase()), param2: filename}, callback, view);
	};
};

/**
 * Returns the corresponding todo filename for the currently opened project.
 */
View.prototype.utils.getTODOFilename = function(projectFilename){
	return projectFilename.substring(0, projectFilename.lastIndexOf('.project.json')) + '.todo.txt';
};

/**
 * Returns the corresponding project meta filename for the currently opened project.
 */
View.prototype.utils.getProjectMetaFilename = function(projectFilename){
	return projectFilename.substring(0, projectFilename.lastIndexOf('.project.json')) + '.project-meta.json';
};

/**
 * Returns true if the given name is an allowed file type
 * to upload as asset, false otherwise.
 */
View.prototype.utils.fileFilter = function(extensions,name){
	return extensions.indexOf(this.getExtension(name)) != -1;
};

/**
 * Given a filename, returns the extension of that filename
 * if it exists, null otherwise.
 */
View.prototype.utils.getExtension = function(text){
	var ndx = text.lastIndexOf('.');
	if(ndx){
		return text.substring(ndx + 1, text.length);
	};

	return null;
};

/**
 * Given a string of a number of bytes, returns a string of the size
 * in either: bytes, kilobytes or megabytes depending on the size.
 */
View.prototype.utils.appropriateSizeText = function(bytes){
	if(bytes>1048576){
		return this.roundToDecimal(((bytes/1024)/1024), 1) + ' mb';
	} else if(bytes>1024){
		return this.roundToDecimal((bytes/1024), 1) + ' kb';
	} else {
		return bytes + ' b';
	};
};

/**
 * Returns the given number @param num to the nearest
 * given decimal place @param decimal. (e.g if called 
 * roundToDecimal(4.556, 1) it will return 4.6.
 */
View.prototype.utils.roundToDecimal = function(num, decimal){
	var rounder = 1;
	if(decimal){
		rounder = Math.pow(10, decimal);
	};

	return Math.round(num*rounder)/rounder;
};

/**
 * Hides any nodes in the project
 */
View.prototype.utils.hideNodes = function(){
	var nodes = yui.all('.projectNode.node');
	nodes.each(function(node,k){
		node.get('parentNode').get('parentNode').addClass('hidden');
	});
};

/**
 * Un-hides any nodes in the project
 */
View.prototype.utils.unhideNodes = function(){
	var nodes = yui.all('.projectNode.node');
	nodes.each(function(node,k){
		node.get('parentNode').get('parentNode').removeClass('hidden');
	});
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_utils.js');
};
/**
 * Functions that handle adding/editing/removing previuos work for nodes
 * 
 * @author patrick lawler
 */

/**
 * Saves the previous work changes to the project file
 */
View.prototype.savePreviousWork = function(){
	//clear activeNode's current prevWorkNodeIds list
	this.activeNode.prevWorkNodeIds = [];
	
	//add all node id's that are in the TO list
	var opts = document.getElementById('selectTo').options;
	for(var i=0;i<opts.length;i++){
		this.activeNode.prevWorkNodeIds.push(opts[i].value);
	};
	
	//save project
	this.saveProject();
	this.previousWorkDialog.hide();
};

/**
 * Clears and leaves the previous work dialog without saving changes.
 */
View.prototype.cancelPreviousWorkChanges = function(){
	this.clearCols();
	this.previousWorkDialog.hide();
};

/**
 * Clears both To and From cols of all Option elements
 */
View.prototype.clearCols = function(){ 
	var toSelect = document.getElementById('selectTo');
	var fromSelect = document.getElementById('selectFrom');

	while(toSelect.firstChild){
		toSelect.removeChild(toSelect.firstChild);
	};

	while(fromSelect.firstChild){
		fromSelect.removeChild(fromSelect.firstChild);
	};
};

/**
 * Uses the activeNode's prevWorkNodeIds list to populate the
 * TO columns select list with appropriate option elements.
 */
View.prototype.populateToCol = function(){
	var parent = document.getElementById('selectTo');
	var tos = this.activeNode.prevWorkNodeIds;
	if(tos){
		for(var q=0;q<tos.length;q++){
			var toNode = this.project.getNodeById(tos[q]);
			parent.appendChild(this.createOptionElement(toNode.id, toNode.title));
		};
	};
};

/**
 * Uses the project's node list minus the activeNode and other
 * nodes that are already in the list to populate the FROM columns
 * select list with the appropriate option elements.
 */
View.prototype.populateFromCol = function(){
	var parent = document.getElementById('selectFrom');
	var fromNodes = this.removeUnwanted(this.project.getLeafNodes());
	if(fromNodes){
		for(var w=0;w<fromNodes.length;w++){
			parent.appendChild(this.createOptionElement(fromNodes[w].id, fromNodes[w].title));
		};
	};
};

/**
 * Given a list of nodes, removes any nodes that: are already
 * in the TO list, SequenceNodes, excludedNodes and the currently
 * activeNode and returns that list.
 */
View.prototype.removeUnwanted = function(nodes){
	//make copy of array to work with
	workNodes = nodes.slice();
	
	//remove activeNode
	var ndx = workNodes.indexOf(this.activeNode);
	if(ndx!=-1){
		workNodes.splice(ndx, 1);
	};
	
	//cycle through remaining and remove any in TO list, Sequence or excluded
	for(var e=workNodes.length-1;e>=0;e--){
		var node = workNodes[e];
		if(node.type=='sequence' || node.type=='Activity' || node.children.length>0 || 
				this.excludedPrevWorkNodes.indexOf(node.type)!=-1 || 
				this.activeNode.prevWorkNodeIds.indexOf(node.id)!=-1){
			workNodes.splice(e,1);
		};
	};

	return workNodes;
};

/**
 * Adds the selected options in the right column to the activeNode
 * and refreshes so they appear in the left column
 */
View.prototype.moveSelectedLeft = function(){
	var opts = document.getElementById('selectFrom').options;
	var selected = [];

	//retrieve selected
	for(var r=0;r<opts.length;r++){
		if(opts[r].selected){
			selected.push(opts[r]);
		};
	};

	//then move them
	for(var y=0;y<selected.length;y++){
		var detached = selected[y].parentNode.removeChild(selected[y]);
		document.getElementById('selectTo').appendChild(detached);
	};
};

/**
 * Removes the selected options in the left column from the activeNode
 * and refreshes so they appear in the right column
 */
View.prototype.moveSelectedRight = function(){
	var opts = document.getElementById('selectTo').options;
	var selected = [];

	//retrieve selected
	for(var t=0;t<opts.length;t++){
		if(opts[t].selected){
			selected.push(opts[t]);
		};
	};

	//then move them
	for(var u=0;u<selected.length;u++){
		var detached = selected[u].parentNode.removeChild(selected[u]);
		document.getElementById('selectFrom').appendChild(detached);
	};
};

/**
 * Given a nodeId and title, creates and returns an 
 * option element whose value is that id and displays
 * the title.
 */
View.prototype.createOptionElement = function(nodeId, title){
	var opt = createElement(document, 'option', {id: nodeId + '_opt'});
	opt.text = title;
	opt.value = nodeId;
	return opt;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_previouswork.js');
};
/**
 * Functions specific to step authoring
 * 
 * @author patrick lawler
 */

/**
 * Sets the initial state of the authoring step dialog window
 */
View.prototype.setInitialAuthorStepState = function(){
	/* set active content as copy of the active nodes content */
	this.activeContent = createContent(this.activeNode.content.getContentUrl());
	
	/* preserve the content of the active node */
	this.preservedContent = this.activeNode.content;
	
	/* set step saved boolean */
	this.stepSaved = true;
	
	/* set radiobutton for easy/advanced mode */
	if(this.easyMode){
		document.getElementById('easyTrue').checked = true;
	} else {
		document.getElementById('easyFalse').checked = true;
	};
	
	/* set refresh as typing mode */
	document.getElementById('refreshCheck').checked = this.updateNow;
	
	/* generate the authoring */
	if(this.easyMode){
		this[this.resolveType(this.activeNode.type)].generatePage(this);
	} else {
		this.generateAdvancedAuthoring();
	};
	
	/* show in preview frame */
	this.previewStep();
};

/**
 * Returns the appropriate type for the purposes of authoring of the given node type.
 * In most cases, it is the node type itself. i.e. MultipleChoiceNode = MultipleChoiceNode,
 * but sometimes it's not: NoteNode = OpenResponseNode.
 */
View.prototype.resolveType = function(type){
	if(type=='NoteNode'){
		return 'OpenResponseNode';
	} else {
		return type;
	};
};

/**
 * Changes the boolean value of easyMode to that of the given value
 */
View.prototype.authorStepModeChanged = function(val){
	if(this.stepSaved || confirm('You are about to switch authoring mode but have not saved your changes. If you continue, your changes will be lost. Do you wish to continue?')){
		if(val=='true'){
			this.easyMode = true;
		} else {
			this.easyMode = false;
		};
		
		this.setInitialAuthorStepState();
	} else {
		/* user canceled put selection back */
		if(this.easyMode){
			document.getElementById('easyTrue').checked = true;
		} else {
			document.getElementById('easyFalse').checked = true;
		};
	};
};

/**
 * Changes the boolean value of updateNow to that selected by the user in the document
 */
View.prototype.updateRefreshOption = function(){
	this.updateNow = document.getElementById('refreshCheck').checked;
};

/**
 * generates the text area to author content when in advanced authoring mode
 */
View.prototype.generateAdvancedAuthoring = function(){
	var parent = document.getElementById('dynamicParent');
	
	/* remove any existing elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create elements for authoring content */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var ta = createElement(document, 'textarea', {id:'sourceTextArea', style:'width:100%;height:100%', onkeyup:'eventManager.fire("sourceUpdated")'});
	parent.appendChild(pageDiv);
	pageDiv.appendChild(ta);
	
	/* fill with active node's content string */
	ta.style.width = '100%';
	ta.style.height = '100%';
	ta.value = this.activeContent.getContentString();
};

/**
 * saves the currently open step's content and hides the authoring dialog
 */
View.prototype.closeOnStepSaved = function(success){
	if(success || confirm('Save failed, do you still want to exit?')){
		document.getElementById('dynamicPage').innerHTML = '';
		window.frames['previewFrame'].src = 'empty.html';
		this.activeNode.content.setContent(this.preservedContent.getContentJSON());
		this.activeNode.baseHtmlContent = undefined;
		this.activeNode = undefined;
		this.activeContent = undefined;
		this.preservedContent = undefined;
		this.authorStepDialog.hide();
	};
};

/**
 * Prompts user if they are trying to exit before saving and hides the authoring dialog if they wisht to continue
 */
View.prototype.closeStep = function(){
	if(this.stepSaved || confirm('Changes have not been saved, do you still wish to exit?')){
		this.closeOnStepSaved(true);
	};
};

/**
 *  refreshes the preview 
 */
View.prototype.refreshNow = function(){
	this.previewStep();
};

/**
 * saves the currently open step's content and calls individual step type's
 * save function so that any other tasks can be done at that time.
 */
View.prototype.saveStep = function(close){
	/* calls individual step type's save() if it exists */
	if(this.easyMode && this[this.activeNode.type] && this[this.activeNode.type].save){
		this[this.activeNode.type].save(close);
	};
	
	/* only save activeNode content if it is not an html type or if we are in advanced mode */
	if(SELF_RENDERING_NODES.indexOf(this.activeNode.type)==-1 || !this.easyMode){
		/* get json content as string */
		var contentString = encodeURIComponent(yui.JSON.stringify(this.activeContent.getContentJSON(),null,3));
		
		/* success callback for updating content file on server */
		var success = function(txt,xml,obj){
			obj.stepSaved = true;
			obj.notificationManager.notify('Content saved to server!', 3);
			obj.preservedContent.setContent(obj.activeContent.getContentJSON());
			if(close){
				obj.eventManager.fire('closeOnStepSaved', [true]);
			};
		};
		
		/* failure callback for updating content file on server */
		var failure = function(o,obj){
			obj.notificationManager.notify('Unable to save content to server!', 3);
			if(close){
				obj.eventManager.fire('closeOnStepSaved', [false]);
			};
		};
	
		/* update content to server */
		this.connectionManager.request('POST', 3, 'filemanager.html', {command:'updateFile', param1:this.utils.getContentPath(this.authoringBaseUrl,this.project.getContentBase()), param2: this.activeContent.getFilename(this.project.getContentBase()), param3:contentString},success,this,failure);
	};
};

/**
 * Update content and reload preview when user changes the content
 */
View.prototype.sourceUpdated = function(now){
	if(this.updateNow || now){
		this.stepSaved = false;
		
		if(this.easyMode){
			/* have the step type authoring update the content */
			this[this.resolveType(this.activeNode.type)].updateContent();
		} else {
			/* update content from source text area */
			this.activeContent.setContent(document.getElementById('sourceTextArea').value);
		};
		
		this.previewStep();
	};
};

/**
 * Previews the activeNodes content in the preview window
 */
View.prototype.previewStep = function(){
	/* set active node's content with active content */
	this.activeNode.content.setContent(this.activeContent.getContentJSON());
	
	/* render the node */
	this.activeNode.render(window.frames['previewFrame']);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/authorview_authorstep.js');
};
/**
 * Sets the OpenResponseNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.OpenResponseNode = {};

/**
 * Generates the authoring page for open response node types
 */
View.prototype.OpenResponseNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var promptText = document.createTextNode("Question for Student:");
	var linesText = document.createTextNode("Size of Student Response Box (# rows):");
	var richTextEditorText = document.createTextNode("Use Rich Text Editor");
	
	pageDiv.appendChild(linesText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generateLines());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(richTextEditorText);
	pageDiv.appendChild(this.generateRichText());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generateStarter());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generatePrompt());
	
	parent.appendChild(pageDiv);
};

/**
 * Generates and returns the lines element for the html
 * and set the value from the content.
 */
View.prototype.OpenResponseNode.generateLines = function(){
	return createElement(document, 'input', {type: 'text', id: 'linesInput', value: this.content.assessmentItem.interaction.expectedLines, onkeyup: 'eventManager.fire("openResponseLinesChanged")'});
};

/**
 * Updates the number of line elements for this open response to that
 * input by the user.
 */
View.prototype.OpenResponseNode.linesUpdated = function(){
	/* update content */
	this.content.assessmentItem.interaction.expectedLines = document.getElementById('linesInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates and returns the prompt element for the html
 * and sets the value from xmlPage
 */
View.prototype.OpenResponseNode.generatePrompt = function(){
	var prompt = createElement(document, 'textarea', {id: 'promptInput', name: 'promptInput', cols: '85', rows: '35', wrap: 'hard', onkeyup: "eventManager.fire('openResponsePromptChanged')"});
	prompt.value = this.content.assessmentItem.interaction.prompt;
	return prompt;
};

/**
 * Generates the starter sentence input options for this open response
 */
View.prototype.OpenResponseNode.generateStarter = function(){
	//create div for starterSentence options
	var starterDiv = createElement(document, 'div', {id: 'starterDiv'});
	
	//create starter sentence options
	var noStarterInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '0'});
	var starterOnClickInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '1'});
	var starterImmediatelyInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("openResponseStarterOptionChanged")', value: '2'});
	var starterSentenceInput = createElement(document, 'textarea', {id: 'starterSentenceInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("openResponseStarterSentenceUpdated")'});
	var noStarterInputText = document.createTextNode('Do not use starter sentence');
	var starterOnClickInputText = document.createTextNode('Starter sentence available upon request');
	var starterImmediatelyInputText = document.createTextNode('Starter sentence shows immediately');
	var starterSentenceText = document.createTextNode('Starter sentence: ');
	
	starterDiv.appendChild(noStarterInput);
	starterDiv.appendChild(noStarterInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterOnClickInput);
	starterDiv.appendChild(starterOnClickInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterImmediatelyInput);
	starterDiv.appendChild(starterImmediatelyInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterSentenceText);
	starterDiv.appendChild(starterSentenceInput);
	
	//set value of textarea
	starterSentenceInput.value = this.content.starterSentence.sentence;
	
	//set appropriate radio button and enable/disable textarea
	var displayOption = this.content.starterSentence.display;
	
	if(displayOption=='0'){
		starterSentenceInput.disabled = true;
		noStarterInput.checked = true;
	} else if(displayOption=='1'){
		starterOnClickInput.checked = true;
	} else if(displayOption=='2'){
		starterImmediatelyInput.checked = true;
	};
	
	return starterDiv;
};

/**
 * Updates this content when the starter sentence option has changed.
 */
View.prototype.OpenResponseNode.starterChanged = function(){
	var options = document.getElementsByName('starterRadio');
	var optionVal;
	
	/* get the checked option and update the content's starter sentence attribute */
	for(var q=0;q<options.length;q++){
		if(options[q].checked){
			this.content.starterSentence.display = options[q].value;
			if(options[q].value=='0'){
				document.getElementById('starterSentenceInput').disabled = true;
			} else {
				document.getElementById('starterSentenceInput').disabled = false;
			};
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates content with text in starter sentence textarea
 */
View.prototype.OpenResponseNode.starterUpdated = function(){
	/* update content */
	this.content.starterSentence.sentence = document.getElementById('starterSentenceInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates and returns an HTML Input Element of type checkbox 
 * used to determine whether a rich text editor should be used.
 */
View.prototype.OpenResponseNode.generateRichText = function(){
	var richTextChoice = createElement(document, 'input', {id: 'richTextChoice', type: 'checkbox', onclick: 'eventManager.fire("openResponseUpdateRichText")'});
	
	/* set whether this input is checked */
	richTextChoice.checked = this.content.isRichTextEditorAllowed;
	
	return richTextChoice;
};

/**
 * Updates the richtext option in the content and updates the preview page.
 */
View.prototype.OpenResponseNode.updateRichText = function(){
	this.content.isRichTextEditorAllowed = document.getElementById('richTextChoice').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content's prompt to match that of what the user input
 */
View.prototype.OpenResponseNode.updateXMLPrompt = function(){
	/* update content */
	this.content.assessmentItem.interaction.prompt = document.getElementById('promptInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.OpenResponseNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_openresponse.js');
};
/**
 * Sets the BrainstormNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.BrainstormNode = {};

/**
 * Generates the authoring page for brainstorm nodes
 */
View.prototype.BrainstormNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	this.currentResponse;
	
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old elements
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new elements
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var optionsDiv = createElement(document, 'div', {id:'optionsDiv'});
	
	parent.appendChild(pageDiv);
	pageDiv.appendChild(optionsDiv);
	
	this.generateOptions();
	this.generateStarter();
	this.generatePrompt();
	this.generateCannedResponses();
};

/**
 * Generates the option portion of this page dynamically based
 * on the content of xmlPage
 */
View.prototype.BrainstormNode.generateOptions = function(){
	var parent = document.getElementById('dynamicPage');
	var nextChild = document.getElementById('optionsDiv').nextChild;
	
	//wipe out old options
	parent.removeChild(document.getElementById('optionsDiv'));
	
	//create new options elements
	var optionsDiv = createElement(document, 'div', {id:'optionsDiv'});
	var optionsText = document.createTextNode('Available Options:');
	var optionsTable = createElement(document, 'table', {id:'optionsTable'});
	var optionsRow1 = createElement(document, 'tr', {id:'optionsRow1'});
	var optionsRow2 = createElement(document, 'tr', {id:'optionsRow2'});
	
	if(nextChild){
		parent.insertBefore(optionsDiv, nextChild);
	} else {
		parent.appendChild(optionsDiv);
	};
	
	optionsDiv.appendChild(optionsText);
	optionsDiv.appendChild(createBreak());
	optionsDiv.appendChild(optionsTable);
	optionsDiv.appendChild(createBreak());
	
	optionsTable.appendChild(optionsRow1);
	optionsTable.appendChild(optionsRow2);
	
	var expectedLinesText = document.createTextNode('Size of student response box (#rows): ');
	var expectedLinesInput = createElement(document, 'input', {type: 'text', id: 'expectedLines', onkeyup: 'eventManager.fire("brainstormUpdateExpectedLines")', value: this.content.assessmentItem.interaction.expectedLines});
	
	optionsDiv.appendChild(expectedLinesText);
	optionsDiv.appendChild(expectedLinesInput);
	
	var titleTD = createElement(document, 'td', {id: 'titleTD'});
	var titleText = document.createTextNode('Title: ');
	var titleInput = createElement(document, 'input', {type: 'text', id: 'titleInput', onkeyup: 'eventManager.fire("brainstromUpdateTitle")', value: this.content.title});
	
	optionsRow1.appendChild(titleTD);
	
	titleTD.appendChild(titleText);
	titleTD.appendChild(titleInput);
	
	var gatedTD = createElement(document, 'td', {id: 'gatedTD'});
	var gatedText = document.createTextNode('Is Brainstorm gated?');
	var gatedYesText = document.createTextNode('Yes. Student must post a response before seing peer responses');
	var gatedNoText = document.createTextNode('No. Student sees peer responses immediately');
	var gatedYesRadio = createElement(document, 'input', {type: 'radio', name: 'isGated', onclick: 'eventManager.fire("brainstormUpdateGated","true")'});
	var gatedNoRadio = createElement(document, 'input', {type: 'radio', name: 'isGated', onclick: 'eventManager.fire("brainstormUpdateGated","false")'});
	
	var displayNameTD = createElement(document, 'td', {id: 'displayNameTD'});
	var displayNameText = document.createTextNode('When response is submitted by student, how is it labeled?');
	var displayNameUserOnlyText = document.createTextNode('Username');
	var displayNameAnonymousOnlyText = document.createTextNode('Anonymous');
	var displayNameUserOrAnonymousText = document.createTextNode('Student selects Username or Anonymous');
	var displayNameUserOnlyRadio = createElement(document, 'input', {type: 'radio', name: 'displayName', onclick: 'eventManager.fire("brainstormUpdateDisplayName","0")'});
	var displayNameAnonymousOnlyRadio = createElement(document, 'input', {type: 'radio', name: 'displayName', onclick: 'eventManager.fire("brainstormUpdateDisplayName","1")'});
	var displayNameUserOrAnonymousRadio = createElement(document, 'input', {type: 'radio', name: 'displayName', onclick: 'eventManager.fire("brainstormUpdateDisplayName","2")'});
	
	var richTextEditorTD = createElement(document, 'td', {id: 'richTextEditorTD'});
	var richTextEditorText = document.createTextNode('Rich Text Editor');
	var richTextEditorYesText = document.createTextNode('Rich editor visible to student');
	var richTextEditorNoText = document.createTextNode('Rich 	editor not visible');
	var richTextEditorYesRadio = createElement(document, 'input', {type: 'radio', name: 'richText', onclick: 'eventManager.fire("brainstormUpdateRichText","true")'});
	var richTextEditorNoRadio = createElement(document, 'input', {type: 'radio', name: 'richText', onclick: 'eventManager.fire("brainstormUpdateRichText","false")'});
	
	var pollEndedTD = createElement(document, 'td', {id: 'pollEndedTD'});
	var pollEndedText = document.createTextNode('Is poll ended');
	var pollEndedYesText = document.createTextNode('poll is ended');
	var pollEndedNoText = document.createTextNode('poll is not ended');
	var pollEndedYesRadio = createElement(document, 'input', {type: 'radio', name: 'pollEnded', onclick: 'eventManager.fire("brainstormUpdatePollEnded","true")'});
	var pollEndedNoRadio = createElement(document, 'input', {type: 'radio', name: 'pollEnded', onclick: 'eventManager.fire("brainstormUpdatePollEnded","false")'});
	
	var instantPollTD = createElement(document, 'td', {id: 'instantPoll'});
	var instantPollText = document.createTextNode('Instant Poll Active?');
	var instantPollYesText = document.createTextNode('Instant Poll IS active');
	var instantPollNoText = document.createTextNode('Instant Poll IS NOT active');
	var instantPollYesRadio = createElement(document, 'input', {type: 'radio', name: 'instantPoll', onclick: 'eventManager.fire("brainstormUpdateInstantPoll","true")'});
	var instantPollNoRadio = createElement(document, 'input', {type: 'radio', name: 'instantPoll', onclick: 'eventManager.fire("brainstormUpdateInstantPoll","false")'});
	
	if(this.content.isInstantPollActive){
		instantPollYesRadio.checked = true;
	} else {
		instantPollNoRadio.checked = true;
	};
	instantPollTD.appendChild(instantPollText);
	instantPollTD.appendChild(createBreak());
	instantPollTD.appendChild(instantPollYesRadio);
	instantPollTD.appendChild(instantPollYesText);
	instantPollTD.appendChild(createBreak());
	instantPollTD.appendChild(instantPollNoRadio);
	instantPollTD.appendChild(instantPollNoText);
	
	if(this.content.isPollEnded){
		pollEndedYesRadio.checked = true;
	} else {
		pollEndedNoRadio.checked = true;
	};
	pollEndedTD.appendChild(pollEndedText);
	pollEndedTD.appendChild(createBreak());
	pollEndedTD.appendChild(pollEndedYesRadio);
	pollEndedTD.appendChild(pollEndedYesText);
	pollEndedTD.appendChild(createBreak());
	pollEndedTD.appendChild(pollEndedNoRadio);
	pollEndedTD.appendChild(pollEndedNoText);
	
	if(this.content.isRichTextEditorAllowed){
		richTextEditorYesRadio.checked = true;
	} else {
		richTextEditorNoRadio.checked = true;
	};
	richTextEditorTD.appendChild(richTextEditorText);
	richTextEditorTD.appendChild(createBreak());
	richTextEditorTD.appendChild(richTextEditorYesRadio);
	richTextEditorTD.appendChild(richTextEditorYesText);
	richTextEditorTD.appendChild(createBreak());
	richTextEditorTD.appendChild(richTextEditorNoRadio);
	richTextEditorTD.appendChild(richTextEditorNoText);
	
	if(this.content.displayName=='0'){
		displayNameUserOnlyRadio.checked = true;
	} else if(this.content.displayName=='1'){
		displayNameAnonymousOnlyRadio.checked = true;
	} else {
		displayNameUserOrAnonymousRadio.checked = true;
	};
	displayNameTD.appendChild(displayNameText);
	displayNameTD.appendChild(createBreak());
	displayNameTD.appendChild(displayNameUserOnlyRadio);
	displayNameTD.appendChild(displayNameUserOnlyText);
	displayNameTD.appendChild(createBreak());
	displayNameTD.appendChild(displayNameAnonymousOnlyRadio);
	displayNameTD.appendChild(displayNameAnonymousOnlyText);
	displayNameTD.appendChild(createBreak());
	displayNameTD.appendChild(displayNameUserOrAnonymousRadio);
	displayNameTD.appendChild(displayNameUserOrAnonymousText);
	
	if(this.content.isGated){
		gatedYesRadio.checked = true;	
	} else {
		gatedNoRadio.checked = true;
	};
	gatedTD.appendChild(gatedText);
	gatedTD.appendChild(createBreak());
	gatedTD.appendChild(gatedYesRadio);
	gatedTD.appendChild(gatedYesText);
	gatedTD.appendChild(createBreak());
	gatedTD.appendChild(gatedNoRadio);
	gatedTD.appendChild(gatedNoText);
	
	optionsRow1.appendChild(gatedTD);
	optionsRow1.appendChild(displayNameTD);
	optionsRow2.appendChild(richTextEditorTD);
	optionsRow2.appendChild(pollEndedTD);
	optionsRow2.appendChild(instantPollTD);
};

/**
 * Generates the starter sentence input options for this xmlPage
 */
View.prototype.BrainstormNode.generateStarter = function(){
	var parent = document.getElementById('dynamicPage');
	var old = document.getElementById('starterDiv');
	
	if(old){
		parent.removeChild(old);
	};
	
	//create div for starterSentence options
	var starterDiv = createElement(document, 'div', {id: 'starterDiv'});
	parent.appendChild(starterDiv);
	
	//create starter sentence options
	var noStarterInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("brainstormStarterChanged")', value: '0'});
	var starterOnClickInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("brainstormStarterChanged")', value: '1'});
	var starterImmediatelyInput = createElement(document, 'input', {type: 'radio', name: 'starterRadio', onclick: 'eventManager.fire("brainstormStarterChanged")', value: '2'});
	var starterSentenceInput = createElement(document, 'textarea', {id: 'starterSentenceInput', cols: '60', rows: '4', wrap: 'soft', onchange: 'eventManager.fire("brainstormStarterUpdated")'});
	var noStarterInputText = document.createTextNode('Do not use starter sentence');
	var starterOnClickInputText = document.createTextNode('Starter sentence available upon request');
	var starterImmediatelyInputText = document.createTextNode('Starter sentence shows immediately');
	var starterSentenceText = document.createTextNode('Starter sentence: ');
	
	starterDiv.appendChild(noStarterInput);
	starterDiv.appendChild(noStarterInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterOnClickInput);
	starterDiv.appendChild(starterOnClickInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterImmediatelyInput);
	starterDiv.appendChild(starterImmediatelyInputText);
	starterDiv.appendChild(createBreak());
	starterDiv.appendChild(starterSentenceText);
	starterDiv.appendChild(starterSentenceInput);
	
	/* set intitial values of starter sentence options */
	starterSentenceInput.value = this.content.starterSentence.sentence;
	
	if(this.content.starterSentence.display=='0'){
		starterSentenceInput.disabled = true;
		noStarterInput.checked = true;
	} else if(this.content.starterSentence.display=='1'){
		starterOnClickInput.checked = true;
	} else if(this.content.starterSentence.display=='2'){
		starterImmediatelyInput.checked = true;
	};
};

/**
 * Updates this content and preview when the starter sentence option has changed.
 */
View.prototype.BrainstormNode.starterChanged = function(){
	var options = document.getElementsByName('starterRadio');
	
	for(var q=0;q<options.length;q++){
		if(options[q].checked){
			this.content.starterSentence.display = options[q].value;
			if(options[q].value=='0'){
				document.getElementById('starterSentenceInput').disabled = true;
			} else {
				document.getElementById('starterSentenceInput').disabled = false;
			};
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the content's starter sentence with text in starter sentence textarea and 
 * refreshes preview
 */
View.prototype.BrainstormNode.starterUpdated = function(){
	/* update starterSentence value */
	this.content.starterSentence.sentence = document.getElementById('starterSentenceInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates the prompt element and removes previous prompt element
 */
View.prototype.BrainstormNode.generatePrompt = function(){
	var parent = document.getElementById('dynamicPage');
	var old = document.getElementById('promptDiv');
	
	//wipe out old
	if(old){
		parent.removeChild(old);
	};
	
	//create new
	var promptDiv = createElement(document, 'div', {id: 'promptDiv'});
	var promptText = document.createTextNode('Edit/Enter prompt');
	var promptInput = createElement(document, 'textarea', {id: 'promptInput', cols: '75', rows: '28', wrap: 'soft', onkeyup: 'eventManager.fire("brainstormUpdatePrompt")'});
	promptInput.value = this.content.assessmentItem.interaction.prompt;
	
	promptDiv.appendChild(createBreak());
	promptDiv.appendChild(promptText);
	promptDiv.appendChild(createBreak());
	promptDiv.appendChild(promptInput);
	
	parent.appendChild(promptDiv);
};

/**
 * Generates the cannedResponses element and removes previous
 */
View.prototype.BrainstormNode.generateCannedResponses = function(){
	var parent = document.getElementById('dynamicPage');
	var old = document.getElementById('cannedResponsesDiv');
	
	if(old){
		parent.removeChild(old);
	};
	
	var cannedResponsesDiv = createElement(document, 'div', {id: 'cannedResponsesDiv'});
	var cannedResponsesDivText = document.createTextNode('Edit/Create canned student responses', {'class':'cannedResponsesTitle'});
	var createButton = createElement(document, 'input', {type: 'button', 'class':'button', value: 'Create New Response', onclick: 'eventManager.fire("brainstormCreateNewResponse")'});
	var removeButton = createElement(document, 'input', {type: 'button', 'class':'button', value: 'Remove Response', onclick: 'eventManager.fire("brainstormRemoveResponse")'});
	var responses = this.content.cannedResponses;
	
	parent.appendChild(createBreak());
	cannedResponsesDiv.appendChild(cannedResponsesDivText);
	parent.appendChild(createBreak());
	for(var t=0;t<responses.length;t++){
		var responseTitleText = document.createTextNode('Name: ');
		var responseTitleInput = createElement(document, 'input', {type: 'text', id: 'responseInput_' + responses[t].name, value: responses[t].name, onkeyup: 'eventManager.fire("brainstormResponseNameChanged","' + responses[t].name + '")', onclick: 'eventManager.fire("brainstormResponseSelected","' + responses[t].name + '")'});
		var responseValueText = document.createTextNode('Response: ');
		var responseValueInput = createElement(document, 'textarea', {id: 'responseValue_' + responses[t].name, onkeyup: 'eventManager.fire("brainstormResponseValueChanged","' + responses[t].name + '")', onclick: 'eventManager.fire("brainstormResponseSelected","' + responses[t].name + '")'});
		responseValueInput.value = responses[t].response;
		
		cannedResponsesDiv.appendChild(createBreak());
		cannedResponsesDiv.appendChild(responseTitleText);
		cannedResponsesDiv.appendChild(responseTitleInput);
		cannedResponsesDiv.appendChild(createBreak());
		cannedResponsesDiv.appendChild(responseValueText);
		cannedResponsesDiv.appendChild(responseValueInput);
	};
	
	cannedResponsesDiv.appendChild(createBreak());
	cannedResponsesDiv.appendChild(createButton);
	cannedResponsesDiv.appendChild(removeButton);
	parent.appendChild(cannedResponsesDiv);
};

/**
 * Updates the value of the title attribute in xmlPage
 */
View.prototype.BrainstormNode.updateTitle = function(){
	this.content.title = document.getElementById('titleInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the isGated attribute in xmlPage
 */
View.prototype.BrainstormNode.updateGated = function(val){
	if(val=='true'){
		this.content.isGated = true;
	} else {
		this.content.isGated = false;
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the displayName attribute in xmlPage
 */
View.prototype.BrainstormNode.updateDisplayName = function(val){
	this.content.displayName = val;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the isRichTextEditorAllowed attribute in xmlPage
 */
View.prototype.BrainstormNode.updateRichText = function(val){
	if(val=='true'){
		this.content.isRichTextEditorAllowed = true;
	} else {
		this.content.isRichTextEditorAllowed = false;
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the isPollEnded attribute in xmlPage
 */
View.prototype.BrainstormNode.updatePollEnded = function(val){
	if(val=='true'){
		this.content.isPollEnded = true;
	} else {
		this.content.isPollEnded = false;
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the isInstantPollActive attribute in xmlPage
 */
View.prototype.BrainstormNode.updateInstantPoll = function(val){
	if(val=='true'){
		this.content.isInstantPollActive = true;
	} else {
		this.content.isInstantPollActive = false;
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the expectedLines attribute of the extendedTextInteraction element in xmlPage
 */
View.prototype.BrainstormNode.updateExpectedLines = function(){
	this.content.assessmentItem.interaction.expectedLines = document.getElementById('expectedLines').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the prompt element in xmlPage
 */
View.prototype.BrainstormNode.updatePrompt = function(){
	this.content.assessmentItem.interaction.prompt = document.getElementById('promptInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Given the name, returns the associated canned response in xmlPage
 */
View.prototype.BrainstormNode.getResponse = function(name){
	var responses = this.content.cannedResponses;
	for(var c=0;c<responses.length;c++){
		if(responses[c].name==name){
			return responses[c];
		};
	};
};

/**
 * Given an existing name, updates associated name in xmlPage
 */
View.prototype.BrainstormNode.responseNameChanged = function(name){
	var input = document.getElementById('responseInput_' + name);
	var responseInput = document.getElementById('responseValue_' + name);
	var val = input.value;
	var response = this.getResponse(name);
	input.id = 'responseInput_' + val;
	input.setAttribute('onkeyup', 'eventManager.fire("brainstormResponseNameChanged","' + val + '")');
	input.setAttribute('onclick', 'eventManager.fire("brainstormResponseSelected","' + val + '")');
	input.value = val;
	responseInput.id = 'responseValue_' + val;
	responseInput.setAttribute('onkeyup', 'eventManager.fire("brainstormResponseValueChanged","' + val + '")');
	responseInput.setAttribute('onclick', 'eventManager.fire("brainstormResponseSelected","' + val + '")');

	response.name = val;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Given an existing name, updates the associated value in xmlPage
 */
View.prototype.BrainstormNode.responseValueChanged = function(name){
	this.getResponse(name).response = document.getElementById('responseValue_' + name).value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * sets the currentResponse to the currently selected response
 */
View.prototype.BrainstormNode.responseSelected = function(name){
	this.currentResponse = this.getResponse(name);
};

/**
 * Removes the currently selected response, if none, alerts
 */
View.prototype.BrainstormNode.removeResponse = function(){
	if(this.currentResponse){
		this.content.cannedResponses.splice(this.content.cannedResponses.indexOf(this.currentResponse), 1);
		this.generatePage(this.view);
		
		/* fire source updated event */
		this.view.eventManager.fire('sourceUpdated');
	} else {
		this.view.notificationManager.notify('No response is selected for removal. Please select a response and try again.', 3);
	};
};

/**
 * Creates a new canned response
 */
View.prototype.BrainstormNode.createNewResponse = function(){
	this.content.cannedResponses.push({name:'Enter name',response:''});
	this.generatePage(this.view);
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.BrainstormNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_brainstorm.js');
};
/**
 * Sets the DataGraphNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.DataGraphNode = {};

/**
 * Generates the prompt and table elements for authoring
 * data graph nodes.
 */
View.prototype.DataGraphNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	this.hasRowLabels;
	this.hasColLabels;
	this.GRAPH_OPT_ARRAY = ['range', 'bar', 'line', 'point', 'linePoint'];
	
	this.generateOptions();
	this.generatePrompt();
	this.generateTable();
};

/**
 * Generates the options for this data graph
 */
View.prototype.DataGraphNode.generateOptions = function(){
	var parent = document.getElementById('dynamicPage');
	
	/* remove any old elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new elements */
	var editorTitle2 = createElement(document, 'div', {id: 'editorTitle2'});
	var optText = document.createTextNode("Data Grapher:");
	var optTable = createElement(document, 'table', {id: 'optTable', border: '1'});
	var tBod = createElement(document, 'tbody', {id: 'optTBody'});
	var r1 = createElement(document, 'tr');
	var r2 = createElement(document, 'tr');

	parent.appendChild(editorTitle2);
	editorTitle2.appendChild(optText);
	parent.appendChild(optTable);
	optTable.appendChild(tBod);
	tBod.appendChild(r1);
	tBod.appendChild(r2);
	
	/* graph and data options for display */
	var td1 = createElement(document, 'td', {id: 'displayOpts'});
	var td2 = createElement(document, 'td', {id: 'startOpts'});
	var optionsHeader1 = createElement(document, 'div', {id: 'optionsHeader1'});
	var dispText = document.createTextNode('Display Options:');
	var optionsHeader2 = createElement(document, 'div', {id: 'optionsHeader2'});
	var startText = document.createTextNode('Start Mode:');
	var o1 = createElement(document, 'input', {type: 'radio', name: 'displayRadio', id: 'displayDataOnly', onclick: 'eventManager.fire("datagraphDisplayOptionChanged")', value: '0'});
	var o2 = createElement(document, 'input', {type: 'radio', name: 'displayRadio', id: 'displayGraphOnly', onclick: 'eventManager.fire("datagraphDisplayOptionChanged")', value: '1'});
	var o3 = createElement(document, 'input', {type: 'radio', name: 'displayRadio', id: 'displayBoth', onclick: 'eventManager.fire("datagraphDisplayOptionChanged")', value: '2'});
	var o1Text = document.createTextNode('data table only');
	var o2Text = document.createTextNode('graph only');
	var o3Text = document.createTextNode('both');
	
	var s1 = createElement(document, 'input', {type: 'radio', name: 'startMode', id: 'startModeData', onclick: 'eventManager.fire("datagraphStartModeChanged")', value: '0'});
	var s2 = createElement(document, 'input', {type: 'radio', name: 'startMode', id: 'startModeGraph', onclick: 'eventManager.fire("datagraphStartModeChanged")', value: '1'});
	var s1Text = document.createTextNode('start w/data table');
	var s2Text = document.createTextNode('start w/graph');
	
	r1.appendChild(td1);
	r1.appendChild(td2);
	td1.appendChild(optionsHeader1);
	optionsHeader1.appendChild(dispText);
	td1.appendChild(o1);
	td1.appendChild(o1Text);
	td1.appendChild(o2);
	td1.appendChild(o2Text);
	td1.appendChild(o3);
	td1.appendChild(o3Text);
	td2.appendChild(optionsHeader2);
	optionsHeader2.appendChild(startText);
	td2.appendChild(s1);
	td2.appendChild(s1Text);
	td2.appendChild(s2);
	td2.appendChild(s2Text);
	
	/* set values */
	if(this.content.options.display.which=='0'){
		o1.checked = true;
		this.startOptions(false);
	} else if(this.content.options.display.which=='1'){
		o2.checked = true;
		this.startOptions(false);
	} else if(this.content.options.display.which=='2'){
		o3.checked = true;
		this.startOptions(true);
	};
	
	if(this.content.options.display.start=='0'){
		s1.checked = true;
	} else {
		s2.checked = true;
	};
	
	/* graph options editable by student */
	var optionsHeader3 = createElement(document, 'div', {id: 'optionsHeader3'});
	var td3 = createElement(document, 'td', {id: 'editOpts'});
	var optionsHeader4 = createElement(document, 'div', {id: 'optionsHeader4'});
	var td4 = createElement(document, 'td', {id: 'graphOpts'});
	var c1 = createElement(document, 'input', {type: 'checkbox', id: 'rangeCheck', name: 'graphOptions', onclick: 'eventManager.fire("datagraphGraphOptionChanged","range")'});
	var g1 = createElement(document, 'input', {type: 'checkbox', id: 'barCheck', name: 'graphOptions', onclick: 'eventManager.fire("datagraphGraphOptionChanged","bar")'});
	var g2 = createElement(document, 'input', {type: 'checkbox', id: 'lineCheck', name: 'graphOptions', onclick: 'eventManager.fire("datagraphGraphOptionChanged","line")'});
	var g3 = createElement(document, 'input', {type: 'checkbox', id: 'pointCheck', name: 'graphOptions', onclick: 'eventManager.fire("datagraphGraphOptionChanged","point")'});
	var g4 = createElement(document, 'input', {type: 'checkbox', id: 'linePointCheck', name: 'graphOptions', onclick: 'eventManager.fire("datagraphGraphOptionChanged","linePoint")'});
	var editOptsText = document.createTextNode('Students can edit: ');
	var c1Text = document.createTextNode(' edit range');
	var graphOptsText = document.createTextNode('Graphs available to student: ');
	var g1Text = document.createTextNode(' bar chart');
	var g2Text = document.createTextNode(' line graph');
	var g3Text = document.createTextNode(' point graph');
	var g4Text = document.createTextNode(' line point graph');
	
	r2.appendChild(td3);
	r2.appendChild(td4);
	td3.appendChild(optionsHeader3);
	optionsHeader3.appendChild(editOptsText);
	td3.appendChild(c1);
	td3.appendChild(c1Text);
	
	td4.appendChild(optionsHeader4);
	optionsHeader4.appendChild(graphOptsText);
	td4.appendChild(g1);
	td4.appendChild(g1Text);
	td4.appendChild(g2);
	td4.appendChild(g2Text);
	td4.appendChild(g3);
	td4.appendChild(g3Text);
	td4.appendChild(g4);
	td4.appendChild(g4Text);
	
	/* set values */
	for(var m=0;m<this.GRAPH_OPT_ARRAY.length;m++){
		document.getElementById(this.GRAPH_OPT_ARRAY[m] + 'Check').checked = this.content.options.graph[this.GRAPH_OPT_ARRAY[m]];
	};
};

/**
 * Generates the html elements needed for editing the prompt.
 */
View.prototype.DataGraphNode.generatePrompt = function(){
	var parent = document.getElementById('dynamicPage');
	
	var promptText = document.createTextNode("Question Prompt for Student:");
	var promptDiv = createElement(document, 'div', {id: 'promptDiv'});
	var promptArea = createElement(document, 'textarea', {id: 'promptText', rows: '7', onkeyup: 'eventManager.fire("datagraphPromptChanged")'});
	
	parent.appendChild(createBreak());
	parent.appendChild(promptDiv);
	promptDiv.appendChild(promptText);
	promptDiv.appendChild(createBreak());
	promptDiv.appendChild(promptArea);
	parent.appendChild(createBreak());
	
	promptArea.value = this.content.prompt;
};

/**
 * Generates and appends the html elements needed for table editing
 * to the dom.
 */
View.prototype.DataGraphNode.generateTable = function(){
	var parent = document.getElementById('dynamicPage');
	
	var editDiv = createElement(document, 'div', {id: 'tableEditingDiv'});
	var titleDiv = createElement(document, 'div', {id: 'titleDiv'});
	var optionsDiv = createElement(document, 'div', {id: 'optionsDiv'});
	var tableDiv = createElement(document, 'div', {id: 'tableDiv'});
	
	var titleText = document.createTextNode("Title for Table & Graph: ");
	var titleInput = createElement(document, 'input', {type: 'text', id: 'titleInput', onkeyup: 'eventManager.fire("datagraphTitleInputChanged")'});
	var editableText = document.createTextNode('editable by student');
	var editCheck = createElement(document, 'input', {type: 'checkbox', id: 'titleEditable', onclick: 'eventManager.fire("datagraphEditableChanged","title")'});
	
	var addR = createElement(document, 'input', {type: 'button', value: 'Add Row', onclick: 'eventManager.fire("datagraphAddRow")'});
	var addC = createElement(document, 'input', {id: 'buttonAddColumn', type: 'button', value: 'Add Column', onclick: 'eventManager.fire("datagraphAddCol")'});
	var remR = createElement(document, 'input', {type: 'button', value: 'Remove Row', onclick: 'eventManager.fire("datagraphRemoveRow")'});
	var remC = createElement(document, 'input', {id: 'buttonRemoveColumn', type: 'button', value: 'Remove Column', onclick: 'eventManager.fire("datagraphRemoveCol")'});
	var xLab = createElement(document, 'input', {type: 'button', value: 'Hide/Show Labels (top row)', onclick: 'eventManager.fire("datagraphToggleLabels","x")'});
	var yLab = createElement(document, 'input', {type: 'button', value: 'Hide/Show X-value (left column)', onclick: 'eventManager.fire("datagraphToggleLabels","y")'});
	
	parent.appendChild(editDiv);
	editDiv.appendChild(titleDiv);
	editDiv.appendChild(createBreak());
	editDiv.appendChild(optionsDiv);
	editDiv.appendChild(createBreak());
	editDiv.appendChild(tableDiv);

	titleDiv.appendChild(titleText);
	titleDiv.appendChild(titleInput);
	titleDiv.appendChild(createSpace());
	titleDiv.appendChild(editCheck);
	titleDiv.appendChild(editableText);
	titleInput.value = this.content.table.title;
	editCheck.checked = this.content.table.titleEditable;
	
	optionsDiv.appendChild(addR);
	optionsDiv.appendChild(addC);
	optionsDiv.appendChild(remR);
	optionsDiv.appendChild(remC);
	optionsDiv.appendChild(xLab);
	optionsDiv.appendChild(yLab);
	
	this.generateTableDiv();
};

/**
 * Generates the actual table based on its representation in xmlPage
 */
View.prototype.DataGraphNode.generateTableDiv = function(){
	var parent = document.getElementById('tableEditingDiv');
	
	parent.removeChild(document.getElementById('tableDiv'));
	var tableDiv = createElement(document, 'div', {id: 'tableDiv'});
	parent.appendChild(tableDiv);
	var checkboxMessageDiv = createElement(document, 'div', {id: 'checkboxMessageDiv'});
	var checkMessage = document.createTextNode('Note: all cells with a checkmark are editable by the student.');
	
	var table = createElement(document, 'table', {id: 'dataTable'});
	var tHead = createElement(document, 'thead', {id: 'tHead'});
	var tBody = createElement(document, 'tbody', {id: 'tBody'});
	
	tableDiv.appendChild(checkboxMessageDiv);
	checkboxMessageDiv.appendChild(checkMessage);
	tableDiv.appendChild(table);
	table.appendChild(tHead);
	table.appendChild(tBody);
	
	this.hasRowLabels = this.getNumOfRowLabels() > 0;
	this.hasColLabels = this.getNumOfColLabels() > 0;
	
	if(this.hasColLabels){//add header row
		var hRow = createElement(document, 'tr', {id: 'hRow'});
		tHead.appendChild(hRow);
		if(this.hasRowLabels){//add ind label input
			var indTD = createElement(document, 'td', {id: 'indHead', onclick: 'eventManager.fire("datagraphToggleSelected","ind")', 'class': 'label ind'});
			var indLabel = createElement(document, 'input', {type: 'text', id: 'ind_label', onchange: 'eventManager.fire("datagraphCellChanged","ind")'});
			var indCheck = createElement(document, 'input', {type: 'checkbox', id: 'ind_check', onclick: 'eventManager.fire("datagraphEditableChanged","ind")'});
			var indText = document.createTextNode('');
			
			if(this.content.table.independent.label){
				indLabel.value = this.content.table.independent.label;
			};
			indCheck.checked = this.content.table.independent.editable;
			
			hRow.appendChild(indTD);
			indTD.appendChild(indLabel);
			indTD.appendChild(indCheck);
			indTD.appendChild(indText);
		};
		
		/* set inputs for labels for each column */
		for(var c=0;c<this.content.table.cols.length;c++){
			var td = createElement(document, 'td', {id: 'colHead_' + c, onclick: 'eventManager.fire("datagraphToggleSelected","col_' + c + '")', 'class': 'label x_' + c});
			var labelInput = createElement(document, 'input', {type: 'text', id: 'col_Label_' + c, onchange: 'eventManager.fire("datagraphCellChanged","col_' + c + '")'});
			var editCheck = createElement(document, 'input', {type: 'checkbox', id: 'col_check_' + c, onclick: 'eventManager.fire("datagraphEditableChanged","col_' + c + '")'});
			var editText = document.createTextNode('');
			
			if(this.content.table.cols[c].label){
				labelInput.value = this.content.table.cols[c].label;
			};
			editCheck.checked = this.content.table.cols[c].editable;
			
			hRow.appendChild(td);
			td.appendChild(labelInput);
			td.appendChild(editCheck);
			td.appendChild(editText);
		};
	};
	
	/* create rows in table */
	for(var d=0;d<this.content.table.rows.length;d++){
		var tRow = createElement(document, 'tr', {id: 'row_' + d});
		tBody.appendChild(tRow);
		
		if(this.hasRowLabels){//create row lable elements
			var labelTD = createElement(document, 'td', {id: 'rowLabel_' + d, onclick: 'eventManager.fire("datagraphToggleSelected","row_' + d + '")', 'class': 'label y_' + d});
			var labelInput = createElement(document, 'input', {type: 'text', id: 'row_Label_' + d, onchange: 'eventManager.fire("datagraphCellChanged","row_' + d + '")'});
			var editCheck = createElement(document, 'input', {type: 'checkbox', id: 'row_check_' + d, onclick: 'eventManager.fire("datagraphEditableChanged","row_' + d + '")'});
			var editText = document.createTextNode("");
			
			tRow.appendChild(labelTD);
			labelTD.appendChild(labelInput);
			labelTD.appendChild(editCheck);
			labelTD.appendChild(editText);
			if(this.content.table.rows[d].label){
				labelInput.value = this.content.table.rows[d].label;
			};
			editCheck.checked = this.content.table.rows[d].editable;
		};
		
		for(var e=0;e<this.content.table.rows[d].cells.length;e++){//create td and editable elements for each cell
			var cTD = createElement(document, 'td', {id: 'cell_' + e + '_' + d, onclick: 'eventManager.fire("datagraphToggleSelected","cell_' + e + '_' + d + '")', 'class': 'x_' + e + ' y_' + d});
			tRow.appendChild(cTD);
			
			var cInput = createElement(document, 'input', {type: 'text', id: 'cellInput_'+ e + '_' + d, onchange: 'eventManager.fire("datagraphCellChanged","cell_'+ e + '_' + d + '")'});
			var cCheck = createElement(document, 'input', {type: 'checkbox', id: 'cellCheck_'+ e + '_' + d, onclick: 'eventManager.fire("datagraphEditableChanged","cell_'+ e + '_' + d + '")'});
			var editText = document.createTextNode('');
			cTD.appendChild(cInput);
			cTD.appendChild(cCheck);
			cTD.appendChild(editText);
			
			cCheck.checked = this.content.table.rows[d].cells[e].editable;
			
			if(this.content.table.rows[d].cells[e].value){
				cInput.value = this.content.table.rows[d].cells[e].value;
			};
		};
	};
};


/**
 * Returns all label xml elements found for the columns in xmlPage
 */
View.prototype.DataGraphNode.getColumns = function(){
	return this.content.table.cols;
};

/**
 * Returns all of the xml row elements found for the rows in xmlPage
 */
View.prototype.DataGraphNode.getRows = function(){
	return this.content.table.rows;
};

/**
 * Returns the xml Column element at the given index (@param num)
 */
View.prototype.DataGraphNode.getCol = function(num){
	return this.getColumns()[num];
};

/**
 * Returns the xml row element at the given index (@param num)
 */
View.prototype.DataGraphNode.getRow = function(num){
	return this.getRows()[num];
};

/**
 * Returns the xml cell element at the given coordinates (@param x, @param y)
 */
View.prototype.DataGraphNode.getCell = function(x, y){
	return this.getRow(y).cells[x];
};

/**
 * Returns number of row labels for the table represented in xmlPage
 */
View.prototype.DataGraphNode.getNumOfRowLabels = function(){
	var total = 0;
	var rows = this.getRows();
	for(var a=0;a<rows.length;a++){
		if(rows[a].label != undefined){
			total ++;
		};
	};
	return total;
};

/**
 * Returns number of col labels for the table represented in xmlPage
 */
View.prototype.DataGraphNode.getNumOfColLabels = function(){
	var total = 0;
	var cols = this.getColumns();
	for(var b=0;b<cols.length;b++){
		if(cols[b].label != undefined){
			total ++;
		};
	};
	return total;
};

/**
 * Updates the value of xmlPage when prompt value changes
 */
View.prototype.DataGraphNode.promptChanged = function(){
	this.content.prompt = document.getElementById('promptText').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value of the title in xmlPage when value changes
 */
View.prototype.DataGraphNode.titleInputChanged = function(){
	this.content.table.title = document.getElementById('titleInput').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Determines appropriate html element and associated xml element and updates
 * the value of the xml element based on the value of the html element.
 */
View.prototype.DataGraphNode.cellChanged = function(val){
	var locNum = val.split('_');
	
	if(val=='ind'){
		this.content.table.independent.label = document.getElementById('ind_label').value;
	} else if(locNum[0]=='col'){
		this.getCol(locNum[1]).label = document.getElementById(locNum[0] + '_Label_' + locNum[1]).value;
	} else if(locNum[0]=='row'){
		this.getRow(locNum[1]).label = document.getElementById(locNum[0] + '_Label_' + locNum[1]).value;
	} else if(locNum[0]=='cell'){
		var cell = this.getCell(locNum[1], locNum[2]).value = document.getElementById('cellInput_' + locNum[1] + '_' + locNum[2]).value;
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Changes the class of the selected item based on its position in
 * the table and its current class.
 */
View.prototype.DataGraphNode.toggleSelected = function(val){
	var posloc = val.split('_');
	if(val=='ind'){
		var el = document.getElementById('indHead');
	}else if(posloc[0]=='col'){
		var el = document.getElementById('colHead_' + posloc[1]);
	} else if(posloc[0]=='row'){
		var el = document.getElementById('rowLabel_' + posloc[1]);
	} else if(posloc[0]=='cell'){
		var el = document.getElementById('cell_' + posloc[1] + '_' + posloc[2]);
	};
	
	var currClass = el.getAttribute('class');
	this.clearAllSelected();
	
	if(currClass.indexOf('toggle_ind')!=-1){//previously selected
		if(posloc[0]=='col' || posloc[0]=='cell'){
			this.setSelected('x_' + posloc[1]);
			el.setAttribute('class', el.getAttribute('class') + ' toggle_col');
		} else if(posloc[0]=='row'){
			this.setSelected('y_' + posloc[1]);
			el.setAttribute('class', el.getAttribute('class') + ' toggle_row');
		};
	} else if(currClass.indexOf('toggle_col')!=-1){
		if(posloc[0]=='cell'){
			this.setSelected('y_' + posloc[2]);
			el.setAttribute('class', el.getAttribute('class') + ' toggle_row');
		};
	} else if(currClass.indexOf('toggle_row')!=-1){
		//do nothing, row is the last stop so let everything stay clear
	} else {//not previously selected, select now
		el.setAttribute('class', currClass + ' toggle_ind' + ' selected');
	};
};

/**
 * Adds the 'selected' class to all elements that share the
 * given class (@param c)
 */
View.prototype.DataGraphNode.setSelected = function(c){
	YUI().use('node', function(Y){
		var tds = Y.all('#dataTable td');
		tds.each(function(node, k){
			if(node.hasClass(c)){
				node.addClass('selected');
			};
		});
	});
};

/**
 * Removes 'selected' from the class of all td elements
 * in the table.
 */
View.prototype.DataGraphNode.clearAllSelected = function(){
	YUI().use('node', function(Y){
		var tds = Y.all('#dataTable td');
		tds.each(function(node, k){
			node.removeClass('selected');
			node.removeClass('toggle_ind');
			node.removeClass('toggle_row');
			node.removeClass('toggle_col');
		});
	});
};

/**
 * Returns the location of the element of the given value
 */
View.prototype.DataGraphNode.getSelected = function(val){
	var result;
	YUI().use('node', function(Y){
		var tds = Y.all('#dataTable td');
		tds.each(function(node, k){
			if(node.hasClass('toggle_' + val)){
				var c = node.getAttribute('class');
				if(val=='row'){
					var cStr = 'y_';
				} else {
					var cStr = 'x_';
				};
				
				var toC = c.substring(c.indexOf(cStr) + 2, c.length);
				result = toC.substring(0, toC.indexOf(' '));
			};
		});
	});
	return result;
};

/**
 * Creates and appends a new row at the currently selected position
 * and refreshes the table.
 */
View.prototype.DataGraphNode.addRow = function(){
	var ndx = this.getSelected('row');
	var rows = this.getRows();
	if(!ndx){
		ndx = rows.length;
	};
	
	/* create new row el */
	var row = this.createRow();
	
	/* insert into table */
	this.getRows().splice(ndx,0,row);
	
	/* if there are no existing cols, create and insert one because table is empty */
	if(this.getColumns().length==0){
		this.getColumns().push(this.createCol());
	};
	
	/* generate cells in this row for each col in table */
	for(var h=0;h<this.getColumns().length;h++){
		row.cells.push(this.createCell());
	};
	
	/* refresh table */
	this.generateTableDiv();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Creates and appends a new column at the currently selected position
 * and refreshes the table.
 */
View.prototype.DataGraphNode.addCol = function(){
	var ndx = this.getSelected('col');
	var cols = this.getColumns();
	if(!ndx){
		ndx = cols.length;
	};
	
	/* create new col el */
	var col = this.createCol();
	
	/* insert into table */
	this.content.table.cols.splice(ndx,0,col);
	
	/* if there are no existing rows, create and insert one because the table is empty */
	if(this.getRows().length==0){
		this.getRows().push(this.createRow());
	};
	
	/* create and insert cells for each row at the given column loc */
	var rows = this.getRows();
	for(var g=0;g<rows.length;g++){
		rows[g].cells.splice(ndx,0,this.createCell());
	};
	
	/* refresh table */
	this.generateTableDiv();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Creates and returns a xml column element with attributes set
 */
View.prototype.DataGraphNode.createCol = function(){
	var col = {editable:true};
	if(this.hasColLabels){
		col.label = '';
	};
	
	return col;
};

/**
 * Creates and returns a xml row element with attributes set
 */
View.prototype.DataGraphNode.createRow = function(){
	var row = {editable:true,cells:[]};
	if(this.hasRowLabels){
		row.label = '';
	};
	
	return row;
};

/**
 * Creates and returns a xml cell element with attributes set
 */
View.prototype.DataGraphNode.createCell = function(){
	return {editable:true};
};

/**
 * Removes the currently selected row
 */
View.prototype.DataGraphNode.removeRow = function(){
	var ndx = this.getSelected('row');
	if(!ndx){
		this.view.notificationManager.notify('Row not correctly selected.  Try TRIPLE-CLICKING a table cell to select the entire row.', 3);
		return;
	};
	
	if(confirm('The selected row will be deleted. Sure you want to proceed?')){
		var row= this.getRow(ndx);
		
		/* remove row element from xml */
		this.getRows().splice(ndx,1);
		
		/* refresh table */
		this.generateTableDiv();
		
		/* fire source updated event */
		this.view.eventManager.fire('sourceUpdated');
	};
};

/**
 * Removes the selected column and refreshes the table
 */
View.prototype.DataGraphNode.removeCol = function(){
	var ndx = this.getSelected('col');
	if(!ndx){
		this.view.notificationManager.notify('Column not correctly selected. Try DOUBLE-CLICKING a table cell to select the entire column.', 3);
		return;
	};
	
	if(confirm('The selected column will be deleted. Sure you wish to proceed?')){
		var col = this.getCol(ndx);
		
		/* remove tag element from xml */
		this.content.table.cols.splice(ndx,1);
		
		/* remove related col cells */
		var rows = this.getRows();
		for(var i=0;i<rows.length;i++){
			rows[i].cells.splice(ndx,1);
		};
		
		/* refresh table */
		this.generateTableDiv();
		
		/* fire source updated event */
		this.view.eventManager.fire('sourceUpdated');
	};
};

/**
 * Given the axis and the value of hasColLabels or hasRowLabels, either
 * adds or removes header labels for the table of the specified axis.
 */
View.prototype.DataGraphNode.toggleLabels = function(val){
	if(val=='x'){
		var cols = this.getColumns();
		if(this.hasColLabels && confirm('Any labels entered will be lost, do you wish to continue?')){//remove column labels
			for(var f=0;f<cols.length;f++){
				cols[f].label = undefined;
			};
		} else {//add column labels
			for(var f=0;f<cols.length;f++){
				cols[f].label = '';
			};
		};
	} else {
		var rows = this.getRows();
		if(this.hasRowLabels && confirm('Any data entered for the independent var will be lost, do you wish to continue?')){//remove row labels
			for(var f=0;f<rows.length;f++){
				rows[f].label = undefined;
			};
			this.content.table.independent.label = undefined;
		} else {//add row labels
			for(var f=0;f<rows.length;f++){
				rows[f].label = '';
			};
			if(this.content.table.independent){
				this.content.table.independent.label = '';
			} else {
				this.content.table.independent = {label:'',editable:true};
			};
		};
	};
	
	/* regenerate table */
	this.generateTableDiv();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the associated xml element in xmlPage editable value to
 * the current value of the associated html element.
 */
View.prototype.DataGraphNode.editableChanged = function(val){
	if(val=='title'){
		this.content.table.titleEditable = document.getElementById('titleEditable').checked;
	} else if(val=='ind'){
		this.content.table.independent.editable = document.getElementById('ind_check').checked;
	} else {
		var locNum = val.split('_');
		if(locNum[0]=='col'){
			this.getCol(locNum[1]).editable = document.getElementById('col_check_' + locNum[1]).checked;
		} else if(locNum[0]=='row'){
			this.getRow(locNum[1]).editable = document.getElementById('row_check_' + locNum[1]).checked;
		} else if(locNum[0]=='cell'){
			this.getCell(locNum[1], locNum[2]).editable = document.getElementById('cellCheck_' + locNum[1] + '_' + locNum[2]).checked;
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Sets the html start mode option elements to the boolean @param enabled
 */
View.prototype.DataGraphNode.startOptions = function(enabled){
	var opts = document.getElementsByName('startMode');
	for(var k=0;k<opts.length;k++){
		opts[k].disabled = !(enabled);
	};
};

/**
 * Determines the display option selected by the user and updates the xml
 */
View.prototype.DataGraphNode.displayOptionChanged = function(){
	var rads = document.getElementsByName('displayRadio');
	for(var n=0;n<rads.length;n++){
		if(rads[n].checked){
			var val = rads[n].value;
			this.content.options.display.which = val;
			if(val=='0'){
				this.startOptions(false);
				document.getElementById('startModeData').checked = true;
				this.startModeChanged();
			} else if(val=='1'){
				this.startOptions(false);
				document.getElementById('startModeGraph').checked = true;
				this.startModeChanged();
			} else if(val=='2'){
				this.startOptions(true);
				
				/* fire source updated event */
				this.view.eventManager.fire('sourceUpdated');
			};
		};
	};
};

/**
 * Determines the start mode selected by the user and updates the xml
 */
View.prototype.DataGraphNode.startModeChanged = function(){
	var mods = document.getElementsByName('startMode');
	for(o=0;o<mods.length;o++){
		if(mods[o].checked){
			this.content.options.display.start = mods[o].value;
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the associated graph option attribute in xmlPage with the given
 * @param name's html element checked attribute value.
 */
View.prototype.DataGraphNode.graphOptionChanged = function(name){
	this.content.options.graph[name] = document.getElementById(name+'Check').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.DataGraphNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_datagraph.js');
};
/**
 * Sets the DrawNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.DrawNode = {};

/**
 * Dynamically generates the html elements used in this page.
 */
View.prototype.DrawNode.generatePage = function(view){
	this.view = view;
	this.content = createContent(this.view.getProject().makeUrl(this.view.activeContent.getContentJSON().src));
	this.view.activeNode.baseHtmlContent = this.content;
	
	/* remove any old elements */
	var parent = document.getElementById('dynamicParent');
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new */
	var dPage = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	parent.appendChild(dPage);
	dPage.appendChild(document.createTextNode("When entering stamps and background, make sure to use the asset uploader on the main authoring page to upload your images."));
	dPage.appendChild(createBreak());
	
	/* create page */
	this.generatePrompt();
	this.generateBack();
	this.generateStamps();
};

/**
 * Generates the html prompt elements
 */
View.prototype.DrawNode.generatePrompt = function(){
	var rawPrompt = this.content.getContentString().match(/<div id="authorPrompt">[\s|\S]*<\/div>/);
	var prompt;
	
	if(rawPrompt){
		prompt = rawPrompt[0].substring(23, rawPrompt[0].length - 6);
	};
	
	var parent = document.getElementById('dynamicPage');
	
	var promptText = document.createTextNode("Enter any instructions for the student here, leave blank if none.");
	var promptDiv = createElement(document, 'div', {id: 'promptDiv'});
	var promptArea = createElement(document, 'textarea', {id: 'promptText', cols: '90', rows: '5', onchange: 'eventManager.fire("drawingPromptChanged")'});

	parent.appendChild(createBreak());
	parent.appendChild(createBreak());
	parent.appendChild(promptDiv);
	promptDiv.appendChild(promptText);
	promptDiv.appendChild(createBreak());
	promptDiv.appendChild(promptArea);
	parent.appendChild(createBreak());
	parent.appendChild(createBreak());
	
	if(prompt){
		promptArea.value = prompt;
	};
};

/**
 * Updates the html with the user entered prompt
 */
View.prototype.DrawNode.promptChanged = function(){
	var rawPrompt = this.content.getContentString().match(/<div id="authorPrompt">[\s|\S]*<\/div>/);
	
	if(rawPrompt){ 
		/* need to update text between tags */
		var actualPrompt = rawPrompt[0].substring(23, rawPrompt[0].length - 6);
		this.content.setContent(this.content.getContentString().replace(new RegExp(actualPrompt), document.getElementById('promptText').value));
	} else { 
		/* insert a new tag after the body tag */
		this.content.setContent(this.content.getContentString().replace(/<body(.*)>/, "<body$1><div id=\"authorPrompt\">" + document.getElementById('promptText').value + "</div>"));
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Determines whether the background image has been specified and calls
 * the appropriate function to create the correct html elements.
 */
View.prototype.DrawNode.generateBack = function(){
	var back = this.getContentBackground();
	
	var parent = document.getElementById('dynamicPage');
	var backDiv = createElement(document, 'div', {id: 'backDiv'});
	parent.appendChild(backDiv);
	
	if(back){
		this.createBackgroundSpecified(back[0], back[1]);
	} else {
		this.createBackgroundUnspecified();
	};
};

/**
 * Clears background div element, appends an input field for
 * background image filename and a remove button.
 */
View.prototype.DrawNode.createBackgroundSpecified = function(backText, backLabel){
	var parent = document.getElementById('backDiv');
	
	/* remove any old elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new elements */
	var backTable = createElement(document, 'table', {id: 'backTable'});
	var backTBody = createElement(document, 'tbody', {id: 'backTBody'});
	var backTR1 = createElement(document, 'tr');
	var backTR2 = createElement(document, 'tr');
	var backTDHead1 = createElement(document, 'td', {id: 'tdHead1'});
	var backTDHead2 = createElement(document, 'td', {id: 'tdHead2'});
	var backTD1 = createElement(document, 'td', {id: 'backImageTD'});
	var backTD2 = createElement(document, 'td', {id: 'backLabelTD'});
	
	var backImageText = document.createTextNode("Background image name.");
	var backLabelText = document.createTextNode("Background image label.");
	var backImageInput = createElement(document, 'input', {type: 'text', id: 'backInput', onchange: 'eventManager.fire("drawingBackgroundInfoChanged")'});
	var backLabelInput = createElement(document, 'input', {type: 'text', id: 'backLabel', onchange: 'eventManager.fire("drawingBackgroundInfoChanged")'});
	
	var removeBackButt = createElement(document, 'input', {type: 'button', value: 'Remove Background Image', onclick: 'eventManager.fire("drawingRemoveBackgroundImage")'});
	
	parent.appendChild(backTable);
	backTable.appendChild(backTBody);
	backTBody.appendChild(backTR1);
	backTBody.appendChild(backTR2);
	backTR1.appendChild(backTDHead1);
	backTR1.appendChild(backTDHead2);
	backTDHead1.appendChild(backImageText);
	backTDHead2.appendChild(backLabelText);
	backTR2.appendChild(backTD1);
	backTR2.appendChild(backTD2);
	backTD1.appendChild(backImageInput);
	backTD2.appendChild(backLabelInput);
	parent.appendChild(createBreak());
	parent.appendChild(removeBackButt);
	parent.appendChild(createBreak());
	parent.appendChild(createBreak());
	
	if(backText){
		backImageInput.value = backText;
	};
	
	if(backLabel){
		backLabelInput.value = backLabel;
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Clears the background div element and appends an
 * add background button.
 */
View.prototype.DrawNode.createBackgroundUnspecified = function(){
	var parent = document.getElementById('backDiv');
	
	/* remove any old elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new elements */
	parent.appendChild(createElement(document, 'input', {type: 'button', value: 'Add Background', onclick: 'eventManager.fire("drawingCreateBackgroundSpecified")'}));
	parent.appendChild(createBreak());
	parent.appendChild(createBreak());
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Retrieves and returns an array containing the background image
 * name and background image label for this nodes content if the
 * information is specified, returns null otherwise.
 */
View.prototype.DrawNode.getContentBackground = function(){
	var rawBack = this.content.getContentString().match(/<param name="background:(.*)>/);
	
	if(rawBack){
		var rawVal = rawBack[0].match(/value="(.*)"/)[1];
		
		//find . followed by 3 alpha chars followed by space, if not found, set filename = "" and value = rawVal
		var file = rawVal.match(/[^\.]*\.[a-zA-Z]{3}(?=\s{1,})/)[0];
		if(file){
			if(rawVal[file.length + 1]){
				var val = rawVal.substring(file.length + 1);
			} else {
				var val  = "";
			};
		} else {
			var val = rawVal;
		};
		
		if(file){
			return [file, val];
		} else {
			return ["", val];
		};
	} else {
		return null;
	};
};

/**
 * Updates the authored content of the background image information with
 * the user specified changes.
 */
View.prototype.DrawNode.backgroundInfoChanged = function(){
	var newBackName = document.getElementById('backInput').value;
	var newBackLabel = document.getElementById('backLabel').value;
	
	if(!this.validateExtension(newBackName)){
		this.view.notificationManager.notify('please enter a filename with a 3 character extension such as .jpg .gif .png', 3);
	} else {
		var currBack = this.getContentBackground();
		
		if(currBack){
			/* already exists, update */
			this.content.setContent(this.content.getContentString().replace(new RegExp(currBack[0] + " " + currBack[1]), newBackName + " " + newBackLabel));
		} else {
			/* it is new, add new background */
			this.view.utils.insertAppletParam(this.content, "background:1", newBackName + " " + newBackLabel);
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Removes background image from content and authoring page
 */
View.prototype.DrawNode.removeBackgroundImage = function(){
	this.content.setContent(this.content.getContentString().replace(/<param name="background:.*>/, ""));
	this.createBackgroundUnspecified();
};

/**
 * Determines whether any stamps have been specified and calls
 * the appropriate function to create the correct html elements.
 */
View.prototype.DrawNode.generateStamps = function(){
	var stamps = this.getContentStamps();
	
	var parent = document.getElementById('dynamicPage');
	var stampsDiv = createElement(document, 'div', {id: 'stampsDiv'});
	parent.appendChild(createBreak());
	parent.appendChild(stampsDiv);
	
	if(stamps){
		this.createStampsSpecified(stamps);
	} else {
		this.createStampsUnspecified();
	};
};

/**
 * Clears the stamp div element and adds the inputs and options
 * for all of the provided stamps.
 */
View.prototype.DrawNode.createStampsSpecified = function(stamps){
	var parent = document.getElementById('stampsDiv');
	
	/* remove any old elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new elements */
	var addButt = createElement(document, 'input', {type: 'button', value: 'Add new stamp', onclick: 'eventManager.fire("drawingAddNewStamp")'});
	var stampTableText = document.createTextNode("Edit and Remove existing stamps.");
	var stampT = createElement(document, 'table', {id: 'stampTable'});
	var tBody = createElement(document, 'tBody', {id: 'stampBody'});
	var tHeadRow = createElement(document, 'tr', {id: 'stampHeadRow'});
	var headPosTD = createElement(document, 'td', {id: 'headPosTD'});
	var headStampTD = createElement(document, 'td', {id: 'headStampTD'});
	var headLabelTD = createElement(document, 'td', {id: 'headLabelTD'});
	var headPosText = document.createTextNode("Position");
	var headStampText = document.createTextNode("Image filename");
	var headLabelText = document.createTextNode("Label for image");
	
	parent.appendChild(addButt);
	parent.appendChild(createBreak());
	parent.appendChild(createBreak());
	parent.appendChild(stampTableText);
	parent.appendChild(createBreak());
	parent.appendChild(stampT);
	stampT.appendChild(tBody);
	tBody.appendChild(tHeadRow);
	tHeadRow.appendChild(headPosTD);
	tHeadRow.appendChild(headStampTD);
	tHeadRow.appendChild(headLabelTD);
	headPosTD.appendChild(headPosText);
	headStampTD.appendChild(headStampText);
	headLabelTD.appendChild(headLabelText);
	
	/* go through stamps and set up the html */
	if(stamps){
		for(var b=0;b<stamps.length;b++){
			this.createStampRow(tBody, stamps[b].num, stamps[b].name, stamps[b].value);
		};
	} else {
		/* setup first stamp row */
		this.createStampRow(tBody, this.getUniquePositionNumber(), "", "");
	};
};

/**
 * Given the parent table (@param parent), the position (@param num), the
 * filename value (@param name) and the label value (@param label), creates
 * and appends the appropriate html elements and options to the table.
 */
View.prototype.DrawNode.createStampRow = function(parent, num, name, label){
	var nRow = createElement(document, 'tr', {id: 'stampRow_' + num});
	var nPosTD = createElement(document, 'td', {id: 'stampPosTD_' + num});
	var nStampTD = createElement(document, 'td', {id:'stampNameTD_' + num});
	var nStampLabelTD = createElement(document, 'td', {id: 'stampLabelTD_' + num});
	var nStampOptionTD = createElement(document, 'td', {id: 'stampOptionTD_' + num});
	var posText = document.createTextNode(num);
	var nameInput = createElement(document, 'input', {type: 'text', id: 'stampInput_' + num, value: name, onchange: 'eventManager.fire("drawingStampInfoChanged","' + num + '")'});
	var labelInput = createElement(document, 'input', {type: 'text', id: 'labelInput_' + num, value: label, onchange: 'eventManager.fire("drawingStampInfoChanged","' + num + '")'});
	var removeButt = createElement(document, 'input', {type: 'button', id: 'removeButt_' + num, value: 'Remove stamp', onclick: 'eventManager.fire("drawingRemoveStamp","' + num + '")'});
	
	parent.appendChild(nRow);
	nRow.appendChild(nPosTD);
	nRow.appendChild(nStampTD);
	nRow.appendChild(nStampLabelTD);
	nRow.appendChild(nStampOptionTD);
	nPosTD.appendChild(posText);
	nStampTD.appendChild(nameInput);
	nStampLabelTD.appendChild(labelInput);
	nStampOptionTD.appendChild(removeButt);
};

/**
 * Adds a new stamp elements in the html with filename and label
 * input fields for the user to specify and edit filename and label
 */
View.prototype.DrawNode.addNewStamp = function(){
	this.createStampRow(document.getElementById('stampBody'), this.getUniquePositionNumber(), "", "");
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Looks at all stamps in project and returns a unique position number
 */
View.prototype.DrawNode.getUniquePositionNumber = function(){
	var stamps = this.getContentStamps();
	if(stamps){
		var current = 1;
		
		while(true){
			var found = false;
			for(var d=0;d<stamps.length;d++){
				if(stamps[d].num==current){
					found = true;
				};
			};
			
			if(found){
				current ++;
			} else {
				return current;
			};
		};
	} else {
		return 1;
	};
};

/**
 * Updates the node's content with the newly authored values for the stamp
 * at the specified postion (@param pos).
 */
View.prototype.DrawNode.stampInfoChanged = function(pos){
	var stampName = document.getElementById('stampInput_' + pos).value;
	var stampLabel = document.getElementById('labelInput_' + pos).value;
	
	if(!this.validateExtension(stampName)){
		this.view.notificationManager.notify('please enter a filename with a 3 character extension such as .jpg .gif .png', 3);
	} else {
		var stamps = this.getContentStamps();
		var exists = false;
		if(stamps){
			for(var c=0;c<stamps.length;c++){
				if(stamps[c].num==pos){//already exists, update
					exists = true;
					this.content.setContent(this.content.getContentString().replace(new RegExp(stamps[c].name + " " + stamps[c].value), stampName + " " + stampLabel));
				};
			};
			
			if(!exists){
				/* must be new so add new stamp */
				this.view.utils.insertAppletParam(this.content, "stamp:" + pos, stampName + " " + stampLabel);
			};
		} else {
			/* there are no stamps, add new stamp */
			this.view.utils.insertAppletParam(this.content, "stamp:" + pos, stampName + " " + stampLabel);
		};
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Removes stamp associated with the given position (@param pos) from
 * the node.content, the html element and regenerates the stamps.
 */
View.prototype.DrawNode.removeStamp = function(pos){
	var re = new RegExp("<param name=\"stamp:" + pos + ".*>");
	this.content.setContent(this.content.getContentString().replace(re, ""));
	
	var row = document.getElementById('stampRow_' + pos);
	row.parentNode.removeChild(row);
	
	document.getElementById("dynamicPage").removeChild(document.getElementById("stampsDiv"));
	this.generateStamps();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Clears the stamp div element and appends an add stamp button.
 */
View.prototype.DrawNode.createStampsUnspecified = function(){
	var parent = document.getElementById('stampsDiv');
	
	/* remove any old elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new element */
	var addButt = createElement(document, 'input', {type: 'button', value: 'Add stamp', onclick: 'eventManager.fire("drawingCreateStampsSpecified")'});
	parent.appendChild(addButt);
};

/**
 * Retrieves and returns a list of any stamp parameters found in the content
 * of this node being authored. Returns null if no stamp parameter tags are found.
 */
View.prototype.DrawNode.getContentStamps = function(){
	var rawStamps = this.content.getContentString().match(/<param name="stamp:.*>/g);
	if(rawStamps){
		var stamps = [];
		for(var a=0;a<rawStamps.length;a++){
			var number = rawStamps[a].match(/stamp:(.*)(?="\s{1}value=")/)[1];
			var rawVal = rawStamps[a].match(/value="(.*)"/)[1];
			
			//find . followed by 3 alpha chars followed by space, if not found, set filename = "" and value = rawVal
			var file = rawVal.match(/[^\.]*\.[a-zA-Z]{3}(?=\s{1,})/)[0];
			if(file){
				if(rawVal[file.length + 1]){
					var val = rawVal.substring(file.length + 1);
				} else {
					var val  = "";
				};
			} else {
				var val = rawVal;
			};
			
			stamps.push({num: number, name: file, value: val});
		};
		
		return stamps;
	} else {
		return null;
	};
};

/**
 * If the provided text ends with a . followed by three alpha characters,
 * returns the match, returns null otherwise.
 */
View.prototype.DrawNode.validateExtension = function(text){
	return text.match(/.*\.[a-zA-Z]{3}$/);
};

/**
 * Returns true if background image has been specified, false otherwise.
 */
View.prototype.DrawNode.validateBackgroundSpecified = function(){
	var back = this.getContentBackground();
	if(back && back[0] && back[0]!=""){
		return true;
	} else {
		return false;
	};
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.DrawNode.updateContent = function(){
	/* update content object */
	this.view.activeNode.baseHtmlContent.setContent(this.content.getContentString());
};

/**
 * Saves the html content to its file
 */
View.prototype.DrawNode.save = function(close){
	var success = function(t,x,o){
		o.stepSaved = true;
		o.notificationManager.notify('Updated html content on server', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [true]);
		};
	};
	
	var failure = function(t,x,o){
		o.notificationManager.notify('Failed update of html content on server', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [false]);
		};
	};
	
	this.view.connectionManager.request('POST', 3, 'filemanager.html', {command:'updateFile', param1:this.view.utils.getContentPath(this.view.authoringBaseUrl,this.view.getProject().getContentBase()), param2:this.view.activeNode.baseHtmlContent.getFilename(this.view.getProject().getContentBase()), param3:encodeURIComponent(this.content.getContentString())}, success, this.view, failure);
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_drawing.js');
};
/**
 * Sets the FillinNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.FillinNode = {};

/**
 * Sets initial variables then calls re-generate to build html dynamically
 */
View.prototype.FillinNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	this.fillin = [];
	this.fillinIndexes = [];
	this.charCount;
	this.fullText;
	
	this.regeneratePage();
};

/**
 * Dynamically generates the html elements used in this page.
 */
View.prototype.FillinNode.regeneratePage = function(){
	var parent = document.getElementById('dynamicParent');
	
	/* wipe out old elements and variables */
	parent.removeChild(document.getElementById('dynamicPage'));
	
	/* generate full text */
	this.generateFullText();
	
	/* create new elements */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var questionText = document.createTextNode('QUESTION');
	var questionText2 = document.createTextNode('Type your question below. To create fill-in blanks, highlight a section of text and click the TRANSFORM button. To edit or remove existing fillins, select the matching radio button.');
	var questionInput = createElement(document, 'textarea', {id: 'questionInput', cols: '90', rows: '30', wrap: 'hard', onkeyup: 'eventManager.fire("fillinTextUpdated")'});
	var fillinText = document.createTextNode('Edit/Remove existing fillins');
	questionInput.innerHTML = this.fullText;
	this.charCount = questionInput.value.length;
	
	var createFillin = createElement(document, 'input', {type: 'button', onclick: 'eventManager.fire("fillinCreateFillin")', value: 'Transform Highlighted Text into Fill-Blank'});
	
	pageDiv.appendChild(questionText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(questionText2);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(questionInput);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createFillin);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(fillinText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generateFillins());
	
	parent.appendChild(pageDiv);
};

/**
 * Generates the fulltext from the content and sets the textarea's value with the full text
 */
View.prototype.FillinNode.generateFullText = function(){
	this.fullText = "";
	this.fillin = [];
	this.fillinIndexes = [];
	
	var currentIndex = 0;
	var html = '';
	
	for(var x=0;x<this.content.assessmentItem.interaction.length;x++){
		if(this.content.assessmentItem.interaction[x].type=='htmltext'){
			html += this.spaceMaker(this.content.assessmentItem.interaction[x].text);
			currentIndex += this.spaceMaker(this.content.assessmentItem.interaction[x].text).length;
		} else if(this.content.assessmentItem.interaction[x].type=='textEntryInteraction'){
			var indexes = currentIndex + "|";
			this.fillin.push(this.content.assessmentItem.interaction[x].responseIdentifier);
			html += this.retrieveInteractionText(this.content.assessmentItem.interaction[x].responseIdentifier);
			currentIndex += this.retrieveInteractionText(this.content.assessmentItem.interaction[x].responseIdentifier).length;
			indexes += currentIndex;
			this.fillinIndexes.push(indexes);
		};
	};
	
	this.fullText = html;
	return html;
};

/**
 * Ensures that the index of the modification does not
 * overlap with any current fillins.
 */
View.prototype.FillinNode.validate = function(){
	var start = document.getElementById('questionInput').selectionStart + 1;
	var end = document.getElementById('questionInput').selectionEnd + 1;
	
	if(this.overlaps(start, end)){
		this.view.notificationManager.notify('You can not change this text because it is part of a fillin! If you want to change/edit/remove the fillin text, then do so below.', 3);
		return false;
	};
	return true;
};

/**
 * Returns the difference in the number of characters from
 * previous textarea and current modified textarea
 */
View.prototype.FillinNode.getDifference = function(){
	return this.charCount - document.getElementById('questionInput').value.length;
};

/**
 * Creates and returns a table with the existing fillins
 */
View.prototype.FillinNode.generateFillins = function(){
	var fillinTable = createElement(document, 'table', {id: 'fillinTable'});
	var headerRow = createElement(document, 'tr', {id: 'headerRow'});
	var fillinTD = createElement(document, 'td', {id: 'fillinTD'});
	var placeholderAllowableTD = createElement(document, 'td', {id: 'allowableTable'});
	
	/* cycle through existing fillins and create and append the appropriate elements to the the fillinTD */
	for(var g=0;g<this.fillin.length;g++){
		var endStart = this.fillinIndexes[g].split('|');
		var text = document.createTextNode('Blank #' + (g + 1) + ':');
		var removeButton = createElement(document, 'input', {type: 'button', value: 'Remove Fillin', onclick: 'eventManager.fire("fillinRemoveFillin")'});
		var radio = createElement(document, 'input', {type: 'radio', id: 'radio_' + g, value: this.fillin[g], name: 'fillinRadio', onclick: 'eventManager.fire("fillinClick",["' + this.fillin[g] + '","' + g + '"])'});
		var input = createElement(document, 'input', {type: 'text', id: 'input_' + g, name: 'input_' + g, onclick: 'eventManager.fire("fillinClick",["' + this.fillin[g] + '","' + g + '"])', onkeyup: 'eventManager.fire("fillinChangeSelected","' + g + '")', value: this.fullText.substring(endStart[0], endStart[1])});
		
		fillinTD.appendChild(createBreak());
		fillinTD.appendChild(text);
		fillinTD.appendChild(radio);
		fillinTD.appendChild(input);
	};
	
	fillinTD.appendChild(createBreak());
	if(removeButton){
		fillinTD.appendChild(removeButton);
	};
	headerRow.appendChild(fillinTD);
	headerRow.appendChild(placeholderAllowableTD);
	fillinTable.appendChild(headerRow);
	return fillinTable;
};

/**
 * Updates the fillin responseDeclaration and allowable answers when text
 * changes and updates text area to reflect changes
 */
View.prototype.FillinNode.changeSelected = function(index){
	var value = document.getElementById('input_' + index).value;
	var declaration = this.content.assessmentItem.responseDeclarations[index];
	
	if(value!=declaration.correctResponses[0].response){ //then text has changed and we must update, mustn't we
		declaration.correctResponses[0].response = value;
		document.getElementById('entryInput_0').value = value;
		document.getElementById('questionInput').value = generateFullText();
		
		/* fire source updated event */
		this.view.eventManager.fire('sourceUpdated');
	};
};

/**
 * Removes fillin responseDeclaration and textEntryInteraction with
 * the given identifier
 */
View.prototype.FillinNode.removeFillin = function(){
	var identifier = this.getSelectedIdentifier();
	
	if(identifier){
		var declarations = this.content.assessmentItem.responseDeclarations;
		var foundIndex;
		
		/* find the right location to remove because the remainder will need to be updated */
		for(var h=0;h<declarations.length;h++){
			if(declarations[h].identifier==identifier){ 
				/* remove declaration */
				declarations.splice(h,1);
				
				/* remove associated interaction */
				this.content.assessmentItem.interaction.splice(this.content.assessmentItem.interaction.indexOf(this.getInteraction(identifier)),1);
				foundIndex = h;
			};
		};
		
		/* now update remaining identifiers */
		for(var t=foundIndex;t<declarations.length;t++){
			this.decrementIdentifiers(declarations[t]);
		};
		
		/* regenerate page */
		this.regeneratePage();
		
		/* fire source updated event */
		this.view.eventManager.fire('sourceUpdated');
	} else {
		this.view.notificationManager.notify('Please select a fillin that you wish to remove first', 3);
	};
};

/**
 * Given a declaration, decrements its identifier by 1
 */
View.prototype.FillinNode.decrementIdentifiers = function(declaration){
	var interactions = this.content.assessmentItem.interaction;
	var identifier = declaration.identifier;
	var newNum = parseInt(identifier.substring(identifier.length - 1, identifier.length)) - 1;
	declaration.identifier = 'response_' + newNum;
		
	for(var z=0;z<interactions.length;z++){
		if(interactions[z].type=='textEntryInteraction' && interactions[z].responseIdentifier==identifier){
			interactions[z].responseIdentifier = 'response_' + newNum;
			break;
		};
	};
};

/**
 * Detects which fillin element is currently selected and returns the associated identifier
 */
View.prototype.FillinNode.getSelectedIdentifier = function(){
 	var identifier;
 	var checked = document.getElementsByName('fillinRadio');
	
	for(var x=0;x<checked.length;x++){
		if(checked[x].checked){
			identifier = checked[x].value;
		};
	};
	
	return identifier;
 };

/**
 * Detects which fillin element is currently selected andreturns it's index
 */
 View.prototype.FillinNode.getSelectedIndex = function(){
 	var checked = document.getElementsByName('fillinRadio');
 	
 	for(var x=0;x<checked.length;x++){
 		if(checked[x].checked){
 			return x;
 		};
 	};
 };

/**
 * When fillin is clicked, sets the clicked fillin as selected and
 * generates the associated allowable answers table
 */
 View.prototype.FillinNode.fillinClick = function(identifier, index){
	var parent = document.getElementById('headerRow');
	
	/* set the associated fillin as selected */
	document.getElementById('radio_' + index).checked = true;
	
	/* clear previous allowableTable */
	parent.removeChild(document.getElementById('allowableTable'));
	
	/* generate new allowableTable */
	parent.appendChild(this.generateAllowableAnswers(identifier));
};

/**
 * returns the text associated with the given identifier of a textEntryInteraction
 */
View.prototype.FillinNode.retrieveInteractionText = function(identifier){
	return this.spaceMaker(this.getDeclaration(identifier).correctResponses[0].response);
};

/**
 * Generates and returns a TD element that contains the allowable
 * answers and editing options that are associated with the given
 * identifier.
 */
View.prototype.FillinNode.generateAllowableAnswers = function(identifier){
	var allowableTD = createElement(document, 'td', {id: 'allowableTable'});
	var allowableText = document.createTextNode('Edit/add allowable answers for blank #' + this.getLineNumber(identifier));
	var declaration = this.getDeclaration(identifier);
	var addButton = createElement(document, 'input', {type: 'button', value: 'Add New', onclick: 'eventManager.fire("fillinAddNewAllowable","' + identifier + '")'});
	
	allowableTD.appendChild(allowableText);
	for(var i=0;i<declaration.correctResponses.length;i++){
		var entryInput = createElement(document, 'input', {type: 'text', id: 'entryInput_' + i, onkeyup: 'eventManager.fire("fillinEntryChanged","' + i + '")'});
		entryInput.value = declaration.correctResponses[i].response;
		var removeButton = createElement(document, 'input', {type: 'button', id: 'entryButton_' + i, value: 'remove', onclick: 'eventManager.fire("fillinRemoveAllowable",["' + identifier + '","' + i + '"])'});
		allowableTD.appendChild(createBreak());
		allowableTD.appendChild(entryInput);
		if(i!=0){
			allowableTD.appendChild(removeButton);
		};
	};
	allowableTD.appendChild(createBreak());
	allowableTD.appendChild(addButton);
	return allowableTD;
};

/**
 * Returns the blank number associated with this identifier
 */
View.prototype.FillinNode.getLineNumber = function(identifier){
	return parseInt(identifier.substring(identifier.length - 1, identifier.length)) + 1;
};

/**
 * Changes the appropriate mapping when an allowable answer is modified
 */
View.prototype.FillinNode.entryChanged = function(index){
 	var entryElement = document.getElementById('entryInput_' + index);
 	var value = entryElement.value;
 	var identifier = this.getSelectedIdentifier();
 	var declaration = this.getDeclaration(identifier);
 	var interaction = this.getInteraction(identifier);
 	
 	var response = declaration.correctResponses[index];
 	if(response.response!=value){
 		response.response = value;
 		if(index==0){ //then this is also the most correctResponse and also needs to be updated
 			document.getElementById('input_' + this.getSelectedIndex()).value = value;
 			document.getElementById('questionInput').value = this.generateFullText();
 		};
 		
 		//extend the expected lines if necessary
 		if(interaction.expectedLength < value.length){
 			interaction.expectedLength = value.length + 2;
 		};
 		
 		/* fire source updated event */
		this.view.eventManager.fire('sourceUpdated');
 	};
 };

/**
 * Removes an allowable answer for the responseDeclaration given the
 * identifier and the index of the allowable input
 */
 View.prototype.FillinNode.removeAllowable = function(identifier, index){
 	var parent = document.getElementById('allowableTable').parentNode;
 	
 	this.getDeclaration(identifier).correctResponses.splice(index,1);
 	parent.removeChild(document.getElementById('allowableTable'));
 	parent.appendChild(this.generateAllowableAnswers(this.getSelectedIdentifier()));
 	
 	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
 };

/**
 * Adds a new allowable answer for the responseDeclaration associated
 * with the given identifier
 */
 View.prototype.FillinNode.addNewAllowable = function(identifier){
 	var parent = document.getElementById('allowableTable').parentNode;
 	
 	this.getDeclaration(identifier).correctResponses.push({response:'',value:'1'});
 	parent.removeChild(document.getElementById('allowableTable'));
 	parent.appendChild(this.generateAllowableAnswers(identifier));
 	
 	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
 };

/**
 * Given an identifier, returns the associated responseDeclaration element from the content
 */
View.prototype.FillinNode.getDeclaration = function(identifier){
 	for(var t=0;t<this.content.assessmentItem.responseDeclarations.length;t++){
 		if(this.content.assessmentItem.responseDeclarations[t].identifier==identifier){
 			return this.content.assessmentItem.responseDeclarations[t];
 		};
 	};
};
 
 /**
  * Given an identifier, returns the associated textEntryInteraction element from the content
  */
View.prototype.FillinNode.getInteraction = function(identifier){
  	for(var a=0;a<this.content.assessmentItem.interaction.length;a++){
		if(this.content.assessmentItem.interaction[a].responseIdentifier==identifier){
			return this.content.assessmentItem.interaction[a];
		};
	};
};

/**
 * Creates a new fillin based on the selected text in the questionInput text area
 */
View.prototype.FillinNode.createFillin = function(){
	var start = document.getElementById('questionInput').selectionStart;
	var end = document.getElementById('questionInput').selectionEnd;
	
	/* make sure there are no overlaps */
	if(this.overlaps(start, end, true)){
		this.view.notificationManager.notify('The existing selection overlaps with another fillin. Either edit the existing fillin or remove it before proceeding. Exiting...', 3);
		return;
	};
	
	/* make sure text is selected */
	if(start==end){
		this.view.notificationManager.notify('Please select some text before creating a fillin. Exiting...', 3);
		return;
	};
	
	/* determine the location to insert new responseDeclaration in content */
	var location = 0;
	for(var k=0;k<this.fillinIndexes.length;k++){
		var startEnd = this.fillinIndexes[k].split('|');
		location = k;
		if(start<startEnd[0]){
			break;
		};
		if(k==this.fillinIndexes.length - 1){
			location = k + 1;
		};
	};
	
	/* then update content - textentry interaction, responsedeclaration */
	var identifier = 'response_' + location;
	this.createResponseDeclaration(identifier, this.fullText.substring(start, end), location);
	this.createTextInteraction(identifier, start, end, this.fullText.substring(start, end));
	
	/* regenerate page */
	this.regeneratePage();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Creates a responseDeclaration given an identifier and a correctResponse
 */
View.prototype.FillinNode.createResponseDeclaration = function(identifier, correctResponse, location){
	var declarations = this.content.assessmentItem.responseDeclarations;
	var interactions = this.getTextEntryInteractions();
	
	//get nextNode to insert responseDeclaration in right place and change identifiers for 
	//existing declarations appropriately as well as their associated textEntryInteractions
	if(declarations.length>0 && location < declarations.length){
		for(var s=location;s<declarations.length;s++){
			declarations[s].identifier = 'response_' + (s + 1);
			interactions[s].responseIdentifier = 'response_' + (s + 1);
		};
	};
	
	/* create declaration with appropriate values */
	var declaration = {correctResponses:[{response:correctResponse, value:'1'}], identifier:identifier};
	this.content.assessmentItem.responseDeclarations.splice(location,0,declaration);
};

/**
 * Returns only those interactions that have the type textEntryInteraction
 */
View.prototype.FillinNode.getTextEntryInteractions = function(){
	var interactions = [];
	for(var y=0;y<this.content.assessmentItem.interaction.length;y++){
		if(this.content.assessmentItem.interaction[y].type=='textEntryInteraction'){
			interactions.push(this.content.assessmentItem.interaction[y]);
		};
	};
	
	return interactions;
};

/**
 * Given an identifier that is associated with a responseDeclaration, the start and end indexes
 * of the characters in the full text that were selected by the user and the actual text between
 * those points, creates a textEntryInteraction element in the xmlPage at the appropriate point
 * and modifies the existing elements to accomodate the changes.
 */
View.prototype.FillinNode.createTextInteraction = function(identifier, start, end, fillinText){
	var runningText = '';
	for(var x=0;x<this.content.assessmentItem.interaction.length;x++){
		if(this.content.assessmentItem.interaction[x].type=='htmltext'){
			/* grab current text */
			var currentText = this.spaceMaker(this.content.assessmentItem.interaction[x].text);
			/* if start and end is included - then we need to modify existing element and insert new element here */
			if((runningText + currentText).length > start){
				/* create new textinteraction */
				var interaction = {type:'textEntryInteraction', responseIdentifier:identifier, expectedLength:(end-start)+2};
				
				/* create htmltext to hold any of the text after the new textinteraction text */
				var remainder = {type:'htmltext',text:currentText.substring(end - runningText.length, (runningText + currentText).length)};
				
				/* set the current html text to hold the text before the new textentryinteraction item */
				this.content.assessmentItem.interaction[x].text = currentText.substring(0, start - runningText.length);
				
				/* insert right after this one */
				this.content.assessmentItem.interaction.splice(x+1,0,interaction,remainder);
				return;
			} else {
				runningText += currentText;
			};
		} else if(this.content.assessmentItem.interaction[x].type=='textEntryInteraction'){
			runningText += this.retrieveInteractionText(this.content.assessmentItem.interaction[x].responseIdentifier);
		};
	};
};

/**
 * if the provided start or end overlaps with an existing fillin
 * this function returns true, otherwise, returns false
 */
View.prototype.FillinNode.overlaps = function(start, end, create){
	var runningText = '';
	var difference = this.getDifference();
	var realStart;
	var realEnd;
	
	if(difference > 0){
		/* deleting text */
		realStart = start;
		realEnd = end + difference;
	} else {
		/* adding text */
		realStart = start + difference - 1;
		realEnd = end - 1;
	};
	
	if(difference==0 && !create){
		/* no change */
		return false;
	} else {
		/* changed look for overlap */
		for(var x=0;x<this.content.assessmentItem.interaction.length;x++){
			if(this.content.assessmentItem.interaction[x].type=='htmltext'){
				runningText += this.spaceMaker(this.content.assessmentItem.interaction[x].text);
			} else if(this.content.assessmentItem.interaction[x].type=='textEntryInteraction'){
				var currentText = this.retrieveInteractionText(this.content.assessmentItem.interaction[x].responseIdentifier);
				var fullLength = (runningText + currentText).length;
				if((runningText.length > realStart && runningText.length < realEnd) || (fullLength > realStart && runningText < realEnd)){
					return true;
				};
				if(realStart >= runningText.length && realStart < fullLength){
					return true;
				};
				runningText += currentText;
			};
		};
	};
	return false;
};

/**
 * Returns a string with all '&nbsp;' replaced with a space
 */
View.prototype.FillinNode.spaceMaker = function(text){
	return text.toString().replace(/&nbsp;/g, ' ');
};

/**
 * Determines what user input has changed for the fillin and updates the content accordingly.
 */
View.prototype.FillinNode.fillinTextUpdated = function(){
	if(this.validate()){
		var difference = this.getDifference();
		if(difference==0){
			/* do nothing, no changes */
			return;
		} else if(difference>0){
			/* handle text removed case */
			var start = document.getElementById('questionInput').selectionStart;
			var end = start + difference;
			var runningText = '';
			for(var x=0;x<this.content.assessmentItem.interaction.length;x++){
				if(this.content.assessmentItem.interaction[x].type=='htmltext'){
					var currentText = this.spaceMaker(this.content.assessmentItem.interaction[x].text);
					if(start <= (runningText + currentText).length){
						/* this is where the change was made, update text */
						if(end <= (runningText + currentText).length){
							/* entire deletion occurs within this node */
							this.content.assessmentItem.interaction[x].text = currentText.substring(0, start - runningText.length) + currentText.substring(end - runningText.length, currentText.length);
							this.charCount -= difference;
							
							/* regenerate full text */
							this.generateFullText();
							
							/* fire source updated event */
							this.view.eventManager.fire('sourceUpdated');
							return;
						} else {
							/* deletion goes beyond this node */
							this.content.assessmentItem.interaction[x].text = currentText.substring(0, start - runningText.length);
							runningText += currentText;
							start = runningText.length;
						};
					} else {
						/* keep looking, the change was not here */
						runningText += currentText;
					};
				} else if(this.content.assessmentItem.interaction[x].type=='textEntryInteraction'){ //should never be the case that changed text is here.
					runningText += this.retrieveInteractionText(this.content.assessmentItem.interaction[x].responseIdentifier);
				};
			};
			/* set character count variable */
			this.charCount -= difference;
			
			/* generate the full text */
			this.generateFullText();
			
			/* fire source updated event */
			this.view.eventManager.fire('sourceUpdated');
		} else {
			/* handle text added case */
			var end = document.getElementById('questionInput').selectionStart;
			var start = end + difference;
			var newText = document.getElementById('questionInput').value.substring(start, end); //get new chars
			var runningText = '';
			if(this.content.assessmentItem.interaction.length>0){
				for(var x=0;x<this.content.assessmentItem.interaction.length;x++){
					if(this.content.assessmentItem.interaction[x].type=='htmltext'){
						if(this.content.assessmentItem.interaction[x].text && this.content.assessmentItem.interaction[x].text != ''){
							var currentText = this.spaceMaker(this.content.assessmentItem.interaction[x].text);
							if(start <= (runningText + currentText).length){
								/* this is where the change was made, update text */
								this.content.assessmentItem.interaction[x].text = currentText.substring(0, start - runningText.length) + newText + currentText.substring(start - runningText.length, currentText.length);
								
								/* update character count variable */
								this.charCount += newText.length;
								
								/* generate full text */
								this.generateFullText();
								
								/* fire source updated event */
								this.view.eventManager.fire('sourceUpdated');
								return;
							} else {
								runningText += currentText;
							};
						} else {
							/* no data in prompt - if this is the location add it here */
							this.content.assessmentItem.interaction[x].text = newText;
							
							/* update character count variable */
							this.charCount += newText.length;
							
							/* generate full text */
							this.generateFullText();
							
							/* fire source updated event */
							this.view.eventManager.fire('sourceUpdated');
							return;
						};
					} else if(this.content.assessmentItem.interaction[x].type=='textEntryInteraction'){
						runningText += this.retrieveInteractionText(this.content.assessmentItem.interaction[x].responseIdentifier);
					};
				};
			} else {
				/* this is the first added */
				this.content.assessmentItem.interaction.push({type:'htmltext', text:newText});
				
				/* update character count variable */
				this.charCount += newText.length;
				
				/* generate full text */
				this.generateFullText();
				
				/* fire source updated event */
				this.view.eventManager.fire('sourceUpdated');
				return;
			};
		};
	} else {
		this.regeneratePage();
	};
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.FillinNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_fillin.js');
};
/**
 * Sets the MultipleChoiceNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.MultipleChoiceNode = {};

/**
 * Generates the authoring page for open response node types
 */
View.prototype.MultipleChoiceNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var promptText = document.createTextNode('Edit prompt: ');
	var answerText = document.createTextNode('Answers & Feedback:');
	var shuffleText = document.createTextNode('Shuffle answers before next try');
	var feedbackText = document.createTextNode('Feedback Options');
	
	pageDiv.appendChild(shuffleText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generateShuffle());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(feedbackText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generateFeedbackOptions());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generateNumChoiceOption());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generatePrompt());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(answerText);
	pageDiv.appendChild(this.generateAnswers());
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(createElement(document, 'input', {type: "button", id: "createNewButton", value: "Create New Answer", onclick: 'eventManager.fire("mcCreateNewChoice")'}));
	pageDiv.appendChild(createElement(document, 'input', {type: "button", value: "Reset Correct Answer selection", onclick: 'eventManager.fire("mcClearCorrectChoice")'}));
	
	parent.appendChild(pageDiv);
	
	/* generate drag and drop */
	this.generateDD();
};

/**
 * Generates shuffle element options for this page and sets option based on xml data
 */
View.prototype.MultipleChoiceNode.generateShuffle = function(){
	var shuffleDiv = createElement(document, 'div', {id: "shuffleDiv"});
	var shuffleTrue = createElement(document, 'input', {type: 'radio', name: 'shuffleOption', value: "true", onclick: 'eventManager.fire("mcShuffleChange","true")'});
	var shuffleFalse = createElement(document, 'input', {type: 'radio', name: 'shuffleOption', value: "false", onclick: 'eventManager.fire("mcShuffleChange","false")'});
	var trueText = createElement(document, 'label');
	trueText.innerHTML = 'shuffle choices';
	var falseText = createElement(document, 'label');
	falseText.innerHTML = 'do NOT shuffle choices';

	shuffleDiv.appendChild(shuffleTrue);
	shuffleDiv.appendChild(trueText);
	shuffleDiv.appendChild(createBreak());
	shuffleDiv.appendChild(shuffleFalse);
	shuffleDiv.appendChild(falseText);
	
	if(this.content.assessmentItem.interaction.shuffle){
		shuffleTrue.checked = true;
	} else {
		shuffleFalse.checked = true;
	};
	return shuffleDiv;
};

/**
 * Generates feedback element options and sets option based on xml data
 */
View.prototype.MultipleChoiceNode.generateFeedbackOptions = function(){
	var feedbackOptionDiv = createElement(document, 'div', {id: 'feedbackOptionsDiv'});
	var feedbackOptionTrue = createElement(document, 'input', {type: 'radio', name: 'feedbackOption', value: "true", onclick: 'eventManager.fire("mcFeedbackOptionChange","true")'});
	var feedbackOptionFalse = createElement(document, 'input', {type: 'radio', name: 'feedbackOption', value: "false", onclick: 'eventManager.fire("mcFeedbackOptionChange","false")'});
	var trueText = createElement(document, 'label');
	trueText.innerHTML = 'has inline feedback';
	var falseText = createElement(document, 'label');
	falseText.innerHTML = 'does NOT have inline feedback';
	
	feedbackOptionDiv.appendChild(feedbackOptionTrue);
	feedbackOptionDiv.appendChild(trueText);
	feedbackOptionDiv.appendChild(createBreak());
	feedbackOptionDiv.appendChild(feedbackOptionFalse);
	feedbackOptionDiv.appendChild(falseText);
	
	if(this.content.assessmentItem.interaction.hasInlineFeedback){
		feedbackOptionTrue.checked = true;
	} else {
		feedbackOptionFalse.checked = true;
	};
	return feedbackOptionDiv;
};

/**
 * Dynamically generates the elements used to
 * specify the number of correct choices for this
 * multiple choice
 */
View.prototype.MultipleChoiceNode.generateNumChoiceOption = function(){
	var numChoiceDiv = createElement(document, 'div', {id: 'numChoiceDiv'});
	var numChoiceText = document.createTextNode('Enter the number of answers the student is allowed to choose as correct. Enter \'0\' to allow the student to choose as many as they want.');
	var numChoiceInput = createElement(document, 'input', {type: "text", id: 'numChoiceInput', onchange: 'eventManager.fire("mcNumChoiceChanged")'});
	
	numChoiceInput.value = this.content.assessmentItem.interaction.maxChoices;
	
	numChoiceDiv.appendChild(numChoiceText);
	numChoiceDiv.appendChild(createBreak());
	numChoiceDiv.appendChild(numChoiceInput);
	return numChoiceDiv;
};

/**
 * Creates and returns a prompt element that contains the prompt this content
 */
View.prototype.MultipleChoiceNode.generatePrompt = function(){
	var promptInput = createElement(document, 'textarea', {id: 'promptText', name: 'promptText', cols: '85', rows: '8', wrap: 'hard', onkeyup: 'eventManager.fire("mcXmlUpdated")'});
	promptInput.value = this.content.assessmentItem.interaction.prompt;
	return promptInput;
};

/**
 * Returns an element that contains the possible answers to the prompt for
 * this content with the appopriate feedback element
 */
View.prototype.MultipleChoiceNode.generateAnswers = function(){
	var answerElements = [];
	var answerDiv = createElement(document, 'div', {id: 'answerDiv', name: 'answerDiv'});
	var answerUL = createElement(document, 'ul', {id: 'answerUL', 'class': 'container'});
	
	
	var answers = this.content.assessmentItem.interaction.choices;
	for(var h=0;h<answers.length;h++){
		var answerText = answers[h].text;
		var answerTextLabel = document.createTextNode('Answer: ');
		var feedbackTextLabel = document.createTextNode('Feedback:');
		feedback = this.generateFeedback(answers[h], h);
		options = this.generateOptions(h, answers.length);
		var answerLI = createElement(document, 'li', {id: 'answerLI_' + h, name: 'answerLI', 'class': 'draggable'});
		var answer = createElement(document, 'input', {type: 'text', name: "answerInput", value: answerText, wrap: 'hard', onkeyup: 'eventManager.fire("mcXmlUpdated")'});
		answerLI.appendChild(answerTextLabel);
		answerLI.appendChild(answer);
		answerLI.appendChild(createBreak());
		answerLI.appendChild(feedbackTextLabel);
		answerLI.appendChild(feedback);
		answerLI.appendChild(createBreak());
		answerLI.appendChild(options);
		answerUL.appendChild(answerLI);
	};
	
	answerDiv.appendChild(answerUL);
	return answerDiv;
};

/**
 * Generates a text input element with associated feedback as value for a choice object
 * when inline feedback exists and is specified for the entire MC question, otherwise
 * feedback is not available
 */
View.prototype.MultipleChoiceNode.generateFeedback = function(choice, index){
	if(this.content.assessmentItem.interaction.hasInlineFeedback){
		var feedbackEl = createElement(document, 'input', {type: 'text', wrap: 'hard', id: 'feedbackInput_' + index, name: "feedbackInput", onkeyup: 'eventManager.fire("mcXmlUpdated")'});
		feedbackEl.value = choice.feedback;
	} else {
		var feedbackEl = createElement(document, 'div', {id: 'feedbackInput_' + index, name: 'feedbackInput_' + index});
	};
	return feedbackEl;
};

/**
 * Generates and returns an option element that contains all the available options
 * for the given choice.
 */
View.prototype.MultipleChoiceNode.generateOptions = function(index, length){
	var options = createElement(document, 'div');
	
	if(this.isCorrect(this.content.assessmentItem.interaction.choices[index].identifier)){
		var outStr = '<input CHECKED type="checkbox" name="correctRadio" id="radio_' + index + '" value="' + index + '" onclick="eventManager.fire(\'mcCorrectChoiceChange\',\'' + index + '\')">This is a correct Choice ';
	} else {
		var outStr = '<input type="checkbox" name="correctRadio" id="radio_' + index + '" value="' + index + '" onclick="eventManager.fire(\'mcCorrectChoiceChange\',\'' + index + '\')">This is a correct Choice ';
	}
	
	outStr = outStr + '<a href="#" onclick="eventManager.fire(\'mcRemoveChoice\',\'' + index + '\')">Remove Choice</a>';
	
	options.innerHTML = outStr;
	return options;
};

/**
 * Returns true if the choice with the given id is a correct response, returns false otherwise.
 */
View.prototype.MultipleChoiceNode.isCorrect = function(id){
	for(var h=0;h<this.content.assessmentItem.responseDeclaration.correctResponse.length;h++){
		if(this.content.assessmentItem.responseDeclaration.correctResponse[h]==id){
			return true;
		};
	};
	return false;
};

/**
 * Generates answers in xmlPage based on the choice elements on this page and the corresponding correctResponse values
 */
View.prototype.MultipleChoiceNode.updateAnswer = function(parent){
	var answers = document.getElementsByName('answerLI');
	this.content.assessmentItem.interaction.choices = [];
	this.content.assessmentItem.responseDeclaration.correctResponse = [];
	
	for(var d=0;d<answers.length;d++){
		/* create new choice object, setting values for the fixed, identifier and text fields */
		var choice = {feedback:'', fixed:true, identifier:'choice ' + (d + 1), text: answers[d].childNodes[1].value};
		
		/* set value for feedback field */
		if(answers[d].childNodes[4]!=null && answers[d].childNodes[4].getAttribute('type')=='text'){
			choice.feedback = answers[d].childNodes[4].value;
		};
		
		/* set the correct response if this choice has been chosen as the correct response */
		if(this.content.assessmentItem.interaction.hasInlineFeedback){
			var checked = answers[d].getElementsByTagName('input')[2].checked;
		} else {
			var checked = answers[d].getElementsByTagName('input')[1].checked;
		};
		
		if(checked){
			this.addCorrectChoice(choice.identifier);
		};
		
		this.content.assessmentItem.interaction.choices.push(choice);
	};
};

/**
 * Removes the choice of the given index
 */
View.prototype.MultipleChoiceNode.removeChoice = function(index){
	/* remove this choice as correct response if it was */
	this.removeCorrectChoice(this.content.assessmentItem.interaction.choices[index].identifier);
	
	/* remove this choice */
	this.content.assessmentItem.interaction.choices.splice(index, 1);
	
	/* regenerate the answers and fire updated event */
	this.regenerateAnswers();
	this.view.eventManager.fire("mcXmlUpdated");
};

/**
 * Creates a new choice object in the content and updates page
 */
View.prototype.MultipleChoiceNode.createNewChoice = function(){
	var choice = {feedback:'Enter feedback',fixed:true,identifier:'choice ' + (this.content.assessmentItem.interaction.choices.length + 1),text:''};
	
	this.content.assessmentItem.interaction.choices.push(choice);
	
	this.regenerateAnswers();
	
	this.view.eventManager.fire("mcXmlUpdated");
};

/**
 * Regenerates the html answer elements based on the content and regenerates the drag and drop
 */
View.prototype.MultipleChoiceNode.regenerateAnswers = function(){
	var parent = document.getElementById('dynamicPage');
	parent.removeChild(document.getElementById('answerDiv'));
	var answer = this.generateAnswers();
	var nextNode = document.getElementById('createNewButton');
	parent.insertBefore(answer, nextNode);
	
	this.generateDD();
};

/**
 * Updates the content with the specified shuffle value and refreshes page
 */
View.prototype.MultipleChoiceNode.shuffleChange = function(val){
	if(val=='true'){
		this.content.assessmentItem.interaction.shuffle = true;
	} else {
		this.content.assessmentItem.interaction.shuffle = false;
	};
	
	this.view.eventManager.fire("mcXmlUpdated");
};

/**
 * Updates the content with the specified correct choice and refreshes page
 */
View.prototype.MultipleChoiceNode.correctChoiceChange = function(index){
	if(document.getElementById('radio_' + index).checked){
		this.addCorrectChoice(this.content.assessmentItem.interaction.choices[index].identifier);
	} else {
		this.removeCorrectChoice(this.content.assessmentItem.interaction.choices[index].identifier);
	};
	
	this.view.eventManager.fire("mcXmlUpdated");
};

/**
 * Adds the given identifier to the correct choices if it does not already exist
 */
View.prototype.MultipleChoiceNode.addCorrectChoice = function(identifier){
	var ndx = this.content.assessmentItem.responseDeclaration.correctResponse.indexOf(identifier);
	if(ndx==-1){
		this.content.assessmentItem.responseDeclaration.correctResponse.push(identifier);
	};
};

/**
 * Removes the given identifier from the correct choices if it exists
 */
View.prototype.MultipleChoiceNode.removeCorrectChoice = function(identifier){
	var ndx = this.content.assessmentItem.responseDeclaration.correctResponse.indexOf(identifier);
	if(ndx!=-1){
		this.content.assessmentItem.responseDeclaration.correctResponse.splice(ndx,1);
	};
};

/**
 * Updates the content with the specified number of correct choices and refreshes page
 */
View.prototype.MultipleChoiceNode.numChoiceChanged = function(){
	this.content.assessmentItem.interaction.maxChoices = document.getElementById('numChoiceInput').value;
	
	this.view.eventManager.fire("mcXmlUpdated");
};

/**
 * Removes check from all correct choice radio buttons and updates
 * xmlPage so that there is no correct choice
 */
View.prototype.MultipleChoiceNode.clearCorrectChoice = function(){
	var radios = document.getElementsByName('correctRadio');
	for(var p=0;p<radios.length;p++){
		radios[p].checked = false;
	};
	
	this.content.assessmentItem.responseDeclaration.correctResponse = [];
	
	this.view.eventManager.fire("mcXmlUpdated");
};

/**
 * Returns true iff all of the choice fields are not blank, otherwise, returns false
 */
View.prototype.MultipleChoiceNode.validate = function(){
	var choices = document.getElementsByName('answerInput');
	var empty = false;
	
	for(var c=0;c<choices.length;c++){
		if(choices[c].value==null || choices[c].value==""){
			empty = true;
		};
	};
	
	if(empty){
		this.view.notificationManager.notify("No choice fields are allowed to be empty or null. Exiting...", 3);
		return false;
	};
	return true;
};

/**
 * Updates the has inline feedback option in the content and refreshes the html
 */
View.prototype.MultipleChoiceNode.feedbackOptionChange = function(val){
	if(val=='true'){
		this.content.assessmentItem.interaction.hasInlineFeedback = true;
	} else {
		this.content.assessmentItem.interaction.hasInlineFeedback = false;
	};
	
	this.regenerateAnswers();
	this.view.eventManager.fire("mcXmlUpdated");
};

/**
 * Called on several keyup events, regenerates necessary elements and fires source updated event
 */
View.prototype.MultipleChoiceNode.xmlUpdated = function(){
	/* update prompt and answers */
	this.content.assessmentItem.interaction.prompt = document.getElementById('promptText').value;
	this.updateAnswer();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.MultipleChoiceNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};


/*****											    *****|
 * The following functions are used by YUI for the drag *|
 * and drop stuff on this page						    *|
 *****											    *****/
View.prototype.MultipleChoiceNode.generateDD = function(){
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {
	    //Listen for all drop:over events
	    Y.DD.DDM.on('drop:over', function(e) {
	        //Get a reference to out drag and drop nodes
	        var drag = e.drag.get('node'),
	            drop = e.drop.get('node');
	        
	        //Are we dropping on a li node?
	        if (drop.get('tagName').toLowerCase() === 'li') {
	            //Are we not going up?
	            if (!goingUp) {
	                drop = drop.get('nextSibling');
	            }
	            //Add the node to this list
	            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
	            //Resize this nodes shim, so we can drop on it later.
	            e.drop.sizeShim();
	        }
	    });
	    //Listen for all drag:drag events
	    Y.DD.DDM.on('drag:drag', function(e) {
	        //Get the last y point
	        var y = e.target.lastXY[1];
	        //is it greater than the lastY var?
	        if (y < lastY) {
	            //We are going up
	            goingUp = true;
	        } else {
	            //We are going down..
	            goingUp = false;
	        }
	        //Cache for next check
	        lastY = y;
	    });
	    //Listen for all drag:start events
	    Y.DD.DDM.on('drag:start', function(e) {
	        //Get our drag object
	        var drag = e.target;
	        //Set some styles here
	        drag.get('node').setStyle('opacity', '.25');
	        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
	        drag.get('dragNode').setStyles({
	            opacity: '.5',
	            borderColor: drag.get('node').getStyle('borderColor'),
	            backgroundColor: drag.get('node').getStyle('backgroundColor')
	        });
	    });
	    //Listen for a drag:end events
	    Y.DD.DDM.on('drag:end', function(e) {
	        var drag = e.target;
	        //Put out styles back
	        drag.get('node').setStyles({
	            visibility: '',
	            opacity: '1'
	        });
	        //authoringTool.onNodeDropped(drag);
	    });
	    //Listen for all drag:drophit events
	    Y.DD.DDM.on('drag:drophit', function(e) {
	        var drop = e.drop.get('node'),
	            drag = e.drag.get('node');
	
	        //if we are not on an li, we must have been dropped on a ul
	        if (drop.get('tagName').toLowerCase() !== 'li') {
	            if (!drop.contains(drag)) {
	                drop.appendChild(drag);
	            }
	            eventManager.fire("mcXmlUpdated");
	        }
	    });
	    
	    //Static Vars
	    var goingUp = false, lastY = 0;
	
	    //Get the list of li's with class draggable in the lists and make them draggable
	    var lis = Y.Node.all('#answerDiv ul li.draggable');
	    if (lis != null) {
	    	lis.each(function(v, k) {
	    		var dd = new Y.DD.Drag({
	    			node: v,
	    			proxy: true,
	    			moveOnEnd: false,
	    			constrain2node: '#answerDiv',
	    			target: {
	    			padding: '0 0 0 20'
	    		}
	    		});
	    	});
	    }
	
	    //Create simple targets for the lists..
	    var uls = Y.Node.all('#answerDiv ul');    
	    uls.each(function(v, k) {
	        var tar = new Y.DD.Drop({
	            node: v
	        });
	    });
	});
};
/*****												******|
 * End functions used by YUI for the drag and drop stuff *|
 *****												******/

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_multiplechoice.js');
};
/**
 * Sets the MySystemNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.MySystemNode = {};

/**
 * Attempts to retrieve the mod file if it exists and sets initial variables
 */
View.prototype.MySystemNode.generatePage = function(view){
	this.view = view;
	this.content = createContent(this.view.getProject().makeUrl(this.view.activeContent.getContentJSON().src));
	this.view.activeNode.baseHtmlContent = this.content;
	this.modContent = createContent(this.content.getContentUrl() + '_module.json');
	this.modFileExists = true;
	this.mods = this.modContent.getContentJSON();
	
	if(!this.mods){
		this.modFileExists = false;
		this.mods = [];
	};
	
	this.buildPage();
};

/**
 * Builds the html elements needed to author a my system node
 */
View.prototype.MySystemNode.buildPage = function(){
	var parent = document.getElementById('dynamicParent');
	
	/* remove any old elements */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new elements */
	var pageDiv = createElement(document, 'div', {id: 'dynamicPage', style:'width:100%;height:100%'});
	var mainDiv = createElement(document, 'div', {id: 'mainDiv'});
	var promptDiv = createElement(document, 'div', {id: 'promptDiv'});
	var modulesDiv = createElement(document, 'div', {id: 'modulesDiv'});
	var instructionsText = document.createTextNode("When entering image filenames, make sure to use the asset uploader on the main authoring page to upload your images and just use image name.");
	
	/* append elements */
	parent.appendChild(pageDiv);
	pageDiv.appendChild(mainDiv);
	mainDiv.appendChild(instructionsText);
	mainDiv.appendChild(createBreak());
	mainDiv.appendChild(promptDiv);
	mainDiv.appendChild(createBreak());
	mainDiv.appendChild(modulesDiv);
	
	this.generatePrompt();
	this.generateModules();
};

/**
 * Generates the html prompt elements
 */
View.prototype.MySystemNode.generatePrompt = function(){
	var rawPrompt = this.content.getContentString().match(/<authoredPrompt>[\s|\S]*<\/authoredPrompt>/);
	var prompt;
	
	if(rawPrompt){
		prompt = rawPrompt[0].substring(16, rawPrompt[0].length - 17);
	};
	
	var parent = document.getElementById('promptDiv');
	
	var promptText = document.createTextNode("Enter instructions -- text or html -- here.");
	var promptArea = createElement(document, 'textarea', {id: 'promptText', cols: '90', rows: '5', onchange: 'eventManager.fire("mysystemPromptChanged")'});

	parent.appendChild(createBreak());
	parent.appendChild(promptText);
	parent.appendChild(createBreak());
	parent.appendChild(promptArea);
	parent.appendChild(createBreak());
	
	if(prompt){
		promptArea.value = prompt;
	};
};

/**
 * Updates the html with the user entered prompt
 */
View.prototype.MySystemNode.promptChanged = function(){
	this.content.setContent(this.content.getContentString().replace(/<authoredPrompt>[\s\S]*<\/authoredPrompt>/, "<authoredPrompt>" + document.getElementById('promptText').value + "</authoredPrompt>"));
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Generates the modules creation elements
 */
View.prototype.MySystemNode.generateModules = function(){
	var parent = document.getElementById('modulesDiv');
	
	//remove old elements first
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	parent.appendChild(createBreak());
	
	if(this.mods.length>0){
		var modsText = document.createTextNode("Existing Modules");
	} else {
		var modsText = document.createTextNode("Create Modules");
	};
	
	parent.appendChild(modsText);
	parent.appendChild(createBreak());
	
	//create current mod elements
	for(var a=0;a<this.mods.length;a++){
		var modDiv = createElement(document, 'div', {id: 'modDiv_' + a});
		var modText = document.createTextNode('Module');
		var nameText = document.createTextNode("Name: ");
		var iconText = document.createTextNode("Icon: ");
		var imageText = document.createTextNode("Image: ");
		var nameInput = createElement(document, 'input', {id: 'nameInput_' + a, type: 'text', value: this.mods[a].name, onchange: 'eventManager.fire("mysystemFieldUpdated",["name","' + a + '"])'});
		var iconInput = createElement(document, 'input', {id: 'iconInput_' + a, type: 'text', value: this.getStripped(this.mods[a].icon), onchange: 'eventManager.fire("mysystemFieldUpdated",["icon","' + a + '"])'});
		var imageInput = createElement(document, 'input', {id: 'imageInput_' + a, type: 'text', value: this.getStripped(this.mods[a].image), onchange: 'eventManager.fire("mysystemFieldUpdated",["image","' + a + '"])'});
		var removeButt = createElement(document, 'input', {type: 'button', id: 'removeButt', value: 'remove module', onclick: 'eventManager.fire("mysystemRemoveMod","' + a + '")'});
		
		parent.appendChild(modDiv);
		modDiv.appendChild(modText);
		modDiv.appendChild(createBreak());
		modDiv.appendChild(nameText);
		modDiv.appendChild(nameInput);
		modDiv.appendChild(createBreak());
		modDiv.appendChild(iconText);
		modDiv.appendChild(iconInput);
		modDiv.appendChild(createBreak());
		modDiv.appendChild(imageText);
		modDiv.appendChild(imageInput);
		modDiv.appendChild(createBreak());
		modDiv.appendChild(removeButt);
		modDiv.appendChild(createBreak());
		modDiv.appendChild(createBreak());
	};
	
	//create buttons to create new modules
	var createButt = createElement(document, 'input', {type:'button', value:'add new mod', onclick:'eventManager.fire("mysystemAddNew")'});
	parent.appendChild(createButt);
};

/**
 * Strips './assets/' from the given @param val and returns the string
 */
View.prototype.MySystemNode.getStripped = function(val){
	return val.substring(9, val.length);
}

/**
 * Updates a module's, at the given index, filed of the given name
 * with the given value.
 */
View.prototype.MySystemNode.fieldUpdated = function(name,ndx){
	var val = document.getElementById(name + 'Input_' + ndx).value;
	if(name=='name'){
		this.mods[ndx][name] = val;
	} else {
		this.mods[ndx][name] = './assets/' + val;
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Removes a module from the modules
 */
View.prototype.MySystemNode.removeMod = function(ndx){
	this.mods.splice(ndx, 1);
	this.generateModules();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Creates a new dummy module object and adds it to the mods array
 */
View.prototype.MySystemNode.addNew = function(){
	this.mods.push({name:'', icon:'', image:'', xtype:'MySystemContainer', etype:'source', fields:{efficiency:'1'}});
	this.generateModules();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Saves the mod content to the server
 */
View.prototype.MySystemNode.save = function(close){
	var successHtml = function(t,x,o){
		o.notificationManager.notify('Updated html content on server', 3);
	};
	
	var failureHtml = function(t,x,o){
		o.notificationManager.notify('Failed update of html content on server', 3);
	};
	
	this.view.connectionManager.request('POST', 3, 'filemanager.html', {command:'updateFile', param1:this.view.utils.getContentPath(this.view.authoringBaseUrl,this.view.getProject().getContentBase()), param2:this.view.activeNode.baseHtmlContent.getFilename(this.view.getProject().getContentBase()), param3:encodeURIComponent(this.content.getContentString())}, successHtml, this.view, failureHtml);
	
	/* success callback */
	var success = function(txt,xml,o){
		o.stepSaved = true;
		o.notificationManager.notify('Updated module file on server', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [true]);
		};
	};
	
	/* failure callback */
	var failure = function(txt,xml,o){
		o.notificationManager.notify('Failed save of module file to server.', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [false]);
		};
	};
	
	if(this.modFileExists){
		this.view.connectionManager.request('POST', 3, 'filemanager.html', {command:'updateFile', param1:this.view.utils.getContentPath(this.view.authoringBaseUrl,this.view.getProject().getContentBase()), param2:this.modContent.getFilename(this.view.getProject().getContentBase()), param3:yui.JSON.stringify(this.mods)}, success, this.view, failure);
	} else {
		this.view.connectionManager.request('POST', 3, 'filemanager.html', {command:'createFile', param1:this.view.utils.getContentPath(this.view.authoringBaseUrl,this.modContent.getContentUrl()), param2:yui.JSON.stringify(this.mods)}, success, this.view, failure);
	};
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.MySystemNode.updateContent = function(){
	/* update content object */
	this.view.activeNode.baseHtmlContent.setContent(this.content.getContentString());
};

/* used to notify scriptloader that this script has finished loading */
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_mysystem.js');
};
/**
 * Sets the MatchSequenceNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.MatchSequenceNode = {};

/**
 * Generates the authoring page for matchsequence node types
 */
View.prototype.MatchSequenceNode.generatePage = function(view){
	this.view = view;
	this.content = this.view.activeContent.getContentJSON();
	this.feedbackMode = false;
	this.currentChoiceId;
	this.currentContainerId;
	
	this.buildPage();
};

/**
 * Dynamically generates the page based on the current state of xmlPage
 */
View.prototype.MatchSequenceNode.buildPage = function(){
	var parent = document.getElementById('dynamicParent');
	
	//wipe out old elements and variables
	parent.removeChild(document.getElementById('dynamicPage'));
	
	//create new elements
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var prompt = createElement(document, 'textarea', {id: 'promptArea', rows: '10', cols: '75', wrap: 'hard', onchange: 'eventManager.fire("msUpdatePrompt")'});
	var promptText = document.createTextNode('Edit prompt:');
	var orderingDiv = createElement(document, 'div', {id: 'orderingOptions'});
	var order = createElement(document, 'input', {type: 'radio', id: 'ordered', name: 'ordered', value: true, onclick: 'eventManager.fire("msUpdateOrdered","true")'});
	var notOrder = createElement(document, 'input', {type: 'radio', id: 'notOrdered', name: 'ordered', value: false, onclick: 'eventManager.fire("msUpdateOrdered","false")'});
	var orderedText = document.createTextNode('Select ordering option:');
	var orderText = document.createTextNode('Choices have a specific sequential order per Target');
	var notOrderText = document.createTextNode('Choices are unordered per Target');
	var addNewButton = createElement(document, 'input', {type: 'button', id: 'addContainerButton', onclick: 'eventManager.fire("msAddContainer")', value: 'Add Container'});
 	var createNew = createElement(document, 'input', {type: 'button', value: 'Create New Choice', onclick: 'eventManager.fire("msAddChoice")'});
	var removeChoice = createElement(document, 'input', {type: 'button', value: 'Remove Choice', onclick: 'eventManager.fire("msRemoveChoice")'});
	var removeContainerButton = createElement(document, 'input', {type: 'button', id: 'removeContainerButton', onclick: 'eventManager.fire("msRemoveContainer")', value: 'Remove Container'});
	var editFeedback = createElement(document, 'input', {type: 'button', value: 'Edit/Create Feedback', onclick: 'eventManager.fire("msEditFeedback")'});
	var shuffle = createElement(document, 'input', {type: 'checkbox', id: 'shuffled', onclick: 'eventManager.fire("msShuffleChanged")'});
	var shuffleText = document.createTextNode('Shuffle Choices');
	
	shuffle.checked = this.getShuffle();
	
	if(this.getOrdered()){
		order.checked = true;
	} else {
		notOrder.checked = true;
	};
	
	prompt.value = this.getPrompt();
	
	orderingDiv.appendChild(orderedText);
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(order);
	orderingDiv.appendChild(orderText);
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(notOrder);
	orderingDiv.appendChild(notOrderText);
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(createBreak());
	orderingDiv.appendChild(shuffle);
	orderingDiv.appendChild(shuffleText);
	orderingDiv.appendChild(createBreak());
	
	pageDiv.appendChild(promptText);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(prompt);
	pageDiv.appendChild(orderingDiv);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(addNewButton);
	pageDiv.appendChild(removeContainerButton);
	pageDiv.appendChild(createSpace());
	pageDiv.appendChild(createSpace());
	pageDiv.appendChild(createSpace());
	pageDiv.appendChild(createNew);
	pageDiv.appendChild(removeChoice);
	pageDiv.appendChild(editFeedback);
	pageDiv.appendChild(createBreak());
	pageDiv.appendChild(this.generateFeedback());
	pageDiv.appendChild(this.generateContainerTable());
	
	parent.appendChild(pageDiv);
	
	this.generateFeedbackTable();
	this.generateContainers();
	
	if(this.feedbackMode){
		showElement('feedbackDiv');
		hideElement('containerTable');
	} else {
		showElement('containerTable');
		hideElement('feedbackDiv');
	};
};

/**
 * Generates the hidden feedback element
 */
View.prototype.MatchSequenceNode.generateFeedback = function(){
	var feedbackDiv = createElement(document, 'div', {id:'feedbackDiv'});
	var instructions = document.createTextNode('Click any colored field to add/edit its text. Click "Hide Feedback" when finished.');
	var hideFeedbackButt = createElement(document, 'input', {type:'button', value:'Hide Feedback', onclick:'eventManager.fire("msHideFeedback")'});
	var feedbackEditDiv = createElement(document, 'div', {id:'feedbackEditDiv', style:'display:none;'});
	var feedbackEditInput = createElement(document, 'textarea', {id:'feedbackEditInput', cols:'85', rows:'10'});
	var feedbackEditSave = createElement(document,'input',{type:'button', value:'Save', onclick:'eventManager.fire("msSaveFeedback")'});
	
	feedbackDiv.appendChild(createBreak());
	feedbackDiv.appendChild(instructions);
	feedbackDiv.appendChild(createBreak());
	feedbackDiv.appendChild(hideFeedbackButt);
	feedbackDiv.appendChild(createBreak());
	feedbackDiv.appendChild(feedbackEditDiv);
	feedbackEditDiv.appendChild(feedbackEditInput);
	feedbackEditDiv.appendChild(createBreak());
	feedbackEditDiv.appendChild(feedbackEditSave);
	feedbackDiv.appendChild(createBreak());
	feedbackDiv.appendChild(createBreak());
	
	return feedbackDiv;
};

/**
 * Generates a table of choices vs. containters which will allow for editing
 * creating feedback that choice in that container
 */
View.prototype.MatchSequenceNode.generateFeedbackTable = function(){
	var parent = document.getElementById('feedbackDiv');
 	var old = document.getElementById('containerChoiceTable');
 	
 	//wipe out old
 	if(old){
 		parent.removeChild(old);
 	};
 	
 	//create new
	var choices = this.getChoices();
	var containers = this.getFields();
 	var table = createElement(document, 'table', {id: 'containerChoiceTable'});
 	var headerRow = createElement(document, 'tr', {id: 'headerRow'});
 	var headerLabel = createElement(document, 'td', {id: 'headerLabel'});
 	var containerLabelDiv = createElement(document, 'div', {id: 'containerLabelDiv', align: 'right'});
 	var choiceLabelDiv = createElement(document, 'div', {id: 'choiceLabelDiv'});
				 	
 	containerLabelDiv.innerHTML = 'Containers:';
 	choiceLabelDiv.innerHTML = 'Choices';
 	
 	headerLabel.appendChild(containerLabelDiv);
 	headerLabel.appendChild(choiceLabelDiv);
 	headerRow.appendChild(headerLabel);
 	for(var a=0;a<containers.length;a++){
 		var containerName = createElement(document, 'td', {id: 'containerName_' + containers[a].identifier});
 		containerName.innerHTML = containers[a].name;
 		headerRow.appendChild(containerName);
 	};
 	
 	table.appendChild(headerRow);
 	
 	for(var b=0;b<choices.length;b++){
 		var row = createElement(document, 'tr', {id: 'row_' + b});
 		var choiceLabelTD = createElement(document, 'td', {id: 'choiceLabelTD_' + b});
 		
 		choiceLabelTD.innerHTML = choices[b].value;
 		row.appendChild(choiceLabelTD);
 		for(var c=0;c<containers.length;c++){
 			var choiceId = choices[b].identifier;
 			var containerId = containers[c].identifier;
 			var val = this.getValueByChoiceAndFieldIdentifiers(choiceId, containerId);
 			var feedbackTD = createElement(document, 'td', {id: 'cell_' + b + '_' + c, onclick: 'eventManager.fire("msEditIndividualFeedback",["' + choiceId + '","' + containerId + '"])'});
 			
 			if(val){ //feedback exists
 				var html;
 				if(val.isCorrect){
 					feedbackTD.setAttribute('bgcolor', '#99FFCC');
 					html = val.feedback;
 				} else {
 					feedbackTD.setAttribute('bgcolor', '#FF9999');
 					html = val.feedback;
 				};
 				feedbackTD.innerHTML = html;
 			} else { //feedback not there
 				feedbackTD.setAttribute('bgcolor', '#FF9999');
 				feedbackTD.innerHTML = 'Create Feedback';
 			};
 			
 			row.appendChild(feedbackTD);
 		};
 		
 		table.appendChild(row);
 	};
 	
 	parent.appendChild(table);
};

/**
 * Hides the edit feedback html elements and shows the container table.
 */
View.prototype.MatchSequenceNode.hideFeedback = function(){
	this.feedbackMode = false;
	showElement('containerTable');
	hideElement('feedbackDiv');
};

/**
 * Sets the clicked on choice in the edit feedback input field and shows that field
 */
View.prototype.MatchSequenceNode.editIndividualFeedback = function(choiceId,containerId){
	this.currentChoiceId = choiceId;
	this.currentContainerId = containerId;
	
	document.getElementById('feedbackEditInput').value = this.getValueByChoiceAndFieldIdentifiers(choiceId,containerId).feedback;
	showElement('feedbackEditDiv');
};

/**
 * Saves the user entered feedback and refreshes the table
 */
View.prototype.MatchSequenceNode.saveFeedback = function(){
	var feedback = this.getValueByChoiceAndFieldIdentifiers(this.currentChoiceId, this.currentContainerId);
 	
 	if(!feedback){
 		this.createNewFeedback(this.currentChoiceId, this.currentContainerId);
 		feedback = this.getValueByChoiceAndFieldIdentifiers(this.currentChoiceId, this.currentContainerId);
 	};
 	this.updateFeedback(this.currentChoiceId, this.currentContainerId, document.getElementById('feedbackEditInput').value);
 	
 	this.generateFeedbackTable();
 	document.getElementById('feedbackEditInput').value = '';
 	hideElement('feedbackEditDiv');
 	
 	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Returns a table element for containers and generates
 * the row element to which existing containers will be appended
 */
View.prototype.MatchSequenceNode.generateContainerTable = function(){
	var containerTable = createElement(document, 'table', {id: 'containerTable'});
	var row = createElement(document, 'tr', {id: 'containerRow'});
	
	containerTable.appendChild(row);
	return containerTable;
};

/**
 * Removes previous containerSelect element (if exists) and
 * generates a new one based on the gapMultiple elements
 * defined in xmlPage
 */
View.prototype.MatchSequenceNode.generateContainers = function(){
 	var parent = document.getElementById('containerTable');
 	var fields = this.getFields();
 	
 	//remove old tr elements
 	var rows = document.getElementsByName('containerRow');
 	for(var v=0;v<rows.length;v++){
 		parent.removeChild(rows[v]);
 	};
 	
 	for(var u=0;u<fields.length;u++){
 		var row = createElement(document, 'tr', {id: 'containerRow', name: 'containerRow'});
 		row.appendChild(this.generateContainer(fields[u], u));
 		parent.appendChild(row);
 	};
 };

/**
 * Given a field object from the content, generates and returns
 * a TD Element based on the container information
 */
View.prototype.MatchSequenceNode.generateContainer = function(field,index){
	var identifier = field.identifier;
	var containerTD = createElement(document, 'td', {id: 'containerTD_' + identifier});
	var radioContainer = createElement(document, 'input', {type: 'radio', name: 'radioContainer', id: 'radioContainer_' + identifier, onfocus: 'eventManager.fire("msContainerSelected","radioContainer_' + identifier + '")', value: identifier});
	var textContainer = createElement(document, 'input', {type: 'text', id: 'textContainer_' + identifier, onfocus: 'eventManager.fire("msContainerSelected","radioContainer_' + identifier + '")', onchange: 'eventManager.fire("msContainerTextUpdated","' + identifier + '")'});
	var choiceDiv = createElement(document, 'div', {id: 'choiceDiv_' + identifier});
	var titleText = document.createTextNode('Title: ');
	var targetText = document.createTextNode('Target Box ' + index);
	
	textContainer.value = field.name;
	
	containerTD.appendChild(radioContainer);
	containerTD.appendChild(targetText);
	containerTD.appendChild(createBreak());
	containerTD.appendChild(titleText);
	containerTD.appendChild(textContainer);
	containerTD.appendChild(choiceDiv);
	
	this.generateChoices(choiceDiv, identifier);
	
	return containerTD;
};

/**
 * Given the parent element and gapMultiple identifier
 * generates and appends the associated choices table
 */
View.prototype.MatchSequenceNode.generateChoices = function(parent,fieldIdentifier){
	var choiceTable = createElement(document, 'table', {id: 'choiceTable_' + fieldIdentifier, border: '1'});
	var choices = this.getChoicesByContainerIdentifier(fieldIdentifier);
	
	for(var e=0;e<choices.length;e++){
		choiceTable.appendChild(this.generateChoice(choices[e], fieldIdentifier));
	};
	
	parent.appendChild(choiceTable);
	parent.appendChild(createBreak());
};

/**
 * Given a choice (gapText) and its associated gapIdentifier, generates
 * and returns a table row with the choice Text
 */
View.prototype.MatchSequenceNode.generateChoice = function(choice,fieldIdentifier){
	var identifier = choice.identifier;
	var row = createElement(document, 'tr', {id: 'choiceRow_'+ identifier});
	var td = createElement(document, 'td', {id: 'choiceTD_' + identifier});
	var radioChoice = createElement(document, 'input', {type: 'radio', name: 'radioChoice_' + fieldIdentifier, onfocus: 'eventManager.fire("msChoiceSelected",["' + identifier + '", "' + fieldIdentifier + '"])', value: identifier});
	var textChoice = createElement(document, 'input', {type: 'text', id: 'textChoice_' + identifier, onfocus: 'eventManager.fire("msChoiceSelected",["' + identifier + '", "' + fieldIdentifier + '"])', onchange: 'eventManager.fire("msChoiceTextUpdated","' + identifier + '")'});
	var ordered = createElement(document, 'input', {type: 'text', size: '1', id: 'orderChoice_' + identifier, onfocus: 'eventManager.fire("msChoiceSelected",["' + identifier + '", "' + fieldIdentifier + '"])', onkeyup: 'eventManager.fire("msOrderUpdated","' + identifier + '")'});
	var textOrder = document.createTextNode('order pos:');
	
	textChoice.value = choice.value;
	
	td.appendChild(radioChoice);
	td.appendChild(textChoice);
	
	if(this.getOrdered()){
		ordered.value = this.getOrderPositionByChoiceIdentifier(identifier);
		td.appendChild(textOrder);
		td.appendChild(ordered);
	};
	
	row.appendChild(td);
	return row;
};


/**
 * Returns the prompt element in the content
 */
View.prototype.MatchSequenceNode.getPrompt = function(){
	return this.content.assessmentItem.interaction.prompt;
};

/**
 * Updates the prompt element in xmlPage with the text
 * in prompt textarea box
 */
View.prototype.MatchSequenceNode.updatePrompt = function(){
	this.content.assessmentItem.interaction.prompt = document.getElementById('promptArea').value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Returns the value of the order element in xmlPage
 */
View.prototype.MatchSequenceNode.getOrdered = function(){
	return this.content.assessmentItem.interaction.ordered;
 };
 
 /**
  * Updates the order element in xmlPage with the value
  * selected by the radio inputs
  */
 View.prototype.MatchSequenceNode.updateOrdered = function(val){
	this.content.assessmentItem.interaction.ordered = val;
  	this.buildPage();
  	
  	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
  };

/**
 * Selects the appropriate option button given the index
 */
 View.prototype.MatchSequenceNode.containerSelected = function(index){
 	document.getElementsByName('radioContainer')[index].checked = true;
 	this.clearOtherChoices(this.getSelectedContainerIdentifier());
 };

/**
 * Selects the appropriate option button given the identifier
 */
View.prototype.MatchSequenceNode.containerSelectedByIdentifier = function(identifier){
	document.getElementById('radioContainer_' + identifier).checked = true;
};
 
/**
 * Selects the appopriate option button given the choice identifier and
 * container identifier
 */
View.prototype.MatchSequenceNode.choiceSelected = function(choiceId,containerId){
	var choices = document.getElementsByName('radioChoice_' + containerId);
	this.clearOtherChoices(containerId);
	this.containerSelectedByIdentifier(containerId); //ensures that associated container is also selected
	if(choices!=null && choices.length>0){
		for(var f=0;f<choices.length;f++){
			if(choices[f].value == choiceId){
				choices[f].checked = true;
			};
		};
	};
};

/**
 * Clears the selection of choices not associated
 * with this identifier
 */
View.prototype.MatchSequenceNode.clearOtherChoices = function(identifier){
	var gaps = this.getFields();
	for(var m=0;m<gaps.length;m++){
		if(gaps[m].identifier!=identifier){
			var choices = document.getElementsByName('radioChoice_' + gaps[m].identifier);
			for(var n=0;n<choices.length;n++){
				choices[n].checked = false;
			};
		};
	};
};

/**
 * Updates the text of a gapMultiple element in the content
 * given the associated identifier
 */
View.prototype.MatchSequenceNode.containerTextUpdated = function(identifier){
	this.getField(identifier).name = document.getElementById('textContainer_' + identifier).value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the gapText element specified by the given identifier
 * in xmlPage when a change is detected
 */
View.prototype.MatchSequenceNode.choiceTextUpdated = function(identifier){
	this.getChoiceByChoiceIdentifier(identifier).value = document.getElementById('textChoice_' + this.getSelectedChoiceIdentifier()).value;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates the value element's order attribute with the value in the orderInput
 * that is associated with the given choice identifier in xmlPage
 */
View.prototype.MatchSequenceNode.orderUpdated = function(identifier){
	this.updateOrderPositionByChoiceIdentifier(identifier, document.getElementById('orderChoice_' + identifier).value);
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Returns the radio element of the corresponding selected container
 */
View.prototype.MatchSequenceNode.getSelectedContainer = function(){
	var radios = document.getElementsByName('radioContainer');
	for(var g=0;g<radios.length;g++){
		if(radios[g].checked){
			return radios[g];
		};
	};
};

/**
 * Returns the identifier of the corresponding selected container
 */
View.prototype.MatchSequenceNode.getSelectedContainerIdentifier = function(){
	var radio = this.getSelectedContainer();
	if(radio){
		return radio.value;
	};
};

/**
 * Returns the radio element corresponding to the selected choice
 */
View.prototype.MatchSequenceNode.getSelectedChoice = function(){
	var choices = document.getElementsByName('radioChoice_' + this.getSelectedContainerIdentifier());
	for(var h=0;h<choices.length;h++){
		if(choices[h].checked){
			return choices[h];
		};
	};
};

/**
 * Returns the identifier of the corresponding selected choice
 */
View.prototype.MatchSequenceNode.getSelectedChoiceIdentifier = function(){
	var choice = this.getSelectedChoice();
	if(choice){
		return choice.value;
	};
};

/**
 * Returns all gapMultiple elements in xmlPage
 */
View.prototype.MatchSequenceNode.getFields = function(){
	return this.content.assessmentItem.interaction.fields;
};

/**
 * Returns the gapMultiple element in the xmlPage
 * that is associated with the given identifier
 */
View.prototype.MatchSequenceNode.getField = function(identifier){
	var fields = this.getFields();
	for(var t=0;t<fields.length;t++){
		if(fields[t].identifier==identifier){
			return fields[t];
		};
	};
};

/**
 * Returns all value elements in the correctResponse element in xmlPage
 */
View.prototype.MatchSequenceNode.getResponseValues = function(){
	return this.content.assessmentItem.responseDeclaration.correctResponses;
 };
 
 /**
  * Returns all value elements in the correctResponse element that
  * has a field identifier that matches the given identifier
  */
 View.prototype.MatchSequenceNode.getResponseValuesByFieldIdentifier = function(identifier){
 	var allVals = this.getResponseValues();
 	var vals = [];
 	for(var y=0;y<allVals.length;y++){
 		if(allVals[y].fieldIdentifier==identifier){
 			vals.push(allVals[y]);
 		};
 	};
 	return vals;
 };

/**
 * Returns all value elemens in the correctResponse elemnt that
 * has a choiceIdentifier that matches the given identifier
 */
View.prototype.MatchSequenceNode.getResponseValuesByChoiceIdentifier = function(identifier){
	var allVals = this.getResponseValues();
	var vals =[];
	for(var y=0;y<allVals.length;y++){
		if(allVals[y].choiceIdentifier==identifier){
			vals.push(allVals[y]);
		};
	};
	return vals;
};

/**
 * Returns the order position given a choice identifier
 */
View.prototype.MatchSequenceNode.getOrderPositionByChoiceIdentifier = function(identifier){
	var vals = this.getResponseValuesByChoiceIdentifier(identifier);
	for(var i=0;i<vals.length;i++){
		return vals[i].order;
	};
};

/**
 * Updates the order position in the content given a choice identifier
 * and the order position
 */
View.prototype.MatchSequenceNode.updateOrderPositionByChoiceIdentifier = function(identifier,order){
	var vals = this.getResponseValuesByChoiceIdentifier(identifier);
	for(var j=0;j<vals.length;j++){
		vals[j].order = order;
	};
};

/**
 * Returns all available choices defined in the content for this
 * match sequence
 */
View.prototype.MatchSequenceNode.getChoices = function(){
	return this.content.assessmentItem.interaction.choices;
};

/**
 * Given an identifier, returns the choice (gap text) associated with it
 */
View.prototype.MatchSequenceNode.getChoiceByChoiceIdentifier = function(identifier){
	var choices = this.getChoices();
	for(var a=0;a<choices.length;a++){
		if(choices[a].identifier==identifier){
			return choices[a];
		};
	};
};

/**
 * Given a container identifier, returns all choices associated with it
 */
View.prototype.MatchSequenceNode.getChoicesByContainerIdentifier = function(identifier){
 	var vals = this.getResponseValuesByFieldIdentifier(identifier);
 	var choiceIds = [];
 	var choices = [];
 	
 	/* get the choiceIdentifiers from the response values associated with the container identifier */
 	for(var b=0;b<vals.length;b++){
 		var id = vals[b].choiceIdentifier;
 		if(id!=null && choiceIds.indexOf(id)==-1 && vals[b].isCorrect){
 			choiceIds.push(id);
 		};
 	};
 	
 	/* then get the choices by the found identifiers */
 	for(var c=0;c<choiceIds.length;c++){
 		choices.push(this.getChoiceByChoiceIdentifier(choiceIds[c]));
 	};
 	
 	return choices;
 };

/**
 * Returns all value elements in the content that are associated
 * with the given choice and container identifiers
 */
View.prototype.MatchSequenceNode.getValueByChoiceAndFieldIdentifiers = function(choiceId,containerId){
	var vals = this.getResponseValuesByChoiceIdentifier(choiceId);
	for(var s=0;s<vals.length;s++){
		if(vals[s].fieldIdentifier==containerId){
			return vals[s];
		};
	};
	return null;
};

/**
 * Generates and returns a unique identifier
 */
View.prototype.MatchSequenceNode.generateUniqueIdentifier = function(type){
	var count = 0;
	var gaps;
	
	if(type=='field'){
		gaps = this.getFields();
	} else if(type=='choice'){
		gaps = this.getChoices();
	};
	
	while(true){
		var id = type + '_' + count;
		var found = false;
		for(var k=0;k<gaps.length;k++){
			if(gaps[k].identifier==id){
				found = true;
			};
		};
		
		if(!found){
			return id;
		};
		
		count ++;
	};
};

/**
 * Adds a new container to this content and refreshes
 */
View.prototype.MatchSequenceNode.addContainer = function(){
	var field = {identifier: this.generateUniqueIdentifier('field'), numberOfEntries: '0', ordinal: false, name:'Enter Title Here'};
	this.content.assessmentItem.interaction.fields.push(field);
	
	this.setIncorrectExistingChoices(field.identifier);
	
	this.buildPage();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Removes the selected container and ALL references
 * to it from xmlPage and refreshes page
 */
View.prototype.MatchSequenceNode.removeContainer = function(){
	var identifier = this.getSelectedContainerIdentifier();
	if(identifier){
		if(confirm('Removing a container also removes all associated choices, ordering, etc. This can not be undone. Are you sure you wish to continue?')){
			var vals = this.getResponseValuesByFieldIdentifier(identifier);
			var choices = this.getChoicesByContainerIdentifier(identifier);
			
			this.getFields().splice(this.getFields().indexOf(this.getField(identifier)),1);
			for(var l=0;l<choices.length;l++){
				this.getChoices().splice(this.getChoices().indexOf(choices[l]), 1);
			};
			
			for(var m=0;m<vals.length;m++){
				this.getResponseValues().splice(this.getResponseValues().indexOf(vals[m]), 1);
			};
			
			this.buildPage();
			
			/* fire source updated event */
			this.view.eventManager.fire('sourceUpdated');
		};
	} else {
		this.view.notificationManager.notify('One of the containers must be selected before removing it', 3);
	};
};

/**
 * Given a container identifier, adds a new choice to xmlPage and 
 * appends it to the associated container
 */
View.prototype.MatchSequenceNode.addChoice = function(){
	var identifier = this.getSelectedContainerIdentifier();
	
	if(!identifier){
		this.view.notificationManager.notify('Please select a container in which you wish to create a new choice.', 3);
		return;
	};
	
	var choice = {matchMax:'1', value: 'Enter Choice', identifier: this.generateUniqueIdentifier('choice')};
	var correct = {choiceIdentifier: choice.identifier, fieldIdentifier: identifier, feedback:'Correct.', isCorrect:true, isDefault:false, order:'0'};
	this.content.assessmentItem.interaction.choices.push(choice);
	this.content.assessmentItem.responseDeclaration.correctResponses.push(correct);
	
	this.setIncorrectOtherContainers(choice.identifier, identifier);
	
	this.buildPage();
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Given a choiceId and the containerId that it is associated
 * with, sets default feedback as 'Incorrect' for any other
 * containers that may exist. Used when creating a new choice.
 */
View.prototype.MatchSequenceNode.setIncorrectOtherContainers = function(choiceId,containerId){
	var containers = this.getFields();
	
	for(var o=0;o<containers.length;o++){
		var identifier = containers[o].identifier;
		if(identifier!=containerId){
			this.createNewFeedback(choiceId, identifier);
			this.updateFeedback(choiceId, identifier, 'Incorrect');
		};
	};
};

/**
 * Given a container Id, sets all existing choices to default
 * as incorrect for that container. Used when creating a new container
 */
View.prototype.MatchSequenceNode.setIncorrectExistingChoices = function(containerId){
	var choices = this.getChoices();
	
	for(var a=0;a<choices.length;a++){
		this.createNewFeedback(choices[a].identifier, containerId);
		this.updateFeedback(choices[a].identifier, containerId, 'Incorrect');
	};
};

/**
 * Removes the selected choice from the content, refreshes and updates preview
 */
View.prototype.MatchSequenceNode.removeChoice = function(){
	var choice = this.getChoiceByChoiceIdentifier(this.getSelectedChoiceIdentifier());
	if(choice){
		if(confirm('Removing a choice also removes all associated feedback. This can not be undone. Are you sure you wish to continue?')){
			var vals = this.getResponseValuesByChoiceIdentifier(choice.identifier);

			this.getChoices().splice(this.getChoices().indexOf(choice), 1);
			
			for(var o=0;o<vals.length;o++){
				this.getResponseValues().splice(this.getResponseValues().indexOf(vals[o]), 1);
			};
			
			this.buildPage();
			
			/* fire source updated event */
			this.view.eventManager.fire('sourceUpdated');
		};
	} else {
		this.view.notificationManager.notify('A choice must be selected before removing it.', 3);
	};
};

/**
 * Given a choice identifier and a container identifier,
 * creates a new value element for feedback in xmlPage
 */
View.prototype.MatchSequenceNode.createNewFeedback = function(choiceId,containerId,isCorrect){
	var val = {choiceIdentifier:choiceId,fieldIdentifier:containerId,isCorrect:false,isDefault:false,order:'0',feedback:''};
	
	if(this.getOrdered()){
		var vals = this.getResponseValuesByChoiceIdentifier(choiceId);
		if(vals!=null & vals.length>0){
			for(var r=0;r<vals.length;r++){
				var foundOrder = vals[r].getAttribute('order');
				if(vals[r].order!=''){
					val.order = foundOrder;
				};
			};
		};
	};
	
	this.content.assessmentItem.responseDeclaration.correctResponses.push(val);
};

/**
 * Given the choice identifier, container identifier and new text,
 * updates the associated value (feedback element) in the content
 */
View.prototype.MatchSequenceNode.updateFeedback = function(choiceId,containerId,text){
	this.getValueByChoiceAndFieldIdentifiers(choiceId, containerId).feedback = text;
};

/**
 * Validates the ordering of each container when ordering is specified
 */
View.prototype.MatchSequenceNode.validateOrdering = function(){
	if(this.getOrdered()){
		if(this.duplicated()){
			return false;
		} else if(!this.sequential()){
			return false;
		} else {
			return true;
		};
	} else {
		return true;
	};
};

/**
 * returns true if any of the ordering variables for any of the containers
 * is duplicated, otherwise, returns false
 */
View.prototype.MatchSequenceNode.duplicated = function(){
	var containers = this.getFields();
	for(var t=0;t<containers.length;t++){
		var choices = this.getChoicesByContainerIdentifier(containers[t].identifier);
		var order = [];
		for(var u=0;u<choices.length;u++){
			var orderVal = this.getValueByChoiceAndFieldIdentifiers(choices[u].identifier, containers[t].identifier).order;
			if(orderVal!=null && orderVal!=''){
				if(order.indexOf(orderVal)==-1){
					order.push(orderVal);
				} else {
					return true;
				};
			};
		};
	};
	return false;
};

/**
 * returns 1 if a is > b, 0 if a = b and -1 if a < b
 */
View.prototype.MatchSequenceNode.sort = function(a,b){
	if(a > b){
		return 1;
	} else if (a==b){
	 	return 0;
	} else {
		return -1;
	};
};

/**
 * returns true if there is < 2 order values or if all of the values
 * are exactly 1 more than the previous
 */
View.prototype.MatchSequenceNode.sequential = function(){
	var containers = this.getFields();
	for(var u=0;u<containers.length;u++){
		var choices = this.getChoicesByContainerIdentifier(containers[u].identifier);
		var order = [];
		for(var v=0;v<choices.length;v++){
			var val = this.getValueByChoiceAndFieldIdentifiers(choices[v].identifier, containers[u].identifier).order;
			order.push(val);
		};
		order.sort(this.sort);
		for(var w=0;w<order.length;w++){
			if(w!=0){
				if(parseInt(order[w])!=(parseInt(order[w-1]) + 1)){
					return false;
				};
			};
		};
	};
	return true;
};

/**
 * Returns a boolean, whether or not to shuffle choices when displaying
 */
View.prototype.MatchSequenceNode.getShuffle = function(){
	return this.content.assessmentItem.interaction.shuffle;
};

/**
 * Changes the shuffle option in xmlPage
 */
View.prototype.MatchSequenceNode.shuffleChanged = function(){
	this.content.assessmentItem.interaction.shuffle = document.getElementById('shuffled').checked;
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Shows the edit feedback div element to allow for editing of feedback
 */
View.prototype.MatchSequenceNode.editFeedback = function(){
	this.feedbackMode = true;
	showElement('feedbackDiv');
	hideElement('containerTable');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.MatchSequenceNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.content);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_matchsequence.js');
};
/**
 * Sets the GlueNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.GlueNode = {};

/**
 * Generates the authoring page for glue node types
 */
View.prototype.GlueNode.generatePage = function(view){
	this.view = view;
	this.xmlPage = this.view.activeContent.getContentXML();
	this.allowedGlue = new Array('MultipleChoiceNode', 'OpenResponseNode', 'HtmlNode');
	
	/* get parent */
	var parent = document.getElementById('dynamicParent');
	
	/* wipe out old elements */
	parent.removeChild(document.getElementById('dynamicPage'));
	
	/* create new elements */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	parent.appendChild(pageDiv);
	
	var promptDiv = createElement(document, 'div', {id:'promptDiv'});
	var promptText = document.createTextNode('Edit Prompt');
	var promptInput = createElement(document, 'textarea', {id:'promptInput', cols: '75', rows: '18', wrap: 'soft', onkeyup: 'eventManager.fire("glueUpdatePrompt")'});
	
	pageDiv.appendChild(promptDiv);
	promptDiv.appendChild(promptText);
	promptDiv.appendChild(createBreak());
	promptDiv.appendChild(promptInput);
	
	promptInput.value = this.getPrompt();
	
	var ddTable = createElement(document, 'table', {id:'ddGlueTable', width:'100%'});
	var ddtBody = createElement(document, 'tbody');
	var ddHeaderRow = createElement(document, 'tr', {id:'ddHeaderRow'});
	var ddAttachedHeadTD = createElement(document, 'td', {id:'ddAttachedHeadTD', width:'40%'});
	var ddNodesHeadTD = createElement(document, 'td', {id:'ddNodesHeadTD', width:'40%'});
	var ddTrashHeadTD = createElement(document, 'td', {id:'ddTrashHeadTD', width:'20%'});
	
	pageDiv.appendChild(ddTable);
	ddTable.appendChild(ddtBody);
	ddtBody.appendChild(ddHeaderRow);
	ddHeaderRow.appendChild(ddAttachedHeadTD);
	ddHeaderRow.appendChild(ddNodesHeadTD);
	ddHeaderRow.appendChild(ddTrashHeadTD);
	
	ddAttachedHeadTD.innerHTML = "Add/Remove/Arrange Nodes";
	ddNodesHeadTD.innerHTML = "All Allowable Nodes";
	ddTrashHeadTD.innerHTML = "Trash Can";
	
	var ddRow = createElement(document, 'tr', {id:'ddRow'});
	var ddAttachedTD = createElement(document, 'td', {id:'ddAttachedTD'});
	var ddNodesTD = createElement(document, 'td', {id:'ddNodesTD'});
	var ddTrashTD = createElement(document, 'td', {id:'ddTrashTD'});
	
	ddtBody.appendChild(ddRow);
	ddRow.appendChild(ddAttachedTD);
	ddRow.appendChild(ddNodesTD);
	ddRow.appendChild(ddTrashTD);
	
	this.generateAttached();
	this.generateNodes();
	this.generateTrash();
	this.generateGlueDD();
};

/**
 * Creates and append the attached html elements
 */
View.prototype.GlueNode.generateAttached = function(){
	var parent = document.getElementById('ddAttachedTD');
	
	/* remove old */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new */
	var attachedUL = createElement(document, 'ul', {id:'attachedUL', 'class':'container'});
	var placeholder = createElement(document, 'li', {'class':'placeholder'});
	var children = this.getChildren();
	
	parent.appendChild(attachedUL);
	attachedUL.appendChild(createBreak());
	attachedUL.appendChild(placeholder);
	
	for(var x=0;x<children.length;x++){
		var childId = children[x].getAttribute('ref');
		var child = createElement(document, 'li', {id:'attached_' + childId, name:'attached', 'class': 'draggable'});
		var childTitle = document.createTextNode(this.view.getProject().getNodeById(childId).title);
		attachedUL.appendChild(child);
		child.appendChild(childTitle);
	};
};

/**
 * Generates and appends the html elements for the allowable glue nodes 
 * in the currently opened project in an unordered list for dragging.
 */
View.prototype.GlueNode.generateNodes = function(){
	var parent = document.getElementById('ddNodesTD');
	
	/* remove old */
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	/* create new */
	var nodesUL = createElement(document, 'ul', {id:'nodesUL'});
	var placeholder = createElement(document, 'li', {'class':'placeholder'});
	var nodes = this.view.getProject().getLeafNodes();
	
	parent.appendChild(nodesUL);
	nodesUL.appendChild(placeholder);
	
	for(var y=0;y<nodes.length;y++){
		if(this.allowedGlue.indexOf(nodes[y].type)>-1){
			var nodeId = nodes[y].id;
			var node = createElement(document, 'li', {id:'node_' + nodeId, name:'ddNodes', 'class':'draggable'});
			var nodeTitle = document.createTextNode(nodes[y].title);
			
			nodesUL.appendChild(node);
			node.appendChild(nodeTitle);
		};
	};
};

/**
 * Generates and appends the html trash element to this page
 */
View.prototype.GlueNode.generateTrash = function(){
	var parent = document.getElementById('ddTrashTD');
	
	var old = document.getElementById('trashDiv');
	
	if(old){
		parent.removeChild(old);
	};
	
	var trash = createElement(document, 'div', {id:'trashDiv', 'class':'trash'});
	
	parent.appendChild(trash);
	trash.innerHTML = 'Trash Bin';
};

/**
 * Returns the xml child nodes of this glue
 */
View.prototype.GlueNode.getChildren = function(){
	return this.xmlPage.getElementsByTagName('node-ref');
};

/**
 * Returns the prompt value for this glue
 */
View.prototype.GlueNode.getPrompt = function(){
	var promptEl = this.xmlPage.getElementsByTagName('prompt');
	if(promptEl[0].firstChild){
		return promptEl[0].firstChild.nodeValue;
	} else {
		return "";
	};
};

/**
 * Updates the xml prompt element's value with that entered by the user
 */
View.prototype.GlueNode.updatePrompt = function(){
	var val = document.getElementById('promptInput').value;
	var promptEl = this.xmlPage.getElementsByTagName('prompt')[0];
	if(promptEl.firstChild){
		promptEl.firstChild.nodeValue = val;
	} else {
		promptEl.appendChild(this.xmlPage.createTextNode(val));
	};
	
	/* fire source updated event */
	this.view.eventManager.fire('sourceUpdated');
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.GlueNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.setContent(this.xmlPage);
};

/*****											    *****|
 * The following functions are used by YUI for the drag *|
 * and drop stuff when authoring glues				    *|
 *****											    *****/
View.prototype.GlueNode.generateGlueDD = function(){
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', 'dd-ddm', 'dd-ddm-drop', function(Y) {
	    //Listen for all drop:over events
	    Y.DD.DDM.on('drop:over', function(e) {
	    	
	       //Get a reference to out drag and drop nodes
	        var drag = e.drag.get('node'),
	            drop = e.drop.get('node');
	        
	        //Are we dropping on a li node?
	        if (drop.get('tagName').toLowerCase() === 'li') {
	        	
	            //Are we not going up?
	            if (!goingUp) {
	               drop = drop.get('nextSibling');
	            }
	            //Add the node to this list
	            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
	            //Resize this nodes shim, so we can drop on it later.
	            e.drop.sizeShim();
	        }
	    });
	    //Listen for all drag:drag events
	    Y.DD.DDM.on('drag:drag', function(e) {
	        //Get the last y point
	        var y = e.target.lastXY[1];
	        //is it greater than the lastY var?
	        if (y < lastY) {
	            //We are going up
	            goingUp = true;
	        } else {
	            //We are going down..
	            goingUp = false;
	        }
	        //Cache for next check
	        lastY = y;
	    });
	    //Listen for all drag:start events
	    Y.DD.DDM.on('drag:start', function(e) {
	        //Get our drag object
	        var drag = e.target;
	        //Set some styles here
	        drag.get('node').setStyle('opacity', '.25');
	        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
	        drag.get('dragNode').setStyles({
	            opacity: '.5',
	            borderColor: drag.get('node').getStyle('borderColor'),
	            backgroundColor: drag.get('node').getStyle('backgroundColor')
	        });
	        
	    });
	    //Listen for a drag:end events
	    Y.DD.DDM.on('drag:end', function(e) {
	        var drag = e.target;
	        //Put out styles back
	        drag.get('node').setStyles({
	            visibility: '',
	            opacity: '1'
	        });
	    });
	    //Listen for all drag:drophit events
	    Y.DD.DDM.on('drag:drophit', function(e) {
	        var drop = e.drop.get('node'),
	            drag = e.drag.get('node');
			
	        //if we are not on an li, we must have been dropped on a ul
	        if (drop.get('tagName').toLowerCase() !== 'li') {
	            if (!drop.contains(drag)) {
	                drop.appendChild(drag);
	            }
	            eventManager.fire('glueNodeDropped', [drag, drop]);
	        } 
	    });
	    
	    //Static Vars
	    var goingUp = false, lastY = 0;
	    
	    //create node draggables
	    var nodes = document.getElementsByName('ddNodes');
	    for(var n=0;n<nodes.length;n++){
	    	eventManager.fire('glueCreateDraggable', [Y, nodes[n]]);
	    };
	    
	    //create reference draggables
	    var refs = document.getElementsByName('attached');
	    for(var r=0;r<refs.length;r++){
	    	eventManager.fire('glueCreateDraggable', [Y, refs[r]]);
	    };
	    
	    //Create target for the glue container
	    eventManager.fire('glueCreateTarget', [Y, document.getElementById('attachedUL')]);
	    
	    //Create trash target
	    eventManager.fire('glueCreateTarget', [Y, document.getElementById('trashDiv')]);
	    
	    //Create nodes UL as target (so we can catch drop events for
	    //draggables that do not belong
	    eventManager.fire('glueCreateTarget', [Y, document.getElementById('nodesUL')]);
	});
};

/**
 * Creates a drop target
 */
View.prototype.GlueNode.createTarget = function(Y, el){
	var tar = new Y.DD.Drop({node: el});
};

/**
 * Makes the given html element draggable
 */
View.prototype.GlueNode.createDraggable = function(Y, el){
	var dd = new Y.DD.Drag({node: el, proxy: true, moveOnEnd: false, constrain2node: '#ddTable',  target:{padding: '0 0 0 20'}});
};

/**
 * Updates the xmlPages children element based on the current state of the html
 */
View.prototype.GlueNode.createReferences = function(){
	var parent = this.xmlPage.getElementsByTagName('children')[0];
	
	while(parent.firstChild){
		parent.removeChild(parent.firstChild);
	};
	
	var docParent = document.getElementById('attachedUL');
	var children = docParent.childNodes;
	for(var z=0;z<children.length;z++){
		if(children[z].id!=null && children[z].id!='placeholder' && children[z].id!=""){
			var childId = children[z].id.substring(children[z].id.indexOf('_') + 1, children[z].id.length);
			var child = this.xmlPage.createElement('node-ref');
			child.setAttribute('ref', childId);
			parent.appendChild(child);
		};
	};
};

/**
 * Determines what node has been dropped and where and handles each case.
 */
View.prototype.GlueNode.onNodeDropped = function(dragged,dropped){
	if(dropped.get('id')=='trashDiv'){
		if(dragged.get('id').substring(0, dragged.get('id').indexOf('_'))=='node'){
			this.view.notificationManager.notify('Please create and remove nodes from the main authoring page only.', 3);
		} else {
			var child = document.getElementById(dragged.get('id'));
			child.parentNode.removeChild(child);
			this.createReferences();
		};
	} else if(dropped.get('id')=='attachedUL'){
		this.createReferences();
	};
	
	this.generateAttached();
	this.generateNodes();
	this.generateTrash();
	this.generateGlueDD();
};
/*****												******|
 * End functions used by YUI for the drag and drop stuff *|
 *****												******/

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_glue.js');
};
/**
 * Sets the HtmlNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.HtmlNode = {};

View.prototype.HtmlNode.generatePage = function(view){
	this.view = view;
	this.view.activeNode.baseHtmlContent = createContent(this.view.getProject().makeUrl(this.view.activeContent.getContentJSON().src));
	
	var parent = document.getElementById('dynamicParent');
	
	/* wipe out old element */
	parent.removeChild(document.getElementById('dynamicPage'));
	
	/* create new elements */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var ta = createElement(document, 'textarea', {id:'sourceTextArea', style:'width:100%;height:100%', onkeyup:'eventManager.fire("sourceUpdated")'});
	parent.appendChild(pageDiv);
	pageDiv.appendChild(ta);
	
	ta.value = this.view.activeNode.baseHtmlContent.getContentString();
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.HtmlNode.updateContent = function(){
	/* update content object */
	this.view.activeNode.baseHtmlContent.setContent(document.getElementById('sourceTextArea').value);
};

/**
 * Saves the html content to its file
 */
View.prototype.HtmlNode.save = function(close){
	var success = function(t,x,o){
		o.stepSaved = true;
		o.notificationManager.notify('Updated html content on server', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [true]);
		};
	};
	
	var failure = function(t,x,o){
		o.notificationManager.notify('Failed update of html content on server', 3);
		if(close){
			o.eventManager.fire('closeOnStepSaved', [false]);
		};
	};
	
	this.view.connectionManager.request('POST', 3, 'filemanager.html', {command:'updateFile', param1:this.view.utils.getContentPath(this.view.authoringBaseUrl,this.view.getProject().getContentBase()), param2:this.view.activeNode.baseHtmlContent.getFilename(this.view.getProject().getContentBase()), param3:encodeURIComponent(document.getElementById('sourceTextArea').value)}, success, this.view, failure);
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_html.js');
};
/**
 * Sets the OutsideUrlNode type as an object of this view
 * 
 * @author patrick lawler
 */
View.prototype.OutsideUrlNode = {};

View.prototype.OutsideUrlNode.generatePage = function(view){
	this.view = view;
	
	var parent = document.getElementById('dynamicParent');
	
	/* wipe out old element */
	parent.removeChild(document.getElementById('dynamicPage'));
	
	/* create new elements */
	var pageDiv = createElement(document, 'div', {id:'dynamicPage', style:'width:100%;height:100%'});
	var tInput = createElement(document, 'input', {id:'tInput', type:'text', size:'50', onkeyup:'eventManager.fire("sourceUpdated")'});
	var urlText = document.createTextNode("URL: ");
	
	parent.appendChild(pageDiv);
	pageDiv.appendChild(urlText);
	pageDiv.appendChild(tInput);
	
	tInput.value = this.view.activeContent.getContentJSON().url;
};

/**
 * Updates this content object when requested, usually when preview is to be refreshed
 */
View.prototype.OutsideUrlNode.updateContent = function(){
	/* update content object */
	this.view.activeContent.getContentJSON().url = document.getElementById('tInput').value;
};

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/view/authoring/nodes/authorview_outsideurl.js');
};
