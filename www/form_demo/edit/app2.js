let iddata = sessionStorage.getItem('id');
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
let getedit = (id) => {
    var url = "http://localhost:3000";
    axios.post(url + `/food_security/getedit`, { id_date: '1635476633415' }).then(async (r) => {
        var d = r.data.data;
        console.log(d)
        let marker = L.marker([Number(d[0].lat), Number(d[0].lng)], {
            // icon: iconred
            maxZoom: 20,
            name: 'marker',
            data: d
        }).addTo(map);;
        var popup = marker.bindPopup(`<h6><b>ที่ตั้งแปลง</b></h6><span class="kanit-16">${d[0].productmodel}<span>`);
        popup.openPopup();

        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
        // map.fitBounds(marker.getBounds());

        d[0].lat !== 'null' ? $('#lat').val(d[0].lat) : null;
        d[0].lng !== 'null' ? $('#lng').val(d[0].lng) : null;
        d[0].accuracy !== 'null' ? $('#accuracy').val(d[0].accuracy) : null;
        d[0].prov_tn !== 'null' ? $('#pro1 ').val(d[0].prov_tn) : null;
        d[0].amp_tn !== 'null' ? $('#amp1').val(d[0].amp_tn) : null;
        d[0].tam_tn !== 'null' ? $('#tam1').val(d[0].tam_tn) : null;
        // landowner
        d[0].atid !== 'null' ? $('#atID').val(d[0].atid) : null;
        d[0].landowner == 'เช่า' || d[0].landowner == 'ตนเอง/คนในครอบครัว' ? $("#landownership").val(d[0].landowner).change() : $("#landownership").val('other').change() && $('#landowherother').val(d[0].landowner);
        d[0].landusefarm == 'สปก' || d[0].landusefarm == 'โฉนด/นส3' ? $("#landusefarm").val(d[0].landusefarm).change() : $("#landusefarm").val('other').change() && $('#landuseother').val(d[0].landusefarm);
        d[0].areafarm !== 'null' ? $('#areafarm').val(d[0].areafarm) : null;
        d[0].a_unit !== 'null' ? $("#unitfarm").val(d[0].a_unit).change() : null;
        d[0].productmodel == 'เกษตรอินทรีย์' || d[0].productmodel == 'เกษตรปลอดภัย' || d[0].productmodel == 'เกษตรผสมผสาน' || d[0].productmodel == 'เกษตรเชิงเดียว' || d[0].productmodel == 'วนเกษตร' ? $("#productionmodel").val(d[0].productmodel).change() : $("#productionmodel").val('other').change() && $("#productmodelother").val(d[0].productmodel);
        d[0].standard !== 'null' ? $("#standard").val(d[0].standard).change() : null
        d[0].standardtype == 'มาตรฐานสากล' ? $("#standardtype").val('มาตรฐานสากล').change() : null
        d[0].standardtype == 'PGS' ? $("#standardtype").val('PGS').change() && $("#standardother2").val(d[0].standardname) : null
        d[0].standardtype == 'other' ? $("#standardtype").val('other').change() && $("#standardother1").val(d[0].standardname) : null
        //
        d[0].dtype1 !== 'ไม่มี' || d[0].dtype1 !== null ? $('#noA3').text(d[0].dtype1) : null;
        d[0].dtype2 !== 'ไม่มี' || d[0].dtype2 !== null ? $('#noB3').text(d[0].dtype2) : null;
        d[0].dtype3 !== 'ไม่มี' || d[0].dtype3 !== null ? $('#noC3').text(d[0].dtype3) : null;
        d[0].dtype4 !== 'ไม่มี' || d[0].dtype4 !== null ? $('#noD3').text(d[0].dtype4) : null;
        d[0].dtype5 !== 'ไม่มี' || d[0].dtype5 !== null ? $('#noE3').text(d[0].dtype5) : null;
        d[0].dtype6 !== 'ไม่มี' || d[0].dtype6 !== null ? $('#noF3').text(d[0].dtype6) : null;
        d[0].dtype7 !== 'ไม่มี' || d[0].dtype7 !== null ? $('#noG3').text(d[0].dtype7) : null;
        d[0].dtype8 !== 'ไม่มี' || d[0].dtype8 !== null ? $('#noH3').text(d[0].dtype8) : null;
        d[0].dtype9 !== 'ไม่มี' || d[0].dtype9 !== null ? $('#noI3').text(d[0].dtype9) : null;
        //
        d[0].aver_yield !== 'null' ? $('#averageyield').val(d[0].aver_yield) : null
        d[0].aver_in !== 'null' ? $('#averageincome').val(d[0].aver_in).change() : null
        d[0].aver_exp !== 'null' ? $('#averageexpenses').val(d[0].aver_exp).change() : null
        //
        d[0].ucook !== 'Havenot' ? $('#Ucook').prop('checked', true) && $('#Ut1').show() && $('#Utv1').val(d[0].ucook).change() : null
        d[0].uexchange !== 'Havenot' ? $('#Uexchange').prop('checked', true) && $('#Ut2').show() && $('#Utv2').val(d[0].uexchange).change() : null
        d[0].utranform !== 'Havenot' ? $('#Utranform').prop('checked', true) && $('#Ut3').show() && $('#Utv3').val(d[0].ucook).change() : null
        d[0].umiddleman !== 'Havenot' ? $('#Umiddleman').prop('checked', true) && $('#Ut4').show() && $('#Utv4').val(d[0].ucook).change() : null
        d[0].u_no !== 'ไม่มี' ? $('#Nouse').prop('checked', true) && $('#Ut5').show() && $('#Utv5').val(d[0].ucook).change() : null
        d[0].uother !== 'ไม่มี' ? $('#Uother').prop('checked', true) && $('#Uotherdetail').val(d[0].uotherdetail).change() : null
        //
        d[0].dregion == 'ส่งเครือข่ายในภาค' ? $('#Dregion').prop('checked', true) : null
        d[0].dcanton == 'ส่งเครือข่ายในตำบล/จังหวัด' ? $('#Dcanton').prop('checked', true) : null
        d[0].dtrade == 'ขายเอง' ? $('#Dtrade').prop('checked', true) : null
        d[0].d_on == 'ไม่มีการกระจายผลผลิต' ? $('#Nodistribution').prop('checked', true) : null
        d[0].dother == 'other' ? $('#Disother').prop('checked', true) && $('#Disotherdetail').val(d[0].dotherdetail) : null
        //
        d[0].labortype == 'จ้างคนในชุมชน' ? $('#typelabor').val(d[0].labortype).change() : null
        d[0].labortype == 'ตนเอง/คนในครอบครัว' ? $('#typelabor').val(d[0].labortype).change() : null
        d[0].labortype == 'แรงงานเพื่อนบ้าน(ต่างประเทศ)' ? $('#typelabor').val(d[0].labortype).change() : null
        d[0].labortype == 'ไม่ระบุ' ? $('#typelabor').val(d[0].labortype).change() && $('#labornum').prop('readonly', true) : null
        d[0].labortype !== 'จ้างคนในชุมชน' && d[0].labortype !== 'ตนเอง/คนในครอบครัว' && d[0].labortype !== 'แรงงานเพื่อนบ้าน(ต่างประเทศ)' && d[0].labortype !== 'ไม่ระบุ' ? $('#typelabor').val('other').change() && $('#laborother').val(d[0].laborother) : null
        d[0].labor_num !== 'null' || d[0].labor_num !== 'ไม่ระบุ' ? $('#labornum').val(d[0].labor_num).change() : null
        d[0].datereport !== 'null' ? $('#date').val(d[0].datereport) : null

        d[0].img !== 'null' ? $('#preview').attr("src", d[0].img) : null
        d[0].id_user !== 'null' ? $('#record').val(d[0].id_user) : null
        //
    })
}