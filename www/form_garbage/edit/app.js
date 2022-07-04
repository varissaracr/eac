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
    axios.post(url + `/garbage-eac/getdataone`, { proj_id: id_date }).then(async (r) => {
        // axios.get(`https://engrids.soc.cmu.ac.th/api/learning-eac/getdataone`, {proj_id: id_date }).then(async (r) => {
        var d = r.data.data;
        // console.log(d)
        let marker = L.marker([Number(d[0].lat), Number(d[0].lng)], {
            // icon: iconred
            maxZoom: 20,
            name: 'marker',
            data: d
        }).addTo(map);;
        var popup = marker.bindPopup(`<h6><b>ตำแหน่ง</b></h6><span class="kanit-16"> ${d[0].placegarbage} <span>`);
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
        d[0].placegarbage !== 'null' ? $('#placegarbage').val(d[0].placegarbage).change() : null;
        d[0].coordinate !== 'null' ? $('#coordinate').val(d[0].coordinate).change() : null;

        d[0].dtype1 !== 'ไม่มี' || d[0].dtype1 !== null ? $('#noA3').text(d[0].dtype1) : null;
        d[0].dtype2 !== 'ไม่มี' || d[0].dtype2 !== null ? $('#noB3').text(d[0].dtype2) : null;
        d[0].dtype3 !== 'ไม่มี' || d[0].dtype3 !== null ? $('#noC3').text(d[0].dtype3) : null;
        d[0].dtype4 !== 'ไม่มี' || d[0].dtype4 !== null ? $('#noD3').text(d[0].dtype4) : null;
        d[0].dtype5 !== 'ไม่มี' || d[0].dtype5 !== null ? $('#noE3').text(d[0].dtype5) : null;
    
        d[0].gbpollu1 !== '' ? $('#gbpollu1').prop('checked', true) : null;
        d[0].gbpollu2 !== '' ? $('#gbpollu2').prop('checked', true) : null;
        d[0].gbpollu3 !== '' ? $('#gbpollu3').prop('checked', true) : null;
        d[0].gbpollu4 !== '' ? $('#gbpollu4').prop('checked', true) : null;
        d[0].gbpollu5 !== 'null' ? $('#gbpollu5').val(d[0].gbpollu5).change() : null;

        d[0].status == "ยังไม่ได้ดำเนินการแก้ไข" ? $('input[name=radioName][value="ยังไม่ได้ดำเนินการแก้ไข"]').prop('checked', 'checked') : null
        d[0].status == "กำลังดำเนินการแก้ไข" ? $('input[name=radioName][value="กำลังดำเนินการแก้ไข"]').prop('checked', 'checked') : null
        d[0].status == "ดำเนินการแก้ไขเรียบร้อย" ? $('input[name=radioName][value="ดำเนินการแก้ไขเรียบร้อย"]').prop('checked', 'checked') : null

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


// $("#noA2").hide()
// $("#noB2").hide()
// $("#noC2").hide()
// $("#noD2").hide()
// $("#noE2").hide()

let typess = []
let gettype = (d, e, f, g) => {
    var a = $("#" + d).attr('class')
    if (a == 'btn btn-outline-primary border-none') {
        $("#" + d).removeAttr("style").toggleClass("BG02");
        $("#" + e).slideDown();
        var b = d.split("1");
        $("#" + b[0]).removeClass("type")
        if (f == 'ขยะเปียก') {
            typess.push({ type1: f })
        } else if (f == 'ขยะรีไซเคิล') {
            typess.push({ type2: f })
        } else if (f == 'ขยะทั่วไป') {
            typess.push({ type3: f })
        } else if (f == 'ขยะอันตราย') {
            typess.push({ type4: f })
        } else if (f == 'ขยะอื่นๆ') {
            typess.push({ type5: f })
        }
        // console.log(typess)
        // console.log(b)
        // console.log(d)
        // console.log(e)
        // console.log(f)
    } else {
        $("#" + d).removeClass("BG02")
        $("#" + e).slideUp();
        var b = d.split("1");
        $("#" + b[0]).toggleClass("type")
        typess.pop({ f })
        // console.log(typess)
    }
}

var sts
$('#status input').on('change', function () {
    sts = $('input[name=radioName]:checked', '#status').val()
    // console.log($('input[name=gridRadios]:checked', '#status').val());
});

let savedata = async () => {

    let dt1, dt2, dt3, dt4, dt5
    var dtypess = []
    $("#noA3").val() !== '' ? dt1 = $("#noA3").val() : dt1 = 'ไม่มี';
    $("#noB3").val() !== '' ? dt2 = $("#noB3").val() : dt2 = 'ไม่มี';
    $("#noC3").val() !== '' ? dt3 = $("#noC3").val() : dt3 = 'ไม่มี';
    $("#noD3").val() !== '' ? dt4 = $("#noD3").val() : dt4 = 'ไม่มี';
    $("#noE3").val() !== '' ? dt5 = $("#noE3").val() : dt5 = 'ไม่มี';
    // console.log(dt1, dt2, dt3, dt4, dt5)

    let t1, t2, t3, t4, t5
    dt1 !== 'ไม่มี' ? t1 = 'ขยะเปียก' : t1 = 'ไม่มี';
    dt2 !== 'ไม่มี' ? t2 = 'ขยะรีไซเคิล' : t2 = 'ไม่มี';
    dt3 !== 'ไม่มี' ? t3 = 'ขยะทั่วไป' : t3 = 'ไม่มี';
    dt4 !== 'ไม่มี' ? t4 = 'ขยะอันตราย' : t4 = 'ไม่มี';
    dt5 !== 'ไม่มี' ? t5 = 'ขยะอื่นๆ' : t5 = 'ไม่มี';
    // console.log(t1, t2, t3, t4, t5)

    let G1, G2, G3, G4, G5
    var Gb1 = document.getElementById('gbpollu1');
    if (Gb1.checked == true) {
        G1 = $('#gbpollu1').val()
    } else { G1 = "" }
    var Gb2 = document.getElementById('gbpollu2');
    if (Gb2.checked == true) {
        G2 = $('#gbpollu2').val()
    } else { G2 = "" }

    var Gb3 = document.getElementById('gbpollu3');
    if (Gb3.checked == true) {
        G3 = $('#gbpollu3').val()
    } else { G3 = "" }

    var Gb4 = document.getElementById('gbpollu4');
    if (Gb4.checked == true) {
        G4 = $('#gbpollu4').val()
    } else { G4 = "" }

    var Gb5 = document.getElementById('gbpollu5');
    if (Gb5.checked == true) {
        G5 = $('#gbpollu5').val()
    } else { G5 = "" }

    let data = [{
        lat: $('#lat').val(),
        lng: $('#lng').val(),
        accuracy: $('#accuracy').val(),
        placegarbage: $('#placegarbage').val(),
        type1: t1,
        dtype1: dt1,
        type2: t2,
        dtype2: dt2,
        type3: t3,
        dtype3: dt3,
        type4: t4,
        dtype4: dt4,
        type5: t5,
        dtype5: dt5,
        gbpollu1: G1,
        gbpollu2: G2,
        gbpollu3: G3, 
        gbpollu4: G4,
        gbpollu5: $('#gbpollu5').val(),
        status: sts,
        prov_tn: $('#pro').val(),
        amp_tn: $('#amp').val(),
        tam_tn: $('#tam').val(),
        id_date: iddata,
        proj_id: $('#proj_id').val(),
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
    await axios.post(url + "/garbage-eac/update", obj).then((r) => {
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