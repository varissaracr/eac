const url = "https://engrids.soc.cmu.ac.th/api";
// const url = 'http://localhost:3700';
const eacGeoserver = "https://engrids.soc.cmu.ac.th/geoserver";
const eecGeoserverWMS = "https://engrids.soc.cmu.ac.th/geoserver/eac/wms?";

var map = L.map('map', {
    center: [13.3234652, 101.7580673],
    zoom: 8,
    zoomControl: false
});

const mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
});

const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    lyr: 'basemap'
});
const CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    lyr: 'basemap'
});

const CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
    lyr: 'basemap'
});

const grod = L.tileLayer('https://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    lyr: 'basemap'
});
const ghyb = L.tileLayer('https://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    lyr: 'basemap'
});

const pro = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:prov_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 10,
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

const tam = L.tileLayer.wms("https://engrids.soc.cmu.ac.th/geoserver/eac/wms?", {
    layers: "eac:tam_eac",
    format: "image/png",
    transparent: true,
    maxZoom: 18,
    // minZoom: 14,
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


var baseMap = {
    "แผนที่ OSM": osm,
    "แผนที่ CartoDB": CartoDB_Positron,
    "แผนที่ถนน": grod,
    "แผนที่ภาพถ่าย": ghyb.addTo(map)
}
const overlayMap = {
    "ขอบเขตจังหวัด": pro.addTo(map),
    "ขอบเขตอำเภอ": amp,
    "ขอบเขตตำบล": tam,
    "แม่น้ำสายหลัก": main_river_rid9,
    "อ่างเก็บน้ำ": w_reserve_63.addTo(map)
}

const lyrControl = L.control.layers(baseMap, overlayMap, {
    collapsed: true
}).addTo(map);


// L.control.layers(baseMap, overlayMap).addTo(map)
L.control.zoom({ position: 'bottomright' }).addTo(map);

// L.control.layers(baseMap, overlayMap).addTo(map);
let refreshPage = () => {
    location.href = "./../report/index.html";
}

let getDetail = (e) => {
    sessionStorage.setItem('orgid', e);
    location.href = "./../detail/index.html";
}


let responseWeather = axios.get(url + '/eec-api/get-weather-3hr-all');
let loadMeteo = async () => {
    let iconblue = L.icon({
        iconUrl: './marker-meteo/location-pin-blue.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let icongreen = L.icon({
        iconUrl: './marker-meteo/location-pin-green.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconyellow = L.icon({
        iconUrl: './marker-meteo/location-pin-yellow.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconorange = L.icon({
        iconUrl: './marker-meteo/location-pin-orange.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let iconred = L.icon({
        iconUrl: './marker-meteo/location-pin-red.svg',
        iconSize: [40, 45],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });
    var markergroup = L.layerGroup([]);

    let x = await responseWeather;
    x.data.data.map(i => {
        // console.log(i);
        let dat = {
            sta_th: i.sta_th,
            rain24hr: i.rain24hr,
            air_temp: i.air_temp,
            rh: i.rh,
            msl_pressure: i.msl_pressure,
            windspeed: i.windspeed
        }

        let marker
        if (Number(i.rainfall) <= 25) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconblue,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });

        } else if (Number(i.rainfall) <= 50) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: icongreen,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        } else if (Number(i.rainfall) <= 100) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconyellow,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        } else if (Number(i.rainfall) <= 200) {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconorange,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        } else {
            marker = L.marker([Number(i.lat), Number(i.lon)], {
                icon: iconred,
                name: 'lyr',
                id: i.sta_id,
                data: dat
            });
        }
        // marker.addTo(map)
        marker.bindPopup(`รหัส : ${i.sta_num}<br> 
        ชื่อสถานี : ${i.sta_th} <br> 
        ปริมาณน้ำฝนปัจจุบัน : ${Number(i.rainfall).toFixed(1)} mm.<br> 
        ปริมาณน้ำฝน 24 ชม. : ${Number(i.rain24hr).toFixed(1)} mm.<br> 
        ความชื้นสัมพัทธ์ : ${Number(i.rh).toFixed(1)} %.<br> 
        อุณหภูมิ : ${Number(i.air_temp).toFixed(1)} องศาเซลเซียส<br> 
        ความกดอากาศ : ${Number(i.msl_pressure).toFixed(1)} มิลลิบาร์<br> 
        ความเร็วลม : ${Number(i.windspeed).toFixed(1)} กิโลเมตร/ชั่วโมง`
        )

        markergroup.addLayer(marker)

    })
    lyrControl.addOverlay(markergroup, "จุดตรวจวัดสภาพอากาศ (กรมอุตุนิยมวิทยา)")

}

loadMeteo()

