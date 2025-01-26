import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
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