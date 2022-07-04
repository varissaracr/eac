const url = "https://engrids.soc.cmu.ac.th/api";
// const url = 'http://localhost:3700';
const eacGeoserver = "https://engrids.soc.cmu.ac.th/geoserver";
const eecGeoserverWMS = "https://engrids.soc.cmu.ac.th/geoserver/eac/wms?";

let latlng = {
    lat: 13.205567,
    lng: 101.783101
};

let map = L.map('map', {
    center: latlng,
    zoom: 8
});

const mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    name: "base",
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    zIndex: 0

});

const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
    name: "base",
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    zIndex: 0
});

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    name: "base",
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    lyr: 'basemap',
    zIndex: 0
});

const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    name: "base",
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    lyr: 'basemap',
    zIndex: 0
});

const CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    name: "base",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    lyr: 'basemap',
    zIndex: 0
});

const tam = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:tam_eac",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2
});
const amp = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:amp_eac",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2,
    maxZoom: 12
});

const pro = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:prov_eac",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2,
    maxZoom: 10
});

const lu = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:lu_eac_61",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2
});
const mainbasin = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:mainbasin_eac",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2
});

const subbasin = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:subbasin_eac",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2
});

const c_forest_bl = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:comforest_plot_bl",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2
});

const plot_banamp = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:plot_banamp_cbi",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const point_banamp = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:point_banamp_cbi",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const plot_khaodin = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:plot_khaodin",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const point_khaodin = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:point_khaodin",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const draftlink_ne_e = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:draftlink_ne_e",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const comforest_eac = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:commuforest_eac",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const ff_conser = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:familyforest_conser",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const banna_plants = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:bannaeisan_plants",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const conser_area = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:conser_area",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const driving_commu = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:driving_commu",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const commu_learning = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:commu_learning",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const commu_touri = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:commu_touri",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const food_cco = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:foodsafety_cco",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const food_pcb = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:foodsafety_pcb",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const food_ryg = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:foodsafety_ryg",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const familyforest = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:familyforest",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const media = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:media",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const k_wtn_pb = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:k_wtn_pb",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const plot_wtn_reserv = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:plot_wtn_reserv",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const boun_kho15 = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:boun_kho15",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});


const eec_promote24 = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:eec_promote24",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const military = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:military_area",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const tobe_promote = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:tobe_promote",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const outside_area = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:outside_area",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const special_act = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:special_act_promote",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const l_special_act = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:l_special_act_promote",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const an_promote = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:an_promote",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const boun_tam_wsb = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:boun_tam_wsb",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const household = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:household",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});


const pressure = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:pressure",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const oldperson = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:oldperson",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const house_vill_m10 = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:houses_vill_m10",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const health_vol5 = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:villhealth_volun5",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const health_vol7 = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:villhealth_volun7",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const health_vol10 = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:villhealth_volun10",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const diabetes = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:diabetes",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const diab_press = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:diab_press",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true, zIndex: 2
});

const reserv_wtn = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:reserv_wtn",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2
});

const organization = L.tileLayer.wms(eacGeoserver + "/eac/wms?", {
    layers: "eac:organization",
    name: "lyr",
    iswms: "wms",
    format: "image/png",
    transparent: true,
    zIndex: 2
});


function onLocationFound(e) {
    // latLng = e.latlng;
    // nearData(e)
}

map.on("locationfound", onLocationFound);
// map.on("locationerror", onLocationError);
map.locate({ setView: true, maxZoom: 19 });

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: ""
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

lc.start();

let lyr = {
    // ghyb: ghyb.addTo(map),
    // CartoDB_Positron: CartoDB_Positron,
    // grod: grod,
    lu: lu,
    mainbasin: mainbasin,
    subbasin: subbasin,
    c_forest_bl: c_forest_bl,
    plot_banamp: plot_banamp,
    point_banamp: point_banamp,
    plot_khaodin: plot_khaodin,
    point_khaodin: point_khaodin,
    draftlink_ne_e: draftlink_ne_e,
    comforest_eac: comforest_eac,
    ff_conser: ff_conser,
    banna_plants: banna_plants,
    conser_area: conser_area,
    driving_commu: driving_commu,
    commu_learning: commu_learning,
    commu_touri: commu_touri,
    food_cco: food_cco,
    food_pcb: food_pcb,
    food_ryg: food_ryg,
    familyforest: familyforest,
    media: media,
    k_wtn_pb: k_wtn_pb,
    plot_wtn_reserv: plot_wtn_reserv,
    boun_kho15: boun_kho15,
    eec_promote24: eec_promote24,
    military: military,
    tobe_promote: tobe_promote,
    outside_area: outside_area,
    special_act: special_act,
    l_special_act: l_special_act,
    an_promote: an_promote,
    boun_tam_wsb: boun_tam_wsb,
    household: household,
    pressure: pressure,
    oldperson: oldperson,
    house_vill_m10: house_vill_m10,
    health_vol5: health_vol5,
    health_vol7: health_vol7,
    health_vol10: health_vol10,
    diabetes: diabetes,
    diab_press: diab_press,
    reserv_wtn: reserv_wtn,
    organization: organization,
    tam: tam,
    amp: amp,
    pro: pro.addTo(map),
}

