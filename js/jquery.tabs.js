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
	var createElement = light.util.createElement;
	options.renders = slice.call(this);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	var list2Array = function(list){
		var ret = [];
		try{
			ret = slice.call(list);
		}catch(e){
			for(var i=0,ii=list.length-1; i<=ii; i++)
				ret.push(list[i]);
		}
		return ret;
	};
	handler.prototype = {
		init: function(box, options){
			this.render = box;
			this.userOptions = options;
			this.headers = list2Array(box.children[0].children);
			this.panels = list2Array(box.children[1].children);
			var that = this;
			var $box = $(box);
			$(box.children[0]).addClass('clearfix');
			$box.addClass('tab-container');
			if(this.headers.length){
				$(this.headers[options.selected]).addClass('current');
				$(this.panels).parent().show().end().hide().eq(options.selected).show();
			}
			if(options.contentFit){
				box.children[1].style.height = (box.parentNode.offsetHeight - box.children[0].offsetHeight) + 'px';
			}
			$(box.children[0]).delegate('li', {
				click:function(e){
					that.select(that.headers.indexOf(this));
				}
			}).delegate('.closer', {
				click:function(e){
					that.close(that.headers.indexOf(this.parentNode.parentNode));
					return false;
				}
			});
		},
		add:function(index, op){
			var render = this.render;
			var len = this.headers.length;
			var position = 'beforeBegin';
			if(!len){
				index = 0;
				$(render.children[1]).show();
			}else if(index>=len){
				index = len -1;
				position = 'afterEnd';
			}
			if(index<0) index = 0;
			var header = createElement({
				name:'li', children:{
					name:'a', attr:{href:'javascript:;'}, children:
						(function(){
							var ret = ['<span class="title">'+op.title+'</span>'];
							if(op.icon){
								ret.unshift(createElement({
									name:'span', attr:{className:'icon icon-'+op.icon}
								}));
							}
							if(op.closable){
								ret.push(createElement({
									name:'span', attr:{className:'closer'}, children:
										light.ui.markChars.close
								}));
							}
							return ret;
						})()
				}
			});
			var panel = createElement({name:'div', attr:{style:{display:'none'}}, children:op.content});
			if(this.headers.length){
				this.headers[index].insertAdjacentHTML(position, header);
				this.panels[index].insertAdjacentHTML(position, panel);
			}else{
				render.children[0].innerHTML = header;
				render.children[1].innerHTML = panel;
			}
			this.headers = list2Array(render.children[0].children);
			this.panels = list2Array(render.children[1].children);
			if(index<=this.userOptions.selected) this.userOptions.selected++;
			if(op.select) this.select(index + (position==='afterEnd'?1:0));
			return this;
		},
		close: function(index){
			var options = this.userOptions;
			if(options.selected==index){
				if(this.headers.length - 1){
					this.select(Number(!index));
					if(!index) options.selected = 0;
				}else{
					options.selected = null;
				}
			}else if(options.selected>index){
				options.selected--;
			}
			var header = this.headers.splice(index, 1)[0];
			var panel = this.panels.splice(index, 1)[0];
			header.parentNode.removeChild(header);
			panel.parentNode.removeChild(panel);
			return this;
		},
		select: function(index){
			var prevSelected = this.userOptions.selected;
			if(index==prevSelected || index<0 || index>this.headers.length-1) return false;
			$(this.headers[prevSelected]).removeClass('current');
			$(this.headers[index]).addClass('current');
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
