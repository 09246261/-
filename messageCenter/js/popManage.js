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
	                list_popup_trigger_event(); 
	                getData(index);
					bgColor(key,pages); 
	                 
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
        list_popup_trigger_event();
	}) 
	
	$('.module2').change(function(){
		list_popup_trigger_event();
	})
	
	//拉取弹窗事件列表
	var popup_trigger_data='';
	function list_popup_trigger_event(){
		var business_id=$('.business2').val();
		var module_id=$('.module2').val(); 
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/popup/v1/list_popup_trigger_event",
			data:
			{
				"business_id":business_id,
				"module_id":module_id
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
					popup_trigger_data=data;
					var popupHtml='';
					for(var i=0;i<data.length;i++)
					{
						popupHtml+='<option value="'+data[i].id+'" id="'+data[i].id+'">'+data[i].name+'</option>';
					}
					$('.popupTrigger').html(popupHtml);
					$('.desContent').html(data[0].description);
				}
			}
		});
	}
	$('.popupTrigger').change(function(){
		var id=$('.popupTrigger').val();
		for(var i=0;i<popup_trigger_data.length;i++)
		{
			if(id==popup_trigger_data[i].id)
			{
				$('.desContent').html(popup_trigger_data[i].description);
				break;
			}
		}
	})
	
	$('.function').select2();
	
	//拉取功能列表
	var functionListData;
	var entity_type=$('.shopType').val(); 
	functionList(entity_type);
	$('.shopType').change(function(){
		entity_type=$(this).val();
		functionList(entity_type);
	})
	
	
	function functionList(entity_type)
	{
		$.ajax({
		type:"post",
		url:api+"/boss-mg-center/conf/popup/v2/list_function",
		data:
		{
			"entity_type":entity_type
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
				if(entity_type=="0")
				{
					functionListData=res.data;
				}
				var functionHtml='';    
				for(var i=0;i<data.length;i++)
				{ 
					 functionHtml+='<option value="'+data[i].id+'">'+data[i].actionName+'('+data[i].lowestVer+')</option>';
				}  
				$('.function').html(functionHtml);
			}else
			{
				alert(res.message);
			}
		}
	 });
	}
	
	/*function functionList()
	{
		$.ajax({
		type:"post",
		url:api+"/boss-mg-center/conf/popup/v2/list_function",
		data:
		{
			"entity_type":entity_type
		},
		success:function(res)
		{
			if(res.code==1)
			{
				var data=res.data;
				functionListData=data;
				var functionHtml='';   
				var optionHtml='';
				for(var i=0;i<data.length;i++)
				{ 
					optionHtml='';
					for(var j=0;j<data[i].forwardCells.length;j++)
					{  
						optionHtml+='<option value="'+data[i].forwardCells[j].id+'">'+data[i].forwardCells[j].title+'</option>';
					}
					functionHtml+='<optgroup label="'+data[i].title+'">'+optionHtml+'</optgroup>'
				}  
				$('.function').html(functionHtml);
			}else
			{
				alert(res.message);
			}
		}
	 });
	}*/
	//查询事件
	$('.query').click(function(){
		getData(index);
		bgColor(key,pages); 
	})
	
	//删除事件
	var delId='';
	$('tbody').on('click','.del',function(){
		$('#delModel').modal(); 
		delId=$(this).parents('tr').attr('id');
	})
	$('.sure').click(function(){
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/popup/v1/remove_popup",
			data:
			{
				"id":delId
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
					getData(index);
					bgColor(key,pages); 
				}else
				{
					alert(res.message);
				}
			}
		}); 
	}) 
	
	//新建弹窗
	$('.create').click(function(){
		editId='';
		$('.business2').children('option').eq(0).prop('selected','selected');  
		
	 	var businessId=$('.business').eq(1).val();
		var moduleHtml='';
		for(var j=0;j<module.length;j++)
        {
        	if(businessId==module[j].businessId)
        	{  
        		moduleHtml+='<option value="'+module[j].id+'">'+module[j].name+'</option>';
        	} 
        }
        $('.module2').html(moduleHtml);  
        $('.popName').val('');
        $('.popupTrigger option').eq(0).prop('selected','selected');
        var id=$('.popupTrigger').val();
		for(var i=0;i<popup_trigger_data.length;i++)
		{
			if(id==popup_trigger_data[i].id)
			{
				$('.desContent').html(popup_trigger_data[i].description);
				break;
			}
		}
		
		$('.triggerPosition').val('true');
		$('.triggerType').hide();
		$('.shopType').val("0");
		var functionHtml='';    
		for(var i=0;i<functionListData.length;i++)
		{ 
			functionHtml+='<option value="'+functionListData[i].id+'">'+functionListData[i].actionName+'('+functionListData[i].lowestVer+')</option>';
		}  
		$('.function').html(functionHtml);
		$('.bottombtnSelect').val("1");
		$('.oneButton').show().siblings('.twoButton').hide();
		
        $('.oneArticle').val('');
        $('.oneInteract').val("1");
        $('.oneUrl').show();
        $('.oneUrlCont').val('');
        
        $('.leftArticle').val('');
        $('.leftInteract').val("1");
        $('.leftUrl').show();
        $('.leftUrlCont').val('');
        
        $('.rightArticle').val('');
        $('.rightInteract').val("1");
        $('.rightUrl').show();
        $('.rightUrlCont').val('');
        
        imgUrl='';
        file="";
        $('.save').show();
        $('.uploadFile').text('点击上传本地图片');
        //可编辑
       editYes();
	})
	  
	//编辑事件
	var editId='';
	var lastVer='';
	var imgUrl=""; 
	$('tbody').on('click','.edit',function(){
		file="";
		editId=$(this).parents('tr').attr('id'); 
		lastVer=$(this).parents('tr').attr('lastVer'); 
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();
		$('.save').show();
		//可编辑
		editYes();
		popupDetail(editId);
	})  
	//详情事件
	$('tbody').on('click','.detail',function(){
		var detailId=$(this).parents('tr').attr('id'); 
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();
		$('.save').hide();
		//不可编辑
		$('.business2').prop('disabled','disabled');
		$('.module2').prop('disabled','disabled');
		$('.popName').prop('disabled','disabled');
		$('.popupTrigger').prop('disabled','disabled');
		$('.triggerPosition').prop('disabled','disabled');
		$('.shopType').prop('disabled','disabled');
		$('.function').prop('disabled','disabled');
		$('#uploadFile').prop('disabled','disabled');
		$('.bottombtnSelect').prop('disabled','disabled');
		$('.oneArticle').prop('disabled','disabled');
		$('.btninteractSelect').prop('disabled','disabled');
		$('.urlItem').prop('disabled','disabled');
		$('.article').prop('disabled','disabled');
		popupDetail(detailId);
	}) 
	function editYes()
	{
		$('.business2').removeProp('disabled');
		$('.module2').removeProp('disabled');
		$('.popName').removeProp('disabled');
		$('.popupTrigger').removeProp('disabled');
		$('.triggerPosition').removeProp('disabled');
		$('.shopType').removeProp('disabled');
		$('.function').removeProp('disabled');
		$('#uploadFile').removeProp('disabled');
		$('.bottombtnSelect').removeProp('disabled');
		$('.oneArticle').removeProp('disabled');
		$('.btninteractSelect').removeProp('disabled');
		$('.urlItem').removeProp('disabled');
		$('.article').removeProp('disabled');
	}
	function popupDetail(id)
	{
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/popup/v1/get_popup_detail",
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
					var data1=data;
					imgUrl=data.path;
					$('.uploadFile').text('图片已传');
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
					$('.popupTrigger').val(data.popupTriggerEventId);
					$('.picture').attr('src',data.path); 
					$('.popName').val(data.name);
					for(var i=0;i<popup_trigger_data.length;i++)
					{
						if(data.popupTriggerEventId==popup_trigger_data[i].id)
						{
							$('.desContent').html(popup_trigger_data[i].description);
							break;
						}
					}
					//触发位置
					if(data.home==true)
					{
						$('.triggerPosition').val("true"); 
						$('.triggerType').hide();
					}else
					{
						$('.triggerPosition').val("false"); 
						$('.triggerType').show();
					}
					//功能列表 
					var entityType=data.entityType; 
					if(entityType!==null)
					{
						$('.shopType').val(entityType); 
						$('.function').html('');
						$.ajax({
							type:"post",
							url:api+"/boss-mg-center/conf/popup/v2/list_function",
							data:
							{
								"entity_type":entityType
							},
							success:function(res)
							{
								if(res.code==1)
								{
									var data=res.data; 
									var functionHtml='';    
									for(var i=0;i<data.length;i++)
									{ 
										 functionHtml+='<option value="'+data[i].id+'">'+data[i].actionName+'('+data[i].lowestVer+')</option>';
									}  
									$('.function').html(functionHtml);
									$('.function').val(data1.functionId); 
								}else
								{
									alert(res.message);
								}
							}
						});
					}
					
					//按钮
					if(data.btnNum==1){
						$('.oneButton').show().siblings('.twoButton').hide();
						
						$('.bottombtnSelect').val("1");
						top.postMessage($("body").height(),domain);
					}else
					{
						$('.oneButton').hide().siblings('.twoButton').show();
						$('.bottombtnSelect').val("2");
						top.postMessage($("body").height(),domain);
					}
					var buttonList=JSON.parse(data.button); 
					for(var i=0;i<buttonList.length;i++)
					{
						if(buttonList[i].position=="center")
						{ 
							$('.oneArticle').val(buttonList[i].name);
							$('.oneInteract').val(buttonList[i].opType); 
							if(buttonList[i].opType!=="1")
							{
								$('.oneUrl').hide();
							}else
							{
								$('.oneUrl').show();
							}
							
							$('.oneUrlCont').val(buttonList[i].jumpUrl);
						}else if(buttonList[i].position=="left")
						{
							$('.leftArticle').val(buttonList[i].name);
							$('.leftInteract').val(buttonList[i].opType);  
							if(buttonList[i].opType!=="1")
							{
								$('.leftUrl').hide();
							}else
							{
								$('.leftUrl').show();
							}
							
							$('.leftUrlCont').val(buttonList[i].jumpUrl);
						}else
						{
							$('.rightArticle').val(buttonList[i].name);
							$('.rightInteract').val(buttonList[i].opType);  
							if(buttonList[i].opType!=="1")
							{
								$('.rightUrl').hide();
							}else
							{
								$('.rightUrl').show();
							} 
							$('.rightUrlCont').val(buttonList[i].jumpUrl);
						}
					}
				}else
				{
					alert(res.message);
				}
			}
		});
	}
	
	//预览事件
	$('#previewImg').click(function(){
		var button_num=$('.bottombtnSelect').val();
		var name=$('.popName').val(); 
		if (imgUrl == ""||imgUrl==undefined) {
            alert("请选择图片");
            return;
        }
		if(name==""){alert("请填写弹窗名称");return;}
		if(button_num==1&&$('.oneArticle').val()==""){alert("请填写按钮文案");return;}
		if(button_num==2&&$('.leftArticle').val()==""){alert("请填写左按钮文案");return;}
		if(button_num==2&&$('.rightArticle').val()==""){alert("请填写右按钮文案");return;}
		if(button_num==1&&$('.oneInteract').val()==1&&$('.oneUrlCont').val()==""){alert("请填写跳转URL");return;}
		if(button_num==2&&$('.leftInteract').val()==1&&$('.leftUrlCont').val()==""){alert("请填写跳转URL");return;}
		if(button_num==2&&$('.rightInteract').val()==1&&$('.rightUrlCont').val()==""){alert("请填写跳转URL");return;}
		$('#preview').modal(); 
		if(button_num==1)
		{
			$('.oneBtn').show().siblings().hide();
			$('.oneBtn').html($('.oneArticle').val());
		}else
		{
			$('.oneBtn').hide().siblings().show();
			$('.leftButton').html($('.leftArticle').val());
			$('.rightButton').html($('.rightArticle').val());
		}
		
	})
	//保存事件
	$('.save').click(function(){  
		var business_id=$('.business2').val();
		var module_id=$('.module2').val();
		var button_num=$('.bottombtnSelect').val();
		var entity_type=$('.shopType').val(); 
		var popup_trigger_event_id=$('.popupTrigger').val();
		var name=$('.popName').val(); 
		var functionName=$('.popupTrigger option:selected').text();
		var home=$('.triggerPosition').val()=="true"?true:false;
		var function_id=(home==true)?'':$('.function').val(); 
		if(home==false&&($('.function').val()=="" || $('.function').val()==undefined))
		{
			alert("请选择对应的功能项");
			return;
		}
		if(name==""){alert("请填写弹窗名称");return;}
		if(button_num==1&&$('.oneArticle').val()==""){alert("请填写文案");return;}
		if(button_num==2&&$('.leftArticle').val()==""){alert("请填写文案");return;}
		if(button_num==2&&$('.rightArticle').val()==""){alert("请填写文案");return;}
		if(button_num==1&&$('.oneInteract').val()==1&&$('.oneUrlCont').val()==""){alert("请填写跳转URL");return;}
		if(button_num==2&&$('.leftInteract').val()==1&&$('.leftUrlCont').val()==""){alert("请填写跳转URL");return;}
		if(button_num==2&&$('.rightInteract').val()==1&&$('.rightUrlCont').val()==""){alert("请填写跳转URL");return;}
		if (imgUrl == ""||imgUrl==undefined) {
            alert("请选择图片");
            return;
        }
		var button_list;
		if(button_num==1)
		{
			button_list=
			[
			   {
				"name":$('.oneArticle').val(),
				"opType":$('.oneInteract').val(),
				"position":"center",
				"jumpUrl":$('.oneUrlCont').val()
			   }
			]
		}else
		{
			button_list=[
			   {
					"name":$('.leftArticle').val(),
					"opType":$('.leftInteract').val(),
					"position":"left",
					"jumpUrl":$('.leftUrlCont').val()
				},
				{
					"name":$('.rightArticle').val(),
					"opType":$('.rightInteract').val(),
					"position":"right",
					"jumpUrl":$('.rightUrlCont').val()
				}
			]
			
		} 
		 
		var formData = new FormData(); 
        formData.append('businessId', business_id); 
        formData.append('moduleId', module_id); 
        formData.append('btnNum', button_num); 
        if(file)
        {
        	formData.append('file', file); 
        }  
        formData.append('popupTriggerEventId', popup_trigger_event_id); 
        formData.append('name', name);  
        formData.append('home', home); 
        formData.append('button', JSON.stringify(button_list)); 
        formData.append('functionName', functionName);  
        if(home==false)
        { 
          formData.append('entityType', entity_type);
          formData.append('functionId', function_id); 
        } 
        if(editId!=='')
        {
        	formData.append('id', editId);
        	formData.append('lastVer', lastVer);
        } 
		
		if(editId=='')
		{
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/popup/v1/add_popup",
				cache : false,
                data : formData,
                processData : false,
                contentType : false,
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
					    file="";
					}else
					{
						alert(res.message);
					}
				}
			});
		}else
		{
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/popup/v1/modify_popup",
				cache : false,
                data : formData,
                processData : false,
                contentType : false,
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
					    file="";
					}else
					{
						alert(res.message);
					}
				}
			});
		}
		
	})
	
	//首页，非首页
	$('.triggerPosition').change(function(){
		if($(this).val()=="true")
		{
			$('.triggerType').hide();
		}else
		{
			$('.triggerType').show();
		}
	})
	 
	//按钮设置显示
	$('.bottombtnSelect').change(function(){
		if($(this).val()=='1')
		{
			$('.oneButton').show().siblings('.twoButton').hide();
			top.postMessage($("body").height(),domain);
		}else
		{
			$('.oneButton').hide().siblings('.twoButton').show();
			top.postMessage($("body").height(),domain);
		}
	})
	 
	//跳转URL显示隐藏
	$('.btninteractSelect').change(function(){
		if($(this).val()=="1")
		{
			$(this).parents('.groupItem').siblings().show();
		}else
		{
			$(this).parents('.groupItem').siblings().hide();
		}
	})
	 
	
	//图片上传预览事件
	 var file;
	 $('#uploadFile').change(function(){
	     var imgFile = this.files[0];
	     if(imgFile)
	     {
	     	imgUrl=imgFile;
	     	file=imgFile;
	     	if(beforeUpload(imgFile))
			 {
			 	var name=imgFile.name.split('.')[0];
				var fr = new FileReader();
				fr.onload = function() { 
					$('.picture').attr('src',fr.result);  
					$('.uploadFile').text('图片已传');
					$('input[type=file]').wrap('<form>').closest('form').get(0).reset();
				};
				fr.readAsDataURL(imgFile);
			 } 
	     }
		 
	 })
	 
})

