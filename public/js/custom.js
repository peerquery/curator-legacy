
//run asynchronously
 
//run on window is loaded and ready
$(window).on("load", function() {
	
	//disable all control buttons above the authority of current user
	
	if(typeof user_data !== 'undefined') {
	
		const active_user = user_data.username;
		const aua = active_user_authority = user_data.authority;
	
		//console.log(aua);
	
		if(aua == 1) {
			//user is CURATOR
			$(".2, .3, .4").addClass("hide");
		
			/*
			$("body").attr("style", "");
			
			var css = 	".3 {" +
					"	display:none !important;" +
						"}";
		
			addcss(css);
			*/
		
		
		} else if(aua == 2){
			//user is MODERATOR
			$(".3, .4").addClass("hide");
		
		} else if(aua == 3){
			//user is ADMIN
			$(".4").addClass("hide");
		
		} else if(aua == 4){
			//user is OWNER
		
		
		} else {
		
			//re-direct if there is not user authority at all
			window.location.href = "/community";
		
		}
	
	}
	
	
	
	$('img').each(function() {
		if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
			// image was broken, replace with your new image
			this.src = '/img/placeholder_broken.png';
		}
	});
	
	
	
	function addcss(css){
		var head = document.getElementsByTagName('head')[0];
		var s = document.createElement('style');
		s.setAttribute('type', 'text/css');
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = css;
		} else {                // the world
			s.appendChild(document.createTextNode(css));
		}
		head.appendChild(s);
	}
	
	
	
});
