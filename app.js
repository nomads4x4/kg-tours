async function loadHero() {
    const response = await fetch('data/hero.json');
    const data = await response.json();

    document.getElementById('hero-title').textContent = data.title;
    document.getElementById('hero-subtitle').textContent = data.subtitle;

    const hero = document.getElementById('hero');
    hero.style.backgroundImage = `url(${data.image})`;
}

document.addEventListener('DOMContentLoaded', () => {
    loadHero();
});
