angular.module('arrayToolService', [])
.service('ArrayToolService', [function() {
    var service = {
    		//上移按钮
	    	up:function(idx,list){
	    		idx = Number.parseInt(idx);
	    		if(idx<1){
	    			return;
	    		}
	    		var t=list[idx-1];
	    		list[idx-1]=list[idx];
	    		list[idx]=t;
	    	},
	    	//下移按钮
	    	down:function(idx,list){
	    		idx = Number.parseInt(idx);
	    		if(idx>=list.length-1){
	    			return;
	    		}
	    		var t=list[idx+1];
	    		list[idx+1]=list[idx];
	    		list[idx]=t;
	    	},
	    	resumeSn:function(list){
	    		for(var k = 0 ; k < list.length ; k++){
	    			list[k].sn = k;
				}
	    		return list;
	    	},
	    	/**
	    	 * idx 原位置
	    	 * num 目标位置
	    	 * list 数组
	    	 */
	    	moveToNum:function(idx,target,list){
	    		idx = Number.parseInt(idx);
	    		target = Number.parseInt(target);
	    		if(target==-1){
	    			target = 0;
	    		}else if(idx >= target){
	    			target = target+1;
	    		}
	    		var t= list.splice(idx,1);
	    		list.insert(target,t[0]);
	    		this.resumeSn(list);
//	    		list.sort(function(a, b) {
//					return  a.sn - b.sn ;
//				});
	    	},
	    	//当前元素ng-change input
	    	moveTo:function(obj,index,list){
	    		var toIndex = $(obj).val();
	    		moveToNum(index,toIndex,list);
	    	},
	    	//删除按钮
	    	del:function(idx,list){
	    		list.splice(idx,1);
	    	},
	    	//找到指定元素的未知
	    	idxOf:function(val,list){
	    		for (var i = 0; i < list.length; i++) {  
	    	        if (list[i] == val) return i;  
	    	    }  
	    	    return -1; 
	    	},
	    	//找到指定元素的未知
	    	idxOfById:function(val,list,id){
	    		for (var i = 0; i < list.length; i++) {  
	    	        if (list[i][id] == val[id]) return i;  
	    	    }  
	    	    return -1; 
	    	},
	    	//删除指定元素
	    	remove:function(val,list){
	    		var idx = this.idxOf(val,list);  
	    	    if (idx > -1) {  
	    	    	list.splice(idx, 1);  
	    	    }  
	    	},
	    	//删除指定元素
	    	removeById:function(val,list,id){
	    		var idx = this.idxOfById(val,list,id);  
	    	    if (idx > -1) {  
	    	    	list.splice(idx, 1);  
	    	    }  
	    	},
	    	//置顶
	    	top:function(idx,list){
	    		idx = Number.parseInt(idx);
	    		if(idx>=list.length || idx<1){
	    	           return;
	    		}
	    		//逐个交换
	            for(var i=0;i<idx;i++){
		            var temp=list[i];
		            list[i]=list[idx];
		            list[idx]=temp;
	            }
	    	},
	    	//置底
	    	bottom:function(idx,list){
	    		idx = Number.parseInt(idx);
	    		if(idx>=list.length-1 || idx<0){
	                return;
	            }
	            //逐个交换
                for(var i=list.length-1;i>idx;i--){
	                var temp=list[i];
	                list[i]=list[idx];
	                list[idx]=temp;
                }
	    	},
	    	//遍历
	    	ergodic:function(list,method){
	    		for(i=0;p=list[i++];){
	    			method(p);
	    		}
	    	}
    };
    return service;
}]);

angular.module('commonListService', [])
.service('CommonListService', [function() {
    var service = {
        	//运算条件数组-日期
        	yesOrNoList:yesOrNoList=[
				{
					key:'是',
					value:true
				},
				{
					key:"否",
					value:false
				}
	      	]
    }
    return service;
}]);