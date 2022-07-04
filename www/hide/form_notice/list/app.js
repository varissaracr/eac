$(document).ready(() => {
    loadTable()

});

const url = "https://engrids.soc.cmu.ac.th/api";
// const url = 'http://localhost:3700';

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

let confirmDelete = (id, gr_name) => {
    $("#projId").val(id)
    $("#projName").text(gr_name)
    $("#deleteModal").modal("show")
}

let closeModal = () => {
    $('#editModal').modal('hide')
    $('#deleteModal').modal('hide')
    $('#myTable').DataTable().ajax.reload();
}

let deleteValue = () => {
    // console.log($("#projId").val());
    let proj_id = $("#projId").val()
    axios.post(url + "/notice-api/delete", { proj_id: proj_id }).then(r => {
        r.data.data == "success" ? closeModal() : null
    })
}

let loadTable = () => {
    let dtable = $('#myTable').DataTable({
        scrollX: true,
        ajax: {
            async: true,
            type: "POST",
            url: url + '/notice-api/getdata',
            data: { userid: "sakda" },
            dataSrc: 'data'
        },
        columns: [
            { data: 'noticename' },
            {
                data: '',
                render: (data, type, row) => {
                    return `ต.${row.tam_name} อ.${row.amp_name} จ.${row.pro_name} `
                }
            },
            { data: 'ndate' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    // console.log(row);
                    return `<button class="btn m btn-outline-info" onclick="zoomMap(${row.lat}, ${row.lon})"><i class="bi bi-map"></i>&nbsp;zoom</button>
                            <button class="btn btn-margin btn-outline-success" onclick="getDetail(${row.proj_id})"><i class="bi bi-bar-chart-fill"></i>&nbsp;รายละเอียด</button>
                            <button class="btn btn-margin btn-outline-danger" onclick="confirmDelete('${row.proj_id}','${row.noticename}')"><i class="bi bi-trash"></i>&nbsp;ลบ</button>`
                },
                width: "25%"
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
        loadNoticetype(data);
        loadNoticepro(data);
    });
}

let zoomMap = (lat, lon) => {
    // console.log(lat, lon);
    map.setView([lat, lon], 14)
}

let onEachFeature = (feature, layer) => {
    // console.log(feature);
    if (feature.properties) {
        layer.bindPopup(`<b>${feature.properties.noticename}</b>
            <br>${feature.properties.noticedetail}
            <br><img src="${feature.properties.img}" width="240px">`,
            { maxWidth: 240 });
    }
}

let getMarker = (d) => {
    map.eachLayer(i => {
        i.options.name == "marker" ? map.removeLayer(i) : null;
    });

    d.map(i => {
        // console.log(i);
        if (i.geojson) {
            let json = JSON.parse(i.geojson);
            json.properties = { noticename: i.noticename, noticedetail: i.noticedetail, img: i.img };

            L.geoJson(json, {
                onEachFeature: onEachFeature,
                name: "marker"
            }).addTo(map)
        }
    });
}

let loadNoticetype = async (d) => {
    console.log(d);
    let hazard = 0;
    let diaster = 0;
    let other = 0;

    await d.map(i => {
        i.noticetype == "มลพิษ" ? hazard += 1 : null
        i.noticetype == "ภัยธรรมชาติ" ? diaster += 1 : null
        i.noticetype == "อื่นๆ" ? other += 1 : null
    })

    let dat = [{
        name: "มลพิษ",
        value: hazard
    }, {
        name: "ภัยธรรมชาติ",
        value: diaster
    }, {
        name: "อื่นๆ",
        value: other
    }]

    pieChart("chartnoticetype", dat)
}

let loadNoticepro = async (d) => {
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

    chartbiopro("chartnoticepro", dat)
}

let getDetail = (e) => {
    sessionStorage.setItem('notice_gid', e);
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
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
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

    chart.legend = new am4charts.Legend();
}












