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
map.pm.addControls({
    position: 'topleft',
    drawMarker: false,
    drawCircle: false,
    drawPolyline: false,
    drawRectangle: true,
    drawCircleMarker: false,
    drawText: false,
    cutPolygon: false,
    rotateMode: false,
    removalMode: true,
    editMode: false,
    dragMode: false
});

let geom = "";

let rmlayer = () => {
    map.eachLayer(i => {
        i.options.cname ? map.removeLayer(i) : null;
    })
}

map.on("pm:drawstart", e => {
    rmlayer();
});

map.on("pm:create", e => {
    e.layer.options.cname = "created"
    geom = e.layer.toGeoJSON();
});

$(document).ready(() => {
    loadMap();
    getpro();
    $("#fname").val('admin')

    $(function () {
        $('#eat_plant_list').multiselect({
            includeSelectAllOption: true,
            buttonWidth: '100%',
            maxHeight: 400,
            buttonClass: 'form-control',
            nonSelectedText: 'ตัวเลือก',
            enableFiltering: true,
            // enableCollapsibleOptGroups: true,
            // enableCaseInsensitiveFiltering: false,
            // enableFullValueFiltering: false,
            // enableClickableOptGroups: false,
            // enableCollapsibleOptGroups: false,
            // collapseOptGroupsByDefault: true,
            filterPlaceholder: 'ค้นหา...',
            onChange: function (option, checked) {
                // alert(option.length + ' options ' + (checked ? 'selected' : 'deselected'));
                // $('#w1review').text(option.length + ' options ' + (checked ? 'selected' : 'deselected'))
            },
            buttonText: function (options, select) {
                if (this.disabledText.length > 0
                    && (select.prop('disabled') || (options.length == 0 && this.disableIfEmpty))) {
                    $('#w1review').text(this.disabledText)
                    return this.disabledText;
                } else if (options.length === 0) {
                    $('#w1review').text('')
                    return this.nonSelectedText;
                } else if (this.allSelectedText && options.length === $('option', $(select)).length
                    && $('option', $(select)).length !== 1 && this.multiple) {
                    if (this.selectAllNumber) {
                        $('#w1review').text('เลือกทั้งหมด' + ' (' + options.length + ')')
                        // return this.allSelectedText + ' (' + options.length + ')';
                        return 'เลือกทั้งหมด' + ' (' + options.length + ')';
                    }
                    else {
                        $('#w1review').text(this.allSelectedText)
                        return this.allSelectedText;
                    }
                } else if (this.numberDisplayed != 0 && options.length > this.numberDisplayed) {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w1review').text(selected)
                    return options.length + ' ' + this.nSelectedText;
                } else {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w1review').text(selected)
                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
        });
        $('#use_plant_list').multiselect({
            includeSelectAllOption: true,
            buttonWidth: '100%',
            maxHeight: 400,
            buttonClass: 'form-control',
            nonSelectedText: 'ตัวเลือก',
            enableFiltering: true,
            // enableCollapsibleOptGroups: true,
            // enableCaseInsensitiveFiltering: false,
            // enableFullValueFiltering: false,
            // enableClickableOptGroups: false,
            // enableCollapsibleOptGroups: false,
            // collapseOptGroupsByDefault: true,
            filterPlaceholder: 'ค้นหา...',
            onChange: function (option, checked) {
                // alert(option.length + ' options ' + (checked ? 'selected' : 'deselected'));
                // $('#w2review').text(option.length + ' options ' + (checked ? 'selected' : 'deselected'))
            },
            buttonText: function (options, select) {
                if (this.disabledText.length > 0
                    && (select.prop('disabled') || (options.length == 0 && this.disableIfEmpty))) {
                    $('#w2review').text(this.disabledText)
                    return this.disabledText;
                } else if (options.length === 0) {
                    $('#w2review').text('')
                    return this.nonSelectedText;
                } else if (this.allSelectedText && options.length === $('option', $(select)).length
                    && $('option', $(select)).length !== 1 && this.multiple) {
                    if (this.selectAllNumber) {
                        $('#w2review').text('เลือกทั้งหมด' + ' (' + options.length + ')')
                        // return this.allSelectedText + ' (' + options.length + ')';
                        return 'เลือกทั้งหมด' + ' (' + options.length + ')';
                    }
                    else {
                        $('#w2review').text(this.allSelectedText)
                        return this.allSelectedText;
                    }
                } else if (this.numberDisplayed != 0 && options.length > this.numberDisplayed) {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w2review').text(selected)
                    return options.length + ' ' + this.nSelectedText;
                } else {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w2review').text(selected)
                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
        });
        $('#econ_plant_list').multiselect({
            includeSelectAllOption: true,
            buttonWidth: '100%',
            maxHeight: 400,
            buttonClass: 'form-control',
            nonSelectedText: 'ตัวเลือก',
            enableFiltering: true,
            // enableCollapsibleOptGroups: true,
            // enableCaseInsensitiveFiltering: false,
            // enableFullValueFiltering: false,
            // enableClickableOptGroups: false,
            // enableCollapsibleOptGroups: false,
            // collapseOptGroupsByDefault: true,
            filterPlaceholder: 'ค้นหา...',
            onChange: function (option, checked) {
                // alert(option.length + ' options ' + (checked ? 'selected' : 'deselected'));
                // $('#w3review').text(option.length + ' options ' + (checked ? 'selected' : 'deselected'))
            },
            buttonText: function (options, select) {
                if (this.disabledText.length > 0
                    && (select.prop('disabled') || (options.length == 0 && this.disableIfEmpty))) {
                    $('#w3review').text(this.disabledText)
                    return this.disabledText;
                } else if (options.length === 0) {
                    $('#w3review').text('')
                    return this.nonSelectedText;
                } else if (this.allSelectedText && options.length === $('option', $(select)).length
                    && $('option', $(select)).length !== 1 && this.multiple) {
                    if (this.selectAllNumber) {
                        $('#w3review').text('เลือกทั้งหมด' + ' (' + options.length + ')')
                        // return this.allSelectedText + ' (' + options.length + ')';
                        return 'เลือกทั้งหมด' + ' (' + options.length + ')';
                    }
                    else {
                        $('#w3review').text(this.allSelectedText)
                        return this.allSelectedText;
                    }
                } else if (this.numberDisplayed != 0 && options.length > this.numberDisplayed) {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w3review').text('เลือกทั้งหมด' + ' (' + options.length + ')')
                    // return options.length + ' ' + this.nSelectedText;
                    return 'เลือกทั้งหมด' + ' (' + options.length + ')';
                } else {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w3review').text(selected)
                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
        });
        $('#herb_plant_list').multiselect({
            includeSelectAllOption: true,
            buttonWidth: '100%',
            maxHeight: 400,
            buttonClass: 'form-control',
            nonSelectedText: 'ตัวเลือก',
            enableFiltering: true,
            // enableCollapsibleOptGroups: true,
            // enableCaseInsensitiveFiltering: false,
            // enableFullValueFiltering: false,
            // enableClickableOptGroups: false,
            // enableCollapsibleOptGroups: false,
            // collapseOptGroupsByDefault: true,
            filterPlaceholder: 'ค้นหา...',
            onChange: function (option, checked) {
                // alert(option.length + ' options ' + (checked ? 'selected' : 'deselected'));
                // $('#w4review').text(option.length + ' options ' + (checked ? 'selected' : 'deselected'))
            },
            buttonText: function (options, select) {
                if (this.disabledText.length > 0
                    && (select.prop('disabled') || (options.length == 0 && this.disableIfEmpty))) {
                    $('#w4review').text(this.disabledText)
                    return this.disabledText;
                } else if (options.length === 0) {
                    $('#w4review').text('')
                    return this.nonSelectedText;
                } else if (this.allSelectedText && options.length === $('option', $(select)).length
                    && $('option', $(select)).length !== 1 && this.multiple) {
                    if (this.selectAllNumber) {
                        $('#w4review').text('เลือกทั้งหมด' + ' (' + options.length + ')')
                        // return this.allSelectedText + ' (' + options.length + ')';
                        return 'เลือกทั้งหมด' + ' (' + options.length + ')';
                    }
                    else {
                        $('#w4review').text(this.allSelectedText)
                        return this.allSelectedText;
                    }
                } else if (this.numberDisplayed != 0 && options.length > this.numberDisplayed) {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w4review').text(selected)
                    return options.length + ' ' + this.nSelectedText;
                } else {
                    var selected = ''; var delimiter = this.delimiterText;
                    options.each(function () {

                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();

                        selected += label + delimiter;

                    });
                    $('#w4review').text(selected)
                    return selected.substr(0, selected.length - this.delimiterText.length);
                }
            },
        });
    });
    // var data = [
    //     { label: 'Option 1', title: 'Layer 1', value: '1' },
    //     { label: 'Option 2', title: 'Layer 2', value: '2' },
    //     { label: 'Option 3', title: 'Layer 3', value: '3', selected: true }
    // ];
    // $('#MultipleCheckboxes').multiselect('dataprovider', data);
});


let addEatList = () => {
    let newItem = $("#newitem_eat_plant_list").val();
    $("#eat_plant_list").append(`<option value="${newItem}" selected>${newItem}</option>`);
    $("#newitem_eat_plant_list").val("")
}

let addUseList = () => {
    let newItem = $("#newitem_use_plant_list").val();
    $("#use_plant_list").append(`<option value="${newItem}" selected>${newItem}</option>`);
    $("#newitem_use_plant_list").val("")
}

let addEconList = () => {
    let newItem = $("#newitem_econ_plant_list").val();
    $("#econ_plant_list").append(`<option value="${newItem}" selected>${newItem}</option>`);
    $("#newitem_econ_plant_list").val("")
}

let addHerbList = () => {
    let newItem = $("#newitem_herb_plant_list").val();
    $("#herb_plant_list").append(`<option value="${newItem}" selected>${newItem}</option>`);
    $("#newitem_herb_plant_list").val("")
}
let addOtherList = () => {
    let newItem = $("#newitem_Other_plant_list").val();
    $("#Other_plant_list").append(`<option value="${newItem}" selected>${newItem}</option>`);
    $("#newitem_Other_plant_list").val("")
}

$('input[id="checkEat"]').click(function () {
    if ($(this).prop("checked") == true) {
        $("#boxEat").removeClass("disabledbox");
    }
    else if ($(this).prop("checked") == false) {
        $("#boxEat").addClass("disabledbox");
    }
});
$('input[id="checkUse"]').click(function () {
    if ($(this).prop("checked") == true) {
        $("#boxUse").removeClass("disabledbox");
    }
    else if ($(this).prop("checked") == false) {
        $("#boxUse").addClass("disabledbox");
    }
});
$('input[id="checkEcon"]').click(function () {
    if ($(this).prop("checked") == true) {
        $("#boxEcon").removeClass("disabledbox");
    }
    else if ($(this).prop("checked") == false) {
        $("#boxEcon").addClass("disabledbox");
    }
});
$('input[id="checkHerb"]').click(function () {
    if ($(this).prop("checked") == true) {
        $("#boxHerb").removeClass("disabledbox");
    }
    else if ($(this).prop("checked") == false) {
        $("#boxHerb").addClass("disabledbox");
    }
});
$('input[id="checkOther"]').click(function () {
    if ($(this).prop("checked") == true) {
        $("#boxOther").removeClass("disabledbox");
    }
    else if ($(this).prop("checked") == false) {
        $("#boxOther").addClass("disabledbox");
    }
});

let imgurl = "";
let imgurl2 = "";
let imgurl3 = "";
let imgurl4 = "";
$("#imgfile").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img1');
        document.getElementById('preview').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});
$("#imgfile2").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile2').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img2');
        document.getElementById('preview2').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});
$("#imgfile3").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile3').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img3');
        document.getElementById('preview3').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});
