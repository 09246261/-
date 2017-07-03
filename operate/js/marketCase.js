var keywordList = '';
var imgUrlList = '';
var arrUrl = [];
var n = 0;
var arr = [];
function changeImg(obj, i) {
	var imgFile = obj.files[0];
	var name = imgFile.name;
    if(name.length>20){
        alert("文件名称过长，请修改文件名称再上传");
        $(obj).val("");
        return;
    }
	var fr = new FileReader();
	fr.onload = function() {
		$('#uploadImg' + (i + 1)).attr('src', fr.result);
		$('#uploadTitle' + (i + 1)).text(name);
	};
	fr.readAsDataURL(imgFile);
	uploadFile(obj, (i));
}

function uploadFile(obj, index) {
	var fileObj = obj.files[0]; // 获取文件对象
	var FileController = api + "/article/uploadImg"; // 接收上传文件的后台地址
	if (fileObj) {
		// FormData 对象  
		var form = new FormData();
		form.append("picFile", fileObj); // 文件对象      
		// XMLHttpRequest 对象  
		xhr = new XMLHttpRequest();
		xhr.open("post", FileController, true);
		xhr.send(form);
		xhr.onload = function() {
			var str = xhr.responseText;
			var result = JSON.parse(str);
			if (result.state == "SUCCESS") {
				imgUrl = result.url;
				console.log(index)
				if (index !== (-1)) {
					arrUrl[index] = imgUrl;

				} else {
					arrUrl.push(imgUrl);
				}
			}
		};

	} else {
		alert("未选择文件");
	}
}
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
			ue.setContent("");
			$('.textEdit .top').hide();
			$('.textEdit .top').html('');
			$('.wordDiv').html('');
			imgUrlList = '';
			arr=[];
			keywordList = '';
			arrUrl = []; 
			n = 0;
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
	//初始化
	getData(index);
	bgColor(key, pages);

	//搜索事件
	$('.searchBtn').click(function() {
		getData(index);
		bgColor(key, pages);
	})
	//状态更换
	$('.functionState').change(function() {
		getData(index);
		bgColor(key, pages);
	})

	//置顶事件 
	$('tbody').on('click', '.top', function() {
		var state=$(this).parents('tr').attr('state');
		if(state=="2")
		{ 
			var id = $(this).parents('tr').attr('id');
			var lastVer = $(this).parents('tr').attr('lastVer');
			var stickTop = $(this).attr('stickTop') == 0 ? 1 : 0;
			$.ajax({
				type: "get",
				url: api + "/artMarketingCase/updateArtMarketingCaseStickTop",
				data: {
					"id": id,
					"stickTop": stickTop,
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

	})


	//编辑事件   
	$('tbody').on('click', '.edit', function() {
		flag="false";
		arr=[];
		editId = $(this).parents('tr').attr('id');
		lastVer = $(this).parents('tr').attr('lastVer');
		state = $(this).parents('tr').attr('state');
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide(); 
		frameHeight();
		//获取标题文章
		$.ajax({
			type: "get",
			url: api + "/artMarketingCase/getArtMarketingCaseById",
			data: {
				"id": editId
			},
			success: function(res) {
				if (res.success == true) {
					var data = res.model;
					$('#title').val(data.title);
					if(data.article)
					{
						ue.setContent(data.article);
					} 
				} else {
					alert(res.message);
				}
			}
		});
		//获取关键词
		$.ajax({
			type: "get",
			url: api + "/artMarketingCase/getKeywordsByCaseId",
			data: {
				"id": editId
			},
			success: function(res) {
				if (res.success == true) {
					$('.wordDiv').html('');
					var data = res.model;
					var html = '';
					for (var i = 0; i < data.length; i++) {
						html += '<div class="wordItem"><strong class="keys">' + data[i].keyword + '</strong><span>×</span></div>';
						arr.push(data[i].keyword);
					}
					$('.wordDiv').html(html);
				} else {
					alert(res.message);
				}
			}
		});
		//获取图片
		$.ajax({
			type: "get",
			url: api + "/artMarketingCase/getImgByCaseId",
			data: {
				"id": editId
			},
			success: function(res) {
				if (res.success == true) {
					var data = res.model;
					var html = '';
					var imgTitle = '';
					if (data.length > 0) {
						$('.textEdit .top').show();
						for (var i = 0; i < data.length; i++) { 
							imgTitle = data[i].url.substring(data[i].url.lastIndexOf("/") + 1, data[i].url.length); 
							imgTitle=imgTitle.length>30?imgTitle.substr(0,30)+"...":imgTitle;
							html += '<div class="item"> ' +
								'<input type="file" id="uploadInput' + (i + 1) + '"  onchange="changeImg(this,' + i + ')"/>' +
								'<label for="uploadInput' + (i + 1) + '">' +
								'<img  src="' + data[i].url + '" id="uploadImg' + (i + 1) + '"/>' +
								'<span id="uploadTitle' + (i + 1) + '">' + imgTitle + '</span>' +
								'</label>' +
								'<img src="../img/delete.png" class="del"/>' +
								' </div> ';
							arrUrl.push(data[i].url);
						}
						$('.textEdit .top').html(html);
						n = $('.textEdit .top').children('.item').length;
						if(n>=3)
						{
							$('.textEdit .bottom').hide();
						    return ;
						}else
						{
							$('.textEdit .bottom').show();
						}
					} else {
						$('.textEdit .top').hide();
					}
				} else {
					alert(res.message);
				}
			}
		});

	})

	//保存事件 
	$('.save').click(function() {
		if (state == "2") {
			$(this).attr("data-toggle", 'modal');
			$(this).attr("data-target", '#saveModal');
		} else {
			$(this).removeAttr('data-toggle');
			$(this).removeAttr('data-target');
			addMarketCase('1'); 
		}
	})
	//发布之后编辑保存事件
	$('.yes').click(function() {
		addMarketCase('1'); 
	})

	//设置关联词事件  
	var keyHtml = ''; 
	function getText() {
        //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
        var range = UE.getEditor('editor').selection.getRange();
        range.select();
        var txt = UE.getEditor('editor').selection.getText();
        return txt;
    }
	 
	$('.setWord').click(function() {
		var txt=getText(); 
		if (txt!=="") {
			txt=txt.length>10?txt.substr(0,10):txt;
			keyHtml = '<div class="wordItem"><strong class="keys">'+txt+'</strong><span>×</span></div>'; 
		}
		if (keyHtml == '') return;
		$('.wordDiv').append(keyHtml); 
		keyHtml = '';
		var len=$('.wordDiv').children().length; 
		for(var i=0;i<len;i++)
		{
			arr.push($('.keys').eq(i).text());
		}
		$.unique(arr);
	})
	 


	//删除关联词
	$('.wordDiv').on('click', 'span', function() {
		var index = $(this).parent().index();
		$(this).parent().remove();
		arr.splice(index, 1)
	})

	//新建营销案例
	$('.create').click(function() {
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();   
		frameHeight();
		arr=[];
		$('#title').val('');
		ue.setContent("");
		$('.textEdit .top').hide();
		$('.textEdit .top').html('');
		$('.wordDiv').html('')
		imgUrlList = '';
		keywordList = '';
		arrUrl = [];
		n = 0; 
		state="";
		editId="";
		$('.textEdit .bottom').show(); 
	})

	

	//封面图
	n = $('.textEdit .top').children('.item').length;
	var imgUrl = '';  
	$('#uploadInput').change(function() {
		    n = $('.textEdit .top').children('.item').length;
		    n++; 
			$('.textEdit .top').show();
			var imgFile = this.files[0]; 
			if(imgFile)
			{
				var name = imgFile.name;
                if(name.length>20){
                    alert("文件名称过长，请修改文件名称再上传");
                    $(this).val("");
                    return;
                }
				var fr = new FileReader();
				fr.onload = function() { 
					var html = '<div class="item">' +
						'<input type="file" id="uploadInput' + n + '" onchange="changeImg(this,' + (n - 1) + ')" accept="image/gif,image/jpeg,image/jpg,image/png"/>' +
						'<label for="uploadInput' + n + '">' +
						'<img  src="' + fr.result + '" id="uploadImg' + n + '"/>' +
						'<span id="uploadTitle' + n + '">' + name + '</span>' +
						'</label>' +
						'<img src="../img/delete.png" class="del"/>' +
						'</div>';
					$('.textEdit .top').append(html);
					n = $('.textEdit .top').children('.item').length;
				};
				fr.readAsDataURL(imgFile);
				uploadFile(this, -1);
				if(n>=3)
				{
					$('.textEdit .bottom').hide();
				    return ;
				}else
				{
					$('.textEdit .bottom').show();
				}
			}  
			
		})
	
	//图片删除
	$('.upload .top').on('click', '.del', function() { 
		var index = $(this).parent().index();
		arrUrl.splice(index, 1);
		$(this).parent().remove();
		if ($('.textEdit .top').children('.item').length <= 0){
			$('.textEdit .top').hide();
		}
		if($('.textEdit .top').children('.item').length<3)
		{
		   $('.textEdit .bottom').show();
		}
	})
    $('tbody').on('click','.marketRevoke',function(){
		var state=$(this).parents('tr').find('.state').attr('state');
		var title=$(this).parents('tr').find('.title').text();
		var html='是否确认撤销“'+title+'”?'
		if(state==1 || state==3)return; 
		revokeId=$(this).parents('tr').attr('id');
		$('.tipTitle').html("撤销");
		$('.tipMessage').html(html); 
	})

})
var deleteId = '';
var releaseId = '';
var revokeId = '';
var editId = '';
var lastVer = '';
var state = '';

function popupEvent() {
	//弹窗中的确定事件
	$('.sure').click(function() {
		if (deleteId != '') {
			$.ajax({
				type: "post",
				url: api + "/artMarketingCase/deleteArtMarketingCase",
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
			updateMarketState("2", releaseId, $('#' + releaseId).attr('lastVer'));
			releaseId = "";
		} else if (revokeId != '') {
			updateMarketState("3", revokeId, $('#' + revokeId).attr('lastVer'));
			revokeId = "";
		} else {
			addMarketCase("2");
		}
	})
}

//更新营销案例状态
function updateMarketState(state, id, lastVer) {
	$.ajax({
		type: "get",
		url: api + "/artMarketingCase/updateArtMarketingCaseState",
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

//添加或更新营销案例
function addMarketCase(state) {
	var title = $("#title").val();
	var article = ue.getContent(); 
	imgUrlList = arrUrl.join(',');  
	keywordList=arr.join(',')
	if(imgUrlList.length<=0)
	{
		alert("至少上传一张图片");
		return;
	}
	if (title == '') {
		alert("标题不能为空");
		return;
	}
	if (editId == '') {
		$.ajax({
			type: "post",
			url: api + "/artMarketingCase/addArtMarketingCase",
			data: {
				"title": title,
				"article": article,
				"keywordList": keywordList,
				"imgUrlList": imgUrlList,
				"state": state
			},
			success: function(res) {
				if (res.success == true) {
					$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
		  			$(".tabContent .content").eq(0).show().siblings().hide();   
		   			frameHeight();
					getData(index);
					bgColor(key, pages);
					arrUrl = [];
					imgUrlList = '';
					ue.setContent("");
				} else {
					alert(res.message);
				}
			}
		});
	} else {
		$.ajax({
			type: "post",
			url: api + "/artMarketingCase/updateArtMarketingCase",
			data: {
				"title": title,
				"article": article,
				"keywordList": keywordList,
				"imgUrlList": imgUrlList,
				"state": state,
				"id": editId,
				"lastVer": lastVer
			},
			success: function(res) {
				if (res.success == true) {
					$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
		   			$(".tabContent .content").eq(0).show().siblings().hide();   
		   			frameHeight();
					editId = '';
					getData(index);
					bgColor(key, pages);
					arrUrl = [];
					imgUrlList = '';
					ue.setContent("");
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
	var state;
	if ($('.functionState option:selected').val() !== "") {
		state = $('.functionState option:selected').val();
	}
	var title = $('#searchText').val();
	key = index;
	var length;
	$.ajax({
		type: "post",
		url: api + "/artMarketingCase/list",
		data: {
			"pageSize": pageSize,
			"pageIndex": index,
			"state": state,
			"title": title,
		},
		success: function(res) {
			if (res.success == true) {
				var data = res.models;
				length = res.totalRecord;
				var html = '';
				for (var i = 0; i < data.length; i++) {
					html += '<tr id=' + data[i].id + ' lastVer=' + data[i].lastVer + ' state="' + data[i].state + '">' +
						'<td class="name"><a class="title" href=' + data[i].url + ' target="_blank">' + data[i].title + '</a></td>' +
						'<td class="state" state=' + data[i].state + '>' + (data[i].state == 1 ? "已保存" : data[i].state == 2 ? "已发布" : "已撤销") + '</td>' +
						'<td>' + new Date(data[i].createTime).Format("yyyy-MM-dd") + '</td>' +
						'<td>' + data[i].readAmount + '</td>' +
						'<td>' + data[i].praiseAmount + '</td>' +
						'<td>' + data[i].favoriteAmount + '</td>' +
						'<td>' +
						'<a class="top '+(data[i].state==2?'':'active')+'"  stickTop=' + data[i].stickTop + '>' + (data[i].stickTop == 1 ? "取消置顶" : "置顶") + '</a>' +
						'<a class="copy" data-clipboard-text=' + data[i].url + '>复制链接</a>' +
						'<a class="edit">编辑</a>' +
						'<a class="del" data-toggle="modal" data-target="#myModal" >删除</a>' +
						'<a class="release ' + (data[i].state == 2 ? 'active' : '') + '" ' + (data[i].state == 1 || data[i].state == 3 ? 'data-toggle="modal" data-target="#myModal"' : '') + '>发布</a>' +
						'<a class="revoke marketRevoke' + (data[i].state == 1 || data[i].state == 3 ? 'active' : '') + '" ' + (data[i].state == 2 ? 'data-toggle="modal" data-target="#myModal"' : '') + '>撤销</a>' +
						'</td>' +
						'</tr>';

				}
				$('#dataList tbody').html(html);
				var btns = document.querySelectorAll('.copy');
				var clipboard = new Clipboard(btns);
				clipboard.on('success', function(e) {
			        $(".copySuccess").fadeIn();
			        setTimeout('$(".copySuccess").fadeOut(300)',2000);
			    });
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