let base = {
    ghyb: ghyb.addTo(map),
    CartoDB_Positron: CartoDB_Positron,
    grod: grod,

}

// L.control.layers(baseMap, overlayMap).addTo(map);
let refreshPage = () => {
    location.href = "./../report/index.html";
    // console.log("ok");
}

let getDetail = (e) => {
    sessionStorage.setItem('orgid', e);
    location.href = "./../detail/index.html";
}


let hpData = axios.get("https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/SouthEast_Asia/c56f7d70bc06160e3c443a592fd9c87e/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_snpp_24hrs&STARTINDEX=0&COUNT=5000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=geojson");
let onEachFeatureHotspot = (feature, layer) => {
    if (feature.properties) {
        layer.bindPopup(
            `<span class="kanit"><b>ตำแหน่งจุดความร้อน</b>
            <br/>ข้อมูลจาก VIIRS
            <br/>ตำแหน่งที่พบ : ${feature.properties.latitude}, ${feature.properties.longitude} 
            <br/>ค่า Brightness temperature: ${feature.properties.brightness} Kelvin
            <br/>วันที่: ${feature.properties.acq_datetime} UTC`
        );
    }
}

let loadHotspot = async () => {
    let hp = await hpData;
    // console.log(hp);
    const fs = hp.data.features;

    var geojsonMarkerOptions = {
        radius: 6,
        fillColor: "#ff5100",
        color: "#a60b00",
        weight: 0,
        opacity: 1,
        fillOpacity: 0.8
    };

    await L.geoJSON(fs, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        },
        name: "lyr",
        onEachFeature: onEachFeatureHotspot
    }).addTo(map);
}

let responseAll = axios.get(url + '/eec-api/get-aqi-all');
let loadAqi = async () => {
    let iconblue = L.icon({
        iconUrl: './marker/location-pin-blue.svg',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let icongreen = L.icon({
        iconUrl: './marker/location-pin-green.svg',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconyellow = L.icon({
        iconUrl: './marker/location-pin-yellow.svg',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconorange = L.icon({
        iconUrl: './marker/location-pin-orange.svg',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconred = L.icon({
        iconUrl: './marker/location-pin-red.svg',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let x = await responseAll;
    x.data.data.map(i => {

        let dat = {
            sta_id: i.sta_id,
            sta_th: i.sta_th,
            area_th: i.area_th,
            aqi: i.aqi,
            co: i.co,
            no2: i.no2,
            o3: i.o3,
            pm10: i.pm10,
            pm25: i.pm25,
            so2: i.so2
        }
        let marker
        if (Number(i.aqi) <= 25) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconblue,
                name: 'lyr',
                data: dat
            });
        } else if (Number(i.aqi) <= 50) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: icongreen,
                name: 'lyr',
                data: dat
            });
        } else if (Number(i.aqi) <= 100) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconyellow,
                name: 'lyr',
                data: dat
            });
        } else if (Number(i.aqi) <= 200) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconorange,
                name: 'lyr',
                data: dat
            });
        } else {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconred,
                name: 'lyr',
                data: dat
            });
        }

        marker.addTo(map)
        marker.bindPopup(`รหัส : ${i.sta_id}<br> 
            ชื่อสถานี : ${i.sta_th} <br> 
            ค่า AQI : ${Number(i.aqi).toFixed(1)}<br> 
            ค่า PM10 : ${Number(i.pm10).toFixed(1)} µg./m<sup>3</sup><br> 
            ค่า PM2.5 : ${Number(i.pm25).toFixed(1)} µg./m<sup>3</sup><br> 
            ค่า CO : ${Number(i.co).toFixed(1)} ppm<br>
            ค่า NO<sub>2</sub> : ${Number(i.no2).toFixed(1)} ppm<br> 
            ค่า SO<sub>2</sub> : ${Number(i.so2).toFixed(1)} ppm<br> 
            ค่า O<sub>3</sub> : ${Number(i.o3).toFixed(1)} ppm<br> `
        )
    })
}

