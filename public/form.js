function addCity() {
    const citiesContainer = document.getElementById('cities');
    const cityIndex = citiesContainer.children.length; 

    const cityDiv = document.createElement('div');
    cityDiv.className = 'city';

    cityDiv.innerHTML = `
        <input type="text" name="cities[${cityIndex}][city_id]" placeholder="City" required>
        <input type="date" name="cities[${cityIndex}][arrival_date]" placeholder="Arrival Date" required>
        <input type="date" name="cities[${cityIndex}][departure_date]" placeholder="Departure Date" required>

        <div class="places"></div>
        <button type="button" onclick="addPlace(this.parentNode)">Add Place</button>
        <button type="button" onclick="this.parentNode.remove()">Remove City</button>
    `;

    citiesContainer.appendChild(cityDiv);
}

function addPlace(cityDiv) {
    const placesContainer = cityDiv.querySelector('.places');
    const placeIndex = placesContainer.children.length; 
    const cityIndex = Array.prototype.indexOf.call(document.getElementById('cities').children, cityDiv);

    const placeDiv = document.createElement('div');
    placeDiv.className = 'place';

    placeDiv.innerHTML = `
        <input type="text" name="cities[${cityIndex}][places][${placeIndex}][place_id]" placeholder="Place" required>
        <input type="number" name="cities[${cityIndex}][places][${placeIndex}][day]" placeholder="Day" required min="1">
        <input type="time" name="cities[${cityIndex}][places][${placeIndex}][time]" placeholder="Time" required>
        <button type="button" onclick="this.parentNode.remove()">Remove Place</button>
    `;

    placesContainer.appendChild(placeDiv);
}

document.getElementById('itineraryForm').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
}
