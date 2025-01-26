import * as driversVehiclesService from '../../services/driversVehicles.service.js'

async function updateVehicle(req, res)
{
    const driverId = req.params.id

    const vehicleData = {
        licensePlate: req.body.licensePlate,
        brand: req.body.brand,
        model: req.body.model,
    }

    //let accessData = {}

    //console.log("req.body", req.body)

    /*
    if(req.body.wheelchair !== undefined){
        console.log("El valor que llega", req.body.wheelchair)
        accessData.wheelchair = req.body.wheelchair
        console.log("AccessData", accessData)
    }
    if(req.body.ramp !== undefined){
        console.log("El valor que llega", req.body.ramp)
        accessData.ramp = req.body.ramp
    }*/

    const licensePlate = req.body.licensePlate

    driversVehiclesService.getByLicensePlate(licensePlate)
        .then(vehicle => {
            if(vehicle){
                return driversVehiclesService.addDriverId(driverId, licensePlate)
            } else {
                return driversVehiclesService.create(driverId, vehicleData)
            }
        })
        .then(() => {
            res.status(200).json({ msg: 'Información actualizada.' })
        })
        .catch((err) => {
            res.status(500).json({ error: err.message })
        })
}

async function updateAccessData(req, res)
{
    const driverId = req.params.id
    const licensePlate = req.body.licensePlate
    let accessData = {}

    if(req.body.wheelchair !== undefined){
        console.log("El valor que llega", req.body.wheelchair)
        accessData.wheelchair = req.body.wheelchair
        console.log("AccessData", accessData)
    }
    if(req.body.ramp !== undefined){
        console.log("El valor que llega", req.body.ramp)
        accessData.ramp = req.body.ramp
    }

    driversVehiclesService.updateAccessData(driverId, accessData, licensePlate)
    .then(() => {
        res.status(200).json({ msg: "Información actualizada." })
    })
    .catch((err) => {
        res.status(500).json({ error: err.message })
    })

}

async function deleteVehicle(req, res)
{
    const driverId = req.params.id

    driversVehiclesService.deleteVehicle(driverId)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ error: err.message })
    })
}

export{
    updateVehicle,
    updateAccessData,
    deleteVehicle
}