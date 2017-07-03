var data = '';
var gridData = [];
$(function() {
	//文本编辑器  
	ue = UE.getEditor('editor', {
	    autoHeight: false 
	});
	
	//Load operation prompt file
	$('.popup').load('popup.html #modal', function() {
		popupEvent();
	});
	var flag=$('.list').attr('flag');
    $('.leavePop').load('popup.html #leaveTip', function() {
		$('.sureLeave').click(function(){
			flag="true";
		   $('#title').val('');
		   ue.setContent('');  
		   $('#actionSort').show();
		   $('#actionType').show();
	       $('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
		   $(".tabContent .content").eq(0).show().siblings().hide();   
		   frameHeight();
		})
	}); 
	
    $('.list').click(function(){
    	if(flag=="false")
    	{
    		$(this).attr("data-toggle", 'modal');
			$(this).attr("data-target", '#leaveModal');
    	}else
    	{
    		$(this).removeAttr("data-toggle");
			$(this).removeAttr("data-target");
    		return;
    	}
    })

	//搜索事件
	$('.searchBtn').click(function() {
		 var val = $('.functionSort1').children('option:selected').attr('index');
		 getData(index, val);
		 bgColor1(key, pages);
	})
 

	//编辑事件   
	var functionId = '';
	var functionName = '';
	var state = '';
	$('tbody').on('click', '.edit', function() { 
		    flag="false";
			editId = $(this).parents('tr').attr('id');
			lastVer = $(this).parents('tr').attr('lastVer');
			state = $(this).parents('tr').attr('state');
			functionId = $(this).parents('tr').attr('functionId');
			functionName = $(this).parents('tr').attr('functionName');
			$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
			$(".tabContent .content").eq(1).show().siblings().hide();  
			frameHeight();
			if (editId == "") { 
				$.ajax({
						type: "post",
						url: api + "/artVideo/getArtVideoByQuery",
						data: {
							"functionId":functionId
						},
						success: function(res) {
							if (res.success == true) {
								var data = res.model;
								var html = '';
								for (var i = 0; i < data.length; i++) {
									html += '<option value="' + data[i].id + '">' + data[i].title + '</option>';
								}
								$('#choiseVideo').html(html);
							} else {
								alert(res.message);
							}
						}
					});
				$('#actionName').html('<option id="' + functionId + '">' + functionName + '</option>');
				$('#actionSort').hide();
				$('#actionType').hide();
			} else {
				$.ajax({
					type: "get",
					url: api + "/manual/getManualById",
					data: {
						"id": editId
					},
					success: function(res) {
						var data1 = res.model;
						if (res.success == true) {
							$.ajax({
									type: "post",
									url: api + "/artVideo/getArtVideoByQuery",
									data:
									{
										"functionId":functionId
									},
									success: function(res) {
										if (res.success == true) {
											var data = res.model;
											var html = '';
											for (var i = 0; i < data.length; i++) {
												html += '<option value="' + data[i].id + '">' + data[i].title + '</option>';
											}
											$('#choiseVideo').html(html);
											if(data1.videoId!=null){
                                                $('#choiseVideo').val(data1.videoId);
                                            }else{
                                                $('#choiseVideo').val("");
											}
										} else {
											alert(res.message);
										}
									}
								}); 
							$('#actionSort').hide();
							$('#actionType').hide();
							$('#actionName').html('<option id="' + data1.functionId + '">' + data1.title + '</option>');
							if(data1.article)
							{
								ue.setContent(data1.article);
							} 
						} else {
							alert(res.message);
						}
					}
				});
			}

		})
	
	//店铺类型 
	var type0 = $('.shopType').eq(0).val();
	var type1 = $('.shopType').eq(1).val();
	shopType(type0, 0);
	shopType(type1, 1);
	
	$('.shopType').eq(0).change(function() {
		 type0 = $(this).val();
		 shopType(type0, 0);
	})
	
	$('.shopType').eq(1).change(function() {
		 type1 = $(this).val();
		 shopType(type1, 1);
	})

	function shopType(type, n) {
		$.ajax({
			type: "post",
			url: api + "/manual/functionList",
			data: {
				"type": type
			},
			success: function(res) {
				if (res.success == true) {
							data = res.model;
							var sortHtml = '';
							var titleHtml = '<option>全部</option>';
							var i = 0;
							for (i = 0; i < data.length; i++) {
								sortHtml += '<option  index=' + i + ' id=' + data[i].functionKindVo.id + '>' + data[i].functionKindVo.name + '</option>';
							}
							$('.functionSort').eq(n).html(sortHtml);
							if (data.length > 0) {
								for (var j = 0; j < data[0].functionVoList.length; j++) {
									titleHtml += '<option id=' + data[0].functionVoList[j].id + ' parId=' + $('.functionSort1 option:selected').attr('id') + '>' + data[0].functionVoList[j].name + '</option>';
								}
								$('.functionName').eq(n).html(titleHtml);
							}
							if (n == 1) return;
							getData(index, 0);
							bgColor1(key, pages);
				}else 
				{
					alert(res.message);
				}
			}
		});
	}
	
	//功能名称
	$('.functionName1').change(function() {
		var value = $('.functionSort1').children('option:selected').attr('index');
		getData(index, value);
		bgColor1(key, pages);
	})
	
	//状态
	$('.functionState').change(function() {
		var value = $('.functionSort1').children('option:selected').attr('index');
		getData(index, value);
		bgColor1(key, pages);
	})
 

	//功能分类 
	$('.functionSort1').change(function() {
		titleHtml = '<option>全部</option>';
		var value = $(this).children('option:selected').attr('index');
		var len = data[value].functionVoList.length;
		for (var j = 0; j < len; j++) {
			titleHtml += '<option id=' + data[value].functionVoList[j].id + ' parId=' + $('.functionSort1 option:selected').attr('id') + '>' + data[value].functionVoList[j].name + '</option>';
		}
		$('.functionName1').html(titleHtml);
		getData(index, value);
		bgColor1(key, pages);
	})

	$('.functionSort2').change(function() {
		titleHtml = '';
		var val = $(this).children('option:selected').attr('index');
		var len = data[val].functionVoList.length;
		for (var j = 0; j < len; j++) {
			titleHtml += '<option id=' + data[val].functionVoList[j].id + ' parId=' + $('.functionSort2 option:selected').attr('id') + '>' + data[val].functionVoList[j].name + '</option>';
		}
		$('.functionName2').html(titleHtml);
	})
	
	
	//保存事件 
	$('.save').click(function() {
		if (state == "2") {
			$(this).attr("data-toggle", 'modal');
			$(this).attr("data-target", '#saveModal');
		} else {
			$(this).removeAttr('data-toggle');
			$(this).removeAttr('data-target');
			addModel("1");
			ue.setContent("");
		}
	})

	//发布之后编辑保存事件
	$('.yes').click(function() {
		addModel("1");
		ue.setContent("");
	})

})
var deleteId = '';
var releaseId = '';
var revokeId = '';
var editId = '';
var lastVer = '';

function popupEvent() {
	//弹窗中的确定事件
	$('.sure').click(function() {
		if (deleteId != '') {
			$.ajax({
				type: "post",
				url: api + "/manual/deleteManual",
				data: {
					"id": deleteId
				},
				success: function(res) {
					if (res.success == true) {
						var val = $('.functionSort1').children('option:selected').attr('index');
						getData(index, val);
						bgColor1(key, pages);
						deleteId = '';
					} else {
						alert(res.message);
					}
				}
			});
		} else if (releaseId != '') {
			updateModelState("2", releaseId, $('#' + releaseId).attr('lastVer'));
			releaseId = '';
		} else if (revokeId != '') {
			updateModelState("3", revokeId, $('#' + revokeId).attr('lastVer'));
			revokeId = '';
		} else {
			addModel("2");
		}

	})
}
//更新操作指南状态
function updateModelState(state, id, lastVer) {
	$.ajax({
		type: "get",
		url: api + "/manual/updateManualState",
		data: {
			"id": id,
			"state": state,
			"lastVer": lastVer
		},
		success: function(res) {
			if (res.success == true) {
				var val = $('.functionSort1').children('option:selected').attr('index');
				getData(index, val);
				bgColor1(key, pages);
			} else {
				alert(res.message);
			}
		}
	});
}
//添加或更新操作指南
function addModel(state) {
	var title = $("#actionName").val();
	var functionId = $('#actionName option:selected').attr('id');
	var videoId = $('#choiseVideo').val();
	var article = ue.getContent();
	if (functionId == '' || functionId == undefined) {
		alert("功能标题未选择");
		return;
	};
	if (editId == '') {
		$.ajax({
			type: "post",
			url: api + "/manual/addManual",
			data: {
				"title": title,
				"article": article,
				"functionId": functionId,
				"videoId": videoId,
				"state": state
			},
			success: function(res) {
				if (res.success == true) {
					$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
					$(".tabContent .content").eq(0).show().siblings().hide(); 
					frameHeight();
					var val = $('.functionSort1').children('option:selected').attr('index');
					getData(index, val);
					bgColor1(key, pages);
				} else {
					alert(res.message);
				}
			}
		});
	} else {
		$.ajax({
			type: "post",
			url: api + "/manual/updateManual",
			data: {
				"title": title,
				"article": article,
				"functionId": functionId,
				"videoId": videoId,
				"state": state,
				"lastVer": lastVer,
				"id": editId
			},
			success: function(res) {
				if (res.success == true) {
					$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
					$(".tabContent .content").eq(0).show().siblings().hide(); 
					frameHeight();
					editId = '';
					var val = $('.functionSort1').children('option:selected').attr('index');
					getData(index, val);
					bgColor1(key, pages);
					$('#actionSort').show();
					$('#actionType').show();
				} else {
					alert(res.message);
				}
			}
		});
	}

}


//数据列表加载
var index = 1; //当前页
var key = 1; //存储当前页 
var pageSize = 10; //每页显示数据条数
var pages; //总共有多少页
function getData(index, val) {
	var functionId = "";
	var title = $('#searchText').val();
	var state = $('.functionState').val() == "0" ? "" : $('.functionState').val();
	var ids = [];
	var functionIds = '';
	if ($('.functionName1').val() == "全部") {
		var selectlen = $('.functionName1').children().length;
		for (var i = 0; i < selectlen; i++) {
			ids.push($('.functionName1 option').eq(i).attr('id'));
		}
		ids.splice(0, 1);
		functionIds = ids.join(',');
	} else {
		functionId = $('.functionName1 option:selected').attr('id');
	}
	key = index;
	var length;
	$.ajax({
		type: "post",
		url: api + "/manual/list",
		data: {
			"pageSize": data[val].functionVoList.length,
			"pageIndex": 1,
			"functionId": functionId,
			"state": state,
			"title": title,
			"functionIds": functionIds
		},
		success: function(res) {
			if (res.success == true) {
				var data1 = res.models;
				var html = '';
				var sort = '';
				var state = '';
				var lastVer = '';
				var functionVoList = data[val].functionVoList;
				var functionKindVo = data[val].functionKindVo;
				sort = functionKindVo.name;
				var length = 0;
				var status;
				var id = '';
				var showData = [];
				gridData=[];
				for (var j = 0; j < data[val].functionVoList.length; j++) {
					var item = {};
					item.functionId = data[val].functionVoList[j].id;
					item.name = data[val].functionVoList[j].name;
					item.state = 0;
					gridData.push(item);
				}
				for (var i = 0; i < gridData.length; i++) {
					var show = false;
					//title过滤
					if (title != null && title != "") {
						if (gridData[i].name.indexOf(title) != -1) {
							show = true;
						} else {
							show = false
							continue;
						}
					}
					//过滤功能
					if ($('.functionName1').val() == "全部") {
						show = true;
					} else if ($('.functionName1 option:selected').attr("id") == gridData[i].functionId) {
						show = true;
					} else {
						show = false;
						continue;
					}

					var exist = false;
					//过滤状态
					for (var j = 0; j < data1.length; j++) {
						if (gridData[i].functionId == data1[j].functionId) {
							exist = true;
							gridData[i].state = data1[j].state;
							gridData[i].id = data1[j].id;
							gridData[i].lastVer = data1[j].lastVer;
							if ($('.functionState').val() == "0") {
								show = false;
							} else if ($('.functionState').val() == "") {
								show = true;
							} else if ($('.functionState').val() == data1[j].state) {
								show = true;
							} else {
								show = false;
								continue;
							}
							break;
						}
					}
					//如果不是显示全部且不是未添加，则需要和查询的匹配才能显示
					if ($('.functionState').val() != "" && $('.functionState').val() != "0") {
						if (!exist) {
							show = false;
						}
					}
					if (show) {
						showData.push(gridData[i]);
						length = showData.length;
					}
				}

				for (var i = (index - 1) * 10; i < (index) * 10; i++) {
					if (i < showData.length) {
						var state = showData[i].state;
						html += '<tr state="' + state + '" id="' + (showData[i].id != null ? showData[i].id : "") + '" lastVer="' + (showData[i].lastVer != null ? showData[i].lastVer : "") +
							'" functionId=' + showData[i].functionId + ' functionName=' + showData[i].name + ' state="' + state + '">' +
							'<td>' + sort + '</td>' +
							'<td>' + showData[i].name + '</td>' +
							'<td class="state" state=' + state + '>' + (state == 0 ? "未添加" : state == 1 ? "已保存" : state == 2 ? "已发布" : "已撤销") + '</td>' +
							'<td><a class="edit">编辑</a>' +
							'<a class="del ' + (state == 0 ? 'active' : '') + '" ' + (state == 0 ? '' : 'data-toggle="modal" data-target="#myModal"') + '>删除</a>' +
							'<a class="release ' + (state == 1 || state == 3 ? '' : 'active') + '" ' + (state == 1 || state == 3 ? 'data-toggle="modal" data-target="#myModal"' : '') + '>发布</a>' +
							'<a class="revoke ' + (state == 1 || state == 3 || state == 0 ? 'active' : '') + '" ' + (state == 2 ? 'data-toggle="modal" data-target="#myModal"' : '') + '>撤销</a>' +
							'</td>' +
							'</tr>';
					}
				}

				$('#dataList tbody').html(html);
				pages = Math.ceil(length / pageSize);
				var str = page1(pages, index);
				$('.box').html(str);
				$('.totalBox .total').html(length);
				frameHeight();

			} else {
				alert(res.message);
			}


		}
	});
}