function beforeUpload(file) { 
  var size = file.size / 1024 / 1024 < 1;
  if (!size)
  {
    alert('图片大小不得超过1MB！');
    return false;
  } 
  return true;
}

//数据列表加载
	var index = 1;//当前页
	var key = 1;//存储当前页 
	var pageSize=15;//每页显示数据条数
	var pages;//总共有多少页
	function getData(index) { 
		var business_id=$('.business1').val();
		var module_id=$('.module1').val();
		var button_num=$('.button_num').val();
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/boss-mg-center/conf/popup/v1/list_popup",
			data: {
				"page_index": index,
				"page_size":pageSize,
				"business_id":business_id,
				"module_id":module_id,
				"button_num":button_num
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
							   '<td>'+$('.business1 option[value="'+data[i].businessId+'"]').text()+'</td>'+
							   '<td>'+$('.module1 option[value="'+data[i].moduleId+'"]').text()+'</td>'+
							   '<td>'+data[i].name+'</td>'+
							   '<td>'+data[i].btnNum+'</td>'+
							   '<td>'+data[i].opUserName+'</td>'+ 
							   '<td>'+new Date(data[i].createTime).Format("yyyy-MM-dd")+'</td>'+ 
							   '<td>'+
							        '<a class="detail">详情</a>'+
							        '<a class="edit">编辑</a>'+ 
							   	    '<a class="del"  data-am-modal="{target: "#delModel"}">删除</a>'+
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
	
       
       