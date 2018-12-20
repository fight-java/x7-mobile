var mobileDirective = angular.module("mobileDirective", ['base']);

/**
 * @说明 list页面数据加载事件
 * 下拉刷新必须包含 .pull-to-refresh-content
 * 无限加载 必须包含 .infinite-scroll
 * 
 * 页面scope中变量。
 * @scope.listParam ={page:1,rows:10}; list页面加载的参数
 * @scope.dataList 页面列表参数
 * @scope.pageResult 页面列表加载page结果
 */
mobileDirective.directive('htListLoad', ['baseService','$sce',function(baseService,$sce) {
	return {
		link : function($scope, element, attr) {
			$scope.queryEntity = {
				querys:[],
				quickQuery:[]
			};
			var url = attr.url;
			var isLoading = false;
			//加载数据
			$scope.loadData = function(callBack,isAppend){
				if(isLoading)return;
				else isLoading = true;
				baseService.post(url,buildParams()).then(function(data){
					isLoading = false;
					if(data.rows && data.rows.length){
						var newRows = $scope[attr.htListLoad].rows.concat(data.rows);
						data.rows = newRows;
						$scope[attr.htListLoad] = data;
					}
					$scope.queryEntity.pageBean.page = data.page;
					$scope.queryEntity.pageBean.pageSize = data.pageSize;
					if(data.page * data.pageSize < data.total){
						$scope.queryEntity.nextPage = $scope.queryEntity.pageBean.page + 1;
					}
					!$scope.$$phase&&$scope.$digest();
				},function(){
					isLoading = false;
					if(callBack)callBack();
					$.toast("加载失败");
				});
			}
			//快速查询和条件查询是分开的，请求后台数据的时候需要将两种查询组合起来
			function buildParams(){
				var quickQuery = $scope._getQuickSearchPropertys();
				var querys = $scope.queryEntity.querys;
				return {querys:querys.concat(quickQuery),pageBean:$scope.queryEntity.pageBean};
			}
			
			$scope.resetPageBean = function(){
				$scope.queryEntity.pageBean = {
					page:1,
					pageSize:10,
					showTotal:true
				};
				$scope[attr.htListLoad] = {
					rows:[],
					page:1,
					pageSize:10
				};
			}
			
			if(typeof attr.whenScrolled != "undefined"){
				// body窗口的滚动加载--需要Jquery
		        $(element).scroll(function () {  
		            //滚动条距离顶部的距离  
		            var scrollTop = $(element).scrollTop();  
		            //滚动条的高度  
		            var scrollHeight = $(element).scrollHeight();  
		            //窗口的高度  
		            var windowHeight = $(window).height(); 
		            if (scrollTop + windowHeight >= scrollHeight) {
		            	if($scope.queryEntity.nextPage > $scope.queryEntity.pageBean.page){
		            		$scope.queryEntity.pageBean.page++;
		            		$scope.loadData();
		            	}
		            }  
		        });  
			}
			
			$scope.setQueryParams = function(querys){
				$scope.queryEntity.querys = querys
			}
			
			$scope.updateListLoadUrl = function(newUrl){
				url = newUrl;
			}
			
			if(!attr.noInit){
				$scope.resetPageBean();
				$scope.loadData();
			}
			
			$scope.$broadcast('list:done',{})
		}	
	};
}])
//查询query = {property: f, value: value, operation: 'like', relation: 'or'};
.directive('htSearch', function() {  
	return {
		link : function($scope, element, attr, htListLoadCtrl) {
			$scope._searchText = '';
			
			$scope._searchTextChange = function(){
				$scope.resetPageBean();
				$scope.loadData();
			};
			
			$scope._getQuickSearchPropertys = function(){
				var querys = [];
				if(!$scope._searchText){
					return querys;
				}
				var propertys = attr.htSearch.split(",");
				for(var i = 0 ; i < propertys.length ; i++){
					var p = propertys[i];
					querys.push({
						property: p, value: $scope._searchText, operation: "LIKE", relation: "OR",grou:"quickSearch"
					});
				}
				return querys;
			}
			
			$scope._resetSearch = function(){
				$scope._searchText = '';
				$scope.resetPageBean();
				$scope.loadData();
			}
		},
		template : 
			'<div class="taskSearchIn">'+
			'<input class="taskSearchIpt" ng-model="_searchText" ng-change="_searchTextChange()" type="text" placeholder="搜索" />'+
			'<em ng-if = "_searchText != \'\' " class="clearSearch" ng-click="_resetSearch()"></em></div>',
		replace : false
	};
})
.directive('indexPage',['baseService', function(baseService){
    return {
    	restrict : 'AE',
    	templateUrl:__ctx+"/mobile/bpm/bpmIndex.html",
    	replace:true,
        link:function($scope, element,attrs){
        	$scope.pre_url = __ctx+"/mobile/bpm/"
        	$(document).on('refresh', '.pull-to-refresh-content',function(e) {
        		$scope.loadUserMsg();
   			   me.parser();
   			   setTimeout(function(){
   				 $.init();
   				 $.pullToRefreshDone('.pull-to-refresh-content');
   				 $.toast("刷新成功");
   	           },1000)
   			});
        	
        	$scope.loadUserMsg = function(){
        		baseService.postForm(__ctx+"/mobile/bpm/getUserMsg",{}).then(function(data){
            		$scope.userMsg = data;
            		$scope.userMsg.date = new Date();
            		if($scope.userMsg.user){
            			if(!$scope.userMsg.user.photo){
            				$scope.userMsg.user.photo = __ctx+"/mobile/assets/img/svg/default_avatar.svg";
            			}else{
            				$scope.userMsg.user.photo = __ctx + $scope.userMsg.user.photo;
            			}
            		}
            		
            	})
        	}
        	
        	$scope.loadUserMsg();
        }
    }
}])
//流程实例的状态
.directive('flowStatus',[ function(){
    return {
    	restrict : 'AE',
    	scope:{
    		flowStatus:"="
    	},
    	replace:true,
        link:function(scope, element,attrs){
        	element.after(statusList[scope.flowStatus]);
        	element.remove();
        }
    }
}])

