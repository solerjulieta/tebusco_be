import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)
const db = client.db('DB_TB')
const trips = db.collection('trips')
const passengers = db.collection('passengersProfile')
const availability = db.collection('availability')
import { DateTime } from 'luxon'

async function getAll()
{
    await client.connect()
    return trips.find({
        $or: [
            { hasTransfer: { $ne: true } }, //si existe, no debe ser true
            { hasTransfer: { $exists: false } } //campo no exista
        ]
    }).toArray()
}

async function createTrip(role, id, tripData)
{
    await client.connect()

    if(role === 'passenger'){
        const passenger = await passengers.findOne({ _id: new ObjectId(id) })
        if(!passenger) throw new Error('Usuario no encontrado.')

        // Corroboro que no haya otro viaje con mismo domicilio.
        const existingTrip = await trips.findOne({
            pickUp: tripData.pickUp,
            destination: tripData.destination,
        })
        if(existingTrip){
            // Si el viaje no tiene un passenger_id, lo actualizo
            if(!existingTrip.passenger_id){
                return await trips.updateOne(
                    { _id: existingTrip._id },
                    {
                        $set: {
                            passenger_id: new ObjectId(id),
                            name: passenger.name,
                            lastname: passenger.lastname,
                            avatar: passenger.avatar
                        }
                    }
                )
            }

            // Si ya tiene un passenger_id, lanzamos un error.
            if(existingTrip.passenger_id.toString() === id){
                throw new Error('Ya existe un viaje registrado con estos domicilios.')
            } else {
                throw new Error('Ya existe un viaje registrado con estos domicilios para otro pasajero.')
            }
        }

        // Creo un nuevo viaje si no existe
        const newTrip = {
            ...tripData,
            passenger_id: new ObjectId(id),
            name: passenger.name,
            lastname: passenger.lastname,
            avatar: passenger.avatar
        }

        await trips.insertOne(newTrip)
        return newTrip
    } else if (role === 'driver'){
        // Verifico si ya existe un viaje con esos domicilios.
        const existingTrip = await trips.findOne({
            pickUp: tripData.pickUp,
            destination: tripData.destination
        })

        if(existingTrip){
            // Si el viaje no tiene un passenger_id, lo actualizo
            if(!existingTrip.driver_id){
                return await trips.updateOne(
                    { _id: existingTrip._id },
                    {
                        $set: {
                            driver_id: new ObjectId(id),
                            hasTransfer: true
                        }
                    }
                )
            }

            // Si ya tiene un passenger_id, lanzamos un error.
            if(existingTrip.driver_id.toString() === id){
                throw new Error('Ya tienes este viaje asignado.')
            } else {
                throw new Error('Este viaje está asignado a otro transportista.')
            }
        }

        // Creo un nuevo viaje si no existe
        const newTrip = {
            ...tripData,
            driver_id: new ObjectId(id),
            hasTransfer: true
        }

        return await trips.insertOne(newTrip)
    }
}

async function getByPassengerId(id)
{
    await client.connect()

    const trip = await trips.findOne({ passenger_id: new ObjectId(id) })

    if(!trip){
        throw new Error('Este usuario no tiene un viaje generado.')
    }

    return trip
}

async function getByAddress(pickUp, destination)
{
    await client.connect()

    const trip = await trips.findOne({
        'pickUp.address': pickUp,
        'destination.address': destination 
    })

    if(!trip){
        throw new Error('Viaje no encontrado.')
    }

    return trip
}

