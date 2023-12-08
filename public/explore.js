async function showPlaces(cityId) {
    console.log("explore.js loaded");
    const placesResponse = await fetch(`/api/places/${cityId}`);
    console.log(placesResponse)
    const places = await placesResponse.json();
    const itinerariesResponse = await fetch('/api/itineraries');
    const itineraries = await itinerariesResponse.json();

    const placesContainer = document.getElementById('placesContainer');
    placesContainer.innerHTML = '';

    places.forEach(place => {
        const placeDiv = document.createElement('div');
        placeDiv.innerHTML = `<h4>${place.name}</h4><p>${place.description}</p>`;

        const select = document.createElement('select');
        itineraries.forEach(itinerary => {
            const option = document.createElement('option');
            option.value = itinerary._id;
            option.textContent = itinerary.name;
            select.appendChild(option);
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Itinerary';
        addButton.onclick = () => addPlaceToItinerary(select.value, place._id);

        placeDiv.appendChild(select);
        placeDiv.appendChild(addButton);
        placesContainer.appendChild(placeDiv);
    });
}

async function addPlaceToItinerary(itineraryId, placeId) {
    const response = await fetch(`/api/itineraries/${itineraryId}/addPlace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: placeId })
    });
    if (response.ok) {
        alert('Place added to itinerary!');
    } else {
        alert('Failed to add place to itinerary.');
    }
}

async function searchCities() {
    const citySearchValue = document.getElementById('citySearch').value;

    const response = await fetch(`/api/cities?name=${citySearchValue}`);
    const cities = await response.json();

    const citiesContainer = document.getElementById('citiesContainer');
    citiesContainer.innerHTML = '';

    cities.forEach(city => {
        const cityDiv = document.createElement('div');
        cityDiv.innerHTML = `
            <h3>${city.name}</h3>
            <button onclick="showPlaces('${city._id}')">Show Attractions</button>
        `;
        citiesContainer.appendChild(cityDiv);
    });
}
