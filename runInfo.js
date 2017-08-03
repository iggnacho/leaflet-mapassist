
const shell = require('electron').shell
const exLinksBtn = document.getElementById('aproviderlink');
exLinksBtn.addEventListener('click', function (event) {
  shell.openExternal('https://github.com/iggnacho/leaflet-mapassist')
})
