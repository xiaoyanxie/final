const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const db = require("./db")
const mongoose = require("mongoose");
const city = require("./city")

const app = express();
const port = process.env.PORT || 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

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
    const mongo = mongoose.connection.getClient();
    const citiesCollection = db.getCollection('cities');

    try {
        const cities = await citiesCollection.find({}).toArray();
        res.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Error fetching cities' });
    }
});

app.get('/api/itineraries', async (req, res) => {
    const itinerariesCollection = db.getCollection('itineraries');

    const itineraryId = req.query.id;
    if (itineraryId) {
        const objId = new ObjectId(itineraryId)
        const itinerary = await itinerariesCollection.findOne(objId);
        res.json(itinerary);
        return;
    }

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


    const itinerariesCollection = db.getCollection('itineraries');

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

        const updatedData = await db.getCollection('itineraries').updateOne(
            { _id: ObjectId(itineraryId) },
            { $push: { places: placeData } }
        );

        res.json({ message: 'Place added to itinerary', data: updatedData });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/**
 * <pre>
 * [
 *     {
 *         "name": "New York City",            //city
 *         "attraction": "Statue of Liberty", //place
 *         "desc": "Iconic monument in NYC",  //place
 *         "image": "https://example.com/new_york.jpg"//city
 *     },
 *     {
 *         "name": "London",            //city
 *         "attraction": "Buckingham Palace", //place
 *         "desc": "Iconic monument in London",  //place
 *         "image": "https://example.com/new_york.jpg"//city, need to be changed to london pic
 *     }
 * ]
 * </pre>
 */
app.get("/city/all", async function (req, res) {
    try {
        //Get city picture, name of main attraction and description of the city.
        const cities = await city.getAll()
        res.status(200).json(cities).end()
    } catch (e) {
        console.log(e)
        // return 500
        res.status(500)
            .json({ error: e.message })
            .end();
    }
})

/**
 * Get places by city id
 */
app.get("/city/place", async function (req, res) {
    try {
        const places = await city.getPlacesByCityId(req.query.cityId)
        res.status(200).json(places).end()
    } catch (e) {
        console.log(e)
        // return 500
        res.status(500)
            .json({ error: e.message })
            .end();
    }
})

app.get('/api/getKey', (req, res) => {
    if (process.env.GOOGLE_MAPS_API_KEY === undefined) {
        console.error('GOOGLE_MAPS_API_KEY environment variable not set');
        res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY environment variable not set' });
    }
    res.json({ key: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
