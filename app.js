// ================================
// CONFIG
// ================================

const DATA_PATH = "data/";
const IMAGE_PATH = "images/";

// ================================
// LOAD JSON
// ================================

async function loadJSON(file) {
    const response = await fetch(DATA_PATH + file);
    return await response.json();
}

// ================================
// HERO
// ================================

async function renderHero() {
    const hero = await loadJSON("hero.json");

    const title = document.getElementById("hero-title");
    const subtitle = document.getElementById("hero-subtitle");
    const image = document.getElementById("hero-image");

    if (!title) return;

    title.textContent = hero.title;
    subtitle.textContent = hero.subtitle;
    image.src = IMAGE_PATH + "hero/" + hero.image;
}

// ================================
// CARD TEMPLATE
// ================================

function createCard(item, type) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `item.html?type=${type}&id=${item.id}`;

    card.innerHTML = `
        <img src="${IMAGE_PATH}${type}/${item.cover}" alt="">
        <div class="card-content">
            <div class="card-title">${item.title}</div>
            <div class="card-desc">${item.short}</div>
        </div>
    `;

    return card;
}

// ================================
// CAROUSEL RENDER
// ================================

async function renderCarousel(type, file, containerId) {
    const data = await loadJSON(file);
    const container = document.getElementById(containerId);

    if (!container) return;

    data.forEach(item => {
        const card = createCard(item, type);
        container.appendChild(card);
    });
}

// ================================
// INDEX PAGE INIT
// ================================

async function initIndex() {
    await renderHero();

    await renderCarousel("tours", "tours.json", "tours-carousel");
    await renderCarousel("places", "places.json", "places-carousel");
    await renderCarousel("activities", "activities.json", "activities-carousel");
    await renderCarousel("guides", "guides.json", "guides-carousel");
}

// ================================
// ITEM PAGE
// ================================

function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        type: params.get("type"),
        id: params.get("id")
    };
}

async function renderItemPage() {
    const { type, id } = getParams();
    if (!type || !id) return;

    const data = await loadJSON(type + ".json");
    const item = data.find(i => i.id == id);
    if (!item) return;

    const title = document.getElementById("item-title");
    const desc = document.getElementById("item-desc");
    const info = document.getElementById("item-info");
    const carousel = document.getElementById("item-carousel");

    if (!title) return;

    title.textContent = `${type} / ${item.title}`;
    desc.textContent = item.description;

    if (info) {
        info.innerHTML = `
            <div>Duration: ${item.days || "-"}</div>
            <div>Price: ${item.price || "-"}</div>
        `;
    }

    if (carousel && item.images) {
        item.images.forEach(img => {
            const image = document.createElement("img");
            image.src = `${IMAGE_PATH}${type}/${img}`;
            carousel.appendChild(image);
        });
    }
}

// ================================
// INIT
// ================================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("tours-carousel")) {
        initIndex();
    }

    if (document.getElementById("item-title")) {
        renderItemPage();
    }

});
