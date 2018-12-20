var Namespace = new Object();

Namespace.register = function(path) {
	var arr = path.split(".");
	var ns = "";
	for (var i = 0; i < arr.length; i++) {
		if (i > 0)
			ns += ".";
		ns += arr[i];
		eval("if(typeof(" + ns + ") == 'undefined') " + ns + " = new Object();");
	}
};

//This must be applied to a form (or an object inside a form).
jQuery.fn.addHidden = function (name, value) {
    return this.each(function () {
        var input = $("<input>").attr("type", "hidden").attr("name", name).val(value);
        $(this).append($(input));
    });
};

//判断是否出现滚动条
jQuery.fn.hasScrollBar = function() {
    return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
};

//遍历数据字典的所有项
jQuery.fn.eachComboNode = function(callback){
	if (typeof callback != 'function')
		return;
	var tree = $(this).combotree('tree'),
		roots = tree.tree("getRoots"), children, i, j;
	for (i = 0; i < roots.length; i++) {
		if (!callback(roots[i])) {
			break;
		}
		children = tree.tree('getChildren',roots[i].target);
		for (j = 0; j < children.length; j++) {
			if (!callback(children[j])) {
				break;
			}
		}
	}
};

/**
 * 功能：给url添加一个当前时间日期数值，使页面不会被缓存。
 */
String.prototype.getNewUrl = function() {
	// 如果url中没有参数。
	var time = new Date().getTime();
	var url = this;
	// 去除‘#’后边的字符
	if (url.indexOf("#") != -1) {
		var index = url.lastIndexOf("#", url.length - 1);
		url = url.substring(0, index);
	}

	while (url.endWith("#")) {
		url = url.substring(0, url.length - 1);
	}
	url = url.replace(/(\?|&)rand=\d*/g, "");
	if (url.indexOf("?") == -1) {
		url += "?rand=" + time;
	} else {
		url += "&rand=" + time;
	}
	return url;
};


/**
 * 判断字符串是否为空。
 * 
 * @returns {Boolean}
 */
String.prototype.isEmpty = function() {
	var rtn = (this == null || this == undefined || this.trim() == '');
	return rtn;
};
/**
 * 功能：移除首尾空格
 */
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
};
/**
 * 功能:移除左边空格
 */
String.prototype.lTrim = function() {
	return this.replace(/(^\s*)/g, "");
};
/**
 * 功能:移除右边空格
 */
String.prototype.rTrim = function() {
	return this.replace(/(\s*$)/g, "");
};

/**
 * 判断结束是否相等
 * 
 * @param str
 * @param isCasesensitive
 * @returns {Boolean}
 */
String.prototype.endWith = function(str, isCasesensitive) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	var tmp = this.substring(this.length - str.length);
	if (isCasesensitive == undefined || isCasesensitive) {
		return tmp == str;
	} else {
		return tmp.toLowerCase() == str.toLowerCase();
	}

};
/**
 * 判断开始是否相等
 * 
 * @param str
 * @param isCasesensitive
 * @returns {Boolean}
 */
String.prototype.startWith = function(str, isCasesensitive) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	var tmp = this.substr(0, str.length);
	if (isCasesensitive == undefined || isCasesensitive) {
		return tmp == str;
	} else {
		return tmp.toLowerCase() == str.toLowerCase();
	}
};

/**
 * 在字符串左边补齐指定数量的字符
 * 
 * @param c
 *            指定的字符
 * @param count
 *            补齐的次数 使用方法： var str="999"; str=str.leftPad("0",3); str将输出 "000999"
 * @returns
 */
String.prototype.leftPad = function(c, count) {
	if (!isNaN(count)) {
		var a = "";
		for (var i = this.length; i < count; i++) {
			a = a.concat(c);
		}
		a = a.concat(this);
		return a;
	}
	return null;
};

/**
 * 在字符串右边补齐指定数量的字符
 * 
 * @param c
 *            指定的字符
 * @param count
 *            补齐的次数 使用方法： var str="999"; str=str.rightPad("0",3); str将输出
 *            "999000"
 * @returns
 */
