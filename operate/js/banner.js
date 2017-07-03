$(function(){ 
	
  //Load operation prompt file
  $('.bannerDel').load('popup.html #modal',function(){bannerDel();});
  $('.tabHead a').click(function(){ 
		$(this).addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq($(this).index()).show().siblings().hide();
		frameHeight();
	})
  	//初始化
	getData(index);
	bgColor(key,pages); 
	
	//前移事件
	$('ul').on('click','.forword',function(){
		var id=$(this).parents('li').attr('id');
		var sortCode=$(this).attr('sortCode');  
		if(sortCode!==0)
		{
			$.ajax({
				type:"post",
				url:api+"/artBanner/sortSingleUp",
				data:
				{
					"id":id, 
					"sortCode":sortCode
				},
				success:function(res)
				{
					if(res.success==true)
					{
						getData(index);
		   				bgColor(key,pages); 
					}else
					{
						alert(res.message); 
					}
				}
			}); 
		} 
	})
	 
	
	//删除事件
	var deleteId;
	$('ul').on('click','.del',function(){
		$('.tipTitle').html("删除");
		$('.tipMessage').html("是否确认删除？");
		deleteId=$(this).parents('li').attr('id'); 
	})
	  
	//删除Banner
	 function bannerDel()
	 { 
	 	 //确定事件
	 	$('.sure').click(function(){ 
	 		 $.ajax({
	 		 	type:"post",
	 		 	url:api+"/artBanner/deleteArtBanner",
	 		 	data:
	 		 	{
	 		 		"id":deleteId
	 		 	},
	 		 	success:function(res)
	 		 	{
	 		 		if(res.success==true)
	 	   	 		{
	 	   	 			getData(index);
             			bgColor(key,pages); 
	 	   	 		}else
	 	   	 		{
	 	   	 			alert(res.message);
	 	   	 		}
	 		 	}
	 		 });
	 	})
	 }
	 
	 //新建Banner 
 	$('#fileCreate').change(function(){ 
		imgFile = this.files[0];
		if(imgFile)
		{
			var name=imgFile.name;
			if(name.length>20){
                $('#fileCreate').val("");
				alert("文件名称过长，请修改名称再上传");
				return;
			}
			var fr = new FileReader();
			fr.onload = function() { 
			   $('#pictureName').val(name); 
			};
			fr.readAsDataURL(imgFile);
			uploadFile(this);
		}  
	})
 	 var createUrl='';
	 function uploadFile(obj) { 
		var fileObj = obj.files[0]; // 获取文件对象  
		var FileController = api+"/article/uploadImg"; // 接收上传文件的后台地址  
		if (fileObj) {
			// FormData 对象  
			var form = new FormData();
			form.append("picFile", fileObj);// 文件对象      
			// XMLHttpRequest 对象  
			var xhr = new XMLHttpRequest();
			xhr.open("post", FileController, true);
			xhr.send(form);
			xhr.onload = function() {
				var str= xhr.responseText;
				var result=JSON.parse(str); 
				if(result.state=="SUCCESS")
				{ 
					createUrl=result.url;
					editUrl=result.url;
				}else
				{
					alert(result.message)
				}
			};
		}else
		{
			alert("未选择文件");
		}
	}
	$('.createSure').click(function(){
		var tilte=$('#pictureName').val(); 
		var articleId=$('.linkArticle option:selected').val();
		if(tilte==''|| imgFile==''){alert('请上传图片或填写图片名称');return;}
		$.ajax({
			type:"post",
			url:api+"/artBanner/addArtBanner",
			data:
			{
				"title":tilte,
				"articleId":articleId,
				"url":createUrl
			},
			success:function(res)
			{
				if(res.success==true)
	   	 		{
	   	 			$('.cancel').trigger('click');
	   	 			getData(index);
	                bgColor(key,pages);  
	   	 		}else
	   	 		{
	   	 			alert(res.message);
	   	 		}
			}
		});
	})
	$.fn.modal.Constructor.prototype.enforceFocus = function () { }; 
 	
 	var editUrl='';
 	$('#fileEdit').change(function(){ 
		var imgFile = this.files[0]; 
		var name=imgFile.name;
        if(name.length>20){
            $('#fileCreate').val("");
            alert("文件名称过长，请修改名称再上传");
            return;
        }
		var fr = new FileReader();
		fr.onload = function() { 
		   $('#editName').val(name);
		};
		fr.readAsDataURL(imgFile);
		uploadFile(this);
	})
 	$('.editSure').click(function(){
		var tilte=$('#editName').val(); 
		var articleId=$('.editLink option:selected').val();
		if(state=="2")
		{
			$('.cancel').trigger('click');
			$(this).attr("data-toggle", 'modal');
			$(this).attr("data-target", '#saveModal');
		}else
		{
			$(this).removeAttr("data-toggle", 'modal');
			$(this).removeAttr("data-target", '#saveModal');
			$.ajax({
				type:"post",
				url:api+"/artBanner/updateArtBanner",
				data:
				{
					"id":editId,
					"lastVer":lastVer,
					"state":"1",
					"title":tilte,
					"articleId":articleId,
					"url":editUrl
				},
				success:function(res)
				{
					if(res.success==true)
		   	 		{ 
		   	 			$('.cancel').trigger('click');
		   	 			getData(index);
		                bgColor(key,pages);  
		   	 		}else
		   	 		{
		   	 			alert(res.message);
		   	 		}
				}
			});
		}
		
	})
 	
 	//发布之后编辑保存事件
	$('.yes').click(function() {
		var tilte=$('#editName').val(); 
		var articleId=$('.editLink option:selected').val();
		 $.ajax({
			type:"post",
			url:api+"/artBanner/updateArtBanner",
			data:
			{
				"id":editId,
				"lastVer":lastVer,
				"state":"1",
				"title":tilte,
				"articleId":articleId,
				"url":editUrl
			},
			success:function(res)
			{
				if(res.success==true)
	   	 		{ 
	   	 			$('.cancel').trigger('click');
	   	 			getData(index);
	                bgColor(key,pages);  
	   	 		}else
	   	 		{
	   	 			alert(res.message);
	   	 		}
			}
		});
	})
 	$('.modal').click(function(){
    	$('.list').addClass('active').siblings().removeClass('active');
    })
    
 	 
	 //发布事件
	 $('.release').click(function(){
	 	var aCheck = $('input[type=checkbox]:checked');
		var ids = [];
		var id=[];
		for(var i = 0;i < aCheck.length;i ++)
		{ 
			ids[i] = aCheck.eq(i).parents('li').attr('id');
			if($('#'+ids[i]).attr('state')=="2")continue;
			id.push(ids[i]); 
		} 
		if(id.length>6)
		{
			id.splice(6,id.length-6);
		}
		id=id.join(',');
		if(id.length>0)
		{
			$.ajax({
				type:"post",
				url:api+"/artBanner/updateArtBannerState",
				data:
				{
					"ids":id,
					"state":"2"
				},
				success:function(res)
				{
					if(res.success==true)
		   	 		{ 
		   	 			getData(index);
		                bgColor(key,pages);  
		   	 		}else
		   	 		{
		   	 			alert(res.message);
		   	 		}
				}
	
			});
		}else
		{
			alert("您未选中任何案例");
		}
		
 })
	 
	 //撤销发布
	 $('.revokeRelease').click(function(){
	 	var aCheck = $('input[type=checkbox]:checked');
		var ids = [];
		var id=[];
		for(var i = 0;i < aCheck.length;i ++)
		{ 
			ids[i] = aCheck.eq(i).parents('li').attr('id');
			if($('#'+ids[i]).attr('state')=="1" || $('#'+ids[i]).attr('state')=="3")continue;
			id.push(ids[i]); 
		} 
		id=id.join(',');
		if(id.length>0)
		{
			$.ajax({
				type:"post",
				url:api+"/artBanner/updateArtBannerState",
				data:
				{
					"ids":id,
					"state":"3"
				},
				success:function(res)
				{
					if(res.success==true)
		   	 		{ 
		   	 			getData(index);
		                bgColor(key,pages);  
		   	 		}else
		   	 		{
		   	 			alert(res.message);
		   	 		}
				}
	
			});
		} 
	 })
	
	//编辑事件
 	var editId='';
 	var lastVer='';
 	var state='';
 	var articleId = "";
 	var editUrl = "";
 	$('ul').on('click','.edit',function(){ 
		editId=$(this).parents('li').attr('id');
		lastVer=$(this).parents('li').attr('lastVer');
		state=$(this).parents('li').attr('state');
		articleId = $(this).parents('li').attr('articleId');
		editUrl = $(this).parents('li').attr('url');
		$.ajax({
			type:"get",
			url:api+"/artMarketingCase/getArtMarketingCaseById",
			data:
			{
				"id":articleId 
			},
			success:function(res)
			{
				if(res.success==true)
	   	 		{  
	   	 			var data=res.model; 
	   	 			var picName=editUrl.substring(editUrl.lastIndexOf("/")+1,editUrl.length);
	   	 			picName=picName.length>20?picName.substr(0,20):picName;
	   	 			$('#editName').val(picName);
	   	 			$('#editLink').html('<option value="' + articleId + '">' +data.title+ '</option>').trigger("change");
	   	 			$("#editLink").select2({
					  ajax: {
					    type:"post",
						url: api+"/artMarketingCase/list",
						dataType: 'json', 
					    delay: 250,
					    data: function (params) {
					    	return {
					    		"title":params.term,
						    	"pageSize": 20,
								"pageIndex": 1,
								"state":"2"
					    	}; 
					    },
					    processResults: function (res) {
					    	var data=res.models;
						    var options = new Array();
				            $(data).each(function(i,obj) { 
				                options.push({　　　　　　　　 
				                    id : obj.id,
				                    text : obj.title
				                });
				            });
					        return {
					        	results: options
					        };
					       
					      } 
					   }
					});	 
	   	 		}else
	   	 		{
	   	 			alert(res.message);
	   	 		}
			}
		});
	})
 	
 	$('.create').click(function(){
 		$('#pictureName').val("");
 		$('#linkArticle').select2({
	 	placeholder :"请选择",
	  	ajax: {
		    type:"post",
			url: api+"/artMarketingCase/list",
			dataType: 'json', 
		    delay: 250,
		    data: function (params) {
		    	return {
		    		"title":params.term,
			    	"pageSize": 20,
					"pageIndex": 1,
					"state":"2"
		    	}; 
		    },
		    processResults: function (res) {
		    	var data=res.models;
			    var options = new Array();
	            $(data).each(function(i,obj) { 
	                options.push({　　　　　　　　 
	                    id : obj.id,
	                    text : obj.title
	                });
	            });
		        return {
		        	results: options
		        };
		       
		      } 
		   }
	  	
	  }); 
 	})
	
	 
})
 
  
 
 
//数据列表加载
	var index = 1;//当前页
	var key = 1;//存储当前页 
	var pageSize=10;//每页显示数据条数
	var pages;//总共有多少页
	function getData(index) { 
		key = index;
		var length; //总数据长度
		$.ajax({
			type: "post",
			url: api+"/artBanner/list",
			data: 
			{
				"pageSize": pageSize,
				"pageIndex": index,  
			},
			success: function(res) {
				if(res.success==true)
				{
					var data=res.models;
					length = res.totalRecord;
					var html = '';
					var imgTitle='';
					for (var i = 0; i < data.length; i++)
					{  
						  
					  html+='<li id="'+data[i].id+'" articleId="'+data[i].articleId+'" url="'+data[i].url+'"  lastVer="'+data[i].lastVer+'" state="'+data[i].state+'">'+
			 	 	 			'<div class="releaseBox">'+
			 	 	 				'<img src="'+data[i].url+'" />'+
			 	 	 				'<div class="revoked '+(data[i].state==2?'':'active')+'">已发布</div>'+
			 	 	 			'</div>'+
			 	 	 			'<div class="nameBox"><i>图片名称：</i><span class="imgName">'+(data[i].title.length>15?data[i].title.substr(0,15)+"...":data[i].title)+'</span></div>'+
			 	 	 			'<div class="btnBox">'+
			 	 	 				'<input type="checkbox" />'+
			 	 	 				'<button type="button" class="edit" data-toggle="modal" data-target="#bannerEdit">编辑</button>'+
			 	 	 				'<button type="button" '+((i+pageSize*(index-1))==0?'disabled=\"disabled\" style=\"background: #E6E6E6\"':'')+' class="forword" sortCode='+data[i].sortCode+'>前移</button>'+
			 	 	 				'<button type="button" class="del" data-toggle="modal" data-target="#myModal">删除</button>'+
			 	 	 			'</div>'+
			 	 	 		'</li> ';
					}
					$('.contentList ul').html(html);
					frameHeight();
					pages = Math.ceil(length / pageSize); 
					var str=page(pages,index);
					$('.box').html(str);
					$('.totalBox .total').html(length);
				}else
				{
					alert(res.message);
				}
				
			}
		});
   } 