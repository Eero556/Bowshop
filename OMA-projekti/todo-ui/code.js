// Get values from buttons/inputs..







//Starts the program ui ---> loadTodo
function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Loading objects, wait...'
    load_items()
}

// load only wanted info


// Loads all todos from localhost
async function load_items() {
    
    let container = document.getElementById("container")
    let response = await fetch('http://localhost:3000/todos')
    let todos = await response.json()
    console.log(todos)
    let vastaus = await fetch('http://localhost:3000/pse')
    let pse = await vastaus.json()
    console.log(pse)

    //After Todos has been loaded then showTodos funktion
    show_items(todos)
}



function create_item(todo) {


    // Creating new div element that hold unique mongo _id
    let div = document.createElement('div')
    div.className = "item"
    // Creating new id for div element and let that value take the unique _id
    let div_attr = document.createAttribute('id') 
    div_attr.value = todo._id

    // kiinnitetään attribuutti Div-elementtiin
    div.setAttributeNode(div_attr)

    // Creating new <p> element for item
    let text = document.createElement("p")
    text.className = "text"
    text.innerHTML = todo.text
    
    // Creating tietoa as testing <p> element
    let tietoa = document.createElement("p")
    tietoa.className = "tietoa"
    tietoa.innerHTML = todo.tietoa

    //Creating hinta as test <p> element
    let hinta = document.createElement("p")
    hinta.className = "hinta"
    hinta.innerHTML = todo.hinta + "euroa"
    console.log(todo.hinta)
    //Image
    let image = document.createElement("img")
    image.className = "images"
    let apu = todo.image
    image.src = `http://localhost:3000/uploads/${apu}`
    

    // Append <p> elements and image to div
    div.appendChild(image)
    div.appendChild(text)
    div.appendChild(tietoa)
    div.appendChild(hinta)
    


    // Create span element that has onclick event "remove property"
    let span = document.createElement('span')
    span.className = "delete"
    let x = document.createTextNode(' x ')
    span.appendChild(x)
    span.onclick = function () { removeTodo(todo._id) }
    div.appendChild(span)

    
    
    // Creating span2 that has onclick event "edit property"
    let span2 = document.createElement("span");
    span2.className = "edit"
    span2.onclick = function () {editTodo(todo._id)}
    let edit = document.createTextNode("edit")
    span2.appendChild(edit)
    div.appendChild(span2)
    
    // Finally return div object
    return div
}

// Making new object that have been loaded using LoadTodo funktion
function show_items(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
    let container = document.getElementById("container")
  

    // If no objects then modify infotextbox
    if (todos.length === 0) {
        infoText.innerHTML = 'No objects'
        
    } else {
        // If there is objects then foreach make div object to Ul list called todolist
        
        todos.forEach(todo => {

            let div_object = create_item(todo)
            todosList.appendChild(div_object)
        })
        infoText.innerHTML = ''
    }
}
// Make new object using post
async function addTodo() {
    let newTodo = document.getElementById('newTodo')
    let image = document.getElementById("images")
    const data = { 'text': newTodo.value, "tietoa": tietoa.value, "hinta": hinta.value, "image": image.value}
    // Get all todos using fetch
    const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    // todo gets value of todo object
    let todo = await response.json()

    // Get value of Ul element and li is new object that uses funktion createTodoListItem
    let todosList = document.getElementById('todosList')
    let li = create_item(todo)
    todosList.appendChild(li)

    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
    tietoa.value = ""
    hinta.value = ""
    image.value = ""

}




// Remove using Delete method // Using unique mongo _id to delete
async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/todos/'+id, {
      method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)
  
    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
      let infoText = document.getElementById('infoText')
      infoText.innerHTML = 'No objects'
    }
  }
// Edit method
async function editTodo(id){
    let actionbutton = document.getElementById("actionbutton");
    actionbutton.innerHTML = "Save"
    
    // Get objects value
    document.getElementById("newTodo").value = document.getElementById(id).querySelector("p.text").firstChild.nodeValue
    document.getElementById("tietoa").value = document.getElementById(id).querySelector("p.tietoa").firstChild.nodeValue
    document.getElementById("hinta").value = document.getElementById(id).querySelector("p.hinta").firstChild.nodeValue
    document.getElementById("hinta").value = document.getElementById(id).querySelector("image.images").firstChild.nodeValue  
    actionbutton.style.backgroundColor = "yellow"
    actionbutton.setAttribute("onclick","saveTodo('"+id+"')")
    //let a = document.getElementById(id).querySelector("p.text").firstChild.nodeValue
    //let b = document.getElementById(id).querySelector("p.tietoa").firstChild.nodeValue
    




}
// Using Put method to save edited values
async function saveTodo (id){
    let newtitle = document.getElementById('newTodo')
    let newmodel = document.getElementById('tietoa')
    let newprize = document.getElementById('hinta')
    const data = { 'text': newTodo.value, "_id": id, "tietoa": tietoa.value, "hinta": hinta.value }
    const response = await fetch('http://localhost:3000/todos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    let todo = await response.json()
    
    // Get objects value // Using query
    document.getElementById(id).querySelector("p.text").firstChild.nodeValue = todo.text
    document.getElementById(id).querySelector("p.tietoa").firstChild.nodeValue = todo.tietoa
    document.getElementById(id).querySelector("p.hinta").firstChild.nodeValue = todo.hinta


    let actionbutton = document.getElementById("actionbutton");
    
    // Return AddTodo onclick 
    actionbutton.setAttribute("onclick","addTodo()")
    actionbutton.innerHTML = "Add"
    actionbutton.style.backgroundColor = ""
    
    // Just makes more user friendly when you get saved text off the inputs
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
    tietoa.value = ""
    hinta.value = ""
    



}