String.prototype.rightPad = function(c, count) {
	if (!isNaN(count)) {
		var a = this;
		for (var i = this.length; i < count; i++) {
			a = a.concat(c);
		}
		return a;
	}
	return null;
};

/**
 * 对html字符进行编码 用法： str=str.htmlEncode();
 * 
 * @returns
 */
String.prototype.htmlEncode = function() {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
			"&gt;").replace(/\"/g, "&#34;").replace(/\'/g, "&#39;");
};

/**
 * 对html字符串解码 用法： str=str.htmlDecode();
 * 
 * @returns
 */
String.prototype.htmlDecode = function() {
	return this.replace(/\&amp\;/g, '\&').replace(/\&gt\;/g, '\>').replace(
			/\&lt\;/g, '\<').replace(/\&quot\;/g, '\'').replace(/\&\#39\;/g,
			'\'');
};

/**
 * 对json中的特殊字符进行转义
 */
String.prototype.jsonEscape = function() {
	return this.replace(/\"/g, "&quot;").replace(/\n/g, "&nuot;");
};

/**
 * 对json中的特殊字符进行转义
 */
String.prototype.jsonUnescape = function() {
	return this.replace(/&quot;/g, "\"").replace(/&nuot;/g, "\n");
};

/**
 * 字符串替换
 * 
 * @param s1
 *            需要替换的字符
 * @param s2
 *            替换的字符。
 * @returns
 */
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
};

/**
 * 获取url参数
 * 
 * @returns {object}
 */
String.prototype.getArgs = function() {
	var args = {};
	if (this.indexOf("?") > -1) {
		var argStr = this.split("?")[1], argAry = argStr.split("&");

		for (var i = 0, c; c = argAry[i++];) {
			var pos = c.indexOf("=");
			if (pos == -1)
				continue;
			var argName = c.substring(0, pos), argVal = c.substring(pos + 1);
			argVal = decodeURIComponent(argVal);
			args[argName] = argVal;
		}
	}
	return args;
};

/**
 * 移除数组中指定对象
 */
Array.prototype.remove = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};
Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
	return this;
};
/**
 * 去除数组中的重复项
 * @function [method] 判断对象是否相同的方法(可选参数，默认实现是深度匹配两个对象是否相同)，示例：function(x,y){if(x.id===y.id)return true;}
 */
Array.prototype.unique=function(method){
	if(!angular.isArray(this))return this;
	var sameObj = method || function(a, b) {
        var tag = true;
        for (var x in a) {
            if (!b[x])
                return false;
            if (typeof(a[x]) === 'object') {
                tag = sameObj(a[x], b[x]);
            } else {
                if (a[x] !== b[x])
                    return false;
            }
        }
        return tag;
    }
	
	var flag, that = this.slice(0);
	this.length = 0;
	for (var i = 0; i < that.length; i++) {
	    var x = that[i];
	    flag = true;
	    for (var j = 0; j < this.length; j++) {
	        y = this[j];
	        if (sameObj(x, y)) {
	            flag = false;
	            break;
	        }
	    }
	    if (flag) this[this.length] = x;
	}
	return this;
}

/**
 * var str=String.format("姓名:{0},性别:{1}","ray","男"); alert(str);
 * 
 * @returns
 */
String.format = function() {
	var template = arguments[0];
	var args = arguments;
	var str = template.replace(/\{(\d+)\}/g, function(m, i) {
				var k = parseInt(i) + 1;
				return args[k];
			});
	return str;
};

/**
 * 字符串操作 使用方法： var sb=new StringBuffer(); sb.append("aa"); sb.append("aa"); var
 * str=sb.toString();
 * 
 * @returns {StringBuffer}
 */
function StringBuffer() {
	this.content = new Array;
}
StringBuffer.prototype.append = function(str) {
	this.content.push(str);
};
StringBuffer.prototype.toString = function() {
	return this.content.join("");
};


/**
 * 日期格式化。
 * 日期格式：
 * yyyy，yy 年份
 * MM 大写表示月份
 * dd 表示日期
 * hh 表示小时
 * mm 表示分钟
 * ss 表示秒
 * q  表示季度
 * 实例如下：
 * var now = new Date(); 
 * var nowStr = now.format("yyyy-MM-dd hh:mm:ss"); 
 */
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
	} 
	
	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format; 
} 


