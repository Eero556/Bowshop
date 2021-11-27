const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
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
var upload = multer({ storage: storage })


app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname + '/public'));


app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    response += `<img src="${req.file.path}" /><br>`
    return res.send(response)
})


app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    // req.files is array of `profile-files` files
    // req.body will contain the text fields, if there were any
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    for (var i = 0; i < req.files.length; i++) {
        response += `<img src="${req.files[i].path}" /><br>`
    }

    return res.send(response)
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
    text: { type: String, required: true },
    tietoa: { type: String, required: true },
    hinta: { type: Number, required: true },
    image: {type: String, required: true}
})

// Item model
const Todo = mongoose.model('Todo', todoSchema, 'todos')

// Routes here...

app.post('/todos', async (request, response) => {

    //
    console.log(request.file)
    const { text, tietoa, hinta,image } = request.body

    const item = new Todo({
        text: text,
        tietoa: tietoa,
        hinta: hinta,
        image: image
    })
    const savedTodo = await item.save()
    response.json(savedTodo)
})

// Routes for app

//Edit route
app.put("/todos", async (request, response) => {

    try{
        const { text, _id, tietoa, hinta, image } = request.body

    const item = await Todo.findById(_id)
    item.text = text
    item.tietoa = tietoa
    item.hinta = hinta
    item.image = image

    const saveditem = await item.save()
    response.json(saveditem)

    }catch (err){
        console.log(err)
    }
    
})

// test 
let filter = { text: "pse" }
app.get('/pse', async (request, response) => {
    const pse = await Todo.find(filter)
    response.json(pse)
})

app.get('/todos', async (request, response) => {
    const todos = await Todo.find({})
    response.json(todos)
})

app.get('/todos/:id', async (request, response) => {
    const todo = await Todo.findById(request.params.id)
    if (todo) response.json(todo)
    else response.status(404).end()
})

//Delete route for item
app.delete('/todos/:id', async (request, response) => {
    const deletedTodo = await Todo.findByIdAndRemove(request.params.id)
    if (deletedTodo) response.json(deletedTodo)
    else response.status(404).end()
})


// app listen port 3000
app.listen(port, () => {
    console.log('Example app listening on port 3000')
})