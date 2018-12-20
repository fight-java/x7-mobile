<%@page import="com.hotent.base.core.web.RequestUtil"%>
<%@page import="com.alibaba.fastjson.JSON"%>
<%@page import="java.util.Map"%>
<%@taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="f"   uri="http://www.jee-soft.cn/functions" %>
<%@taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=EDGE">

<script type="text/javascript">
var __ctx='${ctx}';
<%
Map map = RequestUtil.getParameterValueMap(request, true, false);
Object json = JSON.toJSON(map);
%>
var __param=<%=json%>;
</script>

<link rel="stylesheet" href="${ctx}/mobile/assets/css/light7.min.css"></link>
<link rel="stylesheet" href="${ctx}/mobile/assets/css/light7-swiper.min.css"></link>
<link rel="stylesheet" href="${ctx}/mobile/assets/css/font-awesome.min.css"></link>
<link rel="stylesheet" href="${ctx}/mobile/assets/css/mobile.css"></link>
<link rel="stylesheet" href="${ctx}/mobile/assets/css/style.css"></link>
<script type="text/javascript" src="${ctx}/mobile/assets/js/jquery.min.js"></script>
<script type="text/javascript" src="${ctx}/mobile/assets/js/light7.min.js"></script>
<script type="text/javascript" src="${ctx}/mobile/assets/js/light7-swiper.min.js"></script>
<script type="text/javascript" src="${ctx}/mobile/assets/js/angular.js"></script>
<script type="text/javascript" src="${ctx}/mobile/assets/js/BaseService.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/system/customQuery/customQueryService.js"></script>
<script type="text/javascript" src="${ctx}/mobile/assets/js/mobileDirective.js"></script>
<script type="text/javascript" src="${ctx}/mobile/assets/js/plugin/custFormHelper.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/util/customUtil.js"></script>
<script type="text/javascript" src="${ctx}/mobile/assets/js/WxUtil.js"></script>
<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.blockUI.min.js"></script>
<script type="text/javascript" src="${ctx}/js/hotent/index/jquery.slimscroll.min.js"></script>
<script type="text/javascript" src="${ctx}/js/echarts/echarts.js"></script>
<script type="text/javascript" src="${ctx}/js/hotent/index/indexPage.js"></script>
