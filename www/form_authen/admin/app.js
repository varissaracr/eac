let ustoken = sessionStorage.getItem("ustoken")

// const url = 'http://localhost:3000';
const url = "https://engrids.soc.cmu.ac.th/api";

let refreshPage = () => {
    location.reload(true);
}

let deleteUser = (userid) => {
    axios.post(url + '/eac-auth/deleteuser', { userid:userid }).then(r => {
        r.data.data == "success" ?  $('#myTable').DataTable().ajax.reload() : null;
    })
}

let loadUser = (data) => {
    document.getElementById("user").innerHTML = "";
    data.map(i => {
        let urid = i.userid
        if (urid.length > 5) {
            let b = urid.substring(0, 5) + '...';
            console.log(b)
            document.getElementById("user").innerHTML += `<div class="form-group">
            <i class="fas fa-portrait"></i>&nbsp;<label>ชื่อผู้ใช้: ${i.usrname}</label>&nbsp;&nbsp;<label>Userid: ${b}</label>&nbsp;
            <div class="pull-right"><button class="btn btn-info" onclick="deleteUser('${i.userid}')"><i class="fas fa-user-edit"></i>&nbsp;จัดการข้อมูลผู้ใช้</button>&nbsp;&nbsp;
            <div class="pull-right"><button class="btn btn-warning" onclick="deleteUser('${i.userid}')"><i class="fas fa-trash"></i>&nbsp;ลบข้อมูล</button>
            </div></div>`
        }
        console.log(i)
    })
}

let table
let loadtable = (urldata, userid, prov) => {
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
    table = $('#myTable').DataTable({
        ajax: {
            type: "post",
            url: urldata,
            data: { userid: userid, prov: prov },
            dataSrc: 'data'
        },
        columns: [
            {
                // targets: -1,
                data: null,
                // defaultContent: button
            },
            {
                data: 'userid', render: function (data, type, row, meta) {
                    let txt = row.userid
                    if (txt.length > 5) {
                        let a = txt.substring(0, 5) + '...';
                        return a
                    } else {
                        return txt
                    }
                },
            },
            { data: 'usrname' },
            {
                data: 'approved', render: function (data, type, row, meta) {
                    if (row.approved == "true") {
                        return `<p class="text-success"><b>ตรวจสอบแล้ว</b></p>`
                    } else {
                        return `<p class="text-danger"><b>ไม่ผ่านการตรวจสอบ</b></p>`
                    }
                }
            },
            { data: 'uname' },
            { data: 'ndate' },
            {
                data: null, render: function (data, type, row, meta) {
                    return `
                    <button class="btn btn-info" onclick="editUser('${row.userid}')"><i class="fas fa-user-edit"></i>&nbsp;จัดการข้อมูลผู้ใช้</button>&nbsp;&nbsp;
                    <button class="btn btn-warning" onclick="deleteUser('${row.userid}')"><i class="fas fa-trash"></i>&nbsp;ลบข้อมูล</button>`
                }
            },
            // { data: 'gwyear' },

        ],
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 3, 4] },
        ],
        searching: true,
        scrollX: true,
        dom: 'Bfrtip',
        buttons: [
            'excel', 'print'
        ],
        // pageLength: 5
    });

    table.on('order.dt search.dt', function () {
        table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    // table.on('search.dt', function () {
    //     let data = table.rows({ search: 'applied' }).data()
    //     // console.log(data);
    //     $("#siteCnt").text(data.length)
    //     // getMap(data)
    //     // console.log();
    // });
}
let editUser = (id) => {
    $('#approved').attr('checked', false);
    axios.post(url + '/eac-auth/getiduser', { userid: id }).then(r => {
        $("#editModal").modal("show")
        let d = r.data.data
        // console.log(d[0])
        let location = `${d[0].address !== null ? d[0].address : ''} ${d[0].tam_name !== null ? 'ต.' + d[0].tam_name : ''} ${d[0].amp_name !== null ? 'อ.' + d[0].amp_name : ''} ${d[0].pro_name !== null ? 'จ.' + d[0].pro_name : ''}`
        let ndate
        if (d[0].ts !== null) {
            let ts = d[0].ts
            let sp = ts.split("T");
            let date = sp[0].split("-");
            ndate = `${date[2]}/${date[1]}/${Number(date[0])+543}`
        } else {
            ndate = '-'
        }
        $('#usrname').text(d[0].usrname)
        $('#uname').text(d[0].uname)
        $('#address').text(location)
        $('#email').text(d[0].email)
        $('#tel').text(d[0].tel)
        $('#orgname').text(d[0].orgname)
        $('#ts').text(ndate)
        $("#preview").html(`<img src="${d[0].img !== null ? d[0].img : './img/noimg.png'}" width="100%" style="border-radius: 1.5rem;">`)
        // $("#preview").attr("src", r.data.data[0].img);
        if (d[0].approved == 'true') {
            $('#approved').attr('checked', true);
        } else {
            $('#approved').attr('checked', false);
        }
        $("#projId").val(d[0].userid)
    })
}
let confirmApprove = () => {
    let id = $("#projId").val();
    let value = 'false';

    $("input[name='approved']:checked").each(function (i) {
        value = $(this).val();
    });

    axios.post(url + '/eac-auth/approved', { userid: id, approve: value }).then(r => {
        if (r.data.data == "success") {
            $("#editModal").modal("hide");
            $('#myTable').DataTable().ajax.reload();
        }
    })

    // console.log(id)
    // console.log(value)

}
let gotoLogin = () => {
    location.href = "./../login/index.html";
}

let loadData = () => {
    axios.post(url + '/eac-auth/getalluser', { userid: ustoken }).then(r => {
        let Turl = url + '/eac-auth/getalluser';
        r.data.data == "invalid" ? gotoLogin() : loadtable(Turl, ustoken)
        // loadUser(r.data.data);
    })
}

$(document).ready(() => {
    loadData()
});




