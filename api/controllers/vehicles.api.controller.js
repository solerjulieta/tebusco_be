import * as vehicleService from '../../services/vehicles.service.js'

async function getAll(req, res)
{
    vehicleService.getAll()
        .then(function(vehicles){
            res.status(200).json(vehicles)
        })
}

export{
    getAll
}