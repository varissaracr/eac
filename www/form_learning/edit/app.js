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
    axios.post(url + `/eac-learning/getdataone`, { proj_id: id_date }).then(async (r) => {
        // axios.get(`https://engrids.soc.cmu.ac.th/api/learning-eac/getdataone`, {proj_id: id_date }).then(async (r) => {
        var d = r.data.data;
        // console.log(d)
        let marker = L.marker([Number(d[0].lat), Number(d[0].lng)], {
            // icon: iconred
            maxZoom: 20,
            name: 'marker',
            data: d
        }).addTo(map);;
        var popup = marker.bindPopup(`<h6><b>ตำแหน่ง</b></h6><span class="kanit-16">${d[0].learnname}<span>`);
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
        d[0].learnname !== 'null' ? $('#learnname').val(d[0].learnname).change() : null;
        d[0].learningtype !== 'null' ? $('#learningtype').val(d[0].learningtype).change() : null;
        d[0].coordinate !== 'null' ? $('#coordinate').val(d[0].coordinate).change() : null;
        d[0].no_learn !== 'null' ? $('#no_learn').val(d[0].no_learn).change() : null;
        d[0].moo_learn !== 'null' ? $('#moo_learn').val(d[0].moo_learn).change() : null;
        d[0].vill_learn !== 'null' ? $('#vill_learn').val(d[0].vill_learn).change() : null;
        d[0].tel !== 'null' ? $('#tel').val(d[0].tel).change() : null;
        d[0].website !== 'null' ? $('#website').val(d[0].website).change() : null;
        d[0].facebook !== 'null' ? $('#facebook').val(d[0].facebook).change() : null;
        d[0].email !== 'null' ? $('#email').val(d[0].email).change() : null;
        d[0].details !== 'null' ? $('#details').val(d[0].details).change() : null;


        d[0].learningtype == 'บุคคลหรือปราชญ์ชาวบ้าน' ? $("#learningtype").val('บุคคลหรือปราชญ์ชาวบ้าน').change() : null
        d[0].learningtype == 'ศูนย์เรียนรู้ชุมชน/โรงเรียน' ? $("#learningtype").val('ศูนย์เรียนรู้ชุมชน/โรงเรียน').change() : null
        d[0].learningtype == 'ทรัพยากรธรรมชาติและสิ่งแวดล้อม' ? $("#learningtype").val('ทรัพยากรธรรมชาติและสิ่งแวดล้อม').change() : null
        d[0].learningtype == 'กิจกรรมทางสังคม ประเพณี และวัฒนธรรม' ? $("#learningtype").val('กิจกรรมทางสังคม ประเพณี และวัฒนธรรม').change() : null
        d[0].learningtype == 'อื่นๆ' ? $("#learningtype").val('อื่นๆ').change() : null

        d[0].datetimes == 'null' ? $('#datetimes').val(d[0].datetimes) : null

        // d[0].imgfile !== 'null' ? $('#preview').attr("src", d[0].imgfile) : null
        d[0].imgfile1 !== 'null' ? $('#preview1').attr("src", d[0].imgfile1) : null
        d[0].imgfile2 !== 'null' ? $('#preview2').attr("src", d[0].imgfile2) : null
        d[0].imgfile3 !== 'null' ? $('#preview3').attr("src", d[0].imgfile3) : null
        d[0].imgfile4 !== 'null' ? $('#preview4').attr("src", d[0].imgfile4) : null
        d[0].imgfile5 !== 'null' ? $('#preview5').attr("src", d[0].imgfile5) : null
        d[0].imgfile6 !== 'null' ? $('#preview6').attr("src", d[0].imgfile6) : null
        d[0].record !== 'null' ? $('#record').val(d[0].record) : null
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
    // console.log(latlng)
    // gps = L.marker(latlng, {
    //     draggable: true,
    //     name: 'p'
    // });
    // gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    // gps.on('dragend', (e) => {
    //     console.log(e)
    //     $('#lat').val(e.target._latlng.lat);
    //     $('#lng').val(e.target._latlng.lng);
    // })
}
// map.on("locationfound", onLocationFound);
// function onLocationError(e) {
//     alert(e.message);
// }

// map.on('locationerror', onLocationError);

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

let getpro = () => {
    // var url = "http://localhost:3000";
    axios.get(url + `/th/province`).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#pro').append(`<option value="${i.pv_code}">${i.pv_tn}</option>`)
        })
    })
}
getpro()
let prov_n = "", prov_c = "", amp_n = "", amp_c = "", tam_n = "", tam_c = "";
$('#pro').on('change', function () {
    var code = $('#pro').val()
    $("#amp").empty();
    $("#tam").empty();
    // var url = "http://localhost:3000";
    axios.post(url + `/th/amphoe`, { pv_code: code }).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#amp').append(`<option value="${i.ap_idn}">${i.ap_tn}</option>`)
        })
        amp_n = d[0].ap_tn
        amp_c = d[0].ap_idn
    })
    prov_n = $('#pro').children("option:selected").text()
    prov_c = $('#pro').children("option:selected").val()
    // console.log(prov_c)
})

$('#amp').on('change', function () {
    var code = $('#amp').val()
    $("#tam").empty();
    // var url = "http://localhost:3000";
    axios.post(url + `/th/tambon`, { ap_idn: code }).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#tam').append(`<option value="${i.tb_idn}">${i.tb_tn}</option>`)
        })
        tam_n = d[0].tb_tn
        tam_c = d[0].tb_idn
    })
    amp_n = $('#amp').children("option:selected").text()
    amp_c = $('#amp').children("option:selected").val()
    // console.log(amp_c)
})

$('#tam').on('change', function () {
    tam_n = $('#tam').children("option:selected").text()
    tam_c = $('#tam').children("option:selected").val()
    // console.log(tam_c)
})

let savedata = async () => {
    // console.log(geom[0]);
    let data = [{
        lat: $('#lat').val(),
        lng: $('#lng').val(),
        accuracy: $('#accuracy').val(),
        learnname: $('#learnname').val(),
        learningtype: $('#learningtype').val(),
        coordinate: $('#coordinate').val(),
        no_learn: $('#no_learn').val(),
        moo_learn: $('#moo_learn').val(),
        vill_learn: $('#vill_learn').val(),
        tel: $('#tel').val(),
        website: $('#website').val(),
        facebook: $('#facebook').val(),
        email: $('#email').val(),
        details: $('#details').val(),
        prov_tn: prov_n,
        amp_tn:  amp_n,
        tam_tn: tam_n,
        // prov_code: prov_c,
        // amp_code: amp_c,
        // tam_code: tam_c,
        id_date:  $('#id_date').val(),
        proj_id: $('#proj_id').val(),
        datetimes: $('#datetimes').val(),
        record: $('#record').val(),
        // imgfile: dataimgurl,
        imgfile1: dataimgurl1,
        imgfile2: dataimgurl2,
        imgfile3: dataimgurl3,
        imgfile4: dataimgurl4,
        imgfile5: dataimgurl5,
        imgfile6: dataimgurl6,
        id_user: $('#record').val(),
        geom: datageom ? datageom : { type: 'Point', coordinateslng: [$('#lng').val(),], coordinateslat: [$('#lat').val(),] },

    }]
    sendData(data)
    // console.log(data)
}

let sendData = async (data) => {
    const obj = {
        data: data
    }
    // console.log(data)
    await axios.post(url + "/learning-eac/update", obj).then((r) => {
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