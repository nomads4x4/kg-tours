// Пример для tours
fetch('data/tours.json')
  .then(res => res.json())
  .then(tours => {
    const container = document.getElementById('tours-carousel');
    tours.forEach(tour => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="images/tours/${tour.image}" alt="${tour.name}">
        <div class="description">
          <h3>${tour.name}</h3>
          <p>${tour.shortDesc}</p>
        </div>
      `;
      card.onclick = () => window.location.href = `item.html?type=tours&id=${tour.id}`;
      container.appendChild(card);
    });
  });
