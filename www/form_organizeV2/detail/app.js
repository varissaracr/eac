let orgid = sessionStorage.getItem('orgid');

// let orgid = '1624609741123'
console.log(orgid)

let latlng = {
    lat: 16.820378,
    lng: 100.265787
}

// const url = 'http://localhost:3700';
const url = "https://engrids.soc.cmu.ac.th/api";
let userid;
let dataurl;
let geom;
// let gps1;

const map = L.map('map', {
    center: latlng,
    zoom: 13
});

const mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
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

const pro = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true
});
var baseMap = {
    "Mapbox": mapbox.addTo(map),
    "google Hybrid": ghyb
}
var overlayMap = {
    "ขอบเขตจังหวัด": pro
}
L.control.layers(baseMap, overlayMap, { collapsed: false, }).addTo(map);

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

let loadheadamp = (e) => {
    // console.log(e);
    axios.get(url + "/eec-api/get-th-amp/" + e).then(r => {
        $("#headamp").empty()
        $("#headtam").empty()
        $("#headamp").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#headamp").append(`<option value="${i.ap_idn}">${i.amp_name}</option>`)
        })
    })
}

let loadheadtam = (e) => {
    axios.get(url + "/eec-api/get-th-tam/" + e).then(r => {
        // console.log(r);
        $("#headtam").empty()
        $("#headtam").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#headtam").append(`<option value="${i.tb_idn}">${i.tam_name}</option>`)
        })
    })
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
            // console.log(i);
            $("#pro_name").val(i.pro_name)
            $("#amp_name").val(i.amp_name)
            $("#tam_name").val(i.tam_name)
        })
    })
}

let loadData = (orgid) => {
    axios.post(url + "/org-api/getone", { orgid: orgid }).then(async r => {
        // console.log(r);

        loadheadamp(r.data.data[0].headpro)
        loadheadtam(r.data.data[0].headamp)

        getAmp(r.data.data[0].orgpro);
        getTam(r.data.data[0].orgamp);

        setTimeout(async () => {
            $('#pro').val(r.data.data[0].orgpro);
            $('#amp').val(r.data.data[0].orgamp);
            $('#tam').val(r.data.data[0].orgtam);
            getTamOne($('#tam').val());
        }, 1500)

        setTimeout(() => {
            r.data.data.map(i => {
                // console.log(i)
                $('#orgid').val(i.orgid)
                $('#orgname').val(i.orgname)
                $('#orgcontact').val(i.orgcontact)
                $('#orgtel').val(i.orgtel)
                $('#orgemail').val(i.orgemail)
                $('#orgline').val(i.orgline)
                $('#orgfacebook').val(i.orgfacebook)
                $('#website').val(i.website)
                $('#headname').val(i.headname)
                $('#headvno').val(i.headvno)
                $('#headvmoo').val(i.headvmoo)
                $('#headvname').val(i.headvname)

                $('#headpro').val(i.headpro)
                $('#headamp').val(i.headamp)
                $('#headtam').val(i.headtam)
                $('#orgvno').val(i.orgvno)
                $('#orgvmoo').val(i.orgvmoo)
                $('#orgvname').val(i.orgvname)
                // $('#orgpro').val(i.orgpro)
                // $('#orgamp').val(i.orgamp)
                // $('#orgtam').val(i.orgtam)
                $('#lat').val(i.lat)
                $('#lon').val(i.lon)
                i.typ_organic !== null ? $("#typ_organic").prop('checked', true) : null;
                i.typ_commutrav !== null ? $("#typ_commutrav").prop('checked', true) : null;
                i.typ_commucomfort !== null ? $("#typ_commucomfort").prop('checked', true) : null;
                i.typ_commulearn !== null ? $("#typ_commulearn").prop('checked', true) : null;
                i.typ_commuecon !== null ? $("#typ_commuecon").prop('checked', true) : null;
                i.typ_commuforest !== null ? $("#typ_commuforest").prop('checked', true) : null;
                i.typ_houseforest !== null ? $("#typ_houseforest").prop('checked', true) : null;
                i.typ_mangforest !== null ? $("#typ_mangforest").prop('checked', true) : null;
                i.typ_watmanage !== null ? $("#typ_watmanage").prop('checked', true) : null;
                i.typ_landmange !== null ? $("#typ_landmange").prop('checked', true) : null;
                i.typ_fishing !== null ? $("#typ_fishing").prop('checked', true) : null;
                i.typ_industwaste !== null ? $("#typ_industwaste").prop('checked', true) : null;
                i.typ_housewaste !== null ? $("#typ_housewaste").prop('checked', true) : null;
                i.typ_airpollution !== null ? $("#typ_airpollution").prop('checked', true) : null;
                i.typ_noisepollution !== null ? $("#typ_noisepollution").prop('checked', true) : null;
                i.typ_other !== null ? $("#typ_other").prop('checked', true) : null;

                i.typ_eastorganize !== null ? $("#typ_eastorganize").prop('checked', true) : null;
                i.typ_impactedcommu !== null ? $("#typ_impactedcommu").prop('checked', true) : null;
                i.typ_orgniccommu !== null ? $("#typ_orgniccommu").prop('checked', true) : null;
                i.typ_famforestcommu !== null ? $("#typ_famforestcommu").prop('checked', true) : null;
                i.typ_eastfisher !== null ? $("#typ_eastfisher").prop('checked', true) : null;
                i.typ_learnningnet !== null ? $("#typ_learnningnet").prop('checked', true) : null;
                i.typ_travelcommu !== null ? $("#typ_travelcommu").prop('checked', true) : null;
                i.typ_eastwater !== null ? $("#typ_eastwater").prop('checked', true) : null;
                i.typ_eastlabour !== null ? $("#typ_eastlabour").prop('checked', true) : null;
                i.typ_eastwaste !== null ? $("#typ_eastwaste").prop('checked', true) : null;
                i.typ_newgen !== null ? $("#typ_newgen").prop('checked', true) : null;
                i.typ_ecobase !== null ? $("#typ_ecobase").prop('checked', true) : null;
                i.typ_eastfarmer !== null ? $("#typ_eastfarmer").prop('checked', true) : null;

                $('#orgtypeother').val(i.orgtypeother)
                $('#orgstatus').val(i.orgstatus)
                $('#orgtarget').val(i.orgtarget)
                $('#orgwork').val(i.orgwork)
                $('#orgoutput').val(i.orgoutput)
                $('#orgreportor').val(i.orgreportor)
                // img: dataurl ? dataurl : dataurl = "",
                // geom: geom == "" ? "" : geom.toGeoJSON()

                $("#preview").attr("src", i.img);

                geom = L.marker([Number(i.lat), Number(i.lon)], { name: 'p' }).addTo(map)
                map.setView([Number(i.lat), Number(i.lon)], 13)
            })
        }, 2000)
    })
}
loadData(orgid);

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

let sendData = () => {
    // console.log(geom.toGeoJSON());
    const obj = {
        orgid: $('#orgid').val(),
        data: {
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
            typ_noisepollution: $("#typ_noisepollution").is(":checked") ? $("#typ_noisepollution").val() : '',

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
    axios.post(url + "/org-api/update", obj).then((r) => {
        r.data.data == "success" ? $("#okmodal").modal("show") : null
    })
    return false;
}

let gotoList = () => {
    location.href = "./../report/index.html";
}

let refreshPage = () => {
    location.reload(true);
}








