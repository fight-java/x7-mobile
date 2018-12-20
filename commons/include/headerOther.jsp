<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="f" uri="http://www.jee-soft.cn/functions" %>

<style>
    ul.navmenu li {display: inline;}
</style>

<section class="bg-header">
	<div>
		<li class="logo">
			<a href="javascript:;">
				<h1>综合信息门户系统</h1>
			</a>
		</li>
	</div>

	<div class="hearder-menu" style="display: none;">
		<ul class="navmenu">
			<li class="dropdown" ng-repeat="topMenu in userRes">
				<a class="menuItem {{topMenu.active}}" ng-click="topClick(topMenu)" title="{{topMenu.name}}" href="javascript:void(0)" >
					<i><span class="icon {{topMenu.icon ||'personal'}}"></span></i>
					{{topMenu.name}}
				</a>
			</li>
		</ul>
	</div>

	<!-- poly 通知与管理员 -->
	<ul class="header__menu">
		<li class="header__menu--li menuLiBg--email" style="display: none;">
			<div class="menu--li__msg">6</div>
		</li>
		<li class="header__menu--li menuLiBg--tixing" style="display: none;">
			<div class="menu--li__msg">6</div>
		</li>
		<li class="header__menu--li menuLiBg--logout menuLiBorder--right" onclick="loginOut()"></li>
		<li class="header__menu--li" style="width: auto;min-width: 200px;">
			<div class="menuLiBg--header"></div>
			<div class="menuLi--user">
				<%--<p class="p">阿三</p>
				<p class="p">集团账号</p>--%>
				<a href="javascript:void(0)" class="easyui-menubutton" data-options="menu:'#mh-headerMenu',iconCls:''" data-name="mh-header-menu">${currentUser.fullname}</a>
				<div id="mh-headerMenu" style="width:60px;" class="easyui-menu" data-name="mh-menu">
					<div data-options="iconCls:'fa fa-sign-out'" data-name="mh-menu-item" onclick="loginOut()">退出系统</div>
					<c:if test="${not empty cookie.origSwitch}">
						<div data-options="iconCls:'fa fa-reply'" data-name="mh-menu-item">
							<a href="${ctx}/j_spring_security_exit_user?j_username=${cookie.origSwitch.value}" class="btn btn-xs">退出切换用户</a>
						</div>
					</c:if>
					<%--<div class="menu-sep"></div>--%>
					<div data-options="iconCls:'fa fa-detail'" data-name="mh-menu-item" onclick="userInfo()">查看个人信息</div>
					<div data-options="iconCls:'fa fa-edit'" data-name="mh-menu-item" onclick="editUserInfo()" style="display: none;">修改个人信息</div>
					<div data-options="iconCls:'fa fa-key'" data-name="mh-menu-item" onclick="editPassworld()" style="display: none;">修改密码</div>
					<%--<div class="menu-sep"></div>--%>
					<div data-options="iconCls:'fa fa-server'" data-name="mh-menu-item">
						<span>系统切换</span>
						<div data-name="mh-menu-item">
							<div data-options="iconCls:'fa fa-check'" data-name="mh-menu-item" style="cursor:not-allowed;"><span>${currentSystem.name}</span></div>
							<c:forEach items="${subsystemList}" var="system">
								<c:if test="${!(system.id eq currentSystem.id)}">
									<div  data-name="mh-menu-item" onclick="changeSystem('${system.id}')" >
										<a  href="#" class="btn btn-xs" title="切换系统">${system.name}</a>
									</div>
								</c:if>
							</c:forEach>
						</div>
					</div>
					<div data-options="iconCls:'fa fa-server'" data-name="mh-menu-item">
						<span>组织切换</span>
						<div data-name="mh-menu-item">
							<div data-options="iconCls:'fa fa-check'" data-name="mh-menu-item"><span>${currentOrg.name}</span></div>
							<c:forEach items="${orgList}" var="org">
								<c:if test="${!(org.id eq currentOrg.id)}">
									<div data-name="mh-menu-item" onclick="changeOrg('${org.id}')" >
										<a  href="#" class="btn btn-xs" title="切换组织">${org.name}</a>
									</div>
								</c:if>
							</c:forEach>
						</div>
					</div>
					<div data-options="iconCls:'fa fa-server'" data-name="mh-menu-item">
						<span>切换皮肤</span>
						<div  data-name="mh-menu-item">
							<div data-name="mh-menu-item" onclick="changeSkin('blue')" >
								<a href="#" class="btn btn-xs" title="切换皮肤">蓝色</a>
							</div>
							<div data-name="mh-menu-item" onclick="changeSkin('default')" >
								<a href="#" class="btn btn-xs" title="切换皮肤">红色</a>
							</div>
							<div data-name="mh-menu-item" onclick="changeSkin('green')" >
								<a href="#" class="btn btn-xs" title="切换皮肤">绿色</a>
							</div>
						</div>
					</div>
					<div data-options="iconCls:'fa fa-server'" data-name="mh-menu-item">
						<span>布局切换</span>
						<div  data-name="mh-menu-item">
							<c:forEach items="${layoutManageList}" var="layout">
								<c:if test="${layout.id eq userSetting.layoutId}">
									<div data-options="iconCls:'fa fa-check'" data-name="mh-menu-item" style="cursor:not-allowed;">
										<span>${layout.name}</span>
									</div>
								</c:if>
							</c:forEach>
							<c:forEach items="${layoutManageList}" var="layout">
								<c:if test="${!(layout.id eq userSetting.layoutId)}">
									<div data-name="mh-menu-item" onclick="changeLayout('${layout.id}')" >
										<a href="#" class="btn btn-xs" title="切换布局">${layout.name}</a>
									</div>
								</c:if>
							</c:forEach>
						</div>
					</div>
					<div data-options="iconCls:'fa fa-server'" data-name="mh-menu-item">
						<span>切换风格</span>
						<div  data-name="mh-menu-item">
							<div data-name="mh-menu-item" onclick="changeStyle('default')" >
								<a href="#" class="btn btn-xs" title="切换风格">默认风格</a>
							</div>
							<div data-name="mh-menu-item" onclick="changeStyle('portal')" >
								<a href="#" class="btn btn-xs" title="切换风格">门户风格</a>
							</div>
							<div data-name="mh-menu-item" onclick="changeStyle('other')" >
								<a href="#" class="btn btn-xs" title="切换风格">其他风格</a>
							</div>
						</div>
					</div>
					<div data-options="iconCls:'fa fa-cog'" data-name="mh-menu-item">版本号：${sysVersion}</div>
				</div>
			</div>
		</li>
	</ul>
