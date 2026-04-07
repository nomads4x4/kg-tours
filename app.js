// ================================
// LOAD HERO DATA
// ================================

async function loadHero() {
    try {
        const response = await fetch('data/hero.json');
        const hero = await response.json();

        // title
        document.getElementById('hero-title').textContent = hero.title;

        // description
        document.getElementById('hero-description').textContent = hero.description;

        // background image
        const heroElement = document.getElementById('hero');
        heroElement.style.backgroundImage = `url(images/hero/${hero.image})`;

    } catch (error) {
        console.error('Error loading hero:', error);
    }
}

// ================================
// INIT
// ================================

document.addEventListener('DOMContentLoaded', () => {
    loadHero();
});
