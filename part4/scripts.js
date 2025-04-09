document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:5000/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/`;
          window.location.href = 'index.html';
        } else {
          const errorData = await response.json();
          alert('Erreur de connexion : ' + (errorData.error || response.statusText));
        }
      } catch (error) {
        alert('Une erreur est survenue : ' + error.message);
      }
    });
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (loginLink) {
      if (token) {
        loginLink.style.display = 'none';
        fetchPlaces(token);
      }
    }
  }

  async function fetchPlaces(token) {
    try {
      const response = await fetch('http://localhost:5000/api/v1/places/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📍 Places:', data);
        displayPlaces(data);
      } else {
        console.error('❌ Failed to fetch places. Status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error while fetching places:', error);
    }
  }

  checkAuthentication();
  setupPriceFilter();

  function displayPlaces(places) {
    const container = document.getElementById('places-list');
    container.innerHTML = '';

    places.forEach(place => {
      const card = document.createElement('div');
      card.className = 'place-card';
      card.setAttribute('data-price', place.price);

      card.innerHTML = `
        <h2>${place.title}</h2>
        <p>${place.description}</p>
        <p><strong>Price:</strong> $${place.price}</p>
        <p><strong>Location:</strong> (${place.latitude}, ${place.longitude})</p>
        <button class="details-button">View Details</button>
      `;

      container.appendChild(card);
    });
  }

  function setupPriceFilter() {
    const filter = document.getElementById('price-filter');
    if (!filter) return;

    filter.addEventListener('change', () => {
      const maxPrice = filter.value;
      const cards = document.querySelectorAll('.place-card');

      cards.forEach(card => {
        const price = parseFloat(card.getAttribute('data-price'));
        if (maxPrice === 'all' || price <= parseFloat(maxPrice)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }


});
