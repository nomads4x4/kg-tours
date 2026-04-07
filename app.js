/* =================== Общий JS для kg-tours =================== */

/* ======= Функция рендера карточек ======= */
async function renderSection(sectionId, jsonPath, carouselId) {
    try {
        const res = await fetch(jsonPath);
        const data = await res.json();
        const carousel = document.getElementById(carouselId);
        carousel.innerHTML = ''; // очистка перед рендером

        data.forEach(item => {
            // выберем главное фото для карточки
            const mainPhoto = item.photos.find(p => p.main) || item.photos[0];

            const card = document.createElement('div');
            card.className = 'card';
            card.addEventListener('click', () => {
                window.location.href = `item.html?type=${sectionId}&id=${item.id}`;
            });

            card.innerHTML = `
                <img src="images/${sectionId}/${mainPhoto.filename}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.shortDescription}</p>
                </div>
            `;
            carousel.appendChild(card);
        });
    } catch (err) {
        console.error(`Ошибка загрузки ${jsonPath}:`, err);
    }
}

/* ======= Рендер всех секций ======= */
renderSection('tours', 'data/tours.json', 'tours-carousel');
renderSection('places', 'data/places.json', 'places-carousel');
renderSection('activities', 'data/activities.json', 'activities-carousel');
renderSection('guides', 'data/guides.json', 'guides-carousel');

/* ======= Sticky nav — плавный scroll + позиционирование ======= */
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navHeight = document.querySelector('nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

/* ======= Hero — фон из JSON ======= */
async function loadHero() {
    try {
        const res = await fetch('data/hero.json');
        const heroData = await res.json();
        const heroSection = document.querySelector('.hero');
        heroSection.style.backgroundImage = `url('images/hero/${heroData.background}')`;
        document.getElementById('hero-title').textContent = heroData.title;
        document.getElementById('hero-description').textContent = heroData.description;
    } catch (err) {
        console.error('Ошибка загрузки hero.json:', err);
    }
}
loadHero();

/* ======= Carousel свайп на мобилке (touch) ======= */
function enableSwipe(carouselId) {
    const carousel = document.getElementById(carouselId);
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
    });

    carousel.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // скорость скролла
        carousel.scrollLeft = scrollLeft - walk;
    });

    // touch events
    let startTouchX = 0;
    let scrollStart = 0;
    carousel.addEventListener('touchstart', (e) => {
        startTouchX = e.touches[0].pageX;
        scrollStart = carousel.scrollLeft;
    });
    carousel.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const walk = (touchX - startTouchX) * 2;
        carousel.scrollLeft = scrollStart - walk;
    });
}

['tours-carousel','places-carousel','activities-carousel','guides-carousel'].forEach(enableSwipe);
