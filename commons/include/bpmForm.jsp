<%@page import="java.util.Map"%>
<%@page import="com.alibaba.fastjson.JSON"%>
<%@page import="com.hotent.base.core.web.RequestUtil"%>
<%@page import="com.hotent.sys.util.ContextUtil"%>
<%@page import="com.hotent.base.core.util.string.StringUtil"%>
<%@page import="com.hotent.base.core.util.PropertyUtil"%>
<%@taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="f"   uri="http://www.jee-soft.cn/functions" %>
<%@taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=EDGE">
<link rel="shortcut icon" href="${ctx}/favicon.ico" type="image/x-icon" />
<!-- css -->
<f:link href="base.css"></f:link>
<f:link href="bootstrap.min.css"></f:link>
<link rel="stylesheet" href="${ctx}/js/lib/easyui/themes/bootstrap/easyui.css">
<f:link href="font-awesome.min.css"></f:link>
<f:link href="jquery.qtip.css"></f:link>
<link rel="stylesheet" href="${ctx}/js/lib/select2/css/select2.min.css"></link>

<f:link href="form.css"></f:link>

<!-- js -->
<script type="text/javascript">
var __ctx='${ctx}';
var __basePath = '<%=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+ request.getContextPath()%>';
<%
String domain=PropertyUtil.getProperty("basedomain");
if(StringUtil.isNotEmpty(domain)){
	out.print("document.domain=\""+domain+"\";");
}

Map map = RequestUtil.getParameterValueMap(request, true, false);
map.remove("formHtml");
Object json = JSON.toJSON(map);
%>
var __param=<%=json%>;
var __nodeId = '${nodeId}';
</script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.PrintArea.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/easyui/lang/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.base64.js"></script>

 
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.qtip.min.js" ></script>
<script type="text/javascript" src="${ctx}/js/common/base/jquery.easyui.topCall.js"></script>
<script type="text/javascript" src="${ctx}/js/common/base/jquery.easyui.package.js"></script>

<script type="text/javascript" src="${ctx}/js/lib/select2/js/select2.full.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/select2/js/i18n/zh-CN.js"></script>
 
<script type="text/javascript" src="${ctx}/js/lib/angular/angular.min.js"></script>

<script type="text/javascript" src="${ctx}/js/lib/jquery/bootstrap.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/util.js"></script>

<script type="text/javascript" src="${ctx}/js/common/service/BaseService.js"></script>
<script type="text/javascript" src="${ctx}/js/common/customform/FormDirective.js"></script> 
<script type="text/javascript" src="${ctx}/js/common/customform/directiveTpl.js"></script> 
<script type="text/javascript" src="${ctx}/js/common/service/FormService.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/bpm/service/bpmService.js"></script>
<script type="text/javascript" src="${ctx}/js/common/base/customValid.js"></script>
<script type="text/javascript" src="${ctx}/js/common/form/form.js"></script>

<script type="text/javascript" src="${ctx}/js/platform/util/customUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/system/dialog/uploadDialog.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/util/Dialogs.js"></script>

<script type="text/javascript" src="${ctx}/js/platform/form/officeControl.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/form/officePlugin.js"></script>

<script type="text/javascript" src="${ctx}/js/common/form/CustFormHelper.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/util/rightsUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/dialogUtil.js"></script>




<script type="text/javascript">
	window.UEDITOR_HOME_URL = "${ctx}/js/lib/ueditor/";
	__currentUserId ='<%=ContextUtil.getCurrentUserId()%>';
	__currentUserName ='<%=ContextUtil.getCurrentUser().getFullname()%>';
</script>

<script type="text/javascript" charset="utf-8" src="${ctx}/js/platform/bpm/def/bpmdef.udeitor.config.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx}/js/lib/ueditor/ueditor.all.min.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx}/js/lib/ueditor/lang/zh-cn/zh-cn.js"></script>
<script type="text/javascript" charset="utf-8" src="${ctx}/js/lib/ueditor/plugins/picture.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jqGrid/jquery.peity.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/layer/layer.js"></script>
