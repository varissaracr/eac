
let latlng = {
    lat: 16.820378,
    lng: 100.265787
}

// const url = 'http://localhost:3000';
const url = "https://engrids.soc.cmu.ac.th/api";
let userid;
let dataurl;
let geom = "";
// let gps1;

let map = L.map('map', {
    center: latlng,
    zoom: 13
});

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

const tam = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: "th:tambon_4326",
    format: "image/png",
    transparent: true,
    CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=22 OR pro_code=23 OR pro_code=24 OR pro_code=25 OR pro_code=26 OR pro_code=27'
});

const amp = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: "th:amphoe_4326",
    format: "image/png",
    transparent: true,
    CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=22 OR pro_code=23 OR pro_code=24 OR pro_code=25 OR pro_code=26 OR pro_code=27'
});

const pro = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true,
    CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=22 OR pro_code=23 OR pro_code=24 OR pro_code=25 OR pro_code=26 OR pro_code=27'
});

let lyrs = L.featureGroup().addTo(map)

var baseMap = {
    "Mapbox": mapbox.addTo(map),
    "google Hybrid": ghyb
}

var overlayMap = {
    "ขอบเขตตำบล": tam.addTo(map),
    "ขอบเขตอำเภอ": amp.addTo(map),
    "ขอบเขตจังหวัด": pro.addTo(map)
}

L.control.layers(baseMap, overlayMap).addTo(map);

let onLocationFound = (e) => {
    console.log(e);
    if (geom) {
        map.removeLayer(geom);
    }
    geom = L.marker(e.latlng, {
        draggable: false,
        name: 'p'
    }).addTo(map);

    $("#lat").val(e.latlng.lat)
    $("#lon").val(e.latlng.lng)
}

map.on("locationfound", onLocationFound);
map.locate({ setView: true, maxZoom: 16 });
// var lc = L.control.locate({
//     position: 'topleft',
//     strings: {
//         title: ""
//     },
//     locateOptions: {
//         enableHighAccuracy: true,
//     }
// }).addTo(map);

// lc.start();

map.on('click', (e) => {
    if (geom) {
        map.removeLayer(geom);
    }
    // lc.stop();
    geom = L.marker(e.latlng, {
        draggable: false,
        name: 'p'
    }).addTo(map);

    $("#lat").val(e.latlng.lat)
    $("#lon").val(e.latlng.lng)
});

$("#dataform").on("submit", function (e) {
    e.preventDefault();
})


let sendData = () => {
    // console.log(geom.toGeoJSON());
    if (geom == "") {
        $("#warningmodal").modal("show")
    } else {
        const obj = {
            data: {
                userid: userid,
                orgname: $('#orgname').val(),
                orgcontact: $('#orgcontact').val(),
                orgtel: $('#orgtel').val(),
                orgemail: $('#orgemail').val(),
                orgline: $('#orgline').val(),
                orgfacebook: $('#orgfacebook').val(),
                website: $('#website').val(),
                headname: $('#headname').val(),
                headvno: $('#headvno').val(),
                headvmoo: $('#headvmoo').val(),
                headvname: $('#headvname').val(),
                headpro: $('#headpro').val(),
                headamp: $('#headamp').val(),
                headtam: $('#headtam').val(),
                orgvno: $('#orgvno').val(),
                orgvmoo: $('#orgvmoo').val(),
                orgvname: $('#orgvname').val(),
                // orgpro: $('#orgpro').val(),
                // orgamp: $('#orgamp').val(),
                // orgtam: $('#orgtam').val(),

                orgpro: $('#pro').val(),
                orgamp: $('#amp').val(),
                orgtam: $('#tam').val(),
                pro_name: $('#pro_name').val(),
                amp_name: $('#amp_name').val(),
                tam_name: $('#tam_name').val(),

                lat: $('#lat').val(),
                lon: $('#lon').val(),
                typ_commutrav: $("#typ_commutrav").is(":checked") ? $("#typ_commutrav").val() : '',
                typ_commucomfort: $("#typ_commucomfort").is(":checked") ? $("#typ_commucomfort").val() : '',
                typ_commulearn: $("#typ_commulearn").is(":checked") ? $("#typ_commulearn").val() : '',
                typ_commuecon: $("#typ_commuecon").is(":checked") ? $("#typ_commuecon").val() : '',
                typ_commuforest: $("#typ_commuforest").is(":checked") ? $("#typ_commuforest").val() : '',
                typ_houseforest: $("#typ_houseforest").is(":checked") ? $("#typ_houseforest").val() : '',
                typ_mangforest: $("#typ_mangforest").is(":checked") ? $("#typ_mangforest").val() : '',
                typ_watmanage: $("#typ_watmanage").is(":checked") ? $("#typ_watmanage").val() : '',
                typ_landmange: $("#typ_landmange").is(":checked") ? $("#typ_landmange").val() : '',
                typ_fishing: $("#typ_fishing").is(":checked") ? $("#typ_fishing").val() : '',
                typ_industwaste: $("#typ_industwaste").is(":checked") ? $("#typ_industwaste").val() : '',
                typ_housewaste: $("#typ_housewaste").is(":checked") ? $("#typ_housewaste").val() : '',
                typ_airpollution: $("#typ_airpollution").is(":checked") ? $("#typ_airpollution").val() : '',

                typ_eastorganize: $("#typ_eastorganize").is(":checked") ? $("#typ_eastorganize").val() : '',
                typ_impactedcommu: $("#typ_impactedcommu").is(":checked") ? $("#typ_impactedcommu").val() : '',
                typ_orgniccommu: $("#typ_orgniccommu").is(":checked") ? $("#typ_orgniccommu").val() : '',
                typ_famforestcommu: $("#typ_famforestcommu").is(":checked") ? $("#typ_famforestcommu").val() : '',
                typ_eastfisher: $("#typ_eastfisher").is(":checked") ? $("#typ_eastfisher").val() : '',
                typ_learnningnet: $("#typ_learnningnet").is(":checked") ? $("#typ_learnningnet").val() : '',
                typ_travelcommu: $("#typ_travelcommu").is(":checked") ? $("#typ_travelcommu").val() : '',
                typ_eastwater: $("#typ_eastwater").is(":checked") ? $("#typ_eastwater").val() : '',
                typ_eastlabour: $("#typ_eastlabour").is(":checked") ? $("#typ_eastlabour").val() : '',
                typ_eastwaste: $("#typ_eastwaste").is(":checked") ? $("#typ_eastwaste").val() : '',
                typ_newgen: $("#typ_newgen").is(":checked") ? $("#typ_newgen").val() : '',
                typ_ecobase: $("#typ_ecobase").is(":checked") ? $("#typ_ecobase").val() : '',
                typ_eastfarmer: $("#typ_eastfarmer").is(":checked") ? $("#typ_eastfarmer").val() : '',

                typ_noisepollution: $("#typ_noisepollution").is(":checked") ? $("#typ_noisepollution").val() : '',
                typ_other: $("#typ_other").is(":checked") ? $("#typ_other").val() : '',
                orgtypeother: $('#orgtypeother').val(),
                orgstatus: $('#orgstatus').val(),
                orgtarget: $('#orgtarget').val(),
                orgwork: $('#orgwork').val(),
                orgoutput: $('#orgoutput').val(),
                orgreportor: $('#orgreportor').val(),
                img: dataurl ? dataurl : dataurl = "",
                geom: geom == "" ? "" : geom.toGeoJSON()
            }
        }
        // console.log(obj);
        axios.post(url + "/org-api/insert", obj).then((r) => {
            r.data.data == "success" ? $("#okmodal").modal("show") : null
        })
    }
    return false;
}

