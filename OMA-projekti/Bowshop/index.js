const express = require('express')
const cors = require('cors')
const app = express();
const port = 3000
const dotenv = require("dotenv")
const multer = require("multer")
const default_pic = "http://localhost:3000/uploads/no-image-available.png"

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
var upload = multer({ storage: storage })


app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/public'));


app.post('/item', upload.single('image-file'), async function (request, response, next) {
    // req.file is the `image-file` file
    // req.body will hold the text fields, if there were any
    try {
        const { manufacturer, model, price } = request.body


        const item = new Todo({
            manufacturer: manufacturer,
            model: model,
            price: price,
            image: request.file.originalname
        })
        const savedTodo = await item.save()

        response.json(savedTodo)


    } catch {
        console.log("error post method")
    }
})





// mongo login

const mongoose = require('mongoose')
const { response } = require('express')

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
const todoSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: default_pic }
})

// Item model
const Todo = mongoose.model('Todo', todoSchema, 'todos')



// Routes for app

//Edit route
app.put('/item/:id', upload.single('image-file'), async (request, response) => {

    try {
        const { manufacturer, model, price } = request.body


        // Find item by id from database
        const item = await Todo.findById(request.params.id)
        console.log(item)
        item.manufacturer = manufacturer
        item.model = model
        item.price = price
        item.image = request.file.originalname
        console.log(item)

        const saveditem = await item.save()
        response.json(saveditem)

    } catch (err) {
        console.log(err)
    }

})

// test 
let filter = { manufacturer: "pse" }
app.get('/pse', async (request, response) => {
    const pse = await Todo.find(filter)
    response.json(pse)
})

app.get('/item', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
})

app.get('/item/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

//Delete route for item
app.delete('/item/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndRemove(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
})


// app listen port 3000
app.listen(port, () => {
    console.log('Example app listening on port 3000')
})