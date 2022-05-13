//location_coords = c("sao_jose_dos_campos_sp" = c(-45.8869400,-23.1794400),#c(-43.50044,-20.38571)
//                "campinas_sp" = c(-47.0616,-22.9064))

//var GeoRasterLayer = require("georaster-layer-for-leaflet");

var map,tiles,my_marker,my_layer;
var my_icon = L.icon({
  iconUrl: 'icon2.png',
  iconSize:     [20, 20],
  className: 'blinking'
});

var url_to_geotiff_file = "https://rafaelgramos.github.io/PersonalWebpage/SJC_robb_dens2010_2019.tiff";

//alert("bla")

function onError (err) {
}

function onSuccess (position) {
  var coords = position.coords;
  
  if(typeof map == "undefined") {
    map = L.map('map').setView([coords.latitude, coords.longitude], 16);
    
    tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
    	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    	subdomains: 'abcd',
    	maxZoom: 16,
    	tileSize: 512,//512,
    	zoomOffset: -1,
    	ext: 'png'
    }).addTo(map);
    
    
    fetch(url_to_geotiff_file)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          parseGeoraster(arrayBuffer).then(georaster => {
          //console.log("georaster:", georaster);
          alert("oi")
          //alert(GeoRasterLayer);
          var layer = new GeoRasterLayer({
              georaster: georaster,
              opacity: 0.7,
              resolution: 64
              //pixelValuesToColorFn: values => values[0] === 42 ? '#ffffff' : '#000000',
              //resolution: 64 // optional parameter for adjusting display resolution
          });
          layer.addTo(map);
          //map.fitBounds(layer.getBounds());
    
      });
    });
    
    my_marker = new L.marker([coords.latitude,coords.longitude], {icon : my_icon});
    my_marker.addTo(map);
  }
  else {
    my_marker.setLatLng([coords.latitude,coords.longitude]);
    map.panTo([coords.latitude,coords.longitude]);
  }
  //if(typeof my_marker == "undefined") {
  //  my_marker = 0;
  //}
}
//var marker = L.marker([-23.1794400,-45.8869400]).addTo(map)

navigator.geolocation.getCurrentPosition(onSuccess, onError);
setInterval(function () {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}, 1000)