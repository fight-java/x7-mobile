var modules = ["base", "formServiceModule"];
if (window.FORM_TYPE_ == 'mobile') {
    modules = ["base", "formServiceModule", "mobiscroll-datetime"];
}

var formDirective = angular.module("formDirective", modules);


/**
 * 功能说明：
 * 选择器
 * <input type="text"   permission="" ht-selector="main.name"
 *   selectorconfig="{type:\'UserDialog\',display:\'fullName\', single:true,
					  bind:{userId:\''+dataName+'id\',fullName:\''+dataName+'\'}}" />
 permission：w 可选择，r 显示选择的数据。
 ht-selector : scope 数据表达式。
 主表：data.main.name
 子表：item.name

 selectorconfig:对话框配置
 single:true 或 false 是否单选
 type：对话框类型
 display ：对话框显示的字段。
 bind：key 为对话框返回字段
 val 为scope数据表达式
 */
formDirective.directive('htSelector', ['$rootScope', 'baseService', function ($rootScope, baseService) {
    return {
        restrict: 'AE',
        template: getDirectiveTplHtml('htSelector'),
        scope: {
            htSelector: '='
        },
        link: function ($scope, element, attrs) {

            element.removeClass();
            $scope.permission = getPermission(attrs.permission, $scope);
            //绑定配置
            var selector = eval("(" + attrs.selectorconfig + ")");
            //绑定配置
            var bind = selector.bind;

            //显示字段。
            var display = selector.display;
            // 除去掉无效的bind
            for (var key in bind) {
                if (!bind[key].split(".")[1]) delete bind[key] //如果当前bind 不是 data.table.xx /item.field 则移除
                if (bind[key] == attrs.htSelector) display = key; //display 展示字段等于当前控件的填充值
            }

            //是否单选

            $scope.data = {};
            $scope.firstInit = true;//是否第一次执行initData函数


            //将控件数据初始化到指定本地域中。
            $scope.initData = function () {
                var userinfo = null;
                var deptinfo = null;
                var postinfo = null;
                if ("UserDialog" == selector.type && selector.showCurrentUserName) {
                    if ($(element).data("userinfo")) return;
                    baseService.get(__ctx + "/org/user/getCurrentUser").then(function (data) {
                        if (data.message != '') {
                            var message = JSON.stringify(data.message);
                            message = JSON.parse(message);
                            userinfo = eval("(" + message + ")");
                            userinfo.name = userinfo.fullname;
                            $(element).data("userinfo", userinfo);
                        }
                    });
                }
                if ("OrgDialog" == selector.type && selector.showCurrentUserDeptName) {
                    if ($(element).data("deptinfo")) return;
                    baseService.get(__ctx + "/org/org/getCurrentUserDept").then(function (data) {
                        if (data.message != '') {
                            var message = JSON.stringify(data.message);
                            message = JSON.parse(message);
                            deptinfo = eval("(" + message + ")");
                            $(element).data("deptinfo", deptinfo);
                        }
                    });
                }
                if ("PostDialog" == selector.type && selector.showCurrentUserPostName) {
                    if ($(element).data("postinfo")) return;
                    baseService.get(__ctx + "/org/org/getCurrentUserPost").then(function (data) {
                        if (data.message != '') {
                            var message = JSON.stringify(data.message);
                            message = JSON.parse(message);
                            postinfo = eval("(" + message + ")");
                            $(element).data("postinfo", postinfo);
                        }
                    });
                }
                setTimeout(function () {//初始化编辑进来的boAttr
                    for (var key in bind) {
                        var val = eval("($scope.$parent." + bind[key] + ")");
                        var aryVal = [];
                        $scope.data[key] = [];
                        if (val) {
                            aryVal = val.split(",");
                            //数据存放local变量data中。
                            $scope.data[key] = aryVal;
                        } else {
                            if (userinfo) {
                                aryVal[0] = userinfo[key];
                                $scope.data[key] = aryVal;
                            }
                            if (deptinfo) {
                                aryVal[0] = deptinfo[key];
                                $scope.data[key] = aryVal;
                            }
                            if (postinfo) {
                                aryVal[0] = postinfo[key];
                                $scope.data[key] = aryVal;
                            }
                        }
                    }

                    $scope.render();
                    $scope.updScope();
                }, 500);
            }

            //对值进行双向绑定
            $scope.$watch('htSelector', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.initData();
                    $scope.render();
                }
            });

            //数据展示
            $scope.render = function () {
                $scope.names = $scope.data[display];
            }
            /**展示对话框*/
            $scope.showDialog = function () {
                var initData = [];
                for (var i = 0; i < $scope.data[display].length; i++) {
                    var obj = {};
                    for (var key in bind) {
                        obj[key] = $scope.data[key][i];
                    }
                    initData.push(obj);
                }
                //打开对话框，scope.dialogOk则为处理同意数据
                var conf = $.extend(selector, {callBack: $scope.dialogOk, initData: initData});
                eval(selector.type + '(conf)');
            }
            //删除数据信息
            $scope.remove = function (index) {
                for (var key in $scope.data) {
                    var ary = $scope.data[key];
                    ary.splice(index, 1);
                }
                $scope.updScope();
            }// 选中数据点击事件
            $scope.selectedOnClick = function (index) {
                for (var key in bind) {
                    if (key != selector.display) {
                        var id = $scope.data[key][index];
                    }
                }
                //不同对话框选择的数据进行展示个体弹框，这个将来可以拓展到 各自对话框的自身来实现

            }

            //更新值到父容器
            $scope.updScope = function () {
                for (var key in bind) {
                    var dataStr = $scope.data[key] ? $scope.data[key].join(",") : "";//以逗号分隔数据
                    var tmp = '$scope.$parent.' + bind[key] + '="' + dataStr + '"';
                    eval(tmp);
                }
                $scope.render();
                !$rootScope.$$phase && $rootScope.$digest();
            }

            //选择完成
            $scope.dialogOk = function (returnData) {
                var maxWidth = $(element).width() - 40;
                //将选择的值更新到data{[],[],}中
                //先初始化防止报空
                if (!returnData) returnData = [];
                $scope.data = {};
                for (var key in bind) $scope.data[key] = [];

                for (var i = 0, object; object = returnData[i++];) {
                    for (var key in bind) {
                        $scope.data[key].push(object[key])
                    }
                }


                $scope.updScope();
                $(element).find('span.textSpan').css('max-width', maxWidth);
            };
            //这个只用于手机web端显示
            if (window.FORM_TYPE_ == 'mobile') {
                $scope.selectorTitle = $(element).attr("placeholder");
            }
            //初始化数据
            $scope.initData();
            //显示数据。
            $scope.render();
        }
    }
}])

