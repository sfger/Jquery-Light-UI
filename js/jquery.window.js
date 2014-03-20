(function($){
	"use strict";
	$.fn.window=function(options){
		options = $.extend(true, {}, options);
		var handler = (function(){
			var handler = function(box, options){
				return new handler.prototype.init(box, options);
			};
			handler.prototype = {
				init: function(box, options){
					var style = this.style;
					//IE flags{{{
					var css1compat = document.compatMode === "CSS1Compat";
					var ie_doc7    = document.documentMode === 7;
					var isIE       = /MSIE/.exec(navigator.userAgent);
					var isIE6      = /MSIE 6.0/.exec(navigator.userAgent);
					var isIE7      = /MSIE 7.0/.exec(navigator.userAgent);
					var isIE8      = /MSIE 8.0/.exec(navigator.userAgent);
					//}}}
					var container  = $('.window-container').get(0);
					var pop_box    = $('.window-wrapper').get(0);
					var pop_close  = $('.closer').get(0);
					var contents   = $('.contents').get(0);
					var html       = document.documentElement;
					var body       = document.body;
					var scrollTop  = 0;
					var is_show    = false;
					if(isIE6) html.style.overflowY = 'scroll';
					//fn popup{{{
					var popup = function(){
						style.set(body, {'overflow':'hidden'});
						if( ie_doc7 || isIE6 || isIE7 ){
						    if(isIE6) html.style.overflowY="";
						    html.style.overflow="hidden";
						}
						scrollTop = document.documentElement.scrollTop || window.pageYOffset || body.scrollTop;
						is_show = true;
						container.style.display = 'block';
						var winHeight = css1compat ? document.documentElement['clientHeight'] : body.clientHeight;
						var winWidth  = css1compat ? document.documentElement['clientWidth'] : body.clientWidth;
						style.set(container, {
							'z-index':'9999',
							'position':'fixed',
							'top': '0px',
							'left':'0px',
							'width':winWidth+'px',
							'height':winHeight+'px',
							'opacity':'0.6',
							'filter':'alpha(opacity=60)',
							'background':'#000'
						});
						if(isIE6 || !css1compat){
							style.set(container, {
								'position':'absolute',
								'top': scrollTop + 'px'
							});
						}
						style.set(pop_box, {
							'position':'absolute',
							'top':(winHeight-parseInt(style.get(pop_box, 'height')))/4 + 'px',
							'left':(winWidth-parseInt(style.get(pop_box, 'width')))/2 + 'px',
							'margin':'auto',
							'background':'white',
							'box-shadow':'0px 5px 15px white'
						});
						console.log(style.get(contents, 'padding'));
						console.log(style.get(contents, 'padding-top'));
						console.log(style.get(contents, 'padding-bottom'));
						style.set(contents, {height: pop_box.clientHeight - $('.header', pop_box).get(0).offsetHeight - $('.footer', pop_box).get(0).offsetHeight - parseInt(style.get(contents, 'padding-top')) - parseInt(style.get(contents, 'padding-bottom')) + 'px'});
					};
					//}}}

					//window.onresize{{{
					$(window).resize(function(){
						if(!is_show) return false;
						style.set(body, {'overflow':''});
						scrollTop = document.documentElement.scrollTop || window.pageYOffset || body.scrollTop;
						style.set(body, {'overflow':'hidden'});
						var winWidth  = css1compat ? document.documentElement['clientWidth'] : body.clientWidth;
						var winHeight = css1compat ? document.documentElement['clientHeight'] : body.clientHeight;
						style.set(container, {
							'width':winWidth + 'px',
							'height':winHeight + 'px'
						});
						if(isIE6 || !css1compat){
							style.set(container, {
								'top': scrollTop + 'px'
							});
						}
						style.set(pop_box, {
							'top':(winHeight-parseInt(style.get(pop_box, 'height')))/4 + 'px',
							'left':(winWidth-parseInt(style.get(pop_box, 'width')))/2 + 'px'
						});
					});
					if(isIE6 || !css1compat){
						$(window).scroll(function(){
							$(window).resize();
						});
					}
					//}}}
					//pop_close.onclick{{{
					pop_close.onclick = function(){
						is_show = false;
						container.style.display = 'none';
						style.set(body, {'overflow':''});
						if(!css1compat) body.scrollTop = scrollTop;
						else document.documentElement.scrollTop = scrollTop;
						if( ie_doc7 || isIE6 || isIE7 ){
						    if(isIE6) html.style.overflowY="scroll";
						    html.style.overflow="";
						}
					};
					//}}}
					popup();
				},
				style: (function(){
					var key_trans = function(key){
						return  key.replace(/\-(\w)/g, function($, $1){ return $1.toUpperCase(); });
					};
					return {
						get: document.defaultView ? function(el, style){
							return document.defaultView.getComputedStyle(el, null).getPropertyValue(style);
						}:function(el,style){
							return el.currentStyle[key_trans(style)]=='medium' ? 0 : el.currentStyle[key_trans(style)];
						},
						set: function(el, css){
							for(var key in css){
								el.style[key_trans(key)] = css[key];
							}
						}
					};
				})()
			};
			handler.prototype.init.prototype = handler.prototype;
			return handler;
		})();
		return handler(this, options);
	};
})(jQuery);

/* vim: set fdm=marker: */
