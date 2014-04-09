"use strict";
var toString = Object.prototype.toString;
var getType = function(obj){ return toString.call(obj).slice(8, -1); };
// Extend ECMAScript5 features {{{
if(!Object.keys){
	Object.keys = function(o){
		if(o !== Object(o)){
			throw new TypeError('Object.keys called on a non-object');
		}
		var k=[], p;
		for(p in o){
			if(Object.prototype.hasOwnProperty.call(o,p)){
				k.push(p);
			}
		}
		return k;
	};
}
if(typeof Array.prototype.forEach != "function"){
	Array.prototype.forEach = function(fn, scope){
		for(var i=0,len=this.length; i<len; ++i){
			if(i in this){
				fn.call(scope, this[i], i, this);
			}
		}
	};
}
if(!Function.prototype.bind){
	Function.prototype.bind = function(oThis){
		if(typeof this!=="function"){
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP    = function(){},
			fBound  = function(){
				return fToBind.apply(
					this instanceof fNOP && oThis ? this : oThis || window,
					aArgs.concat(Array.prototype.slice.call(arguments))
				);
			};
		fNOP.prototype   = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}
if(typeof Array.prototype.indexOf != "function"){
	Array.prototype.indexOf = function(searchElement, fromIndex){
		var index = -1;
		fromIndex = fromIndex*1 || 0;
		for (var k=0, length=this.length; k<length; k++) {
			if(k>=fromIndex && this[k]===searchElement){
				index = k;
				break;
			}
		}
		return index;
	};
}
if(typeof Array.prototype.lastIndexOf != "function"){
	Array.prototype.lastIndexOf = function(searchElement, fromIndex){
		var index = -1, length = this.length;
		fromIndex = fromIndex*1 || length-1;
		for(var k=length-1; k>-1; k-=1){
			if(k<=fromIndex && this[k] === searchElement){
				index = k;
				break;
			}
		}
		return index;
	};
}
if(typeof Array.prototype.reduce != "function"){
	Array.prototype.reduce = function(callback, initialValue){
		var previous = initialValue, k = 0, length = this.length;
		if(typeof initialValue === "undefined"){
			previous = this[0];
			k = 1;
		}

		if(typeof callback === "function"){
			for(k; k<length; k++){
				this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
			}
		}
		return previous;
	};
}

if(typeof Array.prototype.reduceRight != "function"){
	Array.prototype.reduceRight = function(callback, initialValue ){
		var length = this.length, k = length - 1, previous = initialValue;
		if(typeof initialValue === "undefined"){
			previous = this[length - 1];
			k--;
		}
		if(typeof callback === "function"){
			for(k; k>-1; k-=1){          
				this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
			}
		}
		return previous;
	};
}

if(!Date.now){
	Date.now = function(){
		return (new Date).valueOf();
	};
}
if(!String.prototype.trim){
	String.prototype.trim = function(){
		return this.replace(/^\s+|\s+$/g, '');
	};
}
if(typeof Array.prototype.map != "function"){
	Array.prototype.map = function(fn, context){
		var arr = [];
		if(typeof fn === "function"){
			for(var k=0, length=this.length; k<length; k++) {
				arr.push(fn.call(context, this[k], k, this));
			}
		}
		return arr;
	};
}
if(typeof Array.prototype.filter != "function"){
	Array.prototype.filter = function(fn, context){
		var arr = [];
		if(typeof fn === "function"){
			for(var k=0, length=this.length; k<length; k++){
				fn.call(context, this[k], k, this) && arr.push(this[k]);
			}
		}
		return arr;
	};
}
if(typeof Array.prototype.some != "function"){
	Array.prototype.some = function(fn, context){
		var passed = false;
		if(typeof fn === "function"){
			for (var k=0, length=this.length; k<length; k++) {
				if(passed === true) break;
				passed = !!fn.call(context, this[k], k, this);
			}
		}
		return passed;
	};
}
if(typeof Array.prototype.every != "function"){
	Array.prototype.every = function(fn, context){
		var passed = true;
		if(typeof fn === "function"){
			for(var k=0, length=this.length; k<length; k++){
				if(passed === false) break;
				passed = !!fn.call(context, this[k], k, this);
			}
		}
		return passed;
	};
}
// }}}

// fn createElement {{{
var createElement = function(node){
	var ret = document.createDocumentFragment(),
		fn = createElement,
		node_type = getType(node),
		text = {String:1, Number:1},
		hasOwnProperty = Object.prototype.hasOwnProperty;
	if(node_type === 'Array'){
		for(var i in node) ret.appendChild(fn(node[i]));
	}else if(text[node_type]){
		ret.appendChild(document.createTextNode(node));
	}else if(node.nodeType && node.nodeName){
		ret.appendChild(node);
	}else if(node_type==='Object' && node.name){
		var element = document.createElement(node.name),
			attr = node.attr, children = node.children;
		if(attr){
			for(var key in attr){
				if(key in {'class':1, 'className':1}){
					element.className = attr[key];
				}else if(key==='style'){
					var style = attr[key], ot = getType(style);
					if(ot=='Object'){
						for(var sk in style)
							if(hasOwnProperty.call(style, sk))
								element.style[sk] = style[sk];
					}else if(ot=='String'){
						element.style.cssText = style;
					}
				}else{
					if(key==='rowspan') element.rowSpan = attr[key];
					if(key==='colspan') element.colSpan = attr[key];
					else element.setAttribute(key, attr[key]);
				}
			}
		}
		if(children){
			if(text[getType(children)]) element.innerHTML = children;
			else element.appendChild(fn(children));
		}
		ret.appendChild(element);
	}
	if(!ret.children) ret.children = ret.childNodes;
	return ret;
};
// }}}
(function($){
$.fn.datagrid=function(options){
	options = $.extend(true, {
		colWidth:80,
		data:[]
	}, options);
	var handler = (function(){
		var handler = function(box, options){
			return new handler.prototype.init(box, options);
		};
		handler.prototype = {
			init: function(box, options){
				var document = window.document;
				var that = this;
				that.frozenColumns = [];
				that.columns = [];
				this.userOptions = options;
				box.addClass('datagrid-container clearfix');
				this.container = box.get(0);
				// fn get_table{{{
				var get_table = function(){
					var get_head_rows = function(rows, isFrozen){
						var ret = [];
						var l = 0;
						var colsType = isFrozen ? 'frozenColumns' : 'columns';
						if(!rows) return ret;
						var ii = rows.length - 1;
						for(var i=ii; i>=0; i--){
							ret.push(createElement({name:'tr', children:(function(){
								var nodes = [];
								for(var j=rows[i].length-1; j>=0; j--){
									var option = rows[i][j];
									var title = (option.name || option.field || '');
									var width = options.autoColWidth ? 'auto' : ((option.width||options.colWidth) + 'px');
									var td_attr = {};
									if(option.rowspan) td_attr.rowspan = option.rowspan;
									if(option.colspan) td_attr.colspan = option.colspan;
									var colspan = option.colspan || 1;
									if(colspan==1) that[colsType].push(option);
									nodes.unshift(createElement({
										name:'td', attr:td_attr, children:{
											name:'div', attr:{className:'cell', style:{width:width}}, children:title
										}
									}));
								}
								if(isFrozen && i==0 && options.rowNum){
									nodes.unshift(createElement({
										name:'td', attr:{rowspan:options.frozenColumns.length}, children:{
											name:'div', attr:{className:'cell'}
										}
									}));
								}
								return nodes;
							})()}));
						}
						that[colsType] = that[colsType].reverse();
						return ret.reverse();
					};
					var get_data_rows = function(data, cols, isLeft){
						var ret = [];
						data.forEach(function(row, i){
							ret.push(createElement({
								name:'tr', children:(function(){
									var nodes = [];
									if(options.rowNum && isLeft)
										nodes.push(createElement({name:'td', children:{name:'div', attr:{className:'cell'}, children:i+1}}));
									cols && cols.forEach(function(option, ii){
										if(!option) return true;
										var field = option.field, val = row[field], formatter = option.formatter;
										var show = getType(formatter)==='Function' ? formatter(val, row, field) : val;
										nodes.push(createElement({name:'td', children:{name:'div', attr:{className:'cell', style:{width:options.autoColWidth ? 'auto' : ((option.width||options.colWidth) + 'px')}}, children:show}}));
									});
									return nodes;
								})()
							}));
						});
						return ret;
					};
					return createElement({
						name:'div', attr:{className:'view-wrapper' + (options.autoRowHeight ? ' autoRowHeight' : '')}, children:[{
							name:'div', attr:{className:'view frozen'}, children:[{
								name:'div', attr:{className:'head-wrapper'}, children:{
									name:'table', attr:{className:'frozen head'}, children:{
										name:'tbody', children:get_head_rows(options.frozenColumns, true)
									}
								}
							}, {
								name:'div', attr:{className:'body-wrapper', style:'overflow:hidden;'}, children:{
									name:'table', attr:{className:'frozen body'}, children:{
										name:'tbody', children:
											get_data_rows(data, that.frozenColumns, true)
									}
								}
							}
						]}, {
							name:'div', attr:{className: 'view'}, children:[{
								name:'div', attr:{style:'overflow:hidden'}, children:{
									name:'div', attr:{className: 'head-wrapper'}, children:{
										name:'table', attr:{className: 'head'}, children:{
											name:'tbody', children:get_head_rows(options.columns)
										}
									}
								}
							}, {
								name:'div', attr:{className: 'body-wrapper'}, children:{
									name:'table', attr:{className: 'body'}, children:{
										name:'tbody', children:
											get_data_rows(data, that.columns)
									}
								}
							}]
						}]
					});
				};
				// }}}

				//fn align_table{{{
				var align_table = function(tables){
					if(tables.length==4){
						var tp0 = tables.eq(2).parent(),
							tp1 = tables.eq(3).parent();
						tp0.css({width:500000});
						tp1.css({width:500000});
						var getHW = function(el, type){
							return (document.documentMode===5 || /MSIE 6/.test(navigator.userAgent))
								? el['offset'+('width'==type ? 'Width' : 'Height')] + 1
								: $(el)[type]();
						}
						var align_td = function(a, b, type){
							$.each(a, function(i, one){
								if(this.getAttribute('rowspan') > 1 && type=='height') return true;
								if(this.getAttribute('colspan') > 1 && type=='width') return true;
								var t1  = getHW(this.children[0], type),
									t1p = getHW(this, type),
									t2  = getHW(b[i].children[0], type),
									t2p = getHW(b[i], type);
								var s = type==="height" ? true: false;
								if(t1<t1p) t1 = t1p;
								if(t2<t2p) t2 = t2p;
								var t = t1<t2 ? t2 : t1;
								$(this.children[0])[type](t);
								$(b[i].children[0])[type](t);
								if(s){
									$(this)[type]($(this)[type]());
									$(this.children[0])[type]('auto');
									$(b[i])[type]($(b[i])[type]());
									$(b[i].children[0])[type]('auto');
								}
								// if(t1<t2) $(this.children[0])[type](t2);
								// else $(b[i].children[0])[type](t1);
							});
						};
						var data_tds = tables.eq(3).find('tr:first-child td'),
							col_tds  = tables.eq(3).find('tr td:first-child'),
							row_tds  = tables.eq(2).find('td:first-child');
						// col_tds.length && align_td(tables.eq(1).find('tr:first-child td'), col_tds, 'height');
						(options.autoColWidth && data_tds.length) && align_td(tables.eq(2).find('tr:last-child td'), data_tds, 'width');
						var frozen_tds = tables.eq(1).find('tr:last-child td');
						(options.autoColWidth && frozen_tds.length) && align_td(tables.eq(0).find('tr:first-child td'), frozen_tds, 'width');
						// (options.autoRowHeight && (options.rowNum || frozen_tds.length)) && align_td(tables.eq(0).find('td:first-child'), row_tds, 'height');
						(options.autoRowHeight && (options.rowNum || frozen_tds.length)) && align_td(tables.eq(1).find('td:first-child'), col_tds, 'height');
						(options.rowNum && !options.autoColWidth) && align_td(tables.eq(0).find('tr:first-child td:first-child'), tables.eq(1).find('tr:first-child td:first-child'), 'width');

						var width = tables.eq(3).width() + 2;
						tp1.width(width);
						tables.eq(2).css('width', width);
						tables.eq(3).css('width', width);
						var width_full = document.compatMode === "CSS1Compat" ? 'auto' : '100%';
						tp1.css({width:width_full});
						tp0.parent().css({width:width_full, overflow:'hidden'});
						$(tp1).on('scroll', function(){
							tp0.parent().get(0).scrollLeft = this.scrollLeft;
							tables.get(1).parentNode.scrollTop = this.scrollTop;
						});
					}
				};
				//}}}

				$(get_table(options.data)).appendTo(box);
				align_table($('table', box));
				if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
					box.find('.view').css({height: $('.head-wrapper').get(0).offsetHeight + $('.body-wrapper').get(0).offsetHeight})// css height:100% fix,
						.eq(0).css({width:box.find('.view').eq(0).find('table').eq(0).width()});// css display:inline fix

					// css selector fix
					$('.body-wrapper table, .body-wrapper table tr:first-child td', box).css({borderTop:'none'});
					box.delegate('tr', {// css tr:hover fix
						mouseenter: function(){
							this.style.backgroundColor = '#e6e6e6';
						},
						mouseleave: function(){
							this.style.backgroundColor = 'transparent';
						}
					});
				}
				+function(){// css selector fix
					var fie = navigator.userAgent.match(/MSIE (\d*)/);
					if(fie && fie[1]<9){
						$('.view', box).eq(1).find('table, table td:first-child').css({borderLeft:'none'});
					}
				}();
				options.onCreate.bind(this)();
				$(window).on('resize', function(){ that.resize(); });
				$(window).resize();
				setTimeout(function(){ $(window).resize(); }, 0);
			},
			resize: function(){
				var dataViews = $('.view', this.container);
				var tables = $('table', dataViews);
				tables.eq(1).parent().css({height:tables.get(3).parentNode.clientHeight});
				dataViews.eq(1).css({width: this.container.clientWidth - 1 - dataViews.get(0).offsetWidth});
			}
		};
		handler.prototype.init.prototype = handler.prototype;
		return handler;
	})();
	return handler(this, options);
};
})(jQuery);
/* vim: set fdm=marker : */
