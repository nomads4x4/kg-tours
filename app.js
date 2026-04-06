// ==========================
// UTILS
// ==========================
async function fetchJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return await res.json();
}

// ==========================
// HERO
// ==========================
async function renderHero() {
    try {
        const heroData = await fetchJSON('data/hero.json');
        document.getElementById('hero-title').textContent = heroData.title;
        document.getElementById('hero-subtitle').textContent = heroData.subtitle;
        const heroImg = document.querySelector('.hero img');
        if (heroData.image) heroImg.src = heroData.image;
    } catch (err) {
        console.error('Error loading hero:', err);
    }
}

// ==========================
// CARDS RENDER
// ==========================
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => {
        window.location.href = `item.html?type=${type}&id=${item.id}`;
    };

    const img = document.createElement('img');
    img.src = item.images[0]; // главное фото
    img.alt = item.name;
    card.appendChild(img);

    const content = document.createElement('div');
    content.className = 'card-content';

    const h3 = document.createElement('h3');
    h3.textContent = item.name;
    content.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = item.shortDescription || '';
    content.appendChild(p);

    card.appendChild(content);

    return card;
}

async function renderSection(sectionId, jsonPath, type) {
    try {
        const data = await fetchJSON(jsonPath);
        const container = document.getElementById(sectionId + '-carousel');
        data.forEach(item => {
            const card = createCard(item, type);
            container.appendChild(card);
        });
    } catch (err) {
        console.error(`Error loading ${sectionId}:`, err);
    }
}

// ==========================
// SCROLL TO SECTION (FIX FOR BOTTOM SECTIONS)
// ==========================
function scrollToSection(targetSection) {
    const rect = targetSection.getBoundingClientRect();
    const scrollTop = window.pageYOffset;
    const offsetTop = rect.top + scrollTop;

    const windowHeight = window.innerHeight;
    const sectionHeight = targetSection.offsetHeight;

    // Если секция ниже окна, сдвигаем так, чтобы была вверху
    const top = (sectionHeight < windowHeight) ? offsetTop - (windowHeight - sectionHeight) : offsetTop;

    window.scrollTo({
        top: top,
        behavior: 'smooth'
    });
}

// ==========================
// NAVIGATION
// ==========================
function setupNavScroll() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                scrollToSection(targetSection);
            }
        });
    });
}

// ==========================
// INIT
// ==========================
async function init() {
    await renderHero();
    await renderSection('tours', 'data/tours.json', 'tours');
    await renderSection('places', 'data/places.json', 'places');
    await renderSection('activities', 'data/activities.json', 'activities');
    await renderSection('guides', 'data/guides.json', 'guides');
    setupNavScroll();
}

document.addEventListener('DOMContentLoaded', init);
