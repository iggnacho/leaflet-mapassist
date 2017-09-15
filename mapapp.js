window.$ = require("jquery");
var L = require("leaflet");
require("leaflet.markercluster");
const remote = require("electron").remote;
const { dialog, BrowserWindow, Menu, MenuItem } = require("electron").remote;
const path = require("path");
const cp = require('child_process');
const {
  GeoSearchControl,
  OpenStreetMapProvider
} = require("leaflet-geosearch");
const { ipcRenderer } = require("electron");
require("leaflet-providers");
const provider = new OpenStreetMapProvider();
const searchControl = new GeoSearchControl({
  provider: provider,
  autoComplete: false,
  showMarker: false,
  searchLabel: "Enter Name of Location - OSM"
});
const menu = new Menu();
var exportoptions = {
  plugins: [
    // ['leaflet.markercluster', 'true']//REMOVE
  ],
  // "datanames": [[dataname,plugin,style,bindpopup,bindTooltip, sourcename]],
  // OBJECTID":38,"ReportID
  datanames: [
    // ['bikes', '', {
    //   "color": "#e41a1c",
    //   "weight": 5,
    //   "opacity": 0.8
    // }, 'properties.CLASS', 'properties.SOURCE'],
    // ['coyotes', 'markercluster', '', 'properties.ReportID', '', 'sourcename']
  ],
  mapoptions: [], //[tilelayer, zoommax,zoommin, bounds?, center]
  maptitle: undefined, // name on title of html
  projectname: "MA_Project_", //name of folder
  projectdest: undefined
};
var cssAdded = [];
var dataExport = [];

function checkOptionPlug(pluginname) {
  let isitin = false;
  if (cssAdded.includes(pluginname)) isitin = true;
  return isitin;
}

function addToNamePlug(datanameID, plugin) {
  console.log(datanameID);
  console.log("this is changing thre plugin");
  for (let i in exportoptions.datanames) {
    if (exportoptions.datanames[i][0] === datanameID) {
      if (
        !exportoptions.datanames[i][1].length > 0 ||
        !exportoptions.datanames[i][1].includes(plugin)
      ) {
        exportoptions.datanames[i][1].push(plugin);
        console.log("pushed plugin into the dataset object array");
      }
    }
  }
}
function addToNameexport(datanameID) {
  console.log(datanameID);
  console.log("this is changing thre export list");
  if (!dataExport.includes(datanameID)) {
    dataExport.push(datanameID);
  }
}

