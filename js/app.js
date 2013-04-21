$(function(){
    // build drive sections
    $.getJSON('data/drive.json', function (data) {
        var drives = {};
        
        $.each(data.features, function (i, feature) {
            drives[feature.properties.drive] = feature;

            var section = '' +
		'<section data-drive-id="' + feature.properties.drive + '">' +
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

        // initialize waypoints
	$('.scroll-pane section').waypoint(function(direction) {
	    var $active = $(this);
  	    $active.toggleClass('active');

            var driveId = $active.data('drive-id');
            if (driveId !== undefined) {
                var feature = drives[driveId];
                $(document).trigger('drive-change', [driveId, feature.properties, feature.geometry.coordinates[0], feature.geometry.coordinates[1]]);
            }
	}, {
  	    offset: '33.33%'
  	});

        // listen for 'drive-change' events
        $(document).bind('drive-change', function (e, drive, data, lon, lat) {
        });
    });
});