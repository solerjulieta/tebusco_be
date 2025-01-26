import { MongoClient, ObjectId } from 'mongodb'
import * as reviewService from './reviews.service.js'
import * as driversVehiclesService from './driversVehicles.service.js'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const db = client.db('DB_TB')
const drivers = db.collection('driversProfile')
const projection = { authorization: 0, dni: 0 }

async function getAll(filter)
{
    await client.connect()

    const filterMongo = {}
    
    if(filter?.affiliation){
        const affiliations = filter.affiliation.split(';')
        filterMongo.affiliations = {
            $in: affiliations.map(aff => new RegExp(aff, 'i'))
        }
    }

    if(filter?.name){
        filterMongo.name = { $regex: filter.name, $options: 'i' }
    }

    const driversList = await drivers.find(filterMongo, { projection }).toArray() 

    const driverIds = driversList.map(driver => driver._id.toString())

    const reviewsById = await reviewService.getReviewsByDriverIds(driverIds)

    driversList.forEach(driver => {
        driver.reviews = reviewsById[driver._id.toString()] || []

        const totalRanking = driver.reviews.reduce((sum, review) => sum + review.ranking, 0)
        driver.averageRanking = driver.reviews.length > 0 ? totalRanking / driver.reviews.length : 0
    })

    driversList.sort((a, b) => b.averageRanking - a.averageRanking)

    return driversList
}

async function getById(id)
{
    await client.connect()
    return drivers.findOne({ _id: new ObjectId(id) })
}

async function getProfile(id)
{
    await client.connect()

    const profile = await drivers.findOne({ _id: new ObjectId(id) })

    if(!profile){
        throw new Error('Esta cuenta no tiene un perfil asociado.')
    }

    const vehicle = await driversVehiclesService.getByDriverId(id)

    return {
        ...profile,
        vehicle
    }
}

async function editProfile(id, updateData)
{
    const newData = { ...updateData }
    const driver = drivers.findOne({ _id: new ObjectId(id) })

    if(!driver){
        throw new Error('No existe un perfil para este transportista.')
    }

    return drivers.updateOne(
        { _id: new ObjectId(id) },
        { $set: newData }
    )
}

async function updateEmail(id, newEmail)
{
    await client.connect()

    const driver = await drivers.findOne({ _id: new ObjectId(id) })

    if(!driver){
        throw new Error('No existe un perfil para este transportista.')
    }

    return drivers.updateOne(
        { _id: new ObjectId(id) },
        { $set: { email: newEmail } }
    )
}

async function getPublicDriverById(id)
{
    await client.connect()
    const profile = await drivers.findOne({ _id: new ObjectId(id) }, { projection })

    if(!profile){
        throw new Error('Esta cuenta no tiene un perfil asociado.')
    }

    const vehicle = await driversVehiclesService.getByDriverId(id)

    return {
        ...profile,
        vehicle
    }
}

async function createProfile(newAccount, profileData)
{
    const newProfile = {
        _id: new ObjectId(newAccount._id),
        email: newAccount.email,
        ...profileData
    }

    await client.connect()

    const existingProfile = await drivers.findOne({ _id: newAccount._id })

    if(existingProfile){
        throw new Error('Ya existe un perfil registrado para este usuario.')
    }

    await drivers.insertOne(newProfile)

    return newProfile._id
}

async function uploadAvatar(id, avatar)
{
    const driver = drivers.findOne({_id: new ObjectId(id)})

    if(!driver){
        throw new Error('No existe un perfil para este conductor.')
    }

    return drivers.updateOne(
        { _id: new ObjectId(id) },
        { $set: { avatar:  avatar} }
    )
}

export{
    getAll,
    getById,
    getProfile,
    editProfile,
    updateEmail,
    getPublicDriverById,
    createProfile,
    uploadAvatar
}