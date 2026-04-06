async function loadJSON(path){
const res = await fetch(path)
return res.json()
}

function page(){
return location.pathname.split("/").pop()
}

document.addEventListener("DOMContentLoaded",()=>{

const p = page()

if(p==="" || p==="index.html") initIndex()
if(p==="item.html") initItem()
if(p==="calculator.html") initCalculator()

})

/* ---------- HERO ---------- */

function renderHero(){
hero.innerHTML=`
<h1>Kyrgyzstan Tours with Professional Guides</h1>
<p>Discover mountains, lakes and nomadic culture</p>
<a href="calculator.html" class="btn">Calculate Tour</a>
`
}

/* ---------- INDEX ---------- */

async function initIndex(){

renderHero()

renderSection("tours")
renderSection("places")
renderSection("activities")
renderSection("guides")

}

async function renderSection(type){

const data = await loadJSON(`data/${type}.json`)
const section = document.getElementById(type)

section.innerHTML=`<h2>${type}</h2><div class="carousel"></div>`

const carousel = section.querySelector(".carousel")

data.forEach(item=>{

const card=document.createElement("div")
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

/* ---------- ITEM ---------- */

async function initItem(){

const params=new URLSearchParams(location.search)
const type=params.get("type")
const id=params.get("id")

const data=await loadJSON(`data/${type}.json`)
const item=data.find(i=>i.id===id)

document.getElementById("item").innerHTML=`

<div class="gallery">
${item.images.map(img=>`<img src="images/${type}/${img}">`).join("")}
</div>

<h1>${item.title || item.name}</h1>
<p>${item.description}</p>
<p>Days: ${item.days || "-"}</p>
<p>Price: ${item.price}</p>
`

}

/* ---------- CALCULATOR ---------- */

async function initCalculator(){

const tours=await loadJSON("data/tours.json")
const places=await loadJSON("data/places.json")
const activities=await loadJSON("data/activities.json")
const guides=await loadJSON("data/guides.json")
const season=await loadJSON("data/season.json")

fillSelect("tour",tours)
fillSelect("places",places)
fillSelect("activities",activities)
fillSelect("guide",guides)

calculate.onclick=()=>{

const people=+document.getElementById("people").value
const date=document.getElementById("date").value

const tour=tours[tour.value]
const guide=guides[guideSelect.value]

const selectedPlaces=getSelected("places",places)
const selectedActivities=getSelected("activities",activities)

const totalDays=
tour.days+
selectedPlaces.reduce((s,p)=>s+(p.days||0),0)

const guidesCount=Math.ceil(people/4)

const activitiesPrice=
selectedActivities.reduce((sum,a)=>{
if(a.perPerson) return sum+(a.price*people)
return sum+a.price
},0)

const placesPrice=
selectedPlaces.reduce((s,p)=>s+p.price,0)

let total=
tour.price+
placesPrice+
activitiesPrice+
(guidesCount*guide.price*totalDays)

const multiplier=getSeasonMultiplier(date,season)

total*=multiplier

result.innerHTML=`Total: $${Math.round(total)}`

const text=`Hello. I selected:
People: ${people}
Tour: ${tour.title}
Places: ${selectedPlaces.map(p=>p.title).join(",")}
Activities: ${selectedActivities.map(a=>a.title).join(",")}
Guide: ${guide.name}
Total: ${total}
`

whatsapp.href=`https://wa.me/996555900855?text=${encodeURIComponent(text)}`
telegram.href=`https://t.me/ErkinMms?text=${encodeURIComponent(text)}`

}

}

function fillSelect(id,data){
const select=document.getElementById(id)
data.forEach((item,i)=>{
const opt=document.createElement("option")
opt.value=i
opt.text=item.title || item.name
select.appendChild(opt)
})
}

function getSelected(id,data){
const select=document.getElementById(id)
return Array.from(select.selectedOptions).map(o=>data[o.value])
}

function getSeasonMultiplier(date,season){

if(!date) return 1

const d=date.slice(5)

if(d>=season.seasonStart && d<=season.seasonEnd){
return season.high
}

return season.low
}
