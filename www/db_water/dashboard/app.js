const url = "https://engrids.soc.cmu.ac.th/api";
let latlng = {
    lat: 13.3234652,
    lng: 101.7580673
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
    maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const amp = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:amp_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 14,
    // minZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:prov_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const w_reserve_63 = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eec/wms?", {
    layers: "eec:a__54_9w_reserve_63",
    format: "image/png",
    transparent: true,
    maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const main_river_rid9 = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eec/wms?", {
    layers: "eec:a__54_main_river_rid9",
    format: "image/png",
    transparent: true,
    maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

var baseMaps = {
    "Mapbox": mapbox.addTo(map),
    "Google Hybrid": ghyb
};

const overlayMaps = {
    "ขอบเขตจังหวัด": pro.addTo(map),
    "ขอบเขตอำเภอ": amp,
    "ขอบเขตตำบล": tam,
    "แม่น้ำสายหลัก": main_river_rid9,
    "อ่างเก็บน้ำ": w_reserve_63.addTo(map)
};

const lyrControl = L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
}).addTo(map);

var legend = L.control({ position: "bottomleft" });
function showLegend() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += `<button class="btn btn-sm" onClick="hideLegend()">
      <span class="kanit">ซ่อนสัญลักษณ์</span><i class="fa fa-angle-double-down" aria-hidden="true"></i>
    </button><br>`;
        div.innerHTML += '<i style="background: #FFFFFF; border-style: solid; border-width: 3px;"></i><span>ขอบเขตจังหวัด</span><br>';
        div.innerHTML += '<i style="background: #FFFFFF; border-style: solid; border-width: 1.5px;"></i><span>ขอบเขตอำเภอ</span><br>';
        div.innerHTML += '<i style="background: #FFFFFF; border-style: dotted; border-width: 1.5px;"></i><span>ขอบเขตตำบล</span><br>';
        div.innerHTML += '<i style="background: #1EB0E7; border-radius: 10%;"></i><span>อ่างเก็บน้ำ</span><br>';
        div.innerHTML += '<img src="./marker/mainriver.png" width="10px"><span>แม่น้ำสายหลัก</span><br>';
        div.innerHTML += '<img src="./marker/water.png" width="20px"><span>จุดรายงานสถานการณ์น้ำผิวดิน</span><br>';
        div.innerHTML += '<img src="./marker/wl-01.png" width="20px"><span>จุดตรวจวัดระดับน้ำผิวดินอัตโนมัติ</span><br>';
        div.innerHTML += '<img src="./marker/wq-01.png" width="20px"><span>จุดตรวจวัดคุณภาพน้ำอัตโนมัติ</span><br>';
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
 
let getDetail = (e) => {
    sessionStorage.setItem('orgid', e);
    location.href = "./../detail/index.html";
}