/*
 * 上传指令。
 * 使用方法:
 * 	<input ht-upload="data.main.name" permission='w' />
 * 	ht-input对应的属性值为scope对应的数据值路径。
 * 	permission:
 * 		取值有两种：
 * 			r:只读
 *  		w:可输入
 */
    .directive('htUpload', ["$rootScope", function ($rootScope) {
        return {
            restrict: 'A',
            template: getDirectiveTplHtml('htUpload'),
            scope: {
                htUpload: "="
            },
            link: function (scope, element, attrs, ctrl) {
                element.removeClass();
                scope.permission = getPermission(attrs.permission, scope);
                var max = (attrs.issingle && eval(attrs.issingle)) ? 1 : 20;
                var size = (attrs.issizelimit == 'true' && attrs.size && eval(attrs.size)) ? attrs.size : 0;
                var formatLimit = (attrs.isformatlimit == 'true' && attrs.formatlimit) ? attrs.formatlimit : false;

                var jsonStr = scope.htUpload ? scope.htUpload.replace(/￥@@￥/g, "\"") : "[]";
                scope.files = eval("(" + jsonStr + ")");

                scope.dialogOk = function (data) {
                	scope.files = data;
                	var maxWidth = $(element).width() - 20;
                    if(scope.htUpload && scope.htUpload.startWith("[")){
                    	var newFiles = JSON.parse(scope.htUpload).concat(data);
                    	scope.htUpload = JSON.stringify(newFiles);
                    }else{
                    	scope.htUpload = JSON.stringify(data);
                    }
                    !$rootScope.$$phase && $rootScope.$digest();
                    $(element).find('a.button.btn-sm').css('max-width', maxWidth);
                }

                scope.concat = function (a, b) {
                    try {
                        if (!a) {
                            a = [];
                        }
                        a = eval(a);
                        var alen = a.length;
                        var blen = b.length;
                        for (var i = 0; i < blen; i++) {
                            a[alen + i] = b[i];
                        }
                    } catch (e) {
                        a = b;
                    }
                    return JSON.stringify(a);
                }

                scope.showDialog = function () {
                    if (formatLimit) {
                        formatLimit = formatLimit.replace(/\|/g, ',');
                    }
                    var conf = {callback: scope.dialogOk, max: max, size: size, type: formatLimit};
                    UploadDialog(conf);
                }
                
                scope.onClick = function (id) {
                    window.location.href = getContext().portal + "/system/file/v1/downloadFile?fileId=" + id;
                }

                scope.$watch('htUpload', function (newValue, oldValue) {
                    if (newValue == oldValue) return;

                    if (!newValue) scope.files = [];
                    else scope.files = eval("(" + newValue + ")");

                    !$rootScope.$$phase && $rootScope.$digest();
                });
                scope.remove = function (index, event) {
                    scope.files.splice(index, 1);
                    //更新字段值
                    if (!scope.files || scope.files.length == 0) scope.htUpload = "";
                    else scope.htUpload = JSON.stringify(scope.files);
                    event.stopPropagation();
                };
            }
        }
    }])
    /*
 * 功能输入框指令。
 * 使用方法:
 * <div >
 * 	<input ht-input="data.main.name" permission='w' />
 * </div>
 * 	ht-input对应的属性值为scope对应的数据值路径。
 * 	permission:
 * 		取值有两种：
 * 			r:只读
 *  		w:可输入
 */
    .directive('htInput', function () {
        return {
            restrict: 'AE',
            priority: 1003,
            link: function (scope, element, attrs, ctrl) {
                var permission = getPermission(attrs.permission, scope);

                if (permission == 'r') {
                    try {
                        element.after(eval("scope." + attrs.ngModel));
                    } catch (e) {
                    }
                    element.remove();
                }
                if (permission == 'n') {
                    $(element).remove();
                }

            }
        }
    })
    /*
 * 多行文本框指令。
 * 使用方法:
 * 	<textarea ht-textarea="data.main.name" permission='w' />
 * 	ht-textarea 对应的属性值为scope对应的数据值路径。
 * 	permission:
 * 		取值有两种：
 * 			r:只读
 *  		w:可输入
 */
    .directive('htTextarea', function () {
        return {
            restrict: 'AE',
            scope: {
                htTextarea: "=",
                placeholder: '@'
            },
            link: function (scope, element, attrs, ctrl) {
                var permission = getPermission(attrs.permission, scope);

                if (permission == 'r') {
                    $(element).hide();
                    element.after(scope.htTextarea);
                }
                else if (permission == 'n') {
                    $(element).remove();
                }
            }
        }
    })
    /**
     * 表单使用 htCheckboxs：
     *
     * 属性说明：
     * ht-checkboxs:对应scope中的数据。
     * permission：权限 r,w
     * values:选项数据为一个json
     * 使用示例:
     * <div ht-checkboxs="data.users" permission="w" defualtvalue="">
     *   <lable><input type="checkbox" value="1"/>红</lable>
     * </div>
     */
    .directive('htCheckboxs', ['commonService', '$rootScope', function (commonService, $rootScope) {
        /*checkBox 选中事件**/
        handChange__ = function (event) {
            var scope = event.data.scope;
            var aryChecked = event.data.aryChecked;
            var isArray = event.data.isArray;
            commonService.operatorAry(this.value, this.checked, aryChecked);
            scope.htCheckboxs = isArray ? aryChecked : aryChecked.join(",");
            $rootScope.$digest();
        }

        return {
            restrict: 'A',
            scope: {
                htCheckboxs: "="
            },

            link: function (scope, element, attrs) {

                /*权限 begin */
                var permission = getPermission(attrs.permission, scope);
                if (permission == 'n') {
                    element.remove();
                    return;
                }
                if (permission == 'r') {
                    if (scope.htCheckboxs) {
                        var values = scope.htCheckboxs.split(",");
                        var text = "";
                        for (var i = 0, val; val = values[i++];) {
                            if (!val) continue;
                            var checkBox = $("input[value='" + val + "']", element);
                            if (checkBox.length > 0) {
                                text = text + checkBox.parent().text();
                                if (i != values.length) text = text + ",";
                            }
                        }
                        element.after(text);
                    }
                    $(element).hide();
                    return;
                }
                /*权限 end */

                var name = attrs.htCheckboxs;
                //选中的值
                var aryChecked = [];
                var isArray = true;

                var val = scope.htCheckboxs || "";
                if (typeof val == "string") {
                    //初始化
                    if (val != "") {
                        aryChecked = val.split(",");
                    }
                    isArray = false;
                }
                var chkObjs = $("input", element);
                //遍历相同名称的checkbox，初始化选中和绑定change事件。
                for (var i = 0; i < chkObjs.length; i++) {
                    var obj = $(chkObjs[i]);
                    commonService.isChecked(obj.val(), aryChecked) && obj.attr("checked", true);
                    obj.bind("change", {scope: scope, isArray: isArray, aryChecked: aryChecked}, handChange__)
                }
            }
        }
    }])

    /**
     * 下拉选择框。
     * 属性说明：
     *    ht-select：指令 属性值为scope的数据路径。
     *  permission：权限，值为r,w
     *  options:可选值
     * <select ht-select="data.main.hobbys" permission="w" ng-model=""></select>
     */
    .directive('htSelect', ['commonService', function (commonService) {
        return {
            restrict: 'AE',
            require: "ngModel",
            scope: {
                htSelect: "="
            },
            link: function (scope, element, attrs, ctrl) {
                var permission = getPermission(attrs.permission, scope);
                var aryOptions = eval(attrs.options);
                var isMultiple = attrs.multiple != undefined;
                var filedname = attrs.filedname;

                if (permission == 'n') {
                    $(element).hide();
                } else if (permission == 'r') {
                    var value = scope.htSelect;
                    if (!value) {
                        $(element).hide();
                        return;
                    }

                    if (isMultiple) {
                        value = value.split(",");
                    } else {
                        value = new Array(value + "");
                    }

                    var text = [];
                    for (var int = 0, val; val = value[int++];) {
                        text.push($("option[value='" + val + "']", element).text());
                    }
                    if (isMultiple && window.FORM_TYPE_ == 'mobile') {
                        element.parent().after(text.join(",")).hide();
                        $("#" + filedname).hide();
                    } else {
                        element.after(text.join(",")).hide();
                    }
                } else {

                    if (window.FORM_TYPE_ != 'mobile') {//pc端
                    	
            			scope.$watch("htSelect",function(newValue,OldValue){
            				
            				$.isFunction($.fn.select2) && $(element).select2({
                				language: "zh-CN", 
                				placeholder: isMultiple?"请选择...":null,
                				initSelection: function(element, callback) {
                	                    var data = [];
                	                    var value = scope.htSelect;
                	                    if(value){
                	                    	//防止当value只有一个值且为数字时 split函数报错
                	                    	if(!isNaN(value)) value = value.toString();
                	                    	var arr = value.split(",");
                	                    	for(var idx=0;idx<arr.length;idx++){
                	                    		var text = $(element).find("[value="+arr[idx]+"]").text();
                	                    		data.push({id:arr[idx],text:text});
                	                    	}
                	                    	callback(data);
                	                    }else{
                	                    	callback([{id:'',text:'请选择'}]);
                	                    }
                	            }});
            				
            			})
            			
            			
                    } else {//手机端
                        var selectedStr = ""
                        var selectedVal = scope.htSelect;
                        if (selectedVal) {
                            var arr = selectedVal.split(",");
                            var len = 0;
                            for (var idx = 0; idx < arr.length; idx++) {
                                len++;
                                var text = $(element).find("[value=" + arr[idx] + "]").text();
                                $(element).find("[value=" + arr[idx] + "]").attr("selected", "selected");
                                if (len == arr.length) {
                                    selectedStr += text;
                                } else {
                                    selectedStr += text + ",";
                                }
                            }
                            $("#" + filedname).val(selectedStr);
                        }

                        $(element).mobiscroll().select({
                            theme: 'ios',
                            lang: 'zh',
                            display: 'bottom',
                            minWidth: 200,
                            group: true,
                            //点击确定是把获取的值赋值给自己书写的input标签
                            onSet: function (obj, inst) {
                                $('#' + filedname).val(obj.valueText);
                            }
                        });
                        //点击input 触发select组件
                        $("#" + filedname).click(function () {
                            $(element).mobiscroll('show');
                            return false;
                        });
                    }

                }

                if (!isMultiple) return;
                ctrl.$formatters.push(function (value) {
                    if (value) {
                        return value.split(",");
                    }
                    return []
                });
                ctrl.$parsers.push(function (value) {
                    if (value && value.length > 0) {
                        return value.join(",");
                    }
                    return "";
                });
            }

        }
    }])

    //
    /**
     * 自定义查询 联动下拉框。
     * {'alias':'searchUser','valueBind':'userId','labelBind':'account','bind':{'account_':'data.spxsxxb.spmc'}}
     * <ht-select-query="{上面的json}" options={}>
     */
    .directive('htSelectQuery', ['baseService', function (baseService) {
        return {
            restrict: 'AE',
            require: "ngModel",
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attrs, ctrl) {
                var permission = getPermission(attrs.permission, scope);
                var isMultiple = attrs.multiple != undefined;
                if (permission == 'n') {
                    $(element).hide();
                }

                var htSelectQuery = eval("(" + attrs.htSelectQuery + ")");
                scope.labelKey = htSelectQuery.labelBind;
                scope.valueKey = htSelectQuery.valueBind;
                scope.option = [];
                // 初始化param
                var param = {};
                for (key in htSelectQuery.bind) {
                    param[key] = eval("scope.$parent." + htSelectQuery.bind[key]);
                }

                //联动查询参数绑定
                function watchParam() {
                    if (!htSelectQuery.bind) return;
                    for (key in htSelectQuery.bind) {
                        scope.$parent.$watch(htSelectQuery.bind[key],
                            function (newValue, oldValue, scope) {
                                if (newValue != oldValue) {
                                    loadOptions(this.exp, newValue);
                                }
                            }
                        )
                    }
                }

                function loadOptions(exp, value) {
                    if (exp)
                        for (key in htSelectQuery.bind) {
                            if (htSelectQuery.bind[key] == exp) {
                                param[key] = value;
                            }
                        }
                    var queryParam = {alias: htSelectQuery.alias};
                    queryParam.querydata = param;
                    DoQuery(queryParam, function (data) {
                        scope.$apply(function () {
                            scope.options = [];
                            //级联设置初始化加载，如果设置了传参但未传参时不加载选项
                            try {
                                for (var pa in param) {
                                    if (!param[pa]) {
                                        return;
                                    }
                                }
                            } catch (e) {
                            }
                            $.each(data, function (i, item) {
                                var option = {};
                                option.val = item[scope.valueKey];
                                option.text = item[scope.labelKey];
                                scope.options.push(option);
                            })
                        })
                        scope.handleReadPermission();
                    });
                }

                loadOptions();
                watchParam();

                scope.isSelect = function (value) {
                    if (!ctrl.$modelValue) return false;
                    if (!isMultiple) return ctrl.$modelValue == value;
                    else return ctrl.$modelValue.indexOf(value) != -1;

                }
                scope.handleReadPermission = function () {
                    //只读处理
                    if (permission == 'r') {
                        var value = scope.ngModel;
                        if (!value) {
                            $(element).hide();
                            return;
                        }

                        if (isMultiple) value = value.split(",");
                        else value = new Array(value + "");

                        var text = [];
                        for (var int = 0, val; val = value[int++];) {
                            text.push($("option[value='" + val + "']", element).text());
                        }
                        element.after(text.join("，")).hide();
                        return;
                    }
                }

                //多选处理
                if (!isMultiple) return;
                ctrl.$formatters.push(function (value) {
                    if (value) return value.split(",")
                    return []
                });
                ctrl.$parsers.push(function (value) {
                    if (value && value.length > 0) return value.join(",")
                    return "";
                });
            },
            template: "<option value=''>请选择</option><option ng-repeat='option in options' value='{{option.val}}' ng-selected='isSelect(option.val)'>{{option.text}}</option>"

        }
    }])


    /**
     * 功能说明：
     *  单选按钮指令
     *    ht-radios：指令名称，值为数据路径
     *  permission：权限 w,可写,r只读。
     *  values：单选框对应的值
     * <div ht-radios="data.color" permission="w">
     *        <label class="radio-inline">
     *            <input type="radio" value="1" ng-model="">啊
     *        </label>
     * </div>
     * <div
     */
    .directive('htRadios', ['commonService', function (commonService) {
        return {
            restrict: 'A',
            scope: {
                htRadios: '='
            },
            link: function (scope, element, attrs) {
                var permission = getPermission(attrs.permission, scope);

                if (permission == 'n') {
                    element.remove();
                }
                else if (permission == 'r') {
                    var val = scope.htRadios;
                    if (val) {
                        var radio = $("input[value='" + val + "']", element);
                        radio && element.html(radio.parent().text());
                    }
                    else $(element).hide();
                }
            }
        }
    }])
    /**
     *  日期控件 ht-date
     * <input ht-date permission="w"  mobiscroll-date />
     *
     * mobiscroll-time: 时间选择
     * mobiscroll-datetime: 日期时间
     * mobiscroll-date: 日期
     * **/
    .directive('htDate', function () {
        return {
            restrict: 'A',
            require: "ngModel",
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attrs, inputCtrl) {
                var format = attrs.htDate || "yyyy-MM-dd";
                format = format.replace("HH", "hh");
                var showCurrentDate = attrs.showCurrentDate || false;
                var mobiscrollDate = attrs.mobiscrolldate;
                attrs.$observe("htDate", function (newVal, oldVal) {
                    if (newVal) {
                        format = newVal;
                        format = format.replace("HH", "hh");
                        if (showCurrentDate && !inputCtrl.$modelValue.length) {
                            element.val(new Date().format(format));
                            scope.ngModel = element.val();
                        }
                    }
                });


                inputCtrl.$render = function () {
                    var v = inputCtrl.$modelValue;
                    if (v) {
                        if (/^\d{13}$/.test(v)) {
                            try {
                                var newDate = new Date();
                                newDate.setTime(v);
                                element.val(newDate.format(format));
                            } catch (e) {
                            }
                        }
                        else {
                            element.val(v);
                        }
                    }
                    else {
                        element.val("");
                    }
                };
                var permission = getPermission(attrs.permission, scope);
                if (permission == "w" || permission == "b") {
                    //pc情况
                    if (window.FORM_TYPE_ != 'mobile') {
                        element.addClass("dateformat");
                        return;
                    } else {
                        var now = new Date();
                        // opt基本参数信息
                        var opt = {
                            theme: "android-holo-light",
                            lang: "zh",
                            cssClass: 'dateTest',
                            buttons: ['set', {
                                text: '清空',
                                handler: 'clear'
                            }, 'cancel'],
                            cancelText: "取消",
                            endYear: new Date(now.getFullYear() + 100)
                        };

                        if (mobiscrollDate == "date") {
                            now = now.Format("yyyy-MM-dd");
                            $(element).mobiscroll().date(opt);
                        } else if (mobiscrollDate == "datetime") {
                            now = now.Format("yyyy-MM-dd hh:mm:ss");
                            $(element).mobiscroll().datetime(opt);
                        } else {
                            now = now.Format("hh:mm:ss");
                            $(element).mobiscroll().time(opt);
                        }

                        if (showCurrentDate) {
                            $(element).val(now);
                            $(element).attr("value", now);
                            scope.ngModel = now;
                        }
                    }
                    //view to model
                    inputCtrl.$parsers.push(function (value) {
                        //数据为时间时进行处理。
                        if (value && value instanceof Date) {
                            if (attrs.mobiscrollDatetime) {//不知道为什么最初设计要将秒置为00，这样导致日期计算时不能拿到秒进行计算
                                value = value.Format("yyyy-MM-dd hh:mm:ss");
                                return value;
                            }
                            else if (attrs.mobiscrollDate) {
                                value = value.Format("yyyy-MM-dd");
                                return value;
                            }
                            else if (attrs.mobiscrollTime) {
                                value = value.Format("hh:mm:ss");
                                return value;
                            }
                        }
                        return value;
                    });
                    return;
                }
                if (permission == "r") {
                    element.after(formatDate());
                }
                $(element).hide();

                function formatDate() {
                    if (/^\d{13}$/.test(scope.ngModel)) {
                        var newDate = new Date();
                        newDate.setTime(scope.ngModel);
                        scope.ngModel = newDate.format(format);
                    }
                    if (showCurrentDate && !scope.ngModel) {
                        element.val(new Date().format(format));
                        scope.ngModel = element.val();
                        inputCtrl.$modelValue = scope.ngModel;
                    }
                    return scope.ngModel;
                }
            }
        };
    })
    /**
     * 数据字典指令。
     * dictype：数据字典别名。
     */
    .directive('htDic', ['$rootScope','baseService', function ($rootScope,baseService) {
        return {
            restrict: 'AE',
            scope: {
                htDic: '='
            },
            template: getDirectiveTplHtml("htDic"),
            link: function (scope, element, attrs) {
                element.removeClass();
                scope.permission = getPermission(attrs.permission, scope);
                var dicKey = attrs.dickey; //数据字典的类型
                var bind = attrs.bind;
                
                var url = attrs.url || getContext().portal+"/sys/dataDict/v1/getMoibleComBoByTypeKey?typeKey=" + dicKey;
               
                var keyName = attrs.keyName || "key";
                var valName = attrs.valName || "text";

                scope.treeId = parseInt(Math.random() * 1000)
                scope.dicData = {};
                
                scope.dicClean = function () {
                    scope.dicData.value = "";
                    scope.htDic = "";
                    showDicValue();
                    var treeObj = $.fn.zTree.getZTreeObj(scope.treeId);
                    treeObj.cancelSelectedNode();
                }
                scope.callBack = function (data) {
                    scope.dicData.key = data[0].id;
                    scope.dicData.value = data[0].name;
                    showDicValue();
                    !$rootScope.$$phase && $rootScope.$digest();
                }
                scope.showDialog = function () {
                	var index = layer.load();
                	baseService.get(url).then(function(data){
                		if(data.dictType){
                			var conf = {url: url, callBack: scope.callBack,dictType:data.dictType,dataDictList:data.dataDictList};
                			if(data.dictType.struType == 0){
                				conf.html = "dicListSelectorDialog.html";
                			}else{
                				conf.html = "dicTreeSelectorDialog.html";
                			}
                			HtDicDialog(conf)
                		}
                		layer.close(index);
                	},function(status){
                		layer.close(index);
                		layer.msg("获取数据字典失败:错误代码:"+status,{time:2000});
                	})
                }
                
                function showDicValue(){
                	if (bind) {
                        var tmp = 'scope.$parent.$parent.' + bind + '="' + scope.dicData.value + '"';
                        eval(tmp);
                    }
                }
                if(scope.htDic){
                	scope.dicData.value=scope.htDic;
                	showDicValue();
                }
            }
        };
    }])

    /**
     * 富文本框指令：
     * <span ht-editor="{}" height="" width="" ng-model="content"></span>
     * ng-model
     * editorConfig{hieght}
     */
    .directive('htEditor', function () {
        return {
            restrict: 'AE',
            replace: true,
            require: '?ngModel',
            scope: {},
            link: function (scope, element, attrs, ngModel) {
                var permission = getPermission(attrs.permission, scope);
                if (permission == 'r') {
                    return;
                }
                if (permission == 'n') {
                    return;
                }
                element.removeClass("form-control");
                var defaultConf = {
                    focus: true,
                    toolbars: [['source', 'undo', 'redo', 'bold', 'italic', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'picture']],
                    initialFrameHeight: 150, initialFrameWidth: 600
                };
                //根据富文本编辑框设置的宽度、高度设置editor编辑框的宽高
                var htEditor = eval("(" + attrs.htEditor + ")");
                defaultConf.initialFrameHeight = htEditor.initialFrameHeight;
                defaultConf.initialFrameWidth = htEditor.initialFrameWidth;

                var editorConfig = angular.fromJson(attrs.htEditor);
                editorConfig = $.extend(editorConfig, defaultConf);
                var editor = new UE.ui.Editor(editorConfig);
                editor.render(element[0]);
                if (ngModel) {
                    // Model数据更新时，更新百度UEditor
                    ngModel.$render = function () {
                        try {
                            editor.setContent(ngModel.$viewValue);
                        } catch (e) {
                        }
                    };
                    // 设置内容。
                    editor.ready(function () {
                        editor.setContent(ngModel.$viewValue);
                    });
                    // 百度UEditor数据更新时，更新Model
                    editor.addListener('contentChange', function () {
                        setTimeout(function () {
                            scope.$apply(function () {
                                var content = editor.getContent();
                                if (attrs.htEditor == "getContentTxt") {
                                    // 获取文本， 不带html格式的
                                    content = editor.getContentTxt();
                                }
                                ngModel.$setViewValue(content);
                            })
                        }, 0);
                    });
                }

            }
        }
    })


    /**
     * 校验入口.  {require:true,dateRangeEnd:{targetVal:scope.data.sss}}  //不能大于结束日期
     * 校验指令，指定必须有ngModel属性。
     */
    .directive('htValidate', [function () {
        return {
            require: "ngModel",
            priority: 1001,
            link: function (scope, element, attr, ctrl) {
                var validate = attr.htValidate;
                if (!validate) return;
                //修正验证的bug。
                validate = validate.replace(/'/g, "\"");

                var permission = getPermission(attr.permission, scope);
                //如果不必填且没有其他校验返回 或者只读的权限不校验
                if (permission == "r" || (permission !== "b" && validate == "{}")) return;
                var validateJson = eval('(' + validate + ')');

                if (permission == "b") validateJson.required = true;

                var customValidator = function (value) {

                    if (!validate) return true;

                    if (scope.custForm && scope.custForm.$error && scope.custForm.$error.customValidate) {
                        var len = scope.custForm.$error.customValidate.length;
                        for (var i = len; i > 0;) {
                            var temp = scope.custForm.$error.customValidate[--i];
                            if (temp.modelKey == attr.ngModel) {
                                scope.custForm.$error.customValidate.splice(i, 1);
                            }
                        }
                    }

                    handlTargetValue(validateJson);
                    var validity = $.fn.validRules(value, validateJson, element, ctrl.$dirty);
                    ctrl.modelKey = attr.ngModel;
                    //ctrl.$error = validity.errMsg
                    ctrl.$setValidity("customValidate", validity._valid);
                    return validity ? value : undefined;
                };

                ctrl.$formatters.push(customValidator);
                ctrl.$parsers.push(customValidator);


                //获取比较目标字段的值。   所有比较的都包含target对象eg:{rule:{target:data.mian.name}}
                var handlTargetValue = function (validateJson) {
                    for (key in validateJson) {
                        if (validateJson[key].target) {
                            validateJson[key].targetVal = eval("scope." + validateJson[key].target);
                        }
                    }
                }

            }
        };
    }])
    /**
     * 格式化数字 ht-number
     * {'coinValue':'￥','isShowComdify':1,'decimalValue':2}
     *
     */
    .directive('htNumber', ['formService', function (formService) {
        return {
            require: "ngModel",
            priority: 1002,
            link: function (scope, element, attr, inputCtrl) {
                var permission = getPermission(attr.permission, scope);
                var formater = attr.htNumber;
                if (!formater) return;

                var formaterJson = eval('(' + formater + ')');
                var input = element;
                if (permission == "n") {
                    element.remove();
                    return;
                } else if (permission == "r") {
                    var val = eval("scope." + attr.ngModel)
                    if (!val) {
                        $(element).hide();
                        return;
                    }
                    element.before(formService.numberFormat(val, formaterJson) + " ");
                    setCapital(val);
                    element.remove();
                } else {
                    setTimeout(function () {
                        var val = eval("scope." + attr.ngModel);
                        if (val) {
                            $(element).val(formService.numberFormat(val, formaterJson));
                            setCapital(val);
                        }
                    }, 0);
                    $(element).on("blur", function () {
                        var val = eval("scope." + attr.ngModel);
                        if (val) {
                            $(this).val(formService.numberFormat(val, formaterJson));
                            setCapital(val);
                        }
                    });
                }

                function setCapital(val) {
                    if (!formaterJson.capital) return;
                    var capital = element.next("capital");
                    if (capital.length == 0) capital = $("<capital></capital>");
                    var val = val ? val : inputCtrl.$modelValue;

                    if (!val) return;

                    var text = formService.convertCurrency(val);

                    capital.text("(" + text + ")");
                    element.after(capital);
                }
            }
        };
    }])

    /**
     * 字段函数计算
     */
    .directive('htFuncexp', ['formService', function (formService) {
        var link = function ($scope, element, attrs, $ctrl) {
            var modelName = attrs.ngModel;
            var watchArr = [];
            var funcexp = attrs.htFuncexp,
                watchField = getWatchField(funcexp);

            function toWatch(f, subMsg) {
                //子表字段的监控
                var fieldName = subMsg[3];
                var subTableSrc = f.replace("." + fieldName, "");
                try {
                    formService.doMath($scope, modelName, funcexp);
                } catch (e) {

                }
                // 监控已存在的
                var length = eval("$scope." + subTableSrc + ".length || 0");
                for (var int = 0; int < length; int++) {
                    watch(subTableSrc + "[" + (int) + "]." + fieldName);
                }
                //监控新添加的
                var watched = $scope.$watch(subTableSrc + ".length", function (newValue, oldValue, scope) {
                    if (newValue > oldValue) {
                        watch(subTableSrc + "[" + (newValue - 1) + "]." + fieldName);
                    } else if (newValue < oldValue) {
                        watchArr.pop()();
                        formService.doMath($scope, modelName, funcexp);
                    }
                });
            }

            if (watchField.length > 0) {
                for (var i = 0, f; f = watchField[i++];) {
                    //子表字段的监控
                    var subMsg = f.split(".");
                    if (subMsg.length > 3) {
                        toWatch(f, subMsg);
                    } else {
                        //主表和子表单条运算
                        watch(f);
                    }
                }

            }

            // 监控
            function watch(path) {
                var watch = $scope.$watch(path, function (newValue, oldValue, scope) {
                    if (newValue != oldValue) {
                        formService.doMath(scope, modelName, funcexp);
                    }
                });
                watchArr.push(watch);
            }

            function getWatchField(statFun) {
                var myregexp = /\(([data.main|data.sub|item].*?)\)/g;
                var match = myregexp.exec(statFun);
                var arrs = [];
                while (match != null) {
                    var str = match[1];
                    var has = false;
                    for (var i = 0, v; v = arrs[i++];) {
                        if (v == str) has = true;
                    }
                    if (!has) arrs.push(str);
                    match = myregexp.exec(statFun);
                }
                return arrs;
            }
        };
        return {
            restrict: 'A',
            require: "ngModel",
            compile: function () {
                return link;
            }
        };
    }])
    /**
     *  计算日期间隔
     */
    .directive('htDatecalc', ['formService', '$filter', function (formService, $filter) {
        return {
            require: "ngModel",
            link: function ($scope, element, attr, ctrl) {
                if (!attr.htDatecalc) return;
                var ngModel = attr.ngModel;
                var dateCalc = eval('(' + attr.htDatecalc + ')');
                var startSrc = dateCalc.start;
                var endSrc = dateCalc.end;
                var diffType = dateCalc.diffType;
                if (startSrc.split(".").length > 2) { //子表的
                    startSrc = "item." + startSrc.split(".")[2];
                    endSrc = "item." + endSrc.split(".")[2];
                } else {
                    endSrc = "data." + endSrc;
                    startSrc = "data." + startSrc;
                }
                $scope.$watch(startSrc, function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        var endDate = eval("$scope." + endSrc);//scope.data.main.field , item.field
                        var int = formService.doDateCalc(newValue, endDate, diffType);
                        ctrl.$setViewValue(int);
                        ctrl.$render();
                    }
                });
                $scope.$watch(endSrc, function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        var start = eval("$scope." + startSrc);//scope.data.main.field , item.field
                        var int = formService.doDateCalc(start, newValue, diffType);
                        ctrl.$setViewValue(int);
                        ctrl.$render();
                    }
                });

            }
        };
    }])