/**
 * 自动添加资源路径的上下文
 */
.directive('htLink',function($compile){
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			if( "A" == $(element).prop("tagName")){
				$(element).on("click",function(){
					window.location.href = __ctx+attrs.htLink
				})
			}else{
				$(element).attr("src",__ctx+attrs.htLink)
			}
		}
	
	};
})

.directive('htBpmImage',['$filter','$timeout','baseService',function($filter,$timeout,baseService){
    return {
		restrict : 'AE',
		scope : {
			htBpmImage : "=",
		},
		controller : function($scope, $element, $timeout, $compile) {
			$scope.nodeOpinion = {
				opinionTemplate : '<ul class="opinion-container-ul no-padding">'
								 +'	<li ng-repeat="opinion in nodeOpinion.result.data">'
								 +'		<div class="m-sm">'
								 +'			<table class="table table-bordered">' 
								 +'				<tr><th width="30%">{{\'taskName\' | translate}}</th>'
								 +'					<td width="70%">{{opinion.taskName}}</td>'
								 +'				</tr>'
								 +'				<tr ng-show="opinion.auditor"><th>{{\'executor\' | translate}}</th>'
								 +'					<td><span class="owner-span">'
								 +'							<a href="javascript:void(0)" ng-click="showUserInfo(opinion.auditor)">{{opinion.auditorName}}</a>'
								 +'						</span>'
								 +'					</td>'
								 +'				</tr>' 
								 +'				<tr ng-show="!opinion.auditor">'
								 +'					<th>'
								 +'						<label class="fa fa-question-circle-o" tooltip-placement="right" uib-tooltip="{{\'quaug\' | translate}}"> {{\'candidate\' | translate}}</label>'
								 +'					</th>'
								 +'					<td><div class="owner-div">' 
								 +'							<span ng-repeat="qualfied in opinion.qualfieds" class="owner-span">'
								 +'								<a href="javascript:void(0)" ng-click="showDetail(qualfied)">{{qualfied.name}}</a>'
								 +'							</span>'
								 +'						</div>'
								 +'					</td>'
								 +'				</tr>'
								 +'				<tr><th>{{\'needPendingMeetingList.start_time\' | translate}}</th>'
								 +'					<td style="font-size:11px;">{{opinion.createTime | date:"yyyy-MM-dd HH:mm:ss"}}</td>'
								 +'				</tr>' 
								 +'				<tr><th>{{\'needPendingMeetingList.end_time\' | translate}}</th>'
								 +'					<td style="font-size:11px;">{{opinion.completeTime | date:"yyyy-MM-dd HH:mm:ss"}}</td>'
								 +'				</tr>' 
								 +'				<tr><th>{{\'timeForApproval\' | translate}}</th>'
								 +'					<td>{{opinion.durMs | htDuration}}</td>'
								 +'				</tr>' 
								 +'				<tr><th>{{\'status\' | translate}}</th>'
								 +'					<td>{{opinion.statusVal}}</td>'
								 +'				</tr>' 
								 +'				<tr><th>{{\'opinion\' | translate}}</th>'
								 +'					<td>{{opinion.opinion}}</td>'
								 +'				</tr>' 
								 +'			</table>'
								 +'		</div>'
								 +'	</li></ul>',
				executorTemplate : '<div class="m-sm">'
								  +'	<table class="table table-bordered">'
								  +'		<tr><th width="120">{{\'status\' | translate}}</th>'
								  +'			<td width="150">{{\'noTask\' | translate}}</td>'
								  +'		</tr>' 
								  +'		<tr><th>'
								  +'				<label class="fa fa-question-circle-o" tooltip-placement="right" uib-tooltip="{{\'ctuaugwaq\' | translate}}"> {{\'tentativeCandidate\' | translate}}</label>'
								  +'			</th>'
								  +'			<td><div class="owner-div">' 
								  +'					<span ng-repeat="qualfied in nodeOpinion.result.data" class="owner-span">'
								  +'						<a href="javascript:void(0)" ng-click="showDetail(qualfied)">{{qualfied.name}}</a>'
								  +'					</span>' 
								  +'				</div>'
								  +'			</td>'
								  +'		</tr>'
								  +'	</table>'
								  +'</div>'
			};

			// 显示用户及用户组信息
			$scope.showDetail = function(info) {
				if (!info)
					return;
				switch (info.type) {
					case "user":
						break;
					case "org":
						break;
					case "role":
						break;
					case "pos":
						break;
				}
			}

			// 编译模板
			$scope.compileContent = function(api) {
				if (!$scope.nodeOpinion.result)
					return;
				// 审批意见的模板
				if ($scope.nodeOpinion.result.hasOpinion) {
					// 将候选人的信息从字符串转换为json
					angular.forEach($scope.nodeOpinion.result.data, function(item) {
						if (item.qualfieds) {
							item.qualfieds = parseToJson(item.qualfieds);
						}
					});
					$scope.nodeOpinion.content = $compile($scope.nodeOpinion.opinionTemplate)($scope);
				}
				// 未审批任务也未产生任务的节点，显示节点执行人信息
				else {
					api.set('content.title', $filter('translate')('nodeSettingsDetails'));
					$scope.nodeOpinion.content = $compile($scope.nodeOpinion.executorTemplate)($scope);
				}
			}

			// 获取节点的审批详情
			$scope.getContent = function(event, api) {
				$timeout(function() {
					// 判断缓存里是否已经存在该节点的审批详情
					if (!$scope.nodeOpinion.content) {
						var url = "${bpmRunTime}/runtime/task/v1/nodeOpinion?instId="+$scope.htBpmImage.instId+"&nodeId="+$scope.htBpmImage.nodeId;
						baseService.get(url).then(function(result){
							$scope.nodeOpinion.result = result;
							// 获取到审批详情的json数据后与模板编译成html代码
							$scope.compileContent(api);
							api.set('content.text', $scope.nodeOpinion.content);
						});
					} else {
						api.set('content.text', $scope.nodeOpinion.content);
					}
					api.reposition();
				}, 100, false);
				return $filter('translate')('gettingContent');
			}
		},
		link : function(scope, element, attrs) {
			// 只有用户任务和会签任务才显示审批详情
			if (("USERTASK,SIGNTASK").indexOf(scope.htBpmImage.nodeType) == -1)
				return;
			var setting = {
				content : {
					text : scope.getContent,
					title : $filter('translate')('taskApprovalDetails')
				},
				hide : {
					event : 'mouseleave',
					leave : false,
					fixed : true,
					delay : 200
				},
				position : {
					viewport: $('#divContainer'),
					my : 'center bottom',
					at : 'bottom right'
				},
				style : {
					classes : 'qtip-default qtip qtip-bootstrap qtip-shadow'
				}
			};
			$timeout(function(){
				// 添加tooltip显示审批详情
				element.qtip(setting);
			}, 1);
		}
    }
}])