let loadWtrl = async () => {
    let iconblue = L.icon({
        iconUrl: './marker/wl-01.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let sta = [
        {
            staname: "station_01",
            latlon: [12.8661616, 100.9989804],
            measure: 275.5
        }, {
            staname: "station_02",
            latlon: [12.848099999999983, 100.95313000000002],
            measure: 244
        }, {
            staname: "station_03",
            latlon: [12.846510200000028, 100.9376361],
            measure: 298
        }, {
            staname: "station_04",
            latlon: [12.694406999999996, 101.44470699999997],
            measure: 294
        }, {
            staname: "station_05",
            latlon: [12.703484000000008, 101.468717],
            measure: 280
        }, {
            staname: "station_06",
            latlon: [12.70139960000001, 101.49543049999],
            measure: 435
        }, {
            staname: "station_07",
            latlon: [12.985111299999994, 101.6776677],
            measure: 380.6
        }, {
            staname: "station_08",
            latlon: [12.909515899999995, 101.71460159999998],
            measure: 512
        }, {
            staname: "station_09",
            latlon: [12.836749900000017, 101.73254899999998],
            measure: 550.5
        }]

    var markergroup = L.layerGroup([]);
    sta.map(async (i) => {
        let resSt01 = axios.post('https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php', { stname: i.staname, limit: 1 });
        resSt01.then(r => {
            var n = r.data.data.length - 1
            let d = r.data.data[n];
            // console.log(d)
            let num = i.measure - Number(d.dept);
            let a = num.toFixed(1)
            // console.log(a)

            let marker = L.marker(i.latlon, {
                icon: iconblue,
                name: 'lyr',
                // data: dat
            });
            // marker.addTo(map)
            marker.bindPopup(`<div style="font-family:'Kanit'; font-size: 14px;"> 
            <b> จุดตรวจวัดระดับน้ำผิวดินอัตโนมัติ </b> <br>
            <b> ชื่อสถานี : </b> ${i.staname} <br>
            <b> ระดับน้ำ : </b>${a < 1 ? 0 : a} cm.<br>
            <b> อุณหภูมิ :</b> ${Number(d.temp).toFixed(1)} องศาเซลเซียส<br>
            <b> ความชื้นสัมพัทธ์ :</b> ${Number(d.humi).toFixed(1)} %.<br>
            </div>`
            )
            markergroup.addLayer(marker)
            // console.log(d)
        })
    })
    markergroup.addTo(map)
    lyrControl.addOverlay(markergroup, "จุดตรวจวัดระดับน้ำผิวดินอัตโนมัติ");
}


let loadWtrl2 = async () => {
    let sta = [
        {
            staname: "station_01",
            latlon: [13.691624, 101.442835]

        }, {
            staname: "station_02",
            latlon: [13.0465397, 100.9197114]
        }, {
            staname: "station_03",
            latlon: [12.8291659, 101.3244348]
        }]
    let sum_data = []
    sta.map(async (i) => {
        let dat_ec = axios.post('https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php', { param: "ec", sort: "DESC", stname: i.staname, limit: 1 });
        dat_ec.then(r => {
            let A1 = r.data.data;

            let dat_ph = axios.post('https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php', { param: "ph", sort: "DESC", stname: i.staname, limit: 1 });
            dat_ph.then(r => {
                let B1 = r.data.data;

                let dat_do = axios.post('https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php', { param: "do", sort: "DESC", stname: i.staname, limit: 1 });
                dat_do.then(r => {
                    let C1 = r.data.data;

                    let dat_tmp = axios.post('https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php', { param: "tmp", sort: "DESC", stname: i.staname, limit: 1 });
                    dat_tmp.then(r => {
                        let D1 = r.data.data;
                        sum_data.push({ staname: i.staname, latlon: i.latlon, ec: Number(A1[0].val), ec_time: A1[0].t, ph: Number(B1[0].val), ph_time: B1[0].t, do: Number(C1[0].val), do_time: C1[0].t, tmp: Number(D1[0].val), tmp_time: D1[0].t, tmp: Number(D1[0].val), tmp_time: D1[0].t });

                        if (sum_data.length == '3') {
                            createmarker(sum_data)
                        }
                    })
                })
            })
        })
    })

}
let createmarker = (e) => {
    var sta = e
    let iconblue = L.icon({
        iconUrl: './marker/wq-01.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    var markergroup = L.layerGroup([]);
    sta.map(async (i) => {
        let marker = L.marker(i.latlon, {
            icon: iconblue,
            name: 'marker',
            // data: dat
        });
        // console.log(i.staname)
        marker.addTo(map)
        marker.bindPopup(`<div style="font-family:'Kanit'; font-size: 14px;"> 
        <b> จุดตรวจวัดคุณภาพน้ำอัตโนมัติ </b> <br>
        <b> ชื่อสถานี :</b> ${i.staname} <br>
        <b> ค่าการนำไฟฟ้า (EC) :</b> ${Number(i.ec).toFixed(1)} mS/cm <br>
        <b> ค่าออกซิเจนละลายน้ำ (DO)</b> : ${Number(i.do).toFixed(1)} mg/L <br>
        <b> อุณหภูมิ (tmp) :</b> ${Number(i.tmp).toFixed(1)} องศาเซลเซียส<br>
        <b> ค่าความเป็นกรด-ด่าง (pH) :</b> ${Number(i.ph).toFixed(1)} <br>
                        </div>`
        )
        markergroup.addLayer(marker)
    })
    markergroup.addTo(map)
    lyrControl.addOverlay(markergroup, "จุดตรวจวัดคุณภาพน้ำอัตโนมัติ");

}


let getpro = () => {
    // const url = "https://eec-onep.online:3700";
    // var url = "http://localhost:3000";
    axios.get(url + `/th/province`).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#pro').append(`<option value="${i.pv_code}">${i.pv_tn}</option>`)
        })
    })
}
getpro()
let prov_n = "", prov_c = "", amp_n = "", amp_c = "", tam_n = "", tam_c = "";
$('#pro').on('change', function () {
    var code = $('#pro').val()
    // console.log(code)
    // var url = "http://localhost:3000";
    axios.post(url + `/th/amphoe`, { pv_code: code }).then(async (r) => {
        var d = r.data.data;
        $("#amp").empty().append(`<option value="amp">ทุกอำเภอ</option>`);;
        $("#tam").empty().append(`<option value="tam">ทุกตำบล</option>`);;
        d.map(i => {
            $('#amp').append(`<option value="${i.ap_idn}">${i.ap_tn}</option>`)
        })
        amp_n = d[0].ap_tn
        amp_c = d[0].ap_idn
    })
    prov_n = $('#pro').children("option:selected").text()
    prov_c = $('#pro').children("option:selected").val()
    if (prov_c == "TH") {
        table.search('').draw();
        $('#num_list_name').html(`ทุกจังหวัด`);
        $('#Allchart').slideUp("slow");
    } else {
        table.search(prov_n).draw();
        $('#num_list_name').html(`ของ จ.${prov_n}`);
        $('#Allchart').slideDown();
    }
    // getchart_v2()
})
$('#amp').on('change', function () {
    var code = $('#amp').val()
    // console.log(code)
    // var url = "http://localhost:3000";
    axios.post(url + `/th/tambon`, { ap_idn: code }).then(async (r) => {
        var d = r.data.data;
        $("#tam").empty().append(`<option value="tam">ทุกตำบล</option>`);
        d.map(i => {
            $('#tam').append(`<option value="${i.tb_idn}">${i.tb_tn}</option>`)
        })
        tam_n = d[0].tb_tn
        tam_c = d[0].tb_idn
    })
    amp_n = $('#amp').children("option:selected").text()
    amp_c = $('#amp').children("option:selected").val()
    if (amp_c !== "amp") {
        table.search(amp_n).draw();
        $('#num_list_name').html(`ของ อ.${amp_n}`);
    } else {
        table.search(prov_n).draw();
        $('#num_list_name').html(`ของ จ.${prov_n}`);
    }
    // getchart_v2()
})
$('#tam').on('change', function () {
    tam_n = $('#tam').children("option:selected").text()
    tam_c = $('#tam').children("option:selected").val()
    if (tam_c !== "tam") {
        table.search(tam_n).draw();
        $('#num_list_name').html(`ของ ต.${tam_n}`);
    } else {
        table.search(amp_n).draw();
        $('#num_list_name').html(`ของ อ.${amp_n}`);
    }
    // getchart_v2()
})
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
            },
            "emptyTable": "ไม่พบข้อมูล..."
        }
    });
    table = $('#myTable').DataTable({
        ajax: {
            type: "get",
            url: "https://engrids.soc.cmu.ac.th/api" + `/dbwater-eac/getalldata`,
            dataSrc: 'data',
        },
        columns: [
            {
                data: null,
                render: (data, type, row, meta) => {
                    // console.log(meta)
                    return `${meta.row + 1}`
                }
            },
            { data: 'watername' },
            { data: 'wlev1' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `${row.waterpollu1 !== 'ไม่มี' ? row.waterpollu1 + "" : ""}
                    ${row.waterpollu2 !== 'ไม่มี' ? row.waterpollu2 + "" : ""}
                    ${row.waterpollu3 !== 'ไม่มี' ? row.waterpollu3 + "" : ""}
                    ${row.waterpollu4 !== 'ไม่มี' ? row.waterpollu4 + "" : ""}
                    ${row.waterpollu5 !== 'ไม่มี' ? row.waterpollu5 : ""}
                    ${row.waterpollu6 !== 'ไม่มี' ? row.waterpollu6 : ""}
                    ${row.waterpollu7 !== 'ไม่มี' ? row.waterpollu7 : ""}
                    ${row.waterpollu8 !== 'ไม่มี' ? row.waterpollu8 : ""}
                    ${row.waterpollu9 !== 'ไม่มี' ? row.waterpollu9 : ""}
                    ${row.waterpollu10 !== 'ไม่มี' ? row.waterpollu10 : ""}
                    ${row.waterpollu1 == 'ไม่มี' && row.waterpollu2 == 'ไม่มี' && row.waterpollu3 == 'ไม่มี' &&
                            row.waterpollu4 == 'ไม่มี' && row.waterpollu5 == 'ไม่มี'&& row.waterpollu6 == 'ไม่มี'&& row.waterpollu7 == 'ไม่มี'&& row.waterpollu8 == 'ไม่มี'&& row.waterpollu9 == 'ไม่มี'&& row.waterpollu10 == 'ไม่มี' ? '-' : ""}`
                },
            },
            { data: 'prov_tn' },
            { data: 'amp_tn' },
            { data: 'tam_tn' },
            { data: 'record' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    // console.log(row);
                    return `<button class= "btn m btn-loaction" id = "getzoomMap" ><i class="fas fa-map-marker-alt"></i>&nbsp;ตำแหน่ง</button>
                            <button type="button" class="btn btn-warning" onclick="editdata(${row.id_date})"><i class="bi bi-pencil-square"></i>&nbsp;แก้ไขข้อมูล</button>
                            <button class="btn m btn-danger" onclick="confirmDelete(${row.id_date},'${row.watername}','${row.wlev1}','${row.record}')"><i class="bi bi-trash"></i>&nbsp;ลบข้อมูล</button>`
                },
                // width: "30%"
            }

        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 4, 5, 6, 7] },

        ],
        dom: 'Bfrtip',
        buttons: [
            'print', 'excel'
        ],
        pageLength: 6
    });

    table.on('search.dt', function () {
        let data = table.rows({ search: 'applied' }).data()
        // data.map(i => { console.log(i.outputtype) })
        $("#siteCnt").text(data.length)
        getMap(data)
        // setarea(data)
        getmarker(data)
        // console.log();
        zoomMap(data)
    });

    $('#myTable tbody').on('click', '#getzoomMap', function () {
        var data = table.row($(this).parents('tr')).data();
        // console.log(data)
        zoomMap(data)
    });
   

})

