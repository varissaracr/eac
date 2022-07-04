$(document).ready(() => {
    loadTable()

});

const url = "https://engrids.soc.cmu.ac.th/api";
// const url = 'http://localhost:3700';

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
    let orgid = $("#projId").val()
    axios.post(url + "/green-api/delete", { orgid: orgid }).then(r => {
        r.data.data == "success" ? closeModal() : null
    })
}

$("#charttitle").hide();
$("#spinner").hide();
let getChart = (ws_id) => {
    $("#spinner").show();
    $("#chartd").empty()
    let obj = {
        ws_id: ws_id
    }
    axios.post(url + "/ws-api/getone", obj).then((r) => {
        console.log(r);
        $("#staname").text(r.data.data[0].ws_station)
        $("#charttitle").show()
        for (const [key, value] of Object.entries(r.data.data[0])) {
            if (v[key] && value) {
                $("#chartd").append(
                    `<div class="col-sm-4">
                        <div class="card p-1">
                            <div class="card-body" id="${key}"></div>
                        </div>
                    </div>`
                )
                geneChart([{ "cat": v[key][0], "val": value }], key, v[key][0], v[key][1]);
            }
        }
    })
}

let loadTable = () => {
    let table = $('#myTable').DataTable({
        scrollX: true,
        ajax: {
            async: true,
            type: "POST",
            url: url + '/green-api/getdata',
            data: { userid: "sakda" },
            dataSrc: 'data'
        },
        columns: [
            { data: 'gr_name' },
            {
                data: '',
                render: (data, type, row) => {
                    return `${row.amphoe_t} ${row.prov_nam_t} `
                }
            },
            { data: 'type' },
            { data: 'rai' },
            {
                data: null,
                render: function (data, type, row, meta) {
                    // console.log(row);
                    return `<button class="btn btn-margin btn-outline-success" onclick="getDetail(${row.gid})"><i class="bi bi-bar-chart-fill"></i>&nbsp;รายละเอียด</button>
                            <button class="btn btn-margin btn-outline-danger" onclick="confirmDelete('${row.gid}','${row.gr_name}')"><i class="bi bi-trash"></i>&nbsp;ลบ</button>`
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
}

let getDetail = (e) => {
    sessionStorage.setItem('green_gid', e);
    location.href = "./../detail/index.html";
}

let geneChart = (arr, div, tt, unit) => {
    $("#spinner").hide();
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create(div, am4charts.XYChart);
    chart.data = arr

    var title = chart.titles.create();
    title.text = tt;
    title.fontSize = 14;
    title.marginBottom = 5;

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "cat";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.fontSize = 14;

    var axis = chart.yAxes.push(new am4charts.ValueAxis());
    axis.paddingLeft = 5;
    axis.paddingRight = 5;
    // axis.layout = "absolute";

    axis.title.text = unit;
    axis.title.rotation = 270;
    axis.title.align = "center";
    axis.title.valign = "top";
    axis.title.dy = 12;
    axis.title.fontSize = 14;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "val";
    series.dataFields.categoryX = "cat";
    // series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
}

let pieChart = () => {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
        {
            cat: "Lithuania",
            val: 260
        },
        {
            country: "Czechia",
            value: 230
        },
        {
            country: "Ireland",
            value: 200
        },
        {
            country: "Germany",
            value: 165
        },
        {
            country: "Australia",
            value: 139
        },
        {
            country: "Austria",
            value: 128
        }
    ];

    var series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "val";
    series.dataFields.radiusValue = "val";
    series.dataFields.category = "cat";
    series.slices.template.cornerRadius = 6;
    series.colors.step = 3;

    series.hiddenState.properties.endAngle = -90;

    chart.legend = new am4charts.Legend();
}












