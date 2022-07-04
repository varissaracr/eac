// const url = 'http://localhost:3000';
const url = "https://engrids.soc.cmu.ac.th/api";
let userid;
let dataurl;
let geom = "";
// let gps1;

let gotoLogin = () => {
    location.href = "./../login/index.html";
}

let refreshPage = () => {
    location.reload(true);
}

let register = () => {
    let data = {
        data: {
            usrname: document.getElementById("username").value,
            pass: document.getElementById("password").value,
            uname: $('#user_name').val() !== null ? $('#user_name').val() : null,
            ts: $('#ts_date').val() !== null ? $('#ts_date').val() : null,
            tel: $('#tel1').val() !== null ? $('#tel1').val() : null,
            email: $('#email').val() !== null ? $('#email').val() : null,
            address: $('#address').val() !== null ? $('#address').val() : null,
            pro_name: $("#pro option:selected").text(),
            amp_name: $("#amp option:selected").text(),
            tam_name: $("#tam option:selected").text(),
            pro: $('#pro').val(),
            amp: $('#amp').val(),
            tam: $('#tam').val(),
            // approved: "false",
            orgname: $("#ocup option:selected").text() !== 'อื่นๆ' ? $("#ocup option:selected").text() : $('#org_name').val(),
        }
    }

    console.log(data);

    axios.post(url + "/eac-auth/insertuser", data).then(r => {
        if (r.data.data == "success") {
            $('#okmodal').modal('show')
        } else{
            $('#falsemodal').modal('show')

        }
    })
}


document.getElementById("regisBtn").disabled = true;
let checkPassword = () => {
    let pass1 = document.getElementById("password").value;
    let pass2 = document.getElementById("password2").value;

    if (pass1 !== pass2) {
        document.getElementById("passwarning").innerHTML = `โปรดระบุรหัสผ่านให้เหมือนกัน`;
        document.getElementById("regisBtn").disabled = true;
    } else {
        document.getElementById("passwarning").innerHTML = "";
        document.getElementById("regisBtn").disabled = false;
    }
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

$(document).ready(function () {
    axios.get(url + `/th/province/`).then(r => {
        $("#pro").empty().append(`<option value="TH">เลือกจังหวัด</option>`);
        $("#amp").empty().append(`<option value="amp">เลือกอำเภอ</option>`);
        $("#tam").empty().append(`<option value="tam">เลือกตำบล</option>`);
        r.data.data.map(i => {
            $("#pro").append(`<option value="${i.pv_code}">${i.pv_tn}</option>`)
        })

    });
    getgroup()
    $("#orgname").hide();
})
let getPro = (procode) => {
    axios.post(url + `/th/amphoe`, { pv_code: procode }).then(r => {
        $("#tam").empty().append(`<option value="tam">เลือกตำบล</option>`);
        $("#amp").empty().append(`<option value="amp">เลือกอำเภอ</option>`);
        r.data.data.map(i => {
            $("#amp").append(`<option value="${i.ap_idn}">${i.ap_tn}</option>`)
        })
    })
}
let getAmp = (ampcode) => {
    axios.post(url + `/th/tambon`, { ap_idn: ampcode }).then(r => {
        $("#tam").empty().append(`<option value="tam">เลือกตำบล</option>`);
        r.data.data.map(i => {
            $("#tam").append(`<option value="${i.tb_idn}">${i.tb_tn}</option>`)
        })
    })

    // axios.get(url + `/eec-api/get-amp/${prov_code}`).then(r => {
    //     let data = r.data.data.filter(e => e.amphoe_idn == ampcode)
    //     amp_name = data[0].amp_namt
    //     amp_code = ampcode
    // })
}
// let getTam = (tamcode) => {
//     axios.get(url + `/eec-api/get-tam/${amp_code}`).then(r => {
//         let data = r.data.data.filter(e => e.tambon_idn == tamcode)
//         tam_name = data[0].tam_namt
//         tam_code = tamcode
//     })
// }

let getgroup = (prov) => {
    $("#ocup").empty();
    axios.post(url + '/org-api/getorgan/pro', { prov: prov }).then((r) => {
        r.data.data.map(i => {
            if (i.orgname !== null) {
                $("#ocup").append(`<option value="${i.orgname}">${i.orgname}</option>`)
            }
        })
        $("#ocup").append(`<option value="ไม่ระบุ">ไม่ระบุ</option><option value="อื่นๆ">อื่นๆ</option>`)

    })
}

$("#pro").on("change", function () {
    getPro(this.value)
    let pron = $("#pro option:selected").text();
    getgroup(pron)
});
$("#amp").on("change", function () {
    getAmp(this.value)
});
$("#tam").on("change", function () {
    // getTam(this.value)
});
$("#ocup").on("change", function () {
    if (this.value == "อื่นๆ") {
        $("#orgname").slideDown();
    } else {
        $("#orgname").slideUp();
    }
});