let userid;

let main = async () => {
    await liff.init({ liffId: "1655648770-GVq1eLaL" })
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

var url = 'http://localhost:3700';
// var url = 'https://engrids.soc.cmu.ac.th/api';

function onLocationError(e) {
    console.log(e.message);
}

function refreshPage() {
    location.reload(true);
}

let closeLiff = async () => {
    liff.sendMessages([
        {
            type: 'text',
            text: 'ขอบคุณที่เป็นสามาชิกกับเรา'
        }, {
            type: 'text',
            text: 'เลือกที่เมนูเพิ่มข้อมูล เพื่อสรา้งให้ข้อมูลร่วมกันครับ'
        }
    ]).then(() => {
        liff.closeWindow();
    }).catch((err) => {
        console.log('error', err);
    });
}

axios.post(url + '/profile-api/getprofile', { userid: userId }).then(res => {
    console.log(res.data.data[0]);
    getAmp(r.data.data[0].pro);
    getTam(r.data.data[0].amp);
    setTimeout(() => {
        $('#pro').val(r.data.data[0].pro);
        $('#amp').val(r.data.data[0].amp);
        $('#tam').val(r.data.data[0].tam);
    }, 1000);

    $('#usrname').val(res.data.data[0].usrname);
    $('#tel').val(res.data.data[0].tel);
    $('#email').val(res.data.data[0].email);
    $('#ocup').val(res.data.data[0].ocup);
    $('#sex').val(res.data.data[0].sex);

    res.data.data[0].biodiversity == "yes" ? $("#biodiversity").prop("checked", true) : $("#biodiversity").prop("checked", false);
    res.data.data[0].greenarea == "yes" ? $("#greenArea").prop("checked", true) : $("#greenArea").prop("checked", false);
    res.data.data[0].hforest == "yes" ? $("#hforest").prop("checked", true) : $("#hforest").prop("checked", false);
    res.data.data[0].organic == "yes" ? $("#organic").prop("checked", true) : $("#organic").prop("checked", false);
    res.data.data[0].airqua == "yes" ? $("#airQua").prop("checked", true) : $("#airQua").prop("checked", false);
    res.data.data[0].watqua == "yes" ? $("#watQua").prop("checked", true) : $("#watQua").prop("checked", false);
    res.data.data[0].watlev == "yes" ? $("#watLev").prop("checked", true) : $("#watLev").prop("checked", false);
    res.data.data[0].notic == "yes" ? $("#notice").prop("checked", true) : $("#notice").prop("checked", false);

    res.data.data[0].workshop == "yes" ? $("#ws1").prop("checked", true) : $("#ws2").prop("checked", true);

})

$('#fieldForm').submit(function (e) {
    e.preventDefault();
    const obj = {
        data: {
            userid: userid,
            usrname: $('#usrname').val(),
            tel: $('#tele').val(),
            email: $('#email').val() ? $('#email').val() : '-',
            pro_name: $('#pro_name').val(),
            amp_name: $('#amp_name').val(),
            tam_name: $('#tam_name').val(),
            pro: $('#pro').val(),
            amp: $('#amp').val(),
            tam: $('#tam').val(),
            ocup: $('#ocup').val(),
            sex: $('#sex').val(),
            workshop: $('input[name="workshop"]:checked').val()
        }
    }

    $('#biodiversity').is(":checked") ? obj.data.biodiversity = "yes" : obj.data.biodiversity = 'no';
    $('#greenArea').is(":checked") ? obj.data.greenarea = "yes" : obj.data.greenarea = 'no';
    $('#hforest').is(":checked") ? obj.data.hforest = "yes" : obj.data.hforest = 'no';
    $('#organic').is(":checked") ? obj.data.organic = "yes" : obj.data.organic = 'no';
    $('#airQua').is(":checked") ? obj.data.airqua = "yes" : obj.data.airqua = 'no';
    $('#watQua').is(":checked") ? obj.data.watqua = "yes" : obj.data.watqua = 'no';
    $('#watLev').is(":checked") ? obj.data.watlev = "yes" : obj.data.watlev = 'no';
    $('#notice').is(":checked") ? obj.data.notic = "yes" : obj.data.notic = 'no';

    console.log(obj);

    $.post(url + '/profile-api/register', obj).done(async (res) => {
        $('#modal').modal('show');
    })
    return false;
});

let getAmp = (e) => {
    axios.get(url + "/eec-api/get-th-amp/" + e).then(r => {
        $("#amp").empty()
        $("#tam").empty()
        $("#amp").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#amp").append(`<option value="${i.ap_idn}">${i.amp_name}</option>`)
        })
    })
}

let getTam = (e) => {
    axios.get(url + "/eec-api/get-th-tam/" + e).then(r => {
        // console.log(r);
        $("#tam").empty()
        $("#tam").append(`<option value=""></option>`)
        r.data.data.map(i => {
            $("#tam").append(`<option value="${i.tb_idn}">${i.tam_name}</option>`)
        })
    })
}

let getTamOne = (e) => {
    axios.get(url + "/eec-api/get-th-onetam/" + e).then(r => {
        r.data.data.map(i => {
            console.log(i);
            $("#pro_name").val(i.pro_name)
            $("#amp_name").val(i.amp_name)
            $("#tam_name").val(i.tam_name)
        })
    })
}