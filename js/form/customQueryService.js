angular.module('CustomQueryService', ['base'])
.service('CustomQuery', ['baseService','$q',function(baseService,$q){
	var _cachedCustomQuery = {};
	
    var service = {
    		//通过别名获取自定义查询
    		get:function(alias){
    			var deferred = $q.defer();
    			if(alias){
    				if(_cachedCustomQuery[alias]){
    					deferred.resolve(_cachedCustomQuery[alias]);
    				}
    				else{
    					var url = __ctx +'/form/customQuery/getByAlias?alias='+alias;
        				baseService.get(url,function(data,status){
        					if(status=='200'){
        						deferred.resolve(data);
        						//缓存
        						_cachedCustomQuery[data.alias] = data;
        					}
        					else{
        						deferred.reject();
        					}
        				});
    				}
    			}
    			else{
    				deferred.reject("必须传入自定义查询别名");
    			}
    			return deferred.promise;
    		},
    		detail : function(CustomQuery,callback){
    			if(!CustomQuery||!CustomQuery.id){
    				if(callback){
    					callback();
    				}
    				return;
    			}
    			baseService.postForm(__ctx +'/form/customQuery/getById',{id:CustomQuery.id}).then(function(data){
    				if(callback){
	    				callback(data);
	    			 }
    			});
    		},
    		//获取表或视图列表
    		getByDsObjectName:function(params,callback){
    			baseService.postForm(__ctx +'/form/customQuery/getByDsObjectName',params).then(function(data){
    				if(callback){
	    				callback(data);
	    			 }
    			});
    		},
    		//保存
    		save:function(CustomQuery,callback){
    			baseService.post(__ctx +'/form/customQuery/save',CustomQuery).then(function(data){
    				if(callback){
	    				callback(data);
	    			 }
    			});
    		},
    		//设置页面获取table字段
    		getTable:function(params,callback){
    			baseService.postForm(__ctx +'/form/customQuery/getTable',params).then(function(data){
    				if(callback){
    					callback(data);
    				}
    			});
    		},
    		search:function(params,callback){
    			baseService.postForm(__ctx +'/form/customQuery/doQuery',params).then(function(data){
    				if(callback){
	    				callback(data);
	    			 }
    			});
    		},
    		getAll:function(callback){
    			baseService.get(__ctx +'/form/customQuery/getAll').then(function(data){
    				if(callback){
	    				callback(data);
	    			 }
    			});
    		}
        }
    return service;
}]);