let responseWeather = axios.get(url + '/eec-api/get-weather-3hr-all');
let loadMeteo = async () => {
    let iconblue = L.icon({
        iconUrl: './marker-meteo/location-pin-blue.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let icongreen = L.icon({
        iconUrl: './marker-meteo/location-pin-green.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconyellow = L.icon({
        iconUrl: './marker-meteo/location-pin-yellow.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconorange = L.icon({
        iconUrl: './marker-meteo/location-pin-orange.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconred = L.icon({
        iconUrl: './marker-meteo/location-pin-red.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let x = await responseWeather;
    x.data.data.map(i => {
        // console.log(i);
        let dat = {
            sta_th: i.sta_th,
            rain24hr: i.rain24hr,
            air_temp: i.air_temp,
            rh: i.rh,
            msl_pressure: i.msl_pressure,
            windspeed: i.windspeed
        }
        let marker
        if (Number(i.rainfall) <= 25) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconblue,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        } else if (Number(i.rainfall) <= 50) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: icongreen,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        } else if (Number(i.rainfall) <= 100) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconyellow,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        } else if (Number(i.rainfall) <= 200) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconorange,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        } else {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconred,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        }
        marker.addTo(map)
        marker.bindPopup(`รหัส : ${i.sta_num}<br> 
            ชื่อสถานี : ${i.sta_th} <br> 
            ปริมาณน้ำฝนปัจจุบัน : ${Number(i.rainfall).toFixed(1)} mm.<br> 
            ปริมาณน้ำฝน 24 ชม. : ${Number(i.rain24hr).toFixed(1)} mm.<br> 
            ความชื้นสัมพัทธ์ : ${Number(i.rh).toFixed(1)} %.<br> 
            อุณหภูมิ : ${Number(i.air_temp).toFixed(1)} องศาเซลเซียส<br> 
            ความกดอากาศ : ${Number(i.msl_pressure).toFixed(1)} มิลลิบาร์<br> 
            ความเร็วลม : ${Number(i.windspeed).toFixed(1)} กิโลเมตร/ชั่วโมง`
        )
    })
}

const responseGwater = axios.get(url + "/gwater-api/getdata");
// const api_3 = axios.get("https://engrids.soc.cmu.ac.th/api/api/rankWater/");

let onEachFeatureGw = (feature, layer) => {
    // console.log(lyr.properties);
    axios.post(url + "/gwater-api/sensordetail", { station_id: feature.properties.station_id }).then(async (r) => {
        let txt = "";
        await r.data.data.map(i => {
            // console.log(i);
            txt += `<br> <b>ความลึก ${i.depth} เมตร</b> <br>
                ข้อมูลล่าสุด ${i.wl_data_date}<br>
                - ระดับน้ำ: ${i.wl} เมตร<br>
                - การนำไฟฟ้า (ec):  ${i.ec} µs/cm<br>
                - pH: ${i.ph}<br>
                - ความเค็ม:  ${i.sal} ppm<br>
                - ของแข็งที่ละลายในน้ำ (tds):  ${i.tds} mg/L<br>
                - อุณหภูมิ:  ${i.temp} องศาเซลเซียส<br>
            `
        })
        layer.bindPopup(
            `<b>สถานี${feature.properties.station_name} (${feature.properties.station_code} ) </b> <br> 
            ${feature.properties.tambon} ${feature.properties.amphoe} ${feature.properties.province}<br> 
            ${txt}`
        );
    })
}

let loadGw = async () => {
    let x = await responseGwater;
    // console.log(x);
    x.data.data.map(async (i) => {
        // console.log(i);
        var geojsonMarkerOptions = {
            radius: 6,
            fillColor: "#b51ac9",
            color: "#651170",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.5
        };

        let json = {
            type: "Feature",
            properties: {
                station_id: i.station_id,
                station_code: i.station_code,
                station_name: i.station_name,
                tambon: i.tambon,
                amphoe: i.amphoe,
                province: i.province
            },
            geometry: JSON.parse(i.json)
        }

        // console.log(json);
        var marker = await L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            },
            name: "lyr",
            onEachFeature: onEachFeatureGw
        });
        marker.addTo(map);
    });
}

