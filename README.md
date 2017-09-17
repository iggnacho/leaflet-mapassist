# leaflet-mapassist <img src="https://user-images.githubusercontent.com/13355797/30506491-2a176fe0-9a31-11e7-9b8d-6f90464c37b3.png" width="50">
Design and Export Leaflet Maps

## Use Case
Leaflet Map Assist is a desktop application built on the Electron framework to allow for interactive designing of Leaflet maps and exporting the web map assets. The application includes markercluster plugin for markers, settiing map extent and zoom levels, changing basemaps, support for styling polylines and polygons, setting map titles, and setting tooltips and popups. Exported web maps are responsive and support mobile display.  

*Supported formats of data include CSV, KML, and GeoJSON.*
*Data must be projected to EPSG:3857. It is highly recommended to prune data to its geographic extent and required attributes.*

## Getting Started

You can clone/download the project, edit, and build the application yourself with the given package commands in the `package.json`

If you do not wish to edit or change anything feel free to use the pre-packaged links:

Windows
https://drive.google.com/open?id=0ByQKUaN2E6C8Z1NFYlJVZ1ZuVFk

Mac
https://drive.google.com/open?id=0ByQKUaN2E6C8d3BXMWJXM1pEQzg

### Prerequisites

To build the application Node.js is needed.


### Building Application

Download/Clone repository

Install the packages

```
npm install
```

Run build command
Windows:
```
npm run package-win
```
OR
Mac:
```
npm run package-mac
```
Once building is completed, you should have a new folder with the Electron Application executable ready to use.

## Using the Application

Once application is running you should be presented with the following UI:

<img src="https://user-images.githubusercontent.com/13355797/30506363-2813c5dc-9a30-11e7-9c11-9e1a528e94aa.png" height="400">

Maps can be designed by adding data and editing map and layer options:

<img src="https://user-images.githubusercontent.com/13355797/30506361-28134440-9a30-11e7-9268-8bb33fd4469c.png" height="400">

Furthermore, maps can be exported to the web assets to distribute/host yourself:

<img src="https://user-images.githubusercontent.com/13355797/30506360-27fc0730-9a30-11e7-9e1b-0823f7d03a6e.png" height="200">

Check out your exported Leaflet map in your browser:

<img src="https://user-images.githubusercontent.com/13355797/30515012-69586d04-9ad5-11e7-88bf-24ac6a2c1135.png" height="400">

For further instructions on the application check out the video: coming soon...

## Author and Info

Ignacio E. Carter Cuadra with the help of the other authors of packages used in this project. Project was made as the main project deliverable for MS-GIS program in CSULB.  
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
