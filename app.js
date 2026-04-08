let DATA = {};

async function loadAllData(){
const files=[
"hero",
"tours",
"guides",
"destinations",
"activities",
"season"
];

await Promise.all(files.map(async f=>{
const res=await fetch(`data/${f}.json`);
DATA[f]=await res.json();
}));
}

function init(){
const page=document.body.dataset.page;
if(page==="index") initIndexPage();
if(page==="item") initItemPage();
if(page==="calculator") initCalculatorPage();
}

function initIndexPage(){
renderHero();
renderCarousel("tours");
renderCarousel("destinations");
renderCarousel("activities");
renderCarousel("guides");
}

function initItemPage(){
const id=new URLSearchParams(location.search).get("id");
renderItem(id);
}

function initCalculatorPage(){
renderCalculator();
initCalculatorEvents();
}

let CALC_STATE = {
people:0,
date:null,
tour:null,
guides:[],
destinations:[],
activities:[]
};

function renderCalculator(){
const controls=document.getElementById("calc-controls");
controls.innerHTML=`
<div class="block">
<label>Number of people</label>
<input type="number" id="people" min="1" />
</div>

<div class="block">
<label>Trip date</label>
<input type="date" id="date" />
</div>

<div class="block">
<label>Select tour</label>
<select id="tour"></select>
</div>

<div class="block">
<label>Select guides</label>
<div id="guides"></div>
</div>

<div class="block">
<label>Additional destinations</label>
<div id="destinations"></div>
</div>
