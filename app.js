const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb'); 
const path = require('path'); 

const app = express();
const port = process.env.PORT || 3001;
const uri = ""; //Add DB URI Here 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db();
  } catch (error) {
    console.error('Could not connect to MongoDB:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create-itinerary', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-itinerary.html'));
});

app.get('/my-itineraries', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page_itinerary.html'));
});

app.get('/api/cities', async (req, res) => {
    const db = await connectDB();
    const citiesCollection = db.collection('cities');
    
    try {
        const cities = await citiesCollection.find({}).toArray();
        res.json(cities); 
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Error fetching cities' });
    }
});

app.get('/api/itineraries', async (req, res) => {
    const db = await connectDB();
    const itinerariesCollection = db.collection('itineraries');
    const itineraries = await itinerariesCollection.find({}).toArray();
    res.json(itineraries);
});

app.get('/explore', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'explore.html'));
});

async function fetchPlacesFromGoogle(query) {
    const apiKey = GOOGLE_API_KEY; 
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}

app.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const places = await fetchPlacesFromGoogle(query);
        res.json(places);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/create-itinerary', async (req, res) => {
    const db = await connectDB();
    const itinerariesCollection = db.collection('itineraries');

    try {
        const cities = req.body.cities ? req.body.cities.map(city => ({
            city_id: city.city_id, 
            arrival_date: new Date(city.arrival_date),
            departure_date: new Date(city.departure_date),
            places: city.places ? city.places.map(place => ({
                place_id: place.place_id, 
                day: parseInt(place.day),
                time: place.time
            })) : []
        })) : [];

        const itineraryData = {
            name: req.body.itineraryName,
            cities: cities,
            created_at: new Date()
        };

        const result = await itinerariesCollection.insertOne(itineraryData);
        console.log(`Inserted itinerary with _id: ${result.insertedId}`);
        res.redirect('/my-itineraries');
    } catch (error) {
        console.error('Error inserting itinerary', error);
        res.status(500).json({ error: 'Error creating itinerary' });
    }
});

app.post('/:itineraryId/addPlace', async (req, res) => {
    try {
        const itineraryId = req.params.itineraryId;
        const placeData = req.body;

        const updatedData = await db.collection('itineraries').updateOne(
            { _id: ObjectId(itineraryId) },
            { $push: { places: placeData } }
        );

        res.json({ message: 'Place added to itinerary', data: updatedData });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
