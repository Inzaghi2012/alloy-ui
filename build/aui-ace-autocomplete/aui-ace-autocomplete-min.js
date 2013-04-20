AUI.add("aui-ace-autocomplete-base",function(d){var h=d.Lang,c=d.Array,i=d.Do,p=d.DOM,e="exec",m="fillMode",n="host",b="insertText",g="processor",a=1,k=0,l=-1,j=0,o="ace-autocomplete-base";var f=function(){};f.prototype={initializer:function(){var q=this;q._editorCommands=[];d.after(q._bindUIACBase,q,"renderUI");var r=q.get(g);if(r&&!r.get(n)){r.set(n,q);}q._onResultsErrorFn=d.bind("_onResultsError",q);q._onResultsSuccessFn=d.bind("_onResultsSuccess",q);},_addSuggestion:function(x){var z=this;z._lockEditor=true;var v=z._getEditor();var t=z.get(g).getSuggestion(z._matchParams.match,x);if(z.get(m)===f.FILL_MODE_OVERWRITE){var w=z._matchParams;var y=w.row;var s=w.column-w.match.content.length;var q=v.getCursorPosition();var r=require("ace/range").Range;var u=new r(y,s,q.row,q.column);v.getSession().replace(u,t);}else{v.insert(t);}v.focus();z._lockEditor=false;z.fire("addSuggestion",t);return new i.Halt(null);},_bindUIACBase:function(){var q=this;q.publish("cursorChange",{defaultFn:q._defaultCursorChangeFn});var r=q._getEditor();q._onChangeFn=d.bind("_onEditorChange",q);r.on("change",q._onChangeFn);r.commands.addCommand({name:"showAutoComplete",bindKey:d.merge(q.get("showListKey"),{sender:"editor|cli"}),exec:function(u,t,v){var s=r.getCursorPosition();q._processAutoComplete(s.row,s.column);}});q._onEditorChangeCursorFn=d.bind("_onEditorChangeCursor",q);r.getSelection().on("changeCursor",q._onEditorChangeCursorFn);q.on("destroy",q._destroyUIACBase,q);},_defaultCursorChangeFn:function(u){var r=this;var t=r._getEditor();var q=t.getCursorPosition();var v=q.row;var s=q.column;var w=r._matchParams;if(v!==w.row||s<w.match.start){r.fire("cursorOut");}},_destroyUIACBase:function(){var q=this;var r=q._getEditor();r.commands.removeCommand("showAutoComplete");r.removeListener("change",q._onChangeFn);r.getSelection().removeListener("changeCursor",q._onEditorChangeCursorFn);q._removeAutoCompleteCommands();},_getEditor:function(){var q=this;return q.get(n).getEditor();},_filterResults:function(v,s){var q=this;var u=q.get("filters");for(var r=0,t=u.length;r<t;++r){s=u[r].call(q,v,s.concat());if(!s.length){break;}}var w=q.get("sorters");for(r=0,t=w.length;r<t;++r){s=w[r].call(q,v,s.concat());if(!s.length){break;}}return s;},_handleEnter:function(s){var q=this;if(s==="\n"||s==="\t"){var r=q._getSelectedEntry();return q._addSuggestion(r);}},_onEditorChange:function(v){var q=this;var w=v.data;var x=w.action;if(!q._lockEditor&&(x===b||x==="removeText")){var t=w.range;var u=t.start.column;var s=t.end.row;var r=t.start.row;if(x===b&&r===s){q._processAutoComplete(r,u+1);}q.fire(x,{column:u,dataRange:t,endRow:s,startRow:r});}},_onEditorChangeCursor:function(r){var q=this;q.fire("cursorChange",q._getEditor().getCursorPosition());},_onResultsError:function(r){var q=this;q.fire("resultsError",r);},_onResultsSuccess:function(r){var q=this;q.set("results",r);},_overwriteCommands:function(){var r=this;var s=r._getEditor();var q=s.commands.commands;r._editorCommands.push(i.before(r._handleEnter,s,"onTextInput",r),i.before(r._handleKey,q["golinedown"],e,r,40),i.before(r._handleKey,q["golineup"],e,r,38),i.before(r._handleKey,q["gotoend"],e,r,35),i.before(r._handleKey,q["gotolineend"],e,r,35),i.before(r._handleKey,q["gotolinestart"],e,r,36),i.before(r._handleKey,q["gotopagedown"],e,r,34),i.before(r._handleKey,q["gotopageup"],e,r,33),i.before(r._handleKey,q["gotostart"],e,r,36));},_phraseMatch:function(s,r,q){if(!s){return r;}return c.filter(r,function(u){var t=true;if(u===s){t=false;}else{if(!q){u=u.toLowerCase();s=s.toLowerCase();}if(u.indexOf(s)===-1){t=false;}}return t;});},_processAutoComplete:function(x,s){var w=this;var r=s;var u=w._getEditor();var y=u.getSession().getLine(x);y=y.substring(0,s);var q=w.get(g);var t=q.getMatch(y);var v;if(h.isObject(t)){v=u.renderer.textToScreenCoordinates(x,s);v.pageX+=p.docScrollX();v.pageY+=p.docScrollY();w._matchParams={column:s,match:t,row:x};q.getResults(t,w._onResultsSuccessFn,w._onResultsErrorFn);}w.fire("match",{column:s,coords:v,line:y,match:t,row:x});},_removeAutoCompleteCommands:function(){var q=this;(new d.EventHandle(q._editorCommands)).detach();q._editorCommands.length=0;},_sortAscLength:function(s,r,q){return r.sort(function(v,u){var t=0;if(!q){v=v.toLowerCase();u=u.toLowerCase();}var x=v.indexOf(s);var w=u.indexOf(s);if(x===0&&w===0){t=v.localeCompare(u);}else{if(x===0){t=-1;}else{if(w===0){t=1;}else{t=v.localeCompare(u);}}}return t;});},_validateFillMode:function(q){return(q===f.FILL_MODE_OVERWRITE||q===f.FILL_MODE_INSERT);}};f.FILL_MODE_INSERT=a;f.FILL_MODE_OVERWRITE=k;f.NAME=o;f.NS=o;f.ATTRS={fillMode:{validator:"_validateFillMode",value:f.FILL_MODE_OVERWRITE},filters:{valueFn:function(){var q=this;return[q._phraseMatch];}},processor:{validator:function(q){return h.isObject(q)||h.isFunction(q);}},showListKey:{validator:h.isObject,value:{mac:"Alt-Space",win:"Ctrl-Space"}},sorters:{valueFn:function(){var q=this;return[q._sortAscLength];}}};d.AceEditor.AutoCompleteBase=f;},"@VERSION@",{requires:["aui-ace-editor"]});AUI.add("aui-ace-autocomplete-list",function(k){var Q=k.Lang,o=k.Array,x=k.Do,e=k.getClassName,M="data-index",y="ace-autocomplete-list",b="container",q=".",c="empty",i="",z="entry",t="highlighted",E="list",p="loading",C="offsetHeight",B="previous",u="region",N="results",v="selected",a=" ",P="visible",j="ace-autocomplete",g=e(j,z),J=e(j,z,b),s=e(j,z,b,t),n=e(j,z,c),L=e(j,z,p),D=e(j,z,p),d=e(j,N),I=q+J,l=I+q+v,O=l+a+q+g,m=40,h=35,K=34,r=33,f=36,G=38,F=5,H=20;var w=k.Component.create({NAME:y,NS:y,ATTRS:{emptyMessage:{validator:Q.isString,value:"No suggestions"},host:{validator:Q.isObject},listNode:{value:null},loadingMessage:{validator:Q.isString,value:"Loading"},results:{validator:Q.isArray},selectedEntry:{getter:"_getSelectedEntry"}},AUGMENTS:[k.AceEditor.AutoCompleteBase,k.WidgetAutohide],CSS_PREFIX:j,EXTENDS:k.OverlayBase,HTML_PARSER:{listNode:q+d},prototype:{bindUI:function(){var A=this;A.on("addSuggestion",A.hide,A);A.on("cursorChange",A._onCursorChange,A);A.on("cursorOut",A.hide,A);
A.on("insertText",A._onInsertText,A);A.on("match",A._onMatch,A);A.on("removeText",A._onRemoveText,A);A.on("resultsChange",A._onResultsChange,A);A.on("resultsError",A._setEmptyResults,A);A.on("showLoadingMessage",A._onShowLoadingMessage,A);A.on("visibleChange",A._onVisibleChange,A);},renderUI:function(){var A=this;var R=A.get("listNode");if(!R){R=A._createListNode();}R.delegate("click",A._handleResultListClick,I,A);R.delegate("mouseenter",A._onMouseEnter,I,A);R.delegate("mouseleave",A._onMouseLeave,I);A._autoCompleteResultsList=R;},_createListNode:function(){var A=this;var R=k.Node.create(A.TPL_LIST);A.get("contentBox").append(R);return R;},_getEntriesPerPage:function(){var A=this;var S=A._entriesPerPage;if(!S){var R=A._autoCompleteResultsList;var T=R.one(I).get(C);var U=R.get(C);S=Math.floor(U/T);A._entriesPerPage=S;}return S;},_getSelectedEntry:function(){var A=this;var R;var S=A._autoCompleteResultsList.one(O);if(S){R=S.text();}return R;},_handleArrows:function(W){var A=this;var V;if(W===G){V=B;}else{if(W===m){V="next";}}if(V){var T=A._autoCompleteResultsList;var S=T.one(l);if(S){var U=S[V](I);if(U){S.removeClass(v);U.addClass(v);var X=T.get(u);var R=U.get(u);if(V===B){if(R.top<X.top){U.scrollIntoView(true);}else{if(R.top>X.bottom){U.scrollIntoView();}}}else{if(R.top+R.height>X.bottom){U.scrollIntoView();}else{if(R.top+R.height<X.top){U.scrollIntoView(true);}}}}}return new x.Halt(null);}},_handleKey:function(S,U,T){var R=this;var A;if(R.get(P)){if(T===G||T===m){A=R._handleArrows(T);}else{if(T===r||T===K){A=R._handlePageUpDown(T);}else{if(T===h||T===f){A=R._handleStartEnd(T);}}}}return A;},_handlePageUpDown:function(Y){var W=this;var T=W._autoCompleteResultsList;var X=W._getEntriesPerPage();var V=T.one(l);var A=Q.toInt(V.attr(M));var U;var Z=i;var R=false;if(Y===r){U=A-X;R=true;}else{if(Y===K){U=A+X;Z=":last-child";}}var S=T.one(I+"["+M+'="'+U+'"]');if(!S){S=T.one(I+Z);}if(V!==S){V.removeClass(v);S.addClass(v);S.scrollIntoView(R);}return new x.Halt(null);},_handleResultListClick:function(T){var A=this;var U=T.currentTarget;var R=A._autoCompleteResultsList.one(l);if(U!==R){R.removeClass(v);U.addClass(v);}var S=U.text();A._addSuggestion(S);A.fire("entrySelected",{content:S});},_handleStartEnd:function(V){var A=this;var T;var U=false;var S=A._autoCompleteResultsList;if(V===h){T=S.one(I+":last-child");}else{if(V===f){T=S.one(I);U=true;}}var R=S.one(l);if(T!==R){R.removeClass(v);T.addClass(v);T.scrollIntoView(U);}return new x.Halt(null);},_onCursorChange:function(R){var A=this;if(!A.get(P)){R.preventDefault();}},_onInsertText:function(R){var A=this;if(R.startRow!==R.endRow&&A.get(P)){A.hide();}},_onMatch:function(R){var A=this;if(R.match){var S=R.coords;A.set("xy",[S.pageX+F,S.pageY+H]);}else{if(A.get(P)){A.hide();}}},_onMouseEnter:function(A){A.currentTarget.addClass(s);},_onMouseLeave:function(A){A.currentTarget.removeClass(s);},_onRemoveText:function(R){var A=this;if(A.get(P)){A.hide();}},_onResultsChange:function(V){var A=this;var R=A._autoCompleteResultsList;R.empty();var T=V.newVal;var U=A.TPL_ENTRY;o.each(T,function(X,W){R.appendChild(Q.sub(U,{index:W,value:X}));});var S=R.one(I);if(S){S.addClass(v);if(!A.get(P)){A.show();}}else{if(A.get(P)){A.hide();}}},_onShowLoadingMessage:function(S){var A=this;var R=A._autoCompleteResultsList;R.empty();R.appendChild(Q.sub(A.TPL_LOADING,{label:A.get("loadingMessage")}));if(!A.get(P)){A.show();}},_onVisibleChange:function(R){var A=this;if(R.newVal){A._overwriteCommands();}else{A._removeAutoCompleteCommands();}},_setEmptyResults:function(){var A=this;A.set("results",[]);},TPL_ENTRY:'<li class="'+J+'" data-index="{index}">'+'<span class="'+g+'">{value}</span>'+"</li>",TPL_LIST:'<ul class="'+d+'"/>',TPL_LOADING:'<li class="'+J+'">'+'<span class="aui-icon-loading '+L+'">{label}</span>'+"</li>",TPL_RESULTS_EMPTY:'<li class="'+J+'">'+'<span class="'+n+'">{label}</span>'+"</li>"}});k.AceEditor.AutoCompleteList=w;k.AceEditor.AutoComplete=w;},"@VERSION@",{requires:["aui-overlay-base","widget-autohide","aui-ace-autocomplete-base"],skinnable:true});AUI.add("aui-ace-autocomplete-plugin",function(a){var b=a.Plugin;function c(d){if(!d.render&&d.render!==false){d.render=true;}c.superclass.constructor.apply(this,arguments);}a.extend(c,a.AceEditor.AutoCompleteList,{},{CSS_PREFIX:"aui-ace-autocomplete",NAME:"aui-ace-autocomplete-plugin",NS:"aui-ace-autocomplete-plugin"});b.AceAutoComplete=c;b.AceAutoCompleteList=c;},"@VERSION@",{requires:["plugin","aui-ace-autocomplete-list"]});AUI.add("aui-ace-autocomplete-templateprocessor",function(d){var i=d.Lang,c=d.Array,l=d.Object,h=d.AceEditor.AutoCompleteBase,a=0,f=1,b=1,e=-1,g=0,k=".",m="host",j="",o="aui-ace-autocomplete-templateprocessor";var n=d.Component.create({NAME:o,NS:o,ATTRS:{directives:{validator:i.isArray},host:{validator:i.isObject},variables:{validator:i.isObject}},EXTENDS:d.Base,prototype:{getResults:function(q,v,u){var w=this;var t=q.type;if(t===a){var s=w.get("directives");var r=q.content.toLowerCase();if(r.length){var x=w.get(m);s=x._filterResults(r,s);}v(s);}else{if(t===f){var p=w._getVariableMatches(q.content);v(p);}}},getSuggestion:function(t,u){var q=this;var p=u||j;if(u){var s=q.get(m).get("fillMode");var v=t.type;var w;var r;if(s===h.FILL_MODE_INSERT){if(v===a){if(t.content&&u.indexOf(t.content)===0){p=u.substring(t.content.length);}}else{if(v===f){w=t.content.split(k);r=w[w.length-1];if(r&&u.indexOf(r)===0){p=u.substring(r.length);}}}}else{if(v===f){w=t.content.split(k);w[w.length-1]=u;p=w.join(k);}}}return p;},_isLastToken:function(p,q){return p===q.length-1;},_getTokenType:function(p){var q=e;if(i.isString(p)){if(p.length){q=g;}else{q=b;}}return q;},_getVariableMatches:function(z){var E=this;var x=[];var w=E.get("variables");var t={};var q=w.variables;var C;if(z){var B=z.split(k);C=B[B.length-1];for(var v=0;v<B.length;v++){var s=B[v];var D=E._getTokenType(s);if(D===b){if(v===0){q={};}else{t=q;}}else{if(D===g){var r=E._isLastToken(v,B);if(r){t=q;break;}var A=s.indexOf("(");if(A!==-1){s=s.substring(0,A);
}var p=q[s];if(p){var u;if(v===0){u=p.type;}else{u=p.returnType;}q=w.types[u]||{};}else{if(r){t=q;break;}else{t={};break;}}}}}}else{t=w.variables;}x=l.keys(t);var y=x.sort();if(C){var F=E.get(m);y=F._filterResults(C,y);}if(y.length){y=c.map(y,function(I,H){var J=t[I];if(J.type==="Method"){var G=c.map(J.argumentTypes,function(L,K){var M=L.split(".");return M[M.length-1];});return I+"("+G.join(", ")+")";}else{return I;}});}return y;},_setRegexValue:function(q){var p=d.AttributeCore.INVALID_VALUE;if(i.isString(q)){p=new RegExp(q);}else{if(q instanceof RegExp){p=q;}}return p;}}});d.AceEditor.TemplateProcessor=n;},"@VERSION@",{requires:["aui-ace-autocomplete-base"]});AUI.add("aui-ace-autocomplete-freemarker",function(b){var e=b.Lang,c=b.AceEditor.AutoCompleteBase,d=0,a=1,g="aui-ace-autocomplete-freemarker";var f=b.Component.create({NAME:g,NS:g,ATTRS:{directives:{validator:e.isArray,value:["assign","attempt","break","case","compress","default","else","elseif","escape","fallback","flush","ftl","function","global","if","import","include","list","local","lt","macro","nested","noescape","nt","recover","recurse","return","rt","setting","stop","switch","t","visit"]},directivesMatcher:{setter:"_setRegexValue",value:/<#[\w]*[^<#]*$/},host:{validator:e.isObject},variables:{validator:e.isObject},variablesMatcher:{setter:"_setRegexValue",value:/\${[\w., ()"]*(?:[^$]|\\\$)*$/}},EXTENDS:b.AceEditor.TemplateProcessor,prototype:{getMatch:function(k){var i=this;var j;var h;if((h=k.lastIndexOf("<"))>=0){k=k.substring(h);if(i.get("directivesMatcher").test(k)){j={content:k.substring(2),start:h,type:d};}}else{if((h=k.lastIndexOf("$"))>=0){k=k.substring(h);if(i.get("variablesMatcher").test(k)){j={content:k.substring(2),start:h,type:a};}}}return j;}}});b.AceEditor.AutoCompleteFreemarker=f;},"@VERSION@",{requires:["aui-ace-autocomplete-templateprocessor"]});AUI.add("aui-ace-autocomplete-velocity",function(b){var e=b.Lang,c=b.AceEditor.AutoCompleteBase,d=0,a=1,f="aui-ace-autocomplete-velocity";var g=b.Component.create({NAME:f,NS:f,ATTRS:{directives:{validator:e.isArray,value:["else","elseif","foreach","if","include","macro","parse","set","stop"]},directivesMatcher:{setter:"_setRegexValue",value:/#[\w]*[^#]*$/},host:{validator:e.isObject},variables:{validator:e.isObject},variablesMatcher:{setter:"_setRegexValue",value:/\$[\w., ()"]*(?:[^$]|\\\$)*$/}},EXTENDS:b.AceEditor.TemplateProcessor,prototype:{getMatch:function(k){var i=this;var j;var h;if((h=k.lastIndexOf("#"))>=0){k=k.substring(h);if(i.get("directivesMatcher").test(k)){j={content:k.substring(1),start:h,type:d};}}else{if((h=k.lastIndexOf("$"))>=0){k=k.substring(h);if(i.get("variablesMatcher").test(k)){j={content:k.substring(1),start:h,type:a};}}}return j;}}});b.AceEditor.AutoCompleteVelocity=g;},"@VERSION@",{requires:["aui-ace-autocomplete-templateprocessor"]});AUI.add("aui-ace-autocomplete",function(a){},"@VERSION@",{use:["aui-ace-autocomplete-base","aui-ace-autocomplete-list","aui-ace-autocomplete-plugin"]});