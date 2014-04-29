"use strict";
(function($){
$.fn.tree=function(options){
	if(!options){
		var iTrees = [];
		this.each(function(){
			if(this.ui && this.ui.iTree) iTrees.push(this.ui.iTree);
			else throw new Error('UI does not init...');
		});
		return iTrees;
	}
	options = $.extend(true, {
		animate: {time:0},
		data: []
	}, options);
	var handler = function(box, options){ return new handler.prototype.init(box, options); };
	var createTree = function(data, deep, container){
		if(!deep) deep = 1;
		var ul = document.createElement('ul');
		container.appendChild(ul);
		ul.setAttribute('deep', deep);
		for(var i=0,ii=data.length-1; i<=ii; i++){
			var name = document.createElement('span');
			var li = document.createElement('li');
			var line = document.createElement('a');
			ul.appendChild(li);
			ul.setAttribute('deep', deep);
			li.appendChild(line);
			line.setAttribute('href', 'javascript:;');
			line.option = data[i];
			var indent = data[i].children ? (deep==1?deep-2:deep-1) : deep;
			for(var j=0; j<indent; j++){
				var span = document.createElement('span');
				line.appendChild(span);
				span.className = j===indent-1 ? 'join' : 'line';
			}
			if(data[i].children){
				var hit = document.createElement('span');
				line.appendChild(hit);
				hit.className = 'hit';
			}
			var icon = document.createElement('span');
			icon.className = 'file';
			line.appendChild(icon);
			if(data[i].children){
				icon.className = 'folder';
				createTree(data[i].children, deep+1, li);
			}
			line.appendChild(name);
			name.appendChild(document.createTextNode(data[i].name));
			name.className = 'title';
		}
	};
	var getType = function(obj){ return toString.call(obj).slice(8, -1); };
	handler.prototype = {
		init: function(box, options){
			var that = this;
			var document = window.document;
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
			createTree(options.data, 1, box);
			var w = $(box.children[0]);
			var $box = $(box);
			$box.addClass('tree-container');
			this.userOptions = options;
			this.container  = $box.get(0);
			this.contents   = w.get(0);
			$(this.contents).delegate('a', {
				contextmenu: function(e){
					return that.userOptions.onContextmenu.bind(this)(e);
				},
				click: function(e){
					if(!that.isLeaf(this)){
						that.toggle(this);
					}else{
						$(that.currentElement).removeClass('current');
						that.currentElement = this;
						$(this).addClass('current');
					}
					return that.userOptions.onClick.bind(this)(e);
				}
			});
			if(options.dnd){
				var drag = {
					updatePosition: function(e){
						$(that.dragingProxyElement).css({top:e.pageY, left:e.pageX+25})
					},
					start: function(){
						$(document).on({
							mousemove:drag.move,
							mouseup:drag.end
						});
					},
					move: function(e){
						that.disableSelection();
						if(that.dragingProxyElement.style.display!=='block')
							that.dragingProxyElement.style.display = 'block';
						drag.updatePosition(e);
					},
					end: function(){
						$(that.dragingProxyElement).hide();
						$(document).off({
							mousemove:drag.move,
							mouseup:drag.end
						});
					}
				};
				if(/Chrome/.test(navigator.userAgent)){//Chrome draging hover state fixed
					$(this.contents).delegate('a', {
						mouseenter: function(){
							$(this).addClass('hover');
						},
						mouseleave: function(){
							$(this).removeClass('hover');
						}
					});
				}
				$(this.contents).delegate('a', {
					mousedown: function(e){
						that.dragingElement = this;
						if(!that.dragingProxyElement){
							that.dragingProxyElement = document.createElement('div');
							document.body.appendChild(that.dragingProxyElement);
							$(that.dragingProxyElement).addClass('tree-draging-proxy');
						}
						$(that.dragingProxyElement).html(that.dragingElement.option.name);
						drag.updatePosition(e);
						drag.start();
						return false;
					}
				});
			}
		},
		disableSelection: function(){
			if(window.getSelection){
				window.getSelection().removeAllRanges();
			}else if(document.selection){
				document.selection.empty();
			}
		},
		isLeaf: function(node){
			return !node.option.children;
		},
		toggle: function(folder){
			this[$(folder.nextSibling).css('display')==='none' ? 'expand' : 'collapse'](folder);
			return this;
		},
		expand: function(folder){
			var method = 'show';
			$(folder.parentNode).addClass('expanded').find('>a>.hit').addClass('hit-open');
			$(folder.nextSibling)[method](this.userOptions.animate.time);
			this.contents.style.width = this.container.scrollWidth + 'px';
			return this;
		},
		collapse: function(folder){
			var method = 'hide';
			$(folder.parentNode).removeClass('expanded').find('>a>.hit').removeClass('hit-open');
			$(folder.nextSibling)[method](this.userOptions.animate.time);
			this.contents.style.width = this.container.scrollWidth + 'px';
			return this;
		}
	};
	handler.prototype.init.prototype = handler.prototype;
	return this.each(function(){
		this.ui = {
			iTree: handler(this, $.extend({}, options))
		}
	});
	//return handler(this, options);
};
})(jQuery);
/* vim: set fdm=marker : */
