import { MongoClient, ObjectId } from 'mongodb'
import fs from 'fs'

const client = new MongoClient('mongodb://127.0.0.1:27017')

async function importDB(collectionName) {
    try {
        await client.connect();
        const db = client.db('soler_julieta');
        const collection = db.collection(collectionName);
        const data = JSON.parse(fs.readFileSync(`./data/${collectionName}.json`, 'utf8'));

        data.forEach(item => {
            if (item._id && item._id.$oid) {
                item._id = new ObjectId(item._id.$oid);
            }
        });

        await collection.insertMany(data, { ordered: false });
        console.log(`Datos importados en la colección: ${collectionName}`);
    } catch (error) {
        console.error(`Error al importar datos en la colección ${collectionName}:`, error);
    } finally {
        await client.close();
    }
}

await importDB('affiliations')
await importDB('cities')
await importDB('provinces')
await importDB('driverReviews')
await importDB('driversProfile')
await importDB('passengersProfile')
await importDB('users')