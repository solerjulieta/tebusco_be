import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const db = client.db('DB_TB')
const provinces = db.collection('provinces')

async function getAll()
{
    await client.connect()
    return provinces.find().toArray()
}

export{
    getAll
}