$(document).ready(() => {
    loadMap();
    // getData();
});

let latlng = {
    lat: 16.820378,
    lng: 100.265787
}
let map = L.map('map', {
    center: latlng,
    zoom: 13
});
let marker, gps, dataurl;
const url = 'http://localhost:3700';
// const url = 'https://rti2dss.com:3200';

function loadMap() {
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

    var pro = L.tileLayer.wms("http://rti2dss.com:8080/geoserver/th/wms?", {
        layers: 'th:province_4326',
        format: 'image/png',
        transparent: true
    });
    var baseMap = {
        "Mapbox": mapbox.addTo(map),
        "google Hybrid": ghyb
    }
    var overlayMap = {
        "ขอบเขตจังหวัด....": pro
    }
    L.control.layers(baseMap, overlayMap).addTo(map);
}

let onLocationFound = async (e) => {
    latlng = e.latlng;
    console.log(e.latlng)
    $('#lat').val(e.latlng.lat);
    $('#lng').val(e.latlng.lng);
    changeLatlng(e.latlng);
}

function changeLatlng(latlng) {
    console.log(latlng)

    // if (gps) {
    //     map.removeLayer(gps);
    // }

    // latlng = {
    //     lat: $('#lat').val(),
    //     lng: $('#lng').val()
    // }

    gps = L.marker(latlng, {
        draggable: true,
        name: 'p'
    });
    gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    gps.on('dragend', (e) => {
        console.log(e)
        $('#lat').val(e.target._latlng.lat);
        $('#lng').val(e.target._latlng.lng);
    })
}

