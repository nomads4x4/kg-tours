async function loadJSON(path){
  const res = await fetch(path);
  return res.json();
}

function renderCards(list, containerId, type){
  const container = document.getElementById(containerId);
  if(!container) return;

  container.innerHTML = list.map(item => `
    <div class="card">
      <img src="${item.image}" />
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="item.html?type=${type}&id=${item.id}">Подробнее</a>
    </div>
  `).join("");
}

async function initIndex(){
  const tours = await loadJSON('./data/tours.json');
  const places = await loadJSON('./data/places.json');
  const activities = await loadJSON('./data/activities.json');
  const guides = await loadJSON('./data/guides.json');

  renderCards(tours,'toursList','tours');
  renderCards(places,'placesList','places');
  renderCards(activities,'activitiesList','activities');
  renderCards(guides,'guidesList','guides');
}

async function initItem(){
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const id = params.get('id');

  if(!type || !id) return;

  const data = await loadJSON(`./data/${type}.json`);
  const item = data.find(i => i.id == id);

  const el = document.getElementById('item');
  if(!el || !item) return;

  el.innerHTML = `
    <h1>${item.title}</h1>
    <img src="${item.image}" />
    <p>${item.description}</p>
    <p>Цена: ${item.price || ''}</p>
  `;
}

async function initCalculator(){
  const tourSelect = document.getElementById('tourSelect');
  if(!tourSelect) return;

  const tours = await loadJSON('./data/tours.json');
initCalculator();