/**
 * 求两个时间的天数差 日期格式为 yyyy-MM-dd 或 YYYY-MM-dd HH:mm:ss
 */
function daysBetween(DateOne, DateTwo) {
	var dayOne = '';
	var dayTwo = '';
	var timeOne = '';
	var timeTwo = '';

	if (DateOne != null && DateOne != '') {
		var arrOne = DateOne.split(' ');
		dayOne = arrOne[0];
		if (arrOne.length > 1) {
			timeOne = arrOne[1];
		}
	}

	if (DateTwo != null && DateTwo != '') {
		var arrTwo = DateTwo.split(' ');
		dayTwo = arrTwo[0];
		if (arrTwo.length > 1) {
			timeTwo = arrTwo[1];
		}
	}

	var OneMonth = 0;
	var OneDay = 0;
	var OneYear = 0;
	if (dayOne != null && dayOne != '') {
		var arrDate = dayOne.split('-');
		OneYear = parseInt(arrDate[0], 10);
		OneMonth = parseInt(arrDate[1], 10);
		OneDay = parseInt(arrDate[2], 10);
	}

	var TwoMonth = 0;
	var TwoDay = 0;
	var TwoYear = 0;
	if (dayTwo != null && dayTwo != '') {
		var arrDate = dayTwo.split('-');
		TwoYear = parseInt(arrDate[0], 10);
		TwoMonth = parseInt(arrDate[1], 10);
		TwoDay = parseInt(arrDate[2], 10);
	}

	var OneHour = 0;
	var OneMin = 0;
	var OneSec = 0;
	if (timeOne != null && timeOne != '') {
		var arrTiem = timeOne.split(':');
		OneHour = parseInt(arrTiem[0]);
		OneMin = parseInt(arrTiem[1]);
		OneSec = parseInt(arrTiem[2]);
	}

	var TwoHour = 0;
	var TwoMin = 0;
	var TwoSec = 0;
	if (timeTwo != null && timeTwo != '') {
		var arrTiem = timeTwo.split(':');
		TwoHour = parseInt(arrTiem[0]);
		TwoMin = parseInt(arrTiem[1]);
		TwoSec = parseInt(arrTiem[2]);
	}

	var vflag = TwoYear > OneYear ? true : false;
	if (!vflag) {
		vflag = TwoMonth > OneMonth ? true : false;
		if (!vflag) {
			vflag = TwoDay > OneDay ? true : false;

			if (!vflag) {
				if (OneDay == TwoDay) {
					vflag = TwoHour > OneHour ? true : false;
					if (!vflag) {
						vflag = TwoMin > OneMin ? true : false;
						if (!vflag) {
							vflag = TwoSec >= OneSec ? true : false;
						}
					}
				} else {
					return false;
				}
			} else {
				return true;
			}
		}
	}

	return vflag;
};

/**
 * 加载多个Script
 * 
 * @param resources
 *            script file array :['file1.js','file2.js']
 * @param callback
 *            function
 * @returns void
 */

jQuery.getMutilScript = function(resources, callback) {
	var getScript = function(url, callback) {
		$.ajax({
					url : url,
					dataType : "script",
					success : callback,
					async : false
				}).done(function() {
					callback && callback();
				});
	};
	var // reference declaration &amp; localization
	length = resources.length, handler = function() {
		counter++;
	}, deferreds = [], counter = 0, idx = 0;

	for (; idx < length; idx++) {
		deferreds.push(getScript(resources[idx], handler));
	}
	jQuery.when(deferreds).done(function() {
				callback && callback();
			});
};



