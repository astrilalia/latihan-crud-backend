// ============== SETUP ================ //
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 2000
const db = require('./database')

// =============== UPLOADER ================ //
const { uploader } = require('./helper/uploader')
const fs = require('fs')

app.use(express.static('public'))
app.use(bodyParser())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send('<h1>Review Backend Development</h1>')
})

// =============== Images ================ //
app.post('/add-images', (req, res) => {
    const path = '/images';
    const upload = uploader(path, 'LTH').fields([{ name: 'image' }]);
    upload(req, res, (err) => {
        // console.log(req.files)
        const { image } = req.files
        const { namaPicture } = JSON.parse(req.body.data)
        const imagePath = image ? `${path}/${image[0].filename}` : null
            // console.log(imagePath)
            // console.log(req.body)

        let sql = `insert into pictures (namaPicture, imagePath) values ('${namaPicture}', '${imagePath}')`
        db.query(sql, (err, results) => {
            if (err) {
                fs.unlinkSync(`./public${imagePath}`)
                res.status(500).send(err.message)
            }
            res.status(200).send({
                status: "Success",
                message: "Image has added"
            })
        })
    })
})

app.get('/get-images', (req, res) => {
    let sql = `select * from pictures`;
    db.query(sql, (err, results) => {
        if(err){
            res.status(500).send(err.message)
        }
        res.status(200).send(results)
    })
})

app.patch('/edit-images/:id', (req, res) => {
    const { id } = req.params
    
    let sql = `select * from pictures where idpictures = ${id}` // <===== Pilih gambar mana yang mau di edit
    db.query(sql, (err, results) => {
        if(err)res.status(500).send(err.message) // <===== Kalau gagal masuk sini
        
        const oldImagePath = results[0].imagePath // <===== Kalau dapet datanya, lanjut upload gambar baru
        const path = '/images';
        const upload = uploader(path, 'LTH').fields([{ name: 'image' }]);

        upload(req, res, (err) => {
            console.log(req.files)
            const { image } = req.files
            const { namaPicture } = JSON.parse(req.body.data)

            const imagePath = image ? `${path}/${image[0].filename}` : null

            let sql = `update pictures set namaPicture = '${namaPicture}', imagePath = '${imagePath}' where idpictures = ${id}` // <===== Setelah dapet gambar baru, update sqlnya
            db.query(sql, (err, update) => {
                if(err){                                  // <===== Kalau SQLnya error, gambar barunya hapus dulu
                    fs.unlinkSync(`./public${imagePath}`)
                    res.status(500).send(err.message)
                }
                if(image){                                // <===== Dibaca juga, kalau SQLnya berhasil, maka gambar lama dihapus
                    fs.unlinkSync(`./public${oldImagePath}`)
                }
                    res.status(200).send({
                        status : "edited successful",
                        message : "image has changed"
                })
            })
        })
    })
})

app.delete('/delete-images/:id', (req, res) => {
    let sql = `delete from pictures where idpictures = ${req.params.id}`
    db.query(sql, (err, results) => {
        if(err)res.status(500).send(err.message)
        res.status(200).send({
            status : "success",
            message : "data has deleted"
        })
    })
})

// =============== Images End ================ //

// =============== Movies ================ //
app.get('/get-movies', (req, res) => {
    let sql = `select * from movies`;
    db.query(sql, (err, results) => {
        if (err) res.status(500).send(err.message)

        res.status(200).send(results)
    })
})

app.post('/add-movies', (req, res) => {
    let sql = `insert into movies set ?`;
    db.query(sql, req.body, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "success",
            message: "data has created"
        })
    })
})

app.patch('/edit-movies/:id', (req, res) => {
    let sql = `update movies set ? where id = ${req.params.id}`
    db.query(sql, req.body, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "edited",
            message: "data has edited successfully"
        })
    })
})

app.delete('/delete-movies/:id', (req, res) => {
    let sql = `delete from movies where id = ${req.params.id}`
    db.query(sql, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "deleted",
            message: "data has deleted"
        })
    })
})

// =============== Movies End ================ //

// =============== Categories ================ //
app.get('/get-categories', (req, res) => {
    let sql = `select * from categories`;
    db.query(sql, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send(results)
    })
})

app.post('/add-categories', (req, res) => {
    let sql = `insert into categories set ?`;
    db.query(sql, req.body, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "created",
            message: "new category has created"
        })
    })
})

app.patch('/edit-categories/:id', (req, res) => {
    let sql = `update categories set ? where id = ${req.params.id}`
    db.query(sql, req.body, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "Edited",
            message: "Category has edited"
        })
    })
})

app.delete('/delete-categories/:id', (req, res) => {
    let sql = `delete from categories where id = ${req.params.id}`
    db.query(sql, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "deleted",
            message: "category has deleted"
        })
    })
})

// =============== Categories End ================ //

// =============== MovCat ================ //
app.get('/get-movcat', (req, res) => {
    let sql = `select * from movcat`
    db.query(sql, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send(results)
    })
})

app.post('/add-movcat', (req, res) => {
    let sql = `insert into movcat set ?`;
    db.query(sql, req.body, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "created",
            message: "data has created"
        })
    })
})

app.delete('/delete-movcat/:idmovies/:idcategory', (req, res) => {
    let sql = `delete from movcat where idmovie = ${req.params.idmovies} & idcategory = ${req.params.idcategory}`
    db.query(sql, (err, results) => {
        if (err) res.status(500).send(err.message)
        res.status(200).send({
            status: "deleted",
            message: "data has deleted"
        })
    })
})

// =============== MovCat ================ //

app.listen(port, () => console.log("Server is running on port 2000"))