async function getByDriverId(id) {
    await client.connect();

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = daysOfWeek[new Date().getDay()];

    const tripsCursor = await trips.find({
        driver_id: new ObjectId(id),
        [`daysAndHours.${today}.isSelected`]: true
    });

    const driverTrips = await tripsCursor.toArray();

    const formatTripData = (trip, today) => {
        const tripData = trip.daysAndHours[today];
        const entryTime = tripData.entryTime;
        const exitTime = tripData.exitTime;

        const currentTime = DateTime.now().setZone('America/Argentina/Buenos_Aires');

        const [entryHour, entryMinute] = entryTime.split(':').map(Number);
        const [exitHour, exitMinute] = exitTime.split(':').map(Number);

        const entryDateTime = currentTime.set({ hour: entryHour, minute: entryMinute, second: 0, millisecond: 0 }).toJSDate();
        const exitDateTime = currentTime.set({ hour: exitHour, minute: exitMinute, second: 0, millisecond: 0 }).toJSDate();

        let finalTime;
        let pickUpLocation, destinationLocation;

        if (currentTime.toJSDate() < entryDateTime) {
            // El viaje aún no ha comenzado
            finalTime = entryTime;
            pickUpLocation = trip.pickUp.address;
            destinationLocation = trip.destination.address;
        } else if (currentTime.toJSDate() >= entryDateTime && currentTime.toJSDate() <= exitDateTime) {
            // El viaje está en curso
            if (currentTime.toJSDate() < new Date((entryDateTime.getTime() + exitDateTime.getTime()) / 2)) {
                finalTime = entryTime;
                pickUpLocation = trip.pickUp.address;
                destinationLocation = trip.destination.address;
            } else {
                finalTime = exitTime;
                pickUpLocation = trip.destination.address;
                destinationLocation = trip.pickUp.address;
            }
        } else {
            // El viaje ya finalizó
            return null; // Eliminar el viaje
        }

        return {
            ...trip,
            finalTime,
            pickUpLocation,
            destinationLocation
        };
    };

    const filteredTrips = driverTrips
        .map(trip => formatTripData(trip, today))
        .filter(trip => trip !== null) // Eliminar viajes finalizados
        .filter(trip => {
            const currentTime = DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate().getTime();
            const entryTime = new Date(`${new Date().toDateString()} ${trip.daysAndHours[today].entryTime}`).getTime();
            const exitTime = new Date(`${new Date().toDateString()} ${trip.daysAndHours[today].exitTime}`).getTime();
            const thirtyMinutesAfterEntry = entryTime + 30 * 60 * 1000;
            const thirtyMinutesAfterExit = exitTime + 30 * 60 * 1000;

            return currentTime <= thirtyMinutesAfterExit; // Mostrar viajes con tolerancia
        })
        .sort((a, b) => {
            const currentTime = DateTime.now().setZone('America/Argentina/Buenos_Aires').toJSDate().getTime();
            const timeA = new Date(`${new Date().toDateString()} ${a.finalTime}`).getTime();
            const timeB = new Date(`${new Date().toDateString()} ${b.finalTime}`).getTime();
            const diffA = Math.abs(currentTime - timeA);
            const diffB = Math.abs(currentTime - timeB);
            return diffA - diffB;
        });

    return filteredTrips;
}

/* 23/02
async function getByDriverId(id)
{
    await client.connect()

    // Obtener el día actual en formato string
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = daysOfWeek[new Date().getDay()]

    // Buscar viajes para el driver_id en el día actual
    const tripsCursor = await trips.find({
        driver_id: new ObjectId(id), // Filtro por driver_id
        [`daysAndHours.${today}.isSelected`]: true // Filtro viajes del día actual
    })

    // Convierte los resultados en un array
    const driverTrips = await tripsCursor.toArray()

    // Función para calcular que información de horario debe mostrarse
    const formatTripData = (trip, today) => {
        const tripData = trip.daysAndHours[today]
        const entryTime = tripData.entryTime
        const exitTime = tripData.exitTime

        const currentTime = new Date()
        const entryDateTime = new Date(`${currentTime.toDateString()} ${entryTime}`);
        const exitDateTime = new Date(`${currentTime.toDateString()} ${exitTime}`);

        let finalTime
        let pickUpLocation, destinationLocation 

        // Comparo que hora está mas cercana del horario actual
        if(Math.abs(exitDateTime - currentTime) < Math.abs(entryDateTime - currentTime)){
            finalTime = exitTime
            pickUpLocation = trip.destination.address // El destino es el nuevo lugar de pickUp
            destinationLocation = trip.pickUp.address // El lugar de retiro es el nuevo destino. 
        } else {
            finalTime = entryTime
            pickUpLocation = trip.pickUp.address 
            destinationLocation = trip.destination.address
        }

        return {
            ...trip,
            finalTime,
            pickUpLocation,
            destinationLocation
        }
    }

    // Modificar cada viaje para devolver los datos relevantes
    const filteredTrips = driverTrips.map(trip => formatTripData(trip, today))

    return filteredTrips
}*/

