import * as vehicleSchema from '../schemas/vehicle.schemas.js'

async function validateVehicle(req, res, next)
{
    return vehicleSchema.vehicle.validate(req.body, { abortEarly: false })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

export{
    validateVehicle
}