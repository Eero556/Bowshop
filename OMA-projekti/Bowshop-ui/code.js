
// Eventlistener when page loads -> init funktion
window.addEventListener('DOMContentLoaded', init, false);

function init() {
    let infobox = document.getElementById('infoText')
    infobox.innerHTML = 'Loading objects, wait...'

    // Call load_items funktion to get all items
    load_items()

    //Filter for database items eventlisteners
    let search = document.getElementById("search");
    search.addEventListener("keyup", (e) => {
        let searchstring = e.target.value.toLowerCase()
        let filteredresponse = items.filter(item => {
            return item.manufacturer.toLowerCase().includes(searchstring) || item.model.toLowerCase().includes(searchstring)
        })

        show_items(filteredresponse)
    })

    

    let bowtech = document.getElementById("bowtech");
    bowtech.addEventListener("click", ()=>{
        let bowtech_search = "Bowtech"
        let bowtech_items = items.filter(item => {
            return item.manufacturer.includes(bowtech_search)
        })
        show_items(bowtech_items)
    })

    let pse = document.getElementById("pse");
    pse.addEventListener("click", ()=>{
        let pse_search = "Pse"
        let pse_items = items.filter(item => {
            return item.manufacturer.includes(pse_search)
        })
        show_items(pse_items)
    })

    let elite = document.getElementById("elite");
    elite.addEventListener("click", () =>{
        let elite_search = "Elite"
        let elite_items = items.filter(item =>{
            return item.manufacturer.includes(elite_search)
        })
        show_items(elite_items)
    })

    let hoyt = document.getElementById("hoyt");
    hoyt.addEventListener("click", () =>{
        let hoyt_search = "Hoyt"
        let hoyt_items = items.filter(item =>{
            return item.manufacturer.includes(hoyt_search)
        })
        show_items(hoyt_items)
    })

    let all_objects = document.getElementById("all_items");
    all_objects.addEventListener("click", init)

}

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
    let manufacturer = document.createElement("p")
    manufacturer.className = "manufacturer"
    manufacturer.innerHTML = item.manufacturer

    // Creating model <p> element for item
    let model = document.createElement("p")
    model.className = "model"
    model.innerHTML = item.model

    //Creating price element <p> for item
    let price = document.createElement("p")
    price.className = "price"
    price.innerHTML = item.price + " €"

    //Image
    let image = document.createElement("img")
    image.className = "item_picture"
    let item_picture_path = item.image
    image.src = `http://localhost:3000/uploads/${item_picture_path}`


    // Append <p> elements and image to div
    div.appendChild(image)
    div.appendChild(manufacturer)
    div.appendChild(model)
    div.appendChild(price)



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
    span2.onclick = function () { edit_item(item._id) }
    let edit = document.createTextNode("edit")
    span2.appendChild(edit)
    div.appendChild(span2)

    // Finally return div object
    return div
}

// Making new object that have been loaded using LoadTodo funktion
function show_items(items) {
    let itemList = document.getElementById('itemList')
    let infoText = document.getElementById('infoText')


    // If no objects then modify infomanufacturerbox
    if (items.length === 0) {
        infoText.innerHTML = 'No items with that search sorry'

    } else {
        // If there is objects then foreach make div object to div called itemList
        // 
        itemList.innerHTML = ""
        items.forEach(item => {
            let div_object = create_item(item)
            itemList.appendChild(div_object)
        })
        infoText.innerHTML = ''
    }
}
// Make new object using post
async function add_item() {
    // Get input values

    let manufacturer = document.getElementById('manufacturer')
    let price = document.getElementById("price")
    let model = document.getElementById("model")
    const fileInput = document.querySelector('#image-download');

    // new js object that includes all info that is needed
    const formdata = new FormData();
    formdata.append("manufacturer", manufacturer.value);
    formdata.append("model", model.value);
    formdata.append("price", price.value);
    formdata.append("image-file", fileInput.files[0]);

    // Get all items using fetch
    const response = await fetch('http://localhost:3000/item', {
        method: 'POST',
        body: formdata
    })
    // item gets value of item object
    let item = await response.json()

    // Get value of Ul element and li is new object that uses funktion createTodoListItem
    let itemList = document.getElementById('itemList')
    let product = create_item(item)
    itemList.appendChild(product)

    let infomanufacturer = document.getElementById('infomanufacturer')
    infomanufacturer.innerHTML = ''
    manufacturer.value = ''
    model.value = ""
    price.value = ""

}

// Remove using Delete method // Using unique mongo _id to delete
async function remove_item(id) {
    const response = await fetch('http://localhost:3000/item/' + id, {
        method: 'DELETE'
    })
    let responseJson = await response.json()
    let item_div = document.getElementById(id)
    item_div.parentNode.removeChild(item_div)

    let itemList = document.getElementById('itemList')
    if (!itemList.hasChildNodes()) {
        let infoText = document.getElementById('infoText')
        infoText.innerHTML = 'No objects'
    }
}
// Edit method
async function edit_item(id) {
    let actionbutton = document.getElementById("actionbutton");
    actionbutton.innerHTML = "Save"

    // Get objects value
    document.getElementById("manufacturer").value = document.getElementById(id).querySelector("p.manufacturer").firstChild.nodeValue
    document.getElementById("model").value = document.getElementById(id).querySelector("p.model").firstChild.nodeValue
    document.getElementById("price").value = document.getElementById(id).querySelector("p.price").firstChild.nodeValue
    actionbutton.style.backgroundColor = "yellow"
    actionbutton.setAttribute("onclick", "save_item('" + id + "')")


}
// Using Put method to save edited values
async function save_item(id) {
    const fileInput = document.querySelector('#image-download');

    // Make object that includes wanted info to be saved
    try {
        const formdata_edited = new FormData();
        formdata_edited.append("manufacturer", manufacturer.value);
        formdata_edited.append("model", model.value);
        formdata_edited.append("price", price.value);
        formdata_edited.append("image-file", fileInput.files[0]);



        const response = await fetch('http://localhost:3000/item/' + id, {
            method: 'PUT',
            body: formdata_edited
        })
        let edited_item = await response.json()

        // Get object values 
        document.getElementById(id).querySelector("p.manufacturer").firstChild.nodeValue = edited_item.manufacturer
        document.getElementById(id).querySelector("p.model").firstChild.nodeValue = edited_item.model
        document.getElementById(id).querySelector("p.price").firstChild.nodeValue = edited_item.price
        document.getElementById(id).querySelector('img.image-download').firstChild.nodeValue = edited_item.image


        let actionbutton = document.getElementById("actionbutton");

        // Return Add_item onclick 
        actionbutton.setAttribute("onclick", "add_item()")
        actionbutton.innerHTML = "Add"
        actionbutton.style.backgroundColor = ""

        // Just makes more user friendly when you get saved manufacturer off the inputs
        let infomanufacturer = document.getElementById('infomanufacturer')
        infomanufacturer.innerHTML = ''
        manufacturer.value = ''
        model.value = ""
        price.value = ""
    } catch {
        console.log("Something went wrong")
    }

}

