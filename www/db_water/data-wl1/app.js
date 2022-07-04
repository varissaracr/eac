const url = "https://engrids.soc.cmu.ac.th/api";
const staid = sessionStorage.getItem('station');
// console.log(stname)

let table
$(document).ready(function () {
    axios.post('https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get2.php', { sort: "desc", station: staid, limit: 500 }).then(r => {
        // console.log(r.data.data)
        var d = r.data.data
        var data_st = d.filter(e => e.stname == staid)
        // console.log(data_st)

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
                },
                "emptyTable": "ไม่พบข้อมูล..."
            }
        });
        table = $('#myTable').DataTable({
            // ajax: {
            //     type: "post",
            //     url: "https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get2.php",
            //     // url: "https://eec-onep.soc.cmu.ac.th/api/wtrl-api-get-100.php?fbclid=IwAR1HYHOO3CqODw9H5ZVflFKzO4pzRr-bOPwf-d68gGBu4ISuFh2e9MMS2x0",
            //     // url: "https://eec-onep.soc.cmu.ac.th/api/wtrl-api-getone.php",
            //     data: { station: "station_01", limit: 50},
            //     dataType: 'json',
            //     dataSrc: 'data',
            // },
            data: data_st,
            columns: [
                {
                    data: null,
                    // "width": "15px", "targets": 0
                },
                { data: "stname" },
                { data: "d" },
                {
                    data: "t"

                },

                {
                    data: null,
                    render: function (data, type, row) {
                        let h; if (data.stname == 'station_01') {
                            h = 275.5;
                        } else if (data.stname == 'station_02') {
                            h = 244;
                        } else if (data.stname == 'station_03') {
                            h = 298;
                        } else if (data.stname == 'station_04') {
                            h = 294;
                        } else if (data.stname == 'station_05') {
                            h = 280;
                        } else if (data.stname == 'station_06') {
                            h = 435;
                        } else if (data.stname == 'station_07') {
                            h = 380.6;
                        } else if (data.stname == 'station_08') {
                            h = 512;
                        } else if (data.stname == 'station_09') {
                            h = 550.5;
                        }
                        let a = h - data.deep
                        a >= 0 ? a : a = 0
                        return a.toFixed(2)
                    }
                },

                {
                    data: null,
                    render: function (data, type, row) {
                        let t = data.temperature
                        return Number(t).toFixed(2)
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        let h = data.humidity
                        return Number(h).toFixed(2)
                    }
                },

            ],
            // order: [[3,'desc']],
            order: ([[ 2, 'desc' ], [ 3, 'desc' ]]),

            searching: true,
            scrollX: true,
            columnDefs: [
                { className: 'text-center', targets: [0, 1, 2, 3, 4, 5, 6] },
                {
                    "width": "15px", "targets": 0

                },
            ],
            dom: 'Bfrtip',
            buttons: [
                'print', 'excel'
            ],
            select: true,
            pageLength: 8,
            responsive: {
                details: false
            }
        });

        table.on('order.dt search.dt', function () {
            table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        table.on('search.dt', function () {
            let data = table.rows({ search: 'applied' }).data()
            // data.map(i => { console.log(i.outputtype) })
            $("#siteCnt").text(data.length)
        });
    })
})

function changestname(name) {
    if (name == "station_01") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 1 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี  </span> ')
    }
    else if (name == "station_02") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 2 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี </span>')
    }
    else if (name == "station_03") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 3 </span> <br> <span style="font-weight: bold; font-size: 20px"> เมืองพัทยา อำเภอบางละมุง จังหวัดชลบุรี </span>')
    }
    else if (name == "station_04") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 4 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลสำนักทอง อำเภอเมืองระยอง จังหวัดระยอง </span>')
    }
    else if (name == "station_05") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 5 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลสำนักทอง อำเภอเมืองระยอง จังหวัดระยอง </span>')
    }
    else if (name == "station_06") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 6 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลกะเฉด อำเภอเมือง จังหวัดระยอง </span>')
    }
    else if (name == "station_07") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 7 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลเขาชะเมา อำเภอแกลง จังหวัดระยอง </span>')
    }
    else if (name == "station_08") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 8 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลน้ำเป็น อำเภอเขาชะเมา  จังหวัดระยอง </span>')
    }
    else if (name == "station_09") {
        $('#info_sta2').html('<span style="color: #B30D02; font-weight: bold; font-size: 26px"> สถานีตรวจวัดที่ 9 </span> <br> <span style="font-weight: bold; font-size: 20px"> ตำบลทุ่งควายกิน อำเภอแกลง จังหวัดระยอง </span>')
    }
    else {
        $('#info_sta2').text('')
    }
}
changestname(staid)
