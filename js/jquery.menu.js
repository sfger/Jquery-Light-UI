"use strict";
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

(function($){
"use strict";
$.fn.menu=function(options){
	options = $.extend(true, {
		animate: {time:0},
		data: []
	}, options);
	var handler = (function(){
		var handler = function(box, options){
			return new handler.prototype.init(box, options);
		};
		handler.prototype = {
			init: function(box, options){
				var that = this;
				var document = window.document;
				var getType = function(obj){ return toString.call(obj).slice(8, -1); };
				box.addClass('menu-container').addClass('clearfix').hide();
				$('<div style="position:relative;"><div class="menu-vertical-line"></div></div>').appendTo(box);;
				this.menuitems = {};
				var createMenu = function(data){
					var ul = document.createElement('ul');
					for(var i=0,ii=data.length-1; i<=ii; i++){
						var li = document.createElement('li');
						if(data[i]['class']=='separate'){
							var line = document.createElement('span');
							li.className = data[i]['class'];
						}else{
							var line = document.createElement('a');
							var icon = document.createElement('span');
							var text = document.createElement('span');
							icon.className = 'icon' + (data[i].icon ? ' icon-'+data[i].icon : '');
							line.appendChild(icon);
							text.innerHTML = data[i].text||'';
							text.className = 'text';
							line.appendChild(text);
							line.setAttribute('href', 'javascript:;');
							if(data[i]['class']) li.className = data[i]['class'];
							that.menuitems[data[i].name] = li;
						}
						li.appendChild(line);
						ul.appendChild(li);
					}
					return ul;
				};
				var w = $(createMenu(options.data)).appendTo(box.find('>div'));
				box.show();
				if(document.documentMode===5 || /MSIE 6/.test(navigator.userAgent)){
					box.find('.menu-vertical-line').css({height:w.height()+'px'});
				}
			},
			show: function(){
			},
			hide: function(){
			},
			/* option: [Object] just options.data object item
			 * position: [String] before, after
			 * target menu item name
			 * */
			hideMenuItem: function(name){
			},
			showMenuItem: function(name){
			},
			addMenuItem: function(option, position, target){
			},
			updateMenuItem: function(name, option){
			},
			deleteMenuImte: function(){
			}
		};
		handler.prototype.init.prototype = handler.prototype;
		return handler;
	})();
	return handler(this, options);
};
})(jQuery);
/* vim: set fdm=marker : */
