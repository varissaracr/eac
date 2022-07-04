let ustoken = sessionStorage.getItem("ustoken")

const url = "https://engrids.soc.cmu.ac.th/api";
// const url = 'http://localhost:3000';

let latlng = {
    lat: 13.305567,
    lng: 101.383101
};

let map = L.map('map', {
    center: latlng,
    zoom: 9
});

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

const tam = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: "th:tambon_4326",
    format: "image/png",
    transparent: true,
    CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=22 OR pro_code=23 OR pro_code=24 OR pro_code=25 OR pro_code=26 OR pro_code=27'
});

const amp = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: "th:amphoe_4326",
    format: "image/png",
    transparent: true,
    CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=22 OR pro_code=23 OR pro_code=24 OR pro_code=25 OR pro_code=26 OR pro_code=27'
});

const pro = L.tileLayer.wms("https://rti2dss.com:8443/geoserver/th/wms?", {
    layers: "th:province_4326",
    format: "image/png",
    transparent: true,
    CQL_FILTER: 'pro_code=20 OR pro_code=21 OR pro_code=22 OR pro_code=23 OR pro_code=24 OR pro_code=25 OR pro_code=26 OR pro_code=27'
});

let lyrs = L.featureGroup().addTo(map)

var baseMap = {
    "Mapbox": mapbox.addTo(map),
    "google Hybrid": ghyb
}

var overlayMap = {
    "ขอบเขตตำบล": tam.addTo(map),
    "ขอบเขตอำเภอ": amp.addTo(map),
    "ขอบเขตจังหวัด": pro.addTo(map)
}

L.control.layers(baseMap, overlayMap).addTo(map);

let refreshPage = () => {
    location.href = "./../report/index.html";
    // console.log("ok");
}

let confirmDelete = (fm_id, fm_id_n) => {
    $("#projId").val(fm_id)
    $("#projName").text(fm_id_n)
    $("#deleteModal").modal("show")
}

let closeModal = () => {
    $('#editModal').modal('hide')
    $('#deleteModal').modal('hide')
    $('#myTable').DataTable().ajax.reload();
}

let deleteValue = () => {
    // console.log($("#projId").val());
    let orgid = $("#projId").val()
    axios.post(url + "/org-api/delete", { orgid: orgid }).then(r => {
        r.data.data == "success" ? closeModal() : null
    })
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
            },
            "emptyTable": "ไม่พบข้อมูล..."
        }
    });
    let dtable = $('#myTable').DataTable({
        scrollX: true,
        ajax: {
            async: true,
            type: "POST",
            url: url + '/org-api/getdata',
            data: { userid: "sakda" },
            dataSrc: 'data'
        },
        columns: [
            {
                data: '',
                render: (data, type, row) => {
                    return `${row.orgid}`
                }
            },
            { data: 'orgname' },
            { data: 'headname' },
            { data: 'orgstatus' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    // console.log(row);
                    return `<button class="btn m btn-outline-info" onclick="zoomMap(${row.lat}, ${row.lon})"><i class="bi bi-map"></i>&nbsp;zoom</button>
                            <button class="btn btn-margin btn-outline-success" onclick="getDetail(${row.orgid})"><i class="bi bi-bar-chart-fill"></i>&nbsp;รายละเอียด</button>
                            <button class="btn btn-margin btn-outline-danger" onclick="confirmDelete('${row.orgid}','${row.orgname}')"><i class="bi bi-trash"></i>&nbsp;ลบ</button>`
                }
            }
        ],
        // "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        dom: 'Bfrtip',
        buttons: [
            'excel', 'print'
        ],
        searching: true
    });

    dtable.on('search.dt', function () {
        let data = dtable.rows({ search: 'applied' }).data()
        getMarker(data);
        loadBytarget(data);
        loadBypro(data);
        loadBytype(data);
    });
}


let zoomMap = (lat, lon) => {
    // console.log(lat, lon);
    map.setView([lat, lon], 14)
}