let getMap = (x) => {
    $('#num_list').html(x.length)
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

    x.map(i => {
        if (i.geojson) {
            let geojson = L.geoJSON(JSON.parse(i.geojson), {
                style: style,
                name: "st_asgeojson",
                onEachFeature: function (feature, layer) {
                    // drawnItems.addLayer(layer);
                }
            })
            let waterpollu = `${i.waterpollu1 !== 'ไม่มี' ? i.waterpollu1 + "" : ""}
            ${i.waterpollu2 !== 'ไม่มี' ? i.waterpollu2 + "" : ""}
            ${i.waterpollu3 !== 'ไม่มี' ? i.waterpollu3 + "" : ""}
            ${i.waterpollu4 !== 'ไม่มี' ? i.waterpollu4 + "" : ""}
            ${i.waterpollu5 !== 'ไม่มี' ? i.waterpollu5 + "" : ""}
            ${i.waterpollu6 !== 'ไม่มี' ? i.waterpollu6 + "" : ""}
            ${i.waterpollu7 !== 'ไม่มี' ? i.waterpollu7 + "" : ""}
            ${i.waterpollu8 !== 'ไม่มี' ? i.waterpollu8 + "" : ""}
            ${i.waterpollu9 !== 'ไม่มี' ? i.waterpollu9 + "" : ""}
            ${i.elephant10 !== 'ไม่มี' ? i.elephant10 : ""} `
            geojson
                .bindPopup(`< h6 class= "text-center" ><b>ชื่อแหล่งน้ำ</b>: ${i.watername} <br><b>ระดับน้ำ</b> ${i.wlev1} <br><b>สภาพแหล่งน้ำ</b> ${waterpollu} <br><b>ที่ตั้ง</b>: ต.${i.tam_tn} อ.${i.amp_tn} จ.${i.prov_tn} <br>
                        <b>ผู้ให้ข้อมูล</b>: ${i.record} <br></h6> <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
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
              <img src="${i.imgfile1 !== null && a[0].imgfile1 !== "" ? i.imgfile1 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.imgfile2 !== null && a[0].imgfile2 !== "" ? i.imgfile2 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.imgfile3 !== null && a[0].imgfile3 !== "" ? i.imgfile3 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.imgfile4 !== null && a[0].imgfile4 !== "" ? i.imgfile4 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.imgfile5 !== null && a[0].imgfile5 !== "" ? i.imgfile5 : './marker/noimg.png'}"style="width:100%">
              </div>
              <div class="carousel-item">
              <img src="${i.imgfile6 !== null && a[0].imgfile6 !== "" ? i.imgfile6 : './marker/noimg.png'}"style="width:100%">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a></div>`)
                .addTo(map);
        }
    })
}
let zoomMap = (x) => {
    var a = [x];
    let waterpollu = `${a[0].waterpollu1 !== 'ไม่มี' ? a[0].waterpollu1 + "" : ""}
    ${a[0].waterpollu2 !== 'ไม่มี' ? a[0].waterpollu2 + "" : ""}
    ${a[0].waterpollu3 !== 'ไม่มี' ? a[0].waterpollu3 + "" : ""}
    ${a[0].waterpollu4 !== 'ไม่มี' ? a[0].waterpollu4 + "" : ""}
    ${a[0].waterpollu5 !== 'ไม่มี' ? a[0].waterpollu5 + "" : ""}
    ${a[0].waterpollu6 !== 'ไม่มี' ? a[0].waterpollu6 + "" : ""}
    ${a[0].waterpollu7 !== 'ไม่มี' ? a[0].waterpollu7 + "" : ""}
    ${a[0].waterpollu8 !== 'ไม่มี' ? a[0].waterpollu8 + "" : ""}
    ${a[0].waterpollu9 !== 'ไม่มี' ? a[0].waterpollu9 + "" : ""}
    ${a[0].waterpollu10 !== 'ไม่มี' ? a[0].waterpollu10 : ""}`
    var pop
    if (a[0].wlev1) {
        pop = L.popup({ Width: 200, offset: [0, -25] });
        let content = `<h6 class="text-center"><b>ชื่อแหล่งน้ำ</b>: ${a[0].watername} <br><b>ระดับน้ำ</b>: ${a[0].wlev1} <br><b>สภาพแหล่งน้ำ</b>: ${waterpollu} <br><b>ที่ตั้ง</b>: ต.${a[0].tam_tn} อ.${a[0].amp_tn} จ.${a[0].prov_tn} <br>
                                <b>ผู้ให้ข้อมูล</b>: ${a[0].record} <br></h6><div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
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
      <img src=" ${a[0].imgfile1 !== null && a[0].imgfile1 !== "" ? a[0].imgfile1 : './marker/noimg.png'} "style="width:100%">
      </div>
      <div class="carousel-item">
      <img src="${a[0].imgfile2 !== null && a[0].imgfile2 !== "" ? a[0].imgfile2 : './marker/noimg.png'}"style="width:100%">
      </div>
      <div class="carousel-item">
      <img src="${a[0].imgfile3 !== null && a[0].imgfile3 !== "" ? a[0].imgfile3 : './marker/noimg.png'}"style="width:100%">
      </div>
      <div class="carousel-item">
      <img src="${a[0].imgfile4 !== null && a[0].imgfile4 !== "" ? a[0].imgfile4 : './marker/noimg.png'}"style="width:100%">
      </div>
      <div class="carousel-item">
      <img src="${a[0].imgfile5 !== null && a[0].imgfile5 !== "" ? a[0].imgfile5 : './marker/noimg.png'}"style="width:100%">
      </div>
      <div class="carousel-item">
      <img src="${a[0].imgfile6 !== null && a[0].imgfile6 !== "" ? a[0].imgfile6 : './marker/noimg.png'}"style="width:100%">
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a></div>`;
        // console.log(a[0])  
        let setlocation = [];
        if (a[0].geojson) {
            // console.log(a[0].geojson)
            setlocation.push({
                "lat": Number(a[0].lat),
                "lng": Number(a[0].lng),
            })
            pop.setContent(content);
            pop.setLatLng(setlocation[0]);
            pop.openOn(map);
            var zoom = 18
            map.flyTo(setlocation[0], zoom)
            // console.log(setlocation)
        } else if (a[0].lat !== "0" && a[0].lat !== null && a[0].lng !== "0" && a[0].lng !== null) {
            setlocation.push({
                "lat": Number(a[0].lat),
                "lng": Number(a[0].lng),
            })
            pop.setContent(content);
            pop.setLatLng(setlocation[0]);
            pop.openOn(map);
            var zoom = 18
            map.flyTo(setlocation[0], zoom)
            // console.log(setlocation)
        } else {
            $("#projId").val(a[0].id_date)
            $('#warningModal').modal('show')
        }
    }
    // })
}
let getmarker = (d) => {

    var mm, ms
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;

    });
    var MIcon_05 = L.icon({
        iconUrl: './marker/water.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    }); 
    ms = L.layerGroup()
    d.map(i => {
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            // json.properties = {bioname: i.bioname, biodetail: i.biodetail, img: i.img };
            mm = L.geoJson(json, {

                name: "marker", icon: MIcon_05
            })
                .bindPopup(`<h6><b> จุดรายงานสถานการณ์น้ำผิวดิน </b></h6><h6><b>ชื่อแหล่งน้ำ</b>: ${i.watername} </h6> <h6><b>ระดับน้ำ</b>: ${i.wlev1} </h6><br><b>ที่ตั้ง</b>: ต.${i.tam_tn} อ.${i.amp_tn} จ.${i.prov_tn} <br>
                <b>ผู้ให้ข้อมูล</b>: ${a[0].record} <br></h6>`)
            // .addTo(map)
            ms.addLayer(mm);
        } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
            // console.log(i.lat, i.lng)
            mm = L.marker([i.lat, i.lng], { name: "marker" , icon: MIcon_05})
                .bindPopup(`<h6><b> จุดรายงานสถานการณ์น้ำผิวดิน </b></h6> <h6><b>ชื่อแหล่งน้ำ</b>: ${i.watername} </h6> <h6><b>ระดับน้ำ</b>: ${i.wlev1} </h6> <h6><b>จังหวัด :</b> ${i.prov_tn}</h6> <h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            `)
            ms.addLayer(mm);// 
            
            
        }
    });
    ms.addTo(map)
    

}

