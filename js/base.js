// light {{{
var light = {
	// ui {{{
	ui:{
		markChars:{up: '↑', down : '↓', expand:'▼', fold:'▲', empty:'&nbsp;&nbsp;'}
	},
	// }}}
	// util {{{
	util:{
		slice:Array.prototype.slice,
		push:Array.prototype.push,
		toString:Object.prototype.toString,
		hasOwnProperty:Object.prototype.hasOwnProperty,
		getType:function(obj){ return light.ui.toString.call(obj).slice(8, -1); },
		isWindow:function(obj){ return obj!=null && obj==obj.window; },
		isPlainObject:function(obj){
			if(light.util.getType(obj)!=="object" || obj.nodeType || light.util.isWindow(obj)) return false;
			try{
				if(obj.constructor && !light.util.call(obj.constructor.prototype, "isPrototypeOf")) return false;
			}catch(e){
				return false;
			}
			return true;
		},
		// method extend {{{
		extend:function(){
			var i = 1,
				target = arguments[0],
				deep = false,
				len = arguments.length;
			if(typeof target=='boolean'){
				deep = target,
				target = arguments[i++] || {};
			}
			var getType = light.util.getType;
			var targetType = getType(target);
			if(!targetType in {"Object":1, "Function":1}) target = {};
			if(i===len) target = {}, i--;
			for(; i<len; i++){
				var options = arguments[i];
				if(options != null){
					for(var name in options){
						var src = target[name],
							copy = options[name],
							copyType = getType(copy),
							srcType = getType(src);
						if(target === copy) continue;
						if(deep && copy && (light.util.isPlainObject(copy) && copyType ==='Array')){
							var clone = (copyType==='Array')
									? (src && (srcType==='Array') ? src : [])
									: (src && (light.util.isPlainObject(copy)) ? src : {});
							target[name] = light.util.extend(deep, clone, copy);
						}else if(copy!==undefined){
							target[name] = copy;
						}
					}
				}
			}
			return target;
		},
		// }}}
		//method createElement {{{
		createElement:function(node){
			var getType = light.util.getType;
			var cd = '',
				at=[],
				attr = null,
				children = null,
				fn = light.util.createElement,
				node_type = getType(node);
			if(node_type === 'Array'){
				for(var j in node) cd += fn(node[j]);
			}else{
				if(node_type==="String" || node_type=="Number"){
					cd = node;
				}else if(node_type==='Object' && node.name){
					attr = node.attr, children = node.children, at = [];
					if(attr){
						for(var key in attr){
							if(key=='className'){
								at.push('class="' + attr[key] + '"');
								continue;
							}else if(key=='style'){
								var style = attr[key];
								var ot = getType(style);
								attr[key] = '';
								if(ot=='Object'){
									for(var sk in style){
										attr[key] += sk + ':' + style[sk] + ';';
									}
								}else if(ot=='String'){
									attr[key] = style;
								}
							}
							at.push('' + key + '="' + attr[key] + '"');
						}
					}
					if(at.length) at.unshift('');
					if(children && getType(children) !== 'Array') children = [children];
					cd = '<' + node.name + at.join(' ') + '>' + (children ? fn(children) : '') + '</' + node.name + '>';
				} else cd = '';
			}
			return cd;
		}
		//}}}
	},
	// }}}
	// Event {{{
	Event: {
		on:function(eventType, target, fn, useCapture){
			var a = function(eventType, bindFn, useCapture){
				var w3c = window.addEventListener ? true : false;
				this[w3c ? 'addEventListener' : 'attachEvent'](
					(w3c ? '': 'on') + eventType,
					bindFn,
					useCapture
				);
			};
			fn.bindEventListener = function(e){ fn.call(e.target||e.srcElement, e||event); };
			a.apply(target, [
				eventType,
				fn.bindEventListener,
				(useCapture === undefined) ? true : useCapture
			]);
		},
		off:function(eventType, target, fn, useCapture){
			var w3c = window.removeEventListener ? true : false;
			target[w3c ? 'removeEventListener' : 'detachEvent'](
				(w3c ? '': 'on') + eventType,
				fn.bindEventListener,
				(useCapture === undefined) ? true : useCapture
			);
		},
		stop:function(e){
			if(e.stopPropagation) e.stopPropagation();
			else e.cancelBubble = true;
		},
		prevent:function(e){
			if(e.preventDefault) e.preventDefault();
			else e.returnValue = false;
		}
	}
	// }}}
};
// }}}

/* vim: set fdm=marker : */
