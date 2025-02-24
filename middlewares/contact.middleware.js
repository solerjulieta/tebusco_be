import * as contactSchemas from '../schemas/contact.schemas'

async function validateContact(req, res, next)
{
    return contactSchemas.contact.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

export{
    validateContact
}