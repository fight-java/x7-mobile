
function getContextPath(){   
    var pathName = document.location.pathname;
    var wxIndex = pathName.indexOf("/mobile/");
    if (wxIndex == -1) {
    	wxIndex = pathName.indexOf("/main/");
    }
    if (wxIndex == -1) {
    	wxIndex = pathName.indexOf("/form/");
    }
    var result = pathName.substr(0,wxIndex);   
    return result;   
}
var __ctx = getContextPath();

document.write("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">");
document.write("<meta name=\"viewport\" content=\"initial-scale=1, maximum-scale=1\">");
document.write("<meta name=\"renderer\" content=\"webkit\">");
document.write("<meta http-equiv=\"Cache-Control\" content=\"no-siteapp\" />");
document.write("<link rel=\"icon\" type=\"image/png\" href=\""+__ctx+"/mobile/assets/img/i-f7.png\">");
document.write("<meta name=\"mobile-web-app-capable\" content=\"yes\">");
document.write("<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">");
document.write("<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black\">");
document.write("<meta name=\"msapplication-TileColor\" content=\"#0e90d2\">");
document.write("<meta charset=\"UTF-8\">");
document.write("<meta name=\"viewport\" content=\"width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no\">");

var aryCss__=[
              "/mobile/js/pace/themes/blue/pace-theme-minimal.css",
              "/mobile/css/light7.min.css",
              "/mobile/css/basic.css",
              "/mobile/css/htmlMobile.css",
              "/mobile/css/mobiscroll.custom-3.0.0.css",
              "/mobile/css/font-awesome.min.css",
              "/mobile/css/jquery.qtip.min.css"];

var aryJs__=[
             "/mobile/js/jquery/jquery.min.js",
             "/mobile/js/angular/angular.min.js",
             "/mobile/js/angular/angular-translate.min.js",
             "/mobile/js/angular/angular-translate-loader-static-files.min.js",
             "/mobile/js/jquery/jquery.base64.js",
             "/mobile/js/angular/angular-sanitize.min.js",
             "/mobile/js/BaseService.js",
             "/mobile/js/layer/layer.js",
             "/mobile/js/form/customQueryService.js",
             "/mobile/js/util/arrayToolService.js",
             "/mobile/js/util/customUtil.js",
             "/mobile/js/light7/light7.min.js",
             "/mobile/js/light7/light7-swiper.min.js",
             "/mobile/js/light7/light7-swipeout.js",
             "/mobile/js/jquery/jquery.qtip.js",
             "/mobile/js/util/util.js",
             "/mobile/js/util/appUtil.js",
             "/mobile/js/mobileDirective.js",
             "/mobile/js/app.js"];


//流程页面需要的css js
var flowAryCss =["/mobile/js/ztree/css/zTreeStyle/zTreeStyle.css",
                 "/mobile/js/ztree/css/outLook.css"];

window.FORM_TYPE_ = 'mobile';
var flowAryJs = [
                 "/mobile/js/mobiscroll.custom-3.0.0.min.js", 
                 "/mobile/js/util/CustomValid.js",
                 "/mobile/js/form/directiveTpl.js",  // 表单公共
                 "/mobile/js/form/FormDirective.js", // 表单公共
                 "/mobile/js/form/FormService.js", 		// 表单公共
                 
                 "/mobile/js/ztree/js/jquery.ztree.all-3.5.min.js",
                 "/mobile/js/ztree/ZtreeCreator.js",
                 "/mobile/js/dialog/Dialogs.js",
                 "/mobile/js/bpm/FlowService.js",
                 "/mobile/js/bpm/startFlowController.js"];


var flowInstAryJs = ["/mobile/js/util/CustomValid.js",
                     "/mobile/js/form/directiveTpl.js",
                     "/mobile/js/form/FormDirective.js",
                     "/mobile/js/form/FormService.js",
                     
                     "/mobile/js/mobiscroll.custom-3.0.0.min.js",
                     "/mobile/js/bpm/FlowService.js",
                     "/mobile/js/ztree/js/jquery.ztree.all-3.5.min.js",
                     "/mobile/js/ztree/ZtreeCreator.js",
                     "/mobile/js/bpm/processInfoController.js"];

// 解析栏目的js
var parseHTMLJS = ["/js/hotent/index/jquery.blockUI.min.js",
               "/js/hotent/index/jquery.slimscroll.min.js",
               "/js/echarts/echarts.js",
               "/js/hotent/index/indexPage.js"];

var loginCss = ["/mobile/css/login.css"];

var validateJs = ["/mobile/js/util/CustomValid.js",
                  "/mobile/js/form/FormService.js",
                  "/mobile/js/form/FormDirective.js"];
/**
 * js引入时导入必须的css样式。
 */
for(var i=0;i<aryCss__.length;i++){
	var str="<link rel=\"stylesheet\" href=\""+__ctx + aryCss__[i] +"\">";
	document.write(str);
}

/**
 * js引入时导入必须的js文件。
 */
for(var i=0;i<aryJs__.length;i++){
	var str="<script src=\""+__ctx + aryJs__[i] +"\"></script>";
	document.write(str);
}

/**
 * 外部导入的js文件。
 */
function importJs(aryJs){
	for(var i=0;i<aryJs.length;i++){
		var str="<script src=\""+__ctx + aryJs[i] +"\"></script>";
		document.write(str);
	}
}

/**
 * 外部导入css。
 */
function importCss(aryCss){
	for(var i=0;i<aryCss.length;i++){
		var str="<link rel=\"stylesheet\" href=\""+__ctx + aryCss[i] +"\">";
		document.write(str);
	}
}