$("#imgfile4").change(function (evt) {
    var filesToUploads = document.getElementById('imgfile4').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file, 'img4');
        document.getElementById('preview4').src = imageOriginal;
    }
    reader.readAsDataURL(file);
});

let resizeImage = (file, name) => {
    var maxW = 600;
    var maxH = 600;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.createElement('img');
    var result = '';
    img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        context.drawImage(img, 0, 0, iwScaled, ihScaled);
        result += canvas.toDataURL('image/jpeg', 0.5);
        if (name == 'img1') {
            imgurl = result;
        } else if (name == 'img2') {
            imgurl2 = result;
        } else if (name == 'img3') {
            imgurl3 = result;
        } else if (name == 'img4') {
            imgurl4 = result;
        }
        // document.getElementById('rez').src = that.imageResize;
    }
    img.src = URL.createObjectURL(file);
}
let getpro = () => {
    axios.get(url + `/th/province`).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#pro').append(`<option value="${i.pv_code}">${i.pv_tn}</option>`)
        })
    })
}

$('#pro').on('change', function () {
    var code = $('#pro').val()
    $("#amp").empty();
    $("#tam").empty();
    console.log(code)
    axios.post(url + `/th/amphoe`, { pv_code: code }).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#amp').append(`<option value="${i.ap_idn}">${i.ap_tn}</option>`)
        })
        // amp_n = d[0].ap_tn
        // amp_c = d[0].ap_idn
    })
    // prov_n = $('#pro').children("option:selected").text()
    // prov_c = $('#pro').children("option:selected").val()
    // console.log(prov_c)
})

