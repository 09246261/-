$(function(){
	//所属模块
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
	                var businessHtml=''; 
	                var moduleHtml='';
	                for(var i=0;i<business.length;i++)
	                {
	                	businessHtml+='<option value="'+business[i].id+'">'+business[i].name+'</option>'; 
	                	moduleHtml+='<input type="radio" id="'+business[i].id+'" name="module"/>'+business[i].name+'';
	                }  
	                $('.business').html(businessHtml);
	                $('.module').append(moduleHtml);
	                getData(index);
					bgColor(key,pages); 
				}else
				{
					alert(res.message);
				}
			}
		}); 
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
	
	//删除事件
	var delId='';
	$('tbody').on('click','.del',function(){
		$('#delModel').modal(); 
		delId=$(this).parents('tr').attr('id'); 
	})
	$('.sure').click(function(){
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/msg/v1/remove_system_msg",
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
	
	
	 
	//编辑事件
	var editId=''; 
	var pushStatus="";
	var lastVer='';
	$('tbody').on('click','.edit',function(){
		editId=$(this).parents('tr').attr('id');  
		pushStatus=$(this).parents('tr').attr('pushStatus');  
		lastVer=$(this).parents('tr').attr('lastVer'); 
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();   
		//可编辑
		$('.pushTitle').removeProp('disabled');
		$('.pushIntro').removeProp('disabled');
		$('.w-e-text').prop('contenteditable',"true");
		
		if(pushStatus=="1")
		{
			//已发布 
			$('.btn-box .next').hide().siblings().show();
			//不可编辑
			$('input[type="radio"]').prop('disabled','disabled');
			$('.pushTime').prop('disabled','disabled');
			$('.pushRange').prop('disabled','disabled');
			$('#datetimepicker').prop('disabled','disabled');
			$('.shopCode').prop('disabled','disabled');
			$('.areaAdd').prop('disabled','disabled');
		}else
		{
			//待发布 
			$('.btn-box .next').show().siblings().hide();
			//可编辑
			$('input[type="radio"]').removeProp('disabled');
			$('.pushTime').removeProp('disabled');
			$('.pushRange').removeProp('disabled');
			$('#datetimepicker').removeProp('disabled');
			$('.shopCode').removeProp('disabled');
			$('.areaAdd').removeProp('disabled');
			
		} 
		messageDetail(editId);
	})
	
	//新建通知
	$('.createMsg').click(function(){  
		$('input[type="radio"]').removeProp('checked');
		$('input[type="radio"]').removeProp('disabled');
		//可编辑
		$('.pushTime').removeProp('disabled');
		$('.pushRange').removeProp('disabled'); 
		$('#datetimepicker').removeProp('disabled');
		$('.shopCode').removeProp('disabled');
		$('.areaAdd').removeProp('disabled'); 
		$('.pushTitle').removeProp('disabled');
		$('.pushIntro').removeProp('disabled');
		$('.w-e-text').prop('contenteditable',"true");
		
		$('.btn-box .next').show().siblings().hide(); 
		$('.pushTime').val(1); 
		$('.dateTime').show();
		$('#datetimepicker').val("");
		$('.pushRange').val(0);  
		$('.pushBox').hide(); 
		$('.pushTitle').val('');
		$('.pushIntro').val('');
		editor.txt.html('');
		editId=""; 
		msgId="";
	})
	
	$('.tabHead a:nth-child(1)').click(function(){
		getData(index);
		bgColor(key,pages); 
	})
	
	$('#cancel').click(function(){
		//可编辑
		$('input[type="radio"]').removeProp('disabled');
		$('.pushTime').removeProp('disabled');
		$('.pushRange').removeProp('disabled');
		$('#datetimepicker').removeProp('disabled');
		$('.shopCode').removeProp('disabled');
		$('.areaAdd').removeProp('disabled'); 
		$('.pushTitle').removeProp('disabled');
		$('.pushIntro').removeProp('disabled');
		$('.w-e-text').prop('contenteditable',"true");
	})
	
	//详情事件
	$('tbody').on('click','.detail',function(){
		var detailId=$(this).parents('tr').attr('id'); 
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide();  
		$('.btn-box .cancel').show().siblings().hide(); 
		//不可编辑
		$('input[type="radio"]').prop('disabled','disabled');
		$('.pushTime').prop('disabled','disabled');
		$('.pushRange').prop('disabled','disabled');
		$('#datetimepicker').prop('disabled','disabled')
		$('.shopCode').prop('disabled','disabled');
		$('.areaAdd').prop('disabled','disabled');
		$('.pushTitle').prop('disabled','disabled');
		$('.pushIntro').prop('disabled','disabled');
		$('.w-e-text').prop('contenteditable',"false");
		
		messageDetail(detailId);
	})
	
	 function messageDetail(id)
	 {
	 	$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/msg/v1/get_system_msg_detail",
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
					var content=data.content;
					/*content=content.split('<body>')[1].split('</body>')[0];  */
					$('#'+data.businessId).prop('checked','checked'); 
					editor.txt.html(content);
					$('.pushIntro').val(data.intro);
					$('.pushTitle').val(data.title);
					//推送类型
					if(data.pushType==1)
					{
						$('.pushTime').val(1); 
						$('.dateTime').show();
						$('#datetimepicker').val(new Date(data.predictPushTime).Format("yyyy-MM-dd hh:mm"));
					}else
					{
						$('.pushTime').val(0);  
						$('.dateTime').hide();
						$('#datetimepicker').val('');
					}
					//推送范围
					if(data.pushScope==0)
					{
						$('.pushRange').val(0);  
						$('.pushBox').hide();
						top.postMessage($("body").height(),domain);
					}else if(data.pushScope==1)
					{
						$('.pushRange').val(1);
						$('.pushBox').show();
						$('.areabox').show().siblings('.shopCode').hide();
						top.postMessage($("body").height(),domain);
						var rule=JSON.parse(data.rule);
						var html='';
						for(var i=0;i<rule.length;i++)
						{
							html+='<div class="areaItem" tag="'+rule[i].tag+'" name="'+rule[i].name+'">'+rule[i].name+'<span>-</span></div>';
						}
						$('.area').html('');
						$('.area').html(html); 
					}else
					{
						$('.pushRange').val(2);
						$('.pushBox').show();
						$('.shopCode').show().siblings('.areabox').hide();
						top.postMessage($("body").height(),domain);
						$('.shopCode').val(data.rule); 
					}
					
				}else
				{
					alert(res.message);
				}
			}
		});
	 }
	//推送时间为定时推送时，右侧出现设置框
	$('.pushTime').change(function(){
		if($(this).val()=='1')
		{
			$('.dateTime').show();
		}else
		{
			$('.dateTime').hide();
		}
	})
	
	//推送范围 对应内容显示与隐藏
	$('.pushRange').change(function(){ 
		if($(this).val()=="0")
		{
			$('.pushBox').hide(); 
			top.postMessage($("body").height(),domain);
		}
		if($(this).val()=="2")
		{
			$('.pushBox').show();
			$('.shopCode').show().siblings('.areabox').hide(); 
			top.postMessage($("body").height(),domain);
		}
		if($(this).val()=="1")
		{
			$('.pushBox').show();
			$('.areabox').show().siblings('.shopCode').hide(); 
			top.postMessage($("body").height(),domain);
		}
	})
	
	//输入店铺编码时，输入delete删除
	$('textarea').keyup(function(){
		var val=$(this).val();
		if(val.indexOf('delete')>0)
		{
			$(this).val('');
		}
	})
	
	//点击+号弹出选择地区
	var proviceData;
	var cityData;
	var areaData;
	$('.areaAdd').click(function(){ 
		$('#district').modal();
		$('#cmbCountry option:nth-child(1)').prop('selected','selected'); 
		var html='<option value="">全部</option>';
		for(var i=0;i<proviceData.length;i++)
		{
			html+='<option value="'+proviceData[i].id+'" tag="province_'+proviceData[i].id+'">'+proviceData[i].name+'</option>'
		} 
		$('#cmbProvince').html(html);
		$('#cmbCity').html('<option value="">全部</option>');
		$('#cmbArea').html('<option value="">全部</option>');
		$('#cmbCity').prop('disabled',true);
		$('#cmbArea').prop('disabled',true); 
	})	 
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/common/area/v1/list_all_country",
			success:function(res){
				if(res.code==1)
				{
					var data=res.data;
					var html='';
					for(var i=0;i<data.length;i++)
					{
						html+='<option value="'+data[i].id+'"  tag="country_'+data[i].id+'">'+data[i].name+'</option>'
					} 
					$('#cmbCountry').html(html);
					//省
					var countryId=data[0].id;
					$.ajax({
						type:"post",
						url:api+"/boss-mg-center/common/area/v1/list_all_province",
						data:
						{
							"countryId":countryId
						},
						success:function(res){
							if(res.code==1)
							{
							    var data=res.data; 
							    proviceData=data;
								var html='<option value="">全部</option>';
								for(var i=0;i<data.length;i++)
								{
									html+='<option value="'+data[i].id+'" tag="province_'+data[i].id+'">'+data[i].name+'</option>'
								} 
								$('#cmbProvince').html(html);
								//市
								var provinceId=data[0].id;
								$.ajax({
									type:"post",
									url:api+"/boss-mg-center/common/area/v1/list_all_city",
									data:
									{
										"provinceId":provinceId
									},
									success:function(res){
										if(res.code==1)
										{
										    var data=res.data; 
										    cityData=data;
											var html='<option value="">全部</option>';
											for(var i=0;i<data.length;i++)
											{
												html+='<option value="'+data[i].id+'" tag="city_'+data[i].id+'">'+data[i].name+'</option>'
											} 
											$('#cmbCity').html(html);
											//区
											var cityId=data[0].id;
											$.ajax({
												type:"post",
												url:api+"/boss-mg-center/common/area/v1/list_all_town",
												data:
												{
													"cityId":cityId
												},
												success:function(res){
													if(res.code==1)
													{
													    var data=res.data; 
													    areaData=data;
														var html='<option value="">全部</option>';
														for(var i=0;i<data.length;i++)
														{
															html+='<option value="'+data[i].id+'" tag="town_'+data[i].id+'">'+data[i].name+'</option>'
														} 
														$('#cmbArea').html(html);
														
													}else
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
							}else
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
 
	//国家change
	$('#cmbCountry').change(function(){
		var id=$(this).val();
		var html='<option value="">全部</option>';
		$('#cmbCity').html('<option value="">全部</option>');
		$('#cmbArea').html('<option value="">全部</option>');
		$('#cmbCity').prop('disabled',true);
		$('#cmbArea').prop('disabled',true); 
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/common/area/v1/list_all_province",
			data:
			{
				"countryId":id
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
					if(data!==null&&data.length>0)
					{
						for(var i=0;i<data.length;i++)
						{ 
							html+='<option value="'+data[i].id+'" tag="province_'+data[i].id+'">'+data[i].name+'</option>' ;
						} 
						$('#cmbProvince').html(html);
					}else
					{
						$('#cmbProvince').html(html);
					}
					
				}else
				{
					alert(res.message);
				}
			}
		});  
	    
	})
	
	
	//省change
	$('#cmbProvince').change(function(){
		var id=$(this).val();
		var html='<option value="">全部</option>';
		if($(this).val()=="")
		{
			$('#cmbCity').prop('disabled',true);
			$('#cmbArea').prop('disabled',true); 
			return;
		}
		else
		{
			$('#cmbCity').removeProp('disabled'); 
		}
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/common/area/v1/list_all_city",
			data:
			{
				"provinceId":id
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
					if(data!==null&&data.length>0)
					{
						for(var i=0;i<data.length;i++)
						{ 
							html+='<option value="'+data[i].id+'" tag="city_'+data[i].id+'">'+data[i].name+'</option>' ;
						}
						$('#cmbCity').html(html);
					}else
					{
						$('#cmbCity').html(html);
					}
				}else
				{
					alert(res.message);
				}
			}
		});  
	})
	
	//市change 
	$('#cmbCity').change(function(){
		var id=$(this).val();
		var html='<option value="">全部</option>';
		if($(this).val()=="")
		{ 
			$('#cmbArea').prop('disabled',true);
			return;
		}
		else
		{ 
			$('#cmbArea').removeProp('disabled');
		}
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/common/area/v1/list_all_town",
			data:
			{
				"cityId":id
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
					if(data!==null&&data.length>0)
					{
						for(var i=0;i<data.length;i++)
						{ 
							html+='<option value="'+data[i].id+'" tag="town_'+data[i].id+'">'+data[i].name+'</option>' ;
						}
						$('#cmbArea').html(html);
					}else
					{
						$('#cmbArea').html(html);
					}
					
				}else
				{
					alert(res.message);
				}
			}
		});  
	}) 
	
	//地区选择后，点击确定按钮事件
	$('#ensure').click(function(){
		var value="";
		var html="";
		var tag="";
		if($('#cmbArea').val()!=="")
		{
			value=$('#cmbArea option:selected').text();
			tag=$('#cmbArea option:selected').attr('tag');
		}else if($('#cmbCity').val()!=="")
		{
			value=$('#cmbCity option:selected').text();
			tag=$('#cmbCity option:selected').attr('tag');
		}else if($('#cmbProvince').val()!=="")
		{
			value=$('#cmbProvince option:selected').text();
			tag=$('#cmbProvince option:selected').attr('tag');
		}else
		{
			value=$('#cmbCountry option:selected').text();
			tag=$('#cmbCountry option:selected').attr('tag');
		}
		html='<div class="areaItem" tag="'+tag+'" name="'+value+'">'+value+'<span>-</span></div>';
		$('.area').append(html); 
		top.postMessage($("body").height(),domain);
	})
	
	//点击-号，删除已选地区
	$('.area').on('click','span',function(){
		$(this).parent().remove();
		top.postMessage($("body").height(),domain);
	})
	
	
	
	
	//取消事件
	$('.cancel').click(function(){   
		$('input[type="radio"]').removeProp('checked');
		$('input[type="radio"]').removeProp('disabled');
		//可编辑
		$('.pushTime').removeProp('disabled');
		$('.pushRange').removeProp('disabled'); 
		$('#datetimepicker').removeProp('disabled');
		$('.shopCode').removeProp('disabled');
		$('.areaAdd').removeProp('disabled'); 
		$('.pushTitle').removeProp('disabled');
		$('.pushIntro').removeProp('disabled');
		$('.w-e-text').prop('contenteditable',"true");
		
		$('#datetimepicker').val('');
		$('.pushTime').val("1");
		$('.pushRange').val("0"); 
		$('.pushBox').hide();
		editor.txt.html('');
		$('.pushTitle').val('');
		$('.pushIntro').val('');
		$('.tabHead a:nth-child(1)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(0).show().siblings().hide();  
	})
	
	//下一步事件
	var msgId;
	$('.next').click(function(){
		var id;
		if(editId=="")
	    {
	    	id=msgId;
	    }else
	    {
	    	id=editId;
	    } 
	    $('.shop_code').val('');
	    $('.verficyCode').val('');
		var business_id=$('input[name="module"]:checked').attr('id'); 
		var content=editor.txt.html();
		var title=$('.pushTitle').val();
		var intro=$('.pushIntro').val();
		var predict_push_time;
		var push_scope=$('.pushRange').val();
		var push_type=$('.pushTime').val();
		var shopCode=$('.shopCode').val();
		var rule; 
		if(business_id==undefined || business_id=="")
		{
			alert("请选择所属模块");
			return;
		} 
		if(push_type=="1")
		{
			predict_push_time=$('#datetimepicker').val();
		} 
	    if((push_type=="1" && predict_push_time=="")||(push_type=="1" && (new Date(predict_push_time).getTime())<(new Date().getTime())))
		{ 
			alert("请设置有效的定时推送时间");
			return;
		}
		if(title=="")
		{
			alert("请填写推送标题");
			return;
		}
		if(intro=="")
		{
			alert("请填写推送简介");
			return;
		} 
		if(content=="")
		{
			alert("请填写详情内容");
			return;
		}
		if(push_scope=="1")
		{
			var areaArr=[]; 
			var len=$('.area').children().length;
			for(var i=0;i<len;i++)
			{
				var item={};
				item.tag=$('.area').children().eq(i).attr('tag');
				item.name=$('.area').children().eq(i).attr('name');
				areaArr.push(item);
			} 
			rule=JSON.stringify(areaArr);
		}else if(push_scope=="2")
		{
			rule=$('.shopCode').val(); 
		}
		if(editId=="" && msgId=="")
		{
			//添加消息  
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/msg/v1/add_system_msg",
				data:
				{
					"businessId":business_id,
					"content":content,
					"title":title,
					"intro":intro,
					"predictPushTimeStr":predict_push_time,
					"pushScope":push_scope,
					"pushType":push_type,
					"rule":rule
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
						msgId=res.data;
						$('#verficy').modal(); 
					}else
					{
						alert(res.message);
					}
				} 
			}); 
		}else
		{ 
			//待发布
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/msg/v1/modify_system_msg",
				data:
				{ 
					"id":id,
					"content":content,
					"intro":intro,
					"title":title,
					"businessId":business_id, 
					"predictPushTimeStr":predict_push_time,
					"pushScope":push_scope,
					"pushType":push_type,
					"rule":rule
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
						$('#verficy').modal(); 
					}else
					{
						alert(res.message);
					}
				}
				 
			});
			
		}
		
	})
	
   //保存事件 == 已发布的
	$('.save').click(function(){   
		var content=editor.txt.html(); 
		var intro=$('.pushIntro').val();
		var title=$('.pushTitle').val();
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/msg/v1/modify_system_msg",
			data:
			{
				"id":editId,
				"content":content,
				"intro":intro,
				"title":title
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
		
	})
	
	//发送验证
	$('.sendVerficy').click(function()
	{
		var id;
		if(editId=="")
		{
			id=msgId;
		}else
		{
			id=editId;
		}
		var shop_code=$('.shop_code').val();
		if(shop_code!=="")
		{
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/msg/v1/preview_system_msg",
				data:
				{
					"id":id,
					"shop_code":shop_code
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
						alert("发送成功");
					}else
					{
						alert(res.message);
					}
				}
			});
		}else
		{
			alert("请填写店铺编码");
		}
		
	})
	 
	//点击“确定并发布”事件
	$('#surePreview').click(function(){
		var id;
		if(editId=="")
		{
			id=msgId;
		}else
		{
			id=editId;
		}
		var verfity_code=$('.verficyCode').val();
		if(verfity_code!=="")
		{
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/msg/v1/publish_system_msg",
				data:
				{
					"id":id,
					"verify_cde":verfity_code
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
						$('#cancel').trigger('click'); 
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
			alert("请填写验证码");
		}
		
	})
	
	 
})