async function getFilteredTrips(id)
{
    await client.connect()

    const driverAvailability = await availability.findOne({ _id: new ObjectId(id) })

    if(!driverAvailability){
        throw new Error('No tenés disponibilidad cargada.')
    }

    //Convierto la disponibilidad para comparar
    const availabilityMap = driverAvailability.availability.reduce((map, slot) => {
        map[slot.day] = { from: new Date(`1970-01-01T${slot.from}:00.000Z`), to: new Date(`1970-01-01T${slot.to}:00.000Z`) }
        return map
    }, {})

    //Busco los viajes
    const trips = await getAll()

    const filteredTrips = trips.filter(trip => {
        let matchesAvailability = true 
        
        for (const day in trip.daysAndHours){
            if(trip.daysAndHours[day].isSelected){
                const tripStart = new Date(`1970-01-01T${trip.daysAndHours[day].entryTime}:00.000Z`)
                const tripEnd = new Date(`1970-01-01T${trip.daysAndHours[day].exitTime}:00.000Z`)

                const driverSlot = availabilityMap[day]

                // Check if driverSlot exists before accessing its properties
                if (driverSlot) {
                    if (!(tripStart >= driverSlot.from && tripEnd <= driverSlot.to)) {
                        matchesAvailability = false;
                        break;
                    }
                } else {
                    // Driver has no availability for this day in the trip
                    matchesAvailability = false;
                    break;
                }
            }
        }
        return matchesAvailability
    })

    return filteredTrips
}

async function updateTrip(id, tripData)
{
    await client.connect()

    let newTripData = {}

    if(tripData.pickUp){
        newTripData = {
            pickUp: tripData.pickUp,
            destination: tripData.destination,
            daysAndHours: tripData.daysAndHours
        }
    } else if(tripData.hasTransfer) {
        newTripData = {
            hasTransfer: tripData.hasTransfer
        }
    } else {
        newTripData = {
            hasTransfer: tripData.hasTransfer
        }
    }

    const trip = await trips.findOne({ passenger_id: new ObjectId(id) })

    if(!trip){
        throw new Error('Este usuario no tiene un viaje generado.')
    }

    return trips.updateOne(
        { passenger_id: new ObjectId(id) },
        { $set: newTripData }
    )
}

async function updateExtraInfoTrip(passengerId, extraData)
{
    await client.connect()

    const updateFields = {}
    if(extraData.hasOwnProperty("hasTransfer")){
        updateFields.hasTransfer = extraData.hasTransfer
    }
    if(extraData.hasOwnProperty("wheelchair")){
        updateFields.wheelchair = extraData.wheelchair
    }
    if(extraData.hasOwnProperty("assistance")){
        updateFields.assistance = extraData.assistance
    }
    
    return await trips.updateOne(
        { passenger_id: new ObjectId(passengerId) },
        { $set: updateFields }
    )
}

async function updatePassengerInfo(passengerId, updatedData)
{
    await client.connect()

    const updateFields = {}
    if(updatedData.avatar){
        updateFields.avatar = updatedData.avatar
    }
    if(updatedData.name){
        updateFields.name = updatedData.name
    }
    if(updatedData.lastname){
        updateFields.lastname = updatedData.lastname
    }

    const updateResult = await trips.updateOne(
        { passenger_id: new ObjectId(passengerId) },
        { $set: updateFields }
    )

    return updateResult
}

async function addDriver(driverId, tripId)
{
    await client.connect()

    const trip = await trips.findOne({ _id: new ObjectId(tripId) })

    if(!trip){
        throw new Error('Viaje inexistente.')
    }

    if(trip.driver_id){
        throw new Error('El viaje ya tiene un transportista asignado.')
    }

    const updateDriver = await trips.updateOne(
        { _id: new ObjectId(tripId) },
        { 
            $set: { 
                driver_id: new ObjectId(driverId),
                hasTransfer: true
            } 
        }
    )

    return updateDriver
}

export{
    getAll,
    createTrip,
    getByPassengerId,
    getByAddress,
    getByDriverId,
    getFilteredTrips,
    updateTrip,
    updateExtraInfoTrip,
    updatePassengerInfo,
    addDriver
}