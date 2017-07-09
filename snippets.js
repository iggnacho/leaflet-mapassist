const fs = require('fs-extra');
//var UglifyJS = require("uglify-js");
const pug = require('pug');
var path = require("path");
var moment = require('moment');
var pathMain;
module.exports = {
  readInputs: function (options){
    console.log('this is what is being passed to write script', test)
  },

  getStyle: function(){

  },
  getPopup: function(){

  },
  getTool: function(){

  },
  getStuff: function(test){
    var stringfor= '';
    if (test[3].length > 0) stringfor += 'layer.bindPopup(feature.' + test[3]+');'
    if (test[4].length > 0) stringfor += 'layer.bindTooltip(feature.' + test[4]+');'
    return stringfor;
  },
  writeScript: function (optionsinit) {
    console.log('write scripts');
    console.log(optionsinit);
	//exportoptions.mapoptions.push(basemapProviderLayer1, mymap.options.maxBounds, minzoomtest, maxzoomtest , mymap.getZoom() , mymap.getCenter());
  //   var mapInit = 'var map = L.map("map").setView(['
	// + (optionsinit.mapoptions[5] ? `${optionsinit.mapoptions[5].lat}, ${optionsinit.mapoptions[5].lng}` : `51.505, -0.09`)
	// + '],' + (optionsinit.mapoptions[4] ? `${optionsinit.mapoptions[4] }`:'13')+');L.tileLayer("'
	// + (optionsinit.mapoptions[0] ? optionsinit.mapoptions[0]._url : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
	// +'", {maxZoom:'+ ( optionsinit.mapoptions[3]? `${optionsinit.mapoptions[3]},`: '19,')
	// + 'minzoom:'+ (optionsinit.mapoptions[2]? `${optionsinit.mapoptions[2]},` : '0,')
  // + (optionsinit.mapoptions[0] && optionsinit.mapoptions[0].options.ext ? `ext: \'${optionsinit.mapoptions[0].options.ext}\',` : '')
	// + 'attribution:'+ (optionsinit.mapoptions[0] ? `\'${optionsinit.mapoptions[0].options.attribution}\'` : `\'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>\'`)
  // + `}).addTo(map);`;

  //NEW THING! ASSUMING BASEMAP ALWAY SENT WITH ITEMS

var mapInit = 'var map = L.map("map").setView(['
    +`${optionsinit.mapoptions[5].lat}, ${optionsinit.mapoptions[5].lng}]`//center point @ initiation
    + `, ${optionsinit.mapoptions[4]} );` //zoom level @ initiation
    + `L.tileLayer("${optionsinit.mapoptions[0]._url}", ${JSON.stringify(optionsinit.mapoptions[0].options)} ).addTo(map);`; //zoom level @ initiation;
if (optionsinit.mapoptions[3]){
  mapInit += ` map.setMaxZoom(${optionsinit.mapoptions[3]});`;
}
if (optionsinit.mapoptions[2]){
  mapInit += ` map.setMinZoom(${optionsinit.mapoptions[2]});`;
}
  //CHANGE TO WORK WITH TILE IN THE THING,
    var dataInit = '';
	if(optionsinit.mapoptions[1]) mapInit += `map.setMaxBounds(L.latLngBounds([[${optionsinit.mapoptions[1]._northEast.lat},${optionsinit.mapoptions[1]._northEast.lng} ],[${optionsinit.mapoptions[1]._southWest.lat} ,${optionsinit.mapoptions[1]._southWest.lng} ]]));`
    for(i in optionsinit.datanames){
      if (typeof optionsinit.datanames[i] == 'object' && optionsinit.datanames[i][0] !== null){
        console.log('has second property')
        console.log(optionsinit.datanames[i][0])
        //list the cases for different types of plugins here for second property and maybe think about sending a third for options after everything works
        switch(optionsinit.datanames[i][1]){
          case 'markercluster':
              dataInit += `var markers${i} = L.markerClusterGroup();`
              +   `var ${optionsinit.datanames[i][0]}geojson = L.geoJson(${optionsinit.datanames[i][0]}`
              +`); markers${i}.addLayer(${optionsinit.datanames[i][0]}geojson);map.addLayer(markers${i});`;
              dataInit += ( optionsinit.datanames[i][3] || optionsinit.datanames[i][4] ? `markers${i}` : '')
              + ( optionsinit.datanames[i][4]  ? '.bindPopup(function (layer) { return ' + optionsinit.datanames[i][3] +'})': '')   //').bindPopup(function (layer) { return layer.feature.properties.description;})'
              +( optionsinit.datanames[i][4]  ? '.bindTooltip(function (layer) { return '+ optionsinit.datanames[i][4] +'})': '')   //'.bindTooltip(function (layer) { return layer.feature.properties.description;})'
              +( optionsinit.datanames[i][3] || optionsinit.datanames[i][4] ? `;` : '');
            break;
          default:
            dataInit += 'var '+ optionsinit.datanames[i][0] +'geojson = L.geoJSON(' + optionsinit.datanames[i][0]
            +( optionsinit.datanames[i][2] && typeof optionsinit.datanames[i][2]=='object' ? ', {style:'+JSON.stringify(optionsinit.datanames[i][2])+'})': ')')//', {style: function (feature) {return {color: feature.properties.color};}}'
            +( optionsinit.datanames[i][3]  ? '.bindPopup(function (layer) { return ' + optionsinit.datanames[i][3] +'})': '')   //').bindPopup(function (layer) { return layer.feature.properties.description;})'
            +( optionsinit.datanames[i][4]  ? '.bindTooltip(function (layer) { return '+ optionsinit.datanames[i][4] +'})': '')   //'.bindTooltip(function (layer) { return layer.feature.properties.description;})'
            +'.addTo(map);';
        }
      }
    }
    let maptitleTest='';
    if(optionsinit.maptitle){//TAKEN FROM LEAFLET INFO EXAMPLE
      maptitleTest +=`var info = L.control();
      info.onAdd = function (map) {
          this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
          this.update();
          return this._div;
      };
      // method that we will use to update the control based on feature properties passed
      info.update = function () {
          this._div.innerHTML = '<h3>${optionsinit.maptitle}</h3>'
        };
      info.addTo(map);`
    }
    //if works add styling...
    fs.writeFileSync(pathMain+'/map.js', mapInit+ dataInit + maptitleTest );
    console.log('wrote the js file');
  },
  createMapDir: function(options){

    fs.ensureDirSync(pathMain);
    fs.copySync('./export/js', pathMain);//copies leaflet
    for(i in options.plugins){
        switch (options.plugins[i][0])
        {
          case 'leaflet.markercluster':
            fs.copySync('./export/markercluster', pathMain);//copies markercluster into designated folder
            break;
          default:
          console.log('default');
        }}
  },
  writeHTML: function(options){
    console.log('write html');
     var compiledFunction = pug.compileFile('./export/test.pug');
     fs.writeFileSync(pathMain+'/map.html', compiledFunction(options) );//uncommented
     console.log('wrote html!');
  },
  writeMap: function(options){
    console.log(options)
    if(options.projectdest){
      pathMain = options.projectdest+'/'+options.projectname+ moment().format("YYYY_M_D_h_mm_ss");
    }else{
      pathMain = './'+options.projectname+ moment().format("YYYY_M_D_h_mm_ss");
    }

    this.createMapDir(options);
    this.writeHTML(options);
    this.writeScript(options);
    return pathMain;
  }
};
