window.$ = require('jquery');
var L = require('leaflet');
require('leaflet.markercluster');
const remote = require('electron').remote;
const {
  dialog,
  BrowserWindow,
  Menu,
  MenuItem
} = require('electron').remote;
const path = require('path');
const {
  GeoSearchControl,
  OpenStreetMapProvider
} = require('leaflet-geosearch');
const {
  ipcRenderer
} = require('electron')
require('leaflet-providers');
const provider = new OpenStreetMapProvider();
const searchControl = new GeoSearchControl({
  provider: provider,
  autoComplete: false,
  showMarker: false,
  searchLabel: 'Enter Name of Location - OSM'
});
const menu = new Menu()
var exportoptions = {
  "plugins": [
    // ['leaflet.markercluster', 'true']
  ],
  // "datanames": [[dataname,plugin,style,bindpopup,bindTooltip]],
  // OBJECTID":38,"ReportID
  "datanames": [
    // ['bikes', '', {
    //   "color": "#e41a1c",
    //   "weight": 5,
    //   "opacity": 0.8
    // }, 'properties.CLASS', 'properties.SOURCE'],
    // ['coyotes', 'markercluster', '', 'properties.ReportID', '']
  ],
  "mapoptions":[] ,//[tilelayer, zoommax,zoommin, bounds?, center]
  "maptitle": undefined,// name on title of html
  "projectname": "MA_Project_",//name of folder
  "projectdest":undefined
};

//checkDataPlug('markercluster', message.id)
function checkDataPlug(pluginname, mastID){
	if(exportoptions.datanames.length > 0){
		for (let i in exportoptions.datanames){
			if (exportoptions.datanames[i][0] === mastID) {
        if (exportoptions.datanames[i][1] !== pluginname) {
          exportoptions.datanames[i][1] = pluginname;
        }
      }
		}
	}
}

