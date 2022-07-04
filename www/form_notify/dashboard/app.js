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
        div.innerHTML += '<img src="./img/notify_water.png"  height="30px"><span>ปัญหามลพิษ</span><br>';
        div.innerHTML += '<img src="./img/notify_natural.png"  height="30px"><span>ปัญหาภัยธรรมชาติ</span><br>';
        div.innerHTML += '<img src="./img/notify_other.png"  height="30px"><span>ปัญหาอื่นๆ</span><br>';
        return div;
    };
    legend.addTo(map);
}

function hideLegend() {
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += `<button class="btn btn-sm" onClick="showLegend()">
        <span class="kanit">แสดงสัญลักษณ์</span></small> 
        <i class="fa fa-angle-double-up" aria-hidden="true"></i>
    </button>`;
        return div;
    };
    legend.addTo(map);
}

hideLegend()

let loadnoticetype = async (d) => {
    let pollu = 0;
    let naturdis = 0;
    let other = 0;

    await d.map(i => {
        i.noticetype == "มลพิษ" ? pollu += 1 : null
        i.noticetype == "ภัยธรรมชาติ" ? naturdis += 1 : null
        i.noticetype == "อื่นๆ" ? other += 1 : null
    })

    // let dat = [{
    //     name: "สัตว์",
    //     value: zoo
    // }, {
    //     name: "พืช",
    //     value: plant
    // }, {
    //     name: "ไม่ทราบ",
    //     value: other
    // }]
    $("#pollu").text(pollu)
    $("#naturdis").text(naturdis)
    $("#other").text(other)

    // pieChart("chartbiotype", dat)
}


let getpro = () => {
    // const url = "https://engrids.soc.cmu.ac.th/api";
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
        $('#num_list_name').html(`ทั้งหมด`);
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
            type: "post",
            url: "https://engrids.soc.cmu.ac.th/api" + `/notice-eac/getalldata`,
            dataSrc: 'data',
        },
        columns: [
            {
                data: null,
                render: (data, type, row, meta) => {
                    return `${meta.row + 1}`
                }
            },
            { data: 'datetimes' },
            { data: 'noticename' },
            { data: 'noticedetail' },
            { data: 'noticeplace' },
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
                            <button class="btn m btn-danger" onclick="confirmDelete(${row.id_date},'${row.noticename}','${row.noticedetail}','${row.noticeplace}','${row.datetimes}','${row.record}')"><i class="bi bi-trash"></i>&nbsp;ลบข้อมูล</button>`
                },
                // width: "30%"
            }

        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 5, 6, 7] },

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
        loadnoticetype(data); zoomMap(data)
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
        let txtTooltip = `<strong class="fk-16">${i.noticename}</strong>`
        if (i.geojson) {
            let geojson = L.geoJSON(JSON.parse(i.geojson), {
                style: style,
                name: "st_asgeojson",
                onEachFeature: function (feature, layer) {
                    // drawnItems.addLayer(layer);
                }
            })
            geojson
                .bindPopup(`<h6 class= "text-center" ><b>เรื่องร้องเรียน</b> ${i.noticename}<br><b>รายละเอียด</b>: ${i.noticedetail} <br><b>ที่ตั้ง</b>: ต.${i.tam_tn} อ.${i.amp_tn} จ.${i.prov_tn} <br>
            <b>ผู้ให้ข้อมูล</b>: ${i.record} <br><b>วันที่บันทึกข้อมูล</b>: ${i.datetimes} <br> <img src="${i.imgfile}" width="200px"></h6>`)
                .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] })
                .addTo(map);
        }
    })
}
let zoomMap = (x) => {
    var a = [x];
    // console.log(a)
    // a.map(i => {
    var pop
    if (a[0].noticename) {
        pop = L.popup({ Width: 200 });
        let content = `<h6 class= "text-center"> <b>เรื่องร้องเรียน</b> ${a[0].noticename} <br><b>รายละเอียด</b>: ${a[0].noticedetail} <br><b>ที่ตั้ง</b>: ต.${a[0].tam_tn} อ.${a[0].amp_tn} จ.${a[0].prov_tn} <br>
    <b>ผู้ให้ข้อมูล</b>: ${a[0].record} <br><b>วันที่รายงาน</b>: ${a[0].datetimes} <br><img src="${a[0].imgfile}" width="200px"></h6>`;
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
            console.log(setlocation)
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

    var MIcon_01 = L.icon({
        iconUrl: './img/notify_water.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_02 = L.icon({
        iconUrl: './img/notify_natural.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_03 = L.icon({
        iconUrl: './img/notify_other.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });

    ms = L.layerGroup()
    d.map(i => {
        let txtTooltip = `<strong class="fk-16">${i.noticename}</strong>`
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            // json.properties = { bioname: i.bioname, biodetail: i.biodetail, img: i.img };
            if (i.noticetype == 'มลพิษ') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_01 });
                    }
                })
                    .bindPopup(`<h6><b>เรื่องร้องเรียน :</b> ${i.noticename}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่รายงาน :</b> ${i.datetimes}</h6>`)
                    .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] })
                // .addTo(map)
                ms.addLayer(mm);
            } else if (i.noticetype == 'ภัยธรรมชาติ') {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_02 });
                    }
                })
                    .bindPopup(`<h6><b>เรื่องร้องเรียน :</b> ${i.noticename}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่รายงาน :</b> ${i.datetimes}</h6>`)
                    .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] })
                // .addTo(map)
                ms.addLayer(mm);
            } else {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_03 });
                    }
                })
                    .bindPopup(`<h6><b>เรื่องร้องเรียน :</b> ${i.noticename}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่รายงาน :</b> ${i.datetimes}</h6>`)
                    .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] })
                // .addTo(map)
                ms.addLayer(mm);
            }
        } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
            // console.log(i.lat, i.lng)
            if (i.noticetype == 'มลพิษ') {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_01 })
                    .bindPopup(`<h6><b>เรื่องร้องเรียน :</b> ${i.noticename}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่รายงาน :</b> ${i.datetimes}</h6>`)
                    .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] })
                ms.addLayer(mm);// 
            } else if (i.noticetype == 'ภัยธรรมชาติ') {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_02 })
                    .bindPopup(`<h6><b>เรื่องร้องเรียน :</b> ${i.noticename}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่รายงาน :</b> ${i.datetimes}</h6>`)
                    .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] })
                ms.addLayer(mm);// 
            } else {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_03 })
                    .bindPopup(`<h6><b>เรื่องร้องเรียน :</b> ${i.noticename}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                <h6><b>วันที่รายงาน :</b> ${i.datetimes}</h6>`)
                    .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] })
                ms.addLayer(mm);// 
            }
        }
    });
    ms.addTo(map)
    // lyrControl.addOverlay(ms, "ตำแหน่งหน่วยงานที่รายงาน...")
}
let confirmDelete = (id_data, noticename,) => {
    $("#projId").val(id_data)
    $("#noticename").html(`${noticename !== 'null' ? 'เรื่องร้องเรียน' + noticename : ''} `)
    $('#deleteModal').modal('show');
}
let deleteValue = () => {
    let id_data = $("#projId").val();
    // $('#deleteModal').modal('hide');
    console.log(id_data)
    $('#myTable').DataTable().ajax.reload();
    axios.post(url + "/notice-eac/delete", { proj_id: id_data }).then(r => {
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
