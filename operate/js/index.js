$(function() {

	$('.treeview-menu a').click(function() {
		$('.treeview-menu a').removeClass('active');
		$(this).addClass('active');
		var src = $(this).attr('url');
		addTab($(this), src);
	});
	
	$('.firstItem').trigger('click');
	
	$('#tabs').on('click', '.tab', function() {
		// Get the tab name
		var contentname = $(this).attr("id") + "_content";; 
		// hide all other tabs
		$("#content iframe").hide();
		$("#tabs li").removeClass("current");

		// show current tab
		$("#" + contentname).show();
		$(this).parent().addClass("current");
		$('.treeview-menu a').removeClass('active');
		$('.treeview-menu a[rel="'+$(this).attr("id")+'"]').addClass('active');;
	});

	$('#tabs').on('click', ".remove", function() {
		// Get the tab name
		var tabid = $(this).parent().find(".tab").attr("id");

		// remove tab and related content
		var contentname = tabid + "_content";;
		$("#" + contentname).remove();
		$(this).parent().remove();

		// if there is no current tab and if there are still tabs left, show the first one
		if ($("#tabs li.current").length == 0 && $("#tabs li").length > 0) {

			// find the first tab
			var firsttab = $("#tabs li:first-child");
			firsttab.addClass("current");

			// get its link name and show related content
			var firsttabid = $(firsttab).find("a.tab").attr("id");
			$("#" + firsttabid + "_content").show();
		}
		$('.treeview-menu a').removeClass('active');
		$('.firstItem').addClass('active'); 
	});

	function addTab(link, src) {
		// If tab already exist in the list, return
		if ($("#" + $(link).attr("rel")).length != 0) {
			$("#" + $(link).attr("rel")).trigger('click');
			return;
		} 

		// hide other tabs
		$("#tabs li").removeClass("current");
		$("#content iframe").hide();

		// add new tab and related content
		var str="";
		if($(link).attr("rel")=="0")
		{
			str="<li class='current'><a class='tab' id='" +
			$(link).attr("rel") + "' href='#'>" + $(link).html() +
			"</a></li>"
		}else
		{
			str="<li class='current'><a class='tab' id='" +
			$(link).attr("rel") + "' href='#'>" + $(link).html() +
			"</a><a href='#' class='remove'>x</a></li>"
		}
		$("#tabs").append(str);
		var html = '<iframe  src="' + src + '" scrolling="no" frameborder="0" id="' + $(link).attr("rel") + '_content"></iframe>';
		$("#content").append(html);

		// set the newly added tab as current
		$("#" + $(link).attr("rel") + "_content").show();
	}
	
	

})