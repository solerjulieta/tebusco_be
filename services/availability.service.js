import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient('mongodb://127.0.0.1:27017')
const db = client.db('DB_TB')
const availability = db.collection('availability')

async function create(id, newSchedule)
{
    await client.connect()

    const driverAvailability = await availability.findOne({ _id: new ObjectId(id) })

    if(driverAvailability){
        // Filtrar para agregar solo los horarios que no estén duplicados
        const nonDuplicateSchedules = newSchedule.filter(newItem => {
            return !driverAvailability.availability.some(existingItem => 
                existingItem.day === newItem.day &&
                existingItem.from === newItem.from &&
                existingItem.to === newItem.to
            );
        });

        if(nonDuplicateSchedules.length > 0){
            return await availability.updateOne(
                { _id: new ObjectId(id) },
                { $push: { availability: { $each: nonDuplicateSchedules } } }
            )
        } else {
            throw new Error('Ya existen los horarios enviados.')
        }

    } else {
        return await availability.insertOne({ _id: new ObjectId(id), availability: newSchedule })
    }
}

async function getByDriverId(id)
{
    await client.connect()
    return availability.findOne({ _id: new ObjectId(id) })
}

async function deleteSchedule(id, deletedSchedules)
{
    await client.connect()

    const scheduleDocument = await getByDriverId(id)

    if(!scheduleDocument){
        throw new Error('No existe un horario para este conductor.')
    }

    let updatedAvailability = [...scheduleDocument.availability]

    for (let schedule of deletedSchedules){
        const { day, from, to } = schedule

        // Filtra el array localmente para simular la eliminación del elemento
        updatedAvailability = updatedAvailability.filter(
            (item) => !(item.day === day && item.from === from && item.to === to)
        )

        // Si después de eliminar, el array tiene 1 o menos elementos, elimina el documento completo
        if (scheduleDocument.availability.length === 1 && updatedAvailability.length === 0) {
            await availability.deleteOne({ _id: new ObjectId(id) })
            return // Detén el proceso, ya que el documento fue eliminado
        }
    }

    // Si el array aún tiene elementos, actualízalo en la base de datos
    if (updatedAvailability.length > 0) {
        await availability.updateOne(
            { _id: new ObjectId(id) },
            { $set: { availability: updatedAvailability } }
        )
    }
}

export{
    create,
    getByDriverId,
    deleteSchedule
}