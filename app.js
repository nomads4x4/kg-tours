// =============================
// UTILS
// =============================
async function fetchJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

function createCard(item, type) {
  const card = document.createElement("div");
  card.className = "card";

  // фото специально для главной страницы
  const imgSrc = item.mainImage; // mainImage в JSON
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = item.name;
  card.appendChild(img);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = item.name;
  body.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "card-text";
  desc.textContent = item.shortDescription || "";
  body.appendChild(desc);

  card.appendChild(body);

  card.addEventListener("click", () => {
    window.location.href = `item.html?type=${type}&id=${item.id}`;
  });

  return card;
}

// =============================
// HERO
// =============================
async function renderHero() {
  const heroData = await fetchJSON("data/hero.json");
  const heroTitle = document.getElementById("hero-title");
  const heroDesc = document.getElementById("hero-description");
  heroTitle.textContent = heroData.title || "Tours in Kyrgyzstan";
  heroDesc.textContent = heroData.description || "";
  const heroSection = document.getElementById("hero");
  if(heroData.image) {
    heroSection.style.background = `url('${heroData.image}') center/cover no-repeat`;
  }
}

// =============================
// CAROUSELS
// =============================
async function renderCarousel(jsonPath, containerId, type) {
  const data = await fetchJSON(jsonPath);
  const container = document.getElementById(containerId);
  data.forEach(item => {
    // проверяем, что mainImage есть
    if(item.mainImage) {
      const card = createCard(item, type);
      container.appendChild(card);
    }
  });
}

// =============================
// INIT
// =============================
async function init() {
  await renderHero();

  await renderCarousel("data/tours.json", "tours-carousel", "tour");
  await renderCarousel("data/places.json", "places-carousel", "place");
  await renderCarousel("data/activities.json", "activities-carousel", "activity");
  await renderCarousel("data/guides.json", "guides-carousel", "guide");
}

// запускаем
init();
