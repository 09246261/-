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
	 
	firstSort(1); 
	firstSort(2);
    //一级分类  
    function firstSort(n)
    { 
		$.ajax({
			type: "post",
			url: api + "/artFaqKind/getArtFaqKindByParentId",
			data: {
				"parentId": 0
			},
			success: function(res) {
				if (res.success == true) {
					var html = '';
					var data = res.model;
					var parentId;
					for (var i = 0; i < data.length; i++) {
						html += '<option id=' + data[i].id + ' value="'+data[i].id+'">' + data[i].name + '</option>';
					}
					if(n==1)
					{
						$('.firstSort1').html(html); 
						parentId=$('.firstSort1').val();
					}else
					{
						$('.firstSort2').html(html);
						parentId=$('.firstSort2').val();
					}  
					//二级分类 
					if(n==1)
					{
						secondSort(parentId,1);
					}else
					{
						secondSort(parentId,2);
					} 
					 
				}
			}
		});
    }
	
 
	//二级分类数据获取
	function secondSort(parentId,n) { 
		$.ajax({
			type: "post",
			url: api + "/artFaqKind/getArtFaqKindByParentId",
			data: {
				"parentId": parentId
			},
			success: function(res) {
				if (res.success == true) {
					var html ='';
					if(n==1)
					{
						html='<option value="">全部</option>';
					}
					var data = res.model;
					for (var i = 0; i < data.length; i++) {
						html += '<option value=' + data[i].id + ' parId='+parentId+'>' + data[i].name + '</option>';
					}
					if(n==1){
						$('.secondSort1').html(html);
					}else
					{
						$('.secondSort2').html(html);
					}
					
					if(n==2)return;
					getData(index);
					bgColor(key, pages);
				} else {
					alert(res.message);
				}
			}
		});
	}
	//搜索事件
	$('.searchBtn').click(function() {
		getData(index);
		bgColor(key, pages);
	})
	
	//一级分类
	$('.firstSort1').change(function() {  
		var parentId=$('.firstSort1').val();
		secondSort(parentId,1); 
	})
	
	$('.firstSort2').change(function() {  
		var parentId=$('.firstSort2').val();
		secondSort(parentId,2); 
	})
	
	//二级分类
	$('.secondSort1').change(function(){
		getData(index);
		bgColor(key, pages);
	}) 
	//状态更换
	$('.functionState').click(function(){
		getData(index);
		bgColor(key, pages);
	})
	
	//新建常见问题
	$('.create').click(function(){
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();  
		frameHeight();
		firstSort(2);
		$('#title').val('');
		ue.setContent('');
		state="";
		editId="";
	})

	//置顶事件 
	$('tbody').on('click', '.top', function() {
		var state= $(this).parents('tr').attr('state');
		if(state=="2")
		{ 
			var id = $(this).parents('tr').attr('id');
			var lastVer = $(this).parents('tr').attr('lastVer');
			var orderBy=$(this).parents('tr').attr('orderBy');
			var isHotFaq = $(this).attr('isHotFaq') == 0 ? 1 : 0;
			$.ajax({
				type: "get",
				url: api + "/artFaq/updateArtFaqHot",
				data: {
					"id": id,
					"isHotFaq": isHotFaq,
					"lastVer": lastVer,
					"orderBy":orderBy
				},
				success: function(res) {
					if (res.success == true) {
						getData(index);
						bgColor(key, pages);
					} else {
						alert(res.message);
					}
				}
			});
		} 
	})


	//编辑事件  
	$('tbody').on('click', '.edit', function() {
		flag="false";
		editId = $(this).parents('tr').attr('id');
		lastVer = $(this).parents('tr').attr('lastVer');
		state = $(this).parents('tr').attr('state');
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide(); 
		frameHeight(); 
		$.ajax({
			type: "get",
			url: api + "/artFaq/getArtFaqById",
			data: {
				"id": editId
			},
			success: function(res) {
				var data = res.model;
				if (res.success == true) {
					$('#title').val(data.title);
					if(data.article)
					{
						ue.setContent(data.article);
					}   
					$('.firstSort2 option[value="'+data.faqKindParentId+'"]').attr('selected',"selected");
					 $.ajax({
						type: "post",
						url: api + "/artFaqKind/getArtFaqKindByParentId",
						data: {
							"parentId": data.faqKindParentId
						},
						success: function(res) {
							if (res.success == true) {
								var html = '';
								var data1 = res.model;
								for (var i = 0; i < data1.length; i++) {
									html += '<option value=' + data1[i].id + ' parId='+data.faqKindParentId+'>' + data1[i].name + '</option>';
								}
								$('.secondSort2').html(html);  
								$('.secondSort2 option[value="'+data.faqKindId+'"]').attr('selected',"selected");
								
							} else {
								alert(res.message);
							}
						}
					}); 
					
				} else {
					alert(res.message);
				}
			}
		});
	})
	
	
   
	//保存事件 
	$('.save').click(function() {
		if(state=="2")
		{  
			 $(this).attr("data-toggle",'modal');
		     $(this).attr("data-target",'#saveModal');
		}else
		{
			 $(this).removeAttr('data-toggle');
		     $(this).removeAttr('data-target');
		     addQueation("1");
		     ue.setContent("");
		} 
	})
	//发布之后编辑保存事件
	$('.yes').click(function(){
	   addQueation("1");
	   ue.setContent("");
	})
})
var deleteId = '';
var releaseId = '';
var revokeId = '';
var editId = '';
var lastVer = '';
var state='';
function popupEvent() {
	//弹窗中的确定事件
	$('.sure').click(function() {
		if (deleteId != '') {
			$.ajax({
				type: "post",
				url: api + "/artFaq/deleteArtFaq",
				data: {
					"id": deleteId
				},
				success: function(res) {
					if (res.success == true) {
						getData(index);
						bgColor(key, pages);
						deleteId = '';
					} else {
						alert(res.message);
					}
				}
			});
		} else if (releaseId != '') {
			updateArtFaqState("2", releaseId, $('#' + releaseId).attr('lastVer'));
			releaseId = '';
		} else if (revokeId != '') {
			updateArtFaqState("3", revokeId, $('#' + revokeId).attr('lastVer'));
			revokeId = '';
		} else {
			addQueation("2");
		}

	})
}
//更新常见问题状态
function updateArtFaqState(state, id, lastVer) {
	$.ajax({
		type: "get",
		url: api + "/artFaq/updateArtFaqState",
		data: {
			"id": id,
			"state": state,
			"lastVer": lastVer
		},
		success: function(res) {
			if (res.success == true) {
				getData(index);
				bgColor(key, pages);
			} else {
				alert(res.message);
			}
		}
	});
}
//添加或更新常见问题
function addQueation(state) {
	var title = $("#title").val();
	var functionId=$('.secondSort2').val();  
	var article = ue.getContent();
	if(title==''){alert("请输入标题");return;}
	if(functionId==''||functionId==undefined){alert("二级分类未选择");return;}
	if (editId == '') {
		$.ajax({
			type: "post",
			url: api + "/artFaq/addArtFaq",
			data: {
				"title": title,
				"article": article,
				"faqKindId": functionId, 
				"state": state
			},
			success: function(res) {
				if (res.success == true) {
					$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
		   			$(".tabContent .content").eq(0).show().siblings().hide();  
		   			frameHeight();
					getData(index);
					bgColor(key, pages);
				} else {
					alert(res.message);
				}
			}
		});
	} else {
		$.ajax({
			type: "post",
			url: api + "/artFaq/updateArtFaq",
			data: {
				"title": title,
				"article": article,
				"faqKindId": functionId,
				"lastVer": lastVer, 
				"state": state,
				"id": editId
			},
			success: function(res) {
				if (res.success == true) {
					$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
		   			$(".tabContent .content").eq(0).show().siblings().hide();  
		   			frameHeight();
					editId = '';
					getData(index);
					bgColor(key, pages);
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
function getData(index) {
	var state = $('.functionState').val();
	var title = $('#searchText').val();
	var faqKindIdList='';
	var ids=[];
	if($('.secondSort1').val()==""||$('.secondSort1').val()==undefined)
	{
		var faqLen=$('.secondSort1').children().length;
		for(var i=0;i<faqLen;i++)
		{
			ids.push($('.secondSort1 option').eq(i).val()); 
		}
		ids.splice(0,1);
		faqKindIdList=ids.join(',');
	}else
	{
		faqKindIdList=$('.secondSort1').val();
	}
	key = index;
	var length;
	$.ajax({
		type: "post",
		url: api + "/artFaq/list",
		data: {
			"pageSize": pageSize,
			"pageIndex": index,
			"state": state,
			"title": title,
			"faqKindIdList":faqKindIdList
		},
		success: function(res) {
			if (res.success == true) { 
				var data = res.models;
				length = res.totalRecord;
				var html = '';
				for (var i = 0; i < data.length; i++) { 
					html += '<tr id=' + data[i].id + ' lastVer=' + data[i].lastVer + ' orderBy='+data[i].opTime+' state="'+data[i].state+'">' +
						'<td class="name">' + data[i].title + '</td>' +
						'<td>'+data[i].secondName+'</td>' +
						'<td>'+data[i].firstName+'</td>' +
						'<td class="state" state=' + data[i].state + '>' + (data[i].state == 1 ? "已保存" : data[i].state == 2 ? "已发布" : "已撤销") + '</td>' +
						'<td>' + data[i].readAmount + '</td>' +
						'<td><a class="top '+(data[i].state==2?'':'active')+'" isHotFaq=' + data[i].isHotFaq + '>' + (data[i].isHotFaq == 1? "取消置顶" : "置顶") + '</a>' +
						'<a class="edit">编辑</a>' +
						'<a class="del" data-toggle="modal" data-target="#myModal" >删除</a>' +
						'<a class="release '+(data[i].state==2?'active':'')+'" ' + (data[i].state == 1 || data[i].state == 3 ? 'data-toggle="modal" data-target="#myModal"' : '') + '>发布</a>' +
						'<a class="revoke '+(data[i].state==1 || data[i].state==3?'active':'')+'" ' + (data[i].state == 2 ? 'data-toggle="modal" data-target="#myModal"' : '') + '>撤销</a>' +
						'</td>' +
						'</tr>';
				}
				$('#dataList tbody').html(html);
				frameHeight();
				pages = Math.ceil(length / pageSize);
				var str = page(pages, index);
				$('.box').html(str);
				$('.totalBox .total').html(length);
			} else {
				alert(res.message);
			}

		}
	});
}