<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="f" uri="http://www.jee-soft.cn/functions" %>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

	<!-- bootstrap-->
	<link rel="stylesheet" type="text/css" href="${ctx}/css/bootstrap.min.css"></link>
	<link rel="stylesheet" type="text/css" href="${ctx}/css/bootstrap-dialog.min.css"></link>
	
    <link rel="stylesheet" type="text/css" href="${ctx}/css/layoutIndex.css"></link>
	<!-- <link href="/css/layoutIndex.css"></link>  -->
	<script type="text/javascript" src="${ctx}/js/dynamic.jsp"></script>
    <script type="text/javascript" src="${ctx}/js/hotent/index/moment.min.js"></script>
    <%-- <script type="text/javascript" src="${ctx}/js/hotent/index/jquery-ui.min.js"></script> --%>
	<!--[if !IE]> -->
	<script type="text/javascript">
		window.jQuery || document.write("<script src='${ctx}/js/hotent/index/jquery.min.js'>"+"<"+"/script>");
	</script>
	<!-- <![endif]-->
	<!--[if IE]>
	<script type="text/javascript">
		 window.jQuery || document.write("<script src='${ctx}/js/bootstrap/jquery1x.min.js'>"+"<"+"/script>");
	</script>
	<![endif]-->
  	<script type="text/javascript" src="${ctx}/js/hotent/index/jquery.easypiechart.min.js"></script>
  	<script type="text/javascript" src="${ctx}/js/hotent/index/jquery.sparkline.min.js"></script>
  	<script type="text/javascript" src="${ctx}/js/lib/jquery/jquery.base64.js"></script>
	 <script type="text/javascript" src="${ctx}/js/hotent/index/fullcalendar.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/hotent/index/zh_CN.js"></script>
	<script type="text/javascript" src="${ctx }/js/hotent/index/bootstrap.min.js"></script>
	<!--[if lte IE 8]>
		<script type="text/javascript" src="${ctx}/js/bootstrap/html5shiv.min.js"></script>
		<script type="text/javascript" src="${ctx}/js/bootstrap/respond.min.js"></script>
	<![endif]-->
	<script type="text/javascript" src="${ctx}/js/hotent/index/bootstrap-dialog.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/hotent/index/jquery.slimscroll.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/hotent/index/jquery.blockUI.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/hotent/index/jquery.carouFredSel.min.js"></script>
	<script type="text/javascript" src="${ctx}/js/echarts/echarts.js"></script>
		 <!-- BEGIN LayerSlider -->
	<link rel="stylesheet" type="text/css" href="${ctx}/css/layerslider.css">
	<link  rel="stylesheet" type="text/css" href="${ctx}/css/style-layer-slider.css">
	
    <script src="${ctx}/js/hotent/index/greensock.js" type="text/javascript"></script>
    <script src="${ctx}/js/hotent/index/layerslider.transitions.js" type="text/javascript"></script>
    <script src="${ctx}/js/hotent/index/layerslider.kreaturamedia.jquery.js" type="text/javascript"></script>
    <!-- END LayerSlider -->
    	<script type="text/javascript" src="${ctx}/js/common/util/util.js"></script>
    	<script type="text/javascript" src="${ctx}/js/hotent/index/util.js"></script>
	<script type="text/javascript" src="${ctx}/js/hotent/index/indexPage.js"></script>
	
	<style>
		.open-message{
			background: url(${ctx}/commons/image/msg_none.png) no-repeat 0px -1px;
			padding:2px 0 2px 20px;
		}
		
		.close-message{
			background: url(${ctx}/commons/image/msg_own.png) no-repeat 0px -1px;
			padding:2px 0 2px 20px;
		}
		.modal-dialog{
			z-index: 1043
		}
	</style>
  	<script type="text/javascript">
		function setHasRead(obj){
			$(obj).find(".message").removeClass("close-message").addClass("open-message");
		}
	</script>


	
	