//数据列表加载
	var index = 1;//当前页
	var key = 1;//存储当前页 
	var pageSize=15;//每页显示数据条数
	var pages;//总共有多少页
	function getData(index) { 
		var business_id=$('.business').val(); 
		var scope;
		var status; 
		if($('.state').val()!=="")
		{
			status=$('.state').val(); 
		}
		if($('.pushArea').val()!=="")
		{
			scope=$('.pushArea').val();
		}
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/boss-mg-center/conf/msg/v1/list_system_msg",
			data: { 
				"page_index": index,
				"page_size":pageSize,
				"business_id":business_id, 
				"scope":scope,
				"status":status
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
					var pushScope;
					var pushTime; 
					for (var i = 0; i < data.length; i++)
					{
						if(data[i].pushScope==0){
							pushScope="全部"; 
						}else if(data[i].pushScope==1)
						{
							pushScope="指定区域";
						}else
						{
							pushScope="特定对象";
						}
						if(data[i].pushTime==null || data[i].pushTime==undefined){pushTime="";}else{pushTime=new Date(Number(data[i].pushTime)).Format("MM-dd hh:mm");} 
						html+='<tr id="'+data[i].id+'" lastVer="'+data[i].lastVer+'" lastVer="'+data[i].lastVer+'" pushStatus="'+data[i].pushStatus+'" >'+
					 		   '<td>'+$('.business option[value="'+data[i].businessId+'"]').text()+'</td>'+
					           '<td>'+pushScope+'</td>'+
					           '<td>'+(data[i].pushStatus==0?"待发布":"已发布")+'</td>'+ 
							   '<td>'+pushTime+'</td>'+ 
							   '<td>'+data[i].opUserName+'</td>'+
							   '<td>'+new Date(Number(data[i].createTime)).Format("MM-dd hh:mm")+'</td>'+
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
	
       
       