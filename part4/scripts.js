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

        if (window.location.pathname.includes('index.html')) {
          fetchPlaces(token);
        }
      }
    }

    if (window.location.pathname.includes('place.html')) {
      const placeId = getPlaceIdFromURL();
      if (placeId) {
        fetchPlaceDetails(token, placeId);
      }

      const reviewSection = document.getElementById('add-review');
      if (reviewSection) {
        if (token) {
          reviewSection.style.display = 'block';
        } else {
          reviewSection.style.display = 'none';
        }
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
        <a href="place.html?id=${place.id}">
          <button class="details-button">View Details</button>
        </a>      `;

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

  function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async function fetchPlaceDetails(token, placeId) {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/places/${placeId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        const place = await response.json();
        console.log('📍 Details:', place);
        displayPlaceDetails(place);
      } else {
        console.error(`❌ Failed to fetch place details: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error while fetching place details:', error);
    }
  }

  function displayPlaceDetails(place) {
    const container = document.getElementById('place-details');
    container.innerHTML = '';

    const title = document.createElement('h1');
    title.textContent = place.title;

    const info = document.createElement('div');
    info.innerHTML = `
      <p><strong>Host:</strong> ${place.owner.first_name} ${place.owner.last_name}</p>
      <p><strong>Price per night:</strong> $${place.price}</p>
      <p><strong>Description:</strong> ${place.description}</p>
      <p><strong>Amenities:</strong> ${place.amenities.map(a => a.name).join(', ')}</p>
    `;

    container.appendChild(title);
    container.appendChild(info);

    // Inject reviews
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection && place.reviews && place.reviews.length > 0) {
      reviewsSection.innerHTML = '<h2>Reviews</h2>';

      place.reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
          <p><strong>${review.user.first_name} ${review.user.last_name}:</strong></p>
          <p>${review.text}</p>
          <p>Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
        `;
        reviewsSection.appendChild(reviewCard);
      });
    }
  }

  // Review form submission
  const reviewForm = document.getElementById('review-form');
  const token = getCookie('token');
  const placeId = getPlaceIdFromURL();

  if (reviewForm && token && placeId) {
    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const text = document.getElementById('review-text').value.trim();
      const rating = parseInt(document.getElementById('review-rating').value);

      try {
        const response = await fetch(`http://localhost:5000/api/v1/reviews/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            text,
            rating,
            place_id: placeId
          })
        });

        if (response.ok) {
          alert("✅ Review submitted!");
          reviewForm.reset();
        } else {
          const err = await response.json();
          alert("❌ Error: " + (err.error || "Failed to submit review"));
        }
      } catch (error) {
        alert("❌ Network error: " + error.message);
      }
    });
  }

});
