var  app = angular.module("approveFlow", ['base','flowServiceModule','formDirective','mobileDirective']);
app.controller('taskCtrl', ['$scope','flowService','baseService',function($scope,flowService,baseService){
	$scope.mobiscroll_setting={ 
	        theme: 'ios', 
	        lang: 'zh',
	        display: 'bottom',
	        max: new Date(2030, 1, 1,23,59),
	        min: new Date(1941, 1, 0,0),
	        defaultValue:""
	 };
	
	$scope.fromApp = localStorage.getItem("fromApp");
	//获取流程定义ID
	var taskId=HtUtil.getParameter("taskId");
	var defId=HtUtil.getParameter("defId");
	var proInstId=HtUtil.getParameter("proInstId");
	
	$scope.proInstId = proInstId;
	$scope.defId = defId;
	$scope.taskId = taskId;
	
	/**
	 * 添加子表行
	 */
	$scope.add=function(path){
		flowService.addRow($scope,path);
		return false;
	};
	/**弹出框编辑子表行*/
	$scope.editRow=function(tableName,index){
		flowService.editRow($scope,tableName,index);
		return false;
	};
	
	/**
	 * 删除行
	 */
	$scope.remove=function(path,idx){
		flowService.removeRow($scope,path,idx);
	};
	
	/**
	 * 初始化任务表单。
	 */
	$scope.initTaskForm=function(){
		var approveUrl = "${bpmRunTime}/runtime/task/v1/taskApprove?taskId="+taskId;
		baseService.get(approveUrl).then(function(rep){
			$scope.isPopWin = rep.popWin;
			$scope.nodeId = rep.nodeId;
		});
		var detailUrl = "${bpmRunTime}/runtime/task/v1/taskMobileDetail?taskId="+taskId+"&reqParams=";
		baseService.get(detailUrl).then(function(data){
			if(!data) return;
			if(data.result=="formEmpty"){
				dialogService.fail("还没有设置表单,请先设置表单!");
				return;
			}
			$scope.form = data.form;
			data.buttons.push({alias:"more"});
			$scope.buttons = data.buttons;
			//如果是内部表单的情况才处理数据。
			if(data.form.type=="INNER"){
				$scope.data =data.data;
				$scope.permission = parseToJson(data.permission);
				$scope.opinionList = data.opinionList;
				// 初始化表单
				window.setTimeout(function(){flowService.initSubTableData($scope)},1000);
			}
		},function(status){
			layer.msg('加载失败',{time:2000});
		});
		
		baseService.get("${bpmRunTime}/runtime/instance/v1/instanceFlowOpinions?instId="+proInstId).then(function(data){
			//找有opinion的历史记录
			for(var i = data.length - 1 ; i > 0 ; i--){
				if(!$.isEmptyObject(data[i].opinion)){
					$scope.lastOpinion = data[i];
					return;
				}
			}
			if(!$scope.lastOpinion){
				$scope.lastOpinion = data[data.length - 1];
			}
		})
	};
	
	$scope.IsCanLock = function(){
		var churl= '${bpmRunTime}/runtime/task/v1/canLock?taskId=' + taskId;
		baseService.get(churl).then(function(rtn){
			//0:任务已经处理,1:可以锁定,2:不需要解锁 ,3:可以解锁，4,被其他人锁定,5:这种情况一般是管理员操作，所以不用出锁定按钮。
			switch(rtn){
				case 0:
					layer.msg('此任务已经被其他人处理完成!',{time:2000});
					break;
				case 1:
				case 2:
				case 3:
				case 5:
					$scope.initTaskForm();
					break;
				case 4:
					layer.msg('此任务已经被其他人锁定!',{time:2000});
					break;
				case 6:
					layer.msg('流程已经被禁止，请联系管理员！',{time:2000});
					break;
			}
		});
	}
	
	/**
	 * 返回结果。
	 */
	var confirmFn=function(opinion){
		var index = layer.load();
		var def = flowService.toCompleteTask($scope,$scope.action,opinion,taskId);
		def.then(function(data){
			layer.close(index);
			if(data.state){
				layer.alert('操作成功', function(i){
				  layer.close(i);
				  history.go(-1);
				});
			}
		},function(status){
			layer.close(index);
			layer.msg("操作失败",{time:2000});
		})
	}
	
	/**
	 * 协办处理。
	 */
	var transferFn=function(opinion){
		var action = $scope.action;
		var def = flowService.startTrans(taskId,action,opinion,$scope.userIds);
		def.then(function(data){ 
			if(data.result==1){
				
				$.alert($scope.actionMsg+"操作成功!",function(){
					HtUtil.goBack();
//					if(window.postMessage){
//						window.postMessage('{"type":"startTrans","status":"1","message":""}');
//					}else{
//						location.href=__ctx+"/mobile/bpm/myWaitMatters.html";
//					}			
				});
			}
			else{
				$.alert(data.cause,$scope.actionMsg+"操作失败");
			}
		},function(status){
			
		});
	}
	
	$scope.saveDraft=function(){
		var def=flowService.toSaveTaskForm($scope);
		var index = layer.load();
		def.then(function(data){
			layer.close(index);
			if(data.state){
				layer.alert('保存成功', function(i){
				  layer.close(i);
				  history.go(-1);
				});
			}
		},function(status){
			layer.close(index);
			layer.msg("保存失败",{time:2000});
		})
	}
	
	$scope.approveFlow=function(action,text){
		if($scope.custForm.$invalid){
			$.alert("表单未校验通过！");
			return;
		}
		//关闭侧栏
		
		if(!text)text="提交";

		var tempOpinion=$("[ng-model='htBpmOpinion']:not(:hidden)").val();
		if (!tempOpinion) {
			tempOpinion = text;
		}
		
		$scope.action = action; 
		$scope.actionMsg = text;
		$.prompt("请输入审批意见","确认提交吗?",confirmFn);
		//处理表单意见回填
		var opinion = $scope.data['__form_opinion'];
		if(opinion){
			setTimeout(function(){
				var oldOpinion = '';
				for(var p in opinion){ 
					oldOpinion = opinion[p];
					break;
				 }
				$('.modal-text-input').val(oldOpinion);
			},500);
		}
		
		//表单意见关联
		$("[ng-model='htBpmOpinion']:not(:hidden)").each(function(i){
			var path=$(this).parent().parent().attr("ht-bpm-opinion");
			var aryPath= path.split("\.");
			var opinionName=aryPath[2];
			var obj={};
			obj[opinionName]=tempOpinion;
			$scope.data.__form_opinion=obj;
		});
		
		//默认意见
		$(".modal-text-input").val(tempOpinion);
	}
	
	$scope.startTrans=function(action,text){
		var action = $scope.action;
		$scope.actionMsg = text;
		UserDialog({
			title : "选择协办人员",
			isSingle : false,
			callBack : function(data) {
				var arrId=[];
				var arrText=[];
				$.each(data,function(index,item){
					arrId.push(item.id);
					arrText.push(item.name);
				})
				$scope.userIds = arrId.toString();
				var userNames = arrText.toString();
				$.prompt("请输入协办通知内容", "确认向以下用户发起协办吗?<br>["+userNames+"]",transferFn);
				$(".modal-text-input").val("请协助处理任务");
			} 
		});
	}
	
	
	/**
	 * 显示审批历史。
	 */
	$scope.showOpinion=function(){
		flowService.showOpinion(proInstId);
	}
	
	/**
	 * 手机流程图
	 */
	$scope.showFlowPic=function(){
		var url=__ctx +"/mobile/view/bpm/taskImage.html";
		var conf={};
		conf.title="流程图"
		conf.url=url;
		conf.taskId = taskId
		createPopupDialog(conf,'flowApproveDialog');
	}
	
	/**
	 * app页面与发起人聊天
	 */
	$scope.communicateToStart = function(){
		if($scope.startUser){
			HtUtil.toChat($scope.startUser);
		}
	}
	
	//初始化表单。
	$scope.IsCanLock();
}]);