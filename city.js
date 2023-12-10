const db = require("./db")

exports.getAll = async function() {
    const cities = await db.CitiesModel.find().exec()

    const viewCities = []

    for (let i = 0; i < cities.length; i++){
        console.log(`City: ${cities[i]}`)
        const attractionPlace = await db.PlacesModel.findOne({city_id: cities[i]._id}).exec()
        viewCities.push({
            _id: cities[i]._id,
            image: cities[i].image_url,
            name: cities[i].name,
            desc: cities[i].description,
            attraction: attractionPlace.name
        })
    }
    return viewCities;
}

exports.getPlacesByCityId = async function(cityId) {
    const places = await db.PlacesModel.find({city_id: cityId}).exec()
    const viewPlaces = []

    for (let i = 0; i < places.length; i++){
        console.log(`Place: ${places[i]}`)
        viewPlaces.push({
            _id: places[i]._id,
            city_id: cityId,
            name: places[i].name,
            location: places[i].location,
            desc: places[i].description,
            image: places[i].image_url,
            google_place_id: places[i].google_place_id
        })
    }
    return viewPlaces;
}