jQuery.getWindowRect = function() {
	var myWidth = 0, myHeight = 0;
	if (typeof(window.innerWidth) == 'number') {
		// Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	} else if (document.documentElement
			&& (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		// IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if (document.body
			&& (document.body.clientWidth || document.body.clientHeight)) {
		// IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}
	return {
		height : myHeight,
		width : myWidth
	};
}

// 禁用刷新。通过传入浏览器类型 来指定禁用某个浏览器的刷新
function forbidF5(exp) {
	var currentExplorer = window.navigator.userAgent;
	// ie "MSIE" ,, firefox "Firefox" ,,Chrome "Chrome",,Opera "Opera",,Safari
	// "Safari"
	if (currentExplorer.indexOf(exp) >= 0) {
		document.onkeydown = function(e) {
			var ev = window.event || e;
			var code = ev.keyCode || ev.which;
			if (code == 116) {
				ev.keyCode ? ev.keyCode = 0 : ev.which = 0;
				cancelBubble = true;
				return false;
			}
		};
	}
}
//判断数组中是否包含某个元素
function isInArray(arr, obj) {
    for (var i = 0; i < arr.length && arr[i] != obj; i++);
    return !(i == arr.length);
}
//判断数组中是否包含某个元素
function isInArrayByKey(arr, obj, key) {
    for (var i = 0; i < arr.length && arr[i][key] != obj[key]; i++);
    return !(i == arr.length);
}
//删除数组中某个元素
function removeObjFromArr(arrs,dx) 
{ 	
    if(isNaN(dx)||dx>arrs.length){return false;} 
    for(var i=0,n=0;i<arrs.length;i++) 
    { 
        if(arrs[i]!=arrs[dx]) 
        { 
            arrs[n++]=arrs[i] ;
        } 
    } 
    arrs.length-=1 ;
} 
//产生随机数
function GetRandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	return (Min + Math.round(Rand * Range));
}
var JsonUtil = {
	//定义换行符
	n : "\n",
	//定义制表符
	t : "\t",
	//转换String
	convertToString : function(obj) {
		return JsonUtil.__writeObj(obj, 1);
	},
	//写对象
	__writeObj : function(obj //对象
			, level //层次（基数为1）
			, isInArray) { //此对象是否在一个集合内
		//如果为空，直接输出null
		if (obj == null) {
			return "null";
		}
		//为普通类型，直接输出值
		if (obj.constructor == Number || obj.constructor == Date
				|| obj.constructor == String || obj.constructor == Boolean) {
			var v = obj.toString();
			var tab = isInArray
					? JsonUtil.__repeatStr(JsonUtil.t, level - 1)
					: "";
			if (obj.constructor == String || obj.constructor == Date) {
				//时间格式化只是单纯输出字符串，而不是Date对象
				return tab + ("\"" + v + "\"");
			} else if (obj.constructor == Boolean) {
				return tab + v.toLowerCase();
			} else {
				return tab + (v);
			}
		}

		//写Json对象，缓存字符串
		var currentObjStrings = [];
		//遍历属性
		for (var name in obj) {
			var temp = [];
			//格式化Tab
			var paddingTab = JsonUtil.__repeatStr(JsonUtil.t, level);
			temp.push(paddingTab);
			//写出属性名
			temp.push(name + " : ");

			var val = obj[name];
			if (val == null) {
				temp.push("null");
			} else {
				var c = val.constructor;

				if (c == Array) { //如果为集合，循环内部对象
					temp.push(JsonUtil.n + paddingTab + "[" + JsonUtil.n);
					var levelUp = level + 2; //层级+2

					var tempArrValue = []; //集合元素相关字符串缓存片段
					for (var i = 0; i < val.length; i++) {
						//递归写对象                         
						tempArrValue.push(JsonUtil.__writeObj(val[i], levelUp,
								true));
					}

					temp.push(tempArrValue.join("," + JsonUtil.n));
					temp.push(JsonUtil.n + paddingTab + "]");
				} else if (c == Function) {
					temp.push(val);
				} else {
					//递归写对象
					temp.push(JsonUtil.__writeObj(val, level + 1));
				}
			}
			//加入当前对象“属性”字符串
			currentObjStrings.push(temp.join(""));
		}
		return (level > 1 && !isInArray ? JsonUtil.n : "") //如果Json对象是内部，就要换行格式化
				+ JsonUtil.__repeatStr(JsonUtil.t, level - 1) + "{" + JsonUtil.n //加层次Tab格式化
				+ currentObjStrings.join("," + JsonUtil.n) //串联所有属性值
				+ JsonUtil.n + JsonUtil.__repeatStr(JsonUtil.t, level - 1) + "}"; //封闭对象
	},
	__isArray : function(obj) {
		if (obj) {
			return obj.constructor == Array;
		}
		return false;
	},
	__repeatStr : function(str, times) {
		var newStr = [];
		if (times > 0) {
			for (var i = 0; i < times; i++) {
				newStr.push(str);
			}
		}
		return newStr.join("");
	}
};


/**
 * 将字符串转为json对象。
 * @param jsonStr
 * @param type  可不填写
 * @returns
 */
function parseToJson(jsonStr,type){
	type=type||1;
	if(jsonStr === "") return;
	try{
		switch(type){
			case 1:
				return eval("("+jsonStr+")");
			break;
			case 2:
				return $.parseJSON(jsonStr);
				break;
			case 3:
				return angular.fromJson(jsonStr);
				break;
			case 4:
				JSON.parse(jsonStr);
				break;
			default:
				console.error("解析json对象错误");
				break;
		}
		
	}catch(e){
		return parseToJson(jsonStr,type+1);
	}
}
/**
 * 获取元素当前页angular的scope
 * @param obj
 * @returns
 */
function getScope(obj){
	obj=(obj&&$(obj))||$("[ng-controller]");
	obj=(obj[0]?obj:$("body"));
	return obj.scope();
}
/**
 * 通过载入方法名，调用scope中的某个方法
 * @param funStr
 */
function triggerScopeFun(funStr){
	var scope  = getScope();
	var fun = scope[funStr];
	if(fun) return fun.call(this,arguments);
}
/**
 * 获取元素的纵坐标 
 * @param e
 * @returns
 */
function getTop(e){
	if(!e)return null;
	var offset=e.offsetTop; 
	if(e.offsetParent!=null) offset+=getTop(e.offsetParent); 
	return offset; 
} 
/**
 * 出发checkbox的选中状态改变
 * @param me
 */
function toggleCheck(me){
	if(event&&event.toElement.tagName=="INPUT") return;
	var checkbox=$(me).find("input[type='checkbox']");
	if(checkbox[0]) checkbox[0].checked=!checkbox[0].checked;
}
//通过url片段获取Iframe
function getBpmFormEditIframe(url){
	var iframes=$(parent.document).find("iframe");
	for(var i=iframes.length;i--;){
		if($(iframes[i]).contents()[0].URL.indexOf(url)!=-1){
			return $(iframes[i]);
		}
	}
	return null;
}
function addCssToHtml(str_css) { //Copyright @ rainic.com
	 try { //IE下可行
		  var style = document.createStyleSheet();
		  style.cssText = str_css;
	 }
	 catch (e) { //Firefox,Opera,Safari,Chrome下可行
		  var style = document.createElement("style");
		  style.type = "text/css";
		  style.textContent = str_css;
		  document.getElementsByTagName("HEAD").item(0).appendChild(style);
	 }
}

function isComplexTag(elm){
	return elm.attr("type")=="checkbox"||elm.attr("type")=="radio"||elm.attr("selector-type");
}

function isArrayEquals(arr1,arr2){
	if(!(arr1 instanceof Array)||!(arr2 instanceof Array)) return false;
	for(var i =0;i<arr1.length;i++){
		if(arr1[i]!=arr2[i]) return false;
	}
	return true;
}

function downLoadFileById(fileId){
	var path =__ctx+"/system/file/download.ht?id="+fileId;
	window.open(path,'_blank');	
}

function sleep(n) {
    var start = new Date().getTime();
    while(true)  if(new Date().getTime()-start > n) break;
}

//阻止事件冒泡函数
function stopBubble(e)
{
    if(e && e.stopPropagation){
    	e.stopPropagation();
    }
    else{
    	window.event.cancelBubble=true;
    }
}
//阻止事件默认行为
function stopDefault(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    } else {
        window.event.returnValue = false;
    }
    return false;
}

