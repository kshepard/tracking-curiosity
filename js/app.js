$(function(){
	$('.scroll-pane section').waypoint(function(direction) {
		var $active = $(this);
  		$active.toggleClass('active');
	}, {
  		offset: '33.33%'
  	});

});