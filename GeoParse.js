const fs = require('fs'),
    toGeoJSON = require('togeojson'),
    parse = require('csv-parse');
module.exports.geojsonLoad = geojsonLoad;
module.exports.geojsonWrite = geojsonWrite;
module.exports.csv = csvLoad;
module.exports.csv2 = csvLoad2;
module.exports.kml = kmlLoad;

// url or file directory accepted
function geojsonLoad(pointer, indicator = false) {
    var layer;
    if (indicator){
      //fetch api
      let url = pointer;
        fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            layer = data;
        })
        .catch(function(error) {
          console.log(error);
          layer = null;
        });
    }else{
      //jsonload
      try{
        let content =fs.readFileSync(pointer);
        layer = JSON.parse(content);
      }catch(err){
        console.log(err);
        layer =null;
      }
    }
    return layer;
}

//write geojson object to path
function geojsonWrite(pathTo, content) {
  let test;
  try{
    var str = JSON.stringify(content)
    // not sure if fs.writeFileSync returns anything, but just in case
    fs.writeFileSync(pathTo, str)
    test = true;
  }catch(err){
    console.log(err);
    test = false;
  }
  //return true for written and false for not
    return test;
}

function csvParse2(data, lat, lon){
  return new Promise(function (resolve, reject) {
    let features = [],
    featurecollection = {type: 'FeatureCollection', features: features};
    for(let value in data){
       let propertiesObj = {}
       for (let ps in data[value])
       {
         if(ps !== lat || ps !== lon) propertiesObj[ps] = data[value][ps]
       }
       features.push({
           type: 'Feature',
           properties : propertiesObj,
           geometry: {
               type: 'Point',
               coordinates: [
                   parseFloat(data[value][lon]),
                   parseFloat(data[value][lat])
               ]
           }
       });
     }
    resolve(featurecollection)
  });
}

function csvLoad2(pointer, lat , lon , delimiterchar, indicator) {
    // Promises require two functions: one for success, one for failure
    return new Promise(function (resolve, reject) {

      let output = []
      let parser = parse({delimiter: delimiterchar, columns: true });
      parser.on('readable', function(){
        while(record = parser.read()){
          output.push(record);
        }
      });
      // Catch any error
      parser.on('error', function(err){
        console.log(err.message);
        reject(err)
      });
      // When we are done, test that the parsed output matched what expected
      parser.on('finish', function(){
        resolve(output);
      });
      console.log('start');
      fs.createReadStream(pointer).pipe(parser);
      console.log('after stream start');
    });
}


async function csvLoad (pointer, lat = 'lat', lon = 'lon', delimiterchar = ',', indicator = false){
  try{
    let result = await csvLoad2(pointer, lat, lon, delimiterchar, indicator = false);
    let data = await csvParse2(result, lat, lon);
    return data;
  }catch(err){
    console.log(err)
    return err;
  }
}
function kmlLoad (pointer, styles=false){
  var layer;
  if(styles){
  try{
    let content =fs.readFileSync(pointer);
    content = (new DOMParser()).parseFromString(content, 'text/xml');
      layer = toGeoJSON.kml(content, {styles:true})
  }catch(err){
    console.log(err);
  }}else{
    try{
      let content =fs.readFileSync(pointer);
      content = (new DOMParser()).parseFromString(content, 'text/xml');
        layer = toGeoJSON.kml(content)
    }catch(err){
      console.log(err);
    }
  }
  return layer;
}
