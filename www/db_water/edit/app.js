const url = "https://engrids.soc.cmu.ac.th/api";
let iddata = sessionStorage.getItem('id_data');
// console.log(iddata)
// let fromAdmin = sessionStorage.getItem('w_from_admin');
$(document).ready(() => {
    getedit(iddata)
});
let id_date = iddata;
let iconred = L.icon({
    iconUrl: './../assets/img/apple-touch-icon.png',
    iconSize: [50, 50],
    iconAnchor: [12, 37],
    popupAnchor: [5, -30]
});
let getedit = (id_date) => {
    var url = "https://engrids.soc.cmu.ac.th/api";
    axios.post(url + `/dbwater-eac/getdataone`, { proj_id: id_date }).then(async (r) => {
        // axios.get(`https://engrids.soc.cmu.ac.th/api/learning-eac/getdataone`, {proj_id: id_date }).then(async (r) => {
        var d = r.data.data;
        // console.log(d)
        let marker = L.marker([Number(d[0].lat), Number(d[0].lng)], {
            // icon: iconred
            maxZoom: 20,
            name: 'marker',
            data: d
        }).addTo(map);;
        var popup = marker.bindPopup(`<h6><b>ตำแหน่ง</b></h6><span class="kanit-16"> ชื่อแหล่งน้ำ: ${d[0].watername}<span>`);
        popup.openPopup();

        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
        // map.fitBounds(marker.getBounds());F

        d[0].lat !== 'null' ? $('#lat').val(d[0].lat) : null;
        d[0].lng !== 'null' ? $('#lng').val(d[0].lng) : null;
        d[0].accuracy !== 'null' ? $('#accuracy').val(d[0].accuracy) : null;
        d[0].prov_tn !== 'null' ? $('#pro').val(d[0].prov_tn) : null;
        d[0].amp_tn !== 'null' ? $('#amp').val(d[0].amp_tn) : null;
        d[0].tam_tn !== 'null' ? $('#tam').val(d[0].tam_tn) : null;

        d[0].id_date !== 'null' ? $('#id_date').val(d[0].id_date) : null;
        d[0].watername !== 'null' ? $('#watername').val(d[0].watername).change() : null;
        d[0].no !== 'null' ? $('#no').val(d[0].no).change() : null;
        d[0].moo !== 'null' ? $('#moo').val(d[0].moo).change() : null;
        d[0].vill !== 'null' ? $('#vill').val(d[0].vill).change() : null;

        d[0].wlev1 !== '' ? $('#wlev1').prop('onclick', true) : null;

        d[0].waterpollu1 !== '' ? $('#waterpollu1').prop('checked', true) : null;
        d[0].waterpollu2 !== '' ? $('#waterpollu2').prop('checked', true) : null;
        d[0].waterpollu3 !== '' ? $('#waterpollu3').prop('checked', true) : null;
        d[0].waterpollu4 !== '' ? $('#waterpollu4').prop('checked', true) : null;
        d[0].waterpollu5 !== '' ? $('#waterpollu5').prop('checked', true) : null;
        d[0].waterpollu6 !== '' ? $('#waterpollu6').prop('checked', true) : null;
        d[0].waterpollu7 !== '' ? $('#waterpollu7').prop('checked', true) : null;
        d[0].waterpollu8 !== '' ? $('#waterpollu8').prop('checked', true) : null;
        d[0].waterpollu9 !== '' ? $('#waterpollu9').prop('checked', true) : null;
        d[0].waterpollu10 !== 'null' ? $('#waterpollu10').val(d[0].waterpollu10).change() : null;


        d[0].datetimes == 'null' ? $('#datetimes').val(d[0].datetimes) : null

        // d[0].imgfile !== 'null' ? $('#preview').attr("src", d[0].imgfile) : null
        d[0].imgfile1 !== 'null' ? $('#preview1').attr("src", d[0].imgfile1) : null
        d[0].imgfile2 !== 'null' ? $('#preview2').attr("src", d[0].imgfile2) : null
        d[0].imgfile3 !== 'null' ? $('#preview3').attr("src", d[0].imgfile3) : null
        d[0].imgfile4 !== 'null' ? $('#preview4').attr("src", d[0].imgfile4) : null
        d[0].imgfile5 !== 'null' ? $('#preview5').attr("src", d[0].imgfile5) : null
        d[0].imgfile6 !== 'null' ? $('#preview6').attr("src", d[0].imgfile6) : null
        d[0].record !== 'null' ? $('#record').val(d[0].record) : null
        d[0].id_user !== 'null' ? $('#record').val(d[0].record) : null
        //
    })
}