var apiData = {};
var mapFrames = [];
var lastPastFramePosition = -1;
var radarLayers = [];

var optionKind = 'radar'; // can be 'radar' or 'satellite'

var optionTileSize = 256; // can be 256 or 512.
var optionColorScheme = 2; // from 0 to 8. Check the https://rainviewer.com/api/color-schemes.html for additional information
var optionSmoothData = 1; // 0 - not smooth, 1 - smooth
var optionSnowColors = 1; // 0 - do not show snow colors, 1 - show snow colors

var animationPosition = 0;
var animationTimer = false;

var apiRequest = new XMLHttpRequest();
apiRequest.open("GET", "https://api.rainviewer.com/public/weather-maps.json", true);
apiRequest.onload = function (e) {
    // store the API response for re-use purposes in memory
    apiData = JSON.parse(apiRequest.response);
    initialize(apiData, optionKind);
};
apiRequest.send();

function initialize(api, kind) {
    // remove all already added tiled layers
    for (var i in radarLayers) {
        map.removeLayer(radarLayers[i]);
    }
    mapFrames = [];
    radarLayers = [];
    animationPosition = 0;

    if (!api) {
        return;
    }
    if (kind == 'satellite' && api.satellite && api.satellite.infrared) {
        mapFrames = api.satellite.infrared;

        lastPastFramePosition = api.satellite.infrared.length - 1;
        showFrame(lastPastFramePosition);
    }
    else if (api.radar && api.radar.past) {
        mapFrames = api.radar.past;
        if (api.radar.nowcast) {
            mapFrames = mapFrames.concat(api.radar.nowcast);
        }
        lastPastFramePosition = api.radar.past.length - 1;
        showFrame(lastPastFramePosition);
    }
}

function addLayer(frame) {
    if (!radarLayers[frame.path]) {
        var colorScheme = optionKind == 'satellite' ? 0 : optionColorScheme;
        var smooth = optionKind == 'satellite' ? 0 : optionSmoothData;
        var snow = optionKind == 'satellite' ? 0 : optionSnowColors;

        radarLayers[frame.path] = new L.TileLayer(apiData.host + frame.path + '/' + optionTileSize + '/{z}/{x}/{y}/' + colorScheme + '/' + smooth + '_' + snow + '.png', {
            tileSize: 256,
            opacity: 0.001,
            zIndex: frame.time,
            name: "lyr"
        });
    }

    if (!map.hasLayer(radarLayers[frame.path])) {
        map.addLayer(radarLayers[frame.path]);
    }
}

function changeRadarPosition(position, preloadOnly) {
    while (position >= mapFrames.length) {
        position -= mapFrames.length;
    }
    while (position < 0) {
        position += mapFrames.length;
    }

    var currentFrame = mapFrames[animationPosition];
    var nextFrame = mapFrames[position];

    addLayer(nextFrame);

    if (preloadOnly) {
        return;
    }

    animationPosition = position;

    if (radarLayers[currentFrame.path]) {
        radarLayers[currentFrame.path].setOpacity(0);
    }
    radarLayers[nextFrame.path].setOpacity(100);
}

function showFrame(nextPosition) {
    var preloadingDirection = nextPosition - animationPosition > 0 ? 1 : -1;

    changeRadarPosition(nextPosition);
    changeRadarPosition(nextPosition + preloadingDirection, true);
}

$("input[type=checkbox]").change(async () => {
    await map.eachLayer(i => {
        // console.log(i);
        if (i.options.name == "lyr") {
            map.removeLayer(i)
        }
    })

    let chk = [];
    await $('input[type=checkbox]:checked').each(function () {
        chk.push($(this).val());
    });

    chk.map(i => {
        // console.log(i);
        if (lyr[`${i}`]) {
            lyr[`${i}`].addTo(map);
        }
        if (i == "hotspot") {
            loadHotspot();
        }

        if (i == "aqi") {
            loadAqi();
        }

        if (i == "meteo") {
            loadMeteo();
        }

        if (i == "gwater") {
            loadGw();
        }

        if (i == "radar") {
            initialize(apiData, optionKind);
        }

        if (i == "wtrl") {
            loadWtrl();
        }
        if (i == "Wqua") {
            loadWqua()
        }
    })

    getLayer()

})

