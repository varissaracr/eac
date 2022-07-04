// const url = 'http://localhost:3000';
const url = "https://engrids.soc.cmu.ac.th/api";
let userid;
let dataurl;
let geom = "";
// let gps1;


let gotoReportAdmin = () => {
    location.href = "./../../form_organizeV2/report_admin/index.html";
}

let refreshPage = () => {
    location.reload(true);
}

let checkUser = () => {

}

let login = () => {
    let data = {
        usrname: document.getElementById("username").value,
        pass: document.getElementById("password").value
    }

    axios.post(url + "/eac-auth/getuser", data).then(r => {
        console.log(r.data.data);
        if (r.data.data == 'invalid') {
            document.getElementById("passwarning").innerHTML = `ชื่อหรือรหัสผ่านผิด`;
        } else {
            document.getElementById("passwarning").innerHTML = "";
            sessionStorage.setItem("ustoken", r.data.data)

            gotoReportAdmin()
        }
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
$("#card2").hide()
$("#btn1").click(async function () {
    await $("#card1").animate({ left: '100px' }, "slow").fadeOut(
        function () {
            $("#card2").show("slow").animate({ left: '0px' }, "slow")
        }
    );

});
$("#btn2").click(async function () {
    await $("#card2").animate({ left: '100px' }, "slow").fadeOut(
        function () {
            $("#card1").show("slow").animate({ left: '0px' }, "slow")
        }
    );
});

let checkPassword = () => {
    let pass1 = document.getElementById("password2").value;
    let pass2 = document.getElementById("password2_1").value;

    if (pass1 !== pass2) {
        document.getElementById("passwarning2").innerHTML = `โปรดระบุรหัสผ่านให้เหมือนกัน`;
        document.getElementById("changePass").disabled = true;
    } else {
        document.getElementById("passwarning2").innerHTML = "";
        document.getElementById("changePass").disabled = false;
    }
}

let rePassword = () => {
    let data = {
        usrname: $("#username2").val(),
        email: $("#email2").val(),
        pass: $("#password2_1").val(),
    }
    axios.post(url + "/eac-auth/repassword", data).then(r => {
        r.data.data == 'success' ? $("#okmodal").modal("show") : $("#falsemodal").modal("show")
        // console.log(r.data.data)
    })
}

function onlyLettersAndSpaces(str) {
    return /^[A-Za-z\s]*$/.test(str);
}


function allLetter() {
    let str1 = "2563";
    let str3 = "2020";
    let str2 = 'one-two-three';
    let a = str1.slice(0, 2);
    let b = str3.slice(0, 2);
    console.log(a)
    console.log(b)

    if (/^[A-Za-z\s]*$/.test(str2) == true) {
        console.log('true')
    }

    console.log(onlyLettersAndSpaces(str1)); // 👉️ true
    // console.log(onlyLettersAndSpaces(str2));
}