function onLocationError(e) {
    console.log(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.locate({ setView: true, maxZoom: 16 });

async function getData() {
    // console.log(marker)
    if (marker) {
        map.removeLayer(marker);
    }

    await $.get(url + '/anticov-api/pin-getdata', (res) => {
        marker = L.geoJSON(res, {
            pointToLayer: (feature, latlng) => {
                let icon;
                if (feature.properties.stype == 'ตำแหน่งเสี่ยง') {
                    icon = risk
                } else if (feature.properties.stype == 'แบ่งปันหน้ากากและแอลกอฮอล์') {
                    icon = mask
                } else if (feature.properties.stype == 'แบ่งปันอาหารและเครื่องดื่ม') {
                    icon = food
                } else if (feature.properties.stype == 'สถานที่ปิดทำการ') {
                    icon = close
                } else if (feature.properties.stype == 'จุดตรวจ') {
                    icon = stop
                } else {
                    icon = other
                }

                const iconMarker = L.icon({
                    iconUrl: icon,
                    iconSize: [40, 40],
                });
                return L.marker(latlng, {
                    icon: iconMarker,
                    draggable: false
                });
            },
            onEachFeature: (feature, layer) => {
                if (feature.properties) {
                    // console.log(feature.properties.img)
                    let img = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIC02NCA1MTIgNTEyIiB3aWR0aD0iNTEycHgiPjxwYXRoIGQ9Im01MTIgNTguNjY3OTY5djI2Ni42NjQwNjJjMCAzMi40Mjk2ODgtMjYuMjM4MjgxIDU4LjY2Nzk2OS01OC42Njc5NjkgNTguNjY3OTY5aC0zOTQuNjY0MDYyYy01LjMzNTkzOCAwLTEwLjQ1MzEyNS0uNjQwNjI1LTE1LjE0ODQzOC0yLjEzMjgxMi0yNS4xNzE4NzUtNi42MTMyODItNDMuNTE5NTMxLTI5LjQ0MTQwNy00My41MTk1MzEtNTYuNTM1MTU3di0yNjYuNjY0MDYyYzAtMzIuNDI5Njg4IDI2LjIzODI4MS01OC42Njc5NjkgNTguNjY3OTY5LTU4LjY2Nzk2OWgzOTQuNjY0MDYyYzMyLjQyOTY4OCAwIDU4LjY2Nzk2OSAyNi4yMzgyODEgNTguNjY3OTY5IDU4LjY2Nzk2OXptMCAwIiBmaWxsPSIjZWNlZmYxIi8+PHBhdGggZD0ibTE0OS4zMzIwMzEgMTA2LjY2Nzk2OWMwIDIzLjU2MjUtMTkuMTAxNTYyIDQyLjY2NDA2Mi00Mi42NjQwNjIgNDIuNjY0MDYyLTIzLjU2NjQwNyAwLTQyLjY2Nzk2OS0xOS4xMDE1NjItNDIuNjY3OTY5LTQyLjY2NDA2MiAwLTIzLjU2NjQwNyAxOS4xMDE1NjItNDIuNjY3OTY5IDQyLjY2Nzk2OS00Mi42Njc5NjkgMjMuNTYyNSAwIDQyLjY2NDA2MiAxOS4xMDE1NjIgNDIuNjY0MDYyIDQyLjY2Nzk2OXptMCAwIiBmaWxsPSIjZmZjMTA3Ii8+PHBhdGggZD0ibTUxMiAyNzYuMDU0Njg4djQ5LjI3NzM0M2MwIDMyLjQyOTY4OC0yNi4yMzgyODEgNTguNjY3OTY5LTU4LjY2Nzk2OSA1OC42Njc5NjloLTM5NC42NjQwNjJjLTUuMzM1OTM4IDAtMTAuNDUzMTI1LS42NDA2MjUtMTUuMTQ4NDM4LTIuMTMyODEybDI2MC42OTUzMTMtMjYwLjY5NTMxM2MxNC41MDM5MDYtMTQuNTAzOTA2IDM4LjM5ODQzNy0xNC41MDM5MDYgNTIuOTA2MjUgMHptMCAwIiBmaWxsPSIjMzg4ZTNjIi8+PHBhdGggZD0ibTM2My45NDUzMTIgMzg0aC0zMDUuMjc3MzQzYy01LjMzNTkzOCAwLTEwLjQ1MzEyNS0uNjQwNjI1LTE1LjE0ODQzOC0yLjEzMjgxMi0yNS4xNzE4NzUtNi42MTMyODItNDMuNTE5NTMxLTI5LjQ0MTQwNy00My41MTk1MzEtNTYuNTM1MTU3di02LjYxMzI4MWwxMjIuODc4OTA2LTEyMi44Nzg5MDZjMTQuNTA3ODEzLTE0LjUwNzgxMyAzOC40MDIzNDQtMTQuNTA3ODEzIDUyLjkwNjI1IDB6bTAgMCIgZmlsbD0iIzRjYWY1MCIvPjwvc3ZnPgo=';
                    feature.properties.img == '-' || feature.properties.img == null ? img : img = feature.properties.img
                    layer.bindPopup(
                        '<span style="font-family: Kanit; font-size: 16px;"> ' + feature.properties.sname + '</span></br>' +
                        'ประเภท: ' + feature.properties.stype + '</br>' +
                        'คำอธิบาย: ' + feature.properties.sdesc + '</br>'
                        +
                        '<img src="' + img + '" width="250px">'
                    );
                }
            }
        }).on('click', selectMarker);
        marker.addTo(map);
    })
}

$("#edit").attr("disabled", true);
$("#remove").attr("disabled", true);

var pos;
var pkid;
function selectMarker(e) {
    // console.log(e);
    $("#save").attr("disabled", true);

    $.get(url + '/anticov-api/pin-getimg/' + e.layer.feature.properties.id).done((res) => {
        console.log(res)
    })

    $('#sname').val(e.layer.feature.properties.sname);
    $('#stype').val(e.layer.feature.properties.stype);
    $('#sdesc').val(e.layer.feature.properties.sdesc);
    $("#edit").attr("disabled", false);
    $("#remove").attr("disabled", false);
    pos = {
        geom: '{"type":"Point","coordinates":[' + e.latlng.lng + ',' + e.latlng.lat + ']}',
        id: e.layer.feature.properties.id
    }
    pkid = e.layer.feature.properties.pkid;
    $("#status").empty().text("กำลังแก้ใขข้อมูล..");
}

map.on('click', () => {
    console.log('wddwwd')
    $('form :input').val('');
    $("#edit").attr("disabled", true);
    $("#remove").attr("disabled", true);
    $("#status").empty().text("");
    $("#save").attr("disabled", false);
});

function insertData() {
    $("#status").empty().text("File is uploading...");
    dataurl ? dataurl : dataurl = '-'
    const obj = {
        sname: $('#sname').val(),
        stype: $('#stype').val(),
        sdesc: $('#sdesc').val(),
        img: dataurl,
        geom: JSON.stringify(gps.toGeoJSON().geometry)
    }
    $.post(url + '/anticov-api/pin-insert', obj).done((res) => {
        getData();
        dataurl = null;
        $('form :input').val('');
        $('#preview').attr('src', '');
        $("#status").empty().text("");
    })
    return false;
}

function editData() {
    dataurl ? dataurl : dataurl = '-'
    const obj = {
        sname: $('#sname').val(),
        stype: $('#stype').val(),
        sdesc: $('#sdesc').val(),
        img: dataurl,
        geom: pos.geom,
        id: pos.id
    }
    $.post(url + '/anticov-api/pin-update', obj, (res) => {
        getData();
        $('form :input').val('');
        $('#preview').attr('src', '');
        $("#status").empty().text("");
    })
    return false;
}

function deleteData() {
    const obj = {
        id: pos.id
    }
    $.post(url + '/anticov-api/pin-delete', obj, (res) => {
        getData();
        $('form :input').val('');
        $('#preview').attr('src', '');
        $("#status").empty().text("");
    })
}

function refreshPage() {
    location.reload(true);
}


map.pm.addControls({
    position: 'topleft',
    drawMarker: false,
    drawCircle: false,
    drawPolyline: false,
    drawRectangle: true,
    drawCircleMarker: false,
    cutPolygon: false
});

let geom = [];
// map.on('pm:create', e => {

// });
$(document).off('focusin.modal');
var test = 1;

map.on('pm:create', e => {
    e.shape = test
    console.log(e)
    test++
    geom.push(e.layer.toGeoJSON());
    console.log(test);
    // e.layer.on("click", i => {
    //     if (e.shape == 1) {
    //         console.log(i);
    //         $('#modal').modal("show");
    //     } else if (e.shape == 2) {
    //         console.log(i);
    //         $('#modal2').modal("show");
    //     } else {
    //         $('#modal3').modal("show");
    //     }

    // })

    if (e.shape == 1) {

        $('#modal').modal("show");
    } else if (e.shape == 2) {

        $('#modal2').modal("show");
    } else {
        $('#modal3').modal("show");
    }
});

///รูปภาพ/////
$("#imgfile").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.addEventListener("loadend", function () {
        let imageOriginal = reader.result;
        resizeImage(file);
        document.getElementById('preview').src = imageOriginal;
    });

    // reader.onloadend = (e) => {

    // }
    reader.readAsDataURL(file);
});

