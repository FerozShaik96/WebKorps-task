"use strict"
let countId = 0
// fetching the data from the fake store api and saving it in the JSON-Server

async function fetchData() {
    try {
        const res = await fetch('https://fakestoreapi.com/products');
        let dataArray = [];
        if (res.ok) {
            const data = await res.json()
            for (let i = 0; i < data.length; i++) {
                dataArray.push(data[i])
            }
        }
        for (let i = 0; i < dataArray.length; i++) {
            const myData = await fetch(`https://jsonserver-3-wo8n.onrender.com/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataArray[i])

            })
        }
    } catch (err) {
        console.log(err)
    }
}
document.getElementById("btnClick").addEventListener("click", fetchData);

//Fetching the Data when the page loads
async function loadfetch() {
    clearPage();
    const responseGet = await fetch('https://jsonserver-3-wo8n.onrender.com/users')
    if (responseGet.ok) {
        const data = await responseGet.json()
        countId = data.length
        for (let i = 0; i < data.length; i++) {
            showData(data[i])
        }
    }

}
window.addEventListener("DOMContentLoaded", loadfetch)

// Rendering the data on the UI
function showData(obj) {
    const parentEl = document.getElementById("container")
    const childEl = document.createElement("div")
    childEl.classList = "inner-Container";
    parentEl.appendChild(childEl);
    
    // To Display Category on the page
    const categoryTag = document.createElement("p");
    categoryTag.textContent = obj.category;
    categoryTag.classList = "category";
    childEl.appendChild(categoryTag);

    const imageDiv = document.createElement("div")
    imageDiv.classList = "image-container";
    // To Display Image on the page
    const imageTag = document.createElement("img");
    imageTag.classList = "imge";
    imageTag.src = obj.image;
    imageDiv.appendChild(imageTag);
    childEl.appendChild(imageDiv)

    // To Display Title on the page

    const nameTag = document.createElement("h2");
    let new_Name=obj.title.length>55?obj.title.substring(0,55)+"...":obj.title
    nameTag.textContent = new_Name;
    nameTag.classList = "name";
    childEl.appendChild(nameTag);

    // To Display Description on the page

    const desTag = document.createElement("h5");
    desTag.classList = "description";
    let new_Str=obj.description.length>300?obj.description.substring(0,240)+"...":obj.description;
    desTag.textContent = new_Str;
    // desTag.textContent = obj.description;
    childEl.appendChild(desTag);
    
    // To display a Rating container 
    const ratingDiv = document.createElement("div")
    ratingDiv.classList = "rating-container";
    // To Display Price on the page
    const priceTag = document.createElement("p")
    priceTag.textContent = obj.price;
    priceTag.classList = "price";
    ratingDiv.appendChild(priceTag);
    


    // To Display Rating on the page    

    const rateTag = document.createElement("p");
    childEl.appendChild(ratingDiv);
    rateTag.classList = "rating";
    rateTag.textContent = obj.rating.rate;
    ratingDiv.appendChild(rateTag);

    // To Display Count on the page
    const countTag = document.createElement("p")
    countTag.classList = "count";
    countTag.textContent = `SoldOut :- ${obj.rating.count}`
    ratingDiv.appendChild(countTag);



    // To Add Edit button to Display
    const editBtn = document.createElement('button')
    editBtn.textContent = "Edit"
    editBtn.classList = "edit-btn"
    childEl.appendChild(editBtn)

    //  To add Delete button on display
    const deleteBtn = document.createElement('input')
    deleteBtn.type = "button";
    deleteBtn.value = "Delete"
    deleteBtn.classList = "delete-btn"
    childEl.appendChild(deleteBtn)

    // Delete functionality 
    deleteBtn.onclick = async () => {
        const delItem = await fetch(`https://jsonserver-3-wo8n.onrender.com/users/${obj.id}`, {
            method: "DELETE"
        })
            if (delItem.ok) {
                console.log('Item deleted');
                clearPage();  // Clear the existing data
                loadfetch();  // Fetch and display the updated data
            }
    }

    //  Editing Functionality

    const modalContainer = document.getElementById("model_container")
    const closeButton = document.getElementById("close")
    editBtn.onclick = async () => {
        modalContainer.classList.add('show')
        document.getElementById("editTitle").value = obj.title
        document.getElementById("editPrice").value = obj.price
        document.getElementById("id").value=obj.id
        document.getElementById("editDescription").value = obj.description
        document.getElementById("editCategory").value = obj.category
        document.getElementById("editImage").value = obj.image
        document.getElementById("editRate").value = obj.rating.rate
        document.getElementById("editCount").value = obj.rating.count

        console.log(obj.id)
    }
    document.getElementById("edit-form").onsubmit = async function(event) {
        event.preventDefault()
        console.log(obj)
        const title = event.target.editTitle.value;
        const id=event.target.id.value
        const price = event.target.editPrice.value;
        const description = event.target.editDescription.value;
        const category = event.target.editCategory.value;
        const image = event.target.editImage.value;
        const rate = event.target.editRate.value;
        const count = event.target.editCount.value;
        console.log(title,"this ius string");
        
        const rating = {
            rate,
            count
        }
        const editobj={
            id,title,price,description,category,image,rate,count,rating
        }
        const editData=await fetch(`https://jsonserver-3-wo8n.onrender.com/users/${id}`,{
            method:"PUT",
            headers:{
                "content-type":"application/json",
            },
            body:JSON.stringify(editobj)
        })
        if (editData.ok) {
            console.log('Data is Edited on Json-Server');
            modalContainer.classList.remove('show');  
            clearPage();  
            loadfetch();
        }
          
    }
    closeButton.addEventListener("click", () => {
        modalContainer.classList.remove("show")
    })
}

