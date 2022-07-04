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
    let table = $('#myTable').DataTable({
        ajax: {
            type: "get",
            url: url + `/ff-eac/geom/data`,
            dataSrc: 'data',
        },
        columns: [
            {
                data: '',
                render: (data, type, row, meta) => {
                    return `${meta.row + 1}`
                }
            },
            { data: 'date_dt', },
            { data: 'usrname' },
            { data: 'province' },
            {
                data: '',
                defaultContent: `<button type="button" class="btn btn-success" id="update">อัปเดตข้อมูล</button>
                                 <button type="button" class="btn btn-danger" id="delete">ลบ!</button>`
            },
        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 3] },
            {
                targets: 0, "width": "5%",
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
    });

    $('#myTable tbody').on('click', '#update', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data.ffid)
        sessionStorage.setItem('ffid', data.ffid);
        location.href = "./../update/index.html";
    });
    $('#myTable tbody').on('click', '#delete', function () {
        var data = table.row($(this).parents('tr')).data();
        console.log(data.ffid)
        $('#projId').val(data.ffid)
        $('#deleteModal').modal('show')
    });
}

$(document).ready(() => {
    loadMap();
    loadTable();
    loadDash();
});

let fc = L.featureGroup().addTo(map);
let getMap = (data) => {
    var myStyle = {
        "color": "#50cfce",
        "weight": 5,
        "opacity": 0.65
    };
    data.map(i => {
        if (i.geom) {
            let dat = {
                "type": "Feature",
                "geometry": JSON.parse(i.geom),
                "properties": {
                    "name": i.ffid
                }
            }
            let json = L.geoJSON(dat, { style: myStyle });
            json.bindPopup(`<h6><b>เจ้าของแปลง :</b> ${i.usrname}</h6>
                            <h6><b>ประเภทแปลง :</b> ${i.flandtype}</h6>
                            <h6><b>ที่ตั้ง :</b> ${i.flocation !== null ? i.flocation : ' -'}</h6>
                            <h6><b>จังหวัด :</b> ${i.province}</h6>
                            <h6><b>บันทึกเมื่อ :</b> ${i.date_dt}</h6>`)
                .bindTooltip(`<strong>${i.usrname}</strong>`, { sticky: true })
                .on("mouseover", () => {
                    json.setStyle({
                        color: "#F5D947",
                        // fillColor: "green",
                        // fillOpacity: 0.5
                    });
                })
                .on("mouseout", () => {
                    json.setStyle(myStyle)
                })
                .addTo(fc);
            // $("#listItem").append(`<a class="list-group-item list-group-item-action" onclick="getParcel(${i.ffid})">${i.ffid}</a>`);
        }
        // console.log(i);
    })
    map.fitBounds(fc.getBounds());
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
    remove_Lbng();

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

let deleteData = () => {
    let ffid = $('#projId').val();
    axios.post(url + '/ff-eac/geom/delete', { ffid: ffid }).then(r => {
        // console.log(r.data.data)
        r.data.data == 'success' ? $('#deleteModal').modal('hide') : console.log('False')
        $('#myTable').DataTable().ajax.reload();
    })
}

let loadDash = () => {
    axios.get(url + '/ff-eac/geom/data').then(r => {
        // console.log(r.data.data)
        let p1 = []
        let p2 = []
        let p3 = []
        let p4 = []
        let p5 = []
        let p6 = []
        let p7 = []
        let p8 = []
        let p9 = []

        let d = r.data.data
        $('#prov0').text(d.length)

        d.map(async (x) => {
            if (x.province == 'ชลบุรี') { p1.push({ province: x.province }) }
            else if (x.province == 'ฉะเชิงเทรา') { p2.push({ province: x.province }) }
            else if (x.province == 'ระยอง') { p3.push({ province: x.province }) }
            else if (x.province == 'จันทบุรี') { p4.push({ province: x.province }) }
            else if (x.province == 'ตราด') { p5.push({ province: x.province }) }
            else if (x.province == 'นครนายก') { p6.push({ province: x.province }) }
            else if (x.province == 'ปราจีนบุรี') { p7.push({ province: x.province }) }
            else if (x.province == 'สระแก้ว') { p8.push({ province: x.province }) }
            else if (x.province == 'สมุทรปราการ') { p9.push({ province: x.province }) }
        })
        $('#prov1').text(p1.length)
        $('#prov2').text(p2.length)
        $('#prov3').text(p3.length)
        $('#prov4').text(p4.length)
        $('#prov5').text(p5.length)
        $('#prov6').text(p6.length)
        $('#prov7').text(p7.length)
        $('#prov8').text(p8.length)
        $('#prov9').text(p9.length)
    })
}

let gotoAddData = () => {
    // localStorage.clear();
    location.href = "./../add/index.html";
}