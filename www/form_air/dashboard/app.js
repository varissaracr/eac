let latlng = {
    lat: 13.196768,
    lng: 101.364720
}
let map = L.map('map', {
    center: latlng,
    zoom: 9,
    zoomControl: false
});

let marker, gps, dataurl;

// const url = 'http://localhost:3700';
const url = "https://engrids.soc.cmu.ac.th/api";
// const url = "https://eec-mis.onep.go.th/api";
var lc
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
    L.control.zoom({ position: 'topright' }).addTo(map);
    lc = L.control.locate({
        position: 'topright',
        strings: {
            title: "ตำแหน่ง"
        },
        locateOptions: {
            enableHighAccuracy: true,
        }
    }).addTo(map);
}


let onLocationFound = (e) => {
    dashAIR(e)
}
let onLocationError = (e) => {
    // console.log(e.message);
}
map.on("locationfound", onLocationFound);


var CarddashAIR = L.control({ position: "topleft" });
let dashAIR = async (e) => {
    // let url = "https://eec-mis.onep.go.th/api";
    let res = await axios.post(url + '/eec-api/get-aqi-near', { geom: e.latlng });
    res !== null ? lc.stop() : null;

    let Iimg = 'cloudy sun'
    let CC = '#08a88a'
    let aqi = Number(res.data.data[0].aqi)
    if (aqi <= 25) {
        Iimg = 'sun blue'
        CC = '#6db4fb'
    } else if (aqi <= 50) {
        Iimg = 'sun green'
        CC = '#64d434'
    } else if (aqi < 100) {
        Iimg = 'sun yellow'
        CC = '#fbdb63'
    } else if (aqi <= 200) {
        Iimg = 'sun orang'
        CC = '#fa924b '
    } else if (aqi > 200) {
        Iimg = 'sun red'
        CC = '#fb5454'
    } else {
        Iimg = 'cloudy sun'
        CC = '#08a88a'
    }

    CarddashAIR.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += `<div class="card-dash2 card-shadow fn-kanit p-2 mb-3" data-aos="flip-left" style="width: 450px;">
        <div class="card p-4">
            <div class="row mb-2">
                <div class="col-7">
                    <span>คุณภาพอากาศปัจจุบัน</span><br>
                    <strong style='font-size:16px;'>${res.data.data[0].sta_th} ${res.data.data[0].area_th}
    จ.เชียงใหม่ เวลา ${res.data.data[0].time_} น.</strong ><br>
                    <strong style='font-size:30px; color: ${CC};'> ${Number(res.data.data[0].aqi)} AQI </strong>
                </div>
                <div class="col-5">
                    <div class="mt-2 text-center">
                        <img src="./../image/${Iimg}.svg" width="140px" alt="cloudy sun">
                    </div>
                </div>
            </div >
            <button class="btn btn-primary" type="button" data-toggle="collapse"
                data-target="#collapseAir" aria-expanded="false" aria-controls="collapseAir">
                เพิ่มเติม
            </button>
            <div class="collapse" id="collapseAir">
                <div class="row mt-4">
                    <div class="col-4">
                        <span>ก๊าซ CO</span><br>
                        <strong style='font-size:20px;'> ${Number(res.data.data[0].aqi)} ppm</strong>
                    </div>
                    <div class="col-4">
                        <span>ค่าฝุ่น PM2.5</span><br>
                        <strong style='font-size:20px;'> ${Number(res.data.data[0].pm25)} µg./m<sup>3</sup></strong>
                    </div>
                    <div class="col-4">
                        <span>ค่าฝุ่น PM10</span><br>
                        <strong style='font-size:20px;'> ${Number(res.data.data[0].pm10)} µg./m<sup>3</sup></strong>
                    </div>
                </div>
            </div>

        </div >
    </div > `;
        return div;
    };
    CarddashAIR.addTo(map);
}