let param, unit, dat, sta
var ecchart = (sta) => {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("ecchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm:ss";
    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("dd MMMM yyyy");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "yyyy-MM-dd HH:mm:ss";

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "ec", sort: "DESC", stname: sta, limit: 50 }).then((r) => {

        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });

        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "EC (mS/cm)";


        // Create series

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'Ec'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        bullet.circle.stroke = am4core.color("#009900");

        var range = valueAxis.createSeriesRange(series);
        // range.value = 35;
        // range.endValue = 100;
        range.contents.stroke = am4core.color("#ff0000");
        range.contents.fill = range.contents.stroke;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};

var dochart = function (sta, min1, max1, min2, max2) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end


    var chart = am4core.create("dochart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm:ss";
    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("dd MMMM yyyy");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "yyyy-MM-dd HH:mm:ss";

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "do", sort: "DESC", stname: sta, limit: 50 }).then((r) => {
        // console.log(r.data.data)
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });


        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "DO (mg/L)";


        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'Do'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        // bullet.circle.stroke = am4core.color("#00bcd4");
        bullet.adapter.add("stroke", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#ff0000");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#ff0000");
            } return fill;

        })

        var bullet2 = series.bullets.push(new am4charts.Bullet());
        bullet2.tooltipText = `{dateX}: [bold]{valueY.formatNumber('###,###,###.##')} ${unit}[/]`;
        bullet2.adapter.add("fill", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#ff0000");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#ff0000");
            } return fill;
        })


        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        var range = valueAxis.createSeriesRange(series);
        range.value = min1;
        range.endValue = max1;
        range.contents.stroke = am4core.color("#ff0000");
        range.contents.fill = range.contents.stroke;

        var range2 = valueAxis.createSeriesRange(series);
        range2.value = min2;
        range2.endValue = max2;
        range2.contents.stroke = am4core.color("#ff0000");
        range2.contents.fill = range.contents.stroke;


        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};


