


//Starts the program ui ---> load_items
function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Loading objects, wait...'
    load_items()
    //Filter for database items
    let search = document.getElementById("search");
    search.addEventListener("keyup",(e)=>{
        let searchstring = e.target.value.toLowerCase()
        let filteredresponse = items.filter(item =>{
            return item.text.toLowerCase().includes(searchstring)
        })
        
        
        show_items(filteredresponse)
    })
}

// load only wanted info


// Loads all items from localhost
async function load_items() {
    
    let response = await fetch('http://localhost:3000/item')
    items = await response.json()
    console.log(items)
    

    //After Todos has been loaded then show_items funktion
    show_items(items)
}



function create_item(item) {

    // Creating new div element that hold unique mongo _id
    let div = document.createElement('div')
    div.className = "item"
    // Creating new id for div element and let that value take the unique _id
    let div_attr = document.createAttribute('id') 
    div_attr.value = item._id

    // kiinnitetään attribuutti Div-elementtiin
    div.setAttributeNode(div_attr)

    // Creating new <p> element for item
    let text = document.createElement("p")
    text.className = "text"
    text.innerHTML = item.text
    
    // Creating tietoa as testing <p> element
    let tietoa = document.createElement("p")
    tietoa.className = "tietoa"
    tietoa.innerHTML = item.tietoa

    //Creating hinta as test <p> element
    let hinta = document.createElement("p")
    hinta.className = "hinta"
    hinta.innerHTML = item.hinta + "euroa"

    //Image
    let image = document.createElement("img")
    image.className = "item_picture"
    let apu = item.image
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
    span.onclick = function () { remove_item(item._id) }
    div.appendChild(span)

    
    
    // Creating span2 that has onclick event "edit property"
    let span2 = document.createElement("span");
    span2.className = "edit"
    span2.onclick = function () {edit_item(item._id)}
    let edit = document.createTextNode("edit")
    span2.appendChild(edit)
    div.appendChild(span2)
    
    // Finally return div object
    return div
}

// Making new object that have been loaded using LoadTodo funktion
function show_items(items) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
  

    // If no objects then modify infotextbox
    if (items.length === 0) {
        infoText.innerHTML = 'No items with that search sorry'
        
    } else {
        // If there is objects then foreach make div object to Ul list called todolist
        // Search need this innerhtml or it just add matching items to the list
        todosList.innerHTML = ""
        items.forEach(item => {
            let div_object = create_item(item)
            todosList.appendChild(div_object)
        })
        infoText.innerHTML = ''
    }
}
// Make new object using post
async function add_item() {
    // Get input values

    let manufacturer = document.getElementById('manufacturer')
    let hinta = document.getElementById("hinta")
    let tietoa = document.getElementById("tietoa")
    const fileInput = document.querySelector('#image-download');

    // new js object that includes all info that is needed
    const formdata = new FormData();
    formdata.append("text",manufacturer.value);
    formdata.append("tietoa",tietoa.value);
    formdata.append("hinta",hinta.value);
    formdata.append("image-file", fileInput.files[0]);
    
    // Get all items using fetch
    const response = await fetch('http://localhost:3000/item', {
        method: 'POST',
        body: formdata
    })
    // item gets value of item object
    let item = await response.json()

    // Get value of Ul element and li is new object that uses funktion createTodoListItem
    let todosList = document.getElementById('todosList')
    let li = create_item(item)
    todosList.appendChild(li)

    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    manufacturer.value = ''
    tietoa.value = ""
    hinta.value = ""

}




// Remove using Delete method // Using unique mongo _id to delete
async function remove_item(id) {
    const response = await fetch('http://localhost:3000/item/'+id, {
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
async function edit_item(id){
    let actionbutton = document.getElementById("actionbutton");
    actionbutton.innerHTML = "Save"
    
    // Get objects value
    document.getElementById("manufacturer").value = document.getElementById(id).querySelector("p.text").firstChild.nodeValue
    document.getElementById("tietoa").value = document.getElementById(id).querySelector("p.tietoa").firstChild.nodeValue
    document.getElementById("hinta").value = document.getElementById(id).querySelector("p.hinta").firstChild.nodeValue
    actionbutton.style.backgroundColor = "yellow"
    actionbutton.setAttribute("onclick","save_item('"+id+"')")
    

}
// Using Put method to save edited values
async function save_item(id){
    const fileInput = document.querySelector('#image-download');
   console.log(id)
    
   // Make object that includes wanted info to be saved
   try{
    const formdata_edited = new FormData();
    formdata_edited.append("text",manufacturer.value);
    formdata_edited.append("tietoa",tietoa.value);
    formdata_edited.append("hinta",hinta.value);
    formdata_edited.append("image-file", fileInput.files[0]);
    

    
    const response = await fetch('http://localhost:3000/item/'+id, {
        method: 'PUT',
        body: formdata_edited
    })
    let edited_item = await response.json()
    
    // Get objects value // Using query
    document.getElementById(id).querySelector("p.text").firstChild.nodeValue = edited_item.text
    document.getElementById(id).querySelector("p.tietoa").firstChild.nodeValue = edited_item.tietoa
    document.getElementById(id).querySelector("p.hinta").firstChild.nodeValue = edited_item.hinta
    document.getElementById(id).querySelector('img.image-download').firstChild.nodeValue = edited_item.image
  
    
    

    let actionbutton = document.getElementById("actionbutton");
    
    // Return AddTodo onclick 
    actionbutton.setAttribute("onclick","add_item()")
    actionbutton.innerHTML = "Add"
    actionbutton.style.backgroundColor = ""
    
    // Just makes more user friendly when you get saved text off the inputs
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    manufacturer.value = ''
    tietoa.value = ""
    hinta.value = ""
}catch{
    console.log("Meni jotai pielee")
}
    
    



}

