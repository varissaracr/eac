let userid;

let main = async () => {
    await liff.init({ liffId: "1655648770-JLXzogag" })
    if (liff.isLoggedIn()) {
        getUserProfile()
    } else {
        liff.login()
    }
}

// main()

let getUserProfile = async () => {
    const profile = await liff.getProfile();
    $('#profile').attr('src', await profile.pictureUrl);
    $('#userId').text(profile.userId);
    $('#statusMessage').text(await profile.statusMessage);
    $('#displayName').text(await profile.displayName);
    userid = profile.userId;
}

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

let dataurl;

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

var pro = L.tileLayer.wms("http://rti2dss.com:8080/geoserver/th/wms?", {
    layers: 'th:province_4326',
    format: 'image/png',
    transparent: true
});

var baseMap = {
    "Mapbox": mapbox,
    "google Hybrid": ghyb.addTo(map)
}

var overlayMap = {
    "ขอบจังหวัด": pro
}

L.control.layers(baseMap, overlayMap).addTo(map);

var lat;
var lng;
let gps;
let onLocationFound = (e) => {
    // latlng = e.latlng;
    // lat = e.latlng.lat;
    // lng = e.latlng.lng;
    // console.log(e.latlng)
    // $('#lat').val(e.latlng.lat);
    // $('#lng').val(e.latlng.lng);
    // changeLatlng(e.latlng);
}
function changeLatlng(latlng) {
    // console.log(latlng)
    // gps = L.marker(latlng, {
    //     draggable: true,
    //     name: 'p'
    // });
    // gps.addTo(map).bindPopup("คุณอยู่ที่นี่").openPopup();
    // gps.on('dragend', (e) => {
    //     console.log(e)
    //     $('#lat').val(e.target._latlng.lat);
    //     $('#lng').val(e.target._latlng.lng);
    // })
}
map.on("locationfound", onLocationFound);

var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: ""
    },
    locateOptions: {
        enableHighAccuracy: true,
    }
}).addTo(map);

lc.start();

map.pm.addControls({
    position: 'topleft',
    drawMarker: false,
    drawCircle: false,
    drawPolyline: false,
    drawRectangle: true,
    drawCircleMarker: false,
    cutPolygon: false
});

var datageom
let dataVG = [];
let geom = [];

map.on('pm:create', e => {
    $('#myModal').modal().show()
    datageom = e.layer.toGeoJSON();
});
// console.log(geom)


var test = [{ Name: "", Date: "", Detail: "" }]
showTable(test)
function showTable(data) {
    // console.log(data)
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
    let table = $('#tab').DataTable({
        paging: false,
        language: {
            processing: true,
        },
        data: data,
        columns: [
            { data: 'Name' },
            { data: 'Date' },
            { data: 'Detail' },
        ],
        select: true,
        pageLength: 8,
        responsive: {
            details: false
        },
    });
}
function addrowtab(dataA, dataB, dataC) {
    var addTable = "<tr><td>" + dataA + "</td><td>" + dataB + "</td><td>" + dataC + "</td></tr";
    $("table tbody").prepend(addTable);
}
// 
// document.getElementById('agdate').valueAsDate = new Date();

// let sendData = () => {
//     console.log(geom[0]);
//     const obj = {
//         data: {
//             userid: userid,
//             agname: $('#agname').val(),
//             agdate: $('#agdate').val(),
//             agarea: $('#agarea').val(),
//             agtype: $('#agtype').val(),
//             agdetail: $('#agdetail').val(),
//             img: dataurl ? dataurl : dataurl = "",
//             geom: geom == "" ? "" : geom[0]
//         }
//     }
//     console.log(obj);
//     if (geom.length > 0) {
//         axios.post(url + "/agi-api/insert", obj).then((r) => {
//             r.data.data == "success" ? $("#okmodal").modal("show") : null
//         })
//     } else {
//         $("#modal").modal("show");
//     }
//     return false;
// }

// let gotoList = () => {
//     location.href = "./../list/index.html";
// }

let refreshPage = () => {
    location.reload(true);
}

$('#imgfile').change(function (evt) {
    console.log(evt);
    var files = evt.target.files;
    var file = files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    resize();
});

let resize = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById('imgfile').files;
        var file = filesToUploads[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement("img");
                img.src = e.target.result;
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                var MAX_WIDTH = 800;
                var MAX_HEIGHT = 800;
                var width = img.width;
                var height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                dataurl = canvas.toDataURL(file.type);
                // console.log(dataurl)
                // document.getElementById('output').src = dataurl;
            }
            reader.readAsDataURL(file);
        }
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}
function closeModal() {
    document.getElementById("FormModal").reset();
}

