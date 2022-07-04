const url = "https://engrids.soc.cmu.ac.th/api";
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

const airqualityeec = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eec/wms?", {
    layers: 'eec:a__65_airquality_eec',
    format: 'image/png',
    transparent: true
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
    console.log(e.layer.toGeoJSON())
    datageom = e.layer.toGeoJSON();
});
map.on('pm:remove', e => {
    console.log(e)
    $('#lat').val("");
    $('#lng').val("");
    $('#accuracy').val("");
})

$('#imgfile').change(function (evt) {
    console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize();
});
let latlnggps
let onLocationFound = (e) => {
    console.log(e)
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
    console.log(latlng)
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
// lc.start();
let markerlocate = () => {
    lc.start();
    $('#lat').prop('readonly', true);
    $('#lng').prop('readonly', true);
    $('#accuracy').prop('readonly', true);
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
let dataimgurl = "";
let resize = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById('imgfile').files;
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
                dataimgurl = canvas.toDataURL(file.type);
                // console.log(dataurl)
                // document.getElementById('output').src = dataurl;
            }
            reader.readAsDataURL(file);
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

}

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
    console.log(prov_c)
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
    console.log(amp_c)
})

$('#tam').on('change', function () {
    tam_n = $('#tam').children("option:selected").text()
    tam_c = $('#tam').children("option:selected").val()
    console.log(tam_c)
})

$('#other1').hide()
$('#other2').hide()
$('#other3').hide()
$('#other4').hide()
$('#other5A').hide()
$('#other5B').hide()
$('#other6').hide()

let landowner
$('#landownership').on('change', function () {
    var value = $('#landownership').val();
    if (value == 'other') {
        $('#other1').fadeIn();
        landowner = $('#landowherother').val();
    } else {
        $('#other1').fadeOut();
    }
})
let landusefarm
$('#landusefarm').on('change', function () {
    var value = $('#landusefarm').val()
    if (value == 'other') {
        $('#other2').fadeIn();
        landusefarm = $('#landuseother').val();
    } else {
        $('#other2').fadeOut();
    }
})
let productionmodel
$('#productionmodel').on('change', function () {
    var value = $('#productionmodel').val();
    if (value == 'other') {
        $('#other3').fadeIn();
        productionmodel = $('#productmodelother').val();
    } else {
        $('#other3').fadeOut();
    }
})
// let outputtype
// $('#outputtype').on('change', function () {
//     var value = $('#outputtype').val();
//     if (value == 'other') {
//         $('#other4').fadeIn();
//         outputtype = $('#outputother').val();
//     } else {
//         $('#other4').fadeOut();
//     }
// })
let standard
let standardtype
let standardname
$('#standard').on('change', function () {
    var value = $('#standard').val();
    if (value == 'ยังไม่ได้รับมาตรฐานรับรอง') {
        $('#standardtype').attr("Disabled", true);
        standard = value;
        standardname = 'ไม่ระบุ';
        standardtype = 'ไม่ระบุ';
        $('#standardtype').find('option[value=PGS]').remove();
        $('#standardtype').find('option[value=มาตรฐานสากล]').remove();
        $('#standardtype').find('option[value=ไม่ระบุ]').remove();
        $('#standardtype').find('option[value=other]').remove();
        $('#other5A').fadeOut();
        $('#other5B').fadeOut();
    } else if (value == 'ไม่ระบุ') {
        $('#standardtype').attr("Disabled", true);
        standard = value;
        standardname = value;
        standardtype = value;
        $('#standardtype').find('option[value=PGS]').remove();
        $('#standardtype').find('option[value=มาตรฐานสากล]').remove();
        $('#standardtype').find('option[value=ไม่ระบุ]').remove();
        $('#standardtype').find('option[value=other]').remove();
        $('#other5A').fadeOut();
        $('#other5B').fadeOut();
    } else {
        $('#standardtype').attr("Disabled", false);
        standard = value
        standardtype = $('#standardother1').val()
        $('#other5B').fadeIn();
        $('#standardtype').append(`<option value="PGS">PGS</option>
        <option value="มาตรฐานสากล">มาตรฐานสากล/ACT-IFOAM/ACT-EU/ACT-COR/</option>
        <option value="ไม่ระบุ">ไม่ระบุ</option>
        <option value="other">อื่นๆ</option>`)
    }
})
$('#standardtype').on('change', function () {
    var value = $('#standardtype').val();
    if (value == 'other') {
        $('#other5A').fadeIn();
        $('#other5B').fadeOut();
        standardname = $('#standardother1').val();
        standardtype = value;
    } else if (value == 'PGS') {
        $('#other5B').fadeIn();
        $('#other5A').fadeOut();
        standardname = $('#standardother2').val();
        standardtype = value;
    } else {
        standardname = 'ACT-IFOAM/ACT-EU/ACT-COR';
        standardtype = value;
        $('#other5A').fadeOut();
        $('#other5B').fadeOut();
    }
})
let labortype
$('#typelabor').on('change', function () {
    var value = $('#typelabor').val();
    if (value == 'other') {
        $('#other6').fadeIn();
        labortype = $('#laborother').val()
        document.getElementById('labornum').readOnly = false;
    } else if (value == 'ไม่ระบุ') {
        document.getElementById('labornum').readOnly = true;
    } else {
        $('#other6').fadeOut();
        document.getElementById('labornum').readOnly = false;
    }
})