let latlng = {
    lat: 13.305567,
    lng: 101.383101
};
let map = L.map("map", {
    center: latlng,
    zoom: 8
});
const mapbox = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
        maxZoom: 18,
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/light-v9",
        tileSize: 512,
        zoomOffset: -1
    }
);

const ghyb = L.tileLayer("https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

const tam = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:tam_eac",
    format: "image/png",
    transparent: true,
    // maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const amp = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:amp_eac",
    format: "image/png",
    transparent: true,
    // maxZoom: 14,
    // minZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:prov_eac",
    format: "image/png",
    transparent: true,
    // maxZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});


const baseMaps = {
    "Mapbox": mapbox.addTo(map),
    "Google Hybrid": ghyb
};

const overlayMaps = {
    "ขอบเขตจังหวัด": pro.addTo(map),
    "ขอบเขตอำเภอ": amp,
    "ขอบเขตตำบล": tam,
};

const lyrControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);


map.pm.addControls({
    position: 'topleft',
    drawMarker: true,
    drawCircle: false,
    drawPolyline: false,
    drawRectangle: true,
    drawCircleMarker: false,
    cutPolygon: false,
    editMode: true,
    removalMode: true,
    dragMode: false,
    rotateMode: false,
});
let datageom
map.on('pm:create', e => {
    var data = e.layer.toGeoJSON();
    if (data.geometry.type == "Point") {
        var latlng = data.geometry.coordinates;
        var lat = $('#lat').val();
        var lng = $('#lng').val();

        if (lat == "" && lng == "") {
            $('#lat').val(latlng[1]);
            $('#lng').val(latlng[0]);
            $('#accuracy').val(0);
        }
    }
    // console.log(e.layer.toGeoJSON())
    datageom = e.layer.toGeoJSON();
});
map.on('pm:remove', e => {
    // console.log(e)
    $('#lat').val("");
    $('#lng').val("");
    $('#accuracy').val("");
})

let latlnggps
let onLocationFound = (e) => {
    // console.log(e)
    var radius = e.accuracy;
    // if (radius <= 50) {
    latlnggps = e.latlng;
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    $('#lat').val(lat.toFixed(7));
    $('#lng').val(lng.toFixed(7));
    $('#accuracy').val(radius.toFixed(2));
    // }
    // changeLatlng(e.latlng);
}
function changeLatlng(latlng) {
}


var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: "ตำแหน่ง"
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);
// lc.start();
let markerlocate = () => {
    lc.start();
}
let gps
let stoplocate = () => {
    lc.stop();
    gps = L.marker(latlnggps, {
        draggable: true,
        name: 'Marker'
    });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
}
let dataimgurl1 = "";
let dataimgurl2 = "";
let dataimgurl3 = "";
let dataimgurl4 = "";
let dataimgurl5 = "";
let dataimgurl6 = "";
let resize = (R_img) => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById(`imgfile${R_img}`).files;
        var file = filesToUploads[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.src = e.target.result;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 800;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                if (R_img == 1) { dataimgurl1 = canvas.toDataURL(file.type) }
                else if (R_img == 2) { dataimgurl2 = canvas.toDataURL(file.type) }
                else if (R_img == 3) { dataimgurl3 = canvas.toDataURL(file.type) }
                else if (R_img == 4) { dataimgurl4 = canvas.toDataURL(file.type) }
                else if (R_img == 5) { dataimgurl5 = canvas.toDataURL(file.type) }
                else if (R_img == 6) { dataimgurl6 = canvas.toDataURL(file.type) }

                // document.getElementById('output').src = dataurl;
            }
            reader.readAsDataURL(file);
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

}

$('#imgfile1').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview1').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(1);
});
$('#imgfile2').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview2').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(2);
});
$('#imgfile3').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview3').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(3);
});
$('#imgfile4').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview4').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(4);
});
$('#imgfile5').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview5').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(5);
});
$('#imgfile6').change(function (evt) {
    // console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview6').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize(6);
});

let waterlevel;
function getLv(a) {
    waterlevel = a;
    $(".btn-outline-primary").addClass("btn btn-outline-primary border-none");
    a == 'ระดับต่ำกว่าปกติ' ? $("#wl1").addClass("BG02") : $("#wl1").removeClass("BG02");
    a == 'ระดับปกติ' ? $("#wl2").addClass("BG02") : $("#wl2").removeClass("BG02");
    a == 'ระดับสูงกว่าปกติ' ? $("#wl3").addClass("BG02") : $("#wl3").removeClass("BG02");
    a == 'น้ำท่วมสูง' ? $("#wl4").addClass("BG02") : $("#wl4").removeClass("BG02");
    // console.log(a)
}