String.prototype.replaceFirstMacthByIndex = function(oldVal , newVal , start) {
	var oldValLength = oldVal.length;
	var index = this.indexOf(oldVal,start);
	return this.substring(0,index) + this.substring(index+oldValLength);
};

//刷新指定的Grid
function refreshTargetGrid(gridId) {
    if (!gridId || gridId == "") gridId="grid";
    $('#' + gridId).datagrid("reload");
}


/**
 * 克隆工具类
 */
var CloneUtil = {
		/**
		 * 深复制【可以迭代】
		 */
		deep:function(obj){
			return jQuery.extend(true,{}, obj);
		},
		/**
		 * 浅复制【不能迭代】
		 */
		shallow:function(obj){
			return jQuery.extend({}, obj);
		},
		/**
		 * 数组复制
		 */
		list:function(obj){
			return $.map(obj, function (n) { return n; });
		}
}


var HtUtil={};
/**
 * 设置缓存。
 */
HtUtil.set=function(key,value){
	localStorage[key]=value;
}

/**
 * 获取缓存
 */
HtUtil.get=function(key){
	return localStorage[key];
}

/**
 * 删除缓存
 */
HtUtil.clean=function(key){
	localStorage.rmStorage(key);
}

/**
 * 设置缓存，value 为JSON对象。
 */