$("#noA2").hide()
$("#noB2").hide()
$("#noC2").hide()
$("#noD2").hide()
$("#noE2").hide()
$("#noF2").hide()
$("#noG2").hide()
$("#noH2").hide()
$("#noI2").hide()
let typess = []
let gettype = (d, e, f, g) => {
    var a = $("#" + d).attr('class')
    if (a == 'btn btn-outline-primary border-none') {
        $("#" + d).removeAttr("style").toggleClass("BG02");
        $("#" + e).slideDown();
        var b = d.split("1");
        $("#" + b[0]).removeClass("type")
        if (f == 'ข้าว') {
            typess.push({ type1: f })
        } else if (f == 'ผัก') {
            typess.push({ type2: f })
        } else if (f == 'ผลไม้') {
            typess.push({ type3: f })
        } else if (f == 'พืชสมุนไพร') {
            typess.push({ type4: f })
        } else if (f == 'ปศุสัตว์/เพาะเลี้ยง') {
            typess.push({ type5: f })
        } else if (f == 'ประมงน้ำจืด') {
            typess.push({ type6: f })
        } else if (f == 'ประมงชายฝั่ง') {
            typess.push({ type7: f })
        } else if (f == 'การแปรรูป') {
            typess.push({ type8: f })
        } else if (f == 'อื่นๆ') {
            typess.push({ type9: f })
        }
        console.log(typess)
    } else {
        $("#" + d).removeClass("BG02")
        $("#" + e).slideUp();
        var b = d.split("1");
        $("#" + b[0]).toggleClass("type")
        typess.pop({ f })
        console.log(typess)
    }
}

$('#Uother').click(function () {
})

