/**
 * 自定义查询调用方法。 
 * condition:数据格式 
 * { 
 * 		alias:"自定义查询别名", 
 * 		needPage:true, 
 * 		page:1,
 * 		pageSize:pageSize, 
 * 		querydata:{name:"ray",address:"gz"} 
 * } 
 * alias:自定义查询别名
 * needPage:是否需要分页，默认为false 如果needPage为true就需要传入： page: 当前页 pageSize:页大小
 * querydata: 查询参数，一个json结构，格式：{name:"ray",address:"gz"}
 * 
 * @param condition
 * @param callback
 *            回调函数处理返回的值。
 * @param isSync
 *            是否同步，true 同步，默认为异步。
 * 
 * 示例: var condition={alias:"自定义查询别名"}; 
 * DoQuery(condition,function(data){
 * console.info(data); },true);
 */
function DoQuery(condition, callback, isSync) {
	var url = __ctx + '/form/customQuery/doQuery';

	if (condition.querydata) {
		var arr = [];
		for (key in condition.querydata) {
			arr.push({
				key : key,
				value : condition.querydata[key]
			});
		}
		condition.querydata = JSON.stringify(arr);
	}

	var isAsync = true;
	if (isSync != undefined && isSync == true) {
		isAsync = false;
	}

	$.ajax({
		type : "POST",
		url : url,
		async : isAsync,
		data : condition,
		success : function(data) {
			if (data.rows && callback)
				callback(data.rows);
		}
	});

};

/**
 * 自定义对话框。 调用方法 openCustomDialog
 */
var CustomDialog = {
	/**
	 * 
	 * @param alias(必填):自定义对话框别名
	 * @param callBack(必填):回调函数，eg：function(data,dialog) {
				$.topCall.alert("返回结果", JSON.stringify(data));
				dialog.dialog('close');
			};
	 * @param conf(可选):{
	 * selectNum : (人为修改多选单选配置):-1 多选/1 单选,
	 * initData(初始化数据) : 数据格式和返回回调函数中的data的格式相同。
	 * param(参数，用于动态传入的条件初始化条件):{a:"1",b:"2",...}
	 * }
	 * 
	 */
	openCustomDialog : function(alias, callBack, conf) {

		if (!callBack) {
			callBack = function(data) {
				$.topCall.alert("返回结果", JSON.stringify(data));
			};
		}
		
		var url = __ctx + '/form/customDialog/getByAlias?alias=' + alias;
		$.ajax({
			url : url,
			type : 'POST',
			dataType : 'json',
			success : function(customDialog) {
				CustomDialog.open(customDialog, callBack, conf);
			}
		});

	},
	open : function(customDialog, callBack, conf) {
		var url;
		if (customDialog.style == 1) {// 树形
			url = __ctx + '/form/customDialog/customDialogShowTree?dialog_alias_=' + customDialog.alias;
		} else {// 列表形
			url = __ctx + '/form/customDialog/customDialogShowList?dialog_alias_=' + customDialog.alias;
		}
		
		var selectNum = 1;//是否多选 -1：多选，其他默认为单选
		
		try {
			if(typeof(customDialog.selectNum) != "undefined"){
				selectNum = customDialog.selectNum;
			}
			if(typeof(conf.selectNum) != "undefined"){
				selectNum = conf.selectNum;
			}
		} catch (e) {}
		var dfbuttons = [ {
			text : '确定',
			handler : function(e) {
				var win = dialog.innerWin;// 获取自定义对话框
				var data = win.getResult();// 调用自定义对话框的jsp里面的方法获取结果
				callBack(data, dialog);
			}
		}, {
			text : '关闭',
			handler : function() {
				dialog.dialog('close');
			}
		} ];
		if(selectNum==-1){ // -1：多选
			var clearBtn = {
					id : 'buttonsid',
					text : '清空',
					handler : function() {
						var win = dialog.innerWin;// 获取自定义对话框
						var scope = win.AngularUtil.getScope();
						if(win.AngularUtil.getScope().customDialog.alias == "orgSelector"){
							win.canclCheckBox();
						}
						if(scope && scope.clear ){
							scope.clear();
							win.AngularUtil.setData(scope);
						}
						//callBack([], dialog);
					}
				};
			dfbuttons.insert(1,clearBtn);
		}
		
		var dialog;
		var def = {
			passConf : conf,
			title : customDialog.name,
			width : customDialog.width,
			height : customDialog.height,
			modal : true,
			resizable : true,
			buttons : dfbuttons,
		};
		dialog = $.topCall.dialog({
			src : url,
			base : def,
		});
	}
}

/**
 * 组合对话框。
 * 
 * 调用方法：open
 */
var CombinateDialog = {
	/**
	 * 最终都是调用这个方法打开对话框 conf:{ combinateDialog:组合对话框对象 callBack:回调函数
	 * function(data,dialog){} data:数据;dialog:对话框对象 }
	 */
	openDialog : function(conf) {
		var combinateDialog = conf.combinateDialog;
		var dialog;
		var def = {
			title : combinateDialog.name,
			width : combinateDialog.width,
			height : combinateDialog.height,
			modal : true,
			resizable : true,
			buttons : [ {
				text : '确定',
				handler : function(e) {
					var win = dialog.innerWin;// 获取对话框
					var data = win.getResult();// 调用对话框的jsp里面的方法获取结果
					conf.callBack(data, dialog);
				}
			}, {
				text : '关闭',
				handler : function() {
					dialog.dialog('close');
				}
			} ]
		};
		var selectNum = conf.selectNum?conf.selectNum:-1;
		var initData = conf.initData&&conf.initData.length>0?encodeURI(encodeURI(JSON.stringify(conf.initData))):"";
		//var initData = conf.initData&&conf.initData.length>0?$.base64.encode(JSON.stringify(conf.initData),"utf-8"):"";
		dialog = $.topCall.dialog({
			src : __ctx + "/form/combinateDialog/combinateDialogShow?id=" + combinateDialog.id+"&selectNum="+selectNum+"&initData="+initData,
			base : def
		});
	},

	/**
	 * 打开对话框。 conf:{ alias:组合对话框对象的别名 (alias选一个则可，反正要能找到唯一对象则可) callBack:回调函数
	 * function(data,dialog){} data:数据;dialog:对话框对象 }
	 */
	open : function(conf) {
		var that = this;

		if (!conf.alias) {
			$.topCall.error("请选入唯一id或别名");
			return;
		}
		var url = __ctx + '/form/combinateDialog/getObject?alias=' + conf.alias;

		if (conf.callBack == null) {
			conf.callBack = function(data) {
				$.topCall.alert("返回结果", JSON.stringify(data));
			}
		}

		$.ajax({
			url : url,
			type : 'POST',
			dataType : 'json',
			error : function() {
				$.topCall.error("加载组合对话框出错");
			},
			success : function(result) {
				conf.combinateDialog = result;
				that.openDialog(conf);
			}
		});
	}
}