/* Общая логика для index.html */

/* --- Функция для загрузки JSON --- */
async function loadJSON(path) {
    const response = await fetch(path);
    return await response.json();
}

/* --- Рендер Hero --- */
async function renderHero() {
    const heroData = await loadJSON('data/hero.json');
    const hero = document.getElementById('hero');
    const title = document.getElementById('hero-title');
    const description = document.getElementById('hero-description');

    if (heroData.image) {
        hero.style.backgroundImage = `url('images/hero/${heroData.image}')`;
    }
    if (heroData.title) title.textContent = heroData.title;
    if (heroData.description) description.textContent = heroData.description;
}

/* --- Создание карточки --- */
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => {
        window.location.href = `item.html?type=${type}&id=${item.id}`;
    };

    const img = document.createElement('img');
    img.src = `images/${type}/${item.mainImage}`;
    img.alt = item.name;

    const content = document.createElement('div');
    content.className = 'card-content';

    const h3 = document.createElement('h3');
    h3.textContent = item.name;

    const p = document.createElement('p');
    p.textContent = item.shortDescription;

    content.appendChild(h3);
    content.appendChild(p);
    card.appendChild(img);
    card.appendChild(content);

    return card;
}

/* --- Рендер секций с каруселями --- */
async function renderSection(jsonFile, carouselId, type) {
    const data = await loadJSON(`data/${jsonFile}`);
    const carousel = document.getElementById(carouselId);

    data.forEach(item => {
        const card = createCard(item, type);
        carousel.appendChild(card);
    });
}

/* --- Плавный скролл при клике на nav --- */
function setupNavScroll() {
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --- Инициализация --- */
async function init() {
    await renderHero();
    await renderSection('tours.json', 'tours-carousel', 'tours');
    await renderSection('places.json', 'places-carousel', 'places');
    await renderSection('activities.json', 'activities-carousel', 'activities');
    await renderSection('guides.json', 'guides-carousel', 'guides');
    setupNavScroll();
}

init();