$("input[name='basemap']").change(async (r) => {
    await map.eachLayer(i => {
        // console.log(i);
        if (i.options.name == "base") {
            map.removeLayer(i)
        }
    })

    let basemap = $("input[name='basemap']:checked").val();
    base[`${basemap}`].addTo(map);
})


let eacUrl = "https://engrids.soc.cmu.ac.th/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=";
let rtiUrl = "https://rti2dss.com:8443/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=";

$("#luLegend").attr("src", eacUrl + "eac:lu_eac_61");
$("#proLegend").attr("src", eacUrl + "eac:prov_eac");
$("#ampLegend").attr("src", eacUrl + "eac:amp_eac");
$("#tamLegend").attr("src", eacUrl + "eac:tam_eac");
$("#mainbasinLegend").attr("src", eacUrl + "eac:mainbasin_eac");
$("#subbasinLegend").attr("src", eacUrl + "eac:subbasin_eac");

$("#c_forest_blLegend").attr("src", eacUrl + "eac:comforest_plot_bl");
$("#plot_banampLegend").attr("src", eacUrl + "eac:plot_banamp_cbi");
$("#point_banampLegend").attr("src", eacUrl + "eac:point_banamp_cbi");
$("#plot_khaodinLegend").attr("src", eacUrl + "eac:plot_khaodin");
$("#point_khaodinLegend").attr("src", eacUrl + "eac:point_khaodin");
$("#draftlink_ne_eLegend").attr("src", eacUrl + "eac:draftlink_ne_e");
$("#comforest_eacLegend").attr("src", eacUrl + "eac:commuforest_eac");
$("#ff_conserLegend").attr("src", eacUrl + "eac:familyforest_conser");
$("#banna_plantsLegend").attr("src", eacUrl + "eac:bannaeisan_plants");
$("#conser_areaLegend").attr("src", eacUrl + "eac:conser_area");
$("#driving_commuLegend").attr("src", eacUrl + "eac:driving_commu");
$("#commu_learningLegend").attr("src", eacUrl + "eac:commu_learning");
$("#commu_touriLegend").attr("src", eacUrl + "eac:commu_touri");
$("#food_ccoLegend").attr("src", eacUrl + "eac:foodsafety_cco");
$("#food_pcbLegend").attr("src", eacUrl + "eac:foodsafety_pcb");
$("#food_rygLegend").attr("src", eacUrl + "eac:foodsafety_ryg");
$("#familyforestLegend").attr("src", eacUrl + "eac:familyforest");
$("#mediaLegend").attr("src", eacUrl + "eac:media");
$("#k_wtn_pbLegend").attr("src", eacUrl + "eac:k_wtn_pb");
$("#plot_wtn_reservLegend").attr("src", eacUrl + "eac:plot_wtn_reserv");
$("#boun_kho15Legend").attr("src", eacUrl + "eac:boun_kho15");
$("#eec_promote24Legend").attr("src", eacUrl + "eac:eec_promote24");
$("#militaryLegend").attr("src", eacUrl + "eac:military_area");
$("#tobe_promoteLegend").attr("src", eacUrl + "eac:tobe_promote");
$("#outside_areaLegend").attr("src", eacUrl + "eac:outside_area");
$("#special_actLegend").attr("src", eacUrl + "eac:special_act_promote");
$("#l_special_actLegend").attr("src", eacUrl + "eac:l_special_act_promote");
$("#an_promoteLegend").attr("src", eacUrl + "eac:an_promote");
$("#boun_tam_wsbLegend").attr("src", eacUrl + "eac:boun_tam_wsb");
$("#householdLegend").attr("src", eacUrl + "eac:household");
$("#pressureLegend").attr("src", eacUrl + "eac:pressure");
$("#oldpersonLegend").attr("src", eacUrl + "eac:oldperson");
$("#house_vill_m10Legend").attr("src", eacUrl + "eac:houses_vill_m10");
$("#health_vol5Legend").attr("src", eacUrl + "eac:villhealth_volun5");
$("#health_vol7Legend").attr("src", eacUrl + "eac:villhealth_volun7");
$("#health_vol10Legend").attr("src", eacUrl + "eac:villhealth_volun10");
$("#diabetesLegend").attr("src", eacUrl + "eac:diabetes");
$("#diab_pressLegend").attr("src", eacUrl + "eac:diab_press");
$("#reserv_wtnLegend").attr("src", eacUrl + "eac:reserv_wtn");
$("#organizationLegend").attr("src", eacUrl + "eac:organization");

