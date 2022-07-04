const url = "https://engrids.soc.cmu.ac.th/api";
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
    zIndex: 1,
    // maxZoom: 18,
    // minZoom: 14,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const amp = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:amp_eac",
    format: "image/png",
    transparent: true,
    zIndex: 1,
    // maxZoom: 14,
    // minZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:prov_eac",
    format: "image/png",
    transparent: true,
    zIndex: 2,
    // maxZoom: 10,
    // CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=24'
});

const airqualityeec = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eec/wms?", {
    layers: 'eec:a__65_airquality_eec',
    format: 'image/png',
    transparent: true
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
        div.innerHTML += '<img src="./img/agri_insee.png"  height="30px"></i><span>เกษตรอินทรีย์</span><br>'
        div.innerHTML += '<img src="./img/agri_safe.png"  height="30px"></i><span>เกษตรปลอดภัย</span><br>'
        div.innerHTML += '<img src="./img/agri_mix.png"  height="30px"></i><span>เกษตรผสมผสาน</span><br>'
        div.innerHTML += '<img src="./img/agri_single.png"  height="30px"></i><span>เกษตรเชิงเดียว</span><br>'
        div.innerHTML += '<img src="./img/agri_wana.png"  height="30px"></i><span>วนเกษตร</span><br>'
        div.innerHTML += '<img src="./img/agri_other.png"  height="30px"></i><span>อื่นๆ</span><br>'
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

