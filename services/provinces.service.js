import { MongoClient } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')
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