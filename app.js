async function loadJSON(path){
    const r = await fetch(path);
    return await r.json();
}

/* SMOOTH SCROLL WITH OFFSET */
document.addEventListener('click', function(e){
    if(e.target.matches('.sticky-nav a')){
        e.preventDefault();
        const id = e.target.getAttribute('href');
        const el = document.querySelector(id);

        const offset = window.innerHeight * 0.25;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top,
            behavior:'smooth'
        });
    }
});

/* HERO */
async function loadHero(){
    const data = await loadJSON('data/hero.json');
    document.getElementById('hero-title').textContent = data.title;
    document.getElementById('hero-subtitle').textContent = data.subtitle;
    document.getElementById('hero').style.backgroundImage =
        `url(${data.image})`;
}

/* CARD */
function createCard(item,type){
    const card = document.createElement('div');
    card.className='card';

    card.innerHTML=`
        <img loading="lazy" src="${item.mainImage}">
        <div class="card-body">
            <h3>${item.title}</h3>
            <p>${item.short}</p>
        </div>
    `;

    card.onclick=()=>{
        location.href=`item.html?type=${type}&id=${item.id}`;
    };

    return card;
}

/* CAROUSEL */
function createCarousel(container){

    const wrapper = document.createElement('div');
    wrapper.className='carousel-wrapper';

    const left = document.createElement('button');
    left.className='carousel-btn left';
    left.innerHTML='‹';

    const right = document.createElement('button');
    right.className='carousel-btn right';
    right.innerHTML='›';

    left.onclick=()=>container.scrollBy({left:-300,behavior:'smooth'});
    right.onclick=()=>container.scrollBy({left:300,behavior:'smooth'});

    container.parentNode.insertBefore(wrapper,container);
    wrapper.appendChild(left);
    wrapper.appendChild(container);
    wrapper.appendChild(right);
}

/* SECTION */
async function renderSection(path,id,type){
    const data = await loadJSON(path);
    const container = document.getElementById(id);

    data.forEach(item=>{
        container.appendChild(createCard(item,type));
    });

    createCarousel(container);
}

/* INIT */
document.addEventListener('DOMContentLoaded',async()=>{

    await loadHero();

    await renderSection('data/tours.json','tours-carousel','tours');
    await renderSection('data/places.json','places-carousel','places');
    await renderSection('data/activities.json','activities-carousel','activities');
    await renderSection('data/guides.json','guides-carousel','guides');

});