let loadWtrl = async () => {
    let iconblue = L.icon({
        iconUrl: './marker/wl-01.png',
        iconSize: [50, 50],
        iconAnchor: [12, 37],
        popupAnchor: [5, -30]
    });

    let stname = [
        {
            stname: "station_01",
            latlon: [12.8661616, 100.9989804],
            measure: 275.5
        }, {
            stname: "station_02",
            latlon: [12.848099999999983, 100.95313000000002],
            measure: 244
        }, {
            stname: "station_03",
            latlon: [12.846510200000028, 100.9376361],
            measure: 298
        }, {
            stname: "station_04",
            latlon: [12.694406999999996, 101.44470699999997],
            measure: 294
        }, {
            stname: "station_05",
            latlon: [12.703484000000008, 101.468717],
            measure: 280
        }, {
            stname: "station_06",
            latlon: [12.70139960000001, 101.49543049999],
            measure: 435
        }, {
            stname: "station_07",
            latlon: [12.985111299999994, 101.6776677],
            measure: 380.6
        }, {
            stname: "station_08",
            latlon: [12.909515899999995, 101.71460159999998],
            measure: 512
        }, {
            stname: "station_09",
            latlon: [12.836749900000017, 101.73254899999998],
            measure: 550.5
        }]

    var markergroup = L.layerGroup([]);
    stname.map(async (i) => {
        let resSt01 = axios.post('https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get2.php', { station: i.stname, limit: 1 });
        resSt01.then(r => {
            var n = r.data.data.length - 1
            let d = r.data.data[n];
            let num = i.measure - Number(d.deep);
            let a = num.toFixed(1)
            // console.log(a)

            let marker = L.marker(i.latlon, {
                icon: iconblue,
                name: 'lyr',
                // data: dat
            });
            // marker.addTo(map)
            marker.bindPopup(`<div style="font-family:'Kanit'"> 
            ชื่อสถานี : ${i.stname} <br>
            ระดับน้ำ : ${a < 1 ? 0 : a} cm.<br>
            อุณหภูมิ : ${Number(d.temperature).toFixed(1)} องศาเซลเซียส<br>
            ความชื้นสัมพัทธ์ : ${Number(d.humidity).toFixed(1)} %.<br>
            </div>`
            )
            markergroup.addLayer(marker)
            // console.log(d)
        })
    })
    markergroup.addTo(map)
    lyrControl.addOverlay(markergroup, "จุดตรวจวัดระดับน้ำผิวดิน");
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
        marker.bindPopup(`<div style="font-family:'Kanit'"> 
                        ชื่อสถานี : ${i.staname} <br>
                        ค่าการนำไฟฟ้า (EC) : ${Number(i.ec).toFixed(1)} mS/cm <br>
                        ค่าออกซิเจนละลายน้ำ (DO) : ${Number(i.do).toFixed(1)} mg/L <br>
                        อุณหภูมิ (tmp) : ${Number(i.tmp).toFixed(1)} องศาเซลเซียส<br>
                        ค่าความเป็นกรด-ด่าง (pH) : ${Number(i.ph).toFixed(1)} <br>
                        </div>`
        )
        markergroup.addLayer(marker)
    })
    markergroup.addTo(map)
    lyrControl.addOverlay(markergroup, "จุดตรวจวัดคุณภาพน้ำอัตโนมัติ");

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
        $('#info_table').html('<a type="button" class="btn btn-primary" style="text-align: right;"href="./data-wq1/index.html"> ตารางแสดงข้อมูลย้อนหลัง</a>')
        map.flyTo([13.691624, 101.442835], 14);
    }
    else if (sta == "station_02") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 2 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลบางละมุง อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span>')
        $('#info_table').html('<a type="button" class="btn btn-primary" style="text-align: right;"href="./data-wq2/index.html"> ตารางแสดงข้อมูลย้อนหลัง</a>')
        map.flyTo([13.0465397, 100.9197114], 14);
    }
    else if (sta == "station_03") {
        $('#info_sta').html('<span style="color: #B30D02; font-weight: bold; font-size: 28px"> สถานีตรวจวัดที่ 3 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลบางบุตร อำเภอบ้านค่าย จังหวัดระยอง <br> วันที่: <span id="datenow"></span> เวลา: <span id="timenow"></span> น. </span> ')
        $('#info_table').html('<a type="button" class="btn btn-primary" style="text-align: right;"href="./data-wq3/index.html"> ตารางแสดงข้อมูลย้อนหลัง</a>')
        map.flyTo([12.8291659, 101.3244348], 14);
    }
    else {
        $('#info_sta').text('')
        $('#info_table').text('')
        map.flyTo([13.3234652, 101.7580673], 8);
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
// handleOnFlyTo()

//////////////////// ระดับน้ำ /////////////////

var deepchart = function (stname, d_all) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("deepchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var data = [];
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: stname, limit: 14 }).then(async (r) => {
        // console.log(stname)
        // console.log(r.data.data)
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

var tempchart = function (stname) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("tempchart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var data = [];
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: stname, limit: 14 }).then(async (r) => {
        // console.log(r.data.data)
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
var humichart = function (stname) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("humichart", am4charts.XYChart);
    chart.paddingRight = 60;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    var data = [];
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: stname, limit: 14 }).then(async (r) => {
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

$("#stname").on('change', function () {
    // console.log(this.value)
    axios.post("https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-by-day.php", { stname: this.value, limit: 14 }).then(async (r) => {
        // console.log(r.data.data)
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

        // let a = 275.5 - r.data.data[0].deep
        var n = r.data.data.length - 1
        let d = r.data.data[n]
        // console.log(r.data.data[n])
        this.value == "station_01" ? $("#deep").text(d_format(275.5, d.dept)) : null
        this.value == "station_02" ? $("#deep").text(d_format(244, d.dept)) : null
        this.value == "station_03" ? $("#deep").text(d_format(298, d.dept)) : null
        this.value == "station_04" ? $("#deep").text(d_format(294, d.dept)) : null
        this.value == "station_05" ? $("#deep").text(d_format(280, d.dept)) : null
        this.value == "station_06" ? $("#deep").text(d_format(435, d.dept)) : null
        this.value == "station_07" ? $("#deep").text(d_format(380.6, d.dept)) : null
        this.value == "station_08" ? $("#deep").text(d_format(512, d.dept)) : null
        this.value == "station_09" ? $("#deep").text(d_format(550.5, d.dept)) : null

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


    var stname = $("#stname").val()
    if (stname == "station_01") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 1 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span> ')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_01')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.8661616, 100.9989804], 18);
    }
    else if (stname == "station_02") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 2 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_02')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.848099999999983, 100.95313000000002], 18);
    }
    else if (stname == "station_03") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 3 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_03')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.846510200000028, 100.9376361], 18);
    }
    else if (stname == "station_04") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 4 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลสำนักทอง อำเภอเมืองระยอง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_04')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.694406999999996, 101.44470699999997], 16);
    }
    else if (stname == "station_05") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 5 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลสำนักทอง อำเภอเมืองระยอง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_05')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.703484000000008, 101.468717], 16);
    }
    else if (stname == "station_06") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 6 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลกะเฉด อำเภอเมือง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_06')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.70139960000001, 101.49543049999], 16);
    }
    else if (stname == "station_07") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 7 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลเขาชะเมา อำเภอแกลง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_07')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.985111299999994, 101.6776677], 16);
    }
    else if (stname == "station_08") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 8 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลน้ำเป็น อำเภอเขาชะเมา  จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_08')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.909515899999995, 101.71460159999998], 16);
    }
    else if (stname == "station_09") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 9 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลทุ่งควายกิน อำเภอแกลง จังหวัดระยอง <br> วันที่: <span id="datenow2"></span> เวลา: - น. </span>')
        $('#info_table2').html(`<button type="button" class="btn btn-primary" style="text-align: right;" onclick="linktohistory('station_09')">ตารางแสดงข้อมูลย้อนหลัง</button>`)
        map.flyTo([12.836749900000017, 101.73254899999998], 16);
    }
    else {
        $('#info_sta2').text('')
        $('#info_table2').text('')
        map.flyTo([13.3234652, 101.7580673], 8);
    }



    if ($("#stname").val() == "station_01") {
        var stname = $("#stname").val()
        deepchart(stname, 275.5,);
        tempchart("station_01");
        humichart("station_01");
    }

    else if ($("#stname").val() == "station_02") {
        var stname = $("#stname").val()
        deepchart(stname, 244);
        tempchart("station_02");
        humichart("station_02");

    }
    else if ($("#stname").val() == "station_03") {
        var stname = $("#stname").val()
        deepchart(stname, 298);
        tempchart("station_03");
        humichart("station_03");

    }
    else if ($("#stname").val() == "station_04") {
        var stname = $("#stname").val()
        deepchart(stname, 294);
        tempchart("station_04");
        humichart("station_04");

    }
    else if ($("#stname").val() == "station_05") {
        var stname = $("#stname").val()
        deepchart(stname, 280);
        tempchart("station_05");
        humichart("station_05");

    }
    else if ($("#stname").val() == "station_06") {
        var stname = $("#stname").val()
        deepchart(stname, 435);
        tempchart("station_06");
        humichart("station_06");

    }
    else if ($("#stname").val() == "station_07") {
        var stname = $("#stname").val()
        deepchart(stname, 380.6);
        tempchart("station_07");
        humichart("station_07");

    }
    else if ($("#stname").val() == "station_08") {
        var stname = $("#stname").val()
        deepchart(stname, 512);
        tempchart("station_08");
        humichart("station_08");

    }
    else if ($("#stname").val() == "station_09") {
        var stname = $("#stname").val()
        deepchart(stname, 550.5);
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

H1_open()
H2_close()

function linktohistory (stname){
    var st = stname 
    localStorage.removeItem('station');
   let setst = sessionStorage.setItem('station', st);
   location.href="./data-wl1/index.html" 
    console.log(stname)
}


