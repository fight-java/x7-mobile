<!-- 规则模板 -->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div style="display:none;"> 
		<input id="normal-input" class="short-input" name="judgeValue" type="text" />
		<select id="judgeCon-1" name="judgeCondition">
			<option value="==">等于</option>
			<option value="!=">不等于</option>
			<option value=">">大于</option>
			<option value="&lt;">小于</option>
			<option value=">=">大于等于</option>
			<option value="&lt;=">小于等于</option>
		</select>
		<select id="judgeCon-2" name="judgeCondition">
			<option value="equals()">完全等于</option>
			<option value="!=">不等于</option>
			<option value="equalsIgnoreCase()">等于(忽略大小写)</option>
			<option value="contains()">包含</option>
			<option value="notContains()">不包含</option>
		</select>
		<select id="judgeCon-4" name="judgeCondition">
			<option value="equals()">等于</option>
			<option value="!=">不等于</option>
			<option value="contains()">包含</option>
			<option value="notContains()">不包含</option>
		</select>
		<select id="judgeCon-5" name="judgeCondition">
			<option value="contains()">包含</option>
			<option value="notContains()">不包含</option>
		</select>
		<input id="date-input" type="text" class="Wdate" />
		<div id="role-div">
			<input type="hidden" value="">
			<input type="text" readonly="readonly" />
			<a href="javascript:;" class="link role">选择</a>
		</div>
		<div id="position-div">
			<input type="hidden" value="">
			<input type="text" readonly="readonly" />
			<a href="javascript:;" class="link position">选择</a>
		</div>
		<div id="org-div">
			<input type="hidden" value="">
			<input type="text" readonly="readonly" />
			<a href="javascript:;" class="link org">选择</a>
		</div>
		<div id="user-div">
			<input type="hidden" value="">
			<input type="text" readonly="readonly" />
			<a href="javascript:;" class="link users">选择</a>
		</div>
		<input type="text" name="paramValue" id="paramValue" class="left margin-set"  onchange="validateVal(this)"/>
		<!-- 属性模板 -->
		<select id="paramKey" name="paramKey" class="left margin-set" onchange="changeCondition(this)">
			<c:forEach items="${attributeList}" var="attr"> 
				<option title="${attr.dataType}" sorceType="" value="${attr.attrKey}">${attr.name}</option>
			</c:forEach>
		</select>
		<!--选择框 为复制克隆-->
		<c:forEach items="${attributeList}" var="attribute"> 
		<div  id="${attribute.attrKey}">
		<c:choose>
		<c:when test="${attribute.dataType eq 'TEXT'}">
		<c:choose>
		<c:when test="${attribute.sourceType eq 'select'}">
			<select onchange="validateVal(this)" name="paramValue" class="left margin-set">
				<c:forEach items="${attribute.keyValues}" var="keyValue">
				<option value="${keyValue.key}" text="${keyValue.value}">${keyValue.value}</option>
				</c:forEach>
			</select>
		</c:when>
		<c:when test="${attribute.sourceType eq 'dict'}"> 
			<select onchange="validateVal(this)" name="paramValue" class="left margin-set">
				<c:forEach items="${attribute.keyValues}" var="keyValue">
				<option value="${keyValue.key}" text="${keyValue.value}">${keyValue.value}</option>
				</c:forEach>
			</select>
		</c:when> 
		
		<c:when test="${attribute.sourceType eq 'checkbox'}">
		<c:forEach items="${attribute.keyValues}" var="keyValue">
		<input  name="paramValue" class=" left margin-set" type="checkbox" name="textVal"  value="${keyValue.key}" text="${keyValue.value}"><label class="left margin-set" >${keyValue.value}</label>
		</c:forEach> 
		</c:when> 
		
		<c:when test="${attribute.sourceType eq 'radio'}">
		<c:forEach items="${attribute.keyValues}" var="keyValue">
		<input type="radio"  name="paramValue" class=" left margin-set" value="${keyValue.key}" text="${keyValue.value}"> <label class="left margin-set" >${keyValue.value}</label> 
		</c:forEach>
		</c:when> 
		
		<c:otherwise>
		 <input type="text"  name="paramValue" class="left margin-set"/>
		</c:otherwise>
		</c:choose>
		</c:when>
		<c:when test="${attribute.dataType eq 'DATE'}"> 
		<input type="text" name="paramValue" class="left margin-set" onchange="validateVal(this)"/>
		</c:when>
		<c:when test="${attribute.dataType eq 'LONG'}">
		<input type="text" name="paramValue" class="left margin-set"  onchange="validateVal(this)"/>
		</c:when>
		<c:when test="${attribute.dataType eq 'DOUBLE'}">
		<input type="text"  name="paramValue" class="left margin-set" onchange="validateVal(this)"/>
		</c:when>
		</c:choose>
		</div> 
		</c:forEach>	
		 
		<select id="paramCondition" name="paramCondition" class="left margin-set">
			<option value="=">=</option>
			<option value="!=">!=</option>
			<option value=">">></option>
			<option value="<"><</option>
			<option value=">=">>=</option>
			<option value="<="><=</option>
		</select>
		
		<input type="text" id="paramValue" name="paramValue" class="left margin-set" onchange="validateVal(this)"/>
		
		<div >
			<table id="condition-script-rule">
				<tr class="script-tr">
					<td>
						<input name="pk" type="checkbox" />
					</td>
					<td>
						条件脚本
					</td>
					<td name="conComType">
						<select name="comTypeSelect">
							<option value='0'>或</option>
							<option value='1'>与</option>
						</select>
					</td>
					<td>
						<a name="script" href="javascript:;" onclick="editConditionScript(this)">脚本</a>
					</td>
				</tr>
			</table>
		</div>
</div>	