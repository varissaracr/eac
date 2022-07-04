let id_fid = sessionStorage.getItem('fid');

let latlng = {
    lat: 13.196768,
    lng: 101.364720
}
let map = L.map('map', {
    center: latlng,
    zoom: 9
});

let marker, gps, dataurl;

// const url = 'http://localhost:3700';
const url = "https://engrids.soc.cmu.ac.th/api";

function loadMap() {
    // console.log('loadmap')
    var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1
    });

    const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const tam = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
        layers: "eac:tam_eac",
        format: "image/png",
        transparent: true,
        // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
    });

    const amp = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
        layers: "eac:amp_eac",
        format: "image/png",
        transparent: true,
        // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
    });

    const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
        layers: "eac:prov_eac",
        format: "image/png",
        transparent: true,
        // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
    });
    var baseMap = {
        "Mapbox": mapbox.addTo(map),
        "google Hybrid": ghyb
    }
    var overlayMap = {
        "ขอบเขตจังหวัด": pro.addTo(map),
        "ขอบเขตอำเภอ": amp,
        "ขอบเขตตำบล": tam,
    }
    L.control.layers(baseMap, overlayMap).addTo(map);
}
map.pm.addControls({
    position: 'topleft',
    drawMarker: true,
    drawCircle: false,
    drawPolyline: false,
    drawPolygon: false,
    drawRectangle: false,
    drawCircleMarker: false,
    cutPolygon: false,
    rotateMode: false,
    removalMode: true,
    editMode: false,
    dragMode: false
});

let geom = "";

let rmlayer = () => {
    map.eachLayer(i => {
        i.options.cname ? map.removeLayer(i) : null;
    })
}

map.on("pm:drawstart", e => {
    rmlayer();
});

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

map.on("locationfound", onLocationFound);
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: "ตำแหน่ง"
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

let markerlocate = () => {
    map.eachLayer(i => {
        if (i.options.pane == "markerPane") {
            map.removeLayer(i)
        }
        // console.log(i.options)
    })
    lc.start();
    $('#lat').prop('readonly', true);
    $('#lng').prop('readonly', true);
    $('#accuracy').prop('readonly', true);
}

let stoplocate = () => {
    lc.stop();
    gps = L.marker(latlnggps, {
        draggable: true,
        name: 'Marker'
    });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();

    var latlon = ({
        "lat": $("#lat").val(),
        "lng": $("#lng").val(),
    })
}

map.on("pm:create", e => {
    lc.stop();
    map.eachLayer(i => {
        i.options.cname == "created" || i.options.name == "lyr" ?
            map.removeLayer(i) : null;
    })

    e.layer.options.cname = "created"
    geom = e.layer.toGeoJSON();
    var latlng = geom.geometry.coordinates;
    if (geom.geometry.type == "Point") {
        // var latlng = data.geometry.coordinates;
        var lat = $('#lat').val();
        var lng = $('#lng').val();
        // if (lat == "" && lng == "") {
        $('#lat').val(latlng[1]);
        $('#lng').val(latlng[0]);
        $('#accuracy').val(0);
        // }
    }

    var datlatlon02 = ({
        "lat": latlng[1],
        "lng": latlng[0],
    })
    // console.log(datlatlon02)
    // nearData(datlatlon02)
});
let imgdata1, imgdata2, imgdata3, imgdata4;
let loadData = (id) => {
    // console.log(id)
    axios.post(url + `/fishing-eac/getdata`, { fid: id }).then(async (r) => {
        var d = r.data.data;
        // console.log(d)
        d.map(i => {
            let marker = L.marker([Number(i.lat), Number(i.lng)], {
                name: 'lyr',
            }).addTo(map);

            $('#lat').val(i.lat)
            $('#lng').val(i.lng)
            $("#accuracy").val(i.accuracy);
            $('#locat_name').val(i.fname)
            $('#locationfarm').val(i.flocation)
            $('#work_year').val(i.ftime)
            $('#workingspace').val(i.farea_ws)
            $('#area').val(i.farea)
            $("#tam").val(i.tambon)
            $('#amp').val(i.amphoe)
            $('#pro').val(i.province)
            $('#wfishing').val(i.fwater)
            $('#cfishing').val(i.fcategory)
            $('#specie').val(i.ftypes);

            if (i.fstandardtype == "GAP&CoC") {
                $('#standard1').prop("checked", true);
                $("#list_standard1").removeClass("disabledbox");
                $("#cer_standard1 option").filter(function () {
                    return $(this).text() == i.fstandard;
                }).prop("selected", true);

                $("#list_flagstatus").removeClass("disabledbox");
                $("#flagstatus option").filter(function () {
                    return $(this).text() == i.flagstatus;
                }).prop("selected", true);

                Fstandardtype = "GAP&CoC"
                Fstandard = i.fstandard

            } else if (i.fstandardtype == "GMP/HACCP") {
                $('#standard2').prop("checked", true);
                $("#list_standard2").removeClass("disabledbox");
                $("#cer_standard2 option").filter(function () {
                    return $(this).text() == i.fstandard;
                }).prop("selected", true);

                $("#list_flagstatus").removeClass("disabledbox");
                $("#flagstatus option").filter(function () {
                    return $(this).text() == i.flagstatus;
                }).prop("selected", true);

                Fstandardtype = "GMP/HACCP"
                Fstandard = i.fstandard

            } else if (i.fstandard == "NO standard") {
                $('#Nostandard').prop("checked", true);

                Fstandardtype = "NO standard"
                Fstandard = "NO standard"

            }

            i.img1 !== "" || i.img1 !== null ? document.getElementById('preview').src = i.img1 : null
            i.img2 !== "" || i.img2 !== null ? document.getElementById('preview2').src = i.img2 : null
            i.img3 !== "" || i.img3 !== null ? document.getElementById('preview3').src = i.img3 : null
            i.img4 !== "" || i.img4 !== null ? document.getElementById('preview4').src = i.img4 : null
            imgdata1 = i.img1;
            imgdata2 = i.img2;
            imgdata3 = i.img3;
            imgdata4 = i.img4;
        })
    })
}
$(document).ready(() => {
    loadMap();
    loadData(id_fid)
    $("#fname").val('admin')
});

