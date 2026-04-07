// ==========================
// UTILS
// ==========================
async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => {
        window.location.href = `item.html?type=${type}&id=${item.id}`;
    });

    const img = document.createElement('img');
    img.src = item.mainImage; // mainImage — отмеченное для главной
    img.alt = item.name;

    const content = document.createElement('div');
    content.className = 'card-content';

    const title = document.createElement('h3');
    title.textContent = item.name;

    const desc = document.createElement('p');
    desc.textContent = item.shortDesc || '';

    content.appendChild(title);
    content.appendChild(desc);

    card.appendChild(img);
    card.appendChild(content);

    return card;
}

// ==========================
// HERO
// ==========================
async function renderHero() {
    try {
        const hero = await fetchJSON('data/hero.json');
        const heroSection = document.getElementById('hero');
        heroSection.style.backgroundImage = `url('images/hero/${hero.image}')`;
        document.getElementById('hero-title').textContent = hero.title;
        document.getElementById('hero-desc').textContent = hero.description;
    } catch (err) {
        console.error('Error loading hero:', err);
    }
}

// ==========================
// CARDS
// ==========================
async function renderSection(sectionId, jsonPath, type) {
    try {
        const items = await fetchJSON(jsonPath);
        const container = document.getElementById(sectionId);
        items.forEach(item => {
            const card = createCard(item, type);
            container.appendChild(card);
        });
    } catch (err) {
        console.error(`Error loading ${type}:`, err);
    }
}

// ==========================
// INIT
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    renderHero();
    renderSection('tours-container', 'data/tours.json', 'tours');
    renderSection('places-container', 'data/places.json', 'places');
    renderSection('activities-container', 'data/activities.json', 'activities');
    renderSection('guides-container', 'data/guides.json', 'guides');
});
