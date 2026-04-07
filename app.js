/* =========================
   App.js – Data-driven rendering
   ========================= */

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

/* =========================
   Render Hero
   ========================= */
async function renderHero() {
  const heroData = await fetchJSON('data/hero.json');
  const heroSection = document.querySelector('.hero');
  document.getElementById('hero-title').textContent = heroData.title;
  document.getElementById('hero-description').textContent = heroData.description;
  heroSection.style.backgroundImage = `url('images/hero/${heroData.image}')`;
}

/* =========================
   Render Carousel
   ========================= */
async function renderCarousel(sectionId, jsonPath, type) {
  const data = await fetchJSON(jsonPath);
  const carousel = document.getElementById(`${sectionId}-carousel`);

  data.forEach(item => {
    // ищем фото для главной страницы
    const mainImage = item.images.find(img => img.main) || item.images[0];
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="images/${type}/${mainImage.file}" alt="${item.name}">
      <div class="card-content">
        <h3>${item.name}</h3>
        <p>${item.shortDescription}</p>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = `item.html?type=${type}&id=${item.id}`;
    });
    carousel.appendChild(card);
  });
}

/* =========================
   Init
   ========================= */
async function init() {
  try {
    await renderHero();
    await renderCarousel('tours', 'data/tours.json', 'tours');
    await renderCarousel('places', 'data/places.json', 'places');
    await renderCarousel('activities', 'data/activities.json', 'activities');
    await renderCarousel('guides', 'data/guides.json', 'guides');
  } catch (err) {
    console.error(err);
  }
}

/* =========================
   Run
   ========================= */
document.addEventListener('DOMContentLoaded', init);
