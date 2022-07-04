let id_ffid = sessionStorage.getItem('ffid');
// console.log(id_ffid)

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
    drawMarker: false,
    drawCircle: false,
    drawPolyline: false,
    drawRectangle: true,
    drawCircleMarker: false,
    drawText: false,
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

map.on("pm:create", e => {
    e.layer.options.cname = "created"
    geom = e.layer.toGeoJSON();
});

$(document).ready(() => {
    loadMap();
    geomdata();
    typesdata();

});

let fc = L.featureGroup().addTo(map);
let geomdata = () => {
    axios.post(url + '/ff-eac/geom/databyid', { ffid: id_ffid }).then((r) => {
        // console.log(r.data.data)
        var myStyle = {
            "color": "#50cfce",
            "weight": 5,
            "opacity": 0.65
        };
        r.data.data.map(i => {
            let location = `${i.flocation !== null ? i.flocation : '-'} ต.${i.tambon} อ.${i.amphoe} จ.${i.province}`
            $("#fname").val(i.usrname);
            $("#usrid").val(i.usrid);
            $("#flocation").val(location);

            $("#flocation_e").val(i.flocation);
            $("#tambon_e").val(i.tambon);
            $("#amphoe_e").val(i.amphoe);
            $("#province_e").val(i.province);
            $("#area_e").val(i.frai);
            $("#flandtype_e").val(i.flandtype);

            if (i.geom) {
                let dat = {
                    "type": "Feature",
                    "geometry": JSON.parse(i.geom),
                    "properties": {
                        "name": i.ffid
                    }
                }

                let json = L.geoJSON(dat, { style: myStyle });
                json.addTo(fc);
                // $("#listItem").append(`<a class="list-group-item list-group-item-action" onclick="getParcel(${i.ffid})">${i.ffid}</a>`);
            }
            // console.log(i);
        })
        map.fitBounds(fc.getBounds());
        // console.log(fc);
    })
}
let typesdata = () => {
    axios.post(url + '/ff-eac/type/databyid', { ffid: id_ffid }).then((r) => {
        // console.log(r.data.data)
        $("#plantlist").empty();
        $("#plantlist").append(`<option >เลือกชนิดพืช</option>`)
        $("#plantlist2").empty().append(`<option >เลือกชนิดพืช</option>`)
        r.data.data.map(i => {
            $("#plantlist").append(`<option value="${i.fplant}">${i.fplant} (${i.ftype})</option>`)
            $("#plantlist2").append(`<option value="${i.fplant}">${i.fplant} (${i.ftype})</option>`)
        });
    })
}
$('#plantlist').on('change', function () {
    let val = $('#plantlist').val();
    axios.post(url + '/ff-eac/type/databyid', { ffid: id_ffid }).then((r) => {
        r.data.data.map(i => {
            if (i.fplant == val) {
                i.fcook !== '' || i.fcook !== null ? $('#eat').val(i.fcook) : null;
                i.fcook_u !== '' || i.fcook_u !== null ? $('#eat_unit').val(i.fcook_u) : null;

                i.fmedicine !== '' || i.fmedicine !== null ? $('#herb').val(i.fmedicine) : null;
                i.fmedicine_u !== '' || i.fmedicine_u !== null ? $('#herb_unit').val(i.fmedicine_u) : null;

                i.faddress !== '' || i.faddress !== null ? $('#use').val(i.faddress) : null
                i.faddress_u !== '' || i.faddress_u !== null ? $('#use_unit').val(i.faddress_u) : null

                i.fproduce !== '' || i.fproduce !== null ? $('#econ').val(i.fproduce) : null
                i.fproduce_u !== '' || i.fproduce_u !== null ? $('#econ_unit').val(i.fproduce_u) : null
            }
        }
        );
    })

})

let chkData = () => {
    if (!geom) {
        postData()
    } else {
        postgeomData()
    }
}
let postgeomData = async () => {
    let Newdt1 = Date.now()
    const date1 = new Date(Newdt1);
    let dt1 = `วันที่ ${date1.getDate()}/${date1.getDay()}/${date1.getFullYear()} เวลา ${date1.getHours()}.${date1.getMinutes()} น.`

    let datObj = {
        ffid: id_ffid,
        data: { date_dt: dt1, geom: geom }
    }

    await axios.post(url + "/ff-eac/save/geom2", datObj).then((r) =>
        r.data.data == "success" ? postData() : null && console.log("False")
    );
}

