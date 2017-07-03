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
	
	//新建启动图
	 $('.create').click(function(){
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
        $('.previewGraph').hide();
//      $('.pictureName').html('');
        $('.jump').val("true");
        $('.jumpUrl').show();
        $('.jumpUrlCont').val("");
        editId='';
        imgUrl="";
        file="";
        $('.uploadFile').text('点击上传本地图片');
	 })
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
			url:api+"/boss-mg-center/conf/launch/v1/remove_launch",
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
	//预览事件
	$('tbody').on('click','.preview',function(){
		$('#preview').modal(); 
		var path=$(this).attr('path');
		if(path!=="")
		{
			$('.picture').attr('src',path);
		}else
		{
			$('.picture').attr('src',"../img/bg.png");
		} 
//		var imgTitle=path.substring(path.lastIndexOf("/")+1,path.length);
//		$('.pictureName').html(imgTitle)
	})
	
	//编辑事件
	var editId='';
	var last_ver='';
	var imgUrl="";
	$('tbody').on('click','.edit',function(){ 
		editId=$(this).parents('tr').attr('id'); 
		last_ver=$(this).parents('tr').attr('lastVer'); 
		$('.tabHead a:nth-child(2)').addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq(1).show().siblings().hide(); 
		$('.previewGraph').show();
		$.ajax({
			type:"post",
			url:api+"/boss-mg-center/conf/launch/v1/get_launch_detail",
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
					imgUrl=data.path;
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
					$('.picture').attr('src',data.path);
					$('.uploadFile').text('图片已传');
					/*var imgTitle=data.path.substring(data.path.lastIndexOf("/")+1,data.path.length);
					$('.pictureName').html(imgTitle);*/
					if(data.jump)
					{
					   $('.jump option').eq(0).prop("selected","selected");
					   $('.jumpUrl').show();
					   $('.jumpUrlCont').val(data.jumpUrl); 
					}
					else
					{
					   $('.jump option').eq(1).prop("selected","selected");
					   $('.jumpUrl').hide();
					   $('.jumpUrlCont').val(""); 
					}
				}else
				{
					alert(res.message);
				}
			}
		}); 
	})
	 
	 
	
	//跳转URL显示隐藏
	$('.jump').change(function(){
		if($(this).val()=='true')
		{
			$('.jumpUrl').show();
		}else
		{
			$('.jumpUrl').hide();
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
//					$('.pictureName').text(name); 
					$('.previewGraph').show();
					$('.uploadFile').text('图片已传');
					$('input[type=file]').wrap('<form>').closest('form').get(0).reset();
				};
				fr.readAsDataURL(imgFile);
			 } 
	 	} 
		
	 }) 
	//保存事件
	$('.save').click(function(){   
		var business_id=$('.business2').val();
		var module_id=$('.module2').val();
		var is_jump=$(".jump").val()=='true'?true:false; 
		var jump_url=$('.jumpUrlCont').val(); 
		if(is_jump==true && jump_url=="")
		{
			alert("请填写跳转URL");
			return;
		}
		if (imgUrl == ""||imgUrl==undefined) {
            alert("请选择图片");
            return;
        }
        var formData = new FormData();
        if(file)
        {
        	formData.append('file', file); 
        } 
        formData.append('businessId', business_id); 
        formData.append('moduleId', module_id); 
        formData.append('jump', is_jump); 
        formData.append('jumpUrl', jump_url); 
        if(editId!=='')
        {
        	formData.append('id', editId);
        	formData.append('lastVer', last_ver);
        } 
		//添加启动图
		if(editId=="")
		{ 
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/launch/v1/add_launch",
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
						$('.jumpUrlCont').val('');  
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
			//修改启动图
			$.ajax({
				type:"post",
				url:api+"/boss-mg-center/conf/launch/v1/modify_launch",
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
						$('.jumpUrlCont').val('');  
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
})

function beforeUpload(file) {
  var isJpg = file.type === 'image/jpg';
  var isPng = file.type === 'image/png';
  var isJpeg = file.type === 'image/jpeg';
  if (!isJpg&&!isPng&&!isJpeg)
  {
    alert('格式仅支持jpg、png、jpeg！');
    return false;
  }
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
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/boss-mg-center/conf/launch/v1/list_launch",
			data: {
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
							   '<td>'+$('.business1 option[value="'+data[i].businessId+'"]').text()+'</td>'+
							   '<td>'+$('.module1 option[value="'+data[i].moduleId+'"]').text()+'</td>'+
							   '<td>'+data[i].opUserName+'</td>'+
							   '<td>'+new Date(data[i].createTime).Format("MM-dd hh:mm")+'</td>'+ 
							   '<td><a class="edit">编辑</a>'+
							   	    '<a class="preview" data-am-modal="{target: "#preview"}" path="'+data[i].path+'">预览</a>'+
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
	
       
       