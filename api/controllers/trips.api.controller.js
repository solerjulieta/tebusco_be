import * as tripService from '../../services/trips.service.js'

async function getAll(req, res)
{
    tripService.getAll()
        .then(function(trips){
            res.status(200).json(trips)
        })
        .catch(function(err) {
            res.status(400).json({ error: { msg: 'No hay solicitudes de traslado.' } })
        })
}

async function createTrip(req, res)
{
    const selectedDays = Object.entries(req.body.days)
    .filter(([day, data]) => data.isSelected) // Filtro solo los días seleccionados
    .reduce((acc, [day, data]) => {
        acc[day] = {
            isSelected: data.isSelected,
            entryTime: data.entryTime,
            exitTime: data.exitTime
        }
        return acc
    }, {})

    const id = req.params.id
    const role = req.body.role
    const tripData = {
        pickUp: req.body.pickUp,
        destination: req.body.destination,
        daysAndHours: selectedDays
    }

    tripService.createTrip(role, id, tripData)
        .then(() => {
            res.status(201).json({ msg: 'Solicitud de viaje creada con éxito.' })
        })
        .catch(function(err){
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function getByPassengerId(req, res)
{
    const id = req.params.id

    tripService.getByPassengerId(id)
        .then(function(trip){
            if(trip){
                res.status(200).json(trip)
            } else {
                res.status(400).json({ error: { msg: err.message } })
            }
        })
        .catch(function(err){
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function getByAddress(req, res)
{
    const pickUp = req.params.pickUp
    const destination = req.params.destination

    tripService.getByAddress(pickUp, destination)
        .then(function(trip){
            if(trip){
                res.status(200).json(trip)
            } else {
                res.status(400).json({ error: { msg: 'Viaje no encontrado.' } })
            }
        })
        .catch(function(err){
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function getByDriverId(req, res)
{
    const id = req.params.id

    tripService.getByDriverId(id)
        .then(function(trips){
            res.status(200).json(trips)
        })
        .catch(function(err){
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function getFilteredTrips(req, res)
{
    const id = req.params.id

    tripService.getFilteredTrips(id)
        .then(function(trips){
            res.status(200).json(trips)
        })
        .catch(function(err){
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function updateTrip(req, res)
{
    const tripId = req.params.id
    const tripData = req.body

    tripService.updateTrip(tripId, tripData)
    .then(() => {
        res.status(200).json({ msg: 'Solicitud de viaje actualizada.' })
    })
    .catch((err) => {
        res.status(500).json({ error: { msg: err.message } })
    }) 
}

async function updateExtraInfoTrip(req, res)
{
    const passengerId = req.params.id
    const extraData = {}

    if(req.body.hasTransfer !== undefined){
        extraData.hasTransfer = req.body.hasTransfer
    }
    if(req.body.wheelchair !== undefined){
        extraData.wheelchair = req.body.wheelchair
    }
    if(req.body.assistance !== undefined){
        extraData.assistance = req.body.assistance
    }

    tripService.updateExtraInfoTrip(passengerId, extraData)
        .then(() => {
            res.status(200).json({ msg: 'Solicitud de viaje actualizada.' })
        })
        .catch((err) => {
            res.status(500).json({ error: { msg: err.message } })
        })
}

async function addDriver(req, res)
{
    const driverId = req.params.id
    const tripId = req.params.tripId

    tripService.addDriver(driverId, tripId)
        .then(() => {
            res.status(200).json({ msg: 'Traslado añadido con éxito.' })
        })
        .catch((err) => {
            res.status(500).json({ error: { msg: err.message } })
        })
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
    addDriver
}