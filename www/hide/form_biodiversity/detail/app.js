
let proj_id = sessionStorage.getItem('notice_gid');
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

// let lyrs = L.featureGroup().addTo(map)

var baseMap = {
    "Mapbox": mapbox.addTo(map),
    "google Hybrid": ghyb
}

var overlayMap = {
    "ขอบจังหวัด": pro
}

L.control.layers(baseMap, overlayMap).addTo(map);

let geom = "";
let dataurl = "";

map.on('click', (e) => {
    if (geom) {
        map.removeLayer(geom);
    }

    geom = L.marker(e.latlng, {
        draggable: false,
        name: 'p'
    }).addTo(map);

    $("#lat").val(e.latlng.lat)
    $("#lon").val(e.latlng.lng)
});

axios.post(url + "/biodiversity-api/getdataone", { proj_id: proj_id }).then(r => {
    // console.log(r);
    getAmp(r.data.data[0].pro);
    getTam(r.data.data[0].amp);
    setTimeout(() => {
        $('#pro').val(r.data.data[0].pro);
        $('#amp').val(r.data.data[0].amp);
        $('#tam').val(r.data.data[0].tam);
    }, 1000);

    $('#bioname').val(r.data.data[0].bioname);
    $('#biodetail').val(r.data.data[0].biodetail);
    $('#bioplace').val(r.data.data[0].bioplace);
    $('#biotype').val(r.data.data[0].biotype);
    $('#lat').val(r.data.data[0].lat);
    $('#lon').val(r.data.data[0].lon);
    $("#preview").attr("src", r.data.data[0].img);
    $('#reporter').val(r.data.data[0].reporter);

    let json = JSON.parse(r.data.data[0].geojson);
    // console.log(json);
    geom = L.geoJSON(json, {
        name: "p"
    }).addTo(map)

    map.setView([Number(r.data.data[0].lat), Number(r.data.data[0].lon)], 12);
})


let sendData = () => {
    // console.log(geom[0]);
    const obj = {
        proj_id: proj_id,
        data: {
            noticename: $('#noticename').val(),
            noticedetail: $('#noticedetail').val(),
            noticeplace: $('#noticeplace').val(),
            pro: $('#pro').val(),
            amp: $('#amp').val(),
            tam: $('#tam').val(),
            pro_name: $('#pro_name').val(),
            amp_name: $('#amp_name').val(),
            tam_name: $('#tam_name').val(),
            lat: $('#lat').val(),
            lon: $('#lon').val(),
            reporter: $('#reporter').val(),
            // img: dataurl ? dataurl : dataurl = "",
            geom: geom == "" ? "" : geom.toGeoJSON()
        }
    }
    console.log(obj);
    axios.post(url + "/biodiversity-api/update", obj).then((r) => {
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


