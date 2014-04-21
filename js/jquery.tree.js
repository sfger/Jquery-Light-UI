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
			var getType = function(obj){ return toString.call(obj).slice(8, -1); };
			var createTree = function(data, deep){
				if(!deep) deep = 1;
				var ul = document.createElement('ul');
				ul.setAttribute('deep', deep);
				for(var i=0,ii=data.length-1; i<=ii; i++){
					var name = document.createElement('span');
					var li = document.createElement('li');
					var line = document.createElement('a');
					var lindent = data[i].children ? (deep==1?deep-2:deep-1) : deep;
					for(var j=0; j<lindent; j++){
						var span = document.createElement('span');
						span.className = j===lindent-1 ? 'join' : 'line';
						line.appendChild(span);
					}
					name.appendChild(document.createTextNode(data[i].name));
					line.option = data[i];
					if(data[i].children){
						var hit = document.createElement('span');
						hit.className = 'hit';
						line.appendChild(hit);
					}
					var icon = document.createElement('span');
					icon.className = 'file';
					line.appendChild(icon);
					name.className = 'title';
					line.appendChild(name);
					line.setAttribute('href', 'javascript:;');
					li.appendChild(line);
					if(data[i].children){
						icon.className = 'folder';
						li.appendChild(createTree(data[i].children, deep+1));
					}
					// if(i===0) li.className = li.className + ' first';
					// if(i===ii) li.className = li.className + ' last';
					ul.appendChild(li);
				}
				return ul;
			};
			var w = $(createTree(options.data)).appendTo(box);
			var $box = $(box);
			$box.addClass('tree-container');
			this.userOptions = options;
			this.container  = $box.get(0);
			this.contents   = w.get(0);
			$(this.contents).delegate('a', {
				'contextmenu': function(e){
					return that.userOptions.onContextmenu.bind(this)(e);
				},
				'click': function(e){
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
			w.appendTo(box);
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
