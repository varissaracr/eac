let geoJSON
$(document).ready(() => {
    var geoJsonUrl = "https://engrids.soc.cmu.ac.th/geoserver/eac/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=eac%3Aprov_eac&maxFeatures=50&outputFormat=application%2Fjson";
    axios.get(geoJsonUrl).then(r => {
        geoJSON = r.data
    })
});
window.am5geodata_eacLow = (function () { var map = geoJSON; return map; })();