// $('#record').val("admin")
$("#Ut1").hide()
$("#Ut2").hide()
$("#Ut3").hide()
$("#Ut4").hide()
let U1, U2, U3, U4, U5, U6, U7
$('#Ucook').click(function () {
    var sn1 = document.getElementById('Ucook');
    if (sn1.checked == true) {
        $("#Ut1").slideDown()
        U1 = $('#Utv1').val()
    } else {
        $("#Ut1").slideUp();
        U1 = "ไม่มี"
    }
})
$('#Uexchange').click(function () {
    var sn2 = document.getElementById('Uexchange');
    if (sn2.checked == true) {
        $("#Ut2").slideDown()
        U2 = $('#Utv2').val()
    } else {
        $("#Ut2").slideUp();
        U2 = "ไม่มี"
    }
})
$('#Utranform').click(function () {
    var sn3 = document.getElementById('Utranform');
    if (sn3.checked == true) {
        $("#Ut3").slideDown()
        U3 = $('#Utv3').val()
    } else if (sn3.checked == false) {
        $("#Ut3").slideUp();
        U3 = 'ไม่มี';
    }
})
$('#Umiddleman').click(function () {
    var sn4 = document.getElementById('Umiddleman');
    if (sn4.checked == true) {
        $("#Ut4").slideDown()
        U4 = $('#Utv4').val()
    } else {
        $("#Ut4").slideUp();
        U4 = "ไม่มี"
    }
})
$('#Nouse').click(function () {
    var sn5 = document.getElementById('Nouse');
    if (sn5.checked == true) {
        U5 = $('#Nouse').val()
    } else { U5 = "ไม่มี" }
})
$('#Uother').click(function () {
    var sn6 = document.getElementById('Uother');
    if (sn6.checked == true) {
        U6 = $('#Uother').val()
    } else { U6 = "ไม่มี" }
})