//查询
.directive('htOpinionStatus', function() {  
	return {
		restrict : 'AE',
    	scope:{
    		htOpinionStatus:"="
    	},
		link : function(scope, element, attr, ctrl) {
			var emCla = "";
			var pCla = "";
			var status = scope.htOpinionStatus.status;
			if(status == 'start' || status == 'reSubmit'){
				emCla="Hstate_tjImg";
				pCla="Hstate_tjWord";
			}
			if(status == 'end' || status == 'manual_end'){
				emCla="Hstate_jsImg";
				pCla="Hstate_jsWord";
			}
			if(status == 'awaiting_check' || status == 'start_commu' || status == 'awaiting_feedback' || status == 'feedback' || status == 'transforming' || status == 'deliverto'){
				emCla="Hstate_dspImg";
				pCla="Hstate_dspWord";
			}
			if(status == 'agree' || status == 'signPass' || status == 'transAgree'){
				emCla="Hstate_tyImg";
				pCla="Hstate_tyWord";
			}
			if(status == 'oppose' || status == 'reject' || status == 'backToStart' || status == 'revoker' || status == 'transRevoker' || status == 'revoker_to_start' || status == 'transOppose'){
				emCla="Hstate_bhImg";
				pCla="Hstate_bhWord";
			}
			if(status == 'abandon' || status == 'signNotPass' || status == 'signBackCancel' || status == 'signRecoverCancel' || status == 'passCancel' || status == 'notPassCancel' || status == 'deliverto_cancel'){
				emCla="Hstate_qxbhImg";
				pCla="Hstate_qxbhWord";
			}
			if(status == 'skip'){
				emCla="Hstate_tgImg";
				pCla="Hstate_tgWord";
			}
			element.find("em").addClass(emCla);
			element.find("p").addClass(pCla);
			element.find("p").text(scope.htOpinionStatus.statusVal)
		},
		template : 
			'<div class="Hstate">'+
			'<em class=""></em>'+
			'<p class=""></p></div>',
		replace : true
	};
})