$("#Tagri").on("change", function () {
    var t = this.checked
    if (t == true) {
        $("#TypeA").show();
        $("#TypeB").hide();
        $("#TypeC").hide();
    } else {
        $("#TypeA").hide();
        $("#TypeB").hide();
        $("#TypeC").hide();
    }
})
$("#Tanimal").on("change", function () {
    var t = this.checked
    if (t == true) {
        $("#TypeA").hide();
        $("#TypeB").show();
        $("#TypeC").hide();
    } else {
        $("#TypeA").hide();
        $("#TypeB").hide();
        $("#TypeC").hide();
    }
})
$("#Tfishery").on("change", function () {
    var t = this.checked
    if (t == true) {
        $("#TypeA").hide();
        $("#TypeB").hide();
        $("#TypeC").show();
    } else {
        $("#TypeA").hide();
        $("#TypeB").hide();
        $("#TypeC").hide();
    }
})
$("#standAgri").on("change", function () {
    var a = $("#standAgri").val()
    if (a == "มีการรับรอง") {
        $("#Namestand").show();
    } else if (a == "ไม่มีการรับรอง") {
        $("#Namestand").hide();
    }
})
$("#fishselect").on("change", function () {
    var a = $("#fishselect").val()
    if (a == '1') {
        $("#fish1").show()
        $("#fish2").hide()
        $("#fish3").hide()
        $("#fish4").hide()
        $("#fish5").hide()
    } else if (a == '2') {
        $("#fish1").show()
        $("#fish2").show()
        $("#fish3").hide()
        $("#fish4").hide()
        $("#fish5").hide()
    } else if (a == '3') {
        $("#fish1").show()
        $("#fish2").show()
        $("#fish3").show()
        $("#fish4").hide()
        $("#fish5").hide()
    } else if (a == '4') {
        $("#fish1").show()
        $("#fish2").show()
        $("#fish3").show()
        $("#fish4").show()
        $("#fish5").hide()
    } else if (a == '5') {
        $("#fish1").show()
        $("#fish2").show()
        $("#fish3").show()
        $("#fish4").show()
        $("#fish5").show()
    } else {
        $("#fish1").hide()
        $("#fish2").hide()
        $("#fish3").hide()
        $("#fish4").hide()
        $("#fish5").hide()
    }
})
$("#BuySellUse").on("change", function () {
    var t = this.checked
    if (t == true) {
        $("#BSselect").show();
        $("#Buy").show();
        $("#Sell").show();
        $("#BSselect").on("change", function () {
            var a = $("#BSselect").val();
            console.log(a)
            if (a == "ซื้อขาย") {
                $("#Buy").show();
                $("#Sell").show();

            } else if (a == "ซื้อ") {
                $("#Buy").show();
                $("#Sell").hide();

            } else if (a == "ขาย") {
                $("#Buy").hide();
                $("#Sell").show();
            }
        })
    } else {
        $("#BSselect").hide();
        $("#Buy").hide();
        $("#Sell").hide();
    }
})
$("#KeepUse").on("change", function () {
    var t = this.checked
    if (t == true) {
        $("#Keep").show();
    } else {
        $("#Keep").hide();
    }
})
$("#TransUse").on("change", function () {
    var t = this.checked
    if (t == true) {
        $("#Transform").show();
    } else {
        $("#Transform").hide();
    }
})
$("#prodselect").on("change", function () {
    var a = $("#prodselect").val();
    if (a == "1") {
        $("#product1").show();
        $("#product2").hide();
        $("#product3").hide();
        $("#product4").hide();
        $("#product5").hide();
    } else if (a == "2") {
        $("#product1").show();
        $("#product2").show();
        $("#product3").hide();
        $("#product4").hide();
        $("#product5").hide();
    } else if (a == "3") {
        $("#product1").show();
        $("#product2").show();
        $("#product3").show();
        $("#product4").hide();
        $("#product5").hide();
    } else if (a == "4") {
        $("#product1").show();
        $("#product2").show();
        $("#product3").show();
        $("#product4").show();
        $("#product5").hide();
    } else if (a == "5") {
        $("#product1").show();
        $("#product2").show();
        $("#product3").show();
        $("#product4").show();
        $("#product5").show();
    } else {
        $("#product").hide();
        $("#product").hide();
        $("#product").hide();
        $("#product").hide();
        $("#product").hide();
    }
})


