angular.module("base", [ 'angularFileUpload' ])
	.controller('uploadCtrl',[ '$scope','FileUploader', function($scope,FileUploader) {
		var conf = window.dialogConf;
		var type = conf.type,
		max = conf.max,
		size = conf.size;
		var headers = 
			{
				"Authorization":HtUtil.getLocalAuth()
			}
		var url = getContext().portal+"/system/file/v1/upload";
		var uploader = $scope.uploader = new FileUploader({
			url : url,
			autoUpload:true
		});
		
		$scope.closeDialog=function(){
			conf.closeDialog();
		}
		
		$scope.uploadAll=function(){
			$.each($scope.uploader.getNotUploadedItems(),function(i,item){
				item.upload();
			}); 
		}
		$scope.dialogOk = function(){
			if($scope.uploader.getNotUploadedItems().length>0){
				alert("有文件尚未上传，请上传该文件或删除该文件.");
		    	return;
		    }
		    if($scope.uploader.queue.length==0){
		    	alert("至少需要上传一个文件.");
		    	return;
		    }	
			if(conf.callback){
				var ary = [];
				$.each($scope.uploader.queue,function(item,obj){
					ary.push(obj.json);
				}); 
				conf.callback(ary);
			}
			$scope.closeDialog();
		}
		
		if(max && typeof max=='number'){
			//上传文件数目上限过滤器
			uploader.filters.push({
				name : 'countFilter',
				fn : function(item, options) {
					var result = this.queue.length < max;
					!result&&($.alert("最多只能上传"+max+"个文件","提示信息"));
					return result;
				}
			});	
		}
		//上传文件的文件类型过滤器
		if(type){
			var reg = new RegExp("^.*.("+type+")$");
			uploader.filters.push({
				name : 'typeFilter',
				fn : function(item, options) {
					var result = reg.test(item.name);
					!result&&($.alert("文件类型只能是"+type,"提示信息"));
					return result;
				}
			});
		}
		
		//上传文件的大小过滤器 
		if(size&&typeof size=='number'){
			var realSize = size*1024*1024;
			uploader.filters.push({
				name : 'sizeFilter',
				fn : function(item, options) {
					var result = item.size <= realSize;
					!result&&($.alert("提示信息","单个文件大小不能超过"+size+"M"));
					return result;
				}
			});	
		}
		
		uploader.onBeforeUploadItem = function(item){
			item.headers = headers;
		}
		
		uploader.onSuccessItem = function(fileItem, response) {
			if(response.state){
				fileItem.json = {id:JSON.parse(response.value).fileId,name:fileItem.file.name,size:fileItem.file.size};
			}
        };
	}]);