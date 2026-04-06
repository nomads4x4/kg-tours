async function loadJSON(path){
const res = await fetch(path)
return res.json()
}

function getPage(){
return location.pathname.split("/").pop()
}

document.addEventListener("DOMContentLoaded",()=>{

const page = getPage()

if(page === "" || page === "index.html") initIndex()
if(page === "item.html") initItem()
if(page === "calculator.html") initCalculator()

})

async function initIndex(){

renderHero()

renderSection("tours")
renderSection("places")
renderSection("activities")
renderSection("guides")

}

function renderHero(){

document.getElementById("hero").innerHTML = `
<h1>Kyrgyzstan Tours with Professional Guides</h1>
<p>Discover mountains, lakes and nomadic culture</p>
<a href="calculator.html" class="btn">Calculate Tour</a>
`

}

async function renderSection(type){

const data = await loadJSON(`data/${type}.json`)
const section = document.getElementById(type)

section.innerHTML = `<h2>${type}</h2><div class="carousel"></div>`

const carousel = section.querySelector(".carousel")

data.forEach(item=>{

const card = document.createElement("div")
card.className="card"

card.innerHTML=`
<img src="images/${type}/${item.id}_main.jpg">
<h3>${item.title || item.name}</h3>
<p>${item.description}</p>
`

card.onclick=()=>{
location.href=`item.html?type=${type}&id=${item.id}`
}

carousel.appendChild(card)

})

}

async function initItem(){

const params = new URLSearchParams(location.search)
const type = params.get("type")
const id = params.get("id")

const data = await loadJSON(`data/${type}.json`)
const item = data.find(i=>i.id===id)

document.getElementById("item").innerHTML = `
<div class="carousel">
${item.images.map(img=>`<img src="images/${type}/${img}">`).join("")}
</div>

<h1>${item.title || item.name}</h1>
<p>${item.description}</p>
<p>Days: ${item.days || "-"}</p>
<p>Price: ${item.price}</p>
`

}

async function initCalculator(){

const tours = await loadJSON("data/tours.json")
const places = await loadJSON("data/places.json")
const activities = await loadJSON("data/activities.json")
const guides = await loadJSON("data/guides.json")
const season = await loadJSON("data/season.json")

fillSelect("tour", tours)
fillSelect("places", places)
fillSelect("activities", activities)
fillSelect("guide", guides)

document.getElementById("calculate").onclick=()=>{

const people = +people.value
const tour = tours[tourSelect.value]

}

}

function fillSelect(id,data){

const select = document.getElementById(id)

data.forEach((item,i)=>{
const option = document.createElement("option")
option.value=i
option.text=item.title || item.name
select.appendChild(option)
})

}
