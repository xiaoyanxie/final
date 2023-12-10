



const baseApiUrl = "/city/all";
// // const placeApiUrl = "https://tripplanner-j6oq.onrender.com/city/place?cityId=65714d915061ce501bbad3b7"

// // cardLink.href = 'https://tripplanner-j6oq.onrender.com/places.html?city=' + encodeURIComponent(itinerary.name);

async function getAllCities() {
    try {
        const response = await fetch(baseApiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch itineraries:", error);
        return [];
    }
}

function createCard(itinerary) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const cardLink = document.createElement('a');
    cardLink.href = 'google_map.html?city=' + encodeURIComponent(itinerary.name);
    cardLink.className = 'card-link';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <div class="card-content-container">
                    <h2>${itinerary.name}</h2>
                    <img src="${itinerary.image}" alt="${itinerary.name}" style="height: 200px;">
                </div>
            </div>
            <div class="card-back">
                <div class="card-content-container">
                    <p>${itinerary.desc}</p>
                </div>
            </div>
        </div>
    `;

    cardLink.appendChild(card);
    cardContainer.appendChild(cardLink);
    return cardContainer;
}

function renderCities(data) {
    const citiesContainer = document.getElementById('cities');
    data.forEach(function(city) {
        citiesContainer.appendChild(createCard(city));
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const allCities = await getAllCities();

    if (allCities.length > 0) {
        renderCities(allCities);
    } else {
        console.log('No itineraries available');
    }

    // Add event listener to the form
    document.getElementById('cityForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const cityName = document.getElementById('cityInput').value;
        console.log(`User entered city name: ${cityName}`);
        localStorage.setItem('cityName', cityName);

        const cities = await getAllCities();
        if (cities.map(city => city.name).includes(cityName)) {
            console.log(`City ${cityName} exists in the database, redirecting to itinerary page`);
            // Redirect to the itinerary page if city exists in the database
            window.location.href = 'itineraryPage.html';
        } else {
            console.log(`City ${cityName} does not exist in the database, redirecting to explore page`);
            // Redirect to the explore page and append the city to the end of the URL
            window.location.href = 'explorePage.html?city=' + encodeURIComponent(cityName);
        }
    });

    const activeLink = document.getElementById('page2Link');
    if (activeLink) {
        activeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.reload(true);
        });
    }
});
