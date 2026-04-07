// -------------------- app.js --------------------
async function loadJSON(path){const r=await fetch(path);return await r.json();}

let tours, places, activities, guides, season, heroData;

async function init(){
    // Загружаем все JSON данные
    [tours, places, activities, guides, season, heroData] = await Promise.all([
        loadJSON('data/tours.json'),
        loadJSON('data/places.json'),
        loadJSON('data/activities.json'),
        loadJSON('data/guides.json'),
        loadJSON('data/season.json'),
        loadJSON('data/hero.json')
    ]);

    // Инициализация по странице
    if(document.getElementById('hero-content')) renderHero();
    if(document.getElementById('index-sections')) renderIndex();
    if(document.getElementById('item-page')) renderItem();
    if(document.getElementById('people')) renderCalculator();
}

// ------------------- HERO -------------------
function renderHero(){
    const hero=document.getElementById('hero-content');
    const h=heroData;
    hero.innerHTML=`
        <h1>${h.title}</h1>
        <p>${h.description}</p>
        <a href="calculator.html" class="btn">Calculate Your Tour</a>
    `;
    document.querySelector('.hero').style.backgroundImage=`url('images/hero/${h.image}')`;
}

// ------------------- INDEX PAGE -------------------
function renderIndex(){
    const sections=['tours','places','activities','guides'];
    sections.forEach(sec=>{
        const container=document.getElementById(sec);
        if(!container) return;
        let data;
        switch(sec){
            case 'tours': data=tours; break;
            case 'places': data=places; break;
            case 'activities': data=activities; break;
            case 'guides': data=guides; break;
        }
        data.forEach(item=>{
            const img=item.mainImage; // фото для главной
            const card=document.createElement('div');
            card.className='card';
            card.innerHTML=`
                <img src="images/${sec}/${img}" alt="${item.title}">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            `;
            card.addEventListener('click',()=>{ window.location=`item.html?type=${sec}&id=${item.id}`; });
            container.appendChild(card);
        });
    });

    // sticky nav scroll behavior
    document.querySelectorAll('.sticky-nav a').forEach(a=>{
        a.addEventListener('click',e=>{
            e.preventDefault();
            const target=document.querySelector(a.getAttribute('href'));
            if(target){
                const offset=window.innerHeight/4;
                window.scrollTo({top:target.offsetTop - offset, behavior:'smooth'});
            }
        });
    });
}

// ------------------- ITEM PAGE -------------------
function renderItem(){
    const params=new URLSearchParams(window.location.search);
    const type=params.get('type');
    const id=params.get('id');
    if(!type || !id) return;

    let data;
    switch(type){
        case 'tours': data=tours; break;
        case 'places': data=places; break;
        case 'activities': data=activities; break;
        case 'guides': data=guides; break;
    }
    const item=data.find(i=>i.id==id);
    if(!item) return;

    const page=document.getElementById('item-page');
    page.innerHTML=`
        <h1>${type.slice(0,-1).toUpperCase()}/${item.title}</h1>
        <div class="item-carousel">
            ${item.images.map(img=>`<img src="images/${type}/${img}" alt="${item.title}">`).join('')}
        </div>
        <p>${item.description}</p>
        ${item.days?`<p>Duration: ${item.days} days</p>`:''}
        ${item.price?`<p>Price: $${item.price}</p>`:''}
        <a href="index.html" class="btn">← Back to main page</a>
    `;
}

// ------------------- CALCULATOR -------------------
function renderCalculator(){
    const peopleEl=document.getElementById('people');
    const tourEl=document.getElementById('tour');
    const placesEl=document.getElementById('places');
    const activitiesEl=document.getElementById('activities');

    if(!peopleEl || !tourEl || !placesEl || !activitiesEl) return;

    for(let i=1;i<=32;i++) peopleEl.innerHTML+=`<option>${i}</option>`;
    tours.forEach(t=>tourEl.innerHTML+=`<option value="${t.id}">${t.title}</option>`);

    places.forEach(p=>{
        const label=document.createElement('label');
        label.innerHTML=`<input type="checkbox" value="${p.id}"> ${p.title}`;
        placesEl.appendChild(label);
    });

    activities.forEach(a=>{
        const label=document.createElement('label');
        label.innerHTML=`<input type="checkbox" value="${a.id}"> ${a.title}`;
        activitiesEl.appendChild(label);
    });

    document.querySelectorAll('select,input,#places input,#activities input').forEach(el=>{
        el.addEventListener('input',()=>{ updateGuidesCheckboxes(); calculate(); });
    });

    updateGuidesCheckboxes();
    calculate();
}