let Fstandardtype, Fstandard;
$('input[id="standard1"]').on('click change', function (e) {
    // console.log(e.type);
    if ($(this).prop("checked") == true) {
        $("#list_standard1").removeClass("disabledbox");
        $("#list_standard2").addClass("disabledbox");
        $("#list_flagstatus").removeClass("disabledbox");
        Fstandardtype = "GAP&CoC"
    }
    else if ($(this).prop("checked") == false) {
        $("#list_standard1").addClass("disabledbox");
    }
});

$('input[id="standard2"]').on('click change', function (e) {
    // console.log(e.type);
    if ($(this).prop("checked") == true) {
        $("#list_standard2").removeClass("disabledbox");
        $("#list_standard1").addClass("disabledbox");
        $("#list_flagstatus").removeClass("disabledbox");
        Fstandardtype = "GMP/HACCP"
    }
    else if ($(this).prop("checked") == false) {
        $("#list_standard2").addClass("disabledbox");
    }
});
$('input[id="Nostandard"]').on('click change', function (e) {
    // console.log(e.type);
    if ($(this).prop("checked") == true) {
        $("#list_flagstatus").addClass("disabledbox");
        $("#list_standard1").addClass("disabledbox");
        $("#list_standard2").addClass("disabledbox");
        Fstandardtype = "NO standard"
        Fstandard = "NO standard"

    }
    else if ($(this).prop("checked") == false) {
        $("#list_flagstatus").removeClass("disabledbox");
    }
});
$('#cer_standard1').on('change', function () {
    Fstandard = $("#cer_standard1 option:selected").text();
})
$('#cer_standard2').on('change', function () {
    Fstandard = $("#cer_standard2 option:selected").text();
})

let imgurl = "";
let imgurl2 = "";
let imgurl3 = "";
let imgurl4 = "";
$("#imgfile").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img1');
        document.getElementById('preview').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});
$("#imgfile2").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile2').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img2');
        document.getElementById('preview2').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});
$("#imgfile3").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile3').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img3');
        document.getElementById('preview3').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});
$("#imgfile4").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile4').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img4');
        document.getElementById('preview4').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});

let resizeImage = (file, name) => {
    var maxW = 600;
    var maxH = 600;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.createElement('img');
    var result = '';
    img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        context.drawImage(img, 0, 0, iwScaled, ihScaled);
        result += canvas.toDataURL('image/jpeg', 0.5);
        if (name == 'img1') {
            imgurl = result;
        } else if (name == 'img2') {
            imgurl2 = result;
        } else if (name == 'img3') {
            imgurl3 = result;
        } else if (name == 'img4') {
            imgurl4 = result;
        }
        // document.getElementById('rez').src = that.imageResize;
    }
    img.src = URL.createObjectURL(file);
}