/**
 * 自定义对话框 ht-custdialog
 */
formDirective.directive('htCustdialog', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'AE',
        scope: true,
        link: function ($scope, element, attrs) {
        	if (window.FORM_TYPE_ != 'mobile'){
        		$(element).css('height', 40).css('line-height', '26px').css('padding-left', 10).css('padding-right', 10);
        	}
           // $(element).prev().css('width', $(element).prev().width() - $(element).width() - 2);
            var permission = getPermission(attrs.permission, $scope);
            // 没有权限
            if (permission && permission != 'w' && permission != 'b') {
                $(element).hide();
                return;
            }
            var htCustDialog = attrs.htCustdialog;
            if (!htCustDialog) return;
            htCustDialog = htCustDialog.replace("{'name", "{\"name");
            $scope.confJson = eval("(" + htCustDialog + ")");

            //是否位于子表。位于子表的填充方式为当前行覆盖
            var isInSub = $scope.confJson.isInSub;//(element.parents("[type='subtable']").length >0);

            //绑定配置
            var dialogMappingConf = $scope.confJson.custDialog.mappingConf;
            var isCombine = $scope.confJson.custDialog.type == 'combiDialog';
            //对话框初始化监听
            $(element).click(function () {
                $scope.showDialog();
            });

            /**展示对话框*/
            $scope.showDialog = function () {
                var param = $scope.getQueryParam($scope.confJson.custDialog.conditions);
                var initData = $scope.initData();
                var conf = {param: param, initData: initData};//initData
                if (isCombine) {
                    var conf = {alias: $scope.confJson.custDialog.alias, callBack: $scope.dialogOk};
                    CombinateDialog.open(conf);
                    return;
                }
                if (window.FORM_TYPE_ != 'mobile') {//PC
                    CustomDialog.openCustomDialog($scope.confJson.custDialog.alias, $scope.dialogOk, conf);
                } else {//手机端
                    conf.isCombine = isCombine;
                    conf.alias = $scope.confJson.custDialog.alias;
                    conf.callBack = $scope.dialogOk;
                    CustomDialog.openCustomDialog(conf);
                }
            }

            $scope.dialogOk = function (returnData, dialog) {
                if (dialog) dialog.dialog('close');
                $scope.pushDataToForm(returnData, dialogMappingConf);
                $rootScope.$broadcast("customdialog:ok", {alias: $scope.confJson.custDialog.alias, data: returnData});
            }

            $scope.custQueryOk = function (returnData, mappingConf) {
                $scope.pushDataToForm(returnData, mappingConf);
            }
            //自定义查询，自定义对话框
            $scope.initCustQuery = function () {
                if ($scope.confJson.custQueryList.length == 0) return;

                for (var i = 0, custQuery; custQuery = $scope.confJson.custQueryList[i++];) {
                    if (custQuery.type != 'aliasScript' && custQuery.type != 'custQuery') continue;
                    //通过触发字段进行初始化
                    var gangedTarget = custQuery.gangedTarget;
                    //不联动
                    if (!custQuery.ganged) continue;
                    // 回车联动
                    if (custQuery.ganged == 'inter') {
                        if (!isInSub) {
                            var target = $("[ng-model='data." + gangedTarget + "']");
                        } else {
                            var gangedArray = gangedTarget.split(".");
                            var target = $("[ng-model='" + gangedArray[gangedArray.length - 1] + "']", $(element).closest("tr"));
                        }

                        var autoQueryData = $(target).data("autoQueryData");
                        if (!autoQueryData) {
                            autoQueryData = [];
                            if (!$scope.autoQueryData) $scope.autoQueryData = {};
                            var gangedTargetStr = "data." + gangedTarget; //需要watch 的字符串
                            if (!$scope.autoQueryData[gangedTargetStr]) {
                                $scope.autoQueryData[gangedTargetStr] = [];
                                $scope.$watch(gangedTargetStr, function (newValue, oldValue) {
                                    if (newValue != oldValue) {//如果不为空则进行查询
                                        var bindCustQuerys = $(target).data("autoQueryData");
                                        $scope.removeBindQueryData(bindCustQuerys);
                                    }
                                });
                            }

                            $(target).bind("keydown", function (event) {
                                if (event.keyCode != 13) return;
                                var bindCustQuerys = $(this).data("autoQueryData");
                                for (var j = 0, q; q = bindCustQuerys[j++];) {
                                    $scope.executeQuery(q);
                                }
                            });
                        }
                        autoQueryData.push(custQuery);
                        $(target).data("autoQueryData", autoQueryData);
                    } else {

                        //值改变联动
                        if (!$scope.autoQueryData) $scope.autoQueryData = {};
                        //多个自定义查询绑定到同一个字段上，仅仅执行一次
                        var gangedTargetStr = "data." + gangedTarget; //需要watch 的字符串
                        if (!$scope.autoQueryData[gangedTargetStr]) {
                            $scope.autoQueryData[gangedTargetStr] = [];

                            $scope.$watch(gangedTargetStr, function (newValue, oldValue) {
                                if (newValue != oldValue && newValue) { //如果不为空则进行查询
                                    var queryList = $scope.autoQueryData[this.exp];
                                    for (var k = 0, q; q = queryList[k++];) {
                                        $scope.executeQuery(q);
                                    }
                                } else if (newValue != oldValue && !newValue) {//如果为空则清空上次查询的值
                                    var bindCustQuerys = $scope.autoQueryData[this.exp];
                                    $scope.removeBindQueryData(bindCustQuerys);
                                }
                            });
                        }
                        $scope.autoQueryData[gangedTargetStr].push(custQuery)

                    }

                }
            }

            /** 删除绑定选择的值后，清空该选择的值的查询结果 */
            $scope.removeBindQueryData = function (queryList) {
                for (var k = 0, q; q = queryList[k++];) {
                    var hasSub = false, subDatas = {};
                    // 循环所有mapping，将返回值，插入指定字段
                    var mappingConf = q.mappingConf;
                    for (var int = 0, mapping; mapping = mappingConf[int++];) {
                        if (!mapping.from) continue;
                        var value = "";
                        var targets = mapping.target;
                        // 返回值单个字段可以映射表单多个字段
                        for (var j = 0, target; target = targets[j++];) {
                            /**target格式 主表 【表明.字段名】子表 【主表明.子表名.字段名】 **/
                                //target =target.toLowerCase();
                            var targetArray = target.split(".");
                            //如果是主表【表明.字段名】
                            if (targetArray.length == 2) {
                                if (typeof(mainDatas) != 'undefined') {
                                    if (!mainDatas[target]) {
                                        mainDatas[target] = value;
                                    } else {
                                        mainDatas[target] += "," + value;
                                    }
                                } else {
                                    //清空主表联动字段的关联值
                                    $scope.data[targetArray[0]][targetArray[1]] = "";
                                }
                            }
                            //如果是位于子表
                            else if (isInSub) {
                                $scope.item[targetArray[2]] = value;
                            }
                            //位于主表填充子表，添加行的形式
                            else {
                                hasSub = true;
                                if (!subDatas[targetArray[1]]) subDatas[targetArray[1]] = {};
                                subDatas[targetArray[1]][targetArray[2]] = value;
                                subDatas[targetArray[1]].mian_table_name_ = targetArray[0];
                            }
                        }
                    }
                    // 如果有子表
                    if (hasSub) {
                        for (tableName in subDatas) {
                            var data = $.extend({}, subDatas[tableName]);
                            var mainTableName = data.mian_table_name_;
                            delete data.mian_table_name_;
                            //清空上一次选择的数据
                            if ($scope.data[mainTableName]["sub_" + tableName].temp) {
                                var temp = $scope.data[mainTableName]["sub_" + tableName].temp;
                                try {
                                    $scope.data[mainTableName]["sub_" + tableName].remove(temp);
                                } catch (e) {
                                    $scope.data[mainTableName]["sub_" + tableName].splice(temp);
                                }

                                $scope.data[mainTableName]["sub_" + tableName].temp = {};
                            }
                        }
                    }
                    !$rootScope.$$phase && $rootScope.$digest();
                }
            }


            /** 执行别名脚本查询，自定义查询*/
            $scope.executeQuery = function (custQuery) {
                var param = {alias: custQuery.alias};
                param.querydata = $scope.getQueryParam(custQuery.conditions);
                //为空时不查询
                if (JSON.stringify(param.querydata) == "{}") {
                    return;
                }

                if (custQuery.type == 'custQuery') {
                    DoQuery(param, function (data) {
                        if (data && data.length > 0) {
                            $scope.pushDataToForm(data, custQuery.mappingConf);
                        } else {
                            var list = [];
                            list.push(custQuery);
                            $scope.removeBindQueryData(list);
                        }
                    })
                }
                else if (custQuery.type == 'aliasScript') {
                    var data = RunAliasScript(param)
                    $scope.pushDataToForm(data, custQuery.mappingConf);
                }
            }

            //通过参数条件配置获取参数 条件
            $scope.getQueryParam = function (conditions) {
                var param = {};
                for (var i = 0, condition; condition = conditions[i++];) {
                    var value = condition.defaultValue
                    if (condition.isScript) {
                        value = eval(value + "()");
                    }
                    if (condition.bind && !condition.isScript && !condition.defaultValue) {
                        value = eval("$scope.data." + condition.bind) || value;
                    }
                    if (value) param[condition.field] = value;
                }
                return param;
            }
            window.setTimeout($scope.initCustQuery, 10);//有时候trigger目标字段还没出现。

            //填充数据到数据库
            $scope.pushDataToForm = function (returnData, mappingConf) {
                //将选择的值更新到data{[],[],}中
                //先初始化防止报空
                if (!returnData) returnData = [];
                if (!$.isArray(returnData)) {
                    returnData = new Array(returnData);
                }
                var mainDatas = {}, fag = true;
                var isNew = true;
                // 循环所有的返回值
                for (var i = 0; i < returnData.length || fag; i++) {
                    fag = false;
                    var hasSub = false, subDatas = {};
                    // 循环所有mapping，将返回值，插入指定字段
                    for (var int = 0, mapping; mapping = mappingConf[int++];) {
                        if (!mapping.from) continue;
                        var value = "";
                        if (returnData.length != 0) {
                            value = returnData[i][mapping.from] || returnData[i][mapping.from.toLowerCase()];
                        }
                        var targets = mapping.target;
                        // 返回值单个字段可以映射表单多个字段
                        for (var j = 0, target; target = targets[j++];) {
                            /**target格式 主表 【表明.字段名】子表 【主表明.子表名.字段名】 **/
                                //target =target.toLowerCase();
                            var targetArray = target.split(".");
                            //如果是主表【表明.字段名】
                            if (targetArray.length == 2) {
                                if (!mainDatas[target]) {
                                    mainDatas[target] = value;
                                } else {
                                    mainDatas[target] += "," + value;
                                }
//								$scope.data[targetArray[0]][targetArray[1]]=value;
                            }
                            //如果是位于子表
                            else if (isInSub) {
                                $scope.item[targetArray[2]] = value;
                            }
                            //位于主表填充子表，添加行的形式
                            else {
                                hasSub = true;
                                if (!subDatas[targetArray[1]]) subDatas[targetArray[1]] = {};
                                subDatas[targetArray[1]][targetArray[2]] = value;
                                subDatas[targetArray[1]].mian_table_name_ = targetArray[0];
                            }

                        }
                    }
                    // 如果有子表
                    if (hasSub) {
                        for (tableName in subDatas) {
                            //var tempData =$.extend({},$scope.dataInit[mianTableName][tableName].row);
                            var data = $.extend({}, subDatas[tableName]);
                            var mainTableName = data.mian_table_name_;
                            delete data.mian_table_name_;

                            //清空上一次选择的数据
                            var temp = $scope.data[mainTableName]["sub_" + tableName].temp;
                            if (temp && isNew) {
                                try {
                                    $scope.data[mainTableName]["sub_" + tableName].remove(temp);
                                } catch (e) {
                                    $scope.data[mainTableName]["sub_" + tableName].splice(temp);
                                }
                            }
                            isNew = false;
                            $scope.data[mainTableName]["sub_" + tableName].push(data);

                            //记录本次选择的数据方便下次改变时清除原来的
                            $scope.data[mainTableName]["sub_" + tableName].temp = data;
                        }
                    }
                }
                angular.forEach(mainDatas, function (value, key) {
                    var keyArr = key.split(".");
                    $scope.data[keyArr[0]][keyArr[1]] = value;
                });
                !$rootScope.$$phase && $rootScope.$digest();
            }

            $scope.initData = function () {
                var initData = [], tmp = {}, bind = [];
                angular.forEach(dialogMappingConf, function (obj, idx) {
                    var target = obj.target[0], keyArr = target.split("."), selectStr = "", selectArr = [];
                    if (keyArr.length == 2) {
                        selectStr = $scope.data[keyArr[0]][keyArr[1]];
                    } else {
                        // 子表数据回显暂时不处理
                        return initData;
                    }
                    selectArr = selectStr.split(",");
                    try {
                        for (var i = 0; i < selectArr.length && selectStr.length; i++) {
                            if (idx == 0) {
                                initData.push(parseToJson("{" + obj.from + ":\"" + selectArr[i] + "\"}"));
                            } else {
                                initData[i][obj.from] = selectArr[i];
                            }
                        }
                    } catch (e) {
                    }

                });
                return initData;
            }


        }
    }
}])
/**
 * 表单意见 ht-bpm-opinion
 */
    .directive('htBpmOpinion', [function () {
        return {
            restrict: "A",
            scope: {
                htBpmOpinion: "=",
                opinionHistory: "="
            },
            link: function (scope, element, attrs) {
             //   scope.style = attrs.style;
                var style = attrs.style;
                element.removeClass();
                element.removeAttr("style");
                scope.permission = 'w';
                try {
                    scope.permission = eval("scope.$parent." + attrs.permission);
                }
                catch (e) {
                }
                if (scope.permission == 'n') element.remove();
            },
            template: '<div>\
	            	<textarea taskopinion ng-model="htBpmOpinion" ht-validate="{required:{{permission==\'b\'}} }" ng-attr-style={{style}} ng-show="permission==\'w\'|| permission==\'b\'"></textarea>\
						<blockquote ng-repeat="opinion in opinionHistory" ng-if="opinionHistory.length>0">\
		                <div>\
							<span>{{opinion.taskName}}</span>&nbsp;<span>{{opinion.auditorName}}</span>&nbsp;<span class="label label-default"> {{opinion.status | taskstatus}} </span>&nbsp;{{opinion.createTime |date:"yyyy-MM-dd HH:mm:ss"}} &nbsp; \
			            </div>\
						<div style="padding-top:10px">{{opinion.opinion}}</div> \
			        	</blockquote>\
				  </div>',
            replace: true
        };
    }])

    /**
     * 表单中的流程图
     */
    .directive('htBpmFlowImage', ['bpm', function (bpm) {
        return {
            restrict: "EA",
            link: function (scope, element, attrs) {
                var url;
                if (!bpm.isInstance) {
                    url = __ctx + '/flow/task/taskImage?taskId=' + bpm.getTaskId();
                    if (bpm.isCreateInstance()) url = __ctx + '/bpm/bpmImage?defId=' + bpm.getDefId();
                } else {
                    url = __ctx + "/flow/instance/instanceFlowImage?id=" + bpm.getProInstId();
                }
                //如果在页面中
                if (attrs.htBpmFlowImage == "inHtml") {
                    element.html("<iframe src='" + url + "' style='width:100%;height:100%;border:0' frameborder='0'></iframe>");
                    return;
                }
                element.bind('click', function () {
                    var def = {
                        title: '流程图',
                        width: 950,
                        height: 600,
                        modal: true,
                        resizable: false,
                        iconCls: 'fa fa-table',
                        maximizable: true
                    };
                    $.topCall.dialog({src: url, base: def});
                });
            }
        };
    }])
    .directive('htBpmApprovalHistory', ['bpm', function (bpm) {
        return {
            restrict: "EA",
            link: function (scope, element, attrs) {
            	var urlParam = "instId=" + bpm.getProInstId();
                if (!bpm.isInstance) {
                    urlParam = "taskId=" + bpm.getTaskId();
                }
                if (attrs.htBpmApprovalHistory == "inHtml") {
                    if (bpm.isCreateInstance()) {
                        $(element).hide();
                        return;
                    }
                    element.html("<iframe src='" + __ctx + '/flow/instance/instanceFlowOpinions?' + urlParam + "' style='width:100%;height:100%;border:0' frameborder='0'></iframe>");
                    return;
                }

                element.bind('click', function () {
                    var def = {
                        title: '审批历史',
                        width: 950,
                        height: 500,
                        modal: true,
                        resizable: false,
                        iconCls: 'fa fa-table',
                        maximizable: true
                    };
                    //启动流程
                    if (bpm.isCreateInstance()) {
                        $.topCall.alert("流程未启动");
                    }
                    //完成任务
                    else {
                        $.topCall.dialog({
                            src: __ctx + '/flow/instance/instanceFlowOpinions?taskId=' + bpm.getTaskId(),
                            base: def
                        });
                    }
                });
            }
        };
    }])
    /**
     * 自动添加资源路径的上下文
     */
    .directive('htLink', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if ("A" == $(element).prop("tagName")) {
                    $(element).attr("href", __ctx + attrs.htLink)
                } else {
                    $(element).attr("src", __ctx + attrs.htLink)
                }
            }

        };
    })
    /**
     * 流水号处理
     */
    .directive('htIdentity', function ($injector) {
        return {
            restrict: 'A',
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attrs) {
                /*var url =__ctx + "/system/identity/getNextIdByAlias.ht";
			var htIdentity = parseToJson(attrs['htIdentity']);
			scope.$watch(scope.ngModel,  function(newValue, oldValue) {
        		if(newValue!=oldValue || !oldValue ){
        			initIdentity();
        		}else{
        			removeEle();
        		}
        	});

			function initIdentity(){
				if(htIdentity&&htIdentity.alias)
					$.post(url,{alias:htIdentity.alias},function(data){
						scope.ngModel = data;
						removeEle();
					})
			}

			function removeEle(){
				element.after("<span>" + eval("scope.ngModel")+"</span>");
				element.remove();
			}*/

            }
        };
    })


    /**
     *
     * 表单联动设置
     * ht-ganged：指令。
     */
    .directive('htGanged', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                if (attr.htGanged) {
                    var parentScope = scope.$parent;
                    parentScope.changeList = [];

                    //验证该联动中其他规则是否满足条件
                    function isOtherTrigger(chooseFields) {
                        var isTrigger = true;
                        for (var i = 0; i < chooseFields.length; i++) {
                            var curValue = eval("(scope.$parent.data." + chooseFields[i].pathName + ")");
                            if (curValue != chooseFields[i].value) {
                                isTrigger = false;
                            }
                        }
                        return isTrigger;
                    }

                    //必填联动
                    function changeRequired(elm, value) {
                        var validateJson = parseToJson(elm.attributes['ht-validate'].value);
                        validateJson['required'] = value;
                        elm.attributes['ht-validate'].value = JSON.stringify(validateJson);
                        $compile(elm)(scope);
                    }

                    //加入到变动列表
                    function addToChangeList(id, elm, field, isGroup, options) {
                        var change = new Object();
                        change.id = id;
                        change.elm = elm;
                        change.type = field.type;
                        change.ctrlType = field.ctrlType;
                        change.tableName = field.tableName;
                        if (!isGroup) {
                            var value = eval("(scope.$parent.data." + field.pathName + ")");
                            /*	 if(getIsSub(field.pathName,field.tableName)){
							 value = eval("(scope.item." +field.name +")");
						 }*/
                            change.value = value;
                        }
                        change.pathName = field.pathName;
                        change.name = field.name;
                        if (options) {
                            change.oldOptions = options;
                        }
                        scope.$parent.changeList.push(change);
                    }

                    //改变字段操作
                    function gangedChangeFields(changeFields, id) {
                        for (var i = 0; i < changeFields.length; i++) {
                            var changeField = changeFields[i];
                            var isSub = getIsSub(changeField.pathName, changeField.tableName);
                            var modelStr = isSub ? 'item.' + changeField.name : 'data.' + changeField.pathName;
                            var elm = $("[ng-model='" + modelStr + "']")[0];
                            if (isSub) {
                                var parentElm = getScopeElm(scope.$parent.$id);
                                if (parentElm) {
                                    elm = $(parentElm).find("[ng-model='" + modelStr + "']")[0];
                                }
                            }
                            var pathName = changeField.pathName;
                            var isGroup = false;
                            if (pathName.indexOf("separator.") == 0) {
                                isGroup = true;
                                var group = pathName.replace('separator.', '');
                                var elm = $("[ht-toggle][group='" + group + "']")[0];
                            }
                            if (changeField.type != '8') {
                                addToChangeList(id, elm, changeField, isGroup);
                            }
                            switch (changeField.type) {
                                case "1":
                                    isGroup ? gangedGroup(elm, false) : fieldShowOrHide(elm, false);
                                    break;
                                case "2":
                                    isGroup ? gangedGroup(elm, true) : fieldShowOrHide(elm, true);
                                    break;
                                case "3":
                                    readOnlyElem(true, changeField, elm);
                                    break;
                                case "4":
                                    readOnlyElem(false, changeField, elm);
                                    break;
                                case "5":
                                    changeRequired(elm, true);
                                    break;
                                case "6":
                                    changeRequired(elm, false);
                                    break;
                                case "7":
                                    var tmp = isSub ? 'scope.' + modelStr + '=""' : 'scope.$parent.data.' + changeField.pathName + '=""';
                                    eval(tmp);
                                    cleanElem(changeField, elm);
                                    break;
                                case "8":
                                    gangedCascade(id, changeField, 1, elm);
                                    break;
                            }
                        }
                    }

                    function readOnlyElem(isRead, field, elm) {
                        switch (field.ctrlType) {
                            case "radio":
                                isRead ? $(elm).find("input[type=radio]").attr("disabled", true) : $(elm).find("input[type=radio]").attr("disabled", false);
                                break;
                            case "checkbox":
                                isRead ? $(elm).find("input[type=checkbox]").attr("disabled", true) : $(elm).find("input[type=checkbox]").attr("disabled", false);
                                break;
                            case "selector":
                            case "fileupload":
                                isRead ? $(elm).find("a[ng-click]").css("pointer-events", "none") : $(elm).find("a[ng-click]").css("pointer-events", "auto");
                                break;
                            case "dic":
                                isRead ? $(elm).find("span").css("pointer-events", "none") : $(elm).find("span").css("pointer-events", "auto");
                                break;
                            default:
                                isRead ? $(elm).attr("disabled", "disabled") : $(elm).removeAttr("disabled");
                                break;
                        }
                    }

                    function cleanElem(field, elm) {
                        switch (field.ctrlType) {
                            case "checkbox":
                                $(elm).find("input[type=checkbox]").attr("checked", false);
                                break;
                            case "select":
                                $(elm).val(null).trigger("change");
                                break;
                            default:
                                break;
                        }
                    }

                    function getIsSub(pathName, tableName) {
                        if (pathName.indexOf('.sub_' + tableName + '.') > 0) {//子表
                            return true;
                        }
                        return false;
                    }

                    function getScopeElm(id) {
                        var elem;
                        $('.ng-scope').each(function () {
                            var s = angular.element(this).scope(),
                                sid = s.$id;
                            if (sid == id) {
                                elem = this;
                                return false;
                            }
                        });
                        return elem;
                    }

                    //字段显示或隐藏
                    function fieldShowOrHide(elm, isShow) {
                        var td = $(elm).parent();
                        var th = $(td).prev('th');
                        if (isShow) {
                            $(elm).removeClass('gangedhide')
                            td.show();
                            th.show();
                        } else {
                            $(elm).addClass('gangedhide')
                            td.hide();
                            th.hide();
                        }
                    }

                    //分组显示或隐藏
                    function gangedGroup(elm, isShow) {
                        var curGroup = $(elm).attr("group");
                        $(elm).toggleClass("selected").siblings("[group='" + curGroup + "']").toggle(isShow);
                        isShow ? $(elm).show() : $(elm).hide();
                    }

                    //判断是否符合联动规则
                    function addToChange(newValue, selfField, otherFields, changeFields, id, isSub) {
                        if (newValue == selfField.value) {
                            var isTrigger = true;
                            if (otherFields) {
                                isTrigger = isOtherTrigger(otherFields);
                            }
                            if (isTrigger) {
                                gangedChangeFields(changeFields, id);
                            } else {
                                gangedBack(id);
                            }
                        } else {
                            gangedBack(id);
                        }
                    }


                    //当不符合联动规则时回退之前的联动
                    function gangedBack(id) {
                        var changeList = scope.$parent.changeList;
                        var delArray = [];

                        for (var i = 0; i < changeList.length; i++) {
                            var change = changeList[i];
                            var isSub = getIsSub(change.pathName, change.tableName);
                            var isGroup = false;
                            if (change.pathName.indexOf("separator.") == 0) {
                                isGroup = true;
                            }
                            var elm = change.elm;
                            if (change.id == id) {
                                switch (change.type) {
                                    case "1":
                                        isGroup ? gangedGroup(elm, true) : fieldShowOrHide(elm, true);
                                        break;
                                    case "2":
                                        isGroup ? gangedGroup(elm, false) : fieldShowOrHide(elm, false);
                                        break;
                                    case "3":
                                        readOnlyElem(false, change, elm);
                                        break;
                                        break;
                                    case "4":
                                        readOnlyElem(true, change, elm);
                                        break;
                                        break;
                                    case "5":
                                        changeRequired(elm, false);
                                        break;
                                    case "6":
                                        changeRequired(elm, true);
                                        break;
                                    case "7":
                                        var tmp = isSub ? 'scope.item.' + change.name + '="' + change.value + '"' : 'scope.$parent.data.' + change.pathName + '="' + change.value + '"';
                                        eval(tmp);
                                        break;
                                    case "8":
                                        gangedCascade(id, change, 0);
                                        break;
                                }
                                delArray.push(i);
                            }
                        }
                        for (var m = 0; m < delArray.length; m++) {
                            removeObjFromArr(scope.$parent.changeList, delArray[m]);
                        }
                    }

                    //下拉框级联设置
                    function gangedCascade(id, changeField, type, elm) {
                        if (type == 1) {
                            var isSub = getIsSub(changeField.pathName, changeField.tableName);
                            var reduce = changeField.cascade.reduce;
                            var delArray = [];
                            var oldOptions = [];
                            if (reduce && reduce.length > 0) {
                                var options = elm.options;
                                for (var i = 0; i < options.length; i++) {
                                    var option = options[i];
                                    oldOptions.push(option);
                                    for (var m = 0; m < reduce.length; m++) {
                                        if (option.value == reduce[m].id) {
                                            delArray.push(option.value);
                                            if (option.selected) {
                                                var tmp = isSub ? 'scope.item.' + changeField.pathName + '=""' : 'scope.$parent.data.' + changeField.pathName + '=""';
                                                eval(tmp);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            for (var k = 0; k < delArray.length; k++) {
                                removeOptions(options, delArray[k]);
                            }
                            addToChangeList(id, elm, changeField, false, oldOptions);
                        } else {
                            $(changeField.elm).empty();
                            var options = changeField.oldOptions;
                            for (var i = 0; i < options.length; i++) {
                                options[i].selected = changeField.value == options[i].value ? true : false;
                                changeField.elm.options.add(options[i]);
                            }
                        }
                    }

                    function removeOptions(options, value) {
                        for (var i = 0; i < options.length; i++) {
                            if (options[i].value == value) {
                                options.remove(i);
                                break;
                            }
                        }
                    }

                    //监听联动字段
                    parentScope.$watch(attr.ngModel, function (newValue, oldValue, scope) {
                        var isSub = false;
                        var ngModelPath = attr.ngModel.slice(5);
                        if (attr.ngModel.indexOf('item.') == 0) {//子表
                            isSub = true;
                        }
                        var gangedJson = parseToJson(attr.htGanged);
                        for (var i = 0; i < gangedJson.length; i++) {
                            var chooseFields = gangedJson[i].chooseField;
                            var id = gangedJson[i].id;
                            for (var m = 0; m < chooseFields.length; m++) {
                                var chooseField = chooseFields[m];
                                if ((!isSub && ngModelPath == chooseField.pathName) || isSub && ngModelPath == chooseField.name) {
                                    var changeFields = gangedJson[i].changeField;
                                    removeObjFromArr(chooseFields, m);
                                    addToChange(newValue, chooseField, chooseFields, changeFields, id);
                                }
                            }
                        }
                    });

                }

            }
        };
    }])

    /**
     * 分组展开显示。
     * 属性说明：
     *    ht-toggle：指令 属性值为默认分组是否展开。
     */
    .directive('htToggle', [function () {
        return {
            restrict: 'AE',
            scope: {
                htToggle: "="
            },
            link: function (scope, element, attrs, ctrl) {
                if (!attrs.htToggle) {
                    $(element).toggleClass("selected").siblings("[group='" + attrs.group + "']").toggle(false);
                }
                $(element).click(function () {
                    $(this).toggleClass("selected")
                        .siblings("[group='" + attrs.group + "']").toggle();
                });
            }

        }
    }])


    /**
     * 意见历史中过滤器审批状态过滤器。
     */
    .filter("taskstatus", function () {
        return function (input) {
            var rtn = "";
            switch (input) {
                case "agree":
                    rtn = "同意";
                    break;
                case "start":
                    rtn = "提交";
                    break;
                case "end":
                    rtn = "结束";
                    break;
                case "awaiting_check":
                    rtn = "待审批";
                    break;
                case "oppose":
                    rtn = "反对";
                    break;
                case "abandon":
                    rtn = "弃权";
                    break;
                case "reject":
                    rtn = "驳回";
                    break;
                case "backToStart":
                    rtn = "驳回到发起人";
                    break;
                case "reSubmit":
                    rtn = "重新提交";
                    break;
                case "revoker":
                    rtn = "撤回";
                    break;
                case "revoker_to_start":
                    rtn = "撤回到发起人";
                    break;
                case "signPass":
                    rtn = "会签通过";
                    break;
                case "signNotPass":
                    rtn = "会签不通过";
                    break;
                case "signBackCancel":
                    rtn = "驳回取消";
                    break;
                case "signRecoverCancel":
                    rtn = "撤销取消";
                    break;
                case "passCancel":
                    rtn = "通过取消";
                    break;
                case "notPassCancel":
                    rtn = "不通过取消";
                    break;
                case "transforming":
                    rtn = "流转中";
                    break;
                case "transAgree":
                    rtn = "同意";
                    break;
                case "transOppose":
                    rtn = "反对";
                    break;
                case "skip":
                    rtn = "跳过执行";
                    break;
                case "manual_end":
                    rtn = "人工终止";
                    break;
            }
            return rtn;
        }
    });

//data.permission   {tableName:{table{},field{}}}
function getPermission(permissionPath, scope) {
    var permission = scope.permission || scope.$parent.permission || scope.$parent.$parent.permission;
    if (!permission || !permissionPath) return "w";
    try {
        var p = eval(permissionPath);
    } catch (e) {
        console.info("获取权限出现了异常 permissionPath:" + permissionPath)
        console.info(permission);
        console.info(e);
    }
    return p || 'w';
}

//表单中需要初始化表单后执行的初始化动作
//eg：office 控件ht-office-plugin 已经有了统一初始化所有office指令的动作。故此我们不在写指令单个单个的处理
function ngFormReady(scope) {
    //初始化office控件
    if (window.OfficePlugin) OfficePlugin.init(scope);

    //初始化tab
    $("#formTab").tabs();
}


/**
 * 调用别名脚本。
 * @param param    传入参数，参数格式 {alias:"别名必须传入",name:"abc","age":20}
 * @returns 返回数据格式如下：
 * {"result":"4","isSuccess":0,"msg":"别名脚本执行成功！"}
 * result:脚本返回的结果
 * isSuccess：0表示成果能够，1，失败
 * msg ：具体的出错信息
 */
function RunAliasScript(param) {
    if (!param) param = {};
    var url = __ctx + '/platform/system/aliasScript/executeAliasScript.ht';
    var rtn = "";
    $.ajaxSetup({async: false});  //同步
    $.post(url, param, function (data) {
        rtn = eval("(" + data + ")");
    });
    $.ajaxSetup({async: true}); //异步
    return rtn;

}
