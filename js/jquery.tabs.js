"use strict";
(function($){
$.fn.tabs=function(options){
	if(!options){
		var iTabs = [];
		this.each(function(){
			if(this.ui && this.ui.iTab) iTabs.push(this.ui.iTab);
			else throw new Error('UI does not init...');
		});
		return iTabs;
	}
	options = $.extend(true, {
		width:900,
		height:80,
		tabWidth:160,
		border:true,
		icon:null,
		selected:0,
		position:'north'
	}, options);
	var slice = light.util.slice;
	options.renders = slice.call(this);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	handler.prototype = {
		init: function(box, options){
			this.render = box;
			this.userOptions = options;
			try{
				this.titles = slice.call(box.children[0].children[0].children);
				this.panels = slice.call(box.children[1].children);
			}catch(e){
				this.titles = [];
				this.panels = [];
				for(var i=0,ii=box.children[0].children[0].children.length-1; i<=ii; i++)
					this.titles.push(box.children[0].children[0].children[i]);
				for(var i=0,ii=box.children[1].children.length-1; i<=ii; i++) t
					is.panels.push(box.children[1].children[i]);
			}
			var that = this;
			var $box = $(box);
			$box.addClass('tab-container');
			$(this.titles[options.selected].children[0]).addClass('current');
			$(this.panels).parent().show().end().hide().eq(options.selected).show();
			$(box.children[0]).delegate('li', {
				click:function(e){
					that.select(that.titles.indexOf(this));
				}
			});
		},
		select: function(index){
			var prevSelected = this.userOptions.selected;
			if(index==prevSelected || index<0 || index>this.titles.length-1) return false;
			$(this.titles[prevSelected].children[0]).removeClass('current');
			$(this.titles[index].children[0]).addClass('current');
			$(this.panels[prevSelected]).hide();
			$(this.panels[index]).show();
			this.userOptions.selected = index;
			return this;
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		this.ui = {
			iTab: handler(this, $.extend({}, options))
		}
	});
};
})(jQuery);
/* vim: set fdm=marker : */
