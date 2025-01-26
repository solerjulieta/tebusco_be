import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const db = client.db('DB_TB')
const driversVehicles = db.collection('driversVehicles')
const drivers = db.collection('driversProfile')

async function checkDriverIfHasVehicle(driverId)
{
    const vehicle = await driversVehicles.findOne({ drivers: new ObjectId(driverId) })
    if(vehicle){
        throw new Error("Ya tenés un vehículo asignado.")
    }
}

async function create(driverId, vehicleData)
{
    await client.connect()

    await checkDriverIfHasVehicle(driverId)

    const newVehicle = {
        ...vehicleData,
        drivers: [ new ObjectId(driverId) ]
    }

    return await driversVehicles.insertOne(newVehicle)
}

async function updateAccessData(driverId, accessData, licensePlate)
{
    await client.connect()

    console.log("driver id", driverId)

    const newAccessData = {
        ...accessData
    }

    return await driversVehicles.updateOne(
        { licensePlate: licensePlate },
        { $set: accessData }, 
        { $addToSet: { drivers: new ObjectId(driverId) } }
    )
}

/*
async function getById(id)
{
    await client.connect()
    return driversVehicles.findOne({ _id: new ObjectId(id) })
}*/

async function getByLicensePlate(licensePlate)
{
    await client.connect()
    const license = licensePlate
    return driversVehicles.findOne({ licensePlate: license })
}

async function getByDriverId(id)
{
    await client.connect()

    //const vehicle = driversVehicles.find({ drivers: new ObjectId(id) }).toArray()
    const vehicle = driversVehicles.findOne({ drivers: new ObjectId(id) })

    return vehicle
}

async function addDriverId(driverId, licensePlate)
{
    //Verifico si el transportista está asociado a otro vehículo.
    await checkDriverIfHasVehicle(driverId)

    const vehicle = await driversVehicles.findOne({ licensePlate: licensePlate })
    if(!vehicle){
        throw new Error("Vehículo no encontrado.");
    }

    if(!vehicle.drivers.includes(driverId)){
        return await driversVehicles.updateOne(
            { licensePlate },
            { $push: { drivers: new ObjectId(driverId) } }
        )
    }

}

async function deleteVehicle(driverId)
{
    //Obtengo el vehículo
    const vehicle = await driversVehicles.findOne({ drivers: new ObjectId(driverId) })

    if(!vehicle){
        throw new Error("No se ha encontrado un vehículo.")
    }

    if(vehicle.drivers.length > 1){
        //Si hay más de un transportista, elimino solo ID.
        return await driversVehicles.updateOne(
            { _id: vehicle._id },
            { $pull: { drivers: new ObjectId(driverId) } }
        )

        /*const profile = await drivers.getProfile(driverId)

        return {
            profile
        }*/
    } else {
        //Si es el único, elimino el vehículo.
        return await driversVehicles.deleteOne({ _id: new ObjectId(vehicle._id) })
    }
}

export{
    create,
    updateAccessData,
    getByLicensePlate,
    getByDriverId,
    checkDriverIfHasVehicle,
    addDriverId,
    deleteVehicle
    //getById
}