function saveModal() {
    let UseBS, UseKeep, UseTrans
    let u1BS, u1buni, u1suni, u2kuni
    let TypeS, tcateg, tdate, tdateout, tare, taruni, tstdard, tstdName, tamount
    let t3sel, t3f1uni, t3f2uni, t3f3uni, t3f4uni, t3f5uni
    let u3prosel, u3p1suni, u3p2suni, u3p3suni, u3p4suni, u3p5suni, u3p1puni, u3p2puni, u3p3puni, u3p4puni, u3p5puni

    var TypeAgri = document.getElementById('Tagri');
    if (TypeAgri.checked == true) {
        tstdard = $('#standAgri').val() ? $('#standAgri').val() : $('#standAgri').val() = ""
        tstdName = $('#namestand').val()
        TypeS = "เกษตรกรรม"
        tcateg = $('#cateAgri').val()
        tdate = $('#dateAgri').val()
        tdateout = $("#dateAgout").val()
        tare = $('#areaAgri').val()
        taruni = $('#unitAgri').val()
        tamount = ""
    } else {
        // TypeS = ""
        tstdName = ""
        tdateout = ""
        tstdard = ""
        tdate = ""
        taruni = ""
    }
    var TypeAnimal = document.getElementById('Tanimal');
    if (TypeAnimal.checked == true) {
        TypeS = "ปศุสัตว์"
        tcateg = $('#cateAni').val()
        tamount = $('#quanAni').val()
        tarea = $('#areaAni').val()
        tarunit = $('#unitAni').val()
    } else {
        // TypeS = ""
        tarunit = ""
    }
    var Typefishery = document.getElementById('Tfishery');
    if (Typefishery.checked == true) {
        TypeS = "การประมง"
        tcateg = $("#watercat").val()
        t3sel = $("#fishselect").val()
        t3f1uni = $("#fishunit1").val()
        t3f2uni = $("#fishunit2").val()
        t3f3uni = $("#fishunit3").val()
        t3f4uni = $("#fishunit4").val()
        t3f5uni = $("#fishunit5").val()
    } else {
        // TypeS = ""
        tcateg = ""
        t3sel = ""
        t3f1uni = ""
        t3f2uni = ""
        t3f3uni = ""
        t3f4uni = ""
        t3f5uni = ""
    }

    var UBS = document.getElementById('BuySellUse');
    if (UBS.checked == true) {
        UseBS = "ซื้อขาย"
        u1BS = $('#BSselect').val()
        u1bUnit = $('#BuyUnit').val()
        u1sUnit = $('#SellUnit').val()
    } else {
        UseBS = ""
        u1BS = ""
        u1buni = ""
        u1suni = ""
    }
    var UK = document.getElementById('KeepUse');
    if (UK.checked == true) {
        UseKeep = "กักเก็บ"
        u2kuni = $('#KeepUnit').val()
    } else {
        UseKeep = ""
        u2kuni = ""
    }
    var UT = document.getElementById('TransUse');
    if (UT.checked == true) {
        UseTrans = "แปรรูป"
        u3prosel = $("#prodselect").val()
        u3staun = $('#stapleUnit').val()
        u3proun = $('#prodUnit').val()

        u3p1suni = $("#stapleUnit1").val()
        u3p2suni = $("#stapleUnit2").val()
        u3p3suni = $("#stapleUnit3").val()
        u3p4suni = $("#stapleUnit4").val()
        u3p5suni = $("#stapleUnit5").val()

        u3p1puni = $("#prodUnit1").val()
        u3p2puni = $("#prodUnit2").val()
        u3p3puni = $("#prodUnit3").val()
        u3p4puni = $("#prodUnit4").val()
        u3p5puni = $("#prodUnit5").val()

    } else {
        UseTrans = ""
        u3prosel = ""
        u3staun = ""
        u3proun = ""

        u3p1suni = ""
        u3p2suni = ""
        u3p3suni = ""
        u3p4suni = ""
        u3p5suni = ""

        u3p1puni = ""
        u3p2puni = ""
        u3p3puni = ""
        u3p4puni = ""
        u3p5puni = ""
    }

    dataVG.push({
        intono: $('#into1').val(),
        intoname: $('#into2').val(),

        typeag: TypeS ? TypeS : TypeS = "",
        t1sdate: tdate ? tdate : tdate = "",
        t1sdateout: tdateout,
        t1stdard: tstdard ? tstdard : tstdard = "",
        t1stdname: tstdName ? tstdName : tstdName = "",

        tcate: tcateg ? tcateg : tcateg = "",
        tarea: tare ? tare : tare = "",
        tarunit: taruni ? taruni : taruni = "",

        t2amount: tamount ? tamount : tamount = "",

        t3wc: tcateg,
        t3select: t3sel,

        t3f1na: $("#namefish1").val(),
        t3f2na: $("#namefish2").val(),
        t3f3na: $("#namefish3").val(),
        t3f4na: $("#namefish4").val(),
        t3f5na: $("#namefish5").val(),

        t3f1num: $("#fishnum1").val(),
        t3f2num: $("#fishnum2").val(),
        t3f3num: $("#fishnum3").val(),
        t3f4num: $("#fishnum4").val(),
        t3f5num: $("#fishnum5").val(),

        t3f1unit: t3f1uni,
        t3f2unit: t3f2uni,
        t3f3unit: t3f3uni,
        t3f4unit: t3f4uni,
        t3f5unit: t3f5uni,

        use1: UseBS,
        use2: UseKeep,
        use3: UseTrans,

        u1bs: u1BS,
        u1bvalue: $('#BuyValue').val(),
        u1bunit: u1buni,
        u1bmony: $('#BuyMony').val(),
        u1blocat: $('#BuyLocat').val(),

        U1sValue: $('#SellValue').val(),
        u1sunit: u1suni,
        u1smony: $('#SellMony').val(),
        u1slocat: $('#SellLocat').val(),

        u2kvalue: $('#KeepValue').val(),
        u2kunit: u2kuni,
        // U3Name: $('#Transname').val(),
        // U3staVa: $('#staple').val(),
        // U3staUn: u3staun,
        // U3proVa: $('#prodValue').val(),
        // U3proUn: u3proun,
        // U3proMn: $('#prodMoney').val(),
        // U3prolo: $('#prodLocat').val(),
        u3pro: u3prosel,

        u3p1na: $("#Transname1").val(),
        u3p2na: $("#Transname2").val(),
        u3p3na: $("#Transname3").val(),
        u3p4na: $("#Transname4").val(),
        u3p5na: $("#Transname5").val(),

        u3p1staval: $("#staple1").val(),
        u3p2staval: $("#staple2").val(),
        u3p3staval: $("#staple3").val(),
        u3p4staval: $("#staple4").val(),
        u3p5staval: $("#staple5").val(),

        u3p1stauni: u3p1suni,
        u3p2stauni: u3p2suni,
        u3p3stauni: u3p3suni,
        u3p4stauni: u3p4suni,
        u3p5stauni: u3p5suni,

        U3p1proval: $("#prodValue1").val(),
        U3p2proval: $("#prodValue2").val(),
        U3p3proval: $("#prodValue3").val(),
        U3p4proval: $("#prodValue4").val(),
        U3p5proval: $("#prodValue5").val(),

        u3p1prouni: u3p1puni,
        u3p2prouni: u3p2puni,
        u3p3prouni: u3p3puni,
        u3p4prouni: u3p4puni,
        u3p5prouni: u3p5puni,


        u3p1promon: $("#prodMoney1").val(),
        u3p2promon: $("#prodMoney2").val(),
        u3p3promon: $("#prodMoney3").val(),
        u3p4promon: $("#prodMoney4").val(),
        u3p5promon: $("#prodMoney5").val(),

        u3p1prolo: $("#prodLocat1").val(),
        u3p2prolo: $("#prodLocat2").val(),
        u3p3prolo: $("#prodLocat3").val(),
        u3p4prolo: $("#prodLocat4").val(),
        u3p5prolo: $("#prodLocat5").val(),

        repordat: $('#rpdate').val(),
        id_date: Date.now(),
        id_user: userid,

        img: dataurl ? dataurl : dataurl = "",
        geom: datageom ? datageom : datageom = "",
    })
    // console.log(obj)
    var TB1 = $('#into1').val();
    var TB2 = $('#into2').val();
    var TB3 = $('#rpdate').val();
    addrowtab(TB1, TB2, TB3)

    document.getElementById("FormModal").reset();
    $("#TypeA").hide();
    $("#TypeB").hide();
    $("#TypeC").hide();
    $("#BSselect").hide();
    $("#Buy").hide();
    $("#Sell").hide();
    $("#Keep").hide();
    $("#Transform").hide();
    $('#myModal').modal('hide');

    console.log("SAVE")
    $("#typegarden2").val(dataVG.length)
    // var idA = Date.now()
}
console.log(dataVG)

let sendData = () => {
    const obj = {
        data: dataVG
    }
    var url = "https://engrids.soc.cmu.ac.th/api";
    $.post(url + "/insee-api/insert", obj).done((r) => {
        r.data.data == "success"
    })
}

// var url2 = "http://localhost:3000"
// $.post(url + "/form_af/insert", obj).done((r) => {
//     r.data.data == "success"
// })
// $.get(url2 + "/gw-api/staid").done(i => {
//     console.log(i)
// })