var tmpchart = function (sta, min1, max1, min2, max2) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end


    var chart = am4core.create("tmpchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm:ss";
    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("dd MMMM yyyy");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "yyyy-MM-dd HH:mm:ss";

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "tmp", sort: "DESC", stname: sta, limit: 50 }).then((r) => {
        // console.log(r.data.data) 
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });

        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "Temp (°C)";


        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'Temp'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        // bullet.circle.stroke = am4core.color("#00bcd4");
        bullet.adapter.add("stroke", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#ff0000");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#ff0000");
            } return fill;

        })

        var bullet2 = series.bullets.push(new am4charts.Bullet());
        bullet2.tooltipText = `{dateX}: [bold]{valueY.formatNumber('###,###,###.##')} ${unit}[/]`;
        bullet2.adapter.add("fill", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#ff0000");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#ff0000");
            } return fill;
        })


        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        var range = valueAxis.createSeriesRange(series);
        range.value = min1;
        range.endValue = max1;
        range.contents.stroke = am4core.color("#ff0000");
        range.contents.fill = range.contents.stroke;

        var range2 = valueAxis.createSeriesRange(series);
        range2.value = min2;
        range2.endValue = max2;
        range2.contents.stroke = am4core.color("#ff0000");
        range2.contents.fill = range.contents.stroke;


        chart.cursor = new am4charts.XYCursor();
        chart.cursor.fullWidthLineX = true;
        chart.cursor.xAxis = dateAxis;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        // Create a horizontal scrollbar with previe and place it underneath the date axis
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};

