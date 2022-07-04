let latlng = {
    lat: 13.305567,
    lng: 101.383101
};
let map = L.map("map", {
    center: latlng,
    zoom: 8,
    zoomControl: false
});
// L.control.zoom({
//     position: 'bottomleft'
// }).addTo(map);

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
L.control.zoom({
    position: 'topright'
}).addTo(map);

let d
// const url = "http://localhost:3000";
const url = "https://engrids.soc.cmu.ac.th/api";
var MIcon1 = L.icon({
    iconUrl: './marker/m1.png',
    iconSize: [60, 60],
    iconAnchor: [30, 50],
    popupAnchor: [0, -10]
});
var MIcon2 = L.icon({
    iconUrl: './marker/m2.png',
    iconSize: [60, 60],
    iconAnchor: [30, 50],
    popupAnchor: [0, -10]
});
var MIcon3 = L.icon({
    iconUrl: './marker/m3.png',
    iconSize: [60, 60],
    iconAnchor: [30, 50],
    popupAnchor: [0, -10]
});
var MIcon4 = L.icon({
    iconUrl: './marker/m4.png',
    iconSize: [60, 60],
    iconAnchor: [30, 50],
    popupAnchor: [0, -10]
});
var MIcon5 = L.icon({
    iconUrl: './marker/m5.png',
    iconSize: [60, 60],
    iconAnchor: [30, 50],
    popupAnchor: [0, -10]
});

function customTip() {
    // console.log(this.pm._layers[0].options.st_name)
    let txt = `<strong class="kanit">${this.pm._layers[0].options.st_name}</strong>`
    this.unbindTooltip();
    if (!this.isPopupOpen()) this.bindTooltip(txt, {
        // permanent: true,
        direction: 'top',
        offset: [0, -30]

    }).openTooltip();
}

