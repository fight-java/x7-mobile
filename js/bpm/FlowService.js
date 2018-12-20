

var  flowServiceModule = angular.module('flowServiceModule',["base"]);

flowServiceModule.factory('flowService',['baseService',function(baseService){
	/**
	 * 删除无效的bo数据。
	 * @param data
	 */
	function tidyData(data){
		var json={};
		$("[ng-model^='data.']").each(function(){
			var temp=$(this).attr("ng-model");
			var bocode=temp.split(".")[1];
			json[bocode]=true;
		});
		
		for(var key in data){
			var rtn=isBoCodeExist(key,json);
			if(!rtn){
				delete data[key];
			}
		}
	}

	/**
	 * 判断 bo的数据是否存在在界面的bo数据中。
	 * @param key
	 * @param json
	 * @returns {Boolean}
	 */
	function isBoCodeExist(key,json){
		if("__form_opinion"==key)return true;
		var rtn=false;
		for(var temp in json){
			if(key==temp){
				rtn=true;
			}
		}
		return rtn;
	}
	
	return {
		
		
		/**
		 * 获取启动流程数据
		 */
		getStartForm:function(defId,proInstId){
			var url = "${bpmRunTime}/runtime/instance/v1/getMobileFormAndBO";
			var def = baseService.post(url,{defId:defId,proInstId:proInstId})
			return def;
		},
		/**
		 * 数据返回构建表单。
		 */
		initSubTableData:function(scope){
			var permission = scope.permission;
			
			var initSubTable = [];
			for(var subTable in permission.table){
				if(permission.table[subTable].required){
					initSubTable.push(subTable);
				}
			}
			
			$("[type='subGroup'][initdata]").each(function(i,item){
				initSubTable.push($(item).attr("tablename"));
			});
			var data = scope.data;
			for(var i=0,subTable;subTable=initSubTable[i++];){
				for(var boCode in data){ 
					var initData =data[boCode].initData[subTable];
					if(initData &&(!data[boCode]["sub_"+subTable]||data[boCode]["sub_"+subTable].length==0)){
						data[boCode]["sub_"+subTable] = [];
						data[boCode]["sub_"+subTable].push($.extend({},initData));
					}
				}
			}
			!scope.$$phase&&scope.$digest(); 
		},
		
		/**
		 * 保存草稿
		 */
		toStartFlow:function(scope,type){
			tidyData(scope.data);
			//处理表单意见没有填写时加上意见数据。
			//handleOpionion(scope,bpm);
			
			var jsonData = {
				defId:scope.defId,
				data:angular.toJson(scope.data)
			};
			//通过草稿启动流程时，传入草稿的对应的实例ID
			if(scope.proInstId){
				jsonData.proInstId = scope.proInstId;
			}
			var action=(type=="startFlow")?  "/instance/v1/start" : "/instance/v1/saveDraft";
			var url= "${bpmRunTime}/runtime" + action;
			//对表单数据进行base64加密
			if(jsonData.data){
				jsonData.data = $.base64.encode(jsonData.data,"utf-8");
			}
			var def=baseService.post(url,jsonData);
			return def;
		},
		/**
		 * 保存任务节点草稿
		 */
		toSaveTaskForm:function(scope){
			tidyData(scope.data);
			//处理表单意见没有填写时加上意见数据。
			//handleOpionion(scope,bpm);
			
			var jsonData = {
				formType:"inner",
				taskId:scope.taskId,
				data:angular.toJson(scope.data)
			};
			var url= "${bpmRunTime}/runtime/task/v1/saveDraft";
			//对表单数据进行base64加密
			if(jsonData.data){
				jsonData.data = $.base64.encode(jsonData.data,"utf-8");
			}
			var def=baseService.post(url,jsonData);
			return def;
		},
		
		toCompleteTask:function(scope,actionName,opinion,taskId){
			tidyData(scope.data);
			//处理表单意见没有填写时加上意见数据。
			//handleOpionion(scope,bpm);
			var jsonData ={
				data:angular.toJson(scope.data),
				actionName:actionName,
				opinion:opinion,
				taskId:taskId,
				formType:"inner"
			};
			if(jsonData.data){
				jsonData.data = $.base64.encode(jsonData.data,"utf-8");
			}
			var def = baseService.post("${bpmRunTime}/runtime/task/v1/complete", jsonData);
			return def;
		},
		
		/**
		 * 删除草稿
		 */
		delDraft:function(proInstId){
			var def = baseService.remove("${bpmRunTime}/runtime/instance/v1/removeDraftById?ids="+proInstId, {});
			return def;
		},
		/**
		 * 在子表中添加行。
		 */
		addRow:function(scope,path){
			var arr = path.split(".");
			if(arr.length<2){
                dialogService.fail("subtable path is error!")
			}
			var subTableName = arr[1].replace("sub_","");
			var tempData = scope.data[arr[0]].initData[subTableName];
			
			if(!tempData)tempData={};
			var ary = eval("(scope.data." + path + ")"); 
			var newItem = angular.copy(tempData);
			if(ary){
				ary.push(newItem);
			}
			else{
				var rows=[];
				rows.push(newItem);
				eval("(scope.data." + path + "=rows)")
			}
		},
		//弹出框处理
		editRow:function($scope,tableName,index){
			if(!$scope.subTempData)$scope.subTempData={};
			var tempTableData ;
			
			if(index===undefined){
				tempTableData =$.extend({}, $scope.data.sub[tableName].row);
				index=$scope.data.sub[tableName].rows.length;//如果没有index 默认为添加一条
			}else{
				tempTableData =$.extend({},$scope.data.sub[tableName].rows[index]);
			}
			tempTableData.$index =index;
			$scope.subTempData[tableName]=tempTableData; 
			$("#"+tableName+"_editDialog").modal();
			return false;
		},
		/**
		 * 删除一行数据。
		 */
		removeRow:function($scope,path,idx){
			var ary = eval("($scope.data." + path + ")");
			if(ary&&ary.length>0){
				ary.splice(idx,1);
			}
		},
		/**
		 * 返回任务表单。
		 */
		getTaskForm:function(taskId,formKey,version){
			var url=__ctx +"/mobile/bpm/getTaskForm.ht";
			formKey=formKey || "";
			version=version || 0;
			var data={taskId:taskId,formKey:formKey,version:version};
			var def=baseService.postForm(url,data);
			return def;
		},
		/**
		 * 审批流程。
		 */
		approveFlow:function(taskId,actionName,opinion,data){
			var url=__ctx +"/flow/task/complete";
			var obj={taskId:taskId,actionName:actionName,
					opinion:opinion,data:angular.toJson(data),
					supportMobile:1};
			if(actionName == 'reject'){
				obj.backHandMode = 'normal'
			}
			var def=baseService.postForm(url,obj);
			return def;
		},
		/**
		 * 任务流转。
		 */
		startTrans:function(taskId,actionName,opinion,data){
			
			var url=__ctx +"/flow/task/saveTrans";
			var obj = {
					taskId:taskId,
					opinion:opinion,
					receiverIds:data,
					notifyType:"inner",
					action:"back",
					decideType:"agree",
					voteType:"percent"
				};
			var def=baseService.post(url,obj);
			return def;
		},
		
		/**
		 * 显示审批历史。
		 */
		showOpinion:function(runId){
			var url=__ctx +"/mobile/view/bpm/opinions.html?runId="+runId;
			window.location.href=url;
			//var conf={};
			//conf.title="审批历史" ;
			//conf.url=url;
			//createPopupDialog(conf,'flowStartDialog');
		},
		
		
		/**
		 * 手机流程图
		 */
		showFlowPic:function(runId){
			var url=__ctx +"/bpm/bpmImage?runId="+runId;
			var conf={};
			conf.title="流程图"
			conf.url=url;
			createPopupDialog(conf,'flowApproveDialog');
		},
		
		/**
		 * 获取通知类型。
		 */
		getInformType:function(){
			var url=__ctx +"/platform/system/share/getInformType.ht";
			var def=baseService.get(url);
			return def;
		},
		/**
		 * 取消代理。
		 */
		cancelAgent:function(data){
			var url=__ctx +"/platform/bpm/bpmTaskExe/cancel.ht";
			var def=baseService.post(url,data);
			return def;
		},
		/**
		 * 
		 */
		nodeUserSetting:function($scope){
			if($scope.prop && $scope.prop.firstNodeUserAssign ){
				var url = __ctx + "/mobile/bpm/nodeUsers.ht?defId="+$scope.defId;
				baseService.get(url).then(function(data){
					$scope.nodeUsers = data;
				},function(){});
			}
		}

	};
}])