let savedata = async () => {
    // console.log(geom[0]);

    let wp1, wp2, wp3, wp4, wp5, wp6, wp7, wp8, wp9
    var wpollu1 = document.getElementById('waterpollu1');
    if (wpollu1.checked == true) {
        wp1 = $('#waterpollu1').val()
    } else { wp1 = "" }
    var wpollu2 = document.getElementById('waterpollu2');
    if (wpollu2.checked == true) {
        wp2 = $('#waterpollu2').val()
    } else { wp2 = "" }
    var wpollu3 = document.getElementById('waterpollu3');
    if (wpollu3.checked == true) {
        wp3 = $('#waterpollu3').val()
    } else { wp3 = "" }
    var wpollu4 = document.getElementById('waterpollu4');
    if (wpollu4.checked == true) {
        wp4 = $('#waterpollu4').val()
    } else { wp4 = "" }
    var wpollu5 = document.getElementById('waterpollu5');
    if (wpollu5.checked == true) {
        wp5 = $('#waterpollu5').val()
    } else { wp5 = "" }
    var wpollu6 = document.getElementById('waterpollu6');
    if (wpollu6.checked == true) {
        wp6 = $('#waterpollu6').val()
    } else { wp6 = "" }
    var wpollu7 = document.getElementById('waterpollu7');
    if (wpollu7.checked == true) {
        wp7 = $('#waterpollu7').val()
    } else { wp7 = "" }
    var wpollu8 = document.getElementById('waterpollu8');
    if (wpollu8.checked == true) {
        wp8 = $('#waterpollu8').val()
    } else { wp8 = "" }
    var wpollu9 = document.getElementById('waterpollu9');
    if (wpollu9.checked == true) {
        wp9 = $('#waterpollu9').val()
    } else { wp9 = "" }

    let data = [{
        lat: $('#lat').val(),
        lng: $('#lng').val(),
        accuracy: $('#accuracy').val(),
        watername: $('#watername').val(),
        no: $('#no').val(),
        moo: $('#moo').val(),
        vill: $('#vill').val(),
        prov_tn: $('#pro').val(),
        amp_tn: $('#amp').val(),
        tam_tn: $('#tam').val(),
        id_date:  iddata,
        proj_id: $('#proj_id').val(),
        datetimes: $('#datetimes').val(),
        record: $('#record').val(),

        wlev1: waterlevel,

        waterpollu1: wp1,
        waterpollu2: wp2,
        waterpollu3: wp3,
        waterpollu4: wp4,
        waterpollu5: wp5,
        waterpollu6: wp6,
        waterpollu7: wp7,
        waterpollu8: wp8,
        waterpollu9: wp9,
        waterpollu10: $('#waterpollu10').val(),

        // proj_id: $('#proj_id').val(),
        datetimes: $('#datetimes').val(),
        record: $('#record').val(),
        imgfile1: dataimgurl1,
        imgfile2: dataimgurl2,
        imgfile3: dataimgurl3,
        imgfile4: dataimgurl4,
        imgfile5: dataimgurl5,
        imgfile6: dataimgurl6,
        id_user: $('#record').val(),
        geom: datageom ? datageom : { type: 'Point', coordinateslng: [$('#lng').val(),], coordinateslat: [$('#lat').val(),] },

    }]
    // console.log(data)
    sendData(data)
}

let sendData = async (data) => {
    const obj = {
        id_date:  iddata,
        data: data
    }
    // console.log(data)
    await axios.post(url + "/dbwater-eac/update", obj).then((r) => {
        // console.log(r.data.data)       
        r.data.data == "success" ? $('#Modalconfirm').modal('show') : null

    })
}
// sendData()

let Modalconfirm = (geom) => {
    if (geom !== 'null') {
        $('#Modalconfirm').modal('show');
    } else {
        $('#Modalconfirm').modal('hide');
    }
}

// let closeModal = () => {
//     $('#Modalconfirm').modal('hide')
// }

// let link;
// if (fromAdmin) {
//     link = "./../dashboard/index.html"
//     sessionStorage.removeItem('id_data');
// } else {
//     link = "./../dashboard/index.html"
// }

let gotoDashboard = () => {
    location.href = "./../dashboard/index.html";
    sessionStorage.removeItem('id_data');
}