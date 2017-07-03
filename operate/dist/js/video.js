var resultData='';
$(function(){
	//Load operation prompt file
	$('.popup').load('popup.html #modal',function(){delVideo();}); 
	$('.tabHead a').click(function(){ 
		$(this).addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq($(this).index()).show().siblings().hide();
		frameHeight();
	})
    //店铺类型 
	var type1=$('.shopType1').val();  
	var type2=$('.shopType2').val();
	var type3=$('.shopType3').val(); 
	shopType(type1,1); 
	shopType(type2,2); 
	shopType(type3,3); 
	$('.shopType1').change(function(){
		type1=$(this).val(); 
		shopType(type1,1);
	})  
	$('.shopType2').change(function(){
		type2=$(this).val(); 
		shopType(type2,2);
	}) 
	$('.shopType3').change(function(){
		type3=$(this).val(); 
		shopType(type3,3);
	})  
	var data=''; 
	function shopType(type,n)
	{
		$.ajax({
			type:"post",
			url:api+"/manual/functionList",
			data:
			{
				"type": type 
			},
			success:function(res)
			{  
				if(res.success==true)
				{
					data=res.model;  
					resultData=res.model; 
					var sortHtml=''; 
					var titleHtml='';  
					if(n==1)
					{
						titleHtml='<option value="">全部</option>';  
					}
					var i=0;
					for(i=0;i<data.length;i++)
					{  
						 sortHtml+='<option  index='+i+' id='+data[i].functionKindVo.id+' value='+data[i].functionKindVo.id+'>'+data[i].functionKindVo.name+'</option>';
					} 
					if(n==1){
						$('.functionSort1').html(sortHtml);
					}else if(n==2)
					{
						$('.functionSort2').html(sortHtml);
					}else
					{
						$('.functionSort3').html(sortHtml);
					} 
					if(data.length>0)
					{
						for(var j=0;j<data[0].functionVoList.length;j++)
						{
							titleHtml+='<option id='+data[0].functionVoList[j].id+' value='+data[0].functionVoList[j].id+' parId='+data[0].functionKindVo.id+' type='+type+'>'+data[0].functionVoList[j].name+'</option>';
						} 
						if(n==1){
							$('.functionName1').html(titleHtml);
						}else if(n==2)
						{
							$('.functionName2').html(titleHtml);
						}else
						{
							$('.functionName3').html(titleHtml);
						}  
					} 
					if(n==1)
					{
						getData(index);
	                    bgColor(key,pages); 
					} 
				} else
				{
					alert(res.message);
				}
			}
		});
	}
	
 //功能名称
 $('.functionSort1').change(function(){ 
	titleHtml='<option value="">全部</option>';   
	var val=$(this).children('option:selected').attr('index');
	var len=data[val].functionVoList.length;
	type1=$('.shopType1').val();
	for(var j=0;j<len;j++)
	{  
		titleHtml+='<option id='+data[val].functionVoList[j].id+' value='+data[val].functionVoList[j].id+' parId='+$('.functionSort1 option:selected').attr('id')+' type='+type1+'>'+data[val].functionVoList[j].name+'</option>';
	}
	$('.functionName1').html(titleHtml);  
	getData(index);
	bgColor(key,pages); 
}) 
 $('.functionSort2').change(function(){ 
	titleHtml='';   
	var val=$(this).children('option:selected').attr('index');
	var len=data[val].functionVoList.length;
	type2=$('.shopType2').val();
	for(var j=0;j<len;j++)
	{  
		titleHtml+='<option id='+data[val].functionVoList[j].id+' value='+data[val].functionVoList[j].id+' parId='+$('.functionSort2 option:selected').attr('id')+' type='+type2+'>'+data[val].functionVoList[j].name+'</option>';
	}
	$('.functionName2').html(titleHtml);  
})
$('.functionSort3').change(function(){ 
	titleHtml='';   
	var val=$(this).children('option:selected').attr('index');
	var len=data[val].functionVoList.length;
	type3=$('.shopType3').val();
	for(var j=0;j<len;j++)
	{  
		titleHtml+='<option id='+data[val].functionVoList[j].id+' value='+data[val].functionVoList[j].id+' parId='+$('.functionSort3 option:selected').attr('id')+' type='+type3+'>'+data[val].functionVoList[j].name+'</option>';
	}
	$('.functionName3').html(titleHtml);  
})
   $('.functionName1').change(function(){
   	   getData(index);
	   bgColor(key,pages);
   })
 
	//搜索事件 
	$('.searchBtn').click(function(){ 
       getData(index);
	   bgColor(key,pages);  
	})
	//编辑事件
	 var editId='';
	 var lastVer='';
	 $('tbody').on('click','.edit',function(){
		editId=$(this).parents('tr').attr('id');
		lastVer=$(this).parents('tr').attr('lastVer'); 
		$.ajax({
			type:"get",
			url:api+"/artVideo/getArtVideoById",
			data:
			{
				"id":editId
			},
			success:function(res)
			{
				if(res.success==true)
				{
					var data1=res.model;
					$('#videoName1').val(data1.title);
					$('#videoLink1').val(data1.url);
					var type=$('.shopType1').val();
					$('#shopType').val(type);
					$.ajax({
						type:"post",
						url:api+"/manual/functionList",
						data:
						{
							"type": type 
						},
						success:function(res)
						{  
							if(res.success==true)
							{
								data=res.model;  
								resultData=res.model; 
								var sortHtml=''; 
								var titleHtml='';  
								var i=0;
								for(i=0;i<data.length;i++)
								{  
									sortHtml+='<option  index='+i+' id='+data[i].functionKindVo.id+' value='+data[i].functionKindVo.id+'>'+data[i].functionKindVo.name+'</option>';
								}  
								$('.functionSort2').html(sortHtml);  
								var val=$('.functionSort2 option:selected').attr('index'); 
								var len=data[val].functionVoList.length; 
								for(var j=0;j<len;j++)
								{  
									titleHtml+='<option id='+data[val].functionVoList[j].id+' value='+data[val].functionVoList[j].id+' parId='+$('.functionSort2 option:selected').attr('id')+' type='+type+'>'+data[val].functionVoList[j].name+'</option>';
								} 
								$('.functionName2').html(titleHtml);  
								var parentId=$('#'+data1.functionId).attr('parId');  
								$('#funType').val(parentId);
								$('#function').val(data1.functionId);
								var val=$('.functionSort2 option:selected').attr('index'); 
								var len=data[val].functionVoList.length; 
								titleHtml='';
								for(var j=0;j<len;j++)
								{  
									titleHtml+='<option id='+data[val].functionVoList[j].id+' value='+data[val].functionVoList[j].id+' parId='+$('.functionSort2 option:selected').attr('id')+' type='+type+'>'+data[val].functionVoList[j].name+'</option>';
								}  
								$('.functionName2').html(titleHtml); 
								$('#function').val(data1.functionId);
							} else
							{
								alert(res.message);
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
    //新建视频
    $('.createVideo').click(function(){ 
    	$('.functionSort3').html('');
    	$('.functionName3').html('');
    	shopType(0,"3");
    })
    
    //编辑视频 确定事件
    $('.videoSure1').click(function(){
    	var title=$('#videoName1').val();
    	var url=$('#videoLink1').val();
    	var functionId=$('.functionName2 option:selected').attr('id'); 
    	if(title=='')
    	{
    		alert('视频名称不能为空');
    		return;
    	}
    	if(url=='')
    	{
    		alert('视频链接不能为空');
    		return;
    	}  
		$.ajax({
			type:"post",
			url:api+"/artVideo/updateArtVideo",
			data:
			{
				"id":editId,
				"title":title,
				"url":url,
				"functionId":functionId,
				"lastVer":lastVer
			},
			success:function(res)
			{
				if(res.success==true)
				{ 
					$('.videoCancel1').trigger('click');
					getData(index);
					bgColor(key,pages);
					editId='';
				}else
				{
					alert(res.message);
				}
			}
		}); 
    })
    
    //新建视频确定事件
    $('.videoSure2').click(function(){
    	var title=$('#videoName2').val();
    	var url=$('#videoLink2').val();
    	var functionId=$('.functionName3 option:selected').attr('id'); 
    	if(title=='')
    	{
    		alert('视频名称不能为空');
    		return;
    	}
    	if(url=='')
    	{
    		alert('视频链接不能为空');
    		return;
    	} 
		$.ajax({
			type:"post",
			url:api+"/artVideo/addArtVideo",
			data:
			{
				"title":title,
				"url":url,
				"functionId":functionId
			},
			success:function(res)
			{
				if(res.success==true)
				{
					$('.tabHead a:nth-child(1)').trigger('click');
					$('.videoCancel2').trigger('click');
					getData(index);
					bgColor(key,pages); 
				}else
				{
					alert(res.message);
				}
			}
		}); 
    })
    //取消事件
    $('.videoCancel1').click(function(){
    	$('#videoName1').val('');
    	$('#videoLink1').val('');
    	$('.model select option').eq(0).attr('selected','selected');
    })
    $('.videoCancel2').click(function(){
    	$('#videoName2').val('');
    	$('#videoLink2').val('');
    	$('.model select option').eq(0).attr('selected','selected');
    })
    $('.modal').click(function(){
       $('.list').addClass('active').siblings().removeClass('active');
    }) 
})     
	var deleteId=''; 
	function delVideo()
	{
		$('.sure').click(function(){ 
	 		 $.ajax({
	 		 	type:"post",
	 		 	url:api+"/artVideo/deleteArtVideo",
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

//数据列表加载
	var index = 1;//当前页
	var key = 1;//存储当前页 
	var pageSize=10;//每页显示数据条数
	var pages;//总共有多少页
	function getData(index) { 
		var functionId;  
		var title=$('#searchText').val();
		var state=$('.functionState').val();
		var ids=[];
		var functionIds;
		if($('.functionName1').val()=="")
		{
			var selectlen=$('.functionName1').children().length;
			for(var i=0;i<selectlen;i++)
			{
				ids.push($('.functionName1 option').eq(i).attr('id'));
			}
			ids.splice(0,1);
			functionIds=ids.join(',');
		}else
		{
			functionId=$('.functionName1 option:selected').attr('id'); 
		}
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/artVideo/list",
			data:
			{
				"pageSize": pageSize,
				"pageIndex": index, 
				"functionId": functionId, 
				"state":state,
				"title": title, 
				"functionIds":functionIds
			},
			success: function(res) {
				if(res.success==true)
				{
					var data=res.models;
					length = res.totalRecord;
					var html = '';
					var sort='';
					for (var i = 0; i < data.length; i++)
					{  
					  var parsentId=$('#'+data[i].functionId).attr('parId');  
					  sort=$('#'+parsentId).text(); 
					  html+='<tr id='+data[i].id+' lastVer='+data[i].lastVer+'>'+
							   '<td class="name">'+data[i].title+'</td>'+
							   '<td>'+sort+'</td>'+
							   '<td>'+$('#'+data[i].functionId).text()+'</td>'+
							   '<td>'+new Date(data[i].createTime).Format("yyyy-MM-dd")+'</td>'+
							   '<td>'+data[i].readAmont+'</td>'+
							   '<td>'+data[i].url+'</td>'+
							   '<td><a class="edit" data-toggle="modal" data-target="#video">编辑</a>'+
							   	   '<a class="del" data-toggle="modal" data-target="#myModal" >删除</a>'+ 
							   '</td>'+
							 '</tr>';
					}
					$('tbody').html(html);
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
	

		