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
            url: "https://engrids.soc.cmu.ac.th/api" + `/garbage-eac/getalldata`,
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
            { data: 'placegarbage' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `${row.type1 !== 'ไม่มี' ? row.type1 + "" : ""}
                    ${row.type2 !== 'ไม่มี' ? row.type2 + "" : ""}
                    ${row.type3 !== 'ไม่มี' ? row.type3 + "" : ""}
                    ${row.type4 !== 'ไม่มี' ? row.type4 + "" : ""}
                    ${row.type5 !== 'ไม่มี' ? row.type5 : ""}
                    ${row.type1 == 'ไม่มี' && row.type2 == 'ไม่มี' && row.type3 == 'ไม่มี' &&
                            row.type4 == 'ไม่มี' && row.type5 == 'ไม่มี' ? '-' : ""}`
                },

            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `${row.gbpollu1 !== 'ไม่มี' ? row.gbpollu1 + "" : ""}
                    ${row.gbpollu2 !== 'ไม่มี' ? row.gbpollu2 + "" : ""}
                    ${row.gbpollu3 !== 'ไม่มี' ? row.gbpollu3 + "" : ""}
                    ${row.gbpollu4 !== 'ไม่มี' ? row.gbpollu4 + "" : ""}
                    ${row.gbpollu5 !== 'ไม่มี' ? row.gbpollu5 : ""}
                    ${row.gbpollu1 == 'ไม่มี' && row.gbpollu2 == 'ไม่มี' && row.gbpollu3 == 'ไม่มี' &&
                            row.gbpollu4 == 'ไม่มี' && row.gbpollu5 == 'ไม่มี' ? '-' : ""}`
                },

            },
            {
                data: 'status',
                render: function (data, type, row) {
                    var a = data;
                    if (a == 'ยังไม่ได้ดำเนินการแก้ไข') {
                        return '<label style="font-size: 16px; color: #f52d2d;"><i class="bi bi-x-circle-fill"></i><b> ยังไม่ได้ดำเนินการ </b></label>';
                    } else if (a == 'กำลังดำเนินการแก้ไข') {
                        return '<label style="font-size: 16px; color: #ffc60a;"><i class="bi bi-exclamation-circle-fill"></i><b> กำลังดำเนินการ </b></label>';
                    } else if (a == 'ดำเนินการแก้ไขเรียบร้อย') {
                        return '<label style="font-size: 16px; color: #17c017;"><i class="bi bi-check-circle-fill"></i><b> ดำเนินการเรียบร้อย </b></label>';
                    } else {
                        return '<label style="font-size: 16px; color: #a0a5ac;">';
                        // return data;
                    }

                }
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
                            <button class="btn m btn-danger" onclick="confirmDelete(${row.id_date},'${row.placegarbage}','${row.status}','${row.record}')"><i class="bi bi-trash"></i>&nbsp;ลบข้อมูล</button>`
                },
                // width: "30%"
            }

        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 3, 4, 5, 6, 7] },

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
let d
let getdata = (id) => {
    axios.get(url + `/garbage-eac/getalldata`, { id_user: id }).then(async (r) => {
        d = r.data.data;
        // console.log(d)
        $('#numall').html(d.length)
    })
}
getdata()

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
            let type = `${i.type1 !== 'ไม่มี' ? i.type1 + "" : ""}
        ${i.type2 !== 'ไม่มี' ? i.type2 + "" : ""}
        ${i.type3 !== 'ไม่มี' ? i.type3 + "" : ""}
        ${i.type4 !== 'ไม่มี' ? i.type4 + "" : ""}
        ${i.type5 !== 'ไม่มี' ? i.type5 : ""} `

            let gbpollu = `${i.gbpollu1 !== 'ไม่มี' ? i.gbpollu1 + "" : ""}
        ${i.gbpollu2 !== 'ไม่มี' ? i.gbpollu2 + "" : ""}
        ${i.gbpollu3 !== 'ไม่มี' ? i.gbpollu3 + "" : ""}
        ${i.gbpollu4 !== 'ไม่มี' ? i.gbpollu4 + "" : ""}
        ${i.gbpollu5 !== 'ไม่มี' ? i.gbpollu5 : ""} `

            geojson
                .bindPopup(`< h6 class= "text-center" ><b>ชื่อสถานที่ที่พบ</b> ${i.placegarbage} <br><b>ประเภทขยะที่พบ</b>: ${type} <br><b>รายละเอียด</b> ${gbpollu} <br><b>ที่ตั้ง</b>: ต.${i.tam_tn} อ.${i.amp_tn} จ.${i.prov_tn} <br>
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
    let type = `${a[0].type1 !== 'ไม่มี' ? a[0].type1 + "" : ""}
                            ${a[0].type2 !== 'ไม่มี' ? a[0].type2 + "" : ""}
                            ${a[0].type3 !== 'ไม่มี' ? a[0].type3 + "" : ""}
                            ${a[0].type4 !== 'ไม่มี' ? a[0].type4 + "" : ""}
                            ${a[0].type5 !== 'ไม่มี' ? a[0].type5 : ""}`
    let gbpollu = `${a[0].gbpollu1 !== 'ไม่มี' ? a[0].gbpollu1 + "" : ""}
                            ${a[0].gbpollu2 !== 'ไม่มี' ? a[0].gbpollu2 + "" : ""}
                            ${a[0].gbpollu3 !== 'ไม่มี' ? a[0].gbpollu3 + "" : ""}
                            ${a[0].gbpollu4 !== 'ไม่มี' ? a[0].gbpollu4 + "" : ""}
                            ${a[0].gbpollu5 !== 'ไม่มี' ? a[0].gbpollu5 : ""}`
    var pop
    if (a[0].status) {
        pop = L.popup({ Width: 200, offset: [0, -25] });
        let content = `<h6 class="text-center"><b>ชื่อสถานที่ที่พบ</b>: ${a[0].placegarbage} <br><b>ประเภทขยะที่พบ</b>: ${type} <br><b>รายละเอียด</b>: ${gbpollu} <br><b>ที่ตั้ง</b>: ต.${a[0].tam_tn} อ.${a[0].amp_tn} จ.${a[0].prov_tn} <br>
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
        iconUrl: './marker/icon-grabage.png',
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
            let gbpollu = `${i.gbpollu1 !== 'ไม่มี' ? i.gbpollu1 + "" : ""}
            ${i.gbpollu2 !== 'ไม่มี' ? i.gbpollu2 + "" : ""}
            ${i.gbpollu3 !== 'ไม่มี' ? i.gbpollu3 + "" : ""}
            ${i.gbpollu4 !== 'ไม่มี' ? i.gbpollu4 + "" : ""}
            ${i.gbpollu5 !== 'ไม่มี' ? i.gbpollu5 : ""} `
                .bindPopup(`<h6><b>ชื่อสถานที่ที่พบ</b>: ${i.placegarbage} </h6> <h6><b>รายละเอียด</b>: ${gbpollu} </h6><br><b>ที่ตั้ง</b>: ต.${i.tam_tn} อ.${i.amp_tn} จ.${i.prov_tn} <br>
                <b>ผู้ให้ข้อมูล</b>: ${a[0].record} <br></h6>`)
            // .addTo(map)
            ms.addLayer(mm);
        } else if (i.lat !== "0" && i.lat !== null && i.lng !== "0" && i.lng !== null) {
            // console.log(i.lat, i.lng)
            let gbpollu = `${i.gbpollu1 !== 'ไม่มี' ? i.gbpollu1 + "" : ""}
            ${i.gbpollu2 !== 'ไม่มี' ? i.gbpollu2 + "" : ""}
            ${i.gbpollu3 !== 'ไม่มี' ? i.gbpollu3 + "" : ""}
            ${i.gbpollu4 !== 'ไม่มี' ? i.gbpollu4 + "" : ""}
            ${i.gbpollu5 !== 'ไม่มี' ? i.gbpollu5 : ""} `
            mm = L.marker([i.lat, i.lng], { name: "marker", icon: MIcon_05 })
            
                .bindPopup(`<h6><b>ชื่อสถานที่ที่พบ</b>: ${i.placegarbage} </h6> <h6><b>รายละเอียด</b>: ${gbpollu} </h6> <h6><b>จังหวัด :</b> ${i.prov_tn}</h6> <h6><b>ผู้ให้ข้อมูล :</b> ${i.record}</h6>
            `)
            ms.addLayer(mm);// 
        }
    });
    ms.addTo(map)

}
let confirmDelete = (id_data, status,) => {
    $("#projId").val(id_data)
    $("#status").html(`${status !== 'null' ? 'สถานะ' + status : ''} `)
    $('#deleteModal').modal('show');
}
let deleteValue = () => {
    let id_data = $("#projId").val();
    // $('#deleteModal').modal('hide');
    // console.log(id_data)
    $('#myTable').DataTable().ajax.reload();
    axios.post(url + "/garbage-eac/delete", { proj_id: id_data }).then(r => {
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
