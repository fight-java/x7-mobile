<%@page import="com.hotent.base.core.web.RequestUtil"%>
<%@page import="com.alibaba.fastjson.JSON"%>
<%@page import="java.util.Map"%>
<%@taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="f"   uri="http://www.jee-soft.cn/functions" %>
<%@taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=EDGE">
<link rel="icon" href="${ctx}/favicon.ico" type="image/x-icon" />
<!-- css -->
<f:link href="bootstrap.min.css"></f:link>
<link rel="stylesheet" href="${ctx}/js/lib/easyui/themes/bootstrap/easyui.css">
<f:link href="font-awesome.min.css"></f:link>
<f:link href="jquery.qtip.css"></f:link>
<f:link href="base.css"></f:link>
<f:link href="edit.css"></f:link>
<!-- js -->
<script type="text/javascript">
var __ctx='${ctx}';
<%
Map map = RequestUtil.getParameterValueMap(request, true, false);
Object json = JSON.toJSON(map);
%>
var __param=<%=json%>;
</script>

<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/easyui/lang/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.form.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.qtip.min.js" ></script>
<script type="text/javascript" src="${ctx}/js/common/base/jquery.easyui.topCall.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/angular/angular.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/bootstrap.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.base64.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/util.js"></script>
<script type="text/javascript" src="${ctx}/js/common/form/form.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/json2.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/dialogUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/common/base/jquery.easyui.package.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/util/customUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/common/service/BaseService.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/chineseToPinyin.js"></script>
<script type="text/javascript" src="${ctx}/js/common/service/FormService.js"></script>
<script type="text/javascript" src="${ctx}/js/common/form/FormDirective.js"></script>
<script type="text/javascript" src="${ctx}/js/common/customform/directiveTpl.js"></script> 
<script type="text/javascript" src="${ctx}/js/common/base/customValid.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/base/linkButtons.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/system/dialog/uploadDialog.js"></script>