let onEachFeature = (feature, layer) => {
    // console.log(feature);
    if (feature.properties) {
        layer.bindPopup(`<b>${feature.properties.orgname}</b>
            <br>${feature.properties.orgstatus}
            <br><img src="${feature.properties.img}" width="240px">`,
            { maxWidth: 240 });
    }
}

let getMarker = (d) => {
    // console.log(d)
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });

    d.map(i => {
        // console.log(i);
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            json.properties = { orgname: i.orgname, orgstatus: i.orgstatus, img: i.img };

            L.geoJson(json, {
                onEachFeature: onEachFeature,
                name: "marker"
            }).addTo(map)
        }
    });
}

let loadBytarget = async (d) => {
    console.log(d);
    let runing = 0;
    let stoped = 0;
    let changed = 0;

    await d.map(i => {
        i.orgstatus == "ยังขับเคลื่อนอยู่" ? runing += 1 : null
        i.orgstatus == "หยุดขับเคลื่อน" ? stoped += 1 : null
        i.orgstatus == "เปลี่ยนเป้าหมาย" ? changed += 1 : null
    })

    let dat = [{
        name: "ยังขับเคลื่อนอยู่",
        value: runing
    }, {
        name: "หยุดขับเคลื่อน",
        value: stoped
    }, {
        name: "เปลี่ยนเป้าหมาย",
        value: changed
    }]

    pieChart("chartbystatus", dat)
}

let loadBypro = async (d) => {
    let chan = 0;
    let csao = 0;
    let chon = 0;
    let trad = 0;
    let nyok = 0;
    let pchin = 0;
    let ryong = 0;
    let skeaw = 0;
    await d.map(i => {
        i.pro_name == "จันทบุรี" ? chan += 1 : null;
        i.pro_name == "ฉะเชิงเทรา" ? csao += 1 : null;
        i.pro_name == "ชลบุรี" ? chon += 1 : null;
        i.pro_name == "ตราด" ? trad += 1 : null;
        i.pro_name == "นครนายก" ? nyok += 1 : null;
        i.pro_name == "ปราจีนบุรี" ? pchin += 1 : null;
        i.pro_name == "ระยอง" ? ryong += 1 : null;
        i.pro_name == "สระแก้ว" ? skeaw += 1 : null;
    })
    let dat = [{
        name: "จันทบุรี",
        value: chan
    }, {
        name: "ฉะเชิงเทรา",
        value: csao
    }, {
        name: "ชลบุรี",
        value: chon
    }, {
        name: "ตราด",
        value: trad
    }, {
        name: "นครนายก",
        value: nyok
    }, {
        name: "ปราจีนบุรี",
        value: pchin
    }, {
        name: "ระยอง",
        value: ryong
    }, {
        name: "สระแก้ว",
        value: skeaw
    }];

    chartbiopro("chartbypro", dat)
}

