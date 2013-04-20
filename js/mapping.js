(function () {
    var map;

    var init = function () {
        map = new OpenLayers.Map('map', { controls: [] });
        map.addControl(new OpenLayers.Control.LayerSwitcher());
        map.addControl(new OpenLayers.Control.ZoomPanel());
        map.addControl(new OpenLayers.Control.Navigation({ zoomWheelEnabled: false }));
        
        var gmv = new OpenLayers.Layer.Google("Visible", { type: G_MARS_VISIBLE_MAP });
        var gmi = new OpenLayers.Layer.Google("Infrared", { type: G_MARS_INFRARED_MAP });
        var gme = new OpenLayers.Layer.Google("Elevation", { type: G_MARS_ELEVATION_MAP });
        map.addLayers([gmv, gmi, gme]);
        
        map.setCenter(new OpenLayers.LonLat(10.2, 48.9), 5);
    }

    $(document).ready(init);
}())
