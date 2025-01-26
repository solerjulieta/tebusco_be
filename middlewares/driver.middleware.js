import * as driverSchemas from '../schemas/driver.schemas.js'

async function validateRegister(req, res, next)
{
    const authorizationFile = req.file 

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