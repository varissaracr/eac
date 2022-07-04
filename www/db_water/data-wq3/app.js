const url = "https://engrids.soc.cmu.ac.th/api";

let table
$(document).ready(function () {
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
        ajax: {
            type: "GET",
            // url: "https://eec-onep.soc.cmu.ac.th/api/wtrq-api-cherry.php",
            url: "https://eec-onep.soc.cmu.ac.th/api/wtrq-api-get-30-bystation.php?stname=station_03&limit=150&fbclid=IwAR3f5-EwPqv97f-iIIQxpmYfiG54DuGKDWrzN5HBe584a6f8V2AQztt-EeA",
        },
        columns: [
            {
                data: null,
                render: (data, type, row, meta) => {
                    // console.log(meta)
                    return `${meta.row + 1}`
                }
            },
            // { data: 'stname' },
            {
                data: null,
                render: function (data, type, row) {
                    let dt = new Date(data.ts);
                    var datenow = moment(dt).format('DD/MM/YYYY')
                    return datenow

                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    let dt = new Date(data.ts);
                    var timenow = moment(dt).format('HH:mm')
                    return timenow

                },
            },
            { data: 'ec' },
            {
                data: null,
                render: function (data, type, row) {
                  let a = data.do;
                  if (a !== null) {
                    return a
                } else {
                    return '-'
                }
                }
              },
            { data: 'tmp' },
            { data: 'ph' },
            
        ],
        searching: true,
        scrollX: true,
        columnDefs: [
            { className: 'text-center', targets: [0, 1, 2, 3, 4, 5, 6] }, 
        ],
        dom: 'Bfrtip',
        buttons: [
            'print', 'excel'
        ],
        pageLength: 8
    });

    table.on('search.dt', function () {
        let data = table.rows({ search: 'applied' }).data()
        // data.map(i => { console.log(i.outputtype) })
        $("#siteCnt").text(data.length)
    });


})

let refreshPage = () => {
    window.open("./../dashboard/index.html", "_self");
    // console.log("ok");
}
