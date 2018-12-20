<%@taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="f"   uri="http://www.jee-soft.cn/functions" %>
<%@taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta http-equiv="X-UA-Compatible" content="IE=8; IE=9; IE=EDGE;">
<link rel="icon" href="${ctx}/favicon.ico" type="image/x-icon" />
<!-- css -->
<f:link href="bootstrap.min.css"></f:link>
<link rel="stylesheet" href="${ctx}/js/lib/easyui/themes/bootstrap/easyui.css">
<f:link href="font-awesome.min.css"></f:link>
<f:link href="jquery.qtip.css"></f:link>
 
<f:link href="base.css"></f:link>
<f:link href="list.css"></f:link>
<f:link href="rowOps.css"></f:link>
<f:link href="ht.datagrid.css"></f:link>
<!-- js -->
<script type="text/javascript">
var __ctx='${ctx}';
</script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/easyui/lang/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.form.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.qtip.min.js" ></script>
<script type="text/javascript" src="${ctx}/js/common/base/jquery.easyui.topCall.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/angular/angular.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/angular/animate.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/bpm/service/component.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/angular/loading-bar.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/moment.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/bootstrap.min.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/My97DatePicker/WdatePicker.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.base64.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/util.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/base/linkButtons.js"></script>
  <script type="text/javascript" src="${ctx}/js/common/base/customFormValid.js"></script>

<script type="text/javascript" src="${ctx}/js/common/service/BaseService.js"></script>

 
<script type="text/javascript" src="${ctx}/js/common/form/form.js"></script>
<script type="text/javascript" src="${ctx}/js/common/util/json2.js"></script>
<!-- grid -->
<script type="text/javascript" src="${ctx}/js/common/base/jquery.common.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/base/jquery.rowOps.js"></script>
<script type="text/javascript" src="${ctx}/js/common/base/jquery.easyui.package.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/base/jquery.easyui.adapt.js"></script>
<!-- datagrid end-->


<!--[if lte IE 8]>
<script type="text/javascript" src="${ctx}/js/ie/es5-shim.min.js"></script>
<script type="text/javascript" src="${ctx}/js/ie/es5-sham.min.js"></script>
<script type="text/javascript" src="${ctx}/js/ie/respond.min.js"></script>
<![endif]-->