//返回按钮
.directive('htBack', function() {  
	return {
		link : function(scope, element, attr, ctrl) {
			scope._htGoBack = function(){
				if(scope.goBack){
					scope.goBack();
				}else{
					HtUtil.goBack();
				}
			};
		},
		template : 
			'<span class="title_left"><em ng-click="_htGoBack()" class="goback"></em></span>',
		replace : true
	};
})

;

var statusList={
		revoke:			'撤回',
		revokeToStart:	'撤回到发起人',
		draft:			'草稿',
		running:		'运行中',
		end:			'结束',
		manualend:		'人工结束',
		back:			'驳回',
	//taskTurn 的特殊状态
		finish:			'完成',
		cancel:			'取消',
};

mobileDirective.filter("selfFormateDate",function(){
	return function (cDate) {
		if(cDate != undefined){
			var weeks=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]; 
			var day = cDate.getUTCDate()+"日";
			var month = cDate.getUTCMonth()+1+"月";
			var year = cDate.getUTCFullYear()+"年";
			var week = weeks[cDate.getUTCDay()];
			return year+month+day+"   "+week;  
		}
	}  
})
mobileDirective.filter("countDate",function(){
	return function (date) {
		var currentDate = new Date().getTime();
		date = new Date(date).getTime();
		if(date != undefined){
			var total = (currentDate - date)/1000;
			var day = parseInt(total / (24*60*60));//计算整数天数
			var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
			var hour = parseInt(afterDay/(60*60));//计算整数小时数
			var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
			var min = parseInt(afterHour/60);//计算整数分
			var afterMin = parseInt(total - day*24*60*60 - hour*60*60 - min*60);//取得算出分后剩余的秒数
			var val = "";
			if(day != 0){
				val += day+"天";
			}
			if(hour != 0){
				val += hour+"小时";
			}
			if(min != 0){
				val += min+"分钟";
				if(afterMin != 0){
					val += afterMin+"秒前";
				}
			}else{
				val += "刚刚";
			}
			return val;
		}
	}  
})
mobileDirective.filter("timeLag",function(){
	return function (difference) {
		var  r ="",
		////计算出相差天数
		days=Math.floor(difference/(24*3600*1000)),
		//计算出小时数
		 leave1=difference%(24*3600*1000),   //计算天数后剩余的毫秒数
		 hours=Math.floor(leave1/(3600*1000)),
		//计算相差分钟数
		 leave2=leave1%(3600*1000),      //计算小时数后剩余的毫秒数
		 minutes=Math.floor(leave2/(60*1000)),
		//计算相差秒数
		  leave3=leave2%(60*1000),    //计算分钟数后剩余的毫秒数
		  seconds=Math.round(leave3/1000);
		if(days>0) r +=days+"天";
		if(hours>0) r +=hours+"小时";
		if(minutes>0) r +=minutes+"分钟";
		if(seconds>0) r +=seconds+"秒";
		
		return r;
	}  
})
mobileDirective.filter("countEmailDate",function(){
	return function (date) {
		var currentDate = new Date();
		if(date != undefined){
			var cDate = new Date(date);
			var weeks=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]; 
			var day = cDate.getUTCDate();
			var month = cDate.getUTCMonth()+1;
			var year = cDate.getUTCFullYear();
			var week = weeks[cDate.getUTCDay()];
			var hour = cDate.getUTCHours();
			var min = cDate.getUTCMinutes();
			var curday = currentDate.getUTCDate();
			var curmonth = currentDate.getUTCMonth()+1;
			var curyear = currentDate.getUTCFullYear();
			if(year == curyear && month == curmonth && day == curday){
				return hour +":"+min;
			}
			if(isSameWeek(cDate,currentDate)){
				return week;
			}
			if(year == curyear){
				return month+"-"+day;
			}else{
				return year+"-"+month+"-"+day;
			}
		}
	}  
})
// 判断是否为同一周
function isSameWeek(old,now){  
    var oneDayTime = 1000*60*60*24;  
    var old_count =parseInt(old.getTime()/oneDayTime);  
    var now_other =parseInt(now.getTime()/oneDayTime);  
        return parseInt((old_count+4)/7) == parseInt((now_other+4)/7);  
}  		


mobileDirective.filter("meetingTimes",function(){
	return function (date) {
		if(date != undefined){
			var weeks=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]; 
			var day = date.getUTCDate();
			var month = date.getUTCMonth()+1;
			var week = weeks[date.getUTCDay()];
			return month+"月"+day+"日"+" "+week;
		}
	}  
})

mobileDirective.filter("appointmentTime",function(){
	return function (date) {
		if(date != undefined){
			date = new Date(date);
			var hour = date.getHours();
			var min = date.getMinutes();
			return hour +":"+min;
		}
	}  
})
mobileDirective.filter('htDuration', function(){
	return function(input){
		if(!input || input <1) {
			return '';
		}
        return HtUtil.timeLag(input);
    }
})
mobileDirective.filter("nameAlias",function(){
	return function (name) {
		if(name != undefined && name.length >= 3){
			if(/[\u4e00-\u9fa5]+/g.test(name)){
				name = name.substring(name.length-2);
			}else{
				name = name.substring(name.length-4)
			}
		}
		return name;
	}  
})