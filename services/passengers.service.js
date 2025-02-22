import { MongoClient, ObjectId } from 'mongodb'
import * as reviewService from './reviews.service.js'
import * as tripService from './trips.service.js'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const db = client.db('DB_TB')
const passengers = db.collection('passengersProfile')

//Comentado el 08/09 para guardar el email también en el perfil
/*async function createProfile(userId, profileData)
{
    const newProfile = {
        _id: userId,
        ...profileData
    }
    await client.connect()

    const existingProfile = await passengers.findOne({ _id: userId })
    if(existingProfile){
        throw new Error('Ya existe un perfil registrado para este usuario.')
    }

    await passengers.insertOne(newProfile)
}*/

async function createProfile(newAccount, profileData)
{
    const newProfile = {
        _id: new ObjectId(newAccount._id),
        email: newAccount.email,
        ...profileData
    }
    await client.connect()

    const existingProfile = await passengers.findOne({ _id: newAccount._id })
    if(existingProfile){
        throw new Error('Ya existe un perfil registrado para este usuario.')
    }

    await passengers.insertOne(newProfile)

    return newProfile._id
}

async function getProfile(id)
{
    await client.connect()

    const profile = await passengers.findOne({ _id: new ObjectId(id) })

    if(!profile){
        throw new Error('Esta cuenta no tiene un perfil asociado.')
    }

    return profile
}

async function uploadAvatar(id, avatar)
{
    const passenger = passengers.findOne({ _id: new ObjectId(id) })

    if(!passenger){
        throw new Error('No existe un perfil para este pasajero.')
    }

    await passengers.updateOne(
        { _id: new ObjectId(id) },
        { $set: { avatar: avatar } }
    )

    //Actualizo también el avatar en las reviews y trips 
    await reviewService.updatePassengerInfo(id, { avatar: avatar })
    await tripService.updatePassengerInfo(id, { avatar: avatar })

    return passenger
}

async function editProfile(id, updateData)
{
    const newData = {...updateData}
    const passenger = passengers.findOne({ _id: new ObjectId(id) })

    if(!passenger){
        throw new Error('No existe un perfil para este pasajero.')
    }

    await passengers.updateOne(
        { _id: new ObjectId(id) },
        { $set: newData }
    )

    //Actualiza la información en las reviews y trips
    if(newData.name || newData.lastanme){
        await reviewService.updatePassengerInfo(id, newData)
        await tripService.updatePassengerInfo(id, newData)
    }

    return passenger
}

async function updateEmail(id, newEmail)
{
    await client.connect()

    const passenger = await passengers.findOne({ _id: new ObjectId(id) })

    if(!passenger){
        throw new Error('No existe un perfil para este pasajero.')
    }

    return passengers.updateOne(
        { _id: new ObjectId(id) },
        { $set: { email: newEmail } }
    )
}

export{
    createProfile,
    getProfile,
    uploadAvatar,
    editProfile,
    updateEmail
}

