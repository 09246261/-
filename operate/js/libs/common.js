/*var local = window.location;
var contextPath = local.pathname.split("/")[1];
var api=local.protocol+"//"+local.host+"/"+contextPath;*/
var api="http://10.1.5.240:8080/boss-mg-center";
$(function(){ 
	//refresh
	$('.refresh').click(function(){
		
		window.location.reload();
	})
	   
	//pagination  the previous and next page event
	$("#prev").click(function(){ 
		var now = key == 1?1:(key-1);
		getData(now);
		bgColor(key,pages);
	})
	$("#next").click(function(){  
		var now = key ==pages?pages : (key  + 1);
		getData(now);
		bgColor(key,pages);
	}) 
	
	$("#prev1").click(function(){ 
		var val=$('.functionSort1').children('option:selected').attr('index');
		var now = key == 1?1:(key-1);
		getData(now,val);
		bgColor1(key,pages);
	})
	$("#next1").click(function(){ 
		var val=$('.functionSort1').children('option:selected').attr('index');
		var now = key ==pages?pages : (key  + 1);
		getData(now,val);
		bgColor1(key,pages);
	}) 
	
	$('.surePage').click(function(){ 
		getData(Number($('.numPage').val()));
		bgColor(key,pages);
	})
	
	$('.surePage1').click(function(){ 
		var val=$('.functionSort1').children('option:selected').attr('index');
		getData(Number($('.numPage').val()),val);
		bgColor1(key,pages);
	}) 
	
	// 文本编辑 发布事件
	$('.release').click(function(){ 
		$('.tipTitle').html("发布");
		$('.tipMessage').html("您是否确认要发布此操作指南？"); 
	})  
	
	//删除事件
	$('tbody').on('click','.del',function(){
		deleteId=$(this).parents('tr').attr('id');
		$('.tipTitle').html("删除");
		$('.tipMessage').html("是否确认删除？");
	}) 
	
	//发布事件
	$('tbody').on('click','.release',function(){
		var state=$(this).parents('tr').find('.state').attr('state');
		if(state==2)return;
		releaseId=$(this).parents('tr').attr('id');
		$('.tipTitle').html("发布");
		$('.tipMessage').html("是否确认发布？");
	})  
	
	//撤销事件
	$('tbody').on('click','.revoke',function(){
		var state=$(this).parents('tr').find('.state').attr('state');
		if(state==1 || state==3)return; 
		revokeId=$(this).parents('tr').attr('id');
		$('.tipTitle').html("撤销");
		$('.tipMessage').html("是否确认撤销？"); 
	})
 
})
 
 function frameHeight()
 {
 	var height=$('html',parent.document).height();
 	$('iframe',parent.document).height($('body').height()<height?height-82:$('body').height()); 
 }

 //分页页码背景色判断
function bgColor(key,pages) {
	if (key == 1) {
		$("#prev").addClass('bg');
	} else {
		$("#prev").removeClass('bg');
	}
	if (key == pages) {
		$("#next").addClass('bg');
	} else {
		$("#next").removeClass('bg');
	}
}
function bgColor1(key,pages) {
	if (key == 1) {
		$("#prev1").addClass('bg');
	} else {
		$("#prev1").removeClass('bg');
	}
	if (key == pages) {
		$("#next1").addClass('bg');
	} else {
		$("#next1").removeClass('bg');
	}
}
//分页页码
function page(pages,index){ 
	var str='';
	for(var i=1; i<=pages;i++){ 
		if(i == index){
			 str += "<a class='active'>"+ i +"</ a>"; 
		}else{
			if(pages>7){
				if(pages > 8 && (i < 3 || i > pages - 2) || i == index - 1 || i == index + 1 || i == index + 2){
					 str += "<a  onclick='getData("+ i +")'>"+ i +"</ a>"; 
				}else{
					if(i == index - 3 || i == index + 3){
						str += "<a>"+" ..." +"</ a>"; 
					}
				}	
			}else{
				str += "<a onclick='getData("+ i+")'>"+ i +"</ a>"; 
			} 
		} 
	}
	return str;
}
function page1(pages,index){
	var val=$('.functionSort1').children('option:selected').attr('index');
	var str='';
	for(var i=1; i<=pages;i++){ 
		if(i == index){
			 str += "<a class='active'>"+ i +"</ a>"; 
		}else{
			if(pages>7){
				if(pages > 8 && (i < 3 || i > pages - 2) || i == index - 1 || i == index + 1 || i == index + 2){
					 str += "<a  onclick='getData("+ i +","+val+")'>"+ i +"</ a>"; 
				}else{
					if(i == index - 3 || i == index + 3){
						str += "<a>"+" ..." +"</ a>"; 
					}
				}	
			}else{
				str += "<a onclick='getData("+ i+","+val+")'>"+ i +"</ a>"; 
			} 
		} 
	}
	return str;
}
 Date.prototype.Format = function (fmt) {  
    var o = {  
        "M+": this.getMonth() + 1, //月份  
        "d+": this.getDate(), //日  
        "h+": this.getHours(), //小时  
        "m+": this.getMinutes(), //分  
        "s+": this.getSeconds(), //秒  
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度  
        "S": this.getMilliseconds() //毫秒  
    };  
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
    return fmt;  
};   