$("#imgfile2").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile2').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.addEventListener("loadend", function () {
        let imageOriginal = reader.result;
        resizeImage(file);
        document.getElementById('preview2').src = imageOriginal;
    });

    // reader.onloadend = (e) => {

    // }
    reader.readAsDataURL(file);
});

$("#imgfile3").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile3').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.addEventListener("loadend", function () {
        let imageOriginal = reader.result;
        resizeImage(file);
        document.getElementById('preview3').src = imageOriginal;
    });

    // reader.onloadend = (e) => {

    // }
    reader.readAsDataURL(file);
});
let resizeImage = (file) => {
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
        dataurl = result;
        // document.getElementById('rez').src = that.imageResize;
    }
    img.src = URL.createObjectURL(file);
}

let sendData = () => {



    //ข้อมูลแปลง//
    let cluse = test - 1
    if (cluse == 1) {

        let data = {
            number: test - 1,
            name: $('#name1').val(),
            size: $('#size1').val(),
            doc: $('#doc1').val(),
            geom: geom == "" ? "" : geom[0],
            img: dataurl ? dataurl : dataurl = "",
        }
        console.log(data);
        $.post('https://engrids.soc.cmu.ac.th/api/api/family', data).done(r => {
            console.log(r)


        })





    } else if (cluse == 2) {
        let data = {
            number: test - 1,
            name: $('#name2').val(),
            size: $('#size2').val(),
            doc: $('#doc2').val(),
            geom: geom == "" ? "" : geom[0],
            img: dataurl ? dataurl : dataurl = ""
        }
        console.log(data);
        $.post('https://engrids.soc.cmu.ac.th/api/api/family', data).done(r => {
            console.log(r)


        })

    } else {
        let data = {
            number: test - 1,
            name: $('#name3').val(),
            size: $('#size3').val(),
            doc: $('#doc3').val(),
            geom: geom == "" ? "" : geom[0],
            img: dataurl ? dataurl : dataurl = "",
        }
        console.log(data);
        $.post('https://engrids.soc.cmu.ac.th/api/api/family', data).done(r => {
            console.log(r)


        })
    }
    //ข้อมูลพืชที่ปลูก1//
    //ข้อมูลพืชกินได้//
    eatP = [];
    if ($('#a11').is(":checked")) {
        a11 = 'ผักหวาน'
        eatP.push(a11)
    }
    if ($('#a12').is(":checked")) {
        a12 = 'กล้วย'
        eatP.push(a12)
    }
    if ($('#a13').is(":checked")) {
        a13 = 'ฟักข้าว'
        eatP.push(a13)
    }
    if ($('#a14').val() == "") { } else {
        a14 = $('#a14').val()
        eatP.push(a14)
    }
    console.log(eatP)
    //


    //ข้อมูลพืชใช้สอย//
    useP = [];
    if ($('#b11').is(":checked")) {
        b11 = 'ไผ่'
        useP.push(b11)
    }
    if ($('#b12').is(":checked")) {
        b12 = 'หวาย'
        useP.push(b12)
    }
    if ($('#b13').is(":checked")) {
        b13 = 'มะคำดีควาย'
        useP.push(b13)
    }
    if ($('#b14').val() == "") { } else {
        b14 = $('#b14').val()
        useP.push(b14)
    }
    console.log(useP)
    //

    //ข้อมูลพืชเศรษกิจ//
    econP = [];
    if ($('#c11').is(":checked")) {
        c11 = 'ตะเคียนทอง'
        econP.push(c11)
    }
    if ($('#c12').is(":checked")) {
        c12 = 'สัก'
        econP.push(c12)
    }
    if ($('#c13').is(":checked")) {
        c13 = 'พะยูง'
        econP.push(c13)
    }
    if ($('#c14').val() == "") { } else {
        c14 = $('#c14').val()
        econP.push(c14)
    }
    console.log(econP)
    //

    //ข้อมูลพืชสมุนไพร//
    herbP = [];
    if ($('#d11').is(":checked")) {
        d11 = 'ฟ้าทะลายโจร'
        herbP.push(d11)
    }
    if ($('#d12').is(":checked")) {
        d12 = 'ว่านหางจระเข้'
        herbP.push(d12)
    }
    if ($('#d13').is(":checked")) {
        d13 = 'บัวบก'
        herbP.push(d13)
    }
    if ($('#d14').val() == "") { } else {
        d14 = $('#d14').val()
        herbP.push(d14)
    }
    console.log(herbP)
    //


    //ข้อมูลพืชที่ปลูก2//
    //ข้อมูลพืชกินได้//
    eatP2 = [];
    if ($('#a21').is(":checked")) {
        a21 = 'ผักหวาน'
        eatP2.push(a21)
    }
    if ($('#a22').is(":checked")) {
        a22 = 'กล้วย'
        eatP2.push(a22)
    }
    if ($('#a23').is(":checked")) {
        a23 = 'ฟักข้าว'
        eatP2.push(a23)
    }
    if ($('#a24').val() == "") { } else {
        a24 = $('#a24').val()
        eatP2.push(a24)
    }
    console.log(eatP2)
    //


    //ข้อมูลพืชใช้สอย//
    useP2 = [];
    if ($('#b21').is(":checked")) {
        b21 = 'ไผ่'
        useP2.push(b21)
    }
    if ($('#b22').is(":checked")) {
        b22 = 'หวาย'
        useP2.push(b22)
    }
    if ($('#b23').is(":checked")) {
        b23 = 'มะคำดีควาย'
        useP2.push(b23)
    }
    if ($('#b24').val() == "") { } else {
        b24 = $('#b24').val()
        useP2.push(b24)
    }
    console.log(useP2)
    //

    //ข้อมูลพืชเศรษกิจ//
    econP2 = [];
    if ($('#c21').is(":checked")) {
        c21 = 'ตะเคียนทอง'
        econP2.push(c21)
    }
    if ($('#c22').is(":checked")) {
        c22 = 'สัก'
        econP2.push(c22)
    }
    if ($('#c23').is(":checked")) {
        c23 = 'พะยูง'
        econP2.push(c23)
    }
    if ($('#c24').val() == "") { } else {
        c24 = $('#c24').val()
        econP2.push(c24)
    }
    console.log(econP2)
    //

    //ข้อมูลพืชสมุนไพร//
    herbP2 = [];
    if ($('#d21').is(":checked")) {
        d21 = 'ฟ้าทะลายโจร'
        herbP2.push(d21)
    }
    if ($('#d22').is(":checked")) {
        d22 = 'ว่านหางจระเข้'
        herbP2.push(d22)
    }
    if ($('#d23').is(":checked")) {
        d23 = 'บัวบก'
        herbP2.push(d23)
    }
    if ($('#d24').val() == "") { } else {
        d24 = $('#d24').val()
        herbP2.push(d24)
    }
    console.log(herbP2)
    //


    //ข้อมูลพืชที่ปลูก3//
    //ข้อมูลพืชกินได้//
    eatP3 = [];
    if ($('#a31').is(":checked")) {
        a31 = 'ผักหวาน'
        eatP3.push(a31)
    }
    if ($('#a32').is(":checked")) {
        a32 = 'กล้วย'
        eatP3.push(a32)
    }
    if ($('#a33').is(":checked")) {
        a33 = 'ฟักข้าว'
        eatP3.push(a33)
    }
    if ($('#a34').val() == "") { } else {
        a34 = $('#a34').val()
        eatP3.push(a34)
    }
    console.log(eatP3)
    //


    //ข้อมูลพืชใช้สอย//
    useP3 = [];
    if ($('#b31').is(":checked")) {
        b31 = 'ไผ่'
        useP3.push(b31)
    }
    if ($('#b32').is(":checked")) {
        b32 = 'หวาย'
        useP3.push(b32)
    }
    if ($('#b33').is(":checked")) {
        b33 = 'มะคำดีควาย'
        useP3.push(b33)
    }
    if ($('#b34').val() == "") { } else {
        b34 = $('#b34').val()
        useP3.push(b34)
    }
    console.log(useP3)
    //

    //ข้อมูลพืชเศรษกิจ//
    econP3 = [];
    if ($('#c31').is(":checked")) {
        c31 = 'ตะเคียนทอง'
        econP3.push(c31)
    }
    if ($('#c32').is(":checked")) {
        c32 = 'สัก'
        econP3.push(c32)
    }
    if ($('#c33').is(":checked")) {
        c33 = 'พะยูง'
        econP3.push(c33)
    }
    if ($('#c34').val() == "") { } else {
        c34 = $('#c34').val()
        econP3.push(c34)
    }
    console.log(econP3)
    //

    //ข้อมูลพืชสมุนไพร//
    herbP3 = [];
    if ($('#d31').is(":checked")) {
        d31 = 'ฟ้าทะลายโจร'
        herbP3.push(d31)
    }
    if ($('#d32').is(":checked")) {
        d32 = 'ว่านหางจระเข้'
        herbP3.push(d32)
    }
    if ($('#d33').is(":checked")) {
        d33 = 'บัวบก'
        herbP3.push(d33)
    }
    if ($('#d34').val() == "") { } else {
        d34 = $('#d34').val()
        herbP3.push(d34)
    }
    console.log(herbP3)
    //

    // emp = useP.length()
    // console.log(emp);
    // if (usePe.length() > 0) { } {
    //     useP.forEach((i) => {
    //         console.log(i);
    //     })
    // }

    //api useplant ///
    console.log(useP);
    setTimeout(function wait() {
        if (typeof useP != "undefined"
            && useP != null
            && useP.length != null
            && useP.length > 0) {
            console.log('มี');
            useP.forEach(i => {
                let data = {
                    name: $('#name1').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/useplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }
        if (typeof useP2 != "undefined"
            && useP2 != null
            && useP2.length != null
            && useP2.length > 0) {
            console.log('มี');
            useP2.forEach(i => {
                let data = {
                    name: $('#name2').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/useplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }
        if (typeof useP3 != "undefined"
            && useP3 != null
            && useP3.length != null
            && useP3.length > 0) {
            console.log('มี');
            useP3.forEach(i => {
                let data = {
                    name: $('#name3').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/useplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }

        //////////api eat plant/////////
        if (typeof eatP != "undefined"
            && eatP != null
            && eatP.length != null
            && eatP.length > 0) {
            console.log('มี');
            eatP.forEach(i => {
                let data = {
                    name: $('#name1').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/eatplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }
        if (typeof eatP2 != "undefined"
            && eatP2 != null
            && eatP2.length != null
            && eatP2.length > 0) {
            console.log('มี');
            eatP2.forEach(i => {
                let data = {
                    name: $('#name2').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/eatplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }
        if (typeof eatP3 != "undefined"
            && eatP3 != null
            && eatP3.length != null
            && eatP3.length > 0) {
            console.log('มี');
            eatP3.forEach(i => {
                let data = {
                    name: $('#name3').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/eatplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }




        /////api econplant/////
        if (typeof econP != "undefined"
            && econP != null
            && econP.length != null
            && econP.length > 0) {
            console.log('มี');
            econP.forEach(i => {
                let data = {
                    name: $('#name1').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/econplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }
        if (typeof econP2 != "undefined"
            && econP2 != null
            && econP2.length != null
            && econP2.length > 0) {
            console.log('มี');
            econP2.forEach(i => {
                let data = {
                    name: $('#name2').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/econplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }

        if (typeof econP3 != "undefined"
            && econP3 != null
            && econP3.length != null
            && econP3.length > 0) {
            console.log('มี');
            econP3.forEach(i => {
                let data = {
                    name: $('#name3').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/econplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }
        ///////////////////////////////////////////////////////222

        ////api herb///////////
        if (typeof herbP != "undefined"
            && herbP != null
            && herbP.length != null
            && herbP.length > 0) {
            console.log('มี');
            herbP.forEach(i => {
                let data = {
                    name: $('#name1').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/herbplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }

        if (typeof herbP2 != "undefined"
            && herbP2 != null
            && herbP2.length != null
            && herbP2.length > 0) {
            console.log('มี');
            herbP2.forEach(i => {
                let data = {
                    name: $('#name2').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/herbplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }

        if (typeof herbP3 != "undefined"
            && herbP3 != null
            && herbP3.length != null
            && herbP3.length > 0) {
            console.log('มี');
            herbP3.forEach(i => {
                let data = {
                    name: $('#name3').val(),
                    plant: i

                }

                $.post('https://engrids.soc.cmu.ac.th/api/api/herbplant', data).done(r => {
                    console.log(r)


                })
            })
        }
        else {
            console.log('ไม่มี');
            output = false;

        }

        alert("กรอกข้อมูลเรียบร้อย");

        return false;
    }, 5000);

}



$('#type').on('change', function () {



    console.log(this.value);
    var econ = 'พืชเศรษฐกิจ'
    var eat = 'พืชกินได้'
    var herb = 'พืชสมุนไพร'
    var use = 'พืชใช้สอย'
    if (this.value == econ) {

        $('#typetoo').empty()
        console.log('kkkkkkkkkkk');
        let a = $('#name1').val()
        let url = 'https://engrids.soc.cmu.ac.th/api/api/getEcon/'
        $.post(url + a).done(r => {
            console.log(r);

            r.data.map(i => {
                $('#typetoo').append(`<option value="${i.plant_name}">${i.plant_name}</option>`)
            })



        })
    } else if (this.value == eat) {

        $('#typetoo').empty()
        let a = $('#name1').val()
        let url = 'https://engrids.soc.cmu.ac.th/api/api/getEat/'
        $.post(url + a).done(r => {
            console.log(r);
            r.data.map(i => {
                $('#typetoo').append(`<option value="${i.plant_name}">${i.plant_name}</option>`)
            })

        })
    } else if (this.value == herb) {

        $('#typetoo').empty()
        let a = $('#name1').val()
        let url = 'https://engrids.soc.cmu.ac.th/api/api/getHerb/'
        $.post(url + a).done(r => {
            console.log(r);
            r.data.map(i => {
                $('#typetoo').append(`<option value="${i.plant_name}">${i.plant_name}</option>`)
            })

        })
    } else {

        $('#typetoo').empty()
        let a = $('#name1').val()
        let url = 'https://engrids.soc.cmu.ac.th/api/api/getUse/'
        $.post(url + a).done(r => {
            console.log(r);
            r.data.map(i => {
                $('#typetoo').append(`<option value="${i.plant_name}">${i.plant_name}</option>`)
            })

        })
    }



})

$('#type').on('change', function () {
    let nameq = $('#name1').val()
    queryTable(nameq)
})




function getDaily() {

    var name = $('#name1').val()
    var benefit = $('#benefit').val()
    var type = $('#type').val()
    var plant = $('#typetoo').val()
    var amount = $('#weight').val()
    var unit = $('#unit').val()
    var price = $('#price').val()
    var date = $('#date').val()


    let data = {
        name: name,
        benefit: benefit,
        type: type,
        plant: plant,
        amount: amount,
        unit: unit,
        price: price,
        date: date
    }
    $.post('https://engrids.soc.cmu.ac.th/api/api/daily', data).done(r => {
        console.log(r)


    })
    console.log(data);

    queryTable(name);

}

function queryTable(n) {
    console.log('หาเจอนะ');
    $("#myTable").find('tbody').empty()
    let url = 'https://engrids.soc.cmu.ac.th/api/api/getDaily/'
    $.post(url + n).done(r => {
        console.log(r);
        r.data.map(i => {
            console.log(i);

            $("#myTable").find('tbody').append(
                `<tr>
            <td>${i.name}</td>
            <td>${i.benefit}</td>
            <td>${i.type}</td>
            <td>${i.plant_name}</td>
            <td>${i.amount}</td>
            <td>${i.unit}</td>
            <td>${i.price}</td>
            <td>${i.date}</td>
            </tr>`)
        })



    })
}