let TType
let getdata = (id) => {
    TType = "T00"
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });

    axios.get(url + `/form_travel/getgeom`).then(async (r) => {
        d = r.data.data;
        console.log(d)

        var mm, ms
        ms = L.layerGroup()
        d.map(i => {
            console.log(i.typess)
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
                if (i.typess == 'ท่องเที่ยวเชิงเกษตร') {
                    mm = L.geoJson(json, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, { name: "marker", icon: MIcon1, st_name: i.st_name });
                        }, data: { st_name: i.st_name, typess: i.typess }
                    })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    // .addTo(map)
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยวเพื่อการเรียนรู้') {
                    mm = L.geoJson(json, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, { name: "marker", icon: MIcon2, st_name: i.st_name });
                        }, data: { st_name: i.st_name, typess: i.typess }
                    })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    // .addTo(map)
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยวเชิงนิเวศ') {
                    mm = L.geoJson(json, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, { name: "marker", icon: MIcon3, st_name: i.st_name });
                        }, data: { st_name: i.st_name, typess: i.typess }
                    })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    // .addTo(map)
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยวเชิงศาสนา') {
                    mm = L.geoJson(json, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, { name: "marker", icon: MIcon4, st_name: i.st_name });
                        }, data: { st_name: i.st_name, typess: i.typess }
                    })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    // .addTo(map)
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยววิถีชุมชน') {
                    mm = L.geoJson(json, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, { name: "marker", icon: MIcon5, st_name: i.st_name });
                        }, data: { st_name: i.st_name, typess: i.typess }
                    })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    // .addTo(map)
                    ms.addLayer(mm);
                } else {
                    mm = L.geoJson(json, {
                        name: "marker", st_name: i.st_name
                    })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    // .addTo(map)
                    ms.addLayer(mm);
                }
            } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
                // console.log(i.lat, i.lng)
                if (i.typess == 'ท่องเที่ยวเชิงเกษตร') {
                    mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon1, st_name: i.st_name })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยวเพื่อการเรียนรู้') {
                    mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon2, st_name: i.st_name })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยวเชิงนิเวศ') {
                    mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon3, st_name: i.st_name })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยวเชิงศาสนา') {
                    mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon4, st_name: i.st_name })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    ms.addLayer(mm);
                } else if (i.typess == 'ท่องเที่ยววิถีชุมชน') {
                    mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon5, st_name: i.st_name })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    ms.addLayer(mm);
                } else {
                    mm = L.marker([i.lat, i.lng], { name: "marker", st_name: i.st_name })
                        .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                        .on('mouseover', customTip);
                    ms.addLayer(mm);
                }
            }
        });
        ms.addTo(map)
    })
}
let getdata1 = (id) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });
    axios.get(url + `/form_travel/getgeom`).then(async (r) => {
        let d = r.data.data;
        let df = d.filter(e => e.typess == "ท่องเที่ยวเชิงเกษตร")
        var mm, ms
        ms = L.layerGroup()
        df.map(i => {
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon1, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
                // console.log(i.lat, i.lng)
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon1, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                ms.addLayer(mm);// 
            }
        });
        ms.addTo(map)
    })
}
let getdata2 = (id) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });
    axios.get(url + `/form_travel/getgeom`).then(async (r) => {
        let d = r.data.data;
        let df = d.filter(e => e.typess == "ท่องเที่ยวเพื่อการเรียนรู้")
        var mm, ms
        ms = L.layerGroup()
        df.map(i => {
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon2, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
                // console.log(i.lat, i.lng)
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon2, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                ms.addLayer(mm);// 
            }
        });
        ms.addTo(map)
    })
}
let getdata3 = (id) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });
    axios.get(url + `/form_travel/getgeom`).then(async (r) => {
        let d = r.data.data;
        let df = d.filter(e => e.typess == "ท่องเที่ยวเชิงนิเวศ")
        var mm, ms
        ms = L.layerGroup()
        df.map(i => {
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon3, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
                // console.log(i.lat, i.lng)
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon3, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                ms.addLayer(mm);// 
            }
        });
        ms.addTo(map)
    })
}
let getdata4 = (id) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });
    axios.get(url + `/form_travel/getgeom`).then(async (r) => {
        let d = r.data.data;
        let df = d.filter(e => e.typess == "ท่องเที่ยวเชิงศาสนา")
        var mm, ms
        ms = L.layerGroup()
        df.map(i => {
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon4, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
                // console.log(i.lat, i.lng)
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon4, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                ms.addLayer(mm);// 
            }
        });
        ms.addTo(map)
    })
}
let getdata5 = (id) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });
    axios.get(url + `/form_travel/getgeom`).then(async (r) => {
        let d = r.data.data;
        let df = d.filter(e => e.typess == "ท่องเที่ยววิถีชุมชน")
        var mm, ms
        ms = L.layerGroup()
        df.map(i => {
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon5, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
                // console.log(i.lat, i.lng)
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon5, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                ms.addLayer(mm);// 
            }
        });
        ms.addTo(map)
    })
}
let getdata6 = (id) => {
    var Marker = {
        name: "marker",
        radius: 8,
        fillColor: 'green',
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    axios.get(url + `/form_travel/getgeom`).then(async (r) => {
        let d = r.data.data;
        console.log(d)
        var mm, ms
        ms = L.layerGroup()
        d.map(i => {
            if (i.geojson) {
                let json = JSON.parse(i.geojson);
                // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng, Marker, { st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
                // console.log(i.lat, i.lng)
                mm = L.circleMarker([i.lat, i.lng], Marker, { st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
                    .on('mouseover', customTip);
                ms.addLayer(mm);// 
            }
        });
        ms.addTo(map)
    })
}
// getdata6()

let getpro = () => {
    axios.get(url + `/th/province`).then(async (r) => {
        var d = r.data.data;
        $('#pro').empty().append(`<option value="TH">เลือกจังหวัด</option>`)
        d.map(i => {
            $('#pro').append(`<option value="${i.pv_code}">${i.pv_tn}</option>`)
        })
    })
}

let table
$(document).ready(function () {
    $.extend(true, $.fn.dataTable.defaults, {
        "language": {
            "sProcessing": "กำลังดำเนินการ...",
            "sLengthMenu": "แสดง_MENU_ แถว",
            "sZeroRecords": "ไม่พบข้อมูล",
            "sInfo": "แสดง _START_ ถึง _END_ จาก _TOTAL_ แถว",
            "sInfoEmpty": "แสดง 0 ถึง 0 จาก 0 แถว",
            "sInfoFiltered": "(กรองข้อมูล _MAX_ ทุกแถว)",
            "sInfoPostFix": "",
            "sSearch": "ค้นหา:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "เริ่มต้น",
                "sPrevious": "ก่อนหน้า",
                "sNext": "ถัดไป",
                "sLast": "สุดท้าย"
            }
        }
    });
    table = $('#myTable').DataTable({
        ajax: {
            type: "get",
            url: url + `/form_travel/getgeom`,
            dataSrc: 'data',
        },
        columns: [
            { data: 'datetimes', },
            { data: 'st_name' },
            {
                data: 'typess',
            },
            { data: 'prov_tn' },
            { data: 'amp_tn' },
            { data: 'tam_tn' },
            { data: 'id_user' },
        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 3, 4, 5, 6] },
            {
                targets: 0, "width": "16%", render: function (data) {
                    return moment(data).locale('th').format('DD-MM-YYYY');
                },
            }
        ],
        dom: 'Bfrtip',
        buttons: [
            'print', 'excel'
        ],
        pageLength: 6
    });

    table.on('search.dt', function async() {
        let data = table.rows({ search: 'applied' }).data()
        getMap(data)
        score_all(data)
    });
})
let lc_gps
let onLocationFound = (e) => {
    // console.log(e)
    lc_gps = e.latlng;
    var radius = e.accuracy;
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
}
function changeLatlng(latlng) {
    console.log(latlng)
}
map.on("locationfound", onLocationFound);
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

