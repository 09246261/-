    var api="http://10.1.24.189:8080";
    var domain="http://yard.2dfire-daily.com";
 /*var api="${page.url.conf}";
 var domain="${page.url.yard}";*/
 top.postMessage($("body").height(),domain);
$(function(){
	  
	 //Tab switch event
	 $('.tabHead a').click(function(){ 
	 	$(this).addClass('active').siblings().removeClass('active');
		$(".tabContent .content").eq($(this).index()).show().siblings().hide();  
	 }) 
	 
	//pagination  the previous and next page event
	$("#prev").click(function(){ 
		var now = key == 1?1:key-1;
		getData(now);
		bgColor(key,pages);
	})
	$("#next").click(function(){ 
		var now = key ==pages?pages : key  + 1;
		getData(now);
		bgColor(key,pages);
	})
	 
}) 
 
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

//时间转换
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