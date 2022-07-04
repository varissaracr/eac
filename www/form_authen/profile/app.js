let ustoken = sessionStorage.getItem("ustoken")

// const url = 'http://localhost:3000';
const url = "https://engrids.soc.cmu.ac.th/api";

let refreshPage = () => {
    location.reload(true);
}

let gotoLogin = () => {
    location.href = "./../login/index.html";
}
let gotoIndex = () => {
    location.href = "./../../main_eac/index.html";
}

let loadData = async (id) => {
    axios.post(url + '/eac-auth/getiduser', { userid: id }).then(async (r) => {
        let d = r.data.data
        // console.log(d[0])

        let ndate
        if (d[0].ts !== null) {
            let ts = d[0].ts
            let sp = ts.split("T");
            let date = sp[0].split("-");
            ndate = `${date[2]}/${date[1]}/${Number(date[0]) + 543}`
            $('#dt').val(ndate)
            $("#dt").prop('disabled', true);
        } else {
            // ndate = '-'
            $("#dt").prop('disabled', false);
        }

        getAmp(await d[0].pro);
        getTam(await d[0].amp);
        $('#projId').val(d[0].userid);
        $('#tele').val(d[0].usrname)
        $('#password').val(d[0].pass)
        $('#user_name').val(d[0].uname)
        $('#address').val(d[0].address)
        $('#email').val(d[0].email)
        $('#tel').val(d[0].tel);

        setTimeout(async () => {
            await $('#pro').val(d[0].pro);
        }, 300)
        setTimeout(async () => {
            await $('#amp').val(d[0].amp);
        }, 1000)
        setTimeout(async () => {
            await $('#tam').val(d[0].tam);
        }, 2000)



        $('#ocup').val(d[0].orgname)
        $('#tel1').val(d[0].tel)

        $("#pro_name").val(d[0].pro_name);
        $("#amp_name").val(d[0].amp_name);
        $("#tam_name").val(d[0].tam_name);
        // $("#preview").html(`<img src="${d[0].img !== null ? d[0].img : './img/noimg.png'}" width="100%" style="border-radius: 1.5rem;">`)
        $("#preview").attr("src", d[0].img !== null ? d[0].img : './img/noimg.png');
        d[0].approved == "true"? $("#approv").html(`<span class="text-success"><b>ผ่านการตรวจสอบแล้ว</b></span>`):$("#approv").html(`<span class="text-warning"><b>รอการตรวจสอบ</b></span>`)
    })
}

$(".toggle-password").click(function () {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

let getProv = async () => {
    axios.get(url + "/th/province").then(r => {
        // console.log(r)
        $("#pro").empty().append(`<option value="TH">เลือกจังหวัด</option>`);
        $("#tam").empty().append(`<option value="tam">เลือกตำบล</option>`);
        $("#amp").empty().append(`<option value="amp">เลือกอำเภอ</option>`);
        r.data.data.map(i => {
            $("#pro").append(`<option value="${i.pv_idn}">${i.pv_tn}</option>`)
        })
    })
    console.log(ustoken)
    await loadData(ustoken)
    // await loadData('4e432dd38b4ecb78c70f9de27fbb55b8')
}

let getAmp = (e) => {

    axios.post(url + `/th/amphoe`, { pv_code: e }).then(r => {
        $("#tam").empty().append(`<option value="tam">เลือกตำบล</option>`);
        $("#amp").empty().append(`<option value="amp">เลือกอำเภอ</option>`);
        r.data.data.map(i => {
            $("#amp").append(`<option value="${i.ap_idn}">${i.ap_tn}</option>`)
        })
    })
}

let getTam = (e) => {
    // console.log(e)
    axios.post(url + "/th/tambon", { ap_idn: e }).then(r => {
        $("#tam").empty().append(`<option value="tam">เลือกตำบล</option>`);
        r.data.data.map(i => {
            $("#tam").append(`<option value="${i.tb_idn}">${i.tb_tn}</option>`)
        })
    })
}
let getTamOne = (e) => {
    let pro_n = $("#pro option:selected").text();
    let amp_n = $("#amp option:selected").text();
    let tam_n = $("#tam option:selected").text();

    $("#pro_name").val(pro_n);
    $("#amp_name").val(amp_n);
    $("#tam_name").val(tam_n);
}

$("input[id='tel1']").on("input", function () {
    $("input[id='tel2']").val(destroyMask(this.value));
    this.value = createMask($("input[id='tel2']").val());
})

function createMask(string) {
    // console.log(string)
    return string.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
}

function destroyMask(string) {
    // console.log(string)
    return string.replace(/\D/g, '').substring(0, 10);
}

$(document).ready(() => {
    getProv()
});

let dataurl;
$("#imgfile").change(async () => {
    var filesToUploads = document.getElementById('imgfile').files;
    var file = filesToUploads[0];
    var reader = new FileReader();

    reader.onloadend = (e) => {
        let imageOriginal = reader.result;
        resizeImage(file);
        // document.getElementById('preview').src = imageOriginal;
    }
    reader.readAsDataURL(file);

    setTimeout(() => {
        // $("#preview").attr("src", dataurl);
        axios.post(url + "/eac-auth/updateimgprofile", {
            img: dataurl,
            userid: $('#projId').val(),
        }).then(r => {
            r.data.data == "success" ? $("#preview").attr("src", dataurl) && $('#txtimg').html(`<b class="text-success"><i class="bi bi-check-lg"></i>&nbsp;อัพโหลดรูปภาพสำเร็จ</b>`) :
                $('#txtimg').html(`<b class="text-danger"><i class="bi bi-x-lg"></i>&nbsp;อัพโหลดรูปภาพไม่สำเร็จ</b>`)
        })
    }, 100)

});
let resizeImage = (file) => {
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
        dataurl = result;
        // document.getElementById('rez').src = that.imageResize;
    }
    img.src = URL.createObjectURL(file);


}

let sendData = () => {
    // e.preventDefault();
    let obj = {
        userid: $('#projId').val(),
        data: {
            usrname: $('#tele').val(),
            pass: $('#password').val(),
            uname: $('#user_name').val() !== null ? $('#user_name').val() : null,
            email: $('#email').val() !== null ? $('#email').val() : null,
            address: $('#address').val() !== null ? $('#address').val() : null,
            pro_name: $("#pro_name").val() !== null ? $("#pro_name").val() : $("#pro option:selected").text(),
            amp_name: $("#amp_name").val() !== null ? $("#amp_name").val() : $("#amp option:selected").text(),
            tam_name: $("#tam_name").val() !== null ? $("#tam_name").val() : $("#tam option:selected").text(),
            pro: $('#pro').val(),
            amp: $('#amp').val(),
            tam: $('#tam').val(),
            orgname: $("#ocup").val(),
            tel: $('#tel1').val() !== null ? $('#tel1').val() : null,
            // approved: "false",
        }
    }
    // console.log(obj);
    $.post(url + '/eac-auth/updateprofile', obj).done(async (r) => {
        // console.log(r.data);
        r.data == "success" ? $('#okmodal').modal('show') : $('#falsemodal').modal('show')
        // $('#okmodal').modal('show');
    })

    // return false;
};