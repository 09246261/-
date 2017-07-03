$(function(){  
	 $('.tabHead a').click(function(){ 
		$(this).addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq($(this).index()).show().siblings().hide();
		frameHeight();
	})
	//一级分类 
	 $.ajax({
			type:"post",
			url:api+"/artFaqKind/getArtFaqKindByParentId",
			data:
			{
				"parentId":0
			},
			success:function(res)
			{  
				if(res.success==true)
				{ 
					var html=''; 
					var data=res.model;
					for(var i=0;i<data.length;i++)
					{
						html+='<option id='+data[i].id+' value='+data[i].id+'>'+data[i].name+'</option>';
					}
					$('.firstSort').html(html);
					$('.parentSort').html(html);
					$('.parentSort1').html(html);
					var parentId=$('.firstSort option:selected').attr('id');
					//二级分类 
					secondSort(parentId);
					
				}
			}
		});   
	//搜索事件
	$('.searchBtn').click(function(){   
       getData(index);
	   bgColor(key,pages);  
	})
	//一级分类
	$('.firstSort1').change(function(){ 
		var parentId=$(this).val();
		secondSort(parentId);
	})
	//二级分类
	$('.secondSort1').change(function(){   
       getData(index);
	   bgColor(key,pages);  
	})
	
	//新建二级分类 
	$('.createSure1').click(function(){
		var name=$('.sortName').val();
		var parentId=$('.parentSort option:selected').attr('id'); 
		if(name==''){alert("请填写二级分类名称");return;}
		if(parentId==''||parentId==undefined){alert('请选择二级分类');return;}
		$.ajax({
			type:"post",
			url:api+"/artFaqKind/addArtFaqKind",
			data:
			{
				"name":name,
				"parentId":parentId
			},
			success:function(res)
			{
				if(res.success==true)
				{
					$('.cancel').trigger('click');
					$('.sortName').val(''); 
	   				secondSort(parentId);
				}else
				{
					alert(res.message);
				}
			}
		});
	})
	
	//二级分类数据获取
    function secondSort(parentId)
    {
    	$.ajax({
			type:"post",
			url:api+"/artFaqKind/getArtFaqKindByParentId",
			data:
			{
				"parentId":parentId
			},
			success:function(res)
			{  
				if(res.success==true)
				{
					var html='<option value="">全部</option>';
					var data=res.model;
					for(var i=0;i<data.length;i++)
					{
						html+='<option value='+data[i].id+'>'+data[i].name+'</option>';
					}
					$('.secondSort').html(html);
					getData(index);
	   				bgColor(key,pages);  
				}else
				{
					alert(res.message);
				}
			}
		});
    }  
    
	$('.modal').click(function(){
    	$('.list').addClass('active').siblings().removeClass('active');
    })
	
	//上移事件 
	$('tbody').on('click','.up',function(){
		var id=$(this).parents('tr').attr('id');
		var sortCode=$(this).attr('sortCode'); 
		var parentId=$('.firstSort option:selected').attr('id');
        if("disable"==$(this).attr("disable")){
            return ;
        }
        $.ajax({
            type:"post",
            url:api+"/artFaqKind/sortSingleUp",
            data:
                {
                    "id":id,
                    "parentId":parentId,
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
	})
	
	//下移事件
	$('tbody').on('click','.down',function(){ 
		var id=$(this).parents('tr').attr('id');
		var sortCode=$(this).attr('sortCode'); 
		var parentId=$('.firstSort option:selected').attr('id');
        if("disable"==$(this).attr("disable")){
            return ;
        }
        $.ajax({
            type:"post",
            url:api+"/artFaqKind/sortSingleDown",
            data:
                {
                    "id":id,
                    "parentId":parentId,
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
	})
	
	//置顶事件
	$('tbody').on('click','.sortTop',function(res){ 
		var id=$(this).parents('tr').attr('id'); 
		var sortCode=$(this).attr('sortCode'); 
		var parentId=$('.firstSort option:selected').attr('id');
		if(sortCode!=="0")
		{
			$.ajax({
				type:"post",
				url:api+"/artFaqKind/sortTop",
				data:
				{
					"id":id,
					"parentId":parentId,
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
	
	//编辑事件
	var editId='';
	$('tbody').on('click','.edit',function(){  
		editId=$(this).parents('tr').attr('id'); 
		var name=$(this).parents('tr').attr('name'); 
		var parentId=$(this).parents('tr').attr('parentId');   
		$('.sortName1').val(name); 
		$('.parentSort1').val(parentId);
	}) 
	
	$('.createSure2').click(function(){
		var title=$('.sortName1').val();
		var parentId=$('.parentSort1 option:selected').attr('id');
		$.ajax({
			type:"post",
			url:api+"/artFaqKind/updateArtFaqKind",
			data:
			{
				"id":editId,
				"name":title,
				"parentId":parentId
			},
			success:function(res)
			{
				if(res.success==true)
				{
					getData(index);
	   				bgColor(key,pages); 
	   				$('.cancel').trigger('click');
				}else
				{
					alert(res.message);
				}
			}
		});
	})
	 
	
	//删除事件
	var deleteId='';
	$('tbody').on('click','.del',function(){
		 deleteId=$(this).parents('tr').attr('id'); 
	})
	$('.delSure').click(function(){
		$.ajax({
			type:"post",
			url:api+"/artFaqKind/deleteArtFaqKind",
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
	 
    
})
 
  

//数据列表加载
	var index = 1;//当前页
	var key = 1;//存储当前页 
	var pageSize=10;//每页显示数据条数
	var pages;//总共有多少页 
	var downIndex;
	function getData(index) { 
		var title=$('#searchText').val(); 
		var parentId;
		var id;
		if($('.secondSort1').val()=="")
		{
			parentId=$('.firstSort1').val();
		}else
		{
			id=$('.secondSort1').val();
		}
		key = index;
		var length; 
		$.ajax({
			type: "post",
			url: api+"/artFaqKind/list",
			data: 
			{
				"pageSize": pageSize,
				"pageIndex": index,  
				"parentId":parentId,
				"name": title, 
				"id":id
			},
			success: function(res) { 
				if(res.success==true)
				{
					var data=res.models;
					length = res.totalRecord;
					var html = '';
					var str=$('.firstSort1').val();
					for (var i = 0; i < data.length; i++)
					{   
					  downIndex=length==(i+pageSize*(index-1)+1);
					  html+='<tr id='+data[i].id+' name="'+data[i].name+'" parentId="'+data[i].parentId+'">'+
							   '<td>'+$('#'+data[i].parentId).text()+'</td>'+
							   '<td>'+data[i].name+'</td>'+ 
							   '<td><a class="sortTop" style="background: '+((i+pageSize*(index-1))==0?"#E6E6E6":"")+'" sortCode='+data[i].sortCode+'>置顶</a>'+
							   '<a class="edit" data-toggle="modal" data-target="#editModal">编辑</a>'+
							   '<a class="up" '+((i+pageSize*(index-1))==0?'style="background:#E6E6E6" disable="disable"':'')+' sortCode='+data[i].sortCode+'>上移</a>'+
							   '<a class="down" '+(length==(i+pageSize*(index-1)+1)?'style="background:#E6E6E6" disable="disable"':'')+' sortCode='+data[i].sortCode+'>下移</a>'+
							   '<a class="del" data-toggle="modal" data-target="#delModel" >删除</a>'+ 
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
	

		