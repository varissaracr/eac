let latlng = {
    lat: 13.196768,
    lng: 101.364720
}
let map = L.map('map', {
    center: latlng,
    zoom: 9
});

let marker, gps, dataurl;

// const url = 'http://localhost:3700';
const url = "https://engrids.soc.cmu.ac.th/api";
// const url = "https://eec-mis.onep.go.th/api";

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
            url: url + "/fishing-eac/data",
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
            { data: 'fname' },
            { data: 'fcategory' },
            { data: 'fwater' },
            { data: 'flagstatus' },
            {
                data: 'ftypes',
                // render: (data) => {
                //     let result = data.slice(0, -10);
                //     return result + '...'
                // }
            },
            { data: 'province' },
            {
                // targets: -1,
                // <button type="button" class="btn btn-success" id="getMap">ขยายแผนที่</button>
                data: null,
                defaultContent: `<button type="button" class="btn btn-warning" id="edit">แก้ไขข้อมูล</button>
                                 <button type="button" class="btn btn-danger" id="delete">ลบ!</button>`
            }
        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 3, 4, 5, 7] },
            { targets: 6, "width": "%" }
        ],
        dom: 'Bfrtip',
        buttons: [
            'excel', 'print'
        ],
        // pageLength: 5
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
    $('#myTable tbody').on('click', '#edit', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data.id_date)
        editData(data.id_date)
    });
    $('#myTable tbody').on('click', '#delete', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data.id_date)
        $('#projId').val(data.id_date)
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
        iconUrl: './../icon/isea.png',
        iconSize: [80, 80],
        iconAnchor: [40, 69],
        popupAnchor: [5, -30]
    });

    let icongreen = L.icon({
        iconUrl: './../icon/inormal.png',
        iconSize: [80, 80],
        iconAnchor: [40, 69],
        popupAnchor: [5, -30]
    });


    let iconzero = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/725/725035.png',
        iconSize: [50, 50],
        iconAnchor: [40, 69],
        popupAnchor: [5, -30]
    });

    var d = x;
    let t1 = d.filter(e => e.fwater == 'น้ำจืด')
    let t2 = d.filter(e => e.fwater == 'น้ำเค็ม')

    $('#T0_all').text(d.length)
    $('#T1_list').text(t1.length)
    $('#T2_list').text(t2.length)

    let markers = L.featureGroup();
    x.map(i => {
        // let dat = {
        //     aqi: i.aqi,
        //     pm10: i.pm10,
        //     pm25: i.pm25,
        //     so2: i.so2
        // }
        let txtpopup = `<div class="d-flex flex-column w-100">
                        <h6><b>ชื่อถานที่/ฟาร์ม :</b> ${i.fname}</h6>
                        <h6><b>การทำประมง :</b> ${i.fwater}</h6>
                        <h6><b>ประเภทการประกอบการ :</b> ${i.fcategory}</h6>
                        <h6><b>จังหวัด :</b> ${i.province}</h6>
                        <h6><b>เจ้าของฟาร์ม :</b> ${i.usrname}</h6>
                        <h6>บันทึกเมื่อ${i.date_dt}</h6>
                        </div>`

        let txtTooltip = `<strong class="fk-16">${i.fname}</strong>`
        let marker
        if (i.fwater == "น้ำเค็ม") {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: iconblue,
                name: 'lyr',
                // data: dat
            }).bindPopup(txtpopup)
                .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] });
        } else if (i.fwater == "น้ำจืด") {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: icongreen,
                name: 'lyr',
                // data: dat
            }).bindPopup(txtpopup)
                .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] });
        } else {
            marker = L.marker([Number(i.lat), Number(i.lng)], {
                icon: iconzero,
                name: 'lyr',
                // data: dat
            }).bindPopup(txtpopup)
                .bindTooltip(txtTooltip, { direction: 'top', offset: [0, -25] });
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

let editData = (fid) => {
    location.href = "./../edit/index.html";
    sessionStorage.setItem('fid', fid);
}

let deleteData = () => {
    let fid = $('#projId').val();
    axios.post(url + '/fishing-eac/delete', { fid: fid }).then(r => {
        // console.log(r.data.data)
        r.data.data == 'success' ? $('#deleteModal').modal('hide') : console.log('False')
        $('#myTable').DataTable().ajax.reload();
    })
}

let gotoAddData = () => {
    // localStorage.clear();
    location.href = "./../add/index.html";
}