let chkData = () => {
    $("#confirmModal").modal('show');
}

let postData = async () => {
    let newfid = Date.now()
    let lat = $("#lat").val();
    let lng = $("#lng").val();
    let accuracy = $("#accuracy").val();
    let fname = $("#locat_name").val();
    let flocation = $('#locationfarm').val();
    let prov = $("#pro").val() !== null ? $("#pro").val() : "false";
    let amphoe = $("#amp").val() !== null ? $("#amp").val() : "false";
    let tambon = $("#tam").val() !== null ? $("#tam").val() : "false";

    let fwater = $("#wfishing option:selected").text() !== "-- แสดงทั้งหมด --" ? $("#wfishing option:selected").text() : "false";
    let fcategory = $("#cfishing option:selected").text() !== "-- แสดงทั้งหมด --" ? $("#cfishing option:selected").text() : "false";
    let ftime = $("#work_year").val();
    let farea_ws = $("#workingspace").val();
    let farea = $("#workingspace").val();
    let flagstatus = $("#flagstatus option:selected").text() !== "-- แสดงทั้งหมด --" ? $("#flagstatus option:selected").text() : "false";
    let ftypes = $("#specie").val();
    let fuser = 'admin'

    const date2 = new Date(newfid);
    let dt = `วันที่ ${date2.getDate()}/${date2.getDay()}/${date2.getFullYear()} เวลา ${date2.getHours()}.${date2.getMinutes()} น.`
    let datObj;
    if (!geom) {
        console.log('No data geom')
        datObj = {
            fid: id_fid,
            data: {
                // usrid: urid,
                usrid: '0123456789',
                usrname: fuser,
                id_date: id_fid,
                dt: newfid,
                date_dt: dt,
                fname: fname,
                lat: lat,
                lng: lng,
                accuracy: accuracy,
                flocation: flocation,
                province: prov,
                amphoe: amphoe,
                tambon: tambon,
                fwater: fwater,
                fcategory: fcategory,
                ftime: ftime,
                farea_ws: farea_ws,
                farea: farea,
                flagstatus: flagstatus,
                ftypes: ftypes,
                fstandard: Fstandard,
                fstandardtype: Fstandardtype,
                img1: imgurl !== '' ? imgurl : imgdata1,
                img2: imgurl2 !== '' ? imgurl2 : imgdata2,
                img3: imgurl3 !== '' ? imgurl3 : imgdata3,
                img4: imgurl4 !== '' ? imgurl4 : imgdata4,
            }
        }
    } else {
        datObj = {
            fid: id_fid,
            data: {
                // usrid: urid,
                usrid: '0123456789',
                usrname: fuser,
                id_date: id_fid,
                dt: newfid,
                date_dt: dt,
                fname: fname,
                lat: lat,
                lng: lng,
                accuracy: accuracy,
                flocation: flocation,
                province: prov,
                amphoe: amphoe,
                tambon: tambon,
                fwater: fwater,
                fcategory: fcategory,
                ftime: ftime,
                farea_ws: farea_ws,
                farea: farea,
                flagstatus: flagstatus,
                ftypes: ftypes,
                fstandard: Fstandard,
                fstandardtype: Fstandardtype,
                geom: geom,
                img1: imgurl !== '' ? imgurl : imgdata1,
                img2: imgurl2 !== '' ? imgurl2 : imgdata2,
                img3: imgurl3 !== '' ? imgurl3 : imgdata3,
                img4: imgurl4 !== '' ? imgurl4 : imgdata4,
            }
        }
    }
    // console.log($("#app_specie option:selected").text())
    // console.log(datObj)
    await axios.post(url + "/fishing-eac/update", datObj).then((r) => {
        r.data.data == "success" ? gotoDashboard() : null && console.log("False")
    })
}

let gotoDashboard = () => {
    sessionStorage.clear();
    location.href = "./../dashboard/index.html";
}

let gotoDashboard2 = () => {
    localStorage.clear();
    location.href = "./../dashboard/index.html";
}
let gotoAddData = () => {
    localStorage.clear();
    location.href = "./../add/index.html";
}
