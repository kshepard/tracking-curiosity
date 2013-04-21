$(function(){
	$('.scroll-pane section').waypoint(function(direction) {
		var $active = $(this);
  		$active.toggleClass('active');
	}, {
  		offset: '33.33%'
  	});


    // build drive sections
    $.getJSON('data/drive.json', function (data) {
        $.each(data.features, function (i, feature) {
            var section = '' +
		'<section>' +
		'	<h3>Drive ' + feature.properties.drive + '</h3>' +
		'	<div class="distance-traveled">Distance Traveled: <span>' + feature.properties.dist + '</span></div>' +
		'	<div class="duration">Duration: <span>' + feature.properties.duration+ '</span></div>' +
		'	<div class="elevation">Elevation: <span>' + feature.properties.elevation + 'm</span></div>' +
		'	<div class="lmst">LMST: <span>' + feature.properties.lmst + '</span></div>' +
		'	<div class="utc">UTC: <span>' + feature.properties.utc + '</span></div>' +
		'	<div class="azrollpitch">Az/Roll/Pitch: <span>' + feature.properties.azrollpitch + '</span></div>' +
		'</section>';
            
            $(section).appendTo($('#section-container'));
        });
    });
});