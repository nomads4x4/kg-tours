const DATA_PATH = "data/";
const IMAGE_PATH = "images/";

async function loadJSON(file){
const res = await fetch(DATA_PATH + file);
return await res.json();
}

/* HERO */

async function renderHero(){
const hero = await loadJSON("hero.json");

document.getElementById("hero-title").textContent = hero.title;
document.getElementById("hero-subtitle").textContent = hero.subtitle;
document.getElementById("hero-image").src =
IMAGE_PATH + "hero/" + hero.image;
}

/* CARD */

function createCard(item,type){

const card = document.createElement("a");
card.className="card";
card.href=`item.html?type=${type}&id=${item.id}`;

card.innerHTML=`
<img src="${IMAGE_PATH}${type}/${item.cover}">
<div class="card-content">
<h3>${item.title}</h3>
<p>${item.short}</p>
</div>
`;

return card;
}

/* CAROUSEL */

function createCarousel(container){

const wrapper = document.createElement("div");
wrapper.className="carousel-wrapper";

const left = document.createElement("button");
left.className="carousel-btn left";
left.innerHTML="‹";

const right = document.createElement("button");
right.className="carousel-btn right";
right.innerHTML="›";

container.parentNode.insertBefore(wrapper,container);
wrapper.appendChild(left);
wrapper.appendChild(container);
wrapper.appendChild(right);

left.onclick = ()=>{
container.scrollBy({left:-300,behavior:"smooth"});
};

right.onclick = ()=>{
container.scrollBy({left:300,behavior:"smooth"});
};

/* drag mouse */

let isDown=false;
let startX;
let scrollLeft;

container.addEventListener("mousedown",(e)=>{
isDown=true;
startX=e.pageX-container.offsetLeft;
scrollLeft=container.scrollLeft;
});

container.addEventListener("mouseleave",()=>isDown=false);
container.addEventListener("mouseup",()=>isDown=false);

container.addEventListener("mousemove",(e)=>{
if(!isDown)return;
e.preventDefault();
const x=e.pageX-container.offsetLeft;
const walk=(x-startX)*2;
container.scrollLeft=scrollLeft-walk;
});

}

/* RENDER */

async function renderCarousel(type,file,id){

const data = await loadJSON(file);
const container = document.getElementById(id);

data.forEach(item=>{
container.appendChild(createCard(item,type));
});

createCarousel(container);
}

/* INIT INDEX */

async function initIndex(){

await renderHero();

await renderCarousel("tours","tours.json","tours-carousel");
await renderCarousel("places","places.json","places-carousel");
await renderCarousel("activities","activities.json","activities-carousel");
await renderCarousel("guides","guides.json","guides-carousel");

}

/* ITEM PAGE */

function getParams(){
const p=new URLSearchParams(location.search);
return{
type:p.get("type"),
id:p.get("id")
};
}

async function renderItemPage(){

const {type,id}=getParams();
if(!type)return;

const data = await loadJSON(type+".json");
const item = data.find(i=>i.id==id);

document.getElementById("item-title").textContent=
`${type} / ${item.title}`;

document.getElementById("item-desc").textContent=
item.description;

const carousel = document.getElementById("item-carousel");

item.images.forEach(img=>{
const image=document.createElement("img");
image.src=`${IMAGE_PATH}${type}/${img}`;
carousel.appendChild(image);
});

createCarousel(carousel);

}

/* INIT */

document.addEventListener("DOMContentLoaded",()=>{

if(document.getElementById("tours-carousel")){
initIndex();
}

if(document.getElementById("item-carousel")){
renderItemPage();
}

});
