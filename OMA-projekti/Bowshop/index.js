const express = require('express')
const cors = require('cors')
const app = express();
const dotenv = require("dotenv")
const multer = require("multer")



// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

//Use .env file
dotenv.config()


// multer/image section
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: fileFilter
})

function fileFilter(req, file, cb) {
    // Accepts only jpeg, jpg or png mimetype
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true)
    }
    else {
        
        cb(null, false)
        
    }

}
// Multer storage for images -> /uploads dir
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/public'));







// mongo login

const mongoose = require('mongoose')
const { response, request } = require('express')

// Mongo connectstring
const mongoDB = process.env.mongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log("Database test connected")
})

// Mongoose Scheema

//Schema
const itemSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
})

// Item model
const Item = mongoose.model('Item', itemSchema, 'Items')


// Routes for app
// Post route

app.post('/item', upload.single('image-file'), async function (request, response, next) {
    // req.file is the `image-file` file
    // req.body will hold the text fields, if there were any
    try {
        const { manufacturer, model, price } = request.body

        
        const item = new Item({
            manufacturer: manufacturer,
            model: model,
            price: price,
            image: request.file.originalname
        })

        const savedItem = await item.save()
        response.json(savedItem)

    } catch (error) {
        console.log(error)
    }
})


//Edit route
app.put('/item/:id', upload.single('image-file'), async (request, response) => {

    try {
        const { manufacturer, model, price } = request.body

        // Find item by id from database
        const item = await Item.findById(request.params.id)
        item.manufacturer = manufacturer
        item.model = model
        item.price = price
        item.image = request.file.originalname

        const saveditem = await item.save()
        response.json(saveditem)

    } catch (err) {
        console.log(err)
    }

})


// Get all items
app.get('/item', async (request, response) => {
    const items = await Item.find({})
    response.json(items)
})

// get one item with id
app.get('/item/:id', async (request, response) => {
    const item = await Item.findById(request.params.id)
    if (item) response.json(item)
    else response.status(404).end()
})

//Delete route for item
app.delete('/item/:id', async (request, response) => {
    const deleted_item = await Item.findByIdAndRemove(request.params.id)
    if (deleted_item) response.json(deleted_item)
    else response.status(404).end()
})


// app listen port x
app.listen(process.env.port, () => {
    console.log('Example app listening on port x')
})
