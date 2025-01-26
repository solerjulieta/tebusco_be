import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const db = client.db('DB_TB')
const affiliations = db.collection('affiliations')

async function getAll()
{
    await client.connect()
    return affiliations.find().sort({ name: 1 }).toArray()
}

export{
    getAll
}