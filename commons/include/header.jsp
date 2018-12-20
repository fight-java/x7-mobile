<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>

<style>
    ul.navmenu li {display: inline;}
</style>

<div>
    <li class="logo">
        <a href="javascript:;">
            <h1>广州宏天软件</h1>
        </a>
    </li>
</div>
    <div class="hearder-menu">
        <ul class="navmenu">
        	<li class="dropdown" ng-repeat="topMenu in userRes">
        		<a class="menuItem {{topMenu.active}}" ng-click="topClick(topMenu)" title="{{topMenu.name}}" href="javascript:void(0)" >
        			<i><span class="icon {{topMenu.icon ||'personal'}}"></span></i>
        			{{topMenu.name}}
        		</a>
        	</li>
        </ul>
    </div>
    <ul class="navmenu-right welcome_panel"> 
        <li>
        	<a href="javascript:void(0)" id="mb" class="easyui-menubutton"  data-options="menu:'#setting',iconCls:'fa fa-user'">${currentUser.fullname}</a>
			<div id="setting" style="width:60px;">
				<div data-options="iconCls:'fa fa-sign-out'" onclick="loginOut()">退出系统</div>
				<c:if test="${not empty cookie.origSwitch}">
		       		<div data-options="iconCls:'fa fa-reply'" >
						<a href="${ctx}/j_spring_security_exit_user?j_username=${cookie.origSwitch.value}" class="btn btn-xs">退出切换用户</a>
					</div>
	        	</c:if>
				<div class="menu-sep"></div>
			    <div data-options="iconCls:'fa fa-detail'" onclick="userInfo()">查看个人信息</div>
			    <div data-options="iconCls:'fa fa-edit'" onclick="editUserInfo()">修改个人信息</div>
			    <div data-options="iconCls:'fa fa-key'" onclick="editPassworld()">修改密码</div>
			    <div class="menu-sep"></div>
				<div data-options="iconCls:'fa fa-server'">
					<span>系统切换</span>
						<div >
						<div data-options="iconCls:'fa fa-check'" style="cursor:not-allowed;"><span>${currentSystem.name}</span></div>
							<c:forEach items="${subsystemList}" var="system">
								<c:if test="${!(system.id eq currentSystem.id)}">
					                <div onclick="changeSystem('${system.id}')" >
					                	<a  href="javascript:void(0);" class="btn btn-xs" title="切换系统">${system.name}</a>
					                </div>
					         	</c:if>
							</c:forEach>
			            </div>
				</div>
				<div data-options="iconCls:'fa fa-server'">
						<span>组织切换</span>
						<div>
							<div data-options="iconCls:'fa fa-check'"><span>${currentOrg.name}</span></div>
							<c:forEach items="${orgList}" var="org">
								<c:if test="${!(org.id eq currentOrg.id)}">
					                <div onclick="changeOrg('${org.id}')">
					                	<a  href="javascript:void(0);" class="btn btn-xs"  title="切换组织">${org.name}</a>
					                </div>
						         </c:if>
							</c:forEach>
			            </div>
				</div>
				<div data-options="iconCls:'fa fa-server'">
						<span>切换皮肤</span>
						<div>
			                <div onclick="changeSkin('blue')">
			                	<a  href="javascript:void(0);" class="btn btn-xs"  title="切换皮肤">蓝色</a>
			                </div>
			                <div onclick="changeSkin('default')">
			                	<a  href="javascript:void(0);" class="btn btn-xs"  title="切换皮肤">红色</a>
			                </div>
			                <div onclick="changeSkin('green')" >
			                	<a  href="javascript:void(0);" class="btn btn-xs"  title="切换皮肤">绿色</a>
			                </div>
			            </div>
				</div>
				<div data-options="iconCls:'fa fa-server'">
						<span>切换布局</span>
						<div>
							<div data-options="iconCls:'fa fa-check'">
								<c:if test="${flagUserSetting}">
									<span>我的布局</span>
					 			 </c:if>
					  		</div>
					  		<c:forEach items="${layoutManageList}" var="layout">
									<c:if test="${(layout.id eq userSetting.layoutId)}">
						                <span>${layout.name}</span>
						         	</c:if>
									<c:if test="${!(layout.id eq userSetting.layoutId)}">
						                <div onclick="changeLayout('${layout.id}')">
					                		<a  href="javascript:void(0);" class="btn btn-xs"  title="切换布局">${layout.name}</a>
					                	</div>
						         	</c:if>
							  </c:forEach>
			            </div>
				</div>
				<div data-options="iconCls:'fa fa-server'">
						<span>切换风格</span>
						<div>
			                <div onclick="changeStyle('default')">
			                	<a  href="javascript:void(0);" class="btn btn-xs"  title="切换风格">默认风格</a>
			                </div>
			                <div onclick="changeStyle('portal')">
			                	<a  href="javascript:void(0);" class="btn btn-xs"  title="切换风格">门户风格</a>
			                </div>
			                <div onclick="changeStyle('other')" >
			                	<a  href="javascript:void(0);" class="btn btn-xs"  title="切换风格">其他风格</a>
			                </div>
			            </div>
				</div>
				<div data-options="iconCls:'fa fa-server'">
						<span>组织切换</span>
						<div>
							<div data-options="iconCls:'fa fa-check'"><span>${currentOrg.name}</span></div>
							<c:forEach items="${orgList}" var="org">
								<c:if test="${!(org.id eq currentOrg.id)}">
					                <div>
					                	<a  href="javascript:void(0);" class="btn btn-xs" onclick="changeOrg('${org.id}')" title="切换组织">${org.name}</a>
					                </div>
						         </c:if>
							</c:forEach>
			            </div>
				</div>
				<div data-options="iconCls:'fa fa-cog'">版本号：${sysVersion}</div>
			</div>
		</li>
    </ul>