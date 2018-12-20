var  processInfoApp = angular.module("processInfoApp", ['base','mobileDirective','flowServiceModule','formDirective']);
processInfoApp.controller('processInfoCtrl', ['$scope','baseService','flowService',function($scope,baseService,flowService){
	
	var proInstId=HtUtil.getParameter("proInstId");
	var defId=HtUtil.getParameter("defId");
	$scope.proInstId = proInstId;
	$scope.defId = defId;
	/**
	 * 显示审批历史。
	 */
	$scope.showOpinion=function(){
		flowService.showOpinion(proInstId);
	};
	
	$scope.showMoreChildDetail=function(tableName){
		flowService.showFormChildDetail($scope,proInstId,tableName)
	};
	
	/**
	 * 手机流程图
	 */
	$scope.showFlowPic=function(){
		flowService.showFlowPic(proInstId);
	}
	
	/**
	 * 初始化表单。
	 */
	$scope.initForm=function(){
		var url = "${bpmRunTime}/runtime/instance/v1/getMobileInstFormAndBO?proInstId=" + proInstId;
		baseService.get(url).then(function(rep){
			$scope.form = rep.form;
			console.log(rep.form.formHtml);
			$scope.data = rep.data;
			$scope.opinionList = rep.opinionList;
			$scope.permission = $scope.$eval(rep.permission);
		},function(status){
			layer.msg("获取流程失败,error code:"+status);
		});
		
		var url = "${bpmRunTime}/runtime/instance/v1/get?id="+ proInstId;
		baseService.get(url).then(function(rep){
			$scope.process = rep;
		});
		
		baseService.get("${bpmRunTime}/runtime/instance/v1/instanceFlowOpinions?instId="+proInstId).then(function(data){
			$scope.lastOpinion = data.reverse()[0];
		})
	};
	//初始化表单。
	$scope.initForm();
}]);