async function writeDataSets(pathtofolder) {
  return new Promise(async function(resolve, reject) {
    try {
      if (dataExport.length > 0) {
        for (let i in dataExport) {
          if (window[dataExport[i]]) {
            let pathName = pathtofolder + "/" + dataExport[i] + ".js";
            //let stringtoWrite = await JSON.stringify(window[exportoptions.datanames[i][0]].toGeoJSON());
            fs.writeFileSync(
              pathName,
              "var " +
                dataExport[i] +
                " = " +
                (await JSON.stringify(window[dataExport[i]].toGeoJSON()))
            );
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
  console.log(exportoptions);
  console.log("starting process");
  try {
    exportoptions.mapoptions[0] = basemapProviderLayer;
    exportoptions.mapoptions[4] = mymap.getZoom();
    exportoptions.mapoptions[5] = mymap.getCenter();
    if (!exportoptions.projectdest) exportoptions.projectdest = desktopPath;
    let testpath2 = await snippets.writeMap(exportoptions); //IN
    /*
  let winTest = new BrowserWindow({
    show:false,
    webPreferences: {
    nodeIntegrationInWorker: true
  }
});

winTest.loadURL(`file://${__dirname}/parserWorker.html`)
winTest.once('ready-to-show', () => {
  //winTest.hide()
})
winTest.webContents.on('did-finish-load', () => {
  winTest.webContents.send('pinging', exportoptions.projectdest)
  console.log('sending');
})
winTest.on('closed', function() {
  console.log('closing');
  winTest = null
})

*/

    await writeDataSets(testpath2); //IN
    exportoptions.maptitle = undefined; //reset the title...
  } catch (err) {
    console.log(err);
    alert("error writing map, please check console");
  }
}

function importCSS(hrefpath) {
  var styles = document.createElement("link");
  styles.rel = "stylesheet";
  styles.type = "text/css";
  styles.media = "screen";
  styles.href = hrefpath;
  document.getElementsByTagName("head")[0].appendChild(styles);
}
if (!ipcRenderer._events.mapsettingsI) {
  ipcRenderer.on("mapsettingsI", (event, message) => {
    console.log(basemapProviderLayer);
    let basemapProviderLayer1,
      validaterCheck = false,
      zoomdiffcheck = true,
      minzoomtest = 0,
      maxzoomtest = 19;
    console.log(message); // Prints 'message sent'
    // if (message.)
    for (let i in message) {
      console.log(i);
      switch (i) {
        case "mapextent":
          if (message.mapextent) {
            console.log("changing ext");
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
              console.log("changing basemap provider");
              mymap.removeLayer(basemapProviderLayer);
              basemapProviderLayer = basemapProviderLayer1;
              basemapProviderLayer.addTo(mymap);
            }
          }
          break;
        case "zoommin":
          if (message.zoommin.length > 0) {
            console.log("changing zoommin");
            mymap.setMinZoom(parseInt(message.zoommin));
            minzoomtest = parseInt(message.zoommin);
          }
          break;
        case "zoommax":
          if (message.zoommax.length > 0) {
            console.log("changing zoommax");
            mymap.setMaxZoom(parseInt(message.zoommax));
            maxzoomtest = parseInt(message.zoommax);
          }
          break;
        default:
          console.log("default");
      }
    }

    exportoptions.mapoptions[1] = mymap.options.maxBounds;
    exportoptions.mapoptions[2] = minzoomtest;
    exportoptions.mapoptions[3] = maxzoomtest;
  });
}

if (!ipcRenderer._events.layersetI) {
  ipcRenderer.on("layersetI", (event, message) => {
    console.log("CHANNEL 3", message);
    let propertylayer = "layer.feature.properties",
    style = {
      fillColor: message.fillcolor  ? message.fillcolor  : '#3388ff',
      fillOpacity: message.fillopacity  ? parseFloat(message.fillopacity)  : 0.2,
      color: message.strokecolor  ? message.strokecolor  : '#3388ff',
      opacity: message.strokeopacity  ? parseFloat(message.strokeopacity)  : 1
    };
console.log(style);
    // settingObject = {
    //   "bindpopupset": '',
    //   "bindtooltipset": '',
    //   "markercluster": false,
    //   "id": urlParams.get('id')
    // };
    if(message.fillcolor || message.fillopacity || message.strokecolor || message.strokeopacity){
        window[message.id].setStyle(style);
    }

    if (message.bindpopupset) {
      try{
      let stringarraypp = message.bindpopupset.split(" ");
      let stringarrayppsend = Array.from(stringarraypp);
      let indexlist = [];
      for (let i in stringarraypp) {
        if (
          stringarraypp[i].charAt(0) === "$" &&
          stringarraypp[i].charAt(1) !== "$"
        ) {
          console.log("property");
          stringarrayppsend[i] =
            "layer.feature.properties." + stringarraypp[i].substr(1) + '+" "'; //not og here
          //string for property
          indexlist.push(parseInt(i));
        } else if (
          stringarraypp[i].charAt(1) === "$" &&
          stringarraypp[i].charAt(0) === "$"
        ) {
          stringarraypp[i] = stringarraypp[i].substr(1);
          stringarrayppsend[i] = '"' + stringarrayppsend[i].substr(1) + ' "';
        } else {
          stringarrayppsend[i] = '"' + stringarrayppsend[i] + ' "';
        }
      }
      console.log(stringarrayppsend.join("+"));
      addPopData(message.id, stringarrayppsend.join(" +"), true);
      window[message.id].eachLayer(function(layer) {
        console.log();
        let arrayppreplc = stringarraypp.slice(0);
        // // console.log(htmlstringp)
        for (let i in indexlist) {
          let replace = arrayppreplc[indexlist[i]].substr(1);
          arrayppreplc[indexlist[i]] = layer.feature.properties[replace];
        }
        layer.bindPopup(arrayppreplc.join(" "));
      });
    }catch(e){
      console.log(e);
      alert('Issue with the binding of popup')
    }
    }

    if (message.bindtooltipset) {
      try{
      let stringarraytt = message.bindtooltipset.split(" ");
      let stringarrayttsend = Array.from(stringarraytt);
      let indexlist = [];
      for (let i in stringarraytt) {
        if (
          stringarraytt[i].charAt(0) === "$" &&
          stringarraytt[i].charAt(1) !== "$"
        ) {
          stringarrayttsend[i] =
            "layer.feature.properties." + stringarraytt[i].substr(1) + '+" "'; //not og here
          //string for property
          indexlist.push(parseInt(i));
        } else if (
          stringarraytt[i].charAt(1) === "$" &&
          stringarraytt[i].charAt(0) === "$"
        ) {
          stringarraytt[i] = stringarraytt[i].substr(1);
          stringarrayttsend[i] = '"' + stringarrayttsend[i].substr(1) + ' "';
        } else {
          stringarrayttsend[i] = '"' + stringarrayttsend[i] + ' "';
        }
      }
      addPopData(message.id, stringarrayttsend.join(" +"), false);
      window[message.id].eachLayer(function(layer) {
        let arrayttreplc = stringarraytt.slice(0);
        // console.log(htmlstringp)
        for (let i in indexlist) {
          // console.log(indexlist[i])
          let replace = arrayttreplc[indexlist[i]].substr(1);
          // console.log(replace);
          arrayttreplc[indexlist[i]] = layer.feature.properties[replace];
        }
        layer.bindTooltip(arrayttreplc.join(" "));
      });
    }catch(e){
      console.log(e);
      alert('Issue with the binding of tooltip')
    }
    }

    if (message.markercluster) {
      try{
      console.log("CALLLING ADDING MARKERCLUSTER");
      //CHECK CSS if they already have it before importing css
      if (!checkOptionPlug("leaflet.markercluster")) {
        importCSS(
          "./node_modules/leaflet.markercluster/dist/MarkerCluster.css"
        );
        importCSS(
          "./node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css"
        );
        cssAdded.push("leaflet.markercluster"); // adds to the array of css added
        console.log("added markercluster CSS");
      }

      let testiftrue = false;
      console.log(window[message.id]);
      let markers = L.markerClusterGroup();
      markers.addLayer(window[message.id]);
      if (mymap.hasLayer(window[message.id])) {
        mymap.removeLayer(window[message.id]);
        testiftrue = true;
      }
      window[message.id] = markers;
      //ADD markercluster to the options...
      console.log("adding to thre", message.id);
      addToNamePlug(message.id, "leaflet.markercluster");
      if (testiftrue) {
        window[message.id].addTo(mymap); //do i need to remove it before readding?
      }
    }catch(e){
      console.log(e);
      alert('Issue with the markercluster plugin')
    }
    }
  });
}

menu.append(
  new MenuItem({
    label: "Turn All Layers Off",
    click() {
      console.log("off clicked");
      {
        $("#" + exportoptions.datanames[i][0]).trigger("click");
      }
      for (let i in exportoptions.datanames) {
        if (mymap.hasLayer(window[exportoptions.datanames[i][0]])) {
          $("#" + exportoptions.datanames[i][0]).trigger("click");
        }
      }
    }
  })
);
menu.append(
  new MenuItem({
    label: "Turn All Layers On",
    click() {
      console.log("on clicked");
      for (let i in exportoptions.datanames) {
        if (!mymap.hasLayer(window[exportoptions.datanames[i][0]])) {
          $("#" + exportoptions.datanames[i][0]).trigger("click");
        }
      }
    }
  })
);
menu.append(
  new MenuItem({
    label: "Remove All Layers",
    click() {
      while (exportoptions.datanames[0]) {
        $("#cancel" + exportoptions.datanames[0][0]).trigger("click");
      }
    }
  })
);

function addPopData(id, words, whatis) {
  for (let i in exportoptions.datanames) {
    if (
      window[exportoptions.datanames[i][0]] &&
      exportoptions.datanames[i][0] === id
    ) {
      if (whatis) {
        exportoptions.datanames[i][3] = words;
      } else {
        //false is tooltip
        exportoptions.datanames[i][4] = words;
      }
    }
  }
} //[[dataname,plugin,style,bindpopup,bindTooltip]],
function setMSettings(settings) {
  //send array [basemap provider, maxzoom, minzoom, extent]
  let basemapProviderLayer1,
    validateProvider = true;
  if (settings[0].trim().length > 1) {
    try {
      basemapProviderLayer1 = L.tileLayer.provider(settings[0].trim());
    } catch (err) {
      validateProvider = false;
      console.log(err);
    }
  }
  if (validateProvider) {
    console.log("changing basemap provider");
    mymap.removeLayer(basemapProviderLayer);
    basemapProviderLayer = basemapProviderLayer1;
    basemapProviderLayer.addTo(mymap);
    basemapProviderLayer1 = null;
  }
}
// var childfork = cp.fork('run_child1.js');
//
// childfork.on("message", (data)=>{
//   console.log(data);
// })
// childfork.send("message");
//Add child within the readFileType or to replace it in its entirety, only finish once response is returned as an object and not a string
async function readFileType(extension, pathToData, nameofFilePath) {
  console.log("here");
  //.trim().replace(/\W /g,"_");
  //send lowercase extension
  console.log("here2");
  return new Promise(function(resolve, reject) {
    try {
      switch (extension) {
        case ".kml":
          //window[nameofFilePath] = L.geoJSON( parseMe.kml(pathToData)); IN only line apart from resolve and break in kml

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
          });
          child4.loadURL(`file://${__dirname}/csvRun.html`);
          child4.once("ready-to-show", () => {
            child4.show();
          });
          child4.on("closed", function() {
            child4 = null;
          });
          if (!ipcRenderer._events.csvI) {
            ipcRenderer.on("csvI", async (event, message) => {
              window[nameofFilePath] = L.geoJSON();
              let test22 = await parseMe.csv(
                pathToData,
                message.lat,
                message.lon,
                message.delimiter
              );
              window[nameofFilePath].addData(test22);
              resolve();
            });
          }
          break;
        default:
          //json and geojson
          // omnivore.geojson(pathToData).addTo(mymap);
          console.log("here3");
          window[nameofFilePath] = L.geoJSON(parseMe.geojsonLoad(pathToData));
          console.log("here4");
          resolve();
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}
function nameCheck(nameofthis) {
  if (window[nameofthis]) {
    return false; // var exist
  }
  return true; //var does not exist
}

function removeName(nameofthis) {
  for (let i in exportoptions.datanames) {
    if (nameofthis === exportoptions.datanames[i][0])
      exportoptions.datanames.splice(i, 1);
  }
  console.log(exportoptions.datanames);
  console.log(exportoptions.plugins); // I NEED TO REMOVE THE PLUGIN WHEN THE LAST DATASET USING PLUGIN IS DELETED
}
function changeName(name1, number1) {
  return name1 + "_" + number1 + "_";
}
async function checkNamesDup(nameofthedata) {
  return new Promise(function(resolve, reject) {
    try {
      let numbertosend = 1;
      while (window[nameofthedata]) {
        console.log(nameofthedata);
        nameofthedata = changeName(nameofthedata, numbertosend);
        numbertosend++;
      }
      resolve(nameofthedata);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

async function readFile(filesSelected) {
  console.log("READFILE");
  try {
    // console.log(filesSelected);
    let kids = $("#listgroup").children();
    let hasNumber = /\d/;
    // console.log(kids, kids.length);
    for (i in filesSelected) {
      console.log(filesSelected[i]);
      let nameofthis = path
        .basename(filesSelected[i], path.extname(filesSelected[i]))
        .trim()
        .replace(/\W/g, "_");
      if (hasNumber.test(nameofthis.charAt(0))) nameofthis = "_" + nameofthis; ///change this
      let ogname = nameofthis;
      //try await and use a promise for the readfiletype?
      nameofthis = await checkNamesDup(nameofthis);
      console.log(nameofthis);

      //throw "duplicate";//throw error if data name is already in there or if if name is not over 0 char
      await readFileType(
        path.extname(filesSelected[i]).toLowerCase(),
        filesSelected[i],
        nameofthis
      );
      console.log("here5");
      console.log(Object.keys(window[nameofthis]._layers).length);
      //push layer into datanames

      exportoptions.datanames.push([
        nameofthis,
        [],
        undefined,
        undefined,
        undefined,
        ogname
      ]);
      console.log(exportoptions.datanames);
      addToNameexport(ogname);
      let spanMain = `<span class="nav-group-item" title="${nameofthis}"><input id="${nameofthis}" type="checkbox"title="Toggle Visibility"> ${nameofthis}<span class="icon icon-tools"id="tools${nameofthis}" title="Layer Settings"></span><span class="icon icon-cancel" id="cancel${nameofthis}" title="Delete Layer"></span></span>`;
      $("#listgroup").append(spanMain);

      $("#" + nameofthis).click(function(e) {
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

      $("#cancel" + nameofthis).click(function(e) {
        e.target.parentElement.remove();
        mymap.removeLayer(window[nameofthis]);
        window[nameofthis] = null;
        delete window[nameofthis];
        removeName(nameofthis);
        //console.log(e);
        //need to remove data from map and null any variable
      });

      $("#tools" + nameofthis).click(function(e) {
        console.log(e, nameofthis);
        let child2 = new BrowserWindow({
          width: 300,
          height: 300,
          modal: true,
          show: true
        });
        //?id=17
        child2.loadURL(
          `file://${__dirname}/layersettings.html?id=${nameofthis}`
        );
        //child2.webContents.openDevTools();
        child2.once("ready-to-show", () => {
          child2.show();
        });
        child2.on("closed", function() {
          // Dereference the window object, usually you would store windows
          // in an array if your app supports multi windows, this is the time
          // when you should delete the corresponding element.
          child2 = null;
        });
      });
    }
  } catch (err) {
    console.log(err);
    alert("error reading data, check console");
  }
}

var mymap = L.map("map").setView([0, 0], 1.2);
// mymap.setMaxBounds(bounds);
var basemapProviderLayer = L.tileLayer.provider("OpenStreetMap.Mapnik");
basemapProviderLayer.addTo(mymap);
mymap.addControl(searchControl);
const fs = require("fs");
const parseMe = require("./GeoParse.js");
const snippets = require("./snippets.js");
var supercluster, rbush, choropleth, desktopPath;
ipcRenderer.send("needDesktop", "run");
if (!ipcRenderer._events.desktopPath) {
  ipcRenderer.on("desktopPath", (event, message) => {
    desktopPath = message; //necessary because otherwise on blank other stuff is written to root which means that it writes inside content folder in MacOS - easier if desktop is set
  });
}




$(document).ready(function() {
  mymap.invalidateSize();
  $("#addData-button").click(function(e) {
    dialog.showOpenDialog(
      {
        filters: [
          {
            name: "GeoJSON",
            extensions: ["json", "geojson"]
          },
          {
            name: "CSV",
            extensions: ["csv"]
          },
          {
            name: "KML",
            extensions: ["kml"]
          }
        ],
        properties: ["openFile", "multiSelections"]
      },
      fileNames => {
        if (fileNames === undefined) {
          alert("No File Selected!");
        } else {
          readFile(fileNames);
        }
      }
    );
  });

  $("#mapSettings-button").click(function(e) {
    let child = new BrowserWindow({
      width: 300,
      height: 300,
      modal: true,
      show: true
    });
    child.loadURL(`file://${__dirname}/mapsettings.html`);
    child.once("ready-to-show", () => {
      child.show();
    });
    child.on("closed", function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      child = null;
    });
    child.webContents.on("crashed", event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }

      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
    child.on("unresponsive", event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }

      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
  });

  $("#mapExport-button").click(function(e) {
    console.log("EXPORTING");
    console.log(exportoptions);
    let child5 = new BrowserWindow({
      width: 500,
      height: 350,
      // modal: true,
      show: true
    });
    child5.loadURL(`file://${__dirname}/exportsettings.html`);
    child5.once("ready-to-show", () => {
      child5.show();
    });
    child5.on("closed", function() {
      child5 = null;
    });
    child5.webContents.on("crashed", event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }

      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
    child5.on("unresponsive", event => {
      // for (var k in event) {
      //   console.log('crashed : ' + k);
      // }
      Console.error(`Window "${this.name}" crashed: ${event}`);
    });
    //
    //check if there is already a exportI?
    if (!ipcRenderer._events.exportI) {
      ipcRenderer.on("exportI", (event, message) => {
        console.log(message);
        console.log(exportoptions);
        if (message.mapdest) exportoptions.projectdest = message.mapdest;
        if (message.maptitle) exportoptions.maptitle = message.maptitle;
        runWriteProcess();
      });
    }
  });
  $("#mapInfo-button").click(function(e) {
    let child1 = new BrowserWindow({
      width: 500,
      height: 400,
      modal: true,
      show: true
    });
    child1.loadURL(`file://${__dirname}/mapinfo.html`);
    child1.once("ready-to-show", () => {
      child1.show();
    });
    child1.on("closed", function() {
      child1 = null;
    });
  });

  $("#Data-Menu").click(function(e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
  });
});