let table
let loadTable = () => {
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
            url: url + "/air-eac/data",
            dataSrc: 'data'
        },
        columns: [
            {
                data: '',
                render: (data, type, row, meta) => {
                    return `${meta.row + 1}`
                }
            },
            { data: 'date_dt' },
            { data: 'tambon' },
            { data: 'amphoe' },
            { data: 'province' },
            { data: 'feeling' },
            {
                // targets: -1,
                data: null,
                defaultContent: `<button type="button" class="btn btn-danger" id="delete">ลบ!</button>`
            }
        ],
        searching: true,
        scrollX: true,
        // pageLength: 5
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 3, 4, 5] },
        ],
        dom: 'Bfrtip',
        buttons: [
            'excel', 'print'
        ],
    });

    table.on('search.dt', function () {
        let data = table.rows({ search: 'applied' }).data()
        $("#siteCnt").text(data.length)
        getMap(data)
        // console.log();
    });
    // columnDefs: [
    //     { className: 'text-center', targets: [0, 1, 3, 4, 5, 6] },
    //     {
    //         targets: 0, "width": "16%", render: function (data) {
    //             return moment(data).locale('th').format('DD-MM-YYYY');
    //         },
    //     }
    // ],
    // dom: 'Bfrtip',
    // buttons: [
    //     'print', 'excel'
    // ],
    // pageLength: 6


    // table.on('search.dt', function async() {
    //     let data = table.rows({ search: 'applied' }).data()
    //     getMap(data)
    //     score_all(data)
    // });
    $('#myTable tbody').on('click', '#getMap', function () {
        var data = table.row($(this).parents('tr')).data();
        zoomPonint(data.st_asgeojson)
    });
    $('#myTable tbody').on('click', '#delete', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data.airid)
        $('#projId').val(data.airid)
        $('#deleteModal').modal('show')
    });
}

$(document).ready(() => {
    loadMap();
    loadTable();
});

let getMap = (x) => {
    // console.log(x);
    map.eachLayer((lyr) => {
        if (lyr.options.name == 'st_asgeojson') {
            map.removeLayer(lyr);
        }
    });
    var style = {
        "color": "#ff7800",
        "weight": 2,
        "opacity": 0.65
    };
    let iconblue = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/725/725107.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let icongreen = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/725/725070.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconyellow = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/725/725085.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconorange = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/725/725099.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconred = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/725/725034.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });
    let iconzero = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/725/725035.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });
    // x.map(i => {
    //     if (i.st_asgeojson) {
    //         // console.log(i.geojson);
    //         let geojson = L.geoJSON(JSON.parse(i.st_asgeojson), {
    //             style: style,
    //             name: "st_asgeojson",
    //             onEachFeature: function (feature, layer) {
    //                 drawnItems.addLayer(layer);
    //             }
    //         })
    //         geojson.addTo(map);
    //     }
    // })

    var d = x;
    let t1 = d.filter(e => e.feeling == 'ดีมาก')
    let t2 = d.filter(e => e.feeling == 'ดี')
    let t3 = d.filter(e => e.feeling == 'ปานกลาง')
    let t4 = d.filter(e => e.feeling == 'แย่')
    let t5 = d.filter(e => e.feeling == 'แย่มาก')

    $('#T0_all').text(d.length)
    $('#T1_list').text(t1.length)
    $('#T2_list').text(t2.length)
    $('#T3_list').text(t3.length)
    $('#T4_list').text(t4.length)
    $('#T5_list').text(t5.length)

    let markers = L.featureGroup();
    x.map(i => {
        let dat = {
            aqi: i.aqi,
            pm10: i.pm10,
            pm25: i.pm25,
            so2: i.so2
        }
        let txtpopup = `<div class="d-flex flex-column w-100">
                        <h6><b>ที่ตั้ง :</b> ต.${i.tambon} อ.${i.amphoe} จ.${i.province}</h6>
                        <h6><b>ผู้แจ้ง :</b> ${i.usrname}</h6>
                        <div class="text-center mt-2 mb-2">
                        <img src="${i.img1 !== "" ? i.img1 : './../image/noimg.png'}" id="preview" width="50%">
                        </div>
                        <h6>บันทึกเมื่อ${i.date_dt}</h6>
                        </div>`
        let marker
        if (i.feeling == "ดีมาก") {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: iconblue,
                name: 'lyr',
                data: dat
            }).bindPopup(txtpopup);
        } else if (i.feeling == "ดี") {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: icongreen,
                name: 'lyr',
                data: dat
            }).bindPopup(txtpopup);
        } else if (i.feeling == "ปานกลาง") {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: iconyellow,
                name: 'lyr',
                data: dat
            }).bindPopup(txtpopup);
        } else if (i.feeling == "แย่") {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: iconorange,
                name: 'lyr',
                data: dat
            }).bindPopup(txtpopup);
        } else if (i.feeling == "แย่มาก") {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: iconred,
                name: 'lyr',
                data: dat
            }).bindPopup(txtpopup);
        } else {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: iconzero,
                name: 'lyr',
                data: dat
            }).bindPopup(txtpopup);
        }
        markers.addLayer(marker);
    })
    var markerCluster = L.markerClusterGroup();
    markerCluster.addLayer(markers);
    map.addLayer(markerCluster);
}

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

