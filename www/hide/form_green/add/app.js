let userid;

let main = async () => {
    await liff.init({ liffId: "1655648770-JLXzogag" })
    if (liff.isLoggedIn()) {
        getUserProfile()
    } else {
        liff.login()
    }
}

// main()

let getUserProfile = async () => {
    const profile = await liff.getProfile();
    $('#profile').attr('src', await profile.pictureUrl);
    $('#userId').text(profile.userId);
    $('#statusMessage').text(await profile.statusMessage);
    $('#displayName').text(await profile.displayName);
    userid = profile.userId;
}

const url = "https://engrids.soc.cmu.ac.th/api";
// const url = 'http://localhost:3700';
let latlng = {
    lat: 13.305567,
    lng: 101.383101
};

let map = L.map('map', {
    center: latlng,
    zoom: 9
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

var pro = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true
});

let lyrs = L.featureGroup().addTo(map)

var baseMap = {
    "Mapbox": mapbox.addTo(map),
    "google Hybrid": ghyb
}

var overlayMap = {
    "ขอบจังหวัด": pro,
    "พื้นที่สีเขียว": lyrs
}

L.control.layers(baseMap, overlayMap).addTo(map);

let onLocationFound = (e) => {
    // if (gps1) {
    //     map.removeLayer(gps1);
    // }
    // gps1 = L.marker(e.latlng, {
    //     draggable: false,
    //     name: 'p'
    // }).addTo(map);
}

map.on("locationfound", onLocationFound);

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: ""
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

// lc.start();

map.pm.addControls({
    position: 'topleft',
    drawMarker: false,
    drawCircle: false,
    drawPolyline: false,
    drawRectangle: true,
    drawCircleMarker: false,
    cutPolygon: false,
    editMode: false,
    dragMode: false,
    removalMode: false,
});

let geom = "";
let dataurl = "";
// $("#form").hide()

let onEachFeature = (fc, lyr) => {
    // console.log(fc)
    if (fc.properties) {
        // console.log(fc.properties)
        lyr.bindPopup(`<b>${fc.properties.gr_name}</b><br>
            ต.${fc.properties.tambon} อ.${fc.properties.amphoe} จ.${fc.properties.prov}<br>
            ${fc.properties.type} ${fc.properties.sup_type}<br>
            จำนวนต้นไม้ ${fc.properties.tree}<br>
        `)
    }
}

// axios.post("http://localhost:3700/green-api/getdata", { id: "id" }).then(r => {
//     console.log(r.data.data);
//     let data = r.data.data.features
//     data.map(i => {
//         lyrs.addLayer(L.geoJSON(i, {
//             id: i.gid,
//             onEachFeature: onEachFeature
//         }))
//     })
// })

map.on('pm:create', e => {
    geom = e.layer.toGeoJSON();
});

// lyrs.on('pm:edit', e => {
//     console.log(e)
//     $("#form").show()
// })

// document.getElementById('agdate').valueAsDate = new Date();

let sendData = () => {
    // console.log(geom[0]);
    const obj = {
        data: {
            userid: userid,
            gr_name: $('#gr_name').val(),
            prov_nam_t: $('#pro_name').val(),
            amphoe_t: $('#amp_name').val(),
            tam_nam_t: $('#tam_name').val(),
            prov_code: $('#pro').val(),
            amphoe_idn: $('#amp').val(),
            tambon_idn: $('#tam').val(),
            type: $('#type').val(),
            rai: $('#rai').val(),
            tree: $('#tree').val(),
            agency: $('#agency').val(),
            img: dataurl ? dataurl : dataurl = "",
            geom: geom == "" ? "" : geom
        }
    }

    if (geom != "") {
        axios.post(url + "/green-api/insert", obj).then((r) => {
            r.data.data == "success" ? $("#okmodal").modal("show") : null
        })
    } else {
        $("#modal").modal("show");
    }
    return false;
}

let gotoList = () => {
    location.href = "./../list/index.html";
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


let getAmp = (e) => {
    axios.get(url + "/eec-api/get-th-amp/" + e).then(r => {
        $("#amp").empty()
        $("#tam").empty()
        $("#amp").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#amp").append(`<option value="${i.ap_idn}">${i.amp_name}</option>`)
        })
    })
}

let getTam = (e) => {
    axios.get(url + "/eec-api/get-th-tam/" + e).then(r => {
        // console.log(r);
        $("#tam").empty()
        $("#tam").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#tam").append(`<option value="${i.tb_idn}">${i.tam_name}</option>`)
        })
    })
}

let getTamOne = (e) => {
    axios.get(url + "/eec-api/get-th-onetam/" + e).then(r => {
        r.data.data.map(i => {
            console.log(i);
            $("#pro_name").val(i.pro_name)
            $("#amp_name").val(i.amp_name)
            $("#tam_name").val(i.tam_name)
        })
    })
}


