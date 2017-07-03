$(function(){
	//业务线模块列表  
	    var module="";
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/common/v1/list_business_module",
			beforeSend:function()
            {
            	$('.request').show();
            },
			success:function(res)
			{ 
				$('.request').hide();
				if(res.code==1)
				{ 
	                var data=res.data; 
	                var business=data.business;
	                module=data.module;
	                var businessHtml='';
	                var moduleHtml='';
	                for(var i=0;i<business.length;i++)
	                {
	                	businessHtml+='<option value="'+business[i].id+'">'+business[i].name+'</option>'; 
	                } 
	                for(var j=0;j<module.length;j++)
	                {
	                	if(business[0].id==module[j].businessId)
	                	{  
	                		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
	                	} 
	                } 
	                $('.module').html(moduleHtml); 
	                $('.business').html(businessHtml);  
	                getData(index);
					bgColor(key,pages); 
				}else
				{
					alert(res.message);
				}
			}
		}); 
	
	$('.business').eq(0).change(function(){
		var businessId=$(this).val();
		var moduleHtml='';
		for(var j=0;j<module.length;j++)
        {
        	if(businessId==module[j].businessId)
        	{  
        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
        	} 
        }
        $('.module').eq(0).html(moduleHtml); 
	}) 
	$('.business').eq(1).change(function(){
		var businessId=$(this).val();
		var moduleHtml='';
		for(var j=0;j<module.length;j++)
        {
        	if(businessId==module[j].businessId)
        	{  
        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
        	} 
        }
        $('.module').eq(1).html(moduleHtml); 
	}) 
	 //查询事件
	$('.query').click(function(){
		getData(index);
		bgColor(key,pages); 
	})
	//文本编辑器 
	var E = window.wangEditor
	editor = new E('#editor'); 
	editor.customConfig.uploadImgServer = api+'/boss-mg-center/common/file/v1/upload_single';  
	editor.customConfig.uploadFileName = 'file';
	editor.customConfig.uploadImgHooks = { 
	    // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
	    // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
	    customInsert: function (insertImg, result, editor) {
	        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
	        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
	
	        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片： 
	        var url = result.data
	        insertImg(url)
	
	        // result 必须是一个 JSON 格式字符串！！！否则报错
	    }
    } ;
	editor.create() ;
	
	 
	//编辑事件
	var editId='';
	var lastVer='';
	$('tbody').on('click','.edit',function(){ 
		editId=$(this).parents('tr').attr('id');
		lastVer=$(this).parents('tr').attr('lastVer');  
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();  
		$('.save').show();
		//不可编辑
		$('.business2').prop('disabled',"disabled");
		$('.module2').prop('disabled',"disabled");
		$('.versionCode').prop('disabled',"disabled");
		$('#datetimepicker').prop('disabled',"disabled");
		$('.title').prop('disabled',"disabled");
		//可编辑
		$('.w-e-text').prop('contenteditable',"true");
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/version/v1/get_version_detail",
			data:
			{
				"id":editId
			},
			beforeSend:function()
            {
            	$('.request').show();
            },
			success:function(res)
			{
				$('.request').hide();
				if(res.code==1)
				{ 
					var data=res.data;
					$('.business2').val(data.businessId);
					var moduleHtml='';
					for(var j=0;j<module.length;j++)
			        {
			        	if(data.businessId==module[j].businessId)
			        	{  
			        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
			        	} 
			        }
			        $('.module').eq(1).html(moduleHtml); 
					$('.module2').val(data.moduleId); 
					$('.versionCode').val(data.versionNum);
					$('#datetimepicker').val(data.displayPublishTime);
					$('.title').val(data.title);
					editor.txt.html(data.content);   
				}else
				{
					alert(res.message);
				}
			}
		});
	})
	
	
	   
	//详情事件 
	$('tbody').on('click','.detail',function(){ 
		var id=$(this).parents('tr').attr('id');
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();  
		$('.save').hide(); 
		//不可编辑
		$('.business2').prop('disabled',"disabled");
		$('.module2').prop('disabled',"disabled");
		$('.versionCode').prop('disabled',"disabled");
		$('#datetimepicker').prop('disabled',"disabled");
		$('.title').prop('disabled',"disabled");
		$('.w-e-text').prop('contenteditable',"false");
					
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/version/v1/get_version_detail",
			data:
			{
				"id":id
			},
			beforeSend:function()
            {
            	$('.request').show();
            },
			success:function(res)
			{
				$('.request').hide();
				if(res.code==1)
				{ 
					var data=res.data; 
					$('.business2').val(data.businessId);
					var moduleHtml='';
					for(var j=0;j<module.length;j++)
			        {
			        	if(data.businessId==module[j].businessId)
			        	{  
			        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
			        	} 
			        }
			        $('.module').eq(1).html(moduleHtml); 
					$('.module2').val(data.moduleId); 
					$('.versionCode').val(data.versionNum);
					$('#datetimepicker').val(data.displayPublishTime);
					$('.title').val(data.title);
					editor.txt.html(data.content);
				}else
				{
					alert(res.message);
				}
			}
		});
	})
	
	 
    //取消事件
    $('.cancel').click(function(){ 
    	//可编辑
    	$('.business2').removeProp("disabled");
		$('.module2').removeProp("disabled");
		$('.versionCode').removeProp("disabled");
		$('#datetimepicker').removeProp("disabled");
		$('.title').removeProp("disabled");
		$('.w-e-text').prop('contenteditable',"true"); 
		
    	$('.versionCode').val("");
		$('#datetimepicker').val("");
		$('.title').val("");
		editor.txt.html("");
		$('.save').show();
    	$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(0).show().siblings().hide();  
    })
    //添加版本初始化
    $('.vertionDetail').click(function(){
    	//可编辑
    	$('.business2').removeProp("disabled");
		$('.module2').removeProp("disabled");
		$('.versionCode').removeProp("disabled");
		$('#datetimepicker').removeProp("disabled");
		$('.title').removeProp("disabled");
		$('.w-e-text').prop('contenteditable',"true");
		
    	$('.versionCode').val(""); 
		$('.title').val("");
		editor.txt.html("");
		editId='';  
		$('#datetimepicker').val('');
		$('.save').show(); 
		
		$('.business2 option').eq(0).prop('selected','selected');
		var moduleHtml='';
		for(var j=0;j<module.length;j++)
		{
			if($('.business2').val()==module[j].businessId)
			{  
				moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
			} 
		}
		$('.module').eq(1).html(moduleHtml);  
    }) 
    //保存事件
    $('.save').click(function(){
    	var content=editor.txt.html();  
        var business_id=$('.business2').val();
        var module_id=$('.module2').val();
        var display_publish_time=$('#datetimepicker').val();
        var title=$('.title').val();
        var version_num=$('.versionCode').val();  
	 	if(version_num!==""&&!new RegExp(/v\s\d+(\.\d+){2}/).test(version_num))
	 	{
	 		alert("您输入的版本格式不符合要求。");
	 		return;
	 	} 
	 	if(version_num=="")
	 	{
	 		alert("请输入版本号");
	 		return;
	 	}
	 	if(title=="")
	 	{
	 		alert("请输入标题");
	 		return;
	 	}
	 	if(display_publish_time=="")
	 	{
	 		alert("请选择发布日期");
	 		return;
	 	}
        //新建版本
        if(editId=='')
        {
        	$.ajax({
        		type:"post",
        		url:api+"/boss-mg-center/conf/version/v1/add_version",
        		data:
        		{
        			"businessId":business_id,
        			"content":content,
        			"displayPublishTime":display_publish_time,
        			"moduleId":module_id,
        			"title":title,
        			"versionNum":version_num
        		},
        		beforeSend:function()
                {
                	$('.request').show();
                	$('.save').prop('disabled','disabled');
                },
        		success:function(res)
        		{
        			$('.save').removeProp('disabled');
        			$('.request').hide();
        			if(res.code==1)
        			{  
        				$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
						$(".tabContent .content").eq(0).show().siblings().hide();  
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
        	//修改版本
        	$.ajax({
        		type:"post",
        		url:api+"/boss-mg-center/conf/version/v1/modify_version",
        		data:
        		{ 
        			"content":content, 
        			"id":editId,
        			"lastVer":lastVer
        		},
        		beforeSend:function()
                {
                	$('.request').show();
                	$('.save').prop('disabled','disabled');
                },
        		success:function(res)
        		{
        			$('.save').removeProp('disabled');
        			$('.request').hide();
        			if(res.code==1)
        			{  
        				$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
						$(".tabContent .content").eq(0).show().siblings().hide();  
        				getData(index);
						bgColor(key,pages);
						editId='';
        			}else
        			{
        				alert(res.message);
        			}
        		}
        	});
        }
    }) 
    
})



//数据列表加载
	var index = 1;//当前页
	var key = 1;//存储当前页 
	var pageSize=15;//每页显示数据条数
	var pages;//总共有多少页
	function getData(index) { 
		var business_id=$('.business1').val();
		var module_id=$('.module1').val();
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/boss-mg-center/conf/version/v1/list_version",
			data:
			{
				"page_index": index,
				"page_size":pageSize,
				"business_id":business_id,
				"module_id":module_id
			},
			beforeSend:function()
            {
            	$('.request').show();
            },
			success: function(res) {
				$('.request').hide();
				if(res.code==1)
				{ 
					var data=res.data;
					length = res.record;
					var html = '';
					for (var i = 0; i < data.length; i++)
					{
					  html+='<tr id="'+data[i].id+'" lastVer="'+data[i].lastVer+'">'+
					 		   '<td>'+(i+1)+'</td>'+
					           '<td>'+data[i].businessName+'</td>'+
					           '<td>'+data[i].moduleName+'</td>'+
							   '<td>'+data[i].versionNum+'</td>'+
							   '<td>'+new Date(Number(data[i].publishTime)).Format("yyyy-MM-dd")+'</td>'+ 
							   '<td>'+
							        '<a class="detail">详情</a>'+
							        '<a class="edit">编辑</a>'+  
							   '</td>'+
							 '</tr>';
					}
					$('#dataList tbody').html(html); 
					pages = Math.ceil(length / pageSize); 
					var str=page(pages,index);
					$('.box').html(str); 
				}else
				{
					alert(res.message);
				}
				
			 
			}
		});
   }
	
       
       