"use strict";
var getGlobal = function(){ return this || (1, eval)('this'); };
var global = getGlobal();
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

// fn create_node {{{
var create_node = function(node){
	var cd = '',
		at=[],
		attr = null,
		children = null,
		fn = create_node,
		node_type = getType(node),
		hasOwnProperty = Object.prototype.hasOwnProperty;
	if(node_type === 'Array'){
		for(var j in node) cd += fn(node[j]);
	}else{
		if(node_type in {'String':1, 'Number':1}){
			cd = node;
		}else if(node_type==='Object' && node.name){
			attr = node.attr, children = node.children, at = [];
			if(attr){
				for(var key in attr){
					if(key=='style'){
						var style = attr[key];
						var ot = getType(style);
						attr[key] = '';
						if(ot=='Object'){
							for(var sk in style){
								if(hasOwnProperty.call(style, sk)) attr[key] += sk + ':' + style[sk] + ';';
							}
						}else if(ot=='String'){
							attr[key] = style;
						}
					}
					at.push('' + key + '="' + attr[key] + '"');
				}
			}
			if(at.length) at.unshift('');
			if(getType(children) !== 'Array') children = [children];
			cd = '<' + node.name + at.join(' ') + '>' + fn(children) + '</' + node.name + '>';
		} else cd = '';
	}
	return cd;
};
// }}}

// fn get_table_content{{{
var get_table_content = function(data, head){
	head = head || [];
	var s = '<div class="view-wrapper"><div class="data-view"><div class="data-head-wrapper"><table>';
	s += '<tr><td><div></div></td></tr>';
	s += '</table></div><div class="data-body-wrapper" style="overflow:hidden;"><table>';
	for(var l=0; l<data.length; l++){
		s += '<tr><td><div>' + (l+1) + '</div></td></tr>';
	}
	s += '</table></div></div>';
	s += '<div class="data-view"><div style=""><div class="data-head-wrapper"><table class="data-head" cellspacing="0" cellpading="0"><tr class="thead">';
	if(head.length){
		$.each(head, function(i, one){ s += create_node({name:td, children:one}); });
	}else{
		for(var j in data[0]){
			head.push(j);
			s += create_node({name:'td', children:[{name:'div', children:j}]});
		}
	}
	s += '</tr></table></div></div><div class="data-body-wrapper"><table class="data-body" cellspacing="0" cellpading="0">';
	$(data).each(function(i, one){
		var up = '';
		s += '<tr>';
		head.forEach(function(two, k){
			s += create_node({
				name: 'td',
				attr: {style:{'text-align':'right'}},
				children: [{name:'div', children:one[two]}]
			});
		});
		s += '</tr>';
	});
	return s += '</table></div></div></div>';
};
// }}}

//fn resize_frozen_table{{{
var resize_frozen_table = function(tables){
	if(tables.length==4){
		var data_tds = tables.eq(3).find('tr:first-child td'),
			col_tds  = tables.eq(3).find('tr td:first-child'),
			row_tds  = tables.eq(2).find('tr:first-child td'),
			tp0 = tables.eq(2).parent(),
			tp1 = tables.eq(3).parent();
		tp0.css({width:500000});
		tp1.css({width:500000});
		var getHW = function(el, type){
			var fie = document.documentMode===5 || /MSIE 6/.test(navigator.userAgent);
			if(fie){
				type = 'width'==type ? 'Width' : 'Height';
				return el['offset'+type];
			}else{
				return $(el).css(type);
			}
		}
		$.each(tables[1].children[0].children, function(i, one){
			var h1 = getHW(this.children[0].children[0], 'height'),
				h2 = getHW(col_tds[i].children[0], 'height'),
				that = this;
			if(h1<h2){
				$(that.children[0].children[0]).css({height:h2});
			}else{
				$(col_tds[i].children[0]).css({height:h1});
			}
		});
		$.each(tables[2].children[0].children[0].children, function(i, one){
			var w1 = getHW(this.children[0], 'width'),
				w2 = getHW(data_tds[i].children[0], 'width'),
				that = this;
			if(w1<w2){
				$(that.children[0]).css({width:w2});
			}else{
				$(data_tds[i].children[0]).css({width:w1});
			}
		});

		var frozen_tds = tables.eq(1).find('tr:first-child td');
		$.each(tables[0].children[0].children[0].children, function(i, one){//table 0, 1 width
			var w1 = getHW(this.children[0], 'width'),
				w2 = getHW(frozen_tds[i].children[0], 'width'),
				that = this;
			if(w1<w2){
				$(this.children[0]).css({width:w2});
			}else{
				$(frozen_tds[i].children[0]).css({width:w1});
			}
		});
		+function(){//table 0,2 height
			var td = tables[0].children[0].children[0].children[0];
			var h1 = getHW(td.children[0], 'height'),
				h2 = getHW(row_tds[0].children[0], 'height');
			if(h1<h2){
				$(td.children[0]).css({height:h2});
			}else{
				$(row_tds[0].children[0]).css({height:h1});
			}
		}();

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

(function($){
$.fn.datagrid=function(options){
	options = $.extend(true, {
		data: []
	}, options);
	var handler = (function(){
		var handler = function(box, options){
			return new handler.prototype.init(box, options);
		};
		handler.prototype = {
			init: function(box, options){
				var document = window.document;
				var that = this;
				this.userOptions = options;
				$(['Height', 'Width']).each(function(i, one){
					that['getView'+one] = (function () {
						var container = "BackCompat" === document.compatMode ? document.body : document.documentElement;
						return function () {
							return container['client'+one];
						};
					}());
				});
				box.addClass('datagrid-container clearfix');
				this.container = box.get(0);
				var w = $(get_table_content(options.data)).appendTo(box);
				if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
					w.find('.data-view').css({height: $('.data-head-wrapper').get(0).offsetHeight + $('.data-body-wrapper').get(0).offsetHeight}).eq(0).css({width:w.find('.data-view').eq(0).find('table').eq(0).width()});
					$('.data-body-wrapper table, .data-body-wrapper table tr:first-child td').css({borderTop:'none'});
				}
				resize_frozen_table($('table', w));
				options.onCreate.bind(this)();
				$(window).on('resize', function(){
					var tables = $('table');
					tables.eq(1).parent().css({height:tables.get(3).parentNode.clientHeight});
					var dataViews = $('.data-view', w);
					dataViews.eq(1).css({width: that.container.clientWidth -  dataViews.get(0).offsetWidth});
				});
				$(window).resize();
				setTimeout(function(){ $(window).resize(); }, 0);
			}
		};
		handler.prototype.init.prototype = handler.prototype;
		return handler;
	})();
	return handler(this, options);
};
})(jQuery);
/* vim: set fdm=marker : */
