$(function(){
    // build drive sections
    $.getJSON('data/drive.json', function (data) {
        var drives = {};
        var noScroll = false;
        
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
                if (!noScroll) {
                    $(document).trigger('drive-change', [driveId, feature.properties, feature.geometry.coordinates[0], feature.geometry.coordinates[1], 'scroll']);
                }
            }
	}, {
  	    offset: '33.33%'
  	});

        // initialize chart
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        yAxis.tickValues([0, -10, -20]);

        var svg = d3.select(".graph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var data = [];
        for (var i in drives) {
            drives[i].elevation = parseFloat(drives[i].properties.elevation);
            drives[i].driveId = drives[i].properties.drive;
            data.push(drives[i]);
        }

        x.domain(data.map(function(d) { return d.driveId; }));
        y.domain([-20, 0]);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", function(d) { return 'bar' + parseInt(d.elevation, 10); })
            .attr("data-drive-id", function(d) { return d.driveId; })
            .attr("data-elevation", function(d) { return d.elevation; })
            .attr("x", function(d) { return x(d.driveId); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.elevation); })
            .attr("height", function(d) { return height - y(d.elevation); })
            .on('click', function(e) {
                $(document).trigger('drive-change', [e.driveId, e.properties, e.geometry.coordinates[0], e.geometry.coordinates[1], 'graph']);                
            });

        // listen for 'drive-change' events
        $(document).bind('drive-change', function (e, drive, data, lon, lat, triggeredBy) {
            // color the chart
            $('rect').each(function(i, r) {
                if (parseInt(drive, 10) === $(r).data('drive-id')) {
                    $(r).attr('class', 'selected');
                } else {
                    $(r).attr('class', 'bar' + parseInt($(r).data('elevation'), 10));
                }
            });

            // scroll to top
            var section = $("section[data-drive-id='" + drive + "']");
            if (triggeredBy !== 'scroll') {
                noScroll = true;
                window.scrollTo(0, section.offset().top);

                // quick hack to make sure scrolling isn't triggered like crazy
                setTimeout(function () {
                    noScroll = false;
                }, 500);
            }
        });
    });
});