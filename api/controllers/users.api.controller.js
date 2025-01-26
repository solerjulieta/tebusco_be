import * as accountService from '../../services/account.service.js'

async function updateEmail(req, res)
{
    const id = req.params.id 
    const updatedEmail = req.body.email

    accountService.updateEmail(id, updatedEmail)
        .then(() => {
            res.status(200).json({ msg: 'Email actualizado.' })
        })
        .catch((err) => {
            res.status(500).json({ error: { msg: err.message } })
        })
}

async function updatePassword(req, res)
{
    const id = req.params.id
    const { currentPassword, newPassword } = req.body

    accountService.updatePassword(id, currentPassword, newPassword)
        .then(() => {
            res.status(200).json({ msg: 'Contraseña actualizada.' })
        })
        .catch((err) => {
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function reqPasswordReset(req, res)
{
    const email = req.body.email
    const userType = req.expectedRole

    accountService.reqPasswordReset(email, userType)
        .then(() => {
            res.status(200).json({ msg: 'Se envió un email.' })
        })
        .catch((err) => {
            res.status(400).json({ error: { msg: err.message } })
        })
}

async function resetPassword(req, res)
{
    const token = req.params.token
    const newPassword = req.body.newPassword

    accountService.resetPassword(token, newPassword)
    .then(() => {
        res.status(200).json({ msg: 'Tu clave se reseteó correctamente.' })
    })
    .catch((err) => {
        res.status(500).json({ error: { msg: err.message } })
    })
}

export{
    updateEmail,
    updatePassword,
    reqPasswordReset,
    resetPassword
}