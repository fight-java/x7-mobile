var  app = angular.module("startFlow", ['flowServiceModule','formDirective','arrayToolService','mobileDirective']);
app.controller('startFlowCtrl', ['$rootScope','$scope','flowService','ArrayToolService',function($rootScope,$scope,flowService,ArrayToolService){
	
	$scope.mobiscroll_setting={ 
        theme: 'ios', 
        lang: 'zh',
        display: 'bottom',
        max: new Date(2030, 1, 1,23,59),
        min: new Date(1941, 1, 0,0)
    };
	
	
	//获取流程定义ID
	var defId=HtUtil.getParameter("defId");
	var flowKey=HtUtil.getParameter("flowKey");
	var subject=decodeURIComponent(HtUtil.getParameter("subject"));
	var proInstId=HtUtil.getParameter("proInstId");
	$scope.proInstId = proInstId;
	$scope.defId = defId;
	$scope.isSendNodeUsers = 0;

	/**
	 * 显示流程图
	 */
	$scope.showFlowPic=function(){
		var url=__ctx +"/bpm/bpmImage?defId="+defId;
		var conf={};
		conf.title="流程图";
		conf.url=url;
		createPopupDialog(conf,'flowStartDialog');
	}
	
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
	
	/**将弹出框子表清空**/
	$scope.cleansubTempData=function(tableName){
		$scope.subTempData[tableName] ={};
	}
	/**将弹出框子表数据填充至子表**/ 
	$scope.pushTempDataToForm=function(tableName){
		if($(".ng-invalid","#"+tableName+"_editDialog").length>0){
			Alert("提示信息","当前子表表单未校验通过！");
			return;
		} 
		var tempData =$.extend($scope.data.sub[tableName].rows[index],$scope.subTempData[tableName]);
		var index = tempData.$index;
		if(!index)index=0;
		$scope.data.sub[tableName].rows[index]=tempData;
		$('#'+tableName+'_editDialog').modal('close');
		//$rootScope.$digest();
	}
	
	/**
	 * 删除行
	 */
	$scope.remove=function(path,idx){
		flowService.removeRow($scope,path,idx);
	};
	/**
	 * 删除行
	 */
	$scope.removeTo=function(val,list){
		ArrayToolService.remove(val,list);
	};
	
	/**
	 * 启动流程
	 */
	$scope.startFlow=function(){
		var index = layer.load();
		var def=flowService.toStartFlow($scope,"startFlow");
		def.then(function(data){
			layer.close(index);
			if(data.state){
				layer.alert('启动成功', function(i){
				  history.go(-1);
				});
			}
		},function(status){
			layer.close(index);
			layer.msg("启动失败",{time:2000});
		})
	};
	
	/**
	 * 保存草稿
	 */
	$scope.saveDraft=function(){
		var index = layer.load();
		var def=flowService.toStartFlow($scope,"saveDraft");
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
	};
	
	$scope.delDraft = function(){
		layer.confirm('确定删除草稿？', function(i){
			layer.close(i);
			var def=flowService.delDraft(proInstId);
			def.then(function(data){
				layer.msg(data.message,{time:200})
				if(data.state){
					history.go(-1);
				}
			},function(status){
			})
		}); 
	}
	
	/**
	 * 表单加载。
	 */
	$scope.init=function($scope,defId){
		var def = flowService.getStartForm(defId,proInstId);
		def.then(function(data){
			if(data.resultMsg=="formEmpty"){
				$.alert("还没有设置表单,请先设置表单!");
				return;
			}
			$scope.form = data.form;
			//如果是内部表单的情况才处理数据。
			if(data.form.type=="INNER"){
				$scope.data =data.data;
				$scope.permission = parseToJson(data.permission);
				$scope.opinionList = data.opinionList;
				// 初始化表单
				window.setTimeout(function(){flowService.initSubTableData($scope)},1000);
			}
			// 启动流程时， 既没有选择跳过第一个节点， 并且跳转类型设置了 jumpType： free/select  选择路径跳转或自由跳转
			if( !$scope.isFirstNodeUserAssign && data.jumpType ){
				// 启动流程时，可以选择路径跳转
				$scope.canSelectNode = true;
			}
		},function(status){
			layer.msg("打开流程失败,error code:"+status,{time:2000});
		});
	},
	//初始化表单。
	$scope.init($scope,defId);
	
	$scope.$on("formInited",function(evt,data){
	});
	
	$scope.selectUser = function(nodeUser){
		var dataBack = null;
		if(nodeUser.executors){
			dataBack = nodeUser.executors;
		}
		nodeUser.executors = [];
		UserDialog({
			initData:dataBack,
			callBack:function(data){
				$scope.isSendNodeUsers = 1;
				var len = data.length;
				for(var i=0;i<len;i++){
					if(!nodeUser.executors){
						nodeUser.executors = [];
					}
					nodeUser.executors.push({id:data[i].id,type:"user",name:data[i].name});
				}
				AngularUtil.setData($scope);
			}
		});
	}
}]);