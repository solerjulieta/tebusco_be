import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017')
const db = client.db('DB_TB')
const vehicles = db.collection('vehicles')

async function getAll()
{
    await client.connect()
    return vehicles.find().sort({ name: 1 }).toArray()
}

export{
    getAll
}