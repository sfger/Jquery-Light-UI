"use strict";
(function($){
$.fn.accordion=function(options){
	if(!options){
		var iAccordions = [];
		this.each(function(){
			if(this.ui && this.ui.iAccordion) iAccordions.push(this.ui.iAccordion);
			else throw new Error('UI does not init...');
		});
		return iAccordions;
	}
	options = $.extend(true, {
		data: []
	}, options);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	var getType = light.util.getType;
	handler.prototype = {
		init: function(box, options){
			var that = this;
			var $box = $(box);
			$box.addClass('accordion-container');
			this.userOptions = options;
			this.render = box;
			if(!box.children){
				box.innerHTML = '<ul></ul>';
			}
			this.titles = [];
			var ul = box.children[0];
			var len = 0;
			if(ul.children && (len = ul.children.length)){
				for(var i=0; i<len; i++){
					this.titles.push(ul.children[i].children[0]);
					if(i===options.selected){
						this.selectedPanel = ul.children[i].children[1];
						var $spl = $(this.selectedPanel);
						if(document.documentMode<7) $spl.css({display:'block'});
						$spl.prev().addClass('selected');
						if(options.fitContent){
							this.selectedAnimateHeight = box.offsetHeight - len * ul.children[0].offsetHeight;
							$spl.css('height', this.selectedAnimateHeight);
						}else{
							$spl.css('height', 'auto');
						}
					}
				}
			}
			$('#test').delegate('.title', {
				click: function(){
					var panel = this.parentNode.children[1];
					var spl = that.selectedPanel;
					var $spl = $(spl);
					spl && $(spl.parentNode.children[0]).removeClass('selected');
					if(panel!=spl){
						$(this).addClass('selected');
						if(options.fitContent){
							$(panel).animate({
								height:that.selectedAnimateHeight
							}, {
								duration: 210,
								start: function(){
									if(document.documentMode<7)
										$(this).css({display:'block', overflow:"auto"})
								}
							});
						}else{
							$(panel).css({display:'none', height:'auto'}).slideDown(210);
						}
						that.selectedPanel = panel;
					}else{
						that.selectedPanel = null;
					}
					if(spl) $(spl).animate({height:0}, {
						duration: 210,
						complete: function(){
							if(document.documentMode<7)
								$(this).css({display:'none', height:1, overflow:"hidden"});
						}
					});
				}
			});
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		this.ui = {
			iAccordion: handler(this, $.extend({}, options))
		};
	});
};
})(jQuery);
/* vim: set fdm=marker : */
