// =========================
// Общая логика для index.html
// =========================

// Список секций и соответствующих JSON файлов
const sections = [
  { id: 'tours', json: 'data/tours.json', imgFolder: 'tours' },
  { id: 'places', json: 'data/places.json', imgFolder: 'places' },
  { id: 'activities', json: 'data/activities.json', imgFolder: 'activities' },
  { id: 'guides', json: 'data/guides.json', imgFolder: 'guides' },
];

// Функция для подгрузки JSON и рендера карточек
async function loadSection(section) {
  try {
    const res = await fetch(section.json);
    const data = await res.json();
    renderCards(data, section.id + '-carousel', section.imgFolder, section.id);
  } catch (err) {
    console.error(`Ошибка загрузки ${section.json}:`, err);
  }
}

// Рендер карточек в контейнер
function renderCards(items, containerId, imgFolder, type) {
  const container = document.getElementById(containerId);

  items.forEach(item => {
    // На главной странице используем только фото, отмеченное как main
    const mainPhoto = item.mainPhoto || item.photos[0];

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <img src="images/${imgFolder}/${mainPhoto}" alt="${item.name}">
      <div class="card-info">
        <h3>${item.name}</h3>
        <p>${item.shortDescription}</p>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `item.html?type=${type}&id=${item.id}`;
    });

    container.appendChild(card);
  });

  // Добавляем кнопки карусели на десктопе
  addCarouselControls(containerId);
}

// =========================
// Горизонтальная карусель
// =========================
function addCarouselControls(containerId) {
  const container = document.getElementById(containerId);

  // Создаем кнопки
  const btnPrev = document.createElement('button');
  btnPrev.innerHTML = '&#8592;';
  btnPrev.classList.add('carousel-btn', 'prev-btn');

  const btnNext = document.createElement('button');
  btnNext.innerHTML = '&#8594;';
  btnNext.classList.add('carousel-btn', 'next-btn');

  // Стили кнопок через JS
  [btnPrev, btnNext].forEach(btn => {
    btn.style.position = 'absolute';
    btn.style.top = '50%';
    btn.style.transform = 'translateY(-50%)';
    btn.style.background = 'rgba(93, 173, 226, 0.8)';
    btn.style.border = 'none';
    btn.style.color = 'white';
    btn.style.fontSize = '1.5rem';
    btn.style.cursor = 'pointer';
    btn.style.padding = '0.3rem 0.8rem';
    btn.style.borderRadius = '50%';
    btn.style.zIndex = 10;
  });

  btnPrev.style.left = '5px';
  btnNext.style.right = '5px';

  // Навешиваем события
  btnPrev.addEventListener('click', () => {
    container.scrollBy({ left: -container.offsetWidth * 0.8, behavior: 'smooth' });
  });
  btnNext.addEventListener('click', () => {
    container.scrollBy({ left: container.offsetWidth * 0.8, behavior: 'smooth' });
  });

  // Позиционируем контейнер относительно для кнопок
  container.style.position = 'relative';
  container.appendChild(btnPrev);
  container.appendChild(btnNext);
}

// =========================
// Инициализация всех секций
// =========================
sections.forEach(loadSection);

// =========================
// Дополнительно: плавный скролл для sticky nav (уже есть в index.html)
// =========================
