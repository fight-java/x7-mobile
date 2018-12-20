


var getDirectiveTplHtml = (function(){
	var templateHtml = {
/*htUpload 附件上传的HTML模板*/
		htUpload: {
	        PC: '<span ng-if="permission==\'w\' || permission==\'b\'">\
	        		<div class="ht-input">\
	        			<span class="span-user owner-span" ng-repeat="item in files track by $index">\
	        				<a class="download-btn" title="下载该文件"  ng-click="onClick(item.id)">{{item.name}}</a>\
	        				<a class="btn btn-xs fa-remove" title="移除该项" ng-click="remove($index)"></a>\
	        			</span>\
			    	</div>\
	        		<a class="btn btn-sm btn-primary fa-upload" ng-click="showDialog()"><span>上传</span></a>\
	        	</span>\
	        	<div ng-if="permission==\'r\'">\
					<span ng-repeat="item in files track by $index">\
	        			<a class="btn  fa-cloud-download" title="下载该文件" ng-click="onClick(item.id)">{{item.name}}</a>\
					</span>\
	        	</div>',

			mobile: '<div ng-if="permission==\'w\' || permission==\'b\'">\
					<div style="text-align:left;" class="row">\
						<p class="detail_list_tit02 Fupload" ng-click="showDialog()">文件上传</p>\
						<div>\
							<div class="Fupload_list clearfix" ng-repeat="file in files track by $index">\
								<div class="Fupload_else" ng-click="onClick(file.id)">\
									<p class="Fupload_name">{{file.name}}</p>\
									<span class="Fupload_size">{{file.size/1024/1024|number:2}}MB</span>\
								</div>\
								<em class="cancel_upload" ng-click="remove($index,$event)"></em>\
							</div>\
						</div>\
					</div>\
        		</div>\
				<div ng-if="permission==\'r\'" class="row" >\
					<p class="detail_list_tit02" >文件上传</p>\
					<div>\
						<div class="Fupload_list clearfix" ng-repeat="file in files track by $index">\
							<div class="Fupload_pdf" ng-click="onClick(file.id)">\
								<p class="Fupload_name">{{file.name}}</p>\
								<span class="Fupload_size">{{file.size/1024/1024|number:2}}MB</span>\
							</div>\
						</div>\
					</div>\
				</div>'
	    },
	    htSelector:{
	    	PC:'<div style="display: block" ng-if="permission==\'w\' || permission==\'b\'" class="input-group">\
						<div class="ht-input">\
							<span class="span-user owner-span" ng-repeat="item in names track by $index">\
								 <span  ng-click="selectedOnClick($index)">{{item}}</span>\
								 <span class="btn btn-xs  fa-remove"  title="移除该项" ng-click="remove($index)"></span>\
							</span>\
						</div>\
    			<a class="btn btn-sm btn-primary fa-search" style="margin-top:1px" ng-click="showDialog()">选择</a>\
				</div>\
				<div ng-if="permission==\'r\'" class="input-group" >\
					<span ng-repeat="item in names track by $index">\
						<a style="margin: 4px" class="btn span-user owner-span" ng-click="selectedOnClick($index)">{{item}}</a>\
					</span>\
				</div>',

			mobile:'<span>\
				<div ng-if="permission==\'w\' || permission==\'b\'">\
					<p class="detail_list_tit02 Fselector" ng-click="showDialog()">{{selectorTitle}}</p>\
					<div class="clearfix">\
						<div ng-repeat="item in names track by $index" class="Fselector_cell"><span class="Fselector_cell_w">{{item}}</span><em ng-click="remove($index)" class="cancel_selector"></em></div>\
					</div>\
				</div>\
				<div ng-if="permission==\'r\'" class="row" >\
					<p class="detail_list_tit02" >{{selectorTitle}}</p>\
					<div class="clearfix">\
						<div ng-repeat="item in names track by $index" class="Fselector_cell"><span class="Fselector_cell_w">{{item}}</span></div>\
					</div>\
				</div>\
			</span>',
	    },
	    
    htDic:{
	    	PC:'<div >\
		    		<div ng-show="permission==\'w\' || permission==\'b\'" class="dropdown">\
					<span ng-bind="dicData.value" readonly="readonly" type="text" class="form-control ht-input" style="width: 75%; float: left;margin-right:2px;" placeholder="点击选择" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></span>\
	    					<a href="javaScript:void(0)" ng-click="dicClean()" class="btn btn-sm btn-primary fa-rotate-left"></a>\
	    					<div class="dropdown-menu" style=" width: 80%; margin-left: 11px;">\
								<ul style="height:200px;overflow-y:auto;" id="{{treeId}}" class="ztree"></ul>\
							</div>\
					</div>\
					<div ng-show="permission==\'r\'">{{dicData.value}}</div>\
    		   </div>',

			mobile:'<div >\
		    		<div  ng-show="permission==\'w\' || permission==\'b\'" style="text-align: left" >\
						<div style="width: 100%">\
							<input  ng-model="dicData.value"    ng-click="showDialog()" readonly="readonly" type="text" class=" ht-input ht-dic" placeholder="点击选择" >\
							<a style="word-wrap:break-word;padding:14px;position: absolute;" class="fa fa-close icon-button" ng-if="htDic" title="清除选中" ng-click="dicClean()"></a>\
							<div id="popover{{treeId}}" class="popover">\
								<ul id="{{treeId}}" class="ztree"></ul>\
							</div>\
						</div>\
				  	</div>\
					<div ng-show="permission==\'r\'">{{dicData.value}}</div>\
				</div>',
    	}
	};
	
	
	
	
return function(directiveName) {
	if(typeof(window.FORM_TYPE_) == "undefined")window.FORM_TYPE_="PC"
	
	if(!templateHtml[directiveName])alert(directiveName+"指令URL不存在");
	
	return templateHtml[directiveName][window.FORM_TYPE_];
}
})();
