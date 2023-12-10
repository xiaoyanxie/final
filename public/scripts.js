async function loadItineraries() {
  try {
      const response = await fetch('/api/itineraries');
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const itineraries = await response.json();
      console.log('Itineraries:', itineraries);

      const container = document.getElementById('itinerariesContainer');
      console.log('Container:', container);

      itineraries.forEach(itinerary => {
          console.log('Processing itinerary:', itinerary);
          const card = document.createElement('div');
          card.id = itinerary._id;
          card.className = 'itinerary-card';
          card.innerHTML = `
            <h3>${itinerary.name}</h3>
            <p>Created at: ${new Date(itinerary.created_at).toLocaleDateString()}</p>
            <button onclick="showDetails('${card.id}')">Show Details</button>
        `;
    container.appendChild(card);
      });
  } catch (error) {
      console.error('Fetch error:', error.message);
  }
}


async function showDetails(itineraryId) {
    try {
        const response = await fetch(`/api/itineraries?id=${itineraryId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const itinerary = await response.json();
        console.log('Itinerary:', itinerary)
        const citiesAndPlacesStr = itinerary.cities.map(city => {
            const cityStr = `City: ${city.city_id}\nArrival: ${new Date(city.arrival_date).toLocaleDateString()}\nDeparture: ${new Date(city.departure_date).toLocaleDateString()}`;
            const placesStr = city.places.map(place => `Place: ${place.place_id}\nDay: ${place.day}\nTime: ${place.time}`).join('\n\n');
            return `${cityStr}\n\n${placesStr}`;
        }).join('\n\n');
        // alert(`Details for itinerary ID: ${itineraryId}\nName: ${itinerary.name}\nCreated at: ${new Date(itinerary.created_at).toLocaleDateString()}`);
        alert(`Details for itinerary ID: ${itineraryId}\nName: ${itinerary.name}\nCreated at: ${new Date(itinerary.created_at).toLocaleDateString()}\n\n${citiesAndPlacesStr}`);
    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

loadItineraries();
