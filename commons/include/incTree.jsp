<%@page import="com.hotent.sys.constants.CategoryConstants" pageEncoding="UTF-8"%>
<link rel="stylesheet" href="${ctx}/js/lib/ztree/css/zTreeStyle.css">
<script type="text/javascript" src="${ctx}/js/lib/ztree/jquery.ztree.all.min.js"></script>
<script type="text/javascript" src="${ctx}/js/platform/system/sysTypeTree/sysTypeTree.js"></script>


<script type="text/javascript">
//流程类型
var __CAT_FLOW='<%=CategoryConstants.CAT_FLOW.key()%>';

//表单类型
var __CAT_FORM='<%=CategoryConstants.CAT_FORM.key()%>';
//文件类型
var __CAT_FILE='<%=CategoryConstants.CAT_FILE.key()%>';
//附件类型
var __CAT_ATTACH='<%=CategoryConstants.CAT_ATTACH.key()%>';
//字典类型(数据字典)
var __CAT_DIC='<%=CategoryConstants.CAT_DIC.key()%>';
//流程分类
var __CAT_REPORT='<%=CategoryConstants.CAT_REPORT.key()%>';
// 用户关系分类
var __CAT_USER_REL='<%=CategoryConstants.CAT_USER_REL.key()%>';

</script>


