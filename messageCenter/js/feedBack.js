$(function(){ 
	//业务线模块列表
	list_business_module(); 
	function list_business_module()
	{
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
	}
	$('.business').change(function(){
		var businessId=$(this).val();
		var moduleHtml='';
		for(var j=0;j<module.length;j++)
        {
        	if(businessId==module[j].businessId)
        	{  
        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
        	} 
        }
        $('.module').html(moduleHtml); 
	})  
	 //查询事件
	$('.query').click(function(){
		getData(index);
		bgColor(key,pages); 
	})
	 
	//反馈图 ，点击查看原图
	$('.feedbackImg').on('click','img',function(){
		if($(this).attr('flag')=='true')
		{ 
			var imgs = new Image(); 
			$(imgs).attr('src',$(this).attr('src')); 
			$(this).width(imgs.width);
			$(this).height(imgs.height); 
			$(this).attr('flag','false'); 
			top.postMessage($("body").height(),domain);
		}else
		{ 
			$(this).width(100);
			$(this).height(100); 
			$(this).attr('flag','true'); 
			top.postMessage($("body").height(),domain);
		} 
	})
	$('.feedList').click(function(){
		$('.feedDetail').hide();
	})
	
	//详情事件
	var id=''; 
	var lastVer='';
	var isFollow;
	$('tbody').on('click','.detail',function(){
		$('.feedDetail').show();
		$('.tabHead a:nth-child(2)').trigger('click');
		id=$(this).parents('tr').attr('id'); 
		lastVer=$(this).parents('tr').attr('lastVer'); 
		isFollow=$(this).parents('tr').attr('isFollow'); 
		//不可编辑
		$('.businessName').prop('disabled','disabled');
		$('.moduleName').prop('disabled','disabled');
		$('.appVersion').prop('disabled','disabled');
		$('.appSystem').prop('disabled','disabled');
		$('.shopCode').prop('disabled','disabled');
		$('.shopName').prop('disabled','disabled');
		$('.contactWay').prop('disabled','disabled');
		$('.feedBackContent').prop('disabled','disabled');
		
		if(isFollow=="true"){
			//已跟进
			$('.submit').hide();
			$('.followContent').prop('disabled','disabled'); 
		}else{
			//未跟进
			$('.submit').show();
			$('.followContent').removeProp('disabled'); 
		}
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/feedback/v1/get_feedback_detail",
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
					$('.businessName').val(data.businessName);
					$('.moduleName').val(data.moduleName);
					$('.appVersion').val(data.appVersion);
					$('.appSystem').val(data.appSystem);
					$('.shopCode').val(data.shopCode);
					$('.shopName').val(data.shopName);
					$('.contactWay').val(data.contactWay);
					$('.feedBackContent').val(data.content);
					$('.followContent').val(data.followContent);
					var feedbackImageList=data.feedbackImageList;
					var html=''; 
					for(var i=0;i<feedbackImageList.length;i++)
					{ 
						html+='<img src="'+feedbackImageList[i]+'"  flag="true" />';
					}
					$('.feedbackImg').html(html); 
					top.postMessage($("body").height(),domain);
				}else
				{
					alert(res.message);
				}
			}
		});
	})
	
	//提交按钮
	$('.submit').click(function(){ 
		var follow=$('.feedBackContent').val();
		var followContent=$('.followContent').val();
		if(followContent=="")
		{
			alert("请输入跟进内容");
			return;
		}
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/feedback/v1/modify_feedback",
			data:
			{
				"id":id, 
				"lastVer":lastVer,
				"followContent":followContent
			},
			beforeSend:function()
            {
            	$('.request').show();
            	$('.submit').prop('disabled','disabled');
            },
			success:function(res)
			{
				$('.request').hide();
				$('.submit').removeProp('disabled');
				if(res.code==1)
				{ 
					$('.feedDetail').hide();
					$('.tabHead a:nth-child(1)').trigger('click'); 
					getData(index);
					bgColor(key,pages); 
				}else
				{
					alert(res.message);
				}
			}
		});
	})
	
})
 
//数据列表加载
	var index = 1;//当前页
	var key = 1;//存储当前页 
	var pageSize=15;//每页显示数据条数
	var pages;//总共有多少页
	function getData(index) { 
		var business_id=$('.business').val();
		var module_id=$('.module').val();  
		var is_follow=$('.isFollow').val()==""?"":$('.isFollow').val()=="true"?true:false;
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/boss-mg-center/conf/feedback/v1/list_feedback",
			data:
			{
				"page_index": index,
				"page_size":pageSize,
				"business_id":business_id,
				"module_id":module_id,
				"is_follow":is_follow
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
					  html+='<tr id="'+data[i].id+'" lastVer="'+data[i].lastVer+'" isFollow="'+data[i].follow+'">'+
					           '<td>'+(i+1)+'</td>'+
							   '<td>'+data[i].businessName+'</td>'+
							   '<td>'+data[i].moduleName+'</td>'+
							   '<td>'+data[i].shopName+'</td>'+ 
							   '<td>'+data[i].contactWay+'</td>'+ 
							   '<td>'+(data[i].content.length>30?data[i].content.substr(0,30)+"...":data[i].content)+'</td>'+ 
							   '<td>'+data[i].displayCreateTime+'</td>'+ 
							   '<td><input type="checkbox" '+(data[i].follow==true?"checked":"")+'/></td>'+ 
							   '<td>'+data[i].opUserName+'</td>'+ 
							   '<td>'+
							        '<a class="detail">详情</a>'+
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
	
       
       