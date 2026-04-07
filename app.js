// --- Utility для загрузки JSON ---
async function fetchData(file) {
    const response = await fetch(`data/${file}`);
    return await response.json();
}

// --- Генерация карточки ---
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    const imgSrc = item.mainPhoto ? `images/${type}/${item.mainPhoto}` : '';
    card.innerHTML = `
        <img src="${imgSrc}" alt="${item.name}">
        <div class="card-body">
            <h3>${item.name}</h3>
            <p>${item.shortDescription || ''}</p>
        </div>
    `;
    card.addEventListener('click', () => {
        window.location.href = `item.html?type=${type}&id=${item.id}`;
    });
    return card;
}

// --- Render секции ---
async function renderSection(jsonFile, carouselId, type) {
    const data = await fetchData(jsonFile);
    const carousel = document.getElementById(carouselId);
    data.forEach(item => {
        const card = createCard(item, type);
        carousel.appendChild(card);
    });
}

// --- Карусели и кнопки ---
function enableCarousel(carouselId) {
    const carousel = document.getElementById(carouselId);
    let isDown = false, startX, scrollLeft;

    // Для десктоп drag
    carousel.addEventListener('mousedown', e => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => isDown = false);
    carousel.addEventListener('mouseup', () => isDown = false);
    carousel.addEventListener('mousemove', e => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // скорость скролла
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Optional: add prev/next buttons for desktop (можно потом)
}

// --- Инициализация ---
async function init() {
    await renderSection('tours.json', 'tours-carousel', 'tours');
    await renderSection('places.json', 'places-carousel', 'places');
    await renderSection('activities.json', 'activities-carousel', 'activities');
    await renderSection('guides.json', 'guides-carousel', 'guides');

    ['tours-carousel','places-carousel','activities-carousel','guides-carousel'].forEach(enableCarousel);
}

// --- Run ---
init();
