(function($){
"use strict";
$.fn.window=function(options){
	options = $.extend(true, {
		title: 'title',
		show: false
	}, options);
	var handler = (function(){
		var handler = function(box, options){
			return new handler.prototype.init(box, options);
		};
		handler.prototype = {
			init: function(box, options){
				var w = $( '<div class="window-container">' +
					'<div class="window-wrapper clearfix">' +
						'<div class="window-bar header clearfix">' +
							'<span class="title" style="float:left">Title</span>' +
							'<a href="javascript:;" class="button closer">×</a>' +
						'</div>' +
						'<div class="contents"></div>' +
						'<div class="window-bar footer clearfix">' +
							// '<a href="javascript:;" class="button">确定</a>' +
							// '<a href="javascript:;" class="button">取消</a>' +
							'<input type="button" class="button" value="确定">' +
							'<input type="button" class="button" value="取消">' +
						'</div>' +
					'</div>' +
				'</div>' ).appendTo(document.body);
				this.userOptions = options;
				this.container  = w.get(0);
				this.wraper     = $('.window-wrapper', w).get(0);
				this.closer     = $('.closer', w).get(0);
				this.contents   = $('.contents', w).get(0);
				this.title		= $('.title', w).html(options.title).get(0);
				box.appendTo(this.contents);
				var that = this;
				$(['Height', 'Width']).each(function(i, one){
					that['getView'+one] = (function () {
						var container = "BackCompat" === document.compatMode ? document.body : document.documentElement;
						return function () {
							return container['client'+one];
						};
					}());
					that['getElement'+one] = function (e) {
						if(!e || e.style.display==='none') return 0;
						return e['offset'+one];
					};
				});
				// if(isIE6) document.documentElement.style.overflowY = 'scroll';

				$(window).resize(function(){that.resize()});
				// if(isIE6 || !css1compat){
				// 	$(window).scroll(function(){
				// 		$(window).resize();
				// 	});
				// }
				$(this.closer).on('click', function(e){
					that.close();
					e.preventDefault();
					e.stopPropagation();
					return false;
				});
				if(options.show) this.show();
			},
			show: function(){
				var html = document.documentElement;
				var body = document.body;
				var $container = $(this.container),
					$contents  = $(this.contents),
					wraper     = this.wraper;
				var css1compat = document.compatMode === "CSS1Compat";
				var isIE6      = /MSIE 6.0/.exec(navigator.userAgent);
				$([html, body]).css({overflow:'hidden'});
				$container.show();
				var scrollTop = html.scrollTop || window.pageYOffset || body.scrollTop;
				var viewHeight = this.getViewHeight();
				var viewWidth = this.getViewWidth();
				$container.css({width:viewWidth, height:viewHeight});
				if(isIE6 || !css1compat){
					$container.css({'position':'absolute', 'top':scrollTop});
				}
				$(wraper).css({
					'top':(viewHeight - this.getElementHeight(wraper))/4,
					'left':(viewWidth - this.getElementWidth(wraper))/2
				});
				$contents.css({
					height: wraper.clientHeight
						- $('.header', wraper).get(0).offsetHeight
						- $('.footer', wraper).get(0).offsetHeight
						- parseInt($contents.css('paddingTop'))
						- parseInt($contents.css('paddingBottom'))
				});
				return this;
			},
			resize: function(){
				if( $(document.body).css('overflow')!=='hidden' ) return false;
				var viewWidth  = this.getViewWidth(),
					viewHeight  = this.getViewHeight(),
					wraper = this.wraper;
				$(this.container).css({width:viewWidth, height:viewHeight});
				$(wraper).css({
					left: (viewWidth - wraper.offsetWidth)/2,
					top: (viewHeight - wraper.offsetHeight)/4
				});
				return this;
			},
			close: function(){
				var options = this.userOptions;
				if( options.beforeClose
					&& typeof options.onClose==='function'
					&& !options.beforeClose() ) return false;
				this.container.style.display = 'none';
				$([document.documentElement, document.body]).css({overflow:''});
				if(options.onClose && typeof options.onClose==='function') options.onClose();
				return this;
			}
		};
		handler.prototype.init.prototype = handler.prototype;
		return handler;
	})();
	return handler(this, options);
};
})(jQuery);
/* vim: set fdm=marker: */