$("#aqiLegend").attr("src", "./marker/location-pin-green.svg");
$("#meteoLegend").attr("src", "./marker-meteo/location-pin-green.svg");

$("#hpLegend").attr("src", "./img/hotspot.png");
$("#gwLegend").attr("src", "./img/gw.png");

$("#radarLegend").attr("src", "./img/radar.png");




let layerModal = () => {
    $('#lyrModal').modal("show")
}

// set default layer
let wmsLyr = [];
let getLayer = () => {
    wmsLyr = [];
    map.eachLayer(i => {
        if (i.options.iswms) {
            wmsLyr.push(i.options.layers)
            // console.log(i);
        }
    })
    // console.log(x);
}


let lyrName = {
    amp_eac: "ขอบเขตอำเภอ",
    prov_eac: "ขอบเขตจังหวัด",
    tam_eac: "ขอบเขตตำบล",
    an_promote: "เขตส่งเสริมที่ประกาศแล้ว",
    bannaeisan_plants: "บ้านนาอีสาน แหล่งพันธุ์กล้าป่า",
    boun_kho15: "แนวเขตเขาสิบห้าชั้น",
    boun_tam_wsb: "ขอบเขตตำบลวังสมบูรณ์ (รายหมู่บ้าน)",
    comforest_plot_bl: "แปลงป่าชุมชนบ้านแลง อ.เมือง จ.ระยอง",
    commu_learning: "พื้นที่การเรียนรู้บนฐานชุมชน",
    commu_touri: "พื้นที่จัดการท่องเที่ยวชุมชน",
    commuforest_eac: "ป่าชุมชน",
    conser_area: "พื้นที่การฟื้นฟูและอนุรักษ์ธรรมชาติ",
    diab_press: "เบาหวานร่วมความดัน",
    diabetes: "เบาหวาน",
    draftlink_ne_e: "ร่างแผนเชื่อมป่าภาคอีสานกับภาคตะวันออก 2564",
    driving_commu: "การขับเคลื่อนชุมชนน่าอยู่",
    eec_promote24: "เขตส่งเสริมอุตสาหกรรม",
    familyforest: "ป่าครอบครัว",
    familyforest_conser: "ป่าครอบครัว",
    foodsafety_cco: "อาหารปลอดภัย จ.ฉะเชิงเทรา",
    foodsafety_pcb: "อาหารปลอดภัย จ.ปราจีนบุรี",
    foodsafety_ryg: "อาหารปลอดภัย จ.ระยอง",
    household: "ครัวเรือน",
    houses_vill_m10: "หลังคาเรือนหมู่ 10",
    k_wtn_pb: "คลอง",
    l_special_act_promote: "เขตส่งเสริมกิจกรรมพิเศษ",
    lu_eac_61: "การใช้ประโยชน์ที่ดิน",
    mainbasin_eac: "ขอบเขตลุ่มน้ำหลัก",
    media: "เรื่องราวจากสื่อ",
    military_area: "พื้นที่ทหาร",
    oldperson: "ผู้สูงอายุ",
    outside_area: "พื้นที่นอกเหนือ",
    plot_banamp_cbi: "แปลงบ้านอำเภอ จ.ชลบุรี",
    plot_khaodin: "แปลงที่ดินเขาดิน",
    plot_wtn_reserv: "แปลงอ่างวังโตนด",
    point_banamp_cbi: "ตำแหน่งบ้านอำเภอ",
    point_khaodin: "ตำแหน่งเขาดิน รักถิ่นเดิม",
    pressure: "ความดัน",
    reserv_wtn: "อ่างวังโตนด",
    special_act_promote: "จุดเขตส่งเสริมกิจกรรมพิเศษ",
    subbasin_eac: "ขอบเขตลุ่มน้ำย่อย",
    tobe_promote: "พื้นที่ที่กำลังจะประกาศเป็นเขตส่งเสริมฯ",
    villhealth_volun5: "อสม.หมู่5",
    villhealth_volun7: "อสม.หมู่7",
    villhealth_volun10: "อสม.หมู่10",
    organization: "เครือข่ายและกลุ่มองค์กร"
}