HtUtil.setJSON=function(key,value){
	var json=JSON.stringify(value)
	localStorage[key]=json;
}

/**
 * 根据键获取json对象。
 */
HtUtil.getJSON=function(key){
	var json=localStorage[key];
	if(json==undefined) return null;
	return JSON.parse(json);
}

HtUtil.getParameters=function(){
	var locUrl = window.location.search.substr(1);
	var aryParams=locUrl.split("&");
	var json={};
	for(var i=0;i<aryParams.length;i++){
		var pair=aryParams[i];
		var aryEnt=pair.split("=");
		var key=aryEnt[0];
		var val=aryEnt[1];
		if(json[key]){
			json[key]=json[key] +"," + val;
		}
		else{
			json[key]=val;
		}
		return json;
	}
}

/**
 * iframe 高度自适应。
 * @param obj
 */
function autoFrameHeight(obj){
    var doc=  obj.document || obj.contentDocument;
    if(obj != null && doc != null) {
    	obj.height = doc.body.scrollHeight+10;
    }
}

function loadIframe(obj){
	autoFrameHeight(obj);
	$(obj).parent().css("height",obj.height);
}

//展示背景iframe使改元素能在特殊页面office或者flash置顶处理
function createBackgroundIframe (menu){
	var body = menu.parent("body");
	
	var iframeObj = $("#backgroundIframe",body);
	if(iframeObj.length==0){
		iframeObj=$('<iframe  frameborder="0" id="backgroundIframe" style="position:absolute;z-index:1;"></iframe>');
		iframeObj.appendTo(body);
	}
	iframeObj.css({left:menu.css("left"),top:menu.css("top"),width:menu.css("width"),height:menu.css("height")});
	iframeObj.show();
	iframeObj.data("target",menu);
	
}

//如果改区域触发了关闭按钮则
//修改了源码在关闭的时候添加处理
function hideBackgroundIfream(){
	var backGroundIfream = $("#backgroundIframe");
	if(backGroundIfream.length!=0){
		var target = backGroundIfream.data("target");
		if(!target || target.is(":hidden")){
			backGroundIfream.hide();
		}
	}
}

function isClass(o){
    if(o===null) return "Null";
    if(o===undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8,-1);
}


var Base64Util = {
	//将Base64数据转化成Blob数据
	convertBase64UrlToBlob:function(urlData){
		var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        	bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	    while(n--){
	        u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new Blob([u8arr], {type:mime});
	}
}

var MD5Util = {
	//生成MD5
	generateMd5:function(option){
		var spark = new SparkMD5();
		var fileReader = new FileReader();
		fileReader.readAsBinaryString(option.data);
		fileReader.onload = function(e){
			spark.appendBinary(e.target.result);
	　　      	var md5 = spark.end();
	　　      	if(option.callback){
	　　      		option.callback(md5);
	　　      	}
		}
		fileReader.onerror = function(e){
			alert("计算读取文件md5出错");
		}
	}
}
