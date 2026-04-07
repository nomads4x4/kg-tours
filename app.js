async function loadJSON(path) {
    const response = await fetch(path);
    return await response.json();
}

function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <img src="${item.mainImage}" alt="${item.title}">
        <div class="card-body">
            <h3>${item.title}</h3>
            <p>${item.short}</p>
        </div>
    `;

    card.addEventListener('click', () => {
        window.location.href = `item.html?type=${type}&id=${item.id}`;
    });

    return card;
}

async function renderSection(path, containerId, type) {
    const data = await loadJSON(path);
    const container = document.getElementById(containerId);

    data.forEach(item => {
        container.appendChild(createCard(item, type));
    });
}

async function loadHero() {
    const data = await loadJSON('data/hero.json');

    document.getElementById('hero-title').textContent = data.title;
    document.getElementById('hero-subtitle').textContent = data.subtitle;

    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `url(${data.image})`;
}

document.addEventListener('DOMContentLoaded', async () => {

    await loadHero();

    await renderSection(
        'data/tours.json',
        'tours-carousel',
        'tours'
    );

    await renderSection(
        'data/places.json',
        'places-carousel',
        'places'
    );

    await renderSection(
        'data/activities.json',
        'activities-carousel',
        'activities'
    );

    await renderSection(
        'data/guides.json',
        'guides-carousel',
        'guides'
    );

});
