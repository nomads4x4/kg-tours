// Утилиты
async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

// Рендер карточек
function renderCards(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Выбираем фото для главной страницы
    const mainPhoto = item.photos.find(p => p.main) || item.photos[0];

    card.innerHTML = `
      <img src="images/${type}/${mainPhoto.filename}" alt="${item.name}">
      <div class="info">
        <h3>${item.name}</h3>
        <p>${item.shortDescription}</p>
      </div>
    `;

    // Переход на item.html
    card.addEventListener('click', () => {
      window.location.href = `item.html?type=${type}&id=${item.id}`;
    });

    container.appendChild(card);
  });
}

// Основная функция
async function init() {
  try {
    const tours = await loadJSON('data/tours.json');
    const places = await loadJSON('data/places.json');
    const activities = await loadJSON('data/activities.json');
    const guides = await loadJSON('data/guides.json');
    const hero = await loadJSON('data/hero.json');

    // Hero
    if (hero.title) document.getElementById('hero-title').innerText = hero.title;
    if (hero.description) document.getElementById('hero-description').innerText = hero.description;

    // Рендер секций
    renderCards('tours-carousel', tours, 'tours');
    renderCards('places-carousel', places, 'places');
    renderCards('activities-carousel', activities, 'activities');
    renderCards('guides-carousel', guides, 'guides');

  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// Запуск
document.addEventListener('DOMContentLoaded', init);
