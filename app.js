let DATA = {};

async function loadAllData(){
    const files = ["hero","tours","guides","destinations","activities","season"];
    await Promise.all(files.map(async f=>{
        const res = await fetch(`data/${f}.json`);
        let json = await res.json();
        // универсальный способ, если JSON массив или объект с ключом
        DATA[f] = Array.isArray(json) ? json : (json[f] || json);
    }));
}

function init(){
    const page = document.body.dataset.page;
    if(page==="index") initIndexPage();
    if(page==="item") initItemPage();
    if(page==="calculator") initCalculatorPage();
}

/////////////////////////
// INDEX PAGE
function initIndexPage(){
    renderHero();
    renderCarousel("tours");
    renderCarousel("destinations");
    renderCarousel("activities");
    renderCarousel("guides");
}

function renderHero(){
    const hero = document.getElementById("hero");
    if(!hero) return;
    hero.className="hero";
    hero.style.backgroundImage=`url(images/hero/hero_main.jpg)`;
    hero.innerHTML=`
        <div class="hero-content">
            <h1>${DATA.hero.title}</h1>
            <p>${DATA.hero.subtitle}</p>
            <a href="calculator.html" class="btn">Calculate Tour</a>
        </div>
    `;
    initStickyNav();
    initSmoothScroll();
    renderFooter();
}

function renderCarousel(type){
    const container = document.getElementById(type);
    if(!container) return;
    const items = DATA[type];
    if(!items) return;
    container.innerHTML = `
        <h2 class="section-title">${type}</h2>
        <div class="carousel">
            ${items.map(i=>{
                const img = `images/${type}/${i.id}_main.jpg`;
                return `
                    <a href="item.html?id=${i.id}&type=${type}" class="card">
                        <img src="${img}" loading="lazy" onerror="this.src='images/placeholder.jpg'"/>
                        <div class="card-body"><h3>${i.title||i.name}</h3></div>
                    </a>
                `;
            }).join('')}
        </div>
    `;
}

function initStickyNav(){
    const nav = document.getElementById("sticky-nav");
    if(!nav) return;
    nav.innerHTML=`
        <a href="#tours">Tours</a>
        <a href="#destinations">Destinations</a>
        <a href="#activities">Activities</a>
        <a href="#guides">Guides</a>
    `;
}

function initSmoothScroll(){
    document.querySelectorAll("#sticky-nav a").forEach(a=>{
        a.addEventListener("click", e=>{
            e.preventDefault();
            document.querySelector(a.getAttribute("href")).scrollIntoView({behavior:"smooth"});
        });
    });
}

function renderFooter(){
    const footer=document.getElementById("footer");
    if(!footer) return;
    footer.innerHTML=`
        <div>
            <div>KG Tours</div>
            <div>WhatsApp • Telegram • Instagram</div>
        </div>
    `;
}

/////////////////////////
// ITEM PAGE
function initItemPage(){
    const id = new URLSearchParams(location.search).get("id");
    renderItem(id);
}

function renderItem(id){
    const type = new URLSearchParams(location.search).get("type");
    const item = DATA[type].find(i=>i.id===id);
    if(!item) return;

    const images = getImages(type, id);
    const gallery = document.getElementById("item-gallery");
    const imgs = [images.main, ...images.gallery];
    gallery.innerHTML = `<div class="carousel">
        ${imgs.map(src=>`<img src="${src}" loading="lazy" onerror="this.src='images/placeholder.jpg'" />`).join('')}
    </div>`;

    document.getElementById("item-description").innerHTML=`
        <h1>${item.title||item.name}</h1>
        <p>${item.description||""}</p>
    `;
}

function getImages(type,id){
    const folder=`images/${type}/`;
    const main = `${folder}${id}_main.jpg`;
    const gallery = [];
    for(let i=1;i<=5;i++){
        gallery.push(`${folder}${id}_${i}.jpg`);
    }
    return {main,gallery};
}

/////////////////////////
// CALCULATOR
let CALC_STATE = {
    people:0,
    date:null,
    tour:null,
    guides:[],
    destinations:[],
    activities:[]
};

function initCalculatorPage(){
    renderCalculator();
    initCalculatorEvents();
    updatePrice();
}

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

<div class="block">
<label>Additional activities</label>
<div id="activities"></div>
</div>

