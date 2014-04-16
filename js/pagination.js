(function(window){
    var pagination = (function(navi,dataSize){
        var pagination = function(navi,dataSize){ return new pagination.prototype.init(navi,dataSize); }
        pagination.prototype = {
            navi:null,pageCount:1,
            init:function(navi,dataSize){
				if(dataSize<0) dataSize = 0;
				this.pageSizeList = [10, 20, 40, 80, 160];
				this.pageSize = this.pageSizeList[0];
                this.navi = navi;
				this.dataSize = dataSize;
                this.pageCount = Math.ceil(dataSize/this.pageSize);
                this.pageCount = this.pageCount<1 ? 1 : this.pageCount;
				navi.className += (navi.className ? ' ' : '') + 'pagination-container';
				this.pageNumberQueryName = 'pageNumber';
				this.pageNumberRegExp = new RegExp('([?&]{1}'+this.pageNumberQueryName+'=)([^&]*)');
                var pageNumber = this.pageNumberRegExp.exec(location.href);
				if(pageNumber && pageNumber[2]) pageNumber = pageNumber[2];
                var url = '';
                if(!pageNumber){
                    if(location.search) url = location.href+'&'+this.pageNumberQueryName+'=';
                    else url = location.href+'?'+this.pageNumberQueryName+'=';
                    pageNumber = 1;
                }else{
                    url = location.href.replace(this.pageNumberRegExp,"$1"+'');
                    pageNumber = parseInt(pageNumber);
                    if(isNaN(pageNumber)) pageNumber=1;
                }
                pageNumber = pageNumber>this.pageCount ? this.pageCount : pageNumber;
				this.pageNumber = pageNumber;
                this.navishow(pageNumber,this.pageCount,url,5);
				this.navi.innerHTML += '&nbsp;<div class="form">第<form action="" method="get"><input name="'+this.pageNumberQueryName+'" class="page" type="text" value="" /></form><a href="javascript:;" class="goto">页</a></div>&nbsp;<div class="desc">共'+dataSize+'条数据</div>';
				this.initEvent();
            },
            initEvent:function(){
                var that = this;
                this.navi.getElementsByTagName('form',this.navi)[0].onsubmit=function(){
                    var a = getElementsByClassName("page",that.navi)[0].value;
                    if(a>that.pageCount) getElementsByClassName("page",that.navi)[0].value=that.pageCount;
                    else if(a<1) getElementsByClassName("page",that.navi)[0].value=1;
                    if(isNaN(a)) a = 1;
                };
                getElementsByClassName('goto',this.navi)[0].onclick=function(){
                    var a = getElementsByClassName("page",that.navi)[0].value;
                    a = (a>that.pageCount)?that.pageCount:(a<1)?1:a;
                    if(isNaN(a)) a = 1;
                    location.href = location.href.replace(that.pageNumberRegExp,"$1"+a);
                };
            },
            getNaviNode:function(url,page,show){
				// if(!this.userOptions.useAjax){
					url = url.replace(this.pageNumberRegExp, "$1"+page);
				// }
				var c = (function(){
					if(show==='上一页') return ' prev';
					else if(show==='下一页') return ' next';
					else return '';
				})();
                url='<a href="'+url+'" class="pn'+c+'">'+show+'</a>';
                this.navi.innerHTML += url;
            },
            appendPlainChild:function(text){
				this.navi.innerHTML += '<a href="javascript:;" class="'+(text==='...' ? 'plain' : 'current')+'">'+text+'</span>';
            },
            navishow:function(cur,page,url,show){
                show = show==undefined ? 11 : show;
                var hf = Math.floor(show/2);
                var i = 0;
                if(cur>1) this.getNaviNode(url,cur-1,"上一页");
                if(page<=show){
                    for(i=1;i<=page;i++)
                        if(i==cur) this.appendPlainChild(i);
                        else this.getNaviNode(url,i,i);
                }else{
                    if( (cur-2)<(hf+2) ){
                        for(i=1;i<=cur;i++)
                            if(i==cur) this.appendPlainChild(i);
                            else this.getNaviNode(url,i,i);
                    }else{
                        this.getNaviNode(url,1,1);
                        if(page!=show+1) this.appendPlainChild('...');
                        for(i=cur-hf+((page-cur-hf>0)?0:(page-cur-hf));i<=cur;i++)
                            if(i==cur) this.appendPlainChild(i);
                            else this.getNaviNode(url,i,i);
                    }
                    if(page-cur<hf+3){
                        for(i=cur+1;i<=page;i++)
                            if(i==cur) this.appendPlainChild(i);
                            else this.getNaviNode(url,i,i);
                    }else{
                        cur = parseInt(cur);
                        for(i=cur+1;i<=(cur+hf-((cur-hf>1)?0:(cur-hf-1)));i++)
                            if(i==cur) this.appendPlainChild(i);
                            else this.getNaviNode(url,i,i);
                        if(page!=show+1) this.appendPlainChild('...');
                        this.getNaviNode(url,page,page);
                    }
                }
                if(cur!=page) this.getNaviNode(url,cur+1,"下一页");
            }
        }
        pagination.prototype.init.prototype = pagination.prototype;
        return pagination;
    })();
    return window.pagination = pagination;
})(window);
/* vim: set fdm=marker */
