import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')
const db = client.db('DB_TB')
const cities = db.collection('cities')

async function getAll()
{
    await client.connect()
    return cities.find().toArray()
}

export{
    getAll
}