let savedata = () => {
    if (landowner == "") {
        landowner = $('#landowherother').val();
    } else { landowner = $('#landownership').val(); }

    if (landusefarm == "") {
        landusefarm = $('#landuseother').val();
    } else { landusefarm = $('#landusefarm').val(); }

    if (productionmodel == "") {
        productionmodel = $('#productmodelother').val();
    } else {
        productionmodel = $('#productionmodel').val();
    }

    // if (outputtype == "") {
    //     outputtype = $('#outputother').val();
    // } else {
    //     var a = $('#outputtype').val();
    //     outputtype = a[0]
    // }

    if (standardtype == "") {
        if ($('#standardtype').val() == 'PGS') {
            standardname = $('#standardother2').val();
            standardtype = $('#standardtype').val();
        } else if ($('#standardtype').val() == 'other') {
            standardname = $('#standardother1').val();
            standardtype = 'other';
        }
    } else {
        if ($('#standardtype').val() == 'other') {
            standardname = $('#standardother1').val();
            standardtype = $('#standardtype').val();
        } else if ($('#standardtype').val() == 'มาตราฐานสากล') { standardname = 'ไม่ระบุ' }
        else if ($('#standardtype').val() == 'PGS') { standardname = $('#standardother2').val(); }

    }
    // else if ($('#standardtype').val() == 'PGS') {
    //     standardname = $('#standardtype').val();
    //     standardtype = $('#standardother2').val();
    // } else if ($('#standardtype').val() == 'other') {
    //     standardname = $('#standardtype').val();
    //     standardtype = $('#standardother1').val();
    // }
    if ($('#standard').val() == 'ยังไม่ได้รับมาตรฐานรับรอง') {
        standard = $('#standard').val()
        standardname = 'ไม่ระบุ';
        standardtype = 'ไม่ระบุ';
    }


    if (labortype == "") {
        labortype = $('#laborother').val();
    } else {
        var a = $('#typelabor').val()
        labortype = a[0]
    }
    if (U1 == 'null') { U1 = 'ไม่มี' } else { U1 = $('#Utv1').val() }
    if (U2 == 'null') { U2 = 'ไม่มี' } else { U2 = $('#Utv2').val() }
    if (U3 == 'null') { U3 = 'ไม่มี' } else { U3 = $('#Utv3').val() }
    if (U4 == 'null') { U4 = 'ไม่มี' } else { U4 = $('#Utv4').val() }
    if (U5 == 'null') { U5 = 'ไม่มี' }
    if (U6 == 'null') { U6 = 'ไม่มี' } else { U7 = $('#Uotherdetail').val() }
    if (U7 == 'null') { U7 = 'ไม่มี' }

    let D1, D2, D3, D4, D5, D6
    var Ds1 = document.getElementById('Dregion');
    if (Ds1.checked == true) {
        D1 = $('#Dregion').val()
    } else { D1 = "ไม่มี" }
    var Ds2 = document.getElementById('Dcanton');
    if (Ds2.checked == true) {
        D2 = $('#Dcanton').val()
    } else { D2 = "ไม่มี" }

    var Ds3 = document.getElementById('Dtrade');
    if (Ds3.checked == true) {
        D3 = $('#Dtrade').val()
    } else { D3 = "ไม่มี" }

    var Ds4 = document.getElementById('Nodistribution');
    if (Ds4.checked == true) {
        D4 = $('#Nodistribution').val()
    } else { D4 = "ไม่มี" }

    var Ds5 = document.getElementById('Disother');
    if (Ds5.checked == true) {
        D5 = $('#Disother').val()
    } else { D5 = "ไม่มี" }

    var Ds6 = document.getElementById('Disother');
    if (Ds6.checked == true) {
        D6 = $('#Disotherdetail').val()
    } else { D6 = "ไม่มี" }

    let averin = $('#averageincome').val()
    let averexp = $('#averageexpenses').val()


    let dt1, dt2, dt3, dt4, dt5, dt6, dt7, dt8, dt9
    var dtypess = []
    $("#noA3").val() !== '' ? dt1 = $("#noA3").val() : dt1 = 'ไม่มี';
    $("#noB3").val() !== '' ? dt2 = $("#noB3").val() : dt2 = 'ไม่มี';
    $("#noC3").val() !== '' ? dt3 = $("#noC3").val() : dt3 = 'ไม่มี';
    $("#noD3").val() !== '' ? dt4 = $("#noD3").val() : dt4 = 'ไม่มี';
    $("#noE3").val() !== '' ? dt5 = $("#noE3").val() : dt5 = 'ไม่มี';
    $("#noF3").val() !== '' ? dt6 = $("#noF3").val() : dt6 = 'ไม่มี';
    $("#noG3").val() !== '' ? dt7 = $("#noG3").val() : dt7 = 'ไม่มี';
    $("#noH3").val() !== '' ? dt8 = $("#noH3").val() : dt8 = 'ไม่มี';
    $("#noI3").val() !== '' ? dt9 = $("#noI3").val() : dt9 = 'ไม่มี';
    console.log(dt1, dt2, dt3, dt4, dt5, dt6, dt7, dt8, dt9)

    let t1, t2, t3, t4, t5, t6, t7, t8, t9
    dt1 !== 'ไม่มี' ? t1 = 'ข้าว' : t1 = 'ไม่มี';
    dt2 !== 'ไม่มี' ? t2 = 'ผัก' : t2 = 'ไม่มี';
    dt3 !== 'ไม่มี' ? t3 = 'ผลไม้' : t3 = 'ไม่มี';
    dt4 !== 'ไม่มี' ? t4 = 'พืชสมุนไพร' : t4 = 'ไม่มี';
    dt5 !== 'ไม่มี' ? t5 = 'ปศุสัตว์/เพาะเลี้ยง' : t5 = 'ไม่มี';
    dt6 !== 'ไม่มี' ? t6 = 'ประมงน้ำจืด' : t6 = 'ไม่มี';
    dt7 !== 'ไม่มี' ? t7 = 'ประมงชายฝั่ง' : t7 = 'ไม่มี';
    dt8 !== 'ไม่มี' ? t8 = 'การแปรรูป' : t8 = 'ไม่มี';
    dt9 !== 'ไม่มี' ? t9 = 'อื่นๆ' : t9 = 'ไม่มี';
    console.log(t1, t2, t3, t4, t5, t6, t7, t8, t9)

    // $("#noA3").val() !== '' ? dtypess.push({ dtype1: $("#noA3").val() }) : dtypess.push({ dtype1: 'ไม่มี' });
    // $("#noB3").val() !== '' ? dtypess.push({ dtype2: $("#noB3").val() }) : dtypess.push({ dtype2: 'ไม่มี' });
    // $("#noC3").val() !== '' ? dtypess.push({ dtype3: $("#noC3").val() }) : dtypess.push({ dtype3: 'ไม่มี' });
    // $("#noD3").val() !== '' ? dtypess.push({ dtype4: $("#noD3").val() }) : dtypess.push({ dtype4: 'ไม่มี' });
    // $("#noE3").val() !== '' ? dtypess.push({ dtype5: $("#noE3").val() }) : dtypess.push({ dtype5: 'ไม่มี' });
    // $("#noF3").val() !== '' ? dtypess.push({ dtype6: $("#noF3").val() }) : dtypess.push({ dtype6: 'ไม่มี' });
    // $("#noG3").val() !== '' ? dtypess.push({ dtype7: $("#noG3").val() }) : dtypess.push({ dtype7: 'ไม่มี' });
    // $("#noH3").val() !== '' ? dtypess.push({ dtype8: $("#noH3").val() }) : dtypess.push({ dtype8: 'ไม่มี' });
    // $("#noI3").val() !== '' ? dtypess.push({ dtype9: $("#noI3").val() }) : dtypess.push({ dtype9: 'ไม่มี' });


    var data_re
    if ($('#date').val()) {
        var a = $('#date').val()
        var day = a.split("T")
        data_re = day[0]
    }


    let data = [{
        lat: $('#lat').val(),
        lng: $('#lng').val(),
        accuracy: $('#accuracy').val(),
        prov_tn: prov_n,
        amp_tn: amp_n,
        tam_tn: tam_n,
        prov_code: prov_c,
        amp_code: amp_c,
        tam_code: tam_c,
        id_date: Date.now(),
        datereport: data_re,
        datetimes: $('#date').val(),
        record: $('#record').val(),
        img: dataimgurl,

        atid: $('#atID').val(),
        landowner: landowner,
        landusefarm: landusefarm,
        areafarm: $('#areafarm').val(),
        a_unit: $('#unitfarm').val(),
        productmodel: productionmodel,
        standard: standard,
        standardname: standardname,
        standardtype: standardtype,

        outputtype: 'Nodata',
        dtypess: 'Nodata',

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
        type6: t6,
        dtype6: dt6,
        type7: t7,
        dtype7: dt7,
        type8: t8,
        dtype8: dt8,
        type9: t9,
        dtype9: dt9,

        aver_yield: $('#averageyield').val(),
        aver_in: averin[0],
        aver_exp: averexp[0],

        ucook: U1,
        uexchange: U2,
        utranform: U3,
        umiddleman: U4,
        u_no: U5,
        uother: U6,
        uotherdetail: U7,

        dregion: D1,
        dcanton: D2,
        dtrade: D3,
        d_no: D4,
        dother: D5,
        dotherdetail: D6,

        labortype: labortype,
        labor_num: $('#labornum').val() !== '' ? $('#labornum').val() : 'ไม่ระบุ',
        id_user: $('#record').val(),
        geom: datageom ? datageom.geometry : { type: 'Point', coordinates: [$('#lng').val(), $('#lat').val(),] },
    }]

    sendData(data)
}
let sendData = async (data) => {
    const obj = {
        data: data
    }
    // console.log(data)
    // var url = "http://localhost:3000";
    await $.post(url + "/food_security/savedata", obj).done((r) => {
        $('#Modalconfirm').modal('show');
        r.data.data == "success" ?
            // console.log("ok")
            axios.post(url + "/food_security/delete", { id_date: '' }).then(r => {
                console.log(r.data.data)
                r.data.data == "success" ? $('#Modalconfirm').modal('show') : null
            })
            : null

    })
}

let closeModal = () => {
    $('#Modalconfirm').modal('hide')
}