// this code, data, and tiles were quickly cobbled together by viewing the source of:
// http://curiosityrover.com/rovermap1.html -- thanks Joe Knapp! (jmknapp@gmail.com)
(function () {
    var init = function () {
        var mapBounds = new OpenLayers.Bounds( 137.380794, -4.64535890429, 137.465011675, -4.53738741241),
            getTileURL = function (bounds) {
                var res = this.map.getResolution(),
                    x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w)),
                    y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h)),
                    z = this.map.getZoom();

                if (mapBounds.intersectsBounds(bounds) && (z >= 11) && (z <= 18)) {
                    return this.url + z + '/' + x + '/' + y + '.' + this.type;
                }
                return 'http://www.maptiler.org/img/none.png';
            },
            googlemarsOptions = { type: G_MARS_VISIBLE_MAP, sphericalMercator: true, numZoomLevels: 19},
            hiriseOptions = { type: 'png', getURL: getTileURL, alpha: false, isBaseLayer: false },
            mapOptions = {
                controls: [],
                projection: new OpenLayers.Projection('EPSG:900913'),
                displayProjection: new OpenLayers.Projection('EPSG:4326'),
                units: 'm',
                maxResolution: 156543.0339,
                maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34)
            },
            map = new OpenLayers.Map('map', mapOptions),
            googlemars = new OpenLayers.Layer.Google('Google Mars', googlemarsOptions),
            hirise = new OpenLayers.Layer.TMS('HiRISE', 'https://s3.amazonaws.com/GaleMap1/trans/', hiriseOptions),
            trackStyle = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                fill: true, fillColor: 'black', fillOpacity: 1.0, strokeDashstyle: 'solid', strokeOpacity: 0.6, strokeColor: 'blue', strokeWidth: 4
            }, OpenLayers.Feature.Vector.style['default'])),
            trackLayer = new OpenLayers.Layer.Vector("Track", {
                strategies: [new OpenLayers.Strategy.Fixed()],
                styleMap: trackStyle,
                protocol: new OpenLayers.Protocol.HTTP({
                    url: "data/track.json",
                    format: new OpenLayers.Format.GeoJSON()
                })
            }),
            driveLayer = new OpenLayers.Layer.Vector("Drive", {
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: "data/drive.json",
                    format: new OpenLayers.Format.GeoJSON()
                })
            }),
            selectControl = new OpenLayers.Control.SelectFeature(driveLayer, {
                onSelect: function (d) { $(document).trigger('drive-change', [d.data.drive, d.data, d.geometry.x, d.geometry.y]); }
            }),
            markers = new OpenLayers.Layer.Markers('Markers'),
            markerSize = new OpenLayers.Size(32, 32),
            markerOffset = new OpenLayers.Pixel(-(markerSize.w / 2), -markerSize.h + 5),
            markerIcon = new OpenLayers.Icon('img/marker-curiosity.png', markerSize, markerOffset);
            
        map.addLayers([googlemars, hirise, trackLayer, driveLayer, markers]);
        map.zoomToExtent( mapBounds.transform(map.displayProjection, map.projection ) );
        map.addControl(new OpenLayers.Control.ZoomPanel());
        map.addControl(new OpenLayers.Control.Navigation({ zoomWheelEnabled: false }));
        map.addControl(selectControl);
        selectControl.activate();
        map.setCenter(new OpenLayers.LonLat(15299900, -511700), 17);

        // listen for 'drive-change' events
        $(document).bind('drive-change', function (e, drive, data, lon, lat) {
            markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat), markerIcon));
        });        
    }

    $(document).ready(init);
}());