var phchart = function (sta, min1, max1, min2, max2) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("phchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm:ss";

    var data = [];
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 1
    };
    dateAxis.dateFormats.setKey("dd MMMM yyyy");
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.tooltipDateFormat = "yyyy-MM-dd HH:mm:ss";

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "ph", sort: "DESC", stname: sta, limit: 50 }).then((r) => {
        // console.log(r.data.data) 
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });

        // console.log(data)

        chart.data = data;

        // Create axes

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 30;
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "pH";


        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 10;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#009900");
        series.name = 'pH'

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        // bullet.circle.stroke = am4core.color("#03a9f4");
        bullet.adapter.add("stroke", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#ff0000");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#ff0000");
            } return am4core.color("#009900");

        })

        var bullet2 = series.bullets.push(new am4charts.Bullet());
        bullet2.tooltipText = `{dateX}: [bold]{value.formatNumber('###,###,###.##')} ${unit}[/]`;
        bullet2.adapter.add("fill", function (fill, target) {
            if (target.dataItem.valueY > min2) {
                return am4core.color("#ff0000");
            }
            else if (target.dataItem.valueY < max1) {
                return am4core.color("#ff0000");
            } return am4core.color("#009900");
        })

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        var range = valueAxis.createSeriesRange(series);
        range.value = min1;
        range.endValue = max1;
        range.contents.stroke = am4core.color("#ff0000");
        range.contents.fill = range.contents.stroke;

        var range2 = valueAxis.createSeriesRange(series);
        range2.value = min2;
        range2.endValue = max2;
        range2.contents.stroke = am4core.color("#ff0000");
        range2.contents.fill = range.contents.stroke;

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;
        // // chart.scrollbarY = new am4core.Scrollbar();
        // chart.scrollbarX = new am4core.Scrollbar();

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fill = am4core.color("#000");
        chart.cursor.lineX.fillOpacity = 0.1;

        chart.legend = new am4charts.Legend();


        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "top";
        chart.exporting.adapter.add("data", function (data, target) {
            var data = [];
            chart.series.each(function (series) {
                for (var i = 0; i < series.data.length; i++) {
                    series.data[i].name = series.name;
                    data.push(series.data[i]);
                }
            });
            return { data: data };
        });
    })
};

$("#sta").on('change', function () {
    // console.log(this.value)
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api.php", { param: "ec", sort: "DESC", stname: this.value, limit: 144 }).then(async (r) => {
        // console.log(r);
        var data = [];
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });

    })
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api.php", { param: "do", sort: "DESC", stname: this.value, limit: 144 }).then(async (r) => {
        // console.log(r);
        var data = [];
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });

    })
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api.php", { param: "tmp", sort: "DESC", stname: this.value, limit: 144 }).then(async (r) => {
        // console.log(r);
        var data = [];
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });

    })

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api.php", { param: "ph", sort: "DESC", stname: this.value, limit: 144 }).then(async (r) => {
        // console.log(r);
        var data = [];
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.t, value: Number(i.val) });
        });

    })

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "ec", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        // console.log(r.data.data)
        $("#ec").text(r.data.data[0].val)
        var testDate = r.data.data[0].t
        var datenow = moment(testDate).format('DD/MM/YYYY')
        var timenow = moment(testDate).format('HH:mm')
        // console.log(datenow)
        // console.log(timenow)
        $("#datenow").text(moment(testDate).format('DD/MM/YYYY'))
        $("#timenow").text(moment(testDate).format('HH:mm'))

    })
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "do", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        // console.log(r.data.data)
        let val_do = r.data.data[0].val;
        $("#do").text(`${val_do !== null ? val_do : '-'}`)
    })
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "tmp", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        // console.log(r.data.data)
        $("#tmp").text(r.data.data[0].val)
    })
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "tmp", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        // console.log(r.data.data)
        $("#tmp").text(r.data.data[0].val)
    })
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php", { param: "ph", sort: "DESC", stname: this.value, limit: 1 }).then((r) => {
        // console.log(r.data.data)
        $("#ph").text(r.data.data[0].val)
    })


    var sta = $("#sta").val()
    if (sta == "station_01") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 1 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลเกาะขนุน อำเภอพนมสารคาม จังหวัดฉะเชิงเทรา <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span>')
    }
    else if (sta == "station_02") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 2 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลบางละมุง อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span>')
    }
    else if (sta == "station_03") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 3 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลบางบุตร อำเภอบ้านค่าย จังหวัดระยอง <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span> ')
    }
    else {
        $('#info_sta').text('')
    }


    if ($("#sta").val() == "station_01") {
        var sta = $("#sta").val()
        ecchart(sta);
        dochart("station_01", 0, 2.1, 1000, 10000);
        tmpchart("station_01", 0, 0, 35, 100);
        phchart("station_01", 0, 5, 9, 100);
        data("ec");
        data("do");
        data("tmp");
        data("ph");
    }
    else if ($("#sta").val() == "station_02") {
        var sta = $("#sta").val()
        ecchart(sta);
        dochart("station_02", 0, 2.1, 1000, 10000);
        tmpchart("station_02", 0, 0, 35, 100);
        phchart("station_02", 0, 5, 9, 100);
        data("ec");
        data("do");
        data("tmp");
        data("ph");
    }
    else if ($("#sta").val() == "station_03") {
        var sta = $("#sta").val()
        ecchart(sta);
        dochart("station_03", 0, 2.1, 1000, 10000);
        tmpchart("station_03", 0, 0, 35, 100);
        phchart("station_03", 0, 5, 9, 100);
        data("ec");
        data("do");
        data("tmp");
        data("ph");
    } else {
    }
})


ecchart()
dochart()
phchart()
tmpchart()
loadWtrl()
loadWtrl2()

//////////////////// ระดับน้ำ /////////////////