</section>

<!-- TODO: 保利的头部开始 -->
<div style="clear: both;"></div>

<!-- TODO: 将左侧菜单改为下拉子菜单 -->
<script id="myRecursion" type="text/ng-template">
	<div ng-repeat="item in thisMenu" ng-init="outerIndex = $index" name="data-add-tab" data-name="mh-menu-item">
		<span ng-click="menuClick(item)" data-default-url="{{item.defaultUrl}}" data-name="{{item.name}}" data-closable="{{item.closable}}" data-icon="{{item.icon}}">{{item.name}}</span>
		<div ng-if="item.children.length" ng-init="thisMenu=item.children" ng-include="'myRecursion'" data-name="mh-menu-item"></div>
	</div>
</script>

<ul class="mh-mainMenu" style="display: block;" id="mh-mainMenu">
	<li class="mh-mainMenu__li" ng-repeat="topMenu in userRes">
		<a href="javascript:;" class="mh-mainMenu__li--a easyui-menubutton" data-options="menu:'\#{{topMenu.alias}}',iconCls:''" ng-click="topClick(topMenu)">{{topMenu.name}}</a>
		<div id="{{topMenu.alias}}" data-name="mh-menu" ng-if="topMenu.children.length" ng-include="'myRecursion'" ng-init="thisMenu=topMenu.children" class="easyui-menu">
			<!-- 子菜单 -->
		</div>
	</li>
</ul>
<!-- TODO: 保利的头部end -->



