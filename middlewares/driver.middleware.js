import * as driverSchemas from '../schemas/driver.schemas.js'

async function validateRegister(req, res, next)
{
    if(req.fileValidationError){
        return res.status(400).json({ error: { msg: req.fileValidationError } })
    }

    if (req.uploadType === 'driverAuth' && !req.file) {
        return res.status(400).json({ error: { msg: 'La habilitación es requerida para el registro.' } });
    }
    /*
    const authorizationFile = req.file

    if (!authorizationFile) {
        return res.status(400).json({ error: { msg: 'La habilitación es obligatoria' } })
    }*/

    req.body.authorization = authorizationFile ? authorizationFile.mimetype : null
    
    return driverSchemas.register.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data;
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

async function validateProfileInformation(req, res, next)
{
    if(req.body.formType === 'profileInformation'){
        return driverSchemas.profileInformation.validate(req.body, { abortEarly: false, stripUnknown: true })
            .then((data) => {
                req.body = data
                next()
            })
            .catch((error) => {
                res.status(400).json({ error })
            })
    } else {
        return driverSchemas.personalInformation.validate(req.body, { abortEarly: false, stripUnknown: true })
            .then((data) => {
                req.body = data
                next()
            })
            .catch((error) => {
                res.status(400).json({ error })
            })
    }
}

export{
    validateRegister,
    validateProfileInformation,
}