let loadBytype = async (d) => {
    let a1 = 0;
    let a2 = 0;
    let a3 = 0;
    let a4 = 0;
    let a5 = 0;
    let a6 = 0;
    let a7 = 0;
    let a8 = 0;
    let a9 = 0;
    let a10 = 0;
    let a11 = 0;
    let a12 = 0;
    let a13 = 0;
    let a14 = 0;
    let a15 = 0;

    await d.map(i => {
        i.typ_commutrav == "ท่องเที่ยวชุมชน" ? a1 += 1 : null;
        i.typ_commucomfort == "ชุมชนน่าอยู่" ? a2 += 1 : null;
        i.typ_commulearn == "การเรียนรู้บนฐานชุมชน" ? a3 += 1 : null;
        i.typ_commuecon == "กลุ่มอาชีพ เศรษฐกิจชุมชน" ? a15 += 1 : null;
        i.typ_commuforest == "ทรัพยากร ป่าชุมชน" ? a4 += 1 : null;
        i.typ_houseforest == "ทรัพยากร ป่าครอบครัว วนเกษตร" ? a5 += 1 : null;
        i.typ_mangforest == "ทรัพยากร ป่าชายเลน" ? a6 += 1 : null;
        i.typ_landmange == "ทรัพยากร ที่ดิน" ? a7 += 1 : null;
        i.typ_fishing == "ทรัพยากร ประมงและชายฝั่ง" ? a8 += 1 : null;
        i.typ_industwaste == "สิ่งแวดล้อม ด้านขยะอุตสาหกรรม" ? a9 += 1 : null;
        i.typ_housewaste == "สิ่งแวดล้อม ด้านขยะครัวเรือน" ? a10 += 1 : null;
        i.typ_airpollution == "สิ่งแวดล้อม ทางอากาศ" ? a11 += 1 : null;
        i.typ_noisepollution == "สิ่งแวดล้อม ทางเสียง" ? a12 += 1 : null;
        i.typ_organic == "เกษตร(เกษตรอินทรีย์ เกษตรปลอดภัย ฯ)" ? a13 += 1 : null;
        i.typ_watmanage == "ทรัพยากร การจัดการน้ำ" ? a14 += 1 : null;
    })

    let dat = [{
        name: "ท่องเที่ยวชุมชน",
        value: a1
    }, {
        name: "ชุมชนน่าอยู่",
        value: a2
    }, {
        name: "การเรียนรู้บนฐานชุมชน",
        value: a3
    }, {
        name: "กลุ่มอาชีพ เศรษฐกิจชุมชน",
        value: a15
    }, {
        name: "ทรัพยากร ป่าชุมชน",
        value: a4
    }, {
        name: "ทรัพยากร ป่าครอบครัว วนเกษตร",
        value: a5
    }, {
        name: "ทรัพยากร ป่าชายเลน",
        value: a6
    }, {
        name: "ทรัพยากร ที่ดิน",
        value: a7
    }, {
        name: "ทรัพยากร ประมงและชายฝั่ง",
        value: a8
    }, {
        name: "สิ่งแวดล้อม ด้านขยะอุตสาหกรรม",
        value: a9
    }, {
        name: "สิ่งแวดล้อม ด้านขยะครัวเรือน",
        value: a10
    }, {
        name: "สิ่งแวดล้อม ทางอากาศ",
        value: a11
    }, {
        name: "สิ่งแวดล้อม ทางเสียง",
        value: a12
    }, {
        name: "เกษตร(เกษตรอินทรีย์ เกษตรปลอดภัย ฯ)",
        value: a13
    }, {
        name: "ทรัพยากร การจัดการน้ำ",
        value: a14
    }];

    chartbiopro("chartbytype", dat)
}

let getDetail = (e) => {
    sessionStorage.setItem('orgid', e);
    location.href = "./../detail/index.html";
}


let chartbiopro = (div, val) => {
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create(div, am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    chart.data = val;

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
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
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "name";
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
}

let pieChart = (div, val) => {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(div, am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = val;

    var series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.radiusValue = "value";
    series.dataFields.category = "name";
    series.slices.template.cornerRadius = 6;
    series.colors.step = 3;

    series.hiddenState.properties.endAngle = -90;

    series.ticks.template.disabled = true;
    series.alignLabels = false;
    series.labels.template.text = "{category}: {value.percent.formatNumber('#.')}%";
    series.labels.template.radius = am4core.percent(-40);
    series.labels.template.fill = am4core.color("white");

    series.labels.template.adapter.add("radius", function (radius, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return 0;
        }
        return radius;
    });

    series.labels.template.adapter.add("fill", function (color, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
            return am4core.color("#000");
        }
        return color;
    });

    series.labels.template.adapter.add("textOutput", function (text, target) {
        // Hide labels with 0 value
        if (target.dataItem && target.dataItem.values.value.percent == 0) {
            return "";
        }
        return text;
    });
    chart.legend = new am4charts.Legend();
}

let gotoLogin = () => {
    location.href = "./../../form_authen/login/index.html";
}

$(document).ready(() => {
    axios.post(url + '/eac-auth/chkuser', { userid: ustoken }).then(r => {
        r.data.data == "valid" ? loadTable() : gotoLogin();
        // sessionStorage.removeItem("ustoken")
    })
});






