"use strict";
(function($){
$.fn.window=function(options){
	if(!options){
		var iWindows = [];
		this.each(function(){
			if(this.ui && this.ui.iWindow) iWindows.push(this.ui.iWindow);
			else throw new Error('UI does not init...');
		});
		return iWindows;
	}
	options = $.extend(true, {
		title: 'title',
		show: false,
		footer: {}
	}, options);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	handler.prototype = {
		init: function(box, options){
			var $box = $(box);
			var w = $( '<div class="window-container">' +
				'<div class="window-wrapper clearfix">' +
					'<div class="window-bar header clearfix">' +
						'<a href="javascript:;" class="closer">×</a>' +
						'<span class="title">'+(options.title||'')+'</span>' +
					'</div>' +
					'<div class="contents"></div>' +
					(options.footer.formatter ? (function(){
						return '<div class="window-bar footer clearfix">' +
							options.footer.formatter() +
							'</div>';
					})() : '') +
				'</div>' +
			'</div>' ).appendTo(document.body);
			this.userOptions = options;
			this.container   = w.get(0);
			this.render		 = box;
			this.wraper      = $('.window-wrapper', w).get(0);
			this.closer      = $('.closer', w).get(0);
			this.contents    = $('.contents', w).get(0);
			this.title		 = $('.title', w).html(options.title).get(0);
			$box.show().appendTo(this.contents);
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
			var fix_position = function(n){ return n<0?0:n; };
			$(wraper).css({
				'top':fix_position((viewHeight - this.getElementHeight(wraper))/4),
				'left':fix_position((viewWidth - this.getElementWidth(wraper))/2)
			});
			$contents.css({
				height: (wraper.clientHeight>viewHeight ? viewHeight : wraper.clientHeight)
					- $('.header', wraper).get(0).offsetHeight
					- (this.userOptions.footer.formatter ? $('.footer', wraper).get(0).offsetHeight : 0)
					- (isIE6 || !css1compat ? 0 : parseInt($contents.css('paddingTop')))
					- (isIE6 || !css1compat ? 0 : parseInt($contents.css('paddingBottom')))
			});
			return this;
		},
		resize: function(){
			if( $(document.body).css('overflow')!=='hidden' ) return false;
			var css1compat = document.compatMode === "CSS1Compat";
			var isIE6      = /MSIE 6.0/.exec(navigator.userAgent);
			var viewWidth   = this.getViewWidth(),
				viewHeight  = this.getViewHeight(),
				wraper      = this.wraper,
				$contents   = $(this.contents);
			$(this.container).css({width:viewWidth, height:viewHeight});
			var fix_position = function(n){ return n<0?0:n; };
			$(wraper).css({
				'top':fix_position((viewHeight - wraper.offsetHeight)/4),
				'left':fix_position((viewWidth - wraper.offsetWidth)/2)
			});
			this.contents.style.height = '';
			$contents.css({
				height: (wraper.clientHeight>viewHeight ? viewHeight : wraper.clientHeight)
					- $('.header', wraper).get(0).offsetHeight
					- (this.userOptions.footer.formatter ? $('.footer', wraper).get(0).offsetHeight : 0)
					- (isIE6 || !css1compat ? 0 : parseInt($contents.css('paddingTop')))
					- (isIE6 || !css1compat ? 0 : parseInt($contents.css('paddingBottom')))
			});
			return this;
		},
		close: function(){
			var options = this.userOptions;
			if( options.onBeforeClose
				&& typeof options.onClose==='function'
				&& !options.onBeforeClose() ) return false;
			this.container.style.display = 'none';
			$([document.documentElement, document.body]).css({overflow:''});
			if(options.onClose && typeof options.onClose==='function') options.onClose();
			return this;
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		this.ui = {
			iWindow: handler(this, $.extend({}, options))
		}
	});
	// return handler(this, options);
};
})(jQuery);
/* vim: set fdm=marker: */