let fieldInfo = {
    ap_tn: "อำเภอ",
    pv_tn: "จังหวัด",
    tb_tn: "ตำบล",
    name_1: "ชื่อ",
    owner: "เจ้าของ",
    name: "ชื่อ",
    con_tam: "เขตติดต่อ",
    muban: "หมู่บ้าน",
    tambol: "ตำบล",
    amphoe: "อำเภอ",
    changwat: "จังหวัด",
    prov: "จังหวัด",
    descrip: "คำอธิบาย",
    address: "ที่อยู่",
    moo: "หมู่ที่",
    type: "ประเภท",
    plot_name: "ชื่อแปลง",
    ban: "ชื่อหมู่บ้าน",
    tam: "ชื่อตำบล",
    amp: "อำเภอ",
    planting: "พืชที่ปลูก",
    plant_type: "ประเภทพืชที่ปลูก",
    product: "ผลิตภัณฑ์",
    for: "สำหรับ",
    certifier: "ผู้รับรอง",
    animal_typ: "ประเภทสัตว์ที่เลี้ยง",
    tam: "ตำบล",
    lu_des_th: "การใช้ที่ดิน",
    lul1_code: "ประเภทการใช้ที่ดิน",
    mbasin_t: "ชื่อลุ่มน้ำหลัก",
    sb_name_t: "ชื่อลุ่มน้ำย่อย",
    house_no: "บ้านเลขที่",
    status: "สถานะ",
    orgname: "ชื่อเครือข่าย/กลุ่ม",
    headname: "ชื่อผู้นำเครือข่าย/กลุ่ม",
    orgpro: "ที่ตั้งจังหวัดเครือข่าย/กลุ่ม",
    orgamp: "ที่ตั้งอำเภอชื่อเครือข่าย/กลุ่ม",
    orgtam: "ที่ตั้งตำบลชื่อเครือข่าย/กลุ่ม",
}

map.on("click", async (e) => {
    var pnt = await map.latLngToContainerPoint(e.latlng, map.getZoom());
    var size = await map.getSize();
    var bbox = await map.getBounds().toBBoxString();
    // console.log(pnt, size, bbox);
    // console.log(e.latlng)
    $("#showlat").text(e.latlng.lat)
    $("#showlng").text(e.latlng.lng)

    let lyrInfoUrl = eacGeoserver + "/wms?SERVICE=WMS" +
        "&VERSION=1.1.1&REQUEST=GetFeatureInfo" +
        "&QUERY_LAYERS=" + wmsLyr +
        "&LAYERS=" + wmsLyr +
        "&Feature_count=" + wmsLyr.length +
        "&INFO_FORMAT=application/json" +
        "&X=" + Math.round(pnt.x) +
        "&Y=" + Math.round(pnt.y) +
        "&SRS=EPSG:4326" +
        "&WIDTH=" + size.x +
        "&HEIGHT=" + size.y +
        "&BBOX=" + bbox;

    await axios.get(lyrInfoUrl).then(r => {
        if (r.data.features) {
            $("#accordion_info").empty();
            // console.log(r.data.features);
            r.data.features.map(async (i, k) => {
                // console.log(i, k);

                let lname = i.id.split(".")
                // console.log(lname[0]);
                $("#a" + k).empty();

                await $("#accordion_info").append(
                    `<div class="d-flex flex-column card-list">
                        <div id="heading${k}">
                            <h5 class="mb-0">
                            <div style="font-size: 16px; text-align:center;"data-target="#collapse${k}"
                            aria-expanded="true" aria-controls="collapse${k}">
                            <b>${lyrName[lname[0]]}</b>
                        </div>
                            </h5>
                            <div id="collapse${k}" class="collapse show wf" aria-labelledby="heading${k}" data-parent="#accordion">
                                <div class="card-body p-2">
                                    <ul id="a${k}"></ul>
                                </div>
                            </div>
                        </div>
                    </div>`)

                for (const [key, value] of Object.entries(i.properties)) {
                    // console.log(fieldInfo[key]);
                    fieldInfo[key] != undefined ? $("#a" + k).append(`<li><span class="p-2">${fieldInfo[key]}: ${value} </span></li>`) : null;
                }
            })
            // $("#infoModal").modal("show")
        }
    })
})
// pro.addTo(map)

// var baseMaps = {
//     "แผนที่ถนน": grod,
//     "แผนที่ CartoDB": CartoDB_Positron,
//     "Google Hybrid": ghyb.addTo(map),
// };

