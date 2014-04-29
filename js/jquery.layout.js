(function($){
"use strict";
$.fn.layout=function(options){
	if(!options){
		var iLayouts = [];
		this.each(function(){
			if(this.ui && this.ui.iLayout) iLayouts.push(this.ui.iLayout);
			else throw new Error('UI does not init...');
		});
		return iLayouts;
	}
	options = $.extend(true, {
		panel: {
			toggle:true,
			resize:true,
			each:{
				north:{toggle:false,resize:false},
				south:{toggle:false,resize:false},
				west:{toggle:true,resize:true},
				east:{toggle:true,resize:true}
			}
		},
		panelBar: {
			size:5,
			each:{
				north:{/*height:4*/},
				south:{/*height:4*/},
				west:{/*width:1*/},
				east:{/*width:1*/}
			}
		}
	}, options);
	var handler = function(box, options){
		return new handler.prototype.init(box, options);
	};
	handler.prototype = {
		init: function(box, options){
			this.box = box;
			this.userOptions = options;
			this.panels = {
				north: $('.layout-north', box).get(0),
				south: $('.layout-south', box).get(0),
				west: $('.layout-west', box).get(0),
				east: $('.layout-east', box).get(0),
				center: $('.layout-center', box).get(0)
			};
			this.panelBars = {
				north: $('.bar-north', box).css({height:options.panelBar.each.north.height||options.panelBar.size}).get(0),
				south: $('.bar-south', box).css({height:options.panelBar.each.south.height||options.panelBar.size}).get(0),
				west: $('.bar-west', box).css({width:options.panelBar.each.west.width||options.panelBar.size}).get(0),
				east: $('.bar-east', box).css({width:options.panelBar.each.east.width||options.panelBar.size}).get(0)
			};
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
			if(options.panel.resize) this.panelResize();
			if(options.panel.toggle) this.panelToggle();
			$(window).resize(function(){that.resize()});
			this.resize();
		},
		disableSelection: function(){
			if(window.getSelection){
				window.getSelection().removeAllRanges();
			}else if(document.selection){
				document.selection.empty();
			}
		},
		panelResize: function(){
			var box = this.box,
				that = this;
			$('.resize-bar').on({
				'mousedown': function(e){
					if(e.target.nodeName=="SPAN") return false;
					var pops = that.userOptions.panel.each;
					var bar = this,
						$bar = $(bar);
					if( $bar.hasClass('bar-north')&&pops.north.resize===false
						|| $bar.hasClass('bar-south')&&pops.south.resize===false
						|| $bar.hasClass('bar-west')&&pops.west.resize===false
						|| $bar.hasClass('bar-east')&&pops.east.resize===false ) return false;
					var resize_box = $bar.hasClass('bar-south') ? $bar.next() : $bar.prev();
					if(resize_box.get(0).style.display==='none') return false;
					var $cover = box.cover ? $(box.cover).show() : $('<div></div>').appendTo(document.body);
					box.cover = $cover.get(0);
					$cover.css({
						position:'absolute',
						opacity: 0.1,
						filter:'alpha(opacity=10)',
						background:'white',
						zIndex:50,
						top:0,
						left:0,
						width: that.getViewWidth(),
						height: that.getViewHeight()
					});
					var $proxy = this.proxy ? $(this.proxy).show() : $(this).clone().html('').appendTo(document.body);
					this.proxy = $proxy.get(0);
					$proxy.css({
						position:'absolute',
						opacity:0.5,
						filter:'alpha(opacity=50)',
						zIndex:100,
						width:this.offsetWidth,
						height:this.offsetHeight,
						top:$(this).position().top,
						left:$(this).position().left,
						background:'black'
					});
					var document_events = {
						'mousemove': function(e){
							that.disableSelection();
							if($proxy.hasClass('bar-east') || $proxy.hasClass('bar-west')) $proxy.css({left:e.pageX});
							else $proxy.css({top:e.pageY});
						},
						'mouseup': function(e){
							$([bar.proxy, box.cover]).hide();
							var x = e.pageX, y = e.pageY;
							var barSize = that.userOptions.panelBar.size;
							var barOps = that.userOptions.panelBar.each;
							if($bar.hasClass('bar-west')) resize_box.css({width:x});
							else if($bar.hasClass('bar-east')) resize_box.css({width:that.getViewWidth()-x-(barOps.east.width||barSize)});
							else if($bar.hasClass('bar-north')) resize_box.css({height:y});
							else if($bar.hasClass('bar-south')) resize_box.css({height:that.getViewHeight()-y-(barOps.south.height||barSize)});
							if(!resize_box.get(0).offsetHeight || !resize_box.get(0).offsetWidth){
								resize_box.hide();
								$bar.get(0).style.cursor = 'auto';
							}
							$(document).off('mousemove', document_events.mousemove);
							$(document).off('mouseup', document_events.mouseup);
							that.resize();
						}
					};
					$(document).on(document_events);
				}
			});
		},
		panelToggle: function(){
			var that = this;
			$('.resize-bar span', this.box).click(function(e){
				var $bar = $(this).parent();
				var $toggle_box = $bar.hasClass('bar-south') ? $bar.next() : $bar.prev();
				var pops = that.userOptions.panel.each;
				if( $bar.hasClass('bar-north')&&pops.north.toggle===false
					|| $bar.hasClass('bar-south')&&pops.south.toggle===false
					|| $bar.hasClass('bar-west')&&pops.west.toggle===false
					|| $bar.hasClass('bar-east')&&pops.east.toggle===false ) return false;
				var style = $toggle_box.get(0).style;
				if(style.display!=='none'){
					$bar.get(0).style.cursor = 'auto';
					$toggle_box.hide();
				}else{
					$bar.get(0).style.cursor = '';
					if(style.width==='0px')  style.width = '';
					if(style.height==='0px')  style.height = '';
					$toggle_box.show();
				}
				that.resize();
				e.stopPropagation();
				e.preventDefault();
				return false;
			});
		},
		resize: function(){
			var getElementHeight = this.getElementHeight;
			var panels = this.panels;
			var panelBars = this.panelBars;
			var md_container_height = this.getViewHeight()
				- getElementHeight(panels.north)
				- getElementHeight(panels.south)
				- getElementHeight(panelBars.north)
				- getElementHeight(panelBars.south);
			$('.layout-middle-container', this.box).height(md_container_height)
				.find('.resize-bar').css({lineHeight:md_container_height+'px'});
			var doc_mode = document.documentMode;
			// if(doc_mode<=8 || /MSIE 7/.test(navigator.userAgent) || /MSIE 6/.test(navigator.userAgent)){
				$('.layout-middle-container .resize-bar', this.box).css({position:'relative'})
					.find('span').css({position:'absolute', top:md_container_height/2-10, left:0});
			// }
			if(doc_mode===5 || /MSIE 6/.test(navigator.userAgent)){
				var getElementWidth = this.getElementWidth;
				var center_width = this.getViewWidth()
					- getElementWidth(panels.west)
					- getElementWidth(panels.east)
					- getElementWidth(panelBars.west)
					- getElementWidth(panelBars.east);
				$('.layout-center', this.box).css({float:'left', width:center_width, height:md_container_height});
				$('.layout-middle-container>div', this.box).height(md_container_height);
			}
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		this.ui = {
			iLayout: handler(this, $.extend({}, options))
		}
	});
};
})(jQuery);
