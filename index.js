 "use strict"
let countId=0
 // fetching the data from the fake store api and saving it in the JSON-Server
 
async function fetchData(){
    try{
        const res=await fetch('https://fakestoreapi.com/products');
        let dataArray=[];
        if(res.ok){
            const data=await res.json()
            for(let i=0;i<data.length;i++){
                dataArray.push(data[i])
            }
        }
        for(let i=0;i<dataArray.length;i++){
            const myData= await fetch(`http://localhost:3000/users`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(dataArray[i])
        
            })
        }
    }catch(err){
        console.log(err)
    }  
}
document.getElementById("btnClick").addEventListener("click",fetchData);

//Fetching the Data when the page loads
async function loadfetch(){
    const responseGet=await fetch('http://localhost:3000/users')
    if(responseGet.ok){
        const data= await responseGet.json()
        countId=data.length
        for(let i=0;i<data.length;i++){
            showData(data[i])
        }
    }

}
window.addEventListener("DOMContentLoaded",loadfetch)

// Rendering the data on the UI
function showData(obj){
    const parentEl=document.getElementById("container")
    const childEl=document.createElement("div")
    childEl.classList="inner-Container";
    parentEl.appendChild(childEl);

     // To Display Image on the page
     const imageTag=document.createElement("img");
     imageTag.classList="imge";
     imageTag.src=obj.image;
     childEl.appendChild(imageTag);

    // To Display Title on the page

    const nameTag= document.createElement("h2");
    nameTag.textContent=obj.title;
    nameTag.classList="name";
    childEl.appendChild(nameTag);

    // To Display Description on the page

    const desTag= document.createElement("h5");
    desTag.classList="description";
    desTag.textContent=obj.description;
    childEl.appendChild(desTag);

    // To display a Rating container 
    const ratingDiv=document.createElement("div")
    ratingDiv.classList="rateing-container";

    // To Display Rating on the page    
    
    const rateTag= document.createElement("p");
    childEl.appendChild(ratingDiv);
    rateTag.classList="rateing";
    rateTag.textContent=obj.rating.rate;
    ratingDiv.appendChild(rateTag);

    // To Display Count on the page
    const countTag= document.createElement("p")
    countTag.classList="count";
    countTag.textContent=obj.rating.count;
    ratingDiv.appendChild(countTag);

    // To Display Price on the page
    const priceTag=document.createElement("p")
    priceTag.textContent=obj.price;
    priceTag.classList="price";
    childEl.appendChild(priceTag);

    // To Display Category on the page
    const categoryTag=document.createElement("p");
    categoryTag.textContent=obj.category;
    category.classList="category";
    childEl.appendChild(categoryTag);

    // To Add Edit button to Display
    const editBtn=document.createElement('button')
    editBtn.textContent="Edit"
    editBtn.classList="edit-btn"
    childEl.appendChild(editBtn)

    //  To add Delete button on display
    const deleteBtn=document.createElement('button')
    deleteBtn.textContent="Delete"
    deleteBtn.classList="edit-btn"
    childEl.appendChild(deleteBtn)
}

// when Add product button is clicked opening the form.

const toggleButton=document.getElementById("addProduct");
function toggler (){
    const formStyle= document.querySelector(".form-container");
    const displayForm=getComputedStyle(formStyle).display;
    if(displayForm==="none"){
        formStyle.style.display="block"
    }
} 
toggleButton.addEventListener("click",toggler)

// Adding the new product details to JSON-SERVER.

async function addProducts(event){
    event.preventDefault();
    const title=event.target.title.value;
    const price= event.target.price.value;
    const category=event.target.category.value;
    const description=event.target.desc.value;
    const rate=event.target.rate.value;
    const count=event.target.count.value;
    const image = event.target.image.value;
    const rating={
        rate,
        count
    }
    countId++
    const id=countId;
    const obj={
        id,
        title,
        price,
        description,
        category,
        image,
        rating
    }
    const postData=await fetch('http://localhost:3000/users',{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(obj)
    });
    if(postData.ok){
        console.log('Data is Added to Json-Server')
    }
    const formStyle= document.querySelector(".form-container");
    const displayForm=getComputedStyle(formStyle).display;
    if(displayForm==="block"){
        formStyle.style.display="none"
    }
    const responseGet=await fetch('http://localhost:3000/users')
    if(responseGet.ok){
        const data= await responseGet.json()
        for(let i=0;i<data.length;i++){
            showData(data[i])
        }
    }
}