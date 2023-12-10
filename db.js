const mongoose = require("mongoose")
mongoose.set("strictQuery", false)
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@${process.env.DB_CLUSTER}/itinerary?retryWrites=true&w=majority`
const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
    name: String,
    country: String,
    description: String,
    image_url: String
})

const PlacesSchema = new Schema({
    city_id: String,
    name: String,
    location: Object,
    description: String,
    image_url: String,
    google_place_id: String
})

const ItinerariesSchema = new Schema({
    name: String,
    cities: Array,
    created_at: Date
})

exports.CitiesModel = mongoose.model("Cities", CitiesSchema);

exports.PlacesModel = mongoose.model("Places", PlacesSchema);

exports.ItinerariesModel = mongoose.model("Itineraries", ItinerariesSchema);

main().catch((err) => console.log(err));

exports.executeTransaction = async function (func) {
    // initialize a session
    const session = await mongoose.startSession();
    //start transaction
    session.startTransaction();
    try {
        const ret = await func();
        await session.commitTransaction();
        await session.endSession();
        return ret;
    } catch (e) {
        await session.abortTransaction();
        await session.endSession();
        throw e;
    }
}

exports.getCollection = function (collectionName) {
    const mongo = mongoose.connection.getClient();
    return mongo.db().collection(collectionName);
}

async function main() {
    console.log(`Connecting to mongodb...`)
    await mongoose.connect(mongoDB);
    console.log("Connecting to mongodb succeed!")
}
