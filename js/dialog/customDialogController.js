var cDialog = angular.module("customDialog", []);
cDialog.controller('userDialogCtrl', ['$scope', function(scope){
	//param打开对话框传递的参数
	scope.param = dialogConf.param||{},scope.returnData =[];
	scope.returnField = returnField;//自定义对话框中返回字段的设置内容,用于辅助设置回显内容
	scope.needTree = needTree;//自定义对话框是否为树形
	var isSingle = dialogConf.isSingle;
	if(isCombine)dialogConf.dialog_alias_ =listDialogalias;
	scope.isShowSelect=true;

	if (dialogConf.initData) {//处理回显数据
		$(dialogConf.initData).each(function() {
			var that = this;
			$(scope.returnField).each(function(){
				that[this["field"].toUpperCase()]=that[this["comment"]];
			});
			scope.returnData.push(that);
		});
	}
	
	//确定按钮
	scope.dialogOk=function(){
		//将选择的值更新到data{[],[],}中
		var returnJson = [];
		for(var i=0,data;data=scope.returnData[i++];){
			var tempData={};
			for (var j = 0,field;field=returnField[j++];){
				tempData[field.comment]=data[field.field.toUpperCase()];
			}
			returnJson.push(tempData);
		 }
		scope.closeDialog();
		dialogConf.callBack(returnJson);
	}
    	 
	//重新加载对话框数据isSearch，是否搜索,treeNode 只在树查找。
	scope.reload = function(isSearch,treeNode){
		//初始化page //如果是查询则当前页面初始化为1 ,查询的时候，忽略树形参数
		if(!scope.pageParam)scope.pageParam ={isMobile:true,page:1,pageSize:5,placeholder:"",dialog_alias_:listDialogalias};
		if(listDialogalias=='userSelector'){//如果是用户选择器,则使用新的搜索匹配方式
			scope.pageParam.onlyUser=true;
			scope.pageParam.selectKey=scope.param._queryData;
		}
		if(isSearch) scope.pageParam.page=1;
		//设置参数
		var param = {};
		if(scope.param._queryName) param[scope.param._queryName] =scope.param._queryData;
		
		scope.pageParam.queryParam_ =angular.toJson(param);
		
		$.post( __ctx+'/form/customDialog/getListData',scope.pageParam,function(data){
   			//列表数据
			scope.dataList = data.rows;
			if(scope.pageResult){//防止customDialog设置为分页时出错
				scope.pageResult = data.pageResult;
				scope.pageParam.page = data.pageResult.page;
			}else{
				scope.pageResult = data.pageResult;
			}
			 //如果树搜索，且有数据，或者是搜索。
			 if(isSearch && data.rows.length>0){
				 $("#dataListTab").click();
			 }
			 else if(data.rows.length==0){
				 $.toast("未查到数据！");
			 }
   			 scope.handelChecked();
  			 scope.$digest();
	 	});
		
	}
    	
	/**
	 * 树点击
	 * 组合对话框情况下，为list提供参数，
	 * 普通情况向returnData 填充数据
	 */
	scope.treeClick = function(event, treeId,treeNode){
		
		if(isCombine){
			for(var i=0,p;p=scope.tree4ListParamKey[i++];){
				scope.pageParam[p.listField] =treeNode[p.treeField];
			}
			scope.reload(true,treeNode);
			scope.pageParam.placeholder='查找['+treeNode[scope.treeDisplayName]+']';
		}else{
			scope.pushToReturnData(treeNode);
		}
		scope.$digest();
	}
	scope.beforeAsync = function(event, treeNode){
		if(treeNode.isParent){
			return true;
		}else{
			return false;
		}
	}
	//将选择数据添加到返回列表中
	scope.pushToReturnData = function(data){
		
		var selectData = {};
		if(scope.needTree){
			$(scope.returnField).each(function(){
				var key = this["field"];
				var val = data[key];
				selectData[key.toUpperCase()] = val;
			});
		}else{
			selectData = data;
		}
		
		if(isSingle) {
			scope.returnData[0] =selectData;
		}else if(scope.indexOfArray(scope.returnData,selectData)==-1){
			scope.returnData.push(selectData);
		}
		scope.handelChecked();
	}
	/**
	 *  判断一个对象是否存在于某一个数组。     
	 *  计算方法，判断当前Obj的所有属性。    
	 *  如果当前对象缺少的属性，忽略。       
	 *  如果存在不同则不同。            
	 */
	scope.indexOfArray = function(arr,object){
		if(!arr ||!object ||arr.length==0) return -1;
		var index = false;
		for (var i = 0; i < arr.length; i++) {
			var thisData =arr[i];
			var curentOneIsSame =true;
			for(var key in object){
				if("$$hashKey,checked".indexOf(key)!= -1)continue;//排除掉一些常用变量
				if(thisData[key] && object[key] && thisData[key] != object[key]){
					curentOneIsSame = false; 
					break;
				}
			}
			if(curentOneIsSame) return i;
		}
		return -1;
	}
		
	scope.loadOrgTree = function(){
		// 树形参数
		var treeUrl = __ctx+"/form/customDialog/getTreeData?dialog_alias_="+treeAlias;
		var treeParam = eval("("+treeParamStr+")");
		
		
		ztreeCreator = new ZtreeCreator("customerTree",treeUrl)
		.setDataKey({idKey:treeParam.id,pIdKey:treeParam.pid,name:treeParam.displayName,title:treeParam.displayName})
		.setCallback({
			onClick:scope.treeClick
			})
		.setOutLookStyle();
		if (treeParam.selectNum != 1) {// 多选
			var str = "";
			if(treeParam.parentCheck==1){
				str+="p";
			}
			if(treeParam.childrenCheck==1){
				str+="s";
			}
			ztreeCreator.setCheckboxType({
				"Y" : str,
				"N" : str
			});
		}
		//异步加载树
		ztreeCreator.setAsync({
			enable : true,
			url : treeUrl,
			autoParam : [ treeParam.id, treeParam.pid ],
			otherParam:treeParam
		});
		//修复单选时，用ctrl键可以多选
		treeParam.setting = {
			view: {
				selectedMulti: true,
			},
		};
		ztreeCreator.initZtree(treeParam,1,function(treeObj,treeId){
			
			});
		//组合对话框情况下，树作为列表参数传入
		if(isCombine){
			var combineParam = eval("(" + combineField + ")");
			scope.tree4ListParamKey =[];
			for (var int = 0; int < combineParam.length; int++) {
				var temp ={} ;
				temp.treeField =combineParam[int].list.fieldName;
				temp.treeDisplayName =treeParam.displayName;
				temp.listField =combineParam[int].tree.fieldName;
				temp.defaultValue =combineParam[int].list.defaultValue;
				scope.tree4ListParamKey.push(temp);
			}
			scope.treeDisplayName =treeParam.displayName;
		}
		
	}
		
	//ListTree选择一个
	scope.selectOne = function(selectData){
		if(selectData.checked) {
			scope.unChoiceOne(scope.indexOfArray(scope.returnData,selectData));
			return;
		}
		scope.pushToReturnData(selectData);
		$.toast("已经添加");
	}
	//删除选择
	scope.unChoiceOne = function(index){
		scope.returnData.splice(index,1);
		scope.handelChecked();
		$.toast("已经移除");
	}
	//前一页
	scope.prewPage = function (){
		if(scope.pageParam.page>1){
			scope.pageParam.page--;
			scope.reload();
		}
	}
	//后一页
	scope.nextPage = function (){
		if(scope.pageParam.page<scope.pageResult.totalPages){
			scope.pageParam.page++;
			scope.reload();
		}
	}
	// 关闭弹框
	scope.closeDialog = function(){
		dialogConf.closeDialog();
	}
	//清除
	scope.cleanSelect=function(){
		scope.returnData=[];
		scope.handelChecked();
		$.toast("已经清除所有");
	}
	//选中已选的checkBox
	scope.handelChecked = function(){
	 if(!scope.dataList) return;
	 for(var i=0,data;data=scope.dataList[i++];){
	    data.checked = false;
	    
	    if(scope.indexOfArray(scope.returnData,data)!=-1)
	    	data.checked=true;
	 }
	}
	scope.setPlaceHolder = function(text){
		var text = $("#select").find("option:selected").text().trim();
		scope.placeholder = text;
	}
	
	scope.initParam = function(queryName,placeholder){
		if(listDialogalias=='userSelector'){//如果是用户选择器
			scope.placeholder='姓名或其字母查询...';
			scope.isShowSelect=false;
			$('div.searchbar.row').find('div.search-input.col-80').css('width','95%');
		}else{
			scope.placeholder = placeholder;
			scope.param._queryName=queryName;
		}
      	scope.$watch('param._queryData', function(newValue, oldValue) {
    		if(newValue!=oldValue){
    			scope.reload(1);
    		}
    	});
	}
		
	if(needList) scope.reload();
	if(needTree) scope.loadOrgTree();
}
]);
		
		