$('#amp').on('change', function () {
    var code = $('#amp').val()
    $("#tam").empty();
    // var url = "http://localhost:3000";
    axios.post(url + `/th/tambon`, { ap_idn: code }).then(async (r) => {
        var d = r.data.data;
        d.map(i => {
            $('#tam').append(`<option value="${i.tb_idn}">${i.tb_tn}</option>`)
        })
        tam_n = d[0].tb_tn
        tam_c = d[0].tb_idn
    })
    // amp_n = $('#amp').children("option:selected").text()
    // amp_c = $('#amp').children("option:selected").val()
    // console.log(amp_c)
})

$('#tam').on('change', function () {
    // tam_n = $('#tam').children("option:selected").text()
    // tam_c = $('#tam').children("option:selected").val()
    // console.log(tam_c)
})

let chkData = () => {
    if (!geom) {
        $("#chkgeommodal").modal("show")
    } else {
        postData()
    }
}

let postData = async () => {
    let eat_plant_list = $("#eat_plant_list").val();
    let use_plant_list = $("#use_plant_list").val();
    let econ_plant_list = $("#econ_plant_list").val();
    let herb_plant_list = $("#herb_plant_list").val();
    let Other_plant_list = $("#Other_plant_list").val();
    let ffid = Date.now()
    let urid = '0123456789'
    let fname = $("#fname").val();
    const date2 = new Date(ffid);
    let dt = `วันที่ ${date2.getDate()}/${date2.getMonth() + 1}/${date2.getFullYear()} เวลา ${date2.getHours()}.${date2.getMinutes()} น.`

    await eat_plant_list.map(i => {
        let obj = {
            ftype: "พืชกินได้",
            fplant: i,
            ffid: ffid,
            usrid: urid,
            usrname: fname,
            date_dt: dt
        }
        // console.log("พืชกินได้ ok", obj)
        axios.post(url + "/ff-eac/insert", obj).then(
            (r) => r.data.data == "success" ? console.log("พืชกินได้ ok") : null
        );
    })

    await use_plant_list.map(i => {
        let obj = {
            ftype: "พืชใช้สอย",
            fplant: i,
            ffid: ffid,
            usrid: urid,
            usrname: fname,
            date_dt: dt
        }
        // console.log("พืชใช้สอย ok", obj)
        axios.post(url + "/ff-eac/insert", obj).then(
            (r) => r.data.data == "success" ? console.log("พืชใช้สอย ok") : null
        );
    })

    await econ_plant_list.map(i => {
        let obj = {
            ftype: "พืชเศรษฐกิจ",
            fplant: i,
            ffid: ffid,
            usrid: urid,
            usrname: fname,
            date_dt: dt
        }
        // console.log("พืชเศรษฐกิจ ok", obj)
        axios.post(url + "/ff-eac/insert", obj).then(
            (r) => r.data.data == "success" ? console.log("พืชเศรษฐกิจ ok") : null
        );
    })

    await herb_plant_list.map(i => {
        let obj = {
            ftype: "พืชสมุนไพร",
            fplant: i,
            ffid: ffid,
            usrid: urid,
            usrname: fname,
            date_dt: dt
        }
        // console.log("พืชสมุนไพร ok", obj)
        axios.post(url + "/ff-eac/insert", obj).then(
            (r) => r.data.data == "success" ? console.log("พืชสมุนไพร ok") : null
        );
    })
    await Other_plant_list.map(i => {
        let obj = {
            ftype: "อื่นๆ",
            fplant: i,
            ffid: ffid,
            usrid: urid,
            usrname: fname,
            date_dt: dt
        }
        // console.log("ok", obj)
        axios.post(url + "/ff-eac/insert", obj).then(
            (r) => r.data.data == "success" ? console.log("พืชสมุนไพร ok") : null
        );
    })


    let frai = $("#frai").val();
    let flandtype = $("#flandtype").val();
    let flocation = $("#flocation").val();
    let prov = $("#pro").val() !== "TH" ? $("#pro option:selected").text() : "false";
    let amphoe = $("#amp").val() !== null ? $("#amp option:selected").text() : "false";
    let tambon = $("#tam").val() !== null ? $("#tam option:selected").text() : "false";

    let datObj = {
        ffid: ffid,
        data: {
            usrid: urid,
            usrname: fname,
            frai: frai,
            flandtype: flandtype,
            flocation: flocation,
            province: prov,
            amphoe: amphoe,
            tambon: tambon,
            geom: geom,
            img1: imgurl,
            img2: imgurl2,
            img3: imgurl3,
            img4: imgurl4,
            date_dt: dt
        }
    }
    // console.log($('#MultipleCheckboxes').val())
    // console.log(datObj)
    await axios.post(url + "/ff-eac/save/geom", datObj).then(() => $("#confirmModal").modal("show"));
}

let gotoDashboard = () => {
    $("#confirmModal").modal("hide");
    // localStorage.clear();
    location.href = "./../dashboard/index.html";
}
let gotoDashboard2 = () => {
    location.href = "./../dashboard/index.html";
}