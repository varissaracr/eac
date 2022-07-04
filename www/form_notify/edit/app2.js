let iddata = sessionStorage.getItem('id_data');
console.log(iddata)
// let fromAdmin = sessionStorage.getItem('w_from_admin');
$(document).ready(() => {
    getedit(iddata)
});
let id_date = iddata;
let iconred = L.icon({
    iconUrl: './../assets/img/apple-touch-icon.png',
    iconSize: [50, 50],
    iconAnchor: [12, 37],
    popupAnchor: [5, -30]
});
let getedit = (id_date) => {
    var url = "https://engrids.soc.cmu.ac.th/api";
    axios.post(url + `/notice-eac/getdataone`, { proj_id: id_date }).then(async (r) => {
        var d = r.data.data;
        console.log(d)
        let marker = L.marker([Number(d[0].lat), Number(d[0].lng)], {
            // icon: iconred
            maxZoom: 20,
            name: 'marker',
            data: d
        }).addTo(map);;
        var popup = marker.bindPopup(`<h6><b>ตำแหน่ง</b></h6><span class="kanit-16">${d[0].noticename}<span>`);
        popup.openPopup();

        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
        // map.fitBounds(marker.getBounds());

        d[0].lat !== 'null' ? $('#lat').val(d[0].lat) : null;
        d[0].lng !== 'null' ? $('#lng').val(d[0].lng) : null;
        d[0].accuracy !== 'null' ? $('#accuracy').val(d[0].accuracy) : null;
        d[0].prov_tn !== 'null' ? $('#pro').val(d[0].prov_tn) : null;
        d[0].amp_tn !== 'null' ? $('#amp').val(d[0].amp_tn) : null;
        d[0].tam_tn !== 'null' ? $('#tam').val(d[0].tam_tn) : null;

        d[0].id_date !== 'null' ? $('#id_date').val(d[0].id_date) : null;
        d[0].noticename !== 'null' ? $('#noticename').val(d[0].noticename).change() : null;
        d[0].noticedetail !== 'null' ? $('#noticedetail').val(d[0].noticedetail).change() : null;
        d[0].noticeplace !== 'null' ? $('#noticeplace').val(d[0].noticeplace).change() : null;

        d[0].noticetype == 'มลพิษ' ? $("#noticetype").val('มลพิษ').change() : null
        d[0].noticetype == 'ภัยธรรมชาติ' ? $("#noticetype").val('ภัยธรรมชาติ').change() : null
        d[0].noticetype == 'อื่นๆ' ? $("#noticetype").val('อื่นๆ').change() : null

        d[0].datetimes !== 'null' ? $('#datetimes').val(d[0].datetimes) : null

        d[0].imgfile !== 'null' ? $('#preview').attr("src", d[0].imgfile) : null
        d[0].record !== 'null' ? $('#record').val(d[0].record) : null
        //
    })
}