var lc = L.control.locate({
    position: 'topright',
    strings: {
        title: "ตำแหน่ง"
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

let videoSrc
let getMap = (x) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });
    // lc.start();
    // console.log(lc_gps)

    let number = 0
    var mm, ms
    ms = L.layerGroup()
    x.map(i => {
        number += 1

        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
            // console.log(i.url_yt)
            let point
            let yt
            if (i.url_yt !== null) {
                let link_yt = i.url_yt
                let se = link_yt.search(/www.youtube.com/i);
                let se2 = link_yt.search(/youtu.be/i);
                // console.log(se)
                if (se > -1) {
                    let uyt = link_yt.split("https://www.youtube.com/watch?v=");
                    yt = "https://www.youtube.com/embed/" + uyt[1]
                } else {
                    if (se2 > -1) {
                        let uyt = link_yt.split("https://youtu.be/");
                        yt = "https://www.youtube.com/embed/" + uyt[1]
                    }
                }
            } else { yt = 'https://www.youtube.com/embed/' }


            if (i.typess == 'ท่องเที่ยวเชิงเกษตร') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        point = latlng
                        return L.marker(latlng, { name: "marker", icon: MIcon1, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>
            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
            </ol>
            <div class="carousel-inner" style="width:250px; height:250px;">
              <div class="carousel-item active">
              <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
            <span class="carousel-control-Next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a></div>
            <div class="d-flex justify-content-center mt-1">
            <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${point.lat},${point.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
            <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${i.url_yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยวเพื่อการเรียนรู้') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        point = latlng
                        return L.marker(latlng, { name: "marker", icon: MIcon2, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
            </ol>
            <div class="carousel-inner" style="width:250px; height:250px;">
              <div class="carousel-item active">
              <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a></div>
            <div class="d-flex justify-content-center mt-1">
            <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${point.lat},${point.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
            <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยวเชิงนิเวศ') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        point = latlng
                        return L.marker(latlng, { name: "marker", icon: MIcon3, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
            </ol>
            <div class="carousel-inner" style="width:250px; height:250px;">
              <div class="carousel-item active">
              <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a></div>
            <div class="d-flex justify-content-center mt-1">
            <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${point.lat},${point.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
            <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยวเชิงศาสนา') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        point = latlng
                        return L.marker(latlng, { name: "marker", icon: MIcon4, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
            </ol>
            <div class="carousel-inner" style="width:250px; height:250px;">
              <div class="carousel-item active">
              <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a></div>
            <div class="d-flex justify-content-center mt-1">
            <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${point.lat},${point.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
            <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยววิถีชุมชน') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        point = latlng
                        return L.marker(latlng, { name: "marker", icon: MIcon5, st_name: i.st_name });
                    }
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
            </ol>
            <div class="carousel-inner" style="width:250px; height:250px;">
              <div class="carousel-item active">
              <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a></div>
            <div class="d-flex justify-content-center mt-1">
            <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${point.lat},${point.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
            <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            } else {
                mm = L.geoJson(json, {
                    name: "marker", st_name: i.st_name
                })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
              <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
            </ol>
            <div class="carousel-inner" style="width:250px; height:250px;">
              <div class="carousel-item active">
              <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a></div>
            <div class="d-flex justify-content-center mt-1">
            <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${i.lat},${i.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
            <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                // .addTo(map)
                ms.addLayer(mm);
            }
        } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
            // console.log(i.lat, i.lng)
            let yt
            if (i.url_yt !== null) {
                let link_yt = i.url_yt
                let se = link_yt.search(/www.youtube.com/i);
                let se2 = link_yt.search(/youtu.be/i);
                // console.log(se)
                if (se > -1) {
                    let uyt = link_yt.split("https://www.youtube.com/watch?v=");
                    yt = "https://www.youtube.com/embed/" + uyt[1]
                } else {
                    if (se2 > -1) {
                        let uyt = link_yt.split("https://youtu.be/");
                        yt = "https://www.youtube.com/embed/" + uyt[1]
                    }
                }
            } else { yt = 'https://www.youtube.com/embed/' }

            if (i.typess == 'ท่องเที่ยวเชิงเกษตร') {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon1, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
        <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
        </ol>
        <div class="carousel-inner" style="width:250px; height:250px;">
          <div class="carousel-item active">
          <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a></div>
        <div class="d-flex justify-content-center mt-1">
        <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${i.lat},${i.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
        <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยวเพื่อการเรียนรู้') {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon2, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
        <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
        </ol>
        <div class="carousel-inner" style="width:250px; height:250px;">
          <div class="carousel-item active">
          <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a></div>
        <div class="d-flex justify-content-center mt-1">
        <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${i.lat},${i.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
        <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยวเชิงนิเวศ') {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon3, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
        <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
        </ol>
        <div class="carousel-inner" style="width:250px; height:250px;">
          <div class="carousel-item active">
          <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a></div>
        <div class="d-flex justify-content-center mt-1">
        <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${i.lat},${i.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
        <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยวเชิงศาสนา') {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon4, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
        <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
        </ol>
        <div class="carousel-inner" style="width:250px; height:250px;">
          <div class="carousel-item active">
          <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a></div>
        <div class="d-flex justify-content-center mt-1">
        <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${i.lat},${i.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
        <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                ms.addLayer(mm);
            } else if (i.typess == 'ท่องเที่ยววิถีชุมชน') {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon5, st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
        <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
        </ol>
        <div class="carousel-inner" style="width:250px; height:250px;">
          <div class="carousel-item active">
          <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a></div>
        <div class="d-flex justify-content-center mt-1">
        <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${i.lat},${i.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
        <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                ms.addLayer(mm);
            } else {
                mm = L.marker([i.lat, i.lng], { name: "marker", st_name: i.st_name })
                    .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
        <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="3"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="4"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="5"></li>
        </ol>
        <div class="carousel-inner" style="width:250px; height:250px;">
          <div class="carousel-item active">
          <img src="${i.img1 !== null ? i.img1 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img2 !== null ? i.img2 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img3 !== null ? i.img3 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img4 !== null ? i.img4 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img5 !== null ? i.img5 : './marker/noimg.png'}"style="width:100%">
          </div>
          <div class="carousel-item">
          <img src="${i.img6 !== null ? i.img6 : './marker/noimg.png'}"style="width:100%">
          </div>
        </div>
        <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a></div>
        <div class="d-flex justify-content-center mt-1">
        <a type="button" class="btn btn-outline-info kanit m-auto" href="https://www.google.co.th/maps/place/${i.lat},${i.lng}" target="_blank" role="button"><i class="bi bi-compass-fill"></i> นำทาง</a>
        <button type="button" class="btn btn-danger kanit m-auto video-btn" data-toggle="modal" data-src="${yt}" data-target="#ModalVDO"><i class="bi bi-play-circle"></i> วิดีโอ</button></div>`).on('click', function (e) {
                        $('.carousel').carousel({
                            interval: 3000
                        })

                        $('.video-btn').click(function () {
                            let $videoSrc = $(this).data("src");
                            videoSrc = $videoSrc
                            modalvideo($videoSrc)
                        });
                    })
                    .on('mouseover', customTip);
                ms.addLayer(mm);
            }
        }
    });
    ms.addTo(map)
    // if (number == x.length) {
    //     lc.stop();

    // }
}
// when the modal is opened autoplay it  
let modalvideo = (p) => {
    // $('#ModalVDO').modal('show');
    $('#ModalVDO').on('shown.bs.modal', function (e) {
        // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
        $("#video").attr('src', p + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        console.log(p + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0")
    })
    $('#ModalVDO').on('hide.bs.modal', function (e) {
        // a poor man's stop video
        $("#video").attr('src', '#');
    })
}
// stop playing the youtube video when I close the modal


let score_all = (data) => {
    let prov_n = $('#pro').children("option:selected").text();
    if (prov_n !== "เลือกจังหวัด") {
        // console.log(prov_n)
    }
    var d = data;
    let t1 = d.filter(e => e.typess == 'ท่องเที่ยวเชิงเกษตร')
    let t2 = d.filter(e => e.typess == 'ท่องเที่ยวเพื่อการเรียนรู้')
    let t3 = d.filter(e => e.typess == 'ท่องเที่ยวเชิงนิเวศ')
    let t4 = d.filter(e => e.typess == 'ท่องเที่ยวเชิงศาสนา')
    let t5 = d.filter(e => e.typess == 'ท่องเที่ยววิถีชุมชน')

    $('#T0_all').text(d.length)
    $('#T1_list').text(t1.length)
    $('#T2_list').text(t2.length)
    $('#T3_list').text(t3.length)
    $('#T4_list').text(t4.length)
    $('#T5_list').text(t5.length)
}

var content_m = L.control({ position: "topleft" });
function opcontent() {
    content_m.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += `<div class="btn-group btn-group-toggle shadow-0" data-toggle="buttons" id="travel">
        <label class="btn btn-secondary active">
          <input type="radio" name="options" value="ทั้งหมด" id="option0" autocomplete="off" checked><span class="kanit"><b>ทั้งหมด</b></span> 
        </label>
        <label class="btn btn-secondary text-center kanit-24" data-tooltip="ท่องเที่ยวเชิงเกษตร" data-tooltip-location="bottom">
          <input type="radio" name="options" value="ท่องเที่ยวเชิงเกษตร" id="option1" autocomplete="off"><i class="fas fa-tractor m-auto" style="font-size: 20px;"></i>
        </label>
        <label class="btn btn-secondary text-center kanit-24" data-tooltip="ท่องเที่ยวเพื่อการเรียนรู้" data-tooltip-location="bottom">
          <input type="radio" name="options" value="ท่องเที่ยวเพื่อการเรียนรู้" id="option2" autocomplete="off"><i class="fas fa-graduation-cap m-auto" style="font-size: 20px;"></i>
        </label>
        <label class="btn btn-secondary text-center kanit-24" data-tooltip="ท่องเที่ยวเชิงนิเวศ" data-tooltip-location="bottom">
          <input type="radio" name="options" value="ท่องเที่ยวเชิงนิเวศ" id="option3" autocomplete="off"><i class="fas fa-tree m-auto" style="font-size: 20px;"></i>
        </label>
        <label class="btn btn-secondary text-center kanit-24" data-tooltip="ท่องเที่ยวเชิงศาสนา" data-tooltip-location="bottom">
          <input type="radio" name="options" value="ท่องเที่ยวเชิงศาสนา" id="option4" autocomplete="off"><i class="fas fa-church m-auto" style="font-size: 20px;"></i>
        </label>
        <label class="btn btn-secondary text-center kanit-24" data-tooltip="ท่องเที่ยววิถีชุมชน" data-tooltip-location="bottom">
          <input type="radio" name="options" value="ท่องเที่ยววิถีชุมชน" id="option4" autocomplete="off"><i class="fas fa-users m-auto" style="font-size: 20px;"></i>
        </label>
     </div>
      
      <div id="search">
      <button class="btn btn-sm" onClick="search()">
        <small class="prompt"><span class="kanit">เลือกข้อมูล</span></small> 
        <i class="bi bi-chevron-compact-down kanit" aria-hidden="true" ></i>
      </button>
      </div>`;
        return div;
    };
    content_m.addTo(map);
}
opcontent()

$('#travel input').on('change', function () {
    let type = $('input[name=options]:checked', '#travel').val()
    let prov_n = $('#pro').children("option:selected").text()
    let amp_n = $('#amp').children("option:selected").text()
    let tam_n = $('#tam').children("option:selected").text()

    if (type !== "ทั้งหมด") {
        if (prov_n !== "เลือกจังหวัด" && amp_n !== "เลือกอำเภอ" && tam_n !== "เลือกตำบล") {
            table.search(`${tam_n} ${type}`).draw();
        } else if (prov_n !== "เลือกจังหวัด" && amp_n !== "เลือกอำเภอ" && tam_n == "เลือกตำบล") {
            table.search(`${amp_n} ${type}`).draw();
        } else if (prov_n !== "เลือกจังหวัด" && amp_n == "เลือกอำเภอ" && tam_n == "เลือกตำบล") {
            table.search(`${prov_n} ${type}`).draw();
        } else {
            table.search(`${type}`).draw();
        }
    } else {
        removeLayer()
        getpro()
        //  $('#pro').empty().append(`<option value="TH">เลือกจังหวัด</option>`);
        $("#amp").empty().append(`<option value="amp">ทุกอำเภอ</option>`);
        $("#tam").empty().append(`<option value="tam">ทุกตำบล</option>`);
        table.search('').draw();
        $('#TT_name').text(``)
    }
    // console.log($('#pro').val());
    // if (type == "ท่องเที่ยวเชิงเกษตร") {        // getdata1()

    // }
    // else if (type == "ท่องเที่ยวเพื่อการเรียนรู้") { getdata2() }
    // else if (type == "ท่องเที่ยวเชิงนิเวศ") { getdata3() }
    // else if (type == "ท่องเที่ยวเชิงศาสนา") { getdata4() }
    // else if (type == "ท่องเที่ยววิถีชุมชน") { getdata4() }
    // else { getdata() }
});

let removeLayer = () => {
    map.eachLayer(i => {
        // console.log(i);
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
function search() {
    $("#search").html(`<div class="kanit p-2">
<div class="form-group">
<div class="row">
<div class="col-3">
    <label for="sel1" class="ml-2">จังหวัด:</label>
    </div><div class="col">
    <select class="form-control" id="pro">
        <option value="TH">เลือกจังหวัด</option>
    </select>
</div></div>
</div>
<div class="form-group">
<div class="row">
<div class="col-3">
    <label for="sel1" class="ml-2">อำเภอ:</label>
    </div><div class="col">
    <select class="form-control" id="amp">
        <option value="amp">เลือกอำเภอ</option>
    </select>
</div></div>
</div>
<div class="form-group">
<div class="row">
<div class="col-3">
    <label for="sel1" class="ml-2">ตำบล:</label>
    </div><div class="col">
    <select class="form-control" id="tam">
        <option value="tam">เลือกตำบล</option>
    </select>
    </div></div>
</div>
<button type="button" class="btn btn-light w-100 h-100" data-mdb-color="dark" onClick="hidesearch()">
<i class="bi bi-chevron-compact-up" style="margin-left: 50%;"></i>
</button>
    </div>`)
    getpro()

    $('#pro').on('change', function () {
        var code = $('#pro').val()
        // console.log(code)
        axios.post(url + `/th/amphoe`, { pv_code: code }).then(async (r) => {
            var d = r.data.data;
            $("#amp").empty().append(`<option value="amp">ทุกอำเภอ</option>`);;
            $("#tam").empty().append(`<option value="tam">ทุกตำบล</option>`);;
            d.map(i => {
                $('#amp').append(`<option value="${i.ap_idn}">${i.ap_tn}</option>`)
            })
            // amp_n = d[0].ap_tn
            // amp_c = d[0].ap_idn
        })
        let prov_n = $('#pro').children("option:selected").text()
        // table.search(prov_n).draw();
        // console.log(prov_n)
        $('#TT_name').text(`แหล่งท่องเที่ยวจังหวัด${prov_n}`)

        let prov_c = $('#pro').children("option:selected").val()

        let type = $('input[name=options]:checked', '#travel').val()
        // console.log(type)
        if (type !== "ทั้งหมด") {
            if (prov_n !== 'เลือกจังหวัด') {
                table.search(`${prov_n} ${type}`).draw();
            } else {
                table.search(`${type}`).draw();
            }
        } else {
            if (prov_n !== 'เลือกจังหวัด') {
                table.search(`${prov_n}`).draw();
            } else {
                table.search(``).draw();
            }
        }

        removeLayer();
        axios.get(`${url}/eec-api/get-bound/pro/${code}`).then(async (r) => {
            let geojson = await JSON.parse(r.data.data[0].geom);
            // console.log(geojson);
            let a = L.geoJSON(geojson, {
                style: boundStyle,
                name: "bnd"
            }).addTo(map);
            map.fitBounds(a.getBounds());
        })

    })
    $('#amp').on('change', function () {
        var code = $('#amp').val()

        console.log(code)
        // var url = "http://localhost:3000";
        axios.post(url + `/th/tambon`, { ap_idn: code }).then(async (r) => {
            var d = r.data.data;
            $("#tam").empty().append(`<option value="tam">ทุกตำบล</option>`);
            d.map(i => {
                $('#tam').append(`<option value="${i.tb_idn}">${i.tb_tn}</option>`)
            })
            // tam_n = d[0].tb_tn
            // tam_c = d[0].tb_idn
        })
        let prov_n = $('#pro').children("option:selected").text()
        let prov_c = $('#pro').val();
        let amp_n = $('#amp').children("option:selected").text()
        let amp_c = $('#amp').children("option:selected").val()
        let type = $('input[name=options]:checked', '#travel').val()


        if (type !== "ทั้งหมด") {
            if (amp_n !== "ทุกอำเภอ") {
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n}`)
                table.search(`${amp_n} ${type}`).draw();
            } else {
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n}`)
                table.search(`${prov_n} ${type}`).draw();
                removeLayer();
                axios.get(`${url}/eec-api/get-bound/pro/${prov_c}`).then(async (r) => {
                    let geojson = await JSON.parse(r.data.data[0].geom);
                    // console.log(geojson);
                    let a = L.geoJSON(geojson, {
                        style: boundStyle,
                        name: "bnd"
                    }).addTo(map);
                    map.fitBounds(a.getBounds());
                })
            }
        } else {
            if (amp_n !== "ทุกอำเภอ") {
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n}`)
                table.search(`${prov_n} ${amp_n}`).draw();
            } else {
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n}`)
                table.search(`${prov_n}`).draw();
                removeLayer();
                axios.get(`${url}/eec-api/get-bound/pro/${prov_c}`).then(async (r) => {
                    let geojson = await JSON.parse(r.data.data[0].geom);
                    // console.log(geojson);
                    let a = L.geoJSON(geojson, {
                        style: boundStyle,
                        name: "bnd"
                    }).addTo(map);
                    map.fitBounds(a.getBounds());
                })
            }
        }

        removeLayer();
        axios.get(`${url}/eec-api/get-bound/amp/${code}`).then(async (r) => {
            let geojson = await JSON.parse(r.data.data[0].geom);
            // console.log(geojson);
            let a = L.geoJSON(geojson, {
                style: boundStyle,
                name: "bnd"
            }).addTo(map);
            map.fitBounds(a.getBounds());
        })
    })
    $('#tam').on('change', function () {
        let prov_n = $('#pro').children("option:selected").text()
        let amp_n = $('#amp').children("option:selected").text()
        let amp_c = $('#amp').val();
        let tam_n = $('#tam').children("option:selected").text()
        let tam_c = $('#tam').children("option:selected").val()
        let type = $('input[name=options]:checked', '#travel').val()


        if (type !== "ทั้งหมด") {
            if (tam_n !== "ทุกตำบล") {
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n} ต.${tam_n}`)
                table.search(`${tam_n} ${type}`).draw();
            } else {
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n}`)
                table.search(`${amp_n} ${type}`).draw();
                removeLayer();
                axios.get(`${url}/eec-api/get-bound/amp/${amp_c}`).then(async (r) => {
                    let geojson = await JSON.parse(r.data.data[0].geom);
                    // console.log(geojson);
                    let a = L.geoJSON(geojson, {
                        style: boundStyle,
                        name: "bnd"
                    }).addTo(map);
                    map.fitBounds(a.getBounds());
                })
            }
        } else {
            if (tam_n !== "ทุกตำบล") {
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n} ต.${tam_n}`)
                table.search(`${prov_n} ${amp_n} ${tam_n}`).draw();
            } else {
                table.search(`${prov_n} ${amp_n}`).draw();
                $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n}`)
                removeLayer();
                axios.get(`${url}/eec-api/get-bound/amp/${amp_c}`).then(async (r) => {
                    let geojson = await JSON.parse(r.data.data[0].geom);
                    // console.log(geojson);
                    let a = L.geoJSON(geojson, {
                        style: boundStyle,
                        name: "bnd"
                    }).addTo(map);
                    map.fitBounds(a.getBounds());
                })
            }
        }

        removeLayer();
        axios.get(`${url}/eec-api/get-bound/tam/${this.value}`).then(async (r) => {
            let geojson = await JSON.parse(r.data.data[0].geom);
            // console.log(geojson);
            let a = L.geoJSON(geojson, {
                style: boundStyle,
                name: "bnd"
            }).addTo(map);
            map.fitBounds(a.getBounds());
        })
    })
}

function hidesearch() {
    $("#search").html(
        `<button class="btn btn-sm" onClick="search()">
        <small class="prompt"><span class="kanit">เลือกข้อมูล</span></small> 
        <i class="bi bi-chevron-compact-down" aria-hidden="true" ></i>
    </button>`);
}


var content_2 = L.control({ position: "bottomleft" });
function addmanage() {
    content_2.onAdd = function (map) {
        var div = L.DomUtil.create('div')
        div.innerHTML += ` <nav class="nav-menu2" style="max-width: 100%; width: fit-content;">
        <ul>
            <li ><a href="./../input/index.html" id="add"><i
                        class="fas fa-plus"></i><span class="kanit" >เพิ่มข้อมูล</span></a></li>
            <li><a href="./../report/index.html" id="manage"><i class="fas fa-bars"></i>
                    <span class="kanit">จัดการข้อมูล</span></a>
        </ul>
    </nav>`;
        return div;
    };
    content_2.addTo(map);
}
addmanage()

var legend = L.control({ position: "bottomright" });
function showLegend() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += `<button class="btn btn-sm" onClick="hideLegend()">
      <span class="kanit">ซ่อนสัญลักษณ์</span><i class="fa fa-angle-double-down" aria-hidden="true"></i>
    </button><br>`;
        div.innerHTML += '<i style="background: #FFFFFF; border-style: solid; border-width: 3px;"></i><span>ขอบเขตจังหวัด</span><br>';
        div.innerHTML += '<i style="background: #FFFFFF; border-style: solid; border-width: 1.5px;"></i><span>ขอบเขตอำเภอ</span><br>';
        div.innerHTML += '<i style="background: #FFFFFF; border-style: dotted; border-width: 1.5px;"></i><span>ขอบเขตตำบล</span><br>';
        div.innerHTML += '<img src="./marker/m1.png"  height="30px"><span>ท่องเที่ยวเชิงเกษตร</span><br>';
        div.innerHTML += '<img src="./marker/m2.png"  height="30px"><span>ท่องเที่ยวเพื่อการเรียนรู้</span><br>';
        div.innerHTML += '<img src="./marker/m3.png"  height="30px"><span>ท่องเที่ยวเชิงนิเวศ</span><br>';
        div.innerHTML += '<img src="./marker/m4.png"  height="30px"><span>ท่องเที่ยวเชิงศาสนา</span><br>';
        div.innerHTML += '<img src="./marker/m5.png"  height="30px"><span>ท่องเที่ยววิถีชุมชน</span><br>';
        return div;
    };
    legend.addTo(map);
}

function hideLegend() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += `<button class="btn btn-sm" onClick="showLegend()">
        <small class="prompt"><span class="kanit">แสดงสัญลักษณ์</span></small> 
        <i class="fa fa-angle-double-up" aria-hidden="true"></i>
    </button>`;
        return div;
    };
    legend.addTo(map);
}

hideLegend()

var boundStyle = {
    "color": "#ff7800",
    "fillColor": "#fffcf5",
    "weight": 5,
    "opacity": 0.45,
    "fillOpacity": 0.25
};
let remove_Lbng = () => {
    map.eachLayer(i => {
        // console.log(i);
        i.options.name == "bnd" ? map.removeLayer(i) : null;
    })
}
let zoomExtent = (lyr, code) => {
    remove_Lbng()
    var url = "https://engrids.soc.cmu.ac.th/api";
    axios.get(`${url}/eec-api/get-bound/${lyr}/${code}`).then(async (r) => {
        let geojson = await JSON.parse(r.data.data[0].geom);
        // console.log(geojson);
        let a = L.geoJSON(geojson, {
            style: boundStyle,
            name: "bnd"
        }).addTo(map);
        map.fitBounds(a.getBounds());
    })
}

$("#listpro").hide();
$("#selectpro").click(function () {
    $("#listpro").animate({
        width: "toggle"
    });
    zoomCenter();
});
let zoomCenter = () => {
    remove_Lbng()
    map.setView(new L.LatLng(13.196768, 101.364720), 8);
}