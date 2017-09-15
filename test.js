var map = L.map("map").setView([33.810817029308566, -118.12808990478517], 11 );
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {"maxZoom":19,"attribution":"&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>","subdomains":["a","b","c"]} ).addTo(map);
var markers0 = L.markerClusterGroup();var _2015_Reported_Coyote_Activitygeojson = L.geoJson(2015_Reported_Coyote_Activity);
markers0.addLayer(_2015_Reported_Coyote_Activitygeojson);
map.addLayer(markers0);
