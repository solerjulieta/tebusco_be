import * as availabilityService from '../../services/availability.service.js'

async function create(req, res)
{
    const id = req.params.id
    const { newSchedules, deletedSchedules } = req.body

    console.log(deletedSchedules)

    if(deletedSchedules.length > 0){
        await availabilityService.deleteSchedule(id, deletedSchedules)
        .then(function(){
            res.status(200).json({ msg: 'Disponibilidad actualizada.' })
        })
        .catch(err => {
            res.status(400).json({ error: { msg: err.message } })
        }) 
    }

    if(newSchedules.length > 0){
        await availabilityService.create(id, newSchedules)
        .then(function(schedule){
            res.status(201).json(schedule)
        })
        .catch((error) => {
            res.status(400).json({ error: { msg: error.message } })
        })
    }
}

async function getByDriverId(req, res)
{
    const id = req.params.id

    availabilityService.getByDriverId(id)
    .then(function(schedule){
        if(schedule){
            res.status(200).json(schedule)
        } else {
            res.status(404).json({ error: { msg: 'No tiene horarios cargados.' } })
        }
    })
}

export{
    create,
    getByDriverId
}