// var overlayMaps = {
//     // "ขอบเขตจังหวัด": pro.addTo(map),
//     // "ขอบเขตอำเภอ": amp,
//     // "ขอบเขตตำบล": tam,
// };

// // // let lyrs = L.featureGroup().addTo(map)

// var lyrControl = L.control.layers(baseMaps, overlayMaps
//     // collapsed: true
// ).addTo(map);


getLayer()

$('#H1_close').hide()
$('#collapseOne').hide()

function H1_open() {
    $('#H1_close').show()
    $('#H1_op').hide()
    $('#collapseOne').slideDown("slow");

    $('#control').css({ "height": "fit-content" });
}
function H1_close() {
    $('#H1_close').hide()
    $('#H1_op').show()
    $('#collapseOne').slideUp("slow");
}

$('#H2_close').hide()
$('#collapseTwo').hide()

function H2_open() {
    $('#H2_close').show()
    $('#H2_op').hide()

    $('#collapseTwo').slideDown("slow");
    $('#control').css({ "height": "fit-content" });
}
function H2_close() {
    $('#H2_close').hide()
    $('#H2_op').show()

    $('#collapseTwo').slideUp("slow");
}

$('#H3_close').hide()
$('#collapseThree').hide()

function H3_open() {
    $('#H3_close').show()
    $('#H3_op').hide()

    $('#collapseThree').slideDown("slow");
    $('#control').css({ "height": "fit-content" });
}
function H3_close() {
    $('#H3_close').hide()
    $('#H3_op').show()

    $('#collapseThree').slideUp("slow");
}

$('#H4_close').hide()
$('#collapsefour').hide()

function H4_open() {
    $('#H4_close').show()
    $('#H4_op').hide()

    $('#collapsefour').slideDown("slow");
    $('#control').css({ "height": "fit-content" });
}
function H4_close() {
    $('#H4_close').hide()
    $('#H4_op').show()

    $('#collapsefour').slideUp("slow");
}

$('#H5_close').hide()
$('#collapsefive').hide()

function H5_open() {
    $('#H5_close').show()
    $('#H5_op').hide()

    $('#collapsefive').slideDown("slow");
    $('#control').css({ "height": "fit-content" });
}
function H5_close() {
    $('#H5_close').hide()
    $('#H5_op').show()

    $('#collapsefive').slideUp("slow");
}

$('#H6_close').hide()
$('#collapsesix').hide()

function H6_open() {
    $('#H6_close').show()
    $('#H6_op').hide()

    $('#collapsesix').slideDown("slow");
    $('#control').css({ "height": "fit-content" });
}
function H6_close() {
    $('#H6_close').hide()
    $('#H6_op').show()

    $('#collapsesix').slideUp("slow");
}

$(document).ready(function () {
    var height = $("#map").height();
    $('#control').height(height);
    $('[data-toggle="tooltip"]').tooltip({ boundary: 'window' })
    $('#mn_h').hide()
    $('#in_h').hide()
})

$(".basemap-style").on('click', async function () {
    if ($('.basemap-style').hasClass('basemap-style-active')) {
        $(".basemap-style").removeClass("basemap-style-active")
        $(this).toggleClass('basemap-style-active');
    }

    await map.eachLayer(i => {
        // console.log(i);
        if (i.options.name == "base") {
            map.removeLayer(i)
        }
    })
    console.log($(this).attr('value'))
    let basemap = $(this).attr('value')
    base[`${basemap}`].addTo(map);

    // $(this).removeClass("basemap-style").addClass("basemap-style-active");
})

function radarUnit(e, obj) {
    $('#' + obj.id).hide();
    $('#' + e).show();
}
$(".slide-left").click(function () {
    if ($('#tool').hasClass('animate__slideInLeft animate__delay-1s')) {
        $("#tool").removeClass("animate__slideInLeft animate__delay-1s").addClass("animate__slideOutLeft animate__delay-1s")
    }
    // $("#tool").animate({
    //     width: "toggle"
    // });
});
$(".slide-right").click(function () {
    if ($('#tool').hasClass('animate__slideOutLeft animate__delay-1s')) {
        $("#tool").removeClass("animate__slideOutLeft animate__delay-1s").addClass("animate__slideInLeft animate__delay-1s")
    }
    // $("#tool").animate({
    //     width: "toggle"
    // });
});