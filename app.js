// ---------- HELPERS ----------

async function loadJSON(path){
return fetch(path).then(r=>r.json())
}

function qs(id){
return document.getElementById(id)
}

// ---------- INDEX PAGE ----------

async function initIndex(){

if(!qs('tours-container')) return

const tours = await loadJSON('./data/tours.json')
const places = await loadJSON('./data/places.json')
const activities = await loadJSON('./data/activities.json')
const guides = await loadJSON('./data/guides.json')

function createCard(item,type){

const card = document.createElement('div')
card.className = 'card'

card.innerHTML = `
<img src="${item.image}">
<div class="card-body">
<h3>${item.name}</h3>
<p>${item.short_description || ''}</p>
<div class="card-meta">
${item.days ? item.days+' days' : ''}
${item.price ? ' • $'+item.price : ''}
</div>
</div>
`

card.onclick = () =>
location.href = `item.html?type=${type}&id=${item.id}`

return card
}

tours.forEach(i=>qs('tours-container').appendChild(createCard(i,'tour')))
places.forEach(i=>qs('places-container').appendChild(createCard(i,'place')))
activities.forEach(i=>qs('activities-container').appendChild(createCard(i,'activity')))
guides.forEach(i=>qs('guides-container').appendChild(createCard(i,'guide')))
}

// ---------- ITEM PAGE ----------

async function initItem(){

if(!location.search.includes('id=')) return

const params = new URLSearchParams(location.search)
const type = params.get('type')
const id = params.get('id')

const map = {
tour:'./data/tours.json',
place:'./data/places.json',
activity:'./data/activities.json',
guide:'./data/guides.json'
}

const data = await loadJSON(map[type])
const item = data.find(i=>i.id===id)

qs('item').innerHTML = `
<div class="item-hero">
<img src="${item.image}">
</div>

<div class="item-content">
<a href="index.html" class="back">← Back</a>
<h1>${item.name}</h1>
<p>${item.description || ''}</p>
</div>
`
}

// ---------- CALCULATOR ----------

async function initCalculator(){

if(!qs('tour')) return

const tours = await loadJSON('./data/tours.json')
const places = await loadJSON('./data/places.json')
const activities = await loadJSON('./data/activities.json')
const guides = await loadJSON('./data/guides.json')
const cars = await loadJSON('./data/cars.json')
const season = await loadJSON('./data/season.json')

const tourSelect = qs('tour')
const guideSelect = qs('guide')
const placesDiv = qs('places')
const activitiesDiv = qs('activities')

tours.forEach(t=>{
tourSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`
})

guides.forEach(g=>{
guideSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`
})

places.forEach(p=>{
placesDiv.innerHTML +=
`<label><input type="checkbox" value="${p.id}"> ${p.name}</label>`
})

activities.forEach(a=>{
activitiesDiv.innerHTML +=
`<label><input type="checkbox" value="${a.id}"> ${a.name}</label>`
})

document.querySelectorAll('input,select').forEach(el=>{
el.addEventListener('change',calculate)
})

function getSeasonMultiplier(date){

if(!date) return 1

const d = new Date(date)
const md =
("0"+(d.getMonth()+1)).slice(-2)+"-"+
("0"+d.getDate()).slice(-2)

if(md >= season.season_start && md <= season.season_end)
return season.high_season_multiplier

return season.low_season_multiplier
}

function calculate(){

const people = parseInt(qs('people').value)
const date = qs('startDate').value

const tourObj = tours.find(t=>t.id===tourSelect.value)
const guideObj = guides.find(g=>g.id===guideSelect.value)
const car = cars.find(c=>c.id===guideObj.car_id)

let days = tourObj.days
let total = tourObj.price + guideObj.price

document.querySelectorAll('#places input:checked').forEach(cb=>{
const p = places.find(x=>x.id===cb.value)
days += p.days
total += p.price
})

const carsNeeded = Math.ceil(people / car.seats)
total += carsNeeded * car.price

document.querySelectorAll('#activities input:checked').forEach(cb=>{
const a = activities.find(x=>x.id===cb.value)
if(a.type === 'per_person') total += a.price * people
else total += a.price
})

total *= getSeasonMultiplier(date)

qs('totalDays').innerText = "Total days: " + days
qs('totalPrice').innerText = "Total: $" + Math.round(total)

const text = encodeURIComponent(
`Hello! I want this tour:
Tour: ${tourObj.name}
People: ${people}
Days: ${days}
Total: $${Math.round(total)}`
)

qs('whatsapp').href =
`https://wa.me/996555900855?text=${text}`

qs('telegram').href =
`https://t.me/ErkinMms?text=${text}`
}

calculate()
}

// ---------- INIT ----------

initIndex()
initItem()
initCalculator()
