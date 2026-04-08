const DATA = {
    hero: [], tours: [], guides: [], destinations: [], activities: [], season: []
};

async function loadAllData() {
    const files = ['hero','tours','guides','destinations','activities','season'];
    await Promise.all(files.map(f => fetch(`data/${f}.json`).then(r=>r.json()).then(j=>DATA[f]=j)));
}

function init() {
    loadAllData().then(()=>{
        const page = document.body.dataset.page;
        if(page==='index') initIndexPage();
        else if(page==='item') initItemPage();
        else if(page==='calculator') initCalculatorPage();
    });
}

// ---------- INDEX PAGE ----------
function initIndexPage() {
    renderHero();
    renderCards('tours','tours-cards');
    renderCards('destinations','destinations-cards');
    renderCards('activities','activities-cards');
    renderCards('guides','guides-cards');
}

function renderHero() {
    const container = document.querySelector('#hero');
    DATA.hero.forEach(item=>{
        const div = document.createElement('div');
        div.innerHTML=`<h1>${item.title}</h1><p>${item.subtitle||''}</p><a href="calculator.html" class="btn">Calculate Tour</a>`;
        container.appendChild(div);
        container.style.backgroundImage=`url(${getMainImage('hero',item.id)})`;
    });
}

function renderCards(type, containerId){
    const container=document.getElementById(containerId);
    DATA[type].forEach(item=>{
        const card=document.createElement('div');
        card.className='card';
        card.innerHTML=`<img src="${getMainImage(type,item.id)}" alt="${item.title}"><h3>${item.title}</h3><p>${item.shortDesc||''}</p>`;
        card.onclick=()=>window.location.href=`item.html?id=${item.id}`;
        container.appendChild(card);
    });
}

// ---------- ITEM PAGE ----------
function initItemPage(){
    const id=new URLSearchParams(window.location.search).get('id');
    if(!id) return;
    const item=DATA.tours.find(t=>t.id===id);
    if(!item) return;
    document.querySelector('.item-title').textContent=item.title;
    document.querySelector('.item-description').textContent=item.description||'';
    const gallery=document.querySelector('.item-gallery');
    getGalleryImages('tours',id).forEach(src=>{
        const img=document.createElement('img');
        img.src=src; img.alt=item.title; img.loading='lazy'; img.className='gallery-image';
        gallery.appendChild(img);
    });
}

// ---------- CALCULATOR PAGE ----------
function initCalculatorPage(){
    const peopleInput=document.getElementById('people-input');
    const dateInput=document.getElementById('date-input');
    const tourSelect=document.getElementById('tour-select');
    const guideSelect=document.getElementById('guide-select');
    const destinationSelect=document.getElementById('destination-select');
    const activitySelect=document.getElementById('activity-select');
    const totalPriceEl=document.getElementById('total-price');
    const breakdownEl=document.getElementById('price-breakdown');
    const whatsappBtn=document.getElementById('whatsapp-btn');
    const telegramBtn=document.getElementById('telegram-btn');

    // Populate selects
    DATA.tours.forEach(t=>{const o=document.createElement('option');o.value=t.id;o.text=t.title;tourSelect.appendChild(o)});
    DATA.guides.forEach(g=>{const o=document.createElement('option');o.value=g.id;o.text=g.name;guideSelect.appendChild(o)});
    DATA.destinations.forEach(d=>{const o=document.createElement('option');o.value=d.id;o.text=d.title;destinationSelect.appendChild(o)});
    DATA.activities.forEach(a=>{const o=document.createElement('option');o.value=a.id;o.text=a.title;activitySelect.appendChild(o)});

    function calculate(){
        const people=parseInt(peopleInput.value)||0;
        const tour=DATA.tours.find(t=>t.id===tourSelect.value);
        const selectedGuides=[...guideSelect.selectedOptions].map(o=>DATA.guides.find(g=>g.id===o.value));
        const selectedDest=[...destinationSelect.selectedOptions].map(o=>DATA.destinations.find(d=>d.id===o.value));
        const selectedAct=[...activitySelect.selectedOptions].map(o=>DATA.activities.find(a=>a.id===o.value));

        if(!tour || !people || !selectedGuides.length) {
            totalPriceEl.textContent='Select parameters'; breakdownEl.innerHTML=''; whatsappBtn.disabled=true; telegramBtn.disabled=true; return;
        }

        const guidesCount=Math.ceil(people/4);
        const totalDays=tour.days+selectedDest.reduce((a,b)=>a+b.days,0);
        const destinationsPrice=selectedDest.reduce((a,b)=>a+b.price,0);
        const activitiesPrice=selectedAct.reduce((sum,a)=>{
            return sum+(a.perPerson? a.price*people : a.price*guidesCount);
        },0);

        let seasonMultiplier=1;
        const selectedDate=new Date(dateInput.value);
        DATA.season.forEach(s=>{
            const start=new Date(s.start); const end=new Date(s.end);
            if(selectedDate>=start && selectedDate<=end) seasonMultiplier=s.multiplier;
        });

        const totalPrice=(guidesCount*((tour.price)+destinationsPrice+selectedGuides.reduce((a,g)=>a+g.price*totalDays,0))+activitiesPrice)*seasonMultiplier;
        totalPriceEl.textContent=`$${totalPrice.toFixed(2)}`;

        // breakdown
        breakdownEl.innerHTML=`<ul>
            <li>Tour: $${tour.price}</li>
            <li>Destinations: $${destinationsPrice}</li>
            <li>Activities: $${activitiesPrice}</li>
            <li>Guides: $${selectedGuides.reduce((a,g)=>a+g.price*totalDays,0)}</li>
            <li>Multiplier: x${seasonMultiplier}</li>
        </ul>`;

        // contact links
        const paramText=`people: ${people}, date: ${dateInput.value}, tour: ${tour.title}, destinations: ${selectedDest.map(d=>d.title).join(', ')}, activities: ${selectedAct.map(a=>a.title).join(', ')}, guides: ${selectedGuides.map(g=>g.name).join(', ')}, total price: $${totalPrice.toFixed(2)}`;
        whatsappBtn.href=`https://wa.me/?text=Hello, I have selected the following parameters for the tour (${paramText}) and would like to discuss booking this tour (-:`;
        telegramBtn.href=`https://t.me/share/url?url=&text=Hello, I have selected the following parameters for the tour (${paramText}) and would like to discuss booking this tour (-:`;
        whatsappBtn.disabled=false; telegramBtn.disabled=false;
    }

    [peopleInput,dateInput,tourSelect,guideSelect,destinationSelect,activitySelect].forEach(el=>el.addEventListener('change',calculate));
    calculate();
}

// ---------- IMAGE HELPERS ----------
function getMainImage(type,id){
    return `images/${type}/${id}_main.jpg`;
}

function getGalleryImages(type,id){
    const images=[];
    let i=1;
    while(true){
        const path=`images/${type}/${id}_${i}.jpg`;
        if(i>5) break; // limit max images
        images.push(path);
        i++;
    }
    return images;
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', init);
