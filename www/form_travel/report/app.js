let latlng = {
    lat: 13.305567,
    lng: 101.383101
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

let d
// const url = "http://localhost:3000";
const url = "https://engrids.soc.cmu.ac.th/api";
let getpro = () => {
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
        $('#num_list_name').html(`ทั้งหมด`);
        $('#area_list_name').html(`ทั้งหมด`);
        $('#TT_name').text(`แหล่งท่องเที่ยว`)
    } else {
        table.search(prov_n).draw();
        $('#num_list_name').html(`ของ จ.${prov_n}`);
        $('#area_list_name').html(`ของ จ.${prov_n}`);
        $('#TT_name').text(`แหล่งท่องเที่ยวจังหวัด${prov_n}`)

    }
})
$('#amp').on('change', function () {
    var code = $('#amp').val()
    // console.log(code)
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
        $('#area_list_name').html(`ของ อ.${amp_n}`);
        $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n}`)
    } else {
        table.search(prov_n).draw();
        $('#num_list_name').html(`ของ จ.${prov_n}`);
        $('#area_list_name').html(`ของ จ.${prov_n}`);
        $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n}`)

    }
})
$('#tam').on('change', function () {
    tam_n = $('#tam').children("option:selected").text()
    tam_c = $('#tam').children("option:selected").val()
    if (tam_c !== "tam") {
        table.search(tam_n).draw();
        $('#num_list_name').html(`ของ ต.${tam_n}`);
        $('#area_list_name').html(`ของ ต.${tam_n}`);
        $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n} ต.${tam_n}`)
    } else {
        table.search(amp_n).draw();
        $('#num_list_name').html(`ของ อ.${amp_n}`);
        $('#area_list_name').html(`ของ อ.${amp_n}`);
        $('#TT_name').text(`แหล่งท่องเที่ยวใน จ.${prov_n} อ.${amp_n}`)
    }
})
let table
$(document).ready(function () {
    $('#TT_name').text(`แหล่งท่องเที่ยว`)
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
            { data: null },
            { data: 'datetimes' },
            { data: 'st_name' },
            { data: 'typess' },
            { data: 'prov_tn' },
            { data: 'amp_tn' },
            { data: 'tam_tn' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `${row.geojson !== null || row.lat !== "0" && row.lat !== null && row.lng !== "0" && row.lng !== null ? `<span class="text-success"><b>มี</b></span>` : `<span class="text-danger"><b>ไม่มี</b></span>`}`
                },
            },
            { data: 'record' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    // console.log(row);
                    return `<button class= "btn m btn-loaction" id="getzoomMap" ><i class="fas fa-map-marker-alt"></i>&nbsp;ที่ตั้ง</button>
                            <button type="button" class="btn btn-warning" onclick="editdata(${row.id_data})"><i class="bi bi-pencil-square"></i>&nbsp;แก้ไขข้อมูล</button>
                            <button class="btn m btn-danger" onclick="confirmDelete(${row.id_date},'${row.date_re}','${row.productmodel}','${row.outputtype}')"><i class="bi bi-trash"></i>&nbsp;ลบข้อมูล</button>`
                },
                // width: "30%"
            }

        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 4, 5, 6, 7] },
            {
                targets: 1, render: function (data) {
                    if (data !== null) {
                        return moment(data).locale('th').format('DD-MM-YYYY');
                    } else {
                        return '-'
                    }
                },
            },
            {
                targets: [2, 3, 4, 5, 6, 8], render: function (data) {
                    if (data !== null) {
                        return data;
                    } else {
                        return '-'
                    }
                },
            },
        ],
        dom: 'Bfrtip',
        buttons: [
            'print', 'excel'
        ],
        pageLength: 6
    });
    table.on('order.dt search.dt', function () {
        table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
    table.on('search.dt', function () {
        let data = table.rows({ search: 'applied' }).data()
        // data.map(i => { console.log(i.outputtype) })
        // $("#siteCnt").text(data.length)
        // getMap(data)
        // setarea(data)
        getmarker(data)
        score_all(data)
        // console.log();
    });

    $('#myTable tbody').on('click', '#getzoomMap', function () {
        var data = table.row($(this).parents('tr')).data();
        zoomMap(data)
    });

    // $('#myTable tbody').on('click', '#edit', function () {
    //     var data = table.row($(this).parents('tr')).data();
    //     editdata(data)
    // });

    // $('#myTable tbody').on('click', '#delete', function () {
    //     var data = table.row($(this).parents('tr')).data();
    //     // confirmDelete(data.staid, data.staname, data.id_date)
    //     $('#deleteModal').modal('show');
    // });

    // axios.get("https://engrids.soc.cmu.ac.th/api/form_gw/getintro").then((r) => {
    //     var data = r.data.data;
    //     getMap(data)
    // })
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
    var style_agri = {
        "color": "#A5B806",
        "weight": 2,
        "opacity": 0.65
    }
    var style_ani = {
        "color": "#FA584B",
        "weight": 2,
        "opacity": 0.65
    }
    var style_fish = {
        "color": "#4F9DE8",
        "weight": 2,
        "opacity": 0.65
    }

    x.map(i => {
        if (i.geojson) {
            let geojson = L.geoJSON(JSON.parse(i.geojson), {
                style: style,
                name: "st_asgeojson",
                onEachFeature: function (feature, layer) {
                    // drawnItems.addLayer(layer);
                }
            })
            let outputtype = `${i.type1 !== 'ไม่มี' ? i.type1 + "," : ""}
        ${i.type2 !== 'ไม่มี' ? i.type2 + "," : ""}
        ${i.type3 !== 'ไม่มี' ? i.type3 + "," : ""}
        ${i.type4 !== 'ไม่มี' ? i.type4 + "," : ""}
        ${i.type5 !== 'ไม่มี' ? i.type5 + "," : ""}
        ${i.type6 !== 'ไม่มี' ? i.type6 + "," : ""}
        ${i.type7 !== 'ไม่มี' ? i.type7 + "," : ""}
        ${i.type8 !== 'ไม่มี' ? i.type8 + "," : ""}
        ${i.type9 !== 'ไม่มี' ? i.type9 : ""}`
            let date_re = i.datereport.split("-")
            let Newdate_re = date_re[2] + "/" + date_re[2] + "/" + date_re[0]
            geojson
                .bindPopup(`<h6 class= "text-center" ><b>แปลง</b> ${i.productmodel}<br><b>ผลผลิตในแปลง</b>: ${outputtype} <br><b>ที่ตั้ง</b>: ต.${i.tam_tn} อ.${i.amp_tn} จ.${i.prov_tn} <br>
                <b>ผู้ให้ข้อมูล</b>: ${i.record} <br><b>วันที่บันทึกข้อมูล</b>: ${Newdate_re} <br> <img src="${i.img}" width="200px"></h6>`)
                .addTo(map);
        }
    })
}
let zoomMap = (x) => {
    var a = [x];
    console.log(a)
    let date_re = a[0].datereport.split("-")
    let Newdate_re = date_re[2] + "/" + date_re[1] + "/" + date_re[0]
    var pop
    if (a[0].st_name) {
        pop = L.popup({ Width: 200 });
        let content = `<h6 class= "text-center"><b>สถานที่</b>: ${a[0].st_name}<br><b>ประเภท</b>: ${a[0].typess} <br><b>ที่ตั้ง</b>: ${a[0].locations} ต.${a[0].tam_tn} อ.${a[0].amp_tn} จ.${a[0].prov_tn} <br>
    <b>ผู้ให้ข้อมูล</b>: ${a[0].record !== null ? a[0].record : "-"} <br><b>วันที่บันทึกข้อมูล</b>: ${Newdate_re} <br><img src="${a[0].img1 !== null ? a[0].img1 : './img/noimg.png'}" width="200px"></h6>`;
        let setlocation = [];
        if (a[0].geojson) {
            let json = JSON.parse(a[0].geojson);
            if (json.type == "Point") {
                setlocation.push({
                    "lat": Number(json.coordinates[1]),
                    "lng": Number(json.coordinates[0]),
                })
            }
            // console.log(setlocation)
        } else {
            setlocation.push({
                "lat": Number(a[0].lat),
                "lng": Number(a[0].lng),
            })
            // console.log(setlocation)
        }
        pop.setContent(content);
        pop.setLatLng(setlocation[0]);
        pop.openOn(map);
        var zoom = 18
        map.flyTo(setlocation[0], zoom)
    }
}

let onEachFeature = (feature, layer) => {
    // console.log(feature);
    if (feature.properties) {
        layer.bindPopup(`<h6><b>สถานที่ :</b> ${feature.properties.st_name}</h6><h6><b>จังหวัด :</b> ${feature.properties.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${feature.properties.id_user}</h6>
            <h6><b>วันที่บันทึก :</b> ${feature.properties.date}</h6>`, { maxWidth: 240 })
    }
}

var markers = L.markerClusterGroup();
let getmarker = (d) => {
    // var MIcon1 = L.icon({
    //     iconUrl: './marker/m1.png',
    //     iconSize: [60, 60],
    //     // iconAnchor: [10, 5],
    //     // popupAnchor: [10, 0]
    // });
    // var MIcon2 = L.icon({
    //     iconUrl: './marker/m2.png',
    //     iconSize: [60, 60],
    //     iconAnchor: [10, 5],
    //     // popupAnchor: [10, 0]
    // });
    // var MIcon3 = L.icon({
    //     iconUrl: './marker/m3.png',
    //     iconSize: [60, 60],
    //     // iconAnchor: [10, 5],
    //     // popupAnchor: [10, 0]
    // });
    // var MIcon4 = L.icon({
    //     iconUrl: './marker/m4.png',
    //     iconSize: [60, 60],
    //     // iconAnchor: [10, 5],
    //     // popupAnchor: [10, 0]
    // });
    // var MIcon5 = L.icon({
    //     iconUrl: './marker/m5.png',
    //     iconSize: [60, 60],
    //     // iconAnchor: [10, 5],
    //     // popupAnchor: [10, 0]
    // });

    var mm, ms
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });
    if (markers) {
        markers.eachLayer(i => {
            i.options.name == "marker" ? markers.removeLayer(i) : null;
        })
    }
    // console.log(d)
    ms = L.layerGroup()
    d.map(i => {
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            json.properties = { st_name: i.st_name, prov_tn: i.prov_tn, id_user: i.id_user, date: i.datereport };
            mm = L.geoJson(json, {
                onEachFeature: onEachFeature,
                name: "marker",
                // icon: MIcon1,
                // pointToLayer: function (feature, latlng) {
                //     return L.marker(latlng, { name: "marker" });
                // }
            })
                .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.id_user}</h6>
            <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
            // .addTo(map)
            markers.addLayer(mm);
            // ms.addLayer(mm);
        } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
            // console.log(i.lat, i.lng)
            mm = L.marker([i.lat, i.lng], { name: "marker" })
                .bindPopup(`<h6><b>สถานที่ :</b> ${i.st_name}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.id_user}</h6>
        <h6><b>วันที่บันทึก :</b> ${i.datereport}</h6>`)
            // ms.addLayer(mm);
            markers.addLayer(mm);
        }
    });
    map.addLayer(markers);
    // ms.addTo(map)
    // lyrControl.addOverlay(ms, "ตำแหน่งหน่วยงานที่รายงานปริมาณขยะ")
}
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

let confirmDelete = (id_data, date, t_agri, product) => {
    $("#projId").val(id_data)
    $("#projName").html(`${t_agri !== 'null' ? 'แปลง' + t_agri : ''} ${product !== 'null' ? 'ผลผลิต' + product : ''}`)
    if (date !== 'null') {
        let prj_time = date.split("T")
        let N_time = prj_time[0].split("-")

        $("#projTime").html(`วันที่ ${N_time[2]} / ${N_time[1]} / ${N_time[0]}`);
    } else {
        $("#projTime").html('');
    }
    $('#deleteModal').modal('show');
}
let deleteValue = () => {
    let id_data = $("#projId").val();
    // $('#deleteModal').modal('hide');
    console.log(id_data)
    $('#myTable').DataTable().ajax.reload();
    // axios.post(url + "/food_security/delete", { id_date: id_data }).then(r => {
    //     r.data.data == "success" ? $('#deleteModal').modal('hide') : null
    // })
}
let editdata = (e) => {
    sessionStorage.setItem('id_data', e);
    // sessionStorage.setItem('w_from_admin', 'yes');
    location.href = "./../edit/index.html";
}

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
        div.innerHTML += '<img src="./img/Mark.png"  height="30px"><span>ตำแหน่งนำเข้าข้อมูล</span><br>';

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