var deepchart = function (staname, d_all, min1, min2, max1, max2) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("deepchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var data = [];
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: staname, limit: 14 }).then(async (r) => {
        // console.log(staname)
        r.data.data.forEach(i => {
            // console.log(i)
            var k = d_all - Number(i.dept) <= 0 ? 0 : d_all - Number(i.dept).toFixed(2)
            data.push({ date: i.dt, value: k });
        });

        chart.data = data;

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dateFormats.setKey("yyyy-MM-dd ");
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.tooltipDateFormat = "yyyy-MM-dd";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 40;
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = " Wl (cm)";
        // valueAxis.baseValue = 0;
        // valueAxis.title.text = unit;

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 15;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#00CCCC");

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        bullet.circle.stroke = am4core.color("#00CCCC");

        var range = valueAxis.createSeriesRange(series);
        // range.value = 0;
        // range.endValue = -1000;
        range.contents.stroke = am4core.color("#00CCCC");
        range.contents.fill = range.contents.stroke;

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        dateAxis.start = 0.91;
        dateAxis.keepSelection = true;

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;

        // // chart.scrollbarY = new am4core.Scrollbar();
        // chart.scrollbarX = new am4core.Scrollbar();
    })
};

var tempchart = function (staname) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("tempchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var data = [];
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: staname, sort: "ASC ", limit: 14 }).then(async (r) => {
        // console.log(stname)
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.dt, value: Number(i.temp).toFixed(2) });
        });

        chart.data = data;

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        dateAxis.dateFormats.setKey("yyyy-MM-dd ");
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.tooltipDateFormat = "yyyy-MM-dd";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 40;
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "Temp (°C)";
        // valueAxis.baseValue = 0;
        // valueAxis.title.text = unit;

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 15;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#00CCCC");

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        bullet.circle.stroke = am4core.color("#00CCCC");

        var range = valueAxis.createSeriesRange(series);
        // range.value = 5;
        // range.endValue = 9;
        range.contents.stroke = am4core.color("#00CCCC");
        range.contents.fill = range.contents.stroke;

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        dateAxis.start = 0.91;
        dateAxis.keepSelection = true;

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;

        // // chart.scrollbarY = new am4core.Scrollbar();
        // chart.scrollbarX = new am4core.Scrollbar();
    })
};
var humichart = function (staname) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("humichart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var data = [];
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: staname, limit: 14 }).then(async (r) => {
        // console.log(stname)
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.dt, value: Number(i.humi).toFixed(2) });
        });

        chart.data = data;

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        dateAxis.dateFormats.setKey("yyyy-MM-dd ");
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.tooltipDateFormat = "yyyy-MM-dd";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 40;
        valueAxis.tooltip.disabled = true;
        valueAxis.title.text = "humidity (%)";
        // valueAxis.baseValue = 0;
        // valueAxis.title.text = unit;

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.dateX = "date";
        series.strokeWidth = 2.5;
        series.tensionX = 0.8;
        series.minBulletDistance = 15;
        series.tooltipText = "{value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.fillOpacity = 3;
        series.tooltip.label.padding(10, 10, 10, 10)
        series.stroke = am4core.color("#00CCCC");

        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 3;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        bullet.circle.stroke = am4core.color("#00CCCC");

        var range = valueAxis.createSeriesRange(series);
        // range.value = 5;
        // range.endValue = 9;
        range.contents.stroke = am4core.color("#00CCCC");
        range.contents.fill = range.contents.stroke;

        // Add scrollbar
        chart.scrollbarX = new am4charts.XYChartScrollbar();
        chart.scrollbarX.series.push(series);
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        dateAxis.start = 0.91;
        dateAxis.keepSelection = true;

        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.xAxis = dateAxis;
        chart.cursor.snapToSeries = series;

        // // chart.scrollbarY = new am4core.Scrollbar();
        // chart.scrollbarX = new am4core.Scrollbar();
    })
};