let d
let getdata = (id) => {
    // var url = "http://localhost:3000";
    axios.post(url + `/food_security/get/id`, { id_user: id }, { id_user: 'admin' }).then(async (r) => {
        d = r.data.data;
        // console.log(d)
        // setdata2(d)

        var arr = d.filter(e => e.areafarm)
        var data = []
        arr.map(i => {
            data.push(i.areafarm)
        })

        var calculator = []
        d.map(i => {
            if (i.a_unit == "ไร่") {
                var a = i.areafarm
                var b = a * 0.0016
                calculator.push(b)
            } else if (i.a_unit == "งาน") {
                var a = i.areafarm
                var b = a * 0.25 * 0.0016
                calculator.push(b)
            } else if (i.a_unit == "ตารางวา") {
                var a = i.areafarm
                var b = (a / 100) * 0.25 * 0.0016
                calculator.push(b)
            } else if (i.a_unit == "ตารางเมตร") {
                var a = i.areafarm
                var b = (a / 1000000)
                calculator.push(b)
            } else if (i.a_unit == "ตารางกิโลเมตร") {
                var a = i.areafarm
                calculator.push(Number(a))
            }
        })
        let sum = 0;
        for (let i = 0; i < calculator.length; i++) {
            sum += calculator[i];
        }
        $('#area_all').html(sum.toFixed(2))
        $('#num_all').html(d.length)
    })
}
getdata('admin')
let setarea = (x) => {
    var data = []
    x.map(i => {
        if (i.a_unit == "ไร่") {
            var a = i.areafarm
            var b = a * 0.0016
            data.push(b)
        } else if (i.a_unit == "งาน") {
            var a = i.areafarm
            var b = a * 0.25 * 0.0016
            data.push(b)
        } else if (i.a_unit == "ตารางวา") {
            var a = i.areafarm
            var b = (a / 100) * 0.25 * 0.0016
            data.push(b)
        } else if (i.a_unit == "ตารางเมตร") {
            var a = i.areafarm
            var b = (a / 1000000)
            data.push(b)
        } else if (i.a_unit == "ตารางกิโลเมตร") {
            var a = i.areafarm
            data.push(Number(a))
        }
    })
    // console.log(data)
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data[i];
    }
    // $('#area_all').html(sum.toFixed(2))
    $('#area_list').html(sum.toFixed(2))
    // console.log(sum);
}
let area = (d) => {
    let result = d.map(i => Number(i));
    // console.log(result);
    let sum = 0;
    for (let i = 0; i < result.length; i++) {
        sum += result[i];
    }
    $('#area_all').html(sum)
    $('#area_list').html(sum)
    // console.log(sum);
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

let RemoveLayers = () => {
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
        $('#area_list_name').html(`ทั้งหมด`);
        $('#Allchart').slideUp("slow");
        RemoveLayers();
    } else {
        table.search(prov_n).draw();
        $('#num_list_name').html(`ของ จ.${prov_n}`);
        $('#area_list_name').html(`ของ จ.${prov_n}`);
        $('#Allchart').slideDown();

        RemoveLayers();
        axios.get(`${url}/eec-api/get-bound/pro/${code}`).then(async (r) => {
            let geojson = await JSON.parse(r.data.data[0].geom);
            // console.log(geojson);
            let a = L.geoJSON(geojson, {
                style: boundStyle,
                name: "bnd"
            }).addTo(map);
            map.fitBounds(a.getBounds());
        })
    }
    getchart_v2()
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
        $('#area_list_name').html(`ของ อ.${amp_n}`);

        RemoveLayers();
        axios.get(`${url}/eec-api/get-bound/amp/${amp_c}`).then(async (r) => {
            let geojson = await JSON.parse(r.data.data[0].geom);
            // console.log(geojson);
            let a = L.geoJSON(geojson, {
                style: boundStyle,
                name: "bnd"
            }).addTo(map);
            map.fitBounds(a.getBounds());
        })

    } else {
        table.search(prov_n).draw();
        $('#num_list_name').html(`ของ จ.${prov_n}`);
        $('#area_list_name').html(`ของ จ.${prov_n}`);
        RemoveLayers();
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
    getchart_v2()
})
$('#tam').on('change', function () {
    tam_n = $('#tam').children("option:selected").text()
    tam_c = $('#tam').children("option:selected").val()
    if (tam_c !== "tam") {
        table.search(tam_n).draw();
        $('#num_list_name').html(`ของ ต.${tam_n}`);
        $('#area_list_name').html(`ของ ต.${tam_n}`);
        RemoveLayers();
        axios.get(`${url}/eec-api/get-bound/tam/${tam_c}`).then(async (r) => {
            let geojson = await JSON.parse(r.data.data[0].geom);
            // console.log(geojson);
            let a = L.geoJSON(geojson, {
                style: boundStyle,
                name: "bnd"
            }).addTo(map);
            map.fitBounds(a.getBounds());
        })
    } else {
        table.search(amp_n).draw();
        $('#num_list_name').html(`ของ อ.${amp_n}`);
        $('#area_list_name').html(`ของ อ.${amp_n}`);

        RemoveLayers();
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
    getchart_v2()
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
            url: url + `/food_security/getgeom/id`,
            dataSrc: 'data',
        },
        columns: [
            { data: null },
            { data: 'datereport', },
            { data: 'productmodel' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `${row.type1 !== 'ไม่มี' ? row.type1 + "," : ""}
                    ${row.type2 !== 'ไม่มี' ? row.type2 + "," : ""}
                    ${row.type3 !== 'ไม่มี' ? row.type3 + "," : ""}
                    ${row.type4 !== 'ไม่มี' ? row.type4 + "," : ""}
                    ${row.type5 !== 'ไม่มี' ? row.type5 + "," : ""}
                    ${row.type6 !== 'ไม่มี' ? row.type6 + "," : ""}
                    ${row.type7 !== 'ไม่มี' ? row.type7 + "," : ""}
                    ${row.type8 !== 'ไม่มี' ? row.type8 + "," : ""}
                    ${row.type9 !== 'ไม่มี' ? row.type9 : ""}
                    ${row.type1 == 'ไม่มี' && row.type2 == 'ไม่มี' && row.type3 == 'ไม่มี' &&
                            row.type4 == 'ไม่มี' && row.type5 == 'ไม่มี' && row.type6 == 'ไม่มี' &&
                            row.type7 == 'ไม่มี' && row.type8 == 'ไม่มี' && row.type9 == 'ไม่มี' ? '-' : ""}`
                },
            },
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
                    return `<button class= "btn m btn-loaction" id = "getzoomMap"><i class="fas fa-map-marker-alt"></i>&nbsp;ที่ตั้งแปลง</button>
                            <button type="button" class="btn btn-warning" onclick="editdata(${row.id_date})"><i class="bi bi-pencil-square"></i>&nbsp;แก้ไขข้อมูล</button>
                            <button class="btn m btn-danger" onclick="confirmDelete(${row.id_date},'${row.date_re}','${row.productmodel}','${row.outputtype}')"><i class="bi bi-trash"></i>&nbsp;ลบข้อมูล</button>`
                },
                // width: "30%"
            }

        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 3, 4, 5, 6, 7] },
            {
                targets: 1, "width": "16%", render: function (data) {
                    if (data !== null) {
                        return moment(data).locale('th').format('DD-MM-YYYY');
                    } else {
                        return '-'
                    }
                },
            },
            {
                targets: 2, render: function (data) {
                    if (data !== null) {
                        return data
                    } else {
                        return '-'
                    }
                },
            }
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
        $("#siteCnt").text(data.length)
        getMap(data)
        setarea(data)
        getmarker(data)
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
function customTip() {
    // console.log(this.options.productmodel)
    let txt = `<strong class="Kanit">${this.options.productmodel}</strong>`
    this.unbindTooltip();
    if (!this.isPopupOpen()) this.bindTooltip(txt, {
        // permanent: true,
        direction: 'top',
        offset: [0, -15]

    }).openTooltip();
}

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
    var MIcon_insee = L.icon({
        iconUrl: './img/agri_insee.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    x.map(i => {

        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            let geojson = L.geoJson(json, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { name: "marker", icon: MIcon_insee, productmodel: i.productmodel });
                }
            })
            // let geojson = L.geoJSON(JSON.parse(i.geojson), {
            //     style: style,
            //     name: "st_asgeojson",
            //     onEachFeature: function (feature, layer) {
            //         // drawnItems.addLayer(layer);
            //     }
            // })
            let outputtype = `${i.type1 !== 'ไม่มี' ? i.type1 + "," : ""}
        ${i.type2 !== 'ไม่มี' ? i.type2 + "," : ""}
        ${i.type3 !== 'ไม่มี' ? i.type3 + "," : ""}
        ${i.type4 !== 'ไม่มี' ? i.type4 + "," : ""}
        ${i.type5 !== 'ไม่มี' ? i.type5 + "," : ""}
        ${i.type6 !== 'ไม่มี' ? i.type6 + "," : ""}
        ${i.type7 !== 'ไม่มี' ? i.type7 + "," : ""}
        ${i.type8 !== 'ไม่มี' ? i.type8 + "," : ""}
        ${i.type9 !== 'ไม่มี' ? i.type9 : ""} `
            let date_re = i.datereport.split("-")
            let Newdate_re = date_re[2] + "/" + date_re[2] + "/" + date_re[0]
            geojson
                .bindPopup(`< h6 class= "text-center" > <b>แปลง</b> ${i.productmodel} <br><b>ผลผลิตในแปลง</b>: ${outputtype} <br><b>ที่ตั้ง</b>: ต.${i.tam_tn} อ.${i.amp_tn} จ.${i.prov_tn} <br>
                        <b>ผู้ให้ข้อมูล</b>: ${i.record} <br><b>วันที่บันทึกข้อมูล</b>: ${Newdate_re} <br> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px"></h6>`)
                .on('mouseover', customTip)
                .addTo(map);
            // console.log(i.img)
        }
    })
}
let zoomMap = (x) => {
    var a = [x];
    let outputtype = `${a[0].type1 !== 'ไม่มี' ? a[0].type1 + "," : ""}
                            ${a[0].type2 !== 'ไม่มี' ? a[0].type2 + "," : ""}
                            ${a[0].type3 !== 'ไม่มี' ? a[0].type3 + "," : ""}
                            ${a[0].type4 !== 'ไม่มี' ? a[0].type4 + "," : ""}
                            ${a[0].type5 !== 'ไม่มี' ? a[0].type5 + "," : ""}
                            ${a[0].type6 !== 'ไม่มี' ? a[0].type6 + "," : ""}
                            ${a[0].type7 !== 'ไม่มี' ? a[0].type7 + "," : ""}
                            ${a[0].type8 !== 'ไม่มี' ? a[0].type8 + "," : ""}
                            ${a[0].type9 !== 'ไม่มี' ? a[0].type9 : ""}`
    let date_re = a[0].datereport.split("-")
    let Newdate_re = date_re[2] + "/" + date_re[1] + "/" + date_re[0]
    var pop
    if (a[0].productmodel) {
        pop = L.popup({ Width: 200, offset: [0, -25] });
        let content = `<h6 class="text-center"> <b>แปลง</b> ${a[0].productmodel} <br><b>ผลผลิตในแปลง</b>: ${outputtype} <br><b>ที่ตั้ง</b>: ต.${a[0].tam_tn} อ.${a[0].amp_tn} จ.${a[0].prov_tn} <br>
                                <b>ผู้ให้ข้อมูล</b>: ${a[0].record} <br><b>วันที่บันทึกข้อมูล</b>: ${Newdate_re} <br><img src="${a[0].img !== null ? a[0].img : "./img/no_image.png"}" width="200px"></h6>`;
        let setlocation = [];
        if (a[0].geojson) {
            setlocation.push({
                "lat": Number(a[0].glat),
                "lng": Number(a[0].glon),
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
            $("#projId2").val(a[0].id_date)
            $('#warningModal').modal('show')
        }
    }
    // })
}

var markers = L.markerClusterGroup();
let getmarker = (d) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });

    var MIcon_insee = L.icon({
        iconUrl: './img/agri_insee.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_safe = L.icon({
        iconUrl: './img/agri_safe.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_mix = L.icon({
        iconUrl: './img/agri_mix.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_single = L.icon({
        iconUrl: './img/agri_single.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_wana = L.icon({
        iconUrl: './img/agri_wana.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });
    var MIcon_other = L.icon({
        iconUrl: './img/agri_other.png',
        iconSize: [60, 60],
        iconAnchor: [30, 50],
        popupAnchor: [0, -10]
    });

    if (markers) {
        markers.eachLayer(i => {
            i.options.name == "marker" ? markers.removeLayer(i) : null;
        })
    }

    var a = d;
    let t1 = a.filter(e => e.productmodel == "เกษตรอินทรีย์")
    let t2 = a.filter(e => e.productmodel == "เกษตรปลอดภัย")
    let t3 = a.filter(e => e.productmodel == "เกษตรผสมผสาน")
    let t4 = a.filter(e => e.productmodel == "เกษตรเชิงเดียว")
    let t5 = a.filter(e => e.productmodel == "วนเกษตร")
    let t6 = a.filter(e => e.productmodel == "อื่นๆ")

    $('#T0_all').text(a.length)
    $('#T1_list').text(t1.length)
    $('#T2_list').text(t2.length)
    $('#T3_list').text(t3.length)
    $('#T4_list').text(t4.length)
    $('#T5_list').text(t5.length)
    $('#T6_list').text(t6.length)

    var mm, ms
    ms = L.layerGroup()
    d.map(i => {
        let Newdate_re
        if (i.datereport !== null) {
            let date_re = i.datereport.split("-")
            Newdate_re = date_re[2] + "/" + date_re[1] + "/" + date_re[0]
        } else {
            Newdate_re = "ไม่ระบุ"
        }
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            // json.properties = {bioname: i.bioname, biodetail: i.biodetail, img: i.img };
            if (i.productmodel == "เกษตรอินทรีย์") {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_insee, productmodel: i.productmodel });
                    }
                })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                                    <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6>`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "อื่นๆ") {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_other, productmodel: i.productmodel });
                    }
                })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                                    <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6>`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "เกษตรปลอดภัย") {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_safe, productmodel: i.productmodel });
                    }
                })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                                    <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6>`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "เกษตรผสมผสาน") {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_mix, productmodel: i.productmodel });
                    }
                })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                                    <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6>`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "เกษตรเชิงเดียว") {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_single, productmodel: i.productmodel });
                    }
                })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                                    <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6>`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "วนเกษตร") {
                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_wana, productmodel: i.productmodel });
                    }
                })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                                    <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6>`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else {

                mm = L.geoJson(json, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { name: "marker", icon: MIcon_other, productmodel: i.productmodel });
                    }
                })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
                                    <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6>`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            }
        } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
            // console.log(i.lat, i.lng)
            if (i.productmodel == "เกษตรอินทรีย์") {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_insee, productmodel: i.productmodel })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px" class="img-center">`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "อื่นๆ") {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_other, productmodel: i.productmodel })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px" class="img-center">`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "เกษตรปลอดภัย") {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_safe, productmodel: i.productmodel })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px" class="img-center">`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "เกษตรผสมผสาน") {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_mix, productmodel: i.productmodel })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px" class="img-center">`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "เกษตรเชิงเดียว") {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_single, productmodel: i.productmodel })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px" class="img-center">`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else if (i.productmodel == "วนเกษตร") {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_wana, productmodel: i.productmodel })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px" class="img-center">`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            } else {
                mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_other, productmodel: i.productmodel })
                    .bindPopup(`<h6><b>แปลงเกษตร :</b> ${i.productmodel}</h6><h6><b>จังหวัด :</b> ${i.prov_tn}</h6><h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
        <h6><b>วันที่บันทึก :</b> ${Newdate_re}</h6> <img src="${i.img !== null ? i.img : './img/no_image.png'}" width="200px" class="img-center">`)
                    .on('mouseover', customTip);
                // ms.addLayer(mm);
                markers.addLayer(mm);
            }
        }
    });
    // ms.addTo(map)
    map.addLayer(markers);

    // lyrControl.addOverlay(ms, "ตำแหน่งหน่วยงานที่รายงานปริมาณขยะ")
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
    // console.log(id_data)
    $('#myTable').DataTable().ajax.reload();
    axios.post(url + "/food_security/delete", { id_date: id_data }).then(r => {
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
    let e = $("#projId2").val();
    // console.log(e)
    sessionStorage.setItem('id_data', e);
    location.href = "./../edit/index.html";
}
function selectcharts() {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (prov == "TH" && tambon == "tam" && amphoe == "amp") {
        alert("เลือกข้อมูลจังหวัดที่ท่านสนใจ");
    }
    else {
        var a = $('#typedata').val()
        if (a == "TD0") {
            getchart(a)
        } else if (a == "TD1") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        } else if (a == "TD2") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        } else if (a == "TD3") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        } else if (a == "TD4") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        } else if (a == "TD5") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        } else if (a == "TD6") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        } else if (a == "TD7") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        } else if (a == "TD8") {
            getchart(a)
            // $('#legenddiv').css('height', '100px')
        }
    }
}
let getchart = (name) => {
    if (name == "TD1") {
        setdata1(d)
    } else if (name == "TD2") {
        setdata2(d)
    } else if (name == "") {
        setdata2_1(d)
    } else if (name == "TD3") {
        setdata3(d)
    } else if (name == "") {
        setdata4(d)
    } else if (name == "TD4") {
        setdata4_1(d)
    } else if (name == "TD5") {
        setdata5_1(d)
    } else if (name == "TD6") {
        setdata6(d)
    } else if (name == "TD7") {
        setdata7(d)
    } else if (name == "TD8") {
        setdata8(d)
    } else if (name == "TD0") {
        setdata0(d)
    }


}
let getchart_v2 = () => {
    setdata0(d)
    setdata1(d)
    setdata2(d)
    setdata3(d)

    setdata4_1(d)
    setdata5_1(d)
    setdata6(d)
    setdata7(d)
    setdata8(d)
    // $('#Allchart').slideDown();
    // setdata4(d)
}
$('#Allchart').hide();
let setdata0 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()

    let x_filter = x.filter(e => e.prov_code == prov)

    var data_amp = []
    var data_tam = []
    // var url = "http://localhost:3000";
    if (prov !== "TH" && amphoe == "amp") {
        $('#Hchart1').html("ข้อมูลจำนวนแปลงในพื้นที่จ." + prov_n)
        axios.post(url + `/th/amphoe`, { pv_code: prov }).then(async (r) => {
            var d = r.data.data;
            d.map(i => {
                let w = x_filter.filter(e => e.amp_code == i.ap_idn)
                // console.log(w)
                if (w.length > 0) {
                    data_amp.push({
                        "country": w[0].amp_tn, "visits": w.length,
                    })
                }
            })
            chart1(data_amp, "chart1")
        })
    } else if (prov !== "TH" && amphoe !== "amp") {
        axios.post(url + `/th/tambon`, { ap_idn: amphoe }).then(async (r) => {
            $('#Hchart1').html("ข้อมูลจำนวนแปลงในพื้นที่จ." + prov_n + " " + "อ." + amp_n)
            var d = r.data.data;
            d.map(i => {
                let w = x_filter.filter(e => e.tam_code == i.tb_idn)
                if (w.length > 0) {
                    data_tam.push({
                        "country": w[0].tam_tn, "visits": w.length,
                    })
                }
            })
            // console.log(data_tam)
            chart1(data_tam, "chart1")
        })
    }

    // chart(data)
}
let setdata1 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart2').html("ข้อมูลการถือครองที่ดินเพาะปลูกในพื้นที่จ." + prov_n)

        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.landowner == 'เช่า')
        var a1 = a0.filter(e => e.landusefarm == "สปก")
        var a2 = a0.filter(e => e.landusefarm == "โฉนด/นส3")
        var a3 = a0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var b0 = x_filter.filter(e => e.landowner == 'ตนเอง/คนในครอบครัว')
        // console.log(x_filter)
        // console.log(b0)
        var b1 = b0.filter(e => e.landusefarm == "สปก")
        var b2 = b0.filter(e => e.landusefarm == "โฉนด/นส3")
        var b3 = b0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var c0 = x_filter.filter(e => e.landowner !== 'เช่า' && e.landowner !== 'ตนเอง/คนในครอบครัว')
        var c1 = c0.filter(e => e.landusefarm == "สปก")
        var c2 = c0.filter(e => e.landusefarm == "โฉนด/นส3")
        var c3 = c0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var data = []
        data.push({
            "country": "เช่า",
            "litres": a0.length,
            "subData": [{ name: "สปก.", value: a1.length }, { name: "โฉนด/นส3.", value: a2.length }, { name: "อื่นๆ", value: a3.length }]
        }, {
            "country": "ตนเองหรือคนในครอบครัว",
            "litres": b0.length,
            "subData": [{ name: "สปก.", value: b1.length }, { name: "โฉนด/นส3.", value: b2.length }, { name: "อื่นๆ", value: b3.length }]
        }, {
            "country": "อื่นๆ",
            "litres": c0.length,
            "subData": [{ name: "สปก.", value: c1.length }, { name: "โฉนด/นส3.", value: c2.length }, { name: "อื่นๆ", value: c3.length }]
        })
        chart2(data, "chart2", "legenddiv2")
    }
    else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {

        $('#Hchart2').html("ข้อมูลการถือครองที่ดินเพาะปลูกในพื้นที่จ." + prov_n + " " + "อ." + amp_n)

        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.landowner == 'เช่า')
        var a1 = a0.filter(e => e.landusefarm == "สปก")
        var a2 = a0.filter(e => e.landusefarm == "โฉนด/นส3")
        var a3 = a0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var b0 = x_filter.filter(e => e.landowner == 'ตนเอง/คนในครอบครัว')
        var b1 = b0.filter(e => e.landusefarm == "สปก")
        var b2 = b0.filter(e => e.landusefarm == "โฉนด/นส3")
        var b3 = b0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var c0 = x_filter.filter(e => e.landowner !== 'เช่า' && e.landowner !== 'ตนเอง/คนในครอบครัว')
        var c1 = c0.filter(e => e.landusefarm == "สปก")
        var c2 = c0.filter(e => e.landusefarm == "โฉนด/นส3")
        var c3 = c0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var data = []
        data.push({
            "country": "เช่า",
            "litres": a0.length,
            "subData": [{ name: "สปก.", value: a1.length }, { name: "โฉนด/นส3.", value: a2.length }, { name: "อื่นๆ", value: a3.length }]
        }, {
            "country": "ตนเองหรือคนในครอบครัว",
            "litres": b0.length,
            "subData": [{ name: "สปก.", value: b1.length }, { name: "โฉนด/นส3.", value: b2.length }, { name: "อื่นๆ", value: b3.length }]
        }, {
            "country": "อื่นๆ",
            "litres": c0.length,
            "subData": [{ name: "สปก.", value: c1.length }, { name: "โฉนด/นส3.", value: c2.length }, { name: "อื่นๆ", value: c3.length }]
        })
        chart2(data, "chart2", "legenddiv2")
    } else {

        $('#Hchart2').html("ข้อมูลการถือครองที่ดินเพาะปลูกในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)
        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.landowner == 'เช่า')
        var a1 = a0.filter(e => e.landusefarm == "สปก")
        var a2 = a0.filter(e => e.landusefarm == "โฉนด/นส3")
        var a3 = a0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var b0 = x_filter.filter(e => e.landowner == 'ตนเอง/คนในครอบครัว')
        var b1 = b0.filter(e => e.landusefarm == "สปก")
        var b2 = b0.filter(e => e.landusefarm == "โฉนด/นส3")
        var b3 = b0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var c0 = x_filter.filter(e => e.landowner !== 'เช่า' && e.landowner !== 'ตนเอง/คนในครอบครัว')
        var c1 = c0.filter(e => e.landusefarm == "สปก")
        var c2 = c0.filter(e => e.landusefarm == "โฉนด/นส3")
        var c3 = c0.filter(e => e.landusefarm !== "สปก" && e.landusefarm !== "โฉนด/นส3")

        var data = []
        data.push({
            "country": "เช่า",
            "litres": a0.length,
            "subData": [{ name: "สปก.", value: a1.length }, { name: "โฉนด/นส3.", value: a2.length }, { name: "อื่นๆ", value: a3.length }]
        }, {
            "country": "ตนเองหรือคนในครอบครัว",
            "litres": b0.length,
            "subData": [{ name: "สปก.", value: b1.length }, { name: "โฉนด/นส3.", value: b2.length }, { name: "อื่นๆ", value: b3.length }]
        }, {
            "country": "อื่นๆ",
            "litres": c0.length,
            "subData": [{ name: "สปก.", value: c1.length }, { name: "โฉนด/นส3.", value: c2.length }, { name: "อื่นๆ", value: c3.length }]
        })
        chart2(data, "chart2", "legenddiv2")
    }
}
let setdata2 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart3').html("ข้อมูลรูปแบบการผลิตในพื้นที่จ." + prov_n)

        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.productmodel == 'เกษตรอินทรีย์')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.productmodel == 'เกษตรปลอดภัย')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.productmodel == 'เกษตรผสมผสาน')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.productmodel == 'เกษตรเชิงเดียว')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var e0 = x_filter.filter(e => e.productmodel == 'วนเกษตร')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.productmodel !== 'เกษตรอินทรีย์' && e.productmodel !== 'เกษตรปลอดภัย' && e.productmodel !== 'เกษตรผสมผสาน' && e.productmodel !== 'เกษตรเชิงเดียว' && e.productmodel !== 'วนเกษตร')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "เกษตรอินทรีย์",
            "value": a0.length,
            "color": am4core.color("#4a7c59"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "เกษตรปลอดภัย",
            "value": b0.length,
            "color": am4core.color("#68b0ab"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "เกษตรผสมผสาน",
            "value": c0.length,
            "color": am4core.color("#8fc0a9"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "เกษตรเชิงเดียว",
            "value": d0.length,
            "color": am4core.color("#c8d5b9"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "วนเกษตร",
            "value": e0.length,
            "color": am4core.color("#faf3dd"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart3")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {

        $('#Hchart3').html("ข้อมูลรูปแบบการผลิตในพื้นที่จ." + prov_n + " " + "อ." + amp_n)
        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.productmodel == 'เกษตรอินทรีย์')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.productmodel == 'เกษตรปลอดภัย')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.productmodel == 'เกษตรผสมผสาน')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.productmodel == 'เกษตรเชิงเดียว')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")


        var e0 = x_filter.filter(e => e.productmodel == 'วนเกษตร')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.productmodel !== 'เกษตรอินทรีย์' && e.productmodel !== 'เกษตรปลอดภัย' && e.productmodel !== 'เกษตรผสมผสาน' && e.productmodel !== 'เกษตรเชิงเดียว' && e.productmodel !== 'วนเกษตร')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "เกษตรอินทรีย์",
            "value": a0.length,
            "color": am4core.color("#4a7c59"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "เกษตรปลอดภัย",
            "value": b0.length,
            "color": am4core.color("#68b0ab"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "เกษตรผสมผสาน",
            "value": c0.length,
            "color": am4core.color("#8fc0a9"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "เกษตรเชิงเดียว",
            "value": d0.length,
            "color": am4core.color("#c8d5b9"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "วนเกษตร",
            "value": e0.length,
            "color": am4core.color("#faf3dd"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart3")
    } else {

        $('#Hchart3').html("ข้อมูลรูปแบบการผลิตในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)
        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.productmodel == 'เกษตรอินทรีย์')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.productmodel == 'เกษตรปลอดภัย')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.productmodel == 'เกษตรผสมผสาน')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.productmodel == 'เกษตรเชิงเดียว')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var e0 = x_filter.filter(e => e.productmodel == 'วนเกษตร')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.productmodel !== 'เกษตรอินทรีย์' && e.productmodel !== 'เกษตรปลอดภัย' && e.productmodel !== 'เกษตรผสมผสาน' && e.productmodel !== 'เกษตรเชิงเดียว' && e.productmodel !== 'วนเกษตร')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "เกษตรอินทรีย์",
            "value": a0.length,
            "color": am4core.color("#4a7c59"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "เกษตรปลอดภัย",
            "value": b0.length,
            "color": am4core.color("#68b0ab"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "เกษตรผสมผสาน",
            "value": c0.length,
            "color": am4core.color("#8fc0a9"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "เกษตรเชิงเดียว",
            "value": d0.length,
            "color": am4core.color("#c8d5b9"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "วนเกษตร",
            "value": e0.length,
            "color": am4core.color("#faf3dd"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart3")
    }
}
let setdata2_1 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.type1 == 'ข้าว')
        var b0 = x_filter.filter(e => e.type2 == "ผัก")
        var c0 = x_filter.filter(e => e.type3 == "ผลไม้")
        var d0 = x_filter.filter(e => e.type4 == "พืชสมุนไพร")
        var e0 = x_filter.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f0 = x_filter.filter(e => e.type6 == "ประมงน้ำจืด")
        var g0 = x_filter.filter(e => e.type7 == "ประมงชายฝั่ง")
        var h0 = x_filter.filter(e => e.type8 == "การแปรรูป")
        var i0 = x_filter.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "country": "ข้าว",
            "litres": a0.length,
        }, {
            "country": "ผัก",
            "litres": b0.length,
        }, {
            "country": "ผลไม้",
            "litres": c0.length,
        }, {
            "country": "พืชสมุนไพร",
            "litres": d0.length,
        }, {
            "country": "ปศุสัตว์/เพาะเลี้ยง",
            "litres": e0.length,
        }, {
            "country": "ประมงน้ำจืด",
            "litres": f0.length,
        }, {
            "country": "ประมงชายฝั่ง",
            "litres": g0.length,
        }, {
            "country": "การแปรรูป",
            "litres": h0.length,
        }, {
            "country": "อื่นๆ",
            "litres": i0.length,
        })
        chart3(data)
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {
        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.type1 == 'ข้าว')
        var b0 = x_filter.filter(e => e.type2 == "ผัก")
        var c0 = x_filter.filter(e => e.type3 == "ผลไม้")
        var d0 = x_filter.filter(e => e.type4 == "พืชสมุนไพร")
        var e0 = x_filter.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f0 = x_filter.filter(e => e.type6 == "ประมงน้ำจืด")
        var g0 = x_filter.filter(e => e.type7 == "ประมงชายฝั่ง")
        var h0 = x_filter.filter(e => e.type8 == "การแปรรูป")
        var i0 = x_filter.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "country": "ข้าว",
            "litres": a0.length,
        }, {
            "country": "ผัก",
            "litres": b0.length,
        }, {
            "country": "ผลไม้",
            "litres": c0.length,
        }, {
            "country": "พืชสมุนไพร",
            "litres": d0.length,
        }, {
            "country": "ปศุสัตว์/เพาะเลี้ยง",
            "litres": e0.length,
        }, {
            "country": "ประมงน้ำจืด",
            "litres": f0.length,
        }, {
            "country": "ประมงชายฝั่ง",
            "litres": g0.length,
        }, {
            "country": "การแปรรูป",
            "litres": h0.length,
        }, {
            "country": "อื่นๆ",
            "litres": i0.length,
        })
        chart3(data)
    } else {
        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.type1 == 'ข้าว')
        var b0 = x_filter.filter(e => e.type2 == "ผัก")
        var c0 = x_filter.filter(e => e.type3 == "ผลไม้")
        var d0 = x_filter.filter(e => e.type4 == "พืชสมุนไพร")
        var e0 = x_filter.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f0 = x_filter.filter(e => e.type6 == "ประมงน้ำจืด")
        var g0 = x_filter.filter(e => e.type7 == "ประมงชายฝั่ง")
        var h0 = x_filter.filter(e => e.type8 == "การแปรรูป")
        var i0 = x_filter.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "country": "ข้าว",
            "litres": a0.length,
        }, {
            "country": "ผัก",
            "litres": b0.length,
        }, {
            "country": "ผลไม้",
            "litres": c0.length,
        }, {
            "country": "พืชสมุนไพร",
            "litres": d0.length,
        }, {
            "country": "ปศุสัตว์/เพาะเลี้ยง",
            "litres": e0.length,
        }, {
            "country": "ประมงน้ำจืด",
            "litres": f0.length,
        }, {
            "country": "ประมงชายฝั่ง",
            "litres": g0.length,
        }, {
            "country": "การแปรรูป",
            "litres": h0.length,
        }, {
            "country": "อื่นๆ",
            "litres": i0.length,
        })
        chart3(data)
    }
}
let setdata3 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart4').html("ข้อมูลมาตรฐานการรับรองในพื้นที่จ." + prov_n)

        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.standard == 'ได้รับมาตรฐานรับรอง')
        var a1 = a0.filter(e => e.standardtype == "PGS")
        var a2 = a0.filter(e => e.standardtype == "มาตรฐานสากล")
        var a3 = a0.filter(e => e.standardtype == "ไม่ระบุ")
        var a4 = a0.filter(e => e.standardtype !== "PGS" && e.standardtype !== "มาตรฐานสากล" && e.standardtype !== "ไม่ระบุ")

        var b0 = x_filter.filter(e => e.standard == 'ยังไม่ได้รับมาตรฐานรับรอง')
        // var b1 = b0.filter(e => e.standardtype == "PGS")
        // var b2 = b0.filter(e => e.standardtype == "มาตรฐานสากล")
        // var b3 = b0.filter(e => e.standardtype == "ไม่ระบุ")
        // var b4 = b0.filter(e => e.standardtype !== "PGS" && e.standardtype !== "มาตรฐานสากล" && e.standardtype !== "ไม่ระบุ")

        var c0 = x_filter.filter(e => e.standard == 'ไม่ระบุ')
        // var c1 = c0.filter(e => e.standardtype == "PGS")
        // var c2 = c0.filter(e => e.standardtype == "มาตรฐานสากล")
        // var c3 = c0.filter(e => e.standardtype == "ไม่ระบุ")
        // var c4 = c0.filter(e => e.standardtype !== "PGS" && e.standardtype !== "มาตรฐานสากล" && e.standardtype !== "ไม่ระบุ")

        var data = []
        data.push({
            "country": "ได้รับการรับรอง",
            "litres": a0.length,
            "subData": [{ name: "PGS", value: a1.length }, { name: "มาตรฐานสากล", value: a2.length }, { name: "ไม่ระบุ", value: a3.length }, { name: "อื่นๆ", value: a4.length }]
        }, {
            "country": "ไม่ได้รับการรับรอง",
            "litres": b0.length,
            "subData": [{ name: "ไม่ได้รับการรับรอง", value: 1 }]
            // "subData": [{name: "PGS", value: 0 }, {name: "มาตรฐานสากล", value: 0 }, {name: "ไม่ระบุ", value: 0 }, {name: "อื่นๆ", value: 0 }]
        }, {
            "country": "ไม่ระบุ",
            "litres": c0.length,
            "subData": [{ name: "ไม่ระบุ", value: 1 }]
            // "subData": [{name: "PGS", value: 0 }, {name: "มาตรฐานสากล", value: 0 }, {name: "ไม่ระบุ", value: 0 }, {name: "อื่นๆ", value: 0 }]
        })
        chart2(data, "chart4")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {

        $('#Hchart4').html("ข้อมูลมาตรฐานการรับรองในพื้นที่จ." + prov_n + " " + "อ." + amp_n)
        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.standard == 'ได้รับมาตรฐานรับรอง')
        var a1 = a0.filter(e => e.standardtype == "PGS")
        var a2 = a0.filter(e => e.standardtype == "มาตรฐานสากล")
        var a3 = a0.filter(e => e.standardtype == "ไม่ระบุ")
        var a4 = a0.filter(e => e.standardtype !== "PGS" && e.standardtype !== "มาตรฐานสากล" && e.standardtype !== "ไม่ระบุ")

        var b0 = x_filter.filter(e => e.standard == 'ยังไม่ได้รับมาตรฐานรับรอง')
        var c0 = x_filter.filter(e => e.standard == 'ไม่ระบุ')

        var data = []
        data.push({
            "country": "ได้รับการรับรอง",
            "litres": a0.length,
            "subData": [{ name: "PGS", value: a1.length }, { name: "มาตรฐานสากล", value: a2.length }, { name: "ไม่ระบุ", value: a3.length }, { name: "อื่นๆ", value: a4.length }]
        }, {
            "country": "ไม่ได้รับการรับรอง",
            "litres": b0.length,
            "subData": [{ name: "ไม่ได้รับการรับรอง", value: 1 }]
            // "subData": [{name: "PGS", value: 0 }, {name: "มาตรฐานสากล", value: 0 }, {name: "ไม่ระบุ", value: 0 }, {name: "อื่นๆ", value: 0 }]
        }, {
            "country": "ไม่ระบุ",
            "litres": c0.length,
            "subData": [{ name: "ไม่ระบุ", value: 1 }]
            // "subData": [{name: "PGS.", value: 0 }, {name: "มาตรฐานสากล", value: 0 }, {name: "ไม่ระบุ", value: 0 }, {name: "อื่นๆ", value: 0 }]
        })
        chart2(data, "chart4")
    } else {
        $('#Hchart4').html("ข้อมูลมาตรฐานการรับรองในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)
        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.standard == 'ได้รับมาตรฐานรับรอง')
        var a1 = a0.filter(e => e.standardtype == "PGS")
        var a2 = a0.filter(e => e.standardtype == "มาตรฐานสากล")
        var a3 = a0.filter(e => e.standardtype == "ไม่ระบุ")
        var a4 = a0.filter(e => e.standardtype !== "PGS" && e.standardtype !== "มาตรฐานสากล" && e.standardtype !== "ไม่ระบุ")

        var b0 = x_filter.filter(e => e.standard == 'ยังไม่ได้รับมาตรฐานรับรอง')
        var c0 = x_filter.filter(e => e.standard == 'ไม่ระบุ')

        var data = []
        data.push({
            "country": "ได้รับการรับรอง",
            "litres": a0.length,
            "subData": [{ name: "PGS", value: a1.length }, { name: "มาตรฐานสากล", value: a2.length }, { name: "ไม่ระบุ", value: a3.length }, { name: "อื่นๆ", value: a4.length }]
        }, {
            "country": "ไม่ได้รับการรับรอง",
            "litres": b0.length,
            "subData": [{ name: "ไม่ได้รับการรับรอง", value: 1 }]
            // "subData": [{name: "PGS", value: 0 }, {name: "มาตรฐานสากล", value: 0 }, {name: "ไม่ระบุ", value: 0 }, {name: "อื่นๆ", value: 0 }]
        }, {
            "country": "ไม่ระบุ",
            "litres": c0.length,
            "subData": [{ name: "ไม่ระบุ", value: 1 }]
            // "subData": [{name: "PGS", value: 0 }, {name: "มาตรฐานสากล", value: 0 }, {name: "ไม่ระบุ", value: 0 }, {name: "อื่นๆ", value: 0 }]
        })
        chart2(data, "chart4")
    }
}
let setdata4 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.type1 == 'ข้าว')
        var a1 = a0.filter(e => e.aver_in == "5000")
        var a2 = a0.filter(e => e.aver_in == "10000")
        var a3 = a0.filter(e => e.aver_in == "25000")
        var a4 = a0.filter(e => e.aver_in == "50000")
        var a5 = a0.filter(e => e.aver_in == "50001")
        var a6 = a0.filter(e => e.aver_in == "ไม่ระบุ")

        var b0 = x_filter.filter(e => e.type2 == "ผัก")
        var b1 = b0.filter(e => e.aver_in == "5000")
        var b2 = b0.filter(e => e.aver_in == "10000")
        var b3 = b0.filter(e => e.aver_in == "25000")
        var b4 = b0.filter(e => e.aver_in == "50000")
        var b5 = b0.filter(e => e.aver_in == "50001")
        var b6 = b0.filter(e => e.aver_in !== "ไม่ระบุ")

        var c0 = x_filter.filter(e => e.type3 == "ผลไม้")
        var c1 = c0.filter(e => e.aver_in == "5000")
        var c2 = c0.filter(e => e.aver_in == "10000")
        var c3 = c0.filter(e => e.aver_in == "25000")
        var c4 = c0.filter(e => e.aver_in == "50000")
        var c5 = c0.filter(e => e.aver_in == "50001")
        var c6 = c0.filter(e => e.aver_in == "ไม่ระบุ")

        var d0 = x_filter.filter(e => e.type4 == "พืชสมุนไพร")
        var d1 = d0.filter(e => e.aver_in == "5000")
        var d2 = d0.filter(e => e.aver_in == "10000")
        var d3 = d0.filter(e => e.aver_in == "25000")
        var d4 = d0.filter(e => e.aver_in == "50000")
        var d5 = d0.filter(e => e.aver_in == "50001")
        var d6 = d0.filter(e => e.aver_in == "ไม่ระบุ")

        var e0 = x_filter.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e1 = e0.filter(e => e.aver_in == "5000")
        var e2 = e0.filter(e => e.aver_in == "10000")
        var e3 = e0.filter(e => e.aver_in == "25000")
        var e4 = e0.filter(e => e.aver_in == "50000")
        var e5 = e0.filter(e => e.aver_in == "50001")
        var e6 = e0.filter(e => e.aver_in == "ไม่ระบุ")

        var f0 = x_filter.filter(e => e.type6 == "ประมงน้ำจืด")
        var f1 = f0.filter(e => e.aver_in == "5000")
        var f2 = f0.filter(e => e.aver_in == "10000")
        var f3 = f0.filter(e => e.aver_in == "25000")
        var f4 = f0.filter(e => e.aver_in == "50000")
        var f5 = f0.filter(e => e.aver_in == "50001")
        var f6 = f0.filter(e => e.aver_in == "ไม่ระบุ")

        var g0 = x_filter.filter(e => e.type7 == "ประมงชายฝั่ง")
        var g1 = g0.filter(e => e.aver_in == "5000")
        var g2 = g0.filter(e => e.aver_in == "10000")
        var g3 = g0.filter(e => e.aver_in == "25000")
        var g4 = g0.filter(e => e.aver_in == "50000")
        var g5 = g0.filter(e => e.aver_in == "50001")
        var g6 = g0.filter(e => e.aver_in == "ไม่ระบุ")

        var h0 = x_filter.filter(e => e.type8 == "การแปรรูป")
        var h1 = h0.filter(e => e.aver_in == "5000")
        var h2 = h0.filter(e => e.aver_in == "10000")
        var h3 = h0.filter(e => e.aver_in == "25000")
        var h4 = h0.filter(e => e.aver_in == "50000")
        var h5 = h0.filter(e => e.aver_in == "50001")
        var h6 = h0.filter(e => e.aver_in == "ไม่ระบุ")

        var i0 = x_filter.filter(e => e.type9 == "อื่นๆ")
        var i1 = i0.filter(e => e.aver_in == "5000")
        var i2 = i0.filter(e => e.aver_in == "10000")
        var i3 = i0.filter(e => e.aver_in == "25000")
        var i4 = i0.filter(e => e.aver_in == "50000")
        var i5 = i0.filter(e => e.aver_in == "50001")
        var i6 = i0.filter(e => e.aver_in == "ไม่ระบุ")

        var data = []
        data.push({
            "country": "ข้าว",
            "litres": a0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: a1.length }, { name: "5,001-10,000", value: a2.length }, { name: "10,001-25,000", value: a3.length }
                , { name: "25,001-50,000", value: a4.length }, { name: "มากกว่า 50,000", value: a5.length }, { name: "ไม่ระบุ", value: a6.length }]
        }, {
            "country": "ผัก",
            "litres": b0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: b1.length }, { name: "5,001-10,000", value: b2.length }, { name: "10,001-25,000", value: b3.length }
                , { name: "25,001-50,000", value: b4.length }, { name: "มากกว่า 50,000", value: b5.length }, { name: "ไม่ระบุ", value: b6.length }]
        }, {
            "country": "ผลไม้",
            "litres": c0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: c1.length }, { name: "5,001-10,000", value: c2.length }, { name: "10,001-25,000", value: c3.length }
                , { name: "25,001-50,000", value: c4.length }, { name: "มากกว่า 50,000", value: c5.length }, { name: "ไม่ระบุ", value: c6.length }]
        }, {
            "country": "พืชสมุนไพร",
            "litres": d0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: d1.length }, { name: "5,001-10,000", value: d2.length }, { name: "10,001-25,000", value: d3.length }
                , { name: "25,001-50,000", value: d4.length }, { name: "มากกว่า 50,000", value: d5.length }, { name: "ไม่ระบุ", value: d6.length }]
        }, {
            "country": "ปศุสัตว์/เพาะเลี้ยง",
            "litres": e0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: e1.length }, { name: "5,001-10,000", value: e2.length }, { name: "10,001-25,000", value: e3.length }
                , { name: "25,001-50,000", value: e4.length }, { name: "มากกว่า 50,000", value: e5.length }, { name: "ไม่ระบุ", value: e6.length }]
        }, {
            "country": "ประมงน้ำจืด",
            "litres": f0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: f1.length }, { name: "5,001-10,000", value: f2.length }, { name: "10,001-25,000", value: f3.length }
                , { name: "25,001-50,000", value: f4.length }, { name: "มากกว่า 50,000", value: f5.length }, { name: "ไม่ระบุ", value: f6.length }]
        }, {
            "country": "ประมงชายฝั่ง",
            "litres": g0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: g1.length }, { name: "5,001-10,000", value: g2.length }, { name: "10,001-25,000", value: g3.length }
                , { name: "25,001-50,000", value: g4.length }, { name: "มากกว่า 50,000", value: g5.length }, { name: "ไม่ระบุ", value: g6.length }]
        }, {
            "country": "การแปรรูป",
            "litres": h0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: h1.length }, { name: "5,001-10,000", value: h2.length }, { name: "10,001-25,000", value: h3.length }
                , { name: "25,001-50,000", value: h4.length }, { name: "มากกว่า 50,000", value: h5.length }, { name: "ไม่ระบุ", value: h6.length }]
        }, {
            "country": "อื่นๆ",
            "litres": i0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: i1.length }, { name: "5,001-10,000", value: i2.length }, { name: "10,001-25,000", value: i3.length }
                , { name: "25,001-50,000", value: i4.length }, { name: "มากกว่า 50,000", value: i5.length }, { name: "ไม่ระบุ", value: i6.length }]
        })
        chart2(data, "chart5", "legenddiv5")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {
        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.type1 == 'ข้าว')
        var a1 = a0.filter(e => e.aver_in == "5000")
        var a2 = a0.filter(e => e.aver_in == "10000")
        var a3 = a0.filter(e => e.aver_in == "25000")
        var a4 = a0.filter(e => e.aver_in == "50000")
        var a5 = a0.filter(e => e.aver_in == "50001")
        var a6 = a0.filter(e => e.aver_in == "ไม่ระบุ")

        var b0 = x_filter.filter(e => e.type2 == "ผัก")
        var b1 = b0.filter(e => e.aver_in == "5000")
        var b2 = b0.filter(e => e.aver_in == "10000")
        var b3 = b0.filter(e => e.aver_in == "25000")
        var b4 = b0.filter(e => e.aver_in == "50000")
        var b5 = b0.filter(e => e.aver_in == "50001")
        var b6 = b0.filter(e => e.aver_in !== "ไม่ระบุ")

        var c0 = x_filter.filter(e => e.type3 == "ผลไม้")
        var c1 = c0.filter(e => e.aver_in == "5000")
        var c2 = c0.filter(e => e.aver_in == "10000")
        var c3 = c0.filter(e => e.aver_in == "25000")
        var c4 = c0.filter(e => e.aver_in == "50000")
        var c5 = c0.filter(e => e.aver_in == "50001")
        var c6 = c0.filter(e => e.aver_in == "ไม่ระบุ")

        var d0 = x_filter.filter(e => e.type4 == "พืชสมุนไพร")
        var d1 = d0.filter(e => e.aver_in == "5000")
        var d2 = d0.filter(e => e.aver_in == "10000")
        var d3 = d0.filter(e => e.aver_in == "25000")
        var d4 = d0.filter(e => e.aver_in == "50000")
        var d5 = d0.filter(e => e.aver_in == "50001")
        var d6 = d0.filter(e => e.aver_in == "ไม่ระบุ")

        var e0 = x_filter.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e1 = e0.filter(e => e.aver_in == "5000")
        var e2 = e0.filter(e => e.aver_in == "10000")
        var e3 = e0.filter(e => e.aver_in == "25000")
        var e4 = e0.filter(e => e.aver_in == "50000")
        var e5 = e0.filter(e => e.aver_in == "50001")
        var e6 = e0.filter(e => e.aver_in == "ไม่ระบุ")

        var f0 = x_filter.filter(e => e.type6 == "ประมงน้ำจืด")
        var f1 = f0.filter(e => e.aver_in == "5000")
        var f2 = f0.filter(e => e.aver_in == "10000")
        var f3 = f0.filter(e => e.aver_in == "25000")
        var f4 = f0.filter(e => e.aver_in == "50000")
        var f5 = f0.filter(e => e.aver_in == "50001")
        var f6 = f0.filter(e => e.aver_in == "ไม่ระบุ")

        var g0 = x_filter.filter(e => e.type7 == "ประมงชายฝั่ง")
        var g1 = g0.filter(e => e.aver_in == "5000")
        var g2 = g0.filter(e => e.aver_in == "10000")
        var g3 = g0.filter(e => e.aver_in == "25000")
        var g4 = g0.filter(e => e.aver_in == "50000")
        var g5 = g0.filter(e => e.aver_in == "50001")
        var g6 = g0.filter(e => e.aver_in == "ไม่ระบุ")

        var h0 = x_filter.filter(e => e.type8 == "การแปรรูป")
        var h1 = h0.filter(e => e.aver_in == "5000")
        var h2 = h0.filter(e => e.aver_in == "10000")
        var h3 = h0.filter(e => e.aver_in == "25000")
        var h4 = h0.filter(e => e.aver_in == "50000")
        var h5 = h0.filter(e => e.aver_in == "50001")
        var h6 = h0.filter(e => e.aver_in == "ไม่ระบุ")

        var i0 = x_filter.filter(e => e.type9 == "อื่นๆ")
        var i1 = i0.filter(e => e.aver_in == "5000")
        var i2 = i0.filter(e => e.aver_in == "10000")
        var i3 = i0.filter(e => e.aver_in == "25000")
        var i4 = i0.filter(e => e.aver_in == "50000")
        var i5 = i0.filter(e => e.aver_in == "50001")
        var i6 = i0.filter(e => e.aver_in == "ไม่ระบุ")

        var data = []
        data.push({
            "country": "ข้าว",
            "litres": a0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: a1.length }, { name: "5,001-10,000", value: a2.length }, { name: "10,001-25,000", value: a3.length }
                , { name: "25,001-50,000", value: a4.length }, { name: "มากกว่า 50,000", value: a5.length }, { name: "ไม่ระบุ", value: a6.length }]
        }, {
            "country": "ผัก",
            "litres": b0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: b1.length }, { name: "5,001-10,000", value: b2.length }, { name: "10,001-25,000", value: b3.length }
                , { name: "25,001-50,000", value: b4.length }, { name: "มากกว่า 50,000", value: b5.length }, { name: "ไม่ระบุ", value: b6.length }]
        }, {
            "country": "ผลไม้",
            "litres": c0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: c1.length }, { name: "5,001-10,000", value: c2.length }, { name: "10,001-25,000", value: c3.length }
                , { name: "25,001-50,000", value: c4.length }, { name: "มากกว่า 50,000", value: c5.length }, { name: "ไม่ระบุ", value: c6.length }]
        }, {
            "country": "พืชสมุนไพร",
            "litres": d0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: d1.length }, { name: "5,001-10,000", value: d2.length }, { name: "10,001-25,000", value: d3.length }
                , { name: "25,001-50,000", value: d4.length }, { name: "มากกว่า 50,000", value: d5.length }, { name: "ไม่ระบุ", value: d6.length }]
        }, {
            "country": "ปศุสัตว์/เพาะเลี้ยง",
            "litres": e0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: e1.length }, { name: "5,001-10,000", value: e2.length }, { name: "10,001-25,000", value: e3.length }
                , { name: "25,001-50,000", value: e4.length }, { name: "มากกว่า 50,000", value: e5.length }, { name: "ไม่ระบุ", value: e6.length }]
        }, {
            "country": "ประมงน้ำจืด",
            "litres": f0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: f1.length }, { name: "5,001-10,000", value: f2.length }, { name: "10,001-25,000", value: f3.length }
                , { name: "25,001-50,000", value: f4.length }, { name: "มากกว่า 50,000", value: f5.length }, { name: "ไม่ระบุ", value: f6.length }]
        }, {
            "country": "ประมงชายฝั่ง",
            "litres": g0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: g1.length }, { name: "5,001-10,000", value: g2.length }, { name: "10,001-25,000", value: g3.length }
                , { name: "25,001-50,000", value: g4.length }, { name: "มากกว่า 50,000", value: g5.length }, { name: "ไม่ระบุ", value: g6.length }]
        }, {
            "country": "การแปรรูป",
            "litres": h0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: h1.length }, { name: "5,001-10,000", value: h2.length }, { name: "10,001-25,000", value: h3.length }
                , { name: "25,001-50,000", value: h4.length }, { name: "มากกว่า 50,000", value: h5.length }, { name: "ไม่ระบุ", value: h6.length }]
        }, {
            "country": "อื่นๆ",
            "litres": i0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: i1.length }, { name: "5,001-10,000", value: i2.length }, { name: "10,001-25,000", value: i3.length }
                , { name: "25,001-50,000", value: i4.length }, { name: "มากกว่า 50,000", value: i5.length }, { name: "ไม่ระบุ", value: i6.length }]
        })
        chart2(data, "chart5", "legenddiv5")
    } else {
        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.type1 == 'ข้าว')
        var a1 = a0.filter(e => e.aver_in == "5000")
        var a2 = a0.filter(e => e.aver_in == "10000")
        var a3 = a0.filter(e => e.aver_in == "25000")
        var a4 = a0.filter(e => e.aver_in == "50000")
        var a5 = a0.filter(e => e.aver_in == "50001")
        var a6 = a0.filter(e => e.aver_in == "ไม่ระบุ")

        var b0 = x_filter.filter(e => e.type2 == "ผัก")
        var b1 = b0.filter(e => e.aver_in == "5000")
        var b2 = b0.filter(e => e.aver_in == "10000")
        var b3 = b0.filter(e => e.aver_in == "25000")
        var b4 = b0.filter(e => e.aver_in == "50000")
        var b5 = b0.filter(e => e.aver_in == "50001")
        var b6 = b0.filter(e => e.aver_in !== "ไม่ระบุ")

        var c0 = x_filter.filter(e => e.type3 == "ผลไม้")
        var c1 = c0.filter(e => e.aver_in == "5000")
        var c2 = c0.filter(e => e.aver_in == "10000")
        var c3 = c0.filter(e => e.aver_in == "25000")
        var c4 = c0.filter(e => e.aver_in == "50000")
        var c5 = c0.filter(e => e.aver_in == "50001")
        var c6 = c0.filter(e => e.aver_in == "ไม่ระบุ")

        var d0 = x_filter.filter(e => e.type4 == "พืชสมุนไพร")
        var d1 = d0.filter(e => e.aver_in == "5000")
        var d2 = d0.filter(e => e.aver_in == "10000")
        var d3 = d0.filter(e => e.aver_in == "25000")
        var d4 = d0.filter(e => e.aver_in == "50000")
        var d5 = d0.filter(e => e.aver_in == "50001")
        var d6 = d0.filter(e => e.aver_in == "ไม่ระบุ")

        var e0 = x_filter.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e1 = e0.filter(e => e.aver_in == "5000")
        var e2 = e0.filter(e => e.aver_in == "10000")
        var e3 = e0.filter(e => e.aver_in == "25000")
        var e4 = e0.filter(e => e.aver_in == "50000")
        var e5 = e0.filter(e => e.aver_in == "50001")
        var e6 = e0.filter(e => e.aver_in == "ไม่ระบุ")

        var f0 = x_filter.filter(e => e.type6 == "ประมงน้ำจืด")
        var f1 = f0.filter(e => e.aver_in == "5000")
        var f2 = f0.filter(e => e.aver_in == "10000")
        var f3 = f0.filter(e => e.aver_in == "25000")
        var f4 = f0.filter(e => e.aver_in == "50000")
        var f5 = f0.filter(e => e.aver_in == "50001")
        var f6 = f0.filter(e => e.aver_in == "ไม่ระบุ")

        var g0 = x_filter.filter(e => e.type7 == "ประมงชายฝั่ง")
        var g1 = g0.filter(e => e.aver_in == "5000")
        var g2 = g0.filter(e => e.aver_in == "10000")
        var g3 = g0.filter(e => e.aver_in == "25000")
        var g4 = g0.filter(e => e.aver_in == "50000")
        var g5 = g0.filter(e => e.aver_in == "50001")
        var g6 = g0.filter(e => e.aver_in == "ไม่ระบุ")

        var h0 = x_filter.filter(e => e.type8 == "การแปรรูป")
        var h1 = h0.filter(e => e.aver_in == "5000")
        var h2 = h0.filter(e => e.aver_in == "10000")
        var h3 = h0.filter(e => e.aver_in == "25000")
        var h4 = h0.filter(e => e.aver_in == "50000")
        var h5 = h0.filter(e => e.aver_in == "50001")
        var h6 = h0.filter(e => e.aver_in == "ไม่ระบุ")

        var i0 = x_filter.filter(e => e.type9 == "อิ่นๆ")
        var i1 = i0.filter(e => e.aver_in == "5000")
        var i2 = i0.filter(e => e.aver_in == "10000")
        var i3 = i0.filter(e => e.aver_in == "25000")
        var i4 = i0.filter(e => e.aver_in == "50000")
        var i5 = i0.filter(e => e.aver_in == "50001")
        var i6 = i0.filter(e => e.aver_in == "ไม่ระบุ")

        var data = []
        data.push({
            "country": "ข้าว",
            "litres": a0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: a1.length }, { name: "5,001-10,000", value: a2.length }, { name: "10,001-25,000", value: a3.length }
                , { name: "25,001-50,000", value: a4.length }, { name: "มากกว่า 50,000", value: a5.length }, { name: "ไม่ระบุ", value: a6.length }]
        }, {
            "country": "ผัก",
            "litres": b0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: b1.length }, { name: "5,001-10,000", value: b2.length }, { name: "10,001-25,000", value: b3.length }
                , { name: "25,001-50,000", value: b4.length }, { name: "มากกว่า 50,000", value: b5.length }, { name: "ไม่ระบุ", value: b6.length }]
        }, {
            "country": "ผลไม้",
            "litres": c0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: c1.length }, { name: "5,001-10,000", value: c2.length }, { name: "10,001-25,000", value: c3.length }
                , { name: "25,001-50,000", value: c4.length }, { name: "มากกว่า 50,000", value: c5.length }, { name: "ไม่ระบุ", value: c6.length }]
        }, {
            "country": "พืชสมุนไพร",
            "litres": d0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: d1.length }, { name: "5,001-10,000", value: d2.length }, { name: "10,001-25,000", value: d3.length }
                , { name: "25,001-50,000", value: d4.length }, { name: "มากกว่า 50,000", value: d5.length }, { name: "ไม่ระบุ", value: d6.length }]
        }, {
            "country": "ปศุสัตว์/เพาะเลี้ยง",
            "litres": e0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: e1.length }, { name: "5,001-10,000", value: e2.length }, { name: "10,001-25,000", value: e3.length }
                , { name: "25,001-50,000", value: e4.length }, { name: "มากกว่า 50,000", value: e5.length }, { name: "ไม่ระบุ", value: e6.length }]
        }, {
            "country": "ประมงน้ำจืด",
            "litres": f0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: f1.length }, { name: "5,001-10,000", value: f2.length }, { name: "10,001-25,000", value: f3.length }
                , { name: "25,001-50,000", value: f4.length }, { name: "มากกว่า 50,000", value: f5.length }, { name: "ไม่ระบุ", value: f6.length }]
        }, {
            "country": "ประมงชายฝั่ง",
            "litres": g0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: g1.length }, { name: "5,001-10,000", value: g2.length }, { name: "10,001-25,000", value: g3.length }
                , { name: "25,001-50,000", value: g4.length }, { name: "มากกว่า 50,000", value: g5.length }, { name: "ไม่ระบุ", value: g6.length }]
        }, {
            "country": "การแปรรูป",
            "litres": h0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: h1.length }, { name: "5,001-10,000", value: h2.length }, { name: "10,001-25,000", value: h3.length }
                , { name: "25,001-50,000", value: h4.length }, { name: "มากกว่า 50,000", value: h5.length }, { name: "ไม่ระบุ", value: h6.length }]
        }, {
            "country": "อื่นๆ",
            "litres": i0.length,
            "subData": [{ name: "น้อยกว่า 5,000", value: i1.length }, { name: "5,001-10,000", value: i2.length }, { name: "10,001-25,000", value: i3.length }
                , { name: "25,001-50,000", value: i4.length }, { name: "มากกว่า 50,000", value: i5.length }, { name: "ไม่ระบุ", value: i6.length }]
        })
        chart2(data, "chart5", "legenddiv5")
    }
}
let setdata4_1 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart5').html("ข้อมูลรายได้เฉลี่ยต่อเดือนในพื้นที่จ." + prov_n)
        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.aver_in == '5000')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.aver_in == '10000')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.aver_in == '25000')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.aver_in == '50000')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")


        var e0 = x_filter.filter(e => e.aver_in == '50001')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.aver_in == 'ไม่ระบุ')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "น้อยกว่า 5,000 บาท",
            "value": a0.length,
            "color": am4core.color("#ffc971"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "5,001-10,000 บาท",
            "value": b0.length,
            "color": am4core.color("#ffb627"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "10,001-25,000 บาท",
            "value": c0.length,
            "color": am4core.color("#ff9505"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "25,001-50,000 บาท",
            "value": d0.length,
            "color": am4core.color("#e2711d"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "มากกว่า 50,000 บาท",
            "value": e0.length,
            "color": am4core.color("#cc5803"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "ไม่ระบุ",
            "value": f0.length,
            "color": am4core.color("#d6d6d6"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart5", "legenddiv5")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {

        $('#Hchart5').html("ข้อมูลรายได้เฉลี่ยต่อเดือนในพื้นที่จ." + prov_n + " " + "อ." + amp_n)
        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.aver_in == '5000')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.aver_in == '10000')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.aver_in == '25000')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.aver_in == '50000')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")


        var e0 = x_filter.filter(e => e.aver_in == '50001')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.aver_in == 'ไม่ระบุ')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "น้อยกว่า 5,000 บาท",
            "value": a0.length,
            "color": am4core.color("#ffc971"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "5,001-10,000 บาท",
            "value": b0.length,
            "color": am4core.color("#ffb627"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "10,001-25,000 บาท",
            "value": c0.length,
            "color": am4core.color("#ff9505"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "25,001-50,000 บาท",
            "value": d0.length,
            "color": am4core.color("#e2711d"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "มากกว่า 50,000 บาท",
            "value": e0.length,
            "color": am4core.color("#cc5803"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "ไม่ระบุ",
            "value": f0.length,
            "color": am4core.color("#d6d6d6"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart5", "legenddiv5")
    } else {
        $('#Hchart5').html("ข้อมูลรายได้เฉลี่ยต่อเดือนในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)
        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.aver_in == '5000')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.aver_in == '10000')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.aver_in == '25000')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.aver_in == '50000')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")


        var e0 = x_filter.filter(e => e.aver_in == '50001')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.aver_in == 'ไม่ระบุ')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "น้อยกว่า 5,000 บาท",
            "value": a0.length,
            "color": am4core.color("#ffc971"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "5,001-10,000 บาท",
            "value": b0.length,
            "color": am4core.color("#ffb627"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "10,001-25,000 บาท",
            "value": c0.length,
            "color": am4core.color("#ff9505"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "25,001-50,000 บาท",
            "value": d0.length,
            "color": am4core.color("#e2711d"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "มากกว่า 50,000 บาท",
            "value": e0.length,
            "color": am4core.color("#cc5803"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "ไม่ระบุ",
            "value": f0.length,
            "color": am4core.color("#d6d6d6"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart5", "legenddiv5")
    }
}
let setdata5_1 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart6').html("ข้อมูลต้นทุนการผลิตเฉลี่ยต่อเดือนในพื้นที่จ." + prov_n)
        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.aver_exp == '1000')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.aver_exp == '2500')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.aver_exp == '5000')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.aver_exp == '10000')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var e0 = x_filter.filter(e => e.aver_exp == '10001')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.aver_exp == 'ไม่ระบุ')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "น้อยกว่า 1,000 บาท",
            "value": a0.length,
            "color": am4core.color("#A2D2FF"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "1,001-2,500 บาท",
            "value": b0.length,
            "color": am4core.color("#bfd7ff"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "2,501-5,000 บาท",
            "value": c0.length,
            "color": am4core.color("#9bb1ff"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "5,001-10,000 บาท",
            "value": d0.length,
            "color": am4core.color("#788bff"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "country": "มากกว่า 10,000 บาท",
            "litres": e0.length,
            "color": am4core.color("#5465ff"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "ไม่ระบุ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart6")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {
        $('#Hchart6').html("ข้อมูลต้นทุนการผลิตเฉลี่ยต่อเดือนในพื้นที่จ." + prov_n + " " + "อ." + amp_n)

        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.aver_exp == '1000')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.aver_exp == '2500')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.aver_exp == '5000')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.aver_exp == '10000')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var e0 = x_filter.filter(e => e.aver_exp == '10001')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.aver_exp == 'ไม่ระบุ')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "น้อยกว่า 1,000 บาท",
            "value": a0.length,
            "color": am4core.color("#A2D2FF"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "1,001-2,500 บาท",
            "value": b0.length,
            "color": am4core.color("#bfd7ff"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "2,501-5,000 บาท",
            "value": c0.length,
            "color": am4core.color("#9bb1ff"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "5,001-10,000 บาท",
            "value": d0.length,
            "color": am4core.color("#788bff"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "country": "มากกว่า 10,000 บาท",
            "litres": e0.length,
            "color": am4core.color("#5465ff"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "ไม่ระบุ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart6")
    } else {
        $('#Hchart').html("ข้อมูลต้นทุนการผลิตเฉลี่ยต่อเดือนในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)

        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.aver_exp == '1000')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.aver_exp == '2500')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.aver_exp == '5000')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.aver_exp == '10000')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var e0 = x_filter.filter(e => e.aver_exp == '10001')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.aver_exp == 'ไม่ระบุ')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "น้อยกว่า 1,000 บาท",
            "value": a0.length,
            "color": am4core.color("#A2D2FF"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "1,001-2,500 บาท",
            "value": b0.length,
            "color": am4core.color("#bfd7ff"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "2,501-5,000 บาท",
            "value": c0.length,
            "color": am4core.color("#9bb1ff"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "5,001-10,000 บาท",
            "value": d0.length,
            "color": am4core.color("#788bff"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "country": "มากกว่า 10,000 บาท",
            "litres": e0.length,
            "color": am4core.color("#5465ff"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "ไม่ระบุ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart6")
    }
}
let setdata6 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart7').html("ข้อมูลการนำผลผลิตมาใช้ประโยชน์ในพื้นที่จ." + prov_n)

        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.ucook !== 'ไม่มี')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.uexchange !== 'ไม่มี')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.utranform !== 'ไม่มี')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.umiddleman !== 'ไม่มี')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")


        var e0 = x_filter.filter(e => e.u_no !== 'ไม่มี')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.uother !== "Havenot" && e.uother !== 'other' && e.uother !== 'ไม่มี' && e.uother !== null)
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "ใช้ประกอบการทำอาหารในครัวเรือน",
            "value": a0.length,
            "color": am4core.color("#ff5a5f"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "นำมาแลกเปลี่ยนกันในชุมชน",
            "value": b0.length,
            "color": am4core.color("#bfd7ea"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "นำไปแปรรูป",
            "value": c0.length,
            "color": am4core.color("#82c0cc"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "ส่งให้พ่อค้าคนกลาง",
            "value": d0.length,
            "color": am4core.color("#087e8b"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "ไม่มีการนำไปใช้ประโยชน์",
            "value": e0.length,
            "color": am4core.color("#0b3954"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        // console.log(f0)
        chart4(data, "chart7")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {
        $('#Hchart7').html("ข้อมูลการนำผลผลิตมาใช้ประโยชน์ในพื้นที่จ." + prov_n + " " + "อ." + amp_n)

        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.ucook !== 'ไม่มี')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.uexchange !== 'ไม่มี')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.utranform !== 'ไม่มี')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.umiddleman !== 'ไม่มี')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var e0 = x_filter.filter(e => e.u_no !== 'ไม่มี')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.uother !== "Havenot" && e.uother !== 'other' && e.uother !== 'ไม่มี' && e.uother !== null)
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "ใช้ประกอบการทำอาหารในครัวเรือน",
            "value": a0.length,
            "color": am4core.color("#ff5a5f"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "นำมาแลกเปลี่ยนกันในชุมชน",
            "value": b0.length,
            "color": am4core.color("#bfd7ea"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "นำไปแปรรูป",
            "value": c0.length,
            "color": am4core.color("#82c0cc"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "ส่งให้พ่อค้าคนกลาง",
            "value": d0.length,
            "color": am4core.color("#087e8b"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "ไม่มีการนำไปใช้ประโยชน์",
            "value": e0.length,
            "color": am4core.color("#0b3954"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart7")
    } else {
        $('#Hchart7').html("ข้อมูลการนำผลผลิตมาใช้ประโยชน์ในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)

        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.ucook !== 'ไม่มี')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.uexchange !== 'ไม่มี')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.utranform !== 'ไม่มี')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.umiddleman !== 'ไม่มี')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var e0 = x_filter.filter(e => e.u_no !== 'ไม่มี')
        var e1 = e0.filter(e => e.type1 == "ข้าว")
        var e2 = e0.filter(e => e.type2 == "ผัก")
        var e3 = e0.filter(e => e.type3 == "ผลไม้")
        var e4 = e0.filter(e => e.type4 == "พืชสมุนไพร")
        var e5 = e0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var e6 = e0.filter(e => e.type6 == "ประมงน้ำจืด")
        var e7 = e0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var e8 = e0.filter(e => e.type8 == "การแปรรูป")
        var e9 = e0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.uother !== "Havenot" && e.uother !== 'other' && e.uother !== 'ไม่มี' && e.uother !== null)
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "ใช้ประกอบการทำอาหารในครัวเรือน",
            "value": a0.length,
            "color": am4core.color("#ff5a5f"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "นำมาแลกเปลี่ยนกันในชุมชน",
            "value": b0.length,
            "color": am4core.color("#bfd7ea"),
            "breakdown": [{ category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "นำไปแปรรูป",
            "value": c0.length,
            "color": am4core.color("#82c0cc"),
            "breakdown": [{ category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "ส่งให้พ่อค้าคนกลาง",
            "value": d0.length,
            "color": am4core.color("#087e8b"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "ไม่มีการนำไปใช้ประโยชน์",
            "value": e0.length,
            "color": am4core.color("#0b3954"),
            "breakdown": [{ category: "ข้าว", value: e1.length }, { category: "ผัก", value: e2.length }, { category: "ผลไม้", value: e3.length }
                , { category: "พืชสมุนไพร", value: e4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: e5.length }, { category: "ประมงน้ำจืด", value: e6.length }
                , { category: "ประมงชายฝั่ง", value: e7.length }, { category: "การแปรรูป", value: e8.length }, { category: "อื่นๆ", value: e9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#d8dbe2"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart7")
    }
}
let setdata7 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart8').html("ข้อมูลช่องทางการกระจายสินค้าในพื้นที่จ." + prov_n)

        let x_filter = x.filter(e => e.prov_code == prov)
        var a0 = x_filter.filter(e => e.dregion == 'ส่งเครือข่ายในภาค')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.dcanton == 'ส่งเครือข่ายในตำบล/จังหวัด')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.dtrade == 'ซื้อขายกันเอง')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.d_no == 'ไม่มีการกระจายผลผลิต')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.dother !== "Havenot" && e.dother !== 'other' && e.dother !== 'ไม่มี')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "ส่งเครือข่ายในภาค",
            "value": a0.length,
            "color": am4core.color("#E8C547"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "ส่งเครือข่ายในตำบล/จังหวัด",
            "value": b0.length,
            "color": am4core.color("#5C80BC"),
            "breakdown": [
                { category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "ซื้อขายกันเอง",
            "value": c0.length,
            "color": am4core.color("#4D5061"),
            "breakdown": [
                { category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "ไม่มีการกระจายผลผลิต",
            "value": d0.length,
            "color": am4core.color("#30323D"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#CDD1C4"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart8")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {
        $('#Hchart8').html("ข้อมูลช่องทางการกระจายสินค้าในพื้นที่จ." + prov_n + " " + "อ." + amp_n)

        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.dregion == 'ส่งเครือข่ายในภาค')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.dcanton == 'ส่งเครือข่ายในตำบล/จังหวัด')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 == "อื่นๆ")

        var c0 = x_filter.filter(e => e.dtrade == 'ขายเอง')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type2 == "ผัก")
        var c3 = c0.filter(e => e.type3 == "ผลไม้")
        var c4 = c0.filter(e => e.type4 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type6 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type8 == "การแปรรูป")
        var c9 = c0.filter(e => e.type9 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.d_no == 'ไม่มีการกระจายผลผลิต')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.dother !== "Havenot" && e.dother !== 'other' && e.dother !== 'ไม่มี')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "ส่งเครือข่ายในภาค",
            "value": a0.length,
            "color": am4core.color("#E8C547"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "ส่งเครือข่ายในตำบล/จังหวัด",
            "value": b0.length,
            "color": am4core.color("#5C80BC"),
            "breakdown": [
                { category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "ซื้อขายกันเอง",
            "value": c0.length,
            "color": am4core.color("#4D5061"),
            "breakdown": [
                { category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "ไม่มีการกระจายผลผลิต",
            "value": d0.length,
            "color": am4core.color("#30323D"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#CDD1C4"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart8")
    } else {
        $('#Hchart8').html("ข้อมูลช่องทางการกระจายสินค้าในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)

        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.dregion == 'ส่งเครือข่ายในภาค')
        var a1 = a0.filter(e => e.type1 == "ข้าว")
        var a2 = a0.filter(e => e.type2 == "ผัก")
        var a3 = a0.filter(e => e.type3 == "ผลไม้")
        var a4 = a0.filter(e => e.type4 == "พืชสมุนไพร")
        var a5 = a0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var a6 = a0.filter(e => e.type6 == "ประมงน้ำจืด")
        var a7 = a0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var a8 = a0.filter(e => e.type8 == "การแปรรูป")
        var a9 = a0.filter(e => e.type9 == "อื่นๆ")

        var b0 = x_filter.filter(e => e.dcanton == 'ส่งเครือข่ายในตำบล/จังหวัด')
        var b1 = b0.filter(e => e.type1 == "ข้าว")
        var b2 = b0.filter(e => e.type2 == "ผัก")
        var b3 = b0.filter(e => e.type3 == "ผลไม้")
        var b4 = b0.filter(e => e.type4 == "พืชสมุนไพร")
        var b5 = b0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var b6 = b0.filter(e => e.type6 == "ประมงน้ำจืด")
        var b7 = b0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var b8 = b0.filter(e => e.type8 == "การแปรรูป")
        var b9 = b0.filter(e => e.type9 !== "อื่นๆ")

        var c0 = x_filter.filter(e => e.dtrade == 'ขายเอง')
        var c1 = c0.filter(e => e.type1 == "ข้าว")
        var c2 = c0.filter(e => e.type1 == "ผัก")
        var c3 = c0.filter(e => e.type1 == "ผลไม้")
        var c4 = c0.filter(e => e.type1 == "พืชสมุนไพร")
        var c5 = c0.filter(e => e.type1 == "ปศุสัตว์/เพาะเลี้ยง")
        var c6 = c0.filter(e => e.type1 == "ประมงน้ำจืด")
        var c7 = c0.filter(e => e.type1 == "ประมงชายฝั่ง")
        var c8 = c0.filter(e => e.type1 == "การแปรรูป")
        var c9 = c0.filter(e => e.type1 == "อื่นๆ")

        var d0 = x_filter.filter(e => e.d_no == 'ไม่มีการกระจายผลผลิต')
        var d1 = d0.filter(e => e.type1 == "ข้าว")
        var d2 = d0.filter(e => e.type2 == "ผัก")
        var d3 = d0.filter(e => e.type3 == "ผลไม้")
        var d4 = d0.filter(e => e.type4 == "พืชสมุนไพร")
        var d5 = d0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var d6 = d0.filter(e => e.type6 == "ประมงน้ำจืด")
        var d7 = d0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var d8 = d0.filter(e => e.type8 == "การแปรรูป")
        var d9 = d0.filter(e => e.type9 == "อื่นๆ")

        var f0 = x_filter.filter(e => e.dother !== "Havenot" && e.dother !== 'other' && e.dother !== 'ไม่มี')
        var f1 = f0.filter(e => e.type1 == "ข้าว")
        var f2 = f0.filter(e => e.type2 == "ผัก")
        var f3 = f0.filter(e => e.type3 == "ผลไม้")
        var f4 = f0.filter(e => e.type4 == "พืชสมุนไพร")
        var f5 = f0.filter(e => e.type5 == "ปศุสัตว์/เพาะเลี้ยง")
        var f6 = f0.filter(e => e.type6 == "ประมงน้ำจืด")
        var f7 = f0.filter(e => e.type7 == "ประมงชายฝั่ง")
        var f8 = f0.filter(e => e.type8 == "การแปรรูป")
        var f9 = f0.filter(e => e.type9 == "อื่นๆ")

        var data = []
        data.push({
            "category": "ส่งเครือข่ายในภาค",
            "value": a0.length,
            "color": am4core.color("#E8C547"),
            "breakdown": [{ category: "ข้าว", value: a1.length }, { category: "ผัก", value: a2.length }, { category: "ผลไม้", value: a3.length }
                , { category: "พืชสมุนไพร", value: a4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, { category: "ประมงน้ำจืด", value: a6.length }
                , { category: "ประมงชายฝั่ง", value: a7.length }, { category: "การแปรรูป", value: a8.length }, { category: "อื่นๆ", value: a9.length }]
        }, {
            "category": "ส่งเครือข่ายในตำบล/จังหวัด",
            "value": b0.length,
            "color": am4core.color("#5C80BC"),
            "breakdown": [
                { category: "ข้าว", value: b1.length }, { category: "ผัก", value: b2.length }, { category: "ผลไม้", value: b3.length }
                , { category: "พืชสมุนไพร", value: b4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, { category: "ประมงน้ำจืด", value: b6.length }
                , { category: "ประมงชายฝั่ง", value: b7.length }, { category: "การแปรรูป", value: b8.length }, { category: "อื่นๆ", value: b9.length }]
        }, {
            "category": "ซื้อขายกันเอง",
            "value": c0.length,
            "color": am4core.color("#4D5061"),
            "breakdown": [
                { category: "ข้าว", value: c1.length }, { category: "ผัก", value: c2.length }, { category: "ผลไม้", value: c3.length }
                , { category: "พืชสมุนไพร", value: c4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, { category: "ประมงน้ำจืด", value: c6.length }
                , { category: "ประมงชายฝั่ง", value: c7.length }, { category: "การแปรรูป", value: c8.length }, { category: "อื่นๆ", value: c9.length }]
        }, {
            "category": "ไม่มีการกระจายผลผลิต",
            "value": d0.length,
            "color": am4core.color("#30323D"),
            "breakdown": [{ category: "ข้าว", value: d1.length }, { category: "ผัก", value: d2.length }, { category: "ผลไม้", value: d3.length }
                , { category: "พืชสมุนไพร", value: d4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, { category: "ประมงน้ำจืด", value: d6.length }
                , { category: "ประมงชายฝั่ง", value: d7.length }, { category: "การแปรรูป", value: d8.length }, { category: "อื่นๆ", value: d9.length }]
        }, {
            "category": "อื่นๆ",
            "value": f0.length,
            "color": am4core.color("#CDD1C4"),
            "breakdown": [{ category: "ข้าว", value: f1.length }, { category: "ผัก", value: f2.length }, { category: "ผลไม้", value: f3.length }
                , { category: "พืชสมุนไพร", value: f4.length }, { category: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, { category: "ประมงน้ำจืด", value: f6.length }
                , { category: "ประมงชายฝั่ง", value: f7.length }, { category: "การแปรรูป", value: f8.length }, { category: "อื่นๆ", value: f9.length }]
        })
        chart4(data, "chart8")
    }
}
let setdata8 = (x) => {
    let prov = $('#pro').val()
    let amphoe = $('#amp').val()
    let tambon = $('#tam').val()
    if (tambon !== null && tambon == "tam" && amphoe == "amp") {
        $('#Hchart9').html("ข้อมูลแรงงานในพื้นที่จ." + prov_n)

        let x_filter = x.filter(e => e.prov_code == prov)
        // console.log(x_filter)
        var a0 = x_filter.filter(e => e.labortype == 'จ้างคนในชุมชน')
        var b0 = x_filter.filter(e => e.labortype == 'ตนเอง/คนในครอบครัว')
        var c0 = x_filter.filter(e => e.labortype == 'แรงงานเพื่อนบ้าน(ต่างประเทศ)')
        var d0 = x_filter.filter(e => e.labortype == 'ไม่ระบุ')
        var e0 = x_filter.filter(e => e.labortype !== 'จ้างคนในชุมชน' && e.labortype !== 'แรงงานเพื่อนบ้าน(ต่างประเทศ)' && e.labortype !== 'ตนเอง/คนในครอบครัว' && e.labortype !== 'ไม่ระบุ')
        var data = []
        data.push({
            "country": "จ้างคนในชุมชน",
            "litres": a0.length,
            // "subData": [{name: "ข้าว", value: a1.length }, {name: "ผัก", value: a2.length }, {name: "ผลไม้", value: a3.length }
            //     , {name: "พืชสมุนไพร", value: a4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, {name: "ประมงน้ำจืด", value: a6.length }
            //     , {name: "ประมงชายฝั่ง", value: a7.length }, {name: "การแปรรูป", value: a8.length }, {name: "อื่นๆ", value: a9.length }]
        }, {
            "country": "ตนเอง/คนในครอบครัว",
            "litres": b0.length,
            // "subData": [{name: "ข้าว", value: b1.length }, {name: "ผัก", value: b2.length }, {name: "ผลไม้", value: b3.length }
            //     , {name: "พืชสมุนไพร", value: b4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, {name: "ประมงน้ำจืด", value: b6.length }
            //     , {name: "ประมงชายฝั่ง", value: b7.length }, {name: "การแปรรูป", value: b8.length }, {name: "อื่นๆ", value: b9.length }]
        }, {
            "country": "แรงงานเพื่อนบ้าน(ต่างประเทศ)",
            "litres": c0.length,
            // "subData": [{name: "ข้าว", value: c1.length }, {name: "ผัก", value: c2.length }, {name: "ผลไม้", value: c3.length }
            //     , {name: "พืชสมุนไพร", value: c4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, {name: "ประมงน้ำจืด", value: c6.length }
            //     , {name: "ประมงชายฝั่ง", value: c7.length }, {name: "การแปรรูป", value: c8.length }, {name: "อื่นๆ", value: c9.length }]
        }, {
            "country": "ไม่ระบุ",
            "litres": d0.length,
            // "subData": [{name: "ข้าว", value: d1.length }, {name: "ผัก", value: d2.length }, {name: "ผลไม้", value: d3.length }
            //     , {name: "พืชสมุนไพร", value: d4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, {name: "ประมงน้ำจืด", value: d6.length }
            //     , {name: "ประมงชายฝั่ง", value: d7.length }, {name: "การแปรรูป", value: d8.length }, {name: "อื่นๆ", value: d9.length }]
        }, {
            "country": "อื่นๆ",
            "litres": e0.length,
            // "subData": [{name: "ข้าว", value: f1.length }, {name: "ผัก", value: f2.length }, {name: "ผลไม้", value: f3.length }
            //     , {name: "พืชสมุนไพร", value: f4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, {name: "ประมงน้ำจืด", value: f6.length }
            //     , {name: "ประมงชายฝั่ง", value: f7.length }, {name: "การแปรรูป", value: f8.length }, {name: "อื่นๆ", value: f9.length }]
        })
        chart3(data, "chart9")
    } else if (tambon !== null && tambon == "tam" && amphoe !== "amp") {
        $('#Hchart9').html("ข้อมูลแรงงานในพื้นที่จ." + prov_n + " " + "อ." + amp_n)

        let x_filter = x.filter(e => e.amp_code == amphoe)
        var a0 = x_filter.filter(e => e.labortype == 'จ้างคนในชุมชน')
        var b0 = x_filter.filter(e => e.labortype == 'ตนเอง/คนในครอบครัว')
        var c0 = x_filter.filter(e => e.labortype == 'แรงงานเพื่อนบ้าน(ต่างประเทศ)')
        var d0 = x_filter.filter(e => e.labortype == 'ไม่ระบุ')
        var e0 = x_filter.filter(e => e.labortype !== 'จ้างคนในชุมชน' && e.labortype !== 'แรงงานเพื่อนบ้าน(ต่างประเทศ)' && e.labortype !== 'ตนเอง/คนในครอบครัว' && e.labortype !== 'ไม่ระบุ')
        var data = []
        data.push({
            "country": "จ้างคนในชุมชน",
            "litres": a0.length,
            // "subData": [{name: "ข้าว", value: a1.length }, {name: "ผัก", value: a2.length }, {name: "ผลไม้", value: a3.length }
            //     , {name: "พืชสมุนไพร", value: a4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, {name: "ประมงน้ำจืด", value: a6.length }
            //     , {name: "ประมงชายฝั่ง", value: a7.length }, {name: "การแปรรูป", value: a8.length }, {name: "อื่นๆ", value: a9.length }]
        }, {
            "country": "ตนเอง/คนในครอบครัว",
            "litres": b0.length,
            // "subData": [{name: "ข้าว", value: b1.length }, {name: "ผัก", value: b2.length }, {name: "ผลไม้", value: b3.length }
            //     , {name: "พืชสมุนไพร", value: b4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, {name: "ประมงน้ำจืด", value: b6.length }
            //     , {name: "ประมงชายฝั่ง", value: b7.length }, {name: "การแปรรูป", value: b8.length }, {name: "อื่นๆ", value: b9.length }]
        }, {
            "country": "แรงงานเพื่อนบ้าน(ต่างประเทศ)",
            "litres": c0.length,
            // "subData": [{name: "ข้าว", value: c1.length }, {name: "ผัก", value: c2.length }, {name: "ผลไม้", value: c3.length }
            //     , {name: "พืชสมุนไพร", value: c4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, {name: "ประมงน้ำจืด", value: c6.length }
            //     , {name: "ประมงชายฝั่ง", value: c7.length }, {name: "การแปรรูป", value: c8.length }, {name: "อื่นๆ", value: c9.length }]
        }, {
            "country": "ไม่ระบุ",
            "litres": d0.length,
            // "subData": [{name: "ข้าว", value: d1.length }, {name: "ผัก", value: d2.length }, {name: "ผลไม้", value: d3.length }
            //     , {name: "พืชสมุนไพร", value: d4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, {name: "ประมงน้ำจืด", value: d6.length }
            //     , {name: "ประมงชายฝั่ง", value: d7.length }, {name: "การแปรรูป", value: d8.length }, {name: "อื่นๆ", value: d9.length }]
        }, {
            "country": "อื่นๆ",
            "litres": e0.length,
            // "subData": [{name: "ข้าว", value: f1.length }, {name: "ผัก", value: f2.length }, {name: "ผลไม้", value: f3.length }
            //     , {name: "พืชสมุนไพร", value: f4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, {name: "ประมงน้ำจืด", value: f6.length }
            //     , {name: "ประมงชายฝั่ง", value: f7.length }, {name: "การแปรรูป", value: f8.length }, {name: "อื่นๆ", value: f9.length }]
        })
        chart3(data, "chart9")
    } else {
        $('#Hchart9').html("ข้อมูลแรงงานในพื้นที่จ." + prov_n + " " + "อ." + amp_n + " " + "ต." + tam_n)

        let x_filter = x.filter(e => e.tam_code == tambon)
        var a0 = x_filter.filter(e => e.labortype == 'จ้างคนในชุมชน')
        var b0 = x_filter.filter(e => e.labortype == 'ตนเอง/คนในครอบครัว')
        var c0 = x_filter.filter(e => e.labortype == 'แรงงานเพื่อนบ้าน(ต่างประเทศ)')
        var d0 = x_filter.filter(e => e.labortype == 'ไม่ระบุ')
        var e0 = x_filter.filter(e => e.labortype !== 'จ้างคนในชุมชน' && e.labortype !== 'แรงงานเพื่อนบ้าน(ต่างประเทศ)' && e.labortype !== 'ตนเอง/คนในครอบครัว' && e.labortype !== 'ไม่ระบุ')
        var data = []
        data.push({
            "country": "จ้างคนในชุมชน",
            "litres": a0.length,
            // "subData": [{name: "ข้าว", value: a1.length }, {name: "ผัก", value: a2.length }, {name: "ผลไม้", value: a3.length }
            //     , {name: "พืชสมุนไพร", value: a4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: a5.length }, {name: "ประมงน้ำจืด", value: a6.length }
            //     , {name: "ประมงชายฝั่ง", value: a7.length }, {name: "การแปรรูป", value: a8.length }, {name: "อื่นๆ", value: a9.length }]
        }, {
            "country": "ตนเอง/คนในครอบครัว",
            "litres": b0.length,
            // "subData": [{name: "ข้าว", value: b1.length }, {name: "ผัก", value: b2.length }, {name: "ผลไม้", value: b3.length }
            //     , {name: "พืชสมุนไพร", value: b4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: b5.length }, {name: "ประมงน้ำจืด", value: b6.length }
            //     , {name: "ประมงชายฝั่ง", value: b7.length }, {name: "การแปรรูป", value: b8.length }, {name: "อื่นๆ", value: b9.length }]
        }, {
            "country": "แรงงานเพื่อนบ้าน(ต่างประเทศ)",
            "litres": c0.length,
            // "subData": [{name: "ข้าว", value: c1.length }, {name: "ผัก", value: c2.length }, {name: "ผลไม้", value: c3.length }
            //     , {name: "พืชสมุนไพร", value: c4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: c5.length }, {name: "ประมงน้ำจืด", value: c6.length }
            //     , {name: "ประมงชายฝั่ง", value: c7.length }, {name: "การแปรรูป", value: c8.length }, {name: "อื่นๆ", value: c9.length }]
        }, {
            "country": "ไม่ระบุ",
            "litres": d0.length,
            // "subData": [{name: "ข้าว", value: d1.length }, {name: "ผัก", value: d2.length }, {name: "ผลไม้", value: d3.length }
            //     , {name: "พืชสมุนไพร", value: d4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: d5.length }, {name: "ประมงน้ำจืด", value: d6.length }
            //     , {name: "ประมงชายฝั่ง", value: d7.length }, {name: "การแปรรูป", value: d8.length }, {name: "อื่นๆ", value: d9.length }]
        }, {
            "country": "อื่นๆ",
            "litres": e0.length,
            // "subData": [{name: "ข้าว", value: f1.length }, {name: "ผัก", value: f2.length }, {name: "ผลไม้", value: f3.length }
            //     , {name: "พืชสมุนไพร", value: f4.length }, {name: "ปศุสัตว์/เพาะเลี้ยง", value: f5.length }, {name: "ประมงน้ำจืด", value: f6.length }
            //     , {name: "ประมงชายฝั่ง", value: f7.length }, {name: "การแปรรูป", value: f8.length }, {name: "อื่นๆ", value: f9.length }]
        })
        chart3(data, "chart9")
    }
}
let chart = (data) => {
    // $('#legendwrapper').hide();
    am4core.ready(function () {

        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart3D);

        // Add data
        chart.data = data

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.renderer.labels.template.hideOversized = false;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.tooltip.label.rotation = 270;
        categoryAxis.tooltip.label.horizontalCenter = "right";
        categoryAxis.tooltip.label.verticalCenter = "middle";

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxis.title.text = "Countries";
        // valueAxis.title.fontWeight = "bold";

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries3D());
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.name = "Visits";
        series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
        columnTemplate.stroke = am4core.color("#FFFFFF");

        columnTemplate.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        })

        columnTemplate.adapter.add("stroke", function (stroke, target) {
            return chart.colors.getIndex(target.dataItem.index);
        })

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineY.strokeOpacity = 0;

    }); // end am4core.ready()
}
let chart1 = (data, chartdiv) => {
    // $('#legendwrapper').hide();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create(chartdiv, am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = data

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();
    var indicator;
    function showIndicator() {
        if (indicator) {
            indicator.show();
        }
        else {
            indicator = chart.tooltipContainer.createChild(am4core.Container);
            indicator.background.fill = am4core.color("#fff");
            indicator.background.fillOpacity = 0.8;
            indicator.width = am4core.percent(100);
            indicator.height = am4core.percent(100);

            var indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = "ไม่พบข้อมูล...";
            indicatorLabel.align = "center";
            indicatorLabel.valign = "middle";
            indicatorLabel.fontSize = 20;
        }
    }

    chart.events.on("beforedatavalidated", function (ev) {
        // console.log(ev.target.data)
        if (ev.target.data.length == 0) {
            showIndicator();
        }
    });
    chart.exporting.menu = new am4core.ExportMenu();
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
}
function Theme1(target) {
    if (target instanceof am4core.ColorSet) {
        target.list = [
            am4core.color("#B8DFD8"),
            am4core.color("#E8F6EF"),
            am4core.color("#FFE194"),
            am4core.color("#FFB319"),
        ];
    }
}
function Theme2(target) {
    if (target instanceof am4core.ColorSet) {
        target.list = [
            am4core.color("#4B6587"),
            am4core.color("#C8C6C6"),
            am4core.color("#F7F6F2"),
            am4core.color("#F0E5CF"),
        ];
    }
}
let chart2 = async (data, chartdiv, legenddiv) => {
    // $('#legendwrapper').show();
    // Themes begin
    // am4core.useTheme(am4themes_moonrisekingdom);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var container = am4core.create(chartdiv, am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";


    var chart = container.createChild(am4charts.PieChart);
    chart.legend = new am4charts.Legend();
    chart.legend.scrollable = true;
    // chart.legend.position = "right";
    // chart.legend.valign = "bottom";
    // chart.legend.contentAlign = "center";

    // var legendContainer = am4core.create(legenddiv, am4core.Container);
    // legendContainer.width = am4core.percent(100);
    // legendContainer.height = am4core.percent(100);

    // chart.legend.parent = legendContainer;
    // chart.events.on("datavalidated", resizeLegend);
    // chart.events.on("maxsizechanged", resizeLegend);

    // function resizeLegend(ev) {
    //     document.getElementById(legenddiv).style.height = chart.legend.contentHeight + "px";
    // }


    // Add data
    chart.data = data

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";
    pieSeries.slices.template.propertyFields.fill = am4core.color("#F0E5CF");

    pieSeries.slices.template.events.on("hit", function (event) {
        selectSlice(event.target.dataItem);
    })
    // pieSeries.labels.template.maxWidth = 114;
    // pieSeries.labels.template.wrap = true;
    // pieSeries.labels.template.text = "{category}";

    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{category}: {value.percent.formatNumber('#.')}%";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");

    pieSeries.labels.template.adapter.add("radius", function (radius, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return 0;
        }
        return radius;
    });

    pieSeries.labels.template.adapter.add("fill", function (color, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return am4core.color("#000");
        }
        return color;
    });
    pieSeries.labels.template.adapter.add("textOutput", function (text, target) {
        // Hide labels with 0 value
        if (target.dataItem && target.dataItem.values.value.percent == 0) {
            return "";
        }
        return text;
    });

    var chart2 = container.createChild(am4charts.PieChart);
    chart2.width = am4core.percent(30);
    chart2.radius = am4core.percent(80);

    // Add and configure Series
    var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "value";
    pieSeries2.dataFields.category = "name";
    pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries2.labels.template.radius = am4core.percent(50);
    //pieSeries2.labels.template.inside = true;
    //pieSeries2.labels.template.fill = am4core.color("#ffffff");
    // pieSeries2.labels.template.disabled = true;
    // pieSeries2.ticks.template.disabled = true;
    pieSeries2.alignLabels = false;
    pieSeries2.events.on("positionchanged", updateLines);

    pieSeries2.ticks.template.disabled = true;
    pieSeries2.alignLabels = false;
    pieSeries2.labels.template.text = "{category}: {value.percent.formatNumber('#.')}%";
    pieSeries2.labels.template.radius = am4core.percent(-40);
    pieSeries2.labels.template.fill = am4core.color("white");

    pieSeries2.labels.template.adapter.add("radius", function (radius, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return 0;
        }
        return radius;
    });

    pieSeries2.labels.template.adapter.add("fill", function (color, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return am4core.color("#000");
        }
        return color;
    });

    pieSeries2.labels.template.adapter.add("textOutput", function (text, target) {
        // Hide labels with 0 value
        if (target.dataItem && target.dataItem.values.value.percent == 0) {
            return "";
        }
        return text;
    });
    var interfaceColors = new am4core.InterfaceColorSet();

    var line1 = container.createChild(am4core.Line);
    line1.strokeDasharray = "2,2";
    line1.strokeOpacity = 0.5;
    line1.stroke = interfaceColors.getFor("alternativeBackground");
    line1.isMeasured = false;

    var line2 = container.createChild(am4core.Line);
    line2.strokeDasharray = "2,2";
    line2.strokeOpacity = 0.5;
    line2.stroke = interfaceColors.getFor("alternativeBackground");
    line2.isMeasured = false;

    var selectedSlice;

    function selectSlice(dataItem) {
        // console.log("okk")
        selectedSlice = dataItem.slice;

        var fill = selectedSlice.fill;

        var count = dataItem.dataContext.subData.length;
        pieSeries2.colors.list = [];
        for (var i = 0; i < count; i++) {
            pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
        }

        chart2.data = dataItem.dataContext.subData;
        pieSeries2.appear();

        var middleAngle = selectedSlice.middleAngle;
        var firstAngle = pieSeries.slices.getIndex(0).startAngle;
        var animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
        animation.events.on("animationprogress", updateLines);

        selectedSlice.events.on("transformed", updateLines);

        //  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
        //  animation.events.on("animationprogress", updateLines)
    }


    function updateLines() {
        if (selectedSlice) {
            var p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
            var p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

            p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
            p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

            var p21 = { x: 0, y: -pieSeries2.pixelRadius };
            var p22 = { x: 0, y: pieSeries2.pixelRadius };

            p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
            p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

            line1.x1 = p11.x;
            line1.x2 = p21.x;
            line1.y1 = p11.y;
            line1.y2 = p21.y;

            line2.x1 = p12.x;
            line2.x2 = p22.x;
            line2.y1 = p12.y;
            line2.y2 = p22.y;
        }
    }

    chart.events.on("datavalidated", function () {
        setTimeout(function () {
            selectSlice(pieSeries.dataItems.getIndex(0));
        }, 1000);
    });
    chart.responsive.enabled = true;

    var indicator;
    function showIndicator() {
        if (indicator) {
            indicator.show();
        }
        else {
            indicator = chart.tooltipContainer.createChild(am4core.Container);
            indicator.background.fill = am4core.color("#fff");
            indicator.background.fillOpacity = 0.8;
            indicator.width = am4core.percent(100);
            indicator.height = am4core.percent(100);

            var indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = "ไม่พบข้อมูล...";
            indicatorLabel.align = "center";
            indicatorLabel.valign = "middle";
            indicatorLabel.fontSize = 20;
        }
    }

    chart.events.on("beforedatavalidated", function (ev) {
        // console.log(ev.target.data)
        if (ev.target.data.length == 0) {
            showIndicator();
        }
    });

    chart.exporting.menu = new am4core.ExportMenu();
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
}
function Theme3(target) {
    if (target instanceof am4core.ColorSet) {
        target.list = [
            am4core.color("#DBD0C0"),
            am4core.color("#F9D5A7"),
            am4core.color("#FFB085"),
            am4core.color("#A2D2FF"),
            am4core.color("#90AACB"),
            am4core.color("#967D69")
        ];
    }
}
let chart3 = (data, chartdiv) => {
    // $('#legendwrapper').hide();
    // Themes begin
    // am4core.useTheme();
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create(chartdiv, am4charts.PieChart);
    chart.legend = new am4charts.Legend();
    // Add data
    chart.data = data

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "country";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    // pieSeries.labels.template.maxWidth = 160;
    // pieSeries.labels.template.wrap = true;

    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{category}: {value.percent.formatNumber('#.')}%";
    pieSeries.labels.template.radius = am4core.percent(-40);
    pieSeries.labels.template.fill = am4core.color("white");

    pieSeries.labels.template.adapter.add("radius", function (radius, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return 0;
        }
        return radius;
    });

    pieSeries.labels.template.adapter.add("fill", function (color, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return am4core.color("#000");
        }
        return color;
    });

    pieSeries.labels.template.adapter.add("textOutput", function (text, target) {
        // Hide labels with 0 value
        if (target.dataItem && target.dataItem.values.value.percent == 0) {
            return "";
        }
        return text;
    });

    chart.hiddenState.properties.radius = am4core.percent(0);

    var indicator;
    function showIndicator() {
        if (indicator) {
            indicator.show();
        }
        else {
            indicator = chart.tooltipContainer.createChild(am4core.Container);
            indicator.background.fill = am4core.color("#fff");
            indicator.background.fillOpacity = 0.8;
            indicator.width = am4core.percent(100);
            indicator.height = am4core.percent(100);

            var indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = "ไม่พบข้อมูล...";
            indicatorLabel.align = "center";
            indicatorLabel.valign = "middle";
            indicatorLabel.fontSize = 20;
        }
    }

    chart.events.on("beforedatavalidated", function (ev) {
        // console.log(ev.target.data)
        if (ev.target.data.length == 0) {
            showIndicator();
        }
    });

    chart.exporting.menu = new am4core.ExportMenu();
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
}
let chart4 = (Xdata, chartdiv) => {
    // $('#legendwrapper').hide();
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    /**
     * Source data
     */
    var data = Xdata
    /**
     * Chart container
     */

    // Create chart instance
    var chart = am4core.create(chartdiv, am4core.Container);
    chart.width = am4core.percent(100);
    chart.height = am4core.percent(100);
    chart.layout = "horizontal";
    chart.legend = new am4charts.Legend();
    // chart.legend.valueLabels.template.align = "left";
    // chart.legend.valueLabels.template.textAlign = "end";
    chart.numberFormatter.numberFormat = "#,###,###";


    /**
     * Column chart
     */

    // Create chart instance
    var columnChart = chart.createChild(am4charts.XYChart);

    // Create axes
    var categoryAxis = columnChart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = columnChart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.strokeOpacity = 0;
    // valueAxis.renderer.labels.template.dy = 20;

    // Create series
    var columnSeries = columnChart.series.push(new am4charts.ColumnSeries());
    columnSeries.dataFields.valueX = "value";
    columnSeries.dataFields.categoryY = "category";
    columnSeries.columns.template.strokeWidth = 0;
    columnSeries.tooltipText = "{valueX.value}";

    var labelBullet = columnSeries.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "left";
    labelBullet.label.text = "{valueX} แปลง";
    labelBullet.label.textAlign = "end";
    labelBullet.label.dx = 10;

    labelBullet.label.adapter.add("textOutput", function (text, target) {
        // Hide labels with 0 value
        if (target.dataItem && target.dataItem.valueX == 0) {
            return "";
        }
        return text;

    });


    /**
     * Pie chart
     */

    // Create chart instance
    var pieChart = chart.createChild(am4charts.PieChart);
    pieChart.data = data;
    pieChart.innerRadius = am4core.percent(50);

    // Add and configure Series
    var pieSeries = pieChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "category";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.labels.template.disabled = true;

    // Set up labels
    var label1 = pieChart.seriesContainer.createChild(am4core.Label);
    label1.text = "";
    label1.horizontalCenter = "middle";
    label1.fontSize = 35;
    label1.fontWeight = 600;
    label1.dy = -30;

    var label2 = pieChart.seriesContainer.createChild(am4core.Label);
    label2.text = "";
    label2.horizontalCenter = "middle";
    label2.fontSize = 18;
    label2.dy = 20;
    label2.maxWidth = 180;
    label2.truncate = true;
    label2.wrap = true;

    // Auto-select first slice on load
    pieChart.events.on("ready", function (ev) {
        pieSeries.slices.getIndex(0).isActive = true;
        // console.log(ev.target.data)
    });

    // Set up toggling events
    pieSeries.slices.template.events.on("toggled", function (ev) {
        if (ev.target.isActive) {

            // Untoggle other slices
            pieSeries.slices.each(function (slice) {
                if (slice != ev.target) {
                    slice.isActive = false;
                }
            });

            // Update column chart
            columnSeries.appeared = false;
            columnChart.data = ev.target.dataItem.dataContext.breakdown;
            columnSeries.fill = ev.target.fill;
            columnSeries.reinit();

            // Update labels
            label1.text = pieChart.numberFormatter.format(ev.target.dataItem.values.value.percent, "#.'%'");
            label1.fill = ev.target.fill;
            label2.text = ev.target.dataItem.category;
        }
    });
    var indicator;
    function showIndicator() {
        if (indicator) {
            indicator.show();
        }
        else {
            indicator = chart.tooltipContainer.createChild(am4core.Container);
            indicator.background.fill = am4core.color("#fff");
            indicator.background.fillOpacity = 0.8;
            indicator.width = am4core.percent(100);
            indicator.height = am4core.percent(100);

            var indicatorLabel = indicator.createChild(am4core.Label);
            indicatorLabel.text = "ไม่พบข้อมูล...";
            indicatorLabel.align = "center";
            indicatorLabel.valign = "middle";
            indicatorLabel.fontSize = 20;
        }
    }

    chart.events.on("beforedatavalidated", function (ev) {

        if (ev.target.data.length == 0) {
            showIndicator();
        }
    });

    // chart.exporting.menu = new am4core.ExportMenu();
    // chart.exporting.adapter.add("data", function (data, target) {
    //     var data = [];
    //     chart.series.each(function (series) {
    //         for (var i = 0; i < series.data.length; i++) {
    //             series.data[i].name = series.name;
    //             data.push(series.data[i]);
    //         }
    //     });
    //     return { data: data };
    // });
}
