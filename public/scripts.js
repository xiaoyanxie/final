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
          card.className = 'itinerary-card';
          card.innerHTML = `
            <h3>${itinerary.name}</h3>
            <p>Created at: ${new Date(itinerary.created_at).toLocaleDateString()}</p>
            <button onclick="showDetails('${itinerary._id}')">View Details</button>
        `;
    container.appendChild(card);
      });
  } catch (error) {
      console.error('Fetch error:', error.message);
  }
}


async function showDetails(itineraryId) {
  alert('Show details for itinerary ID: ' + itineraryId);
}

loadItineraries();
