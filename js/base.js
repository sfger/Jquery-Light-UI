// light {{{
var light = {
	ui:{
		markChars:{up: '↑', down : '↓', expand:'▼', fold:'▲', empty:'&nbsp;&nbsp;'}
	},
	util:{
		slice:Array.prototype.slice,
		push:Array.prototype.push,
		toString:Object.prototype.toString,
		getType:function(obj){ return light.ui.toString.call(obj).slice(8, -1); },
		//method createElement {{{
		createElement:function(node){
			var getType = light.util.getType;
			var cd = '',
				at=[],
				attr = null,
				children = null,
				fn = light.util.createElement,
				node_type = getType(node);
			if(node_type === 'Array'){
				for(var j in node) cd += fn(node[j]);
			}else{
				if(node_type==="String" || node_type=="Number"){
					cd = node;
				}else if(node_type==='Object' && node.name){
					attr = node.attr, children = node.children, at = [];
					if(attr){
						for(var key in attr){
							if(key=='className'){
								at.push('class="' + attr[key] + '"');
								continue;
							}else if(key=='style'){
								var style = attr[key];
								var ot = getType(style);
								attr[key] = '';
								if(ot=='Object'){
									for(var sk in style){
										attr[key] += sk + ':' + style[sk] + ';';
									}
								}else if(ot=='String'){
									attr[key] = style;
								}
							}
							at.push('' + key + '="' + attr[key] + '"');
						}
					}
					if(at.length) at.unshift('');
					if(children && getType(children) !== 'Array') children = [children];
					cd = '<' + node.name + at.join(' ') + '>' + (children ? fn(children) : '') + '</' + node.name + '>';
				} else cd = '';
			}
			return cd;
		}
		//}}}
	}
};
// }}}
/* vim: set fdm=marker : */