<div class="price-box" id="price-box">
<h3>Total Price: <span id="total-price">0</span></h3>
<div class="breakdown" id="breakdown"></div>
<button id="whatsapp" class="btn" disabled>WhatsApp</button>
<button id="telegram" class="btn" disabled>Telegram</button>
</div>
    `;

    // fill selects
    const tourSelect = document.getElementById("tour");
    tourSelect.innerHTML = DATA.tours.map(t=>`<option value="${t.id}">${t.title}</option>`).join('');
    
    const guidesDiv = document.getElementById("guides");
    guidesDiv.innerHTML = DATA.guides.map(g=>`
        <label><input type="checkbox" value="${g.id}"> ${g.name} ($${g.price})</label>
    `).join('');

    const destDiv = document.getElementById("destinations");
    destDiv.innerHTML = DATA.destinations.map(d=>`
        <label><input type="checkbox" value="${d.id}"> ${d.title} ($${d.price})</label>
    `).join('');

    const actDiv = document.getElementById("activities");
    actDiv.innerHTML = DATA.activities.map(a=>`
        <label><input type="checkbox" value="${a.id}"> ${a.title} ($${a.price}${a.type==="perPerson"?" per person":" per group"})</label>
    `).join('');
}

function initCalculatorEvents(){
    document.getElementById("people").addEventListener("input", e=>{
        CALC_STATE.people = parseInt(e.target.value)||0;
        enforceGuideLimit();
        updatePrice();
    });
    document.getElementById("date").addEventListener("input", e=>{
        CALC_STATE.date = e.target.value;
        updatePrice();
    });
    document.getElementById("tour").addEventListener("change", e=>{
        CALC_STATE.tour = e.target.value;
        updatePrice();
    });

    document.querySelectorAll("#guides input").forEach(i=>{
        i.addEventListener("change", e=>{
            enforceGuideLimit();
            CALC_STATE.guides = Array.from(document.querySelectorAll("#guides input:checked")).map(c=>c.value);
            updatePrice();
        });
    });
    document.querySelectorAll("#destinations input").forEach(i=>{
        i.addEventListener("change", updatePrice);
    });
    document.querySelectorAll("#activities input").forEach(i=>{
        i.addEventListener("change", updatePrice);
    });

    document.getElementById("whatsapp").addEventListener("click", ()=>sendMessage("whatsapp"));
    document.getElementById("telegram").addEventListener("click", ()=>sendMessage("telegram"));
}

function enforceGuideLimit(){
    const people = CALC_STATE.people||0;
    const required = Math.ceil(people/4);
    const checked = Array.from(document.querySelectorAll("#guides input:checked"));
    if(checked.length>required) checked.slice(required).forEach(c=>c.checked=false);
}

function updatePrice(){
    const totalPeople = CALC_STATE.people||0;
    const tourObj = DATA.tours.find(t=>t.id===CALC_STATE.tour);
    if(!tourObj){setPrice(0,{});return;}

    const selectedDest = Array.from(document.querySelectorAll("#destinations input:checked")).map(c=>c.value)
        .map(id=>DATA.destinations.find(d=>d.id===id));
    const selectedAct = Array.from(document.querySelectorAll("#activities input:checked")).map(c=>c.value)
        .map(id=>DATA.activities.find(a=>a.id===id));
    const selectedGuides = Array.from(document.querySelectorAll("#guides input:checked")).map(c=>DATA.guides.find(g=>g.id===c.value));

    const totalDays = tourObj.days + selectedDest.reduce((sum,d)=>sum+d.days,0);
    const guidesCount = Math.ceil(totalPeople/4);

    let activitiesPrice = 0;
    selectedAct.forEach(a=>{
        if(a.type==="perPerson") activitiesPrice += a.price*totalPeople;
        else activitiesPrice += a.price*guidesCount;
    });

    let destinationsPrice = selectedDest.reduce((sum,d)=>sum+d.price,0);
    let guidesPrice = selectedGuides.reduce((sum,g)=>sum+g.price*totalDays,0);
    
    const multiplier = getSeasonMultiplier(CALC_STATE.date);
    const totalPrice = (tourObj.price + destinationsPrice + activitiesPrice + guidesPrice)*multiplier;

    setPrice(totalPrice,{
        tour: tourObj.price,
        destinations: destinationsPrice,
        activities: activitiesPrice,
        guides: guidesPrice,
        multiplier
    });

    document.getElementById("whatsapp").disabled = totalPrice===0;
    document.getElementById("telegram").disabled = totalPrice===0;
}

function setPrice(total, breakdown){
    document.getElementById("total-price").textContent = total.toFixed(2);
    const bd = document.getElementById("breakdown");
    bd.innerHTML = Object.entries(breakdown).map(([k,v])=>`<div><span>${k}</span><span>$${v.toFixed(2)}</span></div>`).join('');
}

function getSeasonMultiplier(dateStr){
    if(!dateStr) return 1;
    const d = new Date(dateStr);
    const month = d.getMonth()+1;
    const day = d.getDate();
    const mmdd = (month<10?"0"+month:month) + "-" + (day<10?"0"+day:day);

    const season = DATA.season.find(s=>mmdd>=s.from && mmdd<=s.to);
    return season? season.multiplier : 1;
}

function sendMessage(platform){
    const people = CALC_STATE.people;
    const date = CALC_STATE.date;
    const tour = DATA.tours.find(t=>t.id===CALC_STATE.tour)?.title;
    const destinations = Array.from(document.querySelectorAll("#destinations input:checked")).map(c=>DATA.destinations.find(d=>d.id===c.value).title).join(", ");
    const activities = Array.from(document.querySelectorAll("#activities input:checked")).map(c=>DATA.activities.find(a=>a.id===c.value).title).join(", ");
    const guides = Array.from(document.querySelectorAll("#guides input:checked")).map(c=>DATA.guides.find(g=>g.id===c.value).name).join(", ");
    const total = document.getElementById("total-price").textContent;

    const text = `Hello, I have selected the following parameters for the tour: people=${people}, date=${date}, tour=${tour}, destinations=${destinations}, activities=${activities}, guides=${guides}, total price=${total} and would like to discuss booking this tour (-:`;

    let url="";
    if(platform==="whatsapp") url=`https://wa.me/?text=${encodeURIComponent(text)}`;
    if(platform==="telegram") url=`https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
    window.open(url,"_blank");
}

/////////////////////////
// INIT
loadAllData().then(init);