$("#staname").on('change', function () {
    // console.log(this.value)
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: this.value, limit: 14 }).then(async (r) => {
        // console.log(stname)
        var data = [];
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.dt, value: Number(i.dept).toFixed(2) });
        });

    })
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: this.value, limit: 14 }).then(async (r) => {
        // console.log(stname)
        var data = [];
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.dt, value: Number(i.temp).toFixed(2) });
        });

    })

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: this.value, limit: 14 }).then(async (r) => {
        // console.log(stname)
        var data = [];
        r.data.data.forEach(i => {
            // console.log(i)
            data.push({ date: i.dt, value: Number(i.humi).toFixed(2) });
        });
    })

    let d_format = (measure, iot) => {
        let a = measure - iot
        a >= 0 ? a : a = 0
        return a.toFixed(2)
    }
    // let data_wl = async (e) => {
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: this.value, limit: 1 }).then((r) => {
        // console.log(dept)
        // let a = 275.5 - r.data.data[0].dept
        var n = r.data.data.length - 1
        this.value == "station_01" ? $("#dept").text(d_format(275.5, r.data.data[n].dept)) : null
        this.value == "station_02" ? $("#dept").text(d_format(244, r.data.data[n].dept)) : null
        this.value == "station_03" ? $("#dept").text(d_format(298, r.data.data[n].dept)) : null
        this.value == "station_04" ? $("#dept").text(d_format(294, r.data.data[n].dept)) : null
        this.value == "station_05" ? $("#dept").text(d_format(280, r.data.data[n].dept)) : null
        this.value == "station_06" ? $("#dept").text(d_format(435, r.data.data[n].dept)) : null
        this.value == "station_07" ? $("#dept").text(d_format(380.6, r.data.data[n].dept)) : null
        this.value == "station_08" ? $("#dept").text(d_format(512, r.data.data[n].dept)) : null
        this.value == "station_09" ? $("#dept").text(d_format(550.5, r.data.data[n].dept)) : null

    })

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: this.value, limit: 1 }).then((r) => {
        var n = r.data.data.length - 1
        $("#temp1").text(Number(r.data.data[n].temp).toFixed(2));
        $("#timenow2").text(moment(testDate2).format('HH:mm'))
        var testDate2 = r.data.data[n].dt
        var datenow2 = moment(testDate2).format('DD/MM/YYYY')
        var timenow2 = moment(testDate2).format('HH:mm')
        $("#datenow2").text(moment(testDate2).format('DD/MM/YYYY'))

    })

    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: this.value, limit: 1 }).then((r) => {
        var n = r.data.data.length - 1
        $("#humi1").text(Number(r.data.data[n].humi).toFixed(2));
    })
    // }


    var staname = $("#staname").val()
    if (staname == "station_01") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 1 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span> ')
    }
    else if (staname == "station_02") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 2 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else if (staname == "station_03") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 3 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else if (staname == "station_04") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 4 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลสำนักทอง อำเภอเมืองระยอง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else if (staname == "station_05") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 5 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลสำนักทอง อำเภอเมืองระยอง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else if (staname == "station_06") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 6 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลกะเฉด อำเภอเมือง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else if (staname == "station_07") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 7 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลเขาชะเมา อำเภอแกลง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else if (staname == "station_08") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 8 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลน้ำเป็น อำเภอเขาชะเมา  จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else if (staname == "station_09") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 9 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลทุ่งควายกิน อำเภอแกลง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
    }
    else {
        $('#info_sta2').text('')
    }



    if ($("#staname").val() == "station_01") {
        var staname = $("#staname").val()
        deepchart(staname, 275.5,);
        tempchart("station_01");
        humichart("station_01");
    }

    else if ($("#staname").val() == "station_02") {
        var staname = $("#staname").val()
        deepchart(staname, 244);
        tempchart("station_02");
        humichart("station_02");

    }
    else if ($("#staname").val() == "station_03") {
        var staname = $("#staname").val()
        deepchart(staname, 298);
        tempchart("station_03");
        humichart("station_03");

    }
    else if ($("#staname").val() == "station_04") {
        var staname = $("#staname").val()
        deepchart(staname, 294);
        tempchart("station_04");
        humichart("station_04");

    }
    else if ($("#staname").val() == "station_05") {
        var staname = $("#staname").val()
        deepchart(staname, 280);
        tempchart("station_05");
        humichart("station_05");

    }
    else if ($("#staname").val() == "station_06") {
        var staname = $("#staname").val()
        deepchart(staname, 435);
        tempchart("station_06");
        humichart("station_06");

    }
    else if ($("#staname").val() == "station_07") {
        var staname = $("#staname").val()
        deepchart(staname, 380.6);
        tempchart("station_07");
        humichart("station_07");

    }
    else if ($("#staname").val() == "station_08") {
        var staname = $("#staname").val()
        deepchart(staname, 512);
        tempchart("station_08");
        humichart("station_08");

    }
    else if ($("#staname").val() == "station_09") {
        var staname = $("#staname").val()
        deepchart(staname, 550.5);
        tempchart("station_09");
        humichart("station_09");

    } else {

    }

})

deepchart()
tempchart()
humichart()


$('#H1_close').hide()
$('#collapseTwo').hide()

function H1_open() {
    $('#H1_close').show()
    $('#H1_op').hide()
    $('#collapseTwo').slideDown("slow");
}
function H1_close() {
    $('#H1_close').hide()
    $('#H1_op').show()
    $('#collapseTwo').slideUp("slow");
}

$('#H2_close').hide()
$('#collapseThree').hide()

function H2_open() {
    $('#H2_close').show()
    $('#H2_op').hide()

    $('#collapseThree').slideDown("slow");
}
function H2_close() {
    $('#H2_close').hide()
    $('#H2_op').show()

    $('#collapseThree').slideUp("slow");
}

// H1_open()
H1_close()
H2_close()

let confirmDelete = (id_data, wlev1,) => {
    $("#projId").val(id_data)
    $("#wlev1").html(`${wlev1 !== 'null' ? 'ระดับน้ำ' + wlev1 : ''} `)
    $('#deleteModal').modal('show');
}
let deleteValue = () => {
    let id_data = $("#projId").val();
    // $('#deleteModal').modal('hide');
    // console.log(id_data)
    $('#myTable').DataTable().ajax.reload();
    axios.post(url + "/dbwater-eac/delete", { proj_id: id_data }).then(r => {
        r.data.data == "success" ? $('#deleteModal').modal('hide') && refreshPage() : null
        // refreshPage()
    })
}
let refreshPage = () => {
    window.open("./../dashboard/index.html", "_self");
    // console.log("ok");
}
let editdata = (e) => {
    sessionStorage.setItem('id_data', e);
    // sessionStorage.setItem('w_from_admin', 'yes');
    location.href = "./../edit/index.html";
}
let editdata2 = () => {
    let e = $("#projId").val();
    // console.log(e)
    sessionStorage.setItem('id_data', e);
    location.href = "./../edit/index.html";
}