function checkOptionPlug(pluginname){
	let isitin = false;
	if(exportoptions.plugins.length > 0){
		for (let i in exportoptions.plugins){
			if (exportoptions.plugins[i][0] === pluginname) isitin = true;
		}
	}
	return isitin;
}
// async function checkdataNames() {
//   return new Promise(function (resolve, reject) {
//     try {
//       if(exportoptions.datanames){
//         for(let i in exportoptions.datanames)
//         {
//           if(exportoptions.datanames[i]){
//             if(!window[exportoptions.datanames[i][0]]) exportoptions.datanames[i] = undefined;
//           }
//         }
//         resolve();
//       }
//     } catch (err) {
//       console.log(err);
//       reject(err);
//     }
//   });
//
//
// }
async function writeDataSets(pathtofolder){
  return new Promise(async function (resolve, reject) {
    try {
      if(exportoptions.datanames.length >= 0){
        for (let i in exportoptions.datanames){
          if (window[exportoptions.datanames[i][0]]) {
            let pathName = pathtofolder+'/'+exportoptions.datanames[i][0]+'.js';
            //let stringtoWrite = await JSON.stringify(window[exportoptions.datanames[i][0]].toGeoJSON());
            fs.writeFileSync(pathName,'var '+exportoptions.datanames[i][0]+' = '+ await JSON.stringify(window[exportoptions.datanames[i][0]].toGeoJSON()) );
          }
        }
      }
      resolve();
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}
async function runWriteProcess() {
  try{
    exportoptions.mapoptions[0]=basemapProviderLayer;
    exportoptions.mapoptions[4] =  mymap.getZoom();
  exportoptions.mapoptions[5] = mymap.getCenter();
  if (!exportoptions.projectdest) exportoptions.projectdest= desktopPath;
  let testpath2 = snippets.writeMap(exportoptions);
  await writeDataSets(testpath2);
}catch(err){
  console.log(err);
  alert('error writing map, please check console')
}
};

function importCSS(hrefpath){
  var styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.type = 'text/css';
  styles.media = 'screen';
  styles.href = hrefpath;
  document.getElementsByTagName('head')[0].appendChild(styles);
}

ipcRenderer.on('channel2', (event, message) => {
  console.log(basemapProviderLayer)
  let basemapProviderLayer1, validaterCheck = false,
    zoomdiffcheck = true,
    minzoomtest = 0,
    maxzoomtest = 19;
  console.log(message); // Prints 'message sent'
  // if (message.)
  for (let i in message) {
    console.log(i)
    switch (i) {
      case "mapextent":
        if (message.mapextent) {
          console.log('changing ext');
          mymap.setMaxBounds(mymap.getBounds());
        }
        break;
      case "provider":
        if (message.provider.length > 0) {
          try {
            basemapProviderLayer1 = L.tileLayer.provider(message.provider);
            // let variant = L.tileLayer.provider(message.provider)
            validaterCheck = true;
          } catch (err) {
            console.log(err);
            validaterCheck = false;
          }
          if (validaterCheck) {
            console.log('changing basemap provider');
            mymap.removeLayer(basemapProviderLayer);
            basemapProviderLayer = basemapProviderLayer1;
            basemapProviderLayer.addTo(mymap);
          }
        }
        break;
      case "zoommin":
        if (message.zoommin.length > 0) {
          console.log('changing zoommin');
          mymap.setMinZoom(parseInt(message.zoommin))
          minzoomtest= parseInt(message.zoommin);
        }
        break;
      case "zoommax":
        if (message.zoommax.length > 0 ) {
          console.log('changing zoommax');
          mymap.setMaxZoom(parseInt(message.zoommax))
          maxzoomtest= parseInt(message.zoommax);
        }
        break;
      default:
        console.log('default')
    }
  }
//   if (basemapProviderLayer1){
//     basemapProviderLayer1._url = basemapProviderLayer1._url.replace("{variant}",(basemapProviderLayer1.options.variant));
// }

  //[tilelayer, maxzoom, minzoom, bounds?, center]
  //console.log(basemapProviderLayer1, mymap.options.maxBounds, minzoomtest, maxzoomtest , mymap.getZoom() , mymap.getCenter());
  // exportoptions.mapoptions.push(basemapProviderLayer1, mymap.options.maxBounds, minzoomtest, maxzoomtest , mymap.getZoom() , mymap.getCenter());


  exportoptions.mapoptions[1]=mymap.options.maxBounds;
  exportoptions.mapoptions[2]=minzoomtest;
  exportoptions.mapoptions[3]=maxzoomtest;
})
ipcRenderer.on('channel3', (event, message) => {
  let propertylayer = 'layer.feature.properties';
  // settingObject = {
  //   "bindpopupset": '',
  //   "bindtooltipset": '',
  //   "markercluster": false,
  //   "id": urlParams.get('id')
  // };
  if (message.bindpopupset) {

    let stringarraypp = message.bindpopupset.split(" ");
    let stringarrayppsend = Array.from(stringarraypp);
    let indexlist = [];
    for (let i in stringarraypp) {

      if (stringarraypp[i].charAt(0) === '$' && stringarraypp[i].charAt(1) !== '$') {
        console.log('property');
        stringarrayppsend[i] = 'layer.feature.properties.'+stringarraypp[i].substr(1) +'+" "'//not og here
        //string for property
        indexlist.push(parseInt(i));
      } else if (stringarraypp[i].charAt(1) === '$' && stringarraypp[i].charAt(0) === '$') {
        stringarraypp[i] = stringarraypp[i].substr(1)
        stringarrayppsend[i] = '"' +stringarrayppsend[i].substr(1)+ ' "'
      }else{
        stringarrayppsend[i] = '"' + stringarrayppsend[i] + ' "'
      }
    }
    console.log(stringarrayppsend.join('+'))
    addPopData(message.id, stringarrayppsend.join(' +'), true)
    window[message.id].eachLayer(function(layer) {
      console.log()
      let arrayppreplc = stringarraypp.slice(0);
      // // console.log(htmlstringp)
      for (let i in indexlist) {
        let replace = (arrayppreplc[indexlist[i]]).substr(1);
        arrayppreplc[indexlist[i]] = layer.feature.properties[replace];
      }
      layer.bindPopup(arrayppreplc.join(' '));
    })
  }



  if (message.bindtooltipset) {

    let stringarraytt = message.bindtooltipset.split(" ");
    let stringarrayttsend = Array.from(stringarraytt);
    let indexlist = [];
    for (let i in stringarraytt) {
      if (stringarraytt[i].charAt(0) === '$' && stringarraytt[i].charAt(1) !== '$') {
        stringarrayttsend[i] = 'layer.feature.properties.'+stringarraytt[i].substr(1) +'+" "'//not og here
        //string for property
        indexlist.push(parseInt(i));
      } else if (stringarraytt[i].charAt(1) === '$' && stringarraytt[i].charAt(0) === '$') {
        stringarraytt[i] = stringarraytt[i].substr(1)
        stringarrayttsend[i] = '"' +stringarrayttsend[i].substr(1)+ ' "'
      }else{
        stringarrayttsend[i] = '"' + stringarrayttsend[i] + ' "'
      }
    }
    addPopData(message.id, stringarrayttsend.join(' +'), false)
    window[message.id].eachLayer(function(layer) {
      let arrayttreplc = stringarraytt.slice(0);
      // console.log(htmlstringp)
      for (let i in indexlist) {
        // console.log(indexlist[i])
        let replace = (arrayttreplc[indexlist[i]]).substr(1);
        // console.log(replace);
        arrayttreplc[indexlist[i]] = layer.feature.properties[replace];
      }
      layer.bindTooltip(arrayttreplc.join(' '));
    })
  }

  if (message.markercluster) {
    //should check the plugins in the object...
	//sould be its own function

    importCSS('./node_modules/leaflet.markercluster/dist/MarkerCluster.css')
    importCSS('./node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css')
    //mymap.removeLayer(window[message.id]); //remove the layer

	let testiftrue = false;
    console.log(window[message.id]);
    let markers = L.markerClusterGroup();
    markers.addLayer(window[message.id]);
	if(mymap.hasLayer(window[message.id])){
		mymap.removeLayer(window[message.id])
		testiftrue= true;
	}
	window[message.id] = markers;
	//add to map properties
	if(!checkOptionPlug('leaflet.markercluster')){exportoptions.plugins.push(['leaflet.markercluster', 'true'])};
  if (testiftrue){window[message.id].addTo(mymap)};
  checkDataPlug('markercluster', message.id)
    //add markercluster to plugins if not there
    //add markercluster to the dataset entry
  }
})
// ipcRenderer.on('asynchronous-reply', (event, arg) => {
//   console.log(arg) // prints "pong"
// })
// ipcRenderer.send('asynchronous-message', 'ping')

// menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
// menu.append(new MenuItem({label: 'Turn All Layers Off', type: 'checkbox', checked: true}))
menu.append(new MenuItem({
  label: 'Turn All Layers Off',
  click() {
    console.log('off clicked')

    mymap.eachLayer(function(layer) {
      if (!(layer instanceof L.TileLayer)) { //currently removes the geocoding layer provided by geo-search
        console.log(layer);
        mymap.removeLayer(layer);
      }else{
        console.log(layer);
      }
    });
  }
}));
menu.append(new MenuItem({
  label: 'Turn All Layers On',
  click() {
    console.log('on clicked')
  }
}));
menu.append(new MenuItem({
  label: 'Remove All Layers',
  click() {
    console.log('remove clicked')
  }
}));

function addPopData(id,words,whatis){
  for (let i in exportoptions.datanames){
    if (window[exportoptions.datanames[i][0]]&& exportoptions.datanames[i][0] === id){
      if (whatis){
        exportoptions.datanames[i][3] = words;
      }else{//false is tooltip
        exportoptions.datanames[i][4] = words;
      }
    }
  }
}//[[dataname,plugin,style,bindpopup,bindTooltip]],
function setMSettings(settings) {
  //send array [basemap provider, maxzoom, minzoom, extent]
  let basemapProviderLayer1,
    validateProvider = true;
  if ((settings[0].trim()).length > 1) {
    try {
      basemapProviderLayer1 = L.tileLayer.provider(settings[0].trim());
    } catch (err) {
      validateProvider = false
      console.log(err)
    }
  }
  if (validateProvider) {
    console.log('changing basemap provider');
    mymap.removeLayer(basemapProviderLayer);
    basemapProviderLayer = basemapProviderLayer1;
    basemapProviderLayer.addTo(mymap);
    basemapProviderLayer1 = null;
  }

}

async function readFileType(extension, pathToData, nameofFilePath) {
  console.log('here')
  //.trim().replace(/\W /g,"_");
  //send lowercase extension
  console.log('here2')
  return new Promise(function (resolve, reject) {
    try {
      switch (extension) {
        case ".kml":
          window[nameofFilePath] = L.geoJSON( parseMe.kml(pathToData));
          resolve();
          break;
        case ".csv":
          //open options to tell what column will be used for lat and long
          var testingdata2;
          let child4 = new BrowserWindow({
            width: 300,
            height: 300,
            modal: true,
            show: true
          })
          child4.loadURL(`file://${__dirname}/csvRun.html`)
          child4.once('ready-to-show', () => {
            child4.show()
          })
          child4.on('closed', function() {
            child4 = null
          })
          ipcRenderer.on('channel4', async (event, message) => {
            window[nameofFilePath] = L.geoJSON();
            let test22 = await parseMe.csv(pathToData, message.lat, message.lon, message.delimiter);
            window[nameofFilePath].addData(test22);
            resolve();
          });
          break;
        default:
          //json and geojson
          // omnivore.geojson(pathToData).addTo(mymap);
            console.log('here3')
          window[nameofFilePath] = L.geoJSON( parseMe.geojsonLoad(pathToData));
            console.log('here4')
          resolve();
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });

};
function nameCheck(nameofthis) {
    if (window[nameofthis]){
      return false; // var exist
    }
    return true;//var does not exist
  }

function removeName(nameofthis){
  nameofthis
  for (let i in exportoptions.datanames)
  {
    if (nameofthis === exportoptions.datanames[i][0])
    exportoptions.datanames.splice(i,1)

  }
      console.log(exportoptions.datanames)
};
async function readFile(filesSelected) {
try{
  // console.log(filesSelected);
  let kids = $("#listgroup").children();
  let hasNumber = /\d/;
  // console.log(kids, kids.length);
  for (i in filesSelected) {
    let nameofthis = (path.basename(filesSelected[i], path.extname(filesSelected[i]))).trim().replace(/\W/g,"_");
    if (hasNumber.test(nameofthis.charAt(0))) nameofthis = '_'+nameofthis///change this
    //try await and use a promise for the readfiletype?
    if (exportoptions.datanames.length > 0 && !nameCheck(nameofthis)) throw 'duplicate';
    await readFileType(path.extname(filesSelected[i]).toLowerCase(), filesSelected[i], nameofthis);
      console.log('here5')
	console.log(Object.keys(window[nameofthis]._layers).length);
	//push layer into datanames
	exportoptions.datanames.push([nameofthis,undefined,undefined,undefined,undefined])
    let fileinid;
    if (kids.length > 1) {
      // let start = kids.length-1;
      let addition = (kids.length - 1) + parseInt(i)
      console.log(addition)
      fileinid = `check${addition}`;
    } else {
      fileinid = `check${i}`;
    }
    console.log(i, fileinid)
    let spanMain = `<span class="nav-group-item"><input id="${fileinid}" type="checkbox">${nameofthis}<span class="icon icon-tools"id="tools${fileinid}"></span><span class="icon icon-cancel" id="cancel${fileinid}"></span></span>`
    $("#listgroup").append(spanMain);

    $("#" + fileinid).click(function(e) {
      // console.log(e.target.checked);
      // console.log(e);
      // console.log(e.target.parentElement.innerText)
      //console.log(e);
      if (e.target.checked) {
        window[nameofthis].addTo(mymap);
        mymap.eachLayer(function(layer) {
          // if (!(layer instanceof L.TileLayer)) { //currently removes the geocoding layer provided by geo-search
          //   console.log(layer);
          //   mymap.removeLayer(layer);
          // }
          // console.log(layer)
        });
      } else {
        mymap.removeLayer(window[nameofthis]);
      }

    });

    $("#cancel" + fileinid).click(function(e) {
      e.target.parentElement.remove();
      mymap.removeLayer(window[nameofthis]);
      window[nameofthis] = null;
      delete window[nameofthis];
      removeName(nameofthis);

      //console.log(e);
      //need to remove data from map and null any variable
    });

    $("#tools" + fileinid).click(function(e) {
      console.log(e, fileinid);
      let child2 = new BrowserWindow({
        width: 300,
        height: 300,
        modal: true,
        show: true
      })
      //?id=17
      child2.loadURL(`file://${__dirname}/layersettings.html?id=${nameofthis}`)
      child2.once('ready-to-show', () => {
        child2.show()
      })
      child2.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        child2 = null
      })
    });
  }
}catch(err){
  console.log(err)
  alert('error, check console')
}}

var mymap = L.map('map').setView([33.81067439928266, -118.12808990478517], 11);
// mymap.setMaxBounds(bounds);
var basemapProviderLayer = L.tileLayer.provider('OpenStreetMap.Mapnik');
basemapProviderLayer.addTo(mymap);
mymap.addControl(searchControl);
const fs = require('fs');
// mymap.on('moveend', function (e) {
//    console.log('moveend',mymap.getZoom());
//
//  });
// mymap.on('zoomend', function (e) {
//    console.log('zoomend',mymap.getZoom());
//  });

//JQUERY BLOCK
// const fs = require('fs-extra');
// const jsonfile = require('jsonfile');

// var myLayerTest = L.geoJSON().addTo(mymap);
// var geojsonfestures = testparse.kml('test.kml');
// console.log(geojsonfestures);
// var geojsonFeature;
// const url = 'http://geohub.lacity.org/datasets/15815de2275e4d658a213f0362a12efb_0.geojson';
//
//   fetch(url)
//   .then((resp) => resp.json())
//   .then(function(data) {
//       console.log(data)
//       geojsonFeature = data;
//       myLayerTest.addData(geojsonFeature);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });


const parseMe = require('./GeoParse.js');
const snippets = require('./snippets.js');
var supercluster , rbush, choropleth, desktopPath;
ipcRenderer.send('needDesktop', 'run');
ipcRenderer.on('desktopPath', (event, message) => {
  desktopPath = message;//necessary because otherwise on blank other stuff is written to root which means that it writes inside content folder in MacOS - easier if desktop is set
});
$(document).ready(function() {
  mymap.invalidateSize();
  $('#addData-button').click(function(e) {
    dialog.showOpenDialog({
        filters: [{
            name: 'GeoJSON',
            extensions: ['json', 'geojson']
          },
          {
            name: 'CSV',
            extensions: ['csv']
          },
          {
            name: 'KML',
            extensions: ['kml']
          }
        ],
        properties: ['openFile', 'multiSelections']
      },
      (fileNames) => {
        if (fileNames === undefined) {
          alert('No File Selected!');
        } else {
          readFile(fileNames);
        }
      });
  });

  $("#mapSettings-button").click(function(e) {
    let child = new BrowserWindow({
      width: 300,
      height: 300,
      modal: true,
      show: true
    })
    child.loadURL(`file://${__dirname}/mapsettings.html`)
    child.once('ready-to-show', () => {
      child.show()
    })
    child.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      child = null
    })
    child.webContents.on('crashed', event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }

      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
    child.on('unresponsive', event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }

      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
  });


  $("#mapExport-button").click(function(e) {
    let child5 = new BrowserWindow({
      width: 500,
      height: 350,
      modal: true,
      show: true
    })
    child5.loadURL(`file://${__dirname}/exportsettings.html`)
    child5.once('ready-to-show', () => {
      child5.show()
    })
    child5.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      child5 = null
    })
    child5.webContents.on('crashed', event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }

      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
    child5.on('unresponsive', event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }
      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
    ipcRenderer.on('channel5', (event, message) => {
        if (message.mapdest) exportoptions.projectdest = message.mapdest;
        if(message.maptitle) exportoptions.maptitle = message.maptitle;
        runWriteProcess();
    });

  });
  $("#mapInfo-button").click(function(e) {
    let child1 = new BrowserWindow({
      width: 500,
      height: 400,
      modal: true,
      show: true
    })
    child1.loadURL(`file://${__dirname}/mapinfo.html`)
    child1.once('ready-to-show', () => {
      child1.show()
    })
    child1.on('closed', function() {
      child1 = null
    })
  });

  $("#Data-Menu").click(function(e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  });
});