let gotoList = () => {
    location.href = "./../report/index.html";
}

let refreshPage = () => {
    location.reload(true);
}

$("#imgfile").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file);
        document.getElementById('preview').src = imageOriginal;
    }
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

let removeLayer = () => {
    map.eachLayer(i => {
        console.log(i);
        i.options.name == "bnd" ? map.removeLayer(i) : null;
    })
}

var boundStyle = {
    "color": "#ff7800",
    "fillColor": "#fffcf5",
    "weight": 5,
    "opacity": 0.45,
    "fillOpacity": 0.25
};

let getAmp = (e) => {
    // console.log(e);
    removeLayer();
    axios.get(`${url}/eec-api/get-bound/pro/${e}`).then(async (r) => {
        let geojson = await JSON.parse(r.data.data[0].geom);
        // console.log(geojson);
        let a = L.geoJSON(geojson, {
            style: boundStyle,
            name: "bnd"
        }).addTo(map);
        map.fitBounds(a.getBounds());
    })

    axios.get(url + "/eec-api/get-th-amp/" + e).then(r => {
        $("#amp").empty();
        $("#tam").empty();
        $("#amp").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#amp").append(`<option value="${i.ap_idn}">${i.amp_name}</option>`)
        });
    });
}

let getTam = (e) => {
    removeLayer();
    axios.get(`${url}/eec-api/get-bound/amp/${e}`).then(async (r) => {
        let geojson = await JSON.parse(r.data.data[0].geom);
        // console.log(geojson);
        let a = L.geoJSON(geojson, {
            style: boundStyle,
            name: "bnd"
        }).addTo(map);
        map.fitBounds(a.getBounds());
    })

    axios.get(url + "/eec-api/get-th-tam/" + e).then(r => {
        // console.log(r);
        $("#tam").empty();
        $("#tam").append(`<option value=""></option>`);
        r.data.data.map(i => {
            $("#tam").append(`<option value="${i.tb_idn}">${i.tam_name}</option>`)
        });
    });
}

let getTamOne = (e) => {
    removeLayer();
    axios.get(`${url}/eec-api/get-bound/tam/${e}`).then(async (r) => {
        let geojson = await JSON.parse(r.data.data[0].geom);
        // console.log(geojson);
        let a = L.geoJSON(geojson, {
            style: boundStyle,
            name: "bnd"
        }).addTo(map);
        map.fitBounds(a.getBounds());
    })

    axios.get(url + "/eec-api/get-th-onetam/" + e).then(r => {
        r.data.data.map(i => {
            console.log(i);
            $("#pro_name").val(i.pro_name);
            $("#amp_name").val(i.amp_name);
            $("#tam_name").val(i.tam_name);
        });
    });
}


$("#headpro").change(e => {
    // console.log(e.target.value);
    axios.get(url + "/eec-api/get-th-amp/" + e.target.value).then(r => {
        $("#headamp").empty()
        $("#headtam").empty()
        $("#headamp").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#headamp").append(`<option value="${i.ap_idn}">${i.amp_name}</option>`)
        })
    })
})

$("#headamp").change(e => {
    axios.get(url + "/eec-api/get-th-tam/" + e.target.value).then(r => {

        console.log(r);
        $("#headtam").empty()
        $("#headtam").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#headtam").append(`<option value="${i.tb_idn}">${i.tam_name}</option>`)
        })
    })
})