function getSeasonMultiplier(date){
    if(!date) return 1;
    const d=new Date(date);
    const start=new Date(season.start);
    const end=new Date(season.end);
    return (d>=start && d<=end)?season.high:season.low;
}

function updateGuidesCheckboxes(){
    const peopleCount=parseInt(document.getElementById('people')?.value || 0);
    const minGuides=Math.ceil(peopleCount/4);
    const container=document.getElementById('guides');
    if(!container) return;
    container.innerHTML='';

    guides.forEach((g,i)=>{
        const checkbox=document.createElement('input');
        checkbox.type='checkbox';
        checkbox.value=g.id;
        checkbox.id='guide_'+i;
        if(i<minGuides) checkbox.checked=true;

        const label=document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' '+g.title));
        container.appendChild(label);
    });

    container.querySelectorAll('input[type=checkbox]').forEach(cb=>{
        cb.addEventListener('change',()=>{
            const checked=container.querySelectorAll('input[type=checkbox]:checked');
            const minGuides=Math.ceil(parseInt(document.getElementById('people').value)/4);
            if(checked.length>minGuides) cb.checked=false;
            calculate();
        });
    });
}

function calculate(){
    const peopleCount=parseInt(document.getElementById('people')?.value || 0);
    const date=document.getElementById('tripDate')?.value;
    const tourObj=tours.find(t=>t.id==document.getElementById('tour')?.value);
    if(!tourObj) return;

    const selectedGuides=[...document.querySelectorAll('#guides input:checked')].map(i=>guides.find(g=>g.id==i.value));
    const selectedPlaces=[...document.querySelectorAll('#places input:checked')].map(i=>places.find(p=>p.id==i.value));
    const selectedActivities=[...document.querySelectorAll('#activities input:checked')].map(i=>activities.find(a=>a.id==i.value));

    const totalDays=tourObj.days + selectedPlaces.reduce((s,p)=>s+p.days,0);

    const placesPrice=selectedPlaces.reduce((s,p)=>s+p.price,0);
    const activitiesPrice=selectedActivities.reduce((s,a)=>{
        if(a.personPrice) return s+a.personPrice*peopleCount;
        if(a.groupPrice) return s+a.groupPrice;
        return s;
    },0);
    const guidesPrice=selectedGuides.reduce((s,g)=>s+g.price*totalDays,0);

    const seasonMultiplier=getSeasonMultiplier(date);
    const total=(tourObj.price + placesPrice + activitiesPrice + guidesPrice)*seasonMultiplier;

    const totalEl=document.getElementById('total');
    if(totalEl) totalEl.textContent="$"+Math.round(total);

    const breakdownEl=document.getElementById('breakdown');
    if(breakdownEl){
        breakdownEl.innerHTML=`Tour: $${tourObj.price}<br>
Places: $${placesPrice}<br>
Activities: $${activitiesPrice}<br>
Guides (${selectedGuides.length} x ${totalDays} days): $${guidesPrice}<br>
Season multiplier: x${seasonMultiplier}`;
    }

    const text=`Hello, I have selected the following parameters for the tour:
- People: ${peopleCount}
- Trip Date: ${date}
- Tour: ${tourObj.title}
- Guides: ${selectedGuides.map(g=>g.title).join(', ')}
- Additional Places: ${selectedPlaces.map(p=>p.title).join(', ') || 'None'}
- Additional Activities: ${selectedActivities.map(a=>a.title).join(', ') || 'None'}
- Total Price: $${Math.round(total)}
I would like to discuss booking this tour (-:`;

    const waBtn=document.getElementById('whatsapp');
    const tgBtn=document.getElementById('telegram');
    if(waBtn) waBtn.onclick=()=>window.open("https://wa.me/996555900855?text="+encodeURIComponent(text));
    if(tgBtn) tgBtn.onclick=()=>window.open("https://t.me/ErkinMms?text="+encodeURIComponent(text));
}

document.addEventListener('DOMContentLoaded',init);
