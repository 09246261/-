$(function(){
	//业务线模块列表  
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
	$('.business').eq(2).change(function(){
		var businessId=$(this).val();
		var moduleHtml='';
		for(var j=0;j<module.length;j++)
        {
        	if(businessId==module[j].businessId)
        	{  
        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
        	} 
        }
        $('.module').eq(2).html(moduleHtml); 
	})
	
	 
	 //查询事件
	$('.query').click(function(){
		getData(index);
		bgColor(key,pages); 
	})
	
	//下一步，获取token事件 
	$('.next').click(function(){
		var business_id=$('.business2').val();
		var module_id=$('.module2').val();
		var triggerDes=$('.triggerDes').val();
		if(triggerDes=="")
		{
			alert("触发事件描述不能为空");
			return;
		}
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/template/v1/create_token",
			data:
			{
				"business_id":business_id,
				"module_id":module_id
			},
			beforeSend:function()
            {
            	$('.request').show();
            	$('.next').prop('disabled','disabled');
            },
			success:function(res)
			{
				$('.next').removeProp('disabled');
				$('.request').hide();
				if(res.code==1)
				{  
				   var data=res.data; 
				   $('.template1').hide().siblings().show();
				   $('.triggerDesCopy').val($('.triggerDes').val());
				   $('.tokenCode').html(data);
				   $('.business3').val(business_id); 
				    var moduleHtml='';
					for(var j=0;j<module.length;j++)
			        {
			        	if(business_id==module[j].businessId)
			        	{  
			        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
			        	} 
			        }
			        $('.module').eq(2).html(moduleHtml); 
			        $('.module3').val(module_id); 
				}else
				{
					alert(res.message);
				}
			}
		});
		
	})
	//详情
	var detailId='';
	var lastVer='';
	$('tbody').on('click','.detail',function(){
		detailId=$(this).parents('tr').attr('id'); 
		lastVer=$(this).parents('tr').attr('lastVer');
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();
		$('.template1').hide().siblings().show();
		//不可编辑
		$('.business3').prop('disabled','disabled');
		$('.module3').prop('disabled','disabled');
		$('.triggerDesCopy').prop('disabled','disabled');
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/template/v1/get_push_template_detail",
			data:
            {
            	"id":detailId
            },
            beforeSend:function()
            {
            	$('.request').show();
            },
            success:function(res)
            {
            	if(res.code==1)
            	{
            		$('.request').hide();
            		var data=res.data;
            		$('.triggerDesCopy').val(data.description);
            		$('.tokenCode').html(data.token); 
            		$('.pushStatus').val(data.pushStatus);
            		$('.business3').val(data.businessId); 
				    var moduleHtml='';
					for(var j=0;j<module.length;j++)
			        {
			        	if(data.businessId==module[j].businessId)
			        	{  
			        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
			        	} 
			        }
			        $('.module').eq(2).html(moduleHtml); 
			        $('.module3').val(data.moduleId); 
            	}else
            	{
            		alert(res.message);
            	}
            }
		});
	})
	
	//新建模板
	$('.createModule').click(function(){
		$('.template1').show().siblings().hide();
		//可编辑
		$('.business3').removeProp('disabled');
		$('.module3').removeProp('disabled');
		$('.triggerDesCopy').removeProp('disabled');
		
		detailId="";
		$('.triggerDes').val(''); 
		$('.business').eq(1).children('option').eq(0).prop('selected','selected');
	 	var businessId=$('.business').eq(1).val();
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
	
	//提交 
	$('.submit').click(function(){
		var business_id=$('.business3').val();
		var module_id=$('.module3').val();
		var description=$('.triggerDesCopy').val();
		var token=$('.tokenCode').html();
		var push_status=$('.pushStatus').val();
		if(detailId=='')
		{
			//新建
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/template/v1/add_push_template",
				data:
				{
					"businessId":business_id,
					"moduleId":module_id,
					"description":description,
					"token":token,
					"pushStatus":push_status
				},
				beforeSend:function()
	            {
	            	$('.request').show();
	            	$('.submit').prop('disabled','disabled');
	            },
				success:function(res)
				{
					$('.submit').removeProp('disabled');
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
		}
		else
		{
			//修改
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/template/v1/modify_push_template",
				data:
				{
					"id":detailId,
					"pushStatus":push_status,
					"lastVer":lastVer
				},
				beforeSend:function()
	            {
	            	$('.request').show();
	            	$('.submit').prop('disabled','disabled');
	            },
				success:function(res)
				{
					$('.submit').removeProp('disabled');
					$('.request').hide();
					if(res.code==1)
					{
						detailId='';
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
		var push_status;
		var token;
		if($('#token').val()!=="")
		{
			token=$('#token').val(); 
		} 
		if($('.push_status').val()!=="")
		{
			push_status=$('.push_status').val();
		}
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/boss-mg-center/conf/template/v1/list_push_template",
			data: 
			{
				"page_index": index,
				"page_size":pageSize,
				"business_id":business_id,
				"module_id":module_id,
				"push_status":push_status,
				"token":token
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
							   '<td>'+data[i].description+'</td>'+ 
							   '<td>'+data[i].opUserName+'</td>'+
							   '<td>'+data[i].displayCreateTime+'</td>'+
							   '<td>'+(data[i].pushStatus==0?"已停止":"已开启")+'</td>'+
							   '<td>'+data[i].token+'</td>'+
							   '<td>'+
							        '<a class="detail">详情</a>'+
							   '</td>'+
							 '</tr>';
					}
					$('tbody').html(html); 
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
	
       
       