const url = "https://engrids.soc.cmu.ac.th/api";
let iddata = sessionStorage.getItem('id_data');
// let iddata = '1635476633415'
// let fromAdmin = sessionStorage.getItem('w_from_admin');
$(document).ready(async () => {
    // console.log(iddata)
    await getedit(iddata)
});

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
    drawPolygon: false,
    drawPolyline: false,
    drawRectangle: false,
    drawCircleMarker: false,
    cutPolygon: false,
    editMode: false,
    removalMode: true,
    dragMode: false,
    rotateMode: false,
});

let datageom
map.on('pm:create', e => {
    lc.stop();
    map.eachLayer(i => {
        if (i.options.name == "Marker") {
            map.removeLayer(i)
        }
    })
    var data = e.layer.toGeoJSON();
    if (data.geometry.type == "Point") {
        var latlng = data.geometry.coordinates;
        var lat = $('#lat').val();
        var lng = $('#lng').val();

        // if (lat == "" && lng == "") {
        $('#lat').val(latlng[1]);
        $('#lng').val(latlng[0]);
        $('#accuracy').val(0);
        // } 
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
let group_travel = (val) => {

    axios.post(url + '/org-api/getdata').then(async (r) => {
        var d = r.data.data;
        let g = d.filter(e => e.typ_commutrav == "ท่องเที่ยวชุมชน")
        $('#typ_commu').empty().append(`<option value="ไม่ระบุ">ไม่ระบุ</option>`)
        g.map(i => {
            $('#typ_commu').append(`<option value="${i.orgname}">${i.orgname}</option>`)
        })
        $('#typ_commu').append(`<option value="กลุ่มอื่นๆ">กลุ่มอื่นๆ</option>`)
        // console.log(val)
        $('#typ_commu').val(val).change()
        // console.log(g)
    })
}

let getedit = async (id) => {
    // var url = "http://localhost:3000";
    await axios.post(url + `/form_travel/getdata/id`, { id_data: id }).then(async (r) => {
        var d = r.data.data;
        // console.log(d[0])
        let marker = L.marker([Number(d[0].lat), Number(d[0].lng)], {
            // icon: iconred
            maxZoom: 20,
            name: 'marker',
            data: d
        }).addTo(map);;
        var popup = marker.bindPopup(`<h6><b>ที่ตั้ง</b></h6><span class="kanit-16">${d[0].st_name}<span>`);
        popup.openPopup();

        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
        // map.fitBounds(marker.getBounds());
        d[0].lat !== 'null' ? $('#lat').val(d[0].lat) : null;
        d[0].lng !== 'null' ? $('#lng').val(d[0].lng) : null;
        d[0].accuracy !== 'null' ? $('#accuracy').val(d[0].accuracy) : null;
        d[0].prov_tn !== 'null' ? $('#pro ').val(d[0].prov_tn) : null;
        d[0].amp_tn !== 'null' ? $('#amp').val(d[0].amp_tn) : null;
        d[0].tam_tn !== 'null' ? $('#tam').val(d[0].tam_tn) : null;

        d[0].st_name !== 'null' ? $('#travel_n').val(d[0].st_name) : null;
        d[0].locations !== 'null' ? $('#location').val(d[0].locations) : null;
        d[0].details !== null ? $('#detail').text(d[0].details) : null;

        let time = d[0].datetimes.split("T")
        let t2 = time[1].split(":")
        let dattime = `${time[0]}T${t2[0]}:${t2[1]}`
        d[0].datereport !== 'null' ? $('#date').val(dattime) : null
        d[0].url_yt !== 'null' ? $('#url_yt').val(d[0].url_yt) : null

        d[0].img1 !== 'null' ? $('#preview1').attr("src", d[0].img1) : null
        d[0].img2 !== 'null' ? $('#preview2').attr("src", d[0].img2) : null
        d[0].img3 !== 'null' ? $('#preview3').attr("src", d[0].img3) : null
        d[0].img4 !== 'null' ? $('#preview4').attr("src", d[0].img4) : null
        d[0].img5 !== 'null' ? $('#preview5').attr("src", d[0].img5) : null
        d[0].img6 !== 'null' ? $('#preview6').attr("src", d[0].img6) : null
        d[0].record !== 'null' ? $('#record').val(d[0].record) : null

        d[0].typess == "ท่องเที่ยวเชิงเกษตร" ? $('input[name=radioName][value="ท่องเที่ยวเชิงเกษตร"]').prop('checked', 'checked') : null
        d[0].typess == "ท่องเที่ยวเพื่อการเรียนรู้" ? $('input[name=radioName][value="ท่องเที่ยวเพื่อการเรียนรู้"]').prop('checked', 'checked') : null
        d[0].typess == "ท่องเที่ยวเชิงนิเวศ" ? $('input[name=radioName][value="ท่องเที่ยวเชิงนิเวศ"]').prop('checked', 'checked') : null
        d[0].typess == "ท่องเที่ยวเชิงศาสนา" ? $('input[name=radioName][value="ท่องเที่ยวเชิงศาสนา"]').prop('checked', 'checked') : null
        d[0].typess == "ท่องเที่ยววิถีชุมชน" ? $('input[name=radioName][value="ท่องเที่ยววิถีชุมชน"]').prop('checked', 'checked') : null

        d[0].commu_user !== 'null' ? group_travel(d[0].commu_user) : null

        //

    })
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
    map.eachLayer(i => {
        if (i.options.pane == 'markerPane') {
            map.removeLayer(i)
        }
    })
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

var type
$('#travel input').on('change', function () {
    type = $('input[name=radioName]:checked', '#travel').val()
    // console.log($('input[name=radioName]:checked', '#travel').val());
});
let savedata = () => {

    var data_re
    if ($('#date').val()) {
        var a = $('#date').val()
        var day = a.split("T")
        data_re = day[0]
    }
    // console.log(Date.now())
    let data = [{
        lat: $('#lat').val(),
        lng: $('#lng').val(),
        accuracy: $('#accuracy').val(),
        prov_tn: $('#pro').val(),
        amp_tn: $('#amp').val(),
        tam_tn: $('#amp').val(),
        datereport: data_re,
        datetimes: $('#date').val(),
        st_name: $("#travel_n").val(),
        locations: $("#location").val(),
        typess: type,
        details: $("#detail").val(),
        url_yt: $('#url_yt').val(),
        img1: dataimgurl1,
        img2: dataimgurl2,
        img3: dataimgurl3,
        img4: dataimgurl4,
        img5: dataimgurl5,
        img6: dataimgurl6,
        record: $('#record').val(),
        id_user: $('#record').val(),
        id_data: iddata,
        commu_user: $('#typ_commu').val(),
        geom: datageom ? datageom.geometry : { type: 'Point', coordinates: [$('#lng').val(), $('#lat').val(),] },
    }]
    // $('#Modalconfirm').modal('show')
    // console.log(datageom.geometry)
    sendData(data)
}
let sendData = async (data) => {
    const obj = {
        data: data
    }
    // console.log(data)
    await $.post(url + "/travel_eac/form/update", obj).done((r) => {
        console.log(r.data)
        r.data == "success" ? $('#Modalconfirm').modal('show') : null
        // axios.post(url + "/food_security/delete", { id_date: '' }).then(r => {
        //     r.data.data == "success" ? $('#Modalconfirm').modal('show') : null
        // })
    })
}


let closeModal = () => {
    $('#Modalconfirm').modal('hide')
}