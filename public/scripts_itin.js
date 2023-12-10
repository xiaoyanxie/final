



const baseApiUrl = "https://tripplanner-j6oq.onrender.com/city/all";
// // const placeApiUrl = "https://tripplanner-j6oq.onrender.com/city/place?cityId=65714d915061ce501bbad3b7"

// // cardLink.href = 'https://tripplanner-j6oq.onrender.com/places.html?city=' + encodeURIComponent(itinerary.name);

async function fetchItinerariesData() {
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
    var cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    var cardLink = document.createElement('a');
    cardLink.href = 'https://tripplanner-j6oq.onrender.com/places.html?city=' + encodeURIComponent(itinerary.name);
    cardLink.className = 'card-link';

    var card = document.createElement('div');
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

function renderItineraries(data) {
    var itinerariesContainer = document.getElementById('itineraries');
    data.forEach(function(itinerary) {
        itinerariesContainer.appendChild(createCard(itinerary));
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const fetchedData = await fetchItinerariesData();

    if (fetchedData.length > 0) {
        renderItineraries(fetchedData);
    } else {
        console.log('No itineraries available');
    }

    // Add event listener to the form
    document.getElementById('cityForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const cityName = document.getElementById('cityInput').value;
        localStorage.setItem('cityName', cityName);

        const cities = await fetchItinerariesData();
        if (cities.map(city => city.name).includes(cityName)) {
            // Redirect to the itinerary page if city exists in the database
            window.location.href = 'itineraryPage.html';
        } else {
            // Redirect to the explore page and append the city to the end of the URL
            window.location.href = 'explorePage.html?city=' + encodeURIComponent(cityName);
        }
    });

    var activeLink = document.getElementById('page2Link');
    if (activeLink) {
        activeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.reload(true);
        });
    }
});
