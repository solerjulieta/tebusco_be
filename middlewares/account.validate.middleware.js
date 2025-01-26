import * as accountSchemas from '../schemas/account.schemas.js'

async function validateLogin(req, res, next)
{
    return accountSchemas.login.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

async function validateEmail(req, res, next)
{
    return accountSchemas.emailSchema.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

async function validatePassword(req, res, next)
{
    return accountSchemas.passwordSchema.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

async function validateResetPassword(req, res, next)
{
    return accountSchemas.resetPasswordSchema.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then((data) => {
            req.body = data
            next()
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

export{
    validateLogin,
    validateEmail,
    validatePassword,
    validateResetPassword
}