
let green_gid = sessionStorage.getItem('green_gid');
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
    drawPolygon: false,
    drawRectangle: false,
    drawCircleMarker: false,
    cutPolygon: false,
    removalMode: false
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

axios.post(url + "/green-api/getgeojson", { gid: green_gid }).then(r => {
    getAmp(r.data.data.features[0].properties.prov_code);
    getTam(r.data.data.features[0].properties.amphoe_idn);
    setTimeout(() => {
        $('#pro').val(r.data.data.features[0].properties.prov_code);
        $('#amp').val(r.data.data.features[0].properties.amphoe_idn);
        $('#tam').val(r.data.data.features[0].properties.tambon_idn);
    }, 1000);

    $('#gr_name').val(r.data.data.features[0].properties.gr_name);
    $('#type').val(r.data.data.features[0].properties.type);
    $('#rai').val(r.data.data.features[0].properties.rai);
    $('#tree').val(r.data.data.features[0].properties.tree);
    $('#agency').val(r.data.data.features[0].properties.agency);

    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };
    // console.log(r.data.data);

    let site = L.geoJSON(r.data.data.features[0].geometry, {
        style: myStyle
    });
    site.addTo(lyrs)

    map.fitBounds(site.getBounds());
})

// map.on('pm:create', e => {
//     geom = e.layer.toGeoJSON()
//     $("#form").show()
// });

lyrs.on('pm:edit', e => {
    geom = e.layer.toGeoJSON()
    console.log(geom);
    // $("#form").show()
})

// document.getElementById('agdate').valueAsDate = new Date();

let sendData = () => {
    // console.log(geom[0]);
    const obj = {
        gid: green_gid,
        data: {
            gr_name: $('#gr_name').val(),
            pro_name: $('#pro_name').val(),
            amp_name: $('#amp_name').val(),
            tam_name: $('#tam_name').val(),
            prov_code: $('#pro').val(),
            amphoe_idn: $('#amp').val(),
            tambon_idn: $('#tam').val(),
            type: $('#type').val(),
            rai: $('#rai').val(),
            tree: $('#tree').val(),
            agency: $('#agency').val(),
            // img: dataurl ? dataurl : dataurl = "",
            geom: geom == "" ? "" : geom
        }
    }

    axios.post(url + "/green-api/update", obj).then((r) => {
        r.data.data == "success" ? $("#okmodal").modal("show") : null
    })
    return false;
}

let gotoList = () => {
    location.href = "./../list/index.html";
}

let refreshPage = () => {
    location.reload(true);
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