let postData = async () => {
    let fplant = $("#plantlist option:selected").text() !== "เลือกชนิดพืช" ? $("#plantlist").val() : "false";
    let fcook = $("#eat").val() !== null ? $("#eat").val() : null;
    let fcook_u = $("#eat_unit").val() !== null ? $("#eat_unit").val() : null;

    let fmedicine = $("#herb").val() !== null ? $("#herb").val() : null;;
    let fmedicine_u = $("#herb_unit").val() !== null ? $("#herb_unit").val() : null;

    let faddress = $("#use ").val() !== null ? $("#use").val() : null;
    let faddress_u = $("#use_unit").val() !== null ? $("#use_unit").val() : null;

    let fproduce = $("#econ").val() !== null ? $("#econ").val() : null;
    let fproduce_u = $("#econ_unit").val() !== null ? $("#econ_unit").val() : null;;

    let Newdt = Date.now()
    const date2 = new Date(Newdt);
    let dt = `วันที่ ${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()} เวลา ${date2.getHours()}.${date2.getMinutes()} น.`

    let datObj = {
        ffid: id_ffid,
        fplant: fplant,
        data: {
            date_dt: dt,
            fcook: fcook,
            fcook_u: fcook_u,
            fmedicine: fmedicine,
            fmedicine_u: fmedicine_u,
            faddress: faddress,
            faddress_u: faddress_u,
            fproduce: fproduce,
            fproduce_u: fproduce_u,

        }
    }
    // console.log(datObj)
    await axios.post(url + "/ff-eac/type/update", datObj).then(() => $("#confirmModal").modal("show"));
}
let editData1 = async () => {
    let flocation = $("#flocation_e").val();
    let tambon = $("#tambon_e").val();
    let amphoe = $("#amphoe_e").val();
    let province = $("#province_e").val();
    let frai = $("#area_e").val();
    let flandtype = $("#flandtype_e").val();
    let Newdt = Date.now()
    const date03 = new Date(Newdt);
    let dt = `วันที่ ${date03.getDate()}/${date03.getMonth() + 1}/${date03.getFullYear()} เวลา ${date03.getHours()}.${date03.getMinutes()} น.`

    let datObj = {
        ffid: id_ffid,
        data: {
            date_dt: dt,
            flocation: flocation,
            tambon: tambon,
            amphoe: amphoe,
            province: province,
            frai: frai,
            flandtype: flandtype,
        }
    }
    // console.log(datObj)
    await axios.post(url + "/ff-eac/save/geom2", datObj).then(
        (r) => r.data.data == "success" ? $('#Edit1Modal').modal('hide') && location.reload() : null)
}

let openEdit1 = () => {
    $('#Edit1Modal').modal('show');
}
let openEdit2 = () => {
    $('#Edit2Modal').modal('show');
}
$('#okadddata').hide();
let addData_plant = () => {

    let fname = $("#fname").val() !== null ? $("#fname").val() : null;
    let urid = $("#usrid").val()
    let ftype = $("#planttype").val() !== null ? $("#planttype").val() : null;
    let fplant = $("#plant_n").val() !== null ? $("#plant_n").val() : null;

    let Newdt = Date.now()
    const date02 = new Date(Newdt);
    let dt = `วันที่ ${date02.getDate()}/${date02.getMonth() + 1}/${date02.getFullYear()} เวลา ${date02.getHours()}.${date02.getMinutes()} น.`

    let datObj = {
        ffid: id_ffid,
        usrid: urid,
        usrname: fname,
        date_dt: dt,
        ftype: ftype,
        fplant: fplant
    }
    // console.log(datObj)
    axios.post(url + "/ff-eac/insert", datObj).then(
        (r) => r.data.data == "success" ? $('#okadddata').show(0).delay(2000).hide(0) && location.reload() : null
    );
}
$('#deletedata').hide();
let deleteData_plant = () => {
    let fplant = $('#plantlist2').val() !== null ? $('#plantlist2').val() : null;
    let datObj = {
        ffid: id_ffid,
        fplant: fplant
    }
    // console.log(datObj)
    axios.post(url + "/ff-eac/type/delete", datObj).then(
        (r) => r.data.data == "success" ? $('#deletedata').show(0).delay(2000).hide(0) && location.reload() : null
    );
}

let gotoDashboard = () => {
    $("#confirmModal").modal("hide")
    localStorage.clear();
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
