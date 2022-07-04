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
    console.log('loadmap')
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
        // console.log(i.options)
        i.options.cname == 'created' ? map.removeLayer(i) : null;
    })
    // map.on('pm:dragend', () => console.log('pm:dragend'));

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
    nearData(latlon)
}

map.on("pm:create", e => {
    lc.stop();
    map.eachLayer(i => {
        i.options.cname == "created" ?
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
    // rmlayer()
    nearData(datlatlon02)
    // map.editTools._drawingEditor.disable();
});

$(document).ready(() => {
    loadMap();
    getpro()
    $("#fname").val('admin')
});

let getpro = () => {
    axios.get(url + `/th/province`).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#pro').append(`<option value="${i.pv_code}">${i.pv_tn}</option>`)
        })
    })
}

$('#pro').on('change', function () {
    var code = $('#pro').val()
    $("#amp").empty();
    $("#tam").empty();
    console.log(code)
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

let airval
let getairval = (val) => {
    airval = val
    console.log(airval)

}

$('#sick_list').multiselect({
    includeSelectAllOption: true,
    buttonWidth: '100%',
    maxHeight: 400,
    buttonClass: 'form-control',
    nonSelectedText: 'ตัวเลือก',
    enableFiltering: true,

    enableCollapsibleOptGroups: true,
    enableCaseInsensitiveFiltering: false,
    enableFullValueFiltering: false,
    enableClickableOptGroups: false,
    enableCollapsibleOptGroups: false,
    collapseOptGroupsByDefault: true,
    filterPlaceholder: 'ค้นหา...',
    onChange: function (option, checked) {
        // alert(option.length + ' options ' + (checked ? 'selected' : 'deselected'));
        // $('#wreview').text(option.length + ' options ' + (checked ? 'selected' : 'deselected'))
    },
    buttonText: function (options, select) {
        if (this.disabledText.length > 0
            && (select.prop('disabled') || (options.length == 0 && this.disableIfEmpty))) {
            $('#wreview').text(this.disabledText)
            return this.disabledText;
        } else if (options.length === 0) {
            $('#wreview').text('')
            return this.nonSelectedText;
        } else if (this.allSelectedText && options.length === $('option', $(select)).length
            && $('option', $(select)).length !== 1 && this.multiple) {
            if (this.selectAllNumber) {
                $('#wreview').text('เลือกทั้งหมด' + ' (' + options.length + ')')
                // return this.allSelectedText + ' (' + options.length + ')';
                return 'เลือกทั้งหมด' + ' (' + options.length + ')';
            }
            else {
                $('#wreview').text(this.allSelectedText)
                return this.allSelectedText;
            }
        } else if (this.numberDisplayed != 0 && options.length > this.numberDisplayed) {
            var selected = ''; var delimiter = this.delimiterText;
            options.each(function () {

                var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                selected += label + delimiter;

            });
            $('#wreview').text(selected)
            return options.length + ' ' + this.nSelectedText;
        } else {
            var selected = ''; var delimiter = this.delimiterText;
            options.each(function () {

                var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                selected += label + delimiter;

            });
            $('#wreview').text(selected)
            return selected.substr(0, selected.length - this.delimiterText.length);
        }
    },
});

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

let nearData = async (e) => {
    let url = "https://engrids.soc.cmu.ac.th/api";
    let res = await axios.post(url + '/eec-api/get-aqi-near', { geom: e });
    console.log(e);
    console.log(res.data.data[0]);
    var a = res.data.data[0]
    // // AQI
    if (Number(a.aqi) <= 25) {
        $('#aqi').toggleClass("BG01");
    } else if (Number(a.aqi) <= 50) {
        $('#aqi').toggleClass("BG02");
    } else if (Number(a.aqi) <= 100) {
        $('#aqi').toggleClass("BG03");
    } else if (Number(a.aqi) <= 100) {
        $('#aqi').toggleClass("BG04");
    } else {
        $('#aqi').toggleClass("BG05");
    }
    // //PM10
    if (Number(a.pm10) <= 54) {
        $('#pm10').toggleClass("BG01");
    } else if (Number(a.pm10) <= 154) {
        $('#pm10').toggleClass("BG02");
    } else if (Number(a.pm10) <= 254) {
        $('#pm10').toggleClass("BG03");
    } else if (Number(a.pm10) <= 354) {
        $('#pm10').toggleClass("BG04");
    } else {
        $('#pm10').toggleClass("BG05");
    }
    // //PM2.5
    if (Number(a.pm25) <= 12) {
        $('#pm25').toggleClass("BG01");
    } else if (Number(a.pm25) <= 35.4) {
        $('#pm25').toggleClass("BG02");
    } else if (Number(a.pm25) <= 55.4) {
        $('#pm25').toggleClass("BG03");
    } else if (Number(a.pm25) <= 150.45) {
        $('#pm25').toggleClass("BG04");
    } else {
        $('#pm25').toggleClass("BG05");
    }

    $("#aqi").val(Number(a.aqi))
    $("#pm10").val(Number(a.pm10))
    $("#pm25").val(Number(a.pm25))
    $("#o3").val(Number(a.o3))
    $("#co").val(Number(a.co))
    $("#no2").val(Number(a.no2))
    $("#so2").val(Number(a.so2))
    $("#datetime").val(a.dt)
    $("#stname").val(a.sta_th)

    $("#aqi").text(Number(a.aqi))
    $("#pm10").text(Number(a.pm10))
    $("#pm25").text(Number(a.pm25))
    $("#o3").text(Number(a.o3))
    $("#co").text(Number(a.co))
    $("#no2").text(Number(a.no2))
    $("#so2").text(Number(a.so2))
    $("#datetime").text(`วันที่ ${res.data.data[0].dt_} เวลา ${res.data.data[0].time_} น.`)
    $("#stname").text(`รหัส: ${res.data.data[0].sta_id} ชื่อสถานี: ${res.data.data[0].sta_th} สถานที่: ${res.data.data[0].area_th}`)

    $('#buttonsave').prop('disabled', false);
}

let chkData = () => {
    if (!geom) {
        $("#chkgeommodal").modal("show")
    } else {
        $("#confirmModal").modal("show")
    }
}

let postData = async () => {
    let ffid = Date.now()
    let lat = $("#lat").val();
    let lng = $("#lng").val();
    let accuracy = $("#accuracy").val();
    let prov = $("#pro").val() !== "TH" ? $("#pro option:selected").text() : "false";
    let amphoe = $("#amp").val() !== null ? $("#amp option:selected").text() : "false";
    let tambon = $("#tam").val() !== null ? $("#tam option:selected").text() : "false";
    let feeling = airval;
    let aqi = $("#aqi").val();
    let pm25 = $("#pm25").val();
    let pm10 = $("#pm10").val();
    let o3 = $("#o3").val();
    let co = $("#co").val();
    let no2 = $("#no2").val();
    let so2 = $("#so2").val();
    let stname = $("#stname").val();
    let airtime = $("#datetime").val();
    let sick = $("#wreview").text();
    let fname = 'admin'

    const date2 = new Date(ffid);
    let dt = `วันที่ ${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()} เวลา ${date2.getHours()}.${date2.getMinutes()} น.`
    // console.log(dt);

    let datObj = {
        airid: ffid,
        data: {
            // usrid: urid,
            usrid: '0123456789',
            usrname: fname,
            airid: ffid,
            dt: ffid,
            date_dt: dt,
            lat: lat,
            lng: lng,
            accuracy: accuracy,
            province: prov,
            amphoe: amphoe,
            tambon: tambon,
            feeling: feeling,
            aqi: aqi,
            pm25: pm25,
            pm10: pm10,
            o3: o3,
            no2: no2,
            co: co,
            so2: so2,
            stname: stname,
            airtime: airtime,
            sick: sick,
            geom: geom,
            img1: imgurl,
            img2: imgurl2,
            img3: imgurl3,
            img4: imgurl4
        }
    }
    // console.log($('#MultipleCheckboxes').val())
    console.log(datObj)
    await axios.post(url + "/formair-eac/save", datObj).then((r) => {
        // console.log(r.data)
        r.data.data == "success" ? $("#confirmModal").modal('hide') && refreshPage('OK') : console.log("False")
    })
}

let refreshPage = (key) => {
    key !== null ? window.open("./../dashboard/index.html", "_self") : null
    // console.log("ok");
}

let gotoDashboard2 = () => {
    // localStorage.clear();
    location.href = "./../dashboard/index.html";
}


