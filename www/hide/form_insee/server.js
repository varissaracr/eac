const express = require('express')
const app = express()
const port = 3000
// add เข้า database
const { Pool, Client } = require('pg')
const db = new Pool({
    user: 'postgres',
    host: 'eec-onep.online',
    database: 'eec',
    password: 'Eec-MIS2564db',
    port: 3700,
})
const eec = con.eec;


const bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
// server Form Agri Food
// create table form_af
app.post("/form_af/insert", async (req, res) => {
    const { data } = req.body;
    data.map(async (x) => {
        let y = `INSERT INTO form_af (id_date) VALUES ('${x.id_date}');`
        console.log(y)
        await db.query(y)
        let d;
        for (d in x) {
            // console.log(d)
            if (x[d] !== '' && d !== 'id_date' && d !== 'geom') {
                let sql = `UPDATE form_af SET ${d} ='${x[d]}' WHERE id_date ='${x.id_date}';`
                console.log(sql);
                // db.query(sql)
                eec.query(sql)
            }
        }
        if (x.geom !== "") {
            let sql = `UPDATE form_af SET geom = ST_GeomfromGeoJSON('${JSON.stringify(x.geom.geometry)}')
                                WHERE id_date ='${x.id_date}';`
            console.log(sql);
            // db.query(sql)
            eec.query(sql)
        }
    })
    // for (let i = 0; i < data.length; i++) {
    //     let a = data[i].id_date
    //     console.log(data[i].intono)
    //     console.log(`INSERT INTO form_af(id_date) VALUES ('${a}');`)
    //     db.query(`INSERT INTO form_af (id_date) VALUES ('${a}');`)
    //     let d;
    //     for (d in data[i]) {
    //         // console.log(data[i][d])
    //         if (data[i][d] !== '' && d !== 'id_date' && d !== 'geom') {
    //             let sql = `UPDATE form_af SET ${d} ='${data[i][d]}' WHERE id_date ='${a}';`
    //             console.log(sql);
    //             db.query(sql)
    //         }
    //     }
    //     if (data[i].geom !== "") {
    //         let sql = `UPDATE form_af SET geom = ST_GeomfromGeoJSON('${JSON.stringify(data[i].geom.geometry)}')
    //                     WHERE id_date ='${a}';`
    //         console.log(sql);
    //         db.query(sql)
    //     }
    // }
    res.status(200).json({
        data: "success"
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

app.use('/', express.static('www'))