// Getting the Edited Details


// when Add product button is clicked opening the form.

const openModalButton = document.querySelector("[data-modal-target");
const closeModalButton = document.querySelector("[data-close-button]");
const overlay = document.getElementById("overlay")
openModalButton.addEventListener("click", () => {
    const modal = document.querySelector(openModalButton.dataset.modalTarget)
    openModal(modal)
})
closeModalButton.addEventListener("click", () => {
    const modal = closeModalButton.closest('.form-container')
    closeModal(modal)
})
function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("active")
    overlay.classList.add("active")
}
function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active")
    overlay.classList.remove("active")
}
// Adding the new product details to JSON-SERVER.

async function addProducts(event) {
    event.preventDefault();
    const title = event.target.title.value;
    const price = event.target.price.value;
    const category = event.target.category.value;
    const description = event.target.description.value;
    const rate = event.target.rate.value;
    const count = event.target.count.value;
    const image = event.target.image.value;
    const rating = {
        rate,
        count
    }
    countId = countId + 1
    console.log(countId)
    const id = String(countId);
    console.log(id)
    const obj = {
        id,
        title,
        price,
        description,
        category,
        image,
        rating
    }
    const postData = await fetch('https://jsonserver-3-wo8n.onrender.com/users', {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(obj)
    });
    if (postData.ok) {
        console.log('Data is Added to Json-Server')
        document.querySelector(".form-container").classList.remove("active");
        document.getElementById("overlay").classList.remove("active");
            clearPage();  
            loadfetch();  
        
    }
    // const formStyle = document.querySelector(".form-container");
    // const displayForm = getComputedStyle(formStyle).display;
    // if (displayForm === "block") {
    //     formStyle.style.display = "none"
    // }
    const responseGet = await fetch('https://jsonserver-3-wo8n.onrender.com/users')
    if (responseGet.ok) {
        const data = await responseGet.json()
        for (let i = 0; i < data.length; i++) {
            showData(data[i])
        }
    }
}


function clearPage() {
    const parentEl = document.getElementById("container");
    parentEl.innerHTML = '';  // Clear all child elements (products) in the container
}