let zoomPonint = (geojson, i) => {
    point = L.geoJSON(JSON.parse(geojson), {
        name: 'st_asgeojson'
    })
    map.fitBounds(point.getBounds());
}

let deleteData = () => {
    let airid = $('#projId').val();
    axios.post(url + '/air-eac/delete', { airid: airid }).then(r => {
        // console.log(r.data.data)
        r.data.data == 'success' ? $('#deleteModal').modal('hide') : console.log('False')
        $('#myTable').DataTable().ajax.reload();
    })
}

let gotoAddData = () => {
    localStorage.clear();
    location.href = "./../add/index.html";
}

var explanationAQI = L.control({ position: "bottomright" });
function showexplanation() {
    explanationAQI.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += `<div class="row fn-kanit">
        <div class="col-10 animate__animated animate__fadeOutRight" id="legendAQI">
            <div class="card-legend-aqi text-center">
                <div class="row no-gutters">
                    <div class="col m-auto">
                        คุณภาพอากาศ<br>AQI
                    </div>
                    <div class="col">
                        <div style="background-color: #6db4fb; width: 100%;"> AQI 0-25 </div>
                        <span>คุณภาพอากาศ<br>ดีมาก</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #64d434;"> AQI
                            26-50 </div>
                        <span>คุณภาพอากาศ<br>ดี</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #fbdb63;"> AQI 51-100 </div>
                        <span>คุณภาพอากาศ<br>ปานกลาง</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #fa924b;"> AQI 101-200 </div>
                        <span>เริ่มมีผลกระทบ<br>ต่อสุขภาพ</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #fb5454;"> AQI > 200 </div>
                        <span>มีผลกระทบ<br>ต่อสุขภาพ</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex" style="left: 85%; top:-28%; position: absolute;  cursor: pointer;" id="leAQI">
            <div onClick="hideExplanation()"
                style="width: 75px; height: 75px; border-radius: 50%; background-color: #F4FAFF;  border: 5px solid #08a88a; display: flex; justify-content: center; align-items: center;">
                <strong style="font-size: 24px; color: #08a88a;">AQI</strong>
            </div>
        </div>
    </div>`;
        return div;
    };
    explanationAQI.addTo(map);
}
function hideExplanation() {
    explanationAQI.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += `<div class="row fn-kanit">
        <div class="col-10 animate__animated animate__bounceInRight" id="legendAQI">
            <div class="card-legend-aqi text-center">
                <div class="row no-gutters">
                    <div class="col m-auto">
                        คุณภาพอากาศ<br>AQI
                    </div>
                    <div class="col">
                        <div style="background-color: #6db4fb; width: 100%;"> AQI 0-25 </div>
                        <span>คุณภาพอากาศ<br>ดีมาก</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #64d434;"> AQI
                            26-50 </div>
                        <span>คุณภาพอากาศ<br>ดี</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #fbdb63;"> AQI 51-100 </div>
                        <span>คุณภาพอากาศ<br>ปานกลาง</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #fa924b;"> AQI 101-200 </div>
                        <span>เริ่มมีผลกระทบ<br>ต่อสุขภาพ</span>
                    </div>
                    <div class="col">
                        <div class="w-100" style="background-color: #fb5454;"> AQI > 200 </div>
                        <span>มีผลกระทบ<br>ต่อสุขภาพ</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex" style="left: 85%; top:-28%; position: absolute;  cursor: pointer;" id="leAQI">
            <div onClick="showexplanation()"
                style="width: 75px; height: 75px; border-radius: 50%; background-color: #08a88a; display: flex; justify-content: center; align-items: center;">
                <strong style="font-size: 24px; color: #F4FAFF;">AQI</strong>
            </div>
        </div>
    </div>`;
        return div;
    };
    explanationAQI.addTo(map);

}
hideExplanation()