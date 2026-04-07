// app.js

// Функция для подгрузки JSON
async function fetchData(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Cannot fetch ${path}`);
  return response.json();
}

// Рендер hero
async function renderHero() {
  try {
    const heroData = await fetchData('data/hero.json');
    const heroSection = document.querySelector('.hero');
    const titleEl = document.getElementById('hero-title');
    const descEl = document.getElementById('hero-description');

    // Используем фон, указанный в JSON
    heroSection.style.backgroundImage = `url('images/hero/${heroData.background}')`;
    titleEl.textContent = heroData.title;
    descEl.textContent = heroData.description;
  } catch (e) {
    console.error('Error loading hero:', e);
  }
}

// Функция для рендера карточек
function renderCards(containerId, items, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // очищаем контейнер

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    // На главной странице берем специально отмеченное фото
    const mainImage = item.mainImage || item.images[0];

    card.innerHTML = `
      <img src="images/${type}/${mainImage}" alt="${item.name}">
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.shortDescription}</p>
      </div>
    `;

    // По клику переходим на item.html с параметрами type и id
    card.addEventListener('click', () => {
      window.location.href = `item.html?type=${type}&id=${item.id}`;
    });

    container.appendChild(card);
  });
}

// Главная функция для рендера всех секций
async function renderAll() {
  await renderHero();

  try {
    const [tours, places, activities, guides] = await Promise.all([
      fetchData('data/tours.json'),
      fetchData('data/places.json'),
      fetchData('data/activities.json'),
      fetchData('data/guides.json')
    ]);

    renderCards('tours-container', tours, 'tours');
    renderCards('places-container', places, 'places');
    renderCards('activities-container', activities, 'activities');
    renderCards('guides-container', guides, 'guides');
  } catch (e) {
    console.error('Error loading sections:', e);
  }
}

// Запуск рендера после загрузки страницы
document.addEventListener('DOMContentLoaded', renderAll);
